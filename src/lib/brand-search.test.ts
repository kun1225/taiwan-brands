import { describe, expect, it } from "vitest";

import type { Brand } from "@/app/_components/home-brands-item";

import { searchBrands } from "./brand-search";

const brands: Brand[] = [
  {
    brandName: "襪襪製造所",
    mainProducts: "襪子、帽子",
    searchCategories: ["服飾"],
    productImageUrls: [],
    sourceUrl: "https://example.com/socks",
    evidenceTags: ["A"],
    confidence: "high",
  },
  {
    brandName: "山路選物",
    mainProducts: "戶外背包",
    searchCategories: ["包袋", "戶外運動用品"],
    productImageUrls: [],
    sourceUrl: "https://example.com/bag",
    evidenceTags: ["A"],
    confidence: "medium",
  },
  {
    brandName: "茶室",
    mainProducts: "茶葉、茶包",
    searchCategories: ["茶飲食品"],
    productImageUrls: [],
    sourceUrl: "https://example.com/tea",
    evidenceTags: ["A"],
    confidence: "medium",
  },
];

describe("searchBrands", () => {
  it("returns taxonomy matches for broader category queries", () => {
    const result = searchBrands(brands, "服飾");

    expect(result.map((brand) => brand.brandName)).toContain("襪襪製造所");
  });

  it("maps narrow product terms to taxonomy matches", () => {
    const result = searchBrands(brands, "襪子");

    expect(result[0]?.brandName).toBe("襪襪製造所");
  });

  it("keeps brand-name fuzzy search working", () => {
    const result = searchBrands(brands, "茶室");

    expect(result[0]?.brandName).toBe("茶室");
  });
});
