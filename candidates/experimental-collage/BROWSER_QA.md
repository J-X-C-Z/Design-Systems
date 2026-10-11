# Browser QA, 2026-10-11 UTC

Test environment: existing dot cloud Chrome browser. No user Mac, Work-mode task, browser install, or security bypass. Ordinary ChatGPT image generation ran with Medium selected before each submission. Image model version was not displayed.

## Candidate tested
[private candidate preview; URL excluded]

## Confirmed before export repair
- Desktop: all four routes render correct headings; 12 ledger records are visible in accessibility state, no fictional results invented.
- Two downloaded PNG masters inspected at original pixels. A 1536×1024, B 1448×1086. Distinct far/near scale and natural texture; no captions, figures, people, logos.
- Workbench replay, immediate pause (button becomes Continue, status confirms paused), continue, rapid three-state switching (final requested state wins), keyboard Enter activation, and in-page reduce-motion switch all exercised.
- Inline text editing tested with heading `岸线编辑验收 QA`. JSON and HTML downloads retain that exact string. Online candidate reloaded to restore original content.
- True iframe CSS viewport widths 320, 390, 768, 1440 tested across all four pages (16 combinations). Each switched via keyboard Enter on the real navigation link, followed by fresh accessibility observation and read-only DOM measurement. Correct active heading in every case. No document horizontal overflow (scrollWidth == clientWidth). All visible images loaded. A 15px vertical scrollbar reduces clientWidth at most sizes. These are CSS viewport tests, not physical-device emulation.
- Visual screenshots reviewed: desktop introduction and ledger; 320 introduction/ledger; 390 workbench; 768 reading/workbench; 1440 introduction within horizontally scrollable host.
- Three-position seam comparison inspected in live browser. Candidate 3 (x38%, y12%) best connects the close-up watercourse to the outer shoreline at its two exits while retaining visible scale discontinuity. Candidate 2 reads most like an arbitrary texture cover. Screenshot inspected privately; not distributed.

## Failure found and sent for repair
Reopening real downloaded HTML at qa-export route displayed Chinese mojibake and no interactive editing or motion controls; four pages expanded as no-script fallback. Browser console reported SyntaxError: Unexpected identifier '$'. Builder is repairing encoding and export serialization. Do not mark export/reopen passed before new real download and reopen retest.

## Not covered
Physical devices, 200% browser zoom, OS-level prefers-reduced-motion changes, assistive screen-reader usability. The page-level reduce-motion checkbox was tested, not OS media emulation. File:// rejected by browser policy; authorized existing private Site route used instead.

## Repair retest completed, 04:19–04:20 UTC
The actual second browser download was published unchanged at:
[private candidate preview; URL excluded]

- Chinese encoding now normal; heading `岸线修复导出 QA` survived download/reopen.
- All 10 A/B image uses in main have complete=true and positive naturalWidth; masters remain 1536 / 1448 pixels wide.
- Four navigation states rendered their correct headings.
- Replay → immediate Pause → Continue worked after reopen.
- Editing still worked after reopen: heading changed to `重开后仍可编辑 QA` in test-only runtime.
- Page SyntaxError absent from fresh console log. A Chrome extension metadata error remained, unrelated to candidate code.
- Final unmodified candidate was downloaded again from latest index to final-export.html (19,289,845 bytes). UTF-8 BOM present, charset at byte 50, no Sites edit URL, no module-script injection, no cursor-overlay string, no QA edit title. This last serialization cleanup was inspected as downloaded bytes; its browser runtime is the preceding successfully reopened fixed export, not a separately published final-export copy.
- New seam default 38% / 12% accepted as a better working candidate; no automatic quality-grade promotion.
- After crop-ratio repair, reading/ledger checked at all four CSS widths again (8 states): correct headings, no horizontal document overflow, all visible images loaded. Full composition basis remains ~1.49 ratio before clipping into smaller windows.

Final delivery file: final-export.html. Earlier edited-export.html and edited-export-fixed.html are QA fixtures with test text, not user deliverables.
