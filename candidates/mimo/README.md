# MiMo v2.0 · AI应用候选

打开mimo-application-editable.html，离线阅读和编辑四页。它属于同一MiMo，不是新语言或新版本。唯一canonical为languages/mimo/v2.0，本包不复制其85份文件。基线人工精修标签、原差/二级均保持。

四页支持中文编辑、独立线条参数、双skin、显式颜色与标题字号覆盖保护、JSON/HTML导出回读。默认静态，不修改MiMo原有运动语言、可选布局/组件和共享资源规则。

真实QA及边界见QA-RESULTS.md，canonical哈希一致见CANONICAL-INTEGRITY.json。未测真机、200%缩放、打印和跨系统字体，不因功能通过自动升级效果评价。

构建：python source/build.py --canonical-root /你的仓库/languages/mimo/v2.0。仅仅读取kit/design-language.json。最终主HTML保持真实浏览器默认下载字节。
