import React, { useCallback, useId, useLayoutEffect, useRef, useState } from 'react';

const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
const same = (a, b) => Array.isArray(a) && Array.isArray(b) ? a.length === b.length && a.every((v, i) => v === b[i]) : Object.is(a, b);
const clone = value => Array.isArray(value) ? value.slice() : value;
const text = value => value == null ? '' : String(value);
const ignoredKey = event => event.defaultPrevented || event.isComposing || event.nativeEvent?.isComposing || event.keyCode === 229 || event.nativeEvent?.keyCode === 229 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;

export const tabs01Items = [
  { value: 'overview', title: '概览', before: '从里程碑到当前进度，', emphasis: '全面掌握', after: '你的创意项目。通过实时更新，让目标更清晰，让团队保持同步。' },
  { value: 'roadmap', title: '路线图', before: '通过可视化路线图，规划即将推出的功能和版本，明确', emphasis: '未来方向', after: '。追踪长期目标，保持领先。' },
  { value: 'backlog', title: '待办', before: '管理你的', emphasis: '待办任务', after: '和想法。为重要事项确定优先级，随着项目发展也不遗漏任何细节。' }
];
export const accordion01Items = [
  { value: 'item-1', title: '我的数据安全吗？', content: '我们采用行业标准加密和安全基础设施，全程保护你的数据。未经你的同意，我们不会分享你的信息。' },
  { value: 'item-2', title: '交易如何进行？', content: '交易会即时处理，并实时显示在你的账户中。你可以随时查看详细历史记录和分析。' },
  { value: 'item-3', title: '我能在同一个地方管理所有内容吗？', content: '可以。通过清晰、高效的统一控制台，追踪活动、管理设置并掌控你的账户。' }
];

/** Null/missing content selects structured prose; explicit undefined/empty selects empty prose. */
export function normalizeDisclosureItems(input) {
  const used = new Set();
  return (Array.isArray(input) ? input : []).flatMap(item => {
    if (!item || item.value == null) return [];
    const value = String(item.value);
    if (!value || used.has(value)) return [];
    used.add(value);
    return [{ value, title: text(item.title ?? item.name ?? value), content: own(item, 'content') && item.content !== null ? text(item.content) : null,
      before: text(item.before), emphasis: text(item.emphasis), after: text(item.after), disabled: !!item.disabled }];
  });
}
function Prose({ item }) { return item.content !== null ? item.content : <>{item.before}{item.emphasis ? <strong>{item.emphasis}</strong> : null}{item.after}</>; }
function Chevron({ expanded }) { return <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" focusable="false"><path d={expanded ? 'm6 15 6-6 6 6' : 'm6 9 6 6 6-6'} fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>; }

/* Requests commit in layout after the parent render, so batched restrictions/owners are visible.
   Native React reconciliation retains keyed controls, labels and SVG descendants. */
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
      if (pending.sequence === sequence.current && pending.ownerEpoch === ownerEpoch.current && !controlled && !pending.controlled && !disabled && (!validProposal || validProposal(pending.next, effective, pending.reason))) setStored(clone(normalize(pending.next)));
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
    setPending({ next: clone(next), sequence: serial, ownerEpoch: epoch, controlled: start.controlled, reason });
    return 'pending';
  }
  return { value: effective, request, live, mounted };
}

function useCollectionFocus(root, enabledValues, selected) {
  const [roving, setRoving] = useState(null);
  const focused = useRef(null), externalEpoch = useRef(0), ownedEpoch = useRef(0);
  const effectiveRoving = enabledValues.includes(roving) ? roving : enabledValues.includes(selected) ? selected : enabledValues[0] ?? null;
  useLayoutEffect(() => {
    const node = root.current, doc = node?.ownerDocument;
    if (!doc) return;
    const track = event => {
      if (!node.contains(event.target)) externalEpoch.current++;
      else if (event.target.hasAttribute('data-value')) { focused.current = event.target; ownedEpoch.current = externalEpoch.current; }
    };
    doc.addEventListener('focusin', track);
    return () => doc.removeEventListener('focusin', track);
  }, []);
  useLayoutEffect(() => {
    const node = root.current, old = focused.current, doc = node?.ownerDocument;
    if (!node || !old || node.contains(old) && !old.disabled) return;
    if (externalEpoch.current !== ownedEpoch.current || doc.activeElement !== doc.body && doc.activeElement !== doc.documentElement && doc.activeElement !== old) return;
    const next = [...node.querySelectorAll('button[data-value]:not(:disabled)')].find(button => button.dataset.value === effectiveRoving);
    focused.current = null;
    if (next) next.focus();
  });
  return { roving: effectiveRoving, focus(event) { focused.current = event.currentTarget; ownedEpoch.current = externalEpoch.current; setRoving(event.currentTarget.dataset.value); }, setRoving };
}

