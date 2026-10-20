import React, { useCallback, useId, useLayoutEffect, useRef, useState, forwardRef } from 'react';
const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const same = (a, b) => Array.isArray(a) && Array.isArray(b) ? a.length === b.length && a.every((v, i) => v === b[i]) : Object.is(a, b);
const clone = value => Array.isArray(value) ? value.slice() : value;
const text = value => value == null ? '' : String(value);
const ignoredKey = event => event.defaultPrevented || event.isComposing || event.nativeEvent?.isComposing || event.keyCode === 229 || event.nativeEvent?.keyCode === 229 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;

function useRequestedState({ id, value: ownerValue, defaultValue, normalize, disabled, onChange, validProposal }) {
  const controlled = ownerValue !== undefined;
  const [stored, setStored] = useState(() => clone(defaultValue));
  const [pending, setPending] = useState(null);
  const live = useRef(null), mounted = useRef(false), sequence = useRef(0), ownerEpoch = useRef(0);
  const previous = useRef({ controlled, raw: clone(ownerValue), value: normalize(controlled ? ownerValue : stored) });
  const raw = !controlled && previous.current.controlled ? previous.current.value : controlled ? ownerValue : stored;
  const effective = normalize(raw);
  useLayoutEffect(() => { mounted.current = true; return () => { mounted.current = false; sequence.current++; }; }, []);
  useLayoutEffect(() => {
    if (controlled !== previous.current.controlled || controlled && !same(ownerValue, previous.current.raw)) ownerEpoch.current++;
    live.current = { id, controlled, value: clone(effective), disabled: !!disabled, normalize, onChange, validProposal };
    previous.current = { controlled, raw: clone(ownerValue), value: clone(effective) };
    if (!controlled && !same(stored, effective)) setStored(clone(effective));
    if (pending) {
      if ((pending.reason !== "trigger" || !pending.event?.defaultPrevented) && pending.sequence === sequence.current && pending.ownerEpoch === ownerEpoch.current && !controlled && !pending.controlled && !disabled && (!validProposal || validProposal(pending.next, effective, pending.reason))) setStored(clone(normalize(pending.next)));
      setPending(null);
    }
  });
  function request(next, reason, event) {
    const start = live.current;
    if (!mounted.current || !start || start.disabled) return 'blocked';
    next = start.normalize(next);
    if (same(next, start.value)) return 'same';
    const serial = ++sequence.current, epoch = ownerEpoch.current;
    const result = start.onChange?.(clone(next), { id, previousValue: clone(start.value), controlled: start.controlled, reason, event });
    const now = live.current;
    if (!mounted.current || sequence.current !== serial || !now || epoch !== ownerEpoch.current) return 'owner';
    if (now.disabled || now.validProposal && !now.validProposal(next, now.value, reason)) return 'blocked';
    if (result === false) return 'veto';
    if (start.controlled || now.controlled) return 'controlled';
    setPending({ next: clone(next), sequence: serial, ownerEpoch: epoch, controlled: start.controlled, reason, event });
    return 'pending';
  }
  return { value: effective, request, live, mounted };
}


function OriginalReleaseNotes(){return (<div className="fr11-release-notes">
                <div className="space-y-1">
                  <p>
                    <strong>Overview:</strong>
                  </p>
                  <p>
                    We are excited to announce the release of Version 2.0! This
                    major update brings significant performance improvements, a
                    redesigned user interface, and highly requested features to
                    streamline your workflow.
                  </p>
                </div>
                <div className="space-y-1">
                  <p>
                    <strong>New Features:</strong>
                  </p>
                  <ul className="list-inside list-disc space-y-1">
                    <li>Real-time collaboration with multi-user editing</li>
                    <li>Advanced data visualization with interactive charts</li>
                    <li>Global search with lightning-fast indexing</li>
                    <li>Dark mode support across the entire platform</li>
                    <li>Customizable dashboards with drag-and-drop tiles</li>
                  </ul>
                </div>
                <div className="space-y-1">
                  <p>
                    <strong>UI Improvements:</strong>
                  </p>
                  <ul className="list-inside list-disc space-y-1">
                    <li>Streamlined navigation for faster access to tools</li>
                    <li>Enhanced accessibility with full keyboard support</li>
                    <li>Modernized component library with Glassmorphism</li>
                    <li>Improved mobile responsiveness for all pages</li>
                  </ul>
                </div>
                <div className="space-y-1">
                  <p>
                    <strong>Performance:</strong>
                  </p>
                  <p>
                    Load times have been reduced by up to 40% thanks to our new
                    caching engine and optimized asset delivery pipeline.
                  </p>
                </div>
                <div className="space-y-1">
                  <p>
                    <strong>Bug Fixes:</strong>
                  </p>
                  <ul className="list-inside list-disc space-y-1">
                    <li>Fixed intermittent login failures on slow networks</li>
                    <li>Resolved memory leaks in the analytics engine</li>
                    <li>Corrected layout issues in the export PDF feature</li>
                    <li>Patched security vulnerabilities in API endpoints</li>
                  </ul>
                </div>
                <div className="space-y-1">
                  <p>
                    <strong>Known Issues:</strong>
                  </p>
                  <p>
                    The legacy export format (CSV) is currently disabled for
                    large datasets while we finish the migration to our new
                    streaming service.
                  </p>
                </div>
                <div className="space-y-1">
                  <p>
                    <strong>Support:</strong>
                  </p>
                  <p>
                    If you encounter any issues with this release, please reach
                    out to our 24/7 technical support team or visit the
                    community forums.
                  </p>
                </div>
              </div>);}
