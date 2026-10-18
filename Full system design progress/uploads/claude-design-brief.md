# Claude Design Brief — Dr. Hazem Shoman Academy (أكاديمية د. حازم شومان)

> **How to use this file:** paste or upload it into Claude Design as the project brief. Design in the phase order in §13 so the most important screens come first. When the designs are approved, hand them back for the Next.js implementation.
>
> Sources: business proposal (Arabic PDF), [user stories](../requirements/user-stories.md), [SRS](../requirements/srs.md).
> Version 1.0 — 2026-10-06

---

## 1. Product in one paragraph

An Arabic-first digital Islamic academy. The platform is a full learning ecosystem, not a video library. The student journey runs **discover → register → learn → track progress → quizzes → community → live meetings → complete → certificate → graduation project → evaluation → distinguished students → leadership**. It has three surfaces: a **public marketing + learning site**, a **student area**, and a **role-based admin panel** that the academy team runs day to day without developers.

## 2. Users

| Role | Arabic | Uses | Primary device |
|---|---|---|---|
| Visitor | زائر | Public site, search, certificate verification | Mobile |
| Student | طالب | Learning, quizzes, community, meetings, certificates | **Mobile first** |
| Instructor | مدرس | Admin panel scoped to own courses | Desktop |
| Supervisor | مشرف | Community groups, engagement, attendance | Desktop + mobile |
| Evaluator | مقيم | Graduation projects + AI report review | Desktop |
| Academy Manager | مدير الأكاديمية | All operations, content, payments, reports | Desktop |
| System Administrator | مدير النظام | Users, roles, permissions, settings, audit log | Desktop |

## 3. Brand & visual direction (from the proposal)

- **Mood:** modern, calm, professional, trustworthy, spiritual without being heavy. Generous whitespace and clear visual order.
- **Colors:** align with the active homepage palette: warm cream, deep navy, and muted gold. Use navy for primary actions and text, cream for page and section surfaces, and gold for decorative emphasis. Gold text on light surfaces uses the darker gold token for readable contrast.

| Token | Value | Use |
|---|---|---|
| `primary-950` / deep navy | `#132643` | Dark navy surfaces, shell, and ornament |
| `primary-900` / primary | `#1A3453` | Headers, primary buttons, links, and active states |
| `accent-700` / accessible gold text | `#604008` | Gold-colored text on light surfaces |
| `accent-500` / muted gold | `#CC9B49` | Icons, highlights, badges, certificates, and progress accents |
| `accent-50` / soft gold | `#F7EED5` | Subtle highlighted surfaces |
| `surface` | `#FFFFFF` | Cards and elevated surfaces |
| `surface-muted` | `#FAF7EE` | Warm cream page background and section bands |
| `border` | `#E5DFD1` | Dividers and inputs |
| `success / warning / danger / info` | semantic status colors | Status meaning; keep distinct from brand colors |
- **Ornament:** contemporary Islamic geometric patterns, **subtle** (low-opacity backgrounds, section dividers, certificate frames). Never behind body text.
- **Typography:** an Arabic-first family with strong Latin and numeral support (e.g., IBM Plex Sans Arabic, Tajawal, or Noto Kufi Arabic for headings with Noto Naskh/IBM Plex for body). Clear hierarchy with at least 6 levels (display, h1–h3, body, caption). Body text ≥ 16px on mobile.
- **Quranic and religious text:** support a distinct display style (e.g., Amiri or a Naskh face) for āyāt and hadith quotes, with honorifics rendered correctly (ﷺ).
- **Iconography:** outline icon set. **Mirror directional icons for RTL** (arrows, chevrons, "next lesson").
- **Imagery:** course and track covers in a consistent aspect ratio (16:9 cards, 3:1 or 21:9 heroes). Respectful imagery; avoid depicting faces where the academy prefers not to.

## 4. Platform rules (non-negotiable)

