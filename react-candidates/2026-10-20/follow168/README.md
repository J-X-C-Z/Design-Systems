# Follow168 React candidate, portable source snapshot

This is the frozen Follow168 candidate (`0.38.0-candidate.1`), not Follow172 and not a production acceptance release. It contains 168 of 849 canonical component candidates; 681 remain. The four new canonical IDs are `radio-group-11`, `radio-group-12`, `radio-group-13`, and `switch-19`. Constituent radio options do not count as extra canonical IDs. Current family accounting is radio12/13, checkbox14/16, switch19/20. The frozen narrative switch19/22 was a prefix-count error that included other categories; that metadata denominator is corrected here without changing runtime source or package bytes.

## What is included

- All 369 frozen `src/` files, byte for byte, including runtime, TypeScript declarations, styles, catalog and upstream source/notice artifacts.
- All 177 original test files, source contracts, pinned upstream references and the cumulative example pages.
- The unchanged production build script and selected build helpers; exact frozen package-member hashes.
- A new focused portable verifier, with its own recorded execution result. Packaging changes are mapped in `verification/portable-adaptations.json`.

No `node_modules`, compiled runtime/preview output, copied ZIP/TGZ files, repeated execution logs, or duplicate historical archives are published. `coverage-849.json` is an explicitly marked, verification-only `id`/`source_sha` projection. It is not the archived full coverage ledger. Runtime `src/catalog.json` is unchanged.

## Install and verify

Use Node 22.22.2+ within 22.x, Node 24.15.0+ within 24.x, or Node 26+, and Python 3. The recorded portable run used the exact pre-existing official toolchain versions listed in `verification/portable-result.json`. A clean network install was not performed for this portable export.

```sh
npm install --ignore-scripts
npm run verify
```

The new verifier checks all frozen source hashes, rebuilds all 57 package members byte-identically, runs the current-slice source/package matrices, strict Bundler and NodeNext TypeScript fixtures, Studio checks, static contrast, and bounded cumulative-page checks. Its precise executed commands and outcomes are recorded in `verification/portable-result.json`. It is not the original 1,259-input archived full-chain run, nor a promise that every retained historical fixture is standalone here.

The verifier creates `.portable/` and generated files under `qa/`; it refuses to overwrite an existing `.portable/` run. Remove that generated directory before another run. Generated output is ignored by Git. Scripts are stored with mode 100644 and invoked explicitly through Node, Python or a shell, not by executable-bit assumptions.

To build only:

```sh
npm run build
```

This generates `dist168-candidate1/` and refuses to overwrite an existing build directory. `PACKAGE-README.md` is the original package README retained byte-exact for reproducible package content. Its archive/full-chain references describe the frozen delivery, not files promised in this lean checkout. See `consumer/README.md` for the retained type/example fixtures.

## Verification boundaries and known defects

Browser runs: 0. Formal acceptance: 0. Full native equivalence: false. This candidate is not described as bug-free.

- 28 representative direct-DOM form-association rewrites hidden by propagation termination differ from bare-native reset. They are explicit not-passed equivalence paths.
- Four pre-registered window-capture `stopImmediatePropagation` join cases can hide reset entry and split native checked/FormData from React `data-state`. These remain unaccepted parity boundaries.
- Switch19's frozen implementation blocks read-only changes but does not expose `aria-readonly`; this accessibility-state omission is not repaired in this snapshot. Follow172 repair work is separate and is not included or implied accepted here.
- Native fields replace original Radix internals. Local outline icons and some indicator dimensions are documented adaptations, not official full equivalence.
- Light DOM only. Arbitrary hidden direct-DOM writes, shadow roots, portals, cross-document forms and full native Tab order are not promised.
- JSDOM/state, SSR/type and authored-token/static-sRGB evidence is bounded. No real browser layout, trusted physical input, accessibility tree/AT or real rendered-color acceptance is claimed.
- Source/package matrices overlap and must not be summed into unique interaction coverage.

## Frozen evidence identity

Archive: `Follow-React168-candidate1-final-20261020.zip` (4,992,058 bytes).

SHA-256: `1efc4866b758155d70c77024d4df143e6a3984d75307b02a17d9015c6505b701`.

The separately frozen exact-archive full chain exited 0; 1,259 inputs, all 57 extracted package members, and the rebuilt preview were byte-equal to the archive. `verification/frozen-validation-summary.json` binds those historical results and includes runtime hashes. The archive and its historical fixture corpus are not duplicated in this GitHub source export. The new portable result is reported separately, without inheriting the archived full-chain claim. The portable preview uses a new package-alias build and is not claimed byte-identical to the frozen preview: its JavaScript is 745,791 bytes (SHA-256 `a5b5f8605550c24475a656f7226eafdc0bfc5b0c7ad0c4b2fe6239c25dd9a326`), versus 745,804 frozen bytes (SHA-256 `352f6bb54866206c813610fc58f1951c25037c691c0b997d508b7cc831ac7dd4`). The HTML and CSS match the frozen hashes; all 57 built package members remain byte-identical. Passing portable page gates is not a claim of preview JavaScript byte equivalence.

## Attribution

See `NOTICES.md` and retained `LICENSE.upstream` files. This export does not invent or apply a new blanket license to authored adaptation code. Existing upstream notices retain their own scopes.
