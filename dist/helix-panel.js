import { ORIGIN, SKILLS, UI, dutyFor, forgeBridge, missingFields, sense, mandateEn } from "./helix-contract.mjs";
const state = { skill: "adventure" };
let sealed = "";
const $ = (id) => document.getElementById(id);
function fields() {
  return { name: $("name").value, face: $("face").value, ingress: $("ingress").value, refuse: $("refuse").value, seam: $("seam").value, melody: $("melody").value };
}
function clearSeal() {
  sealed = "";
  $("sealed").hidden = true;
  $("sealed").textContent = "";
  $("sealed-label").hidden = true;
  $("copy-bridge").hidden = true;
}
function setLang(mode) {
  document.documentElement.className = mode;
  document.documentElement.lang = mode === "lang-th" ? "th" : "en";
}
function pair(id, en, th) {
  const node = $(id);
  const [a, b] = node.querySelectorAll("span");
  a.textContent = en;
  b.textContent = th;
}
function paint() {
  const felt = sense($("job").value);
  pair("instinct", felt.huddle ? UI.huddles.en : UI.quiet.en, felt.huddle ? UI.huddles.th : UI.quiet.th);
  $("instinct").className = felt.huddle ? "verdict on" : "verdict";
  $("orch").textContent = felt.orchestration_graph;
  const skill = SKILLS[state.skill];
  $("skill-graph").textContent = skill.graph;
  const duty = dutyFor($("name").value);
  pair("duty", duty.en, duty.th);
  const gaps = missingFields(fields());
  pair(
    "gaps",
    gaps.length ? UI.stillOpen.en + ": " + gaps.join(", ") : UI.seamHolds.en,
    gaps.length ? UI.stillOpen.th + ": " + gaps.join(", ") : UI.seamHolds.th,
  );
  const box = $("gaps");
  box.className = gaps.length ? "danger" : "muted";
  $("seal").disabled = gaps.length > 0;
  document.querySelectorAll("[data-run]").forEach((el) => { el.className = "chip " + (el.dataset.run === $("name").value.trim().toLowerCase() ? "on" : "off"); });
  document.querySelectorAll("[data-skill]").forEach((el) => { el.className = "card" + (el.dataset.skill === state.skill ? " on" : ""); });
}
document.body.addEventListener("click", (event) => {
  const run = event.target.closest("[data-run]");
  const skill = event.target.closest("[data-skill]");
  if (run) { $("name").value = run.dataset.run; $("ingress").value = run.dataset.run + ".ask"; clearSeal(); }
  if (skill) { state.skill = skill.dataset.skill; $("seam").value = SKILLS[state.skill].seam; clearSeal(); }
  if (!event.target.closest("#seal")) paint();
});
document.body.addEventListener("input", (event) => {
  if (event.target.closest("#sealed")) return;
  clearSeal();
  paint();
});
$("copy-mandate").onclick = () => navigator.clipboard.writeText(mandateEn);
$("copy-link").onclick = () => navigator.clipboard.writeText(ORIGIN + "/");
$("seal").onclick = () => {
  if (missingFields(fields()).length) return;
  const bridge = forgeBridge({ job: $("job").value, skill: state.skill, ...fields() });
  sealed = JSON.stringify(bridge, null, 2);
  $("sealed").hidden = false;
  $("sealed").textContent = sealed;
  $("sealed-label").hidden = false;
  const copy = $("copy-bridge");
  copy.hidden = false;
  copy.onclick = () => navigator.clipboard.writeText(sealed);
};
$("lang-both").onclick = () => setLang("");
$("lang-en").onclick = () => setLang("lang-en");
$("lang-th").onclick = () => setLang("lang-th");
paint();
