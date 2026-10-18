import quran from "@/assets/build-exactly-web/course-quran.jpg";
import madinah from "@/assets/build-exactly-web/course-madinah.jpg";
import adhan from "@/assets/build-exactly-web/course-adhan.jpg";
import type { StaticImageData } from "next/image";

/** Synthetic presentation fixtures. Never use these as an API failure fallback. */
export type DiscoverySample = {
  id: string;
  title: string;
  category: "مسار" | "دورة" | "مبادرة";
  description: string;
  image: StaticImageData;
  topics: string[];
};

export const discoverySamples: DiscoverySample[] = [
  { id: "demo-foundations", title: "رحلة التأسيس العلمي", category: "مسار", description: "نموذج لمسار يجمع مدخلًا إلى القرآن والسيرة وآداب طلب العلم في رحلة متدرجة.", image: madinah, topics: ["العلم", "السيرة", "التأسيس"] },
  { id: "demo-quran", title: "تدبّر القرآن في الحياة", category: "دورة", description: "تصوّر تعليمي لربط معاني الآيات بالتأمل والعمل اليومي.", image: quran, topics: ["القرآن", "التدبر", "العمل"] },
  { id: "demo-prayer", title: "بداية مع الصلاة", category: "مبادرة", description: "تصوّر لمبادرة تربوية حول معاني الصلاة وبناء عادة التعلّم.", image: adhan, topics: ["الصلاة", "التربية", "العبادة"] },
];

export const faqSamples = [
  { id: "start", category: "البداية", question: "كيف أستكشف المسارات المتاحة؟", answer: "استخدم الفهرس التعليمي للاطلاع على المحتوى المنشور من خدمة الأكاديمية. أما البطاقات في هذه المعاينة فهي أمثلة تصميمية منفصلة عن الفهرس الفعلي." },
  { id: "account", category: "البداية", question: "أين أجد صفحة إنشاء الحساب؟", answer: "يمكن الانتقال إلى صفحة إنشاء الحساب من قائمة الموقع. هذه الإجابة توضح مكان الصفحة، ولا تحدد سياسة قبول أو تسجيل جديدة." },
  { id: "study", category: "التعلّم", question: "كيف سيظهر تنظيم المواد والدروس؟", answer: "تعرض معاينة الدرس نموذجًا لفهرس المواد، ومساحة المشاهدة، والملخص. لا تسجل المعاينة حضورًا أو تقدمًا دراسيًا." },
  { id: "quiz", category: "التعلّم", question: "هل تُحتسب اختيارات الاختبار التجريبي؟", answer: "الاختيارات المعروضة محلية لهذا العرض فقط. لا تُرسل إجابات، ولا تُحتسب نتيجة أو محاولة، وتظل قواعد التقييم من اختصاص الأكاديمية." },
  { id: "cert", category: "الشهادات", question: "هل يمكن التحقق من شهادة حقيقية هنا؟", answer: "واجهة التحقق الحالية نموذج تصميم. لا تتصل بسجل شهادات ولا تثبت صلاحية أي رقم. سيعتمد التحقق الفعلي على خدمة الشهادات عند إتاحتها." },
  { id: "support", category: "الدعم", question: "هل ترسل نماذج المعاينة رسالة إلى الإدارة؟", answer: "لا ترسل نماذج المعاينة أي بيانات. يمكنك تجربة ترتيب الحقول ورسائل التوضيح محليًا، وسيظهر تأكيد صريح بأن الرسالة لم تُرسل." },
];

export const agendaSamples = [
  { id: "demo-event", type: "event", title: "ورشة: خريطة البداية في طلب العلم", description: "نموذج لورشة تفاعلية تنظّم خطوات البداية وتتيح مساحة للأسئلة والتطبيق.", category: "ورشة عمل", state: "upcoming", image: madinah },
  { id: "demo-meeting", type: "meeting", title: "مجلس: من العلم إلى العمل", description: "نموذج لمجلس تعليمي يناقش الصلة بين المعرفة والتربية والعمل اليومي.", category: "مجلس علمي", state: "upcoming", image: quran },
  { id: "demo-past", type: "meeting", title: "لقاء سابق: صحبة في رحلة التعلّم", description: "بطاقة نموذجية لعرض أرشيف اللقاءات ومساحة التسجيل عند توفر الخدمة.", category: "لقاء حواري", state: "past", image: adhan },
] as const;
