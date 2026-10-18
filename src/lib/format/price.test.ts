import { describe, expect, it } from "vitest";
import { formatPrice } from "./price";

describe("formatPrice", () => {
  it("converts minor units using the currency's decimal places", () => {
    // Intl separates a currency code from the number with a no-break space (U+00A0).
    expect(formatPrice(150000, "EGP", "en-US")).toBe("EGP 1,500.00");
    expect(formatPrice(1500, "JPY", "en-US")).toBe("¥1,500");
    expect(formatPrice(1500, "KWD", "en-US")).toBe("KWD 1.500");
  });

  it("formats in Arabic by default", () => {
    expect(formatPrice(150000, "EGP")).toBe(new Intl.NumberFormat("ar-EG", { style: "currency", currency: "EGP" }).format(1500));
  });
});
