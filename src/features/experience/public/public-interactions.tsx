"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, CalendarDays, ChevronDown, CircleHelp, Clock3, MessageCircle, Pin, ScanLine, Search, ShieldCheck, Video } from "lucide-react";
import { DemoDataLabel, EmptyState, PreviewAction, SearchField, StatusBadge } from "@/features/experience/shared/ui";
import { agendaSamples, discoverySamples, faqSamples } from "./public-data";

export function DiscoveryExplorer({ initialQuery = "", catalog = false }: { initialQuery?: string; catalog?: boolean }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("الكل");
  const filtered = discoverySamples.filter((item) => (category === "الكل" || item.category === category) && `${item.title} ${item.description} ${item.topics.join(" ")}`.includes(query.trim()));
  return <div className="xp-stack">
    <section className="xp-card pub-search-panel" aria-label="البحث في أمثلة التصميم">
      <SearchField label="ابحث في الأمثلة المحلية" value={query} onChange={setQuery} placeholder="جرّب: القرآن أو الصلاة أو العلم" />
      <div className="pub-chips" aria-label="نوع المحتوى">{["الكل", "مسار", "دورة", "مبادرة"].map((value) => <button type="button" key={value} className="pub-chip" aria-pressed={category === value} onClick={() => setCategory(value)}>{value}</button>)}</div>
      <p className="xp-muted">بحث داخل ثلاثة أمثلة تصميمية فقط. للمواد المنشورة استخدم <Link href="/catalog">الفهرس الفعلي</Link>.</p>
    </section>
    <div className="xp-row pub-results-heading"><h2>{catalog ? "اختر بداية رحلتك" : "نتائج الأمثلة"}</h2><span role="status" className="xp-muted">{filtered.length} من {discoverySamples.length} أمثلة محلية</span></div>
    {filtered.length ? <div className="xp-grid xp-grid-3">{filtered.map((item) => <article className="xp-card pub-course-card" key={item.id}>
      <div className="pub-cover"><Image src={item.image} alt="" sizes="(max-width: 768px) 100vw, 33vw" /><span className="pub-cover-label">مثال تصميمي</span></div>
      <div className="pub-card-content"><StatusBadge>{item.category}</StatusBadge><h3>{item.title}</h3><p className="xp-muted">{item.description}</p><div className="pub-topics">{item.topics.map((topic) => <span key={topic}>{topic}</span>)}</div><Link className="pub-text-link" href="/preview/catalog/demo-course">استكشف نموذج المحتوى <span aria-hidden="true">←</span></Link></div>
    </article>)}</div> : <EmptyState title="لا توجد أمثلة مطابقة" description="جرّب كلمة أخرى أو اعرض كل أنواع المحتوى. البحث محلي ولا يشمل الفهرس المنشور." />}
    <aside className="pub-info-strip"><Search aria-hidden="true" /><div><strong>تبحث عن محتوى الأكاديمية المنشور؟</strong><p>الفهرس المتصل بالخدمة يعرض البيانات المتاحة من مصدرها المعتمد.</p></div><Link className="xp-button xp-button-outline" href="/catalog">افتح الفهرس</Link></aside>
  </div>;
}

