# Follow React: checkbox09–12 / switch09–12

Eight exact canonical IDs, eighteen real React/native fields. Source commit: 424fe703d19b39e86bef90c4ba0a76ef8c1fb260. These are compositions of the package's React scalar fields; no imperative native adapter, HTML injection, iframe, runtime icon download, server action or storage is involved.

Load existing token/base/scalar styles, then fourth-selection/styles.css. Import exports from fourth-selection/index.jsx, with index.d.ts declarations. Examples are in examples.jsx. Main-package exports and aggregate Studio/build integration belong to the parent integration task.

## Exact source composition

- Checkbox09: planning/design/operations, initially false/false/false. Three vertically stacked checkbox + decorative icon + label rows under 关注领域. SVG identities: folder, pen, briefcase.
- Checkbox10: destructive/info/success, initially true/true/true. 20px rounded-six-pixel checked squares; distinct semantic colors.
- Checkbox11: triangle/diamond/hexagon, initially true/true/true. Three distinct 20px geometry SVGs. Checked is solid colored, unchecked retains an outline. There is no generic square/check presentation.
- Checkbox12: destructive/info/success, initially true/true/true. 28px colored disks remain colored when unchecked; only the 20px inner circle/check disappears.
- Switch09: initially true. 56×28px pill, 26px thumb. Checked displays X on inline start, unchecked check on inline end. The source's intentionally unusual mapping is preserved.
- Switch10: initially true. 76×32px square-ish track, 37px half thumb. Checked displays sun at inline start; unchecked moon at inline end. Source 37px LTR / 35px RTL checked travel is retained; 76px is a fixed adapter width derived from the source's two 20px icon + 16px padding + 2px margin cells.
- Switch11: initially true. Auto Sync card with label, associated description, refresh icon, 24×16px end-positioned switch and 12px thumb. Native input covers the card, including with label:null. Refresh rotates between 0 and 360 degrees over a finite transition; nothing runs continuously.
- Switch12: privacy/notifications/darkTheme, initially false/false/false. Actual fieldset/legend and three list rows separated by borders; shield/bell/moon icons, native label activation and independent switches. Maximum width 384px.

## Public API

The five groups expose fixed named BooleanFieldProps members and corresponding memberRef props. Exported immutable CHECKBOX09_SLOTS, CHECKBOX10_SLOTS, CHECKBOX11_SLOTS, CHECKBOX12_SLOTS and SWITCH12_SLOTS declare member order/defaults/labels. Missing or null member props keep source defaults; explicit defaultChecked:false overrides true source defaults.

Checkbox09–12 forwarded refs target HTMLDivElement. Switch12 forwarded ref targets HTMLFieldSetElement. Every memberRef and each Switch09/10/11 forwarded ref targets the real HTMLInputElement, including React callback-ref cleanup semantics.

Group presentation uses label, description, error; individual fields use label, help, error. Switch11 uses label for its title and help for its description, not description. Group labels can be null, and each label-less field still has its native 44px-or-larger target and fallback accessible name. Caller-visible member labels replace source-only aria-label defaults. Explicit caller aria-label takes priority. Decorative SVGs have aria-hidden and are not part of the accessible name.

There is no aggregate checked/defaultChecked/value/values/onCheckedChange/name API on groups; runtime misuse is ignored. Each named field accepts checked, defaultChecked, onCheckedChange and native form/name/value/required/id/onChange/onClick/onKeyDown props independently. Group form supplies a default; member form, including an empty string, wins. Switch12 also reflects disabled and form on its native fieldset root. Fieldset form association does not propagate to descendants by HTML itself, so members continue to receive explicit form and disabled props independently. Group disabled/readOnly cannot be overridden by a member false. Group and member ownerRevision combine without losing undefined or numeric -0.

## State, events, reset and lifecycle

