"use client";

import Link from "next/link";
import { cloneElement, isValidElement, useActionState, useEffect, useRef, useState, type InputHTMLAttributes, type ReactElement, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import {
  forgotPasswordAction,
  loginAction,
  registerAction,
  resetPasswordAction,
} from "../actions";
import { initialFormState } from "@/lib/forms";
import "./auth-forms.css";
import { PasswordInput } from "./password-input";

export type AuthFormMode = "login" | "register" | "forgot-password" | "reset-password";

export type AuthFormProps = {
  mode: AuthFormMode;
  token?: string;
  email?: string;
  redirectTo?: string;
  sessionExpired?: boolean;
};

type FieldProps = {
  name: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
};

function Field({ name, label, error, hint, optional, children }: FieldProps) {
  const errorId = `${name}-error`;
  const hintId = `${name}-hint`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className="auth-field">
      <label className="auth-field__label" htmlFor={name}>
        {label}
        {optional ? <span className="auth-field__optional"> (اختياري)</span> : null}
      </label>
      {isValidElement<InputHTMLAttributes<HTMLInputElement>>(children)
        ? cloneElement(children as ReactElement<InputHTMLAttributes<HTMLInputElement>>, {
            id: name,
            name,
            "aria-invalid": Boolean(error),
            "aria-describedby": describedBy,
          })
        : children}
      {hint ? <p className="auth-field__hint" id={hintId}>{hint}</p> : null}
      {error ? <p className="auth-field__error" id={errorId}>{error}</p> : null}
    </div>
  );
}

type FieldErrorMap = Record<string, string[]>;

function FieldError({ errors, name }: { errors: FieldErrorMap | undefined; name: string }) {
  return errors?.[name]?.[0];
}

const copy: Record<AuthFormMode, { eyebrow: string; title: string; description: string; submit: string }> = {
  login: {
    eyebrow: "مرحبًا بعودتك",
    title: "سجّل الدخول",
    description: "أدخل بيانات حسابك للمتابعة.",
    submit: "تسجيل الدخول",
  },
  register: {
    eyebrow: "بداية رحلتك",
    title: "أنشئ حساب طالب",
    description: "املأ بياناتك الأساسية لإنشاء حسابك في الأكاديمية.",
    submit: "إنشاء الحساب",
  },
  "forgot-password": {
    eyebrow: "استعادة الوصول",
    title: "نسيت كلمة المرور؟",
    description: "أدخل بريدك الإلكتروني لطلب رابط استعادة كلمة المرور.",
    submit: "إرسال رابط الاستعادة",
  },
  "reset-password": {
    eyebrow: "استعادة الوصول",
    title: "اختر كلمة مرور جديدة",
    description: "أدخل كلمة مرور جديدة لإكمال استعادة حسابك.",
    submit: "حفظ كلمة المرور",
  },
};

