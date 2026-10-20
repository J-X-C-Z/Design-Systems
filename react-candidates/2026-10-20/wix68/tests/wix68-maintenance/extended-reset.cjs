'use strict';
const H=require('./harness.cjs');
'use strict';process.env.NODE_ENV='production';
const fs=require('fs'),assert=require('assert/strict'),D=H.D,inputs=H.inputs;
const {JSDOM,VirtualConsole}=require(D+'/jsdom'),errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
const w=new JSDOM('<button id="outside">Outside</button><div id="host"></div>',{pretendToBeVisual:true,url:'https://review.local',virtualConsole:vc}).window,d=w.document;
Object.assign(global,{window:w,document:d,HTMLElement:w.HTMLElement,Node:w.Node,Event:w.Event,MutationObserver:w.MutationObserver});Object.defineProperty(global,'navigator',{value:w.navigator,configurable:true});
const R=require(D+'/react'),h=R.createElement,{flushSync}=require(D+'/react-dom'),root=require(D+'/react-dom/client').createRoot(d.querySelector('#host')),rows=[],wait=()=>new Promise(r=>setTimeout(r,0)),settle=async()=>{for(let n=0;n<3;n++)await wait()},render=x=>flushSync(()=>root.render(x));
const options=[{value:'a',label:'Alpha'},{value:'b',label:'Beta'},{value:'c',label:'Charlie'}];let label;
function eq(name,actual,expected){let pass=true;try{assert.deepEqual(actual,expected)}catch{pass=false}rows.push({case:label,name,actual,expected,pass});if(!pass)console.log('FAIL',label,name,JSON.stringify({actual,expected}))}
function el(api,id,slot,p){return id===15?h(api.Select15,{[slot]:p}):h(api['Select'+id],p)}
const native=()=>d.querySelector('select[name="choice"]'),button=()=>native()?.parentElement.querySelector('button[role=combobox]'),option=v=>d.querySelector('[role=option][data-value="'+v+'"]');
(async()=>{for(const input of inputs){const api=require(input.entry);for(const id of input.ids)for(const slot of id===15?['small','standard','large']:[null]){
 for(const scenario of ['after-join','after-leave','join-leave','leave-join','after-join-new-gesture','join-old-gesture','join-new-gesture','join-old-new-gesture','unrelated-reset'])for(const cancel of [false,true]){
  label='Select'+id+(slot?'/'+slot:'')+' '+scenario+' cancel='+cancel;
  let setForm,calls=[],current=scenario==='after-leave'||scenario==='leave-join'?'A':'B';
  function Host(){const[form,s]=R.useState(current);setForm=s;const onReset=e=>{if(scenario.startsWith('join-')){flushSync(()=>setForm('A'));if(scenario==='join-leave')flushSync(()=>setForm('B'));}if(scenario==='leave-join'){flushSync(()=>setForm('B'));flushSync(()=>setForm('A'));}if(cancel)e.preventDefault();};return h(R.Fragment,null,h('form',{id:'A',onReset}),h('form',{id:'B'}),el(api,id,slot,{options,defaultValue:'a',disabled:false,required:false,name:'choice',form,open:true,onValueChange:v=>calls.push(v)}));}
  try{render(h(Host));await settle();option('b').click();await settle();eq('setup',native().value,'b');calls=[];
   if(scenario==='join-old-gesture'||scenario==='join-old-new-gesture')option('c').click();
   d.querySelector('#A').reset();
   if(scenario.startsWith('after-'))flushSync(()=>setForm(scenario==='after-leave'?'B':'A'));
   if(scenario==='after-join-new-gesture'||scenario==='join-new-gesture'||scenario==='join-old-new-gesture')option('c').click();
   await settle();
   let expected='b';if(!cancel&&['after-leave','leave-join','join-old-gesture','join-new-gesture','join-old-new-gesture'].includes(scenario))expected='a';
   if(['after-join-new-gesture','join-new-gesture','join-old-new-gesture'].includes(scenario)||(cancel&&scenario==='join-old-gesture'))expected='c';
   eq('native after reset sequence',native().value,expected);eq('visible agrees',button().textContent.includes({a:'Alpha',b:'Beta',c:'Charlie'}[expected]),true);
   const expectedCalls=expected==='c'?['c']:[];eq('only eligible gestures propose',calls,expectedCalls);
  }catch(e){rows.push({case:label,name:'exception',error:e.stack,pass:false})}finally{render(null);await settle()}
 }
 }
}
// All three Select15 slots share one component but carry separate actual form owners.
for(const cancel of [false,true]){label='Select15 all slots independent cancel='+cancel;const api=require(inputs.find(x=>x.family==='composition').entry);let setForm;function Host(){const[form,s]=R.useState('B');setForm=s;const p={options,defaultValue:'a',open:true};return h(R.Fragment,null,h('form',{id:'A',onReset:e=>{flushSync(()=>setForm('A'));if(cancel)e.preventDefault()}}),h('form',{id:'B'}),h(api.Select15,{small:{...p,name:'small',form},standard:{...p,name:'standard',form:'B'},large:{...p,name:'large',form:'A'}}))}render(h(Host));await settle();for(const slot of ['small','standard','large']){const t=d.querySelector('[data-control="'+slot+'"] [role=combobox]'),box=d.getElementById(t.getAttribute('aria-controls'));box.querySelector('[data-value=b]').click();await settle()}d.querySelector('#A').reset();await settle();eq('independent native values',Array.from(d.querySelectorAll('select')).map(s=>[s.name,s.value]),[['small',cancel?'b':'a'],['standard','b'],['large',cancel?'b':'a']]);render(null);await settle()}
root.unmount();const report={status:rows.every(r=>r.pass)?'PASS':'FAIL',checks:rows.length,failed:rows.filter(r=>!r.pass).length,errors,rows,scope:'Author targeted regression on runtime paths and hashes captured at execution; React/JSDOM untrusted events. No independent review or browser acceptance claim.'};H.write('extended-reset.json',report);console.log('TOTAL',report.checks,'FAILED',report.failed);w.close();process.exitCode=report.failed?1:0})().catch(e=>{console.error(e);w.close();process.exitCode=1});
