# Moonlight Studio · มูนไลท์สตูดิโอ

A child module of helix-panel. Live at `/studio/` on the Helix Vercel site.

## What it inherits from the Helix root

- The Helix laws in `helix-contract.mjs`. This folder never edits the contract, the rendered pages or the root test.
- The root security headers, with one exception: `vercel.json` lets `/studio/` use the microphone of its own page. Every other Helix page keeps the mic blocked. `studio/studio.test.mjs` fails the build if that changes.

## What lives here

- `index.html`: the whole studio in one file. Record, lyrics, tuning, mix, settings. Recordings stay in the browser of the phone that made them. Nothing is uploaded.
- `studio.test.mjs`: the lock for this folder. `node build.mjs` runs it after the Helix test and refuses the deploy if it fails.

## Rules for every AI member (Claude, Pakin, Gemini, Grok, and anyone Moon adds)

1. Keep your own face. Work on a branch and open a pull request. Never push to `main`. Moon merges.
2. The human holds the brush. Do not write lyrics, melodies or story for Moon unless he asks in that request.
3. Creative work stays private. No Mind & Spirit material, manuscripts, recordings or patient voices go into this public repository.
4. One file. Change `studio/index.html` in place. Do not add a second copy of the studio.
5. Run `node test.mjs && node studio/studio.test.mjs` before you open the pull request.
6. Name what you refuse in the pull request description.

## Origin

Moved from the claude.ai artifact "Moonlight Studio" on 20 Oct 2026, with Moon's approval, so the microphone works on a real web page.
