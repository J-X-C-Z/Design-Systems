# MiMo v2.0 应用候选：独立云浏览器 QA

2026-10-11 10:25 UTC，dot云端Chrome，private Site candidates/mimo。功能有限QA通过；这是既有MiMo的应用候选，不是新语言或新版本。人工精修基线、原差/二级保留。未操作canonical文件；实现者另报85文件哈希未变，不把该报告混作浏览器验证。

## 检查和修复
- 四页×1440/768/390/320真实CSS iframe，共16组clientWidth=scrollWidth，320工具展开亦305=305。Enter键盘切页正确，焦点可见。
- 实际目视contact-sheet四页并排、四张完整1440页等比缩小图。大字封面/跨宽索引/居中时间组/窄侧栏短文结构可辨。理性人文及暗黑时间页可读。灰度仍有文字层级；隐藏四条分隔线后textContent不变，四SVG visibility为hidden，事实不依赖线条。
- 初版字号输入112未生效，computed保持104且换肤复原。已报修，input事件修复后真实computed112px；双skin前后文字和线端点/宽度完全一致，显式accent#98643e与112均保留。
- 初版04标题句号单独成行；已修并实际截图确认“齐。”同一行。保留修复前后证据。
- 长标题+4字、特殊字符“潮 <线> & 观察”、各正文追加超过30%；共用mast/disclaimer、页码、时间label保留。测试时间30→45分钟，限定改“适用范围待定，测试修改待核”，同步末页时间文字；最终恢复30。
- 四独立线抽样封面短线：端点20,15到900,15，宽3，绑定accent。其余三线不改；不声称穷尽组合。
- 下载真实JSON/HTML。reset后JSON导入恢复112、45分钟、测试限定、端点/线宽及显式颜色。删除title的真实导出夹具明确拒收，main.innerHTML前后相同。
- HTML原字节经临时HTTP重开，文字/特殊字、字号112、颜色和几何保留；再编辑和实际JSON下载成功。编辑版320四页复测无横溢。
- 清除颜色覆盖在暗黑skin恢复accent#e3af86，字号112保留。随后reset恢复默认。最终raw final-export.html 25,499字节，BOM、charset位置50；默认30分钟、104、理性人文、空overrides，只有themes/model及自有脚本，无注入widget/cursor节点。
- 主内容CSS动画数0，暂停不适用。此静态候选不代表删除MiMo既有运动语言或时间线。

## 视觉及边界
10张内部截图：mm-contact/dark/gray/full01/full02/full03/full04/full04-fixed/stress/stress-mobile.jpg。full页为完整页等比显示，不是1440原像素图。16组检查读序/DOM宽度；截图为代表视图，不声称逐像素全矩阵。未做物理手机、200%浏览器缩放、打印、跨平台字体或完整辅助技术审计。四页的克制信息结构成立，但辨识度和审美是否合用户期望仍需用户判断，不自动升级差评。
