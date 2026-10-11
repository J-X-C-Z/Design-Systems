---
title: PPT 设计风格、模板与 Design Skills 资源库
date: 2026-10-10
tags:
  - PPT
  - 幻灯片设计
  - revealjs
  - DesignSkills
  - SuperiorPoint
aliases:
  - Slide Design Resources
  - 幻灯片风格图鉴
---

# PPT 设计风格、模板与 Design Skills 资源库

> 调研日期：2026-10-10。定位：帮助快速寻找多种 PPT 视觉风格、实际可用的模板和适合 AI/Codex/Claude Code 的设计 Skill，同时为基于 reveal.js 的网页幻灯片编辑器建立主题库提供资料。
>
> 说明：**风格规范**不等于**可直接修改的模板**；**可免费制作 PPT**不等于**可以将模板打包进第三方产品再次发布**。链接与许可请以使用时页面及仓库最新文件为准。

## 01. 优先打开的风格图鉴与灵感库

| 名称 | 链接 | 类型 | 使用建议 |
|---|---|---|---|
| Modern PPTX Design Styles：30 种风格在线预览 | https://corazzon.github.io/pptx-design-styles/preview/modern-pptx-designs-30.html | 可视化风格图鉴 | 最适合建立统一的主题分类与配色/排版参数 |
| 30 种风格详细设计规范 | https://github.com/corazzon/pptx-design-styles/blob/main/references/styles.md | 色板、字体、布局、避坑文档 | 用作设计系统的 `theme.json` 依据 |
| Deck.gallery | https://www.deck.gallery/ | 真实演示稿作品集 | 对比完整商业演示、年度报告、品牌规范 |
| Deck.gallery Slides | https://deck.gallery/slides/ | 按单页类别筛选 | 收集封面、过渡、数据、对比、团队页面 |
| Slides.Wiki | https://slides.wiki/ | 大型企业演示设计拆解 | 提取颜色、字体、图表和 Markdown 风格说明 |
| Slides.com Explore | https://slides.com/explore | 基于 Web 的演示案例 | 研究 reveal.js 生态中的真实交互幻灯片 |
| Pitch Gallery | https://pitch.com/templates/ | 专业模板库 | 学习成套现代商业设计语言 |
| Slidev Theme Gallery | https://sli.dev/resources/theme-gallery | 开源 Markdown/Web 主题库 | 参考开发者主题架构（不等于直接兼容 reveal.js） |
| reveal.js 官方主题 | https://revealjs.com/themes/ | reveal.js 官方 CSS 主题 | 适合低成本的第一批内置主题 |
| Figma Slides | https://www.figma.com/slides/ | 设计工具、社区资源入口 | 查找 UI/设计师制作的演示模板 |

## 02. 30 种风格索引

*这些名称取自 corazzon/pptx-design-styles；“实现要点”是供网页幻灯片实现时使用的归纳，而非该仓库的逐字引用。*

