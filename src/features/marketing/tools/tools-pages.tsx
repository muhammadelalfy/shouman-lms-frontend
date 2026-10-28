'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { toDataURL } from 'qrcode';
import { BookOpen, Video, ShieldCheck, Users, QrCode } from 'lucide-react';
import { marketingStudents, marketingTracks } from '../fixtures';
import type { ToolsMarketingPageId } from '../routes';
import { MarketingPanel, MarketingNote, SampleLabel, marketingHref } from '../shared';
import { isSafeIntroVideo, selectAudience, type AudienceFilter, type AudienceMode } from './audience';
import './tools.css';

export function MarketingToolsPage({ page }: { page: ToolsMarketingPageId }) {
  if (page === 'track-editor') return <TrackEditor />;
  if (page === 'notifications') return <NotificationComposer />;
  if (page === 'meeting') return <MeetingRoom />;
  if (page === 'verify') return <VerificationSample />;
  return <CertificateSample />;
}

function TrackEditor() {
  const [draft, setDraft] = useState({ title: '', audience: '', outcomes: '', duration: '', video: '', priorLevel: '', assessment: '', certificate: '', meeting: '', result: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [reviewed, setReviewed] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const fields = [ ['title', 'اسم المسار'], ['audience', 'لمن هذا المسار؟'], ['duration', 'وصف المدة'], ['video', 'رابط الفيديو التعريفي'], ['priorLevel', 'المستوى السابق — للتوجيه فقط'], ['assessment', 'وصف التقييم المقترح'], ['certificate', 'وصف الشهادة المقترحة'], ['meeting', 'وصف اللقاءات المقترحة'], ['result', 'النتيجة المقصودة من الرحلة'] ] as const;
  function submit(event: FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!draft.title.trim()) next.title = 'أضف اسم المسار.';
    if (!draft.audience.trim()) next.audience = 'حدد الجمهور المقصود.';
    if (!draft.outcomes.trim()) next.outcomes = 'أضف مخرجًا تعليميًا واحدًا على الأقل.';
    if (!draft.duration.trim()) next.duration = 'أضف وصف المدة للمعاينة.';
    if (!isSafeIntroVideo(draft.video)) next.video = 'أضف رابط HTTPS لفيديو على YouTube أو Vimeo؛ لا تُدخل كود تضمين.';
    setErrors(next); setReviewed(false);
    if (Object.keys(next).length) { form.current?.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus(); return; }
    setReviewed(true);
  }
  return <div className="mk-grid"><MarketingPanel title="تحرير المحتوى" description="مسودة داخل هذه الصفحة فقط. إدارة المسارات الفعلية تحتاج خدمة نشر معتمدة."><form ref={form} onSubmit={submit} noValidate className="mk-stack">
    {fields.map(([key, label]) => <label className="mk-field" key={key} htmlFor={`track-${key}`}><span id={`label-${key}`}>{label}</span><input aria-labelledby={`label-${key}`} id={`track-${key}`} name={key} type={key === 'video' ? 'url' : 'text'} dir={key === 'video' ? 'ltr' : undefined} value={draft[key]} maxLength={key === 'video' ? 1500 : 200} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `error-${key}` : undefined} onChange={e => { setDraft({ ...draft, [key]: e.target.value }); setReviewed(false); }} />{errors[key] && <span className="mk-tools-error" id={`error-${key}`}>{errors[key]}</span>}</label>)}
    <label className="mk-field" htmlFor="track-outcomes"><span id="label-outcomes">ماذا سيتعلم الطالب؟</span><textarea aria-labelledby="label-outcomes" id="track-outcomes" name="outcomes" rows={4} maxLength={2000} placeholder="كل مخرج في سطر مستقل" value={draft.outcomes} aria-invalid={!!errors.outcomes} aria-describedby={errors.outcomes ? 'error-outcomes' : undefined} onChange={e => { setDraft({ ...draft, outcomes: e.target.value }); setReviewed(false); }} />{errors.outcomes && <span className="mk-tools-error" id="error-outcomes">{errors.outcomes}</span>}</label>
    {Object.keys(errors).length > 0 && <p role="alert" className="mk-tools-error">راجع الحقول الموضحة لإكمال المسودة. لم يتم حفظ أي محتوى.</p>}<button className="mk-button" type="submit">مراجعة المسودة المحلية</button>
    {reviewed && <p role="status" className="mk-note">تمت مراجعة المسودة في الصفحة فقط. لم تُحفظ ولم تُنشر.</p>}
  </form></MarketingPanel><div className="mk-stack"><MarketingPanel title="بطاقة المسار — معاينة مباشرة" className="mk-tools-track"><SampleLabel /><BookOpen size={36} aria-hidden="true" /><h3>{draft.title || 'اسم مسارك يظهر هنا'}</h3><p>{draft.audience || 'وصف الجمهور المقصود'}</p><ul>{draft.outcomes.split('\n').filter(line => line.trim()).map((line, index) => <li key={index}>{line}</li>)}</ul><dl className="mk-tools-facts"><div><dt>المدة</dt><dd>{draft.duration || 'بانتظار الوصف المعتمد'}</dd></div><div><dt>الدروس</dt><dd>بانتظار بيانات المنهج</dd></div><div><dt>المستوى السابق</dt><dd>{draft.priorLevel || 'توجيه لم يُحدد بعد'}</dd></div><div><dt>التقييم</dt><dd>{draft.assessment || 'بانتظار وصف معتمد'}</dd></div><div><dt>الشهادة</dt><dd>{draft.certificate || 'بانتظار وصف معتمد'}</dd></div><div><dt>اللقاءات</dt><dd>{draft.meeting || 'بانتظار وصف معتمد'}</dd></div></dl><p>{draft.result || 'النتيجة المقصودة من الرحلة لم تُحدد بعد.'}</p><div className="mk-tools-video"><Video aria-hidden="true" /><strong>الفيديو التعريفي مطلوب لكل مسار</strong><p>{isSafeIntroVideo(draft.video) ? 'صيغة الرابط مناسبة للمعاينة. لم يُحمّل الفيديو ولم تُتحقق إتاحته.' : 'أضف رابطًا معتمدًا؛ لا يوجد فيديو متاح للتشغيل الآن.'}</p></div></MarketingPanel><MarketingNote>معلومات المستوى السابق للتوجيه فقط. التقييم والشهادة واللقاءات تنتظر محتوى وخدمات معتمدة، ولا تمثل شروط قبول.</MarketingNote></div></div>;
}

