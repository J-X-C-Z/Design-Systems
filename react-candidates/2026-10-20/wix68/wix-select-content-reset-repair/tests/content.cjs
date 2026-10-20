'use strict';
/** Focused author tests for select-26..29. One JSDOM; ENTRY is loaded, never built. */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const D = process.env.LOCAL_DEPENDENCIES;
const Q = path.resolve(__dirname, '..');
const ENTRY = path.resolve(process.env.ENTRY || path.join(Q, 'dist/index.cjs'));
const REPORT = path.resolve(process.env.REPORT_PATH || path.join(Q, 'qa/content.json'));
const FILTER = process.env.CASE_FILTER || '';
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const inputs = [ENTRY, __filename, ...[26, 27, 28, 29].map(n => path.join(Q, `reference/select-${n}.tsx`))];
const hashesBefore = Object.fromEntries(inputs.map(file => [file, hash(file)]));
const sourceHashesAtStart = Object.fromEntries(['src/index.tsx', 'src/types.ts', 'src/styles.css'].map(file => [file, hash(path.join(Q, file))]));
const { JSDOM } = require(path.join(D, 'jsdom'));
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://author.test/', pretendToBeVisual: true });
for (const key of ['window', 'document', 'navigator', 'HTMLElement', 'HTMLButtonElement', 'HTMLSelectElement', 'HTMLFormElement', 'Element', 'Node', 'Event', 'MouseEvent', 'KeyboardEvent', 'FocusEvent', 'MutationObserver', 'FormData', 'getComputedStyle', 'requestAnimationFrame', 'cancelAnimationFrame']) {
  const bound = ['getComputedStyle', 'requestAnimationFrame', 'cancelAnimationFrame'].includes(key);
  Object.defineProperty(globalThis, key, { value: bound ? dom.window[key].bind(dom.window) : dom.window[key], configurable: true, writable: true });
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const React = require(path.join(D, 'react'));
const { createRoot } = require(path.join(D, 'react-dom/client'));
const { flushSync } = require(path.join(D, 'react-dom'));
const { renderToStaticMarkup } = require(path.join(D, 'react-dom/server'));
const api = require(ENTRY), h = React.createElement;
const tick = () => new Promise(resolve => setTimeout(resolve, 0));
const act = async fn => React.act(async () => { fn?.(); await tick(); await tick(); });
let assertions = 0, root = null;
const eq = (a, b, message) => { assertions++; assert.deepEqual(a, b, message); };
const same = (a, b, message) => { assertions++; assert.ok(a === b, message || 'DOM node identity differs'); };
const ok = (a, message) => { assertions++; assert.ok(a, message); };
const click = node => { ok(node, 'Click target exists'); node.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })); };
const key = (node, value) => { ok(node, 'Keyboard target exists'); node.dispatchEvent(new KeyboardEvent('keydown', { key: value, bubbles: true, cancelable: true })); };
const icon = name => ({ kind: 'icon', name });
const status = tone => ({ kind: 'status', tone });
const flat = items => items.flatMap(item => item.options || (item.separator ? [] : [item]));
const option = (value, label, decoration) => ({ value, label, ...(decoration ? { decoration } : {}) });
const group = (label, options) => ({ label, options });
// Literal oracle transcribed from the four reference originals and the source-contract audit.
const fixtures = {
  Select26: { id: 'select-26', label: 'API Permissions', placeholder: 'Identify scope', value: 'read-only', prefix: '', items: [group('Read Operations', [option('read-only', 'Metadata & Stats'), option('search', 'Search Indices')]), group('Write Access', [option('editor', 'Content Management'), option('admin', 'System Configuration')])] },
  Select27: { id: 'select-27', label: 'Portfolio Category', placeholder: 'Identify field', value: 'dev', prefix: '', items: [group('Primary Disciplines', [option('dev', 'Engineering', icon('code')), option('creative', 'Creative Arts', icon('camera')), option('data', 'Analytics', icon('database')), option('global', 'Network Ops', icon('globe'))])] },
  Select28: { id: 'select-28', label: 'Primary Framework', placeholder: 'Identify core tech', value: 'react', prefix: 'Project Stack:', items: [option('react', 'React.js Engine'), option('vue', 'Vue.js Ecosystem'), option('next', 'Next.js Framework'), option('astro', 'Astro Static Gen')] },
  Select29: { id: 'select-29', label: 'Lifecycle Stage', placeholder: 'Identify phase', value: 'active', prefix: '', items: [option('draft', 'Unpublished Draft', status('draft')), option('active', 'Live Deployment', status('active')), option('archived', 'Archived Record', status('archived')), option('deprecated', 'Legacy System', status('deprecated'))] },
};
async function cleanup() { if (root) { const previous = root; root = null; await act(() => previous.unmount()); } document.body.replaceChildren(); document.body.removeAttribute('tabindex'); }
async function fixture(name, initial = {}) {
  await cleanup(); document.body.tabIndex = -1;
  document.body.innerHTML = '<button id="outside">Outside</button><div id="root"></div><button id="after">After</button>';
  const container = document.getElementById('root'); root = createRoot(container);
  const f = { props: { ...initial }, events: [], container,
    trigger: () => container.querySelector('[role="combobox"]'),
    bridge: () => container.querySelector('select'),
    value: () => f.trigger().querySelector('.wix-sct-value'),
    prefix: () => f.trigger().querySelector('.wix-sct-prefix'),
    list: () => document.getElementById(f.trigger().getAttribute('aria-controls')),
    rows: () => [...(f.list()?.querySelectorAll('[role="option"]') || [])],
    row: value => f.rows().find(node => node.dataset.value === value),
    form: () => container.querySelector('form'),
    external: () => document.getElementById('outside'),
    clear: () => { f.events.length = 0; },
  };
  f.render = patch => {
    Object.assign(f.props, patch);
    const { onValueChange, onOpenChange, ...props } = f.props;
    root.render(h('form', { id: 'content-form' }, h(api[name], { id: 'subject', name: 'choice', ...props,
      onValueChange: (value, detail) => { f.events.push({ kind: 'value', value, reason: detail.reason }); onValueChange?.(value, detail, f); },
      onOpenChange: (value, detail) => { f.events.push({ kind: 'open', value, reason: detail.reason }); onOpenChange?.(value, detail, f); },
    })));
  };
  f.change = patch => act(() => f.render(patch));
  f.open = () => act(() => click(f.trigger()));
  f.choose = (value, selector = '.wix-sct-rich-text') => act(() => click(f.row(value)?.querySelector(selector)));
  await act(() => f.render({}));
  ok(f.trigger(), name + ' has a real trigger'); ok(f.bridge(), name + ' has a native bridge');
  f.clear(); return f;
}
function decoration(node) {
  const glyph = node.querySelector('svg[data-icon],svg[data-status]');
  return !glyph ? null : glyph.hasAttribute('data-icon') ? icon(glyph.getAttribute('data-icon')) : status(glyph.getAttribute('data-status'));
}
function content(node, expected) {
  eq(node.querySelector('.wix-sct-rich-text')?.textContent, expected.label, 'Exact human-readable option text');
  eq(decoration(node), expected.decoration || null, 'Current descriptor appears on this surface');
  eq(node.querySelectorAll('svg[data-icon],svg[data-status]').length, expected.decoration ? 1 : 0, 'One decoration, never stale or duplicated');
}
function bridge(f, expected, value) {
  eq([...f.bridge().options].slice(1).map(node => ({ value: node.value, label: node.textContent })), flat(expected).map(({ value, label }) => ({ value, label })), 'Native bridge retains plain option labels');
  eq(f.bridge().querySelectorAll('svg,span').length, 0, 'Native bridge contains no rich decoration or prefix');
  eq(f.bridge().value, value); eq([...new FormData(f.form())], [['choice', value]], 'Submitted data is the raw value');
}
function decorativeAccessibility(node) {
  for (const svg of node.querySelectorAll('svg')) {
    eq(svg.getAttribute('aria-hidden'), 'true', 'SVG is decorative'); eq(svg.getAttribute('focusable'), 'false', 'SVG is not focusable');
    ok(svg.tabIndex < 0, 'No SVG tab stop'); eq(svg.querySelectorAll('title,desc').length, 0, 'No duplicate accessible SVG name');
  }
}
function selected(f, expected) { content(f.value(), expected); eq(f.trigger().querySelectorAll('.wix-sct-check').length, 0, 'Menu check indicator never leaks into selected value'); }
const cases = [];
const add = (name, fn) => cases.push({ name, fn });
add('exports are exactly the four source IDs', async () => { eq([...api.wixSelectContentIds], Object.values(fixtures).map(f => f.id)); });
for (const [name, spec] of Object.entries(fixtures)) {
  add(name + ' exact source default, groups, labels and plain native bridge', async () => {
    const f = await fixture(name); const expected = flat(spec.items).find(item => item.value === spec.value);
    eq(f.container.querySelector('label').textContent, spec.label); eq(f.container.querySelector('label').htmlFor, f.trigger().id);
    eq(f.trigger().getAttribute('aria-expanded'), 'false'); eq(f.list(), null); selected(f, expected);
    eq(f.prefix()?.textContent || '', spec.prefix); bridge(f, spec.items, spec.value); eq(f.bridge().options[0].textContent, spec.placeholder);
    await f.open();
    eq(f.rows().map(row => ({ value: row.dataset.value, label: row.querySelector('.wix-sct-rich-text').textContent })), flat(spec.items).map(({ value, label }) => ({ value, label })));
    const groups = [...f.list().querySelectorAll('[role="group"]')];
    eq(groups.map(node => document.getElementById(node.getAttribute('aria-labelledby')).textContent), spec.items.filter(item => item.options).map(item => item.label));
    eq([...f.bridge().querySelectorAll('optgroup')].map(node => node.label), spec.items.filter(item => item.options).map(item => item.label));
    eq(groups.map(node => [...node.querySelectorAll('[role="option"]')].map(row => row.dataset.value)), spec.items.filter(item => item.options).map(item => item.options.map(item => item.value)));
    eq(f.list().querySelectorAll('[role="separator"]').length, 0);
    for (const item of flat(spec.items)) { content(f.row(item.value), item); eq(f.row(item.value).getAttribute('aria-disabled'), null); }
    eq(f.row(spec.value).getAttribute('aria-selected'), 'true'); decorativeAccessibility(document.body);
  });
  add(name + ' missing selected value shows exact placeholder without stale content', async () => {
    const f = await fixture(name, { value: 'missing' }); eq(f.value().textContent, spec.placeholder); eq(f.value().querySelectorAll('svg').length, 0);
    eq(f.trigger().getAttribute('data-placeholder'), 'true'); eq(f.prefix()?.textContent || '', spec.prefix); bridge(f, spec.items, ''); eq(f.events, []);
  });
  add(name + ' all nested labels and glyphs select current rich content', async () => {
    const f = await fixture(name); const expectedCalls = [];
    for (const item of flat(spec.items)) {
      await f.open(); const glyph = f.row(item.value).querySelector('svg[data-icon] > *,svg[data-status] > *');
      const previous = f.bridge().value; await act(() => click(glyph || f.row(item.value).querySelector('.wix-sct-rich-text')));
      if (previous !== item.value) expectedCalls.push(item.value);
      selected(f, item); bridge(f, spec.items, item.value); eq(f.list(), null); same(document.activeElement, f.trigger()); eq(f.prefix()?.textContent || '', spec.prefix);
    }
    eq(f.events.filter(event => event.kind === 'value').map(event => event.value), expectedCalls);
    eq(f.events.filter(event => event.kind === 'value').every(event => event.reason === 'pointer'), true);
  });
  add(name + ' native reset restores matching rich default without value callback', async () => {
    const f = await fixture(name); const last = flat(spec.items).at(-1); await f.open(); await f.choose(last.value); f.clear();
    await act(() => f.form().reset()); selected(f, flat(spec.items).find(item => item.value === spec.value)); bridge(f, spec.items, spec.value); eq(f.events, []); eq(f.list(), null);
    eq(f.prefix()?.textContent || '', spec.prefix);
  });
  add(name + ' custom same-value plain label does not inherit default decoration', async () => {
    const custom = [option(spec.value, 'Caller plain text')]; const f = await fixture(name, { options: custom });
    selected(f, custom[0]); bridge(f, custom, spec.value); await f.open(); content(f.row(spec.value), custom[0]); eq(decoration(f.row(spec.value)), null);
  });
}
add('Select27 has four genuinely distinct monochrome icon geometries', async () => {
  const f = await fixture('Select27'); await f.open(); const geometries = [];
  for (const item of flat(fixtures.Select27.items)) {
    const svg = f.row(item.value).querySelector('svg[data-icon]'); eq(svg.getAttribute('width'), '16'); eq(svg.getAttribute('height'), '16'); eq(svg.getAttribute('stroke-width'), '1.5'); eq(svg.getAttribute('stroke'), 'currentColor'); eq(svg.getAttribute('fill'), 'none'); geometries.push(svg.innerHTML);
  }
  eq(new Set(geometries).size, 4); eq(f.value().querySelector('svg[data-icon]').innerHTML, f.row('dev').querySelector('svg[data-icon]').innerHTML);
});
add('Select29 has four distinct status tokens with the same small filled circle shape', async () => {
  const f = await fixture('Select29'); await f.open(); const tokens = [], shapes = [];
  for (const item of fixtures.Select29.items) { const svg = f.row(item.value).querySelector('svg[data-status]'); tokens.push(svg.dataset.status); shapes.push(svg.innerHTML); eq(svg.getAttribute('width'), '8'); eq(svg.getAttribute('height'), '8'); eq(svg.getAttribute('fill'), 'currentColor'); ok(svg.querySelector('circle')); }
  eq(tokens, ['draft', 'active', 'archived', 'deprecated']); eq(new Set(shapes).size, 1); eq(f.value().querySelector('svg[data-status]').dataset.status, 'active');
});
add('Select28 prefix stays independent through placeholder, selection, replacement and removal', async () => {
  const f = await fixture('Select28', { value: '' }); eq(f.value().textContent, fixtures.Select28.placeholder); eq(f.prefix().textContent, 'Project Stack:');
  for (const item of fixtures.Select28.items) { await f.change({ value: item.value }); selected(f, item); eq(f.trigger().querySelectorAll('.wix-sct-prefix').length, 1); eq(f.prefix().textContent, 'Project Stack:'); bridge(f, fixtures.Select28.items, item.value); }
  await act(() => f.external().focus()); f.clear();
  await f.change({ prefix: 'Runtime stack:', value: 'missing' }); eq(f.value().textContent, fixtures.Select28.placeholder); eq(f.prefix().textContent, 'Runtime stack:'); same(document.activeElement, f.external()); eq(f.events, []);
  await f.change({ prefix: '' }); eq(f.prefix(), null); eq(f.events, []); same(document.activeElement, f.external());
});
add('Select27 typeahead uses plain visible labels rather than icon names', async () => {
  const f = await fixture('Select27'); await f.open(); await act(() => key(document.activeElement, 'a')); same(document.activeElement, f.row('data')); await act(() => key(document.activeElement, 'Enter')); selected(f, flat(fixtures.Select27.items)[2]); eq(f.bridge().value, 'data');
});
add('Select28 prefix is absent from the typeahead corpus', async () => {
  const f = await fixture('Select28'); await f.open(); await act(() => key(document.activeElement, 'p')); same(document.activeElement, f.row('react'));
  await act(() => key(document.activeElement, 'Escape')); await f.open(); await act(() => key(document.activeElement, 'a')); same(document.activeElement, f.row('astro')); await act(() => key(document.activeElement, 'Enter')); eq(f.bridge().value, 'astro'); eq(f.prefix().textContent, 'Project Stack:');
});
add('same-value label, icon, status and prefix replacements refresh both surfaces without resets or proposals', async () => {
  let items = [option('a', 'Alpha', icon('code')), option('b', 'Beta', icon('camera'))]; const f = await fixture('Select27', { options: items, defaultValue: 'a', prefix: 'First:' });
  await f.open(); await f.choose('b'); await f.open(); const focused = f.row('b'); f.clear();
  for (const replacement of [option('b', 'Beta camera revised', icon('globe')), option('b', 'Beta archived', status('archived')), option('b', 'Beta plain')]) {
    items = [items[0], replacement]; await f.change({ options: items, prefix: 'Current:' });
    selected(f, replacement); content(f.row('b'), replacement); bridge(f, items, 'b'); eq(f.prefix().textContent, 'Current:'); same(document.activeElement, focused); same(f.row('b'), focused); eq(f.events, []); ok(f.list());
  }
  await act(() => key(document.activeElement, 'Escape')); await act(() => f.external().focus()); f.clear();
  await f.change({ options: [items[0], option('b', 'External-focus label', icon('database'))], prefix: 'External:' });
  same(document.activeElement, f.external()); eq(f.bridge().value, 'b'); selected(f, option('b', 'External-focus label', icon('database'))); eq(f.events, []);
});
add('metadata-only update respects explicit external focus while controlled popup stays open', async () => {
  const a = option('a', 'Alpha', icon('code')), b = option('b', 'Beta', status('active'));
  const f = await fixture('Select28', { options: [a, b], value: 'b', open: true, prefix: 'Before:' });
  await act(() => f.external().focus()); eq(f.events, [{ kind: 'open', value: false, reason: 'focus-out' }]); f.clear();
  const revised = option('b', 'Externally revised', icon('database'));
  await f.change({ options: [a, revised], prefix: 'After:' }); selected(f, revised); content(f.row('b'), revised); bridge(f, [a, revised], 'b');
  eq(f.prefix().textContent, 'After:'); ok(f.list()); same(document.activeElement, f.external()); eq(f.events, []);
});
add('selected removal and reintroduction resolve from latest options while retaining uncontrolled value', async () => {
  const a = option('a', 'Alpha', icon('code')), b = option('b', 'Beta', status('active'));
  const f = await fixture('Select29', { options: [a, b], defaultValue: 'b', defaultOpen: true }); same(document.activeElement, f.row('b')); f.clear();
  await f.change({ options: [a] }); eq(f.value().textContent, fixtures.Select29.placeholder); eq(decoration(f.value()), null); bridge(f, [a], ''); same(document.activeElement, f.row('a')); eq(f.events, []);
  const restored = option('b', 'Beta returned', status('deprecated')); await f.change({ options: [a, restored] }); selected(f, restored); bridge(f, [a, restored], 'b'); same(document.activeElement, f.row('a')); eq(f.events, []);
  await f.change({ options: [] }); eq(f.value().textContent, fixtures.Select29.placeholder); same(document.activeElement, f.list()); eq(f.rows().length, 0); eq(f.events, []);
});
add('dynamic regroup preserves focused identity and current rich metadata without callbacks', async () => {
  const a = option('a', 'Alpha', icon('code')), b = option('b', 'Beta', status('active')), c = option('c', 'Gamma', icon('globe'));
  const f = await fixture('Select26', { options: [group('First', [a, b]), group('Second', [c])], defaultValue: 'b', defaultOpen: true }); const old = f.row('b');
  const revised = option('b', 'Beta relocated', status('archived')); await f.change({ options: [group('First', [a]), group('Second', [revised, c])] });
  ok(!old.isConnected); ok(f.row('b') !== old); same(document.activeElement, f.row('b')); selected(f, revised); content(f.row('b'), revised); eq(f.events, []);
});
add('regroup respects explicit external focus before and after synchronous owner update', async () => {
  const a = option('a', 'Alpha', icon('code')), b = option('b', 'Beta', status('active'));
  const f = await fixture('Select27', { options: [group('First', [a, b])], value: 'b', open: true });
  await act(() => { f.external().focus(); flushSync(() => f.render({ options: [a, group('Moved', [b])] })); });
  same(document.activeElement, f.external()); selected(f, b); eq(f.events, [{ kind: 'open', value: false, reason: 'focus-out' }]);
  await act(() => f.row('b').focus()); f.clear();
  await act(() => { flushSync(() => f.render({ options: [group('Back', [a, b])] })); f.external().focus(); });
  same(document.activeElement, f.external()); eq(f.events, [{ kind: 'open', value: false, reason: 'focus-out' }]); f.clear();
  await f.change({ options: [a, b] }); same(document.activeElement, f.external()); eq(f.events, []);
});
add('controlled canceled selection can update selected metadata without accepting value or closing', async () => {
  const a = option('a', 'Alpha', icon('code')), b = option('b', 'Beta', status('active')); let revised;
  const f = await fixture('Select27', { options: [a, b], value: 'a', open: true, onValueChange: (_value, detail, current) => { detail.preventDefault(); revised = option('a', 'Owner revised alpha', status('archived')); current.render({ options: [revised, b], prefix: 'Owner:' }); } });
  await act(() => f.row('b').focus()); await f.choose('b', 'svg circle'); selected(f, revised); content(f.row('a'), revised); eq(f.bridge().value, 'a'); ok(f.list()); same(document.activeElement, f.row('b')); eq(f.prefix().textContent, 'Owner:'); eq(f.events, [{ kind: 'value', value: 'b', reason: 'pointer' }]);
});
add('controlled rejected proposal refreshes selected owner metadata while preserving both owners', async () => {
  const a = option('a', 'Alpha', icon('code')), b = option('b', 'Beta', icon('camera')); let revised;
  const f = await fixture('Select27', { options: [a, b], value: 'a', open: true, onValueChange: (_value, _detail, current) => { revised = option('a', 'Retained owner', icon('database')); current.render({ options: [revised, b] }); } });
  await f.choose('b', 'svg circle'); selected(f, revised); eq(f.bridge().value, 'a'); ok(f.list()); eq(f.events, [{ kind: 'value', value: 'b', reason: 'pointer' }, { kind: 'open', value: false, reason: 'selection' }]);
});
add('controlled acceptance uses latest replacement metadata atomically and closes once', async () => {
  const a = option('a', 'Alpha', icon('code')), b = option('b', 'Beta', icon('camera')); let accepted;
  const f = await fixture('Select27', { options: [a, b], value: 'a', open: true,
    onValueChange: (value, _detail, current) => { accepted = option('b', 'Accepted latest label', status('active')); current.render({ value, options: [a, accepted] }); },
    onOpenChange: (open, _detail, current) => current.render({ open }),
  });
  await f.choose('b'); selected(f, accepted); bridge(f, [a, accepted], 'b'); eq(f.list(), null); same(document.activeElement, f.trigger()); eq(f.events, [{ kind: 'value', value: 'b', reason: 'pointer' }, { kind: 'open', value: false, reason: 'selection' }]);
});
add('canceled proposal with metadata regroup never steals explicit external focus', async () => {
  const a = option('a', 'Alpha', icon('code')), b = option('b', 'Beta', status('active')); let revised;
  const f = await fixture('Select29', { options: [group('Initial', [a, b])], value: 'a', open: true, onValueChange: (_value, detail, current) => { detail.preventDefault(); revised = option('a', 'Owner updated', icon('globe')); current.render({ options: [b, group('Moved', [revised])] }); current.external().focus(); } });
  await f.choose('b', 'svg circle'); selected(f, revised); same(document.activeElement, f.external()); eq(f.bridge().value, 'a'); ok(f.list()); eq(f.events, [{ kind: 'value', value: 'b', reason: 'pointer' }, { kind: 'open', value: false, reason: 'focus-out' }]);
});
add('strict runtime validation rejects malformed and hybrid decoration descriptors', async () => {
  const malformed = [null, false, 7, 'code', [], {}, { kind: 'bogus', name: 'code' }, { kind: 'icon' }, { kind: 'icon', name: 'unknown' }, { kind: 'icon', name: 7 }, { kind: 'icon', name: 'code', tone: 'active' }, { kind: 'icon', name: 'code', tone: null }, { kind: 'status' }, { kind: 'status', tone: 'unknown' }, { kind: 'status', tone: 7 }, { kind: 'status', tone: 'active', name: 'code' }, { kind: 'status', tone: 'active', name: null }];
  for (const descriptor of malformed) { assertions++; assert.throws(() => renderToStaticMarkup(h(api.Select27, { options: [{ value: 'x', label: 'X', decoration: descriptor }] })), /decoration|descriptor|hybrid/i, JSON.stringify(descriptor)); }
  for (const item of [{ label: 'Forbidden group', options: [option('x', 'X')], decoration: icon('code') }, { label: 'Forbidden group', options: [option('x', 'X')], decoration: status('active') }, { separator: true, decoration: icon('code') }]) {
    assertions++; assert.throws(() => renderToStaticMarkup(h(api.Select26, { options: [item] })), /group|separator|decoration/i);
  }
  for (const prefix of [null, 1, {}, h('span', null, 'Prefix')]) { assertions++; assert.throws(() => renderToStaticMarkup(h(api.Select28, { prefix })), /prefix.*string/i); }
  for (const descriptor of [icon('code'), icon('camera'), icon('database'), icon('globe'), status('draft'), status('active'), status('archived'), status('deprecated')]) { assertions++; assert.doesNotThrow(() => renderToStaticMarkup(h(api.Select27, { options: [option('x', 'X', descriptor)], value: 'x' }))); }
});
add('two live mounts and remount keep current content and prefix independent', async () => {
  await cleanup(); document.body.innerHTML = '<div id="root"></div>'; root = createRoot(document.getElementById('root'));
  const first = option('same', 'First title', icon('code')), second = option('same', 'Second title', status('deprecated'));
  const render = (show = true) => root.render(h('form', null, show ? h(api.Select27, { key: 'one', id: 'one', name: 'one', value: 'same', options: [first], prefix: 'One:' }) : null, h(api.Select29, { key: 'two', id: 'two', name: 'two', value: 'same', options: [second], prefix: 'Two:' })));
  await act(() => render()); const one = document.getElementById('one'), two = document.getElementById('two'); content(one, first); content(two, second); eq([...new FormData(document.querySelector('form'))], [['one', 'same'], ['two', 'same']]);
  await act(() => render(false)); content(document.getElementById('two'), second); await act(() => render()); content(document.getElementById('one'), first); content(document.getElementById('two'), second); eq(document.getElementById('one').querySelector('.wix-sct-prefix').textContent, 'One:'); eq(document.getElementById('two').querySelector('.wix-sct-prefix').textContent, 'Two:');
});
(async () => {
  const start = Date.now(), results = [], selectedCases = cases.filter(test => !FILTER || test.name.includes(FILTER));
  for (const test of selectedCases) {
    const before = assertions;
    try { await test.fn(); results.push({ name: test.name, status: 'PASS', assertions: assertions - before }); }
    catch (error) { results.push({ name: test.name, status: 'FAIL', assertions: assertions - before, error: String(error.stack || error) }); console.error('FAIL ' + test.name + '\n' + error.message); }
  }
  await cleanup(); dom.window.close();
  const hashesAfter = Object.fromEntries(inputs.map(file => [file, hash(file)]));
  const failures = results.filter(test => test.status === 'FAIL');
  const inputsUnchanged = JSON.stringify(hashesBefore) === JSON.stringify(hashesAfter);
  if (!inputsUnchanged) failures.push({ name: 'Input immutability', error: 'Loaded entry, tests or reference original changed during this run.' });
  if (!selectedCases.length) failures.push({ name: 'Completeness', error: 'No matched cases.' });
  const report = { status: failures.length ? 'FAIL' : FILTER ? 'PARTIAL' : 'PASS', cases: selectedCases.length, eligible: cases.length, passed: results.filter(test => test.status === 'PASS').length, failed: failures.length, assertions, completeSuite: !FILTER && selectedCases.length === cases.length, entry: ENTRY, runtime: { node: process.version, react: React.version, jsdom: require(path.join(D, 'jsdom/package.json')).version }, durationMs: Date.now() - start, realBrowser: false, rebuildPerformed: false, inputsUnchanged, hashesBefore, hashesAfter, sourceHashesAtStart, results, failures, scope: 'Focused author DOM tests only; one reused JSDOM document, untrusted dispatched events, no real-browser defaults, computed layout, visual/color review, dependency-runtime comparison, independent-review or formal-acceptance claim. Exact labels/groups/defaults come from the four reference originals; custom descriptors/prefix/control/reset/focus behavior are adapter APIs.' };
  const output = JSON.stringify(report, null, 2) + '\n';
  if (Buffer.byteLength(output) > 2 * 1024 * 1024) throw new Error('Report exceeds 2 MiB cap.');
  fs.mkdirSync(path.dirname(REPORT), { recursive: true }); fs.writeFileSync(REPORT, output);
  console.log(JSON.stringify({ status: report.status, cases: report.cases, eligible: report.eligible, passed: report.passed, failed: report.failed, assertions, inputsUnchanged, entry: ENTRY, report: REPORT }));
  if (failures.length) process.exitCode = 1;
})().catch(async error => { console.error(error); try { await cleanup(); } catch {} dom.window.close(); process.exitCode = 1; });
