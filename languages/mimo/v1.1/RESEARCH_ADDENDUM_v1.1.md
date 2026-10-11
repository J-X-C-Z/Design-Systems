# MiMo-inspired Design Language — 第二轮研究与定型建议 v1.1

> 2026-10-10 · 个人设计资源库 · **原创研究 / 非小米官方设计系统 / 非 SP 主题**  
> 本文为 v1.0 研究的增补与修正，旧版《MiMo Design Language Study v1.0》保留完整逐站点观察。  
> **本轮交付**：一套共同设计基因、两个可切换的视觉模式、三个互相独立的应用场景、六组原创网页样板、动效示例、语义 Token 候选，以及自动化演示测试。

## 1. 最重要的修订：把两条轴分开

v1.0 提出了四种页面风格：Research Editorial、Developer Humanist、Rational Humanistic Workspace、Dark Tech Workspace。这对观察网站差异有用，却将两件不同的事情放在同一个分类层级：**视觉模式（surface / mood）** 与 **内容场景（information architecture / task）**。

本轮提出更清楚的二轴矩阵：

| 视觉模式 \ 场景 | Research / Editorial | Developer / Documentation | AI Workspace |
|---|---|---|---|
| **Rational Humanistic / 理性人文** | 温和纸面、巨幅字、编号阅读路径 | 柔和容器、清晰安装命令、终端 | 明亮、低干扰、输入为中心 |
| **Dark Tech / 暗黑科技** | 深色研究图形、明晰大标题、低饱和线 | 深色终端、对比明确的代码、状态反馈 | 沉浸式任务界面、轻量功能面板 |

**证据边界**：2026-07-23 MiMo Studio 官方更新日志明确使用了「理性人文」「暗黑科技」作为其 UI 改版中的两种视觉风格。将这对命名扩展为个人设计系统的全局切换轴，是**本研究的设计抽象**，而不是声称小米所有产品共享完全一致的 CSS Token。研究、开发者、工作区这三条场景轴来自公开页面信息架构的归纳，也**不是官方指定的主题分类**。

为什么采用二轴方案：一方面能保留同一个家族的文化与视觉身份；另一方面避免把 Developer 的命令行 UI、Research 的大标题排版误认为只能出现在一种配色模式下，也能在将来适配其他应用时继续复用。

## 2. MiMo-inspired Design DNA（候选定型）

用以下几条**可观察的设计关系**定义身份，而不是把某一套页面样式锁死：

- **Type as architecture / 文字即空间结构**：重要标题决定第一视觉层级；小型编号、时间、标签构成第二阅读系统。不同场景可以选择大字或紧凑文字，不强制统一字号。
- **Clarity before ornament / 先解决理解问题**：线条、留白、编号、对比用于帮助用户扫描和选择。装饰不可妨碍工作流。
- **Tool is content / 工具就是内容**：命令、代码、任务输入、科学交互等实用对象可以成为视觉主体，而不是只作为页面附件。
- **Human without sentimentality / 有人文感而不泛情绪化**：文字直接、语气温和、界面不喧哗；不依赖大量圆角或可爱插画来表达人文。
- **Variable density / 密度由任务决定**：研究页面需要叙事，开发者文档需要定位，Workspace 需要专注操作；统一的是层级清晰，而不是版心、列数永远相同。
- **Motion is explanation / 动效是一种说明**：强调方向、状态、因果和进度；不是将所有元素顺序淡入的通用表演。

### 2.1 不应误写成绝对规定

不是所有页面都必须显示超级大标题；不是每处都需要编号 01/02；不是所有代码页都要用暖橙色；不是暗色页面就必须有蓝紫发光；也**不应**直接复制 Xiaomi 品牌标识或宣传图片。强模型应该理解这些规律后，根据内容重新设计页面。

## 3. 两个视觉分支

### 3.1 Rational Humanistic

