import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  UserPlus,
  LogIn,
  Heart,
  Sparkles,
  Moon,
  BookOpen,
  Leaf,
  Users,
  GraduationCap,
  Landmark,
  ArrowLeft,
  ChevronDown,
  Play,
  Headphones,
  ClipboardCheck,
  Download,
  UserCheck,
  Award,
  Gift,
  UsersRound,
  Medal,
  TrendingUp,
  FileText,
  Star,
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
} from "lucide-react";

import heroMosque from "@/assets/hero-mosque.jpg";
import courseAdhan from "@/assets/course-adhan.jpg";
import courseSanah from "@/assets/course-sanah.jpg";
import courseMadinah from "@/assets/course-madinah.jpg";
import courseQuran from "@/assets/course-quran.jpg";
import featuresDevices from "@/assets/features-devices.jpg";
import ctaMosque from "@/assets/cta-mosque.jpg";
import avatarStudent from "@/assets/avatar-student.jpg";
import cardArticles from "@/assets/card-articles.jpg";
import cardInitiatives from "@/assets/card-initiatives.jpg";
import cardPrograms from "@/assets/card-programs.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "أكاديمية د. حازم شومان | علم ينتقل بك" },
      {
        name: "description",
        content:
          "مسارات علمية وإيمانية متكاملة لتزكية النفس وبناء الشخصية المسلمة، مع محتوى موثوق وإشراف مباشر من د. حازم شومان.",
      },
      { property: "og:title", content: "أكاديمية د. حازم شومان | علم ينتقل بك" },
      {
        property: "og:description",
        content:
          "مسارات علمية وإيمانية متكاملة لتزكية النفس وبناء الشخصية المسلمة، مع محتوى موثوق وإشراف مباشر.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const navLinks = [
  "الرئيسية",
  "المسارات",
  "الأكاديمية",
  "البرامج",
  "الميزات",
  "المقالات",
  "عن الشيخ",
  "تواصل معنا",
];

const chips = [
  "القرآن الكريم",
  "تطوير الذات",
  "الزواج والأسرة",
  "الشباب",
  "التربية",
  "العقيدة",
];

const needs = [
  {
    icon: BookOpen,
    title: "أريد أن أتعلم ديني",
    tags: "العقيدة - الفقه - السيرة - التفسير",
  },
  {
    icon: GraduationCap,
    title: "أنا طالب / شاب",
    tags: "الجامعة - الصحبة - النجاح - الفتن",
  },
  {
    icon: Users,
    title: "عندي مشكلة أسرية",
    tags: "التربية - الأبناء - العلاقات",
  },
  {
    icon: Leaf,
    title: "أعاني من الفتور",
    tags: "معرفة الله - إجابة الإيمان - أعمال القلوب",
  },
  {
    icon: BookOpen,
    title: "أريد أفهم القرآن",
    tags: "تدبر - تفسير - حفظ - تعاهد",
  },
  {
    icon: Moon,
    title: "أريد أن أنتظم في الصلاة",
    tags: "الصلاة - الخشوع - قيام الليل",
  },
  {
    icon: Sparkles,
    title: "أريد أن أتوب",
    tags: "التوبة - الذنوب - بداية الطريق",
  },
  {
    icon: Heart,
    title: "أريد أن أقترب من الله",
    tags: "محبة الله - حسن الظن بالله",
  },
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
  { icon: MonitorPlay, title: "مسارات دراسية متكاملة" },
  { icon: Headphones, title: "محاضرات صوتية ومرئية عالية الجودة" },
  { icon: ClipboardCheck, title: "اختبارات وتكليفات لكل درس" },
  { icon: Download, title: "محتوى قابل للتحميل ملفات وملخصات" },
  { icon: UserCheck, title: "متابعة وإشراف من فريق متخصص" },
  { icon: Award, title: "شهادات معتمدة برمز تحقق QR" },
  { icon: Gift, title: "محتوى مجاني ومدفوع يناسبك" },
  { icon: UsersRound, title: "مجموعات تفاعلية وتعلم بالممارسة" },
  { icon: Medal, title: "شارات وإنجازات في كل مسار" },
  { icon: TrendingUp, title: "لوحة متابعة تقدمك وإحصائيات مقطعة" },
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
  { icon: BadgeCheck, num: "06", title: "شهادة وإنجاز", desc: "بعد إتمام المسار" },
];

