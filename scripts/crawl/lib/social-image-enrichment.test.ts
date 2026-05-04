import { describe, expect, it } from "vitest";

import {
  extractImageCandidatesFromHtml,
  enrichRecordWithFetchedImages,
} from "./social-image-enrichment";
import type { RawBrandRecord } from "./schema";

describe("extractImageCandidatesFromHtml", () => {
  it("collects meta, json-ld, and image tag candidates", () => {
    const html = `
      <html>
        <head>
          <meta property="og:image" content="/images/product-og.jpg" />
          <meta name="twitter:image" content="https://cdn.example.com/social/poster.webp" />
          <script type="application/ld+json">
            {
              "@context": "https://schema.org",
              "@type": "Product",
              "image": ["https://cdn.example.com/catalog/bag-1.jpg"]
            }
          </script>
        </head>
        <body>
          <img src="/assets/logo.png" />
          <img src="/catalog/bag-2.jpg" />
        </body>
      </html>
    `;

    expect(
      extractImageCandidatesFromHtml(html, "https://brand.example/shop"),
    ).toEqual([
      "https://brand.example/images/product-og.jpg",
      "https://cdn.example.com/social/poster.webp",
      "https://cdn.example.com/catalog/bag-1.jpg",
      "https://brand.example/assets/logo.png",
      "https://brand.example/catalog/bag-2.jpg",
    ]);
  });
});

describe("enrichRecordWithFetchedImages", () => {
  it("adds filtered image URLs to a raw record", async () => {
    const record: RawBrandRecord = {
      sourceName: "threads-comments",
      sourceUrl: "https://www.threads.com/t/example",
      name: "brand-one",
      officialUrl: "https://brand.example/shop",
      officialUrlType: "website",
      category: "community recommended",
      evidenceTags: ["B", "D"],
    };

    const result = await enrichRecordWithFetchedImages(record, async () => `
      <html>
        <head>
          <meta property="og:image" content="/images/logo.png" />
        </head>
        <body>
          <img src="/catalog/chair-1.jpg" />
          <img src="/catalog/chair-2.webp" />
        </body>
      </html>
    `);

    expect(result.imageUrls).toEqual([
      "https://brand.example/catalog/chair-1.jpg",
      "https://brand.example/catalog/chair-2.webp",
    ]);
  });
});
