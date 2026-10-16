import test from 'node:test';
import assert from 'node:assert/strict';
import {validateSources,validateSignals,validateApprovedModels} from '../../scripts/observatory-schema.mjs';
const source={provider_id:'openai',source_id:'openai-models',https_url:'https://developers.openai.com/api/docs/models/all',source_kind:'model_catalog',locale:'en',enabled:true,trust_level:'official'};
const sources=[source];
const status={provider_id:'openai',source_id:'openai-models',source_url:source.https_url,last_attempt_at:null,last_successful_check_at:null,last_successful_hash:null,last_error:null};
const empty={schema_version:'helix.model-signals.v1',generated_at:null,last_attempt_at:null,source_statuses:[status],signals:[]};
const approved={schema_version:'helix.approved-models.v1',models:[]};
test('only expected official sources are accepted',()=>{
 assert.equal(validateSources(sources).length,1);
 for(const bad of ['http://developers.openai.com/api/docs/models/all','https://localhost/foo','https://127.0.0.1/foo','https://user:pass@developers.openai.com/','https://evil.example/x'])assert.throws(()=>validateSources([{...source,https_url:bad}]));
 assert.throws(()=>validateSources([source,source]));
 assert.throws(()=>validateSources([{...source,provider_id:'fake'}]));
});
test('empty initial data is valid; validation rejects dishonest signals',()=>{
 assert.deepEqual(validateSignals(empty,sources),empty);
 const signal={id:'a'.repeat(64),provider_id:'openai',source_id:'openai-models',source_url:source.https_url,first_seen_at:'2026-10-16T00:00:00.000Z',last_seen_at:'2026-10-16T00:00:00.000Z',observed_at:'2026-10-16T00:00:00.000Z',hash:'b'.repeat(64),event_type:'official_source_changed',status:'candidate',evidence_excerpt:'docs changed'};
 assert.equal(validateSignals({...empty,signals:[signal]},sources).signals.length,1);
 assert.throws(()=>validateSignals({...empty,signals:[signal,signal]},sources));
 assert.throws(()=>validateSignals({...empty,signals:[{...signal,source_url:'https://fake.example'}]},sources));
 assert.throws(()=>validateSignals({...empty,signals:[{...signal,status:'verified'}]},sources));
 assert.throws(()=>validateSignals({...empty,signals:[{...signal,observed_at:'not a date'}]},sources));
 assert.throws(()=>validateSignals({...empty,api_key:'private'},sources));
});
test('approved registry is manual and source-backed',()=>{
 assert.deepEqual(validateApprovedModels(approved,sources),approved);
 const model={provider_id:'openai',model_id:'example',display_name:'Example',capabilities:['text'],source_urls:[source.https_url],verified_at:'2026-10-16T00:00:00.000Z',api_access_claim:'unknown',active_for_advice:false,superseded_by:null};
 assert.equal(validateApprovedModels({...approved,models:[model]},sources).models.length,1);
 assert.throws(()=>validateApprovedModels({...approved,models:[{...model,source_urls:[]}]},sources));
 assert.throws(()=>validateApprovedModels({...approved,models:[{...model,api_access_claim:'free_for_moon'}]},sources));
});