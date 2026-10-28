"use client";
import { useContext, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { CsvControls } from "../csv/controls";
import { imageKeys, type NeedsCard, type NeedsRecord } from "@/features/home/content/schema";
import { needsImages, imageLabels } from "@/features/home/content/assets";
import { ActionForm, AdminFormContext } from "../components/action-form";
import { ConfirmationDialog } from "../components/confirmation-dialog";
import { saveNeedsAction, publishNeedsAction } from "./actions";
import "./homepage.css";
function TextField({name,label,value,onChange,maxLength}:{name:string;label:string;value:string;onChange:(value:string)=>void;maxLength:number}) {
  const id=useId();const state=useContext(AdminFormContext);
  const errors=state.status==="error"?state.fieldErrors[name]:undefined;
  return <div className="xp-field"><label htmlFor={id}>{label}</label><input id={id} name={name} value={value} maxLength={maxLength} onChange={e=>onChange(e.target.value)} aria-invalid={errors?.length?true:undefined} aria-describedby={errors?.length?`${id}-error`:undefined}/>{errors?.length?<small id={`${id}-error`} className="xp-error">{errors.join(" · ")}</small>:null}</div>;
}
export function HomepageNeedsEditor({record}:{record:NeedsRecord}) {
  const [draft,setDraft]=useState(record.draft);
  const [saving,setSaving]=useState(false);
  const [csvPending,setCsvPending]=useState(false);
  const [publishing,setPublishing]=useState(false);
  const addCardButton=useRef<HTMLButtonElement>(null);
  const dirty=JSON.stringify(draft)!==JSON.stringify(record.draft);
  const allowNavigation=useRef(false);
  const leaveDialog=useRef<HTMLDialogElement>(null);const cancelLeave=useRef<HTMLButtonElement>(null);const destination=useRef<string|null>(null);const previousFocus=useRef<HTMLElement|null>(null);const dialogId=useId();
  useEffect(()=>{
    if(!dirty)return;
    const unload=(e:BeforeUnloadEvent)=>{if(allowNavigation.current)return;e.preventDefault();e.returnValue="";};
    const navigate=(e:MouseEvent)=>{const link=e.target instanceof Element?e.target.closest<HTMLAnchorElement>('a[href]'):null;if(!link||link.target==="_blank"||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0)return;if(link.href===location.href&&!link.getAttribute('href')?.startsWith('/admin/homepage/needs'))return;e.preventDefault();destination.current=link.href;previousFocus.current=document.activeElement instanceof HTMLElement?document.activeElement:null;leaveDialog.current?.showModal();cancelLeave.current?.focus();};
    window.addEventListener("beforeunload",unload);document.addEventListener("click",navigate,true);
    return()=>{window.removeEventListener("beforeunload",unload);document.removeEventListener("click",navigate,true);};
  },[dirty]);
  const closeLeave=()=>{leaveDialog.current?.close();previousFocus.current?.focus();};
  const updateCard=(index:number,patch:Partial<NeedsCard>)=>setDraft(s=>({...s,cards:s.cards.map((c,i)=>i===index?{...c,...patch}:c)}));
  const move=(index:number,direction:number)=>setDraft(s=>{const cards=[...s.cards];[cards[index],cards[index+direction]]=[cards[index+direction],cards[index]];return{...s,cards};});
  return <div className="xp-stack homepage-needs-editor">
    <CsvControls resource="homepage-needs" label="قسم ماذا تحتاج الآن؟" canImport disabled={dirty || saving || publishing} onPendingChange={setCsvPending} />
    <section className="xp-card"><h2>محتوى الصفحة الرئيسية</h2><p>احفظ تعديلاتك كمسودة، ثم انشرها لتظهر للزوار. الروابط تقود إلى المحتوى المنشور في الفهرس؛ الصور من مكتبة الرسوم الحالية.</p><p>النسخة {record.version} · {record.published_at?`آخر نشر: ${new Intl.DateTimeFormat('ar-EG',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Riyadh'}).format(new Date(record.published_at))}`:"لم يُنشر بعد"}</p><a href="/" target="_blank" rel="noreferrer">عرض الصفحة الرئيسية في نافذة جديدة</a></section>
    <ActionForm action={saveNeedsAction} label="حفظ المسودة" disabled={publishing || csvPending} onPendingChange={setSaving}>
      <input type="hidden" name="version" value={record.version}/><input type="hidden" name="draft" value={JSON.stringify(draft)}/>
      <section className="xp-card xp-stack"><h2>إعدادات القسم</h2><label className="homepage-check"><input type="checkbox" checked={draft.enabled} onChange={e=>setDraft({...draft,enabled:e.target.checked})}/>إظهار القسم بعد النشر</label>
        <TextField name="draft.title" label="عنوان القسم" value={draft.title} maxLength={80} onChange={title=>setDraft({...draft,title})}/>
        <TextField name="draft.subtitle" label="وصف القسم" value={draft.subtitle??""} maxLength={240} onChange={subtitle=>setDraft({...draft,subtitle})}/>
        <div className="homepage-editor-grid"><TextField name="draft.cta_label" label="نص زر جميع التصنيفات" value={draft.cta_label} maxLength={80} onChange={cta_label=>setDraft({...draft,cta_label})}/><TextField name="draft.cta_href" label="رابط زر جميع التصنيفات" value={draft.cta_href} maxLength={1000} onChange={cta_href=>setDraft({...draft,cta_href})}/></div>
      </section>
      <div className="homepage-editor-toolbar"><h2>البطاقات ({draft.cards.length}/24)</h2><button type="button" className="xp-button xp-button-outline" ref={addCardButton} disabled={draft.cards.length>=24} onClick={()=>setDraft({...draft,cards:[...draft.cards,{id:crypto.randomUUID(),title:"بطاقة جديدة",description:"",image_key:"religion",href:"/catalog",style:"icon",enabled:true}]})}>إضافة بطاقة</button></div>
      <div className="homepage-editor-grid">{draft.cards.map((card,index)=><section className="xp-card xp-stack" key={card.id} aria-label={`البطاقة ${index+1}`}>
        <div className="homepage-card-preview"><Image src={needsImages[card.image_key]} alt="" width={88} height={88} className={card.style==='photo'?'homepage-photo-preview':''}/><strong>{card.title}</strong></div>
        <TextField name={`draft.cards.${index}.title`} label={`عنوان البطاقة ${index+1}`} value={card.title} maxLength={80} onChange={title=>updateCard(index,{title})}/>
        <TextField name={`draft.cards.${index}.description`} label={`وصف البطاقة ${index+1}`} value={card.description??""} maxLength={180} onChange={description=>updateCard(index,{description})}/>
        <TextField name={`draft.cards.${index}.href`} label={`رابط البطاقة ${index+1}`} value={card.href} maxLength={1000} onChange={href=>updateCard(index,{href})}/>
        <label className="xp-field">صورة البطاقة {index+1}<select value={card.image_key} onChange={e=>updateCard(index,{image_key:e.target.value as NeedsCard['image_key']})}>{imageKeys.map(key=><option key={key} value={key}>{imageLabels[key]}</option>)}</select></label>
        <label className="xp-field">طريقة عرض البطاقة {index+1}<select value={card.style} onChange={e=>updateCard(index,{style:e.target.value as NeedsCard['style']})}><option value="icon">رسم على خلفية البطاقة</option><option value="photo">صورة تغطي البطاقة</option></select></label>
        <label className="homepage-check"><input type="checkbox" checked={card.enabled} onChange={e=>updateCard(index,{enabled:e.target.checked})}/>إظهار البطاقة {index+1}</label>
        <div className="homepage-editor-toolbar"><button className="xp-button xp-button-outline" type="button" disabled={index===0} onClick={()=>move(index,-1)} aria-label={`تقديم البطاقة ${index+1}`}>تقديم</button><button className="xp-button xp-button-outline" type="button" disabled={index===draft.cards.length-1} onClick={()=>move(index,1)} aria-label={`تأخير البطاقة ${index+1}`}>تأخير</button><ConfirmationDialog title="حذف البطاقة من المسودة" description={`هل تريد حذف «${card.title}»؟ لن تتغير الصفحة المنشورة حتى تنشر المسودة.`} confirmLabel="حذف البطاقة" pending={false} onConfirm={()=>{setDraft(s=>({...s,cards:s.cards.filter(c=>c.id!==card.id)}));requestAnimationFrame(()=>addCardButton.current?.focus());}}>حذف</ConfirmationDialog></div>
      </section>)}</div>
      {!draft.cards.length&&<p className="xp-card">لا توجد بطاقات. أضف بطاقة أو أخفِ القسم.</p>}
      <p role="status">{dirty?"لديك تعديلات غير محفوظة. احفظ المسودة قبل النشر.":"المسودة محفوظة. يمكنك نشرها للزوار."}</p>
    </ActionForm>
    {!dirty&&<section className="xp-card"><h2>نشر القسم</h2><p>يستبدل النشر محتوى هذا القسم فقط. البطاقات المخفية لا تظهر للزوار.</p><ActionForm action={publishNeedsAction} disabled={saving || csvPending} onPendingChange={setPublishing} label="نشر القسم" confirmation="هل تريد نشر المسودة المحفوظة لقسم ماذا تحتاج الآن؟ ستظهر للزوار مباشرة."><input type="hidden" name="version" value={record.version}/></ActionForm></section>}
    <button type="button" className="xp-button xp-button-outline" disabled={saving || publishing || csvPending} onClick={()=>{if(!dirty){location.reload();return;}destination.current=location.href;previousFocus.current=document.activeElement instanceof HTMLElement?document.activeElement:null;leaveDialog.current?.showModal();cancelLeave.current?.focus();}}>تحميل أحدث نسخة من الخادم</button>
    <dialog ref={leaveDialog} className="xp-dialog" aria-labelledby={`${dialogId}-title`} onCancel={e=>{e.preventDefault();closeLeave();}} onClose={()=>previousFocus.current?.focus()}><h2 id={`${dialogId}-title`}>تعديلات غير محفوظة</h2><p>هل تريد مغادرة الصفحة وفقدان التعديلات الحالية؟</p><div className="xp-row"><button type="button" ref={cancelLeave} className="xp-button xp-button-outline" onClick={closeLeave}>البقاء في الصفحة</button><button type="button" className="xp-button" onClick={()=>{if(destination.current){allowNavigation.current=true;location.assign(destination.current);}}}>مغادرة الصفحة</button></div></dialog>
  </div>;
}
