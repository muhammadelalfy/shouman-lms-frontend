import { AdminShell } from "@/features/administration/components/admin-shell";
import { PlatformFrame } from "@/features/pages/page-shell";
import "@/features/experience/shared/experience.css";
import "@/features/administration/administration.css";
import "@/features/administration/audit/audit.css";

export default function AuditLoading() {
  return <PlatformFrame><AdminShell title="سجل التدقيق"><section className="xp-card" aria-busy="true"><p role="status">جارٍ التحقق من الوصول وتحميل سجل التدقيق…</p></section></AdminShell></PlatformFrame>;
}
