// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { HomePreview } from "./home-page";
import BuildExactlyHome from "./build-exactly-home";
import { ComingSoonButton, HeaderSearch, MobileNavigation, NewsletterForm } from "./preview-interactions";

// jsdom does not implement the browser's modal top layer. These shims expose
// open/closed state; keyboard trapping and focus restoration remain app behavior.
const modalDescriptor = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, "showModal");
const closeDescriptor = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, "close");

beforeAll(() => {
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
    configurable: true,
    value(this: HTMLDialogElement) { this.setAttribute("open", ""); },
  });
  Object.defineProperty(HTMLDialogElement.prototype, "close", {
    configurable: true,
    value(this: HTMLDialogElement) { this.removeAttribute("open"); },
  });
});

afterAll(() => {
  if (modalDescriptor) Object.defineProperty(HTMLDialogElement.prototype, "showModal", modalDescriptor);
  else Reflect.deleteProperty(HTMLDialogElement.prototype, "showModal");
  if (closeDescriptor) Object.defineProperty(HTMLDialogElement.prototype, "close", closeDescriptor);
  else Reflect.deleteProperty(HTMLDialogElement.prototype, "close");
});

const fetchMock = vi.fn();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  cleanup();
  expect(fetchMock).not.toHaveBeenCalled();
});

describe("forthcoming homepage actions", () => {
  it("announces an honest preview, traps boundary Tab keys and restores focus after Escape", () => {
    render(<ComingSoonButton title="تسجيل الدخول">تسجيل الدخول</ComingSoonButton>);
    const trigger = screen.getByRole("button", { name: "تسجيل الدخول" });
    trigger.focus();
    document.body.style.overflow = "auto";
    fireEvent.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "تسجيل الدخول — قريبًا" });
    const close = within(dialog).getByRole("button", { name: "إغلاق" });
    const continueButton = within(dialog).getByRole("button", { name: /أتابع التصفح/ });
    expect(document.activeElement).toBe(close);
    expect(document.body.style.overflow).toBe("hidden");
    expect(within(dialog).getByText(/لم يُرسل أي طلب ولم تُنفّذ أي عملية/)).toBeDefined();

    fireEvent.keyDown(close, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(continueButton);
    fireEvent.keyDown(continueButton, { key: "Tab" });
    expect(document.activeElement).toBe(close);
    fireEvent.keyDown(close, { key: "Escape" });

    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
    expect(document.body.style.overflow).toBe("auto");
    document.body.style.overflow = "";
  });

  it("closes from its explicit action without navigating or calling an API", () => {
    render(<ComingSoonButton title="الفيديو التعريفي">شاهد الفيديو</ComingSoonButton>);
    const trigger = screen.getByRole("button", { name: "شاهد الفيديو" });
    trigger.focus();
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("button", { name: /أتابع التصفح/ }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });
});

