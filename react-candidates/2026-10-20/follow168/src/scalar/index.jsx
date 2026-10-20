import * as React from 'react';

const cx = (...parts) => parts.filter(Boolean).join(' ');
const text = value => String(value == null ? '' : value).replace(/\r\n?/g, '\n');
const own = (value) => value !== undefined;
const useClientLayout = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;
function assignRef(ref, node) { if (typeof ref === 'function') return ref(node); if (ref) ref.current = node; }
function useNodeRef(forwarded) {
  const node = React.useRef(null);
  const ref = React.useCallback(value => {
    node.current = value; const cleanup = assignRef(forwarded, value);
    if (typeof cleanup === 'function') return () => { if (node.current === value) node.current = null; cleanup(); };
  }, [forwarded]);
  return [node, ref];
}
// A document-scoped reset observer also lets a replacement mounted during an
// already-observed reset dispatch join it. The last subscriber removes the listener.
const resetScopes = new WeakMap();
function observeResets(doc, subscriber) {
  let scope = resetScopes.get(doc);
  if (!scope) {
    scope = { listeners: new Set(), active: new Set(), attached: false };
    scope.capture = event => {
      scope.active.add(event);
      for (const listener of [...scope.listeners]) listener(event);
      queueMicrotask(() => scope.active.delete(event));
    };
    resetScopes.set(doc, scope);
  }
  scope.listeners.add(subscriber);
  if (!scope.attached) { doc.addEventListener('reset', scope.capture, true); scope.attached = true; }
  for (const event of scope.active) if (event.eventPhase !== 0) subscriber(event);
  return () => {
    scope.listeners.delete(subscriber);
    if (!scope.listeners.size && scope.attached) { doc.removeEventListener('reset', scope.capture, true); scope.attached = false; }
  };
}
function descriptions(id, help, error, external) {
  return [external, help ? `${id}-help` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') || undefined;
}
function Messages({ id, help, error }) {
  return <>{help ? <p id={`${id}-help`} className="fr7-help">{help}</p> : null}{error ? <p id={`${id}-error`} className="fr7-error">{error}</p> : null}</>;
}

const Action = React.forwardRef(function Action({ kind = 'primary', readOnly = false, className, onClick, type = 'button', ...props }, ref) {
  return <button {...props} ref={ref} type={type} aria-disabled={readOnly || props['aria-disabled'] || undefined} className={cx('fr7 fr7-button', `fr7-button-${kind}`, className)} onClick={event => {
    if (readOnly || event.currentTarget.disabled || props['aria-disabled'] === true || props['aria-disabled'] === 'true') { event.preventDefault(); return; }
    onClick?.(event);
  }} />;
});
export const Button01 = React.forwardRef(function Button01({ children = '默认按钮', ...props }, ref) {
  return <Action {...props} ref={ref}>{children}</Action>;
});
export const Button02 = React.forwardRef(function Button02({ children = '上一步', nextLabel = '下一步', nextProps = {}, nextRef, groupProps = {}, ...props }, ref) {
  return <div {...groupProps} className={cx('fr7 fr7-button-pair', groupProps.className)}>
    <Action {...props} ref={ref} kind="outline"><span aria-hidden="true">←</span>{children}</Action>
    <Action disabled={props.disabled} readOnly={props.readOnly} {...nextProps} ref={nextRef} kind="outline">{nextProps.children ?? nextLabel}<span aria-hidden="true">→</span></Action>
  </div>;
});
export const Button03 = React.forwardRef(function Button03({ children = '放弃', saveLabel = '保存', saveProps = {}, saveRef, groupProps = {}, ...props }, ref) {
  return <div {...groupProps} className={cx('fr7 fr7-button-pair', groupProps.className)}>
    <Action {...props} ref={ref} kind="secondary">{children}</Action>
    <Action disabled={props.disabled} readOnly={props.readOnly} {...saveProps} ref={saveRef}>{saveProps.children ?? saveLabel}</Action>
  </div>;
});

/* Each instance owns React state plus one stable native field. Native editing is never
   delegated to the frozen DOM adapter. Refs keep synchronous callbacks/reset jobs current. */
function useField(props, forwardedRef, boolean = false, normalise = text) {
  const [node, ref] = useNodeRef(forwardedRef);
  const valueKey = boolean ? 'checked' : 'value';
  const defaultKey = boolean ? 'defaultChecked' : 'defaultValue';
  const normal = boolean ? value => !!value : normalise;
  const initial = React.useRef({ baseline: normal(props[defaultKey]), value: normal(own(props[valueKey]) ? props[valueKey] : props[defaultKey]) });
  const [state, setState] = React.useState(initial.current.value);
  const model = React.useRef(initial.current.value);
  const latest = React.useRef(props);
  const lastOwner = React.useRef({ held: own(props[valueKey]), value: normal(props[valueKey]), revision: props.ownerRevision, disabled: !!props.disabled, readOnly: !!props.readOnly });
  const life = React.useRef({ alive: false, intent: 0, owner: 0, jobs: new Set(), clicks: new Set(), composing: false, tombstone: false, tail: false, tailToken: 0, stamps: new WeakMap(), historyEpoch: 0, clickFailed: false, generation: 0 });
  const blocked = () => !!(latest.current.disabled || latest.current.readOnly || node.current?.disabled);
  function touch() {
    const l = life.current; l.intent++;
    // Ordinary edits during dispatch occur before the native reset default action.
    for (const job of l.jobs) if (job.event.eventPhase !== 0) job.intent = l.intent;
  }
  function cancelComposition() {
    const l = life.current;
    if (l.composing || l.tail) l.tombstone = true;
    l.composing = false; l.tail = false; l.tailToken++;
  }
  function draw(selection, synchronize = false) {
    const el = node.current, l = life.current;
    if (!el || !l.alive || l.composing) return;
    if (boolean) { if (synchronize || el.checked !== model.current) el.checked = model.current; }
    else if (synchronize || el.value !== model.current) {
      const range = selection || [el.selectionStart, el.selectionEnd, el.selectionDirection];
      el.value = model.current;
      if (el.ownerDocument.activeElement === el && range[0] != null) {
        el.setSelectionRange(Math.min(range[0], el.value.length), Math.min(range[1], el.value.length), range[2] || 'none');
      }
    } else if (selection && el.ownerDocument.activeElement === el) {
      el.setSelectionRange(Math.min(selection[0], el.value.length), Math.min(selection[1], el.value.length), selection[2] || 'none');
    }
  }
  function setModel(next) { model.current = next; if (life.current.alive) setState(next); }
  function propose(next, event, selection) {
    const l = life.current; if (!l.alive || blocked() || l.tombstone) { draw(); return false; }
    touch(); next = normal(next);
    const max = latest.current.maxLength;
    if (!boolean && typeof max === 'number' && max >= 0 && next.length > max) { draw(); return false; }
    const revision = l.owner, intent = l.intent, before = model.current, held = own(latest.current[valueKey]);
    let succeeded = false;
    try {
      (boolean ? latest.current.onCheckedChange : latest.current.onValueChange)?.(next, event);
      succeeded = true;
    } finally {
      if (l.alive) {
        if (succeeded && l.owner === revision && l.intent === intent && !held && !blocked()) setModel(next);
        // A committed owner update (including release) takes precedence over this event.
        draw(l.owner === revision && l.intent === intent && model.current === next ? selection : undefined);
      }
    }
    return succeeded && l.alive && l.owner === revision && l.intent === intent && model.current === next && (before !== next || !held);
  }
  useClientLayout(() => {
    const l = life.current, previous = lastOwner.current, held = own(props[valueKey]), next = normal(props[valueKey]);
    latest.current = props;
    const ownerChanged = held !== previous.held || (held && next !== previous.value) || !Object.is(props.ownerRevision, previous.revision);
    const safetyChanged = !!props.disabled !== previous.disabled || !!props.readOnly !== previous.readOnly;
    if (ownerChanged || safetyChanged) { l.owner++; l.historyEpoch++; cancelComposition(); }
    if (held) model.current = next;
    lastOwner.current = { held, value: next, revision: props.ownerRevision, disabled: !!props.disabled, readOnly: !!props.readOnly };
    // Synchronize public setters before a default-property write can implicitly
    // change a pristine field behind React's change tracking. No private React fields.
    // Same-value metadata renders preserve drafts; ownerRevision is explicit intent.
    draw(undefined, ownerChanged);
    if (node.current) {
      if (boolean) node.current.defaultChecked = held ? model.current : initial.current.baseline;
      else node.current.defaultValue = held ? model.current : initial.current.baseline;
    }
  });
  useClientLayout(() => {
    const el = node.current, l = life.current; l.alive = true; l.generation++; draw();
    const doc = el.ownerDocument;
    function reset(event) {
      if (event.target !== el.form) return;
      for (const job of [...l.clicks]) if (job.event.eventPhase === 0) job.run();
      const job = { event, form: el.form, intent: l.intent, owner: l.owner, generation: l.generation, run: null }; l.jobs.add(job);
      job.run = () => {
        if (!l.jobs.delete(job)) return false;
        if (!l.alive || l.generation !== job.generation || node.current !== el || event.defaultPrevented || l.intent !== job.intent) return;
        if (el.form !== job.form || l.owner !== job.owner) { draw(); return; }
        cancelComposition(); l.historyEpoch++;
        setModel(own(latest.current[valueKey]) ? normal(latest.current[valueKey]) : initial.current.baseline);
        // Native reset changes live values without the public property setter.
        // Reapply once even when equal so the next real same-old-value event is seen.
        draw(undefined, true); return true;
      }; queueMicrotask(job.run);
    }
    const settleResetBeforeClick = event => {
      if (!boolean || event.target !== el) return;
      let settled = false;
      for (const job of [...l.clicks]) if (job.event.eventPhase === 0) settled = job.run() || settled;
      for (const job of [...l.jobs]) if (job.event.eventPhase === 0) settled = job.run() || settled;
      if (settled && l.alive && node.current === el) Object.getOwnPropertyDescriptor(doc.defaultView.HTMLInputElement.prototype, 'checked').set.call(el, !model.current);
    };
    doc.addEventListener('click', settleResetBeforeClick, true);
    const stopReset = observeResets(doc, reset);
    return () => { l.alive = false; l.generation++; l.jobs.clear(); l.clicks.clear(); l.tailToken++; doc.removeEventListener('click', settleResetBeforeClick, true); stopReset(); };
  }, []);
  const api = { node, ref, state, model, latest, life, blocked, touch, draw, propose, cancelComposition, initial, normal };
  return api;
}

function BooleanField({ variant, forwardedRef, label, help, error, ownerRevision, checked, defaultChecked, onCheckedChange, onChange, onClick, onKeyDown, className, id: suppliedId, readOnly = false, ...native }) {
  const generated = React.useId(), id = suppliedId ?? `fr7-${generated}`;
  const props = { ...native, readOnly, checked, defaultChecked, onCheckedChange, ownerRevision };
  const f = useField(props, forwardedRef, true);
  return <div className={cx('fr7 fr7-field', `fr7-${variant}`)}>
    <div className="fr7-check-row"><span className="fr7-check-control">
      <input {...native} id={id} type="checkbox" role={variant === 'switch' ? 'switch' : undefined} readOnly={readOnly} aria-readonly={readOnly || undefined}
        aria-describedby={descriptions(id, help, error, native['aria-describedby'])} aria-invalid={error ? true : native['aria-invalid']}
        className={cx('fr7-check-input', className)} ref={f.ref} defaultChecked={f.initial.current.value}
        onClick={event => {
          const l = f.life.current, el = event.currentTarget, nativeEvent = event.nativeEvent, generation = l.generation;
          // Canceled checkbox activation can restore checked after React handlers.
          // Reconcile only after that default-action rollback, using the latest model.
          const activation = {event: nativeEvent, run: null}; l.clicks.add(activation);
          activation.run = () => {
            if (!l.clicks.delete(activation) || !l.alive || l.generation !== generation || f.node.current !== el) return false;
            f.draw(undefined, true); return true;
          };
          queueMicrotask(activation.run);
          if (f.blocked()) event.preventDefault();
          // Even a same-model click is a new intent after native reset defaults.
          if (l.alive && !f.blocked() && !event.defaultPrevented) f.touch();
          const stamp = { event, owner: l.owner, intent: l.intent, value: event.currentTarget.checked };
          l.stamps.set(event.nativeEvent, stamp);
          try { onClick?.(event); } catch (error) { stamp.failed = true; f.draw(); throw error; } finally { stamp.canceled = event.defaultPrevented || nativeEvent.defaultPrevented; }
        }}
        onChange={event => {
          const l = f.life.current, stamp = l.stamps.get(event.nativeEvent);
          const proposed = stamp?.value ?? event.currentTarget.checked, revision = stamp?.owner ?? l.owner, intent = stamp?.intent ?? l.intent;
          let normalCallback = false;
          try { onChange?.(event); normalCallback = true; } finally { if (l.alive && (!normalCallback || event.defaultPrevented || event.nativeEvent.defaultPrevented || stamp?.canceled || stamp?.event?.defaultPrevented || f.blocked() || revision !== l.owner || intent !== l.intent)) f.draw(); }
          if (!event.defaultPrevented && !event.nativeEvent.defaultPrevented && !stamp?.canceled && !stamp?.event?.defaultPrevented && !f.blocked() && !stamp?.failed && revision === l.owner && intent === l.intent) f.propose(proposed, event); else f.draw();
        }}
        onKeyDown={event => {
          const el = event.currentTarget, revision = f.life.current.owner;
          onKeyDown?.(event);
          if (variant === 'switch' && event.key === 'Enter' && !event.repeat && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey && event.keyCode !== 229 && event.nativeEvent.keyCode !== 229 && !event.nativeEvent.isComposing && !event.defaultPrevented && f.life.current.alive && revision === f.life.current.owner && !f.blocked()) { event.preventDefault(); el.click(); }
        }} />
      <span aria-hidden="true" className="fr7-check-visual" />
    </span>{label != null && label !== '' ? <label htmlFor={id} className="fr7-label">{label}</label> : null}</div>
    <Messages id={id} help={help} error={error} />
  </div>;
}
export const Checkbox01 = React.forwardRef(function Checkbox01({ label = '订阅产品更新', ...props }, ref) { return <BooleanField {...props} label={label} variant="checkbox" forwardedRef={ref} />; });
export const Switch01 = React.forwardRef(function Switch01({ label = '启用通知', ...props }, ref) { return <BooleanField {...props} label={label} variant="switch" forwardedRef={ref} />; });

// Independent fixed-slot editor. UTF-16 positions are intentionally fixed; see contract.
const positions = [0, 1, 2, 3, 5, 6, 7];
function allowed(character, slot) {
  if (character.length !== 1) return false;
  return slot === 2 || slot === 3 ? /^\p{N}$/u.test(character) : /^[A-Za-z\u00c0-\u00ff\u0400-\u04ff\u00b5]$/u.test(character) && character.toUpperCase().length === 1;
}
function maskSlots(value) {
  const source = text(value), slots = Array(7).fill('');
  if (source.includes('_') || source[4] === ' ') {
    positions.forEach((position, slot) => { if (allowed(source[position] || '', slot)) slots[slot] = source[position].toUpperCase(); });
  } else {
    let slot = 0;
    for (const character of source) {
      if (/\s/.test(character)) continue;
      if (slot >= 7) break;
      if (allowed(character, slot)) slots[slot] = character.toUpperCase();
      slot++;
    }
  }
  return slots;
}
function maskString(slots) { return slots.some(Boolean) ? slots.slice(0, 4).map(c => c || '_').join('') + ' ' + slots.slice(4).map(c => c || '_').join('') : ''; }
function maskNormal(value) { return maskString(maskSlots(value)); }
function editMask(value, start, end, data, deletion) {
  const slots = maskSlots(value); let caret = start;
  positions.forEach((position, slot) => { if (position >= start && position < end) slots[slot] = ''; });
  if (deletion) {
    if (start === end) {
      const slot = deletion === 'backward' ? positions.findLastIndex(p => p < start) : positions.findIndex(p => p >= start);
      if (slot >= 0) { slots[slot] = ''; caret = positions[slot]; }
    }
  } else {
    let slot = positions.findIndex(p => p >= start); if (slot < 0) slot = 7;
    const chars = Array.from(text(data)).filter(c => !/\s/.test(c));
    for (const c of chars) {
      if (slot >= 7) break;
      if (allowed(c, slot)) { slots[slot++] = c.toUpperCase(); }
      else if (chars.length > 1) slot++;
    }
    caret = positions[slot] ?? 8;
  }
  return { value: maskString(slots), selection: [caret, caret] };
}
function TextField({ mask = false, forwardedRef, label, help, error, id: suppliedId, className, value, defaultValue, onValueChange, ownerRevision,
  onChange, onInput, onBeforeInput, onNativeBeforeInput, onCompositionStart, onCompositionEnd, onPaste, onKeyDown, ...native }) {
  const generated = React.useId(), id = suppliedId ?? `fr7-${generated}`;
  const f = useField({ ...native, value, defaultValue, onValueChange, ownerRevision, onNativeBeforeInput }, forwardedRef, false, mask ? maskNormal : text);
  const history = React.useRef({ undo: [], redo: [], epoch: 0 });
  useClientLayout(() => { if (history.current.epoch !== f.life.current.historyEpoch) history.current = { undo: [], redo: [], epoch: f.life.current.historyEpoch }; });
  function remember(before) { const h = history.current; h.undo.push(before); if (h.undo.length > 100) h.undo.shift(); h.redo = []; }
  function propose(next, event, selection, historyEdit = false) {
    const before = f.model.current;
    const accepted = f.propose(next, event, selection);
    if (mask && accepted && before !== f.model.current && !historyEdit) remember(before);
    return accepted;
  }
  function restoreHistory(event, redo) {
    const h = history.current, from = redo ? h.redo : h.undo, to = redo ? h.undo : h.redo;
    if (!from.length) return;
    const before = f.model.current, next = from[from.length - 1];
    if (propose(next, event, undefined, true) && f.model.current === next) { from.pop(); to.push(before); }
  }
  const handlers = React.useRef(null);
  handlers.current = { propose, restoreHistory };
  useClientLayout(() => {
    const el = f.node.current, doc = el.ownerDocument;
    function before(event) {
      if (event.target !== el || !f.life.current.alive) return;
      const l = f.life.current, revision = l.owner;
      f.latest.current.onNativeBeforeInput?.(event);
      if (event.defaultPrevented || revision !== l.owner || !l.alive) return;
      if (!event.isComposing && !String(event.inputType || '').includes('Composition')) { l.tombstone = false; l.tail = false; l.tailToken++; }
      if (f.blocked()) { event.preventDefault(); return; }
      f.touch();
      if (!mask || l.composing || event.isComposing) return;
      const type = event.inputType || '';
      if (type === 'historyUndo' || type === 'historyRedo') {
        event.preventDefault(); handlers.current.restoreHistory(event, type === 'historyRedo'); return;
      }
      if (type === 'insertText' && event.data != null || type === 'deleteContentBackward' || type === 'deleteContentForward') {
        const edited = editMask(f.model.current, el.selectionStart ?? 0, el.selectionEnd ?? 0, event.data, type.startsWith('delete') ? type === 'deleteContentBackward' ? 'backward' : 'forward' : null);
        // Preventing the browser mutation is internal, not a consumer veto.
        event.preventDefault(); handlers.current.propose(edited.value, event, edited.selection);
      }
    }
    doc.addEventListener('beforeinput', before);
    return () => doc.removeEventListener('beforeinput', before);
  }, []);
  function input(event) {
    const l = f.life.current;
    if (l.alive && !event.defaultPrevented && !f.blocked() && !l.tombstone && !l.tail) f.touch();
    const stamp = { owner: l.owner, intent: l.intent, value: event.currentTarget.value };
    l.stamps.set(event.nativeEvent, stamp);
    try { onInput?.(event); } catch (error) { stamp.failed = true; f.draw(); throw error; }
    if (f.blocked() || l.tombstone || l.tail) f.draw();
  }
  function change(event) {
    const l = f.life.current, stamp = l.stamps.get(event.nativeEvent);
    const revision = stamp?.owner ?? l.owner, intent = stamp?.intent ?? l.intent, proposed = stamp?.value ?? event.currentTarget.value;
    let normalCallback = false;
    try { onChange?.(event); normalCallback = true; } finally { if (!normalCallback || event.defaultPrevented || revision !== l.owner || intent !== l.intent || f.blocked()) f.draw(); }
    if (!l.alive || stamp?.failed || event.defaultPrevented || revision !== l.owner || intent !== l.intent || f.blocked()) return;
    if (l.composing || event.nativeEvent.isComposing) { f.touch(); return; }
    if (l.tombstone || l.tail) { f.draw(); return; }
    propose(proposed, event);
  }
  const common = {
    ...native, id, ref: f.ref, defaultValue: f.initial.current.value,
    'aria-describedby': descriptions(id, help, error, native['aria-describedby']),
    'aria-invalid': error ? true : native['aria-invalid'],
    'aria-label': native['aria-label'] ?? (label ? undefined : mask ? '许可代码' : '文本输入'),
    className: cx(mask ? 'fr7-text-input' : 'fr7-textarea', className),
    onInput: input, onChange: change, onBeforeInput,
    onCompositionStart: event => {
      const l = f.life.current, revision = l.owner;
      onCompositionStart?.(event);
      if (!l.alive || revision !== l.owner || f.blocked() || event.defaultPrevented) return;
      l.tombstone = false; l.tail = false; l.tailToken++; l.composing = true; f.touch();
    },
    onCompositionEnd: event => {
      const l = f.life.current, revision = l.owner, wasComposing = l.composing, proposed = event.currentTarget.value;
      try { onCompositionEnd?.(event); } catch (error) { f.cancelComposition(); f.draw(); throw error; }
      if (!l.alive || revision !== l.owner || !wasComposing || l.tombstone || f.blocked()) { f.draw(); return; }
      l.composing = false; l.tail = true; const token = ++l.tailToken;
      try { if (!event.defaultPrevented) propose(proposed, event); else f.draw(); }
      finally { queueMicrotask(() => { if (l.alive && l.tailToken === token) l.tail = false; }); }
    },
    onPaste: event => {
      const l = f.life.current, revision = l.owner, el = event.currentTarget;
      onPaste?.(event);
      if (!mask || event.defaultPrevented || !l.alive || revision !== l.owner || f.blocked() || l.composing) return;
      l.tombstone = false; l.tail = false;
      const edited = editMask(f.model.current, el.selectionStart ?? 0, el.selectionEnd ?? 0, event.clipboardData.getData('text'), null);
      event.preventDefault(); propose(edited.value, event, edited.selection);
    },
    onKeyDown: event => {
      const l = f.life.current, revision = l.owner;
      onKeyDown?.(event);
      if (!mask || !l.alive || revision !== l.owner || event.defaultPrevented || f.blocked() || l.composing || event.nativeEvent.isComposing || event.altKey) return;
      if ((event.ctrlKey || event.metaKey) && ['z', 'y'].includes(event.key.toLowerCase())) {
        event.preventDefault(); restoreHistory(event, event.key.toLowerCase() === 'y' || event.shiftKey);
      }
    }
  };
  return <div className={cx('fr7 fr7-field', mask ? 'fr7-mask' : 'fr7-textarea-field')}>
    {label != null && label !== '' ? <label className="fr7-label" htmlFor={id}>{label}</label> : null}
    {mask ? <span className="fr7-mask-wrap"><span aria-hidden="true" className="fr7-identity-icon">▤</span><input {...common} type="text" /></span> : <textarea {...common} />}
    <Messages id={id} help={help} error={error} />
  </div>;
}
export const InputMask01 = React.forwardRef(function InputMask01({ label = '许可代码', help = '请按指定格式输入代码', placeholder = 'AB12 CDE', ...props }, ref) {
  return <TextField {...props} label={label} help={help} placeholder={placeholder} mask forwardedRef={ref} />;
});
export const Textarea01 = React.forwardRef(function Textarea01({ placeholder = '写点什么……', ...props }, ref) {
  return <TextField {...props} placeholder={placeholder} forwardedRef={ref} />;
});
