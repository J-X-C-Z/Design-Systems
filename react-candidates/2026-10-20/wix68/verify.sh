#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
: "${LOCAL_DEPENDENCIES:?Point to an existing compatible node_modules directory. No installation is performed.}"
export NODE_PATH="${LOCAL_DEPENDENCIES}${NODE_PATH:+:${NODE_PATH}}"
for package in wix-multi-select wix-select-menu-reset-repair wix-select-composition-reset-repair wix-select-availability-reset-repair wix-select-structure-reset-repair wix-select-content-reset-repair; do
  bash "$package/tools/verify.sh"
done
CANDIDATE="$PWD" REPORT_DIR="$PWD/qa/wix68-maintenance" node tests/wix68-maintenance/run.cjs
