'use strict';
/** Author-only example verification. No package install, consumer copy or emitted bundle. */
const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const assert = require('node:assert/strict'), Module = require('node:module');
const D = process.env.LOCAL_DEPENDENCIES;
if (!D) throw Error('Set LOCAL_DEPENDENCIES to the existing toolchain node_modules; no installation.');
const Q = path.resolve(process.env.SOURCE_ROOT || path.join(__dirname, '..'));
const ENTRY = path.resolve(process.env.ENTRY || path.join(Q, 'dist/index.cjs'));
const FILTER = process.env.CASE_FILTER || '';
const SUITE = process.env.SUITE || 'all';
if (!['all', 'helper', 'react'].includes(SUITE)) throw Error('SUITE must be all, helper or react.');
const REPORT = path.resolve(process.env.REPORT_PATH || path.join(Q, 'qa/index-example.json'));
const { JSDOM } = require(path.join(D, 'jsdom'));
// A single browsing context is reused, and generated documents are inert DOMParser trees.
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'https://local.test/', pretendToBeVisual: true });
for (const key of ['window', 'document', 'navigator', 'HTMLElement', 'HTMLButtonElement', 'HTMLSelectElement', 'HTMLFormElement', 'Element', 'Node', 'Event', 'MouseEvent', 'KeyboardEvent', 'FocusEvent', 'MutationObserver', 'FormData', 'getComputedStyle', 'requestAnimationFrame', 'cancelAnimationFrame']) {
  const value = typeof dom.window[key] === 'function' && ['getComputedStyle', 'requestAnimationFrame', 'cancelAnimationFrame'].includes(key) ? dom.window[key].bind(dom.window) : dom.window[key];
  Object.defineProperty(globalThis, key, { value, writable: true, configurable: true });
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const React = require(path.join(D, 'react')), { createRoot } = require(path.join(D, 'react-dom/client'));
const h = React.createElement, parser = new window.DOMParser();
let assertions = 0, root = null, container = null, builtCombinations = 0;
const cases = [], filenames = new Set(), htmlOutputs = new Set();
const eq = (a, b, message) => { assertions++; if (a instanceof Node || b instanceof Node) assert.equal(a === b, true, message); else assert.deepEqual(a, b, message); };
const ok = (value, message) => { assertions++; assert.ok(value, message); };
const throws = (fn, message) => { assertions++; assert.throws(fn, TypeError, message); };
const register = (name, fn) => cases.push({ name, fn });
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const watched = [ENTRY, __filename, Q + '/examples/index-sheet.ts', Q + '/examples/IndexDesk.tsx', Q + '/src/index.tsx', Q + '/src/types.ts', Q + '/src/index.d.ts'];
const snapshot = () => Object.fromEntries(watched.map(file => [file, sha(file)]));
const before = snapshot();
const tick = () => new Promise(resolve => setTimeout(resolve, 0));
async function act(fn) { await React.act(async () => { if (fn) await fn(); await tick(); await tick(); }); }
async function unmount() { if (root) { await act(() => root.unmount()); root = null; } }
async function mount(element) {
  await unmount(); document.body.innerHTML = '<button id="before">Before</button><div id="root"></div><button id="after">After</button>';
  container = document.getElementById('root'); root = createRoot(container); await act(() => root.render(element));
}
const click = node => { ok(node, 'click target exists'); node.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })); };
const key = (node, value) => node.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: value }));
const native = name => container.querySelector(`select[name="${name}"]`);
const trigger = name => native(name).closest('.wix-select-structure').querySelector('button[role="combobox"]');
const list = () => document.querySelector('[role="listbox"]');
const option = value => [...document.querySelectorAll('[role="option"]')].find(node => node.dataset.value === value);
const form = () => container.querySelector('form');
const data = () => [...new FormData(form()).entries()];
const submit = () => form().dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
const status = () => container.querySelector('[role="status"]').textContent;
async function choose(name, value, keyboard = false) {
  await act(() => click(trigger(name)));
  ok(list(), name + ' opens a real listbox'); ok(!container.contains(list()), name + ' is portaled outside the example mount');
  eq(trigger(name).getAttribute('aria-controls'), list().id);
  ok(option(value), name + ' target value is present');
  if (keyboard) { await act(() => { option(value).focus(); key(option(value), 'Enter'); }); }
  else await act(() => click(option(value)));
  eq(native(name).value, value); eq(list(), null); eq(document.activeElement, trigger(name));
}
function parsedSafety(html, expectedCount) {
  const doc = parser.parseFromString(html, 'text/html');
  eq(doc.doctype.name, 'html'); eq(doc.documentElement.lang, 'en');
  eq(doc.querySelector('meta[charset]').getAttribute('charset').toLowerCase(), 'utf-8');
  const csp = doc.querySelector('meta[http-equiv="Content-Security-Policy"]');
  eq(csp.getAttribute('content'), "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'");
  eq(doc.querySelectorAll('script,iframe,frame,object,embed,img,video,audio,source,track,link,base,form,svg,math').length, 0);
  eq(doc.querySelectorAll('meta[http-equiv="refresh" i]').length, 0);
  for (const element of doc.querySelectorAll('*')) for (const attribute of element.attributes) {
    ok(!/^on/i.test(attribute.name), 'no inline event handler');
    ok(!/^(src|srcset|href|action|formaction|poster|data)$/i.test(attribute.name), 'no external-resource or navigation attributes');
  }
  const style = doc.querySelector('style').textContent;
  ok(!/url\s*\(|@import|@font-face/i.test(style), 'no CSS network resources');
  eq(doc.querySelectorAll('ol.index > li.swatch').length, expectedCount);
  eq(doc.querySelectorAll('main').length, 1);
  eq(doc.querySelector('main').getAttribute('aria-labelledby'), doc.querySelector('h1').id);
  return doc;
}
const defaultSettings = { columns: '3', labels: 'hex', heading: 'studio', density: 'comfortable' };
const sourceColors = ['#000000', '#ffffff', '#ff0000', '#00Ff00', '#0000ff'];
const expectedColors = ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF'];
const expectedLabels = {
  hex: expectedColors,
  rgb: ['rgb(0, 0, 0)', 'rgb(255, 255, 255)', 'rgb(255, 0, 0)', 'rgb(0, 255, 0)', 'rgb(0, 0, 255)'],
  hsl: ['hsl(0 0% 0%)', 'hsl(0 0% 100%)', 'hsl(0 100% 50%)', 'hsl(120 100% 50%)', 'hsl(240 100% 50%)'],
  ordinal: ['Swatch 01', 'Swatch 02', 'Swatch 03', 'Swatch 04', 'Swatch 05']
};
const titles = { studio: 'Studio color index', archive: 'Archive color index', proof: 'Print proof index', handoff: 'Design handoff index' };
const metrics = { airy: [24, 24, 100], comfortable: [16, 18, 76], compact: [10, 12, 54], micro: [6, 8, 36] };
function makeForm(settings = defaultSettings) { const result = new FormData(); for (const [key, value] of Object.entries(settings)) result.append(key, value); return result; }
async function compileInMemory() {
  const result = await require(path.join(D, 'esbuild')).build({
    stdin: { contents: `export * from ${JSON.stringify(Q + '/examples/index-sheet.ts')};` + (SUITE === 'helper' ? '' : ` export { IndexDesk } from ${JSON.stringify(Q + '/examples/IndexDesk.tsx')};`), sourcefile: 'index-example-test-entry.ts', resolveDir: Q, loader: 'ts' },
    bundle: true, write: false, platform: 'node', format: 'cjs', target: 'es2020', logLevel: 'silent',
    plugins: [{ name: 'existing-toolchain-and-candidate', setup(build) {
      build.onResolve({ filter: /^@studio\/wix-select-structure$/ }, () => ({ path: ENTRY, external: true }));
      build.onResolve({ filter: /^@studio\/wix-select-structure\/styles\.css$/ }, args => ({ path: args.path, namespace: 'test-css' }));
      build.onLoad({ filter: /.*/, namespace: 'test-css' }, () => ({ contents: '', loader: 'js' }));
      build.onResolve({ filter: /^react(?:\/.*)?$/ }, args => ({ path: require.resolve(args.path, { paths: [D] }), external: true }));
    } }]
  });
  eq(result.outputFiles.length, 1, 'one in-memory JS bundle');
  const instance = new Module(path.join(Q, '.index-example-in-memory.cjs'), module);
  instance.filename = path.join(Q, '.index-example-in-memory.cjs'); instance.paths = Module._nodeModulePaths(Q);
  instance._compile(result.outputFiles[0].text, instance.filename);
  return instance.exports;
}
function captureDownloads() {
  const records = { blobs: [], clicks: [], revoked: [], events: [] };
  const create = window.URL.createObjectURL, revoke = window.URL.revokeObjectURL, anchorClick = window.HTMLAnchorElement.prototype.click;
  window.URL.createObjectURL = blob => { const url = 'blob:https://local.test/index-' + (records.blobs.length + 1); records.blobs.push({ blob, url }); records.events.push(['create', url]); return url; };
  window.URL.revokeObjectURL = url => { records.revoked.push(url); records.events.push(['revoke', url]); };
  window.HTMLAnchorElement.prototype.click = function () { records.clicks.push({ href: this.href, filename: this.download, attached: this.isConnected, owner: this.ownerDocument }); records.events.push(['click', this.href]); };
  records.restore = () => { window.URL.createObjectURL = create; window.URL.revokeObjectURL = revoke; window.HTMLAnchorElement.prototype.click = anchorClick; };
  return records;
}
const blobText = blob => new Promise((resolve, reject) => { const reader = new window.FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(reader.error); reader.readAsText(blob); });
(async () => {
  const api = await compileInMemory();
  const { buildIndexSheet, indexSheetFromForm, IndexDesk } = api;
  register('pure exported domains and runtime guards are exact', () => {
    for (const [values, guard, expected] of [[api.columnValues, api.isIndexColumns, ['1', '2', '3', '4', '5']], [api.labelValues, api.isIndexLabels, ['hex', 'rgb', 'hsl', 'ordinal']], [api.headingValues, api.isIndexHeading, ['studio', 'archive', 'proof', 'handoff']], [api.densityValues, api.isIndexDensity, ['airy', 'comfortable', 'compact', 'micro']]]) {
      eq(values, expected); for (const value of expected) eq(guard(value), true);
      for (const value of [null, undefined, '', 'unknown', 1, true, {}, [], new String(expected[0]), expected[0] + ' ', expected[0].toUpperCase()]) if (!expected.includes(value)) eq(guard(value), false);
    }
  });
  for (const columns of ['1', '2', '3', '4', '5']) for (const labels of ['hex', 'rgb', 'hsl', 'ordinal']) for (const heading of ['studio', 'archive', 'proof', 'handoff']) for (const density of ['airy', 'comfortable', 'compact', 'micro']) {
    register(`matrix ${columns}/${labels}/${heading}/${density}`, () => {
      const settings = { columns, labels, heading, density }, sheet = buildIndexSheet(settings, sourceColors);
      const [gap, padding, height] = metrics[density], doc = parsedSafety(sheet.html, sourceColors.length);
      eq(sheet.settings, settings); eq(sheet.colors, expectedColors); eq(sheet.labels, expectedLabels[labels]);
      eq(sheet.filename, `wix-index-${heading}-${columns}-${labels}-${density}.html`);
      ok(/^wix-index-[a-z]+-[1-5]-[a-z]+-[a-z]+\.html$/.test(sheet.filename));
      eq(sheet.mime, 'text/html;charset=utf-8'); eq(sheet.title, titles[heading]);
      eq(doc.title, sheet.title); eq(doc.querySelector('h1').textContent, sheet.title);
      eq([sheet.gap, sheet.padding, sheet.swatchHeight], [gap, padding, height]);
      const style = doc.querySelector('style').textContent;
      for (const token of [`--columns:${columns}`, `--gap:${gap}px`, `--padding:${padding}px`, `--swatch-height:${height}px`, 'grid-template-columns:repeat(var(--columns),minmax(0,1fr))', 'gap:var(--gap)', 'padding:var(--padding)', 'height:var(--swatch-height)']) ok(style.includes(token), 'setting used in actual generated CSS: ' + token);
      eq(doc.querySelector('main > p').textContent, `5 local swatches · ${columns} columns · ${labels} labels · ${density} density`);
      eq([...doc.querySelectorAll('li code')].map(node => node.textContent), expectedLabels[labels]);
      eq([...doc.querySelectorAll('li .color')].map(node => node.getAttribute('style')), expectedColors.map(color => 'background-color:' + color));
      eq([...doc.querySelectorAll('li .color')].map(node => [node.getAttribute('role'), node.getAttribute('aria-label')]), expectedColors.map(color => ['img', 'Color ' + color]));
      eq([...doc.querySelectorAll('li small')].map(node => node.textContent), expectedColors.map((color, index) => `${String(index + 1).padStart(2, '0')} · ${color}`));
      eq(indexSheetFromForm(makeForm(settings), sourceColors), sheet, 'FormData path matches pure helper');
      for (const output of [sheet, sheet.settings, sheet.colors, sheet.labels]) ok(Object.isFrozen(output), 'output is frozen');
      filenames.add(sheet.filename); htmlOutputs.add(sheet.html); builtCombinations++;
    });
  }
  register('pure all 320 settings produce distinct filenames and HTML', () => {
    if (FILTER) return;
    eq(builtCombinations, 320); eq(filenames.size, 320); eq(htmlOutputs.size, 320);
  });
  register('pure one-setting changes alter the intended HTML feature', () => {
    const base = buildIndexSheet(defaultSettings, sourceColors);
    for (const [field, value] of [['columns', '5'], ['labels', 'rgb'], ['heading', 'proof'], ['density', 'micro']]) {
      const changed = buildIndexSheet({ ...defaultSettings, [field]: value }, sourceColors);
      ok(changed.html !== base.html); ok(changed.filename !== base.filename);
      eq(changed.colors, base.colors);
      if (field !== 'labels') eq(changed.labels, base.labels);
      if (field !== 'heading') eq(changed.title, base.title);
      if (field !== 'density') eq([changed.gap, changed.padding, changed.swatchHeight], [base.gap, base.padding, base.swatchHeight]);
    }
  });
  for (const field of ['columns', 'labels', 'heading', 'density']) register('pure rejects invalid ' + field, () => {
    for (const value of [undefined, null, '', 3, false, {}, [], '<script>alert(1)</script>', 'rgba(0,0,0,0)', 'toString', '__proto__']) throws(() => buildIndexSheet({ ...defaultSettings, [field]: value }, sourceColors));
    const missing = { ...defaultSettings }; delete missing[field]; throws(() => buildIndexSheet(missing, sourceColors));
  });
  register('pure rejects absent settings', () => { for (const value of [null, undefined, '', [], 3]) throws(() => buildIndexSheet(value, sourceColors)); });
  const invalidSources = [
    ['empty', []], ['too many', Array(25).fill('#123456')], ['not an array', '#123456'], ['null', null], ['undefined', undefined],
    ['three digits', ['#abc']], ['eight digits', ['#12345678']], ['no hash', ['123456']], ['non hex', ['#GGGGGG']],
    ['leading whitespace', [' #123456']], ['trailing whitespace', ['#123456 ']], ['trailing newline', ['#123456\n']],
    ['trailing carriage return', ['#123456\r']], ['HTML injection', ['#123456"><script>alert(1)</script>']],
    ['CSS injection', ['#123456; background:url(https://example.test/x)']], ['object color', [new String('#123456')]],
    ['undefined color', [undefined]], ['number color', [123456]], ['null color', [null]], ['invalid middle color', ['#000000', 'red', '#FFFFFF']],
    ['fully sparse array', Array(2)], ['sparse middle color', ['#000000', , '#FFFFFF']]
  ];
  for (const [name, colors] of invalidSources) register('source rejects ' + name, () => throws(() => buildIndexSheet(defaultSettings, colors)));
  register('source accepts exactly 1 and 24 colors and normalizes case', () => {
    for (const count of [1, 24]) {
      const colors = Array.from({ length: count }, (_, index) => '#' + (index * 123456).toString(16).padStart(6, '0'));
      const sheet = buildIndexSheet({ ...defaultSettings, labels: 'ordinal' }, colors);
      eq(sheet.colors, colors.map(color => color.toUpperCase())); eq(sheet.labels.at(-1), 'Swatch ' + String(count).padStart(2, '0')); parsedSafety(sheet.html, count);
    }
  });
  register('pure HSL wrap-around achromatic and endpoint boundaries', () => {
    const pairs = [['#000000', 'hsl(0 0% 0%)'], ['#FFFFFF', 'hsl(0 0% 100%)'], ['#808080', 'hsl(0 0% 50%)'], ['#010101', 'hsl(0 0% 0%)'], ['#FEFEFE', 'hsl(0 0% 100%)'], ['#FF0000', 'hsl(0 100% 50%)'], ['#FFFF00', 'hsl(60 100% 50%)'], ['#00FF00', 'hsl(120 100% 50%)'], ['#00FFFF', 'hsl(180 100% 50%)'], ['#0000FF', 'hsl(240 100% 50%)'], ['#FF00FF', 'hsl(300 100% 50%)'], ['#FF0001', 'hsl(0 100% 50%)'], ['#FF0002', 'hsl(0 100% 50%)'], ['#FF0003', 'hsl(359 100% 50%)'], ['#010000', 'hsl(0 100% 0%)'], ['#FFFEFE', 'hsl(0 100% 100%)']];
    const sheet = buildIndexSheet({ ...defaultSettings, labels: 'hsl' }, pairs.map(pair => pair[0]));
    eq(sheet.labels, pairs.map(pair => pair[1]));
    for (const label of sheet.labels) { ok(!/NaN|Infinity/.test(label)); const hue = Number(label.match(/^hsl\((\d+)/)[1]); ok(hue >= 0 && hue < 360); }
  });
  register('pure output snapshots are deeply frozen and detached from inputs', () => {
    const settings = { ...defaultSettings }, colors = ['#abcdef', '#123456'];
    const originalSettings = { ...settings }, originalColors = [...colors];
    const sheet = buildIndexSheet(settings, colors), html = sheet.html;
    eq(settings, originalSettings); eq(colors, originalColors); ok(sheet.settings !== settings); ok(sheet.colors !== colors);
    settings.columns = '5'; colors[0] = '#000000'; colors.push('#FFFFFF');
    eq(sheet.settings, originalSettings); eq(sheet.colors, ['#ABCDEF', '#123456']); eq(sheet.html, html);
    for (const mutation of [() => { sheet.title = 'changed'; }, () => { sheet.settings.columns = '2'; }, () => { sheet.colors[0] = '#000000'; }, () => sheet.colors.push('#FFFFFF'), () => { sheet.labels[0] = 'changed'; }, () => sheet.labels.pop()]) throws(mutation);
    const frozen = buildIndexSheet(Object.freeze({ ...defaultSettings }), Object.freeze(['#abcdef'])); eq(frozen.colors, ['#ABCDEF']);
  });
  for (const field of ['columns', 'labels', 'heading', 'density']) {
    register('form rejects missing ' + field, () => { const input = makeForm(); input.delete(field); throws(() => indexSheetFromForm(input, sourceColors)); });
    register('form rejects duplicate ' + field, () => { const input = makeForm(); input.append(field, defaultSettings[field]); throws(() => indexSheetFromForm(input, sourceColors)); });
    register('form rejects file ' + field, () => { const input = makeForm(); input.set(field, new window.File(['studio'], 'setting.txt', { type: 'text/plain' })); throws(() => indexSheetFromForm(input, sourceColors)); });
    register('form rejects unsupported ' + field, () => { const input = makeForm(); input.set(field, '<script>bad</script>'); throws(() => indexSheetFromForm(input, sourceColors)); });
  }
  for (const field of ['unknown', '__proto__', 'columns[]', 'heading ']) register('form rejects unknown field ' + field, () => { const input = makeForm(); input.append(field, 'bad'); throws(() => indexSheetFromForm(input, sourceColors)); });
  register('form validation leaves caller FormData unchanged', () => { const input = makeForm(); const before = [...input]; indexSheetFromForm(input, sourceColors); eq([...input], before); input.append('unknown', 'bad'); const invalid = [...input]; throws(() => indexSheetFromForm(input, sourceColors)); eq([...input], invalid); });
  register('react initial required heading blocks download and invalidity reaches visible trigger', async () => {
    const downloads = captureDownloads();
    try {
      await mount(h(IndexDesk)); eq(container.querySelectorAll('button[role="combobox"]').length, 4);
      eq(data(), [['columns', '3'], ['labels', 'hex'], ['heading', ''], ['density', 'comfortable']]);
      eq(native('heading').required, true); eq(native('heading').validity.valueMissing, true);
      eq(container.querySelector('[aria-label="Index preview"]'), null); eq(container.querySelector('[aria-label="Exact inert HTML source"]'), null);
      eq(status(), 'Choose a heading to prepare the index.');
      await act(() => submit()); eq(downloads.blobs.length, 0); eq(downloads.clicks.length, 0);
      eq(trigger('heading').getAttribute('aria-invalid'), 'true');
      await act(() => form().reportValidity()); eq(document.activeElement, trigger('heading'));
    } finally { await unmount(); downloads.restore(); }
  });
  register('react four real portal controls change preview native FormData and exact inert source', async () => {
    await mount(h(IndexDesk, { colors: sourceColors }));
    await act(() => click(trigger('columns'))); eq([...list().querySelectorAll('[role="group"]')].map(node => document.getElementById(node.getAttribute('aria-labelledby')).textContent), ['Reading layouts', 'Compact layouts']);
    await act(() => key(document.activeElement, 'Escape'));
    await act(() => click(trigger('labels'))); eq(list().querySelectorAll('[role="separator"]').length, 1); await act(() => key(document.activeElement, 'Escape'));
    await choose('columns', '5'); await choose('labels', 'hsl', true); await choose('heading', 'proof'); await choose('density', 'micro', true);
    const settings = { columns: '5', labels: 'hsl', heading: 'proof', density: 'micro' }, sheet = buildIndexSheet(settings, sourceColors);
    eq(data(), Object.entries(settings)); eq(form().checkValidity(), true); eq(status(), sheet.filename);
    const preview = container.querySelector('[aria-label="Index preview"]'); eq(preview.querySelector('h3').textContent, sheet.title);
    eq(preview.querySelector('ol').style.gridTemplateColumns, 'repeat(5, minmax(0, 1fr))'); eq(preview.querySelector('ol').style.gap, '6px');
    eq([...preview.querySelectorAll('li')].map(node => node.style.padding), Array(5).fill('8px'));
    eq([...preview.querySelectorAll('[role="img"]')].map(node => node.style.height), Array(5).fill('36px'));
    eq([...preview.querySelectorAll('code')].map(node => node.textContent), sheet.labels);
    const source = container.querySelector('pre[aria-label="Exact inert HTML source"]'); eq(source.textContent, sheet.html); eq(source.querySelectorAll('script,style,meta,html,li').length, 0);
    eq(trigger('heading').getAttribute('aria-invalid'), null);
  });
  register('react each offered setting reaches native FormData and the preview through its portal', async () => {
    await mount(h(IndexDesk, { colors: sourceColors })); await choose('heading', 'studio');
    for (const [name, values] of [['columns', ['1', '2', '3', '4', '5']], ['labels', ['hex', 'rgb', 'hsl', 'ordinal']], ['heading', ['studio', 'archive', 'proof', 'handoff']], ['density', ['airy', 'comfortable', 'compact', 'micro']]]) {
      for (const value of values) {
        await choose(name, value);
        const settings = Object.fromEntries(data()), sheet = buildIndexSheet(settings, sourceColors);
        eq(settings[name], value); eq(status(), sheet.filename);
        eq(container.querySelector('pre[aria-label="Exact inert HTML source"]').textContent, sheet.html);
      }
    }
  });
  register('react downloads actual owner-document HTML Blob with correct filename and object URL lifecycle', async () => {
    const downloads = captureDownloads();
    try {
      await mount(h(IndexDesk, { colors: sourceColors })); await choose('heading', 'archive'); await choose('columns', '2'); await choose('labels', 'rgb'); await choose('density', 'compact');
      const settings = { columns: '2', labels: 'rgb', heading: 'archive', density: 'compact' }, sheet = buildIndexSheet(settings, sourceColors);
      await act(() => submit()); eq(downloads.blobs.length, 1); eq(downloads.clicks.length, 1);
      const first = downloads.blobs[0]; ok(first.blob instanceof window.Blob); eq(first.blob.type, sheet.mime); eq(first.blob.size, Buffer.byteLength(sheet.html, 'utf8'));
      const text = await blobText(first.blob); eq(text, sheet.html); parsedSafety(text, sourceColors.length);
      eq(downloads.clicks[0].filename, sheet.filename); eq(downloads.clicks[0].href, first.url); eq(downloads.clicks[0].attached, true); eq(downloads.clicks[0].owner, document);
      eq(document.querySelectorAll('a[download]').length, 0); eq(status(), 'Prepared ' + sheet.filename); eq(downloads.revoked, []);
      await choose('labels', 'ordinal'); eq(status(), buildIndexSheet({ ...settings, labels: 'ordinal' }, sourceColors).filename);
      await act(() => submit()); eq(downloads.blobs.length, 2); eq(downloads.revoked, [first.url]);
      eq(downloads.events.map(event => event[0]), ['create', 'click', 'revoke', 'create', 'click']);
      eq(await blobText(downloads.blobs[1].blob), buildIndexSheet({ ...settings, labels: 'ordinal' }, sourceColors).html);
      await unmount(); eq(downloads.revoked, downloads.blobs.map(item => item.url)); eq(document.querySelectorAll('[role="listbox"]').length, 0);
    } finally { await unmount(); downloads.restore(); }
  });
  register('react reset restores all settings required state preview and closes an active portal', async () => {
    const downloads = captureDownloads();
    try {
      await mount(h(IndexDesk)); await choose('columns', '1'); await choose('labels', 'ordinal'); await choose('heading', 'handoff'); await choose('density', 'airy');
      await act(() => submit()); eq(downloads.blobs.length, 1);
      await act(() => click(trigger('columns'))); ok(list());
      await act(() => click(container.querySelector('button[type="reset"]')));
      eq(data(), [['columns', '3'], ['labels', 'hex'], ['heading', ''], ['density', 'comfortable']]); eq(list(), null);
      eq(native('heading').validity.valueMissing, true); eq(status(), 'Choose a heading to prepare the index.');
      eq(container.querySelector('[aria-label="Index preview"]'), null); eq(container.querySelector('[aria-label="Exact inert HTML source"]'), null);
      await act(() => submit()); eq(downloads.blobs.length, 1);
      await choose('heading', 'studio'); await act(() => submit()); eq(downloads.blobs.length, 2); eq(downloads.revoked, [downloads.blobs[0].url]);
      await unmount(); eq(downloads.revoked, downloads.blobs.map(item => item.url));
    } finally { await unmount(); downloads.restore(); }
  });
  register('react submit button native validation blocks empty heading then downloads when valid', async () => {
    const downloads = captureDownloads();
    try {
      await mount(h(IndexDesk));
      await act(() => click(container.querySelector('button[type="submit"]'))); eq(downloads.blobs.length, 0);
      eq(native('heading').validity.valueMissing, true);
      await choose('heading', 'studio');
      await act(() => click(container.querySelector('button[type="submit"]'))); eq(downloads.blobs.length, 1); eq(downloads.clicks.length, 1);
      eq(downloads.clicks[0].filename, 'wix-index-studio-3-hex-comfortable.html');
    } finally { await unmount(); downloads.restore(); }
  });
  register('react actual native form rejects injected duplicate and unknown successful fields', async () => {
    const downloads = captureDownloads();
    try {
      await mount(h(IndexDesk)); await choose('heading', 'studio');
      for (const name of ['heading', 'unknown']) {
        const injected = document.createElement('input'); injected.type = 'hidden'; injected.name = name; injected.value = 'studio'; form().append(injected);
        await act(() => submit()); eq(downloads.blobs.length, 0); ok(/exactly one text value|Unexpected index form field/.test(status())); injected.remove();
      }
      await act(() => submit()); eq(downloads.blobs.length, 1); ok(status().startsWith('Prepared wix-index-'));
    } finally { await unmount(); downloads.restore(); }
  });
  register('react invalid source colors fail closed without emitting HTML Blob', async () => {
    const downloads = captureDownloads();
    try {
      await mount(h(IndexDesk, { colors: ['#123456; background:url(https://example.test/payload)'] })); await choose('heading', 'studio');
      eq(container.querySelector('[aria-label="Index preview"]'), null); eq(container.querySelector('[aria-label="Exact inert HTML source"]'), null);
      await act(() => submit()); eq(downloads.blobs.length, 0); eq(downloads.clicks.length, 0); ok(/six-digit hex colors/.test(status()));
    } finally { await unmount(); downloads.restore(); }
  });
  register('react missing object URL capability reports error and creates no download anchor', async () => {
    const downloads = captureDownloads();
    try {
      await mount(h(IndexDesk)); await choose('heading', 'studio'); window.URL.createObjectURL = () => { throw Error('Object URL unavailable for test'); };
      await act(() => submit()); eq(status(), 'Object URL unavailable for test'); eq(downloads.clicks.length, 0); eq(document.querySelectorAll('a[download]').length, 0);
    } finally { await unmount(); downloads.restore(); }
  });
  const eligible = cases.filter(test => SUITE === 'all' || (SUITE === 'react' ? test.name.startsWith('react ') : !test.name.startsWith('react ')));
  const selected = eligible.filter(test => !FILTER || test.name.includes(FILTER)), checks = [];
  for (const test of selected) {
    if (process.env.TRACE_CASES) console.log('CASE ' + test.name);
    try { await test.fn(); checks.push({ name: test.name, status: 'PASS' }); }
    catch (error) { checks.push({ name: test.name, status: 'FAIL', error: String(error.stack || error) }); }
  }
  await unmount();
  const after = snapshot(), failures = checks.filter(check => check.status === 'FAIL');
  if (!selected.length) failures.push({ name: 'completeness', error: 'Zero matched cases.' });
  if (JSON.stringify(before) !== JSON.stringify(after)) failures.push({ name: 'hash-integrity', error: 'Protected source, entry or test files changed during verification.' });
  const report = {
    status: failures.length ? 'FAIL' : FILTER ? 'PARTIAL' : 'PASS', suite: SUITE, caseFilter: FILTER || null, total: selected.length, eligible: eligible.length, authoredCases: cases.length, assertions, failed: failures.length,
    completeMatrix: !FILTER && selected.length === eligible.length, settingsMatrixComplete: builtCombinations === 320, settingsCombinations: builtCombinations,
    entry: ENTRY, sourceRoot: Q, hashesBefore: before, hashesAfter: after, realBrowser: false,
    model: 'One serial JSDOM process; real React portal controls and native FormData; actual owner-document Blob inspected with FileReader. Browser object URL APIs and anchor click are captured. No real OS download, browser default-key behavior or CSS visual assertions.',
    build: 'esbuild write:false, supplied existing dependencies and candidate ENTRY, no emitted bundle or consumer copy', checks, failures
  };
  fs.mkdirSync(path.dirname(REPORT), { recursive: true }); fs.writeFileSync(REPORT, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ status: report.status, suite: SUITE, caseFilter: FILTER || null, total: report.total, eligible: report.eligible, assertions, settingsCombinations: builtCombinations, failed: failures.length, output: REPORT }));
  for (const failure of failures) console.error(failure.name + '\n' + failure.error);
  dom.window.close(); if (failures.length) process.exitCode = 1;
})().catch(error => { console.error(error); dom.window.close(); process.exitCode = 1; });
