import Ajv2020 from'ajv/dist/2020.js';import addFormats from'ajv-formats';import{readFileSync}from'node:fs';
const kinds=['task','capabilities','route','receipt','checkpoint','outcome'];
const ajv=new Ajv2020({allErrors:true,strict:true,coerceTypes:false,removeAdditional:false});addFormats(ajv);
const validators=new Map(kinds.map(k=>[k,ajv.compile(JSON.parse(readFileSync(new URL('./'+k+'.v1.json',import.meta.url),'utf8')))]));
export function validateCapRecord(kind,input){const v=validators.get(kind);if(!v)throw new TypeError('Unknown CAP record kind: '+kind);if(!v(input))throw new TypeError('Invalid '+kind+': '+ajv.errorsText(v.errors,{separator:'; '}));return input}
