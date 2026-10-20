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

export function Dialog03({ open, defaultOpen = false, onOpenChange, triggerRef, disabled = false, confirmDisabled = false, title = 'Delete this workspace?', description = 'This action is permanent and cannot be undone. All associated data will be removed forever.', triggerLabel = 'Alert Dialog Destructive', cancelLabel = 'Cancel', confirmLabel = 'Delete', onConfirm, onCancel, onNativeError, className = '', onKeyDownCapture, dialogRef: externalDialogRef, acknowledgment = {}, acknowledgmentLabel = 'I understand that this action is irreversible' }) {
  if (open !== undefined && arguments[0].defaultOpen !== undefined) throw new TypeError("Dialog03 open/defaultOpen are mutually exclusive");
  const state = useRequestedState({ id: 'dialog-03', value: open, defaultValue: !!defaultOpen, normalize: Boolean, disabled: false, onChange: onOpenChange, validProposal: (next, current, reason) => next ? !disabled : reason !== 'confirm' || !disabled && !confirmDisabled });
  const acknowledgmentRef = useRef(null);
  if (acknowledgment.checked !== undefined && acknowledgment.defaultChecked !== undefined) throw new TypeError("Dialog03 acknowledgment checked/defaultChecked are mutually exclusive");
  const {checked:ackChecked,defaultChecked:ackDefault=false,id:ackId,onClick:ackClick,onChange:ackChange,children:ackChildren,type:ackType,ref:ackExternalRef,...ackProps}=acknowledgment;
  const setAcknowledgment=useCallback(node=>{acknowledgmentRef.current=node;if(typeof ackExternalRef==="function"){const cleanup=ackExternalRef(node);if(typeof cleanup==="function")return()=>{acknowledgmentRef.current=null;cleanup();}}else if(ackExternalRef)ackExternalRef.current=node;},[ackExternalRef]);
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
    const result = (kind === 'confirm' ? latest.current.onConfirm : latest.current.onCancel)?.({ id: 'dialog-03', event, localOnly: true, acknowledged: !!acknowledgmentRef.current?.checked });
    if (!state.mounted.current || serial !== native.current.operation || !state.live.current.value || result === false || event.defaultPrevented) return;
    if (kind === 'confirm' && (latest.current.disabled || latest.current.confirmDisabled)) return;
    if (kind === 'confirm') setConfirmed(true);
    requestOpen(false, kind, event);
  }
  return <section className={`fr7 fr7-disclosure fr9-dialog03 ${className}`} data-component-id="dialog-03" onKeyDownCapture={onKeyDownCapture}>
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
      {state.value && <><header><span className="fr9-warning" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M12 3 22 21H2Z M12 9v5 M12 17v1"/></svg></span><h2 id={`${uid}-title`}>{title}</h2><p id={`${uid}-description`}>{description}<span className="fr9-ack-row"><input {...ackProps} disabled={disabled||ackProps.disabled} type="checkbox" id={ackId??`${uid}-ack`} ref={setAcknowledgment} {...(ackChecked!==undefined?{checked:ackChecked}:{defaultChecked:ackDefault})} onChange={event=>{if(disabled||ackProps.disabled||ackProps.readOnly){event.preventDefault();return;}ackChange?.(event);}} onClick={event=>{ackClick?.(event);if(ackProps.readOnly)event.preventDefault();}}/><label htmlFor={ackId??`${uid}-ack`}>{acknowledgmentLabel}</label></span></p></header><footer><button ref={cancelRef} type="button" className="fr7-dialog-cancel" onClick={event => finish('cancel', event)}><span>{cancelLabel}</span></button><button type="button" className="fr7-dialog-confirm" disabled={disabled || confirmDisabled} onClick={event => finish('confirm', event)}><span>{confirmLabel}</span></button></footer><p className="fr7-disclosure-note">本地演示，不会删除工作区或请求外部服务。</p></>}
    </dialog>
    {nativeError && <p role="alert" className="fr7-disclosure-error">{nativeError}</p>}
    {confirmed && !state.value && <p role="status" className="fr7-disclosure-note">已在本页模拟确认，未删除工作区。</p>}
  </section>;
}
