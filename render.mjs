import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import {
  INSTINCT_FORCE,
  INSTINCT_FORCE_TH,
  INSTINCT_HUDDLE,
  INSTINCT_HUDDLE_TH,
  INSTINCT_QUIET,
  INSTINCT_QUIET_TH,
  LAWS,
  ORIGIN,
  PRESETS,
  SKILLS,
  UI,
  mandateEn,
  mandateTh,
  schema,
} from "./helix-contract.mjs";

const pair = (en, th) => `<span lang="en">${en}</span><span lang="th">${th}</span>`;

function lawsHtml() {
  return LAWS.map((law, i) => {
    const n = String(i + 1).padStart(2, "0");
    return `<article class="law"><p class="kicker">${n}</p><p lang="en">${law.en}</p><p class="muted" lang="th">${law.th}</p></article>`;
  }).join("\n");
}

function skillsHtml() {
  return Object.values(SKILLS)
    .map((s, i) => {
      const on = i === 0 ? " on" : "";
      return `<button type="button" class="card${on}" data-skill="${s.id}"><span class="kicker">${s.graph}</span><span class="name">${s.name}</span><span class="muted" lang="en">${s.en}</span><span class="muted" lang="th">${s.th}</span></button>`;
    })
    .join("\n");
}

function chipsHtml() {
  return PRESETS.map(
    (p, i) =>
      `<button type="button" class="chip ${i === 0 ? "on" : "off"}" data-run="${p.id}">${p.label}</button>`,
  ).join("\n");
}

