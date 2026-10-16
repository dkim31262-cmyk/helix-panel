# HELIX Living Evolution Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Add a safe, source-backed daily AI change observatory to the existing Helix Evolution HUD without changing Helix's original public contract, silently changing model routing, or touching production before review.

**Architecture:** Keep the present static Helix frontend. Node 24 (built-in fetch, crypto, fs, test runner) collects fingerprints of explicitly allowlisted official documentation once daily and publishes *candidate* JSON; a separate manually reviewed JSON registry describes approved model facts. Evolution HUD reads first-party JSON and clearly distinguishes verified facts, candidate source changes, failure, and staleness; none of the intake data is allowed to change routing weights or call provider APIs.

**Tech Stack:** Existing Node.js ESM (.mjs) static site; Node 24.x (per Vercel project); Node built-in node:test/assert/fetch/crypto/fs; vanilla HTML/CSS/JS; JSON; GitHub Actions scheduled workflow; existing Vercel node build.mjs gate. Do not add React, package.json dependencies, accounts, databases, or provider SDKs for Phase 1.

**Spec:** docs/superpowers/specs/2026-10-16-helix-living-evolution-design.md

**Repository / read-only baseline verified:** dkim31262-cmyk/helix-panel; main; README.md, helix-contract.mjs, render.mjs, test.mjs (80 lines), build.mjs (24 lines), evolution.html (24 mostly minified lines), evolution.js (193 lines), vercel.json. Current Vercel production deployment dpl_4KeEmysySUQWR9MyL1L7v7M5kPgJ was READY when checked on 2026-10-16. Do not infer Safari/Chrome functional quality from READY.

**Preparation:** Written spec and this plan are authored on design/helix-living-evolution-20261016, separate from main. After plan review, implement on feat/helix-living-evolution-phase1, created from the reviewed design branch. Do not edit main, merge to main, invoke Vercel production deployment, or enable a scheduled job by hand during planning.

## Global Constraints

- Single source of truth: helix-contract.mjs -> render.mjs -> generated mandate.txt, mandate.th.txt, helix.schema.json, index.html; never edit those outputs by hand.
- Preserve helix.bridge.v1, helix.result.v1, the Relay-only rule, one-envelope human result, orchestration_graph vs skill_graph distinction, and the canonical https://helix-panel-gamma.vercel.app/.
- Keep the present evolution.js FAMILY, WEIGHTS, GROUNDS and choose() routing logic unchanged in Phase 1. AI changes are informational, not model selection instructions.
- Public Helix has no login, SSO or password. No private prompts, patient data, credentials, billing, voice recordings, or AI-provider API keys anywhere in published files.
- CSP in vercel.json currently has connect-src 'self' and script-src 'self'; use first-party GET for /model-signals.json and /approved-models.json and external same-origin JS, no inline executable scripts.
- The scheduled collector reads only approved official HTTPS sources and may edit only data/model-signals.json; source registry, approved models, code, and routing weights are PR-review only.
- A source page changed = a CANDIDATE signal, not a verified new model, price, benchmark win or availability entitlement.
- Preserve old failure state, display source/check timestamps, and never describe a best-effort daily checker as real-time.
- Development is test-first and offline/deterministic by default; mock network/time in unit tests. Always run the existing node test.mjs before any commit that changes application behavior.
- All bot-authored changes in this work must remain on isolated branches until Moon reviews the deliverables and approves the eventual production step.

## Review Focus

Five failure cases particularly likely to hurt a real user; the precise tests below are owned by their respective tasks:

1. Official URL redirects to an unlisted host, IP address or HTTP: Task 2 test rejects redirect without fetching redirected content.
2. First healthy snapshot or identical repeat is interpreted as breaking news: Task 3 test records a baseline without a candidate and deduplicates later checks.
3. An upstream outage destroys prior observations or appears as a healthy no-news day: Task 3 test preserves previous data and marks per-source failure; Task 5 displays stale/failure.
4. An upstream document includes script/HTML injection or malformed public URLs: Task 1 rejects off-allowlist/invalid signal URLs, Task 5 uses textContent and safe DOM creation.
5. A generated news update accidentally edits the approved registry, routing constants, or canonical Helix contract: Task 6 protects build invariants, Task 7 asserts strict Git staging and changed-file allowlist.

