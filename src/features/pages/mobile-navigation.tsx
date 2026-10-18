"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";

const links = [
  { label: "الرئيسية", href: "/" },
  { label: "الفهرس", href: "/catalog" },
  { label: "المسارات", href: "/tracks" },
  { label: "الدورات", href: "/courses" },
  { label: "الفعاليات", href: "/events" },
  { label: "الأسئلة الشائعة", href: "/faq" },
  { label: "جميع الواجهات", href: "/preview" },
];

export function MobileNavigation({ hasSession }: { hasSession: boolean }) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
      trigger.current?.focus();
    }
  }

  return (
    <div className="platform-mobile-menu" onKeyDown={handleKeyDown}>
      <button
        ref={trigger}
        className="platform-mobile-menu__trigger"
        type="button"
        aria-expanded={open}
        aria-controls="platform-mobile-navigation"
        onClick={() => setOpen((current) => !current)}
      >
        القائمة <span aria-hidden="true">☰</span>
      </button>
      {open ? (
        <nav id="platform-mobile-navigation" aria-label="قائمة التنقل للجوال">
          {links.map((item) => <Link href={item.href} key={item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}
          {hasSession
            ? <Link href="/account" onClick={() => setOpen(false)}>حسابي</Link>
            : <Link href="/auth/register" onClick={() => setOpen(false)}>إنشاء حساب <span aria-hidden="true">←</span></Link>}
        </nav>
      ) : null}
    </div>
  );
}
