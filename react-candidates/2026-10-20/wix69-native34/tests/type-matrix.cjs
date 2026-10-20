'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{spawnSync}=require('node:child_process');
const deps=process.env.LOCAL_DEPENDENCIES;if(!deps)throw Error('Existing LOCAL_DEPENDENCIES required');
const root=path.resolve(__dirname,'..'),pkg=path.resolve(process.env.PACKAGE_ROOT||root),reportFile=path.resolve(process.env.REPORT_PATH||path.join(root,'qa/types.json'));
const fixture=fs.readFileSync(path.join(__dirname,'types.tsx'),'utf8'),negatives=fixture.split('\n').flatMap((line,index)=>{const m=line.match(/^\/\/ @ts-expect-error (N\d+) (.+)$/);return m?[{id:m[1],reason:m[2],line:index+2}]:[];});
if(negatives.length!==48)throw Error('Expected full 48-case negative fixture.');
const readme=fs.readFileSync(path.join(pkg,'README.md'),'utf8').match(/```tsx\n([\s\S]*?)\n```/)[1];
const examples=['MealBrief.tsx','PaletteNativeSheet.tsx','palette-css.ts','styles.d.ts'];
const temp=fs.mkdtempSync(path.join(root,'qa/type-consumer-'));const rows=[];
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
function compile(cwd,config){const r=spawnSync(process.execPath,[path.join(deps,'typescript/bin/tsc'),'-p',config,'--pretty','false','--listFiles'],{cwd,encoding:'utf8',maxBuffer:10*1024*1024});return {code:r.status,output:(r.stdout||'')+(r.stderr||''),error:r.error?.message};}
try{
 for(const surface of ['source','exports'])for(const resolution of ['NodeNext','Bundler']){
  const cwd=path.join(temp,surface+'-'+resolution),staged=path.join(cwd,'node_modules/@studio/wix-native-multiple');fs.mkdirSync(path.join(staged,'src'),{recursive:true});
  for(const dep of ['react','react-dom','@types','csstype'])fs.symlinkSync(path.join(deps,dep),path.join(cwd,'node_modules',dep),'dir');
  const files=['package.json','src/types.ts','src/styles.d.ts','src/styles.css',surface==='source'?'src/index.tsx':'src/index.d.ts'];for(const file of files)fs.copyFileSync(path.join(pkg,file),path.join(staged,file));
  fs.writeFileSync(path.join(cwd,'package.json'),'{"type":"module"}');fs.writeFileSync(path.join(cwd,'types.tsx'),fixture);fs.writeFileSync(path.join(cwd,'readme.tsx'),readme);
  for(const example of examples)fs.copyFileSync(path.join(root,'examples',example),path.join(cwd,example));
  const config={compilerOptions:{target:'ES2022',module:resolution==='NodeNext'?'NodeNext':'ESNext',moduleResolution:resolution,strict:true,exactOptionalPropertyTypes:true,jsx:'react-jsx',noEmit:true,skipLibCheck:false,noUncheckedSideEffectImports:true,lib:['ES2022','DOM'],types:['react','react-dom'],...(surface==='source'?{paths:{'@studio/wix-native-multiple':['./node_modules/@studio/wix-native-multiple/src/index.tsx']}}:{})},files:['types.tsx','readme.tsx',...examples]};
  fs.writeFileSync(path.join(cwd,'tsconfig.json'),JSON.stringify(config));const r=compile(cwd,'tsconfig.json');const loaded=r.output.split(/\r?\n/).filter(f=>f.startsWith(staged));
  const chosen=surface==='source'?'src/index.tsx':'src/index.d.ts',other=surface==='source'?'src/index.d.ts':'src/index.tsx';
  const surfaceVerified=loaded.includes(path.join(staged,chosen))&&!loaded.includes(path.join(staged,other))&&!fs.existsSync(path.join(staged,other));
  const cssVerified=loaded.includes(path.join(staged,'src/styles.d.ts'));
  fs.writeFileSync(path.join(cwd,'unsuppressed.tsx'),fixture.replace(/^\/\/ @ts-expect-error /gm,'// Negative: '));fs.writeFileSync(path.join(cwd,'negative.json'),JSON.stringify({...config,files:['unsuppressed.tsx']}));const n=compile(cwd,'negative.json');
  const diagnostics=[...n.output.matchAll(/unsuppressed\.tsx\((\d+),(\d+)\): error (TS\d+): ([^\n]+)/g)].map(m=>({line:+m[1],code:m[3],message:m[4]}));
  const audited=negatives.map(row=>({...row,diagnostics:diagnostics.filter(d=>d.line===row.line)}));const negativeAudit=n.code!==0&&audited.every(row=>row.diagnostics.length>0)&&diagnostics.every(d=>negatives.some(row=>row.line===d.line));
  const stagedBytesVerified=files.every(f=>sha(path.join(pkg,f))===sha(path.join(staged,f)));const pass=r.code===0&&surfaceVerified&&cssVerified&&negativeAudit&&stagedBytesVerified;
  rows.push({name:surface+':'+resolution,status:pass?'PASS':'FAIL',strict:true,exactOptionalPropertyTypes:true,noUncheckedSideEffectImports:true,compileExit:r.code,diagnostics:r.output.split('\n').filter(s=>s.includes('error TS')),loadedSurface:loaded.map(f=>path.relative(staged,f)),surfaceVerified,cssVerified,stagedBytesVerified,negativeAudit,negativeCount:negatives.length,negativeCases:audited,readmeExact:true,examples});
 }
}finally{fs.rmSync(temp,{recursive:true,force:true});}
const report={status:rows.every(r=>r.status==='PASS')?'PASS':'FAIL',packageRoot:pkg,lanes:rows.length,negativeCasesPerLane:negatives.length,filtered:false,cases:rows};require('./report.cjs').writeReport(reportFile,report);console.log(JSON.stringify({status:report.status,lanes:rows.length,negativeCasesPerLane:negatives.length,report:reportFile}));if(report.status==='FAIL'){console.error(JSON.stringify(rows.filter(r=>r.status==='FAIL'),null,2));process.exitCode=1;}
