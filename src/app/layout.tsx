import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Noto_Sans_TC,
  Noto_Serif_TC,
} from "next/font/google";

import { Footer } from "@/layouts/footer";
import { Header } from "@/layouts/header";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const notoSerifTC = Noto_Serif_TC({
  variable: "--font-noto-serif-tc",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "台灣在地品牌 | 發現值得支持的台灣在地原創品牌",
  description:
    "從生活選物到風格品牌，整理值得關注的台灣品牌與產品資訊，讓你更省力地探索、比較，並找到下一步想深入了解的品牌。",
  keywords: [
    "台灣品牌",
    "台灣原創品牌",
    "台灣設計品牌",
    "在地品牌",
    "台灣設計師",
    "台灣選物",
    "Pinkoi 品牌",
    "台灣生活風格",
    "台灣文創品牌",
    "支持台灣品牌",
  ],
  authors: [{ name: "ThisWeb", url: "https://thisweb.dev" }],
  creator: "ThisWeb",
  openGraph: {
    title: "台灣在地品牌 — 發現值得支持的台灣在地原創品牌",
    description:
      "從生活選物到風格品牌，整理值得關注的台灣品牌與產品資訊，讓你更省力地探索、比較，並找到下一步想深入了解的品牌。",
    type: "website",
    locale: "zh_TW",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "台灣在地品牌 — 發現值得支持的台灣在地原創品牌",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "台灣在地品牌 — 發現值得支持的台灣在地原創品牌",
    description:
      "從生活選物到風格品牌，整理值得關注的台灣品牌與產品資訊，讓你更省力地探索、比較，並找到下一步想深入了解的品牌。",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-TW"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansTC.variable} ${notoSerifTC.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