export function AuthForm({ mode, token = "", email: initialEmail = "", redirectTo, sessionExpired = false }: AuthFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [email, setEmail] = useState(initialEmail);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const actions = { login: loginAction, register: registerAction, "forgot-password": forgotPasswordAction, "reset-password": resetPasswordAction };
  const [state, formAction, pending] = useActionState(actions[mode], initialFormState);
  const errors = state.status === "error" ? state.fieldErrors : undefined;
  const labels = copy[mode];

  useEffect(() => {
    if (state.status === "error") {
      formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
    }
  }, [state]);

  return (
    <section className="auth-page" dir="rtl" lang="ar" aria-labelledby="auth-title">
      <div className="auth-page__frame">
        <aside className="auth-page__aside" aria-label="أكاديمية د. حازم شومان">
          <div className="auth-page__seal" aria-hidden="true"><span>أ</span></div>
          <p className="auth-page__aside-kicker">أكاديمية د. حازم شومان</p>
          <p className="auth-page__aside-title">رحلة علم، وتربية، وأثر.</p>
          <span className="auth-page__aside-rule" aria-hidden="true" />
          <p className="auth-page__aside-note">تعلّم بخطوات واضحة، وابدأ من المكان الذي يناسبك.</p>
        </aside>

        <div className="auth-card">
          <header className="auth-card__header">
            <p className="auth-card__eyebrow">{labels.eyebrow}</p>
            <h1 id="auth-title">{labels.title}</h1>
            <p className="auth-card__description">{labels.description}</p>
          </header>

          {state.status === "error" ? (
            <p className="auth-form__message auth-form__message--error" role="alert">{state.message}</p>
          ) : null}
          {state.status === "success" ? (
            <p className="auth-form__message auth-form__message--success" role="status" aria-live="polite">
              {state.message ?? "تم استلام طلبك."}
            </p>
          ) : null}
          {sessionExpired ? <p className="auth-form__message auth-form__message--error" role="status">انتهت جلستك. سجّل الدخول للمتابعة إلى الصفحة التي طلبتها.</p> : null}

          <form ref={formRef} action={formAction} className="auth-form" noValidate aria-busy={pending}>
            {redirectTo ? <input type="hidden" name="redirectTo" value={redirectTo} /> : null}

            {mode === "login" ? (
              <>
                <Field name="email" label="البريد الإلكتروني" error={FieldError({ errors, name: "email" })}>
                  <input type="email" inputMode="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
                </Field>
                <Field name="password" label="كلمة المرور" error={FieldError({ errors, name: "password" })}>
                  <PasswordInput autoComplete="current-password" required />
                </Field>
              </>
            ) : null}

            {mode === "register" ? (
              <>
                <Field name="name" label="الاسم" error={FieldError({ errors, name: "name" })}>
                  <input type="text" autoComplete="name" maxLength={150} required value={name} onChange={(event) => setName(event.target.value)} />
                </Field>
                <Field name="email" label="البريد الإلكتروني" error={FieldError({ errors, name: "email" })}>
                  <input type="email" inputMode="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
                </Field>
                <Field name="phone" label="رقم الهاتف" optional hint="اكتب الرقم بالصيغة الدولية، مثل +201001234567." error={FieldError({ errors, name: "phone" })}>
                  <input type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} />
                </Field>
                <Field name="password" label="كلمة المرور" hint="ثمانية أحرف على الأقل، مع حرف كبير وحرف صغير ورقم." error={FieldError({ errors, name: "password" })}>
                  <PasswordInput autoComplete="new-password" required />
                </Field>
                <Field name="password_confirmation" label="تأكيد كلمة المرور" error={FieldError({ errors, name: "password_confirmation" })}>
                  <PasswordInput autoComplete="new-password" toggleLabel="تأكيد كلمة المرور" required />
                </Field>
              </>
            ) : null}

            {mode === "forgot-password" ? (
              <Field name="email" label="البريد الإلكتروني" hint="ستظهر رسالة تأكيد واحدة بعد إرسال الطلب." error={FieldError({ errors, name: "email" })}>
                <input type="email" inputMode="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
              </Field>
            ) : null}

            {mode === "reset-password" ? (
              <>
                <input type="hidden" name="token" value={token} />
                <Field name="email" label="البريد الإلكتروني" error={FieldError({ errors, name: "email" })}>
                  <input type="email" autoComplete="email" value={email} readOnly required />
                </Field>
                <Field name="password" label="كلمة المرور الجديدة" hint="ثمانية أحرف على الأقل، مع حرف كبير وحرف صغير ورقم." error={FieldError({ errors, name: "password" })}>
                  <PasswordInput autoComplete="new-password" toggleLabel="كلمة المرور الجديدة" required />
                </Field>
                <Field name="password_confirmation" label="تأكيد كلمة المرور الجديدة" error={FieldError({ errors, name: "password_confirmation" })}>
                  <PasswordInput autoComplete="new-password" toggleLabel="تأكيد كلمة المرور الجديدة" required />
                </Field>
              </>
            ) : null}

            <SubmitButton label={labels.submit} pendingLabel="جارٍ الإرسال…" />
            {pending ? <p className="auth-form__pending" role="status" aria-live="polite">جارٍ إرسال الطلب.</p> : null}
          </form>

          <AuthLinks mode={mode} />
        </div>
      </div>
    </section>
  );
}

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();

  return (
    <button className="auth-form__submit" type="submit" disabled={pending}>
      {pending ? pendingLabel : label}
    </button>
  );
}

function AuthLinks({ mode }: { mode: AuthFormMode }) {
  return (
    <nav className="auth-card__links" aria-label="روابط الحساب">
      {mode === "login" ? <><Link href="/auth/forgot-password">نسيت كلمة المرور؟</Link><span aria-hidden="true">·</span><Link href="/auth/register">إنشاء حساب</Link></> : null}
      {mode === "register" ? <><span>لديك حساب بالفعل؟</span><Link href="/auth/login">تسجيل الدخول</Link></> : null}
      {mode === "forgot-password" || mode === "reset-password" ? <Link href="/auth/login">العودة إلى تسجيل الدخول</Link> : null}
    </nav>
  );
}
