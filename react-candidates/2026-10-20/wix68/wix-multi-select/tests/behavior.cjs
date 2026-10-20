'use strict';
const {React,api,options,check,equal,runCases,flushSync}=require('./harness.cjs');const e=React.createElement,cases=[];
const click=(h,node,detail=1)=>h.fire(()=>{if(!node)throw Error('Missing click target');node.focus();node.dispatchEvent(new h.w.MouseEvent('click',{bubbles:true,cancelable:true,detail}));});
const key=(h,node,key,extra={})=>h.fire(()=>{node.dispatchEvent(new h.w.KeyboardEvent('keydown',{key,bubbles:true,cancelable:true,...extra}));});
for(const name of ['Select32','Select33']){
 cases.push({id:name+'/original-contract',run:async h=>{
  let ref=null;await h.render(e('form',null,e(api[name],{name:'items',ref:n=>ref=n})));const b=h.button(),label=h.doc.querySelector('.wix-ms-label');
  equal(b.type,'button','Trigger cannot submit form');equal(ref,b,'Forwarded ref targets actual button');equal(b.getAttribute('aria-haspopup'),'dialog','Popover dialog, not a listbox');equal(label.htmlFor,b.id,'Visible label targets trigger');equal(b.getAttribute('aria-labelledby'),label.id,'Accessible label is explicit');
  equal(b.textContent,name==='Select32'?'Real-time Monitoring':'Select notification paths','Original summary');equal(h.values(),name==='Select32'?['monitoring']:[],'Original multiple default');equal(h.native().multiple,true,'Real multiple native bridge');
  equal(h.doc.querySelectorAll('.wix-ms-chips,.wix-ms-clear').length,0,'Enhancements absent by default');
  if(name==='Select33'){const helper=h.doc.querySelector('.wix-ms-helper');equal(helper.textContent,'System alerts will be delivered via all selected channels.','Full source helper');check(b.getAttribute('aria-describedby').split(' ').includes(helper.id),'Helper associated with trigger');}
  await click(h,b);const dialog=h.popup();equal(dialog?.getAttribute('role'),'dialog','Named nonmodal dialog');equal(dialog?.getAttribute('aria-modal'),'false','Nonmodal');equal(dialog.parentNode,h.doc.body,'Real ownerDocument body portal');equal(dialog.getAttribute('aria-labelledby'),label.id,'Dialog accessible name');
  const rows=[...dialog.querySelectorAll('.wix-ms-option')];equal(rows.length,name==='Select32'?4:5,'Original number of options');check(rows.every(n=>n.tagName==='BUTTON'&&n.type==='button'&&n.hasAttribute('aria-pressed')),'Actual accessible toggle buttons');equal(h.doc.activeElement,rows[0],'Open focuses first enabled row');
  await click(h,rows[1]);check(h.popup()!==null,'Toggling preserves popup');equal(h.values().length,name==='Select32'?2:1,'Toggle adds membership');
  await key(h,h.doc.activeElement,'Escape');equal(h.popup(),null,'Escape closes');equal(h.doc.activeElement,b,'Accepted Escape restores trigger');
 }});
 for(const initial of [[],['a'],['b','a'],['z','unknown','b']])cases.push({id:name+'/array-order/'+initial.join('-'),run:async h=>{
  const calls=[];await h.render(e('form',null,e(api[name],{name:'items',options,defaultValue:initial,clearable:true,showSelectedItems:true,onValueChange:(v,d)=>calls.push({v:[...v],frozen:Object.isFrozen(v),reason:d.reason,event:d.originalEvent})})));
  const expected=options.filter(x=>initial.includes(x.value)).map(x=>x.value);equal(h.values(),expected,'Bridge uses DOM option order');equal(new h.w.FormData(h.doc.querySelector('form')).getAll('items'),expected,'JSDOM native FormData model matches its option order (disabled success is platform-limited)');
  await click(h,h.button());await click(h,h.option('a'));const next=initial.includes('a')?initial.filter(v=>v!=='a'):[...initial,'a'];equal(calls[0].v,next,'Callback preserves insertion order and latent values');check(calls[0].frozen,'Emitted collection immutable');equal(calls[0].reason,'pointer','Pointer detail');check(calls[0].event instanceof h.w.Event,'Original native event retained');
  const clear=h.doc.querySelector('.wix-ms-clear');if(!clear.disabled)await click(h,clear);equal(h.values(),initial.includes('z')?['z']:[],'Clear preserves disabled selection');if(initial.includes('unknown'))check(calls.at(-1).v.includes('unknown'),'Clear preserves latent owner value');check(h.popup()!==null,'Clear preserves expanded state');
 }});
 for(const valueMode of ['uncontrolled','accept','reject'])for(const openMode of ['uncontrolled','accept','reject'])cases.push({id:name+'/owner/'+valueMode+'/'+openMode,run:async h=>{
  const vc=[],oc=[];function Owner(){const[v,V]=React.useState(['a']);const[o,O]=React.useState(false);const props={options,onValueChange:(n,d)=>{vc.push([...n]);if(valueMode==='accept')V(n);},onOpenChange:(n,d)=>{oc.push(n);if(openMode==='accept')O(n);}};Object.assign(props,valueMode==='uncontrolled'?{defaultValue:['a']}:{value:v});Object.assign(props,openMode==='uncontrolled'?{defaultOpen:false}:{open:o});return e(api[name],props);}
  await h.render(e(Owner));await click(h,h.button());equal(oc,[true],'One open proposal');equal(!!h.popup(),openMode!=='reject','Independent open owner');
  if(openMode!=='reject'){await click(h,h.option('b'));equal(vc,[['a','b']],'One immutable value proposal');equal(h.values(),valueMode==='reject'?['a']:['a','b'],'Independent value owner');check(h.popup(),'Toggle does not ask owner to close');equal(oc,[true],'No implicit selection close proposal');}
 }});
 for(const cancellation of ['detail','react-bubble','native-capture','native-document','native-window'])cases.push({id:name+'/cancel/'+cancellation,run:async h=>{
  const calls=[];const handler=e=>{if(e.target.closest?.('.wix-ms-option'))e.preventDefault();};
  await h.render(e('div',{onClick:cancellation==='react-bubble'?handler:undefined},e(api[name],{options,defaultValue:['a'],defaultOpen:true,onValueChange:(v,d)=>{calls.push([...v]);if(cancellation==='detail')d.preventDefault();}})));
  if(cancellation==='native-capture')h.popup().addEventListener('click',handler,true);if(cancellation==='native-document')h.doc.addEventListener('click',handler);if(cancellation==='native-window')h.w.addEventListener('click',handler);
  await click(h,h.option('b'));equal(h.values(),['a'],'Canceled toggle preserves collection');equal(calls.length,cancellation==='detail'?1:0,'Late default prevention blocks proposal');check(h.popup(),'Canceled toggle retains popup');
 }});
 for(const disabled of [true,false])for(const readOnly of [true,false])cases.push({id:name+'/availability/'+disabled+'/'+readOnly,run:async h=>{
  const calls=[];await h.render(e('form',null,e(api[name],{options,defaultValue:['a'],defaultOpen:true,disabled,readOnly,required:true,clearable:true,showSelectedItems:true,name:'items',onValueChange:v=>calls.push(v)})));
  equal(!!h.popup(),!disabled&&!readOnly,'Availability controls visible popup');equal(h.native().disabled,disabled,'Disabled reflected by native bridge');equal(h.native().required,!readOnly,'ReadOnly suppresses native requirement');
  if(disabled||readOnly){await click(h,h.doc.querySelector('.wix-ms-clear'));await click(h,h.doc.querySelector('.wix-ms-remove'));equal(calls.length,0,'All mutation paths blocked');equal(h.values(),['a'],'Collection retained');}
 }});
 cases.push({id:name+'/required-transitions',run:async h=>{
  const render=(props={})=>h.render(e('form',null,e(api[name],{options,defaultValue:[],required:true,...props})));await render();let valid;await h.fire(()=>{valid=h.doc.querySelector('form').checkValidity();});equal(valid,false,'Native required validity');equal(h.button().getAttribute('aria-invalid'),'true','Transient invalid described');equal(h.doc.activeElement,h.button(),'Invalid visible target focused');
  await render({required:false});check(h.button().getAttribute('aria-invalid')!=='true','Removing required clears transient invalid');equal(h.doc.querySelector('.wix-ms-error'),null,'Removing requirement clears transient error');
  await render({required:false,error:'Caller issue','aria-invalid':'spelling'});equal(h.button().getAttribute('aria-invalid'),'spelling','Caller aria-invalid authority');equal(h.doc.querySelector('.wix-ms-error').textContent,'Caller issue','Caller error persists independently');
 }});
 cases.push({id:name+'/dynamic-latent-options',run:async h=>{
  const calls=[];const render=opts=>h.render(e(api[name],{options:opts,defaultValue:['a','b'],defaultOpen:true,showSelectedItems:true,onValueChange:v=>calls.push([...v])}));await render(options);await click(h,h.option('b'));await click(h,h.option('b'));equal(calls.at(-1),['a','b'],'Reselection appends');
  await render(options.filter(o=>o.value!=='a'));equal(h.values(),['b'],'Removed option is latent');equal(h.doc.querySelectorAll('.wix-ms-chip').length,1,'Latent option omitted from chips');
  await render([...options].reverse());equal(h.values(),['b','a'],'Revival preserves membership and new DOM bridge order');equal(calls.length,2,'Metadata changes emit no value proposal');
 }});
 cases.push({id:name+'/committed-owner-priority',run:async h=>{
  let set;const calls=[];function Owner(){const[v,V]=React.useState(['a']);set=V;return e('div',{onClick:event=>{if(event.target.closest?.('.wix-ms-option'))flushSync(()=>V(['c']));}},e(api[name],{options,value:v,defaultOpen:true,onValueChange:v=>calls.push(v)}));}await h.render(e(Owner));await click(h,h.option('b'));equal(h.values(),['c'],'New committed owner defeats queued toggle');equal(calls.length,0,'Obsolete gesture sends no callback');
 }});
 cases.push({id:name+'/owned-chip-focus',run:async h=>{
  await h.render(e(api[name],{options,defaultValue:['a','b','c'],clearable:true,showSelectedItems:true}));let removes=[...h.doc.querySelectorAll('.wix-ms-remove')];await click(h,removes[1]);equal(h.values(),['a','c'],'Chip removes exactly one');equal(h.doc.activeElement.getAttribute('aria-label'),'Remove Charlie review','Next surviving chip gets owned focus');
  await click(h,h.doc.activeElement);equal(h.doc.activeElement.getAttribute('aria-label'),'Remove Alpha records','Previous surviving chip fallback');await click(h,h.doc.activeElement);equal(h.values(),[],'All chips removable');equal(h.doc.activeElement,h.button(),'Last chip returns to trigger when clear disabled');
 }});
}
for(const variant of ['Select32','Select33'])cases.push({id:variant+'/runtime-trigger-whitelist',run:async h=>{
 const calls=[];const wide={title:'Supported title',tabIndex:2,autoFocus:true,role:'listbox','aria-hidden':true,form:'rogue',name:'rogue',value:'rogue',dangerouslySetInnerHTML:{__html:'<script>forbidden()</script>'},onClickCapture:()=>calls.push('capture'),onClick:()=>calls.push('bubble')};
 await h.render(e(api[variant],{options,defaultValue:[],triggerProps:wide}));const button=h.button();equal(button.title,'Supported title','Supported title remains');equal(button.tabIndex,2,'Supported tabIndex remains');for(const attr of ['role','aria-hidden','form','name','value'])equal(button.hasAttribute(attr),false,'Unsupported '+attr+' does not leak');equal(button.querySelector('script'),null,'Unsupported HTML is ignored');equal(button.type,'button','Internal native type preserved');await h.fire(()=>button.click());equal(calls,['capture','bubble'],'Supported native callbacks preserved');check(h.popup(),'Protected semantics still open real dialog');
}});
runCases('behavior',cases).catch(error=>{console.error(error);process.exitCode=1;});
