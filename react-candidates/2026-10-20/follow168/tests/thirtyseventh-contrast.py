from pathlib import Path
import json,re
r=Path(__file__).resolve().parents[1];s=(r/'src/thirtyseventh-controls/styles.css').read_text();page=(r/'examples/follow-new/page.css').read_text();rows=[]
def lum(v):
 v=v.lstrip('#');v=''.join(x*2 for x in v)if len(v)==3 else v
 c=[int(v[i:i+2],16)/255 for i in [0,2,4]];c=[x/12.92 if x<=.04045 else((x+.055)/1.055)**2.4 for x in c];return sum(a*b for a,b in zip(c,[.2126,.7152,.0722]))
def check(name,a,b,minimum):
 ratio=(max(lum(a),lum(b))+.05)/(min(lum(a),lum(b))+.05);assert ratio>=minimum,(name,ratio);rows.append(dict(name=name,foreground=a,background=b,ratio=ratio,minimum=minimum))
for mode,bg,vals in [('light','#fff',[('#f59e0b','#b45309','#17243b'),('#10b981','#047857','#17243b'),('#6366f1','#4f46e5','#fff')]),('dark','#182333',[('#fbbf24','#fbbf24','#17243b'),('#34d399','#34d399','#17243b'),('#818cf8','#818cf8','#17243b')])]:
 for name,(fill,edge,mark)in zip(['warning','positive','neutral'],vals):
  assert f'--fr37-fill:{fill};--fr37-edge:{edge};--fr37-mark:{mark}'in s
  check(mode+' '+name+' boundary',edge,bg,3);check(mode+' '+name+' selected dot',mark,fill,3)
for mode,paper,ink,muted,accent in [('light','#fbf7ee','#243329','#4f5f54','#295a41'),('dark','#172c22','#f1f6ed','#bfcebf','#b8dca6')]:
 for v in [paper,ink,muted,accent]:assert v in page
 check(mode+' page body',ink,paper,4.5);check(mode+' page small print',muted,paper,4.5);check(mode+' heading accent',accent,paper,4.5)
check('local capture button','#fff','#295a41',4.5);check('dark active tool','#172c22','#b8dca6',4.5)
(r/'qa/CONTRAST164.json').write_text(json.dumps({'kind':'Fixed sRGB source pairs only; no browser composite/AT claim','pairs':rows,'minimumRatio':min(x['ratio']for x in rows)},indent=2)+'\n');print(len(rows),'contrast pairs; minimum',min(x['ratio']for x in rows))
