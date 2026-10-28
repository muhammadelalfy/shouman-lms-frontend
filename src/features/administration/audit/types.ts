import type { CursorPaginated } from "@/lib/api/types";

/** Only the redacted metadata returned by the Administration audit resource. */
export interface AuditLog {
  id: number;
  actor_id: number | null;
  action: string | null;
  subject_type: string | null;
  subject_id: string | null;
  request_id: string | null;
  created_at: string;
}
export type AuditLogCollection = CursorPaginated<AuditLog>;
export type AuditQuery = { per_page: string; cursor?: string };
export type AuditPageQuery = Record<string, string | string[] | undefined>;
