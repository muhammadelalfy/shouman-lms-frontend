import { createFileRoute } from "@tanstack/react-router";
import {
  Home, Search, User, Play, ChevronLeft, ArrowLeft, FileText, Radio, Users, Award, Monitor,
  ExternalLink, Youtube, Facebook, Instagram, Send, Twitter, Music2, GraduationCap, BookOpen, Heart, Star,
} from "lucide-react";
import hero from "@/assets/hero.jpg";
import logo from "@/assets/logo.jpg";
import t1 from "@/assets/t1.jpg";
import t2 from "@/assets/t2.jpg";
import t3 from "@/assets/t3.jpg";
import t4 from "@/assets/t4.jpg";
import startImg from "@/assets/start.jpg";
import videoImg from "@/assets/video.jpg";
import i1 from "@/assets/i1.jpg";
import i2 from "@/assets/i2.jpg";
import i3 from "@/assets/i3.jpg";
import i4 from "@/assets/i4.jpg";
import s1 from "@/assets/s1.jpg";
import s2 from "@/assets/s2.jpg";
import s3 from "@/assets/s3.jpg";
import phone from "@/assets/phone.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "أكاديمية د. حازم شومان | رحلة علم وتربية وصناعة أثر" },
      { name: "description", content: "أكاديمية إسلامية رقمية مجانية: مسارات تعليمية، مبادرات وبرامج موسمية، وشهادات إتمام." },
      { property: "og:title", content: "أكاديمية د. حازم شومان" },
      { property: "og:description", content: "رحلة علم .. وتربية .. وصناعة أثر — أكاديمية إسلامية مجانية للشباب." },
    ],
  }),
  component: Index,
});

const nav = ["الرئيسية", "المسارات", "المبادرات", "البرامج", "اللقاءات", "الأسئلة الشائعة"];
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

