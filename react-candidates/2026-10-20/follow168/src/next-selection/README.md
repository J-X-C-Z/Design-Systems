# Seven exact React selection variants

This module implements only checkbox-02/03/04, switch-02/03/04 and textarea-02 from the canonical 849 catalog at Watermelon commit `424fe703d19b39e86bef90c4ba0a76ef8c1fb260`. It is genuine React JSX/hooks/forwardRef. The shared scalar React fields are imported directly; no native controller mounting, iframe, innerHTML, original dependency execution or network is used.

Load `../scalar/styles.css` followed by this module's `styles.css` and the host tokens. See `examples.jsx` for a real controlled form. Framework use requires React 19 and React DOM in the host. Source MIT notice and the exact rehashed variants/primitive wrappers are preserved in `sources/`.

## Exact structures and source defaults

| ID | React export | Preserved distinction |
|---|---|---|
| checkbox-02 | Checkbox02 | Native checkbox, separate label/help column, outline check/minus. Starts unchecked and indeterminate. First accepted user activation clears indeterminate. |
| checkbox-03 | Checkbox03 | One initially unchecked checkbox, dashed unchecked/checked border and label. |
| checkbox-04 | Checkbox04 | One initially checked checkbox; effective checked state strikes through and mutes the label. A refused proposal cannot falsely strike the label. |
| switch-02 | Switch02 | One square track/thumb, initially false, accessible name and no visible label. |
| switch-03 | Switch03 | Four separately named destructive/success/info/warning switches, each initially true. Distinct semantic color tokens. |
| switch-04 | Switch04 | One initially false, 40×24 gradient track, 20px thumb with 1px/19px offsets and RTL direction. No visible label. |
| textarea-02 | Textarea02 | Visible associated “你的输入” label, “分享你的想法……” placeholder, small radius/shadow/primary focus treatment and native multiline editing. |

Chinese defaults are translations of the preserved English source. 44px hit targets, native inputs instead of Radix/Base UI button + hidden-input internals, Follow theme token mapping, ownership/reset safeguards and readOnly are documented adapter changes. Source 16px checkbox visuals use 20px for the existing touch-target system. Semantic colors use `--ds-danger/success/info/warning`; checked group thumbs use `--ds-surface` so dark mode does not pair pale tracks with hard-white thumbs. Browser pixel/contrast evidence remains required; this is not dependency DOM/event parity.

## Checkbox02 atomic value

- `value={{checked: false, indeterminate: true}}` owns both properties. `null` owns false/false. `undefined` releases the last effective pair. Pair members are booleans; at runtime missing members normalize false. Do not pass partially specified controlled values expecting retained bits.
- `defaultValue` is a mount-only pair reset baseline. Omitted defaults false/true. Changing it later does not erase an edit or replace the reset baseline.
- `onChange` is the original React change event. `preventDefault()` here or in onClick vetoes the proposal; nativeEvent.defaultPrevented is also respected because React may create onChange before dispatching onClick. Original React onChange still forwards. `onValueChange({checked, indeterminate:false}, event)` is the subsequent proposal. It always clears mixed; callback return values/promises and preventDefault in the proposal do not accept/veto ownership. Controlled parents accept via a committed value render.
- Native successful-control content is `submissionValue`, default `on`, because React `value` is the atomic pair. Mixed+unchecked is omitted from FormData; mixed+checked submits. `name`, `form`, `required`, native keyboard/label events and ref apply to the real checkbox.
- `checked`, `defaultChecked`, `onCheckedChange` are deliberately not a second competing ownership API. They are omitted from types and ignored at runtime.
- Every committed owner-pair/ownership/ownerRevision/safety change retires older callbacks and reset work. Ordinary same-value metadata renders preserve intent. Use `ownerRevision` for a same-value owner command.

## Switch03 independent slots

`SWITCH03_SLOTS` exports the ordered, frozen descriptors with `key`, localized `label` and source `defaultChecked:true`. The API is four named slot props: `destructive`, `success`, `info`, `warning`. Each is ordinary `BooleanFieldProps` with independent `checked/defaultChecked/onCheckedChange`, native `name/value/form` and events. Missing, undefined or null slot objects still render all four. Missing/undefined `defaultChecked` means true. Each defined `checked` independently owns that slot; absent checked is uncontrolled. No aggregate `value/defaultValue/values/defaultValues/onValueChange` exists or is inferred from arrays/maps. These unsupported group value props are ignored at runtime.

