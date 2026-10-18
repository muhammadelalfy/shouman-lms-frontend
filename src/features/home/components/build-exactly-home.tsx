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

import heroMosque from "@/assets/build-exactly-web/hero-mosque.jpg";
import sheikhHazemHero from "@/assets/homepage/sheikh-hazem-hero-wide.png";
import courseAdhan from "@/assets/build-exactly-web/course-adhan.jpg";
import courseSanah from "@/assets/build-exactly-web/course-sanah.jpg";
import courseMadinah from "@/assets/build-exactly-web/course-madinah.jpg";
import courseQuran from "@/assets/build-exactly-web/course-quran.jpg";
import featuresDevices from "@/assets/build-exactly-web/features-devices.jpg";
import ctaMosque from "@/assets/build-exactly-web/cta-mosque.jpg";
import avatarStudent from "@/assets/build-exactly-web/avatar-student.jpg";
import cardArticles from "@/assets/build-exactly-web/card-articles.jpg";
import cardInitiatives from "@/assets/build-exactly-web/card-initiatives.jpg";
import cardPrograms from "@/assets/build-exactly-web/card-programs.jpg";
import needLearningReligion from "@/assets/homepage-cards/need-learning-religion.webp";
import needStudentYouth from "@/assets/homepage-cards/need-student-youth.webp";
import needFamily from "@/assets/homepage-cards/need-family.webp";
import needSpiritualRenewal from "@/assets/homepage-cards/need-spiritual-renewal.webp";
import needUnderstandQuran from "@/assets/homepage-cards/need-understand-quran.webp";
import needPrayer from "@/assets/homepage-cards/need-prayer.webp";
import needRepentance from "@/assets/homepage-cards/need-repentance.webp";
import needClosenessToGod from "@/assets/homepage-cards/need-closeness-to-god.webp";
import featureStudyTracks from "@/assets/homepage-cards/feature-study-tracks.webp";
import featureAvLectures from "@/assets/homepage-cards/feature-av-lectures.webp";
import featureAssessments from "@/assets/homepage-cards/feature-assessments.webp";
import featureDownloads from "@/assets/homepage-cards/feature-downloads.webp";
import featureMentoring from "@/assets/homepage-cards/feature-mentoring.webp";
import featureCertification from "@/assets/homepage-cards/feature-certification.webp";
import featureFreePaid from "@/assets/homepage-cards/feature-free-paid.webp";
import featureCommunity from "@/assets/homepage-cards/feature-community.webp";
import featureAchievements from "@/assets/homepage-cards/feature-achievements.webp";
import featureProgress from "@/assets/homepage-cards/feature-progress.webp";

