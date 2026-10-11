# Dashi → Superior Point 静态适配计划

核验日期：2026-10-11。状态：设计与映射计划，不是已生成的 SP 文稿、可导入主题包、真实 Dashi 模板库或视觉验收报告。

## 1. 结论与最小路径

1. **现有 main 可走 canonical 文稿路径。** 把选定 Dashi 样例转换成 SP 的文本、形状、连接线、图表等对象，显式写入坐标与样式，再生成 `format: "superior-point", schemaVersion: 1` 的 JSON，导入为独立项目。需要编写和验收逐对象转换器；当前内容计划还不是这个 JSON。
2. **PR #3 候选可增加主题包路径。** 单独提取可复用设计 token，生成 `format: "superior-point-theme", schemaVersion: 1` 包。它适合管理与切换受支持样式，不能承载 Dashi 的整页坐标、React 模板或 HTML/CSS。候选未部署，不能把候选能力当作当前线上能力。
3. **主题包和可编辑样例应是两个制品。** 前者是有限的设计系统，后者是明确对象结构的 canonical 文稿。导入主题包不会自动创建 Dashi 页面；PR3 的四页预览是 SP 自己的通用样例，不是 Dashi 预览。
4. **第一批优先做 theme05、theme07 与 theme03 的小型 canonical 试点。** 原因是直角/细线/基本文字几何较易验证，仍需处理字体、间距、图表和 theme03 硬影。先建立可信的对象往返，再扩展玻璃、光晕、复杂曲线主题。此顺序是技术建议，不改变本轮 12 主题的内容与预览工作。

本次只读 GitHub 固定版本与现有资料，未修改 SP 产品、调用 SP 写接口、执行 Dashi 代码或运行 SP 转换。上游预览任务的后续执行状态应以主任务报告为准。

## 2. 固定证据边界

