// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ConfirmationDialog } from "./confirmation-dialog";
afterEach(cleanup);
it("confirms only after explicit review and restores focus on cancel", () => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
  };
  const confirm = vi.fn();
  render(
    <ConfirmationDialog
      title="تغيير الحالة"
      description="سيؤثر على الوصول"
      confirmLabel="تأكيد التغيير"
      pending={false}
      onConfirm={confirm}
    >
      حفظ
    </ConfirmationDialog>,
  );
  fireEvent.click(screen.getByRole("button", { name: "حفظ" }));
  expect(confirm).not.toHaveBeenCalled();
  expect(document.activeElement?.textContent).toBe("إلغاء");
  fireEvent.click(screen.getByRole("button", { name: "إلغاء" }));
  expect(document.activeElement?.textContent).toBe("حفظ");
  fireEvent.click(screen.getByRole("button", { name: "حفظ" }));
  fireEvent.click(screen.getByRole("button", { name: "تأكيد التغيير" }));
  expect(confirm).toHaveBeenCalledTimes(1);
});
it("prevents confirmation while pending", () => {
  const confirm = vi.fn();
  render(
    <ConfirmationDialog
      title="تغيير"
      description="أثر"
      confirmLabel="تأكيد"
      pending
      onConfirm={confirm}
    >
      حفظ
    </ConfirmationDialog>,
  );
  expect(
    screen
      .getByRole("button", { name: "جارٍ الحفظ…" })
      .hasAttribute("disabled"),
  ).toBe(true);
});
