import { z } from "zod";

export const evidenceTagSchema = z.enum(["A", "B", "C", "D"]);

export const confidenceSchema = z.enum(["high", "medium", "low"]);

export const officialUrlTypeSchema = z.enum([
  "website",
  "instagram",
  "facebook",
  "threads",
  "marketplace",
  "source",
]);

export const brandCandidateSchema = z.object({
  brandName: z.string().trim().min(1),
  companyName: z.string().trim().optional(),
  mainProducts: z.string().trim().optional(),
  productImageUrls: z.array(z.string().url()).max(2).default([]),
  website: z.string().url().optional(),
  officialUrl: z.string().url().optional(),
  officialUrlType: officialUrlTypeSchema.optional(),
  city: z.string().trim().optional(),
  category: z.string().trim().optional(),
  sourceName: z.string().trim().min(1),
  sourceUrl: z.string().url(),
  evidenceTags: z.array(evidenceTagSchema),
  confidence: confidenceSchema,
});

export type EvidenceTag = z.infer<typeof evidenceTagSchema>;
export type Confidence = z.infer<typeof confidenceSchema>;
export type OfficialUrlType = z.infer<typeof officialUrlTypeSchema>;
export type BrandCandidate = z.infer<typeof brandCandidateSchema>;

export type RawBrandRecord = {
  sourceName: string;
  sourceUrl: string;
  name?: string;
  companyName?: string;
  description?: string;
  imageUrls?: string[];
  website?: string;
  officialUrl?: string;
  officialUrlType?: OfficialUrlType;
  city?: string;
  category?: string;
  evidenceTags?: EvidenceTag[];
};

export type CrawlSourceResult = {
  sourceName: string;
  sourceUrl: string;
  rawRecords: RawBrandRecord[];
  errors: string[];
};

export type CrawlSource = {
  name: string;
  url: string;
  crawl: () => Promise<CrawlSourceResult>;
};
