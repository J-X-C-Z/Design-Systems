# @studio/wix-select-availability · maintenance 0.1.0-candidate.3

Current package version: `0.1.0-candidate.3`. This independent Wix68 maintenance supersedes `0.1.0-candidate.2` for these existing IDs; it adds no coverage IDs. Earlier frozen source, packages and reports remain historical artifacts.

This version makes four bounded engine repairs while retaining the published props types, source content and CSS:

1. A control synchronously joining or leaving a form during an accepted reset follows the form association during that event's dispatch. Joining after `form.reset()` returns is a later operation and does not retroactively reset. Canceled reset and explicit controlled owners remain authoritative.
2. `triggerProps` is forwarded through its supported runtime key list: title, tabIndex, autoFocus and the already documented click/key/pointer/focus/blur capture/bubble callbacks. Wider structurally assignable TypeScript variables remain legal. Unsupported fields, including aria-hidden, form, name, value, children and dangerouslySetInnerHTML, are ignored. The component's forwarded trigger ref and internal accessibility/structural semantics remain intact.
3. Keyboard intent tickets observe explicit focus revisions. Only the exact focus target initiated by the component is exempt. A nested consumer onFocus redirect, including back to the trigger, revokes stale queued navigation; legitimate consecutive component navigation remains ordered.

4. Supported option, group and decoration fields are captured once per render into explicit descriptor snapshots. Legal inherited/nonenumerable fields are retained, and validation, selected summaries, popup content and the native form bridge share the same captured values. Unknown object fields are not used to override internal state or semantics.

## Complete minimal consumer

```tsx
import { Select18 } from '@studio/wix-select-availability';
import '@studio/wix-select-availability/styles.css';

export function MinimalConsumer() {
  return <form><Select18 name="choice" /><button type="submit">Continue</button></form>;
}
```

The CSS subpath includes a side-effect-only TypeScript declaration. Strict Bundler and NodeNext consumers with `noUncheckedSideEffectImports` need no ambient declaration for this import. A CSS-capable bundler still loads the actual stylesheet. This packaging repair changes neither the CSS bytes nor existing component declaration/type files.

Historical failure probes and repaired source/package verification are shipped with the full Wix68 source delivery. This README retains the component contract and prior maintenance notes below; those historical version references describe their original changes. Browser/device/assistive-technology and formal acceptance remain unverified.

---

# Dynamic group focus maintenance · 0.1.0-candidate.2

This separate current package supersedes 0.1.0-candidate.1 for select-18–21. It adds no catalog IDs and leaves the old frozen source/archive intact. Public API/types and CSS are byte-identical to that baseline.

A still-enabled option moved between group/flat parents previously lost focus when its DOM node was replaced while flattened values stayed unchanged. A separate old fallback also reclaimed explicit outside focus after the highlighted choice became unavailable. This maintenance records genuine detached option focus, restores only its enabled replacement while no newer focus destination exists, and makes dynamic invalid-highlight fallback respect external/trigger/body focus. Initial opening still performs normal initial focus. This includes each independent Select15 slot where present. Required-removal maintenance and earlier event/reset repairs remain preserved.

The sections below describe the original public API and retained prior maintenance. Current source/build/version bindings are recorded in reference/FOCUS-MAINTENANCE.json. Real-browser/AT/formal acceptance remains 0.

# @studio/wix-select-availability

Version 0.1.0-candidate.3. Four exact-source React custom popup controls, select18–21. Every visible field is a real button/combobox with owner-document portal and focusable listbox options. React/ReactDOM18.2–19 are peers; no Radix, icon library or other runtime dependency is installed. Import `@studio/wix-select-availability/styles.css` once.

This new package adapts the frozen Wix54 private engine in its own source; it does not import mutable workspace implementations or change any earlier package. It is an authored replacement for upstream primitives, not a claim of complete Radix equivalence.

## Exact original contracts

Pinned MIT sources: WatermelonCorp/watermelon-platform revision424fe703d19b39e86bef90c4ba0a76ef8c1fb260, src/data/contents/components/select/variant-{18,19,20,21}.tsx. Exact TSX and shared wrappers are retained under reference/.

### Select18

Label **UI Scaling Factor**; placeholder **Display scale**; first-mount value `100`. Borderless transparent shadowless trigger; medium label; four scale choices.

- `80` / Compact View (80%) (enabled)
- `100` / Standard Scale (100%) (enabled)
- `125` / Cozy Desktop (125%) (enabled)
- `150` / Accessible (150%) (enabled)

