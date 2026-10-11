# 成熟第三方设计参考 · 精选 14 项

核验日期：2026-10-11。优先学习原作者已经总结的系统、规则与版式，不重新发明一套只换颜色的“风格”。

## 收录边界

- 本次为 14 项独立资源：7 项已有资源的精选补充，7 项新增独立资源。与原 172 URL 索引按资源身份和官网/仓库别名去重；许可页、文档页不另算新增资源。
- 全部标记“三方参考”、三级“仅参考”。第三方自身成熟，不代表本仓库完成适配；22 种本地语言的统计保持不变。
- 只收原创中文摘要及外链，无第三方代码、字体、图片、模板镜像；未安装、执行、试导出，也没有接受任何商业协议。
- “可复用资产”是值得进一步评估的对象，不是已下载或已获授权。无明确许可标未确认，公开可见不等于可商用。许可说明不是法律意见，实际使用以当时上游文件为准。
- 对现有风格的关系为策展判断，不表示源作者推荐、背书或已完成集成。

## 怎么用这份精选

1. 先定问题：产品组件与任务用 Carbon / GOV.UK / USWDS；创作工具看 Spectrum；平台集成看 Atlassian / Polaris。
2. 再定信息表达：用 FT 选图，用 Vega-Lite 或 Plot 描述图；排版查 Inter 的光学尺寸与实际字形覆盖。
3. 再定演示结构：reveal.js 看叙事和转场，Slidev 看页面角色，Dashi 看受控主题、版式和生成后编辑流程；网页微动效看 Motion。
4. 真正适配时只选择一个明确目标媒介，先核许可，再实现、浏览器/导出验收；不能仅因收藏了资源就提升适配等级。

## 需要优先注意的许可

- Dashi：AGPL-3.0 与专有导出引擎并存，只记录参考，不复制或提取引擎。作者页面声明的主题/版式规模不是本次独立验证。
- Atlassian：当前 ADS 条款限制于 Atlassian 集成/Add-Ons，不能当通用素材库。
- FT：Visual Vocabulary 目录保留全部权利，不镜像其海报。
- Motion：核心 MIT 不覆盖所有 Motion+ 付费内容。
- Polaris：当前 web components 入口已迁移；本次未确认统一通用开源许可，不沿用旧 React 包许可作保证。

## 01. IBM Carbon Design System

