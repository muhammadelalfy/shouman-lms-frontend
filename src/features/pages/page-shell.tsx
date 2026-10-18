import Link from "next/link";
import type { ReactNode } from "react";
import type { PageDefinition } from "./page-content";
import { PageAnimations } from "./page-animations";
import { getSessionToken } from "@/lib/auth/session";
import { logoutAction } from "@/features/auth/actions";
import { MobileNavigation } from "./mobile-navigation";

const primaryLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "الفهرس", href: "/catalog" },
  { label: "المسارات", href: "/tracks" },
  { label: "الدورات", href: "/courses" },
  { label: "الفعاليات", href: "/events" },
  { label: "الأسئلة الشائعة", href: "/faq" },
];

export async function PlatformFrame({ children }: { children: ReactNode }) {
  const hasSession = Boolean(await getSessionToken());

  return (
    <div className="platform-page">
      <PageAnimations />
      <a className="platform-skip-link" href="#platform-main">انتقل إلى المحتوى</a>
      <header className="platform-header">
        <Link href="/" className="platform-brand" aria-label="العودة إلى الصفحة الرئيسية">
          <span className="platform-mark" aria-hidden="true">أ</span>
          <span><strong>أكاديمية د. حازم شومان</strong><small>رحلة علم وتربية وصناعة أثر</small></span>
        </Link>
        <nav aria-label="التنقل الرئيسي" className="platform-nav">
          {primaryLinks.slice(1).map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
          <Link href="/preview">الواجهات</Link>
        </nav>
        <div className="platform-header-actions">
          {hasSession ? (
            <>
              <Link href="/account" className="platform-login">حسابي</Link>
              <form action={logoutAction} noValidate><button className="platform-login platform-logout" type="submit">تسجيل الخروج</button></form>
            </>
          ) : <Link href="/auth/login" className="platform-login">تسجيل الدخول</Link>}
          <MobileNavigation hasSession={hasSession} />
        </div>
      </header>
      {children}
      <footer className="platform-footer">
        <div className="platform-footer-brand"><span className="platform-mark" aria-hidden="true">أ</span><span>أكاديمية د. حازم شومان</span></div>
        <p>مسارات علمية وإيمانية بلغة واضحة وخطوات متدرجة.</p>
        <nav aria-label="روابط التذييل">
          <Link href="/catalog">الفهرس التعليمي</Link>
          <Link href="/faq">الأسئلة الشائعة</Link>
          <Link href="/auth/login">تسجيل الدخول</Link>
          <Link href="/preview">جميع الواجهات</Link>
        </nav>
      </footer>
    </div>
  );
}

export function PlatformPage({ page }: { page: PageDefinition }) {
  return (
    <PlatformFrame>
      <main id="platform-main" className="platform-main">
        <section className="platform-hero" aria-labelledby="platform-title">
          <div className="platform-hero-copy">
            <p className="platform-eyebrow">{page.eyebrow}</p>
            <span className={`platform-status platform-status-${page.kind}`}>{page.kind === "preview" ? "معاينة" : "قريبًا"}</span>
            <h1 id="platform-title">{page.title}</h1>
            <p className="platform-english" lang="en" dir="ltr">{page.englishTitle}</p>
            <p className="platform-description">{page.description}</p>
          </div>
          <div className="platform-hero-symbol" aria-hidden="true">✦</div>
        </section>

        <section className="platform-preview-notice" aria-label="حالة الصفحة">
          <span className="platform-notice-mark" aria-hidden="true">✧</span>
          <div><strong>{page.previewLabel ?? (page.kind === "preview" ? "معاينة تصميم" : "قيد التجهيز")}</strong><p>هذه الصفحة لا تنفذ عمليات أو تحفظ تغييرات. ستظهر الوظائف عند توفر الخدمة المعتمدة.</p></div>
        </section>

        {page.cards?.length ? (
          <section className="platform-cards" aria-label="أقسام الصفحة">
            {page.cards.map((card) => (
              <article className="platform-card" key={card.title}>
                <div className="platform-card-icon" aria-hidden="true">✧</div>
                <h2>{card.title}</h2>
                <p>{card.description}</p>
                {card.href ? <Link href={card.href}>فتح الصفحة <span aria-hidden="true">←</span></Link> : null}
              </article>
            ))}
          </section>
        ) : (
          <section className="platform-empty" aria-labelledby="platform-empty-title">
            <div className="platform-empty-icon" aria-hidden="true">⌛</div>
            <h2 id="platform-empty-title">{page.kind === "preview" ? "التصميم جاهز للمعاينة" : "هذه الصفحة قيد التجهيز"}</h2>
            <p>{page.kind === "preview" ? "لا نعرض بيانات وهمية قبل توفير مصدرها المعتمد." : "تحتاج هذه التجربة إلى خدمة وسياسات معتمدة قبل تشغيلها."}</p>
          </section>
        )}

        {page.links?.length ? (
          <nav className="platform-links" aria-label="روابط ذات صلة">
            {page.links.map((link) => <Link href={link.href} key={`${link.href}-${link.label}`}>{link.label} <span aria-hidden="true">←</span></Link>)}
          </nav>
        ) : null}
      </main>
    </PlatformFrame>
  );
}
