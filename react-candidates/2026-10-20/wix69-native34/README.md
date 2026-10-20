# @studio/wix-native-multiple

Standalone candidate adaptation of Watermelon `select-34`: an always-visible **actual native `<select multiple>`**, not a popup, custom listbox, hidden form proxy, or replacement picker. Import CSS explicitly. React and React DOM remain peer dependencies; no Tailwind or UI primitive dependency is needed.

## Exact consumer example

```tsx
import * as React from 'react';
import { Select34 } from '@studio/wix-native-multiple';
import '@studio/wix-native-multiple/styles.css';

export function Preferences() {
  const [value, setValue] = React.useState<readonly string[]>([]);
  return <form onReset={() => setValue([])}>
    <Select34 name="preferences" value={value} onChange={event => {
      setValue(Array.from(event.currentTarget.selectedOptions, option => option.value));
    }} />
    <button type="reset">Reset preferences</button>
  </form>;
}
```

For uncontrolled native defaults, use `<Select34 name="preferences" defaultValue={['vegan']} />`. A forwarded ref points directly to `HTMLSelectElement`, not a wrapper. The executable local-only `examples/MealBrief.tsx` uses native validation and FormData to prepare a meal brief; it does not send or persist dietary preferences.

`examples/PaletteNativeSheet.tsx` also exports `PaletteNativeSheet({ colors?: readonly string[] })` for cumulative palette integration. It defaults to five cream/Mocha hex colors, accepts dense six-digit hex colors, shows a working selected-swatch preview, and prepares local CSS custom properties from actual native FormData. Its copy/options are explicitly custom; the original dietary specimen remains unchanged. Swatch selection refers to numbered slots. Changing normalized palette content (including reorder, replacements, shortening, empty content, or in-place mutation followed by rerender) immediately clears prepared CSS; restoring an earlier palette does not resurrect an old export. A same-content array or hex-case-only change preserves a still-current export. Controlled slot selections can remain latent when options disappear, so a restored slot may reappear in the preview, but it must be explicitly exported again. Import the example’s scoped CSS along with package CSS.

## Source fidelity

The no-props rendering keeps `Dietary Preferences`, initially no selected options, and these six ordered value/label pairs:

1. `vegetarian` / `Vegetarian Options`
2. `vegan` / `Strictly Vegan`
3. `gluten-free` / `Gluten-Free Diet`
4. `halal` / `Halal Certified`
5. `kosher` / `Kosher Selection`
6. `dairy-free` / `Dairy-Free Items`

Helper: `Hold Cmd/Ctrl to select multiple preferences.` The original uses native multiple selection; keyboard, pointer, Ctrl/Cmd toggling, Shift ranges, touch/OS affordances and scrolling remain browser-owned. No handler synthesizes selection, prevents keyboard defaults, or fires fabricated changes. Browser styling of options and selected rows varies. Scoped cream/Mocha CSS styles the real visible control, with native selection colors, visible focus, RTL-safe spacing, reduced-motion and forced-color rules.

## Public contract

- `value` and `defaultValue` are mutually exclusive readonly arrays of unique strings. Arrays must be dense, with own data indexes (not holes, inherited indexes or accessors). Values are snapshotted on every render. A caller mutation does not alter a committed owner; rerender to commit a new snapshot. Empty strings are supported as real native option values, not placeholder values.
- `value` is controlled. The browser reports changes through the normal `React.ChangeEvent<HTMLSelectElement>` in `onChange`. Read the whole collection using `selectedOptions`, not `.value` (which returns only the first selected option). The parent must commit the desired array. A handler may accept or reject the native proposal; `preventDefault()` on `change` is not a selection rollback API. A controlled component without an `onChange` callback retains its owner and does not expose a `readOnly` attribute.
- `defaultValue` is uncontrolled and used by React at mount only, with `[]` as the default. Later default prop changes do not change current selection or reset defaults. The native option `defaultSelected` flags define reset behavior. No component state mirrors uncontrolled selection.
- There is **no single-select fallback**. Missing controlled strings match nothing but remain latent: an option introduced by a later render can match. Missing uncontrolled defaults do not create latent selections when options are added; remount to establish a new default baseline. Selection and FormData order is option document order, not caller array order.
- `options` accepts only flat descriptors `{ value: string, label: string, disabled?: boolean }`. Own data `value` and `label` fields are required; inherited or getter fields are rejected without invoking the getters. Optional `disabled` must also be an own data field when present. Values are globally unique. Sparse arrays, groups/nesting, custom children and `selected` descriptors are rejected. Empty lists are valid. Snapshots copy/freeze the supported fields; caller objects are not frozen or mutated. Additional nonsemantic own fields are ignored.
- `multiple` is fixed true. Optional `size` is a native visible-row hint restricted to integers >= 2; omitting it keeps the native multiple default and the source's 8rem control height. `size` explicitly supplied allows native row-driven height. No popup props, `readOnly`, `role` override, custom children, placeholder, or `onValueChange` API exists.
- `name`, `form`, `required`, `disabled`, native events, `className` and `style` apply to the actual select. `wrapperClassName` styles the outer wrapper. `label` and `helper` are strings or null; null removes that element. Removing the label retains a source-label aria fallback unless an explicit accessible name is supplied. Helper IDs are merged/deduplicated with external `aria-describedby`.
- Native successful-control and validity rules apply: a named multiple select contributes one FormData entry per selected successful option; empty selection contributes no entries. Disabled controls/fieldset descendants are excluded and barred from constraint validation, subject to the native first-legend exception. Disabled option values may still be selected programmatically by a controlled owner; real browsers normally omit disabled options from successful form data. Do not infer browser submission conformance from JSDOM's disabled-option model.

