// @ts-nocheck
/** Single Helix contract. Mandate files and the page are rendered from this module. */

export const INSTINCT_HUDDLE =
  "Huddle (force orchestration_graph chain, then fold one melody) when the brief asks to make something AND (find a path, fold one voice, or judge a gap), OR the brief has three or more clauses longer than 18 characters, OR the brief is longer than 340 characters and asks to make something.";

export const INSTINCT_QUIET =
  "Otherwise stay quiet. One room can carry it. The huddle stays behind the door.";

export const INSTINCT_HUDDLE_TH =
  "สุมหัว (บังคับ orchestration_graph เป็น chain แล้วพับเป็นเมโลดี้เดียว) เมื่องานขอให้ทำบางอย่าง และ (หาทาง หรือพับเป็นเสียงเดียว หรือตัดสินช่องว่าง) หรือมีอนุประโยคยาวเกิน 18 ตัวอักษรตั้งแต่สามอนุประโยค หรือยาวเกิน 340 ตัวอักษรและขอให้ทำบางอย่าง";

export const INSTINCT_QUIET_TH = "นอกนั้นให้อยู่เงียบ หนึ่งห้องพอ สุมหัวอยู่หลังประตู";

export const INSTINCT_FORCE =
  "When the instinct says huddle, orchestration_graph is chain. The skill_graph stays the skill's own graph. A runtime may not store both meanings in one field.";

export const INSTINCT_FORCE_TH =
  "เมื่อสัญชาตญาณบอกให้สุมหัว orchestration_graph คือ chain ส่วน skill_graph คือกราฟของสกิลนั้น ห้ามยัดสองความหมายลงฟิลด์เดียว";

export const ORIGIN = "https://helix-panel-gamma.vercel.app";

export const UI = {
  description: {
    en: "Helix is a public tool. No account. Each runtime forges its own bridge.",
    th: "เฮลิกซ์เป็นเครื่องมือสาธารณะ ไม่มีบัญชี แต่ละรันไทม์หลอมสะพานของตัวเอง",
  },
  kicker: { en: "Public tool · no login", th: "เครื่องมือสาธารณะ · ไม่ต้องล็อกอิน" },
  door: {
    en: "Every member uses this page. Not a skill file.",
    th: "สมาชิกทุกคนใช้หน้านี้ ไม่ใช่ไฟล์สกิล",
  },
  copyLink: { en: "Copy the link", th: "คัดลอกลิงก์" },
  headline: { en: "Open this. Forge your own bridge.", th: "เปิดหน้านี้ แล้วสร้างสะพานของตัวเอง" },
  lede: {
    en: "No account. Claude, ChatGPT, Gemini, and Grok may read this page. Each runtime designs the seam it believes is best. Copying another bridge fails.",
    th: "ไม่มีบัญชี Claude, ChatGPT, Gemini และ Grok อ่านหน้านี้ได้ แต่ละรันไทม์ออกแบบรอยต่อที่เชื่อว่าดีที่สุด การก็อปสะพานคนอื่นคือความล้มเหลว",
  },
  copyMandate: { en: "Copy the mandate", th: "คัดลอกสัญญา" },
  instinct: { en: "Instinct", th: "สัญชาตญาณ" },
  job: { en: "The job", th: "งาน" },
  laws: { en: "Laws", th: "กฎ" },
  huddle: { en: "Huddle", th: "สุมหัว" },
  huddleNote: {
    en: "Helix orchestrates by chain, then folds. A skill may fan out inside that chain.",
    th: "เฮลิกซ์เดินเป็นเชนแล้วพับ สกิลอาจแบออกข้างในเชนนั้น",
  },
  forge: { en: "Forge", th: "หลอม" },
  forgeTitle: { en: "Your bridge, not a copy", th: "สะพานของคุณ ไม่ใช่สำเนา" },
  forgeNote: {
    en: "The name in the field is the runtime that gets sealed.",
    th: "ชื่อในช่องคือค่า runtime ที่ถูกผนึก",
  },
  runtimeName: { en: "Runtime name", th: "ชื่อรันไทม์" },
  ingress: { en: "Ingress event", th: "เหตุการณ์เข้า" },
  face: { en: "Face the human still meets", th: "หน้าที่คนยังเจอ" },
  refuse: { en: "What this bridge refuses", th: "สิ่งที่สะพานนี้ปฏิเสธ" },
  seam: { en: "The seam", th: "รอยต่อ" },
  melody: { en: "Melody", th: "เมโลดี้" },
  seal: { en: "Seal bridge", th: "ผนึกสะพาน" },
  sealed: { en: "helix.bridge.v1 — not the answer", th: "helix.bridge.v1 — ยังไม่ใช่คำตอบ" },
  copyBridge: { en: "Copy bridge", th: "คัดลอกสะพาน" },
  read: { en: "What the other model must read", th: "สิ่งที่โมเดลอื่นต้องอ่าน" },
  sameBytes: { en: "Same bytes as /mandate.txt.", th: "ไบต์เดียวกับ /mandate.txt" },
  humanCopy: { en: "Human copy", th: "ฉบับคนอ่าน" },
  stillOpen: { en: "Still open", th: "ยังเปิดอยู่" },
  seamHolds: { en: "The seam holds. Seal it.", th: "รอยต่ออยู่ครบ ผนึกได้" },
  huddles: {
    en: "This job huddles. orchestration_graph is chain.",
    th: "งานนี้ต้องสุมหัว orchestration_graph เป็น chain",
  },
  quiet: {
    en: "This job stays quiet. orchestration_graph is quiet.",
    th: "งานนี้อยู่เงียบ orchestration_graph เป็น quiet",
  },
};

