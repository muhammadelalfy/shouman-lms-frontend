# UX Contract — Shoman Academy

## Product context

- **Audience:** Arabic-speaking visitors, prospective/current students, instructors, supervisors, evaluators, Academy Managers, and System Administrators.
- **Primary jobs:** discover visible offerings; create/access an account; maintain basic profile data; use future learning and staff tools when their domain APIs are released.
- **Target market(s):** Arabic-first academy; no country-specific legal, identity, or payment behavior inferred from locale.
- **Active locales:** Arabic application shell (`lang="ar"`, `dir="rtl"`). English is used only in isolated English titles/technical identifiers with explicit LTR direction. A full English locale switch is not part of this slice.
- **Language/content register:** clear Modern Standard Arabic; official academy/policy answers require academy approval. No age/minor policy or terms are invented.
- **Timezone/calendar policy:** display API ISO-8601 values only with an explicit local timezone policy; until defined, avoid converting dates/times on public screens.
- **Accessibility target:** WCAG 2.1 AA from the SRS/design brief; use semantic HTML, keyboard access, visible focus, accessible names/status, reduced-motion support, and 44px preferred touch targets.

## Business-context sources

| Domain / scope | Authoritative source | Source type | Reviewed date |
|---|---|---|---|
| Frontend scope and boundaries | `docs/features/E4-remaining-website.md` (added for this increment) | Feature analysis | 2026-10-16 |
| Identity/session behavior | `docs/features/E1-identity.md`, `docs/adr/003-api-authentication.md` | API / ADR | 2026-10-16 |
| Roles and permissions | `docs/adr/004-rbac.md`, `docs/features/E1-identity.md` | ADR / feature analysis | 2026-10-16 |
| Catalog visibility and fields | `docs/features/E3-learning-structure.md` | API / feature analysis | 2026-10-16 |
| Deferred business policy | `docs/requirements/srs.md` §10, `docs/requirements/user-stories.md` | Open decisions | 2026-10-16 |

## Visual contract

- **Project `DESIGN.md`:** `frontend/DESIGN.md`.
- **Token ownership model:** existing runtime CSS remains canonical; `DESIGN.md` mirrors the accepted application values.
- **Runtime source:** `frontend/src/app/globals.css` (`:root` and `@theme inline`).
- **Mapping:** Tailwind v4 `@theme inline` aliases CSS custom properties; shared surfaces consume semantic variables. `frontend/Full system design progress/tokens.css` and `.dc.html` are visual references, not an independent runtime source.
- **Token drift gate:** compare this document and the Claude reference to `globals.css` when changing the system; search for raw stale colors; review actual rendered states and contrast.
- **Themes:** light only.
- **Design-context owner/review:** frontend owner maintains; code and system-design reviewers check token/behavior consistency.

## Canonical UI Map

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Table selection | None; no live staff table in this frontend increment | Deferred until API-backed admin list exists | None yet | Do not expose selection controls in previews |
| Select/Listbox | Native `<select>` when an approved filter is available | Catalog URL filters and native semantics | Kind / pricing | Keyboard and URL-state test |
| Date | None for current API-backed pages | API values remain ISO strings | Read-only text until timezone policy | Confirm no false localized conversion |
| Form | Auth/profile form components using existing Zod schemas + Server Actions | `features/auth/actions`, auth schemas, `features/account/api` | Sign in / register / reset / profile | Server/action tests + keyboard/browser flow |
| Scrollbar | Global browser scrollbar | `src/app/globals.css` | Native document scroll | Narrow and 200% zoom inspection |
| Toast | No global toast provider currently; forms use inline banners | `lib/forms.ts` | Inline field/banner feedback | Live region and error recovery tests |
| CRUD | No general CRUD frontend owner | Backend APIs plus feature analyses | Account profile update only in this slice | API contract and action tests |

## Component behavior

| Component | Default | Hover | Focus | Active | Disabled | Busy | Error |
|---|---|---|---|---|---|---|---|
| Button | Named action and stable size | Subtle surface/contrast change | Visible ring | Clear pressed response | Native disabled semantics | Reserve label geometry and expose pending text | Keep field/action context |
| Icon button | Accessible Arabic name | Match button | Visible ring | Pressed response | Native disabled | Preserve size | Inline/banner context |
| Input | Visible associated label | No meaning by hover | Visible ring | Native | Read-only/disabled distinguished | Preserve value | `aria-invalid` + inline message |
| Secret input | Masked; allow paste/autofill | n/a | Visible ring | n/a | Native disabled | Never echo secret | Generic auth error; field-specific schema errors only |
| Search | Preview-only unless backed by an API | n/a | Visible ring | n/a | Do not imply results | No fake result state | Explain not connected |
| Textarea | Visible label | n/a | Visible ring | Native | Native disabled | Preserve entered non-sensitive text | Inline message |
| List | API-backed catalog list or explicit preview cards | Cards do not imply hidden actions | Real link focus | n/a | n/a | Server render / explicit retry | Distinguish empty, no results, and fetch failure |

