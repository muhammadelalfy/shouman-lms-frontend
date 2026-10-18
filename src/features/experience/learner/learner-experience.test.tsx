// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LearnerExperience } from "./learner-experience";
import { LearningList } from "./learning-list";
import { LessonWorkspace } from "./lesson-workspace";
import { QuizWorkspace } from "./quiz-workspace";
import { NotificationInbox, PreviewPreferences, ProjectFilePicker } from "./learner-controls";

afterEach(cleanup);
beforeEach(() => {
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => { callback(0); return 0; });
});

describe("learner route presentations", () => {
  it.each([
    ["dashboard", "خطوة جديدة في رحلة التعلّم"],
    ["learning", "تعلّمي"],
    ["my-learning", "تعلّمي"],
    ["learning/lessons/demo-lesson", "معاني القرب من الله"],
    ["learn/demo-track/demo-lesson", "معاني القرب من الله"],
    ["quizzes", "الاختبارات والمراجعات"],
    ["quizzes/demo-quiz", "مراجعة رحلة التأسيس"],
    ["quizzes/demo-quiz/result", "مساحة لمراجعة التجربة"],
    ["certificates", "شهاداتي"],
    ["certificates/demo-certificate", "نموذج الشهادة"],
    ["projects", "مشروعاتي"],
    ["projects/demo-project", "مشروع التأمل والتلخيص"],
    ["notifications", "التنبيهات"],
    ["achievements", "الشارات والإنجازات"],
    ["orders", "الطلبات والمشتريات"],
    ["preview/account", "معاينة الحساب والتفضيلات"],
    ["instructor", "مساحة المعلّم"],
    ["supervisor", "مساحة المشرف"],
    ["evaluator", "مساحة المقيّم"],
  ])("renders the dedicated heading for /%s", (path, heading) => {
    render(<LearnerExperience path={path.split("/")} />);
    expect(screen.getByRole("heading", { level: 1, name: heading })).toBeTruthy();
  });

  it("marks the certificate as an unissued specimen and does not render a real QR", () => {
    render(<LearnerExperience path={["certificates", "demo-certificate"]} />);
    expect(screen.getByText("معاينة فقط · لم تُصدر هذه الشهادة")).toBeTruthy();
    expect(screen.getByText("لا يوجد رمز تحقق")).toBeTruthy();
    expect(screen.getByText("لا توجد شهادة صادرة، ولا أهلية أو إثبات إتمام أو رقم تحقق حقيقي.", { exact: false })).toBeTruthy();
    expect(screen.queryByRole("link", { name: /تنزيل|مشاركة/ })).toBeNull();
  });
});

describe("local learner interactions", () => {
  it("filters sample learning and recovers from an empty query result", () => {
    render(<LearningList />);
    fireEvent.click(screen.getByRole("button", { name: "المكتمل" }));
    expect(screen.getByRole("heading", { name: "محطات من السيرة النبوية" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "رحلة التأسيس الإيماني" })).toBeNull();
    fireEvent.change(screen.getByRole("searchbox", { name: "ابحث في أمثلة تعلمي" }), { target: { value: "غير موجود" } });
    expect(screen.getByRole("heading", { name: "لا توجد أمثلة مطابقة" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "مسح الفلاتر" }));
    expect(screen.getAllByRole("article")).toHaveLength(4);
  });

  it("changes the lesson outline and keeps notes explicitly temporary", () => {
    render(<LessonWorkspace />);
    fireEvent.click(screen.getByRole("button", { name: /الدرس 1: لماذا نبدأ بمعرفة الله/ }));
    expect(screen.getByRole("heading", { level: 1, name: "لماذا نبدأ بمعرفة الله؟" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "ملاحظاتي المؤقتة" }));
    fireEvent.change(screen.getByRole("textbox", { name: "ملاحظات هذه المعاينة" }), { target: { value: "سؤال للمراجعة" } });
    expect(screen.getByRole("status").textContent).toContain("لم يتم الحفظ");
    fireEvent.click(screen.getByRole("button", { name: "مسح النص المؤقت" }));
    expect((screen.getByRole("textbox") as HTMLTextAreaElement).value).toBe("");
  });

  it("reviews local quiz answers without grading or submitting a result", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    render(<QuizWorkspace />);
    fireEvent.click(screen.getByRole("radio", { name: /تلخيص الأفكار بلغتك/ }));
    fireEvent.click(screen.getByRole("button", { name: "السؤال التالي" }));
    fireEvent.click(screen.getByRole("radio", { name: /تدوين السؤال والرجوع/ }));
    fireEvent.click(screen.getByRole("button", { name: "السؤال التالي" }));
    fireEvent.click(screen.getByRole("button", { name: "مراجعة الاختيارات" }));
    expect(screen.getByRole("heading", { name: "مراجعة اختياراتك" })).toBeTruthy();
    expect(screen.getByText(/اخترت إجابة عن 2 من 3 أسئلة/)).toBeTruthy();
    expect(screen.getByText("لم تحدد إجابة")).toBeTruthy();
    expect(fetchSpy).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "مسح الاختيارات والبدء مجددًا" }));
    expect(screen.getAllByRole("radio").every((radio) => !(radio as HTMLInputElement).checked)).toBe(true);
    expect(screen.getByRole("status").textContent).toContain("0 / 3");
  });

  it("applies read state in memory and shows the unread empty state", () => {
    render(<NotificationInbox />);
    fireEvent.click(screen.getByRole("button", { name: "تجربة تعليم الكل كمقروء" }));
    fireEvent.click(screen.getByRole("button", { name: "غير المقروءة (0)" }));
    expect(screen.getByRole("heading", { name: "انتهت أمثلة غير المقروء" })).toBeTruthy();
    expect(screen.getByRole("status").textContent).toContain("لم يتم حفظها");
  });

  it("shows selected file metadata without uploading or reading it", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const readerSpy = vi.spyOn(File.prototype, "text");
    render(<ProjectFilePicker />);
    fireEvent.change(screen.getByLabelText(/اختر ملفات من جهازك/), { target: { files: [new File(["sample"], "notes.txt", { type: "text/plain" })] } });
    expect(screen.getByText("notes.txt")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "استعرض حالة التسليم" }));
    expect(screen.getByRole("status").textContent).toContain("لم يتم الإرسال أو الحفظ");
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(readerSpy).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "مسح الاختيار" }));
    expect(screen.queryByText("notes.txt")).toBeNull();
  });

  it("does not imply preview preferences were saved", () => {
    render(<PreviewPreferences />);
    fireEvent.click(screen.getByRole("checkbox", { name: /تنبيهات التعلم بالبريد/ }));
    fireEvent.click(screen.getByRole("button", { name: "استعرض التفضيلات المحددة" }));
    expect(screen.getByRole("status").textContent).toContain("لم يتم الإرسال أو الحفظ");
    expect(screen.getByRole("button", { name: "استعرض التفضيلات المحددة" }).closest("form")?.noValidate).toBe(true);
  });
});
