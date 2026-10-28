"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Quote, Star } from "lucide-react";
import avatarStudent from "@/assets/build-exactly-web/avatar-student.jpg";

const panels = [
  { title: "بانتظار رأي حقيقي موثّق", text: "تُعرض الآراء بعد التحقق من مصدرها وموافقة أصحابها. لا توجد مراجعات منشورة في هذه المعاينة." },
  { title: "مساحة لقصة تعلّم", text: "مكان مخصص لقصة يشاركها صاحبها بعد اعتماد النشر، دون اختلاق نتائج أو نسب نجاح." },
];

export function LandingReviewPreview() {
  const [index, setIndex] = useState(0);
  return <section className="landing-review rounded-2xl border border-border bg-card p-5 shadow-soft" aria-label="معاينة آراء الطلاب">
    <div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-base font-black text-primary">آراء الطلاب وقصص النجاح</h2><Link className="text-[11px] font-bold text-primary underline-offset-4 hover:underline" href="/preview/marketing/stories">مساحة القصص</Link></div>
    <div className="mt-4 rounded-xl bg-secondary/60 p-4" aria-live="polite" aria-atomic="true">
      <Quote className="size-6 text-accent-foreground" aria-hidden="true" />
      <h3 className="mt-2 text-sm font-bold text-primary">{panels[index].title}</h3>
      <p className="mt-2 text-xs leading-7 text-muted-foreground">{panels[index].text}</p>
      <div className="mt-4 flex items-center gap-3"><Image src={avatarStudent} alt="صورة توضيحية لقالب الرأي، وليست لطالب صاحب مراجعة" width={48} height={48} className="size-11 rounded-full border border-border object-cover" /><div><p className="text-xs font-bold text-primary">قالب عرض توضيحي</p><p className="mt-1 text-[10px] text-muted-foreground">لا يوجد تقييم أو إنجاز منسوب لشخص</p></div></div><div className="mt-3 flex items-center gap-2"><span className="flex gap-0.5" aria-hidden="true">{Array.from({ length: 5 }, (_, i) => <Star key={i} className="size-3 text-muted-foreground/45" />)}</span><span className="text-[10px] text-muted-foreground">مكان التقييم — نموذج غير مُقيّم</span></div>
    </div>
    <div className="mt-3 flex items-center justify-between gap-2"><p className="text-[10px] leading-5 text-muted-foreground">معاينة {index === 0 ? "١" : "٢"} من ٢ — لا تمثل آراء طلاب منشورة</p><div className="flex gap-2"><button type="button" aria-label="نموذج الرأي السابق" className="landing-review-control" onClick={() => setIndex(value => (value + panels.length - 1) % panels.length)}><ArrowLeft className="size-4 rotate-180" aria-hidden="true" /></button><button type="button" aria-label="نموذج الرأي التالي" className="landing-review-control" onClick={() => setIndex(value => (value + 1) % panels.length)}><ArrowLeft className="size-4" aria-hidden="true" /></button></div></div>
  </section>;
}
