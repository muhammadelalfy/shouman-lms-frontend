import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Award, Bell, BookOpen, CalendarDays, CheckCircle2, ClipboardCheck, ClipboardList, Compass, FileCheck2, FileText, GraduationCap, Heart, Layers, Lightbulb, LockKeyhole, MessageCircle, ShieldCheck, Sparkles, Star, Target, Trophy, Users, Video } from "lucide-react";
import { DemoDataLabel, EmptyState, ExperienceHeading, PreviewAction, StatusBadge } from "@/features/experience/shared/ui";
import { sampleLearning } from "./fixtures";
import { StudyCard } from "./study-card";
import { LearningList } from "./learning-list";
import { LessonWorkspace } from "./lesson-workspace";
import { QuizWorkspace } from "./quiz-workspace";
import { NotificationInbox, PreviewPreferences, ProjectFilePicker } from "./learner-controls";
import "./learner.css";

function Dashboard() {
  return <div className="xp-stack learner-page">
    <ExperienceHeading eyebrow="مساحتك في الأكاديمية" title="خطوة جديدة في رحلة التعلّم" description="تابع دروسك، ورتّب أولوياتك، وارجع إلى ما بدأت. هذه مساحة شخصية ببيانات توضيحية فقط." action={<Link className="xp-button xp-button-outline" href="/my-learning">كل أمثلة تعلّمي<ArrowLeft size={17} aria-hidden="true" />
    </Link>} />
    <section className="learner-welcome">
      <div className="learner-welcome-copy">
        <span className="learner-eyebrow">موعدك مع العلم</span>
        <h2>من المعرفة<br />إلى أثر في الحياة.</h2>
        <p>دروس قصيرة، ومعانٍ تستحق التوقف عندها، ورحلة تسير فيها على مهل.</p>
        <Link href="/learning/lessons/demo-lesson" className="xp-button">واصل إلى نموذج الدرس<ArrowLeft size={18} aria-hidden="true" />
        </Link>
        <small>نقطة متابعة تجريبية؛ لا تمثل تقدم حساب فعلي.</small>
      </div>
      <div className="learner-welcome-art">
        <Image src="/images/lovable/t1.jpg" alt="" fill sizes="(max-width: 760px) 0px, 430px" />
        <div className="learner-welcome-label">
          <BookOpen size={22} aria-hidden="true" />
          <span>رحلة التأسيس الإيماني<small>المادة الأولى · نموذج</small>
          </span>
        </div>
      </div>
    </section>
    <div className="xp-grid xp-grid-3 learner-stat-grid">{[{ icon: BookOpen, value: "٢", label: "رحلات قيد التعلم — مثال" }, { icon: CheckCircle2, value: "١", label: "رحلة مكتملة — مثال" }, { icon: Award, value: "١", label: "تصميم شهادة تجريبية" }].map(({ icon: Icon, value, label }) => <article className="xp-card learner-stat" key={label}>
      <span className="learner-icon-tile">
        <Icon size={23} aria-hidden="true" />
      </span>
      <div>
        <strong>{value}</strong>
        <p>{label}</p>
      </div>
    </article>)}</div>
    <div className="learner-dashboard-columns">
      <section className="xp-stack">
        <div className="learner-section-heading">
          <h2>أكمل رحلتك</h2>
          <Link href="/my-learning">عرض الكل<ArrowLeft size={15} aria-hidden="true" />
          </Link>
        </div>
        <div className="xp-grid xp-grid-2">{sampleLearning.slice(0, 2).map((item) => <StudyCard key={item.id} item={item} />)}</div>
        <section className="xp-card">
          <div className="learner-panel-heading">
            <h2>محطاتك الأخيرة — نموذج</h2>
            <Compass size={21} aria-hidden="true" />
          </div>
          <ul className="learner-activity-list">
            <li>
              <BookOpen size={19} aria-hidden="true" />
              <div>
                <strong>مساحة لمتابعة درس</strong>
                <p>آخر درس وتجربة المراجعة تظهر هنا بعد ربط الخدمة.</p>
              </div>
            </li>
            <li>
              <FileText size={19} aria-hidden="true" />
              <div>
                <strong>مساحة لملاحظاتك</strong>
                <p>جرّب كتابة ملاحظة مؤقتة داخل واجهة الدرس.</p>
              </div>
            </li>
            <li>
              <MessageCircle size={19} aria-hidden="true" />
              <div>
                <strong>مساحة لتفاعل المجموعة</strong>
                <p>استعرض نموذج نقاش تعليمي دون إرسال.</p>
              </div>
            </li>
          </ul>
        </section>
      </section>
      <aside className="xp-stack">
        <section className="xp-card learner-meeting-card">
          <div className="learner-panel-heading">
            <span className="learner-icon-tile">
              <CalendarDays size={22} aria-hidden="true" />
            </span>
            <StatusBadge>موعد توضيحي</StatusBadge>
          </div>
          <h2>مجلس الأسئلة والتأمل</h2>
          <p className="xp-muted">هنا ستظهر لقاءاتك المقبلة عند توفير خدمة الجدول.</p>
          <dl>
            <div>
              <dt>الموعد</dt>
              <dd>غير محدد في المعاينة</dd>
            </div>
            <div>
              <dt>الفئة</dt>
              <dd>مجموعة تعليمية تجريبية</dd>
            </div>
          </dl>
          <Link href="/meetings/mine" className="xp-button xp-button-outline">استعرض أمثلة اللقاءات</Link>
        </section>
        <section className="learner-quiet-note">
          <Lightbulb size={27} aria-hidden="true" />
          <h2>مساحة صغيرة للمراجعة</h2>
          <p>اختر فكرة واحدة من آخر قراءة، واكتب السؤال الذي تريد فهمه أكثر.</p>
          <Link href="/learning/lessons/demo-lesson">افتح ملاحظات الدرس<ArrowLeft size={16} aria-hidden="true" />
          </Link>
        </section>
        <section className="xp-card">
          <h2>إلى أين تذهب الآن؟</h2>
          <nav className="learner-shortcuts" aria-label="اختصارات المتعلم">
            <Link href="/quizzes">
              <ClipboardList size={20} aria-hidden="true" />الاختبارات<ArrowLeft size={16} aria-hidden="true" />
            </Link>
            <Link href="/projects">
              <Layers size={20} aria-hidden="true" />المشروعات<ArrowLeft size={16} aria-hidden="true" />
            </Link>
            <Link href="/notifications">
              <Bell size={20} aria-hidden="true" />التنبيهات<ArrowLeft size={16} aria-hidden="true" />
            </Link>
          </nav>
        </section>
      </aside>
    </div>
    <details className="xp-card learner-dashboard-empty">
      <summary>استعرض شكل البداية دون تسجيلات — نموذج</summary>
      <EmptyState title="ابدأ رحلتك التعليمية" description="اختر ما يناسبك من المسارات المنشورة. هذا مثال لحالة لوحة متعلّم جديد، ولا يفحص تسجيلات حسابك." href="/tracks" actionLabel="اختر مسارك الأول" />
    </details>
  </div>;
}

