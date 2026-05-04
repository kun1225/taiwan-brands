"use client";

import { AnimatePresence, motion } from "motion/react";

import { useIsMounted } from "@/hooks/use-is-mouted";

import { type Brand, HomeBrandsItem } from "./home-brands-item";

const gridVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02,
    },
  },
} as const;

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 24,
    filter: "blur(3px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.95,
      ease: [0.61, 1, 0.88, 1],
    },
  },
} as const;

type Props = {
  brands: Brand[];
  gridKey: string;
};

export function HomeBrandsList({ brands, gridKey }: Props) {
  const isMounted = useIsMounted();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={gridKey}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        variants={gridVariants}
        initial="hidden"
        {...(isMounted()
          ? { animate: "show" }
          : { whileInView: "show", viewport: { once: true, margin: "-50px" } })}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
      >
        {brands.map((brand) => (
          <motion.div key={brand.brandName} variants={cardVariants}>
            <HomeBrandsItem brand={brand} />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
