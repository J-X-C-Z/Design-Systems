# Midcentury / 活泼印刷识别 Browser QA

2026-10-11 UTC. Existing dot cloud Chrome; no Work/Codex/Pro mode and no generated photography used for this style.

## Page
Private candidate route: /candidates/midcentury-modern/

## Confirmed
- Actual browser screenshots show Song/Ming-like Chinese serif character shapes: conspicuous thick/thin contrast and triangular stroke terminals. This is visual confirmation on this cloud browser, not a cross-platform font guarantee.
- Black-and-white four-page overview has different poster, reading, ledger and specimen structures rather than four reskinned cards. Screenshots: poster-browser.jpg, overview-browser.jpg.
- Native 320px CSS iframe screenshot retains title, navigation, buttons and symbol without page horizontal overflow. Screenshot: mobile320-browser.jpg.
- Four pages × CSS iframe widths 320,390,768,1440: all 16 states activated via keyboard Enter; each correct heading visible, scrollWidth=clientWidth. 12 ledger rows in DOM. These are real CSS iframe viewport tests, not physical-phone tests.
- Edited two Chinese title fields to 印刷验收 / 岸线 QA, ink to #303c48, selected C and changed C offset to 2 via keyboard ArrowRight. Real JSON and HTML downloads retained all fields.
- Reopened the exact first edited HTML at /qa-export: Chinese renders correctly; edits, color, C offset survive; four routes work; keyboard selection of B changes selected state, explanation and offset readout correctly.
- Candidate is intentionally static. No positive-duration CSS animations found among visible main elements; no moving effects observed. Pause/replay do not apply. OS reduced-motion emulation not performed.
- Latest default real browser download final-export.html: 30,945 bytes, UTF-8 BOM, charset at byte50, original title and all default colors/zero offsets, no Sites edit URL or module scripts.

## Issues found and bounded retest
- Original C notch at actual 64px was too subtle to distinguish reliably from A. Screenshot ledger64-browser.jpg records original. Builder enlarged notch and added a native64px comparison strip. First strip was obscured by fixed header; builder notified, awaiting corrected viewport.
- Builder independently found special-character export escaping bug. Browser then edited 潮 <线> & 观察 and downloaded special-export.html after fix. Downloaded HTML has correct escaped text and JSON decodes exactly to original string. Browser reopen still pending at writing time.

## Limits
No physical mobile device, 200% browser zoom, OS-level reduced-motion change, print driver or platform-specific font fallback tests. No automatic promotion of original 差 quality tag.

## Final bounded retest, 04:52–04:53 UTC
- Exact special-export.html reopened at /qa-special. Heading text matches `潮 <线> & 观察` exactly. Chinese and punctuation preserved, not rendered as a literal escape sequence. No page script error in fresh log; only unrelated Chrome-extension metadata error.
- Corrected comparison strip viewed at its actual native SVG width ~63.984px. C's deepened open notch is now visually distinguishable from A's continuous terminal at 64px. All three retain the same outer-boundary family; screenshot 64px-fixed-browser.jpg. This is a limited size-readability finding, not proof of historical originality or a quality-grade promotion.
- Core candidate unchanged by final comparison-harness fix. final-export.html remains the unmodified-title actual browser download containing fixed C and fixed special-character serialization. QA fixtures should not be delivered as final artwork.

Status: requested functional and bounded visual checks completed; no remaining blocking defect found within covered scope. Retain prior quality label pending the user's design judgment.

Browser screenshots and temporary edited exports are verification records retained separately, not included in this distribution.
