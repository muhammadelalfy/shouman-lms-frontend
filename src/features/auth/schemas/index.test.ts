import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from ".";

const validRegistration = {
  name: "أحمد محمد",
  email: "ahmed@example.com",
  phone: "+201001234567",
  password: "Secret123",
  password_confirmation: "Secret123",
};

describe("registerSchema", () => {
  it("accepts a valid registration and normalizes the email", () => {
    const parsed = registerSchema.parse({ ...validRegistration, email: "  Ahmed@Example.COM " });

    expect(parsed.email).toBe("ahmed@example.com");
  });

  it("treats an empty phone as not provided", () => {
    const parsed = registerSchema.parse({ ...validRegistration, phone: "" });

    expect(parsed.phone).toBeUndefined();
  });

  it.each([
    ["short", "Ab1"],
    ["no uppercase", "secret123"],
    ["no lowercase", "SECRET123"],
    ["no digit", "SecretPass"],
  ])("rejects a weak password (%s)", (_case, password) => {
    const result = registerSchema.safeParse({ ...validRegistration, password, password_confirmation: password });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["password"]);
  });

  it("reports a confirmation mismatch on password_confirmation", () => {
    const result = registerSchema.safeParse({ ...validRegistration, password_confirmation: "Other123" });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["password_confirmation"]);
    expect(result.error?.issues[0]?.message).toBe("تأكيد كلمة المرور غير متطابق.");
  });

  it.each(["010-0123-4567", "+20 100 123 4567", "1234567"])("rejects malformed phone %s", (phone) => {
    expect(registerSchema.safeParse({ ...validRegistration, phone }).success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("requires a password", () => {
    const result = loginSchema.safeParse({ email: "a@example.com", password: "" });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe("كلمة المرور مطلوبة.");
  });
});