| # | 风格（中文 / English） | 视觉特征、建议场景 | Web 实现要点 |
|---:|---|---|---|
| 01 | 玻璃拟态 / Glassmorphism | 半透明玻璃、模糊、柔光；AI/SaaS 发布 | `backdrop-filter`、微描边、分层背景；打印应降级 |
| 02 | 新粗野主义 / Neo-Brutalism | 高饱和色、黑粗边、硬阴影；初创路演 | 清晰边框、零模糊阴影、大标题 |
| 03 | 便当网格 / Bento Grid | 不等尺寸的模块化信息块；产品总览 | CSS Grid + 跨行列网格 + 信息密度上限 |
| 04 | 暗黑学术 / Dark Academia | 深棕、金色、衬线、书籍感；教育、人文 | 暗色暖底、书籍式标题、细装饰线 |
| 05 | 网格渐变 / Gradient Mesh | 多色柔和混合、艺术背景；品牌与创新 | 多层 radial-gradient 或静态背景降级 |
| 06 | 黏土拟态 / Claymorphism | 圆润 3D、柔软阴影；教育与友好型 App | 一致的软阴影体系、圆角与 3D 素材 |
| 07 | 瑞士国际主义 / Swiss International | 严格栅格、黑白、单强调色；商科、学术 | 12 列网格、大小字号对比、严格对齐 |
| 08 | 极光霓虹 / Aurora Neon Glow | 暗色背景、柔和极光；AI、科技 | 光晕图层与亮色文字，控制发光面积 |
| 09 | Y2K / Retro Y2K | 金属、像素图标、复古数字感；创意营销 | 网格、Chrome 质感图片、复古字体 |
| 10 | 北欧极简 / Nordic Minimalism | 温和米白、留白、自然质感；生活方式 | 大量负空间、低饱和配色、精细文字节奏 |
| 11 | 强排版 / Typographic Bold | 超大字、字体成为主视觉；主题演讲 | 夸张标题比例、少字数、对比明确 |
| 12 | 双色分割 / Duotone Color Split | 对立色平面、强对比；正反观点 | 左右/上下对称与非对称分割，避免拥挤 |
| 13 | 单色极简 / Monochrome Minimal | 黑白灰统一；高端作品集 | 通过字号、留白、线条区分层级 |
| 14 | 赛博朋克轮廓 / Cyberpunk Outline | HUD、网格、荧光描边；游戏/安全 | 等宽小字、发光边框、细网格、受控动效 |
| 15 | 杂志编辑 / Editorial Magazine | 非对称、衬线标题、摄影；叙事报告 | 杂志多栏、裁剪与出血、精细基线网格 |
| 16 | 柔和 UI / Pastel Soft UI | 低对比渐变、柔软卡片；健康教育 | 粉彩 tokens、浅背景、确保文字对比 |
| 17 | 迈阿密霓虹 / Dark Neon Miami | 80s、粉橙渐变、透视网格；活动 | 暗色、透视网格纹理、复古霓虹线条 |
| 18 | 手作有机 / Hand-crafted Organic | 牛皮纸、线稿、自然色；环保生活 | 纸张材质、手绘 SVG 装饰，注意文字清晰 |
| 19 | 等距 3D / Isometric 3D Flat | 等距立体构件；系统架构和硬件 | SVG 等距场景、可编辑连接关系 |
| 20 | 蒸汽波 / Vaporwave | 紫粉色、网格、怀旧互联网文化 | 紫色调、几何远景、文字保持对比 |
| 21 | 装饰艺术 / Art Deco Luxe | 黑金、扇形、几何对称；奢华活动 | 细致几何边框与少量金色点缀 |
| 22 | 粗野报纸 / Brutalist Newspaper | 报纸栏、横线、主标题；媒体研究 | 报头/副标题/多栏布局、细密分割线 |
| 23 | 彩色玻璃 / Stained Glass Mosaic | 玻璃拼片、彩色几何；艺术文化 | 多边形 SVG、色块边界与主体留白 |
| 24 | 流体形变 / Liquid Blob Morphing | 液态形体、流动感；科学与未来产品 | SVG 路径动画/渐变，静态降级 |
| 25 | 孟菲斯 / Memphis Pop Pattern | 80s 活泼几何与撞色；时尚生活 | 简单几何图案、统一边框与装饰密度 |
| 26 | 深森林 / Dark Forest Nature | 墨绿、植物/自然摄影；环保、奢华 | 沉稳绿调、图像遮罩、低调装饰 |
| 27 | 建筑蓝图 / Architectural Blueprint | 蓝底白线、精确尺寸；工程科技 | 细网格/标注/尺寸线，SVG 连接 |
| 28 | 极繁拼贴 / Maximalist Collage | 大胆图片叠层与纹理；艺术广告 | 图像蒙版/纸张叠层/错位排版 |
| 29 | 科幻全息数据 / SciFi Holographic Data | 信息 HUD、线框全息；高科技 | 数据框、空间层次、动效节制 |
| 30 | Risograph 印刷 / Risograph Print | 油墨错位、网点纹理；创意出版 | 背景噪点/网点透明层、双色版印刷感 |

**选择指南**：

- 大学课程汇报 / 科研介绍：Swiss、Nordic Minimalism、Typographic Bold、Blueprint。
- 产品功能介绍 / AI 工具发布：Bento、Glassmorphism、Editorial、Aurora。
- 商业案例、公司研究：Swiss、Editorial、Monochrome、Duotone。
- 设计作品集、创意路演：Neo-Brutalism、Y2K、Maximalist Collage、Risograph。
- 历史人文、人物故事：Dark Academia、Editorial、Hand-crafted Organic。

