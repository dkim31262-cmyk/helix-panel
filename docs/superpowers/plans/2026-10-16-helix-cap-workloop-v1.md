# HELIX CAP Workloop v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a portable, read-only and evidence-grounded HELIX Cognitive Amplification Protocol with Tool Instinct, local effort routing, verifiable receipts, resumable checkpoints and a reproducible CAP-versus-Work *evaluation harness*; do not claim that CAP equals Work.

**Architecture:** CAP is an isolated Node.js ESM package under `cap/`, exposing JSON Schemas and pure decision/evidence/evaluation functions. Runtimes supply discovered capabilities, recorded observations and authorized artifact references; CAP does not discover live tools, act on accounts, run Work/cloud browsers or manage secrets itself. It leaves the original public Helix contract, generator, router and production build untouched.

**Tech Stack:** Node.js 24.x ESM, built-in `node:test`/`node:assert`/`node:crypto` and JSON; isolated `cap/package.json` with pinned `ajv@8.17.1` and `ajv-formats@3.0.1` for JSON Schema Draft 2020-12 validation (committed `cap/package-lock.json`); Markdown reference docs. No server, SaaS integration, browser tool, AI SDK, app UI or production code path.

**Spec:** `docs/superpowers/specs/2026-10-16-helix-cap-workloop-v1-design.md` (approved by Moon, 2026-10-16).

## Global Constraints

- Work on a new isolated implementation branch `feat/helix-cap-workloop-v1` cut from `plan/helix-cap-workloop-v1-20261016` only **after Moon reviews and approves this plan and execution method**. Never develop on main or on `feat/helix-living-evolution-phase1`.
- Original Helix public source of truth is `helix-contract.mjs`; `render.mjs` generates `index.html`, `mandate.txt`, `mandate.th.txt` and `helix.schema.json`. Do not edit ANY of these, `evolution.js`, `evolution.html`, `test.mjs`, `build.mjs`, `vercel.json`, `helix-panel.js`, the root `README.md`, or live public URLs.
- Preserve `helix.bridge.v1`, `helix.result.v1`, Relay-only, one-envelope output, Huddle/Quiet, and the separate `orchestration_graph` vs `skill_graph` meanings. CAP wraps decisions; it never rewrites Helix graphs, runtime faces or entitlements.
- This is a **separate portable package**, not an added production dependency. The root site has no `package.json`; install and test only via `npm ci --prefix cap` and `node --test cap/tests/*.test.mjs`. Keep `cap/node_modules/` ignored using `cap/.gitignore`. Do NOT add CAP to Vercel `dist/` or alter the root build.
- Use a real, strict JSON Schema validator (Ajv 2020 + formats) rather than string-presence checks pretending to validate data. All six records include `schema_version`, `id`, `created_at` (UTC ISO-8601 with trailing `Z`), and `provenance`. Required type-specific fields use exact keys and spellings in the approved spec. Reject unknown object keys unless a task explicitly defines an extension.
- Public repository contains **synthetic** fixtures/docs/code only. No patient information, private briefs, connected-app content, auth tokens, API keys, private Work outputs, account-specific cost, or user-media originals.
- `effort_band` values `quick`, `managed`, `intensive` denote local CAP policy, NOT a ChatGPT account/model thinking setting. CAP offers recommendations only; no autonomous execution or billable retry.
- Candidate model documentation changes are not routing authority. Unknown access, missing connector and missing permission yield fallback/handoff/blocked, never fictitious execution.
- Each implementation task follows **RED test → observe expected failure → minimal GREEN code → run focused + full CAP suites → commit**, with recorded command outputs and commit SHAs. A retrospectively green test cannot prove TDD chronology.
- Evidence must distinguish source/document facts, executed tool outcome, tests, build, browser interaction, self-review and independent review. READY alone never proves functional browser QC.
- No PR merge, production deploy, GitHub Actions schedule, model/provider API access, billing or external publication without separate authorization; no push to main.
- If a required tool/subagent/browser is unavailable, record the gap and never label a self-check `independent_review`.

## Review Focus

Each item is mapped to a specific failing test below; these are not optional post-hoc checks.

