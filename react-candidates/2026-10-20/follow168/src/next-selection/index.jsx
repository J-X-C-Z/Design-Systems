import * as React from 'react';
import { Checkbox01, Switch01, Textarea01 } from '../scalar/index.jsx';

const cx = (...parts) => parts.filter(Boolean).join(' ');
const held = value => value !== undefined;
const useLayout = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;
const encode = value => (value?.checked ? 1 : 0) | (value?.indeterminate ? 2 : 0);
const decode = value => ({ checked: !!(value & 1), indeterminate: !!(value & 2) });
const resetScopes = new WeakMap();
// Same lifecycle as the scalar field, but the pair is one atomic React model.
function subscribeReset(doc, listener) {
  let scope = resetScopes.get(doc);
  if (!scope) {
    scope = { listeners: new Set(), active: new Set(), attached: false };
    scope.capture = event => {
      scope.active.add(event); for (const fn of [...scope.listeners]) fn(event);
      queueMicrotask(() => scope.active.delete(event));
    };
    resetScopes.set(doc, scope);
  }
  scope.listeners.add(listener);
  if (!scope.attached) { doc.addEventListener('reset', scope.capture, true); scope.attached = true; }
  for (const event of scope.active) if (event.eventPhase !== 0) listener(event);
  return () => {
    scope.listeners.delete(listener);
    if (!scope.listeners.size && scope.attached) { doc.removeEventListener('reset', scope.capture, true); scope.attached = false; }
  };
}
function useMixed(props, forwardedRef) {
  const node = React.useRef(null);
  const ref = React.useCallback(el => {
    node.current = el;
    if (typeof forwardedRef === 'function') {
      const cleanup = forwardedRef(el);
      if (typeof cleanup === 'function') return () => { if (node.current === el) node.current = null; cleanup(); };
    } else if (forwardedRef) forwardedRef.current = el;
  }, [forwardedRef]);
  const initial = React.useRef({ baseline: encode(props.defaultValue), value: encode(held(props.value) ? props.value : props.defaultValue) });
  const [state, setState] = React.useState(initial.current.value);
  const model = React.useRef(initial.current.value), latest = React.useRef(props);
  const life = React.useRef({ alive: false, generation: 0, owner: 0, intent: 0, jobs: new Set(), clicks: new Set(), stamps: new WeakMap() });
  const previous = React.useRef({ held: held(props.value), value: encode(props.value), revision: props.ownerRevision, disabled: !!props.disabled, readOnly: !!props.readOnly });
  const blocked = () => !!(latest.current.disabled || latest.current.readOnly || node.current?.disabled);
  function draw(force = false) {
    const el = node.current;
    if (!el || !life.current.alive) return;
    const next = decode(model.current);
    if (force || el.checked !== next.checked) el.checked = next.checked;
    el.indeterminate = next.indeterminate;
    // The DOM property is the native visual state; ARIA follows the same model.
    el.setAttribute('aria-checked', next.indeterminate ? 'mixed' : String(next.checked));
  }
  function touch() {
    const l = life.current; l.intent++;
    for (const job of l.jobs) if (job.event.eventPhase !== 0) job.intent = l.intent;
  }
  function commit(value) { model.current = value; if (life.current.alive) setState(value); }
  function propose(checked, event) {
    const l = life.current;
    if (!l.alive || blocked()) { draw(); return; }
    touch(); const owner = l.owner, intent = l.intent, owned = held(latest.current.value), next = checked ? 1 : 0;
    let succeeded = false;
    try { latest.current.onValueChange?.(decode(next), event); succeeded = true; }
    finally {
      if (l.alive) {
        if (succeeded && owner === l.owner && intent === l.intent && !owned && !blocked()) commit(next);
        draw();
      }
    }
  }
  useLayout(() => {
    const l = life.current, old = previous.current, owned = held(props.value), next = encode(props.value);
    latest.current = props;
    const changed = owned !== old.held || (owned && next !== old.value) || !Object.is(props.ownerRevision, old.revision) || !!props.disabled !== old.disabled || !!props.readOnly !== old.readOnly;
    if (changed) l.owner++;
    if (owned) model.current = next;
    previous.current = { held: owned, value: next, revision: props.ownerRevision, disabled: !!props.disabled, readOnly: !!props.readOnly };
    draw(changed);
    if (node.current) node.current.defaultChecked = !!((owned ? model.current : initial.current.baseline) & 1);
  });
  useLayout(() => {
    const el = node.current, l = life.current; l.alive = true; l.generation++; draw();
    const stop = subscribeReset(el.ownerDocument, event => {
      if (event.target !== el.form) return;
      for (const job of [...l.clicks]) if (job.event.eventPhase === 0) job.run();
      const job = { event, form: el.form, generation: l.generation, intent: l.intent, owner: l.owner, run: null }; l.jobs.add(job);
      job.run = () => {
        if (!l.jobs.delete(job)) return false;
        if (!l.alive || l.generation !== job.generation || node.current !== el || event.defaultPrevented || l.intent !== job.intent) return;
        if (el.form !== job.form || l.owner !== job.owner) { draw(); return; }
        commit(held(latest.current.value) ? encode(latest.current.value) : initial.current.baseline);
        draw(true); return true;
      }; queueMicrotask(job.run);
    });
    const doc=el.ownerDocument, settleResetBeforeClick=event=>{
      if(event.target!==el)return;let settled=false;
      for(const job of [...l.clicks])if(job.event.eventPhase===0)settled=job.run()||settled;
      for(const job of [...l.jobs])if(job.event.eventPhase===0)settled=job.run()||settled;
      if(settled&&l.alive&&node.current===el)Object.getOwnPropertyDescriptor(doc.defaultView.HTMLInputElement.prototype,'checked').set.call(el,!(model.current & 1));
    };
    doc.addEventListener('click',settleResetBeforeClick,true);
    return () => { l.alive = false; l.generation++; l.jobs.clear(); l.clicks.clear(); doc.removeEventListener('click',settleResetBeforeClick,true); stop(); };
  }, []);
  return { node, ref, initial, state, model, life, latest, blocked, draw, touch, propose };
}

