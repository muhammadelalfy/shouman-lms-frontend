// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { ThemeSync, ThemeToggle } from "./theme-toggle";
afterEach(() => { cleanup(); localStorage.clear(); document.documentElement.classList.remove("dark"); delete document.documentElement.dataset.theme; vi.restoreAllMocks(); });
it("toggles both the global theme and the saved preference", () => {
  render(<><ThemeSync /><ThemeToggle /></>);
  fireEvent.click(screen.getByRole("button", { name: "تفعيل الوضع الداكن" }));
  expect(document.documentElement.classList.contains("dark")).toBe(true);
  expect(localStorage.getItem("shouman-theme")).toBe("dark");
  expect(screen.getByRole("button", { name: "تفعيل الوضع الفاتح" }).getAttribute("aria-pressed")).toBe("true");
  fireEvent.click(screen.getByRole("button", { name: "تفعيل الوضع الفاتح" }));
  expect(document.documentElement.classList.contains("dark")).toBe(false);
});
it("restores dark preference across page mounts", () => {
  localStorage.setItem("shouman-theme", "dark");
  render(<><ThemeSync /><ThemeToggle /></>);
  expect(document.documentElement.dataset.theme).toBe("dark");
});
it("continues to toggle when preference storage is unavailable", () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("denied"); });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("denied"); });
  render(<><ThemeSync /><ThemeToggle /></>);
  fireEvent.click(screen.getByRole("button", { name: "تفعيل الوضع الداكن" }));
  expect(document.documentElement.classList.contains("dark")).toBe(true);
});
it("uses system dark appearance when no explicit choice is saved", () => {
  vi.spyOn(window, "matchMedia").mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() } as unknown as MediaQueryList);
  render(<><ThemeSync /><ThemeToggle /></>);
  expect(document.documentElement.classList.contains("dark")).toBe(true);
});
it("synchronizes a preference changed in another tab", () => {
  render(<><ThemeSync /><ThemeToggle /></>);
  localStorage.setItem("shouman-theme", "dark");
  fireEvent(window, new StorageEvent("storage", { key: "shouman-theme", newValue: "dark" }));
  expect(screen.getByRole("button", { name: "تفعيل الوضع الفاتح" })).toBeTruthy();
});
