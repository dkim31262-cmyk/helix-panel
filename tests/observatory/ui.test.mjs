import test from 'node:test';import assert from 'node:assert/strict';
import {pulseViewModel,loadPulse,renderPulse} from '../../observatory-ui.mjs';
const source_url='https://developers.openai.com/api/docs/models/all';
const statuses=[{provider_id:'openai',source_id:'openai-models',source_url,last_attempt_at:'2026-10-16T03:17:00.000Z',last_successful_check_at:'2026-10-16T03:17:00.000Z',last_successful_hash:'a'.repeat(64),last_error:null}];
const signals={schema_version:'helix.model-signals.v1',generated_at:'2026-10-16T03:17:00.000Z',last_attempt_at:'2026-10-16T03:17:00.000Z',source_statuses:statuses,signals:[]};
const approved={schema_version:'helix.approved-models.v1',models:[]};
test('freshness is based on last successful observation',()=>{
 assert.equal(pulseViewModel(signals,approved,Date.parse('2026-10-17T03:17:00Z')).stale,false);
 assert.equal(pulseViewModel(signals,approved,Date.parse('2026-10-18T03:17:01Z')).stale,true);
 assert.equal(pulseViewModel({...signals,source_statuses:[{...statuses[0],last_error:'503'}]},approved,Date.now()).failedSources,1);
});
test('candidates are not promoted into verified facts',()=>{
 const model=pulseViewModel({...signals,signals:[{id:'b'.repeat(64),source_id:'openai-models',provider_id:'openai',source_url,first_seen_at:statuses[0].last_attempt_at,last_seen_at:statuses[0].last_attempt_at,observed_at:statuses[0].last_attempt_at,hash:'c'.repeat(64),event_type:'official_source_changed',status:'candidate',evidence_excerpt:'<img src=x onerror=alert(1)>'}]},approved,Date.now());
 assert.equal(model.entries[0].label,'Candidate source change');
});
test('fetches first-party files only',async()=>{
 const calls=[];const out=await loadPulse(async url=>{calls.push(url);return{ok:true,json:async()=>url.includes('signals')?signals:approved}});
 assert.deepEqual(calls,['/model-signals.json','/approved-models.json']);assert.equal(out.signals.schema_version,signals.schema_version);
});
test('external HTML is treated as text, never rendered as script',()=>{
 const nodes=[];function node(tag){const n={tag,children:[],setAttribute(k,v){this[k]=v},append(...v){this.children.push(...v)},replaceChildren(...v){this.children=v},textContent:''};nodes.push(n);return n}
 const root=node('root'),doc={createElement:node};const m=pulseViewModel({...signals,signals:[{id:'b'.repeat(64),source_id:'openai-models',provider_id:'openai',source_url,first_seen_at:statuses[0].last_attempt_at,last_seen_at:statuses[0].last_attempt_at,observed_at:statuses[0].last_attempt_at,hash:'c'.repeat(64),event_type:'official_source_changed',status:'candidate',evidence_excerpt:'<script>alert(1)</script>'}]},approved,Date.now());
 renderPulse(root,m,doc);assert.equal(nodes.filter(n=>n.tag==='script').length,0);assert(nodes.some(n=>n.textContent.includes('<script>')));
});