from pathlib import Path
import json, re, shutil
ROOT=Path(__file__).resolve().parents[1]
VERSION='2.0.0'
def write(path, content):
 p=ROOT/path; p.parent.mkdir(parents=True, exist_ok=True); p.write_text(content,encoding='utf-8')
def dump(path,obj): write(path,json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
# Authored values. These are release defaults for the personal design language,
# never presented as extracted Xiaomi production values.
base={
 'id':'personal.mimo-inspired','version':VERSION,'status':'personal-release',
 'name':'MiMo-inspired / 理性技术人文',
 'provenance':'Independent interpretation of Xiaomi MiMo references; not an official Xiaomi system.',
 'axes':{'branches':['rational-humanistic','dark-tech'],'scenes':['research','developer','workspace']},
 'decisions':{'layouts':'optional','components':'optional','motion':'language','themeSwitch':'skin','references':'both','resources':'shared'},
 'identity':{'statement':'以清晰的结构承载复杂能力，以有人情味的表达保留人的主动权。',
 'invariants':['type carries hierarchy','content before interface chrome','number and direction form navigation','tools are real content','motion makes relationships legible'],
 'creativeFreedom':'Create new layouts, components and motion compositions. References are examples, not templates. Preserve purpose and meaning; do not mechanically copy geometry.'},
 'typography':{
  'sans':'system-ui, -apple-system, "Segoe UI", "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif',
  'mono':'ui-monospace, "SFMono-Regular", Consolas, "Liberation Mono", monospace',
  'displayLatin':{'weight':650,'trackingEm':-.055,'lineHeight':.98},
  'displayCJK':{'weight':650,'trackingEm':-.025,'lineHeight':1.14},
  'body':{'sizePx':16,'lineHeight':1.75},'meta':{'sizePx':12,'lineHeight':1.5},
  'fontFilesBundled':False,'note':'System fallback font appearance varies by OS; no pixel-identical typography promise.'},
 'geometry':{'spacingPx':[4,8,12,16,24,32,48,64,96], 'radiusPx':{'control':4,'panel':8,'composer':14},
  'maxContentPx':1440,'readingMeasure':'38em','mobilePageGutterPx':20,'comfortableTargetPx':44,
  'breakpointsPx':{'compact':600,'medium':1000},'policy':'Defaults, not mandatory coordinates or a mandatory grid.'},
 'branches':{
 'rational-humanistic':{'label':'理性人文','short':'light','tone':'纸面、清晰、开放、平静但不疏离',
  'color':{'canvas':'#F6F5F1','surface':'#FFFFFF','raised':'#EBEDE7','ink':'#17201B','muted':'#5B675F','subtle':'#606C64','rule':'#D0D5CC','control':'#7C897F','accent':'#96512F','accentSoft':'#ECD9CA','accentInk':'#703717','action':'#1D2A23','onAction':'#FFFFFF','focus':'#315C9C','success':'#21623F','warning':'#805100','danger':'#A02F34'},
  'material':'warm matte surfaces, quiet contour, precise rules','defaultMotion':'direct / settled'},
 'dark-tech':{'label':'暗黑科技','short':'dark','tone':'深色工作面、克制焦点、明确层级，不等同霓虹科幻',
  'color':{'canvas':'#111814','surface':'#18221C','raised':'#233129','ink':'#F0F3EC','muted':'#B0BDAF','subtle':'#A1B39F','rule':'#3C5143','control':'#829880','accent':'#E3AF86','accentSoft':'#493A2D','accentInk':'#FFDCC0','action':'#EDF1E8','onAction':'#152019','focus':'#A7C6FF','success':'#A2DAB5','warning':'#F0CA7F','danger':'#FFAAA7'},
  'material':'layered neutral dark, local warm signals, no mandatory glow','defaultMotion':'focused / settled'}},
 'motion':{'durationsMs':{'instant':0,'micro':160,'state':280,'reveal':520,'narrative':900},
  'easing':{'settle':'cubic-bezier(.22,.75,.2,1)','direct':'cubic-bezier(.2,0,0,1)','linear':'linear'},
  'defaultDisplacementPx':{'hint':5,'enter':14,'surface':8},
  'reducedPolicy':'nonessential spatial changes finish immediately; final content and meaningful state remain available',
  'continuousPolicy':'no ambient autoplay in the kit; explicit play/pause/reset',
  'authoredNotObserved':True},
 'scope':{'coreDependencies':[],'runtime':'CSS + browser Web Animations API','spEngineDependency':False},
 'releaseContract':{'schemaVersion':2,'snapshotVersioned':True,'mutateExistingAnimationsOnSkin':False,'externalAssetsRequired':False}
}
dump('kit/design-language.json',base)
# Stable color aliases and independent component/motion sources.
css=['/* MiMo-inspired 2.0.0. Personal authored defaults, NOT Xiaomi source. No font files. */']
for bid,p in base['branches'].items():
 sel=':root, [data-mimo-mode="light"], [data-mimo-branch="rational-humanistic"]' if p['short']=='light' else '[data-mimo-mode="dark"], [data-mimo-branch="dark-tech"]'
 css.append(sel+' {\n  color-scheme:'+p['short']+';\n'+''.join('  --mimo-'+re.sub(r'([A-Z])',lambda m:'-'+m[1].lower(),k)+':'+v+';\n' for k,v in p['color'].items())+'}')
css.append(':root {--mimo-sans:'+base['typography']['sans']+';--mimo-mono:'+base['typography']['mono']+';--mimo-ease:cubic-bezier(.22,.75,.2,1);--mimo-micro:160ms;--mimo-state:280ms;--mimo-reveal:520ms;--mimo-page-gutter:clamp(20px,4.2vw,64px);}')
write('kit/tokens.css','\n'.join(css)+'\n')
MOTIONS=[
 ('index-trace','Index Trace','索引描线','signature','阅读方向','scaleX + translateX',520,'line','沿编号建立阅读路径。','用于索引、章节开启；不是每个段落都强制播放。'),
 ('type-unfold','Type Unfold','文字展开','signature','信息揭示','clip-path + translateY',520,'type','先让标题成为结构，再显露其解释。','使用整行或词组遮罩，不让逐字动画打断中文阅读。'),
 ('evidence-flow','Evidence Flow','证据流','signature','因果连接','stroke-dashoffset + scale',900,'flow','路径先建立联系，节点再获得意义。','对应流程与数据来源，顺序必须服从事实，而非视觉方便。'),
 ('focus-aperture','Focus Aperture','焦点开窗','signature','空间聚焦','clip-path circle',520,'aperture','在上下文中揭示焦点，不替换整张画面。','关键文字不依赖遮罩才能访问；减少动态效果时直接展示。'),
 ('quiet-reframe','Quiet Reframe','静默重构','signature','状态连续','transform of stable object',520,'reframe','同一对象在新状态中保持身份。','可组合重排示例；不能在 Skin 换肤时擅自触发。'),
 ('directional-hint','Directional Hint','方向提示','shared','操作暗示','translateX',160,'direction','通过很小的方向变化解释下一步。','键盘 focus 同样反馈，移动端不依赖 hover。'),
 ('surface-resolve','Surface Resolve','表面显现','shared','层级变化','scale + translateY + opacity',280,'surface','短暂区分浮层和基底，结束后界面回归平静。','退出或快速重开时取消旧动画，不无限堆叠。'),
 ('command-confirm','Command Confirm','操作确认','shared','结果反馈','stroke-dashoffset',280,'command','完成信号跟在真实操作之后。','复制失败不显示已复制；展示台播放只是动效样例。'),
 ('state-relay','State Relay','状态接力','shared','任务推进','scaleX + state emphasis',900,'relay','解释当前步骤与下一步的关系。','不把演示进度当成真实服务端进度；状态使用文字同时表达。'),
 ('data-reconcile','Data Reconcile','数据衔接','shared','数值变化','scaleX',520,'data','让新旧数据具有可追踪关系。','图形使用同一坐标和数据；减少动态效果直接显示新值。')
]
manifest={'languageId':base['id'],'version':VERSION,'count':len(MOTIONS),'resources':[]}
for id,en,cn,kind,intent,props,dur,scene,meaning,policy in MOTIONS:
 manifest['resources'].append({'id':'mimo.motion.'+id,'localId':id,'name':en,'nameZh':cn,'kind':kind,'intent':intent,'properties':props,'durationMs':dur,'demoScene':scene,'meaning':meaning,'guidance':policy,'parameters':{'duration':{'unit':'ms','min':1,'max':5000},'amplitude':{'min':0,'max':2,'scope':'only translation keyframes; not geometry or data'},'direction':{'values':['forward','reverse'],'scope':'parameterized horizontal translation only'},'autoplay':'boolean','reduced':'boolean; cannot override system reduce','onUpdate':'optional callback'},'targetBinding':'data-part hooks inside root; see motion-examples.json; targets is not an options parameter','support':{'offline':True,'reducedMotion':'final-state','editable':'DOM/SVG + animation descriptor','cancel':True,'pause':True,'seek':True},'reuse':{'mode':'adapt-to-host-by-default','keepOriginal':'explicit scoped branch, not whole-theme inheritance'},'implementation':'kit/motion.js','origin':'original-authored'})
dump('kit/motion-resources.json',manifest)
# Evidence entries use official sources; links only, no redistribution of branded assets.
refs=[
 ('R01','Claude Design — design system setup','https://support.claude.com/en/articles/14604397-set-up-your-design-system-in-claude-design','Extract colors, typography, components and layout patterns from assets; validate with new projects; include finished examples.','official-text','Method reference, not proof this work ran in Claude Design.'),
 ('R02','MiMo Research','https://mimo.xiaomi.com/zh','Repeated wordmark text; large greeting hierarchy in content; numbered paper/blog/action index and arrows.','official-text','Content structure verified; production computed styles not obtained.'),
 ('R03','MiMo Code','https://mimo.xiaomi.com/coder?lang=en','Platform choice, installation command, copy confirmation and developer documentation entry.','official-text','Does not establish exact motion timing or all frontend states.'),
 ('R04','MiMo Code Docs','https://mimo.xiaomi.com/mimocode/start','Categorized navigation, search and readable developer content.','official-text','Pattern evidence, not a universal website grid.'),
 ('R05','MiMo Studio feature log','https://mimo.mi.com/docs/zh-CN/updates/feature/studio','2026-07-23 names Rational Humanistic / Dark Tech; later log describes audio visualization and directory scrolling.','official-text','Two branches in this personal library are an authored cross-product generalization.'),
 ('R06','MiMo materials research','https://mimo.xiaomi.com/mimo-v2-6-material-research/','Interactive figure has rotate, pause and reset controls, alongside numbered research narrative.','official-text','Only interaction existence is verified; no timing or scientific conclusions adopted.'),
 ('R07','MiMo Code feature image','https://mimo.xiaomi.com/coder/assets/feature-model.png','Official image visually shows warm ground, brush-like contour, light terminal and orange emphasis.','official-image-inspected','Reference only; image, trademark and fonts are NOT bundled.'),
 ('R08','W3C contrast minimum','https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html','Normal text target 4.5:1; large text 3:1 under the relevant criterion.','official-standard','Our test covers listed color pairs, not total WCAG conformance.'),
 ('R09','W3C interaction animation','https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html','Nonessential motion triggered by interaction can be disabled.','official-standard','Reduced mode is tested in original specimens, not official websites.'),
 ('R10','W3C reflow','https://www.w3.org/WAI/WCAG22/Understanding/reflow.html','Reflow without loss of content is a key responsive requirement.','official-standard','320 CSS px viewport tests are not a full accessibility audit.'),
 ('R11','Agent Skills specification','https://agentskills.io/specification','Skill metadata, instructions and references can be separated and loaded progressively.','official-spec','Kit includes optional lightweight skill; MCP delivery is not automatic installation.')]
reg={'checkedAt':'2026-10-10','officialCssMeasured':False,'networkAttempt':'Container DNS failed for mimo.xiaomi.com; managed Chromium blocked external and file navigations. No policy bypass attempted. Official public pages inspected through web tool.','references':[{'id':a,'title':b,'url':c,'observation':d,'evidence':e,'boundary':f} for a,b,c,d,e,f in refs],'releaseStatus':'authored-complete; not an official-site replica','productionClaimsExcluded':['official-font-identification','official-easing-measurement','all-device-certification','SP-runtime-integration','actual-Claude-session-execution']}
dump('evidence/references.json',reg)
write('evidence/README.md','# Evidence boundary\n\nOfficial sources establish observed patterns. Release colors, spacing, CSS and all motion implementations are independent design decisions. The absence of production CSS does not block a personal design release. See references.json; no hidden claims of pixel measurement.\n')
# SVG assets are authored, use simple editable paths and semantic currentColor.
contours=[]
for i in range(18):
 x=72+i*13; y=65+i*7
 contours.append(f'<path d="M {x} 455 C {x-90} 280 {x+270} 330 {x+170} {y+100} S {x+170} {y-55} {x+315} {y+28}"/>')
svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 520" role="img" aria-label="Original quiet contour field"><g fill="none" stroke="currentColor" stroke-width="1.2" opacity=".66">'+''.join(contours)+'</g></svg>'
write('assets/quiet-contour.svg',svg)
write('assets/evidence-flow.svg','''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 240" role="img" aria-label="An original three-stage evidence flow"><g fill="none" stroke="currentColor" stroke-width="2"><path d="M60 170C140 170 180 70 300 70S430 170 540 170"/><circle cx="60" cy="170" r="12"/><circle cx="300" cy="70" r="12"/><circle cx="540" cy="170" r="12"/></g></svg>''')
write('assets/focus-frame.svg','''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" role="img" aria-label="Original focus brackets"><path d="M40 75V35h40M320 35h40v40M360 165v40h-40M80 205H40v-40" fill="none" stroke="currentColor" stroke-width="2"/><path d="M160 120h80M200 80v80" fill="none" stroke="currentColor" opacity=".25"/></svg>''')
write('assets/index-rule.svg','''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 48" role="img" aria-label="Original directional rule"><path d="M0 24H395m-12-12 12 12-12 12" fill="none" stroke="currentColor" stroke-width="2"/></svg>''')
dump('assets/manifest.json',{'version':VERSION,'resources':[{'id':'mimo.graphic.'+Path(f).stem,'path':f,'origin':'original','themeBinding':'currentColor','editable':'SVG paths','reuse':'shared','fontFiles':False} for f in ['quiet-contour.svg','evidence-flow.svg','focus-frame.svg','index-rule.svg']]})
print('Foundation generated', ROOT)
if __name__ == '__main__':
 import runpy
 if (ROOT/'src/lab.js').exists(): runpy.run_path(str(ROOT/'src/render.py'),run_name='__main__')