[IBM Carbon Design System](https://www.carbondesignsystem.com/) · 官方设计系统 · 已有资源精选补充 · 三方参考 / 三级

- 成熟依据：IBM 企业产品系统，具备组件、模式、数据可视化和持续维护的基础规范。
- 值得采用的规则：8px mini unit 建立节奏；流式格网通过二分组织，固定尺寸通过倍数组织。文字对齐内边距的内边界，不随意漂移。
- 可评估资产：2x Grid、尺寸比例、组件与模式；代码资产需遵循具体包许可。
- 现有风格关系：瑞士信息设计、精密工业：补足可执行网格与高密度产品结构；不等于已采用 Carbon。
- 许可边界：核心 carbon 仓库 Apache-2.0；保留许可与相关 NOTICE，品牌、商标与独立字体须另查。
- 核验来源：[官方入口](https://www.carbondesignsystem.com/)；[核验来源 1](https://github.com/carbon-design-system/carbon)；[核验来源 2](https://www.carbondesignsystem.com/building-blocks/foundations/2x-grid/overview)；[核验来源 3](https://github.com/carbon-design-system/carbon/blob/main/LICENSE)

- 原索引关联：ref-3ce6a147e0

## 02. GOV.UK Design System

[GOV.UK Design System](https://design-system.service.gov.uk/) · 官方设计系统 · 已有资源精选补充 · 三方参考 / 三级

- 成熟依据：由英国 Government Digital Service 维护，汇集政府服务研究，并为组件标记生命周期状态。
- 值得采用的规则：从一页一问开始；仅索取必要信息，提供回退入口；可选项明确标记，避免必填星号。
- 可评估资产：任务型问题页、错误恢复、核对答案等已研究模式，HTML/Nunjucks 组件示例。
- 现有风格关系：GOV.UK 任务型公共服务语言：原有参考的精炼补充；可为所有风格提供任务与可访问性检查。
- 许可边界：网站内容 OGL-3.0（注明例外除外）；GDS Transport 字体用途受限，不能因文档开放就复制政府字体和品牌。
- 核验来源：[官方入口](https://design-system.service.gov.uk/)；[核验来源 1](https://design-system.service.gov.uk/patterns/question-pages/)；[核验来源 2](https://design-system.service.gov.uk/styles/typeface/)

- 原索引关联：ref-621ede5f06, ref-345c3f7edf, ref-d31bed0900

## 03. U.S. Web Design System (USWDS)

[U.S. Web Design System (USWDS)](https://designsystem.digital.gov/) · 官方设计系统 · 新增独立资源 · 三方参考 / 三级

- 成熟依据：美国政府设计系统，有组件、页面模板、设计 token、可访问性指南及成熟度模型。
- 值得采用的规则：排版联动考虑字体、字号和行高；不同字体光学大小需归一化，不能只按相同 px 替换。
- 可评估资产：排版/行长/间距 token、文档页与表单模板、组件指导。
- 现有风格关系：GOV.UK 任务型公共服务语言、瑞士信息设计：补充可迁移的可读性与多站点一致性方法。
- 许可边界：并非整个包都属公共领域：GSA 改动采用公共领域/CC0，字体含 OFL-1.1，图标含 Apache-2.0 等；逐文件核对。
- 核验来源：[官方入口](https://designsystem.digital.gov/)；[核验来源 1](https://designsystem.digital.gov/design-tokens/typesetting/overview/)；[核验来源 2](https://raw.githubusercontent.com/uswds/uswds/develop/LICENSE.md)

## 04. Adobe Spectrum

[Adobe Spectrum](https://spectrum.adobe.com/) · 官方设计系统 · 新增独立资源 · 三方参考 / 三级

- 成熟依据：Adobe 产品共用系统；基础规则、token、模式与组件文档连接真实仓库数据及交互 playground。
- 值得采用的规则：在基础 token 与模式上构建自定义组件；不同实现平台共享系统语义，不把同一组件截图当完整规范。
- 可评估资产：基础规范、token、组件状态与可交互示例；React Spectrum 是可进一步评估的实现。
- 现有风格关系：精密工业、沉浸空间：补充复杂创作工具的组件状态组织。此对应为策展判断，非 Adobe 背书。
- 许可边界：React Spectrum 仓库 Apache-2.0；该许可不能自动覆盖全部 Adobe 网站视觉、商标、图标与其他独立资产，未单独核实部分标未确认。
- 核验来源：[官方入口](https://spectrum.adobe.com/)；[核验来源 1](https://github.com/adobe/react-spectrum/blob/main/LICENSE)

## 05. Atlassian Design System

[Atlassian Design System](https://atlassian.design/) · 官方设计系统 · 已有资源精选补充 · 三方参考 / 三级

- 成熟依据：Atlassian 多产品的统一系统，已有颜色、排版、网格、语义 token、AI 模式与可访问性分类。
- 值得采用的规则：按语义区分 text、border、background 及 warning/success/danger 状态；用统一 token 维持跨产品一致性。
- 可评估资产：可研究语义 token 命名、协作状态、AI 模式的组织方法；实际 ADS 资产仅在许可范围内使用。
- 现有风格关系：精密工业、MiMo：可借鉴状态语义与协作任务层次，不能将 Atlassian 品牌作为自有风格。
- 许可边界：当前 ADS 专有条款将授权限定于与 Atlassian 产品互操作/集成的 Add-Ons，并列出修改、衍生和再分发限制；不得视作通用可商用素材。
- 核验来源：[官方入口](https://atlassian.design/)；[核验来源 1](https://atlassian.design/license/)

- 原索引关联：ref-70803a415e

## 06. Shopify Polaris

[Shopify Polaris](https://shopify.dev/docs/api/polaris) · 官方设计系统 · 已有资源精选补充 · 三方参考 / 三级

- 成熟依据：Shopify 当前统一 UI 框架采用 web components，覆盖 App Home、Admin、Checkout、Customer accounts、POS 等真实产品表面。
- 值得采用的规则：先确认目标表面，再选该表面提供的组件/API 子集；跨表面统一体验不意味着所有组件处处可用。
- 可评估资产：各表面的组件/API 参考、布局和图标指导；优先看当前文档，避免旧 Polaris React 教程混用。
- 现有风格关系：精密工业、GOV.UK 任务型公共服务语言：补充交易/管理型任务结构；不等于通用网站视觉模板。
- 许可边界：当前入口链接服务/API条款，未确认当前全部 web components 与视觉资产有统一通用开源许可；标未确认，不能套用旧包许可。
- 核验来源：[官方入口](https://shopify.dev/docs/api/polaris)；[核验来源 1](https://polaris.shopify.com/)

- 原索引关联：ref-de61415069

## 07. Financial Times Visual Vocabulary

[Financial Times Visual Vocabulary](https://github.com/Financial-Times/chart-doctor/blob/main/visual-vocabulary/README.md) · 图表与信息表达 · 已有资源精选补充 · 三方参考 / 三级

- 成熟依据：FT Visual Journalism Team 制作，作为编辑部图表素养培训核心；提供多语言海报与图形选择说明。
- 值得采用的规则：先判断比较、排序、分布、时间、部分整体等表达任务，再选图；普通柱形数量比较从零开始，地图优先匹配地理问题。
- 可评估资产：图表选择词汇和中英文海报入口；可作为选图检查表的来源，不复制原海报资产。
- 现有风格关系：编辑杂志、Isotype、瑞士信息设计：补足图表语义与叙事依据，避免只按视觉风格选图。
- 许可边界：该目录明确 © Financial Times，all rights reserved；再发布内容需联系其 syndication，不能把公开 GitHub 当开放授权。
- 核验来源：[官方入口](https://github.com/Financial-Times/chart-doctor/blob/main/visual-vocabulary/README.md)；[核验来源 1](https://github.com/Financial-Times/chart-doctor/tree/main/visual-vocabulary)

- 原索引关联：ref-32b6f5c51b

## 08. Vega-Lite

[Vega-Lite](https://vega.github.io/vega-lite/) · 图表与信息表达 · 新增独立资源 · 三方参考 / 三级

- 成熟依据：由 University of Washington Interactive Data Lab 起源的可视化语法，拥有完整规范、示例、在线编辑与生态入口。
- 值得采用的规则：用声明式 JSON 分离数据、标记、编码与视图组合；层叠和多视图结构比任意装饰更适合复用验证。
- 可评估资产：图表 specification、示例与组合语法；本轮不下载或运行。
- 现有风格关系：编辑杂志、瑞士信息设计、Isotype：实现数据图形的工具层，不新增一种视觉语言。
- 许可边界：Vega-Lite 核心 BSD-3-Clause；保留版权与免责声明，不借作者名背书；示例数据与外部素材另行核实。
- 核验来源：[官方入口](https://vega.github.io/vega-lite/)；[核验来源 1](https://vega.github.io/vega-lite/docs/)；[核验来源 2](https://github.com/vega/vega-lite/blob/main/LICENSE)

## 09. Observable Plot

[Observable Plot](https://observablehq.github.io/plot/) · 图表与信息表达 · 新增独立资源 · 三方参考 / 三级

- 成熟依据：Observable 团队维护，有 marks/scales/transforms/facets 与可访问性文档，以及浏览器和框架集成说明。
- 值得采用的规则：通过 marks、比例尺、变换与分面组合表达数据；参考线和注释也是图形构件，不把整张图当扁平图片。
- 可评估资产：点/线/区间/地理等 mark 文档、探索型图表示例、框架集成范例。
- 现有风格关系：编辑杂志、瑞士信息设计：适合数据探索和图表原型；它是绘图库而非可算入目录的自有风格。
- 许可边界：核心仓库 ISC：复制需保留版权及许可声明；示例所载数据、照片及其他来源版权另查。
- 核验来源：[官方入口](https://observablehq.github.io/plot/)；[核验来源 1](https://observablehq.github.io/plot/getting-started)；[核验来源 2](https://github.com/observablehq/plot/blob/main/LICENSE)

## 10. Inter

[Inter](https://rsms.me/inter/) · 排版资产 · 新增独立资源 · 三方参考 / 三级

- 成熟依据：由作者维护的完整字体家族及公开源仓库，提供光学尺寸、OpenType 功能、字形与多语种覆盖说明。
- 值得采用的规则：小字号 text optical size 强调辨识，大字号 display 优化曲线节奏；按语种核对字形覆盖，不能当中文字体。
- 可评估资产：可变/静态字体与 OpenType 功能说明；拉丁界面排版和数值展示候选。
- 现有风格关系：瑞士信息设计、精密工业、MiMo：可用作中性西文候选，中文仍须配套字体并独立验证。
- 许可边界：字体采用 SIL OFL-1.1：不可单独售卖字体，分发保留许可；修改版遵守保留名称等条款。字体许可不延伸成品牌背书。
- 核验来源：[官方入口](https://rsms.me/inter/)；[核验来源 1](https://github.com/rsms/inter/blob/master/LICENSE.txt)

## 11. reveal.js

[reveal.js](https://revealjs.com/) · 动效与演示 · 已有资源精选补充 · 三方参考 / 三级

- 成熟依据：长期维护的 HTML 演示框架；官方演示覆盖主题、讲者视图、嵌套页、Fragments、Auto-Animate 与 PDF 导出。
- 值得采用的规则：横向叙事主线与纵向细节分层；Fragments 分步呈现，Auto-Animate 用跨页匹配元素表达连续变化。
- 可评估资产：官方主题、布局机制、转场与讲者笔记；是展示基础设施，非完整企业 PPT 内容模板库。
- 现有风格关系：现有全部 HTML 演示适配的候选底座；与具体视觉语言解耦，不能计作自有风格。
- 许可边界：核心框架 MIT，需保留版权与许可；第三方插件、照片及 slides.com 商业服务不自动包含在同一许可中。
- 核验来源：[官方入口](https://revealjs.com/)；[核验来源 1](https://revealjs.com/themes/)；[核验来源 2](https://github.com/hakimel/reveal.js/blob/master/LICENSE)

- 原索引关联：ref-385523f699

## 12. Slidev

[Slidev](https://sli.dev/) · 动效与演示 · 已有资源精选补充 · 三方参考 / 三级

- 成熟依据：维护中的开发者演示工具，有内置版式、主题/插件画廊、动画、组件和导出文档。
- 值得采用的规则：用页面角色选择 cover/section/fact/quote/two-cols 等版式；主题可覆盖布局，内容与外观分离管理。
- 可评估资产：内置版式目录、主题画廊、Markdown 组织方式与组件机制；不把主题数量换算为本仓库适配数量。
- 现有风格关系：瑞士信息设计、命令—窗格字符界面等技术演示候选；补齐版式角色分类。
- 许可边界：Slidev 核心/官方文档 MIT；社区主题、插件、字体与图片各自核实，不对整个画廊作统一商用保证。
- 核验来源：[官方入口](https://sli.dev/)；[核验来源 1](https://sli.dev/builtin/layouts)；[核验来源 2](https://sli.dev/resources/theme-gallery)

- 原索引关联：ref-f3ea6d72ec, ref-99d8a89a0b

## 13. Motion

[Motion](https://motion.dev/) · 动效与演示 · 新增独立资源 · 三方参考 / 三级

- 成熟依据：前身 Framer Motion，官网记录 React/JavaScript/Vue 实现、持续发行与实际产品使用，文档涵盖布局、手势、滚动和弹簧。
- 值得采用的规则：以状态变化驱动 layout/exit 与 spring；用 variants/stagger/timeline 组织顺序，先选择动作目的再调效果。
- 可评估资产：核心动画 API、基础文档与示例入口；项目落地还需单独做减少动态及性能验收。
- 现有风格关系：温暖插画、沉浸空间、Material 3 Expressive：动效实现参考，不替代各风格自己的动效语法。
- 许可边界：核心 Motion MIT；Motion+ 的 premium examples、Motion UI、AI Kit 是另行产品，不能用核心 MIT 推定它们可复制再分发。
- 核验来源：[官方入口](https://motion.dev/)；[核验来源 1](https://motion.dev/docs)

## 14. Dashi PPT Skill · 大师 PPT

[Dashi PPT Skill · 大师 PPT](https://github.com/chuspeeism/dashi-ppt-skill) · 动效与演示 · 新增独立资源 · 三方参考 / 三级

- 成熟依据：作者仓库展示 12 套主题、1020 版式、20 类页面角色及浏览器内编辑流程；数量为作者声明，本轮未安装或独立运行验证。
- 值得采用的规则：先按封面、指标、趋势、对比等角色组织内容，再以主题约束版式；每页由版式与文案字段组成，生成后保留编辑控制。
- 可评估资产：主题/页面角色/控制台能力目录可作研究参考；仅记录链接与分析，不镜像模板、执行安装或提取导出引擎。
- 现有风格关系：为全部演示适配提供版式角色与编辑流程对照；12 套外部主题不计入本仓库22种语言，也不代表导出已验收。
- 许可边界：根项目 AGPL-3.0；作者特别声明 html-deck-to-pptx 为专有组件，仅能作为 skill 组成部分使用，禁止单独提取、复制、再分发。历史 MIT 不推及当前版本。
- 核验来源：[官方入口](https://github.com/chuspeeism/dashi-ppt-skill)；[核验来源 1](https://github.com/chuspeeism/dashi-ppt-skill#开源协议-license)
