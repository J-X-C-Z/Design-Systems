#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
: "${LOCAL_DEPENDENCIES:?Existing local dependencies only}"
export NODE_PATH="${LOCAL_DEPENDENCIES}${NODE_PATH:+:${NODE_PATH}}"
C=$(mktemp -d "$PWD/qa/consumer.XXXXXX")
mkdir -p "$C/node_modules/@studio/wix-select-menu"
tar -xzf package/studio-wix-select-menu-0.1.0-candidate.4.tgz --strip-components=1 -C "$C/node_modules/@studio/wix-select-menu"
for dependency in react react-dom @types; do ln -s "$LOCAL_DEPENDENCIES/$dependency" "$C/node_modules/$dependency"; done
printf '{"type":"module"}' > "$C/package.json"
sed "s|'../src/index.js'|'@studio/wix-select-menu'|" tests/types.tsx > "$C/types.tsx"
for mode in NodeNext Bundler; do
 module=ESNext; if [ "$mode" = NodeNext ]; then module=NodeNext; fi
 "$LOCAL_DEPENDENCIES/.bin/tsc" --noEmit --strict --exactOptionalPropertyTypes --jsx react-jsx --moduleResolution "$mode" --module "$module" --target ES2022 --lib ES2022,DOM "$C/types.tsx"
done
for suite in behavior orders boundaries keyboard-orders environment fieldset-orders required-state regroup-focus; do
 ENTRY="$C/node_modules/@studio/wix-select-menu/dist/index.cjs" REPORT_PATH="$PWD/qa/package-$suite.json" node --max-old-space-size=384 "tests/$suite.cjs"
done
PACKAGE_ROOT="$C/node_modules/@studio/wix-select-menu" REPORT_PATH="$PWD/qa/package-type-matrix.json" node tests/type-matrix.cjs
cp examples/ProofSheet.tsx examples/proof.ts examples/styles.d.ts "$C/"
for mode in NodeNext Bundler; do
 module=ESNext; if [ "$mode" = NodeNext ]; then module=NodeNext; fi
 "$LOCAL_DEPENDENCIES/.bin/tsc" --noEmit --strict --exactOptionalPropertyTypes --jsx react-jsx --moduleResolution "$mode" --module "$module" --target ES2022 --lib ES2022,DOM "$C/ProofSheet.tsx" "$C/styles.d.ts"
done
cp tests/consumer-ssr.mjs "$C/ssr.mjs"
REPORT_PATH="$PWD/qa/package-ssr.json" node "$C/ssr.mjs"
CONSUMER_DIR="$C" REPORT_PATH="$PWD/qa/package-example.json" node tests/example.cjs
PACKAGE_ROOT="$C/node_modules/@studio/wix-select-menu" REPORT_PATH="$PWD/qa/package-readme-consumer.json" node tests/readme-consumer.cjs
printf '%s\n' "$C" > qa/last-consumer-path.txt
