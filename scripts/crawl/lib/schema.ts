import { z } from "zod";

export const evidenceTagSchema = z.enum(["A", "B", "C", "D"]);

export const confidenceSchema = z.enum(["high", "medium", "low"]);
export const productCategorySchema = z.enum([
  "包袋",
  "服飾",
  "鞋履",
  "飾品",
  "髮飾與配件",
  "茶飲食品",
  "農產與加工食品",
  "居家生活用品",
  "廚房用品",
  "家飾寢具",
  "保養美妝",
  "洗沐用品",
  "香氛清潔",
  "文具設計",
  "辦公與收納",
  "藝術創作",
  "玩具童用品",
  "嬰幼兒用品",
  "寵物用品",
  "戶外運動用品",
  "旅行用品",
  "3C 配件",
  "樂器與音樂用品",
  "眼鏡配件",
  "園藝植栽",
  "收藏擺件",
  "健身器材",
  "機車／單車配件",
  "手作材料",
]);

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
  searchCategories: z.array(productCategorySchema).default([]),
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
export type ProductCategory = z.infer<typeof productCategorySchema>;
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
