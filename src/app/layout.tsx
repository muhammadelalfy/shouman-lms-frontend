import { ThemeSync } from "@/components/theme/theme-toggle";
import { themeBootstrap } from "@/components/theme/bootstrap";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Amiri, Cairo } from "next/font/google";
import "./globals.css";

const arabicHeading = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const quranFont = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "مركز د. حازم شومان | رحلة علم وتربية وصناعة أثر",
    template: "%s | مركز د. حازم شومان",
  },
  description: "مركز إسلامية رقمية مجانية: مسارات تعليمية، مبادرات وبرامج موسمية، وشهادات إتمام.",
  openGraph: {
    title: "مركز د. حازم شومان",
    description: "رحلة علم .. وتربية .. وصناعة أثر — مركز إسلامية مجانية للشباب.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning lang="ar" dir="rtl" className={`${arabicHeading.variable} ${quranFont.variable} h-full antialiased`}>
      <head><script dangerouslySetInnerHTML={{ __html: themeBootstrap }} /></head>
      <body suppressHydrationWarning className="flex min-h-full flex-col font-sans"><ThemeSync />{children}</body>
    </html>
  );
}
