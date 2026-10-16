# HELIX Living Evolution — Phase 1 Design Specification

**Date:** 2026-10-16
**Status:** Proposed for Moon's review — NOT IMPLEMENTED
**Repository:** dkim31262-cmyk/helix-panel
**Branch:** design/helix-living-evolution-20261016

## 0. Purpose / เป้าหมาย

Moon asks that Helix evolve as AI providers release new capabilities, models, pricing, and tools. The outcome must be a *living and verifiable* Helix, without making Moon continuously manage model names and tools.

**Human contract:** Keep the current Helix door and bridge rules. Show which providers and models changed, when sources were checked, and what the changes might mean for a workflow. News alone must never silently change routing or invoke costly external services.

**Phase 1 deliverable:** A daily-updated, source-backed AI Pulse in the existing Evolution HUD, backed by a small safe ingestion mechanism and review-gated model registry. Subsequent phases handle evaluated routing and private execution.

## 1. Verified existing state (read-only, 16 Oct 2026)

- Existing GitHub: https://github.com/dkim31262-cmyk/helix-panel
- Existing HTTPS door: https://helix-panel-gamma.vercel.app/
- Current production deployment: dpl_4KeEmysySUQWR9MyL1L7v7M5kPgJ (READY).
- README defines a public login-free Helix backplane. helix-contract.mjs is the source of truth for the mandate, bilingual text, schema, and main page.
- test.mjs checks generated-file drift; build.mjs runs tests and copies an explicit dist file list.
- evolution.js contains hard-coded FAMILY/SOURCES plus rule-scored advisory routing, not objective model benchmarks or cross-provider execution.
- vercel.json applies CSP connect-src 'self'. No password protection or SSO on the public deployment.

**Invariants:** Preserve helix.bridge.v1, helix.result.v1, Relay-only routing, the difference between orchestration_graph and skill_graph, the one-envelope result, and the existing canonical URL. Do not duplicate the Helix contract.

## 2. Why this approach

A. Hardcode every new AI model manually: low effort, but permanently stale. Reject.
B. Add authentication, multi-provider APIs, a database, credentials, billing and execution to the public Helix immediately: broad and unsafe. Reject for Phase 1.
C. **Selected: source-backed public model observatory on the existing static Helix, with strictly separate approved routing data.** An automated daily source checker publishes candidate *official page changes* to static JSON; reviewer-approved model facts stay pinned. The HUD loads both as first-party resources.

This approach reuses the existing Vercel/GitHub build without adding a private backend prematurely.

## 3. Components

### 3.1 Official source allowlist
New file: config/model-sources.json.

Each entry: provider_id, source_id, https_url, source_kind, locale, enabled, trust_level=official.
Initial providers: OpenAI, Anthropic, Google AI for Developers, xAI, Runway Dev. No arbitrary user URLs, private sources, keys, accounts, or uploads in this registry.

### 3.2 Scheduled source change collector
New script: scripts/check-model-sources.mjs.
New workflow: .github/workflows/model-observatory.yml.

- Run scheduled GitHub Actions job once per day at 03:17 UTC (best effort, not guaranteed exact), also support manual workflow_dispatch.
- Fetch only allowlisted HTTPS sources using bounded response bytes, timeouts and redirect-host checks. Do not send credentials. Follow source access rules.
- Normalize source material conservatively, compute a stable fingerprint, compare with last successful observation.
- If changed, classify only as official_source_changed. **A page update is NOT confirmation of a new model, quality improvement or price.**
- Store source_url, provider_id, source_id, first_seen_at, last_seen_at, observed_at, hash, optional small evidence excerpt, and candidate status. Deduplicate and bound history.
- On HTTP failures, site layout changes or timeouts, record failure and preserve last known-good records; never substitute invented news.
- The job may write **only** candidate signal data, never production routing, approved model facts, Helix contract, credentials or UI code.

### 3.3 Data contracts
New data file: data/model-signals.json, schema_version helix.model-signals.v1.

Top-level fields: schema_version, generated_at, last_attempt_at, source_statuses, signals. Each public signal has id, provider_id, source_id, source_url, first_seen_at, last_seen_at, event_type=official_source_changed, status=candidate, and optional evidence_excerpt of bounded size.

New data file: data/approved-models.json, schema_version helix.approved-models.v1.

Human-reviewed public facts only: provider_id, model_id, display_name, capabilities, source_urls, verified_at, api_access_claim, active_for_advice, superseded_by. No account entitlement inference. The scheduled checker must not edit this file; updates require reviewed PR.

Statuses remain separate:
- discovered = an official source or candidate change was observed
- verified_documentation = documentation substantiates a specific capability
- available_to_account = account/API entitlement confirmed independently
- benchmark_passed = objective task evaluation passed
- execution_test_passed = real tool/API invocation passed

### 3.4 Existing Evolution HUD
Modify only as needed: evolution.html, evolution.js.