function MyLearning() {
  return <div className="xp-stack learner-page">
    <ExperienceHeading eyebrow="خطوة تتبعها خطوة" title="تعلّمي" description="اجمع مساراتك ودوراتك في مكان واحد، وجرّب تصفية أمثلة التعلم بحسب حالتها." action={<Link className="xp-button xp-button-outline" href="/catalog">استكشف الكتالوج الحقيقي</Link>} />
    <LearningList />
    <section className="learner-quiet-note learner-inline-note">
      <Compass size={25} aria-hidden="true" />
      <div>
        <h2>أين تبدأ رحلتك القادمة؟</h2>
        <p>الكتالوج يعرض المحتوى المنشور من الخدمة؛ أمثلة هذه الصفحة لا تمثل تسجيلات فعلية.</p>
      </div>
      <Link className="xp-button xp-button-outline" href="/tracks">تصفّح المسارات</Link>
    </section>
  </div>;
}

function Quizzes() {
  return <div className="xp-stack learner-page">
    <ExperienceHeading eyebrow="التأمل ثم المراجعة" title="الاختبارات والمراجعات" description="مساحة لتجميع اختبارات المسارات والعودة إلى المراجعة. الحالات والأسئلة هنا توضيحية ولا تمثل محاولات فعلية." />
    <section className="learner-feature-banner">
      <ClipboardList size={40} aria-hidden="true" />
      <div>
        <h2>اختبر سهولة التجربة</h2>
        <p>اختر إجابات، وتنقّل بين الأسئلة، وراجع اختياراتك دون احتساب درجة.</p>
      </div>
      <Link className="xp-button" href="/quizzes/demo-quiz">افتح نموذج الأسئلة<ArrowLeft size={17} aria-hidden="true" />
      </Link>
    </section>
    <div className="xp-grid xp-grid-2">{[{ title: "مراجعة رحلة التأسيس", description: "نموذج أسئلة قصيرة لتجربة الاختيار والمراجعة.", state: "نموذج متاح للعرض", icon: BookOpen, href: "/quizzes/demo-quiz" }, { title: "ملخص تجربة الاختبار", description: "شكل عرض صفحة الملخص دون نجاح أو رسوب أو فتح محتوى.", state: "معاينة صفحة الملخص", icon: FileCheck2, href: "/quizzes/demo-quiz/result" }].map(({ title, description, state, icon: Icon, href }) => <article className="xp-card xp-stack" key={title}>
      <div className="xp-row">
        <span className="learner-icon-tile">
          <Icon size={25} aria-hidden="true" />
        </span>
        <StatusBadge tone="info">{state}</StatusBadge>
      </div>
      <h2>{title}</h2>
      <p className="xp-muted">{description}</p>
      <dl className="learner-detail-lines">
        <div>
          <dt>المدة والمحاولات</dt>
          <dd>لم تُعتمد سياسة بعد</dd>
        </div>
        <div>
          <dt>التقييم</dt>
          <dd>غير متصل في المعاينة</dd>
        </div>
      </dl>
      <Link className="learner-card-link" href={href}>استعرض الواجهة<ArrowLeft size={17} aria-hidden="true" />
      </Link>
    </article>)}</div>
    <p className="xp-muted learner-small">لن تُستنتج درجة نجاح أو عدد محاولات أو شروط إعادة من هذه الأمثلة.</p>
  </div>;
}

