# Wix multi-select · Select32 and Select33

`@studio/wix-multi-select` · Version `0.1.0-candidate.1` · React only.

Two genuine collection controls, adapted to the Wix Pantone 2025 Mocha palette. They retain the original button/popover interaction: toggling a choice changes membership while leaving the popup open. This is a named, nonmodal **dialog of real toggle buttons**, not a single-select control or an ARIA listbox.

## Consumption

```tsx
import * as React from 'react';
import { Select32, Select33 } from '@studio/wix-multi-select';
import '@studio/wix-multi-select/styles.css';

export function Example() {
  const [channels, setChannels] = React.useState<readonly string[]>([]);
  return <form>
    <Select32 name="services" />
    <Select33 name="channels" value={channels}
      onValueChange={next => setChannels(next)}
      required clearable showSelectedItems />
    <button type="submit">Continue</button>
    <button type="reset">Reset</button>
  </form>;
}
```

The ESM and CommonJS exports leave React and React DOM external. Peer range: React/React DOM `>=18.2.0 <20.0.0`. CSS is explicitly imported and fully scoped to `.wix-multi-select`. The package does not install Radix, icon, animation, ZIP, or styling dependencies. A forwarded ref points to the real trigger `HTMLButtonElement`; React ref cleanup is supported.

## Original identities and visible differences

Pinned source and support files are in `reference/src/`; `reference/IDENTITY.json` records exact source hashes and the original repository commit. `reference/CONTRACT.md` separates source behavior from adapter enhancements.

- **Select32:** `Active Pipeline Services`; initially `monitoring`. Real-time Monitoring, Log Aggregation, Security Analytics, Automated Backups. Empty: `Select operations`; one choice: its full label; multiple: `{n} operations active`.
- **Select33:** `Communication Channels`; initially empty. Primary Email, SMS Gateway, Mobile Push, Slack Webhook, Discord Bot. Empty: `Select notification paths`; one: full label; multiple: `{n} channels selected`. The source helper remains `System alerts will be delivered via all selected channels.` This is illustrative copy; this package does not configure or deliver notifications.

This is a documented Wix redesign, not a pixel-identical copy. The original 20rem envelope becomes a fluid maximum 23rem. The 32px trigger becomes a minimum 48px trigger; 36px option rows become minimum 44px rows. Checkmarks gain a Mocha badge. Select32 uses a leading bookplate rail, cut corner and ruled rows; Select33 uses an inset capsule frame, rounded options and pill chips. Cream/Mocha colors are intentionally light-only, with explicit forced-colors treatment. Original content, count summaries and persistent multiple-choice behavior are preserved. Optional chips, clear, public owners, form integration, full keyboard handling and cancellation are adapter additions; chips/clear are off by default.

## Collection and owner contract

`value`/`defaultValue` accept readonly arrays of unique, nonempty strings. Empty arrays are valid. Arrays must be dense; duplicate/non-string members are rejected. `options` is a dense flat array of `{ value: string; label: string; disabled?: boolean }`; values are globally unique and nonempty, labels are plain strings. Inherited or nonenumerable supported properties, including class getters, are read once into an immutable validated snapshot. Group, image, rich decoration and hybrid descriptors are rejected. Unknown enumerable descriptor fields are rejected rather than rendered.

`value` and `defaultValue` are mutually exclusive. `open` and `defaultOpen` are independently mutually exclusive. Each axis can be controlled or uncontrolled without controlling the other. Default values are captured at mount. Releasing an owner retains its latest committed state. Newer explicit owner decisions, mode changes, disable/readOnly, accepted reset and unmount take precedence over stale queued gestures.

Adding a value appends it; removing a value retains the order of all survivors. Callbacks receive frozen snapshots, not mutable internal arrays. Equal array contents/order do not create a new owner revision merely because the array object changed. Latent values absent from current options remain in state and callbacks, but are omitted from the summary, chips and form bridge until their option returns.

`onValueChange(next, detail)` reasons: `pointer`, `keyboard`, `clear`, `remove`.
`onOpenChange(next, detail)` reasons: `trigger`, `keyboard`, `escape`, `tab`, `outside-pointer`, `focus-out`.

Details expose `originalEvent`, `cancelable: true`, `defaultPrevented`, and synchronous proposal-local `preventDefault()`. Canceling a detail does not cancel the original DOM event. React/native event cancellation, including later ancestor/document/window handlers, is observed before queued proposals run. An owner may reject a proposal by keeping its value. Toggling never implicitly requests close. Multiple already-accepted intents run in order; an older gesture cannot override a newer explicit owner or focus decision.

## Keyboard and focus

- Trigger and choices are native `type="button"` elements. Enter/Space use native button activation; no synthetic second click is generated. Repeated activation is suppressed. IME/composition and keyCode 229 do not run custom navigation.
- Unmodified ArrowDown/ArrowUp, Home/End and printable label typeahead navigate enabled choices, without selecting. Repeated letters cycle matching labels; a 700ms gap starts a new search. Ctrl/Meta/Alt/Shift shortcuts are preserved, except the explicitly handled Shift+Tab direction.
- Opening focuses the first enabled choice, or the dialog itself when no enabled choices exist. Escape requests close; accepted close restores the trigger only while that gesture still owns focus.
- Tab/Shift+Tab visits real enabled option buttons. At an edge, accepted close moves relative to the trigger in ordinary light-DOM sequential order; Shift+Tab from the first choice returns to the trigger. Rejected/canceled close keeps focus. The popup is nonmodal and has no focus trap.
- Explicit focus from capture/bubble handlers, native listeners, and nested `onFocus` handlers wins over queued navigation or restoration. Dynamic replacement, removal or disabling repairs focus only while the popup still owns it.
- Portals use the trigger's owner document. Positioning aligns to trigger width, uses a 4px gap and clamps against viewport bounds with scrollable overflow. Geometry calculations are tested models; browser layout, mobile keyboards, assistive technology, Shadow DOM and browser-native tab behavior require separate real-browser acceptance.

