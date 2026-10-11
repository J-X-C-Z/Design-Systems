# Design Systems

设计语言研究与可复用资源归档。通用设计资源与 Superior Point（SP）适配讨论分开存放。

## 分类与适配等级

按主来源分为 **人工精修、ai 搜集、三方参考**；人工精修仅 MiMo。tag 与成熟度分别记录。

- **一级：所有适配都完成**。当前 0 套。
- **二级：完成初步适配**。当前 10 套：MiMo（人工精修），以及瑞士信息设计、精密工业、编辑杂志、温暖插画、实验拼贴、生成艺术、沉浸空间、Y2K复古未来、世纪中期现代（ai 搜集）。
- **三级：只是确认方向**。Batch02 的12套独立研究；尚无本仓库可编辑样例和可执行适配包。外部三方参考也列三级/仅参考，不重复计入语言数量。

[完整分类、依据与待适配缺口](CLASSIFICATION.md) · [三方参考索引](classification/third-party-references.md) · [机器可读清单](classification/catalog.json)

[14 项精选三方参考与核验说明](research/curated-third-party-design-references-2026-10-11.md) · [精选参考数据](classification/curated-references.json)。14 项独立资源与 172 个原始 URL 索引分别统计，不相加为风格数量，也不计入 22 套本地方向。

现有样例和部分测试说明初步适配成立；真实浏览器、目标设备、适用媒介与产品集成尚有缺口，因此没有将 MiMo 或其他语言提前标成一级。

**当前效果评价：差。** 按用户评价，MiMo 与其余九套已有样例均独立标记 `qualityTag: 差`；这是当前效果评价，不改来源标签或二级适配等级。12 套研究方向和三方参考不带此标签，网页提供单独的效果评价筛选。

## 独立重审候选

- **实验拼贴候选**：[说明与研究入口](candidates/experimental-collage/README.md) · [四页可编辑 HTML](candidates/experimental-collage/index.html) · [浏览器记录与未验收项](candidates/experimental-collage/BROWSER_QA.md)。仅归档，待用户重判；原实验拼贴样例的“差”标签及二级适配状态保持，不替换原样例、不计为新语言，也不标为正式通过。
- **世纪中期现代候选**：[使用与边界](candidates/midcentury-modern/IMPLEMENTATION.md) · [四页可编辑 HTML](candidates/midcentury-modern/index.html) · [研究复核](candidates/midcentury-modern/RESEARCH-REVIEW.md) · [浏览器记录与未验收项](candidates/midcentury-modern/QA-RESULTS.md)。仅归档，待用户重判；原世纪中期现代样例的“差”标签及二级适配状态保持，不替换原样例、不计为新语言，不据有限验收升级成熟度或评为好。

- **生成艺术候选**：[使用与边界](candidates/generative-art/IMPLEMENTATION.md) · [四页可编辑 HTML](candidates/generative-art/index.html) · [研究复核](candidates/generative-art/RESEARCH-REVIEW.md) · [浏览器记录与未验收项](candidates/generative-art/QA-RESULTS.md)。仅归档，待用户重判；原生成艺术样例的“差”标签及二级适配状态保持，不替换原样例、不计为新语言，不据有限验收升级成熟度或评为好。

- **瑞士信息设计候选**：[使用与边界](candidates/swiss-information/IMPLEMENTATION.md) · [四页可编辑 HTML](candidates/swiss-information/index.html) · [研究复核](candidates/swiss-information/RESEARCH-REVIEW.md) · [浏览器记录与未验收项](candidates/swiss-information/QA-RESULTS.md)。仅归档，待用户重判；原瑞士信息设计样例的“差”标签及二级适配状态保持，不替换原样例、不计为新语言，不据有限验收升级成熟度或评为好，未计入 SP 集成。

- **精密工业候选**：[使用、研究复核与边界](candidates/precision-industrial/IMPLEMENTATION.md) · [四页可编辑 HTML](candidates/precision-industrial/index.html) · [浏览器记录与未验收项](candidates/precision-industrial/QA-RESULTS.md)。仅归档，待用户重判；原精密工业样例的“差”标签及二级适配状态保持，不替换原样例、不计为新语言，不据有限验收升级成熟度或评为好，未计入 SP 集成。

