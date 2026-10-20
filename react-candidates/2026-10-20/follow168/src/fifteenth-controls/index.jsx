import React, { forwardRef, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';

const classes = (...values) => values.filter(Boolean).join(' ');
const radioOptions = [ ['monthly', 'Monthly Plan'], ['quarterly', 'Quarterly Plan'], ['yearly', 'Yearly Plan'] ];
const folderIds = ['src', 'src/sections', 'content', 'styles'];
const wasCanceled = event => !!event?.defaultPrevented || !!event?.nativeEvent?.defaultPrevented;
const assignRef = (ref, node) => { if (typeof ref === 'function') return ref(node); if (ref) ref.current = node; };
const liveEnabled = node => !!node?.isConnected && !node.matches(':disabled');
function radioValue(value) {
  if (value !== null && !radioOptions.some(([key]) => key === value)) throw new RangeError('RadioGroup02: value must be monthly, quarterly, yearly or null');
  return value;
}
function expandedValue(value) {
  if (!Array.isArray(value) || value.some(id => !folderIds.includes(id))) throw new RangeError('Collapsible02: expanded IDs must be src, src/sections, content or styles');
  return folderIds.filter(id => value.includes(id));
}
const same = (a, b) => a.length === b.length && a.every((id, i) => id === b[i]);

// The component owns the keyboard default (no page scroll or second native radio
// navigation). Observe subsequent preventDefault calls as distinct user vetoes,
// including native ancestors after React's delegated event handler has run.
function ownKeyboardDefault(event) {
  const native = event.nativeEvent;
  let vetoed = wasCanceled(event);
  const previous = native.preventDefault;
  event.preventDefault();
  const observe = function (...args) { vetoed = true; return previous.apply(this, args); };
  native.preventDefault = observe;
  return {
    canceled: () => vetoed,
    restore: () => { if (native.preventDefault === observe) native.preventDefault = previous; }
  };
}

/** Source radio-group-02: three vertically stacked dashed radio circles. */
export const RadioGroup02 = forwardRef(function RadioGroup02({
  value, defaultValue, onValueChange, name, form, required = false, disabled = false,
  itemProps = {}, labelProps = {}, className, children: _children,
  dangerouslySetInnerHTML: _html, ...native
}, ref) {
  if (value !== undefined && defaultValue !== undefined) throw new TypeError('RadioGroup02: value/defaultValue are mutually exclusive');
  if (value !== undefined) radioValue(value);
  if (defaultValue !== undefined) radioValue(defaultValue);
  const controlled = value !== undefined;
  const initial = useRef(defaultValue === undefined ? 'monthly' : defaultValue);
  const [stored, setStored] = useState(initial.current);
  const [focusedId, setFocusedId] = useState(null);
  const selected = controlled ? value : stored;
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
  })), [itemProps.monthly?.ref, itemProps.quarterly?.ref, itemProps.yearly?.ref]);
  const itemDisabled = radioOptions.map(([id]) => !!disabled || !!itemProps[id]?.disabled);
  const signature = `${controlled}|${controlled ? selected : ''}|${groupName}|${form}|${required}|${itemDisabled.join(',')}`;
  function reconcile() {
    if (!mounted.current) return;
    // Native reset clears dirty checkedness. Complete every baseline update
    // before applying the live owner; later defaultChecked writes can otherwise
    // clear an earlier checked radio in the same named native group.
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
        const detail = { id: 'radio-group-02', reason: 'reset', event, input: null, previousValue: logical.current, cancel() { vetoed = true; } };
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
        id: 'radio-group-02', reason: keyActivation ? 'keyboard' : 'select',
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
      // Deferred navigation must not reclaim focus moved by a consumer/ancestor.
      if (input.ownerDocument.activeElement !== input) { guard.restore(); return; }
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
        if (event.key !== 'Home' && event.key !== 'End' && ticket === serial.current && !guard.canceled() && liveEnabled(destination) && destination.ownerDocument.activeElement === destination) {
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
  return <div {...native} ref={ref} role="radiogroup" aria-label={native['aria-label'] ?? (native['aria-labelledby'] ? undefined : 'Billing plan')} aria-required={required || undefined} aria-disabled={disabled || undefined} className={classes('fr15-radio-group', className)} data-component-id="radio-group-02" data-slot="radio-group">
    {radioOptions.map(([id, label], index) => {
      const { ref: itemRef, className: itemClass, disabled: _disabled, onClick, onChange, onInput, onKeyDown, onFocus,
        type: _type, value: _value, name: _name, form: _form, checked: _checked, defaultChecked: _defaultChecked,
        defaultValue: _defaultValue, required: _required, id: _id, tabIndex: _tabIndex, children: _inputChildren,
        dangerouslySetInnerHTML: _inputHTML, ...inputNative } = itemProps[id] ?? {};
      const { className: labelClass, children: _labelChildren, dangerouslySetInnerHTML: _labelHTML, htmlFor: _for, ...labelNative } = labelProps[id] ?? {};
      const inputId = `fr15-${uid}-${id}`;
      return <div key={id} className="fr15-radio-row" data-disabled={itemDisabled[index] || undefined}>
        <input {...inputNative} ref={inputRefs[id]}
          type="radio" id={inputId} name={groupName} value={id} form={form} required={required && (name ? true : selected === id || (selected === null && tabStop === id))}
          checked={selected === id} disabled={itemDisabled[index]} tabIndex={tabStop === id ? 0 : -1}
          className={classes('fr15-radio', itemClass)} data-slot="radio-group-item"
          onClick={event => { onClick?.(event); propose(id, event, event.currentTarget, activation.current?.input === event.currentTarget ? activation.current : null); }}
          onChange={event => { onChange?.(event); }} onInput={event => onInput?.(event)}
          onKeyDown={event => { onKeyDown?.(event); keyDown(event, id); }}
          onFocus={event => { onFocus?.(event); if (!wasCanceled(event) && liveEnabled(event.currentTarget)) setFocusedId(id); }} />
        <label {...labelNative} htmlFor={inputId} className={classes('fr15-radio-label', labelClass)} data-slot="label">{label}</label>
      </div>;
    })}
  </div>;
});

