# 精密工业 · 独立浏览器 QA
2026-10-11 07:36 UTC，dot 云端 Chrome。

结论：所测范围通过，未发现阻塞缺陷。保留原效果评价“差”与适配二级，不自动升等。

- 四页×1440/768/390/320 CSS iframe共16状态正确；clientWidth=scrollWidth分别1425/753/375/305。320展开编辑工具也无横溢出。
- 实际看图：封面反白标题与旁列索引；字段解剖中央字段、旁注及逐行引线；编号页P01–P12连续三列；时间页三种候选解释与“当前未确定”分开。不是仪表盘/工程认证模拟。黑白开关与总览工作，结构仍可辨。
- N1–N5逐字段对应同编号注释。320实际截图与DOM几何都证实字段后紧邻对应注释，引线display:none，未将注释放到全表之后。
- P01–P12连续；R1–R3独立，文本明确尚未与点位建立分配关系。时间三分支均无已选/确定语义，不自动推导10分钟或每点30分钟。
- 键盘Enter逐一激活封面3个索引与N3→04链接，页面正确切换。
- 压力编辑：标题“重新看见沿岸观察”增加4汉字；第二标题“潮 <线> & 观察”；N1注释增加“此处继续保留未知状态。”超过20%；P07长名称；N3字段改“时间适用范围 <待核>”并同步旁注；单轮时间解释显著加长；主墨#303c48。
- 真实下载edited-export.html/json后，发布原字节HTML重开：中文及特殊字符、颜色、所有压力文字完整；四页切换正常；可继续编辑。仅观察到浏览器扩展元数据日志，未发现应用JS错误。
- 原字节导出在qa-responsive中320四页复测均305=305；实际截图显示长标题/P07正常换行，未裁断，N1长注释桌面行高与引线重排正确。
- 默认静态，CSS animationName非none数0；暂停不适用。

文件：final-export.html是未编辑默认版的真实浏览器下载，25122字节，UTF8 BOM，charset字节50，无压力文本、Sites模块或Sites编辑链接。edited-export.html/json为验收夹具，非默认交付。

限制：CSS iframe宽度不是物理手机；未测试200%浏览器缩放、打印、跨平台字体、OS减少动效。自选墨色只是持久化测试，不代表任意色都通过对比度要求。JSON已实际导出并保存，未另做JSON导入往返；HTML已真实重开验证。

11张内部截图同目录：pi-cover/anatomy/register/time/mobile/mobile-notes/stress-anatomy/bw/stress320/longtitle/longP07.jpg。

Screenshots and temporary edited fixtures are retained separately for verification, not included in this distribution.
