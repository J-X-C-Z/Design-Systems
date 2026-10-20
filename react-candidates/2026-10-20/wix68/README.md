# Wix68 Select batch: 22 verified catalog IDs

This directory publishes a **22-ID subset**, not the entire 68-ID cumulative Wix candidate. It includes select-10 through select-29 plus select-32 and select-33. The full cumulative Wix68 source/preview/history was delivered separately as ZIP archives. The other 46 Wix IDs and the other design styles are not included in this directory.

Only select-32 and select-33 add new coverage in this batch. The five maintenance packages repair 20 previously implemented IDs. They are not 20 additional new components.

## Included packages

- `wix-multi-select`: `@studio/wix-multi-select@0.1.0-candidate.1`, Select32/33. Genuine multiple selection using an open nonmodal dialog of native toggle buttons and a native multiple-select form bridge.
- `wix-select-menu-reset-repair`: `@studio/wix-select-menu@0.1.0-candidate.4`, Select10–13.
- `wix-select-composition-reset-repair`: `@studio/wix-select-composition@0.1.0-candidate.4`, Select14–17, including the three independent Select15 slots.
- `wix-select-availability-reset-repair`: `@studio/wix-select-availability@0.1.0-candidate.3`, Select18–21.
- `wix-select-structure-reset-repair`: `@studio/wix-select-structure@0.1.0-candidate.2`, Select22–25.
- `wix-select-content-reset-repair`: `@studio/wix-select-content@0.1.0-candidate.2`, Select26–29.

Every package includes TypeScript source, public declarations, scoped CSS and its side-effect import declaration, ESM/CJS builds, complete runnable example sources, tests, deterministic packaging tools, original reference sources and the MIT notice. React and React DOM are external peer dependencies. No new runtime dependency or live service is introduced.

The examples produce local palette proof sheets, typography scales, artwork, index sheets, content capsules and ZIP packets. Notification/service wording in source specimens is illustrative; no notification, policy, billing or external service is configured.

## Use

Read the selected package's README for its public API, example and exact behavior limits. Import its component export and explicit `styles.css` export through a CSS-capable bundler. Each package supports React/React DOM `>=18.2.0 <20`.

The included `dist` modules are ready to consume. To build and verify from source, use an existing compatible Node toolchain containing React, React DOM, TypeScript, esbuild, JSDOM, `@types/react`, `@types/react-dom` and csstype. Set `LOCAL_DEPENDENCIES` to that toolchain's `node_modules` directory, then run:

```sh
export LOCAL_DEPENDENCIES="$(pwd)/node_modules"
bash verify.sh
```

`verify.sh` does not install anything or use the network. It runs the full source and generated-package verifiers for all six packages and the cross-family maintenance regression suite. Generated QA output and npm archives are ignored by Git. Run one package's `tools/verify.sh` for a smaller full-package check.

## Evidence and limits

The frozen cumulative Wix68 archive passed exact-source/package/type/SSR/JSDOM verification. Its seven new multi-select model suites cover 2,437 cases and 19,334 assertions. **These are not real-browser, trusted keyboard/touch, operating-system download, assistive-technology or formal acceptance results. Formal acceptance remains 0.**

This lean publication preserves component runtime/source, declarations, CSS and example logic byte-for-byte. Executor-specific local paths were removed from test configuration and reference metadata. Historical preservation inventories, large raw QA reports and prior cumulative artifacts are intentionally not published here. The portable copy's validation and file hashes are recorded in `PUBLICATION-VALIDATION.json` and `FILE-MANIFEST.json`.

Packages rebuilt from this lean source have the same runtime API/assets, but their tarball bytes differ from the full delivered archives because historical reference metadata has been omitted. Do not use a lean-source tarball checksum as the original frozen archive checksum.

## Source and license

Original component references are pinned to Watermelon Platform revision `424fe703d19b39e86bef90c4ba0a76ef8c1fb260`. Per-package reference identity files retain exact Git blobs/SHA-256 values and repository paths. The custom React engines, Mocha styling and form/ownership APIs are documented adaptations, not pixel-identical replicas or unverified claims about Radix internals. Keep each package's MIT notice with derivative distributions.
