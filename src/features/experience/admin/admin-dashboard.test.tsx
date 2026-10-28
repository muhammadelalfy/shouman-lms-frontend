// @vitest-environment jsdom
import { afterEach, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { AdminDashboard } from "./admin-insights";

afterEach(cleanup);

it("presents sample statistics before charts, tasks and marketing discovery", () => {
  const { container } = render(<AdminDashboard />);
  const statistics = container.querySelector(".admin-stat-grid")!;
  expect(statistics.querySelectorAll("a")).toHaveLength(4);
  for (const later of [container.querySelector(".admin-chart"), container.querySelector(".admin-task-list"), container.querySelector('[data-marketing-audience="admin"]')]) {
    expect(statistics.compareDocumentPosition(later! ) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  }
  expect(screen.getByText("حسابات في العينة")).toBeTruthy();
  expect(screen.getByText("لا مستخدمون حقيقيون أو مدفوعات أو سجلات تعلم في لوحة الإدارة هذه. لا تمثل الأعداد إحصاءات المنصة أو مؤشرات أداء.")).toBeTruthy();
});