- Dashi：[`21dc7e5`](https://github.com/chuspeeism/dashi-ppt-skill/tree/21dc7e5fc8c3a0d7f6a94948153dd1ee954f4e64)。逐主题登记与已有资料见 `../dashi-ppt-reference-pack/manifest.json`；本计划重新读取固定版 bespoke profile，并直接复核 theme08 metadata 的分支差异。
- SP main：[`5314ac9`](https://github.com/J-X-C-Z/Superior-Point/tree/5314ac9bd71b98e93852ec990146d77c98b7f361)。远端 tree 与 canonical/import/adapter/renderer 均按该 commit 读取。main 的 `core/` 仅有 document-core，新版主题库不在该主干快照。
- SP PR3 候选：[`24ea406`](https://github.com/J-X-C-Z/Superior-Point/tree/24ea406fa52df32e3a618ee804af0c0cf1fa7abf)。直接读取主题 schema、应用器、预览器、API、主题契约、内置主题、MCP 文档与原生 adapter。没有把 `sp-release` 旧目录当作产品现状。
- 原生圆角补充证据：本机已有 `vendor/editor-v039.source.html` 的 Git blob 实测为 `b6d949ddea371e88d1a121151a7a0247c66e4ec2`，与 main 和 PR3 的远端 tree 完全一致，因此仅该文件被用作已核验固定版本的静态补充；未执行它。

代码级契约：

- [main canonical model](https://github.com/J-X-C-Z/Superior-Point/blob/5314ac9bd71b98e93852ec990146d77c98b7f361/core/document-core.js)
- [main 导入边界](https://github.com/J-X-C-Z/Superior-Point/blob/5314ac9bd71b98e93852ec990146d77c98b7f361/io/project-import.js)
- [main 原生模型 adapter](https://github.com/J-X-C-Z/Superior-Point/blob/5314ac9bd71b98e93852ec990146d77c98b7f361/adapters/editor-v038-model.js)
- [main 通用 SVG/HTML renderer](https://github.com/J-X-C-Z/Superior-Point/blob/5314ac9bd71b98e93852ec990146d77c98b7f361/io/html.js)
- [PR3 schema JS](https://github.com/J-X-C-Z/Superior-Point/blob/24ea406fa52df32e3a618ee804af0c0cf1fa7abf/core/theme-schema.js) / [类型](https://github.com/J-X-C-Z/Superior-Point/blob/24ea406fa52df32e3a618ee804af0c0cf1fa7abf/core/theme-schema.d.ts)
- [PR3 应用器](https://github.com/J-X-C-Z/Superior-Point/blob/24ea406fa52df32e3a618ee804af0c0cf1fa7abf/core/theme-application.js) / [四页预览](https://github.com/J-X-C-Z/Superior-Point/blob/24ea406fa52df32e3a618ee804af0c0cf1fa7abf/core/theme-preview.js)
- [PR3 主题契约](https://github.com/J-X-C-Z/Superior-Point/blob/24ea406fa52df32e3a618ee804af0c0cf1fa7abf/docs/architecture/theme-contract.md) / [API](https://github.com/J-X-C-Z/Superior-Point/blob/24ea406fa52df32e3a618ee804af0c0cf1fa7abf/docs/api/themes.md)
- [PR3 五项主题 MCP](https://github.com/J-X-C-Z/Superior-Point/blob/24ea406fa52df32e3a618ee804af0c0cf1fa7abf/docs/mcp/bridge.md) / [现有兼容验收范围](https://github.com/J-X-C-Z/Superior-Point/blob/24ea406fa52df32e3a618ee804af0c0cf1fa7abf/docs/acceptance/theme-compatibility.md)
- [Dashi bespoke profile](https://github.com/chuspeeism/dashi-ppt-skill/blob/21dc7e5fc8c3a0d7f6a94948153dd1ee954f4e64/skills/dashi-ppt/project/src/components/bespoke/theme-profiles.mjs) / [theme08 metadata](https://github.com/chuspeeism/dashi-ppt-skill/blob/21dc7e5fc8c3a0d7f6a94948153dd1ee954f4e64/skills/dashi-ppt/project/src/components/themes/theme08/metadata.js)

## 3. 两种 SP 制品的契约

### 3.1 可编辑 canonical 文稿

文档必需：format、schemaVersion、非空 id、title、非负整数 revision、正数 canvas.width/height、slides、assets、有效 metadata.createdAt/updatedAt、extensions。

对象最小结构为 id/type/x/y/w/h；x/y/w/h 必须有限，w/h 非负。slide、element、animation ID 在整篇文稿内不能重复。所有图片的 assetId 必须存在。canonical 能保存未知安全 JSON，不等于原生编辑器、通用 renderer 或导出端会显示这些字段。

计划以 1280×720、16:9 为目标。Dashi 源画布预计约 1920×1080，尚未在本轮实际渲染中测量：只有确认恰为该尺寸时，才按 2/3 等比换算位置、字号、线宽、圆角、内边距。否则从实测 canvas 计算统一比例；不分轴拉伸、不把网页响应式外壳宽度当 slide 内部宽度。

main 的本地导入支持 canonical JSON，或带唯一 inert `sp-document` 数据块的 SP HTML；不是普通 Dashi HTML 导入器。`createImportDocument` 会生成独立项目身份与来源信息，避免覆盖旧项目。25 MiB 导入上限也需纳入最终文件检查。

### 3.2 PR3 主题包与引用

必需包字段包括 format、schemaVersion=1、id、name、semantic version、author、license、tags、supportedRatios、tokens、layouts、assets。tokens 的 colors/typography/spacing/components 四组均必需；colors 只接受 6/8 位 hex。typography 每个角色需 fontFamily、非空 fallback、license、6–240 的 fontSize；weight/lineHeight 有边界。

layouts 只允许 cover/section/content/data/image 等 kind 与声明式 rules。任何层级中的 x/y/w/h/elements/slides 会被拒绝。即使写了 columns、gap、pageInset，现有项目应用器也不读它们来重新排版。四页预览器只消费自己知道的少数规则和 motif，不解释任意新模板。

主题引用必须由实现计算 `{id, version, hash, snapshot}`，hash 是递归键排序 JSON 的 SHA-256；不可随手补一个假的 hash。document.extensions.theme 存固定快照。不可覆盖已发布的同一 id/version；云端导入分配新 UUID、保留 source 身份并重新算适配后的 hash。

只接受内嵌 PNG/JPEG/WebP 及其 base64/hash/license；单资源 2 MiB，总资源 8 MiB，最多 16 个，整包 12 MiB。拒绝 SVG、HTML、脚本、CSS、外链加载字段和字体二进制。源链接与详细转换证据应留在独立 manifest，不把带 `url/src/href` 键的来源对象塞进主题包。图像签名/hash 验证不等于完整解码或安全扫描。

五项新 MCP 为 sp_list_themes、sp_get_theme、sp_preview_theme、sp_apply_theme、sp_save_theme；均属于 PR3 候选，不能宣称线上可用。它们需要 themes:read/write/publish 等相应权限，应用还需 projects:write 与项目范围授权。现有六个内置主题是 Superior Point 原创设计，没有任何一个可冒充 Dashi 模板。

## 4. 实际样式白名单与兼容陷阱

PR3 只应用 fontFamily、fontSize、fontWeight、bold、lineHeight、color、fill、stroke、strokeWidth、radius、chartColor、align，以及页面 background。它主要处理 text、shape、chart；table/image/line/connector 不经此函数自动重新着色。

### 4.1 圆角存在字段与形状双重差异

- 通用 SVG 画矩形读取 `radius`，缺省为 8；要保持直角，显式设 0。
- 原生编辑器只在 `shape: "roundRect"` 时读取 `cornerRadius`，缺省为 12；普通 rect 不因增加 radius 自动变圆。
- main 与 PR3 的 canonical adapter 都没有 radius→cornerRadius 或 rect→roundRect 的自动转换。
- PR3 主题白名单能改 radius，不能改 shape 或 cornerRadius；schema 允许的组件 borderRadius 也不在应用白名单中。`borderRadius`、`radius`、`cornerRadius` 不能互换使用。
- 后续 canonical 转换可对圆角面板写 roundRect + cornerRadius，并附同值 radius 供通用预览降级使用。但通用诊断会把 roundRect 视为非基础形状，且之后换主题只改 radius 会造成二者不同步。首版应把原生圆角当固定几何，明确这一限制；不能声称解决了全产品圆角同步。
- 通用 renderer 的矩形/椭圆分支没有输出 stroke-width，strokeWidth=0 或更粗边框不会像原生编辑器那样生效；线/连接线分支才显式使用它。细边、无边框和粗边都要分 renderer 验收，不能只看字段已保存。

### 4.2 透明度、材质、阴影

Dashi rgba 需转为 #RRGGBBAA，或在约定底色上合成为六位不透明 hex。mapping 提供两种候选值；扁平值是可移植降级方案，不是原样材质。渐变、径向光晕、backdrop-filter、内高光、混合模式不能经主题包恢复。

优先把可描述的装饰拆为可编辑形状。例如 theme03 偏移硬影可以是后置矩形。真正模糊/玻璃可选择经授权的独立栅格装饰层，保持文字/数据可编辑，并披露装饰层不可拆解编辑。不可整页截屏后标成“可编辑模板”。原生布尔 shadow 只是其自身固定阴影，不等于 Dashi shadow 字符串；主题应用也不会设置它。

### 4.3 字体、换行、标题层级

profile 给出字体栈，但没有完整字号/字重/行高体系，不能凭空写成“上游原始字号”。从实际选定页面测量，再做比例换算。SP 的 fallback 数组是声明信息；当前 fontStyle 只写 fontFamily，不自动拼接 fallback。应明确验证已安装字体，或在受支持的 fontFamily 字符串内显式保留安全字体栈，并说明设备差异；不自动下载或嵌入字体。

通用 SVG 强制 Arial/sans-serif、按换行符绘制、行距约 1.2，不实现原生自动换行、富文本与精细字度量；其粗体仅识别特定值。模板多色标题应拆成多段独立文本对象或另验 rich text，不能假设一个 text 对象等价。中文换行、长标题、极大数字都需在实际编辑器与导出中验收。

### 4.4 图表与表格

- main 的通用柱图用 fill 绘制柱；PR3 改为优先 chartColor。深色主题若给 chart.fill 配浅背景而只给 chartColor 配强调色，在 main 通用预览会出现浅色柱。不要混用分支的渲染结论。
- 两版通用 renderer 的轴标签仍固定深色，复杂图表不支持。PR3 四页样例使用固定浅色图表面板以确保可读；这是 SP 样例的处理，不能当 Dashi 实际风格。
- 原生 chart 可编辑 labels/values/chartType 等，主题包只控制单个 chartColor；Dashi 多 series 色谱、网格、barRadius、特殊轴或金融图表不会自动映射。
- 保留 Dashi 多色与版式时可用形状条+数值文字，但应标为“可编辑图形图表”，不冒充原生数据驱动图表；数据真值仍留在转换 manifest。
- theme01–03 是异质指标，只能保留独立 KPI；毫秒、小时、百分比不能共用同一柱图刻度。theme04–12 可在核对单位后使用同单位原生图表，仍不得加不存在的 %、推算值或真实统计结论。
- canonical rows 能映射到原生 cells；通用表格的填色和字号固定，不承诺 Dashi 表格视觉。要求精确网格时可用矩形+文本重建，同时披露失去原生表格编辑语义。

### 4.5 手工样式、第二强调色与安全应用

preserve 是默认。已有显式样式如果没有对应旧 binding，视为手工设置；只加 themeRole 不会让旧颜色突然受主题驱动。新生成 canonical 样例需要如实登记“由此主题生成”的基线，不得把用户手工字段伪装成主题基线。reset 会覆盖白名单样式，需独立确认，不能用它绕过保留要求。

默认 text 取 body，shape 取 panel，chart 取 chart。colors.accent2、line 等命名本身不会自动被采用；需要 components 自定义角色中的白名单字段，例如 accent2.fill/stroke，并在相应对象写 themeRole。间距、图片处理、组合层级和动画不会由 theme 应用器重新生成。

所有主题应用最终经过 Core 原子 batch、expectedRevision、项目权限、租约与幂等回执；预览/包导入不等于已写入项目。不能直接改项目 JSON 或依据标题覆盖目标。失败应无部分提交。

## 5. 逐主题适配评估

以下 palette/圆角值只指固定 commit 的 bespoke profile。模板分支必须在确定 template ID 后重新检查；名称、官方预览或 metadata 登记不能代替已选页面的真实规范。结构评级是实现可行性分析，没有主题通过 SP 视觉验收。

| 主题 | bespoke 关键 token | 版式/可编辑映射 | 主要保真缺口 |
|---|---|---|---|
| theme01 轻拟态风 | #5b8def / #46b083；源圆角 30，pad/gap 88/22 | 编辑式双栏 / 居中 / 便当格。保留卡片层级和留白；把柔影作为单独装饰层，不能仅换蓝色就视作拟态。 | 双向柔影；径向光晕；半透明层叠 |
| theme02 炫光紫绿风 | #c7ff3f / #a24dff；源圆角 24，pad/gap 92/22 | 聚光封面 / 大数 / 海报 / 模块网格。保留焦点与字号对比；28毫秒、12小时、94%作为独立指标，不能共享数轴。 | 紫绿光晕；玻璃内高光；景深阴影 |
| theme03 深浅代码风 | #2742ec / #c2f53d；源圆角 0，pad/gap 92/20 | 横向封面 / 海报 / 网格 / 技术流程。直角硬边可直接画矩形；偏移硬影用背景形状重建；技术流程用connector和文字。 | 需重建的硬影；等宽字体实际可用性 |
| theme04 玻璃糖果风 | #27e021 / #ffc700；源圆角 28，pad/gap 82/20 | Hero / 索引 / Ghost / 便当格。保持糖果色多分类，不强制统一单色柱图；偏好占比可用三色形状条和独立标签。 | 玻璃透射；多光源；内高光；多色图表主题覆盖 |
| theme05 色谱图表风 | #d8402e / #2c44a0；源圆角 0，pad/gap 72/18 | 编辑封面 / 规格 / 网格 / 密集报表。优先保留直角、纸底、细线、分栏和色谱的分类语义；表格跨renderer样式需单独验收。 | 精细表格排版；七色色谱不会自动映射到chart |
| theme06 深色图谱风 | #c8f135 / #65d3d6；源圆角 4，pad/gap 88/20 | 多型封面 / 摘要 / 目录 / 产业链。信息密度与流向关系必须在canonical中显式建模；不能把theme spacing当自动布局器。 | 暗色光晕；低圆角差异；复杂产业/资本图谱 |
| theme07 冷白调研风 | #235c4b / #b7dc36；源圆角 12，pad/gap 94/20 | 精简封面 / 供应链 / 趋势 / 策略。适合首轮canonical试点；保留冷白/深绿、方法与证据标签，媒体去饱和需另测。 | 轻渐变；柔影；低饱和图片处理 |
| theme08 黑金实验风 | #d3ad5b / #f0d59a；源圆角 2，pad/gap 94/22 | 补充封面 / 双栏 / 品牌实验。按选中模板实测，不预设每页黑金；page002 metadata明示电光黄/淡紫灰，与bespoke黑金不同。 | 衬线字体；细金边；渐变光晕；模板与bespoke分支异构 |
| theme09 深蓝杂志风 | #f06c45 / #79a8d8；源圆角 8，pad/gap 92/20 | 刊头 / 对角 / 卷宗 / 分层 / 图像窗。保留衬线刊头与非对称栏宽；深蓝/橙只属于已核验bespoke，不覆盖模板原样。 | 衬线字度量；媒体遮罩；渐变光晕；复杂编排 |
| theme10 金色指数风 | #5479e8 / #c79062；源圆角 18，pad/gap 96/20 | 暮色 / 旷野 / 氛围字 / 地平线 / 指数。bespoke按冷蓝+暖铜映射；基期100、108、114保留为指数点，不能误写百分比。 | 蓝铜双径向渐变；Plex字体；半透明面板；不支持的金融复杂图表 |
| theme11 高能增长风 | #ff5b32 / #c2f53d；源圆角 18，pad/gap 86/20 | 高能路演 / 指标 / 转化步骤。橙红主重点、酸绿次重点；100→68→42同单位可做独立条形或结构化转化图，禁止凭空补转化率。 | 暖色光晕；中圆角；视觉大数与文字自动换行 |
| theme12 声波霓虹风 | #27d6dd / #e83a9b；源圆角 26，pad/gap 88/20 | 字形 / 声波 / 图像 / 网格 / 宣言。将波形/唱片/票券拆成可编辑几何只保证结构近似；不得把时长样例冒充真实音频波形。 | 真实波形/复杂曲线；霓虹光晕；玻璃材质；模板浅深模式差异 |

特别注意：

- theme08 的“黑金实验风”不能当统一配色约束。其 metadata 的补充模板包含电光黄、淡紫灰选项，bespoke 才是本计划列出的黑金衬线配置。
- theme10 的名字是“金色指数风”，实际 bespoke 主/次强调为 #5479E8 冷蓝和 #C79062 暖铜；源渐变也含蓝铜，不可改写为通用黑金。
- theme05 的 pageInset 不能吞掉 padX=72、padY=60 的区别；源 hairline=1、strongRule=3。这些要进 canonical 几何/线对象，单个主题 pageInset 不足以还原编辑式版面。
- theme12 的模板有浅/深模式差异；本计划的青/洋红暗底只覆盖 bespoke。

完整逐主题机器可读记录见 `SP-ADAPTATION-MAPPING.json`，包含源链接、profile 事实、候选颜色转换、角色与对象计划、布局族、数据语义、缺口和待选字段。该 JSON 的 format 明确是 adaptation-mapping-plan，不能上传为 SP theme 或 document。

## 6. 后续可编辑样例转换设计

### 6.1 输入与选择

每主题已有独立 brief 与 PageContentPack，包含 cover/evidence/action 三个逻辑页。预期每页 3 个结构不同模板 + 1 个约束 bespoke，共每主题 12 个变体；这是计划目标，不是本次生成数量。

当前尚未 scaffold，没有确定 template ID。后续保留精确 source commit、template ID、logical page ID、variant ID、已批准公开参数及内容投影。不能把参考 manifest 前五/十个登记页当作选定页面，也不能用主题名称选一个近似 SP 布局代替上游真实结构。

### 6.2 转换流水线

1. 在授权且隔离的预览任务中获得实际 Dashi 变体；核对尺寸、字体加载、内容溢出与可见文案。不在本计划中执行。
2. 读取实际页面结构和已计算几何，建立中间 object map：source semantic ID → target element ID、kind、bounds、z-order、copy source、style provenance、数据绑定、损失说明。优先从语义与显式组件数据映射；DOM 测量只补几何，不把任意 DOM 当可信 canonical。
3. 将文本、数字、矩形、圆、线条、可表达连接关系、简单图片和图表转为独立对象；长文本做实际测量后的断行。无法表示的装饰保留为单独降级层，写明不可编辑范围。
4. 保持画布比例与相对位置。只做一次统一缩放；为文字层级、卡片内边距、分隔线、图例建立源到目标映射。表格/图表不能只按外框截图替换。
5. 生成新的 canonical 文稿与 source-map sidecar。文稿注明“Dashi 参考样例的 SP 转换”，不称“Dashi 原生模板”或“官方适配”。最初保持 assets=[]、animations=[]，除非实际样例与授权明确需要。
6. 通过目标 commit 的 validateDocument/importDocument；检查 ID、有限几何、画布外警告、资产引用及 unsafe payload。必须在拟交付版本做真实校验，本计划中的静态结构分析不是校验通过。
7. 在实际 SP 原生编辑器中导入独立项目，检查可选择/编辑/移动/缩放文字、形状与图表；保存、重开、撤销、导出、重导入。先确认对象语义，再比较像素。
8. 如 PR3 已验收部署且用户需要复用主题，再独立生成、验证与保存 v1 theme；核验资源 hash、版本锁定和 ref。可编辑文稿可以引用该 snapshot，但二者仍分开交付。

### 6.3 theme binding 设计

为新创建而且确定由转换器生成的文字/形状赋 title/body/caption/panel/accent 等 themeRole；将主题控制值与手工/模板固定几何明确区分。按当前 createThemeBindings 的真实规则登记基线，只绑定允许变化的生成样式。固定模板的几何、复杂装饰、多色图表等继续由 canonical 显式值负责，不虚构“自动响应 theme layout”能力。

同一 template 的浅/深模式或字体族有根本差异时，应成为可追踪的 variant/style override，不能强行压成一个全主题配色。新主题不能覆盖 Dashi 源数据或用户旧项目。

### 6.4 拟交付文件

- `<theme>/<variant>.sp.json`：真正的 SP canonical 文稿，尚未生成。
- `<theme>/<variant>.source-map.json`：精确模板、内容、对象来源、几何缩放及降级清单，尚未生成。
- `<theme>/<variant>-sp-preview.png`：由实际 SP renderer 得到的截图，不能用 Dashi 原图冒充，尚未生成。
- 可选 `<theme>/bespoke-style.sp-theme.json`：仅可复用 token 与设计规则，明确 bespoke 来源范围，尚未生成。
- 验收报告：schema、数据、往返、编辑、导出、截图与已知差异；主干/候选/线上分别标识。

不要求所有主题一次做到全部材质。可以按“结构可编辑 + 明确材质降级”交付，但必须让使用者看到降级层和验证状态。

## 7. 验收清单与停止条件

### 结构与内容

- 12 个主题的名称、revision、来源与分支不混淆；选中模板不重复冒充 3 种结构。
- 每个逻辑页每个变体都保留关键事实、同意的 full/short 文案、单位与“虚构演示”说明。无新增统计结论。
- 所有正文文字和 KPI 为 text；核心几何独立可选；原生 chart 与形状图表标记准确；未把整页栅格化当作可编辑。
- 匹配 canonical ID/asset/group/animation 约束。只用 flat group；main/PR3 原生 adapter 拒绝嵌套 Core group 和 group 整体动画。
- canonical → native → canonical → save/reopen 后内容、ID、图表 values/labels、notes、assets 与可选 theme ref 保持；可接受的 adapter metadata/default 字段另记录，不能仅比较 JSON 字节。

### 视觉与应用

- 在实际原生编辑器和实际 HTML 导出各自核验字体、中文换行、字号、颜色、圆角、线宽、图表标签、层叠顺序、对齐与无溢出；通用 SVG 截图只能证明通用预览。
- 对 roundRect/cornerRadius/radius 做具体回归。对 main/PR3 chartColor/fill 差异分支测试。
- 测试已绑定样式可更新、手工样式 preserve 不变、reset 仅在确认后执行、撤销回到上一主题且内容/几何不丢失。
- 对 16:9 做完整检查后再考虑 4:3；不能只把 supportedRatios 写成两种就算完成双比例适配。
- PPTX 和 PowerPoint 保真未验证，不能从主题包通过、浏览器截图或 SP 自有六主题测试外推。

### 合规与部署边界

继续遵守主预览任务对 Dashi AGPL 主体和专有导出引擎的边界；不拷入专有 html-deck-to-pptx、不借主题包嵌入上游 runtime/font/外部资源。具体再分发范围、实际使用的源与 notices 应在发布前按现有审查单处理；本计划不作许可合规结论。

遇到未选定模板、无法确定字号/源画布、授权缺口、不可恢复的对象语义、字体/图片资源不清、schema/往返失败、候选未部署或服务权限缺失时，停止相应导入/发布步骤并报告精确阻塞。继续允许的离线计划和只读检查，不冒称适配完成。

## 8. 本次完成与未完成

已完成：固定版本契约核验；12 主题的 token/布局/可编辑对象静态评估；分支差异、圆角、图表、preserve、数据单位与资源限制梳理；未来转换设计及机器可读 mapping。

未完成：Dashi→SP 转换实现、SP 可编辑样例、SP theme 文件、任何 SP 写入/发布/部署、浏览器编辑和导出验收、PPTX 验证。本文件和 mapping 均为计划。
