# Follow React: exact buttons 25–36

This directory implements twelve independently read canonical IDs, `button-25` through `button-36`. It does not inherit acceptance from native adapters, earlier React batches, or Flutter. Import the named exports from `index.jsx`, include `styles.css`, and render under the existing `SevenThemeProvider`. `examples.jsx` is a complete local usage example. No shared entry, provider, palette, Studio, or earlier slice is changed by this module.

## Exact identities

| ID | Original composition | React adaptation and ownership |
|---|---|---|
| 25 | Link-style button; click → spinner/Loading; exactly 1000ms then `Math.random() > 0.5` selects Submitted!/Rejected! | Real React idle/loading/success/error. Chinese labels explicitly identify a random demonstration. No data is saved. Repeated pending clicks are blocked. |
| 26 | Outline icon button, yellow sun ↔ blue moon | Native `aria-pressed`; warm warning ↔ cool info tokens. Only the icon state changes, never the provider/page theme. |
| 27 | Ghost menu ↔ X icon | Native `aria-pressed`, no menu, panel, or `aria-expanded` invented. |
| 28 | Round secondary plus; hidden Add new item label; immediate Radix Tooltip with arrow | Independent React focus/hover/dismissal state; real `role=tooltip`, merged `aria-describedby`, wrapping text and original arrow. No item creation. |
| 29 | Outline bookmark ↔ filled blue bookmark | Native `aria-pressed`; filled semantic-info bookmark. No persistence. |
| 30 | 32px icon face; 20px outlined warning triangle; destructive moving gradient | One actual button; hidden configurable name; locally scoped readable destructive gradient. No error action fabricated. |
| 31 | Text-only primary moving gradient, Get Started | One button, no glyph; host chooses the action. |
| 32 | 42px outlined Post face; separate 28px filled share block before label | The icon block remains a span, never a second control. |
| 33 | Open-envelope icon, Inbox, inline destructive-tint 99+ badge | `count` is host-owned; badge stays in normal flow. |
| 34 | Copy icon overlays an in-flow check; actual Clipboard Promise; success disables for 2000ms | Exact default clipboard text retained. Only uncancelled activation calls `writeText`. Real fulfillment shows the check and success; pending lock, busy status and explicit failures are accessibility/reliability enhancements. |
| 35 | Leading outlined trash icon with destructive moving gradient | No deletion occurs without the host's own handler. |
| 36 | 32px outline icon face; 20px open envelope; primary 3 badge at top/right −10px | Hidden configurable label; count is host-owned; the badge overflows the face rather than joining its row. |

## Native API and cancellation

Every public ref is the actual HTMLButtonElement, including Button28. Standard button attributes, data/aria attributes, form/name/value, type, className, style and native event callbacks are forwarded. Default `type="button"` is an intentional safe adaptation of the source's omitted type. Caller-specified `submit` or `reset` retains native HTML behavior. `disabled` is real native disabled. `readOnly` and boolean/string `aria-disabled=true` block clicks/default actions while keeping the native Tab stop; no invalid HTML readonly attribute is emitted.

Caller `onClick` runs once before internal action; its return value is ignored, including Promises and throwing `then` getters. Either React `event.preventDefault()` or `event.nativeEvent.preventDefault()` cancels internal action. An exception is not swallowed. Native keyboard behavior is not replaced with fabricated keydown clicks. Browser keyboard activation remains separately unverified.

A metadata-only synchronous parent render, focus render, or controlled same-value write does not consume the first activation. A genuine owner/value generation change, changed resetKey/text, disabled/readOnly state, cancellation, or synchronous unmount prevents stale continuation. This is checked against accepted React state and the live target. No internal refocusing or imperative controller is used. Stable callback refs do not detach/reattach on metadata updates or steal focus from an external input; changing ref identity and React 19 cleanup remain supported.

### Toggle ownership: Button26, Button27, Button29

- `pressed !== undefined` means controlled on that render, and the accepted parent value is rendered.
- `defaultPressed` sets the initial uncontrolled state and the reset baseline. Later changes to the default do not mutate current state.
- `onPressedChange(next, event)` proposes one value per accepted activation. Controlled rejection or same-value feedback keeps the parent's accepted value. Uncontrolled state commits only after the callback completes without cancellation or an ownership change.
- Taking control and releasing it work on the same DOM node. Releasing to `pressed={undefined}` retains the last accepted controlled value before later uncontrolled interactions.
- Native form reset or changing `resetKey` restores the original uncontrolled baseline without firing a value proposal. It does not override a controlled parent's value. If control is released and resetKey changes in the same render, reset deliberately wins and restores that original baseline.

### Async cancellation: Button25 and Button34

Changing `resetKey` cancels timers, invalidates old completions and returns to idle. It never restarts an action. External disabled/readOnly/aria-disabled=true and an uncancelled native form reset do the same. A canceled native form-reset event is respected after all its handlers run. Unmount invalidates every pending completion and clears timers. Harmless metadata changes leave the active operation intact.

