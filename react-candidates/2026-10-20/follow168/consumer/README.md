# Retained consumer fixtures

These are the frozen TSX examples and type fixtures, not a pre-installed independent application. The archived vendor tarball, old consumer package/lock manifests and generated outputs are deliberately omitted.

From the candidate root, `npm run verify` builds the current package and checks the current-slice consumer fixtures against both source declarations and the built package, using strict Bundler and NodeNext resolution with `exactOptionalPropertyTypes` and without `skipLibCheck`. The source-only example adapter removes the CSS side-effect import; the built-package example retains and checks the typed CSS export.

All original consumer TSX files are retained for inspection, but the portable runner does not claim that every old example or historical suite was re-executed. The frozen full-chain results are separately identified in `verification/frozen-validation-summary.json`.
