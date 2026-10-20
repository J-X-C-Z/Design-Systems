'use strict';
/** Pure example author tests. One inert JSDOM, no token evaluation or browser/network run. */
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const D = process.env.LOCAL_DEPENDENCIES;
const Q = path.resolve(__dirname, '..');
const SOURCE_ROOT = path.resolve(process.env.SOURCE_ROOT || Q);
const REPORT = path.resolve(process.env.REPORT_PATH || path.join(Q, 'qa/palette-capsule.json'));
const FILTER = process.env.CASE_FILTER || '';
const source = path.join(SOURCE_ROOT, 'examples/palette-capsule.ts');
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const watched = [__filename, source];
const hashesBefore = Object.fromEntries(watched.map(file => [file, sha(file)]));
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'wix-palette-author-'));
const esbuild = require(path.join(D, 'esbuild'));
const { JSDOM } = require(path.join(D, 'jsdom'));
const dom = new JSDOM('<!doctype html><html lang="en"><head></head><body></body></html>', { url: 'https://capsule-author.test/' });
const doc = dom.window.document;
let assertions = 0;
const eq = (actual, expected, message) => { assertions++; assert.deepEqual(actual, expected, message); };
const ok = (value, message) => { assertions++; assert.ok(value, message); };
const rejects = (run, pattern = /color|palette|supported|form|field/i) => { assertions++; assert.throws(run, pattern); };
const near = (actual, expected) => { assertions++; assert.ok(Math.abs(actual - expected) < 1e-12, `${actual} differs from fixed vector ${expected}`); };
const cases = [];
const add = (name, run) => cases.push({ name, run });
const layouts = ['grid', 'list', 'table', 'contrast'];
const disciplines = ['dev', 'creative', 'data', 'global'];
const dialects = ['css', 'js', 'json', 'csv'];
const stages = ['draft', 'active', 'archived', 'deprecated'];
const defaults = { layout: 'grid', discipline: 'dev', dialect: 'css', stage: 'active' };
const labels = { dev: 'Engineering', creative: 'Creative Arts', data: 'Analytics', global: 'Network Ops' };
const icons = { dev: 'code', creative: 'camera', data: 'database', global: 'globe' };
const stageLabels = { draft: 'Unpublished Draft', active: 'Live Deployment', archived: 'Archived Record', deprecated: 'Legacy System' };
const stageColors = { draft: 'rgb(109, 85, 72)', active: 'rgb(41, 100, 67)', archived: 'rgb(140, 83, 27)', deprecated: 'rgb(149, 62, 78)' };
const layoutTitles = { grid: 'Compact color cards', list: 'Spacious color list', table: 'Token reference table', contrast: 'Contrast reference ledger' };
const dialectTitles = { css: 'CSS custom properties', js: 'JavaScript object', json: 'JSON tokens', csv: 'CSV rows' };
const inputColors = Object.freeze(['#000000', '#ffffff', '#808080', '#abcdef', '#000000']);
const colors = ['#000000', '#FFFFFF', '#808080', '#ABCDEF', '#000000'];
const tokens = ['color-01', 'color-02', 'color-03', 'color-04', 'color-05'];
const rgb = ['0, 0, 0', '255, 255, 255', '128, 128, 128', '171, 205, 239', '0, 0, 0'];
const colorRecord = Object.fromEntries(tokens.map((token, index) => [token, colors[index]]));
const filenames = new Set(), contentHashes = new Set(), settingsKeys = new Set(), iconGeometries = new Map();
function formFor(settings, order = Object.keys(settings)) {
  const form = new dom.window.FormData();
  for (const key of order) form.append(key, settings[key]);
  return form;
}
function expectedTokens(settings) {
  const metadata = `${labels[settings.discipline]} | ${stageLabels[settings.stage]}`;
  if (settings.dialect === 'css') return `/* ${metadata} */\n:root {\n${tokens.map((token, index) => `  --${token}: ${colors[index]};`).join('\n')}\n}\n`;
  if (settings.dialect === 'js') return `// ${metadata}\nexport const palette = Object.freeze(${JSON.stringify(colorRecord, null, 2)});\n`;
  if (settings.dialect === 'json') return JSON.stringify({ discipline: settings.discipline, stage: settings.stage, colors: colorRecord }, null, 2) + '\n';
  return `discipline,stage,token,color\r\n${tokens.map((token, index) => `${settings.discipline},${settings.stage},${token},${colors[index]}`).join('\r\n')}\r\n`;
}
function parseTokensSafely(text, settings) {
  if (settings.dialect === 'css') {
    const match = /^\/\* ([^\n]+) \*\/\n:root \{\n((?:  --color-\d{2}: #[A-F0-9]{6};\n)+)\}\n$/.exec(text);
    ok(match, 'CSS is only the expected comment and custom-property declaration grammar');
    eq(match[1], `${labels[settings.discipline]} | ${stageLabels[settings.stage]}`);
    eq(Object.fromEntries([...match[2].matchAll(/  --(color-\d{2}): (#[A-F0-9]{6});\n/g)].map(match => [match[1], match[2]])), colorRecord);
  } else if (settings.dialect === 'js') {
    const match = /^\/\/ ([^\n]+)\nexport const palette = Object\.freeze\((\{[\s\S]*\})\);\n$/.exec(text);
    ok(match, 'JavaScript has only the permitted wrapper; its object is parsed as JSON, never executed');
    eq(match[1], `${labels[settings.discipline]} | ${stageLabels[settings.stage]}`);
    eq(JSON.parse(match[2]), colorRecord);
  } else if (settings.dialect === 'json') {
    eq(JSON.parse(text), { discipline: settings.discipline, stage: settings.stage, colors: colorRecord });
  } else {
    ok(text.endsWith('\r\n'));
    const rows = text.slice(0, -2).split('\r\n').map(row => row.split(','));
    eq(rows[0], ['discipline', 'stage', 'token', 'color']);
    eq(rows.slice(1), tokens.map((token, index) => [settings.discipline, settings.stage, token, colors[index]]));
    eq(rows.every(row => row.length === 4), true);
  }
}
function inspectHtml(artifact, settings) {
  ok(artifact.html.startsWith('<!doctype html>\n<html lang="en">'));
  // Reuse the one document. No script execution, resource loading or frame navigation is enabled.
  doc.documentElement.innerHTML = artifact.html.slice(artifact.html.indexOf('<head>'), artifact.html.lastIndexOf('</html>'));
  eq(doc.title, `${labels[settings.discipline]} palette capsule`);
  eq(doc.querySelector('meta[charset]')?.getAttribute('charset'), 'utf-8');
  eq(doc.querySelector('meta[name="viewport"]')?.content, 'width=device-width,initial-scale=1');
  eq(doc.querySelector('meta[http-equiv="Content-Security-Policy"]')?.content, "default-src 'none'; style-src 'unsafe-inline'; img-src 'none'; font-src 'none'; base-uri 'none'; form-action 'none'");
  const main = doc.querySelector('main');
  eq(Object.fromEntries(['layout', 'discipline', 'dialect', 'stage'].map(key => [key, main.dataset[key]])), settings);
  eq(doc.querySelectorAll('main').length, 1);
  eq(doc.querySelector('h1').textContent, artifact.title);
  eq(doc.querySelector('header .meta').textContent, 'LOCAL DESIGN HANDOFF · 5 colors');
  const svg = doc.querySelector('header svg');
  eq(doc.querySelectorAll('svg').length, 1);
  eq(svg.dataset.icon, icons[settings.discipline]);
  eq(svg.getAttribute('aria-hidden'), 'true');
  eq(svg.getAttribute('focusable'), 'false');
  eq(svg.getAttribute('viewBox'), '0 0 24 24');
  eq(svg.getAttribute('fill'), 'none');
  eq(svg.getAttribute('stroke'), 'currentColor');
  eq(svg.getAttribute('stroke-width'), '1.5');
  eq(svg.querySelectorAll('title,desc,a').length, 0);
  ok(svg.tabIndex < 0);
  if (iconGeometries.has(settings.discipline)) eq(svg.innerHTML, iconGeometries.get(settings.discipline), 'Every use of a discipline shares the same decorative geometry');
  else iconGeometries.set(settings.discipline, svg.innerHTML);
  eq(doc.querySelector('header .status').textContent, stageLabels[settings.stage], 'Full lifecycle text is present independently of color');
  eq(doc.querySelector('header .status').style.color, stageColors[settings.stage]);
  eq(doc.querySelector('header .dot').getAttribute('aria-hidden'), 'true');
  ok(doc.querySelector('header').textContent.includes('Lifecycle is a document label; it does not change a deployment or permission.'));
  eq(doc.querySelector('#layout-title').textContent, layoutTitles[settings.layout]);
  eq(doc.querySelector('#token-title').textContent, `Token dialect: ${dialectTitles[settings.dialect]}`);
  eq(doc.querySelector('pre code').textContent, artifact.tokens.replace(/\r\n/g, '\n'), 'Escaped code decodes to the payload with the HTML parser\'s required CRLF normalization');
  eq([...doc.querySelectorAll('.color')].map(node => node.textContent), colors);
  eq([...doc.querySelectorAll('.color')].map(node => node.getAttribute('aria-label')), colors.map(color => `Color ${color}`));
  eq([...doc.querySelectorAll('.color')].every(node => node.getAttribute('role') === 'img'), true);
  if (settings.layout === 'grid' || settings.layout === 'list') {
    eq(doc.querySelector('ol').className, `swatches ${settings.layout}`);
    eq(doc.querySelectorAll('ol > li').length, 5);
    eq([...doc.querySelectorAll('ol strong')].map(node => node.textContent), tokens);
    eq([...doc.querySelectorAll('ol li p')].map(node => node.textContent), rgb.map(value => `RGB ${value}`));
    eq(doc.querySelectorAll('table').length, 0);
  } else {
    eq(doc.querySelectorAll('ol').length, 0);
    eq(doc.querySelectorAll('table').length, 1);
    eq(doc.querySelectorAll('tbody tr').length, 5);
    eq(doc.querySelectorAll('tbody th[scope="row"]').length, 5);
    eq([...doc.querySelectorAll('thead th')].map(node => node.getAttribute('scope')), Array(settings.layout === 'table' ? 3 : 4).fill('col'));
    if (settings.layout === 'table') {
      eq(doc.querySelector('caption').textContent, 'Ordered palette tokens');
      eq([...doc.querySelectorAll('tbody th')].map(node => node.textContent), tokens);
      eq([...doc.querySelectorAll('tbody tr')].map(node => node.lastElementChild.textContent), rgb);
    } else {
      eq(doc.querySelector('caption').textContent, 'Contrast with opaque black and white text');
      eq([...doc.querySelectorAll('tbody tr')].map(node => [...node.querySelectorAll('td')].map(td => td.textContent)), artifact.swatches.map(swatch => [`${swatch.blackContrast.toFixed(2)}:1`, `${swatch.whiteContrast.toFixed(2)}:1`, swatch.recommendedText]));
      ok(doc.body.textContent.includes('They do not certify an entire interface or account for transparency.'));
    }
  }
  eq(doc.querySelectorAll('script,iframe,object,embed,link,base,form,img,audio,video,source,a').length, 0);
  eq([...doc.querySelectorAll('*')].flatMap(node => [...node.attributes]).filter(attribute => /^on/i.test(attribute.name)).length, 0);
  ok(!/url\s*\(|@import/i.test(doc.querySelector('style').textContent), 'No external CSS resource references');
  ok(doc.querySelector('style').textContent.includes('@media(forced-colors:active)'));
  ok(doc.querySelector('style').textContent.includes('@media print'));
  eq(doc.querySelector('footer').textContent, 'Self-contained local palette reference. Color order and duplicate entries are preserved.');
}
let api;
add('published helper choices and defaults have exact closed domains', () => {
  eq([...api.capsuleLayouts], layouts); eq([...api.capsuleDisciplines], disciplines); eq([...api.capsuleDialects], dialects); eq([...api.capsuleStages], stages); eq(api.capsuleDefaults, defaults); ok(Object.isFrozen(api.capsuleDefaults));
  for (const [name, values] of [['Layout', layouts], ['Discipline', disciplines], ['Dialect', dialects], ['Stage', stages]]) {
    for (const value of values) eq(api[`isCapsule${name}`](value), true);
    for (const value of [null, undefined, false, 0, {}, [], 'unknown', values[0].toUpperCase(), new String(values[0])]) eq(api[`isCapsule${name}`](value), false);
  }
});
for (const layout of layouts) for (const discipline of disciplines) for (const dialect of dialects) for (const stage of stages) {
  const settings = Object.freeze({ layout, discipline, dialect, stage });
  add(`combination ${layout}/${discipline}/${dialect}/${stage}`, () => {
    const artifact = api.buildPaletteCapsule(settings, inputColors);
    eq(artifact.settings, settings); eq(artifact.colors, colors);
    eq(artifact.filename, `palette-capsule-${layout}-${discipline}-${dialect}-${stage}.html`);
    eq(artifact.mime, 'text/html;charset=utf-8');
    eq(artifact.swatches.map(swatch => swatch.token), tokens); eq(artifact.swatches.map(swatch => swatch.rgb), rgb);
    eq(artifact.tokens, expectedTokens(settings)); parseTokensSafely(artifact.tokens, settings); inspectHtml(artifact, settings);
    ok(Object.isFrozen(artifact)); ok(Object.isFrozen(artifact.settings)); ok(Object.isFrozen(artifact.colors)); ok(Object.isFrozen(artifact.swatches)); ok(artifact.swatches.every(Object.isFrozen));
    eq(api.buildPaletteCapsule(settings, inputColors), artifact, 'Pure deterministic output');
    eq(api.capsuleFromForm(formFor(settings, ['stage', 'dialect', 'discipline', 'layout']), inputColors), artifact, 'Strict FormData and direct helper paths agree');
    filenames.add(artifact.filename); contentHashes.add(crypto.createHash('sha256').update(artifact.html).digest('hex')); settingsKeys.add(JSON.stringify(artifact.settings));
  });
}
add('all 256 setting tuples produce distinct filenames and HTML', () => {
  // Also operates correctly when this single case is selected by CASE_FILTER.
  const seenNames = new Set(), seenHtml = new Set(), seenSettings = new Set();
  for (const layout of layouts) for (const discipline of disciplines) for (const dialect of dialects) for (const stage of stages) {
    const artifact = api.buildPaletteCapsule({ layout, discipline, dialect, stage }, inputColors);
    seenNames.add(artifact.filename); seenHtml.add(crypto.createHash('sha256').update(artifact.html).digest('hex')); seenSettings.add(JSON.stringify(artifact.settings));
  }
  eq(seenNames.size, 256); eq(seenHtml.size, 256); eq(seenSettings.size, 256);
  if (!FILTER) { eq(filenames.size, 256); eq(contentHashes.size, 256); eq(settingsKeys.size, 256); eq(new Set(iconGeometries.values()).size, 4); }
});
add('fixed black white gray contrast and transfer-function boundary vectors', () => {
  const vectors = [
    ['#000000', 0, 1, 21, '#FFFFFF'],
    ['#FFFFFF', 1, 21, 1, '#000000'],
    ['#808080', 0.2158605001138992, 5.317210002277984, 3.9494396480491156, '#000000'],
    ['#777777', 0.184474994500441, 4.68949989000882, 4.478089453577214, '#000000'],
    ['#0A0A0A', 0.003035269835488375, 1.0607053967097675, 19.79814571052481, '#FFFFFF'],
    ['#0B0B0B', 0.003346535763899161, 1.0669307152779832, 19.682627652657427, '#FFFFFF'],
  ];
  const artifact = api.buildPaletteCapsule({ ...defaults, layout: 'contrast' }, vectors.map(vector => vector[0]));
  vectors.forEach(([color, luminance, black, white, recommended], index) => {
    near(api.capsuleLuminance(color), luminance); near(artifact.swatches[index].blackContrast, black); near(artifact.swatches[index].whiteContrast, white); eq(artifact.swatches[index].recommendedText, recommended);
  });
});
add('one and 24 colors preserve order duplicates casing and caller ownership', () => {
  for (const count of [1, 24]) {
    const input = Array.from({ length: count }, (_, index) => index % 2 ? '#abcdef' : '#123456');
    const snapshot = input.slice(), artifact = api.buildPaletteCapsule(defaults, input);
    eq(artifact.colors, input.map(color => color.toUpperCase())); eq(artifact.swatches.length, count);
    eq(artifact.swatches.at(-1).token, `color-${String(count).padStart(2, '0')}`);
    ok(artifact.html.includes(`LOCAL DESIGN HANDOFF · ${count} ${count === 1 ? 'color' : 'colors'}`));
    eq(input, snapshot); ok(artifact.colors !== input); input[0] = '#FFFFFF'; eq(artifact.colors[0], '#123456');
  }
  const settings = { ...defaults }, artifact = api.buildPaletteCapsule(settings, ['#123456']); settings.stage = 'draft'; eq(artifact.settings, defaults); ok(artifact.settings !== settings);
});
add('invalid empty oversized sparse nonstring and injection colors reject before generation', () => {
  const hole = ['#123456', , '#654321'];
  const invalid = [null, undefined, {}, '#123456', new Uint8Array(6), [], Array(1), hole, Array(25).fill('#123456'), ['#FFF'], ['123456'], ['#12345G'], [' #123456'], ['#123456\n'], ['#12345678'], ['transparent'], ['rgb(0,0,0)'], [null], [0], [false], [{}], [new String('#123456')], ['</style><script>alert(1)</script>']];
  for (const input of invalid) { rejects(() => api.normalizeCapsuleColors(input)); rejects(() => api.buildPaletteCapsule(defaults, input)); rejects(() => api.capsuleFromForm(formFor(defaults), input)); }
  for (const value of ['#FFF', null, '#00000Z']) rejects(() => api.capsuleLuminance(value));
});
add('settings reject missing extra inherited malformed and non-domain values', () => {
  const invalid = [null, undefined, false, 4, '', [], {}, { ...defaults, extra: true }, Object.create(defaults)];
  for (const key of Object.keys(defaults)) {
    const missing = { ...defaults }; delete missing[key]; invalid.push(missing);
    for (const value of [null, undefined, false, 1, {}, [], 'unknown', defaults[key].toUpperCase()]) invalid.push({ ...defaults, [key]: value });
  }
  for (const settings of invalid) { rejects(() => api.validateCapsuleSettings(settings)); rejects(() => api.buildPaletteCapsule(settings, colors)); }
});
add('strict FormData rejects unknown duplicate missing and File entries', () => {
  for (const key of ['extra', 'layout[]', '__proto__', 'constructor', 'Layout']) { const form = formFor(defaults); form.append(key, 'grid'); rejects(() => api.capsuleSettingsFromForm(form)); }
  for (const key of Object.keys(defaults)) {
    const duplicate = formFor(defaults); duplicate.append(key, defaults[key]); rejects(() => api.capsuleFromForm(duplicate, colors));
    const missing = formFor(defaults); missing.delete(key); rejects(() => api.capsuleSettingsFromForm(missing));
    const file = formFor(defaults); file.set(key, new dom.window.File(['grid'], 'value.txt', { type: 'text/plain' })); rejects(() => api.capsuleSettingsFromForm(file));
    const bad = formFor(defaults); bad.set(key, '<script>bad</script>'); rejects(() => api.capsuleSettingsFromForm(bad));
  }
  const form = formFor(defaults), before = [...form.entries()]; eq(api.capsuleSettingsFromForm(form), defaults); eq([...form.entries()], before); ok(Object.isFrozen(api.capsuleSettingsFromForm(form)));
  rejects(() => api.capsuleSettingsFromForm(new dom.window.FormData()));
});
(async () => {
  const started = Date.now(), results = [];
  const built = esbuild.buildSync({ absWorkingDir: SOURCE_ROOT, entryPoints: [source], bundle: true, format: 'cjs', platform: 'node', target: 'node18', write: false, metafile: true, logLevel: 'silent' });
  const compiled = path.join(temp, 'helper.cjs'); fs.writeFileSync(compiled, built.outputFiles[0].contents); api = require(compiled);
  const selected = cases.filter(test => !FILTER || test.name.includes(FILTER));
  for (const test of selected) {
    const before = assertions;
    try { await test.run(); results.push({ name: test.name, status: 'PASS', assertions: assertions - before }); }
    catch (error) { results.push({ name: test.name, status: 'FAIL', assertions: assertions - before, error: String(error.stack || error) }); console.error('FAIL ' + test.name + '\n' + error.message); }
  }
  const hashesAfter = Object.fromEntries(watched.map(file => [file, sha(file)])), inputsUnchanged = JSON.stringify(hashesBefore) === JSON.stringify(hashesAfter);
  const failures = results.filter(test => test.status === 'FAIL');
  if (!selected.length) failures.push({ name: 'zero-filter-completeness', error: 'Zero matched cases; an empty filtered run is a failure.' });
  if (!inputsUnchanged) failures.push({ name: 'input-immutability', error: 'A protected input changed during this run.' });
  const report = { status: failures.length ? 'FAIL' : FILTER ? 'PARTIAL' : 'PASS', total: selected.length, eligible: cases.length, passed: results.filter(test => test.status === 'PASS').length, failed: failures.length, assertions, completeSuite: !FILTER && selected.length === cases.length, combinationCases: selected.filter(test => test.name.startsWith('combination ')).length, expectedCombinations: 256, zeroFilterGuard: true, sourceRoot: SOURCE_ROOT, helper: source, hashesBefore, hashesAfter, inputsUnchanged, bundleInputs: Object.keys(built.metafile.inputs), runtime: { node: process.version, jsdom: require(path.join(D, 'jsdom/package.json')).version, esbuild: esbuild.version }, durationMs: Date.now() - started, realBrowser: false, jsdomInstances: 1, tokenCodeExecuted: false, productionBuildPerformed: false, results, failures, scope: 'Author tests of the pure example helper; one reused inert JSDOM document. No browser load, actual download, network, visual, dependency-runtime, independent-review or formal-acceptance claim.' };
  const output = JSON.stringify(report, null, 2) + '\n'; if (Buffer.byteLength(output) > 2 * 1024 * 1024) throw Error('Report exceeds 2 MiB.');
  fs.mkdirSync(path.dirname(REPORT), { recursive: true }); fs.writeFileSync(REPORT, output);
  console.log(JSON.stringify({ status: report.status, total: report.total, eligible: report.eligible, combinations: report.combinationCases, passed: report.passed, failed: report.failed, assertions, inputsUnchanged, report: REPORT }));
  if (failures.length) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => { dom.window.close(); fs.rmSync(temp, { recursive: true, force: true }); });
