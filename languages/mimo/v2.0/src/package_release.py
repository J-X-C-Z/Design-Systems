"""Index canonical design language deliverables and record reproducible checksums.
Run from any working directory. Does not upload or alter any external repository.
"""
from pathlib import Path
import hashlib, json
R=Path(__file__).resolve().parents[1]
report=json.loads((R/'preview/validation.json').read_text())
main=R/'dist/MiMo_Design_Language_v2.0.html'
if report['summary']['failed']:
 raise RuntimeError('Release blocked: recorded tests failed')
if hashlib.sha256(main.read_bytes()).hexdigest()!=report['sourceSha256']:
 raise RuntimeError('Release blocked: HTML changed since browser verification')
required=['README.md','CHANGELOG.md','LICENSE_AND_PROVENANCE.md','docs/DESIGN_LANGUAGE.md','docs/MOTION.md','docs/COMPONENTS.md','docs/INTEGRATION.md','adapters/SP_ADAPTATION.md','ai/AI_CONTEXT.md','ai/SKILL.md','kit/motion.js','kit/skin.js','kit/tokens.css','kit/mimo.css','kit/design-language.json','kit/motion-resources.json','kit/motion-examples.json','examples/scene-source.json','evidence/references.json','evidence/visual-reference-index.json','preview/six-scenarios.png','preview/motion-contact-sheet.png']
missing=[s for s in required if not (R/s).is_file()]
if missing:raise RuntimeError('Missing release deliverables: '+repr(missing))
refs=json.loads((R/'evidence/visual-reference-index.json').read_text())
# Keep runtime checks fully available as data and human-readable evidence.
summary=report['summary'];pairs=report['contrast']
mintext=min(p['ratio'] for p in pairs if p['target']==4.5)
mincontrol=min(p['ratio'] for p in pairs if p['target']==3)
lines=[
 '# MiMo-inspired 2.0 · 实际验证报告',
 '',
 '> 日期：2026-10-10。对象是本包原创页面和运行时，不是小米官网。自动化测试并不替代用户对设计风格的最终审美选择。',
 '',
 '## 结果',
 '',
 f"**{summary['passed']} 项检查通过，{summary['failed']} 项失败；{summary['responsiveCases']} 组响应式场景；{summary['contrastPairs']} 个指定语义色组合。**",
 '',
 '| 检查 | 实际结果 |', '|---|---|',
 '| 页面环境 | 管理式 Linux Chromium，headless，离线上下文 |',
 '| 测试载入 | 将本地最终 HTML 的精确文本交给 Playwright set_content；未请求网络资源 |',
 '| 窄屏与长文 | 1440 / 1024 / 390 / 320 CSS px × 两分支 × 三场景 × 中文/长英文，共48组；未检测到页面级横向溢出或检查目标文字裁切 |',
 '| 十种动效 | 实际 WAAPI 对象、进度定位、暂停/继续、完成状态和重复替换；并非只检查按钮是否存在 |',
 '| 减少动态效果 | 十资源静态终态、系统 reduce 偏好，以及用户控制 |',
 '| 换肤与覆盖 | 保留文字、布局几何、显式颜色和暂停动画进度；支持撤销及独立快照 |',
 '| 交互 | 键盘选项卡；弹窗焦点和 Escape；空值/错误修正；任务取消后清理旧计时器 |',
 '| 复制 | 成功/失败两分支用测试桩验证；不等于当前操作系统剪贴板已实测 |',
 '| 导入与导出 | JSON、HTML重新载入；未知字段拒绝且不改变原状态；恶意标签和结束script字符串仍为普通文字 |',
 '| 六个独立样例 | 全部初始化到对应场景和分支，保留同一语言结构 |',
 '| 运行异常和外部请求 | 未记录 JS 异常，未记录 HTTP/HTTPS 运行时请求 |',
 '',
 f'颜色检查中，要求4.5:1的文字组合最低为 **{mintext:.3f}:1**，要求3:1的交互边界/焦点组合最低为 **{mincontrol:.3f}:1**。仅代表列举组合，不覆盖任意用户配色、背景照片和透明混合。',
 '',
 '本轮发现并修复了浅色 subtle 在 raised 底面上的对比度不足；修复后重新生成全部页面并完整执行回归。导入器也拒绝特殊原型键与未知文本字段，避免“导入失败但模式已经改变”的部分写入。',
 '',
 '## 视觉检查',
 '',
 '人工查看了原创桌面首页、动效台、移动工作区及动效关键帧。六场景参考图来自同一份实现；五种标志性动效在0/50/100%时间点由真实控制器定位后截图，证据清单在 preview/motion-frame-index.json。它们不是外部宣传图。',
 '',
 '## 不在本轮验证范围',
 '',
 '- 管理环境禁止 file:// 导航，因此未将双击本地HTML列为实机通过。产物没有外部运行依赖，但跨机器双击表现仍属于浏览器环境边界。',
 '- 未实测物理 Windows/macOS、Safari、Firefox、屏幕阅读器与真实多显示器，不宣称全部浏览器兼容或完整 WCAG 合规。',
 '- 官网 computed CSS、官方字体二进制和原生动效时间线没有取得；本版参数与代码是个人原创默认，不是官网测量值。',
 '- Workspace 是标明的本地模拟，不调用模型和后端；SP 与 MCP 没有接入，本报告不为它们的功能验收背书。',
 '',
 '这些边界与“个人设计语言、资源和展示台已经完成”并不矛盾。它们界定了交付范围，避免把设计完成混同于所有产品和设备的部署完成。',
 '',
 '## 可重现性',
 '',
 '执行 `python src/build.py`，然后 `python tests/validate.py`。测试需要已有 Playwright 与 Chromium；通过 CHROMIUM_PATH 指定本机浏览器。重建图集可运行 `python tests/capture_references.py`（还需 Pillow 和可选的本地中文渲染字体）。正常打开 HTML 不需要这些测试依赖。',
 '',
 '最终被测 HTML 的 SHA-256：',
 '',
 '`'+report['sourceSha256']+'`',
 '',
 '浏览器：`'+report['browser']+'`',
 '',
 '完整逐项记录与具体色对比值见 `preview/validation.json`。',
 '',
 '## 逐项结果',
 '',
 '| 项 | 结果 |','|---|---|']
