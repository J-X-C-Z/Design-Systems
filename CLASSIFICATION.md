# Design Systems 分类与适配等级

核对日期：2026-10-11。依据提交 `31f9cee657eed19198480b6b89cfc5cb6f449ba3` 的实际文件及验证记录。本分类不移动资源路径，不改用户提示词。

## 分类规则

- **人工精修**：按用户指定，仅 MiMo。
- **ai 搜集**：AI 整理、研究和实现的其他语言档案。标签描述整理来源，不保证适配等级。
- **三方参考**：外部系统、作品、方法、工具和来源入口。它们以引用关系关联语言，不重复建立同名语言。

每个条目只有一个主来源 tag。等级与 tag 独立：**一级＝所有适配都完成；二级＝完成初步适配；三级＝只是确认方向。**

“所有适配”以该语言明确声明的目标范围为界；不适用媒介要说明原因，不把不存在的XR/安全控制能力算作已实现。一级必须有完整实现及目标环境验收证据；候选参数、适配说明、静态检查、模拟 DOM 均不能代替真实验收。三方参考均为三级，表示本仓库仅收集参考，非评价原作者系统的成熟度。

## 当前效果评价

用户于 2026-10-11 将原十项“差”统一迁移为初始一星：`initialRating: 1`，并以 `historicalQualityTag: 差` 保留历史。网页可继续改星及写评语，仅存于当前浏览器；一次性迁移后不复位后续星级。评价独立于来源和适配等级；人工精修仍只有 MiMo，12 套研究方向与三方参考不自动评分。

## 数量

- 设计语言 **22 项**：人工精修 1，ai 搜集 21。
- 语言等级：一级 **0**，二级 **10**，三级 **12**。
- 三方参考 **172 个去重 URL**：全部三级，仅参考。URL 数不是品牌数、语言数或适配数量。
- Batch02 另外 **24 个候选/分支/技术记录**保持原 B/C/D/E 类别，不计入22项；其中E类尚待确认，不能冒充三级已确认独立语言。

## 二级：完成初步适配

| 语言 | tag | 已有内容及证据 | 距离一级的缺口 |
|---|---|---|---|
| [MiMo](languages/mimo/v2.0/README.md) | 人工精修 | 规范、资源、[样例](languages/mimo/v2.0/dist/MiMo_Design_Language_v2.0.html)；[验证](languages/mimo/v2.0/docs/VALIDATION.md)：Chromium set_content作者记录，未独立全环境验收 | SP仅有资源映射与行为约定，未接入产品；Chromium set_content记录不等同直接文件导航及多浏览器实测；真实设备、辅助技术与目标导出验收未齐 |
| [瑞士信息设计](languages/swiss-information/v1.0/README.md) | ai 搜集 | 规范、资源、[样例](languages/swiss-information/v1.0/specimen.html)；[验证](languages/swiss-information/v1.0/VALIDATION.md)：静态/纯函数检查；浏览器验收未完成 | 真实浏览器布局、键盘、减少动态与打印验收未完成；跨设备字体与中文长文验证待补 |
| [精密工业](languages/precision-industrial/v1.0/README.md) | ai 搜集 | 规范、资源、[样例](languages/precision-industrial/v1.0/specimen.html)；[验证](languages/precision-industrial/v1.0/VALIDATION.md)：静态与Node模拟检查；浏览器验收未完成 | 网页实际布局、键盘和辅助技术未验收；PPT/SP与印刷仍是适配说明；真实HMI不在本包实现范围 |
| [编辑杂志](languages/editorial-magazine/v1.0/README.md) | ai 搜集 | 规范、资源、[样例](languages/editorial-magazine/v1.0/specimen.html)；[验证](languages/editorial-magazine/v1.0/VALIDATION.md)：静态与Node模拟检查；浏览器验收未完成 | 浏览器长文、缩放与焦点待验收；PPT/SP未集成；印厂PDF、分页和打样未交付 |
| [温暖插画](languages/warm-illustration/v1.0/README.md) | ai 搜集 | 规范、资源、[样例](languages/warm-illustration/v1.0/specimen.html)；[验证](languages/warm-illustration/v1.0/VALIDATION.md)：静态与Node模拟检查；浏览器验收未完成 | 网页实际交互、对比与辅助技术待验收；演示/印刷仍需落地验证；受众理解与CMYK打样未完成 |
| [实验拼贴](languages/experimental-collage/v1.0/README.md) | ai 搜集 | 规范、资源、[样例](languages/experimental-collage/v1.0/specimen.html)；[验证](languages/experimental-collage/v1.0/VALIDATION.md)：静态与Node模拟检查；浏览器验收未完成 | 浏览器交互、减少动态与窄屏待验收；PPT/SP与印刷均无最终交付验收 |
| [生成艺术](languages/generative-art/v1.0/README.md) | ai 搜集 | 规范、资源、[样例](languages/generative-art/v1.0/specimen.html)；[验证](languages/generative-art/v1.0/VALIDATION.md)：静态与Node模拟检查；浏览器验收未完成 | 生成器和SVG已提供，但浏览器控件与导出流程未验收；打印线宽与外部编辑器适配待验；不包含绘图仪实现 |
| [沉浸空间](languages/immersive-space/v1.0/README.md) | ai 搜集 | 规范、资源、[样例](languages/immersive-space/v1.0/specimen.html)；[验证](languages/immersive-space/v1.0/VALIDATION.md)：静态与Node模拟检查；浏览器验收未完成 | 网页2.5D原型尚缺浏览器、键盘与设备验收；展厅和头显仅概念及适配说明，不含XR/现场实现 |
| [Y2K 复古未来](languages/y2k-retrofuture/v1.0/README.md) | ai 搜集 | 规范、资源、[样例](languages/y2k-retrofuture/v1.0/specimen.html)；[验证](languages/y2k-retrofuture/v1.0/VALIDATION.md)：静态与Node模拟检查；浏览器验收未完成 | 网页扫光、焦点与实际背景对比待验收；PPT/SP与印刷效果尚无最终适配验收 |
| [世纪中期现代](languages/midcentury-modern/v1.0/README.md) | ai 搜集 | 规范、资源、[样例](languages/midcentury-modern/v1.0/specimen.html)；[验证](languages/midcentury-modern/v1.0/VALIDATION.md)：静态与Node模拟检查；浏览器验收未完成 | 网页组合交互与跨设备文字待验收；包装/织物/印刷仅适配建议，未生产打样 |

