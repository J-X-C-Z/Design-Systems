'use strict';
/** Author regression tests: one JSDOM document, no browser and no fixture package copies. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const D = process.env.LOCAL_DEPENDENCIES;
const FAMILY = process.env.FAMILY || 'composition';
const families = {
  structure: ['Select22', 'Select23', 'Select24', 'Select25'],
  menu: ['Select10', 'Select11', 'Select12', 'Select13'],
  composition: ['Select14', 'Select15.small', 'Select15.standard', 'Select15.large', 'Select16', 'Select17'],
  availability: ['Select18', 'Select19', 'Select20', 'Select21'],
};
if (!families[FAMILY]) throw new Error('FAMILY must be structure, menu, composition, or availability.');
const ENTRY = path.resolve(process.env.ENTRY || path.join(__dirname, '../dist/index.cjs'));
function inferRoot(entry) {
  let dir = path.dirname(entry);
  while (true) {
    if (fs.existsSync(path.join(dir, 'package.json')) && fs.existsSync(path.join(dir, 'src/index.tsx'))) return dir;
    const next = path.dirname(dir);
    if (next === dir) throw new Error('Cannot infer package source root from ENTRY; supply SOURCE_ROOT.');
    dir = next;
  }
}
const Q = path.resolve(process.env.SOURCE_ROOT || inferRoot(ENTRY));
const REPORT_PATH = path.resolve(process.env.REPORT_PATH || path.join(Q, 'qa/regroup-focus.json'));
const watched = [...new Set([ENTRY, __filename, ...['src/index.tsx', 'src/types.ts', 'src/index.d.ts'].map(p => path.join(Q, p))])];
const hash = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const snapshot = () => Object.fromEntries(watched.map(f => [f, hash(f)]));
const hashesBefore = snapshot();
const { JSDOM } = require(path.join(D, 'jsdom'));
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://local.test/', pretendToBeVisual: true });
for (const key of ['window', 'document', 'navigator', 'HTMLElement', 'HTMLButtonElement', 'HTMLSelectElement', 'HTMLFormElement', 'Element', 'Node', 'Event', 'MouseEvent', 'KeyboardEvent', 'FocusEvent', 'MutationObserver', 'FormData', 'getComputedStyle', 'requestAnimationFrame', 'cancelAnimationFrame']) {
  const bound = ['getComputedStyle', 'requestAnimationFrame', 'cancelAnimationFrame'].includes(key);
  Object.defineProperty(globalThis, key, { value: bound ? dom.window[key].bind(dom.window) : dom.window[key], configurable: true, writable: true });
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
// Load React and the candidate only after window exists, so its layout-effect branch is real.
const React = require(path.join(D, 'react'));
const { createRoot } = require(path.join(D, 'react-dom/client'));
const { flushSync } = require(path.join(D, 'react-dom'));
const api = require(ENTRY);
const h = React.createElement;
const tick = () => new Promise(resolve => setTimeout(resolve, 0));
const act = async callback => React.act(async () => { callback?.(); await tick(); await tick(); });
const item = value => ({ value, label: value.toUpperCase() });
const group = (label, values, disabled = false) => ({ label, options: values.map(item), ...(disabled ? { disabled: true } : {}) });
const layouts = {
  left: () => [group('First', ['a', 'b']), group('Second', ['c'])],
  right: () => [group('First', ['a']), group('Second', ['b', 'c'])],
  flat: () => ['a', 'b', 'c'].map(item),
  single: () => [group('All', ['a', 'b', 'c'])],
  emptyBefore: () => [group('Empty', []), group('First', ['a', 'b']), group('Second', ['c'])],
  emptyBetween: () => [group('First', ['a']), group('Empty', []), group('Second', ['b', 'c'])],
  emptyAfter: () => [group('First', ['a', 'b']), group('Second', ['c']), group('Empty', [])],
};
const flatten = items => items.flatMap(x => x.options || [x]).map(x => x.value);
const click = node => node.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
const key = (node, value) => node.dispatchEvent(new KeyboardEvent('keydown', { key: value, bubbles: true, cancelable: true }));
let assertionCount = 0;
const eq = (actual, expected, message) => { assertionCount++; assert.deepEqual(actual, expected, message); };
const same = (actual, expected, message) => { assertionCount++; assert.ok(actual === expected, message); };
const ok = (value, message) => { assertionCount++; assert.ok(value, message); };
const cases = [];
const add = (component, name, fn) => cases.push({ component, name, fn });
let liveRoot = null;
let liveCleanup = null;
async function cleanup() {
  if (liveRoot) { const root = liveRoot; liveRoot = null; await act(() => root.unmount()); }
  if (liveCleanup) { liveCleanup(); liveCleanup = null; }
  document.body.replaceChildren();
  document.body.removeAttribute('tabindex');
}
function renderControl(component, props) {
  const [name, slot] = component.split('.');
  if (typeof api[name] !== 'function' && typeof api[name] !== 'object') throw new Error(`Missing component export ${name}`);
  if (!slot) return h(api[name], props);
  // Select15 has three independent public prop slots. Top-level value/open/options do not control it.
  const slots = Object.fromEntries(['small', 'standard', 'large'].map(s => [s, { id: `other-${s}`, open: false, disabled: false, required: false }]));
  return h(api.Select15, { ...slots, [slot]: props });
}
async function fixture(component, config = {}) {
  await cleanup();
  document.body.tabIndex = -1;
  document.body.innerHTML = '<button id="outside">Outside</button><button id="action">Action</button><div id="root"></div><button id="after">After</button>';
  const container = document.getElementById('root');
  const root = createRoot(container); liveRoot = root;
  const events = [], focusEvents = [];
  const f = {
    container, events, focusEvents,
    external: () => document.getElementById('outside'),
    trigger: () => document.getElementById('test-select'),
    bridge: () => container.querySelector('select[name="regroup-choice"]'),
    list: () => { const id = f.trigger()?.getAttribute('aria-controls'); return id ? document.getElementById(id) : null; },
    option: value => [...(f.list()?.querySelectorAll('[role="option"]') || [])].find(n => n.dataset.value === value),
    focus: async target => act(() => (typeof target === 'string' ? f.option(target) : target).focus()),
    change: async patch => act(() => f.patch(patch)),
    clear: () => { events.length = 0; focusEvents.length = 0; },
    state: null, patch: null,
  };
  const focusLabel = node => node === document.body ? 'body' : node?.dataset?.value ? `option:${node.dataset.value}` : node?.id || node?.tagName || 'null';
  const recordFocus = e => focusEvents.push(focusLabel(e.target));
  document.addEventListener('focusin', recordFocus, true);
  liveCleanup = () => document.removeEventListener('focusin', recordFocus, true);
  function LayoutEffect({ phase, revision }) {
    React.useLayoutEffect(() => { if (revision > 0) config[phase]?.(f); }, [revision]);
    return null;
  }
  function Host() {
    const [state, setState] = React.useState({ options: config.options || layouts.left(), value: config.value ?? 'b', open: config.open ?? true, disabled: false, readOnly: false, visible: true, revision: 0 });
    f.state = state;
    f.patch = patch => setState(s => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch), revision: s.revision + 1 }));
    const props = {
      id: 'test-select', name: 'regroup-choice', options: state.options, disabled: state.disabled, readOnly: state.readOnly, required: false,
      ...(config.uncontrolledValue ? { defaultValue: config.value ?? 'b' } : { value: state.value }),
      ...(config.uncontrolledOpen ? { defaultOpen: config.open ?? true } : { open: state.open }),
      onValueChange: (value, detail) => { events.push({ kind: 'value', value, reason: detail.reason }); config.onValue?.(value, detail, f); },
      onOpenChange: (open, detail) => { events.push({ kind: 'open', open, reason: detail.reason }); config.onOpen?.(open, detail, f); },
      triggerProps: config.triggerProps,
    };
    React.useLayoutEffect(() => { if (state.revision > 0) config.parentLayout?.(f); }, [state.revision]);
    return h(React.Fragment, null,
      h(LayoutEffect, { phase: 'beforeLayout', revision: state.revision }),
      state.visible ? renderControl(component, props) : null,
      h(LayoutEffect, { phase: 'afterLayout', revision: state.revision }));
  }
  await act(() => root.render(h(Host)));
  ok(f.trigger(), 'Target trigger exists, including the actual Select15 slot');
  ok(f.bridge(), 'Target native bridge exists');
  f.clear();
  return f;
}
function expectFocus(f, value) { same(document.activeElement, f.option(value), `Focus remains on enabled option ${value}`); ok(f.option(value)?.isConnected, 'Focused option is connected'); }
function expectOpen(f, value = true) { eq(f.trigger()?.getAttribute('aria-expanded'), String(value), 'Open state respects its owner'); eq(!!f.list(), value, 'Portal existence agrees with open state'); }
function expectValue(f, value) { eq(f.bridge().value, value, 'Native bridge reflects selected value, not the highlighted option'); const selected = [...(f.list()?.querySelectorAll('[role="option"][aria-selected="true"]') || [])].map(n => n.dataset.value); if (f.list()) eq(selected, value ? [value] : [], 'ARIA selection agrees with value'); }
function expectQuiet(f) { eq(f.events, [], 'Structure/focus reconciliation creates no value/open proposal callbacks'); }
function expectExternal(f, target) { same(document.activeElement, target, 'Explicit newer focus destination retains ownership'); }
function expectOnlyFocusOut(f, count = 1) { eq(f.events, Array.from({ length: count }, () => ({ kind: 'open', open: false, reason: 'focus-out' })), 'Only genuine outside focus causes callbacks'); }
for (const component of families[FAMILY]) {
  const transitions = [
    ['same-order cross-group forward', 'left', 'right', true],
    ['same-order cross-group reverse', 'right', 'left', true],
    ['groups to flat', 'left', 'flat', true],
    ['flat to groups', 'flat', 'left', true],
    ['groups to one group', 'right', 'single', true],
    ['one group to groups', 'single', 'right', true],
    ['insert leading empty group', 'left', 'emptyBefore', true],
    ['remove leading empty group', 'emptyBefore', 'left', true],
    ['insert middle empty group', 'right', 'emptyBetween', true],
    ['remove middle empty group', 'emptyBetween', 'right', true],
    ['insert trailing empty group', 'left', 'emptyAfter', false],
    ['remove trailing empty group', 'emptyAfter', 'left', false],
  ];
  for (const [name, start, end, remount] of transitions) add(component, name, async () => {
    const f = await fixture(component, { options: layouts[start]() });
    expectFocus(f, 'b'); const before = f.option('b');
    eq(flatten(layouts[start]()), flatten(layouts[end]()), 'Flattened order is deliberately identical');
    await f.change({ options: layouts[end]() });
    expectFocus(f, 'b'); if (remount) ok(before !== f.option('b') && !before.isConnected, 'Case actually rebuilt the focused option DOM node');
    expectValue(f, 'b'); expectOpen(f); expectQuiet(f);
  });
  for (const uncontrolledValue of [false, true]) for (const uncontrolledOpen of [false, true]) add(component, `repeated moves with ${uncontrolledValue ? 'uncontrolled' : 'controlled'} value and ${uncontrolledOpen ? 'uncontrolled' : 'controlled'} open`, async () => {
    const f = await fixture(component, { value: 'a', uncontrolledValue, uncontrolledOpen });
    await f.focus('b'); f.clear();
    for (const name of ['right', 'flat', 'emptyBefore', 'left', 'emptyBetween', 'single', 'right', 'left']) {
      await f.change({ options: layouts[name]() }); expectFocus(f, 'b'); expectValue(f, 'a'); expectOpen(f); expectQuiet(f);
      eq(f.option('b').getAttribute('data-highlighted'), 'true', 'Highlight follows focus without selecting');
    }
  });
  add(component, 'owner changes selected value during regroup without replacing focus', async () => {
    const f = await fixture(component); await f.change({ options: layouts.right(), value: 'c' });
    expectFocus(f, 'b'); expectValue(f, 'c'); expectOpen(f); expectQuiet(f);
  });
  add(component, 'label and group-name updates do not move focus', async () => {
    const f = await fixture(component); const old = f.option('b');
    const options = layouts.left().map(g => ({ ...g, label: g.label + ' renamed', options: g.options.map(o => ({ ...o, label: o.label + ' updated' })) }));
    await f.change({ options }); expectFocus(f, 'b'); same(f.option('b'), old, 'Same parent and key retain option node'); expectValue(f, 'b'); expectQuiet(f);
  });
  add(component, 'regrouped highlight remains keyboard-operable without selecting', async () => {
    const f = await fixture(component, { value: 'a' }); await f.focus('b'); f.clear();
    await f.change({ options: layouts.right() }); await act(() => key(document.activeElement, 'ArrowDown'));
    expectFocus(f, 'c'); expectValue(f, 'a'); expectOpen(f); expectQuiet(f);
    await act(() => key(document.activeElement, 'ArrowUp')); expectFocus(f, 'b'); expectQuiet(f);
  });
  const fallbacks = [
    ['remove focused option', [group('First', ['a']), group('Second', ['c'])], 'a', ''],
    ['disable focused option', [group('First', ['a']), { label: 'Second', options: [{ ...item('b'), disabled: true }, item('c')] }], 'a', 'b'],
    ['disable focused group', [group('First', ['a']), group('Second', ['b', 'c'], true)], 'a', 'b'],
    ['disable every option', [group('Unavailable', ['a', 'b', 'c'], true)], null, 'b'],
    ['remove every option', [], null, ''],
    ['leave only empty groups', [group('First', []), group('Second', [])], null, ''],
  ];
  for (const [name, options, target, value] of fallbacks) add(component, name + ' uses enabled fallback only when popup owns focus', async () => {
    const f = await fixture(component); await f.change({ options });
    if (target) expectFocus(f, target); else same(document.activeElement, f.list(), 'No enabled option falls back to the listbox');
    expectValue(f, value); expectOpen(f); expectQuiet(f);
  });
  add(component, 'temporarily missing selected value does not overwrite controlled ownership', async () => {
    const f = await fixture(component); await f.change({ options: [group('Remaining', ['a', 'c'])] }); expectValue(f, '');
    await f.change({ options: layouts.right() }); expectValue(f, 'b'); expectFocus(f, 'a'); expectQuiet(f);
  });
  for (const destination of ['external', 'body', 'trigger', 'listbox', 'other-option']) add(component, `explicit ${destination} focus before regroup survives`, async () => {
    const f = await fixture(component);
    const target = destination === 'external' ? f.external() : destination === 'body' ? document.body : destination === 'trigger' ? f.trigger() : destination === 'listbox' ? f.list() : f.option('a');
    await f.focus(target); f.clear(); await f.change({ options: layouts.right() });
    if (destination === 'other-option') expectFocus(f, 'a'); else expectExternal(f, target);
    expectValue(f, 'b'); expectOpen(f); expectQuiet(f);
  });
  for (const destination of ['external', 'body', 'trigger']) for (const [mutation, options] of fallbacks.slice(0, 3)) add(component, `${mutation} respects pre-existing ${destination} focus`, async () => {
    const f = await fixture(component);
    const target = destination === 'external' ? f.external() : destination === 'body' ? document.body : f.trigger();
    await f.focus(target); f.clear(); await f.change({ options });
    expectExternal(f, target); expectOpen(f); expectQuiet(f);
  });
  for (const order of ['focus-before-update', 'focus-after-update']) for (const destination of ['external', 'body', 'trigger']) add(component, `${destination} focus in event handler ${order} is authoritative`, async () => {
    const f = await fixture(component); const target = destination === 'external' ? f.external() : destination === 'body' ? document.body : f.trigger();
    const action = document.getElementById('action');
    action.onclick = () => { if (order === 'focus-before-update') target.focus(); f.patch({ options: layouts.right() }); if (order === 'focus-after-update') target.focus(); };
    await act(() => click(action)); expectExternal(f, target); expectValue(f, 'b'); expectOpen(f);
    if (destination === 'trigger') expectQuiet(f); else expectOnlyFocusOut(f);
  });
  for (const phase of ['beforeLayout', 'afterLayout', 'parentLayout']) for (const destination of ['external', 'body', 'trigger']) add(component, `${destination} focus in ${phase} overrides detached-option restoration`, async () => {
    let targeted;
    const f = await fixture(component, { [phase]: current => {
      targeted = destination === 'external' ? current.external() : destination === 'body' ? document.body : current.trigger();
      // After removal body may already be active. A real external→body focus transition
      // proves a newer user focus event; no fabricated focusin event is dispatched.
      if (destination === 'body') current.external().focus();
      targeted.focus();
    } });
    await f.change({ options: layouts.right() }); expectExternal(f, targeted); expectValue(f, 'b'); expectOpen(f);
    const lastOwner = f.focusEvents.lastIndexOf(destination === 'external' ? 'outside' : destination === 'body' ? 'body' : 'test-select');
    ok(lastOwner >= 0, 'Explicit focus operation emitted its real focus event');
    ok(!f.focusEvents.slice(lastOwner + 1).some(x => x.startsWith('option:')), 'No option recovery steals focus after the newer owner');
    if (destination === 'trigger') expectQuiet(f); else expectOnlyFocusOut(f, destination === 'body' ? 2 : 1);
  });
  for (const destination of ['external', 'body', 'trigger']) for (const [mutation, options] of fallbacks.slice(0, 3)) add(component, `${mutation} respects newer ${destination} focus in an earlier sibling layout effect`, async () => {
    let targeted;
    const f = await fixture(component, { beforeLayout: current => {
      targeted = destination === 'external' ? current.external() : destination === 'body' ? document.body : current.trigger();
      if (destination === 'body') current.external().focus();
      targeted.focus();
    } });
    await f.change({ options }); expectExternal(f, targeted); expectOpen(f);
    if (destination === 'trigger') expectQuiet(f); else expectOnlyFocusOut(f, destination === 'body' ? 2 : 1);
  });
  add(component, 'newer focus after a synchronous regroup is not replayed over', async () => {
    const f = await fixture(component);
    await act(() => { flushSync(() => f.patch({ options: layouts.right() })); f.external().focus(); document.body.focus(); });
    expectExternal(f, document.body); expectOnlyFocusOut(f, 2); f.clear();
    await f.change({ options: layouts.left() }); expectExternal(f, document.body); expectQuiet(f);
  });
  add(component, 'canceled value proposal can regroup without changing value or closing', async () => {
    const f = await fixture(component, { value: 'a', onValue: (_v, detail, current) => { detail.preventDefault(); current.patch({ options: layouts.right() }); } });
    await f.focus('b'); f.clear(); await act(() => click(f.option('c')));
    expectFocus(f, 'b'); expectValue(f, 'a'); expectOpen(f);
    eq(f.events, [{ kind: 'value', value: 'c', reason: 'pointer' }], 'Only the requested, canceled value proposal fires');
  });
  add(component, 'value callback can regroup and explicitly redirect external focus', async () => {
    const f = await fixture(component, { value: 'a', onValue: (_v, detail, current) => { detail.preventDefault(); current.patch({ options: layouts.right() }); current.external().focus(); } });
    await f.focus('b'); f.clear(); await act(() => click(f.option('c')));
    expectExternal(f, f.external()); expectValue(f, 'a'); expectOpen(f);
    eq(f.events, [{ kind: 'value', value: 'c', reason: 'pointer' }, { kind: 'open', open: false, reason: 'focus-out' }], 'No selection-close callback after cancellation');
  });
  add(component, 'controlled selection proposal declined by owners does not mutate selected/open state', async () => {
    const f = await fixture(component, { value: 'a', onValue: (_v, _detail, current) => current.patch({ options: layouts.right() }) });
    await f.focus('b'); f.clear(); await act(() => click(f.option('c')));
    expectFocus(f, 'b'); expectValue(f, 'a'); expectOpen(f);
    eq(f.events, [{ kind: 'value', value: 'c', reason: 'pointer' }, { kind: 'open', open: false, reason: 'selection' }], 'One value and one close proposal; neither overrides owner');
  });
  add(component, 'accepted uncontrolled selection after regroup closes once and restores trigger', async () => {
    const f = await fixture(component, { value: 'a', uncontrolledValue: true, uncontrolledOpen: true });
    await f.focus('b'); await f.change({ options: layouts.right() }); f.clear(); await act(() => key(document.activeElement, 'Enter'));
    expectValue(f, 'b'); expectOpen(f, false); expectExternal(f, f.trigger());
    eq(f.events, [{ kind: 'value', value: 'b', reason: 'keyboard' }, { kind: 'open', open: false, reason: 'selection' }], 'Selection produces exactly its legitimate callbacks');
  });
  add(component, 'canceled escape callback can regroup and keep focused option', async () => {
    const f = await fixture(component, { uncontrolledOpen: true, onOpen: (_open, detail, current) => { if (detail.reason === 'escape') { detail.preventDefault(); current.patch({ options: layouts.right() }); } } });
    await act(() => key(document.activeElement, 'Escape'));
    expectFocus(f, 'b'); expectValue(f, 'b'); expectOpen(f);
    eq(f.events, [{ kind: 'open', open: false, reason: 'escape' }], 'Cancellation does not generate another close proposal');
  });
  add(component, 'canceled close with callback redirect preserves external focus', async () => {
    const f = await fixture(component, { onOpen: (_open, detail, current) => { if (detail.reason === 'escape') { detail.preventDefault(); current.patch({ options: layouts.right() }); current.external().focus(); } } });
    await act(() => key(document.activeElement, 'Escape'));
    expectExternal(f, f.external()); expectOpen(f); expectValue(f, 'b');
    eq(f.events, [{ kind: 'open', open: false, reason: 'escape' }, { kind: 'open', open: false, reason: 'focus-out' }]);
  });
  add(component, 'accepted escape with callback redirect does not steal focus back to trigger', async () => {
    const f = await fixture(component, { uncontrolledOpen: true, onOpen: (_open, detail, current) => { if (detail.reason === 'escape') { current.patch({ options: layouts.right() }); current.external().focus(); } } });
    await act(() => key(document.activeElement, 'Escape'));
    expectExternal(f, f.external()); expectOpen(f, false); expectValue(f, 'b');
    eq(f.events, [{ kind: 'open', open: false, reason: 'escape' }], 'A stale focus-out proposal cannot close twice');
  });
  add(component, 'owner closes while regrouping and reopening uses the current selected value', async () => {
    const f = await fixture(component); const old = f.option('b');
    await f.change({ options: layouts.right(), open: false, value: 'a' });
    expectOpen(f, false); ok(!old.isConnected, 'Old focused option is detached'); expectExternal(f, document.body); expectQuiet(f);
    await f.change({ open: true }); expectFocus(f, 'a'); expectValue(f, 'a'); expectQuiet(f);
  });
  for (const property of ['disabled', 'readOnly']) add(component, `${property} while regrouping revokes popup recovery`, async () => {
    const f = await fixture(component); const old = f.option('b');
    await f.change({ options: layouts.right(), [property]: true }); expectOpen(f, false); ok(!old.isConnected); expectExternal(f, document.body); expectQuiet(f);
    await act(() => f.external().focus()); f.clear(); await act(() => {}); expectExternal(f, f.external()); expectQuiet(f);
  });
  add(component, 'unmount during regroup does not refocus or create callbacks', async () => {
    const f = await fixture(component); const old = f.option('b');
    await f.change({ options: layouts.right(), visible: false }); ok(!old.isConnected); eq(document.querySelectorAll('[role="listbox"]').length, 0); expectExternal(f, document.body); expectQuiet(f);
    await act(() => f.external().focus()); f.clear(); await act(() => {}); expectExternal(f, f.external()); expectQuiet(f);
  });
  add(component, 'value callback can unmount and focus external without a stale close', async () => {
    const f = await fixture(component, { value: 'a', onValue: (_value, _detail, current) => { current.patch({ visible: false, options: layouts.right() }); current.external().focus(); } });
    await f.focus('b'); f.clear(); await act(() => click(f.option('c')));
    expectExternal(f, f.external()); eq(document.querySelectorAll('[role="listbox"]').length, 0);
    eq(f.events, [{ kind: 'value', value: 'c', reason: 'pointer' }]);
  });
}
(async () => {
  const results = [], failures = [];
  const start = Date.now();
  for (const test of cases) {
    const beforeCount = assertionCount;
    try { await test.fn(); results.push({ component: test.component, name: test.name, status: 'PASS', assertions: assertionCount - beforeCount }); }
    catch (error) {
      const failure = { component: test.component, name: test.name, error: error.stack || String(error) };
      failures.push(failure); results.push({ ...failure, status: 'FAIL', assertions: assertionCount - beforeCount });
      console.error(`FAIL ${test.component}: ${test.name}\n${error.message}`);
    }
  }
  await cleanup(); dom.window.close();
  const hashesAfter = snapshot();
  let immutable = true;
  try { assert.deepEqual(hashesAfter, hashesBefore); } catch (error) { immutable = false; failures.push({ name: 'Input immutability', error: error.stack }); }
  const report = { status: failures.length ? 'FAIL' : 'PASS', family: FAMILY, adapters: families[FAMILY], runtime: { node: process.version, react: React.version, jsdom: require(path.join(D, 'jsdom/package.json')).version }, cases: cases.length, passed: results.filter(x => x.status === 'PASS').length, failed: failures.length, assertions: assertionCount, completeMatrix: true, realBrowser: false, sourceRoot: Q, entry: ENTRY, durationMs: Date.now() - start, inputFilesUnchanged: immutable, hashesBefore, hashesAfter, failures, results, scope: 'Author regression matrix using real React and a single reused JSDOM document. Dynamic option regrouping, availability fallback, explicit focus ownership, controlled/uncontrolled value/open state, cancellation, close and unmount. No browser geometry, native browser focus fidelity, or independent-review claim.' };
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ status: report.status, family: FAMILY, cases: report.cases, passed: report.passed, failed: report.failed, assertions: assertionCount, inputFilesUnchanged: immutable, report: REPORT_PATH }));
  if (failures.length) process.exitCode = 1;
})().catch(async error => { console.error(error); try { await cleanup(); } catch {} dom.window.close(); process.exitCode = 1; });
