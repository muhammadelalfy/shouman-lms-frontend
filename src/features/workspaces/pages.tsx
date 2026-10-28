import { ExperienceDirectory } from "@/features/experience/directory";
import { isCenterAdministrator } from "@/features/auth/login-destination";
import { ExperienceWorkspace } from "@/features/experience/shared/workspace";
import { LearnerExperience } from "@/features/experience/learner/learner-experience";
import { PreviewNotice } from "@/features/experience/shared/ui";
import { MarketingDiscovery } from "@/features/marketing/discovery";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BookOpen,
  Users,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import type { ReactNode } from "react";
import { getSessionToken } from "@/lib/auth/session";
import { getCurrentUser } from "@/features/account/api";
import { listUsers } from "@/features/administration/identity/api";
import { listOfferings } from "@/features/administration/courses/api";
import { CsvControls } from "@/features/administration/csv/controls";
import { canUseCsv } from "@/features/administration/csv/resources";
import { AdminShell } from "@/features/administration/components/admin-shell";
import { statusNames } from "@/features/administration/schemas/common";
import { isApiError } from "@/lib/api/errors";
import type { CurrentUser } from "@/features/auth/types";
import type { WorkspaceRoute } from "./routes";
import "@/features/administration/administration.css";
import "./workspaces.css";

const paths: Record<WorkspaceRoute, string> = {
  admin: "/admin/dashboard",
  dashboard: "/dashboard",
  learning: "/my-learning",
};
function signIn(path: string, expired = false): never {
  redirect(
    `/auth/login?redirectTo=${encodeURIComponent(path)}${expired ? "&expired=1" : ""}`,
  );
}
export async function WorkspacePage({ route }: { route: WorkspaceRoute }) {
  const path = paths[route];
  const token = await getSessionToken();
  if (!token) signIn(path);
  let user: CurrentUser;
  try {
    user = await getCurrentUser(token);
  } catch (error) {
    if (isApiError(error) && error.status === 401) signIn(path, true);
    if (!isApiError(error)) throw error;
    return <WorkspaceFailure path={path} forbidden={error.status === 403} />;
  }
  if (route === "dashboard" && isCenterAdministrator(user)) redirect("/admin/dashboard");
  if (route !== "admin")
    return <LearnerHome user={user} learning={route === "learning"} />;
  if (!user.permissions.length)
    return <WorkspaceFailure path={path} forbidden />;
  const [offerings, users] = await Promise.allSettled([
    user.permissions.includes("offerings.view")
      ? listOfferings(token)
      : Promise.resolve(null),
    user.permissions.includes("users.view")
      ? listUsers(token)
      : Promise.resolve(null),
  ]);
  for (const result of [offerings, users]) {
    if (
      result.status === "rejected" &&
      isApiError(result.reason) &&
      result.reason.status === 401
    )
      signIn(path, true);
  }
  return (
    <AdminShell
      title="لوحة الإدارة"
      permissions={user.permissions}
      roles={user.roles}
      currentSection="dashboard"
      landing={<><PreviewNotice /><ExperienceDirectory permissions={user.permissions}/></>}
    >
      <Welcome user={user} admin />
      {canUseCsv("audit-logs", user.permissions, false, user.roles) && <CsvControls resource="audit-logs" label="سجل التدقيق" />}
      {user.permissions.includes("homepage.manage") && <CsvControls resource="homepage-faq" label="الأسئلة الشائعة" canImport />}
      {user.permissions.includes("homepage.manage") && <CsvControls resource="homepage-seo" label="بيانات الظهور في البحث" canImport />}
      {user.permissions.includes("homepage.manage") && <section className="workspace-section"><Task href="/admin/homepage/needs" icon={<BookOpen />} title="إدارة قسم ماذا تحتاج الآن؟" text="حرر نصوص وبطاقات الصفحة الرئيسية، ثم انشر المسودة للزوار." /></section>}
      <section
        aria-labelledby="admin-tools-title"
        className="workspace-section"
      >
        <SectionHeading
          id="admin-tools-title"
          title="أدواتك المتاحة"
          description="انتقل مباشرة إلى المهمة التي تريد إنجازها."
        />
        <div className="workspace-task-grid">
          {user.permissions.includes("offerings.manage") && (
            <Task
              href="/admin/offerings/new"
              icon={<BookOpen />}
              title="أنشئ محتوى تعليميًا"
              text="أضف دورة أو برنامجًا، ثم نظّم المواد والدروس."
            />
          )}
          {user.permissions.includes("users.view") && (
            <Task
              href="/admin/users"
              icon={<Users />}
              title="أدر المستخدمين"
              text="راجع الحسابات وما يتاح لك من أدوات إدارتها."
            />
          )}
          {user.permissions.includes("roles.manage-permissions") && (
            <Task
              href="/admin/roles"
              icon={<ShieldCheck />}
              title="راجع الأدوار والصلاحيات"
              text="اضبط الوصول إلى أدوات المركز بعناية."
            />
          )}
          {user.permissions.includes("offerings.view") && (
            <Task
              href="/admin/offerings"
              icon={<BookOpen />}
              title="راجع المحتوى التعليمي"
              text="تصفّح المحتوى وحالته ومواد كل برنامج."
            />
          )}
        </div>
      </section>
      {user.permissions.includes("offerings.manage") && <MarketingDiscovery audience="admin" />}
      <div className="workspace-panel-grid">
        {user.permissions.includes("offerings.view") && (
          <RecordPanel
            title="المحتوى التعليمي"
            href="/admin/offerings"
            result={offerings}
            empty="لم يُضف محتوى تعليمي بعد."
            rows={
              offerings.status === "fulfilled"
                ? (offerings.value?.data
                    .slice(0, 5)
                    .map((row) => ({
                      id: row.id,
                      label: row.title,
                      status: row.status,
                    })) ?? [])
                : []
            }
          />
        )}
        {user.permissions.includes("users.view") && (
          <RecordPanel
            title="المستخدمون"
            href="/admin/users"
            result={users}
            empty="لا توجد حسابات لعرضها الآن."
            rows={
              users.status === "fulfilled"
                ? (users.value?.data
                    .slice(0, 5)
                    .map((row) => ({
                      id: row.id,
                      label: row.name,
                      status: row.status,
                    })) ?? [])
                : []
            }
          />
        )}
      </div>
      <PreviewLink
        href="/preview/admin/dashboard"
        text="استعرض نموذج لوحة الإدارة"
      />
    </AdminShell>
  );
}

