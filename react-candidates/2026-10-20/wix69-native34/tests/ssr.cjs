'use strict';
process.env.NODE_ENV='production';
const fs=require('node:fs'),path=require('node:path'),Module=require('node:module'),crypto=require('node:crypto'),assert=require('node:assert/strict'),{pathToFileURL}=require('node:url');
const deps=process.env.LOCAL_DEPENDENCIES;if(!deps)throw Error('Existing dependencies required.');process.env.NODE_PATH=deps;Module.Module._initPaths();
const root=path.resolve(__dirname,'..'),pkg=path.resolve(process.env.PACKAGE_ROOT||root),temp=fs.mkdtempSync(path.join(root,'qa/ssr-consumer-'));
const React=require(path.join(deps,'react')),h=React.createElement,{renderToString}=require(path.join(deps,'react-dom/server')),{JSDOM}=require(path.join(deps,'jsdom'));
const cases=[];let assertions=0;const eq=(a,b)=>{assertions++;assert.deepEqual(a,b);};const ok=a=>{assertions++;assert.ok(a);};
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function compileSource(){const file=path.join(pkg,'src/index.tsx'),compiled=require(path.join(deps,'esbuild')).buildSync({entryPoints:[file],bundle:true,format:'cjs',platform:'node',external:['react','react-dom'],write:false,logLevel:'error'}).outputFiles[0].text;const m=new Module(file,module);m.filename=file;m.paths=Module.Module._nodeModulePaths(path.dirname(file));m._compile(compiled,file);return m.exports;}
(async()=>{try{
 fs.mkdirSync(path.join(temp,'node_modules'),{recursive:true});for(const dep of ['react','react-dom'])fs.symlinkSync(path.join(deps,dep),path.join(temp,'node_modules',dep),'dir');
 // Copy only the exact ESM file into an isolated peer-resolution harness. No build or dependency copy.
 const esmBytes=fs.readFileSync(path.join(pkg,'dist/index.js')),esmFile=path.join(temp,'index.mjs');fs.writeFileSync(esmFile,esmBytes);eq(sha(esmBytes),sha(fs.readFileSync(esmFile)));
 const nativeEsm=await import(pathToFileURL(esmFile).href);
 const lanes=[['source',compileSource()],['cjs',require(path.join(pkg,'dist/index.cjs'))],['esm',nativeEsm]];
 eq(typeof global.window,'undefined');eq(typeof global.document,'undefined');
 for(const [lane,api] of lanes){
  const tests=[
   ['default specimen',{},node=>{eq(Array.from(node.selectedOptions,o=>o.value),[]);eq(node.options.length,6);eq(node.multiple,true);eq(node.getAttribute('role'),null);eq(node.hidden,false);} ],
   ['controlled native option order',{value:['halal','vegan']},node=>eq(Array.from(node.selectedOptions,o=>o.value),['vegan','halal'])],
   ['uncontrolled default',{defaultValue:['kosher']},node=>{eq(Array.from(node.selectedOptions,o=>o.value),['kosher']);eq(node.options[4].defaultSelected,true);} ],
   ['controlled missing has no fallback',{value:['unknown']},node=>eq(node.selectedOptions.length,0)],
   ['empty list and native form props',{options:[],name:'p',required:true,disabled:true,form:'external',size:5},node=>{eq(node.options.length,0);eq(node.name,'p');eq(node.required,true);eq(node.disabled,true);eq(node.size,5);eq(node.getAttribute('form'),'external');}],
   ['native explicit disabled/empty matches',{options:[{value:'x',label:'X',disabled:true},{value:'',label:'Empty'}],value:['','x']},node=>eq(Array.from(node.selectedOptions,o=>o.value),['x',''])],
   ['escaped labels and helper',{label:'<script>bad</script>',helper:'<b>help</b>',options:[{value:'a"<x>',label:'<script>option</script>'}]},(node,doc)=>{eq(doc.querySelectorAll('script,b').length,0);eq(node.options[0].text,'<script>option</script>');eq(node.options[0].value,'a"<x>');}],
   ['label removal and aria fallback',{label:null,helper:null},node=>eq(node.getAttribute('aria-label'),'Dietary Preferences')],
  ];
  for(const [name,props,check] of tests){const count=assertions;try{const html=renderToString(h(api.Select34,props)),dom=new JSDOM(html),doc=dom.window.document,node=doc.querySelector('select');eq(doc.querySelectorAll('select').length,1);eq(doc.querySelectorAll('button,input,dialog').length,0);check(node,doc);ok(!html.includes('readonly='));dom.window.close();cases.push({name:lane+':'+name,status:'PASS',assertions:assertions-count});}catch(error){cases.push({name:lane+':'+name,status:'FAIL',error:String(error.stack||error)});}}
  const html=renderToString(h(React.Fragment,null,h(api.Select34),h(api.Select34))),dom=new JSDOM(html);try{const inputs=dom.window.document.querySelectorAll('select');ok(inputs[0].id!==inputs[1].id);for(const label of dom.window.document.querySelectorAll('label'))ok(dom.window.document.getElementById(label.htmlFor));cases.push({name:lane+':unique label IDs',status:'PASS',assertions:3});}catch(error){cases.push({name:lane+':unique label IDs',status:'FAIL',error:String(error.stack||error)});}dom.window.close();
 }
 const report={status:cases.every(c=>c.status==='PASS')?'PASS':'FAIL',total:cases.length,assertions,filtered:false,packageRoot:pkg,noBrowserGlobals:typeof global.window==='undefined'&&typeof global.document==='undefined',esmSha256:sha(esmBytes),lanes:lanes.map(l=>l[0]),cases,scope:'Node SSR only. Exact ESM bytes copied into isolated existing-peer harness; CJS imported directly, TSX independently compiled. No real browser claim.'};const file=path.resolve(process.env.REPORT_PATH||path.join(root,'qa/ssr.json'));require('./report.cjs').writeReport(file,report);console.log(JSON.stringify({status:report.status,total:cases.length,assertions,report:file}));if(report.status==='FAIL'){console.error(cases.filter(c=>c.status==='FAIL'));process.exitCode=1;}
 }finally{fs.rmSync(temp,{recursive:true,force:true});}})().catch(error=>{console.error(error);process.exitCode=1;});
