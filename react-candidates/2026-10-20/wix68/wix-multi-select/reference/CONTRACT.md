# Select32 / Select33: implementation contract

This batch adapts two genuine Popover multi-selects. It does not turn them into a single-select or claim Radix equivalence. Original source identity is pinned by IDENTITY.json. Frozen Wix66 remains unchanged. Select30/31 remain pending and are outside this batch.

## Original content and structure

- Select32: label `Active Pipeline Services`; initial values `['monitoring']`; options in DOM order monitoring / Real-time Monitoring, logging / Log Aggregation, analytics / Security Analytics, backups / Automated Backups. Empty summary `Select operations`; single summary is the complete option label; plural summary `{n} operations active`.
- Select33: label `Communication Channels`; initial values `[]`; options email / Primary Email, sms / SMS Gateway, push / Mobile Push, slack / Slack Webhook, discord / Discord Bot. Empty summary `Select notification paths`; single summary is the complete label; plural summary `{n} channels selected`. Preserve the helper `System alerts will be delivered via all selected channels.` It is example copy, not an actual delivery commitment.
- Both originals use a Button trigger and portaled Popover with start alignment, trigger width and 4px offset. Popup children are real toggle buttons. Full row labels and conditional right-side checkmarks remain; the trigger has its own chevron. Toggling keeps the popup open. Adding appends to the state array; removing preserves remaining order. Empty selection is allowed.
- Original controls have no form API, caller ownership, disabled entries, clear button, chips, arrow/typeahead logic or explicit accessible pressed state. Those are documented adapter additions, not claims about original behavior.

## Public ownership and data

- Export Select32 and Select33, forwardRef<HTMLButtonElement>, from @studio/wix-multi-select. Flat, dense readonly option arrays only: unique nonempty string value, plain string label, optional disabled. No groups, separators, images or arbitrary ReactNode descriptors.
- Independent controlled/uncontrolled axes: value: readonly string[] versus defaultValue; open versus defaultOpen. Strict unions reject simultaneous defaults/owners. Values are dense arrays of unique nonempty strings, copied at boundaries; emitted arrays are immutable snapshots.
- Missing values remain latent in the state/owner array. They are omitted from summary, chips and native bridge until a matching option returns. A new toggle preserves latent values and existing selection order. Reordering options changes display/form order, not state selection order.
- Controlled proposals never optimistically override the owner. Releasing control retains the latest controlled array/open state. Newer explicit owner updates, ownership mode changes, disable/readOnly, unmount, accepted reset and external focus decisions take precedence over older queued gestures. Accepted earlier gestures in the same task do not accidentally cancel later accepted gestures.
- onValueChange(next, detail) uses reasons pointer, keyboard, clear or remove; onOpenChange uses trigger, keyboard, escape, tab, outside-pointer or focus-out. Details expose the original Event and synchronous proposal-local preventDefault. React/native defaultPrevented, including late ancestor/document/window cancellation, is respected before proposal execution. A canceled value change does not close the popup. Toggle never implicitly closes it.

## Accessible popup and keyboard

- Trigger is a real type=button with aria-haspopup=dialog, expanded/controls and a real visible-label association. Popup is a nonmodal, named role=dialog, not a listbox. Options are type=button with aria-pressed and visible focus treatment. Helper and error are described by the trigger; explicit caller aria-invalid/error remain authoritative.
- Opening focuses the first enabled button, or the popup itself if none are enabled. Enter/Space activate the native trigger/toggle exactly once; Escape requests close and restores trigger only after an accepted close and only if the user did not explicitly move focus elsewhere.
- All enabled options participate in sequential Tab order. Internal Tab/Shift+Tab moves between options. At the boundary request close, then move relative to the trigger in ordinary light-DOM tab order; Shift+Tab from the first returns to the trigger. Refused/canceled close keeps focus in place. If no external destination exists, use the trigger. No modal focus trap.
- ArrowUp/Down wrap enabled buttons; Home/End go to first/last. Printable unmodified text performs buffered label-only typeahead; repeated characters cycle. Composition/keyCode229 and modifier shortcuts are not intercepted. Repeats may navigate/search but must not duplicate trigger/selection activation.
- Callback/capture/bubble/document/window focus changes outrank deferred navigation, opening and restoration. Dynamic metadata/option replacement preserves owned focus only; removing/disabling a focused option chooses an enabled fallback only while focus is still owned by the popup. Never reclaim a deliberate external focus after a refused focus-out close.
- Popup uses the trigger's ownerDocument, bounded geometry/scroll overflow, RTL, reduced-motion and cleanup. Outside pointer/focus events ignore the complete field including optional clear/chips. Native event methods must be restored even when another frozen popup package is simultaneously mounted.

## Optional clear and chips enhancements

- clearable and showSelectedItems default false, preserving the source's summary-only appearance. When requested, render separate type=button controls outside the trigger, never nested buttons. Chips show complete labels and individually accessible remove names.
- Per-option disabled values cannot be changed through row, chip or clear. Clear removes all currently available enabled selections, preserving disabled and latent values; its name states `Clear available selections`. It is unavailable when there are no mutable selections. Component disabled/readOnly blocks all mutations.
- Clear and remove keep the popup open. A removed focused chip transfers focus to the next surviving enabled removal control, then the previous, then clear/trigger, but never steals focus explicitly moved by a handler. Parent rejection/cancellation leaves the selection and focus stable.

## Native form bridge and reset

- Use a real visually hidden select multiple bridge, with name/form/required and disabled semantics, selected options in DOM order. Callback/state order is insertion order; FormData repeated names are native option DOM order. There is no empty placeholder option in the multiple bridge. Disabled/latent options are documented separately from JSDOM's successful-field limitations.
- readOnly blocks UI edits but preserves successful fields; it suppresses required constraint validation. required removal/disable clears only transient native-invalid feedback. Explicit error/aria-invalid remains. Bridge invalid focuses the visible trigger when not canceled; no hidden-control focus trap.
- Accepted native form reset restores the mount snapshot only for uncontrolled state, clears transient invalid and closes only uncontrolled open. It emits no value/open callback. Controlled owners keep their latest values/open, including synchronous same-value reset updates or mount/remount/owner handoff within the reset event. Canceled reset changes nothing internally.
- Observe reset at document capture and decide after propagation/defaultPrevented; form or later capture/bubble stopPropagation is covered, earlier window/document interception is explicitly outside that observation guarantee.
- Exercise reset→toggle, toggle→reset, reset→toggle→owner, multiple resets, canceled reset, external form association and remove/reassign form. Pending gesture invalidation must account for fieldset disabled→enabled roundtrips after the gesture, while allowing earlier roundtrips and first-legend exemptions.

## Verification scope

Source and actual package need independent array/ownership/cancellation/reset/focus/typeahead/form/clear/chips tests, strict exactOptional source/declaration types, SSR/hydration/ref cleanup and no-match guards. Old single-select passing matrices are supporting infrastructure evidence only, not proof of this new collection model. Full examples must perform real local multi-selection work and real export generation without sending messages or changing services. Browser/device/AT/formal acceptance remain unverified.
