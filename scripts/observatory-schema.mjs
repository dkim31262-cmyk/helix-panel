const OFFICIAL=Object.freeze({openai:['developers.openai.com'],anthropic:['platform.claude.com'],google:['ai.google.dev'],xai:['docs.x.ai'],runway:['docs.dev.runwayml.com']});
const HASH=/^[0-9a-f]{64}$/;
const OBJECT=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const fail=m=>{throw new Error('Invalid observatory data: '+m);};
const check=(v,m)=>{if(!v)fail(m);};
const keys=(o,a)=>check(Object.keys(o).every(k=>a.includes(k)),'unexpected field');
const str=(v,max=300)=>typeof v==='string'&&v.length>0&&v.length<=max;
const date=(v,n=false)=>n&&v===null||typeof v==='string'&&/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(v)&&!Number.isNaN(Date.parse(v));
const token=v=>str(v,80)&&/^[a-z0-9][a-z0-9-]*$/.test(v);
export function officialUrl(url,provider){
 if(!str(url,1000)||!Object.hasOwn(OFFICIAL,provider))return false;
 try{const u=new URL(url);return u.protocol==='https:'&&!u.username&&!u.password&&!u.port&&OFFICIAL[provider].includes(u.hostname)&&!u.hash}catch{return false}
}
export function validateSources(input){
 check(Array.isArray(input)&&input.length>0&&input.length<=50,'source array');const seen=new Set();
 for(const x of input){
  check(OBJECT(x),'source record');keys(x,['provider_id','source_id','https_url','source_kind','locale','enabled','trust_level']);
  check(token(x.provider_id)&&Object.hasOwn(OFFICIAL,x.provider_id),'provider');
  check(token(x.source_id)&&!seen.has(x.source_id),'unique source id');seen.add(x.source_id);
  check(officialUrl(x.https_url,x.provider_id),'official HTTPS source url');
  check(['model_catalog','changelog','release_notes','api_docs'].includes(x.source_kind),'source_kind');
  check(x.locale==='en'&&typeof x.enabled==='boolean'&&x.trust_level==='official','source properties');
 }return input;
}
export function validateSignals(input,sources){
 validateSources(sources);check(OBJECT(input),'signals document');
 keys(input,['schema_version','generated_at','last_attempt_at','source_statuses','signals']);
 check(input.schema_version==='helix.model-signals.v1'&&date(input.generated_at,true)&&date(input.last_attempt_at,true),'schema or date');
 check(Array.isArray(input.source_statuses)&&input.source_statuses.length<=50,'source statuses');
 check(Array.isArray(input.signals)&&input.signals.length<=100,'signals list');
 const lookup=new Map(sources.map(s=>[s.source_id,s]));const statusIds=new Set(),signalIds=new Set();
 for(const s of input.source_statuses){
  check(OBJECT(s),'status object');keys(s,['provider_id','source_id','source_url','last_attempt_at','last_successful_check_at','last_successful_hash','last_error']);
  const known=lookup.get(s.source_id);
  check(known&&s.provider_id===known.provider_id&&s.source_url===known.https_url&&!statusIds.has(s.source_id),'status source correspondence');statusIds.add(s.source_id);
  check(date(s.last_attempt_at,true)&&date(s.last_successful_check_at,true),'status dates');
  check(s.last_successful_hash===null||HASH.test(s.last_successful_hash),'status hash');
  check(s.last_error===null||str(s.last_error,160),'last error');
 }
 for(const s of input.signals){
  check(OBJECT(s),'signal object');keys(s,['id','provider_id','source_id','source_url','first_seen_at','last_seen_at','observed_at','hash','event_type','status','evidence_excerpt']);
  const known=lookup.get(s.source_id);check(known&&s.provider_id===known.provider_id&&s.source_url===known.https_url,'signal source correspondence');
  check(HASH.test(s.id)&&HASH.test(s.hash)&&!signalIds.has(s.id),'signal hashes and unique id');signalIds.add(s.id);
  check(date(s.first_seen_at)&&date(s.last_seen_at)&&date(s.observed_at),'signal dates');
  check(s.event_type==='official_source_changed'&&s.status==='candidate','candidate only');
  check(s.evidence_excerpt===undefined||typeof s.evidence_excerpt==='string'&&s.evidence_excerpt.length<=500,'safe excerpt length');
 }return input;
}
export function validateApprovedModels(input,sources){
 validateSources(sources);check(OBJECT(input),'approved models document');keys(input,['schema_version','models']);
 check(input.schema_version==='helix.approved-models.v1'&&Array.isArray(input.models)&&input.models.length<=300,'approved model envelope');
 const seen=new Set();
 for(const m of input.models){
  check(OBJECT(m),'approved model object');keys(m,['provider_id','model_id','display_name','capabilities','source_urls','verified_at','api_access_claim','active_for_advice','superseded_by']);
  check(token(m.provider_id)&&str(m.model_id)&&str(m.display_name,120),'model identity');
  const id=m.provider_id+':'+m.model_id;check(!seen.has(id),'unique model');seen.add(id);
  check(Array.isArray(m.capabilities)&&m.capabilities.every(v=>token(v)),'capabilities');
  check(Array.isArray(m.source_urls)&&m.source_urls.length>0&&m.source_urls.every(u=>sources.some(s=>s.provider_id===m.provider_id&&s.https_url===u)),'approved sources');
  check(date(m.verified_at)&&['unknown','documented_api','restricted_api'].includes(m.api_access_claim)&&typeof m.active_for_advice==='boolean','claim or date');
  check(m.superseded_by===null||str(m.superseded_by,200),'supersession');
 }return input;
}