# @studio/wix-select-menu · maintenance 0.1.0-candidate.4

Current package version: `0.1.0-candidate.4`. This independent Wix68 maintenance supersedes `0.1.0-candidate.3` for these existing IDs; it adds no coverage IDs. Earlier frozen source, packages and reports remain historical artifacts.

This version makes four bounded engine repairs while retaining the published props types, source content and CSS:

1. A control synchronously joining or leaving a form during an accepted reset follows the form association during that event's dispatch. Joining after `form.reset()` returns is a later operation and does not retroactively reset. Canceled reset and explicit controlled owners remain authoritative.
2. `triggerProps` is forwarded through its supported runtime key list: title, tabIndex, autoFocus and the already documented click/key/pointer/focus/blur capture/bubble callbacks. Wider structurally assignable TypeScript variables remain legal. Unsupported fields, including aria-hidden, form, name, value, children and dangerouslySetInnerHTML, are ignored. The component's forwarded trigger ref and internal accessibility/structural semantics remain intact.
3. Keyboard intent tickets observe explicit focus revisions. Only the exact focus target initiated by the component is exempt. A nested consumer onFocus redirect, including back to the trigger, revokes stale queued navigation; legitimate consecutive component navigation remains ordered.

4. Supported option, group and decoration fields are captured once per render into explicit descriptor snapshots. Legal inherited/nonenumerable fields are retained, and validation, selected summaries, popup content and the native form bridge share the same captured values. Unknown object fields are not used to override internal state or semantics.

## Complete minimal consumer

```tsx
import { Select10 } from '@studio/wix-select-menu';
import '@studio/wix-select-menu/styles.css';

export function MinimalConsumer() {
  return <form><Select10 name="choice" /><button type="submit">Continue</button></form>;
}
```

The CSS subpath includes a side-effect-only TypeScript declaration. Strict Bundler and NodeNext consumers with `noUncheckedSideEffectImports` need no ambient declaration for this import. A CSS-capable bundler still loads the actual stylesheet. This packaging repair changes neither the CSS bytes nor existing component declaration/type files.

Historical failure probes and repaired source/package verification are shipped with the full Wix68 source delivery. This README retains the component contract and prior maintenance notes below; those historical version references describe their original changes. Browser/device/assistive-technology and formal acceptance remain unverified.

---

# Dynamic group focus maintenance · 0.1.0-candidate.3

This separate current package supersedes 0.1.0-candidate.2 for select-10–13. It adds no catalog IDs and leaves the old frozen source/archive intact. Public API/types and CSS are byte-identical to that baseline.

A still-enabled option moved between group/flat parents previously lost focus when its DOM node was replaced while flattened values stayed unchanged. A separate old fallback also reclaimed explicit outside focus after the highlighted choice became unavailable. This maintenance records genuine detached option focus, restores only its enabled replacement while no newer focus destination exists, and makes dynamic invalid-highlight fallback respect external/trigger/body focus. Initial opening still performs normal initial focus. This includes each independent Select15 slot where present. Required-removal maintenance and earlier event/reset repairs remain preserved.

The sections below describe the original public API and retained prior maintenance. Current source/build/version bindings are recorded in reference/FOCUS-MAINTENANCE.json. Real-browser/AT/formal acceptance remains 0.

# Maintenance candidate 2: required-state repair

This independent maintenance copy repairs a transient validation-state defect in candidate 1: after an empty required field has emitted a native invalid event, removing `required` now clears its internally generated error and `aria-invalid`. Explicit `error` and `aria-invalid` remain caller-owned. The original frozen package and historical audit remain preserved; this does not add component IDs. This full-source repair directory contains its own tests and tools; those development paths are not included in the npm-only archive.

# @studio/wix-select-menu

Version 0.1.0-candidate.4. Four real custom React popup selects adapted from the Watermelon Platform select-10–13 sources. React and ReactDOM are peers (18.2 through 19); the package has no Radix, icon-library, utility-CSS, or other runtime dependency. Import `@studio/wix-select-menu/styles.css` once. The visible control is a button/combobox, and the options are a portaled listbox. The clipped native select exists solely for form integration; it is not a visible replacement.