- 情绪：理性、平和、可信、留白充足。
- 基础材料：暖白与中性灰、清楚的线性层级、明快操作反馈。
- 页面构图：可出现强标题、文章版心、浮动命令栏或克制输入容器；不限定某个固定结构。
- 动效气质：轻、短、以功能为主，侧重箭头指向、分隔线和输入状态。
- 色值说明：`#F7F6F2` / `#191B1A` 等只属于**个人研究候选**。色彩用于原型验证，不是生产站点的实测值。

### 3.2 Dark Tech

- 情绪：安静、深度、精确、沉浸。
- 基础材料：中性黑蓝灰，局部明亮功能焦点，清晰的边框与文本对比。
- 页面构图：沿用场景结构，换用适合深色的表面层级，不因切换视觉模式而重排内容。
- 动效气质：同样注重功能和指向；可以强调状态与空间层级，但不默认添加全屏炫光。
- 色值说明：`#101417` / `#F0F3F4` 等也是原创候选，非官方数值。

**对比度检查**：候选主文字与画布对比度约为浅色 16.01:1、深色 16.60:1；浅色次文字约 5.40:1、深色次文字约 8.58:1。浅色暖色装饰 Accent（`#C6784F`）与背景对比度仅约 **3.13:1**，不建议直接用作小字；另配 `accentText: #985B3F`（约 **4.98:1**）供小字和文本交互使用。上述是基于候选色值计算的静态比值，不代表实测官方可访问性。

## 4. 三个可复用的场景语汇

| 场景 | 阅读/操作方式 | 值得保留的结构 | 不应写死的东西 |
|---|---|---|---|
| Research | 阅读、理解研究结论 | 叙事性标题、章节编号、论文索引、可操作科学图 | 巨幅标题尺寸、每页固定列数 |
| Developer | 安装、查阅文档、执行命令 | 清楚的复制按钮、终端示例、技术文档导航、配置状态 | 必须放一张终端截图的硬规定 |
| Workspace | 编写提示、查看任务、管理项目 | 低干扰导航、输入优先、进行中/已完成的反馈、可收合的详情面板 | 固定侧栏宽度、固定三栏布局 |

在个人设计资源库中，它们应叫 **contexts / patterns**，不是三个互相排斥的主题。某个特殊需要跨界组合时，比如在研究页面中引入一段开发者命令区，直接引用即可，不必切换整个主题。

## 5. Motion Language：候选资源而不是固定动画处方

已证实的官方行为：MiMo Studio 官方日志提到音频播放可视化、会话目录滚动；MiMo Code 有安装和命令操作；材料研究页面有可操作的科学模型。**没有取得其生产动画的精确时长、缓动和事件脚本**。

据此提出可复用的候选动效语义：

| 资源名称 | 向用户解释什么 | 典型场景 |
|---|---|---|
| `directional-hint` | 可以往哪里走 | 编号索引与按钮箭头 |
| `line-reveal` | 当前章节或元素所属的区域 | 分割、研究图与导航 |
| `copy-confirmation` | 操作已完成 | 安装命令和代码片段 |
| `focus-shift` | 操作焦点已经变化 | 输入框、弹层、侧栏 |
| `status-change` | 任务正在推进或已结束 | Workspace 与 Agent |
| `data-change` | 数据状态更新 | 图表、科学模型 |

适配时允许同一资源在两种视觉模式中呈现不同颜色和材质，但不应改变其**解释信息的功能语义**。提供 `prefers-reduced-motion` 和显式减弱动效控制。

## 6. 在 AI 创作中的使用方式

AI 初始应只读：家族 Design DNA、当前视觉模式简介、目标场景简介。需要高度接近特定案例时再读截图、可编辑样板或详细资源索引。它既可以使用预设组件，也可以创造从未出现过的布局、元素和运动组合。

典型轻量上下文：

> Create with the MiMo-inspired rational-technical-humanist design language. Preserve a clear information hierarchy, purposeful line/index systems, task-first interfaces and gentle human warmth. Use the selected visual mode for surfaces and semantics, and the selected context for task density. All examples are inspiration, not mandatory templates. Create new layouts when they communicate the content better.

这段指导不是官方 MiMo 的 Skill，也**不要求每个应用都安装独立 AI Skill**。未来为 SP、网页或开发者文档增加适配器时，调用同一个个人资源库即可。

