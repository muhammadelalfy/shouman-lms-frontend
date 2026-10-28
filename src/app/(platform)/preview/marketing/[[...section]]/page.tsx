import Link from "next/link";
import { verifyMarketingAccess } from "@/features/auth/marketing-access";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PlatformFrame } from "@/features/pages/page-shell";
import { MarketingShell } from "@/features/marketing/shell";
import { marketingHref, marketingAudience, resolveMarketingRoute, type PublicMarketingPageId, type ToolsMarketingPageId } from "@/features/marketing/routes";
import { PublicMarketingPage } from "@/features/marketing/public/public-pages";
import { MarketingToolsPage } from "@/features/marketing/tools/tools-pages";
import "@/features/experience/shared/experience.css";
import "@/features/marketing/marketing.css";

type Props = { params: Promise<{ section?: string[] }>; searchParams: Promise<{ audience?: string }> };
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const route = resolveMarketingRoute((await params).section);
  return { title: route?.title ?? "الصفحة غير موجودة", robots: { index: false, follow: false } };
}
export default async function MarketingPage({ params, searchParams }: Props) {
  const route = resolveMarketingRoute((await params).section);
  if (!route) notFound();
  const access = await verifyMarketingAccess(route.id);
  if (access !== "available") return <PlatformFrame><main id="platform-main" className="platform-main"><section className="xp-card"><h1>{access === "forbidden" ? "حسابك لا يتيح الوصول الآن" : "تعذر التحقق من جلسة الدخول"}</h1><p>لم يُفتح المحتوى. يمكنك إعادة المحاولة أو العودة إلى الصفحة الرئيسية.</p><Link href={marketingHref(route.id)} className="xp-button">إعادة المحاولة</Link><Link href="/" className="xp-button xp-button-outline">الصفحة الرئيسية</Link></section></main></PlatformFrame>;
  return <PlatformFrame><main id="platform-main"><MarketingShell current={route.id} audience={marketingAudience(route.id, (await searchParams).audience)}>{route.group === "public" ? <PublicMarketingPage page={route.id as PublicMarketingPageId} /> : <MarketingToolsPage page={route.id as ToolsMarketingPageId} />}</MarketingShell></main></PlatformFrame>;
}
