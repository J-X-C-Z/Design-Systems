# Switch12 横向溢出：独立最小候选

状态：CSS/DOM 回归通过；真实浏览器几何与点击命中仍待 QA。未改 v191 freeze、公开页、主合集、源码 JSX、类型或合同。

## 结论和最小差异

`src/fourth-selection/index.jsx` 的 SelectionGroup 以原生 `fieldset` 为根，组标题为 `legend.fr7-fourth-heading.fr7-label`。原样式 `.fr7-switch-12 .fr7-label::after` 同时选择三个行内原生 label 和标题 legend。该规则创建空内容、绝对定位、`inset: -.75rem -1.25rem` 的扩展点击区域。

三个行内 label 的最近定位祖先是 `.fr7-check-row { position:relative }`，负 inset 正确覆盖成员行 padding。legend 不在行内，也没有定位祖先；静态源码指向初始包含块，因此其伪元素可能把文档右边扩出 1.25rem。16px 根字号下即 20px。这与 v191 两种宽度均恒定 +20px、组件 preview 自身不溢出、普通 DOM rect 扫描找不到 offender 的证据一致。伪元素不会作为独立 DOM 元素出现在 querySelectorAll/body rect 扫描中。

唯一生产 CSS 变更（原第 89 行）：

```diff
-.fr7-switch-12 .fr7-label::after { content: ''; position: absolute; inset: -.75rem -1.25rem; }
+.fr7-switch-12 .fr7-check-row > label.fr7-label::after { content: ''; position: absolute; inset: -.75rem -1.25rem; }
```

无 overflow:hidden/clip、无 width/min-width 掩盖、无标签截断、无 DOM/语义/API/disabled/form/焦点结构改动。中文文本逐字节不变。fieldset 原生 disabled 与根 form、各成员显式 form/disabled 转发保持原样。

## 已有真实浏览器基线（只读）

来源：`../follow-react-seven-batch04-20261015/release/qa/live/observations-v191.ndjson`，Switch12 default/disabled/long 各两宽：

- 390 viewport：document clientWidth=375，scrollWidth=395。
- 1440 viewport：document clientWidth=1425，scrollWidth=1445。
- preview clientWidth=scrollWidth；`switch12_overflow_diagnosis` 的 DOM offenders=[]。
- 修前截图：同目录 `mobile-switch12-overflow-before.png`。

本候选未测修前/修后 computed pseudo style，以上包含块原因仍是由源码和 20px 现象支持的高置信推断，不冒称浏览器已证实。

## 已完成的候选验证

1. `node --max-old-space-size=256 tools/test.mjs fourth-selection`
   - exit 0；1147 scenarios / 2868 assertions；18 native fields / 8 canonical IDs。
   - React 19.3.0；jsdomWarnings=[]；stderr 0。
   - 完整既有成员 ownership、取消、异常恢复、reset、ref、disabled/readOnly、form 关联和七主题静态色值断言保留。
   - 在基线 1143 scenarios / 2813 assertions 上新增 4 scenarios / 55 assertions。
2. `node --max-old-space-size=256 tools/switch12-selector-regression.mjs`
   - exit 0；4 cases：default、disabled、长中文组/成员标题、member label:null。
   - 同一真实 React DOM 上运行修前/修后 CSS selector：旧规则 4/4 命中 legend；新规则 0/4。
   - 有 label 时三行 label 正确命中；label:null 时无误生伪元素且仍保留 3 个 native switch。
   - 记录修前与修后元素标签、slot、关联 input ID、全文中文，不读取/模拟布局。
3. `src/fourth-selection/index.jsx` 与基线逐字节一致。

证据：
- `evidence/2026-10-15T07-20-36-291Z-fourth-selection/SUMMARY.json`
- `evidence/switch12-selector-regression.json`
- `evidence/changed-files.json`

JSDOM 只证明 selector scope 与语义/行为回归，不能证明真实几何、绘制、命中区域、可信键盘或屏幕阅读器行为。

## 合并边界

应用 `switch12-overflow-fix.patch` 只会修改：
- `src/fourth-selection/styles.css`（1 条选择器）
- `tests/fourth-selection-tests.cjs`（旧断言收窄及新增针对性回归）

独立诊断脚本/本说明和 evidence 可随合并候选复制。此目录的其余 src 文件是只读基线的本地测试副本；继承的 author/source/hash 元数据不是新 freeze 证据，应由合并候选统一重新生成构建、打包和冻结记录。本目录使用已有 node_modules 的只读依赖链接，未安装、联网、构建发行包或发布。

## QA 必须复验

1. 独立新候选页，在同一浏览器用 390×844 与 1440×1000 跑 Switch12 default/disabled/long 6 组，记录真实 innerWidth/document clientWidth/scrollWidth/body 宽度/preview 宽度。验收要求 document scrollWidth≤clientWidth+1，preview 也无溢出；不要求 clientWidth 固定等于修前数值，因为移除错误 overlay 可能改变滚动条出现条件。
2. 同页运行 `tools/switch12-browser-diagnostic.js` 的只读表达式。修后 legend ::after 必须不生成（content none/normal）；三个真实 label ::after 保留 absolute 和四边负 inset。若可回读 v191，记录其 legend ::after computed style 作为因果链前半段。不要通过注入 CSS 修改已冻结公开基线。
3. 截修后手机图，长中文完整换行、三行分割线和图标/开关可见，无裁切。检查页外点击没有覆盖层拦截。
4. 两宽默认态分别点三行文字和左/右/上下 padding，各次只切换本行一次，不误切邻行；label:null 使用原生 44×44 输入区域且不错误扩展 legend。disabled 态三行不得切换。
5. 真实 Tab/Shift+Tab 依次到每个 enabled switch，Space 切换，焦点环未裁切；disabled 被跳过。确认宿主受控接受/拒绝、readOnly、reset 基本回归。
6. 独立消费者复验外部 form 与成员 override、fieldset disabled/form 仍正确；运行合并候选全套测试/类型/打包一致性。不得将其他组件检查结果自动记入本修复。
