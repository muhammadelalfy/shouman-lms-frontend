"use client";

import Link from "next/link";

export default function PlatformError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main id="platform-main" className="platform-error-page" dir="rtl"><p className="platform-eyebrow">مركز د. حازم شومان</p><h1>تعذر عرض الصفحة الآن</h1><p role="alert">حدث خطأ أثناء تجهيز الصفحة. يمكنك إعادة المحاولة أو استعراض بقية الواجهات.</p><nav aria-label="استعادة الصفحة"><button type="button" className="button button-primary" onClick={reset}>إعادة المحاولة</button><Link href="/preview">جميع الواجهات</Link><Link href="/">الرئيسية</Link></nav></main>;
}
