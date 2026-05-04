export function HomeHeroHeadline() {
  return (
    <div className="flex flex-col gap-6">
      <div
        className="animate-fade-in-up"
        style={{ "--stagger-delay": "60ms" } as React.CSSProperties}
      >
        <h1 className="font-hero text-8xl tracking-tight text-foreground ">
          發現台灣原創品牌
        </h1>
      </div>

      <p
        className="animate-fade-in-up font-body-lg max-w-[52ch] text-lg leading-relaxed text-muted-foreground"
        style={{ "--stagger-delay": "120ms" } as React.CSSProperties}
      >
        匯整 Pinkoi、蝦皮、品牌官網等通路的台灣設計師品牌，
        從服飾、飾品到生活器物，整理在地原創設計的完整樣貌。
      </p>
    </div>
  );
}
