# 共享资源索引｜第二批

> 核验日期：2026-10-10。共享能力与视觉身份分离；以下不是授权素材合集。

[返回总索引](00_INDEX.md)


## 第七部分｜资源索引与下一批提炼优先级

### 7.1 轻量归档与使用方式
本批采用 **一份总索引 + 每套语言一份档案 + 共享资源索引**。总报告另提供单文件合并版，便于连续阅读与全文检索；分档版便于按需给强 AI 模型加载。没有引入主题引擎、复杂配置层或新的管理平台。

建议加载顺序为：先读 A 目录的能力差异，再读选定语言的“身份/差异/AI 约束”，需要实现时才展开视觉、运动、组件和授权来源。这个读取建议不是强制提示词框架，也不要求模型复述所有规则。

本轮已交付研究规则，不含可编辑页面、设计 Token 包或已验证组件。未来添加 Both 参考时，可并列存原始视觉出处和自己的可编辑实例，并清楚区分“原作”“原创复现”“自由变体”。

### 7.2 共享资源分类
| 共享类别 | 已核验入口 | 复用规则 |
|---|---|---|
| 中文字体 | Source Han Sans 的 OFL 1.1 许可 [S76] | 可以作为合法字体候选，遵守许可条件；本次不分发任何字体文件 |
| 图标 | Material Symbols / Icons 仓库 [S72] | 按 Apache-2.0 条件使用；只共享资源，不把 Material 外观强塞给所有语言 |
| 任务/错误处理 | GOV.UK patterns 与代码 [S08][S09][S10][S12] | 借鉴语义和流程；政府标识、GDS Transport 不自动授权 |
| 字符界面实现 | LazyGit、Lip Gloss、K9s 文档 [S13][S14][S15] | 区分可复用代码与操作参考；不要复制危险默认动作 |
| 低技术实现 | solar_v2 [S21] | AGPL-3.0 义务与内容授权分开；不等于可无条件闭源复用 |
| 布局/表面/过渡 | CSS Grid、背景滤镜、阴影、渐变、Variable Fonts、View Transition [S59][S60][S61][S62][S63][S64] | 技术按能力引用；文档可见不等于所有示例素材可再分发 |
| 可访问性 | W3C 对比、目标大小、减少动态 [S69][S70][S71] | 作为共同验收基线，不能据此宣称未实现产品已合规 |
| 公有领域原图发现 | Met Open Access 与具体对象页 [S68][S74][S77] | 逐对象确认开放标记，保存出处；不外推至全部馆藏网页 |
| 工艺 | RISOTTO 的 Risograph 说明 [S65] | 共享工艺知识；印刷成品与图像另行确权 |

### 7.3 权利状态：观察、使用、修改与再分发分开
下表是本轮来源核验记录，非涵盖所有司法辖区的法律意见。**“可观察”不等于“可下载打包”；个人项目也不自动豁免素材许可。** “按许可可”表示仍有声明、例外或其他权利条件，不是无限制。