/** One atomic {checked, indeterminate} state, initially false/true. */
export const Checkbox02 = React.forwardRef(function Checkbox02({
  value, defaultValue = { checked: false, indeterminate: true }, onValueChange, ownerRevision,
  label = '启用测试版功能', help = '仅完成部分选择时，可使用此状态。', error,
  id: suppliedId, className, readOnly = false, submissionValue = 'on', onClick, onChange,
  checked: ignoredChecked, defaultChecked: ignoredDefaultChecked, onCheckedChange: ignoredCheckedChange,
  ...native
}, ref) {
  const generated = React.useId(), id = suppliedId ?? `fr7-mixed-${generated}`;
  const f = useMixed({ value, defaultValue, onValueChange, ownerRevision, readOnly, disabled: native.disabled }, ref);
  const effective = decode(held(value) ? encode(value) : f.model.current);
  const described = [native['aria-describedby'], help ? `${id}-help` : null, error ? `${id}-error` : null].filter(Boolean).join(' ') || undefined;
  return <div className="fr7 fr7-next-selection fr7-checkbox-02" data-component-id="checkbox-02">
    <span className="fr7-check-control">
      <input {...native} ref={f.ref} id={id} type="checkbox" value={submissionValue} readOnly={readOnly}
        defaultChecked={!!(f.initial.current.value & 1)} aria-checked={effective.indeterminate ? 'mixed' : effective.checked}
        aria-readonly={readOnly || undefined} aria-invalid={error ? true : native['aria-invalid']} aria-describedby={described}
        className={cx('fr7-check-input', className)} onClick={event => {
          const l = f.life.current, el = event.currentTarget, nativeEvent = event.nativeEvent, generation = l.generation;
          const activation = {event: nativeEvent, run: null}; l.clicks.add(activation);
          activation.run = () => {
            if (!l.clicks.delete(activation) || !l.alive || l.generation !== generation || f.node.current !== el) return false;
            f.draw(true); return true;
          };
          queueMicrotask(activation.run);
          if (f.blocked()) event.preventDefault();
          if (l.alive && !f.blocked() && !event.defaultPrevented) f.touch();
          const stamp = { event, owner: l.owner, intent: l.intent, value: el.checked }; l.stamps.set(nativeEvent, stamp);
          try { onClick?.(event); stamp.canceled = event.defaultPrevented || nativeEvent.defaultPrevented; } catch (error) { stamp.failed = true; f.draw(); throw error; }
        }} onChange={event => {
          const l = f.life.current, stamp = l.stamps.get(event.nativeEvent), owner = stamp?.owner ?? l.owner, intent = stamp?.intent ?? l.intent, next = stamp?.value ?? event.currentTarget.checked;
          let succeeded = false;
          try { onChange?.(event); succeeded = true; }
          finally { if (!succeeded || event.defaultPrevented || event.nativeEvent.defaultPrevented || stamp?.canceled || stamp?.event?.defaultPrevented || f.blocked() || owner !== l.owner || intent !== l.intent) f.draw(); }
          if (succeeded && l.alive && !stamp?.failed && !stamp?.canceled && !stamp?.event?.defaultPrevented && !event.defaultPrevented && !event.nativeEvent.defaultPrevented && !f.blocked() && owner === l.owner && intent === l.intent) f.propose(next, event); else f.draw();
        }} />
      <span className="fr7-check-visual" aria-hidden="true" />
    </span>
    <div className="fr7-selection-copy">
      {label != null && label !== '' ? <label className="fr7-label" htmlFor={id}>{label}</label> : null}
      {help ? <p id={`${id}-help`} className="fr7-help">{help}</p> : null}
      {error ? <p id={`${id}-error`} className="fr7-error">{error}</p> : null}
    </div>
  </div>;
});