## Dataset navigation

- **Admin tables:** none are operational in this increment; no mock table may imply live users, permissions, or analytics.
- **Exploratory lists:** public catalog list is server-rendered from the published-offering API; related types use approved `kind` filters.
- **URL state:** committed catalog `kind`, `pricing`, and `cursor` filters belong in query params. Cursor APIs do not gain synthetic numbered pages. Auth field data is not placed in URLs except the API-approved password reset token/email query.
- **Page size:** use supported API default; do not invent a per-page selector unless the endpoint and UI need it.
- **Empty/no-results/error/loading:** loading uses server navigation state where applicable; empty published catalog is not the same as API failure; no-results offers clear filters; failure has retry/navigation; missing detail uses Next `notFound()`.
- **Back/scroll restoration:** preserve browser-native route/query history.
- **Selection scope:** not applicable; no live staff selection.

## Flow ledger

| Operation | Trigger | Pending | Success destination | Success feedback | Failure recovery | Focus outcome | Source ref |
|---|---|---|---|---|---|---|---|
| Sign in | Submit existing login form | Server Action pending | Safe same-origin `redirectTo` or `/` | Redirect; do not expose token | Generic credential error / safe API message, retain email | Form banner announced | `E1`, ADR 003 |
| Register | Submit validated registration | Server Action pending | Safe same-origin destination or `/` | Redirect after API success | Field errors; no fabricated account | Form banner announced | `E1`, ADR 003 |
| Forgot password | Submit email | Server Action pending | Stay on form | Generic API-approved success message | Safe retry; preserve email | Announce result | `E1` |
| Reset password | Submit token/email/new password | Server Action pending | Stay or link to login | API-approved message only | Expired/invalid link offers restart | Announce result | `E1` |
| Update profile | Submit name/phone | Server Action pending | Stay on account | Saved only after API success | Retain non-sensitive values and errors | Focus summary/first invalid field | `E1`, ADR 003 |
| Change password | Submit current/new password | Server Action pending | Stay and keep current token per contract | Explain other sessions are revoked | Field errors and retry; never log values | Announce result | `E1` |
| Catalog filter | Change supported query field | Navigation pending | Filtered catalog | URL reflects state | Retry or clear query | Keep filter location | `E3` |
| Search | Submit preview-only search | n/a | Keep visitor on search preview | State clearly that search is not connected | No fake results | Stable page heading | `SRS FR-PUB-5` |

## Navigation and responsive behavior

- **Route document title policy:** each known route sets localized Arabic metadata; detail title derives only from API-visible offering title. Unknown routes use a truthful not-found title.
- **Route error / 403 page behavior:** unknown resource is distinct from unauthenticated/forbidden; preserve navigation and offer home/catalog/login links. Never reveal raw API payloads.
- **Breadcrumb/tab/route-state policy:** use real links for hierarchy and related routes. Tabs only when content state is accessible and either URL-backed or explicitly transient.
- **Sidebar/drawer/bottom-sheet transformation:** marketing shell stays compact. `MobileNavigation` uses an accessible button with `aria-expanded`/`aria-controls`; Escape closes it and restores trigger focus, route selection closes it, and authenticated account/logout actions remain explicit. This menu is non-modal and does not trap focus.
- **Responsive tables:** no API-backed data table is included in this increment; future admin table design follows a separate analyzed workflow.
- **Truncation/full-value access:** do not truncate titles, prices, or identifiers without an accessible full-value path.
- **Focus restoration/sticky obstruction:** dialogs restore focus to the opener; sticky elements must not cover focused content.

## Overlays and feedback

- **Dialog primitive:** existing native `<dialog>` for explanatory preview only; labelled title, Escape close, focus restoration. Do not put a pretend backend action inside it.
- **Destructive confirmation:** no destructive client action in this increment.
- **Toast:** no toast for API-backed forms; use persistent inline live-region feedback. Do not claim a toast provider exists.
- **Alert/banner:** one form-level summary plus field-level details; distinguish rate-limited, validation, disabled-account, and unexpected-safe failures.
- **Tooltip:** not required for first release; accessible names stay present without hover.
- **Unsaved changes:** browser-native navigation behavior until a real draft workflow is analyzed.
- **Layer order:** native dialog is topmost; no custom portal stack is introduced.

## Async and resilience

