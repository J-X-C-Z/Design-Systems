import React, {forwardRef, useId, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {available, observeCancellation} from '../thirtieth-controls/owner.js';

const classes = (...parts) => parts.filter(Boolean).join(' ');
const assignRef = (ref, node) => { if (typeof ref === 'function') return ref(node); if (ref) ref.current = node; };
const descriptionIds = (...parts) => [...new Set(parts.filter(Boolean).flatMap(part => part.split(/\s+/)))].join(' ') || undefined;

function Icon({name}) {
  const shapes = {
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></>,
    moon: <path d="M20.5 14.2A9 9 0 0 1 9.8 3.5 9 9 0 1 0 20.5 14.2Z"/>,
    desktop: <><rect x="3" y="3" width="18" height="13" rx="2"/><path d="M8 21h8m-4-5v5"/></>,
    bolt: <path d="m13 2-9 12h7l-1 8 10-13h-7Z"/>,
    user: <><circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></>,
    users: <><circle cx="9" cy="7" r="3.5"/><path d="M2 21v-2a7 7 0 0 1 14 0v2m1-17a3.5 3.5 0 0 1 0 7m3 10v-2a6 6 0 0 0-3-5"/></>,
    crown: <><path d="m3 6 5 4 4-7 4 7 5-4-2 12H5ZM5 21h14"/></>,
    building: <><path d="M5 22V2h14v20M2 22h20M9 6h1m4 0h1M9 10h1m4 0h1M9 14h1m4 0h1m-6 8v-4h4v4"/></>,
  };
  return <svg className="fr36-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{shapes[name]}</svg>;
}

/** Private native-radio renderer. Each exported variant supplies a fixed source identity. */
export function createRadioGroup(id, config) {
  const options = config.items, values = options.map(item => item.value);
  function clean(value) {
    if (value !== null && !values.includes(value)) throw new RangeError(`${id}: unknown value`);
    return value;
  }
  return forwardRef(function RadioGroup({
    value, defaultValue, onValueChange, name, form, required = false, disabled = false,
    orientation, loop = true, itemProps = {}, labelProps = {}, className, children: _children,
    dangerouslySetInnerHTML: _html, ...native
  }, forwardedRef) {
    if (value !== undefined && defaultValue !== undefined) throw new TypeError(`${id}: value/defaultValue are exclusive`);
    if (value !== undefined) clean(value);
    if (defaultValue !== undefined) clean(defaultValue);
    if (orientation !== undefined && !['horizontal', 'vertical'].includes(orientation)) throw new RangeError(`${id}: unknown orientation`);
    const controlled = value !== undefined;
    const initial = useRef(defaultValue === undefined ? config.initial : defaultValue);
    const [stored, setStored] = useState(initial.current);
    const [focused, setFocused] = useState(null);
    const [eligible, setEligible] = useState(() => values.filter(value => !disabled && !itemProps[value]?.disabled));
    const previous = useRef({controlled, selected: controlled ? value : stored});
    const selected = controlled ? value : previous.current.controlled ? previous.current.selected : stored;
    const logical = useRef(selected), epoch = useRef(0), resetEpoch = useRef(0), sequence = useRef(0), accepted = useRef(0);
    const owner = useRef(null), mounted = useRef(false), root = useRef(null), inputs = useRef({}), activation = useRef(null), focusAttempt = useRef(null);
    const gestures = useRef(new WeakMap()), resets = useRef(new Set());
    const uid = useId();
    const rootRef = useMemo(() => node => {
      root.current = node; const cleanup = assignRef(forwardedRef, node);
      if (node) return () => { if (root.current === node) root.current = null; if (typeof cleanup === 'function') cleanup(); else assignRef(forwardedRef, null); };
    }, [forwardedRef]);
    const inputRefs = useMemo(() => Object.fromEntries(options.map(item => {
      const ref = itemProps[item.value]?.ref;
      return [item.value, node => {
        inputs.current[item.value] = node; const cleanup = assignRef(ref, node);
        if (node) return () => { if (inputs.current[item.value] === node) inputs.current[item.value] = null; if (typeof cleanup === 'function') cleanup(); else assignRef(ref, null); };
      }];
    })), options.map(item => itemProps[item.value]?.ref));
    const itemDisabled = options.map(item => !!disabled || !!itemProps[item.value]?.disabled);
    // Structured fields avoid arbitrary native name/form values colliding in a delimiter signature.
    const signature = JSON.stringify([controlled, controlled ? selected : null, name ?? null, form ?? null, !!required, !!disabled, orientation ?? null, !!loop, native.dir ?? null, itemDisabled]);
    // Form association is not value ownership: moving it must not revoke a
    // native reset already dispatched. Other owner/config changes still do.
    const resetSignature = JSON.stringify([controlled, controlled ? selected : null, name ?? null, !!required, !!disabled, orientation ?? null, !!loop, native.dir ?? null, itemDisabled]);
    const canAct = (input, stamp) => mounted.current && stamp === epoch.current && !owner.current.disabled && root.current?.contains(input) && available(input);
    function trackReset(event) {
      // Membership belongs to this dispatch, not later synchronous code after
      // form.reset() returns. Observe each remaining event-path phase after existing
      // listeners; layout commits also refresh the snapshot while eventPhase != 0.
      const read = () => Object.values(inputs.current).some(node => node?.form === event.target);
      const record = {event, associated: read(), update() { if (event.eventPhase !== 0) record.associated = read(); }};
      const observe = current => { if (current === event) record.update(); };
      const path = event.composedPath();
      for (const target of path) { target.addEventListener('reset', observe, true); target.addEventListener('reset', observe); }
      record.finish = () => {
        for (const target of path) { target.removeEventListener('reset', observe, true); target.removeEventListener('reset', observe); }
        resets.current.delete(record);
      };
      resets.current.add(record);
      return record;
    }
    function reconcile() {
      if (!mounted.current) return;
      // Native reset clears dirty checkedness. Set ALL defaults before ANY live
      // checks, otherwise a later defaultChecked write can erase a named owner.
      for (const item of options) { const input = inputs.current[item.value]; if (input) input.defaultChecked = item.value === initial.current; }
      for (const item of options) { const input = inputs.current[item.value]; if (input) input.checked = item.value === logical.current; }
    }
    useLayoutEffect(() => {
      if (previous.current.controlled && !controlled) setStored(selected);
      previous.current = {controlled, selected};
      const changed = !owner.current || owner.current.signature !== signature;
      const resetChanged = !owner.current || owner.current.resetSignature !== resetSignature;
      if (owner.current && changed) epoch.current++;
      if (owner.current && resetChanged) resetEpoch.current++;
      if (resetChanged || controlled) logical.current = selected;
      owner.current = {controlled, selected: logical.current, disabled, onValueChange, signature, resetSignature, orientation, loop};
      for (const record of resets.current) record.update();
      reconcile();
    });
    useLayoutEffect(() => {
      mounted.current = true; reconcile();
      // A new/key-replaced group may mount during another reset handler, after
      // document capture. The native default action runs after this layout.
      queueMicrotask(reconcile);
      return () => { mounted.current = false; epoch.current++; };
    }, []);
    function syncEligible() {
      if (!mounted.current) return;
      const next = values.filter(value => available(inputs.current[value]));
      setEligible(previous => previous.length === next.length && previous.every((value, index) => value === next[index]) ? previous : next);
    }
    // Native radio tabIndex values must leave an actual available entry point.
    // This only updates membership, never selection, focus or a pending proposal.
    useLayoutEffect(syncEligible);
    useLayoutEffect(() => {
      const document = root.current.ownerDocument, Observer = document.defaultView.MutationObserver;
      if (!Observer) return;
      const observer = new Observer(records => {
        const node = root.current;
        if (node && records.some(record => node.contains(record.target) || record.target.contains?.(node))) syncEligible();
      });
      observer.observe(document.documentElement, {subtree: true, childList: true, attributes: true, attributeFilter: ['disabled','hidden','inert','style','class','open']});
      return () => observer.disconnect();
    }, []);
    useLayoutEffect(() => {
      const document = root.current.ownerDocument;
      const reset = event => {
        // Capture every reset: a handler can move this group into or out of the
        // target form before the native default action. Freeze final dispatch
        // association instead of consulting a possibly changed post-return form.
        const stamp = resetEpoch.current, order = ++sequence.current, guard = observeCancellation(event), dispatch = trackReset(event);
        queueMicrotask(() => {
          try {
            if (!mounted.current) return;
            if (!dispatch.associated) return;
            if (stamp !== resetEpoch.current || order <= accepted.current || guard.canceled()) return;
            const current = owner.current;
            if (current.controlled || logical.current === initial.current) { accepted.current = order; return; }
            let veto = false;
            const details = {id, reason: 'reset', event, input: null, previousValue: logical.current, cancel() { veto = true; }};
            const result = current.onValueChange?.(initial.current, details);
            if (mounted.current && stamp === resetEpoch.current && !owner.current.controlled && !veto && result !== false && !guard.canceled()) {
              accepted.current = order; logical.current = initial.current; owner.current.selected = initial.current; setStored(initial.current);
            }
          } finally { dispatch.finish(); reconcile(); guard.restore(); }
        });
      };
      document.defaultView.addEventListener('reset', reset, true);
      return () => document.defaultView.removeEventListener('reset', reset, true);
    }, []);
    function propose(next, event, input, stamp, order, guard, key) {
      queueMicrotask(() => {
        try {
          if (!canAct(input, stamp) || order <= accepted.current || guard.canceled() || key?.guard.canceled()) return;
          if (logical.current === next) { accepted.current = order; return; }
          let veto = false;
          const details = {id, reason: key ? 'keyboard' : 'select', event: key?.event ?? event, input, previousValue: logical.current, cancel() { veto = true; }};
          const result = owner.current.onValueChange?.(next, details);
          if (!canAct(input, stamp) || veto || result === false || guard.canceled() || key?.guard.canceled()) return;
          accepted.current = order;
          if (!owner.current.controlled) { logical.current = next; owner.current.selected = next; setStored(next); }
        } finally { reconcile(); guard.restore(); }
      });
    }
    function captureGesture(event, handler) {
      // The public root/item capture callbacks belong to the same gesture as bubble.
      // Snapshot at our root boundary, before any of our exposed capture callbacks.
      const nativeEvent = event.nativeEvent;
      gestures.current.set(nativeEvent, {stamp: epoch.current, order: ++sequence.current});
      try { handler?.(event); }
      finally { queueMicrotask(reconcile); }
    }
    function click(event, next, handler) {
      const input = event.currentTarget, key = activation.current?.input === input ? activation.current : null;
      const captured = gestures.current.get(event.nativeEvent);
      const stamp = key?.stamp ?? captured?.stamp ?? epoch.current, order = key?.order ?? captured?.order ?? ++sequence.current, guard = observeCancellation(event);
      let queued = false;
      try {
        handler?.(event);
        if (!canAct(input, stamp) || guard.canceled() || key?.guard.canceled()) return;
        queued = true; propose(next, event, input, stamp, order, guard, key);
      } finally { if (!queued) { reconcile(); queueMicrotask(reconcile); guard.restore(); } }
    }
    function keyDown(event, handler) {
      const captured = gestures.current.get(event.nativeEvent);
      const input = event.currentTarget, stamp = captured?.stamp ?? epoch.current, order = captured?.order ?? ++sequence.current, guard = observeCancellation(event);
      let queued = false;
      try {
        handler?.(event);
        if (stamp !== epoch.current) {
          if (!event.isComposing && !event.nativeEvent.isComposing && event.keyCode !== 229 && (event.key === 'Enter' || (!event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey && (!event.repeat && ['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Home','End',' '].includes(event.key))))) guard.preventOwnDefault();
          return;
        }
        if (!canAct(input, stamp) || guard.canceled()) return;
        const composing = event.isComposing || event.nativeEvent.isComposing || event.keyCode === 229;
        if (event.key === 'Enter' && !composing) { guard.preventOwnDefault(); return; }
        if (composing || event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        const key = event.key;
        if (!['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Home','End',' '].includes(key)) return;
        guard.preventOwnDefault();
        // Native radios otherwise navigate on a cross-axis arrow even when the
        // caller explicitly constrains the group's orientation.
        if ((owner.current.orientation === 'horizontal' && ['ArrowDown','ArrowUp'].includes(key)) || (owner.current.orientation === 'vertical' && ['ArrowLeft','ArrowRight'].includes(key))) return;
        queued = true;
        queueMicrotask(() => {
          try {
            if (!canAct(input, stamp) || order <= accepted.current || guard.canceled() || input.ownerDocument.activeElement !== input) return;
            const enabled = options.map(item => inputs.current[item.value]).filter(node => canAct(node, stamp));
            const at = enabled.indexOf(input); if (at < 0) return;
            const rtl = input.closest('[dir]')?.getAttribute('dir') === 'rtl';
            let destination = input;
            if (key === 'Home') destination = enabled[0];
            else if (key === 'End') destination = enabled.at(-1);
            else if (key !== ' ') {
              let direction = ['ArrowDown','ArrowRight'].includes(key) ? 1 : -1;
              if (rtl && ['ArrowLeft','ArrowRight'].includes(key)) direction *= -1;
              const index = at + direction;
              destination = owner.current.loop ? enabled[(index + enabled.length) % enabled.length] : enabled[Math.max(0, Math.min(index, enabled.length - 1))];
            }
            // Inspect the actual destination FocusEvent after its full dispatch.
            // Synthetic preventDefault vetoes activation; a noncancelable native
            // focusin retains its normal semantics. Do not undo moved DOM focus.
            const attempt = {input: destination, event: null};
            focusAttempt.current = attempt;
            let focusCanceled = false;
            try { destination?.focus(); focusCanceled = !!(attempt.event?.defaultPrevented || attempt.event?.nativeEvent.defaultPrevented); }
            finally { if (focusAttempt.current === attempt) focusAttempt.current = null; }
            if (!focusCanceled && destination && !['Home','End'].includes(key) && (key === ' ' || destination !== input) && canAct(destination, stamp) && !guard.canceled() && destination.ownerDocument.activeElement === destination) {
              activation.current = {input: destination, event, guard, stamp, order};
              try { destination.click(); } finally { activation.current = null; }
            }
          } finally {
            // The native-click proposal is queued during navigation. Keep the key
            // lease through that callback, including preventDefault vetoes.
            queueMicrotask(guard.restore);
          }
        });
      } finally { if (!queued) guard.restore(); }
    }
    const enabledValues = eligible.filter(value => !itemDisabled[values.indexOf(value)]);
    const tabStop = enabledValues.includes(focused) ? focused : enabledValues.includes(selected) ? selected : enabledValues[0];
    return <div {...native} onClickCapture={event => captureGesture(event, native.onClickCapture)} onKeyDownCapture={event => captureGesture(event, native.onKeyDownCapture)} ref={rootRef} role="radiogroup" aria-label={native['aria-label'] ?? (native['aria-labelledby'] ? undefined : config.groupLabel)} aria-required={required || undefined} aria-disabled={disabled || undefined} aria-orientation={orientation} className={classes('fr36-radio-group', `fr36-${id}`, className)} data-component-id={id} data-slot="radio-group">
      {options.map((item, index) => {
        const {ref: _ref, className: inputClass, disabled: _disabled, onClick, onKeyDown, onFocus, onChange, onInput,
          type: _type, value: _value, name: _name, form: _form, checked: _checked, defaultChecked: _defaultChecked, defaultValue: _defaultValue,
          required: _required, id: _id, tabIndex: _tabIndex, children: _inputChildren, dangerouslySetInnerHTML: _inputHTML, 'aria-label': _genericName, role: _role, 'aria-checked': _ariaChecked, ...inputNative} = itemProps[item.value] ?? {};
        const {className: labelClass, children: _labelChildren, dangerouslySetInnerHTML: _labelHTML, htmlFor: _htmlFor, ...labelNative} = labelProps[item.value] ?? {};
        const inputId = `fr36-${uid}-${item.value}`, titleId = `${inputId}-label`;
        const input = <input {...inputNative} ref={inputRefs[item.value]} type="radio" id={inputId} name={name} form={form} value={item.value}
          required={required && (name ? true : selected === item.value || (selected === null && tabStop === item.value))}
          checked={selected === item.value} disabled={itemDisabled[index]} tabIndex={tabStop === item.value ? 0 : -1}
          aria-labelledby={inputNative['aria-labelledby'] ?? titleId} aria-describedby={descriptionIds(inputNative['aria-describedby'], item.price && `${inputId}-price`, item.description && `${inputId}-description`, item.badge && `${inputId}-badge`)}
          className={classes('fr36-radio', inputClass)} data-slot="radio-group-item" data-state={selected === item.value ? 'checked' : 'unchecked'}
          onClick={event => click(event, item.value, onClick)} onKeyDown={event => keyDown(event, onKeyDown)} onChange={event => onChange?.(event)} onInput={event => onInput?.(event)}
          onFocus={event => {
            const stamp = epoch.current, attempt = focusAttempt.current?.input === event.currentTarget ? focusAttempt.current : null;
            if (attempt) attempt.event = event;
            onFocus?.(event);
            if (canAct(event.currentTarget, stamp) && !event.defaultPrevented && !event.nativeEvent.defaultPrevented && event.currentTarget.ownerDocument.activeElement === event.currentTarget) setFocused(item.value);
          }} />;
        const text = <span className="fr36-copy"><span className="fr36-title-row"><span className="fr36-title" id={titleId}>{item.icon && <Icon name={item.icon}/>}<span>{item.label}</span></span>{item.badge && <span className="fr36-badge" id={`${inputId}-badge`}>{item.badge}</span>}{item.price && <span className="fr36-price" id={`${inputId}-price`}>{item.price}</span>}</span>{item.description && <span className="fr36-description" id={`${inputId}-description`}>{item.description}</span>}</span>;
        const rowProps = {'data-state': selected === item.value ? 'checked' : 'unchecked', 'data-disabled': itemDisabled[index] || undefined, 'data-value': item.value};
        return id === 'radio-group-03'
          ? <div key={item.value} {...rowProps} className="fr36-row">{input}<label {...labelNative} htmlFor={inputId} className={classes('fr36-label', labelClass)} data-slot="label">{text}</label></div>
          : <label key={item.value} {...labelNative} {...rowProps} htmlFor={inputId} className={classes('fr36-row', 'fr36-label', labelClass)} data-slot="label">{input}{text}</label>;
      })}
    </div>;
  });
}
