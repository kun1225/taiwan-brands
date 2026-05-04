import * as cheerio from "cheerio";

import { fetchText } from "../http";
import { pickProductImageUrls } from "./image-filter";
import type { RawBrandRecord } from "./schema";

type FetchText = typeof fetchText;

function extractJsonLdImages(value: unknown): string[] {
  if (!value) {
    return [];
  }

  if (typeof value === "string") {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => extractJsonLdImages(item));
  }

  if (typeof value === "object") {
    const objectValue = value as Record<string, unknown>;
    return extractJsonLdImages(objectValue.image);
  }

  return [];
}

function extractSrcSetUrls(value: string | undefined) {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim().split(/\s+/)[0])
    .filter(Boolean);
}

export function extractImageCandidatesFromHtml(html: string, pageUrl: string) {
  const $ = cheerio.load(html);
  const candidates: string[] = [];

  const pushCandidate = (value: string | undefined) => {
    if (!value) {
      return;
    }

    try {
      candidates.push(new URL(value, pageUrl).toString());
    } catch {
      return;
    }
  };

  $('meta[property="og:image"], meta[name="twitter:image"]').each((_, node) => {
    pushCandidate($(node).attr("content"));
  });

  $('script[type="application/ld+json"]').each((_, node) => {
    const text = $(node).text().trim();

    if (!text) {
      return;
    }

    try {
      const parsed = JSON.parse(text) as unknown;
      for (const image of extractJsonLdImages(parsed)) {
        pushCandidate(image);
      }
    } catch {
      return;
    }
  });

  $("img").each((_, node) => {
    pushCandidate($(node).attr("src"));

    for (const srcSetUrl of extractSrcSetUrls($(node).attr("srcset"))) {
      pushCandidate(srcSetUrl);
    }

    pushCandidate($(node).attr("data-src"));
    pushCandidate($(node).attr("data-original"));
  });

  return Array.from(new Set(candidates));
}

export async function enrichRecordWithFetchedImages(
  record: RawBrandRecord,
  fetcher: FetchText = fetchText,
) {
  const pageUrl = record.officialUrl ?? record.website;

  if (!pageUrl) {
    return record;
  }

  try {
    const html = await fetcher(pageUrl);
    const imageCandidates = extractImageCandidatesFromHtml(html, pageUrl);
    const imageUrls = pickProductImageUrls(imageCandidates, pageUrl);

    if (imageUrls.length === 0) {
      return record;
    }

    return {
      ...record,
      imageUrls,
    } satisfies RawBrandRecord;
  } catch {
    return record;
  }
}
