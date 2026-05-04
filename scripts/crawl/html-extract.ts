import * as cheerio from "cheerio";

import type { EvidenceTag, RawBrandRecord } from "./lib/schema";
import { absoluteUrl } from "./lib/url-utils";

type ExtractRecordsOptions = {
  sourceName: string;
  sourceUrl: string;
  html: string;
  defaultCategory?: string;
  defaultEvidenceTags: EvidenceTag[];
};

function textFrom($element: { text: () => string }) {
  return $element.text().replace(/\s+/g, " ").trim();
}

export function extractTableRecords({
  sourceName,
  sourceUrl,
  html,
  defaultCategory,
  defaultEvidenceTags,
}: ExtractRecordsOptions): RawBrandRecord[] {
  const $ = cheerio.load(html);
  const records: RawBrandRecord[] = [];

  $("tr").each((_, row) => {
    const cells = $(row)
      .find("td")
      .map((__, cell) => textFrom($(cell)))
      .get()
      .filter(Boolean);

    if (cells.length === 0) {
      return;
    }

    const nameIndex = cells.findIndex((cell) => !/^\d+$/.test(cell));
    const name = nameIndex >= 0 ? cells[nameIndex] : undefined;

    if (!name || name.length < 2) {
      return;
    }

    records.push({
      sourceName,
      sourceUrl,
      name,
      description: cells.slice(nameIndex + 1, nameIndex + 4).join(", "),
      imageUrls: $(row)
        .find("img")
        .map((__, image) => $(image).attr("src") ?? "")
        .get(),
      website: absoluteUrl(
        $(row).find("a[href]").first().attr("href"),
        sourceUrl,
      ),
      category: defaultCategory,
      evidenceTags: defaultEvidenceTags,
    });
  });

  return records;
}

export function extractCardRecords({
  sourceName,
  sourceUrl,
  html,
  defaultCategory,
  defaultEvidenceTags,
}: ExtractRecordsOptions): RawBrandRecord[] {
  const $ = cheerio.load(html);
  const records: RawBrandRecord[] = [];
  const selectors = [
    "article",
    ".card",
    ".item",
    ".product",
    ".portfolio-item",
    ".award-item",
    ".factory-item",
    "li",
  ];

  for (const selector of selectors) {
    $(selector).each((_, element) => {
      const $element = $(element);
      const title =
        textFrom($element.find("h1,h2,h3,h4,.title,.name").first()) ||
        textFrom($element.find("a").first());
      const imageUrls = $element
        .find("img")
        .map(
          (__, image) =>
            $(image).attr("src") ?? $(image).attr("data-src") ?? "",
        )
        .get();

      if (!title || title.length < 2 || imageUrls.length === 0) {
        return;
      }

      records.push({
        sourceName,
        sourceUrl,
        name: title,
        description:
          textFrom(
            $element.find("p, .desc, .description, .text, .summary").first(),
          ).slice(0, 180) || undefined,
        imageUrls,
        website: absoluteUrl(
          $element.find("a[href]").first().attr("href"),
          sourceUrl,
        ),
        category: defaultCategory,
        evidenceTags: defaultEvidenceTags,
      });
    });

    if (records.length > 0) {
      break;
    }
  }

  return records;
}

export function extractLinkedHrefRecords({
  sourceName,
  sourceUrl,
  html,
  defaultCategory,
  defaultEvidenceTags,
  hrefIncludes,
}: ExtractRecordsOptions & { hrefIncludes: string }) {
  const $ = cheerio.load(html);
  const records: RawBrandRecord[] = [];

  $("a[href]")
    .filter((_, el) => $(el).attr("href")?.includes(hrefIncludes) ?? false)
    .each((_, anchor) => {
      const $anchor = $(anchor);
      const name = textFrom($anchor);
      const href = absoluteUrl($anchor.attr("href"), sourceUrl);

      if (!name || !href || name.length < 2 || name.length > 80) {
        return;
      }

      const imageUrls = Array.from(
        new Set([
          ...$anchor
            .find("img")
            .map(
              (__, image) =>
                $(image).attr("src") ?? $(image).attr("data-src") ?? "",
            )
            .get(),
          ...$anchor
            .closest("li,article,.card,.item,.product")
            .find("img")
            .map(
              (__, image) =>
                $(image).attr("src") ?? $(image).attr("data-src") ?? "",
            )
            .get(),
        ]),
      );

      records.push({
        sourceName,
        sourceUrl: href,
        name,
        imageUrls,
        category: defaultCategory,
        evidenceTags: defaultEvidenceTags,
      });
    });

  return records;
}
