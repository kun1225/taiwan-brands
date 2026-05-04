"use client";

import { useEffect, useState } from "react";
import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";

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
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const debouncedQuery = useDebounce(localQuery, 400);

  useEffect(() => {
    if (debouncedQuery !== searchQuery) {
      onSearchChange(debouncedQuery);
    }
  }, [debouncedQuery, onSearchChange, searchQuery]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative min-w-0 flex-1">
        <HugeiconsIcon
          icon={Search01Icon}
          strokeWidth={2}
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-0 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          placeholder="搜尋品牌名稱…"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          className="font-body-sm h-12 rounded-none border-0 border-b border-border bg-transparent pr-0 pl-8 text-sm text-foreground shadow-none ring-0 placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-0"
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
