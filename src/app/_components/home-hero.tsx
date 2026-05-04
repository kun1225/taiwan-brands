import Image from "next/image";

import { HomeHeroCta } from "./home-hero-cta";
import { HomeHeroHeadline } from "./home-hero-headline";

export function HomeHero() {
  return (
    <section className="relative flex flex-col justify-center overflow-hidden px-edge py-58 md:py-64 lg:py-72">
      <div className="pointer-events-none absolute inset-0 animate-in delay-200 ease-sine-out animation-duration-1400 fill-mode-both zoom-in-95 blur-in-8 fade-in">
        <div className="animate-leaf-shadow-drift absolute inset-0">
          <Image
            src="/leaf-shadow-tropical.png"
            alt=""
            fill
            priority
            className="z-10 object-contain object-top-right opacity-25"
            unoptimized
          />
          <Image
            src="/sunlight-overlay.png"
            alt=""
            fill
            priority
            className="inset-0 object-top-right opacity-60"
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
