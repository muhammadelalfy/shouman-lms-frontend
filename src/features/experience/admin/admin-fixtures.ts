/** Isolated presentation examples. These are never API DTOs or fallback records. */
export type AdminRow = {
  id: string;
  cells: [string, string, string, string];
  href: string;
};

export type AdminTableDefinition = {
  title: string;
  description: string;
  columns: [string, string, string, string];
  rows: AdminRow[];
  createHref?: string;
  createLabel?: string;
  related?: { label: string; href: string }[];
};

const row = (id: string, cells: AdminRow["cells"], href: string): AdminRow => ({ id, cells, href });

export const adminTables: Record<string, AdminTableDefinition> = {
  users: {
    title: "المستخدمون", description: "استعرض نموذج إدارة الحسابات، وابحث في السجلات الاصطناعية قبل فتح ملف المستخدم.",
    columns: ["المستخدم", "الدور المعروض", "حالة المثال", "السجل"], createHref: "/admin/users/new", createLabel: "معاينة إضافة مستخدم",
    rows: Array.from({ length: 8 }, (_, i) => row(`user-${i}`, [`متعلم تجريبي ${String(i + 1).padStart(2, "0")}`, i === 3 ? "مدرّس تجريبي" : "متعلم", i % 3 === 0 ? "مثال للمراجعة" : "مثال نشط", `DEMO-U-${i + 1}`], "/admin/users/demo-user")),
    related: [{ label: "الأدوار والصلاحيات", href: "/admin/roles" }],
  },
  offerings: {
    title: "المحتوى التعليمي", description: "المسارات والدورات والبرامج في قائمة تأليف واحدة، مع فصل المعاينة عن حالة النشر الفعلية.",
    columns: ["العنوان التجريبي", "النوع", "حالة المثال", "البنية"], createHref: "/admin/offerings/new", createLabel: "معاينة محتوى جديد",
    rows: [row("offering-1", ["مدخل إلى العلوم الشرعية", "مسار", "مسودة تجريبية", "مادتان توضيحيتان"], "/admin/offerings/demo-offering"), row("offering-2", ["مهارات تدبر القرآن", "دورة", "للمراجعة", "مادة توضيحية"], "/admin/offerings/demo-offering"), row("offering-3", ["آداب طلب العلم", "برنامج", "مسودة تجريبية", "مادة توضيحية"], "/admin/offerings/demo-offering")],
    related: [{ label: "محرر المادة", href: "/admin/subjects/demo-subject" }, { label: "محرر الدرس", href: "/admin/lessons/demo-lesson" }],
  },
  quizzes: {
    title: "الاختبارات", description: "راجع بنية الاختبار وأسئلته. قواعد المحاولات والدرجات والوقت تنتظر اعتماد الأكاديمية.",
    columns: ["الاختبار", "المحتوى المرتبط", "حالة المثال", "الأسئلة"], createHref: "/admin/quizzes/new", createLabel: "معاينة اختبار جديد",
    rows: [row("quiz-1", ["مراجعة المفاهيم الأساسية", "مدخل إلى العلوم الشرعية", "مسودة تجريبية", "سؤالان للعرض"], "/admin/quizzes/demo-quiz"), row("quiz-2", ["تدريب على الاستيعاب", "مهارات تدبر القرآن", "للمراجعة", "سؤال توضيحي"], "/admin/quizzes/demo-quiz")],
    related: [{ label: "بنك الأسئلة", href: "/admin/question-bank" }],
  },
  "question-bank": {
    title: "بنك الأسئلة", description: "نماذج مستقلة للأسئلة يمكن استكشافها محليًا، دون تقييم أو إجابات صحيحة معتمدة.",
    columns: ["عنوان السؤال", "النوع", "حالة المثال", "التصنيف"], createHref: "/admin/question-bank/new", createLabel: "معاينة سؤال جديد",
    rows: [row("question-1", ["اختر المفهوم المناسب للنص", "اختيار واحد", "مسودة تجريبية", "فهم النص"], "/admin/question-bank/demo-question"), row("question-2", ["اكتب ملخص الفكرة الرئيسة", "إجابة نصية", "للمراجعة", "تأمل وتلخيص"], "/admin/question-bank/demo-question")],
  },
  payments: {
    title: "المدفوعات والطلبات", description: "واجهة متابعة توضيحية. لا تتضمن أموالًا أو معاملات أو مزود دفع متصلًا.",
    columns: ["مرجع المثال", "المحتوى", "حالة المثال", "المبلغ"],
    rows: [row("payment-1", ["DEMO-ORDER-01", "دورة تجريبية", "مثال بانتظار الربط", "غير محدد"], "/admin/payments/demo-payment"), row("payment-2", ["DEMO-ORDER-02", "برنامج تجريبي", "مثال للمراجعة", "غير محدد"], "/admin/payments/demo-payment")],
    related: [{ label: "الكوبونات", href: "/admin/coupons" }, { label: "العروض", href: "/admin/offers" }],
  },
  coupons: {
    title: "الكوبونات", description: "نماذج إعداد الكوبون ونطاقه؛ لا توجد قيمة خصم أو صلاحية أو حساب مالي معتمد.",
    columns: ["الاسم", "النطاق", "حالة المثال", "القيمة"], createHref: "/admin/coupons/new", createLabel: "معاينة كوبون جديد",
    rows: [row("coupon-1", ["كوبون توضيحي أ", "محتوى يُحدّد لاحقًا", "مسودة تجريبية", "غير معتمدة"], "/admin/coupons/demo-coupon"), row("coupon-2", ["كوبون توضيحي ب", "محتوى يُحدّد لاحقًا", "للمراجعة", "غير معتمدة"], "/admin/coupons/demo-coupon")],
  },
  offers: {
    title: "العروض", description: "تخطيط رسائل العرض ومحتواه فقط؛ التسعير وسياسات الخصم غير متصلة.",
    columns: ["العرض", "المحتوى", "حالة المثال", "الجدولة"], createHref: "/admin/offers/new", createLabel: "معاينة عرض جديد",
    rows: [row("offer-1", ["مساحة عرض توضيحي", "دورة تجريبية", "مسودة تجريبية", "غير محددة"], "/admin/offers/demo-offer")],
  },
  groups: {
    title: "المجموعات والإشراف", description: "مجموعات تعليمية اصطناعية، مع معاينة منفصلة للأعضاء والمنشورات والمراجعة.",
    columns: ["المجموعة", "المحتوى", "حالة المثال", "الأعضاء"], createHref: "/admin/groups/new", createLabel: "معاينة مجموعة جديدة",
    rows: [row("group-1", ["مجموعة تدبر تجريبية", "مهارات تدبر القرآن", "للمراجعة", "أسماء اصطناعية"], "/admin/groups/demo-group"), row("group-2", ["مجموعة الآداب التجريبية", "آداب طلب العلم", "مسودة تجريبية", "أسماء اصطناعية"], "/admin/groups/demo-group")],
  },
  events: {
    title: "الفعاليات", description: "نماذج تنظيم فعاليات الأكاديمية. المواعيد المعروضة في المحرر لا تنشئ حجزًا أو حضورًا.",
    columns: ["الفعالية", "التنسيق", "حالة المثال", "الموعد"], createHref: "/admin/events/new", createLabel: "معاينة فعالية جديدة",
    rows: [row("event-1", ["ملتقى طلب العلم التجريبي", "حضوري / للمعاينة", "مسودة تجريبية", "غير محدد"], "/admin/events/demo-event"), row("event-2", ["ورشة القراءة الواعية", "عبر الإنترنت / للمعاينة", "للمراجعة", "غير محدد"], "/admin/events/demo-event")],
    related: [{ label: "الحضور", href: "/admin/attendance" }],
  },
  meetings: {
    title: "اللقاءات المباشرة", description: "نماذج اللقاءات وربطها بالمحتوى والمجموعات دون إنشاء روابط انضمام أو تسجيلات.",
    columns: ["اللقاء", "المجموعة", "حالة المثال", "رابط الانضمام"], createHref: "/admin/meetings/new", createLabel: "معاينة لقاء جديد",
    rows: [row("meeting-1", ["مناقشة أسبوعية تجريبية", "مجموعة تدبر تجريبية", "مسودة تجريبية", "غير متصل"], "/admin/meetings/demo-meeting"), row("meeting-2", ["جلسة أسئلة توضيحية", "مجموعة الآداب التجريبية", "للمراجعة", "غير متصل"], "/admin/meetings/demo-meeting")],
    related: [{ label: "الحضور", href: "/admin/attendance" }],
  },
  attendance: {
    title: "متابعة الحضور", description: "سجل اصطناعي لشرح الأعمدة؛ لا يعد ضغط زر أو حضور هذه الصفحة إثباتًا لحضور لقاء.",
    columns: ["المتعلم", "اللقاء", "حالة المثال", "مصدر الإثبات"],
    rows: [row("attendance-1", ["متعلم تجريبي 01", "لقاء تجريبي", "بانتظار مصدر معتمد", "غير متصل"], "/admin/attendance/demo-attendance"), row("attendance-2", ["متعلم تجريبي 02", "لقاء تجريبي", "للمراجعة", "غير متصل"], "/admin/attendance/demo-attendance")],
  },
  projects: {
    title: "مشروعات التخرج", description: "قائمة تسليمات اصطناعية لعرض مساحة المقيّم؛ لا ملفات حقيقية ولا نتائج أو تحليل آلي.",
    columns: ["المشروع", "المتقدم", "حالة المثال", "المقيّم"],
    rows: [row("project-1", ["خطة قراءة وتأمل تجريبية", "متعلم تجريبي 01", "بانتظار مراجعة بشرية", "غير مسند"], "/admin/projects/demo-project"), row("project-2", ["ملخص معرفي تجريبي", "متعلم تجريبي 02", "مسودة تجريبية", "غير مسند"], "/admin/projects/demo-project")],
    related: [{ label: "معايير التقييم", href: "/admin/rubrics" }],
  },
  notifications: {
    title: "الإشعارات", description: "نماذج رسائل توضيحية وقنواتها. لا إرسال أو جدولة أو تغيير لحالة التسليم.",
    columns: ["عنوان الرسالة", "القناة", "حالة المثال", "الجمهور"], createHref: "/admin/notifications/new", createLabel: "معاينة كتابة إشعار",
    rows: [row("notification-1", ["رسالة ترحيب تجريبية", "داخل المنصة", "مسودة تجريبية", "جمهور تجريبي"], "/admin/notifications/demo-notification"), row("notification-2", ["تذكير تعليمي توضيحي", "لم تُحدّد", "للمراجعة", "غير محدد"], "/admin/notifications/demo-notification")],
    related: [{ label: "الحملات", href: "/admin/campaigns" }],
  },
  campaigns: {
    title: "الحملات", description: "صمم الرسالة واختيار الجمهور في معاينة محلية. مزودو الرسائل والجدولة غير متصلين.",
    columns: ["الحملة", "الجمهور", "حالة المثال", "الإرسال"], createHref: "/admin/campaigns/new", createLabel: "معاينة حملة جديدة",
    rows: [row("campaign-1", ["حملة تعليمية تجريبية", "اختيار محلي", "مسودة تجريبية", "لم يُرسل"], "/admin/campaigns/demo-campaign"), row("campaign-2", ["رسالة متابعة تجريبية", "غير محدد", "للمراجعة", "لم يُرسل"], "/admin/campaigns/demo-campaign")],
  },
  "audit-log": {
    title: "سجل التدقيق", description: "سجل اصطناعي يشرح شكل الحدث وسياقه فقط؛ لا يعرض أي بيانات مستخدم أو عنوان شبكة أو أسرار.",
    columns: ["الحدث التجريبي", "الفاعل", "حالة المثال", "المرجع"],
    rows: [row("audit-1", ["مثال تعديل عنوان محتوى", "موظف تجريبي 01", "سجل اصطناعي", "DEMO-AUDIT-01"], "/admin/audit-log/demo-audit"), row("audit-2", ["مثال طلب مراجعة", "موظف تجريبي 02", "سجل اصطناعي", "DEMO-AUDIT-02"], "/admin/audit-log/demo-audit")],
  },
};

export const localChangeMessage = "تغيير محلي للمعاينة فقط؛ لم يُحفظ";
