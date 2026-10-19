// @vitest-environment jsdom
import { afterEach, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ExperienceWorkspace } from "./workspace";
afterEach(cleanup);
it("closes the mobile disclosure on Escape and restores focus", () => {
  render(
    <ExperienceWorkspace area="learner" currentPath="/dashboard">
      <p>content</p>
    </ExperienceWorkspace>,
  );
  const trigger = screen.getByRole("button", { name: "فتح قائمة المساحة" });
  fireEvent.click(trigger);
  fireEvent.keyDown(screen.getByRole("navigation", { name: "أقسام المتعلم" }), {
    key: "Escape",
  });
  expect(trigger.getAttribute("aria-expanded")).toBe("false");
  expect(document.activeElement).toBe(trigger);
});
