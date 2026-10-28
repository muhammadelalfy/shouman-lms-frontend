// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import Link from "next/link";
import { afterEach, expect, it, vi } from "vitest";
import { AcademySlider } from "./academy-slider";
import { ShimmerButton, ShimmerLink } from "@/components/ui/shimmer-button";

afterEach(cleanup);

it("preserves navigable content and named card groups in the vendored carousel", () => {
  render(<AcademySlider label="المسارات"><Link href="/tracks">مسار علمي</Link></AcademySlider>);
  expect(screen.getByRole("link").getAttribute("href")).toBe("/tracks");
  expect(screen.getByRole("group", { name: "بطاقة 1" }).textContent).toBe("مسار علمي");
  expect(screen.getByRole("button", { name: "التالي" })).toBeDefined();
  expect(screen.getByRole("button", { name: "السابق" })).toBeDefined();
});

it("retains link semantics for a shimmer navigation action", () => {
  render(<ShimmerLink href="/auth/register">ابدأ رحلتك</ShimmerLink>);
  expect(screen.getByRole("link", { name: "ابدأ رحلتك" }).getAttribute("href")).toBe("/auth/register");
  expect(screen.queryByRole("button")).toBeNull();
});

it("keeps shimmer action buttons non-submitting and honors disabled state", () => {
  const activate = vi.fn();
  const { rerender } = render(<ShimmerButton onClick={activate}>تابع</ShimmerButton>);
  const button = screen.getByRole("button", { name: "تابع" });
  expect(button.getAttribute("type")).toBe("button");
  fireEvent.click(button);
  expect(activate).toHaveBeenCalledTimes(1);
  rerender(<ShimmerButton disabled onClick={activate}>تابع</ShimmerButton>);
  fireEvent.click(button);
  expect(activate).toHaveBeenCalledTimes(1);
});
