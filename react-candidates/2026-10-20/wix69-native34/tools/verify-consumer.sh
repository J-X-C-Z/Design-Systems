#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
: "${LOCAL_DEPENDENCIES:?Existing toolchain required. No installs.}"
export NODE_PATH="$LOCAL_DEPENDENCIES"
C="$PWD/qa/consumer"
export CONSUMER_ROOT="$C"
python - <<'PY'
from pathlib import Path
import tarfile,json,os,hashlib,shutil
p=Path.cwd();c=Path(os.environ['CONSUMER_ROOT']);meta=json.loads((p/'package.json').read_text());archive=p/'package'/('studio-wix-native-multiple-'+meta['version']+'.tgz');target=c/'node_modules/@studio/wix-native-multiple'
# Only this package's own previously generated consumer directory is replaced.
if c.exists(): shutil.rmtree(c)
target.mkdir(parents=True);rows=[]
with tarfile.open(archive,'r:gz') as t:
 members=t.getmembers();assert len({m.name for m in members})==len(members)
 for m in members:
  assert m.isfile() and m.name.startswith('package/') and '..' not in Path(m.name).parts and not Path(m.name).is_absolute()
  rel=m.name[len('package/'):];b=t.extractfile(m).read();assert b==(p/rel).read_bytes();f=target/rel;f.parent.mkdir(parents=True,exist_ok=True);f.write_bytes(b)
  assert m.mtime==0 and m.uid==0 and m.gid==0 and m.mode==0o644
  rows.append({'path':rel,'bytes':len(b),'sha256':hashlib.sha256(b).hexdigest()})
report={'status':'PASS','archive':str(archive),'consumer':str(target),'sha256':hashlib.sha256(archive.read_bytes()).hexdigest(),'files':len(rows),'everyMemberByteIdentical':True,'normalizedArchiveMetadata':True,'members':rows}
(p/'qa/package-provenance.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'status':'PASS','files':len(rows),'archiveSha256':report['sha256']}))
PY
for dep in react react-dom @types csstype; do ln -s "$LOCAL_DEPENDENCIES/$dep" "$C/node_modules/$dep"; done
printf '{"type":"module","private":true}\n' > "$C/package.json"
PKG="$C/node_modules/@studio/wix-native-multiple"
for suite in runtime hydration review-regressions; do PACKAGE_ROOT="$PKG" ENTRY="$PKG/dist/index.cjs" REPORT_PATH="$PWD/qa/package-$suite.json" node --max-old-space-size=384 "tests/$suite.cjs"; done
TEST_REACT_MODE=development PACKAGE_ROOT="$PKG" ENTRY="$PKG/dist/index.cjs" REPORT_PATH="$PWD/qa/package-review-regressions-development.json" node --max-old-space-size=384 tests/review-regressions.cjs
for suite in type-matrix ssr structure; do PACKAGE_ROOT="$PKG" REPORT_PATH="$PWD/qa/package-$suite.json" node --max-old-space-size=384 "tests/$suite.cjs"; done
cp tests/consumer-native.mjs "$C/consumer-native.mjs"
REPORT_PATH="$PWD/qa/consumer-native.json" NODE_ENV=production node "$C/consumer-native.mjs"
printf '%s\n' "$C" > qa/last-consumer-path.txt