1. **Caller supplies a fake or revoked connector:** Task 2's `unconfirmed_permission_blocks_tool` ensures a route never claims callable/executed.
2. **Green tests recorded after production code:** Task 3's `late_red_evidence_never_proves_tdd` requires chronologically anchored red/test-implementation/green evidence; status stays unverified if trust is missing.
3. **Stale/renamed checkpoint references:** Task 4's `stale_reference_blocks_resume` preserves prior history and fails closed.
4. **Missing or simulated Work results:** Task 5's `missing_work_run_is_incomplete` refuses denominator padding, fabricated parity and blind-review claims.
5. **One critical safety failure masked by attractive scores:** Task 6's `critical_failure_overrides_parity_screen` forces a failed/inconclusive report regardless of median quality.

---

## Verified repository baseline and file map

Repository `dkim31262-cmyk/helix-panel`; current public `main` is a small, static Node ESM site. Verified existing files: `README.md`, `helix-contract.mjs`, `render.mjs`, `test.mjs`, `build.mjs`, `vercel.json` and `.gitignore` (currently contains `dist/`). It currently has no root `package.json` and no `cap/` package.

**Create, self-contained CAP module only:**
- `cap/.gitignore` — ignore local `node_modules/`.
- `cap/package.json` and `cap/package-lock.json` — pinned isolated validator dependencies.
- `cap/schema/task.v1.json`, `cap/schema/capabilities.v1.json`, `cap/schema/route.v1.json`, `cap/schema/receipt.v1.json`, `cap/schema/checkpoint.v1.json`, `cap/schema/outcome.v1.json` — the six machine-readable `cap.*.v1` record contracts.
- `cap/schema/validate.mjs` — one validation entry point; frozen schema lookup, Ajv 2020 compilation, human-readable failure.
- `cap/policy/router.mjs` — pure Tool Instinct and Adaptive Effort policy.
- `cap/policy/verdict.mjs` — receipts, independent-review/TDD chronology, evidence-based outcome.
- `cap/policy/checkpoint.mjs` — pure checkpoint reducer/resume guard; *no storage driver*.
- `cap/eval/normalize.mjs` — deterministic preregistration and paired-run evidence intake.
- `cap/eval/score.mjs` — accepted outcome, critical-error and exploratory parity score, deterministic interval report.
- `cap/eval/fixtures/*.json` — tiny synthetic examples (pilot, missing tools, failed build, fake independent reviewer, stale resume, safety failure).
- `cap/tests/schema.test.mjs`, `router.test.mjs`, `verdict.test.mjs`, `checkpoint.test.mjs`, `normalize.test.mjs`, `score.test.mjs`, `docs.test.mjs`, `compat.test.mjs` — Node test suites.
- `docs/helix-cap/WORKLOOP.md` — portable operating protocol for humans and agentic runtimes.
- `cap/eval/README.md` — preregistration, Work handoff, paired study, baseline/ablation and scoring instructions.

**Modify no existing application files** in this implementation. New files stay out of `dist/`.

### Type and policy decisions shared by all tasks

