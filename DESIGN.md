# 設計系統：Taiwan Brands

## 1. 視覺氛圍

克制的策展型品牌索引首頁，主軸左對齊，資訊節奏清楚但不冰冷。整體情緒應該像一本整理完整的當代地方品牌選物誌：安靜、可信、耐看，讓使用者一進站就知道這裡是探索台灣品牌的入口，而不是促銷型 landing page。

資訊密度採中低密度，首頁前段只保留必要主張，主要空間留給搜尋、篩選、排序與品牌列表。動態強度採穩定流動而非戲劇化展示，所有互動應該像高品質索引介面：有回饋、有節奏，但不搶內容。

## 2. 色彩系統

- primary（#31594A）— 深林綠：唯一強調色，用於 CTA、active 狀態、focus ring、已選篩選條件與互動重點
- background（#E7E5E4）— 礦物灰：整體畫布底色，建立安靜、可信、帶地方質感的基調
- surface（#FAFAF9）— 霧白石：搜尋區、品牌列表容器、局部面層，用來拉開資訊層次
- foreground（#18181B）— 炭墨黑：主要標題、品牌名稱、重點文字
- muted（#52525B）— 石墨灰：一般內文、說明、列表輔助資訊
- border（#D6D3D1）— 細霧灰：搜尋框、篩選器、卡片與分隔線的結構邊界

色彩固定使用單一 Stone / Zinc 中性色譜搭配深綠強調，不引入第二強調色，不做紫色、藍紫色、霓虹色或高飽和漸層。`surface` 可局部提亮到 `#FFFFFF` 作輸入框或選單內層，但不可把純白當成整站主背景；同時禁止使用純黑 `#000000` 當大面積背景。

## 3. 字型規則

- **Hero：** `font-display` → `Noto Serif TC` — `text-5xl md:text-6xl font-semibold tracking-tight text-zinc-950` — 僅用於首頁主標題或單頁最重要的策展宣言，每頁最多一次
- **Title：** `font-display` → `Noto Serif TC` — `text-3xl md:text-4xl font-semibold tracking-tight text-zinc-950` — 用於主要區塊標題、策展型 H1 / H2，不可用於功能性 UI
- **Subtitle：** `font-sans` → `Noto Sans TC` — `text-xl md:text-2xl font-medium tracking-tight text-zinc-950` — 用於品牌卡標題、模組標題、列表區段標題
- **Body-lg：** `font-sans` → `Noto Sans TC` — `text-lg leading-relaxed max-w-[65ch] text-zinc-600` — 用於首頁導言、品牌故事摘要、較長段落的開場文字
- **Body-sm：** `font-sans` → `Noto Sans TC` — `text-base leading-relaxed max-w-[65ch] text-zinc-600` — 用於一般內文、表單說明、列表摘要
- **Caption：** `font-sans` → `Noto Sans TC` — `text-sm leading-normal text-zinc-500` — 用於分類、地區、附註、次要 metadata
- **Label：** `font-sans` → `Noto Sans TC` — `text-sm font-medium tracking-wide text-zinc-700` — 用於按鈕文字、篩選標籤、表單 label
- **Mono：** `font-mono` → `Geist Mono` — `text-sm text-zinc-600` — 用於品牌數量、英文 slug、排序代碼、時間戳記與高密度數字資訊

字體策略以 `Noto Sans TC` 作為全站骨架，優先確保繁體中文的可讀性與穩定節奏；`Noto Serif TC` 只出現在 Hero 與 Title，作為明確的策展語氣，而不是把整站做成文學化排版。當頁面資訊密度提高時，數字與代碼統一切到 `font-mono`，避免字寬不一致造成節奏鬆散。

禁用：`Inter`、未經定義的通用系統 sans、`Times New Roman`、`Georgia`、`Garamond`、把整站大段內文改成 serif、把篩選器與表單控制項做成 display typography。

## 4. 元件樣式

