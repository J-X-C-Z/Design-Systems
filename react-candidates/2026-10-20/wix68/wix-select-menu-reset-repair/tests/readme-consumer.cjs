'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),crypto=require('node:crypto'),{spawnSync}=require('node:child_process');
const root=path.resolve(process.env.PACKAGE_ROOT||path.join(__dirname,'..')),D=process.env.LOCAL_DEPENDENCIES;if(!D)throw Error('Existing LOCAL_DEPENDENCIES required');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),tracked=['package.json','README.md','src/styles.d.ts','src/index.d.ts','src/types.ts'].map(p=>path.join(root,p)),before=Object.fromEntries(tracked.map(p=>[p,sha(p)]));
const snippet=fs.readFileSync(path.join(root,'README.md'),'utf8').match(/```tsx\r?\n([\s\S]*?)```/)[1];
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'wix-multi-readme-')),cases=[];
try{
 fs.mkdirSync(path.join(temp,'node_modules/@studio'),{recursive:true});fs.symlinkSync(root,path.join(temp,'node_modules/@studio/wix-select-menu'));for(const d of ['react','react-dom','@types','csstype'])fs.symlinkSync(path.join(D,d),path.join(temp,'node_modules',d));
 fs.writeFileSync(path.join(temp,'package.json'),'{"type":"module"}');fs.writeFileSync(path.join(temp,'example.tsx'),snippet);
 for(const resolution of ['Bundler','NodeNext']){
  const file=path.join(temp,'tsconfig.json');fs.writeFileSync(file,JSON.stringify({compilerOptions:{target:'ES2022',module:resolution==='Bundler'?'ESNext':'NodeNext',moduleResolution:resolution,jsx:'react-jsx',strict:true,exactOptionalPropertyTypes:true,noUncheckedSideEffectImports:true,noEmit:true,skipLibCheck:false,types:['react','react-dom'],lib:['ES2022','DOM','DOM.Iterable']},files:['example.tsx']}));
  const r=spawnSync(process.execPath,[path.join(D,'typescript/bin/tsc'),'-p',file,'--pretty','false','--listFiles'],{encoding:'utf8',env:{...process.env,NODE_PATH:D}});const output=(r.stdout||'')+(r.stderr||'');const includesCssDeclaration=output.split(/\r?\n/).some(x=>x===path.join(root,'src/styles.d.ts'));cases.push({resolution,exitCode:r.status,includesCssDeclaration,output});
 }
 const drift=tracked.filter(p=>sha(p)!==before[p]),pass=cases.every(x=>x.exitCode===0&&x.includesCssDeclaration)&&!drift.length;
 const report=path.resolve(process.env.REPORT_PATH||path.join(__dirname,'../qa/readme-consumer.json'));fs.mkdirSync(path.dirname(report),{recursive:true});fs.writeFileSync(report,JSON.stringify({status:pass?'PASS':'FAIL',packageRoot:root,actualReadmeSnippet:snippet,ambientDeclarations:0,noUncheckedSideEffectImports:true,cases,inputs:before,drift},null,2)+'\n');console.log(JSON.stringify({status:pass?'PASS':'FAIL',checks:cases.length,report}));if(!pass)process.exitCode=1;
}finally{fs.rmSync(temp,{recursive:true,force:true});}
