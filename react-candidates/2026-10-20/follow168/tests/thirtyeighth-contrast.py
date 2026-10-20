from pathlib import Path
import json
r=Path(__file__).resolve().parents[1];source=(r/'src/thirtyeighth-controls/styles.css').read_text();page=(r/'examples/follow-new/page.css').read_text();pairs=[]
def lum(v):
 v=v.lstrip('#');v=''.join(x*2 for x in v)if len(v)==3 else v;c=[int(v[i:i+2],16)/255 for i in [0,2,4]];c=[x/12.92 if x<=.04045 else((x+.055)/1.055)**2.4 for x in c];return sum(a*b for a,b in zip(c,[.2126,.7152,.0722]))
def check(name,a,b,minimum):
 ratio=(max(lum(a),lum(b))+.05)/(min(lum(a),lum(b))+.05);pairs.append(dict(name=name,foreground=a,background=b,ratio=ratio,minimum=minimum));assert ratio>=minimum,(name,ratio)
for mode,ink,muted,paper,soft,border,accent,tint in [('light','#1c2b41','#4d607a','#fff','#eef2f7','#77859b','#285a9c','#edf3fd'),('dark','#f0f5fc','#bcc8db','#182338','#202e45','#8395af','#9cc6ff','#233b5a')]:
 for v in [ink,muted,paper,soft,border,accent,tint]:assert v in source
 for bg in [paper,soft,tint]:check(mode+' text '+bg,ink,bg,4.5);check(mode+' small text '+bg,muted,bg,4.5)
 check(mode+' unselected boundary',border,paper,3);check(mode+' selected dot and border',accent,paper,3);check(mode+' selected card outline',accent,tint,3);check(mode+' focus',accent,soft,3)
 check(mode+' switch checked thumb','#fff'if mode=='light'else'#132235',accent,3)
 # Dark unchecked original foreground-colored track plus white thumb needs its own pair.
 assert '--fr38-off:#4d607a' in source and 'background:var(--fr38-off)' in source
 check(mode+' switch unchecked thumb','#fff','#4d607a',3)
for mode,ink,muted,paper,panel,deep in [('light','#16365b','#4b6683','#f4f8fd','#fff','#173d68'),('dark','#e5f0ff','#b5cae3','#101e31','#192c45','#a7cfff')]:
 for v in [ink,muted,paper,panel,deep]:assert v in page
 for bg in [paper,panel]:check(mode+' page text '+bg,ink,bg,4.5);check(mode+' page small '+bg,muted,bg,4.5)
 check(mode+' index',deep,paper,4.5)
check('light record','#f4f8fd','#173d68',4.5);check('dark record','#f4f8fd','#233e5e',4.5)
(r/'qa/CONTRAST168.json').write_text(json.dumps({'kind':'Fixed authored sRGB pairs; not rendered browser or accessibility-tree acceptance','pairs':pairs,'minimumRatio':min(x['ratio']for x in pairs)},indent=2)+'\n');print(len(pairs),'fixed contrast pairs')