| 资源 | 观察参考 | 个人项目使用 | 商用 | 修改 | 再分发 | 关键边界 |
|---|---|---|---|---|---|---|
| 本报告的原创归纳/适配文字 | 是 | 可用于用户自己的设计研究 | 不代替外部资产确权 | 可调整规则 | 不附带第三方授权 | 不冒充官方规范；引用事实保留来源 |
| GOV.UK 设计系统代码（MIT） | 是 | 按许可可 | 按许可可 | 按许可可 | 按许可可 | 保留许可/声明；品牌、字体分开 [S12] |
| GOV.UK 文档内容（OGL，含例外） | 是 | 按许可可 | 按许可可 | 按许可可 | 按许可可 | 标明来源，核对例外与第三方权利 [S07] |
| GDS Transport | 是 | 普通项目不默认允许 | 不默认允许 | 未核实 | 不作为共享字体分发 | 使用范围限制，建议替换合法字体 [S11] |
| LazyGit / Lip Gloss 代码（MIT） | 是 | 按许可可 | 按许可可 | 按许可可 | 按许可可 | 代码许可不涵盖任意截图商标 [S14][S15] |
| solar_v2（AGPL-3.0） | 是 | 按许可可 | 按许可可 | 按许可可 | 按许可可 | 分发/网络服务修改版等义务需核对，文章与图像另查 [S21] |
| Material 图标（Apache-2.0） | 是 | 按许可可 | 按许可可 | 按许可可 | 按许可可 | 不授权 Google 商标或所有设计文档 [S72] |
| 思源黑体（OFL 1.1） | 是 | 按许可可 | 按许可可 | 按许可可 | 按许可可 | 遵守许可、命名等条件；本包无字体 [S76] |
| Met 对象页明确开放的图像 | 是 | 按具体 OA 状态可 | 按具体 OA 状态可 | 按具体 OA 状态可 | 按具体 OA 状态可 | 本轮《夏山圖》已见 Public Domain；其他对象逐件查 [S68][S74][S77] |
| Met 教学手册/论文/全站内容 | 是 | 不作统一许可判断 | 未统一核实 | 未统一核实 | 未统一核实 | 不能把馆藏 OA 政策覆盖到全部网页/PDF [S38][S68] |
| V&A 图像 | 是 | 按网站条件/具体用途核对 | 通常需具体授权核对 | 未统一核实 | 不默认可 | 网站条款与第三方例外并存 [S34] |
| Mucha Foundation 图像 | 是 | 按具体许可核对 | 需核验授权 | 需核验授权 | 需核验授权 | 有图像许可联系渠道，不以作品年代推定 [S31] |
| Apple 历史手册、TfL、Isotype 原图 | 是 | 未取得统一复用许可 | 未核实 | 未核实 | 不打包分发 | 规范、品牌、字体、扫描图分开 [S17][S25][S23] |
| 漫画页、设计机构案例、品牌素材 | 是 | 未取得统一许可 | 未核实 | 未核实 | 不打包分发 | 公开展示不等于开放素材，角色与商标另查 [S40][S41][S52][S53][S67] |

### 7.4 下一批优先级：按互补性与可落地性
**第一优先：补齐旧清单第 10 项与 Lumina/Noema 的完整指纹。** 这是降低返工的入口，不是阻止新研究的前置锁。完成后优先复核 M3、TUI、低技术与 E 类数字系统的边界，保留本轮实际发现的独立行为能力。

**候选深化的优先组：Memphis、Porto、De Stijl。** 本库判断它们分别可能补反理性构成、地方语义模块、开放正交空间；互补性较强，但不能凭代表物件或宣传视频立即升 A。[S56][S57][S67]

**第二组：Constructivism 与 visionOS。** 前者需要在政治/生产语境、构图和跨媒介应用上做完整研究，而非只抄斜体红黑海报；后者需要真实空间输入与任务结构观察，并与已有沉浸空间和未读完整的 Lumina 比较。[S54][S66]

**暂缓直接升格：Fluent 2、Wabi-sabi。** 不是价值低，而是本轮分别缺少足够的完整差异证据、可操作的具体研究范围。下一次应先明确项目和规则，避免继续收集泛化情绪图。[S55][S58]

对已入 A 的语言，下一步更重要的不是再写基础介绍，而是补两类证据：数字系统的实际操作与减少动态记录；历史语言的原创可编辑样例与跨尺寸验证。Low←Tech 应增加第二个独立项目后，才提升“跨项目复用已验证”的表述。[S18][S19]

### 7.5 本轮结论
这批真正扩展的是**设计怎样组织关系、时间、操作与装饰**。拥有相同几何、同一个动画 API、相近配色或相同媒介，不足以判定为同一种语言；反过来，换品牌、加材质、搬到幻灯片，也不足以证明新增。

本次档案已经可以作为 AI 的研究输入与设计约束来源；尚不能作为“官方高保真实现包”“完整开放素材包”或“已经消除全部旧档案重叠的最终总库”。所有已知限制与补证入口均留在对应档案，而不是隐藏在一个笼统免责声明里。

