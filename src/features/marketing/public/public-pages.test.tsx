// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PublicMarketingPage } from "./public-pages";
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
describe("MARKETING-FE-PUBLIC", () => {
  it("preserves optional guidance choices on back and clears them on restart", () => {
    render(<PublicMarketingPage page="orientation" />);
    fireEvent.click(screen.getByRole("radio", { name: "المعهد القرآني الدعوي" }));
    fireEvent.click(screen.getByRole("button", { name: "التالي" }));
    fireEvent.click(screen.getByRole("radio", { name: "فهم تجربة التعلّم مع صحبة" }));
    fireEvent.click(screen.getByRole("button", { name: "السابق" }));
    expect((screen.getByRole("radio", { name: "المعهد القرآني الدعوي" }) as HTMLInputElement).checked).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "التالي" }));
    expect((screen.getByRole("radio", { name: "فهم تجربة التعلّم مع صحبة" }) as HTMLInputElement).checked).toBe(true);
    fireEvent.click(screen.getByRole("button", { name: "عرض التوجيه التوضيحي" }));
    expect(screen.getByText("المعهد القرآني الدعوي").tagName).toBe("STRONG");
    expect(screen.getByRole("link", { name: "تعرّف إلى رفيق العلم" }).getAttribute("href")).toBe("/preview/marketing/companions");
    fireEvent.click(screen.getByRole("button", { name: "ابدأ من جديد" }));
    expect(screen.getAllByRole("radio").every(input => !(input as HTMLInputElement).checked)).toBe(true);
  });
  it("allows skipping all answers without a score or enrollment prerequisite", () => {
    render(<PublicMarketingPage page="orientation" />);
    expect(screen.getByRole("link", { name: "استكشاف المسارات دون أسئلة" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "التالي" }));
    fireEvent.click(screen.getByRole("button", { name: "عرض التوجيه التوضيحي" }));
    expect(screen.getByText(/لم تحدد مجالًا بعينه/)).toBeTruthy();
    expect(screen.getByText(/ليس تقييمًا لمستواك/)).toBeTruthy();
  });
  it("exposes missing intro media for every sample track without fake video", () => {
    const { container } = render(<PublicMarketingPage page="tracks" />);
    expect(screen.getAllByText("الفيديو التعريفي غير متاح")).toHaveLength(3);
    expect(screen.getAllByText("نموذج توضيحي")).toHaveLength(3);
    expect(container.querySelector("video,iframe")).toBeNull();
    expect(screen.getByText(/لا يُفرض مستوى سابق/)).toBeTruthy();
  });
  it("explores challenge themes without activating content or enrollment", () => {
    render(<PublicMarketingPage page="challenges" />);
    fireEvent.click(screen.getByRole("button", { name: "نافذة على السيرة" }));
    expect(screen.getByRole("heading", { name: "نافذة على السيرة" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "نافذة على السيرة" }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByText(/المحتوى والمدة غير معتمدين/)).toBeTruthy();
  });
  it("validates scholarship drafts and invalidates preview after edits without network", () => {
    const fetch = vi.fn(); vi.stubGlobal("fetch", fetch);
    render(<PublicMarketingPage page="scholarships" />);
    fireEvent.click(screen.getByRole("button", { name: "معاينة المسودة المحلية" }));
    const input = screen.getByLabelText("موضوع تعلّم تجريبي");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(document.activeElement).toBe(input);
    fireEvent.change(input, { target: { value: "قراءة تجريبية" } });
    fireEvent.click(screen.getByRole("button", { name: "معاينة المسودة المحلية" }));
    expect(screen.getByRole("status").textContent).toContain("لم يتم إرسال طلب أو حفظه");
    fireEvent.change(input, { target: { value: "موضوع آخر" } });
    expect(screen.queryByRole("status")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "مسح المسودة" }));
    expect((input as HTMLInputElement).value).toBe("");
    expect(fetch).not.toHaveBeenCalled();
  });
  it("uses privacy-safe family and authentic-story empty states", () => {
    const { rerender } = render(<PublicMarketingPage page="family" />);
    expect(screen.getByRole("heading", { name: "بيانات الأسرة غير متاحة" })).toBeTruthy();
    expect(screen.getByText(/لن نعرض أسماء أطفال/)).toBeTruthy();
    rerender(<PublicMarketingPage page="stories" />);
    expect(screen.getByRole("heading", { name: "بانتظار قصص حقيقية موثّقة" })).toBeTruthy();
  });
  it("labels badge templates as unearned and seasonal promotion as nonrestrictive", () => {
    const { rerender } = render(<PublicMarketingPage page="badges" />);
    expect(screen.getAllByText("لم تُمنح")).toHaveLength(3);
    rerender(<PublicMarketingPage page="seasons" />);
    expect(screen.getByText(/دون فرض نافذة للتسجيل/)).toBeTruthy();
  });
  it("links learner discovery without staff tools or institutional plans", () => {
    render(<PublicMarketingPage page="overview" />);
    expect(screen.getAllByRole("link")).toHaveLength(12);
    expect(screen.getByRole("link", { name: /شهادتي ورمز التحقق/ }).getAttribute("href")).toBe("/preview/marketing/certificate");
    expect(screen.queryByRole("link", { name: /بطاقة المسار|رسالة إلى طلابك/ })).toBeNull();
    expect(screen.queryByText(/اشتراكات مؤسسية/)).toBeNull();
  });
});
