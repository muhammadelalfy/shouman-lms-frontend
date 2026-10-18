// @vitest-environment jsdom

import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/lib/api/errors";
import { ProfileSettings } from "./profile-settings";
import { changePasswordSchema, updateProfileSchema } from "../schemas";
import { changePasswordAction, updateProfileAction } from "../actions";

const dependencies = vi.hoisted(() => ({
  getSessionToken: vi.fn(),
  updateProfile: vi.fn(),
  changePassword: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock("@/lib/auth/session", () => ({ getSessionToken: dependencies.getSessionToken }));
vi.mock("../api", () => ({ updateProfile: dependencies.updateProfile, changePassword: dependencies.changePassword }));
vi.mock("next/cache", () => ({ refresh: dependencies.refresh }));

const user = { name: "أحمد محمد", email: "ahmed@example.com", phone: "+201001234567" };

describe("ProfileSettings", () => {
  afterEach(cleanup);
  beforeEach(() => vi.clearAllMocks());

  it("renders profile and password forms while keeping email read-only and role fields absent", () => {
    render(<ProfileSettings user={user} />);

    expect(screen.getByRole("heading", { name: "إعدادات حسابي" })).toBeTruthy();
    const email = screen.getByLabelText("البريد الإلكتروني");
    expect((email as HTMLInputElement).readOnly).toBe(true);
    expect(email.hasAttribute("name")).toBe(false);
    expect((screen.getByLabelText("الاسم") as HTMLInputElement).value).toBe("أحمد محمد");
    expect((screen.getByLabelText("رقم الهاتف") as HTMLInputElement).value).toBe("+201001234567");
    expect(screen.getByLabelText("كلمة المرور الحالية").getAttribute("autocomplete")).toBe("current-password");
    expect(screen.queryByText(/الصلاحية|الدور|حالة الحساب/)).toBeNull();
  });

  it("renders server field errors with invalid and described-by semantics", async () => {
    dependencies.getSessionToken.mockResolvedValue("server-cookie-token");
    dependencies.updateProfile.mockRejectedValue(new ApiError(422, "يرجى مراجعة الحقول المظللة.", null, {
      name: ["يجب أن يكون طول الاسم حرفين على الأقل."],
    }));
    const { container } = render(<ProfileSettings user={user} />);
    const profileForm = container.querySelector("form")!;
    fireEvent.change(screen.getByLabelText("الاسم"), { target: { value: "اسم معدل" } });
    fireEvent.change(screen.getByLabelText("رقم الهاتف"), { target: { value: "+201111111111" } });

    await act(async () => {
      fireEvent.submit(profileForm);
    });

    expect((await screen.findByRole("alert")).textContent).toContain("يجب أن يكون طول الاسم حرفين على الأقل.");
    const name = screen.getByLabelText("الاسم");
    expect(name.getAttribute("aria-invalid")).toBe("true");
    const errorId = name.getAttribute("aria-describedby");
    expect(errorId).toBeTruthy();
    expect(document.getElementById(errorId!)?.textContent).toContain("يجب أن يكون طول الاسم حرفين على الأقل.");
    expect((screen.getByLabelText("الاسم") as HTMLInputElement).value).toBe("اسم معدل");
    expect((screen.getByLabelText("رقم الهاتف") as HTMLInputElement).value).toBe("+201111111111");
  });
});

describe("account schemas and server actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dependencies.getSessionToken.mockResolvedValue("server-cookie-token");
  });

  it("normalizes an empty phone to null and rejects fields outside the profile contract", () => {
    expect(updateProfileSchema.parse({ name: " أحمد ", phone: "" })).toEqual({ name: "أحمد", phone: null });
    for (const extra of [{ email: "other@example.com" }, { role: "system-administrator" }, { status: "active" }, { token: "forged" }]) {
      expect(updateProfileSchema.safeParse({ name: "أحمد", phone: null, ...extra }).success).toBe(false);
    }
  });

  it("reuses registration password strength and rejects weak or mismatched passwords", () => {
    expect(changePasswordSchema.safeParse({ current_password: "Current123", password: "weak", password_confirmation: "weak" }).success).toBe(false);
    expect(changePasswordSchema.safeParse({ current_password: "Current123", password: "Strong123", password_confirmation: "Other123" }).success).toBe(false);
    expect(changePasswordSchema.safeParse({ current_password: "Current123", password: "Strong123", password_confirmation: "Strong123", token: "forged" }).success).toBe(false);
  });

  it("sends only name and phone to the API and obtains the token from the server cookie", async () => {
    dependencies.updateProfile.mockResolvedValue(user);
    const formData = new FormData();
    formData.set("name", "أحمد محمد");
    formData.set("phone", "");
    formData.set("email", "attacker@example.com");
    formData.set("role", "system-administrator");
    formData.set("status", "active");
    formData.set("token", "forged-token");

    const result = await updateProfileAction({ status: "idle" }, formData);

    expect(result).toMatchObject({ status: "success" });
    expect(dependencies.updateProfile).toHaveBeenCalledWith("server-cookie-token", { name: "أحمد محمد", phone: null });
    expect(dependencies.refresh).toHaveBeenCalledOnce();
  });

  it("retains the current session after password change and forwards only approved password fields", async () => {
    dependencies.changePassword.mockResolvedValue(undefined);
    const formData = new FormData();
    formData.set("current_password", "Current123");
    formData.set("password", "Strong123");
    formData.set("password_confirmation", "Strong123");
    formData.set("email", "attacker@example.com");
    formData.set("role", "system-administrator");
    formData.set("token", "forged-token");

    const result = await changePasswordAction({ status: "idle" }, formData);

    expect(result).toMatchObject({ status: "success", message: expect.stringContaining("ستظل مسجلًا") });
    expect(dependencies.changePassword).toHaveBeenCalledWith("server-cookie-token", {
      current_password: "Current123",
      password: "Strong123",
      password_confirmation: "Strong123",
    });
  });

  it("does not call the account API when there is no server session", async () => {
    dependencies.getSessionToken.mockResolvedValue(null);
    const result = await updateProfileAction({ status: "idle" }, new FormData());

    expect(result).toMatchObject({ status: "error", message: expect.stringContaining("انتهت جلستك") });
    expect(dependencies.updateProfile).not.toHaveBeenCalled();
  });
});