- Every schema uses `$schema: "https://json-schema.org/draft/2020-12/schema"` and a unique `$id` containing `/cap/schema/<kind>.v1.json`; `schema_version` equals `cap.<kind>.v1`. IDs opaque synthetic strings of 1–128 chars; `created_at` and all observation times are real/parsible UTC `Z` date-times; `provenance` = `{kind:"synthetic"|"user_supplied"|"authenticated_tool", reference:string}`. Provenance labels do not themselves prove trust.
- `validateCapRecord(kind, record)` accepts only these kind values: `task`, `capabilities`, `route`, `receipt`, `checkpoint`, `outcome`. It returns the original record on success and throws `TypeError` with path/keyword on structural failure.
- `cap.task.v1` has `task_id`, `goal`, `task_class` (research/software/document/creative/multimodal/cross_app), `deliverables[]`, `acceptance_checks[]`, `constraints`, `evidence_level`, `risk_tier`, `consent_requirements[]`. `deliverables[]` are `{deliverable_id, description, format, required_operations[]}`; `acceptance_checks[]` are `{check_id, criterion, required, required_claim_types[]}`. `constraints` has `deadline` (nullable), `spending_cap` (nullable nonnegative number), `max_tools` (nullable positive integer), `target_platforms[]`, `privacy_class` (public/private/sensitive). The required arrays may be empty except at least one deliverable and one acceptance check per executable task.
- `cap.capabilities.v1` has `entries[]` of `{tool_id,service_name,operation,discovery_source,discovered_at,connected_state,permission_state,observed_availability,cost_information,limitations,context}`. `connected_state`=confirmed/unconfirmed/unavailable; `permission_state`=authorized/approval_required/denied/unknown; `observed_availability`=available/unavailable/unknown. `cost_information` may be null, never treated as a credit grant. Only entries with confirmed+authorized+available are eligible for a suggested operation.
- `cap.route.v1` required fields follow spec `3.3` plus four common metadata fields. `effort_band`=quick/managed/intensive. `chosen_steps[]` records planned operations, `tool_candidates[]` records eligible/blocked IDs with reasons, `fallback` is null or an explicit blocked/handoff option, `approval_gates[]` names required consents. `estimated_cost_range` is null if unknown (no fictitious price).
- `cap.receipt.v1` follows spec `3.4` and common metadata. `verifier_role`=self_review/independent_review/automated_test/observed_tool; `status` and `claim_type` use the exact enums in spec. Evidence references are `{uri,kind,observed_at}` (safe identifier/approved URL, not raw private payload). A `succeeded_observed` receipt without evidence anchors is invalid for verification purposes.
- `cap.checkpoint.v1` has spec `3.5` fields plus four common metadata fields; `state` uses the eight states defined in spec; `privacy_scope`=public_synthetic/private/sensitive; `branch_or_artifact_refs[]` are opaque references resolved by the host.
- `cap.outcome.v1` has spec `3.6` fields plus four common metadata fields; `delivery_state`=verified/partial/blocked. Mandatory `acceptance_verdicts[]` have check_id, passed, receipt_ids and rationale. `reviewer_status` is self_review/independent_review/not_reviewed.
- Each module remains pure and receives clock/data/observations as inputs rather than reading private tools or spawning processes; generated IDs/time come from caller-supplied deterministic fixture context. Strict verification has no fabricated default timestamps.
- Task-owned tests may use small JavaScript fixture builders inside `cap/tests`, but should not write private realistic data or confuse test-generated references with genuine external evidence.

---

### Task 1: Six CAP JSON Schemas and strict validation

**Files:**
- Create: `cap/package.json`, `cap/package-lock.json`, `cap/.gitignore`
- Create: `cap/schema/{task,capabilities,route,receipt,checkpoint,outcome}.v1.json`, `cap/schema/validate.mjs`
- Test: `cap/tests/schema.test.mjs`

**Interfaces:**
- Produces `validateCapRecord(kind: "task"|"capabilities"|"route"|"receipt"|"checkpoint"|"outcome", input: unknown): object`.
- Produces the field enums and common metadata described above; all later tasks consume validated records.
- Validator loads only six repository-owned schemas from disk; no remote `$ref` download, coercion, removal of fields or async side effects.

- [ ] **Step 1: Write failing `schema.test.mjs`** asserting `validateCapRecord("task", validTask).task_id === "task-1"`, six valid examples accepted, unexpected properties rejected, forged time such as `2026-99-99T00:00:00Z` rejected, wrong `schema_version` rejected, missing `provenance` rejected, enum mismatch rejected; unknown kind rejected. Test the six `$id`/`$schema` constants from actual files and that no record accepts a private-key field.
- [ ] **Step 2: Observe RED.** Run `node --test cap/tests/schema.test.mjs` before writing schemas/validator. Expected failure: module/file missing (record as setup RED, followed by a behavioral failing test if the test runner imports).
- [ ] **Step 3: Implement schemas/validator.** Create scoped `cap/package.json` with exact production dependencies `ajv: 8.17.1` and `ajv-formats: 3.0.1`, generate/commit its lockfile using `npm install --prefix cap --package-lock-only`, `npm ci --prefix cap`, and use `Ajv2020` + `ajv-formats` with `allErrors:true`, `strict:true`, `coerceTypes:false`, `removeAdditional:false`. Use `additionalProperties:false` at every object level, UTC date-time format + trailing-Z regex, and explicit required fields. Validator throws `TypeError` for missing/invalid documents.
- [ ] **Step 4: Observe GREEN and regression.** Run `node --test cap/tests/schema.test.mjs` then `node test.mjs`. Expected both exit 0, six schema passes plus negative tests, existing Helix untouched. Revert one mandatory-schema requirement locally and verify its regression test fails; restore requirement and rerun GREEN.
- [ ] **Step 5: Commit only Task 1 files.** `git add cap/.gitignore cap/package.json cap/package-lock.json cap/schema cap/tests/schema.test.mjs && git commit -m "feat(cap): define six strict versioned data contracts"`. Capture RED/GREEN output in the private development ledger.

