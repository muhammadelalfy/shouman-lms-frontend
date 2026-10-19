// Test-only disposable HTTP fixture. Never run as an academy API.
import http from "node:http";
const allPermissions = [
  "users.view",
  "users.manage-status",
  "users.assign-roles",
  "roles.manage-permissions",
  "offerings.view",
  "offerings.manage",
  "offerings.publish",
];
const student = {
  id: 42,
  name: "متعلم اختبار",
  email: "learner@example.invalid",
  phone: null,
  status: "active",
  roles: ["student"],
  created_at: "2026-10-19T00:00:00Z",
  last_login_at: null,
  email_verified_at: null,
};
const actor = {
  ...student,
  id: 1,
  name: "مدير اختبار",
  roles: ["system-administrator"],
  permissions: allPermissions,
};
const subject = {
  id: 5,
  offering_id: 4,
  title: "المادة الأولى",
  description: "مادة لاختبار الواجهة",
  position: 1,
  status: "draft",
  published_at: null,
  lessons: [
    {
      id: 3,
      subject_id: 5,
      title: "درس اختبار",
      description: null,
      summary: "ملخص",
      key_points: ["نقطة"],
      estimated_duration_minutes: 10,
      position: 1,
      status: "draft",
      published_at: null,
    },
    {
      id: 8,
      subject_id: 5,
      title: "درس ثان",
      description: null,
      summary: null,
      key_points: [],
      estimated_duration_minutes: null,
      position: 2,
      status: "draft",
      published_at: null,
    },
  ],
};
const offering = {
  id: 4,
  kind: "course",
  title: "دورة لاختبار الواجهة",
  slug: "test-course",
  summary: "وصف توضيحي لاختبارات المتصفح",
  description: "محتوى اختبار",
  goals: ["هدف"],
  target_audience: null,
  estimated_duration_minutes: 20,
  starts_at: "2026-10-19T10:00:00+03:00",
  ends_at: null,
  visible_from: null,
  visible_until: null,
  is_featured: false,
  season_name: null,
  sequencing_mode: "open",
  outline_style: "subjects",
  pricing: {
    model: "free",
    price_amount: null,
    discounted_price_amount: null,
    final_price_amount: null,
    currency: null,
  },
  status: "draft",
  published_at: null,
  created_at: "2026-10-19T00:00:00Z",
  updated_at: "2026-10-19T00:00:00Z",
  subjects_count: 1,
  subjects: [subject],
  instructors: [],
};
const roles = [
  "student",
  "instructor",
  "supervisor",
  "evaluator",
  "academy-manager",
  "system-administrator",
].map((name) => ({
  name,
  permissions: name === "system-administrator" ? allPermissions : [],
  permissions_locked: name === "system-administrator",
}));
const events = [];
let scenario = "normal";
const page = (data) => ({
  data,
  links: { first: null, last: null, prev: null, next: null },
  meta: { path: "", per_page: 25, next_cursor: null, prev_cursor: null },
});
http
  .createServer(async (req, res) => {
    const url = new URL(req.url, "http://127.0.0.1:8111");
    const p = url.pathname.replace("/api/v1", "");
    let body = {};
    for await (const chunk of req) {
      body.raw = (body.raw ?? "") + chunk;
    }
    if (body.raw) body = JSON.parse(body.raw);
    const send = (status, data) => {
      res.writeHead(status, { "Content-Type": "application/json" });
      res.end(status === 204 ? "" : JSON.stringify(data));
    };
    if (p === "/events") return send(200, events);
    if (p === "/__fixture") {
      scenario = url.searchParams.get("mode") ?? "normal";
      return send(200, { mode: scenario });
    }
    if (p === "/me") {
      if (req.headers.authorization === "Bearer expired")
        return send(401, { message: "انتهت الجلسة" });
      return send(200, {
        data:
          req.headers.authorization === "Bearer forbidden"
            ? { ...actor, permissions: [] }
            : actor,
      });
    }
    if (p === "/auth/login")
      return send(200, {
        data: {
          token: "browser-test",
          token_type: "Bearer",
          expires_at: null,
          user: actor,
        },
      });
    if (req.method !== "GET")
      events.push({ path: p, method: req.method, body });
    if (
      p.startsWith("/admin") &&
      req.headers.authorization === "Bearer forbidden"
    )
      return send(403, { message: "غير مسموح" });
    if (p === "/admin/users") {
      if (scenario === "failure")
        return send(503, { message: "fixture unavailable" });
      return send(200, page(scenario === "empty" ? [] : [student]));
    }
    if (p === "/admin/users/42") return send(200, { data: student });
    if (p === "/admin/users/42/status") {
      student.status = body.status;
      return send(200, { data: student });
    }
    if (p === "/admin/users/42/roles") {
      student.roles = body.roles;
      return send(200, { data: student });
    }
    if (p === "/admin/roles") return send(200, { data: roles });
    if (p.match(/^\/admin\/roles\/[^/]+\/permissions$/)) {
      const r = roles.find((r) => r.name === p.split("/")[3]);
      r.permissions = body.permissions;
      return send(200, { data: r });
    }
    if (p === "/admin/offerings" && req.method === "GET")
      return send(200, page([offering]));
    if (p === "/admin/offerings" && req.method === "POST")
      return send(201, { data: { ...offering, ...body, id: 4 } });
    if (p === "/admin/offerings/4" && req.method === "GET")
      return send(200, { data: offering });
    if (p === "/admin/offerings/4" && req.method === "PUT") {
      if (body.title === "رفض من الخادم")
        return send(422, {
          message: "عنوان غير متاح",
          errors: { title: ["اختر عنوانًا آخر"] },
        });
      Object.assign(offering, body);
      offering.pricing = {
        model: body.pricing,
        price_amount: body.price_amount ?? null,
        discounted_price_amount: body.discounted_price_amount ?? null,
        final_price_amount: body.price_amount ?? null,
        currency: body.currency ?? null,
      };
      return send(200, { data: offering });
    }
    if (p === "/admin/offerings/4" && req.method === "DELETE") return send(204);
    if (p === "/admin/offerings/4/status") {
      offering.status = body.status;
      return send(200, { data: offering });
    }
    if (p === "/admin/offerings/4/instructors")
      return send(200, { data: offering });
    if (p.endsWith("/order")) return send(200, { data: [] });
    if (p === "/admin/subjects/5" && req.method === "PUT") {
      Object.assign(subject, body);
      return send(200, { data: subject });
    }
    if (p === "/admin/offerings/4/subjects") {
      return send(201, { data: { ...subject, ...body } });
    }
    if (p === "/admin/subjects/5/lessons")
      return send(201, { data: { ...subject.lessons[0], ...body } });
    if (p === "/admin/lessons/3") {
      Object.assign(subject.lessons[0], body);
      return send(req.method === "DELETE" ? 204 : 200, {
        data: subject.lessons[0],
      });
    }
    if (p === "/catalog/offerings") {
      if (scenario === "search-validation") return send(422, { message: "fixture validation", errors: { q: ["fixture q rejected"] } });
      if (scenario === "search-throttled") return send(429, { message: "fixture throttled" });
      if (scenario === "search-unavailable") return send(503, { message: "fixture unavailable" });
      if (scenario === "search-network") return req.socket.destroy();
      return send(200, page(scenario === "search-empty" ? [] : [{ ...offering, lesson_count: 2 }]));
    }
    if (p === "/catalog/offerings/test-course")
      return send(200, {
        data: {
          ...offering,
          lesson_count: 2,
          total_lesson_minutes: 20,
          outline: [subject],
        },
      });
    return send(404, { message: "غير موجود" });
  })
  .listen(Number(process.env.FRONTEND_FIXTURE_PORT ?? 8111), "127.0.0.1", () =>
    console.log("Disposable API fixture ready"),
  );
