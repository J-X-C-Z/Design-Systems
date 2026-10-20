import {build} from 'esbuild';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
const R=path.resolve(new URL('..',import.meta.url).pathname), mode=process.argv[2]||'all';
const suites=mode==='all'?['disclosure','scalar','host','next-disclosure','next-buttons','next-selection','third-buttons','third-selection','fourth-buttons','fourth-selection','copy-name-fix']:[mode];
if(suites.some(x=>!['disclosure','scalar','host','next-disclosure','next-buttons','next-selection','third-buttons','third-selection','fourth-buttons','fourth-selection','copy-name-fix'].includes(x)))throw Error('Unknown suite');
const tag=new Date().toISOString().replace(/[:.]/g,'-'),out=path.join(R,'evidence',tag+'-'+mode);
await fs.mkdir(out,{recursive:true});await fs.mkdir(R+'/.test-build',{recursive:true});
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');let failed=false;const results=[];
for(const suite of suites){
 const entry=suite==='host'?'tools/test-entry.jsx':suite==='copy-name-fix'?'src/fourth-buttons/index.jsx':`src/${suite}/index.jsx`;
 const bundle=R+`/.test-build/${suite}.mjs`;
 const compiled=await build({absWorkingDir:R,entryPoints:[entry],outfile:bundle,bundle:true,format:'esm',platform:'node',jsx:'automatic',packages:'external',metafile:true});
 const inputs=[];for(const name of Object.keys(compiled.metafile.inputs).sort()){const b=await fs.readFile(path.resolve(R,name));inputs.push({path:name,bytes:b.length,sha256:sha(b)});}
 const command=[`--max-old-space-size=256`,R+'/tools/test-child.mjs',suite,bundle];
 const run=spawnSync(process.execPath,command,{cwd:R,env:{...process.env,NODE_ENV:'development'},encoding:'utf8',maxBuffer:8*1024*1024,timeout:180000});
 await fs.writeFile(out+'/'+suite+'.stdout.log',run.stdout||'');await fs.writeFile(out+'/'+suite+'.stderr.log',run.stderr||'');
 const result={suite,exitCode:run.status,signal:run.signal,error:run.error?.message||null,inputs,bundleSHA256:sha(await fs.readFile(bundle)),testSHA256:sha(await fs.readFile(R+`/tests/${suite}-tests.cjs`)),stdout:run.stdout?.trim(),browser:false};
 await fs.writeFile(out+'/'+suite+'.json',JSON.stringify(result,null,2)+'\n');results.push(result);
 console.log(suite,run.status,run.stdout?.trim());if(run.status!==0){console.error(run.stderr||run.error);failed=true;break;}
}
await fs.writeFile(out+'/SUMMARY.json',JSON.stringify({schema:1,kind:'author React/JSDOM tests',timestamp:tag,passed:!failed,suites:results.map(({inputs,stdout,...x})=>x),browser:false,realIME:false,realLayout:false},null,2)+'\n');
console.log('Evidence:',out);process.exitCode=failed?1:0;
