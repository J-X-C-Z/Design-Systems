# A01｜Material 3 Expressive

> 第二批增量研究 · 2026-10-10 · 分类 A（相对已知旧清单成立；第 10 项及未读旧档案仍保留复核义务）
> 证据标记：**[原]** 官方/原作者明确说明；**[馆]** 馆藏机构或研究档案解释；**[观]** 本轮直接核验的静态图像；**[适]** 本资源库原创适配；**[技]** 第三方实现能力。未标明为事实的跨场景方案、AI 约束与验收项均属 [适]。

## 1. 身份与定位
**类别：官方数字产品设计系统。** 收录的是 Material 3 家族中已明确发布的 Expressive 扩展，不把 Material You、动态配色、深色模式分别计数。代表证据为 Material 官方说明、Google 的设计研究与 Android 官方 Reply 样例。[S01][S02][S05][S75]

独特性：**让操作的重要程度，通过形状、字级、色调和有响应性的运动共同变得可感知。** 它不是“给普通界面套大圆角”。情绪目标是亲近、明确、有活力，同时仍能完成真实任务。其原生规则覆盖组件与行为；本库引用它，不要求其他语言也建立同规模组件库。

## 2. 与已有资源的差异
最接近“温暖插画”，次接近“精密工业”。共性是友好反馈和明确操作；差异在于：温暖插画主要通过角色/图像表达情绪，M3 Expressive 把情绪和注意力分配放进**真实控件的形变、分组、尺寸差与状态**。相较工业控制器，它不用刻度与实体设备的规格隐喻建立可信度。

去掉插画仍可辨识，去掉固定品牌色仍可组织操作，因此不仅是旧档案换色。独立建档新增的是“可操作表面的表达性”，不是又一套卡片。与 Lumina/Noema 的完整指纹尚不能彻底比对；此判断不表示已读过它们全部规则。

## 3. 视觉规则
[原] Material 的颜色以角色和前景/容器关系组织；字级分 display、headline、title、body、label；形状用于引导注意、识别组件和表达状态。官方实现同时展示色调层级与阴影，而不是只靠投影分层。[S75]

[适] 配色先决定“主操作、次操作、内容表面、选中表面、错误”，再选色；不能把同一个鲜艳颜色同时用于选中、警告和装饰。字级服务任务：一页可以只使用需要的几级，不为了展示字体系统强行塞入全部字号。中文采用合法中文黑体，独立检验标点、数字与英文缩写的基线；不能把拉丁字母的大幅字距直接搬到汉字正文。

构图以任务区域分组，允许大动作区与紧凑信息区并置，不默认三栏营销卡片。圆形、圆角矩形或较有表现力的容器，应在相似功能间保持规则；变化发生在类别和状态之间，而不是每张卡随机换形。图标承担动作辨识，摄影保留主体；插画可缺席。材质以清晰表面为主，边框用于必要分隔，不追加厚金属、玻璃或纸张纹理来制造“高级感”。[S06][S75]

## 4. 交互与动效语言
[原] Expressive 的说明引入弹簧式运动；但是本轮核验的官方 transitions 页面仍注明部分转场沿用旧的 easing/duration。**“全部动效都已变成弹簧”不成立。** 未获取所有组件的最新完整参数表，也未录制原站交互。[S02][S03][S04]

[适] 运动隐喻是“对用户动作作出有秩序的响应”，不是卡通角色蹦跳。建立以下事件关系：

| 触发 | 焦点与空间关系 | 时间规则 | 退场/中断 |
|---|---|---|---|
| 按下主要动作 | 反馈起于被操作控件；标签保持可读 | 操作反馈先发生，业务完成反馈随后发生 | 请求失败不能仍播放成功形变 |
| 切换分段选项 | 选中表面迁移，选项位置不乱跳 | 相邻状态可连续接续 | 快速切换应追踪最新选择 |
| 打开条目详情 | 保留条目身份，可选择容器延展 | 背景信息降权而不是一齐弹出 | 返回时找得到原条目 |
| 筛选列表 | 保持未改变条目的身份与焦点 | 更新不制造一串漫长瀑布式延迟 | 减少动态模式直接呈现新状态 |

