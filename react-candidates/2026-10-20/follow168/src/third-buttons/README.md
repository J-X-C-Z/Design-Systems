# Follow React buttons 13–24

Direct React implementations of twelve exact canonical Watermelon samples at commit
`424fe703d19b39e86bef90c4ba0a76ef8c1fb260`. All 18 included source/license files were
freshly Git-blob checked against the cached official Git tree. Per-source SHA256s
are in `source-hashes.json`; per-ID contracts are in `contracts/third-buttons.json`.
The MIT notice is retained in `LICENSE.upstream`.

## Imports and native targets

Use these components within the unchanged `SevenThemeProvider`, importing the
project styles or this folder's `styles.css` alongside the provider/base styles.
`examples.jsx` has all twelve individually configurable long-Chinese examples.

- Button13: copy-icon outline action. Native button props, children and button ref.
- Button14: download-icon dashed action. Native button props, children and button ref.
- Button15: URL shell plus independent copy-icon button. `url` is inert displayed
  text with its full value in title. `children` names only the icon button (sr-only).
  Native attrs, onClick, className and ref all address the button. `shellClassName`
  addresses the visual wrapper. No clipboard call.
- Button16: save icon plus label, softly tinted.
- Button17: warning triangle plus label, warning colors.
- Button18: two actions. `cancelLabel` and `confirmLabel` are independent ReactNode
  values. `cancelProps` and `confirmProps` each accept native button attrs, ref and
  onClick. The group ref is an HTMLDivElement. `BUTTON18_MEMBERS` is exactly
  `['cancel', 'confirm']`.
- Button19: ghost back action, leading arrow moves left 4px over 180ms.
- Button20: real HTMLAnchorElement, not a button. Anchor attrs, href, children and
  anchor ref pass through. Default href is `#`. `disabled`/`readOnly` only guard
  click/default navigation with aria-disabled; they do not create native disabled
  anchor semantics or remove href. Host demos should preventDefault when needed.
- Button21: icon-only provider row. Button22: labeled provider column. Both accept
  `providerLabels` (string map) and `providerProps` (native button/ref/handler map).
  `BUTTON_PROVIDERS` is exactly `['google', 'x', 'facebook', 'github']`; order is
  fixed. Group ref is an HTMLDivElement. Button21 names all four icon-only targets;
  Button22 updates every visible and accessible label. No OAuth is supplied.
- Button23: bell, label and `count` badge (host-owned, default 8). Count contributes
  accessible text unless the owner explicitly sets aria-label.
- Button24: avatar and nickname. `avatarSrc` defaults to an original local SVG;
  null/empty uses `avatarFallback`. Loading/error/success use React state, ref and
  a mount effect. A keyed image owns each source generation. `avatarAlt` defaults
  empty, `avatarFallback` defaults FU, children default @Follow. Passing a remote
  source lets the browser request that image; no remote request exists by default.

## Events, locks and form behavior

Native buttons default to type=button (an intentional safety change from the
source primitive's omitted type); explicit submit/reset/form/name/value work.
Native button refs and event.currentTarget always identify the actual control.

In compound components, top-level onClick is the default for each member without
its own onClick. A member handler replaces that default; handlers are never
chained. Group disabled/readOnly/aria-disabled=true locks every member and cannot
be undone with a member's false setting. A member's own disabled/readOnly/aria
lock affects only that member. Group native DOM attrs/events address the group;
button attrs belong in cancelProps/confirmProps/providerProps.

ReadOnly is an adapter addition: it suppresses activation/default actions while
preserving focusability and exposes aria-disabled. Actual disabled remains an
HTML button property. Boolean and string `aria-disabled=true` are blocked; false
and string false remain active. No invalid readonly/disabled attr is put on links.

Standard onClick preventDefault is honored. Return values/thenables are not read
or awaited. Exceptions surface through React. There is no post-callback state,
focus, timer or default-action simulation, including after synchronous owner
updates/unmounts. Native keyboard handling remains browser-owned; keydown alone
never produces an adapter-synthesized click.

## Explicit adaptation limits

This is a Follow semantic/layout adaptation, not exact pixel or dependency parity.
32px source faces sit in at-least-44px native touch targets; text wraps and may
expand the face. Button15 shell grows beyond 48px if needed. Original SVG geometry
replaces react-icons paths. Semantic info/warning/success/danger color pairs use
existing seven-theme tokens; hover inset emphasis replaces stronger translucent
source tints to preserve contrast. Google/Facebook text uses danger/info pairs.
Button20 underline is attached to the wrapping inner label. Button24 replaces the
external personal photograph/name/fallback with an original local avatar/@Follow/FU.

Source Button19 explicitly moves 4px, regardless of any older catalog prose.
System/manual reduced-motion and forced-colors CSS are authored. Real-browser
rendering, keyboard activation, screen-reader output, narrow layouts, 14 theme
modes, screenshot comparison and TypeScript compilation remain unverified until
separately recorded. No native/Flutter or earlier React test credit is inherited.

## Actual author verification

`node --max-old-space-size=256 tools/test.mjs third-buttons` exited 0 with
12 IDs, 163 scenarios and 923 assertions on React 19.3.0; JSDOM warnings were empty.
Evidence: `evidence/2026-10-15T05-59-36-440Z-third-buttons`. This covers native
composition/refs, independent member labels, disabled/readOnly/aria guards,
submit/reset, callback cancellation/thenable/throw/synchronous update/unmount,
and avatar load/error/source replacement/two-instance isolation. It does not
prove browser pixels, real keyboard activation, CSS or TypeScript compilation.
