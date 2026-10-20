'use strict';
/** Real React example author tests. ENTRY/PACKAGE_ROOT choose the unchanged package under test. */
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const D = process.env.LOCAL_DEPENDENCIES;
const Q = path.resolve(__dirname, '..');
const SOURCE_ROOT = path.resolve(process.env.SOURCE_ROOT || Q);
const PACKAGE_ROOT = path.resolve(process.env.PACKAGE_ROOT || Q);
const ENTRY = path.resolve(process.env.ENTRY || path.join(PACKAGE_ROOT, 'dist/index.cjs'));
const REPORT = path.resolve(process.env.REPORT_PATH || path.join(Q, 'qa/example.json'));
const FILTER = process.env.CASE_FILTER || '';
const exampleSource = path.join(SOURCE_ROOT, 'examples/CapsuleDesk.tsx');
const helperSource = path.join(SOURCE_ROOT, 'examples/palette-capsule.ts');
const cssSource = path.join(PACKAGE_ROOT, 'src/styles.css');
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const watched = [...new Set([__filename, exampleSource, helperSource, ENTRY, cssSource, ...['src/index.tsx', 'src/types.ts', 'src/index.d.ts'].map(file => path.join(PACKAGE_ROOT, file)).filter(fs.existsSync)])];
const hashesBefore = Object.fromEntries(watched.map(file => [file, sha(file)]));
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'wix-capsule-example-'));
const esbuild = require(path.join(D, 'esbuild'));
const { JSDOM } = require(path.join(D, 'jsdom'));
const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', { url: 'https://capsule-example.test/', pretendToBeVisual: true });
for (const name of ['window', 'document', 'navigator', 'HTMLElement', 'HTMLButtonElement', 'HTMLSelectElement', 'HTMLFormElement', 'Element', 'Node', 'Event', 'MouseEvent', 'KeyboardEvent', 'FocusEvent', 'MutationObserver', 'FormData', 'getComputedStyle', 'requestAnimationFrame', 'cancelAnimationFrame']) {
  Object.defineProperty(globalThis, name, { value: ['getComputedStyle', 'requestAnimationFrame', 'cancelAnimationFrame'].includes(name) ? dom.window[name].bind(dom.window) : dom.window[name], configurable: true, writable: true });
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const React = require(path.join(D, 'react'));
const { createRoot } = require(path.join(D, 'react-dom/client'));
const { flushSync } = require(path.join(D, 'react-dom'));
const h = React.createElement;
const tick = () => new Promise(resolve => setTimeout(resolve, 0));
const act = async run => React.act(async () => { run?.(); await Promise.resolve(); await tick(); await tick(); });
let assertions = 0, root = null, container = null, api;
const eq = (actual, expected, message) => { assertions++; assert.deepEqual(actual, expected, message); };
const ok = (value, message) => { assertions++; assert.ok(value, message); };
const same = (actual, expected, message) => { assertions++; assert.ok(actual === expected, message || 'DOM node identity differs'); };
const cases = [];
const add = (name, run) => cases.push({ name, run });
const sample = ['#A47864', '#D9BBA2', '#F4EDE3', '#6D5548', '#30231E'];
const defaults = { layout: 'grid', discipline: 'dev', dialect: 'css', stage: 'active' };
const selected = { layout: 'contrast', discipline: 'global', dialect: 'csv', stage: 'deprecated' };
const choices = {
  layout: [['grid', 'Compact card grid'], ['list', 'Spacious color list'], ['table', 'Token reference table'], ['contrast', 'Contrast reference ledger']],
  discipline: [['dev', 'Engineering'], ['creative', 'Creative Arts'], ['data', 'Analytics'], ['global', 'Network Ops']],
  dialect: [['css', 'CSS custom properties'], ['js', 'JavaScript object'], ['json', 'JSON tokens'], ['csv', 'CSV rows']],
  stage: [['draft', 'Unpublished Draft'], ['active', 'Live Deployment'], ['archived', 'Archived Record'], ['deprecated', 'Legacy System']],
};
let nextURL = 1, orderTrace = null;
const evidenceTraces = {};
const created = [], revoked = [], clicks = [], revocationOwners = [];
const originalAnchorClick = window.HTMLAnchorElement.prototype.click;
window.URL.createObjectURL = blob => { ok(blob instanceof window.Blob, 'An actual owner-window Blob is passed to URL.createObjectURL'); const url = `blob:https://capsule-example.test/${nextURL++}`; created.push({ url, blob }); if (orderTrace) orderTrace.push({ step: 'createObjectURL', committedFormValues: Object.fromEntries(new window.FormData(container.querySelector('form'))) }); return url; };
window.URL.revokeObjectURL = function(url) { revoked.push(url); revocationOwners.push(this); };
window.HTMLAnchorElement.prototype.click = function() { clicks.push({ href: this.href, filename: this.download, connected: this.isConnected, owner: this.ownerDocument }); };
async function cleanup() {
  if (root) { const previous = root; root = null; await act(() => previous.unmount()); }
  document.body.replaceChildren(); container = null;
}
async function mount({ colors, hostProps = {}, strict = false, motion } = {}) {
  await cleanup(); created.length = 0; revoked.length = 0; clicks.length = 0; revocationOwners.length = 0;
  document.body.innerHTML = '<button id="outside">Outside</button><div id="root"></div>';
  container = document.getElementById('root'); root = createRoot(container);
  const f = { colors, hostProps, strict, motion };
  f.render = patch => {
    Object.assign(f, patch);
    const props = { ...(f.colors === undefined ? {} : { colors: f.colors }), ...(f.motion === undefined ? {} : { motion: f.motion }) };
    const element = h('div', { id: 'host', ...f.hostProps }, h(api.CapsuleDesk, props));
    root.render(f.strict ? h(React.StrictMode, null, element) : element);
  };
  f.update = patch => act(() => f.render(patch));
  f.form = () => container.querySelector('form');
  f.native = name => f.form().querySelector(`select[name="${name}"]`);
  f.trigger = name => f.native(name).closest('.wix-select-content').querySelector('[role="combobox"]');
  f.list = name => document.getElementById(f.trigger(name).getAttribute('aria-controls'));
  f.values = () => Object.fromEntries(new window.FormData(f.form()));
  f.status = () => container.querySelector('[role="status"]');
  f.frame = () => container.querySelector('iframe');
  f.submit = () => f.form().dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  f.open = name => act(() => click(f.trigger(name)));
  f.choose = async (name, value) => {
    await f.open(name);
    const option = [...f.list(name).querySelectorAll('[role="option"]')].find(node => node.dataset.value === value);
    ok(option, `Real ${name} popup contains ${value}`);
    const rich = option.querySelector('.wix-sct-rich').innerHTML;
    for (const svg of option.querySelectorAll('svg')) { eq(svg.getAttribute('aria-hidden'), 'true'); eq(svg.getAttribute('focusable'), 'false'); ok(svg.tabIndex < 0); }
    await act(() => click(option.querySelector('svg > *') || option.querySelector('.wix-sct-rich-text') || option));
    eq(f.native(name).value, value); eq(f.list(name), null); same(document.activeElement, f.trigger(name));
    eq(f.trigger(name).querySelector('.wix-sct-rich').innerHTML, rich, 'Selected trigger and real popup share exact rich label/decorative SVG content');
  };
  await act(() => f.render({}));
  return f;
}
function click(node) { ok(node, 'Click target exists'); node.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })); }
function preview(f, settings = defaults, colors = f.colors === undefined ? sample : f.colors) {
  const artifact = api.buildPaletteCapsule(settings, colors), frame = f.frame();
  ok(frame, 'The inert preview iframe exists');
  eq(frame.getAttribute('title'), 'Inert palette capsule preview');
  eq(frame.getAttribute('sandbox'), '');
  eq(frame.hasAttribute('src'), false);
  eq(frame.getAttribute('srcdoc'), artifact.html, 'srcDoc is exactly the current pure helper output');
  eq(container.querySelector('[aria-label="Exact inert capsule HTML"] code').textContent, artifact.html);
  return artifact;
}
async function blobText(blob) {
  return new Promise((resolve, reject) => {
    const reader = new window.FileReader();
    const limit = setTimeout(() => reject(Error('Blob text read exceeded 1 second.')), 1000);
    reader.onload = () => { clearTimeout(limit); resolve(reader.result); };
    reader.onerror = () => { clearTimeout(limit); reject(reader.error); };
    reader.readAsText(blob);
  });
}
async function verifyExport(f, settings = f.values(), colors = f.colors === undefined ? sample : f.colors) {
  const expected = api.buildPaletteCapsule(settings, colors), record = created.at(-1), anchor = clicks.at(-1);
  ok(record, 'An object URL was created'); ok(anchor, 'The temporary download anchor was clicked');
  eq(record.blob.type, expected.mime); eq(await blobText(record.blob), expected.html);
  eq(anchor.href, record.url); eq(anchor.filename, expected.filename); eq(anchor.connected, true); same(anchor.owner, document);
  eq(document.querySelectorAll('a[download]').length, 0, 'Temporary anchor is removed');
  eq(f.status().textContent, `Prepared ${expected.filename}`);
  return expected;
}
async function changeAll(f) { for (const [name, value] of Object.entries(selected)) await f.choose(name, value); }
function canceledHost(eventName, kind, phase, handler) {
  const reactName = `on${eventName[0].toUpperCase()}${eventName.slice(1)}${phase === 'capture' ? 'Capture' : ''}`;
  return kind === 'synthetic' ? { [reactName]: handler } : {};
}
function nativeCancellation(eventName, kind, phase, handler) {
  if (kind !== 'native') return () => {};
  // document bubble runs after React's root bubble, exercising late cancellation.
  document.addEventListener(eventName, handler, phase === 'capture');
  return () => document.removeEventListener(eventName, handler, phase === 'capture');
}
add('default real controls have exact internal form fields groups labels and inert preview', async () => {
  const f = await mount();
  eq(container.querySelectorAll('form').length, 1); eq(f.values(), defaults);
  eq([...new window.FormData(f.form())], Object.entries(defaults));
  eq([...f.form().querySelectorAll('select')].map(node => node.name), ['layout', 'discipline', 'dialect', 'stage']);
  eq([...f.form().querySelectorAll('label')].map(node => node.textContent), ['Capsule layout', 'Portfolio Category', 'Token format', 'Lifecycle Stage']);
  eq(f.form().querySelectorAll('[role="combobox"]').length, 4);
  for (const name of Object.keys(choices)) {
    eq([...f.native(name).options].slice(1).map(option => [option.value, option.textContent]), choices[name]);
    same(f.native(name).form, f.form()); eq(f.native(name).querySelectorAll('svg,span').length, 0);
    eq(f.trigger(name).querySelector('.wix-sct-rich-text').textContent, choices[name].find(([value]) => value === defaults[name])[1]);
  }
  eq(f.trigger('dialect').querySelector('.wix-sct-prefix').textContent, 'Token dialect:');
  eq(f.native('dialect').options[1].textContent, 'CSS custom properties');
  eq(f.trigger('discipline').querySelector('svg[data-icon]').dataset.icon, 'code');
  eq(f.trigger('stage').querySelector('svg[data-status]').dataset.status, 'active');
  await f.open('layout');
  eq([...f.list('layout').querySelectorAll('[role="group"]')].map(group => document.getElementById(group.getAttribute('aria-labelledby')).textContent), ['Color cards', 'Reference formats']);
  await act(() => f.trigger('layout').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })));
  const artifact = preview(f); eq(f.status().textContent, artifact.filename); eq(created.length, 0); eq(clicks.length, 0);
  eq(f.form().querySelector('button[type="submit"]').disabled, false);
});
for (const name of Object.keys(choices)) add(`all four ${name} choices change the real preview and exact downloadable Blob`, async () => {
  const f = await mount(), state = { ...defaults }, htmls = new Set(), names = new Set(), tokenPayloads = new Set();
  for (const [value, label] of choices[name]) {
    await f.choose(name, value); state[name] = value;
    eq(f.values(), state); eq([...new window.FormData(f.form())], Object.entries(state));
    eq(f.trigger(name).querySelector('.wix-sct-rich-text').textContent, label);
    eq(f.trigger('dialect').querySelector('.wix-sct-prefix').textContent, 'Token dialect:');
    const artifact = preview(f, state); htmls.add(artifact.html); names.add(artifact.filename); tokenPayloads.add(artifact.tokens);
    const count = created.length; await act(() => click(f.form().querySelector('button[type="submit"]')));
    eq(created.length, count + 1); eq(clicks.length, count + 1); await verifyExport(f, state);
    eq(revoked, created.slice(0, -1).map(record => record.url));
  }
  eq(htmls.size, 4); eq(names.size, 4); eq(tokenPayloads.size, name === 'layout' ? 1 : 4);
});
add('all controls combine through actual popup choices then native reset restores defaults and next export', async () => {
  const f = await mount(); await changeAll(f); eq(f.values(), selected); preview(f, selected);
  await act(() => f.submit()); await verifyExport(f, selected); const previousURL = created[0].url;
  await act(() => click(f.form().querySelector('button[type="reset"]')));
  eq(f.values(), defaults); eq([...new window.FormData(f.form())], Object.entries(defaults));
  const artifact = preview(f); eq(f.status().textContent, artifact.filename); eq(created.length, 1); eq(clicks.length, 1);
  await act(() => f.submit()); eq(created.length, 2); await verifyExport(f, defaults); eq(revoked, [previousURL]);
});
for (const motion of ['system', 'on', 'off']) add(`${motion} example motion is forwarded to all four controls and their real popups`, async () => {
  const f = await mount({ motion }), expected = preview(f);
  eq([...container.querySelectorAll('.wix-select-content')].map(node => node.dataset.motion), Array(4).fill(motion));
  for (const name of Object.keys(choices)) {
    await f.open(name); eq(f.list(name).closest('.wix-sct-popup').dataset.motion, motion);
    const next = motion === 'off' ? 'on' : 'off'; await f.update({ motion: next });
    eq([...container.querySelectorAll('.wix-select-content')].map(node => node.dataset.motion), Array(4).fill(next)); eq(f.list(name).closest('.wix-sct-popup').dataset.motion, next);
    await act(() => f.list(name).dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true })));
    await f.update({ motion });
  }
  eq(preview(f).html, expected.html); await act(() => f.submit()); await verifyExport(f);
});
for (const kind of ['synthetic', 'native']) for (const phase of ['capture', 'bubble']) {
  add(`${kind} ${phase} canceled submit preserves current preview and never exports`, async () => {
    let calls = 0; const cancel = event => { calls++; event.preventDefault(); };
    const f = await mount({ hostProps: canceledHost('submit', kind, phase, cancel) });
    await f.choose('stage', 'archived'); const state = { ...defaults, stage: 'archived' }, expected = preview(f, state);
    const remove = nativeCancellation('submit', kind, phase, cancel);
    const event = new window.Event('submit', { bubbles: true, cancelable: true });
    try { await act(() => f.form().dispatchEvent(event)); }
    finally { remove(); }
    eq(calls, 1); eq(event.defaultPrevented, true); eq(Object.hasOwn(event, 'preventDefault'), false, 'Any temporary preventDefault wrapper is removed');
    eq(created.length, 0); eq(clicks.length, 0); eq(revoked, []); eq(f.values(), state); preview(f, state); eq(f.status().textContent, expected.filename);
    await f.update({ hostProps: {} }); await act(() => f.submit()); eq(created.length, 1); await verifyExport(f, state);
  });
  add(`${kind} ${phase} canceled native reset preserves chosen values prepared status and export`, async () => {
    let calls = 0, canceledEvent; const cancel = event => { calls++; event.preventDefault(); canceledEvent = event.nativeEvent || event; };
    const f = await mount({ hostProps: canceledHost('reset', kind, phase, cancel) });
    await changeAll(f); await act(() => f.submit()); const expected = await verifyExport(f, selected);
    const remove = nativeCancellation('reset', kind, phase, cancel);
    try { await act(() => f.form().reset()); } finally { remove(); }
    eq(calls, 1); eq(canceledEvent.defaultPrevented, true); eq(f.values(), selected); preview(f, selected);
    eq(f.status().textContent, `Prepared ${expected.filename}`); eq(created.length, 1); eq(clicks.length, 1); eq(revoked, []);
    await f.update({ hostProps: {} }); await act(() => f.form().reset()); eq(f.values(), defaults); preview(f);
  });
  add(`queued submit then ${kind} ${phase} canceled reset retains the authorized export`, async () => {
    let calls = 0; const cancel = event => { calls++; event.preventDefault(); };
    const f = await mount({ hostProps: canceledHost('reset', kind, phase, cancel) });
    await f.choose('dialect', 'json'); const state = { ...defaults, dialect: 'json' };
    const remove = nativeCancellation('reset', kind, phase, cancel);
    try { await act(() => { f.submit(); f.form().reset(); }); } finally { remove(); }
    eq(calls, 1); eq(created.length, 1); eq(clicks.length, 1); eq(f.values(), state); await verifyExport(f, state); preview(f, state);
  });
}
add('queued submit then accepted native reset does not leak an export', async () => {
  const f = await mount(); await f.choose('layout', 'contrast');
  await act(() => { f.submit(); f.form().reset(); });
  eq(created.length, 0, 'An accepted later reset invalidates a submit that has not exported yet');
  eq(clicks.length, 0); eq(f.values(), defaults); preview(f);
});
add('accepted native reset then queued submit exports the reset defaults exactly once', async () => {
  const f = await mount(); await changeAll(f);
  await act(() => { f.form().reset(); f.submit(); });
  eq(created.length, 1); eq(clicks.length, 1); eq(f.values(), defaults); preview(f); await verifyExport(f, defaults);
});
add('queued submit reset submit discards only the superseded submission', async () => {
  const f = await mount(); await f.choose('discipline', 'creative');
  await act(() => { f.submit(); f.form().reset(); f.submit(); });
  eq(created.length, 1); eq(clicks.length, 1); eq(f.values(), defaults); await verifyExport(f, defaults);
});
add('queued submit reset submit reset discards both stale exports', async () => {
  const f = await mount(); await f.choose('stage', 'draft');
  await act(() => { f.submit(); f.form().reset(); f.submit(); f.form().reset(); });
  eq(created.length, 0); eq(clicks.length, 0); eq(f.values(), defaults); preview(f);
});
add('queued submit precedes a later uncommitted popup proposal and exports its committed state', async () => {
  const f = await mount(), submitted = preview(f); await f.open('layout');
  const row = [...f.list('layout').querySelectorAll('[role="option"]')].find(node => node.dataset.value === 'table');
  const trace = [], proto = window.HTMLSelectElement.prototype, descriptor = Object.getOwnPropertyDescriptor(proto, 'value');
  orderTrace = trace;
  Object.defineProperty(proto, 'value', { ...descriptor, set(value) { descriptor.set.call(this, value); if (this.name === 'layout') trace.push({ step: 'native-layout-value-write', value }); } });
  try {
    await act(() => {
      trace.push({ step: 'before-events', values: f.values() });
      f.submit(); trace.push({ step: 'after-submit-dispatch', values: f.values(), exports: created.length });
      click(row.querySelector('.wix-sct-rich-text')); trace.push({ step: 'after-popup-click-dispatch', values: f.values(), exports: created.length });
    });
    trace.push({ step: 'after-act', values: f.values(), exports: created.length });
  } finally { orderTrace = null; Object.defineProperty(proto, 'value', descriptor); evidenceTraces.submitThenDeferredProposal = trace; }
  // Select proposal callbacks themselves are deferred. An earlier submit owns the
  // already-committed state, while the later popup proposal updates the preview.
  eq(created.length, 1); eq(clicks.length, 1); eq(await blobText(created[0].blob), submitted.html); eq(clicks[0].filename, submitted.filename);
  eq(f.values(), { ...defaults, layout: 'table' }); const current = preview(f, { ...defaults, layout: 'table' }); eq(f.status().textContent, current.filename);
  const exportAt = trace.findIndex(event => event.step === 'createObjectURL'), tableAt = trace.findIndex(event => event.step === 'native-layout-value-write' && event.value === 'table');
  ok(exportAt >= 0 && tableAt > exportAt, 'Trace establishes that table commits after the queued submit exports grid');
  eq(trace[exportAt].committedFormValues, defaults);
});
add('queued submit then unmount has no Blob object URL anchor or post-unmount export', async () => {
  const f = await mount(); await f.choose('dialect', 'csv');
  await act(() => { f.submit(); const previous = root; root = null; previous.unmount(); });
  eq(created.length, 0); eq(clicks.length, 0); eq(revoked, []); eq(document.querySelectorAll('[role="listbox"]').length, 0);
  await act(); eq(created.length, 0);
});
add('queued native reset followed by unmount leaves no deferred export or mounted popup', async () => {
  const f = await mount(); await f.choose('stage', 'deprecated'); await f.open('stage');
  await act(() => { f.form().reset(); const previous = root; root = null; previous.unmount(); });
  eq(created.length, 0); eq(clicks.length, 0); eq(revoked, []); eq(document.querySelectorAll('[role="listbox"]').length, 0);
});
add('replacement exports revoke the previous URL and unmount revokes the final owner URL once', async () => {
  const f = await mount();
  await act(() => f.submit()); await verifyExport(f); const first = created[0].url; eq(revoked, []);
  await f.choose('layout', 'list'); await act(() => f.submit()); await verifyExport(f); const second = created[1].url;
  eq(revoked, [first]); same(revocationOwners[0], window.URL);
  await cleanup(); eq(revoked, [first, second]); eq(new Set(revoked).size, 2); same(revocationOwners[1], window.URL);
  await act(); eq(revoked, [first, second]); eq(clicks.length, 2);
});
add('strict-mode effect replay still exports and cleans the final object URL exactly once', async () => {
  const f = await mount({ strict: true }); preview(f); await act(() => f.submit()); eq(created.length, 1); await verifyExport(f);
  const url = created[0].url; await cleanup(); eq(revoked, [url]);
});
add('invalid colors disable export remove inert preview and recover using current valid colors', async () => {
  const f = await mount();
  const sparse = ['#123456', , '#654321'];
  for (const invalid of [[], ['#FFF'], sparse, Array(25).fill('#123456'), ['</style><script>bad</script>']]) {
    await f.update({ colors: invalid }); eq(f.form().querySelector('button[type="submit"]').disabled, true); eq(f.frame(), null);
    eq(container.querySelector('[aria-label="Exact inert capsule HTML"]'), null); ok(/color|hex|sparse/i.test(f.status().textContent));
    await act(() => click(f.form().querySelector('button[type="submit"]'))); eq(created.length, 0);
    await act(() => f.submit()); eq(created.length, 0); eq(clicks.length, 0); ok(/color|hex|sparse/i.test(f.status().textContent));
  }
  const valid = ['#abcdef', '#000000', '#abcdef']; await f.update({ colors: valid });
  eq(f.form().querySelector('button[type="submit"]').disabled, false); preview(f, defaults, valid);
  await act(() => f.submit()); eq(created.length, 1); await verifyExport(f, defaults, valid);
});
add('queued submit observes invalidated current colors and cannot export the previous palette', async () => {
  const f = await mount();
  await act(() => { f.submit(); flushSync(() => f.render({ colors: ['invalid'] })); });
  eq(created.length, 0); eq(clicks.length, 0); eq(f.frame(), null); eq(f.form().querySelector('button[type="submit"]').disabled, true);
});
for (const count of [1, 24]) add(`${count} current colors are preserved in the preview and actual Blob`, async () => {
  const colors = Array.from({ length: count }, (_, index) => index % 2 ? '#aabbcc' : '#001122');
  const f = await mount({ colors }); preview(f, defaults, colors); await act(() => f.submit()); await verifyExport(f, defaults, colors);
});
for (const mode of ['unknown', 'duplicate', 'File']) add(`real internal FormData rejects an injected ${mode} field without downloading`, async () => {
  const f = await mount(), input = document.createElement('input');
  if (mode === 'unknown') { input.name = 'unexpected'; input.value = 'value'; }
  if (mode === 'duplicate') { input.name = 'layout'; input.value = 'grid'; }
  if (mode === 'File') { f.native('layout').removeAttribute('name'); input.type = 'file'; input.name = 'layout'; }
  f.form().append(input); await act(() => f.submit());
  eq(created.length, 0); eq(clicks.length, 0); eq(revoked, []); ok(/unknown|duplicate|nontext|field/i.test(f.status().textContent)); preview(f);
});
add('preexisting native submit preventDefault method is restored after deferred generation', async () => {
  const f = await mount(), event = new window.Event('submit', { bubbles: true, cancelable: true });
  let called = 0; const method = function() { called++; window.Event.prototype.preventDefault.call(this); };
  Object.defineProperty(event, 'preventDefault', { value: method, configurable: true, writable: false, enumerable: true });
  const descriptor = Object.getOwnPropertyDescriptor(event, 'preventDefault'); await act(() => f.form().dispatchEvent(event));
  eq(called, 1); eq(Object.getOwnPropertyDescriptor(event, 'preventDefault'), descriptor); eq(created.length, 1); await verifyExport(f);
});
add('unwrappable native submit event fails closed without leaking an export', async () => {
  const f = await mount(), event = new window.Event('submit', { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'preventDefault', { value: window.Event.prototype.preventDefault, configurable: false, writable: false });
  await act(() => f.form().dispatchEvent(event)); eq(event.defaultPrevented, true); eq(created.length, 0); eq(clicks.length, 0); preview(f);
});
add('native form target cancellation occurs before React and leaves later valid submission usable', async () => {
  const f = await mount(); let calls = 0; const cancel = event => { calls++; event.preventDefault(); };
  f.form().addEventListener('submit', cancel);
  await act(() => f.submit()); eq(calls, 1); eq(created.length, 0); eq(clicks.length, 0);
  f.form().removeEventListener('submit', cancel); await act(() => f.submit()); eq(created.length, 1); await verifyExport(f);
});

(async () => {
  const started = Date.now(), results = [];
  const built = await esbuild.build({
    absWorkingDir: SOURCE_ROOT,
    stdin: { contents: `export { CapsuleDesk } from ${JSON.stringify(exampleSource)}; export * from ${JSON.stringify(helperSource)};`, sourcefile: 'capsule-author-entry.tsx', resolveDir: SOURCE_ROOT, loader: 'tsx' },
    bundle: true, format: 'cjs', platform: 'node', target: 'node18', write: false, metafile: true, logLevel: 'silent', loader: { '.css': 'empty' },
    plugins: [{ name: 'actual-package-and-existing-react', setup(build) {
      build.onResolve({ filter: /^@studio\/wix-select-content$/ }, () => ({ path: ENTRY }));
      build.onResolve({ filter: /^@studio\/wix-select-content\/styles\.css$/ }, () => ({ path: cssSource }));
      build.onResolve({ filter: /^(react|react-dom)(\/.*)?$/ }, args => ({ path: require.resolve(args.path, { paths: [D] }), external: true }));
    } }],
  });
  const compiled = path.join(temp, 'example.cjs'); fs.writeFileSync(compiled, built.outputFiles[0].contents); api = require(compiled);
  const matched = cases.filter(test => !FILTER || test.name.includes(FILTER));
  for (const test of matched) {
    const before = assertions;
    try { await test.run(); results.push({ name: test.name, status: 'PASS', assertions: assertions - before }); }
    catch (error) { results.push({ name: test.name, status: 'FAIL', assertions: assertions - before, error: String(error.stack || error) }); console.error('FAIL ' + test.name + '\n' + error.message); }
    finally { await cleanup(); }
  }
  const hashesAfter = Object.fromEntries(watched.map(file => [file, sha(file)])), inputsUnchanged = JSON.stringify(hashesBefore) === JSON.stringify(hashesAfter);
  const failures = results.filter(test => test.status === 'FAIL');
  if (!matched.length) failures.push({ name: 'zero-filter-completeness', error: 'Zero matched cases; an empty filtered run is a failure.' });
  if (!inputsUnchanged) failures.push({ name: 'input-immutability', error: 'A protected input changed during this run.' });
  const bundleInputs = Object.keys(built.metafile.inputs).map(file => path.isAbsolute(file) ? file : path.resolve(SOURCE_ROOT, file));
  if (!bundleInputs.includes(ENTRY)) failures.push({ name: 'actual-package-entry', error: 'The selected actual package entry is absent from the runtime bundle.' });
  const report = { status: failures.length ? 'FAIL' : FILTER ? 'PARTIAL' : 'PASS', total: matched.length, eligible: cases.length, passed: results.filter(test => test.status === 'PASS').length, failed: failures.length, assertions, completeSuite: !FILTER && matched.length === cases.length, entry: ENTRY, packageRoot: PACKAGE_ROOT, sourceRoot: SOURCE_ROOT, hashesBefore, hashesAfter, inputsUnchanged, bundleInputs, evidenceTraces, zeroFilterGuard: true, runtime: { node: process.version, react: React.version, jsdom: require(path.join(D, 'jsdom/package.json')).version, esbuild: esbuild.version }, durationMs: Date.now() - started, realBrowser: false, jsdomInstances: 1, actualBlob: true, mockedObjectURLAndAnchorClick: true, cssLoader: 'empty', productionBuildPerformed: false, results, failures, scope: 'Actual CapsuleDesk React component bundled against the selected unchanged source/dist package entry, existing local React and one reused JSDOM. Explicitly dispatched untrusted events, actual Blob payload reads, mocked object-URL and anchor-download APIs. Exact inert iframe srcDoc is inspected without claiming iframe loading, browser default actions, a downloaded file, visual review, dependency-runtime comparison, independent review or formal acceptance.' };
  const output = JSON.stringify(report, null, 2) + '\n'; if (Buffer.byteLength(output) > 2 * 1024 * 1024) throw Error('Report exceeds 2 MiB.');
  fs.mkdirSync(path.dirname(REPORT), { recursive: true }); fs.writeFileSync(REPORT, output);
  console.log(JSON.stringify({ status: report.status, total: report.total, eligible: report.eligible, passed: report.passed, failed: report.failed, assertions, inputsUnchanged, entry: ENTRY, report: REPORT }));
  if (failures.length) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(async () => { await cleanup(); window.HTMLAnchorElement.prototype.click = originalAnchorClick; dom.window.close(); fs.rmSync(temp, { recursive: true, force: true }); });
