"use client";

import { useEffect, useId, useRef, useState, type ReactNode, type RefObject } from "react";
import { ArrowLeft, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { HOME_PREVIEW, type PreviewNavigationItem } from "../data/preview";

function useModal(open: boolean, ref: RefObject<HTMLDialogElement | null>) {
  useEffect(() => {
    if (!open || !ref.current) return;
    const dialog = ref.current;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    dialog.querySelector<HTMLElement>("button, input, a[href]")?.focus();
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open, ref]);
}

export function PreviewDialog({ open, onClose, title, children, drawer = false }: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  drawer?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useModal(open, ref);

  function handleKeyDown(event: React.KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    }
    if (event.key !== "Tab") return;
    const items = Array.from(ref.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], input:not([disabled]), [tabindex="0"]',
    ) ?? []).filter((item) => !item.hidden);
    const first = items[0];
    const last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  }

  return (
    <dialog
      ref={ref}
      className={`preview-dialog${drawer ? " navigation-drawer" : ""}`}
      aria-labelledby={titleId}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      onKeyDown={handleKeyDown}
    >
      <div className="dialog-heading">
        <h2 id={titleId}>{title}</h2>
        <button type="button" className="icon-button" aria-label="إغلاق" onClick={onClose}><X className="h-5 w-5" /></button>
      </div>
      {children}
    </dialog>
  );
}

export function ComingSoonButton({ children, title = "هذه الميزة", className = "", ariaLabel, href }: {
  children: ReactNode;
  title?: string;
  className?: string;
  ariaLabel?: string;
  href?: string;
}) {
  const [open, setOpen] = useState(false);
  if (href) return <Link href={href} className={className} aria-label={ariaLabel}>{children}</Link>;
  return (
    <>
      <button type="button" className={className} aria-label={ariaLabel} onClick={() => setOpen(true)}>{children}</button>
      <PreviewDialog open={open} onClose={() => setOpen(false)} title={`${title} — قريبًا`}>
        <p>نعمل على تجهيز هذه الميزة لتكون جزءًا من رحلتك في الأكاديمية.</p>
        <p className="dialog-note">هذه معاينة للواجهة ببيانات تجريبية. لم يُرسل أي طلب ولم تُنفّذ أي عملية.</p>
        <button type="button" className="button button-primary" onClick={() => setOpen(false)}>حسنًا، أتابع التصفح<ArrowLeft className="h-4 w-4" /></button>
      </PreviewDialog>
    </>
  );
}

export function MobileNavigation({ navigation = HOME_PREVIEW.navigation }: {
  navigation?: PreviewNavigationItem[];
} = {}) {
  const [open, setOpen] = useState(false);
  const [comingSoon, setComingSoon] = useState<string | null>(null);
  return (
    <>
      <button type="button" className="icon-button mobile-menu-button xl:hidden" aria-label="فتح قائمة التنقل" aria-expanded={open} onClick={() => setOpen(true)}><Menu className="h-5 w-5" /></button>
      <PreviewDialog open={open} onClose={() => setOpen(false)} title="قائمة التنقل" drawer>
        <nav aria-label="التنقل على الهاتف">
          {navigation.map((item) => item.href ? (
            <a href={item.href} key={item.label} onClick={() => setOpen(false)}>{item.label}<ArrowLeft className="h-4 w-4" /></a>
          ) : (
            <button key={item.label} type="button" onClick={() => { setOpen(false); setComingSoon(item.label); }}>{item.label}<span>قريبًا</span></button>
          ))}
        </nav>
        <p className="drawer-note">معًا.. نصنع جيلاً أقرب إلى الله</p>
      </PreviewDialog>
      <PreviewDialog open={comingSoon !== null} onClose={() => setComingSoon(null)} title={`${comingSoon ?? ""} — قريبًا`}>
        <p>هذه الميزة قيد التجهيز. هذه معاينة ببيانات تجريبية، ولم يُرسل أي طلب.</p>
        <button className="button button-primary" type="button" onClick={() => setComingSoon(null)}>العودة إلى التصفح</button>
      </PreviewDialog>
    </>
  );
}

export function HeaderSearch() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="hidden items-center gap-2 rounded-md border xl:flex border-primary-foreground/20 px-3 py-1.5 text-sm" type="button" aria-label="ابحث في الأكاديمية" onClick={() => setOpen(true)}><span className="w-40 text-start text-primary-foreground/50">ابحث في الأكاديمية ...</span><Search className="h-4 w-4" /></button>
      <PreviewDialog open={open} onClose={() => setOpen(false)} title="البحث في الأكاديمية — قريبًا">
        <p>سيتيح لك البحث الوصول إلى المسارات والدروس والبرامج بسهولة.</p>
        <p className="dialog-note">البحث غير متاح في هذه المعاينة. يمكنك استكشاف المسارات المعروضة الآن.</p>
        <a href="#tracks" className="button button-primary" onClick={() => setOpen(false)}>تصفح المسارات<ArrowLeft className="h-4 w-4" /></a>
      </PreviewDialog>
    </>
  );
}

export function NewsletterForm() {
  const [open, setOpen] = useState(false);
  const emailId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  function previewSubscription() {
    const input = inputRef.current;
    if (!input) return;
    if (!input.validity.valid) { setError("أدخل بريدًا إلكترونيًا صالحًا لمعاينة الواجهة."); input.focus(); return; }
    setError("");
    input.value = "";
    setOpen(true);
  }

  return (
    <>
      {/* No form or named field: the preview cannot submit addresses before hydration. */}
      <div className="mt-3 flex gap-2" role="group" aria-label="معاينة النشرة البريدية">
        <label className="sr-only" htmlFor={emailId}>بريدك الإلكتروني</label>
        <input
          ref={inputRef}
          id={emailId}
          type="email"
          required
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${emailId}-error` : undefined}
          autoComplete="email"
          placeholder="بريدك الإلكتروني"
          className="min-w-0 flex-1 rounded-md border border-input bg-card px-3 py-2 text-sm outline-none focus:border-ring"
          onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); previewSubscription(); } }}
        />
        <button className="rounded-md bg-primary px-5 py-2 text-sm font-bold text-primary-foreground" type="button" onClick={previewSubscription}>اشتراك</button>
      </div>
      {error ? <p id={`${emailId}-error`} className="text-sm text-destructive" role="alert">{error}</p> : null}
      <span className="mt-1 block text-xs text-muted-foreground">معاينة فقط — لن يُرسل بريدك أو يُحفظ.</span>
      <PreviewDialog open={open} onClose={() => setOpen(false)} title="النشرة البريدية — قريبًا">
        <p>خدمة الاشتراك قيد التجهيز. لم يُرسل بريدك الإلكتروني ولم يُحفظ، ولم يحدث أي اشتراك.</p>
        <button type="button" className="button button-primary" onClick={() => setOpen(false)}>حسنًا</button>
      </PreviewDialog>
    </>
  );
}
