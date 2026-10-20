import * as React from 'react';
import { createPortal, flushSync } from 'react-dom';
import type { MultiSelectProps, MultiSelectOption, MultiSelectChangeDetail, MultiSelectValueChangeReason, MultiSelectOpenChangeReason, Select32Props, Select33Props, WixMultiSelectId } from './types.js';
export type * from './types.js';
export const wixMultiSelectIds = Object.freeze(['select-32', 'select-33'] as const);
type CoreProps = MultiSelectProps & { readonly variant: WixMultiSelectId };
const definitions = {
  'select-32': { label: 'Active Pipeline Services', placeholder: 'Select operations', pluralLabel: 'operations active', helper: '', value: ['monitoring'], options: [
    { value: 'monitoring', label: 'Real-time Monitoring' }, { value: 'logging', label: 'Log Aggregation' },
    { value: 'analytics', label: 'Security Analytics' }, { value: 'backups', label: 'Automated Backups' },
  ] },
  'select-33': { label: 'Communication Channels', placeholder: 'Select notification paths', pluralLabel: 'channels selected', helper: 'System alerts will be delivered via all selected channels.', value: [], options: [
    { value: 'email', label: 'Primary Email' }, { value: 'sms', label: 'SMS Gateway' }, { value: 'push', label: 'Mobile Push' },
    { value: 'slack', label: 'Slack Webhook' }, { value: 'discord', label: 'Discord Bot' },
  ] },
} satisfies Record<WixMultiSelectId, { label: string; placeholder: string; pluralLabel: string; helper: string; value: readonly string[]; options: readonly MultiSelectOption[] }>;
const useLayout = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;
const microtask = (fn: () => void) => { if (typeof queueMicrotask === 'function') queueMicrotask(fn); else Promise.resolve().then(fn); };
const same = (a: readonly string[], b: readonly string[]) => a.length === b.length && a.every((value, index) => value === b[index]);
function values(input: readonly string[]): readonly string[] {
  if (!Array.isArray(input)) throw new Error('wix-multi-select: values must be a dense array of unique, nonempty strings.');
  const seen = new Set<string>(), result: string[] = [];
  for (let i = 0; i < input.length; i++) {
    if (!Object.prototype.hasOwnProperty.call(input, i)) throw new Error('wix-multi-select: values must be a dense array of unique, nonempty strings.');
    const value = input[i];
    if (typeof value !== 'string' || !value || seen.has(value)) throw new Error('wix-multi-select: values must be a dense array of unique, nonempty strings.');
    seen.add(value); result.push(value);
  }
  return Object.freeze(result);
}
function options(input: readonly MultiSelectOption[]): readonly MultiSelectOption[] {
  if (!Array.isArray(input)) throw new Error('wix-multi-select: options must be a dense, flat array.');
  const seen = new Set<string>(); const result: MultiSelectOption[] = [];
  const invalid = () => new Error('wix-multi-select: options require unique nonempty values, string labels and optional boolean disabled; hybrid descriptors are unsupported.');
  for (let i = 0; i < input.length; i++) {
    if (!Object.prototype.hasOwnProperty.call(input, i)) throw invalid();
    const item = input[i];
    if (!item || typeof item !== 'object' || Array.isArray(item) || Object.keys(item).some(key => !['value', 'label', 'disabled'].includes(key))) throw invalid();
    // Structural TypeScript descriptors may expose inherited or nonenumerable getters.
    // Validate and preserve one supported-field snapshot rather than spreading the object.
    const value = item.value, label = item.label, disabled = item.disabled;
    if (typeof value !== 'string' || !value || seen.has(value) || typeof label !== 'string' || (disabled !== undefined && typeof disabled !== 'boolean')) throw invalid();
    seen.add(value); result.push(Object.freeze({ value, label, ...(disabled === undefined ? {} : { disabled }) }));
  }
  return Object.freeze(result);
}
let sequence = 0;
const resetStamps = new WeakMap<Event, number>();
interface Gate { readonly canceled: boolean; preventNative(): void }
const eventGates = new WeakMap<Event, Gate>();
/** Only events for which we suppress native default behavior temporarily wrap prevention. */
function gateFor(event: Event, ownDefault = false): Gate {
  const existing = eventGates.get(event); if (existing) return existing;
  if (!ownDefault) return { get canceled() { return event.defaultPrevented; }, preventNative() { event.preventDefault(); } };
  const original = event.preventDefault, descriptor = Object.getOwnPropertyDescriptor(event, 'preventDefault');
  let canceled = event.defaultPrevented;
  const gate = { get canceled() { return canceled; }, preventNative() { original.call(event); } };
  const wrapped = function(this: Event) { canceled = true; original.call(this); };
  try {
    Object.defineProperty(event, 'preventDefault', { configurable: true, writable: true, value: wrapped });
    microtask(() => microtask(() => {
      if (event.preventDefault === wrapped) { if (descriptor) Object.defineProperty(event, 'preventDefault', descriptor); else Reflect.deleteProperty(event, 'preventDefault'); }
    }));
  } catch { /* Non-extensible custom events retain native cancellation only. */ }
  eventGates.set(event, gate); return gate;
}
function detailFor<R extends string>(reason: R, originalEvent: Event): MultiSelectChangeDetail<R> {
  let canceled = false;
  return { reason, originalEvent, cancelable: true, get defaultPrevented() { return canceled; }, preventDefault() { canceled = true; } };
}
function disabledByFieldset(element: HTMLElement | null): boolean {
  let ancestor = element?.parentElement;
  while (ancestor) {
    if (ancestor.tagName === 'FIELDSET' && (ancestor as HTMLFieldSetElement).disabled) {
      const firstLegend = Array.from(ancestor.children).find(child => child.tagName === 'LEGEND');
      if (!firstLegend?.contains(element)) return true;
    }
    ancestor = ancestor.parentElement;
  }
  return false;
}
/** Ordinary light-DOM sequential focus candidates, with native radio-group compression. */
function tabStops(doc: Document, popup: HTMLElement | null, backward: boolean): HTMLElement[] {
  const candidates = Array.from(doc.querySelectorAll<HTMLElement>('a[href],area[href],button,input,select,textarea,iframe,summary,[tabindex],[contenteditable="true"]')).filter(node => {
    const editable = node.getAttribute('contenteditable') === 'true' && !node.hasAttribute('tabindex');
    if ((!editable && node.tabIndex < 0) || node.matches(':disabled') || disabledByFieldset(node) || popup?.contains(node) || node.getAttribute('aria-hidden') === 'true') return false;
    const ownStyle = doc.defaultView?.getComputedStyle(node);
    if (ownStyle?.visibility === 'hidden' || ownStyle?.visibility === 'collapse') return false;
    if (node.tagName === 'INPUT' && (node as HTMLInputElement).type === 'hidden') return false;
    let parent: HTMLElement | null = node;
    while (parent) {
      if (parent.hidden || parent.hasAttribute('inert')) return false;
      const style = doc.defaultView?.getComputedStyle(parent);
      if (style?.display === 'none') return false;
      if (parent.tagName === 'DIALOG' && !parent.hasAttribute('open')) return false;
      if (parent.tagName === 'DETAILS' && !parent.hasAttribute('open')) {
        const summary = Array.from(parent.children).find(child => child.tagName === 'SUMMARY');
        if (!summary?.contains(node)) return false;
      }
      parent = parent.parentElement;
    }
    return true;
  });
  return candidates.filter(node => {
    if (node.tagName !== 'INPUT') return true;
    const radio = node as HTMLInputElement; if (radio.type !== 'radio' || !radio.name) return true;
    const group = candidates.filter(other => other.tagName === 'INPUT' && (other as HTMLInputElement).type === 'radio' && (other as HTMLInputElement).name === radio.name && (other as HTMLInputElement).form === radio.form) as HTMLInputElement[];
    const chosen = group.find(other => other.checked) ?? group[backward ? group.length - 1 : 0];
    return radio === chosen;
  }).map((node, index) => ({ node, index })).sort((a, b) => (a.node.tabIndex > 0 ? a.node.tabIndex : Infinity) - (b.node.tabIndex > 0 ? b.node.tabIndex : Infinity) || a.index - b.index).map(item => item.node);
}function Chevron() { return <svg className="wix-ms-chevron" aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function Check() { return <svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
interface Authority { valueControlled: boolean; value: readonly string[]; openControlled: boolean; open: boolean; valueRevision: number; openRevision: number; disabled: boolean; readOnly: boolean }
interface Ticket { stamp: number; lifetime: number; interaction: number; valueRevision: number; openRevision: number; focusRevision: number; gate: Gate; focusOrigin: Element | null }
interface ResetRecord { event: Event; stamp: number; form: HTMLFormElement; associatedDuringDispatch: boolean; valueControlled: boolean; openControlled: boolean; valueMode: number; openMode: number }
function MultiSelect(props: CoreProps, forwardedRef: React.ForwardedRef<HTMLButtonElement>) {
  const { variant } = props, definition = definitions[variant];
  if (props.value !== undefined && props.defaultValue !== undefined) throw new Error('wix-multi-select: value and defaultValue are mutually exclusive.');
  if (props.open !== undefined && props.defaultOpen !== undefined) throw new Error('wix-multi-select: open and defaultOpen are mutually exclusive.');
  for (const key of ['label', 'placeholder', 'pluralLabel', 'helper', 'error'] as const) if (props[key] !== undefined && typeof props[key] !== 'string') throw new Error(`wix-multi-select: ${key} must be a plain string.`);
  for (const key of ['open', 'defaultOpen', 'disabled', 'readOnly', 'required', 'clearable', 'showSelectedItems'] as const) if (props[key] !== undefined && typeof props[key] !== 'boolean') throw new Error(`wix-multi-select: ${key} must be a boolean.`);
  if (props.defaultValue !== undefined) values(props.defaultValue);
  const incomingValue = props.value === undefined ? undefined : values(props.value);
  const flat = options(props.options === undefined ? definition.options : props.options);
  const generated = React.useId(), id = props.id ?? `wix-ms-${generated}`;
  const labelId = `${id}-label`, popupId = `${id}-dialog`, helperId = `${id}-helper`, errorId = `${id}-error`, requiredId = `${id}-required`;
  const mountDefault = React.useRef(values(props.defaultValue ?? definition.value));
  const [localValue, setLocalValue] = React.useState(mountDefault.current);
  const [localOpen, setLocalOpen] = React.useState(props.defaultOpen ?? false);
  const [fieldsetDisabled, setFieldsetDisabled] = React.useState(false);
  const [portalDocument, setPortalDocument] = React.useState<Document | null>(null);
  const [highlight, setHighlight] = React.useState<string | null>(null);
  const [invalid, setInvalid] = React.useState(false);
  const [placement, setPlacement] = React.useState({ left: 0, top: 0, width: 0, maxHeight: 320, side: 'bottom' as 'top' | 'bottom', ready: false });
  const field = React.useRef<HTMLDivElement | null>(null), trigger = React.useRef<HTMLButtonElement | null>(null), native = React.useRef<HTMLSelectElement | null>(null), popup = React.useRef<HTMLDivElement | null>(null), clear = React.useRef<HTMLButtonElement | null>(null);
  const optionNodes = React.useRef(new Map<string, HTMLButtonElement>()), chipNodes = React.useRef(new Map<string, HTMLButtonElement>());
  const pendingOptionFocus = React.useRef<{ value: string; node: HTMLButtonElement; focusRevision: number } | null>(null);
  const highlightValue = React.useRef<string | null>(null);
  const alive = React.useRef(false), lifetime = React.useRef(0), interaction = React.useRef(0), focusRevision = React.useRef(0), internalFocus = React.useRef<HTMLElement | null>(null);
  const eventTickets = React.useRef(new WeakMap<Event, Ticket>());
  const drainFieldsetRecords = React.useRef<() => void>(() => {});
  const valueModeEpoch = React.useRef(0), openModeEpoch = React.useRef(0);
  const openingTicket = React.useRef<Ticket | null>(null), openingSearch = React.useRef('');
  const acceptedOpenRevisions = React.useRef<{ from: number; to: number; stamp: number }[]>([]), acceptedValueRevisions = React.useRef<{ from: number; to: number; stamp: number }[]>([]);
  const resets = React.useRef<ResetRecord[]>([]), lastAcceptedValue = React.useRef(0);
  const typed = React.useRef({ text: '', time: 0 });
  const controlledValue = incomingValue !== undefined, controlledOpen = props.open !== undefined;
  const authority = React.useRef<Authority>({ valueControlled: controlledValue, value: incomingValue ?? localValue, openControlled: controlledOpen, open: props.open ?? localOpen, valueRevision: 0, openRevision: 0, disabled: !!props.disabled, readOnly: !!props.readOnly });
  const value = incomingValue ?? (authority.current.valueControlled ? authority.current.value : localValue);
  const desiredOpen = props.open ?? (authority.current.openControlled ? authority.current.open : localOpen);
  const selected = flat.filter(option => value.includes(option.value)), resolvedValues = selected.map(option => option.value);
  const disabled = !!props.disabled || fieldsetDisabled, actualOpen = desiredOpen && !disabled && !props.readOnly;
  const latest = React.useRef({ props, flat, value, actualOpen, disabled });
  const label = props.label ?? definition.label, placeholder = props.placeholder ?? definition.placeholder, helper = props.helper ?? definition.helper;
  const summary = selected.length === 0 ? placeholder : selected.length === 1 ? selected[0].label : `${selected.length} ${props.pluralLabel ?? definition.pluralLabel}`;
  const invalidMessage = props.error || (invalid ? 'Please select at least one option.' : undefined);
  const describedBy = [props['aria-describedby'], props.required && !props.readOnly ? requiredId : '', helper ? helperId : '', invalidMessage ? errorId : ''].filter(Boolean).join(' ') || undefined;
  const accessibleLabel = props['aria-labelledby'] ?? (props['aria-label'] ? undefined : labelId);
  const blockNow = () => !!latest.current.props.disabled || !!latest.current.props.readOnly || disabledByFieldset(trigger.current);
  React.useImperativeHandle(forwardedRef, () => trigger.current!, []);
  const ownedFocus = (node: HTMLElement | null) => {
    if (!node) return;
    // Ignore only the precise focus event we initiated. A consumer can call
    // focus() again from its capture/bubble handler before this call returns.
    const previous = internalFocus.current; internalFocus.current = node;
    try { node.focus({ preventScroll: true }); } finally { internalFocus.current = previous; }
  };
  const syncBridge = (requested?: readonly string[]) => {
    const element = native.current; if (!element) return;
    const current = latest.current, wanted = requested ?? current.value;
    const defaults = current.props.value !== undefined ? wanted : mountDefault.current;
    for (const option of Array.from(element.options)) { option.defaultSelected = defaults.includes(option.value); option.selected = wanted.includes(option.value); }
  };
  useLayout(() => {
    const previous = authority.current;
    if (previous.valueControlled !== controlledValue) valueModeEpoch.current++;
    if (previous.openControlled !== controlledOpen) openModeEpoch.current++;
    const valueChanged = previous.valueControlled !== controlledValue || (controlledValue && !same(previous.value, value));
    const openChanged = previous.openControlled !== controlledOpen || (controlledOpen && previous.open !== desiredOpen);
    if (previous.disabled !== !!props.disabled || previous.readOnly !== !!props.readOnly) interaction.current++;
    authority.current = { valueControlled: controlledValue, value, openControlled: controlledOpen, open: desiredOpen, valueRevision: previous.valueRevision + Number(valueChanged), openRevision: previous.openRevision + Number(openChanged), disabled: !!props.disabled, readOnly: !!props.readOnly };
    latest.current = { props, flat, value, actualOpen, disabled };
    if (previous.valueControlled && !controlledValue) setLocalValue(previous.value);
    if (previous.openControlled && !controlledOpen) setLocalOpen(previous.open);
    // Reassociation inside a reset handler participates in that native reset.
    // A render after reset() returns is a new operation, even in the same task.
    for (const record of resets.current) if (record.event.eventPhase !== 0) record.associatedDuringDispatch = native.current?.form === record.form;
    syncBridge();
    // Mounts and ownership handoffs inside a reset need a post-default reconciliation.
    microtask(() => { if (alive.current) syncBridge(); });
    if (invalid && (!props.required || props.readOnly || selected.length > 0 || disabled)) setInvalid(false);
    if ((disabled || props.readOnly) && !controlledOpen && localOpen) setLocalOpen(false);
  });
  const ticketFor = (event: Event): Ticket => {
    drainFieldsetRecords.current();
    return { stamp: ++sequence, lifetime: lifetime.current, interaction: interaction.current, valueRevision: authority.current.valueRevision, openRevision: authority.current.openRevision, focusRevision: focusRevision.current, gate: gateFor(event, event.type === 'keydown' || event.type === 'invalid'), focusOrigin: trigger.current?.ownerDocument.activeElement ?? null };
  };
  const ticketForEvent = (event: Event) => { let ticket = eventTickets.current.get(event); if (!ticket) { ticket = ticketFor(event); eventTickets.current.set(event, ticket); } return ticket; };
  const validTicket = (ticket: Ticket) => {
    drainFieldsetRecords.current();
    return alive.current && ticket.lifetime === lifetime.current && ticket.interaction === interaction.current && !blockNow() && !ticket.gate.canceled && !resets.current.some(record => record.associatedDuringDispatch && record.stamp > ticket.stamp && !record.event.defaultPrevented);
  };
  const focusWasRedirected = (ticket: Ticket) => {
    const doc = trigger.current?.ownerDocument, active = doc?.activeElement;
    return ticket.focusRevision !== focusRevision.current || !!(active && active !== doc?.body && active !== ticket.focusOrigin && !trigger.current?.contains(active) && !popup.current?.contains(active));
  };
  const resolveRevision = (revision: number, accepted: readonly { from: number; to: number; stamp: number }[], stamp: number) => {
    for (const item of accepted) if (item.from === revision && item.stamp < stamp) revision = item.to;
    return revision;
  };
  const currentTicket = (ticket: Ticket) => validTicket(ticket) && resolveRevision(ticket.valueRevision, acceptedValueRevisions.current, ticket.stamp) === authority.current.valueRevision && resolveRevision(ticket.openRevision, acceptedOpenRevisions.current, ticket.stamp) === authority.current.openRevision;
  useLayout(() => {
    alive.current = true; lifetime.current++;
    const element = trigger.current; if (!element) return;
    const doc = element.ownerDocument; setPortalDocument(doc);
    let observedDisabled = disabledByFieldset(element);
    const updateDisabled = (records: MutationRecord[] = []) => {
      const next = disabledByFieldset(element);
      const disabledDuringBatch = records.some(record => {
        if (record.type !== 'attributes' || record.attributeName !== 'disabled') return false;
        const fieldset = record.target as HTMLFieldSetElement;
        if (fieldset.tagName !== 'FIELDSET' || !fieldset.contains(element) || (record.oldValue === null && !fieldset.disabled)) return false;
        const firstLegend = Array.from(fieldset.children).find(child => child.tagName === 'LEGEND');
        return !firstLegend?.contains(element);
      });
      if (disabledDuringBatch || observedDisabled !== next) interaction.current++;
      observedDisabled = next; setFieldsetDisabled(next);
      if (next) setLocalOpen(false);
    };
    updateDisabled();
    const captureGesture = (event: Event) => { const target = event.target as Node | null; if (target && (field.current?.contains(target) || popup.current?.contains(target))) ticketForEvent(event); };
    const trackFocus = (event: Event) => { if (event.target !== internalFocus.current) focusRevision.current++; };
    const onReset = (event: Event) => {
      const form = event.target as HTMLFormElement | null;
      if (!form || form.tagName !== 'FORM' || form.ownerDocument !== doc) return;
      let stamp = resetStamps.get(event); if (stamp === undefined) { stamp = ++sequence; resetStamps.set(event, stamp); }
      const record: ResetRecord = { event, stamp, form, associatedDuringDispatch: native.current?.form === form, valueControlled: authority.current.valueControlled, openControlled: authority.current.openControlled, valueMode: valueModeEpoch.current, openMode: openModeEpoch.current };
      resets.current.push(record); const life = lifetime.current;
      microtask(() => {
        if (!alive.current || lifetime.current !== life) return;
        if (event.defaultPrevented) { resets.current = resets.current.filter(item => item !== record); return; }
        flushSync(() => {});
        if (!alive.current || lifetime.current !== life || !record.associatedDuringDispatch) { resets.current = resets.current.filter(item => item !== record); return; }
        resets.current = resets.current.filter(item => item.stamp >= record.stamp);
        flushSync(() => {
          if (lastAcceptedValue.current <= record.stamp && !record.valueControlled && record.valueMode === valueModeEpoch.current && latest.current.props.value === undefined) setLocalValue(mountDefault.current);
          setInvalid(false);
          if (!record.openControlled && record.openMode === openModeEpoch.current && latest.current.props.open === undefined) setLocalOpen(false);
        });
        syncBridge(); typed.current = { text: '', time: 0 };
      });
    };
    doc.addEventListener('reset', onReset, true); doc.addEventListener('click', captureGesture, true); doc.addEventListener('keydown', captureGesture, true); doc.addEventListener('focusin', trackFocus, true);
    const Observer = doc.defaultView?.MutationObserver, observer = Observer ? new Observer(updateDisabled) : null;
    observer?.observe(doc.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['disabled'], attributeOldValue: true });
    drainFieldsetRecords.current = () => { const records = observer?.takeRecords(); if (records?.length) updateDisabled(records); };
    return () => {
      alive.current = false; lifetime.current++; interaction.current++; observer?.disconnect(); drainFieldsetRecords.current = () => {};
      doc.removeEventListener('reset', onReset, true); doc.removeEventListener('click', captureGesture, true); doc.removeEventListener('keydown', captureGesture, true); doc.removeEventListener('focusin', trackFocus, true); optionNodes.current.clear(); chipNodes.current.clear();
    };
  }, []);
  const registerAcceptance = (list: React.MutableRefObject<{ from: number; to: number; stamp: number }[]>, from: number, to: number, stamp: number) => {
    const accepted = { from, to, stamp }; list.current.push(accepted);
    microtask(() => { list.current = list.current.filter(item => item !== accepted); });
  };
  const acceptOpen = (next: boolean, reason: MultiSelectOpenChangeReason, event: Event, ticket: Ticket, restore = false, afterAccept?: () => void) => {
    flushSync(() => {});
    if (!currentTicket(ticket) || latest.current.actualOpen === next) return;
    const detail = detailFor(reason, event), beforeRevision = authority.current.openRevision, beforeMode = openModeEpoch.current;
    const wasControlled = latest.current.props.open !== undefined;
    if (next) openingTicket.current = ticket;
    const callback = latest.current.props.onOpenChange;
    if (callback) flushSync(() => callback(next, detail));
    if (detail.defaultPrevented || !validTicket(ticket)) { if (next) openingTicket.current = null; return; }
    const current = latest.current;
    if (wasControlled && current.props.open === next && beforeMode === openModeEpoch.current && beforeRevision !== authority.current.openRevision) registerAcceptance(acceptedOpenRevisions, beforeRevision, authority.current.openRevision, ticket.stamp);
    if (beforeRevision === authority.current.openRevision && current.props.open === undefined) flushSync(() => setLocalOpen(next));
    const accepted = latest.current.actualOpen === next;
    if (next && !accepted) openingTicket.current = null;
    if (accepted && !next && !focusWasRedirected(ticket)) { if (restore) ownedFocus(trigger.current); afterAccept?.(); }
  };
  const requestOpen = (next: boolean, reason: MultiSelectOpenChangeReason, event: Event, restore = false) => {
    const ticket = ticketForEvent(event); if (!currentTicket(ticket)) return;
    microtask(() => acceptOpen(next, reason, event, ticket, restore));
  };
  type Mutation = { kind: 'toggle'; value: string } | { kind: 'remove'; value: string } | { kind: 'clear' };
  const mutate = (mutation: Mutation, reason: MultiSelectValueChangeReason, event: Event) => {
    const ticket = ticketForEvent(event); if (!currentTicket(ticket)) return;
    const focusedChip = mutation.kind === 'remove' ? chipNodes.current.get(mutation.value) : undefined;
    const ownedChip = !!focusedChip && focusedChip.ownerDocument.activeElement === focusedChip;
    const originalChips = latest.current.flat.filter(option => latest.current.value.includes(option.value) && !option.disabled).map(option => option.value);
    microtask(() => {
      flushSync(() => {}); if (!currentTicket(ticket)) return;
      const before = latest.current, mutable = new Set(before.flat.filter(option => !option.disabled).map(option => option.value));
      if (mutation.kind !== 'clear' && !mutable.has(mutation.value)) return;
      const next = values(mutation.kind === 'clear' ? before.value.filter(value => !mutable.has(value)) : mutation.kind === 'remove' || before.value.includes(mutation.value) ? before.value.filter(value => value !== mutation.value) : [...before.value, mutation.value]);
      if (same(next, before.value)) return;
      const detail = detailFor(reason, event), beforeRevision = authority.current.valueRevision, beforeMode = valueModeEpoch.current;
      const wasControlled = before.props.value !== undefined;
      const changedValues = before.value.filter(value => !next.includes(value)).concat(next.filter(value => !before.value.includes(value)));
      if (before.props.onValueChange) flushSync(() => before.props.onValueChange!(next, detail));
      if (detail.defaultPrevented || !validTicket(ticket)) return;
      const current = latest.current;
      if (wasControlled && same(current.value, next) && beforeMode === valueModeEpoch.current && beforeRevision !== authority.current.valueRevision) registerAcceptance(acceptedValueRevisions, beforeRevision, authority.current.valueRevision, ticket.stamp);
      if (changedValues.some(value => !current.flat.some(option => option.value === value && !option.disabled))) return;
      if (beforeRevision === authority.current.valueRevision && current.props.value === undefined) {
        lastAcceptedValue.current = ticket.stamp;
        flushSync(() => { setLocalValue(next); setInvalid(false); }); syncBridge(next);
      }
      if (!same(latest.current.value, next)) return;
      if (ownedChip && mutation.kind === 'remove' && !focusWasRedirected(ticket)) {
        const index = originalChips.indexOf(mutation.value);
        const candidates = [...originalChips.slice(index + 1), ...originalChips.slice(0, index).reverse()];
        const target = candidates.map(value => chipNodes.current.get(value)).find(node => node?.isConnected && !node.disabled);
        ownedFocus(target ?? (clear.current && !clear.current.disabled ? clear.current : trigger.current));
      } else if (mutation.kind === 'clear' && clear.current && clear.current.ownerDocument.activeElement === clear.current && clear.current.disabled && !focusWasRedirected(ticket)) ownedFocus(trigger.current);
    });
  };
  const focusOption = (next: string | null) => {
    highlightValue.current = next; setHighlight(next);
    const node = next ? optionNodes.current.get(next) : popup.current; ownedFocus(node ?? null);
    if (node && popup.current) {
      const box = popup.current, top = node.offsetTop - box.offsetTop;
      if (top < box.scrollTop) box.scrollTop = top;
      else if (top + node.offsetHeight > box.scrollTop + box.clientHeight) box.scrollTop = top + node.offsetHeight - box.clientHeight;
    }
  };
  const enabled = flat.filter(option => !option.disabled), enabledKey = JSON.stringify(enabled.map(option => option.value)), geometryKey = JSON.stringify(flat);
  const wasOpen = React.useRef(false);
  useLayout(() => {
    if (!actualOpen || !portalDocument || !popup.current) { if (!actualOpen) { wasOpen.current = false; typed.current = { text: '', time: 0 }; } return; }
    const opening = !wasOpen.current; wasOpen.current = true;
    const active = portalDocument.activeElement, detached = pendingOptionFocus.current;
    const stillOwnsFocus = !!(active && popup.current.contains(active)) || !!(detached && !detached.node.isConnected && active === portalDocument.body && detached.focusRevision === focusRevision.current);
    if (opening || !enabled.some(option => option.value === highlightValue.current)) {
      const search = openingSearch.current.toLocaleLowerCase();
      const chosen = (search ? enabled.find(option => option.label.trim().toLocaleLowerCase().startsWith(search)) : undefined) ?? enabled[0];
      openingSearch.current = '';
      const ticket = openingTicket.current; openingTicket.current = null;
      if ((opening && ticket && focusWasRedirected(ticket)) || (!opening && !stillOwnsFocus)) { highlightValue.current = chosen?.value ?? null; setHighlight(highlightValue.current); }
      else focusOption(chosen?.value ?? null);
    }
    pendingOptionFocus.current = null;
  }, [actualOpen, portalDocument, enabledKey]);
  useLayout(() => {
    const pending = pendingOptionFocus.current; pendingOptionFocus.current = null;
    if (!pending || !actualOpen || !portalDocument || blockNow()) return;
    const replacement = optionNodes.current.get(pending.value);
    if (replacement && replacement !== pending.node && !pending.node.isConnected && replacement.isConnected && portalDocument.activeElement === portalDocument.body && pending.focusRevision === focusRevision.current && !replacement.disabled) focusOption(pending.value);
  });
  useLayout(() => {
    if (!actualOpen || !portalDocument || !popup.current || !trigger.current) return;
    const doc = portalDocument, win = doc.defaultView; if (!win) return;
    let frame = 0;
    const position = () => {
      const anchor = trigger.current, panel = popup.current; if (!anchor || !panel) return;
      const rect = anchor.getBoundingClientRect(), viewport = win.visualViewport;
      const x = viewport?.offsetLeft ?? 0, y = viewport?.offsetTop ?? 0, width = viewport?.width ?? win.innerWidth, height = viewport?.height ?? win.innerHeight;
      const below = Math.max(0, y + height - rect.bottom - 12), above = Math.max(0, rect.top - y - 12), desired = Math.min(320, panel.scrollHeight || 200);
      const side = below < desired && above > below ? 'top' : 'bottom';
      const maxHeight = Math.max(1, Math.min(320, side === 'bottom' ? below : above));
      const popupWidth = Math.max(1, Math.min(rect.width || 256, Math.max(1, width - 16)));
      const rtl = (latest.current.props.dir ?? win.getComputedStyle(anchor).direction) === 'rtl';
      const left = Math.max(x + 8, Math.min(rtl ? rect.right - popupWidth : rect.left, x + width - popupWidth - 8));
      const actualHeight = Math.min(maxHeight, panel.getBoundingClientRect().height || desired);
      const top = side === 'bottom' ? Math.max(y + 8, Math.min(rect.bottom + 4, y + height - actualHeight - 8)) : Math.max(y + 8, rect.top - actualHeight - 4);
      const next = { left, top, width: popupWidth, maxHeight, side, ready: true } as typeof placement;
      setPlacement(previous => Object.keys(next).every(key => previous[key as keyof typeof next] === next[key as keyof typeof next]) ? previous : next);
    };
    const schedule = () => { if (!frame) frame = win.requestAnimationFrame(() => { frame = 0; position(); }); };
    position(); win.addEventListener('resize', schedule); doc.addEventListener('scroll', schedule, true);
    win.visualViewport?.addEventListener('resize', schedule); win.visualViewport?.addEventListener('scroll', schedule);
    const observer = win.ResizeObserver ? new win.ResizeObserver(schedule) : null;
    observer?.observe(trigger.current); observer?.observe(popup.current);
    return () => { if (frame) win.cancelAnimationFrame(frame); observer?.disconnect(); win.removeEventListener('resize', schedule); doc.removeEventListener('scroll', schedule, true); win.visualViewport?.removeEventListener('resize', schedule); win.visualViewport?.removeEventListener('scroll', schedule); };
  }, [actualOpen, portalDocument, geometryKey, props.dir]);
  const outsideHandler = React.useRef(requestOpen); outsideHandler.current = requestOpen;
  useLayout(() => {
    if (!actualOpen || !portalDocument) return;
    const outside = (event: Event) => {
      const target = event.target as Node | null;
      if (target && !field.current?.contains(target) && !popup.current?.contains(target)) outsideHandler.current(false, event.type === 'focusin' ? 'focus-out' : 'outside-pointer', event);
    };
    portalDocument.addEventListener('pointerdown', outside, true); portalDocument.addEventListener('focusin', outside, true);
    return () => { portalDocument.removeEventListener('pointerdown', outside, true); portalDocument.removeEventListener('focusin', outside, true); };
  }, [actualOpen, portalDocument]);
  const typeahead = (key: string) => {
    const now = Date.now(); let search = now - typed.current.time < 700 ? typed.current.text + key : key;
    typed.current = { text: search, time: now };
    if (search.length > 1 && [...search].every(character => character === search[0])) search = search[0];
    const available = latest.current.flat.filter(option => !option.disabled), start = available.findIndex(option => option.value === highlightValue.current);
    const ordered = [...available.slice(start + 1), ...available.slice(0, start + 1)];
    if (search.length > 1 && start >= 0) ordered.unshift(available[start]);
    const found = ordered.find(option => option.label.trim().toLocaleLowerCase().startsWith(search.toLocaleLowerCase()));
    if (found) focusOption(found.value);
  };
  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>, suppliedTicket?: Ticket) => {
    const nativeEvent = event.nativeEvent, key = event.key, backward = event.shiftKey;
    if (event.defaultPrevented || nativeEvent.isComposing || nativeEvent.keyCode === 229 || key === 'Process' || event.altKey || event.ctrlKey || event.metaKey || (event.shiftKey && key !== 'Tab') || blockNow()) return;
    const ticket = suppliedTicket ?? ticketForEvent(nativeEvent);
    if (event.repeat && ['Enter', ' ', 'Escape', 'Tab'].includes(key)) { ticket.gate.preventNative(); return; }
    // Enter and Space belong to the real button's native activation behavior.
    if (key === 'Enter' || key === ' ') return;
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End', 'Escape', 'Tab'].includes(key) && key.length !== 1) return;
    const beganOpen = latest.current.actualOpen;
    const sourceFocus = trigger.current?.ownerDocument.activeElement;
    if (!sourceFocus || (!trigger.current?.contains(sourceFocus) && !popup.current?.contains(sourceFocus))) return;
    if (!beganOpen && ['Tab', 'Escape', 'Home', 'End'].includes(key)) return;
    if (!currentTicket(ticket)) return;
    ticket.gate.preventNative();
    microtask(() => {
      flushSync(() => {}); if (!currentTicket(ticket) || focusWasRedirected(ticket)) return;
      const active = trigger.current?.ownerDocument.activeElement;
      if ((beganOpen || latest.current.actualOpen) && (!active || (!trigger.current?.contains(active) && !popup.current?.contains(active)))) return;
      if (!latest.current.actualOpen) {
        openingSearch.current = key.length === 1 ? key : '';
        if (key.length === 1) typed.current = { text: key, time: Date.now() };
        acceptOpen(true, 'keyboard', nativeEvent, ticket); return;
      }
      if (key === 'Escape') { acceptOpen(false, 'escape', nativeEvent, ticket, true); return; }
      const available = latest.current.flat.filter(option => !option.disabled);
      if (key === 'Tab') {
        const currentIndex = available.findIndex(option => optionNodes.current.get(option.value) === active), wasPopupRoot = active === popup.current;
        if (currentIndex >= 0) {
          const next = available[currentIndex + (backward ? -1 : 1)];
          if (next) { focusOption(next.value); return; }
        } else if (active === trigger.current && !backward && available[0]) { focusOption(available[0].value); return; }
        acceptOpen(false, 'tab', nativeEvent, ticket, false, () => {
          const button = trigger.current, doc = button?.ownerDocument; if (!button || !doc) return;
          if (backward && (currentIndex >= 0 || wasPopupRoot)) { ownedFocus(button); return; }
          const candidates = tabStops(doc, popup.current, backward), index = candidates.indexOf(button);
          ownedFocus(candidates[index + (backward ? -1 : 1)] ?? button);
        }); return;
      }
      if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) {
        if (!available.length) return;
        const current = available.findIndex(option => option.value === highlightValue.current);
        const index = key === 'Home' ? 0 : key === 'End' ? available.length - 1 : key === 'ArrowDown' ? (current + 1) % available.length : (current - 1 + available.length) % available.length;
        focusOption(available[index].value); return;
      }
      typeahead(key);
    });
  };
  const suppressRepeatedActivation = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.repeat && (event.key === 'Enter' || event.key === ' ') && !event.nativeEvent.isComposing && event.nativeEvent.keyCode !== 229 && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) ticketForEvent(event.nativeEvent).gate.preventNative();
  };
  const dir = props.dir ?? (portalDocument && trigger.current ? portalDocument.defaultView?.getComputedStyle(trigger.current).direction as 'ltr' | 'rtl' : undefined);
  const mutableSelections = selected.filter(option => !option.disabled);
  const panel = actualOpen && portalDocument ? createPortal(<div ref={popup} id={popupId} role="dialog" aria-modal="false" aria-labelledby={accessibleLabel} aria-label={props['aria-label']} tabIndex={-1} className="wix-multi-select wix-ms-popup" data-component={variant} data-variant={variant} data-motion={props.motion ?? 'system'} data-state="open" data-side={placement.side} dir={dir} onKeyDown={onKeyDown} style={{ position: 'fixed', left: placement.left, top: placement.top, width: placement.width, maxWidth: 'calc(100vw - 16px)', maxHeight: placement.maxHeight, overflowY: 'auto', overscrollBehavior: 'contain', zIndex: 1000, visibility: placement.ready ? 'visible' : 'hidden' }}>
    <div className="wix-ms-options">{flat.map(option => {
      const checked = value.includes(option.value);
      const optionKey = Array.from(option.value).map(character => character.codePointAt(0)!.toString(16)).join('-');
      return <button type="button" key={option.value} id={`${id}-option-${optionKey}`} className="wix-ms-option" disabled={option.disabled} aria-pressed={checked} data-value={option.value} data-state={checked ? 'checked' : 'unchecked'} data-disabled={option.disabled ? 'true' : undefined} data-highlighted={highlight === option.value ? 'true' : undefined}
        ref={node => { if (node) optionNodes.current.set(option.value, node); else { const previous = optionNodes.current.get(option.value); if (previous && previous.ownerDocument.activeElement === previous) pendingOptionFocus.current = { value: option.value, node: previous, focusRevision: focusRevision.current }; optionNodes.current.delete(option.value); } }}
        onFocus={() => { if (!option.disabled) { highlightValue.current = option.value; setHighlight(option.value); } }}
        onClick={event => { if (!event.defaultPrevented && !option.disabled) mutate({ kind: 'toggle', value: option.value }, event.detail === 0 ? 'keyboard' : 'pointer', event.nativeEvent); }}>
        <span className="wix-ms-option-label">{option.label}</span>{checked ? <span className="wix-ms-check" aria-hidden="true"><Check /></span> : null}
      </button>;
    })}{!flat.length ? <div className="wix-ms-empty">No options available</div> : null}</div>
  </div>, portalDocument.body) : null;
  const tp = props.triggerProps ?? {};
  return <div ref={field} className={`wix-multi-select${props.className ? ` ${props.className}` : ''}`} data-component={variant} data-variant={variant} data-motion={props.motion ?? 'system'} data-disabled={disabled ? 'true' : undefined} data-readonly={props.readOnly ? 'true' : undefined} dir={props.dir} style={props.style}>
    <div className="wix-ms-field" data-disabled={disabled || undefined} data-readonly={props.readOnly || undefined} data-invalid={props['aria-invalid'] ?? (!!invalidMessage || undefined)}>
      <label className="wix-ms-label" id={labelId} htmlFor={id}>{label}{props.required ? <span className="wix-ms-required" aria-hidden="true"> *</span> : null}</label>
      <button title={tp.title} tabIndex={tp.tabIndex} autoFocus={tp.autoFocus} onPointerDown={tp.onPointerDown} onPointerDownCapture={tp.onPointerDownCapture} onFocus={tp.onFocus} onFocusCapture={tp.onFocusCapture} onBlur={tp.onBlur} onBlurCapture={tp.onBlurCapture} ref={trigger} type="button" id={id} className="wix-ms-trigger" aria-haspopup="dialog" aria-controls={actualOpen ? popupId : undefined} aria-expanded={actualOpen} aria-labelledby={accessibleLabel} aria-label={props['aria-label']} aria-describedby={describedBy} aria-invalid={props['aria-invalid'] ?? (!!invalidMessage || undefined)} aria-disabled={props.readOnly || undefined} disabled={disabled} data-state={actualOpen ? 'open' : 'closed'} data-placeholder={!selected.length ? 'true' : undefined} data-disabled={disabled ? 'true' : undefined} data-readonly={props.readOnly ? 'true' : undefined}
        onClickCapture={event => { ticketForEvent(event.nativeEvent); tp.onClickCapture?.(event); }}
        onKeyDownCapture={event => { ticketForEvent(event.nativeEvent); tp.onKeyDownCapture?.(event); }}
        onClick={event => {
          const ticket = ticketForEvent(event.nativeEvent); tp.onClick?.(event);
          if (!event.defaultPrevented && currentTicket(ticket)) microtask(() => { if (!currentTicket(ticket)) return; openingSearch.current = ''; const next = !latest.current.actualOpen; acceptOpen(next, 'trigger', event.nativeEvent, ticket, !next); });
        }}
        onKeyDown={event => { const ticket = ticketForEvent(event.nativeEvent); tp.onKeyDown?.(event); onKeyDown(event, ticket); }}>
        <span className="wix-ms-value">{summary}</span><Chevron />
      </button>
    </div>
    {props.clearable || props.showSelectedItems ? <div className="wix-ms-enhancements">
      {props.clearable ? <button ref={clear} type="button" className="wix-ms-clear" onKeyDown={suppressRepeatedActivation} disabled={disabled || !!props.readOnly || !mutableSelections.length} onClick={event => { if (!event.defaultPrevented) mutate({ kind: 'clear' }, 'clear', event.nativeEvent); }}>Clear available selections</button> : null}
      {props.showSelectedItems && selected.length ? <div className="wix-ms-chips" aria-label="Selected items">{selected.map(option => <span className="wix-ms-chip" key={option.value} data-disabled={option.disabled ? 'true' : undefined}>
        <span className="wix-ms-chip-label">{option.label}</span><button type="button" className="wix-ms-remove" onKeyDown={suppressRepeatedActivation} aria-label={`Remove ${option.label}`} disabled={disabled || !!props.readOnly || !!option.disabled} ref={node => { if (node) chipNodes.current.set(option.value, node); else chipNodes.current.delete(option.value); }} onClick={event => { if (!event.defaultPrevented) mutate({ kind: 'remove', value: option.value }, 'remove', event.nativeEvent); }}><span aria-hidden="true">×</span></button>
      </span>)}</div> : null}
    </div> : null}
    <select ref={native} className="wix-ms-native" multiple name={props.name} form={props.form} required={!!props.required && !props.readOnly} disabled={disabled} value={resolvedValues} tabIndex={-1} aria-hidden="true" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', clipPath: 'inset(50%)', whiteSpace: 'nowrap', border: 0, opacity: 0, pointerEvents: 'none' }}
      onChange={() => syncBridge()}
      onInvalid={event => {
        const ticket = ticketForEvent(event.nativeEvent); ticket.gate.preventNative();
        microtask(() => { flushSync(() => {}); if (currentTicket(ticket) && latest.current.props.required && !latest.current.props.readOnly) { setInvalid(true); if (!focusWasRedirected(ticket)) ownedFocus(trigger.current); } });
      }}>
      {flat.map(option => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}
    </select>
    {props.required && !props.readOnly ? <span id={requiredId} className="wix-ms-sr-only">Required</span> : null}
    {helper ? <p id={helperId} className="wix-ms-helper">{helper}</p> : null}
    {invalidMessage ? <p id={errorId} className="wix-ms-error" role="alert">{invalidMessage}</p> : null}
    {panel}
  </div>;
}
const Core = React.forwardRef<HTMLButtonElement, CoreProps>(MultiSelect);
Core.displayName = 'MultiSelectControl';
export const Select32 = React.forwardRef<HTMLButtonElement, Select32Props>((props, ref) => <Core {...props} variant="select-32" ref={ref} />);
export const Select33 = React.forwardRef<HTMLButtonElement, Select33Props>((props, ref) => <Core {...props} variant="select-33" ref={ref} />);
Select32.displayName = 'Select32';
Select33.displayName = 'Select33';
