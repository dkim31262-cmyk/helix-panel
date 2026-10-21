// Moonlight Studio child-module lock. Runs from the repo root: node studio/studio.test.mjs
// It inherits the Helix root and must never weaken it: the root keeps the mic blocked, only /studio opens it.
import { readFileSync, statSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (name) => readFileSync(new URL(name, root), "utf8");

let failed = 0;
const assert = (cond, msg) => { if (!cond) { failed += 1; console.error("FAIL studio:", msg); } };

const html = read("studio/index.html");
assert(html.startsWith("<!doctype html>"), "page must start with a doctype");
assert(html.includes("<title>Moonlight Studio</title>"), "title must stay Moonlight Studio");
assert(html.includes("getUserMedia"), "the live mic path is gone");
assert(html.includes('id="fileImport"'), "the record-with-phone-app fallback is gone");
assert(!/<script[^>]+src=/i.test(html), "no external scripts: the studio CSP only trusts itself");
assert(!/https?:\/\/(?!fonts\.googleapis\.com|fonts\.gstatic\.com)[a-z0-9.-]+\//i.test(html.replace(/xmlns="[^"]*"/g, "")), "only Google Fonts may be loaded from outside");
assert(statSync(new URL("studio/index.html", root)).size < 2_000_000, "page grew past 2 MB");

const v = JSON.parse(read("vercel.json"));
const rule = (src) => v.headers.find((h) => h.source === src);
const header = (r, key) => r && (r.headers.find((h) => h.key === key) || {}).value;
const global = v.headers[0];
assert(global && /studio/.test(global.source), "the Helix-wide rule must skip /studio, not be deleted");
assert(/microphone=\(\)/.test(header(global, "Permissions-Policy") || ""), "the Helix root must keep the mic blocked");
const studio = rule("/studio(/.*)?");
assert(studio, "/studio header rule missing");

// Vercel compiles each `source` with path-to-regexp in strict mode, so a trailing slash is not optional.
// "/studio/:path*" looked right but never matched "/studio/", and that page went out with no headers.
// These regexes are the strict-mode compilations of the two sources; every studio address must land in
// exactly one rule, and every other address in the Helix rule.
const helixRe = /^(?:\/((?!studio(?:\/|$)).*))$/;
const studioRe = /^\/studio(\/.*)?$/;
assert(global.source === "/((?!studio(?:/|$)).*)", "Helix rule source changed; update the regex above with it");
for (const p of ["/studio", "/studio/", "/studio/index.html"]) {
  assert(studioRe.test(p) && !helixRe.test(p), p + " must get the studio headers and only those");
}
for (const p of ["/", "/index.html", "/evolution.html", "/mandate.txt", "/studios"]) {
  assert(helixRe.test(p) && !studioRe.test(p), p + " must keep the Helix headers");
}
assert(/microphone=\(self\)/.test(header(studio, "Permissions-Policy") || ""), "/studio must allow the mic for itself only");
assert(/camera=\(\)/.test(header(studio, "Permissions-Policy") || ""), "/studio must keep the camera blocked");
const csp = header(studio, "Content-Security-Policy") || "";
assert(/frame-ancestors 'none'/.test(csp), "/studio must refuse to be framed");
assert(/script-src[^;]*blob:/.test(csp), "the audio worklet loads from a blob URL");

if (failed) { console.error(failed + " studio checks failed"); process.exit(1); }
console.log("studio locked: mic only under /studio, Helix root unchanged");