### Task 2: Tool Instinct and Adaptive Effort Router

**Files:** Create `cap/policy/router.mjs`; Test `cap/tests/router.test.mjs`.

**Interfaces:**
- Consumes `validateCapRecord`, `cap.task.v1`, `cap.capabilities.v1` and immutable Helix references `{orchestration_graph, skill_graph, source:"helix-contract.mjs"}`.
- Produces `chooseRoute({task,capabilities,helixGraphs,nowIso,signals=[]}): cap.route.v1`, pure; `signals[]` are observations such as `{type:"test_failed"|"missing_evidence"|"contradiction"|"capability_missing",step_id}`.
- Does NOT call connectors, re-evaluate `sense()`, rename Helix graphs or promise Work availability; `fallback` identifies `needs_user_handoff_to_work` or `blocked` without impersonating Work.
- Policy: quick only for one low-risk informational deliverable with no required operation and one mandatory check; managed for multi-step/artifact/sourced tasks; intensive for high-risk, clinical_or_sensitive, cross_app, contradictions or repeated failures. `required_operations` must match tools with confirmed/authorized/available. `max_tools` and consent gates are enforced.

- [ ] **Step 1: Write failing `router.test.mjs`**: `quick_single_question_no_tools` expects quick and zero tools; `managed_research_selects_minimum_tool` chooses only one eligible matching operation; `intensive_high_risk_needs_approval`; `unconfirmed_permission_blocks_tool` for unconfirmed/denied/missing connector; `work_browser_without_capability_yields_handoff`; `unchanged_helix_graphs` deep-equals input references; `candidate_model_signal_does_not_override_route`; `test_failure_escalates_from_managed`; `max_tools_one_never_returns_two`.
- [ ] **Step 2: Observe RED.** Run `node --test cap/tests/router.test.mjs`. Expected `ERR_MODULE_NOT_FOUND` for router.
- [ ] **Step 3: Implement `chooseRoute`.** Derive ordered operations from deliverables, filter and deterministically rank eligible entries by operation match and tool_id lexical tie-break, prevent duplicate operations; compute effort from task and signals. If risk/action requires consent, set `approval_gates`; if no eligible tool or permission is unknown, return blocked/handoff recommendation without invoking anything. Construct output conforming to route schema.
- [ ] **Step 4: Observe GREEN/full-suite.** Run `node --test cap/tests/router.test.mjs` and `node --test cap/tests/*.test.mjs` (only existing test files at this stage), followed by `node test.mjs`. Expected exit 0 and no Helix-core source diffs.
- [ ] **Step 5: Commit.** `git add cap/policy/router.mjs cap/tests/router.test.mjs && git commit -m "feat(cap): choose minimum authorized tool and local effort"`.

### Task 3: Evidence-linked receipt and outcome verifier

**Files:** Create `cap/policy/verdict.mjs`; Test `cap/tests/verdict.test.mjs`.

**Interfaces:**
- Consumes schema-validated `task` and `receipt` records.
- Produces `verifyReceipt(receipt, {knownArtifacts, reviewerEvidence}): {usable:boolean,reasons:string[]}`.
- Produces `verifyTddChronology({redReceipt, firstImplementation, greenReceipt}): {verified:boolean,reason:string}` where `firstImplementation={commit_sha,committed_at,proof_ref,source_verified}` is an externally observed event (not merely a user-authored timestamp).
- Produces `evaluateOutcome({task,receipts,deliveredRefs,reviewerStatus,nowIso}): cap.outcome.v1`. Match required acceptance check `check_id` with receipt `step_id` and `required_claim_types`; all mandatory criteria must have matching usable evidence and extant references. `reviewerStatus` never upgrades self-review to independent.