---

## Working file map

### Create (Phase 1 only)
- config/model-sources.json: exact official-source allowlist, initially OpenAI, Anthropic, Google, xAI, and Runway; no user-generated URL input.
- data/model-signals.json: public, initially empty candidate feed with source check statuses.
- data/approved-models.json: public manually-reviewed registry, initially empty; never auto-promote entries.
- scripts/observatory-schema.mjs: validation of source config and two public data envelopes.
- scripts/observatory-fetch.mjs: bounded safe official-page fetch + normalized fingerprint.
- scripts/observatory-diff.mjs: deterministic change reducer, source failures, deduplication and history cap.
- scripts/check-model-sources.mjs: job orchestration, atomic output and mockable source intake.
- observatory-ui.mjs: first-party browser fetch/render and date/status view-model.
- tests/observatory/schema.test.mjs
- tests/observatory/fetch.test.mjs
- tests/observatory/diff.test.mjs
- tests/observatory/job.test.mjs
- tests/observatory/ui.test.mjs
- tests/observatory/workflow.test.mjs
- .github/workflows/model-observatory.yml: scheduled + manual, narrowly scoped bot write permissions and explicit changed-file gate.

### Modify
- evolution.html: compact AI Pulse mounted by the existing ledger (id=ledger) with a clear archive label and no reorganization of the brief form (id=hud).
- build.mjs: include observatory-ui.mjs and the two JSON files in dist after tests.
- test.mjs: run Node unit suite plus preserve all existing exact-contract assertions and validate public JSON.
- evolution.js: preferably NO edit; keep FAMILY, WEIGHTS, GROUNDS, SOURCES, choose(), ledger rendering and copy/export as they are.
- vercel.json: NO edit expected, since all API data are first-party static JSON.

### Do not modify
- helix-contract.mjs, render.mjs, index.html, mandate.txt, mandate.th.txt, helix.schema.json, helix-panel.js (except if later tests demonstrate an essential change; stop for explicit review).

## Task 1: Source registry and public schema

**Files:** Create config/model-sources.json; data/model-signals.json; data/approved-models.json; scripts/observatory-schema.mjs; tests/observatory/schema.test.mjs.

**Interfaces:**
- validateSources(input: unknown): array of SourceRecord; throws on invalid input.
- validateSignals(input: unknown, sources: SourceRecord[]): SignalsDocument; throws on invalid input or mismatched source_id/source_url.
- validateApprovedModels(input: unknown, sources: SourceRecord[]): ApprovedModelsDocument; throws on invalid input.
- SourceRecord = {provider_id, source_id, https_url, source_kind, locale, enabled, trust_level}.
- SignalsDocument = {schema_version:"helix.model-signals.v1",generated_at,last_attempt_at,source_statuses,signals}.
- ApprovedModelsDocument = {schema_version:"helix.approved-models.v1",models}.
- All timestamps are ISO UTC or null where a never-run initial state permits null.

