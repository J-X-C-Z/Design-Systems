import React, { forwardRef, useCallback, useId, useLayoutEffect, useRef, useState } from 'react';

// Fixed source content; this is the multiple-open variant, not an item renderer.
const ITEMS = [
  {
    value: 'item-1',
    icon: 'calendar-clock',
    title: 'Why are appointment slots disappearing so quickly?',
    content: 'Appointment availability can change fast when multiple patients, staff members, and scheduling rules are interacting at once...',
  },
  {
    value: 'item-2',
    icon: 'shield-check',
    title: 'How do we keep patient records secure?',
    content: 'Patient records need strong access controls, encrypted storage, and clear audit trails...',
  },
  {
    value: 'item-3',
    icon: 'heart-pulse',
    title: 'What causes delays in lab result updates?',
    content: 'Lab result delays often happen when data has to move between systems...',
  },
];
const IDS = ITEMS.map(item => item.value);
const DEFAULT_VALUE = ['item-1'];
const signature = value => value.join('|');
function normalize(value) {
  if (!Array.isArray(value) || Array.from(value).some(item => !IDS.includes(item))) {
    throw new RangeError('Accordion06: value must be an array containing only item-1, item-2 or item-3');
  }
  return IDS.filter(item => value.includes(item));
}
const defaultPrevented = event => event.defaultPrevented || event.nativeEvent?.defaultPrevented;

// Navigation must suppress scrolling now, while still allowing a later ancestor
// to veto focus. Observe both preventDefault methods so our own suppression is
// distinguishable from user cancellation (including non-cancelable test events).
function observeCancellation(event) {
  let veto = Boolean(defaultPrevented(event));
  let ownDefault = false;
  let suppress = false;
  const restorers = [];
  for (const target of [event, event.nativeEvent]) {
    if (!target || typeof target.preventDefault !== 'function') continue;
    const descriptor = Object.getOwnPropertyDescriptor(target, 'preventDefault');
    const original = target.preventDefault;
    const wrapped = function (...args) {
      if (!suppress) veto = true;
      return original.apply(this, args);
    };
    try {
      Object.defineProperty(target, 'preventDefault', {
        configurable: true, writable: true, value: wrapped,
      });
      restorers.push(() => {
        if (target.preventDefault !== wrapped) return;
        if (descriptor) Object.defineProperty(target, 'preventDefault', descriptor);
        else delete target.preventDefault;
      });
    } catch {
      // Ordinary React/native events are writable. Frozen user events still
      // retain their native defaultPrevented semantics for non-owned actions.
    }
  }
  return {
    canceled: () => veto || (!ownDefault && Boolean(defaultPrevented(event))),
    preventOwnDefault() {
      suppress = true;
      try { event.preventDefault(); } finally { suppress = false; }
      ownDefault = true;
    },
    restore() { restorers.reverse().forEach(restore => restore()); },
  };
}

function OutlineIcon({ kind }) {
  return <svg className="fr7-medical-faq-icon" data-accordion-icon={kind} aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {kind === 'calendar-clock' && <>
      <path d="M8 2v4M16 2v4M3 10h18M21 11V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" />
      <circle cx="18" cy="18" r="4" /><path d="M18 16v2l1.5 1" />
    </>}
    {kind === 'shield-check' && <>
      <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" />
    </>}
    {kind === 'heart-pulse' && <>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
      <path d="M3 12h4l3-4 4 8 3-4h4" />
    </>}
  </svg>;
}

/**
 * Multiple-open, non-form accordion. Values are deduplicated into source order;
 * defaultValue is read only on mount. Releasing a controlled value preserves the
 * last committed owner value. onValueChange is a synchronous, cancellable proposal
 * after event bubbling; it receives independent next/previous array snapshots.
 * Native form reset has no effect. Enter/Space use the native button click.
 */