describe("homepage navigation", () => {
  it("sets the menu expansion state and closes on section selection", () => {
    render(<MobileNavigation />);
    const trigger = screen.getByRole("button", { name: "فتح قائمة التنقل" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    trigger.focus();
    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    const dialog = screen.getByRole("dialog", { name: "قائمة التنقل" });
    const tracks = within(dialog).getByRole("link", { name: "المسارات" });
    expect(tracks.getAttribute("href")).toBe("#tracks");
    fireEvent.click(tracks);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(trigger);
  });

  it("accepts the supplied homepage navigation and exposes only its real section anchors", () => {
    const navigation = [
      { label: "الرئيسية", href: "#home" },
      { label: "المقالات", href: "#articles" },
      { label: "تواصل معنا", href: "#contact" },
    ];
    const { container } = render(
      <>
        <MobileNavigation navigation={navigation} />
        <main>
          <section id="home" />
          <section id="articles" />
          <section id="contact" />
        </main>
      </>,
    );
    fireEvent.click(screen.getByRole("button", { name: "فتح قائمة التنقل" }));
    const links = Array.from(container.querySelectorAll<HTMLAnchorElement>(".navigation-drawer a[href]"));
    expect(links.map((link) => link.hash)).toEqual(navigation.map((item) => item.href));
    for (const link of links) expect(document.querySelector(link.hash)).not.toBeNull();
  });

  it("dismisses the mobile menu with Escape and the close control", () => {
    render(<MobileNavigation />);
    const trigger = screen.getByRole("button", { name: "فتح قائمة التنقل" });
    trigger.focus();
    fireEvent.click(trigger);
    fireEvent.keyDown(screen.getByRole("dialog", { name: "قائمة التنقل" }), { key: "Escape" });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(trigger);
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("button", { name: "إغلاق" }));
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });

  it("offers a real section destination while search is unavailable", () => {
    render(<HeaderSearch />);
    const trigger = screen.getByRole("button", { name: "ابحث في الأكاديمية" });
    trigger.focus();
    fireEvent.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "البحث في الأكاديمية — قريبًا" });
    expect(within(dialog).getByText(/البحث غير متاح في هذه المعاينة/)).toBeDefined();
    const tracks = within(dialog).getByRole("link", { name: "تصفح المسارات" });
    expect(tracks.getAttribute("href")).toBe("#tracks");
    fireEvent.click(tracks);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("replaces the menu with an unavailable-feature dialog and restores the menu trigger", () => {
    render(<MobileNavigation />);
    const trigger = screen.getByRole("button", { name: "فتح قائمة التنقل" });
    trigger.focus();
    fireEvent.click(trigger);
    const menu = screen.getByRole("dialog", { name: "قائمة التنقل" });
    fireEvent.click(within(menu).getByRole("button", { name: /اللقاءات/ }));
    expect(screen.queryByRole("dialog", { name: "قائمة التنقل" })).toBeNull();
    const explanation = screen.getByRole("dialog", { name: "اللقاءات — قريبًا" });
    expect(document.body.style.overflow).toBe("hidden");
    expect(within(explanation).getByText(/لم يُرسل أي طلب/)).toBeDefined();
    fireEvent.keyDown(explanation, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
    expect(document.body.style.overflow).toBe("");
  });
});

describe("newsletter preview", () => {
  it("cannot submit an email before client JavaScript hydrates", () => {
    const serverDocument = new DOMParser().parseFromString(renderToStaticMarkup(<NewsletterForm />), "text/html");
    const subscribe = Array.from(serverDocument.querySelectorAll<HTMLButtonElement>("button"))
      .find((button) => button.textContent?.includes("اشتراك"));
    const email = serverDocument.querySelector<HTMLInputElement>('input[type="email"]');
    expect(subscribe).toBeDefined();
    expect(subscribe!.type).toBe("button");
    expect(subscribe!.form).toBeNull();
    expect(email).not.toBeNull();
    expect(email!.form).toBeNull();
    expect(email!.name).toBe("");
    expect(serverDocument.querySelector("form")).toBeNull();
  });

  it("blocks an invalid address and does not claim a subscription", () => {
    render(<NewsletterForm />);
    const email = screen.getByRole("textbox", { name: "بريدك الإلكتروني" }) as HTMLInputElement;
    fireEvent.change(email, { target: { value: "invalid-email" } });
    expect(email.validity.typeMismatch).toBe(true);
    expect(email.checkValidity()).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: "اشتراك" }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByText(/لن يُرسل بريدك أو يُحفظ/)).toBeDefined();
  });

  it("clears a valid address and explains that it was never sent or saved", () => {
    const storageWrite = vi.spyOn(Storage.prototype, "setItem");
    render(<NewsletterForm />);
    const email = screen.getByRole("textbox", { name: "بريدك الإلكتروني" }) as HTMLInputElement;
    fireEvent.change(email, { target: { value: "reviewer@example.com" } });
    expect(email.checkValidity()).toBe(true);
    const trigger = screen.getByRole("button", { name: "اشتراك" });
    trigger.focus();
    fireEvent.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "النشرة البريدية — قريبًا" });
    expect(within(dialog).getByText(/لم يُرسل بريدك الإلكتروني ولم يُحفظ، ولم يحدث أي اشتراك/)).toBeDefined();
    expect(email.value).toBe("");
    expect(storageWrite).not.toHaveBeenCalled();
    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("supports Enter without bypassing address validation or submitting data", () => {
    render(<NewsletterForm />);
    const email = screen.getByRole("textbox", { name: "بريدك الإلكتروني" }) as HTMLInputElement;
    email.focus();
    fireEvent.change(email, { target: { value: "invalid-email" } });
    fireEvent.keyDown(email, { key: "Enter" });
    expect(screen.queryByRole("dialog")).toBeNull();
    fireEvent.change(email, { target: { value: "reviewer@example.com" } });
    fireEvent.keyDown(email, { key: "Enter" });
    const dialog = screen.getByRole("dialog", { name: "النشرة البريدية — قريبًا" });
    expect(email.value).toBe("");
    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(document.activeElement).toBe(email);
  });
});

