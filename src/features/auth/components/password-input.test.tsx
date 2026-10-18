// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PasswordInput } from "./password-input";

afterEach(cleanup);
describe("password visibility", () => {
  it("keeps passwords masked by default and changes the accessible toggle state", () => {
    render(<><label htmlFor="password">كلمة المرور</label><PasswordInput id="password" autoComplete="new-password" /></>);
    const input = screen.getByLabelText("كلمة المرور") as HTMLInputElement;
    expect(input.type).toBe("password");
    fireEvent.change(input, { target: { value: "temporary" } });
    fireEvent.click(screen.getByRole("button", { name: "إظهار كلمة المرور" }));
    expect(input.type).toBe("text");
    expect(screen.getByRole("button", { name: "إخفاء كلمة المرور" }).getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(screen.getByRole("button", { name: "إخفاء كلمة المرور" }));
    expect(input.type).toBe("password");
    expect(input.value).toBe("temporary");
  });
});
