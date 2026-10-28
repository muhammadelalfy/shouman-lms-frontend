"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Compass, HeartHandshake, Leaf, Play, ShieldCheck, Sparkles, Users } from "lucide-react";
import { marketingTracks } from "../fixtures";
import { marketingRoutes, type PublicMarketingPageId } from "../routes";
import { MarketingEmpty, MarketingNote, MarketingPanel, SampleLabel, marketingHref } from "../shared";
import "./public.css";

function Overview() {
  return <div className="mk-stack">
    <section className="mk-public-intro"><div><span className="mk-public-eyebrow">من السؤال إلى صحبة العلم</span><h2>لكل رحلة بداية.<br />ولكل خطوة معنى.</h2><p>استكشف اهتماماتك، واقرأ قصة المسار، ثم تعرّف إلى صور الصحبة والمتابعة. هذه مساحة لتجربة التصميم؛ المحتوى والعمليات المعروضة ليست خدمات مفعّلة.</p><a className="mk-button" href={marketingHref("orientation")}>استكشف نقطة البداية <ArrowLeft size={18} aria-hidden="true" /></a></div><ol className="mk-public-journey"><li><Compass aria-hidden="true" /><div><strong>اكتشف اهتمامك</strong><p>أسئلة اختيارية، بلا درجات أو شروط قبول.</p></div></li><li><BookOpen aria-hidden="true" /><div><strong>اقرأ حكاية المسار</strong><p>تصوّر واضح للرحلة وما تتناوله.</p></div></li><li><Users aria-hidden="true" /><div><strong>تعرّف إلى الصحبة</strong><p>تصميم للمتابعة والمشاركة يحترم الخصوصية.</p></div></li></ol></section>
    <section aria-labelledby="mk-public-discover"><h2 id="mk-public-discover">أبواب الرحلة</h2><div className="mk-grid-3">{marketingRoutes.filter(route => route.group === "public" && route.id !== "overview").map(route => <a className="mk-public-door" href={marketingHref(route.id)} key={route.id}><h3>{route.title}</h3><p>{route.description}</p><span>استكشف <ArrowLeft size={16} aria-hidden="true" /></span></a>)}</div></section>
    <MarketingPanel title="محطات في مساحتك التعليمية"><p className="mk-muted">معاينات لرحلتك كطالب؛ لا تسجل حضورًا أو تصدر شهادة حقيقية.</p><div className="mk-public-links">{(["meeting", "certificate"] as const).map(id => <a className="mk-button-outline" key={id} href={marketingHref(id)}>{id === "meeting" ? "لقاءاتي داخل المركز" : "شهادتي ورمز التحقق"}</a>)}</div></MarketingPanel>
  </div>;
}