## 03. 直接找 PPTX / Google Slides 模板

| 平台 | 网址 | 特点及注意 |
|---|---|---|
| Slidesgo | https://slidesgo.com/ | 经典大库，含 PowerPoint、Google Slides、Canva，免费/付费混合；免费模板常要求保留致谢页 |
| Slidesgo 极简 | https://slidesgo.com/minimalist | 极简与商务规范 |
| Slidesgo 新粗野主义 | https://slidesgo.com/brutalist | 高对比创意风 |
| Slidesgo 渐变 | https://slidesgo.com/gradient | 科技与品牌渐变风 |
| Slidesgo Y2K | https://slidesgo.com/y2k | 千禧年复古风 |
| Slidesgo 复古 | https://slidesgo.com/vintage | 历史/文艺风 |
| Slidesgo 科技 | https://slidesgo.com/technology | 数字科技与创新 |
| SlidesCarnival | https://www.slidescarnival.com/ | 免费商业、教学、复古、深色等模板，查具体许可 |
| SlidesMania | https://slidesmania.com/ | 教学/杂志拼贴/手账/互动；**不得作为第三方模板库转售或重新分发** |
| SlidesMania 动态/趣味 | https://slidesmania.com/tag/cool-templates/ | 部分含原生交互与动效 |
| PresentationGO | https://www.presentationgo.com/presentation/category/templates/ | 大量免费 PowerPoint/Google Slides 主题、信息图 |
| Pitch | https://pitch.com/templates/ | 特别适合现代企业/商业演示，部分模板在 Pitch 平台内编辑 |
| Gamma | https://gamma.app/templates | AI 流程与内容自适配布局的参考 |
| Beautiful.ai | https://www.beautiful.ai/template-category/presentation-templates-categories-new | 商业演示、Smart Slides 的交互/自动重排参考 |
| Canva Pitch Deck | https://www.canva.com/presentations/templates/pitch-deck/ | 不同风格商业路演模板 |
| Figma Slides | https://www.figma.com/slides/ | 社区可复用设计师演示模板 |

## 04. AI Skills：实际可安装的资源

以下将“制作引擎/呈现工作流”和“风格指导/视觉审校”分开，因为它们的职责不同。并非所有 Skill 都能输出 .pptx，也并非所有 HTML 幻灯片都使用 reveal.js。

### 4.1 幻灯片生成与模板 Skill

| 名称 | 项目链接 | 输出/特点 | 与 reveal.js 的关系 | 许可/备注 |
|---|---|---|---|---|
| Frontend Slides (Zara Zhang) | https://github.com/zarazhangrui/frontend-slides | 先提供 3 组视觉预览；12 预设 + 34 套设计系统可选；输出独立 HTML；支持旧 PPT 内容转换 | **不是原生 reveal.js**；可借鉴风格与生成流程 | MIT；注意依赖模板素材独立授权 |
| revealjs-skill (Ryan Brown) | https://github.com/ryanbbrown/revealjs-skill | 内容结构、主题、图表、演讲备注、Playwright 溢出检查、PDF 导出、浏览器文字修订 | **直接使用 reveal.js** | MIT |
| Guizang PPT Skill（归藏） | https://github.com/op7418/guizang-ppt-skill | 电子杂志 / Swiss 两套设计系统，布局骨架、图片、演讲者模式 | **自带独立 HTML 播放结构**，不是 reveal.js 专用 | **AGPL-3.0**；产品中集成前必须评估义务 |
| PPTX Modern Design Styles | https://github.com/corazzon/pptx-design-styles | 30 组审美约束：色板、字体、布局与元素 | 引擎无关，适合提炼为 CSS tokens | MIT |
| Create RevealJS Presentations | https://github.com/TriasJ/claude-custom-skills/blob/master/create-revealjs-presentations/SKILL.md | 主题如 neon-glow、liquid-motion、glass-morphism、cyber-grid；有 D3、Three.js、SVG 等资源 | **直接面向 reveal.js** | 依赖与具体仓库许可自行核实 |
| Reveal Presentation Template | https://github.com/luisquintanilla/reveal-presentation-template | 可交换主题、组件、版式目录，带 AI Agent 工作规程 | **原生 reveal.js**，适合参考工程结构 | 检查仓库资产许可 |
| SlideSpeak Slide Design Skill | https://github.com/SlideSpeak/slide-design-skill | 根据简报生成 1920×1080 HTML、真实图表，非固定风格菜单 | **不要求 reveal.js**；需集成改造 | 可选 fal.ai 图像服务 |
| Presentation Design Skill | https://github.com/blisse-code/presentation-design-skill | 偏杂志的非对称排版，9 类页面结构，附可移植的 slides.md 设计规范 | 可让设计准则指导 reveal.js | MIT；较新、实践案例少 |
| Anthropic PPTX Skill | https://github.com/anthropics/skills/blob/main/skills/pptx/SKILL.md | PPTX/POTX 的读取、编辑、制作、渲染与检查 | PowerPoint 分支工作流，与 reveal.js 不同 | **source-available，非开源许可** |
| Create PowerPoint Presentations | https://github.com/TriasJ/claude-custom-skills/blob/master/create-powerpoint-presentations/SKILL.md | PptxGenJS，8 套基础模板、图表、图片 | 适合 .pptx 输出，而非 Web 演示 | 使用前核查技术依赖 |
| Slide Deck (Marp) | https://github.com/mordor-forge/slide-deck | Markdown 源码 → Marp HTML / PDF / PPTX，有多种主题 | **不是 reveal.js**，可研究 MD 主题体系 | 某些 CSS/PPTX 导出效果降级 |