export const Textarea06=forwardRef(function Textarea06({id,label='Write a note',placeholder='Jot down your thoughts...',wrapperClassName='',className='',children:_child,dangerouslySetInnerHTML:_html,...native},ref){const uid=useId(),fieldId=id??`fr11-note-${uid}`;if(native.value!==undefined&&native.defaultValue!==undefined)throw new TypeError('Textarea06 value/defaultValue mutually exclusive');return <div className={'fr11-textarea06 '+wrapperClassName} data-component-id="textarea-06">{label!==null&&label!==false&&<label htmlFor={fieldId}>{label}</label>}<div className="fr11-note-wrap" data-disabled={native.disabled||undefined}><div className="fr11-pen"><svg aria-hidden="true" viewBox="0 0 20 20" focusable="false"><path d="m4 13 9-9 3 3-9 9-4 1ZM11 6l3 3M3 17l4-1"/></svg><span className="fr11-sr-only">Note</span></div><textarea {...native} ref={ref} id={fieldId} placeholder={placeholder} className={'fr11-note-input '+className}/></div></div>});
function connectedFocusTarget(node) { return !!node?.isConnected && typeof node.focus === 'function' && !node.disabled && !node.closest('[inert]'); }
function closeDialogNode(dialog, returnTarget) {
  if (!dialog) return;
  const doc = dialog.ownerDocument, before = doc.activeElement;
  const outside = before && before !== doc.body && before !== doc.documentElement && !dialog.contains(before) ? before : null;
  const owned = dialog.contains(before) || before === doc.body || before === doc.documentElement;
  if (dialog.open) dialog.close();
  const after = doc.activeElement;
  // Preserve an explicit external owner; never replace a newer unrelated focus target.
  if (outside && connectedFocusTarget(outside) && after !== outside && (after === returnTarget || after === doc.body || after === doc.documentElement)) outside.focus();
  else if (owned && (after === doc.body || after === doc.documentElement) && !doc.querySelector('dialog[open]') && connectedFocusTarget(returnTarget)) returnTarget.focus();
}

