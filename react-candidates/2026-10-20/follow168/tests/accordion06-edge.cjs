const assert = require('node:assert/strict');
const path = require('node:path');
const R = path.resolve(__dirname, '..');
const D = process.env.LOCAL_DEPENDENCIES || path.join(R, 'node_modules');
const runtime = process.env.FOLLOW_NEXT_RUNTIME || path.join(R, 'qa/accordion06-edge-runtime.cjs');
if (!process.env.FOLLOW_NEXT_RUNTIME) require(D + '/esbuild').buildSync({
  entryPoints: [path.join(R, 'src/twentysixth-controls/accordion.jsx')],
  outfile: runtime, bundle: true, format: 'cjs', platform: 'node',
  external: ['react', 'react-dom', 'react/jsx-runtime'],
});
const {JSDOM}=require(D+'/jsdom');
const w=new JSDOM('<div id="root"></div>',{url:'https://local.test'}).window;
Object.assign(global,{window:w,document:w.document,HTMLElement:w.HTMLElement,IS_REACT_ACT_ENVIRONMENT:true});
const React=require(D+'/react'),{act}=React,{createRoot}=require(D+'/react-dom/client'),{flushSync}=require(D+'/react-dom');
const {Accordion06}=require(runtime);
const h=React.createElement,root=createRoot(document.getElementById('root'));
let key=0,checks=[];
const ok=(x,n)=>{assert.ok(x,n);checks.push(n)};
const render=async(x)=>act(async()=>root.render(x));
const fresh=async(props={},wrap=x=>x)=>render(wrap(h(Accordion06,{key:++key,...props})));
const button=id=>document.querySelector(`[data-accordion-value="${id}"]`);
const open=()=>[...document.querySelectorAll('button[aria-expanded=true]')].map(x=>x.dataset.accordionValue).join(',');
const click=async(id,opts={})=>act(async()=>button(id).dispatchEvent(new w.MouseEvent('click',{bubbles:true,cancelable:true,...opts})));
const keydown=async(id,key,opts={})=>act(async()=>button(id).dispatchEvent(new w.KeyboardEvent('keydown',{key,bubbles:true,cancelable:true,...opts})));
(async()=>{
await fresh();ok(open()==='item-1','initial first item');ok(document.querySelectorAll('h3 > button').length===3,'three actual heading controls');ok([...document.querySelectorAll('button')].every(x=>x.type==='button'),'native non-submit buttons');ok(new Set([...document.querySelectorAll('[data-accordion-icon]')].map(x=>x.dataset.accordionIcon)).size===3,'three icons');ok(document.getElementById(button('item-1').getAttribute('aria-controls')).textContent==='Appointment availability can change fast when multiple patients, staff members, and scheduling rules are interacting at once...','canonical first content');
await act(async()=>{button('item-2').click();button('item-3').click()});ok(open()==='item-1,item-2,item-3','rapid independent changes');await act(async()=>{button('item-2').click();button('item-2').click()});ok(open()==='item-1,item-2,item-3','rapid same item twice');
await fresh({defaultValue:['item-3','item-1','item-3']});ok(open()==='item-1,item-3','normalize unique source order');await render(h(Accordion06,{key,defaultValue:[]}));ok(open()==='item-1,item-3','default update ignored');
await fresh({value:['item-2']});await click('item-3');ok(open()==='item-2','owner refusal');await render(h(Accordion06,{key,value:['item-1','item-3']}));await render(h(Accordion06,{key}));ok(open()==='item-1,item-3','owner release retains selection');await click('item-1');ok(open()==='item-3','released edit');
for(const mode of ['false','cancel','synthetic','native']) { await fresh({onValueChange:(v,d)=>{if(mode==='false')return false;if(mode==='cancel')d.cancel();if(mode==='synthetic')d.event.preventDefault();if(mode==='native')d.event.nativeEvent.preventDefault()}});await click('item-2');ok(open()==='item-1','callback cancellation '+mode); }
for(const native of [false,true]) {
 await fresh({},x=>h('div',{onClick:e=>native?e.nativeEvent.preventDefault():e.preventDefault()},x));await click('item-2');ok(open()==='item-1','ancestor click cancellation '+native);
 await fresh({},x=>h('div',{onKeyDown:e=>native?e.nativeEvent.preventDefault():e.preventDefault()},x));button('item-1').focus();await keydown('item-1','ArrowDown');ok(document.activeElement===button('item-1'),'ancestor key cancellation '+native);
 await fresh({triggerProps:{'item-1':{onKeyDown:e=>native?e.nativeEvent.preventDefault():e.preventDefault()}}});button('item-1').focus();await keydown('item-1','ArrowDown');ok(document.activeElement===button('item-1'),'trigger key cancellation '+native);
}
for(const mode of ['synthetic','native']) {await fresh({onValueChange:(v,d)=>mode==='synthetic'?d.event.preventDefault():d.event.nativeEvent.preventDefault()});await click('item-2',{cancelable:false});ok(open()==='item-1','noncancelable proposal explicit cancellation '+mode)}
await fresh({triggerProps:{'item-2':{disabled:true}}});button('item-1').focus();await keydown('item-1','ArrowDown');ok(document.activeElement===button('item-3'),'skip disabled');await keydown('item-3','ArrowDown');ok(document.activeElement===button('item-1'),'loop');await keydown('item-1','End');ok(document.activeElement===button('item-3'),'End');await keydown('item-3','Home');ok(document.activeElement===button('item-1'),'Home');await fresh({loop:false});button('item-1').focus();await keydown('item-1','ArrowUp');ok(document.activeElement===button('item-1'),'bounded first');
await fresh({orientation:'horizontal',dir:'rtl'});button('item-1').focus();await keydown('item-1','ArrowLeft');ok(document.activeElement===button('item-2'),'RTL left forward');await keydown('item-2','ArrowRight');ok(document.activeElement===button('item-1'),'RTL right back');await keydown('item-1','ArrowDown');ok(document.activeElement===button('item-1'),'other axis ignored');
for(const opts of [{ctrlKey:true},{metaKey:true},{altKey:true},{shiftKey:true},{isComposing:true},{keyCode:229}]) {await fresh();button('item-1').focus();await keydown('item-1','ArrowDown',opts);ok(document.activeElement===button('item-1'),'modified/composing '+JSON.stringify(opts));}
let calls=0;await fresh({onValueChange:()=>calls++},x=>h('fieldset',{disabled:true},x));await click('item-2');await keydown('item-1','ArrowDown');ok(open()==='item-1'&&calls===0,'disabled fieldset direct dispatched events blocked');
await fresh({onValueChange:()=>document.querySelector('fieldset').disabled=true},x=>h('fieldset',{},x));await click('item-2');ok(open()==='item-1','callback fieldset mutation veto');
await fresh({},x=>h('fieldset',{disabled:true},h('legend',{},x)));await click('item-2');ok(open()==='item-1,item-2','first legend fieldset exception');
await fresh({onValueChange:()=>flushSync(()=>root.render(h(Accordion06,{key,value:['item-3']})))});await click('item-2');ok(open()==='item-3','callback flushSync owner replacement');
await fresh({value:['item-1'],onValueChange:()=>flushSync(()=>root.render(h(Accordion06,{key})))});await click('item-2');ok(open()==='item-1','callback flushSync owner release');await click('item-3');ok(open()==='item-1,item-3','released instance edit after callback transition');
await fresh({onValueChange:()=>flushSync(()=>root.render(h(Accordion06,{key,disabled:true})))});await click('item-2');ok(open()==='item-1','callback flushSync disabled veto');
await fresh();await act(async()=>{button('item-2').click();flushSync(()=>root.render(h(Accordion06,{key,value:['item-3']})))});ok(open()==='item-3','queued gesture invalidated by owner');
await fresh({},x=>h('form',{},x));await click('item-2');await act(async()=>document.querySelector('form').reset());ok(open()==='item-1,item-2','native reset does not change accordion');ok([...new w.FormData(document.querySelector('form'))].length===0,'no form data');
let rootAttach=0,rootCleanup=0,triggerAttach=0,triggerCleanup=0;const r=n=>{rootAttach++;return()=>rootCleanup++},t=n=>{triggerAttach++;return()=>triggerCleanup++};await fresh({ref:r,triggerProps:{'item-2':{ref:t}}});await click('item-2');ok(rootAttach===1&&rootCleanup===0&&triggerAttach===1&&triggerCleanup===0,'refs stable across interaction');await render(null);ok(rootCleanup===1&&triggerCleanup===1,'React19 callback cleanup');
let nr=[];await fresh({ref:n=>{nr.push(n)}});await render(null);ok(nr.length===2&&nr[1]===null,'legacy callback ref null');
calls=0;await fresh({onValueChange:()=>calls++});await act(async()=>{button('item-2').click();flushSync(()=>root.render(null))});ok(calls===0,'unmount suppresses pending callback');
await fresh({onValueChange:()=>flushSync(()=>root.render(null))});await click('item-2');ok(!document.querySelector('[data-component-id]'),'callback unmount safe');
await render(h('div',{},h(Accordion06),h(Accordion06)));ok(new Set([...document.querySelectorAll('[id]')].map(x=>x.id)).size===document.querySelectorAll('[id]').length,'instance IDs unique');
await render(h(React.StrictMode,{},h(Accordion06)));await click('item-2');ok(open()==='item-1,item-2','StrictMode operational');
await act(async()=>root.unmount());console.log(JSON.stringify({assertions:checks.length,checks,browser:false},null,2));w.close();
})().catch(e=>{console.error(e);w.close();process.exitCode=1});