function QuizResult() {
  return <div className="xp-stack learner-page">
    <ExperienceHeading eyebrow="صفحة ملخص تجريبية" title="مساحة لمراجعة التجربة" description="هذا نموذج مستقل لعرض ملخص اختبار. لا يسترجع إجاباتك المؤقتة ولا يمثّل نتيجة تقييم." />
    <section className="learner-result-hero">
      <ClipboardCheck size={48} aria-hidden="true" />
      <h2>رحلة المراجعة تبدأ من الفهم</h2>
      <p>تظهر هنا نتائج الخدمة عند ربطها واعتماد سياسة الاختبار. المعاينة لا تمنح درجة أو نجاحًا أو صلاحية انتقال.</p>
      <StatusBadge tone="info">لا توجد محاولة مسجلة</StatusBadge>
    </section>
    <div className="xp-grid xp-grid-3">{[{ title: "الدرجة", value: "غير محتسبة" }, { title: "حالة الاختبار", value: "نموذج عرض" }, { title: "فتح المحتوى", value: "لم يتغير" }].map((item) => <article className="xp-card learner-result-stat" key={item.title}>
      <p className="xp-muted">{item.title}</p>
      <strong>{item.value}</strong>
    </article>)}</div>
    <section className="xp-card xp-stack">
      <h2>ماذا بعد المراجعة؟</h2>
      <div className="xp-grid xp-grid-2">
        <div className="learner-review-guidance">
          <BookOpen size={23} aria-hidden="true" />
          <h3>ارجع إلى الفكرة الأساسية</h3>
          <p className="xp-muted">افتح نموذج الدرس وجرّب مساحة التلخيص والملاحظات.</p>
          <Link href="/learning/lessons/demo-lesson" className="learner-card-link">العودة إلى الدرس<ArrowLeft size={17} aria-hidden="true" />
          </Link>
        </div>
        <div className="learner-review-guidance">
          <RotateIcon />
          <h3>جرّب التنقل بين الأسئلة</h3>
          <p className="xp-muted">ابدأ نموذجًا محليًا جديدًا؛ لا تُحتسب محاولة إعادة.</p>
          <Link href="/quizzes/demo-quiz" className="learner-card-link">افتح النموذج<ArrowLeft size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  </div>;
}

function RotateIcon() { return <Compass size={23} aria-hidden="true" />; }