- [ ] Step 1 — Write failing tests in tests/observatory/schema.test.mjs: asserts validateSources accepts precisely identified official HTTPS hosts; refuses http://, localhost, private IPs, credentials, unexpected provider IDs, duplicate source_id and malformed URL; validateSignals (with allowlisted sources argument) rejects duplicate signal IDs, invalid date, source_id/source_url mismatches, non-candidate ingestion statuses and secret-like fields; validateApprovedModels rejects missing source URLs and unknown status/permission claims; accepts the empty initial valid JSON.
- [ ] Step 2 — Run node --test tests/observatory/schema.test.mjs. Expected FAIL because module and data do not yet exist.
- [ ] Step 3 — Implement validators and initial data. Allowlist initial URLs from the approved spec: https://developers.openai.com/api/docs/models/all ; https://platform.claude.com/docs/en/models/overview ; https://ai.google.dev/gemini-api/docs/models ; https://docs.x.ai/ ; https://docs.dev.runwayml.com/guides/models/. Initial signals = empty arrays, generated_at:null, last_attempt_at:null; initial approved models=[]; DO NOT invent release data.
- [ ] Step 4 — Run node --test tests/observatory/schema.test.mjs. Expected PASS for valid fixtures; all malicious/invalid fixtures rejected.
- [ ] Step 5 — Commit only these five files: git add config/model-sources.json data/model-signals.json data/approved-models.json scripts/observatory-schema.mjs tests/observatory/schema.test.mjs && git commit -m "feat(helix): define validated observatory contracts".

## Task 2: Fetch official sources without creating an SSRF path

**Files:** Create scripts/observatory-fetch.mjs; tests/observatory/fetch.test.mjs.

**Interfaces:**
- fetchOfficialSource(source: SourceRecord, opts: {fetchImpl?: typeof fetch, timeoutMs?: number, maxBytes?: number}): Promise<{provider_id,source_id,source_url,hash,evidence_excerpt}>.
- normalizePage(body: string): string. Use conservative HTML noise stripping (scripts/styles/comments, whitespace), not speculative extraction of model claims.
- hashPage(normalized: string): string (SHA-256 lowercase hex).
- Default timeoutMs=15000, maxBytes=2000000; follow at most 3 explicit redirects and validate *each* Location against the configured origin/host allowlist and HTTPS rule; do not send credentials or authorization headers.

- [ ] Step 1 — Write failing tests in tests/observatory/fetch.test.mjs using injected fake fetch responses: deterministic hash on identical content; changed content yields different hash; three-redirect maximum; off-allowlist, localhost, IP-literal and HTTP redirects are rejected before next fetch; 4xx/5xx, non-HTML content type, aborted request, slow fetch and size overflow become typed failures with source_id.
- [ ] Step 2 — Run node --test tests/observatory/fetch.test.mjs. Expected FAIL (module missing).
- [ ] Step 3 — Implement fetchOfficialSource/normalizePage/hashPage with an AbortController and streamed bounded byte counting; pass response bodies only as untrusted strings; emit capped plain-text evidence excerpts, no commands or rendered HTML.
- [ ] Step 4 — Run node --test tests/observatory/fetch.test.mjs. Expected PASS including the unlisted-host redirect test; no live network required.
- [ ] Step 5 — Commit these two files: git add scripts/observatory-fetch.mjs tests/observatory/fetch.test.mjs && git commit -m "feat(helix): safely fingerprint official model sources".

## Task 3: Candidate-only reducer and durable failure state

**Files:** Create scripts/observatory-diff.mjs; tests/observatory/diff.test.mjs.

**Interfaces:**
- applyObservations(previous: SignalsDocument, sources: SourceRecord[], results: Array<FetchSuccess | FetchFailure>, nowIso: string): SignalsDocument.
- SourceStatus = {provider_id,source_id,source_url,last_attempt_at,last_successful_check_at,last_successful_hash,last_error}; never-run initial state allows null success/check/hash/error values.
- CandidateSignal = {id,provider_id,source_id,source_url,first_seen_at,last_seen_at,observed_at,hash,event_type:"official_source_changed",status:"candidate",evidence_excerpt}.
- Candidate id = SHA-256(provider_id + "|" + source_id + "|" + previous_successful_hash + "|" + new_hash), so identical transitions deduplicate. History bounded to 100 signals and stable recency ordering.

