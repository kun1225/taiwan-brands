import type { BrandCandidate, RawBrandRecord } from "./schema";

export function scoreConfidence(
  record: RawBrandRecord,
  productImageUrls: string[],
): BrandCandidate["confidence"] {
  const score =
    Number(Boolean(record.name)) +
    Number(Boolean(record.officialUrl ?? record.website)) +
    Number(Boolean(record.city)) +
    Number(Boolean(record.description || record.category)) +
    Number(productImageUrls.length > 0);

  if (score >= 4) {
    return "high";
  }

  if (score >= 2) {
    return "medium";
  }

  return "low";
}