Git blob `658979ece3b2de549d7bc3481ef1cc2632d319e2`.

### Select19

Label **Transfer Protocol (Locked)**; placeholder **System protocol**; first-mount value `v2`. Entire original selector disabled, opacity-60 outer wrapper, cursor-not-allowed and muted shadowless trigger. Not readonly; normal focus/interaction/FormData omission must reflect disabled.

- `v1.1` / HTTP/1.1 Standard (enabled)
- `v2` / HTTP/2 Binary (enabled)
- `v3` / HTTP/3 QUIC (enabled)

Git blob `c4958480e1f0cb3321eef754334cbffd1053377c`.

### Select20

Label **Infrastructure Region**; placeholder **System instance**; first-mount value `use1`. Exactly two disabled options interspersed among enabled entries, with exact Full/Offline labels. Keyboard/typeahead must skip disabled options without hiding them.

- `use1` / US-East (N. Virginia) (enabled)
- `euw1` / EU-West (Ireland) — [Full] (disabled)
- `apse1` / AP-Southeast (Singapore) (enabled)
- `sae1` / SA-East (São Paulo) — [Offline] (disabled)

Git blob `e612e20b718ae8128970700397581add3640695e`.

### Select21

Label **Identity Verification**; placeholder **Identify your status**; first-mount value `verified`. Original root required=true plus separate decorative aria-hidden asterisk in visible label. Initial verified value means native valueMissing=false; empty owner/default exercises required contract. Example is not authentication or authorization.

- `unverified` / Unverified Guest (enabled)
- `verified` / Identity Confirmed (enabled)
- `privileged` / Privileged Access (enabled)
- `restricted` / Restricted Entry (enabled)

Git blob `3a3dfeee15a6d73d70c2da7e2073420c6de987e9`.

All four originals have flat options, one visible label, one trigger and one popup. None includes a helper, warning, leading icon or multiple independent child controls. Source text such as Full, Offline, Identity Confirmed or Locked is fixed demonstration content, not current availability, identity verification, networking or access control.

## Public API and explicit additions

The original examples are parameterless. Configurable value/open ownership, callbacks/cancellation, custom options/groups, labels/descriptions, refs, name/external form/reset, layout/motion and detailed validation handling are explicit adapter additions.

Exports: Select18, Select19, Select20, Select21 and frozen readonly wixSelectAvailabilityIds tuple. Every component forwards an HTMLButtonElement ref, including React19 callback-ref cleanup. No composite div/slot refs or aggregate state exist. Source and public declarations have matching strict NodeNext-compatible type imports.

```tsx
import { Select18, Select19, Select20, Select21 } from '@studio/wix-select-availability';
import '@studio/wix-select-availability/styles.css';
<Select18 name="scale" />
<Select19 name="protocol" />
<Select20 value={region} onValueChange={(value, detail) => {
  if (locked) detail.preventDefault();
  else setRegion(value);
}} />
<Select21 defaultValue="" name="status" />
```

### Original flags and overrides

Select19 defaults `disabled=true` when disabled is omitted. It cannot open or select, its real button and bridge are disabled, it is omitted from FormData, and it is excluded from required validity. This is genuine disabled behavior, not readonly. Explicit `disabled={false}` enables it as a documented adapter override; removing that override restores the original disabled default. Disabling revokes pending gestures; enabling does not revive them. Other variants default disabled=false.

Select21 defaults `required=true` when required is omitted. It keeps the source decorative aria-hidden asterisk, exposes aria-required and uses the native bridge for valueMissing validation. Its initial verified value satisfies the requirement. Explicit empty controlled/default values can fail required validation. Explicit `required={false}` removes the requirement and decorative marker as an adapter override; removing that override restores the original required default. Other variants default required=false. The source's required primitive flag and asterisk are preserved; the bridge implementation and explicit name/form API are added, not claimed as source-authored native behavior.

Select20's euw1 and sae1 choices remain visible and disabled by default. Their exact labels retain punctuation and São. Navigation, typeahead and selection skip blocked choices. Custom options can deliberately change this policy; that is an adapter configuration, not inferred service availability. Select18 retains a transparent, borderless, shadowless idle trigger and remains keyboard focus-visible. Its selection does not automatically zoom the host application.

### Each individual control

`SelectAvailabilityProps` is the shared control contract, used by all four variants:

