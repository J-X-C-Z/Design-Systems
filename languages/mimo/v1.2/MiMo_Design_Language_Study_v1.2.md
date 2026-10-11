# MiMo-inspired Design Language · 第三轮提炼 v1.2

> 2026-10-10 · 独立个人设计资源库 · 与 Superior Point、Noema、Lumina 解耦。
> 本文是对小米 MiMo 公开页面的设计研究与原创抽象，**不是小米官方设计系统规范**。
> 本轮重点：证据分级、状态驱动动效、视觉模式与使用场景解耦、候选样式的可计算校验。

## 1. 本轮关键结论

**一个设计语言家族 + 两种视觉模式 + 三种场景语法。**

- 视觉模式：`Rational Humanistic / 理性人文` 和 `Dark Tech / 暗黑科技`。Studio 官网 2026-07-23 更新记录确实出现这两个名称 [E04]；**它们并不是被证明适用于所有 MiMo 网站的统一主题 API**。
- 场景语法：`Research`、`Developer`、`Workspace`。这是由研究者根据产品功能自主提炼的三个独立场景，并非小米发布的组件包划分。
- 交互设计：**Motion explains state and relationship**，通过方向、结果反馈、任务进度表达信息变化；不是所有组件都必须有动效。
- 作品方向：个人设计资源应提供独立的语义 Token、风格身份、交互模式与参考索引。未来任何产品可以适配它，但不要在资源库核心文件中写死 SP / reveal.js。

## 2. 核实的观察与尚未核实的参数

| 场景 | 官方公开证据 | 可信推导 | 尚无实测 |
|---|---|---|---|
| Research | 官方研究主页巨型文字、重复 M I M O、01/02 研究列表 [E01] | 字体本身构成视觉；编号和细线形成阅读节奏 | 字体家族、字号像素、网格断点、真实滚动参数 |
| Developer | MiMo Code 平台按钮、安装命令、复制交互 [E02]；分组文档结构 [E03] | 功能直接构成设计，而不是只在插图中模拟终端 | 命令栏实际字重、hover duration、字体渲染细节 |
| Workspace | Studio 官方深浅风格名、音频与滚动优化 [E04]；Desktop 官方工作区图 [E05] | 用低对比容器让主要操作突出；深浅模式保持信息结构 | 动态 CSS、精确尺寸、当前所有端侧细节 |
| Research Interaction | 材料研究的交互模型 [E06] | 内容有意义时可以使用复杂动画 | 原始图形管线与性能配置 |

**界限**：容器环境当前无法获取官网 JS/CSS/实时浏览器截图。报告中不得声称实测小米官方像素、真实缓动或鼠标悬停行为。v1.2 的 Token 和动画全部是个人原创的**候选实现**。

## 3. 设计基因：五条不变量

### A. Type is architecture（字形构成布局）

标题不是填空区域，而是第一视觉节点。数字、细线、元信息和留白形成分级结构；研究首屏可以大而开放，文档则要简化标题并增加可扫描索引。[E01][E03]

### B. Real tools are design elements（真实操作就是视觉素材）

安装命令、模型选择和任务进度不应被重新设计成伪装的装饰卡片。只在确有操作语义时呈现复制、状态、入口等反馈。[E02][E05]

### C. Contextual density（密度由任务决定）

同一个主题不必让 Research、Developer、Workspace 的元素密度完全一致。阅读页通过留白建立叙事；开发者工具通过代码与层级提升效率；工作区让输入和状态优先。

### D. Human, not ornamental（人文感并非堆叠装饰）

语气、排版、质感可以温和，但技术动作必须直接、明确。不要把“理性人文”简化为暖白加圆角。

### E. Motion clarifies change（运动解释变化）

动效来自信息联系：列表导航强调方向、复制命令需要结果反馈、任务工作区传达进度。漫无目的的视差、渐显和发光会破坏这套设计的克制性。

## 4. 两种视觉模式、三种场景语法

| 组合 | 样式倾向 | 典型设计手法 | 在通用设计库中复用 |
|---|---|---|---|
| Humanistic × Research | 明亮阅读面、宽松留白 | 极大文字、编号列表、标题叙事 | 个人介绍页、研究文章、发布页 |
| Dark Tech × Research | 低亮度阅读面、明暗焦点 | 深色背景下维持标题与细线组织 | 暗色研究报告、数据故事 |
| Humanistic × Developer | 纸面技术感、明确操作区 | 命令行、分步指导、功能截图位置 | 开发者网站、API 手册 |
| Dark Tech × Developer | 深色工具容器、强状态对比 | 终端、代码、复制结果反馈 | IDE 附件、CLI 工具页 |
| Humanistic × Workspace | 弱表面、输入为中心 | 中央输入区、任务侧栏、建议操作 | AI 工作台、个人工具 |
| Dark Tech × Workspace | 深色工具背景、低饱和分层 | 模型选择、任务跟踪、可收起信息区 | 专注模式、专业控制台 |

