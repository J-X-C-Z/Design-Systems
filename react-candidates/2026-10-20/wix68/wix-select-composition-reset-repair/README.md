# @studio/wix-select-composition · maintenance 0.1.0-candidate.4

Current package version: `0.1.0-candidate.4`. This independent Wix68 maintenance supersedes `0.1.0-candidate.3` for these existing IDs; it adds no coverage IDs. Earlier frozen source, packages and reports remain historical artifacts.

This version makes four bounded engine repairs while retaining the published props types, source content and CSS:

1. A control synchronously joining or leaving a form during an accepted reset follows the form association during that event's dispatch. Joining after `form.reset()` returns is a later operation and does not retroactively reset. Canceled reset and explicit controlled owners remain authoritative.
2. `triggerProps` is forwarded through its supported runtime key list: title, tabIndex, autoFocus and the already documented click/key/pointer/focus/blur capture/bubble callbacks. Wider structurally assignable TypeScript variables remain legal. Unsupported fields, including aria-hidden, form, name, value, children and dangerouslySetInnerHTML, are ignored. The component's forwarded trigger ref and internal accessibility/structural semantics remain intact.
3. Keyboard intent tickets observe explicit focus revisions. Only the exact focus target initiated by the component is exempt. A nested consumer onFocus redirect, including back to the trigger, revokes stale queued navigation; legitimate consecutive component navigation remains ordered.

4. Supported option, group and decoration fields are captured once per render into explicit descriptor snapshots. Legal inherited/nonenumerable fields are retained, and validation, selected summaries, popup content and the native form bridge share the same captured values. Unknown object fields are not used to override internal state or semantics.

## Complete minimal consumer

```tsx
import { Select14 } from '@studio/wix-select-composition';
import '@studio/wix-select-composition/styles.css';

export function MinimalConsumer() {
  return <form><Select14 name="choice" /><button type="submit">Continue</button></form>;
}
```

The CSS subpath includes a side-effect-only TypeScript declaration. Strict Bundler and NodeNext consumers with `noUncheckedSideEffectImports` need no ambient declaration for this import. A CSS-capable bundler still loads the actual stylesheet. This packaging repair changes neither the CSS bytes nor existing component declaration/type files.

Historical failure probes and repaired source/package verification are shipped with the full Wix68 source delivery. This README retains the component contract and prior maintenance notes below; those historical version references describe their original changes. Browser/device/assistive-technology and formal acceptance remain unverified.

---

# Dynamic group focus maintenance · 0.1.0-candidate.3

This separate current package supersedes 0.1.0-candidate.2 for select-14–17. It adds no catalog IDs and leaves the old frozen source/archive intact. Public API/types and CSS are byte-identical to that baseline.

A still-enabled option moved between group/flat parents previously lost focus when its DOM node was replaced while flattened values stayed unchanged. A separate old fallback also reclaimed explicit outside focus after the highlighted choice became unavailable. This maintenance records genuine detached option focus, restores only its enabled replacement while no newer focus destination exists, and makes dynamic invalid-highlight fallback respect external/trigger/body focus. Initial opening still performs normal initial focus. This includes each independent Select15 slot where present. Required-removal maintenance and earlier event/reset repairs remain preserved.

The sections below describe the original public API and retained prior maintenance. Current source/build/version bindings are recorded in reference/FOCUS-MAINTENANCE.json. Real-browser/AT/formal acceptance remains 0.

# Maintenance candidate 2: required-state repair

This independent maintenance copy repairs a transient validation-state defect in candidate 1: after an empty required field has emitted a native invalid event, removing `required` now clears its internally generated error and `aria-invalid`. Explicit `error` and `aria-invalid`, including Select14’s persistent warning, remain caller-owned. This applies separately to all three Select15 slots. The original frozen package and historical audit remain preserved; this does not add component IDs. Development examples/tests/tools are in this full-source repair directory, not the npm-only archive.

# @studio/wix-select-composition

Version 0.1.0-candidate.4. Four source-audited React variants, select-14–17, containing **six independently stateful custom popup controls**. Select15 is one canonical component with three separate controls. React and ReactDOM are peers (18.2 through 19); there is no Radix, icon-library, utility-CSS, or other runtime dependency. Import `@studio/wix-select-composition/styles.css` once. Every visible control is a button/combobox with a portaled listbox. The clipped native select exists only for the explicitly added form integration.

