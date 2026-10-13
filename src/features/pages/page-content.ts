export type PageKind = "ready" | "preview" | "coming-soon";

export type PageDefinition = {
  title: string;
  englishTitle: string;
  description: string;
  kind: PageKind;
  eyebrow: string;
  links?: Array<{ label: string; href: string }>;
  cards?: Array<{ title: string; description: string; href?: string }>;
};

const navLinks = [
  { label: "الفهرس التعليمي", href: "/catalog" },
  { label: "المسارات", href: "/tracks" },
  { label: "الفعاليات", href: "/events" },
  { label: "الأسئلة الشائعة", href: "/faq" },
];

const definitions: Record<string, PageDefinition> = {
  catalog: {
    title: "الفهرس التعليمي", englishTitle: "Learning catalog", eyebrow: "اكتشف ما يناسبك",
    description: "تصفح البرامج والمسارات والدورات التعليمية. المحتوى التفصيلي سيظهر عند ربط واجهة الفهرس بخدمة الكتالوج.", kind: "preview", links: navLinks,
    cards: [{ title: "بحث وتصفية", description: "ابحث بالموضوع أو المستوى أو المسار عندما تتوفر بيانات الكتالوج." }, { title: "برامج تعليمية", description: "مساحات جاهزة لاستقبال البرامج المنشورة من الأكاديمية." }, { title: "محتوى موثوق", description: "كل بطاقة ستعرض حالتها ومعلوماتها من المصدر المعتمد." }],
  },
  "catalog/search": { title: "البحث في المحتوى", englishTitle: "Catalog search", eyebrow: "ابحث وتعلّم", description: "واجهة البحث جاهزة، وتنتظر نقطة API المعتمدة للفهرس ومرشحاتها.", kind: "preview", links: [{ label: "العودة للفهرس", href: "/catalog" }] },
  tracks: { title: "المسارات التعليمية", englishTitle: "Learning tracks", eyebrow: "رحلة متكاملة", description: "المسارات تجمع الدورات والمواد وفق ترتيب واضح. قواعد الفتح والإكمال تُحسم من الخادم.", kind: "preview", links: navLinks },
  courses: { title: "الدورات", englishTitle: "Courses", eyebrow: "تعلم بخطوات", description: "صفحة الدورات العامة جاهزة لاستقبال المحتوى المنشور من خدمة الكتالوج.", kind: "preview", links: [{ label: "استكشف الفهرس", href: "/catalog" }] },
  faq: { title: "الأسئلة الشائعة", englishTitle: "Frequently asked questions", eyebrow: "نساعدك على البدء", description: "سيتم نشر الإجابات المعتمدة هنا بعد مراجعة سياسة الأكاديمية.", kind: "preview", links: navLinks, cards: [{ title: "كيف أبدأ؟", description: "تصفح الفهرس واختر ما يناسب هدفك التعليمي." }, { title: "هل التسجيل متاح؟", description: "تظهر خيارات الحساب عند تفعيل خدمة الهوية." }] },
  events: { title: "الفعاليات واللقاءات", englishTitle: "Events and live meetings", eyebrow: "تعلّم مع الآخرين", description: "صفحة الفعاليات تعرض اللقاءات القادمة والماضية بعد ربطها بخدمة الأحداث.", kind: "preview", links: navLinks, cards: [{ title: "اللقاءات القادمة", description: "موعد اللقاء ورابط الانضمام سيظهران من المصدر المعتمد." }, { title: "المحتوى السابق", description: "التسجيلات والمواد مرتبطة بالدورة أو المسار الصحيح." }] },
  community: { title: "المجتمع التعليمي", englishTitle: "Learning community", eyebrow: "نتعلم معًا", description: "مساحة المجتمع مصممة لتستقبل المجموعات والمنشورات بعد اعتماد قواعد النشر والإشراف.", kind: "coming-soon", links: navLinks },
  learning: { title: "رحلتي التعليمية", englishTitle: "My learning", eyebrow: "تابع تقدمك", description: "لوحة التعلم ستعرض المسار الحالي ونقطة الاستئناف والدروس القادمة من حسابك.", kind: "coming-soon", links: [{ label: "الفهرس", href: "/catalog" }, { label: "تسجيل الدخول", href: "/auth/login" }] },
  dashboard: { title: "لوحة المتعلم", englishTitle: "Learner dashboard", eyebrow: "كل رحلتك في مكان واحد", description: "هذه الصفحة جاهزة بصريًا، وتحتاج جلسة حساب وبيانات تقدم فعلية قبل تشغيلها.", kind: "coming-soon", links: [{ label: "تسجيل الدخول", href: "/auth/login" }] },
  quizzes: { title: "الاختبارات", englishTitle: "Quizzes", eyebrow: "قيّم فهمك", description: "سيتم تفعيل الاختبارات بعد اعتماد سياسات المحاولات والنجاح وإعادة الاختبار.", kind: "coming-soon", links: [{ label: "رحلتي التعليمية", href: "/learning" }] },
  certificates: { title: "الشهادات", englishTitle: "Certificates", eyebrow: "إنجازك يستحق التوثيق", description: "إصدار الشهادات وشروط الأهلية يحتاجان قواعد الأكاديمية المعتمدة.", kind: "coming-soon", links: [{ label: "التحقق من شهادة", href: "/certificates/verify" }] },
  "certificates/verify": { title: "التحقق من شهادة", englishTitle: "Certificate verification", eyebrow: "تحقق موثوق", description: "ستتم إضافة البحث برقم الشهادة أو رمز QR بعد اعتماد حقول العرض العامة وسياسة الخصوصية.", kind: "coming-soon", links: [{ label: "الشهادات", href: "/certificates" }] },
  projects: { title: "مشروعات التخرج", englishTitle: "Graduation projects", eyebrow: "اصنع أثرًا", description: "رفع المشروع والتحليل المساعد بالتقنية والتقييم البشري يحتاجان Rubric معتمدًا.", kind: "coming-soon", links: [{ label: "رحلتي التعليمية", href: "/learning" }] },
  notifications: { title: "الإشعارات", englishTitle: "Notifications", eyebrow: "ابقَ على اطلاع", description: "سيعرض مركز الإشعارات رسائل حسابك وحملاتك بعد تفعيل خدمة الإشعارات.", kind: "coming-soon", links: [{ label: "لوحة المتعلم", href: "/dashboard" }] },
  account: { title: "حسابي", englishTitle: "My account", eyebrow: "بياناتك وإعداداتك", description: "إدارة الحساب والجلسة والخصوصية ستعمل عبر حدود الخادم وملفات الارتباط الآمنة.", kind: "coming-soon", links: [{ label: "تسجيل الدخول", href: "/auth/login" }] },
  "auth/login": { title: "تسجيل الدخول", englishTitle: "Sign in", eyebrow: "مرحبًا بعودتك", description: "نموذج الدخول سيُربط بخدمة الهوية عند اعتماد عقد API والجلسات الآمنة.", kind: "coming-soon", links: [{ label: "إنشاء حساب", href: "/auth/register" }, { label: "الفهرس", href: "/catalog" }] },
  "auth/register": { title: "إنشاء حساب", englishTitle: "Create account", eyebrow: "ابدأ رحلتك", description: "التسجيل جاهز كصفحة مسار، وتفعيل الحقول والتحقق يحتاجان عقد الهوية المعتمد.", kind: "coming-soon", links: [{ label: "تسجيل الدخول", href: "/auth/login" }] },
  "auth/forgot-password": { title: "استعادة كلمة المرور", englishTitle: "Reset password", eyebrow: "نساعدك على العودة", description: "سيتم ربط الاستعادة بخدمة الهوية وإرسال آمن بعد اعتمادها.", kind: "coming-soon", links: [{ label: "تسجيل الدخول", href: "/auth/login" }] },
};

export function getPageDefinition(slug: string[]): PageDefinition {
  const key = slug.join("/");
  return definitions[key] ?? {
    title: "الصفحة غير متاحة بعد", englishTitle: "Page not available yet", eyebrow: "أكاديمية د. حازم شومان",
    description: "هذا المسار محفوظ ضمن خريطة المنصة وسيظهر عند اكتمال متطلباته واعتماد واجهته.", kind: "coming-soon", links: navLinks,
  };
}


