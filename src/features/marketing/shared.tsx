import type { ReactNode } from "react";
import { BookOpen, CircleAlert } from "lucide-react";
export { marketingHref } from "./routes";
export function MarketingPanel({ title, description, children, className = "" }: { title?: string; description?: string; children?: ReactNode; className?: string }) {
  return <section className={`mk-panel ${className}`}>{title ? <h2>{title}</h2> : null}{description ? <p className="mk-muted">{description}</p> : null}{children}</section>;
}
export function MarketingEmpty({ title, children }: { title: string; children: ReactNode }) {
  return <div className="mk-empty"><BookOpen size={30} aria-hidden="true" /><h2>{title}</h2><p>{children}</p></div>;
}
export function MarketingNote({ children }: { children: ReactNode }) {
  return <p className="mk-note"><CircleAlert size={18} aria-hidden="true" /><span>{children}</span></p>;
}
export function SampleLabel() { return <span className="mk-sample">نموذج توضيحي</span>; }
