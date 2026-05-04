import * as cheerio from "cheerio";

import { fetchText } from "../http";
import { inferMainProducts } from "../lib/product-inference";
import type { CrawlSource, RawBrandRecord } from "../lib/schema";
import { wait } from "../lib/utils";

const searchQueries = ["台灣品牌", "台灣設計品牌", "台灣製造", "MIT 台灣"];
const pagesPerQuery = 3;
const pageDelayMs = 250;
const excludedTerms = [
  "韓國",
  "日本",
  "美國",
  "法國",
  "英國",
  "泰國",
  "義大利",
  "總代理",
  "選品店",
  "進口",
  "代購",
  "授權販售",
];

type JsonLdProduct = {
  "@type"?: string;
  name?: string;
  description?: string;
  image?: string | string[];
  brand?: {
    name?: string;
  };
  offers?: {
    url?: string;
    seller?: {
      name?: string;
      url?: string;
    };
  };
};

function sourceUrlFor(query: string, page: number) {
  const url = new URL("https://www.pinkoi.com/search");
  url.searchParams.set("q", query);

  if (page > 1) {
    url.searchParams.set("page", `${page}`);
  }

  return url.toString();
}

function getProductImages(product: JsonLdProduct) {
  if (!product.image) {
    return [];
  }

  return Array.isArray(product.image) ? product.image : [product.image];
}

function cleanBrandName(value: string | undefined) {
  return value?.replace(/\s*\([^)]+台灣[^)]*\)\s*/g, "").trim();
}

function isLikelyTaiwanOriginal(record: {
  brandName: string;
  productName: string;
}) {
  const text = `${record.brandName} ${record.productName}`;

  return !excludedTerms.some((term) => text.includes(term));
}

function parseProductsFromHtml(
  html: string,
  sourceUrl: string,
): RawBrandRecord[] {
  const $ = cheerio.load(html);
  const records: RawBrandRecord[] = [];

  $('script[type="application/ld+json"]').each((_, script) => {
    const text = $(script).text().trim();

    if (!text) {
      return;
    }

    try {
      const product = JSON.parse(text) as JsonLdProduct;

      if (product["@type"] !== "Product") {
        return;
      }
      const brandName =
        cleanBrandName(product.brand?.name) ??
        cleanBrandName(product.offers?.seller?.name);

      if (
        !brandName ||
        !product.name ||
        !isLikelyTaiwanOriginal({
          brandName,
          productName: product.name,
        })
      ) {
        return;
      }

      records.push({
        sourceName: "pinkoi-taiwan-search",
        sourceUrl: product.offers?.url ?? sourceUrl,
        name: brandName,
        description: inferMainProducts(product.name) ?? "設計商品",
        imageUrls: getProductImages(product),
        officialUrl: product.offers?.seller?.url ?? product.offers?.url,
        officialUrlType: product.offers?.seller?.url ? "marketplace" : "source",
        category: "design marketplace",
        evidenceTags: ["A", "D"],
      });
    } catch {
      return;
    }
  });

  return records;
}

export const pinkoiSource: CrawlSource = {
  name: "pinkoi-taiwan-search",
  url: sourceUrlFor(searchQueries[0] ?? "台灣品牌", 1),
  async crawl() {
    const errors: string[] = [];
    const rawRecords: RawBrandRecord[] = [];

    for (const query of searchQueries) {
      for (let page = 1; page <= pagesPerQuery; page += 1) {
        const sourceUrl = sourceUrlFor(query, page);

        try {
          const html = await fetchText(sourceUrl);
          rawRecords.push(...parseProductsFromHtml(html, sourceUrl));
        } catch (error) {
          errors.push(
            `${sourceUrl}: ${
              error instanceof Error ? error.message : String(error)
            }`,
          );
        }

        await wait(pageDelayMs);
      }
    }

    return {
      sourceName: this.name,
      sourceUrl: this.url,
      rawRecords,
      errors,
    };
  },
};
