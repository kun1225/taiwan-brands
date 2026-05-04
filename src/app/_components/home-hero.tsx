import { HomeHeroCta } from "./home-hero-cta";
import { HomeHeroHeadline } from "./home-hero-headline";

export function HomeHero() {
  return (
    <section className="flex min-h-svh flex-col justify-center px-edge py-24">
      <HomeHeroHeadline />
      <HomeHeroCta />
    </section>
  );
}
