# React buttons 04–12: exact-ID candidate

Nine exports, each mapped to its exact canonical source path at Watermelon revision
`424fe703d19b39e86bef90c4ba0a76ef8c1fb260`. The local original files were read in full
and freshly Git-blob/SHA256 checked. See `source-hashes.json`, `sources/` and the
MIT notice in `LICENSE.upstream`. No network reacquisition or dependency installation.

## Exact source differences

| ID / export | Source contract | React implementation |
|---|---|---|
| button-04 / Button04 | Explore More then arrow; 200ms right 4px + scale 1.1 | Native action with trailing decorative SVG arrow and matching motion |
| button-05 / Button05 | Disabled, leading ban icon; original typo “Disabed” | Permanently disabled; translated “已禁用”; cannot be enabled by disabled=false |
| button-06 / Button06 | Primitive sm, 28px, 0.8rem text | 28px face, 0.8rem text, native target at least 44px |
| button-07 / Button07 | Primitive lg, 36px | Distinct 36px face inside native target at least 44px |
| button-08 / Button08 | 24px, 12px text, 8px horizontal padding | Exact distinct xs face metrics, native target at least 44px |
| button-09 / Button09 | Disabled Loading; three 4px dots with -.2/-.1/0s stagger | Permanently disabled/busy, three decorative CSS dots, no request or timer |
| button-10 / Button10 | Upgrade then bolt; 200% gradient shifted over 500ms | Real moving gradient in theme accent colours and trailing filled SVG bolt |
| button-11 / Button11 | Delete; leading trash and low-emphasis destructive colour | Danger text/border/tint/focus pair, leading trash; no deletion performed |
| button-12 / Button12 | Favorite; leading outline star, rounded-full, no toggle | Outline star and local pill geometry; no invented pressed/checked state |

The private `NativeButton` only shares real native event/attribute/ref plumbing.
The nine source variants are explicitly implemented and independently asserted.
No existing scalar or native-adapter test result is counted for this slice.

## API and ownership

- Import `Button04` … `Button12` from `./index.jsx`; `index.d.ts` contains matching types.
- Native `ButtonHTMLAttributes<HTMLButtonElement>` target the actual button, including
  `onClick`, `onFocus`, `onKeyDown`, `form`, `name`, `value`, ARIA/data props, class and style.
- The `forwardRef` value is the actual `HTMLButtonElement`, not the visual inner face.
- `children` replaces only the label. Use a meaningful visible label or `aria-label`.
  Icons/dots are decorative and create no extra tab stops.
- `type` defaults to `button` as a deliberate safety addition. Explicit `submit`/`reset`
  and external form association use native HTML behavior. `onClick.preventDefault()`
  cancels the native default action.
- `readOnly` is an adapter addition, maps to `aria-disabled=true`, stops activation,
  and does not add the invalid native readonly attribute. The button remains focusable.
- Native `disabled` blocks activation. ARIA boolean/string true also blocks it;
  boolean/string false does not block active variants.
- Button05 and Button09 are fixed-disabled source samples. They ignore attempts to
  pass `disabled=false`; types accept only `disabled?: true`. Button09 additionally
  fixes `aria-busy=true`, regardless of caller overrides. They are not general
  “disabled state” or “loading state” controllers.
- All other variants emit ordinary React `onClick`; no private action callback,
  fake navigation, purchases, deletion, favorite toggle or async promise handling.
  Callback results are ignored and errors propagate through React normally.
- There is no state model to reset and no effect/listener/timer lifecycle. React owns
  stable nodes and ref cleanup. Rerenders retain focus; the adapter never steals
  focus back after the host transfers it or synchronously replaces/unmounts a node.
- Keyboard Enter/Space activation stays native. Synthetic keydown does not pretend
  to be native browser activation; no key interception is added.

## Seven themes and geometry

Keep the existing provider and its seven palettes: echo, bloom, neuro, follow, wix,
maigawara and goons. Import the shared `tokens.css`, `base.css` and this slice's
`styles.css` once. No theme or product was added.

The visible face preserves the source's size hierarchy: default 32px, small 28px,
large 36px and extra-small 24px. Its native clickable target is at least 44px in both
dimensions. The face can grow for wrapping labels, zoom and larger type. Therefore
this is a touch-accessible theme adaptation, not a source-pixel-equality claim.
Default corners use theme tokens, while button-12 intentionally retains its source
pill shape even in square themes. The source sky gradient becomes a semantic accent
gradient. Icons are locally authored SVG symbols, not copied react-icons geometry.

Both OS reduced-motion and provider `data-motion="off"`/`"reduce"` stop the dots,
arrow and active transforms and gradient shift. Forced-colours rules use system
colours. Real per-theme contrast, geometry, keyboard, hover, touch, zoom and motion
rendering still need browser evidence.

## Usage

`examples.jsx` contains a genuine React host example using `useState` for its event
count and `useRef` for explicitly requested host focus. It demonstrates all nine
exports. The variants themselves remain stateless because their official sources
are stateless. Example labels “升级演示” / “删除演示” record local UI events only.
`type-tests.tsx` contains the corresponding consumer type fixture.

## Test integration and status

`../../tests/next-buttons-tests.cjs` exposes the same
`run(window, React, createRoot, assert, C)` interface as the existing scalar suite.
Inject `C.__flushSync` for synchronous host-unmount probes. Compile the real JSX
exports; do not mount any frozen DOM adapter. Tests cover every ID independently,
source structure, fixed disabled/busy invariants, native attributes, actual click,
submit/reset/form association, cancellation, focus ownership, StrictMode ref cleanup,
exception forwarding and non-intercepted keys. CSS source checks are explicitly
static, not rendered visual or motion acceptance.

Author suite first run passed on React 19.3.0: 9 IDs, 121 scenarios, 563 assertions,
synchronous host-unmount probes included, exit 0 and no JSDOM warnings. Evidence:
`../../evidence/2026-10-15T05-21-55-648Z-next-buttons/` (candidate-root-relative path
is `evidence/2026-10-15T05-21-55-648Z-next-buttons/`). Command:
`node --max-old-space-size=128 tools/test.mjs next-buttons`.

Independent runtime, real browser keyboard/pointer/motion/layout, type compilation
and seven-theme visual acceptance are pending. The author run does not satisfy any
of those gates and does not inherit previous tests. No publication was performed
by this slice.
