import { extractCardRecords, extractTableRecords } from "../html-extract";
import { fetchText } from "../http";
import type { CrawlSource } from "../lib/schema";

const sourceUrl = "https://startup.sme.gov.tw/sitaiwan/Home/catalogStore";

export const socialInnovationSource: CrawlSource = {
  name: "social-innovation-catalog",
  url: sourceUrl,
  async crawl() {
    const errors: string[] = [];

    try {
      const html = await fetchText(sourceUrl);
      const rawRecords = [
        ...extractTableRecords({
          sourceName: this.name,
          sourceUrl,
          html,
          defaultCategory: "social innovation",
          defaultEvidenceTags: ["A", "D"],
        }),
        ...extractCardRecords({
          sourceName: this.name,
          sourceUrl,
          html,
          defaultCategory: "social innovation",
          defaultEvidenceTags: ["A", "D"],
        }),
      ];

      return {
        sourceName: this.name,
        sourceUrl,
        rawRecords,
        errors,
      };
    } catch (error) {
      errors.push(error instanceof Error ? error.message : String(error));

      return {
        sourceName: this.name,
        sourceUrl,
        rawRecords: [],
        errors,
      };
    }
  },
};
