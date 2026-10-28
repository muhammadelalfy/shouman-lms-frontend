"use client";
import { useId, useRef, type ReactNode } from "react";
export function ConfirmationDialog({
  title,
  description,
  confirmLabel,
  pending,
  disabled = false,
  onConfirm,
  children,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  pending: boolean;
  disabled?: boolean;
  onConfirm: () => void;
  children: ReactNode;
}) {
  const id = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);
  const close = () => {
    dialog.current?.close();
    trigger.current?.focus();
  };
  return (
    <>
      <button
        type="button"
        className="xp-button"
        disabled={pending || disabled}
        ref={trigger}
        onClick={() => {
          dialog.current?.showModal();
          cancel.current?.focus();
        }}
      >
        {pending ? "جارٍ الحفظ…" : children}
      </button>
      <dialog
        className="xp-dialog"
        ref={dialog}
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-description`}
        onClose={() => trigger.current?.focus()}
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
      >
        <h2 id={`${id}-title`}>{title}</h2>
        <p id={`${id}-description`}>{description}</p>
        <div className="xp-row">
          <button
            type="button"
            className="xp-button xp-button-outline"
            ref={cancel}
            onClick={close}
          >
            إلغاء
          </button>
          <button
            type="button"
            className="xp-button"
            disabled={pending || disabled}
            onClick={() => {
              close();
              onConfirm();
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </dialog>
    </>
  );
}
