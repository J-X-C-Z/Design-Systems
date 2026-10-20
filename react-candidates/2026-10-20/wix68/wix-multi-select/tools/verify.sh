#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
: "${LOCAL_DEPENDENCIES:?Point to the existing React toolchain; no install is performed}"
export NODE_PATH="${LOCAL_DEPENDENCIES}${NODE_PATH:+:${NODE_PATH}}"
mkdir -p qa dist package
node tools/build.cjs
for suite in behavior orders keyboard forms boundaries structure hydration; do
  node --max-old-space-size=384 "tests/$suite.cjs"
done
node --max-old-space-size=384 tests/palette-packet.cjs
node --max-old-space-size=384 tests/example.cjs
REPORT_PATH="$PWD/qa/types.json" node tests/type-matrix.cjs
node tests/readme-consumer.cjs
REPORT_PATH="$PWD/qa/consumer-ssr.json" node tests/consumer-ssr.mjs
python tools/package.py
bash tools/verify-consumer.sh
