const mean=xs=>xs.length?xs.reduce((a,b)=>a+b,0)/xs.length:null;
const median=xs=>{if(!xs.length)return null;const s=[...xs].sort((a,b)=>a-b),m=Math.floor(s.length/2);return s.length%2?s[m]:(s[m-1]+s[m])/2};
const accepted=r=>Array.isArray(r.mandatory_checks)&&r.mandatory_checks.length>0&&r.mandatory_checks.every(c=>c.passed===true&&typeof c.evidence_ref==='string'&&c.evidence_ref.length>0)&&!r.critical_failures?.length;
const qual=r=>mean(r.ratings.map(x=>x.score));
const duration=r=>(Date.parse(r.finished_at)-Date.parse(r.started_at))/1000;
function bootstrap(values,samples,seed){
 let rng=seed>>>0;const rand=()=>{rng=(Math.imul(1664525,rng)+1013904223)>>>0;return rng/4294967296};
 const out=[];
 for(let j=0;j<samples;j++){const a=Array.from({length:values.length},()=>values[Math.floor(rand()*values.length)]);out.push(mean(a))}
 out.sort((a,b)=>a-b);return[out[Math.floor(samples*.025)],out[Math.min(samples-1,Math.floor(samples*.975))]];
}
export function scoreStudy(normalized,{bootstrapSamples=2000,seed=20261016}={}){
 if(!Number.isInteger(bootstrapSamples)||bootstrapSamples<100||bootstrapSamples>10000)throw new TypeError('invalid bootstrapSamples');
 const classes=[...new Set(normalized.matched_pairs.map(p=>p.task_class))],by_class={};
 for(const cls of classes){
  const ps=normalized.matched_pairs.filter(p=>p.task_class===cls);
  const diffs=ps.map(p=>qual(p.chat_cap)-qual(p.work)),a=ps.map(p=>+accepted(p.chat_cap)),b=ps.map(p=>+accepted(p.work));
  const count=ps.length,crit=ps.filter(p=>p.chat_cap.critical_failures?.length>0||p.work.critical_failures?.length>0).length;
  const delta=mean(a)-mean(b),quality_gap=median(diffs),complete=count>=8&&!normalized.missing_pairs?.length;
  const practical_screen=crit||complete&&(quality_gap<-.5||delta<-.1)?'screen_fail':!complete?'inconclusive':'screen_pass';
  const costs=ps.map(p=>p.chat_cap.cost_observed_or_null),workCosts=ps.map(p=>p.work.cost_observed_or_null);
  const costAvg=cs=>cs.every(x=>typeof x==='number'&&Number.isFinite(x)&&x>=0)?mean(cs):null;
  by_class[cls]={n:count,quality_gap_median:quality_gap,quality_gap_ci95:count?bootstrap(diffs,bootstrapSamples,seed):null,accepted_rate_cap:mean(a),accepted_rate_work:mean(b),accepted_rate_diff:delta,accepted_diff_ci95:count?bootstrap(a.map((v,i)=>v-b[i]),bootstrapSamples,seed+1):null,critical_failures:crit,practical_screen,label:practical_screen==='screen_pass'?'exploratory screen pass, not proven equivalence':'exploratory / insufficient evidence',cap_cost_mean:costAvg(costs),work_cost_mean:costAvg(workCosts),cap_duration_s_mean:mean(ps.map(p=>duration(p.chat_cap))),work_duration_s_mean:mean(ps.map(p=>duration(p.work))),cap_interventions_mean:mean(ps.map(p=>p.chat_cap.interventions)),work_interventions_mean:mean(ps.map(p=>p.work.interventions)),cap_tools_mean:mean(ps.map(p=>p.chat_cap.tool_calls)),work_tools_mean:mean(ps.map(p=>p.work.tool_calls))};
 }
 return{by_class,overall:{n:normalized.matched_pairs.length,scope:'exploratory; no universal equivalence claim'},missingness:{missing:normalized.missing_pairs?.length??0,expected:normalized.metadata?.n_expected??null},limits:['Observational receipts only','Small per-class samples cannot prove model equivalence'],study_verdict:normalized.missing_pairs?.length?'inconclusive':'exploratory'};
}
