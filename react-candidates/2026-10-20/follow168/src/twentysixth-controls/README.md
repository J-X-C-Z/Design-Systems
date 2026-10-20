# Follow120: Accordion06 and Textarea20

Two new canonical React IDs: `accordion-06`, `textarea-20`. No native/Flutter credit. These are independent native React adaptations of the pinned Watermelon sources, not Radix package replacements. Original files, primitives and MIT license are preserved under `reference/twentysixth-controls/` with SHA256 and git blob hashes.

## Accordion06

Fixed three-item multiple-open FAQ. The three source titles and all original body strings are retained verbatim; the medical scenario is illustrative, not a claim about this package or a service. The source plus/minus and calendar-clock, shield-check, heart-pulse subjects use inline outline SVGs. Native h3/button/region associations and a visible focus indicator support keyboard users. Every trigger is type=button.

- Default: `['item-1']`; `[]` closes all. `value` and `defaultValue` are exclusive in TypeScript.
- Values: item-1, item-2, item-3. Inputs are deduplicated into source order; invalid values throw RangeError.
- `onValueChange(next, details)` is a synchronous proposal deferred until after click bubbling. Returning false, details.cancel(), or event/nativeEvent.preventDefault() vetoes that proposal. Details include id, itemId, open, previousValue, event and the actual button (use button because event.currentTarget clears after dispatch). Mutating the supplied arrays does not mutate internal state.
- Controlled refusal preserves the displayed owner value. Releasing value preserves the last committed owner value. Same-turn uncontrolled clicks accumulate; owner replacement/unmount invalidates stale work. Native form reset does not change accordion state.
- Root disabled and per-item `triggerProps` disabled are respected, including native fieldset semantics. Root and button refs support React19 callback cleanup.
- ArrowUp/Down by default; horizontal ArrowLeft/Right with RTL inversion; Home/End and optional loop. Navigation only moves focus. Disabled controls are skipped using live DOM state. Shift/Alt/Ctrl/Meta and composing keys are ignored. Enter/Space use native button activation.
- Fixed content cannot be replaced with children. Root attrs, trigger attrs, event handlers and class names are available; semantic type/id/aria-expanded/aria-controls remain owned.

Source differences: independent React behavior instead of Radix; source measured-height animation adapted to finite 160ms fade/translate, removed under reduced motion. Follow orange square toggle emphasis and open divider are deliberate styling. No layout, native keyboard-default, touch or screen-reader claims without a browser/device review.

## Textarea20

Project details label, Describe your project requirements... placeholder, fixed Include key goals, constraints, or expectations. hint. Empty, unnamed and optional by default.

A real textarea accepts native textarea props, ref, form association, rows/maxLength, required/readOnly/disabled, input/composition handlers and React ownership. `value`/`defaultValue` are exclusive in TypeScript. Native reset is untouched. For controlled reset, update the owner value explicitly; disabled fields are excluded from FormData and readOnly fields remain successful.

`label`, `labelProps`, and `wrapperClassName` are styling/accessibility extensions. A null label requires an accessible name supplied by the caller. labelProps cannot override the field association. The hint receives a unique ID; internal and caller aria-describedby IDs are composed and deduplicated. This association repairs the source's unassociated visual hint. Caller-supplied textarea IDs do not collide with generated helper IDs.

Styles retain the max384 wrapper, min64/content-sizing native field, radius8, base responsive14/16px text and translucent focus color. An additional strong focus outline and forced-colors palette are intentional accessibility adaptations. No JS sizing loop, artificial length cap, or resize interception. The field max-width:100% constraint is an intentional responsive adaptation; native resizing remains possible within that bound. Browser CSS sizing and resize behavior are not asserted by the DOM model.

## Work example

`examples/follow-new/main.jsx` includes a controlled ProjectBrief form: real expanded states, current text, explicit refusal, disable, native reset, parent reset, unmount/remount, and live FormData receipts. All effects remain inside the example. Medical copy is explicitly labeled as source fixture text; there is no patient-data system.

## Verification

`tools/twentysixth/verify-all.sh` consumes only the existing official local toolchain. It runs inherited source/selection-reset/Tabs-fix regressions, new source and actual-package model tests, strict Bundler and NodeNext consumers, package SSR, and inherited/new production page bundles in JSDOM. Raw failures are retained. CURRENT-VERIFICATION.json and qa/ contain current outcomes; browser and formal acceptance counts remain zero until independently established.