export function Dialog04({ open, defaultOpen = false, onOpenChange, triggerRef, disabled = false, readMoreDisabled = false, title = 'v2.0 Release Notes', description = <OriginalReleaseNotes />, triggerLabel = 'Scrollable Dialog', backLabel = 'Back', readMoreLabel = 'Read More', onReadMore, onDismiss, scrollRef, onNativeError, className = '', onKeyDownCapture, dialogRef: externalDialogRef }) {
  if (open !== undefined && arguments[0].defaultOpen !== undefined) throw new TypeError("Dialog04 open/defaultOpen are mutually exclusive");
  const state = useRequestedState({ id: 'dialog-04', value: open, defaultValue: !!defaultOpen, normalize: Boolean, disabled: false, onChange: onOpenChange, validProposal: (next, current, reason) => next ? !disabled : true });
  const uid = useId(), dialogRef = useRef(null), localTrigger = useRef(null), initialFocusRef = useRef(null), returnTarget = useRef(null);
  const latest = useRef(null), native = useRef({ suppress: false, recovery: 0, operation: 0, active: false });
  const [syncTick, setSyncTick] = useState(0), [nativeError, setNativeError] = useState('');
  const setTrigger = useCallback(node => { localTrigger.current = node; if (typeof triggerRef === 'function') { const cleanup = triggerRef(node); if (typeof cleanup === 'function') return () => { localTrigger.current = null; cleanup(); }; } else if (triggerRef) triggerRef.current = node; }, [triggerRef]);
  useLayoutEffect(() => { latest.current = { disabled, readMoreDisabled, onReadMore, onDismiss, onNativeError }; });
  const setDialog = useCallback(node => { dialogRef.current = node; if (typeof externalDialogRef === 'function') { const cleanup = externalDialogRef(node); if (typeof cleanup === 'function') return () => { dialogRef.current = null; cleanup(); }; } else if (externalDialogRef) externalDialogRef.current = node; }, [externalDialogRef]);
  function requestOpen(next, reason, event) {
    if (!state.mounted.current || next && latest.current.disabled) return 'blocked';
    return state.request(next, reason, event);
  }
  function reportNativeError(error) { if (state.mounted.current) { setNativeError('此环境未能打开原生模态对话框。'); latest.current.onNativeError?.(error); } }
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    native.current.suppress = false;
    if (state.value) {
      if (!native.current.active) { native.current.active = true; native.current.recovery = 0; setNativeError(''); returnTarget.current = connectedFocusTarget(localTrigger.current) ? localTrigger.current : dialog.ownerDocument.activeElement; }
      if (!dialog.open) {
        if (typeof dialog.showModal !== 'function' || typeof dialog.close !== 'function') { reportNativeError(new Error('Native HTMLDialogElement.showModal/close is required')); return; }
        const serial = ++native.current.operation;
        try { if (initialFocusRef.current) initialFocusRef.current.setAttribute('autofocus',''); dialog.showModal(); }
        catch (error) { reportNativeError(error); return; }
        if (!state.mounted.current || serial !== native.current.operation || dialogRef.current !== dialog) { native.current.suppress = true; closeDialogNode(dialog, returnTarget.current); native.current.suppress = false; }
      }
    } else {
      native.current.active = false; native.current.operation++;
      native.current.suppress = true; closeDialogNode(dialog, returnTarget.current); native.current.suppress = false;
    }
  }, [state.value, syncTick]);
  useLayoutEffect(() => () => {
    native.current.operation++; native.current.suppress = true;
    closeDialogNode(dialogRef.current, returnTarget.current);
  }, []);
  function nativeClose(event) {
    if (native.current.suppress || !state.mounted.current || dialogRef.current?.open || !state.live.current.value) return;
    const status = requestOpen(false, 'native-close', event);
    if (status === 'controlled' || status === 'veto' || status === 'same') {
      if (native.current.recovery++ < 1) setSyncTick(tick => tick + 1);
      else reportNativeError(new Error('Repeated native close while the owner refuses dismissal'));
    }
  }
  function dismiss(reason,event){
    if(event.defaultPrevented||!state.live.current.value)return;
    const serial=++native.current.operation;
    const result=latest.current.onDismiss?.({id:'dialog-04',reason,event,localOnly:true});
    if(!state.mounted.current||serial!==native.current.operation||!state.live.current.value||result===false||event.defaultPrevented)return;
    requestOpen(false,reason,event);
  }
  function readMore(event){if(event.defaultPrevented||!state.live.current.value||latest.current.disabled||latest.current.readMoreDisabled)return;latest.current.onReadMore?.({id:'dialog-04',event,localOnly:true});}
  return <section className={`fr7 fr7-disclosure fr11-dialog04 ${className}`} data-component-id="dialog-04" onKeyDownCapture={onKeyDownCapture}>
    <button type="button" className="fr7-dialog-trigger" ref={setTrigger} disabled={disabled} aria-haspopup="dialog" aria-expanded={state.value} aria-controls={`${uid}-dialog`} onClick={event => { if (!event.defaultPrevented) { returnTarget.current = event.currentTarget; setNativeError(''); requestOpen(true, 'trigger', event); } }}><span>{triggerLabel}</span></button>
    <dialog id={`${uid}-dialog`} className="fr7-dialog" role="dialog" aria-modal="true" aria-labelledby={`${uid}-title`} aria-describedby={`${uid}-description`} ref={setDialog} onKeyDown={event => {
      if (event.defaultPrevented || event.nativeEvent.isComposing || event.keyCode === 229 || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "Escape" && !event.shiftKey) { event.preventDefault(); requestOpen(false,"escape",event); return; }
      if(event.key !== "Tab") return;
      const nodes=[...event.currentTarget.querySelectorAll("a[href],button,input,select,textarea,[tabindex]")].filter(n=>!n.disabled&&n.tabIndex>=0&&!n.hidden&&!n.closest("[inert],[hidden]"));
      if(!nodes.length){event.preventDefault();event.currentTarget.focus();return;}
      const first=nodes[0],last=nodes.at(-1),active=event.currentTarget.ownerDocument.activeElement;
      if(event.shiftKey&&(active===first||!event.currentTarget.contains(active))){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&(active===last||!event.currentTarget.contains(active))){event.preventDefault();first.focus();}
    }} onCancel={event => { if (ignoredKey(event)) return; event.preventDefault(); requestOpen(false, 'escape', event); }} onClose={nativeClose} onClick={event=>{if(event.target===event.currentTarget)dismiss('outside',event)}}>
      {state.value && <><header><h2 tabIndex={-1} ref={initialFocusRef} id={`${uid}-title`}>{title}</h2><button type="button" className="fr11-close" aria-label="Close" onClick={event=>dismiss('close-button',event)}><svg aria-hidden="true" viewBox="0 0 20 20"><path d="m5 5 10 10M15 5 5 15"/></svg></button></header><div ref={scrollRef} className="fr11-scroll" tabIndex={0} role="region" aria-label="Release notes"><div id={`${uid}-description`}>{description}</div></div><footer><button type="button" className="fr7-dialog-cancel" onClick={event=>dismiss('back',event)}><svg aria-hidden="true" viewBox="0 0 20 20"><path d="m12 4-6 6 6 6"/></svg><span>{backLabel}</span></button><button type="button" className="fr7-dialog-confirm" disabled={disabled||readMoreDisabled} onClick={readMore}><span>{readMoreLabel}</span></button></footer><p className="fr7-disclosure-note">原件发布说明示例，不代表本包性能、安全或服务承诺。Read More 默认没有动作；演示仅本地状态。</p></>}

    </dialog>
    {nativeError && <p role="alert" className="fr7-disclosure-error">{nativeError}</p>}

  </section>;
}
