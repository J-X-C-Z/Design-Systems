# Swiss information candidate — independent browser QA

2026-10-11 07:01–07:08 UTC. Existing dot cloud Chrome, no user Mac, Work/Codex/Pro or unrelated SP reporting. Candidate: /candidates/swiss-information/

## Confirmed
- Four pages × CSS iframe widths320/390/768/1440: 16 correct keyboard-activated states, no horizontal overflow with editor collapsed. Not physical-device emulation.
- Desktop poster, reading and directory inspected visually. Reading order is left content column A then B, then right C, with explicit sequence text. At narrow widths it becomes linear A→B→C. Black-and-white mode and four-page all-content overview work. No positive-duration visible CSS animations; static, pause N/A.
- Matrix retains12 rows×3 statuses=36 cells, all 待分配. Explicit text says allocation is undecided, not every point must join every round, 36 positions are a relation template and not36 records/commitments.
- 320px actual screenshot shows per-point cards with all three round labels and status text. DOM confirms all36 cells displayed.
- Actual clipboard paste into R1 label: `R1／首轮 <待定>` propagates to12 corresponding data-label attributes. Actual clipboard paste into shared disclaimer: `虚构计划 <测试> & 暂无实测结果` propagates identically to all4 pages. Statuses stay 待分配.
- Point01 expanded to `观察点 01`; p1 expanded69→89 characters (+29%), exceeding the20% test requirement. Desktop and 320px content itself reflows without overflow; screenshots saved. The extra text is QA-only.
- Editing time-remark changes only that field; other time fields remain unchanged. UI warns that independently edited time/prose fields require manual cross-page consistency review.
- Three directory content links activated via Enter and navigated to correct poster/reading/matrix headings.
- Real edited HTML/JSON downloads saved. Reopened original-byte HTML at qa-export preserves pasted special characters, all4 disclaimers, round labels, point name, longer paragraph and ink#303c48. No candidate script error observed; unrelated extension metadata errors excluded.

## Defect found / pending bounded regression
Expanded editor at320px causes scrollWidth376 vs clientWidth305. Cause: import-JSON label/input, not matrix or long paragraph. Input right375.53px at x73.53;width302px. Builder fixing only CSS wrapper/input sizing. Original QA export is retained unchanged as failure evidence; retest on latest main candidate before downloading final again.

## Limits
No physical devices,200% browser zoom, OS-level reduced-motion emulation, print driver or cross-platform fonts. No automatic quality-grade promotion, no blanket accessibility claim.

## Fix retest completed 07:09 UTC
- Latest main candidate in320px iframe, editor expanded: clientWidth305, scrollWidth305; no element right-edge overflow. Screenshot editor320-fixed-browser.jpg shows file selector wrapped onto its own line and all buttons/text inside viewport.
- Edited-export content at320px remains readable: custom `观察点 01`, long round label and36 statuses. Earlier page-wide overflow was entirely the now-fixed editor file-input sizing.
- Long-reading320-browser.jpg confirms +29% paragraph wraps naturally and retains sequence. Reading section scrollWidth305 equals width305.
- Latest default real browser download replaces final-export.html. No test text/color retained; original title and fields restored. UTF-8 BOM and charset byte50, no Sites edit links/module scripts. Old edited-export fixture retains old CSS for traceability; it is not the final deliverable.

Covered-scope QA complete. No remaining blocking defect found after this bounded CSS retest. Original quality grade remains unchanged pending user judgment.

Screenshots and temporary edited fixtures are retained separately and excluded from this package.