This independent package duplicates and adapts the frozen Wix50 private engine; it does not import the prior package or modify the frozen source. Four original identities remain four additions, irrespective of the six trigger instances.

## Original identities and preserved content

Sources: WatermelonCorp/watermelon-platform revision `424fe703d19b39e86bef90c4ba0a76ef8c1fb260`, `src/data/contents/components/select/variant-{14,15,16,17}.tsx`.

| Export | Original label/placeholder | Initial value | Original distinction | Exact Git blob |
| --- | --- | --- | --- | --- |
| Select14 | Active Environment / Identify environment | prod | Persistent invalid presentation and static maintenance warning | a503f9555db06da4cb8885c8bb60f0b8c8f1926f |
| Select15 | Three unlabelled visible triggers; placeholders below | all empty | Three independent grouped selectors and three sizes | 72d1915cf5c1f3d01fe12653089f542e18ef7947 |
| Select16 | System Criticality / Set level | p2 | Distinct neutral focus treatment | d54d46e21558a07f72921d90443f57f996127a88 |
| Select17 | Operation Type / System category | internal | Muted filled shadowless trigger; Resource Categories group | 0b747440f26253ef0f566d8b5dbf3fe6552733ff |

Exact options, in source order; all enabled by default:

- Select14: `dev` / Development Sandbox; `staging` / Staging Cluster; `qa` / QA Validation; `prod` / Production Main. No group heading.
- Select15 small: placeholder **System memory**, group **Small Instance**; `2gb` / 2 GB RAM; `4gb` / 4 GB RAM; `8gb` / 8 GB RAM.
- Select15 standard: placeholder **Standard memory**, group **Standard Nodes**; `16gb` / 16 GB RAM; `32gb` / 32 GB RAM; `64gb` / 64 GB RAM.
- Select15 large: placeholder **High-performance memory**, group **Performance Cluster**; `128gb` / 128 GB RAM; `256gb` / 256 GB RAM; `512gb` / 512 GB RAM.
- Select16: `p1` / P1 - Highest Attention; `p2` / P2 - Priority Ops; `p3` / P3 - Regular Flow; `p4` / P4 - Informational. No group heading.
- Select17, group **Resource Categories**: `internal` / Internal Operations; `client` / Client Interaction; `rd` / Research & Develop; `maint` / System Maintenance.

Select14 preserves the exact static sentence **Production environment is currently locked for maintenance tasks.**, as a paragraph with `role="alert"` and explicit `aria-live="polite"`. All choices remain selectable: the original sentence is not an implemented environment lock. Its default `aria-invalid=true` and warning persist after selection changes and reset. The native required-validation state is separate; persistent ARIA invalid presentation does not itself fail native form validation. Select16/17 have no warning/helper/error by default.

Select15 initially shows all three placeholders, never an invented first selection. The source's “Small Select”, “Default Select”, and “Large Select” JSX comments are not visible headings. There is no aggregate memory total, cross-control synchronization, automatic next opening, provision action, or source-authored one-popup policy. Normal outside pointer/focus dismissal applies independently to each instance.

The original sizes are source token interpretations of 28/32/40px at a 16px root, not measured original runtime geometry. This Wix adaptation deliberately maps small/standard/large to **36/44/52 CSS px**. This is a theme/accessibility sizing choice, not source-pixel equivalence. Select16 keeps a distinct neutral focus treatment; Select17 keeps its muted, shadowless trigger while its popup retains a shadow. Original MIT attribution remains in LICENSE.

## Public API: explicit adapter additions

The upstream examples are parameterless components. The configurable ownership, event, form, label, layout, motion and accessibility API below is added by this adapter, not an upstream API or verified Radix-equivalence claim.

```tsx
import * as React from 'react';
import { Select14, Select15, Select16, Select17, wixSelectCompositionIds } from '@studio/wix-select-composition';
import '@studio/wix-select-composition/styles.css';

<Select14 name="environment" />
<Select16 value={priority} onValueChange={(next, detail) => {
  if (!canChange) detail.preventDefault();
  else setPriority(next);
}} />
<Select17 defaultValue="client" />

const groupRef = React.createRef<HTMLDivElement>();
const smallTriggerRef = React.createRef<HTMLButtonElement>();
<Select15 ref={groupRef} id="memory" dir="rtl"
  small={{ name: 'smallMemory', defaultValue: '4gb', triggerRef: smallTriggerRef }}
  standard={{ name: 'standardMemory', value: memory, onValueChange: setMemory }}
  large={{ name: 'largeMemory', required: true, dir: 'ltr' }}
/>
```

