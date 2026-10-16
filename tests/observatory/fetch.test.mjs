import test from 'node:test';import assert from 'node:assert/strict';
import {fetchOfficialSource,normalizePage,hashPage} from '../../scripts/observatory-fetch.mjs';
const source={provider_id:'openai',source_id:'openai-models',https_url:'https://developers.openai.com/api/docs/models/all'};
const response=(body,init={})=>new Response(body,{status:200,headers:{'content-type':'text/html'},...init});
test('conservative normalization yields stable hash',()=>{
 assert.equal(hashPage(normalizePage('<html><script>alert(1)</script><b>Alpha</b>  Beta</html>')),hashPage('Alpha Beta'));
 assert.notEqual(hashPage('Alpha'),hashPage('Beta'));
});
test('bounded fetch returns source-linked fingerprint',async()=>{
 const result=await fetchOfficialSource(source,{fetchImpl:async()=>response('<b>Models updated</b>')});
 assert.equal(result.provider_id,'openai');assert.match(result.hash,/^[a-f0-9]{64}$/);assert.equal(result.evidence_excerpt,'Models updated');
});
test('redirect must be same official HTTPS origin and at most 3',async()=>{
 let count=0;const fetchImpl=async()=>{count++;return new Response(null,{status:302,headers:{location:'https://evil.example/stolen'}})};
 await assert.rejects(()=>fetchOfficialSource(source,{fetchImpl}),/redirect.*host|not permitted/i);assert.equal(count,1);
 let hops=0;await assert.rejects(()=>fetchOfficialSource(source,{fetchImpl:async()=>{hops++;return new Response(null,{status:302,headers:{location:'/next'}})}}),/redirect limit/i);assert.equal(hops,4);
});
test('failed status and size limit do not yield success',async()=>{
 await assert.rejects(()=>fetchOfficialSource(source,{fetchImpl:async()=>new Response('oops',{status:503})}),/503/);
 await assert.rejects(()=>fetchOfficialSource(source,{fetchImpl:async()=>response('0123456789'),maxBytes:4}),/size/i);
 await assert.rejects(()=>fetchOfficialSource(source,{fetchImpl:async()=>response('blob',{headers:{'content-type':'application/pdf'}})}),/content type/i);
});