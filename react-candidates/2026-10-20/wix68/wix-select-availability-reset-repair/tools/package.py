from pathlib import Path
import tarfile,gzip,json,io,hashlib
p=Path(__file__).resolve().parents[1];meta=json.loads((p/'package.json').read_text());out=p/'package'/('studio-wix-select-availability-'+meta['version']+'.tgz')
out.parent.mkdir(parents=True,exist_ok=True)
buffer=io.BytesIO()
with tarfile.open(fileobj=buffer,mode='w',format=tarfile.PAX_FORMAT) as t:
 for f in sorted([p/'package.json',p/'README.md',p/'LICENSE']+[x for d in ['src','dist','reference'] for x in (p/d).rglob('*') if x.is_file()]):
  name='package/'+f.relative_to(p).as_posix();b=f.read_bytes();info=tarfile.TarInfo(name);info.size=len(b);info.mode=0o644;info.mtime=0;info.uid=info.gid=0;t.addfile(info,io.BytesIO(b))
with out.open('wb') as f:
 with gzip.GzipFile(fileobj=f,mode='wb',filename='',mtime=0) as g:g.write(buffer.getvalue())
print(json.dumps({'archive':out.name,'sha256':hashlib.sha256(out.read_bytes()).hexdigest(),'bytes':out.stat().st_size}))
