import brandsData from "../../data/normalized/brands.json";

import { HomeBrands } from "./_components/home-brands";
import type { Brand } from "./_components/home-brands-item";
import { HomeHero } from "./_components/home-hero";

type HomePageProps = {
  searchParams: Promise<{
    page?: string | string[];
  }>;
};

function parsePageParam(pageParam: string | string[] | undefined) {
  const value = Array.isArray(pageParam) ? pageParam[0] : pageParam;
  const page = Number.parseInt(value ?? "1", 10);

  return Number.isFinite(page) && page > 0 ? page : 1;
}

export default async function Home({ searchParams }: HomePageProps) {
  const { page } = await searchParams;

  return (
    <main className="flex flex-col">
      <HomeHero />
      <HomeBrands
        brands={brandsData as Brand[]}
        initialPage={parsePageParam(page)}
      />
    </main>
  );
}