1. **RTL Arabic** is the default for every screen. Design with logical start/end, not left/right.
2. **Mobile first.** Breakpoints: 360, 768, 1024, 1280, 1440. Every student screen must be fully usable at 360px.
3. **Touch targets** ≥ 44×44px. Primary student actions are reachable with one thumb (bottom area on mobile).
4. **Accessibility:** WCAG 2.1 AA contrast; visible focus states; never use color alone (e.g., locked versus unlocked lessons also need an icon and a label).
5. **Every data screen defines its states:** loading (skeleton), empty, validation error, unauthorized (401 → login), forbidden (403), not found (404), conflict (409), server error, success. See §10.
6. **Authorization-aware UI:** hide or disable actions the user can't perform, but never as the only protection (the backend enforces).
7. No business logic in the UI. Prices, unlock rules and eligibility come from the API; the design only displays them.
8. Dark mode is **out of scope for v1**, but define colors as tokens so it can be added later.

## 5. Sitemap / information architecture

```text
PUBLIC
├── / Home (الرئيسية)
├── /tracks (المسارات) → /tracks/[slug]
├── /initiatives (المبادرات) → /initiatives/[slug]
├── /programs (البرامج: intensive + seasonal) → /programs/[slug]
├── /courses (الدورات المدفوعة) → /courses/[slug] → /checkout/[course]
├── /meetings (اللقاءات: upcoming + past) → /meetings/[id]
├── /events (ورش العمل والفعاليات) → /events/[id]
├── /search (البحث)
├── /faq (الأسئلة الشائعة)
├── /verify (التحقق من الشهادات) → /verify/[certificateNumber]
└── External link button: "الموقع الرسمي للدكتور حازم" (plain outbound link)

AUTH
├── /login (تسجيل الدخول)
├── /register (إنشاء حساب)
├── /forgot-password (نسيت كلمة المرور)
└── /reset-password?token&email (تعيين كلمة مرور جديدة)

STUDENT AREA (authenticated)
├── /dashboard (لوحتي)
├── /learn/[track|course]/[lesson] (Lesson player)
├── /learn/.../quiz/[quiz] (Quiz) → result
├── /my-learning (دوراتي ومساراتي: current / completed / purchased)
├── /quizzes (اختباراتي: available + results)
├── /certificates (شهاداتي) → certificate view/download
├── /community (المجتمع) → /community/[group] → post thread
├── /meetings/mine (لقاءاتي)
├── /projects (مشاريع التخرج) → submission + status + evaluation report
├── /achievements (الإنجازات: points, badges)
├── /notifications (الإشعارات)
└── /account (حسابي: profile, password)

ADMIN PANEL (/admin, role-scoped navigation)
├── Dashboard (KPIs)
├── Students & users (list, filters, detail, status, roles)
├── Tracks · Subjects · Lessons · Programs · Seasonal · Courses
├── Quizzes & question banks
├── Payments · Coupons & offers
├── Community groups · Supervisors · Moderation
├── Events & meetings · Attendance
├── Certificates (templates, rules, registry)
├── Graduation projects · Rubrics · AI reports
├── Gamification (badges, points)
├── Distinguished students (candidates, review)
├── Notifications & campaigns
├── Reports & analytics (course, group, executive)
├── CMS (homepage sections, banners, FAQ, SEO)
└── System (roles & permissions, settings, integrations, audit log)
```

## 6. Global layouts

### 6.1 Public header & footer
- Header nav: الرئيسية | المسارات | المبادرات | البرامج | اللقاءات | الأسئلة الشائعة | البحث | تسجيل الدخول / حسابي, plus the outbound button "العودة إلى الموقع الرسمي".
- Mobile: logo, search icon, hamburger drawer (drawer slides from the start edge in RTL).
- Footer: about, quick links, social links, contact, copyright.

