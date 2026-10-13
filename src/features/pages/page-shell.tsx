import Link from "next/link";
import type { PageDefinition } from "./page-content";

function StatusBadge({ kind }: { kind: PageDefinition["kind"] }) {
  const labels = { ready: "متاح", preview: "معاينة", "coming-soon": "قريبًا" } as const;
  return <span className={`platform-status platform-status-${kind}`}>{labels[kind]}</span>;
}

export function PlatformPage({ page }: { page: PageDefinition }) {
  return (
    <main className="platform-page">
      <header className="platform-header">
        <Link href="/" className="platform-brand" aria-label="العودة إلى الصفحة الرئيسية">
          <span className="platform-mark" aria-hidden="true">أ</span>
          <span><strong>أكاديمية د. حازم شومان</strong><small>رحلة علم وتربية وصناعة أثر</small></span>
        </Link>
        <nav aria-label="التنقل الرئيسي" className="platform-nav">
          <Link href="/catalog">الفهرس</Link><Link href="/tracks">المسارات</Link><Link href="/events">الفعاليات</Link><Link href="/faq">الأسئلة الشائعة</Link>
        </nav>
        <Link href="/auth/login" className="platform-login">تسجيل الدخول</Link>
      </header>
      <section className="platform-hero" aria-labelledby="platform-title">
        <div className="platform-hero-copy"><p className="platform-eyebrow">{page.eyebrow}</p><StatusBadge kind={page.kind} /><h1 id="platform-title">{page.title}</h1><p className="platform-english">{page.englishTitle}</p><p className="platform-description">{page.description}</p></div>
        <div className="platform-hero-symbol" aria-hidden="true">✦</div>
      </section>
      {page.cards?.length ? <section className="platform-cards" aria-label="محتوى الصفحة">{page.cards.map((card) => <article className="platform-card" key={card.title}><div className="platform-card-icon" aria-hidden="true">✧</div><h2>{card.title}</h2><p>{card.description}</p>{card.href && <Link href={card.href}>فتح الصفحة ←</Link>}</article>)}</section> : <section className="platform-empty" aria-live="polite"><div className="platform-empty-icon" aria-hidden="true">⌛</div><h2>{page.kind === "preview" ? "المسار جاهز للربط" : "هذه الصفحة قيد التجهيز"}</h2><p>{page.kind === "preview" ? "يمكن مراجعة التصميم الآن. لا نعرض بيانات وهمية قبل توفير مصدرها المعتمد." : "ستصل الصفحة عند اكتمال متطلبات المنتج وواجهات الخدمة المرتبطة بها."}</p></section>}
      {page.links?.length ? <nav className="platform-links" aria-label="روابط ذات صلة">{page.links.map((link) => <Link href={link.href} key={link.href}>{link.label} <span aria-hidden="true">←</span></Link>)}</nav> : null}
      <footer className="platform-footer"><p>© أكاديمية د. حازم شومان</p><Link href="/">العودة للرئيسية</Link></footer>
    </main>
  );
}