- **按鈕：** 主要按鈕使用 `bg-[#31594A] text-white px-6 py-2.5 rounded-xl font-medium min-h-[44px] transition-[transform,background-color,color,border-color] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] active:-translate-y-px hover:bg-[#294B3E]`，用於 `載入更多`、主要 CTA。次要按鈕使用 `border border-stone-300 bg-stone-50 text-zinc-950 px-5 py-2.5 rounded-xl min-h-[44px]`，不用外發光。
- **搜尋框：** `h-12 rounded-xl border border-stone-300 bg-white px-4 text-zinc-950 placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#31594A]/30`，優先給清楚輸入與穩定 focus 狀態，不做厚重陰影。
- **篩選 / 排序控制：** `h-11 rounded-xl border border-stone-300 bg-stone-50 px-4 text-sm text-zinc-700`，active 狀態可切換為 `border-[#31594A] bg-[#31594A]/8 text-[#31594A]`。
- **品牌卡片：** `rounded-2xl border border-stone-300/80 bg-stone-50 p-5 transition-[transform,border-color,background-color] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-0.5 hover:border-[#31594A]/40`。卡片優先清楚呈現品牌名稱、分類、摘要與必要連結，不依賴陰影浮起。
- **列表容器：** `rounded-3xl border border-stone-300/70 bg-stone-50/80 p-4 md:p-6`，讓首頁列表區像被整理好的索引區塊，而不是商城商品牆。

卡片內部避免堆太多裝飾資訊。若內容密度升高，優先增加字級層次與留白，不增加多餘 badge、icon 背板或裝飾線條。

## 5. 版面原則

首頁採左對齊、單主軸的策展式閱讀節奏，不做滿版置中 hero，不做三欄等寬宣傳卡。推薦骨架如下：

- 第一區：網站標題、一句價值主張、極短說明
- 第二區：搜尋、類別篩選、排序工具列
- 第三區：品牌列表
- 第四區：`載入更多` 按鈕與列表延伸

版面使用 `max-w-7xl mx-auto px-5 md:px-8 lg:px-10` 控制寬度。首頁前段可使用 `max-w-3xl` 保持文案集中，列表區再擴張到較寬內容區。桌機可用 `md:grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.9fr)]` 建立標題與內容的非對稱節奏，但 `md:` 以下必須全部收合為單欄。

禁止元素重疊、禁止浮動式裝飾塊、禁止三欄等寬品牌卡水平排滿。品牌列表應優先使用單欄或雙欄的不對稱節奏；若內容量上升，也應先增加垂直節奏，而不是塞成緊密矩陣。

## 6. 動態與互動

互動原則採 CSS 優先，動態目標是讓首頁感覺流動、可探索，但不破壞閱讀秩序。

- **Hover：** `transition-[transform,background-color,color,border-color,opacity] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]`
- **進場 & 離場：** `transition-[transform,opacity] duration-300 ease-out`
- **列表載入更多：** 新增卡片以 `opacity` + `translateY(8px)` 進場，避免整屏跳動
- **跨區塊滾動節奏：** 僅使用微弱視覺分段，不做視差 hero、不做大幅背景滾動
- **Spring 預設（Motion）：** `transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1 }}`
- **快速 Spring（Motion）：** `transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.5 }}`

`載入更多` 的互動必須明確可控：按下後顯示 loading 狀態、補上新卡片、維持閱讀位置穩定。所有動畫只允許使用 `transform` 與 `opacity`，禁止動畫 `top`、`left`、`width`、`height`。

## 7. 禁用模式

- 禁用 emoji
- 禁用 `Inter`
- 禁用把整站大段中文內容設成 serif
- 禁用 `Times New Roman`、`Georgia`、`Garamond`
- 禁用純黑 `#000000` 作為大面積底色
- 禁用霓虹色、紫色發光、藍紫漸層、outer glow
- 禁用超高飽和綠色或多強調色並存
- 禁用大型 gradient text 標題
- 禁用自訂滑鼠游標
- 禁用元素重疊與漂浮裝飾塊
- 禁用三欄等寬品牌卡列表
- 禁用假資料、假統計、假百分比、假品牌指標
- 禁用「最強」「頂級」「爆款」「顛覆」這類電商或 AI 行銷陳腔濫調
- 禁用 `LABEL // YEAR` 這種懶惰 AI 排版格式
- 禁用「Scroll to explore」「Swipe down」這種 filler UI 文案
- 禁用自動無限滾動；首頁列表只能用明確 `載入更多` 控制
