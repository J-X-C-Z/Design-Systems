# MiMo-inspired Design Language — 第四轮实证与复用研究 v1.3

> 日期：2026-10-10。个人设计资源库，**非小米官方设计系统**。本轮不修改 SP、Noema 或 Lumina。
>
> 状态：原创可复用资源 + 本地实验结果已落实；官网 computed CSS、原生动效录屏仍待有浏览器外网权限的现场验证。

## 1. 本轮判断：不要把视觉模式与场景混为一谈

**一个设计家族 × 两种视觉模式 × 三种场景语法**：

| 轴 | 可选项 | 作用 | 证据边界 |
|---|---|---|---|
| 视觉模式 | 理性人文 / 暗黑科技 | 表面明度、对比、视觉情绪 | 两种命名来自 MiMo Studio 2026-07-23 官方更新；跨全站使用是本研究的原创推论。 |
| 场景语法 | Research / Developer / Workspace | 排版密度、阅读路径、真实操作语义 | 从 MiMo Research、Code/Docs、Studio/Desktop 官方页面归纳；并非官方公布组件 taxonomy。 |
| 通用设计 DNA | 文字、秩序、操作、方向、反馈 | 让六种组合保持同一视觉身份 | 研究归纳；不等于官方 Design Tokens。 |

重要：只有“稳定的设计判断”值得进入个人设计语言的长期部分。色值、数值时长、具体布局都属于可替换实现。

## 2. 外部参考验证（证据登记）

| 编号 | 网址 | 可直接确认 | 不能推断 |
|---|---|---|---|
| R01 | https://mimo.xiaomi.com/zh | 重复 M I M O 字样；中英标题；论文/博客目录编号和箭头 | 精确 CSS、字体、断点、逐帧动效 |
| R02 | https://mimo.xiaomi.com/coder?lang=en | 命令、操作系统选择、文档链接及功能分区 | 精确 hover 时长、元素 px 值 |
| R03 | https://mimo.xiaomi.com/mimocode/start | 文档检索、分类结构、开发者任务 | 站点全部字体与交互动效 |
| R04 | https://mimo.mi.com/docs/zh-CN/updates/feature/studio | 2026-07-23 UI 改版含“理性人文/暗黑科技”；后续有音频动效优化 | 官方具体动画曲线及场景 Token API |
| R05 | https://mimo.mi.com/docs/zh-CN/tokenplan/integration/mimo-desktop | Desktop 文档场景及官方 UI 示例 | 动态 UI 计算样式 |

**调查限制**：直接请求官网网页源在当前容器网络中因 DNS/外网限制失败；搜索与文本检索可以确认页面结构，却不能提供 CSS 计算样式或 hover 录屏。任何所谓“官网真实 168ms 缓动”均不可由本轮证据支持。

## 3. Claude Design 式“参考 → 原则 → 样板 → 复审”映射

| 观察 | 提炼出的设计决策（原创） | 实现样板 | 如何验证 |
|---|---|---|---|
| 研究主页用巨型标题和编号构建阅读流 | **Type is architecture**；文字和元数据共同承担构图 | Research specimen | 不同语言和长标题是否仍可读 |
| Code 页面直接提供可复制安装命令 | **Tools are content**；命令条是实际操作而非虚构装饰 | Developer specimen | 点击复制是否有明确成功/失败状态 |
| Studio 的两种视觉方向 | **Semantic color over hardcoded skins** | 同场景 Light/Dark 对照 | 只换 token 不更改 DOM 或信息组织 |
| 工作区强调用户任务 | **Contextual density**；任务区成为第一视觉节点 | Workspace specimen | 手机端内容仍能访问，主要交互能执行 |
| 研究与工作区有状态和指向性交互 | **Motion describes change** | Arrow feedback / command state / task state | reduced motion 时状态文本不丢失 |

## 4. 当前原创设计参数（不是官网提取）

详见 `kit/design-language.profile.json` 与 `kit/rth-design-language.css`。重要语义角色：`canvas`、`surface`、`raised`、`ink`、`muted`、`rule`、`accent`、`action`、`focus`。

候选动效节奏：微反馈 120–220ms；状态转换 220–400ms；叙事揭示 340–650ms。**这是提案，不是官网实测时长。**

原则：降低对具体字体与色值的身份依赖；参考作品和动效可因用户目标而变化；强模型根据内容设计布局，不被固定三栏限制。

## 5. 三种场景中的共享基因

### Research
重视编辑式首屏、编号索引、有来源的数据和解释性可视化；不强迫封面加三张卡片。

### Developer
可运行命令、可复制反馈、真实工具状态和清晰的上下文导航；不把伪代码当成视觉装饰。

### Workspace
低干扰外壳、任务输入和结果状态直接可见；不让营销型巨大标题占据高频工作界面。

### 视觉模式
理性人文侧重清晰、柔和和纸面层次；暗黑科技侧重深色工作表面与克制焦点。两模式不强制改变文档的内容结构。

## 6. v1.3 的改进

- 首次加入**跨产品可复用 CSS Kit** 和结构化 `Design Profile`，而不仅是一个独立展示页。
- 同一场景左右同时展示两种视觉模式，减少“不同截图比较不公平”的问题。
- 为同一场景设置中文与长文本压力测试，验证换内容后结构与设计身份是否保持。
- 使用真实的命令复制反馈和任务状态操作验证动效意图。
- 本地 Chromium 渲染桌面、平板、手机尺寸；通过 JS 计算 Token 对比度，避免仅依赖目测。
- 原始品牌资源不在交付包中嵌入，保证个人设计库可独立复用。

## 7. 后续仍需实测的证据及操作方法

需具备能直接访问 Xiaomi 官网并打开 DevTools 的浏览器，方可继续：

1. 对 Research 首页、Code 与 Docs，记录 `getComputedStyle` 的字体栈、字号、字重、line-height、letter-spacing、max-width、padding、背景与边框色，分别测试 1440/1024/390px。
2. 对首页编号行、Code 命令复制和 Studio 侧栏展开，录制鼠标悬停/点击/滚动时序，结合 DevTools Animation 面板记录过渡时间及关键帧。
3. 将同视口官方截图与**原创样板**对照；对比例、密度、字体层级进行视觉验证。尽量提高相似的设计语法，而不是抄写商标或像素级复制。
4. 所有精确数值补上时间、URL、设备与截图证据。只有经过实测的字段可从 `candidate` 迁移到 `observed`。

## 8. 复用与版权边界

此资源库支持 Web、Docs、App，也可以由后续 SP Adapter 读取；不在核心语言层写死 reveal.js 或 SP 数据结构。官方网页源码、受保护字体、Logo 和插图不会被重新分发。视觉参考可用链接记录，但主题实施优先使用原创图形与授权素材。

## 9. 文件清单

- `kit/rth-design-language.css`：独立通用风格 Token 与组件样式。
- `kit/design-language.profile.json`：两种视觉模式、三种场景、Motion Intents 的机器可读资料。
- `MiMo_Design_Grammar_Lab_v1.3.html`：自包含离线可交互实验台。
- `preview/`：截图及本机测试证据。

**总结**：本轮将设计语言从“观察描述”推进到“可跨产品使用与检验的原创资源”，而不是将 MiMo 网站外观简单复制到 SP 中。
