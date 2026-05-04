import { describe, expect, it } from "vitest";

import { dedupeBrandCandidates } from "./dedupe";
import type { BrandCandidate } from "./schema";

const baseCandidate: BrandCandidate = {
  brandName: "品牌一號",
  productImageUrls: [],
  sourceName: "source-a",
  sourceUrl: "https://example.com/source-a",
  evidenceTags: ["A"],
  confidence: "medium",
};

describe("dedupeBrandCandidates", () => {
  it("merges exact official URL host matches", () => {
    const result = dedupeBrandCandidates([
      {
        ...baseCandidate,
        officialUrl: "https://www.brand.example/about",
        officialUrlType: "website",
        mainProducts: "包袋",
        productImageUrls: ["https://img.example.com/a.jpg"],
      },
      {
        ...baseCandidate,
        brandName: "品牌一號 官方",
        officialUrl: "https://brand.example/products",
        officialUrlType: "website",
        mainProducts: "配件",
        productImageUrls: ["https://img.example.com/b.jpg"],
        evidenceTags: ["B", "D"],
        confidence: "high",
      },
    ]);
    expect(result[0]?.mainProducts).toBe("包袋、配件");

    expect(result).toHaveLength(1);
    expect(result[0]?.productImageUrls).toEqual([
      "https://img.example.com/a.jpg",
      "https://img.example.com/b.jpg",
    ]);
    expect(result[0]?.evidenceTags).toEqual(["A", "B", "D"]);
    expect(result[0]?.confidence).toBe("high");
  });
});
