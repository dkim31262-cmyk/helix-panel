const SAFE_HOSTS=new Set(['developers.openai.com','platform.claude.com','ai.google.dev','docs.x.ai','docs.dev.runwayml.com']);
const formatTime=v=>v?new Date(v).toLocaleString('th-TH',{dateStyle:'medium',timeStyle:'short',timeZone:'UTC'})+' UTC':'never / ยังไม่เคยตรวจ';
const safeUrl=v=>{try{const u=new URL(v);return u.protocol==='https:'&&!u.username&&!u.password&&SAFE_HOSTS.has(u.hostname)}catch{return false}};
export function pulseViewModel(signals,approved,nowMs=Date.now()){
 if(signals?.schema_version!=='helix.model-signals.v1'||approved?.schema_version!=='helix.approved-models.v1'||!Array.isArray(signals.signals)||!Array.isArray(signals.source_statuses)||!Array.isArray(approved.models))throw new Error('invalid public AI feed');
 const successes=signals.source_statuses.map(s=>s.last_successful_check_at).filter(Boolean).map(Date.parse).filter(Number.isFinite);
 const latest=successes.length?Math.max(...successes):null;
 const stale=latest===null||nowMs-latest>48*60*60*1000;
 const failedSources=signals.source_statuses.filter(s=>s.last_error!==null).length;
 const entries=signals.signals.filter(s=>s.status==='candidate'&&safeUrl(s.source_url)).slice(0,12).map(s=>({provider:String(s.provider_id),source_url:s.source_url,when:s.observed_at,label:'Candidate source change',excerpt:String(s.evidence_excerpt||'').slice(0,500)}));
 return{entries,failedSources,stale,lastSuccessAt:latest===null?null:new Date(latest).toISOString(),emptyReason:signals.source_statuses.length?'No new source changes observed among checked sources / ยังไม่พบการเปลี่ยนแปลงในแหล่งที่ตรวจ':'No checks yet / ยังไม่มีข้อมูลจากการตรวจ'};
}
export async function loadPulse(fetchImpl=fetch){
 const [s,a]=await Promise.all(['/model-signals.json','/approved-models.json'].map(async url=>{const response=await fetchImpl(url,{cache:'no-store'});if(!response.ok)throw new Error('AI feed unavailable');return response.json()}));
 pulseViewModel(s,a);return{signals:s,approved:a};
}
const txt=(doc,tag,value)=>{const e=doc.createElement(tag);e.textContent=String(value);return e};
export function renderPulse(root,model,doc=document){
 const heading=txt(doc,'h3','AI Pulse · Model Observatory');heading.style&&(heading.style.margin='0 0 8px');
 const state=txt(doc,'p',(model.stale?'STALE / ข้อมูลเกิน 48 ชม.':'CHECKED / ตรวจแล้ว')+' · last success: '+formatTime(model.lastSuccessAt)+' · failed: '+model.failedSources);
 const info=txt(doc,'p','Official page changes are candidates, not confirmed new models, account access or benchmark results.');
 const wrapper=doc.createElement('div');wrapper.append(heading,state,info);
 if(model.entries.length===0)wrapper.append(txt(doc,'p',model.emptyReason));
 for(const entry of model.entries){
  const article=doc.createElement('article');article.append(txt(doc,'strong',entry.provider+' · '+entry.label),txt(doc,'p','Observed '+formatTime(entry.when)),txt(doc,'p',entry.excerpt));
  if(safeUrl(entry.source_url)){const link=txt(doc,'a','Official source ↗');link.href=entry.source_url;link.target='_blank';link.rel='noopener noreferrer';article.append(link)}
  wrapper.append(article);
 }
 root.replaceChildren(wrapper);
}
export async function bootPulse({fetchImpl=fetch,root=document.querySelector('#ai-pulse'),doc=document,nowMs=Date.now()}={}){
 if(!root)return;
 try{const data=await loadPulse(fetchImpl);renderPulse(root,pulseViewModel(data.signals,data.approved,nowMs),doc)}
 catch(err){root.replaceChildren(txt(doc,'p','Feed unavailable / ข้อมูลล่าสุดยังไม่พร้อม · โปรดดูรายการย้อนหลังด้านล่าง'))}
}
if(typeof document!=='undefined'){
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>bootPulse());else bootPulse();
}