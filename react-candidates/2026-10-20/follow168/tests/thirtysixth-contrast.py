from pathlib import Path
import hashlib,json
R=Path(__file__).resolve().parents[1]
component=(R/'src/thirtysixth-controls/styles.css').read_text();page=(R/'examples/follow-new/page.css').read_text()
def luminance(value):
 rgb=[int(value[i:i+2],16)/255 for i in [1,3,5]];linear=[x/12.92 if x<=.04045 else ((x+.055)/1.055)**2.4 for x in rgb];return sum(x*y for x,y in zip(linear,[.2126,.7152,.0722]))
def contrast(a,b):
 x,y=sorted([luminance(a),luminance(b)]);return(y+.05)/(x+.05)
pairs=[]
for ink in ['#202c38','#566473']:
 for paper in ['#ffffff','#edf3ff']:pairs.append(('component light normal text',ink,paper,4.5))
for ink in ['#edf3ff','#becbdc']:
 for paper in ['#182333','#223754']:pairs.append(('component dark normal text',ink,paper,4.5))
pairs += [('light badge/check','#ffffff','#254ecb',4.5),('dark badge/check','#17243b','#a6c1ff',4.5)]
for ink in ['#342847','#665b73']:
 for paper in ['#eae2f3','#fcf8ff','#fffcff','#f0e9f8']:pairs.append(('Choice Cabinet normal text',ink,paper,4.5))
pairs += [('Choice Cabinet title/accent','#63409b','#eae2f3',4.5),('Choice Cabinet badge/action','#ffffff','#63409b',4.5)]
for ink,papers in [('#7b8796',['#ffffff','#182333']),('#8a789d',['#fffcff','#f0e9f8'])]:
 for paper in papers:pairs.append(('native radio boundary',ink,paper,3))
rows=[]
for name,ink,paper,minimum in pairs:
 for color in [ink,paper]:assert color in component+page or color=='#ffffff' and '#fff' in component
 ratio=contrast(ink,paper);assert ratio>=minimum,(name,ink,paper,ratio,minimum);rows.append({'context':name,'foreground':ink,'background':paper,'ratio':round(ratio,4),'minimum':minimum})
for token in ['prefers-reduced-motion','forced-colors','appearance:auto','background:Canvas;color:Highlight']:assert token in component
result={'checks':len(rows),'kind':'Static sRGB at authored colors and explicit CSS variable backgrounds; not a rendered browser or AT check','disabledOpacityExcluded':True,'decorativeStampExcluded':True,'sourceSHA256':hashlib.sha256(component.encode()).hexdigest(),'pageCSSSHA256':hashlib.sha256(page.encode()).hexdigest(),'pairs':rows}
(R/'qa/RADIO160-CONTRAST.json').write_text(json.dumps(result,indent=2)+'\n');print(len(rows),'static radio/page contrast pairs')
