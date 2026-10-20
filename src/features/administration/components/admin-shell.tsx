import Link from "next/link";
import type { ReactNode } from "react";
import type { Permission } from "@/features/auth/types";
export function AdminShell({
  children,
  title,
  permissions = [],
  currentSection,
}: {
  children: ReactNode;
  title: string;
  permissions?: Permission[];
  currentSection?: "dashboard" | "users" | "roles" | "offerings";
}) {
  return (
    <div className="experience">
      <main id="platform-main" className="xp-public-main admin-live">
        <p className="xp-eyebrow">إدارة الأكاديمية</p>
        <h1>{title}</h1>
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
          <Link href="/account">حسابي</Link>
          <Link href="/preview">معرض الواجهات</Link>
        </nav>
        <p className="admin-live-notice">
          سجلات الأكاديمية · تُطبّق التغييرات بعد قبولها من الخادم.
        </p>
        {children}
      </main>
    </div>
  );
}
