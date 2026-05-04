"use client";

import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  getPageHref: (page: number) => string;
};

function getPaginationItems(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 2) {
    return [1, 2, 3, "end-ellipsis", totalPages] as const;
  }

  if (currentPage >= totalPages - 1) {
    return [
      1,
      "start-ellipsis",
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

function clampPage(page: number, totalPages: number) {
  return Math.min(Math.max(page, 1), totalPages);
}

export function HomeBrandsPagination({
  currentPage,
  totalPages,
  onPageChange,
  getPageHref,
}: Props) {
  const [pageInput, setPageInput] = useState(String(currentPage));
  const paginationItems = useMemo(
    () => getPaginationItems(currentPage, totalPages),
    [currentPage, totalPages],
  );

  const commitPageInput = () => {
    const trimmedInput = pageInput.trim();
    const parsedPage = Number(trimmedInput);

    if (!trimmedInput || !Number.isInteger(parsedPage)) {
      setPageInput(String(currentPage));
      return;
    }

    const nextPage = clampPage(parsedPage, totalPages);
    setPageInput(String(nextPage));

    if (nextPage !== currentPage) {
      onPageChange(nextPage);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <Pagination aria-label="品牌分頁">
      <PaginationContent className="flex-wrap gap-y-2">
        <PaginationItem>
          <PaginationPrevious
            href={getPageHref(currentPage - 1)}
            text="上一頁"
            aria-disabled={currentPage === 1}
            className={
              currentPage === 1 ? "pointer-events-none opacity-40" : undefined
            }
            onClick={(event) => {
              event.preventDefault();
              if (currentPage > 1) {
                onPageChange(currentPage - 1);
                setPageInput(String(currentPage - 1));
              }
            }}
          />
        </PaginationItem>

        {paginationItems.map((item, index) => {
          const itemKey = typeof item === "number" ? item : `${item}-${index}`;

          if (typeof item === "number") {
            if (item === currentPage) {
              return (
                <PaginationItem key={itemKey}>
                  <label htmlFor="brand-page-input" className="sr-only">
                    輸入品牌列表頁碼
                  </label>
                  <Input
                    id="brand-page-input"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={pageInput}
                    onChange={(event) => setPageInput(event.target.value)}
                    onBlur={commitPageInput}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        commitPageInput();
                        event.currentTarget.blur();
                      }
                    }}
                    className="w-11 rounded-md text-center font-caption text-sm tabular-nums"
                  />
                </PaginationItem>
              );
            }

            return (
              <PaginationItem key={itemKey}>
                <PaginationLink
                  href={getPageHref(item)}
                  isActive={item === currentPage}
                  onClick={(event) => {
                    event.preventDefault();
                    onPageChange(item);
                    setPageInput(String(item));
                  }}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={itemKey}>
              <PaginationEllipsis />
            </PaginationItem>
          );
        })}

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
                onPageChange(currentPage + 1);
                setPageInput(String(currentPage + 1));
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
