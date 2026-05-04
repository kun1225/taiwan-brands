# 設計系統：Taiwan Brands

## 1. 視覺氛圍

克制、礦物感的品牌策展氛圍，像一本放在清水模展架上的在地選品年鑑。資訊密度維持中高但不擁擠，靠灰階層次、細線結構與模組分組建立可掃讀性。動態存在感偏低到中等，以柔順滑入、微幅位移與節奏化 stagger 為主，讓介面感覺有生命但不搶走品牌內容本身。

## 2. 色彩系統

- primary（#2A4060）— 台灣藍靛：唯一強調色，只用於 CTA、active 狀態、focus ring、少量可點擊品牌標記
- background（#E7E5E4）— 水泥灰：主要背景底色，使用偏淺 `zinc` 灰階營造清水模與展場牆面感
- surface（#F5F5F4）— 礦霧灰白：卡片、篩選面板、區塊容器填色，需略亮於背景形成溫和分層
- foreground（#18181B）— 炭墨黑：主要標題、重要文字與高權重 UI
- muted（#71717A）— 鋅灰：次要文字、說明、metadata、空狀態輔助文案
- border（#CFCFD4）— 水泥細線：卡片邊框、分隔線、輸入框結構線

## 3. 字型規則

- 字體 token 名稱必須直接對應語義層級，禁止把多個層級共用成 `font-sans` 或 `font-display`
- 本專案以繁體中文內容為主、品牌名稱與少量 UI 英文為輔；標題可使用 Latin grotesk，正文一律使用 CJK stack，避免英文字型硬套中文
- **Hero：** `font-hero` → `Geist, "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif` — `text-6xl font-bold tracking-tight` — 首屏主標語、品牌策展宣言，每頁最多出現一次
- **Title：** `font-title` → `Geist, "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif` — `text-4xl font-semibold tracking-tight` — Section 標題、頁面 H1、主模組名稱
- **Subtitle：** `font-subtitle` → `"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif` — `text-2xl font-medium tracking-tight` — 卡片標題、H2/H3、品牌群組小標
- **Body-lg：** `font-body-lg` → `"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif` — `text-lg leading-relaxed max-w-[65ch]` — 首屏引言、品牌故事摘要、策展說明
- **Body-sm：** `font-body-sm` → `"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif` — `text-base leading-relaxed max-w-[65ch]` — 一般正文、列表說明、表單 helper text
- **Caption：** `font-caption` → `"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif` — `text-sm leading-normal text-muted` — 地區、類別、日期、資料來源、補充描述
- **Label：** `font-label` → `Geist, "Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif` — `text-sm font-medium tracking-wide` — 按鈕文字、tag、badge、表單 label、篩選器名稱
- **Mono：** `font-mono` → `"Geist Mono", "SFMono-Regular", monospace` — `text-sm` — 統計數字、索引編號、slug、時間戳記
- 數字密度高的區塊（排行榜、資料表、指標列）一律切換到 `font-mono`
- **禁用：** Inter、通用 serif（`Times New Roman`、`Georgia`、`Garamond`）、任何帶強烈裝飾性的展示字體；本專案不使用 serif-backed title tokens

## 4. 元件樣式

所有帶顏色語意的 class（`text-*`、`bg-*`、`border-*`、`ring-*`、`shadow-*`、`hover:*`、`focus:*`、`active:*`、`from-*`/`to-*` 等）一律只能使用第 2 節定義的語義 token。

禁止範例：`text-zinc-900`、`bg-white`、`border-zinc-200`、`hover:bg-zinc-100`、`text-[#ddd]`、`ring-zinc-400`

- **主要按鈕：** `bg-primary text-background px-6 py-2.5 rounded-xl font-medium transition-all duration-200 hover:bg-primary/90 active:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary` — 綠色只留給主要 CTA、品牌申請登錄、探索入口；禁止把綠色擴散到一般文字或大面積背景
- **次要按鈕：** `bg-transparent text-foreground border border-border px-6 py-2.5 rounded-xl font-medium transition-all duration-200 hover:bg-surface active:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary` — 用於次要導覽、篩選切換、返回列表
- **卡片：** `rounded-2xl border border-border bg-surface p-6 shadow-sm shadow-border/40 hover:shadow-md hover:shadow-border/25 transition-shadow duration-200` — 品牌卡以灰階層次與結構感優先，不靠厚重陰影；高密度列表改用 `border-t border-border` 分隔線取代卡片堆疊

## 5. 版面原則

Grid 優先的響應式架構，外層容器統一使用 `max-w-8xl mx-auto`。首頁與分類頁優先採用左對齊或非對稱 split 版面，例如「主策展內容 + 窄側欄篩選」或「大圖文主敘事 + 交錯品牌模組」，避免全頁置中的 SaaS hero 模板。大面積區塊先用 `bg-background` 建立水泥灰底，再以 `bg-surface` 疊出模組層次，標題與主導覽維持 `text-foreground` 近黑，綠色不得作為 section 大面積底色。品牌列表禁止三欄等寬卡片，改用雙欄錯位、大小卡混排或橫向卷動模組建立策展節奏。所有多欄版面在 `md:` 以下收合為單欄，互動元素一律 `min-h-11`，主要 section 垂直間距以 `py-16` 至 `py-24` 為基準，讓資訊密度高但仍保有呼吸感。

## 6. 動態與互動

CSS 優先，僅在需要彈簧物理、交錯編排或無限循環時使用 Motion library。整體動態哲學是「編輯式流動感」而非產品發表會式戲劇效果：hover 採 `cubicOut`，區塊進場以 `cubicOut` 或 `quartOut` 建立乾淨落點，跨區切換才使用 `cubicInOut`。品牌卡、filter chip、分頁導覽只做 `transform` 與 `opacity` 變化，位移控制在 `translate-y-[2px]` 到 `translate-y-[6px]` 之間；hero 文案、section 標題、卡片群可用 40–80ms stagger 製造策展節奏。小型回饋元件如 toast、收藏提示可用 `backOut` 或 `transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1 }}`，但禁止整頁漂浮、持續脈衝或會分散注意力的裝飾動畫。

## 7. 禁用模式

- 禁用 emoji
- 禁用 `Inter`、`Times New Roman`、`Georgia`、`Garamond`
- 禁用純黑 `#000000` 與高對比死白 `#FFFFFF` 直接鋪滿整頁
- 禁用紫色 / 藍色霓虹、outer glow、玻璃擬態發光邊框
- 禁用高飽和多重 accent；全站只允許一個主強調色
- 禁用把綠色用在大面積背景、長段正文、主標題；綠色只保留給 CTA 與小面積互動提示
- 禁用大型 gradient text 標題與彩虹式漸層背景
- 禁用置中單柱 SaaS hero 套板；優先左對齊與非對稱版面
- 禁用三欄等寬品牌卡；改用雙欄 zig-zag、大小混排或橫向卷動
- 禁用元素彼此重疊、漂浮貼片、裝飾性懸浮 badge
- 禁用通用佔位名稱如 `John Doe`、`Acme`、`Nexus`
- 禁用捏造數據；資料未知時使用 `[metric]`、`[brand count]`、`[founded year]`
- 禁用 `LABEL // YEAR` 排版格式
- 禁用 AI 文案陳腔濫調，如「Elevate」「Seamless」「Unleash」「Next-Gen」
- 禁用「Scroll to explore」、跳動箭頭、無意義視差卷動
- 禁用失效 Unsplash 圖片；示意圖使用 `picsum.photos`、品牌自有圖或簡單 SVG avatar
