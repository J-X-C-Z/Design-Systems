const {w, h, Switch19: C, settle, ok, equal, test, state, finish} = require('./switch168-harness.cjs');

(async () => {
  const operations = ['click', 'cancel-click', 'reset', 'cancel-reset', 'owner-false', 'owner-true', 'release'];
  let sequences = 0;
  for (const initial of [false, true]) for (const a of operations) for (const b of operations) for (const c of operations) {
    const steps = [a, b, c];
    await test('same-task ' + initial + '/' + steps.join(','), async f => {
      let controlled = false, owner = initial, cancelClick = false, cancelReset = false;
      const calls = [], render = () => f.render(h('form', {onReset: e => { if (cancelReset) e.preventDefault(); }, onClick: e => { if (cancelClick) e.preventDefault(); }}, h(C, {name: 'sync', checked: controlled ? owner : undefined, defaultChecked: controlled ? undefined : initial, onCheckedChange: (n, details) => calls.push([n, details.reason, details.previousChecked])})));
      render(); let expected = initial, modelControlled = false, epoch = 0; const queued = [];
      for (const operation of steps) {
        if (operation.startsWith('owner-')) {
          const next = operation === 'owner-true'; if (!modelControlled || expected !== next) epoch++;
          expected = next; modelControlled = true; controlled = true; owner = next; render();
        } else if (operation === 'release') {
          if (modelControlled) epoch++; modelControlled = false; controlled = false; render();
        } else {
          const canceled = operation.startsWith('cancel-'), reset = operation.includes('reset'); queued.push({stamp: epoch, reset, canceled});
          if (reset) { cancelReset = canceled; f.form().reset(); cancelReset = false; }
          else { cancelClick = canceled; f.input().click(); cancelClick = false; }
        }
      }
      const expectedCalls = [];
      for (const action of queued) {
        if (action.stamp !== epoch || action.canceled || action.reset && modelControlled) continue;
        const next = action.reset ? initial : !expected; if (expected === next) continue;
        expectedCalls.push([next, action.reset ? 'reset' : 'select', expected]); if (!modelControlled) expected = next;
      }
      await settle(); state(f, expected, 'same-task ' + [initial, ...steps]);
      equal(new w.FormData(f.form()).get('sync'), expected ? 'on' : null, 'same-task real FormData ' + [initial, ...steps]);
      equal(calls, expectedCalls, 'same-task proposal order ' + [initial, ...steps]); sequences++;
    });
  }
  for (const mode of ['click-in-click', 'reset-in-click', 'click-in-reset', 'veto-with-nested-click', 'owner-in-callback', 'unmount-in-callback']) await test('reentrant ' + mode, async f => {
    let calls = [], fired = false, controlled = false, shown = true;
    const render = () => f.render(h('form', null, shown && h(C, {name: 'sync', checked: controlled ? false : undefined, onCheckedChange: (n, details) => {
      calls.push([n, details.reason, details.previousChecked]); if (fired) return; fired = true;
      if (mode === 'click-in-click' || mode === 'veto-with-nested-click') f.input().click();
      if (mode === 'reset-in-click') f.form().reset();
      if (mode === 'click-in-reset' && details.reason === 'reset') f.input().click();
      if (mode === 'veto-with-nested-click') details.cancel();
      if (mode === 'owner-in-callback') { controlled = true; render(); }
      if (mode === 'unmount-in-callback') { shown = false; render(); }
    }})));
    render();
    if (mode === 'click-in-reset') { fired = true; f.input().click(); await settle(); calls = []; fired = false; f.form().reset(); }
    else f.input().click();
    await settle();
    const expectedCalls = {
      'click-in-click': [[false, 'select', true], [true, 'select', false]],
      'reset-in-click': [[false, 'select', true], [true, 'reset', false]],
      'click-in-reset': [[true, 'reset', false], [false, 'select', true]],
      'veto-with-nested-click': [[false, 'select', true], [false, 'select', true]],
      'owner-in-callback': [[false, 'select', true]],
      'unmount-in-callback': [[false, 'select', true]]
    };
    equal(calls, expectedCalls[mode], 'reentrant exact proposal details ' + mode);
    if (mode === 'unmount-in-callback') equal(f.input(), null, 'unmount callback remains absent');
    else state(f, ['click-in-click', 'reset-in-click'].includes(mode), 'reentrant final state ' + mode);
  });
  for (const mode of ['readonly', 'disabled-fieldset', 'hidden', 'input-owner']) await test('late availability ' + mode, async f => {
    let readOnly = false, owner = undefined, calls = 0; const render = () => f.render(h('form', null, h('fieldset', null, h(C, {readOnly, checked: owner, onInput: () => { if (mode === 'input-owner') { owner = false; render(); } }, onCheckedChange: () => calls++}))));
    render(); f.input().click();
    if (mode === 'readonly') { readOnly = true; render(); }
    if (mode === 'disabled-fieldset') f.box.querySelector('fieldset').disabled = true;
    if (mode === 'hidden') f.box.querySelector('.fr38-switch-card').hidden = true;
    await settle(); equal(calls, 0, 'late changes invalidate proposal ' + mode); state(f, mode !== 'input-owner', 'late availability owner ' + mode);
  });
  await test('custom native cancellation descriptor is restored exactly', async f => {
    let calls = 0; f.render(h(C, {onCheckedChange: (_n, details) => { calls++; details.event.preventDefault(); }}));
    const event = new w.MouseEvent('click', {bubbles: true, cancelable: true}), original = event.preventDefault;
    const descriptor = {value: function () { return original.call(this); }, writable: true, configurable: true, enumerable: true}; Object.defineProperty(event, 'preventDefault', descriptor);
    f.input().dispatchEvent(event); await settle(); equal(Object.getOwnPropertyDescriptor(event, 'preventDefault'), descriptor, 'own method descriptor exactly restored'); equal(calls, 1, 'custom method proposal invoked'); state(f, true, 'custom method veto');
  });
  finish('SWITCH168-ORDER', {sequences});
})().catch(error => { console.error(error); w.close(); process.exitCode = 1; });
