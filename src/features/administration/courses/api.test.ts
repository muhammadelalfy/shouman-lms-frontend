import { expect, it, vi } from "vitest";
vi.mock("@/lib/api/client", () => ({ apiRequest: vi.fn() }));
import { apiRequest } from "@/lib/api/client";
import {
  deleteOffering,
  reorderSubjects,
  reorderLessons,
  createSubject,
  createLesson,
  setContentStatus,
  updateOffering,
} from "./api";
it("handles deletion 204 without requiring an envelope", async () => {
  vi.mocked(apiRequest).mockResolvedValue(undefined);
  await expect(deleteOffering("token", 4)).resolves.toBeUndefined();
  expect(apiRequest).toHaveBeenLastCalledWith("/admin/offerings/4", {
    token: "token",
    method: "DELETE",
  });
});
it("sends full sibling order and verified nested routes", async () => {
  vi.mocked(apiRequest).mockResolvedValue({ data: { id: 1 } });
  await reorderSubjects("t", 4, [3, 1, 2]);
  expect(apiRequest).toHaveBeenLastCalledWith(
    "/admin/offerings/4/subjects/order",
    { token: "t", method: "PUT", body: { ids: [3, 1, 2] } },
  );
  await reorderLessons("t", 5, [8, 9]);
  expect(apiRequest).toHaveBeenLastCalledWith(
    "/admin/subjects/5/lessons/order",
    { token: "t", method: "PUT", body: { ids: [8, 9] } },
  );
  await createSubject("t", 4, { title: "ab" });
  expect(apiRequest).toHaveBeenLastCalledWith("/admin/offerings/4/subjects", {
    token: "t",
    method: "POST",
    body: { title: "ab" },
  });
  await createLesson("t", 5, { title: "ab" });
  expect(apiRequest).toHaveBeenLastCalledWith("/admin/subjects/5/lessons", {
    token: "t",
    method: "POST",
    body: { title: "ab" },
  });
});
it("never sends create-only kind in full replacement update", async () => {
  vi.mocked(apiRequest).mockResolvedValue({ data: { id: 1 } });
  await updateOffering("t", 4, { title: "test", kind: "course" } as never);
  expect(apiRequest).toHaveBeenLastCalledWith("/admin/offerings/4", {
    token: "t",
    method: "PUT",
    body: { title: "test" },
  });
});
it("propagates rejected publication transitions", async () => {
  vi.mocked(apiRequest).mockRejectedValue(new Error("conflict"));
  await expect(
    setContentStatus("t", "lessons", 2, "published"),
  ).rejects.toThrow("conflict");
});
