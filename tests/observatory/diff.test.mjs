import test from 'node:test';import assert from 'node:assert/strict';
import {applyObservations} from '../../scripts/observatory-diff.mjs';
const sources=[{provider_id:'openai',source_id:'openai-models',https_url:'https://developers.openai.com/api/docs/models/all',source_kind:'model_catalog',locale:'en',enabled:true,trust_level:'official'}];
const a={provider_id:'openai',source_id:'openai-models',source_url:sources[0].https_url,hash:'a'.repeat(64),evidence_excerpt:'first'};
const b={...a,hash:'b'.repeat(64),evidence_excerpt:'second'};
const blank={schema_version:'helix.model-signals.v1',generated_at:null,last_attempt_at:null,source_statuses:[],signals:[]};
const at='2026-10-16T03:17:00.000Z';
test('baseline is not breaking news; unchanged remains empty',()=>{
 const first=applyObservations(blank,sources,[a],at);
 assert.equal(first.signals.length,0);assert.equal(first.source_statuses[0].last_successful_hash,a.hash);
 const second=applyObservations(first,sources,[a],at);assert.equal(second.signals.length,0);
});
test('one changed document produces one candidate and no duplicates',()=>{
 const first=applyObservations(blank,sources,[a],at);
 const changed=applyObservations(first,sources,[b],at);
 assert.equal(changed.signals.length,1);assert.equal(changed.signals[0].status,'candidate');assert.equal(changed.signals[0].source_url,a.source_url);
 assert.equal(applyObservations(changed,sources,[b],at).signals.length,1);
});
test('failure preserves last verified hash and candidate history',()=>{
 const changed=applyObservations(applyObservations(blank,sources,[a],at),sources,[b],at);
 const failed=applyObservations(changed,sources,[{provider_id:'openai',source_id:'openai-models',error:'503'}],at);
 assert.deepEqual(failed.signals,changed.signals);assert.equal(failed.source_statuses[0].last_successful_hash,b.hash);assert.match(failed.source_statuses[0].last_error,/503/);
});