const faqs = [
  {
    q: "هل الأكاديمية مناسبة للمبتدئين؟",
    a: "نعم، صُممت المسارات لتأخذ بيدك من الصفر خطوة بخطوة، مع اختبار تحديد مستوى يساعدك على البدء من النقطة المناسبة لك.",
  },
  {
    q: "هل هناك شهادات معتمدة؟",
    a: "نعم، تحصل على شهادة إتمام معتمدة برمز تحقق QR بعد اجتياز اختبارات كل مسار بنجاح.",
  },
  {
    q: "هل المحتوى مجاني أم مدفوع؟",
    a: "نوفر محتوى مجانيًا واسعًا يشمل دروسًا ومحاضرات مختارة، إلى جانب مسارات متكاملة مدفوعة بإشراف ومتابعة وشهادات.",
  },
  {
    q: "كيف يمكنني اختيار المسار المناسب؟",
    a: "ابدأ بقسم «ماذا تحتاج الآن؟» أو أجب على اختبار تحديد المسار، وسيقترح عليك النظام المسار الأنسب لحالتك وهدفك.",
  },
];

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 lg:px-8">
        {/* Logo */}
        <a href="#" className="flex shrink-0 items-center gap-2">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Moon className="size-5" />
          </span>
          <span className="leading-tight">
            <span className="block text-[11px] font-semibold text-muted-foreground">
              أكاديمية
            </span>
            <span className="block text-base font-extrabold text-primary">
              د. حازم شومان
            </span>
          </span>
        </a>

        {/* Nav */}
        <nav className="mx-auto hidden items-center gap-1 lg:flex">
          {navLinks.map((link, i) => (
            <a
              key={link}
              href="#"
              className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground ${
                i === 0 ? "bg-gold-soft text-accent-foreground" : "text-foreground/80"
              }`}
            >
              {link}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="ms-auto flex items-center gap-2 lg:ms-0">
          <button
            aria-label="بحث"
            className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent"
          >
            <Search className="size-4" />
          </button>
          <button className="hidden items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-bold text-foreground transition-colors hover:bg-accent sm:flex">
            <LogIn className="size-4" />
            تسجيل الدخول
          </button>
          <button className="flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-extrabold text-gold-foreground shadow-gold transition-transform hover:scale-[1.03]">
            <UserPlus className="size-4" />
            إنشاء حساب
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <img
        src={heroMosque}
        alt="مسجد"
        width={1920}
        height={1088}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-l from-background via-background/80 to-background/30" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold-soft px-4 py-1.5 text-sm font-bold text-accent-foreground">
            <Sparkles className="size-4 text-gold" />
            أكاديمية د. حازم شومان
          </span>

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

          {/* Search */}
          <div className="mt-8 flex max-w-xl items-center gap-2 rounded-full border border-border bg-card p-2 shadow-soft">
            <Search className="ms-3 size-5 shrink-0 text-muted-foreground" />
            <input
              type="text"
              placeholder="ابحث عن دورة، موضوع، أو كلمة مفتاحية ..."
              className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>

          {/* Chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <button
                key={chip}
                className="rounded-full border border-border bg-card/80 px-4 py-1.5 text-xs font-bold text-foreground/80 backdrop-blur transition-colors hover:border-gold hover:bg-gold-soft hover:text-accent-foreground"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-base font-extrabold text-gold-foreground shadow-gold transition-transform hover:scale-[1.03]">
              ابدأ رحلتك الآن
              <ArrowLeft className="size-5" />
            </button>
            <button className="flex items-center gap-2 rounded-full border-2 border-primary bg-card/70 px-7 py-3 text-base font-extrabold text-primary backdrop-blur transition-colors hover:bg-primary hover:text-primary-foreground">
              <Compass className="size-5" />
              تصفح المسارات
            </button>
            <button className="flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-extrabold text-primary-foreground shadow-soft transition-transform hover:scale-[1.03]">
              <UserPlus className="size-5" />
              انضم الآن
            </button>
          </div>
        </div>

        {/* Side quote card */}
        <div className="hidden items-end lg:flex">
          <figure className="w-full max-w-xs rounded-3xl border border-border/70 bg-card/80 p-6 shadow-soft backdrop-blur-md">
            <Quote className="size-8 text-gold" />
            <blockquote className="mt-3 font-quran text-xl leading-9 text-foreground">
              وما توفيقي إلا بالله عليه توكلت وإليه أنيب
            </blockquote>
            <figcaption className="mt-3 text-sm font-bold text-muted-foreground">
              د. حازم شومان
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: string;
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
        <a
          href="#"
          className="mx-auto flex items-center gap-1.5 rounded-full bg-gold-soft px-4 py-2 text-sm font-bold text-accent-foreground transition-colors hover:bg-gold hover:text-gold-foreground"
        >
          {action}
          <ArrowLeft className="size-4" />
        </a>
      )}
    </div>
  );
}

function NeedsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <SectionHeading
        title="ماذا تحتاج الآن ؟"
        subtitle="اختر ما يناسب حالتك لنقترح لك محتوى يساعدك في رحلتك الإيمانية"
        action="عرض جميع التصنيفات"
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-9">
        {needs.map((need) => (
          <button
            key={need.title}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-4 text-center shadow-soft transition-all hover:-translate-y-1 hover:border-gold/60"
          >
            <span className="flex size-12 items-center justify-center rounded-2xl bg-gold-soft text-gold transition-colors group-hover:bg-gold group-hover:text-gold-foreground">
              <need.icon className="size-6" />
            </span>
            <span className="text-sm font-extrabold leading-6 text-foreground">
              {need.title}
            </span>
            <span className="text-[10px] font-semibold leading-4 text-muted-foreground">
              {need.tags}
            </span>
          </button>
        ))}
        {/* Image card */}
        <button className="group relative col-span-2 overflow-hidden rounded-2xl border border-border shadow-soft transition-all hover:-translate-y-1 sm:col-span-1 lg:col-span-1">
          <img
            src={cardPrograms}
            alt="المسجد"
            width={1024}
            height={640}
            loading="lazy"
            className="h-full min-h-36 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
          <span className="absolute bottom-3 right-3 text-sm font-extrabold text-navy-foreground">
            اكتشف المزيد
          </span>
        </button>
      </div>
    </section>
  );
}

function TracksSection() {
  return (
    <section className="bg-secondary/50 py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          title="المسارات التعليمية في الأكاديمية"
          subtitle="مسارات متكاملة تأخذ بيدك في رحلتك الإيمانية وفق منهج علمي سهل ومنهج"
          action="عرض جميع المسارات"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tracks.map((track) => (
            <article
              key={track.title}
              className="group overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1.5 hover:shadow-gold"
            >
              <div className="relative h-44 overflow-hidden">
                <img
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
              <div className="p-5">
                <h3 className="text-lg font-black text-primary">{track.title}</h3>
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <SectionHeading
        title="ماذا تقدم لك الأكاديمية ؟"
        subtitle="بيئة تعليمية متكاملة تجمع بين العلم والتطبيق والمتابعة"
      />
      <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 text-center shadow-soft transition-all hover:-translate-y-1 hover:border-gold/60"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/5 text-primary">
                <feature.icon className="size-6" />
              </span>
              <span className="text-[13px] font-extrabold leading-6 text-foreground">
                {feature.title}
              </span>
            </div>
          ))}
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-3xl border border-border shadow-soft">
            <img
              src={featuresDevices}
              alt="تعلم في أي وقت ومن أي جهاز"
              width={1024}
              height={768}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-5 right-6 flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 shadow-gold">
            <span className="flex size-11 items-center justify-center rounded-xl bg-gold text-gold-foreground">
              <BookOpen className="size-5" />
            </span>
            <div>
              <p className="text-sm font-black text-primary">تعلم .. طبق .. وانطلق</p>
              <p className="text-xs font-bold text-muted-foreground">
                في رحلتك مع العلم
              </p>
            </div>
          </div>
          <button
            aria-label="تشغيل الفيديو"
            className="absolute -top-5 left-6 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft transition-transform hover:scale-110"
          >
            <Play className="size-6 fill-current" />
          </button>
        </div>
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
    <section className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.title}
            className="group relative overflow-hidden rounded-3xl border border-border shadow-soft"
          >
            <img
              src={card.image}
              alt={card.title}
              width={1024}
              height={640}
              loading="lazy"
              className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <h3 className="text-xl font-black text-navy-foreground">{card.title}</h3>
              <p className="mt-2 text-[13px] font-semibold leading-6 text-navy-foreground/85">
                {card.desc}
              </p>
              <button className="mt-4 flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-extrabold text-gold-foreground shadow-gold transition-transform hover:scale-105">
                {card.cta}
                <ArrowLeft className="size-4" />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="relative overflow-hidden py-16">
      <img
        src={heroMosque}
        alt=""
        width={1920}
        height={1088}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-navy/85" />
      <div className="absolute inset-0 pattern-arabesque opacity-40" />
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <h2 className="text-center text-3xl font-black text-navy-foreground sm:text-4xl">
          أرقام تتحدث عن الأثر
        </h2>
        <p className="mt-3 text-center text-sm font-semibold text-navy-foreground/75">
          بفضل الله .. ثم بدعمكم المستمر
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-2 rounded-3xl border border-navy-foreground/15 bg-navy-foreground/5 p-6 text-center backdrop-blur-sm"
            >
              <span className="flex size-12 items-center justify-center rounded-2xl bg-gold text-gold-foreground shadow-gold">
                <stat.icon className="size-6" />
              </span>
              <span className="text-2xl font-black text-gold sm:text-3xl">
                {stat.value}
              </span>
              <span className="text-sm font-bold text-navy-foreground/85">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <SectionHeading
        title="كيف تعمل الأكاديمية ؟"
        subtitle="رحلة بسيطة وواضحة تبدأ بخطوة واحدة"
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
    <section className="bg-secondary/50 py-16">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 lg:grid-cols-3 lg:px-8">
        {/* Testimonial */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-primary">آراء الطلاب وقصص النجاح</h3>
            <a href="#" className="flex items-center gap-1 text-xs font-bold text-gold">
              عرض جميع الآراء
              <ArrowLeft className="size-3.5" />
            </a>
          </div>
          <div className="mt-6 rounded-2xl bg-secondary/70 p-5">
            <Quote className="size-7 text-gold" />
            <p className="mt-3 text-sm font-semibold leading-7 text-foreground">
              الأكاديمية غيرت حياتي .. وجعلتني أقرب إلى الله بفضل المسارات المتكاملة
              والمتابعة المستمرة
            </p>
            <div className="mt-4 flex items-center gap-3">
              <img
                src={avatarStudent}
                alt="أحمد من مصر"
                width={816}
                height={816}
                loading="lazy"
                className="size-12 rounded-full border-2 border-gold object-cover"
              />
              <div>
                <p className="text-sm font-extrabold text-foreground">أحمد من مصر</p>
                <p className="text-[11px] font-semibold text-muted-foreground">
                  أتم مسار التأسيس
                </p>
              </div>
              <div className="ms-auto flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-gold text-gold" />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              aria-label="السابق"
              className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent"
            >
              <ArrowLeft className="size-4 rotate-180" />
            </button>
            <button
              aria-label="التالي"
              className="flex size-9 items-center justify-center rounded-full bg-gold text-gold-foreground shadow-gold transition-transform hover:scale-105"
            >
              <ArrowLeft className="size-4" />
            </button>
          </div>
        </div>

        {/* Community */}
        <div className="relative overflow-hidden rounded-3xl border border-border bg-primary p-6 text-primary-foreground shadow-soft">
          <div className="absolute inset-0 pattern-arabesque opacity-20" />
          <div className="relative">
            <h3 className="text-lg font-black">مجتمع طلاب الأكاديمية</h3>
            <p className="mt-3 text-sm font-semibold leading-7 text-primary-foreground/85">
              مجموعات دراسية - نقاش بالمصباح - تقابل - تحفيز - متابعة عملية - صداقات
              صالحة
            </p>
            <div className="mt-6 flex items-center justify-center">
              <div className="flex -space-x-3 space-x-reverse">
                {[avatarStudent, avatarStudent, avatarStudent, avatarStudent].map(
                  (img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt=""
                      width={816}
                      height={816}
                      loading="lazy"
                      className="size-11 rounded-full border-2 border-primary object-cover"
                    />
                  ),
                )}
                <span className="flex size-11 items-center justify-center rounded-full border-2 border-primary bg-gold text-xs font-black text-gold-foreground">
                  +180k
                </span>
              </div>
            </div>
            <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-extrabold text-gold-foreground shadow-gold transition-transform hover:scale-[1.02]">
              <UsersRound className="size-4" />
              انضم إلى مجتمع الطلاب
            </button>
          </div>
        </div>

        {/* Free & paid */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <h3 className="text-lg font-black text-primary">محتوى مجاني ومحتوى مدفوع</h3>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-border bg-secondary/60 p-4">
              <div className="flex items-center gap-2">
                <Gift className="size-5 text-gold" />
                <p className="text-sm font-extrabold text-foreground">المحتوى المجاني</p>
              </div>
              <p className="mt-2 text-xs font-semibold leading-6 text-muted-foreground">
                دروس ومحاضرات مختارة متاحة للجميع
              </p>
              <button className="mt-3 w-full rounded-full border-2 border-gold bg-card px-4 py-2.5 text-sm font-extrabold text-accent-foreground transition-colors hover:bg-gold hover:text-gold-foreground">
                ابدأ الآن
              </button>
            </div>
            <div className="rounded-2xl border border-gold/50 bg-gold-soft p-4">
              <div className="flex items-center gap-2">
                <Medal className="size-5 text-gold" />
                <p className="text-sm font-extrabold text-foreground">المحتوى المدفوع</p>
              </div>
              <p className="mt-2 text-xs font-semibold leading-6 text-muted-foreground">
                مسارات متكاملة ومتابعة بإشراف وشهادات
              </p>
              <button className="mt-3 w-full rounded-full bg-gold px-4 py-2.5 text-sm font-extrabold text-gold-foreground shadow-gold transition-transform hover:scale-[1.02]">
                تصفح الباقات
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const [open, setOpen] = useState(0);
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
      <SectionHeading
        title="الأسئلة الشائعة"
        subtitle="إجابات عن أكثر ما يصلنا من استفسارات"
      />
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div
            key={faq.q}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
          >
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="flex w-full items-center justify-between gap-4 p-5 text-start"
            >
              <span className="text-sm font-extrabold text-foreground sm:text-base">
                {faq.q}
              </span>
              <span
                className={`flex size-9 shrink-0 items-center justify-center rounded-full transition-all ${
                  open === i
                    ? "bg-gold text-gold-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                <ChevronDown
                  className={`size-4 transition-transform ${open === i ? "rotate-180" : ""}`}
                />
              </span>
            </button>
            {open === i && (
              <p className="border-t border-border px-5 py-4 text-sm font-semibold leading-7 text-muted-foreground">
                {faq.a}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="relative overflow-hidden">
      <img
        src={ctaMosque}
        alt=""
        width={1920}
        height={768}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-navy/70" />
      <div className="relative mx-auto max-w-7xl px-4 py-20 text-center lg:px-8">
        <h2 className="text-3xl font-black leading-snug text-navy-foreground sm:text-4xl lg:text-5xl">
          ابدأ رحلتك الآن مع أكاديمية د. حازم شومان
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-8 text-navy-foreground/85">
          تعلم .. تزكية .. تطبيق .. نحو حياة أقرب إلى الله
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button className="flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-base font-extrabold text-gold-foreground shadow-gold transition-transform hover:scale-105">
            <UserPlus className="size-5" />
            إنشاء حساب مجاني
          </button>
          <button className="flex items-center gap-2 rounded-full border-2 border-navy-foreground/40 bg-navy-foreground/10 px-8 py-4 text-base font-extrabold text-navy-foreground backdrop-blur transition-colors hover:bg-navy-foreground/20">
            <Compass className="size-5" />
            تصفح المسارات
          </button>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const columns = [
    {
      title: "عن الشيخ",
      links: ["نبذة عن د. حازم شومان", "المؤلفات", "المقالات", "الدروس المرئية", "تواصل مباشر"],
    },
    {
      title: "الأكاديمية",
      links: ["عن الأكاديمية", "المسارات التعليمية", "كيف نعمل", "الأسئلة الشائعة"],
    },
    {
      title: "روابط سريعة",
      links: ["الرئيسية", "البرامج", "المقالات", "إنشاء حساب", "تسجيل الدخول"],
    },
    {
      title: "تواصل معنا",
      links: ["واتساب", "تيليجرام", "البريد الإلكتروني", "نموذج التواصل"],
    },
  ];
  const socials = [Youtube, Facebook, Instagram, Music2, Send, Twitter];
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-10 items-center justify-center rounded-xl bg-gold text-gold-foreground">
                <Moon className="size-5" />
              </span>
              <span className="leading-tight">
                <span className="block text-[11px] font-semibold text-primary-foreground/70">
                  أكاديمية
                </span>
                <span className="block text-base font-extrabold">د. حازم شومان</span>
              </span>
            </div>
            <p className="mt-4 text-sm font-semibold leading-7 text-primary-foreground/75">
              علم .. معرفة .. قرب إلى الله
            </p>
            <div className="mt-5 flex gap-2">
              {socials.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="تواصل اجتماعي"
                  className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground transition-colors hover:bg-gold hover:text-gold-foreground"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-black text-gold">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm font-semibold text-primary-foreground/75 transition-colors hover:text-gold"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-primary-foreground/15 pt-6">
          <p className="text-xs font-semibold text-primary-foreground/60">
            جميع الحقوق محفوظة لأكاديمية د. حازم شومان © 2026
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-primary-foreground/60">
            <CalendarCheck className="size-4 text-gold" />
            تعلم .. تزكية .. تطبيق
          </div>
        </div>
      </div>
    </footer>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Header />
      <main>
        <Hero />
        <NeedsSection />
        <TracksSection />
        <FeaturesSection />
        <HubCardsSection />
        <StatsSection />
        <StepsSection />
        <CommunitySection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
