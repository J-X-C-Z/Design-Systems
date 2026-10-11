"""Run authored specimens in managed, offline Chromium via set_content.
Does not certify file://, other operating systems, or complete WCAG compliance.
Requirements: Python playwright and Chromium; CHROMIUM_PATH can override executable.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import json, re, os, hashlib
R=Path(__file__).resolve().parents[1]; P=R/'preview';P.mkdir(exist_ok=True)
rep={'version':'2.0.0','date':'2026-10-10','method':'exact HTML bytes; set_content; managed offline Chromium','limitations':['file:// blocked by managed policy','No physical Windows/macOS/Safari/Firefox testing','Clipboard branches use mocks, not OS clipboard proof','Listed token contrast pairs only, not complete WCAG conformance'],'checks':[],'responsive':[],'errors':[],'externalRequests':[]}
def check(n,ok,d=None):
 rep['checks'].append({'name':n,'passed':bool(ok),'detail':d});print(('PASS 'if ok else'FAIL ')+n, ''if ok else d,flush=True)
def lum(s):
 v=[int(s[i:i+2],16)/255 for i in (1,3,5)];v=[x/12.92 if x<=.04045 else((x+.055)/1.055)**2.4 for x in v];return sum(a*b for a,b in zip(v,[.2126,.7152,.0722]))
def cr(a,b):
 a,b=sorted([lum(a),lum(b)]);return(b+.05)/(a+.05)
profile=json.loads((R/'kit/design-language.json').read_text());pairs=[]
for branch,d in profile['branches'].items():
 c=d['color']
 for fg,bg,target in [(f,b,4.5) for f in ['ink','muted','subtle','accent','success','warning','danger']for b in ['canvas','surface','raised']]+[('onAction','action',4.5),('control','surface',3),('focus','canvas',3),('accentInk','accentSoft',4.5)]:
  v=cr(c[fg],c[bg]);pairs.append({'branch':branch,'fg':fg,'bg':bg,'ratio':round(v,3),'target':target,'passed':v>=target})
rep['contrast']=pairs;check('semantic contrast pairs',all(x['passed']for x in pairs),[x for x in pairs if not x['passed']])
text=(R/'dist/MiMo_Design_Language_v2.0.html').read_text()
check('no external runtime script, stylesheet or font',not re.search(r'<script[^>]+src=|<link[^>]+stylesheet|@font-face|@import\s|url\(\s*[\"\']?https?://',text,re.I))
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
 c=b.new_context(viewport={'width':1440,'height':1000},device_scale_factor=1,offline=True,accept_downloads=True)
 pg=c.new_page();pg.on('pageerror',lambda e:rep['errors'].append(str(e)));pg.on('request',lambda r:rep['externalRequests'].append(r.url)if r.url.startswith(('http://','https://'))else None)
 pg.set_content(text,wait_until='load');rep['browser']=pg.evaluate('navigator.userAgent')
 check('library boot with ten motion resources',pg.evaluate('!!MimoLab && !!MimoSkin && MimoMotion.ids.length===10'))
 for width in [1440,1024,390,320]:
  pg.set_viewport_size({'width':width,'height':950})
  for mode in ['light','dark']:
   pg.evaluate('(m)=>MimoLab.setMode(m)',mode)
   for scene in ['research','developer','workspace']:
    pg.evaluate('(s)=>MimoLab.setScene(s)',scene)
    for stress in [False,True]:
     if(pg.locator('#text-toggle').get_attribute('aria-pressed')=='true')!=stress:pg.evaluate('document.querySelector("#text-toggle").click()')
     over=pg.evaluate('''()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,clipped:Array.from(document.querySelectorAll('h1,h2,h3,p,.figure-thesis,[data-edit-id]')).filter(e=>e.clientWidth>0&&getComputedStyle(e).display!=='none'&&e.scrollWidth>e.clientWidth+3).map(e=>({id:e.dataset.editId||e.className,width:e.clientWidth,scroll:e.scrollWidth,text:e.textContent.slice(0,65)}))})''')
     ok=over['scroll']<=width+1 and not over['clipped'];rep['responsive'].append({'width':width,'mode':mode,'scene':scene,'longText':stress,'passed':ok,'overflow':over if not ok else None})
 check('48 responsive combinations',all(x['passed']for x in rep['responsive']),[x for x in rep['responsive']if not x['passed']])
 pg.set_viewport_size({'width':1440,'height':1000});pg.evaluate("MimoLab.setMode('light');MimoLab.setScene('research')")
 if pg.locator('#text-toggle').get_attribute('aria-pressed')=='true':pg.evaluate('document.querySelector("#text-toggle").click()')
 pg.evaluate("MimoLab.loadMotion('quiet-reframe');MimoLab.getMotion().seek(.45)")
 statejs='''()=>({texts:MimoLab.getProject().texts,html:document.querySelector('#motion-root').innerHTML,t:MimoLab.getMotion().progress,fixed:getComputedStyle(document.querySelector('#fixed-style')).color,box:(()=>{let r=document.querySelector('#specimen').getBoundingClientRect();return[r.width,r.height]})()})'''
 before=pg.evaluate(statejs);pg.evaluate("MimoLab.setMode('dark')");check('skin preserves content geometry overrides and paused timeline',before==pg.evaluate(statejs))
 check('explicit style and local overrides',pg.evaluate("MimoSkin.resolve({value:'#f00'},{branch:{ink:'#000'}})==='#f00'&&MimoSkin.resolve({token:'ink'},{branch:{ink:'a'},page:{ink:'b'}})==='b'"))
 check('snapshot is detached and versioned',pg.evaluate("(()=>{let s=MimoSkin.snapshot(MimoLab.profile,'light');s.tokens.ink='changed';return MimoLab.profile.branches['rational-humanistic'].color.ink!=='changed'&&s.schemaVersion===2})()"))
 for id in pg.evaluate('MimoMotion.ids'):
  pg.evaluate('(id)=>{MimoLab.loadMotion(id);MimoLab.getMotion().seek(.5)}',id)
  check('seek '+id,pg.evaluate('Math.abs(MimoLab.getMotion().progress-.5)<.001&&document.querySelector("#motion-root").getAnimations({subtree:true}).length>0'))
  pg.evaluate('MimoLab.getMotion().play()');pg.wait_for_timeout(25);pg.evaluate('MimoLab.getMotion().pause()');t=pg.evaluate('MimoLab.getMotion().progress');pg.wait_for_timeout(25)
  check('pause '+id,t==pg.evaluate('MimoLab.getMotion().progress'));pg.evaluate('MimoLab.getMotion().finish()');check('finish '+id,pg.evaluate('MimoLab.getMotion().progress===1'))
 pg.evaluate("for(let i=0;i<20;i++)MimoLab.loadMotion('evidence-flow')");check('replacing animations does not accumulate instances',pg.evaluate('document.getAnimations().length<=4'))
 pg.evaluate('MimoLab.setReduced(true)')
 for id in pg.evaluate('MimoMotion.ids'):
  pg.evaluate('(id)=>MimoLab.loadMotion(id)',id);check('reduced '+id,pg.evaluate('MimoLab.getMotion().progress===1&&!MimoLab.getMotion().playing'))
 pg.evaluate('MimoLab.setReduced(false)');pg.emulate_media(reduced_motion='reduce');pg.evaluate("MimoLab.loadMotion('focus-aperture')");check('system reduced motion',pg.evaluate('MimoLab.getMotion().progress===1'));pg.emulate_media(reduced_motion='no-preference')
 pg.evaluate("MimoLab.setScene('research')");pg.locator('#tab-research').focus();pg.keyboard.press('ArrowRight');check('keyboard tab navigation',pg.evaluate("MimoLab.getProject().scene==='developer'&&document.querySelectorAll('[data-scene][tabindex=\"0\"]').length===1"))
 pg.locator('#open-dialog').click();check('dialog focus contained',pg.evaluate('document.querySelector("#demo-dialog").open&&document.querySelector("#demo-dialog").contains(document.activeElement)'));pg.keyboard.press('Escape');check('dialog Escape restores focus',pg.evaluate('!document.querySelector("#demo-dialog").open&&document.activeElement.id==="open-dialog"'))
 pg.locator('#validate-name').click();check('invalid input state',pg.locator('#name-input').get_attribute('aria-invalid')=='true');pg.locator('#name-input').fill('MiMo release');pg.locator('#validate-name').click();check('input correction retains data',pg.locator('#name-input').input_value()=='MiMo release'and pg.locator('#name-input').get_attribute('aria-invalid')=='false')
 pg.evaluate("MimoLab.setScene('developer');Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{}},configurable:true})");pg.locator('#copy-command-button').click();check('copy success branch mock','已复制'in pg.locator('#copy-command-button').inner_text())
 pg.evaluate("Object.defineProperty(navigator,'clipboard',{value:{writeText:async()=>{throw Error('denied')}},configurable:true});document.execCommand=()=>false");pg.locator('#copy-command-button').click();check('copy failure branch mock','未授予复制权限'in pg.locator('#toast').inner_text())
 pg.evaluate("MimoLab.setScene('workspace')");pg.locator('#task-run').click();pg.wait_for_timeout(100);pg.locator('#task-cancel').click();pg.wait_for_timeout(2050);check('task cancellation clears timers and retains input','已取消'in pg.locator('#task-status').inner_text()and bool(pg.locator('#task-input').input_value()))
 pg.locator('#task-run').click();pg.wait_for_timeout(2100);check('local simulation labelled on completion','非 AI 生成'in pg.locator('#task-status').inner_text()and pg.locator('#task-progress').get_attribute('aria-valuenow')=='3')
 stable=pg.evaluate('MimoLab.getProject()');bad={**stable,'mode':'light','texts':{'unexpected-asset':'invalid'}}
 rejected=pg.evaluate('(p)=>{try{MimoLab.applyProject(p);return false}catch(e){return true}}',bad);check('invalid import atomic',rejected and stable==pg.evaluate('MimoLab.getProject()'))
 check('literal JSON prototype key rejected',pg.evaluate('''()=>{let p=MimoLab.getProject();p.texts=JSON.parse('{"__proto__":"invalid"}');try{MimoLab.validateProject(p);return false}catch(e){return true}}'''))
 attack={**stable,'texts':{**stable['texts'],'research-title':'</script><img src=x onerror="window.UNSAFE=1"> literal text'}};pg.evaluate('(p)=>MimoLab.applyProject(p)',attack);check('untrusted import stays plain text',pg.evaluate('!window.UNSAFE&&!document.querySelector("[data-edit-id=research-title] img")'))
 with pg.expect_download()as d:pg.locator('#export-project').click()
 out=P/'roundtrip.project.json';d.value.save_as(str(out));check('JSON roundtrip',json.loads(out.read_text())==pg.evaluate('MimoLab.getProject()'))
 with pg.expect_download()as d:pg.locator('#export-html').click()
 out=P/'roundtrip.html';d.value.save_as(str(out));pg2=c.new_page();pg2.on('pageerror',lambda e:rep['errors'].append(str(e)));pg2.set_content(out.read_text(),wait_until='load');check('editable HTML roundtrip',pg2.evaluate('MimoLab.getProject()')==pg.evaluate('MimoLab.getProject()'));check('HTML export escapes script-ending input',pg2.evaluate('!window.UNSAFE&&!document.querySelector("[data-edit-id=research-title] img")'));pg2.close()
 pg.set_content(text,wait_until='load');pg.set_viewport_size({'width':1440,'height':1000})
 for mode in ['light','dark']:
  pg.evaluate('(m)=>MimoLab.setMode(m)',mode)
  for scene in ['research','developer','workspace']:
   pg.evaluate('(s)=>MimoLab.setScene(s)',scene);pg.locator('#specimen').screenshot(path=str(P/(scene+'.'+mode+'.png')))
  pg.evaluate("scrollTo({top:0,behavior:'instant'})");pg.screenshot(path=str(P/('desktop.'+mode+'.png')),full_page=False)
 pg.evaluate("MimoLab.setMode('light');MimoLab.setScene('research');MimoLab.loadMotion('evidence-flow');MimoLab.getMotion().seek(.6)");pg.locator('#motion').screenshot(path=str(P/'motion.lab.png'))
 pg.set_viewport_size({'width':390,'height':844});pg.evaluate("scrollTo({top:0,behavior:'instant'})");pg.screenshot(path=str(P/'mobile.light.png'));pg.evaluate("MimoLab.setMode('dark');MimoLab.setScene('workspace')");pg.locator('#specimen').screenshot(path=str(P/'mobile.workspace.dark.png'))
 for fp in sorted((R/'examples').glob('*.html')):
  pg2=c.new_page();pg2.set_content(fp.read_text(),wait_until='load');a=fp.stem.split('.');s=pg2.evaluate('MimoLab.getProject()');check('standalone '+fp.name,s['scene']==a[0]and s['mode']==a[1]);pg2.close()
 check('no JavaScript exceptions',not rep['errors'],rep['errors']);check('no external runtime requests',not rep['externalRequests'],rep['externalRequests']);b.close()
rep['summary']={'passed':sum(x['passed']for x in rep['checks']),'failed':sum(not x['passed']for x in rep['checks']),'responsiveCases':len(rep['responsive']),'contrastPairs':len(pairs)}
rep['sourceSha256']=hashlib.sha256(text.encode()).hexdigest();(P/'validation.json').write_text(json.dumps(rep,ensure_ascii=False,indent=2));print(rep['summary']);raise SystemExit(1 if rep['summary']['failed']else 0)