## Original identities and preserved content

All sources are from WatermelonCorp/watermelon-platform revision `424fe703d19b39e86bef90c4ba0a76ef8c1fb260`, under `src/data/contents/components/select/variant-{10,11,12,13}.tsx`.

| Export | Label | Initial value | Placeholder | Distinction | Exact Git blob |
| --- | --- | --- | --- | --- | --- |
| Select10 | Favorite Fruit | apple | Select a fruit | Available Fruits group | 50473b5abfbfc512b1547fbf5525678fb262e11f |
| Select11 | Primary Specialization | empty | Identify your core skill | Engineering Roles group | 9ba74c8e5302671c394f630dfd511e3edf1f6dd6 |
| Select12 | Deployment Target | web | Identify platform | Persistent decorative desktop icon | 034aba8afaabbbe9f0a97d99e91c33d23a924ff2 |
| Select13 | Release Method | rolling | Choose a strategy | Static polite helper | 0217a485f6c4d67b40612076e86f93aa6e8c3dce |

Select10 values/labels: apple/Apple; banana/Banana; blueberry/Blueberry; grapes/Grapes; pineapple/Pineapple.
Select11: frontend/Frontend Development; backend/Backend Systems; fullstack/Full-Stack Engineering; devops/SRE & DevOps; security/Cyber Security.
Select12: web/Web Application; mobile/Native Mobile; desktop/System Desktop; cloud/Cloud Infrastructure.
Select13: rolling/Rolling Update; canary/Canary Deployment; blue-green/Blue-Green Switch; recreate/Full Recreate.

The Select13 helper is exactly “Pods will be cycled according to this deployment pattern.” with role=region and aria-live=polite. Its explicit aria-describedby association is an accessibility correction beyond the source. Original MIT attribution is retained in LICENSE.

## Public API

```tsx
import { Select10, Select11, Select12, Select13, wixSelectMenuIds } from '@studio/wix-select-menu';
import '@studio/wix-select-menu/styles.css';

<Select10 name="fruit" required defaultValue="apple" />
<Select11 value={specialization} onValueChange={(next, detail) => {
  if (!canChange) detail.preventDefault();
  else setSpecialization(next);
}} />
```

All four exports forward an HTMLButtonElement ref, including React's ref lifecycle handling. `wixSelectMenuIds` is a frozen readonly tuple in source order. Source and published declarations export the full strict types.

- `value: string` and `defaultValue?: string` are mutually exclusive. An omitted value is uncontrolled. Default values are captured at first mount; subsequent defaultValue changes do not redefine reset behavior.
- `open: boolean` and `defaultOpen?: boolean` are independently mutually exclusive. External owner changes do not emit callbacks. Releasing control retains the last committed controlled value/open state. Acquiring or releasing control advances the relevant owner authority.
- `onValueChange(value, detail)` and `onOpenChange(open, detail)` propose a change. Returning a boolean has no effect. The owner must update controlled props to accept controlled proposals. Uncontrolled proposals update locally unless canceled.
- `options?: readonly (SelectOption | SelectGroup)[]`: an option has a nonempty unique string `value`, string `label`, and optional `disabled`; a group has a string `label`, flat readonly `options`, and optional `disabled`. Types reject hybrid option/group objects and nested groups. Empty values are reserved for the placeholder. Invalid/duplicate values throw a useful error. Options are evaluated every render, including dynamic disabled/group changes.
- `label`, `placeholder`, `helper`, `error`: string overrides. An empty helper string suppresses the helper. Error text is associated with the trigger and uses role=alert. `aria-invalid` may also be set explicitly.
- `disabled`, `readOnly`, `required`, `name`, `form`: form/interaction additions described below.
- `id`, `dir: 'ltr' | 'rtl'`, `motion: 'system' | 'on' | 'off'`, root `className` and root `style`. Motion defaults to system; off disables transitions. Reduced-motion media preferences override all modes. There are no animation loops or smooth scrolling.
- `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-invalid` apply to the visible trigger; listbox naming follows the trigger naming override. An authored label remains visible. Required controls expose aria-required and a decorative marker.
- `triggerProps` intentionally accepts only title, tabIndex, autoFocus, onClick/onClickCapture, onKeyDown/onKeyDownCapture, onPointerDown/onPointerDownCapture, onFocus/onFocusCapture, and onBlur/onBlurCapture. Structural props, raw onChange, children, dangerous HTML, arbitrary native-select props, and arbitrary event props are not part of the API. No rest-props bag is silently forwarded.

