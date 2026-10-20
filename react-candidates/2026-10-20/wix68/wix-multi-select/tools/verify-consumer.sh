#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
: "${LOCAL_DEPENDENCIES:?Existing toolchain required; no installs}"
export NODE_PATH="${LOCAL_DEPENDENCIES}${NODE_PATH:+:${NODE_PATH}}"
C=$(mktemp -d "$PWD/qa/consumer.XXXXXX")
export WIX_MULTI_CONSUMER="$C"
python - <<'PY'
from pathlib import Path
import tarfile,json,hashlib,os
q=Path.cwd();meta=json.loads((q/'package.json').read_text());archive=q/'package'/('studio-wix-multi-select-'+meta['version']+'.tgz');target=Path(os.environ['WIX_MULTI_CONSUMER'])/'node_modules/@studio/wix-multi-select';target.mkdir(parents=True)
rows=[]
with tarfile.open(archive,'r:gz') as t:
 members=t.getmembers();assert len({x.name for x in members})==len(members)
 for member in members:
  assert member.isfile() and member.name.startswith('package/') and '..' not in Path(member.name).parts and not Path(member.name).is_absolute()
  rel=member.name[len('package/'):];data=t.extractfile(member).read();assert data==(q/rel).read_bytes();out=target/rel;out.parent.mkdir(parents=True,exist_ok=True);out.write_bytes(data);rows.append({'path':rel,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()})
report={'status':'PASS','archive':str(archive),'sha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'bytes':archive.stat().st_size,'consumer':str(target),'fileCount':len(rows),'members':rows,'everyMemberEqualsSource':True}
(q/'qa/package-provenance.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'packageFiles':len(rows),'sha256':report['sha256']}))
PY
for dependency in react react-dom @types csstype; do
  if [ -e "$LOCAL_DEPENDENCIES/$dependency" ]; then ln -s "$LOCAL_DEPENDENCIES/$dependency" "$C/node_modules/$dependency"; fi
done
printf '{"type":"module"}\n' > "$C/package.json"
PKG="$C/node_modules/@studio/wix-multi-select"
for suite in behavior orders keyboard forms boundaries structure hydration; do
  PACKAGE_ROOT="$PKG" ENTRY="$PKG/dist/index.cjs" REPORT_PATH="$PWD/qa/package-$suite.json" node --max-old-space-size=384 "tests/$suite.cjs"
done
PACKAGE_ROOT="$PKG" REPORT_PATH="$PWD/qa/package-types.json" node tests/type-matrix.cjs
PACKAGE_ROOT="$PKG" REPORT_PATH="$PWD/qa/package-readme-consumer.json" node tests/readme-consumer.cjs
PACKAGE_ROOT="$PKG" REPORT_PATH="$PWD/qa/package-ssr.json" node tests/consumer-ssr.mjs
PACKAGE_ROOT="$PKG" ENTRY="$PKG/dist/index.cjs" REPORT_PATH="$PWD/qa/package-example.json" node --max-old-space-size=384 tests/example.cjs
printf '%s\n' "$C" > qa/last-consumer-path.txt
