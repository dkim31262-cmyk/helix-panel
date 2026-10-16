import test from'node:test';import assert from'node:assert/strict';import{readFileSync}from'node:fs';import{execFileSync}from'node:child_process';import{forgeBridge,sense,ORIGIN}from'../../helix-contract.mjs';
test('single Helix contract and graph semantics remain true',()=>{
 const b=forgeBridge({job:'Create a bridge and find a path.',skill:'adventure',name:'Pakin',face:'Pakin',ingress:'pakin.ask',refuse:'not autonomous',seam:'keep one face',melody:'one voice'});
 assert.equal(b.type,'helix.bridge.v1');assert.equal(b.orchestration_graph,'chain');assert.equal(b.skill_graph,'fanout');assert.equal(sense('Create a bridge and find a path.').huddle,true);assert.equal(ORIGIN,'https://helix-panel-gamma.vercel.app');
});
test('root build and renderer do not import CAP and do not ship it',()=>{for(const f of ['helix-contract.mjs','render.mjs','test.mjs','build.mjs','evolution.js']){const s=readFileSync(new URL('../../'+f,import.meta.url),'utf8');assert(!s.includes('from "./cap/')&&!s.includes('from "../cap/'),f)}});
test('tracked CAP changes are isolated from Helix core files',()=>{
 const forbidden=['helix-contract.mjs','render.mjs','index.html','mandate.txt','mandate.th.txt','helix.schema.json','evolution.js','evolution.html','test.mjs','build.mjs','vercel.json'];
 const changed=execFileSync('git',['diff','--name-only','HEAD~7...HEAD'],{encoding:'utf8'}).trim().split('\n');
 for(const f of forbidden)assert(!changed.includes(f),'Protected file changed: '+f);
});
test('evidence packet exists and cannot claim independent review',()=>{
 const s=readFileSync(new URL('../../docs/superpowers/reviews/2026-10-16-helix-cap-workloop-v1-evidence.md',import.meta.url),'utf8');assert(s.includes('Independent review: NOT PERFORMED'));assert(s.includes('Work parity: NOT TESTED'));
});
