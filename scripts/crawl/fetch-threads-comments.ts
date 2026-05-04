import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const threadShortcodes = [
  "DL9QBn6B8ux",
  "DHgpAtQvy38",
  "DQqjvNFE_Kp",
  "DFjk5lASsys",
  "DHckBsthazV",
] as const;

const apiBaseUrl = "https://api.keyapi.ai/v1/threads";
const outputDir = path.join(process.cwd(), "data", "raw");

type JsonObject = Record<string, unknown>;

type KeyApiEnvelope = {
  code?: number;
  message?: string;
  data?: unknown;
};

type ThreadPost = {
  shortcode: string;
  postId: string;
  url: string;
  text: string;
  username: string;
  replyCount: number | null;
};

type ThreadComment = {
  sourceShortcode: string;
  sourcePostId: string;
  sourcePostUrl: string;
  commentId: string;
  parentCommentId: string;
  username: string;
  fullName: string;
  text: string;
  createdAt: string;
  likeCount: number | null;
  replyCount: number | null;
  depth: number | null;
};

function cleanText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function getNestedValue(
  input: JsonObject | undefined,
  candidatePaths: string[][],
): unknown {
  for (const pathParts of candidatePaths) {
    let current: unknown = input;

    for (const pathPart of pathParts) {
      if (!current || typeof current !== "object" || Array.isArray(current)) {
        current = undefined;
        break;
      }

      current = (current as JsonObject)[pathPart];
    }

    if (
      current !== undefined &&
      current !== null &&
      !(typeof current === "string" && current.trim() === "")
    ) {
      return current;
    }
  }

  return undefined;
}

function readString(
  input: JsonObject | undefined,
  candidatePaths: string[][],
  fallback = "",
) {
  const value = getNestedValue(input, candidatePaths);

  if (typeof value === "string") {
    return cleanText(value);
  }

  if (typeof value === "number") {
    return String(value);
  }

  return fallback;
}

function readNullableNumber(
  input: JsonObject | undefined,
  candidatePaths: string[][],
) {
  const value = getNestedValue(input, candidatePaths);

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsedValue = Number(value);

    if (Number.isFinite(parsedValue)) {
      return parsedValue;
    }
  }

  return null;
}

function readArray(
  input: JsonObject | undefined,
  candidatePaths: string[][],
): unknown[] {
  const value = getNestedValue(input, candidatePaths);
  return Array.isArray(value) ? value : [];
}

function findObjectInArray(
  input: JsonObject | undefined,
  arrayPaths: string[][],
  predicate: (item: JsonObject) => boolean,
) {
  for (const arrayPath of arrayPaths) {
    const items = readArray(input, [arrayPath]);

    for (const item of items) {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        continue;
      }

      const objectItem = item as JsonObject;

      if (predicate(objectItem)) {
        return objectItem;
      }
    }
  }

  return undefined;
}

function readCursor(data: JsonObject | undefined) {
  const cursor = getNestedValue(data, [
    ["next_cursor"],
    ["cursor"],
    ["page_info", "end_cursor"],
    ["pagination", "next_cursor"],
    ["pagination", "cursor"],
  ]);

  return typeof cursor === "string" && cursor.trim() !== "" ? cursor : null;
}

function ensureObject(value: unknown, errorMessage: string) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(errorMessage);
  }

  return value as JsonObject;
}