export function Tabs01({ items = tabs01Items, value, defaultValue = 'overview', onValueChange, disabled = false, label = '创意项目', dir = 'ltr', activationMode = 'automatic', className = '', onKeyDownCapture }) {
  const normalized = normalizeDisclosureItems(items), available = normalized.filter(item => !item.disabled);
  const normalize = selection => available.some(item => item.value === selection) ? selection : available[0]?.value ?? null;
  const state = useRequestedState({ id: 'tabs-01', value, defaultValue, normalize, disabled, onChange: onValueChange, validProposal: next => available.some(item => item.value === next) });
  const root = useRef(null), uid = useId(), focus = useCollectionFocus(root, disabled ? [] : available.map(item => item.value), state.value);
  const ids = useRef(new Map());
  function keyId(key) { if (!ids.current.has(key)) ids.current.set(key, ids.current.size + 1); return `${uid}-${ids.current.get(key)}`; }
  function keydown(event) {
    if (ignoredKey(event) || event.currentTarget.disabled) return;
    const buttons = [...root.current.querySelectorAll('[role="tab"]:not(:disabled)')], index = buttons.indexOf(event.currentTarget);
    let target;
    if (event.key === 'Home') target = buttons[0];
    else if (event.key === 'End') target = buttons.at(-1);
    else if (event.key === (dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight')) target = buttons[(index + 1) % buttons.length];
    else if (event.key === (dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft')) target = buttons[(index - 1 + buttons.length) % buttons.length];
    else if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); if (!event.repeat) state.request(event.currentTarget.dataset.value, 'keyboard', event); return; }
    else return;
    event.preventDefault();
    if (!target) return;
    target.focus();
    // Automatic selection is requested by the focus handler once; manual mode only roves.
  }
  return <section className={`fr7 fr7-disclosure fr7-tabs01 ${className}`} data-component-id="tabs-01" dir={dir} ref={root} onKeyDownCapture={onKeyDownCapture}>
    <div className="fr7-tabs-track" role="tablist" aria-label={label} aria-orientation="horizontal">
      {normalized.map(item => { const key = keyId(item.value); return <button key={item.value} type="button" role="tab" className="fr7-tab" data-value={item.value} id={`${key}-tab`} aria-controls={`${key}-panel`} aria-selected={state.value === item.value} tabIndex={focus.roving === item.value ? 0 : -1} disabled={disabled || item.disabled} onFocus={event => { focus.focus(event); if (!event.currentTarget.disabled && event.currentTarget.ownerDocument.activeElement === event.currentTarget && activationMode !== 'manual') state.request(item.value, 'focus', event); }} onKeyDown={keydown} onClick={event => { if (!event.defaultPrevented) state.request(item.value, 'click', event); }}><span>{item.title}</span></button>; })}
    </div>
    {normalized.map(item => { const key = keyId(item.value); return <div key={item.value} role="tabpanel" className="fr7-tab-panel" id={`${key}-panel`} aria-labelledby={`${key}-tab`} hidden={state.value !== item.value} tabIndex={0}><p><Prose item={item} /></p></div>; })}
    {!normalized.length && <p className="fr7-disclosure-note">暂无可用项目。</p>}
  </section>;
}

export function Accordion01({ items = accordion01Items, value, defaultValue = ['item-1'], onValueChange, disabled = false, label = '常见问题', className = '', onKeyDownCapture }) {
  const normalized = normalizeDisclosureItems(items);
  const normalize = selection => normalized.filter(item => Array.isArray(selection) && selection.includes(item.value)).map(item => item.value);
  const state = useRequestedState({ id: 'accordion-01', value, defaultValue, normalize, disabled, onChange: onValueChange, validProposal: (next, current) => [...new Set([...next, ...current])].filter(key => next.includes(key) !== current.includes(key)).every(key => normalized.some(item => item.value === key && !item.disabled)) });
  const root = useRef(null), uid = useId(), focus = useCollectionFocus(root, disabled ? [] : normalized.filter(item => !item.disabled).map(item => item.value), state.value[0]);
  const ids = useRef(new Map());
  function keyId(key) { if (!ids.current.has(key)) ids.current.set(key, ids.current.size + 1); return `${uid}-${ids.current.get(key)}`; }
  function toggle(key, reason, event) { if (normalized.some(item => item.value === key && !item.disabled)) state.request(state.value.includes(key) ? state.value.filter(v => v !== key) : [...state.value, key], reason, event); }
  function keydown(event) {
    if (ignoredKey(event) || event.currentTarget.disabled) return;
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); if (!event.repeat) toggle(event.currentTarget.dataset.value, 'keyboard', event); return; }
    const buttons = [...root.current.querySelectorAll('button[data-value]:not(:disabled)')], index = buttons.indexOf(event.currentTarget); let target;
    if (event.key === 'Home') target = buttons[0]; else if (event.key === 'End') target = buttons.at(-1);
    else if (event.key === 'ArrowDown') target = buttons[(index + 1) % buttons.length]; else if (event.key === 'ArrowUp') target = buttons[(index - 1 + buttons.length) % buttons.length]; else return;
    event.preventDefault(); target?.focus();
  }
  return <section className={`fr7 fr7-disclosure fr7-accordion01 ${className}`} data-component-id="accordion-01" aria-label={label} ref={root} onKeyDownCapture={onKeyDownCapture}>
    {normalized.map(item => { const key = keyId(item.value), expanded = state.value.includes(item.value); return <div key={item.value} className="fr7-accordion-item" data-state={expanded ? 'open' : 'closed'}>
      <h3><button type="button" className="fr7-accordion-trigger" id={`${key}-trigger`} data-value={item.value} aria-expanded={expanded} aria-controls={`${key}-content`} disabled={disabled || item.disabled} onFocus={focus.focus} onKeyDown={keydown} onClick={event => { if (!event.defaultPrevented) toggle(item.value, 'click', event); }}><Chevron expanded={expanded} /><span>{item.title}</span></button></h3>
      <div className="fr7-accordion-content" role="region" id={`${key}-content`} aria-labelledby={`${key}-trigger`} hidden={!expanded}><Prose item={item} /></div>
    </div>; })}
    {!normalized.length && <p className="fr7-disclosure-note">暂无可用项目。</p>}
  </section>;
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

export function Dialog01({ open, defaultOpen = false, onOpenChange, triggerRef, disabled = false, confirmDisabled = false, title = '你确定要继续吗？', description = '此操作无法撤销。继续操作将永久删除你的账户，并从我们的服务器移除你的数据。', triggerLabel = '确认对话框', cancelLabel = '取消', confirmLabel = '继续', onConfirm, onCancel, onNativeError, className = '', onKeyDownCapture }) {
  const state = useRequestedState({ id: 'dialog-01', value: open, defaultValue: !!defaultOpen, normalize: Boolean, disabled: false, onChange: onOpenChange, validProposal: (next, current, reason) => next ? !disabled : reason !== 'confirm' || !disabled && !confirmDisabled });
  const uid = useId(), dialogRef = useRef(null), localTrigger = useRef(null), cancelRef = useRef(null), returnTarget = useRef(null);
  const latest = useRef(null), native = useRef({ suppress: false, recovery: 0, operation: 0, active: false });
  const [syncTick, setSyncTick] = useState(0), [nativeError, setNativeError] = useState(''), [confirmed, setConfirmed] = useState(false);
  const setTrigger = useCallback(node => { localTrigger.current = node; if (typeof triggerRef === 'function') { const cleanup = triggerRef(node); if (typeof cleanup === 'function') return () => { localTrigger.current = null; cleanup(); }; } else if (triggerRef) triggerRef.current = node; }, [triggerRef]);
  useLayoutEffect(() => { latest.current = { disabled, confirmDisabled, onConfirm, onCancel, onNativeError }; });
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
    const result = (kind === 'confirm' ? latest.current.onConfirm : latest.current.onCancel)?.({ id: 'dialog-01', event, localOnly: true });
    if (!state.mounted.current || serial !== native.current.operation || !state.live.current.value || result === false) return;
    if (kind === 'confirm' && (latest.current.disabled || latest.current.confirmDisabled)) return;
    if (kind === 'confirm') setConfirmed(true);
    requestOpen(false, kind, event);
  }
  return <section className={`fr7 fr7-disclosure fr7-dialog01 ${className}`} data-component-id="dialog-01" onKeyDownCapture={onKeyDownCapture}>
    <button type="button" className="fr7-dialog-trigger" ref={setTrigger} disabled={disabled} aria-haspopup="dialog" aria-expanded={state.value} aria-controls={`${uid}-dialog`} onClick={event => { if (!event.defaultPrevented) { returnTarget.current = event.currentTarget; setConfirmed(false); setNativeError(''); requestOpen(true, 'trigger', event); } }}><span>{triggerLabel}</span></button>
    <dialog id={`${uid}-dialog`} className="fr7-dialog" role="alertdialog" aria-modal="true" aria-labelledby={`${uid}-title`} aria-describedby={`${uid}-description`} ref={dialogRef} onCancel={event => { if (ignoredKey(event)) return; event.preventDefault(); requestOpen(false, 'escape', event); }} onClose={nativeClose}>
      {state.value && <><header><h2 id={`${uid}-title`}>{title}</h2><p id={`${uid}-description`}>{description}</p></header><footer><button ref={cancelRef} type="button" className="fr7-dialog-cancel" onClick={event => finish('cancel', event)}><span>{cancelLabel}</span></button><button type="button" className="fr7-dialog-confirm" disabled={disabled || confirmDisabled} onClick={event => finish('confirm', event)}><span>{confirmLabel}</span></button></footer><p className="fr7-disclosure-note">本地交互演示，不会删除账户或发送数据。</p></>}
    </dialog>
    {nativeError && <p role="alert" className="fr7-disclosure-error">{nativeError}</p>}
    {confirmed && !state.value && <p role="status" className="fr7-disclosure-note">已在本地确认，未执行账户删除。</p>}
  </section>;
}
