import Image from "next/image";
import { HOME_PREVIEW } from "../data/preview";
import { ComingSoonButton, HeaderSearch, MobileNavigation, NewsletterForm } from "./preview-interactions";
import {
  Home, User, Play, ChevronLeft, ArrowLeft, FileText, Radio, Users, Award, Monitor,
  ExternalLink, Youtube, Facebook, Instagram, Send, Twitter, Music2, GraduationCap, BookOpen, Heart, Star,
} from "lucide-react";
const hero = "/images/lovable/hero.jpg";
const logo = "/images/lovable/logo.jpg";
const t1 = "/images/lovable/t1.jpg";
const t2 = "/images/lovable/t2.jpg";
const t3 = "/images/lovable/t3.jpg";
const t4 = "/images/lovable/t4.jpg";
const startImg = "/images/lovable/start.jpg";
const videoImg = "/images/lovable/video.jpg";
const i1 = "/images/lovable/i1.jpg";
const i2 = "/images/lovable/i2.jpg";
const i3 = "/images/lovable/i3.jpg";
const i4 = "/images/lovable/i4.jpg";
const s1 = "/images/lovable/s1.jpg";
const s2 = "/images/lovable/s2.jpg";
const s3 = "/images/lovable/s3.jpg";
const phone = "/images/lovable/phone.jpg";

const nav = HOME_PREVIEW.navigation;
const features = [
  { icon: FileText, t: "محتوى منظم ومسارات واضحة" },
  { icon: Radio, t: "لقاءات مباشرة وتفاعلية" },
  { icon: Users, t: "مجتمع طلابي ودعم مستمر" },
  { icon: Award, t: "شهادات إتمام مجانية" },
  { icon: Monitor, t: "تعلم في أي وقت ومن أي مكان" },
];
const tracks = [
  { img: t1, title: "أذن خير", d: "7 مواد لبناء قلبك وتقوية علاقتك بالله", tags: ["التوبة", "الصلاة", "المعاني هم الدين", "وغيرها"] },
  { img: t2, title: "إنه محمد", d: "سيرة نبوية بأسلوب تربوي يغير حياتك", tags: ["السيرة", "القيم", "التربية", "وغيرها"] },
  { img: t3, title: "سنة أولى علم", d: "بداية رحلتك في العلوم الشرعية بصورة مبسطة ومنهجية", tags: ["الفقه", "العقيدة", "التفسير", "وغيرها"] },
  { img: t4, title: "المعهد القرآني الدعوي", d: "إعداد جيل قرآني داعٍ مؤثر", tags: ["قرآني", "تربوي", "دعوي", "إداري"] },
];
const initiatives = [
  { img: i1, t: "مبادرات أخرى", d: "المزيد من البرامج" },
  { img: i2, t: "الدورة القرآنية السنوية", d: "رحلة عام مع كتاب الله" },
  { img: i3, t: "استغفر تفرح", d: "اكتشف جمال الاستغفار" },
  { img: i4, t: "سبّح تفرح", d: "رحلة مع التسبيح وأثره في حياتك" },
];
const seasonal = [
  { img: s1, t: "سلسلة رمضان", d: "دروس يومية في رمضان" },
  { img: s2, t: "الاستعداد لرمضان", d: "دورة عملية متكاملة" },
  { img: s3, t: "قبل العشر بعشر", d: "تهيئة إيمانية لذي الحجة" },
];
const stats = [
  { icon: Heart, n: "+90%", l: "معدل إتمام الدورات" },
  { icon: Star, n: "+4", l: "مسارات تعليمية" },
  { icon: BookOpen, n: "+120", l: "دورة وبرنامج" },
  { icon: GraduationCap, n: "+25,000", l: "طالب وطالبة" },
];
const socials = [Twitter, Send, Music2, Instagram, Facebook, Youtube];
const socialLabels = ["إكس", "تيليجرام", "تيك توك", "إنستغرام", "فيسبوك", "يوتيوب"];

