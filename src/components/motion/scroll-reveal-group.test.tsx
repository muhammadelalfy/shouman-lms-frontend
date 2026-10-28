// @vitest-environment jsdom
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { ScrollRevealGroup } from "./scroll-reveal-group";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
it("cancels a card reveal on keyboard focus and skips entry while its control is focused", () => {
  let intersect: IntersectionObserverCallback;
  vi.stubGlobal("IntersectionObserver", class {
    constructor(callback: IntersectionObserverCallback) { intersect = callback; }
    observe() {} disconnect() {}
  });
  render(<ScrollRevealGroup className="dashboard"><section className="xp-card" aria-label="سجل"><button>تعديل</button></section></ScrollRevealGroup>);
  const card = screen.getByRole("region", { name: "سجل" });
  const cancel = vi.fn();
  const animate = vi.fn(() => ({ cancel }));
  Object.defineProperty(card, "animate", { value: animate });
  const enter = () => intersect([{ target: card, isIntersecting: true, intersectionRatio: 1, time: 0, boundingClientRect: card.getBoundingClientRect(), intersectionRect: card.getBoundingClientRect(), rootBounds: null }], {} as IntersectionObserver);
  act(enter);
  expect(animate).toHaveBeenCalledTimes(1);
  act(() => screen.getByRole("button").focus());
  expect(cancel).toHaveBeenCalled();
  act(enter);
  expect(animate).toHaveBeenCalledTimes(1);
});
