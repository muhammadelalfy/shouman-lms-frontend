import Link from "next/link";
import { Eye, ArrowLeft, Compass } from "lucide-react";
import type { ReactNode } from "react";

export { PreviewAction, SearchField } from "./interactions";

export function PreviewNotice() {
  return <aside className="xp-preview-notice" aria-label="حالة المعاينة"><Eye size={20} aria-hidden="true" /><div><strong>معاينة الواجهة · بيانات تجريبية</strong><p>هذه البيانات لا تمثل سجلات حقيقية. التفاعلات محلية للمعاينة فقط؛ لا يتم إرسال أو حفظ تغييرات أو تنفيذ عمليات.</p></div><span className="xp-preview-pill">نسخة التصميم</span></aside>;
}

export function DemoDataLabel() {
  return <span className="xp-data-label">بيانات تجريبية للمعاينة</span>;
}

export function ExperienceHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <header className="xp-page-heading"><div>{eyebrow ? <p className="xp-eyebrow">{eyebrow}</p> : null}<h1>{title}</h1>{description ? <p className="xp-muted">{description}</p> : null}</div>{action ? <div className="xp-heading-action">{action}</div> : null}</header>;
}

export function StatusBadge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "success" | "warning" | "info" }) {
  return <span className={`xp-badge xp-badge--${tone}`}>{children}</span>;
}

export function ProgressBar({ value, label = "التقدم التوضيحي" }: { value: number; label?: string }) {
  const percent = Math.min(100, Math.max(0, value));
  return <div className="xp-progress"><div className="xp-progress-label"><span>{label}</span><b>{percent.toLocaleString("ar-EG")}٪</b></div><div className="xp-progress-track" role="progressbar" aria-label={label} aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${percent}%` }} /></div></div>;
}

export function EmptyState({ title, description, href, actionLabel = "استكشف المحتوى" }: { title: string; description: string; href?: string; actionLabel?: string }) {
  return <section className="xp-empty"><Compass size={34} aria-hidden="true" /><h2>{title}</h2><p>{description}</p>{href ? <Link href={href} className="xp-button xp-button-outline">{actionLabel}<ArrowLeft size={16} aria-hidden="true" /></Link> : null}</section>;
}
