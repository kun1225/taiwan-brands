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
          "relative aspect-[4/3] overflow-hidden rounded-2xl outline outline-1 -outline-offset-1 outline-black/10",
          !firstImage && "bg-muted",
        )}
      >
        {firstImage ? (
          <>
            <Image
              src={firstImage}
              alt={brand.brandName}
              width={500}
              height={375}
              className={cn(
                "absolute inset-0 w-full h-full object-cover",
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
                width={500}
                height={375}
                className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 [transition-delay:60ms] group-hover:opacity-100 group-hover:[transition-delay:0ms]"
                unoptimized
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-label text-muted-foreground text-xs">
              暫無圖片
            </span>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-1">
        <h3 className="font-subtitle text-foreground font-semibold text-sm leading-snug line-clamp-2 text-pretty">
          {brand.brandName}
        </h3>

        {brand.mainProducts && (
          <p className="font-caption text-muted-foreground text-xs line-clamp-1 text-pretty">
            {brand.mainProducts}
          </p>
        )}

        <div className="flex gap-1 flex-wrap mt-1">
          {brand.evidenceTags.map((tag) => (
            <span
              key={tag}
              className={cn(
                "font-label text-xs px-1.5 py-0.5 rounded border",
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
