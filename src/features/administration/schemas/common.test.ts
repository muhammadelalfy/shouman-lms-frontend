import { expect, it } from "vitest";
import { positiveIdSchema } from "./common";
it.each(["demo-user", "0", "-1", "1.2", "9007199254740992", "", "1e2"])(
  "rejects invalid identifier %s",
  (value) => expect(positiveIdSchema.safeParse(value).success).toBe(false),
);
it("accepts positive IDs", () => expect(positiveIdSchema.parse("42")).toBe(42));