const fileTree = [
  { id: 'src', name: 'src', children: [
    { id: 'src/sections', name: 'sections', children: [
      { id: 'src/sections/hero.tsx', name: 'hero.tsx' },
      { id: 'src/sections/features.tsx', name: 'features.tsx' },
      { id: 'src/sections/pricing.tsx', name: 'pricing.tsx' }
    ] }, { id: 'src/layout.tsx', name: 'layout.tsx' }
  ] },
  { id: 'content', name: 'content', children: [{ id: 'content/copy.md', name: 'copy.md' }] },
  { id: 'styles', name: 'styles', children: [{ id: 'styles/tokens.css', name: 'tokens.css' }] },
  { id: 'site.config.ts', name: 'site.config.ts' }
];
function FolderIcon({ open }) {
  return <svg className="fr15-folder-icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false">{open ? <><path d="M2.5 7V4.5h5l2 2H17V9" /><path d="M2.5 9h15L15 16H3.5Z" /></> : <path d="M2.5 4.5h5l2 2h8V16h-15Z" />}</svg>;
}
function FileIcon() {
  return <svg className="fr15-file-icon" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M4.5 2.5h7l4 4v11h-11Z" /><path d="M11.5 2.5v4h4M7 10h6M7 13h6" /></svg>;
}
function ChevronIcon() {
  return <svg className="fr15-chevron" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="m7.5 4.5 5.5 5.5-5.5 5.5" /></svg>;
}

