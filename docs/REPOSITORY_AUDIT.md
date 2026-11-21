# Foundation audit — Personal AI OS v0.1

Audit date: 2026-11-20. This records the foundation inspected **before implementation changes**.

- Repository: <https://github.com/TailAdmin/free-nextjs-admin-dashboard>
- Audited upstream commit: `8075866c23d1841508ea0eb57cc861781a2fe28d` (`Merge branch 'v2.5.2'`).
- Upstream package: `free-nextjs-admin-dashboard` v2.5.2, marked private.
- Development branch: `feat/personal-ai-os-v0.1`.
- The clone was clean before implementation. No pre-existing user edits were present.

## License

The root `LICENSE` is the MIT License with `Copyright (c) 2023 TailAdmin`. It permits modification and distribution provided the copyright and permission notices accompany copies or substantial portions. The original `LICENSE` is preserved verbatim. TailAdmin attribution remains in the project documentation. This audit does not relicense third-party dependencies; their respective licenses still apply.

## Actual Free repository structure

| Area              | Actual source                                    | Observed behavior                                                                                          |
| ----------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| App Router root   | `src/app/[locale]/layout.tsx`                    | Async route params, static locale params, locale validation and providers; Outfit via `next/font/google`.  |
| Admin shell       | `src/app/[locale]/(admin)/layout.tsx`            | Existing SidebarProvider, AppSidebar, AppHeader and responsive content container.                          |
| Existing home     | `src/app/[locale]/(admin)/page.tsx`              | E-commerce metrics, monthly sales, target, statistics, demographics and recent orders demos.               |
| Other Free pages  | `(admin)/(main)` and `(admin)/(others-pages)`    | Calendar, profile, form elements, basic tables, blank page, chart and UI element demos.                    |
| Full-width routes | `src/app/[locale]/(full-width-pages)`            | Demo signin/signup and error page. These are UI examples, not authenticated account integrations.          |
| Shared UI         | `src/components/ui/`                             | Base UI and cva primitives including Button, Card, Dialog, Sheet, Skeleton and Sidebar.                    |
| Feature widgets   | `src/components/main/`, `src/components/others/` | Components organized into feature/widget folders with sibling data and type files.                         |
| Navigation        | `src/layout/app-layout/sidebar/data.tsx`         | Main, other and support menu arrays; support array is empty in Free.                                       |
| Theme             | `src/context/theme-context.tsx`                  | Class-based light/dark/auto preference and localStorage persistence.                                       |
| Locale routing    | `src/i18n/routing.ts`, `src/proxy.ts`            | Only `en` enabled; `localePrefix: "never"` keeps URLs unprefixed.                                          |
| Messages          | `src/messages/en.json`                           | **Only English message file exists in this Free checkout.**                                                |
| Styling           | `src/app/globals.css`, `postcss.config.js`       | Tailwind v4 theme tokens and plugins; no tailwind.config file.                                             |
| Compiler          | `tsconfig.json`                                  | Strict TypeScript, bundler module resolution, `@/*` alias to `src/*`.                                      |
| Build tooling     | `next.config.ts`, `eslint.config.mjs`            | next-intl, SVG loading via SVGR for webpack/Turbopack, existing demo-route redirects, Next ESLint presets. |

## AGENTS.md inspection

The root `AGENTS.md` was read before implementation. No nested `AGENTS.md` files were found in the upstream tree. Its title says **TailAdmin Pro**, and portions describe features absent from this actual Free repository:

- It calls the admin route group `(admin-layout)`; the checked-out source uses `(admin)`.
- It lists four enabled locales and four message files; actual routing and files are English only.
- It lists Pro dashboards, support pages, alternative layouts and a catch-all route that are not present in this Free checkout.

Implementation should follow actual source paths while retaining the applicable conventions: strict TypeScript, kebab-case files, reusable UI primitives, localized new navigation/header strings, logical CSS properties, class-based dark mode, feature folders, `@/` imports, and client-only dynamic ApexCharts imports. No additional application package is needed for the requested MVP. Existing locked dependencies may be installed with `npm ci`.

`AGENTS.md` also requires reading the relevant installed Next.js guides before coding; these are available under `node_modules/next/dist/docs/`. Server pages/layouts use the async App Router params and locale initialization shown by the existing source.

## Dependencies and scripts

`package-lock.json` uses npm lockfile v3. Versions below are the **audited upstream lock versions**, not inferred from ranges.

| Package              | Manifest range | Locked version |
| -------------------- | -------------- | -------------- |
| next                 | ^16.4.6        | 16.4.6         |
| react / react-dom    | ^19.3.1        | 19.3.1         |
| typescript           | ^5.9.3         | 5.9.3          |
| tailwindcss          | ^4.1.17        | 4.3.3          |
| @tailwindcss/postcss | ^4.3.3         | 4.3.3          |
| @base-ui/react       | ^1.8.0         | 1.9.0          |
| next-intl            | ^4.14.2        | 4.14.2         |
| apexcharts           | ^7.1.0         | 7.1.0          |
| react-apexcharts     | ^2.1.1         | 2.1.1          |
| eslint               | ^9.39.1        | 9.39.1         |
| eslint-config-next   | ^16.3.4        | 16.3.4         |

Other declared packages cover FullCalendar, form validation, TanStack Table, date utilities, flatpickr, OTP, vector maps, drag and drop, dropzone, resizable panels, SimpleBar, Swiper, class helpers and animation utilities. These are inherited foundation dependencies; the MVP need not import all of them. The manifest has 26 runtime and 14 development dependencies.

| Upstream command | Definition   |
| ---------------- | ------------ |
| `npm run dev`    | `next dev`   |
| `npm run build`  | `next build` |
| `npm start`      | `next start` |
| `npm run lint`   | `eslint .`   |

Upstream has **no test script, no dedicated test configuration and no automated test suite** in the audited tree. An install directory alone is not evidence of a passing install or verification. The final README/test results document records actual install, lint, build and browser-test outcomes for the implementation. This structural audit does not claim a vulnerability-free dependency graph.

## MVP boundaries established before implementation

- Use deterministic fictional fixtures for Today, Finance, Travel, Learning and AI Agents.
- Show the demo/mock nature in the interface and documentation.
- No banking credentials, provider keys, account linking, trading, booking, external account connections or real agent execution.
- Local theme preference and in-memory demo interactions are acceptable. Keep sensitive data out of browser storage.
- Future integrations require explicit server-side adapters, authorization, scoped credentials, validation and user consent, documented separately from this mock-only MVP.
- Mobile layouts must avoid fixed wide chart/table containers; touch controls, safe-area spacing and readable narrow layouts require browser verification.
- Work stays on the development branch. Create a review PR in a user-controlled writable repository when one is available. Do not merge or deploy.
