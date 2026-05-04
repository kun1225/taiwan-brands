import { describe, expect, it } from "vitest";

import { inferMainProducts } from "./product-inference";

describe("inferMainProducts", () => {
  it("infers newly added product categories", () => {
    const result = inferMainProducts(
      "品牌販售擴香、蠟燭、手機殼與盆栽等設計商品",
    );

    expect(result).toBe("香氛清潔、3C 配件、園藝植栽");
  });

  it("returns at most three matched categories", () => {
    const result = inferMainProducts(
      "品牌有背包、香水、眼鏡、手機殼和瑜珈用品",
    );

    expect(result).toBe("包袋、保養美妝、3C 配件");
  });

  it("returns undefined when no category matches", () => {
    expect(inferMainProducts("這是一個重視工藝與文化敘事的品牌")).toBe(
      undefined,
    );
  });
});
