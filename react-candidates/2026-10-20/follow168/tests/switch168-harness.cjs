process.env.NODE_ENV = 'production';
const path = require('node:path'), fs = require('node:fs'), assert = require('node:assert/strict');
const R = path.resolve(__dirname, '..'), D = process.env.LOCAL_DEPENDENCIES || R + '/node_modules';
const runtime = process.env.FOLLOW_NEXT_RUNTIME || R + '/qa/switch168-runtime.cjs';
if (!process.env.FOLLOW_NEXT_RUNTIME) require(D + '/esbuild').buildSync({entryPoints: [R + '/src/thirtyeighth-controls/switch.jsx'], outfile: runtime, bundle: true, platform: 'node', format: 'cjs', external: ['react', 'react-dom', 'react/jsx-runtime']});
const {JSDOM} = require(D + '/jsdom');
const w = new JSDOM('<button id="outside">Outside</button><div id="host"></div>', {url: 'https://local.test/', pretendToBeVisual: true}).window, d = w.document;
Object.assign(global, {window: w, document: d, HTMLElement: w.HTMLElement});
Object.defineProperty(global, 'navigator', {value: w.navigator, configurable: true});
const React = require(D + '/react'), h = React.createElement, {createRoot} = require(D + '/react-dom/client'), {flushSync} = require(D + '/react-dom');
const {Switch19} = require(runtime), checks = [], cases = [];
const wait = () => new Promise(resolve => setTimeout(resolve, 0)), settle = async () => { await wait(); await wait(); };
const ok = (value, message) => { assert.ok(value, message); checks.push(message); };
const equal = (actual, expected, message) => { assert.deepEqual(actual, expected, message); checks.push(message); };
const fixture = () => {
  const box = d.createElement('div'); d.querySelector('#host').append(box); const root = createRoot(box);
  return {box, root, render: element => flushSync(() => root.render(element)), input: () => box.querySelector('input'), form: () => box.querySelector('form'), close: () => { flushSync(() => root.unmount()); box.remove(); }};
};
async function test(name, work) { const f = fixture(); try { await work(f); cases.push({name, pass: true}); } finally { f.close(); } }
function state(f, expected, name) {
  equal(f.input().checked, expected, name + ': native checked');
  equal(f.box.querySelector('.fr38-switch-description').textContent, expected ? 'Changes sync instantly' : 'Manual updates only', name + ': visible description');
  equal(f.box.querySelector('.fr38-switch-status').textContent, 'Auto sync is ' + (expected ? 'enabled' : 'disabled'), name + ': polite status');
  equal(f.input().dataset.state, expected ? 'checked' : 'unchecked', name + ': input state');
  equal(f.box.querySelector('.fr38-switch-card').dataset.state, expected ? 'checked' : 'unchecked', name + ': card state');
}
function finish(name, extra = {}) {
  const result = {productionReact: true, act: false, cases: cases.length, checks: checks.length, browser: 0, formalAccepted: 0, records: cases, assertions: checks, ...extra};
  fs.writeFileSync(R + '/qa/' + name + (process.env.FOLLOW_NEXT_RUNTIME ? '-PACKAGE' : '-SOURCE') + '.json', JSON.stringify(result, null, 2));
  console.log(name + ': ' + result.cases + ' cases, ' + result.checks + ' checks'); w.close();
}
module.exports = {R, D, fs, assert, w, d, React, h, flushSync, Switch19, settle, ok, equal, fixture, test, state, finish};
