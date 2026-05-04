import * as cheerio from "cheerio";

import { fetchText } from "../http";
import { inferMainProducts } from "../lib/product-inference";
import type { CrawlSource, RawBrandRecord } from "../lib/schema";
import { cleanText } from "../lib/text";
import { absoluteUrl, getOfficialUrlType } from "../lib/url-utils";
import { wait } from "../lib/utils";

const baseUrl = "https://twrr.org.tw/zh-TW/partner";
const pageCount = 41;
const defaultDetailLimit = 160;
const detailDelayMs = 100;

type PartnerListItem = {
  name: string;
  city?: string;
  imageUrl?: string;
  detailUrl: string;
};

function pageUrl(pageGroup: number) {
  const url = new URL(baseUrl);
  url.searchParams.set("page_group", `${pageGroup}`);
  return url.toString();
}

function parseListPage(html: string, sourceUrl: string) {
  const $ = cheerio.load(html);
  const items: PartnerListItem[] = [];

  $("dl").each((_, element) => {
    const $element = $(element);
    const detailUrl = absoluteUrl(
      $element.find("dt a").attr("href"),
      sourceUrl,
    );
    const imageUrl = absoluteUrl(
      $element.find("dt img").attr("src"),
      sourceUrl,
    );
    const name =
      cleanText($element.find("h3").text()) ??
      cleanText($element.find("dt img").attr("alt"));
    const city = cleanText($element.find("dd p").first().text());

    if (!detailUrl || !name) {
      return;
    }

    items.push({
      name,
      city,
      imageUrl,
      detailUrl,
    });
  });

  return items;
}

function selectOfficialUrl(urls: string[]) {
  const filteredUrls = urls.filter(
    (url) =>
      !url.includes("youtu.be") &&
      !url.includes("youtube.com") &&
      !url.includes("twrr.org.tw"),
  );
  const preferredUrl =
    filteredUrls.find(
      (url) =>
        !url.includes("instagram.com") &&
        !url.includes("facebook.com") &&
        !url.includes("threads.com") &&
        !url.includes("pinkoi.com"),
    ) ?? filteredUrls[0];

  if (!preferredUrl) {
    return {};
  }

  return {
    officialUrl: preferredUrl,
    officialUrlType: getOfficialUrlType(preferredUrl),
  };
}

function parseDetailPage(item: PartnerListItem, html: string): RawBrandRecord {
  const $ = cheerio.load(html);
  const description = cleanText(
    $('meta[name="description"]').attr("content") ??
      $('meta[name="og:description"]').attr("content"),
  );
  const pageCity = cleanText($(".page__city").text())?.replace(/（.*?）/g, "");
  const imageUrls = [
    item.imageUrl,
    $('meta[property="og:image"]').attr("content"),
    ...$(".info__img img")
      .map((_, image) => $(image).attr("src"))
      .get(),
  ]
    .map((url) => absoluteUrl(url, item.detailUrl))
    .filter((url): url is string => Boolean(url));
  const linkUrls = $(".info__links a[href]")
    .map((_, link) => absoluteUrl($(link).attr("href"), item.detailUrl))
    .get()
    .filter((url): url is string => Boolean(url));
  const rawCompanyName = cleanText(
    $(".info__words__list").first().text(),
  )?.split("/")[0];
  const companyName =
    rawCompanyName &&
    !/聯絡人|連絡人|聯繫|電話|代表人|負責人|客服|專員|尚未填寫/.test(
      rawCompanyName,
    )
      ? rawCompanyName
      : undefined;
  const officialLink = selectOfficialUrl(linkUrls);
  const mainProducts =
    inferMainProducts(`${item.name} ${description}`) ?? "地方創生產品與服務";

  return {
    sourceName: "twrr-partners",
    sourceUrl: item.detailUrl,
    name: item.name,
    companyName: cleanText(companyName),
    description: mainProducts,
    imageUrls,
    city: pageCity ?? item.city,
    category: "regional revitalization",
    evidenceTags: ["B", "D"],
    ...officialLink,
  };
}

export const twrrSource: CrawlSource = {
  name: "twrr-partners",
  url: baseUrl,
  async crawl() {
    const errors: string[] = [];
    const listItems: PartnerListItem[] = [];
    const detailLimit = Number.parseInt(
      process.env.TWRR_DETAIL_LIMIT ?? `${defaultDetailLimit}`,
      10,
    );

    for (let page = 1; page <= pageCount; page += 1) {
      const sourceUrl = pageUrl(page);

      try {
        const html = await fetchText(sourceUrl);
        listItems.push(...parseListPage(html, sourceUrl));
      } catch (error) {
        errors.push(
          `${sourceUrl}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    const rawRecords: RawBrandRecord[] = [];

    for (const item of listItems.slice(0, detailLimit)) {
      try {
        const html = await fetchText(item.detailUrl);
        rawRecords.push(parseDetailPage(item, html));
      } catch (error) {
        errors.push(
          `${item.detailUrl}: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }

      await wait(detailDelayMs);
    }

    return {
      sourceName: this.name,
      sourceUrl: this.url,
      rawRecords,
      errors,
    };
  },
};