function Certificates({ detail }: { detail: boolean }) {
  return <div className="xp-stack learner-page">
    <ExperienceHeading eyebrow="أثر رحلتك" title={detail ? "نموذج الشهادة" : "شهاداتي"} description="تصميم توضيحي للشهادة وسجلها. لا توجد شهادة صادرة، ولا أهلية أو إثبات إتمام أو رقم تحقق حقيقي." action={detail ? <Link className="xp-button xp-button-outline" href="/certificates">العودة إلى نماذج الشهادات</Link> : undefined} />{detail ? <div className="learner-certificate-layout">
      <section className="learner-certificate" aria-label="شهادة تجريبية غير صالحة للاستخدام">
        <div className="learner-certificate-watermark" aria-hidden="true">نموذج غير صالح</div>
        <div className="learner-certificate-content">
          <span className="learner-certificate-brand">
            <GraduationCap size={38} aria-hidden="true" />أكاديمية د. حازم شومان</span>
          <DemoDataLabel />
          <h2>نموذج شهادة تعلّم</h2>
          <p>صُمّم هذا المثال لعرض اسم المتعلّم</p>
          <strong>اسم تجريبي للعرض فقط</strong>
          <p>ومساحة لعنوان المسار</p>
          <h3>رحلة التأسيس الإيماني — نموذج</h3>
          <div className="learner-certificate-footer">
            <span>لا يوجد تاريخ إصدار<br />لا يوجد توقيع معتمد</span>
            <Award size={46} aria-hidden="true" />
            <span>نسخة تصميم تجريبية<br />ليست وثيقة إثبات</span>
          </div>
          <b className="learner-certificate-warning">معاينة فقط · لم تُصدر هذه الشهادة</b>
        </div>
      </section>
      <aside className="xp-stack">
        <section className="xp-card xp-stack">
          <h2>بيانات النموذج</h2>
          <dl className="learner-detail-lines">
            <div>
              <dt>الحالة</dt>
              <dd>تصميم تجريبي</dd>
            </div>
            <div>
              <dt>رقم الشهادة</dt>
              <dd>غير صادر</dd>
            </div>
            <div>
              <dt>الأهلية</dt>
              <dd>لم تُفحص</dd>
            </div>
          </dl>
          <div className="learner-no-qr">
            <ShieldCheck size={30} aria-hidden="true" />
            <strong>لا يوجد رمز تحقق</strong>
            <p>لا يمكن استخدام هذا النموذج للتحقق من شهادة.</p>
          </div>
          <PreviewAction title="تنزيل الشهادات غير متصل" description="لم يتم تنزيل أو إصدار أي شهادة. ملفات الشهادات تتطلب خدمة وشروط إصدار معتمدة.">معلومات التنزيل</PreviewAction>
        </section>
        <Link href="/verify" className="xp-button xp-button-outline">استعرض واجهة التحقق</Link>
      </aside>
    </div> : <div className="xp-grid xp-grid-2">
      <article className="xp-card learner-certificate-card">
        <div className="learner-certificate-mini">
          <Award size={52} aria-hidden="true" />
          <strong>شهادة تعلّم</strong>
          <span>نموذج مرئي غير صادر</span>
          <b>معاينة</b>
        </div>
        <div className="xp-stack">
          <StatusBadge tone="info">تصميم توضيحي</StatusBadge>
          <h2>رحلة التأسيس الإيماني</h2>
          <p className="xp-muted">تعرّف على شكل العرض ومواضع البيانات دون وجود وثيقة صادرة.</p>
          <Link className="xp-button xp-button-outline" href="/certificates/demo-certificate">افتح نموذج الشهادة</Link>
        </div>
      </article>
      <section className="learner-quiet-note learner-certificate-explainer">
        <ShieldCheck size={34} aria-hidden="true" />
        <h2>لكل شهادة دليلها</h2>
        <p>عند تفعيل الخدمة، تُظهر الشهادة بياناتها المعتمدة وتفاصيل التحقق المتاحة وفق السياسة. شروط الإصدار لم تُعتمد في هذه المعاينة.</p>
        <Link href="/verify">تعرّف على واجهة التحقق<ArrowLeft size={17} aria-hidden="true" />
        </Link>
      </section>
    </div>}</div>;
}

