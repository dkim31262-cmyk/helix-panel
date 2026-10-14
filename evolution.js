"use strict";
const FAMILY=[
{id:"pakin",name:"PAKIN",code:"OpenAI · ChatGPT",kind:"core",role:"Integrator & accountable maker",mission:"System integration, artifacts, implementation and decision synthesis",link:"https://project25706.websitepublisher.ai/pakin-living-tutor.html#updates",official:"https://chatgpt.com/",doc:"https://help.openai.com/en/articles/6825453-chatgpt-release-notes",strengths:["Orchestration","Artifacts","Implementation"],verified:"Published Atlas · app access not tested"},
{id:"gemini",name:"GEMINI",code:"Google · Argon",kind:"core",role:"Knowledge & evidence partner",mission:"Scientific synthesis, multimodal learning, Workspace and complex reasoning",link:"https://gemini-ai-pro-living-hub-dkim31262-1451s-projects.vercel.app/",official:"https://gemini.google.com/",doc:"https://one.google.com/intl/en_th/about/google-ai-plans/",strengths:["Science","Multimodal","Google"],verified:"Argon access reported by Moon; not tested here"},
{id:"claude",name:"CLAUDE",code:"Anthropic · Moonstone",kind:"core",role:"Human meaning & editorial architect",mission:"Narrative, careful editing, documents, high-fidelity writing, code review",link:"https://claude-pro-living-atlas-dkim31262-1451s-projects.vercel.app/",official:"https://claude.ai/",doc:"https://claude.com/pricing",strengths:["Writing","Care","Artifacts"],verified:"Published Atlas · app access not tested"},
{id:"grok",name:"GROK",code:"xAI · เสี่ยจาง",kind:"core",role:"X pulse & sharp challenger",mission:"Current X conversation, fast critical perspective, Imagine, Build",link:"https://siajang-best-living-manual-dkim31262-1451s-projects.vercel.app/",official:"https://grok.com/",doc:"https://docs.x.ai/grok/overview",strengths:["X Pulse","Critical","Visuals"],verified:"Published Atlas · app access not tested"},
{id:"perplexity",name:"PERPLEXITY",code:"Search-first research",kind:"alternative",role:"Citation specialist",mission:"Search with citations, deep research, cross-source coverage, Comet/Computer (plan dependent)",link:"https://www.perplexity.ai/",official:"https://www.perplexity.ai/",doc:"https://www.perplexity.ai/help-center/en/articles/10352901-what-is-perplexity-pro",strengths:["Sources","Research","Comet"],verified:"Entitlement not checked"},
{id:"copilot",name:"COPILOT",code:"Microsoft 365",kind:"alternative",role:"Microsoft-workflow specialist",mission:"OneDrive/SharePoint/Office tasks, Researcher, Analyst when appropriately licensed",link:"https://m365.cloud.microsoft/",official:"https://copilot.microsoft.com/",doc:"https://learn.microsoft.com/en-us/microsoft-365/copilot/researcher-agent",strengths:["Excel","Microsoft 365","Analyst"],verified:"Microsoft license and tenancy not checked"},
{id:"mistral",name:"MISTRAL VIBE",code:"Mistral · Vibe",kind:"alternative",role:"Flexible multilingual & independent stack",mission:"Vibe Work/Code/Chat, agent workflows, MCP connectors and deployment control",link:"https://chat.mistral.ai/",official:"https://mistral.ai/products/vibe/",doc:"https://help.mistral.ai/en/articles/682992-le-chat-is-now-vibe",strengths:["Multilingual","Agents","Code"],verified:"Entitlement not checked"},
{id:"deepseek",name:"DEEPSEEK",code:"V4.1 Flash · Open-weight",kind:"alternative",role:"Efficiency challenger",mission:"Cost-sensitive experimentation, open-weight deployment, long-context engineering where suitable",link:"https://chat.deepseek.com/",official:"https://www.deepseek.com/",doc:"https://api-docs.deepseek.com/news/news260910/",strengths:["Cost","Open weights","Code"],verified:"Hosting, billing and account availability not checked"}
];
const F=Object.fromEntries(FAMILY.map(x=>[x.id,x]));
const WEIGHTS={
"make":{pakin:10,gemini:6,claude:8,grok:4,perplexity:3,copilot:5,mistral:7,deepseek:5},
"research":{pakin:7,gemini:9,claude:7,grok:6,perplexity:10,copilot:7,mistral:8,deepseek:6},
"medical":{pakin:8,gemini:10,claude:8,grok:4,perplexity:9,copilot:4,mistral:6,deepseek:4},
"creative":{pakin:8,gemini:6,claude:10,grok:7,perplexity:4,copilot:5,mistral:7,deepseek:5},
"visual":{pakin:9,gemini:10,claude:6,grok:10,perplexity:4,copilot:6,mistral:5,deepseek:3},
"code":{pakin:9,gemini:10,claude:10,grok:7,perplexity:5,copilot:7,mistral:9,deepseek:9},
"office":{pakin:6,gemini:8,claude:7,grok:3,perplexity:6,copilot:11,mistral:7,deepseek:5},
"life":{pakin:10,gemini:6,claude:9,grok:6,perplexity:6,copilot:5,mistral:5,deepseek:3}
};
const GROUNDS={
none:{},
web:{perplexity:5,gemini:3,pakin:2,mistral:2},
x:{grok:9,perplexity:2,pakin:1},
google:{gemini:7,pakin:2},
microsoft:{copilot:10,perplexity:1},
files:{pakin:3,claude:3,gemini:3,mistral:2},
code:{claude:4,gemini:3,pakin:4,mistral:4,deepseek:3}
};
const USE={make:"Ship a usable artifact with a named owner and test",research:"Build a source-cited evidence packet",medical:"Use de-identified sources, verify recommendations and apply physician review",creative:"Preserve artistic intent, voice and continuity",visual:"Create consistent references, produce imagery and review render",code:"Inspect existing repo, implement a tested vertical slice",office:"Work in authorized work files, preserve originals",life:"Make a decision that improves real life, not architecture"};
const EVIDENCE={none:"Identify what evidence is missing",web:"Link primary sources with dates and conflicting claims",x:"Trace original X posts, timestamps and sampling caveats",google:"Use authorized Google source files, with citations and provenance",microsoft:"Use licensed Microsoft work context and permissions",files:"Read provided original files; cite pages or line ranges",code:"Inspect actual repo snapshot, tests and diff"};
const RISK={normal:"Routine · human quality control",high:"High stakes · independent checks + approval",clinical:"Clinical or sensitive · no identifiable patient data; human professional review"};
const SOURCES=[
{day:"14 OCT 2026",topic:"Helix public backplane",text:"Existing bridge.v1/result.v1, Relay-only contract and one-envelope rule preserved. Evolution HUD extends the same Helix GitHub/Vercel project.",url:"https://github.com/dkim31262-cmyk/helix-panel",provider:"HELIX"},
{day:"13 OCT 2026",topic:"Gemini 4 Argon",text:"New flagship released. Google AI Pro access was reported by Moon; API billing/permissions are separate.",url:"https://gemini.google.com/",provider:"GOOGLE"},
{day:"SEP 2026",topic:"DeepSeek V4.1 Flash",text:"Official docs state the new efficient API model supersedes V4 Pro routing. Evaluate cost as an option, not as a benchmark guarantee.",url:"https://api-docs.deepseek.com/news/news260910/",provider:"DEEPSEEK"},
{day:"AUG 2026",topic:"Le Chat became Mistral Vibe",text:"One product now has Work, Code and Chat modes; use its connector/deployment options when independence or multilingual work matters.",url:"https://help.mistral.ai/en/articles/682992-le-chat-is-now-vibe",provider:"MISTRAL"},
{day:"AUG 2026",topic:"Microsoft Copilot Researcher",text:"Consumer Copilot Deep Research was retired Aug 18; Researcher is the relevant alternative in eligible Microsoft 365 plans.",url:"https://support.microsoft.com/en-us/microsoft-copilot/deep-research-in-microsoft-copilot",provider:"MICROSOFT"},
{day:"SEP 2026",topic:"Perplexity search / Computer",text:"Pro supports citation-first research and limited file/app creation; Computer and Comet features vary by plan, API is separate.",url:"https://www.perplexity.ai/help-center/en/articles/11187416-which-perplexity-subscription-plan-is-right-for-you",provider:"PERPLEXITY"}
];
const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
const gates=new Set(["gemini"]); // Moon explicitly reported Argon can be accessed; not tested by this HUD.
const SKILL={creative:"artifact",make:"artifact",visual:"artifact",code:"artifact",office:"artifact",medical:"artifact",research:"artifact",life:"adventure"};
const intro="HELIX is a public decision guide. It does not invoke provider APIs, read private accounts or guarantee availability.";
let last=null;let openedTab="all";
function clean(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function card(f){
 const confirmed=gates.has(f.id);
 return '<article class="member" data-kind="'+f.kind+'" data-name="'+clean(f.name.toLowerCase()+" "+f.mission.toLowerCase())+'">'+
 '<div class="member-head"><span class="type">'+(f.kind==="core"?"CORE FAMILY":"ALTERNATIVE")+'</span><span class="light '+(confirmed?"known":"")+'">'+(confirmed?"ACCESS DECLARED":"ACCESS UNKNOWN")+'</span></div>'+
 '<h3>'+clean(f.name)+'</h3><div class="by">'+clean(f.code)+'</div><p class="role">'+clean(f.role)+'</p><p class="mission">'+clean(f.mission)+'</p>'+
 '<div class="tags">'+f.strengths.map(x=>'<span>'+clean(x)+'</span>').join("")+'</div>'+
 '<p class="verified">'+clean(f.verified)+'</p>'+
 '<label class="access"><input type="checkbox" data-access="'+f.id+'" '+(confirmed?"checked":"")+'> I can open this provider in my own account</label>'+
 '<div class="member-links"><a target="_blank" rel="noopener noreferrer" href="'+f.link+'">'+(f.kind==="core"?"OPEN EXISTING ATLAS ↗":"OPEN PLATFORM ↗")+'</a><a target="_blank" rel="noopener noreferrer" href="'+f.doc+'">SOURCE ↗</a></div></article>';
}
function paintFamily(){
 let term=q("#memberSearch").value.toLocaleLowerCase().trim();
 const list=FAMILY.filter(f=>(openedTab==="all"||f.kind===openedTab)&&(f.name+" "+f.code+" "+f.mission+" "+f.strengths.join(" ")).toLocaleLowerCase().includes(term));
 q("#memberGrid").innerHTML=list.map(card).join("");
 q("#familyCount").textContent=list.length+" / "+FAMILY.length+" family members";
}
function score(f,task,ground,priority,stakes){
 let n=2+(WEIGHTS[task]?.[f.id]||0)+(GROUNDS[ground]?.[f.id]||0),because=[];
 if((WEIGHTS[task]?.[f.id]||0)>=9)because.push("strong task fit");
 if((GROUNDS[ground]?.[f.id]||0)>=4)because.push("evidence lives near this tool");
 if(priority==="depth"){if(["gemini","claude","pakin","perplexity"].includes(f.id))n+=2}
 if(priority==="speed"){if(["grok","deepseek","pakin"].includes(f.id))n+=2}
 if(priority==="cost"){if(f.id==="deepseek")n+=5;if(f.id==="mistral")n+=2;if(f.id==="perplexity")n-=2}
 if(priority==="independent"){if(f.id==="mistral"||f.id==="deepseek")n+=6; if(f.id==="copilot")n-=2}
 if(stakes==="clinical"){if(["gemini","pakin","claude","perplexity"].includes(f.id))n+=2;else n-=3}
 if(stakes==="high"){if(["gemini","claude","pakin","perplexity"].includes(f.id))n+=1}
 if(f.kind==="alternative"&&!gates.has(f.id)){n-=4;because.push("account permission not declared")}
 if(stakes==="clinical"&&f.kind==="alternative"&&!gates.has(f.id)){n-=3}
 if(!because.length)because.push("usable second perspective");
 return {f,score:n,because};
}
function choose(){
 const task=q("#task").value,ground=q("#ground").value,stakes=q("#stakes").value,priority=q("#priority").value;
 const brief=q("#brief").value.trim();
 const scores=FAMILY.map(f=>score(f,task,ground,priority,stakes)).sort((a,b)=>b.score-a.score||(a.f.kind==="core"?-1:1));
 const first=scores[0],second=scores.filter(x=>x.f.id!==first.f.id).sort((a,b)=>{
  const abonus=(a.f.kind!==first.f.kind?1:0),bbonus=(b.f.kind!==first.f.kind?1:0);
  return (b.score+bbonus)-(a.score+abonus);
 })[0];
 const bestAlt=scores.find(x=>x.f.kind==="alternative"),bestCore=scores.find(x=>x.f.kind==="core");
 const huddle=brief.length>340||stakes!=="normal"||["research","medical","code"].includes(task)||ground==="x"||ground==="web";
 const focus=huddle?"chain":"quiet",skill=SKILL[task]||"artifact",skillGraph=skill==="adventure"?"fanout":"chain";
 const reason=first.f.role+" · "+first.because.join("; ")+". Estimated strategic fit score "+first.score+" (curated rules, not model evaluation).";
 const note=stakes==="clinical"?"Clinical gate: use de-identified/synthetic data; verify primary references, guidelines, calculations and dosing; a qualified clinician must approve before care.":stakes==="high"?"Independent evidence check and explicit human approval are required before material changes.":"Inspect the delivered file, references or test result before calling it complete.";
 const accessNote=gates.has(first.f.id)?"The account-access checkbox is user-declared, NOT OAuth tested.":"Account access has not been declared. Recommendation is advisory only.";
 const altNote=bestAlt?.f.id===first.f.id?"An Alternative Family member is selected only as a recommendation; permission and tests are still pending.":"Alternative specialist: "+bestAlt.f.name+" when "+bestAlt.f.role.toLowerCase()+" adds value; do not add another model by default.";
 const packet={
  version:"helix.evolution.hud.v1",
  prepared_at:"2026-10-14",
  status:"client_side_plan_not_execution",
  user_brief:brief,
  outcome:task,evidence:ground,risk:stakes,priority,
  chosen_face:first.f.name,primary:first.f.id,
  candidate_specialist:second.f.name,
  alternative_candidate:bestAlt?.f.name,
  huddle:huddle,
  orchestration_graph:focus,
  skill_graph:skillGraph,
  relay:"one envelope; no raw fleet execution",
  outcome_contract:USE[task],
  evidence_contract:EVIDENCE[ground],
  handoff_note:note,
  permission:accessNote,
  provider_link:first.f.link,
  scores:scores.map(x=>({name:x.f.name,score:x.score,access_declared:gates.has(x.f.id),kind:x.f.kind})),
  safety:"Do not transfer private patient identifiers, credentials or connected app content through this public HUD."
 };
 const plain=[
 "HELIX / ORCHESTRATION EVOLUTION CORE",
 "Decision packet · deterministic advisory HUD, not an API execution",
 "Task: "+(brief||"(Describe your specific goal in the selected provider)"),
 "Outcome: "+USE[task],
 "Grounding: "+EVIDENCE[ground],
 "Priority: "+priority+" · Risk: "+RISK[stakes],
 "Lead / human-facing identity: "+first.f.name,
 "Optional second specialist: "+(huddle?second.f.name:"Not needed for this simple task"),
 "Alternative candidate: "+bestAlt.f.name+" (use only if it adds measurable value and is authorized)",
 "Orchestration graph: "+focus+" · Skill graph: "+skillGraph+" · Relay: one-envelope output",
 "Evidence → tool availability → permission → test → release",
 "Acceptance criteria: original-source anchors, an inspectable artifact or link, and clear evidence of tests.",
 "Human approval required for high-stakes or clinically relevant outcomes.",
 "Access: "+accessNote,
 "Guardrail: "+note,
 "Refusal: Do not invent citations, model access, credentials, completed actions, or simulate private app control.",
 "Keep each AI's own identity; do not speak as a committee."
 ].join("\n");
 last={packet,plain,primary:first,second,bestAlt,bestCore,scores};
 q("#lead").textContent=first.f.name;
 q("#leadRole").textContent=reason;
 q("#leadProof").textContent=accessNote;
 q("#second").textContent=huddle?second.f.name:"NO SECOND MODEL";
 q("#secondRole").textContent=huddle?"Conditional review: "+second.f.role:"One good room is enough.";
 q("#alt").textContent=bestAlt.f.name;
 q("#altRole").textContent=altNote;
 q("#graph").textContent=focus.toUpperCase();
 q("#bridgeGraph").textContent=skillGraph.toUpperCase();
 q("#routeReason").textContent=note;
 q("#handoff").value=plain;
 q("#scoreList").innerHTML=scores.slice(0,5).map((x,i)=>'<div class="scoreline"><span>'+String(i+1).padStart(2,"0")+' · '+clean(x.f.name)+'</span><span>'+x.score+' · '+(gates.has(x.f.id)?"DECLARED":"UNKNOWN")+'</span></div>').join("");
 q("#openLead").href=first.f.link;
 q("#openLead").textContent="OPEN "+first.f.name+" ↗";
 q("#routingStatus").textContent="ROUTE COMPUTED · NOT EXECUTED";
 q("#decision").hidden=false;
 q("#decision").scrollIntoView({behavior:"smooth",block:"start"});
}
function promptScenario(s){
 const examples={
  medical:{task:"medical",ground:"files",stakes:"clinical",priority:"depth",brief:"Synthesize a source-verified neurology teaching brief from approved, de-identified references. Explain mechanisms, red flags, clinical transfer and what a physician must independently verify."},
  studio:{task:"creative",ground:"files",stakes:"normal",priority:"depth",brief:"Develop a cinematic literary artbook direction from the canonical Kintsugi prose, with a strong editorial point of view, visual sequence and a finished export QC checklist."},
  application:{task:"code",ground:"code",stakes:"high",priority:"depth",brief:"Improve the existing Helix website without creating duplicate systems: inspect the repository, implement one reusable interface, run tests, verify mobile interactions and preserve rollback."},
  research:{task:"research",ground:"web",stakes:"high",priority:"depth",brief:"Compare current AI approaches using independently checkable sources, dates, uncertainty and the lowest-cost viable evaluation plan."},
  x:{task:"research",ground:"x",stakes:"normal",priority:"speed",brief:"Summarize current X conversation about a topic with original post dates, multiple viewpoints, sampling caveats and independent verification."},
  office:{task:"office",ground:"microsoft",stakes:"normal",priority:"depth",brief:"Create a cited brief from documents in a licensed Microsoft 365 workspace, with permissions respected and a decision-ready summary."}
 };
 const v=examples[s];if(!v)return;for(const k of ["task","ground","stakes","priority","brief"])q("#"+k).value=v[k];
 choose();
}
function showAccess(){q("#accessNote").textContent=gates.size+" provider"+(gates.size===1?"":"s")+" self-declared available; these are NOT live connections.";}
function copyText(s){
 if(!s)return;
 navigator.clipboard?.writeText(s).then(()=>note("Copied to clipboard")).catch(()=>fallbackCopy(s))||fallbackCopyIfNoAPI(s);
}
function fallbackCopyIfNoAPI(s){if(!navigator.clipboard?.writeText)fallbackCopy(s)}
function fallbackCopy(s){const e=document.createElement("textarea");e.value=s;e.style.position="fixed";e.style.opacity="0";document.body.append(e);e.select();const ok=document.execCommand("copy");e.remove();note(ok?"Copied":"Select the text to copy manually");}
function note(t){const e=q("#toast");e.textContent=t;e.classList.add("on");setTimeout(()=>e.classList.remove("on"),1600)}
function download(){
 if(!last)return;
 const blob=new Blob([JSON.stringify(last.packet,null,2)],{type:"application/json"});
 const obj=URL.createObjectURL(blob),a=document.createElement("a");a.href=obj;a.download="helix-evolution-handoff.json";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(obj),2000);note("Decision packet exported");
}
function renderLedger(){q("#ledgerList").innerHTML=SOURCES.map(x=>'<article class="release"><div class="release-head"><span>'+clean(x.provider)+'</span><time>'+clean(x.day)+'</time></div><h3>'+clean(x.topic)+'</h3><p>'+clean(x.text)+'</p><a href="'+clean(x.url)+'" target="_blank" rel="noopener noreferrer">SOURCE ↗</a></article>').join("");}
document.addEventListener("DOMContentLoaded",()=>{
 paintFamily();renderLedger();showAccess();
 q("#familyTab").addEventListener("click",e=>{const b=e.target.closest("[data-tab]");if(!b)return;openedTab=b.dataset.tab;qa("[data-tab]").forEach(n=>n.setAttribute("aria-pressed",String(n===b)));paintFamily()});
 q("#memberSearch").addEventListener("input",paintFamily);
 q("#memberGrid").addEventListener("change",e=>{const id=e.target.dataset.access;if(!id)return;if(e.target.checked)gates.add(id);else gates.delete(id);showAccess();paintFamily();});
 q("#run").addEventListener("click",choose);
 qa("[data-example]").forEach(e=>e.addEventListener("click",()=>promptScenario(e.dataset.example)));
 q("#copyHandoff").addEventListener("click",()=>copyText(q("#handoff").value));
 q("#export").addEventListener("click",download);
 q("#copyContract").addEventListener("click",()=>copyText("https://helix-panel-gamma.vercel.app/mandate.txt"));
 q("#reset").addEventListener("click",()=>{q("#brief").value="";q("#task").value="make";q("#ground").value="none";q("#stakes").value="normal";q("#priority").value="depth";q("#decision").hidden=true;last=null;note("Inputs reset");});
 q("#explain").addEventListener("click",()=>{q("#how").hidden=!q("#how").hidden;q("#explain").setAttribute("aria-expanded",String(!q("#how").hidden))});
});
