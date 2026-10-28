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

it("covers teacher dashboard gaps with one decorative backdrop and exposes admin notifications separately", () => {
  const { container, rerender } = render(<ExperienceWorkspace area="learner" currentPath="/instructor"><main>المعلم</main></ExperienceWorkspace>);
  expect(container.querySelectorAll('.islamic-pattern-teacher')).toHaveLength(1);
  expect(container.querySelector('.islamic-pattern-teacher')?.getAttribute('aria-hidden')).toBe('true');
  expect(container.querySelector('.xp-workspace--teacher')).toBeTruthy();
  expect(container.querySelector('.islamic-pattern-dashboard')).toBeNull();
  rerender(<ExperienceWorkspace area="admin" currentPath="/preview/admin/notifications"><main>الإدارة</main></ExperienceWorkspace>);
  expect(within(screen.getByRole('navigation', { name: 'أقسام الإدارة' })).getByRole('link', { name: 'إشعارات الطلاب' }).getAttribute('href')).toBe('/preview/admin/notifications');
});


it("hides the all-pages shortcut from students while retaining staff access", () => {
  const { rerender } = render(<ExperienceWorkspace area="learner" currentPath="/dashboard"><main>الطالب</main></ExperienceWorkspace>);
  expect(screen.queryByRole("link", { name: "جميع واجهات الموقع" })).toBeNull();
  for (const currentPath of ["/instructor", "/supervisor", "/evaluator"]) {
    rerender(<ExperienceWorkspace area="learner" currentPath={currentPath}><main>الفريق</main></ExperienceWorkspace>);
    expect(screen.getByRole("link", { name: "جميع واجهات الموقع" })).toBeTruthy();
  }
});

it("gives the student workspace a single background across both columns", () => {
  const { container } = render(<ExperienceWorkspace area="learner" currentPath="/dashboard"><main>الطالب</main></ExperienceWorkspace>);
  const shell = container.querySelector(".xp-workspace--student")!;
  expect(shell).toBeTruthy();
  expect(shell.querySelectorAll('[data-component="islamic-pattern"]')).toHaveLength(1);
  expect(shell.querySelector(".islamic-pattern-student")?.parentElement).toBe(shell);
  expect(shell.querySelector('.xp-workspace-body [data-component="islamic-pattern"]')).toBeNull();
});

it("provides teacher navigation for existing teaching, preparation and communication sections", () => {
  render(<ExperienceWorkspace area="learner" currentPath="/instructor"><main>المعلم</main></ExperienceWorkspace>);
  const navigation = within(screen.getByRole("navigation", { name: "أقسام المعلم" }));
  for (const [label, href] of [["أدوات التدريس", "/instructor#teacher-teaching"], ["قائمة التحضير", "/instructor#teacher-review"], ["الصلاحيات والإرشادات", "/instructor#teacher-guidance"], ["حسابي", "/account"]]) expect(navigation.getByRole("link", { name: label }).getAttribute("href")).toBe(href);
});
