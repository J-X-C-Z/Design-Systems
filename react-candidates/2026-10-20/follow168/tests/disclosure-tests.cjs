'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

/** Pass compiled named exports as arg 5 (or window.FollowReactSevenDisclosure).
 * Optional sixth arg {flushSync} enables explicit synchronous owner/destruction probes.
 * No JSX compiler, install, build, or external network runs from this suite. */
exports.run = async function run(window, React, createRoot, assert, components, options = {}) {
  const api = components || window.FollowReactSevenDisclosure || window.FollowReactSeven;
  if (!api?.Tabs01 || !api?.Accordion01 || !api?.Dialog01) throw new Error('Provide compiled disclosure React exports as run() argument 5');
  if (typeof React.act !== 'function') throw new Error('React.act is required');
  const doc = window.document, h = React.createElement, groups = [], mounted = new Set();
  let assertions = 0;
  const eq = (a,b,m) => { assertions++; assert.strictEqual(a,b,m); };
  const deep = (a,b,m) => { assertions++; assert.deepStrictEqual(a,b,m); };
  const ok = (v,m) => { assertions++; assert.ok(v,m); };
  const oldAct = globalThis.IS_REACT_ACT_ENVIRONMENT;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const step = async fn => { await React.act(async () => { fn?.(); await Promise.resolve(); }); };
  const click = async node => { ok(node, 'click target exists'); await step(() => node.dispatchEvent(new window.MouseEvent('click',{bubbles:true,cancelable:true}))); };
  const key = async (node, value, extras={}) => { const event = new window.KeyboardEvent('keydown',{key:value,bubbles:true,cancelable:true,...extras}); await step(() => node.dispatchEvent(event)); return event; };
  const focus = async node => { await step(() => node.focus()); };
  const activeTabs = host => [...host.querySelectorAll('[role=tab]')].filter(n=>n.getAttribute('aria-selected')==='true').map(n=>n.dataset.value);
  const expanded = host => [...host.querySelectorAll('button[aria-expanded]')].filter(n=>n.getAttribute('aria-expanded')==='true').map(n=>n.dataset.value);
  const test = async (name, fn) => { await fn(); groups.push(name); };
  const proto = window.HTMLDialogElement.prototype;
  const oldShow = Object.getOwnPropertyDescriptor(proto,'showModal'), oldClose = Object.getOwnPropertyDescriptor(proto,'close');
  const shim = typeof proto.showModal !== 'function' || typeof proto.close !== 'function';
  if (shim) {
    Object.defineProperty(proto,'showModal',{configurable:true,value:function(){if(!this.isConnected)throw new Error('Disconnected dialog');this.setAttribute('open','');(this.querySelector('[autofocus]')||this.querySelector('button:not(:disabled)'))?.focus();}});
    Object.defineProperty(proto,'close',{configurable:true,value:function(){if(!this.open)return;this.removeAttribute('open');this.dispatchEvent(new window.Event('close'));}});
  }
  async function mount(Component, initial={}) {
    const host = doc.createElement('div'); doc.body.append(host); const root=createRoot(host); let setProps, setVisible, props=initial;
    function Harness(){const [p,update]=React.useState(initial),[visible,show]=React.useState(true);props=p;setProps=update;setVisible=show;return h('div',{'data-test-wrapper':'',onFocusCapture:p.testFocus},visible?(p.testStrict?h(React.StrictMode,null,h(Component,p)):h(Component,p)):null);}
    const fixture={host,root,get props(){return props;},update(patch){setProps(old=>({...old,...patch}));},hide(){setVisible(false);},replace(patch={}){setProps(old=>({...old,...patch,key:(old.key||0)+1}));},async patch(patch){await step(()=>fixture.update(patch));},async destroy(){await step(()=>root.unmount());host.remove();mounted.delete(fixture);}};
    mounted.add(fixture);await step(()=>root.render(h(Harness)));return fixture;
  }
  try {
    await test('sources/three-canonical-seven-blobs-and-real-react',async()=>{
      const base=path.join(__dirname,'../src/disclosure'),proof=JSON.parse(fs.readFileSync(path.join(base,'source-verification.json'),'utf8'));
      eq(proof.items.length,3,'three exact IDs');eq(proof.files.length,7,'three sources/four primitives');
      for(const record of proof.files){const bytes=fs.readFileSync(path.join(base,record.local));eq(crypto.createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex'),record.gitBlob,record.path);}
      const code=fs.readFileSync(path.join(base,'index.jsx'),'utf8');ok(code.includes('useState')&&code.includes('useRef')&&code.includes('useLayoutEffect'),'real React hooks');ok(!/dangerouslySetInnerHTML|\.innerHTML|Follow849|iframe/.test(code),'no old DOM wrapper/raw injection');
    });
    await test('normalization/explicit-null-undefined-empty-idempotence',async()=>{
      const inputs=[{value:'a',before:'前',emphasis:'重',after:'后'},{value:'b',content:null,before:'前',emphasis:'重',after:'后'},{value:'c',content:'',before:'不可回退'},{value:'d',content:undefined,before:'不可回退'}];
      const once=api.normalizeDisclosureItems(inputs);deep(api.normalizeDisclosureItems(once),once,'normalization idempotent');deep(once.map(x=>x.content),[null,null,'',''],'explicit blank is retained');
      const f=await mount(api.Tabs01,{items:inputs});for(const [index,id]of ['a','b','c','d'].entries()){await click(f.host.querySelector(`[data-value="${id}"]`));eq(f.host.querySelector('[role=tabpanel]:not([hidden])').textContent,index<2?'前重后':'','structured or explicit empty');}
      await f.patch({items:once,label:'往返'});eq(f.host.querySelector('[role=tabpanel]:not([hidden])').textContent,'','round trip retains explicit blank');await f.destroy();
    });
    await test('tabs/source-three-panels-and-emphasis',async()=>{
      const f=await mount(api.Tabs01);deep(activeTabs(f.host),['overview'],'default overview');eq(f.host.querySelectorAll('[role=tab]').length,3,'three source tabs');eq(f.host.querySelectorAll('[role=tabpanel]:not([hidden])').length,1,'one visible');
      for(const tab of f.host.querySelectorAll('[role=tab]')){const panel=doc.getElementById(tab.getAttribute('aria-controls'));eq(panel.getAttribute('aria-labelledby'),tab.id,'bidirectional IDs');ok(panel.querySelector('strong'),'source emphasis retained');}
      await click(f.host.querySelector('[data-value=roadmap]'));deep(activeTabs(f.host),['roadmap'],'pointer changes');await click(f.host.querySelector('[data-value=overview]'));deep(activeTabs(f.host),['overview'],'returns');await f.destroy();
    });
    await test('accordion/source-multiple-leading-chevron',async()=>{
      const f=await mount(api.Accordion01);deep(expanded(f.host),['item-1'],'first open');const buttons=f.host.querySelectorAll('button');ok(buttons[0].firstElementChild.matches('svg'),'leading source icon');
      await click(buttons[1]);await click(buttons[2]);deep(expanded(f.host),['item-1','item-2','item-3'],'all simultaneous');for(const b of buttons)await click(b);deep(expanded(f.host),[],'all may close');await f.destroy();
    });
    for(const [name,Component,isTabs]of [['tabs',api.Tabs01,true],['accordion',api.Accordion01,false]]){
      await test(name+'/controlled-refusal-and-structured-body-roundtrip',async()=>{
        const props={value:isTabs?'overview':['item-1']};let calls=0;const f=await mount(Component,{...props,onValueChange:()=>{calls++;}}),buttons=[...f.host.querySelectorAll('button')],before=f.host.textContent;
        await click(buttons[1]);eq(calls,1,'one request');deep(isTabs?activeTabs(f.host):expanded(f.host),isTabs?['overview']:['item-1'],'controlled refusal');eq(f.host.textContent,before,'all source prose retained');await f.patch({label:'新标签',items:api.normalizeDisclosureItems(isTabs?api.tabs01Items:api.accordion01Items)});eq(f.host.textContent,before,'metadata/items roundtrip preserves prose');await f.destroy();
      });
      await test(name+'/ordinary-parent-metadata-does-not-swallow-request',async()=>{
        let f;f=await mount(Component,{onValueChange:()=>f.update({label:'回调新标签'})});await click(f.host.querySelectorAll('button')[1]);deep(isTabs?activeTabs(f.host):expanded(f.host),isTabs?['roadmap']:['item-1','item-2'],'batched metadata permits action');await f.destroy();
      });
      await test(name+'/controlled-parent-acceptance-and-release',async()=>{
        let f;f=await mount(Component,{value:isTabs?'overview':['item-1'],onValueChange:next=>{f.update({value:next});return false;}});await click(f.host.querySelectorAll('button')[1]);deep(isTabs?activeTabs(f.host):expanded(f.host),isTabs?['roadmap']:['item-1','item-2'],'owner acceptance beats false');await f.patch({value:undefined,onValueChange:undefined});await click(f.host.querySelectorAll('button')[2]);deep(isTabs?activeTabs(f.host):expanded(f.host),isTabs?['backlog']:['item-1','item-2','item-3'],'release retains accepted state');await f.destroy();
      });
      await test(name+'/callback-disables-current-target-or-unmounts',async()=>{
        let f;const source=isTabs?api.tabs01Items:api.accordion01Items;f=await mount(Component,{onValueChange:()=>f.update({items:source.map((item,i)=>({...item,disabled:i===1}))})});await click(f.host.querySelectorAll('button')[1]);deep(isTabs?activeTabs(f.host):expanded(f.host),isTabs?['overview']:['item-1'],'post-callback target restriction');await f.destroy();
        f=await mount(Component,{onValueChange:()=>f.hide()});await click(f.host.querySelectorAll('button')[1]);eq(f.host.querySelectorAll('[data-component-id]').length,0,'parent destroys without residual nodes');await f.destroy();
      });
      await test(name+'/focus-and-captured-descendants-survive-metadata',async()=>{
        let f,focuses=0;f=await mount(Component,{testFocus:()=>{focuses++;f?.update({label:'聚焦后普通标签'});}});const button=f.host.querySelectorAll('button')[1],span=button.querySelector('span'),svg=button.querySelector('svg'),pathNode=svg?.querySelector('path');await focus(button);eq(doc.activeElement,button,'focus retained');eq(focuses,1,'no synthetic focus rebuild loop');await f.patch({label:'再次更新'});eq(button.querySelector('span'),span,'span preserved');if(svg){eq(button.querySelector('svg'),svg,'SVG retained');eq(svg.querySelector('path'),pathNode,'path retained');}await click(span);deep(isTabs?activeTabs(f.host):expanded(f.host),isTabs?['roadmap']:['item-1','item-2'],'captured descendant click remains live');await f.destroy();
      });
      await test(name+'/keyboard-guard-IME229-modifiers-prevented',async()=>{
        const f=await mount(Component),buttons=f.host.querySelectorAll('button');await focus(buttons[0]);const initial=isTabs?activeTabs(f.host):expanded(f.host);
        for(const extras of [{altKey:true},{ctrlKey:true},{metaKey:true},{shiftKey:true},{isComposing:true},{keyCode:229}]){for(const k of [isTabs?'ArrowRight':'ArrowDown','Home','End','Enter',' ']){const e=await key(buttons[0],k,extras);eq(e.defaultPrevented,false,'unhandled guard preserves default');eq(doc.activeElement,buttons[0],'guard leaves focus');deep(isTabs?activeTabs(f.host):expanded(f.host),initial,'guard leaves state');}}
        await f.patch({onKeyDownCapture:e=>e.preventDefault()});await key(buttons[0],isTabs?'ArrowRight':'ArrowDown');eq(doc.activeElement,buttons[0],'ancestor prevented key untouched');await f.destroy();
      });
      await test(name+'/keyboard-cycle-home-end-and-disabled',async()=>{
        const f=await mount(Component);let buttons=f.host.querySelectorAll('button');await focus(buttons[0]);await key(buttons[0],isTabs?'ArrowLeft':'ArrowUp');eq(doc.activeElement,buttons[2],'wrap previous');await key(buttons[2],'Home');eq(doc.activeElement,buttons[0],'Home');await key(buttons[0],'End');eq(doc.activeElement,buttons[2],'End');
        if(isTabs)deep(activeTabs(f.host),['backlog'],'automatic activation');else deep(expanded(f.host),['item-1'],'accordion arrows only focus');
        await f.patch({disabled:true});eq([...f.host.querySelectorAll('button')].every(b=>b.disabled),true,'global disabled native');const snapshot=isTabs?activeTabs(f.host):expanded(f.host);await click(f.host.querySelectorAll('button')[1]);deep(isTabs?activeTabs(f.host):expanded(f.host),snapshot,'disabled pointer does not act');await f.destroy();
      });
      await test(name+'/dynamic-items-long-label-empty-and-multi-instance',async()=>{
        const f=await mount(Component),g=await mount(Component);const ids=[...f.host.querySelectorAll('[id]'),...g.host.querySelectorAll('[id]')].map(n=>n.id);eq(new Set(ids).size,ids.length,'unique React useId instances');
        const source=isTabs?api.tabs01Items:api.accordion01Items;await f.patch({items:source.slice(1).map(i=>({...i,title:'长中文标签'.repeat(80)}))});ok(f.host.textContent.includes('长中文标签'.repeat(80)),'full labels retained');deep(isTabs?activeTabs(f.host):expanded(f.host),isTabs?['roadmap']:[],'removed selection normalized');await f.patch({items:[]});eq(f.host.querySelectorAll('button').length,0,'empty safe');ok(f.host.textContent.includes('暂无'),'empty explanation');await f.destroy();await g.destroy();
      });
    }
    await test('tabs/manual-mode-rtl-and-external-focus-ownership',async()=>{
      const f=await mount(api.Tabs01,{activationMode:'manual',dir:'rtl'}),buttons=f.host.querySelectorAll('button');await focus(buttons[0]);await key(buttons[0],'ArrowLeft');eq(doc.activeElement,buttons[1],'rtl forward');deep(activeTabs(f.host),['overview'],'manual arrows not select');await key(buttons[1],'Enter');deep(activeTabs(f.host),['roadmap'],'manual Enter activates');const outside=doc.createElement('button');doc.body.append(outside);await f.patch({activationMode:'automatic',onValueChange:()=>outside.focus()});await key(buttons[1],'ArrowLeft');eq(doc.activeElement,outside,'callback external focus preserved');outside.remove();await f.destroy();
    });
    await test('collections/removal-fallback-and-external-focus-not-stolen',async()=>{
      for(const Component of [api.Tabs01,api.Accordion01]){const f=await mount(Component);const source=Component===api.Tabs01?api.tabs01Items:api.accordion01Items;await focus(f.host.querySelectorAll('button')[1]);await f.patch({items:source.filter((_,i)=>i!==1)});ok(f.host.contains(doc.activeElement),'removed owned focus falls back');const outside=doc.createElement('button');doc.body.append(outside);await focus(outside);await f.patch({items:[]});eq(doc.activeElement,outside,'external ownership survives items removal');outside.remove();await f.destroy();}
    });
    await test('dialog/source-native-alert-layout-confirm-local-only',async()=>{
      let confirms=0;const ref={current:null},f=await mount(api.Dialog01,{triggerRef:ref,onConfirm:()=>{confirms++;}}),trigger=f.host.querySelector('.fr7-dialog-trigger');eq(ref.current,trigger,'one rendered trigger ref');eq(f.host.querySelectorAll('button').length,1,'closed has no action descendants');eq(f.host.querySelector('dialog').open,false,'starts closed');await focus(trigger);await click(trigger);const d=f.host.querySelector('dialog');eq(d.open,true,'native showModal opened');eq(d.getAttribute('role'),'alertdialog','alert role');eq(d.querySelectorAll('button').length,2,'only Cancel and Continue');eq(doc.activeElement,d.querySelector('.fr7-dialog-cancel'),'Cancel initial native focus');ok(doc.getElementById(d.getAttribute('aria-labelledby')),'title reference');await click(d);eq(d.open,true,'outside/dialog surface does not dismiss');await click(d.querySelector('.fr7-dialog-confirm'));eq(confirms,1,'one local callback');eq(d.open,false,'confirmation closes');eq(doc.activeElement,trigger,'owned focus restored');ok(f.host.querySelector('[role=status]').textContent.includes('未执行'),'honest local completion');await f.destroy();eq(ref.current,null,'ref cleared');
    });
    await test('dialog/controlled-refusal-native-cancel-and-acceptance',async()=>{
      let requests=0;const f=await mount(api.Dialog01,{open:true,onOpenChange:()=>{requests++;}}),d=f.host.querySelector('dialog');const event=new window.Event('cancel',{cancelable:true});await step(()=>d.dispatchEvent(event));eq(event.defaultPrevented,true,'native cancel default prevented for request ownership');eq(d.open,true,'owner refusal leaves modal');eq(requests,1,'Escape request once');await f.patch({onOpenChange:next=>f.update({open:next})});await click(d.querySelector('.fr7-dialog-cancel'));eq(d.open,false,'owner accepted cancel');await f.destroy();
    });
    await test('dialog/cancel-default-prevented-and-disabled-close-reachable',async()=>{
      const f=await mount(api.Dialog01,{defaultOpen:true,disabled:true});let d=f.host.querySelector('dialog');eq(d.querySelector('.fr7-dialog-confirm').disabled,true,'confirm disabled');eq(d.querySelector('.fr7-dialog-cancel').disabled,false,'Cancel reachable');const prevented=new window.Event('cancel',{cancelable:true});prevented.preventDefault();await step(()=>d.dispatchEvent(prevented));eq(d.open,true,'pre-cancelled native event ignored');await click(d.querySelector('.fr7-dialog-cancel'));eq(d.open,false,'disabled open can close');await click(f.host.querySelector('.fr7-dialog-trigger'));eq(d.open,false,'disabled cannot reopen');await f.destroy();
    });
    await test('dialog/metadata-focus-and-trigger-descendant-stability',async()=>{
      let f,focuses=0;f=await mount(api.Dialog01,{testFocus:()=>{focuses++;f?.update({title:'回焦元数据'});}});const trigger=f.host.querySelector('.fr7-dialog-trigger'),span=trigger.querySelector('span');await focus(trigger);eq(focuses,1,'trigger focus once');await click(span);const cancel=f.host.querySelector('.fr7-dialog-cancel'),cancelSpan=cancel.querySelector('span');eq(doc.activeElement,cancel,'open Cancel focus');await f.patch({description:'长说明'.repeat(100),triggerLabel:'长触发标签'.repeat(40)});eq(trigger.querySelector('span'),span,'trigger span identity');eq(f.host.querySelector('.fr7-dialog-cancel'),cancel,'action identity');eq(cancel.querySelector('span'),cancelSpan,'action span identity');eq(doc.activeElement,cancel,'metadata does not refocus');await click(cancelSpan);eq(f.host.querySelector('dialog').open,false,'captured cancel click alive');await f.destroy();
    });
    await test('dialog/confirm-veto-parent-disabled-and-outside-owner',async()=>{
      let f;f=await mount(api.Dialog01,{defaultOpen:true,onConfirm:()=>false});await click(f.host.querySelector('.fr7-dialog-confirm'));eq(f.host.querySelector('dialog').open,true,'false keeps dialog');await f.patch({onConfirm:()=>f.update({confirmDisabled:true})});await click(f.host.querySelector('.fr7-dialog-confirm'));eq(f.host.querySelector('dialog').open,true,'batched disabled confirmation does not close');const outside=doc.createElement('button');doc.body.append(outside);await f.patch({onCancel:()=>outside.focus()});await click(f.host.querySelector('.fr7-dialog-cancel'));eq(doc.activeElement,outside,'closing never steals callback external focus');outside.remove();await f.destroy();
    });
    await test('dialog/ordinary-parent-metadata-and-owner-release',async()=>{
      let f;f=await mount(api.Dialog01,{onOpenChange:()=>f.update({title:'普通元数据'})});await click(f.host.querySelector('.fr7-dialog-trigger'));eq(f.host.querySelector('dialog').open,true,'metadata opens');await f.patch({open:true});await f.patch({open:undefined});await click(f.host.querySelector('.fr7-dialog-cancel'));eq(f.host.querySelector('dialog').open,false,'release starts from current accepted open');await f.destroy();
    });
    await test('dialog/native-close-refusal-reopens-once-and-cleanup',async()=>{
      const f=await mount(api.Dialog01,{open:true});const d=f.host.querySelector('dialog');await step(()=>d.close());eq(d.open,true,'controlled native close repairs once');await step(()=>d.close());eq(d.open,false,'second refusal does not spin');ok(f.host.querySelector('[role=alert]'),'bounded native error visible');await f.destroy();eq(doc.querySelectorAll('dialog[open]').length,0,'no leaked modal');
    });
    await test('dialog/two-instances-isolation-parent-destruction',async()=>{
      const a=await mount(api.Dialog01),b=await mount(api.Dialog01);const ta=a.host.querySelector('button'),tb=b.host.querySelector('button');ok(ta.getAttribute('aria-controls')!==tb.getAttribute('aria-controls'),'separate IDs');await click(ta);eq(b.host.querySelector('dialog').open,false,'separate state');await a.patch({onOpenChange:()=>a.hide()});await click(a.host.querySelector('.fr7-dialog-cancel'));eq(a.host.querySelector('dialog'),null,'callback parent destruction');await a.destroy();await b.destroy();
    });
    await test('native-form/buttons-do-not-submit-or-reset-enclosing-form',async()=>{
      for(const Component of [api.Tabs01,api.Accordion01,api.Dialog01]){const f=await mount(Component);const form=doc.createElement('form');f.host.replaceWith(form);form.append(f.host);let submits=0,resets=0;form.addEventListener('submit',e=>{submits++;e.preventDefault();});form.addEventListener('reset',()=>resets++);for(const button of f.host.querySelectorAll('button'))eq(button.type,'button','explicit safe type');await click(f.host.querySelector('button'));eq(submits,0,'no business submit');eq(resets,0,'no action reset');const before=f.host.textContent;const opened=f.host.querySelector('dialog')?.open;const values=Component===api.Tabs01?activeTabs(f.host):Component===api.Accordion01?expanded(f.host):[];await step(()=>form.reset());eq(resets,1,'actual external native reset dispatched');eq(f.host.textContent,before,'native reset does not erase React content');eq(f.host.querySelector('dialog')?.open,opened,'native reset does not change React open');deep(Component===api.Tabs01?activeTabs(f.host):Component===api.Accordion01?expanded(f.host):[],values,'native reset does not change selection');await f.destroy();form.remove();}
    });
    await test('react/strict-effect-replay-and-stale-detached-controls',async()=>{
      for(const Component of [api.Tabs01,api.Accordion01,api.Dialog01]){let calls=0;const f=await mount(Component,{testStrict:true,defaultOpen:Component===api.Dialog01,onValueChange:()=>calls++,onOpenChange:()=>calls++}),old=f.host.querySelector('button');if(Component===api.Dialog01)eq(f.host.querySelector('dialog').open,true,'StrictMode replay retains native modal');await f.destroy();await click(old);eq(calls,0,'detached control after unmount has no request');}eq(doc.querySelectorAll('dialog[open]').length,0,'StrictMode leaves no modal after cleanup');
    });
    await test('tabs/automatic-focus-requests-once-and-keeps-external-owner',async()=>{
      let calls=0;const f=await mount(api.Tabs01,{onValueChange:()=>calls++}),buttons=f.host.querySelectorAll('button');await focus(buttons[1]);deep(activeTabs(f.host),['roadmap'],'automatic programmatic/native focus activates');eq(calls,1,'one focus request');await key(buttons[1],'ArrowRight');eq(calls,2,'one request per arrow focus');await f.destroy();
    });
    await test('css/token-scope-contrast-pairs-fulltext-and-reducedmotion-static',async()=>{
      const css=fs.readFileSync(path.join(__dirname,'../src/disclosure/styles.css'),'utf8');ok(css.includes('.fr7.fr7-disclosure'),'scoped');for(const token of ['--fr-ink','--fr-surface','--fr-muted','--fr-line','--fr-accent','--fr-accent-ink','--fr-danger','--fr-radius','--fr-control-radius'])ok(css.includes(token),token);ok(css.includes('.fr7.fr7-disclosure .fr7-dialog-confirm{background:var(--fr-ink'),'explicit primary pair');ok(css.includes('prefers-reduced-motion'),'reduced motion');ok(css.includes('overflow-wrap:anywhere'),'full long text');ok(!/text-overflow:ellipsis|overflow:hidden|@import|url\(/.test(css),'no clipping/external assets');
    });
    if(options.flushSync)await test('sync-owner/flushSync-disable-destroy-replace-and-show-focus',async()=>{
      for(const Component of [api.Tabs01,api.Accordion01]){let f;f=await mount(Component,{onValueChange:()=>options.flushSync(()=>f.update({disabled:true}))});await click(f.host.querySelectorAll('button')[1]);deep(Component===api.Tabs01?activeTabs(f.host):expanded(f.host),Component===api.Tabs01?['overview']:['item-1'],'sync disabled rejects');await f.destroy();f=await mount(Component,{onValueChange:()=>options.flushSync(()=>f.replace({onValueChange:undefined}))});await click(f.host.querySelectorAll('button')[1]);deep(Component===api.Tabs01?activeTabs(f.host):expanded(f.host),Component===api.Tabs01?['overview']:['item-1'],'old request cannot change replacement');await f.destroy();}
      let f;f=await mount(api.Dialog01,{defaultOpen:true,onConfirm:()=>options.flushSync(()=>f.hide())});await click(f.host.querySelector('.fr7-dialog-confirm'));eq(f.host.querySelector('dialog'),null,'sync confirm destroys cleanly');await f.destroy();
    });
    if(options.flushSync)await test('dialog/synchronous-show-focus-metadata-close-replace-external',async()=>{
      for(const mode of ['metadata','close','destroy','replace','outside']){let f,done=false;const outside=doc.createElement('button');doc.body.append(outside);f=await mount(api.Dialog01,{testFocus:event=>{if(done||!event.target.matches('.fr7-dialog-cancel'))return;done=true;if(mode==='outside')outside.focus();else options.flushSync(()=>{if(mode==='metadata')f.update({title:'同步焦点元数据'});else if(mode==='close')f.update({open:false});else if(mode==='destroy')f.hide();else f.replace({open:false,testFocus:undefined});});}});await click(f.host.querySelector('.fr7-dialog-trigger'));ok(done,'native show focus callback occurred');if(mode==='metadata')eq(f.host.querySelector('dialog').open,true,'metadata keeps native open');else if(mode==='outside')eq(doc.activeElement,outside,'external show focus owner retained');else eq(!!f.host.querySelector('dialog[open]'),false,'closing/replacement leaves no stale modal');await f.destroy();outside.remove();}
    });
    if(options.flushSync)await test('dialog/synchronous-action-close-reopen-invalidates-old-close',async()=>{
      let f;f=await mount(api.Dialog01,{open:true,onConfirm:()=>{options.flushSync(()=>f.update({open:false}));options.flushSync(()=>f.update({open:true}));}});await click(f.host.querySelector('.fr7-dialog-confirm'));eq(f.host.querySelector('dialog').open,true,'old Continue does not close new lifecycle');await f.destroy();
    });
    return {assertions,groups:groups.length,testNames:groups,dialogEnvironment:shim?'HTMLDialog API/focus shim':'native API supplied by runner',browser:false,visual:false,realTabTrap:false,optionalSyncOwner:!!options.flushSync};
  } finally {
    for(const f of [...mounted])await f.destroy();
    if(shim){if(oldShow)Object.defineProperty(proto,'showModal',oldShow);else delete proto.showModal;if(oldClose)Object.defineProperty(proto,'close',oldClose);else delete proto.close;}
    globalThis.IS_REACT_ACT_ENVIRONMENT=oldAct;
  }
};
