"use client";
import type { AdminLesson } from "../types";
import { Field } from "../components/fields";
import { ActionForm } from "../components/action-form";
import { saveLessonAction } from "./actions";
export function LessonEditor({
  offeringId,
  subjectId,
  lesson,
}: {
  offeringId: number;
  subjectId: number;
  lesson?: AdminLesson;
}) {
  return (
    <section className="xp-card">
      <ActionForm
        action={saveLessonAction}
        label={lesson ? "حفظ الدرس" : "إضافة الدرس"}
      >
        <input type="hidden" name="offering_id" value={offeringId} />
        <input type="hidden" name="subject_id" value={subjectId} />
        {lesson && <input type="hidden" name="id" value={lesson.id} />}
        <Field
          name="title"
          label="عنوان الدرس"
          value={lesson?.title}
          required
        />
        <Field
          name="description"
          label="وصف الدرس"
          value={lesson?.description}
          textarea
        />
        <Field
          name="summary"
          label="ملخص الدرس"
          value={lesson?.summary}
          textarea
        />
        <Field
          name="key_points"
          label="النقاط الرئيسية"
          value={lesson?.key_points.join("\n")}
          hint="نقطة واحدة في كل سطر، حتى ٣٠ نقطة."
          textarea
        />
        <Field
          name="estimated_duration_minutes"
          label="المدة بالدقائق"
          type="number"
          value={lesson?.estimated_duration_minutes}
        />
        <p className="xp-local-note">
          يمكن حفظ النصوص. رفع الفيديو والمرفقات يتطلب خدمة الوسائط.
        </p>
      </ActionForm>
    </section>
  );
}