The trigger has a real visible-label association, `aria-haspopup="dialog"`, expanded/controls state and described helper/error text. The popup is named and nonmodal. Choices expose `aria-pressed`; check SVGs are decorative. `dir` is forwarded to the field and popup. `motion="off"` and the reduced-motion media query suppress transitions; `motion="on"` does not override the user's reduced-motion preference.

## Optional clear and chips

`clearable` renders `Clear available selections`. It removes enabled known choices only and preserves disabled and latent selections; it is disabled when there are no editable choices. `showSelectedItems` renders full-label chips in option DOM order with individually named removal buttons. Disabled choices cannot be removed. These buttons are outside the trigger and never nested interactive content.

Clear/remove leave an open popup open. Removing a focused chip moves to the next enabled surviving remove button, then previous, then clear/trigger, only if no handler explicitly redirected focus. Rejection/cancellation preserves membership and focus. `disabled` and `readOnly` block all edits and opening.

## Native forms, validation and reset

A real visually hidden `select multiple` carries `name`, `form`, `required` and `disabled`. Repeated FormData fields follow **option DOM order**, while model/callback values follow insertion order. There is no empty placeholder option. The bridge contains plain text option labels, no decorative markup. `readOnly` preserves selected form values but suppresses required validation.

An effective required state adds an accessible `Required` description to the native button; it does not use the inapplicable button aria-required attribute. An empty required control focuses its visible trigger and shows a transient required message unless canceled. Removing required, disabling or making the control readonly clears only this transient message. Explicit `error` and `aria-invalid` remain caller-owned. Removing `name`/`form` alone does not remove a required constraint from the control.

An accepted reset restores the mount default for an uncontrolled owner without value callbacks. Controlled owners remain authoritative; update their state in the parent's reset handler when desired. Reset cancellation is respected after event propagation. Controls that mount, remount, acquire/release an owner or synchronously join/leave the form during reset are reconciled after native default action. Joining only after `form.reset()` has returned is a newer operation and does not retroactively join that reset. Accepted reset invalidates older gestures while retaining later legitimate operations.

Reset observation is installed at document capture. Form handlers and later capture/bubble propagation stops are covered. An earlier window-capture stop or earlier same-document stopImmediatePropagation can prevent this observer from seeing an event; no universal interception guarantee is made.

Disabled fieldsets, including temporary disabled→enabled round trips after an intent, revoke stale interactions. The first-legend exemption and unrelated fieldsets are respected. JSDOM's successful-field behavior for a selected disabled option differs from some browser expectations; tests bind DOM disabled flags and native model results, not a browser submission claim.

## Supported trigger props

`triggerProps` supports `title`, `tabIndex`, `autoFocus`, `onClick`, `onClickCapture`, `onKeyDown`, `onKeyDownCapture`, `onPointerDown`, `onPointerDownCapture`, `onFocus`, `onFocusCapture`, `onBlur`, `onBlurCapture`. Callbacks retain their native React event types. The forwarded component ref is the trigger ref.

Runtime forwarding uses this explicit support list. Extra keys carried by a wider structurally assignable TypeScript variable are ignored, including `role`, `aria-hidden`, `form`, `name`, `value`, `children` and `dangerouslySetInnerHTML`. Internal accessibility, form and structural semantics cannot be replaced through that escape hatch. Use top-level documented props for id/label/description/error/required/disabled/form/state.

## Real local example and verification

The **full source delivery**, not the npm-only tarball, contains `examples/PacketDesk.tsx`, `examples/palette-packet.ts`, `tests/` and `tools/verify.sh`. PacketDesk selects multiple packet sections and output formats and creates a real deterministic local ZIP with HTML, JSON, CSS, CSV and SVG members. Each selected section changes the actual member contents. Exact visible sources and inert HTML preview use the same native DOM selection order as the downloadable archive. URLs are revoked on replacement, reset and unmount. Nothing is uploaded or sent.

The pure helper validates dense palettes and selections, encodes real ZIP records and CRC32, and rejects unknown or duplicate FormData fields. Tests inspect actual owner-window Blob bytes, independent ZIP CRCs, exact preview/member identity, canceled submit/reset, operation ordering and URL cleanup. The component tests use true collection oracles, not single-select passing counts as a substitute.

Run the delivered verifier with `LOCAL_DEPENDENCIES` and `NODE_PATH` pointing to the existing local React toolchain. It does not install dependencies. Source/package behavior, strict types, module/SSR consumption, original identities and examples are separate evidence lanes. Passing source/JSDOM checks are bounded evidence; trusted real-browser/device/assistive-technology and formal acceptance remain unverified.

The `./styles.css` export includes a side-effect-only TypeScript declaration, so strict consumers with `noUncheckedSideEffectImports` do not need to add an ambient declaration for this package. A CSS-capable bundler remains necessary to load the stylesheet.