A selected value removed from options is retained logically, but displays the placeholder and has native bridge value `''`. Restoring that option restores its selection without a callback. A selected disabled option remains displayed, and the browser's native successful-control rules omit that disabled option from FormData. Disabled options/groups cannot be highlighted or committed by the engine.

## Proposals, cancellation, and ordering

Value reasons: `pointer`, `keyboard`. Open reasons: `trigger`, `keyboard`, `selection`, `escape`, `tab`, `outside-pointer`, `focus-out`.

Each detail exposes `reason`, the underlying native `originalEvent`, `cancelable: true`, `defaultPrevented`, and `preventDefault()`. Call detail.preventDefault synchronously inside its callback to cancel that proposal. Callback delivery is deferred to a microtask after the initiating DOM event finishes propagation; the callback itself and its cancellation decision are synchronous. Event currentTarget is therefore no longer retained. Do not defer cancellation until a promise/timer.

The engine captures owner revisions, reset ordering, and mount/interaction lifetime before user callbacks, including the supported trigger capture/bubble handlers. It rechecks before delivering a proposal and again after its callback. A newer explicit relevant controlled owner, acquiring/releasing control, disabling, or unmounting prevents an old interaction from overwriting newer authority. Internal highlighting, resize/scroll measurements, or unrelated portal DOM mutations do not revoke accepted interactions. Accepted native reset invalidates older queued interactions even when reset returns to the same value. Interactions initiated after that reset remain eligible.

Own `detail.preventDefault()` cancels that proposal only. A canceled value proposal does not request selection-close. A canceled close proposal permits an already accepted value but leaves uncontrolled open state unchanged. Native or React `preventDefault()` from the initiating event's trigger handlers or bubbling ancestors prevents proposal delivery as well as local changes. `stopPropagation()` alone is not cancellation. The component prevents native keyboard scrolling/default button activation without treating its own prevention as consumer cancellation; it temporarily wraps that event instance's preventDefault method through the proposal microtask. Normal extensible browser events are supported. Nonextensible/custom events or bypassing the method with Event.prototype.preventDefault.call are outside that late-cancellation guarantee. Consumers can always use detail.preventDefault.

Close focus restoration is part of an accepted close ticket, never an unconditional open-state effect. Deferred value/open callbacks and accepted local open/reset transitions use ReactDOM.flushSync, intentionally making ordinary owner setState acceptance observable within each transaction. Multiple queued selections are processed FIFO: only an exact controlled value/open acceptance within its callback advances later queued gestures to that accepted owner revision. Keyboard navigation, typeahead, activation, and trigger toggles also run FIFO and read the current accepted highlight rather than a stale render closure. Arbitrary owner writes, cancellation, and acquiring/releasing control never receive that exception. Before each deferred proposal is checked, pending React owner updates are flushed as well, so an ordinary ancestor setState cannot be overwritten by the older queued gesture. This can flush other pending React updates. A controlled owner that leaves open=true (including a batched false→true update) has not accepted closure: no restoration ticket survives. A later asynchronous/external owner close does not automatically restore focus. Async owners must arrange their own focus policy. An explicit focus move outside the component from a supported trigger/value/open callback is preserved; the engine does not replace it with automatic restoration or Tab movement. Canceling the close does not restore focus, including when its callback synchronously closes a controlled parent. External owner writes are authoritative and cannot be undone by cancellation; if the owner explicitly opens a popup, its normal opening focus behavior still applies. Mounting, owner updates, form reset, disabled transitions, native bridge synchronization, and same-value reselection do not emit value callbacks. Reset/disabled transitions do not emit open callbacks.