/** Source collapsible-02: static demonstration content, never filesystem access. */
export const Collapsible02 = forwardRef(function Collapsible02({
  expanded, defaultExpanded, onExpandedChange, disabled = false, triggerProps = {},
  className, children: _children, dangerouslySetInnerHTML: _html, ...native
}, ref) {
  if (expanded !== undefined && defaultExpanded !== undefined) throw new TypeError('Collapsible02: expanded/defaultExpanded are mutually exclusive');
  if (expanded !== undefined) expandedValue(expanded);
  if (defaultExpanded !== undefined) expandedValue(defaultExpanded);
  const controlled = expanded !== undefined;
  const initial = useRef(expandedValue(defaultExpanded ?? []));
  const [stored, setStored] = useState(() => initial.current.filter(id => id !== 'src/sections' || initial.current.includes('src')));
  const opened = controlled ? expandedValue(expanded) : stored;
  const uid = useId(), owner = useRef(null), serial = useRef(0), mounted = useRef(false);
  const signature = `${controlled}|${opened.join(',')}|${disabled}|${folderIds.map(id => !!triggerProps[id]?.disabled).join(',')}`;
  useLayoutEffect(() => {
    if (owner.current && owner.current.signature !== signature) serial.current++;
    owner.current = { controlled, opened, disabled, onExpandedChange, signature };
  });
  useLayoutEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; serial.current++; };
  }, []);
  function toggle(folderId, event) {
    const button = event.currentTarget, ticket = ++serial.current;
    queueMicrotask(() => {
      if (!mounted.current || ticket !== serial.current || wasCanceled(event) || !liveEnabled(button) || owner.current.disabled) return;
      const current = owner.current, open = !current.opened.includes(folderId);
      let next = open ? [...current.opened, folderId] : current.opened.filter(id => id !== folderId);
      // The source unmounts nested FolderTree instances. Its local open state is
      // recreated on remount; a controlled owner can deliberately retain it.
      if (!current.controlled && folderId === 'src') {
        next = next.filter(id => id !== 'src/sections');
        if (open && initial.current.includes('src/sections')) next.push('src/sections');
      }
      next = expandedValue(next);
      let vetoed = false;
      const detail = { id: 'collapsible-02', folderId, open, event, button, previousExpanded: [...current.opened], cancel() { vetoed = true; } };
      const result = current.onExpandedChange?.(next, detail);
      if (!mounted.current || ticket !== serial.current || result === false || vetoed || wasCanceled(event) || !liveEnabled(button) || owner.current.disabled) return;
      if (!owner.current.controlled && same(owner.current.opened, current.opened)) setStored(next);
    });
  }
  function itemView(item, level) {
    if (!item.children) return <div key={item.id} className={classes('fr15-file', level === 0 && 'fr15-file-root')} data-file-path={item.id} data-level={level}><FileIcon /><span>{item.name}</span></div>;
    const open = opened.includes(item.id), contentId = `fr15-${uid}-${item.id.replaceAll('/', '-')}-content`;
    const { className: triggerClass, disabled: triggerDisabled, onClick, type: _type, children: _buttonChildren, dangerouslySetInnerHTML: _buttonHTML, ...buttonNative } = triggerProps[item.id] ?? {};
    return <div key={item.id} className={classes('fr15-folder', level > 0 && 'fr15-folder-nested')} data-slot="collapsible" data-folder-id={item.id} data-state={open ? 'open' : 'closed'} data-level={level}>
      <button {...buttonNative} type="button" className={classes('fr15-folder-trigger', triggerClass)} disabled={disabled || triggerDisabled}
        aria-expanded={open} aria-controls={contentId} data-slot="collapsible-trigger" data-folder-id={item.id}
        onClick={event => { onClick?.(event); toggle(item.id, event); }}>
        <ChevronIcon /><FolderIcon open={open} /><span>{item.name}</span>
      </button>
      <div id={contentId} className="fr15-folder-content" data-slot="collapsible-content" hidden={!open}>
        {open ? item.children.map(child => itemView(child, level + 1)) : null}
      </div>
    </div>;
  }
  return <div {...native} ref={ref} className={classes('fr15-file-tree', className)} data-component-id="collapsible-02" data-disabled={disabled || undefined}>{fileTree.map(item => itemView(item, 0))}</div>;
});
