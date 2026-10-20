from pathlib import Path
import tarfile,gzip,json,io,hashlib
p=Path(__file__).resolve().parents[1]
meta=json.loads((p/'package.json').read_text())
out=p/'package'/('studio-wix-native-multiple-'+meta['version']+'.tgz')
out.parent.mkdir(parents=True,exist_ok=True)
files=sorted([p/'package.json',p/'README.md',p/'LICENSE']+[f for d in ['src','dist','reference','examples'] for f in (p/d).rglob('*') if f.is_file()])
def build():
 raw=io.BytesIO()
 with tarfile.open(fileobj=raw,mode='w',format=tarfile.PAX_FORMAT) as t:
  for f in files:
   b=f.read_bytes();i=tarfile.TarInfo('package/'+f.relative_to(p).as_posix());i.size=len(b);i.mode=0o644;i.mtime=0;i.uid=i.gid=0;t.addfile(i,io.BytesIO(b))
 result=io.BytesIO()
 with gzip.GzipFile(fileobj=result,mode='wb',filename='',mtime=0) as g:g.write(raw.getvalue())
 return result.getvalue()
a=build();b=build();assert a==b;out.write_bytes(a)
report={'status':'PASS','archive':str(out),'sha256':hashlib.sha256(a).hexdigest(),'bytes':len(a),'fileCount':len(files),'twoBuildsByteIdentical':True}
(p/'qa/pack.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report))