function Orientation() {
  const [step, setStep] = useState(0);
  const [interest, setInterest] = useState("");
  const [goal, setGoal] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  function go(next: number) { setStep(next); requestAnimationFrame(() => heading.current?.focus()); }
  function reset() { setInterest(""); setGoal(""); go(0); }
  const track = marketingTracks.find(item => item.id === interest);
  return <div className="mk-grid"><MarketingPanel className="mk-public-advice"><Compass size={36} aria-hidden="true" /><h2>اختيارك بداية للاستكشاف</h2><p>لا إجابات صحيحة أو خاطئة. يمكنك تجاوز أي سؤال أو فتح المسارات مباشرة.</p><MarketingNote>هذا توجيه توضيحي اختياري، وليس اختبار قبول أو شرطًا للتسجيل. لا تُحسب درجات ولا تُحفظ الإجابات.</MarketingNote><a className="mk-button-outline" href={marketingHref("tracks")}>استكشاف المسارات دون أسئلة</a></MarketingPanel>
    <MarketingPanel><p className="mk-public-eyebrow">{step < 2 ? `السؤال ${step + 1} من ٢` : "نقطة بداية توضيحية"}</p><h2 ref={heading} tabIndex={-1}>{step === 0 ? "ما المجال الذي يثير اهتمامك؟" : step === 1 ? "كيف تحب أن تبدأ؟" : "مساحة للتفكير، والاختيار لك"}</h2>
      {step < 2 ? <form noValidate onSubmit={event => { event.preventDefault(); go(step + 1); }}><fieldset className="mk-public-options"><legend className="mk-muted">{step === 0 ? "اختر اهتمامًا، أو تابع دون اختيار." : "اختر هدفًا، أو تابع دون اختيار."}</legend>{(step === 0 ? marketingTracks.map(item => ({ value: item.id, label: item.name })) : [{ value: "explore", label: "التعرّف إلى الموضوعات أولًا" }, { value: "habit", label: "بناء عادة للتعلّم والمراجعة" }, { value: "company", label: "فهم تجربة التعلّم مع صحبة" }]).map(option => <label key={option.value}><input type="radio" name={step === 0 ? "interest" : "goal"} value={option.value} checked={(step === 0 ? interest : goal) === option.value} onChange={() => step === 0 ? setInterest(option.value) : setGoal(option.value)} /><span>{option.label}</span></label>)}</fieldset><div className="mk-public-actions">{step > 0 && <button className="mk-button-outline" type="button" onClick={() => go(step - 1)}>السابق</button>}<button className="mk-button" type="submit">{step === 0 ? "التالي" : "عرض التوجيه التوضيحي"}</button></div></form> : <div className="mk-stack"><SampleLabel /><p>{track ? <>استنادًا إلى اهتمامك، يمكنك قراءة نموذج مسار <strong>{track.name}</strong>.</> : "لم تحدد مجالًا بعينه؛ يمكنك استكشاف نماذج المسارات ومقارنتها بحرية."}</p><p className="mk-muted">{goal === "company" ? "استكشف أيضًا فكرة رفيق العلم للتعرّف إلى تصميم الصحبة الأسبوعية." : goal === "habit" ? "يمكنك البدء بقراءة أهداف الرحلة والتفكير في عادة مراجعة تناسبك." : "اقرأ وصف الرحلة قبل اختيار ما ترغب في تعلّمه."} الاقتراح ليس تقييمًا لمستواك أو توصية مركز معتمدة.</p><a className="mk-button" href={marketingHref("tracks")}>اقرأ نماذج المسارات</a>{goal === "company" && <a href={marketingHref("companions")}>تعرّف إلى رفيق العلم</a>}<div className="mk-public-actions"><button className="mk-button-outline" onClick={() => go(1)}>السابق</button><button className="mk-button-outline" onClick={reset}>ابدأ من جديد</button></div></div>}
    </MarketingPanel></div>;
}

function Tracks() {
  return <div className="mk-stack"><MarketingNote>البطاقات التالية نماذج تحريرية توضيحية؛ ليست قائمة مسارات منشورة أو وصفًا معتمدًا للمناهج. لا يُفرض مستوى سابق للالتحاق.</MarketingNote><div className="mk-grid-3">{marketingTracks.map((track, index) => <article className="mk-panel mk-public-book" key={track.id}><div className="mk-public-book-top"><BookOpen size={30} aria-hidden="true" /><span>نموذج مسار · {index + 1}</span></div><SampleLabel /><h2>{track.name}</h2><p className="mk-muted">{track.audience}</p><h3>قصة الرحلة</h3><p>{track.journey}</p><h3>موضوعات مقترحة للتعريف</h3><ul>{track.outcomes.map(outcome => <li key={outcome}>{outcome}</li>)}</ul><div className="mk-public-video"><Play size={26} aria-hidden="true" /><strong>الفيديو التعريفي غير متاح</strong><p>لم تُضف مادة معتمدة لهذا النموذج بعد. الفيديو التعريفي مطلوب لكل مسار.</p></div></article>)}</div><Link className="mk-button-outline" href="/catalog">افتح الفهرس الفعلي</Link></div>;
}