export function FaqExplorer() {
  const [category, setCategory] = useState("الكل");
  const [query, setQuery] = useState("");
  const items = faqSamples.filter((item) => (category === "الكل" || item.category === category) && `${item.question} ${item.answer}`.includes(query.trim()));
  return <div className="pub-faq-layout"><aside className="xp-card pub-faq-aside"><CircleHelp aria-hidden="true" className="pub-large-icon" /><h2>عن هذه المعاينة</h2><p className="xp-muted">هذه إجابات توضيحية لتجربة الواجهة، وليست سياسات رسمية للأكاديمية.</p><Link className="xp-button xp-button-outline" href="/contact">واجهة التواصل</Link></aside><div className="xp-stack"><SearchField label="ابحث في الأسئلة التوضيحية" value={query} onChange={setQuery} placeholder="اكتب كلمة من السؤال" /><div className="pub-chips" aria-label="تصنيفات الأسئلة">{["الكل", "البداية", "التعلّم", "الشهادات", "الدعم"].map((item) => <button key={item} className="pub-chip" type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div><p className="xp-muted" role="status">{items.length} أسئلة توضيحية</p>{items.length ? <div className="pub-faq-list">{items.map((item) => <details className="xp-card pub-accordion" key={item.id}><summary>{item.question}<ChevronDown aria-hidden="true" /></summary><p>{item.answer}</p></details>)}</div> : <EmptyState title="لا توجد أسئلة مطابقة" description="غيّر كلمة البحث أو التصنيف لعرض الأسئلة التوضيحية." />}</div></div>;
}

export function AgendaExplorer({ type, mine = false }: { type: "event" | "meeting"; mine?: boolean }) {
  const [period, setPeriod] = useState<"upcoming" | "past">("upcoming");
  const items = agendaSamples.filter((item) => item.type === type && item.state === period);
  return <div className="xp-stack"><div className="pub-chips" aria-label="فترة اللقاءات"><button type="button" className="pub-chip" aria-pressed={period === "upcoming"} onClick={() => setPeriod("upcoming")}>القادمة — نموذج</button><button type="button" className="pub-chip" aria-pressed={period === "past"} onClick={() => setPeriod("past")}>السابقة — نموذج</button></div>{mine && <div className="pub-info-strip"><CalendarDays aria-hidden="true" /><p>هذه مساحة تصور لقاءات الطالب. لا يوجد تسجيل أو حضور مرتبط بحسابك في هذه المعاينة.</p></div>}{items.length ? <div className="xp-grid xp-grid-2">{items.map((item) => <article className="xp-card pub-agenda-card" key={item.id}><div className="pub-cover"><Image src={item.image} alt="" sizes="(max-width: 768px) 100vw, 50vw" /></div><div className="pub-card-content"><div className="xp-row"><StatusBadge>{item.category}</StatusBadge><span className="xp-muted">موعد توضيحي غير مجدول</span></div><h2>{item.title}</h2><p className="xp-muted">{item.description}</p><div className="pub-agenda-meta"><span><Video aria-hidden="true" />تصور لقاء عبر المنصة</span><span><Clock3 aria-hidden="true" />المدة عند الإتاحة</span></div><Link className="xp-button xp-button-outline" href={type === "event" ? "/events/demo-event" : "/meetings/demo-meeting"}>تفاصيل النموذج <span aria-hidden="true">←</span></Link></div></article>)}</div> : <EmptyState title="لا توجد أمثلة في هذا القسم" description="هذا العرض محلي فقط ولا يدل على جدول الأكاديمية الحقيقي." />}</div>;
}

export function CommunityComposer({ thread = false }: { thread?: boolean }) {
  const [draft, setDraft] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState(false);
  const [view, setView] = useState("الكل");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(!draft.trim());
    setFeedback(draft.trim() ? "لم يتم الإرسال أو الحفظ. النص مسودة محلية في هذه الصفحة فقط." : "اكتب نصًا تجريبيًا لتجربة النموذج. لم يتم الإرسال أو الحفظ.");
  }
  return <div className="xp-stack">
    {!thread && <div className="pub-chips" aria-label="نوع المشاركات">{["الكل", "المثبتة", "النقاشات"].map((item) => <button key={item} type="button" className="pub-chip" aria-pressed={view === item} onClick={() => setView(item)}>{item}</button>)}</div>}
    {(thread || view !== "النقاشات") && <article className="xp-card pub-post pub-post-pinned"><div className="xp-row"><span className="pub-author-mark" aria-hidden="true">م</span><div><strong>مشرف تجريبي</strong><p className="xp-muted">مشاركة توضيحية · بلا تاريخ فعلي</p></div><StatusBadge><Pin aria-hidden="true" />مثبت — نموذج</StatusBadge></div><h2>مرحبًا برحلة التعلّم المشتركة</h2><p>هذا مثال لطريقة عرض إعلان المجموعة. يمكن هنا تنظيم المواد المقترحة والأسئلة العامة عندما تتوفر خدمة المجتمع وسياسة المشاركة المعتمدة.</p>{!thread && <Link className="pub-text-link" href="/community/groups/demo-group/posts/demo-post">افتح النقاش التجريبي <MessageCircle aria-hidden="true" /></Link>}</article>}
    {(thread || view !== "المثبتة") && <article className="xp-card pub-post"><div className="xp-row"><span className="pub-author-mark" aria-hidden="true">ط</span><div><strong>مشارك تجريبي 01</strong><p className="xp-muted">نص اصطناعي لعرض شكل النقاش</p></div></div><h3>{thread ? "رد توضيحي" : "كيف أنظّم ملاحظات الدرس؟"}</h3><p>أجرّب تقسيم الملاحظات إلى فكرة رئيسية، وسؤال للمراجعة، وخطوة للتطبيق. هذا نص للمعاينة ولا يمثل مشاركة من شخص حقيقي.</p><PreviewAction title="التفاعل مع المشاركة" description="لم يتم إرسال تفاعل أو بلاغ. تتطلب هذه الوظائف خدمة المجتمع وسياسة الإشراف المعتمدة.">خيارات المشاركة</PreviewAction></article>}
    <form className="xp-card pub-composer" onSubmit={submit} noValidate><h2>{thread ? "أضف ردًا — معاينة" : "مساحة مشاركة جديدة — معاينة"}</h2><p className="xp-muted">استخدم نصًا تجريبيًا، وتجنّب أي معلومات شخصية. المسودة لا تغادر هذه الصفحة.</p><label className="xp-field" htmlFor="community-draft"><span>{thread ? "نص الرد التجريبي" : "نص المشاركة التجريبية"}</span><textarea className="resize-none" id="community-draft" value={draft} onChange={(event) => { setDraft(event.target.value); setError(false); setFeedback(""); }} rows={5} maxLength={2000} aria-invalid={error} aria-describedby="community-feedback" placeholder="اكتب فكرة لتجربة مساحة النقاش…" /></label><div className="xp-row"><button className="xp-button" type="submit">معاينة الإرسال</button><span className="xp-muted">بلا مرفقات أو إرسال فعلي</span></div><p id="community-feedback" role="status" className={error ? "pub-form-error" : "pub-local-feedback"}>{feedback}</p></form>
  </div>;
}

export function CheckoutPreview({ result = false }: { result?: boolean }) {
  const [coupon, setCoupon] = useState("");
  const [feedback, setFeedback] = useState("");
  const [couponError, setCouponError] = useState(false);
  const [state, setState] = useState("pending");
  const states = { pending: { title: "نموذج حالة قيد المتابعة", text: "تعرض هذه المساحة رسالة انتظار الخدمة. لا يوجد طلب أو عملية دفع فعلية.", badge: "انتظار — مثال" }, complete: { title: "نموذج شاشة اكتمال المعالجة", text: "هذا تنسيق بصري للحالة فقط. لم يتم الدفع أو إنشاء طلب أو تفعيل محتوى.", badge: "اكتمال — مثال تصميمي" }, failed: { title: "نموذج شاشة تعذّر المعالجة", text: "مساحة توضيح المشكلة وخطوات العودة. لم تُجرَ محاولة دفع ولم يُخصم أي مبلغ.", badge: "تعذّر — مثال" } };
  const active = states[state as keyof typeof states];
  if (result) return <div className="xp-stack"><div className="pub-chips" aria-label="أمثلة حالات صفحة النتيجة">{[["pending", "قيد المتابعة"], ["complete", "اكتمال المعالجة"], ["failed", "تعذّر المعالجة"]].map(([value, title]) => <button key={value} type="button" className="pub-chip" aria-pressed={state === value} onClick={() => setState(value)}>{title} — نموذج</button>)}</div><section className="xp-card pub-result"><div className="pub-result-symbol" aria-hidden="true">{state === "failed" ? "!" : state === "pending" ? "…" : "◇"}</div><DemoDataLabel /><StatusBadge>{active.badge}</StatusBadge><h2>{active.title}</h2><p>{active.text}</p><div className="xp-row"><Link href="/checkout/demo-course" className="xp-button xp-button-outline">العودة إلى نموذج الطلب</Link><Link href="/preview/catalog/demo-course" className="pub-text-link">نموذج المحتوى</Link></div></section></div>;
  function applyCoupon(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setCouponError(!coupon.trim()); setFeedback(coupon.trim() ? "لم يتم تطبيق رمز أو احتساب خصم. لم يتم الإرسال أو الحفظ." : "اكتب رمزًا تجريبيًا لتجربة الحقل. لم يتم الإرسال أو الحفظ."); }
  return <div className="pub-checkout-layout"><div className="xp-stack"><section className="xp-card pub-checkout-section"><h2><BookOpen aria-hidden="true" />المحتوى المختار — نموذج</h2><h3>تدبّر القرآن في الحياة</h3><p className="xp-muted">مثال مستقل عن الفهرس الفعلي؛ لا يتضمن تسجيلًا أو حق وصول للمحتوى.</p><div className="pub-checkout-line"><span>السعر المعتمد</span><strong>غير متصل</strong></div><div className="pub-checkout-line"><span>عملة الدفع</span><span>تُعرض من الخدمة عند إتاحتها</span></div></section><form className="xp-card pub-checkout-section" onSubmit={applyCoupon} noValidate><h2>رمز العرض</h2><label className="xp-field" htmlFor="demo-coupon"><span>رمز تجريبي</span><input id="demo-coupon" value={coupon} onChange={(event) => { setCoupon(event.target.value); setCouponError(false); setFeedback(""); }} dir="ltr" placeholder="DEMO-CODE" maxLength={60} aria-invalid={couponError} aria-describedby="coupon-feedback" /></label><button className="xp-button xp-button-outline" type="submit">معاينة تطبيق الرمز</button><p id="coupon-feedback" role="status" className={couponError ? "pub-form-error" : "pub-local-feedback"}>{feedback}</p></form><section className="xp-card pub-checkout-section"><h2>طريقة الدفع</h2><div className="pub-payment-placeholder"><ShieldCheck aria-hidden="true" /><div><strong>مزود الدفع لم يُعتمد بعد</strong><p className="xp-muted">لا تطلب هذه المعاينة بيانات بطاقة أو محفظة، ولا تتصل ببوابة دفع.</p></div></div></section></div><aside className="xp-card pub-order-summary"><h2>ملخص الطلب — نموذج</h2><div className="pub-checkout-line"><span>المحتوى</span><span>عنصر توضيحي</span></div><div className="pub-checkout-line"><span>الإجمالي</span><strong>—</strong></div><p className="xp-muted">السعر والخصم والعملة يحدّدها مصدرها المعتمد عند تفعيل الخدمة.</p><PreviewAction title="معاينة خطوة الدفع" description="لم يتم الإرسال أو الحفظ، ولم يتم خصم مبلغ أو إنشاء طلب أو تسجيل في المحتوى.">معاينة المتابعة</PreviewAction><Link className="pub-text-link" href="/checkout/demo-course/result">استكشف تصميم حالات النتيجة ←</Link><p className="pub-small-note">هذه الواجهة للعرض فقط، ولا تمنح وصولًا إلى المحتوى.</p></aside></div>;
}

export function CertificateVerifier({ initialCode = "" }: { initialCode?: string }) {
  const [code, setCode] = useState(initialCode);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState(false);
  function verify(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setError(!code.trim()); setFeedback(code.trim() ? "لم يتم إرسال الرقم أو التحقق من شهادة. خدمة التحقق غير متصلة في هذه المعاينة، ولا يمكن تحديد صلاحية الرقم." : "اكتب رقمًا تجريبيًا لتجربة الحقل. لم يتم إرسال الرقم أو التحقق من شهادة."); }
  return <div className="pub-verify-layout"><form className="xp-card pub-verify-form" noValidate onSubmit={verify}><ShieldCheck className="pub-large-icon" aria-hidden="true" /><h2>التحقق برقم الشهادة</h2><p className="xp-muted">جرّب الواجهة برقم اصطناعي فقط. لا توجد صلة بسجل شهادات حقيقي.</p><label className="xp-field" htmlFor="certificate-number"><span>رقم تجريبي</span><input id="certificate-number" dir="ltr" value={code} onChange={(event) => { setCode(event.target.value); setError(false); setFeedback(""); }} maxLength={100} placeholder="DEMO-CERTIFICATE" aria-invalid={error} aria-describedby="verify-feedback" /></label><button type="submit" className="xp-button">معاينة التحقق</button><p id="verify-feedback" role="status" className={error ? "pub-form-error" : "pub-local-feedback"}>{feedback}</p></form><aside className="xp-card pub-qr-panel"><div className="pub-scanner-frame" aria-hidden="true"><ScanLine /><span>QR</span></div><h2>مسح رمز الشهادة</h2><p className="xp-muted">مساحة توضيحية للماسح. لا تشغّل الكاميرا ولا تقرأ أي رمز.</p><PreviewAction title="معاينة ماسح الشهادة" description="لم يتم تشغيل الكاميرا أو قراءة رمز. يجب ربط التحقق بخدمة الشهادات المعتمدة.">كيف سيعمل المسح؟</PreviewAction></aside><section className="pub-verification-note"><h2>ما الذي سيظهر عند تفعيل الخدمة؟</h2><p>تُعرض بيانات الشهادة وحالتها من السجل المعتمد، مع التمييز الواضح بين التعذّر على التحقق وعدم العثور على شهادة. لا تمثل هذه المعاينة أي حالة صلاحية.</p></section></div>;
}

export function ContactPreview() {
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [feedback, setFeedback] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setAttempted(true); setFeedback(topic && message.trim() ? "لم يتم الإرسال أو الحفظ. هذه رسالة محلية لتجربة النموذج فقط." : "اختر الموضوع واكتب رسالة تجريبية. لم يتم الإرسال أو الحفظ."); }
  return <form className="xp-card pub-contact-form" onSubmit={submit} noValidate><h2>مساحة رسالة — معاينة</h2><p className="xp-muted">استخدم محتوى تجريبيًا فقط؛ لا حاجة إلى بريد أو رقم هاتف في هذه المعاينة.</p><label className="xp-field" htmlFor="contact-topic"><span>موضوع الرسالة التجريبية</span><select id="contact-topic" value={topic} onChange={(event) => { setTopic(event.target.value); setFeedback(""); }} aria-invalid={attempted && !topic} aria-describedby="contact-feedback"><option value="">اختر موضوعًا</option><option>استكشاف المحتوى</option><option>تجربة الموقع</option><option>سؤال عام</option></select></label><label className="xp-field" htmlFor="contact-message"><span>نص تجريبي</span><textarea className="resize-none" id="contact-message" rows={6} maxLength={2000} value={message} onChange={(event) => { setMessage(event.target.value); setFeedback(""); }} aria-invalid={attempted && !message.trim()} aria-describedby="contact-feedback" placeholder="اكتب رسالة لتجربة النموذج…" /></label><button className="xp-button" type="submit">معاينة إرسال الرسالة</button><p id="contact-feedback" role="status" className={attempted && (!topic || !message.trim()) ? "pub-form-error" : "pub-local-feedback"}>{feedback}</p></form>;
}
