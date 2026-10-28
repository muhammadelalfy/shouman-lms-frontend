import type { CSSProperties } from "react";
import type { NeedsSection as NeedsSectionContent } from "@/features/home/content/schema";
import { needsImages } from "@/features/home/content/assets";
import "./landing-reference.css";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LandingReviewPreview } from "./landing-review-preview";
import { MarketingDiscovery } from "@/features/marketing/discovery";
import { BlurFade } from "@/components/ui/blur-fade";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { IslamicPattern } from "@/components/ui/islamic-pattern";
import { ScrollEffects } from "@/components/motion/scroll-effects";
import { ParallaxLayer } from "@/components/ui/parallax-layer";
import { TiltCard } from "@/components/ui/tilt-card";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { BorderBeam } from "@/components/ui/border-beam";
import { AcademySlider } from "@/components/motion/academy-slider";
import Image from "next/image";
import Link from "next/link";
import {
  ComingSoonButton,
  MobileNavigation,
} from "@/features/home/components/preview-interactions";
import {
  Search,
  UserPlus,
  LogIn,
  Sparkles,
  Moon,
  BookOpen,
  Users,
  ArrowLeft,
  ChevronDown,
  Play,
  Gift,
  UsersRound,
  Medal,
  FileText,
  Quote,
  CalendarCheck,
  Compass,
  MonitorPlay,
  PenLine,
  Eye,
  BadgeCheck,
  Youtube,
  Facebook,
  Instagram,
  Twitter,
  Send,
  Music2,
  GraduationCap,
  Download,
  ClipboardCheck,
  ChartNoAxesCombined,
  LockKeyhole,
  Headphones,
} from "lucide-react";

import heroMosque from "@/assets/build-exactly-web/hero-mosque.jpg";
import sheikhHazemHero from "@/assets/homepage/sheikh-hazem-hero-wide.png";
import courseAdhan from "@/assets/build-exactly-web/course-adhan.jpg";
import courseSanah from "@/assets/build-exactly-web/course-sanah.jpg";
import courseMadinah from "@/assets/build-exactly-web/course-madinah.jpg";
import courseQuran from "@/assets/build-exactly-web/course-quran.jpg";
import featuresDevices from "@/assets/build-exactly-web/features-devices.jpg";
import ctaMosque from "@/assets/build-exactly-web/cta-mosque.jpg";
import cardArticles from "@/assets/build-exactly-web/card-articles.jpg";
import cardInitiatives from "@/assets/build-exactly-web/card-initiatives.jpg";
import cardPrograms from "@/assets/build-exactly-web/card-programs.jpg";
import featureCommunity from "@/assets/homepage-cards/feature-community.webp";


const navLinks = [
  { label: "الرئيسية", href: "#home" },
  { label: "المسارات", href: "#tracks" },
  { label: "المركز", href: "#features" },
  { label: "البرامج", href: "#articles" },
  { label: "الميزات", href: "#features" },
  { label: "المقالات", href: "#articles" },
  { label: "عن الشيخ" },
  { label: "تواصل معنا", href: "#contact" },
];

const chips = [
  "القرآن الكريم",
  "تطوير الذات",
  "الزواج والأسرة",
  "الشباب",
  "التربية",
  "العقيدة",
];

const tracks = [
  {
    image: courseAdhan,
    badge: "مسار إيماني",
    title: "أذن خير",
    desc: "رحلة عملية في تزكية النفس ومواجهة الفتن وبناء العادات",
    courses: "10 دورات",
    lessons: "280 درس",
  },
  {
    image: courseSanah,
    badge: "مسار أساسي",
    title: "سنة أولى علم",
    desc: "بناء أساسك العلمي في العقيدة والفقه والسيرة",
    courses: "14 دورة",
    lessons: "420 درس",
  },
  {
    image: courseMadinah,
    badge: "الأكثر إقبالًا",
    title: "إنه محمد ﷺ",
    desc: "سيرة النبي ﷺ .. لتكون قدوتك في الحياة",
    courses: "8 دورات",
    lessons: "184 درس",
  },
  {
    image: courseQuran,
    badge: "مسار متكامل",
    title: "المعهد القرآني الدعوي",
    desc: "حفظ وفهم وتدبر .. مع التأصيل الدعوي وعلوم القرآن",
    courses: "12 دورة",
    lessons: "320 درس",
  },
];