### 4.2 设计方法与审美提升 Skill（自身不是 PPT 引擎）

| 名称 | 项目链接 | 帮助点 |
|---|---|---|
| Anthropic Frontend Design | https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md | 强调明确艺术方向、专业排版、独特视觉语言，适合 HTML 幻灯片精修 |
| Impeccable (pbakaus) | https://github.com/pbakaus/impeccable | 审查、精修、版式、字体、动画、响应式，适合在既有主题生成后做有限轮次优化 |
| Slide Deck Builder（叙事） | https://github.com/SkillMedev/skills/blob/main/skills/slide-deck-builder/SKILL.md | 先做结构与故事论证，避免「只换皮不设计」 |

### 4.3 现成的网页幻灯片主题

| 名称 | 链接 | 说明 |
|---|---|---|
| reveal.js 官方 Themes | https://revealjs.com/themes/ | black, white, league, beige, night, serif, simple, solarized, moon, dracula, sky, blood；用 CSS 引入 |
| Slides.com Explore | https://slides.com/explore | 别人做出的基于 Web 的真实幻灯片，可研究动效/排版；不等于获得代码分发许可 |
| Slidev Themes | https://sli.dev/resources/theme-gallery | 官方 Default、Seriph、Apple Basic；社区 Vercel、Dracula、Academic、Nord 等，**框架不兼容 reveal.js**，借鉴视觉概念即可 |
| RevealJS skill 模板集 | https://github.com/TriasJ/claude-custom-skills/blob/master/create-revealjs-presentations/templates/README.md | 含 Neon Glow、Paper Craft、Glass Morphism、Quantum Dark 等模板规范 |

## 05. 推荐给 Superior Point / 网页幻灯片编辑器的技术路线

**目标：分离模板的三个概念，而不是将每一种 PPT 模板写成不可修改的 HTML。**

1. **Theme / 风格**：颜色、背景、字体、字号、圆角、边框、阴影、纹理。30 风格图鉴首先做成参数化视觉系统。
2. **Layout / 版式**：封面、章节过渡、单观点、图文、全图、双列对比、Bento、统计数字、时间轴、流程、数据图表、结尾；每一种布局可套任意兼容风格。
3. **Motion / 动效**：切页、Fragment、局部 SVG、匹配元素 Auto-Animate、遮罩/擦除转场；用户可全局禁用动效。

建议 UI 上把「视觉风格」与「套用模板」分成两个入口，前者改变整套幻灯片的视觉 tokens，后者插入一组带结构的页面。AI 执行过程则分成 **内容策划 → 3 组视觉预览 → 风格确认 → 版式分配 → reveal.js 渲染 → 页面截屏检查 → 调整并导出**。

建议内置首批视觉体系：

