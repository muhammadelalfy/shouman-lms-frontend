"use client";

import Link from "next/link";
import { IslamicPattern } from "@/components/ui/islamic-pattern";
import type { TrialCredentials } from "../trial-credentials";
import { safeRedirectPath } from "@/lib/navigation";
import { ArrowLeft } from "lucide-react";
import { LoginForm } from "@/components/ui/login-form";
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
  trialCredentials?: TrialCredentials;
  adminTrialCredentials?: TrialCredentials;
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
    description: "املأ بياناتك الأساسية لإنشاء حسابك في المركز.",
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

export function AuthForm({ mode, token = "", email: initialEmail = "", redirectTo, sessionExpired = false, trialCredentials, adminTrialCredentials }: AuthFormProps) {
  const returnQuery = redirectTo ? `?redirectTo=${encodeURIComponent(safeRedirectPath(redirectTo))}` : "";
  const formRef = useRef<HTMLFormElement>(null);
  const [email, setEmail] = useState(initialEmail);
  const [name, setName] = useState("");
  const [trialFilled, setTrialFilled] = useState(false);
  const [trialDestination, setTrialDestination] = useState<string>();
  const fillTrial = (credentials: TrialCredentials, destination?: string) => {
    setEmail(credentials.email);
    const password = formRef.current?.querySelector<HTMLInputElement>('input[name="password"]');
    if (password) password.value = credentials.password;
    setTrialDestination(destination);
    setTrialFilled(true);
  };
  const [phone, setPhone] = useState("");
  const formDestination = redirectTo ?? (mode === "login" ? trialDestination : undefined);
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
      <div className="auth-islamic-background" aria-hidden="true"><IslamicPattern className="auth-islamic-pattern" /></div>
      <LoginForm>
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
            {formDestination ? <input type="hidden" name="redirectTo" value={formDestination} /> : null}

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

            {mode === "login" && (trialCredentials || adminTrialCredentials) && <div className="auth-trial">
              {trialCredentials && <><button type="button" disabled={pending} onClick={() => fillTrial(trialCredentials)}>تعبئة بيانات التجربة</button><p>حساب طالب تجريبي مشترك. لا تدخل بيانات شخصية في هذا الحساب.</p></>}
              {adminTrialCredentials && <><button type="button" disabled={pending} onClick={() => fillTrial(adminTrialCredentials, "/admin/dashboard")}>تعبئة بيانات المدير</button><p>حساب مدير مشترك للاختبار المحلي فقط. التغييرات من هذا الحساب تؤثر على بيانات التجربة.</p></>}
              {trialFilled && <p role="status">تمت تعبئة البيانات. اضغط تسجيل الدخول للمتابعة.</p>}
            </div>}
            <SubmitButton label={labels.submit} pendingLabel="جارٍ الإرسال…" />
            {pending ? <p className="auth-form__pending" role="status" aria-live="polite">جارٍ إرسال الطلب.</p> : null}
          </form>

          <AuthLinks mode={mode} returnQuery={returnQuery} />
      </LoginForm>
    </section>
  );
}

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();

  return (
    <button className="auth-form__submit" type="submit" disabled={pending}>
      {pending ? pendingLabel : label}
      <ArrowLeft size={18} aria-hidden="true" />
    </button>
  );
}

function AuthLinks({ mode, returnQuery }: { mode: AuthFormMode; returnQuery: string }) {
  return (
    <nav className="auth-card__links" aria-label="روابط الحساب">
      {mode === "login" ? <><Link href="/auth/forgot-password">نسيت كلمة المرور؟</Link><span aria-hidden="true">·</span><Link href={`/auth/register${returnQuery}`}>إنشاء حساب</Link></> : null}
      {mode === "register" ? <><span>لديك حساب بالفعل؟</span><Link href={`/auth/login${returnQuery}`}>تسجيل الدخول</Link></> : null}
      {mode === "forgot-password" || mode === "reset-password" ? <Link href="/auth/login">العودة إلى تسجيل الدخول</Link> : null}
    </nav>
  );
}
