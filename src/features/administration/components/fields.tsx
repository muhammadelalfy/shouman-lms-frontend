"use client";
import { useContext, useId, type ReactNode } from "react";
import { AdminFormContext } from "./action-form";
function useFieldError(name: string) {
  const state = useContext(AdminFormContext);
  return state.status === "error"
    ? Object.entries(state.fieldErrors)
        .filter(
          ([key]) =>
            key.replace(/^input\./, "") === name ||
            key.replace(/^input\./, "").startsWith(`${name}.`),
        )
        .flatMap(([, messages]) => messages)
        .join(" · ")
    : "";
}
export function Field({
  name,
  label,
  value = "",
  type = "text",
  hint,
  required = false,
  textarea = false,
}: {
  name: string;
  label: string;
  value?: string | number | null;
  type?: string;
  hint?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  const id = useId();
  const error = useFieldError(name);
  return (
    <div className="xp-field">
      <label htmlFor={id}>
        {label}
        {required ? " *" : ""}
      </label>
      {textarea ? (
        <textarea
          className="resize-none"
          id={id}
          name={name}
          defaultValue={value ?? ""}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          defaultValue={value ?? ""}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
        />
      )}
      {error && (
        <small id={`${id}-error`} className="xp-error">
          {error}
        </small>
      )}
      {hint && (
        <small id={`${id}-hint`} className="xp-muted">
          {hint}
        </small>
      )}
    </div>
  );
}
export function SelectField({
  name,
  label,
  value,
  children,
}: {
  name: string;
  label: string;
  value?: string;
  children: ReactNode;
}) {
  const id = useId();
  const error = useFieldError(name);
  return (
    <div className="xp-field">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        name={name}
        defaultValue={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        {children}
      </select>
      {error && (
        <small id={`${id}-error`} className="xp-error">
          {error}
        </small>
      )}
    </div>
  );
}
