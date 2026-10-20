# React 首切片：7 个标量组件

本目录提供真正 React JSX/state/ref/effect 组件，不调用既有 native mount。父级负责 React 19.3.0、构建器、Provider 和打包。当前仅完成静态候选，作者测试尚未运行，未取得浏览器或独立验收。

## 组件与结构

- `Button01`：一个主按钮，默认“默认按钮”。
- `Button02`：两个 outline 按钮，左箭头“上一步”及“下一步”右箭头；独立事件和 ref。
- `Button03`：secondary“放弃”与 primary“保存”；没有实际保存业务。
- `Checkbox01`：一个原生 checkbox 及右侧 label，默认关闭。
- `Switch01`：一个原生 checkbox role=switch 及右侧 label，独立开关轨道；默认关闭。
- `InputMask01`：label、左侧装饰身份图形、AA99 AAA 固定槽输入、说明。
- `Textarea01`：一个原生 textarea，默认没有可见 label/helper；384px 是宽度上限，最小高度64px，不是384px高度限制。

固定 upstream commit 为 `424fe703d19b39e86bef90c4ba0a76ef8c1fb260`。7 variant、5 index元数据和10 primitive/lock/license文件逐件复核22个Git blob，见 `source-hashes.json`。源 MIT 声明保留于 `sources/primitives/LICENSE`。只读参考当前456合同的精确路径/hash记录在 `sources/native-reference.json`；旧结果不作为本React候选的验收。

## API

从 `index.jsx` 导入7个命名导出，同时加载 `styles.css`。Provider不是硬依赖；组件支持约定 `--fr-*` tokens及独立Follow默认色。实际类型见 `index.d.ts`。

标准原生属性和 React 事件直接保留。所有ref指向真实原生控件；Button02/03的顶层原生属性/ref属于第一按钮，第二按钮使用 `nextProps/nextRef` 或 `saveProps/saveRef`；容器属性用 `groupProps`。默认按钮 `type="button"` 是避免示例误提交的明确增强，显式 `submit/reset` 保留原生行为。`onClick`不会被私有动作回调覆盖。`readOnly`及`aria-disabled={true}`或字符串`"true"`阻止按钮激活但保留焦点；`false/"false"`不阻止。

文本使用 `value/defaultValue/onValueChange`；布尔使用 `checked/defaultChecked/onCheckedChange`。defined值受控，文本null表示受控空值；undefined释放最后有效值。default仅建立挂载时reset基线。改变 `ownerRevision` 明确表示即使同值也要重申owner命令；普通同值props重渲染无法与metadata更新区分，保持草稿而不猜测命令。这个边界不同于旧native的显式update patch。Mask释放策略也明确改为保留最后有效值，旧native会退回defaultValue。

`label/help/error`自动关联ID；可同时补调用方aria-describedby。`error`只是显示/ARIA，不是虚构的服务端校验。disabled是真实原生禁用并从FormData省略；readOnly文本使用原生只读，checkbox/switch另加只读激活保护但仍可聚焦和提交。

## 事件、owner 与输入法

普通文本输入的原生React onInput/onChange照常触发，onChange先于onValueChange；onChange.preventDefault可否决该提案。checkbox原生onClick/onChange先于onCheckedChange。提案回调的return/promise不等待，也不作为否决；回调内preventDefault不否决model，受控拒绝使用owner保持原值。异常正常上抛，中断的提案不提交。

React已提交的同步owner写回/释放、禁用、只读、替换、卸载会使旧事件工作失效；普通批处理setState在提交后生效，不虚称调用setState那一刻已经换owner。节点不会因label/error等更新重建，无自动focus；选择区恢复仅在字段仍拥有焦点时执行。

IME中间文本保留为DOM草稿，提案延迟到一次compositionend。旧会话被owner命令或有效reset取消后，旧end/input尾不能覆盖新owner；新非composition beforeinput/paste或新compositionstart恢复输入。标准onBeforeInput仍遵守React合成事件机制；现代原生beforeinput另提供`onNativeBeforeInput`，在内部编辑前可preventDefault。该原生事件在document冒泡观察，target是字段，currentTarget是document。

