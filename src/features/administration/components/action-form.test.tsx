// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { ActionForm } from "./action-form";
import { Field } from "./fields";
afterEach(cleanup);
it("retains drafts and associates server field errors with the input", async () => {
  const action = vi.fn(async () => ({
    status: "error" as const,
    message: "راجع العنوان",
    fieldErrors: { title: ["عنوان غير صالح"] },
  }));
  const { container } = render(
    <ActionForm action={action}>
      <Field name="title" label="العنوان" value="مسودة" />
    </ActionForm>,
  );
  fireEvent.change(screen.getByLabelText("العنوان"), {
    target: { value: "مسودة معدلة" },
  });
  fireEvent.submit(container.querySelector("form")!);
  await waitFor(() => expect(screen.getByRole("alert")).toBeTruthy());
  const input = screen.getByLabelText("العنوان") as HTMLInputElement;
  expect(input.value).toBe("مسودة معدلة");
  expect(input.getAttribute("aria-invalid")).toBe("true");
  expect(
    document.getElementById(input.getAttribute("aria-describedby")!)
      ?.textContent,
  ).toContain("عنوان غير صالح");
  await waitFor(() => expect(document.activeElement).toBe(input));
});
it("associates nested action schema errors with their field", async () => {
  const action = async () => ({
    status: "error" as const,
    message: "راجع العنوان",
    fieldErrors: { "input.title": ["عنوان قصير"] },
  });
  const { container } = render(
    <ActionForm action={action}>
      <Field name="title" label="العنوان" value="a" />
    </ActionForm>,
  );
  fireEvent.submit(container.querySelector("form")!);
  await waitFor(() =>
    expect(screen.getByLabelText("العنوان").getAttribute("aria-invalid")).toBe(
      "true",
    ),
  );
});