- **Mutation default:** pessimistic; Server Action success is the only success state.
- **Idempotency/duplicate submit:** pending state disables repeat submission. Do not invent idempotency keys where no operation contract exists.
- **Auto-save/draft recovery:** not implemented.
- **Offline/read-stale/write behavior:** catalog responses use existing server API client with `no-store`; render safe error states rather than stale or invented records. Writes fail clearly and preserve form context.
- **Retry/backoff/timeout:** reuse API client timeout and error mapping; expose user retry; no new retry loop for non-idempotent writes.
- **Version conflict/multi-tab:** not applicable to current contracts.
- **Session expiry/re-authentication:** never expose bearer token. Protected profile read/action checks session server-side; expired/invalid session routes to login with safe return destination.
- **Long-running progress:** not applicable.
- **Stale request cancellation/invalidation:** Next server component navigation owns reads; no client fetch or duplicate cache layer.
- **Dialog/form preservation:** preserve form state on failure; preview dialogs stay explanatory and close without submitting.

## Validation

- Use current Zod schemas for register/login/forgot/reset. Server Actions validate at the trust boundary, then call existing server-only APIs.
- Use a small account input schema matching the existing E1 `/me` and `/me/password` contract; do not accept role/status/email changes.
- Validation summary is announced; each field associates its own message; passwords allow paste and password manager autofill.
- Unknown, forbidden, validation, and server failures use safe copy from existing `lib/forms.ts` or a specific mapped state.

## Authorization and privacy

- Laravel is authoritative for all permissions. Next.js only hides unavailable navigation where a trusted server-side `/me` response supports that decision.
- Client pages never receive a Laravel token. Server-only cookies and APIs follow ADR 003.
- Public offering details must come from the visible-only catalog resource. Never infer draft existence from 404.
- No sample PII, user account, learning progress, payment, quiz result, certificate, or admin dataset is presented as real. Preview content is visibly marked.

## Release and evidence

### E5 complete visual frontend ownership

The E5 request expands generic preview bodies into dedicated public, learner, staff, and administration screens. `features/experience/route-registry.ts` owns preview route classification and the `/preview` screen directory. Existing API catalog/auth/account routes stay with their current owners; `/preview/catalog` and `/preview/account` are explicitly separate examples and never API fallbacks.

- `features/experience/shared/ui.tsx` owns headings, preview/data labels, badges, progress and empty states. `shared/interactions.tsx` owns explanatory preview dialogs and searchable-input clear behavior. Native dialogs are app-styled, use browser modal focus containment, Escape, and trigger focus restoration.
- `shared/workspace.tsx` owns the responsive learner/staff/admin navigation, document scroll, start-side desktop navigation and learner mobile bottom navigation. The mobile section menu is a documented non-modal disclosure; it does not trap focus.
- `shared/experience.css` owns shared cards, buttons, fields, local filter controls and data tables. Native select/date/time popups remain platform-owned; their trigger/layout is styled by the application. Tables are bounded fixture datasets with local paging; table overflow stays on the table surface. No live staff CRUD is authorized by preview controls.
- Public, learner and admin components own distinct layouts and transient interaction islands in their feature folders. Every sample screen has a persistent notice, and dataset sections carry sample labels. No actual people, emails, phones, payment details, access tokens, private media, QR identity, or real records are seeded.
- Preview forms use inline validation and announce that data was not saved/sent. Local input, sort, filters, choices, unread flags and draft metadata reset on reload or route change. Route-specific component keys prevent drafts carrying to another screen. Committed search may initialize from `q`; it searches the bounded sample dataset locally. This explicit preview-only override does not change API-backed catalog URL/cursor behavior.
- No preview uses fetch, Server Actions, browser storage, session writes, telemetry, provider calls, or business transitions. OP-1…OP-10 remain unresolved. Learner progress/quiz choices/attendance/certificates/payments shown in samples never become authoritative outcomes.
- Auth/account password visibility uses `features/auth/components/password-input.tsx`; passwords start masked, allow managers/paste, and have an accessible show/hide state. The existing HTTP-only session/API authorities remain unchanged.
- `NEXT_BUILD_DIR` optionally selects an in-project Next build folder; `.next` remains the default. Fresh dated build output is used for E5 verification, with generated `.next-*` excluded from lint and Git. Build output is never evidence for a different source revision.

- Feature analysis and route matrix: `docs/features/E4-remaining-website.md`.
- Tests: existing Vitest + targeted schema/route/component coverage; frontend gates are lint, typecheck, Vitest, production build, and dependency audit.
- Browser matrix: 360, 390, 768, 1024, 1280, 1440px; keyboard/focus, mobile navigation, reduced motion, and API empty/error/not-found states.
- Performance: record browser, viewport, cache, CPU, network, LCP, CLS, and build when claiming measured performance. No throughput or production readiness claim from the local preview.
