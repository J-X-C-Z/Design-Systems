/* React/JSDOM contract checks. No real-browser, keyboard or network-navigation claim. */
const path = require('path'), fs = require('fs'), assert = require('assert/strict');
const base = path.resolve(__dirname, '..');
const deps = process.env.LOCAL_DEPENDENCIES || path.join(base, 'node_modules');
const { JSDOM, VirtualConsole } = require(path.join(deps, 'jsdom'));
const virtualConsole = new VirtualConsole();
const dom = new JSDOM('<main></main>', { pretendToBeVisual: true, url: 'https://fixture.invalid/', virtualConsole });
Object.assign(global, { window: dom.window, document: dom.window.document, IS_REACT_ACT_ENVIRONMENT: true });
const React = require(path.join(deps, 'react'));
const { act } = React, { createRoot } = require(path.join(deps, 'react-dom/client'));
const { flushSync } = require(path.join(deps, 'react-dom'));
require(path.join(deps, 'esbuild')).buildSync({ entryPoints: [path.join(base, 'src/seventh-controls/index.tsx')], outfile: path.join(base, 'qa/seventh-runtime.cjs'), bundle: true, platform: 'node', format: 'cjs', external: ['react'], logLevel: 'silent' });
const C = require(path.join(base, 'qa/seventh-runtime.cjs'));
const h = React.createElement, root = createRoot(document.querySelector('main'));
const checks = [], errors = []; let sequence = 0;
window.addEventListener('error', event => { errors.push(event.error?.message || String(event.error)); event.preventDefault(); });
const ok = (condition, message) => { assert.ok(condition, message); checks.push(message); };
const render = element => act(() => root.render(element));
const tick = () => act(() => new Promise(resolve => setTimeout(resolve, 15)));
const click = (node, options = {}) => {
  const event = new window.MouseEvent('click', { bubbles: true, cancelable: true, button: 0, ...options });
  act(() => node.dispatchEvent(event)); return event;
};
const mount = (Component, props = {}, wrap = child => child) => render(wrap(h(Component, { ...props, key: ++sequence })));
const textarea = () => document.querySelector('textarea');
const pagination = () => document.querySelector('[data-component="pagination-02"]');
const currentPage = () => Number(pagination()?.getAttribute('data-page'));
const pageLink = page => document.querySelector(`[data-kind="page"][data-page="${page}"]`);
const direction = kind => document.querySelector(`[data-kind="${kind}"]`);
function edit(node, value) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
  act(() => { setter.call(node, value); node.dispatchEvent(new window.Event('input', { bubbles: true })); });
}
(async () => {
  render(h('div', null, h(C.Textarea03), h(C.Textarea04), h(C.Textarea03), h(C.Textarea04)));
  const fields = [...document.querySelectorAll('textarea')];
  ok(new Set(fields.map(node => node.id)).size === 4, 'textarea generated IDs are unique across variants and repeated instances');
  ok(fields[0].placeholder === 'Write your response...', '03 exact original placeholder');
  ok(fields[1].placeholder === "Describe the issue you're facing...", '04 exact original placeholder');
  ok(fields[0].labels[0].textContent === 'Add details', '03 exact original label');
  ok(fields[1].labels[0].textContent === 'Issue description *', '04 exact original required label');
  ok(!fields[0].required && fields[1].required, '03 optional and 04 required original defaults');
  ok(document.getElementById(fields[0].getAttribute('aria-describedby')).textContent === 'This helps us understand your input better.', '03 original helper is accessible description');
  ok(!fields[1].hasAttribute('aria-describedby'), '04 has no invented default description');
  ok(fields[1].labels[0].querySelector('span').getAttribute('aria-hidden') === 'true', 'required star hidden from accessible name');
  for (const id of ['03', '04']) {
    const Component = C[`Textarea${id}`]; const ref = React.createRef(); let changes = 0, seen;
    mount(Component, { ref, name: 'response', defaultValue: 'original', onChange: e => { changes++; seen = e.currentTarget.value; } }, child => h('form', { id: `form-${sequence}` }, child));
    let node = textarea();
    ok(ref.current === node && node.tagName === 'TEXTAREA', id + ' ref is native textarea');
    ok(node.value === 'original' && node.defaultValue === 'original', id + ' native defaultValue');
    node.focus(); edit(node, 'edited');
    ok(node.value === 'edited' && changes === 1 && seen === 'edited', id + ' native change event exposes edited value once');
    ok(document.activeElement === node, id + ' editing retains focus');
    ok(new window.FormData(node.form).get('response') === 'edited', id + ' FormData reads current value');
    act(() => node.form.reset()); await tick();
    ok(node.value === 'original' && changes === 1, id + ' native form reset restores default without onChange');
    edit(node, 'keep'); node.form.addEventListener('reset', e => e.preventDefault(), { once: true });
    act(() => node.form.reset()); await tick();
    ok(node.value === 'keep', id + ' canceled native form reset preserves value');
    mount(Component, { value: 'owned', onChange: () => {} }, child => h('form', null, child)); node = textarea(); edit(node, 'proposal');
    ok(node.value === 'owned', id + ' native controlled owner refusal');
    act(() => node.form.reset()); await tick(); ok(node.value === 'owned', id + ' native controlled value survives reset');
    function Owner() { const [value, setValue] = React.useState('start'); return h(Component, { value, onChange: e => setValue(e.target.value) }); }
    mount(Owner); node = textarea(); edit(node, 'accepted'); ok(node.value === 'accepted', id + ' native controlled owner acceptance');
    mount(Component, { id: `explicit-${id}`, 'aria-describedby': 'external external', description: 'Explanation', label: 'Custom label', className: 'native-class', wrapperClassName: 'wrapper-class' }); node = textarea();
    ok(node.id === `explicit-${id}` && node.labels[0].textContent.startsWith('Custom label'), id + ' explicit id and label association');
    ok(node.getAttribute('aria-describedby') === `external explicit-${id}-description`, id + ' descriptions merged and deduplicated');
    ok(node.classList.contains('native-class') && node.parentElement.classList.contains('wrapper-class'), id + ' native and wrapper class hooks stay distinct');
    mount(Component, { disabled: true, name: 'disabled', defaultValue: 'excluded', readOnly: true, required: true }, child => h('form', null, child)); node = textarea();
    ok(node.disabled && node.readOnly && node.required, id + ' native disabled readonly required attributes');
    ok(!new window.FormData(node.form).has('disabled') && !node.willValidate, id + ' disabled omitted from form and validation in JSDOM');
    mount(Component, { readOnly: true, name: 'readonly', defaultValue: 'included', required: true }, child => h('form', null, child)); node = textarea();
    ok(new window.FormData(node.form).get('readonly') === 'included' && !node.willValidate, id + ' readonly participates in form but not validation in JSDOM');
    mount(Component, { required: true }, child => h('form', null, child)); node = textarea();
    ok(node.validity.valueMissing && !node.checkValidity(), id + ' required empty invalid in JSDOM only');
    edit(node, 'filled'); ok(node.checkValidity(), id + ' required filled valid in JSDOM only');
    mount(Component, { required: false }); ok(!textarea().required, id + ' explicit optional override');
    const externalId = `external-form-${id}`;
    mount(Component, { form: externalId, name: 'external', defaultValue: 'external default' }, child => h('div', null, h('form', { id: externalId }), child)); node = textarea();
    edit(node, 'external edit'); ok(new window.FormData(document.getElementById(externalId)).get('external') === 'external edit', id + ' external form association');
    act(() => node.form.reset()); await tick(); ok(node.value === 'external default', id + ' external form reset');
  }

  mount(C.Breadcrumb02);
  let nav = document.querySelector('nav'), links = [...nav.querySelectorAll('a')];
  ok(nav.getAttribute('aria-label') === 'breadcrumb', 'breadcrumb original navigation name');
  ok(links.map(node => node.textContent).join('|') === 'Portal|Orders' && links.every(node => node.getAttribute('href') === '#'), 'breadcrumb original Portal Orders real hash links');
  ok(nav.querySelector('[aria-current="page"]').textContent === 'Shipment Status' && nav.querySelector('[aria-current="page"]').tagName === 'SPAN', 'breadcrumb original current text in noninteractive current span');
  ok(nav.querySelectorAll('ol > li').length === 3 && !nav.querySelector('li li'), 'breadcrumb repaired valid direct list items without nested separator li');
  ok([...nav.querySelectorAll('[data-slot="breadcrumb-separator"]')].every(node => node.tagName === 'SPAN' && node.getAttribute('aria-hidden') === 'true'), 'breadcrumb span separators hidden from accessibility tree');
  ok(nav.querySelector('svg').getAttribute('aria-hidden') === 'true', 'breadcrumb original SVG substitute is decorative');
  const crumbRef = React.createRef(), anchorRef = React.createRef(); let linkCalls = 0;
  mount(C.Breadcrumb02, { ref: crumbRef, 'aria-label': 'Work trail', segments: [{ label: 'Work', href: '#work', ref: anchorRef, title: 'Open work', onClick: e => { linkCalls++; e.preventDefault(); } }, { label: 'Edition', current: true }] });
  nav = document.querySelector('nav'); const anchor = nav.querySelector('a');
  const canceledLink = click(anchor); await tick();
  ok(crumbRef.current === nav && anchorRef.current === anchor, 'breadcrumb nav and native segment anchor refs');
  ok(anchor.getAttribute('href') === '#work' && anchor.title === 'Open work' && nav.getAttribute('aria-label') === 'Work trail', 'breadcrumb native link and nav attrs');
  ok(linkCalls === 1 && canceledLink.defaultPrevented, 'breadcrumb native click callback can cancel link');
  mount(C.Breadcrumb02, { segments: [{ label: 'First', current: true }] });
  ok(document.querySelector('li').textContent === 'First' && !document.querySelector('a'), 'breadcrumb current-first custom segment is retained');
  mount(C.Breadcrumb02, { segments: [{ label: 'Hash', href: '#native-crumb' }] });
  const plainCrumb = click(document.querySelector('a')); await tick();
  ok(!plainCrumb.defaultPrevented && window.location.hash === '#native-crumb', 'breadcrumb hash default remains native in JSDOM; no external navigation');

  const pRef = React.createRef(); mount(C.Pagination02, { ref: pRef });
  ok(pRef.current === pagination() && pagination().getAttribute('aria-label') === 'pagination', 'pagination native nav ref and original name');
  ok(currentPage() === 2 && document.querySelector('[aria-current="page"]').textContent === '2', 'pagination exact original current page 2');
  ok(document.querySelectorAll('[data-kind="page"]').length === 3 && [...pagination().querySelectorAll('a')].every(node => node.getAttribute('href') === '#'), 'pagination original three pages plus previous next hash links');
  ok(direction('previous').getAttribute('aria-label') === 'Previous' && direction('next').getAttribute('aria-label') === 'Next', 'pagination original direction names');
  ok(!direction('previous').hasAttribute('aria-disabled') && !direction('next').hasAttribute('aria-disabled'), 'pagination source default has no disabled edges');
  let proposals = [], savedDetails;
  mount(C.Pagination02, { getPageHref: page => `#p${page}`, onPageChange: (page, details) => { proposals.push(page); savedDetails = details; } });
  const nativeEvent = click(pageLink(3));
  ok(proposals.join(',') === '3' && savedDetails.previousPage === 2 && savedDetails.page === 3 && savedDetails.event.nativeEvent === nativeEvent, 'pagination callback is immediate and includes native proposal context');
  ok(currentPage() === 2 && !nativeEvent.defaultPrevented, 'pagination callback does not intercept ordinary href default');
  await tick(); ok(currentPage() === 3 && window.location.hash === '#p3', 'pagination uncontrolled state commits after bubbling; native hash default retained');
  ok(!direction('next').hasAttribute('href') && direction('next').getAttribute('aria-disabled') === 'true' && direction('next').tabIndex === -1, 'pagination last-page next extension has no href and is out of tab order');
  const blocked = click(direction('next')); await tick(); ok(blocked.defaultPrevented && proposals.length === 1 && currentPage() === 3, 'pagination disabled edge emits no proposal');
  mount(C.Pagination02, { defaultPage: 1 }); ok(!direction('previous').hasAttribute('href') && direction('previous').tabIndex === -1, 'pagination first-page previous disabled extension');
  mount(C.Pagination02, { pageCount: 1 }); ok(currentPage() === 1 && [direction('previous'), direction('next')].every(node => node.getAttribute('aria-disabled') === 'true'), 'pagination single page clamps default and disables both directions');
  mount(C.Pagination02, { disabled: true, onPageChange: () => { throw Error('disabled callback'); } });
  ok([...pagination().querySelectorAll('a')].every(node => !node.hasAttribute('href') && node.tabIndex === -1 && node.getAttribute('aria-disabled') === 'true'), 'pagination explicit disabled removes every href and tab stop');
  click(pageLink(3)); await tick(); ok(currentPage() === 2, 'pagination disabled ignores scripted click');
  mount(C.Pagination02, { onPageChange: (_, details) => details.cancel() });
  const canceled = click(pageLink(3)); await tick(); ok(canceled.defaultPrevented && currentPage() === 2, 'pagination details.cancel blocks state and native navigation');
  mount(C.Pagination02, { onPageChange: (_, details) => details.event.preventDefault() });
  click(pageLink(3)); await tick(); ok(currentPage() === 2, 'pagination native callback event cancellation blocks state');
  mount(C.Pagination02, { onClick: e => e.preventDefault() }); click(pageLink(3)); await tick(); ok(currentPage() === 2, 'pagination nav ancestor bubble cancellation blocks queued state');
  mount(C.Pagination02, {}, child => h('section', { onClick: e => e.preventDefault() }, child)); click(pageLink(3)); await tick(); ok(currentPage() === 2, 'pagination outer React ancestor cancellation blocks queued state');
  mount(C.Pagination02); const documentCancel = e => e.preventDefault(); document.addEventListener('click', documentCancel, { once: true }); click(pageLink(3)); await tick(); ok(currentPage() === 2, 'pagination late native document cancellation blocks queued state');
  proposals = []; mount(C.Pagination02, { onPageChange: page => proposals.push(page), onClickCapture: e => e.preventDefault() }); click(pageLink(3)); await tick(); ok(proposals.length === 0 && currentPage() === 2, 'pagination earlier capture cancellation suppresses proposal');
  for (const modifier of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }]) {
    proposals = []; mount(C.Pagination02, { onPageChange: page => proposals.push(page) }); const event = click(pageLink(3), modifier); await tick();
    ok(!event.defaultPrevented && proposals.length === 0 && currentPage() === 2, 'pagination modified/middle click remains native: ' + JSON.stringify(modifier));
  }
  proposals = []; mount(C.Pagination02, { onPageChange: page => proposals.push(page) }); const same = click(pageLink(2)); await tick(); ok(proposals.length === 0 && !same.defaultPrevented, 'pagination current-page link remains native and does not emit redundant proposal');
  proposals = []; mount(C.Pagination02, { page: 2, onPageChange: page => proposals.push(page) }); click(pageLink(3)); await tick(); ok(currentPage() === 2 && proposals.join(',') === '3', 'pagination controlled owner refusal');
  function PageOwner() { const [page, setPage] = React.useState(2); return h(C.Pagination02, { page, onPageChange: (next, details) => { setPage(next); details.event.preventDefault(); } }); }
  mount(PageOwner); click(pageLink(3)); await tick(); ok(currentPage() === 3, 'pagination controlled client routing can commit parent page while preventing native navigation');
  function ParentWins() { const [page, setPage] = React.useState(2); return h(C.Pagination02, { page, onPageChange: (next, details) => { flushSync(() => setPage(next)); details.cancel(); } }); }
  mount(ParentWins); click(pageLink(3)); await tick(); ok(currentPage() === 3, 'pagination newer controlled parent commit wins cancellation');
  mount(PageOwner, {}, child => h('section', { onClick: e => e.preventDefault() }, child)); click(pageLink(3)); await tick(); ok(currentPage() === 3, 'pagination later ancestor cancellation cannot roll back an explicit controlled parent commit');
  let updateConfiguration;
  function ConfigurationOwner() { const [configuration, update] = React.useState({}); updateConfiguration = update; return h(C.Pagination02, configuration); }
  mount(ConfigurationOwner); act(() => { click(pageLink(3)); flushSync(() => updateConfiguration({ disabled: true })); }); await tick();
  ok(currentPage() === 2 && !pageLink(3).hasAttribute('href'), 'pagination newer disabled prop invalidates older queued state');
  mount(ConfigurationOwner); act(() => { click(pageLink(3)); flushSync(() => updateConfiguration({ pageCount: 1 })); }); await tick();
  ok(currentPage() === 1 && !pageLink(3), 'pagination newer smaller pageCount invalidates older queued state');
  mount(ConfigurationOwner); act(() => { click(pageLink(3)); flushSync(() => updateConfiguration({ pageCount: 5 })); }); await tick();
  ok(currentPage() === 2 && !!pageLink(5), 'pagination newer expanded pageCount invalidates older queued state');
  mount(ConfigurationOwner); act(() => { click(pageLink(3)); flushSync(() => updateConfiguration({ page: 1 })); }); await tick();
  ok(currentPage() === 1, 'pagination newer controlled takeover invalidates older queued state');
  mount(C.Pagination02); act(() => { click(pageLink(3)); click(pageLink(1)); }); await tick(); ok(currentPage() === 1, 'pagination latest same-task accepted intent wins');
  mount(C.Pagination02); act(() => { click(pageLink(3)); click(pageLink(2)); }); await tick(); ok(currentPage() === 2, 'pagination current-page click supersedes queued older intent');
  mount(C.Pagination02); act(() => { click(pageLink(3)); root.render(null); }); await tick(); ok(!pagination(), 'pagination queued state is discarded on unmount');
  mount(C.Pagination02, { onPageChange: () => { throw Error('expected page handler error'); } }); const thrown = click(pageLink(3)); await tick(); ok(thrown.defaultPrevented && currentPage() === 2 && errors.includes('expected page handler error'), 'pagination throwing callback cancels navigation and state');
  let setCount;
  function Shrink() { const [count, update] = React.useState(5); setCount = update; return h(C.Pagination02, { pageCount: count, defaultPage: 5 }); }
  mount(Shrink); act(() => setCount(2)); await tick(); ok(currentPage() === 2, 'pagination count shrink clamps displayed page'); act(() => setCount(5)); await tick(); ok(currentPage() === 2, 'pagination count reexpansion keeps already clamped page');
  act(() => root.unmount()); dom.window.close();
  const report = { kind: 'React/JSDOM only', passed: checks.length, checks, expectedErrors: errors, browser: 'not_run', externalNavigation: 'not_run', formalAccepted: 0 };
  fs.writeFileSync(path.join(base, 'qa/SEVENTH-MODEL.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(checks.length + ' seventh model checks passed');
})().catch(error => { console.error(error); process.exitCode = 1; });
