import{validateCapRecord}from'../schema/validate.mjs';
const permitted={framed:['routed','blocked','awaiting_approval'],routed:['in_progress','blocked','awaiting_approval'],in_progress:['verifying','blocked','awaiting_approval','done_partial'],verifying:['done_verified','done_partial','in_progress','blocked','awaiting_approval'],blocked:['routed'],awaiting_approval:['routed'],done_partial:[],done_verified:[]};
const privacy={public_synthetic:0,private:1,sensitive:2};
export function advanceCheckpoint(previous,{event,receiptIds=[],blockedItems=[],nextAction,at,nextId,privacy_scope}){
 validateCapRecord('checkpoint',previous);
 if(!permitted[previous.state]?.includes(event))throw new TypeError('illegal state transition');
 if(!nextId||nextId===previous.id)throw new TypeError('immutable checkpoint id required');
 if(!Number.isFinite(Date.parse(at))||!at.endsWith('Z')||Date.parse(at)<Date.parse(previous.updated_at))throw new TypeError('invalid checkpoint time');
 const scope=privacy_scope??previous.privacy_scope;
 if(privacy[scope]<privacy[previous.privacy_scope])throw new TypeError('privacy downgrade denied');
 return validateCapRecord('checkpoint',{...previous,id:nextId,created_at:at,updated_at:at,previous_checkpoint_id:previous.id,sequence:previous.sequence+1,provenance:{kind:'policy_derived',reference:'cap/policy/checkpoint.mjs'},state:event,privacy_scope:scope,completed_receipt_refs:[...new Set([...previous.completed_receipt_refs,...receiptIds])],blocked_items:blockedItems,next_action:nextAction});
}
export function checkResume(checkpoint,{resolvedRefs={},permissionsFresh=false,sourceFresh=false,nowIso}){
 validateCapRecord('checkpoint',checkpoint);
 if(!Number.isFinite(Date.parse(nowIso))||!nowIso.endsWith('Z'))throw new TypeError('nowIso required');
 const staleRefs=checkpoint.branch_or_artifact_refs.filter(ref=>!resolvedRefs[ref]);
 const reason=staleRefs.length?'stale or unresolved references':!permissionsFresh?'permissions not confirmed':!sourceFresh?'source stale':['done_verified','done_partial'].includes(checkpoint.state)?'terminal checkpoint':'ready';
 return{canResume:reason==='ready',staleRefs,reason};
}
