import Link from "next/link";
import type { ReactNode } from "react";
import type { Permission } from "@/features/auth/types";
export function AdminShell({
  children,
  title,
  permissions = [],
}: {
  children: ReactNode;
  title: string;
  permissions?: Permission[];
}) {
  return (
    <div className="experience">
      <main id="platform-main" className="xp-public-main admin-live">
        <p className="xp-eyebrow">إدارة الأكاديمية</p>
        <h1>{title}</h1>
        <nav className="xp-tabs" aria-label="إدارة السجلات">
          {permissions.includes("offerings.view") && (
            <Link href="/admin/offerings">المحتوى التعليمي</Link>
          )}
          {permissions.includes("users.view") && (
            <Link href="/admin/users">المستخدمون</Link>
          )}
          {permissions.includes("roles.manage-permissions") && (
            <Link href="/admin/roles">الأدوار والصلاحيات</Link>
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
