const path = require('path'), fs = require('fs'), assert = require('assert/strict');
const deps = process.env.LOCAL_DEPENDENCIES, R = path.resolve(__dirname, '..');
if (!deps) throw Error('Set LOCAL_DEPENDENCIES to the existing design React toolchain node_modules.');
fs.mkdirSync(R + '/qa', { recursive: true });
require(path.join(deps, 'esbuild')).buildSync({ entryPoints: [R + '/src/fifteenth-controls/index.jsx'], outfile: R + '/qa/fifteenth-runtime.cjs', bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic', external: ['react', 'react-dom', 'react/jsx-runtime'] });
const { JSDOM } = require(path.join(deps, 'jsdom'));
const dom = new JSDOM('<div id="root"></div><form id="outside"></form>', { url: 'https://example.invalid/' }), w = dom.window, d = w.document;
Object.assign(global, { window: w, document: d, HTMLElement: w.HTMLElement, HTMLButtonElement: w.HTMLButtonElement, HTMLInputElement: w.HTMLInputElement, Event: w.Event, IS_REACT_ACT_ENVIRONMENT: true });
Object.defineProperty(global, 'navigator', { value: w.navigator, configurable: true });
const React = require(path.join(deps, 'react')), { createRoot } = require(path.join(deps, 'react-dom/client')), { flushSync } = require(path.join(deps, 'react-dom')), { act } = React, L = require(R + '/qa/fifteenth-runtime.cjs');
const e = React.createElement, root = createRoot(d.querySelector('#root')), checks = [];
const ok = (v, message) => { assert.ok(v, message); checks.push(message); };
const render = async element => act(async () => root.render(element));
const click = async node => act(async () => node.click());
// A keyboard gesture originates from the focused input/button; redirects during dispatch remain observable.
const key = async (node, value, options = {}) => act(async () => { node.focus(); node.dispatchEvent(new w.KeyboardEvent('keydown', { key: value, bubbles: true, cancelable: true, ...options })); });
const reset = async node => act(async () => node.reset());
const group = () => d.querySelector('[data-component-id="radio-group-02"]');
const radio = value => group().querySelector(`input[value="${value}"]`);
const selected = () => [...group().querySelectorAll('input:checked')].map(n => n.value).join(',');
const trigger = id => d.querySelector(`button[data-folder-id="${id}"]`);
const content = id => d.getElementById(trigger(id).getAttribute('aria-controls'));
const tree = () => d.querySelector('[data-component-id="collapsible-02"]');
const form = (props = {}, outer = {}) => e('form', { id: 'inner', ...outer }, e(L.RadioGroup02, props));
const fd = node => [...new w.FormData(node)];
const freshRadio = async (props = {}, outer) => render(outer ? outer(e(L.RadioGroup02, { key: ++freshRadio.n, ...props })) : e(L.RadioGroup02, { key: ++freshRadio.n, ...props })); freshRadio.n = 0;
const freshTree = async (props = {}, outer) => render(outer ? outer(e(L.Collapsible02, { key: ++freshTree.n, ...props })) : e(L.Collapsible02, { key: ++freshTree.n, ...props })); freshTree.n = 0;

(async () => {
  await freshRadio();
  ok(group().getAttribute('role') === 'radiogroup' && group().dataset.slot === 'radio-group', 'radio exact source ID and accessible group');
  ok(group().getAttribute('aria-label') === 'Billing plan', 'radio fallback group label');
  ok([...group().querySelectorAll('label')].map(n => n.textContent).join('|') === 'Monthly Plan|Quarterly Plan|Yearly Plan', 'all three exact source plan labels');
  ok([...group().querySelectorAll('input')].map(n => n.value).join('|') === 'monthly|quarterly|yearly', 'all three exact source values and order');
  ok(group().querySelectorAll('input[type=radio]').length === 3 && !group().querySelector('button'), 'actual native radio inputs replace Radix buttons');
  ok(selected() === 'monthly', 'source initial monthly selection');
  ok([...group().querySelectorAll('input')].every(n => !n.hasAttribute('name')), 'omitted source name creates no invented form field');
  ok(radio('monthly').tabIndex === 0 && radio('quarterly').tabIndex === -1 && radio('yearly').tabIndex === -1, 'single selected roving tab stop');
  ok([...group().querySelectorAll('label')].every(n => n.control && n.control.id === n.htmlFor), 'every source label linked to its own radio');
  await click(radio('quarterly')); ok(selected() === 'quarterly', 'native click changes uncontrolled selection exclusively');
  await click(group().querySelector('label[for="' + radio('yearly').id + '"]')); ok(selected() === 'yearly', 'native label activation selects its input');
  ok(radio('yearly').tabIndex === 0 && radio('monthly').tabIndex === -1, 'tab stop follows selection');
  await freshRadio({}, child => e('form', { id: 'form-default' }, child));
  ok(fd(d.querySelector('#form-default')).length === 0, 'source unnamed radios contribute no FormData');
  await freshRadio({ name: 'plan' }, child => e('form', { id: 'form-name' }, child));
  ok(JSON.stringify(fd(d.querySelector('#form-name'))) === JSON.stringify([['plan', 'monthly']]), 'explicit name creates one successful native field');
  await click(radio('yearly')); ok(JSON.stringify(fd(d.querySelector('#form-name'))) === JSON.stringify([['plan', 'yearly']]), 'named selection updates real FormData');
  let calls = [], nativeCalls = [];
  const rootRef = React.createRef(), inputRef = React.createRef(), labelRef = React.createRef();
  await freshRadio({ ref: rootRef, name: 'plans', className: 'custom-group', onValueChange: (value, detail) => calls.push({ value, detail }), itemProps: { quarterly: { ref: inputRef, className: 'custom-input', title: 'Choose quarterly', onClick: event => nativeCalls.push(['click', event.type]), onChange: event => nativeCalls.push(['change', event.type]), onInput: event => nativeCalls.push(['input', event.type]) } }, labelProps: { quarterly: { ref: labelRef, className: 'custom-label', title: 'Quarter label' } } });
  ok(rootRef.current === group() && inputRef.current === radio('quarterly') && labelRef.current.control === inputRef.current, 'root input label refs resolve actual native nodes');
  ok(group().classList.contains('custom-group') && inputRef.current.classList.contains('custom-input') && labelRef.current.classList.contains('custom-label'), 'native classes merged with source styles');
  await click(inputRef.current);
  ok(calls.length === 1 && calls[0].value === 'quarterly' && calls[0].detail.previousValue === 'monthly', 'one proposal with next and prior value');
  ok(calls[0].detail.id === 'radio-group-02' && calls[0].detail.reason === 'select' && calls[0].detail.input === inputRef.current && calls[0].detail.event.currentTarget === null, 'stable radio proposal input and retained event');
  ok(nativeCalls.some(([kind]) => kind === 'click') && nativeCalls.some(([kind]) => kind === 'change') && nativeCalls.some(([kind]) => kind === 'input'), 'native click input change handlers all run');
  await click(inputRef.current); ok(calls.length === 1, 'reselecting checked option emits no duplicate proposal');
  for (const mode of ['return-false', 'cancel', 'event']) {
    await freshRadio({ onValueChange: (_, detail) => mode === 'return-false' ? false : mode === 'cancel' ? detail.cancel() : detail.event.preventDefault() });
    await click(radio('quarterly')); ok(selected() === 'monthly', `radio proposal cancellation ${mode} restores checked DOM`);
  }
  for (const mode of ['item-click', 'item-change', 'label-click', 'root-click', 'parent-click', 'capture-click', 'native-document']) {
    calls = [];
    const props = { onValueChange: value => calls.push(value) };
    if (mode === 'item-click') props.itemProps = { quarterly: { onClick: event => event.preventDefault() } };
    if (mode === 'item-change') props.itemProps = { quarterly: { onChange: event => event.preventDefault() } };
    if (mode === 'label-click') props.labelProps = { quarterly: { onClick: event => event.preventDefault() } };
    if (mode === 'root-click') props.onClick = event => event.preventDefault();
    const outer = child => e('section', { onClick: mode === 'parent-click' ? event => event.preventDefault() : undefined, onClickCapture: mode === 'capture-click' ? event => event.preventDefault() : undefined }, child);
    await freshRadio(props, outer);
    const veto = event => event.preventDefault(); if (mode === 'native-document') d.addEventListener('click', veto);
    await click(mode === 'label-click' ? group().querySelectorAll('label')[1] : radio('quarterly'));
    d.removeEventListener('click', veto);
    ok(selected() === 'monthly' && calls.length === 0, `radio native/ancestor cancellation ${mode}`);
  }
  await freshRadio({ value: 'monthly', onValueChange: value => calls.push(value) }); calls = [];
  await click(radio('quarterly')); ok(calls.join() === 'quarterly' && selected() === 'monthly', 'controlled rejection keeps original native checked value');
  function ControlledRadio() { const [value, setValue] = React.useState('monthly'); return e(L.RadioGroup02, { value, onValueChange: setValue }); }
  await render(e(ControlledRadio)); await click(radio('yearly')); ok(selected() === 'yearly', 'controlled parent acceptance applies new value');
  await freshRadio({ defaultValue: null, required: true }, child => e('form', { id: 'required-form' }, child));
  ok(selected() === '' && group().getAttribute('aria-required') === 'true', 'null selection and required accessible state');
  ok(!d.querySelector('#required-form').checkValidity(), 'JSDOM unnamed required anchor invalid without a selection');
  await click(radio('yearly')); ok(d.querySelector('#required-form').checkValidity(), 'JSDOM unnamed required anchor valid after selecting another option');
  await freshRadio({ defaultValue: null, required: true, name: 'required-plan' }, child => e('form', { id: 'required-form' }, child));
  ok([...group().querySelectorAll('input')].every(n => n.required) && !d.querySelector('#required-form').checkValidity(), 'JSDOM named native required radio group invalid when empty');
  await click(radio('quarterly')); ok(d.querySelector('#required-form').checkValidity(), 'JSDOM named radio group valid after selection');
  await freshRadio({ disabled: true, required: true, defaultValue: null, name: 'disabled-plan' }, child => e('form', { id: 'disabled-form' }, child));
  await click(radio('quarterly'));
  ok(selected() === '' && [...group().querySelectorAll('input')].every(n => n.disabled && n.tabIndex === -1), 'root disabled blocks every option and tab stop');
  ok(fd(d.querySelector('#disabled-form')).length === 0 && d.querySelector('#disabled-form').checkValidity(), 'JSDOM disabled controls omitted from validation and FormData');
  await freshRadio({ name: 'plan' }, child => e('fieldset', { disabled: true }, child)); await click(radio('quarterly'));
  ok(selected() === 'monthly' && radio('quarterly').matches(':disabled'), 'disabled ancestor fieldset blocks native radio activation');
  await freshRadio({ itemProps: { quarterly: { disabled: true } } }); await click(radio('quarterly'));
  ok(selected() === 'monthly' && !radio('yearly').disabled, 'per-option disabled leaves sibling availability');
  await key(radio('monthly'), 'ArrowDown'); ok(selected() === 'yearly' && d.activeElement === radio('yearly'), 'arrow roving skips disabled option and focuses destination');
  await key(radio('yearly'), 'ArrowDown'); ok(selected() === 'monthly', 'arrow roving wraps through enabled options');
  await key(radio('monthly'), 'End'); ok(selected() === 'monthly' && d.activeElement === radio('yearly') && radio('yearly').tabIndex === 0 && radio('monthly').tabIndex === -1, 'End focuses last enabled option without changing selection');
  await key(radio('yearly'), 'Home'); ok(selected() === 'monthly' && d.activeElement === radio('monthly') && radio('monthly').tabIndex === 0, 'Home focuses first enabled option without changing selection');
  await key(radio('monthly'), 'ArrowUp'); ok(selected() === 'yearly', 'ArrowUp moves backwards and wraps');
  await freshRadio({ dir: 'rtl' }); await key(radio('monthly'), 'ArrowRight'); ok(selected() === 'yearly', 'horizontal arrow reverses in explicit RTL ancestor');
  await key(radio('yearly'), 'ArrowLeft'); ok(selected() === 'monthly', 'horizontal opposite RTL arrow returns');
  await freshRadio({ defaultValue: null, onValueChange: (value, detail) => calls.push({ value, detail }) }); calls = [];
  await key(radio('quarterly'), ' '); ok(selected() === 'quarterly' && calls.length === 1 && calls[0].detail.reason === 'keyboard' && calls[0].detail.event.key === ' ', 'Space native activation emits keyboard proposal');
  calls = [];
  await freshRadio({ onValueChange: (value, detail) => calls.push({ value, detail }) });
  await key(radio('monthly'), 'End');
  ok(calls.length === 0 && selected() === 'monthly' && d.activeElement === radio('yearly'), 'Home End movement emits no value proposal');
  await key(radio('yearly'), ' ');
  ok(selected() === 'yearly' && calls.length === 1 && calls[0].detail.reason === 'keyboard', 'Space selects focus-only End destination');
  await key(radio('yearly'), 'Home');
  ok(selected() === 'yearly' && d.activeElement === radio('monthly') && calls.length === 1, 'Home from selected last item changes focus only');
  await key(radio('monthly'), ' ');
  ok(selected() === 'monthly' && calls.length === 2, 'Space selects focus-only Home destination');
  await freshRadio({ value: 'monthly' });
  await key(radio('monthly'), 'ArrowDown');
  ok(selected() === 'monthly' && d.activeElement === radio('quarterly') && radio('quarterly').tabIndex === 0, 'controlled selection rejection retains arrow focus and independent roving tab stop');
  for (const options of [{ altKey: true }, { ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { isComposing: true }, { keyCode: 229 }, { repeat: true }]) {
    await freshRadio(); await key(radio('monthly'), 'ArrowDown', options); ok(selected() === 'monthly', `keyboard modifier IME repeat guard ${JSON.stringify(options)}`);
  }
  await freshRadio(); await key(radio('monthly'), 'Enter'); ok(selected() === 'monthly', 'Enter is not invented radio selection behavior');
  let enterSubmits = 0, enterProposals = 0;
  await freshRadio({ onValueChange: () => enterProposals++ }, child => e('form', { onSubmit: event => { event.preventDefault(); enterSubmits++; } }, child));
  for (const options of [{}, { repeat: true }, { ctrlKey: true }, { altKey: true }, { shiftKey: true }, { metaKey: true }]) {
    const event = new w.KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true, ...options });
    let dispatched; await act(async () => { dispatched = radio('quarterly').dispatchEvent(event); });
    ok(event.defaultPrevented && dispatched === false && selected() === 'monthly' && enterProposals === 0 && enterSubmits === 0, `Enter suppresses default without proposal or observed submit ${JSON.stringify(options)} (trusted native submit unverified)`);
  }
  for (const options of [{ isComposing: true }, { keyCode: 229 }]) {
    const event = new w.KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true, ...options });
    await act(async () => radio('monthly').dispatchEvent(event));
    ok(!event.defaultPrevented && selected() === 'monthly', `composition Enter remains IME-owned ${JSON.stringify(options)}`);
  }
  for (const mode of ['item', 'root', 'parent', 'document', 'proposal']) {
    const props = mode === 'item' ? { itemProps: { monthly: { onKeyDown: event => event.preventDefault() } } } : mode === 'root' ? { onKeyDown: event => event.preventDefault() } : mode === 'proposal' ? { onValueChange: (_, detail) => detail.event.preventDefault() } : {};
    await freshRadio(props, child => e('section', { onKeyDown: mode === 'parent' ? event => event.preventDefault() : undefined }, child));
    const veto = event => event.preventDefault(); if (mode === 'document') d.addEventListener('keydown', veto);
    await key(radio('monthly'), 'ArrowDown'); d.removeEventListener('keydown', veto);
    ok(selected() === 'monthly', `keyboard cancellation honored ${mode}`);
  }
  calls = [];
  await freshRadio({ defaultValue: 'quarterly', name: 'plan', onValueChange: (value, detail) => calls.push({ value, detail }) }, child => e('form', { id: 'reset-form' }, child));
  await click(radio('yearly')); await reset(d.querySelector('#reset-form'));
  ok(selected() === 'quarterly', 'uncontrolled form reset restores mounted default');
  ok(calls.at(-1).value === 'quarterly' && calls.at(-1).detail.reason === 'reset' && calls.at(-1).detail.input === null, 'reset proposal includes native reset event with no input');
  ok(JSON.stringify(fd(d.querySelector('#reset-form'))) === JSON.stringify([['plan', 'quarterly']]), 'reset restores actual FormData');
  calls = [];
  await freshRadio({ value: 'yearly', name: 'plan', onValueChange: value => calls.push(value) }, child => e('form', { id: 'reset-form' }, child));
  await reset(d.querySelector('#reset-form')); ok(selected() === 'yearly' && calls.length === 0, 'controlled native reset retains owner value without implicit monthly proposal');
  await freshRadio({ form: 'outside', defaultValue: 'quarterly', name: 'external-plan' });
  ok(radio('monthly').form === d.querySelector('#outside'), 'native explicit external form ownership');
  await click(radio('yearly')); ok(JSON.stringify(fd(d.querySelector('#outside'))) === JSON.stringify([['external-plan', 'yearly']]), 'external form receives selected named value');
  await reset(d.querySelector('#outside')); ok(selected() === 'quarterly', 'external form reset reaches group');
  for (const mode of ['form', 'document', 'proposal']) {
    await freshRadio({ onValueChange: (_, detail) => { if (mode === 'proposal' && detail.reason === 'reset') return false; } }, child => e('form', { id: 'reset-form', onReset: mode === 'form' ? event => event.preventDefault() : undefined }, child));
    await click(radio('yearly')); const veto = event => event.preventDefault(); if (mode === 'document') d.addEventListener('reset', veto);
    await reset(d.querySelector('#reset-form')); d.removeEventListener('reset', veto);
    ok(selected() === 'yearly', `reset cancellation retains native checked DOM ${mode}`);
  }
  await render(e('form', null, e(L.RadioGroup02, { key: 'first', 'data-instance': 'a' }), e(L.RadioGroup02, { key: 'second', 'data-instance': 'b' })));
  const groups = [...d.querySelectorAll('[role=radiogroup]')], a = groups[0], b = groups[1];
  ok(new Set([...d.querySelectorAll('input')].map(n => n.id)).size === 6, 'multiple radio instances have unique input and label IDs');
  await click(a.querySelector('[value=yearly]'));
  ok(a.querySelector('input:checked').value === 'yearly' && b.querySelector('input:checked').value === 'monthly', 'unnamed instances cannot accidentally collide');
  await reset(d.querySelector('#root form'));
  ok([...d.querySelectorAll('input:checked')].map(n => n.value).join() === 'monthly,monthly', 'multiple unnamed groups reset independently');
  await render(e('form', null, e(L.RadioGroup02, { name: 'one' }), e(L.RadioGroup02, { name: 'two' })));
  await click(d.querySelector('[name=one][value=yearly]'));
  ok(JSON.stringify(fd(d.querySelector('#root form'))) === JSON.stringify([['one', 'yearly'], ['two', 'monthly']]), 'distinct explicit names isolate native groups');
  await render(e(L.RadioGroup02, { key: 'dynamic', itemProps: { monthly: { disabled: false } } }));
  await render(e(L.RadioGroup02, { key: 'dynamic', itemProps: { monthly: { disabled: true } } }));
  ok(radio('monthly').disabled && radio('quarterly').tabIndex === 0 && selected() === 'monthly', 'dynamic selected-disabled keeps value but moves available tab stop');
  await key(radio('quarterly'), 'End'); ok(selected() === 'monthly' && d.activeElement === radio('yearly'), 'Home End focus-only behavior survives dynamic disabling');
  await key(radio('yearly'), ' '); ok(selected() === 'yearly', 'Space selects the focused enabled option after dynamic disabling');
  await freshRadio({ onClick: () => flushSync(() => root.render(e(L.RadioGroup02, { value: 'monthly', disabled: true }))) });
  await click(radio('quarterly')); ok(selected() === 'monthly' && radio('quarterly').disabled, 'mid-event owner/disabled change invalidates queued radio proposal');
  await freshRadio({ onClick: () => flushSync(() => root.render(null)), onValueChange: () => calls.push('unexpected') }); calls = [];
  await click(radio('quarterly')); ok(!group() && calls.length === 0, 'unmount during bubbling cancels queued radio proposal');

  await freshTree();
  ok(tree().dataset.componentId === 'collapsible-02' && !tree().querySelector('[role=tree]'), 'source tree ID uses disclosure semantics without fake ARIA tree');
  ok([...tree().querySelectorAll('button')].map(n => n.textContent).join('|') === 'src|content|styles', 'source root folder order exactly preserved');
  ok([...tree().querySelectorAll('[data-file-path]')].map(n => n.textContent).join('|') === 'site.config.ts', 'source only root file visible initially');
  ok([...tree().querySelectorAll('button')].every(n => n.type === 'button' && n.getAttribute('aria-expanded') === 'false'), 'all source folders initially closed and triggers explicitly type button');
  ok(content('src').hidden && !content('src').hasChildNodes() && !trigger('src/sections'), 'closed parent content hidden and all descendants unmounted');
  await click(trigger('src'));
  ok(trigger('src').getAttribute('aria-expanded') === 'true' && !content('src').hidden, 'src opens its own accessible content');
  ok(trigger('src/sections') && trigger('src/sections').getAttribute('aria-expanded') === 'false', 'nested sections remains independently closed');
  ok([...tree().querySelectorAll('[data-file-path]')].map(n => n.textContent).join('|') === 'layout.tsx|site.config.ts', 'source layout file appears inside src');
  await click(trigger('src/sections'));
  ok([...tree().querySelectorAll('[data-file-path]')].map(n => n.textContent).join('|') === 'hero.tsx|features.tsx|pricing.tsx|layout.tsx|site.config.ts', 'all three sections source filenames and order preserved');
  await click(trigger('content')); await click(trigger('styles'));
  ok([...tree().querySelectorAll('[data-file-path]')].map(n => n.textContent).join('|') === 'hero.tsx|features.tsx|pricing.tsx|layout.tsx|copy.md|tokens.css|site.config.ts', 'complete seven-file static source hierarchy preserved');
  ok(tree().querySelectorAll('button').length === 4 && tree().querySelectorAll('svg').length === 15, 'four folders with original folder chevron and file SVGs');
  ok(!tree().querySelector('a,input') && [...tree().querySelectorAll('svg')].every(n => n.getAttribute('aria-hidden') === 'true'), 'static files never navigate and decoration excluded from accessible names');
  const previousNested = trigger('src/sections'); await click(trigger('src'));
  ok(!previousNested.isConnected && !trigger('src/sections'), 'closing src actually unmounts nested sections button');
  ok(trigger('content').getAttribute('aria-expanded') === 'true' && trigger('styles').getAttribute('aria-expanded') === 'true', 'root siblings stay independently open');
  await click(trigger('src')); ok(trigger('src/sections').getAttribute('aria-expanded') === 'false', 'uncontrolled nested sections resets on parent reopen');
  await freshTree({ defaultExpanded: ['src/sections'] }); ok(!trigger('src/sections') && trigger('src').getAttribute('aria-expanded') === 'false', 'hidden nested default never forces parent open');
  await click(trigger('src')); ok(trigger('src/sections').getAttribute('aria-expanded') === 'true', 'explicit nested default applied on first mount');
  await click(trigger('src/sections')); await click(trigger('src')); await click(trigger('src'));
  ok(trigger('src/sections').getAttribute('aria-expanded') === 'true', 'nested remount restores explicit default rather than discarded local state');
  calls = [];
  const treeRef = React.createRef(), buttonRef = React.createRef();
  await freshTree({ ref: treeRef, className: 'custom-tree', triggerProps: { src: { ref: buttonRef, title: 'Source folder', className: 'custom-trigger' } }, onExpandedChange: (next, detail) => calls.push({ next, detail }) });
  ok(treeRef.current === tree() && buttonRef.current === trigger('src'), 'tree root and native trigger refs resolve');
  ok(tree().classList.contains('custom-tree') && trigger('src').classList.contains('custom-trigger') && trigger('src').title === 'Source folder', 'tree native classes and title forwarded');
  const srcButton = trigger('src'); await click(srcButton);
  ok(calls.length === 1 && calls[0].next.join() === 'src' && calls[0].detail.previousExpanded.length === 0, 'tree opening proposal contains canonical full expansion snapshot');
  ok(calls[0].detail.id === 'collapsible-02' && calls[0].detail.folderId === 'src' && calls[0].detail.open && calls[0].detail.button === srcButton && calls[0].detail.event.currentTarget === null, 'tree proposal retains stable trigger with source ID');
  await click(trigger('src/sections')); await click(trigger('src'));
  ok(calls.at(-1).next.length === 0 && calls.at(-1).detail.previousExpanded.join() === 'src,src/sections', 'uncontrolled parent close removes nested expanded ID atomically');
  for (const mode of ['return-false', 'cancel', 'event', 'trigger', 'root', 'ancestor', 'capture', 'document']) {
    calls = [];
    const props = { onExpandedChange: (next, detail) => { calls.push(next); if (mode === 'return-false') return false; if (mode === 'cancel') detail.cancel(); if (mode === 'event') detail.event.preventDefault(); } };
    if (mode === 'trigger') props.triggerProps = { src: { onClick: event => event.preventDefault() } };
    if (mode === 'root') props.onClick = event => event.preventDefault();
    await freshTree(props, child => e('section', { onClick: mode === 'ancestor' ? event => event.preventDefault() : undefined, onClickCapture: mode === 'capture' ? event => event.preventDefault() : undefined }, child));
    const veto = event => event.preventDefault(); if (mode === 'document') d.addEventListener('click', veto);
    await click(trigger('src')); d.removeEventListener('click', veto);
    ok(trigger('src').getAttribute('aria-expanded') === 'false' && !trigger('src/sections'), `tree cancellation preserves closed descendants ${mode}`);
    if (['trigger', 'root', 'ancestor', 'capture', 'document'].includes(mode)) ok(!calls.length, `tree canceled activation emits no proposal ${mode}`);
  }
  await freshTree({ expanded: [], onExpandedChange: next => calls.push(next) }); calls = [];
  await click(trigger('src')); ok(calls.length === 1 && calls[0].join() === 'src' && trigger('src').getAttribute('aria-expanded') === 'false', 'controlled tree rejects proposal without parent update');
  function ControlledTree() { const [expanded, setExpanded] = React.useState(['src', 'src/sections']); return e(L.Collapsible02, { expanded, onExpandedChange: setExpanded }); }
  await render(e(ControlledTree)); await click(trigger('src')); ok(!trigger('src/sections'), 'controlled parent close still unmounts descendants');
  await click(trigger('src')); ok(trigger('src/sections').getAttribute('aria-expanded') === 'true', 'explicit controlled expansion state retains nested choice across parent reopen');
  await freshTree({ disabled: true, triggerProps: { src: { disabled: false } } }); await click(trigger('src'));
  ok([...tree().querySelectorAll('button')].every(n => n.disabled) && !trigger('src/sections'), 'root tree disabled dominates per-trigger false');
  await freshTree({ triggerProps: { src: { disabled: true } } }); await click(trigger('src')); await click(trigger('content'));
  ok(trigger('src').getAttribute('aria-expanded') === 'false' && trigger('content').getAttribute('aria-expanded') === 'true', 'per-folder disabling leaves siblings interactive');
  await freshTree({}, child => e('fieldset', { disabled: true }, child)); await click(trigger('src'));
  ok(trigger('src').getAttribute('aria-expanded') === 'false' && trigger('src').matches(':disabled'), 'native disabled fieldset blocks disclosure activation');
  let submitCount = 0;
  await freshTree({}, child => e('form', { id: 'tree-form', onSubmit: event => { event.preventDefault(); submitCount++; } }, child));
  await click(trigger('src')); await reset(d.querySelector('#tree-form'));
  ok(submitCount === 0 && trigger('src').getAttribute('aria-expanded') === 'true', 'tree triggers never submit and form reset does not reset non-form disclosure');
  await render(e('section', null, e(L.Collapsible02, { defaultExpanded: ['src'] }), e(L.Collapsible02, { defaultExpanded: ['src'] })));
  const controls = [...d.querySelectorAll('button[aria-controls]')].map(n => n.getAttribute('aria-controls'));
  ok(new Set(controls).size === controls.length && controls.every(id => d.getElementById(id)), 'multiple tree instances have unique valid content IDs');
  const trees = [...d.querySelectorAll('[data-component-id="collapsible-02"]')]; await click(trees[0].querySelector('button[data-folder-id="content"]'));
  ok(trees[0].querySelector('button[data-folder-id="content"]').getAttribute('aria-expanded') === 'true' && trees[1].querySelector('button[data-folder-id="content"]').getAttribute('aria-expanded') === 'false', 'multiple tree expansion states remain independent');
  await freshTree({ onClick: () => flushSync(() => root.render(e(L.Collapsible02, { expanded: [], disabled: true }))), onExpandedChange: () => calls.push('unexpected') }); calls = [];
  await click(trigger('src')); ok(!trigger('src/sections') && !calls.length && trigger('src').disabled, 'mid-event owner disabled change cancels queued tree proposal');
  await freshTree({ onClick: () => flushSync(() => root.render(null)), onExpandedChange: () => calls.push('unexpected') });
  await click(trigger('src')); ok(!tree() && !calls.length, 'unmount during bubbling cancels queued tree proposal');

  let refMounts = 0, refCleanups = 0, refNulls = 0;
  const cleanupRef = node => { if (node) { refMounts++; return () => { refCleanups++; }; } refNulls++; };
  await freshRadio({ itemProps: { monthly: { ref: cleanupRef } } });
  ok(refMounts === 1 && refCleanups === 0, 'React 19 input callback ref attaches once');
  await click(radio('quarterly'));
  ok(refMounts === 1 && refCleanups === 0, 'stable input callback ref does not detach on ordinary selection render');
  await render(null);
  ok(refCleanups === 1 && refNulls === 0, 'React 19 input callback cleanup returned to React and invoked exactly once');
  let oldRefCleared = false, replacementAttached = false;
  const oldRef = node => { if (node) return () => { oldRefCleared = true; }; };
  await render(e(L.RadioGroup02, { key: 'ref-change', itemProps: { monthly: { ref: oldRef } } }));
  await render(e(L.RadioGroup02, { key: 'ref-change', itemProps: { monthly: { ref: node => { replacementAttached = !!node; } } } }));
  ok(oldRefCleared && replacementAttached, 'changing input ref cleans previous callback before installing replacement');
  await render(null); ok(!replacementAttached, 'legacy callback ref receives null when no cleanup is returned');
  for (const name of [undefined, 'disabled-selected']) {
    await freshRadio({ name, required: true, itemProps: { monthly: { disabled: true } } }, child => e('form', { id: 'selected-disabled-form' }, child));
    ok(selected() === 'monthly' && radio('monthly').disabled, `selected disabled option is not silently cleared (${name ?? 'unnamed'})`);
    ok(fd(d.querySelector('#selected-disabled-form')).length === 0, `selected disabled option contributes no FormData (${name ?? 'unnamed'})`);
    ok(d.querySelector('#selected-disabled-form').checkValidity(), `JSDOM required selected-disabled boundary remains valid (${name ?? 'unnamed'}), no browser equivalence claim`);
  }
  await freshRadio({ defaultValue: null, required: true, itemProps: { monthly: { disabled: true } } }, child => e('form', { id: 'empty-required-form' }, child));
  ok(radio('quarterly').required && !radio('monthly').required && !d.querySelector('#empty-required-form').checkValidity(), 'unnamed empty required anchor skips disabled first input');
  await click(radio('yearly')); ok(d.querySelector('#empty-required-form').checkValidity(), 'unnamed enabled choice satisfies shifted required anchor');
  await freshRadio({ value: null, required: true }, child => e('form', { id: 'null-reset-form' }, child));
  await reset(d.querySelector('#null-reset-form'));
  ok(selected() === '' && !d.querySelector('#null-reset-form').checkValidity(), 'controlled null survives reset without implicit mounted monthly value');
  let observedInput = false;
  await freshRadio({ itemProps: { quarterly: { onInput: event => { observedInput = true; event.preventDefault(); } } } });
  await click(radio('quarterly'));
  ok(observedInput && selected() === 'quarterly', 'noncancelable native input is observational; onValueChange is the state veto');
  await freshRadio({ onChange: event => event.preventDefault() }); await click(radio('quarterly'));
  ok(selected() === 'monthly', 'ancestor React onChange cancellation reaches underlying activation click');
  await freshRadio({ 'aria-labelledby': 'billing-heading' });
  ok(group().getAttribute('aria-labelledby') === 'billing-heading' && !group().hasAttribute('aria-label'), 'consumer labelledby replaces fallback accessible group label');
  await freshRadio({ defaultValue: 'quarterly' });
  const priorMountedKey = freshRadio.n;
  await render(e('form', { id: 'mounted-default' }, e(L.RadioGroup02, { key: priorMountedKey, defaultValue: 'quarterly' })));
  await click(radio('yearly'));
  await render(e('form', { id: 'mounted-default' }, e(L.RadioGroup02, { key: priorMountedKey, defaultValue: 'monthly' })));
  await reset(d.querySelector('#mounted-default'));
  ok(selected() === 'quarterly', 'uncontrolled reset uses mounted default and ignores subsequent defaultValue prop edits');
  calls = [];
  await freshTree({ onExpandedChange: next => calls.push(next) });
  await click(trigger('content')); await click(trigger('content')); await click(trigger('content'));
  ok(trigger('content').getAttribute('aria-expanded') === 'true' && calls.length === 3 && calls[1].length === 0, 'repeated complete disclosure activations alternate without duplicate callbacks');
  await render(e(L.Collapsible02, { key: 'dynamic-tree', defaultExpanded: ['src'] }));
  await render(e(L.Collapsible02, { key: 'dynamic-tree', defaultExpanded: ['src'], triggerProps: { 'src/sections': { disabled: true } } }));
  await click(trigger('src/sections'));
  ok(trigger('src/sections').disabled && trigger('src/sections').getAttribute('aria-expanded') === 'false', 'dynamically disabled mounted nested folder cannot activate');
  await freshTree({ defaultExpanded: ['styles', 'src', 'src', 'content'], onExpandedChange: next => calls.push(next) }); calls = [];
  await click(trigger('src/sections'));
  ok(calls[0].join() === 'src,src/sections,content,styles', 'expansion proposals canonicalize duplicates and preserve source folder order');

  // Native reset and later refused choices must retain their actual dispatch order.
  for (const mode of ['proposal', 'false', 'event', 'item', 'root', 'ancestor', 'capture', 'document']) {
    let cancelSelection = false; const requests = [];
    await freshRadio({ name: 'race-plan', onValueChange: (next, detail) => {
      requests.push({ next, reason: detail.reason, previous: detail.previousValue });
      if (cancelSelection && detail.reason !== 'reset') {
        if (mode === 'proposal') detail.cancel();
        if (mode === 'false') return false;
        if (mode === 'event') detail.event.preventDefault();
      }
    }, itemProps: { quarterly: { onClick: event => { if (cancelSelection && mode === 'item') event.preventDefault(); } } },
      onClick: event => { if (cancelSelection && mode === 'root') event.preventDefault(); }
    }, child => e('form', { id: 'race-form', onClick: event => { if (cancelSelection && mode === 'ancestor') event.preventDefault(); }, onClickCapture: event => { if (cancelSelection && mode === 'capture') event.preventDefault(); } }, child));
    await click(radio('yearly')); cancelSelection = true; requests.length = 0;
    const veto = event => { if (event.target.closest?.('#race-form') && event.target.type === 'radio') event.preventDefault(); };
    if (mode === 'document') d.addEventListener('click', veto);
    await act(async () => { d.querySelector('#race-form').reset(); radio('quarterly').click(); });
    d.removeEventListener('click', veto);
    ok(selected() === 'monthly' && requests[0]?.reason === 'reset', `same-turn allowed reset survives later canceled selection (${mode})`);
    if (['proposal', 'false', 'event'].includes(mode)) ok(requests.at(-1).previous === 'monthly', `same-turn later proposal observes accepted reset rather than stale render (${mode})`);
  }
  const prepareRace = async (onValueChange) => {
    await freshRadio({ name: 'race-plan', onValueChange }, child => e('form', { id: 'race-form' }, child));
    await click(radio('yearly'));
  };
  await prepareRace(); await act(async () => { d.querySelector('#race-form').reset(); radio('quarterly').click(); });
  ok(selected() === 'quarterly', 'same-turn allowed reset then accepted selection keeps later selection');
  await prepareRace(); await act(async () => { radio('quarterly').click(); d.querySelector('#race-form').reset(); });
  ok(selected() === 'monthly', 'same-turn accepted selection then allowed reset keeps later reset');
  await prepareRace((_, detail) => { if (detail.reason === 'reset') detail.cancel(); });
  await act(async () => { radio('quarterly').click(); d.querySelector('#race-form').reset(); });
  ok(selected() === 'quarterly', 'later canceled reset cannot erase earlier accepted selection');
  await prepareRace(); await act(async () => { radio('yearly').focus(); radio('yearly').dispatchEvent(new w.KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true })); d.querySelector('#race-form').reset(); });
  ok(selected() === 'monthly', 'keyboard-generated delayed click preserves original order before later reset');
  await prepareRace(); await act(async () => { radio('monthly').focus(); d.querySelector('#race-form').reset(); radio('monthly').dispatchEvent(new w.KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true })); });
  ok(selected() === 'quarterly', 'reset before keyboard selection lets later keyboard choice win');
  let replaceOwner;
  function RaceOwnerSwap() {
    const [value, setValue] = React.useState(undefined); replaceOwner = setValue;
    return e('form', { id: 'race-form' }, e(L.RadioGroup02, { value }));
  }
  await render(e(RaceOwnerSwap)); await click(radio('yearly'));
  await act(async () => { d.querySelector('#race-form').reset(); flushSync(() => replaceOwner('quarterly')); });
  ok(selected() === 'quarterly', 'new explicit controlled owner invalidates older queued uncontrolled reset');

  // Runtime contract rejection is tested through SSR, without React recovery logs.
  const { renderToStaticMarkup } = require(path.join(deps, 'react-dom/server'));
  for (const [C, props, pattern, label] of [
    [L.RadioGroup02, { value: 'monthly', defaultValue: 'yearly' }, /mutually exclusive/, 'radio mixed ownership'],
    [L.RadioGroup02, { value: 'invalid' }, /value must/, 'radio invalid controlled value'],
    [L.RadioGroup02, { defaultValue: 'invalid' }, /value must/, 'radio invalid default value'],
    [L.Collapsible02, { expanded: [], defaultExpanded: [] }, /mutually exclusive/, 'tree mixed ownership'],
    [L.Collapsible02, { expanded: ['unknown'] }, /expanded IDs/, 'tree unknown controlled folder'],
    [L.Collapsible02, { defaultExpanded: ['unknown'] }, /expanded IDs/, 'tree unknown default folder']
  ]) { assert.throws(() => renderToStaticMarkup(e(C, props)), pattern); checks.push(`runtime rejects ${label}`); }
  await freshRadio({ children: e('button', null, 'injected'), dangerouslySetInnerHTML: { __html: '<a>injected</a>' }, itemProps: { monthly: { type: 'text', value: 'changed', name: 'injected', checked: false, id: 'broken', form: 'outside', tabIndex: 9 } }, labelProps: { monthly: { htmlFor: 'broken', children: 'Changed' } } });
  ok(radio('monthly').type === 'radio' && radio('monthly').checked && !radio('monthly').hasAttribute('name') && radio('monthly').id !== 'broken' && radio('monthly').tabIndex === 0 && !radio('monthly').hasAttribute('form'), 'runtime strips protected native radio ownership overrides');
  ok(!group().querySelector('a,button') && group().querySelector('label').textContent === 'Monthly Plan', 'runtime preserves source radio labels and children');
  await freshTree({ children: e('a', null, 'injected'), dangerouslySetInnerHTML: { __html: '<a>injected</a>' }, triggerProps: { src: { type: 'submit', 'aria-expanded': true, 'aria-controls': 'broken', children: 'changed' } } });
  ok(trigger('src').type === 'button' && trigger('src').getAttribute('aria-expanded') === 'false' && trigger('src').getAttribute('aria-controls') !== 'broken' && trigger('src').textContent === 'src', 'runtime preserves source trigger type ARIA and child content');
  ok(!tree().querySelector('a'), 'runtime strips root injected HTML and children');
  const css = fs.readFileSync(R + '/src/fifteenth-controls/styles.css', 'utf8');
  ok(css.includes('border:1px dashed') && css.includes('border-radius:50%'), 'style retains dashed circular source radio outline');
  ok(css.includes('var(--follow-orange,#f4793a)') && css.includes('var(--ds-surface)') && css.includes('var(--ds-text)'), 'Follow paper ink orange token styling');
  ok(css.includes('[hidden]{display:none}') && css.includes(':focus-visible') && css.includes('prefers-reduced-motion') && css.includes('forced-colors:active'), 'style includes hidden content visible focus reduced motion and forced-color support');
  await act(async () => root.unmount());
  // Independent production bundle, evaluated in its own window without act or
  // global React test flags. Fixed 35ms sleeps masked React scheduling behavior in
  // the full published preview; these assertions wait for the actual contract.
  require(path.join(deps, 'esbuild')).buildSync({
    stdin: { contents: `
      import React, { useState } from 'react';
      import { createRoot } from 'react-dom/client';
      import { flushSync } from 'react-dom';
      import { RadioGroup02, Collapsible02 } from './src/fifteenth-controls/index.jsx';
      window.follow15Events = []; window.follow15RaceEvents = []; window.follow15RaceMode = 'none';
      function App() {
        const [value, setValue] = useState('monthly'), [reject, setReject] = useState(false), [show, setShow] = useState(true);
        const [folders, setFolders] = useState([]), [raceValue, setRaceValue] = useState(undefined), [raceReport, setRaceReport] = useState('monthly');
        window.follow15ReplaceOwner = value => flushSync(() => setRaceValue(value));
        return <><button id="reject" type="button" aria-pressed={reject} onClick={() => setReject(v => !v)}>Reject</button>
          <button id="mount" type="button" aria-pressed={show} onClick={() => setShow(v => !v)}>Mount</button>
          <form id="controlled-form" onSubmit={event => { event.preventDefault(); window.follow15Events.push({type:'submit'}); }}>
            {show && <><RadioGroup02 name="plan" value={value} onValueChange={(next, detail) => {
              window.follow15Events.push({type:'radio', next, reason:detail.reason}); if (reject) return false; setValue(next);
            }} /><Collapsible02 onExpandedChange={next => {
              window.follow15Events.push({type:'folders', next}); if (reject) return false; setFolders(next);
            }} /></>}
            <button type="reset" id="controlled-reset">Reset</button><output id="controlled-output">{value}</output>
            <output id="folder-output">{folders.join(',')}</output>
          </form>
          <form id="race-form" onClick={event => { if (window.follow15RaceMode === 'ancestor') event.preventDefault(); }}
            onClickCapture={event => { if (window.follow15RaceMode === 'capture') event.preventDefault(); }}>
            <RadioGroup02 name="race" value={raceValue} onValueChange={(next, detail) => {
              window.follow15RaceEvents.push({next, reason:detail.reason, previous:detail.previousValue});
              const mode = window.follow15RaceMode;
              if (detail.reason !== 'reset') {
                if (mode === 'proposal') { detail.cancel(); return; }
                if (mode === 'false') return false;
                if (mode === 'event') { detail.event.preventDefault(); return; }
              }
              if (detail.reason === 'reset' && mode === 'reset-veto') return false;
              setRaceReport(next);
            }} itemProps={{quarterly:{onClick:event => { if (window.follow15RaceMode === 'item') event.preventDefault(); }}}} />
            <output id="race-output">{raceReport}</output>
          </form>
          <form id="uncontrolled-form"><RadioGroup02 defaultValue="quarterly" name="independent" />
            <button id="uncontrolled-reset" type="reset">Reset independent</button></form>
        </>;
      }
      createRoot(document.getElementById('root')).render(<App />);
    `, resolveDir: R, sourcefile: 'fifteenth-no-act-entry.jsx', loader: 'jsx' },
    outfile: R + '/qa/fifteenth-no-act-runtime.js', bundle: true, platform: 'browser', format: 'iife', jsx: 'automatic', nodePaths: [deps],
    define: { 'process.env.NODE_ENV': '"production"' }
  });
  const live = new JSDOM('<div id="root"></div>', { runScripts: 'outside-only', pretendToBeVisual: true, url: 'https://example.invalid/' }), lw = live.window, ld = lw.document;
  const observedWaits = [], beforeNoAct = checks.length;
  const until = async (predicate, label) => {
    const start = Date.now();
    // A native reset/activation can transiently satisfy checked before React's
    // deferred restoration and commit. Observe after dispatch has drained, and
    // require the contract to remain true across another scheduler opportunity.
    for (;;) {
      await new Promise(resolve => setTimeout(resolve, 10));
      if (predicate()) {
        await new Promise(resolve => setTimeout(resolve, 10));
        if (predicate()) break;
      }
      if (Date.now() - start >= 2000) throw Error(`No-act production contract timed out: ${label}`);
    }
    observedWaits.push({ label, elapsedMs: Date.now() - start });
  };
  try {
    lw.eval(fs.readFileSync(R + '/qa/fifteenth-no-act-runtime.js', 'utf8'));
    const lr = value => ld.querySelector(`#controlled-form input[value="${value}"]`);
    const valueIs = value => lr(value)?.checked && ld.querySelector('#controlled-output')?.textContent === value;
    const lf = name => ld.querySelector(`#controlled-form button[data-folder-id="${name}"]`);
    const nativeKey = (node, key) => { node.focus(); const event = new lw.KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }); node.dispatchEvent(event); return event; };
    await until(() => valueIs('monthly'), 'initial controlled mount');
    ok(!lw.IS_REACT_ACT_ENVIRONMENT && valueIs('monthly'), 'production bundle mounts without React act environment');
    lr('yearly').click(); await until(() => valueIs('yearly'), 'controlled click accepted');
    ok(valueIs('yearly'), 'no-act native click eventually commits controlled DOM and visible output');
    lr('monthly').focus(); nativeKey(lr('monthly'), 'ArrowDown');
    await until(() => valueIs('quarterly'), 'arrow proposal plus parent render');
    ok(valueIs('quarterly') && ld.activeElement === lr('quarterly') && lr('quarterly').tabIndex === 0, 'no-act focus rerender and arrow proposal commit coherently');
    ok(JSON.stringify([...new lw.FormData(ld.querySelector('#controlled-form'))]) === JSON.stringify([['plan', 'quarterly']]), 'no-act committed selection matches real FormData');
    let proposals = lw.follow15Events.filter(event => event.type === 'radio').length;
    nativeKey(lr('quarterly'), 'Home');
    await until(() => ld.activeElement === lr('monthly') && lr('monthly').tabIndex === 0, 'Home focus-only render');
    ok(valueIs('quarterly') && lw.follow15Events.filter(event => event.type === 'radio').length === proposals, 'no-act Home only moves focus and roving stop');
    nativeKey(lr('monthly'), ' '); await until(() => valueIs('monthly'), 'Space after Home');
    ok(valueIs('monthly'), 'no-act Space selects Home-focused destination');
    nativeKey(lr('monthly'), 'End'); await until(() => ld.activeElement === lr('yearly') && lr('yearly').tabIndex === 0, 'End focus-only render');
    ok(valueIs('monthly'), 'no-act End keeps previous checked value');
    nativeKey(lr('yearly'), ' '); await until(() => valueIs('yearly'), 'Space after End');
    ok(valueIs('yearly'), 'no-act Space selects End-focused destination');
    ld.querySelector('#reject').click(); await until(() => ld.querySelector('#reject').getAttribute('aria-pressed') === 'true', 'parent reject toggle');
    proposals = lw.follow15Events.filter(event => event.type === 'radio').length;
    nativeKey(lr('yearly'), 'ArrowUp'); await until(() => lw.follow15Events.filter(event => event.type === 'radio').length > proposals && valueIs('yearly') && ld.activeElement === lr('quarterly'), 'controlled rejection settles');
    ok(valueIs('yearly') && lr('quarterly').tabIndex === 0, 'no-act controlled rejection keeps original value and new roving focus');
    ld.querySelector('#controlled-reset').click(); await until(() => valueIs('yearly'), 'controlled form reset reconciles');
    ok(valueIs('yearly'), 'no-act native reset preserves controlled owner value');
    const enter = nativeKey(lr('quarterly'), 'Enter');
    ok(enter.defaultPrevented && valueIs('yearly') && !lw.follow15Events.some(event => event.type === 'submit'), 'no-act Enter suppresses native default without observed submission');
    ld.querySelector('#reject').click(); await until(() => ld.querySelector('#reject').getAttribute('aria-pressed') === 'false', 'parent accepts again');
    lf('src').click(); await until(() => !!lf('src/sections'), 'open source folder');
    ok(lf('src').getAttribute('aria-expanded') === 'true', 'no-act source parent opens');
    lf('src/sections').click(); await until(() => ld.querySelector('#controlled-form [data-file-path="src/sections/hero.tsx"]'), 'open nested sections');
    ok(ld.querySelector('#folder-output').textContent === 'src,src/sections', 'no-act nested disclosure and visible expansion report agree');
    lf('src').click(); await until(() => !lf('src/sections'), 'close source folder');
    lf('src').click(); await until(() => !!lf('src/sections'), 'reopen source folder');
    ok(lf('src/sections').getAttribute('aria-expanded') === 'false' && !ld.querySelector('[data-file-path="src/sections/hero.tsx"]'), 'no-act parent unmount resets uncontrolled nested disclosure');
    const independent = value => ld.querySelector(`#uncontrolled-form input[value="${value}"]`);
    independent('quarterly').focus(); nativeKey(independent('quarterly'), 'ArrowDown');
    await until(() => independent('yearly').checked, 'independent uncontrolled arrow');
    ok(independent('yearly').checked && valueIs('yearly'), 'no-act sibling radio ownership remains independent');
    ld.querySelector('#uncontrolled-reset').click(); await until(() => independent('quarterly').checked, 'independent uncontrolled reset');
    ok(independent('quarterly').checked && valueIs('yearly'), 'no-act independent reset restores mounted default without touching controlled group');
    const raceInput = value => ld.querySelector(`#race-form input[value="${value}"]`);
    const raceIs = value => raceInput(value).checked && ld.querySelector('#race-output').textContent === value;
    const seedRace = async () => {
      lw.follow15RaceMode = 'none'; raceInput('yearly').click();
      await until(() => raceIs('yearly'), 'race seed settles before same-turn events');
      lw.follow15RaceEvents.length = 0;
    };
    for (const mode of ['proposal', 'false', 'event', 'item', 'ancestor', 'capture', 'document']) {
      await seedRace(); lw.follow15RaceMode = mode;
      const documentVeto = event => { if (event.target.closest?.('#race-form') && event.target.type === 'radio') event.preventDefault(); };
      if (mode === 'document') ld.addEventListener('click', documentVeto);
      ld.querySelector('#race-form').reset(); raceInput('quarterly').click();
      await until(() => raceIs('monthly'), `same-turn reset then canceled ${mode} choice`);
      ld.removeEventListener('click', documentVeto);
      ok(raceIs('monthly') && lw.follow15RaceEvents[0].reason === 'reset', `no-act allowed reset survives later ${mode} cancellation`);
    }
    await seedRace();
    ld.querySelector('#race-form').reset(); raceInput('quarterly').click();
    await until(() => raceIs('quarterly'), 'reset then accepted selection');
    ok(raceIs('quarterly') && lw.follow15RaceEvents.at(-1).previous === 'monthly', 'no-act later accepted selection wins after reset and sees reset value');
    await seedRace(); raceInput('quarterly').click(); ld.querySelector('#race-form').reset();
    await until(() => raceIs('monthly'), 'accepted selection then reset');
    ok(raceIs('monthly'), 'no-act later reset wins after accepted selection');
    await seedRace(); lw.follow15RaceMode = 'reset-veto'; raceInput('quarterly').click(); ld.querySelector('#race-form').reset();
    await until(() => raceIs('quarterly'), 'accepted choice before refused reset');
    ok(raceIs('quarterly'), 'no-act later refused reset retains accepted choice');
    await seedRace(); nativeKey(raceInput('yearly'), 'ArrowUp'); ld.querySelector('#race-form').reset();
    await until(() => raceIs('monthly'), 'keyboard original order before reset');
    ok(raceIs('monthly'), 'no-act delayed keyboard-generated click cannot overtake later native reset');
    await seedRace(); ld.querySelector('#race-form').reset(); nativeKey(raceInput('monthly'), 'ArrowDown');
    await until(() => raceIs('quarterly'), 'reset before later keyboard');
    ok(raceIs('quarterly'), 'no-act keyboard after reset commits later selection');
    await seedRace(); ld.querySelector('#race-form').reset(); lw.follow15ReplaceOwner('quarterly');
    await until(() => raceInput('quarterly').checked, 'new explicit owner supersedes queued reset');
    ok(raceInput('quarterly').checked && !lw.follow15RaceEvents.some(event => event.reason === 'reset'), 'no-act synchronous controlled owner replacement invalidates older reset');
    ld.querySelector('#mount').click(); await until(() => !lr('monthly') && !lf('src'), 'conditional unmount');
    ok(!lr('monthly') && !lf('src'), 'no-act conditional unmount removes both controls');
    ld.querySelector('#mount').click(); await until(() => valueIs('yearly') && !!lf('src'), 'conditional remount');
    ok(valueIs('yearly') && lf('src').getAttribute('aria-expanded') === 'false', 'no-act remount restores controlled radio and source-closed disclosure');
    fs.writeFileSync(R + '/qa/fifteenth-controls-no-act.json', JSON.stringify({ passed: true, checks: checks.length - beforeNoAct, production: true, usesAct: false, waits: observedWaits, timeoutMs: 2000, browser: false, nativeBrowserValidation: false }, null, 2) + '\n');
  } finally { lw.close(); }
  const result = { schema: 1, suite: 'fifteenth-controls-model', passed: true, checks: checks.length, assertions: checks, browser: false, realIME: false, nativeBrowserValidation: false, realLayout: false, noActProductionChecks: checks.length - beforeNoAct, scope: 'Real React and JSDOM model checks, including an independent production bundle without act;  native browser validation, trusted keyboard/IME, assistive technology and pixel layout remain unverified.' };
  fs.writeFileSync(R + '/qa/fifteenth-controls-model.json', JSON.stringify(result, null, 2) + '\n');
  console.log(`fifteenth-controls-model: ${checks.length}/${checks.length} PASS (React/JSDOM only; browser, trusted IME, native validation, layout not run)`);
})().catch(error => { console.error(error); process.exitCode = 1; });
