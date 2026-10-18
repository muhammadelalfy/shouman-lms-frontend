import Link from "next/link";
import { ExperienceHeading } from "@/features/experience/shared/ui";
import { AdminTable } from "./admin-table";
import { AdminRecordEditor, type EditorKind } from "./admin-editor";
import { adminTables } from "./admin-fixtures";
import { AdminDashboard, AnalyticsWorkspace } from "./admin-insights";
import { AttendanceDetail, AuditDetail, CertificateWorkspace, GroupDetail, PaymentDetail, UserDetail } from "./admin-details";
import { EvaluationWorkspace, MessageComposer, RoleMatrix, RubricBuilder } from "./admin-workspaces";
import { ContentStudio, RecognitionWorkspace, SettingsWorkspace } from "./admin-content-tools";
import { AdminModeration } from "./admin-moderation";
import "./admin.css";

const workspaceTitles: Record<string, [string, string]> = {
  dashboard: ["لوحة الإدارة", "نظرة عامة على أدوات الأكاديمية عبر بيانات اصطناعية، دون سجلات أو عمليات فعلية."],
  roles: ["الأدوار والصلاحيات", "استكشف تركيب الصلاحيات في نموذج محلي، مع بقاء التفويض وسياسات الحماية في الخادم."],
  subjects: ["محرر المادة", "نموذج بنية المادة وترتيب دروسها؛ لا يُحفظ أو يُنشر محتوى."],
  lessons: ["محرر الدرس", "هيئ عنوان الدرس وملخصه وشكل الوسائط في معاينة مستقلة عن التعلم الفعلي."],
  certificates: ["إدارة الشهادات", "قوالب وسجل وقواعد توضيحية؛ لا إصدار أو أهلية أو تحقق حقيقي."],
  rubrics: ["معايير التقييم", "بنية توضيحية لمراجعة المعايير، دون أوزان أو درجات أو اعتماد آلي."],
  gamification: ["الشارات والتحفيز", "مكتبة نماذج للشارات. قواعد النقاط والمنح والمستويات تنتظر اعتماد الأكاديمية."],
  distinguished: ["مراجعة مرشحي التميز", "مساحة مراجعة بشرية توضيحية؛ لا ترتيب أو ترشيح أو اعتماد فعلي."],
  reports: ["التقارير", "استكشف مكتبة التقارير ومصادرها المطلوبة باستخدام رسوم وقيم اصطناعية."],
  analytics: ["التحليلات", "تصورات توضيحية لا تمثل أداء متعلمين أو نشاطًا تشغيليًا أو تقارير إنتاج."],
  cms: ["استوديو المحتوى", "محرر محلي للأقسام والأسئلة والظهور؛ لا يمس الصفحة الرئيسية المعتمدة أو ينشر نصًا."],
  settings: ["إعدادات المنصة", "استكشف التنظيم العام والتكاملات دون تعديل إعدادات أو كشف أسرار اتصال."],
  integrations: ["تكاملات المنصة", "متطلبات توصيل الخدمات دون مفاتيح أو إعدادات فعلية."],
  moderation: ["مراجعة المجتمع والبلاغات", "قائمة مراجعة بشرية بسياقات اصطناعية، دون قرارات أو تغييرات في المحتوى أو الحسابات."],
};

const editorSections: EditorKind[] = ["users", "offerings", "subjects", "lessons", "quizzes", "question-bank", "coupons", "offers", "events", "meetings", "groups"];

/** Server-rendered route composition; only local table and form interactions are client islands. */
export function AdminExperience({ path }: { path: string[] }) {
  const segments = path[0] === "admin" ? path.slice(1) : path;
  const section = segments[0] || "dashboard";
  const record = segments[1];
  const editing = record === "new" || record === "edit" || segments.includes("edit");
  const table = adminTables[section];
  const workspace = workspaceTitles[section];
  const baseTitle = workspace?.[0] || table?.title || "مساحة الإدارة";
  const detailTitles: Record<string, string> = { users: "ملف المستخدم التجريبي", offerings: "محرر المحتوى التعليمي", quizzes: "محرر الاختبار", "question-bank": "محرر السؤال", groups: "إدارة مجموعة تجريبية", payments: "تفاصيل طلب توضيحي", attendance: "مراجعة حضور توضيحي", projects: "مساحة المقيّم", "audit-log": "تفاصيل حدث تدقيق توضيحي", campaigns: "محرر الحملة", notifications: "محرر الإشعار" };
  const title = record && !editing ? detailTitles[section] || baseTitle : baseTitle;
  const description = workspace?.[1] || table?.description;
  const action = table?.createHref && !record ? <Link className="xp-button" href={table.createHref}>{table.createLabel}</Link> : record && table ? <Link className="xp-button xp-button-outline" href={`/admin/${section}`}>العودة إلى {table.title}</Link> : undefined;
  let content;

  if (section === "dashboard") content = <AdminDashboard />;
  else if (section === "roles") content = <RoleMatrix />;
  else if (section === "moderation") content = <AdminModeration />;
  else if (section === "users" && record && !editing) content = <UserDetail />;
  else if (section === "groups" && record && !editing) content = <GroupDetail />;
  else if (section === "payments" && record) content = <PaymentDetail />;
  else if (section === "attendance" && record) content = <AttendanceDetail />;
  else if (section === "audit-log" && record) content = <AuditDetail />;
  else if (section === "certificates") content = <CertificateWorkspace view={record === "rules" ? "rules" : record === "templates" ? "templates" : record ? "detail" : "registry"} />;
  else if (section === "projects" && record) content = <EvaluationWorkspace key={segments.join("/")} />;
  else if (section === "rubrics") content = <RubricBuilder />;
  else if (section === "gamification" || section === "distinguished") content = <RecognitionWorkspace distinguished={section === "distinguished"} />;
  else if ((section === "notifications" || section === "campaigns") && record) content = <MessageComposer key={segments.join("/")} campaign={section === "campaigns"} />;
  else if (section === "analytics" || section === "reports") content = <AnalyticsWorkspace reports={section === "reports"} />;
  else if (section === "cms") content = <ContentStudio />;
  else if (section === "settings" || section === "integrations") content = <SettingsWorkspace initialTab={section === "integrations" || record === "integrations" ? "integrations" : "general"} />;
  else if (editorSections.includes(section as EditorKind) && (record || section === "subjects" || section === "lessons")) content = <AdminRecordEditor key={segments.join("/")} kind={section as EditorKind} isNew={record === "new"} />;
  else if (table) content = <div className="xp-stack"><AdminTable key={section} definition={table} />{table.related && <nav className="admin-related-links" aria-label="أدوات ذات صلة">{table.related.map((link) => <Link className="xp-button xp-button-outline" key={link.href} href={link.href}>{link.label} ←</Link>)}</nav>}</div>;
  else content = <section className="xp-card"><h2>اختر أداة من لوحة الإدارة</h2><p>القوائم المتاحة تقود إلى نماذج المحتوى والحسابات والمراجعة والتقارير.</p><Link className="xp-button" href="/admin/dashboard">لوحة الإدارة</Link></section>;

  return <div className="admin-experience"><ExperienceHeading eyebrow="إدارة الأكاديمية · معاينة" title={record && editing ? `${record === "new" ? "إضافة" : "تحرير"} — ${title}` : title} description={description} action={action} />{content}</div>;
}
