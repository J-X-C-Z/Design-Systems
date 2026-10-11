"""Capture original examples in offline Chromium; Pillow makes the contact sheets.
No external images or font binaries are copied into the resource package.
"""
from pathlib import Path
import json, os, io
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw, ImageFont
R=Path(__file__).resolve().parents[1];P=R/'preview';P.mkdir(exist_ok=True)
font_path=os.environ.get('MIMO_PREVIEW_FONT','/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc')
def font(n):
 try:return ImageFont.truetype(font_path,n)
 except OSError:return ImageFont.load_default()
def drawtext(im,xy,text,size=18,fill='#17201b'):
 ImageDraw.Draw(im).text(xy,text,font=font(size),fill=fill)
# Six different content grammars; identical content across light/dark pair.
W=1500;pad=32;gap=24;cellw=(W-2*pad-gap)//2;head=126;rowh=432
sheet=Image.new('RGB',(W,head+3*rowh+pad),'#f6f5f1')
drawtext(sheet,(pad,20),'MiMo-inspired 2.0 / 六种场景表达',32)
drawtext(sheet,(pad,70),'两个视觉分支 × 三个场景 · 原创页面的实际渲染，不是小米官网截图。',17,'#5b675f')
for i,(scene,title) in enumerate([('research','Research / 研究叙事'),('developer','Developer / 开发者'),('workspace','Workspace / 工作区')]):
 for j,(mode,label)in enumerate([('light','理性人文'),('dark','暗黑科技')]):
  im=Image.open(P/(scene+'.'+mode+'.png')).convert('RGB');im.thumbnail((cellw,rowh-64),Image.Resampling.LANCZOS)
  x=pad+j*(cellw+gap);y=head+i*rowh
  drawtext(sheet,(x,y),title+' · '+label,18)
  sheet.paste(im,(x,y+38))
sheet.save(P/'six-scenarios.png')
# Deterministic time sampling, not fake screenshots of final states.
manifest=json.loads((R/'kit/motion-resources.json').read_text())['resources']
sigs=[m for m in manifest if m['kind']=='signature']
frame_records=[]
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
 ctx=browser.new_context(offline=True,viewport={'width':1440,'height':1000},device_scale_factor=1)
 page=ctx.new_page();page.set_content((R/'dist/MiMo_Design_Language_v2.0.html').read_text(),wait_until='load')
 page.evaluate('MimoLab.setMode("light");MimoLab.setReduced(false)')
 for m in sigs:
  page.evaluate('(id)=>MimoLab.loadMotion(id)',m['localId'])
  for t in [0,.5,1]:
   page.evaluate('(t)=>MimoLab.getMotion().seek(t)',t);page.wait_for_timeout(24)
   name=f"motion-{m['localId']}-{int(t*100):03d}.png"
   page.locator('#motion-stage').screenshot(path=str(P/name))
   frame_records.append({'resource':m['id'],'progress':t,'file':'preview/'+name})
 # One finite preview GIF; actual HTML provides accessible control.
 page.evaluate('MimoLab.loadMotion("evidence-flow")')
 frames=[]
 for k in range(19):
  page.evaluate('(t)=>MimoLab.getMotion().seek(t)',k/18);page.wait_for_timeout(18)
  im=Image.open(io.BytesIO(page.locator('#motion-stage').screenshot())).convert('RGB');im.thumbnail((840,300),Image.Resampling.LANCZOS)
  frames.append(im)
 durations=[50]*len(frames);durations[-1]=1300
 frames[0].save(P/'evidence-flow.gif',save_all=True,append_images=frames[1:],duration=durations,disposal=2,optimize=True)
 # Full-screen design manual overview, in addition to viewport cover.
 page.evaluate('MimoLab.setMode("light");MimoLab.setScene("research");scrollTo({top:0,behavior:"instant"})')
 page.screenshot(path=str(P/'manual.full.png'),full_page=True)
 browser.close()
# Signature keyframes contact sheet.
W=1500;pad=30;gap=16;cw=(W-pad*2-gap*2)//3;head=132;rh=230
sheet=Image.new('RGB',(W,head+rh*5+25),'#f6f5f1')
drawtext(sheet,(pad,20),'MiMo-inspired 2.0 / 五种标志性动效',30)
drawtext(sheet,(pad,67),'0% → 50% → 100% · 由真实运行时定位捕获；播放、暂停、重置见独立 HTML。',17,'#5b675f')
for i,m in enumerate(sigs):
 y=head+i*rh;drawtext(sheet,(pad,y),f"{i+1:02d} / {m['nameZh']} · {m['name']}",19)
 for j,t in enumerate([0,50,100]):
  im=Image.open(P/f"motion-{m['localId']}-{t:03d}.png").convert('RGB');im.thumbnail((cw,rh-56),Image.Resampling.LANCZOS)
  x=pad+j*(cw+gap);sheet.paste(im,(x,y+37));drawtext(sheet,(x+7,y+42),str(t)+'%',13,'#5b675f')
sheet.save(P/'motion-contact-sheet.png')
(P/'motion-frame-index.json').write_text(json.dumps({'version':'2.0.0','method':'offline Chromium; paused real WAAPI controller; normalized seek','frames':frame_records},ensure_ascii=False,indent=2))
print('Created six-scenarios.png, five-motion contact sheet, deterministic frames and finite GIF.')