## 三级：已确认方向，尚未初步适配

以下12项均为 **ai 搜集**。研究档案已有规则与来源，但没有本仓库可编辑样例、可执行适配包和运行验收。

- [Material 3 Expressive](research/batch02/01_Material_3_Expressive.md)
- [GOV.UK 任务型公共服务语言](research/batch02/02_GOVUK_Task_Language.md)
- [命令—窗格字符界面](research/batch02/03_Command_Pane_TUI.md)
- [Classic Macintosh 桌面对象语言](research/batch02/04_Classic_Macintosh.md)
- [低技术·可见基础设施](research/batch02/05_Low_Tech_Visible_Infrastructure.md)
- [Isotype 图形统计语言](research/batch02/06_Isotype.md)
- [交通拓扑导视](research/batch02/07_Transit_Topology.md)
- [Art Nouveau 植物线构](research/batch02/08_Art_Nouveau_Organic_Line.md)
- [Art Deco 装饰几何与仪式层级](research/batch02/09_Art_Deco_Ceremonial_Geometry.md)
- [中国手卷式游观叙事](research/batch02/10_Chinese_Handscroll_Narrative.md)
- [几何铺陈与交织装饰（伊斯兰几何传统选例）](research/batch02/11_Geometric_Tessellation_Interlace.md)
- [分格漫画叙事](research/batch02/12_Panel_Comics_Narrative.md)

共同下一步：选取适用媒介，制作原创可编辑样例和必要参数/资源；验证新内容、尺寸、行为、减少动态与导出；再按结果升级二级。原研究记录的重复性与来源限制继续保留。

## 三方参考与辅助材料

- [三方参考完整清单](classification/third-party-references.md)：每项外链、引用它的语言与证据文件。来源引用不改变语言本身的tag。
- [14 项精选三方参考](research/curated-third-party-design-references-2026-10-11.md)及[策展数据](classification/curated-references.json)：7 项已有参考增强、7 项新增独立资源。14 个资源与 172 个 URL 是不同统计口径，不相加为语言或风格总数，也不改变本地方向的数量或等级。
- [候选、分支与表现技术](classification/other-candidates.md)：保留24条原始处置，不强行升级成新语言。
- [机器可读分类清单](classification/catalog.json)：tag、level、例子、证据、缺口与reference_ids。
- 提示词、SP架构讨论、合并报告和校验/打包文件为辅助材料；不额外计成语言。分发ZIP继承所属目录的分类和等级。

三方资源集新增 [Dashi PPT 12 主题](research/third-party/dashi-ppt/README.md) 与 [Watermelon 1 平台＋18 子资源](research/third-party/watermelon/RESEARCH.md)，全部三级且不计入本地语言。详见 [整合边界](research/third-party/INCREMENT_NOTES.md)。

## 后续升级

每次升级需记录新增适配范围、实际交付路径、测试环境和结果；若只能证明某一项通过，不得把整套直接标一级。人工精修、文档长度、组件数量或引用官方资料都不构成自动升级依据。
