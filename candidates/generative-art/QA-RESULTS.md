# Generative Art Candidate — independent cloud-browser QA

2026-10-11 05:48–05:53 UTC. Existing cloud Chrome. No user Mac, Work/Codex/Pro mode, or image-generation task involved. Private candidate route:
/candidates/generative-art/

## Confirmed in live browser
- All four pages × iframe CSS widths 320/390/768/1440: 16 keyboard-activated states, correct headings, no document horizontal overflow (clientWidth=scrollWidth). 12 ledger rows remain present. Scrollbar consumes 15px of content width. CSS iframe widths are not physical-device emulation.
- Desktop visual comparison: A0 regular; B8 slight internal-segment variation; C16 visibly larger changes. Shared spacing/voids and fixed endpoints establish a clear comparison. Does not establish historical-artistic quality or promote the prior 差 label.
- 320px visual: poster shows four symbols (original indices0–3) and explicitly labels cropped/partial display, not data. Comparison plates stack vertically; thin strokes remain visible, B/C variations perceptible. Screenshots saved.
- Black-and-white mode tested; all four page headings visible in overview and continuous reading inspected visually. No visible positive-duration CSS animations. Static design: pause/replay N/A. No added animation for testing.
- Every A/B/C SVG has 31 paths; omitted indices9,10,17,24 consistent across plates.
- Seed0 rejected with 1–4294967295 integer validation; old SVG paths remained byte-for-byte unchanged.
- Seed130363 updates B/C; A0 remains unchanged as expected for zero amplitude. Returning seed104729 restores all path strings exactly.
- Real edits: title-first `潮 <线> & 观察`, ink #303c48, seed130363. Downloaded JSON records all precisely.
- Actual HTML download published without rewriting at qa-export and reopened in browser. Special characters, color and seed preserved. All four routes work; paths match the pre-export seed130363 DOM exactly. Reopened page still allows further inline edits. No candidate script error found; only unrelated Chrome-extension metadata errors.
- Actual downloaded SVG reopened at qa-plates.svg. Three bottom labels (a=0/8/16; seed130363) are visible and not clipped. SVG viewBox1584×460; labels at local y390. See svg-labels-browser.jpg.

## Final deliverable bytes
final-export.html: actual default browser download, 32,414 bytes. UTF-8 BOM; charset byte50. Original Chinese title, ink#202421, blue#2446bc, seed104729. No Sites edit links or injected module scripts. Edited exports are QA fixtures, not final deliverables.

## Evidence
poster-browser.jpg; comparison-browser.jpg; mobile320-browser.jpg; mobile320-BC-browser.jpg; reading-bw-browser.jpg; svg-labels-browser.jpg. All are actual browser screenshots, not synthetic renders.

## Limits
No physical mobile device, 200% browser zoom, OS-level reduced-motion setting, print-driver or cross-platform font tests. No blanket WCAG claim. Functional and bounded visual QA passed in covered scope; original quality label retained for user judgment.

Screenshots and temporary edited fixtures are retained separately for verification and excluded from this distribution.
