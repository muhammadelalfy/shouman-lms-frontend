// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { FormState } from "@/lib/forms";
import { AuthForm } from "./auth-forms";

const actions = vi.hoisted(() => ({
  loginAction: vi.fn(),
  registerAction: vi.fn(),
  forgotPasswordAction: vi.fn(),
  resetPasswordAction: vi.fn(),
}));

vi.mock("../actions", () => actions);

describe("AuthForm", () => {
  afterEach(cleanup);
  beforeEach(() => vi.clearAllMocks());

  it("renders the login fields with Arabic labels and password-manager autocomplete", () => {
    render(<AuthForm mode="login" />);

    expect(screen.getByRole("heading", { name: "سجّل الدخول" })).toBeTruthy();
    expect(screen.getByLabelText("البريد الإلكتروني").getAttribute("autocomplete")).toBe("email");
    expect(screen.getByLabelText("كلمة المرور").getAttribute("autocomplete")).toBe("current-password");
    expect(screen.getByRole("button", { name: "تسجيل الدخول" })).toBeTruthy();
  });

  it("associates server field errors with invalid fields and exposes a form alert", async () => {
    const response: FormState = {
      status: "error",
      message: "يرجى مراجعة الحقول المظللة.",
      fieldErrors: { email: ["البريد الإلكتروني غير صالح."] },
    };
    actions.loginAction.mockResolvedValue(response);
    render(<AuthForm mode="login" />);

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", { name: "تسجيل الدخول" }).closest("form")!);
    });

    expect((await screen.findByRole("alert")).textContent).toContain("يرجى مراجعة الحقول المظللة.");
    const email = screen.getByLabelText("البريد الإلكتروني");
    expect(email.getAttribute("aria-invalid")).toBe("true");
    const errorId = email.getAttribute("aria-describedby");
    expect(errorId).toBeTruthy();
    expect(document.getElementById(errorId!)?.textContent).toContain("البريد الإلكتروني غير صالح.");
  });

  it("renders student registration without role or age fields", () => {
    render(<AuthForm mode="register" />);

    expect(screen.getByLabelText("الاسم").getAttribute("autocomplete")).toBe("name");
    expect(screen.getByLabelText(/رقم الهاتف/).getAttribute("autocomplete")).toBe("tel");
    expect(screen.getByLabelText("كلمة المرور").getAttribute("autocomplete")).toBe("new-password");
    expect(screen.queryByLabelText(/الدور|العمر/)).toBeNull();
  });

  it("uses the reset link's email and token without making either editable", () => {
    const { container } = render(<AuthForm mode="reset-password" email="learner@example.com" token="reset-link-token" />);

    expect((screen.getByLabelText("البريد الإلكتروني") as HTMLInputElement).readOnly).toBe(true);
    expect(container.querySelector<HTMLInputElement>('input[name="email"]')?.value).toBe("learner@example.com");
    expect(container.querySelector<HTMLInputElement>('input[name="token"]')?.value).toBe("reset-link-token");
    expect(screen.getByLabelText("كلمة المرور الجديدة").getAttribute("autocomplete")).toBe("new-password");
  });

  it("uses a polite status for the generic reset confirmation", async () => {
    actions.forgotPasswordAction.mockResolvedValue({ status: "success", message: "إذا كان البريد مسجلًا فسيصلك رابط الاستعادة." });
    render(<AuthForm mode="forgot-password" />);

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", { name: "إرسال رابط الاستعادة" }).closest("form")!);
    });

    await waitFor(() => expect(screen.getByRole("status").textContent).toContain("إذا كان البريد مسجلًا فسيصلك رابط الاستعادة."));
  });

  it("retains the email after a server validation response", async () => {
    actions.loginAction.mockResolvedValue({ status: "error", message: "راجع بياناتك.", fieldErrors: { password: ["كلمة المرور غير صحيحة."] } });
    render(<AuthForm mode="login" />);
    fireEvent.change(screen.getByLabelText("البريد الإلكتروني"), { target: { value: "learner@example.com" } });
    fireEvent.change(screen.getByLabelText("كلمة المرور"), { target: { value: "not-echoed" } });

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", { name: "تسجيل الدخول" }).closest("form")!);
    });

    expect((screen.getByLabelText("البريد الإلكتروني") as HTMLInputElement).value).toBe("learner@example.com");
    expect((screen.getByLabelText("كلمة المرور") as HTMLInputElement).value).toBe("");
  });

  it("explains expired sessions while preserving a safe return destination", () => {
    render(<AuthForm mode="login" redirectTo="/account" sessionExpired />);
    expect(screen.getByRole("status").textContent).toContain("انتهت جلستك");
    expect(document.querySelector<HTMLInputElement>('input[name="redirectTo"]')?.value).toBe("/account");
  });
});
