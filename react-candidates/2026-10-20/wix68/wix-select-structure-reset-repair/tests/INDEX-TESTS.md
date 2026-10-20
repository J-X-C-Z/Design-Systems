# Wix62 local HTML index example author tests

Only existing dependencies are used. Compilation is `esbuild` `write: false` in memory. The test never installs dependencies, emits a bundle, makes a consumer copy, or edits production inputs. One JSDOM browsing context is reused serially.

## Run

```sh
export LOCAL_DEPENDENCIES="$(pwd)/node_modules"
export SOURCE_ROOT=/absolute/path/to/wix-select-structure
export ENTRY="$SOURCE_ROOT/dist/index.cjs"
REPORT_PATH=/absolute/path/to/qa/index-example.json node tests/index-example.cjs
```

When the files are copied into the candidate's `tests/`, `SOURCE_ROOT` defaults to their parent directory and `ENTRY` defaults to `SOURCE_ROOT/dist/index.cjs`. The default report is `SOURCE_ROOT/qa/index-example.json`. Set `REPORT_PATH` for each independent run.

- `SUITE=all` (default): 383 unique cases: 374 helper cases plus 9 React integration cases.
- `SUITE=helper` or `node tests/index-sheet.cjs`: the 374 pure helper cases, including all 320 settings combinations. The in-memory bundle does not import the React example/package entry.
- `SUITE=react` or `node tests/example.cjs`: the 9 real React example integration cases; package imports are bound to `ENTRY`. This makes the same source example testable against an explicitly chosen built or installed-package CommonJS entry.
- `CASE_FILTER=substring`: focused diagnostics, always reported as `PARTIAL` on success.
- `TRACE_CASES=1`: print case names during execution.

The wrappers require `index-example.cjs` alongside them. They select subsets of exactly the same authored cases, not extra coverage. Reports record `suite`, `caseFilter`, `total`, `eligible`, `authoredCases`, `settingsCombinations`, `settingsMatrixComplete` and `completeMatrix` explicitly. `completeMatrix` means the selected suite was fully executed; `settingsMatrixComplete` specifically means all 320 settings combinations were executed. Re-running a suite against a different entry verifies another binding, not additional unique cases.

## Coverage

Helper checks: 5 × 4 × 4 × 4 settings; deterministic filenames, titles, labels and all CSS settings; parsed inert HTML, strict CSP, absence of script/network resources; valid source boundaries, normalization, sparse-array rejection and malformed input; exact FormData output with missing, duplicate, file, unsupported and unknown fields rejected; HSL wrap/achromatic/endpoints; deeply frozen detached output; inputs preserved.

React checks: actual portaled Select22–25 controls, group/separator structures, pointer and Enter selections, every offered setting, required heading/native FormData validation and visible invalidity, exact inert source and preview, actual owner-document HTML Blob byte contents/type, filename and temporary anchor, object URL replacement/unmount cleanup, real submit/reset buttons, reset while a popup is open, malformed form fields, invalid colors, and object URL failure handling.

## Limits

This is author QA in JSDOM, not a real-browser or visual baseline run. Object URL creation/revocation and anchor click are captured; the Blob itself is real JSDOM `window.Blob` and is read back with `FileReader`. No operating-system download is claimed. No browser-native keyboard default behavior, CSS rendering or screenshot fidelity is claimed. The test hashes source, helper, React example, candidate entry and its own script before/after and fails if any changes during a run.

The first run found two genuine sparse-array validation failures. The candidate author fixed the helper by making a dense `Array.from(sourceColors)` copy before per-color validation. The preserved first report remains `first-result.json`; corrected-code results are independently rerun.