- [ ] Step 1 — Write failing tests: empty first success establishes a baseline with NO candidate; identical second check creates none; later changed hash creates exactly one candidate with an official URL/date; repeated identical check doesn't duplicate; an error after success retains hash and all old candidates but records last_error; partial failure preserves successes from other providers; repeated change transition deduplicates; oldest history pruned after 100; malformed date is rejected.
- [ ] Step 2 — Run node --test tests/observatory/diff.test.mjs. Expected FAIL (missing reducer).
- [ ] Step 3 — Implement the immutable reducer. Use source_id for lookups, output complete and schema-valid source_statuses for configured sources, and never use a source payload to decide account access or modify approved models.
- [ ] Step 4 — Run node --test tests/observatory/diff.test.mjs. Expected PASS for all baseline, change, repeat and failure cases.
- [ ] Step 5 — Commit: git add scripts/observatory-diff.mjs tests/observatory/diff.test.mjs && git commit -m "feat(helix): turn page drift into candidate-only signals".

## Task 4: Testable collector and atomic data publication

**Files:** Create scripts/check-model-sources.mjs; tests/observatory/job.test.mjs.

**Interfaces:**
- runObservatory({sourcesPath,signalsPath,fetchSource=fetchOfficialSource,now=new Date()}): Promise<{checked:number,ok:number,failed:number,changed:number,output:SignalsDocument}>.
- writeSignalsAtomic(path: string, doc: SignalsDocument): void; create sibling temporary file, validate document, atomic rename; never write approved registry or other repository files.
- CLI entry: node scripts/check-model-sources.mjs ; CLI outputs checked/ok/failed/changed and an honest warning if failures occur; exit non-zero for malformed inputs/write failure. Source network failures are represented in validated JSON, so CI can publish failure status before marking job unhealthy.