function Projects({ detail }: { detail: boolean }) {
  return <div className="xp-stack learner-page">
    <ExperienceHeading eyebrow="من الفكرة إلى التطبيق" title={detail ? "مشروع التأمل والتلخيص" : "مشروعاتي"} description="مساحة لتوضيح تعليمات المشروع، واختيار الملفات محليًا، ومراحل المراجعة. لا تُرسل مشاريع ولا يعمل تقييم آلي." action={detail ? <Link className="xp-button xp-button-outline" href="/projects">كل نماذج المشروعات</Link> : undefined} />{detail ? <div className="learner-project-layout">
      <div className="xp-stack">
        <section className="xp-card learner-reading-copy">
          <StatusBadge tone="info">تعليمات توضيحية</StatusBadge>
          <h2>ابنِ ملخصًا يعكس فهمك</h2>
          <p>يعرض هذا المثال كيف يمكن ترتيب تعليمات مشروع تعليمي. الموضوع والموعد والصيغة ومعايير التقييم تعتمدها الأكاديمية عند توفير الخدمة.</p>
          <h3>محتويات نموذج المشروع</h3>
          <ol>
            <li>مساحة لعنوان الفكرة أو السؤال.</li>
            <li>مساحة لعرض الأفكار والمصادر.</li>
            <li>مساحة للخلاصة والتأمل الشخصي.</li>
          </ol>
          <p className="learner-outline-note">لا توجد مدة تسليم أو أوزان تقييم مفترضة في هذا النموذج.</p>
        </section>
        <ProjectFilePicker />
        <section className="xp-card learner-advisory">
          <span className="learner-icon-tile">
            <Sparkles size={24} aria-hidden="true" />
          </span>
          <div>
            <h2>المساعدة الآلية استشارية</h2>
            <p>هذا موضع توضيحي لعرض اقتراحات مساندة مستقبلًا. لم يُحلل ملف ولم تُنتج ملاحظات آلية. قرار التقييم يبقى للمقيّم البشري ضمن المعايير المعتمدة.</p>
          </div>
        </section>
      </div>
      <aside className="xp-stack">
        <section className="xp-card">
          <h2>رحلة المشروع — نموذج</h2>
          <ol className="learner-project-timeline">{[{ title: "قراءة التعليمات", text: "عرض المتطلبات المعتمدة عند توفرها" }, { title: "إعداد المسودة", text: "اختيار ملفات محلي للتجربة فقط" }, { title: "مراجعة بشرية", text: "لا يوجد مشروع مسلّم أو مقيّم معين" }, { title: "نتيجة المقيّم", text: "لم يصدر تقييم أو اعتماد" }].map((stage, index) => <li key={stage.title}>
            <span>{index + 1}</span>
            <div>
              <h3>{stage.title}</h3>
              <p>{stage.text}</p>
            </div>
          </li>)}</ol>
        </section>
        <section className="learner-quiet-note">
          <Target size={26} aria-hidden="true" />
          <h2>معايير واضحة قبل التقييم</h2>
          <p>معيار التصحيح وأوزانه يحتاجان اعتمادًا. لا توجد درجة تقديرية أو حكم آلي في هذه الصفحة.</p>
        </section>
      </aside>
    </div> : <>
      <section className="learner-feature-banner">
        <Layers size={39} aria-hidden="true" />
        <div>
          <h2>مساحة لتطبيق ما تعلّمته</h2>
          <p>شاهد كيف تجتمع التعليمات والمسودة والمراجعة في تجربة واحدة.</p>
        </div>
      </section>
      <div className="xp-grid xp-grid-2">
        <article className="xp-card xp-stack">
          <div className="xp-row">
            <span className="learner-icon-tile">
              <FileText size={25} aria-hidden="true" />
            </span>
            <StatusBadge>مشروع تجريبي</StatusBadge>
          </div>
          <h2>مشروع التأمل والتلخيص</h2>
          <p className="xp-muted">نموذج لعرض تكليف وتعليمات ومساحة ملفات، دون رفع أو تسليم.</p>
          <dl className="learner-detail-lines">
            <div>
              <dt>الموعد النهائي</dt>
              <dd>غير محدد في المعاينة</dd>
            </div>
            <div>
              <dt>التقييم</dt>
              <dd>لا يوجد تقييم فعلي</dd>
            </div>
          </dl>
          <Link href="/projects/demo-project" className="xp-button">استعرض المشروع<ArrowLeft size={17} aria-hidden="true" />
          </Link>
        </article>
        <section className="learner-quiet-note">
          <Users size={31} aria-hidden="true" />
          <h2>مراجعة تعينك على التعلّم</h2>
          <p>تُعرض هنا الملاحظات البشرية عندما تتصل الخدمة. لا توجد طلبات مراجعة حقيقية في هذه الأمثلة.</p>
          <Link href="/evaluator">استعرض مساحة المقيّم<ArrowLeft size={17} aria-hidden="true" />
          </Link>
        </section>
      </div>
    </>}</div>;
}