[技] 共享元素可由平台原生能力或 View Transition API 实现；该 API 不是 Material 的官方运动参数。[S64] 本档案不提供伪装成官方的毫秒值、阻尼或刚度。

## 5. 组件表达
[原] 真实组件包含不同强调程度的按钮、chips、cards、导航与 app bars；Reply 样例给出了导航随空间条件变化的实例。[S75] 这些是已存在的系统能力，不是本库发明。

[适] 按钮要有明确主次；工具栏中的高频动作不应全部放大到宣传按钮的尺度。表单标签必须稳定可见，错误关联字段。弹窗/底部面板只在任务需要时使用；桌面侧栏可以保留文本导航，不照搬手机导航条。信息面板与数据表用可比较的行列，不能为维持圆润感把每个数值拆成孤立胶囊。组件选择 Optional：内容页无需为了“像 Material”而虚构搜索栏、头像和悬浮按钮。

## 6. 风格边界与反例
必须保留语义色对、动作强调差、状态与形状的关联、可追踪的操作反馈。品牌色、插画、布局、照片主题可以自由变化。

不要：把所有按钮设成同样醒目的大色块；让删除和完成共用庆祝性反弹；文字随每次 hover 拉伸变形；把所有内容放进等大圆角卡片；在表达性表面上叠加霓虹玻璃与工业刻度。Google 自己的研究也表明，表现力要服从场景，杂乱布局或去掉必要标签并不自动改善体验。[S05]

## 7. AI 可执行规范
**核心不变量：**操作优先级先于装饰；色彩成对分配；状态变化有可追踪的对象；形状变化不能损害文字和触控区域。

**可变参数：**品牌种子色、任务密度、形状强调幅度、适合该任务的字级数量。**共享资源：**合法字体、语义表单逻辑、焦点管理、图表数据模型。**专属预制资产：**经过审定的形状家族、状态对照、少量组件运动示例；这些比一套花哨壁纸更有用。

建议语义 Token：`action.emphasis`、`surface.role`、`shape.family`、`shape.state`、`motion.response`。它们是本库建议，不冒充官方 API；使用官方实现时应映射到它真实暴露的接口。

**正向提示词：**“先根据任务确定主次动作，再用 Material 3 Expressive 的色调、形状和字级协同表达；保留内容的合理密度，让状态变化来自被操作对象。请分别给出普通、聚焦、选中、加载、失败状态。”

**负向约束：**“不做卡片拼盘；不随机换圆角；不删除必要标签；不将所有过渡设为弹簧。”

**验收：**不靠颜色也能看懂选中态；长中文标签不溢出；键盘可完成主要任务；返回后焦点正确；快速重复操作不排队播放过期动画；静态版本仍保留完整信息层级。这些是待执行验收标准，不是本轮测试结果。

## 8. 跨场景应用
| 场景 | 适配判断与保留项 |
|---|---|
| Web | 适合交互产品；保留状态语义，不把手机页面等比放大 |
| 桌面 | 适合中等密度工具；压缩无效留白，保持工具栏层级 |
| 移动端 | 最有直接参考价值；保留大目标与清晰反馈 |
| 幻灯片 | 适合产品讲解/行动型内容；不为每页添加应用外壳 |
| 数据可视化 | 用角色色强调选中/比较；数值编码独立于装饰形状 |
| 个人主页 | 适合作品可交互展示；严肃长文宜降低动态强度 |
| AI 自动生成 | 规则与组件证据丰富，推估较易复现；不等于已通过多模型测试 |

## 9. 可访问性与实现成本
颜色成对并不免除最终对比测试。中文和长标签要按实际字形校验。触控与键盘不得依赖 hover；大投影画面减弱细微色调差，补文字/轮廓。减少动态模式应取消非必要形变，保留结果反馈。[S69][S70][S71]

