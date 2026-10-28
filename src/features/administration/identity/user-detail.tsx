"use client";
import type { AdminUser } from "../types";
import type { CurrentUser } from "@/features/auth/types";
import { roles, roleNames, statusNames } from "../schemas/common";
import { ActionForm } from "../components/action-form";
import { SelectField } from "../components/fields";
import { updateUserStatusAction, updateUserRolesAction } from "./actions";
export function UserDetail({
  user,
  actor,
}: {
  user: AdminUser;
  actor: Pick<CurrentUser, "id" | "roles" | "permissions">;
}) {
  const admin = actor.roles.includes("system-administrator");
  const targetAdmin = user.roles?.includes("system-administrator");
  const statusAllowed =
    actor.permissions.includes("users.manage-status") &&
    actor.id !== user.id &&
    (!targetAdmin || admin);
  const rolesAllowed =
    actor.permissions.includes("users.assign-roles") &&
    (admin || (actor.id !== user.id && !targetAdmin));
  return (
    <div className="xp-stack">
      <section className="xp-card">
        <h2>{user.name}</h2>
        <dl>
          <dt>البريد الإلكتروني</dt>
          <dd>
            <bdi dir="ltr">{user.email}</bdi>
          </dd>
          <dt>الهاتف</dt>
          <dd>
            <bdi dir="ltr">{user.phone ?? "غير مسجل"}</bdi>
          </dd>
          <dt>الحالة</dt>
          <dd>{statusNames[user.status]}</dd>
          <dt>الأدوار</dt>
          <dd>
            {user.roles?.map((role) => roleNames[role]).join("، ") ||
              "بلا أدوار"}
          </dd>
        </dl>
      </section>
      {statusAllowed && (
        <section className="xp-card">
          <h2>حالة الحساب</h2>
          <p>تعطيل الحساب يمنع الوصول ويلغي جلساته وفق سياسة المركز.</p>
          <ActionForm
            action={updateUserStatusAction}
            label="تغيير حالة الحساب"
            confirmation={`تأكيد تغيير حالة حساب ${user.name}؟ قد يفقد المستخدم الوصول إلى حسابه.`}
          >
            <input type="hidden" name="id" value={user.id} />
            <SelectField name="status" label="حالة الحساب" value={user.status}>
              <option value="active">نشط</option>
              <option value="disabled">معطّل</option>
            </SelectField>
          </ActionForm>
        </section>
      )}
      {rolesAllowed && (
        <section className="xp-card">
          <h2>الأدوار المسندة</h2>
          <ActionForm
            action={updateUserRolesAction}
            label="حفظ الأدوار"
            confirmation={`ستتغير صلاحيات وصول ${user.name} وفق الأدوار المحددة. إزالة جميع الأدوار تترك الحساب بلا دور.`}
          >
            <input type="hidden" name="id" value={user.id} />
            <div className="admin-check-list">
              {roles
                .filter((role) => admin || role !== "system-administrator")
                .map((role) => (
                  <label key={role}>
                    <input
                      type="checkbox"
                      name="roles"
                      value={role}
                      defaultChecked={user.roles?.includes(role)}
                    />
                    {roleNames[role]}
                  </label>
                ))}
            </div>
          </ActionForm>
        </section>
      )}
    </div>
  );
}
