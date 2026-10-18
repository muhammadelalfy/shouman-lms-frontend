// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { PreviewAction, SearchField } from "./interactions";

afterEach(cleanup);

const modalDescriptor = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, "showModal");
const closeDescriptor = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, "close");
beforeAll(() => {
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", { configurable: true, value(this: HTMLDialogElement) { this.open = true; } });
  Object.defineProperty(HTMLDialogElement.prototype, "close", { configurable: true, value(this: HTMLDialogElement) { this.open = false; } });
});
afterAll(() => {
  if (modalDescriptor) Object.defineProperty(HTMLDialogElement.prototype, "showModal", modalDescriptor); else Reflect.deleteProperty(HTMLDialogElement.prototype, "showModal");
  if (closeDescriptor) Object.defineProperty(HTMLDialogElement.prototype, "close", closeDescriptor); else Reflect.deleteProperty(HTMLDialogElement.prototype, "close");
});

describe("shared preview interaction boundaries", () => {
  it("explains the action without side effects and restores focus on Escape", () => {
    const network = vi.fn();
    vi.stubGlobal("fetch", network);
    render(<PreviewAction title="معاينة النشر">معاينة النشر</PreviewAction>);
    const trigger = screen.getByRole("button", { name: "معاينة النشر" });
    fireEvent.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "معاينة النشر" });
    expect(dialog.textContent).toContain("لم يتم الإرسال أو الحفظ");
    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
    expect(network).not.toHaveBeenCalled();
  });
  it("clears search immediately and restores input focus", () => {
    const onChange = vi.fn();
    render(<SearchField value="تدبر" onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "مسح البحث" }));
    expect(onChange).toHaveBeenCalledWith("");
    expect(document.activeElement).toBe(screen.getByRole("searchbox"));
  });
});