- Swiss Grid / 瑞士网格：低成本、对齐强、适合正式展示
- Editorial Paper / 杂志纸张：适合人物、公司、历史叙事
- Bento Product / 产品卡片：适合产品功能和数据介绍
- Aurora Tech / 极光科技：适合 AI 产品与技术展望
- Neo-Brutalist / 粗野创意：适合青年/创新活动
- Noema-inspired / 克制型编辑风：作为独立、可命名的自有视觉方向，需要自己明确色板/字体/材质规范，不直接假定其为通行风格标准

### 推荐的主题数据示意

```json
{
  "id": "swiss-grid",
  "name": "Swiss Grid",
  "tokens": {
    "background": "#FFFFFF",
    "foreground": "#111111",
    "accent": "#E8000D",
    "fontHeading": "Arial, sans-serif",
    "fontBody": "Arial, sans-serif",
    "gridColumns": 12,
    "radius": 0,
    "shadow": "none"
  },
  "layouts": ["cover", "statement", "split", "image-text", "kpi", "comparison", "closing"],
  "motion": {
    "slideTransition": "fade",
    "allowAutoAnimate": true,
    "reducedMotionFallback": "none"
  }
}
```

这段是**建议的数据结构**，不是某个开源库现成的配置标准。使用时可将 CSS variables 映射到 reveal.js 主题层，把布局模板映射到语义化编辑器组件。

## 06. 授权与技术风险（开发产品前必看）

1. **SlidesMania**：可用于学校或工作演示，但官方禁止转售、再分发或放进第三方模板数据库。来源：https://slidesmania.com/questions-powerpoint-google-slides/can-i-use-these-templates/
2. **Slidesgo**：具体免费模板可能要求保留末尾致谢页；模板预览页上的 “Free” 不意味着能作为自己产品的模板包发行。例：https://slidesgo.com/theme/brutalist-agency
3. **Guizang**：AGPL-3.0。可阅读学习，但复制修改后集成进网络服务时需谨慎评估 AGPL 条件。来源：https://github.com/op7418/guizang-ppt-skill
4. **Frontend Slides**：核心项目 MIT，但外部素材、引入的模板包等可能有不同许可，需要独立检查。来源：https://github.com/zarazhangrui/frontend-slides/blob/main/LICENSE
5. **Anthropic 官方 PPTX Skill**：官方仓库明确指出文档类技能是 source-available 而非开源；不能把代码公开可见误解为可任意产品集成。来源：https://github.com/anthropics/skills
6. **Slidev**：它与 reveal.js 是两个不同演示系统；官方 themes 仓库提示代码 MIT、图片资产 CC BY-NC-SA 4.0，需分别处理。来源：https://github.com/slidevjs/themes
7. **性能与可读性**：Glassmorphism、Liquid、Mesh 与 3D 看起来华丽，但在低端移动设备、大屏投影、PDF 导出时需要静态回退。不要把所有高消耗动效设为默认。

## 07. 一组可直接复用的 AI 生成提示词

> 以 reveal.js 为唯一演示引擎，创建 16:9 的 HTML 幻灯片。先阅读 [pptx-design-styles](https://github.com/corazzon/pptx-design-styles) 的设计规范，并借鉴 [Frontend Slides](https://github.com/zarazhangrui/frontend-slides) 的视觉探索流程与 [revealjs-skill](https://github.com/ryanbbrown/revealjs-skill) 的生成和验证方法。先给出 3 组明显不同的设计方向，每组各输出封面、内容页和章节过渡页预览。由我选定风格后再生成完整幻灯片。必须使用内容驱动的版式，限制重复卡片，控制字数，统一字体、网格、配色、纹理与留白。核心演示使用 reveal.js Auto-Animate 和 Fragments，复杂动画才引入 GSAP。完成后对每页截图检查溢出、对比度、可读性、时间轴动效、转场闪烁、移动端与 PDF 打印回退，并提供可编辑的 HTML/CSS/JS 源文件。

---

**重点组合：**

- **最少改造的 reveal.js 路线**：revealjs-skill + 官方 themes + PPTX Modern Design Styles + Impeccable。
- **视觉最强、愿意做工程适配**：Frontend Slides + Guizang + Presentation Design Skill，风格与版式迁移到 reveal.js，不直接把它们的播放引擎混搭。
- **需要 Office 真正可编辑的 PPTX**：Anthropic PPTX Skill / PptxGenJS 相关技能，另做 HTML 转换和渲染验证；不要假定 HTML 导出 PPTX 后动效和所有效果仍可编辑。
