# Personal Design Archive · MiMo-inspired v1.1

这是根据公开 Xiaomi MiMo 网站视觉特征整理的**非官方、原创个人设计语言研究资产**。独立于 Superior Point，也不包含其框架依赖。

## 本轮变化

- 从 v1.0 的四种混合场景描述，整理成**两个视觉模式 × 三类应用场景**的正交设计语言框架。
- 提供 `style-matrix.json`：可被个人网页、应用、演示等下游消费的语义资料。所有 token 是研究候选值。
- 提供 `MiMo_Design_Language_Lab_v1.1.html`：一个不依赖网络的原创单文件网页，支持 2 × 3 场景切换、局部动作反馈、动效预览与 Token 数据复制。
- 提供 `preview/six_scenarios_contact_sheet.png` 和六组独立页面截图，方便人工审阅。
- 提供 `RESEARCH_ADDENDUM_v1.1.md`：本轮研究结论、证据边界与后续待定项目。v1.0 全文作为历史资料保留。

## 使用

用浏览器打开 HTML 样板，分别选择 Rational Humanistic / Dark Tech，以及 Research / Developer / Workspace。切换视觉模式时页面结构不主动变化。

`style-matrix.json` 中 `identity` 为设计身份，`presentationModes` 是换肤轴，`contexts` 是场景轴，`motionLanguage` 提供可选动效语义。消费者不必实现其中全部 UI 组件；根据需求选择资源即可。

## 来源与授权

提炼参考来自 Xiaomi 公开网页，但**不是小米官方发布的设计系统**。不以任何官方商标、Logo、字体文件或源码作为本包的可分发资产。Claude Design 仅作为研究方法参考。引用见研究文档。

## 不包含

- 未进行 SP 主题适配或修改 SP 编辑器。
- 未取得 MiMo 官网生产 CSS 的准确测量、全页面动效录屏或商用授权。
- 不宣称已实现从所有浏览器直接以 `file://` 运行的全量兼容测试（当前运行环境禁止此导航）。
