import "server-only";
import { z } from "zod";
import { apiRequest } from "@/lib/api/client";
import { ApiError } from "@/lib/api/errors";
import type { AuditLogCollection, AuditQuery } from "./types";

// JSON numeric identifiers cannot represent the backend's entire bigint range.
// Reject unsafe values rather than present a rounded historical identity.
const safeId = z.number().int().positive().max(Number.MAX_SAFE_INTEGER);
const cursor = z.string().regex(/^[A-Za-z0-9_-]+$/).max(2048).nullable();
const auditCollectionSchema = z.object({
  data: z.array(z.object({
    id: safeId,
    actor_id: safeId.nullable(),
    action: z.string().nullable(),
    subject_type: z.string().nullable(),
    subject_id: z.string().nullable(),
    request_id: z.string().nullable(),
    created_at: z.iso.datetime(),
  })),
  links: z.object({ first: z.string().nullable(), last: z.string().nullable(), prev: z.string().nullable(), next: z.string().nullable() }),
  meta: z.object({ path: z.string(), per_page: z.number().int().min(1).max(100), next_cursor: cursor, prev_cursor: cursor }),
});

export async function listAuditLogs(token: string, query: AuditQuery): Promise<AuditLogCollection> {
  const payload = await apiRequest<unknown>("/admin/audit-logs", { token, query });
  const result = auditCollectionSchema.safeParse(payload);
  if (!result.success) throw new ApiError(502, "تعذر تحميل سجل التدقيق.");
  // Zod objects explicitly project the boundary; extra model/snapshot keys stay out.
  return result.data;
}
