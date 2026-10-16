import {createHash} from 'node:crypto';
import {officialUrl} from './observatory-schema.mjs';
export const hashPage=s=>createHash('sha256').update(s).digest('hex');
export function normalizePage(body){
 return String(body).replace(/<!--[^]*?-->/g,' ').replace(/<(script|style|noscript)\b[^>]*>[^]*?<\/\1\s*>/gi,' ').replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();
}
export async function fetchOfficialSource(source,{fetchImpl=fetch,timeoutMs=15000,maxBytes=2000000}={}){
 if(!officialUrl(source.https_url,source.provider_id))throw new Error(source.source_id+': invalid official URL');
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),timeoutMs);
 let url=source.https_url;
 try{
  for(let redirectCount=0;redirectCount<=3;redirectCount++){
   const response=await fetchImpl(url,{redirect:'manual',signal:controller.signal,headers:{accept:'text/html, text/plain;q=0.5'}});
   if([301,302,303,307,308].includes(response.status)){
    if(redirectCount===3)throw new Error(source.source_id+': redirect limit exceeded');
    const location=response.headers.get('location');
    if(!location)throw new Error(source.source_id+': missing redirect URL');
    const next=new URL(location,url).href;
    if(!officialUrl(next,source.provider_id))throw new Error(source.source_id+': redirect host not permitted');
    url=next;continue;
   }
   if(!response.ok)throw new Error(source.source_id+': HTTP '+response.status);
   const type=response.headers.get('content-type')||'';
   if(!/^(text\/html|text\/plain)(;|$)/i.test(type))throw new Error(source.source_id+': unexpected content type');
   if(Number(response.headers.get('content-length'))>maxBytes)throw new Error(source.source_id+': response size exceeds limit');
   const reader=response.body?.getReader();if(!reader)throw new Error(source.source_id+': no readable body');
   const chunks=[];let bytes=0;
   while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.byteLength;if(bytes>maxBytes){await reader.cancel().catch(()=>{});throw new Error(source.source_id+': response size exceeds limit')}chunks.push(value)}
   const normalized=normalizePage(new TextDecoder().decode(Buffer.concat(chunks.map(x=>Buffer.from(x)))));
   if(!normalized)throw new Error(source.source_id+': empty normalized content');
   return{provider_id:source.provider_id,source_id:source.source_id,source_url:source.https_url,hash:hashPage(normalized),evidence_excerpt:normalized.slice(0,500)};
  }
  throw new Error(source.source_id+': redirect limit exceeded');
 }finally{clearTimeout(timer);controller.abort()}
}