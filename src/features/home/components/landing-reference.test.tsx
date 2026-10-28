// @vitest-environment jsdom
import { needsFixture } from "@/test/homepage-needs-fixture";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import BuildExactlyHome from "./build-exactly-home";
afterEach(cleanup);
describe("LANDING-REFERENCE-20261023", () => {
  it("provides clear footer navigation without developer-directory links", () => {
    const { container } = render(<BuildExactlyHome needsSection={needsFixture} />);
    const footer = container.querySelector("footer")!;
    expect(footer.className).toContain("landing-footer");
    expect(within(footer).getByRole("navigation", { name: "تعلّم معنا" })).toBeTruthy();
    expect(within(footer).getByRole("link", { name: "تسجيل الدخول" }).getAttribute("href")).toBe("/auth/login");
    expect(footer.querySelector('a[href="/preview"]')).toBeNull();
  });
  it("provides exactly one persistent theme control in the home header", () => {
    const { container } = render(<BuildExactlyHome needsSection={needsFixture} />);
    expect(container.querySelectorAll("header [data-theme-toggle]")).toHaveLength(1);
    expect(within(container.querySelector("header")!).getByRole("button", { name: /تفعيل الوضع/ })).toBeTruthy();
  });
  it("uses subtle rounded backgrounds for discovery sections", () => {
    const { container } = render(<BuildExactlyHome needsSection={needsFixture} />);
    expect(container.querySelectorAll(".landing-rounded-panel")).toHaveLength(3);
    for (const id of ["needs", "tracks", "landing-discovery"]) expect(container.querySelector(`#${id}`)).toBeTruthy();
    expect(container.querySelectorAll("[data-marketing-audience=landing] a")).toHaveLength(4);
  });
  it("uses compact feature icons alongside the device mockup", () => {
    const { container } = render(<BuildExactlyHome needsSection={needsFixture} />);
    const grid = container.querySelector(".landing-feature-grid")!;
    expect(grid).not.toBeNull();
    expect(grid.querySelectorAll(".landing-feature-tile svg")).toHaveLength(10);
    expect(grid.querySelectorAll("img")).toHaveLength(0);
    expect(screen.getByAltText("نموذج عرض المنصة على الأجهزة — صورة توضيحية")).toBeTruthy();
  });
  it("keeps the photographic counter backdrop and labels samples next to counters", () => {
    const { container } = render(<BuildExactlyHome needsSection={needsFixture} />);
    const stats = container.querySelector("#stats")!;
    expect(stats.querySelector(".landing-stats-backdrop img")).not.toBeNull();
    expect(within(stats as HTMLElement).getByText("أرقام توضيحية من مرجع التصميم، وليست إحصاءات فعلية للمركز.")).toBeTruthy();
    expect(stats.querySelectorAll(".landing-stat-tile")).toHaveLength(5);
  });
  it("changes review preview panels with local controls without fabricating testimonials", () => {
    render(<BuildExactlyHome needsSection={needsFixture} />);
    expect(screen.queryByText(/المركز غيرت حياتي/)).toBeNull();
    expect(screen.getByRole("heading", { name: "بانتظار رأي حقيقي موثّق" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "نموذج الرأي التالي" }));
    expect(screen.getByRole("heading", { name: "مساحة لقصة تعلّم" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "نموذج الرأي السابق" }));
    expect(screen.getByRole("heading", { name: "بانتظار رأي حقيقي موثّق" })).toBeTruthy();
    expect(screen.getByText("معاينة ١ من ٢ — لا تمثل آراء طلاب منشورة")).toBeTruthy();
  });
  it("retains joins and routes free/paid discovery through actual catalog filters", () => {
    render(<BuildExactlyHome needsSection={needsFixture} />);
    expect(screen.getByRole("link", { name: "انضم كطالب" }).getAttribute("href")).toBe("/preview/dashboard");
    expect(screen.getByRole("link", { name: "انضم كمعلم" }).getAttribute("href")).toBe("/instructor");
    expect(screen.getByRole("link", { name: "استكشف المحتوى المجاني" }).getAttribute("href")).toBe("/catalog?pricing=free");
    expect(screen.getByRole("link", { name: "استكشف المحتوى المدفوع" }).getAttribute("href")).toBe("/catalog?pricing=paid");
  });
});
