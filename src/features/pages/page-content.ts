export type PageKind = "preview" | "coming-soon";

export type PageCard = {
  title: string;
  description: string;
  href?: string;
};

export type PageDefinition = {
  title: string;
  englishTitle: string;
  description: string;
  kind: PageKind;
  eyebrow: string;
  previewLabel?: string;
  links?: Array<{ label: string; href: string }>;
  cards?: PageCard[];
};

const discoveryLinks = [
  { label: "الفهرس التعليمي", href: "/catalog" },
  { label: "المسارات", href: "/tracks" },
  { label: "الدورات", href: "/courses" },
  { label: "الفعاليات", href: "/events" },
  { label: "الأسئلة الشائعة", href: "/faq" },
];

const previewLinks = [
  { label: "العودة إلى الفهرس", href: "/catalog" },
  { label: "الصفحة الرئيسية", href: "/" },
];

const definitions: Record<string, PageDefinition> = {
  "catalog/search": {
    title: "البحث في المحتوى", englishTitle: "Catalog search", eyebrow: "ابحث وتعلّم",
    description: "تصميم صفحة البحث جاهز للمعاينة. لا تتوفر خدمة بحث أو نتائج حتى الآن.", kind: "preview", previewLabel: "معاينة تصميم — البحث غير متصل",
    links: discoveryLinks,
    cards: [
      { title: "البحث بالكلمات", description: "سيبحث عن العناوين والموضوعات عند اعتماد واجهة البحث." },
      { title: "مرشحات النتائج", description: "سيتم عرض المرشحات التي يدعمها عقد البحث المعتمد." },
      { title: "نتائج موثوقة", description: "لن تظهر نتائج تجريبية على أنها محتوى منشور." },
    ],
  },
  faq: {
    title: "الأسئلة الشائعة", englishTitle: "Frequently asked questions", eyebrow: "نساعدك على البدء",
    description: "تنتظر هذه الصفحة إجابات معتمدة من المركز قبل نشرها للزوار.", kind: "preview", previewLabel: "معاينة تصميم — المحتوى ينتظر الاعتماد",
    links: discoveryLinks,
    cards: [
      { title: "البدء والتسجيل", description: "ستظهر هنا معلومات التسجيل المعتمدة." },
      { title: "المسارات والدورات", description: "ستظهر هنا إجابات فريق المركز عن المحتوى." },
      { title: "الحساب والدعم", description: "ستُنشر قنوات المساعدة بعد اعتمادها." },
    ],
  },
  events: {
    title: "الفعاليات واللقاءات", englishTitle: "Events and live meetings", eyebrow: "تعلّم مع الآخرين",
    description: "لا تتوفر حاليًا واجهة منشورة لمواعيد الفعاليات أو التسجيل فيها.", kind: "coming-soon", previewLabel: "تصميم أولي — لا توجد مواعيد مباشرة",
    links: discoveryLinks,
    cards: [
      { title: "اللقاءات القادمة", description: "الموعد ورابط الانضمام سيظهران من خدمة الفعاليات." },
      { title: "الفعاليات السابقة", description: "سترتبط التسجيلات والمواد بصفحات المحتوى المناسبة." },
    ],
  },
  meetings: {
    title: "اللقاءات", englishTitle: "Live meetings", eyebrow: "موعدك مع العلم",
    description: "سيظهر جدول اللقاءات عند توفر خدمة الأحداث وسياسة التسجيل.", kind: "coming-soon", previewLabel: "تصميم أولي — لا توجد مواعيد مباشرة",
    links: discoveryLinks,
  },
  community: {
    title: "المجتمع التعليمي", englishTitle: "Learning community", eyebrow: "نتعلم معًا",
    description: "تحتاج المشاركة والإشراف إلى خدمة مجتمع وقواعد نشر معتمدة.", kind: "coming-soon", previewLabel: "تصميم أولي — لا توجد منشورات أو مجموعات حية",
    links: previewLinks,
    cards: [
      { title: "المجموعات", description: "ستظهر المجموعات المتاحة بعد تحديد قواعد الانضمام والإشراف." },
      { title: "النقاشات", description: "لن تُفعّل المنشورات والتعليقات قبل اعتماد سياسة المجتمع." },
      { title: "الإشراف", description: "أدوات البلاغات والإدارة تحتاج صلاحيات وخدمة معتمدة." },
    ],
  },
  learning: {
    title: "رحلتي التعليمية", englishTitle: "My learning", eyebrow: "تابع تقدمك",
    description: "لا تتوفر بعد واجهات تسجيل الالتحاق أو حفظ التقدم والدروس.", kind: "coming-soon", previewLabel: "تصميم أولي — لا يوجد تقدم محفوظ",
    links: [{ label: "استكشف الفهرس", href: "/catalog" }, { label: "تسجيل الدخول", href: "/auth/login" }],
    cards: [
      { title: "المسار الحالي", description: "سيظهر بعد ربط حسابك بخدمة الالتحاق والتقدم." },
      { title: "متابعة التعلم", description: "يتطلب تشغيل الدروس وخدمة حفظ التقدم." },
      { title: "إنجازاتي", description: "لا نعرض نتائج أو إنجازات قبل توفر مصدرها." },
    ],
  },
  dashboard: {
    title: "لوحة المتعلم", englishTitle: "Learner dashboard", eyebrow: "كل رحلتك في مكان واحد",
    description: "واجهة المتعلم قيد التصميم. لن نعرض بيانات أو نسب تقدم غير مرتبطة بحساب فعلي.", kind: "coming-soon", previewLabel: "تصميم أولي — لا توجد بيانات حساب",
    links: [{ label: "تسجيل الدخول", href: "/auth/login" }, { label: "استكشف الفهرس", href: "/catalog" }],
    cards: [
      { title: "متابعة التعلم", description: "تحتاج واجهة تقدم والالتحاق إلى خدمة التعلم." },
      { title: "الاختبارات والشهادات", description: "تعتمد على سياسات وواجهات لم تُعتمد بعد." },
      { title: "مواعيدك ومجموعاتك", description: "تحتاج واجهات الأحداث والمجتمع." },
    ],
  },
  "my-learning": {
    title: "تعلمي", englishTitle: "My learning", eyebrow: "مساراتك ودوراتك",
    description: "عرض المحتوى الحالي والمكتمل والمشتَرى يحتاج واجهة الالتحاق والتقدم.", kind: "coming-soon", previewLabel: "تصميم أولي — لا يوجد سجل تعلم",
    links: [{ label: "لوحة المتعلم", href: "/dashboard" }, { label: "الفهرس", href: "/catalog" }],
  },
  quizzes: {
    title: "الاختبارات", englishTitle: "Quizzes", eyebrow: "قيّم فهمك",
    description: "سيتم تفعيل الاختبارات بعد اعتماد قواعد المحاولات والنجاح والمؤقت وعرض الإجابات.", kind: "coming-soon", previewLabel: "تصميم أولي — سياسة الاختبارات غير معتمدة",
    links: [{ label: "رحلتي التعليمية", href: "/learning" }],
    cards: [
      { title: "الأسئلة والمحاولات", description: "عدد الأسئلة والمحاولات تحدده سياسة المركز." },
      { title: "النتيجة", description: "لن نعرض درجة أو نجاحًا قبل اتصال خدمة الاختبارات." },
    ],
  },
  certificates: {
    title: "الشهادات", englishTitle: "Certificates", eyebrow: "إنجازك يستحق التوثيق",
    description: "عرض الشهادات وإصدارها يحتاج قواعد أهلية وخدمة شهادات معتمدة.", kind: "coming-soon", previewLabel: "تصميم أولي — لا توجد شهادات حقيقية",
    links: [{ label: "التحقق من شهادة", href: "/certificates/verify" }],
  },
  "certificates/verify": {
    title: "التحقق من شهادة", englishTitle: "Certificate verification", eyebrow: "تحقق موثوق",
    description: "لم تتوفر بعد خدمة تحقق عامة أو سياسة الحقول التي يمكن عرضها للزوار.", kind: "coming-soon", previewLabel: "تصميم أولي — التحقق غير متصل",
    links: [{ label: "الشهادات", href: "/certificates" }],
  },
  projects: {
    title: "مشروعات التخرج", englishTitle: "Graduation projects", eyebrow: "اصنع أثرًا",
    description: "التقديم والتقييم المساعد يحتاجان دورة عمل ومعايير تقييم معتمدة.", kind: "coming-soon", previewLabel: "تصميم أولي — لا يوجد رفع أو تقييم",
    links: [{ label: "رحلتي التعليمية", href: "/learning" }],
    cards: [
      { title: "التعليمات والتسليم", description: "تتطلب خدمة رفع آمنة ومواعيد معتمدة." },
      { title: "المراجعة والتقييم", description: "تحتاج معايير rubric ومراجعة بشرية معتمدة." },
    ],
  },
  notifications: {
    title: "الإشعارات", englishTitle: "Notifications", eyebrow: "ابقَ على اطلاع",
    description: "سيعرض مركز الإشعارات رسائل حسابك بعد تفعيل الخدمة وقواعد الإرسال.", kind: "coming-soon", previewLabel: "تصميم أولي — لا توجد إشعارات حية",
    links: [{ label: "لوحة المتعلم", href: "/dashboard" }],
  },
  achievements: {
    title: "الإنجازات", englishTitle: "Achievements", eyebrow: "كل خطوة لها أثر",
    description: "تحتاج النقاط والشارات إلى قواعد تحفيز تعتمدها المركز.", kind: "coming-soon", previewLabel: "تصميم أولي — قواعد التحفيز غير معتمدة",
    links: [{ label: "رحلتي التعليمية", href: "/learning" }],
  },
  account: {
    title: "حسابي", englishTitle: "My account", eyebrow: "بياناتك وإعداداتك",
    description: "إدارة الاسم ورقم الهاتف وكلمة المرور عبر خدمة الهوية.", kind: "preview", previewLabel: "إعدادات الحساب",
    links: [{ label: "العودة إلى الفهرس", href: "/catalog" }],
  },
  "auth/login": {
    title: "تسجيل الدخول", englishTitle: "Sign in", eyebrow: "مرحبًا بعودتك",
    description: "ادخل إلى حسابك لمتابعة رحلتك التعليمية.", kind: "preview", previewLabel: "حساب المركز",
    links: [{ label: "إنشاء حساب", href: "/auth/register" }, { label: "الفهرس", href: "/catalog" }],
  },
  "auth/register": {
    title: "إنشاء حساب", englishTitle: "Create account", eyebrow: "ابدأ رحلتك",
    description: "أنشئ حساب متعلم للانضمام إلى المركز.", kind: "preview", previewLabel: "حساب متعلم",
    links: [{ label: "لديك حساب؟ سجل الدخول", href: "/auth/login" }],
  },
  "auth/forgot-password": {
    title: "استعادة كلمة المرور", englishTitle: "Forgot password", eyebrow: "نساعدك على العودة",
    description: "أدخل البريد المرتبط بحسابك لطلب رابط آمن لإعادة التعيين.", kind: "preview", previewLabel: "استعادة آمنة",
    links: [{ label: "العودة لتسجيل الدخول", href: "/auth/login" }],
  },
  "auth/reset-password": {
    title: "تعيين كلمة مرور جديدة", englishTitle: "Reset password", eyebrow: "خطوة أخيرة",
    description: "استخدم الرابط الذي وصلك لإعداد كلمة مرور جديدة.", kind: "preview", previewLabel: "استعادة آمنة",
    links: [{ label: "طلب رابط جديد", href: "/auth/forgot-password" }],
  },
  "admin/dashboard": {
    title: "لوحة الإدارة", englishTitle: "Admin dashboard", eyebrow: "إدارة المركز",
    description: "تحتاج لوحة الإدارة إلى جلسة وصلاحيات وخدمات تشغيلية. هذه الصفحة لا تعرض بيانات أو مؤشرات تجريبية.", kind: "coming-soon", previewLabel: "معاينة تصميم — لوحة الإدارة غير متصلة",
    links: [{ label: "إدارة المسارات", href: "/admin/offerings" }, { label: "المستخدمون والأدوار", href: "/admin/users" }],
    cards: [
      { title: "المحتوى التعليمي", description: "تتطلب إدارة المحتوى واجهة صلاحيات وربطًا بخدمة التأليف." },
      { title: "الحسابات والصلاحيات", description: "تحتاج عمليات الإدارة إلى تحقق خادمي من صلاحية الحساب." },
      { title: "التقارير", description: "لن نعرض مؤشرات غير محسوبة من بيانات تشغيلية." },
    ],
  },
  "admin/users": {
    title: "إدارة المستخدمين", englishTitle: "User management", eyebrow: "إدارة الحسابات",
    description: "واجهة إدارة المستخدمين غير موصولة حتى الآن بعقد الواجهة الأمامية والصلاحيات.", kind: "coming-soon", previewLabel: "معاينة تصميم — لا توجد سجلات مستخدمين",
    links: [{ label: "لوحة الإدارة", href: "/admin/dashboard" }],
  },
  "admin/roles": {
    title: "الأدوار والصلاحيات", englishTitle: "Roles and permissions", eyebrow: "تحكم مسؤول",
    description: "تتطلب هذه الشاشة حماية صلاحيات خادمية وواجهة إدارة معتمدة.", kind: "coming-soon", previewLabel: "معاينة تصميم — لا توجد تغييرات صلاحيات",
    links: [{ label: "لوحة الإدارة", href: "/admin/dashboard" }],
  },
  "admin/offerings": {
    title: "إدارة المحتوى التعليمي", englishTitle: "Offering management", eyebrow: "المسارات والدورات والبرامج",
    description: "تحتاج واجهة التأليف إلى تكامل مصرح به مع خدمة المحتوى.", kind: "coming-soon", previewLabel: "معاينة تصميم — لا يوجد محتوى إداري مباشر",
    links: [{ label: "لوحة الإدارة", href: "/admin/dashboard" }, { label: "استعراض المحتوى المنشور", href: "/catalog" }],
  },
  "admin/quizzes": {
    title: "إدارة الاختبارات", englishTitle: "Quiz management", eyebrow: "بنك الأسئلة والتقييم",
    description: "لا تتوفر واجهة إدارة أو سياسة اختبارات معتمدة.", kind: "coming-soon", previewLabel: "معاينة تصميم — الاختبارات غير متصلة",
    links: [{ label: "لوحة الإدارة", href: "/admin/dashboard" }],
  },
  "admin/events": {
    title: "إدارة الفعاليات", englishTitle: "Event management", eyebrow: "اللقاءات والورش",
    description: "تحتاج إدارة الفعاليات إلى خدمة وأدوار وسياسات معتمدة.", kind: "coming-soon", previewLabel: "معاينة تصميم — لا توجد فعاليات إدارية",
    links: [{ label: "لوحة الإدارة", href: "/admin/dashboard" }],
  },
  "admin/payments": {
    title: "المدفوعات", englishTitle: "Payments", eyebrow: "معاملات آمنة",
    description: "لم يعتمد مزود الدفع أو واجهته بعد. لا توجد معاملات فعلية معروضة.", kind: "coming-soon", previewLabel: "معاينة تصميم — الدفع غير متصل",
    links: [{ label: "لوحة الإدارة", href: "/admin/dashboard" }],
  },
  "admin/certificates": {
    title: "إدارة الشهادات", englishTitle: "Certificate management", eyebrow: "الإصدار والتحقق",
    description: "تعتمد إدارة الشهادات على قواعد الأهلية والإصدار وواجهة تحقق عامة.", kind: "coming-soon", previewLabel: "معاينة تصميم — لا توجد سجلات شهادات",
    links: [{ label: "لوحة الإدارة", href: "/admin/dashboard" }],
  },
  "admin/reports": {
    title: "التقارير والتحليلات", englishTitle: "Reports and analytics", eyebrow: "قراءة البيانات",
    description: "ستظهر التقارير بعد اعتماد مصادر البيانات ومقاييسها.", kind: "coming-soon", previewLabel: "معاينة تصميم — لا توجد مؤشرات مباشرة",
    links: [{ label: "لوحة الإدارة", href: "/admin/dashboard" }],
  },
  "admin/cms": {
    title: "إدارة الموقع", englishTitle: "CMS", eyebrow: "محتوى الموقع العام",
    description: "لا تتوفر خدمة لإدارة أقسام الصفحة أو الأسئلة الشائعة بعد.", kind: "coming-soon", previewLabel: "معاينة تصميم — نظام إدارة المحتوى غير متصل",
    links: [{ label: "لوحة الإدارة", href: "/admin/dashboard" }],
  },
  "admin/analytics": { title: "التحليلات", englishTitle: "Analytics", eyebrow: "مؤشرات المركز", description: "لا تتوفر بعد مصادر بيانات معتمدة لعرض مؤشرات الأداء.", kind: "coming-soon", previewLabel: "معاينة تصميم — لا توجد مؤشرات مباشرة", links: [{ label: "لوحة الإدارة", href: "/admin/dashboard" }] },
  "admin/groups": { title: "المجموعات التعليمية", englishTitle: "Community groups", eyebrow: "إدارة المجتمع", description: "تحتاج المجموعات إلى خدمة المجتمع وسياسة إشراف منشورة.", kind: "coming-soon", previewLabel: "معاينة تصميم — المجتمع غير متصل", links: [{ label: "لوحة الإدارة", href: "/admin/dashboard" }] },
  "admin/coupons": { title: "القسائم والعروض", englishTitle: "Coupons and offers", eyebrow: "الأسعار والعروض", description: "لا تتوفر خدمة عروض أو دفع معتمدة.", kind: "coming-soon", previewLabel: "معاينة تصميم — الدفع غير متصل", links: [{ label: "لوحة الإدارة", href: "/admin/dashboard" }] },
  "admin/projects": { title: "مشروعات التخرج", englishTitle: "Graduation projects", eyebrow: "التقييم والمراجعة", description: "تحتاج هذه الشاشة إلى خدمة المشروعات ومعايير تقييم معتمدة.", kind: "coming-soon", previewLabel: "معاينة تصميم — لا توجد مشروعات حية", links: [{ label: "لوحة الإدارة", href: "/admin/dashboard" }] },
  "admin/rubrics": { title: "معايير التقييم", englishTitle: "Rubrics", eyebrow: "معايير مراجعة واضحة", description: "لا تُبنى معايير التقييم قبل اعتمادها من المركز.", kind: "coming-soon", previewLabel: "معاينة تصميم — المعايير غير معتمدة", links: [{ label: "لوحة الإدارة", href: "/admin/dashboard" }] },
  "admin/gamification": { title: "التحفيز والشارات", englishTitle: "Gamification", eyebrow: "رحلة الإنجاز", description: "تحتاج النقاط والشارات إلى قواعد تعتمدها المركز.", kind: "coming-soon", previewLabel: "معاينة تصميم — قواعد التحفيز غير معتمدة", links: [{ label: "لوحة الإدارة", href: "/admin/dashboard" }] },
  "admin/distinguished": { title: "الطلاب المتميزون", englishTitle: "Distinguished students", eyebrow: "مراجعة بشرية عادلة", description: "لا تتوفر معايير ترشيح معتمدة أو بيانات تقييم.", kind: "coming-soon", previewLabel: "معاينة تصميم — لا توجد ترشيحات", links: [{ label: "لوحة الإدارة", href: "/admin/dashboard" }] },
  "admin/campaigns": { title: "الإشعارات والحملات", englishTitle: "Notifications and campaigns", eyebrow: "تواصل مع المتعلمين", description: "تحتاج الحملات إلى خدمة إشعارات وقواعد استهداف معتمدة.", kind: "coming-soon", previewLabel: "معاينة تصميم — لا توجد حملات", links: [{ label: "لوحة الإدارة", href: "/admin/dashboard" }] },
  "admin/audit-log": { title: "سجل التدقيق", englishTitle: "Audit log", eyebrow: "سجل التغييرات", description: "لا تتوفر بعد واجهة أمامية مصرح بها لاستعراض سجل التدقيق.", kind: "coming-soon", previewLabel: "معاينة تصميم — لا توجد سجلات معروضة", links: [{ label: "لوحة الإدارة", href: "/admin/dashboard" }] },
  "admin/meetings": { title: "إدارة اللقاءات", englishTitle: "Meeting management", eyebrow: "المواعيد والحضور", description: "تتطلب هذه الشاشة خدمة أحداث وسياسات حضور معتمدة.", kind: "coming-soon", previewLabel: "معاينة تصميم — اللقاءات غير متصلة", links: [{ label: "لوحة الإدارة", href: "/admin/dashboard" }] },
  "admin/notifications": { title: "إدارة الإشعارات", englishTitle: "Notification management", eyebrow: "التواصل التشغيلي", description: "تحتاج الإشعارات إلى خدمة وقواعد تسليم معتمدة.", kind: "coming-soon", previewLabel: "معاينة تصميم — الإشعارات غير متصلة", links: [{ label: "لوحة الإدارة", href: "/admin/dashboard" }] },
  "admin/settings": { title: "إعدادات المركز", englishTitle: "Academy settings", eyebrow: "إعدادات المنصة", description: "لا تتوفر واجهة إعدادات أو صلاحيات معتمدة لتغيير إعدادات المركز.", kind: "coming-soon", previewLabel: "معاينة تصميم — الإعدادات غير متصلة", links: [{ label: "لوحة الإدارة", href: "/admin/dashboard" }] },};

