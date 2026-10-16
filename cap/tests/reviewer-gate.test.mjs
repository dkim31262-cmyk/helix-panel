import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateOutcome } from '../policy/verdict.mjs';
const at='2026-10-16T08:00:00.000Z';
const metadata=k=>({schema_version:'cap.'+k+'.v1',id:'test-'+k,created_at:at,provenance:{kind:'synthetic',reference:'synthetic fixture'}});
const task={...metadata('task'),task_id:'review-case',goal:'Deliver a reviewed artifact',task_class:'software',deliverables:[{deliverable_id:'d1',description:'sample',format:'text',required_operations:[]}],acceptance_checks:[{check_id:'check-1',criterion:'Evidence',required:true,required_claim_types:['produced_artifact']}],constraints:{deadline:null,spending_cap:null,max_tools:null,target_platforms:[],privacy_class:'public'},evidence_level:'inspected_artifact',risk_tier:'low',consent_requirements:[]};
const artifact={...metadata('receipt'),id:'artifact-receipt',task_id:task.task_id,step_id:'check-1',tool_or_actor:'builder',operation:'write',observed_at:at,input_reference:null,output_reference:'file://sample',status:'succeeded_observed',claim_type:'produced_artifact',evidence_refs:[{uri:'file://sample',kind:'file',observed_at:at}],verifier_role:'self_review',limitations:[]};
const review={...metadata('receipt'),id:'review-receipt',task_id:task.task_id,step_id:'review',tool_or_actor:'reviewer-2',operation:'independent review',observed_at:at,input_reference:'file://sample',output_reference:'file://review',status:'succeeded_observed',claim_type:'reviewer_signed',evidence_refs:[{uri:'file://review',kind:'review_document',observed_at:at}],verifier_role:'independent_review',provenance:{kind:'authenticated_tool',reference:'verified reviewer process'},limitations:[]};
const base={task,receipts:[artifact],deliveredRefs:['file://sample'],knownArtifacts:{'file://sample':true},approvalState:{approved:true},nowIso:at};
test('independent reviewer status cannot be asserted without reviewer evidence',()=>{
 const out=evaluateOutcome({...base,reviewerStatus:'independent_review'});
 assert.equal(out.delivery_state,'verified');
 assert.notEqual(out.reviewer_status,'independent_review');
});
test('authenticated, observed reviewer evidence can establish independent reviewer status',()=>{
 const out=evaluateOutcome({...base,receipts:[artifact,review],knownArtifacts:{'file://sample':true,'file://review':true},reviewerStatus:'independent_review',reviewerEvidence:{'review-receipt':{reviewerId:'reviewer-2',verified:true,source:'authenticated_tool',artifactRef:'file://review'}}});
 assert.equal(out.reviewer_status,'independent_review');
});
test('synthetic or self-issued review cannot be upgraded by metadata alone',()=>{
 const fake={...review,provenance:{kind:'synthetic',reference:'fixture'}};
 const out=evaluateOutcome({...base,receipts:[artifact,fake],knownArtifacts:{'file://sample':true,'file://review':true},reviewerStatus:'independent_review',reviewerEvidence:{'review-receipt':{reviewerId:'reviewer-2',verified:true,source:'authenticated_tool',artifactRef:'file://review'}}});
 assert.notEqual(out.reviewer_status,'independent_review');
});
test('implementer cannot review own artifact as an independent reviewer',()=>{
 const builderReview={...review,tool_or_actor:'builder'};
 const out=evaluateOutcome({...base,receipts:[artifact,builderReview],knownArtifacts:{'file://sample':true,'file://review':true},reviewerStatus:'independent_review',reviewerEvidence:{'review-receipt':{reviewerId:'builder',verified:true,source:'authenticated_tool',artifactRef:'file://review'}}});
 assert.notEqual(out.reviewer_status,'independent_review');
});
