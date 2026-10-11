# Watermelon 源码资源核验

核验日期：2026-10-11。固定提交：424fe703d19b39e86bef90c4ba0a76ef8c1fb260（2026-10-11 08:45:59 UTC）。

## 可直接用于目录的结论

- Watermelon Platform 是 ui.watermelon.sh 的开源展示与发现平台，使用 React、TypeScript、Vite、Tailwind CSS 4、Motion。它不是一个独立设计风格。
- 独立 manifest 共19项：平台入口1项、界面细节规范1项、平台主题 tokens 1项、基础UI组件1项、动效组件1项、页面区块1项、仪表盘样例12项、落地页模板1项。后18项属于同一来源的子资源，不应被统计成18个新供应方或18种新风格。
- 所有条目三级参考；styles为空。未声称适配、安装成功、运行成功、可访问性达标或PPT可用。
- 完整非截断仓库树显示：30个基础组件类别目录、131个动效MDX、22个区块类别、189个区块MDX、12个仪表盘MDX、1个模板MDX。这是文件/目录统计，不是可用性验收统计。

## 真实设计资源

- skills/make-interfaces-feel-better/SKILL.md：排版、同心圆角、阴影、光学对齐、进出场动画、命中区及性能建议。
- src/index.css：Inter Variable、亮暗语义 tokens、黄绿色主色、0.625rem基础圆角、自定义响应式断点。
- 12个仪表盘均已读取MDX和dashboard.css，逐项列出精确主色/圆角定义与提交固定链接。它们是不同业务样例，不能仅凭名称当作12套独立设计语言。
- Landing Page 01 已读元数据和demo组合源码：强制dark、#101010底色，实际含Hero、Stats、Features、Bento、Testimonials和Footer。
- 动效抽样已读Card Split Accordian元数据与base源码、Shimmer Button元数据；Bento 1/2已读元数据。

## 许可与归属

根LICENSE已确认MIT，版权为2026 Watermelon Platform Contributors。复用代码或实质部分应保留版权与许可声明。

仓库copyright页面明确说明部分视觉参考来自其他创作者并以Inspired By归属。Card Split Accordian标注nitishkmrk，Shimmer Button标注Aceternity UI。根MIT不能被解释为已清理所有外部字体、图片、商标或被参考设计的权利。本次只交付原创摘要与来源链接，不搬代码或预览素材。

## 发现的边界

- 细节指南要求不用transition-all、40×40px最小命中区；抽样按钮源码仍含transition-all及小尺寸变体。不能把建议当作已实现的合规承诺。
- portfolio-dashboard与web3-dashboard元数据使用同一task-management-dashboard图片/视频，故manifest不展示这些可能不匹配的缩略图。
- Landing Page 01的install为空，不宣称一键安装已可用。
- 平台CSS包含全局隐藏滚动条，实际使用前需检查可用性。
- 未启动仓库、未安装依赖、未运行所有样例、未做截图验收。所有链接指向已验证仓库文件或目录，不嵌远程运行时。

完整逐项链接与归属见 watermelon-reference-manifest.json。