const navLinks = [
  { label: "الرئيسية", href: "#home" },
  { label: "المسارات", href: "#tracks" },
  { label: "الأكاديمية", href: "#features" },
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

const needs = [
  {
    image: needLearningReligion,
    title: "أريد أن أتعلم ديني",
    tags: "العقيدة - الفقه - السيرة - التفسير",
  },
  {
    image: needStudentYouth,
    title: "أنا طالب / شاب",
    tags: "الجامعة - الصحبة - النجاح - الفتن",
  },
  {
    image: needFamily,
    title: "عندي مشكلة أسرية",
    tags: "التربية - الأبناء - العلاقات",
  },
  {
    image: needSpiritualRenewal,
    title: "أعاني من الفتور",
    tags: "معرفة الله - إجابة الإيمان - أعمال القلوب",
  },
  {
    image: needUnderstandQuran,
    title: "أريد أفهم القرآن",
    tags: "تدبر - تفسير - حفظ - تعاهد",
  },
  {
    image: needPrayer,
    title: "أريد أن أنتظم في الصلاة",
    tags: "الصلاة - الخشوع - قيام الليل",
  },
  {
    image: needRepentance,
    title: "أريد أن أتوب",
    tags: "التوبة - الذنوب - بداية الطريق",
  },
  {
    image: needClosenessToGod,
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
  { image: featureStudyTracks, title: "مسارات دراسية متكاملة" },
  { image: featureAvLectures, title: "محاضرات صوتية ومرئية عالية الجودة" },
  { image: featureAssessments, title: "اختبارات وتكليفات لكل درس" },
  { image: featureDownloads, title: "محتوى قابل للتحميل ملفات وملخصات" },
  { image: featureMentoring, title: "متابعة وإشراف من فريق متخصص" },
  { image: featureCertification, title: "شهادات معتمدة برمز تحقق QR" },
  { image: featureFreePaid, title: "محتوى مجاني ومدفوع يناسبك" },
  { image: featureCommunity, title: "مجموعات تفاعلية وتعلم بالممارسة" },
  { image: featureAchievements, title: "شارات وإنجازات في كل مسار" },
  { image: featureProgress, title: "لوحة متابعة تقدمك وإحصائيات مقطعة" },
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

function Header({ hasSession }: { hasSession: boolean }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 lg:px-8">
        {/* Logo */}
        <a href="#home" className="flex shrink-0 items-center gap-2">
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
        <div className="ms-auto flex items-center gap-2 lg:ms-0">
          <MobileNavigation navigation={[
            ...navLinks,
            { label: hasSession ? "حسابي" : "تسجيل الدخول", href: hasSession ? "/account" : "/auth/login" },
            { label: hasSession ? "لوحتي" : "إنشاء حساب", href: hasSession ? "/dashboard" : "/auth/register" },
          ]} />
          <ComingSoonButton href="/search" ariaLabel="بحث"
            className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent"
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
    <section id="home" className="relative overflow-hidden bg-background lg:min-h-[calc(100svh-4rem)]">
      <figure className="absolute inset-x-0 top-0 h-[270px] sm:h-[340px] lg:inset-0 lg:h-full">
        <Image
          src={sheikhHazemHero}
          alt="الشيخ حازم شومان يبتسم وينظر نحو عنوان الأكاديمية"
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

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-[290px] sm:pt-[360px] lg:min-h-[620px] lg:px-8 lg:py-20">
        <div className="max-w-2xl lg:max-w-[58%] xl:max-w-[54%]">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold-soft px-4 py-1.5 text-sm font-bold text-accent-foreground">
            <Sparkles className="size-4 text-gold" />
            أكاديمية د. حازم شومان
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

          {/* Search */}
          <ComingSoonButton
            href="/search"
            title="البحث في الأكاديمية"
            ariaLabel="ابحث عن دورة أو موضوع"
            className="mt-8 flex w-full max-w-xl items-center gap-2 rounded-full border border-border bg-card p-2 text-start shadow-soft"
          >
            <Search className="ms-3 size-5 shrink-0 text-muted-foreground" />
            <span className="w-full text-start text-sm font-medium text-muted-foreground">ابحث عن دورة، موضوع، أو كلمة مفتاحية ...</span>
          </ComingSoonButton>

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
            <ComingSoonButton href="/auth/register" className="flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-base font-extrabold text-gold-foreground shadow-gold transition-transform hover:scale-[1.03]">
              ابدأ رحلتك الآن
              <ArrowLeft className="size-5" />
            </ComingSoonButton>
            <ComingSoonButton href="/tracks" className="flex items-center gap-2 rounded-full border-2 border-primary bg-card/70 px-7 py-3 text-base font-extrabold text-primary backdrop-blur transition-colors hover:bg-primary hover:text-primary-foreground">
              <Compass className="size-5" />
              تصفح المسارات
            </ComingSoonButton>
            <ComingSoonButton href="/preview" className="flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-extrabold text-primary-foreground shadow-soft transition-transform hover:scale-[1.03]">
              <UserPlus className="size-5" />
              انضم الآن
            </ComingSoonButton>
          </div>
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
        <ComingSoonButton
          title={action}
          className="mx-auto flex items-center gap-1.5 rounded-full bg-gold-soft px-4 py-2 text-sm font-bold text-accent-foreground transition-colors hover:bg-gold hover:text-gold-foreground"
        >
          {action}
          <ArrowLeft className="size-4" />
        </ComingSoonButton>
      )}
    </div>
  );
}

