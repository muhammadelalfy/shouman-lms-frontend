import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { ProgressBar, StatusBadge } from "@/features/experience/shared/ui";
import type { SampleLearning } from "./fixtures";

export function StudyCard({ item }: { item: SampleLearning }) {
  return <article className="xp-card learner-study-card">
    <div className="learner-study-cover">
      <Image src={item.image} alt="" fill sizes="(max-width: 700px) 100vw, 360px" />
      <span>{item.category}</span>
    </div>
    <div className="learner-study-body">
      <div className="xp-row">
        <StatusBadge tone={item.state === "completed" ? "success" : "info"}>{item.state === "completed" ? "مكتمل — مثال" : item.state === "purchased" ? "مشتريات — مثال" : "قيد التعلم — مثال"}</StatusBadge>
        <span className="xp-muted learner-small">
          <BookOpen size={14} aria-hidden="true" /> {item.lessons} دروس تجريبية</span>
      </div>
      <h2>
        <Link href="/learning/lessons/demo-lesson">{item.title}</Link>
      </h2>
      <p className="xp-muted">{item.description}</p>
      <ProgressBar value={item.progress} label="نسبة توضيحية" />
      <Link className="learner-card-link" href="/learning/lessons/demo-lesson">{item.state === "completed" ? "استعرض الدروس" : "افتح نموذج الدرس"}<ArrowLeft size={17} aria-hidden="true" />
      </Link>
    </div>
  </article>;
}
