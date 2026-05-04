export function HomeHeroHeadline() {
  return (
    <div className="flex flex-col gap-6">
      <div className="animate-in delay-60 ease-sine-out animation-duration-900 fill-mode-both blur-in-4 fade-in slide-in-from-bottom-3">
        <h1 className="font-hero text-[clamp(48px,10vw,96px)] leading-[1.2em] font-medium tracking-tight text-foreground">
          發現、支持
          <br />
          <span className="text-primary">台灣在地原創品牌</span>
        </h1>
      </div>

      <p className="max-w-[52ch] animate-in font-body text-xl leading-relaxed text-muted-foreground delay-120 ease-sine-out animation-duration-900 fill-mode-both blur-in-4 fade-in slide-in-from-bottom-3">
        從生活選物到風格品牌，整理值得關注的台灣品牌與產品資訊，讓你更省力地探索、比較，並找到下一步想深入了解的品牌。
      </p>
    </div>
  );
}
