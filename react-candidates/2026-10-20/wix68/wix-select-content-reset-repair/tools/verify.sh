#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
: "${LOCAL_DEPENDENCIES:?Existing local dependencies only}"
export NODE_PATH="${LOCAL_DEPENDENCIES}${NODE_PATH:+:${NODE_PATH}}"
mkdir -p qa dist
node tools/build.cjs
for suite in behavior orders boundaries keyboard-orders environment fieldset-orders required-state content regroup-focus style palette-capsule; do node --max-old-space-size=384 "tests/$suite.cjs"; done
node tests/type-matrix.cjs
node tests/readme-consumer.cjs
PACKAGE_ROOT="$PWD" REPORT_PATH="$PWD/qa/example.json" node tests/example.cjs
python tools/package.py
bash tools/verify-consumer.sh
