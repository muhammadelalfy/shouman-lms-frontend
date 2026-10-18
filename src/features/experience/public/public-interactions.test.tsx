// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ImgHTMLAttributes } from "react";
import { AgendaExplorer, CertificateVerifier, CheckoutPreview, CommunityComposer, ContactPreview, DiscoveryExplorer, FaqExplorer } from "./public-interactions";
import { PublicExperience } from "./public-experience";

vi.mock("next/image", () => ({ default: (props: ImgHTMLAttributes<HTMLImageElement>) => <span role="img" aria-label={props.alt || "صورة توضيحية"} /> }));
afterEach(cleanup);

describe("public synthetic experience interactions", () => {
  it("filters only local sample cards and offers an honest empty state", () => {
    render(<DiscoveryExplorer />);
    expect(screen.getByRole("heading", { name: "تدبّر القرآن في الحياة" })).toBeTruthy();
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "الصلاة" } });
    expect(screen.getByRole("heading", { name: "بداية مع الصلاة" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "تدبّر القرآن في الحياة" })).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "دورة" }));
    expect(screen.getByRole("heading", { name: "لا توجد أمثلة مطابقة" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "افتح الفهرس" }).getAttribute("href")).toBe("/catalog");
  });

  it("filters FAQ categories without inventing official policy answers", () => {
    render(<FaqExplorer />);
    fireEvent.click(screen.getByRole("button", { name: "الشهادات" }));
    expect(screen.getByText("هل يمكن التحقق من شهادة حقيقية هنا؟")).toBeTruthy();
    expect(screen.queryByText("كيف أستكشف المسارات المتاحة؟")).toBeNull();
    const summary = screen.getByText("هل يمكن التحقق من شهادة حقيقية هنا؟");
    expect(summary.tagName).toBe("SUMMARY");
    expect(screen.getByText(/ليست سياسات رسمية/)).toBeTruthy();
  });

  it("switches upcoming and past sample meetings", () => {
    render(<AgendaExplorer type="meeting" />);
    expect(screen.getByRole("heading", { name: "مجلس: من العلم إلى العمل" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "السابقة — نموذج" }));
    expect(screen.getByRole("heading", { name: "لقاء سابق: صحبة في رحلة التعلّم" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "مجلس: من العلم إلى العمل" })).toBeNull();
  });

  it("keeps community text local and never adds a pretend posted message", () => {
    const send = vi.fn();
    vi.stubGlobal("fetch", send);
    render(<CommunityComposer />);
    fireEvent.click(screen.getByRole("button", { name: "معاينة الإرسال" }));
    expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe("true");
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "مسودة اختبار" } });
    fireEvent.click(screen.getByRole("button", { name: "معاينة الإرسال" }));
    expect(screen.getByRole("status").textContent).toContain("لم يتم الإرسال أو الحفظ");
    expect(screen.getByRole("status").textContent).toContain("مسودة محلية");
    expect(send).not.toHaveBeenCalled();
  });

  it("does not apply a coupon or compute a price", () => {
    render(<CheckoutPreview />);
    fireEvent.change(screen.getByLabelText("رمز تجريبي"), { target: { value: "DEMO" } });
    fireEvent.click(screen.getByRole("button", { name: "معاينة تطبيق الرمز" }));
    expect(screen.getByRole("status").textContent).toContain("لم يتم تطبيق رمز أو احتساب خصم");
    expect(screen.getByText("مزود الدفع لم يُعتمد بعد")).toBeTruthy();
  });

  it("labels every payment result as a composition without confirming an order", () => {
    render(<CheckoutPreview result />);
    fireEvent.click(screen.getByRole("button", { name: "اكتمال المعالجة — نموذج" }));
    expect(screen.getByRole("heading", { name: "نموذج شاشة اكتمال المعالجة" })).toBeTruthy();
    expect(screen.getByText(/لم يتم الدفع أو إنشاء طلب أو تفعيل محتوى/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "تعذّر المعالجة — نموذج" }));
    expect(screen.getByText(/لم تُجرَ محاولة دفع ولم يُخصم أي مبلغ/)).toBeTruthy();
  });

  it("does not verify a real certificate or fabricate a valid status", () => {
    const send = vi.fn();
    vi.stubGlobal("fetch", send);
    render(<CertificateVerifier initialCode="UNTRUSTED-123" />);
    fireEvent.click(screen.getByRole("button", { name: "معاينة التحقق" }));
    expect(screen.getByRole("status").textContent).toContain("لا يمكن تحديد صلاحية الرقم");
    expect(send).not.toHaveBeenCalled();
  });

  it("validates contact preview fields while stating that nothing was sent", () => {
    render(<ContactPreview />);
    fireEvent.click(screen.getByRole("button", { name: "معاينة إرسال الرسالة" }));
    expect(screen.getByLabelText("موضوع الرسالة التجريبية").getAttribute("aria-invalid")).toBe("true");
    fireEvent.change(screen.getByLabelText("موضوع الرسالة التجريبية"), { target: { value: "سؤال عام" } });
    fireEvent.change(screen.getByLabelText("نص تجريبي"), { target: { value: "اختبار واجهة" } });
    fireEvent.click(screen.getByRole("button", { name: "معاينة إرسال الرسالة" }));
    expect(screen.getByRole("status").textContent).toContain("لم يتم الإرسال أو الحفظ");
  });

  it.each([
    ["search", "خطوتك التالية تبدأ بسؤال"],
    ["catalog/search", "خطوتك التالية تبدأ بسؤال"],
    ["preview/catalog", "أمثلة تصميم المحتوى التعليمي"],
    ["faq", "أسئلة توضيحية، وإجابات واضحة"],
    ["about", "علمٌ يوجّه الرحلة، وتربيةٌ تصنع الأثر"],
    ["contact", "كيف يمكن أن نساعدك؟"],
    ["events/demo-event", "خريطة البداية في طلب العلم"],
    ["events", "ورش تفتح آفاق التعلّم"],
    ["meetings", "مجالس علم، ومساحة للسؤال"],
    ["meetings/demo-meeting", "مجلس: من العلم إلى العمل"],
    ["meetings/mine", "لقاءاتي — نموذج تصميم"],
    ["community", "صحبةٌ تعين على الفهم والاستمرار"],
    ["community/groups/demo-group", "رفقة البداية"],
    ["community/groups/demo-group/posts/demo-post", "نقاش: بداية رحلة التعلّم"],
    ["checkout/demo-course/result", "حالات متابعة الطلب"],
    ["checkout/demo-course", "خطوة واضحة قبل المتابعة"],
    ["verify", "التحقق يبدأ من المصدر"],
    ["certificates/verify", "التحقق يبدأ من المصدر"],
    ["verify/demo-certificate", "التحقق يبدأ من المصدر"],
    ["preview/catalog/demo-course", "تدبّر القرآن في الحياة"],
  ])("renders the dedicated screen %s", (route, title) => {
    render(<PublicExperience path={route.split("/")} query={{}} />);
    expect(screen.getByRole("heading", { level: 1, name: title })).toBeTruthy();
  });
});
