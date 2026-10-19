# Frontend browser verification

These tools use a **disposable HTTP fixture**, not Laravel or real academy records. They exercise Next.js server reads/actions and browser behavior against inspected contract-shaped responses. Live Laravel integration and real-session revocation need separate verification.

Use Node 22+. Install Playwright in a temporary directory without changing application dependencies:

```bash
npm install --prefix /tmp/shouman-browser playwright
```

Set `CHROME_EXECUTABLE` if Chrome is not at `/opt/google/chrome/chrome`. Run these in separate terminals from the frontend repository:

```bash
node scripts/verification/api-fixture.mjs
```

```bash
API_BASE_URL=http://127.0.0.1:8111/api/v1 NEXT_BUILD_DIR=.next-final npm run build
API_BASE_URL=http://127.0.0.1:8111/api/v1 NEXT_BUILD_DIR=.next-final npm run start -- --hostname 127.0.0.1 --port 3112
```

```bash
E5_BASE_URL=http://127.0.0.1:3112 node scripts/smoke-e5.mjs
PLATFORM_BASE_URL=http://127.0.0.1:3112 node scripts/smoke-platform.mjs
PLAYWRIGHT_MODULE=/tmp/shouman-browser/node_modules/playwright/index.mjs node scripts/verification/browser-check.mjs
PLAYWRIGHT_MODULE=/tmp/shouman-browser/node_modules/playwright/index.mjs PLATFORM_BASE_URL=http://127.0.0.1:3112 FRONTEND_FIXTURE_URL=http://127.0.0.1:8111 node scripts/verification/states-check.mjs
```

The browser matrix covers 29 routes at 320, 390, 768 and 1440px, with reduced motion enabled. It checks one H1, viewport overflow, runtime page errors, rejected-save draft retention, successful editing, confirmation focus/keyboard behavior, forbidden access, session expiry, and mobile-menu Escape/focus restoration. Screenshots and JSON are saved to `.frontend-evidence` (Git-ignored), or `FRONTEND_EVIDENCE_DIR`.

The state check switches fixture modes globally. Run it after the browser matrix, or give it a separate fixture/frontend instance. `FRONTEND_FIXTURE_PORT`, `FRONTEND_FIXTURE_URL`, and `PLATFORM_BASE_URL` configure ports. Stop temporary servers after checking. Do not connect fixture tools to a production API or use their test sessions as evidence of real authorization.

## Real Laravel verification

`live-laravel-check.mjs` and `live-laravel-crud-check.mjs` exercise the frontend against actual Laravel, PostgreSQL and Redis. They accept local loopback services only and require synthetic `@integration.example.invalid` accounts. Use a separate backend checkout, a dedicated database named `shouman_integration`, and an independently migrated/seeded schema. `seed-live-laravel.php` refuses any other database name, uses existing backend factories, and writes random credentials to a private `/tmp/shouman-live-credentials.json` file.

```bash
LARAVEL_BACKEND_PATH=/absolute/path/to/isolated/backend php scripts/verification/seed-live-laravel.php
PLAYWRIGHT_MODULE=/tmp/shouman-browser/node_modules/playwright/index.mjs PLATFORM_BASE_URL=http://127.0.0.1:3114 LARAVEL_API_URL=http://127.0.0.1:8130/api/v1 node scripts/verification/live-laravel-check.mjs
PLAYWRIGHT_MODULE=/tmp/shouman-browser/node_modules/playwright/index.mjs PLATFORM_BASE_URL=http://127.0.0.1:3114 LARAVEL_API_URL=http://127.0.0.1:8130/api/v1 node scripts/verification/live-laravel-crud-check.mjs
```

Start the backend from its isolated checkout so its own environment loads correctly, and run the frontend with `API_BASE_URL` pointing to that backend. The default credential file can be overridden with `LIVE_INTEGRATION_FIXTURE`. `FRONTEND_EVIDENCE_DIR` controls JSON/screenshot output as above. Every full run needs freshly seeded disposable records because it changes roles, status, publication state, prices, ordering and sessions. Reset only the explicitly isolated database between runs.

