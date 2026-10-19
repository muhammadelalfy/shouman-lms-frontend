import { beforeEach, expect, it, vi } from "vitest";
vi.mock("../server/access", () => ({ requireMutationAccess: vi.fn() }));
vi.mock("./api", () => ({
  getOffering: vi.fn(),
  createOffering: vi.fn(),
  updateOffering: vi.fn(),
  deleteOffering: vi.fn(),
  setContentStatus: vi.fn(),
  setInstructors: vi.fn(),
  createSubject: vi.fn(),
  updateSubject: vi.fn(),
  deleteSubject: vi.fn(),
  createLesson: vi.fn(),
  updateLesson: vi.fn(),
  deleteLesson: vi.fn(),
  reorderSubjects: vi.fn(),
  reorderLessons: vi.fn(),
}));
vi.mock("next/cache", () => ({ refresh: vi.fn() }));
vi.mock("next/navigation", () => ({
  redirect: vi.fn(() => {
    throw new Error("REDIRECT");
  }),
}));
import { requireMutationAccess } from "../server/access";
import * as api from "./api";
import {
  saveSubjectAction,
  reorderContentAction,
  changeContentStatusAction,
  saveOfferingAction,
} from "./actions";
import { ApiError } from "@/lib/api/errors";
beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(requireMutationAccess).mockResolvedValue({
    token: "secret",
    user: {},
  } as never);
  vi.mocked(api.getOffering).mockResolvedValue({
    id: 4,
    kind: "course",
    subjects: [{ id: 5, offering_id: 4, lessons: [] }],
  } as never);
});
const form = (data: Record<string, string>) => {
  const f = new FormData();
  for (const [k, v] of Object.entries(data)) f.set(k, v);
  return f;
};
it("rejects a child outside its parent hierarchy", async () => {
  const s = await saveSubjectAction(
    { status: "idle" },
    form({ offering_id: "4", id: "999", title: "subject" }),
  );
  expect(s.status).toBe("error");
  expect(api.updateSubject).not.toHaveBeenCalled();
});
it("rejects incomplete or stale reorder sets", async () => {
  const s = await reorderContentAction(
    { status: "idle" },
    form({ offering_id: "4", entity: "subjects", ids: "6" }),
  );
  expect(s.status).toBe("error");
  expect(api.reorderSubjects).not.toHaveBeenCalled();
});
it("passes full valid order", async () => {
  const s = await reorderContentAction(
    { status: "idle" },
    form({ offering_id: "4", entity: "subjects", ids: "5" }),
  );
  expect(s.status).toBe("success");
  expect(api.reorderSubjects).toHaveBeenCalledWith("secret", 4, [5]);
});
it("keeps backend lifecycle rejection visible", async () => {
  vi.mocked(api.setContentStatus).mockRejectedValue(
    new ApiError(422, "invalid transition", null, {}),
  );
  const s = await changeContentStatusAction(
    { status: "idle" },
    form({
      offering_id: "4",
      entity: "offerings",
      id: "4",
      status: "published",
    }),
  );
  expect(s.status).toBe("error");
});
it("does not mutate when capability is missing", async () => {
  vi.mocked(requireMutationAccess).mockRejectedValue(
    new ApiError(403, "forbidden", null, {}),
  );
  expect(
    (
      await saveSubjectAction(
        { status: "idle" },
        form({ offering_id: "4", title: "subject" }),
      )
    ).status,
  ).toBe("error");
  expect(api.createSubject).not.toHaveBeenCalled();
});
it("preserves full replacement input and ignores forged kind on edits", async () => {
  vi.mocked(api.updateOffering).mockResolvedValue({ id: 4 } as never);
  const f = form({
    id: "4",
    title: "Course title",
    kind: "track",
    pricing: "free",
    sequencing_mode: "open",
    outline_style: "subjects",
    starts_at: "2026-10-19T10:00:00+03:00",
    goals: "goal 1\ngoal 2",
  });
  expect((await saveOfferingAction({ status: "idle" }, f)).status).toBe(
    "success",
  );
  expect(api.updateOffering).toHaveBeenCalledWith(
    "secret",
    4,
    expect.objectContaining({
      starts_at: "2026-10-19T10:00:00+03:00",
      goals: ["goal 1", "goal 2"],
      description: null,
    }),
  );
  expect(vi.mocked(api.updateOffering).mock.calls[0][2]).not.toHaveProperty(
    "kind",
  );
});
