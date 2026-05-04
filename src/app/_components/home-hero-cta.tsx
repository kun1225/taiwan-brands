import Link from "next/link";

import { Button } from "@/components/ui/button";

export function HomeHeroCta() {
  return (
    <div
      className="animate-fade-in-up mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
      style={{ "--stagger-delay": "180ms" } as React.CSSProperties}
    >
      <Button
        nativeButton={false}
        size="lg"
        render={<Link href="#brands">探索品牌</Link>}
      />
    </div>
  );
}
