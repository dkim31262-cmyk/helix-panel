import{createHash}from'node:crypto';import{validateCapRecord}from'../schema/validate.mjs';
const allowed={produced_artifact:['artifact','file'],source_checked:['source','url','source_snapshot'],test_failed_red:['test_log'],test_passed_green:['test_log'],build_passed:['build_log'],browser_tested:['browser_recording','browser_log'],external_action_confirmed:['external_receipt'],reviewer_signed:['review_document']};
const has=(coll,id)=>coll instanceof Map||coll instanceof Set?coll.has(id):!!coll?.[id];
export function verifyReceipt(receipt,{knownArtifacts={},reviewerEvidence={}}={}){
 try{validateCapRecord('receipt',receipt)}catch(e){return{usable:false,reasons:[e.message]}}
 const reasons=[];if(receipt.status!=='succeeded_observed')reasons.push('not observed success');
 if(!receipt.evidence_refs.length)reasons.push('missing evidence');
 if(receipt.evidence_refs.some(e=>!allowed[receipt.claim_type].includes(e.kind)||!has(knownArtifacts,e.uri)))reasons.push('wrong proof or unresolved reference');
 if(receipt.verifier_role==='independent_review'&&!has(reviewerEvidence,receipt.id))reasons.push('independent review not independently substantiated');
 return{usable:!reasons.length,reasons};
}
export function verifyTddChronology({redReceipt,firstImplementation,greenReceipt}){
 if(!redReceipt||!greenReceipt||!firstImplementation)return{verified:false,reason:'events missing'};
 if(redReceipt.claim_type!=='test_failed_red'||redReceipt.status!=='failed_observed'||greenReceipt.claim_type!=='test_passed_green'||greenReceipt.status!=='succeeded_observed'||!redReceipt.evidence_refs?.length||!greenReceipt.evidence_refs?.length||!firstImplementation.source_verified||!firstImplementation.proof_ref||!firstImplementation.commit_sha)return{verified:false,reason:'evidence unverified'};
 const [a,b,c]=[redReceipt.observed_at,firstImplementation.committed_at,greenReceipt.observed_at].map(Date.parse);
 return{verified:Number.isFinite(a)&&Number.isFinite(b)&&Number.isFinite(c)&&a<b&&b<c,reason:a<b&&b<c?'observed in TDD order':'TDD chronology invalid'};
}
export function evaluateOutcome({task,receipts,deliveredRefs,knownArtifacts={},approvalState={approved:false},reviewerStatus='not_reviewed',nowIso}){
 validateCapRecord('task',task);const known=receipts.filter(r=>verifyReceipt(r,{knownArtifacts}).usable);
 const verdicts=task.acceptance_checks.map(check=>{const xs=known.filter(r=>r.step_id===check.check_id&&check.required_claim_types.includes(r.claim_type));return{check_id:check.check_id,passed:xs.length>0,receipt_ids:xs.map(x=>x.id),rationale:xs.length?'Observed evidence':'Unverified'}});
 const required=task.acceptance_checks.filter(c=>c.required),passed=required.filter(c=>verdicts.find(v=>v.check_id===c.check_id)?.passed).length;
 const gaps=required.filter(c=>!verdicts.find(v=>v.check_id===c.check_id)?.passed).map(c=>'Missing evidence: '+c.check_id);
 if(!deliveredRefs.length||!deliveredRefs.every(x=>has(knownArtifacts,x)))gaps.push('Unverified artifact');
 const blocked=task.consent_requirements.length>0&&!approvalState.approved;
 if(blocked)gaps.push('Missing explicit consent');
 return validateCapRecord('outcome',{schema_version:'cap.outcome.v1',id:createHash('sha256').update(task.task_id+'|'+nowIso).digest('hex').slice(0,32),created_at:nowIso,provenance:{kind:'policy_derived',reference:'cap/policy/verdict.mjs'},task_id:task.task_id,delivered_refs:deliveredRefs,acceptance_verdicts:verdicts,evidence_coverage:required.length?passed/required.length:1,known_gaps:gaps,reviewer_status:reviewerStatus,delivery_state:blocked?'blocked':gaps.length?'partial':'verified',recommendation_for_next_step:gaps.length?'Obtain missing evidence':'Complete'});
}