const modeLabels: Record<AudienceMode, string> = { single: 'طالب واحد', selected: 'طلاب مختارون', group: 'مجموعة', stage: 'مرحلة تعليمية', track: 'مسار' };
export function NotificationComposer({ actor = 'teacher' }: { actor?: 'teacher' | 'admin' }) {
  const [filter, setFilter] = useState<AudienceFilter>({ mode: 'single', value: '', selected: [], gender: 'all' });
  const [subject, setSubject] = useState(''); const [message, setMessage] = useState('');
  const [error, setError] = useState(''); const [finished, setFinished] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null); const trigger = useRef<HTMLButtonElement>(null); const form = useRef<HTMLFormElement>(null);
  const recipients = selectAudience(marketingStudents, filter);
  function invalidate() { setFinished(false); setError(''); if (dialog.current?.open) dialog.current.close(); }
  function update(next: AudienceFilter) { invalidate(); setFilter(next); }
  function preview(event: FormEvent) {
    event.preventDefault(); setFinished(false);
    if (!subject.trim() || !message.trim() || !recipients.length) {
      setError('أضف عنوان الرسالة ونصها واختر جمهورًا يحتوي على طالب مؤهل واحد على الأقل.');
      form.current?.querySelector<HTMLElement>(!subject.trim() ? '[name="subject"]' : !message.trim() ? '[name="message"]' : '[name="audience"]')?.focus(); return;
    }
    setError(''); dialog.current?.showModal();
  }
  const options = filter.mode === 'single' ? marketingStudents.filter(s => s.authorized).map(s => [s.id, s.name]) : filter.mode === 'group' ? [['group-a', 'المجموعة النموذجية أ'], ['group-b', 'المجموعة النموذجية ب']] : filter.mode === 'stage' ? [['stage-a', 'المرحلة النموذجية أ'], ['stage-b', 'المرحلة النموذجية ب']] : marketingTracks.map(t => [t.id, t.name]);
  return <div className="mk-grid"><MarketingPanel title="إعداد الرسالة" description="كل الطلاب المعروضين سجلات مصطنعة للمعاينة، وليست دليل طلاب المركز."><form ref={form} noValidate className="mk-stack" onSubmit={preview}>
    <label className="mk-field" htmlFor="audience-mode">نوع الجمهور<select id="audience-mode" value={filter.mode} onChange={e => update({ ...filter, mode: e.target.value as AudienceMode, value: '', selected: [] })}>{Object.entries(modeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
    {filter.mode === 'selected' ? <fieldset className="mk-tools-checks" aria-describedby="audience-help"><legend>اختر الطلاب النموذجيين</legend>{marketingStudents.filter(s => s.authorized).map(student => <label key={student.id}><input name="audience" type="checkbox" checked={filter.selected.includes(student.id)} onChange={e => update({ ...filter, selected: e.target.checked ? [...filter.selected, student.id] : filter.selected.filter(id => id !== student.id) })} />{student.name}</label>)}</fieldset> : <label className="mk-field" htmlFor="audience-value">{modeLabels[filter.mode]}<select name="audience" id="audience-value" value={filter.value} aria-invalid={!!error && !recipients.length} aria-describedby={error ? "audience-help notice-error" : "audience-help"} onChange={e => update({ ...filter, value: e.target.value })}><option value="">اختر من السجلات النموذجية</option>{options.map(([id, name]) => <option value={id} key={id}>{name}</option>)}</select></label>}
    <label className="mk-field" htmlFor="audience-gender">تصفية الجمهور<select id="audience-gender" value={filter.gender} onChange={e => update({ ...filter, gender: e.target.value as AudienceFilter['gender'] })}><option value="all">الجميع ضمن الاختيار</option><option value="male">رجال فقط</option><option value="female">نساء فقط</option></select></label>
    <p className="mk-muted" id="audience-help">التصفية تضيق الاختيار ولا توسعه. الجنس غير المحدد يُستبعد عند اختيار رجال أو نساء؛ لا يُستنتج من الأسماء.</p>
    <label className="mk-field" htmlFor="notice-subject">عنوان الرسالة<input name="subject" id="notice-subject" value={subject} maxLength={150} aria-invalid={!!error && !subject.trim()} aria-describedby={error ? 'notice-error' : undefined} onChange={e => { invalidate(); setSubject(e.target.value); }} /></label>
    <label className="mk-field" htmlFor="notice-message">نص الرسالة<textarea name="message" id="notice-message" rows={5} value={message} maxLength={2000} aria-invalid={!!error && !message.trim()} aria-describedby={error ? 'notice-error' : undefined} onChange={e => { invalidate(); setMessage(e.target.value); }} /></label>
    {error && <p id="notice-error" role="alert" className="mk-tools-error">{error}</p>}
    <button ref={trigger} type="submit" className="mk-button">مراجعة الجمهور والرسالة</button>
    {finished && <p role="status" className="mk-note">انتهت المعاينة المحلية. لم يُرسل أي إشعار.</p>}
  </form></MarketingPanel><MarketingPanel title="الجمهور النموذجي بعد التصفية"><SampleLabel /><div className="mk-tools-count"><Users aria-hidden="true" /><strong>{recipients.length}</strong><span>سجلات مؤهلة في هذه المعاينة</span></div>{recipients.length ? <ul className="mk-tools-recipient-list">{recipients.map(s => <li key={s.id}>{s.name}</li>)}</ul> : <p className="mk-muted">لا توجد سجلات مطابقة. اختر جمهورًا أو غيّر التصفية.</p>}<MarketingNote>الإرسال الفعلي غير متاح. {actor === 'admin' ? 'يلزم التحقق من صلاحية مسؤول الإشعارات ونطاق الطلاب المسموح له على الخادم قبل أي إرسال.' : 'يلزم التحقق من صلاحية المعلم وعضوية الجمهور على الخادم قبل أي إرسال.'}</MarketingNote></MarketingPanel>
    <dialog className="mk-tools-dialog" ref={dialog} aria-labelledby="notice-review-title" onClose={() => trigger.current?.focus()} onCancel={event => { event.preventDefault(); dialog.current?.close(); }}><h2 id="notice-review-title">مراجعة محلية قبل الإرسال</h2><SampleLabel /><p>الجمهور النموذجي: {recipients.length}</p><h3>{subject}</h3><p className="mk-tools-message">{message}</p><p>هذه معاينة فقط؛ لا توجد خدمة إرسال متصلة.</p><div className="mk-tools-actions"><button className="mk-button mk-button-outline" type="button" autoFocus onClick={() => dialog.current?.close()}>العودة للتعديل</button><button className="mk-button" type="button" onClick={() => { dialog.current?.close(); setFinished(true); }}>إنهاء المعاينة دون إرسال</button></div></dialog>
  </div>;
}

function MeetingRoom() {
  const [provider, setProvider] = useState('zoom'); const [failed, setFailed] = useState(false);
  return <div className="mk-grid"><MarketingPanel title="اختر مزود اللقاء" description="يبقى اللقاء داخل المركز عندما تكتمل خدمة الانضمام الآمن."><label className="mk-field" htmlFor="meeting-provider">مزود اللقاء<select id="meeting-provider" value={provider} onChange={e => { setProvider(e.target.value); setFailed(false); }}><option value="zoom">Zoom</option><option value="meet">Google Meet</option></select></label><div className="mk-tools-readiness"><ShieldCheck aria-hidden="true" /><h3>{provider === 'zoom' ? 'الانضمام داخل الموقع بانتظار التجهيز' : 'التضمين داخل الموقع قيد التحقق'}</h3><p>{provider === 'zoom' ? 'يلزم إعداد خدمة اللقاء والتحقق من صلاحية الانضمام قبل إتاحة الصوت والصورة.' : 'لم تُثبت بعد إمكانية لقاء Google Meet التفاعلي داخل الموقع. لن ننقلك إلى موقع خارجي.'}</p></div><MarketingNote>لا يتم تشغيل الكاميرا أو الميكروفون في المعاينة، ولا يُسجل حضور أو اتصال.</MarketingNote></MarketingPanel><section className="mk-tools-meeting" aria-label="مساحة اللقاء داخل الموقع"><div className="mk-tools-meeting-heading"><span className="mk-pill">غير متصل</span><span dir="ltr">{provider === 'zoom' ? 'Zoom' : 'Google Meet'}</span></div><div className="mk-tools-meeting-body"><Video size={52} aria-hidden="true" /><h2>{failed ? 'خدمة الانضمام غير متاحة' : 'مساحة مجلس العلم'}</h2><p role="status">{failed ? 'خدمة اللقاء غير مهيأة بعد. لا يمكن بدء الاتصال. يمكنك إعادة التحقق داخل الصفحة.' : 'سيظهر اللقاء هنا عند تفعيل خدمة معتمدة. لا يوجد لقاء مباشر في هذه المعاينة.'}</p><button type="button" className="mk-button mk-button-outline" onClick={() => setFailed(true)}>{failed ? 'إعادة التحقق' : 'التحقق من إتاحة الانضمام'}</button></div></section></div>;
}

function CertificateSample() {
  const [qr, setQr] = useState(''); const [failed, setFailed] = useState(false); const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    toDataURL(new URL(marketingHref('verify'), window.location.origin).href, { width: 224, margin: 4, errorCorrectionLevel: 'M', color: { dark: '#0b1d3a', light: '#ffffff' } }).then(value => { if (active) { setQr(value); setFailed(false); } }).catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, [retry]);
  return <div className="mk-stack"><section className="mk-tools-certificate" aria-label="نموذج شهادة غير صالحة للاعتماد"><div className="mk-tools-certificate-top"><BookOpen aria-hidden="true" size={32} /><span>مركز شومان</span><SampleLabel /></div><p className="mk-tools-certificate-eyebrow">نموذج شهادة للتصميم فقط</p><h2>رحلة علم تستحق أن تُوثق</h2><p>اسم المتعلم يظهر بعد إصدار معتمد</p><div className="mk-tools-certificate-rule" /><p>لا يثبت هذا النموذج حضورًا أو إتمامًا أو درجة علمية.</p><div className="mk-tools-qr"><div className="mk-tools-qr-image">{qr ? <Image src={qr} width={224} height={224} unoptimized alt="رمز QR يفتح صفحة التحقق التجريبية فقط" /> : <div role="status">{failed ? 'تعذر إنشاء الرمز.' : 'جارٍ إنشاء رمز المعاينة…'}</div>}</div><div><QrCode aria-hidden="true" /><h3>امسح الرمز لعرض المعاينة</h3><p>الرابط داخل المركز، دون أسماء أو درجات أو بيانات شخصية.</p><a className="mk-button mk-button-outline" href={marketingHref('verify')}>فتح صفحة التحقق التجريبية</a>{failed && <button className="mk-button mk-button-outline" type="button" onClick={() => { setFailed(false); setRetry(retry + 1); }}>إعادة إنشاء الرمز</button>}</div></div></section><MarketingNote>هذه ليست شهادة صادرة. رمز QR قابل للمسح لكنه يقود إلى معاينة، وليس إلى سجل اعتماد أو إثبات إتمام.</MarketingNote></div>;
}
function VerificationSample() {
  return <MarketingPanel title="هذا الرمز يعود إلى نموذج توضيحي" className="mk-tools-verification"><QrCode size={48} aria-hidden="true" /><SampleLabel /><p>لم يتم الاستعلام عن شهادة حقيقية. هذه الصفحة لا تؤكد إصدار شهادة أو صلاحيتها أو إلغاءها.</p><p className="mk-muted">عند تفعيل خدمة الشهادات، سيُتاح التحقق من سجل إصدار معتمد وفق البيانات المصرح بعرضها.</p><a href={marketingHref('certificate')} className="mk-button mk-button-outline">العودة إلى نموذج الشهادة</a></MarketingPanel>;
}
