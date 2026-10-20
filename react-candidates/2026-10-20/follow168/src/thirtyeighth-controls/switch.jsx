import React, {forwardRef, useId, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {available, observeCancellation} from '../thirtieth-controls/owner.js';

const id = 'switch-19';
const classes = (...parts) => parts.filter(Boolean).join(' ');
const assignRef = (ref, node) => { if (typeof ref === 'function') return ref(node); if (ref) ref.current = node; };
const descriptionIds = (...parts) => [...new Set(parts.filter(Boolean).flatMap(part => part.split(/\s+/)))].join(' ') || undefined;

/** Auto sync is a local native form control; no synchronization service is invoked. */
export const Switch19 = forwardRef(function Switch19({
  checked, defaultChecked, onCheckedChange, name, value, form, required = false,
  disabled = false, readOnly = false, id: suppliedId, className, rootProps = {},
  onClick, onKeyDown, onInput, onChange,
  children: _children, dangerouslySetInnerHTML: _html, type: _type, role: _role,
  'aria-checked': _ariaChecked, 'aria-label': _genericLabel, ...native
}, forwardedRef) {
  if (checked !== undefined && defaultChecked !== undefined) throw new TypeError(`${id}: checked/defaultChecked are exclusive`);
  if (checked !== undefined && typeof checked !== 'boolean') throw new TypeError(`${id}: checked must be a boolean`);
  if (defaultChecked !== undefined && typeof defaultChecked !== 'boolean') throw new TypeError(`${id}: defaultChecked must be a boolean`);
  const controlled = checked !== undefined;
  const initial = useRef(defaultChecked === undefined ? true : defaultChecked);
  const [stored, setStored] = useState(initial.current);
  const previous = useRef({controlled, checked: controlled ? checked : stored});
  const selected = controlled ? checked : previous.current.controlled ? previous.current.checked : stored;
  const logical = useRef(selected), epoch = useRef(0), resetEpoch = useRef(0), sequence = useRef(0), accepted = useRef(0);
  const owner = useRef(null), mounted = useRef(false), root = useRef(null), input = useRef(null), activation = useRef(null);
  const gestures = useRef(new WeakMap()), resets = useRef(new Set());
  const uid = useId(), inputId = suppliedId ?? `fr38-switch-${uid}`, titleId = `${inputId}-label`, descriptionId = `${inputId}-description`;
  const inputRef = useMemo(() => node => {
    input.current = node; const cleanup = assignRef(forwardedRef, node);
    if (node) return () => { if (input.current === node) input.current = null; if (typeof cleanup === 'function') cleanup(); else assignRef(forwardedRef, null); };
  }, [forwardedRef]);
  const rootRef = useMemo(() => node => {
    root.current = node; const cleanup = assignRef(rootProps.ref, node);
    if (node) return () => { if (root.current === node) root.current = null; if (typeof cleanup === 'function') cleanup(); else assignRef(rootProps.ref, null); };
  }, [rootProps.ref]);
  // Do not concatenate native name/value/form: arbitrary strings may contain delimiters.
  const signature = JSON.stringify([controlled, controlled ? selected : null, name ?? null, value ?? null, form ?? null, !!required, !!disabled, !!readOnly, inputId]);
  // Form association is not value ownership: moving it must not revoke a
  // native reset already dispatched. Other owner/config changes still do.
  const resetSignature = JSON.stringify([controlled, controlled ? selected : null, name ?? null, value ?? null, !!required, !!disabled, !!readOnly, inputId]);
  const canReceive = (node, stamp) => mounted.current && stamp === epoch.current && !owner.current.disabled && input.current === node && root.current?.contains(node) && available(node);
  const canAct = (node, stamp) => canReceive(node, stamp) && !owner.current.readOnly && !node.readOnly;
  function trackReset(event) {
    // Membership belongs to this dispatch, not later synchronous code after
    // form.reset() returns. Observe each remaining event-path phase after existing
    // listeners; layout commits also refresh the snapshot while eventPhase != 0.
    const read = () => input.current?.form === event.target;
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
    if (!mounted.current || !input.current) return;
    input.current.defaultChecked = initial.current;
    input.current.checked = logical.current;
  }
  useLayoutEffect(() => {
    if (previous.current.controlled && !controlled) setStored(selected);
    previous.current = {controlled, checked: selected};
    const changed = !owner.current || owner.current.signature !== signature;
    const resetChanged = !owner.current || owner.current.resetSignature !== resetSignature;
    if (owner.current && changed) epoch.current++;
    if (owner.current && resetChanged) resetEpoch.current++;
    if (resetChanged || controlled) logical.current = selected;
    owner.current = {controlled, checked: logical.current, disabled, readOnly, onCheckedChange, signature, resetSignature};
    for (const record of resets.current) record.update();
    reconcile();
  });
  useLayoutEffect(() => {
    mounted.current = true; reconcile();
    // A controlled input can mount/key-replace inside another form-reset listener.
    // Its native default action follows this layout, so restore the committed owner.
    queueMicrotask(reconcile);
    return () => { mounted.current = false; epoch.current++; };
  }, []);
  useLayoutEffect(() => {
    const document = input.current.ownerDocument;
    const reset = event => {
      // Membership can change in any reset listener. Capture every document reset
      // and freeze association during dispatch, before later post-return changes.
      const stamp = resetEpoch.current, order = ++sequence.current, guard = observeCancellation(event), dispatch = trackReset(event);
      queueMicrotask(() => {
        try {
          if (!mounted.current || !dispatch.associated) return;
          if (stamp !== resetEpoch.current || order <= accepted.current || guard.canceled()) return;
          const current = owner.current;
          if (current.controlled || logical.current === initial.current) { accepted.current = order; return; }
          let veto = false;
          const details = {id, reason: 'reset', event, input: input.current, previousChecked: logical.current, cancel() { veto = true; }};
          const result = current.onCheckedChange?.(initial.current, details);
          if (mounted.current && stamp === resetEpoch.current && dispatch.associated && !owner.current.controlled && !veto && result !== false && !guard.canceled()) {
            accepted.current = order; logical.current = initial.current; owner.current.checked = initial.current; setStored(initial.current);
          }
        } finally { dispatch.finish(); reconcile(); guard.restore(); }
      });
    };
    document.defaultView.addEventListener('reset', reset, true);
    return () => document.defaultView.removeEventListener('reset', reset, true);
  }, []);
  function propose(event, node, stamp, order, guard, key) {
    queueMicrotask(() => {
      try {
        if (!canAct(node, stamp) || order <= accepted.current || guard.canceled() || key?.guard.canceled()) return;
        // Toggle the accepted logical state, never transient browser checkedness.
        // React restores controlled DOM after each native click, including multiple
        // clicks/reset operations in one task before a render can commit.
        const next = !logical.current;
        let veto = false;
        const details = {id, reason: key ? 'keyboard' : 'select', event: key?.event ?? event, input: node, previousChecked: logical.current, cancel() { veto = true; }};
        const result = owner.current.onCheckedChange?.(next, details);
        if (!canAct(node, stamp) || veto || result === false || guard.canceled() || key?.guard.canceled()) return;
        accepted.current = order;
        if (!owner.current.controlled) { logical.current = next; owner.current.checked = next; setStored(next); }
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
  function click(event) {
    const node = event.currentTarget, key = activation.current?.input === node ? activation.current : null;
    const captured = gestures.current.get(event.nativeEvent);
    const stamp = key?.stamp ?? captured?.stamp ?? epoch.current, order = key?.order ?? captured?.order ?? ++sequence.current, guard = observeCancellation(event);
    let queued = false;
    try {
      onClick?.(event);
      if (!canAct(node, stamp) || guard.canceled() || key?.guard.canceled()) return;
      queued = true; propose(event, node, stamp, order, guard, key);
    } finally {
      if (!queued) {
        reconcile();
        // A canceled checkbox activation may restore native checkedness after
        // the listener returns. Reconcile once more after that default action.
        queueMicrotask(reconcile); guard.restore();
      }
    }
  }
  function keyDown(event) {
    const captured = gestures.current.get(event.nativeEvent);
    const node = event.currentTarget, stamp = captured?.stamp ?? epoch.current, order = captured?.order ?? ++sequence.current, guard = observeCancellation(event);
    let queued = false;
    try {
      onKeyDown?.(event);
      if (stamp !== epoch.current) {
        if (!event.isComposing && !event.nativeEvent.isComposing && event.keyCode !== 229 && (event.key === 'Enter' || (!event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey && (event.key === ' ')))) guard.preventOwnDefault();
        return;
      }
      if (!canReceive(node, stamp) || guard.canceled()) return;
      const composing = event.isComposing || event.nativeEvent.isComposing || event.keyCode === 229;
      if (event.key === 'Enter' && !composing) { guard.preventOwnDefault(); return; }
      if (composing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.key !== ' ') return;
      guard.preventOwnDefault();
      if (event.repeat || !canAct(node, stamp)) return;
      queued = true;
      queueMicrotask(() => {
        try {
          if (!canAct(node, stamp) || order <= accepted.current || guard.canceled() || node.ownerDocument.activeElement !== node) return;
          // Do not focus(): a caller may have intentionally moved focus elsewhere.
          activation.current = {input: node, event, guard, stamp, order};
          try { node.click(); } finally { activation.current = null; }
        } finally {
          // Keep the key cancellation lease until its queued native-click proposal.
          queueMicrotask(guard.restore);
        }
      });
    } finally { if (!queued) guard.restore(); }
  }
  const {ref: _rootRef, className: rootClass, children: _rootChildren, dangerouslySetInnerHTML: _rootHTML, ...rootNative} = rootProps;
  const state = selected ? 'checked' : 'unchecked';
  return <div {...rootNative} onClickCapture={event => captureGesture(event, rootNative.onClickCapture)} onKeyDownCapture={event => captureGesture(event, rootNative.onKeyDownCapture)} ref={rootRef} className={classes('fr38-switch-card', rootClass)} data-component-id={id} data-state={state} data-disabled={disabled || undefined} data-readonly={readOnly || undefined}>
    <label htmlFor={inputId} className="fr38-switch-label">
      <span id={titleId} className="fr38-switch-title">Auto sync</span>
      <span id={descriptionId} className="fr38-switch-description">{selected ? 'Changes sync instantly' : 'Manual updates only'}</span>
    </label>
    <input {...native} ref={inputRef} id={inputId} type="checkbox" role="switch" name={name} value={value} form={form}
      checked={selected} required={required} disabled={disabled} readOnly={readOnly}
      aria-labelledby={native['aria-labelledby'] ?? titleId} aria-describedby={descriptionIds(native['aria-describedby'], descriptionId)}
      className={classes('fr38-switch-input', className)} data-slot="switch" data-state={state}
      onClick={click} onKeyDown={keyDown} onInput={event => onInput?.(event)} onChange={event => onChange?.(event)} />
    <span className="fr38-switch-status" aria-live="polite" aria-atomic="true">Auto sync is {selected ? 'enabled' : 'disabled'}</span>
  </div>;
});
