import DATA from './data.json';
import {observeCancellation} from './engine.jsx';
import React, { forwardRef, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';

const classes = (...values) => values.filter(Boolean).join(' ');
const radioOptions = DATA['collapsible-09'].deliveryOptions.map(x=>[x.value,x.label]);

const wasCanceled = event => !!event?.defaultPrevented || !!event?.nativeEvent?.defaultPrevented;
const assignRef = (ref, node) => { if (typeof ref === 'function') return ref(node); if (ref) ref.current = node; };
const liveEnabled = node => !!node?.isConnected && !node.matches(':disabled');
function radioValue(value) {
  if (value !== null && !radioOptions.some(([key]) => key === value)) throw new RangeError('DeliveryChoices: value must be 1,2,3 or null');
  return value;
}
const same = (a, b) => a.length === b.length && a.every((id, i) => id === b[i]);

// The component owns the keyboard default (no page scroll or second native radio
// navigation). Observe subsequent preventDefault calls as distinct user vetoes,
// including native ancestors after React's delegated event handler has run.
function ownKeyboardDefault(event){const guard=observeCancellation(event);guard.preventOwnDefault();return guard;}

/** Source radio-group-02: three vertically stacked dashed radio circles. */
export const DeliveryChoices = forwardRef(function DeliveryChoices({
  value, defaultValue, onValueChange, name, form, required = false, disabled = false,
  itemProps = {}, labelProps = {}, className, children: _children,
  dangerouslySetInnerHTML: _html, ...native
}, ref) {
  if (value !== undefined && defaultValue !== undefined) throw new TypeError('DeliveryChoices: value/defaultValue are mutually exclusive');
  if (value !== undefined) radioValue(value);
  if (defaultValue !== undefined) radioValue(defaultValue);
  const controlled = value !== undefined;
  const initial = useRef(defaultValue === undefined ? '2' : defaultValue);
  const [stored, setStored] = useState(initial.current);
  const [focusedId, setFocusedId] = useState(null);
  const priorOwner = useRef({controlled,selected:controlled?value:stored});
  const selected = controlled ? value : priorOwner.current.controlled ? priorOwner.current.selected : stored;
  // Owner changes invalidate queued work. Event order is separate: only an
  // accepted action supersedes earlier work, so a canceled click cannot swallow
  // a native reset dispatched just before it. logical bridges batched commits.
  const logical = useRef(selected), sequence = useRef(0), accepted = useRef(0);
  const uid = useId(), groupName = name;
  const inputs = useRef({}), mounted = useRef(false), serial = useRef(0), owner = useRef(null), activation = useRef(null);
  const inputRefs = useMemo(() => Object.fromEntries(radioOptions.map(([id]) => {
    const inputRef = itemProps[id]?.ref;
    return [id, node => {
      inputs.current[id] = node;
      const cleanup = assignRef(inputRef, node);
      if (node) return () => {
        if (inputs.current[id] === node) inputs.current[id] = null;
        if (typeof cleanup === 'function') cleanup(); else assignRef(inputRef, null);
      };
    }];
  })), [itemProps['1']?.ref, itemProps['2']?.ref, itemProps['3']?.ref]);
  const itemDisabled = radioOptions.map(([id]) => !!disabled || !!itemProps[id]?.disabled);
  const signature = `${controlled}|${controlled ? selected : ''}|${groupName}|${form}|${required}|${itemDisabled.join(',')}`;
  function reconcile() {
    if (!mounted.current) return;
    // Native reset clears dirty checkedness. Set every baseline before any live
    // checkedness: a later defaultChecked=true can otherwise uncheck an earlier
    // selected radio in the same named group even though its owner did not change.
    radioOptions.forEach(([id]) => {
      const input = inputs.current[id];
      if (input) input.defaultChecked = id === initial.current;
    });
    radioOptions.forEach(([id]) => {
      const input = inputs.current[id];
      if (input) input.checked = id === logical.current;
    });
  }
  useLayoutEffect(() => {
    if(priorOwner.current.controlled&&!controlled)setStored(selected);
    priorOwner.current={controlled,selected};
    const changed = !owner.current || owner.current.signature !== signature;
    if (owner.current && changed) serial.current++;
    if (changed || controlled) logical.current = selected;
    owner.current = { controlled, selected: logical.current, disabled, onValueChange, signature };
    reconcile();
  });
  useLayoutEffect(() => {
    mounted.current = true; reconcile();
    return () => { mounted.current = false; serial.current++; };
  }, []);
  // Actual form ownership comes from the input, including the HTML form attribute.
  // Rebind after every render so external form changes cannot leave stale listeners.
  useLayoutEffect(() => {
    const forms = new Set(Object.values(inputs.current).map(input => input?.form).filter(Boolean));
    const reset = event => {
      const ticket = serial.current, order = ++sequence.current;
      queueMicrotask(() => {
        if (!mounted.current) return;
        if (ticket !== serial.current || order <= accepted.current) { reconcile(); return; }
        const current = owner.current;
        if (event.defaultPrevented) { reconcile(); return; }
        if (current.controlled || logical.current === initial.current) {
          accepted.current = order;
          reconcile();
          return;
        }
        let vetoed = false;
        const detail = { id: 'collapsible-09', fieldId: 'delivery', reason: 'reset', event, input: null, previousValue: logical.current, cancel() { vetoed = true; } };
        const result = current.onValueChange?.(initial.current, detail);
        if (!mounted.current || ticket !== serial.current) return;
        if (result !== false && !vetoed && !event.defaultPrevented && !owner.current.controlled) {
          accepted.current = order;
          logical.current = initial.current;
          owner.current.selected = initial.current;
          setStored(initial.current);
        }
        reconcile();
      });
    };
    forms.forEach(ownerForm => ownerForm.addEventListener('reset', reset));
    return () => forms.forEach(ownerForm => ownerForm.removeEventListener('reset', reset));
  });
  function propose(id, event, input, keyActivation) {
    const ticket = keyActivation?.ticket ?? serial.current;
    const order = keyActivation?.order ?? ++sequence.current;
    queueMicrotask(() => {
      if (!mounted.current) return;
      if (ticket !== serial.current || order <= accepted.current) { reconcile(); return; }
      const current = owner.current;
      if (wasCanceled(event) || keyActivation?.guard.canceled() || current.disabled || !liveEnabled(input)) { reconcile(); return; }
      if (logical.current === id) { accepted.current = order; reconcile(); return; }
      let vetoed = false;
      const detail = {
        id: 'collapsible-09', fieldId: 'delivery', reason: keyActivation ? 'keyboard' : 'select',
        event: keyActivation?.event ?? event, input, previousValue: logical.current,
        cancel() { vetoed = true; }
      };
      const result = current.onValueChange?.(id, detail);
      if (!mounted.current || ticket !== serial.current) return;
      if (result !== false && !vetoed && !wasCanceled(event) && !keyActivation?.guard.canceled() && liveEnabled(input) && !owner.current.disabled) {
        accepted.current = order;
        if (!owner.current.controlled) {
          logical.current = id;
          owner.current.selected = id;
          setStored(id);
        }
      }
      reconcile();
    });
  }
  function keyDown(event, id) {
    if (wasCanceled(event) || !liveEnabled(event.currentTarget)) return;
    // Recovered Radix RadioGroupItemTrigger suppresses Enter's default. Keep the
    // form from treating Enter as an implicit submit; never change selection.
    // Composition confirmation remains owned by the IME.
    if (event.key === 'Enter' && !event.isComposing && !event.nativeEvent.isComposing && event.keyCode !== 229) {
      event.preventDefault();
      return;
    }
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.isComposing || event.nativeEvent.isComposing || event.keyCode === 229 || event.repeat || wasCanceled(event)) return;
    const keys = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End', ' '];
    if (!keys.includes(event.key) || !liveEnabled(event.currentTarget)) return;
    const input = event.currentTarget, guard = ownKeyboardDefault(event), ticket = serial.current, order = ++sequence.current;
    queueMicrotask(() => {
      if (!mounted.current || ticket !== serial.current || order <= accepted.current || guard.canceled() || !liveEnabled(input) || owner.current.disabled) { guard.restore(); return; }
      if(input.ownerDocument.activeElement!==input){guard.restore();return;}
      const enabled = radioOptions.map(([key]) => inputs.current[key]).filter(liveEnabled);
      const at = enabled.indexOf(input), rtl = input.closest('[dir]')?.getAttribute('dir') === 'rtl';
      let destination = input;
      if (event.key === 'Home') destination = enabled[0];
      else if (event.key === 'End') destination = enabled.at(-1);
      else if (event.key !== ' ') {
        let direction = ['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : -1;
        if (rtl && ['ArrowLeft', 'ArrowRight'].includes(event.key)) direction *= -1;
        destination = enabled[(at + direction + enabled.length) % enabled.length];
      }
      if (destination) {
        destination.focus();
        // Radix's arrow-key focus selects; Home/End only rove to the edge.
        // Space then selects the focused option using the same native click path.
        if (event.key !== 'Home' && event.key !== 'End' && ticket === serial.current && !guard.canceled() && liveEnabled(destination) && destination.ownerDocument.activeElement===destination) {
          activation.current = { input: destination, event, guard, ticket, order };
          destination.click();
          activation.current = null;
        }
      }
      // Keep observation active through the deferred onValueChange proposal too.
      queueMicrotask(guard.restore);
    });
  }
  const enabledIds = radioOptions.filter((_, index) => !itemDisabled[index]).map(([id]) => id);
  const tabStop = enabledIds.includes(focusedId) ? focusedId : enabledIds.includes(selected) ? selected : enabledIds[0];
  return <div {...native} ref={ref} role="radiogroup" aria-label={native['aria-label'] ?? (native['aria-labelledby'] ? undefined : 'Delivery Options')} aria-required={required || undefined} aria-disabled={disabled || undefined} className={classes('fr29-delivery-radio-group', className)} data-component-id="radio-group-02" data-slot="radio-group">
    {radioOptions.map(([id, label], index) => {
      const { ref: itemRef, className: itemClass, disabled: _disabled, onClick, onChange, onInput, onKeyDown, onFocus,
        type: _type, value: _value, name: _name, form: _form, checked: _checked, defaultChecked: _defaultChecked,
        defaultValue: _defaultValue, required: _required, id: _id, tabIndex: _tabIndex, children: _inputChildren,
        dangerouslySetInnerHTML: _inputHTML, 'aria-label': _genericLabel, ...inputNative } = itemProps[id] ?? {};
      const { className: labelClass, children: _labelChildren, dangerouslySetInnerHTML: _labelHTML, htmlFor: _for, ...labelNative } = labelProps[id] ?? {};
      const inputId = `fr29-delivery-${uid}-${id}`;
      const option=DATA['collapsible-09'].deliveryOptions[index];
      return <div key={id} data-state={selected===id?'checked':'unchecked'} className="fr29-delivery-radio-row" data-disabled={itemDisabled[index] || undefined}>
        <input {...inputNative} ref={inputRefs[id]}
          type="radio" id={inputId} name={groupName} value={id} form={form} required={required && (name ? true : selected === id || (selected === null && tabStop === id))}
          aria-labelledby={inputNative['aria-labelledby']??`${inputId}-label`} aria-describedby={[inputNative['aria-describedby'],`${inputId}-description`,`${inputId}-price`].filter(Boolean).join(' ')} checked={selected === id} disabled={itemDisabled[index]} tabIndex={tabStop === id ? 0 : -1}
          className={classes('fr29-delivery-radio', itemClass)} data-slot="radio-group-item"
          onClick={event => { const stamp=serial.current;onClick?.(event);if(stamp===serial.current)propose(id, event, event.currentTarget, activation.current?.input === event.currentTarget ? activation.current : null);else reconcile(); }}
          onChange={event => { onChange?.(event); }} onInput={event => onInput?.(event)}
          onKeyDown={event => { const stamp=serial.current;onKeyDown?.(event);if(stamp===serial.current)keyDown(event,id); }}
          onFocus={event => { onFocus?.(event); if (!wasCanceled(event) && liveEnabled(event.currentTarget)) setFocusedId(id); }} />
        <label {...labelNative} htmlFor={inputId} className={classes('fr29-delivery-radio-label', labelClass)} data-slot="label"><span id={`${inputId}-label`}>{label}</span><span id={`${inputId}-description`} className="fr29-delivery-description">{option.description}</span></label><span className="fr29-delivery-price" id={`${inputId}-price`}>{option.price}</span>
      </div>;
    })}
  </div>;
});