- Top-level `disabled` and `readOnly` are ORed with each member. A member false cannot bypass a true group gate.
- Group and member ownerRevision are composed; either can express an owner command.
- Top-level `form` supplies the default association; a member may name another form. Reset uses each actual input.form, not the group container or a hidden aggregate field.
- Member `onChange` runs first; cancellation stops both group `onChange` and the member proposal. Otherwise group `onChange` receives that same original event before the member's `onCheckedChange`. Group native div props/ref target the wrapper. `destructiveRef/successRef/infoRef/warningRef` target their four stable native fields.
- Because members are independent, a reset of one form cannot reset a member associated with another form. A single field's controlled rejection does not affect siblings.

## Shared field contract

Checkbox03/04 and Switch02/04 use scalar `checked/defaultChecked/onCheckedChange`; native `value` remains the submission string. Textarea02 uses scalar `value/defaultValue/onValueChange` and composition lifecycle. Stable nodes preserve focus/selection across metadata/validation renders. Disabled fields are omitted from HTML submission; readOnly prevents user mutation but keeps native focus/submission. Control values are never persisted or transmitted.

Native form.reset is observed in document capture and reconciled after its default action. Effective reset restores mount baseline for uncontrolled fields; current controlled props win. Reset emits no change/proposal. Dispatch-time ordinary edits occur before reset default action. Fresh post-return edits, newer owner commands, form reassociation and unmount protect newer work. Cancellation must occur during dispatch; late post-dispatch preventDefault, an earlier capture stopImmediatePropagation that prevents observation, and direct property mutations without events are outside the guarantee. Mixed checkboxes and shared scalar fields each maintain their own reset observer; replacement joining an already active dispatch is guaranteed within its own implementation family, not between an entirely unmounted mixed family and scalar family.

Textarea IME drafts remain DOM-only until one compositionend proposal. Owner/safety/reset cancellation retires stale tails; new beforeinput/compositionstart recovers. The editor delegates native undo; no full OS IME/undo/autofill parity is claimed.

## Test and browser fixture boundaries

`tests/next-selection-tests.cjs` exports async `run(window, React, createRoot, assert, components)`. Inject `components.__flushSync` from react-dom. It exercises exact cardinalities/defaults, atomic mixed proposals/rejection/reset, four independent group slots, event veto/errors, parent synchronous acceptance/rejection/release/replacement/unmount, mount defaults, canceled/double/inside/after resets, same-model after-reset action, form transfer, stable refs/focus, disabled/readOnly and multiline composition sequences.

Current author binding/status is in `author-evidence.json`. The earlier 231-scenario/459-assertion pass is preserved with its exact older source and bundle in `revisions/pre-click-cancellation/`; the click-cancellation-fixed revision passed the parent-run 246-scenario/534-assertion suite at `evidence/2026-10-15T05-31-10-162Z-all/next-selection.json`. Both initial shared-scalar failure bindings remain linked from the current author evidence. Browser verification and formal acceptance remain separate. JSDOM `.click()` and `.reset()` execute JSDOM's implementations of default actions; synthetic keydown does not supply browser Space/Tab default action. The synthetic composition sequence is not real OS IME.

Required browser fixtures: each exact ID in uncontrolled and owner-accept/refuse modes; source-default and disabled/readOnly; long localized labels/help/errors and textarea content; 320px/narrow, 200% zoom, both directions, all host light/dark tokens; native click/label/Space/Tab/Enter; real form.reset/cancel/double reset/form reassociation; node/focus stability after parent updates; mobile tap; screen-reader mixed/checked/name announcements; forced colors and reduced motion; native IME, undo/autofill/clipboard. No browser, seven-theme visual or 849-completion credit is inferred from this author's DOM suite.

## 第三切片复制源修订

Switch03仅在无可见自定义label时补来源默认aria-label，显式调用者aria-label仍优先。新增4成员共20条名源断言；当前整套250场景/554断言通过。旧批次534结果及其冻结字节保留，本修订不倒写旧运行时。
