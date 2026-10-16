import{readFileSync,writeFileSync,renameSync,rmSync}from'node:fs';import{resolve}from'node:path';import{fileURLToPath}from'node:url';
import{validateSources,validateSignals}from'./observatory-schema.mjs';
import{fetchOfficialSource}from'./observatory-fetch.mjs';import{applyObservations}from'./observatory-diff.mjs';
export function writeSignalsAtomic(path,doc,sources){
 validateSignals(doc,sources);const tmp=path+'.tmp-'+process.pid;
 try{writeFileSync(tmp,JSON.stringify(doc,null,2)+'\n',{flag:'wx'});renameSync(tmp,path)}finally{rmSync(tmp,{force:true})}
}
export async function runObservatory({sourcesPath='config/model-sources.json',signalsPath='data/model-signals.json',fetchSource=fetchOfficialSource,now=new Date()}={}){
 const sources=validateSources(JSON.parse(readFileSync(sourcesPath,'utf8')));
 const previous=validateSignals(JSON.parse(readFileSync(signalsPath,'utf8')),sources);
 const enabled=sources.filter(s=>s.enabled);
 const results=await Promise.all(enabled.map(async s=>{try{return await fetchSource(s)}catch(error){return{provider_id:s.provider_id,source_id:s.source_id,error:String(error.message||error)}}}));
 const output=applyObservations(previous,sources,results,now.toISOString());
 writeSignalsAtomic(signalsPath,output,sources);
 const failed=results.filter(r=>r.error).length;
 return{checked:enabled.length,ok:enabled.length-failed,failed,changed:output.signals.filter(s=>!previous.signals.some(p=>p.id===s.id)).length,output};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 runObservatory().then(r=>{console.log('Sources checked: '+r.checked+'; okay: '+r.ok+'; failed: '+r.failed+'; new candidate changes: '+r.changed);if(r.failed)process.exitCode=1}).catch(e=>{console.error('Observatory failed:',e.message);process.exitCode=1});
}