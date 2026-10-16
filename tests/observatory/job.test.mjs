import test from 'node:test';import assert from 'node:assert/strict';import{mkdtempSync,writeFileSync,readFileSync}from'node:fs';import{tmpdir}from'node:os';import{join}from'node:path';
import{runObservatory}from'../../scripts/check-model-sources.mjs';
const make=()=>{const dir=mkdtempSync(join(tmpdir(),'helix-observe-')),sourcesPath=join(dir,'sources.json'),signalsPath=join(dir,'signals.json');writeFileSync(sourcesPath,JSON.stringify([{provider_id:'openai',source_id:'openai-models',https_url:'https://developers.openai.com/api/docs/models/all',source_kind:'model_catalog',locale:'en',enabled:true,trust_level:'official'}]));writeFileSync(signalsPath,JSON.stringify({schema_version:'helix.model-signals.v1',generated_at:null,last_attempt_at:null,source_statuses:[],signals:[]}));return{sourcesPath,signalsPath}};
const sourceResult=hash=>({provider_id:'openai',source_id:'openai-models',source_url:'https://developers.openai.com/api/docs/models/all',hash:hash.repeat(64),evidence_excerpt:'Example'});
test('collector records baseline then candidate then outage without loss',async()=>{
 const {sourcesPath,signalsPath}=make();const now=new Date('2026-10-16T03:17:00.000Z');
 const a=await runObservatory({sourcesPath,signalsPath,now,fetchSource:async()=>sourceResult('a')});assert.equal(a.changed,0);
 const b=await runObservatory({sourcesPath,signalsPath,now,fetchSource:async()=>sourceResult('b')});assert.equal(b.changed,1);
 const c=await runObservatory({sourcesPath,signalsPath,now,fetchSource:async()=>{throw new Error('upstream offline')}});assert.equal(c.failed,1);
 const saved=JSON.parse(readFileSync(signalsPath,'utf8'));assert.equal(saved.signals.length,1);assert.match(saved.source_statuses[0].last_error,/upstream offline/);
});
test('collector never writes other paths',async()=>{
 const {sourcesPath,signalsPath}=make(),sentinel=join(signalsPath,'..','approved-models.json');writeFileSync(sentinel,'do not change');
 await runObservatory({sourcesPath,signalsPath,fetchSource:async()=>sourceResult('a')});assert.equal(readFileSync(sentinel,'utf8'),'do not change');
});