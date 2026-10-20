"use client";

// src/index.tsx
import * as React from "react";
import { flushSync } from "react-dom";
var wixNativeMultipleIds = Object.freeze(["select-34"]);
var initialOptions = Object.freeze([
  { value: "vegetarian", label: "Vegetarian Options" },
  { value: "vegan", label: "Strictly Vegan" },
  { value: "gluten-free", label: "Gluten-Free Diet" },
  { value: "halal", label: "Halal Certified" },
  { value: "kosher", label: "Kosher Selection" },
  { value: "dairy-free", label: "Dairy-Free Items" }
].map((option) => Object.freeze(option)));
var empty = Object.freeze([]);
var sourceLabel = "Dietary Preferences";
var sourceHelper = "Hold Cmd/Ctrl to select multiple preferences.";
function ownData(object, key, required) {
  const descriptor = Object.getOwnPropertyDescriptor(object, key);
  if (!descriptor) {
    if (required || key in object) throw new TypeError(`${String(key)} must be an own data property.`);
    return void 0;
  }
  if (!("value" in descriptor)) throw new TypeError(`${String(key)} cannot be an accessor.`);
  return descriptor.value;
}
function snapshotArray(input, label, read) {
  if (!Array.isArray(input)) throw new TypeError(`${label} must be a dense array.`);
  const result = [];
  for (let index = 0; index < input.length; index++) result.push(read(ownData(input, index, true)));
  return Object.freeze(result);
}
function snapshotOptions(input) {
  const seen = /* @__PURE__ */ new Set();
  return snapshotArray(input, "options", (entry) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) throw new TypeError("Each option must be an object.");
    for (const key of ["options", "children", "selected"]) if (key in entry) throw new TypeError(`Option ${key} is unsupported.`);
    const value = ownData(entry, "value", true), label = ownData(entry, "label", true), disabled = ownData(entry, "disabled", false);
    if (typeof value !== "string" || typeof label !== "string" || disabled !== void 0 && typeof disabled !== "boolean") {
      throw new TypeError("Each option needs string value/label and optional boolean disabled.");
    }
    if (seen.has(value)) throw new TypeError("Option values must be unique.");
    seen.add(value);
    return Object.freeze(disabled === void 0 ? { value, label } : { value, label, disabled });
  });
}
function snapshotValues(input, label) {
  const seen = /* @__PURE__ */ new Set();
  return snapshotArray(input, label, (value) => {
    if (typeof value !== "string" || seen.has(value)) throw new TypeError(`${label} must contain unique strings.`);
    seen.add(value);
    return value;
  });
}
function restoreControlled(select, value) {
  const selected = new Set(value);
  for (const option of Array.from(select.options)) {
    const next = selected.has(option.value);
    if (option.selected !== next) option.selected = next;
  }
}
var noChange = () => {
};
var Select34 = React.forwardRef(function Select342(props, forwardedRef) {
  for (const key of [
    "children",
    "dangerouslySetInnerHTML",
    "readOnly",
    "role",
    "open",
    "defaultOpen",
    "onOpenChange",
    "onValueChange",
    "placeholder",
    "aria-expanded",
    "aria-haspopup",
    "aria-controls",
    "aria-multiselectable"
  ]) {
    if (props[key] !== void 0) throw new TypeError(`${key} is not supported by this native multiple select.`);
  }
  const {
    options = initialOptions,
    label = sourceLabel,
    helper = sourceHelper,
    value,
    defaultValue,
    multiple,
    size,
    wrapperClassName,
    className,
    id,
    "aria-describedby": externalDescription,
    "aria-label": ariaLabel,
    ...native
  } = props;
  if (multiple !== void 0 && multiple !== true) throw new TypeError("multiple must be true.");
  if (size !== void 0 && (!Number.isInteger(size) || size < 2)) throw new TypeError("size must be an integer >= 2.");
  if (label !== null && typeof label !== "string" || helper !== null && typeof helper !== "string") throw new TypeError("label/helper must be strings or null.");
  if (value !== void 0 && defaultValue !== void 0) throw new TypeError("value and defaultValue are mutually exclusive.");
  const optionSnapshot = snapshotOptions(options);
  const ownerSnapshot = value === void 0 ? void 0 : snapshotValues(value, "value");
  const defaultSnapshot = defaultValue === void 0 ? empty : snapshotValues(defaultValue, "defaultValue");
  const generated = React.useId(), inputId = id ?? generated;
  const node = React.useRef(null);
  const owner = React.useRef(ownerSnapshot);
  React.useImperativeHandle(forwardedRef, () => node.current, []);
  React.useLayoutEffect(() => {
    owner.current = ownerSnapshot;
  });
  React.useLayoutEffect(() => {
    const input = node.current;
    if (!input) return;
    let active = true;
    function synchronize() {
      const form = input.form;
      queueMicrotask(() => {
        const current = () => active && node.current === input && input.isConnected && input.form === form;
        if (!current()) return;
        flushSync(() => {
        });
        if (!current()) return;
        const committed = owner.current;
        if (committed !== void 0) restoreControlled(input, committed);
      });
    }
    synchronize();
    const reset = (event) => {
      if (input.form && event.target === input.form) synchronize();
    };
    const resetRoot = input.getRootNode();
    resetRoot.addEventListener("reset", reset, true);
    return () => {
      active = false;
      resetRoot.removeEventListener("reset", reset, true);
    };
  }, []);
  const hasLabel = label !== null && label.length > 0, hasHelper = helper !== null && helper.length > 0;
  const describedBy = [...new Set(`${externalDescription ?? ""} ${hasHelper ? generated + "-help" : ""}`.split(/\s+/).filter(Boolean))].join(" ") || void 0;
  return /* @__PURE__ */ React.createElement("div", { className: ["wix-native-multiple", wrapperClassName].filter(Boolean).join(" "), "data-catalog-id": "select-34", dir: native.dir }, hasLabel && /* @__PURE__ */ React.createElement("label", { className: "wix-nm-label", htmlFor: inputId }, label), /* @__PURE__ */ React.createElement(
    "select",
    {
      ...native,
      ref: node,
      id: inputId,
      multiple: true,
      size,
      className: ["wix-nm-select", className].filter(Boolean).join(" "),
      value: ownerSnapshot,
      defaultValue: ownerSnapshot === void 0 ? defaultSnapshot : void 0,
      onChange: native.onChange ?? noChange,
      "aria-label": ariaLabel ?? (!hasLabel && !native["aria-labelledby"] ? sourceLabel : void 0),
      "aria-describedby": describedBy
    },
    optionSnapshot.map((option) => /* @__PURE__ */ React.createElement("option", { key: option.value, value: option.value, disabled: option.disabled }, option.label))
  ), hasHelper && /* @__PURE__ */ React.createElement("p", { className: "wix-nm-helper", id: generated + "-help" }, helper));
});
export {
  Select34,
  wixNativeMultipleIds
};
