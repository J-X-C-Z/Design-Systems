import * as React from 'react';
import { createPortal, flushSync } from 'react-dom';
import type { SelectAvailabilityProps, Select18Props, Select19Props, Select20Props, Select21Props, SelectItem, SelectOption, SelectGroup, SelectChangeDetail, SelectOpenChangeReason, SelectValueChangeReason, WixSelectAvailabilityId } from './types.js';
export type * from './types.js';
export const wixSelectAvailabilityIds = Object.freeze(['select-18', 'select-19', 'select-20', 'select-21'] as const);

type InternalVariant = WixSelectAvailabilityId;
type CoreProps = SelectAvailabilityProps & { readonly variant: InternalVariant };
const definitions = {
  "select-18": {
    "label": "UI Scaling Factor",
    "placeholder": "Display scale",
    "value": "100",
    "options": [
      {
        "value": "80",
        "label": "Compact View (80%)",
        "disabled": false
      },
      {
        "value": "100",
        "label": "Standard Scale (100%)",
        "disabled": false
      },
      {
        "value": "125",
        "label": "Cozy Desktop (125%)",
        "disabled": false
      },
      {
        "value": "150",
        "label": "Accessible (150%)",
        "disabled": false
      }
    ]
  },
  "select-19": {
    "label": "Transfer Protocol (Locked)",
    "placeholder": "System protocol",
    "value": "v2",
    "options": [
      {
        "value": "v1.1",
        "label": "HTTP/1.1 Standard",
        "disabled": false
      },
      {
        "value": "v2",
        "label": "HTTP/2 Binary",
        "disabled": false
      },
      {
        "value": "v3",
        "label": "HTTP/3 QUIC",
        "disabled": false
      }
    ]
  },
  "select-20": {
    "label": "Infrastructure Region",
    "placeholder": "System instance",
    "value": "use1",
    "options": [
      {
        "value": "use1",
        "label": "US-East (N. Virginia)",
        "disabled": false
      },
      {
        "value": "euw1",
        "label": "EU-West (Ireland) — [Full]",
        "disabled": true
      },
      {
        "value": "apse1",
        "label": "AP-Southeast (Singapore)",
        "disabled": false
      },
      {
        "value": "sae1",
        "label": "SA-East (São Paulo) — [Offline]",
        "disabled": true
      }
    ]
  },
  "select-21": {
    "label": "Identity Verification",
    "placeholder": "Identify your status",
    "value": "verified",
    "options": [
      {
        "value": "unverified",
        "label": "Unverified Guest",
        "disabled": false
      },
      {
        "value": "verified",
        "label": "Identity Confirmed",
        "disabled": false
      },
      {
        "value": "privileged",
        "label": "Privileged Access",
        "disabled": false
      },
      {
        "value": "restricted",
        "label": "Restricted Entry",
        "disabled": false
      }
    ]
  }
} satisfies Record<InternalVariant, { label: string; placeholder: string; value: string; options: readonly SelectItem[] }>;
const useLayout = typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;
const microtask = (fn: () => void) => { if (typeof queueMicrotask === 'function') queueMicrotask(fn); else Promise.resolve().then(fn); };
let sequence = 0;
const resetStamps = new WeakMap<Event, number>();
interface Gate { canceled: boolean; preventNative: () => void }
const eventGates = new WeakMap<Event, Gate>();
/** Distinguishes our keyboard scroll prevention from a consumer's later preventDefault. */
function gateFor(event: Event): Gate {
  // Only handled keydown events need to distinguish our own scroll prevention.
  // Pointer/focus proposals read the native flag without replacing event methods,
  // so independently bundled controls can observe the same outside event safely.
  if (event.type !== 'keydown') return { get canceled() { return event.defaultPrevented; }, preventNative: () => event.preventDefault() };
  const existing = eventGates.get(event); if (existing) return existing;
  const original = event.preventDefault;
  const descriptor = Object.getOwnPropertyDescriptor(event, 'preventDefault');
  const gate: Gate = { canceled: event.defaultPrevented, preventNative: () => original.call(event) };
  const wrapped = function(this: Event) { gate.canceled = true; original.call(this); };
  try {
    Object.defineProperty(event, 'preventDefault', { configurable: true, writable: true, value: wrapped });
    microtask(() => microtask(() => { if (event.preventDefault === wrapped) { if (descriptor) Object.defineProperty(event, 'preventDefault', descriptor); else Reflect.deleteProperty(event, 'preventDefault'); } }));
  } catch { /* Non-extensible custom Events cannot distinguish late prevention from ours. */ }
  eventGates.set(event, gate); return gate;
}
function detailFor<R extends string>(reason: R, event: Event): SelectChangeDetail<R> {
  let canceled = false;
  return { reason, originalEvent: event, cancelable: true, get defaultPrevented() { return canceled; }, preventDefault() { canceled = true; } };
}
function isGroup(item: SelectItem): item is SelectGroup { return item.options !== undefined; }
/** Snapshot the public fields once; validation and both renderers share these values. */
function snapshotItems(items: readonly SelectItem[]): SelectItem[] {
  const snapshot = (item: SelectItem): SelectItem => {
    const value = item.value, label = item.label, disabled = item.disabled, options = item.options;
    // Keep prohibited fields for the existing validation, including malformed inputs.
    return { value, label, disabled, options } as SelectItem;
  };
  return items.map(item => {
    const copy = snapshot(item);
    return isGroup(copy) ? { ...copy, options: copy.options.map(option => snapshot(option) as SelectOption) } : copy;
  });
}
interface FlatOption extends SelectOption { blocked: boolean; index: number }
function flatten(items: readonly SelectItem[]): FlatOption[] {
  const values = new Set<string>(); const out: FlatOption[] = [];
  const add = (option: SelectOption, groupDisabled = false) => {
    if (typeof option.value !== 'string' || option.value === '' || values.has(option.value)) throw new Error('wix-select-availability: option values must be unique, nonempty strings.');
    if (typeof option.label !== 'string') throw new Error('wix-select-availability: option labels must be strings.');
    values.add(option.value); out.push({ ...option, blocked: !!(groupDisabled || option.disabled), index: out.length });
  };
  items.forEach(item => { if (isGroup(item)) { if (item.value !== undefined || typeof item.label !== 'string') throw new Error('wix-select-availability: groups need a string label and cannot have a value.'); item.options.forEach(option => add(option, item.disabled)); } else add(item); });
  return out;
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
}
function Chevron({ up = false, className = '' }: { up?: boolean; className?: string }) { return <svg className={className} aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d={up ? 'm6 15 6-6 6 6' : 'm6 9 6 6 6-6'} strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function Check() { return <svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" /></svg>; }

interface Authority { valueControlled: boolean; value: string; openControlled: boolean; open: boolean; valueRevision: number; openRevision: number; disabled: boolean; readOnly: boolean }
interface Ticket { stamp: number; lifetime: number; interaction: number; valueRevision: number; openRevision: number; focusRevision: number; gate: Gate; focusOrigin: Element | null; focusMoved: boolean }
interface ResetRecord { event: Event; stamp: number; form: HTMLFormElement; associatedDuringDispatch: boolean }
function SelectAvailability(props: CoreProps, forwardedRef: React.ForwardedRef<HTMLButtonElement>) {
  const { variant } = props; const definition = definitions[variant];
  const generated = React.useId(); const id = props.id ?? `wix-sa-${generated}`;
  const labelId = `${id}-label`, popupId = `${id}-listbox`, helperId = `${id}-helper`, errorId = `${id}-error`;
  const mountDefault = React.useRef(props.defaultValue ?? definition.value);
  const [localValue, setLocalValue] = React.useState(mountDefault.current);
  const [localOpen, setLocalOpen] = React.useState(props.defaultOpen ?? false);
  const [fieldsetDisabled, setFieldsetDisabled] = React.useState(false);
  const [portalDocument, setPortalDocument] = React.useState<Document | null>(null);
  const [highlight, setHighlight] = React.useState<string | null>(null);
  const highlightValue = React.useRef<string | null>(null);
  const [invalid, setInvalid] = React.useState(false);
  const [placement, setPlacement] = React.useState({ left: 0, top: 0, width: 0, maxHeight: 320, side: 'bottom' as 'top' | 'bottom', ready: false });
  const [overflow, setOverflow] = React.useState({ up: false, down: false });
  const trigger = React.useRef<HTMLButtonElement | null>(null), native = React.useRef<HTMLSelectElement | null>(null), listbox = React.useRef<HTMLDivElement | null>(null), popup = React.useRef<HTMLDivElement | null>(null);
  React.useImperativeHandle(forwardedRef, () => trigger.current!, []);
  const triggerRef = React.useCallback((node: HTMLButtonElement | null) => { trigger.current = node; }, []);
  const optionNodes = React.useRef(new Map<string, HTMLDivElement>());
  const pendingOptionFocus = React.useRef<{ value: string; node: HTMLDivElement } | null>(null);
  const triggerTickets = React.useRef(new WeakMap<Event, Ticket>());
  const alive = React.useRef(false), lifetime = React.useRef(0), interaction = React.useRef(0), focusRevision = React.useRef(0), internalFocus = React.useRef<HTMLElement | null>(null);
  const drainFieldsetRecords = React.useRef<() => void>(() => {});
  const valueModeEpoch = React.useRef(0), openModeEpoch = React.useRef(0);
  const openingTicket = React.useRef<Ticket | null>(null);
  const acceptedOpenRevisions = React.useRef<{ from: number; to: number; stamp: number }[]>([]);
  const acceptedValueRevisions = React.useRef<{ from: number; to: number; stamp: number }[]>([]);
  const resets = React.useRef<ResetRecord[]>([]), lastAcceptedValue = React.useRef(0);
  const openIntent = React.useRef<'first' | 'last' | 'selected'>('selected');
  const openingSearch = React.useRef('');
  const typed = React.useRef({ text: '', time: 0 });
  const items = snapshotItems(props.options ?? definition.options);
  const flat = flatten(items);
  const controlledValue = props.value !== undefined, controlledOpen = props.open !== undefined;
  const value = controlledValue ? props.value! : localValue;
  const selected = flat.find(option => option.value === value);
  const resolvedValue = selected?.value ?? '';
  const disabled = !!props.disabled || fieldsetDisabled;
  const actualOpen = (controlledOpen ? props.open! : localOpen) && !disabled && !props.readOnly;
  const authority = React.useRef<Authority>({ valueControlled: controlledValue, value, openControlled: controlledOpen, open: controlledOpen ? props.open! : localOpen, valueRevision: 0, openRevision: 0, disabled: !!props.disabled, readOnly: !!props.readOnly });
  const latest = React.useRef({ props, flat, items, value, resolvedValue, actualOpen, disabled });
  const label = props.label ?? definition.label, placeholder = props.placeholder ?? definition.placeholder;
  const helper = props.helper;
  const describedBy = [props['aria-describedby'], helper ? helperId : '', props.error || invalid ? errorId : ''].filter(Boolean).join(' ') || undefined;
  const accessibleLabel = props['aria-labelledby'] ?? (props['aria-label'] ? undefined : labelId);
  const invalidMessage = props.error || (invalid ? 'Please select an option.' : undefined);
  const blockNow = () => !!latest.current.props.disabled || !!latest.current.props.readOnly || disabledByFieldset(trigger.current);
  const ownedFocus = (node: HTMLElement | null) => {
    if (!node) return;
    // Ignore only the exact focus event initiated here. A consumer may redirect
    // focus synchronously from that event before this focus() call returns.
    const previous = internalFocus.current; internalFocus.current = node;
    try { node.focus({ preventScroll: true }); } finally { internalFocus.current = previous; }
  };
  const syncBridge = (requested?: string) => {
    const element = native.current; if (!element) return;
    const current = latest.current; const owner = current.props.value !== undefined;
    const wanted = requested ?? (owner ? current.props.value! : current.value);
    const resolved = current.flat.some(option => option.value === wanted) ? wanted : '';
    const defaultWanted = owner ? resolved : current.flat.some(option => option.value === mountDefault.current) ? mountDefault.current : '';
    for (const option of Array.from(element.options)) option.defaultSelected = option.value === defaultWanted;
    element.value = resolved;
  };
  useLayout(() => {
    const previous = authority.current;
    if (previous.valueControlled !== controlledValue) valueModeEpoch.current++;
    if (previous.openControlled !== controlledOpen) openModeEpoch.current++;
    const valueChanged = previous.valueControlled !== controlledValue || (controlledValue && previous.value !== value);
    const openChanged = previous.openControlled !== controlledOpen || (controlledOpen && previous.open !== props.open);
    if (previous.disabled !== !!props.disabled || previous.readOnly !== !!props.readOnly) interaction.current++;
    authority.current = { valueControlled: controlledValue, value, openControlled: controlledOpen, open: controlledOpen ? props.open! : localOpen, valueRevision: previous.valueRevision + Number(valueChanged), openRevision: previous.openRevision + Number(openChanged), disabled: !!props.disabled, readOnly: !!props.readOnly };
    latest.current = { props, flat, items, value, resolvedValue, actualOpen, disabled };
    if (previous.valueControlled && !controlledValue) setLocalValue(previous.value);
    if (previous.openControlled && !controlledOpen) setLocalOpen(previous.open);
    // Reassociation inside a reset handler participates in that native reset.
    // A render after reset() returns is a new operation, even in the same task.
    for (const record of resets.current) if (record.event.eventPhase !== 0) record.associatedDuringDispatch = native.current?.form === record.form;
    syncBridge();
    // A new instance may mount or release ownership inside onReset, after document capture.
    // Reconcile once more after that native reset default action using the latest owner/state.
    microtask(() => { if (alive.current) syncBridge(); });
    if (invalid && (!props.required || resolvedValue !== '' || disabled)) setInvalid(false);
    if ((disabled || props.readOnly) && !controlledOpen && localOpen) setLocalOpen(false);
  });
  useLayout(() => {
    alive.current = true; lifetime.current++;
    const element = trigger.current; if (!element) return;
    const doc = element.ownerDocument; setPortalDocument(doc);
    let observedDisabled = disabledByFieldset(element);
    const updateDisabled = (records: MutationRecord[] = []) => {
      const next = disabledByFieldset(element);
      // Observe disabled history as well as the final attribute. A true→false
      // roundtrip between an event and its proposal still revokes that event.
      const disabledDuringBatch = records.some(record => {
        if (record.type !== 'attributes' || record.attributeName !== 'disabled') return false;
        const fieldset = record.target as HTMLFieldSetElement;
        if (fieldset.tagName !== 'FIELDSET' || !fieldset.contains(element) || (record.oldValue === null && !fieldset.disabled)) return false;
        const firstLegend = Array.from(fieldset.children).find(child => child.tagName === 'LEGEND');
        return !firstLegend?.contains(element);
      });
      if (disabledDuringBatch || observedDisabled !== next) interaction.current++;
      observedDisabled = next;
      setFieldsetDisabled(next);
      if (next) setLocalOpen(false);
    };
    updateDisabled();
    const trackFocus = (event: Event) => { if (event.target !== internalFocus.current) focusRevision.current++; };
    const onReset = (event: Event) => {
      const form = event.target as HTMLFormElement | null;
      if (!form || form.tagName !== 'FORM' || form.ownerDocument !== doc) return;
      let stamp = resetStamps.get(event); if (stamp === undefined) { stamp = ++sequence; resetStamps.set(event, stamp); }
      const record: ResetRecord = { event, stamp, form, associatedDuringDispatch: native.current?.form === form }; resets.current.push(record);
      const life = lifetime.current;
      microtask(() => {
        if (!alive.current || lifetime.current !== life) return;
        if (event.defaultPrevented) { resets.current = resets.current.filter(item => item !== record); return; }
        // Observe ordinary onReset setState commits before choosing the current owner.
        flushSync(() => {});
        if (!alive.current || lifetime.current !== life || !record.associatedDuringDispatch) { resets.current = resets.current.filter(item => item !== record); return; }
        resets.current = resets.current.filter(item => item.stamp >= record.stamp);
        flushSync(() => {
          if (lastAcceptedValue.current <= record.stamp && latest.current.props.value === undefined) setLocalValue(mountDefault.current);
          setInvalid(false);
          if (latest.current.props.open === undefined) setLocalOpen(false);
        });
        syncBridge();
        typed.current = { text: '', time: 0 };
      });
    };
    doc.addEventListener('reset', onReset, true); doc.addEventListener('focusin', trackFocus, true);
    const Observer = doc.defaultView?.MutationObserver;
    const observer = Observer ? new Observer(updateDisabled) : null;
    observer?.observe(doc.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['disabled'], attributeOldValue: true });
    drainFieldsetRecords.current = () => { const records = observer?.takeRecords(); if (records?.length) updateDisabled(records); };
    return () => { alive.current = false; lifetime.current++; interaction.current++; observer?.disconnect(); drainFieldsetRecords.current = () => {}; doc.removeEventListener('reset', onReset, true); doc.removeEventListener('focusin', trackFocus, true); optionNodes.current.clear(); };
  }, []);
  const ticketFor = (event: Event): Ticket => {
    // Earlier mutations belong to the history before this new gesture.
    drainFieldsetRecords.current();
    return { stamp: ++sequence, lifetime: lifetime.current, interaction: interaction.current, valueRevision: authority.current.valueRevision, openRevision: authority.current.openRevision, focusRevision: focusRevision.current, gate: gateFor(event), focusOrigin: trigger.current?.ownerDocument.activeElement ?? null, focusMoved: false };
  };
  const triggerTicketFor = (event: Event) => { let ticket = triggerTickets.current.get(event); if (!ticket) { ticket = ticketFor(event); triggerTickets.current.set(event, ticket); } return ticket; };
  const validTicket = (ticket: Ticket) => {
    // MutationObserver delivery can follow our proposal microtask. Drain first.
    drainFieldsetRecords.current();
    return alive.current && ticket.lifetime === lifetime.current && ticket.interaction === interaction.current && !blockNow() && !ticket.gate.canceled && !resets.current.some(record => record.associatedDuringDispatch && record.stamp > ticket.stamp && !record.event.defaultPrevented);
  };
  const observeUserFocus = (ticket: Ticket, callback: () => void) => {
    const doc = trigger.current?.ownerDocument;
    const moved = (event: Event) => { const target = event.target as Node | null; if (target && !trigger.current?.contains(target) && !popup.current?.contains(target)) ticket.focusMoved = true; };
    doc?.addEventListener('focusin', moved, true);
    try { callback(); } finally { doc?.removeEventListener('focusin', moved, true); }
  };
  const focusWasRedirected = (ticket: Ticket) => {
    const doc = trigger.current?.ownerDocument; const active = doc?.activeElement;
    return ticket.focusRevision !== focusRevision.current || ticket.focusMoved || !!(active && active !== doc?.body && active !== ticket.focusOrigin && !trigger.current?.contains(active) && !popup.current?.contains(active));
  };
  const resolvedOpenRevision = (ticket: Ticket) => {
    let revision = ticket.openRevision;
    for (const accepted of acceptedOpenRevisions.current) if (accepted.from === revision && accepted.stamp < ticket.stamp) revision = accepted.to;
    return revision;
  };
  const acceptOpen = (next: boolean, reason: SelectOpenChangeReason, event: Event, ticket: Ticket, previousOpen: boolean, restore: boolean, afterAccept?: () => void) => {
    flushSync(() => {});
    if (!validTicket(ticket) || resolvedOpenRevision(ticket) !== authority.current.openRevision || previousOpen === next || latest.current.actualOpen === next) return;
    const detail = detailFor(reason, event);
    const beforeRevision = authority.current.openRevision, beforeMode = openModeEpoch.current;
    const wasControlled = latest.current.props.open !== undefined;
    if (next) openingTicket.current = ticket;
    // Bound owner acceptance to this proposal transaction. No delayed focus ticket survives.
    const callback = latest.current.props.onOpenChange;
    if (callback) observeUserFocus(ticket, () => flushSync(() => callback(next, detail)));
    if (detail.defaultPrevented || !validTicket(ticket)) { if (next) openingTicket.current = null; return; }
    const current = latest.current;
    if (wasControlled && current.props.open === next && beforeMode === openModeEpoch.current && beforeRevision !== authority.current.openRevision) {
      const accepted = { from: beforeRevision, to: authority.current.openRevision, stamp: ticket.stamp };
      acceptedOpenRevisions.current.push(accepted);
      microtask(() => { acceptedOpenRevisions.current = acceptedOpenRevisions.current.filter(item => item !== accepted); });
    }
    if (beforeRevision === authority.current.openRevision && current.props.open === undefined) {
      current.actualOpen = next; flushSync(() => setLocalOpen(next));
    }
    if (next && !latest.current.actualOpen) openingTicket.current = null;
    if (!next && restore && !focusWasRedirected(ticket)) {
      if (current.props.open === undefined || current.props.open === false) ownedFocus(trigger.current);
    }
    if ((current.props.open === undefined || current.props.open === next) && !focusWasRedirected(ticket)) afterAccept?.();
  };
  const requestOpen = (next: boolean, reason: SelectOpenChangeReason, event: Event, restore = false, suppliedTicket?: Ticket, afterAccept?: () => void) => {
    const ticket = suppliedTicket ?? ticketFor(event); const previousOpen = latest.current.actualOpen;
    if (blockNow() || ticket.gate.canceled) return;
    microtask(() => acceptOpen(next, reason, event, ticket, previousOpen, restore, afterAccept));
  };
  const resolvedValueRevision = (ticket: Ticket) => {
    let revision = ticket.valueRevision;
    for (const accepted of acceptedValueRevisions.current) if (accepted.from === revision && accepted.stamp < ticket.stamp) revision = accepted.to;
    return revision;
  };
  const commit = (next: string, reason: SelectValueChangeReason, event: Event, suppliedTicket?: Ticket, runNow = false) => {
    const ticket = suppliedTicket ?? ticketFor(event); const initialOpen = latest.current.actualOpen;
    if (blockNow() || ticket.gate.canceled) return;
    const apply = () => {
      flushSync(() => {});
      if (!validTicket(ticket) || resolvedValueRevision(ticket) !== authority.current.valueRevision || resolvedOpenRevision(ticket) !== authority.current.openRevision) return;
      const option = latest.current.flat.find(item => item.value === next); if (!option || option.blocked) return;
      const detail = detailFor(reason, event);
      const beforeRevision = authority.current.valueRevision, beforeMode = valueModeEpoch.current;
      const wasControlled = latest.current.props.value !== undefined;
      const callback = latest.current.props.onValueChange;
      if (next !== latest.current.value && callback) observeUserFocus(ticket, () => flushSync(() => callback(next, detail)));
      if (detail.defaultPrevented || !validTicket(ticket)) return;
      const current = latest.current;
      if (wasControlled && current.props.value === next && beforeMode === valueModeEpoch.current && beforeRevision !== authority.current.valueRevision) {
        // Only exact acceptance inside this proposal advances later queued gestures.
        // An external owner write or a control-mode transition never gets this exemption.
        const accepted = { from: beforeRevision, to: authority.current.valueRevision, stamp: ticket.stamp };
        acceptedValueRevisions.current.push(accepted);
        microtask(() => { acceptedValueRevisions.current = acceptedValueRevisions.current.filter(item => item !== accepted); });
      }
      const currentOption = current.flat.find(item => item.value === next); if (!currentOption || currentOption.blocked) return;
      if (beforeRevision === authority.current.valueRevision && current.props.value === undefined) {
        current.value = next; current.resolvedValue = next;
        setLocalValue(next); syncBridge(next); lastAcceptedValue.current = ticket.stamp; setInvalid(false);
      }
      acceptOpen(false, 'selection', event, ticket, initialOpen, true);
    };
    if (runNow) apply(); else microtask(apply);
  };
  const focusOption = (next: string | null) => {
    highlightValue.current = next; setHighlight(next);
    const node = next ? optionNodes.current.get(next) : listbox.current;
    ownedFocus(node ?? null);
    if (next && node && listbox.current) {
      const box = listbox.current; const top = (node as HTMLElement).offsetTop - box.offsetTop;
      if (top < box.scrollTop) box.scrollTop = top;
      else if (top + (node as HTMLElement).offsetHeight > box.scrollTop + box.clientHeight) box.scrollTop = top + (node as HTMLElement).offsetHeight - box.clientHeight;
    }
  };
  const enabled = flat.filter(option => !option.blocked);
  const enabledKey = JSON.stringify(enabled.map(option => option.value));
  const geometryKey = JSON.stringify(items);
  const wasOpen = React.useRef(false);
  useLayout(() => {
    if (!actualOpen || !portalDocument || !listbox.current) { if (!actualOpen) { wasOpen.current = false; typed.current = { text: '', time: 0 }; } return; }
    const opening = !wasOpen.current; wasOpen.current = true;
    if (opening || !enabled.some(option => option.value === highlight)) {
      const searchMatch = openingSearch.current ? enabled.find(option => option.label.trim().toLocaleLowerCase().startsWith(openingSearch.current.toLocaleLowerCase())) : undefined;
      const chosen = searchMatch ?? (openIntent.current === 'last' ? enabled[enabled.length - 1] : openIntent.current === 'first' ? enabled[0] : enabled.find(option => option.value === resolvedValue) ?? enabled[0]);
      openingSearch.current = '';
      const openTicket = openingTicket.current; openingTicket.current = null;
      const active = portalDocument.activeElement;
      const detached = pendingOptionFocus.current;
      const stillOwnsPopupFocus = !!(active && popup.current?.contains(active)) || !!(detached && !detached.node.isConnected && active === portalDocument.body);
      if ((opening && openTicket && focusWasRedirected(openTicket)) || (!opening && !stillOwnsPopupFocus)) { highlightValue.current = chosen?.value ?? null; setHighlight(highlightValue.current); }
      else focusOption(chosen?.value ?? null);
      openIntent.current = 'selected';
    }
  }, [actualOpen, portalDocument, enabledKey]);
  // Moving a still-enabled value between groups rebuilds its real DOM node even
  // when the flat value order is unchanged. Restore only a genuinely focused
  // detached option, never a consumer's newer focus destination.
  useLayout(() => {
    const pending = pendingOptionFocus.current; pendingOptionFocus.current = null;
    if (!pending || !actualOpen || !portalDocument || blockNow()) return;
    const replacement = optionNodes.current.get(pending.value);
    if (highlightValue.current === pending.value && replacement && replacement !== pending.node && !pending.node.isConnected && replacement.isConnected && portalDocument.activeElement === portalDocument.body && enabled.some(option => option.value === pending.value)) focusOption(pending.value);
  });
  const measureOverflow = () => { const box = listbox.current; if (box) setOverflow(previous => { const next = { up: box.scrollTop > 1, down: box.scrollTop + box.clientHeight < box.scrollHeight - 1 }; return previous.up === next.up && previous.down === next.down ? previous : next; }); };
  useLayout(() => {
    if (!actualOpen || !portalDocument || !popup.current || !trigger.current) return;
    const doc = portalDocument, win = doc.defaultView; if (!win) return;
    let frame = 0;
    const position = () => {
      const anchor = trigger.current; if (!anchor || !popup.current) return;
      const rect = anchor.getBoundingClientRect(); const viewport = win.visualViewport;
      const x = viewport?.offsetLeft ?? 0, y = viewport?.offsetTop ?? 0;
      const width = viewport?.width ?? win.innerWidth, height = viewport?.height ?? win.innerHeight;
      const below = Math.max(0, y + height - rect.bottom - 12), above = Math.max(0, rect.top - y - 12);
      const desired = Math.min(320, (listbox.current?.scrollHeight ?? 200) + 48);
      const side = below < desired && above > below ? 'top' : 'bottom';
      const maxHeight = Math.max(40, Math.min(320, side === 'bottom' ? below : above));
      const popupWidth = Math.max(1, Math.min(rect.width || 256, width - 16));
      const rtl = (latest.current.props.dir ?? win.getComputedStyle(anchor).direction) === 'rtl';
      const left = Math.max(x + 8, Math.min(rtl ? rect.right - popupWidth : rect.left, x + width - popupWidth - 8));
      const actualHeight = Math.min(maxHeight, popup.current.getBoundingClientRect().height || desired);
      const top = side === 'bottom' ? rect.bottom + 4 : Math.max(y + 8, rect.top - actualHeight - 4);
      const next = { left, top, width: popupWidth, maxHeight, side, ready: true } as typeof placement;
      setPlacement(previous => Object.keys(next).every(key => previous[key as keyof typeof next] === next[key as keyof typeof next]) ? previous : next);
      measureOverflow();
    };
    const schedule = () => { if (!frame) frame = win.requestAnimationFrame(() => { frame = 0; position(); }); };
    position();
    win.addEventListener('resize', schedule); doc.addEventListener('scroll', schedule, true);
    win.visualViewport?.addEventListener('resize', schedule); win.visualViewport?.addEventListener('scroll', schedule);
    const observer = win.ResizeObserver ? new win.ResizeObserver(schedule) : null;
    observer?.observe(trigger.current); observer?.observe(popup.current); if (listbox.current) observer?.observe(listbox.current);
    return () => { if (frame) win.cancelAnimationFrame(frame); observer?.disconnect(); win.removeEventListener('resize', schedule); doc.removeEventListener('scroll', schedule, true); win.visualViewport?.removeEventListener('resize', schedule); win.visualViewport?.removeEventListener('scroll', schedule); };
  }, [actualOpen, portalDocument, geometryKey, props.dir]);
  const handlers = React.useRef({ requestOpen }); handlers.current = { requestOpen };
  useLayout(() => {
    if (!actualOpen || !portalDocument) return;
    const outside = (event: Event) => { if (event.type === 'focusin') pendingOptionFocus.current = null; const target = event.target as Node | null; if (target && !trigger.current?.contains(target) && !popup.current?.contains(target)) handlers.current.requestOpen(false, event.type === 'focusin' ? 'focus-out' : 'outside-pointer', event); };
    portalDocument.addEventListener('pointerdown', outside, true); portalDocument.addEventListener('focusin', outside, true);
    return () => { portalDocument.removeEventListener('pointerdown', outside, true); portalDocument.removeEventListener('focusin', outside, true); };
  }, [actualOpen, portalDocument]);
  const typeahead = (key: string) => {
    const now = Date.now(); let search = now - typed.current.time < 700 ? typed.current.text + key : key;
    typed.current = { text: search, time: now };
    if (search.length > 1 && [...search].every(character => character === search[0])) search = search[0];
    const options = latest.current.flat.filter(option => !option.blocked);
    const start = options.findIndex(option => option.value === highlightValue.current);
    const ordered = [...options.slice(start + 1), ...options.slice(0, start + 1)];
    // For a multi-letter search keep the current match as the first candidate.
    if (search.length > 1 && start >= 0) ordered.unshift(options[start]);
    const found = ordered.find(option => option.label.trim().toLocaleLowerCase().startsWith(search.toLocaleLowerCase()));
    if (found) focusOption(found.value);
  };
  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>, suppliedTicket?: Ticket) => {
    const nativeEvent = event.nativeEvent, key = event.key, backward = event.shiftKey;
    const startedOpen = latest.current.actualOpen;
    if (event.defaultPrevented || nativeEvent.isComposing || nativeEvent.keyCode === 229 || key === 'Process' || event.altKey || event.ctrlKey || event.metaKey || blockNow()) return;
    if (event.repeat && ['Enter', ' ', 'Escape', 'Tab'].includes(key)) { gateFor(nativeEvent).preventNative(); return; }
    const ticket = suppliedTicket ?? ticketFor(nativeEvent);
    if (ticket.valueRevision !== authority.current.valueRevision || ticket.openRevision !== authority.current.openRevision || !validTicket(ticket)) return;
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' ', 'Escape', 'Tab'].includes(key) && key.length !== 1) return;
    // Closed Tab/Escape/Home/End retain ordinary browser behavior.
    if (!latest.current.actualOpen && ['Tab', 'Escape', 'Home', 'End'].includes(key)) return;
    ticket.gate.preventNative();
    microtask(() => {
      flushSync(() => {});
      if (!validTicket(ticket) || resolvedValueRevision(ticket) !== authority.current.valueRevision || resolvedOpenRevision(ticket) !== authority.current.openRevision) return;
      // Capture handlers can move focus before this ticket exists; bubbling handlers
      // can move it afterward. In either case queued popup keys must respect the
      // current focus owner, but may follow an earlier accepted key to a new option.
      const active = trigger.current?.ownerDocument.activeElement;
      if ((startedOpen || latest.current.actualOpen) && (focusWasRedirected(ticket) || !active || (!trigger.current?.contains(active) && !popup.current?.contains(active)))) return;
      if (!latest.current.actualOpen) {
        if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key)) {
          openingSearch.current = ''; openIntent.current = key === 'ArrowUp' ? 'last' : 'selected';
          acceptOpen(true, 'keyboard', nativeEvent, ticket, false, false);
        } else if (key.length === 1) {
          openIntent.current = 'first'; openingSearch.current = key; typed.current = { text: key, time: Date.now() };
          acceptOpen(true, 'keyboard', nativeEvent, ticket, false, false);
        }
        return;
      }
      if (key === 'Escape') { acceptOpen(false, 'escape', nativeEvent, ticket, true, true); return; }
      if (key === 'Tab') {
        acceptOpen(false, 'tab', nativeEvent, ticket, true, false, () => {
          const button = trigger.current, doc = button?.ownerDocument; if (!button || !doc) return;
          const candidates = tabStops(doc, popup.current, backward);
          const index = candidates.indexOf(button), next = candidates[index + (backward ? -1 : 1)];
          ownedFocus(next ?? button);
        });
        return;
      }
      if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(key)) {
        const options = latest.current.flat.filter(option => !option.blocked); if (!options.length) return;
        const current = options.findIndex(option => option.value === highlightValue.current);
        const index = key === 'Home' ? 0 : key === 'End' ? options.length - 1 : key === 'ArrowDown' ? (current + 1) % options.length : (current - 1 + options.length) % options.length;
        focusOption(options[index].value); return;
      }
      if (key === 'Enter' || (key === ' ' && (!typed.current.text || Date.now() - typed.current.time >= 700))) {
        const next = highlightValue.current; if (next) commit(next, 'keyboard', nativeEvent, ticket, true); return;
      }
      if (key.length === 1) typeahead(key);
    });
  };
  const renderOption = (option: SelectOption, groupDisabled = false) => {
    const optionKey = Array.from(option.value).map(character => character.codePointAt(0)!.toString(16)).join('-'); const blocked = !!(groupDisabled || option.disabled); const checked = option.value === resolvedValue;
    return <div key={option.value} id={`${id}-option-${optionKey}`} ref={node => { if (node) optionNodes.current.set(option.value, node); else { const previous = optionNodes.current.get(option.value); if (previous && previous.ownerDocument.activeElement === previous) pendingOptionFocus.current = { value: option.value, node: previous }; optionNodes.current.delete(option.value); } }} role="option" aria-selected={checked} aria-disabled={blocked || undefined} tabIndex={-1} className="wix-sa-option" data-value={option.value} data-state={checked ? 'checked' : 'unchecked'} data-highlighted={highlight === option.value ? 'true' : undefined} data-disabled={blocked ? 'true' : undefined}
      onFocus={() => { if (!blocked) { highlightValue.current = option.value; setHighlight(option.value); } }}
      onPointerMove={event => { if (!blocked && event.pointerType !== 'touch' && !blockNow()) focusOption(option.value); }}
      onPointerDown={event => { if (blocked) event.preventDefault(); }}
      onClick={event => { if (!event.defaultPrevented && !blocked) commit(option.value, 'pointer', event.nativeEvent); }}>
      <span className="wix-sa-option-label">{option.label}</span><span className="wix-sa-check" aria-hidden="true" style={{ visibility: checked ? 'visible' : 'hidden' }}>{checked ? <Check /> : null}</span>
    </div>;
  };
  const dir = props.dir ?? (portalDocument && trigger.current ? portalDocument.defaultView?.getComputedStyle(trigger.current).direction as 'ltr' | 'rtl' : undefined);
  const scrollBy = (direction: number) => { const box = listbox.current; if (box) { box.scrollTop += direction * Math.max(40, box.clientHeight / 2); measureOverflow(); } };
  const panel = actualOpen && portalDocument ? createPortal(<div ref={popup} className="wix-select-availability wix-sa-popup" data-component={variant} data-variant={variant} data-motion={props.motion ?? 'system'} data-state="open" data-side={placement.side} dir={dir} style={{ position: 'fixed', left: placement.left, top: placement.top, width: placement.width, maxWidth: 'calc(100vw - 16px)', maxHeight: placement.maxHeight, zIndex: 1000, visibility: placement.ready ? 'visible' : 'hidden' }}>
    <button type="button" className="wix-sa-scroll-up" tabIndex={-1} aria-label="Scroll up" hidden={!overflow.up} onPointerDown={event => event.preventDefault()} onClick={() => scrollBy(-1)}><Chevron up /></button>
    <div ref={listbox} id={popupId} className="wix-sa-listbox" role="listbox" aria-labelledby={accessibleLabel} aria-label={props['aria-label']} aria-required={props.required || undefined} tabIndex={-1} onKeyDown={onKeyDown} onScroll={measureOverflow} style={{ maxHeight: Math.max(24, placement.maxHeight - 48), overflowY: 'auto', overscrollBehavior: 'contain' }}>
      {items.map((item, index) => isGroup(item) ? <div className="wix-sa-group" role="group" aria-labelledby={`${id}-group-${index}`} aria-disabled={item.disabled || undefined} key={`group-${index}`}><div className="wix-sa-group-label" id={`${id}-group-${index}`}>{item.label}</div>{item.options.map(option => renderOption(option, item.disabled))}</div> : renderOption(item))}
      {!flat.length ? <div className="wix-sa-empty">No options available</div> : null}
    </div>
    <button type="button" className="wix-sa-scroll-down" tabIndex={-1} aria-label="Scroll down" hidden={!overflow.down} onPointerDown={event => event.preventDefault()} onClick={() => scrollBy(1)}><Chevron /></button>
  </div>, portalDocument.body) : null;
  const tp = props.triggerProps ?? {};
  return <div className={`wix-select-availability${props.className ? ` ${props.className}` : ''}`} data-component={variant} data-variant={variant} data-motion={props.motion ?? 'system'} data-disabled={disabled ? 'true' : undefined} dir={props.dir} style={props.style}>
    <label className="wix-sa-label" id={labelId} htmlFor={id}>{label}{props.required ? <span aria-hidden="true" className="wix-sa-required"> *</span> : null}</label>
    <button title={tp.title} tabIndex={tp.tabIndex} autoFocus={tp.autoFocus} onPointerDown={tp.onPointerDown} onPointerDownCapture={tp.onPointerDownCapture} onFocus={tp.onFocus} onFocusCapture={tp.onFocusCapture} onBlur={tp.onBlur} onBlurCapture={tp.onBlurCapture} ref={triggerRef} type="button" id={id} className="wix-sa-trigger" role="combobox" aria-haspopup="listbox" aria-controls={actualOpen ? popupId : undefined} aria-expanded={actualOpen} aria-labelledby={accessibleLabel} aria-label={props['aria-label']} aria-describedby={describedBy} aria-invalid={props['aria-invalid'] ?? (!!invalidMessage || undefined)} aria-required={props.required || undefined} aria-readonly={props.readOnly || undefined} disabled={disabled} data-state={actualOpen ? 'open' : 'closed'} data-placeholder={!selected ? 'true' : undefined} data-disabled={disabled ? 'true' : undefined} data-readonly={props.readOnly ? 'true' : undefined}
      onClickCapture={event => { const ticket = triggerTicketFor(event.nativeEvent); observeUserFocus(ticket, () => tp.onClickCapture?.(event)); }}
      onKeyDownCapture={event => { const ticket = triggerTicketFor(event.nativeEvent); observeUserFocus(ticket, () => tp.onKeyDownCapture?.(event)); }}
      onClick={event => { const nativeEvent = event.nativeEvent, ticket = triggerTicketFor(nativeEvent); observeUserFocus(ticket, () => tp.onClick?.(event)); if (!event.defaultPrevented && validTicket(ticket) && ticket.valueRevision === authority.current.valueRevision && ticket.openRevision === authority.current.openRevision) microtask(() => { if (!validTicket(ticket) || resolvedValueRevision(ticket) !== authority.current.valueRevision || resolvedOpenRevision(ticket) !== authority.current.openRevision) return; openingSearch.current = ''; openIntent.current = 'selected'; const previous = latest.current.actualOpen; acceptOpen(!previous, 'trigger', nativeEvent, ticket, previous, previous); }); }}
      onKeyDown={event => { const ticket = triggerTicketFor(event.nativeEvent); observeUserFocus(ticket, () => tp.onKeyDown?.(event)); onKeyDown(event, ticket); }}>
      <span className="wix-sa-value">{selected?.label ?? placeholder}</span><Chevron className="wix-sa-chevron" />
    </button>
    <select ref={native} className="wix-sa-native" name={props.name} form={props.form} required={props.required} disabled={disabled} value={resolvedValue} tabIndex={-1} aria-hidden="true" style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', clipPath: 'inset(50%)', whiteSpace: 'nowrap', border: 0, opacity: 0, pointerEvents: 'none' }}
      onChange={() => syncBridge()}
      onInvalid={event => { event.preventDefault(); if (!latest.current.props.disabled && !disabledByFieldset(trigger.current)) { setInvalid(true); ownedFocus(trigger.current); } }}>
      <option value="">{placeholder}</option>{items.map((item, index) => isGroup(item) ? <optgroup key={`group-${index}`} label={item.label} disabled={item.disabled}>{item.options.map(option => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}</optgroup> : <option key={item.value} value={item.value} disabled={item.disabled}>{item.label}</option>)}
    </select>
    {helper ? <p id={helperId} className="wix-sa-helper" role="region" aria-labelledby={labelId} aria-live="polite">{helper}</p> : null}
    {invalidMessage ? <p id={errorId} className="wix-sa-error" role="alert">{invalidMessage}</p> : null}
    {panel}
  </div>;
}
const Core = React.forwardRef<HTMLButtonElement, CoreProps>(SelectAvailability);
Core.displayName = 'SelectAvailabilityControl';
export const Select18 = React.forwardRef<HTMLButtonElement, Select18Props>((props, ref) => <Core {...props} disabled={props.disabled ?? false} required={props.required ?? false} variant="select-18" ref={ref} />);
export const Select19 = React.forwardRef<HTMLButtonElement, Select19Props>((props, ref) => <Core {...props} disabled={props.disabled ?? true} required={props.required ?? false} variant="select-19" ref={ref} />);
export const Select20 = React.forwardRef<HTMLButtonElement, Select20Props>((props, ref) => <Core {...props} disabled={props.disabled ?? false} required={props.required ?? false} variant="select-20" ref={ref} />);
export const Select21 = React.forwardRef<HTMLButtonElement, Select21Props>((props, ref) => <Core {...props} disabled={props.disabled ?? false} required={props.required ?? true} variant="select-21" ref={ref} />);
Select18.displayName = 'Select18';
Select19.displayName = 'Select19';
Select20.displayName = 'Select20';
Select21.displayName = 'Select21';
