# Follow132 fixed disclosure controls

Four named exports: Collapsible05, Collapsible06, Collapsible08 and Collapsible09. These are four canonical IDs, not one ID per nested field. All fixed source content is included; source and13 primitive/provenance records are in reference/twentyninth-controls. Import @follow-ui/react-seven/styles.css once.

## Common disclosure API (05/06/09)

expanded and defaultExpanded are mutually exclusive readonly ID arrays. onExpandedChange(next, details) is a synchronous proposal after click bubbling. Controlled owners update through props; releasing expanded keeps the last committed selection. Defaults are mount-only. Duplicate IDs normalize into source order; invalid IDs throw RangeError and dual ownership throws TypeError.

Details: literal id, sectionId, open, previousExpanded copy, originating event, stable button and cancel(). Return false, call cancel(), or prevent the synthetic/native event to reject. Event.currentTarget may be cleared; use button. Handler-owner transitions are captured before consumer handlers. Unmount invalidates work. Native disabledness is checked at gesture and queued execution. Repeated accepted gestures accumulate; unrelated parent renders do not reset state.

Other props: disabled, triggerProps per section, native div attributes/ref. Trigger native attributes/events/ref are supported except fixed content, type, generated id and owned ARIA. Root and trigger React19 ref cleanup is supported. Ordinary collapsibles use native Tab/Enter/Space and do not acquire accordion arrow navigation. Buttons are type=button. Fixed content cannot be replaced with children/HTML.

All closed content is unmounted. If closing a section removes the focused inner field, focus returns to its connected trigger only when no explicit outside focus superseded it. Whole-root unmount does not steal focus. Native form reset does not change expanded state.

## Collapsible05 · product filters

Sections: price, ratings, brand, battery. Default all closed. Includes two numeric fields Min Price/Max Price (placeholders50/1200), three ratings4/3/2 & Up, five brands Apple/Samsung/Google/OnePlus/Xiaomi and four battery sizes3500/4000/5000/6000mAh. Compact bordered350px filter card, separate headers/separators and square checkboxes with star rating labels.

inputProps keyed min-price/max-price accepts native input props/ref with exclusive value/defaultValue, fixed type/id and label. checkboxProps keyed the original rating-*, brand-* and battery-* IDs accepts checked/defaultChecked exclusively, native input props/ref and onCheckedChange. The internal Checkbox01 behavior is reused; fixed labels/help cannot be replaced. Each checkbox is a field inside this canonical control, not a new registry entry. See the exported Collapsible05Checkbox and Collapsible05Section unions.

Prices are empty and checkboxes unchecked by default. Fields have no name by default; supply name/form to join FormData. Disabled fields do not submit. Closing a section destroys uncontrolled field edits; reopen restores each mount default. Parent-controlled fields persist when passed again. Native reset affects mounted fields according to native input and verified checkbox reset contracts, but never changes section expansion. Input native onChange ownership differs from disclosure proposals: it is not a cancelable onExpandedChange API. readonly is a native field prop, not a root disclosure mode.

## Collapsible06 · question/answer rows

Sections faq-1/faq-2; default faq-1 open. Both exact project-review questions and full answers are retained. Question, conditional answer, then a small bottom Show answer/Hide answer control, blue closed and rose open. Independent multiple-open state with the common API. No form fields or automatic native-reset state change.

## Collapsible08 · workspace menu

open/defaultOpen are exclusive booleans, default false. onOpenChange(next, details) uses reason trigger/keyboard/escape/tab/outside-pointer/outside-focus/action, previousOpen, event, stable button and cancel(). Refusal/cancellation rules match disclosure proposals. triggerProps and menuProps support native handlers/ref except owned identity/role/associations. itemProps is keyed profile/appearance/notifications/billing/members/teams/projects/logout. onAction(action, details) gives a local id/action/event/button/cancel proposal; it does not log out, navigate or contact a service.

The original Profile, Settings→Appearance/Notifications/Billing, Workspace→Members/Teams/Projects and Log out content remains complete. Profile/Log out accepted actions close the menu; inner local actions keep it open, matching the source inner native buttons. disabled blocks activation; Escape can still request closing an already-open disabled menu, subject to its owner.

