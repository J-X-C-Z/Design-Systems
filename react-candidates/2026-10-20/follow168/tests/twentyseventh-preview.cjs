const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const R=path.resolve(__dirname,'..'),D=process.env.LOCAL_DEPENDENCIES||path.join(R,'node_modules');
const {JSDOM,VirtualConsole}=require(path.join(D,'jsdom'));
const failures=[],consoleBridge=new VirtualConsole();
consoleBridge.on('jsdomError',error=>failures.push(error.message));
const w=new JSDOM('<div id="root"></div>',{runScripts:'outside-only',pretendToBeVisual:true,url:'https://local.test/',virtualConsole:consoleBridge}).window,d=w.document;
const checks=[],content=JSON.parse(fs.readFileSync(path.join(R,'src/twentyseventh-controls/data.json'),'utf8')),ids=Object.keys(content);
let externalRequests=0;
w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
w.fetch=()=>{externalRequests++;throw Error('The page must not request an external service');};
w.XMLHttpRequest.prototype.open=function(){externalRequests++;throw Error('The page must not request an external service');};
w.open=()=>{externalRequests++;throw Error('The page must not open an external service');};
const wait=()=>new Promise(resolve=>setTimeout(resolve,30));
const until=async predicate=>{for(let i=0;i<100;i++){if(predicate())return;await wait();}throw Error('bounded render wait expired');};
const ok=(value,name)=>{assert.ok(value,name);checks.push(name);};
const section=()=>d.querySelector('section.follow124-atlas'),selector=()=>section().querySelector('#atlas-scene'),form=()=>section().querySelector('form');
const button=text=>[...section().querySelectorAll('button')].find(node=>node.textContent===text);
const trigger=value=>section().querySelector(`[data-accordion-value="${value}"]`);
const owner=id=>section().querySelector(`[data-atlas-owner="${id}"] dd`).textContent;
const expanded=value=>trigger(value).getAttribute('aria-expanded')==='true';
const click=async node=>{assert.ok(node,'click target exists');node.click();await wait();};
const choose=async id=>{selector().value=id;selector().dispatchEvent(new w.Event('change',{bubbles:true}));await wait();};
const key=async (node,value)=>{node.dispatchEvent(new w.KeyboardEvent('keydown',{key:value,bubbles:true,cancelable:true}));await wait();};
const snapshot=()=>JSON.stringify([...new w.FormData(form())]);
const read=()=>click(button('读取图谱 FormData'));
const reset=()=>click(button('父层复位四场景'));
const nativeReset=()=>click(button('原生复位图谱（受控保留）'));
(async()=>{
 const bundle=process.env.FOLLOW_PAGE_BUNDLE||process.env.FOLLOW_PREVIEW_BUNDLE||path.join(R,'qa/consumer168-c1/bundle.js');
 assert.ok(fs.existsSync(bundle),'Build the actual package consumer bundle before running this model test');
 w.eval(fs.readFileSync(bundle,'utf8'));await until(()=>section());
 ok(d.querySelector('.manifesto-bottom').textContent.includes('累计168 / 项目问答')&&d.querySelector('footer').textContent.includes('168 个 React'),'hero and footer124 preserve the historical project FAQ text');
 ok(selector().tagName==='SELECT'&&selector().labels[0]?.textContent==='选择问答场景','native selector has a visible associated label');
 ok(JSON.stringify([...selector().options].map(option=>option.value))===JSON.stringify(ids),'all four true component IDs reachable from native select');
 ok(selector().getAttribute('aria-controls')==='atlas-stage'&&d.getElementById(selector().getAttribute('aria-describedby')),'selector stage and local-boundary descriptions resolve');
 ok(section().querySelectorAll('[data-atlas-owner]').length===4&&ids.every(id=>owner(id)==='item-1'),'all four independent owner states are visible before mounting each scene');
 for(const id of ids){
  await choose(id);
  const roots=[...section().querySelectorAll('[data-component-id]')];
  ok(roots.length===1&&roots[0].dataset.componentId===id,`${id}: mounts exactly the selected package component`);
  ok(section().querySelector('.atlas-component-id').textContent===id&&section().querySelector('[data-atlas-owner][data-active="true"]').dataset.atlasOwner===id,`${id}: visible component ID and owner ledger agree`);
  ok(expanded('item-1')&&!expanded('item-2')&&!expanded('item-3')&&owner(id)==='item-1',`${id}: starts with the source default first panel`);
  content[id].forEach(item=>{
   const node=trigger(item.value),region=d.getElementById(node.getAttribute('aria-controls'));
   ok(node.querySelector('.fr7-canonical-faq-title').textContent===item.title,`${id}/${item.value}: fixed source question retained exactly`);
   ok(node.type==='button'&&region?.getAttribute('role')==='region'&&region.getAttribute('aria-labelledby')===node.id,`${id}/${item.value}: non-submit trigger and reciprocal region relationship`);
   if(item.subtitle)ok(node.querySelector('.fr7-canonical-faq-subtitle')?.textContent===item.subtitle,`${id}/${item.value}: fixed academic subtitle retained`);
  });
  ok(d.getElementById(trigger('item-1').getAttribute('aria-controls')).textContent===content[id][0].content,`${id}: initial body is the original fixed source text`);
  ok(snapshot()==='[]'&&form().querySelectorAll('input,textarea,select,[name]').length===0,`${id}: actual FormData contains no synthetic or named fields`);
  await read();ok(section().querySelector('.atlas-receipt').textContent==='[]',`${id}: submit renders actual empty FormData`);
  await click(trigger('item-2'));
  ok(expanded('item-1')&&expanded('item-2')&&owner(id)==='item-1, item-2'&&section().querySelector('.atlas-current').textContent===`当前展开：${id} / item-1, item-2`,`${id}: normal click synchronizes component and explicit owner state`);
  ok(d.getElementById(trigger('item-2').getAttribute('aria-controls')).textContent===content[id][1].content,`${id}: expanded second body remains source text`);
  await nativeReset();
  ok(selector().value===id&&expanded('item-2')&&owner(id)==='item-1, item-2'&&section().querySelector('.atlas-receipt').textContent==='[]',`${id}: native reset retains owner values, selected scene, and receipt`);
  await click(button('拒绝图谱更改'));await click(trigger('item-3'));await click(trigger('item-2'));
  ok(!expanded('item-3')&&expanded('item-2')&&owner(id)==='item-1, item-2'&&section().querySelector('.atlas-decision').textContent===`已拒绝：${id} / item-2`,`${id}: parent cancellation vetoes both open and close proposals`);
  await click(button('拒绝图谱更改'));await click(button('禁用图谱控件'));
  const beforeDisabled=section().querySelector('.atlas-decision').textContent;
  await click(trigger('item-3'));await click(trigger('item-1'));await read();
  ok([...section().querySelectorAll('[data-accordion-value]')].every(node=>node.disabled)&&owner(id)==='item-1, item-2'&&section().querySelector('.atlas-decision').textContent===beforeDisabled,`${id}: native disabled triggers cannot mutate or emit owner proposals`);
  ok(snapshot()==='[]'&&section().querySelector('.atlas-receipt').textContent==='[]',`${id}: disabled component still has no successful form fields`);
  await reset();
  ok(ids.every(key=>owner(key)==='item-1')&&expanded('item-1')&&!expanded('item-2')&&!expanded('item-3')&&section().querySelector('.atlas-receipt').textContent.includes('父层已复位'),`${id}: explicit parent reset restores every scene even while disabled`);
  await click(button('禁用图谱控件'));await click(trigger('item-3'));
  ok(d.getElementById(trigger('item-3').getAttribute('aria-controls')).textContent===content[id][2].content,`${id}: third body remains source text`);
  const ownedBeforeUnmount=owner(id);
  await click(button('装载图谱控件'));
  ok(!section().querySelector('[data-component-id]')&&owner(id)===ownedBeforeUnmount&&section().querySelector('.atlas-unmounted'),`${id}: explicit unmount keeps visible owner values`);
  await nativeReset();await read();
  ok(owner(id)===ownedBeforeUnmount&&selector().value===id&&snapshot()==='[]'&&section().querySelector('.atlas-receipt').textContent==='[]',`${id}: native reset and FormData work while unmounted`);
  await click(button('装载图谱控件'));
  ok(expanded('item-1')&&expanded('item-3')&&owner(id)===ownedBeforeUnmount,`${id}: remount restores the same owner-controlled expansion`);
  trigger('item-1').focus();await key(trigger('item-1'),'ArrowDown');
  ok(d.activeElement===trigger('item-2')&&owner(id)===ownedBeforeUnmount,`${id}: JSDOM arrow-focus model does not change expanded state`);
  await key(trigger('item-2'),'End');ok(d.activeElement===trigger('item-3'),`${id}: JSDOM End focus model reaches the final trigger`);
  await key(trigger('item-3'),'Home');ok(d.activeElement===trigger('item-1'),`${id}: JSDOM Home focus model returns to the first trigger`);
  await reset();
 }
 // Distinct values survive scene-driven unmounts; no single shared accordion value.
 const patterns={
  'accordion-08':['item-2'],
  'accordion-09':['item-3'],
  'accordion-10':['item-2','item-3'],
  'accordion-11':[],
 };
 for(const id of ids){await choose(id);await click(trigger('item-1'));for(const value of patterns[id])await click(trigger(value));ok(owner(id)===(patterns[id].join(', ')||'无'),`${id}: establishes a distinct owner state`);}
 for(const id of [...ids].reverse()){
  await choose(id);
  ok(['item-1','item-2','item-3'].every(value=>expanded(value)===patterns[id].includes(value))&&owner(id)===(patterns[id].join(', ')||'无'),`${id}: scenario-switch remount retains its own independent state`);
 }
 await reset();ok(ids.every(id=>owner(id)==='item-1'),'global parent reset clears four distinct retained values');
 ok(section().textContent.includes('仅展示控件')&&section().textContent.includes('不构成服务承诺')&&section().textContent.includes('没有外部请求'),'source scenarios have an explicit local-only demonstration boundary');
 ok(section().textContent.includes('JSDOM 模型检查')&&section().textContent.includes('真实浏览器布局与键盘尚未验收'),'page explicitly separates model evidence from browser acceptance');
 ok(d.querySelector('.follow120-brief')&&d.querySelector('.follow118-note')&&d.querySelector('.follow116-section')&&d.querySelector('.follow114-menu')&&d.querySelectorAll('.gallery article').length===3,'historical examples and all three original artworks retained');
 ok(externalRequests===0,'page interaction made no fetch, XHR, or external-window requests');
 ok(failures.length===0,'no JSDOM runtime errors: '+failures.join('; '));
 const report={checks,assertions:checks.length,browser:0,kind:'actual package bundled page in JSDOM; native FormData and modeled focus; no layout or browser acceptance claim'};
 // Keep a model-evidence report beside the historical preview suite reports.
 fs.writeFileSync(process.env.FOLLOW_PREVIEW_REPORT||path.join(R,'qa/TWENTYSEVENTH-PREVIEW.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify(report,null,2));
 w.close();
})().catch(error=>{console.error(error);w.close();process.exitCode=1;});
