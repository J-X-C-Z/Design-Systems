# MiMo-inspired Design Language 2.0

**以清晰的结构承载复杂能力，以有人情味的表达保留人的主动权。**

个人设计资源库的完整独立发布；不是小米官方设计系统。由 v1.3 升级，仍是一门设计语言。两分支为理性人文与暗黑科技，Research / Developer / Workspace 是三种可共享场景。

## 开始使用

打开 **`dist/MiMo_Design_Language_v2.0.html`**：设计理念、双分支、三场景、十种可控动效、语义色彩、组件状态、局部文字编辑、项目 JSON 与完整 HTML 导出均在同一文件中。

从 **`docs/DESIGN_LANGUAGE.md`** 阅读完整规范。直接复用 **`kit/`**，或将整个资源库交给本地 AI，从 **`ai/AI_CONTEXT.md`** 开始按需检索。

**图片与可编辑实例**：`preview/research.light.png` 对应 `examples/research.light.html`，其余场景与暗色版本同理。`preview/six-scenarios.png` 汇总六个实际渲染。`preview/motion-contact-sheet.png` 展示五种标志性动效的关键帧；播放请使用 HTML。

## 本版包含

| 类别 | 文件 |
|---|---|
| 理念与视觉规范 | docs/DESIGN_LANGUAGE.md |
| 运动语言、10资源语义与 API | docs/MOTION.md、kit/motion-resources.json |
| 组件状态与真实反馈边界 | docs/COMPONENTS.md |
| 独立 CSS 与两分支 Token | kit/tokens.css、kit/mimo.css、kit/design-language.json |
| 可控运行时 | kit/motion.js、kit/skin.js |
| 六组参考和编辑素材 | examples/、preview/、evidence/visual-reference-index.json |
| 原创 SVG | assets/，含资源 manifest |
| AI 开放参考 | ai/AI_CONTEXT.md、ai/SKILL.md |
| 来源与方法 | evidence/、LICENSE_AND_PROVENANCE.md |
| 集成与 SP 边界 | docs/INTEGRATION.md、adapters/SP_ADAPTATION.md |
| 重建与测试 | src/、tests/、docs/VALIDATION.md、preview/validation.json |

## 已冻结的行为

布局与组件 optional，动效以 language 为核心，普通主题切换 skin，视觉参考 both，资源复用 shared。参考不锁死创作，AI 不必按固定页面顺序或审核链执行。MiMo 不与 Lumina / Noema 混成一个设计系统。

## 边界

本次完成的是个人设计语言与可运行资源，不是小米官网像素复刻。色值、字距、时长是原创默认值；官方精确 CSS 未取得。字体只使用系统回退，不随包附送字体文件。

展示台是实际运行的原型：工作区任务明确为本地模拟，无模型、无云同步。可编辑 JSON 是本库白名单样例格式，**不是 SP Document**；HTML 支持重载恢复样例文字、场景和模式，不包含完整图层布局编辑器。

自动化验证采用离线 Chromium 对精确 HTML 文本进行加载。受环境策略限制，未实机验证 `file://` 双击或真实其他浏览器。不要把这些边界理解成产品能力承诺；完整结果见验证报告。

## 重建

`python src/build.py` 使用标准库生成全部 HTML。`python tests/validate.py` 使用已安装的 Playwright 与 Chromium 执行回归。测试工具不在包内分发，正常使用展示页也不需要它们。

版本信息、源文件摘要和打包内容见 `RELEASE_MANIFEST.json`。无需注册账号即可保存并复用全部资源；旧作品应保留使用时的语言与资源快照。