function MiniCard({ img, t, d }: { img: string; t: string; d: string }) {
  return (
    <div className="overflow-hidden rounded-lg bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <img src={img} alt={t} loading="lazy" className="h-28 w-full object-cover" />
      <div className="p-3 text-center">
        <h4 className="font-display text-sm font-bold text-primary">{t}</h4>
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
      <a href="#" className="flex shrink-0 items-center gap-1 text-sm text-primary hover:text-gold">
        {link} <ArrowLeft className="h-4 w-4" />
      </a>
    </div>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-navy-deep text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-3">
          <a href="#" className="flex items-center gap-3">
            <img src={logo} alt="شعار الأكاديمية" className="h-11 w-11 rounded" />
            <div>
              <div className="whitespace-nowrap font-display font-bold leading-tight">أكاديمية د. حازم شومان</div>
              <div className="text-[10px] tracking-widest opacity-70">DR. HAZEM SHOUMAN ACADEMY</div>
            </div>
          </a>
          <nav className="hidden flex-1 whitespace-nowrap items-center gap-6 text-sm lg:flex">
            {nav.map((n, i) => (
              <a key={n} href="#" className={i === 0 ? "border-b-2 border-gold pb-1 text-gold" : "hover:text-gold"}>{n}</a>
            ))}
          </nav>
          <div className="mr-auto flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-md border xl:flex border-primary-foreground/20 px-3 py-1.5 text-sm">
              <input placeholder="ابحث في الأكاديمية ..." className="w-40 bg-transparent outline-none placeholder:text-primary-foreground/50" />
              <Search className="h-4 w-4" />
            </div>
            <a href="#" className="hidden items-center gap-2 rounded-md border border-primary-foreground/40 px-3 py-1.5 text-sm hover:bg-primary-foreground/10 xl:flex whitespace-nowrap">
              <Home className="h-4 w-4" /> العودة إلى الموقع الرئيسي
            </a>
            <a href="#" className="flex whitespace-nowrap items-center gap-2 rounded-md bg-card px-3 py-1.5 text-sm font-bold text-primary">
              <User className="h-4 w-4" /> تسجيل الدخول
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-deep text-primary-foreground">
        <img src={hero} alt="د. حازم شومان" className="absolute inset-y-0 left-0 h-full w-full object-cover object-left md:w-3/5" />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-16">
          <div className="max-w-xl">
            <h1 className="font-display text-4xl font-extrabold md:text-5xl xl:text-6xl">أكاديمية د. حازم شومان</h1>
            <p className="mt-4 text-2xl">رحلة علم .. وتربية .. وصناعة أثر</p>
            <p className="mt-4 text-lg leading-relaxed opacity-90">أكاديمية إسلامية متكاملة تستهدف الشباب لتأهيل جيل واعٍ أقرب إلى الله بالعلم والعمل.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#tracks" className="flex items-center gap-6 rounded-md bg-accent px-8 py-3 font-bold text-accent-foreground hover:brightness-105">
                ابدأ رحلتك الآن <ChevronLeft className="h-5 w-5" />
              </a>
              <a href="#video" className="flex items-center gap-3 rounded-md border border-primary-foreground/60 px-6 py-3 font-bold hover:bg-primary-foreground/10">
                <Play className="h-5 w-5 fill-current" /> تعرف على الأكاديمية
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
            <a href="#" className="flex items-center gap-1 text-sm text-primary hover:text-gold">جميع المسارات <ArrowLeft className="h-4 w-4" /></a>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {tracks.map((tr) => (
              <article key={tr.title} className="flex flex-col overflow-hidden rounded-xl bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <img src={tr.img} alt={tr.title} loading="lazy" className="h-48 w-full object-cover" />
                <div className="flex flex-1 flex-col p-5 text-center">
                  <h3 className="font-display text-2xl font-bold text-primary">{tr.title}</h3>
                  <p className="mt-2 min-h-12 text-sm text-muted-foreground">{tr.d}</p>
                  <div className="my-4 flex justify-around text-xs text-muted-foreground">
                    {tr.tags.map((t) => <span key={t}>{t}</span>)}
                  </div>
                  <a href="#" className="mt-auto flex items-center justify-center gap-6 rounded-md bg-secondary py-2.5 font-bold text-primary hover:bg-accent">
                    استعرض المسار <ChevronLeft className="h-4 w-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Promos */}
        <section className="grid gap-5 lg:grid-cols-2">
          <div id="video" className="relative overflow-hidden rounded-xl bg-navy-deep text-primary-foreground">
            <img src={videoImg} alt="" className="absolute inset-y-0 left-0 h-full w-1/2 object-cover" />
            <div className="hero-overlay absolute inset-0" />
            <div className="relative p-8">
              <h3 className="max-w-[16rem] font-display text-3xl font-extrabold leading-snug">شرح طريقة التعلم في الأكاديمية</h3>
              <a href="#" className="mt-6 inline-flex items-center gap-3 rounded-md bg-card px-6 py-3 font-bold text-primary">
                <Play className="h-5 w-5 fill-current" /> شاهد الفيديو
              </a>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-xl bg-secondary">
            <img src={startImg} alt="" className="absolute inset-y-0 left-0 h-full w-1/2 object-cover" />
            <div className="relative max-w-sm p-8">
              <h3 className="font-display text-3xl font-extrabold text-primary">كيف أبدأ؟</h3>
              <p className="mt-3 text-muted-foreground">لست متأكدًا من المسار المناسب لك؟ أجب عن بعض الأسئلة لنقترح لك أفضل بداية</p>
              <a href="#" className="mt-5 inline-flex items-center gap-3 rounded-md bg-primary px-6 py-3 font-bold text-primary-foreground">
                <ExternalLink className="h-5 w-5" /> حدد مسارك الآن
              </a>
            </div>
          </div>
        </section>

        {/* Programs */}
        <section className="grid gap-6 lg:grid-cols-[3fr_4fr]">
          <div className="rounded-xl bg-secondary/60 p-5">
            <SectionHead title="البرامج الموسمية" link="جميع البرامج" />
            <div className="grid grid-cols-3 gap-3">{seasonal.map((s) => <MiniCard key={s.t} {...s} />)}</div>
          </div>
          <div className="rounded-xl bg-secondary/60 p-5">
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
      <footer className="relative mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-3 lg:pl-56">
        <img src={phone} alt="تطبيق الأكاديمية" className="absolute -top-28 left-6 hidden w-44 rounded-xl lg:block" />
        <div>
          <h3 className="font-display text-lg font-bold text-primary">تابعنا على</h3>
          <div className="mt-4 flex gap-3">
            {socials.map((Icon, i) => (
              <a key={i} href="#" className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-gold">
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-primary">اشترك في نشرتنا البريدية</h3>
          <p className="text-sm text-muted-foreground">ليصلك جديد الدورات والمبادرات</p>
          <form className="mt-3 flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input type="email" required placeholder="بريدك الإلكتروني" className="flex-1 rounded-md border border-input bg-card px-3 py-2 text-sm outline-none focus:border-ring" />
            <button className="rounded-md bg-primary px-5 py-2 text-sm font-bold text-primary-foreground">اشتراك</button>
          </form>
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-primary">تطبيق الأكاديمية</h3>
          <p className="text-sm text-muted-foreground">تعلم أينما كنت .. واستمر في رحلتك</p>
          <div className="mt-3 flex gap-2" dir="ltr">
            <a href="#" className="rounded-md bg-foreground px-3 py-1.5 text-xs text-background"><span className="block text-[9px] opacity-70">GET IT ON</span>Google Play</a>
            <a href="#" className="rounded-md bg-foreground px-3 py-1.5 text-xs text-background"><span className="block text-[9px] opacity-70">Download on the</span>App Store</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
