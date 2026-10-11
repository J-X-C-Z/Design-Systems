"""Static-only extraction of fixed upstream style literals; executes no component effects."""
from pathlib import Path
import re,json
root=Path('dashi-style-previews');src=root/'vendor-work/dist/theme-runtime/theme10.module.mjs';page=root/'theme10/index.html'
text=src.read_text();roots=set(re.findall(r'<div class="([a-z0-9-]+-root)[^"]*"',page.read_text()))-{'bespoke-root'}
found={}
for m in re.finditer(r'\.textContent=`([\s\S]*?)`',text):
 css=m[1]
 matched={r for r in roots if '.'+r+'{' in css or '.'+r+' ' in css}
 if not matched:continue
 if '${' in css or '\\' in css:raise SystemExit('Needs explicit static interpolation/escape review')
 for r in matched:found[r]=css
if set(found)!=roots:raise SystemExit('Missing style literals: '+str(roots-set(found)))
css='/* Fixed Dashi theme10 CSS literals, AGPL-3.0; no effects executed. */\n'+'\n'.join(dict.fromkeys(found.values()))
(root/'vendor-work/theme10-static.css').write_text(css)
(root/'theme10/STATIC-CSS-EXTRACTION.json').write_text(json.dumps({'sourceCommit':'21dc7e5fc8c3a0d7f6a94948153dd1ee954f4e64','roots':sorted(roots),'literalBlocks':len(set(found.values())),'characters':len(css),'interpolations':0,'effectsExecuted':False},indent=2))
print(len(css),sorted(roots))
