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
      }),
    );
  });
});
