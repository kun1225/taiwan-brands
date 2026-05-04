import Fuse, { type IFuseOptions } from "fuse.js";

import { inferProductCategories } from "../../scripts/crawl/lib/product-inference";

import type { Brand } from "@/app/_components/home-brands-item";

const CONFIDENCE_RANK: Record<Brand["confidence"], number> = {
  high: 3,
  medium: 2,
  low: 1,
};

const fuseOptions: IFuseOptions<Brand> = {
  includeScore: true,
  ignoreLocation: true,
  minMatchCharLength: 2,
  threshold: 0.35,
  keys: [
    { name: "brandName", weight: 0.7 },
    { name: "mainProducts", weight: 0.2 },
    { name: "searchCategories", weight: 0.1 },
  ],
};

function normalizeQuery(query: string) {
  return query.trim().toLowerCase();
}

function sortByConfidenceAndName(a: Brand, b: Brand) {
  const diff = CONFIDENCE_RANK[b.confidence] - CONFIDENCE_RANK[a.confidence];

  if (diff !== 0) {
    return diff;
  }

  return a.brandName.localeCompare(b.brandName, "zh-TW");
}

function getBrandKey(brand: Brand) {
  return `${brand.brandName}::${brand.officialUrl ?? brand.sourceUrl}`;
}

export function searchBrands(brands: Brand[], query: string) {
  const normalizedQuery = normalizeQuery(query);

  if (!normalizedQuery) {
    return [...brands].sort(sortByConfidenceAndName);
  }

  const inferredCategories = inferProductCategories(query);
  const fuse = new Fuse(brands, fuseOptions);
  const fuseResults = fuse.search(normalizedQuery);
  const scoreByKey = new Map(
    fuseResults.map((result) => [getBrandKey(result.item), result.score ?? 1]),
  );

  return brands
    .map((brand) => {
      const key = getBrandKey(brand);
      const brandName = brand.brandName.toLowerCase();
      const mainProducts = brand.mainProducts?.toLowerCase() ?? "";
      const categoryMatches = inferredCategories.filter((category) =>
        brand.searchCategories.includes(category),
      ).length;
      const directBrandMatch = brandName.includes(normalizedQuery) ? 1 : 0;
      const directProductMatch = mainProducts.includes(normalizedQuery) ? 1 : 0;
      const fuseScore = scoreByKey.get(key);

      if (
        categoryMatches === 0 &&
        directBrandMatch === 0 &&
        directProductMatch === 0 &&
        fuseScore === undefined
      ) {
        return undefined;
      }

      const rankingScore =
        categoryMatches * 100 +
        directBrandMatch * 30 +
        directProductMatch * 15 +
        (fuseScore === undefined ? 0 : 10 - fuseScore * 10) +
        CONFIDENCE_RANK[brand.confidence];

      return {
        brand,
        rankingScore,
      };
    })
    .filter((entry): entry is { brand: Brand; rankingScore: number } =>
      Boolean(entry),
    )
    .sort((a, b) => {
      const scoreDiff = b.rankingScore - a.rankingScore;

      if (scoreDiff !== 0) {
        return scoreDiff;
      }

      return sortByConfidenceAndName(a.brand, b.brand);
    })
    .map((entry) => entry.brand);
}
