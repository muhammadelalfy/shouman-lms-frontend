// @vitest-environment jsdom
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
import { act, cleanup, fireEvent, render, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AdminOffering, AdminSubject } from "../types";
import { OutlineEditor } from "./outline-editor";
import { reorderContentAction } from "./actions";

vi.mock("./actions", () => ({ reorderContentAction: vi.fn() }));
vi.mock("./content-controls", () => ({ ContentControls: () => null }));
const subject = (id: number, position: number): AdminSubject => ({
  id, position, offering_id: 1, title: `مادة ${id}`, description: null,
  status: "draft", published_at: null,
  lessons: [11, 12, 13].map((id, index) => ({ id, subject_id: 1, position: index + 1,
    title: `درس ${id}`, description: null, summary: null, key_points: [],
    estimated_duration_minutes: null, status: "draft", published_at: null })),
});
const offering = (ids = [1, 2, 3], id = 1) => ({ id, subjects: ids.map((id, index) => subject(id, index + 1)) }) as AdminOffering;
const view = (data: AdminOffering) => <OutlineEditor offering={data} manage publish={false} />;
function editor(container: HTMLElement, lessons = false) {
  return Array.from(container.querySelectorAll("details")).find(d => d.querySelector("summary")?.textContent === `ترتيب ${lessons ? "الدروس" : "المواد"}`)!;
}
const ids = (details: Element) => (details.querySelector('[name="ids"]') as HTMLInputElement).value;
afterEach(cleanup);
beforeEach(() => vi.mocked(reorderContentAction).mockReset().mockResolvedValue({ status: "success", message: "تم حفظ الترتيب" }));

describe("outline order refresh", () => {
  it.each([false, true])("preserves saved feedback, expanded disclosure and focus after persisted refresh (lessons=%s)", async lessons => {
    const data = offering();
    const { container, rerender } = render(view(data));
    const details = editor(container, lessons);
    details.open = true;
    fireEvent.click(within(details).getByRole("button", { name: lessons ? "تأخير درس 11" : "تأخير مادة 1" }));
    const save = within(details).getByRole("button", { name: "حفظ الترتيب" });
    await act(async () => fireEvent.submit(details.querySelector("form")!));
    save.focus();
    expect(within(details.querySelector("form")!).getByRole("status").textContent).toContain("تم حفظ الترتيب");
    if (lessons) {
      data.subjects![0].lessons = [data.subjects![0].lessons![1], data.subjects![0].lessons![0], data.subjects![0].lessons![2]].map((l, i) => ({ ...l, position: i + 1 }));
    } else data.subjects = [2, 1, 3].map((id, i) => subject(id, i + 1));
    rerender(view(data));
    const refreshed = editor(container, lessons);
    expect(refreshed).toBe(details);
    expect(refreshed.open).toBe(true);
    expect(document.activeElement).toBe(save);
    expect(within(refreshed).getByRole("status").textContent).toContain("تم حفظ الترتيب");
    expect(ids(refreshed)).toBe(lessons ? "12,11,13" : "2,1,3");
  });

  it("adopts refreshed server order when clean but preserves a local rearrangement", () => {
    const { container, rerender } = render(view(offering()));
    rerender(view(offering([3, 2, 1])));
    const details = editor(container);
    expect(ids(details)).toBe("3,2,1");
    details.open = true;
    fireEvent.click(within(details).getByRole("button", { name: "تأخير مادة 3" }));
    rerender(view(offering([1, 3, 2])));
    expect(ids(editor(container))).toBe("2,3,1");
  });

  it("retains drafts on failure, reconciles membership and retries with the full current set", async () => {
    vi.mocked(reorderContentAction).mockResolvedValueOnce({ status: "error", message: "تعذر الحفظ", fieldErrors: {} });
    const { container, rerender } = render(view(offering()));
    let details = editor(container);
    details.open = true;
    fireEvent.click(within(details).getByRole("button", { name: "تأخير مادة 1" }));
    await act(async () => fireEvent.submit(details.querySelector("form")!));
    expect(within(details).getByRole("alert").textContent).toContain("تعذر الحفظ");
    expect(ids(details)).toBe("2,1,3");
    rerender(view(offering([1, 2, 4])));
    details = editor(container);
    expect(ids(details)).toBe("2,1,4");
    expect(within(details).getByText(/تغيّرت القائمة/)).toBeTruthy();
    await act(async () => fireEvent.submit(details.querySelector("form")!));
    const data = vi.mocked(reorderContentAction).mock.calls.at(-1)![1];
    expect(data.get("ids")).toBe("2,1,4");
    expect(within(details.querySelector("form")!).getByRole("status").textContent).toContain("تم حفظ الترتيب");
  });

  it("does not carry drafts or feedback to another offering", async () => {
    const { container, rerender } = render(view(offering()));
    const details = editor(container);
    details.open = true;
    fireEvent.click(within(details).getByRole("button", { name: "تأخير مادة 1" }));
    await act(async () => fireEvent.submit(details.querySelector("form")!));
    rerender(view(offering([1, 2, 3], 2)));
    expect(ids(editor(container))).toBe("1,2,3");
    expect(editor(container).open).toBe(false);
    expect(within(editor(container)).queryByRole("status")).toBeNull();
  });
});
