const blockedImageWords = [
  "logo",
  "avatar",
  "avatar-v",
  "profile",
  "profile_pic",
  "portrait",
  "banner",
  "hero",
  "icon",
  "placeholder",
  "default",
  "rsrc.php",
  "t51.2885-19",
  "t51.82787-19",
  "s100x100",
  "line_add_friends",
  "/btn/",
];

const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

export function normalizeImageUrl(imageUrl: string, baseUrl: string) {
  try {
    return new URL(imageUrl, baseUrl).toString();
  } catch {
    return undefined;
  }
}

export function isLikelyProductImage(imageUrl: string) {
  let filename: string;
  let pathname = imageUrl.toLowerCase();
  try {
    const parsed = new URL(imageUrl);
    pathname = parsed.pathname.toLowerCase();
    filename = (pathname.split("/").pop() ?? "").toLowerCase();
  } catch {
    filename = imageUrl.toLowerCase();
  }

  const base = filename.split("?")[0] ?? filename;
  const hasImageExtension = imageExtensions.some((ext) => base.endsWith(ext));
  const haystack = `${pathname} ${imageUrl.toLowerCase()}`;
  const hasBlockedWord = blockedImageWords.some((word) =>
    haystack.includes(word),
  );

  return hasImageExtension && !hasBlockedWord;
}

export function pickProductImageUrls(imageUrls: string[], baseUrl: string) {
  const dedupedUrls = new Set<string>();

  for (const imageUrl of imageUrls) {
    const normalizedUrl = normalizeImageUrl(imageUrl, baseUrl);

    if (!normalizedUrl || !isLikelyProductImage(normalizedUrl)) {
      continue;
    }

    dedupedUrls.add(normalizedUrl);
  }

  return Array.from(dedupedUrls).slice(0, 2);
}
