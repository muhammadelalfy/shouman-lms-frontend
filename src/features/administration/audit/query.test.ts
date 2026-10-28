import { expect, it } from "vitest";
import { auditHref, parseAuditQuery } from "./query";

it.each([{}, { per_page: "", cursor: "" }])("uses the real default page size for %j", query => {
  expect(parseAuditQuery(query)).toEqual({ success: true, values: { per_page: "25" } });
});
it.each(["1", "100", "25"])("accepts supported size %s and opaque cursor", per_page => {
  expect(parseAuditQuery({ per_page, cursor: "eyJpZCI6MX0" })).toEqual({ success: true, values: { per_page, cursor: "eyJpZCI6MX0" } });
});
it.each([
  { per_page: "0" }, { per_page: "101" }, { per_page: "1.5" }, { per_page: ["25", "100"] },
  { cursor: ["one", "two"] }, { cursor: "a".repeat(2049) }, { cursor: "bad=cursor" },
  { action: "identity.user.status_changed" }, { search: "private" }, { page: "1" },
])("rejects unsupported or malformed query %j", query => expect(parseAuditQuery(query)).toEqual({ success: false }));
it("builds only a local audit destination from supported values", () => {
  expect(auditHref({ per_page: "100", cursor: "opaque_cursor" })).toBe("/admin/audit-logs?per_page=100&cursor=opaque_cursor");
});
