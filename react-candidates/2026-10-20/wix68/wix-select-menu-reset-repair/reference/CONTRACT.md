# Wix50 exact-source and adaptation contract

## Result
All four originals are available and match the current 849 ledger and upstream tree byte-for-byte. The four variants are custom Radix popup selects, unlike native select-01–09. An offline +4 batch is feasible only as an explicitly documented custom React popup replacement. No implementation, installs, network access, candidate edits or acceptance credit occurred.

Source cache: `source originals retained in this reference directory`
Current read-only candidate: `source originals retained in this reference directory`

## Exact identities

### select-10
- File: `source originals retained in this reference directory`
- Git blob / ledger SHA: `50473b5abfbfc512b1547fbf5525678fb262e11f` (match)
- SHA-256: `eb22f0640bee3c5547321c8713d41258b35b8adb811c6fe2ed703b6a57ea282c`
- Label: Favorite Fruit; placeholder: Select a fruit; default: 'apple'.
- Distinction: One labeled fruit group; Apple initially selected; no helper or leading icon.
- Options: apple → Apple; banana → Banana; blueberry → Blueberry; grapes → Grapes; pineapple → Pineapple.
- Group: Available Fruits.

### select-11
- File: `source originals retained in this reference directory`
- Git blob / ledger SHA: `9ba74c8e5302671c394f630dfd511e3edf1f6dd6` (match)
- SHA-256: `7c0b340156a96cc1ba5ef2f19401049c914349b3bbfc83999dc8e8d25bb7cb6e`
- Label: Primary Specialization; placeholder: Identify your core skill; default: ''.
- Distinction: One labeled engineering group; initial empty value must show placeholder and must not auto-select first option.
- Options: frontend → Frontend Development; backend → Backend Systems; fullstack → Full-Stack Engineering; devops → SRE & DevOps; security → Cyber Security.
- Group: Engineering Roles.

### select-12
- File: `source originals retained in this reference directory`
- Git blob / ledger SHA: `034aba8afaabbbe9f0a97d99e91c33d23a924ff2` (match)
- SHA-256: `58d52fe523a7dd6105844210859f307286674cd216cdba67b8e7b10902bbabba`
- Label: Deployment Target; placeholder: Identify platform; default: 'web'.
- Distinction: Ungrouped deployment targets; Web Application initially selected; persistent leading desktop icon before selected text.
- Options: web → Web Application; mobile → Native Mobile; desktop → System Desktop; cloud → Cloud Infrastructure.
- Group: none.

### select-13
- File: `source originals retained in this reference directory`
- Git blob / ledger SHA: `0217a485f6c4d67b40612076e86f93aa6e8c3dce` (match)
- SHA-256: `64306737e1ec276a4d853c34cc99cb4d7f35102f75d9ffb36b5328941fe0d960`
- Label: Release Method; placeholder: Choose a strategy; default: 'rolling'.
- Distinction: Ungrouped release strategies; Rolling Update initially selected; static polite region helper remains below control.
- Options: rolling → Rolling Update; canary → Canary Deployment; blue-green → Blue-Green Switch; recreate → Full Recreate.
- Group: none.

## Wrapper audit
- Root is pure prop forwarding. Local code does not own open state, selected state, focus, typeahead, keyboard or reset. Those are delegated to radix-ui.
- Portal > Content > Viewport, both scroll buttons and selected check indicator are explicit wrapper structure.
- Disabled props pass through and have styling, but the four datasets contain zero disabled items and no disabled roots.
- Hidden select/form bridge is not visible in the wrapper; exact runtime/Tab/reset semantics are unverified. No variant supplies name/form/required or a reset handler. There is no authored named FormData output.
- Select13 has a static polite region but no aria-describedby link. Add that association only as an explicit accessibility correction.

## No-install boundary
- Available: React/DOM 19.3.0, esbuild 0.28.2, TypeScript 7.0.2 and JSDOM 30.1.2 in the shared toolchain. Showcase vendor runtime is separately React/DOM 18.2.0 and exports createPortal.
- Unavailable in that toolchain: radix-ui, @radix-ui/react-select, lucide-react, @tabler/icons-react, clsx, tailwind-merge and tailwindcss.
- Implement shared React popup behavior, scoped CSS and original simple vector symbols; disclose engine/style/icon substitutions. Existing native-select implementation/types/tests cannot establish custom-popup equivalence.

