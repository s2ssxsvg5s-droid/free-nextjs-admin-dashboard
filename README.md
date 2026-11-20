# Personal AI OS — MVP v0.1

A mobile-first personal dashboard for Today, Finance, Travel, Learning, and AI Agents. Built with TypeScript, Next.js App Router, and Tailwind CSS on the actual [TailAdmin Free Next.js repository](https://github.com/TailAdmin/free-nextjs-admin-dashboard).

**This is a mock workspace.** Every balance, transaction, itinerary, learning record, and agent result is fictional. The sample date is **November 20, 2026**. There are no account connections, financial credentials, API keys, trading operations, booking operations, or live AI calls. No environment variables are needed to run the app.

## Run locally

Use **Node.js 22.18+ or Node.js 24** with npm. Next.js itself supports Node 20.9+, but the fixture tests use Node’s built-in TypeScript stripping and require the newer recommended runtime.

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>. For a production build and local preview:

```bash
npm run build
npm start
```

Install the locked dependencies with `npm ci`; keep `package-lock.json` in source control. The MVP adds no application dependencies. The system font stack avoids a build-time Google Fonts download and external font requests.

## What works

| Section   | Route       | MVP behavior                                                                                                                                     |
| --------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Today     | `/`         | Sample daily brief, refresh loading state, editable focus list, completion empty state, weekly learning chart, and links to trip/course details. |
| Finance   | `/finance`  | Mock net worth, cash and invested assets; monthly income/spending chart; November budget; spending search and empty/reset state.                 |
| Travel    | `/travel`   | Fictional Lisbon trip for Nov 26–30, itinerary, budget, stay details, and interactive packing checklist.                                         |
| Learning  | `/learning` | Three sample courses, 15-minute session logging, capped progress, course completion, and a session journal that starts empty.                    |
| AI Agents | `/agents`   | Three deterministic local jobs, simulated loading, pause/resume, results, and reset. No agent executes outside the browser.                      |

The shell includes responsive navigation, an accessible mobile drawer, a skip link, and a persistent light/dark theme. Cards and loading/empty states are reusable. Charts load on the client and include accessible data alternatives.

Focus items, packing, learning sessions, and agent jobs live in component state. They reset when their page is unmounted or reloaded; Today remains a fixture-based overview rather than a synchronized datastore. Only the theme preference persists in local storage. Denied browser storage does not prevent theme switching.

## Architecture

```text
src/
├── app/[locale]/
│   ├── layout.tsx                 # locale validation, providers, viewport
│   └── (admin)/
│       ├── layout.tsx             # shared dashboard shell
│       ├── page.tsx               # Today
│       ├── finance/page.tsx
│       ├── travel/page.tsx
│       ├── learning/page.tsx
│       ├── agents/page.tsx
│       ├── loading.tsx            # route loading skeleton
│       └── error.tsx              # recoverable route error UI
├── components/
│   ├── personal-os/
│   │   ├── shared/                # headings, cards, loading and empty states
│   │   ├── today/
│   │   ├── finance/               # fixtures, chart, transactions
│   │   ├── travel/                # itinerary and packing
│   │   ├── learning/              # courses and session journal
│   │   └── agents/                # fixed local simulation
│   └── ui/                        # inherited TailAdmin/Base UI primitives
├── context/theme-context.tsx
├── layout/app-layout/             # header and sidebar/navigation data
├── i18n/                          # next-intl routing; English only
├── messages/en.json               # existing and MVP translation namespaces
└── app/globals.css                # Tailwind v4 tokens and shared styles
```

Pages remain App Router server components with metadata and locale initialization. Interactive widgets use client components. ApexCharts is imported dynamically with SSR disabled. Typed fixtures and widget parts sit beside each feature rather than in page files. Existing TailAdmin UI components, theme tokens, and locale-aware navigation are reused.

English is the only enabled locale in this Free checkout, with unprefixed URLs. New UI copy uses the `os`, `osShell`, `osSections`, `osLearning`, and `osAgents` message namespaces. Additional languages require message files and routing configuration together.

Original TailAdmin demo routes remain in the source for reference but are not linked from the MVP navigation. These include chart/UI demos, profile/calendar/forms, and sign-in/sign-up examples. Authentication examples are visual mock forms only: do not enter real credentials. The MVP has no authentication service or provider API routes.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

`npm test` runs Node fixture checks that reconcile the mock budget, validate demo records, and verify MIT attribution. `npm run typecheck` checks the complete TypeScript project. Build and lint include retained upstream code.

Browser tests run against an already running local server:

```bash
# Terminal 1: after npm run build
npm start

# Terminal 2: with Playwright and its Chromium/WebKit browsers available
npm run test:e2e
```

Playwright is a **separately managed test runner**, not a new project dependency. It must resolve as `playwright` from Node’s module lookup or be supplied with an absolute module path:

```bash
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.js npm run test:e2e
```

Manage the runner, matching browser binaries, and browser system libraries in your development/CI environment. Installing application dependencies alone does not install this external runner. `BASE_URL` optionally changes the test server URL (default `http://127.0.0.1:3000`). `WEBKIT_EXECUTABLE_PATH` optionally selects a compatible custom WebKit executable. Browser tests save screenshots under ignored `test-results/`.

The suite exercises desktop Chromium and iPhone Safari-style WebKit: navigation, dark mode and reload persistence, storage denial, search/reset, packing completion, learning progress, simulated agent loading, narrow viewport overflow, console errors, and external request checks. See [recorded test results and limitations](docs/TEST_RESULTS.md) for the actual run outcomes.

## iPhone Safari

The supported target is **iOS 17+ Safari**. Tailwind CSS v4’s baseline is Safari 16.4; this MVP targets the newer iOS release. The UI uses device-width viewport settings, safe-area spacing, 44px primary touch controls, 16px text inputs to avoid focus zoom, single-column narrow layouts, and charts that fit the viewport. Theme storage access is guarded for restricted browsing modes, and reduced-motion preferences are respected.

WebKit with an iPhone device profile provides repeatable compatibility checks. It does not replace checking a physical iPhone, including browser chrome, orientation changes, safe areas, and the on-screen keyboard, before a production release.

## Future integration boundaries

v0.1 deliberately stops at typed fixtures and local interactions. A later integration should replace fixture access through explicit typed provider interfaces, keeping components separate from service-specific data formats. Introduce server-only, read-only adapters first and validate their responses before rendering.

- Require explicit authentication, scoped authorization, user consent, and a reviewed data-retention policy before connecting external accounts. Keep tokens and provider credentials server-side; never put them in browser storage or client bundles.
- Finance adapters may later expose read-only balances and transactions. Trading, transfers, payments, and other financial writes are outside this MVP and need a separate design and approval process.
- Travel adapters may later read plans and reservations. Booking, cancellation, and payment workflows require separate explicit authorization.
- Learning adapters may later read course catalogs/progress. Synchronizing session writes needs an authenticated user model and a clear source of truth.
- Real AI agents need authenticated server execution, scoped tools, validation, cancellation, audit trails, cost/rate limits, and per-action approval for consequential operations. Current fixed results and timers are UI simulations only.
- Add durable storage, loading/error contracts, integration tests, and isolation between users before treating any provider data as real.

## Foundation, license, and review

The audited foundation is TailAdmin Free v2.5.2 at commit **`8075866c23d1841508ea0eb57cc861781a2fe28d`**. [The repository audit](docs/REPOSITORY_AUDIT.md) records its actual structure, dependencies, license, and the differences between its Pro-labeled `AGENTS.md` and the Free source.

The original [MIT License](LICENSE), including **Copyright (c) 2023 TailAdmin**, is preserved unchanged. Keep this license and copyright/permission notices with copies or substantial portions of the code. Third-party dependencies retain their own licenses. Upstream documentation is available at <https://tailadmin.com/docs>.

Development branch: `feat/personal-ai-os-v0.1`. Review destination: [your TailAdmin fork](https://github.com/s2ssxsvg5s-droid/free-nextjs-admin-dashboard). See [the PR summary](docs/PR_SUMMARY.md) for review scope and verification. Do not merge or deploy this work without approval.