export const Accordion06 = forwardRef(function Accordion06({
  value,
  defaultValue = DEFAULT_VALUE,
  onValueChange,
  disabled = false,
  triggerProps = {},
  orientation = 'vertical',
  dir = 'ltr',
  loop = true,
  className = '',
  children: _children,
  dangerouslySetInnerHTML: _html,
  ...native
}, forwardedRef) {
  if (orientation !== 'vertical' && orientation !== 'horizontal') {
    throw new RangeError('Accordion06: orientation must be vertical or horizontal');
  }
  const controlled = value !== undefined;
  const [stored, setStored] = useState(() => normalize(defaultValue));
  const uid = useId();
  const root = useRef(null);
  const mounted = useRef(false);
  const epoch = useRef(0);
  const live = useRef(null);
  const last = useRef({ controlled, selected: controlled ? normalize(value) : stored });
  const logical = useRef(null);
  const selected = normalize(controlled ? value : last.current.controlled ? last.current.selected : stored);

  // Returning a composed cleanup is important in React 19: a consumer callback
  // may return its own cleanup instead of accepting a later ref(null) call.
  const rootRef = useCallback(node => {
    root.current = node;
    const cleanup = typeof forwardedRef === 'function' ? forwardedRef(node) : undefined;
    if (forwardedRef && typeof forwardedRef !== 'function') forwardedRef.current = node;
    return () => {
      if (root.current === node) root.current = null;
      if (typeof cleanup === 'function') cleanup();
      else if (typeof forwardedRef === 'function') forwardedRef(null);
      else if (forwardedRef) forwardedRef.current = null;
    };
  }, [forwardedRef]);

  useLayoutEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; epoch.current += 1; };
  }, []);
  useLayoutEffect(() => {
    const ownerChanged = last.current.controlled !== controlled ||
      (controlled && signature(last.current.selected) !== signature(selected));
    if (ownerChanged) {
      epoch.current += 1;
      logical.current = selected;
      if (!controlled) setStored(selected);
    } else if (logical.current === null) {
      logical.current = selected;
    }
    last.current = { controlled, selected };
    live.current = { controlled, selected, disabled, onValueChange, orientation, dir, loop };
  });

  function canAct(node, stamp) {
    return mounted.current && stamp === epoch.current && root.current &&
      node.isConnected && root.current.contains(node) && !live.current.disabled &&
      !node.matches(':disabled');
  }

  function toggle(itemId, event, node, cancellation, stamp) {
    queueMicrotask(() => {
      try {
        if (!canAct(node, stamp) || cancellation.canceled()) return;
        const current = live.current;
        const previousValue = current.controlled ? current.selected : logical.current;
        const next = normalize(previousValue.includes(itemId)
          ? previousValue.filter(item => item !== itemId)
          : [...previousValue, itemId]);
        let veto = false;
        const details = {
          id: 'accordion-06', itemId, open: next.includes(itemId),
          previousValue: [...previousValue], event, button: node,
          cancel() { veto = true; },
        };
        const result = current.onValueChange?.([...next], details);
        if (veto || result === false || cancellation.canceled() || !canAct(node, stamp)) return;
        if (!current.controlled && !live.current.controlled) {
          // Keep the logical value ahead of React's batched commit so independent
          // same-turn clicks accumulate and two clicks on one item cancel out.
          logical.current = next;
          setStored(next);
        }
      } finally { cancellation.restore(); }
    });
  }

  function click(event, itemId, handler) {
    const node = event.currentTarget;
    // Capture the gesture owner before consumer handlers can synchronously
    // replace/release it. A later owner must never inherit this old gesture.
    const stamp = epoch.current;
    if (!canAct(node, stamp)) return;
    const cancellation = observeCancellation(event);
    try {
      handler?.(event);
      if (!canAct(node, stamp) || cancellation.canceled()) { cancellation.restore(); return; }
      toggle(itemId, event, node, cancellation, stamp);
    } catch (error) { cancellation.restore(); throw error; }
  }

  function navigate(event, handler) {
    const node = event.currentTarget;
    // Capture the gesture owner before consumer handlers can synchronously
    // replace/release it. A later owner must never inherit this old gesture.
    const stamp = epoch.current;
    if (!canAct(node, stamp)) return;
    const cancellation = observeCancellation(event);
    let deferred = false;
    try {
      handler?.(event);
      if (!canAct(node, stamp) || cancellation.canceled() || event.isComposing || event.nativeEvent?.isComposing ||
        event.keyCode === 229 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const current = live.current;
      const direction = current.dir === 'rtl' || (current.dir !== 'ltr' &&
        node.ownerDocument.defaultView?.getComputedStyle(root.current).direction === 'rtl') ? 'rtl' : 'ltr';
      const forward = current.orientation === 'vertical' ? 'ArrowDown' : direction === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
      const backward = current.orientation === 'vertical' ? 'ArrowUp' : direction === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
      const key = event.key;
      if (![forward, backward, 'Home', 'End'].includes(key)) return;
      cancellation.preventOwnDefault();
      deferred = true;
      queueMicrotask(() => {
        try {
          if (!canAct(node, stamp) || cancellation.canceled()) return;
          // Bubbling handlers may intentionally move focus elsewhere. The
          // queued navigation owns focus only while its source still has it.
          if (node.ownerDocument.activeElement !== node) return;
          const now = live.current;
          if (now.orientation !== current.orientation || now.dir !== current.dir || now.loop !== current.loop) return;
          // Read actual native disabledness at execution time, including disabled
          // fieldsets and their first-legend exception, rather than just props.
          const enabled = [...root.current.querySelectorAll('[data-accordion-value]')]
            .filter(button => button.isConnected && !button.matches(':disabled'));
          const index = enabled.indexOf(node);
          if (index < 0) return;
          let next;
          if (key === 'Home') next = 0;
          else if (key === 'End') next = enabled.length - 1;
          else {
            const offset = key === forward ? 1 : -1;
            next = now.loop ? (index + offset + enabled.length) % enabled.length
              : Math.max(0, Math.min(index + offset, enabled.length - 1));
          }
          enabled[next]?.focus();
        } finally { cancellation.restore(); }
      });
    } finally { if (!deferred) cancellation.restore(); }
  }

  return <div {...native} ref={rootRef} dir={dir}
    className={`fr7 fr7-twentysixth fr7-medical-faq ${className}`}
    data-component-id="accordion-06" data-slot="accordion" data-orientation={orientation} data-disabled={disabled ? '' : undefined}>
    {ITEMS.map(item => {
      const props = triggerProps[item.value] || {};
      const { onClick, onKeyDown, className: triggerClass = '', children: _c, dangerouslySetInnerHTML: _h, ...attrs } = props;
      const open = selected.includes(item.value);
      const triggerId = `${uid}-${item.value}-trigger`;
      const contentId = `${uid}-${item.value}-content`;
      return <section key={item.value} className="fr7-medical-faq-item" data-slot="accordion-item" data-state={open ? 'open' : 'closed'}>
        <h3 className="fr7-medical-faq-heading">
          <button {...attrs} type="button" id={triggerId} aria-expanded={open} aria-controls={contentId}
            disabled={disabled || props.disabled} data-slot="accordion-trigger" data-accordion-value={item.value}
            data-state={open ? 'open' : 'closed'} className={`fr7-medical-faq-trigger ${triggerClass}`}
            onClick={event => click(event, item.value, onClick)} onKeyDown={event => navigate(event, onKeyDown)}>
            <span className="fr7-medical-faq-toggle" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" focusable="false" aria-hidden="true" data-accordion-toggle={open ? 'minus' : 'plus'}>
                <path d="M3 8h10" />{!open && <path d="M8 3v10" />}
              </svg>
            </span>
            <span className="fr7-medical-faq-title"><OutlineIcon kind={item.icon} /><span>{item.title}</span></span>
          </button>
        </h3>
        <div id={contentId} role="region" aria-labelledby={triggerId} hidden={!open}
          data-slot="accordion-content" data-state={open ? 'open' : 'closed'} className="fr7-medical-faq-content">
          {open && item.content}
        </div>
      </section>;
    })}
  </div>;
});
