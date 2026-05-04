import { readFile } from "node:fs/promises";
import path from "node:path";

import { inferMainProducts } from "../lib/product-inference";
import type { CrawlSource, EvidenceTag, RawBrandRecord } from "../lib/schema";
import { enrichRecordWithFetchedImages } from "../lib/social-image-enrichment";
import { cleanText } from "../lib/text";
import { getOfficialUrlType } from "../lib/url-utils";

const sourceFile = path.join(
  process.cwd(),
  "data",
  "raw",
  "threads-comments-payload.json",
);

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

export type ThreadsCommentsPayload = {
  generatedAt: string;
  posts: ThreadPost[];
  comments: ThreadComment[];
};

const brandSignalPattern =
  /我們是|我們想要自薦|自薦|品牌|台灣製|台灣生產|台灣設計|MIT|工廠|工作室|官網|專賣|推薦|推這間|這家|手工/;
const selfIntroPattern =
  /我們是|自薦|我們在這裡|想推薦自己|我我我|這裡有個|這兒|小小推薦自己/u;
const recommendationPattern = /推薦|推這間|這家|筆記/u;
const genericBrandPattern =
  /^(?:來自|台灣|最近|新的|一家|土生土長|愛臺灣|愛台灣|我們|由|主要|只有|純|最近剛創立的)/u;

function extractUrls(text: string) {
  return Array.from(text.matchAll(/https?:\/\/[^\s)]+/g), (match) =>
    match[0].replace(/[，。！？、]+$/u, ""),
  );
}

function normalizeUrl(url: string) {
  try {
    const parsed = new URL(url);
    parsed.hash = "";

    if (
      parsed.hostname.includes("facebook.com") &&
      parsed.pathname.startsWith("/share/")
    ) {
      return undefined;
    }

    if (
      parsed.hostname.includes("threads.com") &&
      parsed.pathname.startsWith("/@")
    ) {
      parsed.search = "";
    }

    return parsed.toString();
  } catch {
    return undefined;
  }
}

function extractHandleFromThreadsUrl(url: string) {
  try {
    const parsed = new URL(url);
    const matchedHandle = parsed.pathname.match(/^\/@([^/]+)/)?.[1];
    return matchedHandle?.trim();
  } catch {
    return undefined;
  }
}

function normalizeBrandName(value: string) {
  return cleanText(
    value
      .replace(/^(@+)/, "")
      .replace(
        /\s*(?:襪子|鞋子|包包|皮件|飾品|吊扇|家具|傢俱|剪刀|工具|家飾品|枕頭套)$/u,
        "",
      )
      .replace(/[！!～~：:，,。.\-]+$/u, "")
      .replace(/\s*品牌$/u, "")
      .replace(/\s*專賣店$/u, "")
      .replace(/^[~～\-－]+/u, "")
      .trim(),
  );
}

function isGenericBrandName(value: string | undefined) {
  if (!value) {
    return true;
  }

  const normalized = normalizeBrandName(value);

  if (!normalized) {
    return true;
  }

  if (genericBrandPattern.test(normalized)) {
    return true;
  }

  if (
    normalized.length >= 8 &&
    /(?:台灣|設計|製造|品牌|公司|工廠|工作室|專賣|手工|手作|家具|傢俱|寵物|眼鏡|裝修|園藝|洗髮)/u.test(
      normalized,
    )
  ) {
    return true;
  }

  return false;
}

function isSelfIntroduction(text: string) {
  return selfIntroPattern.test(text);
}

function extractBrandNameFromText(text: string) {
  const patterns = [
    /我們是\s*([A-Za-z0-9._&+\-\u4e00-\u9fa5 ]{2,40}?)(?:品牌|工作室|工廠|專賣店|，|。|！|!|https?:\/\/|$)/u,
    /推薦(?:我們家)?\s*([A-Za-z0-9._&+\-\u4e00-\u9fa5 ]{2,40}?)(?:品牌|，|。|！|!|https?:\/\/|$)/u,
    /推這間\s*([A-Za-z0-9._&+\-\u4e00-\u9fa5 ]{2,40}?)(?:品牌|，|。|！|!|https?:\/\/|$)/u,
  ];

  for (const pattern of patterns) {
    const matched = text.match(pattern)?.[1];

    if (matched) {
      const brandName = normalizeBrandName(matched);

      if (brandName) {
        return brandName;
      }
    }
  }

  return undefined;
}