function NeedsSection() {
  return (
    <section id="needs" className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <SectionHeading
        title="ماذا تحتاج الآن ؟"
        subtitle="اختر ما يناسب حالتك لنقترح لك محتوى يساعدك في رحلتك الإيمانية"
        action="عرض جميع التصنيفات"
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
        {needs.map((need) => (
          <ComingSoonButton
            key={need.title}
            className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-3 text-center shadow-soft transition-all hover:-translate-y-1 hover:border-gold/60"
          >
            <span className="relative block aspect-video w-full overflow-hidden rounded-xl bg-gold-soft">
              <Image
                src={need.image}
                alt=""
                fill
                sizes="(max-width: 639px) 44vw, (max-width: 1279px) 29vw, 390px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </span>
            <span className="text-sm font-extrabold leading-6 text-foreground">
              {need.title}
            </span>
            <span className="text-[10px] font-semibold leading-4 text-muted-foreground">
              {need.tags}
            </span>
          </ComingSoonButton>
        ))}
        {/* Image card */}
        <ComingSoonButton className="group relative col-span-2 overflow-hidden rounded-2xl border border-border shadow-soft transition-all hover:-translate-y-1 sm:col-span-1 lg:col-span-1">
          <Image
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
        </ComingSoonButton>
      </div>
    </section>
  );
}

function TracksSection() {
  return (
    <section id="tracks" className="bg-secondary/50 py-16">
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
    <section id="features" className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <SectionHeading
        title="ماذا تقدم لك الأكاديمية ؟"
        subtitle="بيئة تعليمية متكاملة تجمع بين العلم والتطبيق والمتابعة"
      />
      <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-3 text-center shadow-soft transition-all hover:-translate-y-1 hover:border-gold/60"
            >
              <span className="relative block aspect-video w-full overflow-hidden rounded-xl bg-primary/5">
                <Image
                  src={feature.image}
                  alt=""
                  fill
                  sizes="(max-width: 639px) 44vw, (max-width: 1023px) 29vw, 18vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </span>
              <span className="text-[13px] font-extrabold leading-6 text-foreground">
                {feature.title}
              </span>
            </div>
          ))}
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-3xl border border-border shadow-soft">
            <Image
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
          <ComingSoonButton ariaLabel="تشغيل الفيديو"
            className="absolute -top-5 left-6 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-soft transition-transform hover:scale-110"
          >
            <Play className="size-6 fill-current" />
          </ComingSoonButton>
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
    <section id="articles" className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.title}
            className="group relative overflow-hidden rounded-3xl border border-border shadow-soft"
          >
            <Image
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
              <ComingSoonButton className="mt-4 flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-extrabold text-gold-foreground shadow-gold transition-transform hover:scale-105">
                {card.cta}
                <ArrowLeft className="size-4" />
              </ComingSoonButton>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section id="stats" className="relative overflow-hidden py-16">
      <Image
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
    <section id="steps" className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
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
    <section id="community" className="bg-secondary/50 py-16">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 lg:grid-cols-3 lg:px-8">
        {/* Testimonial */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-primary">آراء الطلاب وقصص النجاح</h3>
            <a href="#community" className="flex items-center gap-1 text-xs font-bold text-gold">
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
              <Image
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
            <ComingSoonButton ariaLabel="السابق"
              className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-accent"
            >
              <ArrowLeft className="size-4 rotate-180" />
            </ComingSoonButton>
            <ComingSoonButton ariaLabel="التالي"
              className="flex size-9 items-center justify-center rounded-full bg-gold text-gold-foreground shadow-gold transition-transform hover:scale-105"
            >
              <ArrowLeft className="size-4" />
            </ComingSoonButton>
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
                    <Image
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
            <ComingSoonButton className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-extrabold text-gold-foreground shadow-gold transition-transform hover:scale-[1.02]">
              <UsersRound className="size-4" />
              انضم إلى مجتمع الطلاب
            </ComingSoonButton>
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
              <ComingSoonButton className="mt-3 w-full rounded-full border-2 border-gold bg-card px-4 py-2.5 text-sm font-extrabold text-accent-foreground transition-colors hover:bg-gold hover:text-gold-foreground">
                ابدأ الآن
              </ComingSoonButton>
            </div>
            <div className="rounded-2xl border border-gold/50 bg-gold-soft p-4">
              <div className="flex items-center gap-2">
                <Medal className="size-5 text-gold" />
                <p className="text-sm font-extrabold text-foreground">المحتوى المدفوع</p>
              </div>
              <p className="mt-2 text-xs font-semibold leading-6 text-muted-foreground">
                مسارات متكاملة ومتابعة بإشراف وشهادات
              </p>
              <ComingSoonButton className="mt-3 w-full rounded-full bg-gold px-4 py-2.5 text-sm font-extrabold text-gold-foreground shadow-gold transition-transform hover:scale-[1.02]">
                تصفح الباقات
              </ComingSoonButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section id="faq" className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
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
    <section id="cta" className="relative overflow-hidden">
      <Image
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
          <ComingSoonButton className="flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-base font-extrabold text-gold-foreground shadow-gold transition-transform hover:scale-105">
            <UserPlus className="size-5" />
            إنشاء حساب مجاني
          </ComingSoonButton>
          <ComingSoonButton className="flex items-center gap-2 rounded-full border-2 border-navy-foreground/40 bg-navy-foreground/10 px-8 py-4 text-base font-extrabold text-navy-foreground backdrop-blur transition-colors hover:bg-navy-foreground/20">
            <Compass className="size-5" />
            تصفح المسارات
          </ComingSoonButton>
        </div>
      </div>
    </section>
  );
}

