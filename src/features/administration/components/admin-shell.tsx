import { ScrollRevealGroup } from "@/components/motion/scroll-reveal-group";
import { IslamicPattern } from "@/components/ui/islamic-pattern";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Permission, Role } from "@/features/auth/types";
import { canUseCsv } from "../csv/resources";
export function AdminShell({
  children,
  title,
  permissions = [],
  roles = [],
  currentSection,
  landing,
}: {
  children: ReactNode;
  title: string;
  landing?: ReactNode;
  permissions?: Permission[];
  roles?: Role[];
  currentSection?: "dashboard" | "users" | "roles" | "offerings" | "homepage" | "audit";
}) {
  const Heading = landing ? "h2" : "h1";
  const content = <>
        <p className="xp-eyebrow">إدارة المركز</p>
        <Heading>{title}</Heading>
        <nav className="xp-tabs" aria-label="إدارة السجلات">
          {permissions.length > 0 && (
            <Link
              href="/admin/dashboard"
              aria-current={currentSection === "dashboard" ? "page" : undefined}
            >
              لوحة الإدارة
            </Link>
          )}
          {permissions.includes("offerings.view") && (
            <Link
              href="/admin/offerings"
              aria-current={currentSection === "offerings" ? "page" : undefined}
            >
              المحتوى التعليمي
            </Link>
          )}
          {permissions.includes("users.view") && (
            <Link
              href="/admin/users"
              aria-current={currentSection === "users" ? "page" : undefined}
            >
              المستخدمون
            </Link>
          )}
          {permissions.includes("roles.manage-permissions") && (
            <Link
              href="/admin/roles"
              aria-current={currentSection === "roles" ? "page" : undefined}
            >
              الأدوار والصلاحيات
            </Link>
          )}
          {permissions.includes("homepage.manage") && <Link href="/admin/homepage/needs" aria-current={currentSection === "homepage" ? "page" : undefined}>الصفحة الرئيسية</Link>}
          {canUseCsv("audit-logs", permissions, false, roles) && <Link href="/admin/audit-logs" aria-current={currentSection === "audit" ? "page" : undefined}>سجل التدقيق</Link>}
          <Link href="/account">حسابي</Link>
          <Link href="/preview">معرض الواجهات</Link>
        </nav>
        <p className="admin-live-notice">
          سجلات المركز · تُطبّق التغييرات بعد قبولها من الخادم.
        </p>
        <ScrollRevealGroup className="admin-record-content">{children}</ScrollRevealGroup>
  </>;
  return (
    <div className="experience">
      <main id="platform-main" className="xp-public-main admin-live">
        <IslamicPattern className="islamic-pattern-admin" /><div className="academy-workspace-pattern" aria-hidden="true"><AnimatedGridPattern numSquares={4} /></div>
        {landing}
        {landing ? <details className="admin-connected-details"><summary>السجلات وأدوات الإدارة المتصلة</summary>{content}</details> : content}
      </main>
    </div>
  );
}