export const Checkbox03 = React.forwardRef(function Checkbox03({ label = '订阅产品更新', ...props }, ref) {
  return <div className="fr7-next-selection fr7-checkbox-03" data-component-id="checkbox-03"><Checkbox01 {...props} label={label} ref={ref} /></div>;
});
export const Checkbox04 = React.forwardRef(function Checkbox04({ label = '检查每周任务', defaultChecked = true, ...props }, ref) {
  return <div className="fr7-next-selection fr7-checkbox-04" data-component-id="checkbox-04"><Checkbox01 {...props} label={label} defaultChecked={defaultChecked} ref={ref} /></div>;
});
export const Switch02 = React.forwardRef(function Switch02({ label = null, 'aria-label': ariaLabel = '方形开关', ...props }, ref) {
  return <div className="fr7-next-selection fr7-switch-02" data-component-id="switch-02"><Switch01 {...props} label={label} aria-label={ariaLabel} ref={ref} /></div>;
});
export const SWITCH03_SLOTS = Object.freeze([
  Object.freeze({ key: 'destructive', label: '危险开关', defaultChecked: true }),
  Object.freeze({ key: 'success', label: '成功开关', defaultChecked: true }),
  Object.freeze({ key: 'info', label: '信息开关', defaultChecked: true }),
  Object.freeze({ key: 'warning', label: '警告开关', defaultChecked: true })
]);
/** A fixed four-member composition. Each member owns its scalar state separately. */
export const Switch03 = React.forwardRef(function Switch03({ disabled, readOnly, ownerRevision, form, onChange,
  destructive = {}, success = {}, info = {}, warning = {},
  destructiveRef, successRef, infoRef, warningRef,
  value: ignoredValue, defaultValue: ignoredDefaultValue, values: ignoredValues, defaultValues: ignoredDefaultValues,
  onValueChange: ignoredValueChange, ...groupProps
}, ref) {
  const members = { destructive, success, info, warning }, refs = { destructive: destructiveRef, success: successRef, info: infoRef, warning: warningRef };
  return <div {...groupProps} ref={ref} className={cx('fr7-next-selection fr7-switch-03', groupProps.className)} data-component-id="switch-03">
    {SWITCH03_SLOTS.map(({ key: slot, label: name }) => {
      const member = members[slot] ?? {};
      return <div className={`fr7-switch-tone fr7-switch-tone-${slot}`} data-switch-slot={slot} key={slot}>
        <Switch01 label={null}
          {...member} form={member.form ?? form} defaultChecked={member.defaultChecked === undefined ? true : member.defaultChecked} aria-label={member['aria-label'] ?? (member.label != null && member.label !== '' ? undefined : name)} disabled={!!(disabled || member.disabled)} readOnly={!!(readOnly || member.readOnly)}
          ownerRevision={JSON.stringify([ownerRevision ?? null, member.ownerRevision ?? null])} onChange={event => { member.onChange?.(event); if (!event.defaultPrevented) onChange?.(event); }} ref={refs[slot]} />
      </div>;
    })}
  </div>;
});
export const Switch04 = React.forwardRef(function Switch04({ label = null, 'aria-label': ariaLabel = '危险开关', ...props }, ref) {
  return <div className="fr7-next-selection fr7-switch-04" data-component-id="switch-04"><Switch01 {...props} label={label} aria-label={ariaLabel} ref={ref} /></div>;
});
export const Textarea02 = React.forwardRef(function Textarea02({ label = '你的输入', placeholder = '分享你的想法……', ...props }, ref) {
  return <div className="fr7-next-selection fr7-textarea-02" data-component-id="textarea-02"><Textarea01 {...props} label={label} placeholder={placeholder} ref={ref} /></div>;
});