- [ ] **Step 1: Write failing `verdict.test.mjs`**: `green_test_is_not_a_browser_test`; `build_ready_without_mobile_receipt_is_partial`; `no_evidence_refs_means_unverified`; `unknown_artifact_is_not_delivered`; `self_review_cannot_claim_independence`; `late_red_evidence_never_proves_tdd` (red timestamp AFTER commit => false); `missing_verified_commit_source_blocks_tdd`; `ordered_red_commit_green_with_external_proof_can_pass`; `failed_mandatory_check_returns_partial`; `all_required_evidence_and_refs_yields_verified`; `critical_external_side_effect_without_consent_is_blocked`.
- [ ] **Step 2: Observe RED.** Run `node --test cap/tests/verdict.test.mjs`; expected missing module/function.
- [ ] **Step 3: Implement verifier.** Maintain mapping of claim_type to the evidence kinds it actually proves. The three-event TDD test requires red failure evidence time before externally verified first implementation commit time, green afterwards; missing proof returns false. `evaluateOutcome` emits explicit acceptance_verdicts and reasons, never invents missing refs or timestamps, and fills the outcome metadata from caller-supplied reproducible context.
- [ ] **Step 4: Observe GREEN.** Run focused and full CAP tests and `node test.mjs`; expect exit 0. Intentionally remove a receipt anchor to observe a failing regression, then restore.
- [ ] **Step 5: Commit.** `git add cap/policy/verdict.mjs cap/tests/verdict.test.mjs && git commit -m "feat(cap): require observed evidence for verified outcomes"`.

### Task 4: Minimal checkpoint continuity and safe resumption

**Files:** Create `cap/policy/checkpoint.mjs`; Test `cap/tests/checkpoint.test.mjs`.

**Interfaces:**
- Consumes validated `cap.checkpoint.v1` plus host-supplied events; DOES NOT read or write GitHub, chat memory or private storage.
- Produces `advanceCheckpoint(previous, {event,receiptIds,blockedItems,nextAction,at}): cap.checkpoint.v1`; returns a new immutable version with `provenance` and links to previous checkpoint ID.
- Produces `checkResume(checkpoint, {resolvedRefs,permissionsFresh,sourceFresh,nowIso}): {canResume:boolean,staleRefs:string[],reason:string}`; `resolvedRefs` is host-observed mapping, not fabricated URL status.
- Allowed progressions: framed→routed→in_progress→verifying→done_verified/done_partial; any unfinished state→blocked/awaiting_approval; blocked/awaiting_approval→routed only after host-confirmed permission/condition. Explicit stop cannot be ignored.

- [ ] **Step 1: Write failing `checkpoint.test.mjs`**: valid progression, forbidden skip from framed→done_verified, checkpoint is immutable, accumulated receipts preserved, failure attempts remain traceable through previous ID, `stale_reference_blocks_resume`, missing or denied permission blocks resume, unchanged refs allow resume, sensitive scope never rewritten to public_synthetic, privacy-safe synthetic checkpoint contains no private payload.
- [ ] **Step 2: Observe RED.** Run `node --test cap/tests/checkpoint.test.mjs`; expected missing reducer.
- [ ] **Step 3: Implement pure `advanceCheckpoint` and `checkResume`.** Validate timestamps, state transitions, immutable IDs and reference provenance. Never resolve a remote URL or claim persistent cross-chat memory. Reject attempts to downgrade privacy.
- [ ] **Step 4: Observe GREEN.** Run focused CAP tests and `node test.mjs`; expect exit 0.
- [ ] **Step 5: Commit.** `git add cap/policy/checkpoint.mjs cap/tests/checkpoint.test.mjs && git commit -m "feat(cap): checkpoint immutable progress and refuse stale resumes"`.

### Task 5: Work comparison record intake and preregistration gate

