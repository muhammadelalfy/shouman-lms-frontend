import Link from "next/link";
import { getAdminAccess } from "../server/access";
import { AdminShell } from "../components/admin-shell";
import { getNeedsRecord } from "@/features/home/content/api";
import { isApiError } from "@/lib/api/errors";
import { HomepageNeedsEditor } from "./editor";
import "../administration.css";
export async function HomepageNeedsAdmin() {
  let access;
  try { access=await getAdminAccess("homepage.manage", "/admin/homepage/needs"); }
  catch(error) { if(!isApiError(error)) throw error; return <AdminShell title="إدارة قسم ماذا تحتاج الآن؟"><p className="xp-error" role="alert">{error.status===403?"ليست لديك صلاحية لإدارة الصفحة الرئيسية.":"تعذر التحقق من صلاحيتك الآن."}</p></AdminShell>; }
  let record;
  try { record=await getNeedsRecord(access.token); } catch { record=null; }
  return <AdminShell title="إدارة قسم ماذا تحتاج الآن؟" permissions={access.user.permissions} roles={access.user.roles} currentSection="homepage">{record
    ? <HomepageNeedsEditor key={record.version} record={record}/>
    : <div className="xp-error" role="alert"><p>تعذر تحميل القسم. لم تُعرض بيانات بديلة.</p><Link href="/admin/homepage/needs">إعادة المحاولة</Link></div>}
  </AdminShell>;
}
