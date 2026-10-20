'use strict';
/* Real React/JSDOM author suite. JSDOM clicks/form.reset execute its default actions;
   keyboard Space, layout, trusted input and OS IME still require browser evidence. */
exports.run = async function run(window, React, createRoot, assert, C) {
  let assertions = 0, scenarios = 0, serial = 0;
  const check = (value, message) => { assertions++; assert.ok(value, message); };
  const equal = (value, expected, message) => { assertions++; assert.strictEqual(value, expected, message); };
  const h = React.createElement, act = React.act, flush = C.__flushSync;
  check(typeof act === 'function' && typeof flush === 'function', 'real development React act and flushSync');
  const settle = async fn => { await act(async () => { fn?.(); await Promise.resolve(); }); };
  async function mount(name, props = {}, strict = false) {
    scenarios++;
    const form = window.document.createElement('form'), other = window.document.createElement('form'), host = window.document.createElement('div');
    form.id = `next-selection-${++serial}`; other.id = `next-selection-other-${serial}`;
    form.append(host); window.document.body.append(form, other); const root = createRoot(host); let current = props;
    const tree = () => strict ? h(React.StrictMode, null, h(C[name], current)) : h(C[name], current);
    await settle(() => root.render(tree()));
    return { form, other, host, root, get props() { return current; }, get input() { return host.querySelector('input,textarea'); },
      render: async patch => { current = { ...current, ...patch }; await settle(() => root.render(tree())); },
      sync: props => flush(() => root.render(h(C[name], props))),
      close: async () => { await settle(() => root.unmount()); form.remove(); other.remove(); }
    };
  }
  async function use(name, props, fn, strict) { const m = await mount(name, props, strict); try { await fn(m); } finally { await m.close(); } }
  const click = el => el.click();
  const input = (el, value, extra = {}) => {
    Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set.call(el, value);
    el.dispatchEvent(new window.InputEvent('input', { bubbles: true, inputType: 'insertText', data: value, ...extra }));
  };
  const compose = (el, type, data = '') => el.dispatchEvent(new window.CompositionEvent(type, { bubbles: true, data }));
  const before = el => el.dispatchEvent(new window.InputEvent('beforeinput', { bubbles: true, cancelable: true, inputType: 'insertText', data: '新' }));
  const pair = el => `${el.checked}/${el.indeterminate}`;
  const names = ['Checkbox02','Checkbox03','Checkbox04','Switch02','Switch03','Switch04','Textarea02'];
  names.forEach(name => check(!!C[name], `${name} export`));
  equal(C.SWITCH03_SLOTS.map(x => x.key).join(','), 'destructive,success,info,warning', 'exact exported slot order');

  for (const [name, initial, label] of [
    ['Checkbox02', false, '启用测试版功能'], ['Checkbox03', false, '订阅产品更新'], ['Checkbox04', true, '检查每周任务'],
    ['Switch02', false, null], ['Switch04', false, null]
  ]) await use(name, {}, async m => {
    equal(m.host.querySelectorAll('input').length, 1, `${name} one real native field`);
    equal(m.input.checked, initial, `${name} exact source initial checked`);
    equal(m.input.getAttribute('role'), name.startsWith('Switch') ? 'switch' : null, `${name} semantic role`);
    equal(m.host.querySelectorAll('label').length, label ? 1 : 0, `${name} source visible label count`);
    if (label) { equal(m.host.querySelector('label').textContent, label, `${name} localized source copy`); equal(m.host.querySelector('label').htmlFor, m.input.id, `${name} label connected`); }
    else check(!!m.input.getAttribute('aria-label'), `${name} accessible source-only name`);
    equal(m.host.querySelectorAll('iframe').length, 0, `${name} no legacy/native adapter iframe`);
  });
  await use('Checkbox02', {}, async m => {
    equal(pair(m.input), 'false/true', 'mixed exact initial pair'); equal(m.input.getAttribute('aria-checked'), 'mixed', 'mixed aria');
    check(m.host.querySelector('.fr7-selection-copy').textContent.includes('仅完成部分选择'), 'mixed descriptive copy alongside control');
    await settle(() => click(m.input)); equal(pair(m.input), 'true/false', 'first action clears mixed and accepts checked');
    equal(m.input.getAttribute('aria-checked'), 'true', 'mixed aria follows accepted pair');
    await settle(() => click(m.input)); equal(pair(m.input), 'false/false', 'second activation is ordinary false');
    await settle(() => m.form.reset()); equal(pair(m.input), 'false/true', 'mixed reset restores whole baseline');
  });
  for (const value of [{ checked: true, indeterminate: true }, { checked: false, indeterminate: false }, null, {}]) {
    let proposed;
    await use('Checkbox02', { value, onValueChange: v => { proposed = v; } }, async m => {
      const expected = `${!!value?.checked}/${!!value?.indeterminate}`;
      await settle(() => click(m.input)); equal(pair(m.input), expected, 'atomic controlled refusal keeps both bits');
      equal(proposed.indeterminate, false, 'every proposal clears mixed'); equal(proposed.checked, !value?.checked, 'proposal reports next checked');
      await m.render({ value: proposed }); equal(pair(m.input), `${proposed.checked}/false`, 'atomic owner acceptance');
    });
  }
  await use('Textarea02', {}, async m => {
    equal(m.input.tagName, 'TEXTAREA', 'Textarea02 native textarea'); equal(m.host.querySelector('label').textContent, '你的输入', 'Textarea02 visible label');
    equal(m.input.placeholder, '分享你的想法……', 'Textarea02 exact localized placeholder'); equal(m.host.querySelector('label').htmlFor, m.input.id, 'Textarea02 association');
  });
  await use('Switch03', {}, async m => {
    const fields = [...m.host.querySelectorAll('input')]; equal(fields.length, 4, 'four independent source switches');
    equal(fields.map(x => x.checked).join(','), 'true,true,true,true', 'all four source defaults true');
    equal(fields.map(x => x.getAttribute('aria-label')).join(','), '危险开关,成功开关,信息开关,警告开关', 'four semantic names');
    equal(m.host.querySelectorAll('label').length, 0, 'source group has no invented visible labels');
    await settle(() => fields[1].click()); equal(fields.map(x => x.checked).join(','), 'true,false,true,true', 'member interaction isolated');
  });
  await use('Switch03', { destructive: null, success: { defaultChecked: false }, info: { defaultChecked: undefined, 'aria-label': undefined }, warning: {} }, async m => {
    equal([...m.host.querySelectorAll('input')].map(x => x.checked).join(','), 'true,false,true,true', 'missing member props use fixed four source defaults');
  });

  // Shared scalar APIs stay native; Switch03 each member has the same boundaries.
  const fields = [
    { name: 'Checkbox02', base: { checked: false, indeterminate: true }, edit: { checked: true, indeterminate: false }, owner: { checked: true, indeterminate: true }, key: 'value', def: 'defaultValue', cb: 'onValueChange', get: m => pair(m.input), baseText: 'false/true', editText: 'true/false', set: click },
    ...['Checkbox03','Checkbox04','Switch02','Switch04'].map(name => ({ name, base: false, edit: true, owner: true, key: 'checked', def: 'defaultChecked', cb: 'onCheckedChange', get: m => m.input.checked, baseText: false, editText: true, set: click })),
    { name: 'Textarea02', base: 'baseline', edit: 'edited\n文本', owner: 'edited\n文本', key: 'value', def: 'defaultValue', cb: 'onValueChange', get: m => m.input.value, baseText: 'baseline', editText: 'edited\n文本', set: el => input(el, 'edited\n文本') }
  ];
  for (const f of fields) {
    for (const flag of ['disabled', 'readOnly']) await use(f.name, { [f.def]: f.base, [flag]: true, [f.cb]: () => { throw new Error('blocked proposal'); } }, async m => {
      await settle(() => f.set(m.input)); equal(f.get(m), f.baseText, `${f.name} ${flag} protects model`);
    });
    await use(f.name, { [f.def]: f.base, onChange: e => e.preventDefault(), [f.cb]: () => { throw new Error('vetoed proposal'); } }, async m => {
      await settle(() => f.set(m.input)); equal(f.get(m), f.baseText, `${f.name} native onChange veto`);
    });
    if (f.name !== 'Textarea02') for (const cancelVia of ['synthetic', 'nativeEvent', 'nativeListener']) {
      let proposals = 0, changes = 0;
      await use(f.name, { [f.def]: f.base, onChange: () => changes++, [f.cb]: () => proposals++,
        onClick: cancelVia === 'nativeListener' ? undefined : e => cancelVia === 'synthetic' ? e.preventDefault() : e.nativeEvent.preventDefault()
      }, async m => {
        const cancel = e => e.preventDefault();
        if (cancelVia === 'nativeListener') m.input.addEventListener('click', cancel);
        await settle(() => m.input.click());
        equal(proposals, 0, `${f.name} ${cancelVia} click cancellation emits no proposal`);
        equal(changes, 1, `${f.name} ${cancelVia} still forwards real React onChange`);
        equal(f.get(m), f.baseText, `${f.name} ${cancelVia} click cancellation restores effective model after native rollback`);
        m.input.removeEventListener('click', cancel); await m.render({ onClick: undefined });
        await settle(() => m.input.click()); equal(proposals, 1, `${f.name} activation recovers after ${cancelVia} veto`); equal(f.get(m), f.editText, `${f.name} accepted activation after ${cancelVia} veto`);
      });
    }
    let proposals = 0;
    await use(f.name, { [f.def]: f.base, [f.key]: f.base, [f.cb]: () => proposals++ }, async m => {
      await settle(() => f.set(m.input)); equal(proposals, 1, `${f.name} controlled proposal once`); equal(f.get(m), f.baseText, `${f.name} owner refusal`);
      await m.render({ [f.key]: f.edit }); equal(f.get(m), f.editText, `${f.name} parent acceptance`);
      await m.render({ [f.key]: undefined }); equal(f.get(m), f.editText, `${f.name} release retains value`);
      await settle(() => m.form.reset()); equal(f.get(m), f.baseText, `${f.name} release reset baseline`);
    });
    await use(f.name, { [f.def]: f.base, name: 'field', ...(f.name === 'Checkbox02' ? { submissionValue: 'submitted' } : f.name === 'Textarea02' ? {} : { value: 'submitted' }) }, async m => {
      const original = m.input; original.focus();
      await m.render({ title: 'metadata', label: '很长的标签'.repeat(40), help: '很长的辅助文本'.repeat(40) }); equal(m.input, original, `${f.name} stable native node`); equal(window.document.activeElement, original, `${f.name} stable focus`);
      await settle(() => f.set(m.input)); equal(new window.FormData(m.form).get('field'), f.name === 'Textarea02' ? f.edit : 'submitted', `${f.name} native FormData`);
      await m.render({ disabled: true }); equal(new window.FormData(m.form).has('field'), false, `${f.name} disabled omitted from submission`);
      await m.render({ disabled: false, readOnly: true }); check(new window.FormData(m.form).has('field'), `${f.name} readonly remains successful`);
    });
    for (const cancels of [[false],[true],[false,false],[false,true],[true,false],[true,true]]) await use(f.name, { [f.def]: f.base }, async m => {
      await settle(() => f.set(m.input)); let n = 0; m.form.addEventListener('reset', e => { if (cancels[n++]) e.preventDefault(); });
      await settle(() => cancels.forEach(() => m.form.reset())); equal(f.get(m), cancels.every(Boolean) ? f.editText : f.baseText, `${f.name} HTML reset cancellations ${cancels}`);
    });
    await use(f.name, { [f.def]: f.base }, async m => {
      await settle(() => f.set(m.input)); await m.render({ [f.def]: f.edit }); await settle(() => m.form.reset()); equal(f.get(m), f.baseText, `${f.name} mount-only baseline`);
    }, true);
    await use(f.name, { [f.def]: f.base }, async m => {
      await settle(() => f.set(m.input)); await settle(() => { m.form.reset(); f.set(m.input); }); equal(f.get(m), f.editText, `${f.name} same-model action after reset retires prior job`);
    });
    await use(f.name, { [f.def]: f.base }, async m => {
      m.form.addEventListener('reset', () => f.set(m.input)); await settle(() => m.form.reset()); equal(f.get(m), f.baseText, `${f.name} dispatch-time edit precedes default reset`);
    });
    await use(f.name, { [f.def]: f.base }, async m => {
      await settle(() => f.set(m.input)); await settle(() => { m.form.reset(); m.input.setAttribute('form', m.other.id); }); equal(f.get(m), f.editText, `${f.name} form transfer retires old reset`);
      await settle(() => m.other.reset()); equal(f.get(m), f.baseText, `${f.name} current form reset`);
    });
    for (const route of ['accept','reject-command','release','disabled','readOnly','replace','unmount']) await use(f.name, { [f.def]: f.base }, async m => {
      let calls = 0;
      await m.render({ [f.cb]: () => {
        calls++;
        if (route === 'accept') m.sync({ [f.def]: f.base, [f.key]: f.edit });
        else if (route === 'reject-command') m.sync({ [f.def]: f.base, [f.key]: f.base, ownerRevision: 1 });
        else if (route === 'release') { m.sync({ [f.def]: f.base, [f.key]: f.edit }); m.sync({ [f.def]: f.base, [f.key]: undefined }); }
        else if (route === 'replace') m.sync({ key: 'replacement', [f.def]: f.edit });
        else if (route === 'unmount') flush(() => m.root.render(null));
        else m.sync({ [f.def]: f.base, [route]: true });
      } });
      await settle(() => f.set(m.input)); equal(calls, 1, `${f.name} ${route} synchronous callback`);
      if (route === 'unmount') equal(m.host.childNodes.length, 0, `${f.name} synchronous unmount`);
      else equal(f.get(m), ['accept','release','replace'].includes(route) ? f.editText : f.baseText, `${f.name} synchronous ${route} precedence`);
    });
    for (const when of ['inside', 'after']) for (const command of ['same', 'write-release', 'replace']) await use(f.name, { [f.def]: f.base }, async m => {
      await settle(() => f.set(m.input));
      const update = () => {
        if (command === 'same') m.sync({ [f.def]: f.base, ownerRevision: 1 });
        if (command === 'write-release') { m.sync({ [f.def]: f.base, [f.key]: f.edit }); m.sync({ [f.def]: f.base, [f.key]: undefined }); }
        if (command === 'replace') m.sync({ key: 'replacement', [f.def]: f.edit });
      };
      if (when === 'inside') m.form.addEventListener('reset', update, { once: true });
      await settle(() => { m.form.reset(); if (when === 'after') update(); }); equal(f.get(m), f.editText, `${f.name} ${when} reset owner ${command}`);
    });
    await use(f.name, { [f.def]: f.base }, async m => {
      let calls = 0; await m.render({ [f.cb]: () => calls++ });
      await settle(() => f.set(m.input)); await settle(() => m.form.reset()); await settle(() => f.set(m.input)); equal(calls, 2, `${f.name} repeated old edit after native reset callback seen`); equal(f.get(m), f.editText, `${f.name} repeated old edit accepted`);
    });
    await use(f.name, { [f.def]: f.base }, async m => {
      m.form.addEventListener('reset', () => {
        m.sync({ key: 'new-in-reset', [f.def]: f.edit });
        if (f.name === 'Textarea02') input(m.input, f.base); else m.input.click();
      }, { once: true });
      await settle(() => m.form.reset()); equal(f.get(m), f.editText, `${f.name} replacement joins same-family active reset`);
    });
    for (const callback of ['onChange', f.cb]) await use(f.name, { [f.def]: f.base }, async m => {
      const marker = `${f.name}-expected-error-${callback}`; let errors = 0;
      const listener = e => { if (e.error?.message === marker || e.message === marker) { errors++; e.preventDefault(); } }; window.addEventListener('error', listener);
      try { await m.render({ [callback]: () => { throw new Error(marker); } }); await settle(() => f.set(m.input)); equal(errors, 1, `${f.name} ${callback} error surfaces`); equal(f.get(m), f.baseText, `${f.name} ${callback} no stale commit`); }
      finally { window.removeEventListener('error', listener); }
    });
    await use(f.name, { [f.def]: f.base }, async m => {
      const node = m.input; await settle(() => { m.form.reset(); flush(() => m.root.render(null)); }); check(!node.isConnected, `${f.name} pending reset cleanup`);
    });
  }

  // Each fixed group member preserves scalar ownership and native form association.
  for (const { key: slot } of C.SWITCH03_SLOTS) {
    const ref = React.createRef(); let proposals = 0;
    await use('Switch03', { [`${slot}Ref`]: ref, [slot]: { checked: false, name: slot, value: slot, onCheckedChange: () => proposals++ } }, async m => {
      const el = m.host.querySelector(`[data-switch-slot="${slot}"] input`); equal(ref.current, el, `${slot} native ref`);
      await settle(() => el.click()); equal(proposals, 1, `${slot} proposal`); equal(el.checked, false, `${slot} independent owner rejection`);
      await m.render({ [slot]: { checked: true, name: slot, value: slot } }); equal(el.checked, true, `${slot} accepted owner`);
      await m.render({ disabled: true, [slot]: { checked: true, disabled: false, name: slot } }); equal(el.disabled, true, `${slot} whole disabled cannot bypass`); equal(new window.FormData(m.form).has(slot), false, `${slot} whole disabled submission`);
      await m.render({ disabled: false, readOnly: true, [slot]: { defaultChecked: false, readOnly: false } }); await settle(() => el.click()); equal(el.checked, true, `${slot} whole readonly cannot bypass`);
    }); equal(ref.current, null, `${slot} ref cleanup`);
    await use('Switch03', { [slot]: { defaultChecked: false } }, async m => {
      const el = m.host.querySelector(`[data-switch-slot="${slot}"] input`); const others = [...m.host.querySelectorAll('input')].filter(x => x !== el);
      await m.render({ [slot]: { defaultChecked: false, form: m.other.id } }); await settle(() => { el.click(); others[0].click(); });
      await settle(() => m.form.reset()); equal(el.checked, true, `${slot} unrelated form doesn't reset`); equal(others[0].checked, true, `${slot} ordinary member form resets`);
      await settle(() => m.other.reset()); equal(el.checked, false, `${slot} own associated form resets`);
    });
    await use('Switch03', { [slot]: { defaultChecked: false } }, async m => {
      const el = m.host.querySelector(`[data-switch-slot="${slot}"] input`);
      await m.render({ [slot]: { defaultChecked: false, onCheckedChange: () => m.sync({ [slot]: { checked: false }, ownerRevision: 7 }) } });
      await settle(() => el.click()); equal(el.checked, false, `${slot} synchronous owner rejection command`);
    });
  }
  await use('Switch03', { success: { onChange: e => e.preventDefault() }, onChange: () => { throw new Error('group must honor member veto'); } }, async m => {
    const el = m.host.querySelector('[data-switch-slot="success"] input'); await settle(() => el.click()); equal(el.checked, true, 'member veto does not trigger group callback or proposal');
  });
  await use('Switch03', { success: { defaultChecked: false } }, async m => {
    const el = m.host.querySelector('[data-switch-slot="success"] input'); await settle(() => el.click());
    await settle(() => { m.form.reset(); m.sync({ success: { defaultChecked: false, ownerRevision: 3 }, ownerRevision: 1 }); }); equal(el.checked, true, 'member and group revisions coordinate pending reset');
  });

  for (const slot of ['destructive','success','info','warning']) await use('Switch03', { [slot]: { label: '自定义可见中文 '+slot } }, async m => {
    const el=m.host.querySelector(`[data-switch-slot="${slot}"] input`);
    equal(el.getAttribute('aria-label'),null,`${slot} visible label not overridden by default source name`);
    equal(el.labels[0].textContent,'自定义可见中文 '+slot,`${slot} native label supplies intended name`);
    await m.render({[slot]:{label:'有可见标签','aria-label':'调用者明确命名'}});
    equal(el.getAttribute('aria-label'),'调用者明确命名',`${slot} explicit accessible override retained`);
    await m.render({[slot]:{label:null,'aria-label':'仅可访问名称'}});
    equal(el.getAttribute('aria-label'),'仅可访问名称',`${slot} icon-only explicit name`);
    await m.render({[slot]:{label:null}});
    equal(el.getAttribute('aria-label'),C.SWITCH03_SLOTS.find(x=>x.key===slot).label,`${slot} source-only fallback remains`);
  });

  // Multiline/IME is the same real editor, not a disabled screenshot or placeholder.
  let completions = 0;
  await use('Textarea02', { defaultValue: 'base', onValueChange: () => completions++ }, async m => {
    await settle(() => { compose(m.input, 'compositionstart'); input(m.input, '组合长文', { isComposing: true }); }); equal(completions, 0, 'textarea IME draft no proposal');
    await m.render({ title: 'metadata' }); equal(m.input.value, '组合长文', 'textarea metadata preserves IME');
    await settle(() => { compose(m.input, 'compositionend', '组合长文'); input(m.input, '组合长文', { inputType: 'insertFromComposition' }); }); equal(completions, 1, 'textarea composition completion exactly once');
  });
  for (const route of ['reset','owner','readonly']) await use('Textarea02', { defaultValue: 'base' }, async m => {
    let calls = 0; await m.render({ onValueChange: () => calls++ });
    await settle(() => { compose(m.input, 'compositionstart'); input(m.input, '旧草稿', { isComposing: true }); });
    if (route === 'reset') await settle(() => m.form.reset());
    else if (route === 'owner') await m.render({ value: 'owner' }); else await m.render({ readOnly: true });
    await settle(() => { compose(m.input, 'compositionend', '旧草稿'); input(m.input, '旧草稿'); }); equal(calls, 0, `textarea ${route} cancels stale composition`); equal(m.input.value, route === 'owner' ? 'owner' : 'base', `textarea ${route} model protected`);
    await m.render({ value: undefined, readOnly: false }); await settle(() => { before(m.input); input(m.input, '新的\n' + '长文'.repeat(300)); }); equal(calls, 1, 'textarea long multiline recovery');
  });
  for (const name of ['Switch02','Switch04']) await use(name, {}, async m => {
    const key = new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }); await settle(() => m.input.dispatchEvent(key)); equal(m.input.checked, true, `${name} plain Enter activates`);
    for (const options of [{ repeat: true }, { ctrlKey: true }, { isComposing: true }, { keyCode: 229 }]) {
      const blocked = new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true, ...options }); await settle(() => m.input.dispatchEvent(blocked)); equal(m.input.checked, true, `${name} modified key not activated`);
    }
  });
  return { suite: 'next-selection', assertions, scenarios, ids: 7, browser: false, realIME: false, realLayout: false, nativeSpaceDefaultAction: 'not simulated', status: 'author-pass' };
};
