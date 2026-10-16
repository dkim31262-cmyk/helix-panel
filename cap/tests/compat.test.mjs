import test from'node:test';import assert from'node:assert/strict';import{readFileSync}from'node:fs';import{createHash}from'node:crypto';import{forgeBridge,sense,ORIGIN}from'../../helix-contract.mjs';
test('single Helix contract and graph semantics remain true',()=>{
 const b=forgeBridge({job:'Create a bridge and find a path.',skill:'adventure',name:'Pakin',face:'Pakin',ingress:'pakin.ask',refuse:'not autonomous',seam:'keep one face',melody:'one voice'});
 assert.equal(b.type,'helix.bridge.v1');assert.equal(b.orchestration_graph,'chain');assert.equal(b.skill_graph,'fanout');assert.equal(sense('Create a bridge and find a path.').huddle,true);assert.equal(ORIGIN,'https://helix-panel-gamma.vercel.app');
});
test('root build and renderer do not import CAP and do not ship it',()=>{for(const f of ['helix-contract.mjs','render.mjs','test.mjs','build.mjs','evolution.js']){const s=readFileSync(new URL('../../'+f,import.meta.url),'utf8');assert(!s.includes('from "./cap/')&&!s.includes('from "../cap/'),f)}});
test('tracked CAP changes are isolated from pinned Helix main blob hashes even in shallow clones',()=>{
 const baseline={
  "helix-contract.mjs": "e297c8f5ccd83d46448558c27462e968c88d0246",
  "render.mjs": "927640ed72806ef5ad086964ded1dfac8ca03a6e",
  "index.html": "7b3e6f609242ea33ef688128097803929e1b0137",
  "mandate.txt": "1eaa926c13dcbca8bc4031efcc7ddeb110ea0861",
  "mandate.th.txt": "c6089be1884c312986404d13aa4d7364ef68c34f",
  "helix.schema.json": "00f02b192268c6d3d83edc243f7575d649ed3a9b",
  "evolution.js": "f7c5dcb2e187a1bcb7db33079795ba49257b710d",
  "evolution.html": "a781d3837680679c9d005413e06c0bfcce6ba45b",
  "test.mjs": "14189b220b69fc51f27e0e0d173e6242f5de90e1",
  "build.mjs": "6c2fc71dac33a1a368f4c3d3a8b8f4eac317f7e8",
  "vercel.json": "518e8dee786b3124c8cdcfac8ebdaa8bd38a7e3c"
};
 for(const [f,expected] of Object.entries(baseline)){
  const content=readFileSync(new URL('../../'+f,import.meta.url));
  const actual=createHash('sha1').update('blob '+content.length+'\0').update(content).digest('hex');
  assert.equal(actual,expected,'Protected Helix file changed: '+f);
 }
});

test('evidence packet exists and cannot claim independent review',()=>{
 const s=readFileSync(new URL('../../docs/superpowers/reviews/2026-10-16-helix-cap-workloop-v1-evidence.md',import.meta.url),'utf8');assert(s.includes('Independent review: NOT PERFORMED'));assert(s.includes('Work parity: NOT TESTED'));
});
