import { describe, expect, it } from "vitest";
import * as z from "zod";
import { ApiError } from "./api/errors";
import { apiFailure, validationFailure } from "./forms";

describe("validationFailure", () => {
  it("groups zod issues by field path", () => {
    const result = z.object({ email: z.email({ error: "بريد غير صالح" }) }).safeParse({ email: "x" });

    expect(validationFailure(result.error!)).toEqual({
      status: "error",
      message: "يرجى مراجعة الحقول المظللة.",
      fieldErrors: { email: ["بريد غير صالح"] },
    });
  });
});

describe("apiFailure", () => {
  it("surfaces API field errors with the first one as the banner", () => {
    const error = new ApiError(422, "The given data was invalid.", null, { email: ["البريد مستخدم من قبل."] });

    expect(apiFailure(error)).toEqual({
      status: "error",
      message: "البريد مستخدم من قبل.",
      fieldErrors: { email: ["البريد مستخدم من قبل."] },
    });
  });

  it("shows the domain message for a disabled account", () => {
    const error = new ApiError(403, "تم تعطيل هذا الحساب.", "account_disabled");

    expect(apiFailure(error)).toMatchObject({ message: "تم تعطيل هذا الحساب." });
  });

  it("replaces rate-limit and server errors with safe copy", () => {
    expect(apiFailure(new ApiError(429, "Too Many Attempts."))).toMatchObject({
      message: "محاولات كثيرة. يرجى المحاولة مرة أخرى بعد قليل.",
    });
    expect(apiFailure(new ApiError(500, "SQLSTATE[...] leaked detail"))).toMatchObject({
      message: "حدث خطأ غير متوقع. حاول مرة أخرى، وإن استمرت المشكلة تواصل معنا.",
    });
  });

  it("never exposes unknown thrown values", () => {
    expect(apiFailure(new Error("internal stack detail"))).toMatchObject({
      message: "حدث خطأ غير متوقع. حاول مرة أخرى، وإن استمرت المشكلة تواصل معنا.",
    });
  });
});