Select14, Select16 and Select17 forward `HTMLButtonElement` refs. Select15 forwards an **HTMLDivElement** ref to its outer group; each named slot accepts `triggerRef?: React.Ref<HTMLButtonElement>`. Ref handling uses React's lifecycle, including React19 callback-ref cleanup. `wixSelectCompositionIds` is the frozen readonly tuple `['select-14', 'select-15', 'select-16', 'select-17']`. Source and published declarations export the same strict public types using NodeNext-compatible relative `.js` type imports.

### Each individual control

`SelectCompositionProps` is the shared control contract, used by Select16/17, extended by Select14, and contained independently in each Select15 slot:

- `value: string` and `defaultValue?: string` are mutually exclusive. An omitted value is uncontrolled. Defaults are captured at first mount; later defaultValue changes do not redefine reset behavior.
- `open: boolean` and `defaultOpen?: boolean` are independently mutually exclusive. External owner changes do not emit callbacks. Releasing control retains the last committed controlled value/open state. Acquiring or releasing control advances the relevant owner authority.
- `onValueChange(value, detail)` and `onOpenChange(open, detail)` propose changes. Returning a boolean has no effect. A controlled owner must update its props to accept; an uncanceled uncontrolled proposal updates locally.
- `options?: readonly (SelectOption | SelectGroup)[]`: options have a nonempty unique string `value`, string `label`, optional `disabled`; groups have a string `label`, flat readonly `options`, optional `disabled`. Types reject hybrids and nested groups. Empty option values are reserved for the placeholder. Invalid/duplicate values throw. Options are evaluated every render, including disabled/group changes.
- `label`, `placeholder`, `helper`, `error`: string overrides. No helper appears by default. A nonempty helper uses a named `role=region` with `aria-live=polite`; empty helper suppresses it. Error uses `role=alert` and a trigger description association.
- `disabled`, `readOnly`, `required`, `name`, `form`: the added form/interaction contract below. No default form names or required flags are invented.
- `id`, `dir: 'ltr' | 'rtl'`, `motion: 'system' | 'on' | 'off'`, root `className`, root `style`. Motion defaults to system; off disables transitions; reduced-motion preferences override all modes. No animation loops or smooth scrolling.
- `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-invalid` apply to the trigger; listbox naming follows trigger naming overrides. Explicit `aria-invalid` is consumer-owned, even when false and an error/warning is present. The default visible label stays visible for Select14/16/17. Required state exposes aria-required and a decorative label marker.
- `triggerProps` only accepts title, tabIndex, autoFocus, onClick/onClickCapture, onKeyDown/onKeyDownCapture, onPointerDown/onPointerDownCapture, onFocus/onFocusCapture, onBlur/onBlurCapture. Structural/selection/native-form props, ref, children, dangerous HTML, raw onChange, arbitrary native-select props and arbitrary event props are unsupported. No rest-props bag is silently forwarded.

A selected value removed from options is retained logically but shows the placeholder and gives the native bridge value `''`. Restoring the option restores its selection without a callback. A selected disabled option remains displayed; browser native successful-control rules omit that disabled option from FormData. Disabled options/groups cannot be highlighted or committed.

### Select14 warning

Only `Select14Props` adds `warning?: string`. `undefined` preserves the exact source sentence; an empty string explicitly suppresses its text, element and described-by ID. A nonempty string overrides it. Warning customization/suppression and the `aria-describedby` association are documented additions. Neither selection nor reset clears it, and hiding the warning does not clear the default persistent invalid attribute. An explicit `aria-invalid` override controls that attribute independently. Required-validation errors and the optional generic helper remain separate elements with separate IDs.

### Select15 composition

`Select15Props` has only `small`, `standard`, `large` plus outer `id`, `className`, `style`, `dir`, `motion`, `aria-label`, `aria-labelledby`, `aria-describedby`. There are no aggregate value/defaultValue, open/defaultOpen, options, required/name/form, disabled/readOnly or change-callback props. To disable all slots pass disabled to each or use an ancestor disabled fieldset. Each `Select15SlotProps` carries the entire individual control contract plus its explicit triggerRef, with separate ownership, defaults, options, callbacks, refs, reset observations and form association. One canceled or owner-rejected slot value does not overwrite siblings. Choosing another slot can still dismiss a popup through normal outside-focus/pointer semantics.

