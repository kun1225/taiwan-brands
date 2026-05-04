import type { BrandCandidate } from "./schema";

export const brandCsvColumns = [
  "brand_name",
  "company_name",
  "main_products",
  "product_image_url_1",
  "product_image_url_2",
  "official_url",
  "official_url_type",
  "city",
  "category",
  "source_name",
  "source_url",
  "evidence_tags",
  "confidence",
] as const;

function escapeCsvValue(value: string | undefined) {
  const text = value ?? "";

  if (/[",\n\r]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }

  return text;
}

export function brandCandidateToCsvRow(candidate: BrandCandidate) {
  return [
    candidate.brandName,
    candidate.companyName,
    candidate.mainProducts,
    candidate.productImageUrls[0],
    candidate.productImageUrls[1],
    candidate.officialUrl ?? candidate.website,
    candidate.officialUrlType ?? (candidate.website ? "website" : undefined),
    candidate.city,
    candidate.category,
    candidate.sourceName,
    candidate.sourceUrl,
    candidate.evidenceTags.join(","),
    candidate.confidence,
  ].map(escapeCsvValue);
}

export function exportBrandCandidatesToCsv(candidates: BrandCandidate[]) {
  const rows = [
    brandCsvColumns.join(","),
    ...candidates.map((candidate) =>
      brandCandidateToCsvRow(candidate).join(","),
    ),
  ];

  return `${rows.join("\n")}\n`;
}
