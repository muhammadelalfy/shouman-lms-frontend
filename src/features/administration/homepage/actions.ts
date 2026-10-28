"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import type { FormState } from "@/lib/forms";
import { needsSectionSchema } from "@/features/home/content/schema";
import { saveNeeds, publishNeeds } from "@/features/home/content/api";
import { mutate } from "../server/mutate";
const versionSchema = z.coerce.number().int().positive();
export async function saveNeedsAction(_previous: FormState, form: FormData): Promise<FormState> {
  let draft: unknown;
  try { draft = JSON.parse(String(form.get("draft"))); } catch { draft = undefined; }
  return mutate("homepage.manage",z.object({version:versionSchema,draft:needsSectionSchema}), {version:form.get("version"),draft},
    (token,data)=>saveNeeds(token,data.version,data.draft));
}
export async function publishNeedsAction(_previous: FormState, form: FormData): Promise<FormState> {
  const result = await mutate("homepage.manage",z.object({version:versionSchema}),{version:form.get("version")},(token,data)=>publishNeeds(token,data.version));
  if(result.status === "success") revalidatePath("/");
  return result;
}
