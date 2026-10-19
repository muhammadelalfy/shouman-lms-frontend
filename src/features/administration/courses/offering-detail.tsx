"use client";
import Link from "next/link";
import type { AdminOffering } from "../types";
import type { Permission } from "@/features/auth/types";
import { kindNames, statusNames } from "../schemas/common";
import { ActionForm } from "../components/action-form";
import { Field } from "../components/fields";
import { ContentControls } from "./content-controls";
import { OutlineEditor } from "./outline-editor";
import { updateInstructorsAction } from "./actions";
export function OfferingDetail({
  offering,
  permissions,
}: {
  offering: AdminOffering;
  permissions: Permission[];
}) {
  const manage = permissions.includes("offerings.manage"),
    publish = permissions.includes("offerings.publish");
  return (
    <div className="xp-stack">
      <section className="xp-card">
        <div className="xp-row">
          <h2>{offering.title}</h2>
          {manage && (
            <Link
              className="xp-button"
              href={`/admin/offerings/${offering.id}/edit`}
            >
              تحرير المحتوى
            </Link>
          )}
        </div>
        <p>{offering.summary}</p>
        <dl>
          <dt>النوع</dt>
          <dd>{kindNames[offering.kind]}</dd>
          <dt>الحالة</dt>
          <dd>{statusNames[offering.status]}</dd>
          <dt>الرابط</dt>
          <dd>
            <bdi>{offering.slug}</bdi>
          </dd>
          <dt>التسعير</dt>
          <dd>
            {offering.pricing.model === "free"
              ? "مجاني"
              : `${offering.pricing.final_price_amount} وحدة نقدية صغرى · ${offering.pricing.currency}`}
          </dd>
        </dl>
        <ContentControls
          offeringId={offering.id}
          id={offering.id}
          entity="offerings"
          status={offering.status}
          title={offering.title}
          manage={manage}
          publish={publish}
        />
      </section>
      <OutlineEditor offering={offering} manage={manage} publish={publish} />
      <section className="xp-card">
        <h2>المدرّسون</h2>
        <ul>
          {offering.instructors?.map((i) => (
            <li key={i.id}>
              {i.name} · <bdi>{i.id}</bdi>
            </li>
          ))}
        </ul>
        {!offering.instructors?.length && <p>لا يوجد مدرّسون مسندون.</p>}
        {manage && (
          <ActionForm action={updateInstructorsAction} label="حفظ المدرّسين">
            <input type="hidden" name="id" value={offering.id} />
            <Field
              name="user_ids"
              label="معرّفات المدرّسين"
              value={offering.instructors?.map((i) => i.id).join(", ")}
              hint="معرّفات رقمية تفصل بينها فاصلة، حتى ٢٠ مدرّسًا. يتحقق الخادم من دور المدرّس. الحقل الفارغ يزيل جميع الإسنادات."
            />
            {permissions.includes("users.view") && (
              <p>
                <Link href="/admin/users?role=instructor">
                  البحث في حسابات المدرّسين ←
                </Link>
              </p>
            )}
          </ActionForm>
        )}
      </section>
    </div>
  );
}
