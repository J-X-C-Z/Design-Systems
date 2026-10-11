# Watermelon / Gridline · SP 可编辑样例

5 页原创《北园能源管理试点》项目汇报。项目、楼宇、数字和计划全部为虚构演示。

## 使用

- 打开 `index.html` 可离线预览。逐页预览支持左右方向键。
- 点击“编辑文字”可修改原生文本；点击“导出修改后 JSON”保存 canonical JSON。
- `sp-sample.json` 为 Superior Point canonical schemaVersion 1，不是 PPTX，也不是截图幻灯片。
- 193 个原生 text/shape 对象。柱条和信息表格是独立可编辑对象，不是 SP 数据绑定 chart/table。
- `build.mjs` 是原创 Node.js 生成器，执行 `node build.mjs` 可重建 JSON/HTML/tokens，无 npm 依赖或安装脚本。

## 参考范围

以 Watermelon Platform 的 **Gridline Dashboard 亮色分支**为唯一界面参考。平台包含多种组件与模板，不把 Watermelon 名称宣称为统一独立设计语言。
固定版本：424fe703d19b39e86bef90c4ba0a76ef8c1fb260。

保留白底、浅灰卡片、青色强调、细边框、轻圆角及等宽元信息。改编为演示文稿的标题、数据、表格与计划页；不是网站首页搬运。

## 验证层级

分类保持“三方参考 / 三级”。

- SP main 5314ac9bd71b98e93852ec990146d77c98b7f361：canonical 校验通过，无错误/警告。
- PR3 候选 24ea406fa52df32e3a618ee804af0c0cf1fa7abf：canonical 校验通过，无错误/警告。
- 两版 canonical→editor→canonical 本地模型往返通过，193 对象/全部文字保留。
- 浏览器视觉验收：真实云浏览器桌面及 390px 五页均已检查，未见文字框溢出或横向溢出；逐页模式与前后导航通过。已验证内存文字修改及 Blob JSON 导出，刷新恢复原版。
- **原生 SP 应用导入、画布视觉、编辑保存再导出均未验证。** 本包不宣称全适配，不包含 SP 产品源码或 renderer。
- 不是 PR3 theme package，不引用尚未部署的主题 API；已有显式样式无需主题服务即可保存在 JSON 中。

## 文件

- `index.html` 原创独立渲染器与离线预览
- `sp-sample.json` canonical 文稿
- `tokens.json` 语义色/排印/间距/动效
- `RULE-MAPPING.md` 上游依据与改编取舍
- `SOURCE-NOTICE.md` 归属和许可边界
- `VISUAL-LOSSES.md` 原生适配待核项
- `qa/schema-validation.json` 两版本结构/往返校验结果
- `build.mjs` 原创可重建代码

下载包中不包含 SP 校验器、adapter 或 renderer；校验报告仅记录已完成的本地验证。
