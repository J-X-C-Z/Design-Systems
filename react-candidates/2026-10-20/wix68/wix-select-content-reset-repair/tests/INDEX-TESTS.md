# Wix select content verification map

All commands use LOCAL_DEPENDENCIES pointing at existing React/ReactDOM/TypeScript/esbuild/JSDOM packages. They install nothing. No browser, trusted keyboard input, device, OS download or assistive-technology result is inferred.

## Component suites

- behavior: 132 scenarios, including exact default records, genuine portal, native bridge, owner/reset/cancel and keyboard basics.
- orders: 336 click/owner/queued ordering scenarios.
- boundaries: 252 outside/focus/keyboard cancellation boundaries.
- keyboard-orders: 292 same-task navigation/typeahead/activation sequences.
- environment: 40 owner-document, RTL, mocked collision/scroll and cleanup scenarios. All four original configured side offsets are 4. The inherited Select25-specific 12px expectation was corrected in this new fixture; production geometry was already 4.
- fieldset-orders: 576 relevant/unrelated, before/after, first-legend and disabled-roundtrip cases.
- required-state: 112 transient/caller validation state and reset cases.
- regroup-focus: 308 scenarios for same-value reparenting, removed/disabled highlight and explicit outside focus authority. Family is content.
- content: 37 focused cases with exact rich icon/status/default records, independent prefix, plain-label typeahead/native options, nested glyph click, dynamic metadata/owner/reset, strict descriptor values and decorative SVG accessibility.

Component runtime reports bind the entry and watched source/fixture SHA before and after execution. A source run uses dist built from current source; a package run uses the actual extracted package ENTRY and still retains its source bytes. Test counts are assertions/scenarios in this model, not user flows in a browser.

## Example/helper and static suites

- palette-capsule: 263 cases, including all 256 layout×discipline×dialect×stage tuples, fixed contrast vectors, strict form parsing, 1/24 colors, dense-array validation and inert static HTML checks. No arbitrary JavaScript is evaluated.
- example: 40 cases. The real complete React example is bundled against the selected source, ESM or CJS entry. It uses actual Blob bytes with URL/anchor interception, checks iframe srcDoc against the same pure helper, all four selectors and motion forwarding, cancellation, accepted/canceled reset ordering, committed-state FIFO submission, URL replacement and unmount cleanup. The iframe content is parsed as a model; browser sandbox/geometry is not tested.
- type-matrix:source and public declarations each use NodeNext and Bundler with strict and exactOptionalPropertyTypes. 249 deliberate negative cases are checked again without directives to prove per-line diagnostics. The complete example and helper also compile.
- consumer-ssr:bare ESM/CJS/CSS resolution, exact exports and original-byte identities, controlled/default native bridge, escaping and SSR structure.
- style:parsed scoped CSS, declared dimensions/focus/RTL/forced-colors/reduced-motion and opaque text-color arithmetic only.

CASE_FILTER is diagnostic only. Filtered runs are marked incomplete/PARTIAL and cannot stand in for full matrices. Explicit zero-match filters fail; standalone small diagnostic results are not merged into whole-matrix counts.

## Prefreeze corrections

Initial evidence is retained separately. The real complete-example submit→reset defect was fixed with an immediate reset-event sequence and final cancellation check. A canceled reset preserves the older queued export; reset→submit reads reset defaults. A helper assertion was corrected for HTML-parser line-ending normalization. A submit→deferred-selection assertion was corrected only after its event trace proved that export read grid before the component accepted table. These fixture changes did not change the component engine or weaken its contract. The initial fixture source, failing results, repair input identities and traces remain available in the compact author evidence.