function MiniCard({ img, t, d }: { img: string; t: string; d: string }) {
  return (
    <div className="overflow-hidden rounded-lg bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <Image width={640} height={448} sizes="(max-width: 767px) 33vw, 180px" src={img} alt={t} loading="lazy" className="h-28 w-full object-cover" />
      <div className="p-3 text-center">
        <h3 className="font-display text-sm font-bold text-primary">{t}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{d}</p>
      </div>
    </div>
  );
}

function SectionHead({ title, sub, link }: { title: string; sub?: string; link: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-xl font-extrabold text-primary md:text-2xl">{title}</h2>
        {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
      </div>
      <ComingSoonButton title={link} className="flex shrink-0 items-center gap-1 text-sm text-primary hover:text-gold">
        {link} <ArrowLeft className="h-4 w-4" />
      </ComingSoonButton>
    </div>
  );
}

export function HomePreview() {
  return (
    <div className="min-h-screen bg-background" id="home">
      {/* Header */}
      <header className="lovable-header bg-navy-deep text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-3">
          <a href="#home" className="flex items-center gap-3">
            <Image width={44} height={44} src={logo} alt="شعار المركز" className="h-11 w-11 rounded" />
            <div>
              <div className="whitespace-nowrap font-display font-bold leading-tight">مركز د. حازم شومان</div>
              <div className="text-[10px] tracking-widest opacity-70">DR. HAZEM SHOUMAN ACADEMY</div>
            </div>
          </a>
          <nav className="hidden flex-1 whitespace-nowrap items-center gap-6 text-sm lg:flex" aria-label="التنقل الرئيسي">
            {nav.map((n, i) => (
              n.href ? (
                <a key={n.label} href={n.href} className={i === 0 ? "border-b-2 border-gold pb-1 text-gold" : "hover:text-gold"}>{n.label}</a>
              ) : (
                <ComingSoonButton key={n.label} title={n.label} className="hover:text-gold">{n.label}</ComingSoonButton>
              )
            ))}
          </nav>
          <div className="mr-auto flex items-center gap-3">
            <HeaderSearch />
            <ComingSoonButton title="الموقع الرئيسي" className="hidden items-center gap-2 rounded-md border border-primary-foreground/40 px-3 py-1.5 text-sm hover:bg-primary-foreground/10 xl:flex whitespace-nowrap">
              <Home className="h-4 w-4" /> العودة إلى الموقع الرئيسي
            </ComingSoonButton>
            <ComingSoonButton title="تسجيل الدخول" ariaLabel="تسجيل الدخول" className="flex whitespace-nowrap items-center gap-2 rounded-md bg-card px-3 py-1.5 text-sm font-bold text-primary">
              <User className="h-4 w-4" /> <span className="login-label">تسجيل الدخول</span>
            </ComingSoonButton>
            <MobileNavigation />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-deep text-primary-foreground">
        <Image width={1536} height={1024} sizes="(max-width: 767px) 100vw, 60vw" fetchPriority="high" loading="eager" src={hero} alt="د. حازم شومان" className="absolute inset-y-0 left-0 h-full w-full object-cover object-left md:w-3/5" />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-16">
          <div className="max-w-xl">
            <h1 className="font-display text-4xl font-extrabold md:text-5xl xl:text-6xl">مركز د. حازم شومان</h1>
            <p className="mt-4 text-2xl">رحلة علم .. وتربية .. وصناعة أثر</p>
            <p className="mt-4 text-lg leading-relaxed opacity-90">مركز إسلامية متكاملة تستهدف الشباب لتأهيل جيل واعٍ أقرب إلى الله بالعلم والعمل.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#tracks" className="flex items-center gap-6 rounded-md bg-accent px-8 py-3 font-bold text-accent-foreground hover:brightness-105">
                ابدأ رحلتك الآن <ChevronLeft className="h-5 w-5" />
              </a>
              <a href="#video" className="flex items-center gap-3 rounded-md border border-primary-foreground/60 px-6 py-3 font-bold hover:bg-primary-foreground/10">
                <Play className="h-5 w-5 fill-current" /> تعرف على المركز
              </a>
            </div>
          </div>
          <blockquote className="glass-panel absolute left-10 top-24 hidden w-56 rounded-lg p-5 text-lg leading-loose lg:block">
            <span className="font-display text-3xl text-gold">”</span>
            <p>العلم ليس مجرد معلومات بل هو طريق إلى حياة أقرب إلى الله</p>
            <footer className="mt-2 text-sm opacity-80">د. حازم شومان</footer>
          </blockquote>
          <div className="glass-panel mt-16 grid grid-cols-2 gap-y-6 rounded-xl px-4 py-5 md:grid-cols-5">
            {features.map(({ icon: Icon, t }) => (
              <div key={t} className="flex flex-col items-center gap-2 border-primary-foreground/15 px-4 text-center md:border-l md:last:border-l-0">
                <Icon className="h-8 w-8" />
                <span className="text-sm">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl space-y-12 px-6 py-12">
        {/* Tracks */}
        <section id="tracks">
          <div className="mb-6 flex items-end justify-between">
            <div className="flex-1 text-center">
              <h2 className="font-display text-3xl font-extrabold text-primary">المسارات التعليمية</h2>
              <p className="mt-2 text-muted-foreground">اختر مسارك وابدأ رحلتك في طلب العلم</p>
            </div>
            <ComingSoonButton title="جميع المسارات" className="flex items-center gap-1 text-sm text-primary hover:text-gold">جميع المسارات <ArrowLeft className="h-4 w-4" /></ComingSoonButton>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {tracks.map((tr) => (
              <article key={tr.title} className="flex flex-col overflow-hidden rounded-xl bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <Image width={640} height={480} sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 300px" src={tr.img} alt={tr.title} loading="lazy" className="h-48 w-full object-cover" />
                <div className="flex flex-1 flex-col p-5 text-center">
                  <h3 className="font-display text-2xl font-bold text-primary">{tr.title}</h3>
                  <p className="mt-2 min-h-12 text-sm text-muted-foreground">{tr.d}</p>
                  <div className="my-4 flex justify-around text-xs text-muted-foreground">
                    {tr.tags.map((t) => <span key={t}>{t}</span>)}
                  </div>
                  <ComingSoonButton title={`مسار ${tr.title}`} className="mt-auto flex items-center justify-center gap-6 rounded-md bg-secondary py-2.5 font-bold text-primary hover:bg-accent">
                    استعرض المسار <ChevronLeft className="h-4 w-4" />
                  </ComingSoonButton>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Promos */}
        <section className="grid gap-5 lg:grid-cols-2">
          <div id="video" className="relative overflow-hidden rounded-xl bg-navy-deep text-primary-foreground">
            <Image width={640} height={480} sizes="(max-width: 1023px) 50vw, 320px" src={videoImg} alt="" className="absolute inset-y-0 left-0 h-full w-1/2 object-cover" />
            <div className="hero-overlay absolute inset-0" />
            <div className="relative p-8">
              <h3 className="max-w-[16rem] font-display text-3xl font-extrabold leading-snug">شرح طريقة التعلم في المركز</h3>
              <ComingSoonButton title="الفيديو التعريفي" className="mt-6 inline-flex items-center gap-3 rounded-md bg-card px-6 py-3 font-bold text-primary">
                <Play className="h-5 w-5 fill-current" /> شاهد الفيديو
              </ComingSoonButton>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-xl bg-secondary">
            <Image width={640} height={480} sizes="(max-width: 1023px) 50vw, 320px" src={startImg} alt="" className="absolute inset-y-0 left-0 h-full w-1/2 object-cover" />
            <div className="relative max-w-sm p-8">
              <h3 className="font-display text-3xl font-extrabold text-primary">كيف أبدأ؟</h3>
              <p className="mt-3 text-muted-foreground">لست متأكدًا من المسار المناسب لك؟ أجب عن بعض الأسئلة لنقترح لك أفضل بداية</p>
              <ComingSoonButton title="تحديد المسار المناسب" className="mt-5 inline-flex items-center gap-3 rounded-md bg-primary px-6 py-3 font-bold text-primary-foreground">
                <ExternalLink className="h-5 w-5" /> حدد مسارك الآن
              </ComingSoonButton>
            </div>
          </div>
        </section>

        {/* Programs */}
        <section className="grid gap-6 lg:grid-cols-[3fr_4fr]">
          <div id="programs" className="rounded-xl bg-secondary/60 p-5">
            <SectionHead title="البرامج الموسمية" link="جميع البرامج" />
            <div className="grid grid-cols-3 gap-3">{seasonal.map((s) => <MiniCard key={s.t} {...s} />)}</div>
          </div>
          <div id="initiatives" className="rounded-xl bg-secondary/60 p-5">
            <SectionHead title="المبادرات والبرامج المكثفة" sub="برامج قصيرة ذات هدف واضح .. لتغيير حقيقي في حياتك" link="جميع المبادرات" />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{[...initiatives].reverse().map((s) => <MiniCard key={s.t} {...s} />)}</div>
          </div>
        </section>
      </main>

      {/* Stats */}
      <section className="bg-navy-deep text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 py-8 lg:flex-row">
          <p className="font-display text-2xl font-bold">“ معًا .. نصنع جيلًا أقرب إلى الله ”</p>
          <div className="grid flex-1 grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map(({ icon: Icon, n, l }) => (
              <div key={l} className="text-center">
                <Icon className="mx-auto h-7 w-7 text-gold" />
                <div className="mt-1 font-display text-2xl font-bold" dir="ltr">{n}</div>
                <div className="text-sm opacity-80">{l}</div>
              </div>
            ))}
          </div>
          <div className="hidden w-48 lg:block" />
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="relative mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-3 lg:pl-56">
        <Image width={176} height={280} src={phone} alt="تطبيق المركز" className="absolute -top-28 left-6 hidden w-44 rounded-xl lg:block" />
        <div>
          <h3 className="font-display text-lg font-bold text-primary">تابعنا على</h3>
          <div className="mt-4 flex gap-3">
            {socials.map((Icon, i) => (
              <ComingSoonButton key={i} title={socialLabels[i]} ariaLabel={socialLabels[i]} className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-gold">
                <Icon className="h-5 w-5" />
              </ComingSoonButton>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-primary">اشترك في نشرتنا البريدية</h3>
          <p className="text-sm text-muted-foreground">ليصلك جديد الدورات والمبادرات</p>
          <NewsletterForm />
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-primary">تطبيق المركز</h3>
          <p className="text-sm text-muted-foreground">تعلم أينما كنت .. واستمر في رحلتك</p>
          <div className="mt-3 flex gap-2" dir="ltr">
            <ComingSoonButton title="تطبيق Google Play" className="rounded-md bg-foreground px-3 py-1.5 text-xs text-background"><span className="block text-[9px] opacity-70">GET IT ON</span>Google Play</ComingSoonButton>
            <ComingSoonButton title="تطبيق App Store" className="rounded-md bg-foreground px-3 py-1.5 text-xs text-background"><span className="block text-[9px] opacity-70">Download on the</span>App Store</ComingSoonButton>
          </div>
        </div>
        <p className="text-xs text-muted-foreground md:col-span-3">معاينة التصميم — محتوى وبيانات تجريبية. أرقام توضيحية من مرجع التصميم؛ الخدمات التفاعلية قريبًا.</p>
      </footer>
    </div>
  );
}


