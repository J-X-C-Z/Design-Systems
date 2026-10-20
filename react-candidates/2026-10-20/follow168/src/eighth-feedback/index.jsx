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

function OriginalDescription(){return <>This is a minimal dialog for simple confirmations or information. Please proceed if you understand.<br/><br/><span className="fr8-description-line">If you have any questions, feel free to contact support at <a href="mailto:support@example.com">support@example.com</a>.</span><span className="fr8-description-line">Note: Your changes will not be saved unless you confirm this action.</span></>}
export const Textarea08=forwardRef(function Textarea08({id, label='Reason for request', description='This field can’t be empty.', 'aria-invalid':invalid=true, 'aria-describedby':externalDescription, placeholder='Explain your request...', wrapperClassName='', className='', children:_children,dangerouslySetInnerHTML:_html,...native},ref){
 const uid=useId(),fieldId=id??`fr8-textarea-${uid}`,descriptionId=description!==null&&description!==false&&description!==undefined?fieldId+'-error':undefined;
 if(native.value!==undefined&&native.defaultValue!==undefined)throw new TypeError('Textarea08 value/defaultValue are mutually exclusive');
 const described=[...new Set([externalDescription,descriptionId].filter(Boolean).join(' ').split(/\s+/).filter(Boolean))].join(' ')||undefined;
 return <div className={'fr8-textarea08 '+wrapperClassName} data-component-id="textarea-08">{label!==null&&label!==false&&<label htmlFor={fieldId}>{label}</label>}<textarea {...native} ref={ref} id={fieldId} placeholder={placeholder} aria-invalid={invalid} aria-describedby={described} className={'fr8-textarea '+className}/>{descriptionId&&<p id={descriptionId} className="fr8-error">{description}</p>}</div>;
});
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

export function Dialog02({ open, defaultOpen = false, onOpenChange, triggerRef, disabled = false, confirmDisabled = false, title = 'Heads up!', description = <OriginalDescription />, triggerLabel = 'Alert Dialog (With Icon)', cancelLabel = 'Cancel', confirmLabel = 'OK', onConfirm, onCancel, onNativeError, className = '', onKeyDownCapture, dialogRef: externalDialogRef }) {
  if (open !== undefined && arguments[0].defaultOpen !== undefined) throw new TypeError("Dialog02 open/defaultOpen are mutually exclusive");
  const state = useRequestedState({ id: 'dialog-02', value: open, defaultValue: !!defaultOpen, normalize: Boolean, disabled: false, onChange: onOpenChange, validProposal: (next, current, reason) => next ? !disabled : reason !== 'confirm' || !disabled && !confirmDisabled });
  const uid = useId(), dialogRef = useRef(null), localTrigger = useRef(null), cancelRef = useRef(null), returnTarget = useRef(null);
  const latest = useRef(null), native = useRef({ suppress: false, recovery: 0, operation: 0, active: false });
  const [syncTick, setSyncTick] = useState(0), [nativeError, setNativeError] = useState(''), [confirmed, setConfirmed] = useState(false);
  const setTrigger = useCallback(node => { localTrigger.current = node; if (typeof triggerRef === 'function') { const cleanup = triggerRef(node); if (typeof cleanup === 'function') return () => { localTrigger.current = null; cleanup(); }; } else if (triggerRef) triggerRef.current = node; }, [triggerRef]);
  useLayoutEffect(() => { latest.current = { disabled, confirmDisabled, onConfirm, onCancel, onNativeError }; });
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
        try { if (cancelRef.current) cancelRef.current.autofocus = true; dialog.showModal(); }
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
  function finish(kind, event) {
    if (event.defaultPrevented || !state.live.current.value || kind === 'confirm' && (latest.current.disabled || latest.current.confirmDisabled)) return;
    const serial = ++native.current.operation;
    const result = (kind === 'confirm' ? latest.current.onConfirm : latest.current.onCancel)?.({ id: 'dialog-02', event, localOnly: true });
    if (!state.mounted.current || serial !== native.current.operation || !state.live.current.value || result === false || event.defaultPrevented) return;
    if (kind === 'confirm' && (latest.current.disabled || latest.current.confirmDisabled)) return;
    if (kind === 'confirm') setConfirmed(true);
    requestOpen(false, kind, event);
  }
  return <section className={`fr7 fr7-disclosure fr8-dialog02 ${className}`} data-component-id="dialog-02" onKeyDownCapture={onKeyDownCapture}>
    <button type="button" className="fr7-dialog-trigger" ref={setTrigger} disabled={disabled} aria-haspopup="dialog" aria-expanded={state.value} aria-controls={`${uid}-dialog`} onClick={event => { if (!event.defaultPrevented) { returnTarget.current = event.currentTarget; setConfirmed(false); setNativeError(''); requestOpen(true, 'trigger', event); } }}><span>{triggerLabel}</span></button>
    <dialog id={`${uid}-dialog`} className="fr7-dialog" role="alertdialog" aria-modal="true" aria-labelledby={`${uid}-title`} aria-describedby={`${uid}-description`} ref={setDialog} onKeyDown={event => {
      if (event.defaultPrevented || event.nativeEvent.isComposing || event.keyCode === 229 || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "Escape" && !event.shiftKey) { event.preventDefault(); requestOpen(false,"escape",event); return; }
      if(event.key !== "Tab") return;
      const nodes=[...event.currentTarget.querySelectorAll("a[href],button,input,select,textarea,[tabindex]")].filter(n=>!n.disabled&&n.tabIndex>=0&&!n.hidden&&!n.closest("[inert],[hidden]"));
      if(!nodes.length){event.preventDefault();event.currentTarget.focus();return;}
      const first=nodes[0],last=nodes.at(-1),active=event.currentTarget.ownerDocument.activeElement;
      if(event.shiftKey&&(active===first||!event.currentTarget.contains(active))){event.preventDefault();last.focus();}
      else if(!event.shiftKey&&(active===last||!event.currentTarget.contains(active))){event.preventDefault();first.focus();}
    }} onCancel={event => { if (ignoredKey(event)) return; event.preventDefault(); requestOpen(false, 'escape', event); }} onClose={nativeClose}>
      {state.value && <><header><span className="fr8-info" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M12 10v7M12 6.5v1"/></svg></span><h2 id={`${uid}-title`}>{title}</h2><p id={`${uid}-description`}>{description}</p></header><footer><button ref={cancelRef} type="button" className="fr7-dialog-cancel" onClick={event => finish('cancel', event)}><span>{cancelLabel}</span></button><button type="button" className="fr7-dialog-confirm" disabled={disabled || confirmDisabled} onClick={event => finish('confirm', event)}><span>{confirmLabel}</span></button></footer><p className="fr7-disclosure-note">仅在本页确认，不会发送数据或保存到外部服务。</p></>}
    </dialog>
    {nativeError && <p role="alert" className="fr7-disclosure-error">{nativeError}</p>}
    {confirmed && !state.value && <p role="status" className="fr7-disclosure-note">已在本地确认。</p>}
  </section>;
}