export function isKnownPlatformRoute(slug: string[]): boolean {
  const key = slug.join("/");
  if (Object.hasOwn(definitions, key)) return true;

  return (
    (slug[0] === "tracks" || slug[0] === "courses" || slug[0] === "initiatives" || slug[0] === "programs" || slug[0] === "seasonal-programs") && slug.length === 2 ||
    slug[0] === "events" && slug.length === 2 ||
    slug[0] === "meetings" && slug.length === 2 ||
    slug[0] === "admin" && ["users", "offerings", "lessons", "subjects"].includes(slug[1] ?? "") && slug.length === 3 ||
    slug[0] === "learning" && slug[1] === "lessons" && slug.length === 3 ||
    slug[0] === "community" && slug[1] === "groups" && slug.length === 3 ||
    slug[0] === "certificates" && slug[1] === "verify" && slug.length === 3
  );
}

export function getPageDefinition(slug: string[]): PageDefinition {
  const key = slug.join("/");
  const page = Object.hasOwn(definitions, key) ? definitions[key] : undefined;
  if (page) return page;

  if (slug[0] === "tracks" || slug[0] === "courses" || slug[0] === "initiatives" || slug[0] === "programs" || slug[0] === "seasonal-programs") {
    return {
      title: "تفاصيل المحتوى التعليمي", englishTitle: "Offering details", eyebrow: "من الفهرس إلى التفاصيل",
      description: "تظهر التفاصيل المنشورة من خدمة الكتالوج.", kind: "preview", previewLabel: "محتوى منشور",
      links: [{ label: "العودة إلى الفهرس", href: "/catalog" }],
    };
  }

  if (slug[0] === "events" || slug[0] === "meetings") {
    return {
      title: "تفاصيل اللقاء", englishTitle: "Event details", eyebrow: "تعلّم مع الآخرين",
      description: "لا تتوفر تفاصيل لقاء منشور حتى الآن.", kind: "coming-soon", previewLabel: "تصميم أولي — اللقاءات غير متصلة",
      links: [{ label: "الفعاليات", href: "/events" }],
    };
  }

  if (slug[0] === "admin") {
    return {
      title: "واجهة الإدارة", englishTitle: "Admin workspace", eyebrow: "إدارة المركز",
      description: "هذه الواجهة التصميمية لا تعرض سجلات أو تنفذ تغييرات. يلزم ربطها بصلاحيات وخدمة معتمدة.", kind: "coming-soon", previewLabel: "معاينة تصميم — لا توجد بيانات إدارية",
      links: [{ label: "لوحة الإدارة", href: "/admin/dashboard" }],
    };
  }

  if (slug[0] === "learning") {
    return {
      title: "محتوى التعلم", englishTitle: "Learning content", eyebrow: "رحلتك التعليمية",
      description: "تحتاج هذه الصفحة إلى خدمة تعلم وحساب مرتبط بالمسار.", kind: "coming-soon", previewLabel: "تصميم أولي — محتوى التعلم غير متصل",
      links: [{ label: "رحلتي التعليمية", href: "/learning" }],
    };
  }

  if (slug[0] === "community") {
    return {
      title: "المجموعة التعليمية", englishTitle: "Learning group", eyebrow: "نتعلم معًا",
      description: "تحتاج المجموعات إلى خدمة مجتمع وصلاحيات إشراف معتمدة.", kind: "coming-soon", previewLabel: "تصميم أولي — المجموعات غير متصلة",
      links: [{ label: "المجتمع", href: "/community" }],
    };
  }

  if (slug[0] === "certificates" && slug[1] === "verify") {
    return definitions["certificates/verify"];
  }

  return {
    title: "الصفحة غير موجودة", englishTitle: "Page not found", eyebrow: "مركز د. حازم شومان",
    description: "تعذر العثور على الصفحة المطلوبة.", kind: "coming-soon", previewLabel: "404",
    links: discoveryLinks,
  };
}
