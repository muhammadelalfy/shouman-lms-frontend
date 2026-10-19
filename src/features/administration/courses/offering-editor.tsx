"use client";
import { useState } from "react";
import type { AdminOffering } from "../types";
import { ActionForm } from "../components/action-form";
import { Field, SelectField } from "../components/fields";
import { kindNames } from "../schemas/common";
import { saveOfferingAction } from "./actions";
export function OfferingEditor({ offering }: { offering?: AdminOffering }) {
  const [kind, setKind] = useState(offering?.kind ?? "course");
  const [pricing, setPricing] = useState(offering?.pricing.model ?? "free");
  return (
    <section className="xp-card">
      <ActionForm
        action={saveOfferingAction}
        label={offering ? "حفظ المحتوى" : "إنشاء المحتوى"}
      >
        {offering && <input type="hidden" name="id" value={offering.id} />}
        <div className="xp-grid xp-grid-2">
          <Field
            name="title"
            label="العنوان"
            value={offering?.title}
            required
          />
          <Field
            name="slug"
            label="الرابط المختصر"
            value={offering?.slug}
            hint="حروف وأرقام، تفصل بينها شرطة. اتركه فارغًا للتوليد التلقائي."
          />
        </div>
        {!offering ? (
          <div className="xp-field">
            <label htmlFor="offering-kind">نوع المحتوى</label>
            <select
              id="offering-kind"
              name="kind"
              value={kind}
              onChange={(e) => setKind(e.target.value as typeof kind)}
            >
              {Object.entries(kindNames).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p>النوع: {kindNames[offering.kind]} · يثبت بعد الإنشاء.</p>
        )}
        <Field
          name="summary"
          label="الملخص"
          value={offering?.summary}
          textarea
        />
        <Field
          name="description"
          label="الوصف"
          value={offering?.description}
          textarea
        />
        <div className="xp-grid xp-grid-2">
          <Field
            name="goals"
            label="الأهداف"
            value={offering?.goals.join("\n")}
            textarea
            hint="هدف واحد في كل سطر، حتى ٢٠ هدفًا."
          />
          <Field
            name="target_audience"
            label="الفئة المستهدفة"
            value={offering?.target_audience}
            textarea
          />
        </div>
        <div className="xp-grid xp-grid-2">
          <Field
            name="estimated_duration_minutes"
            label="المدة التقديرية بالدقائق"
            type="number"
            value={offering?.estimated_duration_minutes}
          />
          {kind === "seasonal_program" && (
            <Field
              name="season_name"
              label="اسم الموسم"
              value={offering?.season_name}
            />
          )}
        </div>
        <h2>تنظيم المحتوى</h2>
        <div className="xp-grid xp-grid-2">
          <SelectField
            name="sequencing_mode"
            label="تتابع المواد"
            value={offering?.sequencing_mode ?? "open"}
          >
            <option value="open">مفتوح</option>
            <option value="after_previous_completed">
              بعد إكمال المادة السابقة
            </option>
            <option value="after_previous_quiz_passed">
              بعد اجتياز الاختبار السابق
            </option>
          </SelectField>
          <SelectField
            name="outline_style"
            label="عرض المنهج"
            value={offering?.outline_style ?? "subjects"}
          >
            <option value="subjects">مواد ودروس</option>
            <option value="lessons">دروس مباشرة ضمن مادة واحدة</option>
          </SelectField>
        </div>
        <p className="xp-muted">
          تُحفظ خيارات التتابع في المحتوى؛ يتطلب تطبيق شروط تعلم الطالب خدمة
          التعلم.
        </p>
        <h2>المواعيد والظهور</h2>
        <p className="xp-muted">
          أدخل وقتًا بصيغة ISO مع المنطقة الزمنية؛ مثال{" "}
          <bdi dir="ltr">2026-10-19T10:00:00+03:00</bdi>. اترك الحقل فارغًا لعدم
          التحديد.
        </p>
        <div className="xp-grid xp-grid-2">
          {[
            ["starts_at", "البداية"],
            ["ends_at", "النهاية"],
            ["visible_from", "بداية الظهور"],
            ["visible_until", "نهاية الظهور"],
          ].map(([name, label]) => (
            <Field
              key={name}
              name={name}
              label={label}
              value={offering?.[name as "starts_at"]}
            />
          ))}
        </div>
        <div className="admin-check-list">
          <label>
            <input
              type="checkbox"
              name="is_featured"
              defaultChecked={offering?.is_featured}
            />
            محتوى مميز
          </label>
        </div>
        <h2>التسعير المسجل</h2>
        <p className="xp-muted">
          هذه حقول وصف المحتوى. تفعيل الدفع وسياساته يحتاجان اعتماد الأكاديمية.
        </p>
        <div className="xp-field">
          <label htmlFor="offering-pricing">نموذج التسعير</label>
          <select
            name="pricing"
            id="offering-pricing"
            value={pricing}
            onChange={(e) => setPricing(e.target.value as typeof pricing)}
          >
            <option value="free">مجاني</option>
            <option value="paid">مدفوع</option>
          </select>
        </div>
        {pricing === "paid" && (
          <div className="xp-grid xp-grid-3">
            <Field
              name="price_amount"
              label="السعر بالقرش"
              type="number"
              value={offering?.pricing.price_amount}
              hint="عدد صحيح؛ ١٠٠ قرش = جنيه واحد."
            />
            <Field
              name="discounted_price_amount"
              label="السعر المخفض بالقرش"
              type="number"
              value={offering?.pricing.discounted_price_amount}
            />
            <SelectField
              name="currency"
              label="العملة"
              value={offering?.pricing.currency ?? "EGP"}
            >
              <option value="EGP">جنيه مصري · EGP</option>
            </SelectField>
          </div>
        )}
      </ActionForm>
    </section>
  );
}
