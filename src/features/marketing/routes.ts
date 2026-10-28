export const marketingRoutes = [
  { id: "overview", segment: "", title: "دليل رحلتك", description: "اكتشف كيف تبدأ، وكيف تواصل التعلّم في المركز.", group: "public" },
  { id: "orientation", segment: "orientation", title: "ابدأ من اهتماماتك", description: "توجيه اختياري لاستكشاف المسارات، دون اختبار قبول أو شروط تسجيل.", group: "public" },
  { id: "tracks", segment: "tracks", title: "مسار يناسب رحلتك", description: "تعرف إلى قصة كل مسار وهدفه والفيديو التعريفي الخاص به.", group: "public" },
  { id: "challenges", segment: "challenges", title: "خطوة صغيرة للبداية", description: "استكشف فكرة التحديات المجانية قبل اختيار رحلتك الكاملة.", group: "public" },
  { id: "stories", segment: "stories", title: "قصص تستحق أن تُروى", description: "مساحة لقصص حقيقية تُنشر بعد التحقق والموافقة.", group: "public" },
  { id: "companions", segment: "companions", title: "رفيق العلم", description: "تعلّم بصحبة مجموعة ومرشد، مع متابعة أسبوعية.", group: "public" },
  { id: "badges", segment: "badges", title: "علامات على الطريق", description: "تعرف إلى فكرة المستويات والشارات، دون افتراض نقاط أو إنجازات مكتسبة.", group: "public" },
  { id: "seasons", segment: "seasons", title: "لكل موسم بداية", description: "حملات للتعريف بالمحتوى، وليست مواعيد تقيد التسجيل.", group: "public" },
  { id: "family", segment: "family", title: "نتعلّم معًا", description: "استكشف تجربة الأسرة مع الحفاظ على خصوصية كل متعلم.", group: "public" },
  { id: "scholarships", segment: "scholarships", title: "فرصة للتعلّم", description: "تعرف إلى مساحة المنح التعليمية، دون وعود بأهلية أو تمويل غير معتمد.", group: "public" },
  { id: "track-editor", segment: "track-editor", title: "بطاقة المسار", description: "جرّب تحرير بطاقة تعريف المسار والفيديو المصاحب في معاينة محلية.", group: "tools" },
  { id: "notifications", segment: "notifications", title: "رسالة إلى طلابك", description: "صمم الرسالة وراجع جمهورًا تجريبيًا قبل أي إرسال فعلي.", group: "tools" },
  { id: "meeting", segment: "meeting", title: "مجلس العلم المباشر", description: "واجهة لقاء داخل المركز، مع توضيح حالة جاهزية الانضمام.", group: "tools" },
  { id: "certificate", segment: "certificate", title: "الشهادة ورمز التحقق", description: "نموذج شهادة يحمل رمزًا قابلًا للمسح، دون إصدار شهادة حقيقية.", group: "tools" },
  { id: "verify", segment: "verify", title: "قراءة رمز الشهادة", description: "هذه نتيجة معاينة للرمز، وليست سجل تحقق من شهادة صادرة.", group: "tools" },
] as const;
export type MarketingPageId = typeof marketingRoutes[number]["id"];
export type PublicMarketingPageId = Exclude<MarketingPageId, "track-editor" | "notifications" | "meeting" | "certificate" | "verify">;
export type ToolsMarketingPageId = Exclude<MarketingPageId, PublicMarketingPageId>;
export function marketingHref(id: MarketingPageId) {
  const route = marketingRoutes.find(item => item.id === id)!;
  return `/preview/marketing${route.segment ? `/${route.segment}` : ""}`;
}
export function resolveMarketingRoute(section: string[] = []) {
  if (section.length > 1) return undefined;
  return marketingRoutes.find(item => item.segment === (section[0] ?? ""));
}

export type MarketingAudience = "student" | "teacher" | "admin";
/** Navigation context only; server permissions still govern real operations. */
export function marketingAudience(id: MarketingPageId, context?: string): MarketingAudience {
  if (id === "track-editor") return "admin";
  if (id === "notifications" || (id === "meeting" && context === "teacher")) return "teacher";
  return "student";
}
export function marketingNavigation(audience: MarketingAudience) {
  return marketingRoutes.filter(route => audience === "teacher"
    ? route.id === "notifications" || route.id === "meeting"
    : audience === "admin" ? route.id === "track-editor"
    : marketingAudience(route.id) === "student");
}
export function marketingAudienceHref(id: MarketingPageId, audience: MarketingAudience) {
  return marketingHref(id) + (id === "meeting" && audience === "teacher" ? "?audience=teacher" : "");
}