- `value: string` and `defaultValue?: string` are mutually exclusive. An omitted value is uncontrolled. Defaults are captured at first mount; later defaultValue changes do not redefine reset behavior.
- `open: boolean` and `defaultOpen?: boolean` are independently mutually exclusive. External owner changes do not emit callbacks. Releasing control retains the last committed controlled value/open state. Acquiring or releasing control advances the relevant owner authority.
- `onValueChange(value, detail)` and `onOpenChange(open, detail)` propose changes. Returning a boolean has no effect. A controlled owner must update its props to accept; an uncanceled uncontrolled proposal updates locally.
- `options?: readonly (SelectOption | SelectGroup)[]`: options have a nonempty unique string `value`, string `label`, optional `disabled`; groups have a string `label`, flat readonly `options`, optional `disabled`. Types reject hybrids and nested groups. Empty option values are reserved for the placeholder. Invalid/duplicate values throw. Options are evaluated every render, including disabled/group changes.
- `label`, `placeholder`, `helper`, `error`: string overrides. No helper appears by default. A nonempty helper uses a named `role=region` with `aria-live=polite`; empty helper suppresses it. Error uses `role=alert` and a trigger description association.
- `disabled`, `readOnly`, `required`, `name`, `form`: the added form/interaction contract below. No default form names or required flags are invented.
- `id`, `dir: 'ltr' | 'rtl'`, `motion: 'system' | 'on' | 'off'`, root `className`, root `style`. Motion defaults to system; off disables transitions; reduced-motion preferences override all modes. No animation loops or smooth scrolling.
- `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-invalid` apply to the trigger; listbox naming follows trigger naming overrides. Explicit `aria-invalid` is consumer-owned, even when false and an error is present. The default visible label stays visible for all four variants. Required state exposes aria-required and a decorative label marker.
- `triggerProps` only accepts title, tabIndex, autoFocus, onClick/onClickCapture, onKeyDown/onKeyDownCapture, onPointerDown/onPointerDownCapture, onFocus/onFocusCapture, onBlur/onBlurCapture. Structural/selection/native-form props, ref, children, dangerous HTML, raw onChange, arbitrary native-select props and arbitrary event props are unsupported. No rest-props bag is silently forwarded.

A selected value removed from options is retained logically but shows the placeholder and gives the native bridge value `''`. Restoring the option restores its selection without a callback. A selected disabled option remains displayed; browser native successful-control rules omit that disabled option from FormData. Disabled options/groups cannot be highlighted or committed.

## Proposals, cancellation, and ordering

Value reasons: `pointer`, `keyboard`. Open reasons: `trigger`, `keyboard`, `selection`, `escape`, `tab`, `outside-pointer`, `focus-out`.

Each detail exposes `reason`, the underlying native `originalEvent`, `cancelable: true`, `defaultPrevented`, and `preventDefault()`. Call detail.preventDefault synchronously inside its callback to cancel that proposal. Callback delivery is deferred to a microtask after the initiating DOM event finishes propagation; the callback itself and its cancellation decision are synchronous. Event currentTarget is therefore no longer retained. Do not defer cancellation until a promise/timer.

The engine captures owner revisions, reset ordering, and mount/interaction lifetime before user callbacks, including the supported trigger capture/bubble handlers. It rechecks before delivering a proposal and again after its callback. A newer explicit relevant controlled owner, acquiring/releasing control, disabling, or unmounting prevents an old interaction from overwriting newer authority. Internal highlighting, resize/scroll measurements, or unrelated portal DOM mutations do not revoke accepted interactions. Accepted native reset invalidates older queued interactions even when reset returns to the same value. Interactions initiated after that reset remain eligible.

Own `detail.preventDefault()` cancels that proposal only. A canceled value proposal does not request selection-close. A canceled close proposal permits an already accepted value but leaves uncontrolled open state unchanged. Native or React `preventDefault()` from the initiating event's trigger handlers or bubbling ancestors prevents proposal delivery as well as local changes. `stopPropagation()` alone is not cancellation. The component prevents native keyboard scrolling/default button activation without treating its own prevention as consumer cancellation; it temporarily wraps only that keydown event instance's preventDefault method through the proposal microtask. Pointer and focus proposals read native defaultPrevented without replacing event methods, including when independently bundled controls observe the same outside event. Normal extensible browser events are supported. Nonextensible/custom events or bypassing the method with Event.prototype.preventDefault.call are outside that late-cancellation guarantee. Consumers can always use detail.preventDefault.

