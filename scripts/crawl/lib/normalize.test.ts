import { describe, expect, it } from "vitest";

import { normalizeRawBrandRecord } from "./normalize";

describe("normalizeRawBrandRecord", () => {
  it("defaults missing evidence tags to an empty list", () => {
    const result = normalizeRawBrandRecord({
      sourceName: "source",
      sourceUrl: "https://example.com/source",
      name: "品牌",
    });

    expect(result).toEqual(
      expect.objectContaining({
        brandName: "品牌",
        evidenceTags: [],
        searchCategories: [],
      }),
    );
  });

  it("derives structured search categories from record text", () => {
    const result = normalizeRawBrandRecord({
      sourceName: "source",
      sourceUrl: "https://example.com/source",
      name: "品牌",
      description: "襪子、外套、背包",
    });

    expect(result).toEqual(
      expect.objectContaining({
        mainProducts: "襪子、外套、背包",
        searchCategories: ["包袋", "服飾"],
      }),
    );
  });
});