### 全部公开来源记录（77 项）

核验日期统一为 **2026-10-10**。状态区分正文、索引摘要、实际静态图像及未完成动态观察；“已核验”不表示运行测试或取得复用权。

| 编号 | 来源 / 类型 | 核验状态 | 使用与授权边界 |
|---|---|---|---|
| [S01] | Material Design 3 官方入口<br>官方规范 | 官方索引与检索摘要已核验；部分子页依赖 JavaScript | 观察参考；未据此取得素材再分发许可 |
| [S02] | Building with Material 3 Expressive<br>官方说明 | 2025-05-13；摘要可核验，正文抓取受 JavaScript 限制 | 观察参考；未据此取得素材再分发许可 |
| [S03] | Material Motion：How it works<br>官方规范 | 索引/摘要已核验；未逐帧观看演示 | 观察参考；未据此取得素材再分发许可 |
| [S04] | Material Motion：Transitions<br>官方规范 | 摘要明确仍含 legacy easing/duration；不能笼统称全部 spring | 观察参考；未据此取得素材再分发许可 |
| [S05] | Google：Expressive Design 的用户研究<br>设计团队一手研究 | 正文已核验；未复现实验 | 观察参考；未据此取得素材再分发许可 |
| [S06] | Material Shape：Overview and principles<br>官方规范 | 官方索引/摘要已核验 | 观察参考；未据此取得素材再分发许可 |
| [S07] | GOV.UK Design System<br>官方规范 | 正文已核验 | 内容 OGL v3.0，注明例外；代码与字体另核验 |
| [S08] | GOV.UK：Question pages<br>官方规范 | 正文及示例标记已核验；未完成浏览器操作测试 | 观察参考；未据此取得素材再分发许可 |
| [S09] | GOV.UK：Error summary<br>官方规范 | 正文及示例标记已核验 | 观察参考；未据此取得素材再分发许可 |
| [S10] | GOV.UK：Check answers<br>官方规范 | 官方页面内容已检索核验 | 观察参考；未据此取得素材再分发许可 |
| [S11] | GOV.UK：Typeface<br>官方规范/授权限制 | 官方页面已检索核验 | GDS Transport 有使用范围限制；普通个人项目应换合法字体 |
| [S12] | GOV.UK Design System：LICENSE<br>官方代码/许可证 | MIT 文本已核验 | MIT 代码允许使用、修改和再分发，须保留声明；不覆盖所有品牌资产 |
| [S13] | K9s：Commands<br>产品官方操作文档 | 正文已核验；未运行软件 | 页面列出 Apache v2；具体代码、字体和图标仍应逐项查许可证 |
| [S14] | LazyGit 官方仓库<br>官方实现 | README、演示入口和 MIT 标记已核验；未运行 | MIT 代码；不把演示里第三方商标视作开放素材 |
| [S15] | Lip Gloss 官方仓库<br>官方实现 | README 与 MIT 标记已核验；未运行 | MIT 代码；工具不等于独立视觉语言 |
| [S16] | Charm：V2<br>团队一手发布 | 2026-02-23；版本公告已检索核验 | 用于核验版本代际，不固定未核验的小版本 |
| [S17] | Apple：Macintosh Human Interface Guidelines（1992）<br>Apple 原始规范；第三方档案托管 | PDF 正文及第 30、157、158 页图像已核验 | 历史文献可观察；扫描件、原图标、字体、ROM 不视为可再分发资产 |
| [S18] | Low←Tech：How to Build a Low-tech Website<br>创作者一手说明 | 2018-09；历史方案已核验 | 文章、配图与代码许可分开判断 |
| [S19] | Low←Tech：Rebuilding a Solar Powered Website<br>创作者一手说明 | 2023-06；正文已核验 | 明确电量背景和图像切换改动；本文不复用其性能测量 |
| [S20] | Low←Tech：About the solar website<br>官方项目说明 | 官方内容已检索核验 | 观察参考；未据此取得素材再分发许可 |
| [S21] | Low←Tech：solar_v2<br>官方代码 | README 与 AGPL-3.0 标记已核验 | 使用、修改、商用并非被禁止；再分发/网络提供修改版本须核对 AGPL 义务；内容另核验 |
| [S22] | Isotype Revisited：Introduction<br>研究档案/原作图例 | 正文已核验 | 原始图形、文章分别有权利状态；未确认统一开放许可 |
| [S23] | Christopher Burke：Isotype—representing social facts pictorially<br>研究项目论文及历史原图 | 2010；8 页 PDF，重点核验第 2–3 页图像 | 规则可研究；图版与论文不得默认商用/再分发 |
| [S24] | Isotype Revisited 项目入口<br>雷丁大学相关研究档案 | 正文已核验 | 观察参考；未据此取得素材再分发许可 |
| [S25] | TfL：Line diagram standard<br>官方规范 | Issue 4，January 2025；PDF 封面、第 8、12 页图像已核验 | TfL 图形、地图、Johnston 字体与标志不默认可复用 |
| [S26] | TfL：Design standards<br>官方资源入口 | 官方索引已核验 | 观察参考；未据此取得素材再分发许可 |
| [S27] | TfL：Tube maps<br>真实产品/官方替代版本 | 官方大字版、黑白版入口已核验；未核对全部运营信息 | 观察参考；未据此取得素材再分发许可 |
| [S28] | V&A：Art Nouveau—an international style<br>馆藏机构策展解释 | 2025-02-25 更新；正文与 Tropon（1898）海报原图已核验 | 观察参考；未据此取得素材再分发许可 |
| [S29] | Mucha Foundation：Gismonda（1894）<br>作品基金会/原作 | 作品说明已核验；不推断数字动效 | 页面标注 © Mucha Trust；有授权联络入口 |
| [S30] | Mucha Foundation：Posters<br>作品基金会/原作目录 | 作品目录已核验；未把全部 88 件称为已逐件分析 | 观察参考；未据此取得素材再分发许可 |
| [S31] | Mucha Foundation：Image licenses<br>权利方授权说明 | 正文已核验 | 商业使用/再分发须依具体授权，不因作品年代早而默认网站图片开放 |
| [S32] | V&A：An introduction to Art Deco<br>馆藏机构策展解释与原作 | 页面标注 2024-04-17 更新；正文及 Bonfils 1925 海报图像已核验 | 参照 V&A 条款；不能一概开放使用 |
| [S33] | V&A：Art Deco—where tradition meets modernity<br>馆藏机构策展解释 | 官方页面已检索核验 | 观察参考；未据此取得素材再分发许可 |
| [S34] | V&A 网站使用条款<br>权利方条款 | 条款已检索核验 | 个人非商业与商业用途有区别；第三方资产存在例外 |
| [S35] | The Met：Chinese Handscrolls<br>馆藏机构策展解释与原作 | 2008-04-01；正文与 Summer Mountains 原图已核验 | 观察参考；未据此取得素材再分发许可 |
| [S36] | The Met：Chinese handscroll colophon<br>馆藏研究 | 2018-03-12；官方内容已检索核验 | 观察参考；未据此取得素材再分发许可 |
| [S37] | The Met：Primary characteristics of Islamic geometric decoration<br>馆藏教育原始资源 | 正文已核验 | 观察参考；未据此取得素材再分发许可 |
| [S38] | The Met：Geometric design in Islamic art，Unit 3<br>馆藏教育原始资源 | 14 页 PDF；第 3、5 页图像已核验 | 教学手册整体不等于 CC0；图像逐件核对 |
| [S39] | The Met：Geometric design lesson plan<br>馆藏教育资源 | 官方页面已检索核验 | 观察参考；未据此取得素材再分发许可 |
| [S40] | Steve Ellis：Comic & Manga Layouts, Paneling, Flow<br>创作者一手教学/原图 | 正文与阅读路线缩略图已核验 | 可参考规则；插图与角色未取得复用许可 |
| [S41] | Japan House London：THIS IS MANGA—The Art of Urasawa Naoki<br>展览机构/艺术家作品 | 2019 展览记录已检索核验；未阅读完整漫画卷册 | 观察参考；未据此取得素材再分发许可 |
| [S42] | Clip Studio：Creating a Webtoon<br>创作工具方一手教学 | 正文要点已检索核验；移动纵向适配参考 | 观察参考；未据此取得素材再分发许可 |
| [S43] | IBM Carbon 官方仓库<br>官方实现/规范索引 | README 与规范线索已核验；未运行 | 代码、图标、字体按各自 LICENSE；本轮未逐包确权 |
| [S44] | Atlassian Design System<br>官方规范 | 首页/体系入口已核验；不是全部组件逐项审计 | 观察参考；未据此取得素材再分发许可 |
| [S45] | Shopify Polaris<br>官方规范 | 旧入口跳转至开发者 Polaris 文档已核验 | 不要把旧版 React 实现与当前页面混为一个版本 |
| [S46] | Duolingo：Shape language<br>团队一手说明 | 2020-07-02；已检索核验 | 观察参考；未据此取得素材再分发许可 |
| [S47] | Duolingo：World character visemes<br>团队一手动效说明 | 2022-11-10；嘴型/状态相关内容已核验；未逐帧测量 | 观察参考；未据此取得素材再分发许可 |
| [S48] | Spotify：Encore × Accessibility<br>团队一手工程说明 | 2023-03；已检索核验 | 观察参考；未据此取得素材再分发许可 |
| [S49] | Pentagram：MIT Media Lab<br>原设计团队案例 | 七乘七网格与身份体系说明已检索核验 | 观察参考；未据此取得素材再分发许可 |
| [S50] | Order：NASA Graphics Standards Manual reissue<br>再版设计团队说明 | 原手册/再版项目线索已核验；未购买或通读整本手册 | 不把政府名称/再版出版物视为全部公有领域 |
| [S51] | Pentagram：MIT Technology Review<br>原设计团队案例 | 2018 项目；正文线索已检索核验 | 观察参考；未据此取得素材再分发许可 |
| [S52] | DIA：Pinterest<br>原设计团队动态品牌案例 | 2022 项目说明已核验；视频未逐帧观看 | 观察参考；未据此取得素材再分发许可 |
| [S53] | Territory Studio：Blade Runner 2049<br>原设计团队案例 | 正文已核验；含机械光学与演员触发状态说明，未观看完整视频 | 观察参考；未据此取得素材再分发许可 |
| [S54] | Apple HIG：Designing for visionOS<br>官方规范入口 | 正文受 JavaScript 限制；仅作待验证入口 | 观察参考；未据此取得素材再分发许可 |
| [S55] | Fluent 2<br>官方规范 | 首页已核验；未完成与 Lumina/Noema 完整指纹比较 | 观察参考；未据此取得素材再分发许可 |
| [S56] | Memphis Milano：Carlton<br>原作权利方/产品实例 | 1981 原作；说明与原作图像已核验 | 商品/照片可参考；网站保留权利，未取得再分发许可 |
| [S57] | MoMA：de Stijl<br>馆藏机构解释 | 正文已核验；非本轮完整流派提炼 | 观察参考；未据此取得素材再分发许可 |
| [S58] | The Met：The Japanese Tea Ceremony<br>馆藏机构研究 | 2011-04-01；正文已核验，明确不把所有茶器等同 wabi | 观察参考；未据此取得素材再分发许可 |
| [S59] | MDN：backdrop-filter<br>实现方技术文档 | 正文已核验；未做兼容性实测 | 观察参考；未据此取得素材再分发许可 |
| [S60] | MDN：box-shadow<br>实现方技术文档 | 正文已核验 | 观察参考；未据此取得素材再分发许可 |
| [S61] | MDN：CSS Grid<br>实现方技术文档 | 正文已核验；Bento 的实现参考而非官方风格定义 | 观察参考；未据此取得素材再分发许可 |
| [S62] | MDN：Using CSS gradients<br>实现方技术文档 | 正文已核验；多径向渐变仅为 mesh-like 近似，非真正网格渐变等价实现 | 观察参考；未据此取得素材再分发许可 |
| [S63] | MDN：Variable fonts<br>实现方技术文档 | 正文已核验；字体授权需逐个核验 | 观察参考；未据此取得素材再分发许可 |
| [S64] | MDN：View Transition API<br>实现方技术文档 | 正文已核验；API 不规定某套语言的动效 | 观察参考；未据此取得素材再分发许可 |
| [S65] | RISOTTO：What is Risograph printing?<br>实际印刷工作室一手说明 | 正文已检索核验 | 工艺可研究；成品插图另核验 |
| [S66] | Reina Sofía：Rodchenko and Popova—Defining Constructivism<br>馆藏机构展览研究 | 正文已核验；Tate 原入口本次 403，未当作已读 | 观察参考；未据此取得素材再分发许可 |
| [S67] | White Studio：Porto identity<br>原设计团队发布 | 2014 项目说明已检索核验；未逐帧观看视频 | 仅观察；字体、图标、标志版权未确认开放 |
| [S68] | The Met：Open Access<br>官方授权说明 | 正文已核验 | 标记开放的公有领域藏品图像/数据可按 CC0 使用；不是整个网站全部图文 |
| [S69] | W3C：Contrast Minimum<br>标准发布方说明 | 正文已核验 | 引用规则；不声称本报告生成的产品通过 WCAG 审核 |
| [S70] | W3C：Target Size Minimum<br>标准发布方说明 | 正文已核验；24×24 CSS px 有适用例外与间距条件 | 观察参考；未据此取得素材再分发许可 |
| [S71] | W3C C39：prefers-reduced-motion<br>标准发布方技术说明 | 正文已核验 | 观察参考；未据此取得素材再分发许可 |
| [S72] | Google：Material Design Icons / Material Symbols<br>官方代码与图标 | README/许可证入口已核验 | 按仓库 Apache-2.0 许可条件使用；不覆盖 Google 品牌标识 |
| [S73] | Neumorphism shadow generator<br>效果作者的可交互工具 | 页面说明已核验；未运行完整界面 | 只是阴影参数生成器；代码/站点素材许可未核实 |
| [S74] | The Met：Open Access FAQ<br>官方授权说明 | 正文已核验 | OA 图标逐件确认；CC0 不自动处理商标、肖像、隐私等其他权利 |
| [S75] | Android Developers：Material Design 3 in Compose<br>官方实现与规范 | 正文、Reply 静态示例图、颜色/字级/组件规则已核验；未运行样例，也不以该静态图证明全部 Expressive 动效 | 官方页面代码样例与所用依赖各按自身许可；本报告不打包实现 |
| [S76] | Adobe：Source Han Sans LICENSE<br>字体权利方许可证 | SIL Open Font License 1.1 文本已核验 | 允许按 OFL 使用、修改、嵌入与再分发，遵守命名/声明等条件；本次不提供字体文件 |
| [S77] | The Met：Summer Mountains / 傳屈鼎《夏山圖》<br>馆藏原作记录与授权标记 | 原作页面、Public Domain 标记及右向左观看提示已核验；未操作整套在线浏览器 | 该对象页标为公有领域；结合 Met Open Access 条款使用，保留对象出处；不推广至其他藏品 |