export function renderIndex() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="theme-color" content="#243038" />
<title>Helix</title>
<meta name="description" content="${UI.description.en}" />
<meta name="robots" content="index,follow" />
<link rel="canonical" href="${ORIGIN}/" />
<link rel="icon" href="favicon.svg" type="image/svg+xml" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Helix" />
<meta property="og:title" content="Helix — forge your own bridge" />
<meta property="og:description" content="${UI.description.en}" />
<meta property="og:url" content="${ORIGIN}/" />
<meta property="og:image" content="${ORIGIN}/og.jpg" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Helix — forge your own bridge" />
<meta name="twitter:description" content="${UI.description.en}" />
<meta name="twitter:image" content="${ORIGIN}/og.jpg" />
<style>
  :root {
    --bg: #efeae2;
    --ink: #1a1714;
    --muted: #5c564e;
    --line: #d4cbbf;
    --paper: #f7f3ec;
    --accent: #243038;
    --accent-fg: #f6f1ea;
    --copper: #9a4318;
    --danger: #8a2e24;
    --ok: #1e4a38;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; background: var(--bg); color: var(--ink); }
  body { font-family: "Segoe UI", "Noto Sans Thai", "Leelawadee UI", sans-serif; line-height: 1.5; }
  h1, h2, .name, .word { font-family: Georgia, "Iowan Old Style", "Noto Serif Thai", serif; font-weight: 550; }
  main { max-width: 880px; margin: 0 auto; padding: 20px 16px 72px; }
  .top { display: flex; align-items: center; gap: 12px; }
  .mark { width: 44px; height: 44px; flex: none; }
  .word { margin: 0; font-size: 22px; letter-spacing: -0.02em; }
  .langs { margin-left: auto; display: flex; gap: 6px; }
  .kicker { display: block; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); }
  h1 { font-size: 34px; line-height: 1.12; margin: 22px 0 8px; letter-spacing: -0.03em; }
  .th { color: var(--muted); font-family: Georgia, "Noto Serif Thai", serif; font-size: 22px; margin: 0 0 10px; }
  .muted { color: var(--muted); }
  button, .chip, a.btn { font: inherit; cursor: pointer; border: 0; border-radius: 999px; min-height: 44px; padding: 0 16px; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; }
  .primary { background: var(--accent); color: var(--accent-fg); }
  .ghost { background: var(--paper); color: var(--ink); box-shadow: 0 0 0 1px var(--line); }
  .langs button { min-height: 36px; padding: 0 12px; font-size: 13px; }
  .row { display: flex; flex-wrap: wrap; gap: 8px; margin: 14px 0; }
  .door { background: var(--accent); color: var(--accent-fg); border-radius: 22px; padding: 18px 16px 16px; margin-top: 18px; }
  .door .kicker, .door .fine { color: #d9d3c8; }
  .url { margin: 8px 0; font-family: ui-monospace, "SFMono-Regular", monospace; font-size: 15px; line-height: 1.35; overflow-wrap: anywhere; color: var(--accent-fg); }
  .door .primary { background: var(--accent-fg); color: var(--accent); margin-top: 8px; }
  .chip.on, .card.on { background: var(--accent); color: var(--accent-fg); }
  .chip.off { background: var(--paper); color: var(--muted); box-shadow: 0 0 0 1px var(--line); }
  .card, .law, pre, .readout, .verdict, .forge { background: var(--paper); border-radius: 18px; box-shadow: 0 0 0 1px var(--line); padding: 16px; }
  .card { text-align: left; width: 100%; display: block; }
  .card .name { display: block; font-size: 26px; margin: 2px 0 6px; }
  .card.on .muted, .card.on .kicker, .chip.on { color: var(--accent-fg); }
  .verdict { margin: 12px 0; }
  .verdict.on { box-shadow: inset 3px 0 0 var(--copper), 0 0 0 1px var(--line); }
  .grid { display: grid; gap: 10px; }
  @media (min-width: 720px) {
    h1 { font-size: 48px; }
    .grid.two { grid-template-columns: 1fr 1fr; }
    .grid.three { grid-template-columns: 1fr 1fr 1fr; }
  }
  label { display: block; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-top: 14px; }
  input, textarea { width: 100%; margin-top: 6px; border: 0; border-radius: 12px; background: var(--bg); box-shadow: 0 0 0 1px var(--line); color: var(--ink); font: inherit; padding: 12px; }
  textarea { min-height: 88px; resize: vertical; }
  .danger { color: var(--danger); }
  #gaps.muted { color: var(--ok); }
  pre { white-space: pre-wrap; font-family: ui-monospace, "SFMono-Regular", monospace; font-size: 13px; overflow-wrap: anywhere; }
  .seal { width: 100%; margin-top: 8px; }
  section { margin-top: 28px; }
  a { color: inherit; }
  .door a { color: var(--accent-fg); }
  :focus-visible { outline: 2px solid var(--copper); outline-offset: 3px; }
  html.lang-en [lang="th"] { display: none; }
  html.lang-th [lang="en"] { display: none; }
  .kicker span[lang="th"]::before, button span[lang="th"]::before { content: " · "; }
  html.lang-en span[lang="th"]::before, html.lang-th span[lang="th"]::before { content: none; }
</style>
</head>
<body>
<main>
  <header class="top">
    <svg class="mark" viewBox="0 0 48 48" aria-hidden="true">
      <rect width="48" height="48" rx="14" fill="#243038"/>
      <path d="M16 10c8 5 8 8 0 14s-8 9 0 14" fill="none" stroke="#f6f1ea" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M32 10c-8 5-8 8 0 14s8 9 0 14" fill="none" stroke="#e07a3d" stroke-width="2.4" stroke-linecap="round"/>
    </svg>
    <div>
      <p class="word">Helix</p>
      <p class="kicker">${pair(UI.kicker.en, UI.kicker.th)}</p>
    </div>
    <div class="langs">
      <button type="button" class="ghost" id="lang-both">TH + EN</button>
      <button type="button" class="ghost" id="lang-en">EN</button>
      <button type="button" class="ghost" id="lang-th">TH</button>
    </div>
  </header>
  <section class="door" id="door">
    <p class="kicker">${pair(UI.door.en, UI.door.th)}</p>
    <p class="url">${ORIGIN}/</p>
    <button class="primary" id="copy-link" type="button">${pair(UI.copyLink.en, UI.copyLink.th)}</button>
  </section>
  <h1 lang="en">${UI.headline.en}</h1>
  <p class="th" lang="th">${UI.headline.th}</p>
  <p class="muted" lang="en">${UI.lede.en}</p>
  <p class="muted" lang="th">${UI.lede.th}</p>
  <div class="row">
    <button class="primary" id="copy-mandate" type="button">${pair(UI.copyMandate.en, UI.copyMandate.th)}</button>
    <a class="btn ghost" href="mandate.txt">/mandate.txt</a>
    <a class="btn ghost" href="mandate.th.txt">/mandate.th.txt</a>
    <a class="btn ghost" href="helix.schema.json">schema</a>
  </div>
  <section>
    <p class="kicker">${pair(UI.instinct.en, UI.instinct.th)}</p>
    <p lang="en">${INSTINCT_HUDDLE} ${INSTINCT_QUIET} ${INSTINCT_FORCE}</p>
    <p lang="th">${INSTINCT_HUDDLE_TH} ${INSTINCT_QUIET_TH} ${INSTINCT_FORCE_TH}</p>
    <p id="instinct" class="verdict">${pair(UI.quiet.en, UI.quiet.th)}</p>
    <label for="job">${pair(UI.job.en, UI.job.th)}</label>
    <textarea id="job">A student is stuck on why a fever is not always infection. Return notes the teacher can speak.</textarea>
  </section>
  <section class="forge" id="forge">
    <p class="kicker">${pair(UI.forge.en, UI.forge.th)}</p>
    <h2 class="name">${pair(UI.forgeTitle.en, UI.forgeTitle.th)}</h2>
    <p class="muted" id="duty">${pair(PRESETS[0].duty.en, PRESETS[0].duty.th)}</p>
    <p class="muted" lang="en">${UI.forgeNote.en}</p>
    <p class="muted" lang="th">${UI.forgeNote.th}</p>
    <div class="row" id="runtimes">${chipsHtml()}</div>
    <div class="grid two">
      <div>
        <label for="name">${pair(UI.runtimeName.en, UI.runtimeName.th)}</label>
        <input id="name" value="claude" autocomplete="off" />
      </div>
      <div>
        <label for="ingress">${pair(UI.ingress.en, UI.ingress.th)}</label>
        <input id="ingress" value="claude.ask" spellcheck="false" autocomplete="off" />
      </div>
    </div>
    <label for="face">${pair(UI.face.en, UI.face.th)}</label>
    <input id="face" autocomplete="off" />
    <label for="refuse">${pair(UI.refuse.en, UI.refuse.th)}</label>
    <textarea id="refuse"></textarea>
    <label for="seam">${pair(UI.seam.en, UI.seam.th)}</label>
    <textarea id="seam">The player still meets one party.</textarea>
    <label for="melody">${pair(UI.melody.en, UI.melody.th)}</label>
    <textarea id="melody"></textarea>
    <div class="grid two">
      <p class="readout"><span class="kicker">orchestration_graph</span><span class="name" id="orch">quiet</span></p>
      <p class="readout"><span class="kicker">skill_graph</span><span class="name" id="skill-graph">fanout</span></p>
    </div>
    <p id="gaps" class="danger">${pair(UI.stillOpen.en + ": face, refuse, melody", UI.stillOpen.th + ": face, refuse, melody")}</p>
    <button class="primary seal" id="seal" type="button" disabled>${pair(UI.seal.en, UI.seal.th)}</button>
    <p class="kicker" id="sealed-label" hidden>${pair(UI.sealed.en, UI.sealed.th)}</p>
    <pre id="sealed" hidden></pre>
    <div class="row"><button class="ghost" id="copy-bridge" type="button" hidden>${pair(UI.copyBridge.en, UI.copyBridge.th)}</button></div>
  </section>
  <section>
    <p class="kicker">${pair(UI.huddle.en, UI.huddle.th)}</p>
    <p class="muted" lang="en">${UI.huddleNote.en}</p>
    <p class="muted" lang="th">${UI.huddleNote.th}</p>
    <div class="grid three" id="skills">${skillsHtml()}</div>
  </section>
  <section>
    <p class="kicker">${pair(UI.laws.en, UI.laws.th)}</p>
    <div class="grid two">${lawsHtml()}</div>
  </section>
  <article>
    <p class="kicker">${pair(UI.read.en, UI.read.th)}</p>
    <p class="muted">${pair(UI.sameBytes.en, UI.sameBytes.th)} <a href="mandate.txt">/mandate.txt</a></p>
    <pre id="mandate">${mandateEn}</pre>
    <p class="kicker">${pair(UI.humanCopy.en, UI.humanCopy.th)}</p>
    <pre lang="th" id="mandate-th">${mandateTh}</pre>
  </article>
</main>
<script type="module" src="helix-panel.js"></script>
</body>
</html>
`;
}

export function renderedFiles() {
  return {
    "index.html": renderIndex(),
    "mandate.txt": mandateEn,
    "mandate.th.txt": mandateTh,
    "helix.schema.json": JSON.stringify(schema, null, 2) + "\n",
  };
}

function write() {
  const root = new URL(".", import.meta.url);
  for (const [name, body] of Object.entries(renderedFiles())) {
    writeFileSync(new URL(name, root), body);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) write();