- checked !== undefined means controlled ownership; undefined releases the latest effective state. Runtime null is normalized by the shared scalar core to controlled false, but is intentionally not part of the TypeScript boolean API.
- defaultChecked establishes the mount-time reset baseline. Later default changes do not reset edits or rewrite that baseline.
- Native input-target click listeners and onClick can cancel activation. Original React onChange still reaches the observer. Member onChange runs before group onChange unless canceled, followed by member onCheckedChange proposal. Return values are ignored. Cancel in onChange or onClick, or refuse through controlled ownership; preventDefault in the proposal callback is too late.
- Original onClick/onChange/onCheckedChange exceptions propagate, restore the current model and do not commit the failed proposal. A later normal activation remains usable.
- Synchronously committed parent accept/reject/release/ownerRevision, disabled/readOnly, keyed replacement and unmount take precedence over obsolete event/reset work. Plain same-value metadata renders are not owner commands. Uncommitted batched state has not yet taken ownership.
- Native form.reset silently resets uncontrolled fields to their mount baseline and redraws controlled fields from their owner. Cancelable and repeated resets, reset-dispatch edits, same-model post-reset edits, reassociation, synchronous owner changes and unmount are separately tested. FormData includes checked, enabled named fields; readonly fields can submit; unchecked/disabled fields do not. No hidden aggregate field is synthesized.
- React callback refs are forwarded to actual nodes and cleaned on unmount. State remains per instance and per member. Labels, error/help descriptions and IDs are stable across metadata rerenders.

Limits: late preventDefault after dispatch is too late; stopImmediatePropagation before the shared observer can prevent its reset observation; direct property assignment without a native editing event is not a supported edit API. A native click listener later than React processing cannot retract a proposal already emitted. Ordinary event observers may finish their stack after synchronous unmount, while scalar proposals cannot commit afterward. Space and Tab use browser native actions; Enter is an explicit switch enhancement, gated for repeat/modifiers/composition/veto/readonly/disabled. This package does not run upstream Radix/Base UI internals and does not claim library event equivalence or indeterminate support for these eight boolean-only examples.

Card Switch11 covers its presentation with the native input; keep label/help noninteractive. For links/buttons use a separate neighboring element rather than putting an interactive child under the input overlay. Switch12 label surface covers the row and its padding; label:null preserves the native control target, not the removed label's entire row area.

## Source and differences

reference/ preserves exact source TSX for all eight IDs plus the underlying official checkbox/switch primitives. source-hashes.json records newly calculated Git blobs and SHA-256 values against the canonical catalog. 10–12 bytes were found in the same local original source tree after discovering the provided source-map omitted those six files; the map was not edited. The source primitives' imports describe Radix and Base UI dependencies; none were installed or executed here.

Each original was read independently. This candidate does not inherit the native renderer's tests, previous selection batches' acceptance, or a category representative's parity. MIT notice is retained in LICENSE.upstream. The original English strings and source colors are recorded in contracts/fourth-selection.json. Icon-switch track borders use the control-line token instead of transparent source borders so the unchecked track has a visible boundary. Source icon identities are preserved through small inline SVG counterparts; exact package icon outlines are not a pixel-parity claim.

Explicit differences: translated copy, larger 44px native targets, native form inputs instead of Radix/Base UI roots, explicit individual controlled props instead of private aggregate demo state, semantic light/dark colors instead of the source rose/cyan/violet/sky/green constants, and stable instance-scoped IDs rather than global IDs. These are documented adaptations. The source-specific geometry/default vectors and icon state mapping remain distinct. Switch10 and Switch11 only change local selection state; they do not change application theme or synchronize any data.

## Validation boundary

Tests export the established run(window, React, createRoot, assert, components) interface. Each of 18 fields is tested independently, including synchronous onClick/onChange/proposal ownership changes. Static source/CSS tests cover long Chinese wrapping declarations, local icon anchoring, label-null native targets, semantic colors across 14 theme/mode palettes, RTL declarations, forced colors and reduced/disabled finite motion. Static color ratios and declarations are not computed browser or real layout evidence.

Author execution status is recorded in author-evidence.json when run, not inferred from this README. Type tests are type-tests.tsx. Independent byte review, browser native keyboard and pointer hit-testing, accessibility-tree/AT evaluation, 390px/1440px layouts, RTL/forced colors/reduced motion, and final package consumer checks remain separate. Formal acceptance remains 0 for this slice until those checks are completed.
