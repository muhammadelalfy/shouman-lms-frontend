import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { marketingAudienceHref, marketingRoutes, type MarketingPageId } from "./routes";

const placements = {
  landing: ["orientation", "tracks", "challenges", "scholarships"],
  student: ["orientation", "tracks", "challenges", "companions", "badges", "family", "scholarships", "seasons", "meeting", "certificate"],
  teacher: ["notifications", "meeting"],
  admin: ["track-editor"],
} as const satisfies Record<string, readonly MarketingPageId[]>;

/** Discovery links only: no role assignment, private records or live operations. */
export function MarketingDiscovery({ audience }: { audience: keyof typeof placements }) {
  const heading = audience === "landing" ? "اختر بداية تناسب رحلتك" : audience === "student" ? "اكتشف المزيد في رحلتك" : audience === "teacher" ? "أدوات التواصل مع طلابك" : "بطاقة المسار والفيديو التعريفي";
  return <section aria-labelledby={`marketing-${audience}-title`} className="my-8 min-w-0" data-marketing-audience={audience}>
    <div className="mb-6"><p className="mb-2 text-xs font-bold text-muted-foreground">{audience === "landing" ? "قبل أن تبدأ" : "مساحتك في المركز"}</p><h2 id={`marketing-${audience}-title`} className="text-2xl font-extrabold text-primary sm:text-3xl">{heading}</h2><p className="mt-3 text-sm leading-7 text-muted-foreground">{audience === "landing" ? "تعرّف إلى المسارات، واستكشف اهتماماتك وفرص التعلّم. سجّل الدخول أو أنشئ حسابًا لفتح هذه التجارب التوضيحية." : "معاينات للتصميم والتجربة؛ لا تُرسل إشعارات أو تُصدر شهادات أو تنفذ عمليات حقيقية."}</p></div>
    <div className={`grid min-w-0 gap-4 sm:grid-cols-2 ${audience === "teacher" ? "xl:grid-cols-2" : "xl:grid-cols-3"}`}>{placements[audience].map(id => {
      const route = marketingRoutes.find(item => item.id === id)!;
      return <Link href={marketingAudienceHref(id, audience === "landing" ? "student" : audience)} key={id} className="group flex min-w-0 flex-col rounded-2xl border border-border bg-card p-6 text-start transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
        <BookOpen size={22} aria-hidden="true" className="mb-4 text-primary" /><h3 className="text-base font-bold text-primary">{route.title}</h3><p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">{route.description}</p><span className="mt-5 flex items-center gap-2 text-xs font-bold text-primary">{audience === "landing" ? "ابدأ التجربة بعد تسجيل الدخول" : "استكشف المعاينة"}<ArrowLeft size={16} aria-hidden="true" /></span>
      </Link>;
    })}</div>
  </section>;
}