- **编辑杂志候选**：[使用与边界](candidates/editorial-magazine/IMPLEMENTATION.md) · [四页可编辑 HTML](candidates/editorial-magazine/index.html) · [研究与源图复核](candidates/editorial-magazine/RESEARCH-REVIEW.md) · [浏览器记录与未验收项](candidates/editorial-magazine/QA-RESULTS.md) · [概念图来源记录](candidates/editorial-magazine/assets/generation-provenance.json)。两张图为原创 AI 概念图，非现场照片，底层图像模型未确认。仅归档，待用户重判；原编辑杂志样例的“差”标签及二级适配状态保持，不替换原样例、不计为新语言，不据有限验收升级成熟度或评为好，未计入 SP 集成。

- **温暖插画改进候选**：[使用与风格局限](candidates/warm-illustration/IMPLEMENTATION.md) · [四页可编辑 HTML](candidates/warm-illustration/index.html) · [研究与源图复核](candidates/warm-illustration/RESEARCH-REVIEW.md) · [功能 QA 与未验收项](candidates/warm-illustration/QA-RESULTS.md) · [概念插画来源记录](candidates/warm-illustration/assets/generation-provenance.json)。所测功能 QA 通过；人物动画化、轻微明暗及人物图背景矩形边界仍是风格缺陷，未严格视觉达标。三张图为原创 AI 概念插画，模型未确认。仅归档，待用户重判；原“差”标签及二级适配状态保持，不替换原样例、不计为新语言、不升级成熟度，未计入 SP 集成。

## 风格总览网页

[静态网页目录](web/) · [网页入口 index.html](web/index.html) · [本地查看说明](web/README.md)。网页支持搜索、来源与等级筛选、语言样例预览、14 项精选三方参考和可折叠的 172 条外链索引；资料引用现有语言与研究目录。

下载仓库源码后，在仓库根目录运行 `python3 -m http.server 8000 --bind 127.0.0.1`，浏览器打开 http://127.0.0.1:8000/web/ 。不需要安装依赖或执行构建；此公共仓库未启用 GitHub Pages。

## 从这里开始

- **精密工业 v1.0**：[规范与样例入口](languages/precision-industrial/v1.0/README.md) · [ZIP](packages/precision-industrial-v1.0.zip)
- **编辑杂志 v1.0**：[规范与样例入口](languages/editorial-magazine/v1.0/README.md) · [ZIP](packages/editorial-magazine-v1.0.zip)
- **温暖插画 v1.0**：[规范与样例入口](languages/warm-illustration/v1.0/README.md) · [ZIP](packages/warm-illustration-v1.0.zip)
- **实验拼贴 v1.0**：[规范与样例](languages/experimental-collage/v1.0/README.md) · [ZIP](packages/experimental-collage-v1.0.zip)
- **生成艺术 v1.0**：[规范与样例](languages/generative-art/v1.0/README.md) · [ZIP](packages/generative-art-v1.0.zip)
- **沉浸空间 v1.0**：[规范与样例](languages/immersive-space/v1.0/README.md) · [ZIP](packages/immersive-space-v1.0.zip)
- **Y2K 复古未来 v1.0**：[规范与样例](languages/y2k-retrofuture/v1.0/README.md) · [ZIP](packages/y2k-retrofuture-v1.0.zip)
- **世纪中期现代 v1.0**：[规范与样例](languages/midcentury-modern/v1.0/README.md) · [ZIP](packages/midcentury-modern-v1.0.zip)

- **设计系统总提示词**：[中文完整原文（含 Claude Design 方法与跨类型研究规则）](prompts/design-system-master-prompt.zh-CN.md)

