import { expect, it } from "vitest";
import {
  offeringSchema,
  subjectSchema,
  lessonSchema,
  reorderSchema,
  offeringInput,
} from "./schemas";
const base = {
  title: "دورة تجريبية",
  slug: "دورة-قرآن",
  is_featured: false,
  sequencing_mode: "open",
  outline_style: "subjects",
  pricing: "free",
};
it("accepts Arabic slugs and preserves exact offset timestamps", () => {
  const input = { ...base, starts_at: "2026-10-19T10:00:00+03:00" };
  expect(offeringSchema.parse(input).starts_at).toBe(input.starts_at);
});
it("rejects invalid limits and timestamps", () => {
  for (const override of [
    { title: "ab" },
    { summary: "a".repeat(501) },
    { goals: Array(21).fill("goal") },
    { goals: ["x".repeat(301)] },
    { starts_at: "tomorrow" },
    { ends_at: "2025-01-01T00:00:00Z", starts_at: "2026-01-01T00:00:00Z" },
    { price_amount: 100 },
    { slug: "bad slug" },
  ])
    expect(offeringSchema.safeParse({ ...base, ...override }).success).toBe(
      false,
    );
});
it("uses integer minor units and the verified EGP currency contract", () => {
  expect(
    offeringSchema.safeParse({
      ...base,
      pricing: "paid",
      price_amount: 100,
      currency: "EGP",
      discounted_price_amount: 0,
    }).success,
  ).toBe(true);
  for (const override of [
    { price_amount: 1.2 },
    { currency: "USD" },
    { discounted_price_amount: 100 },
  ])
    expect(
      offeringSchema.safeParse({
        ...base,
        pricing: "paid",
        price_amount: 100,
        currency: "EGP",
        ...override,
      }).success,
    ).toBe(false);
});
it("preserves nullable full replacement fields and omits kind on edits", () => {
  const data = new FormData();
  for (const [k, v] of Object.entries(base)) data.set(k, String(v));
  data.set("kind", "track");
  data.set("season_name", "");
  const input = offeringInput(data, false);
  expect(input).not.toHaveProperty("kind");
  expect(offeringSchema.parse(input).description).toBeNull();
});
it("validates subject and lesson boundaries", () => {
  expect(subjectSchema.safeParse({ title: "ab" }).success).toBe(true);
  expect(subjectSchema.safeParse({ title: "a" }).success).toBe(false);
  for (const override of [
    { key_points: Array(31).fill("x") },
    { estimated_duration_minutes: 10001 },
    { summary: "x".repeat(20001) },
  ])
    expect(lessonSchema.safeParse({ title: "ab", ...override }).success).toBe(
      false,
    );
});
it("requires complete valid reorder identifier sets", () => {
  expect(reorderSchema.parse({ ids: [3, 1, 2] }).ids).toEqual([3, 1, 2]);
  for (const ids of [
    [1, 1],
    [-1],
    [1.2],
    Array.from({ length: 501 }, (_, i) => i + 1),
  ])
    expect(reorderSchema.safeParse({ ids }).success).toBe(false);
});
