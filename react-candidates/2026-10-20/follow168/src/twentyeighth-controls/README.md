# Four fixed-content FAQ controls

Canonical IDs: accordion-12, accordion-14, accordion-15, accordion-16. React only, candidate, not browser/formal acceptance. Exact original content and first-open defaults are retained. Import the four named exports from @follow-ui/react-seven and styles.css once.

## Per-ID identity

- Accordion12: three HR questions. Individual bordered cards, transparent closed borders, expanded border/shadow, 8px gaps and a trailing down/up marker.
- Accordion14: three SaaS questions. Compact 6px-separated rows, a 32px bordered circular plus/X, and a neutral open marker background.
- Accordion15: Project Planning, Team Operations and Client Support, with three complete FAQs each. Category-specific folder, clipboard and support icons, outer down/up markers and leading inner chevrons.
- Accordion16: Campaign Planning, Content Workflow and Performance Tracking, with three complete FAQs each. No category icons; rotating outer chevrons and trailing inner markers visible only when open.

There are no empty substitutes. All three categories and all nine answers in each nested variant are included. Pinned originals, primitive sources, license and hashes are in reference/twentyeighth-controls. The canonical prose is illustrative; no service, account, HR or marketing operation takes place.

## Shared outer API

value or defaultValue, never both, is a readonly array of item-1/item-2/item-3. Multiple items may open; the default is ['item-1']. Arrays are deduplicated into source order; invalid IDs throw RangeError. defaultValue is read on mount. onValueChange(next, details) proposes a selection after click bubbling. Controlled changes require an owner update. Removing value while mounted retains the last committed owner selection.

details contains the literal canonical id, itemId, open, independent previousValue snapshot, originating React click event, stable button and cancel(). React event.currentTarget may be cleared later; use details.button. Return false, call cancel(), or prevent the synthetic/native originating event to reject synchronously. Cancel does not roll back unrelated parent changes. Native non-cancelable events cannot be canceled through native preventDefault alone. Handler/ancestor owner transitions and unmount invalidate stale queued work; native disabledness is rechecked immediately and when queued work runs. Rapid accepted gestures preserve ordering; snapshots cannot mutate internal state.

Other props: disabled, triggerProps keyed by item ID, orientation (vertical default), loop (true default), dir, native div attributes and forwarded div ref. triggerProps accepts native button attributes/events/ref except protected content, type, id and ARIA ownership. React19 callback-ref cleanup is supported. Root/trigger children and dangerouslySetInnerHTML cannot replace the fixed content. Each real button has type=button, unique stable trigger/content IDs, aria-expanded and aria-controls. Root and single-trigger disabled states and inherited disabled fieldsets are respected, including first-legend exemption.

Arrow keys, Home and End move focus among enabled outer triggers, respecting orientation, LTR/RTL and loop. They do not change selection. Enter/Space use native button activation; composition and modified navigation keys are ignored. Deferred navigation preserves focus explicitly moved elsewhere by a consumer or ancestor.

## Nested FAQ API and lifecycle (15/16)

faqProps is optionally keyed by outer item-1/item-2/item-3. Each group accepts its own value/defaultValue array of faq-1/faq-2/faq-3, onValueChange, disabled, triggerProps keyed by FAQ ID, ref and native div attributes. Each group's default is ['faq-1']; inner ownership and cancellation have the same rules as the outer owner. The public types are Accordion15FaqValue/FaqChangeDetails/FaqProps and Accordion16FaqValue/FaqChangeDetails/FaqProps.

Inner details contains id, categoryId, faqId, open, previousValue, event, button and cancel(). An inner click never changes outer selection or invokes outer onValueChange. Group state is isolated from other categories. Root disabled cascades; group disabled affects only that category; a trigger disabled affects only that FAQ. Inner controls are native collapsibles: Tab, Enter and Space retain browser behavior. They do not gain accordion Arrow/Home/End navigation, and outer navigation never lands on them.

Closing an outer category unmounts its entire inner group, matching the pinned original. Uncontrolled FAQ state is destroyed and reopening uses that group's mount default again. To persist inner selection across category closure, supply explicit controlled FAQ values in the parent. Releasing a controlled value while the group remains mounted retains its latest owner state. Owner changes, category closure and component unmount invalidate pending inner gestures, so they cannot call an obsolete callback.

If a focused inner control is removed by closing its category, focus returns to the still-connected outer trigger only when focus was inside that panel and has not been moved elsewhere. An explicit outside focus wins. Whole-component unmount does not refocus a disconnected trigger. Outer headings are h3, inner headings h4. Only the outer containers are landmark regions; inner labelled containers avoid unnecessary nested landmark proliferation.

## Forms and adaptation

These are non-form state controls with no submitted fields. Native form reset does not change outer or inner selection. Explicit parent state/key reset is separate. examples/follow-new/workflow.jsx demonstrates controlled outer and inner owners, rejection, disable, unmount/remount, empty FormData and both reset mechanisms using the actual extracted package.

Local SVGs replace icon-library imports. Follow paper/ink/orange tokens are scoped to these controls, with reduced-motion and forced-colors rules. Finite CSS reveal replaces measured Radix height animation; no pixel or animation-frame equivalence is claimed. The15 inner rotation intended by the original is explicitly bound to the actual open state; the16 closed inner marker retains its reserved spacing. These declared adaptations do not change fixed copy or lifecycle.

React/JSDOM, source/package types, SSR and bundled page checks are automated evidence. Real browser layout, trusted keyboard defaults, physical IME, touch and assistive technology remain unverified. See CURRENT-VERIFICATION.json and qa for exact evidence; no pass claim is inferred from total candidate counts.
