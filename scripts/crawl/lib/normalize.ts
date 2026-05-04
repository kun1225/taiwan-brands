import { pickProductImageUrls } from "./image-filter";
import {
  type BrandCandidate,
  brandCandidateSchema,
  type RawBrandRecord,
} from "./schema";
import { scoreConfidence } from "./scoring";
import { cleanText } from "./text";

export { cleanText };

export function normalizeBrandName(value: string) {
  return value
    .replace(/[（(].*?[)）]/g, "")
    .replace(/[｜|].*$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeRawBrandRecord(record: RawBrandRecord) {
  const brandName = cleanText(record.name);

  if (!brandName) {
    return undefined;
  }

  const productImageUrls = pickProductImageUrls(
    record.imageUrls ?? [],
    record.sourceUrl,
  );

  const candidate = {
    brandName: normalizeBrandName(brandName),
    companyName: cleanText(record.companyName),
    mainProducts: cleanText(record.description),
    productImageUrls,
    website: cleanText(record.website),
    officialUrl: cleanText(record.officialUrl ?? record.website),
    officialUrlType: record.officialUrlType ?? (record.website ? "website" : undefined),
    city: cleanText(record.city),
    category: cleanText(record.category),
    sourceName: record.sourceName,
    sourceUrl: record.sourceUrl,
    evidenceTags:
      record.evidenceTags && record.evidenceTags.length > 0
        ? record.evidenceTags
        : (["D"] as const),
    confidence: scoreConfidence(record, productImageUrls),
  };

  const parsed = brandCandidateSchema.safeParse(candidate);

  if (!parsed.success) {
    return undefined;
  }

  return parsed.data;
}

export function normalizeRawBrandRecords(records: RawBrandRecord[]) {
  return records
    .map((record) => normalizeRawBrandRecord(record))
    .filter((record): record is BrandCandidate => Boolean(record));
}
