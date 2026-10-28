import { isOfferingKind } from "@/features/pages/route-resolution";

export type ExperienceArea = "public" | "learner" | "admin" | "directory";
export type ExperienceRoute = { area: ExperienceArea; title: string; path: string[] };
export type ExperienceRouteExample = { href: string; title: string; area: Exclude<ExperienceArea, "directory"> };

export const experienceRoutes: ExperienceRouteExample[] = [
  { href: "/preview/catalog", title: "كتالوج المعاينة", area: "public" },
  { href: "/preview/catalog/demo-course", title: "تفاصيل دورة توضيحية", area: "public" },
  { href: "/faq", title: "الأسئلة الشائعة", area: "public" },
  { href: "/about", title: "عن المركز", area: "public" },
  { href: "/contact", title: "تواصل معنا", area: "public" },
  { href: "/events", title: "الفعاليات", area: "public" },
  { href: "/events/demo-event", title: "تفاصيل فعالية", area: "public" },
  { href: "/meetings", title: "اللقاءات", area: "public" },
  { href: "/meetings/demo-meeting", title: "تفاصيل اللقاء", area: "public" },
  { href: "/meetings/mine", title: "لقاءاتي", area: "public" },
  { href: "/community", title: "المجتمع التعليمي", area: "public" },
  { href: "/community/groups/demo-group", title: "المجموعة التعليمية", area: "public" },
  { href: "/community/groups/demo-group/posts/demo-post", title: "النقاش والتعليقات", area: "public" },
  { href: "/checkout/demo-course", title: "مراجعة الطلب", area: "public" },
  { href: "/checkout/demo-course/result", title: "حالات الطلب", area: "public" },
  { href: "/certificates/verify", title: "التحقق من شهادة", area: "public" },
  { href: "/verify/demo-certificate", title: "تصميم نتيجة التحقق", area: "public" },
  { href: "/preview/dashboard", title: "لوحة المتعلم", area: "learner" },
  { href: "/preview/my-learning", title: "تعلّمي", area: "learner" },
  { href: "/learning/lessons/demo-lesson", title: "مشغّل الدرس", area: "learner" },
  { href: "/quizzes", title: "اختباراتي", area: "learner" },
  { href: "/quizzes/demo-quiz", title: "أسئلة الاختبار", area: "learner" },
  { href: "/quizzes/demo-quiz/result", title: "مراجعة الإجابات", area: "learner" },
  { href: "/certificates", title: "شهاداتي", area: "learner" },
  { href: "/certificates/demo-certificate", title: "نموذج الشهادة", area: "learner" },
  { href: "/projects", title: "مشروعات التخرج", area: "learner" },
  { href: "/projects/demo-project", title: "تفاصيل المشروع", area: "learner" },
  { href: "/notifications", title: "مركز الإشعارات", area: "learner" },
  { href: "/achievements", title: "الإنجازات والشارات", area: "learner" },
  { href: "/orders", title: "الطلبات", area: "learner" },
  { href: "/preview/account", title: "إعدادات المعاينة", area: "learner" },
  { href: "/instructor", title: "مساحة المدرّس", area: "learner" },
  { href: "/supervisor", title: "مساحة المشرف", area: "learner" },
  { href: "/evaluator", title: "مساحة المقيّم", area: "learner" },
  { href: "/preview/admin/dashboard", title: "لوحة الإدارة", area: "admin" },
  { href: "/preview/admin/users", title: "إدارة المستخدمين", area: "admin" },
  { href: "/preview/admin/users/demo-user", title: "ملف المتعلم", area: "admin" },
  { href: "/preview/admin/users/new", title: "محرّر المستخدم", area: "admin" },
  { href: "/preview/admin/roles", title: "الأدوار والصلاحيات", area: "admin" },
  { href: "/preview/admin/offerings", title: "المحتوى التعليمي", area: "admin" },
  { href: "/preview/admin/offerings/new", title: "إنشاء محتوى", area: "admin" },
  { href: "/preview/admin/offerings/demo-offering", title: "محرّر المحتوى", area: "admin" },
  { href: "/preview/admin/subjects/demo-subject", title: "محرّر المادة", area: "admin" },
  { href: "/preview/admin/lessons/demo-lesson", title: "محرّر الدرس والوسائط", area: "admin" },
  { href: "/preview/admin/quizzes", title: "إدارة الاختبارات", area: "admin" },
  { href: "/preview/admin/quizzes/demo-quiz", title: "محرّر الاختبار", area: "admin" },
  { href: "/preview/admin/question-bank", title: "بنك الأسئلة", area: "admin" },
  { href: "/preview/admin/payments", title: "المدفوعات", area: "admin" },
  { href: "/preview/admin/coupons", title: "القسائم والعروض", area: "admin" },
  { href: "/preview/admin/coupons/new", title: "محرّر القسيمة", area: "admin" },
  { href: "/preview/admin/offers", title: "العروض", area: "admin" },
  { href: "/preview/admin/groups", title: "المجموعات التعليمية", area: "admin" },
  { href: "/preview/admin/groups/demo-group", title: "إدارة المجموعة", area: "admin" },
  { href: "/preview/admin/moderation", title: "مراجعة المجتمع والبلاغات", area: "admin" },
  { href: "/preview/admin/events", title: "إدارة الفعاليات", area: "admin" },
  { href: "/preview/admin/events/new", title: "محرّر الفعالية", area: "admin" },
  { href: "/preview/admin/meetings", title: "إدارة اللقاءات", area: "admin" },
  { href: "/preview/admin/attendance", title: "سجل الحضور", area: "admin" },
  { href: "/preview/admin/certificates", title: "سجل الشهادات", area: "admin" },
  { href: "/preview/admin/certificates/rules", title: "قواعد الشهادات", area: "admin" },
  { href: "/preview/admin/certificates/templates", title: "قالب الشهادة", area: "admin" },
  { href: "/preview/admin/projects", title: "مشروعات التخرج", area: "admin" },
  { href: "/preview/admin/projects/demo-project", title: "مساحة التقييم", area: "admin" },
  { href: "/preview/admin/rubrics", title: "معايير التقييم", area: "admin" },
  { href: "/preview/admin/gamification", title: "التحفيز والشارات", area: "admin" },
  { href: "/preview/admin/distinguished", title: "الطلاب المتميزون", area: "admin" },
  { href: "/preview/admin/campaigns", title: "الحملات", area: "admin" },
  { href: "/preview/admin/notifications", title: "إدارة الإشعارات", area: "admin" },
  { href: "/preview/admin/reports", title: "مكتبة التقارير", area: "admin" },
  { href: "/preview/admin/analytics", title: "التحليلات", area: "admin" },
  { href: "/preview/admin/cms", title: "محتوى الموقع", area: "admin" },
  { href: "/preview/admin/audit-log", title: "سجل التدقيق", area: "admin" },
  { href: "/preview/admin/settings", title: "إعدادات المركز", area: "admin" },
  { href: "/preview/admin/integrations", title: "التكاملات", area: "admin" },
  { href: "/preview/admin/settings/integrations", title: "إعدادات التكاملات", area: "admin" },
];

