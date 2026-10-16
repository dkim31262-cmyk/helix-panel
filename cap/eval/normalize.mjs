const CLASSES=['research','software','document','creative','multimodal','cross_app'];
export function normalizeStudy({registration,runs,ratings}){
 if(!registration||!Array.isArray(registration.task_bank)||!Array.isArray(runs)||!Array.isArray(ratings))throw new TypeError('Missing study data');
 const n=registration.protocol==='pilot'?12:registration.protocol==='confirmatory'?48:0;
 if(!n||registration.task_bank.length!==n)throw new TypeError('task count must match preregistered protocol');
 for(const cls of CLASSES)if(registration.task_bank.filter(t=>t.task_class===cls).length!==n/6)throw new TypeError('incorrect task strata');
 if(!Array.isArray(registration.evaluator_ids)||new Set(registration.evaluator_ids).size<2)throw new TypeError('two independent evaluators required');
 const regTime=Date.parse(registration.preregistered_at);
 if(!Number.isFinite(regTime))throw new TypeError('invalid registration timestamp');
 const taskIds=new Set(registration.task_bank.map(x=>x.task_id)),ids=new Set();
 for(const r of runs){
  if(!taskIds.has(r.task_id)||!['chat_cap','work','chat_plain','ablation'].includes(r.condition)||ids.has(r.run_id))throw new TypeError('invalid/duplicate study run');
  ids.add(r.run_id);
  if(!Number.isFinite(Date.parse(r.started_at))||regTime>=Date.parse(r.started_at)||Date.parse(r.finished_at)<Date.parse(r.started_at))throw new TypeError('registration after outcomes or invalid timeline');
  if(!r.visible_output||!r.observable_deliverable_refs?.length||!Array.isArray(r.mandatory_checks)||r.mandatory_checks.some(c=>!c.evidence_ref))throw new TypeError('run has no observable evidence');
  if(r.condition==='work'&&!r.work_observable)throw new TypeError('simulated Work output cannot be counted');
  if(!Number.isInteger(r.interventions)||r.interventions<0||!Number.isInteger(r.tool_calls)||r.tool_calls<0||r.cost_observed_or_null!==null&&(typeof r.cost_observed_or_null!=='number'||r.cost_observed_or_null<0))throw new TypeError('invalid metrics');
 }
 const ratingByRun=new Map();
 for(const rating of ratings){
  if(!ids.has(rating.blinded_output_id)||!registration.evaluator_ids.includes(rating.reviewer_id)||!(rating.score>=0&&rating.score<=5)||!Number.isFinite(Date.parse(rating.observed_at)))throw new TypeError('invalid blind rating');
  const rs=ratingByRun.get(rating.blinded_output_id)||[];if(rs.some(v=>v.reviewer_id===rating.reviewer_id))throw new TypeError('duplicate reviewer');rs.push(rating);ratingByRun.set(rating.blinded_output_id,rs);
 }
 for(const r of runs)if((ratingByRun.get(r.run_id)||[]).length<2)throw new TypeError('two blinded raters required per run');
 const matched_pairs=[],missing_pairs=[],issues=[],baselines=[];
 for(const task of registration.task_bank){
  const cap=runs.find(r=>r.task_id===task.task_id&&r.condition==='chat_cap');
  const work=runs.find(r=>r.task_id===task.task_id&&r.condition==='work');
  baselines.push(...runs.filter(r=>r.task_id===task.task_id&&['chat_plain','ablation'].includes(r.condition)));
  if(!cap||!work){missing_pairs.push(task.task_id);issues.push('missing Work or CAP observed run for '+task.task_id);continue}
  if(registration.study_type==='controlled_quality'&&registration.tool_access_condition==='matched'&&cap.entitlement_profile!==work.entitlement_profile)throw new TypeError('mismatched entitlement in matched comparison');
  matched_pairs.push({task_id:task.task_id,task_class:task.task_class,chat_cap:{...cap,ratings:ratingByRun.get(cap.run_id)},work:{...work,ratings:ratingByRun.get(work.run_id)}});
 }
 return{study_type:registration.study_type,protocol:registration.protocol,matched_pairs,missing_pairs,conditions:[...new Set(runs.map(r=>r.condition))],issues,baselines,metadata:{study_id:registration.study_id,registered_at:registration.preregistered_at,n_expected:n,tool_access_condition:registration.tool_access_condition}};
}
