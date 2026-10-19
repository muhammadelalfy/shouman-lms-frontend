// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AdminExperience } from "./admin-experience";
import { AdminTable } from "./admin-table";
import { AdminRecordEditor } from "./admin-editor";
import { adminTables, localChangeMessage } from "./admin-fixtures";
import { MessageComposer, RoleMatrix } from "./admin-workspaces";
import { AdminModeration } from "./admin-moderation";

afterEach(cleanup);

describe("complete admin frontend previews", () => {
  const routes: Array<[string, string]> = [
    ["admin", "لوحة الإدارة"], ["admin/dashboard", "لوحة الإدارة"],
    ["admin/users", "المستخدمون"], ["admin/users/demo-user", "ملف المستخدم التجريبي"],
    ["admin/users/new", "إضافة — المستخدمون"], ["admin/users/demo-user/edit", "تحرير — المستخدمون"],
    ["admin/roles", "الأدوار والصلاحيات"], ["admin/offerings", "المحتوى التعليمي"],
    ["admin/offerings/demo-offering", "محرر المحتوى التعليمي"], ["admin/subjects/demo-subject", "محرر المادة"],
    ["admin/lessons/demo-lesson", "محرر الدرس"], ["admin/quizzes", "الاختبارات"],
    ["admin/quizzes/demo-quiz", "محرر الاختبار"], ["admin/question-bank", "بنك الأسئلة"],
    ["admin/payments", "المدفوعات والطلبات"], ["admin/payments/demo-payment", "تفاصيل طلب توضيحي"],
    ["admin/coupons/new", "إضافة — الكوبونات"], ["admin/offers", "العروض"],
    ["admin/groups/demo-group", "إدارة مجموعة تجريبية"], ["admin/events", "الفعاليات"],
    ["admin/meetings/new", "إضافة — اللقاءات المباشرة"], ["admin/attendance", "متابعة الحضور"],
    ["admin/certificates", "إدارة الشهادات"], ["admin/certificates/templates", "إدارة الشهادات"],
    ["admin/certificates/rules", "إدارة الشهادات"], ["admin/projects", "مشروعات التخرج"],
    ["admin/projects/demo-project", "مساحة المقيّم"], ["admin/rubrics", "معايير التقييم"],
    ["admin/gamification", "الشارات والتحفيز"], ["admin/distinguished", "مراجعة مرشحي التميز"],
    ["admin/notifications/new", "إضافة — الإشعارات"], ["admin/campaigns/demo-campaign", "محرر الحملة"],
    ["admin/reports", "التقارير"], ["admin/analytics", "التحليلات"],
    ["admin/cms", "استوديو المحتوى"], ["admin/audit-log/demo-audit", "تفاصيل حدث تدقيق توضيحي"],
    ["admin/settings", "إعدادات المنصة"],
    ["admin/moderation", "مراجعة المجتمع والبلاغات"],
  ];

  it.each(routes)("renders a named, labeled screen for /%s", (route, title) => {
    render(<AdminExperience path={route.split("/")} />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(title);
    expect(screen.getAllByText("بيانات تجريبية للمعاينة").length).toBeGreaterThan(0);
    expect(screen.queryByText("اختر أداة من لوحة الإدارة")).toBeNull();
  });

  it("paginates the bounded synthetic list and resets paging after filtering", () => {
    render(<AdminTable definition={adminTables.users} />);
    const table = screen.getByRole("table");
    expect(within(table).getAllByRole("row")).toHaveLength(6);
    fireEvent.click(screen.getByRole("button", { name: "التالي" }));
    expect(within(table).getAllByRole("row")).toHaveLength(4);
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "متعلم تجريبي 01" } });
    expect(within(table).getAllByRole("row")).toHaveLength(2);
    expect((screen.getByRole("button", { name: "التالي" }) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByText(/الصفحة 1 من 1/)).toBeTruthy();
  });

  it("shows a recoverable no-results state and exposes sort direction", () => {
    render(<AdminTable definition={adminTables.users} />);
    fireEvent.click(screen.getByRole("button", { name: /المستخدم/ }));
    expect(screen.getByRole("columnheader", { name: /المستخدم/ }).getAttribute("aria-sort")).toBe("descending");
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "غير موجود" } });
    expect(screen.getByRole("heading", { name: "لا توجد أمثلة مطابقة" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "مسح المرشحات" }));
    expect(screen.getByRole("table")).toBeTruthy();
  });

  it("validates the preview editor and never treats local application as persistence", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const storageSpy = vi.spyOn(Storage.prototype, "setItem");
    const { container } = render(<AdminRecordEditor kind="offerings" isNew />);
    const form = container.querySelector("form")!;
    expect(form.noValidate).toBe(true);
    fireEvent.submit(form);
    const title = screen.getByLabelText(/عنوان المحتوى/);
    expect(document.activeElement).toBe(title);
    expect(title.getAttribute("aria-invalid")).toBe("true");
    const error = document.getElementById(title.getAttribute("aria-describedby")!);
    expect(error?.textContent).toContain("اكتب عنوانًا");
    fireEvent.change(title, { target: { value: "مسودة محلية" } });
    fireEvent.submit(form);
    expect(screen.getByRole("status").textContent).toBe(localChangeMessage);
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(storageSpy).not.toHaveBeenCalled();
  });

  it("reorders content locally with accessible boundary controls", () => {
    const { container } = render(<AdminRecordEditor kind="subjects" />);
    const up = screen.getByRole("button", { name: "رفع تمهيد توضيحي" });
    expect((up as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "خفض تمهيد توضيحي" }));
    const list = container.querySelector<HTMLOListElement>(".admin-reorder-list")!;
    expect(within(list).getAllByRole("listitem")[0].textContent).toContain("موضوع تعليمي تجريبي");
    expect(screen.getByRole("status").textContent).toBe(localChangeMessage);
  });

  it("starts permissions unspecified and reports no grant when toggled", () => {
    render(<RoleMatrix />);
    const checkboxes = screen.getAllByRole("checkbox") as HTMLInputElement[];
    expect(checkboxes.every((input) => !input.checked)).toBe(true);
    fireEvent.click(checkboxes[0]);
    expect(checkboxes[0].checked).toBe(true);
    expect(screen.getByRole("status").textContent).toBe(localChangeMessage);
    expect(screen.getByText(/دور مسؤول النظام محمي/)).toBeTruthy();
  });

  it("validates message fields and explicitly reports no send", () => {
    const { container } = render(<MessageComposer campaign />);
    const form = container.querySelector("form")!;
    fireEvent.submit(form);
    expect(screen.getByRole("alert").textContent).toContain("عنوانًا");
    fireEvent.change(screen.getByLabelText(/عنوان الرسالة/), { target: { value: "رسالة تجريبية" } });
    fireEvent.submit(form);
    expect(screen.getByRole("alert").textContent).toContain("نصًا");
    fireEvent.change(screen.getByLabelText(/نص الرسالة/), { target: { value: "محتوى محلي" } });
    fireEvent.submit(form);
    expect(screen.getByRole("status").textContent).toContain("لم تُرسل أي رسالة");
  });

  it("filters and opens anonymous moderation context without network, storage or decisions", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const storageSpy = vi.spyOn(Storage.prototype, "setItem");
    render(<AdminModeration />);
    fireEvent.click(screen.getByRole("button", { name: /طلب مراجعة تعليق توضيحي/ }));
    const context = screen.getByRole("region", { name: "سياق طلب المراجعة" });
    expect(within(context).getByText("متعلم تجريبي 03")).toBeTruthy();
    expect(screen.getByRole("status").textContent).toBe(localChangeMessage);
    expect(screen.getByText(/ضمن OP-9/)).toBeTruthy();
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "غير موجود" } });
    expect(screen.getByRole("heading", { name: "لا توجد أمثلة مطابقة" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "مسح البحث" }));
    expect(screen.getByRole("button", { name: /طلب مراجعة تعليق توضيحي/ })).toBeTruthy();
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(storageSpy).not.toHaveBeenCalled();
  });
});

it("keeps admin fixture links in the explicit preview namespace",()=>{
 const {container}=render(<AdminExperience path={["admin","users"]}/>);
 for(const link of container.querySelectorAll("a"))expect(link.getAttribute("href")).not.toMatch(/^\/admin\//);
});
