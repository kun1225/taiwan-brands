import { describe, expect, it } from "vitest";

import { brandCandidateSchema } from "./schema";

describe("brandCandidateSchema", () => {
  it("accepts a complete brand candidate", () => {
    const result = brandCandidateSchema.safeParse({
      brandName: "茶籽堂",
      companyName: "捷順企業股份有限公司",
      mainProducts: "洗沐用品、保養品",
      productImageUrls: ["https://example.com/product.jpg"],
      website: "https://example.com",
      officialUrl: "https://example.com",
      officialUrlType: "website",
      city: "台北市",
      category: "生活用品",
      sourceName: "official-site",
      sourceUrl: "https://example.com/about",
      evidenceTags: ["A", "B", "C"],
      confidence: "high",
    });

    expect(result.success).toBe(true);
  });

  it("accepts candidates without evidence tags", () => {
    const result = brandCandidateSchema.safeParse({
      brandName: "品牌",
      productImageUrls: [],
      sourceName: "source",
      sourceUrl: "https://example.com",
      evidenceTags: [],
      confidence: "low",
    });

    expect(result.success).toBe(true);
  });
});
