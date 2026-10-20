import React, { forwardRef, useCallback, useId, useLayoutEffect, useRef, useState } from 'react';
import CONTENT from './data-nested.json';

// Each public component owns immutable source content; the shared hook is private.
const OUTER_IDS = ['item-1', 'item-2', 'item-3'];
const FAQ_IDS = ['faq-1', 'faq-2', 'faq-3'];
const DEFAULT_VALUE = ['item-1'];
const signature = value => value.join('|');
function normalize(value, name, ids) {
  if (!Array.isArray(value) || Array.from(value).some(item => !ids.includes(item))) {
    throw new RangeError(`${name}: value must be an array containing only ${ids.join(", ")}`);
  }
  return ids.filter(item => value.includes(item));
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

function useSelection(input, forwardedRef, id, {values=OUTER_IDS, initial=DEFAULT_VALUE, attribute='data-accordion-value', categoryId}={}) {
 const {
  value,
  defaultValue = initial,
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
} = input;
  const name = `Accordion${id.slice(-2)}`;
  const normalizeValue = candidate => normalize(candidate, name, values);
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
          id, ...(categoryId ? {categoryId, faqId:itemId} : {itemId}), open: next.includes(itemId),
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
          const enabled = [...root.current.querySelectorAll('['+attribute+']')]
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

  return {selected,rootRef,root,native,dir,disabled,triggerProps,className,click,navigate};
}
function Icon({kind,marker}) {return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" data-nested-icon={kind} data-nested-marker={marker}>
 {kind==='folder-kanban'&&<><path d="M3 7V5a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"/><path d="M7 10v5m5-5v8m5-8v3"/></>}
 {kind==='clipboard-check'&&<><rect x="5" y="5" width="14" height="16" rx="2"/><rect x="9" y="2" width="6" height="5" rx="1"/><path d="m9 14 2 2 4-4"/></>}
 {kind==='life-buoy'&&<><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="m5.6 5.6 3.6 3.6m5.6 5.6 3.6 3.6m0-12.8-3.6 3.6m-5.6 5.6-3.6 3.6"/></>}
 {kind==='down'&&<path d="m6 9 6 6 6-6"/>}{kind==='up'&&<path d="m6 15 6-6 6 6"/>}
 </svg>}
function FaqGroup({id,category,group={},outerDisabled,outerTriggerId}) {
 const {ref,...input}=group;
 const state=useSelection({...input,disabled:outerDisabled||input.disabled},ref,id,{values:FAQ_IDS,initial:['faq-1'],attribute:'data-faq-value',categoryId:category.value});
 const uid=useId();
 useLayoutEffect(()=>{
  const node=state.root.current;
  return ()=>{
   const doc=node?.ownerDocument,active=doc?.activeElement;
   if(!node||!node.contains(active))return;
   const trigger=doc.getElementById(outerTriggerId);
   queueMicrotask(()=>{
    if(trigger?.isConnected&&trigger.getAttribute('aria-expanded')==='false'&&(doc.activeElement===active||doc.activeElement===doc.body))trigger.focus();
   });
  };
 },[outerTriggerId]);
 return <div {...state.native} ref={state.rootRef} dir={input.dir} className={`fr7-nested-faqs ${state.className}`} data-faq-category={category.value} data-disabled={state.disabled?'':undefined}>
 {category.faqs.map((faq,i)=>{
  const faqId=FAQ_IDS[i],open=state.selected.includes(faqId),props=state.triggerProps[faqId]||{};
  const {onClick,className='',children:_children,dangerouslySetInnerHTML:_html,...attrs}=props;
  const buttonId=`${uid}-${faqId}-trigger`,contentId=`${uid}-${faqId}-content`;
  return <section key={faqId} className="fr7-nested-faq" data-state={open?'open':'closed'}>
   <h4 className="fr7-nested-faq-heading"><button {...attrs} type="button" id={buttonId} aria-expanded={open} aria-controls={contentId} disabled={state.disabled||props.disabled} data-faq-value={faqId} data-state={open?'open':'closed'} className={`fr7-nested-faq-trigger ${className}`} onClick={e=>state.click(e,faqId,onClick)}>
    {id==='accordion-15'&&<Icon kind="down" marker="leading-rotation"/>}<span>{faq.title}</span>{id==='accordion-16'&&<Icon kind="down" marker="trailing-open-only"/>}
   </button></h4>
   <div id={contentId} aria-labelledby={buttonId} hidden={!open} className="fr7-nested-faq-content">{open&&faq.content}</div>
  </section>;
 })}
 </div>;
}
function useNested(input,ref,id) {
 const {faqProps={},...props}=input;
 const state=useSelection(props,ref,id),uid=useId();
 return <div {...state.native} ref={state.rootRef} dir={state.dir} className={`fr7 fr7-twentyeighth fr7-nested-accordion fr7-${id} ${state.className}`} data-component-id={id} data-orientation={props.orientation||'vertical'} data-disabled={state.disabled?'':undefined}>
 {CONTENT[id].map(category=>{
  const open=state.selected.includes(category.value),trigger=state.triggerProps[category.value]||{};
  const {onClick,onKeyDown,className='',children:_children,dangerouslySetInnerHTML:_html,...attrs}=trigger;
  const buttonId=`${uid}-${category.value}-trigger`,contentId=`${uid}-${category.value}-content`;
  return <section key={category.value} className="fr7-nested-category" data-state={open?'open':'closed'}>
   <h3 className="fr7-nested-category-heading"><button {...attrs} type="button" id={buttonId} aria-expanded={open} aria-controls={contentId} disabled={state.disabled||trigger.disabled} data-accordion-value={category.value} data-state={open?'open':'closed'} className={`fr7-nested-category-trigger ${className}`} onClick={e=>state.click(e,category.value,onClick)} onKeyDown={e=>state.navigate(e,onKeyDown)}>
    <span className="fr7-nested-category-label">{category.icon&&<Icon kind={category.icon}/>}<span>{category.category}</span></span>
    <Icon kind={id==='accordion-15'&&open?'up':'down'} marker={id==='accordion-15'?'outer-swap':'outer-rotation'}/>
   </button></h3>
   <div id={contentId} role="region" aria-labelledby={buttonId} hidden={!open} className="fr7-nested-category-content">
    {open&&<FaqGroup id={id} category={category} group={faqProps[category.value]} outerDisabled={state.disabled} outerTriggerId={buttonId}/>}
   </div>
  </section>;
 })}
 </div>;
}
export const Accordion15=forwardRef(function Accordion15(props,ref){return useNested(props,ref,'accordion-15')});
export const Accordion16=forwardRef(function Accordion16(props,ref){return useNested(props,ref,'accordion-16')});
