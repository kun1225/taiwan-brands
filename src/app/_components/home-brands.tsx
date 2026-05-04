"use client";

import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion } from "motion/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { HomeBrandsControls } from "./home-brands-controls";
import { type Brand } from "./home-brands-item";
import { HomeBrandsList } from "./home-brands-list";
import { HomeBrandsPagination } from "./home-brands-pagination";

const CONFIDENCE_RANK: Record<Brand["confidence"], number> = {
  high: 3,
  medium: 2,
  low: 1,
};
const PAGE_SIZE = 18;
const sectionVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0,
    },
  },
} as const;
const sectionItemVariants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.88,
      ease: [0.61, 1, 0.88, 1],
    },
  },
} as const;

type UpdatePageOptions = {
  scrollToList?: boolean;
};

type Props = {
  brands: Brand[];
  initialPage: number;
};

export function HomeBrands({ brands, initialPage }: Props) {
  const containerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
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

  // Get current page from URL params, fallback to initialPage prop
  const currentPage = useMemo(() => {
    const pageParam = searchParams.get("page");
    const page = pageParam ? Number.parseInt(pageParam, 10) : initialPage;
    return Math.min(Math.max(Number.isFinite(page) ? page : 1, 1), totalPages);
  }, [searchParams, initialPage, totalPages]);

  const paginatedBrands = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(startIndex, startIndex + PAGE_SIZE);
  }, [currentPage, filtered]);

  const gridKey = `${currentPage}-${searchQuery.trim().toLowerCase()}`;

  const getPageHref = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (page <= 1) {
        params.delete("page");
      } else {
        params.set("page", String(page));
      }
      const query = params.toString();
      return query ? `${pathname}?${query}` : pathname;
    },
    [pathname, searchParams],
  );

  const updatePage = useCallback(
    (page: number, options: UpdatePageOptions = {}) => {
      const nextPage = Math.min(Math.max(page, 1), totalPages);
      const href = getPageHref(nextPage);

      startTransition(() => {
        router.replace(href, { scroll: false });
      });

      if (options.scrollToList) {
        containerRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    },
    [getPageHref, router, totalPages],
  );

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
      if (currentPage !== 1) {
        updatePage(1);
      }
    },
    [currentPage, updatePage],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updatePage(page, { scrollToList: true });
    },
    [updatePage],
  );

  // Sync URL if the current page becomes invalid (e.g. after filtering)
  useEffect(() => {
    const pageParam = searchParams.get("page");
    const urlPage = pageParam ? Number.parseInt(pageParam, 10) : 1;

    if (urlPage !== currentPage) {
      updatePage(currentPage);
    }
  }, [currentPage, searchParams, updatePage]);

  return (
    <motion.section
      ref={containerRef}
      id="brands"
      className="scroll-mt-10 px-edge py-24"
      variants={sectionVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.08 }}
    >
      <motion.div className="mb-10" variants={sectionItemVariants}>
        <motion.h2
          className="font-title text-4xl font-semibold tracking-tight text-balance text-foreground"
          variants={sectionItemVariants}
        >
          品牌列表
        </motion.h2>
      </motion.div>

      <motion.div className="mb-8" variants={sectionItemVariants}>
        <HomeBrandsControls
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          resultCount={filtered.length}
          totalCount={brands.length}
        />
      </motion.div>

      {filtered.length > 0 ? (
        <>
          <HomeBrandsList brands={paginatedBrands} gridKey={gridKey} />

          <motion.div className="mt-10" variants={sectionItemVariants}>
            <HomeBrandsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              getPageHref={getPageHref}
            />
          </motion.div>
        </>
      ) : (
        <motion.div
          className="py-24 text-center"
          variants={sectionItemVariants}
        >
          <p className="font-body-sm text-muted-foreground">
            找不到符合條件的品牌
          </p>
        </motion.div>
      )}
    </motion.section>
  );
}
