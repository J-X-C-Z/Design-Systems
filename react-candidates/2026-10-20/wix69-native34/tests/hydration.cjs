'use strict';
const assert=require('node:assert/strict'),{env:E}=require('./harness.cjs');
const {h,React,api,root,flushSync,window,document,tick,path,packageRoot}=E;
const {renderToString}=require(path.join(E.dependencies,'react-dom/server')),{hydrateRoot}=require(path.join(E.dependencies,'react-dom/client'));
const cases=[];let assertions=0;const eq=(a,b)=>{assertions++;assert.deepEqual(a,b);};
(async()=>{
 for(const mode of ['controlled','uncontrolled'])for(const values of [[],['vegan'],['halal','vegetarian'],['unknown']]){
  const errors=[],ref={current:null};const props=mode==='controlled'?{value:values}:{defaultValue:values};const app=h('form',null,h(api.Select34,{...props,ref,name:'preference'}));
  const host=document.createElement('div');host.innerHTML=renderToString(app);document.body.append(host);const original=host.querySelector('select'),html=host.innerHTML;let hydrated;
  try{hydrated=hydrateRoot(host,app,{onRecoverableError:e=>errors.push(String(e))});await tick();await tick();eq(errors,[]);eq(host.querySelector('select'),original);eq(ref.current,original);eq(host.innerHTML,html);const expected=['vegetarian','vegan','gluten-free','halal','kosher','dairy-free'].filter(x=>values.includes(x));eq(Array.from(original.selectedOptions,o=>o.value),expected);host.querySelector('form').reset();await tick();eq(Array.from(original.selectedOptions,o=>o.value),expected);cases.push({name:mode+':'+JSON.stringify(values),status:'PASS'});}catch(error){cases.push({name:mode+':'+JSON.stringify(values),status:'FAIL',error:String(error.stack||error),errors});}finally{if(hydrated)flushSync(()=>hydrated.unmount());host.remove();}
 }
 const report={status:cases.every(c=>c.status==='PASS')?'PASS':'FAIL',total:cases.length,assertions,filtered:false,packageRoot,cases,realBrowser:false,scope:'SSR-to-JSDOM hydration, ref identity, no recoverable errors, native reset after hydration.'};const file=path.resolve(process.env.REPORT_PATH||path.join(__dirname,'../qa/hydration.json'));require('./report.cjs').writeReport(file,report);console.log(JSON.stringify({status:report.status,total:report.total,assertions,report:file}));if(report.status==='FAIL'){console.error(cases.filter(c=>c.status==='FAIL'));process.exitCode=1;}flushSync(()=>root.unmount());window.close();
})().catch(error=>{console.error(error);process.exitCode=1;window.close();});
