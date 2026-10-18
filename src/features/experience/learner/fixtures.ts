/** Isolated, bounded presentation examples. Never use these as an API fallback. */
export type SampleLearning = {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  progress: number;
  lessons: number;
  state: "current" | "completed" | "purchased";
};

export const sampleLearning: readonly SampleLearning[] = [
  { id: "foundation", title: "رحلة التأسيس الإيماني", category: "مسار تجريبي", description: "معرفة الله، وبناء الصلة بالقرآن، وتزكية النفس.", image: "/images/lovable/t1.jpg", progress: 42, lessons: 12, state: "current" },
  { id: "quran", title: "تدبّر القرآن الكريم", category: "برنامج تجريبي", description: "مساحة للتأمل والفهم وربط المعاني بحياتنا اليومية.", image: "/images/lovable/t2.jpg", progress: 18, lessons: 8, state: "current" },
  { id: "seerah", title: "محطات من السيرة النبوية", category: "دورة تجريبية", description: "قراءة هادئة للمواقف والمعاني التربوية في السيرة.", image: "/images/lovable/t3.jpg", progress: 100, lessons: 6, state: "completed" },
  { id: "research", title: "مدخل إلى مهارات البحث", category: "دورة مشتراة — نموذج", description: "نموذج مرئي لظهور دورة في قائمة المشتريات، دون عملية شراء.", image: "/images/lovable/t4.jpg", progress: 0, lessons: 5, state: "purchased" },
];

export const sampleLessons = [
  { title: "لماذا نبدأ بمعرفة الله؟", kind: "فيديو", duration: "18 دقيقة", state: "درس سابق — نموذج" },
  { title: "معاني القرب من الله", kind: "فيديو", duration: "24 دقيقة", state: "الدرس المعروض" },
  { title: "وقفات مع أسماء الله الحسنى", kind: "صوتي", duration: "16 دقيقة", state: "درس تالٍ — نموذج" },
  { title: "ورقة التأمل والمراجعة", kind: "مستند", duration: "قراءة", state: "مصدر تعليمي — نموذج" },
] as const;

export const sampleQuestions = [
  { id: "q1", question: "أي وسيلة تساعدك على مراجعة ما تعلمته؟", options: ["تلخيص الأفكار بلغتك", "تجاوز المراجعة", "فتح دروس متفرقة فقط", "ترك الملاحظات دون قراءة"] },
  { id: "q2", question: "ما الخطوة الأنسب عند وجود سؤال في الدرس؟", options: ["تدوين السؤال والرجوع إلى مصدر موثوق", "تجاهل السؤال دائمًا", "نشر إجابة غير متحققة", "إغلاق المسار نهائيًا"] },
  { id: "q3", question: "كيف تنظم وقتًا للقراءة والتأمل؟", options: ["أختار وقتًا مناسبًا وأراجع خطتي", "أقرأ دون ترتيب في كل مرة", "أستبدل القراءة بعناوين الدروس", "أكتفي بعدد الصفحات"] },
] as const;

export const sampleNotifications = [
  { id: "n1", category: "learning", title: "مساحة لمتابعة رحلتك", description: "هنا سيظهر تنبيه متعلق بمحتوى مسارك عند تفعيل الخدمة.", time: "مجموعة اليوم — نموذج", href: "/my-learning" },
  { id: "n2", category: "meetings", title: "نموذج تذكير بلقاء تعليمي", description: "بطاقة لشرح شكل التنبيه؛ لا يوجد موعد أو رابط حضور فعلي.", time: "مجموعة اليوم — نموذج", href: "/meetings/mine" },
  { id: "n3", category: "community", title: "مساحة لنقاش المجموعة", description: "هذا مثال لرسالة من مجموعة تعليمية، وليس نشاطًا حقيقيًا.", time: "مجموعة سابقة — نموذج", href: "/community" },
  { id: "n4", category: "learning", title: "تعرّف على مشروعات التعلم", description: "استعرض واجهة تعليمات المشروع ومراحل المراجعة.", time: "مجموعة سابقة — نموذج", href: "/projects" },
] as const;