function footerHref(label: string) {
  if (label === "المقالات" || label === "البرامج") return "#articles";
  if (label === "المسارات التعليمية") return "#tracks";
  if (label === "الرئيسية") return "#home";
  if (label === "عن الأكاديمية" || label === "كيف نعمل") return "#features";
  if (label === "الأسئلة الشائعة") return "#faq";
  if (label === "تواصل مباشر") return "#contact";
  return undefined;
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
    <footer id="contact" className="border-t border-border bg-primary text-primary-foreground">
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
                <ComingSoonButton
                  key={i}
                  ariaLabel={`التواصل الاجتماعي ${i + 1} — قريبًا`}
                  className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground transition-colors hover:bg-gold hover:text-gold-foreground"
                >
                  <Icon className="size-4" />
                </ComingSoonButton>
              ))}
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-black text-gold">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    {footerHref(link) ? (
                      <a
                        href={footerHref(link)}
                        className="text-sm font-semibold text-primary-foreground/75 transition-colors hover:text-gold"
                      >
                        {link}
                      </a>
                    ) : (
                      <ComingSoonButton
                        title={link}
                        className="text-start text-sm font-semibold text-primary-foreground/75 transition-colors hover:text-gold"
                      >
                        {link}
                      </ComingSoonButton>
                    )}
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
            <Link href="/preview" className="rounded-md px-2 py-2 hover:text-gold">استكشف جميع الواجهات</Link>
            <CalendarCheck className="size-4 text-gold" />
            تعلم .. تزكية .. تطبيق
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function BuildExactlyHome({ hasSession = false }: { hasSession?: boolean } = {}) {
  return (
    <div id="home-page" className="min-h-screen bg-background font-sans">
      <Header hasSession={hasSession} />
      <main id="main-content">
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
