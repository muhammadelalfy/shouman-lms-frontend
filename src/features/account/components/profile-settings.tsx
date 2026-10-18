"use client";

import {
  cloneElement,
  isValidElement,
  useActionState,
  useEffect,
  useRef,
  useState,
  type InputHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { useFormStatus } from "react-dom";
import { initialFormState } from "@/lib/forms";
import type { CurrentUser } from "@/features/auth/types";
import { changePasswordAction, updateProfileAction } from "../actions";
import "./profile-settings.css";
import { PasswordInput } from "@/features/auth/components/password-input";

export type ProfileSettingsUser = Pick<CurrentUser, "name" | "email" | "phone">;

type FieldProps = {
  id: string;
  name: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
};

function Field({ id, name, label, hint, error, children }: FieldProps) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className="profile-field">
      <label htmlFor={id}>{label}</label>
      {isValidElement<InputHTMLAttributes<HTMLInputElement>>(children)
        ? cloneElement(children as ReactElement<InputHTMLAttributes<HTMLInputElement>>, {
            id,
            name,
            "aria-invalid": Boolean(error),
            "aria-describedby": describedBy,
          })
        : children}
      {hint ? <p className="profile-field__hint" id={hintId}>{hint}</p> : null}
      {error ? <p className="profile-field__error" id={errorId}>{error}</p> : null}
    </div>
  );
}

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();

  return <button className="profile-form__submit" type="submit" disabled={pending}>{pending ? pendingLabel : label}</button>;
}

export function ProfileSettings({ user }: { user: ProfileSettingsUser }) {
  const profileRef = useRef<HTMLFormElement>(null);
  const passwordRef = useRef<HTMLFormElement>(null);
  const [profileState, profileAction, profilePending] = useActionState(updateProfileAction, initialFormState);
  const [passwordState, passwordAction, passwordPending] = useActionState(changePasswordAction, initialFormState);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone ?? "");
  const profileErrors = profileState.status === "error" ? profileState.fieldErrors : undefined;
  const passwordErrors = passwordState.status === "error" ? passwordState.fieldErrors : undefined;

  useEffect(() => {
    if (profileState.status === "error") {
      profileRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    }
  }, [profileState]);

  useEffect(() => {
    if (passwordState.status === "error") {
      passwordRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    }
  }, [passwordState]);

  return (
    <section className="profile-settings" dir="rtl" lang="ar" aria-labelledby="profile-settings-title">
      <header className="profile-settings__header">
        <p className="profile-settings__eyebrow">مساحة الحساب</p>
        <h1 id="profile-settings-title">إعدادات حسابي</h1>
        <p>حدّث بيانات التواصل أو غيّر كلمة المرور.</p>
      </header>

      <div className="profile-settings__grid">
        <section className="profile-panel" aria-labelledby="profile-details-title">
          <header className="profile-panel__header">
            <span className="profile-panel__mark" aria-hidden="true">١</span>
            <div>
              <h2 id="profile-details-title">البيانات الشخصية</h2>
              <p>البريد الإلكتروني للعرض فقط، ويمكن تعديل الاسم ورقم الهاتف.</p>
            </div>
          </header>

          {profileState.status === "error" ? <p className="profile-form__message profile-form__message--error" role="alert">{profileState.message}</p> : null}
          {profileState.status === "success" ? <p className="profile-form__message profile-form__message--success" role="status" aria-live="polite">{profileState.message}</p> : null}

          <form ref={profileRef} action={profileAction} className="profile-form" noValidate aria-busy={profilePending}>
            <div className="profile-field">
              <label htmlFor="profile-email">البريد الإلكتروني</label>
              <input id="profile-email" type="email" autoComplete="email" value={user.email} readOnly aria-readonly="true" />
              <p className="profile-field__hint">لا يمكن تعديل البريد من هذه الصفحة.</p>
            </div>
            <Field id="profile-name" name="name" label="الاسم" error={profileErrors?.name?.[0]}>
              <input type="text" autoComplete="name" maxLength={150} required value={name} onChange={(event) => setName(event.target.value)} />
            </Field>
            <Field id="profile-phone" name="phone" label="رقم الهاتف" hint="اتركه فارغًا إذا لم ترغب بإضافته." error={profileErrors?.phone?.[0]}>
              <input type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} />
            </Field>
            <SubmitButton label="حفظ البيانات" pendingLabel="جارٍ الحفظ…" />
            {profilePending ? <p className="profile-form__pending" role="status" aria-live="polite">جارٍ حفظ البيانات.</p> : null}
          </form>
        </section>

        <section className="profile-panel" aria-labelledby="profile-password-title">
          <header className="profile-panel__header">
            <span className="profile-panel__mark" aria-hidden="true">٢</span>
            <div>
              <h2 id="profile-password-title">تغيير كلمة المرور</h2>
              <p>أدخل كلمة المرور الحالية ثم اختر كلمة مرور جديدة.</p>
            </div>
          </header>

          {passwordState.status === "error" ? <p className="profile-form__message profile-form__message--error" role="alert">{passwordState.message}</p> : null}
          {passwordState.status === "success" ? <p className="profile-form__message profile-form__message--success" role="status" aria-live="polite">{passwordState.message}</p> : null}

          <form ref={passwordRef} action={passwordAction} className="profile-form" noValidate aria-busy={passwordPending}>
            <Field id="profile-current-password" name="current_password" label="كلمة المرور الحالية" error={passwordErrors?.current_password?.[0]}>
              <PasswordInput autoComplete="current-password" toggleLabel="كلمة المرور الحالية" required />
            </Field>
            <Field id="profile-new-password" name="password" label="كلمة المرور الجديدة" hint="ثمانية أحرف على الأقل، مع حرف كبير وحرف صغير ورقم." error={passwordErrors?.password?.[0]}>
              <PasswordInput autoComplete="new-password" toggleLabel="كلمة المرور الجديدة" required />
            </Field>
            <Field id="profile-confirm-password" name="password_confirmation" label="تأكيد كلمة المرور الجديدة" error={passwordErrors?.password_confirmation?.[0]}>
              <PasswordInput autoComplete="new-password" toggleLabel="تأكيد كلمة المرور الجديدة" required />
            </Field>
            <SubmitButton label="تغيير كلمة المرور" pendingLabel="جارٍ التغيير…" />
            {passwordPending ? <p className="profile-form__pending" role="status" aria-live="polite">جارٍ تغيير كلمة المرور.</p> : null}
          </form>
        </section>
      </div>
    </section>
  );
}