### 6.2 Student app shell
- Desktop: top bar (logo, search, notifications bell with count, avatar menu) + optional start-side nav.
- **Mobile: bottom tab bar** with الرئيسية (dashboard), تعلّمي, المجتمع, الإشعارات, حسابي.
- Persistent **"أكمل من حيث توقفت"** (continue where you left off) entry point.

### 6.3 Admin shell
- Collapsible start-side navigation grouped as in §5; items appear only if the role has permission.
- Top bar: global search, environment badge (staging/production), user menu.
- Standard **data table pattern**: filters row, search, column sort, **cursor pagination** ("load more" or next/prev, with no total page count), row actions, bulk actions, empty state.
- Standard **form pattern**: sections, inline validation, sticky save bar, unsaved-changes guard.

## 7. Screen inventory

Priority: **P1** = first release, **P2** = next, **P3** = later or blocked on business decisions.

### 7.1 Public

| Screen | P | Content blocks | Primary actions |
|---|---|---|---|
| Home | P1 | In order: Hero; About the academy; Academy features; Learning tracks; How do I start? (كيف أبدأ؟); **Continue where you left off** (logged-in only); Initiatives; Intensive programs; Seasonal programs (highlighted during their season); Paid courses; Upcoming meetings; Workshops & events; Certificates; Academy stats; Call to register; Social links; Footer. All sections are CMS-driven, so design for variable item counts | Register, Browse tracks, Continue |
| Tracks list | P1 | Track cards (cover, name, short description, subject count, duration, audience) | Open track |
| Track detail | P1 | Cover, name, description, goals, target audience, instructors, **ordered subjects with lock state**, lesson count, duration, **completion requirements**, certificate preview, student progress (if enrolled) | Enroll / Continue |
| Course detail | P1 | Cover, name, description, instructor, content outline (subjects → lessons, or lessons directly), lesson count, duration, free/paid badge, **price, discount, final price**, certificate, prerequisites | Register (free) / **Buy** (paid) / Continue (enrolled) |
| Program / initiative detail | P1 | Like course detail plus **visibility window** (start/end dates), seasonal badge | Join |
| Meetings | P2 | Upcoming (name, topic, instructor, date, time, audience, **Join** button when live) · Past (recording linked to course/program) | Join / Watch recording / Register |
| Events & workshops | P2 | Type, date/time, trainer, capacity (seats left), linked course/track, materials | Register, Add reminder |
| Search | P1 | Search box, filter chips (الكل / مجاني / مدفوع / موسمي), grouped results (tracks, courses, programs, initiatives, lessons, instructors, topics) | Open result |
| FAQ | P1 | Category tabs (registration, study, tracks, courses, quizzes, certificates, payment, groups, meetings, support), accordion | — |
| Certificate verification | P1 | Input for certificate number + **QR scan** option. Result card: certificate number, holder name, program name, issue date, **status** (valid / revoked / expired / not found) | Verify |

### 7.2 Auth

| Screen | P | Fields / notes |
|---|---|---|
| Register | P1 | name, email, phone (optional, international format e.g. +201001234567), password, confirm password. Show password rules live (8+ chars, upper and lower case, a number). Error states: email already used, weak password, rate limited ("محاولات كثيرة") |
| Login | P1 | email, password. Errors: wrong credentials (generic), **account disabled** (distinct message plus "contact the administration"), too many attempts (show wait time) |
| Forgot password | P1 | email → always the same confirmation message (never reveal whether the email exists) |
| Reset password | P1 | new password + confirm (token and email come from the link). Errors: invalid or expired link → CTA to request a new link |

### 7.3 Student area