## Reset and ownership boundaries

Uncontrolled controls rely entirely on the native form reset algorithm, including canceled resets. Reset never calls `onChange` or emits an invented selection event. Controlled owners are reasserted in a queued microtask after reset dispatch (including canceled dispatch), not synchronously before `form.reset()` returns. Update parent `value` in the form's `onReset` if a different controlled reset value is wanted. This deliberately makes the latest committed React owner authoritative instead of leaving the DOM at the browser's uncontrolled reset baseline.

Reset capture is bound to the actual non-composed tree root (Document or ShadowRoot), because native reset events inside a shadow tree do not reach ownerDocument. A mount-time queued check also handles controls first mounted or key-replaced inside reset handlers, even after tree-root capture. It performs no write when uncontrolled. Pending reconciliation uses the latest committed snapshot, and is revoked on unmount, detached node, or a changed associated form. Reassociated controls observe subsequent resets on their new form. Releasing control using `value={undefined}` leaves native selection alone; remount is the clearest way to change ownership mode. Reset can be canceled normally, but canceling a native event does not cancel a separate React owner update.

No browser API is globally patched. A third-party listener that stops reset propagation before the observed tree-root capture, or bypasses normal event dispatch, can prevent reset observation. Moving an already-mounted control between different tree roots by direct DOM manipulation is not supported; remount it in its new tree so the reset observer rebinds. Other direct DOM mutation, app CSS hiding the control, and custom event handlers overriding native behavior remain the caller's responsibility. Both local examples intentionally clear their React-owned selection/output in onReset even if another listener cancels the native reset event; canceling that event is not a veto of the separate example owner update.

## Build and verification

Use an existing toolchain; these scripts never install or copy dependencies:

```sh
LOCAL_DEPENDENCIES="$(pwd)/node_modules" bash tools/verify.sh
```

The unfiltered suite runs strict implementation/public-declaration type lanes (NodeNext and Bundler, with exact optional properties and independent negative-diagnostic audit), source fidelity/provenance, SSR, native JSDOM forms/validity/ownership/reset/remount/descriptor cases, an actual local example, deterministic tgz creation, and replay against the exact extracted package. Dedicated review regressions cover Document/open and closed ShadowRoot reset lifecycles and dynamic palette output invalidation; both production and development StrictMode runs are recorded separately. Failed reports are retained as timestamped evidence before a new report replaces the latest path. Package peer resolution uses symlinks only. `qa/verification.json` records final counts and scope.

The archive is npm-compatible deterministic gzip/tar with sorted files and normalized timestamps/ownership. It includes ESM/CJS, declarations, CSS and CSS types, source references, README and the original MIT notice. It is not published.

Verification is author-level local TypeScript + React + SSR + JSDOM evidence only. There is no claim of real-browser rendering, trusted pointer/keyboard input, Ctrl/Cmd/Shift OS behavior, screen-reader/mobile/AT or formal acceptance. No cumulative catalog counts are changed by this standalone package.

## Provenance and license

Exact original Git blob: `d37eae67bad8a28c5e217767111feb83ae377196`.
SHA-256: `9f7dcb51fd037bc182b6314debd8cb864240deb6a03b2324f45d553728fb3aa1`.
Pinned Watermelon revision: `424fe703d19b39e86bef90c4ba0a76ef8c1fb260`.
`reference/SOURCE-IDENTITY.json` records source and support hashes. Original sources and the MIT license are retained. Copyright (c) 2026 Watermelon Platform Contributors.

## Publication scope

This directory publishes exactly one catalog ID, `watermelon:components:select-34`. It is not the full cumulative Wix69 application or the earlier Wix68 22-ID select batch. The two local example sources are included; the multi-style cumulative preview is not. No real-browser or formal acceptance is claimed.

Component runtime/source, public types, CSS and example logic match the verified candidate.2. Only this README and the verifier’s historical receipt location are adapted for a portable source checkout. The compact red-fixture provenance receipt retains the failed candidate.1 input and fixture hashes without requiring expanded historical reports. Fresh checks still execute the entire unfiltered source and extracted-package matrices. Rebuilt tarball bytes differ from the private verification archive only because this README is portable.
