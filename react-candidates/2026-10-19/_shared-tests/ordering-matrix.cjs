#!/usr/bin/env node
'use strict';
// Author-owned, implementation-independent behavioral fixture. Never imports source.
process.env.NODE_ENV = 'production';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const argv = process.argv.slice(2);
const options = {};
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === '--help') {
    console.log('node ordering-matrix.cjs --package /absolute/dist/index.cjs [--checkbox Checkbox03|CelCheckbox05.items.default] [--switch Switch03.items.info|CelSwitch05.items.info] [--only checkbox|switch] [--out results.json] [--toolchain /path/node_modules] [--settle-ms 35]');
    process.exit(0);
  }
  if (argv[i].startsWith('--')) options[argv[i].slice(2)] = argv[++i];
  else if (!options.package) options.package = argv[i];
  else if (!options.out) options.out = argv[i];
  else throw new Error(`Unexpected argument: ${argv[i]}`);
}
if (!options.package) throw new Error('--package actual CJS package entry is required');
const entry = fs.realpathSync(path.resolve(options.package));
const out = path.resolve(options.out || path.join(process.cwd(), 'ordering-matrix-results.json'));
const tc = options.toolchain || process.env.LOCAL_DEPENDENCIES || path.resolve('node_modules');
const {JSDOM} = require(path.join(tc, 'jsdom'));
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {pretendToBeVisual: true, url: 'https://fixture.example.test/'});
Object.assign(global, {window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, HTMLInputElement: dom.window.HTMLInputElement, Event: dom.window.Event, MouseEvent: dom.window.MouseEvent, MutationObserver: dom.window.MutationObserver});
const React = require(path.join(tc, 'react'));
const {createRoot} = require(path.join(tc, 'react-dom/client'));
const {flushSync} = require(path.join(tc, 'react-dom'));
const h = React.createElement;
const Package = require(entry);
const sha = () => crypto.createHash('sha256').update(fs.readFileSync(entry)).digest('hex');
const initialSha = sha();
const nativeTimeout = global.setTimeout;
const nativeClearTimeout = global.clearTimeout;
const settleMs = Number(options['settle-ms'] || 35);
const wait = () => new Promise(resolve => nativeTimeout(resolve, settleMs));
const pendingPackageTimers = new Map();
const registeredResetListeners = new Set();
let activeCase = null;
let timersFiredAfterUnmount = 0;
let caseIndex = 0;
let stepIndex = 0;
const uncaught = [];
// Real timers remain real. These wrappers only observe creation, cancellation and firing.
global.setTimeout = function (callback, delay, ...args) {
  const fromPackage = new Error().stack.includes(entry);
  if (!fromPackage) return nativeTimeout(callback, delay, ...args);
  const associatedCase = activeCase;
  let handle;
  handle = nativeTimeout(function (...callbackArgs) {
    pendingPackageTimers.delete(handle);
    if (associatedCase && associatedCase.unmounted) timersFiredAfterUnmount++;
    return callback(...callbackArgs);
  }, delay, ...args);
  pendingPackageTimers.set(handle, {caseId: associatedCase?.id, delay});
  return handle;
};
global.clearTimeout = function (handle) {
  pendingPackageTimers.delete(handle);
  return nativeClearTimeout(handle);
};
const nativeAdd = document.addEventListener.bind(document);
const nativeRemove = document.removeEventListener.bind(document);
document.addEventListener = function (type, callback, options) {
  if (type === 'reset' && new Error().stack.includes(entry)) registeredResetListeners.add(callback);
  return nativeAdd(type, callback, options);
};
document.removeEventListener = function (type, callback, options) {
  if (type === 'reset') registeredResetListeners.delete(callback);
  return nativeRemove(type, callback, options);
};
window.addEventListener('error', event => { uncaught.push(String(event.error?.stack || event.message)); event.preventDefault(); });
process.on('uncaughtException', error => { uncaught.push(String(error.stack || error)); });
const paths = ['own-onClick', 'details.cancel', 'ancestor-preventDefault'];
const rows = [];
const failures = [];
const root = createRoot(document.querySelector('#root'));
function select(selector, kind) {
  const [name, item] = selector.split('.items.');
  const exported = Package[name] ? name : name.startsWith('Cel') && Package[name.slice(3)] ? name.slice(3) : name;
  const Component = Package[exported];
  if (!Component) throw new Error(`Package export ${name} not found (exports: ${Object.keys(Package).join(', ')})`);
  return {kind, selector, exported, render(props) { return h(Component, item ? {items: {[item]: props}} : props); }};
}
const targets = [];
if (options.only !== 'switch') targets.push(select(options.checkbox || (Package.Checkbox03 ? 'Checkbox03' : Package.CelCheckbox05 ? 'CelCheckbox05.items.default' : 'Checkbox05.items.default'), 'checkbox'));
if (options.only !== 'checkbox') targets.push(select(options.switch || (Package.Switch03 ? 'Switch03.items.info' : Package.CelSwitch05 ? 'CelSwitch05.items.info' : 'Switch05.items.info'), 'switch'));
function equal(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
function assert(row, label, actual, expected, category = 'behavior') {
  const result = {label, category, actual, expected, pass: equal(actual, expected)};
  row.checks.push(result);
  if (!result.pass) { row.pass = false; failures.push({caseId: row.id, target: row.target, path: row.cancelPath, defaultChecked: row.defaultChecked, ...result}); }
}
function observation(input, form) {
  return {checked: input.checked, indeterminate: input.indeterminate, ariaChecked: input.getAttribute('aria-checked'), disabled: input.matches(':disabled'), readOnly: input.readOnly, formData: [...new window.FormData(form).entries()], connected: input.isConnected};
}
function checkState(ctx, label, expected, category = 'state') {
  const actual = observation(ctx.input, ctx.form);
  ctx.row.snapshots.push({label, ...actual});
  if (expected.checked !== undefined) assert(ctx.row, `${label}: checked`, actual.checked, expected.checked, category);
  if (expected.indeterminate !== undefined) assert(ctx.row, `${label}: indeterminate`, actual.indeterminate, expected.indeterminate, category);
  // FormData is asserted at every immediate and settled checkpoint, including diagnostic native transients.
  const successChecked = expected.checked === undefined ? actual.checked : expected.checked;
  const successful = successChecked && !actual.disabled;
  assert(ctx.row, `${label}: FormData`, actual.formData, successful ? [[ctx.name, 'selected']] : [], category);
  if (category === 'settled' && expected.checked !== undefined && expected.indeterminate !== undefined) {
    assert(ctx.row, `${label}: aria-checked`, actual.ariaChecked, expected.indeterminate ? 'mixed' : String(expected.checked), category);
  }
  return actual;
}
async function createContext(target, scenario, cancelPath, defaults, extra = {}) {
  const row = {id: `${String(++caseIndex).padStart(3, '0')}:${target.kind}:${scenario}:${cancelPath}:default=${defaults}`, target: target.selector, kind: target.kind, scenario, cancelPath, defaultChecked: defaults, pass: true, checks: [], snapshots: [], events: [], notes: [], unmounted: false};
  rows.push(row);
  activeCase = row;
  const name = `matrix-${caseIndex}`;
  const ctx = {row, target, cancelPath, name, props: {defaultChecked: defaults, name, value: 'selected', 'data-matrix-target': String(caseIndex), ...extra}, behavior: {}, fieldset: false, inLegend: false, input: null, form: null};
  function record(stage, event, details, proposed) {
    const input = event.target;
    const record = {step: stepIndex, stage, proposed, checked: input.checked, indeterminate: input.indeterminate, defaultPrevented: event.defaultPrevented, nativeDefaultPrevented: event.nativeEvent?.defaultPrevented, currentTargetIsInput: event.currentTarget === input, formData: [...new window.FormData(input.form).entries()]};
    if (details) {
      record.previousState = {...details.previousState};
      record.nextState = {...details.nextState};
      record.canceled = details.canceled;
    }
    row.events.push(record);
    return record;
  }
  function effect(stage, event, details) {
    const b = ctx.behavior;
    if (b.effectStage === stage && !b.effectDone) {
      b.effectDone = true;
      if (b.reset) {
        if (b.cancelReset) ctx.form.addEventListener('reset', e => e.preventDefault(), {once: true});
        ctx.form.reset();
        row.snapshots.push({label: `inside ${stage}: after ${b.cancelReset ? 'canceled ' : ''}reset`, ...observation(ctx.input, ctx.form)});
      }
      if (b.update) {
        ctx.props = {...ctx.props, ...b.update};
        ctx.render();
        row.snapshots.push({label: `inside ${stage}: after controlled flushSync`, ...observation(ctx.input, ctx.form)});
      }
    }
    if (b.veto && (b.path || cancelPath) === stage) {
      if (stage === 'details.cancel') details.cancel(); else event.preventDefault();
    }
  }
  ctx.render = () => {
    const props = {...ctx.props,
      onClick(event) { record('own-before', event); effect('own-onClick', event); record('own-after', event); },
      onCheckedChange(value, details) {
        const before = record('semantic-before', details.event, details, value);
        assert(row, `step ${stepIndex}: semantic value matches nextState`, value, details.nextState.checked, 'callback');
        assert(row, `step ${stepIndex}: nextState clears mixed`, details.nextState.indeterminate, false, 'callback');
        assert(row, `step ${stepIndex}: semantic currentTarget`, before.currentTargetIsInput, true, 'callback');
        if (!ctx.behavior.effectDone) {
          assert(row, `step ${stepIndex}: semantic sees native proposal`, before.checked, value, 'callback');
          assert(row, `step ${stepIndex}: semantic FormData sees proposal`, before.formData, before.checked && !ctx.input.matches(':disabled') ? [[name, 'selected']] : [], 'callback');
        }
        if (ctx.behavior.expectedNext) assert(row, `step ${stepIndex}: nextState matches logical activation`, before.nextState, ctx.behavior.expectedNext, 'callback');
        if (ctx.behavior.expectedPrevious) assert(row, `step ${stepIndex}: previousState is last accepted state`, before.previousState, ctx.behavior.expectedPrevious, 'callback');
        effect('details.cancel', details.event, details);
        record('semantic-after', details.event, details, value);
      }
    };
    let content = target.render(props);
    if (ctx.fieldset) content = h('fieldset', {disabled: true}, ctx.inLegend ? h('legend', null, content) : content);
    flushSync(() => root.render(h('form', {key: row.id, 'data-matrix-form': 'true', onClick(event) {
      if (event.target !== ctx.input) return;
      record('ancestor-before', event);
      effect('ancestor-preventDefault', event);
      record('ancestor-after', event);
    }}, content)));
    ctx.input = document.querySelector(`[data-matrix-target="${caseIndex}"]`);
    ctx.form = document.querySelector('form[data-matrix-form]');
    if (!ctx.input || !ctx.form) throw new Error('Target native input/form not found');
  };
  ctx.render();
  ctx.reset = (label, canceled = false) => {
    if (canceled) ctx.form.addEventListener('reset', event => event.preventDefault(), {once: true});
    ctx.form.reset();
    row.snapshots.push({label, ...observation(ctx.input, ctx.form)});
  };
  ctx.click = (label, behavior, expected = {}) => {
    stepIndex++;
    ctx.behavior = {...behavior};
    const start = row.events.length;
    const blocked = ctx.input.matches(':disabled');
    const readonly = ctx.input.readOnly;
    if (behavior.forged) {
      const native = new window.MouseEvent('click', {bubbles:true, cancelable:false});
      const returned = ctx.input.dispatchEvent(native);
      assert(row, `${label}: noncancelable native event stays uncanceled`, native.defaultPrevented, false, 'forged-event');
      assert(row, `${label}: dispatchEvent return value`, returned, true, 'forged-event');
    } else ctx.input.click();
    const canceledActivation = !!behavior.veto || readonly || !!behavior.forged;
    const immediateExpected = canceledActivation ? {} : expected;
    const after = checkState(ctx, `immediate ${label}`, immediateExpected, immediateExpected.checked === undefined ? 'native-transient' : 'immediate');
    if (canceledActivation) row.snapshots[row.snapshots.length - 1].expectedSettledOwner = expected;
    const events = row.events.slice(start);
    const semantic = events.filter(e => e.stage === 'semantic-before');
    const own = events.filter(e => e.stage === 'own-before');
    const ancestor = events.filter(e => e.stage === 'ancestor-before');
    const selectedPath = behavior.path || cancelPath;
    const expectedSemantic = blocked || readonly || (behavior.veto && selectedPath === 'own-onClick') ? 0 : 1;
    assert(row, `${label}: own callback count`, own.length, blocked ? 0 : 1, 'callback');
    assert(row, `${label}: semantic callback count`, semantic.length, expectedSemantic, 'callback');
    assert(row, `${label}: ancestor callback count`, ancestor.length, blocked ? 0 : 1, 'callback');
    if (ancestor.length) {
      assert(row, `${label}: ancestor FormData matches native state`, ancestor[0].formData, ancestor[0].checked && !blocked ? [[name, 'selected']] : [], 'ancestor');
      if (!behavior.reset && !behavior.update && semantic.length) {
        assert(row, `${label}: ancestor sees semantic native proposal`, ancestor[0].checked, semantic[0].checked, 'ancestor');
      }
      const end = events.find(e => e.stage === 'ancestor-after');
      assert(row, `${label}: cancellation visible after ancestor`, end.defaultPrevented, !!behavior.veto || readonly, 'ancestor');
    }
    return after;
  };
  ctx.prime = async () => {
    ctx.click('prime accepted', {}, {checked: !defaults, indeterminate: target.kind === 'checkbox' && ctx.props.indeterminate !== undefined ? ctx.props.indeterminate : false});
    await wait();
    checkState(ctx, 'settled prime', {checked: !defaults, indeterminate: target.kind === 'checkbox' && ctx.props.indeterminate !== undefined ? ctx.props.indeterminate : false}, 'settled');
  };
  ctx.finish = async expected => { await wait(); checkState(ctx, 'settled final', expected, 'settled'); };
  ctx.unmount = () => {
    flushSync(() => root.render(null));
    row.unmounted = true;
  };
  return ctx;
}
async function runCase(target, scenario, cancelPath, defaults, extra, body) {
  let ctx;
  const beforeErrors = uncaught.length;
  try {
    ctx = await createContext(target, scenario, cancelPath, defaults, extra);
    await body(ctx);
  } catch (error) {
    if (!ctx) {
      const row = rows[rows.length - 1];
      if (row) assert(row, 'fixture execution', String(error.stack || error), 'no thrown error', 'exception');
      else throw error;
    } else assert(ctx.row, 'fixture execution', String(error.stack || error), 'no thrown error', 'exception');
  } finally {
    if (ctx) {
      if (!ctx.row.unmounted) ctx.unmount();
      await wait();
      assert(ctx.row, 'no uncaught event errors', uncaught.slice(beforeErrors), [], 'cleanup');
      activeCase = null;
    }
  }
}
const state = (checked, indeterminate = false) => ({checked, indeterminate});
async function ordering(target, p, d) {
  const b = !d;
  const cases = {
    'reset-cancel': async c => { await c.prime(); c.reset('reset'); c.click('cancel', {veto:true}, state(d)); await c.finish(state(d)); },
    'reset-two-cancel': async c => { await c.prime(); c.reset('reset'); c.click('cancel 1',{veto:true},state(d)); c.click('cancel 2',{veto:true},state(d)); await c.finish(state(d)); },
    'reset-accepted-cancel': async c => { await c.prime(); c.reset('reset'); c.click('accepted',{},state(b)); c.click('cancel',{veto:true},state(b)); await c.finish(state(b)); },
    'cancel-reset': async c => { await c.prime(); c.click('cancel',{veto:true},state(b)); c.reset('reset'); await c.finish(state(d)); },
    'multiple-reset-cancel': async c => { await c.prime(); c.reset('reset 1'); c.reset('reset 2'); c.reset('reset 3'); c.click('cancel',{veto:true},state(d)); await c.finish(state(d)); },
    'canceled-reset-cancel': async c => { await c.prime(); c.reset('canceled reset',true); c.click('cancel',{veto:true},state(b)); await c.finish(state(b)); },
    'callback-reset': async c => { await c.prime(); c.click('accepted with semantic reset',{effectStage:'details.cancel',reset:true},{checked:d}); await c.finish(state(d)); },
    'callback-canceled-reset': async c => { await c.prime(); c.click('accepted with semantic canceled reset',{effectStage:'details.cancel',reset:true,cancelReset:true},state(d)); await c.finish(state(d)); },
    'callback-reset-then-cancel': async c => { await c.prime(); c.click('handler reset then veto',{effectStage:p,reset:true,veto:true},{}); c.row.notes.push('Reset inside canceled dispatch can be temporarily reversed by native canceled activation; immediate checked is observational, FormData consistency is asserted.'); await c.finish(state(d)); },
    'callback-canceled-reset-then-cancel': async c => { await c.prime(); c.click('handler canceled reset then veto',{effectStage:p,reset:true,cancelReset:true,veto:true},state(b)); await c.finish(state(b)); },
    'two-valid-same-turn': async c => { c.click('accepted 1',{},state(b)); c.click('accepted 2',{},state(d)); await c.finish(state(d)); },
    'same-value-accepted-after-reset': async c => { await c.prime(); c.reset('reset'); c.click('accepted same owner value',{},state(b)); await c.finish(state(b)); },
    'accepted-cancel-times-two': async c => { c.click('accepted',{},state(b)); c.click('cancel 1',{veto:true,expectedPrevious:state(b)},state(b)); c.click('cancel 2',{veto:true,expectedPrevious:state(b)},state(b)); await c.finish(state(b)); },
    'accepted-cancel-times-three': async c => { c.click('accepted',{},state(b)); for(let i=1;i<=3;i++) c.click(`cancel ${i}`,{veto:true,expectedPrevious:state(b)},state(b)); await c.finish(state(b)); },
    'reset-accepted-cancel-times-two': async c => { await c.prime(); c.reset('reset'); c.click('accepted',{},state(b)); c.click('cancel 1',{veto:true,expectedPrevious:state(b)},state(b)); c.click('cancel 2',{veto:true,expectedPrevious:state(b)},state(b)); await c.finish(state(b)); },
    'accepted-mixed-path-cancel-chain': async c => { c.click('accepted',{},state(b)); const start=paths.indexOf(p); for(let i=0;i<3;i++) c.click(`cancel ${i+1}`,{veto:true,path:paths[(start+i)%3],expectedPrevious:state(b)},state(b)); await c.finish(state(b)); },
    'cancel-then-valid': async c => { await c.prime(); c.click('cancel',{veto:true},state(b)); c.click('valid after cancel',{expectedPrevious:state(b),expectedNext:state(d)},state(d)); await c.finish(state(d)); },
    'accepted-cancel-then-valid': async c => { c.click('accepted',{},state(b)); c.click('cancel',{veto:true},state(b)); c.click('valid after cancel',{expectedPrevious:state(b),expectedNext:state(d)},state(d)); await c.finish(state(d)); },
    'accepted-two-cancel-then-valid': async c => { c.click('accepted',{},state(b)); c.click('cancel 1',{veto:true},state(b)); c.click('cancel 2',{veto:true},state(b)); c.click('valid after two cancels',{expectedPrevious:state(b),expectedNext:state(d)},state(d)); await c.finish(state(d)); },
    'accepted-mixed-path-cancel-chain-then-valid': async c => { c.click('accepted',{},state(b)); const start=paths.indexOf(p); for(let i=0;i<3;i++) c.click(`cancel ${i+1}`,{veto:true,path:paths[(start+i)%3],expectedPrevious:state(b)},state(b)); c.click('valid after mixed cancels',{expectedPrevious:state(b),expectedNext:state(d)},state(d)); await c.finish(state(d)); },
    'reset-cancel-then-valid': async c => { await c.prime(); c.reset('reset'); c.click('cancel',{veto:true},state(d)); c.click('valid after reset and cancel',{expectedNext:state(b)},state(b)); await c.finish(state(b)); },
    'reset-accepted-mixed-path-cancel-chain-then-valid': async c => { await c.prime(); c.reset('reset'); c.click('accepted',{},state(b)); const start=paths.indexOf(p); for(let i=0;i<3;i++) c.click(`cancel ${i+1}`,{veto:true,path:paths[(start+i)%3],expectedPrevious:state(b)},state(b)); c.click('valid after reset and mixed cancels',{expectedPrevious:state(b),expectedNext:state(d)},state(d)); await c.finish(state(d)); },
    'noncancelable-forged-click-cancel': async c => { await c.prime(); c.click('noncancelable forged click',{veto:true,forged:true},{}); c.row.notes.push('Noncancelable native dispatch cannot be prevented, but React synthetic preventDefault still vetoes the component proposal; final owner state must remain unchanged.'); await c.finish(state(b)); },
    'noncancelable-forged-click-cancel-then-valid': async c => { await c.prime(); c.click('noncancelable forged click',{veto:true,forged:true},{}); c.click('valid after forged veto',{expectedPrevious:state(b),expectedNext:state(d)},state(d)); await c.finish(state(d)); },
    'reset-accepted-mixed-path-cancel-chain': async c => { await c.prime(); c.reset('reset'); c.click('accepted',{},state(b)); const start=paths.indexOf(p); for(let i=0;i<3;i++) c.click(`cancel ${i+1}`,{veto:true,path:paths[(start+i)%3],expectedPrevious:state(b)},state(b)); await c.finish(state(b)); },
  };
  for (const [name, body] of Object.entries(cases)) await runCase(target,name,p,d,{},body);
}
async function additional(target,p) {
  await runCase(target,'controlled-flushSync-update-cancel',p,false,{checked:false,defaultChecked:undefined},async c=>{
    c.click('controlled update plus veto',{effectStage:p,update:{checked:true},veto:true},{});
    c.row.notes.push('Immediate checked is a recorded native canceled-activation transient after flushSync; controlled authority is asserted after real timers.');
    await c.finish(state(true));
  });
  await runCase(target,'controlled-flushSync-update-reset-cancel',p,false,{checked:false,defaultChecked:undefined},async c=>{
    c.reset('reset'); c.click('controlled update plus veto',{effectStage:p,update:{checked:true},veto:true},{}); await c.finish(state(true));
  });
  for(const blocked of ['disabled','readonly','fieldset-disabled','fieldset-first-legend']) {
    await runCase(target,blocked,p,false,{},async c=>{
      if(blocked==='disabled') c.props.disabled=true;
      if(blocked==='readonly') c.props.readOnly=true;
      if(blocked.startsWith('fieldset')) { c.fieldset=true; c.inLegend=blocked==='fieldset-first-legend'; }
      c.render();
      c.click('attempt activation',{},state(blocked==='fieldset-first-legend'));
      await c.finish(state(blocked==='fieldset-first-legend'));
    });
  }
  await runCase(target,'unmount-pending-reset-cancel',p,false,{},async c=>{
    await c.prime(); c.reset('reset'); c.click('cancel',{veto:true},state(false));
    const saved=c.input, oldForm=c.form;
    const before=observation(saved,oldForm);
    const firedBefore=timersFiredAfterUnmount;
    c.unmount();
    assert(c.row,'owned scheduled timers cleared synchronously', [...pendingPackageTimers.values()].filter(x=>x.caseId===c.row.id), [], 'cleanup');
    assert(c.row,'package reset listeners removed',registeredResetListeners.size,0,'cleanup');
    await wait();
    assert(c.row,'no package callback runs after unmount',timersFiredAfterUnmount,firedBefore,'cleanup');
    assert(c.row,'detached node checked remains unchanged',saved.checked,before.checked,'cleanup');
    assert(c.row,'detached node indeterminate remains unchanged',saved.indeterminate,before.indeterminate,'cleanup');
    const other=document.createElement('form');document.body.append(other);other.reset();other.remove();await wait();
    assert(c.row,'unrelated reset after unmount schedules no timers',[...pendingPackageTimers.values()].filter(x=>x.caseId===c.row.id),[],'cleanup');
  });
  if(target.kind!=='checkbox') return;
  await runCase(target,'mixed-uncontrolled-reset-cancel',p,false,{defaultIndeterminate:true},async c=>{
    c.click('prime accepted',{},state(true,false));await wait();checkState(c,'settled prime',state(true,false),'settled');
    c.reset('reset');c.click('cancel',{veto:true},{checked:false});await c.finish(state(false,true));
  });
  await runCase(target,'mixed-checked-controlled-reset-cancel',p,false,{checked:true,defaultChecked:undefined,defaultIndeterminate:true},async c=>{
    c.click('prime accepted',{}, {checked:true});await wait();checkState(c,'settled prime',state(true,false),'settled');
    c.reset('reset');c.click('cancel',{veto:true},{});await c.finish(state(true,true));
  });
  await runCase(target,'mixed-indeterminate-controlled-reset-cancel',p,false,{indeterminate:true},async c=>{
    c.click('prime accepted',{}, {checked:true});await wait();checkState(c,'settled prime',state(true,true),'settled');
    c.reset('reset');c.click('cancel',{veto:true},{checked:false});await c.finish(state(false,true));
  });
  await runCase(target,'mixed-flushSync-indeterminate-update-cancel',p,false,{indeterminate:false},async c=>{
    c.click('explicit mixed update plus veto',{effectStage:p,update:{indeterminate:true},veto:true},{});await c.finish(state(false,true));
  });
  await runCase(target,'mixed-independent-checked-update-reset-cancel',p,false,{checked:false,defaultChecked:undefined,defaultIndeterminate:true},async c=>{
    c.click('prime accepted',{}, {checked:false});await wait();checkState(c,'settled prime',state(false,false),'settled');
    c.reset('reset');c.click('update controlled checked plus veto',{effectStage:p,update:{checked:true},veto:true},{});await c.finish(state(true,true));
  });
}
(async()=>{
  for(const target of targets) for(const p of paths) {
    for(const d of [false,true]) await ordering(target,p,d);
    await additional(target,p);
    console.log(`${target.selector} / ${p}: ${rows.length} cases, ${failures.length} failed checks so far`);
  }
  flushSync(()=>root.unmount());
  const finalSha=sha();
  const report={
    title:'Author production/no-act selection reset and cancellation ordering matrix',
    environment:{node:process.version,react:React.version,nodeEnv:process.env.NODE_ENV,jsdom:require(path.join(tc,'jsdom/package.json')).version,noAct:true,realTimers:true,settleMs,browserCount:0,installs:0,sourceChanges:0},
    package:{entry,sha256Before:initialSha,sha256After:finalSha,unchanged:initialSha===finalSha},
    selectors:targets.map(({kind,selector,exported})=>({kind,selector,exported})),
    expectations:[
      'A canceled activation never supersedes an earlier valid reset or accepted activation, including multiple same-turn or mixed-path cancellations.',
      'An accepted activation after a reset is newer intent even if its value equals the component owner value before the reset.',
      'A canceled reset changes neither axis; an uncanceled reset restores mount defaults only on uncontrolled axes; explicitly controlled commits remain authoritative.',
      'Ordinary accepted .click() calls expose correct native checked/FormData immediately. All canceled/readOnly/noncancelable-forged activation post-dispatch checked values are recorded as observations, because the established contract defers native canceled-activation reconciliation to a task; immediate FormData must still agree with actual native state.',
      'Callbacks and ancestors see native state and FormData consistently; own onClick veto prevents semantic callback, details/ancestor veto permits one semantic callback, disabled/fieldset block and readOnly suppress semantic activation.',
      'Reset-interleaved callback previousState is recorded without mandating eager or deferred reset reconciliation. Accepted-then-cancel chains must keep previousState at the last accepted state.',
      'Mixed axes are tested independently; a controlled checked commit must not consume an unrelated pending uncontrolled-indeterminate reset.',
      'Unmount removes pending package real timers and reset listeners; detached input state is untouched by subsequent work.'
    ],
    summary:{cases:rows.length,passed:rows.filter(x=>x.pass).length,failed:rows.filter(x=>!x.pass).length,checks:rows.reduce((n,x)=>n+x.checks.length,0),failedChecks:failures.length,failuresByCategory:failures.reduce((acc,f)=>(acc[f.category]=(acc[f.category]||0)+1,acc),{}),failedCasesByCategory:failures.reduce((acc,f)=>{if(!acc[f.category])acc[f.category]=[];if(!acc[f.category].includes(f.caseId))acc[f.category].push(f.caseId);return acc;},{}),uncaughtErrors:uncaught.length},
    failures,rows,uncaught
  };
  fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({out,...report.summary,failedCasesByCategory:Object.fromEntries(Object.entries(report.summary.failedCasesByCategory).map(([k,v])=>[k,v.length])),packageUnchanged:report.package.unchanged},null,2));
  dom.window.close();
  global.setTimeout=nativeTimeout;global.clearTimeout=nativeClearTimeout;
  process.exitCode=report.summary.failed || uncaught.length || initialSha!==finalSha ? 1 : 0;
})().catch(error=>{console.error(error.stack||error);try{fs.writeFileSync(out,JSON.stringify({fatal:String(error.stack||error),rows,failures},null,2));}catch{}dom.window.close();process.exitCode=2;});
