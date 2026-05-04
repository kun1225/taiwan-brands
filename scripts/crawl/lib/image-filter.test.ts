import { describe, expect, it } from "vitest";

import { pickProductImageUrls } from "./image-filter";

describe("pickProductImageUrls", () => {
  it("keeps likely product photos and filters logos", () => {
    expect(
      pickProductImageUrls(
        [
          "/images/logo.png",
          "https://static.cdninstagram.com/rsrc.php/v4/yD/r/R0fBIMurK8v.png",
          "https://scontent.cdninstagram.com/v/t51.2885-19/230208920_997643034329661_9081535823292324492_n.jpg?stp=dst-jpg_s100x100_tt6",
          "https://ugc.production.linktr.ee/example.jpeg?io=true&size=avatar-v3_0",
          "https://scdn.line-apps.com/n/line_add_friends/btn/zh-Hant.png",
          "/products/bag-1.jpg",
          "https://cdn.example.com/products/bag-2.webp",
          "/products/bag-3.jpg",
        ],
        "https://example.com/shop",
      ),
    ).toEqual([
      "https://example.com/products/bag-1.jpg",
      "https://cdn.example.com/products/bag-2.webp",
    ]);
  });
});
