// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MobileNavigation } from "./mobile-navigation";

afterEach(cleanup);

describe("mobile navigation", () => {
  it("announces expansion, closes on selection, and closes on Escape with focus restored", () => {
    render(<MobileNavigation hasSession={false} />);
    const trigger = screen.getByRole("button", { name: /القائمة/ });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    fireEvent.keyDown(screen.getByRole("navigation", { name: "قائمة التنقل للجوال" }), { key: "Escape" });
    expect(screen.queryByRole("navigation", { name: "قائمة التنقل للجوال" })).toBeNull();
    expect(document.activeElement).toBe(trigger);
    fireEvent.click(trigger);
    const catalogLink = screen.getByRole("link", { name: "الفهرس" });
    catalogLink.addEventListener("click", (event) => event.preventDefault(), { once: true });
    fireEvent.click(catalogLink);
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
  });
});
