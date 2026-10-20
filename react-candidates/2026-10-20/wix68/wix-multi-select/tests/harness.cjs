'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const dependencies=process.env.LOCAL_DEPENDENCIES;
if(!dependencies)throw Error('LOCAL_DEPENDENCIES must point to the existing toolchain; no install is performed.');
const React=require(path.join(dependencies,'react'));
const flushSync=(...args)=>require(path.join(dependencies,'react-dom')).flushSync(...args);
const {JSDOM,VirtualConsole}=require(path.join(dependencies,'jsdom'));
const act=(...args)=>(React.act||require(path.join(dependencies,'react-dom/test-utils')).act)(...args);
const entry=path.resolve(process.env.ENTRY||path.join(__dirname,'../dist/index.cjs'));
const api={},root=path.resolve(__dirname,'..');
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const inputs=[entry,__filename,path.resolve(process.argv[1]),...['src/index.tsx','src/types.ts','src/index.d.ts','src/styles.css'].map(p=>path.join(root,p))].filter(fs.existsSync);
const hashesBefore=Object.fromEntries(inputs.map(p=>[p,sha(p)]));
global.IS_REACT_ACT_ENVIRONMENT=true;
const options=Object.freeze([{value:'a',label:'Alpha records'},{value:'b',label:'Beta exports'},{value:'c',label:'Charlie review'},{value:'z',label:'Zulu locked',disabled:true}]);
let assertions=0,currentId='',checks=[];
function describe(value){if(value&&typeof value==='object'&&typeof value.nodeType==='number')return {node:value.nodeName,id:value.id||null,className:typeof value.className==='string'?value.className:null,text:value.textContent?.slice(0,100)};if(Array.isArray(value))return value.map(describe);if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,describe(v)]));return value;}
function check(condition,label,actual){assertions++;const diagnostic=condition?undefined:describe(actual);checks.push({case:currentId,label,passed:!!condition,...(!condition?{actual:diagnostic}: {})});if(!condition)throw Error(label+(diagnostic===undefined?'':': '+JSON.stringify(diagnostic)));}
function equal(actual,expected,label){const node=typeof global.Node==='function'&&(actual instanceof global.Node||expected instanceof global.Node);check(node?actual===expected:JSON.stringify(actual)===JSON.stringify(expected),label,{actual,expected});}
function createDocument(){
 const errors=[],v=new VirtualConsole();v.on('jsdomError',e=>errors.push(String(e)));
 const dom=new JSDOM('<!doctype html><html><body><button id="before">Before</button><div id="mount"></div><button id="after">After</button></body></html>',{pretendToBeVisual:true,url:'https://wix-multi-select.invalid/',virtualConsole:v});const w=dom.window;
 for(const k of ['window','document','navigator','HTMLElement','HTMLButtonElement','HTMLSelectElement','HTMLFormElement','Element','Node','Event','MouseEvent','KeyboardEvent','FocusEvent','MutationObserver','FormData','File','Blob'])Object.defineProperty(global,k,{configurable:true,writable:true,value:k==='window'?w:k==='document'?w.document:w[k]});
 global.getComputedStyle=w.getComputedStyle.bind(w);w.matchMedia=q=>({matches:false,media:q,addEventListener(){},removeEventListener(){}});w.requestAnimationFrame=fn=>w.setTimeout(()=>fn(0),0);w.cancelAnimationFrame=id=>w.clearTimeout(id);global.requestAnimationFrame=w.requestAnimationFrame;global.cancelAnimationFrame=w.cancelAnimationFrame;
 w.HTMLElement.prototype.scrollIntoView=function(){};if(!Object.keys(api).length)Object.assign(api,require(entry));const {createRoot}=require(path.join(dependencies,'react-dom/client'));const rr=createRoot(w.document.getElementById('mount'));let disposed=false;
 const render=async child=>{await act(async()=>{rr.render(child);await Promise.resolve();});await settle();};
 async function settle(){await act(async()=>{await new Promise(r=>w.setTimeout(r,0));});}
 const fire=async fn=>{await act(async()=>{fn();await Promise.resolve();});await settle();};
 const button=()=>w.document.querySelector('.wix-ms-trigger'),popup=()=>w.document.querySelector('.wix-ms-popup'),native=()=>w.document.querySelector('select[multiple]');
 const option=value=>Array.from(w.document.querySelectorAll('.wix-ms-option')).find(n=>n.getAttribute('data-value')===value||n.textContent.includes(options.find(o=>o.value===value)?.label||'__NO_MATCH__'));
 const values=()=>Array.from(native()?.selectedOptions||[]).map(o=>o.value);
 const close=async()=>{if(!disposed){disposed=true;await act(async()=>rr.unmount());w.close();}};
 return {dom,w,doc:w.document,errors,root:rr,render,settle,fire,button,popup,native,option,values,close};
}
async function runCases(name,cases){
 const filter=process.env.FILTER?new RegExp(process.env.FILTER):null,selected=filter?cases.filter(c=>filter.test(c.id)):cases;
 if(!selected.length)throw Error('FILTER matched no test cases; no verification credit.');
 const failures=[],results=[];let executed=0;
 for(const c of selected){currentId=c.id;const start=assertions;let h;try{h=createDocument();await c.run(h);check(h.errors.length===0,'No JSDOM runtime errors',h.errors);results.push({id:c.id,status:'PASS',assertions:assertions-start});}catch(error){const failure={id:c.id,message:String(error?.stack||error)};failures.push(failure);results.push({id:c.id,status:'FAIL',assertions:assertions-start});}finally{executed++;if(h)try{await h.close();}catch(error){failures.push({id:c.id,cleanup:String(error)});}}
 if(process.env.FAIL_FAST&&failures.length)break;
 }
 const hashesAfter=Object.fromEntries(inputs.map(p=>[p,sha(p)]));if(JSON.stringify(hashesBefore)!==JSON.stringify(hashesAfter))failures.push({id:'input-integrity',message:'Inputs changed during verification'});
 const report={suite:name,status:failures.length?'FAIL':'PASS',entry,eligible:cases.length,selected:selected.length,total:executed,completeSuite:!filter&&executed===cases.length,assertions,failures,results,checks,hashesBefore,hashesAfter};
 const output=path.resolve(process.env.REPORT_PATH||path.join(root,'qa',name+'.json'));fs.mkdirSync(path.dirname(output),{recursive:true});fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({suite:name,status:report.status,total:executed,assertions,failed:failures.length,report:output}));if(failures.length)process.exitCode=1;return report;
}
module.exports={React,act,flushSync,api,options,entry,root,check,equal,runCases};
