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

At the 2026-10-19 verification, the main matrix passed 15/17 checks and the CRUD matrix passed 8/8. The two failing checks reproduce open defects: non-UTC offering timestamps shift their instant on backend persistence, and curriculum reordering loses its success confirmation during refresh. The main script intentionally exits nonzero while those defects remain. Do not substitute fixture-only success for this result.
