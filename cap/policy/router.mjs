import{createHash}from'node:crypto';import{validateCapRecord}from'../schema/validate.mjs';
export function chooseRoute({task,capabilities,helixGraphs,nowIso,signals=[]}){
 validateCapRecord('task',task);validateCapRecord('capabilities',capabilities);
 if(!helixGraphs||helixGraphs.source!=='helix-contract.mjs'||!helixGraphs.orchestration_graph||!helixGraphs.skill_graph)throw new TypeError('Helix graph refs required');
 if(!nowIso?.endsWith('Z')||!Number.isFinite(Date.parse(nowIso)))throw new TypeError('UTC nowIso required');
 const ops=[...new Set(task.deliverables.flatMap(x=>x.required_operations))],limit=task.constraints.max_tools??Infinity;
 let effort_band=ops.length===0&&task.risk_tier==='low'&&task.task_class==='research'&&task.acceptance_checks.filter(x=>x.required).length===1&&task.deliverables.length===1?'quick':'managed';
 if(['high','clinical_or_sensitive'].includes(task.risk_tier)||task.task_class==='cross_app'||signals.some(s=>['test_failed','missing_evidence','contradiction','capability_missing'].includes(s.type)))effort_band='intensive';
 const tool_candidates=[],chosen_steps=[],missing=[];
 for(const op of ops){const matches=capabilities.entries.filter(x=>x.operation===op).sort((a,b)=>a.tool_id.localeCompare(b.tool_id));let found=false;
  for(const m of matches){const eligible=m.connected_state==='confirmed'&&m.permission_state==='authorized'&&m.observed_availability==='available';tool_candidates.push({tool_id:m.tool_id,eligible,reason:eligible?'Observed authorized capability':'Not connected/authorized/available'});if(eligible&&!found&&chosen_steps.length<limit){chosen_steps.push({step_id:'step-'+(chosen_steps.length+1),tool_id:m.tool_id,operation:op});found=true}}
  if(!found)missing.push(op);
 }
 const costs=chosen_steps.map(s=>capabilities.entries.find(x=>x.tool_id===s.tool_id).cost_information);
 const output={schema_version:'cap.route.v1',id:createHash('sha256').update(task.task_id+'|'+nowIso).digest('hex').slice(0,32),created_at:nowIso,provenance:{kind:'policy_derived',reference:'cap/policy/router.mjs'},task_id:task.task_id,orchestration_graph_ref:helixGraphs.orchestration_graph,skill_graph_ref:helixGraphs.skill_graph,effort_band,chosen_steps,tool_candidates,fallback:missing.length?{kind:missing.some(s=>s.startsWith('browser.'))?'needs_user_handoff_to_work':'blocked',reason:'Required operation unavailable: '+missing.join(',')}:null,why:'Advisory only; no execution performed',expected_qc:task.evidence_level,estimated_cost_range:costs.length>0&&costs.every(x=>typeof x==='number')?{min:costs.reduce((a,b)=>a+b,0),max:costs.reduce((a,b)=>a+b,0)}:null,approval_gates:[...new Set([...task.consent_requirements,...(['high','clinical_or_sensitive'].includes(task.risk_tier)?['human_approval']:[])])]};
 return validateCapRecord('route',output);
}
