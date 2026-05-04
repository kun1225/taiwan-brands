const productCategoryRules = [
  {
    label: "包袋",
    keywords: ["包包", "背包", "提袋", "托特", "帆布袋", "皮件", "錢包"],
  },
  {
    label: "服飾",
    keywords: ["衣", "褲", "裙", "外套", "罩衫", "洋裝", "襯衫", "T恤", "襪"],
  },
  {
    label: "鞋履",
    keywords: ["鞋", "雨鞋", "拖鞋", "涼鞋"],
  },
  {
    label: "飾品",
    keywords: ["耳環", "項鍊", "手環", "戒指", "飾品", "珠寶", "銀飾"],
  },
  {
    label: "茶飲食品",
    keywords: [
      "茶葉",
      "茶包",
      "咖啡",
      "餅乾",
      "巧克力",
      "可可",
      "鮮乳",
      "牛奶",
      "乳品",
      "乳製",
      "果醬",
      "食品",
      "甜點",
      "香料",
    ],
  },
  {
    label: "居家生活用品",
    keywords: ["家具", "椅", "燈", "地墊", "沙發", "餐具", "碗", "杯", "盤"],
  },
  {
    label: "家飾寢具",
    keywords: ["抱枕", "寢具", "床包", "被套", "枕套", "窗簾", "掛布"],
  },
  {
    label: "保養美妝",
    keywords: ["保養", "美妝", "護唇", "香水", "精油", "洗卸"],
  },
  {
    label: "香氛清潔",
    keywords: ["香氛", "香薰", "蠟燭", "擴香", "線香", "清潔", "洗衣", "洗碗"],
  },
  {
    label: "文具設計",
    keywords: ["文具", "手冊", "海報", "字體", "出版", "紙品"],
  },
  {
    label: "玩具童用品",
    keywords: ["玩具", "兒童", "寶寶", "親子", "餐具"],
  },
  {
    label: "寵物用品",
    keywords: ["寵物", "毛孩", "貓", "狗", "貓砂", "牽繩", "飼料", "罐頭"],
  },
  {
    label: "戶外運動用品",
    keywords: ["泳衣", "戶外", "運動", "機能", "旅行"],
  },
  {
    label: "旅行用品",
    keywords: ["行李箱", "旅行收納", "護照夾", "旅行枕", "登機", "露營"],
  },
  {
    label: "3C 配件",
    keywords: [
      "手機殼",
      "手機架",
      "充電器",
      "充電線",
      "耳機",
      "鍵盤",
      "滑鼠",
      "支架",
    ],
  },
  {
    label: "樂器與音樂用品",
    keywords: ["吉他", "樂器", "音樂"],
  },
  {
    label: "眼鏡配件",
    keywords: ["眼鏡", "墨鏡", "鏡框", "眼鏡盒"],
  },
  {
    label: "園藝植栽",
    keywords: ["植栽", "盆栽", "花器", "園藝", "多肉", "觀葉"],
  },
  {
    label: "收藏擺件",
    keywords: ["擺件", "公仔", "雕塑", "花瓶", "器皿", "收藏"],
  },
  {
    label: "健身器材",
    keywords: ["啞鈴", "瑜珈", "瑜伽", "壺鈴", "訓練", "健身"],
  },
  {
    label: "手作材料",
    keywords: ["布料", "線材", "皮革", "五金", "材料包", "DIY"],
  },
] as const;

export function inferMainProducts(text: string | undefined) {
  if (!text) {
    return undefined;
  }

  const matches = productCategoryRules
    .filter((rule) => rule.keywords.some((keyword) => text.includes(keyword)))
    .map((rule) => rule.label);

  return Array.from(new Set(matches)).slice(0, 3).join("、") || undefined;
}
