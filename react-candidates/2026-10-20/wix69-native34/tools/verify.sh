#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
: "${LOCAL_DEPENDENCIES:?Existing toolchain required. No installs.}"
export NODE_PATH="$LOCAL_DEPENDENCIES"
mkdir -p qa
node tools/build.cjs
for suite in runtime hydration type-matrix ssr structure review-regressions; do node --max-old-space-size=384 "tests/$suite.cjs"; done
TEST_REACT_MODE=development REPORT_PATH="$PWD/qa/review-regressions-development.json" node --max-old-space-size=384 tests/review-regressions.cjs
python tools/package.py
bash tools/verify-consumer.sh
python - <<'PY'
from pathlib import Path
import json,hashlib
p=Path.cwd();names=['runtime','hydration','types','ssr','structure','pack','package-provenance','package-runtime','package-hydration','package-type-matrix','package-ssr','package-structure','consumer-native','review-regressions','review-regressions-development','package-review-regressions','package-review-regressions-development']
reports={name:json.loads((p/'qa'/f'{name}.json').read_text()) for name in names}
assert all(r['status']=='PASS' for r in reports.values())
assert all(not r.get('filtered',False) for r in reports.values())
assert reports['review-regressions']['testSha256']==json.loads((p/'evidence/candidate1-regression-provenance.json').read_text())['testSha256']
runtime=['runtime','hydration','ssr','structure','package-runtime','package-hydration','package-ssr','package-structure','review-regressions','review-regressions-development','package-review-regressions','package-review-regressions-development']
summary={'status':'PASS','canonicalAddition':['watermelon:components:select-34'],'componentExports':['Select34'],'catalogCountsChanged':False,'reviewRegressionCasesPerSurfaceAndMode':reports['review-regressions']['total'],'reviewRegressionFixtureUnchangedSinceCandidate1Red':reports['review-regressions']['testSha256']==json.loads((p/'evidence/candidate1-regression-provenance.json').read_text())['testSha256'],'runtimeAndSsrAndStructureCases':sum(reports[n]['total'] for n in runtime),'runtimeAndSsrAndStructureAssertions':sum(reports[n]['assertions'] for n in runtime),'strictTypeLanes':reports['types']['lanes']+reports['package-type-matrix']['lanes'],'negativeTypeCasesPerLane':reports['types']['negativeCasesPerLane'],'nativeConsumerAssertions':reports['consumer-native']['assertions'],'archive':reports['pack'],'reports':{name: {'path':str(p/'qa'/f'{name}.json'),'sha256':hashlib.sha256((p/'qa'/f'{name}.json').read_bytes()).hexdigest()} for name in names},'realBrowser':False,'trustedUserEvents':False,'published':False,'limits':['Local author verification only: React 19.3.0, TypeScript in the existing toolchain, SSR and JSDOM.','No real-browser, trusted pointer/keyboard, Ctrl/Cmd/Shift OS selection, screen reader, mobile or formal acceptance.','JSDOM disabled-option FormData is model evidence, not browser conformance.'],'failedEvidence':[str(f) for f in sorted((p/'qa').glob('*.json')) if '-failed-' in f.name or 'candidate1' in f.name and '-red' in f.name]}
(p/'qa/verification.json').write_text(json.dumps(summary,indent=2)+'\n');print(json.dumps({k:v for k,v in summary.items() if k not in ['reports']}))
PY