function Challenges() {
  const [selected, setSelected] = useState(0);
  const themes = [{ name: "وقفة مع آية", detail: "فكرة لمحتوى يساعد على التأمل وتدوين سؤال للمراجعة." }, { name: "نافذة على السيرة", detail: "فكرة لقراءة موضوع من السيرة وربطه بسؤال للتعلّم." }, { name: "دفتر طالب العلم", detail: "فكرة لترتيب الملاحظات وبناء عادة للمراجعة." }];
  return <div className="mk-grid"><MarketingPanel title="جرّب استكشاف الفكرة"><SampleLabel /><p>تصوّر لتحديات مجانية بمحتوى ومدد تحتاج إلى اعتماد. لا يبدأ تحدٍّ فعلي ولا يُنشأ تسجيل أو اشتراك.</p><div className="mk-public-actions">{themes.map((theme, index) => <button key={theme.name} className="mk-button-outline" aria-pressed={selected === index} onClick={() => setSelected(index)}>{theme.name}</button>)}</div></MarketingPanel><MarketingPanel title={themes[selected].name}><Leaf size={32} aria-hidden="true" /><p>{themes[selected].detail}</p><p className="mk-muted">المحتوى والمدة غير معتمدين بعد. الاستكشاف هنا لا يفعّل محتوى أو عملية شراء.</p><a href={marketingHref("tracks")}>بعد الاستكشاف: اقرأ قصة المسارات</a></MarketingPanel></div>;
}

function Companions() {
  return <div className="mk-stack"><MarketingPanel className="mk-public-advice" title="صحبة تعين على مواصلة الطريق"><Users size={36} aria-hidden="true" /><p>تصوّر لمجموعة مرتبطة بالمسار، يصحبها مرشد وتلتقي حول متابعة أسبوعية. الانضمام والعضوية والمرشدون لم يُفعّلوا في هذه المعاينة.</p></MarketingPanel><div className="mk-grid-3">{[{ title: "مساحة للسؤال", text: "فكرة لحوار حول ما يحتاج إلى توضيح، دون نشر رسائل حقيقية." }, { title: "مراجعة أسبوعية", text: "تصوّر لمراجعة التعلّم مع المرشد؛ ليس جدول لقاءات منشورًا." }, { title: "متابعة تحترم الخصوصية", text: "تظهر بيانات التعلّم وفق صلاحيات معتمدة، دون نسب تقدم افتراضية." }].map(item => <MarketingPanel key={item.title} title={item.title}><SampleLabel /><p>{item.text}</p></MarketingPanel>)}</div><a className="mk-button-outline" href={marketingHref("meeting")}>استكشف تصميم اللقاء داخل الموقع</a></div>;
}

function Badges() {
  return <div className="mk-stack"><MarketingNote>هذه قوالب بصرية غير مكتسبة. شروط المنح والمستويات تحتاج إلى اعتماد؛ لا تمثل نقاطًا أو إنجازات لطالب.</MarketingNote><div className="mk-grid-3">{["خطوة التعلّم", "صحبة المراجعة", "أثر المعرفة"].map(name => <MarketingPanel key={name} className="mk-public-badge" title={name}><span className="mk-public-seal"><Sparkles size={32} aria-hidden="true" /></span><SampleLabel /><p>قالب شارة توضيحي</p><span className="mk-pill">لم تُمنح</span></MarketingPanel>)}</div><MarketingPanel title="الاعتراف بالإنجاز يبدأ من سجل حقيقي"><p>لا تُنسب الشارات إلى متعلّم حتى تُعتمد قواعدها ويُسجّل منحها فعليًا.</p><a href={marketingHref("certificate")}>معاينة الشهادة ورمز التحقق</a></MarketingPanel></div>;
}

function Seasons() {
  return <div className="mk-stack"><MarketingPanel className="mk-public-advice" title="الموسم يفتح باب التعريف"><Leaf size={36} aria-hidden="true" /><p>مساحة لحملات تعرّف بالمحتوى في مواسم مختلفة، دون فرض نافذة للتسجيل أو الادعاء بخصم أو عرض محدود.</p></MarketingPanel><div className="mk-grid"><MarketingPanel title="نافذة قرآنية"><SampleLabel /><p>فكرة تحريرية للتعريف بالمحتوى القرآني في موسم مناسب. لا توجد حملة منشورة أو مواعيد معتمدة في هذه المعاينة.</p><a href={marketingHref("tracks")}>استكشف نماذج المسارات</a></MarketingPanel><MarketingPanel title="بداية جديدة للتعلّم"><SampleLabel /><p>فكرة لرسالة موسمية تشجع على استكشاف رحلة العلم. لا تُقيد هذه الرسالة وقت الالتحاق.</p><a href={marketingHref("orientation")}>ابدأ باستكشاف اهتماماتك</a></MarketingPanel></div></div>;
}