const examplesByPath = new Map(experienceRoutes.map((route) => [route.href.slice(1).replace(/^preview\/admin\//, "admin/").replace(/^preview\/(dashboard|my-learning)$/, "$1"), route]));
const adminRecordSections = new Set(["users", "offerings", "subjects", "lessons", "quizzes", "question-bank", "payments", "coupons", "offers", "groups", "events", "meetings", "attendance", "certificates", "projects", "campaigns", "notifications", "audit-log"]);
const adminEditorSections = new Set(["users", "offerings", "subjects", "lessons", "quizzes", "question-bank", "coupons", "offers", "groups", "events", "meetings", "campaigns", "notifications"]);
const learnerSections = new Set(["dashboard", "learning", "my-learning", "quizzes", "certificates", "projects", "notifications", "achievements", "orders", "instructor", "supervisor", "evaluator"]);

export function resolveExperienceRoute(slug: string[]): ExperienceRoute | null {
  let path = [...slug];
  const explicitLearnerPreview = path[0] === "preview" && path.length === 2 && ["dashboard", "my-learning"].includes(path[1]);
  if (explicitLearnerPreview) path = path.slice(1);
  if (!explicitLearnerPreview && (path.length === 1 && ["dashboard", "my-learning", "learning", "admin"].includes(path[0]) || path.join("/") === "admin/dashboard")) return null;
  const explicitAdminPreview = path[0] === "preview" && path[1] === "admin";
  if (explicitAdminPreview) path = path.slice(1);
  if (!explicitAdminPreview && path[0] === "admin" && ["users", "roles", "offerings", "subjects", "lessons", "students", "tracks", "courses", "programs", "seasonal-programs", "initiatives"].includes(path[1])) return null;
  if (path.length === 1 && path[0] === "preview") return { area: "directory", title: "جميع واجهات المركز", path };
  if (path[0] === "learning" && path.length === 1) path = ["my-learning"];
  if (path[0] === "learn") {
    if (!isOfferingKind(path[1])) return null;
    if (path.length === 3) path = ["learning", "lessons", path[2]];
    else if (path[3] === "quiz" && (path.length === 5 || path.length === 6 && path[5] === "result")) path = ["quizzes", path[4], ...(path.length === 6 ? ["result"] : [])];
    else return null;
  }
  if (path[0] === "community" && path[1] !== "groups" && path.length > 1) path = ["community", "groups", ...path.slice(1)];
  if (path[0] === "certificates" && path[1] === "verify" && path.length === 3) path = ["verify", path[2]];
  if (path[0] === "admin" && path.length === 1) path = ["admin", "dashboard"];
  if (path[0] === "admin" && ["tracks", "courses", "programs", "seasonal-programs", "initiatives"].includes(path[1])) path = ["admin", "offerings", ...path.slice(2)];
  if (path[0] === "admin" && path[1] === "students") path = ["admin", "users", ...path.slice(2)];
  if (path[0] === "admin" && ["events", "meetings"].includes(path[1]) && path.length === 4 && path[3] === "attendance") path = ["admin", "attendance", path[2]];
  const example = examplesByPath.get(path.join("/"));
  if (example) return { area: example.area, title: example.title, path };
  if (path[0] === "verify" && path.length <= 2) return { area: "public", title: "التحقق من شهادة", path };
  if (["events", "meetings", "checkout"].includes(path[0]) && path.length >= 2 && path.length <= (path[0] === "checkout" ? 3 : 2) && (path.length !== 3 || path[2] === "result")) return { area: "public", title: path[0] === "checkout" ? "مراجعة الطلب" : "تفاصيل اللقاء", path };
  if (path[0] === "community" && path[1] === "groups" && (path.length === 3 || path.length === 5 && path[3] === "posts")) return { area: "public", title: "المجموعة والنقاشات", path };
  if (path[0] === "learning" && path[1] === "lessons" && path.length === 3) return { area: "learner", title: "مشغّل الدرس", path };
  if (learnerSections.has(path[0]) && (["quizzes", "certificates", "projects"].includes(path[0]) && path.length === 2 || path[0] === "quizzes" && path.length === 3 && path[2] === "result")) return { area: "learner", title: path[0] === "quizzes" ? "الاختبار والمراجعة" : path[0] === "projects" ? "تفاصيل المشروع" : "نموذج الشهادة", path };
  if (path[0] === "admin" && adminRecordSections.has(path[1]) && path.length === 3 && (path[2] !== "new" || adminEditorSections.has(path[1]))) return { area: "admin", title: `${examplesByPath.get(`admin/${path[1]}`)?.title ?? "الإدارة"} — التفاصيل`, path };
  if (path[0] === "admin" && adminEditorSections.has(path[1]) && path.length === 4 && path[2] !== "new" && path[3] === "edit") return { area: "admin", title: `${examplesByPath.get(`admin/${path[1]}`)?.title ?? "الإدارة"} — تحرير`, path };
  return null;
}

/** Component ownership and navigation surface differ for shared community screens. */
export function workspaceForExperience(route: ExperienceRoute): "learner" | "admin" | null {
  if (route.area === "learner" || route.area === "admin") return route.area;
  if (route.path[0] === "community" || route.path.join("/") === "meetings/mine") return "learner";
  return null;
}