- **MiMo-inspired v2.0**：[使用入口](languages/mimo/v2.0/README.md) · [完整语言规范](languages/mimo/v2.0/docs/DESIGN_LANGUAGE.md) · [交互展示台](languages/mimo/v2.0/dist/MiMo_Design_Language_v2.0.html) · [六场景静态预览](languages/mimo/v2.0/preview/six-scenarios.png) · [动效资源](languages/mimo/v2.0/kit)。仅保留这一份完整规范目录，旧版和分发副本可从 Git 历史恢复。
- **瑞士信息设计**：[研究与使用入口](languages/swiss-information/v1.0/README.md) · [完整设计语言](languages/swiss-information/v1.0/DESIGN_LANGUAGE.md) · [样板](languages/swiss-information/v1.0/specimen.html) · [预览](languages/swiss-information/v1.0/design-preview.png) · [ZIP](packages/swiss-information-v1.0.zip)
- **第二批增量研究 Batch 02**：[12 套研究档案与索引](research/batch02/00_INDEX.md) · [完整合并报告](research/batch02/Design_Language_Incremental_Research_Batch02_2026-10-10.md) · [ZIP](packages/design-language-batch02.zip)；研究阶段，尚无可编辑样例。
- **设计资源调研**：[PPT 风格、模板与 Design Skills 资源库](research/slide-design-resources-2026-10.md)
- **SP 适配与讨论**：[主题与设计语言框架 v0.5](adaptations/superior-point/theme-framework-v0.5.md)
- **归档说明**：[版本、核查与权利边界](ARCHIVE_NOTES.md) · [文件校验值](SHA256SUMS.txt)

## MiMo 样例展示

先看[六场景静态预览](languages/mimo/v2.0/preview/six-scenarios.png)或[动效关键帧](languages/mimo/v2.0/preview/motion-contact-sheet.png)。交互展示台在 [dist/MiMo_Design_Language_v2.0.html](languages/mimo/v2.0/dist/MiMo_Design_Language_v2.0.html)，六个独立样例在下表：

| 场景 | 浅色 | 暗色 |
| --- | --- | --- |
| 研究阅读 Research | [research.light.html](languages/mimo/v2.0/examples/research.light.html) | [research.dark.html](languages/mimo/v2.0/examples/research.dark.html) |
| 开发工具 Developer | [developer.light.html](languages/mimo/v2.0/examples/developer.light.html) | [developer.dark.html](languages/mimo/v2.0/examples/developer.dark.html) |
| 工作区 Workspace | [workspace.light.html](languages/mimo/v2.0/examples/workspace.light.html) | [workspace.dark.html](languages/mimo/v2.0/examples/workspace.dark.html) |

HTML 在 GitHub 中显示源码。打开上述文件后使用 **Download raw file** 保存 HTML，再在本机浏览器打开；展示台和六个样例均为自包含文件。其他语言可下载对应 ZIP 后打开样例。此公共仓库未启用 GitHub Pages，风格总览的本地查看方法见上方。

## 状态说明

MiMo 为独立研究与原创候选资源，非小米官方设计系统；最新实际归档版本为 v2.0。瑞士包为 v1.0 候选研究。已有资料中的测试记录按原文保留，不代表本次独立重新验收。

- MiMo v2.0 原作者报告：72 项检查、48 组响应式场景、50 个语义色组合，使用 Chromium `set_content`；本次归档未独立重新验收，直接导航及跨设备验证仍有边界。[原报告](languages/mimo/v2.0/docs/VALIDATION.md)
- 瑞士包：已有静态、纯函数与结构检查；真实浏览器渲染及交互验收未完成。
- SP 框架为讨论整合稿，不是已实现功能说明。

仅收录实际存在的资料。Noema / Lumina 暂未找到独立完整设计规范，未据名称虚构资源包；风格索引也不代表相应语言已完成深度研究。

保留原 Library 文件。本仓库不包含 SP 或 Orialis 产品完整源码。

新增三套已提供研究规范、原创资产与可编辑离线样例；静态/脚本检查已执行，真实浏览器布局与交互验收未完成，详见各自 VALIDATION.md。

后五套 v1.0 已增量归档，含研究规范、候选参数、可编辑离线实现与各自验证记录。八套原记录合计 112 项静态、模拟 DOM 与生成器检查；生成艺术、沉浸空间、Y2K 与世纪中期现代共 9 幅 SVG 已实际渲染并查看，详见相应 SVG_REVIEW.md。本次上传仅独立核对文件与校验值；HTML 浏览器布局、真实键盘操作与设备验收仍未完成，不能将静态图像检查视为网页视觉验收。