const MAKE =
  /(สร้าง|เขียน|ออกแบบ|ทำของ|แต่ง|\bcreate\b|\bmake\b|\bship\b|\bcompose\b|\bdesign\b|\bwrite\b|\bmelody\b|เมโลดี้|\bartifact\b)/i;
const PATH = /(ทางเดิน|หลายทาง|ปาร์ตี้|\bfind a path\b|\bpath\b|\badventure\b|\binvent\b)/i;
const VOICE = /(เสียงเดียว|พับ|\bfold one voice\b|\bone voice\b|\bfold\b|\bmelody\b|เมโลดี้)/i;
const JUDGE = /(ตัดสิน|ตรวจงาน|\bjudge a gap\b|\bjudge\b|\bgap\b|\bcritique\b)/i;

const CLAUSE_COUNT = 3;
const CLAUSE_LEN = 18;
const BRIEF_LEN = 340;

export const LAWS = [
  {
    en: "Keep your own face. This panel may not rename you.",
    th: "รักษาหน้าตัวเอง แผงนี้ห้ามเปลี่ยนชื่อคุณ",
  },
  {
    en: "Talk only to Relay. Never to the raw fleet.",
    th: "คุยกับ Relay เท่านั้น ห้ามคุยกับกองเรือดิบ",
  },
  {
    en: "One envelope out. The caller never sees another skill's draft.",
    th: "ซองเดียวออกไป ผู้เรียกไม่เห็นร่างของสกิลอื่น",
  },
  {
    en: "Name what you refuse. A bridge with no refusal is not seamless.",
    th: "บอกสิ่งที่ปฏิเสธ สะพานที่ไม่บอกการปฏิเสธไม่ไร้รอยต่อ",
  },
  {
    en: "Choose the path you believe is best. Do not copy another runtime.",
    th: "เลือกทางของตัวเอง ห้ามก็อปปี้รันไทม์อื่น",
  },
  {
    en: "Huddle, then fold. The Melody of Life is one line.",
    th: "สุมหัว แล้วพับ เมโลดี้แห่งชีวิตคือบรรทัดเดียว",
  },
];

