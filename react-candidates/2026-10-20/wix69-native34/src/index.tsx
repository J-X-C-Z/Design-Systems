'use client';
// Adapted from Watermelon Platform select-34. See LICENSE and reference/SOURCE-IDENTITY.json.
import * as React from 'react';
import { flushSync } from 'react-dom';
import type { NativeMultipleOption, Select34Props } from './types.js';
export type * from './types.js';
export const wixNativeMultipleIds = Object.freeze(['select-34'] as const);

const initialOptions: readonly NativeMultipleOption[] = Object.freeze([
  { value: 'vegetarian', label: 'Vegetarian Options' },
  { value: 'vegan', label: 'Strictly Vegan' },
  { value: 'gluten-free', label: 'Gluten-Free Diet' },
  { value: 'halal', label: 'Halal Certified' },
  { value: 'kosher', label: 'Kosher Selection' },
  { value: 'dairy-free', label: 'Dairy-Free Items' },
].map(option => Object.freeze(option)));
const empty: readonly string[] = Object.freeze([]);
const sourceLabel = 'Dietary Preferences';
const sourceHelper = 'Hold Cmd/Ctrl to select multiple preferences.';

function ownData(object: object, key: PropertyKey, required: boolean): unknown {
  const descriptor = Object.getOwnPropertyDescriptor(object, key);
  if (!descriptor) {
    if (required || key in object) throw new TypeError(`${String(key)} must be an own data property.`);
    return undefined;
  }
  if (!('value' in descriptor)) throw new TypeError(`${String(key)} cannot be an accessor.`);
  return descriptor.value;
}
function snapshotArray<T>(input: unknown, label: string, read: (entry: unknown) => T): readonly T[] {
  if (!Array.isArray(input)) throw new TypeError(`${label} must be a dense array.`);
  const result: T[] = [];
  for (let index = 0; index < input.length; index++) result.push(read(ownData(input, index, true)));
  return Object.freeze(result);
}
function snapshotOptions(input: unknown): readonly NativeMultipleOption[] {
  const seen = new Set<string>();
  return snapshotArray(input, 'options', entry => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) throw new TypeError('Each option must be an object.');
    for (const key of ['options', 'children', 'selected']) if (key in entry) throw new TypeError(`Option ${key} is unsupported.`);
    const value = ownData(entry, 'value', true), label = ownData(entry, 'label', true), disabled = ownData(entry, 'disabled', false);
    if (typeof value !== 'string' || typeof label !== 'string' || (disabled !== undefined && typeof disabled !== 'boolean')) {
      throw new TypeError('Each option needs string value/label and optional boolean disabled.');
    }
    if (seen.has(value)) throw new TypeError('Option values must be unique.');
    seen.add(value);
    return Object.freeze(disabled === undefined ? { value, label } : { value, label, disabled });
  });
}
function snapshotValues(input: unknown, label: string): readonly string[] {
  const seen = new Set<string>();
  return snapshotArray(input, label, value => {
    if (typeof value !== 'string' || seen.has(value)) throw new TypeError(`${label} must contain unique strings.`);
    seen.add(value);
    return value;
  });
}
function restoreControlled(select: HTMLSelectElement, value: readonly string[]): void {
  // Native multiple selects have no fallback. Unknown values match nothing;
  // exact matches include programmatically selected disabled options.
  const selected = new Set(value);
  for (const option of Array.from(select.options)) {
    const next = selected.has(option.value);
    if (option.selected !== next) option.selected = next;
  }
}
const noChange: React.ChangeEventHandler<HTMLSelectElement> = () => {};

export const Select34 = React.forwardRef<HTMLSelectElement, Select34Props>(function Select34(props, forwardedRef) {
  for (const key of ['children', 'dangerouslySetInnerHTML', 'readOnly', 'role', 'open', 'defaultOpen', 'onOpenChange', 'onValueChange',
    'placeholder', 'aria-expanded', 'aria-haspopup', 'aria-controls', 'aria-multiselectable'] as const) {
    if (props[key] !== undefined) throw new TypeError(`${key} is not supported by this native multiple select.`);
  }
  const { options = initialOptions, label = sourceLabel, helper = sourceHelper, value, defaultValue, multiple, size,
    wrapperClassName, className, id, 'aria-describedby': externalDescription, 'aria-label': ariaLabel, ...native } = props;
  if (multiple !== undefined && multiple !== true) throw new TypeError('multiple must be true.');
  if (size !== undefined && (!Number.isInteger(size) || size < 2)) throw new TypeError('size must be an integer >= 2.');
  if (label !== null && typeof label !== 'string' || helper !== null && typeof helper !== 'string') throw new TypeError('label/helper must be strings or null.');
  if (value !== undefined && defaultValue !== undefined) throw new TypeError('value and defaultValue are mutually exclusive.');
  const optionSnapshot = snapshotOptions(options);
  const ownerSnapshot = value === undefined ? undefined : snapshotValues(value, 'value');
  const defaultSnapshot = defaultValue === undefined ? empty : snapshotValues(defaultValue, 'defaultValue');
  const generated = React.useId(), inputId = id ?? generated;
  const node = React.useRef<HTMLSelectElement>(null);
  // Commit snapshots only. An abandoned render cannot change reset ownership.
  const owner = React.useRef<readonly string[] | undefined>(ownerSnapshot);
  React.useImperativeHandle(forwardedRef, () => node.current!, []);
  React.useLayoutEffect(() => { owner.current = ownerSnapshot; });
  React.useLayoutEffect(() => {
    const input = node.current;
    if (!input) return;
    let active = true;
    function synchronize() {
      const form = input!.form;
      queueMicrotask(() => {
        const current = () => active && node.current === input && input!.isConnected && input!.form === form;
        if (!current()) return;
        flushSync(() => {});
        if (!current()) return;
        const committed = owner.current;
        if (committed !== undefined) restoreControlled(input!, committed);
      });
    }
    // A control may mount after document capture, inside a reset handler. Its
    // controlled selection must survive the later native default action too.
    // An uncontrolled control is never written by this queued check.
    synchronize();
    const reset = (event: Event) => { if (input.form && event.target === input.form) synchronize(); };
    // reset is not composed: a control inside a ShadowRoot must observe its
    // own tree, not ownerDocument. Keep this exact target for cleanup.
    const resetRoot = input.getRootNode();
    resetRoot.addEventListener('reset', reset, true);
    return () => { active = false; resetRoot.removeEventListener('reset', reset, true); };
  }, []);
  const hasLabel = label !== null && label.length > 0, hasHelper = helper !== null && helper.length > 0;
  const describedBy = [...new Set(`${externalDescription ?? ''} ${hasHelper ? generated + '-help' : ''}`.split(/\s+/).filter(Boolean))].join(' ') || undefined;
  return <div className={['wix-native-multiple', wrapperClassName].filter(Boolean).join(' ')} data-catalog-id="select-34" dir={native.dir}>
    {hasLabel && <label className="wix-nm-label" htmlFor={inputId}>{label}</label>}
    <select {...native} ref={node} id={inputId} multiple size={size}
      className={['wix-nm-select', className].filter(Boolean).join(' ')}
      value={ownerSnapshot} defaultValue={ownerSnapshot === undefined ? defaultSnapshot : undefined}
      onChange={native.onChange ?? noChange}
      aria-label={ariaLabel ?? (!hasLabel && !native['aria-labelledby'] ? sourceLabel : undefined)} aria-describedby={describedBy}>
      {optionSnapshot.map(option => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}
    </select>
    {hasHelper && <p className="wix-nm-helper" id={generated + '-help'}>{helper}</p>}
  </div>;
});
