'use strict';
// Author-side real React/JSDOM behavior; not evidence of browser layout, clipboard permissions or keyboard activation.
exports.run = async function run(window, React, createRoot, assert, C) {
  let assertions = 0, scenarios = 0, serial = 0;
  const check = (value, message) => { assertions++; assert.ok(value, message); };
  const equal = (actual, expected, message) => { assertions++; assert.strictEqual(actual, expected, message); };
  const h = React.createElement, act = React.act;
  const settle = async fn => { await act(async () => { fn?.(); await Promise.resolve(); await Promise.resolve(); }); };
  async function mount(name, props, run, strict = false) {
    scenarios++; const form = window.document.createElement('form'); form.id = `fr7-fourth-test-${++serial}`;
    const host = window.document.createElement('div'); form.append(host); window.document.body.append(form);
    const root = createRoot(host); let current = props, live = true;
    const tree = () => strict ? h(React.StrictMode, null, h(C[name], current)) : h(C[name], current);
    const m = { form, host, root, get button() { return host.querySelector('button'); },
      render: async patch => { current = { ...current, ...patch }; await settle(() => root.render(tree())); },
      sync: patch => { current = { ...current, ...patch }; C.__flushSync(() => root.render(tree())); },
      unmount: async () => { if (live) { live = false; await settle(() => root.unmount()); } }
    };
    try { await settle(() => root.render(tree())); await run(m); }
    finally { await m.unmount(); form.remove(); }
  }
  async function clocked(run) {
    const originalSet = globalThis.setTimeout, originalClear = globalThis.clearTimeout, originalRandom = Math.random;
    const pending = new Map(), history = []; let id = 70000, now = 0;
    globalThis.setTimeout = (fn, delay, ...args) => {
      if (delay !== 1000 && delay !== 2000) return originalSet(fn, delay, ...args);
      const token = ++id; const task = { token, at: now + delay, delay, run: () => fn(...args) };
      pending.set(token, task); history.push(task); return token;
    };
    globalThis.clearTimeout = token => { if (!pending.delete(token)) originalClear(token); };
    const clock = { pending, history, random: value => { Math.random = () => value; },
      tick: async ms => { now += ms; await settle(() => { for (const task of [...pending.values()].filter(task => task.at <= now)) { pending.delete(task.token); task.run(); } }); } };
    try { await run(clock); } finally { globalThis.setTimeout = originalSet; globalThis.clearTimeout = originalClear; Math.random = originalRandom; }
  }
  async function clipboard(writeText, run, secure = true) {
    const old = Object.getOwnPropertyDescriptor(window.navigator, 'clipboard');
    const oldSecure = Object.getOwnPropertyDescriptor(window, 'isSecureContext');
    Object.defineProperty(window.navigator, 'clipboard', { configurable: true, value: writeText === null ? undefined : { writeText } });
    Object.defineProperty(window, 'isSecureContext', { configurable: true, value: secure });
    try { await run(); } finally {
      if (old) Object.defineProperty(window.navigator, 'clipboard', old); else delete window.navigator.clipboard;
      if (oldSecure) Object.defineProperty(window, 'isSecureContext', oldSecure); else delete window.isSecureContext;
    }
  }
  const deferred = () => { let resolve, reject; const promise = new Promise((res, rej) => { resolve = res; reject = rej; }); return { promise, resolve, reject }; };
  const ids = Array.from({ length: 12 }, (_, index) => String(index + 25));
  const toggles = ['26', '27', '29'];
  const labels = {25:'点击演示',26:'切换明暗图标',27:'切换菜单图标',28:'添加新项目',29:'书签',30:'错误',31:'开始使用',32:'发布',33:'收件箱99+',34:'复制',35:'删除',36:'消息3'};
  for (const id of ids) {
    const name = `Button${id}`; check(C[name], `${name}: explicit exact-ID export`); const ref = React.createRef();
    await mount(name, { ref }, async m => {
      equal(m.host.querySelectorAll('button').length, 1, `${name}: one real native control`);
      equal(m.button.dataset.followId, `button-${id}`, `${name}: exact identity`);
      equal(m.button.type, 'button', `${name}: no implicit submit`);
      equal(ref.current, m.button, `${name}: ref always native button`);
      equal(m.button.textContent, labels[id], `${name}: source-specific default composition`);
      equal(m.button.hasAttribute('aria-label'), false, `${name}: no hard-coded aria name`);
      equal(m.button.getAttribute('aria-pressed'), toggles.includes(id) ? 'false' : null, `${name}: only real toggles expose pressed`);
      equal(m.button.hasAttribute('aria-expanded'), false, `${name}: no invented panel expansion`);
      equal(m.host.querySelectorAll('input,textarea,iframe').length, 0, `${name}: no surrogate fields`);
      for (const svg of m.host.querySelectorAll('svg')) {
        equal(svg.getAttribute('aria-hidden'), 'true', `${name}: decorative icon`);
        equal(svg.getAttribute('focusable'), 'false', `${name}: nonfocusable icon`);
        check(svg.querySelector('path'), `${name}: actual original SVG geometry`);
      }
      if (id === '31') equal(m.button.querySelectorAll('svg').length, 0, '31: no invented glyph');
      if (id === '32') equal(m.button.querySelector('[data-slot="share-block"]').tagName, 'SPAN', '32: share block is not another action');
      if (id === '33' || id === '36') equal(m.button.querySelectorAll('[data-slot="badge"]').length, 1, `${name}: own badge`);
      if (id === '34') {
        equal(m.button.querySelectorAll('svg').length, 2, '34: check and copy both retain composition');
        equal(m.button.dataset.status, 'idle', '34: no clipboard action on mount');
      }
      if (id === '25' || id === '34') equal(m.button.querySelector('[role="status"]').getAttribute('aria-live'), 'polite', `${name}: text status exposed`);
      const node = m.button; await settle(() => node.focus());
      await m.render({ title: '完整中文标题', className: 'host-class', 'data-owner': 'yes' });
      equal(m.button, node, `${name}: metadata does not remount`);
      equal(window.document.activeElement, node, `${name}: metadata retains focus`);
      check(node.classList.contains('host-class'), `${name}: class forwarded`); equal(node.dataset.owner, 'yes', `${name}: data forwarded`);
      if (['26','27','28','29','30','36'].includes(id)) check(node.textContent.includes('完整中文标题'), `${name}: title replaces default hidden label`);
      await m.render({ children: '用户指定完整名称', 'aria-label': '显式辅助名称' });
      check(m.button.textContent.includes('用户指定完整名称'), `${name}: caller children survive`);
      equal(m.button.getAttribute('aria-label'), '显式辅助名称', `${name}: explicit accessible name survives`);
    }, true);
    equal(ref.current, null, `${name}: unmount clears ref`);
    for (const guard of [{ disabled: true }, { readOnly: true }, { 'aria-disabled': true }, { 'aria-disabled': 'true' }]) {
      let calls = 0;
      await mount(name, { ...guard, type: 'submit', onClick: () => calls++ }, async m => {
        let submits = 0; m.form.addEventListener('submit', e => { e.preventDefault(); submits++; });
        await settle(() => m.button.click()); equal(calls, 0, `${name}: guard blocks callback`); equal(submits, 0, `${name}: guard blocks native action`);
        equal(m.button.disabled, !!guard.disabled, `${name}: native disabled distinct from readOnly/aria-disabled`);
        equal(m.button.hasAttribute('readonly'), false, `${name}: no invalid native readOnly attr`);
      });
    }
    for (const nativeCancel of [false, true]) {
      let calls = 0, touchedThen = false, target;
      await mount(name, { onClick: event => { calls++; target = event.currentTarget; if (nativeCancel) event.nativeEvent.preventDefault(); else event.preventDefault(); return { get then() { touchedThen = true; throw Error('must ignore callback return'); } }; } }, async m => {
        const node = m.button; await settle(() => node.click()); equal(calls, 1, `${name}: caller once`); equal(target, node, `${name}: native event target`); equal(touchedThen, false, `${name}: callback return ignored`);
        if (toggles.includes(id)) equal(node.getAttribute('aria-pressed'), 'false', `${name}: ${nativeCancel ? 'native' : 'synthetic'} cancellation blocks toggle`);
        if (id === '25' || id === '34') equal(node.dataset.status, 'idle', `${name}: cancellation prevents action`);
        let keys = 0; await m.render({ onKeyDown: () => keys++ });
        for (const key of ['Enter',' ','Escape','ArrowRight']) { const event = new window.KeyboardEvent('keydown',{key,bubbles:true,cancelable:true}); await settle(() => node.dispatchEvent(event)); equal(event.defaultPrevented,false,`${name}: no synthetic ${key} activation`); }
        equal(keys,4,`${name}: native key callback once`); equal(calls,1,`${name}: keydown does not synthesize click`);
      });
    }
    await mount(name, {}, async m => {
      let errors = 0; const marker = `expected-fourth-error-${id}`;
      const listener = e => { if (e.error?.message === marker || e.message === marker) { errors++; e.preventDefault(); } };
      window.addEventListener('error', listener);
      try { await m.render({ onClick: () => { throw Error(marker); } }); await settle(() => m.button.click()); equal(errors,1,`${name}: consumer throw surfaces once`); if(toggles.includes(id))equal(m.button.getAttribute('aria-pressed'),'false',`${name}: throw stops toggle`); if(id==='25'||id==='34')equal(m.button.dataset.status,'idle',`${name}: throw stops async start`); }
      finally { window.removeEventListener('error', listener); }
    });
  }
  // A stable callback ref must not refocus the trigger after a metadata-only render.
  for(const id of ['25','26','27','28','29','34'])for(const strict of [false,true]) {
    let attached=0, detached=0;
    const stableRef=node=>{if(node){attached++;node.focus();}else detached++;};
    await mount(`Button${id}`,{ref:stableRef},async m=>{
      const baselineAttach=attached,baselineDetach=detached,node=m.button;
      const outside=window.document.createElement('input');m.form.append(outside);await settle(()=>outside.focus());
      await m.render({title:'metadata must preserve outside focus'});
      equal(attached,baselineAttach,`${id}/${strict}: stable ref not reattached`);equal(detached,baselineDetach,`${id}/${strict}: stable ref not detached`);equal(window.document.activeElement,outside,`${id}/${strict}: metadata cannot steal outside focus`);equal(m.button,node,`${id}/${strict}: stable ref target unchanged`);
      let replacementNode,cleanups=0;
      const replacement=value=>{replacementNode=value;return()=>{cleanups++;};};
      await m.render({ref:replacement});equal(replacementNode,node,`${id}/${strict}: new ref identity receives native target`);equal(detached,baselineDetach+1,`${id}/${strict}: previous ref detached once on identity change`);
      await m.render({title:'replacement metadata'});equal(cleanups,0,`${id}/${strict}: callback cleanup not called on metadata`);
      await m.unmount();equal(cleanups,1,`${id}/${strict}: React19 callback cleanup once on unmount`);
    },strict);
  }
  // Exact owner/value transitions, accepted values, reset cancellation and same-value synchronous feedback.
  for (const id of toggles) {
    const name = `Button${id}`;
    await mount(name, {}, async m => {
      const node = m.button; await settle(() => node.click()); equal(node.getAttribute('aria-pressed'),'true',`${name}: uncontrolled first toggle`);
      await settle(() => node.click()); equal(node.getAttribute('aria-pressed'),'false',`${name}: reversible second toggle`);
      await m.render({ pressed: true }); equal(m.button,node,`${name}: takeover retains node`); equal(node.getAttribute('aria-pressed'),'true',`${name}: takeover accepts owner true`);
      let proposals=[]; await m.render({onPressedChange:value=>proposals.push(value)}); await settle(()=>node.click()); equal(node.getAttribute('aria-pressed'),'true',`${name}: controlled rejection stays accepted`); equal(proposals.join(','),'false',`${name}: proposal delivered`);
      await m.render({pressed:undefined}); equal(node.getAttribute('aria-pressed'),'true',`${name}: release retains accepted true`);
      await settle(()=>node.click()); equal(node.getAttribute('aria-pressed'),'false',`${name}: released control toggles`);
      await m.render({defaultPressed:true}); equal(node.getAttribute('aria-pressed'),'false',`${name}: new default does not mutate`);
      await settle(()=>node.click()); await settle(()=>m.form.reset()); equal(node.getAttribute('aria-pressed'),'false',`${name}: original default baseline restored`);
      await settle(()=>node.click()); const prevent=e=>e.preventDefault(); m.form.addEventListener('reset',prevent); await settle(()=>m.form.reset()); equal(node.getAttribute('aria-pressed'),'true',`${name}: canceled native reset retained`); m.form.removeEventListener('reset',prevent);
      await m.render({resetKey:1}); equal(node.getAttribute('aria-pressed'),'false',`${name}: explicit reset baseline`);
      await m.render({pressed:true,resetKey:2}); await settle(()=>m.form.reset()); equal(node.getAttribute('aria-pressed'),'true',`${name}: controlled reset cannot override parent`);
    },true);
    await mount(name,{pressed:true,resetKey:0},async m=>{
      await m.render({pressed:undefined,resetKey:1});equal(m.button.getAttribute('aria-pressed'),'false',`${name}: simultaneous release/reset chooses original baseline`);
      await settle(()=>m.button.click());equal(m.button.getAttribute('aria-pressed'),'true',`${name}: released/reset instance remains interactive`);
      await m.render({pressed:false,resetKey:2});equal(m.button.getAttribute('aria-pressed'),'false',`${name}: simultaneous takeover/reset honors owner`);
    });
    if(C.__flushSync) {
      for (const mode of ['metadata','same','change','disable','readonly','unmount']) await mount(name,{pressed:false},async m=>{
        let count=0; const onClick=()=>{ count++; if(mode==='unmount')C.__flushSync(()=>m.root.render(null)); else m.sync(mode==='metadata'?{title:'new'}:mode==='same'?{pressed:false}:mode==='change'?{pressed:true}:mode==='disable'?{disabled:true}:{readOnly:true}); };
        let proposals=0; await m.render({onClick,onPressedChange:()=>proposals++});const node=m.button;await settle(()=>node.click());equal(count,1,`${name}: sync ${mode} click once`);
        equal(proposals,['metadata','same'].includes(mode)?1:0,`${name}: sync ${mode} correctly preserves/cancels proposal`);
        if(mode!=='unmount')equal(m.button,node,`${name}: sync ${mode} node preserved`);else equal(m.host.childNodes.length,0,`${name}: sync unmount remains empty`);
      });
      await mount(name,{},async m=>{let proposals=0;await m.render({onPressedChange:()=>{proposals++;m.sync({title:'metadata in proposal'});}});await settle(()=>m.button.click());equal(proposals,1,`${name}: proposal metadata once`);equal(m.button.getAttribute('aria-pressed'),'true',`${name}: proposal metadata does not swallow local state`);});
      await mount(name,{pressed:false},async m=>{let proposals=0;await m.render({onPressedChange:value=>{proposals++;m.sync({pressed:value});}});await settle(()=>m.button.click());equal(proposals,1,`${name}: controlled synchronous accept once`);equal(m.button.getAttribute('aria-pressed'),'true',`${name}: controlled accept true`);await settle(()=>m.button.click());equal(m.button.getAttribute('aria-pressed'),'false',`${name}: controlled accept reverse`);});
      await mount(name,{pressed:false},async m=>{let proposals=0;await m.render({onPressedChange:()=>{proposals++;m.sync({pressed:false,title:'same'});}});await settle(()=>m.button.click());equal(proposals,1,`${name}: controlled same-value reject exactly once`);equal(m.button.getAttribute('aria-pressed'),'false',`${name}: same-value remains controlled`);});
    }
    await mount(name,{},async first=>{await mount(name,{},async second=>{await settle(()=>first.button.click());equal(first.button.getAttribute('aria-pressed'),'true',`${name}: instance A toggled`);equal(second.button.getAttribute('aria-pressed'),'false',`${name}: instance B isolated`);});});
  }
  // Fixed source 1000ms random simulation, no real save operation.
  await clocked(async clock=>{
    for(const random of [0.9,0.1,0.5])await mount('Button25',{},async m=>{
      clock.random(random);await settle(()=>m.button.click());equal(m.button.dataset.status,'loading','25: loading immediately');equal(m.button.disabled,true,'25: actual disabled while loading');equal(m.button.getAttribute('aria-busy'),'true','25: busy while pending');check(m.button.querySelector('[data-icon="spinner"]'),'25: only loading shows spinner');
      await clock.tick(999);equal(m.button.dataset.status,'loading','25: not before 1000ms');await clock.tick(1);equal(m.button.dataset.status,random>0.5?'success':'error','25: strict random threshold');equal(m.button.disabled,false,'25: finished retry enabled');
      await settle(()=>m.button.click());equal(m.button.dataset.status,'loading','25: next click restarts source demo');await m.render({resetKey:1});equal(m.button.dataset.status,'idle','25: reset cancels no restart');const old=clock.history.at(-1);await settle(()=>old.run());equal(m.button.dataset.status,'idle','25: stale cleared timer cannot update');
    },true);
    for(const mode of ['metadata','same','disable','readonly','reset','unmount'])await mount('Button25',{resetKey:0},async m=>{
      await m.render({onClick:()=>{if(mode==='unmount')C.__flushSync(()=>m.root.render(null));else m.sync(mode==='metadata'?{title:'updated'}:mode==='same'?{resetKey:0}:mode==='disable'?{disabled:true}:mode==='readonly'?{readOnly:true}:{resetKey:1});}});
      const before=clock.history.length;await settle(()=>m.button.click());equal(clock.history.length-before,['metadata','same'].includes(mode)?1:0,`25: sync ${mode} timer ownership`);
    });
    await mount('Button25',{},async m=>{await settle(()=>m.button.click());const old=clock.history.at(-1);await m.render({disabled:true});equal(m.button.dataset.status,'idle','25: external disable cancels pending');await settle(()=>old.run());equal(m.button.dataset.status,'idle','25: disabled stale timer ignored');});
    await mount('Button25',{},async m=>{await settle(()=>m.button.click());const old=clock.history.at(-1);await m.unmount();await settle(()=>old.run());equal(m.host.childNodes.length,0,'25: unmounted timer cannot update');});
    await mount('Button25',{},async m=>{await settle(()=>m.button.click());await m.render({title:'harmless while pending'});await clock.tick(1000);check(['success','error'].includes(m.button.dataset.status),'25: metadata while pending does not cancel');});
    await mount('Button25',{},async first=>{await mount('Button25',{},async second=>{await settle(()=>first.button.click());equal(second.button.dataset.status,'idle','25: independent instance state');await settle(()=>second.button.click());await first.render({resetKey:1});await clock.tick(1000);equal(first.button.dataset.status,'idle','25: first reset isolated');check(['success','error'].includes(second.button.dataset.status),'25: second completes independently');});});
  });
  // Tooltip immediate focus/pointer behavior, ownership-safe callbacks and topmost Escape.
  const pointer = (target,type,relatedTarget=null) => {const event=new window.MouseEvent(type,{bubbles:true,relatedTarget,cancelable:true});Object.defineProperty(event,'pointerType',{value:'mouse'});target.dispatchEvent(event);};
  await mount('Button28',{'aria-describedby':'external-description',tooltip:'这是很长的中文提示内容，用来确认完整文本保留并允许样式自动换行。'},async m=>{
    equal(m.host.querySelector('[role="tooltip"]'),null,'28: closed initially');await settle(()=>m.button.focus());let tip=m.host.querySelector('[role="tooltip"]');check(tip,'28: focus opens actual tooltip');check(m.button.getAttribute('aria-describedby').includes(`external-description ${tip.id}`),'28: merges owner description');check(tip.textContent.includes('完整文本'),'28: long content retained');check(tip.querySelector('.fr7-fb-tooltip-arrow'),'28: arrow part retained');
    await settle(()=>m.button.blur());equal(m.host.querySelector('[role="tooltip"]'),null,'28: blur exits');await settle(()=>pointer(m.button,'pointerover'));tip=m.host.querySelector('[role="tooltip"]');check(tip,'28: hover opens');await settle(()=>pointer(m.button,'pointerout',tip));check(m.host.querySelector('[role="tooltip"]'),'28: movement into tooltip keeps it open');await settle(()=>pointer(tip,'pointerout',window.document.body));equal(m.host.querySelector('[role="tooltip"]'),null,'28: leaving both exits');
    await settle(()=>m.button.focus());await settle(()=>m.button.dispatchEvent(new window.KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true})));equal(m.host.querySelector('[role="tooltip"]'),null,'28: Escape closes');equal(window.document.activeElement,m.button,'28: Escape does not blur trigger');
    await settle(()=>m.button.blur());let clicks=0;await m.render({onClick:()=>clicks++});await settle(()=>m.button.focus());await settle(()=>m.button.click());equal(clicks,1,'28: tooltip does not swallow button click');equal(m.host.querySelector('[role="tooltip"]'),null,'28: click dismisses tooltip');
  },true);
  await mount('Button28',{},async first=>{await mount('Button28',{},async second=>{await settle(()=>pointer(first.button,'pointerover'));await settle(()=>pointer(second.button,'pointerover'));const a=first.host.querySelector('[role="tooltip"]'),b=second.host.querySelector('[role="tooltip"]');check(a.id!==b.id,'28: unique ids across instances');await settle(()=>window.document.dispatchEvent(new window.KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true})));check(first.host.querySelector('[role="tooltip"]'),'28: lower tooltip preserved by first Escape');equal(second.host.querySelector('[role="tooltip"]'),null,'28: topmost tooltip closed');await settle(()=>window.document.dispatchEvent(new window.KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true})));equal(first.host.querySelector('[role="tooltip"]'),null,'28: second Escape closes lower');});});
  for(const mode of ['metadata','disable','unmount','cancel','native-cancel'])await mount('Button28',{},async m=>{
    await m.render({onFocus:event=>{if(mode==='unmount')C.__flushSync(()=>m.root.render(null));else if(mode==='cancel')event.preventDefault();else if(mode==='native-cancel')event.nativeEvent.preventDefault();else m.sync(mode==='disable'?{disabled:true}:{title:'updated focus metadata'});}});await settle(()=>{ if(mode==='native-cancel')m.button.dispatchEvent(new window.FocusEvent('focusin',{bubbles:true,cancelable:true}));else m.button.focus(); });equal(!!m.host.querySelector('[role="tooltip"]'),mode==='metadata',`28: focus ${mode} correctly accepted/cancelled`);
  });
  // Candidate geometry tests use explicit rectangles, not JSDOM's zero-layout engine.
  // They validate placement arithmetic and cleanup only; rendered browser proof remains pending.
  const originalWidth = Object.getOwnPropertyDescriptor(window, 'innerWidth');
  const originalHeight = Object.getOwnPropertyDescriptor(window, 'innerHeight');
  const originalObserver = window.ResizeObserver;
  let observers = [];
  window.ResizeObserver = class { constructor(callback) { this.callback=callback; this.targets=[]; this.disconnected=false; observers.push(this); } observe(target){this.targets.push(target);} disconnect(){this.disconnected=true;} };
  Object.defineProperty(window,'innerWidth',{configurable:true,value:390});Object.defineProperty(window,'innerHeight',{configurable:true,value:600});
  const rect=(left,top,width,height)=>({left,top,width,height,right:left+width,bottom:top+height,x:left,y:top,toJSON(){return this;}});
  try {
    await mount('Button28',{tooltip:'长中文提示内容'.repeat(40)},async m=>{
      let anchor=rect(280,200,44,44), boundary=rect(49,100,289,400),tipBox=rect(0,0,320,80);
      const shell=m.host.firstElementChild;
      m.button.getBoundingClientRect=()=>anchor;shell.getBoundingClientRect=()=>anchor;m.host.getBoundingClientRect=()=>boundary;
      await settle(()=>m.button.focus());let tip=m.host.querySelector('[role="tooltip"]');tip.getBoundingClientRect=()=>tipBox;
      await settle(()=>window.dispatchEvent(new window.Event('resize')));
      equal(Number.parseFloat(tip.style.maxWidth),281,'28: width bounded by actual parent/viewport intersection');
      equal(Number.parseFloat(tip.style.left)+anchor.left,53,'28: near-right anchor clamps tooltip left');
      check(Number.parseFloat(tip.style.left)+anchor.left+281<=334,'28: near-right tooltip does not leave parent');
      equal(tip.dataset.side,'top','28: enough above space chooses top');equal(Number.parseFloat(tip.style.top)+anchor.top,120,'28: measured height determines top');
      anchor=rect(280,520,44,44);tipBox=rect(0,0,281,900);await settle(()=>window.dispatchEvent(new window.Event('scroll')));
      equal(tip.dataset.side,'top','28: very long text near bottom chooses above');equal(Number.parseFloat(tip.style.getPropertyValue('--fb-tip-max-height')),512,'28: scroll height uses actual available-above space');equal(Number.parseFloat(tip.style.top)+anchor.top,8,'28: huge above tooltip starts at viewport inset');
      anchor=rect(280,10,44,44);await settle(()=>observers.at(-1).callback([]));
      equal(tip.dataset.side,'bottom','28: near-top long text flips below');equal(Number.parseFloat(tip.style.getPropertyValue('--fb-tip-max-height')),538,'28: below height fits remaining viewport');equal(Number.parseFloat(tip.style.top)+anchor.top,54,'28: below tooltip stays adjacent');
      check(observers.at(-1).targets.includes(m.button)&&observers.at(-1).targets.includes(tip),'28: observer watches trigger and content');
      const observer=observers.at(-1);await m.render({readOnly:true});equal(m.host.querySelector('[role="tooltip"]'),null,'28: readOnly closes actual open tooltip');equal(observer.disconnected,true,'28: closed tooltip disconnects observer');
      await settle(()=>{window.dispatchEvent(new window.Event('resize'));observer.callback([]);});equal(m.host.querySelector('[role="tooltip"]'),null,'28: stale resize callbacks cannot reopen readonly tooltip');
      await m.render({readOnly:false});await settle(()=>m.button.blur());await settle(()=>m.button.focus());check(m.host.querySelector('[role="tooltip"]'),'28: explicit new focus reopens unlocked tooltip');const last=observers.at(-1);await m.unmount();equal(last.disconnected,true,'28: unmount disconnects observer');await settle(()=>{window.dispatchEvent(new window.Event('scroll'));last.callback([]);});equal(m.host.childNodes.length,0,'28: stale listeners after unmount inert');
    });
  } finally { if(originalWidth)Object.defineProperty(window,'innerWidth',originalWidth);if(originalHeight)Object.defineProperty(window,'innerHeight',originalHeight);window.ResizeObserver=originalObserver; }
  // Clipboard is mocked only here. No test claims OS clipboard or permission success.
  await clocked(async clock=>{
    let calls=0, copied=[];const request=deferred();
    await clipboard(text=>{calls++;equal(text,'用户提供的中文文本','34: exact host text');return request.promise;},async()=>{
      await mount('Button34',{text:'用户提供的中文文本',onCopy:text=>copied.push(text)},async m=>{
        equal(calls,0,'34: never copy during mount');await settle(()=>m.button.click());equal(calls,1,'34: one explicit activation');equal(m.button.dataset.status,'copying','34: waits actual Promise');equal(m.button.disabled,true,'34: pending locks duplicate copy');await settle(()=>m.button.click());equal(calls,1,'34: repeated pending click cannot duplicate');await clock.tick(2000);equal(m.button.dataset.status,'copying','34: elapsed time alone cannot report success');
        await settle(()=>request.resolve());equal(m.button.dataset.status,'copied','34: resolved Promise success');equal(copied.join(','),'用户提供的中文文本','34: success callback exact text');equal(m.button.querySelector('.fr7-fb-copy-check').dataset.visible,'true','34: check visible');equal(m.button.querySelector('.fr7-fb-copy-original').dataset.visible,'false','34: copy hidden');await clock.tick(1999);equal(m.button.dataset.status,'copied','34: full 2000ms feedback');await clock.tick(1);equal(m.button.dataset.status,'idle','34: feedback expires');equal(m.button.disabled,false,'34: retry enabled');
      },true);
    });
    for(const kind of ['missing','insecure','throw','reject','invalid']) {
      const marker=new Error(`clipboard-${kind}`);let errors=[];let writes=0;
      const writer=kind==='missing'?null:()=>{writes++;if(kind==='throw')throw marker;if(kind==='reject')return Promise.reject(marker);if(kind==='invalid')return undefined;return Promise.resolve();};
      await clipboard(writer,async()=>{await mount('Button34',{onCopyError:error=>errors.push(error)},async m=>{await settle(()=>m.button.click());equal(m.button.dataset.status,'error',`34: ${kind} explicit error state`);equal(m.button.textContent,'复制失败',`34: ${kind} readable failure`);equal(errors.length,1,`34: ${kind} one error notification`);equal(m.button.disabled,false,`34: ${kind} retry allowed`);if(kind==='insecure'||kind==='missing')equal(writes,0,`34: ${kind} no write attempt`);if(kind==='throw'||kind==='reject')equal(errors[0],marker,`34: ${kind} original error identity`);});},kind!=='insecure');
    }
    for(const mode of ['reset','text','disable','readonly','unmount']) {
      let notifications=0;const old=deferred();await clipboard(()=>old.promise,async()=>{await mount('Button34',{onCopy:()=>notifications++,onCopyError:()=>notifications++},async m=>{
        await settle(()=>m.button.click());if(mode==='unmount')await m.unmount();else await m.render(mode==='reset'?{resetKey:1}:mode==='text'?{text:'new'}:mode==='disable'?{disabled:true}:{readOnly:true});await settle(()=>old.resolve());equal(notifications,0,`34: ${mode} stale resolution ignored`);if(mode!=='unmount')equal(m.button.dataset.status,'idle',`34: ${mode} does not restart`);else equal(m.host.childNodes.length,0,'34: unmount stays empty');
      });});
    }
    const old=deferred(),fresh=deferred();let index=0,notifications=0;
    await clipboard(()=>[old.promise,fresh.promise][index++],async()=>{await mount('Button34',{onCopy:()=>notifications++},async m=>{await settle(()=>m.button.click());await m.render({resetKey:1});await settle(()=>m.button.click());await settle(()=>old.resolve());equal(m.button.dataset.status,'copying','34: stale success cannot complete replacement');equal(notifications,0,'34: stale success no callback');await settle(()=>fresh.resolve());equal(m.button.dataset.status,'copied','34: replacement resolves independently');equal(notifications,1,'34: replacement callback once');const staleTimer=clock.history.at(-1);await m.render({resetKey:2});await settle(()=>staleTimer.run());equal(m.button.dataset.status,'idle','34: old feedback timer cannot change reset');});});
    for(const mode of ['metadata','same','disable','readonly','reset','text','unmount']) {
      let writes=0;await clipboard(()=>{writes++;return Promise.resolve();},async()=>{await mount('Button34',{text:'same',resetKey:0},async m=>{
        await m.render({onClick:()=>{if(mode==='unmount')C.__flushSync(()=>m.root.render(null));else m.sync(mode==='metadata'?{title:'updated'}:mode==='same'?{text:'same',resetKey:0}:mode==='disable'?{disabled:true}:mode==='readonly'?{readOnly:true}:mode==='reset'?{resetKey:1}:{text:'changed'});}});await settle(()=>m.button.click());equal(writes,['metadata','same'].includes(mode)?1:0,`34: synchronous ${mode} write ownership`);
      });});
    }
    await clipboard(()=>Promise.resolve(),async()=>{await mount('Button34',{},async m=>{await m.render({onCopy:()=>m.sync({resetKey:1})});await settle(()=>m.button.click());equal(m.button.dataset.status,'idle','34: synchronous success reset wins');equal(clock.pending.size,0,'34: success reset cleans timer');});});
    const a=deferred(),b=deferred();let count=0;await clipboard(()=>[a.promise,b.promise][count++],async()=>{await mount('Button34',{},async first=>{await mount('Button34',{},async second=>{await settle(()=>first.button.click());await settle(()=>second.button.click());await settle(()=>a.resolve());equal(first.button.dataset.status,'copied','34: first instance resolved');equal(second.button.dataset.status,'copying','34: second instance independent');await settle(()=>b.reject(Error('second failed')));equal(second.button.dataset.status,'error','34: second independent failure');});});});
  });
  // Native form defaults retained; action semantics never replace HTML behavior.
  for(const id of ids.filter(id=>!['25','34'].includes(id)))for(const type of ['submit','reset'])await mount(`Button${id}`,{type,name:'intent',value:id},async m=>{
    const input=window.document.createElement('input');input.defaultValue='original';input.value='edited';m.form.append(input);let submits=0,submitter;
    m.form.addEventListener('submit',e=>{e.preventDefault();submits++;submitter=e.submitter;});await settle(()=>m.button.click());equal(m.button.name,'intent',`${id}: native name`);equal(m.button.value,id,`${id}: native value`);
    if(type==='submit'){equal(submits,1,`${id}: actual submit once`);equal(submitter,m.button,`${id}: native submitter`);}else equal(input.value,'original',`${id}: actual reset`);
  });
  for(const id of ['33','36'])await mount(`Button${id}`,{},async m=>{const node=m.button;await m.render({count:42,children:'工作区未读通知'});equal(m.button,node,`${id}: badge update keeps node`);equal(node.querySelector('[data-slot="badge"]').textContent,'42',`${id}: count belongs to host`);});
  const fs=require('node:fs'),path=require('node:path'),jsx=fs.readFileSync(path.join(__dirname,'../src/fourth-buttons/index.jsx'),'utf8'),css=fs.readFileSync(path.join(__dirname,'../src/fourth-buttons/styles.css'),'utf8');
  check(!/dangerouslySetInnerHTML|\.innerHTML|mountController|setInterval|fetch\(/.test(jsx),'Direct React no DOM-controller/network facade');
  for(const fragment of ['min-height: 44px','width: 32px; height: 32px','width: 28px; height: 28px','--fb-height: 42px','background-position: 99% center','background-size: 200% auto','top: -10px; right: -10px','overflow-wrap: anywhere','role="status"'])check((fragment==='role="status"'?jsx:css).includes(fragment),`Exact composition/semantics ${fragment}`);
  check(css.includes('(prefers-reduced-motion: reduce)')&&css.includes('[data-motion="off"]')&&css.includes('[data-motion="reduce"]'),'All reduced-motion selectors authored');check(css.includes('(forced-colors: active)'),'Forced-colors selectors authored');
  return {kind:'author-react-fourth-buttons-regression',ids:12,scenarios,assertions,synchronousOwnerTests:!!C.__flushSync,fakeClock:true,mockedClipboard:true,browser:false,realKeyboard:false,realLayout:false,visual:false,realClipboard:false};
};
