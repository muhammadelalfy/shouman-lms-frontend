"use client";
import Link from "next/link";
import { IslamicPattern } from "@/components/ui/islamic-pattern";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { ArrowRight, BookOpen, Compass } from "lucide-react";
import { PreviewNotice } from "@/features/experience/shared/ui";
import { marketingRoutes, marketingNavigation, marketingAudienceHref, type MarketingAudience, type MarketingPageId } from "./routes";

export function MarketingShell({ current, children, audience }: { current: MarketingPageId; children: ReactNode; audience: MarketingAudience }) {
  const router = useRouter();
  const route = marketingRoutes.find(item => item.id === current)!;
  const sections = marketingNavigation(audience);
  const home = audience === "teacher" ? { href: "/instructor", label: "لوحة المعلم" } : audience === "admin" ? { href: "/preview/admin/dashboard", label: "لوحة الإدارة" } : { href: "/preview/dashboard", label: "لوحة الطالب" };
  return <div className={`mk-root${audience === "teacher" ? " mk-root--teacher" : ""}`} dir="rtl" lang="ar">
    {audience === "teacher" && <IslamicPattern className="islamic-pattern-teacher" />}
    <div className="mk-container">
      <div className="mk-topline"><Link href={home.href}><ArrowRight size={17} aria-hidden="true" />{home.label}</Link><span>مساحتك في المركز</span><Link href="/catalog">الفهرس التعليمي</Link></div>
      <header className="mk-hero"><span className="mk-hero-mark" aria-hidden="true"><BookOpen size={32} /></span><div><p className="mk-eyebrow">العلم يبدأ بخطوة</p><h1>{route.title}</h1><p>{route.description}</p></div><span className="mk-hero-seal" aria-hidden="true">علمٌ<br />وأثر</span></header>
      <PreviewNotice />
      <div className="mk-mobile-nav"><label htmlFor="marketing-section">استكشف الأقسام</label><select id="marketing-section" value={current} onChange={event => router.push(marketingAudienceHref(event.target.value as MarketingPageId, audience))}>{sections.map(item => <option value={item.id} key={item.id}>{item.title}</option>)}</select></div>
      <div className="mk-layout"><aside className="mk-sidebar"><nav aria-label="أقسام رحلة المركز"><div className="mk-nav-group"><p>{home.label}</p>{sections.map(item => <Link href={marketingAudienceHref(item.id, audience)} key={item.id} aria-current={item.id === current ? "page" : undefined}>{item.title}<span aria-hidden="true">←</span></Link>)}</div></nav><div className="mk-sidebar-note"><Compass size={19} aria-hidden="true" /><p>{audience === "student" ? "استكشف بحرية. التوجيه لا يقيّد التسجيل." : "معاينة أدوات العمل؛ لا تنفذ عمليات حقيقية."}</p></div></aside><div className="mk-content" key={current}>{children}</div></div>
    </div>
  </div>;
}