**Files:** Create `cap/eval/normalize.mjs`, `cap/eval/fixtures/pilot-minimal.json`, `cap/eval/fixtures/missing-work.json`; Test `cap/tests/normalize.test.mjs`.

**Interfaces:**
- Produces `normalizeStudy({registration,runs,ratings}): {study_type,matched_pairs,missing_pairs,conditions,issues,metadata}`, pure.
- `registration` fixes `study_id`, `protocol` (pilot/confirmatory), task IDs/classes, criteria, anonymization seed, budget policy, tool-access condition, evaluator IDs, preregistered_at. `runs[]` have task_id, condition (chat_plain/chat_cap/work or documented ablation), run_id, started_at, finished_at, observable_deliverable_refs, mandatory_checks, critical_failures, interventions, tool_calls, cost_observed_or_null and visibility flags; `ratings[]` have reviewer_id, blinded_output_id, score 0..5 and evaluation time.
- Paired main analysis matches exactly chat_cap vs work per task; baseline/ablation strata retained but not substituted for missing Work results. Work evidence can be imported only from an authorized observable artifact, NOT invented tool calls or hidden chain-of-thought.
- Pilot has 12 task IDs (2 per six classes) and confirmatory has 48 (8 per class). Registration/rubric must precede the first run.

- [ ] **Step 1: Write failing `normalize.test.mjs`**: `valid_pilot_12_tasks_2_each`, `confirmatory_48_eight_each`, `missing_work_run_is_incomplete` (not zero score and not denominator padding), `duplicate_or_faked_work_id_rejected`, `rubric_created_after_outputs_rejected`, `missing_two_blinded_reviewers_rejected`, `entitlement_mismatch_cannot_be_called_matched`, `synthetic_tool_output_cannot_pose_as_work`, `baseline_and_ablation_remain_separate`, `critical_failure_is_preserved`.
- [ ] **Step 2: Observe RED.** Run `node --test cap/tests/normalize.test.mjs`; expected missing normalizer.
- [ ] **Step 3: Implement normalizer.** Reject inconsistent preregistration, rerun ID reuse, identical evaluator identities, non-0..5 scores and sources without deliverable evidence. Annotate missing results rather than imputing. Distinguish controlled-quality vs naturalistic-product protocols in output; access asymmetry is required metadata.
- [ ] **Step 4: Observe GREEN.** Run focused and all existing CAP tests; expect exit 0. Test fixtures only use made-up task IDs and synthetic sources.
- [ ] **Step 5: Commit.** `git add cap/eval/normalize.mjs cap/eval/fixtures/pilot-minimal.json cap/eval/fixtures/missing-work.json cap/tests/normalize.test.mjs && git commit -m "feat(cap): enforce preregistered observed Work comparison inputs"`.

### Task 6: Outcome Parity scoring and uncertainty

**Files:** Create `cap/eval/score.mjs`, `cap/eval/fixtures/safety-failure.json`; Test `cap/tests/score.test.mjs`.

**Interfaces:**
- Consumes `normalizeStudy` result and independently observed acceptance/quality metadata.
- Produces `scoreStudy(normalized, {bootstrapSamples=2000, seed=20261016}): {by_class,overall,missingness,limits,study_verdict}`.
- Use deterministic seeded paired-resample bootstrap with 2,000 iterations for illustrative 95% uncertainty intervals, always report paired denominators and missingness. Compute accepted-outcome rate ONLY from mandatory acceptance checks with evidence, not a self-declared boolean. `critical_failures` are automatic task failures.
- Per-class practical-parity screen can be `screen_pass`, `screen_fail` or `inconclusive`, only if complete and no critical failures; CAP blinded median difference vs Work ≥ -0.5/5 and accepted-outcome difference ≥ -0.10. With 8/class never label statistical equivalence: always call `screen_pass` exploratory, not universal parity.