- [ ] Step 1 — Write failing tests using temporary directories and injected fetchSource: initial baseline, repeated unchanged fetch, one changed source, mixed success/failure, all-sources-fail with previous data preserved, atomic-write failure keeps old JSON intact, and approved-models.json plus helix-contract.mjs unchanged byte-for-byte.
- [ ] Step 2 — Run node --test tests/observatory/job.test.mjs. Expected FAIL for missing job entry.
- [ ] Step 3 — Implement runObservatory, data validation against validateSources/validateSignals, atomic write, and the CLI guarded against accidental execution when imported into Node tests. Log source count and failure count without claiming 100% market coverage.
- [ ] Step 4 — Run node --test tests/observatory/job.test.mjs and node --test tests/observatory/*.test.mjs. Expected PASS using only fixtures. Do NOT run the live collector against provider sites as a prerequisite for TDD.
- [ ] Step 5 — Commit: git add scripts/check-model-sources.mjs tests/observatory/job.test.mjs && git commit -m "feat(helix): add reproducible AI source-change job".

## Task 5: AI Pulse UI with failure, freshness and injection protections

**Files:** Create observatory-ui.mjs; tests/observatory/ui.test.mjs. Modify evolution.html only near the section id=ledger, plus minimal responsive CSS already in that file.

**Interfaces:**
- pulseViewModel(signals: SignalsDocument, approved: ApprovedModelsDocument, nowMs: number): {entries,failedSources,stale,lastSuccessAt,emptyReason}, pure and testable without browser.
- loadPulse(fetchImpl: typeof fetch): Promise<{signals,approved}>; fetches ONLY same-origin /model-signals.json and /approved-models.json with no secrets.
- renderPulse(root: HTMLElement, model: PulseModel, doc: Document): void; createElement/textContent for all untrusted strings and safe official HTTPS anchors; no innerHTML from source content.
- bootPulse({fetchImpl,root,doc,nowMs}): Promise<void>; on failure renders explicit "Feed unavailable / ข้อมูลล่าสุดยังไม่พร้อม" and retains old static #ledgerList as labeled archive.

- [ ] Step 1 — Write failing tests in tests/observatory/ui.test.mjs with a tiny injected DOM facade (or a DOM runner only if already present; no new app runtime): stale at strictly over 48h since last successful check; failed source count; no event after baseline wording; source candidate never reads "verified"; XSS-shaped evidence appears as inert text and cannot create DOM/script; off-host links rejected; failed JSON fetch returns labeled archive fallback without changing #hud controls.
- [ ] Step 2 — Run node --test tests/observatory/ui.test.mjs. Expected FAIL for missing UI module / mount point.
- [ ] Step 3 — Implement the view-model and safe DOM adapter. Insert a compact <div id="ai-pulse"> within the existing ledger section and load <script type="module" src="observatory-ui.mjs"></script> externally. Label SOURCES list "Historical / Archive" and do not modify evolution.js's choose(), weights or exported packet. Avoid claiming live when data are static or stale.
- [ ] Step 4 — Run node --test tests/observatory/ui.test.mjs and node --check observatory-ui.mjs. Expected PASS; browser evidence still pending Task 8.
- [ ] Step 5 — Commit: git add observatory-ui.mjs evolution.html tests/observatory/ui.test.mjs && git commit -m "feat(helix): show sourced AI Pulse without changing routing".

## Task 6: Lock build and contract invariants

**Files:** Modify build.mjs and test.mjs (existing Node ESM test gate); use tests from Tasks 1-5.

**Interfaces:** test.mjs remains the single prod-facing test gate. build.mjs must invoke test.mjs and then copy dist/ assets, including observatory-ui.mjs, data/model-signals.json -> dist/model-signals.json, and data/approved-models.json -> dist/approved-models.json. Keep all previous copied files.

- [ ] Step 1 — Add failing integration assertions to test.mjs: data validation succeeds using validateSources and the cross-referenced public-data validators; new HTML module and #ai-pulse mount are present; build.mjs names the three new public assets in its explicit copy configuration (do not assert dist exists before build); no approved-models mutation by collector; existing FAMILY, WEIGHTS, GROUNDS, choose() and the Helix contract/main URL still appear intact. Preserve old contract checks, don't rewrite them.
- [ ] Step 2 — Run node test.mjs. Expected FAIL until test runner/asset hooks are wired; existing Helix assertions still pass.
- [ ] Step 3 — Extend test.mjs with an explicit spawn of node --test tests/observatory/*.test.mjs (expand the file list in Node or use shell-safe exact paths), and extend build.mjs's explicit copy list; validate the actual dist files only AFTER node build.mjs finishes. Use cpSync with exact destinations for flattened JSON URLs; never copy private config or secrets to dist.
- [ ] Step 4 — Run node test.mjs then node build.mjs; both expected exit 0. Verify dist/ index.html, evolution.html, evolution.js, observatory-ui.mjs, mandate.txt, mandate.th.txt, helix.schema.json, model-signals.json, approved-models.json exist and parse where applicable. Also run git diff -- helix-contract.mjs render.mjs index.html mandate.txt mandate.th.txt helix.schema.json; expected empty.
- [ ] Step 5 — Commit: git add build.mjs test.mjs && git commit -m "test(helix): gate public observatory on validated data and legacy contract".

## Task 7: Daily GitHub Actions with strictly scoped writes

**Files:** Create .github/workflows/model-observatory.yml; tests/observatory/workflow.test.mjs.

**Interfaces:** Scheduled at 03:17 UTC daily with cron "17 3 * * *" and workflow_dispatch. Node 24 setup, contents:write scoped for the workflow only; no provider tokens, no third-party actions beyond approved checkout/setup-node. Concurrency prevents racing writes. Job operates from trusted main, not untrusted pull_request head. It stages *only* data/model-signals.json, validates through node test.mjs, then commits the candidate-data-only change to main if branch policy permits. If protected main rejects push, report failure and require ordinary PR workflow; never bypass protection.

- [ ] Step 1 — Write failing static tests in tests/observatory/workflow.test.mjs: YAML contains schedule+manual trigger, node-version 24, main-only trusted checkout, narrow contents write, concurrency, no provider API secrets, exact git add data/model-signals.json, no git add -A, no staged code/approved-registry/contract. Check workflow includes node test.mjs before any push, and downstream health/status check if all sources failed.
- [ ] Step 2 — Run node --test tests/observatory/workflow.test.mjs. Expected FAIL because workflow absent.
- [ ] Step 3 — Create the workflow. Run node scripts/check-model-sources.mjs; validate node test.mjs; stage only candidate JSON; assert git diff --cached --name-only has zero or exactly data/model-signals.json; commit with clear bot author only on changed data; push using GitHub's standard token if authorized. If all sources fail, preserve/publish failure status (where permitted), then fail job visibly. Scheduled firing is best effort, not exact-minute or real-time.
- [ ] Step 4 — Run node --test tests/observatory/workflow.test.mjs, node test.mjs, and a manual GitHub Actions workflow_dispatch on the feature branch in a non-production-safe mode ONLY after verifying that dispatch cannot write to main; otherwise defer dispatch until after explicit production approval. Expected locally: all tests PASS and no code/routing paths in staged set.
- [ ] Step 5 — Commit: git add .github/workflows/model-observatory.yml tests/observatory/workflow.test.mjs && git commit -m "ci(helix): schedule safe candidate-only AI model observations".

## Task 8: Review and release readiness (NO production deploy)

**Files:** No application file changes unless regression tests fail; update this plan's verification receipts only after running tests. No changes to main.

**Interfaces:** Evidence packet contains current branch SHA, tests run, tested artifacts, change manifest, failure notes, and rollback reference to pre-change production SHA; preview link only if approved and actually created.

- [ ] Step 1 — Run node --test tests/observatory/*.test.mjs; expected all PASS with names/counts recorded.
- [ ] Step 2 — Run node test.mjs; expected old contract and Evolution checks PASS; run node build.mjs; expected dist generated.
- [ ] Step 3 — Compare public contract bytes and routing constants to main: git diff main...HEAD -- helix-contract.mjs render.mjs index.html mandate.txt mandate.th.txt helix.schema.json evolution.js; expected no unauthorized change.
- [ ] Step 4 — Check public dist for no secrets, no private content, no copied config/model-sources.json; inspect JSON timestamps, source links and stale behavior. Run preview/mobile functional QC only on an authorized preview or local server: iPhone Safari at width 375px and Chrome desktop/mobile; check no horizontal overflow, no JS exceptions, brief submit, copy, handoff download, archived news fallback, valid/invalid AI Pulse, keyboard focus and screen-reader labels. Record browser/device versions and screenshots or mark UNVERIFIED.
- [ ] Step 5 — Request independent review for source/network safety, failure handling, verified-vs-candidate semantics, exact Helix invariants, GitHub Actions write policy, and UX. Fix accepted issues via failing tests first and re-run tasks' checks. Don't call completion or passed QC without evidence.
- [ ] Step 6 — Hand Moon an explicit review packet for an eventual PR/preview. Do not merge main, turn on account integrations, spend credits, or deploy production as part of this task. Implementation branch may be proposed for merge later only with human approval.

## Acceptance mapping to written spec

- Source allowlist and validation: Task 1.
- Bounded official-source intake: Task 2.
- Candidate-only changes, dedupe, previous-data preservation: Task 3.
- Atomic, reproducible daily snapshot: Task 4.
- AI Pulse with confidence/date/failure/fallback and safe text: Task 5.
- Contract/source-of-truth/build preservation: Task 6.
- Daily scheduling and file-scoped authority: Task 7.
- Browser/mobile QC, rollback, no premature production: Task 8.
- Execution, multi-model benchmarking and private worker APIs are excluded explicitly; Phase 2/3/4 are separate specs.

## Execution handoff gate

**This plan is an implementation instruction, not proof of implementation.** Moon has approved the *written architecture*, but the *implementation plan* and method must be reviewed next. Recommend **subagent-driven** execution in Work Mode because network restrictions, CI write permissions, XSS/injection and production contract drift benefit from independent per-task review. If that execution mode is not available, use a native sequential executor with the same test gates and a final independent review. Either path requires this plan's review before touching product code. Production approval is a separate later gate.