低成本近似：采用语义表面、适量形状差和普通状态切换，明确只是视觉近似。高保真：使用匹配平台及版本的组件、动作中断处理、完整输入状态；跨平台同时对齐时维护成本更高。没有实测帧率或包体积数据，不给虚假性能数字。

## 10. 资源与授权
规范、Google 研究和 Reply 入口可观察。Material Symbols 仓库标注 Apache-2.0，复用图标须保留相应许可要求；Google 标志不是通用图标库的一部分。[S72] 本轮未逐项审核全部组件依赖许可，不把“Material 是开放系统”解释成“任意 Google 图片可商用”。

个人/商业使用原创规则适配，与复制原始资产是两回事。中文字体可参考 Source Han Sans 的 OFL；允许使用和修改不等于取消许可证条件。[S76] 本归档仅存链接和原创文字，不提供字体文件、品牌素材或官网代码副本。

### 本档案来源与核验状态

| 编号 | 来源 | 核验与边界 |
|---|---|---|
| [S01] | Material Design 3 官方入口 | 官方索引与检索摘要已核验；部分子页依赖 JavaScript |
| [S02] | Building with Material 3 Expressive | 2025-05-13；摘要可核验，正文抓取受 JavaScript 限制 |
| [S03] | Material Motion：How it works | 索引/摘要已核验；未逐帧观看演示 |
| [S04] | Material Motion：Transitions | 摘要明确仍含 legacy easing/duration；不能笼统称全部 spring |
| [S05] | Google：Expressive Design 的用户研究 | 正文已核验；未复现实验 |
| [S06] | Material Shape：Overview and principles | 官方索引/摘要已核验 |
| [S64] | MDN：View Transition API | 正文已核验；API 不规定某套语言的动效 |
| [S69] | W3C：Contrast Minimum | 正文已核验 |
| [S70] | W3C：Target Size Minimum | 正文已核验；24×24 CSS px 有适用例外与间距条件 |
| [S71] | W3C C39：prefers-reduced-motion | 正文已核验 |
| [S72] | Google：Material Design Icons / Material Symbols | README/许可证入口已核验 |
| [S75] | Android Developers：Material Design 3 in Compose | 正文、Reply 静态示例图、颜色/字级/组件规则已核验；未运行样例，也不以该静态图证明全部 Expressive 动效 |
| [S76] | Adobe：Source Han Sans LICENSE | SIL Open Font License 1.1 文本已核验 |

所有线上来源核验日：2026-10-10。源站改版后须重新确认；本档案不是品牌官方规范。

[S01]: https://m3.material.io/ "Material Design 3 官方入口"
[S02]: https://m3.material.io/blog/building-with-m3-expressive "Building with Material 3 Expressive"
[S03]: https://m3.material.io/styles/motion/overview/how-it-works "Material Motion：How it works"
[S04]: https://m3.material.io/styles/motion/transitions "Material Motion：Transitions"
[S05]: https://design.google/library/expressive-material-design-google-research "Google：Expressive Design 的用户研究"
[S06]: https://m3.material.io/styles/shape/overview-principles "Material Shape：Overview and principles"
[S64]: https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API "MDN：View Transition API"
[S69]: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html "W3C：Contrast Minimum"
[S70]: https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html "W3C：Target Size Minimum"
[S71]: https://www.w3.org/WAI/WCAG22/Techniques/css/C39 "W3C C39：prefers-reduced-motion"
[S72]: https://github.com/google/material-design-icons "Google：Material Design Icons / Material Symbols"
[S75]: https://developer.android.com/develop/ui/compose/designsystems/material3 "Android Developers：Material Design 3 in Compose"
[S76]: https://github.com/adobe-fonts/source-han-sans/blob/master/LICENSE.txt "Adobe：Source Han Sans LICENSE"