- Add compact AI Pulse near the existing ledger, leaving the primary intention/router interface easy to reach on mobile.
- Fetch /model-signals.json and /approved-models.json from same origin, compatible with current CSP.
- Show provider, observed UTC date, official-source link, candidate/approved state, and source freshness. Mark the whole feed stale after 48h without successful check; show failed-source count.
- Keep current static SOURCES ledger as labeled archival fallback when first-party JSON cannot load or fails validation.
- Inject no external HTML. Render untrusted strings as text, not HTML markup or code.
- Do not imply that clicking provider access checkboxes performs live OAuth.
- Preserve existing handoff/export actions and navigation, bilingual copy where applicable.

### 3.5 Build and release safeguards
Modify: build.mjs and test.mjs.

- Include both public JSON files in dist and verify schema, official HTTPS URLs, timestamps, data shape, duplicate IDs, and absence of known credential patterns.
- Existing Helix source-of-truth tests MUST still pass with no contract drift.
- The scheduled job can commit validated candidate data to main only when repository permissions and branch policy permit; otherwise fail visibly in Actions. It must not bypass approval or branch protection.
- Any code, source-list, or approved-model change uses PR review and a preview/test gate.
- Build failure blocks production deployment through existing node build.mjs contract.
- The public app remains non-authenticated/read-only in this phase.

## 4. Data flow and trust boundaries

Official source URL -> bounded read/normalize -> fingerprint -> candidate signal -> schema/test gate -> public JSON -> AI Pulse.

Candidate signal -> documented interpretation/human review -> approved models PR -> tests/preview -> merge -> approved capabilities display.

**No candidate is automatically promoted into the model router.** A newer model is not presumed better. Active AI routing evaluations are Phase 2.

**No third-party API execution here.** Authenticated private orchestration, spend controls, audio/video jobs, model API keys, and private user content belong to a later separate Phase 3.

## 5. UX and privacy

- One door: https://helix-panel-gamma.vercel.app/ ; keep Evolution entry from Helix.
- The user should understand within seconds: what changed, source and date, whether it is a candidate, and whether their workflow requires action.
- 375px iPhone Safari and desktop/mobile Chrome must not overflow horizontally; controls reachable by keyboard and labeled for accessibility.
- No private prompts, media, accounts, patient identifiers, secrets or provider tokens placed in the public JSON or page.
- Provider-supplied text is **untrusted data**; it cannot direct agents or mutate system instructions.
- Fail visibly and recover gracefully. "No new observed changes in checked sources" is different from "No AI updates exist".
- Daily checking is not guaranteed real-time coverage; show observed_at and stale status rather than advertising live data.

## 6. Acceptance criteria

1. node test.mjs passes old contract invariants plus new observatory checks.
2. Known fixture of an official-source content change produces exactly one candidate with a dated original-source link.
3. Repeated identical fetch creates no duplicate; changed unrelated cosmetic material is at most a candidate, never a verified release.
4. Timeout/invalid upstream/parse failure preserves prior observations and displays source-specific failure/staleness.
5. Malicious-looking upstream content does not insert executable markup or corrupt UI.
6. Candidate update cannot modify approved-models.json, FAMILY routing scores, contract, or any user account state.
7. Daily workflow runs once in a controlled test/manual dispatch and produces reviewed evidence of candidate-data publication or clear failure without compromising main.
8. Production build and Safari/Chrome functional QC pass; existing main, mandate, schema, Evolution, export and copy still work.

## 7. Future slices (separate specs/plans, NOT Phase 1)

**Phase 2: Measured model router** — Model quality/latency/cost benchmarks against Moon's actual task classes, permission checks, tool-availability verification, and explainable reasons to keep or change a model.

**Phase 3: Authenticated private execution** — Connector/API adapters, backend job queue, budget controls, user approval gates, music/video workflows, secure project files, receipts, and rollback. No credentials or originals on this public repo.

**Phase 4: Living AI houses & Academy** — Reuse the approved registry for each AI house, changelogs and foundation courses. Preserve unique provider identity; do not replicate data sources.

## 8. Primary-source index

- OpenAI models: https://developers.openai.com/api/docs/models/all
- Anthropic models: https://platform.claude.com/docs/en/models/overview
- Google models: https://ai.google.dev/gemini-api/docs/models
- xAI docs: https://docs.x.ai/
- Runway API models: https://docs.dev.runwayml.com/guides/models/
- GitHub workflow scheduling: https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows#schedule
- Vercel cron option for later private backend: https://vercel.com/docs/cron-jobs/quickstart

## 9. Review gate and reality statement

This is a reviewed architectural direction recorded as a **proposed written design**. It does not mean source bots are running, a live catalog exists, code is deployed, or provider APIs are connected. After Moon reviews and approves this written spec, produce a separate step-by-step test-driven implementation plan. Implement only after the plan review on an isolated feature branch; verify in preview/mobile before merging production.