Button25 is a fixed source demonstration: exactly 1000ms, then a strict `Math.random() > 0.5` branch. It does not expose an arbitrary action/task API and never claims a backend save result.

Button34 accepts `text`, `copyingLabel`, `copiedLabel`, `errorLabel`, `onCopy(text)`, `onCopyError(error)`, and `resetKey`. The exact source default text is “Thank you for using Watermelon UI!”. Missing Clipboard API, an explicitly insecure context, synchronous exception, non-Promise return, or rejected Promise produces the visible failure status. Success starts the source's 2000ms feedback interval only after fulfillment. Changing `text` invalidates the old result and clears feedback. Invalidation cannot undo an already issued system clipboard write. Callbacks use the latest committed handler; their own exceptions surface rather than being recategorized as clipboard errors. Pending lock and `aria-busy` prevent duplicate writes and are documented enhancements beyond the source's success-only disabled state. Both async buttons expose actual text with `role=status` and `aria-live=polite`.

### Tooltip ownership and layout: Button28

Hover and focus independently keep the tooltip open. Leaving both closes it; entering the tooltip itself retains hover. Click reaches the caller once and dismisses the tip unless canceled. Escape dismisses only the topmost open tooltip in the same document without blurring its trigger. Touch hover is ignored. The source's missing menu/item action is not invented.

A layout effect measures the trigger, tip and immediate parent container; horizontal placement uses the parent/viewport intersection, capped at 320px. It selects above or below using available space and limits the text scroller to that side. Very constrained viewport cases overlap the trigger rather than place text outside the viewport. The arrow stays outside the inner scroller. Resize, capture-scroll, visual viewport and ResizeObserver updates are read-only measurements driving React state; closing and unmount remove listeners/observers. Long text is wrapped and can scroll without being truncated.

Important difference: this adapter renders the tip inline rather than in a Radix portal. It retains inherited theme tokens but can be clipped by a consumer ancestor with overflow clipping or affected by transformed ancestors. Host layout equivalence and actual browser collision/hover behavior remain pending. Mock rectangle tests are arithmetic candidates, not rendered evidence. Prefer an unclipped parent container for this candidate.

## Accessible names, theming and intentional visual differences

No default aria-label overrides caller names. Icon-only buttons use configurable children as hidden text; absent children, an explicit title becomes the hidden name, then the translated source fallback. Explicit aria-label/aria-labelledby remain caller-owned. Visible-label buttons preserve their visible content and native title.

Original compact SVG outline/filled geometry replaces react-icons; source icon identity and placement remain. Native 44px targets contain source-sized 32px faces; Button32 keeps its 42px face inside that target. Chinese labels can wrap rather than using the source's universal nowrap. Fonts/radii/semantic colors come only from existing seven-theme tokens. Gradient midpoint strength is adapted to 94% with locally paired text to retain legibility, rather than source 60% transparency. Reduced motion removes spinner rotation and transitions while keeping text feedback; forced-colors rules preserve affordances.

`static-color-pairs.json` mathematically checks primary/destructive gradients at endpoints and authored midpoint in all 14 theme/mode combinations. All 28 pairs exceed 4.5:1; minimum 5.719:1. This is not evidence of actual browser rendering, antialiasing, disabled-state contrast, or a full accessibility audit.

## Source and license

Pinned upstream: WatermelonCorp/watermelon-platform commit `424fe703d19b39e86bef90c4ba0a76ef8c1fb260`. Canonical catalog SHA-256: `5889ad208f21613a098b697ac4fd8d879068a9b2801264d9983e71a39a05fe6a`.

`source-hashes.json` records freshly recomputed Git blob SHA-1, SHA-256, byte count and exact commit URL for all 12 source variants, shared button/tooltip/badge primitives, metadata, utils and MIT license. Exact read-only source copies are in `sources/`. `LICENSE.upstream` preserves the complete MIT license and copyright notice. Previous source/native acceptance is deliberately not carried over.

## Verification status

Latest author execution: `evidence/2026-10-15T06-39-10-336Z-fourth-buttons`, React 19.3.0, 12 IDs, 214 scenarios, 1145 assertions, exit 0, jsdom warnings [], actual stderr 0 bytes. Timer/random/clipboard/geometry tests use explicit mocks. This does not establish real OS clipboard permissions, trusted user activation, browser keyboard/screen-reader behavior, narrow visual parity, actual tooltip collision, rendered reduced motion/forced colors, or independent acceptance. Type declarations and `type-tests.tsx` are authored; TypeScript compilation has not run because this project has no installed TypeScript compiler. No package was installed. Independent review, browser QA and formal source parity remain pending.

One earlier test-only failure is retained in `evidence/2026-10-15T06-29-52-025Z-fourth-buttons`: it incorrectly expected native preventDefault to cancel a real noncancelable focus event. The corrected test explicitly dispatches a cancelable focusin event when testing that boundary. Product code was unchanged for that correction.

### TypeScript回调名

Button34的onCopy是复制成功文本通知，因此声明明确从原生button props中排除同名剪贴板事件；原生事件捕获可用onCopyCapture。消费者严格编译保存并修复了原声明同名冲突。
