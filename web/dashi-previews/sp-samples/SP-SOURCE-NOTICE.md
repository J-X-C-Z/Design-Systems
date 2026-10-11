# SP 样例转换来源与修改说明

日期：2026-10-11。

发布暂停：后续查明SP原创代码未指定开源许可证。SP源码、通用HTML及相关预览暂不再分发；下文记录其本地使用与验证事实，不构成公开再分发许可。详见SP-LICENSE-REVIEW.md。

## Dashi 来源

- 固定源：chuspeeism/dashi-ppt-skill，commit 21dc7e5fc8c3a0d7f6a94948153dd1ee954f4e64。
- 采用源的 variant-materializer.mjs、variant-contract.mjs 与 bespoke/theme-profiles.mjs 对当前 goal.json 的真实v4进行内容物化。
- sp-tools/convert-bespoke.mjs 是本次新增的离线转换程序。其12×8网格、元素层级、card/text/chart规则依据同commit的 BespokeSlide.jsx；保留上游AGPL-3.0来源声明与根目录LICENSE。来源文件和本次修改须随本任务源码包保留。
- sp-tools/measure-bespoke.js 是本次新增的只读DOM测量程序，仅对已获授权渲染的页面读几何与文字，不联网或写页面。
- 没有拷贝、下载、执行或分发Dashi专有PPTX组件。未运行原始preview server、runtime-assets或renderDeck路径。

## Superior Point 来源

- 固定main：5314ac9bd71b98e93852ec990146d77c98b7f361。
- 固定PR3候选：24ea406fa52df32e3a618ee804af0c0cf1fa7abf。
- sp-validation中列明的Core、adapter、visibility及通用HTML renderer文件均按固定源读取且未修改。每文件的上游Git blob SHA与精确本地字节核验结果记录在SOURCES.json。
- 本地旧发布目录仅用于读取原生renderer静态实现，以及复用一份经Git blob SHA逐字节验证与固定main完全相同的MIT reveal-bundle.js。旧发布代码没有被当作当前Core/adapter运行。
- Reveal版权与MIT许可全文见sp-validation/main/vendor/REVEAL-LICENSE。生成的sp-generic-preview.html含该固定版Reveal播放代码。

## 制品边界

- sp-sample.json是可编辑canonical文稿，3页仅对应v4，不是完整Dashi模板库。
- sp-generic-preview.html和sp-generic-*.svg由固定main官方通用renderer生成；其字体、排版、图表能力有限。PNG是既有Inkscape对该SVG的栅格化，不是原生SP编辑器截图。
- sp-mapping-report.json记录原始composition、全部对象映射、校验和视觉损失。已量测的主题另含源DOM事实。
- 未修改SP产品或既有项目，未发布主题，未写远端产品，未声称PR3已部署。
- 本说明记录来源和实际操作，不声称已完成上游缺失优选修改源码、所有再分发许可或原生/PPTX保真核验。


## 本独立分支的公开范围

转换源码 ZIP 已按本次归档要求剔除所有 `vendor-work` 文件，仅保留原创适配器与冻结内容；缺少上游构建依赖，不能据此宣称可独立重建。原重建报告属于剔除前的隔离输入。详见 [ARCHIVE-SCOPE](../ARCHIVE-SCOPE.md)。原生 SP 导入、编辑、保存重开与 PPTX 保真仍未验收；本次仅独立核对结构、链接和公开文件哈希。
