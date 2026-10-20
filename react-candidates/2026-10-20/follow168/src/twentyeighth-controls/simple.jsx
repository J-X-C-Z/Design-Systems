import React, { forwardRef, useCallback, useId, useLayoutEffect, useRef, useState } from 'react';
import CONTENT from './data-simple.json';

// Each public component owns immutable source content; the shared hook is private.
const IDS = ['item-1', 'item-2', 'item-3'];
const DEFAULT_VALUE = ['item-1'];
const signature = value => value.join('|');
function normalize(value, name) {
  if (!Array.isArray(value) || Array.from(value).some(item => !IDS.includes(item))) {
    throw new RangeError(`${name}: value must be an array containing only item-1, item-2 or item-3`);
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

function ToggleIcon({ kind }) {
  return <span className="fr7-simple-faq-toggle" aria-hidden="true">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" focusable="false" aria-hidden="true" data-accordion-toggle={kind}>
      {(kind === 'plus' || kind === 'minus') && <path d="M3 8h10" />}
      {kind === 'plus' && <path d="M8 3v10" />}
      {kind === 'chevron-right' && <path d="m6 3 5 5-5 5" />}
      {kind === 'chevron-down' && <path d="m3 6 5 5 5-5" />}
      {kind === 'chevron-up' && <path d="m3 10 5-5 5 5" />}
      {kind === 'x' && <path d="m4 4 8 8m0-8-8 8" />}
    </svg>
  </span>;
}

/**
 * Copied from the verified Accordion06 contract: multiple-open, non-form state;
 * deferred cancellable proposals; latest native disabledness; focus ownership.
 * Fixed source data and layout enter only through the four named components.
 */
function useFixedAccordion({
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
}, forwardedRef, id) {
  const name = `Accordion${id.slice(-2)}`;
  const normalizeValue = candidate => normalize(candidate, name);
  if (orientation !== 'vertical' && orientation !== 'horizontal') {
    throw new RangeError(`${name}: orientation must be vertical or horizontal`);
  }
  const controlled = value !== undefined;
  const [stored, setStored] = useState(() => normalizeValue(defaultValue));
  const uid = useId();
  const root = useRef(null);
  const mounted = useRef(false);
  const epoch = useRef(0);
  const live = useRef(null);
  const last = useRef({ controlled, selected: controlled ? normalizeValue(value) : stored });
  const logical = useRef(null);
  const selected = normalizeValue(controlled ? value : last.current.controlled ? last.current.selected : stored);

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
        const next = normalizeValue(previousValue.includes(itemId)
          ? previousValue.filter(item => item !== itemId)
          : [...previousValue, itemId]);
        let veto = false;
        const details = {
          id, itemId, open: next.includes(itemId),
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
    className={`fr7 fr7-twentyeighth fr7-simple-faq fr7-${id} ${className}`}
    data-component-id={id} data-slot="accordion" data-orientation={orientation} data-disabled={disabled ? '' : undefined}>
    {CONTENT[id].map(item => {
      const props = triggerProps[item.value] || {};
      const { onClick, onKeyDown, className: triggerClass = '', children: _c, dangerouslySetInnerHTML: _h, ...attrs } = props;
      const open = selected.includes(item.value);
      const triggerId = `${uid}-${item.value}-trigger`;
      const contentId = `${uid}-${item.value}-content`;
      const toggleKind = id === 'accordion-12' ? (open ? 'chevron-up' : 'chevron-down') : (open ? 'x' : 'plus');
      return <section key={item.value} className="fr7-simple-faq-item" data-slot="accordion-item" data-state={open ? 'open' : 'closed'}>
        <h3 className="fr7-simple-faq-heading">
          <button {...attrs} type="button" id={triggerId} aria-expanded={open} aria-controls={contentId}
            disabled={disabled || props.disabled} data-slot="accordion-trigger" data-accordion-value={item.value}
            data-state={open ? 'open' : 'closed'} className={`fr7-simple-faq-trigger ${triggerClass}`}
            onClick={event => click(event, item.value, onClick)} onKeyDown={event => navigate(event, onKeyDown)}>
            <span className="fr7-simple-faq-label">
              <span className="fr7-simple-faq-copy">
                <span className="fr7-simple-faq-title">{item.title}</span>
                {item.subtitle && <span className="fr7-simple-faq-subtitle">{item.subtitle}</span>}
              </span>
            </span>
            <ToggleIcon kind={toggleKind} />
          </button>
        </h3>
        <div id={contentId} role="region" aria-labelledby={triggerId} hidden={!open}
          data-slot="accordion-content" data-state={open ? 'open' : 'closed'} className="fr7-simple-faq-content">
          {open && item.content}
        </div>
      </section>;
    })}
  </div>;
}

export const Accordion12 = forwardRef(function Accordion12(props, ref) { return useFixedAccordion(props, ref, 'accordion-12'); });
export const Accordion14 = forwardRef(function Accordion14(props, ref) { return useFixedAccordion(props, ref, 'accordion-14'); });