function deriveBrandNameFromUrl(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host.includes("threads.com") || host.includes("instagram.com")) {
      const handle = parsed.pathname.match(/^\/@?([^/]+)/)?.[1];
      return handle ? normalizeBrandName(handle) : undefined;
    }

    if (host.includes("facebook.com") || host.includes("fb.com")) {
      const handle = parsed.pathname.split("/").filter(Boolean)[0];
      return handle ? normalizeBrandName(handle) : undefined;
    }

    if (host === "linktr.ee") {
      const handle = parsed.pathname.split("/").filter(Boolean)[0];
      return handle ? normalizeBrandName(handle) : undefined;
    }

    const domainParts = host.split(".");
    const hasCountrySuffix =
      domainParts.length >= 3 &&
      (domainParts.at(-1)?.length ?? 0) === 2 &&
      ["com", "net", "org", "co", "edu", "gov"].includes(
        domainParts.at(-2) ?? "",
      );
    const rootDomain = hasCountrySuffix
      ? domainParts.at(-3)
      : domainParts.at(-2);

    if (!rootDomain || ["com", "net", "org", "co"].includes(rootDomain)) {
      return undefined;
    }

    return rootDomain ? normalizeBrandName(rootDomain) : undefined;
  } catch {
    return undefined;
  }
}

function evidenceTagsFor(text: string, officialUrl?: string): EvidenceTag[] {
  const tags = new Set<EvidenceTag>(["D"]);

  if (officialUrl) {
    tags.add("B");
  }

  if (/台灣製|台灣生產|台灣設計|MIT|在地製造|台製/u.test(text)) {
    tags.add("C");
  }

  if (recommendationPattern.test(text)) {
    tags.add("A");
  }

  return Array.from(tags);
}

function shouldKeepComment(comment: ThreadComment) {
  return (
    brandSignalPattern.test(comment.text) ||
    extractUrls(comment.text).length > 0
  );
}

function createRecordFromComment(comment: ThreadComment) {
  if (!shouldKeepComment(comment)) {
    return undefined;
  }

  const text = cleanText(comment.text) ?? "";
  const urls = extractUrls(text)
    .map((url) => normalizeUrl(url))
    .filter((url): url is string => Boolean(url));
  const firstUrl = urls[0];
  const explicitBrandName = extractBrandNameFromText(text);
  const urlBrandName = firstUrl ? deriveBrandNameFromUrl(firstUrl) : undefined;
  const threadsHandle = firstUrl
    ? extractHandleFromThreadsUrl(firstUrl)
    : undefined;
  const usernameBrandName = isSelfIntroduction(text)
    ? normalizeBrandName(comment.username)
    : undefined;
  const brandNameCandidates = [
    explicitBrandName,
    urlBrandName,
    threadsHandle ? normalizeBrandName(threadsHandle) : undefined,
    usernameBrandName,
  ];
  const brandName = brandNameCandidates.find(
    (candidate) => candidate && !isGenericBrandName(candidate),
  );

  if (!brandName) {
    return undefined;
  }

  const officialUrl = firstUrl;
  const officialUrlType = officialUrl
    ? getOfficialUrlType(officialUrl)
    : undefined;
  const description = inferMainProducts(text);

  return {
    sourceName: "threads-comments",
    sourceUrl: comment.sourcePostUrl,
    name: brandName,
    description,
    officialUrl,
    officialUrlType,
    category: "community recommended",
    evidenceTags: evidenceTagsFor(text, officialUrl),
  } satisfies RawBrandRecord;
}

export function extractRawBrandRecordsFromThreadComments(
  payload: ThreadsCommentsPayload,
) {
  const records = payload.comments.flatMap((comment) => {
    const record = createRecordFromComment(comment);
    return record ? [record] : [];
  });

  const dedupedByUrl = new Map<string, RawBrandRecord>();

  for (const record of records) {
    const key = record.officialUrl ?? `${record.sourceUrl}::${record.name}`;

    if (!dedupedByUrl.has(key)) {
      dedupedByUrl.set(key, record);
    }
  }

  return Array.from(dedupedByUrl.values());
}

export const threadsCommentsSource: CrawlSource = {
  name: "threads-comments",
  url: "https://www.threads.com",
  async crawl() {
    const errors: string[] = [];

    try {
      const file = await readFile(sourceFile, "utf8");
      const payload = JSON.parse(file) as ThreadsCommentsPayload;
      const extractedRecords =
        extractRawBrandRecordsFromThreadComments(payload);
      const rawRecords = await Promise.all(
        extractedRecords.map((record) => enrichRecordWithFetchedImages(record)),
      );

      return {
        sourceName: this.name,
        sourceUrl: this.url,
        rawRecords,
        errors,
      };
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));

      return {
        sourceName: this.name,
        sourceUrl: this.url,
        rawRecords: [],
        errors,
      };
    }
  },
};