function Family() {
  return <div className="mk-stack"><div className="mk-grid"><MarketingPanel title="تعلّم يجمع الأسرة"><HeartHandshake size={34} aria-hidden="true" /><p>تصوّر لمحتوى وأنشطة أسرية مشتركة، دون افتراض باقة مدفوعة أو علاقة وصاية أو مشاركة تلقائية لبيانات التعلّم.</p><SampleLabel /></MarketingPanel><MarketingPanel title="لكل متعلّم خصوصيته"><ShieldCheck size={34} aria-hidden="true" /><p>عرض بيانات أحد أفراد الأسرة يحتاج إلى علاقة موثّقة وصلاحيات معتمدة. وجود القاصرين ضمن الجمهور لا يمنح وصولًا إلى سجلاتهم.</p></MarketingPanel></div><MarketingEmpty title="بيانات الأسرة غير متاحة">لم تُربط علاقات أسرية بهذه المعاينة. لن نعرض أسماء أطفال أو تقدمًا تعليميًا افتراضيًا.</MarketingEmpty><Link className="mk-button-outline" href="/catalog">استكشف المحتوى المتاح في الفهرس</Link></div>;
}

function Scholarships() {
  const [topic, setTopic] = useState("");
  const [draft, setDraft] = useState(false);
  const [error, setError] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  return <div className="mk-grid"><MarketingPanel title="مساحة للفرص التعليمية"><HeartHandshake size={36} aria-hidden="true" /><p>تهدف المنح إلى دعم فرص التعلّم وفق ضوابط أهلية وتمويل وصلاحيات معتمدة. هذه الضوابط غير منشورة في المعاينة.</p><MarketingNote>التقديم الفعلي غير متاح. لا توجد وعود بقبول أو مبلغ تمويل، ولا تُجمع تبرعات هنا.</MarketingNote></MarketingPanel><MarketingPanel title="جرّب تدوين اهتمامك"><p className="mk-muted" id="mk-scholarship-help">مسودة محلية فقط، تزول عند مغادرة الصفحة أو إعادة تحميلها. لا تدخل بيانات شخصية أو مالية.</p><form noValidate onSubmit={event => { event.preventDefault(); if (!topic.trim()) { setError(true); setDraft(false); input.current?.focus(); } else { setError(false); setDraft(true); } }}><label className="mk-field" htmlFor="mk-scholarship-topic">موضوع تعلّم تجريبي<input ref={input} id="mk-scholarship-topic" value={topic} maxLength={160} aria-invalid={error} aria-describedby={`mk-scholarship-help${error ? " mk-scholarship-error" : ""}`} onChange={event => { setTopic(event.target.value); setDraft(false); setError(false); }} /></label>{error && <p id="mk-scholarship-error" role="alert">اكتب موضوعًا تجريبيًا لمعاينة المسودة.</p>}<div className="mk-public-actions"><button className="mk-button" type="submit">معاينة المسودة المحلية</button><button type="button" className="mk-button-outline" onClick={() => { setTopic(""); setDraft(false); setError(false); input.current?.focus(); }}>مسح المسودة</button></div></form>{draft && <div className="mk-note" role="status"><div><strong>مسودة محلية — لم يتم إرسال طلب أو حفظه</strong><p>{topic.trim()}</p><p>لا تحدد هذه المسودة أهليتك ولا تنشئ طلب منحة.</p></div></div>}</MarketingPanel></div>;
}

export function PublicMarketingPage({ page }: { page: PublicMarketingPageId }) {
  switch (page) {
    case "overview": return <Overview />;
    case "orientation": return <Orientation />;
    case "tracks": return <Tracks />;
    case "challenges": return <Challenges />;
    case "stories": return <MarketingEmpty title="بانتظار قصص حقيقية موثّقة">لم تُضف قصص معتمدة للنشر بعد. تُعرض الشهادات الشخصية بعد التحقق من المصدر وموافقة أصحابها، مع احترام سحب الموافقة والخصوصية.</MarketingEmpty>;
    case "companions": return <Companions />;
    case "badges": return <Badges />;
    case "seasons": return <Seasons />;
    case "family": return <Family />;
    case "scholarships": return <Scholarships />;
  }
}