sections accepts its own expanded/defaultExpanded settings/workspace array, onExpandedChange, disabled, triggerProps, div attributes and ref. These owners live inside the mounted menu. Both sections default closed. Uncontrolled section state resets after the whole menu closes; controlled parent sections can persist. Inner section toggles do not change the root menu owner.

ArrowDown/ArrowUp open at first/last enabled item from the trigger. Visible enabled menu items support Up/Down wrap, Home/End and typeahead. Right opens an inline section; Left requests closing its section. Focus returns to the section header only after an accepted close really removes focused content; explicit external focus and refusal win. Escape requests close and conditionally returns trigger focus. Tab requests close and moves to the adjacent available document tabstop, falling back to the trigger at a document edge. Outside pointer/focus dismisses without stealing the new focus. Consumer/ancestor cancellation and synchronous owner changes veto stale work. Native Enter/Space button activation is left to the browser, not claimed from untrusted key dispatches.

Declared adaptation: a non-modal root-contained menu instead of Radix's modal portal. No global background inertness, scroll lock, collision engine or portal equivalence is promised. This is an intentional documented boundary, not an omitted hidden requirement. Original nested-button markup is repaired into one real button per trigger. The implementation is fully local.

## Collapsible09 · delivery and payment demonstration

Sections address/delivery/payment; all default closed. Includes Full Name, Address textarea, Pin Code number, City, Landmark; all three original Standard3-5Days/Express/Overnight options with exact prices/date descriptions; Card details with card-number, expiry and cvc fields and original placeholders. Those dates/prices are illustrative fixed source text, not current offers. There is no purchase, payment validation, charge, storage or request.

fieldProps keys: full-name/address/pin-code/city-name/landmark/card-number/expiry/cvc. Props/ref are native with exclusive value/defaultValue and fixed native type/id/label. Per-instance unique IDs replace source duplicates; payment inputs get explicit associated labels. Parent can use name/form/required/readOnly/disabled. No fields have names by default.

deliveryProps is an independent radio owner: value/defaultValue of '1'/'2'/'3'/null, default '2' (Express); onValueChange, name/form/required/disabled, itemProps and labelProps, group div ref. The private engine is adapted from verified RadioGroup02; detail id is collapsible-09 and fieldId is delivery, with reason select/keyboard/reset, previousValue, event, input and cancel(). Array/disclosure IDs are not valid radio values. Controlled radio reset preserves its current owner; uncontrolled reset requests its mount default. No name means no submission field. Native-input grouping, hidden/disabled fields, reset cancellation and external form ownership are tested explicitly.

Radio arrows select the next enabled item, Home/End move focus only, Space selects and Enter does not submit/select. Synchronous consumer owner changes and external focus defeat old deferred gestures. Closing the delivery section unmounts the group: uncontrolled selection restarts at the declared mount default, while controlled parent selection persists. Closing address/payment likewise discards uncontrolled native edits. Native form reset affects only currently mounted fields and never opens/closes sections.

## Source adaptation and evidence

Local SVGs replace icon-library imports; four distinct scoped Follow layouts use native semantics, finite CSS transitions, reduced-motion and forced-colors rules. CSS/semantic tests are not browser render acceptance. No external fonts, images, package installation or services are needed for these four IDs.

examples/follow-new/operations.jsx is an original offset operations board consuming the actual extracted package. It demonstrates separate owners, disabled/refused changes, remounting, native versus parent reset and FormData. Its payment fields are deliberately readonly and unnamed, and the page explicitly asks for fictional demonstration data only.

CURRENT-VERIFICATION.json and qa record actual author/independent results. Real browser layout, trusted keyboard defaults, touch, physical IME, screen reader, forced-colors rendering and formal acceptance remain unverified.

Tab exit uses available light-DOM tab stops around the trigger, ordered by positive tabIndex then ordinary DOM order. Hidden/inert/closed containers and disabled controls are excluded; first-legend and first-summary exceptions and target visibility overrides remain available. This does not claim composed shadow-DOM, platform full-keyboard-access or native browser Tab equivalence; browser acceptance remains pending.
