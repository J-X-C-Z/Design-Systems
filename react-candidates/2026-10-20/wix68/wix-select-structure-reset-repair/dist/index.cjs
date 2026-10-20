var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.tsx
var index_exports = {};
__export(index_exports, {
  Select22: () => Select22,
  Select23: () => Select23,
  Select24: () => Select24,
  Select25: () => Select25,
  wixSelectStructureIds: () => wixSelectStructureIds
});
module.exports = __toCommonJS(index_exports);
var React = __toESM(require("react"), 1);
var import_react_dom = require("react-dom");
var wixSelectStructureIds = Object.freeze(["select-22", "select-23", "select-24", "select-25"]);
var definitions = {
  "select-22": {
    "label": "Infrastructure Core",
    "placeholder": "Identify resource",
    "value": "edge",
    "options": [
      {
        "label": "Compute Layer",
        "options": [
          {
            "value": "lambda",
            "label": "Serverless Lambda"
          },
          {
            "value": "ec2",
            "label": "Virtual Instance"
          },
          {
            "value": "containers",
            "label": "Managed Cluster"
          }
        ]
      },
      {
        "label": "Delivery Layer",
        "options": [
          {
            "value": "cdn",
            "label": "Content Delivery"
          },
          {
            "value": "edge",
            "label": "Edge Computing"
          }
        ]
      }
    ]
  },
  "select-23": {
    "label": "Workspace Strategy",
    "placeholder": "Identify model",
    "value": "remote",
    "options": [
      {
        "label": "Flexible Layouts",
        "options": [
          {
            "value": "remote",
            "label": "Fully Distributed"
          },
          {
            "value": "hybrid",
            "label": "Hybrid Dynamic"
          }
        ]
      },
      {
        "separator": true
      },
      {
        "label": "Centralized Models",
        "options": [
          {
            "value": "office",
            "label": "HQ Centric"
          },
          {
            "value": "pods",
            "label": "Regional Pods"
          }
        ]
      }
    ]
  },
  "select-24": {
    "label": "System Identity",
    "placeholder": "Identify namespace",
    "value": "default",
    "options": [
      {
        "value": "default",
        "label": "Default Instance"
      },
      {
        "value": "staging",
        "label": "Staging Cluster"
      },
      {
        "value": "prod",
        "label": "Production Main"
      },
      {
        "value": "sandbox",
        "label": "Sandbox Environment"
      }
    ]
  },
  "select-25": {
    "label": "Security Policy",
    "placeholder": "Identify policy",
    "value": "standard",
    "options": [
      {
        "value": "standard",
        "label": "Standard Protocol"
      },
      {
        "value": "strict",
        "label": "Strict Enforcement"
      },
      {
        "value": "relaxed",
        "label": "Relaxed Governance"
      },
      {
        "value": "custom",
        "label": "Custom Definition"
      }
    ]
  }
};
var useLayout = typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;
var microtask = (fn) => {
  if (typeof queueMicrotask === "function") queueMicrotask(fn);
  else Promise.resolve().then(fn);
};
var sequence = 0;
var resetStamps = /* @__PURE__ */ new WeakMap();
var eventGates = /* @__PURE__ */ new WeakMap();
function gateFor(event) {
  if (event.type !== "keydown") return { get canceled() {
    return event.defaultPrevented;
  }, preventNative: () => event.preventDefault() };
  const existing = eventGates.get(event);
  if (existing) return existing;
  const original = event.preventDefault;
  const descriptor = Object.getOwnPropertyDescriptor(event, "preventDefault");
  const gate = { canceled: event.defaultPrevented, preventNative: () => original.call(event) };
  const wrapped = function() {
    gate.canceled = true;
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
function detailFor(reason, event) {
  let canceled = false;
  return { reason, originalEvent: event, cancelable: true, get defaultPrevented() {
    return canceled;
  }, preventDefault() {
    canceled = true;
  } };
}
function isSeparator(item) {
  return item.separator === true;
}
function isGroup(item) {
  return item.options !== void 0;
}
function snapshotItems(items) {
  const snapshot = (item) => {
    const value = item.value, label = item.label, disabled = item.disabled, options = item.options, separator = item.separator;
    return { value, label, disabled, options, separator };
  };
  return items.map((item) => {
    const copy = snapshot(item);
    return isGroup(copy) ? { ...copy, options: copy.options.map((option) => snapshot(option)) } : copy;
  });
}
function flatten(items) {
  const values = /* @__PURE__ */ new Set();
  const out = [];
  const add = (option, groupDisabled = false) => {
    if (option.separator !== void 0 || option.options !== void 0) throw new Error("wix-select-structure: groups can contain only flat options, not separators or nested groups.");
    if (typeof option.value !== "string" || option.value === "" || values.has(option.value)) throw new Error("wix-select-structure: option values must be unique, nonempty strings.");
    if (typeof option.label !== "string") throw new Error("wix-select-structure: option labels must be strings.");
    values.add(option.value);
    out.push({ ...option, blocked: !!(groupDisabled || option.disabled), index: out.length });
  };
  items.forEach((item) => {
    if (item.separator !== void 0) {
      if (item.separator !== true || item.value !== void 0 || item.label !== void 0 || item.options !== void 0 || item.disabled !== void 0) throw new Error("wix-select-structure: separators must contain only separator:true.");
      return;
    }
    if (isGroup(item)) {
      if (item.value !== void 0 || typeof item.label !== "string") throw new Error("wix-select-structure: groups need a string label and cannot have a value.");
      item.options.forEach((option) => add(option, item.disabled));
    } else add(item);
  });
  return out;
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
function Chevron({ up = false, className = "" }) {
  return /* @__PURE__ */ React.createElement("svg", { className, "aria-hidden": "true", focusable: "false", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.7" }, /* @__PURE__ */ React.createElement("path", { d: up ? "m6 15 6-6 6 6" : "m6 9 6 6 6-6", strokeLinecap: "round", strokeLinejoin: "round" }));
}
function Check() {
  return /* @__PURE__ */ React.createElement("svg", { "aria-hidden": "true", focusable: "false", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8" }, /* @__PURE__ */ React.createElement("path", { d: "m5 12 4 4L19 6", strokeLinecap: "round", strokeLinejoin: "round" }));
}
function SelectStructure(props, forwardedRef) {
  const { variant } = props;
  const definition = definitions[variant];
  const generated = React.useId();
  const id = props.id ?? `wix-ss-${generated}`;
  const labelId = `${id}-label`, popupId = `${id}-listbox`, helperId = `${id}-helper`, errorId = `${id}-error`;
  const mountDefault = React.useRef(props.defaultValue ?? definition.value);
  const [localValue, setLocalValue] = React.useState(mountDefault.current);
  const [localOpen, setLocalOpen] = React.useState(props.defaultOpen ?? false);
  const [fieldsetDisabled, setFieldsetDisabled] = React.useState(false);
  const [portalDocument, setPortalDocument] = React.useState(null);
  const [highlight, setHighlight] = React.useState(null);
  const highlightValue = React.useRef(null);
  const [invalid, setInvalid] = React.useState(false);
  const [placement, setPlacement] = React.useState({ left: 0, top: 0, width: 0, maxHeight: 320, side: "bottom", ready: false });
  const [overflow, setOverflow] = React.useState({ up: false, down: false });
  const trigger = React.useRef(null), native = React.useRef(null), listbox = React.useRef(null), popup = React.useRef(null);
  React.useImperativeHandle(forwardedRef, () => trigger.current, []);
  const triggerRef = React.useCallback((node) => {
    trigger.current = node;
  }, []);
  const optionNodes = React.useRef(/* @__PURE__ */ new Map());
  const pendingOptionFocus = React.useRef(null);
  const triggerTickets = React.useRef(/* @__PURE__ */ new WeakMap());
  const alive = React.useRef(false), lifetime = React.useRef(0), interaction = React.useRef(0), focusRevision = React.useRef(0), internalFocus = React.useRef(null);
  const drainFieldsetRecords = React.useRef(() => {
  });
  const valueModeEpoch = React.useRef(0), openModeEpoch = React.useRef(0);
  const openingTicket = React.useRef(null);
  const acceptedOpenRevisions = React.useRef([]);
  const acceptedValueRevisions = React.useRef([]);
  const resets = React.useRef([]), lastAcceptedValue = React.useRef(0);
  const openIntent = React.useRef("selected");
  const openingSearch = React.useRef("");
  const typed = React.useRef({ text: "", time: 0 });
  const items = snapshotItems(props.options ?? definition.options);
  const flat = flatten(items);
  const controlledValue = props.value !== void 0, controlledOpen = props.open !== void 0;
  const value = controlledValue ? props.value : localValue;
  const selected = flat.find((option) => option.value === value);
  const resolvedValue = selected?.value ?? "";
  const disabled = !!props.disabled || fieldsetDisabled;
  const actualOpen = (controlledOpen ? props.open : localOpen) && !disabled && !props.readOnly;
  const authority = React.useRef({ valueControlled: controlledValue, value, openControlled: controlledOpen, open: controlledOpen ? props.open : localOpen, valueRevision: 0, openRevision: 0, disabled: !!props.disabled, readOnly: !!props.readOnly });
  const latest = React.useRef({ props, flat, items, value, resolvedValue, actualOpen, disabled });
  const label = props.label ?? definition.label, placeholder = props.placeholder ?? definition.placeholder;
  const helper = props.helper;
  const describedBy = [props["aria-describedby"], helper ? helperId : "", props.error || invalid ? errorId : ""].filter(Boolean).join(" ") || void 0;
  const accessibleLabel = props["aria-labelledby"] ?? (props["aria-label"] ? void 0 : labelId);
  const invalidMessage = props.error || (invalid ? "Please select an option." : void 0);
  const blockNow = () => !!latest.current.props.disabled || !!latest.current.props.readOnly || disabledByFieldset(trigger.current);
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
    const current = latest.current;
    const owner = current.props.value !== void 0;
    const wanted = requested ?? (owner ? current.props.value : current.value);
    const resolved = current.flat.some((option) => option.value === wanted) ? wanted : "";
    const defaultWanted = owner ? resolved : current.flat.some((option) => option.value === mountDefault.current) ? mountDefault.current : "";
    for (const option of Array.from(element.options)) option.defaultSelected = option.value === defaultWanted;
    element.value = resolved;
  };
  useLayout(() => {
    const previous = authority.current;
    if (previous.valueControlled !== controlledValue) valueModeEpoch.current++;
    if (previous.openControlled !== controlledOpen) openModeEpoch.current++;
    const valueChanged = previous.valueControlled !== controlledValue || controlledValue && previous.value !== value;
    const openChanged = previous.openControlled !== controlledOpen || controlledOpen && previous.open !== props.open;
    if (previous.disabled !== !!props.disabled || previous.readOnly !== !!props.readOnly) interaction.current++;
    authority.current = { valueControlled: controlledValue, value, openControlled: controlledOpen, open: controlledOpen ? props.open : localOpen, valueRevision: previous.valueRevision + Number(valueChanged), openRevision: previous.openRevision + Number(openChanged), disabled: !!props.disabled, readOnly: !!props.readOnly };
    latest.current = { props, flat, items, value, resolvedValue, actualOpen, disabled };
    if (previous.valueControlled && !controlledValue) setLocalValue(previous.value);
    if (previous.openControlled && !controlledOpen) setLocalOpen(previous.open);
    for (const record of resets.current) if (record.event.eventPhase !== 0) record.associatedDuringDispatch = native.current?.form === record.form;
    syncBridge();
    microtask(() => {
      if (alive.current) syncBridge();
    });
    if (invalid && (!props.required || resolvedValue !== "" || disabled)) setInvalid(false);
    if ((disabled || props.readOnly) && !controlledOpen && localOpen) setLocalOpen(false);
  });
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
      const record = { event, stamp, form, associatedDuringDispatch: native.current?.form === form };
      resets.current.push(record);
      const life = lifetime.current;
      microtask(() => {
        if (!alive.current || lifetime.current !== life) return;
        if (event.defaultPrevented) {
          resets.current = resets.current.filter((item) => item !== record);
          return;
        }
        (0, import_react_dom.flushSync)(() => {
        });
        if (!alive.current || lifetime.current !== life || !record.associatedDuringDispatch) {
          resets.current = resets.current.filter((item) => item !== record);
          return;
        }
        resets.current = resets.current.filter((item) => item.stamp >= record.stamp);
        (0, import_react_dom.flushSync)(() => {
          if (lastAcceptedValue.current <= record.stamp && latest.current.props.value === void 0) setLocalValue(mountDefault.current);
          setInvalid(false);
          if (latest.current.props.open === void 0) setLocalOpen(false);
        });
        syncBridge();
        typed.current = { text: "", time: 0 };
      });
    };
    doc.addEventListener("reset", onReset, true);
    doc.addEventListener("focusin", trackFocus, true);
    const Observer = doc.defaultView?.MutationObserver;
    const observer = Observer ? new Observer(updateDisabled) : null;
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
      doc.removeEventListener("focusin", trackFocus, true);
      optionNodes.current.clear();
    };
  }, []);
  const ticketFor = (event) => {
    drainFieldsetRecords.current();
    return { stamp: ++sequence, lifetime: lifetime.current, interaction: interaction.current, valueRevision: authority.current.valueRevision, openRevision: authority.current.openRevision, focusRevision: focusRevision.current, gate: gateFor(event), focusOrigin: trigger.current?.ownerDocument.activeElement ?? null, focusMoved: false };
  };
  const triggerTicketFor = (event) => {
    let ticket = triggerTickets.current.get(event);
    if (!ticket) {
      ticket = ticketFor(event);
      triggerTickets.current.set(event, ticket);
    }
    return ticket;
  };
  const validTicket = (ticket) => {
    drainFieldsetRecords.current();
    return alive.current && ticket.lifetime === lifetime.current && ticket.interaction === interaction.current && !blockNow() && !ticket.gate.canceled && !resets.current.some((record) => record.associatedDuringDispatch && record.stamp > ticket.stamp && !record.event.defaultPrevented);
  };
  const observeUserFocus = (ticket, callback) => {
    const doc = trigger.current?.ownerDocument;
    const moved = (event) => {
      const target = event.target;
      if (target && !trigger.current?.contains(target) && !popup.current?.contains(target)) ticket.focusMoved = true;
    };
    doc?.addEventListener("focusin", moved, true);
    try {
      callback();
    } finally {
      doc?.removeEventListener("focusin", moved, true);
    }
  };
  const focusWasRedirected = (ticket) => {
    const doc = trigger.current?.ownerDocument;
    const active = doc?.activeElement;
    return ticket.focusRevision !== focusRevision.current || ticket.focusMoved || !!(active && active !== doc?.body && active !== ticket.focusOrigin && !trigger.current?.contains(active) && !popup.current?.contains(active));
  };
  const resolvedOpenRevision = (ticket) => {
    let revision = ticket.openRevision;
    for (const accepted of acceptedOpenRevisions.current) if (accepted.from === revision && accepted.stamp < ticket.stamp) revision = accepted.to;
    return revision;
  };
  const acceptOpen = (next, reason, event, ticket, previousOpen, restore, afterAccept) => {
    (0, import_react_dom.flushSync)(() => {
    });
    if (!validTicket(ticket) || resolvedOpenRevision(ticket) !== authority.current.openRevision || previousOpen === next || latest.current.actualOpen === next) return;
    const detail = detailFor(reason, event);
    const beforeRevision = authority.current.openRevision, beforeMode = openModeEpoch.current;
    const wasControlled = latest.current.props.open !== void 0;
    if (next) openingTicket.current = ticket;
    const callback = latest.current.props.onOpenChange;
    if (callback) observeUserFocus(ticket, () => (0, import_react_dom.flushSync)(() => callback(next, detail)));
    if (detail.defaultPrevented || !validTicket(ticket)) {
      if (next) openingTicket.current = null;
      return;
    }
    const current = latest.current;
    if (wasControlled && current.props.open === next && beforeMode === openModeEpoch.current && beforeRevision !== authority.current.openRevision) {
      const accepted = { from: beforeRevision, to: authority.current.openRevision, stamp: ticket.stamp };
      acceptedOpenRevisions.current.push(accepted);
      microtask(() => {
        acceptedOpenRevisions.current = acceptedOpenRevisions.current.filter((item) => item !== accepted);
      });
    }
    if (beforeRevision === authority.current.openRevision && current.props.open === void 0) {
      current.actualOpen = next;
      (0, import_react_dom.flushSync)(() => setLocalOpen(next));
    }
    if (next && !latest.current.actualOpen) openingTicket.current = null;
    if (!next && restore && !focusWasRedirected(ticket)) {
      if (current.props.open === void 0 || current.props.open === false) ownedFocus(trigger.current);
    }
    if ((current.props.open === void 0 || current.props.open === next) && !focusWasRedirected(ticket)) afterAccept?.();
  };
  const requestOpen = (next, reason, event, restore = false, suppliedTicket, afterAccept) => {
    const ticket = suppliedTicket ?? ticketFor(event);
    const previousOpen = latest.current.actualOpen;
    if (blockNow() || ticket.gate.canceled) return;
    microtask(() => acceptOpen(next, reason, event, ticket, previousOpen, restore, afterAccept));
  };
  const resolvedValueRevision = (ticket) => {
    let revision = ticket.valueRevision;
    for (const accepted of acceptedValueRevisions.current) if (accepted.from === revision && accepted.stamp < ticket.stamp) revision = accepted.to;
    return revision;
  };
  const commit = (next, reason, event, suppliedTicket, runNow = false) => {
    const ticket = suppliedTicket ?? ticketFor(event);
    const initialOpen = latest.current.actualOpen;
    if (blockNow() || ticket.gate.canceled) return;
    const apply = () => {
      (0, import_react_dom.flushSync)(() => {
      });
      if (!validTicket(ticket) || resolvedValueRevision(ticket) !== authority.current.valueRevision || resolvedOpenRevision(ticket) !== authority.current.openRevision) return;
      const option = latest.current.flat.find((item) => item.value === next);
      if (!option || option.blocked) return;
      const detail = detailFor(reason, event);
      const beforeRevision = authority.current.valueRevision, beforeMode = valueModeEpoch.current;
      const wasControlled = latest.current.props.value !== void 0;
      const callback = latest.current.props.onValueChange;
      if (next !== latest.current.value && callback) observeUserFocus(ticket, () => (0, import_react_dom.flushSync)(() => callback(next, detail)));
      if (detail.defaultPrevented || !validTicket(ticket)) return;
      const current = latest.current;
      if (wasControlled && current.props.value === next && beforeMode === valueModeEpoch.current && beforeRevision !== authority.current.valueRevision) {
        const accepted = { from: beforeRevision, to: authority.current.valueRevision, stamp: ticket.stamp };
        acceptedValueRevisions.current.push(accepted);
        microtask(() => {
          acceptedValueRevisions.current = acceptedValueRevisions.current.filter((item) => item !== accepted);
        });
      }
      const currentOption = current.flat.find((item) => item.value === next);
      if (!currentOption || currentOption.blocked) return;
      if (beforeRevision === authority.current.valueRevision && current.props.value === void 0) {
        current.value = next;
        current.resolvedValue = next;
        setLocalValue(next);
        syncBridge(next);
        lastAcceptedValue.current = ticket.stamp;
        setInvalid(false);
      }
      acceptOpen(false, "selection", event, ticket, initialOpen, true);
    };
    if (runNow) apply();
    else microtask(apply);
  };
  const focusOption = (next) => {
    highlightValue.current = next;
    setHighlight(next);
    const node = next ? optionNodes.current.get(next) : listbox.current;
    ownedFocus(node ?? null);
    if (next && node && listbox.current) {
      const box = listbox.current;
      const top = node.offsetTop - box.offsetTop;
      if (top < box.scrollTop) box.scrollTop = top;
      else if (top + node.offsetHeight > box.scrollTop + box.clientHeight) box.scrollTop = top + node.offsetHeight - box.clientHeight;
    }
  };
  const enabled = flat.filter((option) => !option.blocked);
  const enabledKey = JSON.stringify(enabled.map((option) => option.value));
  const geometryKey = JSON.stringify(items);
  const wasOpen = React.useRef(false);
  useLayout(() => {
    if (!actualOpen || !portalDocument || !listbox.current) {
      if (!actualOpen) {
        wasOpen.current = false;
        typed.current = { text: "", time: 0 };
      }
      return;
    }
    const opening = !wasOpen.current;
    wasOpen.current = true;
    if (opening || !enabled.some((option) => option.value === highlight)) {
      const searchMatch = openingSearch.current ? enabled.find((option) => option.label.trim().toLocaleLowerCase().startsWith(openingSearch.current.toLocaleLowerCase())) : void 0;
      const chosen = searchMatch ?? (openIntent.current === "last" ? enabled[enabled.length - 1] : openIntent.current === "first" ? enabled[0] : enabled.find((option) => option.value === resolvedValue) ?? enabled[0]);
      openingSearch.current = "";
      const openTicket = openingTicket.current;
      openingTicket.current = null;
      const active = portalDocument.activeElement;
      const detached = pendingOptionFocus.current;
      const stillOwnsPopupFocus = !!(active && popup.current?.contains(active)) || !!(detached && !detached.node.isConnected && active === portalDocument.body);
      if (opening && openTicket && focusWasRedirected(openTicket) || !opening && !stillOwnsPopupFocus) {
        highlightValue.current = chosen?.value ?? null;
        setHighlight(highlightValue.current);
      } else focusOption(chosen?.value ?? null);
      openIntent.current = "selected";
    }
  }, [actualOpen, portalDocument, enabledKey]);
  useLayout(() => {
    const pending = pendingOptionFocus.current;
    pendingOptionFocus.current = null;
    if (!pending || !actualOpen || !portalDocument || blockNow()) return;
    const replacement = optionNodes.current.get(pending.value);
    if (highlightValue.current === pending.value && replacement && replacement !== pending.node && !pending.node.isConnected && replacement.isConnected && portalDocument.activeElement === portalDocument.body && enabled.some((option) => option.value === pending.value)) focusOption(pending.value);
  });
  const measureOverflow = () => {
    const box = listbox.current;
    if (box) setOverflow((previous) => {
      const next = { up: box.scrollTop > 1, down: box.scrollTop + box.clientHeight < box.scrollHeight - 1 };
      return previous.up === next.up && previous.down === next.down ? previous : next;
    });
  };
  useLayout(() => {
    if (!actualOpen || !portalDocument || !popup.current || !trigger.current) return;
    const doc = portalDocument, win = doc.defaultView;
    if (!win) return;
    let frame = 0;
    const position = () => {
      const anchor = trigger.current;
      if (!anchor || !popup.current) return;
      const rect = anchor.getBoundingClientRect();
      const viewport = win.visualViewport;
      const x = viewport?.offsetLeft ?? 0, y = viewport?.offsetTop ?? 0;
      const width = viewport?.width ?? win.innerWidth, height = viewport?.height ?? win.innerHeight;
      const offset = variant === "select-25" ? 12 : 4;
      const below = Math.max(0, y + height - rect.bottom - offset - 8), above = Math.max(0, rect.top - y - offset - 8);
      const desired = Math.min(320, (listbox.current?.scrollHeight ?? 200) + 48);
      const side = below < desired && above > below ? "top" : "bottom";
      const maxHeight = Math.max(40, Math.min(320, side === "bottom" ? below : above));
      const popupWidth = Math.max(1, Math.min(rect.width || 256, width - 16));
      const rtl = (latest.current.props.dir ?? win.getComputedStyle(anchor).direction) === "rtl";
      const left = Math.max(x + 8, Math.min(rtl ? rect.right - popupWidth : rect.left, x + width - popupWidth - 8));
      const actualHeight = Math.min(maxHeight, popup.current.getBoundingClientRect().height || desired);
      const top = side === "bottom" ? rect.bottom + offset : Math.max(y + 8, rect.top - actualHeight - offset);
      const next = { left, top, width: popupWidth, maxHeight, side, ready: true };
      setPlacement((previous) => Object.keys(next).every((key) => previous[key] === next[key]) ? previous : next);
      measureOverflow();
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
    if (listbox.current) observer?.observe(listbox.current);
    return () => {
      if (frame) win.cancelAnimationFrame(frame);
      observer?.disconnect();
      win.removeEventListener("resize", schedule);
      doc.removeEventListener("scroll", schedule, true);
      win.visualViewport?.removeEventListener("resize", schedule);
      win.visualViewport?.removeEventListener("scroll", schedule);
    };
  }, [actualOpen, portalDocument, geometryKey, props.dir, variant]);
  const handlers = React.useRef({ requestOpen });
  handlers.current = { requestOpen };
  useLayout(() => {
    if (!actualOpen || !portalDocument) return;
    const outside = (event) => {
      if (event.type === "focusin") pendingOptionFocus.current = null;
      const target = event.target;
      if (target && !trigger.current?.contains(target) && !popup.current?.contains(target)) handlers.current.requestOpen(false, event.type === "focusin" ? "focus-out" : "outside-pointer", event);
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
    const options = latest.current.flat.filter((option) => !option.blocked);
    const start = options.findIndex((option) => option.value === highlightValue.current);
    const ordered = [...options.slice(start + 1), ...options.slice(0, start + 1)];
    if (search.length > 1 && start >= 0) ordered.unshift(options[start]);
    const found = ordered.find((option) => option.label.trim().toLocaleLowerCase().startsWith(search.toLocaleLowerCase()));
    if (found) focusOption(found.value);
  };
  const onKeyDown = (event, suppliedTicket) => {
    const nativeEvent = event.nativeEvent, key = event.key, backward = event.shiftKey;
    const startedOpen = latest.current.actualOpen;
    if (event.defaultPrevented || nativeEvent.isComposing || nativeEvent.keyCode === 229 || key === "Process" || event.altKey || event.ctrlKey || event.metaKey || blockNow()) return;
    if (event.repeat && ["Enter", " ", "Escape", "Tab"].includes(key)) {
      gateFor(nativeEvent).preventNative();
      return;
    }
    const ticket = suppliedTicket ?? ticketFor(nativeEvent);
    if (ticket.valueRevision !== authority.current.valueRevision || ticket.openRevision !== authority.current.openRevision || !validTicket(ticket)) return;
    if (!["ArrowDown", "ArrowUp", "Home", "End", "Enter", " ", "Escape", "Tab"].includes(key) && key.length !== 1) return;
    if (!latest.current.actualOpen && ["Tab", "Escape", "Home", "End"].includes(key)) return;
    ticket.gate.preventNative();
    microtask(() => {
      (0, import_react_dom.flushSync)(() => {
      });
      if (!validTicket(ticket) || resolvedValueRevision(ticket) !== authority.current.valueRevision || resolvedOpenRevision(ticket) !== authority.current.openRevision) return;
      const active = trigger.current?.ownerDocument.activeElement;
      if ((startedOpen || latest.current.actualOpen) && (focusWasRedirected(ticket) || !active || !trigger.current?.contains(active) && !popup.current?.contains(active))) return;
      if (!latest.current.actualOpen) {
        if (["ArrowDown", "ArrowUp", "Enter", " "].includes(key)) {
          openingSearch.current = "";
          openIntent.current = key === "ArrowUp" ? "last" : "selected";
          acceptOpen(true, "keyboard", nativeEvent, ticket, false, false);
        } else if (key.length === 1) {
          openIntent.current = "first";
          openingSearch.current = key;
          typed.current = { text: key, time: Date.now() };
          acceptOpen(true, "keyboard", nativeEvent, ticket, false, false);
        }
        return;
      }
      if (key === "Escape") {
        acceptOpen(false, "escape", nativeEvent, ticket, true, true);
        return;
      }
      if (key === "Tab") {
        acceptOpen(false, "tab", nativeEvent, ticket, true, false, () => {
          const button = trigger.current, doc = button?.ownerDocument;
          if (!button || !doc) return;
          const candidates = tabStops(doc, popup.current, backward);
          const index = candidates.indexOf(button), next = candidates[index + (backward ? -1 : 1)];
          ownedFocus(next ?? button);
        });
        return;
      }
      if (["ArrowDown", "ArrowUp", "Home", "End"].includes(key)) {
        const options = latest.current.flat.filter((option) => !option.blocked);
        if (!options.length) return;
        const current = options.findIndex((option) => option.value === highlightValue.current);
        const index = key === "Home" ? 0 : key === "End" ? options.length - 1 : key === "ArrowDown" ? (current + 1) % options.length : (current - 1 + options.length) % options.length;
        focusOption(options[index].value);
        return;
      }
      if (key === "Enter" || key === " " && (!typed.current.text || Date.now() - typed.current.time >= 700)) {
        const next = highlightValue.current;
        if (next) commit(next, "keyboard", nativeEvent, ticket, true);
        return;
      }
      if (key.length === 1) typeahead(key);
    });
  };
  const renderOption = (option, groupDisabled = false) => {
    const optionKey = Array.from(option.value).map((character) => character.codePointAt(0).toString(16)).join("-");
    const blocked = !!(groupDisabled || option.disabled);
    const checked = option.value === resolvedValue;
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: option.value,
        id: `${id}-option-${optionKey}`,
        ref: (node) => {
          if (node) optionNodes.current.set(option.value, node);
          else {
            const previous = optionNodes.current.get(option.value);
            if (previous && previous.ownerDocument.activeElement === previous) pendingOptionFocus.current = { value: option.value, node: previous };
            optionNodes.current.delete(option.value);
          }
        },
        role: "option",
        "aria-selected": checked,
        "aria-disabled": blocked || void 0,
        tabIndex: -1,
        className: "wix-ss-option",
        "data-value": option.value,
        "data-state": checked ? "checked" : "unchecked",
        "data-highlighted": highlight === option.value ? "true" : void 0,
        "data-disabled": blocked ? "true" : void 0,
        onFocus: () => {
          if (!blocked) {
            highlightValue.current = option.value;
            setHighlight(option.value);
          }
        },
        onPointerMove: (event) => {
          if (!blocked && event.pointerType !== "touch" && !blockNow()) focusOption(option.value);
        },
        onPointerDown: (event) => {
          if (blocked) event.preventDefault();
        },
        onClick: (event) => {
          if (!event.defaultPrevented && !blocked) commit(option.value, "pointer", event.nativeEvent);
        }
      },
      /* @__PURE__ */ React.createElement("span", { className: "wix-ss-option-label" }, option.label),
      /* @__PURE__ */ React.createElement("span", { className: "wix-ss-check", "aria-hidden": "true", style: { visibility: checked ? "visible" : "hidden" } }, checked ? /* @__PURE__ */ React.createElement(Check, null) : null)
    );
  };
  const dir = props.dir ?? (portalDocument && trigger.current ? portalDocument.defaultView?.getComputedStyle(trigger.current).direction : void 0);
  const scrollBy = (direction) => {
    const box = listbox.current;
    if (box) {
      box.scrollTop += direction * Math.max(40, box.clientHeight / 2);
      measureOverflow();
    }
  };
  const panel = actualOpen && portalDocument ? (0, import_react_dom.createPortal)(/* @__PURE__ */ React.createElement("div", { ref: popup, className: "wix-select-structure wix-ss-popup", "data-component": variant, "data-variant": variant, "data-motion": props.motion ?? "system", "data-state": "open", "data-side": placement.side, dir, style: { position: "fixed", left: placement.left, top: placement.top, width: placement.width, maxWidth: "calc(100vw - 16px)", maxHeight: placement.maxHeight, zIndex: 1e3, visibility: placement.ready ? "visible" : "hidden" } }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "wix-ss-scroll-up", tabIndex: -1, "aria-label": "Scroll up", hidden: !overflow.up, onPointerDown: (event) => event.preventDefault(), onClick: () => scrollBy(-1) }, /* @__PURE__ */ React.createElement(Chevron, { up: true })), /* @__PURE__ */ React.createElement("div", { ref: listbox, id: popupId, className: "wix-ss-listbox", role: "listbox", "aria-labelledby": accessibleLabel, "aria-label": props["aria-label"], "aria-required": props.required || void 0, tabIndex: -1, onKeyDown, onScroll: measureOverflow, style: { maxHeight: Math.max(24, placement.maxHeight - 48), overflowY: "auto", overscrollBehavior: "contain" } }, items.map((item, index) => isSeparator(item) ? /* @__PURE__ */ React.createElement("div", { key: `separator-${index}`, className: "wix-ss-separator", role: "separator", "aria-orientation": "horizontal", "aria-hidden": "true" }) : isGroup(item) ? /* @__PURE__ */ React.createElement("div", { className: "wix-ss-group", role: "group", "aria-labelledby": `${id}-group-${index}`, "aria-disabled": item.disabled || void 0, key: `group-${items.slice(0, index).filter(isGroup).length}` }, /* @__PURE__ */ React.createElement("div", { className: "wix-ss-group-label", id: `${id}-group-${index}` }, item.label), item.options.map((option) => renderOption(option, item.disabled))) : renderOption(item)), !flat.length ? /* @__PURE__ */ React.createElement("div", { className: "wix-ss-empty" }, "No options available") : null), /* @__PURE__ */ React.createElement("button", { type: "button", className: "wix-ss-scroll-down", tabIndex: -1, "aria-label": "Scroll down", hidden: !overflow.down, onPointerDown: (event) => event.preventDefault(), onClick: () => scrollBy(1) }, /* @__PURE__ */ React.createElement(Chevron, null))), portalDocument.body) : null;
  const tp = props.triggerProps ?? {};
  return /* @__PURE__ */ React.createElement("div", { className: `wix-select-structure${props.className ? ` ${props.className}` : ""}`, "data-component": variant, "data-variant": variant, "data-motion": props.motion ?? "system", "data-disabled": disabled ? "true" : void 0, dir: props.dir, style: props.style }, /* @__PURE__ */ React.createElement("div", { className: "wix-ss-field", "data-disabled": disabled || void 0, "data-readonly": props.readOnly || void 0, "data-invalid": props["aria-invalid"] ?? (!!invalidMessage || void 0) }, /* @__PURE__ */ React.createElement("label", { className: "wix-ss-label", id: labelId, htmlFor: id }, label, props.required ? /* @__PURE__ */ React.createElement("span", { "aria-hidden": "true", className: "wix-ss-required" }, " *") : null), /* @__PURE__ */ React.createElement(
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
      ref: triggerRef,
      type: "button",
      id,
      className: "wix-ss-trigger",
      role: "combobox",
      "aria-haspopup": "listbox",
      "aria-controls": actualOpen ? popupId : void 0,
      "aria-expanded": actualOpen,
      "aria-labelledby": accessibleLabel,
      "aria-label": props["aria-label"],
      "aria-describedby": describedBy,
      "aria-invalid": props["aria-invalid"] ?? (!!invalidMessage || void 0),
      "aria-required": props.required || void 0,
      "aria-readonly": props.readOnly || void 0,
      disabled,
      "data-state": actualOpen ? "open" : "closed",
      "data-placeholder": !selected ? "true" : void 0,
      "data-disabled": disabled ? "true" : void 0,
      "data-readonly": props.readOnly ? "true" : void 0,
      onClickCapture: (event) => {
        const ticket = triggerTicketFor(event.nativeEvent);
        observeUserFocus(ticket, () => tp.onClickCapture?.(event));
      },
      onKeyDownCapture: (event) => {
        const ticket = triggerTicketFor(event.nativeEvent);
        observeUserFocus(ticket, () => tp.onKeyDownCapture?.(event));
      },
      onClick: (event) => {
        const nativeEvent = event.nativeEvent, ticket = triggerTicketFor(nativeEvent);
        observeUserFocus(ticket, () => tp.onClick?.(event));
        if (!event.defaultPrevented && validTicket(ticket) && ticket.valueRevision === authority.current.valueRevision && ticket.openRevision === authority.current.openRevision) microtask(() => {
          if (!validTicket(ticket) || resolvedValueRevision(ticket) !== authority.current.valueRevision || resolvedOpenRevision(ticket) !== authority.current.openRevision) return;
          openingSearch.current = "";
          openIntent.current = "selected";
          const previous = latest.current.actualOpen;
          acceptOpen(!previous, "trigger", nativeEvent, ticket, previous, previous);
        });
      },
      onKeyDown: (event) => {
        const ticket = triggerTicketFor(event.nativeEvent);
        observeUserFocus(ticket, () => tp.onKeyDown?.(event));
        onKeyDown(event, ticket);
      }
    },
    /* @__PURE__ */ React.createElement("span", { className: "wix-ss-value" }, selected?.label ?? placeholder),
    /* @__PURE__ */ React.createElement(Chevron, { className: "wix-ss-chevron" })
  )), /* @__PURE__ */ React.createElement(
    "select",
    {
      ref: native,
      className: "wix-ss-native",
      name: props.name,
      form: props.form,
      required: props.required,
      disabled,
      value: resolvedValue,
      tabIndex: -1,
      "aria-hidden": "true",
      style: { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", clipPath: "inset(50%)", whiteSpace: "nowrap", border: 0, opacity: 0, pointerEvents: "none" },
      onChange: () => syncBridge(),
      onInvalid: (event) => {
        event.preventDefault();
        if (!latest.current.props.disabled && !disabledByFieldset(trigger.current)) {
          setInvalid(true);
          ownedFocus(trigger.current);
        }
      }
    },
    /* @__PURE__ */ React.createElement("option", { value: "" }, placeholder),
    items.map((item, index) => isSeparator(item) ? null : isGroup(item) ? /* @__PURE__ */ React.createElement("optgroup", { key: `group-${index}`, label: item.label, disabled: item.disabled }, item.options.map((option) => /* @__PURE__ */ React.createElement("option", { key: option.value, value: option.value, disabled: option.disabled }, option.label))) : /* @__PURE__ */ React.createElement("option", { key: item.value, value: item.value, disabled: item.disabled }, item.label))
  ), helper ? /* @__PURE__ */ React.createElement("p", { id: helperId, className: "wix-ss-helper", role: "region", "aria-labelledby": labelId, "aria-live": "polite" }, helper) : null, invalidMessage ? /* @__PURE__ */ React.createElement("p", { id: errorId, className: "wix-ss-error", role: "alert" }, invalidMessage) : null, panel);
}
var Core = React.forwardRef(SelectStructure);
Core.displayName = "SelectStructureControl";
var Select22 = React.forwardRef((props, ref) => /* @__PURE__ */ React.createElement(Core, { ...props, disabled: props.disabled ?? false, required: props.required ?? false, variant: "select-22", ref }));
var Select23 = React.forwardRef((props, ref) => /* @__PURE__ */ React.createElement(Core, { ...props, disabled: props.disabled ?? false, required: props.required ?? false, variant: "select-23", ref }));
var Select24 = React.forwardRef((props, ref) => /* @__PURE__ */ React.createElement(Core, { ...props, disabled: props.disabled ?? false, required: props.required ?? false, variant: "select-24", ref }));
var Select25 = React.forwardRef((props, ref) => /* @__PURE__ */ React.createElement(Core, { ...props, disabled: props.disabled ?? false, required: props.required ?? false, variant: "select-25", ref }));
Select22.displayName = "Select22";
Select23.displayName = "Select23";
Select24.displayName = "Select24";
Select25.displayName = "Select25";