- [ ] **Step 1: Write failing `score.test.mjs`**: identical observations produce identical bootstrap intervals with fixed seed; score scale 0–5; accepted rate uses mandatory evidential checks; `critical_failure_overrides_parity_screen`; incomplete Work results => inconclusive (never synthetic zero); accepted difference worse than 10 points => screen_fail; quality difference worse than 0.5 => screen_fail; complete small-class sample cannot claim formally proven equivalent; intervals and denominator surfaced; user intervention, observed cost, elapsed time, tool overhead and false completion reported separately; missing cost is null, not free.
- [ ] **Step 2: Observe RED.** Run `node --test cap/tests/score.test.mjs`; expect missing scorer.
- [ ] **Step 3: Implement `scoreStudy`.** Deterministic arithmetic only; stable seeded bootstrap (no global random calls), per-class/overall aggregation, reject NaN/negative cost or invalid intervals. Distinguish an exploratory passing screen from a statistically powered equivalence claim, which is OUT OF SCOPE.
- [ ] **Step 4: Observe GREEN.** Run focused and all CAP tests; expect exit 0. Rerun fixed-seed score twice and assert deep equality.
- [ ] **Step 5: Commit.** `git add cap/eval/score.mjs cap/eval/fixtures/safety-failure.json cap/tests/score.test.mjs && git commit -m "feat(cap): score evidence-linked outcomes without inflated parity claims"`.

### Task 7: Portable WORKLOOP manual, evaluation methodology and privacy fixtures

**Files:** Create `docs/helix-cap/WORKLOOP.md`, `cap/eval/README.md`, `cap/eval/fixtures/blocked-permission.json`, `cap/eval/fixtures/stale-checkpoint.json`, `cap/eval/fixtures/tdd-chronology.json`; Test `cap/tests/docs.test.mjs`.

**Interfaces:**
- Human-operable seven-stage `Frame → Discover → Route → Act → Verify → Fold → Checkpoint/Stop` checklist; one run has an explicit acceptance contract, local tool snapshot, routing recommendation, observed receipts, checkpoint and final one-envelope answer.
- Experimental manual states paired task bank 12 pilot / 48 confirmatory, two blinded human raters, study eligibility, controlled vs naturalistic comparisons, pre-register before evaluation, evidence exports (optional and authorized), costs/failures/uncertainty, baseline Chat and ablations, and what a non-runnable Work condition means.
- No runnable model invoker or copied Work internal traces. No instructions demanding private chain-of-thought; reasoning summaries should be succinct, checkable process explanations.

- [ ] **Step 1: Write failing `docs.test.mjs`**: ensure both documents exist; cover all seven stages, each schema kind, `quick`/`managed`/`intensive`, consent boundaries, truthful test/build/browser claims, TDD proof chronology, public/private separation, “no background operation”, two study modes, blinded Work outcomes, 12/48 sample rules, uncertainty and forbidden universal parity claims. Parse synthetic fixture files and reject strings shaped like credentials/private identifying data or untrusted prompt directives treated as policy.
- [ ] **Step 2: Observe RED.** Run `node --test cap/tests/docs.test.mjs`; expected missing docs/fixtures.
- [ ] **Step 3: Write only docs and synthetic fixtures.** Keep WORKLOOP.md focused on runnable guidance and handoff. The eval README specifies exact `normalizeStudy` and `scoreStudy` data contracts from Tasks 5–6, scoring version and non-inference rules. Do not paste user project history or private files.
- [ ] **Step 4: Observe GREEN.** Run docs tests and all CAP tests; expect exit 0.
- [ ] **Step 5: Commit.** `git add docs/helix-cap/WORKLOOP.md cap/eval/README.md cap/eval/fixtures cap/tests/docs.test.mjs && git commit -m "docs(cap): ship portable verified workloop and fair Work evaluation protocol"`.

### Task 8: Compatibility gate, evidence ledger and final review handoff

**Files:** Create `cap/tests/compat.test.mjs`; write a *new* review evidence document `docs/superpowers/reviews/2026-10-16-helix-cap-workloop-v1-evidence.md` only after real verification. No existing application code edits.

**Interfaces:**
- Tests `helix-contract.mjs` exports `forgeBridge()`, `sense()` and original schema, confirms baseline Helix legacy behavior and that CAP is not imported into root `render.mjs`, `build.mjs` or `test.mjs`.
- CI/host integration is NOT created in this slice. The CAP suite runs separately; the original site uses its exact prior build gate.
- An evidence packet consists of precise command, exit code, observed test count, feature branch SHA, changed paths, artifact refs, limitations, reviewer identity/evidence and honest browser/Work status.

