import { readFileSync } from "node:fs";
import { LAWS, ORIGIN, SKILLS, UI, forgeBridge, mandateEn, mandateTh, schema, sense } from "./helix-contract.mjs";
import { renderIndex, renderedFiles } from "./render.mjs";

const root = new URL(".", import.meta.url);
const read = (name) => readFileSync(new URL(name, root), "utf8");

let failed = 0;
function assert(cond, msg) {
  if (!cond) {
    failed += 1;
    console.error("FAIL", msg);
  }
}

const files = renderedFiles();
for (const [name, body] of Object.entries(files)) {
  assert(read(name) === body, name + " was edited by hand. Run node render.mjs. Do not keep a second copy.");
}

const html = read("index.html");
function block(id) {
  const at = html.indexOf(`id="${id}"`);
  const start = html.indexOf(">", at) + 1;
  return html.slice(start, html.indexOf("</pre>", start));
}
assert(block("mandate") === mandateEn, "embedded mandate is not the contract");
assert(block("mandate-th") === mandateTh, "embedded Thai mandate is not the contract");
assert(html.includes(`<link rel="canonical" href="${ORIGIN}/" />`), "canonical missing");
assert(html.includes(`<meta property="og:image" content="${ORIGIN}/og.jpg" />`), "og:image missing");
assert(html.includes('href="favicon.svg"'), "favicon missing");
for (const law of LAWS) assert(html.includes(law.en) && html.includes(law.th), "law missing from the page: " + law.en);
for (const skill of Object.values(SKILLS)) assert(html.includes(skill.en) && html.includes(skill.th), "skill missing: " + skill.id);
for (const key of ["forgeTitle", "seal", "runtimeName", "melody", "refuse"]) {
  assert(html.includes(UI[key].en) && html.includes(UI[key].th), "UI string not bilingual: " + key);
}
assert(JSON.stringify(JSON.parse(read("helix.schema.json"))) === JSON.stringify(schema), "schema parse drifted");

const og = readFileSync(new URL("og.jpg", root));
assert(og[0] === 0xff && og[1] === 0xd8 && og.length > 1000, "og.jpg is not the share image");

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
assert(renderIndex() === html, "renderIndex is not the page on disk");

if (failed) {
  console.error(failed + " failed");
  process.exit(1);
}
console.log("locked: one contract, generated page, Thai and English, share tags, instinct");
