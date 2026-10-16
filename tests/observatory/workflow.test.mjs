import test from'node:test';import assert from'node:assert/strict';import{readFileSync}from'node:fs';
test('scheduled job is restricted to candidate JSON writes and protected checks',()=>{
 const s=readFileSync('.github/workflows/model-observatory.yml','utf8');
 assert.match(s,/workflow_dispatch:/);assert.match(s,/17 3 \* \* \*/);assert.match(s,/node-version:\s*24/);
 assert.match(s,/git add -- data\/model-signals\.json/);assert.doesNotMatch(s,/git add\s+(?:-A|\.)/);
 assert.match(s,/node test\.mjs/);assert.match(s,/github\.ref == 'refs\/heads\/main'/);
 assert.match(s,/contents:\s*write/);assert.doesNotMatch(s,/secrets\.[A-Za-z_]*API/i);
});