'use strict';
const {React,api,options,check,equal,runCases}=require('./harness.cjs');const e=React.createElement,cases=[];
const key=(h,node,key,extra={})=>h.fire(()=>node.dispatchEvent(new h.w.KeyboardEvent('keydown',{key,bubbles:true,cancelable:true,...extra})));
// Explicit light-DOM UA activation model, not proof of trusted browser input.
const activate=(h,node,key,extra={})=>h.fire(()=>{node.focus();const down=new h.w.KeyboardEvent('keydown',{key,bubbles:true,cancelable:true,...extra});node.dispatchEvent(down);const up=new h.w.KeyboardEvent('keyup',{key,bubbles:true,cancelable:true,...extra});node.dispatchEvent(up);if(!down.defaultPrevented&&!up.defaultPrevented&&!extra.isComposing&&extra.keyCode!==229&&!extra.repeat&&h.doc.activeElement===node)node.dispatchEvent(new h.w.MouseEvent('click',{bubbles:true,cancelable:true,detail:0}));});
for(const variant of ['Select32','Select33']){
 cases.push({id:variant+'/arrow-home-end-tab',run:async h=>{
  await h.render(e(api[variant],{options,defaultValue:[]}));h.button().focus();await key(h,h.button(),'ArrowDown');equal(h.doc.activeElement,h.option('a'),'Arrow opens first enabled row');
  for(const [k,v]of [['ArrowDown','b'],['End','c'],['ArrowDown','a'],['ArrowUp','c'],['Home','a']]){await key(h,h.doc.activeElement,k);equal(h.doc.activeElement,h.option(v),k+' navigates enabled rows');}
  await key(h,h.doc.activeElement,'Tab');equal(h.doc.activeElement,h.option('b'),'Tab visits next real button');await key(h,h.doc.activeElement,'Tab',{shiftKey:true});equal(h.doc.activeElement,h.option('a'),'Shift+Tab visits previous button');
  await key(h,h.doc.activeElement,'Tab',{shiftKey:true});equal(h.popup(),null,'Backward boundary closes');equal(h.doc.activeElement,h.button(),'Backward boundary returns to trigger');
  await key(h,h.button(),'ArrowDown');await key(h,h.doc.activeElement,'End');await key(h,h.doc.activeElement,'Tab');equal(h.popup(),null,'Forward boundary closes');equal(h.doc.activeElement,h.doc.getElementById('after'),'Forward boundary moves after logical trigger position');
 }});
 for(const k of ['Enter',' '])cases.push({id:variant+'/native-activation/'+JSON.stringify(k),run:async h=>{
  const calls=[];await h.render(e(api[variant],{options,defaultValue:[],clearable:true,showSelectedItems:true,onValueChange:(v,d)=>calls.push({values:[...v],reason:d.reason})}));await activate(h,h.button(),k);check(h.popup(),'Native trigger activation opens');await activate(h,h.option('b'),k);equal(h.values(),['b'],'Native toggle activation selects once');equal(calls,[{values:['b'],reason:'keyboard'}],'Exactly one native keyboard value callback');
  await activate(h,h.option('b'),k,{repeat:true});equal(calls.length,1,'Repeated keydown does not duplicate value activation');await activate(h,h.doc.querySelector('.wix-ms-clear'),k,{repeat:true});equal(calls.length,1,'Repeated clear activation suppressed');await activate(h,h.doc.querySelector('.wix-ms-remove'),k,{repeat:true});equal(calls.length,1,'Repeated chip activation suppressed');
 }});
 for(const extra of [{isComposing:true},{keyCode:229},{altKey:true},{ctrlKey:true},{metaKey:true}])cases.push({id:variant+'/ignored-keys/'+JSON.stringify(extra),run:async h=>{
  await h.render(e(api[variant],{options,defaultValue:[],defaultOpen:true}));const start=h.doc.activeElement;await key(h,start,'ArrowDown',extra);equal(h.doc.activeElement,start,'Composition/modifier shortcut not intercepted');equal(h.values(),[],'Ignored key does not mutate selection');
 }});
 cases.push({id:variant+'/typeahead-buffer',run:async h=>{
  const opts=[{value:'a',label:'Alpha one'},{value:'aa',label:'Alpha two'},{value:'b',label:'Beta exports'},{value:'z',label:'Beta locked',disabled:true},{value:'e',label:'Éclair notes'}];await h.render(e(api[variant],{options:opts,defaultValue:[],defaultOpen:true}));const realNow=Date.now;let now=1000;Date.now=()=>now;
  try{await key(h,h.doc.activeElement,'a');equal(h.doc.activeElement.getAttribute('data-value'),'aa','Repeated prefix starts after current row');now+=20;await key(h,h.doc.activeElement,'a');equal(h.doc.activeElement.getAttribute('data-value'),'a','Repeated character cycles');now+=800;await key(h,h.doc.activeElement,'b');equal(h.doc.activeElement.getAttribute('data-value'),'b','Typeahead skips disabled matching item');now+=20;await key(h,h.doc.activeElement,'e');equal(h.doc.activeElement.getAttribute('data-value'),'b','Multi-character prefix retains matching current item');now+=800;await key(h,h.doc.activeElement,'é');equal(h.doc.activeElement.getAttribute('data-value'),'e','Unicode case-folded label search');equal(h.values(),[],'Typeahead never selects');}finally{Date.now=realNow;}
 }});
 for(const phase of ['react-capture','react-bubble','document-capture','document-bubble','window-capture','window-bubble'])cases.push({id:variant+'/late-key-cancel/'+phase,run:async h=>{
  const prevent=event=>event.preventDefault(),wrapper=phase.startsWith('react')?{[phase==='react-capture'?'onKeyDownCapture':'onKeyDown']:prevent}:{};
  await h.render(e('div',wrapper,e(api[variant],{options,defaultOpen:true,defaultValue:[]})));
  if(phase.startsWith('document'))h.doc.addEventListener('keydown',prevent,phase.endsWith('capture'));if(phase.startsWith('window'))h.w.addEventListener('keydown',prevent,phase.endsWith('capture'));
  const first=h.doc.activeElement;let native,original,own;await h.fire(()=>{native=new h.w.KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true,cancelable:true});original=native.preventDefault;own=Object.hasOwn(native,'preventDefault');first.dispatchEvent(native);});equal(h.doc.activeElement,first,'Late cancellation preserves option focus');check(native.defaultPrevented,'Native key prevention retained');equal(native.preventDefault,original,'Native preventDefault method restored');equal(Object.hasOwn(native,'preventDefault'),own,'Original event method ownership restored');
 }});
 for(const beganOpen of [false,true])for(const phase of ['react-capture','react-bubble','document-capture','document-bubble','window-capture','window-bubble'])cases.push({id:variant+'/explicit-external-focus/'+beganOpen+'/'+phase,run:async h=>{
  const move=()=>h.doc.getElementById('after').focus(),wrapper=phase.startsWith('react')?{[phase==='react-capture'?'onKeyDownCapture':'onKeyDown']:move}:{};
  await h.render(e('div',wrapper,e(api[variant],{options,defaultValue:[],...(beganOpen?{open:true,onOpenChange:()=>{}}:{})})));
  if(phase.startsWith('document'))h.doc.addEventListener('keydown',move,phase.endsWith('capture'));if(phase.startsWith('window'))h.w.addEventListener('keydown',move,phase.endsWith('capture'));
  const source=beganOpen?h.option('a'):h.button();source.focus();await key(h,source,'ArrowDown');equal(h.doc.activeElement,h.doc.getElementById('after'),'Explicit external focus outranks queued navigation/opening');
 }});
 for(const availability of ['empty','all-disabled'])for(const backward of [false,true])cases.push({id:variant+'/empty-boundary/'+availability+'/'+backward,run:async h=>{
  await h.render(e(api[variant],{options:availability==='empty'?[]:options.map(o=>({...o,disabled:true})),defaultValue:[],defaultOpen:true}));equal(h.doc.activeElement,h.popup(),'Empty-enabled-set focuses dialog root');await key(h,h.popup(),'Tab',{shiftKey:backward});equal(h.popup(),null,'Empty popup boundary closes');equal(h.doc.activeElement,backward?h.button():h.doc.getElementById('after'),'Empty popup logical exit');
 }});
 for(const refusal of ['reject','cancel'])cases.push({id:variant+'/boundary-refusal/'+refusal,run:async h=>{
  await h.render(e(api[variant],{options,defaultValue:[],...(refusal==='reject'?{open:true,onOpenChange:()=>{}}:{defaultOpen:true,onOpenChange:(open,detail)=>{if(!open)detail.preventDefault();}})}));await key(h,h.doc.activeElement,'End');const last=h.doc.activeElement;await key(h,last,'Tab');check(h.popup(),'Refused close retains popup');equal(h.doc.activeElement,last,'Refused Tab close retains focus');
 }});
}
for(const variant of ['Select32','Select33']) {
 for(const k of ['ArrowDown','ArrowUp','Home','End','Escape','a','A'])cases.push({id:variant+'/shift-shortcut/'+k,run:async h=>{
  await h.render(e(api[variant],{options,defaultOpen:true,defaultValue:['b']}));const first=h.doc.activeElement;let ev;await h.fire(()=>{ev=new h.w.KeyboardEvent('keydown',{key:k,shiftKey:true,bubbles:true,cancelable:true});first.dispatchEvent(ev);});equal(ev.defaultPrevented,false,'Shift shortcut default is preserved');equal(h.doc.activeElement,first,'Shift shortcut does not navigate');check(h.popup(),'Shift shortcut does not close');equal(h.values(),['b'],'Shift shortcut does not mutate');
 }});
 for(const redirect of ['none','trigger','outside'])for(const count of [1,2])cases.push({id:variant+'/nested-focus-queue/'+redirect+'/'+count,run:async h=>{
  await h.render(e('div',{onFocus:event=>{if(event.target.getAttribute('data-value')==='c'&&redirect!=='none')(redirect==='trigger'?h.button():h.doc.getElementById('after')).focus();}},e(api[variant],{options,defaultValue:['b'],open:true,onOpenChange:()=>{}})));
  const source=h.option('b');await h.fire(()=>source.focus());equal(h.doc.activeElement,source,'Fixture starts at focused b');await h.fire(()=>{for(let i=0;i<count;i++)source.dispatchEvent(new h.w.KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true,cancelable:true}));});const expected=redirect==='trigger'?h.button():redirect==='outside'?h.doc.getElementById('after'):h.option(count===1?'c':'a');equal(h.doc.activeElement,expected,'Nested explicit focus cancels stale navigation while legal queue stays FIFO');equal(h.values(),['b'],'Navigation never changes collection');
 }});
}
runCases('keyboard',cases).catch(error=>{console.error(error);process.exitCode=1;});
