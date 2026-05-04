import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="flex flex-col-reverse gap-6 bg-background px-edge py-8 text-sm leading-relaxed text-muted-foreground shadow-sm md:flex-row md:justify-between">
      <p className="font-body">
        © {currentYear}
        {" 本網站由 "}
        <Link
          href="https://thisweb.dev"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-foreground transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          ThisWeb
        </Link>{" "}
        製作。
      </p>

      <div className="max-w-2xl space-y-1 font-body text-pretty">
        <p>
          品牌資料主要由爬蟲整理而來，內容不保證 100%
          準確，會持續校對與慢慢改良。
        </p>
        <p>
          歡迎來信{" "}
          <Link
            href="mailto:kun@thisweb.dev"
            className="font-medium text-foreground transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            kun@thisweb.dev
          </Link>{" "}
          提供品牌資訊或協助勘誤。
        </p>
      </div>
    </footer>
  );
}