const features = [
  { icon: GraduationCap, title: "مسارات دراسية متكاملة" },
  { icon: Headphones, title: "محاضرات صوتية ومرئية" },
  { icon: ClipboardCheck, title: "اختبارات وتكليفات" },
  { icon: Download, title: "ملفات وملخصات تعليمية" },
  { icon: Eye, title: "متابعة وإشراف" },
  { icon: BadgeCheck, title: "تصميم شهادات برمز QR" },
  { icon: LockKeyhole, title: "محتوى مجاني ومدفوع" },
  { icon: UsersRound, title: "مجموعات وتعلّم بالممارسة" },
  { icon: Medal, title: "تصميم شارات وإنجازات" },
  { icon: ChartNoAxesCombined, title: "تصميم لوحة متابعة التقدم" },
];

const stats = [
  { icon: Users, value: "+180,000", label: "طالب وطالبة" },
  { icon: Play, value: "+1,800", label: "محاضرة" },
  { icon: BookOpen, value: "+170", label: "سلسلة ودورة" },
  { icon: FileText, value: "+3,200", label: "مادة تعليمية" },
  { icon: UsersRound, value: "+120", label: "مسار وبرنامج" },
];

const steps = [
  { icon: UserPlus, num: "01", title: "تسجيل حساب", desc: "سريع ومجاني" },
  { icon: Compass, num: "02", title: "اختيار المسار", desc: "المناسب لك" },
  { icon: MonitorPlay, num: "03", title: "دراسة الدروس", desc: "بمرونة في وقتك" },
  { icon: PenLine, num: "04", title: "اختبارات وتكليفات", desc: "لقياس الفهم" },
  { icon: Eye, num: "05", title: "متابعة وإشراف", desc: "من فريق متخصص" },
  { icon: BadgeCheck, num: "06", title: "شهادة وإنجاز", desc: "نموذج غير مُصدر" },
];

const faqs = [
  { q: "هل المركز مناسب للمبتدئين؟", a: "يمكنك استكشاف المحتوى المنشور في الفهرس، أو تجربة التوجيه الاختياري في دليل الرحلة. التوجيه ليس اختبار قبول ولا شرطًا للتسجيل." },
  { q: "هل هناك شهادات معتمدة؟", a: "المعروض هنا تصميم توضيحي للشهادة ورمز التحقق، ولا يثبت اعتمادًا أو إصدارًا فعليًا. شروط الإصدار والتحقق تحتاج إلى اعتماد وربط بالخدمة." },
  { q: "هل المحتوى مجاني أم مدفوع؟", a: "يشمل نطاق المشروع عروضًا مجانية ومدفوعة. يمكنك استخدام فلاتر الفهرس لمعرفة المحتوى المنشور؛ وجود المعاينة لا يعني تفعيل الدفع أو الاشتراك." },
  { q: "كيف يمكنني اختيار المسار المناسب؟", a: "استكشف الموضوعات من قسم «ماذا تحتاج الآن؟» أو جرّب التوجيه الاختياري في دليل الرحلة، دون درجات أو شروط قبول. بطاقات هذه الصفحة نماذج تصميم." },
];