The outer div has `role=group`, default accessible name **Memory configuration**, and explicit ARIA naming overrides. This group name is an accessibility addition. Outer dir/motion default into every slot, but slot values override them. Outer id, when supplied, derives `id-small`, `id-standard`, `id-large`; explicit slot ids win. Without them each control uses its own React useId. All explicit ids must remain unique.

There are no visible slot-label rows. Instead each slot has an added stable, visually hidden label whose default text is its exact original placeholder; `label` changes that hidden text. Changing `placeholder` alone does not change the stable label. The trigger/listbox and optional helper reference that stable label unless ARIA naming overrides are supplied. This explicit labeling is an accessibility improvement; no claim is made that the source's primitive-provided accessible name was absent or incorrect. Empty custom labels/naming strings remain the consumer's responsibility.

## Proposals, cancellation, and ordering

Value reasons: `pointer`, `keyboard`. Open reasons: `trigger`, `keyboard`, `selection`, `escape`, `tab`, `outside-pointer`, `focus-out`.

Each detail exposes `reason`, the underlying native `originalEvent`, `cancelable: true`, `defaultPrevented`, and `preventDefault()`. Call detail.preventDefault synchronously inside its callback to cancel that proposal. Callback delivery is deferred to a microtask after the initiating DOM event finishes propagation; the callback itself and its cancellation decision are synchronous. Event currentTarget is therefore no longer retained. Do not defer cancellation until a promise/timer.

The engine captures owner revisions, reset ordering, and mount/interaction lifetime before user callbacks, including the supported trigger capture/bubble handlers. It rechecks before delivering a proposal and again after its callback. A newer explicit relevant controlled owner, acquiring/releasing control, disabling, or unmounting prevents an old interaction from overwriting newer authority. Internal highlighting, resize/scroll measurements, or unrelated portal DOM mutations do not revoke accepted interactions. Accepted native reset invalidates older queued interactions even when reset returns to the same value. Interactions initiated after that reset remain eligible.

Own `detail.preventDefault()` cancels that proposal only. A canceled value proposal does not request selection-close. A canceled close proposal permits an already accepted value but leaves uncontrolled open state unchanged. Native or React `preventDefault()` from the initiating event's trigger handlers or bubbling ancestors prevents proposal delivery as well as local changes. `stopPropagation()` alone is not cancellation. The component prevents native keyboard scrolling/default button activation without treating its own prevention as consumer cancellation; it temporarily wraps only that keydown event instance's preventDefault method through the proposal microtask. Pointer and focus proposals read native defaultPrevented without replacing event methods, including when independently bundled controls observe the same outside event. Normal extensible browser events are supported. Nonextensible/custom events or bypassing the method with Event.prototype.preventDefault.call are outside that late-cancellation guarantee. Consumers can always use detail.preventDefault.

Close focus restoration is part of an accepted close ticket, never an unconditional open-state effect. Deferred value/open callbacks and accepted local open/reset transitions use ReactDOM.flushSync, intentionally making ordinary owner setState acceptance observable within each transaction. Multiple queued selections are processed FIFO: only an exact controlled value/open acceptance within its callback advances later queued gestures to that accepted owner revision. Keyboard navigation, typeahead, activation, and trigger toggles also run FIFO and read the current accepted highlight rather than a stale render closure. Arbitrary owner writes, cancellation, and acquiring/releasing control never receive that exception. Before each deferred proposal is checked, pending React owner updates are flushed as well, so an ordinary ancestor setState cannot be overwritten by the older queued gesture. This can flush other pending React updates. A controlled owner that leaves open=true (including a batched false→true update) has not accepted closure: no restoration ticket survives. A later asynchronous/external owner close does not automatically restore focus. Async owners must arrange their own focus policy. An explicit focus move outside the component from a supported trigger/value/open callback is preserved; the engine does not replace it with automatic restoration or Tab movement. Canceling the close does not restore focus, including when its callback synchronously closes a controlled parent. External owner writes are authoritative and cannot be undone by cancellation; if the owner explicitly opens a popup, its normal opening focus behavior still applies. Mounting, owner updates, form reset, disabled transitions, native bridge synchronization, and same-value reselection do not emit value callbacks. Reset/disabled transitions do not emit open callbacks.

A supplied generic helper is a polite named region associated with its stable field label, including the visually hidden labels in Select15. Select14’s persistent alert is separate from both helper and transient validation error.

## Focus, keyboard, and portal