| Screen | P | Content |
|---|---|---|
| Dashboard | P1 | Current track card with **progress ring/bar**; **Continue where you left off** (lesson thumbnail, position); **Next lesson**; enrolled courses (current/past tabs); purchased courses; available quizzes + last results; certificates; upcoming meetings; my groups; latest notifications. Design an empty version for a brand-new student ("ابدأ رحلتك") |
| Lesson player | P1 | Video player (or audio player when audio-only, with a background-play friendly UI), title, summary, key points, attachments list (download), progress state, prev/next lesson (**next may be locked**, with the reason shown), end-of-subject quiz CTA. Mobile: player sticky on top, content scrolls below |
| Subject/track outline drawer | P1 | Ordered lessons with states: completed ✓, in progress, available, **locked 🔒 + reason** ("أكمل المادة السابقة" / "اجتز اختبار المادة") |
| Quiz | P1 | Intro (question count, passing score, attempts left, timer if enabled); one question per screen on mobile (MCQ or true/false); progress indicator; review before submit; submit confirmation. Prevent double-submit visually |
| Quiz result | P1 | Score, pass/fail, passing score, attempts remaining, **"next subject unlocked"** celebration state or retry CTA; correct answers shown only if the academy enables it |
| My learning | P1 | Tabs: current / completed / purchased; cards with progress |
| Certificates | P1 | Grid of certificates (course, track, final). Certificate view: designed certificate with name, program, completion date, certificate number, **QR code**, verification link; download PDF, share |
| Checkout | P2 | Order summary, coupon field (apply/remove, error states), final price, payment method (gateway; e-wallet if supported), pay → redirect → **result pages: success (course activated → Start learning), failed (retry), pending (we'll notify you)** |
| Community | P2 | My groups list → group page: description, supervisor, members count, **pinned posts** on top, announcements styling, post feed, composer (text plus attachments if allowed), comments thread, report post |
| My meetings | P2 | Upcoming (join button, add to calendar) / attended history |
| Graduation project | P2 | Instructions, deadline countdown, file upload (multi-file, progress, type/size errors), **status timeline**: submitted → received → initial analysis → under review → final result; evaluation report view (strengths, improvements, unmet criteria, evaluator notes, final score) |
| Achievements | P3 | Points total, badges grid (earned / locked), milestones |
| Notifications | P1 | List grouped by date, read/unread, deep links (new lesson, quiz available, meeting reminder, new program, reminders) |
| Account | P1 | Profile (name, phone; email read-only), change password (current, new, confirm; signs out other devices, so tell the user), logout |

### 7.4 Admin panel

| Screen | P | Content |
|---|---|---|
| Dashboard | P1 | KPI cards: students, new students, active students, courses, tracks, programs, enrollments, payments, certificates, quizzes, projects, community activity. Trend charts. Date range filter |
| Users list | P1 | Table: name, email, phone, roles (chips), status (active/disabled badge), last login, created. Filters: status, role, search. Row actions: view, activate/disable, edit roles |
| User detail | P1 | Profile, roles, status toggle with **confirm dialog** ("disabling signs the user out everywhere"), courses/tracks/progress/quizzes/certificates/groups tabs (P2), activity log |
| Roles & permissions | P1 | Roles list with permission matrix (checkbox grid). **System Administrator row locked** (show a lock and explain). Save with confirmation |
| Tracks / Subjects / Lessons | P1 | Create/edit forms; **drag-and-drop ordering** of subjects and lessons; sequencing rules (next available immediately / requires previous completion / requires quiz pass); visibility (draft/published/hidden); media upload with **processing status**; completion and certificate requirements |
| Programs & seasonal programs | P1 | Form plus visibility window (start/end), manual show/hide, homepage highlight toggle, season selector |
| Courses (paid) | P2 | Form with price, discount price, free/paid, structure type (with subjects / direct lessons) |
| Quizzes & question bank | P1 | Quiz settings (passing score, questions shown, attempts, retake, gate next subject); question bank table; question editor (MCQ / true-false, correct answer, score, category); "random 10 of 100" summary |
| Payments | P2 | Transactions table (student, course, amount, method, status, activation status, date), status filters, detail drawer |
| Coupons & offers | P2 | Coupon form (code, % or fixed, dates, courses, usage limit), usage report, deactivate |
| Community groups | P2 | Groups table (capacity 25 vs. members, supervisor, linked program, activity level); member management (add/remove/**move to another group**); moderation queue |
| Events & meetings | P2 | Event form (type, date/time, trainer, capacity, audience, links, materials, recording); registrations; **attendance sheet** (present/late/partial/absent/excused, source) |
| Certificates | P2 | Template designer preview, issuance rules per type, registry table (number, student, program, status, issued at), revoke action |
| Graduation projects | P3 | Submissions table by status; evaluator workspace: files viewer, **AI analysis panel (clearly labeled advisory)**, rubric scoring form, notes, approve result |
| Rubrics | P3 | Criteria builder: criterion, description, weight, score, minimum, mandatory/optional |
| Gamification | P3 | Badges CRUD (name, icon, conditions, points), holders list |
| Distinguished students | P3 | Candidate list with indicator scores, **human review** (approve/reject with notes), enroll in advanced program |
| Notifications & campaigns | P2 | Composer, audience builder (student, group, course, track, program, inactive, not completed X, completed stage), schedule, delivery status |
| Reports & analytics | P2 | Course analytics (enrolled, active, completed, completion %, avg progress, quiz results, **drop-off points chart**, attendance, campaign impact); group analytics; executive dashboard; export |
| CMS | P2 | Homepage sections editor (reorder, toggle, edit content), banners, FAQ editor, social links, SEO settings (titles, descriptions, GA/GTM, verification) |
| Audit log | P2 | Table: who, action, subject, before → after diff, time, request ID |

## 8. Component inventory (design these as a library)

**Foundations:** color tokens, type scale, spacing scale (4px base), radius, elevation, ornament patterns, icon set, illustration style for empty states.

**Components:** Button (primary/secondary/ghost/danger, sizes, loading, disabled) · Icon button · Link · Input, Textarea, Select, Combobox, Checkbox, Radio, Switch, Date/time picker, File uploader (progress, errors) · Password field with strength rules · Search bar with filter chips · Tabs · Accordion · Breadcrumbs (RTL) · Pagination (cursor: next/prev/load more) · Data table · Drawer · Modal + confirm dialog · Toast · Inline alert/banner · Badge/Chip (status, free/paid, seasonal, role) · Avatar · Tooltip · Skeletons · Empty state · Error page (403/404/500) · Progress bar + progress ring · Stepper/timeline (project status, checkout) · Countdown · **Track card · Course card · Lesson row (with lock states) · Meeting card · Event card · Certificate card + full certificate · Quiz question (MCQ/TF) · Result summary · Post card + comment thread · Notification item · KPI stat card · Chart frames (line, bar, funnel for drop-off)** · Video player chrome · Audio player · QR display/scanner frame · Price block (original/discount/final) · Coupon field · Permission matrix grid · Drag-and-drop sortable list.

## 9. Key user flows to prototype

1. **First visit → register → enroll free track → first lesson → continue later from the dashboard.**
2. **Lesson → subject quiz → pass → next subject unlocks** (and the fail → retry path).
3. **Paid course → checkout with coupon → payment success/failure/pending → course appears in My Learning.**
4. **Complete track → certificate issued → share → third party verifies by QR.**
5. **Join group → read pinned announcement → post → supervisor replies.**
6. **Admin: create track → add subjects/lessons (upload video) → configure quiz and unlock rules → publish.**
7. **Admin: find user → disable account (confirm) → audit log shows the change.**

## 10. States catalogue (Arabic copy examples)

| State | Example copy |
|---|---|
| Loading | Skeletons matching the final layout (no spinners for whole pages) |
| Empty (dashboard) | "ابدأ رحلتك التعليمية — اختر مسارك الأول" + CTA |
| Validation | Inline under field, e.g. "البريد الإلكتروني مستخدم من قبل." |
| Wrong credentials | "بيانات الدخول غير صحيحة." |
| Account disabled | "تم تعطيل هذا الحساب. يرجى التواصل مع إدارة الأكاديمية." |
| Too many attempts | "محاولات كثيرة. يرجى المحاولة مرة أخرى بعد قليل." |
| Locked content | "هذه المادة مغلقة — اجتز اختبار المادة السابقة لفتحها." |
| Forbidden (403) | "ليس لديك صلاحية للوصول إلى هذه الصفحة." |
| Not found (404) | "الصفحة غير موجودة." + back home |
| Conflict (409) | e.g. "لا يمكن إتمام العملية لأنها ستترك النظام بدون مدير نظام نشط." |
| Session expired (401) | Redirect to login with "انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى." |
| Payment failed | "لم تتم عملية الدفع. لم يتم خصم أي مبلغ — يمكنك المحاولة مرة أخرى." |
| Upload failed | "تعذر رفع الملف. تأكد من نوع الملف وحجمه ثم حاول مرة أخرى." |
| Server error | "حدث خطأ غير متوقع. حاول مرة أخرى، وإن استمرت المشكلة تواصل معنا." |
| Success toast | "تم حفظ التغييرات بنجاح." |

## 11. Data available from the API today (design to these field names)

Identity endpoints are implemented (`/api/v1`). The other modules will follow the same conventions: JSON wrapped in `data`, ISO-8601 dates, cursor pagination (`meta.next_cursor`, `meta.prev_cursor`), and errors as `{ message, code?, errors? }`.

**Current user (`GET /me`)**

```json
{
  "data": {
    "id": 12,
    "name": "أحمد محمد",
    "email": "ahmed@example.com",
    "phone": "+201001234567",
    "status": "active",
    "roles": ["student"],
    "permissions": [],
    "email_verified_at": "2026-10-06T12:00:00+00:00",
    "last_login_at": "2026-10-06T12:00:00+00:00",
    "created_at": "2026-10-01T09:30:00+00:00"
  }
}
```

**Roles:** `student`, `instructor`, `supervisor`, `evaluator`, `academy-manager`, `system-administrator`.
**Account status:** `active`, `disabled`.
**Permissions today:** `users.view`, `users.manage-status`, `users.assign-roles`, `roles.manage-permissions` (more will come per module).

## 12. Open business decisions that affect design

Leave these configurable or placeholder until the academy decides (see SRS §10): evaluation rubric (OP-1), WhatsApp integration (OP-2), payment gateway and e-wallet branding (OP-3/4), quiz policies such as timer and showing answers (OP-5), certificate rules per type (OP-6), points/badges rules (OP-7), excellence criteria (OP-8), community posting permissions and reporting (OP-9), and minors and age groups (OP-10).

## 13. Deliverables requested from Claude Design

Design in this order:

1. **Design system:** tokens (colors, type, spacing, radius, elevation), ornament patterns, and the component library from §8, in RTL.
2. **P1 public + auth:** Home, Tracks list/detail, Course detail, Search, FAQ, Certificate verification, Login, Register, Forgot/Reset password.
3. **P1 student:** Dashboard (populated and empty), Lesson player, Outline drawer with lock states, Quiz, Quiz result, My learning, Certificates, Notifications, Account.
4. **P1 admin:** Shell, Dashboard, Users list/detail, Roles & permissions, Track/Subject/Lesson editors, Quiz and question bank.
5. **P2/P3** screens as listed.

For each screen, deliver **mobile (360/390)** and **desktop (1440)** frames (tablet where layout changes), plus all states from §10 that apply.

**Handoff notes for implementation (Next.js + Tailwind v4):** keep design tokens named as in §3 so they map 1:1 to CSS variables; use logical spacing (start/end); provide icon names; mark which components are interactive; specify motion (duration/easing) for progress, unlock celebration, toasts, and drawers.
