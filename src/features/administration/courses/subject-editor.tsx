"use client";
import type { AdminSubject } from "../types";
import { Field } from "../components/fields";
import { ActionForm } from "../components/action-form";
import { saveSubjectAction } from "./actions";
export function SubjectEditor({
  offeringId,
  subject,
}: {
  offeringId: number;
  subject?: AdminSubject;
}) {
  return (
    <section className="xp-card">
      <ActionForm
        action={saveSubjectAction}
        label={subject ? "حفظ المادة" : "إضافة المادة"}
      >
        <input type="hidden" name="offering_id" value={offeringId} />
        {subject && <input type="hidden" name="id" value={subject.id} />}
        <Field
          name="title"
          label="عنوان المادة"
          value={subject?.title}
          required
        />
        <Field
          name="description"
          label="وصف المادة"
          value={subject?.description}
          textarea
        />
      </ActionForm>
    </section>
  );
}
