# Dashi 12主题 → SP可编辑结构样例

final/theme01–theme12 共12份canonical JSON，每份3页，仅对应每主题实际v4 bespoke composition。每个文字、面板和图表基础几何是独立对象，没有整页截图。数据、单位与虚构演示性质保留在源文稿和报告中。

这是样例数据与转换源码交付。没有SP原创源代码、官方renderer、通用HTML、预览图、Dashi minified主题runtime、专有PPTX组件或node_modules。未安装SP主题、未更改SP产品或生产部署。

sp-final-samples.zip提供全部样例及报告；sp-conversion-source.zip提供独立JSON转换源码。没有experimental主题混入最终集合。

## 验证边界

全部12主题的源Dashi浏览器DOM校准及overflow祖先裁切检查已完成；该状态只代表源几何核验，不代表SP原生视觉验收。固定SP main/PR3的离线Core/adapter校验已执行，逐对象源映射与损失见各主题报告。复杂背景、玻璃、模糊、部分阴影和字体/字重/非等比SVG文字仍有明确降级。图表以可编辑几何重建，并不冒充原生数据驱动chart。

原生SP编辑器视觉、可选择/输入、保存重开及PPTX/PowerPoint保真未验。theme01曾在https://sp.jxcz.top/app尝试独立项目导入，但审批/工具超时令完成状态和新项目ID未知，已记BLOCKED/未验；后续只读检查没有新增导入结论；私有浏览器与项目标识已省略。不能将其当成功或失败，不能盲目重试。PR3仅为固定候选版本，未声称已部署。

## 转换源码与重建记录

`sp-conversion-source.zip` 保留本次原创转换、DOM测量和兼容修复代码及冻结目标与DOM数据。按本独立分支范围，所有 `vendor-work` 文件已剔除；适配器仍引用这些缺失的构建依赖，因此这个公开精简包不能独立执行转换或重建上游HTML。没有把被排除文件改名重新分发。

`SP-SOURCE-ONLY-REPRODUCTION.json` 保留供应方剔除前完整隔离输入的 12 主稿＋1 兼容稿逐字节重建记录，不能据此宣称当前精简 ZIP 可重建。固定 SP 验证是历史证据，本包不含 SP 代码或验证依赖。

[本次公开范围](../ARCHIVE-SCOPE.md) · [来源与许可](SP-SOURCE-NOTICE.md)。原生 SP 导入、编辑、保存重开与 PPTX 保真仍未验收，本次仅核对结构、链接和文件哈希。