The initial 2026-10-19 run passed 15/17 main checks and8/8 CRUD checks. Subsequent real-browser repair verification passed17/17 and8/8, both exit0, as recorded in workspace `docs/service-continuation/progress.md` and `docs/service-continuation/evidence/`. These historical results close the timestamp and reorder reproductions for that revision; they do not certify later search changes. Rerun both matrices with independent fresh fixtures for search regression.


## Real catalog search verification (SH-204V)

`live-catalog-search-check.mjs` requires the same loopback Laravel/PostgreSQL/Redis and matching production Next build. It defaults to approved wide title/summary/description search; `SEARCH_SCOPE=title` supports the intermediate title-only revision and records that scope in its report. Do not run the wide scope against the intermediate implementation and report it passing.

Coordinator must exclusively prepare a fresh `shouman_integration` schema, required roles/permissions, then run `seed-live-laravel.php` if the regular matrices need it. The separate search seeder requires the **active default connection** to be PostgreSQL and named `shouman_integration`; it adds synthetic search offerings and a randomly named synthetic administrator. It uses a fresh private manifest path and refuses to overwrite an existing file. It does not reset the database.

```bash
LARAVEL_BACKEND_PATH=/absolute/path/to/isolated/backend SEARCH_INTEGRATION_FIXTURE=/tmp/shouman-search-run-unique.json php scripts/verification/seed-live-catalog-search.php
PLAYWRIGHT_MODULE=/tmp/shouman-browser/node_modules/playwright/index.mjs PLATFORM_BASE_URL=http://127.0.0.1:3114 LARAVEL_API_URL=http://127.0.0.1:8130/api/v1 SEARCH_INTEGRATION_FIXTURE=/tmp/shouman-search-run-unique.json FRONTEND_EVIDENCE_DIR=.frontend-evidence/search node scripts/verification/live-catalog-search-check.mjs
```

Never display credential manifests or commit them. Search execution mutates publication state and creates a real disposable session. Reset/reseed independently before each search,17-check main, and8-check CRUD run; those suites mutate roles, permissions, sessions and content. Coordinator owns reset, seed, build and runtime scheduling. Do not run while another agent owns a database or production build.

The search harness writes per-case JSON and responsive screenshots at320/360/390/768/1024/1440px. It asserts actual API matching, literal wildcard handling, Unicode limits, public resource fields, visibility, filters, cursor ordering, browser query state and real detail navigation. A hide between page requests checks visibility without claiming snapshot consistency. Reduced-motion preference and keyboard/label checks are automated; visual focus contrast,200% zoom and detailed motion inspection remain separate manual review.

No mocked dependency failures run in this real-API harness. For422/429/503/network UI injection use an independent HTTP fixture and a separate Next server/build pointing to it. Browser request interception cannot intercept Next's server-side Laravel requests. Never stop or reconfigure the shared real Laravel process for injection, and never present fixture authorization as Laravel evidence. The execution report must distinguish these checks.

### Isolated mocked search failures

`search-states-check.mjs` checks injected422(q association),429,503 and a destroyed upstream socket, followed by successful fixture-backed retry, plus distinct empty/no-match. These are mocked dependency/UI checks, **not real Laravel authorization evidence**. Modes affect catalog only and run on a dedicated fixture/Next pair; they never toggle the shared integration backend.

```bash
FRONTEND_FIXTURE_PORT=8113 node scripts/verification/api-fixture.mjs
API_BASE_URL=http://127.0.0.1:8113/api/v1 NEXT_BUILD_DIR=.next-search-final npm run start -- --hostname 127.0.0.1 --port 3117
PLAYWRIGHT_MODULE=/tmp/shouman-browser/node_modules/playwright/index.mjs PLATFORM_BASE_URL=http://127.0.0.1:3117 FRONTEND_FIXTURE_URL=http://127.0.0.1:8113 FRONTEND_EVIDENCE_DIR=.frontend-evidence/search-states node scripts/verification/search-states-check.mjs
```

Use a matching existing production build; confirm runtime API environment points to the fixture. Separate terminals/process sessions are required. The browser harness rejects root integration ports3115/3116. Stop only your owned fixture/Next sessions after execution. 2026-10-19 UTC run:9/9 groups passed, exit0; workspace evidence `docs/service-continuation/evidence/search-states/`. This does not replace real search/security/regression checks.