## Accurate minimum contract
1. Render four distinct visible custom button triggers, not visible native selects; preserve exact source labels, placeholders, option values/order, group labels, defaults, desktop-icon placement and helper copy.
2. Use per-instance stable unique trigger, popup, group and option IDs. Trigger has accessible name, role=combobox, aria-haspopup=listbox, aria-expanded and aria-controls. Portaled popup is a named listbox; options expose selected state; group headings are not selectable.
3. Preserve separate open state, selected value and highlighted/focused option. Opening/highlighting/canceling never changes selection; committing an option changes local display and closes. Select11 starts empty with its authored placeholder.
4. Implement and test pointer opening/commit; Enter/Space/Arrow opening; ArrowUp/Down, Home/End and buffered printable-key typeahead; select with Enter/Space; Escape and outside-pointer dismissal. Ignore IME/composition and modifier chords for selection.
5. Define one focus model explicitly. Proposed roving option focus: focus selected enabled item (or first/last according to opening direction), return focus to trigger after commit/Escape, do not steal focus on outside pointer, and close on Tab while allowing onward tab navigation. This is the proposed replacement contract, not a verified statement of exact Radix behavior.
6. Render popup through ReactDOM.createPortal into the trigger ownerDocument body. Measure trigger, track resize/scroll, preserve a 4px placement input and source translate effect intentionally, clamp/flip for viewport space, keep popup untransformed/unclipped, scroll focused item into view and supply overflow scrolling affordances.
7. Preserve max-w-xs/full-width compact layout, rounded-xl trigger/popup, rounded-lg items, subtle borders/trigger shadow, stronger popup shadow, visible chevron and selected check, and focus/hover/dark/reduced-motion states via explicit Wix adaptation.
8. Keep select13 helper static with role=region and aria-live=polite; associate helper to trigger with aria-describedby as a documented source-defect fix. Selecting release/platform values performs no deployment or settings write.
9. No source-level form submission API is required: no name, no successful named FormData entry, and no promised hidden-select/reset behavior. Never introduce a visible native fallback while counting custom-popup adaptation as complete.
10. Cleanup document listeners, observers and typeahead timers on close/unmount; test concurrent independent mounts, SSR/rehydration without browser-global access during render and no cross-instance focus leakage.

## Added APIs are separate work
- value/defaultValue/onValueChange and open/defaultOpen/onOpenChange: define owner authority, reject/accept/cancel semantics and callback counts; do not infer these from parameterless originals.
- options/groups/disabled/readOnly/required: validate unique string values; empty value is placeholder only; skip disabled items and support no-enabled-option state. These are additions to the four fixed datasets.
- name/form/native validation/reset: if offered, add a deliberate hidden form bridge with DOM-owner semantics, disabled omission, exact FormData values, canceled reset, controlled owner authority and event-time synchronization tests. A hidden select by itself does not prove custom state reset.
- trigger/portal/listbox styling, ref forwarding and portal containers: specify correct HTMLElement types rather than borrowing HTMLSelectElement types.

## Acceptance gate
- Identity test for all four exact Git blobs and retained Watermelon MIT notice.
- Per-ID rendered/interactive tests in actual React with initial state, exact options/groups, distinct visual features and no phantom callbacks.
- Keyboard/typeahead/focus/portal/dismissal and disabled additions tested independently from existing native-select tests.
- Fresh packed-consumer ESM/CJS/strict declarations/SSR tests, plus React 18.2 showcase compatibility separately.
- Real-browser pointer and keyboard checks at narrow/mobile and desktop sizes, zoom/long labels, popup collision/clipping, focus visibility and independent mounts.
- Originals, source hashes, contract deviations and dependency substitutions recorded; no browser/form/accessibility claim based only on JSDOM or code inspection.

The JSON includes full exact option/group/default records, source URLs, computed wrapper hashes and dependency inventory. No source blocker remains. Native textarea fallback is unnecessary.


## Authorized implementation additions
The production adapter additionally implements controlled/uncontrolled selection and popup ownership, callback cancellation, disabled items/groups/root/fieldset, readonly, and a hidden native form bridge with name/form/required/FormData/validation/reset. These are deliberately specified adapter APIs, not behavior proven from the parameterless original demos or unavailable Radix runtime. The visible UI remains a custom portaled listbox. Native bridge and React owner race tests are separate from historical native-select tests. Source and model evidence do not grant browser or formal acceptance.