for c in report['checks']:lines.append('| '+c['name'].replace('|','/')+' | '+('通过'if c['passed']else'失败')+' |')
(R/'docs/VALIDATION.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')
(R/'.gitignore').write_text('__pycache__/\n*.pyc\npreview/roundtrip*\npreview/first_*\n',encoding='utf-8')
exclude={'RELEASE_MANIFEST.json','SHA256SUMS.txt'}
def shipped(p):
 rel=p.relative_to(R).as_posix()
 return p.is_file() and rel not in exclude and '__pycache__'not in rel and p.suffix not in ['.pyc','.zip'] and not p.name.startswith(('first_','roundtrip'))
paths=sorted(p for p in R.rglob('*')if shipped(p))
for p in paths:
 if p.suffix.lower()in ['.ttf','.otf','.woff','.woff2','.ttc']:raise RuntimeError('Font binary not allowed in package')
 if p.suffix=='.json':json.loads(p.read_text())
checks=[{'path':p.relative_to(R).as_posix(),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}for p in paths]
manifest={'languageId':'personal.mimo-inspired','version':'2.0.0','releaseDate':'2026-10-10','status':'completed-personal-design-language','officialXiaomiSystem':False,'branches':2,'scenes':3,'motionResources':10,'signatureResources':5,'editableSceneExamples':6,'fontFiles':0,'spIntegrated':False,'mcpInstalled':False,'runtimeExternalDependencies':0,'browserTest':summary,'htmlSha256':report['sourceSha256'],'files':checks,'manifestNote':'Manifest/checksum index exclude themselves. Only the canonical v2.0 tree is retained; no ZIP or duplicate copies are generated.'}
(R/'RELEASE_MANIFEST.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
(R/'SHA256SUMS.txt').write_text('\n'.join(x['sha256']+'  '+x['path']for x in checks)+'\n')
print('Canonical release index verified:',len(checks),'files;',R)
print(json.dumps(manifest['browserTest']))
