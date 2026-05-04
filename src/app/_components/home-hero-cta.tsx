import Link from "next/link";

import { Button } from "@/components/ui/button";

export function HomeHeroCta() {
  return (
    <div className="mt-8 flex animate-in flex-col gap-3 delay-180 ease-sine-out animation-duration-900 fill-mode-both blur-in-4 fade-in slide-in-from-bottom-3 sm:flex-row sm:items-center">
      <Button
        nativeButton={false}
        size="lg"
        render={<Link href="#brands">探索品牌</Link>}
      />
    </div>
  );
}
