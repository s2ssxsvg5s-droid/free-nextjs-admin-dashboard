# Private hosted dashboard — Traditional Chinese

This deployment copy is based on reviewed application commit `6aea22ff6ab06f204f73ac145ad123687bf187bb` from [PR #1](https://github.com/s2ssxsvg5s-droid/free-nextjs-admin-dashboard/pull/1). That PR was merged outside this deployment workflow on 2026-11-21; hosting changes remain in [PR #2](https://github.com/s2ssxsvg5s-droid/free-nextjs-admin-dashboard/pull/2). The user authorized deployment on 2026-11-21.

The same dashboard components and fictional fixtures are compiled with Next.js static export. This copy materializes the routes at the App Router root and fixes the next-intl request configuration to Traditional Chinese (zh-TW), removes request-time locale proxy/redirects, and enables unoptimized local images. This avoids a server runtime while preserving the five reviewed sections and their local interactions. The original locale-aware development source remains in the GitHub review branch.

Run `npm ci` and `npm run build` to produce `out/`. `npm run dev` and `npm start` serve the built files for checks; `npm run dev:next` runs Next's development server. The hosting manifest declares the exact `out/` directory. The whole export, including Next router payloads, is deployed unchanged.

Sites access controls protect the hosted link for the owner's account. The static application itself has no account connections or app-level authentication. It contains no API keys, credentials, real financial data, trading, booking or live AI operations. The original MIT license and TailAdmin copyright are retained in the source and in the static output.

Hosting preparation uses the existing dependencies. The optional Sites helper scripts were unavailable in the managed environment, so the project build, Git synchronization and deployment archive use the equivalent standard Next.js, Git and tar commands required by the native Sites tools.

## Deployment checks

The static-export build, full TypeScript check and three fixture tests passed. Lint has zero errors and the same 1,092 inherited warnings recorded in the original test report. All five exported routes have HTML, Next router payloads and complete local Next asset references. The exported MIT notice matches the source exactly.

The managed preview initially rejected port binding in the command sandbox. With the normal tool network grant, its static server started; its relay then failed to open the browser port. The managed preview was stopped. Consequently the hosting copy did not receive another browser run. The original app's 18 Chromium/iPhone WebKit tests remain recorded in TEST_RESULTS.md; those results should not be read as a separate browser run of this static export.

## Traditional Chinese update — 2026-11-21

The hosted default is now `zh-TW`. The English catalog is retained, and the active dashboard namespaces have matching keys and interpolation variables. All five sections, shell controls, local simulation outputs, chart labels/data tables, accessible mobile drawer labels, empty/loading/error states, merchant names, dates and page metadata are localized. Chinese system fonts are used without external downloads. USD values, fixture dates, functions, mock-only boundaries and owner-private access are unchanged. Unlinked upstream demo pages remain outside this localization scope.

Validation: production static build, TypeScript, full lint (0 errors; 1,092 inherited warnings), targeted lint and 4 fixture/localization tests passed. Exported HTML for all five routes was checked for `lang="zh-TW"`, Chinese metadata/visible labels, complete Next asset references and unchanged MIT notice. The managed preview relay again failed to open port 4173, so the translated export did not receive a new browser run. The existing browser suite was updated to use localized message selectors and Chinese task/search input for a future run when preview infrastructure is available.

## Reviewed conversation-context import — 2026-11-22

The static site now supports a personal summary imported from a URL fragment. It is a manually supplied snapshot of the visible conversation, not a connector or automatic access to ChatGPT history. No real profile packet is stored in source, exported assets, the hosting manifest, or server environment variables.

The fragment is validated with the existing Zod package, shown for review, and saved to this browser only after the owner explicitly chooses save. Users can edit values, cancel an import without replacing the previous saved summary, or clear device storage. Invalid formats, unknown fields, excessive payloads and duplicate fact IDs are rejected. Text is rendered through React; it is never injected as HTML. Session-only storage and blocked deletion have explicit, stable states.

This feature requires no external-account eligibility or provider credentials. Sites access remains owner-private. Its browser storage is local to the device and does not establish cross-device or full-account chat synchronization. Finance, travel and agent data remain clearly labeled samples.

Validation: 21 unit checks passed, including strict packet validation and explicit-save/cancel/denied-storage/deletion-retry behavior. Production build, TypeScript, full lint (0 errors; 1,092 inherited warnings), targeted lint and whitespace checks passed. No new browser run was available because the managed preview relay remains unavailable; see [the current verification limits](TEST_RESULTS.md#conversation-summary-update--2026-11-22).