The static helper keeps its original text, region role, and polite live setting. Its region now receives an accessible name from the visible field label; this is an accessibility correction to the original source.

## Focus, keyboard, and portal

Focus actually moves to the highlighted enabled option; highlighting and selection are separate. Open focuses the selected enabled option, otherwise the first enabled option. ArrowUp opening starts at the last enabled option. Arrow keys wrap, Home/End move to the first/last, and buffered 700ms case-insensitive prefix typeahead skips disabled options. Repeated single letters cycle matches. Enter/Space commit the highlight. Queued popup keyboard actions require focus to remain in this instance's trigger or popup at execution; an ancestor capture/bubble handler or native listener moving focus outside takes priority. Earlier accepted keyboard actions may move focus to another option without invalidating later queued keys. Modifier chords and IME/composition input (including keyCode 229) are ignored. Auto-repeat Enter/Space/Escape/Tab is ignored and default-suppressed; repeated directional keys continue navigation. Empty/all-disabled lists focus their named listbox and cannot commit.

Escape and accepted selection close and restore the visible trigger. Outside pointer/focus dismissal does not steal focus. Tab closes and moves to the next ordinary document tabbable relative to the trigger; Shift+Tab moves backward. Cancellation prevents both changes. Positive tabindex ordering is respected. Hidden/inert ancestors, display:none/hidden visibility, closed dialogs and the non-summary content of closed details are skipped. Named radio groups contribute only the eligible checked radio (or the direction-appropriate first/last radio when none is checked). At a document tab boundary it returns focus to the trigger; a subsequent Tab while closed follows the browser's normal boundary behavior. Shadow-tree traversal, browser-specific edge cases in sequential navigation, and browser-chrome focus transfer are not claimed as platform-equivalent.

Each instance uses React useId for SSR/hydration-stable IDs. Explicit id overrides must be unique; multi-root SSR must use matching unique React identifierPrefix values. Option IDs derive from values and remain stable under reordering. Server render does not read browser globals or create a portal. The portal is created after mount in the trigger's own ownerDocument.body, not necessarily the global document. RTL direction is inherited or explicit. A fixed-position popup uses a 4px offset, horizontal viewport clamping, vertical flip/collision adjustment, and bounded scrollable listbox height. Owner-window resize, visual-viewport change, captured scroll, and ResizeObserver schedule measurements. Scroll buttons appear only where overflow remains; scrolling is immediate. Listeners, observers, animation frames, and instance lifetime are cleaned up on close/unmount. The typeahead buffer uses timestamps, not timers.

## Native form bridge: explicitly added API

The original four examples did not supply name/form/required and did not establish a form contract. This package deliberately adds one; it is not verified Radix equivalence.

A visually clipped, aria-hidden, tabindex=-1 native select carries the current resolved value. It is never display:none. `name` contributes exactly one successful FormData entry; omitting name contributes none. `form` associates it with an external form by native form-owner rules. Root disabled and ancestor disabled fieldsets omit the value and prevent interaction. The native first-legend exemption is respected, including nested fieldsets. An affecting ancestor fieldset's observed disabled→enabled roundtrip after a gesture also revokes that queued interaction; mutation records are drained before creating and checking tickets so a completed roundtrip before a fresh gesture does not revoke it. Unrelated fieldsets and exempt first-legend ancestors do not revoke tickets. Readonly prevents interactions while retaining form submission and required validation.

`required` uses native constraint validation. The bridge invalid event is canceled to prevent a hidden-control browser focus failure; the visible trigger receives focus and an associated “Please select an option.” error. User-supplied error text overrides this text. The invalid state clears on a valid accepted selection, a valid owner/options update, disabling, or an accepted reset. Browser validation UX should still be tested in the intended browser; the bridge is not a claim of assistive-technology certification.