function Achievements() {
  const badges = [{ title: "بداية الرحلة", text: "نموذج لشارة بداية التعلّم", icon: Compass, locked: false }, { title: "قارئ متأمل", text: "نموذج لشارة الاهتمام بالقراءة", icon: BookOpen, locked: false }, { title: "رفيق المعرفة", text: "نموذج لشارة تعاون", icon: Heart, locked: false }, { title: "باحث عن المعنى", text: "نموذج حالة غير متاحة", icon: Lightbulb, locked: true }, { title: "أثر التعلم", text: "نموذج حالة غير متاحة", icon: Star, locked: true }, { title: "رحلة ممتدة", text: "نموذج حالة غير متاحة", icon: Trophy, locked: true }];
  return <div className="xp-stack learner-page">
    <ExperienceHeading eyebrow="احتفِ بالخطوات الصغيرة" title="الشارات والإنجازات" description="معرض تجريبي لأشكال الشارات وحالاتها. هذه الشارات لم تُمنح لأي حساب، ومعايير منحها لم تُعتمد بعد." />
    <section className="learner-achievement-banner">
      <Award size={47} aria-hidden="true" />
      <div>
        <h2>كل خطوة تحمل معنى</h2>
        <p>نعرض اختلاف المظهر بين الشارة الظاهرة وغير المتاحة دون افتراض نقاط أو شروط استحقاق.</p>
      </div>
    </section>
    <div className="xp-grid xp-grid-3 learner-badge-grid">{badges.map(({ title, text, icon: Icon, locked }) => <article className={`xp-card learner-badge ${locked ? "is-muted" : ""}`} key={title}>
      <span className="learner-medallion">
        <Icon size={38} aria-hidden="true" />{locked && <LockKeyhole size={15} className="learner-badge-lock" aria-hidden="true" />}</span>
      <h2>{title}</h2>
      <p className="xp-muted">{text}</p>
      <StatusBadge tone={locked ? "neutral" : "info"}>{locked ? "مظهر غير متاح — مثال" : "مظهر ظاهر — مثال"}</StatusBadge>
    </article>)}</div>
    <section className="learner-quiet-note">
      <h2>عن الشارات في هذه المعاينة</h2>
      <p>لا تمثل الشارات إتمامًا أو تميزًا أو مكافأة. تظهر قواعدها الحقيقية عندما تعتمدها الأكاديمية وتتصل خدمة الإنجازات.</p>
    </section>
  </div>;
}

function Orders() {
  return <div className="xp-stack learner-page">
    <ExperienceHeading eyebrow="سجل واضح لمعاملاتك" title="الطلبات والمشتريات" description="تصميم سجل الطلبات مع بيانات توضيحية. لم تُنشأ طلبات، ولم يتم دفع أو خصم أي مبلغ." />
    <section className="xp-card">
      <div className="learner-panel-heading">
        <h2>نموذج سجل الطلبات</h2>
        <StatusBadge>قراءة توضيحية فقط</StatusBadge>
      </div>
      <div className="xp-table-wrap">
        <table className="learner-orders-table">
          <caption className="learner-sr-only">طلبات تجريبية لا تمثل معاملات فعلية</caption>
          <thead>
            <tr>
              <th scope="col">المرجع</th>
              <th scope="col">المحتوى</th>
              <th scope="col">المبلغ</th>
              <th scope="col">الحالة</th>
              <th scope="col">التفاصيل</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span dir="ltr">DEMO-ORDER</span>
              </td>
              <td>مدخل إلى مهارات البحث — مثال</td>
              <td>غير محدد</td>
              <td>
                <StatusBadge tone="info">غير منشأ</StatusBadge>
              </td>
              <td>
                <Link href="/checkout/demo-course">معاينة مسار الطلب</Link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    <div className="xp-grid xp-grid-2">
      <section className="learner-quiet-note">
        <ShieldCheck size={29} aria-hidden="true" />
        <h2>لا توجد معاملة مالية</h2>
        <p>لا مزود دفع متصل، ولا إيصال أو عملية استرداد. خيارات الدفع تنتظر اعتمادًا وخدمة آمنة.</p>
      </section>
      <section className="xp-card xp-stack">
        <h2>تبحث عن دورة؟</h2>
        <p className="xp-muted">الكتالوج يعرض الأسعار والمحتوى اللذين تعيدهما الخدمة فقط.</p>
        <Link className="xp-button xp-button-outline" href="/courses">تصفح الدورات المنشورة<ArrowLeft size={17} aria-hidden="true" />
        </Link>
      </section>
    </div>
  </div>;
}

