# Dashi v4 → SP 可编辑样例：实际验证记录

更新：2026-10-11T17:01:06.444Z。当前为离线样例转换；已冻结主题的源Dashi文字与网格使用真实浏览器DOM校准。源模板整页视觉验收另见Dashi预览任务记录；SP原生编辑器视觉验收仍未完成。SP原创代码未指定开源许可证，SP源码包、通用HTML及相关预览已暂停再分发；详见SP-LICENSE-REVIEW.md。

## 范围

- 每主题仅转换当前 goal.json 的三个真实 v4 bespoke composition。Dashi v1–v3 模板不在这些SP样例中。
- 目标为 format=superior-point、schemaVersion=1、1280×720。固定源画布1920×1080，统一缩放2/3。
- 使用原始12×8网格、实际padX/padY/gap，按BespokeSlide.jsx计算，未套同构主题模板。
- 正文及KPI为独立文本，面板/线条/条图为独立形状。没有整页图片，assets=[]。
- 复杂背景/玻璃/模糊/阴影不伪造保真。逐对象源映射和loss manifest见各主题sp-mapping-report.json。
- 图表保留原始数据语义，按源结构拆成可编辑几何图表，明确不是SP原生数据驱动图表。异质KPI不共轴。
- 未修改SP产品、未写SP API、未安装主题、未部署SP候选、未进行PPTX导出。

## 固定版本

- Dashi 21dc7e5fc8c3a0d7f6a94948153dd1ee954f4e64
- SP main 5314ac9bd71b98e93852ec990146d77c98b7f361
- SP PR3 candidate 24ea406fa52df32e3a618ee804af0c0cf1fa7abf

隔离工作区验证使用GitHub固定版本的未改动纯JS Core/adapter，按每文件Git blob SHA核验。源码交付包只含对应SP-VALIDATION-REFERENCES.json引用，不含SP代码；在源码包重建时官方验证标记not_run。未将旧v0.0.1当作现状。通用SVG/HTML出自固定main io/html.js，属于SP自身通用预览，不等于原生编辑器。

## 已完成样例

| 主题 | 源内容匹配 | 页/对象 | 文本/形状/路径 | main | PR3 | DOM文字几何 | 原生视觉 |
|---|---|---:|---:|---|---|---|---|
| theme01 | 当前goal匹配 | 3/43 | 35/8/0 | 通过 | 通过 | 已量测32文字 | 阻塞，导入状态未知 |
| theme02 | 当前goal匹配 | 3/43 | 35/8/0 | 通过 | 通过 | 已量测32文字 | 未运行 |
| theme03 | 当前goal匹配 | 3/49 | 35/14/0 | 通过 | 通过 | 已量测32文字 | 未运行 |
| theme04 | 当前goal匹配 | 3/58 | 41/17/0 | 通过 | 通过 | 已量测38文字 | 未运行 |
| theme05 | 当前goal匹配 | 3/91 | 48/43/0 | 通过 | 通过 | 已量测45文字 | 未运行 |
| theme06 | 当前goal匹配 | 3/58 | 41/17/0 | 通过 | 通过 | 已量测38文字 | 未运行 |
| theme07 | 当前goal匹配 | 3/70 | 50/20/0 | 通过 | 通过 | 已量测47文字 | 未运行 |
| theme08 | 当前goal匹配 | 3/58 | 41/17/0 | 通过 | 通过 | 已量测38文字 | 未运行 |
| theme09 | 当前goal匹配 | 3/70 | 50/20/0 | 通过 | 通过 | 已量测47文字 | 未运行 |
| theme10 | 当前goal匹配 | 3/72 | 50/22/0 | 通过 | 通过 | 已量测47文字 | 未运行 |
| theme11 | 当前goal匹配 | 3/70 | 50/20/0 | 通过 | 通过 | 已量测47文字 | 未运行 |
| theme12 | 当前goal匹配 | 3/70 | 50/20/0 | 通过 | 通过 | 已量测47文字 | 未运行 |

## 验证流程（每份实际执行状态以报告为准）

