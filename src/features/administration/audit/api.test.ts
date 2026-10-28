import { beforeEach, expect, it, vi } from "vitest";
vi.mock("@/lib/api/client", () => ({ apiRequest: vi.fn() }));
import { apiRequest } from "@/lib/api/client";
import { listAuditLogs } from "./api";

const row = { id: 8, actor_id: 2, action: "identity.user.status_changed", subject_type: "user", subject_id: "3", request_id: "audit-request-8", created_at: "2026-10-28T12:30:00.000000Z" };
const envelope = () => ({ data: [row], links: { first: null, last: null, prev: null, next: "https://hostile.invalid/private" }, meta: { path: "https://hostile.invalid", per_page: 25, next_cursor: "opaque_cursor", prev_cursor: null } });
beforeEach(() => vi.resetAllMocks());
it("uses the server API and explicitly projects the consumed seven fields", async () => {
  vi.mocked(apiRequest).mockResolvedValue({ ...envelope(), data: [{ ...row, old_values: { secret: "SECRET" }, ip: "SECRET", actor: { email: "SECRET" } }] });
  const result = await listAuditLogs("server-token", { per_page: "25", cursor: "opaque_cursor" });
  expect(apiRequest).toHaveBeenCalledWith("/admin/audit-logs", { token: "server-token", query: { per_page: "25", cursor: "opaque_cursor" } });
  expect(result.data).toEqual([row]);
  expect(Object.keys(result.data[0])).toHaveLength(7);
  expect(JSON.stringify(result.data)).not.toContain("SECRET");
});
it("preserves genuine empty data and nullable metadata", async () => {
  vi.mocked(apiRequest).mockResolvedValue({ ...envelope(), data: [] });
  expect((await listAuditLogs("token", { per_page: "25" })).data).toEqual([]);
  vi.mocked(apiRequest).mockResolvedValue({ ...envelope(), data: [{ ...row, actor_id: null, action: null, subject_type: null, subject_id: null, request_id: null }] });
  expect((await listAuditLogs("token", { per_page: "25" })).data[0].actor_id).toBeNull();
});
it.each([
  null, {}, { data: null }, { ...envelope(), meta: null }, { ...envelope(), links: [] },
  { ...envelope(), meta: { ...envelope().meta, next_cursor: 42 } },
  ...[NaN, 0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1].map(id => ({ ...envelope(), data: [{ ...row, id }] })),
  { ...envelope(), data: [{ ...row, actor_id: Number.MAX_SAFE_INTEGER + 1 }] },
  { ...envelope(), data: [{ ...row, action: {} }] },
  { ...envelope(), data: [{ ...row, subject_id: 3 }] },
  { ...envelope(), data: [{ ...row, created_at: "yesterday" }] },
  { ...envelope(), data: [{ ...row, created_at: "2026-10-28T12:30:00+03:00" }] },
])("rejects malformed/unsafe success payload %# instead of inventing empty data", async payload => {
  vi.mocked(apiRequest).mockResolvedValue(payload);
  await expect(listAuditLogs("token", { per_page: "25" })).rejects.toThrow();
});