Reset is observed at ownerDocument capture, before form/React capture handlers can stop propagation. The final event.defaultPrevented is checked after propagation. Canceled reset does not reset custom state or invalidate queued proposals. Accepted reset restores the captured first-mount uncontrolled default; controlled reset reconciles to the latest owner, including owner changes, same-value resets, acquiring/releasing control, and key replacement during onReset. Native defaultSelected flags are kept aligned with the latest controlled owner or captured uncontrolled default, so a component first-mounted during onReset is not reverted by the native reset default action. Reset emits no business callbacks. An uncontrolled popup is closed by reset; controlled open remains owner-controlled.

A document/window capture listener that runs earlier and stops the reset before this observer can hide the event; this is an explicit observation limit. First-mount/reset reconciliation still uses the native defaultSelected baseline. A reset is scoped to the captured form owner; reassociating the bridge to another form during onReset prevents the old form reset from applying. An instance first mounted/key-replaced after reset capture keeps its initial/latest owner transitions, including releasing control, and reconciles its native bridge after the native default action; it cannot retroactively observe that earlier capture. Reset reconciliation settles in microtasks, so read FormData after those settle when resetting and synchronously remounting/reassociating controls. Triggering synthetic reset events without the native reset default action is not a substitute for testing form.reset(). Directly editing the hidden select is not a supported selection API; its changes are reconciled without business callbacks.

## DOM/style contract and verification limits

Root `.wix-select-menu[data-component=select-10|select-11|select-12|select-13]`; `.wix-sm-label`, `.wix-sm-trigger`, `.wix-sm-value`, `.wix-sm-icon`, `.wix-sm-chevron`, `.wix-sm-helper`, `.wix-sm-error`, `.wix-sm-native`. The portal has both `.wix-select-menu.wix-sm-popup` and the variant data-component, data-side and data-motion. It contains `.wix-sm-scroll-up`, `.wix-sm-listbox`, and `.wix-sm-scroll-down`; groups use `.wix-sm-group/.wix-sm-group-label`; options use `.wix-sm-option/.wix-sm-option-label/.wix-sm-check`. Boolean data-highlighted/data-disabled/data-readonly/data-placeholder values are `"true"`; data-state is open/closed on the trigger and checked/unchecked on options.

This is a new small React engine with authored Wix styling and simple inline decorative SVG. It does not claim Radix behavioral parity, original Tailwind rendering, Tabler icon byte identity, or automated cross-browser accessibility/geometry acceptance. Formal package, type, runtime, React18 page, and real-browser evidence are maintained separately from this implementation README. JSDOM tests cannot prove popup geometry, zoom/mobile/touch behavior, native browser validation presentation, or assistive-technology behavior. No deployment/settings business action is performed by selecting a value.

## Full-source examples and verification

The complete source deliverable includes `examples/ProofSheet.tsx`, `examples/proof.ts`, tests, and `tools/verify.sh`; run `bash tools/verify.sh` using the already provisioned local toolchain. These example/test/tool files are not part of the npm package. The npm package contains dist, src (including the source declarations and scoped CSS), reference, README, and LICENSE. No dependency installation or network fetch is needed for the supplied verification workflow.

`reference/CONTRACT-PROPOSAL.json` is the JSON evidence referred to by the initial contract proposal. It records original source facts and a read-only feasibility proposal before implementation, including the original absence of a form API. It is retained as provenance; the final implemented public contract is this README, including its explicitly added form API and stated limits. It does not retroactively grant browser, Radix, or accessibility parity.

Validation maintenance: removing `required` clears only the internal native-invalid message, while explicit `error` and `aria-invalid` remain authoritative. Validation events do not mutate selection. Canceling native invalid prevents the browser default validation UI; the custom bridge still reports its own required state and targets its visible trigger. Canceled reset preserves the existing value and internal validation state unless a newer explicit prop change supersedes it.

Model boundary: JSDOM FormData may include selected disabled options (both individual options and options inside disabled optgroups). DOM disabled flags and native differential checks are verified here; browser successful-control behavior is not claimed as tested.