1. 两个固定版本分别validateDocument，要求valid=true、errors=[]、warnings=[]。
2. Core import(JSON.stringify(document))。
3. canonical→native→canonical递归比较每个源定义字段，允许adapter增加原生默认字段。包含ID、文本、几何、样式、notes、assets。
4. 序列化保存再import，重复全部源字段比较。
5. 在Core内真实修改一个文本对象的文字与坐标，再undo，检查slides原样恢复。仅纯JS测试，无浏览器编辑行为结论。
6. main官方通用HTML export→import，检查完整JSON深相等。
7. 关键事实与chart facts逐条检查，不新增单位、百分比、统计结论。
8. 每一页的外层网格按(x=padX+(column-1)*(cellWidth+gap), y=padY+(row-1)*(cellHeight+gap))计算，w/h含跨格gap；theme05分别保留padX=72、padY=60。

## 仍需验收与已知差异

- 字体：原生SP把fontFamily作为一个带引号的家族名，所以不可直接塞入完整CSS栈。样例保留源首选家族，完整栈存sidecar；设备可用性及回退未验证，不下载/嵌入字体。
- 字重：原生文本使用bold 750或normal 400，通用SVG为700/400。源的450–900等精细字重记录sidecar但不能宣称原样显示。
- 没有DOM量测的主题：内层文字和flex分布使用源码字号/行高及明确标记的CJK/Latin字宽估算；不能称像素级转换。获得授权浏览器量测后，运行measure-bespoke.js并保存bespoke-dom-measurements.json，转换器自动核对网格和替换文字边界/换行。
- 原生圆角以roundRect+cornerRadius，另设radius供通用预览；当前主题应用不能同步二者。
- 通用renderer会提示字体/roundRect等已知差异，部分线宽/对齐也不保真。隔离工作区曾生成sp-generic-preview.html和逐页SVG证明官方通用renderer可出图及可回读；这些含SP输出的文件不随交付再分发。theme01另有既有Inkscape转PNG后的逐页视觉检查，见sp-generic-visual-qa.json；它不是浏览器或原生编辑器截图。
- 源RGBA按报告底色合成；玻璃、光晕和柔影丢失。theme03硬影可用偏移形状重建。
- 源声明了低对比配色时照实保留，未擅自当作已修复设计；要在实际编辑器检查。
- 原生编辑器选择/输入/拖动/缩放、浏览器保存重开、原生导出、PPTX与PowerPoint均未运行。
- 第3页行动序号仅在源存在时当作列表文字，不当统计数值。最终源freeze后须重跑检查。

## theme01 原生UI阻塞

https://sp.jxcz.top/app 的独立dot云浏览器tab显示本地优先JSON/HTML导入入口。SHA256=50326a637852dd015fc543f0843ff9ec4ec53fa18ef11d08562f9234125b1d7d样例进入文件选择审批流后工具300秒超时，随后只读AX和截图同样超时。导入是否完成、新项目ID、部署SHA均未知；没有新截图或编辑/保存/重开证据。标为BLOCKED/未验，不能记失败或通过，也不能盲目重试未知结果的导入。2026-10-11 16:58 UTC后续只读检查没有新增导入结论；私有浏览器与项目标识已省略。详见theme01/sp-native-ui-qa.json。

## theme01 单独的通用预览兼容变体

原DOM忠实文件sp-sample.json保留不动。额外sp-sample-generic-compatible.json仅将86%指标的“归档完整率”文字下移8目标像素（等效12源像素），解决官方通用renderer忽略lineHeight导致的拥挤。调整h或lineHeight本身不能改变该renderer文字基线。兼容变体的隔离工作区HTML和PNG不再分发；交付仅含JSON及报告。该变体已经逐字段验证仅该文字y变化（另有新文稿身份和说明），并实际查看间距改善；不代表原生编辑器需要同一修改。

## 复现

先确保该主题goal.json已获父任务确认，然后运行：

node dashi-style-previews/sp-tools/convert-bespoke.mjs theme01
node dashi-style-previews/sp-tools/write-qa.mjs

这些命令只写独立的dashi-style-previews交付目录。未创建PR3主题包，因为配色字体层不能代替Dashi页面模板安装。