function AccountPreview() {
  return <div className="xp-stack learner-page">
    <ExperienceHeading eyebrow="مساحتك الشخصية" title="معاينة الحساب والتفضيلات" description="تجربة شكل الحساب بتفضيلات محلية. لتعديل بيانات حسابك الحقيقي استخدم صفحة الحساب المتصلة بالخدمة." action={<Link className="xp-button xp-button-outline" href="/account">افتح حسابك الفعلي</Link>} />
    <div className="xp-grid xp-grid-2">
      <section className="xp-card learner-profile-card">
        <span className="learner-profile-avatar">
          <GraduationCap size={46} aria-hidden="true" />
        </span>
        <h2>متعلّم تجريبي</h2>
        <StatusBadge tone="info">لا توجد بيانات شخصية</StatusBadge>
        <p className="xp-muted">نموذج لمساحة الملف الشخصي، دون اسم أو بريد أو بيانات حساب فعلية.</p>
        <dl className="learner-detail-lines">
          <div>
            <dt>الدور المعروض</dt>
            <dd>طالب — نموذج واجهة</dd>
          </div>
          <div>
            <dt>اللغة الحالية</dt>
            <dd>العربية</dd>
          </div>
          <div>
            <dt>الحفظ</dt>
            <dd>غير متصل في المعاينة</dd>
          </div>
        </dl>
      </section>
      <PreviewPreferences />
    </div>
  </div>;
}

type StaffRole = "instructor" | "supervisor" | "evaluator";
const roleWorkspaces = {
  instructor: { title: "مساحة المعلّم", eyebrow: "محتوى يصنع أثرًا", description: "رتّب المحتوى، وراجع أسئلة المتعلمين، وحضّر لقاءاتك. كل البطاقات أمثلة دون صلاحيات أو عمليات تدريس فعلية.", icon: BookOpen, headline: "حضّر درسًا واضح الفكرة", summary: "ابدأ بمراجعة بنية المادة، ثم مصادر الدرس، ثم الأسئلة التي تساعد على الفهم.", tasks: [{ title: "محتوى المادة", text: "معاينة ترتيب المواد والدروس دون تعديل أو نشر.", href: "/preview/admin/offerings", icon: Layers }, { title: "اللقاءات التعليمية", text: "مساحة لتخطيط اللقاء ومصادره دون جدولة فعلية.", href: "/meetings", icon: Video }, { title: "مناقشات المتعلمين", text: "استعرض مثالًا على سؤال ونقاش داخل مجموعة.", href: "/community", icon: MessageCircle }] },
  supervisor: { title: "مساحة المشرف", eyebrow: "صحبة تعين على الاستمرار", description: "شاهد بنية متابعة المجموعات واللقاءات والأسئلة. لا توجد سجلات طلاب أو حضور أو رسائل حقيقية.", icon: Users, headline: "تابع المجموعة بوضوح ورفق", summary: "تجمع هذه المساحة نقاط المتابعة والمناقشات واللقاءات دون استنتاج تعثر أو تقييم أي متعلّم.", tasks: [{ title: "مجموعات التعلم", text: "استعرض شكل قائمة المجموعة والنقاشات التجريبية.", href: "/community", icon: Users }, { title: "تنبيهات المتابعة", text: "معاينة لصندوق تنبيهات دون إرسال أو متابعة فعلية.", href: "/notifications", icon: Bell }, { title: "سجل اللقاءات", text: "عرض نموذج اللقاء دون إثبات حضور أو رابط انضمام.", href: "/meetings/mine", icon: CalendarDays }] },
  evaluator: { title: "مساحة المقيّم", eyebrow: "مراجعة بشرية مسؤولة", description: "استعرض تعليمات المشروع ومساحة المعايير وملاحظات المراجعة. لا توجد ملفات مسلّمة أو نتيجة تقييم أو توصية آلية.", icon: ClipboardCheck, headline: "المعيار أولًا، ثم المراجعة", summary: "تعريف المعايير وأوزانها يحتاج اعتمادًا. المساعدة الآلية عند توفرها تبقى استشارية، ولا تتخذ قرار المقيّم.", tasks: [{ title: "نموذج المشروع", text: "راجع تسلسل التعليمات والملفات والمراحل دون تقييم.", href: "/projects/demo-project", icon: FileText }, { title: "قائمة المراجعة", text: "واجهة طابور مشاريع تجريبي؛ لا توجد تكليفات فعلية.", href: "/preview/admin/projects", icon: ClipboardList }, { title: "معايير التصحيح", text: "معاينة لبنية المعيار؛ لا أوزان أو حدود نجاح مفترضة.", href: "/preview/admin/rubrics", icon: Target }] },
} as const;