async function readKeyApiKey() {
  const envKey = process.env.KEY_API_KEY?.trim();

  if (envKey) {
    return envKey;
  }

  const envPath = path.join(process.cwd(), ".env");

  try {
    const envContent = await readFile(envPath, "utf8");

    for (const line of envContent.split(/\r?\n/)) {
      const trimmedLine = line.trim();

      if (!trimmedLine || trimmedLine.startsWith("#")) {
        continue;
      }

      const separatorIndex = trimmedLine.indexOf("=");

      if (separatorIndex === -1) {
        continue;
      }

      const key = trimmedLine.slice(0, separatorIndex).trim();
      const rawValue = trimmedLine.slice(separatorIndex + 1).trim();

      if (key !== "KEY_API_KEY") {
        continue;
      }

      const value = rawValue.replace(/^['"]|['"]$/g, "").trim();

      if (value) {
        return value;
      }
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }

  throw new Error("Missing KEY_API_KEY in process.env or .env");
}

async function fetchKeyApi(
  apiKey: string,
  endpoint: string,
  query: Record<string, string>,
) {
  const url = new URL(`${apiBaseUrl}/${endpoint}`);

  for (const [key, value] of Object.entries(query)) {
    url.searchParams.set(key, value);
  }

  let response: Response;

  try {
    response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
  } catch (error) {
    throw new Error(
      `Failed to fetch ${url.pathname}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(
      `KeyAPI ${url.pathname} failed with ${response.status}: ${responseText}`,
    );
  }

  const json = (await response.json()) as KeyApiEnvelope;

  if (json.code !== undefined && json.code !== 0) {
    throw new Error(
      `KeyAPI ${url.pathname} returned code ${json.code}: ${json.message ?? "unknown error"}`,
    );
  }

  return ensureObject(
    json.data,
    `KeyAPI ${url.pathname} returned no data object`,
  );
}

async function fetchThreadPost(apiKey: string, shortcode: string) {
  const lookupCandidates: Array<{
    endpoint: string;
    query: Record<string, string>;
  }> = [
    { endpoint: "fetch_post_detail", query: { shortcode } },
    {
      endpoint: "fetch_post_detail",
      query: { url: `https://www.threads.com/t/${shortcode}` },
    },
    {
      endpoint: "fetch_post_detail",
      query: { url: `https://www.threads.net/@i/post/${shortcode}` },
    },
  ];

  let lastError: Error | null = null;

  for (const candidate of lookupCandidates) {
    try {
      const data = await fetchKeyApi(
        apiKey,
        candidate.endpoint,
        candidate.query,
      );
      const matchedPost =
        findObjectInArray(
          data,
          [["posts"], ["items"], ["data"], ["list"]],
          (item) =>
            readString(item, [["code"], ["shortcode"], ["post_code"]]) ===
            shortcode,
        ) ?? data;
      const postId = readString(matchedPost, [
        ["pk"],
        ["id"],
        ["post_id"],
        ["media_id"],
      ]);

      if (!postId) {
        throw new Error("Post detail response did not include a post id");
      }

      return {
        shortcode,
        postId,
        url:
          readString(matchedPost, [["url"], ["permalink"]]) ||
          `https://www.threads.com/t/${shortcode}`,
        text: readString(matchedPost, [
          ["text"],
          ["caption"],
          ["caption", "text"],
          ["thread_items", "0", "post", "caption", "text"],
        ]),
        username: readString(matchedPost, [
          ["username"],
          ["user", "username"],
          ["owner", "username"],
        ]),
        replyCount: readNullableNumber(matchedPost, [
          ["reply_count"],
          ["replies_count"],
          ["direct_reply_count"],
          ["text_post_app_info", "direct_reply_count"],
        ]),
      } satisfies ThreadPost;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  throw new Error(
    `Unable to resolve shortcode ${shortcode}: ${lastError?.message ?? "unknown error"}`,
  );
}

function mapCommentRecord(
  item: JsonObject,
  source: ThreadPost,
  defaultDepth: number | null,
) {
  const commentId = readString(item, [
    ["id"],
    ["pk"],
    ["comment_id"],
    ["media_id"],
  ]);
  const normalizedCommentId = readString(item, [
    ["pk"],
    ["comment_id"],
    ["media_id"],
    ["id"],
  ]);

  if (!normalizedCommentId) {
    return null;
  }

  return {
    sourceShortcode: source.shortcode,
    sourcePostId: source.postId,
    sourcePostUrl: source.url,
    commentId: normalizedCommentId,
    parentCommentId: readString(item, [
      ["parent_comment_id"],
      ["parent_id"],
      ["in_reply_to_id"],
    ]),
    username: readString(item, [
      ["username"],
      ["user", "username"],
      ["owner", "username"],
    ]),
    fullName: readString(item, [
      ["full_name"],
      ["user", "full_name"],
      ["user", "name"],
      ["owner", "full_name"],
      ["owner", "name"],
    ]),
    text: readString(item, [
      ["text"],
      ["content"],
      ["caption", "text"],
      ["reply", "text"],
    ]),
    createdAt: readString(item, [
      ["created_at"],
      ["created_time"],
      ["taken_at"],
      ["timestamp"],
    ]),
    likeCount: readNullableNumber(item, [
      ["like_count"],
      ["likes"],
      ["likeCount"],
    ]),
    replyCount: readNullableNumber(item, [
      ["reply_count"],
      ["replies_count"],
      ["child_comment_count"],
    ]),
    depth: readNullableNumber(item, [["depth"], ["level"]]) ?? defaultDepth,
  } satisfies ThreadComment;
}

function extractCommentRecords(data: JsonObject, source: ThreadPost) {
  const edgeItems = readArray(data, [["edges"]]).flatMap((edge) => {
    if (!edge || typeof edge !== "object" || Array.isArray(edge)) {
      return [];
    }

    const edgeObject = edge as JsonObject;
    const node = getNestedValue(edgeObject, [["node"]]);

    if (!node || typeof node !== "object" || Array.isArray(node)) {
      return [];
    }

    return readArray(node as JsonObject, [["thread_items"]])
      .map((threadItem) => {
        if (
          !threadItem ||
          typeof threadItem !== "object" ||
          Array.isArray(threadItem)
        ) {
          return null;
        }

        const post = getNestedValue(threadItem as JsonObject, [["post"]]);

        if (!post || typeof post !== "object" || Array.isArray(post)) {
          return null;
        }

        return post as JsonObject;
      })
      .filter((post): post is JsonObject => Boolean(post));
  });

  if (edgeItems.length > 0) {
    return edgeItems
      .map((item) => mapCommentRecord(item, source, null))
      .filter((comment): comment is ThreadComment => Boolean(comment))
      .filter((comment) => comment.sourcePostId !== comment.commentId);
  }

  const listCandidates = [
    readArray(data, [["comments"]]),
    readArray(data, [["replies"]]),
    readArray(data, [["items"]]),
    readArray(data, [["data"]]),
    readArray(data, [["list"]]),
  ].find((items) => items.length > 0);

  if (!listCandidates) {
    return [];
  }

  return listCandidates
    .map((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return null;
      }

      return mapCommentRecord(item as JsonObject, source, null);
    })
    .filter((comment): comment is ThreadComment => Boolean(comment));
}

async function fetchAllComments(apiKey: string, source: ThreadPost) {
  const comments: ThreadComment[] = [];
  let cursor: string | null = null;
  let page = 0;

  do {
    page += 1;

    const data = await fetchKeyApi(apiKey, "fetch_post_comments", {
      post_id: source.postId,
      ...(cursor ? { cursor } : {}),
    });
    const pageComments = extractCommentRecords(data, source);

    comments.push(...pageComments);
    cursor = readCursor(data);

    if (pageComments.length === 0) {
      break;
    }
  } while (cursor);

  return comments;
}

async function main() {
  const apiKey = await readKeyApiKey();
  await mkdir(outputDir, { recursive: true });

  const posts: ThreadPost[] = [];
  const comments: ThreadComment[] = [];

  for (const shortcode of threadShortcodes) {
    const post = await fetchThreadPost(apiKey, shortcode);
    const postComments = await fetchAllComments(apiKey, post);

    posts.push(post);
    comments.push(...postComments);
    console.info(
      `Fetched ${postComments.length} comments from ${shortcode} (${post.postId}).`,
    );
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    posts,
    comments,
  };

  await writeFile(
    path.join(outputDir, "threads-comments-payload.json"),
    `${JSON.stringify(payload, null, 2)}\n`,
    "utf8",
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
