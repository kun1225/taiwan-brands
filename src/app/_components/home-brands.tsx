"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { HomeBrandsControls } from "./home-brands-controls";
import { type Brand, HomeBrandsItem } from "./home-brands-item";

const CONFIDENCE_RANK: Record<Brand["confidence"], number> = {
  high: 3,
  medium: 2,
  low: 1,
};
const PAGE_SIZE = 24;

type Props = {
  brands: Brand[];
  initialPage: number;
};

function getPaginationItems(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "end-ellipsis", totalPages] as const;
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "start-ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ] as const;
  }

  return [
    1,
    "start-ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "end-ellipsis",
    totalPages,
  ] as const;
}

export function HomeBrands({ brands, initialPage }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    let result = [...brands];

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((b) => b.brandName.toLowerCase().includes(q));
    }

    result.sort((a, b) => {
      const diff =
        CONFIDENCE_RANK[b.confidence] - CONFIDENCE_RANK[a.confidence];
      if (diff !== 0) return diff;
      return a.brandName.localeCompare(b.brandName, "zh-TW");
    });

    return result;
  }, [brands, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(initialPage, 1), totalPages);
  const paginatedBrands = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, filtered]);
  const paginationItems = useMemo(
    () => getPaginationItems(currentPage, totalPages),
    [currentPage, totalPages],
  );

  function getPageHref(page: number) {
    return page <= 1 ? pathname : `${pathname}?page=${page}`;
  }

  function updatePage(page: number) {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    const params = new URLSearchParams(window.location.search);

    if (nextPage === 1) {
      params.delete("page");
    } else {
      params.set("page", String(nextPage));
    }

    const query = params.toString();
    const href = query ? `${pathname}?${query}` : pathname;

    startTransition(() => {
      router.replace(href, { scroll: false });
    });
  }
  function resetToFirstPage() {
    if (currentPage !== 1) {
      updatePage(1);
    }
  }

  useEffect(() => {
    if (initialPage !== currentPage) {
      const params = new URLSearchParams(window.location.search);

      if (currentPage === 1) {
        params.delete("page");
      } else {
        params.set("page", String(currentPage));
      }

      const query = params.toString();
      const href = query ? `${pathname}?${query}` : pathname;

      startTransition(() => {
        router.replace(href, { scroll: false });
      });
    }
  }, [currentPage, initialPage, pathname, router]);

  return (
    <section id="brands" className="px-edge py-24">
      <div className="mb-10">
        <h2 className="font-title text-4xl font-semibold tracking-tight text-balance text-foreground">
          品牌索引
        </h2>
        <p className="mt-2 font-body-lg text-lg text-muted-foreground">
          來自 Pinkoi、社群推薦與合作夥伴的台灣原創品牌
        </p>
      </div>

      <div className="mb-8">
        <HomeBrandsControls
          searchQuery={searchQuery}
          onSearchChange={(value) => {
            setSearchQuery(value);
            resetToFirstPage();
          }}
          resultCount={filtered.length}
          totalCount={brands.length}
        />
      </div>

      {filtered.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedBrands.map((brand) => (
              <HomeBrandsItem key={brand.brandName} brand={brand} />
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-4">
            <p className="font-caption text-sm text-muted-foreground tabular-nums">
              第 {currentPage} / {totalPages} 頁
            </p>

            <Pagination aria-label="品牌分頁">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={getPageHref(currentPage - 1)}
                    text="上一頁"
                    aria-disabled={currentPage === 1}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-40"
                        : undefined
                    }
                    onClick={(event) => {
                      event.preventDefault();
                      if (currentPage > 1) {
                        updatePage(currentPage - 1);
                      }
                    }}
                  />
                </PaginationItem>

                {paginationItems.map((item, index) => (
                  <PaginationItem
                    key={typeof item === "number" ? item : `${item}-${index}`}
                  >
                    {typeof item === "number" ? (
                      <PaginationLink
                        href={getPageHref(item)}
                        isActive={item === currentPage}
                        onClick={(event) => {
                          event.preventDefault();
                          updatePage(item);
                        }}
                      >
                        {item}
                      </PaginationLink>
                    ) : (
                      <PaginationEllipsis />
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href={getPageHref(currentPage + 1)}
                    text="下一頁"
                    aria-disabled={currentPage === totalPages}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-40"
                        : undefined
                    }
                    onClick={(event) => {
                      event.preventDefault();
                      if (currentPage < totalPages) {
                        updatePage(currentPage + 1);
                      }
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      ) : (
        <div className="py-24 text-center">
          <p className="font-body-sm text-muted-foreground">
            找不到符合條件的品牌
          </p>
        </div>
      )}
    </section>
  );
}
