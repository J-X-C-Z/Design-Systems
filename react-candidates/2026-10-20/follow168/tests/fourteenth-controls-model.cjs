const path = require('path'), fs = require('fs'), assert = require('assert/strict');
const deps = process.env.LOCAL_DEPENDENCIES, R = path.resolve(__dirname, '..');
require(path.join(deps, 'esbuild')).buildSync({ entryPoints: [R + '/src/index.jsx'], outfile: R + '/qa/fourteenth-runtime.cjs', bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic', external: ['react', 'react-dom', 'react/jsx-runtime'] });
const { JSDOM } = require(path.join(deps, 'jsdom'));
const dom = new JSDOM('<div id="root"></div><form id="outside"></form>', { url: 'https://example.invalid/' }), w = dom.window, d = w.document;
Object.assign(global, { window: w, document: d, HTMLElement: w.HTMLElement, HTMLButtonElement: w.HTMLButtonElement, Event: w.Event, IS_REACT_ACT_ENVIRONMENT: true });
Object.defineProperty(global, 'navigator', { value: w.navigator, configurable: true });
const React = require(path.join(deps, 'react')), { createRoot } = require(path.join(deps, 'react-dom/client')), { flushSync } = require(path.join(deps, 'react-dom')), { act } = React, L = require(R + '/qa/fourteenth-runtime.cjs');
const e = React.createElement, root = createRoot(d.querySelector('#root')), checks = [];
const ok = (v, message) => { assert.ok(v, message); checks.push(message); };
const render = async element => act(async () => root.render(e(L.SevenThemeProvider, { theme: 'follow' }, element)));
const alert = () => d.querySelector('#root [role=alert]'), button = action => d.querySelector(`#root [data-action="${action}"]`), progress = () => d.querySelector('#root [role=progressbar]');
const click = async node => act(async () => node.click());
let now = 0, nextTimer = 0, scheduled = 0, cleared = 0;
const timers = new Map(), realSetTimeout = global.setTimeout, realClearTimeout = global.clearTimeout;
global.setTimeout = (callback, delay, ...args) => {
  if (delay !== 100) return realSetTimeout(callback, delay, ...args);
  const id = ++nextTimer; scheduled++; timers.set(id, { callback: () => callback(...args), due: now + delay }); return { testTimer: id };
};
global.clearTimeout = id => { if (id?.testTimer) { if (timers.delete(id.testTimer)) cleared++; } else realClearTimeout(id); };
const advance = async ms => { now += ms; await act(async () => { for (const [id, timer] of [...timers]) if (timer.due <= now) { timers.delete(id); timer.callback(); } }); };

(async () => {
  await render(e(L.Alerts07));
  ok(alert().dataset.componentId === 'alerts-07' && d.querySelectorAll('[data-component-id="alerts-07"]').length === 1, 'source alerts-07 counted once');
  ok(alert().querySelector('[data-slot=alert-title]').textContent === "Uploading your 'watermelon.png'", 'upload exact source title');
  ok(alert().querySelector('[data-slot=alert-description]').textContent === 'Please wait While we upload your image.', 'upload exact source description capitalization');
  ok([...alert().querySelectorAll('button')].map(n => n.textContent).join('|') === 'Cancel|Upload another|Close', 'upload source actions and Close accessible text');
  ok(!button('cancel').disabled && button('upload-another').disabled && !button('close').disabled, 'upload source disabled defaults');
  ok([...alert().querySelectorAll('button')].every(n => !n.hasAttribute('type') && n.type === 'submit'), 'all source upload buttons omit type and remain native submit');
  ok(progress().getAttribute('aria-label') === 'Upload Progress' && progress().getAttribute('aria-valuemin') === '0' && progress().getAttribute('aria-valuemax') === '100' && progress().getAttribute('aria-valuenow') === '0', 'source progress label with repaired numeric 0 of 100');
  ok(alert().querySelector('[data-slot=progress-indicator]').style.transform === 'translateX(-100%)', 'progress visual begins at zero');
  ok(timers.size === 1, 'one bounded source mount timer');
  await advance(99); ok(progress().getAttribute('aria-valuenow') === '0', 'source timer does not advance before 100ms');
  await advance(1); ok(progress().getAttribute('aria-valuenow') === '50' && timers.size === 0, 'source timer advances to 50 exactly once at 100ms');
  await advance(1000); ok(progress().getAttribute('aria-valuenow') === '50' && timers.size === 0, 'source demo never invents completion');
  await click(button('cancel')); ok(alert() && progress().getAttribute('aria-valuenow') === '50', 'Cancel is inert for local state');
  await click(button('upload-another')); ok(alert() && progress().getAttribute('aria-valuenow') === '50', 'disabled Upload another remains inert');
  const initial = alert(), close = button('close'); await click(close); ok(!alert() && !initial.isConnected, 'uncontrolled Close removes alert');

  await render(e(L.Alerts08));
  ok(alert().dataset.componentId === 'alerts-08', 'source alerts-08 real ID');
  ok(alert().querySelector('[data-slot=alert-title]').textContent === 'Update ready to install', 'update exact source title');
  ok(alert().querySelector('[data-slot=alert-description]').textContent === 'A new version is available with performance improvements and a refreshed dashboard experience.', 'update exact source description');
  ok([...alert().querySelectorAll('button')].map(n => n.textContent).join('|') === 'Later|Update now|Close' && !progress(), 'update source actions no invented progress');
  ok([...alert().querySelectorAll('button')].every(n => !n.disabled && !n.hasAttribute('type') && n.type === 'submit'), 'update source buttons default native submit');
  await click(button('later')); await click(button('update-now')); ok(alert(), 'Later and Update now are inert for local state');
  await click(button('close')); ok(!alert(), 'update Close removes alert');

  for (const C of [L.Alerts07, L.Alerts08]) {
    const isUpload = C === L.Alerts07, action = isUpload ? 'cancel' : 'later', other = isUpload ? 'upload-another' : 'update-now';
    const actionProp = isUpload ? 'cancelButtonProps' : 'laterButtonProps', otherProp = isUpload ? 'uploadAnotherButtonProps' : 'updateNowButtonProps';
    let submissions = [], requests = [], ref = React.createRef(), closeRef = React.createRef(), actionRef = React.createRef();
    const props = { ref, [actionProp]: { ref: actionRef, name: 'action', value: action }, [otherProp]: { name: 'action', value: other }, closeButtonProps: { ref: closeRef, name: 'action', value: 'close' }, onOpenChange: (next, detail) => { requests.push({ next, detail }); } };
    const form = (extra = {}, attributes = {}) => e('form', { ...attributes, onSubmit: event => { event.preventDefault(); submissions.push({ submitter: event.nativeEvent.submitter, data: [...new w.FormData(event.currentTarget, event.nativeEvent.submitter)], connectedDuringSubmit: !!alert() }); } }, e(C, { ...props, ...extra }));
    await render(form());
    ok(ref.current === alert() && closeRef.current === button('close') && actionRef.current === button(action), `native root and action refs ${action}`);
    let target = button(action); await click(target);
    ok(submissions.length === 1 && submissions[0].submitter === target && JSON.stringify(submissions[0].data) === JSON.stringify([['action', action]]) && alert(), `actual native submitter and FormData ${action}`);
    target = button(other); await click(target);
    ok(submissions.length === (isUpload ? 1 : 2), `disabled versus enabled native action ${other}`);
    target = button('close'); await click(target);
    ok(submissions.at(-1).submitter === target && submissions.at(-1).connectedDuringSubmit && JSON.stringify(submissions.at(-1).data) === JSON.stringify([['action', 'close']]), `Close native submit happens before deferred removal ${action}`);
    ok(!alert() && requests.length === 1 && requests[0].next === false && requests[0].detail.reason === 'close' && requests[0].detail.localOnly && requests[0].detail.button === target && requests[0].detail.event.currentTarget === null, `close detail reports stable button after bubble ${action}`);
    ok(!ref.current && !closeRef.current && !actionRef.current, `close clears native refs ${action}`);

    requests = []; submissions = [];
    await render(form({ key: 'target-veto', closeButtonProps: { onClick: event => event.preventDefault() } }));
    await click(button('close')); ok(alert() && !requests.length && !submissions.length, `native close handler cancellation prevents close and submit ${action}`);
    await render(form({ key: 'ancestor-veto' }, { onClick: event => event.preventDefault() }));
    await click(button('close')); ok(alert() && !requests.length && !submissions.length, `React ancestor bubbling cancellation prevents close and submit ${action}`);
    await render(form({ key: 'capture-veto' }, { onClickCapture: event => event.preventDefault() }));
    await click(button('close')); ok(alert() && !requests.length && !submissions.length, `ancestor capture cancellation prevents close and submit ${action}`);
    await render(form({ key: 'native-veto' }));
    const documentVeto = event => event.preventDefault(); d.addEventListener('click', documentVeto);
    await click(button('close')); d.removeEventListener('click', documentVeto);
    ok(alert() && !requests.length && !submissions.length, `native document bubble cancellation seen after React ${action}`);

    await render(form({ key: 'request-veto', onOpenChange: () => false }));
    await click(button('close')); ok(alert() && submissions.length === 1, `request false veto preserves alert but does not retroactively cancel native submit ${action}`);
    await render(form({ key: 'detail-veto', onOpenChange: (_, detail) => detail.cancel() }));
    await click(button('close')); ok(alert() && submissions.length === 2, `detail cancel veto preserves alert ${action}`);
    await render(form({ key: 'event-veto', onOpenChange: (_, detail) => detail.event.preventDefault() }));
    await click(button('close')); ok(alert() && submissions.length === 3, `deferred event veto preserves alert only ${action}`);

    await render(form({ key: 'type-button', [actionProp]: { type: 'button' }, closeButtonProps: { type: 'button' } }));
    await click(button(action)); await click(button('close'));
    ok(!alert() && submissions.length === 3, `explicit type button opt-out no native submit ${action}`);
    await render(form({ key: 'disabled', disabled: true, [otherProp]: { disabled: false } }));
    await click(button('close')); await click(button(action));
    ok([...alert().querySelectorAll('button')].every(n => n.disabled) && submissions.length === 3, `root disabled gates every action including Close ${action}`);
    await render(form({ key: 'specific-disabled', closeButtonProps: { disabled: true } }));
    await click(button('close')); ok(alert() && button('close').disabled && !button(action).disabled && submissions.length === 3, `per-button disabled independent ${action}`);
    await render(form({ key: 'fieldset-disabled' }, { }));
    await render(e('fieldset', { disabled: true }, e(C, { key: 'fieldset', onOpenChange: () => requests.push('unexpected') })));
    const priorRequests = requests.length; await click(button('close'));
    ok(alert() && requests.length === priorRequests, `native disabled fieldset blocks close ${action}`);

    requests = [];
    await render(e(C, { key: 'controlled', open: true, onOpenChange: value => requests.push(value) }));
    await click(button('close')); ok(alert() && requests.length === 1 && requests[0] === false, `controlled close request leaves owner authoritative ${action}`);
    await render(e(C, { key: 'controlled', open: false })); ok(!alert(), `controlled external false hides ${action}`);
    await render(e(C, { key: 'controlled', open: true })); ok(alert(), `controlled external true reopens ${action}`);
    function Owner() { const [open, setOpen] = React.useState(true); return e(C, { open, onOpenChange: setOpen }); }
    await render(e(Owner)); await click(button('close')); ok(!alert(), `controlled owner accepts close ${action}`);
    await render(e(C, { key: 'default-false', defaultOpen: false })); ok(!alert(), `defaultOpen false starts hidden ${action}`);
    await render(e(C, { key: 'default-false', defaultOpen: true })); ok(!alert(), `later defaultOpen update does not reopen uncontrolled ${action}`);
    await render(e(C, { key: 'root-props', id: 'custom-alert', title: 'native tooltip', 'data-native': 'kept', className: 'custom-class' }));
    ok(alert().id === 'custom-alert' && alert().title === 'native tooltip' && alert().dataset.native === 'kept' && alert().classList.contains('custom-class'), `native root props pass through ${action}`);
    ok(d.getElementById(alert().getAttribute('aria-labelledby'))?.dataset.slot === 'alert-title' && d.getElementById(alert().getAttribute('aria-describedby'))?.dataset.slot === 'alert-description', `alert title description accessible associations ${action}`);
    ok([...alert().querySelectorAll('svg')].every(n => n.getAttribute('aria-hidden') === 'true' && n.getAttribute('focusable') === 'false'), `decorative glyphs hidden from accessibility tree ${action}`);
  }

  let external = [];
  const outside = d.querySelector('#outside'); outside.addEventListener('submit', event => { event.preventDefault(); external.push({ submitter: event.submitter, data: [...new w.FormData(outside, event.submitter)] }); });
  const externalRef = React.createRef();
  await render(e(L.Alerts07, { key: 'external', cancelButtonProps: { ref: externalRef, form: 'outside', name: 'command', value: 'cancel' } }));
  await click(button('cancel')); ok(external.length === 1 && external[0].submitter === externalRef.current && external[0].data[0][1] === 'cancel' && alert(), 'external form association forwards through action props');
  await render(e(L.Alerts07, { key: 'enable-upload', uploadAnotherButtonProps: { disabled: false, form: 'outside', name: 'command', value: 'again' } }));
  await click(button('upload-another')); ok(external.length === 1 && button('upload-another').disabled && alert(), 'even untyped disabled false cannot enable source Upload another');
  await render(e('form', { onReset: () => external.push('reset') }, e('input', { name: 'text', defaultValue: 'original' }), e(L.Alerts08, { laterButtonProps: { type: 'reset' } })));
  const input = d.querySelector('#root input'); input.value = 'dirty'; await click(button('later')); ok(input.value === 'original' && external.at(-1) === 'reset' && alert(), 'native explicit type reset runs form reset and leaves alert visible');

  await render(e(L.Alerts07, { key: 'reopen', open: true }));
  const timerCount = scheduled;
  await advance(100); await render(e(L.Alerts07, { key: 'reopen', open: false })); await render(e(L.Alerts07, { key: 'reopen', open: true }));
  ok(progress().getAttribute('aria-valuenow') === '50' && scheduled === timerCount && timers.size === 0, 'controlled reopen does not restart completed demo timer');
  await render(e(L.Alerts07, { key: 'hidden-mount', open: false })); const hiddenTimer = scheduled; await advance(100); await render(e(L.Alerts07, { key: 'hidden-mount', open: true }));
  ok(progress().getAttribute('aria-valuenow') === '50' && scheduled === hiddenTimer, 'mount timeline continues while source alert hidden');
  for (const value of [0, 0.5, 50, 100]) {
    await render(e(L.Alerts07, { key: 'controlled-progress', progress: value }));
    ok(progress().getAttribute('aria-valuenow') === String(value) && alert().querySelector('[data-slot=progress-indicator]').style.transform === `translateX(-${100 - value}%)`, `controlled numeric progress ${value} visual and accessible value agree`);
  }
  await advance(100); ok(progress().getAttribute('aria-valuenow') === '100', 'demo timer does not overwrite controlled progress');
  await render(e(L.Alerts07, { key: 'controlled-progress' })); ok(progress().getAttribute('aria-valuenow') === '50' && timers.size === 0, 'removing progress override resumes completed demo without restart');
  await render(e(L.Alerts07, { key: 'timer-cleanup' })); const beforeClear = cleared; await render(e('span'));
  ok(timers.size === 0 && cleared === beforeClear + 1, 'unmount clears pending source timer'); await advance(100); ok(!alert(), 'removed timer cannot recreate unmounted alert');
  await render(e(React.StrictMode, null, e(L.Alerts07, { key: 'strict' })));
  ok(timers.size === 1, 'StrictMode effect replay leaves one live timer'); await advance(100); ok(progress().getAttribute('aria-valuenow') === '50' && timers.size === 0, 'StrictMode mount demo settles once');

  let callbacks = 0;
  await render(e(L.Alerts08, { key: 'repeat', onOpenChange: () => callbacks++ }));
  const repeatedClose = button('close'); await act(async () => { repeatedClose.click(); repeatedClose.click(); });
  ok(!alert() && callbacks === 1, 'repeated same-turn close commits once');
  callbacks = 0;
  await render(e('div', { onClick: () => flushSync(() => root.render(e('span', null, 'gone'))) }, e(L.Alerts08, { onOpenChange: () => callbacks++ })));
  await click(button('close')); ok(!alert() && callbacks === 0, 'unmount during bubble cancels pending close notification');
  function DisableDuringBubble() { const [disabled, setDisabled] = React.useState(false); return e('div', { onClick: () => flushSync(() => setDisabled(true)) }, e(L.Alerts08, { disabled, onOpenChange: () => callbacks++ })); }
  await render(e(DisableDuringBubble)); await click(button('close')); ok(alert() && button('close').disabled && callbacks === 0, 'new disabled owner during bubbling supersedes pending close');
  function ReplaceOwnerDuringBubble() { const [open, setOpen] = React.useState(undefined); return e('div', { onClick: () => flushSync(() => setOpen(true)) }, e(L.Alerts08, { open, onOpenChange: () => callbacks++ })); }
  await render(e(ReplaceOwnerDuringBubble)); await click(button('close')); ok(alert() && callbacks === 0, 'new controlled owner during bubbling supersedes pending close');
  await render(e(L.Alerts08, { key: 'callback-unmount', onOpenChange: () => { callbacks++; flushSync(() => root.render(e('span'))); } }));
  await click(button('close')); ok(!alert() && callbacks === 1, 'callback unmount safely prevents stale state update');

  let nativeCleanup = 0;
  await render(e(L.Alerts08, { key: 'callback-ref', laterButtonProps: { ref: node => { ok(node instanceof w.HTMLButtonElement, 'React19 callback ref receives native button'); return () => nativeCleanup++; } } }));
  await render(e('span')); ok(nativeCleanup === 1, 'React19 native button callback ref cleanup preserved');
  await render(e(L.Alerts07, { key: 'ignored-children', children: 'replace title', dangerouslySetInnerHTML: { __html: '<b>bad</b>' }, cancelButtonProps: { children: 'bad', dangerouslySetInnerHTML: { __html: '<b>bad</b>' } } }));
  ok(button('cancel').textContent === 'Cancel' && !alert().querySelector('b') && alert().textContent.includes("Uploading your 'watermelon.png'"), 'unsupported child overrides cannot replace fixed source structure');
  await render(e(React.Fragment, null, e(L.Alerts07), e(L.Alerts07), e(L.Alerts08), e(L.Alerts08)));
  const labelledIds = [...d.querySelectorAll('#root [role=alert]')].flatMap(n => [n.getAttribute('aria-labelledby'), n.getAttribute('aria-describedby')]);
  ok(labelledIds.length === 8 && new Set(labelledIds).size === 8 && labelledIds.every(id => d.getElementById(id)), 'multi-instance title and description IDs unique and resolvable');

  const realError = console.error; console.error = () => {};
  class Boundary extends React.Component { state = { error: null }; static getDerivedStateFromError(error) { return { error }; } render() { return this.state.error ? e('span', { 'data-error': this.state.error.name }) : this.props.children; } }
  try {
    for (const C of [L.Alerts07, L.Alerts08]) {
      await render(e(Boundary, { key: C === L.Alerts07 ? 'bad07' : 'bad08' }, e(C, { open: false, defaultOpen: true })));
      ok(d.querySelector('[data-error="TypeError"]'), 'mutually exclusive open/defaultOpen boundary ' + (C === L.Alerts07 ? '07' : '08'));
    }
    for (const invalid of [-1, 101, NaN, Infinity, '50', null]) {
      await render(e(Boundary, { key: 'bad-progress-' + String(invalid) }, e(L.Alerts07, { progress: invalid })));
      ok(d.querySelector('[data-error="RangeError"]'), 'invalid progress rejected ' + String(invalid));
    }
  } finally { console.error = realError; }
  const css = fs.readFileSync(R + '/src/fourteenth-controls/styles.css', 'utf8');
  ok(css.includes('--follow-orange') && css.includes('border-radius:0') && css.includes('box-shadow:none') && !/cyan|gradient|backdrop-filter|animation:/.test(css), 'Follow-only editorial paper ink orange CSS source audit');
  ok(css.includes('minmax(0,1fr)') && css.includes('flex-wrap:wrap') && css.includes('overflow-wrap:anywhere'), 'narrow layout wraps actions and source copy CSS contract only');
  ok(css.includes('prefers-reduced-motion:reduce') && css.includes('[data-motion=off]') && css.includes('transition:none'), 'progress transition honors both reduced-motion controls');
  await act(async () => root.unmount());
  ok(timers.size === 0 && !externalRef.current, 'final unmount leaves no owned timers or refs');
  fs.writeFileSync(R + '/qa/FOURTEENTH-MODEL.json', JSON.stringify({ kind: 'Real React/JSDOM native alert/form/cancellation/ref model; deterministic source timer; CSS source audit only', passed: checks.length, checks, sourceTimer: { scheduled, cleared, pending: timers.size }, browser: 'not_run', realLayout: 'not_run', assistiveTechnology: 'not_run', network: 'not_used' }, null, 2));
  console.log(checks.length, 'fourteenth model checks');
})().catch(error => { console.error(error); process.exitCode = 1; }).finally(() => { global.setTimeout = realSetTimeout; global.clearTimeout = realClearTimeout; w.close(); });
