# 摄影专题 · 独立云端浏览器 QA
2026-10-11 08:12 UTC，dot 云端 Chrome。仅本候选；原“差”评价与适配二级保留。

## 结果
所测范围通过，无未解决阻塞。

- 四页×1440/768/390/320真实CSS iframe共16状态均无外页横溢出；client=scroll为1425/753/375/305。320展开图像/裁切/导出工具也305=305。
- 实际截图分别确认：01黑底侧标题及摄影主图；02小完整幅与大局部比较；03三阅读柱；04黑白两半、右侧尾图。黑白检查后04仍保持两半构图，窄屏依读序重排。
- 四个图像视图均complete且naturalWidth>0。A三个视图源一致；完整幅与局部的渲染图像宽高比约1.333，与原图4:3一致，没有拉伸。完整幅确实显示源图四边，局部从同一源图裁切。B仅结尾使用，图注明确独立且无时间/地点关联。
- 每个图像旁可见AI生成、非现场说明；每页有虚构计划/暂无实测结果。图片未伪装点位数据。
- 真实替换A为本项目B文件测试：三个A同步1536×1024且同源，alt均降级为用户提供、来源与图意待核；B保持原身份。reset后三个源精确恢复原值。
- 所有data-edit字段（固定disclaimer除外）实际修改。标题增加4汉字；正文、导语及结尾说明各追加30字，超过20%；四图注正文翻倍；比较标题改为“潮 <线> & 观察”；其他标题/文案附校核标记。压力文本仅验收夹具。
- A局部x/y/宽/高改为0.35/0.25/0.5/0.5，实际截图显示裁切变化而原幅不变。
- 真实下载edited-export.json/html。reset后通过真实filechooser导入JSON：所有修改文字、原图、裁切关系完整恢复，4图loaded，A同源。原字节HTML经HTTP重开，中文特殊字符、图片及crop仍完整；再编辑结尾标题后成功下载reopened-export.json。
- 压力版320四页均305=305；实际截图显示双倍图注正常换行、完整图保留、特殊字符正确。桌面长文及黑白结尾保留结构。
- 四页均经键盘Enter访问；默认静态，暂停不适用。

## 文件
final-export.html为默认主页面未经编辑的真实浏览器下载：6,520,620字节，UTF8 BOM、charset字节50，原图只存2份PNG数据；无校核文字、Sites编辑链接或私有聊天URL。可离线使用，需要JavaScript恢复图片视图。

edited-export.html/json与reopened-export.json为内部测试夹具。7张实际浏览器截图同目录：ed-opening、ed-comparison、ed-article、ed-closing、ed-export-comparison、ed-mobile-stress、ed-bw-closing。

## 限制
CSS iframe不等于物理手机；未验证200%浏览器缩放、打印、跨平台字体或OS减少动效。不存在颜色编辑控件，本轮不宣称颜色修改测试。素材已独立检查原像素，底层图像模型未显示，不能称已确认image2.5。作者来源记录不是视觉验收证据。

Browser screenshots and temporary edited fixtures are retained separately and excluded from distribution.
