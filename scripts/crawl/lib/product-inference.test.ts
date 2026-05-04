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

  it("infers the second batch of added categories", () => {
    const result = inferMainProducts(
      "品牌販售帽子、蜂蜜、鍋具、洗髮精、收納盒、插畫、奶瓶與自行車配件",
    );

    expect(result).toBe("髮飾與配件、農產與加工食品、廚房用品");
  });

  it("matches broader keyword variants", () => {
    const result = inferMainProducts(
      "品牌主打側背包、帽T、球鞋、手鍊、手帳、行動電源與鹿角蕨",
    );

    expect(result).toBe("包袋、服飾、鞋履");
  });
});
