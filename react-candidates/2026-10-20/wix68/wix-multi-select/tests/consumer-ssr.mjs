import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

// This launcher stages only the current package API, CSS, and its pinned source
// references. A fresh Node process executes real bare ESM and CJS imports with
// no window/document globals. JSDOM is used only to parse returned markup.
const here = path.dirname(fileURLToPath(import.meta.url));
const dependencies = process.env.LOCAL_DEPENDENCIES && path.resolve(process.env.LOCAL_DEPENDENCIES);
if (!dependencies) throw Error('LOCAL_DEPENDENCIES must point to the existing toolchain; no install is performed.');
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const hashBytes = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const reportPath = path.resolve(process.env.REPORT_PATH || path.join(os.tmpdir(), 'wix-multi-select-consumer-ssr-report.json'));

if (process.env.WIX_MULTI_SELECT_SSR_CHILD !== '1') {
  const packageRoot = path.resolve(process.env.PACKAGE_ROOT || path.join(here, '..'));
  const identity = JSON.parse(fs.readFileSync(path.join(packageRoot, 'reference/IDENTITY.json'), 'utf8'));
  const packageFiles = ['package.json', 'dist/index.js', 'dist/index.cjs', 'src/index.tsx', 'src/index.d.ts', 'src/types.ts', 'src/styles.css', 'reference/CONTRACT.md', 'reference/IDENTITY.json', ...identity.files.map(file => 'reference/' + file.source)];
  const tracked = [...packageFiles.map(file => path.join(packageRoot, file)), fileURLToPath(import.meta.url)];
  if (tracked.includes(reportPath)) throw Error('REPORT_PATH cannot overwrite an input.');
  const before = Object.fromEntries(tracked.map(file => [file, sha(file)]));
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'wix-multi-select-ssr-'));
  let child = null;
  let launchError = null;
  let stagedBytesVerified = false;
  try {
    const stagedRoot = path.join(temp, 'node_modules/@studio/wix-multi-select');
    for (const file of packageFiles) {
      const output = path.join(stagedRoot, file);
      fs.mkdirSync(path.dirname(output), { recursive: true });
      fs.copyFileSync(path.join(packageRoot, file), output);
    }
    stagedBytesVerified = packageFiles.every(file => sha(path.join(packageRoot, file)) === sha(path.join(stagedRoot, file)));
    for (const dependency of ['react', 'react-dom']) fs.symlinkSync(path.join(dependencies, dependency), path.join(temp, 'node_modules', dependency), 'dir');
    fs.writeFileSync(path.join(temp, 'package.json'), JSON.stringify({ private: true, type: 'module' }));
    const worker = path.join(temp, 'consumer-ssr.mjs');
    fs.copyFileSync(fileURLToPath(import.meta.url), worker);
    const childReport = path.join(temp, 'report.json');
    const run = spawnSync(process.execPath, [worker], { cwd: temp, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024,
      env: { ...process.env, NODE_PATH: dependencies, WIX_MULTI_SELECT_SSR_CHILD: '1', REPORT_PATH: childReport } });
    if (run.stdout) process.stdout.write(run.stdout);
    if (run.stderr) process.stderr.write(run.stderr);
    if (fs.existsSync(childReport)) child = JSON.parse(fs.readFileSync(childReport, 'utf8'));
    if (run.status !== 0 || run.error || run.signal || !child) launchError = { exitCode: run.status, signal: run.signal, error: run.error?.message || null, missingReport: !child };
  } catch (error) { launchError = { message: String(error.stack || error) }; }
  finally { fs.rmSync(temp, { recursive: true, force: true }); }
  const after = Object.fromEntries(tracked.map(file => [file, sha(file)]));
  const drift = tracked.filter(file => before[file] !== after[file]);
  const report = { ...(child || { checks: [], failures: [] }), suite: 'wix-multi-select naked consumer SSR/API',
    packageRoot, dependencies, evidenceKind: process.env.PACKAGE_ROOT ? 'supplied-package-root; archive provenance must be established by caller' : 'source-tree-preflight',
    stagedFiles: packageFiles, stagedBytesVerified, hashesBefore: before, hashesAfter: after, drift, launchError,
    status: child?.status === 'PASS' && stagedBytesVerified && !drift.length && !launchError ? 'PASS' : 'FAIL',
    scope: 'Real bare ESM/CJS/CSS export resolution in a fresh isolated Node consumer; static SSR markup parsed without installing globals. No hydration, browser layout, interaction, screen reader, or device validation. Static ref target types are verified by type-matrix.cjs; SSR verifies forwardRef shape and no server ref assignment.' };
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ suite: report.suite, status: report.status, checks: report.checks.length, failures: report.failures.length, drift, reportPath }));
  if (report.status !== 'PASS') process.exitCode = 1;
} else {
  const noDom = () => { assert.equal(typeof globalThis.window, 'undefined'); assert.equal(typeof globalThis.document, 'undefined'); };
  noDom();
  const React = await import('react');
  const { renderToString } = await import('react-dom/server');
  const esm = await import('@studio/wix-multi-select');
  const require = createRequire(import.meta.url);
  const cjs = require('@studio/wix-multi-select');
  const { JSDOM } = require(path.join(dependencies, 'jsdom'));
  const cssPath = require.resolve('@studio/wix-multi-select/styles.css');
  const P = path.dirname(path.dirname(cssPath));
  const names = ['Select32', 'Select33'];
  const ids = ['select-32', 'select-33'];
  const labels = ['Active Pipeline Services', 'Communication Channels'];
  const summaries = ['Real-time Monitoring', 'Select notification paths'];
  const emptySummaries = ['Select operations', 'Select notification paths'];
  const pluralSuffixes = ['operations active', 'channels selected'];
  const originals = [
    [['monitoring', 'Real-time Monitoring'], ['logging', 'Log Aggregation'], ['analytics', 'Security Analytics'], ['backups', 'Automated Backups']],
    [['email', 'Primary Email'], ['sms', 'SMS Gateway'], ['push', 'Mobile Push'], ['slack', 'Slack Webhook'], ['discord', 'Discord Bot']],
  ];
  const checks = [], failures = [];
  const check = (name, fn) => {
    try { noDom(); fn(); noDom(); checks.push({ name, status: 'PASS' }); }
    catch (error) { const failure = { name, status: 'FAIL', message: String(error.stack || error) }; checks.push(failure); failures.push(failure); }
  };
  const selected = node => [...node.selectedOptions].map(option => option.value);
  function view(C, props, run) {
    noDom();
    const html = renderToString(React.createElement(C, props));
    const dom = new JSDOM(html);
    const d = dom.window.document;
    try { run({ html, dom, d, trigger: d.querySelector('.wix-ms-trigger'), native: d.querySelector('select'), root: d.querySelector('.wix-multi-select') }); }
    finally { dom.window.close(); }
  }
  check('bare ESM and CJS expose exactly two forwarded controls and frozen IDs', () => {
    assert.deepEqual(Object.keys(esm).sort(), [...names, 'wixMultiSelectIds'].sort());
    assert.deepEqual(Object.keys(cjs).sort(), Object.keys(esm).sort());
    assert.deepEqual(esm.wixMultiSelectIds, ids); assert.deepEqual(cjs.wixMultiSelectIds, ids);
    assert.ok(Object.isFrozen(esm.wixMultiSelectIds)); assert.ok(Object.isFrozen(cjs.wixMultiSelectIds));
    for (const name of names) for (const api of [esm, cjs]) {
      assert.equal(api[name].$$typeof, Symbol.for('react.forward_ref'));
      assert.equal(api[name].displayName, name);
    }
    assert.equal(esm.buildPalettePacket, undefined); assert.equal(cjs.parsePacketFormData, undefined);
  });
  check('real package import require CSS and declaration export paths', () => {
    assert.equal(path.relative(P, fileURLToPath(import.meta.resolve('@studio/wix-multi-select'))), 'dist/index.js');
    assert.equal(path.relative(P, require.resolve('@studio/wix-multi-select')), 'dist/index.cjs');
    assert.equal(path.relative(P, cssPath), 'src/styles.css');
    const meta = JSON.parse(fs.readFileSync(require.resolve('@studio/wix-multi-select/package.json'), 'utf8'));
    assert.equal(meta.name, '@studio/wix-multi-select');
    assert.equal(meta.exports['.'].types, './src/index.d.ts');
    assert.deepEqual(meta.sideEffects, ['./src/styles.css']); assert.equal(meta.dependencies, undefined);
    assert.ok(fs.existsSync(path.join(P, 'src/index.d.ts'))); assert.ok(fs.existsSync(path.join(P, 'src/types.ts')));
    const css = fs.readFileSync(cssPath, 'utf8');
    for (const selector of ['.wix-multi-select', '.wix-ms-trigger', '.wix-ms-popup', '.wix-ms-option[aria-pressed=true]', '.wix-ms-clear', '.wix-ms-chip', '.wix-ms-remove', '.wix-ms-native', 'prefers-reduced-motion', 'forced-colors']) assert.ok(css.includes(selector), `Missing current CSS selector ${selector}`);
  });
  check('all packaged original sources match pinned byte SHA-256 and git blob identities', () => {
    const identity = JSON.parse(fs.readFileSync(path.join(P, 'reference/IDENTITY.json'), 'utf8'));
    assert.deepEqual(identity.newIds, ids);
    assert.equal(identity.files.length, 6);
    for (const record of identity.files) {
      const bytes = fs.readFileSync(path.join(P, 'reference', record.source));
      assert.equal(bytes.length, record.bytes); assert.equal(hashBytes(bytes), record.sha256);
      assert.equal(crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes])).digest('hex'), record.gitBlob);
    }
  });
  for (const [i, name] of names.entries()) {
    const C = esm[name];
    check(ids[i] + ' default SSR exact CJS parity and real dialog trigger semantics', () => view(C, {}, ({ html, d, trigger: t, native: n, root: r }) => {
      assert.equal(html, renderToString(React.createElement(cjs[name])));
      assert.equal(t.tagName, 'BUTTON'); assert.equal(t.type, 'button'); assert.equal(t.getAttribute('role'), null);
      assert.equal(t.getAttribute('aria-haspopup'), 'dialog'); assert.equal(t.getAttribute('aria-expanded'), 'false'); assert.equal(t.getAttribute('aria-controls'), null);
      assert.equal(d.querySelector('[role="listbox"],[role="combobox"],[role="option"],[role="dialog"]'), null);
      assert.equal(d.querySelector('label').textContent, labels[i]); assert.equal(d.querySelector('label').htmlFor, t.id);
      assert.equal(t.getAttribute('aria-labelledby'), d.querySelector('label').id);
      assert.equal(d.querySelector('.wix-ms-value').textContent, summaries[i]);
      assert.deepEqual(selected(n), i === 0 ? ['monitoring'] : []);
      assert.equal(r.dataset.component, ids[i]); assert.equal(r.dataset.variant, ids[i]); assert.equal(r.dataset.motion, 'system');
      assert.equal(n.multiple, true); assert.equal(n.tabIndex, -1); assert.equal(n.getAttribute('aria-hidden'), 'true');
      assert.equal(n.required, false); assert.equal(n.disabled, false); assert.equal(t.disabled, false);
      assert.equal(t.querySelector('button'), null); assert.equal(d.querySelector('.wix-ms-enhancements'), null);
      for (const svg of d.querySelectorAll('svg')) { assert.equal(svg.getAttribute('aria-hidden'), 'true'); assert.equal(svg.getAttribute('focusable'), 'false'); }
    }));
    check(ids[i] + ' full source option labels and DOM order without empty placeholder or groups', () => view(C, {}, ({ native: n, d }) => {
      assert.deepEqual([...n.options].map(option => [option.value, option.textContent]), originals[i]);
      assert.equal(n.querySelector('option[value=""]'), null); assert.equal(n.querySelector('optgroup'), null);
      assert.equal(d.querySelector('[role="separator"]'), null);
    }));
    check(ids[i] + ' empty single plural and custom summaries count resolved values only', () => {
      const opts = [{ value: 'a', label: 'Complete Alpha Label' }, { value: 'b', label: 'Complete Beta Label' }];
      for (const [value, summary, placeholderFlag] of [[[], emptySummaries[i], 'true'], [['a'], 'Complete Alpha Label', null], [['b', 'a'], `2 ${pluralSuffixes[i]}`, null], [['latent'], emptySummaries[i], 'true'], [['a', 'latent'], 'Complete Alpha Label', null]]) {
        view(C, { options: opts, value }, ({ d, trigger }) => { assert.equal(d.querySelector('.wix-ms-value').textContent, summary); assert.equal(trigger.getAttribute('data-placeholder'), placeholderFlag); });
      }
      view(C, { options: opts, value: ['b', 'a', 'latent'], pluralLabel: 'local exports' }, ({ d }) => assert.equal(d.querySelector('.wix-ms-value').textContent, '2 local exports'));
      view(C, { options: opts, value: [], placeholder: 'Nothing local' }, ({ d }) => assert.equal(d.querySelector('.wix-ms-value').textContent, 'Nothing local'));
    });
    check(ids[i] + ' external form bridge uses repeated values in option DOM order', () => {
      const options = Object.freeze([Object.freeze({ value: 'a', label: 'Alpha' }), Object.freeze({ value: 'b', label: 'Beta' })]);
      const value = Object.freeze(['b', 'latent', 'a']);
      view(C, { id: 'owned', options, value, name: 'services', form: 'outside', required: true }, ({ d, dom, native: n, trigger: t }) => {
        assert.equal(n.name, 'services'); assert.equal(n.getAttribute('form'), 'outside'); assert.equal(n.required, true); assert.equal(n.disabled, false);
        assert.deepEqual(selected(n), ['a', 'b']); assert.equal(n.options.length, 2); assert.ok([...n.options].every(option => option.defaultSelected));
        assert.equal(t.hasAttribute('name'), false); assert.equal(t.hasAttribute('form'), false);
        const form = d.createElement('form'); form.id = 'outside'; d.body.append(form);
        assert.deepEqual([...new dom.window.FormData(form).entries()], [['services', 'a'], ['services', 'b']]);
      });
      assert.deepEqual(value, ['b', 'latent', 'a']); assert.ok(Object.isFrozen(value)); assert.equal(options.length, 2);
    });
    check(ids[i] + ' readOnly retains successful fields while suppressing native required validation', () => view(C, { value: ['a'], options: [{ value: 'a', label: 'Alpha' }], name: 'services', required: true, readOnly: true, defaultOpen: true, clearable: true, showSelectedItems: true }, ({ d, dom, trigger: t, native: n, root: r }) => {
      assert.equal(n.required, false); assert.equal(n.disabled, false); assert.equal(t.disabled, false);
      assert.equal(t.getAttribute('aria-disabled'), 'true'); assert.equal(t.getAttribute('aria-expanded'), 'false'); assert.equal(r.dataset.readonly, 'true');
      assert.equal(d.querySelector('.wix-ms-clear').disabled, true); assert.equal(d.querySelector('.wix-ms-remove').disabled, true);
      const form = d.createElement('form'); d.body.append(form); form.append(r);
      assert.deepEqual([...new dom.window.FormData(form).entries()], [['services', 'a']]);
    }));
    check(ids[i] + ' disabled bridge and all optional mutation controls are disabled', () => view(C, { value: ['a'], options: [{ value: 'a', label: 'Alpha' }], disabled: true, open: true, name: 'services', clearable: true, showSelectedItems: true }, ({ d, dom, trigger: t, native: n, root: r }) => {
      assert.equal(t.disabled, true); assert.equal(n.disabled, true); assert.equal(t.getAttribute('aria-expanded'), 'false'); assert.equal(r.dataset.disabled, 'true');
      assert.ok([...d.querySelectorAll('button')].every(button => button.disabled));
      const form = d.createElement('form'); d.body.append(form); form.append(r); assert.deepEqual([...new dom.window.FormData(form).entries()], []);
    }));
    check(ids[i] + ' clear and chips are separate accessible buttons and respect option locks', () => view(C, { value: ['b', 'latent', 'a'], options: [{ value: 'a', label: 'Alpha complete' }, { value: 'b', label: 'Beta complete', disabled: true }], clearable: true, showSelectedItems: true }, ({ d, trigger: t, native: n }) => {
      const clear = d.querySelector('.wix-ms-clear'), remove = [...d.querySelectorAll('.wix-ms-remove')];
      assert.equal(clear.type, 'button'); assert.equal(clear.textContent, 'Clear available selections'); assert.equal(clear.disabled, false);
      assert.deepEqual([...d.querySelectorAll('.wix-ms-chip-label')].map(node => node.textContent), ['Alpha complete', 'Beta complete']);
      assert.deepEqual(remove.map(node => node.getAttribute('aria-label')), ['Remove Alpha complete', 'Remove Beta complete']);
      assert.deepEqual(remove.map(node => node.disabled), [false, true]);
      assert.equal(n.options[1].disabled, true); assert.equal(n.options[1].selected, true);
      assert.ok(remove.every(button => button.type === 'button' && !t.contains(button))); assert.equal(t.contains(clear), false);
      assert.equal(t.querySelector('button'), null); assert.equal(d.querySelector('.wix-ms-chips').getAttribute('aria-label'), 'Selected items');
    }));
    check(ids[i] + ' clear unavailable for empty locked or latent-only selection', () => {
      for (const value of [[], ['locked'], ['latent'], ['locked', 'latent']]) view(C, { value, options: [{ value: 'locked', label: 'Locked', disabled: true }], clearable: true, showSelectedItems: true }, ({ d }) => {
        assert.equal(d.querySelector('.wix-ms-clear').disabled, true);
        assert.equal(d.querySelectorAll('.wix-ms-chip').length, value.includes('locked') ? 1 : 0);
      });
    });
    check(ids[i] + ' accessible naming descriptions explicit invalid metadata and safe text escaping', () => view(C, { id: 'specific', value: ['a'], options: [{ value: 'a', label: 'Value <data>' }], label: 'Visible <name>', helper: 'Help & notes', error: 'Error <text>', 'aria-describedby': 'outside', 'aria-invalid': 'grammar', dir: 'rtl', motion: 'off', className: 'outer', style: { maxWidth: 320 } }, ({ d, trigger: t, root: r }) => {
      assert.equal(t.id, 'specific'); assert.equal(t.getAttribute('aria-invalid'), 'grammar'); assert.equal(r.dir, 'rtl'); assert.equal(r.dataset.motion, 'off'); assert.ok(r.classList.contains('outer')); assert.equal(r.style.maxWidth, '320px');
      assert.equal(d.querySelector('name,data,text'), null); assert.equal(d.querySelector('.wix-ms-value').textContent, 'Value <data>'); assert.equal(d.querySelector('[role="alert"]').textContent, 'Error <text>');
      const descriptions = t.getAttribute('aria-describedby').split(' '); assert.ok(descriptions.includes('outside'));
      for (const node of [d.querySelector('.wix-ms-helper'), d.querySelector('[role="alert"]')]) assert.ok(descriptions.includes(node.id));
    }));
    check(ids[i] + ' explicit accessible name and false invalid remain authoritative', () => {
      view(C, { 'aria-label': 'Custom channels', error: 'Still display this', 'aria-invalid': false }, ({ trigger: t, d }) => {
        assert.equal(t.getAttribute('aria-label'), 'Custom channels'); assert.equal(t.hasAttribute('aria-labelledby'), false); assert.equal(t.getAttribute('aria-invalid'), 'false'); assert.ok(d.querySelector('[role="alert"]'));
      });
      view(C, { 'aria-label': 'Fallback name', 'aria-labelledby': 'outside-label' }, ({ trigger: t }) => assert.equal(t.getAttribute('aria-labelledby'), 'outside-label'));
    });
    check(ids[i] + ' supported native trigger attributes survive SSR without event execution', () => {
      let callbacks = 0; const ref = React.createRef();
      view(C, { ref, triggerProps: { title: 'Toggle selections', tabIndex: 3, autoFocus: true, onClick() { callbacks++; }, onFocus() { callbacks++; } }, onValueChange() { callbacks++; }, onOpenChange() { callbacks++; } }, ({ trigger: t }) => {
        assert.equal(t.title, 'Toggle selections'); assert.equal(t.tabIndex, 3); assert.equal(t.autofocus, true); assert.equal(t.type, 'button'); assert.equal(t.hasAttribute('onclick'), false);
      });
      assert.equal(callbacks, 0); assert.equal(ref.current, null);
    });
    check(ids[i] + ' open and defaultOpen serialize state without server portal or callbacks', () => {
      for (const props of [{ open: true }, { defaultOpen: true }]) {
        let callbacks = 0;
        view(C, { ...props, id: 'open-state', onOpenChange() { callbacks++; } }, ({ trigger: t, d }) => {
          assert.equal(t.getAttribute('aria-expanded'), 'true'); assert.equal(t.getAttribute('aria-controls'), 'open-state-dialog');
          assert.equal(d.querySelector('[role="dialog"]'), null); assert.equal(d.querySelector('.wix-ms-option'), null);
        });
        assert.equal(callbacks, 0);
      }
    });
    check(ids[i] + ' arrays empty options and immutable defaults are supported', () => {
      view(C, { options: [], defaultValue: Object.freeze(['latent']), clearable: true, showSelectedItems: true }, ({ native: n, d }) => {
        assert.equal(n.options.length, 0); assert.deepEqual(selected(n), []); assert.equal(d.querySelector('.wix-ms-value').textContent, emptySummaries[i]); assert.equal(d.querySelector('.wix-ms-clear').disabled, true);
      });
      view(C, { defaultValue: Object.freeze([originals[i][1][0]]) }, ({ native: n, d }) => {
        assert.deepEqual(selected(n), [originals[i][1][0]]); assert.equal(d.querySelector('.wix-ms-value').textContent, originals[i][1][1]);
      });
    });
    check(ids[i] + ' runtime rejects non-array sparse duplicate and non-string selections', () => {
      const sparse = new Array(2); sparse[1] = 'a';
      const inherited = new Array(1); Object.setPrototypeOf(inherited, Object.assign(Object.create(Array.prototype), { 0: 'a' }));
      const invalid = ['a', 2, new Set(['a']), [1], [''], ['a', 'a'], sparse, inherited];
      for (const value of invalid) for (const owner of ['value', 'defaultValue']) assert.throws(() => renderToString(React.createElement(C, { [owner]: value })), /dense array of unique, nonempty strings/);
    });
    check(ids[i] + ' runtime rejects conflicting owners and malformed options', () => {
      const sparse = new Array(1);
      const invalid = [
        { value: [], defaultValue: [] }, { open: true, defaultOpen: false },
        { options: new Set() }, { options: sparse }, { options: [{ value: '', label: 'Empty' }] },
        { options: [{ value: 'a', label: 'A' }, { value: 'a', label: 'Duplicate' }] },
        { options: [{ label: 'Group', options: [] }] }, { options: [{ value: 'a', label: 'A', options: [] }] },
        { options: [{ separator: true }] }, { options: [{ value: 'a', label: 'A', image: '/a.png' }] },
        { options: [{ value: 'a', label: 'A', decoration: { kind: 'icon', name: 'code' } }] },
        { options: [{ value: 'a', label: React.createElement('span') }] }, { options: [{ value: 'a', label: 'A', disabled: 'yes' }] },
      ];
      for (const props of invalid) assert.throws(() => renderToString(React.createElement(C, props)), /wix-multi-select:/);
    });
    check(ids[i] + ' runtime rejects invalid plain metadata and enhancement booleans', () => {
      for (const prop of ['label', 'placeholder', 'pluralLabel', 'helper', 'error']) assert.throws(() => renderToString(React.createElement(C, { [prop]: React.createElement('span') })), /must be a plain string/);
      for (const prop of ['open', 'defaultOpen', 'disabled', 'readOnly', 'required', 'clearable', 'showSelectedItems']) assert.throws(() => renderToString(React.createElement(C, { [prop]: 'true' })), /must be a boolean/);
    });
  }
  check('Select33 exact source helper is preserved and can be explicitly omitted', () => {
    view(esm.Select33, {}, ({ d, trigger }) => { const helper = d.querySelector('.wix-ms-helper'); assert.equal(helper.textContent, 'System alerts will be delivered via all selected channels.'); assert.ok(trigger.getAttribute('aria-describedby').split(' ').includes(helper.id)); });
    view(esm.Select33, { helper: '' }, ({ d, trigger }) => { assert.equal(d.querySelector('.wix-ms-helper'), null); assert.equal(trigger.hasAttribute('aria-describedby'), false); });
    view(esm.Select32, {}, ({ d }) => assert.equal(d.querySelector('.wix-ms-helper'), null));
  });
  check('multiple server-rendered instances retain unique associated IDs and no nested buttons', () => {
    const html = renderToString(React.createElement('form', null, ...[esm.Select32, esm.Select33, esm.Select32, esm.Select33].map((C, index) => React.createElement(C, { key: index, clearable: true, showSelectedItems: true }))));
    const dom = new JSDOM(html);
    try {
      const d = dom.window.document, elements = [...d.querySelectorAll('[id]')];
      assert.equal(new Set(elements.map(node => node.id)).size, elements.length);
      assert.equal(d.querySelectorAll('select[multiple]').length, 4); assert.equal(d.querySelectorAll('.wix-ms-trigger').length, 4);
      for (const trigger of d.querySelectorAll('.wix-ms-trigger')) { assert.equal(d.getElementById(trigger.getAttribute('aria-labelledby')).htmlFor, trigger.id); assert.equal(trigger.querySelector('button'), null); }
    } finally { dom.window.close(); }
  });
  const report = { status: failures.length ? 'FAIL' : 'PASS', checks, failures, noDomGlobals: typeof globalThis.window === 'undefined' && typeof globalThis.document === 'undefined',
    runtimePaths: { esm: fileURLToPath(import.meta.resolve('@studio/wix-multi-select')), cjs: require.resolve('@studio/wix-multi-select'), css: cssPath },
    hashes: { esm: sha(fileURLToPath(import.meta.resolve('@studio/wix-multi-select'))), cjs: sha(require.resolve('@studio/wix-multi-select')), css: sha(cssPath) },
    versions: Object.fromEntries(['react', 'react-dom', 'jsdom'].map(dependency => [dependency, require(path.join(dependencies, dependency, 'package.json')).version])),
    realBrowser: false };
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
  if (failures.length) { for (const failure of failures) console.error(failure.message); process.exitCode = 1; }
}
