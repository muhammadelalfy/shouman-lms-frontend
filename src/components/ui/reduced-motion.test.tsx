// @vitest-environment jsdom
import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { BorderBeam } from "./border-beam";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
it("removes decorative motion immediately when the system preference changes", () => {
  let change: (() => void) | undefined;
  const media = { matches: false, addEventListener: (_: string, callback: () => void) => { change = callback; }, removeEventListener() {}, addListener() {}, removeListener() {} };
  vi.stubGlobal("matchMedia", () => media);
  render(<div aria-label="بطاقة"><BorderBeam /></div>);
  expect(screen.getByLabelText("بطاقة").childElementCount).toBe(1);
  act(() => { media.matches = true; change?.(); });
  expect(screen.getByLabelText("بطاقة").childElementCount).toBe(0);
});
