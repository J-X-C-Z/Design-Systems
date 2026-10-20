# Bauhaus React candidates

This directory contains 6 integrated component candidates, including the delivered selection reset/cancellation repair. The historical layered inventory is 17; 11 historical components live in separate earlier packages and are not integrated into the current module. Cel's unpublished six-component editor candidate is excluded.

## Build and tests

Use an existing Node environment with React/ReactDOM 19.3.0, TypeScript 7.0.2, esbuild 0.28.2 and jsdom 30.1.2. From this directory, create `qa/`, set `LOCAL_DEPENDENCIES` to the absolute existing node_modules directory, then run `node tools/build.cjs`. Build output is generated locally and is not committed.

Type fixtures cover valid use and expected errors. For package-consumption checks, rewrite their relative source imports to this package's name in an isolated consumer; Cel's old-four fixture uses a historical declarations path that must likewise point to the current package. Check strict NodeNext and Bundler resolution.

Run the shared `../_shared-tests/ordering-matrix.cjs --package /absolute/path/to/dist/index.cjs --toolchain /absolute/path/to/node_modules --out /temporary/results.json` with Node. It covers 357 production React/JSDOM ordering cases, including semantic, own-handler and ancestor cancellation, reset ordering, controlled ownership and immediate accepted FormData behavior.

Preview sources are retained without generated bundles. Compile the JSX with esbuild and ReactDOM. Cel's preview imports its package by name; resolve that name to the locally built package when bundling.

## Verification limits

The delivered repair passed author and independent source/package models, dual module-resolution type checks, SSR and relevant preview regression models. Real-browser/device assertions and screenshots are zero. Historical external components have not been rerun by this repair. Aurora glass effects are CSS simulations, not shaders. Test logs, historical archives and machine-specific provenance records are not included in this public source snapshot. Source and third-party licenses are retained.

## Included historical source snapshots

Separate legacy-layers packages now preserve source for the full historical layered inventory of 17 distinct candidate identities together with the current module. The current module remains independently integrated; older layers are source-preservation snapshots, not freshly verified or merged components. Historical package build scripts may require omitted vendor tooling; consult each layer README. Cel legacy selection2 remains explicitly unrepaired. No Cel48 editor candidate is included.
