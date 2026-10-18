import type { Metadata } from "next";
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
    default: "أكاديمية د. حازم شومان | رحلة علم وتربية وصناعة أثر",
    template: "%s | أكاديمية د. حازم شومان",
  },
  description: "أكاديمية إسلامية رقمية مجانية: مسارات تعليمية، مبادرات وبرامج موسمية، وشهادات إتمام.",
  openGraph: {
    title: "أكاديمية د. حازم شومان",
    description: "رحلة علم .. وتربية .. وصناعة أثر — أكاديمية إسلامية مجانية للشباب.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl" className={`${arabicHeading.variable} ${quranFont.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
