"use client";
import {
  createContext,
  startTransition,
  useActionState,
  useEffect,
  useId,
  useRef,
  type ReactNode,
} from "react";
import { initialFormState, type FormState } from "@/lib/forms";
import { ConfirmationDialog } from "./confirmation-dialog";
export const AdminFormContext = createContext<FormState>(initialFormState);
export type AdminAction = (
  previous: FormState,
  data: FormData,
) => Promise<FormState>;
export function ActionForm({
  action,
  children,
  label = "حفظ التغييرات",
  confirmation,
}: {
  action: AdminAction;
  children: ReactNode;
  label?: string;
  confirmation?: string;
}) {
  const [state, submit, pending] = useActionState(action, initialFormState);
  const form = useRef<HTMLFormElement>(null);
  const approved = useRef(false);
  const id = useId();
  useEffect(() => {
    if (state.status === "error" && !pending) {
      const first = Array.from(
        form.current?.querySelectorAll<HTMLElement>("[aria-invalid=true]") ??
          [],
      )[0];
      first?.focus();
    }
  }, [state, pending]);
  return (
    <AdminFormContext.Provider value={state}>
      <form
        ref={form}
        action={submit}
        noValidate
        aria-busy={pending}
        onSubmit={(e) => {
          e.preventDefault();
          if (pending || (confirmation && !approved.current)) return;
          approved.current = false;
          const data = new FormData(e.currentTarget);
          startTransition(() => submit(data));
        }}
      >
        <fieldset disabled={pending} className="admin-fieldset">
          {children}
        </fieldset>
        <div aria-live="polite" aria-atomic="true" id={id}>
          {state.status !== "idle" && (
            <div
              className={`admin-feedback ${state.status === "error" ? "xp-error" : ""}`}
              role={state.status === "error" ? "alert" : "status"}
            >
              <p>{state.message}</p>
              {state.status === "error" &&
                Object.keys(state.fieldErrors).length > 0 && (
                  <ul>
                    {Object.entries(state.fieldErrors).map(([name, errors]) => (
                      <li key={name}>{errors.join(" · ")}</li>
                    ))}
                  </ul>
                )}
            </div>
          )}
        </div>
        {confirmation ? (
          <ConfirmationDialog
            title={label}
            description={confirmation}
            confirmLabel={label}
            pending={pending}
            onConfirm={() => {
              approved.current = true;
              form.current?.requestSubmit();
            }}
          >
            {label}
          </ConfirmationDialog>
        ) : (
          <button className="xp-button" type="submit" disabled={pending}>
            {pending ? "جارٍ الحفظ…" : label}
          </button>
        )}
      </form>
    </AdminFormContext.Provider>
  );
}
