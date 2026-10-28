import "server-only";
import { apiRequest } from "@/lib/api/client";
import { needsRecordSchema, needsSectionSchema, type NeedsSection } from "./schema";
export async function getPublishedNeeds() {
  const result = await apiRequest<{data: unknown}>("/homepage/needs");
  return needsSectionSchema.parse(result.data);
}
export async function getNeedsRecord(token: string) {
  const result = await apiRequest<{data: unknown}>("/admin/homepage/needs", {token});
  return needsRecordSchema.parse(result.data);
}
export async function saveNeeds(token: string, version: number, draft: NeedsSection) {
  return apiRequest("/admin/homepage/needs", {token, method:"PUT", body:{version,draft}});
}
export async function publishNeeds(token: string, version: number) {
  return apiRequest("/admin/homepage/needs/publish", {token, method:"POST", body:{version}});
}
