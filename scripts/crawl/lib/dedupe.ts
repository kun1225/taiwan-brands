import type { BrandCandidate, OfficialUrlType } from "./schema";

// Platforms where many unrelated brands share the same root domain.
// For these, we key by full path rather than just the host.
const SHARED_HOST_SUFFIXES = new Set([
  "myshopify.com",
  "wix.com",
  "wixsite.com",
  "blogspot.com",
  "square.site",
  "cargo.site",
  "weebly.com",
  "godaddysites.com",
  "mystrikingly.com",
  "webflow.io",
  "netlify.app",
  "vercel.app",
]);

function isSharedHost(host: string) {
  return (
    SHARED_HOST_SUFFIXES.has(host) ||
    [...SHARED_HOST_SUFFIXES].some((suffix) => host.endsWith(`.${suffix}`))
  );
}

function keyFromUrl(value: string | undefined, type?: OfficialUrlType) {
  if (!value) {
    return undefined;
  }

  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");
    const pathKey = `${host}${url.pathname}`.replace(/\/$/, "");

    if (
      type === "marketplace" ||
      type === "instagram" ||
      type === "threads" ||
      isSharedHost(host)
    ) {
      return `url:${pathKey.toLowerCase()}`;
    }

    return `url:${host}`;
  } catch {
    return undefined;
  }
}

function keyFromName(prefix: string, value: string | undefined) {
  const cleaned = value?.replace(/\s+/g, "").toLowerCase();
  return cleaned ? `${prefix}:${cleaned}` : undefined;
}

function getCandidateKeys(candidate: BrandCandidate) {
  return [
    keyFromUrl(candidate.website),
    keyFromUrl(candidate.officialUrl, candidate.officialUrlType),
    keyFromName("company", candidate.companyName),
    keyFromName("brand", candidate.brandName),
  ].filter((key): key is string => Boolean(key));
}

function mergeCandidates(
  existing: BrandCandidate,
  next: BrandCandidate,
): BrandCandidate {
  const productImageUrls = Array.from(
    new Set([...existing.productImageUrls, ...next.productImageUrls]),
  ).slice(0, 2);
  const evidenceTags = Array.from(
    new Set([...existing.evidenceTags, ...next.evidenceTags]),
  );
  const mainProducts = Array.from(
    new Set(
      [existing.mainProducts, next.mainProducts]
        .filter((value): value is string => Boolean(value))
        .flatMap((value) => value.split(/[、,，]/).map((item) => item.trim()))
        .filter(Boolean),
    ),
  )
    .slice(0, 5)
    .join("、");

  return {
    ...existing,
    companyName: existing.companyName ?? next.companyName,
    mainProducts: mainProducts || undefined,
    productImageUrls,
    website: existing.website ?? next.website,
    officialUrl: existing.officialUrl ?? next.officialUrl,
    officialUrlType: existing.officialUrlType ?? next.officialUrlType,
    city: existing.city ?? next.city,
    category: existing.category ?? next.category,
    sourceUrl: existing.sourceUrl,
    evidenceTags,
    confidence:
      existing.confidence === "high" || next.confidence === "high"
        ? "high"
        : existing.confidence === "medium" || next.confidence === "medium"
          ? "medium"
          : "low",
  };
}

export function dedupeBrandCandidates(candidates: BrandCandidate[]) {
  const keyToIndex = new Map<string, number>();
  const deduped: BrandCandidate[] = [];

  for (const candidate of candidates) {
    const keys = getCandidateKeys(candidate);
    const existingIndex = keys
      .map((key) => keyToIndex.get(key))
      .find((index): index is number => index !== undefined);

    if (existingIndex === undefined) {
      const nextIndex = deduped.length;
      deduped.push(candidate);
      keys.forEach((key) => keyToIndex.set(key, nextIndex));
      continue;
    }

    deduped[existingIndex] = mergeCandidates(deduped[existingIndex], candidate);
    getCandidateKeys(deduped[existingIndex]).forEach((key) => {
      if (!keyToIndex.has(key)) {
        keyToIndex.set(key, existingIndex);
      }
    });
  }

  return deduped;
}