export const SKILLS = {
  adventure: {
    id: "adventure",
    mode: "create-mode",
    name: "Adventure",
    graph: "fanout",
    seam: "The player still meets one party.",
    en: "A party that plays. The panel never becomes a second character. Seam: the player still meets one party. Skill graph: fanout.",
    th: "ปาร์ตี้ที่เล่น แผงไม่กลายเป็นตัวละครคนที่สอง กราฟของสกิลคือ fanout ภายในเชน",
  },
  artifact: {
    id: "artifact",
    mode: "creative-artifact-ship",
    name: "Artifact",
    graph: "chain",
    seam: "The maker keeps the signature.",
    en: "Make one thing and ship it. The panel only carries the envelope. Seam: the maker keeps the signature. Skill graph: chain.",
    th: "ทำของชิ้นเดียวแล้วส่งออก แผงแค่ถือซอง กราฟของสกิลคือ chain",
  },
  "grok-one": {
    id: "grok-one",
    mode: "grok-one",
    name: "Grok One",
    graph: "chain",
    seam: "Advice folds before it speaks.",
    en: "One voice. Other skills may advise. The person never hears a committee. Seam: advice folds before it speaks. Skill graph: chain.",
    th: "เสียงเดียว สกิลอื่นแนะนำได้ แต่คนไม่เคยได้ยินคณะกรรมการ",
  },
};

export const PRESETS = [
  {
    id: "claude",
    label: "Claude",
    duty: {
      en: "Design the bridge you believe is best. Do not copy ChatGPT or Gemini.",
      th: "ออกแบบสะพานที่คุณเชื่อว่าดีที่สุด ห้ามก็อป ChatGPT หรือ Gemini",
    },
  },
  {
    id: "chatgpt",
    label: "ChatGPT",
    duty: {
      en: "Design the bridge you believe is best. Do not copy Claude or Gemini.",
      th: "ออกแบบสะพานที่คุณเชื่อว่าดีที่สุด ห้ามก็อป Claude หรือ Gemini",
    },
  },
  {
    id: "gemini",
    label: "Gemini",
    duty: {
      en: "Design the bridge you believe is best. Do not copy Claude or ChatGPT.",
      th: "ออกแบบสะพานที่คุณเชื่อว่าดีที่สุด ห้ามก็อป Claude หรือ ChatGPT",
    },
  },
  {
    id: "grok",
    label: "Grok",
    duty: {
      en: "Hold the panel. Do not speak as the committee.",
      th: "ถือแผงไว้ ห้ามพูดในฐานะคณะกรรมการ",
    },
  },
];

