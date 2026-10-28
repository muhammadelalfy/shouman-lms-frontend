// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { AnimatedCounter } from "./animated-counter";
import { ScrollProgress } from "./scroll-progress";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
function stubMotion(reduce: boolean) {
  vi.stubGlobal("matchMedia", () => ({ matches: reduce, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }));
}
it("keeps the final value readable and labelled, including Arabic-Indic digits", () => {
  stubMotion(true);
  render(<><AnimatedCounter value="+180,000" /><AnimatedCounter value="٢" /></>);
  expect(screen.getByLabelText("+180,000").textContent).toBe("+180,000");
  expect(screen.getByLabelText("٢").textContent).toBe("٢");
});
it("omits the scroll progress bar under reduced motion", () => {
  stubMotion(true);
  const { container } = render(<ScrollProgress />);
  expect(container.childElementCount).toBe(0);
});