Close focus restoration is part of an accepted close ticket, never an unconditional open-state effect. Deferred value/open callbacks and accepted local open/reset transitions use ReactDOM.flushSync, intentionally making ordinary owner setState acceptance observable within each transaction. Multiple queued selections are processed FIFO: only an exact controlled value/open acceptance within its callback advances later queued gestures to that accepted owner revision. Keyboard navigation, typeahead, activation, and trigger toggles also run FIFO and read the current accepted highlight rather than a stale render closure. Arbitrary owner writes, cancellation, and acquiring/releasing control never receive that exception. Before each deferred proposal is checked, pending React owner updates are flushed as well, so an ordinary ancestor setState cannot be overwritten by the older queued gesture. This can flush other pending React updates. A controlled owner that leaves open=true (including a batched false→true update) has not accepted closure: no restoration ticket survives. A later asynchronous/external owner close does not automatically restore focus. Async owners must arrange their own focus policy. An explicit focus move outside the component from a supported trigger/value/open callback is preserved; the engine does not replace it with automatic restoration or Tab movement. Canceling the close does not restore focus, including when its callback synchronously closes a controlled parent. External owner writes are authoritative and cannot be undone by cancellation; if the owner explicitly opens a popup, its normal opening focus behavior still applies. Mounting, owner updates, form reset, disabled transitions, native bridge synchronization, and same-value reselection do not emit value callbacks. Reset/disabled transitions do not emit open callbacks.

A supplied helper is a polite named region associated with the visible field label, separate from transient validation error.

## Focus, keyboard, and portal

Focus actually moves to the highlighted enabled option; highlighting and selection are separate. Open focuses the selected enabled option, otherwise the first enabled option. ArrowUp opening starts at the last enabled option. Arrow keys wrap, Home/End move to the first/last, and buffered 700ms case-insensitive prefix typeahead skips disabled options. Repeated single letters cycle matches. Enter/Space commit the highlight. Queued popup keyboard actions require focus to remain in this instance's trigger or popup at execution; an ancestor capture/bubble handler or native listener moving focus outside takes priority. Earlier accepted keyboard actions may move focus to another option without invalidating later queued keys. Modifier chords and IME/composition input (including keyCode 229) are ignored. Auto-repeat Enter/Space/Escape/Tab is ignored and default-suppressed; repeated directional keys continue navigation. Empty/all-disabled lists focus their named listbox and cannot commit.

Escape and accepted selection close and restore the visible trigger. Outside pointer/focus dismissal does not steal focus. Tab closes and moves to the next ordinary document tabbable relative to the trigger; Shift+Tab moves backward. Cancellation prevents both changes. Positive tabindex ordering is respected. Hidden/inert ancestors, display:none/hidden visibility, closed dialogs and the non-summary content of closed details are skipped. Named radio groups contribute only the eligible checked radio (or the direction-appropriate first/last radio when none is checked). At a document tab boundary it returns focus to the trigger; a subsequent Tab while closed follows the browser's normal boundary behavior. Shadow-tree traversal, browser-specific edge cases in sequential navigation, and browser-chrome focus transfer are not claimed as platform-equivalent.

Each instance uses React useId for SSR/hydration-stable IDs. Explicit id overrides must be unique; multi-root SSR must use matching unique React identifierPrefix values. Option IDs derive from values and remain stable under reordering. Server render does not read browser globals or create a portal. The portal is created after mount in the trigger's own ownerDocument.body, not necessarily the global document. RTL direction is inherited or explicit. A fixed-position popup uses a 4px offset, horizontal viewport clamping, vertical flip/collision adjustment, and bounded scrollable listbox height. Owner-window resize, visual-viewport change, captured scroll, and ResizeObserver schedule measurements. Scroll buttons appear only where overflow remains; scrolling is immediate. Listeners, observers, animation frames, and instance lifetime are cleaned up on close/unmount. The typeahead buffer uses timestamps, not timers.

## Native form integration: explicit implementation

Source19 disabled and source21 required flags are preserved. The original examples supply no name/external form API and do not establish all lifecycle guarantees below. This package adds the clipped native bridge and the documented form contract; it is not proof of upstream Radix implementation parity.

A visually clipped, aria-hidden, tabindex=-1 native select carries the current resolved value. It is never display:none. `name` contributes exactly one successful FormData entry; omitting name contributes none. `form` associates it with an external form by native form-owner rules. Root disabled and ancestor disabled fieldsets omit the value and prevent interaction. The native first-legend exemption is respected, including nested fieldsets. An affecting ancestor fieldset's observed disabled→enabled roundtrip after a gesture also revokes that queued interaction; mutation records are drained before creating and checking tickets so a completed roundtrip before a fresh gesture does not revoke it. Unrelated fieldsets and exempt first-legend ancestors do not revoke tickets. Readonly prevents interactions while retaining form submission and required validation.

