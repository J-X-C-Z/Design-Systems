'use strict';
/* Author-side React/JSDOM checks. These never claim actual browser layout or keyboard execution. */
exports.run = async function run(window, React, createRoot, assert, C) {
  let assertions = 0, scenarios = 0, serial = 0;
  const check = (value, message) => { assertions++; assert.ok(value, message); };
  const equal = (a, b, message) => { assertions++; assert.strictEqual(a, b, message); };
  const h = React.createElement, act = React.act;
  const settle = async fn => { await act(async () => { fn?.(); await Promise.resolve(); }); };
  async function mount(name, props, run, strict = false) {
    scenarios++; const form = window.document.createElement('form'); form.id = `fr7-third-test-${++serial}`;
    const host = window.document.createElement('div'); form.append(host); window.document.body.append(form);
    const root = createRoot(host); let current = props, live = true;
    const tree = () => strict ? h(React.StrictMode, null, h(C[name], current)) : h(C[name], current);
    const m = { form, host, root, get button() { return host.querySelector('button'); }, get controls() { return [...host.querySelectorAll('button,a')]; },
      render: async patch => { current = { ...current, ...patch }; await settle(() => root.render(tree())); },
      unmount: async () => { if (live) { live = false; await settle(() => root.unmount()); } }
    };
    try { await settle(() => root.render(tree())); await run(m); }
    finally { await m.unmount(); form.remove(); }
  }
  const ids = Array.from({ length: 12 }, (_, i) => String(i + 13));
  const singles = ['13', '14', '15', '16', '17', '19', '23', '24'];
  const expected = { '13':['复制','copy'], '14':['下载','download'], '15':['复制网址','copy'], '16':['保存','save'], '17':['警告','warning'], '19':['返回','back'], '23':['收件箱8','bell'], '24':['FU@Follow',null] };
  equal(C.BUTTON18_MEMBERS.join(','), 'cancel,confirm', '18: exact exported members');
  equal(C.BUTTON_PROVIDERS.join(','), 'google,x,facebook,github', '21/22: exact exported provider order');
  for (const id of ids) {
    const name = `Button${id}`; check(C[name], `${name}: explicit export`);
    const count = id === '18' ? 2 : id === '21' || id === '22' ? 4 : 1;
    const ref = React.createRef();
    await mount(name, { ref }, async m => {
      equal(m.controls.length, count, `${name}: exact native control count`);
      equal(m.host.querySelectorAll('input,textarea,iframe').length, 0, `${name}: no surrogate form fields`);
      equal(m.host.querySelectorAll('button[aria-pressed]').length, 0, `${name}: no invented toggle state`);
      for (const control of m.controls) {
        equal(control.dataset.followId, `button-${id}`, `${name}: exact canonical ID on target`);
        if (id !== '20') equal(control.type, 'button', `${name}: safe native type`);
      }
      const target = ['18','21','22'].includes(id) ? m.host.firstElementChild : m.controls[0];
      equal(ref.current, target, `${name}: declared ref target`);
      if (singles.includes(id)) {
        equal(m.button.textContent, expected[id][0], `${name}: complete source-composition default label`);
        if (expected[id][1]) equal(m.button.querySelector('svg').dataset.icon, expected[id][1], `${name}: identity-specific icon`);
      }
      for (const svg of m.host.querySelectorAll('svg')) {
        equal(svg.getAttribute('aria-hidden'), 'true', `${name}: icons decorative`);
        equal(svg.getAttribute('focusable'), 'false', `${name}: icons never focus targets`);
        check(svg.querySelector('path'), `${name}: real vector geometry`);
      }
      if (id === '15') {
        equal(m.host.querySelectorAll('p').length, 1, '15: inert URL paragraph');
        equal(m.host.querySelectorAll('a').length, 0, '15: URL does not navigate');
        equal(m.host.querySelector('p').title, 'https://watermelon-ui.com/', '15: full default URL is title');
        equal(m.button.querySelector('.fr7-tb-sr-only').textContent, '复制网址', '15: icon accessible label');
      }
      if (id === '18') {
        equal(m.controls.map(b => b.textContent).join(','), '取消,确认', '18: both labels');
        equal(m.controls.map(b => b.dataset.member).join(','), 'cancel,confirm', '18: both semantic slots');
        for (const b of m.controls) equal(b.querySelector('.fr7-tb-face').lastElementChild.tagName.toLowerCase(), 'svg', '18: trailing circle icon');
      }
      if (id === '20') {
        equal(m.controls[0].tagName, 'A', '20: real anchor');
        equal(m.controls[0].getAttribute('href'), '#', '20: source href default retained');
        equal(m.controls[0].hasAttribute('role'), false, '20: no fabricated button role');
        equal(m.controls[0].hasAttribute('disabled'), false, '20: no invalid anchor disabled attr');
      }
      if (id === '21' || id === '22') {
        equal(m.controls.map(b => b.dataset.provider).join(','), 'google,x,facebook,github', `${name}: fixed four providers`);
        equal(m.host.querySelectorAll('.fr7-tb-provider-label').length, id === '22' ? 4 : 0, `${name}: exact icon-only/labeled composition`);
        m.controls.forEach((b,i) => check(b.getAttribute('aria-label').includes(['Google','X','Facebook','GitHub'][i]), `${name}: unique name ${i}`));
      }
      if (id === '23') equal(m.button.querySelector('[data-slot="badge"]').textContent, '8', '23: real count badge');
      if (id === '24') {
        check(m.button.querySelector('img').src.startsWith('data:image/svg+xml'), '24: local avatar default');
        equal(m.button.querySelector('[data-slot="avatar"]').dataset.status, 'loading', '24: independent React loading state');
      }
      const nodes = m.controls; if (!['18','21','22'].includes(id)) nodes[0].focus();
      await m.render({ title: 'updated metadata', className: 'owner-class', 'data-owner': 'yes' });
      m.controls.forEach((b,i) => equal(b, nodes[i], `${name}: metadata preserves node ${i}`));
      if (!['18','21','22'].includes(id)) equal(window.document.activeElement, nodes[0], `${name}: metadata retains focus`);
      check(ref.current.classList.contains('owner-class'), `${name}: className forwarded`);
      equal(ref.current.dataset.owner, 'yes', `${name}: arbitrary data forwarded`);
    }, true);
    equal(ref.current, null, `${name}: ref cleared on unmount`);

    for (const guard of [{ disabled: true }, { readOnly: true }, { 'aria-disabled': true }, { 'aria-disabled': 'true' }]) {
      let calls = 0;
      const members = id === '18' ? { cancelProps: { disabled: false, readOnly: false, 'aria-disabled': false, type: 'submit' }, confirmProps: { disabled: false, readOnly: false, 'aria-disabled': false, type: 'submit' } }
        : id === '21' || id === '22' ? { providerProps: Object.fromEntries(C.BUTTON_PROVIDERS.map(p=>[p,{disabled:false,readOnly:false,'aria-disabled':false,type:'submit'}])) }
        : id === '20' ? {} : { type: 'submit' };
      await mount(name, { ...guard, ...members, onClick: () => calls++ }, async m => {
        let submits = 0; m.form.addEventListener('submit', e=>{e.preventDefault();submits++;});
        for (const control of m.controls) {
          await settle(() => control.click());
          if (id !== '20') equal(control.disabled, !!guard.disabled, `${name}: native disabled distinct from aria/readOnly`);
          equal(control.hasAttribute('readonly'), false, `${name}: readonly not leaked`);
        }
        equal(calls, 0, `${name}: ${JSON.stringify(guard)} blocks all member callbacks`);
        equal(submits, 0, `${name}: ${JSON.stringify(guard)} blocks all native form actions`);
      });
    }
    for (const aria of [false, 'false']) {
      let calls = 0;
      await mount(name, { 'aria-disabled': aria, onClick: event => {event.preventDefault();calls++;} }, async m => {
        for (const control of m.controls) await settle(() => control.click());
        equal(calls, count, `${name}: aria false permits every member exactly once`);
      });
    }
    let calls = 0, seen = [], touchedThen = false;
    await mount(name, { onClick: event => { event.preventDefault(); calls++; seen.push(event.currentTarget); return { get then() {touchedThen=true;throw Error('must not inspect return');} }; } }, async m => {
      const nodes = m.controls;
      for (const b of nodes) await settle(() => b.click());
      equal(calls, count, `${name}: native onClick default per member`);
      equal(seen.every((node,index)=>node===nodes[index]), true, `${name}: native event currentTarget`);
      equal(touchedThen, false, `${name}: callback return ignored`);
      let keys = 0; await m.render({ onKeyDown:()=>keys++ });
      for (const b of nodes) for (const key of ['Enter',' ','Escape','ArrowRight']) {
        const event = new window.KeyboardEvent('keydown',{key,bubbles:true,cancelable:true});
        await settle(()=>b.dispatchEvent(event)); equal(event.defaultPrevented,false,`${name}: native ${key} not intercepted`);
      }
      equal(keys, count*4, `${name}: key callbacks forwarded/bubbled once`);
      equal(calls, count, `${name}: synthetic keydown does not invent click`);
    });
    await mount(name, {}, async m => {
      let errors=0; const marker=`expected-third-button-error-${id}`;
      const onError=e=>{if(e.error?.message===marker||e.message===marker){errors++;e.preventDefault();}};
      window.addEventListener('error',onError);
      try {
        await m.render({onClick:event=>{event.preventDefault();throw Error(marker);}});
        for (const b of m.controls) await settle(()=>b.click());
        equal(errors,count,`${name}: throw surfaced once per event`);
        equal(m.controls.length,count,`${name}: no post-throw invented composition/state`);
      } finally {window.removeEventListener('error',onError);}
    });
    if (typeof C.__flushSync === 'function') {
      await mount(name, {}, async m => {
        await m.render({onClick:event=>{event.preventDefault();C.__flushSync(()=>m.root.render(null));}});
        await settle(()=>m.controls[0].click()); equal(m.host.childNodes.length,0,`${name}: synchronous unmount safely terminates`);
      });
      await mount(name, {}, async m => {
        let count=0;
        const onClick=event=>{event.preventDefault();count++;C.__flushSync(()=>m.root.render(h(C[name],{disabled:true,onClick})));};
        await m.render({onClick});const node=m.controls[0];await settle(()=>node.click());
        equal(m.controls[0],node,`${name}: sync disabled update preserves node`);
        await settle(()=>m.controls[0].click());equal(count,1,`${name}: sync disabled update affects next event`);
      });
    }
  }
  // Native form contract on each exact target, including compound second/fourth members.
  for (const id of ids.filter(x=>x!=='20')) {
    const name=`Button${id}`;
    for (const type of ['submit','reset']) {
      const per={type,name:'intent',value:id};
      const props=id==='18'?{cancelProps:per,confirmProps:per}:['21','22'].includes(id)?{providerProps:Object.fromEntries(C.BUTTON_PROVIDERS.map(p=>[p,per]))}:per;
      await mount(name,props,async m=>{
        let submits=0,submitter; m.form.addEventListener('submit',e=>{e.preventDefault();submits++;submitter=e.submitter;});
        const input=window.document.createElement('input');input.defaultValue='baseline';m.form.append(input);
        for (const b of m.controls) {
          equal(b.name,'intent',`${name}: member name forwarded`);equal(b.value,id,`${name}: member value forwarded`);
          input.value='changed';await settle(()=>b.click());
          if(type==='submit')equal(submitter,b,`${name}: native member submitter`);else equal(input.value,'baseline',`${name}: actual form reset`);
        }
        equal(submits,type==='submit'?m.controls.length:0,`${name}: actual form default count`);
      });
    }
  }
  await mount('Button15',{url:'https://example.test/很长的网址路径',children:'复制完整链接'},async m=>{
    equal(m.host.querySelector('p').textContent,'https://example.test/很长的网址路径','15: URL prop displayed');
    equal(m.host.querySelector('p').title,m.host.querySelector('p').textContent,'15: complete title updates');
    equal(m.button.textContent,'复制完整链接','15: separate localized icon label');
  });
  await mount('Button18',{},async m=>{
    let common=0,cancel=0,confirm=0;const cRef=React.createRef(),fRef=React.createRef();
    await m.render({cancelLabel:'取消全部改动并返回上一步',confirmLabel:'确认全部改动并继续下一步',onClick:()=>common++,cancelProps:{ref:cRef,onClick:event=>{event.preventDefault();cancel++;}},confirmProps:{ref:fRef,onClick:()=>confirm++}});
    for(const b of m.controls)await settle(()=>b.click());
    equal(common,0,'18: per-slot overrides never chain group handler');equal(cancel,1,'18: cancel handler');equal(confirm,1,'18: confirm handler');
    equal(cRef.current,m.controls[0],'18: cancel ref');equal(fRef.current,m.controls[1],'18: confirm ref');
    check(m.controls[0].textContent.includes('取消全部'),'18: long first label');check(m.controls[1].textContent.includes('确认全部'),'18: long second label');
    await m.render({cancelProps:{disabled:true},confirmProps:{onClick:()=>confirm++}});
    for(const b of m.controls)await settle(()=>b.click());equal(confirm,2,'18: independent member disable retains other');
  });
  for(const name of ['Button21','Button22']) await mount(name,{},async m=>{
    const labels=Object.fromEntries(C.BUTTON_PROVIDERS.map(p=>[p,`使用 ${p} 账户继续访问完整工作区并查看最近更新`]));let common=0;const calls={},refs={};
    const providers=Object.fromEntries(C.BUTTON_PROVIDERS.map(p=>{refs[p]=React.createRef();return[p,{ref:refs[p],onClick:()=>{calls[p]=(calls[p]||0)+1;}}];}));
    await m.render({providerLabels:labels,providerProps:providers,onClick:()=>common++});
    for (const b of m.controls) {await settle(()=>b.click());equal(b.getAttribute('aria-label'),labels[b.dataset.provider],`${name}: all independent labels`);equal(refs[b.dataset.provider].current,b,`${name}: member ref`);if(name==='Button22')equal(b.textContent,labels[b.dataset.provider],`${name}: visible long label`);}
    equal(common,0,`${name}: member callbacks replace common default`);equal(Object.values(calls).join(','),'1,1,1,1',`${name}: all four separate callbacks`);
    await m.render({providerProps:{google:{disabled:true}}});for(const b of m.controls)await settle(()=>b.click());equal(common,3,`${name}: only one provider individually disabled`);
  });
  await mount('Button20',{'href':'#specific',target:'_self',rel:'help'},async m=>{
    const a=m.controls[0];equal(a.getAttribute('href'),'#specific','20: owner href');equal(a.rel,'help','20: anchor attributes');
    let seen;await m.render({onClick:e=>{seen=e.currentTarget;e.preventDefault();}});
    const event=new window.MouseEvent('click',{bubbles:true,cancelable:true});await settle(()=>a.dispatchEvent(event));
    equal(event.defaultPrevented,true,'20: caller cancellation reaches native anchor default');equal(seen,a,'20: anchor event target');
  });
  await mount('Button23',{},async m=>{
    const b=m.button;await m.render({count:42,children:'未读工作区通知'});
    equal(m.button,b,'23: controlled count update does not replace button');equal(m.button.querySelector('[data-slot="badge"]').textContent,'42','23: host count updates');
    equal(m.button.textContent,'未读工作区通知42','23: accessible text includes updated count');
  });
  await mount('Button24',{avatarSrc:'data:image/svg+xml,<svg/>',avatarFallback:'AB'},async m=>{
    const first=m.button.querySelector('img');const avatar=()=>m.button.querySelector('[data-slot="avatar"]');
    equal(avatar().dataset.status,'loading','24: loading source state');equal(avatar().querySelector('[data-slot="avatar-fallback"]').textContent,'AB','24: custom fallback');
    await settle(()=>first.dispatchEvent(new window.Event('load')));equal(avatar().dataset.status,'loaded','24: real React load handler');equal(avatar().querySelector('[data-slot="avatar-fallback"]'),null,'24: successful load removes fallback');
    await settle(()=>first.dispatchEvent(new window.Event('error')));equal(avatar().dataset.status,'fallback','24: real React error handler');
    await m.render({avatarSrc:'data:image/svg+xml,<svg id="new"/>'});const second=m.button.querySelector('img');
    check(first!==second,'24: changed source gets fresh keyed image');equal(avatar().dataset.status,'loading','24: changed source resets load state synchronously');
    await settle(()=>first.dispatchEvent(new window.Event('load')));equal(avatar().dataset.status,'loading','24: stale detached load cannot mutate replacement');
    await m.render({avatarSrc:null});equal(m.button.querySelector('img'),null,'24: explicit no-image fallback');equal(avatar().dataset.status,'fallback','24: no-image fallback state');
    await m.unmount();await settle(()=>second.dispatchEvent(new window.Event('load')));equal(m.host.childNodes.length,0,'24: detached events after unmount cannot recreate state');
  },true);
  // Two separate roots never share avatar state or callbacks.
  await mount('Button24',{avatarSrc:'data:image/svg+xml,<svg/>',avatarFallback:'A'},async first=>{
    await mount('Button24',{avatarSrc:'data:image/svg+xml,<svg/>',avatarFallback:'B'},async second=>{
      await settle(()=>first.button.querySelector('img').dispatchEvent(new window.Event('load')));
      equal(first.button.querySelector('[data-slot="avatar"]').dataset.status,'loaded','24: first instance load');
      equal(second.button.querySelector('[data-slot="avatar"]').dataset.status,'loading','24: second instance isolated');
    });
  });
  const fs=require('node:fs'),path=require('node:path');
  const css=fs.readFileSync(path.join(__dirname,'../src/third-buttons/styles.css'),'utf8');
  const jsx=fs.readFileSync(path.join(__dirname,'../src/third-buttons/index.jsx'),'utf8');
  check(!/dangerouslySetInnerHTML|\.innerHTML|mountController|setInterval|setTimeout|fetch\(|clipboard/.test(jsx),'Direct JSX with no DOM controller, network or clipboard action simulation');
  for (const fragment of ['min-height: 44px','min-height: 48px','width: 32px; height: 32px','gap: 16px','max-width: 224px','translateX(-4px)','180ms ease-in-out','width: 80%','300ms ease-in-out','top: -10px; right: -10px','width: 24px; height: 24px','padding-left: 4px']) check(css.includes(fragment),`Authored source composition: ${fragment}`);
  check(css.includes('(prefers-reduced-motion: reduce)')&&css.includes('[data-motion="off"]')&&css.includes('[data-motion="reduce"]'),'All reduced-motion routes authored');
  check(css.includes('(forced-colors: active)'),'Forced-colours route authored');
  check(css.includes('var(--ds-info, #244b66)')&&css.includes('var(--ds-info-bg, #e5edf4)'),'Readable semantic text/background pairs authored');
  return {kind:'author-react-third-buttons-regression',ids:12,scenarios,assertions,synchronousUnmount:typeof C.__flushSync==='function',browser:false,realKeyboard:false,realLayout:false,visual:false,reducedMotionRendered:false};
};
