import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { dedupeBrandCandidates } from "./lib/dedupe";
import { normalizeRawBrandRecords } from "./lib/normalize";
import type { CrawlSource } from "./lib/schema";
import { localSpecialtiesSource } from "./sources/local-specialties";
import { pinkoiSource } from "./sources/pinkoi";
import { socialInnovationSource } from "./sources/social-innovation";
import { threadsCommentsSource } from "./sources/threads-comments";
import { twrrSource } from "./sources/twrr";

const defaultSources: CrawlSource[] = [
  pinkoiSource,
  twrrSource,
  threadsCommentsSource,
  socialInnovationSource,
  localSpecialtiesSource,
];

function getSources() {
  const sourceFilter = process.env.CRAWL_SOURCES?.split(",")
    .map((name) => name.trim())
    .filter(Boolean);

  if (!sourceFilter || sourceFilter.length === 0) {
    return defaultSources;
  }

  const allowedNames = new Set(sourceFilter);
  return defaultSources.filter((source) => allowedNames.has(source.name));
}

async function writeJson(filePath: string, data: unknown) {
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

async function loadCachedSourceResult(rootDir: string, source: CrawlSource) {
  const filePath = path.join(rootDir, "data", "raw", `${source.name}.json`);
  const file = await readFile(filePath, "utf8");
  return JSON.parse(file) as Awaited<ReturnType<CrawlSource["crawl"]>>;
}

async function main() {
  const sources = getSources();
  const rootDir = process.cwd();
  const rawDir = path.join(rootDir, "data", "raw");
  const normalizedDir = path.join(rootDir, "data", "normalized");
  const useCache = process.env.CRAWL_USE_CACHE === "1";
  await mkdir(rawDir, { recursive: true });
  await mkdir(normalizedDir, { recursive: true });

  const settled = await Promise.allSettled(
    sources.map((source) =>
      useCache ? loadCachedSourceResult(rootDir, source) : source.crawl(),
    ),
  );
  const sourceResults = settled.map((result, i) => {
    if (result.status === "fulfilled") return result.value;
    const source = sources[i]!;
    const message =
      result.reason instanceof Error
        ? result.reason.message
        : String(result.reason);
    console.error(`${source.name} failed: ${message}`);
    return {
      sourceName: source.name,
      sourceUrl: source.url,
      rawRecords: [],
      errors: [message],
    };
  });

  const rawRecords = sourceResults.flatMap((result) => result.rawRecords);
  const normalizedRecords = normalizeRawBrandRecords(rawRecords);
  const dedupedRecords = dedupeBrandCandidates(normalizedRecords);
  // 若之後需要 CSV 輸出，再打開這段：
  // const csv = exportBrandCandidatesToCsv(dedupedRecords);

  await Promise.all([
    ...sourceResults.map((result) =>
      writeJson(path.join(rawDir, `${result.sourceName}.json`), result),
    ),
    writeJson(path.join(normalizedDir, "brands.json"), dedupedRecords),
    // 若之後需要 CSV 輸出，再打開這段：
    // writeFile(path.join(normalizedDir, "brands.csv"), csv, "utf8"),
  ]);

  for (const result of sourceResults) {
    console.info(
      `${result.sourceName}: ${result.rawRecords.length} raw records, ${result.errors.length} errors`,
    );

    for (const error of result.errors) {
      console.error(`  ${error}`);
    }
  }

  console.info(`Exported ${dedupedRecords.length} brand candidates.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
