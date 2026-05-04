import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex flex-row items-center justify-between gap-4 bg-background px-edge py-4 shadow-xs">
      <Link
        href="/"
        className="flex w-fit items-center gap-3 rounded-xl transition-opacity hover:opacity-85 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        aria-label="Taiwan Brands 首頁"
      >
        <div className="relative size-11">
          <Image alt="Taiwan Brands Logo" src="/logo.jpeg" fill />
        </div>
        <div className="flex flex-col">
          <span className="font-title text-lg font-semibold tracking-tight text-foreground">
            台灣在地品牌
          </span>
          <span className="font-body-sm text-xs tracking-[0.18em] text-muted-foreground uppercase">
            Taiwan Brands
          </span>
        </div>
      </Link>

      <Button
        nativeButton={false}
        render={
          <Link href="/#brands" aria-label="跳到品牌列表區塊">
            探索台灣品牌
          </Link>
        }
      />
    </header>
  );
}
