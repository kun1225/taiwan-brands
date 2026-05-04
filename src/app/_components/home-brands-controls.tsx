"use client";

import { Input } from "@/components/ui/input";

type Props = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  resultCount: number;
  totalCount: number;
};

export function HomeBrandsControls({
  searchQuery,
  onSearchChange,
  resultCount,
  totalCount,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative min-w-0 flex-1">
        <Input
          type="search"
          placeholder="搜尋品牌名稱…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-12 rounded-none border-0 border-b border-border bg-transparent px-0 font-body-sm text-sm text-foreground shadow-none ring-0 placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-0"
        />
      </div>

      <p className="font-caption text-sm text-muted-foreground tabular-nums">
        {resultCount === totalCount ? (
          <>共 {totalCount} 個品牌</>
        ) : (
          <>
            顯示 {resultCount} / {totalCount} 個品牌
          </>
        )}
      </p>
    </div>
  );
}