真实OS输入法、剪贴板、自动填充和浏览器事件排序待测。没有新beforeinput/compositionstart的旧式输入工具可能被取消会话屏障继续阻挡，不能宣称全平台IME等价。

## 原生表单与reset

四个字段都是真实成功控件，支持name/form/required等属性。reset在document捕获观察，默认动作后微任务按当前input.form、owner和新编辑意图协调；事件内普通编辑先于reset，返回后新编辑或新composition优先，包括同模型值的真实input/click意图。受控恢复当前owner，非受控恢复初始default；reset不发送change回调。

取消仅承诺reset分发期间preventDefault。每个reset独立排队，覆盖有效/取消四种双reset组合。换表单后旧任务不重置新归属字段；销毁、StrictMode重放、同模块已观察到的reset中替换都有代际保护。新节点defaultValue/defaultChecked初始化为有效默认值。

已知集成限制：保存reset事件并在reset返回后才preventDefault，可能在原生默认动作已执行后改变canceled flag，导致DOM/model暂时分裂；不拦截全局Event.prototype/form.reset。更早stopImmediatePropagation使观察器错过事件也不在保证范围。microtask前不承诺同步reset返回即完成model协调；跨模块替换和任意祖先阶段组合不宣称穷尽。

## Mask精确已实现与未核差异

格式是7个固定槽和第4位后的空格；非空不完整值用下划线，空值保持空。现代beforeinput插入/前删/后删、选择替换、paste和100步局部undo/redo真实实现；这些编辑调用onValueChange，不伪造React onChange/input事件。标准onPaste/onKeyDown/onBeforeInput仍保留。fallback input整串格式化，caret和特殊输入可能与完整依赖不同。

字符规则是独立适配政策：A槽采用单UTF-16单元BMP范围 `[A-Za-z\u00c0-\u00ff\u0400-\u04ff\u00b5]` 且大写不能扩展；9槽采用单BMP Unicode Number。范围来自既有作者纯编辑器，不是这轮重新核实的Inputmask定义；补充平面码点和多字符大写拒绝。不要将这个范围或原生编辑器称为Inputmask完整运行等价。

lock固定use-mask-input3.14.2，但完整依赖源码/运行时未取得。本轮按父级安排不新发该依赖请求。A/9完整token、焦点mask呈现、clearIncomplete/unmask、原依赖caret/IME/undo仍open；消费者不需要安装该依赖。源没有应用层完成校验，因此不额外制造必填/完成错误。

## 可见夹具与测试入口

`examples.jsx`导出`ScalarExamples`，提供受控/拒绝、disabled/readOnly、取消reset、ownerRevision同值命令、卸载重挂、真实reset及本地submit事件按钮。只显示动作次数，绝不打印输入值。父级可将其放入七主题Provider检查长中文、浅深色和焦点。

`tests/scalar-tests.cjs`入口：

`async run(window, React, createRoot, assert, components)`

components由父runner注入已编译导出，并包含`__flushSync = react-dom.flushSync`。测试自己不require JSX、不编译、不安装依赖。使用development React.act；父runner负责安装JSDOM全局与资源限制。测试涵盖逐源结构、ref/原生事件、受控/释放、原生form.reset、双取消组合、归属、替换、同步owner、IME取消尾、焦点接管、callback异常及StrictMode。

本目录目前0次Node执行、0浏览器验收。所有测试只编写，不写成已通过。父级可串行执行后另记精确hash/日志。

## React30 修订

标准onChange抛错时回绘最新已接受状态，错误仍传出；标准onClick的取消标记跨React SyntheticEvent传至原生change链，阻止内部checked提案。后续正常操作恢复。最新共享标量作者202场景/497断言；本次浏览器仍待验。旧194/465为前一版本记录，不能替代本次范围。
