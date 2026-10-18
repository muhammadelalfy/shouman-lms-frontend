import type { Metadata } from "next";
import Link from "next/link";
import { PlatformFrame } from "@/features/pages/page-shell";

export const metadata: Metadata = { title: "الصفحة غير موجودة", robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <PlatformFrame>
      <main id="platform-main" className="platform-main platform-error-page">
        <p className="platform-eyebrow">404 · الصفحة غير موجودة</p>
        <h1>لم نعثر على هذه الصفحة</h1>
        <p>قد يكون الرابط غير صحيح أو أن الصفحة لم تعد متاحة.</p>
        <nav aria-label="روابط مساعدة">
          <Link href="/">العودة للرئيسية</Link>
          <Link href="/catalog">استعراض الفهرس</Link>
        </nav>
      </main>
    </PlatformFrame>
  );
}
