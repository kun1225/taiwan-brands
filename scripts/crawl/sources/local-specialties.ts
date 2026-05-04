import { extractCardRecords, extractTableRecords } from "../html-extract";
import { fetchText } from "../http";
import type { CrawlSource } from "../lib/schema";

const sourceUrl = "https://www.taiwanplace21.org.tw/Factory.php";

export const localSpecialtiesSource: CrawlSource = {
  name: "tourism-factory-showcase",
  url: sourceUrl,
  async crawl() {
    const errors: string[] = [];

    try {
      const html = await fetchText(sourceUrl);
      const rawRecords = [
        ...extractCardRecords({
          sourceName: this.name,
          sourceUrl,
          html,
          defaultCategory: "tourism factory",
          defaultEvidenceTags: ["B", "D"],
        }),
        ...extractTableRecords({
          sourceName: this.name,
          sourceUrl,
          html,
          defaultCategory: "tourism factory",
          defaultEvidenceTags: ["B", "D"],
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