`required` uses native constraint validation. The bridge invalid event is canceled to prevent a hidden-control browser focus failure; the visible trigger receives focus and an associated “Please select an option.” error. User-supplied error text overrides this text. The transient required-validation invalid state clears on a valid accepted selection, a valid owner/options update, disabling, or an accepted reset. Browser validation UX should still be tested in the intended browser; the bridge is not a claim of assistive-technology certification.

Reset is observed at ownerDocument capture, before form/React capture handlers can stop propagation. The final event.defaultPrevented is checked after propagation. Canceled reset does not reset custom state or invalidate queued proposals. Accepted reset restores the captured first-mount uncontrolled default; controlled reset reconciles to the latest owner, including owner changes, same-value resets, acquiring/releasing control, and key replacement during onReset. Native defaultSelected flags are kept aligned with the latest controlled owner or captured uncontrolled default, so a component first-mounted during onReset is not reverted by the native reset default action. Reset emits no business callbacks. An uncontrolled popup is closed by reset; controlled open remains owner-controlled.

A document/window capture listener that runs earlier and stops the reset before this observer can hide the event; this is an explicit observation limit. First-mount/reset reconciliation still uses the native defaultSelected baseline. A reset is scoped to the captured form owner; reassociating the bridge to another form during onReset prevents the old form reset from applying. An instance first mounted/key-replaced after reset capture keeps its initial/latest owner transitions, including releasing control, and reconciles its native bridge after the native default action; it cannot retroactively observe that earlier capture. Reset reconciliation settles in microtasks, so read FormData after those settle when resetting and synchronously remounting/reassociating controls. Triggering synthetic reset events without the native reset default action is not a substitute for testing form.reset(). Directly editing the hidden select is not a supported selection API; its changes are reconciled without business callbacks.

## DOM/style contract and verification limits

Package roots/portals use .wix-select-availability; internal classes .wix-sa-*; generated IDs wix-sa-. Every root and its portal have the canonical data-component and matching data-variant. One component is one control. Shared label/trigger/value/chevron/helper/error/required/native/listbox/group/option/check/scroll-up/scroll-down hooks retain their obvious roles. No obsolete composition slot, warning or desktop icon is rendered.

Wix styling has four distinct recipes: a transparent borderless scale control; a muted dashed enclosure and fixed-edge disabled protocol; a directory-like region control with interspersed blocked entries; a required stamped label and reinforced lower edge. These preserve original behavioral/structural differences while adapting to the Pantone2025 Mocha palette. Theme geometry is declared CSS, not measured source-pixel equivalence. Forced colors, reduced motion and logical RTL properties are provided.

The engine implements custom popup semantics without claiming exhaustive Radix/browser/AT parity. JSDOM cannot prove real popup geometry, trusted keyboard/Tab, zoom/mobile/touch, font rendering, native validation UX, assistive-technology timing or OS downloads. Formal and browser acceptance remain0. No source label grants privileges, authenticates anyone, changes network protocol, queries a region or imposes application zoom.

## Full-source examples and verification

The complete source deliverable contains examples/, tests/ and tools/; `bash tools/verify.sh` uses only the existing LOCAL_DEPENDENCIES toolchain and does not install anything. Both verification launchers explicitly expose that same existing dependency path through NODE_PATH so an extracted full-source tree can resolve retained legacy peers during coexistence tests. Source-only examples/helpers are not extra npm exports.

The npm archive contains dist, src including declarations/CSS, reference, README and LICENSE. The read-only proposal is source provenance, not runtime or formal acceptance. This README defines the implemented contract and the completed reports identify their bounded source/package/page evidence separately.

Validation maintenance: removing `required` clears only the internal native-invalid message, while explicit `error` and `aria-invalid` remain authoritative. Validation events do not mutate selection. Canceling native invalid prevents the browser default validation UI; the custom bridge still reports its own required state and targets its visible trigger. Canceled reset preserves the existing value and internal validation state unless a newer explicit prop change supersedes it.

Model boundary: JSDOM FormData may include selected disabled options (both individual options and options inside disabled optgroups). DOM disabled flags and native differential checks are verified here; browser successful-control behavior is not claimed as tested.