function WorkspaceFailure({
  path,
  forbidden = false,
}: {
  path: string;
  forbidden?: boolean;
}) {
  return (
    <main id="platform-main" className="workspace-page experience">
      <section
        className="workspace-state"
        aria-labelledby="workspace-failure-title"
      >
        <span className="workspace-icon" aria-hidden="true">
          <ShieldCheck />
        </span>
        <p className="xp-eyebrow">مساحتك في المركز</p>
        <h1 id="workspace-failure-title">
          {forbidden ? "ليست لديك صلاحية الوصول" : "تعذر فتح المساحة الآن"}
        </h1>
        <p>
          {forbidden
            ? "لا يتيح حسابك هذه المساحة. يمكنك العودة إلى حسابك أو استكشاف المحتوى المنشور."
            : "تعذر تحميل بيانات حسابك مؤقتًا. أعد المحاولة بعد قليل."}
        </p>
        <div className="workspace-actions">
          {!forbidden && (
            <Link className="xp-button" href={path}>
              إعادة المحاولة
            </Link>
          )}
          <Link className="xp-button xp-button-outline" href="/account">
            حسابي
          </Link>
          <Link className="xp-button xp-button-outline" href="/catalog">
            الفهرس التعليمي
          </Link>
        </div>
      </section>
    </main>
  );
}
function Welcome({
  user,
  admin = false,
}: {
  user: CurrentUser;
  admin?: boolean;
}) {
  return (
    <section className="workspace-welcome" aria-label="مرحبًا بك">
      <div>
        <p className="workspace-kicker">
          {admin ? "مساحة العمل" : "علمٌ تتبعه خطوةٌ"}
        </p>
        <h2>
          مرحبًا، <bdi>{user.name}</bdi>
        </h2>
        <p>
          {admin
            ? "المحتوى والحسابات وأدوات المركز، في مكان واحد."
            : "من هنا تبدأ رحلتك، وتصل إلى حسابك والمحتوى الذي تريد استكشافه."}
        </p>
      </div>
      <span className="workspace-welcome-mark" aria-hidden="true">
        ✦
      </span>
    </section>
  );
}
function LearnerHome({ user, learning }: { user: CurrentUser; learning: boolean }) {
  return <div className="experience">
    <ExperienceWorkspace area="learner" currentPath={learning ? "/my-learning" : "/dashboard"}>
      <main id="platform-main">
        <h2 className="learner-account-greeting">مرحبًا، <bdi>{user.name}</bdi></h2>
        <PreviewNotice />
        <LearnerExperience path={[learning ? "my-learning" : "dashboard"]} />
      </main>
    </ExperienceWorkspace>
  </div>;
}
function SectionHeading({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description: string;
}) {
  return (
    <div className="workspace-section-heading">
      <h2 id={id}>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
function Task({
  href,
  title,
  text,
  icon,
}: {
  href: string;
  title: string;
  text: string;
  icon: ReactNode;
}) {
  return (
    <Link className="workspace-task" href={href}>
      <span className="workspace-icon" aria-hidden="true">
        {icon}
      </span>
      <h3>{title}</h3>
      <p>{text}</p>
      <span className="workspace-task-arrow" aria-hidden="true">
        <ArrowLeft size={20} />
      </span>
    </Link>
  );
}
function RecordPanel({
  title,
  href,
  empty,
  rows,
  result,
}: {
  title: string;
  href: string;
  empty: string;
  rows: { id: number; label: string; status: string }[];
  result: PromiseSettledResult<unknown>;
}) {
  const denied =
    result.status === "rejected" &&
    isApiError(result.reason) &&
    result.reason.status === 403;
  return (
    <section className="workspace-record-panel">
      <header>
        <h2>{title}</h2>
        <Link href={href}>عرض القائمة ←</Link>
      </header>
      {result.status === "rejected" ? (
        <div className="workspace-panel-state">
          <p role="status">
            {denied
              ? "لم تعد لديك صلاحية لعرض هذه السجلات."
              : `تعذر تحميل ${title} الآن.`}
          </p>
          {!denied && <Link href="/admin/dashboard">أعد تحميل اللوحة</Link>}
        </div>
      ) : rows.length ? (
        <>
          <p className="workspace-list-note">
            عرض مختصر من الصفحة الأولى؛ القائمة الكاملة متاحة عبر الرابط أعلاه.
          </p>
          <ul>
            {rows.map((row) => (
              <li key={row.id}>
                <Link href={`${href}/${row.id}`}>
                  <bdi>{row.label}</bdi>
                </Link>
                <span className="workspace-record-status">
                  {statusNames[row.status] ?? "غير محدد"}
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="workspace-panel-state">{empty}</p>
      )}
    </section>
  );
}
function PreviewLink({ href, text }: { href: string; text: string }) {
  return (
    <aside className="workspace-preview-link">
      <span>للاطلاع على التصميم فقط</span>
      <Link href={href}>{text} ←</Link>
    </aside>
  );
}
