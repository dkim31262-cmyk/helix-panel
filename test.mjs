import { readFileSync } from "node:fs";
import { forgeBridge, mandateEn, mandateTh, schema, sense } from "./helix-contract.mjs";

const root = new URL(".", import.meta.url);
const read = (name) => readFileSync(new URL(name, root), "utf8");

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    failed += 1;
    console.error("FAIL", msg);
  }
}

const mandate = read("mandate.txt");
const html = read("index.html");
const open = '<pre id="mandate">';
const at = html.indexOf(open);
const pre = html.slice(at + open.length, html.indexOf("</pre>", at));
assert(pre === mandate, "index.html mandate block is not mandate.txt");
assert(mandate === mandateEn, "mandate.txt is not rendered from helix-contract.mjs");
assert(read("mandate.th.txt") === mandateTh, "mandate.th.txt is not rendered from helix-contract.mjs");
assert(JSON.stringify(JSON.parse(read("helix.schema.json"))) === JSON.stringify(schema), "helix.schema.json drifted");

const path = sense("Create a bridge and find a path.");
assert(path.huddle === true && path.orchestration_graph === "chain", "Create a bridge and find a path. must huddle on chain");

const fever = sense("A student is stuck on why a fever is not always infection. Return notes the teacher can speak.");
assert(fever.huddle === false && fever.orchestration_graph === "quiet", "a small brief must stay quiet");

const bridge = forgeBridge({
  job: "Create a bridge and find a path.",
  skill: "adventure",
  name: "Pakin",
  face: "Pakin the tutor",
  ingress: "pakin.ask",
  refuse: "will not rename the room",
  seam: "learner still meets Pakin",
  melody: "one sentence the learner can carry",
});
assert(bridge.type === "helix.bridge.v1", "seal must be helix.bridge.v1");
assert(bridge.runtime === "Pakin", "runtime must be the typed name, not the preset");
assert(bridge.orchestration_graph === "chain", "huddle must force orchestration_graph chain");
assert(bridge.skill_graph === "fanout", "adventure keeps its own skill_graph");
assert(bridge.melody === "one sentence the learner can carry", "melody must be on the bridge");
assert(!("graph" in bridge), "one graph field is the collision");

if (failed) {
  console.error(failed + " failed");
  process.exit(1);
}
console.log("locked: one contract, page matches file, instinct matches the sentence");
