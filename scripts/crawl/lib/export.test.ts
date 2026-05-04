import { describe, expect, it } from "vitest";

import { exportBrandCandidatesToCsv } from "./export";
import type { BrandCandidate } from "./schema";

describe("exportBrandCandidatesToCsv", () => {
  it("escapes commas and quotes", () => {
    const candidate: BrandCandidate = {
      brandName: "台灣品牌",
      companyName: '好公司 "股份" 有限公司',
      mainProducts: "咖啡, 甜點",
      productImageUrls: ["https://example.com/product.jpg"],
      officialUrl: "https://instagram.com/taiwan-brand",
      officialUrlType: "instagram",
      city: "台南市",
      category: "食品",
      sourceName: "test-source",
      sourceUrl: "https://example.com/source",
      evidenceTags: ["A", "B"],
      confidence: "high",
    };

    const csv = exportBrandCandidatesToCsv([candidate]);

    expect(csv).toContain('"好公司 ""股份"" 有限公司"');
    expect(csv).toContain('"咖啡, 甜點"');
    expect(csv).toContain("https://instagram.com/taiwan-brand,instagram");
    expect(csv).toContain('"A,B"');
  });
});
