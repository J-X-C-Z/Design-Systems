'use strict';
// DOM/React contract checks only. These do not compute or prove Chrome AX names,
// screen-reader announcements, native activation, layout, or OS clipboard contents.
exports.run = async function run(window, React, createRoot, assert, C) {
  let assertions = 0, scenarios = 0, serial = 0;
  const equal = (a, b, message) => { assertions++; assert.strictEqual(a, b, message); };
  const check = (value, message) => { assertions++; assert.ok(value, message); };
  const h = React.createElement;
  const settle = async fn => { await React.act(async () => { fn?.(); await Promise.resolve(); await Promise.resolve(); }); };
  const deferred = () => { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; };
  async function mount(id, props, run, strict = false) {
    scenarios++;
    const host = window.document.createElement('div'); window.document.body.append(host);
    const external = window.document.createElement('span'); external.id = `host-name-${++serial}`; external.textContent = '调用者关联名称'; host.append(external);
    const mountPoint = window.document.createElement('div'); host.append(mountPoint);
    const root = createRoot(mountPoint); let current = typeof props === 'function' ? props(external.id) : props, live = true;
    const tree = () => strict ? h(React.StrictMode, null, h(C[`Button${id}`], current)) : h(C[`Button${id}`], current);
    const m = { host, external, get button() { return mountPoint.querySelector('button'); },
      render: async patch => { current = { ...current, ...patch }; await settle(() => root.render(tree())); },
      unmount: async () => { if (live) { live = false; await settle(() => root.unmount()); } } };
    try { await settle(() => root.render(tree())); await run(m); }
    finally { await m.unmount(); host.remove(); }
  }
  async function mockedClock(run) {
    const oldSet = globalThis.setTimeout, oldClear = globalThis.clearTimeout, oldRandom = Math.random;
    let now = 0, serial = 90000; const pending = new Map();
    globalThis.setTimeout = (fn, delay, ...args) => { if (![1000, 2000].includes(delay)) return oldSet(fn, delay, ...args); const id = ++serial; pending.set(id, { at: now + delay, run: () => fn(...args) }); return id; };
    globalThis.clearTimeout = id => { if (!pending.delete(id)) oldClear(id); };
    const clock = { pending, random: number => { Math.random = () => number; }, tick: async ms => { now += ms; await settle(() => { for (const [id, task] of [...pending].filter(([, task]) => task.at <= now)) { pending.delete(id); task.run(); } }); } };
    try { await run(clock); } finally { globalThis.setTimeout = oldSet; globalThis.clearTimeout = oldClear; Math.random = oldRandom; }
  }
  async function mockedClipboard(writer, run) {
    const old = Object.getOwnPropertyDescriptor(window.navigator, 'clipboard'), secure = Object.getOwnPropertyDescriptor(window, 'isSecureContext');
    Object.defineProperty(window.navigator, 'clipboard', { configurable: true, value: { writeText: writer } });
    Object.defineProperty(window, 'isSecureContext', { configurable: true, value: true });
    try { await run(); } finally { if (old) Object.defineProperty(window.navigator, 'clipboard', old); else delete window.navigator.clipboard; if (secure) Object.defineProperty(window, 'isSecureContext', secure); else delete window.isSecureContext; }
  }
  const inspect = (m, expectedText, expectedRelation = 'fallback') => {
    const button = m.button, live = button.querySelector('[role="status"]');
    equal(button.querySelectorAll('[role="status"]').length, 1, 'one existing live region, no duplicate announcement node');
    equal(live.getAttribute('aria-live'), 'polite', 'original live notification preserved');
    check(live.id && !/\s/.test(live.id), 'stable nonempty IDREF-safe label ID');
    equal(window.document.getElementById(live.id), live, 'label ID resolves to this visible live element');
    equal(live.textContent, expectedText, 'current React label text is preserved');
    if (expectedRelation === 'fallback') { equal(button.getAttribute('aria-labelledby'), live.id, 'default name relation targets current live text'); equal(button.getAttribute('aria-label'), null, 'no hard-coded flattened string name'); }
    else { equal(button.getAttribute('aria-labelledby'), expectedRelation.labelledBy, 'caller aria-labelledby preserved or omitted'); equal(button.getAttribute('aria-label'), expectedRelation.label, 'caller aria-label preserved or omitted'); }
    return live;
  };
  const defaults = {25:'点击演示',34:'复制'};
  const namingCases = [
    ['omitted', {}, 'fallback'],
    ['label-null', {'aria-label':null}, 'fallback'],
    ['label-undefined', {'aria-label':undefined}, 'fallback'],
    ['labelledby-null', {'aria-labelledby':null}, 'fallback'],
    ['labelledby-undefined', {'aria-labelledby':undefined}, 'fallback'],
    ['both-null', {'aria-labelledby':null,'aria-label':null}, 'fallback'],
    ['explicit-label', {'aria-label':'调用者名称'}, {label:'调用者名称',labelledBy:null}],
    ['empty-label', {'aria-label':''}, {label:'',labelledBy:null}],
    ['empty-labelledby', {'aria-labelledby':''}, {label:null,labelledBy:''}],
    ['null-labelledby-with-label', {'aria-labelledby':null,'aria-label':'调用者名称'}, {label:'调用者名称',labelledBy:null}],
    ['empty-labelledby-with-label', {'aria-labelledby':'','aria-label':'调用者名称'}, {label:'调用者名称',labelledBy:''}],
    ['invalid-explicit-target', {'aria-labelledby':'host-intentional-missing-target'}, {label:null,labelledBy:'host-intentional-missing-target'}]
  ];
  for (const id of [25,34]) {
    for (const [name, props, relation] of namingCases) await mount(id, props, async m => {
      const label = inspect(m, defaults[id], relation), node = m.button;
      await m.render({ title:`metadata-${name}` });
      equal(m.button, node, 'metadata keeps button node'); equal(inspect(m, defaults[id], relation), label, 'metadata keeps live label node');
    });
    for (const both of [false,true]) await mount(id, externalId => ({'aria-labelledby':externalId,...(both?{'aria-label':'次级显式名称'}:{})}), async m => {
      const relation = {label:both?'次级显式名称':null,labelledBy:m.external.id};
      inspect(m, defaults[id], relation);
      await m.render({'aria-labelledby':undefined});
      inspect(m, defaults[id], both?{label:'次级显式名称',labelledBy:null}:'fallback');
      await m.render({'aria-label':undefined}); inspect(m, defaults[id]);
      await m.render({'aria-label':'更新的调用者名称'}); inspect(m, defaults[id], {label:'更新的调用者名称',labelledBy:null});
    });
    let mounts=0;
    function ChildLabel({ suffix }) { React.useLayoutEffect(() => { mounts++; }, []); return h('span',{'data-custom-child':'true'}, h('strong',null,'完整的长中文操作标签：'), suffix, h('span',{'aria-hidden':'true'},'装饰')); }
    await mount(id, {children:h(ChildLabel,{suffix:'第一版'})}, async m => {
      const initial=inspect(m,'完整的长中文操作标签：第一版装饰');
      equal(mounts,1,'custom children mounted once, not cloned into another naming node');
      equal(m.button.querySelectorAll('[data-custom-child]').length,1,'one original child structure');
      equal(initial.querySelector('[aria-hidden]').textContent,'装饰','original hidden descendant semantics retained');
      await m.render({children:h(ChildLabel,{suffix:'第二版'})});
      equal(inspect(m,'完整的长中文操作标签：第二版装饰'),initial,'updated children keep same label identity'); equal(mounts,1,'custom child not remounted on props update');
    });
    for (const strict of [false,true]) {
      let attached=0,detached=0;const ref=node=>{if(node)attached++;else detached++;};
      await mount(id,{ref},async m=>{
        const button=m.button,label=inspect(m,defaults[id]),oldId=label.id,initialAttach=attached,initialDetach=detached;
        const outside=window.document.createElement('input');m.host.append(outside);outside.focus();
        for(let i=0;i<3;i++) await m.render({title:`rerender-${i}`,children:`新标签 ${i}`});
        equal(m.button,button,'rerenders keep native ref target');equal(inspect(m,'新标签 2').id,oldId,'useId stable across rerenders');
        equal(attached,initialAttach,'stable callback ref not reattached');equal(detached,initialDetach,'stable callback ref not detached');equal(window.document.activeElement,outside,'metadata cannot steal focus');
        let held;await m.render({ref:node=>{held=node;}});equal(held,button,'replacement ref receives native button');
        await m.render({disabled:true});equal(m.button.disabled,true,'disabled remains native');inspect(m,'新标签 2');await settle(()=>m.button.click());equal(m.button.dataset.status,'idle','disabled click cannot start operation');
      },strict);
    }
    for (const props of [{readOnly:true},{'aria-disabled':true},{'aria-disabled':'true'}]) await mount(id,props,async m=>{inspect(m,defaults[id]);await settle(()=>m.button.click());equal(m.button.dataset.status,'idle','non-native lock retains idle');});
  }
  await mount(25,{},async first=>{await mount(34,{},async second=>{check(inspect(first,'点击演示').id!==inspect(second,'复制').id,'cross-component instance IDs unique');});});
  await mount(34,{},async first=>{await mount(34,{},async second=>{check(inspect(first,'复制').id!==inspect(second,'复制').id,'same-component instance IDs unique');});});
  // Four naming modes through every state; custom ReactNodes are never stringified.
  const modes=['default','custom','aria-label','aria-labelledby'];
  await mockedClock(async clock=>{
    for(const mode of modes) {
      const idle=mode==='custom'?'长中文：模拟操作':'点击演示',loading=mode==='custom'?'正在处理自定义内容':'加载中',success=mode==='custom'?'自定义处理完成':'演示成功',error=mode==='custom'?'自定义处理失败':'演示失败';
      await mount(25,externalId=>({...(mode==='custom'?{children:h('strong',null,idle),loadingLabel:h('span',null,loading),successLabel:h('em',null,success),errorLabel:h('span',null,error)}:{}),...(mode==='aria-label'?{'aria-label':'始终由调用者命名'}:{}),...(mode==='aria-labelledby'?{'aria-labelledby':externalId}:{})}),async m=>{
        const relation=mode==='aria-label'?{label:'始终由调用者命名',labelledBy:null}:mode==='aria-labelledby'?{label:null,labelledBy:m.external.id}:'fallback';
        const label=inspect(m,idle,relation),id=label.id;clock.random(.9);
        await settle(()=>m.button.click());equal(m.button.dataset.status,'loading','25 loading');inspect(m,loading,relation);equal(m.button.disabled,true,'25 pending disabled');
        await m.render({title:'pending rerender'});await clock.tick(1000);equal(m.button.dataset.status,'success','25 resolved success');inspect(m,success,relation);
        clock.random(.1);await settle(()=>m.button.click());inspect(m,loading,relation);await clock.tick(1000);equal(m.button.dataset.status,'error','25 resolved error');inspect(m,error,relation);
        await m.render({resetKey:1});equal(m.button.dataset.status,'idle','25 explicit reset');equal(inspect(m,idle,relation).id,id,'25 all states retain naming ID');
      });
    }
    for(const mode of modes) {
      const idle=mode==='custom'?'长中文：复制整段内容':'复制',copying=mode==='custom'?'正在复制自定义内容':'复制中',copied=mode==='custom'?'自定义内容已复制':'已复制',error=mode==='custom'?'自定义内容复制失败':'复制失败';
      const first=deferred(),second=deferred();let writes=[],callbacks=[],errors=[];
      await mockedClipboard(text=>{writes.push(text);return writes.length===1?first.promise:second.promise;},async()=>{
        await mount(34,externalId=>({text:'精确 Clipboard 文本',onCopy:text=>callbacks.push(text),onCopyError:error=>errors.push(error),...(mode==='custom'?{children:h('strong',null,idle),copyingLabel:h('span',null,copying),copiedLabel:h('em',null,copied),errorLabel:h('span',null,error)}:{}),...(mode==='aria-label'?{'aria-label':'始终由调用者命名'}:{}),...(mode==='aria-labelledby'?{'aria-labelledby':externalId}:{})}),async m=>{
          const relation=mode==='aria-label'?{label:'始终由调用者命名',labelledBy:null}:mode==='aria-labelledby'?{label:null,labelledBy:m.external.id}:'fallback';
          const label=inspect(m,idle,relation),id=label.id;equal(writes.length,0,'34 no write on mount');
          await settle(()=>m.button.click());equal(m.button.dataset.status,'copying','34 copying');inspect(m,copying,relation);equal(m.button.disabled,true,'34 pending disabled');
          await settle(()=>m.button.click());equal(writes.length,1,'34 pending duplicate suppressed');await clock.tick(2000);equal(m.button.dataset.status,'copying','34 elapsed time never proves success');
          await m.render({title:'pending rerender'});await settle(()=>first.resolve());equal(m.button.dataset.status,'copied','34 Promise fulfillment');inspect(m,copied,relation);equal(callbacks[0],'精确 Clipboard 文本','34 success notification payload unchanged');equal(m.button.disabled,true,'34 feedback disabled');
          await clock.tick(1999);inspect(m,copied,relation);await clock.tick(1);equal(m.button.dataset.status,'idle','34 full 2000ms feedback');inspect(m,idle,relation);
          await settle(()=>m.button.click());inspect(m,copying,relation);const marker=new Error('controlled test rejection');await settle(()=>second.reject(marker));equal(m.button.dataset.status,'error','34 Promise rejection');inspect(m,error,relation);equal(errors[0],marker,'34 exact rejection identity');equal(m.button.disabled,false,'34 failure retry enabled');equal(callbacks.length,1,'34 failure never success');
          await m.render({resetKey:1});equal(inspect(m,idle,relation).id,id,'34 reset retains live/name target');
          equal(writes.join('|'),'精确 Clipboard 文本|精确 Clipboard 文本','34 exact writes unchanged');
        });
      });
    }
  });
  return {kind:'button-25-34-name-relation-contract',ids:2,scenarios,assertions,browser:false,computedAccessibleName:false,realKeyboard:false,realClipboard:false,mockedClipboard:true,mockedTimers:true};
};
