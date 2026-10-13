import type { Metadata } from "next";
import { Cairo, Tajawal } from "next/font/google";
import "./globals.css";

const arabicSans = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const arabicHeading = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["600", "700", "800"],
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
    <html lang="ar" dir="rtl" className={`${arabicSans.variable} ${arabicHeading.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}