Focus actually moves to the highlighted enabled option; highlighting and selection are separate. Open focuses the selected enabled option, otherwise the first enabled option. ArrowUp opening starts at the last enabled option. Arrow keys wrap, Home/End move to the first/last, and buffered 700ms case-insensitive prefix typeahead skips disabled options. Repeated single letters cycle matches. Enter/Space commit the highlight. Queued popup keyboard actions require focus to remain in this instance's trigger or popup at execution; an ancestor capture/bubble handler or native listener moving focus outside takes priority. Earlier accepted keyboard actions may move focus to another option without invalidating later queued keys. Modifier chords and IME/composition input (including keyCode 229) are ignored. Auto-repeat Enter/Space/Escape/Tab is ignored and default-suppressed; repeated directional keys continue navigation. Empty/all-disabled lists focus their named listbox and cannot commit.

Escape and accepted selection close and restore the visible trigger. Outside pointer/focus dismissal does not steal focus. Tab closes and moves to the next ordinary document tabbable relative to the trigger; Shift+Tab moves backward. Cancellation prevents both changes. Positive tabindex ordering is respected. Hidden/inert ancestors, display:none/hidden visibility, closed dialogs and the non-summary content of closed details are skipped. Named radio groups contribute only the eligible checked radio (or the direction-appropriate first/last radio when none is checked). At a document tab boundary it returns focus to the trigger; a subsequent Tab while closed follows the browser's normal boundary behavior. Shadow-tree traversal, browser-specific edge cases in sequential navigation, and browser-chrome focus transfer are not claimed as platform-equivalent.

Each instance uses React useId for SSR/hydration-stable IDs. Explicit id overrides must be unique; multi-root SSR must use matching unique React identifierPrefix values. Option IDs derive from values and remain stable under reordering. Server render does not read browser globals or create a portal. The portal is created after mount in the trigger's own ownerDocument.body, not necessarily the global document. RTL direction is inherited or explicit. A fixed-position popup uses a 4px offset, horizontal viewport clamping, vertical flip/collision adjustment, and bounded scrollable listbox height. Owner-window resize, visual-viewport change, captured scroll, and ResizeObserver schedule measurements. Scroll buttons appear only where overflow remains; scrolling is immediate. Listeners, observers, animation frames, and instance lifetime are cleaned up on close/unmount. The typeahead buffer uses timestamps, not timers.

## Native form bridge: explicitly added API

The original four variants, including all three Select15 controls, did not supply name/form/required and did not establish a form contract. This package deliberately adds one; it is not verified Radix equivalence.

A visually clipped, aria-hidden, tabindex=-1 native select carries the current resolved value. It is never display:none. `name` contributes exactly one successful FormData entry; omitting name contributes none. `form` associates it with an external form by native form-owner rules. Root disabled and ancestor disabled fieldsets omit the value and prevent interaction. The native first-legend exemption is respected, including nested fieldsets. An affecting ancestor fieldset's observed disabled→enabled roundtrip after a gesture also revokes that queued interaction; mutation records are drained before creating and checking tickets so a completed roundtrip before a fresh gesture does not revoke it. Unrelated fieldsets and exempt first-legend ancestors do not revoke tickets. Readonly prevents interactions while retaining form submission and required validation.

`required` uses native constraint validation. The bridge invalid event is canceled to prevent a hidden-control browser focus failure; the visible trigger receives focus and an associated “Please select an option.” error. User-supplied error text overrides this text. The transient required-validation invalid state clears on a valid accepted selection, a valid owner/options update, disabling, or an accepted reset. Select14’s persistent warning and default aria-invalid=true do not clear with that transient state. Browser validation UX should still be tested in the intended browser; the bridge is not a claim of assistive-technology certification.

Reset is observed at ownerDocument capture, before form/React capture handlers can stop propagation. The final event.defaultPrevented is checked after propagation. Canceled reset does not reset custom state or invalidate queued proposals. Accepted reset restores the captured first-mount uncontrolled default; controlled reset reconciles to the latest owner, including owner changes, same-value resets, acquiring/releasing control, and key replacement during onReset. Native defaultSelected flags are kept aligned with the latest controlled owner or captured uncontrolled default, so a component first-mounted during onReset is not reverted by the native reset default action. Reset emits no business callbacks. An uncontrolled popup is closed by reset; controlled open remains owner-controlled.

