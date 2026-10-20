// @vitest-environment jsdom
import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { ExperienceWorkspace } from "./workspace";
afterEach(cleanup);
it.each([
  ["/dashboard", "لوحتي"],
  ["/my-learning", "تعلّمي"],
])(
  "marks %s preview selected in both navigation surfaces",
  (currentPath, label) => {
    render(
      <ExperienceWorkspace area="learner" currentPath={currentPath}>
        <main>معاينة</main>
      </ExperienceWorkspace>,
    );
    for (const name of ["أقسام المتعلم", "التنقل السريع للمتعلم"])
      expect(
        within(screen.getByRole("navigation", { name }))
          .getByRole("link", { name: label })
          .getAttribute("aria-current"),
      ).toBe("page");
  },
);
