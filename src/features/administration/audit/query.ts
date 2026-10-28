import { z } from "zod";
import type { AuditPageQuery, AuditQuery } from "./types";

export const auditPath = "/admin/audit-logs";
const querySchema = z.object({
  per_page: z.string().regex(/^\d+$/).refine(value => Number(value) >= 1 && Number(value) <= 100).optional(),
  cursor: z.string().regex(/^[A-Za-z0-9_-]+$/).max(2048).optional(),
}).strict();

export function parseAuditQuery(query: AuditPageQuery): { success: true; values: AuditQuery } | { success: false } {
  const normalized = Object.fromEntries(Object.entries(query).map(([key, value]) => [key, value === "" ? undefined : value]));
  const result = querySchema.safeParse(normalized);
  if (!result.success) return { success: false };
  return { success: true, values: { per_page: String(Number(result.data.per_page ?? 25)), ...(result.data.cursor ? { cursor: result.data.cursor } : {}) } };
}

export function auditHref(query: AuditQuery): string {
  return `${auditPath}?${new URLSearchParams(query)}`;
}