A document/window capture listener that runs earlier and stops the reset before this observer can hide the event; this is an explicit observation limit. First-mount/reset reconciliation still uses the native defaultSelected baseline. A reset is scoped to the captured form owner; reassociating the bridge to another form during onReset prevents the old form reset from applying. An instance first mounted/key-replaced after reset capture keeps its initial/latest owner transitions, including releasing control, and reconciles its native bridge after the native default action; it cannot retroactively observe that earlier capture. Reset reconciliation settles in microtasks, so read FormData after those settle when resetting and synchronously remounting/reassociating controls. Triggering synthetic reset events without the native reset default action is not a substitute for testing form.reset(). Directly editing the hidden select is not a supported selection API; its changes are reconciled without business callbacks.

## DOM/style contract and verification limits

- Package-scoped roots and portals use `.wix-select-composition`; internal classes are `.wix-sc-*` and generated IDs begin `wix-sc-`.
- Single Select14/16/17 roots and their portals have the corresponding canonical `data-component`. Six internal identities use `data-variant=select-14|select-15-small|select-15-standard|select-15-large|select-16|select-17`.
- Select15 has exactly one canonical outer `.wix-sc-composite[data-component=select-15]`; its three inner `.wix-sc-slot` roots and any slot portals have `data-control=small|standard|large` and matching `data-size`. Slots never acquire additional canonical data-component IDs. Canonical counts come from the four-ID tuple, not the number of triggers or open portal DOM nodes.
- Controls use `.wix-sc-label`, `.wix-sc-trigger`, `.wix-sc-value`, `.wix-sc-chevron`, `.wix-sc-helper`, `.wix-sc-warning`, `.wix-sc-error`, `.wix-sc-required`, `.wix-sc-native`; hidden slot labels also have `.wix-sc-sr-only`. There is no inherited desktop icon or old variant helper.
- Portal `.wix-select-composition.wix-sc-popup` has data-variant, data-side, data-motion, and the slot hooks when applicable. It contains `.wix-sc-scroll-up`, `.wix-sc-listbox`, `.wix-sc-scroll-down`. Groups use `.wix-sc-group/.wix-sc-group-label`; options use `.wix-sc-option/.wix-sc-option-label/.wix-sc-check`.
- Boolean data-highlighted/data-disabled/data-readonly/data-placeholder values are `"true"`; trigger data-state is open/closed and option data-state is checked/unchecked.

The new local engine replaces upstream Radix Select/Label; scoped Wix CSS replaces Tailwind/cn recipes, and small inline decorative chevron/check SVGs replace lucide-react glyphs. React and ReactDOM remain peers/external. This does not claim Radix behavioral parity, original Tailwind rendering, lucide icon byte identity, or automatic cross-browser accessibility/geometry acceptance. Formal package, type, runtime, React18 page and browser evidence are maintained separately. JSDOM cannot prove popup geometry, zoom/mobile/touch behavior, native browser validation presentation or assistive-technology behavior. No environment locking, incident handling, memory provisioning, resource action, network write or persistence is performed by selecting a value.

## Full-source examples and verification

The complete source deliverable includes runnable `examples/TypeScale.tsx` plus `examples/type-scale.ts`: six real controls generate local CSS with three independent text sizes, family, weight and line spacing, exact preview, native FormData/validation/reset and Blob download. The helper is not an npm runtime export and uses installed fonts without network font requests. The complete source also includes the `tests/` and `tools/` directories; `tools/verify.sh` is the provided entry point when delivered alongside that source. They are **source-only** and not included in the npm package. The npm package contains `dist`, `src` (including source declarations and scoped CSS), `reference`, README and LICENSE. Use the already provisioned local toolchain; no dependency installation or network fetch is required by the supplied verification workflow.

The `reference/` directory preserves original sources, identities and the read-only contract proposal as provenance. That proposal records pre-implementation facts, not runtime acceptance. This README defines the final implemented public contract, including explicit adapter additions and limits. The four-ID implementation does not itself confer independent review or formal acceptance, and does not change any existing public component.

Validation maintenance: removing `required` clears only the internal native-invalid message, while explicit `error` and `aria-invalid` remain authoritative. Validation events do not mutate selection. Canceling native invalid prevents the browser default validation UI; the custom bridge still reports its own required state and targets its visible trigger. Canceled reset preserves the existing value and internal validation state unless a newer explicit prop change supersedes it.

Model boundary: JSDOM FormData may include selected disabled options (both individual options and options inside disabled optgroups). DOM disabled flags and native differential checks are verified here; browser successful-control behavior is not claimed as tested.
