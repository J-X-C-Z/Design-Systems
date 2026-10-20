const {D, assert, w, d, React, h, Switch19: C, settle, ok, equal, test, state, finish} = require('./switch168-harness.cjs');

(async () => {
  await test('identity, unique labels and native form membership', async f => {
    f.render(h(React.Fragment, null, h('form', {id: 'switch-external'}), h(C, {name: 'sync', value: 'yes', form: 'switch-external', required: true, 'aria-describedby': 'extra extra', 'aria-label': 'Generic ignored', rootProps: {className: 'custom-card'}}), h(C)));
    const [first, second] = f.box.querySelectorAll('input'), label = f.box.querySelector('label');
    equal(first.type, 'checkbox', 'uses actual checkbox'); equal(first.getAttribute('role'), 'switch', 'has switch role');
    ok(first.id !== second.id, 'useId names are unique'); equal(label.htmlFor, first.id, 'visible label linked to input');
    equal(d.getElementById(first.getAttribute('aria-labelledby')).textContent, 'Auto sync', 'visible title supplies name');
    equal(first.getAttribute('aria-describedby'), 'extra ' + first.id + '-description', 'description IDs merged and deduplicated');
    equal(first.getAttribute('aria-label'), null, 'generic aria-label does not override visible name');
    equal(f.box.querySelector('.fr38-switch-status').getAttribute('aria-live'), 'polite', 'status polite');
    equal(new w.FormData(f.form()).get('sync'), 'yes', 'native external form includes checked switch');
    ok(first.validity.valid, 'checked required checkbox valid'); ok(f.box.querySelector('.custom-card'), 'rootProps class applied');
    state(f, true, 'default source checked'); first.click(); await settle(); state(f, false, 'native click unchecked');
    equal(new w.FormData(f.form()).get('sync'), null, 'unchecked omitted from FormData'); ok(first.validity.valueMissing, 'unchecked required checkbox missing');
  });
  await test('native click, input, change and real label activation', async f => {
    const calls = [], native = []; f.render(h('form', null, h(C, {name: 'sync', onClick: e => native.push(['click', e.type, e.currentTarget]), onInput: e => native.push(['input', e.type, e.currentTarget]), onChange: e => native.push(['change', e.type, e.currentTarget]), onCheckedChange: (next, details) => calls.push([next, details])})));
    f.box.querySelector('label').click(); await settle();
    equal(native.map(x => x[0]), ['click', 'change', 'input'], 'native handlers each fire once in React native order');
    ok(native.every(x => x[2] === f.input()), 'native handlers receive actual input currentTarget');
    equal(calls.length, 1, 'one semantic change from linked label'); equal(calls[0][0], false, 'proposal false');
    equal(calls[0][1].id, 'switch-19', 'proposal canonical ID'); equal(calls[0][1].reason, 'select', 'proposal select reason');
    equal(calls[0][1].previousChecked, true, 'proposal previous logical checked'); equal(calls[0][1].input, f.input(), 'proposal actual input');
    state(f, false, 'accepted label');
  });
  await test('controlled refusal, owner update and release', async f => {
    let owner = true, controlled = true, calls = []; const render = () => f.render(h('form', null, h(C, {name: 'sync', checked: controlled ? owner : undefined, onCheckedChange: (n, details) => calls.push([n, details.previousChecked, details.reason])})));
    render(); f.input().click(); await settle(); state(f, true, 'controlled refusal'); equal(new w.FormData(f.form()).get('sync'), 'on', 'refusing owner remains native submitted'); equal(calls, [[false, true, 'select']], 'controlled callback proposed only');
    owner = false; render(); await settle(); state(f, false, 'owner false'); f.form().reset(); await settle(); state(f, false, 'controlled reset restores owner'); equal(calls.length, 1, 'controlled reset no proposal');
    controlled = false; render(); await settle(); state(f, false, 'release last committed owner'); f.input().click(); await settle(); state(f, true, 'released owner accepts');
  });
  await test('mount default persists through metadata/default changes', async f => {
    let nextDefault = false; const calls = []; const render = () => f.render(h('form', null, h(C, {defaultChecked: nextDefault, name: 'sync', onCheckedChange: (n, details) => calls.push([n, details.reason, details.previousChecked])})));
    render(); f.input().click(); await settle(); state(f, true, 'toggled initial false'); nextDefault = true; render(); await settle(); f.form().reset(); await settle(); state(f, false, 'reset original false'); equal(calls, [[true, 'select', false], [false, 'reset', true]], 'reset uses immutable mount default');
  });
  await test('native defaultValue and readonly reset remain distinct from checked ownership', async f => {
    let readOnly = false, calls = []; const render = () => f.render(h('form', null, h(C, {name: 'sync', defaultValue: 'native-value', readOnly, onCheckedChange: (n, details) => calls.push([n, details.reason])})));
    render(); equal(new w.FormData(f.form()).get('sync'), 'native-value', 'native defaultValue controls submission value');
    f.input().click(); await settle(); readOnly = true; render(); f.input().click(); await settle(); state(f, false, 'readonly refuses native toggle');
    f.input().focus(); const space = new w.KeyboardEvent('keydown', {key: ' ', bubbles: true, cancelable: true}), enter = new w.KeyboardEvent('keydown', {key: 'Enter', bubbles: true, cancelable: true}); f.input().dispatchEvent(space); f.input().dispatchEvent(enter); await settle();
    ok(space.defaultPrevented && enter.defaultPrevented, 'readonly suppresses Space duplicate and Enter submit'); equal(calls, [[false, 'select']], 'readonly emits no selection proposal');
    f.form().reset(); await settle(); state(f, true, 'readonly permits native form reset'); equal(calls, [[false, 'select'], [true, 'reset']], 'readonly reset has correct reason'); equal(new w.FormData(f.form()).get('sync'), 'native-value', 'readonly checked control still submitted');
  });
  for (const mode of ['return-false', 'cancel', 'event-prevent', 'native-prevent', 'caller-click', 'caller-change', 'ancestor-click']) await test('click veto ' + mode, async f => {
    let seen, captured, calls = 0; const capture = e => { captured = e; if (mode === 'caller-click') e.preventDefault(); };
    f.render(h('form', {onClick: e => { if (mode === 'ancestor-click') e.preventDefault(); }}, h(C, {onClick: capture, onChange: e => { if (mode === 'caller-change') e.preventDefault(); }, onCheckedChange: (_n, details) => { calls++; seen = details.event; if (mode === 'return-false') return false; if (mode === 'cancel') details.cancel(); if (mode === 'event-prevent') details.event.preventDefault(); if (mode === 'native-prevent') details.event.nativeEvent.preventDefault(); }})));
    const event = new w.MouseEvent('click', {bubbles: true, cancelable: true}), descriptor = Object.getOwnPropertyDescriptor(event, 'preventDefault'); f.input().dispatchEvent(event); await settle();
    state(f, true, 'veto ' + mode); equal(calls, mode.startsWith('caller-') || mode === 'ancestor-click' ? 0 : 1, 'veto proposal count ' + mode);
    equal(Object.getOwnPropertyDescriptor(event, 'preventDefault'), descriptor, 'native descriptor restored ' + mode); equal(captured.preventDefault, Object.getPrototypeOf(captured).preventDefault, 'synthetic descriptor restored ' + mode);
    if (seen) equal(seen, captured, 'proposal carries original click event ' + mode);
  });
  for (const mode of ['return-false', 'cancel', 'event-prevent', 'ancestor-reset']) await test('reset veto ' + mode, async f => {
    const calls = []; let event; f.render(h('form', {onReset: e => { event = e.nativeEvent; if (mode === 'ancestor-reset') e.preventDefault(); }}, h(C, {onCheckedChange: (n, details) => { calls.push([n, details.reason]); if (details.reason === 'reset') { if (mode === 'return-false') return false; if (mode === 'cancel') details.cancel(); if (mode === 'event-prevent') details.event.preventDefault(); } }})));
    f.input().click(); await settle(); f.form().reset(); await settle(); state(f, false, 'reset veto ' + mode);
    equal(calls.length, mode === 'ancestor-reset' ? 1 : 2, 'reset veto callback count ' + mode); ok(!Object.hasOwn(event, 'preventDefault'), 'reset native descriptor restored ' + mode);
  });
  for (const mode of ['disabled', 'readOnly', 'fieldset', 'hidden', 'inert', 'display-none', 'unmount', 'owner-click', 'owner-key', 'owner-change', 'config-click']) await test('availability and epoch ' + mode, async f => {
    let controlled = false, owner = false, shown = true, name = 'sync', calls = 0; const ownerUpdate = () => { controlled = true; render(); };
    const render = () => f.render(h('form', null, h('fieldset', {disabled: mode === 'fieldset'}, shown && h(C, {checked: controlled ? owner : undefined, name, disabled: mode === 'disabled', readOnly: mode === 'readOnly', rootProps: {hidden: mode === 'hidden', inert: mode === 'inert', style: mode === 'display-none' ? {display: 'none'} : undefined}, onClick: () => { if (mode === 'owner-click') ownerUpdate(); if (mode === 'config-click') { name = 'new-name'; render(); } if (mode === 'unmount') { shown = false; render(); } }, onChange: () => { if (mode === 'owner-change') ownerUpdate(); }, onKeyDown: () => { if (mode === 'owner-key') ownerUpdate(); }, onCheckedChange: () => calls++ }))));
    render(); const input = f.input(); if (mode === 'owner-key') { input.focus(); input.dispatchEvent(new w.KeyboardEvent('keydown', {key: ' ', bubbles: true, cancelable: true})); } else input.click(); await settle();
    equal(calls, 0, 'no stale/unavailable callback ' + mode); if (mode !== 'unmount') state(f, mode.startsWith('owner-') ? false : true, 'availability/epoch ' + mode); else equal(f.input(), null, 'unmounted input absent');
  });
  for (const key of [' ', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Tab', 'a']) await test('keyboard ' + JSON.stringify(key), async f => {
    let clicks = 0, calls = []; f.render(h('form', {onSubmit: e => e.preventDefault()}, h(C, {onClick: () => clicks++, onCheckedChange: (n, details) => calls.push([n, details.reason])})));
    f.input().focus(); const event = new w.KeyboardEvent('keydown', {key, bubbles: true, cancelable: true}); f.input().dispatchEvent(event); await settle();
    equal(clicks, key === ' ' ? 1 : 0, 'one native Space click only ' + JSON.stringify(key)); equal(calls, key === ' ' ? [[false, 'keyboard']] : [], 'keyboard proposals ' + JSON.stringify(key));
    equal(event.defaultPrevented, key === ' ' || key === 'Enter', 'keyboard default handling ' + JSON.stringify(key)); state(f, key !== ' ', 'key owner ' + JSON.stringify(key));
    ok(!Object.hasOwn(event, 'preventDefault'), 'key native descriptor restored ' + JSON.stringify(key));
  });
  for (const mode of ['return-false', 'cancel', 'event-prevent', 'native-prevent', 'caller-prevent', 'ancestor-prevent', 'outside-focus', 'click-prevent', 'repeat']) await test('Space veto ' + mode, async f => {
    let captured, clicks = 0, calls = 0; f.render(h('div', {onKeyDown: e => { if (mode === 'ancestor-prevent') e.preventDefault(); if (mode === 'outside-focus') d.querySelector('#outside').focus(); }}, h(C, {onKeyDown: e => { captured = e; if (mode === 'caller-prevent') e.preventDefault(); }, onClick: e => { clicks++; if (mode === 'click-prevent') e.preventDefault(); }, onCheckedChange: (_n, details) => { calls++; if (mode === 'return-false') return false; if (mode === 'cancel') details.cancel(); if (mode === 'event-prevent') details.event.preventDefault(); if (mode === 'native-prevent') details.event.nativeEvent.preventDefault(); }})));
    f.input().focus(); const event = new w.KeyboardEvent('keydown', {key: ' ', bubbles: true, cancelable: true, repeat: mode === 'repeat'}); f.input().dispatchEvent(event); await settle(); state(f, true, 'Space veto ' + mode);
    equal(clicks, ['caller-prevent', 'ancestor-prevent', 'outside-focus', 'repeat'].includes(mode) ? 0 : 1, 'Space real click count ' + mode); equal(calls, ['return-false', 'cancel', 'event-prevent', 'native-prevent'].includes(mode) ? 1 : 0, 'Space semantic callback count ' + mode);
    ok(!Object.hasOwn(event, 'preventDefault'), 'Space native method restored ' + mode); equal(captured.preventDefault, Object.getPrototypeOf(captured).preventDefault, 'Space synthetic method restored ' + mode);
    if (mode === 'outside-focus') equal(d.activeElement.id, 'outside', 'explicit external focus retained');
  });
  for (const controlled of [false, true]) for (const direction of ['in', 'out']) for (const cancel of [false, true]) await test('live final form ' + [controlled, direction, cancel], async f => {
    let calls = [], metadata = 0; const original = direction === 'in' ? 'live-b' : 'live-a'; const render = () => f.render(h(React.Fragment, null, h('form', {id: 'live-a', onReset: e => { f.input().setAttribute('form', direction === 'in' ? 'live-a' : 'live-b'); if (cancel) e.preventDefault(); }}), h('form', {id: 'live-b'}), h(C, {name: 'sync', form: original, checked: controlled ? false : undefined, className: 'metadata-' + metadata, onCheckedChange: (n, details) => calls.push([n, details.reason])})));
    render(); if (!controlled) { f.input().click(); await settle(); } calls = []; f.form().reset(); await settle(); const expected = !controlled && direction === 'in' && !cancel; state(f, expected, 'live form result'); equal(calls, expected ? [[true, 'reset']] : [], 'live form exact callbacks'); metadata++; render(); await settle(); state(f, expected, 'live form survives metadata render');
    equal(new w.FormData(f.box.querySelector(direction === 'in' ? '#live-a' : '#live-b')).get('sync'), expected ? 'on' : null, 'live form native submission');
  });
  for (const kind of ['mount', 'replace-key']) for (const checked of [false, true]) await test('controlled during reset ' + [kind, checked], async f => {
    let shown = kind === 'replace-key', key = 0, calls = 0; const render = () => f.render(h('form', {onReset: () => { shown = true; key++; render(); }}, shown && h(C, {key, name: 'sync', checked, onCheckedChange: () => calls++})));
    render(); f.form().reset(); await settle(); state(f, checked, 'reset new controlled owner'); equal(new w.FormData(f.form()).get('sync'), checked ? 'on' : null, 'reset newly mounted FormData'); equal(calls, 0, 'no fabricated newly mounted callback');
  });
  await test('callback refs honor React19 cleanup and object refs', async f => {
    const refs = [], object = React.createRef(), rootObject = React.createRef(); let cleanups = 0;
    const callback = node => { refs.push(node); return () => cleanups++; };
    f.render(h(C, {ref: callback, rootProps: {ref: rootObject}})); equal(refs[0], f.input(), 'forwarded callback receives input'); equal(rootObject.current, f.box.firstChild, 'rootProps ref receives card');
    f.render(h(C, {ref: object, rootProps: {ref: rootObject}})); equal(cleanups, 1, 'callback cleanup called on ref replacement'); equal(refs.length, 1, 'cleanup callback receives no redundant null'); equal(object.current, f.input(), 'object ref actual input');
    f.render(null); equal(object.current, null, 'object ref cleared'); equal(rootObject.current, null, 'root ref cleared');
  });
  await test('SSR validates exact ownership union and explicit labels', async f => {
    const {renderToString} = require(D + '/react-dom/server');
    for (const props of [{checked: null}, {checked: 'true'}, {defaultChecked: 1}, {checked: false, defaultChecked: true}]) { assert.throws(() => renderToString(h(C, props)), TypeError); ok(true, 'invalid ownership rejected ' + JSON.stringify(props)); }
    const html = renderToString(h(C, {checked: false, name: 'sync'})).replace(/<!--.*?-->/g, ''); ok(html.includes('Manual updates only') && html.includes('Auto sync is disabled'), 'SSR text follows explicit owner'); ok(!html.includes('checked=""'), 'SSR owner false not checked');
    f.render(h(C, {'aria-labelledby': 'custom-name', 'aria-describedby': 'custom-description'})); equal(f.input().getAttribute('aria-labelledby'), 'custom-name', 'explicit labelledby caller override');
  });
  finish('SWITCH168-NATIVE');
})().catch(error => { console.error(error); w.close(); process.exitCode = 1; });
