import {hashPage} from './observatory-fetch.mjs';
import {validateSources,validateSignals} from './observatory-schema.mjs';
const makeStatus=s=>({provider_id:s.provider_id,source_id:s.source_id,source_url:s.https_url,last_attempt_at:null,last_successful_check_at:null,last_successful_hash:null,last_error:null});
export function applyObservations(previous,sources,results,nowIso){
 validateSources(sources);validateSignals(previous,sources);
 if(Number.isNaN(Date.parse(nowIso))||!nowIso.endsWith('Z'))throw new Error('Invalid current date');
 const latest=new Map(results.map(r=>[r.source_id,r]));
 const previousStatuses=new Map(previous.source_statuses.map(s=>[s.source_id,s]));
 const signals=new Map(previous.signals.map(s=>[s.id,s]));const statuses=[];
 for(const src of sources){
  const s={...(previousStatuses.get(src.source_id)||makeStatus(src))};const event=latest.get(src.source_id);
  if(!src.enabled){statuses.push(s);continue}
  s.last_attempt_at=nowIso;
  if(!event||event.error){s.last_error=String(event?.error||'missing observation').slice(0,160);statuses.push(s);continue}
  if(!/^[0-9a-f]{64}$/.test(event.hash)||event.source_url!==src.https_url||event.provider_id!==src.provider_id){s.last_error='invalid source observation';statuses.push(s);continue}
  if(s.last_successful_hash!==null&&s.last_successful_hash!==event.hash){
   const id=hashPage(src.provider_id+'|'+src.source_id+'|'+s.last_successful_hash+'|'+event.hash);
   if(!signals.has(id))signals.set(id,{id,provider_id:src.provider_id,source_id:src.source_id,source_url:src.https_url,first_seen_at:nowIso,last_seen_at:nowIso,observed_at:nowIso,hash:event.hash,event_type:'official_source_changed',status:'candidate',evidence_excerpt:String(event.evidence_excerpt||'').slice(0,500)});
  }
  s.last_successful_hash=event.hash;s.last_successful_check_at=nowIso;s.last_error=null;statuses.push(s);
 }
 const output={schema_version:'helix.model-signals.v1',generated_at:nowIso,last_attempt_at:nowIso,source_statuses:statuses,signals:[...signals.values()].sort((a,b)=>b.first_seen_at.localeCompare(a.first_seen_at)||a.id.localeCompare(b.id)).slice(0,100)};
 return validateSignals(output,sources);
}