describe("rendered homepage preview", () => {
  it("keeps identity destinations available in the compact navigation", () => {
    render(<BuildExactlyHome />);
    fireEvent.click(screen.getByRole("button", { name: "فتح قائمة التنقل" }));
    const menu = screen.getByRole("dialog", { name: "قائمة التنقل" });
    expect(within(menu).getByRole("link", { name: "تسجيل الدخول" }).getAttribute("href")).toBe("/auth/login");
    expect(within(menu).getByRole("link", { name: "إنشاء حساب" }).getAttribute("href")).toBe("/auth/register");
  });

  it("shows account navigation for a server-confirmed session without receiving a token", () => {
    render(<BuildExactlyHome hasSession />);
    expect(screen.getByRole("link", { name: "حسابي" }).getAttribute("href")).toBe("/account");
    expect(screen.getByRole("link", { name: "لوحتي" }).getAttribute("href")).toBe("/dashboard");
    expect(screen.queryByRole("link", { name: "تسجيل الدخول" })).toBeNull();
  });
  it("discloses sample data in the footer and gives every section link a real destination", () => {
    const { container } = render(<HomePreview />);
    const previewDisclosure = screen.getByText(/معاينة التصميم/);
    expect(previewDisclosure.closest("footer")).not.toBeNull();
    expect(screen.getByText(/أرقام توضيحية من مرجع التصميم/)).toBeDefined();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("link", { name: "ابدأ رحلتك الآن" }).getAttribute("href")).toBe("#tracks");
    expect(screen.getByRole("link", { name: "تعرف على الأكاديمية" }).getAttribute("href")).toBe("#video");
    const links = Array.from(container.querySelectorAll<HTMLAnchorElement>("a[href]"));
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      const href = link.getAttribute("href")!;
      expect(href).toMatch(/^#[^#]+$/);
      expect(document.getElementById(href.slice(1)), `Missing section for ${href}`).not.toBeNull();
    }
  });

  it("keeps section anchors valid and connects the replacement homepage to the completed routes", () => {
    const { container } = render(<BuildExactlyHome />);
    const links = Array.from(container.querySelectorAll<HTMLAnchorElement>("a[href]"));
    for (const link of links) {
      const href = link.getAttribute("href")!;
      if (href.startsWith("#")) expect(document.getElementById(href.slice(1)), `Missing section for ${href}`).not.toBeNull();
      else expect(href).toMatch(/^\/(?!\/)/);
    }

    expect(screen.getAllByRole("link", { name: "البرامج" }).map((link) => link.getAttribute("href"))).toEqual(["#articles", "#articles"]);
    expect(screen.getByRole("link", { name: "الأسئلة الشائعة" }).getAttribute("href")).toBe("#faq");
    expect(screen.getByRole("button", { name: "عن الشيخ" })).toBeDefined();

    const search = screen.getByRole("searchbox", { name: "ابحث عن دورة أو موضوع" });
    expect(search.getAttribute("name")).toBe("q");
    expect(search.closest("form")?.getAttribute("action")).toBe("/search");
    expect(search.closest("form")?.getAttribute("method")).toBe("get");
    expect(screen.getByRole("link", { name: /تسجيل الدخول/ }).getAttribute("href")).toBe("/auth/login");
    expect(screen.getByRole("link", { name: /إنشاء حساب/ }).getAttribute("href")).toBe("/auth/register");
    expect(screen.getByRole("link", { name: "استكشف جميع الواجهات" }).getAttribute("href")).toBe("/preview");
  });
});
