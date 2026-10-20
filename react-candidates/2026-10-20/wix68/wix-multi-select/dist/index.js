// src/index.tsx
import * as React from "react";
import { createPortal, flushSync } from "react-dom";
var wixMultiSelectIds = Object.freeze(["select-32", "select-33"]);
var definitions = {
  "select-32": { label: "Active Pipeline Services", placeholder: "Select operations", pluralLabel: "operations active", helper: "", value: ["monitoring"], options: [
    { value: "monitoring", label: "Real-time Monitoring" },
    { value: "logging", label: "Log Aggregation" },
    { value: "analytics", label: "Security Analytics" },
    { value: "backups", label: "Automated Backups" }
  ] },
  "select-33": { label: "Communication Channels", placeholder: "Select notification paths", pluralLabel: "channels selected", helper: "System alerts will be delivered via all selected channels.", value: [], options: [
    { value: "email", label: "Primary Email" },
    { value: "sms", label: "SMS Gateway" },
    { value: "push", label: "Mobile Push" },
    { value: "slack", label: "Slack Webhook" },
    { value: "discord", label: "Discord Bot" }
  ] }
};
var useLayout = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;
var microtask = (fn) => {
  if (typeof queueMicrotask === "function") queueMicrotask(fn);
  else Promise.resolve().then(fn);
};
var same = (a, b) => a.length === b.length && a.every((value, index) => value === b[index]);
function values(input) {
  if (!Array.isArray(input)) throw new Error("wix-multi-select: values must be a dense array of unique, nonempty strings.");
  const seen = /* @__PURE__ */ new Set(), result = [];
  for (let i = 0; i < input.length; i++) {
    if (!Object.prototype.hasOwnProperty.call(input, i)) throw new Error("wix-multi-select: values must be a dense array of unique, nonempty strings.");
    const value = input[i];
    if (typeof value !== "string" || !value || seen.has(value)) throw new Error("wix-multi-select: values must be a dense array of unique, nonempty strings.");
    seen.add(value);
    result.push(value);
  }
  return Object.freeze(result);
}
function options(input) {
  if (!Array.isArray(input)) throw new Error("wix-multi-select: options must be a dense, flat array.");
  const seen = /* @__PURE__ */ new Set();
  const result = [];
  const invalid = () => new Error("wix-multi-select: options require unique nonempty values, string labels and optional boolean disabled; hybrid descriptors are unsupported.");
  for (let i = 0; i < input.length; i++) {
    if (!Object.prototype.hasOwnProperty.call(input, i)) throw invalid();
    const item = input[i];
    if (!item || typeof item !== "object" || Array.isArray(item) || Object.keys(item).some((key) => !["value", "label", "disabled"].includes(key))) throw invalid();
    const value = item.value, label = item.label, disabled = item.disabled;
    if (typeof value !== "string" || !value || seen.has(value) || typeof label !== "string" || disabled !== void 0 && typeof disabled !== "boolean") throw invalid();
    seen.add(value);
    result.push(Object.freeze({ value, label, ...disabled === void 0 ? {} : { disabled } }));
  }
  return Object.freeze(result);
}
var sequence = 0;
var resetStamps = /* @__PURE__ */ new WeakMap();
var eventGates = /* @__PURE__ */ new WeakMap();
function gateFor(event, ownDefault = false) {
  const existing = eventGates.get(event);
  if (existing) return existing;
  if (!ownDefault) return { get canceled() {
    return event.defaultPrevented;
  }, preventNative() {
    event.preventDefault();
  } };
  const original = event.preventDefault, descriptor = Object.getOwnPropertyDescriptor(event, "preventDefault");
  let canceled = event.defaultPrevented;
  const gate = { get canceled() {
    return canceled;
  }, preventNative() {
    original.call(event);
  } };
  const wrapped = function() {
    canceled = true;
    original.call(this);
  };
  try {
    Object.defineProperty(event, "preventDefault", { configurable: true, writable: true, value: wrapped });
    microtask(() => microtask(() => {
      if (event.preventDefault === wrapped) {
        if (descriptor) Object.defineProperty(event, "preventDefault", descriptor);
        else Reflect.deleteProperty(event, "preventDefault");
      }
    }));
  } catch {
  }
  eventGates.set(event, gate);
  return gate;
}
function detailFor(reason, originalEvent) {
  let canceled = false;
  return { reason, originalEvent, cancelable: true, get defaultPrevented() {
    return canceled;
  }, preventDefault() {
    canceled = true;
  } };
}
function disabledByFieldset(element) {
  let ancestor = element?.parentElement;
  while (ancestor) {
    if (ancestor.tagName === "FIELDSET" && ancestor.disabled) {
      const firstLegend = Array.from(ancestor.children).find((child) => child.tagName === "LEGEND");
      if (!firstLegend?.contains(element)) return true;
    }
    ancestor = ancestor.parentElement;
  }
  return false;
}
function tabStops(doc, popup, backward) {
  const candidates = Array.from(doc.querySelectorAll('a[href],area[href],button,input,select,textarea,iframe,summary,[tabindex],[contenteditable="true"]')).filter((node) => {
    const editable = node.getAttribute("contenteditable") === "true" && !node.hasAttribute("tabindex");
    if (!editable && node.tabIndex < 0 || node.matches(":disabled") || disabledByFieldset(node) || popup?.contains(node) || node.getAttribute("aria-hidden") === "true") return false;
    const ownStyle = doc.defaultView?.getComputedStyle(node);
    if (ownStyle?.visibility === "hidden" || ownStyle?.visibility === "collapse") return false;
    if (node.tagName === "INPUT" && node.type === "hidden") return false;
    let parent = node;
    while (parent) {
      if (parent.hidden || parent.hasAttribute("inert")) return false;
      const style = doc.defaultView?.getComputedStyle(parent);
      if (style?.display === "none") return false;
      if (parent.tagName === "DIALOG" && !parent.hasAttribute("open")) return false;
      if (parent.tagName === "DETAILS" && !parent.hasAttribute("open")) {
        const summary = Array.from(parent.children).find((child) => child.tagName === "SUMMARY");
        if (!summary?.contains(node)) return false;
      }
      parent = parent.parentElement;
    }
    return true;
  });
  return candidates.filter((node) => {
    if (node.tagName !== "INPUT") return true;
    const radio = node;
    if (radio.type !== "radio" || !radio.name) return true;
    const group = candidates.filter((other) => other.tagName === "INPUT" && other.type === "radio" && other.name === radio.name && other.form === radio.form);
    const chosen = group.find((other) => other.checked) ?? group[backward ? group.length - 1 : 0];
    return radio === chosen;
  }).map((node, index) => ({ node, index })).sort((a, b) => (a.node.tabIndex > 0 ? a.node.tabIndex : Infinity) - (b.node.tabIndex > 0 ? b.node.tabIndex : Infinity) || a.index - b.index).map((item) => item.node);
}
function Chevron() {
  return /* @__PURE__ */ React.createElement("svg", { className: "wix-ms-chevron", "aria-hidden": "true", focusable: "false", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5" }, /* @__PURE__ */ React.createElement("path", { d: "m6 9 6 6 6-6", strokeLinecap: "round", strokeLinejoin: "round" }));
}
function Check() {
  return /* @__PURE__ */ React.createElement("svg", { "aria-hidden": "true", focusable: "false", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" }, /* @__PURE__ */ React.createElement("path", { d: "m5 12 4 4L19 6", strokeLinecap: "round", strokeLinejoin: "round" }));
}
function MultiSelect(props, forwardedRef) {
  const { variant } = props, definition = definitions[variant];
  if (props.value !== void 0 && props.defaultValue !== void 0) throw new Error("wix-multi-select: value and defaultValue are mutually exclusive.");
  if (props.open !== void 0 && props.defaultOpen !== void 0) throw new Error("wix-multi-select: open and defaultOpen are mutually exclusive.");
  for (const key of ["label", "placeholder", "pluralLabel", "helper", "error"]) if (props[key] !== void 0 && typeof props[key] !== "string") throw new Error(`wix-multi-select: ${key} must be a plain string.`);
  for (const key of ["open", "defaultOpen", "disabled", "readOnly", "required", "clearable", "showSelectedItems"]) if (props[key] !== void 0 && typeof props[key] !== "boolean") throw new Error(`wix-multi-select: ${key} must be a boolean.`);
  if (props.defaultValue !== void 0) values(props.defaultValue);
  const incomingValue = props.value === void 0 ? void 0 : values(props.value);
  const flat = options(props.options === void 0 ? definition.options : props.options);
  const generated = React.useId(), id = props.id ?? `wix-ms-${generated}`;
  const labelId = `${id}-label`, popupId = `${id}-dialog`, helperId = `${id}-helper`, errorId = `${id}-error`, requiredId = `${id}-required`;
  const mountDefault = React.useRef(values(props.defaultValue ?? definition.value));
  const [localValue, setLocalValue] = React.useState(mountDefault.current);
  const [localOpen, setLocalOpen] = React.useState(props.defaultOpen ?? false);
  const [fieldsetDisabled, setFieldsetDisabled] = React.useState(false);
  const [portalDocument, setPortalDocument] = React.useState(null);
  const [highlight, setHighlight] = React.useState(null);
  const [invalid, setInvalid] = React.useState(false);
  const [placement, setPlacement] = React.useState({ left: 0, top: 0, width: 0, maxHeight: 320, side: "bottom", ready: false });
  const field = React.useRef(null), trigger = React.useRef(null), native = React.useRef(null), popup = React.useRef(null), clear = React.useRef(null);
  const optionNodes = React.useRef(/* @__PURE__ */ new Map()), chipNodes = React.useRef(/* @__PURE__ */ new Map());
  const pendingOptionFocus = React.useRef(null);
  const highlightValue = React.useRef(null);
  const alive = React.useRef(false), lifetime = React.useRef(0), interaction = React.useRef(0), focusRevision = React.useRef(0), internalFocus = React.useRef(null);
  const eventTickets = React.useRef(/* @__PURE__ */ new WeakMap());
  const drainFieldsetRecords = React.useRef(() => {
  });
  const valueModeEpoch = React.useRef(0), openModeEpoch = React.useRef(0);
  const openingTicket = React.useRef(null), openingSearch = React.useRef("");
  const acceptedOpenRevisions = React.useRef([]), acceptedValueRevisions = React.useRef([]);
  const resets = React.useRef([]), lastAcceptedValue = React.useRef(0);
  const typed = React.useRef({ text: "", time: 0 });
  const controlledValue = incomingValue !== void 0, controlledOpen = props.open !== void 0;
  const authority = React.useRef({ valueControlled: controlledValue, value: incomingValue ?? localValue, openControlled: controlledOpen, open: props.open ?? localOpen, valueRevision: 0, openRevision: 0, disabled: !!props.disabled, readOnly: !!props.readOnly });
  const value = incomingValue ?? (authority.current.valueControlled ? authority.current.value : localValue);
  const desiredOpen = props.open ?? (authority.current.openControlled ? authority.current.open : localOpen);
  const selected = flat.filter((option) => value.includes(option.value)), resolvedValues = selected.map((option) => option.value);
  const disabled = !!props.disabled || fieldsetDisabled, actualOpen = desiredOpen && !disabled && !props.readOnly;
  const latest = React.useRef({ props, flat, value, actualOpen, disabled });
  const label = props.label ?? definition.label, placeholder = props.placeholder ?? definition.placeholder, helper = props.helper ?? definition.helper;
  const summary = selected.length === 0 ? placeholder : selected.length === 1 ? selected[0].label : `${selected.length} ${props.pluralLabel ?? definition.pluralLabel}`;
  const invalidMessage = props.error || (invalid ? "Please select at least one option." : void 0);
  const describedBy = [props["aria-describedby"], props.required && !props.readOnly ? requiredId : "", helper ? helperId : "", invalidMessage ? errorId : ""].filter(Boolean).join(" ") || void 0;
  const accessibleLabel = props["aria-labelledby"] ?? (props["aria-label"] ? void 0 : labelId);
  const blockNow = () => !!latest.current.props.disabled || !!latest.current.props.readOnly || disabledByFieldset(trigger.current);
  React.useImperativeHandle(forwardedRef, () => trigger.current, []);
  const ownedFocus = (node) => {
    if (!node) return;
    const previous = internalFocus.current;
    internalFocus.current = node;
    try {
      node.focus({ preventScroll: true });
    } finally {
      internalFocus.current = previous;
    }
  };
  const syncBridge = (requested) => {
    const element = native.current;
    if (!element) return;
    const current = latest.current, wanted = requested ?? current.value;
    const defaults = current.props.value !== void 0 ? wanted : mountDefault.current;
    for (const option of Array.from(element.options)) {
      option.defaultSelected = defaults.includes(option.value);
      option.selected = wanted.includes(option.value);
    }
  };
  useLayout(() => {
    const previous = authority.current;
    if (previous.valueControlled !== controlledValue) valueModeEpoch.current++;
    if (previous.openControlled !== controlledOpen) openModeEpoch.current++;
    const valueChanged = previous.valueControlled !== controlledValue || controlledValue && !same(previous.value, value);
    const openChanged = previous.openControlled !== controlledOpen || controlledOpen && previous.open !== desiredOpen;
    if (previous.disabled !== !!props.disabled || previous.readOnly !== !!props.readOnly) interaction.current++;
    authority.current = { valueControlled: controlledValue, value, openControlled: controlledOpen, open: desiredOpen, valueRevision: previous.valueRevision + Number(valueChanged), openRevision: previous.openRevision + Number(openChanged), disabled: !!props.disabled, readOnly: !!props.readOnly };
    latest.current = { props, flat, value, actualOpen, disabled };
    if (previous.valueControlled && !controlledValue) setLocalValue(previous.value);
    if (previous.openControlled && !controlledOpen) setLocalOpen(previous.open);
    for (const record of resets.current) if (record.event.eventPhase !== 0) record.associatedDuringDispatch = native.current?.form === record.form;
    syncBridge();
    microtask(() => {
      if (alive.current) syncBridge();
    });
    if (invalid && (!props.required || props.readOnly || selected.length > 0 || disabled)) setInvalid(false);
    if ((disabled || props.readOnly) && !controlledOpen && localOpen) setLocalOpen(false);
  });
  const ticketFor = (event) => {
    drainFieldsetRecords.current();
    return { stamp: ++sequence, lifetime: lifetime.current, interaction: interaction.current, valueRevision: authority.current.valueRevision, openRevision: authority.current.openRevision, focusRevision: focusRevision.current, gate: gateFor(event, event.type === "keydown" || event.type === "invalid"), focusOrigin: trigger.current?.ownerDocument.activeElement ?? null };
  };
  const ticketForEvent = (event) => {
    let ticket = eventTickets.current.get(event);
    if (!ticket) {
      ticket = ticketFor(event);
      eventTickets.current.set(event, ticket);
    }
    return ticket;
  };
  const validTicket = (ticket) => {
    drainFieldsetRecords.current();
    return alive.current && ticket.lifetime === lifetime.current && ticket.interaction === interaction.current && !blockNow() && !ticket.gate.canceled && !resets.current.some((record) => record.associatedDuringDispatch && record.stamp > ticket.stamp && !record.event.defaultPrevented);
  };
  const focusWasRedirected = (ticket) => {
    const doc = trigger.current?.ownerDocument, active = doc?.activeElement;
    return ticket.focusRevision !== focusRevision.current || !!(active && active !== doc?.body && active !== ticket.focusOrigin && !trigger.current?.contains(active) && !popup.current?.contains(active));
  };
  const resolveRevision = (revision, accepted, stamp) => {
    for (const item of accepted) if (item.from === revision && item.stamp < stamp) revision = item.to;
    return revision;
  };
  const currentTicket = (ticket) => validTicket(ticket) && resolveRevision(ticket.valueRevision, acceptedValueRevisions.current, ticket.stamp) === authority.current.valueRevision && resolveRevision(ticket.openRevision, acceptedOpenRevisions.current, ticket.stamp) === authority.current.openRevision;
  useLayout(() => {
    alive.current = true;
    lifetime.current++;
    const element = trigger.current;
    if (!element) return;
    const doc = element.ownerDocument;
    setPortalDocument(doc);
    let observedDisabled = disabledByFieldset(element);
    const updateDisabled = (records = []) => {
      const next = disabledByFieldset(element);
      const disabledDuringBatch = records.some((record) => {
        if (record.type !== "attributes" || record.attributeName !== "disabled") return false;
        const fieldset = record.target;
        if (fieldset.tagName !== "FIELDSET" || !fieldset.contains(element) || record.oldValue === null && !fieldset.disabled) return false;
        const firstLegend = Array.from(fieldset.children).find((child) => child.tagName === "LEGEND");
        return !firstLegend?.contains(element);
      });
      if (disabledDuringBatch || observedDisabled !== next) interaction.current++;
      observedDisabled = next;
      setFieldsetDisabled(next);
      if (next) setLocalOpen(false);
    };
    updateDisabled();
    const captureGesture = (event) => {
      const target = event.target;
      if (target && (field.current?.contains(target) || popup.current?.contains(target))) ticketForEvent(event);
    };
    const trackFocus = (event) => {
      if (event.target !== internalFocus.current) focusRevision.current++;
    };
    const onReset = (event) => {
      const form = event.target;
      if (!form || form.tagName !== "FORM" || form.ownerDocument !== doc) return;
      let stamp = resetStamps.get(event);
      if (stamp === void 0) {
        stamp = ++sequence;
        resetStamps.set(event, stamp);
      }
      const record = { event, stamp, form, associatedDuringDispatch: native.current?.form === form, valueControlled: authority.current.valueControlled, openControlled: authority.current.openControlled, valueMode: valueModeEpoch.current, openMode: openModeEpoch.current };
      resets.current.push(record);
      const life = lifetime.current;
      microtask(() => {
        if (!alive.current || lifetime.current !== life) return;
        if (event.defaultPrevented) {
          resets.current = resets.current.filter((item) => item !== record);
          return;
        }
        flushSync(() => {
        });
        if (!alive.current || lifetime.current !== life || !record.associatedDuringDispatch) {
          resets.current = resets.current.filter((item) => item !== record);
          return;
        }
        resets.current = resets.current.filter((item) => item.stamp >= record.stamp);
        flushSync(() => {
          if (lastAcceptedValue.current <= record.stamp && !record.valueControlled && record.valueMode === valueModeEpoch.current && latest.current.props.value === void 0) setLocalValue(mountDefault.current);
          setInvalid(false);
          if (!record.openControlled && record.openMode === openModeEpoch.current && latest.current.props.open === void 0) setLocalOpen(false);
        });
        syncBridge();
        typed.current = { text: "", time: 0 };
      });
    };
    doc.addEventListener("reset", onReset, true);
    doc.addEventListener("click", captureGesture, true);
    doc.addEventListener("keydown", captureGesture, true);
    doc.addEventListener("focusin", trackFocus, true);
    const Observer = doc.defaultView?.MutationObserver, observer = Observer ? new Observer(updateDisabled) : null;
    observer?.observe(doc.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ["disabled"], attributeOldValue: true });
    drainFieldsetRecords.current = () => {
      const records = observer?.takeRecords();
      if (records?.length) updateDisabled(records);
    };
    return () => {
      alive.current = false;
      lifetime.current++;
      interaction.current++;
      observer?.disconnect();
      drainFieldsetRecords.current = () => {
      };
      doc.removeEventListener("reset", onReset, true);
      doc.removeEventListener("click", captureGesture, true);
      doc.removeEventListener("keydown", captureGesture, true);
      doc.removeEventListener("focusin", trackFocus, true);
      optionNodes.current.clear();
      chipNodes.current.clear();
    };
  }, []);
  const registerAcceptance = (list, from, to, stamp) => {
    const accepted = { from, to, stamp };
    list.current.push(accepted);
    microtask(() => {
      list.current = list.current.filter((item) => item !== accepted);
    });
  };
  const acceptOpen = (next, reason, event, ticket, restore = false, afterAccept) => {
    flushSync(() => {
    });
    if (!currentTicket(ticket) || latest.current.actualOpen === next) return;
    const detail = detailFor(reason, event), beforeRevision = authority.current.openRevision, beforeMode = openModeEpoch.current;
    const wasControlled = latest.current.props.open !== void 0;
    if (next) openingTicket.current = ticket;
    const callback = latest.current.props.onOpenChange;
    if (callback) flushSync(() => callback(next, detail));
    if (detail.defaultPrevented || !validTicket(ticket)) {
      if (next) openingTicket.current = null;
      return;
    }
    const current = latest.current;
    if (wasControlled && current.props.open === next && beforeMode === openModeEpoch.current && beforeRevision !== authority.current.openRevision) registerAcceptance(acceptedOpenRevisions, beforeRevision, authority.current.openRevision, ticket.stamp);
    if (beforeRevision === authority.current.openRevision && current.props.open === void 0) flushSync(() => setLocalOpen(next));
    const accepted = latest.current.actualOpen === next;
    if (next && !accepted) openingTicket.current = null;
    if (accepted && !next && !focusWasRedirected(ticket)) {
      if (restore) ownedFocus(trigger.current);
      afterAccept?.();
    }
  };
  const requestOpen = (next, reason, event, restore = false) => {
    const ticket = ticketForEvent(event);
    if (!currentTicket(ticket)) return;
    microtask(() => acceptOpen(next, reason, event, ticket, restore));
  };
  const mutate = (mutation, reason, event) => {
    const ticket = ticketForEvent(event);
    if (!currentTicket(ticket)) return;
    const focusedChip = mutation.kind === "remove" ? chipNodes.current.get(mutation.value) : void 0;
    const ownedChip = !!focusedChip && focusedChip.ownerDocument.activeElement === focusedChip;
    const originalChips = latest.current.flat.filter((option) => latest.current.value.includes(option.value) && !option.disabled).map((option) => option.value);
    microtask(() => {
      flushSync(() => {
      });
      if (!currentTicket(ticket)) return;
      const before = latest.current, mutable = new Set(before.flat.filter((option) => !option.disabled).map((option) => option.value));
      if (mutation.kind !== "clear" && !mutable.has(mutation.value)) return;
      const next = values(mutation.kind === "clear" ? before.value.filter((value2) => !mutable.has(value2)) : mutation.kind === "remove" || before.value.includes(mutation.value) ? before.value.filter((value2) => value2 !== mutation.value) : [...before.value, mutation.value]);
      if (same(next, before.value)) return;
      const detail = detailFor(reason, event), beforeRevision = authority.current.valueRevision, beforeMode = valueModeEpoch.current;
      const wasControlled = before.props.value !== void 0;
      const changedValues = before.value.filter((value2) => !next.includes(value2)).concat(next.filter((value2) => !before.value.includes(value2)));
      if (before.props.onValueChange) flushSync(() => before.props.onValueChange(next, detail));
      if (detail.defaultPrevented || !validTicket(ticket)) return;
      const current = latest.current;
      if (wasControlled && same(current.value, next) && beforeMode === valueModeEpoch.current && beforeRevision !== authority.current.valueRevision) registerAcceptance(acceptedValueRevisions, beforeRevision, authority.current.valueRevision, ticket.stamp);
      if (changedValues.some((value2) => !current.flat.some((option) => option.value === value2 && !option.disabled))) return;
      if (beforeRevision === authority.current.valueRevision && current.props.value === void 0) {
        lastAcceptedValue.current = ticket.stamp;
        flushSync(() => {
          setLocalValue(next);
          setInvalid(false);
        });
        syncBridge(next);
      }
      if (!same(latest.current.value, next)) return;
      if (ownedChip && mutation.kind === "remove" && !focusWasRedirected(ticket)) {
        const index = originalChips.indexOf(mutation.value);
        const candidates = [...originalChips.slice(index + 1), ...originalChips.slice(0, index).reverse()];
        const target = candidates.map((value2) => chipNodes.current.get(value2)).find((node) => node?.isConnected && !node.disabled);
        ownedFocus(target ?? (clear.current && !clear.current.disabled ? clear.current : trigger.current));
      } else if (mutation.kind === "clear" && clear.current && clear.current.ownerDocument.activeElement === clear.current && clear.current.disabled && !focusWasRedirected(ticket)) ownedFocus(trigger.current);
    });
  };
  const focusOption = (next) => {
    highlightValue.current = next;
    setHighlight(next);
    const node = next ? optionNodes.current.get(next) : popup.current;
    ownedFocus(node ?? null);
    if (node && popup.current) {
      const box = popup.current, top = node.offsetTop - box.offsetTop;
      if (top < box.scrollTop) box.scrollTop = top;
      else if (top + node.offsetHeight > box.scrollTop + box.clientHeight) box.scrollTop = top + node.offsetHeight - box.clientHeight;
    }
  };
  const enabled = flat.filter((option) => !option.disabled), enabledKey = JSON.stringify(enabled.map((option) => option.value)), geometryKey = JSON.stringify(flat);
  const wasOpen = React.useRef(false);
  useLayout(() => {
    if (!actualOpen || !portalDocument || !popup.current) {
      if (!actualOpen) {
        wasOpen.current = false;
        typed.current = { text: "", time: 0 };
      }
      return;
    }
    const opening = !wasOpen.current;
    wasOpen.current = true;
    const active = portalDocument.activeElement, detached = pendingOptionFocus.current;
    const stillOwnsFocus = !!(active && popup.current.contains(active)) || !!(detached && !detached.node.isConnected && active === portalDocument.body && detached.focusRevision === focusRevision.current);
    if (opening || !enabled.some((option) => option.value === highlightValue.current)) {
      const search = openingSearch.current.toLocaleLowerCase();
      const chosen = (search ? enabled.find((option) => option.label.trim().toLocaleLowerCase().startsWith(search)) : void 0) ?? enabled[0];
      openingSearch.current = "";
      const ticket = openingTicket.current;
      openingTicket.current = null;
      if (opening && ticket && focusWasRedirected(ticket) || !opening && !stillOwnsFocus) {
        highlightValue.current = chosen?.value ?? null;
        setHighlight(highlightValue.current);
      } else focusOption(chosen?.value ?? null);
    }
    pendingOptionFocus.current = null;
  }, [actualOpen, portalDocument, enabledKey]);
  useLayout(() => {
    const pending = pendingOptionFocus.current;
    pendingOptionFocus.current = null;
    if (!pending || !actualOpen || !portalDocument || blockNow()) return;
    const replacement = optionNodes.current.get(pending.value);
    if (replacement && replacement !== pending.node && !pending.node.isConnected && replacement.isConnected && portalDocument.activeElement === portalDocument.body && pending.focusRevision === focusRevision.current && !replacement.disabled) focusOption(pending.value);
  });
  useLayout(() => {
    if (!actualOpen || !portalDocument || !popup.current || !trigger.current) return;
    const doc = portalDocument, win = doc.defaultView;
    if (!win) return;
    let frame = 0;
    const position = () => {
      const anchor = trigger.current, panel2 = popup.current;
      if (!anchor || !panel2) return;
      const rect = anchor.getBoundingClientRect(), viewport = win.visualViewport;
      const x = viewport?.offsetLeft ?? 0, y = viewport?.offsetTop ?? 0, width = viewport?.width ?? win.innerWidth, height = viewport?.height ?? win.innerHeight;
      const below = Math.max(0, y + height - rect.bottom - 12), above = Math.max(0, rect.top - y - 12), desired = Math.min(320, panel2.scrollHeight || 200);
      const side = below < desired && above > below ? "top" : "bottom";
      const maxHeight = Math.max(1, Math.min(320, side === "bottom" ? below : above));
      const popupWidth = Math.max(1, Math.min(rect.width || 256, Math.max(1, width - 16)));
      const rtl = (latest.current.props.dir ?? win.getComputedStyle(anchor).direction) === "rtl";
      const left = Math.max(x + 8, Math.min(rtl ? rect.right - popupWidth : rect.left, x + width - popupWidth - 8));
      const actualHeight = Math.min(maxHeight, panel2.getBoundingClientRect().height || desired);
      const top = side === "bottom" ? Math.max(y + 8, Math.min(rect.bottom + 4, y + height - actualHeight - 8)) : Math.max(y + 8, rect.top - actualHeight - 4);
      const next = { left, top, width: popupWidth, maxHeight, side, ready: true };
      setPlacement((previous) => Object.keys(next).every((key) => previous[key] === next[key]) ? previous : next);
    };
    const schedule = () => {
      if (!frame) frame = win.requestAnimationFrame(() => {
        frame = 0;
        position();
      });
    };
    position();
    win.addEventListener("resize", schedule);
    doc.addEventListener("scroll", schedule, true);
    win.visualViewport?.addEventListener("resize", schedule);
    win.visualViewport?.addEventListener("scroll", schedule);
    const observer = win.ResizeObserver ? new win.ResizeObserver(schedule) : null;
    observer?.observe(trigger.current);
    observer?.observe(popup.current);
    return () => {
      if (frame) win.cancelAnimationFrame(frame);
      observer?.disconnect();
      win.removeEventListener("resize", schedule);
      doc.removeEventListener("scroll", schedule, true);
      win.visualViewport?.removeEventListener("resize", schedule);
      win.visualViewport?.removeEventListener("scroll", schedule);
    };
  }, [actualOpen, portalDocument, geometryKey, props.dir]);
  const outsideHandler = React.useRef(requestOpen);
  outsideHandler.current = requestOpen;
  useLayout(() => {
    if (!actualOpen || !portalDocument) return;
    const outside = (event) => {
      const target = event.target;
      if (target && !field.current?.contains(target) && !popup.current?.contains(target)) outsideHandler.current(false, event.type === "focusin" ? "focus-out" : "outside-pointer", event);
    };
    portalDocument.addEventListener("pointerdown", outside, true);
    portalDocument.addEventListener("focusin", outside, true);
    return () => {
      portalDocument.removeEventListener("pointerdown", outside, true);
      portalDocument.removeEventListener("focusin", outside, true);
    };
  }, [actualOpen, portalDocument]);
  const typeahead = (key) => {
    const now = Date.now();
    let search = now - typed.current.time < 700 ? typed.current.text + key : key;
    typed.current = { text: search, time: now };
    if (search.length > 1 && [...search].every((character) => character === search[0])) search = search[0];
    const available = latest.current.flat.filter((option) => !option.disabled), start = available.findIndex((option) => option.value === highlightValue.current);
    const ordered = [...available.slice(start + 1), ...available.slice(0, start + 1)];
    if (search.length > 1 && start >= 0) ordered.unshift(available[start]);
    const found = ordered.find((option) => option.label.trim().toLocaleLowerCase().startsWith(search.toLocaleLowerCase()));
    if (found) focusOption(found.value);
  };
  const onKeyDown = (event, suppliedTicket) => {
    const nativeEvent = event.nativeEvent, key = event.key, backward = event.shiftKey;
    if (event.defaultPrevented || nativeEvent.isComposing || nativeEvent.keyCode === 229 || key === "Process" || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey && key !== "Tab" || blockNow()) return;
    const ticket = suppliedTicket ?? ticketForEvent(nativeEvent);
    if (event.repeat && ["Enter", " ", "Escape", "Tab"].includes(key)) {
      ticket.gate.preventNative();
      return;
    }
    if (key === "Enter" || key === " ") return;
    if (!["ArrowDown", "ArrowUp", "Home", "End", "Escape", "Tab"].includes(key) && key.length !== 1) return;
    const beganOpen = latest.current.actualOpen;
    const sourceFocus = trigger.current?.ownerDocument.activeElement;
    if (!sourceFocus || !trigger.current?.contains(sourceFocus) && !popup.current?.contains(sourceFocus)) return;
    if (!beganOpen && ["Tab", "Escape", "Home", "End"].includes(key)) return;
    if (!currentTicket(ticket)) return;
    ticket.gate.preventNative();
    microtask(() => {
      flushSync(() => {
      });
      if (!currentTicket(ticket) || focusWasRedirected(ticket)) return;
      const active = trigger.current?.ownerDocument.activeElement;
      if ((beganOpen || latest.current.actualOpen) && (!active || !trigger.current?.contains(active) && !popup.current?.contains(active))) return;
      if (!latest.current.actualOpen) {
        openingSearch.current = key.length === 1 ? key : "";
        if (key.length === 1) typed.current = { text: key, time: Date.now() };
        acceptOpen(true, "keyboard", nativeEvent, ticket);
        return;
      }
      if (key === "Escape") {
        acceptOpen(false, "escape", nativeEvent, ticket, true);
        return;
      }
      const available = latest.current.flat.filter((option) => !option.disabled);
      if (key === "Tab") {
        const currentIndex = available.findIndex((option) => optionNodes.current.get(option.value) === active), wasPopupRoot = active === popup.current;
        if (currentIndex >= 0) {
          const next = available[currentIndex + (backward ? -1 : 1)];
          if (next) {
            focusOption(next.value);
            return;
          }
        } else if (active === trigger.current && !backward && available[0]) {
          focusOption(available[0].value);
          return;
        }
        acceptOpen(false, "tab", nativeEvent, ticket, false, () => {
          const button = trigger.current, doc = button?.ownerDocument;
          if (!button || !doc) return;
          if (backward && (currentIndex >= 0 || wasPopupRoot)) {
            ownedFocus(button);
            return;
          }
          const candidates = tabStops(doc, popup.current, backward), index = candidates.indexOf(button);
          ownedFocus(candidates[index + (backward ? -1 : 1)] ?? button);
        });
        return;
      }
      if (["ArrowDown", "ArrowUp", "Home", "End"].includes(key)) {
        if (!available.length) return;
        const current = available.findIndex((option) => option.value === highlightValue.current);
        const index = key === "Home" ? 0 : key === "End" ? available.length - 1 : key === "ArrowDown" ? (current + 1) % available.length : (current - 1 + available.length) % available.length;
        focusOption(available[index].value);
        return;
      }
      typeahead(key);
    });
  };
  const suppressRepeatedActivation = (event) => {
    if (event.repeat && (event.key === "Enter" || event.key === " ") && !event.nativeEvent.isComposing && event.nativeEvent.keyCode !== 229 && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) ticketForEvent(event.nativeEvent).gate.preventNative();
  };
  const dir = props.dir ?? (portalDocument && trigger.current ? portalDocument.defaultView?.getComputedStyle(trigger.current).direction : void 0);
  const mutableSelections = selected.filter((option) => !option.disabled);
  const panel = actualOpen && portalDocument ? createPortal(/* @__PURE__ */ React.createElement("div", { ref: popup, id: popupId, role: "dialog", "aria-modal": "false", "aria-labelledby": accessibleLabel, "aria-label": props["aria-label"], tabIndex: -1, className: "wix-multi-select wix-ms-popup", "data-component": variant, "data-variant": variant, "data-motion": props.motion ?? "system", "data-state": "open", "data-side": placement.side, dir, onKeyDown, style: { position: "fixed", left: placement.left, top: placement.top, width: placement.width, maxWidth: "calc(100vw - 16px)", maxHeight: placement.maxHeight, overflowY: "auto", overscrollBehavior: "contain", zIndex: 1e3, visibility: placement.ready ? "visible" : "hidden" } }, /* @__PURE__ */ React.createElement("div", { className: "wix-ms-options" }, flat.map((option) => {
    const checked = value.includes(option.value);
    const optionKey = Array.from(option.value).map((character) => character.codePointAt(0).toString(16)).join("-");
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        key: option.value,
        id: `${id}-option-${optionKey}`,
        className: "wix-ms-option",
        disabled: option.disabled,
        "aria-pressed": checked,
        "data-value": option.value,
        "data-state": checked ? "checked" : "unchecked",
        "data-disabled": option.disabled ? "true" : void 0,
        "data-highlighted": highlight === option.value ? "true" : void 0,
        ref: (node) => {
          if (node) optionNodes.current.set(option.value, node);
          else {
            const previous = optionNodes.current.get(option.value);
            if (previous && previous.ownerDocument.activeElement === previous) pendingOptionFocus.current = { value: option.value, node: previous, focusRevision: focusRevision.current };
            optionNodes.current.delete(option.value);
          }
        },
        onFocus: () => {
          if (!option.disabled) {
            highlightValue.current = option.value;
            setHighlight(option.value);
          }
        },
        onClick: (event) => {
          if (!event.defaultPrevented && !option.disabled) mutate({ kind: "toggle", value: option.value }, event.detail === 0 ? "keyboard" : "pointer", event.nativeEvent);
        }
      },
      /* @__PURE__ */ React.createElement("span", { className: "wix-ms-option-label" }, option.label),
      checked ? /* @__PURE__ */ React.createElement("span", { className: "wix-ms-check", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement(Check, null)) : null
    );
  }), !flat.length ? /* @__PURE__ */ React.createElement("div", { className: "wix-ms-empty" }, "No options available") : null)), portalDocument.body) : null;
  const tp = props.triggerProps ?? {};
  return /* @__PURE__ */ React.createElement("div", { ref: field, className: `wix-multi-select${props.className ? ` ${props.className}` : ""}`, "data-component": variant, "data-variant": variant, "data-motion": props.motion ?? "system", "data-disabled": disabled ? "true" : void 0, "data-readonly": props.readOnly ? "true" : void 0, dir: props.dir, style: props.style }, /* @__PURE__ */ React.createElement("div", { className: "wix-ms-field", "data-disabled": disabled || void 0, "data-readonly": props.readOnly || void 0, "data-invalid": props["aria-invalid"] ?? (!!invalidMessage || void 0) }, /* @__PURE__ */ React.createElement("label", { className: "wix-ms-label", id: labelId, htmlFor: id }, label, props.required ? /* @__PURE__ */ React.createElement("span", { className: "wix-ms-required", "aria-hidden": "true" }, " *") : null), /* @__PURE__ */ React.createElement(
    "button",
    {
      title: tp.title,
      tabIndex: tp.tabIndex,
      autoFocus: tp.autoFocus,
      onPointerDown: tp.onPointerDown,
      onPointerDownCapture: tp.onPointerDownCapture,
      onFocus: tp.onFocus,
      onFocusCapture: tp.onFocusCapture,
      onBlur: tp.onBlur,
      onBlurCapture: tp.onBlurCapture,
      ref: trigger,
      type: "button",
      id,
      className: "wix-ms-trigger",
      "aria-haspopup": "dialog",
      "aria-controls": actualOpen ? popupId : void 0,
      "aria-expanded": actualOpen,
      "aria-labelledby": accessibleLabel,
      "aria-label": props["aria-label"],
      "aria-describedby": describedBy,
      "aria-invalid": props["aria-invalid"] ?? (!!invalidMessage || void 0),
      "aria-disabled": props.readOnly || void 0,
      disabled,
      "data-state": actualOpen ? "open" : "closed",
      "data-placeholder": !selected.length ? "true" : void 0,
      "data-disabled": disabled ? "true" : void 0,
      "data-readonly": props.readOnly ? "true" : void 0,
      onClickCapture: (event) => {
        ticketForEvent(event.nativeEvent);
        tp.onClickCapture?.(event);
      },
      onKeyDownCapture: (event) => {
        ticketForEvent(event.nativeEvent);
        tp.onKeyDownCapture?.(event);
      },
      onClick: (event) => {
        const ticket = ticketForEvent(event.nativeEvent);
        tp.onClick?.(event);
        if (!event.defaultPrevented && currentTicket(ticket)) microtask(() => {
          if (!currentTicket(ticket)) return;
          openingSearch.current = "";
          const next = !latest.current.actualOpen;
          acceptOpen(next, "trigger", event.nativeEvent, ticket, !next);
        });
      },
      onKeyDown: (event) => {
        const ticket = ticketForEvent(event.nativeEvent);
        tp.onKeyDown?.(event);
        onKeyDown(event, ticket);
      }
    },
    /* @__PURE__ */ React.createElement("span", { className: "wix-ms-value" }, summary),
    /* @__PURE__ */ React.createElement(Chevron, null)
  )), props.clearable || props.showSelectedItems ? /* @__PURE__ */ React.createElement("div", { className: "wix-ms-enhancements" }, props.clearable ? /* @__PURE__ */ React.createElement("button", { ref: clear, type: "button", className: "wix-ms-clear", onKeyDown: suppressRepeatedActivation, disabled: disabled || !!props.readOnly || !mutableSelections.length, onClick: (event) => {
    if (!event.defaultPrevented) mutate({ kind: "clear" }, "clear", event.nativeEvent);
  } }, "Clear available selections") : null, props.showSelectedItems && selected.length ? /* @__PURE__ */ React.createElement("div", { className: "wix-ms-chips", "aria-label": "Selected items" }, selected.map((option) => /* @__PURE__ */ React.createElement("span", { className: "wix-ms-chip", key: option.value, "data-disabled": option.disabled ? "true" : void 0 }, /* @__PURE__ */ React.createElement("span", { className: "wix-ms-chip-label" }, option.label), /* @__PURE__ */ React.createElement("button", { type: "button", className: "wix-ms-remove", onKeyDown: suppressRepeatedActivation, "aria-label": `Remove ${option.label}`, disabled: disabled || !!props.readOnly || !!option.disabled, ref: (node) => {
    if (node) chipNodes.current.set(option.value, node);
    else chipNodes.current.delete(option.value);
  }, onClick: (event) => {
    if (!event.defaultPrevented) mutate({ kind: "remove", value: option.value }, "remove", event.nativeEvent);
  } }, /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true" }, "\xD7"))))) : null) : null, /* @__PURE__ */ React.createElement(
    "select",
    {
      ref: native,
      className: "wix-ms-native",
      multiple: true,
      name: props.name,
      form: props.form,
      required: !!props.required && !props.readOnly,
      disabled,
      value: resolvedValues,
      tabIndex: -1,
      "aria-hidden": "true",
      style: { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", clipPath: "inset(50%)", whiteSpace: "nowrap", border: 0, opacity: 0, pointerEvents: "none" },
      onChange: () => syncBridge(),
      onInvalid: (event) => {
        const ticket = ticketForEvent(event.nativeEvent);
        ticket.gate.preventNative();
        microtask(() => {
          flushSync(() => {
          });
          if (currentTicket(ticket) && latest.current.props.required && !latest.current.props.readOnly) {
            setInvalid(true);
            if (!focusWasRedirected(ticket)) ownedFocus(trigger.current);
          }
        });
      }
    },
    flat.map((option) => /* @__PURE__ */ React.createElement("option", { key: option.value, value: option.value, disabled: option.disabled }, option.label))
  ), props.required && !props.readOnly ? /* @__PURE__ */ React.createElement("span", { id: requiredId, className: "wix-ms-sr-only" }, "Required") : null, helper ? /* @__PURE__ */ React.createElement("p", { id: helperId, className: "wix-ms-helper" }, helper) : null, invalidMessage ? /* @__PURE__ */ React.createElement("p", { id: errorId, className: "wix-ms-error", role: "alert" }, invalidMessage) : null, panel);
}
var Core = React.forwardRef(MultiSelect);
Core.displayName = "MultiSelectControl";
var Select32 = React.forwardRef((props, ref) => /* @__PURE__ */ React.createElement(Core, { ...props, variant: "select-32", ref }));
var Select33 = React.forwardRef((props, ref) => /* @__PURE__ */ React.createElement(Core, { ...props, variant: "select-33", ref }));
Select32.displayName = "Select32";
Select33.displayName = "Select33";
export {
  Select32,
  Select33,
  wixMultiSelectIds
};