## 7. 独立设计库的内容边界

**设计家族**负责定义理念、语义和参考。**视觉模式**负责换肤。**场景**负责内容组织的行为和默认密度。**资源**（如命令栏、动画反馈）是可选且跨分支复用的材料。**应用适配器**（例如 SP）负责将这些语义映射到目标应用的真实元素与运行时。

本轮只提供跨产品资源，不将其写入 SP 文档模型，不把此研究与 Noema 或 Lumina 混合，也不引入大量复杂主题包继承。

建议后续的资产路径：

```text
Personal Design Library
└── MiMo-inspired/
    ├── RESEARCH_ADDENDUM_v1.1.md
    ├── style-matrix.json
    ├── MiMo_Design_Language_Lab_v1.1.html
    └── preview/
        ├── six_scenarios_contact_sheet.png
        ├── light_research.png
        ├── dark_research.png
        ├── light_developer.png
        ├── dark_developer.png
        ├── light_workspace.png
        └── dark_workspace.png
```

## 8. 以 Claude Design 方法做验证

Claude Design 的官方设计系统指南强调用来自代码、幻灯片、品牌资料和视觉参考的真实素材提炼设计语言，然后在不同类型的作品中验证；仅有孤立色板并不能充分描述一种风格。此次扩展采用 **Extract → Separate axes → Generate six original examples → Check behavior → Preserve sources**。

已执行的原型验证（Chromium，独立本地 HTML 内容注入的测试环境）：

- 三个场景与两种视觉模式共 **6 组组合**，可正常切换；每个场景 Skin 切换时主画布的几何外框未改变。
- 在 1440px 宽桌面视口及 390px 宽移动视口下逐一渲染，不产生横向溢出。
- Workspace 的建议操作能够填充输入框并给出本地反馈；减少动效控制可切换；没有控制台 JavaScript 页面异常。
- 生成了所有六组独立样板截图和六格对比图，供视觉人工复核。

这些是**自主制作样板的功能性验证**，并非官网真实动画录屏或全部浏览器兼容认证。该环境对 `file://` 导航存在管理限制，因此用浏览器加载完整 HTML 内容验证 JS 与布局；网页本身不包含外部依赖，仍建议日后在本机使用双击 HTML 做最终离线验证。

### 8.1 人工评审问题（仍需确认）

1. 去掉任何品牌 Logo 后，六个场景是否仍看起来有共同气质？
2. 深色 Research 是否仍然具有研究式编排，而不是被误认为开发者终端？
3. 视觉语义是否足够鲜明、又没有混入 Noema 或 Lumina 的固定视觉规则？
4. 不同场景是否具有同等可靠的阅读与交互体验？
5. 选择两个视觉模式作为 MiMo 家族的首批分支，是否比发布四套混合分类的主题更易维护？

## 9. 尚缺的官方实测信息

- 直接在浏览器开发者工具中提取 MiMo 官网计算样式：准确字体、字号、色值、容器与断点。
- 对真实官网进行动效录屏：hover、滚动、模态、切换、特殊科学互动的触发与节奏。
- 当前桌面与移动端横向对照（官网的同一页面）。
- 资源许可：不得将 Xiaomi 商标、官方插画、网站源代码、字体打包入个人公共资源库，除非拥有相应许可。

**因此本轮能够确定的是独立设计框架和原创验证样板，不能声称完成小米网页逐像素复刻。**

## 10. 主要来源

- Xiaomi MiMo Research — https://mimo.xiaomi.com/zh
- Xiaomi MiMo Code — https://mimo.xiaomi.com/coder?lang=en
- MiMo Code Docs — https://mimo.xiaomi.com/mimocode/start
- MiMo 材料研究页 — https://mimo.xiaomi.com/mimo-v2-6-material-research/
- MiMo Studio 官方 UI 更新 — https://mimo.mi.com/docs/zh-CN/updates/feature/studio
- Claude Design 官方设计系统指南 — https://support.claude.com/en/articles/14604397-set-up-your-design-system-in-claude-design
