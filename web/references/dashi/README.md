# Dashi PPT 三方风格参考包

核验日期：2026-10-11；作者：chuspeeism；来源：https://github.com/chuspeeism/dashi-ppt-skill

固定版本：21dc7e5fc8c3a0d7f6a94948153dd1ee954f4e64

## 结论

逐一解析12份metadata.js，核得12套视觉主题、1020个版式页面，与README总数一致。每套有独立目录和运行时。上游成熟资料的存在不等于本库适配完成。

全部主题作为已有curated-dashi-ppt的子条目，标为「三方参考」「三级：仅确认方向」。保留原22个本地语言计数，不将仓库另算第13个主题。

## 目录

- theme01 轻拟态风（84页）：柔和拟态层次，而非纯扁平信息图。
- theme02 炫光紫绿风（74页）：紫绿互补与聚光式科技叙事。
- theme03 深浅代码风（77页）：无圆角与偏移硬影，技术语境比通用霓虹更强。
- theme04 玻璃糖果风（74页）：多色玻璃质感与明亮糖果重音。
- theme05 色谱图表风（94页）：纸感、直角、细线和色谱索引共同形成信息秩序。
- theme06 深色图谱风（83页）：暗底分析面板与酸绿色指标。
- theme07 冷白调研风（71页）：冷白底上的研究机构式层级。
- theme08 黑金实验风（84页）：金属暖金、衬线与仪式感。
- theme09 深蓝杂志风（111页）：杂志叙事与深蓝编辑氛围。
- theme10 金色指数风（95页）：官方名为金色指数，当前配置实际采用蓝色与铜色双强调。
- theme11 高能增长风（87页）：橙红主强调与增长叙事。
- theme12 声波霓虹风（86页）：音乐媒介母题与青粉霓虹。

## 核验与限制

读取完整Git文件树、options.md、12份metadata.js、bespoke/theme-profiles.mjs、README、Release assets API及两份LICENSE。名称和场景为上游事实；差异描述及已有库映射为本次原创归纳。bespoke配置只代表一个渲染分支，不能推断所有模板均使用同一token。

特别注意theme10官方名为金色指数风，但当前配置使用蓝铜双强调，不能仅凭名称归为纯黑金。

12个官方预览链接已由README与Release assets名单交叉核验；图片抓取遇到缓存重定向错误，本轮未独立检查图片像素或视觉质量。未安装/执行上游代码，未验证编辑或PPTX导出。

## 许可与接入

主体[AGPL-3.0](https://github.com/chuspeeism/dashi-ppt-skill/blob/21dc7e5fc8c3a0d7f6a94948153dd1ee954f4e64/LICENSE)；[html-deck-to-pptx专有许可](https://github.com/chuspeeism/dashi-ppt-skill/blob/21dc7e5fc8c3a0d7f6a94948153dd1ee954f4e64/skills/dashi-ppt/project/packages/html-deck-to-pptx/LICENSE)仅允许作为原skill组件使用，未经作者书面许可不能独立提取、复制、再分发或用于其他软件。历史v0.2.7及以前MIT许可不适用于当前版本。

本包仅原创摘要与链接，不含上游模板、代码、字体、图片或导出引擎。真正复制或集成代码前应逐项核对使用方式及许可义务。

网站使用manifest.json的styles数组；可展示主题名称、编号、来源标签、等级、描述、上游登记页数及关联本地方向。url打开固定版源码目录，preview_url仅作官方预览外链，不镜像、不运行。不改变原有语言评分与适配状态。

逐项详情见styles/目录12份文件。

