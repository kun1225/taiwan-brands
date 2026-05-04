import Image from "next/image";

import { HomeHeroCta } from "./home-hero-cta";
import { HomeHeroHeadline } from "./home-hero-headline";

export function HomeHero() {
  return (
    <section className="relative flex min-h-svh flex-col justify-center overflow-hidden px-edge py-24">
      <div
        className="animate-leaf-shadow-in pointer-events-none absolute inset-0"
        style={{ "--stagger-delay": "220ms" } as React.CSSProperties}
      >
        <div className="animate-leaf-shadow-drift absolute inset-0">
          <Image
            src="/leaf-shadow-transparent.png"
            alt=""
            fill
            priority
            className="object-contain object-left-top opacity-50 md:object-right-top"
            unoptimized
          />
        </div>
      </div>

      <div className="relative z-10 flex flex-col">
        <HomeHeroHeadline />
        <HomeHeroCta />
      </div>
    </section>
  );
}
