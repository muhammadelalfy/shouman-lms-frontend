import { z } from "zod";
export const imageKeys = ["religion", "student", "family", "renewal", "quran", "prayer", "repentance", "closeness", "mosque"] as const;
export function safeCatalogLink(value: string): boolean {
  if (!/^\/(catalog|tracks|courses|programs|seasonal-programs|initiatives)(?:[/?#][^\x00-\x20\x7f]*)?$/.test(value)) return false;
  try {
    let decoded = value;
    for (let i = 0; i < 4; i++) decoded = decodeURIComponent(decoded);
    return !/[\x00-\x1f\x7f\\]/.test(decoded) && !decoded.includes("..") && !decoded.includes("%");
  } catch { return false; }
}
const link = z.string().max(1000).refine(safeCatalogLink, "اختر رابطًا داخليًا صحيحًا من الفهرس أو المسارات أو الدورات.");
export const needsCardSchema = z.object({
  id: z.string().min(1).max(64).regex(/^[a-z0-9-]+$/),
  title: z.string().trim().min(1, "أدخل عنوان البطاقة.").max(80),
  description: z.string().max(180).nullable(),
  image_key: z.enum(imageKeys), href: link, style: z.enum(["icon", "photo"]), enabled: z.boolean(),
}).strict();
export const needsSectionSchema = z.object({
  enabled: z.boolean(), title: z.string().trim().min(1).max(80), subtitle: z.string().max(240).nullable(),
  cta_label: z.string().trim().min(1).max(80), cta_href: link,
  cards: z.array(needsCardSchema).max(24),
}).strict().refine(section => new Set(section.cards.map(c => c.id)).size === section.cards.length, {message:"معرّفات البطاقات مكررة.",path:["cards"]});
export const needsRecordSchema = z.object({draft: needsSectionSchema, version: z.number().int().positive(), published_at:z.string().nullable()});
export type NeedsCard = z.infer<typeof needsCardSchema>;
export type NeedsSection = z.infer<typeof needsSectionSchema>;
export type NeedsRecord = z.infer<typeof needsRecordSchema>;
