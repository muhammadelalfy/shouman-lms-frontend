"use client";
import { ActionForm } from "../components/action-form";
import { SelectField } from "../components/fields";
import type { ContentStatus } from "../types";
import { statusNames } from "../schemas/common";
import { changeContentStatusAction, deleteContentAction } from "./actions";
const transitions: Record<ContentStatus, ContentStatus[]> = {
  draft: ["published", "archived"],
  published: ["hidden", "archived"],
  hidden: ["published", "archived"],
  archived: ["hidden"],
};
export function ContentControls({
  offeringId,
  id,
  entity,
  status,
  title,
  manage,
  publish,
}: {
  offeringId: number;
  id: number;
  entity: "offerings" | "subjects" | "lessons";
  status: ContentStatus;
  title: string;
  manage: boolean;
  publish: boolean;
}) {
  const fields = (
    <>
      <input type="hidden" name="offering_id" value={offeringId} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="entity" value={entity} />
    </>
  );
  return (
    <div className="xp-grid xp-grid-2">
      {publish && (
        <ActionForm
          action={changeContentStatusAction}
          label="تغيير حالة المحتوى"
          confirmation={`تأكيد تغيير حالة «${title}»؟ يؤثر ذلك على ظهوره للمتعلمين.`}
        >
          {fields}
          <SelectField
            name="status"
            label={`الحالة الحالية: ${statusNames[status]}`}
            value={transitions[status][0]}
          >
            {transitions[status].map((s) => (
              <option key={s} value={s}>
                {statusNames[s]}
              </option>
            ))}
          </SelectField>
        </ActionForm>
      )}
      {manage && (
        <ActionForm
          action={deleteContentAction}
          label="حذف المحتوى"
          confirmation={`سيُحذف «${title}» ومحتواه التابع وفق قواعد الخادم. لا يمكن التراجع عن الحذف.`}
        >
          {fields}
          <p className="xp-error">حذف دائم للمحتوى</p>
        </ActionForm>
      )}
    </div>
  );
}