function RoleWorkspace({ role }: { role: StaffRole }) {
  const workspace = roleWorkspaces[role];
  const Icon = workspace.icon;
  return <div className="xp-stack learner-page">
    <ExperienceHeading eyebrow={workspace.eyebrow} title={workspace.title} description={workspace.description} />
    <section className="learner-role-hero">
      <span className="learner-role-emblem">
        <Icon size={45} aria-hidden="true" />
      </span>
      <div>
        <StatusBadge tone="info">معاينة دور — دون منح صلاحيات</StatusBadge>
        <h2>{workspace.headline}</h2>
        <p>{workspace.summary}</p>
      </div>
    </section>
    <div className="xp-grid xp-grid-3">{workspace.tasks.map(({ title, text, href, icon: TaskIcon }) => <article className="xp-card xp-stack" key={title}>
      <span className="learner-icon-tile">
        <TaskIcon size={25} aria-hidden="true" />
      </span>
      <h2>{title}</h2>
      <p className="xp-muted">{text}</p>
      <Link href={href} className="learner-card-link">استعرض المساحة<ArrowLeft size={17} aria-hidden="true" />
      </Link>
    </article>)}</div>
    <div className="xp-grid xp-grid-2">
      <section className="xp-card">
        <h2>قائمة عمل توضيحية</h2>
        <ul className="learner-work-list">
          <li>
            <CheckCircle2 size={19} aria-hidden="true" />
            <span>قراءة سياق المهمة ومصادرها</span>
          </li>
          <li>
            <CheckCircle2 size={19} aria-hidden="true" />
            <span>مراجعة التعليمات والسياسة المعتمدة</span>
          </li>
          <li>
            <CheckCircle2 size={19} aria-hidden="true" />
            <span>تدوين الملاحظات في الخدمة عند تفعيلها</span>
          </li>
        </ul>
      </section>
      <section className="learner-quiet-note">
        <ShieldCheck size={25} aria-hidden="true" />
        <h2>الصلاحيات مسؤولية الخدمة</h2>
        <p>فتح هذه المعاينة لا يمنح دورًا ولا يكشف بيانات. الوصول الفعلي يحتاج جلسة صالحة وصلاحية يقرّها الخادم.</p>
      </section>
    </div>
  </div>;
}

export function LearnerExperience({ path }: { path: string[] }) {
  const route = path[0];
  if (route === "dashboard") return <Dashboard />;
  if (route === "learn" || (route === "learning" && path.length > 1)) return <LessonWorkspace />;
  if (route === "learning" || route === "my-learning") return <MyLearning />;
  if (route === "quizzes") {
    if (path[2] === "result") return <QuizResult />;
    if (path.length > 1) return <div className="xp-stack learner-page">
      <ExperienceHeading eyebrow="مراجعة تجريبية" title="مراجعة رحلة التأسيس" description="اختيارات مؤقتة دون إرسال أو تصحيح أو احتساب محاولة." />
      <QuizWorkspace />
    </div>;
    return <Quizzes />;
  }
  if (route === "certificates") return <Certificates detail={path.length > 1} />;
  if (route === "projects") return <Projects detail={path.length > 1} />;
  if (route === "notifications") return <div className="xp-stack learner-page">
    <ExperienceHeading eyebrow="كل ما يهم رحلتك" title="التنبيهات" description="نموذج صندوق تنبيهات مصنّف. علامات القراءة مؤقتة، ولا تمثل إشعارات مرسلة إلى حسابك." />
    <NotificationInbox />
  </div>;
  if (route === "achievements") return <Achievements />;
  if (route === "orders") return <Orders />;
  if (route === "preview" && path[1] === "account") return <AccountPreview />;
  if (route === "instructor" || route === "supervisor" || route === "evaluator") return <RoleWorkspace role={route} />;
  return null;
}