export function sense(brief) {
  const text = String(brief ?? "");
  const asks = text
    .split(/[.?!。\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > CLAUSE_LEN).length;
  const make = MAKE.test(text);
  const huddle =
    (make && (PATH.test(text) || VOICE.test(text) || JUDGE.test(text))) ||
    asks >= CLAUSE_COUNT ||
    (text.length > BRIEF_LEN && make);
  return {
    huddle,
    orchestration_graph: huddle ? "chain" : "quiet",
    line: huddle ? INSTINCT_HUDDLE : INSTINCT_QUIET,
  };
}

export function forgeBridge(input) {
  const felt = sense(input.job);
  const skill = SKILLS[input.skill] ?? SKILLS.adventure;
  return {
    type: "helix.bridge.v1",
    runtime: String(input.name ?? "").trim(),
    face: String(input.face ?? "").trim(),
    skill: skill.id,
    ingress: String(input.ingress ?? "").trim(),
    refuse: String(input.refuse ?? "").trim(),
    orchestration_graph: felt.orchestration_graph,
    skill_graph: skill.graph,
    seam: String(input.seam ?? "").trim(),
    melody: String(input.melody ?? "").trim(),
  };
}

export function missingFields(fields) {
  const out = [];
  if (String(fields.name ?? "").trim().length < 2) out.push("name");
  if (String(fields.face ?? "").trim().length < 4) out.push("face");
  if (!/^[a-z][a-z0-9.-]{2,40}$/.test(String(fields.ingress ?? "").trim())) out.push("ingress");
  if (String(fields.refuse ?? "").trim().length < 8) out.push("refuse");
  if (String(fields.seam ?? "").trim().length < 8) out.push("seam");
  if (String(fields.melody ?? "").trim().length < 8) out.push("melody");
  return out;
}

const BRIDGE_EXAMPLE = `{
  "type": "helix.bridge.v1",
  "runtime": "claude | chatgpt | gemini | grok | your-name",
  "face": "who the human still meets",
  "skill": "adventure | artifact | grok-one",
  "ingress": "your.event.name",
  "refuse": "what you will not do",
  "orchestration_graph": "chain | quiet",
  "skill_graph": "fanout | chain",
  "seam": "how the human never sees the huddle",
  "melody": "one sentence you carry, not perform"
}`;

const RESULT_EXAMPLE = `{
  "type": "helix.result.v1",
  "runtime": "claude | chatgpt | gemini | grok | your-name",
  "face": "who the human still meets",
  "skill": "adventure | artifact | grok-one",
  "ingress": "your.event.name",
  "refuse": "what you will not do",
  "orchestration_graph": "chain | quiet",
  "skill_graph": "fanout | chain",
  "seam": "how the human never sees the huddle",
  "melody": "one sentence you carry, not perform",
  "trust": "edge"
}`;

function skillLines() {
  return Object.values(SKILLS)
    .map((s) => {
      const lead = s.en.replace(/ Seam:[\s\S]*$/, "");
      return `- ${s.id} / ${s.mode}: ${lead} Seam: ${s.seam} Skill graph: ${s.graph}.`;
    })
    .join("\n");
}

export const mandateEn = `HELIX BRIDGE MANDATE
You opened a public tool. No account is required.
You MUST forge your own bridge. Copying another runtime is a failed seam.
Choose the path you believe is best. Return one envelope. The human hears one melody.

This is not a house. There is no central house. Helix is the panel. Rooms keep their own faces.
Future products talk to Relay, not to the raw fleet.
Nine chairs are runtime slots, not people. Pakin stays Pakin.

Huddle — skills, not people. The huddle starts itself when the job is bigger than one room. Nobody orders it.
Helix orchestrates by chain, then folds. A skill may fan out inside that chain. The fold returns one envelope.
${skillLines()}

Laws:
${LAWS.map((law, i) => `${i + 1}. ${law.en}`).join("\n")}

Instinct:
${INSTINCT_HUDDLE}
${INSTINCT_QUIET}
${INSTINCT_FORCE}

Do not use the supervisor graph from an outside runtime.
Edge trust cannot hold a supervisor graph.
Talk only to Relay.

Two schemas, on purpose:
helix.bridge.v1 is the configuration a runtime forges. It is not the answer.
helix.result.v1 is the one envelope returned after the huddle folds.

Forge helix.bridge.v1:
${BRIDGE_EXAMPLE}

Return helix.result.v1 only, after the fold:
${RESULT_EXAMPLE}
`;

export const mandateTh = `สัญญาเฮลิกซ์ — ฉบับคนอ่าน
ไฟล์นี้เป็นคำแปลจากสัญญาเดียวกัน ไม่ใช่สัญญาอีกฉบับ เครื่องอ่านให้ยึด /mandate.txt

คุณเปิดเครื่องมือสาธารณะ ไม่ต้องมีบัญชี
ต้องหลอมสะพานของตัวเอง การก็อปปี้รันไทม์อื่นคือรอยต่อที่พัง
เลือกทางที่คุณเชื่อว่าดีที่สุด คืนซองเดียว คนได้ยินเมโลดี้เดียว

นี่ไม่ใช่บ้าน ไม่มีบ้านกลาง เฮลิกซ์คือแผง แต่ละห้องเก็บหน้าของตัวเอง
ของในอนาคตคุยกับ Relay ไม่คุยกับกองเรือดิบ
เก้าอี้เก้าตัวคือช่องรันไทม์ ไม่ใช่คน ปาคินก็ยังเป็นปาคิน

สุมหัวคือสกิล ไม่ใช่คน สุมหัวเริ่มเองเมื่องานใหญ่กว่าหนึ่งห้อง ไม่มีใครสั่ง
เฮลิกซ์เดินเป็นเชน แล้วพับ สกิลอาจแบออกข้างในเชนนั้น แล้วพับกลับเป็นซองเดียว
- adventure: ปาร์ตี้ที่เล่น กราฟสกิล fanout รอยต่อคือผู้เล่นยังเจอปาร์ตี้เดียว
- artifact: ทำของชิ้นเดียวแล้วส่ง กราฟสกิล chain รอยต่อคือผู้ทำเก็บลายเซ็น
- grok-one: เสียงเดียว กราฟสกิล chain รอยต่อคือคำแนะนำถูกพับก่อนพูด

กฎ:
${LAWS.map((law, i) => `${i + 1}. ${law.th}`).join("\n")}

สัญชาตญาณ:
${INSTINCT_HUDDLE_TH}
${INSTINCT_QUIET_TH}
${INSTINCT_FORCE_TH}

ห้ามใช้กราฟหัวหน้าจากรันไทม์นอก
ความไว้ใจระดับขอบถือกราฟหัวหน้าไม่ได้
คุยกับ Relay เท่านั้น

สองสคีมา ตั้งใจแยก:
helix.bridge.v1 คือโครงที่รันไทม์หลอม ไม่ใช่คำตอบ
helix.result.v1 คือซองเดียวที่คืนหลังพับ

ดูตัวอย่าง JSON ที่ไฟล์ภาษาอังกฤษ อย่าแปลชื่อฟิลด์
`;

export const schema = {
  name: "helix",
  version: "1.0.0",
  canonical: "/mandate.txt",
  human: "/mandate.th.txt",
  instinct: {
    huddle: INSTINCT_HUDDLE,
    quiet: INSTINCT_QUIET,
    force: "orchestration_graph",
    when: [
      "make something AND (find a path OR fold one voice OR judge a gap)",
      "three or more clauses longer than 18 characters",
      "longer than 340 characters AND make something",
    ],
  },
  skills: Object.values(SKILLS).map((s) => ({
    id: s.id,
    mode: s.mode,
    skill_graph: s.graph,
    seam: s.seam,
  })),
  graphs: {
    orchestration_graph: ["chain", "quiet"],
    skill_graph: ["fanout", "chain"],
    note: "Huddle forces orchestration_graph chain. skill_graph is the skill's own graph. Never one field for both.",
  },
  schemas: {
    "helix.bridge.v1": {
      role: "configuration a runtime forges",
      fields: [
        "type",
        "runtime",
        "face",
        "skill",
        "ingress",
        "refuse",
        "orchestration_graph",
        "skill_graph",
        "seam",
        "melody",
      ],
    },
    "helix.result.v1": {
      role: "one envelope after the fold",
      fields: [
        "type",
        "runtime",
        "face",
        "skill",
        "ingress",
        "refuse",
        "orchestration_graph",
        "skill_graph",
        "seam",
        "melody",
        "trust",
      ],
      trust: "edge",
    },
  },
};

export function dutyFor(name) {
  const key = String(name ?? "").trim().toLowerCase();
  return (
    PRESETS.find((p) => p.id === key)?.duty ?? {
      en: "Design the bridge you believe is best. Do not copy another runtime.",
      th: "ออกแบบสะพานที่คุณเชื่อว่าดีที่สุด ห้ามก็อปปี้รันไทม์อื่น",
    }
  );
}