- [ ] **Step 1: Write failing `compat.test.mjs`**: asserts CAP suite can run in isolation, original Helix `helix.bridge.v1`/`helix.result.v1`/graph handling still valid; no `cap/` imports in root build, contract, renderer or Evolution; all new files are contained under `cap/`, `docs/helix-cap/` or explicitly approved docs; no private fixtures. Make the test catch an intentional fake core edit in a throwaway copy, without changing the real tracked contract.
- [ ] **Step 2: Observe RED.** Run focused compat tests before implementing its validation helper/integrity guard. If a compatibility test is already green against baseline, record that as baseline regression protection rather than claiming a TDD red; explicitly introduce a failing CAP isolation assertion before making it green.
- [ ] **Step 3: Implement only test fixture/guard logic needed.** No production integration. Document the branch-specific diff check: `git diff main...HEAD -- helix-contract.mjs render.mjs index.html mandate.txt mandate.th.txt helix.schema.json evolution.js evolution.html test.mjs build.mjs vercel.json` must print nothing. `git diff --name-only main...HEAD` must show only the approved CAP/documentation files.
- [ ] **Step 4: Verify thoroughly.** Run `npm ci --prefix cap`, `node --test cap/tests/*.test.mjs`, `node test.mjs` and `node build.mjs` (local/test environment; do NOT run `vercel deploy`); inspect full exit codes and failures. If checking a preview created automatically by Vercel, report it as preview only, not production or functional mobile browser QC. Browser interaction testing is not required for this no-UI slice. Never mark live Work parity tested without actual paired Work evidence.
- [ ] **Step 5: Record review packet and commit.** Create the evidence document with observed logs, reviewer status, known issues, unresolved real Work evaluation, and exact commit SHA. `git add cap/tests/compat.test.mjs docs/superpowers/reviews/2026-10-16-helix-cap-workloop-v1-evidence.md && git commit -m "test(cap): document contract preservation and evaluation limits"`. Invite independent task/code review if such a reviewer is *actually* available; do not fake one.
- [ ] **Step 6: Handoff; stop.** Provide the feature-branch artifacts and a draft PR only if separately requested or authorized by the existing workflow. No merge, no production deployment, no running provider APIs, no automatic Work benchmarking, no schedulers and no private data publication.

## Spec-to-Task mapping

- Outcome Parity, actual Work-vs-CAP evaluation, blind two-rater evidence, pilot 12/confirmatory 48, baseline/ablation, critical failures and uncertainty: Tasks 5–7.
- Tool Instinct, discovery truth, connected+permission+availability and minimal tools: Task 2; structural validation Task 1.
- Adaptive Effort Routing and no override of Helix graph authority: Task 2; integrity Task 8.
- Evidence-Linked Verification, receipt semantics, TDD chronology and truthful done state: Task 3; schema Task 1.
- Checkpoint Continuity, immutable transition history, stale ref and privacy gates: Task 4; schema Task 1.
- One envelope and original face; no duplicate Helix contract: Tasks 2–4 and 8.
- Unsupported/unsafe tool use, consent, secret minimization, injection resistance: Tasks 1–4 and 7–8.
- Operator documentation and versioned standalone CAP package: Tasks 1 and 7.
- No new service, OAuth, web UI, agent runtime, browser or deployment: global constraints + Task 8.
- Any future account-connected execution, browser interactions, scheduled delivery or multimodal media creation requires its own independently approved spec.

## Pre-implementation review and execution gate

This file is a **written plan**, not implemented CAP, not proof of Work parity, and not permission to deploy. Moon approved the design spec, but must now review this specific plan and select how it will be executed before feature-code work.

Recommended method: **subagent-driven development** with fresh implementer + independent task reviewer per task, followed by whole-branch review (many trust and evidence boundary cases). If fresh subagents are unavailable in the runtime, the operator must state that and choose an explicitly authorized native execution/review method instead of pretending independent review happened.

After approval, create feature branch from this plan branch, execute the eight tasks in order with recorded RED/GREEN evidence, then stop at branch-level review. Never merge `main` or deploy Production automatically.
