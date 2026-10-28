import type { Metadata } from "next";
import { PlatformFrame } from "@/features/pages/page-shell";
import { AuditLogPage } from "@/features/administration/audit/page";
import type { AuditPageQuery } from "@/features/administration/audit/types";
import "@/features/experience/shared/experience.css";
import "@/features/administration/administration.css";
import "@/features/administration/audit/audit.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "سجل التدقيق", robots: { index: false, follow: false } };

export default async function AuditRoute({ searchParams }: { searchParams: Promise<AuditPageQuery> }) {
  return <PlatformFrame><AuditLogPage query={await searchParams} /></PlatformFrame>;
}