注意：两个 Visual Mode 是一条配色/材质/对比度轴；三个 Scene 是内容与信息密度轴。切换模式不应重写整个页面布局。

## 5. 动效语言更新：从动画列表转为“行为意图”

| 行为 | 触发 | 状态含义 | 建议设计动作（非官方） | 无动画时 |
|---|---|---|---|---|
| Directional Index | 用户聚焦或悬停列表 | 可前往下一项 | 箭头短位移、短线延长 | 静态箭头和焦点环 |
| Command Feedback | 复制成功 | 操作已完成 | 轻微确认标签出现 | 显示“已复制”文字 |
| Task Progress | 任务阶段更新 | 过程发生变化 | 逐阶段标记变化、必要时强调进度 | 三段可读的状态文字 |
| Data Motion | 模型/图表数据更新 | 数据或关系发生变化 | 高亮确实变化的参数或路径 | 数值和说明可见 |

**候选**节奏范围：微反馈 120–200ms；局部交互 220–400ms；内容叙事 350–650ms（不代表官方测量）。对 `prefers-reduced-motion` 提供静态结果，而不是隐藏信息。

## 6. 样板的对比度检查（v1.2 候选数据）

对 v1.2 Lab 的画布背景和候选前景作相对亮度比值计算。具体值以实验台运行时为准；同一颜色在不同表面上使用需重新核验。

| 模式 | 主文字 / Canvas | 次级文字 / Canvas | 强调文字 / Canvas |
|---|---:|---:|---:|
| Rational Humanistic | 16.01:1 | 5.40:1 | 4.98:1 |
| Dark Tech | 16.60:1 | 8.58:1 | 6.36:1 |

这些比值在指定背景上达到 4.5:1，但**不等于整份样板所有文本组合都通过 WCAG**；组件、悬停态和不同表面必须单独测试。

## 7. AI 使用说明：给资源，不给封闭模板

AI 获得：
- 简洁的 Design Identity（what makes it recognizable）。
- Evidence Layer（哪些是官网可核实事实、哪些是候选创作假设）。
- Tokens（语义颜色、可替换字体、层级尺度）。
- Scenes（Research / Developer / Workspace 的示例及使用场景）。
- Motion Intents（目标行为与可选动效资源）。

AI **不需要**被要求：每页固定三卡片布局、相同字号、必须播放某种动画、必须按十步走。先根据内容选择信息结构，必要时才读取样例。

## 8. 资源复用和适配原则

设计语言资产不应被绑定为 PPT 专用：

`MiMo-inspired Family → Visual Modes + Scene Grammars + Motion Intents → (Web / Docs / App / SP adapter)`

优先复用语义角色和行为，而不是复制一份完整 CSS。当以后要为 SP 制作适配时：将页面文字体系和形状 Token 映射到 SP 元素、将 Motion Intents 映射到 reveal.js 或动画引擎，而不能把整套网页工作区截成幻灯片截图。

## 9. 本轮交付与验证

- 离线单文件 HTML Lab v1.2：支持六种场景组合；新增动效状态实验区、下载当前候选 Profile JSON、对比度动态验证、证据分类展示。
- style-matrix.candidate.v1.2.json：设计家族 + 2 visual modes × 3 scenes 的候选资源矩阵。
- evidence-register.json：每个官方来源、可确认内容与尚未确认内容。
- 本报告与 README：作为下一轮验证依据。

## 10. 仍待解决

1. 生产 CSS 字体、布局间距与断点的实测（需要能访问官网的图形浏览器与 DevTools）。
2. 真实悬停/滚动/转场的逐帧录屏与时序测量。
3. 手机端官网截图与候选样板的相同视口对照。
4. 官方资产授权问题：未授权前不打包 MiMo 官方图片、Logo 或字体。

## 官方参考

[E01] https://mimo.xiaomi.com/zh  
[E02] https://mimo.xiaomi.com/coder?lang=en  
[E03] https://mimo.xiaomi.com/mimocode/start  
[E04] https://mimo.mi.com/docs/zh-CN/updates/feature/studio  
[E05] https://mimo.mi.com/docs/zh-CN/tokenplan/integration/mimo-desktop  
[E06] https://mimo.xiaomi.com/mimo-v2-6-material-research/  

**附注**：即使某张官方截图是公开可读的，仍不意味允许作为可再分发的主题资产；此资源包只包含原创设计样板和指向官方页面的引用。
