export function HomeHeroHeadline() {
  return (
    <div className="flex flex-col gap-6">
      <div className="animate-in delay-60 ease-sine-out animation-duration-900 fill-mode-both blur-in-4 fade-in slide-in-from-bottom-3">
        <h1 className="font-hero text-8xl tracking-tight text-foreground">
          發現台灣原創品牌
        </h1>
      </div>

      <p className="max-w-[52ch] animate-in font-body-lg text-lg leading-relaxed text-muted-foreground delay-120 ease-sine-out animation-duration-900 fill-mode-both blur-in-4 fade-in slide-in-from-bottom-3">
        匯整 Pinkoi、蝦皮、品牌官網等通路的台灣設計師品牌，
        從服飾、飾品到生活器物，整理在地原創設計的完整樣貌。
      </p>
    </div>
  );
}
