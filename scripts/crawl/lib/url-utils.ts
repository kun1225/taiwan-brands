import type { OfficialUrlType } from "./schema";

export function absoluteUrl(value: string | undefined, baseUrl: string) {
  if (!value) {
    return undefined;
  }

  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return undefined;
  }
}

export function getOfficialUrlType(url: string): OfficialUrlType {
  const host = new URL(url).hostname.replace(/^www\./, "");

  if (host.includes("threads.net") || host.includes("threads.com")) {
    return "threads";
  }

  if (host.includes("instagram.com")) {
    return "instagram";
  }

  if (host.includes("facebook.com") || host.includes("fb.com")) {
    return "facebook";
  }

  if (host.includes("pinkoi.com")) {
    return "marketplace";
  }

  if (
    host.includes("forms.gle") ||
    host.includes("docs.google.com") ||
    host.includes("line.me") ||
    host.includes("maps.app.goo.gl") ||
    host.includes("lihi") ||
    url.startsWith("line://")
  ) {
    return "source";
  }

  return "website";
}
