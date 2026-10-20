'use strict';
/* Author React/JSDOM probes only. No native/Flutter/predecessor test credit. */
exports.run = async function run(window, React, createRoot, assert, C) {
  let assertions = 0, scenarios = 0;
  const check = (value, message) => { assertions++; assert.ok(value, message); };
  const equal = (actual, expected, message) => { assertions++; assert.strictEqual(actual, expected, message); };
  const h = React.createElement, act = React.act;
  check(typeof act === 'function', 'React development act is available');
  const settle = async fn => { await act(async () => { fn?.(); await Promise.resolve(); }); };
  const variants = [
    ['Button04', '04', '探索更多', 'arrow', false],
    ['Button05', '05', '已禁用', 'ban', true],
    ['Button06', '06', '小号按钮', null, false],
    ['Button07', '07', '大号按钮', null, false],
    ['Button08', '08', '超小号按钮', null, false],
    ['Button09', '09', '加载中', null, true],
    ['Button10', '10', '升级', 'bolt', false],
    ['Button11', '11', '删除', 'trash', false],
    ['Button12', '12', '收藏', 'star', false]
  ];
  let serial = 0;
  async function withMount(name, props, callback, strict = false) {
    scenarios++;
    const form = window.document.createElement('form'); form.id = `fr7-next-test-${++serial}`;
    const host = window.document.createElement('div'); form.append(host); window.document.body.append(form);
    const root = createRoot(host); let current = props, alive = true;
    const tree = () => strict ? h(React.StrictMode, null, h(C[name], current)) : h(C[name], current);
    const m = { form, host, root, get button() { return host.querySelector('button'); },
      get props() { return current; },
      render: async patch => { current = { ...current, ...patch }; await settle(() => root.render(tree())); },
      unmount: async () => { if (alive) { alive = false; await settle(() => root.unmount()); } }
    };
    try { await settle(() => root.render(tree())); await callback(m); }
    finally { await m.unmount(); form.remove(); }
  }
  for (const [name, id, label, icon, fixedDisabled] of variants) {
    check(!!C[name], `${name}: exact React export`);
    const nativeRef = React.createRef();
    await withMount(name, { ref: nativeRef }, async m => {
      equal(m.host.querySelectorAll('button').length, 1, `${name}: exactly one native button`);
      equal(m.host.querySelectorAll('iframe,input,textarea').length, 0, `${name}: no surrogate field/frame`);
      equal(nativeRef.current, m.button, `${name}: ref addresses native button`);
      equal(m.button.type, 'button', `${name}: safe native type default`);
      equal(m.button.getAttribute('data-follow-id'), `button-${id}`, `${name}: canonical exact ID`);
      equal(m.button.textContent, label, `${name}: translated source label`);
      equal(m.button.disabled, fixedDisabled, `${name}: source disabled default`);
      equal(m.button.querySelectorAll('.fr7-nb-face').length, 1, `${name}: one visual face inside native target`);
      equal(m.button.getAttribute('aria-pressed'), null, `${name}: no invented toggle state`);
      equal(m.button.querySelectorAll('svg').length, icon ? 1 : 0, `${name}: source-specific icon count`);
      if (icon) {
        const svg = m.button.querySelector('svg');
        equal(svg.dataset.icon, icon, `${name}: source-specific icon`);
        equal(svg.getAttribute('aria-hidden'), 'true', `${name}: icon decorative`);
        equal(svg.getAttribute('focusable'), 'false', `${name}: icon not extra focus stop`);
        equal(svg.parentElement.firstElementChild === svg, ['ban','trash','star'].includes(icon), `${name}: correct leading/trailing icon order`);
        check(!!svg.querySelector('path'), `${name}: actual SVG geometry`);
      }
      equal(m.button.querySelectorAll('.fr7-nb-dots > span').length, id === '09' ? 3 : 0, `${name}: exact three-dot variant only`);
      if (id === '09') {
        equal(m.button.getAttribute('aria-busy'), 'true', 'Button09: fixed busy semantic');
        equal(m.button.querySelector('.fr7-nb-dots').getAttribute('aria-hidden'), 'true', 'Button09: dots do not duplicate accessible name');
        equal(m.button.querySelector('.fr7-nb-dots').previousElementSibling.className, 'fr7-nb-label', 'Button09: loading label precedes dots');
      }
      if (id === '12') equal(m.button.querySelector('svg').getAttribute('fill'), 'none', 'Button12: outline star, not filled selected state');
    }, true);
    equal(nativeRef.current, null, `${name}: native ref detached on unmount`);

    // Real native .click, owner attributes, cancellation and form default action.
    let clicks = 0, seen;
    await withMount(name, { name: `action-${id}`, value: 'choice', title: 'native title', 'aria-label': 'custom accessible label', 'data-sample': id,
      onClick: event => { clicks++; seen = event.currentTarget; } }, async m => {
      equal(m.button.name, `action-${id}`, `${name}: name forwarded`);
      equal(m.button.value, 'choice', `${name}: value forwarded`);
      equal(m.button.title, 'native title', `${name}: title forwarded`);
      equal(m.button.getAttribute('aria-label'), 'custom accessible label', `${name}: aria label forwarded`);
      equal(m.button.dataset.sample, id, `${name}: data forwarded`);
      let submits = 0; m.form.addEventListener('submit', e => { e.preventDefault(); submits++; });
      await settle(() => m.button.click()); equal(clicks, fixedDisabled ? 0 : 1, `${name}: standard onClick once`);
      equal(submits, 0, `${name}: default does not submit`);
      if (!fixedDisabled) equal(seen, m.button, `${name}: onClick currentTarget is native button`);
      await m.render({ children: 'Owner label', className: 'consumer-class', style: { marginLeft: '7px' } });
      equal(m.button.textContent, 'Owner label', `${name}: children update`);
      check(m.button.classList.contains('consumer-class'), `${name}: className retained`);
      equal(m.button.style.marginLeft, '7px', `${name}: native style forwarded`);
      const node = m.button;
      await m.render({ title: 'metadata' }); equal(m.button, node, `${name}: metadata preserves native identity`);
      if (!fixedDisabled) {
        node.focus(); await m.render({ title: 'focus metadata' });
        equal(window.document.activeElement, node, `${name}: metadata preserves focus`);
      }
    });

    for (const guard of [{ disabled: true }, { readOnly: true }, { 'aria-disabled': true }, { 'aria-disabled': 'true' }]) {
      clicks = 0;
      await withMount(name, { ...guard, type: 'submit', onClick: () => clicks++ }, async m => {
        let submits = 0; m.form.addEventListener('submit', e => { e.preventDefault(); submits++; });
        await settle(() => m.button.click()); equal(clicks, 0, `${name}: ${JSON.stringify(guard)} blocks onClick`);
        equal(submits, 0, `${name}: ${JSON.stringify(guard)} blocks native submit`);
        equal(m.button.hasAttribute('readonly'), false, `${name}: no invalid native readonly attr`);
        if (guard.readOnly) equal(m.button.getAttribute('aria-disabled'), 'true', `${name}: readOnly exposes aria-disabled`);
      });
    }
    for (const aria of [false, 'false']) {
      clicks = 0;
      await withMount(name, { 'aria-disabled': aria, disabled: false, 'aria-busy': false, onClick: () => clicks++ }, async m => {
        await settle(() => m.button.click()); equal(clicks, fixedDisabled ? 0 : 1, `${name}: false aria permits only source-active variant`);
        equal(m.button.disabled, fixedDisabled, `${name}: fixed-disabled source cannot be enabled`);
        if (fixedDisabled && id === '09') equal(m.button.getAttribute('aria-busy'), 'true', 'Button09: caller cannot remove fixed busy state');
      });
    }
    if (fixedDisabled) continue;

    await withMount(name, { type: 'submit', name: 'intent', value: id }, async m => {
      let submits = 0, submitter;
      m.form.addEventListener('submit', e => { e.preventDefault(); submits++; submitter = e.submitter; });
      await settle(() => m.button.click()); equal(submits, 1, `${name}: explicit type submit retains browser behavior`);
      equal(submitter, m.button, `${name}: native submitter retained`);
      await m.render({ onClick: event => event.preventDefault() }); await settle(() => m.button.click());
      equal(submits, 1, `${name}: ordinary preventDefault cancels submission`);
    });
    await withMount(name, { type: 'reset' }, async m => {
      const input = window.document.createElement('input'); input.defaultValue = 'baseline'; m.form.append(input); input.value = 'edited';
      await settle(() => m.button.click()); equal(input.value, 'baseline', `${name}: explicit reset delegates actual form reset`);
    });
    await withMount(name, {}, async m => {
      const otherForm = window.document.createElement('form'); otherForm.id = `fr7-next-external-${serial}`; window.document.body.append(otherForm);
      let submits = 0; otherForm.addEventListener('submit', e => { e.preventDefault(); submits++; });
      try {
        await m.render({ type: 'submit', form: otherForm.id }); equal(m.button.form, otherForm, `${name}: external form attribute`);
        await settle(() => m.button.click()); equal(submits, 1, `${name}: submits externally associated form`);
      } finally { otherForm.remove(); }
    });
    await withMount(name, {}, async m => {
      const outside = window.document.createElement('button'); outside.textContent = 'outside'; window.document.body.append(outside);
      try {
        let focusCalls = 0;
        await m.render({ onFocus: () => focusCalls++, onClick: () => outside.focus() });
        await settle(() => m.button.focus()); equal(focusCalls, 1, `${name}: standard focus callback`);
        await settle(() => m.button.click()); equal(window.document.activeElement, outside, `${name}: host focus takeover retained`);
      } finally { outside.remove(); }
    });
    await withMount(name, {}, async m => {
      let keys = 0, calls = 0, touchedThen = false;
      await m.render({ onKeyDown: () => keys++, onClick: () => { calls++; return { get then() { touchedThen = true; throw Error('must not inspect callback result'); } }; } });
      for (const value of ['Enter', ' ', 'ArrowRight', 'Escape']) {
        const e = new window.KeyboardEvent('keydown', { key: value, bubbles: true, cancelable: true });
        await settle(() => m.button.dispatchEvent(e)); equal(e.defaultPrevented, false, `${name}: ${value} not intercepted`);
      }
      equal(keys, 4, `${name}: standard key callback forwarded`);
      equal(calls, 0, `${name}: synthetic keydown does not invent browser activation`);
      await settle(() => m.button.click()); equal(touchedThen, false, `${name}: callback result not awaited`);
    });
    await withMount(name, {}, async m => {
      const marker = `expected-next-button-failure-${id}`; let errors = 0;
      const listener = event => { if (event.error?.message === marker || event.message === marker) { errors++; event.preventDefault(); } };
      window.addEventListener('error', listener);
      try {
        await m.render({ onClick: () => { throw new Error(marker); } }); await settle(() => m.button.click());
        equal(errors, 1, `${name}: callback error surfaces once`);
        equal(m.button.getAttribute('aria-pressed'), null, `${name}: error creates no invented state`);
      } finally { window.removeEventListener('error', listener); }
    });
    if (typeof C.__flushSync === 'function') {
      const cleanupRef = React.createRef();
      await withMount(name, { ref: cleanupRef }, async m => {
        await m.render({ onClick: () => C.__flushSync(() => m.root.render(null)) });
        await settle(() => m.button.click()); equal(m.host.childNodes.length, 0, `${name}: synchronous owner unmount survives callback`);
        equal(cleanupRef.current, null, `${name}: synchronous unmount ref cleanup`);
      });
    }
  }
  // Static implementation checks do not claim pixels, motion rendering or CSS support.
  const fs = require('node:fs'), path = require('node:path');
  const css = fs.readFileSync(path.join(__dirname, '../src/next-buttons/styles.css'), 'utf8');
  const jsx = fs.readFileSync(path.join(__dirname, '../src/next-buttons/index.jsx'), 'utf8');
  for (const [variant, height] of [['06', 28], ['07', 36], ['08', 24]])
    check(new RegExp(`\\.fr7\\.fr7-next-button-${variant}\\s*\\{[^}]*--nb-face-height:\\s*${height}px`).test(css), `Button${variant}: distinct source face ${height}px is authored`);
  check(css.includes('min-height: 44px'), 'Native clickable target minimum authored');
  check(css.includes('translateX(4px) scale(1.1)') && css.includes('transform 200ms ease-out'), 'Button04: source arrow motion authored');
  for (const delay of ['-.2s','-.1s','0s']) check(css.includes(`animation-delay: ${delay}`), `Button09: dot delay ${delay}`);
  check(css.includes('background-size: 200% auto') && css.includes('background-position 500ms ease-out'), 'Button10: source gradient movement authored');
  check(/\.fr7-next-button-11 > \.fr7-nb-face\s*\{[^}]*color: var\(--fr-danger/.test(css), 'Button11: destructive face authored');
  check(css.includes('.fr7.fr7-next-button-12 { --nb-face-radius: 999px; }'), 'Button12: pill shape authored');
  check(css.includes('(prefers-reduced-motion: reduce)') && css.includes('[data-motion="off"]') && css.includes('[data-motion="reduce"]'), 'System and provider reduced-motion routes authored');
  check(css.includes('transform: none !important') && css.includes('background-position: 0% center !important'), 'Reduced-motion overrides beat hover specificity');
  check(css.includes('(forced-colors: active)'), 'Forced-colors route authored');
  check(!/dangerouslySetInnerHTML|\.innerHTML|mountController|setInterval|setTimeout|fetch\(/.test(jsx), 'No DOM controller, timer or request simulation');
  return { kind: 'author-react-next-buttons-regression', ids: variants.length, scenarios, assertions,
    synchronousUnmount: typeof C.__flushSync === 'function', browser: false, realKeyboard: false, realLayout: false, visual: false, reducedMotionRendered: false };
};
