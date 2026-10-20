# Portable maintenance author regression

This small suite checks all 22 logical Select10–29 paths, including Select15's three slots. It contains no generated CJS, saved input manifest, historical archive, or consumer tree. It reads the selected runtime files and records their SHA256 values when each test starts; metadata/source hashes are included only when found beside that runtime. Before/after hashes, a unique run ID, and report hashes prevent stale results being attributed to a different build.

These are author self-tests with React and JSDOM. They do not claim independent review, trusted browser behavior, or complete release/package acceptance. No packages are installed.

## Candidate runtime

From any working directory:

    CANDIDATE=/absolute/candidate-root LOCAL_DEPENDENCIES=/existing/node_modules node /absolute/candidate-root/tests/wix68-maintenance/run.cjs

The default entries are each candidate's wix-select-{family}-reset-repair/dist/index.cjs. CANDIDATE may be omitted when running this launcher from its original candidate tree. LOCAL_DEPENDENCIES must contain React, ReactDOM and JSDOM; use the same React peer runtime resolved by the selected package entries.

## Actual package consumer runtime

    CANDIDATE=/absolute/candidate-root LOCAL_DEPENDENCIES=/existing/node_modules ENTRY_ROOT=/absolute/consumer-root REPORT_DIR=/absolute/new-report-directory node /absolute/candidate-root/tests/wix68-maintenance/run.cjs

ENTRY_ROOT supports a consumer root with node_modules/@studio/wix-select-{family}/dist/index.cjs, its node_modules directory directly, or a candidate root. For explicit source-snapshot testing it also supports a directory containing menu.cjs, composition.cjs, availability.cjs, structure.cjs and content.cjs. Reports always show exactly which files were tested.

Alternatively set MENU_ENTRY, COMPOSITION_ENTRY, AVAILABILITY_ENTRY, STRUCTURE_ENTRY and CONTENT_ENTRY to five exact entry files. Each explicit variable overrides ENTRY_ROOT for its family. Add --list to inspect resolved entries without executing tests.

Reports default to CANDIDATE/qa/wix68-maintenance. Prefer a new REPORT_DIR per stage or consumer so earlier evidence stays intact. The launcher runs serially and returns a nonzero exit status if any suite fails, an input changes during testing, or an expected report belongs to another run.

## Coverage

- Accepted/canceled reset join and leave, after-return association guards, round trips, stale/new gestures, and Select15 slot isolation
- Native-select association parity; current controlled/uncontrolled owner, mount/key replacement, flush/batch and cancellation
- Trigger runtime allowlist, supported callbacks/cancellation, SSR HTML safety, client behavior and public native bridge protection
- One/two/three queued navigation intents, capture/bubble nested focus redirects, in-popup/out-and-back destinations, and fresh subsequent gestures
- Prototype/inherited/nonenumerable option/group/separator/decoration fields; per-snapshot accessor counts and SSR drift protection
- Malformed inherited descriptors remain rejected; same object/array updates across renders remain observable

Public TypeScript consumers and the complete inherited engine suites are separate author checks recorded by the maintenance work. Formal package/README verification is owned by the candidate's normal verification chain.
