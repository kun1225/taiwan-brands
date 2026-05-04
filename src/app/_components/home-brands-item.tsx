import Image from "next/image";

import { cn } from "@/lib/utils";

export type Brand = {
  brandName: string;
  mainProducts?: string;
  productImageUrls: string[];
  officialUrl?: string;
  sourceUrl: string;
  evidenceTags: ("A" | "B" | "C" | "D")[];
  confidence: "high" | "medium" | "low";
};

const EVIDENCE_TAG_LABELS: Record<"A" | "B" | "C" | "D", string> = {
  A: "平台認證",
  B: "社群推薦",
  C: "多人推薦",
  D: "設計品牌",
};

const EVIDENCE_TAG_STYLES: Record<"A" | "B" | "C" | "D", string> = {
  A: "bg-primary/10 text-primary border-primary/20",
  B: "bg-background text-foreground border-border",
  C: "bg-background text-foreground border-border",
  D: "bg-background text-muted-foreground border-border",
};

type Props = {
  brand: Brand;
};

export function HomeBrandsItem({ brand }: Props) {
  const firstImage = brand.productImageUrls[0];
  const secondImage = brand.productImageUrls[1];
  const href = brand.officialUrl ?? brand.sourceUrl;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div
        className={cn(
          "relative aspect-4/3 overflow-hidden rounded-md outline -outline-offset-1 outline-black/10",
          !firstImage && "bg-muted",
        )}
      >
        {firstImage ? (
          <>
            <Image
              src={firstImage}
              alt={brand.brandName}
              fill
              className={cn(
                "-z-10 object-cover object-top",
                secondImage
                  ? "transition-opacity duration-500 group-hover:opacity-0"
                  : "transition-transform duration-500 group-hover:scale-[1.02]",
              )}
              unoptimized
            />
            {secondImage && (
              <Image
                src={secondImage}
                alt={brand.brandName}
                fill
                className="-z-10 object-cover object-top opacity-0 transition-opacity [transition-delay:60ms] duration-500 group-hover:opacity-100 group-hover:[transition-delay:0ms]"
                unoptimized
              />
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-label text-xs text-muted-foreground">
              暫無圖片
            </span>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-1">
        <h3 className="line-clamp-2 font-subtitle text-sm leading-snug font-semibold text-pretty text-foreground">
          {brand.brandName}
        </h3>

        {brand.mainProducts && (
          <p className="line-clamp-1 font-caption text-xs text-pretty text-muted-foreground">
            {brand.mainProducts}
          </p>
        )}

        <div className="mt-1 flex flex-wrap gap-1">
          {brand.evidenceTags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "rounded border px-1.5 py-0.5 font-label text-xs",
                EVIDENCE_TAG_STYLES[tag],
              )}
            >
              {EVIDENCE_TAG_LABELS[tag]}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}