[S01]: https://m3.material.io/ "Material Design 3 官方入口"
[S02]: https://m3.material.io/blog/building-with-m3-expressive "Building with Material 3 Expressive"
[S03]: https://m3.material.io/styles/motion/overview/how-it-works "Material Motion：How it works"
[S04]: https://m3.material.io/styles/motion/transitions "Material Motion：Transitions"
[S05]: https://design.google/library/expressive-material-design-google-research "Google：Expressive Design 的用户研究"
[S06]: https://m3.material.io/styles/shape/overview-principles "Material Shape：Overview and principles"
[S07]: https://design-system.service.gov.uk/ "GOV.UK Design System"
[S08]: https://design-system.service.gov.uk/patterns/question-pages/ "GOV.UK：Question pages"
[S09]: https://design-system.service.gov.uk/components/error-summary/ "GOV.UK：Error summary"
[S10]: https://design-system.service.gov.uk/patterns/check-answers/ "GOV.UK：Check answers"
[S11]: https://design-system.service.gov.uk/styles/typeface/ "GOV.UK：Typeface"
[S12]: https://github.com/alphagov/govuk-design-system/blob/main/LICENSE "GOV.UK Design System：LICENSE"
[S13]: https://k9scli.io/topics/commands/ "K9s：Commands"
[S14]: https://github.com/jesseduffield/lazygit "LazyGit 官方仓库"
[S15]: https://github.com/charmbracelet/lipgloss "Lip Gloss 官方仓库"
[S16]: https://charm.land/blog/v2/ "Charm：V2"
[S17]: https://vintageapple.org/inside_r/pdf/Human_Interface_Guidelines_1992.pdf "Apple：Macintosh Human Interface Guidelines（1992）"
[S18]: https://solar.lowtechmagazine.com/2018/09/how-to-build-a-low-tech-website/ "Low←Tech：How to Build a Low-tech Website"
[S19]: https://solar.lowtechmagazine.com/2023/06/rebuilding-a-solar-powered-website/ "Low←Tech：Rebuilding a Solar Powered Website"
[S20]: https://solar.lowtechmagazine.com/about/the-solar-website/ "Low←Tech：About the solar website"
[S21]: https://github.com/lowtechmag/solar_v2 "Low←Tech：solar_v2"
[S22]: https://isotyperevisited.org/2012/08/introduction.php "Isotype Revisited：Introduction"
[S23]: https://isotyperevisited.org/Isotype_representing_social_facts_pictorially.pdf "Christopher Burke：Isotype—representing social facts pictorially"
[S24]: https://isotyperevisited.org/ "Isotype Revisited 项目入口"
[S25]: https://content.tfl.gov.uk/tfl-line-diagram-standard.pdf "TfL：Line diagram standard"
[S26]: https://tfl.gov.uk/info-for/business-and-advertisers/design-standards?intcmp=4530 "TfL：Design standards"
[S27]: https://tfl.gov.uk/maps/track/tube "TfL：Tube maps"
[S28]: https://www.vam.ac.uk/articles/art-nouveau-an-international-style "V&A：Art Nouveau—an international style"
[S29]: https://www.muchafoundation.org/en/gallery/browse-works/object_type/posters/object/21 "Mucha Foundation：Gismonda（1894）"
[S30]: https://www.muchafoundation.org/en/gallery/browse-works/object_type/posters "Mucha Foundation：Posters"
[S31]: https://www.muchafoundation.org/en/partners/image-licenses "Mucha Foundation：Image licenses"
[S32]: https://www.vam.ac.uk/articles/an-introduction-to-art-deco "V&A：An introduction to Art Deco"
[S33]: https://www.vam.ac.uk/articles/art-deco-where-tradition-meets-modernity "V&A：Art Deco—where tradition meets modernity"
[S34]: https://www.vam.ac.uk/info/va-websites-terms-conditions "V&A 网站使用条款"
[S35]: https://www.metmuseum.org/essays/chinese-handscrolls "The Met：Chinese Handscrolls"
[S36]: https://www.metmuseum.org/perspectives/chinese-handscroll-colophon "The Met：Chinese handscroll colophon"
[S37]: https://www.metmuseum.org/learn/educators/curriculum-resources/art-of-the-islamic-world/unit-three/primary-characteristics-of-islamic-geometric-decoration "The Met：Primary characteristics of Islamic geometric decoration"
[S38]: https://www.metmuseum.org/de/-/media/files/learn/for%20educators/publications%20for%20educators/islamic%20teacher%20resource/unit3.pdf "The Met：Geometric design in Islamic art，Unit 3"
[S39]: https://www.metmuseum.org/learn/educators/lesson-plans/geometric-design-in-islamic-art "The Met：Geometric design lesson plan"
[S40]: https://www.clipstudio.net/how-to-draw/archives/160963 "Steve Ellis：Comic & Manga Layouts, Paneling, Flow"
[S41]: https://www.japanhouselondon.uk/whats-on/this-is-manga-the-art-of-urasawa-naoki/ "Japan House London：THIS IS MANGA—The Art of Urasawa Naoki"
[S42]: https://www.clipstudio.net/how-to-draw/archives/157055 "Clip Studio：Creating a Webtoon"
[S43]: https://github.com/carbon-design-system/carbon "IBM Carbon 官方仓库"
[S44]: https://atlassian.design/ "Atlassian Design System"
[S45]: https://shopify.dev/docs/api/polaris "Shopify Polaris"
[S46]: https://blog.duolingo.com/shape-language-duolingos-art-style/ "Duolingo：Shape language"
[S47]: https://blog.duolingo.com/world-character-visemes/ "Duolingo：World character visemes"
[S48]: https://engineering.atspotify.com/2023/03/encore-x-accessibility-a-balancing-act "Spotify：Encore × Accessibility"
[S49]: https://www.pentagram.com/work/mit-media-lab "Pentagram：MIT Media Lab"
[S50]: https://order.design/project/nasa-graphics-standards-manual-reissue "Order：NASA Graphics Standards Manual reissue"
[S51]: https://www.pentagram.com/work/mit-technology-review "Pentagram：MIT Technology Review"
[S52]: https://dia.tv/project/pinterest/ "DIA：Pinterest"
[S53]: https://territorystudio.com/project/blade-runner-2049/ "Territory Studio：Blade Runner 2049"
[S54]: https://developer.apple.com/design/human-interface-guidelines/designing-for-visionos "Apple HIG：Designing for visionOS"
[S55]: https://fluent2.microsoft.design/ "Fluent 2"
[S56]: https://memphis.it/en/products/carlton/ "Memphis Milano：Carlton"
[S57]: https://www.moma.org/collection/terms/de-stijl "MoMA：de Stijl"
[S58]: https://www.metmuseum.org/essays/the-japanese-tea-ceremony "The Met：The Japanese Tea Ceremony"
[S59]: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/backdrop-filter "MDN：backdrop-filter"
[S60]: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/box-shadow "MDN：box-shadow"
[S61]: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout "MDN：CSS Grid"
[S62]: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Images/Using_gradients "MDN：Using CSS gradients"
[S63]: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Fonts/Variable_fonts "MDN：Variable fonts"
[S64]: https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API "MDN：View Transition API"
[S65]: https://risottostudio.com/pages/what-is-risograph-printing "RISOTTO：What is Risograph printing?"
[S66]: https://www.museoreinasofia.es/en/exhibition/rodchenko-and-popova-defining-constructivism/ "Reina Sofía：Rodchenko and Popova—Defining Constructivism"
[S67]: https://vimeo.com/109802441 "White Studio：Porto identity"
[S68]: https://www.metmuseum.org/hubs/open-access "The Met：Open Access"
[S69]: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html "W3C：Contrast Minimum"
[S70]: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html "W3C：Target Size Minimum"
[S71]: https://www.w3.org/WAI/WCAG22/Techniques/css/C39 "W3C C39：prefers-reduced-motion"
[S72]: https://github.com/google/material-design-icons "Google：Material Design Icons / Material Symbols"
[S73]: https://neumorphism.io/ "Neumorphism shadow generator"
[S74]: https://www.metmuseum.org/policies/frequently-asked-questions-image-and-data-resources "The Met：Open Access FAQ"
[S75]: https://developer.android.com/develop/ui/compose/designsystems/material3 "Android Developers：Material Design 3 in Compose"
[S76]: https://github.com/adobe-fonts/source-han-sans/blob/master/LICENSE.txt "Adobe：Source Han Sans LICENSE"
[S77]: https://www.metmuseum.org/art/collection/search/39915 "The Met：Summer Mountains / 傳屈鼎《夏山圖》"