function Header({ hasSession }: { hasSession: boolean }) {
  return (
    <header className="landing-home-header sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 landing-container items-center gap-4 px-4 lg:px-8">
        {/* Logo */}
        <a href="#home" className="flex shrink-0 items-center gap-2">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Moon className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-[11px] font-semibold text-muted-foreground">
              مركز
            </span>
            <span className="block text-base font-extrabold text-primary">
              د. حازم شومان
            </span>
          </span>
        </a>

        {/* Nav */}
        <nav className="mx-auto hidden items-center gap-1 xl:flex">
          {navLinks.map((link, i) => link.href ? (
            <a
              key={link.label}
              href={link.href}
              className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground ${
                i === 0 ? "bg-gold-soft text-accent-foreground" : "text-foreground/80"
              }`}
            >
              {link.label}
            </a>
          ) : (
            <ComingSoonButton
              key={link.label}
              title={link.label}
              className="rounded-full px-3 py-2 text-sm font-semibold text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {link.label}
            </ComingSoonButton>
          ))}
        </nav>

        {/* Actions */}
        <div className="ms-auto flex shrink-0 items-center gap-2 lg:ms-0">
          <ThemeToggle />
          <MobileNavigation navigation={[
            ...navLinks,
            { label: hasSession ? "حسابي" : "تسجيل الدخول", href: hasSession ? "/account" : "/auth/login" },
            { label: hasSession ? "لوحتي" : "إنشاء حساب", href: hasSession ? "/dashboard" : "/auth/register" },
          ]} />
          <ComingSoonButton href="/search" ariaLabel="بحث"
            className="landing-header-search flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent"
          >
            <Search className="size-4" />
          </ComingSoonButton>
          <ComingSoonButton href={hasSession ? "/account" : "/auth/login"} className="hidden items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-bold text-foreground transition-colors hover:bg-accent sm:flex">
            <LogIn className="size-4" />
            {hasSession ? "حسابي" : "تسجيل الدخول"}
          </ComingSoonButton>
          <ComingSoonButton href={hasSession ? "/dashboard" : "/auth/register"} className="hidden items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-extrabold text-gold-foreground shadow-gold transition-transform hover:scale-[1.03] sm:flex">
            <UserPlus className="size-4" />
            {hasSession ? "لوحتي" : "إنشاء حساب"}
          </ComingSoonButton>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="academy-hero relative overflow-hidden lg:min-h-[calc(100svh-4rem)]">
      <AnimatedGridPattern className="academy-geometry" />
      <figure className="absolute inset-x-0 top-0 h-[270px] sm:h-[340px] lg:inset-0 lg:h-full">
        <Image
          src={sheikhHazemHero}
          alt="الشيخ حازم شومان يبتسم وينظر نحو عنوان المركز"
          fill
          sizes="100vw"
          preload
          className="object-cover object-left lg:object-center"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent lg:hidden" />
        <div aria-hidden="true" className="absolute inset-0 hidden bg-gradient-to-l from-background/70 via-background/25 to-transparent lg:block" />
        <figcaption className="absolute bottom-8 left-6 hidden w-48 rounded-2xl border border-white/20 bg-navy/75 p-5 text-navy-foreground shadow-soft backdrop-blur-sm lg:block xl:left-12">
          <Quote aria-hidden="true" className="size-7 text-gold" />
          <blockquote className="mt-2 font-quran text-lg leading-8">
            وما توفيقي إلا بالله عليه توكلت وإليه أنيب
          </blockquote>
          <span className="mt-2 block text-sm font-bold">د. حازم شومان</span>
        </figcaption>
      </figure>

      <div className="relative mx-auto landing-container px-4 pb-16 pt-[290px] sm:pt-[360px] lg:min-h-[620px] lg:px-8 lg:py-20">
        <div className="max-w-2xl lg:max-w-[58%] xl:max-w-[54%]">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold-soft px-4 py-1.5 text-sm font-bold text-accent-foreground">
            <Sparkles className="size-4 text-gold" />
            مركز د. حازم شومان
          </span>
          <p className="mt-3 text-xs font-bold text-muted-foreground">
            نسخة معاينة — بيانات وأرقام توضيحية
          </p>

          <h1 className="mt-6 text-5xl font-black leading-[1.15] text-primary sm:text-6xl lg:text-7xl">
            علم <span className="text-gradient-gold">ينتقل بك</span>
          </h1>
          <p className="mt-3 text-2xl font-extrabold text-gold sm:text-3xl">
            من المعرفة .. إلى حياة أقرب إلى الله
          </p>
          <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
            مسارات علمية وإيمانية متكاملة .. لتزكية النفس وبناء الشخصية المسلمة
            .. مع محتوى موثوق وإشراف مباشر
          </p>

          {/* Native GET search shares the operational catalog URL state. */}
          <form action="/search" method="get" noValidate className="mt-8 flex w-full max-w-xl items-center gap-2 rounded-full border border-border bg-card p-2 text-start shadow-soft">
            <Search className="ms-3 size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <label htmlFor="home-catalog-query" className="sr-only">ابحث عن دورة أو موضوع</label>
            <input id="home-catalog-query" type="search" name="q" placeholder="ابحث في المحتوى المنشور ..." className="min-h-11 min-w-0 w-full bg-transparent text-sm font-medium text-foreground outline-offset-2" />
            <button type="submit" className="min-h-11 shrink-0 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground">بحث</button>
          </form>

          {/* Chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <ComingSoonButton
                key={chip}
                href={`/search?q=${encodeURIComponent(chip)}`}
                className="rounded-full border border-border bg-card/80 px-4 py-1.5 text-xs font-bold text-foreground/80 backdrop-blur transition-colors hover:border-gold hover:bg-gold-soft hover:text-accent-foreground"
              >
                {chip}
              </ComingSoonButton>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ComingSoonButton href="/preview/dashboard" className="academy-shimmer flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-base font-extrabold text-gold-foreground shadow-gold transition-transform hover:scale-[1.03]">
              انضم كطالب
              <ArrowLeft className="size-5" />
            </ComingSoonButton>
            <ComingSoonButton href="/tracks" className="flex items-center gap-2 rounded-full border-2 border-primary bg-card/70 px-7 py-3 text-base font-extrabold text-primary backdrop-blur transition-colors hover:bg-primary hover:text-primary-foreground">
              <Compass className="size-5" />
              تصفح المسارات
            </ComingSoonButton>
            <ComingSoonButton href="/instructor" className="flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-extrabold text-primary-foreground shadow-soft transition-transform hover:scale-[1.03]">
              <UserPlus className="size-5" />
              انضم كمعلم
            </ComingSoonButton>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">انضم كطالب أو كمعلم لاستكشاف لوحة الدور. اللوحات معاينات؛ لا تنشئ حسابًا أو تمنح صلاحية.</p>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({
  title,
  subtitle,
  action,
  actionHref,
}: {
  title: string;
  subtitle?: string;
  action?: string;
  actionHref?: string;
}) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div className="w-full text-center">
        <h2 className="text-3xl font-black text-primary sm:text-4xl">{title}</h2>
        {subtitle && (
          <p className="mt-3 text-sm font-semibold text-muted-foreground sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
      {action && (
        <ComingSoonButton
          title={action}
          href={actionHref}
          className="mx-auto flex items-center gap-1.5 rounded-full bg-gold-soft px-4 py-2 text-sm font-bold text-accent-foreground transition-colors hover:bg-gold hover:text-gold-foreground"
        >
          {action}
          <ArrowLeft className="size-4" />
        </ComingSoonButton>
      )}
    </div>
  );
}

function NeedsSection({ content, hasSession }: {content: NeedsSectionContent; hasSession: boolean}) {
  const cards=content.cards.filter(card=>card.enabled);
  if(!content.enabled || !cards.length) return null;
  const destination=(href:string)=>hasSession?href:`/auth/login?redirectTo=${encodeURIComponent(href)}`;
  return <section id="needs" className="landing-rounded-panel mx-auto landing-container px-4 py-16 lg:px-8">
    <SectionHeading title={content.title} subtitle={content.subtitle??undefined} action={content.cta_label} actionHref={destination(content.cta_href)}/>
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3" style={{"--needs-columns":Math.min(cards.length,9)} as CSSProperties}>
      {cards.map(card=>card.style==='photo'?<Link key={card.id} href={destination(card.href)} className="landing-need-mosque group relative col-span-2 overflow-hidden rounded-2xl border border-border shadow-soft transition-all hover:-translate-y-1 sm:col-span-1">
        <Image src={needsImages[card.image_key]} alt="" width={240} height={360} sizes="(max-width: 700px) 90vw, (max-width: 1100px) 30vw, 180px" className="h-full min-h-36 w-full object-cover transition-transform duration-500 group-hover:scale-105"/>
        <span className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent"/>
        <span className="absolute bottom-3 inset-x-3 text-sm font-extrabold text-navy-foreground"><strong className="block">{card.title}</strong>{card.description && <span className="mt-1 block text-xs font-semibold leading-5">{card.description}</span>}</span>
      </Link>:<Link key={card.id} href={destination(card.href)} className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-3 text-center shadow-soft transition-all hover:-translate-y-1 hover:border-gold/60">
        <Image src={needsImages[card.image_key]} alt="" width={80} height={80} sizes="80px" className="landing-need-image"/>
        <span className="text-sm font-extrabold leading-6 text-foreground">{card.title}</span>
        <span className="text-[10px] font-semibold leading-4 text-muted-foreground">{card.description}</span>
      </Link>)}
    </div>
  </section>;
}

function TracksSection() {
  return (
    <section id="tracks" className="landing-rounded-panel mx-auto landing-container py-16">
      <div className="mx-auto landing-container px-4 lg:px-8">
        <SectionHeading
          title="المسارات التعليمية في المركز"
          subtitle="بطاقات وأعداد توضيحية من مرجع التصميم؛ المحتوى المنشور متاح في الفهرس"
          action="عرض جميع المسارات"
        />
        <AcademySlider label="المسارات التعليمية">
          {tracks.map((track) => (
            <TiltCard
              key={track.title}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-[box-shadow,transform] duration-200 hover:shadow-gold"
            >
              <BorderBeam duration={4} size={90} borderWidth={1.5} />
              <div className="relative h-36 overflow-hidden">
                <Image
                  src={track.image}
                  alt={track.title}
                  width={1024}
                  height={768}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute right-3 top-3 rounded-full bg-gold px-3 py-1 text-[11px] font-extrabold text-gold-foreground shadow-gold">
                  {track.badge}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-base font-black text-primary">{track.title}</h3>
                <p className="mt-2 min-h-12 text-[13px] font-semibold leading-6 text-muted-foreground">
                  {track.desc}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  <span className="text-xs font-bold text-muted-foreground">
                    {track.courses} | {track.lessons}
                  </span>
                  <span className="flex size-9 items-center justify-center rounded-full bg-gold-soft text-gold transition-colors group-hover:bg-gold group-hover:text-gold-foreground">
                    <ArrowLeft className="size-4" />
                  </span>
                </div>
              </div>
            </TiltCard>
          ))}
        </AcademySlider>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="landing-features mx-auto landing-container px-4 py-12 lg:px-8">
      <SectionHeading title="ماذا يقدم لك المركز ؟" subtitle="تصوّر لبيئة تجمع العلم والتطبيق والمتابعة — الخدمات غير المتصلة تظل معاينات" />
      <div className="landing-feature-layout">
        <div className="landing-feature-grid">
          {features.map((feature) => (
            <div key={feature.title} className="landing-feature-tile">
              <span className="landing-feature-icon"><feature.icon className="size-6" aria-hidden="true" /></span>
              <h3>{feature.title}</h3>
            </div>
          ))}
        </div>
        <figure className="landing-device-mockup">
          <Image src={featuresDevices} alt="نموذج عرض المنصة على الأجهزة — صورة توضيحية" width={1024} height={768} loading="lazy" sizes="(max-width: 1023px) 92vw, 34vw" className="h-auto w-full object-contain" />
          <figcaption><span className="landing-feature-icon"><BookOpen className="size-6" aria-hidden="true" /></span><div><strong>تعلّم .. طبّق .. وانطلق</strong><p>تصوّر لرحلتك مع العلم</p></div></figcaption>
          <ComingSoonButton ariaLabel="الفيديو التعريفي — غير متاح" className="landing-device-play"><Play className="size-5" aria-hidden="true" /></ComingSoonButton>
        </figure>
      </div>
    </section>
  );
}

function HubCardsSection() {
  const cards = [
    {
      image: cardArticles,
      title: "المقالات",
      desc: "مقالات علمية وتربوية في العقيدة والفقه والسيرة وقضايا العصر",
      cta: "اقرأ المقالات",
    },
    {
      image: cardInitiatives,
      title: "المبادرات",
      desc: "مبادرات دعوية ومجتمعية لنشر أوسع في بلادك ومجتمعك",
      cta: "تعرف على المبادرات",
    },
    {
      image: cardPrograms,
      title: "البرامج الخاصة",
      desc: "برامج موسمية ومتخصصة للشباب والأسر والنساء",
      cta: "عرض البرامج",
    },
  ];
  return (
    <section id="articles" className="mx-auto landing-container px-4 pb-16 lg:px-8">
      <AcademySlider label="المقالات والمبادرات والبرامج">
        {cards.map((card) => (
          <article
            key={card.title}
            className="landing-hub-card group relative overflow-hidden rounded-2xl border border-border shadow-soft"
          >
            <Image
              src={card.image}
              alt={card.title}
              width={1024}
              height={640}
              loading="lazy"
              className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <h3 className="text-xl font-black text-navy-foreground">{card.title}</h3>
              <p className="mt-2 text-[13px] font-semibold leading-6 text-navy-foreground/85">
                {card.desc}
              </p>
              <ComingSoonButton className="academy-shimmer mt-4 flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-extrabold text-gold-foreground shadow-gold transition-transform hover:scale-105">
                {card.cta}
                <ArrowLeft className="size-4" />
              </ComingSoonButton>
            </div>
          </article>
        ))}
      </AcademySlider>
    </section>
  );
}

function StatsSection() {
  return (
    <section id="stats" className="landing-stats relative overflow-hidden py-10" aria-describedby="landing-stats-disclosure">
      <ParallaxLayer className="landing-stats-backdrop absolute inset-0 overflow-hidden">
        <Image src={heroMosque} alt="" fill sizes="100vw" loading="lazy" className="object-cover" />
      </ParallaxLayer>
      <div className="landing-stats-shade absolute inset-0" aria-hidden="true" />
      <div className="relative mx-auto landing-container px-4 lg:px-8">
        <h2 className="text-center text-2xl font-black text-primary sm:text-3xl">أرقام تتحدث عن الأثر</h2>
        <p id="landing-stats-disclosure" className="mx-auto mt-2 max-w-xl text-center text-xs font-bold leading-6 text-primary">أرقام توضيحية من مرجع التصميم، وليست إحصاءات فعلية للمركز.</p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat) => (
            <div key={stat.label} className="landing-stat-tile">
              <stat.icon className="size-6 text-accent-foreground" aria-hidden="true" />
              <span className="text-2xl font-black text-primary sm:text-3xl"><AnimatedCounter value={stat.value} /></span>
              <span className="text-xs font-bold text-muted-foreground">{stat.label}</span>
              <span className="text-[10px] font-semibold text-muted-foreground">نموذج توضيحي</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepsSection() {
  return (
    <section id="steps" className="mx-auto landing-container px-4 py-16 lg:px-8">
      <SectionHeading
        title="كيف يعمل المركز ؟"
        subtitle="تصوّر لرحلة التعلّم؛ الاختبارات والمتابعة وإصدار الشهادات ليست مفعّلة هنا"
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {steps.map((step, i) => (
          <div key={step.num} className="relative">
            <div className="flex h-full flex-col items-center gap-2 rounded-2xl border border-border bg-card p-5 text-center shadow-soft transition-all hover:-translate-y-1 hover:border-gold/60">
              <span className="text-xs font-black text-gold">{step.num}</span>
              <span className="flex size-12 items-center justify-center rounded-2xl bg-gold-soft text-gold">
                <step.icon className="size-6" />
              </span>
              <span className="text-sm font-extrabold text-foreground">
                {step.title}
              </span>
              <span className="text-[11px] font-semibold text-muted-foreground">
                {step.desc}
              </span>
            </div>
            {i < steps.length - 1 && (
              <ArrowLeft className="absolute -left-3 top-1/2 hidden size-5 -translate-y-1/2 text-gold lg:block" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function CommunitySection() {
  return (
    <section id="community" className="bg-secondary/40 py-8">
      <div className="landing-community-grid mx-auto landing-container gap-4 px-4 lg:px-8">
        <div className="landing-content-plans rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h2 className="text-base font-black text-primary">محتوى مجاني ومحتوى مدفوع</h2>
          <p className="mt-2 text-[11px] leading-6 text-muted-foreground">استكشف المنشور في الفهرس؛ الدفع والتسجيل لا يُفعّلان من هذه البطاقات.</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-secondary/50 p-3"><Medal className="mb-2 size-6 text-primary" aria-hidden="true" /><h3 className="text-sm font-bold text-primary">المحتوى المدفوع</h3><p className="mt-2 text-xs leading-6 text-muted-foreground">تعرّف إلى العروض المنشورة، دون وعد بمتابعة أو شهادة غير مفعّلة.</p><Link className="landing-small-link mt-3" href="/catalog?pricing=paid">استكشف المحتوى المدفوع <ArrowLeft className="size-3" aria-hidden="true" /></Link></div>
            <div className="rounded-xl border border-border bg-secondary/50 p-3"><Gift className="mb-2 size-6 text-primary" aria-hidden="true" /><h3 className="text-sm font-bold text-primary">المحتوى المجاني</h3><p className="mt-2 text-xs leading-6 text-muted-foreground">استكشف الدروس والموضوعات التي نُشرت بوصفها مجانية.</p><Link className="landing-small-link mt-3" href="/catalog?pricing=free">استكشف المحتوى المجاني <ArrowLeft className="size-3" aria-hidden="true" /></Link></div>
          </div>
        </div>
        <div className="landing-community-photo relative isolate overflow-hidden rounded-2xl border border-border text-navy-foreground shadow-soft">
          <Image src={featureCommunity} alt="تصوّر بصري لصحبة التعلّم، وليس صورة لأعضاء مسجلين" fill sizes="(max-width: 1023px) 92vw, 33vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-navy/95 via-navy/75 to-navy/10" aria-hidden="true" />
          <div className="relative flex h-full flex-col items-start justify-end p-6"><span className="mb-2 text-[10px] font-bold">تصميم توضيحي للمجتمع</span><h2 className="text-xl font-black">مجتمع طلاب المركز</h2><p className="mt-3 text-xs font-semibold leading-7 text-navy-foreground/90">صحبة في التعلّم، وحوار حول المعرفة. العضويات والنقاشات الفعلية غير متاحة في المعاينة.</p><Link href="/preview/marketing/companions" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-background px-5 py-2 text-xs font-bold text-primary">استكشف فكرة رفيق العلم <ArrowLeft className="size-4" aria-hidden="true" /></Link></div>
        </div>
        <LandingReviewPreview />
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section id="faq" className="landing-faq">
      <SectionHeading
        title="الأسئلة الشائعة"
        subtitle="إجابات عن أكثر ما يصلنا من استفسارات"
      />
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <details
            key={faq.q}
            open={i === 0}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
              <span className="text-sm font-extrabold text-foreground sm:text-base">
                {faq.q}
              </span>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                <ChevronDown className="size-4" />
              </span>
            </summary>
            <p className="border-t border-border px-5 py-4 text-sm font-semibold leading-7 text-muted-foreground">
              {faq.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section id="cta" className="landing-final-cta relative overflow-hidden rounded-2xl">
      <Image
        src={ctaMosque}
        alt=""
        width={1920}
        height={768}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-navy/70" />
      <div className="relative mx-auto landing-container px-5 py-10 text-center lg:px-6">
        <h2 className="text-3xl font-black leading-snug text-navy-foreground sm:text-4xl lg:text-5xl">
          ابدأ رحلتك الآن مع مركز د. حازم شومان
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-8 text-navy-foreground/85">
          تعلم .. تزكية .. تطبيق .. نحو حياة أقرب إلى الله
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ComingSoonButton href="/auth/register" className="academy-shimmer flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-extrabold text-primary-foreground shadow-soft transition-transform hover:scale-105">
            <UserPlus className="size-5" />
            إنشاء حساب مجاني
          </ComingSoonButton>
          <ComingSoonButton href="/tracks" className="flex items-center gap-2 rounded-full border-2 border-navy-foreground/40 bg-navy-foreground/10 px-5 py-3 text-sm font-extrabold text-navy-foreground backdrop-blur transition-colors hover:bg-navy-foreground/20">
            <Compass className="size-5" />
            تصفح المسارات
          </ComingSoonButton>
        </div>
      </div>
    </section>
  );
}

function Footer({ hasSession }: { hasSession: boolean }) {
  const columns = [
    { title: "تعلّم معنا", links: [{ label: "الفهرس التعليمي", href: "/catalog" }, { label: "المسارات التعليمية", href: "/tracks" }, { label: "الدورات", href: "/courses" }] },
    { title: "المركز", links: [{ label: "عن المركز", href: "/about" }, { label: "الأسئلة الشائعة", href: "/faq" }, { label: "تواصل معنا", href: "/contact" }] },
    { title: "حسابك", links: hasSession ? [{ label: "إعدادات الحساب", href: "/account" }, { label: "مساحتي التعليمية", href: "/dashboard" }, { label: "تعلّمي", href: "/my-learning" }] : [{ label: "تسجيل الدخول", href: "/auth/login" }, { label: "إنشاء حساب", href: "/auth/register" }, { label: "مساحتي التعليمية", href: "/dashboard" }] },
  ];
  const socials = [{ Icon: Youtube, name: "يوتيوب" }, { Icon: Facebook, name: "فيسبوك" }, { Icon: Instagram, name: "إنستغرام" }, { Icon: Music2, name: "تيك توك" }, { Icon: Send, name: "تيليجرام" }, { Icon: Twitter, name: "إكس" }];
  return <footer id="contact" className="landing-footer">
    <div className="landing-footer-inner">
      <div className="landing-footer-grid">
        <div className="landing-footer-brand">
          <Link href="/" className="landing-footer-logo"><span><BookOpen size={25} aria-hidden="true" /></span><div><small>مركز</small><strong>د. حازم شومان</strong></div></Link>
          <p>رحلة علم وتربية وصناعة أثر.<br />خطوة تتعلّمها، ومعنى تحيا به.</p>
          <div className="landing-footer-socials" aria-label="قنوات التواصل قيد التجهيز">{socials.map(({ Icon, name }) => <ComingSoonButton key={name} title={name} ariaLabel={`${name} — قريبًا`} className="landing-footer-social"><Icon size={18} aria-hidden="true" /></ComingSoonButton>)}</div>
          <small className="landing-footer-availability">روابط التواصل متاحة قريبًا</small>
        </div>
        {columns.map(column => <nav key={column.title} aria-label={column.title} className="landing-footer-column"><h2>{column.title}</h2><ul>{column.links.map(link => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}</ul></nav>)}
      </div>
      <div className="landing-footer-bottom"><p>جميع الحقوق محفوظة لمركز د. حازم شومان © 2026</p><span><CalendarCheck size={16} aria-hidden="true" />تعلّم · تزكية · تطبيق</span></div>
    </div>
  </footer>;
}

export default function BuildExactlyHome({ hasSession = false, needsSection = null, needsError = false }: { hasSession?: boolean; needsSection?: NeedsSectionContent | null; needsError?: boolean } = {}) {
  return (
    <div id="home-page" className="academy-motion isolate min-h-screen bg-background font-sans">
      <IslamicPattern className="islamic-pattern-page" />
      <ScrollEffects rootId="home-page" />
      <ScrollProgress />
      <Header hasSession={hasSession} />
      <main id="main-content">
        <Hero />
        {needsSection && <BlurFade><NeedsSection content={needsSection} hasSession={hasSession}/></BlurFade>}
        {needsError && <section id="needs" className="landing-rounded-panel mx-auto landing-container p-8 text-center" role="status"><p>تعذر تحميل تصنيفات الاهتمامات الآن.</p><Link href="/" className="underline">إعادة المحاولة</Link></section>}
        <BlurFade><TracksSection /></BlurFade>
        <div id="landing-discovery" className="landing-rounded-panel landing-discovery-panel mx-auto landing-container px-4 py-10 lg:px-8"><MarketingDiscovery audience="landing" /></div>
        <BlurFade><FeaturesSection /></BlurFade>
        <BlurFade><HubCardsSection /></BlurFade>
        <BlurFade><StatsSection /></BlurFade>
        <BlurFade><StepsSection /></BlurFade>
        <BlurFade><CommunitySection /></BlurFade>
        <div className="landing-final-grid mx-auto landing-container gap-5 px-4 pb-10 lg:px-8"><BlurFade><CtaSection /></BlurFade><BlurFade><FaqSection /></BlurFade></div>
      </main>
      <Footer hasSession={hasSession} />
    </div>
  );
}
