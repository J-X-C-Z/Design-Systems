'use strict';
/* Parent injects compiled genuine React exports. No JSX compilation, installation or
   third-party source execution occurs here. Values are public non-credential samples. */
exports.run = async function run(window, React, createRoot, assert, C) {
  let assertions = 0, scenarios = 0;
  const check = (value, message) => { assertions++; assert.ok(value, message); };
  const equal = (actual, expected, message) => { assertions++; assert.strictEqual(actual, expected, message); };
  const h = React.createElement, act = React.act;
  if (typeof act !== 'function') throw new Error('React development build with act is required');
  for (const name of ['Button01','Button02','Button03','Checkbox01','Switch01','InputMask01','Textarea01']) check(!!C[name], `${name}: export`);
  const tick = () => Promise.resolve();
  const settle = async fn => { await act(async () => { fn?.(); await tick(); }); };
  let serial = 0;
  async function mount(name, props = {}, options = {}) {
    scenarios++;
    const form = window.document.createElement('form'), other = window.document.createElement('form');
    form.id = `fr7-test-a-${++serial}`; other.id = `fr7-test-b-${serial}`;
    const host = window.document.createElement('div'); form.append(host); window.document.body.append(form, other);
    const root = createRoot(host); let current = props, active = true;
    const tree = () => options.strict ? h(React.StrictMode, null, h(C[name], current)) : h(C[name], current);
    await settle(() => root.render(tree()));
    return { form, other, host, root, get props() { return current; }, get input() { return host.querySelector('input,textarea'); },
      render: async patch => { current = { ...current, ...patch }; await settle(() => root.render(tree())); },
      replace: async (nextName, nextProps) => { await settle(() => root.render(h(C[nextName], { ...nextProps, key: 'replacement' }))); },
      unmount: async () => { if (active) { active = false; await settle(() => root.unmount()); } form.remove(); other.remove(); }
    };
  }
  function event(type, options = {}) { return new window.Event(type, { bubbles: true, cancelable: true, ...options }); }
  function before(node, inputType = 'insertText', data = 'x', extra = {}) {
    const e = new window.InputEvent('beforeinput', { bubbles: true, cancelable: true, inputType, data, ...extra }); node.dispatchEvent(e); return e;
  }
  function input(node, value, options = {}) {
    const proto = node.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(node, value);
    const e = new window.InputEvent('input', { bubbles: true, inputType: 'insertText', data: value, ...options }); node.dispatchEvent(e); return e;
  }
  function compose(node, type, data) { node.dispatchEvent(new window.CompositionEvent(type, { bubbles: true, data })); }
  function key(node, value, extra = {}) { const e = new window.KeyboardEvent('keydown', { key: value, bubbles: true, cancelable: true, ...extra }); node.dispatchEvent(e); return e; }
  function click(node) { node.click(); }
  async function withMount(name, props, fn, options) { const m = await mount(name, props, options); try { await fn(m); } finally { await m.unmount(); } }

  // Exact variant structures, refs, independent events and native button defaults.
  for (const [name, labels] of [['Button01',['默认按钮']],['Button02',['上一步','下一步']],['Button03',['放弃','保存']]]) {
    await withMount(name, {}, async m => {
      const buttons = [...m.host.querySelectorAll('button')]; equal(buttons.length, labels.length, `${name}: exact button count`);
      labels.forEach((label, i) => { check(buttons[i].textContent.includes(label), `${name}: label`); equal(buttons[i].type, 'button', `${name}: safe default type`); });
      equal(m.host.querySelectorAll('iframe').length, 0, `${name}: native React content`);
    });
    for (const guard of [{ disabled: true }, { readOnly: true }, { 'aria-disabled': true }, { 'aria-disabled': 'true' }]) {
      let calls = 0; await withMount(name, { ...guard, onClick: () => calls++ }, async m => { await settle(() => click(m.host.querySelector('button'))); equal(calls, 0, `${name}: guarded click`); });
    }
    for (const aria of [false, 'false']) {
      let calls = 0; await withMount(name, { 'aria-disabled': aria, onClick: () => calls++ }, async m => { await settle(() => click(m.host.querySelector('button'))); equal(calls, 1, `${name}: aria false remains active`); });
    }
  }
  for (const [name, prop, refProp] of [['Button02','nextProps','nextRef'],['Button03','saveProps','saveRef']]) {
    let first = 0, second = 0; const a = React.createRef(), b = React.createRef();
    await withMount(name, { ref: a, onClick: () => first++, [refProp]: b, [prop]: { onClick: () => second++, title: 'second' } }, async m => {
      equal(a.current, m.host.querySelectorAll('button')[0], `${name}: first native ref`); equal(b.current, m.host.querySelectorAll('button')[1], `${name}: second native ref`);
      await settle(() => { a.current.click(); b.current.click(); }); equal(first, 1, `${name}: first callback`); equal(second, 1, `${name}: second callback`);
      equal(b.current.title, 'second', `${name}: second native attrs`);
    }); equal(a.current, null, `${name}: ref cleanup first`); equal(b.current, null, `${name}: ref cleanup second`);
  }
  await withMount('Button01', { type: 'submit', name: 'intent', value: 'demo' }, async m => {
    let submits = 0; m.form.addEventListener('submit', e => { e.preventDefault(); submits++; }); await settle(() => m.host.querySelector('button').click()); equal(submits, 1, 'Button01 explicit native submit');
  });

  // Boolean sources: one native input, distinct role/shape, native FormData and reset.
  for (const name of ['Checkbox01','Switch01']) {
    await withMount(name, { name: 'option', value: 'yes', help: '说明', error: '示例错误' }, async m => {
      equal(m.input.type, 'checkbox', `${name}: real checkbox`); equal(m.input.checked, false, `${name}: source initial false`);
      equal(m.input.getAttribute('role'), name === 'Switch01' ? 'switch' : null, `${name}: distinct role`);
      equal(m.host.querySelector('label').htmlFor, m.input.id, `${name}: label association`);
      const ids = m.input.getAttribute('aria-describedby').split(' '); equal(ids.length, 2, `${name}: help+error relations`); ids.forEach(id => check(!!window.document.getElementById(id), `${name}: description target`));
      await settle(() => click(m.input)); equal(m.input.checked, true, `${name}: actual click toggles`); equal(new window.FormData(m.form).get('option'), 'yes', `${name}: native successful control`);
      await m.render({ disabled: true }); equal(new window.FormData(m.form).has('option'), false, `${name}: disabled omitted`);
      await m.render({ disabled: false, readOnly: true }); await settle(() => click(m.input)); equal(m.input.checked, true, `${name}: readOnly blocks click`); equal(new window.FormData(m.form).get('option'), 'yes', `${name}: readOnly still submitted`);
    });
    let proposals = 0;
    await withMount(name, { checked: false, onCheckedChange: () => proposals++ }, async m => {
      await settle(() => click(m.input)); equal(proposals, 1, `${name}: controlled proposal`); equal(m.input.checked, false, `${name}: controlled rejection`);
      await m.render({ checked: true }); equal(m.input.checked, true, `${name}: owner prop accepted`);
      await m.render({ checked: undefined }); equal(m.input.checked, true, `${name}: release retains effective value`);
      await settle(() => click(m.input)); equal(m.input.checked, false, `${name}: released interaction`);
    });
    const order = [];
    await withMount(name, { onChange: e => { order.push('native'); e.preventDefault(); }, onCheckedChange: () => order.push('proposal') }, async m => {
      await settle(() => click(m.input)); equal(order.join(','), 'native', `${name}: native onChange veto precedes proposal`); equal(m.input.checked, false, `${name}: veto restored`);
    });
    await withMount(name, {}, async m => {
      await settle(() => key(m.input, 'Enter'));
      equal(m.input.checked, name === 'Switch01', `${name}: Enter semantics`);
      await settle(() => key(m.input, 'Enter', { ctrlKey: true })); equal(m.input.checked, name === 'Switch01', `${name}: modifier shortcut not consumed`);
      for (const modifiers of [{ shiftKey: true }, { altKey: true }, { metaKey: true }, { keyCode: 229 }, { isComposing: true }, { repeat: true }]) {
        let blockedKey; await settle(() => { blockedKey = key(m.input, 'Enter', modifiers); });
        equal(m.input.checked, name === 'Switch01', `${name}: modified/composing/repeated Enter does not activate`);
        equal(blockedKey.defaultPrevented, false, `${name}: nonplain Enter not consumed`);
      }
    });
    await withMount(name, { defaultChecked: true }, async m => {
      await settle(() => click(m.input)); equal(m.input.checked, false, `${name}: edit`);
      await m.render({ defaultChecked: false }); await settle(() => m.form.reset()); equal(m.input.checked, true, `${name}: mount-only default reset baseline`);
    }, { strict: true });
  }

  // Text sources remain different: mask fixed slots versus native multiline editing.
  for (const name of ['Textarea01','InputMask01']) {
    const initial = name === 'Textarea01' ? '初始\n文本' : 'AB12 CDE';
    const edited = name === 'Textarea01' ? '新的\n文本' : 'XY34 ZAB';
    await withMount(name, { defaultValue: initial, name: 'field', help: '说明', error: '错误' }, async m => {
      equal(m.input.tagName, name === 'Textarea01' ? 'TEXTAREA' : 'INPUT', `${name}: exact native field`);
      equal(m.input.value, initial, `${name}: mount default`);
      if (name === 'Textarea01') equal(m.host.querySelectorAll('label').length, 0, 'Textarea01 no invented visible label');
      else { check(!!m.host.querySelector('.fr7-identity-icon[aria-hidden="true"]'), 'Mask: decorative identity icon'); equal(m.input.placeholder, 'AB12 CDE', 'Mask exact sample placeholder'); }
      await settle(() => { before(m.input); input(m.input, edited); }); equal(m.input.value, edited, `${name}: actual input`);
      equal(new window.FormData(m.form).get('field'), edited, `${name}: native FormData`);
      await m.render({ defaultValue: 'ignored' }); await settle(() => m.form.reset()); equal(m.input.value, initial, `${name}: mount-only baseline`);
      await m.render({ label: '新标签', help: '新说明' }); equal(m.host.querySelector('label').htmlFor, m.input.id, `${name}: dynamic labels`);
    });
    let calls = 0;
    await withMount(name, { value: initial, onValueChange: () => calls++ }, async m => {
      await settle(() => input(m.input, edited)); equal(calls, 1, `${name}: controlled proposal`); equal(m.input.value, initial, `${name}: controlled refusal`);
      await m.render({ value: edited }); equal(m.input.value, edited, `${name}: owner changed`);
      await m.render({ value: undefined }); equal(m.input.value, edited, `${name}: owner release`);
      await m.render({ value: null }); equal(m.input.value, '', `${name}: null owns empty`);
    });
    await withMount(name, { defaultValue: initial, onChange: e => e.preventDefault(), onValueChange: () => { throw new Error('proposal must not run after native veto'); } }, async m => {
      await settle(() => input(m.input, edited)); equal(m.input.value, initial, `${name}: native onChange veto`);
    });
    for (const flag of ['disabled','readOnly']) await withMount(name, { defaultValue: initial, [flag]: true, onValueChange: () => { throw new Error('blocked proposal'); } }, async m => {
      await settle(() => input(m.input, edited)); equal(m.input.value, initial, `${name}: ${flag} blocks synthetic mutation`);
    });
    await withMount(name, { defaultValue: initial }, async m => {
      const same = m.input; same.focus(); same.setSelectionRange(1, 3); await m.render({ title: 'metadata' }); equal(m.input, same, `${name}: stable node`); equal(window.document.activeElement, same, `${name}: focus preserved`); equal(same.selectionStart, 1, `${name}: selection start preserved`); equal(same.selectionEnd, 3, `${name}: selection end preserved`);
    });
    await withMount(name, { defaultValue: initial }, async m => {
      let focuses = 0; await m.render({ onFocus: () => { focuses++; m.root.render(h(C[name], { ...m.props, label: '焦点元数据' })); } });
      await settle(() => m.input.focus()); equal(focuses, 1, `${name}: focus callback metadata render not recursive`); check(!!m.input, `${name}: stable after focus update`);
    });
  }
  await withMount('InputMask01', {}, async m => {
    m.input.focus(); m.input.setSelectionRange(0, 0);
    let e; await settle(() => { e = before(m.input, 'insertText', 'ab12cde'); }); check(e.defaultPrevented, 'Mask owns exact fixed-slot edit'); equal(m.input.value, 'AB12 CDE', 'Mask uppercase seven slots'); equal(m.input.selectionStart, 8, 'Mask caret after paste-length insert');
    m.input.setSelectionRange(2, 3); await settle(() => before(m.input, 'insertText', '9')); equal(m.input.value, 'AB92 CDE', 'Mask selected-slot replacement');
    m.input.setSelectionRange(3, 3); await settle(() => before(m.input, 'deleteContentBackward', null)); equal(m.input.value, 'AB_2 CDE', 'Mask backward clears slot without shifting');
    await settle(() => key(m.input, 'z', { ctrlKey: true })); equal(m.input.value, 'AB92 CDE', 'Mask local undo'); await settle(() => key(m.input, 'y', { ctrlKey: true })); equal(m.input.value, 'AB_2 CDE', 'Mask local redo');
    m.input.setSelectionRange(0, 8); await settle(() => before(m.input, 'deleteContentForward', null)); equal(m.input.value, '', 'Mask clear all empty optional');
  });
  await withMount('Textarea01', { maxLength: 4 }, async m => { await settle(() => input(m.input, '12345')); equal(m.input.value, '', 'Textarea synthetic overlength rejected whole'); await m.render({ value: 'owner-long' }); equal(m.input.value, 'owner-long', 'Textarea owner values not truncated'); });

  // Reset matrix uses actual form.reset, not only synthetic reset events.
  const fields = [
    { name: 'Checkbox01', base: false, edit: true, key: 'checked', defaultKey: 'defaultChecked', set: el => el.click() },
    { name: 'Switch01', base: false, edit: true, key: 'checked', defaultKey: 'defaultChecked', set: el => el.click() },
    { name: 'InputMask01', base: 'AB12 CDE', edit: 'XY34 ZAB', key: 'value', defaultKey: 'defaultValue', set: el => input(el, 'XY34 ZAB') },
    { name: 'Textarea01', base: 'baseline', edit: 'edited', key: 'value', defaultKey: 'defaultValue', set: el => input(el, 'edited') }
  ];
  for (const f of fields) {
    const get = m => m.input[f.key];
    for (const cancels of [[false],[true],[false,false],[false,true],[true,false],[true,true]]) {
      await withMount(f.name, { [f.defaultKey]: f.base }, async m => {
        await settle(() => f.set(m.input)); equal(get(m), f.edit, `${f.name}: pre-reset edit`);
        let n = 0; const listener = e => { if (cancels[n++]) e.preventDefault(); }; m.form.addEventListener('reset', listener);
        await settle(() => cancels.forEach(() => m.form.reset()));
        equal(get(m), cancels.every(Boolean) ? f.edit : f.base, `${f.name}: reset cancellation combinations ${cancels.join(',')}`);
      });
    }
    await withMount(f.name, { [f.defaultKey]: f.base }, async m => {
      await settle(() => { m.form.reset(); f.set(m.input); }); equal(get(m), f.edit, `${f.name}: newer post-return user edit wins`);
    });
    await withMount(f.name, { [f.defaultKey]: f.base }, async m => {
      m.form.addEventListener('reset', () => f.set(m.input)); await settle(() => m.form.reset()); equal(get(m), f.base, `${f.name}: in-dispatch ordinary edit precedes default reset`);
    });
    await withMount(f.name, { [f.defaultKey]: f.base }, async m => {
      await settle(() => f.set(m.input));
      await settle(() => { m.form.reset(); m.input.setAttribute('form', m.other.id); }); equal(get(m), f.edit, `${f.name}: current form transfer preserves model`);
      await settle(() => m.other.reset()); equal(get(m), f.base, `${f.name}: new associated form resets`);
    });
    await withMount(f.name, { [f.defaultKey]: f.base, [f.key]: f.edit }, async m => {
      await settle(() => m.form.reset()); equal(get(m), f.edit, `${f.name}: controlled owner wins reset`);
      await m.render({ [f.key]: undefined }); equal(get(m), f.edit, `${f.name}: released owner stays effective`);
      await settle(() => m.form.reset()); equal(get(m), f.base, `${f.name}: released field resets original baseline`);
    });
    await withMount(f.name, { [f.defaultKey]: f.base }, async m => {
      const old = m.input; await settle(() => { m.form.reset(); m.root.render(h(C[f.name], { key: 'new', [f.defaultKey]: f.edit })); }); equal(get(m), f.edit, `${f.name}: replacement baseline`); check(m.input !== old, `${f.name}: replacement node is distinct`);
    });
    const m = await mount(f.name, { [f.defaultKey]: f.base }); const old = m.input;
    await settle(() => { m.form.reset(); m.root.unmount(); }); m.form.remove(); m.other.remove(); check(!old.isConnected, `${f.name}: unmount with pending reset`);
  }

  // Composition normal, metadata preservation, cancellation, release and stale tails.
  for (const name of ['Textarea01','InputMask01']) {
    const base = name === 'Textarea01' ? 'baseline' : 'AB12 CDE';
    const draft = name === 'Textarea01' ? '组合输入' : 'xy34 zab';
    const result = name === 'Textarea01' ? draft : 'XY34 ZAB';
    let calls = 0;
    await withMount(name, { defaultValue: base, onValueChange: () => calls++ }, async m => {
      await settle(() => { compose(m.input, 'compositionstart', ''); input(m.input, draft, { isComposing: true, inputType: 'insertCompositionText' }); }); equal(calls, 0, `${name}: no intermediate proposal`); equal(m.input.value, draft, `${name}: live composition draft`);
      await m.render({ title: 'metadata', defaultValue: 'ignored' }); equal(m.input.value, draft, `${name}: metadata keeps draft`);
      await settle(() => { compose(m.input, 'compositionend', draft); input(m.input, draft, { inputType: 'insertFromComposition' }); }); equal(calls, 1, `${name}: one completion proposal`); equal(m.input.value, result, `${name}: committed draft`);
    });
    for (const route of ['owner-held','owner-release','ownerRevision','effective-reset','disabled','readOnly']) {
      calls = 0;
      await withMount(name, { defaultValue: base, onValueChange: () => calls++ }, async m => {
        await settle(() => { compose(m.input, 'compositionstart', ''); input(m.input, draft, { isComposing: true }); });
        if (route === 'owner-held' || route === 'owner-release') { await m.render({ value: base }); if (route === 'owner-release') await m.render({ value: undefined }); }
        else if (route === 'ownerRevision') await m.render({ ownerRevision: 1 });
        else if (route === 'effective-reset') await settle(() => m.form.reset());
        else await m.render({ [route]: true });
        await settle(() => { compose(m.input, 'compositionend', draft); input(m.input, draft); }); equal(calls, 0, `${name}: canceled ${route} stale tail no callback`); equal(m.input.value, base, `${name}: canceled ${route} owner/model protected`);
        await m.render({ value: undefined, disabled: false, readOnly: false });
        await settle(() => { before(m.input, 'insertText', name === 'Textarea01' ? '新' : 'z'); input(m.input, result); }); check(calls >= 1, `${name}: new noncomposition beforeinput recovers`);
      });
    }
    await withMount(name, { defaultValue: base }, async m => {
      await settle(() => { m.form.reset(); compose(m.input, 'compositionstart', ''); input(m.input, draft, { isComposing: true }); }); equal(m.input.value, draft, `${name}: new composition after reset return survives`);
    });
  }

  // Explicit synchronous commits are distinct from ordinary React batched setState.
  const flushSync = C.__flushSync;
  check(typeof flushSync === 'function', 'runner injects react-dom.flushSync for owner boundary probes');
  for (const f of fields) {
    const callback = f.key === 'checked' ? 'onCheckedChange' : 'onValueChange';
    for (const route of ['accept','reject-command','release','disabled','readOnly','replace','unmount']) {
      await withMount(f.name, { [f.defaultKey]: f.base }, async m => {
        let calls = 0;
        const apply = props => flushSync(() => m.root.render(h(C[f.name], props)));
        await m.render({ [callback]: () => {
          calls++;
          if (route === 'accept') apply({ [f.defaultKey]: f.base, [f.key]: f.edit });
          else if (route === 'reject-command') apply({ [f.defaultKey]: f.base, [f.key]: f.base, ownerRevision: 1 });
          else if (route === 'release') { apply({ [f.defaultKey]: f.base, [f.key]: f.edit }); apply({ [f.defaultKey]: f.base, [f.key]: undefined }); }
          else if (route === 'replace') apply({ key: 'replacement', [f.defaultKey]: f.edit });
          else if (route === 'unmount') flushSync(() => m.root.render(null));
          else apply({ [f.defaultKey]: f.base, [route]: true });
        }});
        await settle(() => f.set(m.input)); equal(calls, 1, `${f.name}: ${route} synchronous callback once`);
        if (route === 'unmount') equal(m.host.childNodes.length, 0, `${f.name}: callback unmount stays empty`);
        else equal(m.input[f.key], ['accept','release','replace'].includes(route) ? f.edit : f.base, `${f.name}: ${route} committed owner precedence`);
      });
    }
    for (const when of ['inside','after']) for (const command of ['same','write-release','replace']) {
      await withMount(f.name, { [f.defaultKey]: f.base }, async m => {
        await settle(() => f.set(m.input));
        const owner = () => {
          if (command === 'same') flushSync(() => m.root.render(h(C[f.name], { [f.defaultKey]: f.base, ownerRevision: 1 })));
          if (command === 'write-release') {
            flushSync(() => m.root.render(h(C[f.name], { [f.defaultKey]: f.base, [f.key]: f.edit })));
            flushSync(() => m.root.render(h(C[f.name], { [f.defaultKey]: f.base, [f.key]: undefined })));
          }
          if (command === 'replace') flushSync(() => m.root.render(h(C[f.name], { key: 'replacement', [f.defaultKey]: f.edit })));
        };
        if (when === 'inside') m.form.addEventListener('reset', owner, { once: true });
        await settle(() => { m.form.reset(); if (when === 'after') owner(); });
        equal(m.input[f.key], f.edit, `${f.name}: reset ${when} ${command} preserves newer owner`);
      });
    }
    await withMount(f.name, { [f.defaultKey]: f.base }, async m => {
      await settle(() => f.set(m.input));
      await settle(() => { m.form.reset(); f.set(m.input); });
      equal(m.input[f.key], f.edit, `${f.name}: same-model new input after reset return retires old job`);
    });
    await withMount(f.name, { [f.defaultKey]: f.base }, async m => {
      m.form.addEventListener('reset', () => {
        flushSync(() => m.root.render(h(C[f.name], { key: 'new-in-reset', [f.defaultKey]: f.edit })));
        // A normal new-instance edit during dispatch still precedes native reset.
        if (f.key === 'checked') m.input.click(); else input(m.input, f.base);
      }, { once: true });
      await settle(() => m.form.reset()); equal(m.input[f.key], f.edit, `${f.name}: replacement joins observed reset dispatch`);
    });
  }
  for (const name of ['Textarea01','InputMask01']) {
    const base = name === 'Textarea01' ? 'baseline' : 'AB12 CDE';
    const draft = name === 'Textarea01' ? '组合输入' : 'xy34 zab';
    const owner = name === 'Textarea01' ? 'owner' : 'PQ56 RST';
    await withMount(name, { defaultValue: base }, async m => {
      let calls = 0;
      await m.render({ onValueChange: () => {
        calls++;
        flushSync(() => m.root.render(h(C[name], { defaultValue: base, value: owner })));
        flushSync(() => m.root.render(h(C[name], { defaultValue: base, value: undefined })));
      }});
      await settle(() => { compose(m.input, 'compositionstart', ''); input(m.input, draft, { isComposing: true }); compose(m.input, 'compositionend', draft); input(m.input, draft); });
      equal(calls, 1, `${name}: completion owner write-release invokes proposal once`); equal(m.input.value, owner, `${name}: stale completion tail cannot overwrite released owner`);
    });
    await withMount(name, { defaultValue: base, value: base }, async m => {
      await settle(() => { compose(m.input, 'compositionstart', ''); input(m.input, draft, { isComposing: true }); });
      await m.render({ value: base, label: 'same-owner metadata' }); equal(m.input.value, draft, `${name}: unchanged controlled props preserve draft`);
      await m.render({ ownerRevision: 1 }); equal(m.input.value, base, `${name}: ownerRevision explicitly ends draft`);
    });
    await withMount(name, { defaultValue: base }, async m => {
      const outside = window.document.createElement('button'); outside.textContent = 'external focus'; window.document.body.append(outside);
      try { await m.render({ onValueChange: () => outside.focus() }); m.input.focus(); await settle(() => input(m.input, owner)); equal(window.document.activeElement, outside, `${name}: external focus takeover retained`); }
      finally { outside.remove(); }
    });
  }
  // A callback failure is surfaced once; the unfinished proposal stays uncommitted.
  for (const f of fields) {
    await withMount(f.name, { [f.defaultKey]: f.base }, async m => {
      const marker = 'expected-scalar-callback-failure'; let errors = 0;
      const listener = e => { if (e.error?.message === marker || e.message === marker) { errors++; e.preventDefault(); } };
      window.addEventListener('error', listener);
      try {
        await m.render({ [f.key === 'checked' ? 'onCheckedChange' : 'onValueChange']: () => { throw new Error(marker); } });
        await settle(() => f.set(m.input));
        equal(errors, 1, `${f.name}: callback exception surfaced`); equal(m.input[f.key], f.base, `${f.name}: exception did not commit proposal`);
      } finally { window.removeEventListener('error', listener); }
    });
  }
  // React click and change use different SyntheticEvents for one native activation.
  for (const name of ['Checkbox01','Switch01']) for (const baseline of [false,true]) {
    let changes=0,proposals=0;
    await withMount(name,{defaultChecked:baseline,onClick:e=>e.preventDefault(),onChange:()=>changes++,onCheckedChange:()=>proposals++},async m=>{
      await settle(()=>click(m.input));
      equal(changes,1,`${name}: native React change still forwarded`);
      equal(proposals,0,`${name}: canceled click suppresses model proposal`);
      equal(m.input.checked,baseline,`${name}: canceled activation restores model`);
      await m.render({onClick:undefined});await settle(()=>click(m.input));
      equal(proposals,1,`${name}: later uncanceled activation recovers`);
      equal(m.input.checked,!baseline,`${name}: later native state changes`);
    });
  }
  // Standard React onChange failure must restore the accepted native field value too.
  for (const f of fields) {
    await withMount(f.name, { [f.defaultKey]: f.base }, async m => {
      const marker = 'expected-native-change-failure'; let errors = 0, proposals = 0;
      const listener = e => { if (e.error?.message === marker || e.message === marker) { errors++; e.preventDefault(); } };
      window.addEventListener('error', listener);
      try {
        await m.render({ onChange: () => { throw new Error(marker); }, [f.key === 'checked' ? 'onCheckedChange' : 'onValueChange']: () => proposals++ });
        await settle(() => f.set(m.input));
        equal(errors, 1, `${f.name}: native onChange exception surfaced`);
        equal(proposals, 0, `${f.name}: native callback exception suppresses proposal`);
        equal(m.input[f.key], f.base, `${f.name}: native onChange exception restores DOM/model`);
      } finally { window.removeEventListener('error', listener); }
    });
  }
  await withMount('InputMask01', { onNativeBeforeInput: e => e.preventDefault() }, async m => {
    await settle(() => before(m.input, 'insertText', 'ab12cde')); equal(m.input.value, '', 'Mask modern beforeinput veto');
  });
  await withMount('Textarea01', { defaultValue: 'baseline' }, async m => {
    let calls = 0;
    await m.render({ onValueChange: () => { if (++calls === 1) input(m.input, 'newer'); } });
    await settle(() => input(m.input, 'older'));
    equal(calls, 2, 'Textarea reentrant proposal callbacks'); equal(m.input.value, 'newer', 'Textarea newer reentrant edit wins');
  });
  // Independent reset/tracker finding: repeat the previous value after native reset.
  for (const f of fields) for (const controlledAfterReset of [false, true]) {
    const callback = f.key === 'checked' ? 'onCheckedChange' : 'onValueChange';
    const ownerB = f.key === 'checked' ? false : f.name === 'InputMask01' ? 'PQ56 RST' : 'different-owner';
    let proposals = 0;
    await withMount(f.name, { [f.defaultKey]: f.base, [callback]: () => proposals++ }, async m => {
      await settle(() => f.set(m.input)); equal(proposals, 1, `${f.name}: tracker first proposal`);
      await settle(() => m.form.reset()); equal(m.input[f.key], f.base, `${f.name}: tracker native reset baseline`); equal(proposals, 1, `${f.name}: reset no proposal`);
      if (controlledAfterReset) await m.render({ [f.key]: ownerB });
      await settle(() => f.set(m.input));
      equal(proposals, 2, `${f.name}: old value after reset still proposes`);
      equal(m.input[f.key], controlledAfterReset ? ownerB : f.edit, `${f.name}: reset old-value ownership correct`);
    });
  }
  return { kind: 'author-react-scalar-regression', ids: 7, scenarios, assertions, browser: false, realIME: false, visual: false };
};
