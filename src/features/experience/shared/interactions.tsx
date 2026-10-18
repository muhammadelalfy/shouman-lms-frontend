"use client";

import { useId, useRef, type ReactNode } from "react";
import { Search, X, Eye } from "lucide-react";

export function PreviewAction({ children, title = "تجربة الواجهة", description = "هذا الإجراء للمعاينة فقط. لم يتم الإرسال أو الحفظ أو تنفيذ أي عملية.", className = "xp-button" }: { children: ReactNode; title?: string; description?: string; className?: string }) {
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = () => { dialog.current?.close(); trigger.current?.focus(); };
  return <><button type="button" className={className} ref={trigger} onClick={() => dialog.current?.showModal()}>{children}</button><dialog className="xp-dialog" ref={dialog} aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`} onClose={() => trigger.current?.focus()} onKeyDown={(event) => { if (event.key === "Escape") { event.preventDefault(); close(); } }}><div className="xp-row xp-dialog-heading"><span className="xp-icon-tile"><Eye size={22} aria-hidden="true" /></span><button type="button" className="xp-icon-button" aria-label="إغلاق المعاينة" onClick={close}><X size={20} /></button></div><p className="xp-eyebrow">معاينة تصميم</p><h2 id={`${id}-title`}>{title}</h2><p id={`${id}-description`}>{description}</p><p className="xp-local-note">لا تُرسل هذه الواجهة بيانات أو تغيّر سجلات فعلية.</p><button type="button" className="xp-button" onClick={close} autoFocus>فهمت</button></dialog></>;
}

export function SearchField({ value, onChange, label = "بحث في بيانات المعاينة", placeholder = "ابحث بالعنوان…" }: { value: string; onChange: (value: string) => void; label?: string; placeholder?: string }) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  return <div className="xp-search"><label className="xp-sr-only" htmlFor={id}>{label}</label><Search size={19} aria-hidden="true" /><input id={id} type="search" ref={input} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} autoComplete="off" />{value ? <button type="button" className="xp-icon-button" aria-label="مسح البحث" onClick={() => { onChange(""); input.current?.focus(); }}><X size={18} /></button> : null}</div>;
}
