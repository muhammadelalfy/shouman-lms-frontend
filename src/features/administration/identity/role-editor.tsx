"use client";
import type { AdminRole } from "../types";
import { permissions, permissionNames, roleNames } from "../schemas/common";
import { ActionForm } from "../components/action-form";
import { updateRolePermissionsAction } from "./actions";
export function RoleEditor({ roles }: { roles: AdminRole[] }) {
  return (
    <div className="xp-stack">
      {roles.map((role) => (
        <section className="xp-card" key={role.name}>
          <h2>{roleNames[role.name]}</h2>
          {role.permissions_locked ? (
            <>
              <p>صلاحيات هذا الدور محمية وتشمل جميع صلاحيات النظام.</p>
              <ul>
                {role.permissions.map((p) => (
                  <li key={p}>{permissionNames[p] ?? p}</li>
                ))}
              </ul>
            </>
          ) : (
            <ActionForm
              action={updateRolePermissionsAction}
              label="حفظ الصلاحيات"
              confirmation={`سيؤثر التغيير على جميع أصحاب دور ${roleNames[role.name]}. قد تلغى الجلسات عند سحب الصلاحيات.`}
            >
              <input type="hidden" name="role" value={role.name} />
              <div className="admin-check-list">
                {permissions.map((permission) => (
                  <label key={permission}>
                    <input
                      type="checkbox"
                      name="permissions"
                      value={permission}
                      defaultChecked={role.permissions.includes(permission)}
                    />
                    {permissionNames[permission]}
                  </label>
                ))}
              </div>
            </ActionForm>
          )}
        </section>
      ))}
    </div>
  );
}
