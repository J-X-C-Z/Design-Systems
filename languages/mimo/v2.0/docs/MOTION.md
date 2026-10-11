# MiMo-inspired 2.0 · 动效语言与资源规范

> 个人原创设计发布。这里的名称、曲线、时长和实现均是本资源库的设计决策，不是小米官网动画代码或测量值。核心是运动语言，十个实例是可复用词汇，不是必须执行的页面脚本。

## 1. 运动为何存在

**让变化能够被理解，让对象保持身份，让人的操作得到真实回应。**

研究内容中的运动表达证据与结论、层级与因果；开发者界面中的运动解释选择、复制和运行状态；工作区中的运动帮助定位任务变化，但不争夺工作本身的注意力。两分支共用这些意图。暗黑科技不是把一切加上发光；理性人文也不是把所有运动变慢。

一次运动应能说清：什么发生了变化、哪个对象仍然是同一个、什么时候信息已经完整可读。没有这些语义时，静态通常更好。这是设计判断，不是禁止艺术性表达；发布叙事可以更大胆，只要用户明确需要。

## 2. 时间、空间和编排

个人版本采用 160 / 280 / 520 / 900 ms，分别对应微反馈、局部状态、信息揭示与叙事连接。它们是参考节奏，不是法律式限制。单个示例可调至 1–5000 ms，空间幅度可在 0–2 内调节；复杂作品可以使用别的引擎建立更长的独立时间线。

默认收束曲线为 `cubic-bezier(.22,.75,.2,1)`；路径进度在示例中使用线性时间，避免数据推进速度看起来包含虚构停顿。运动优先沿阅读方向或已有对象关系展开；不假设所有语言都从左向右。反向方向参数仅在支持的位移动效中生效。

不要同时让两个独立时间线控制同一对象的同一 transform。可以使用包裹层分配职责，也可以让一个合成器统一控制。布局变化的起终点由作品决定，主题不替作品虚构内容。关键文字在关闭动效时依然可访问。

## 3. 五种标志性资源

| 资源 ID（省略 mimo.motion.） | 表达与适用场景 | 必需挂点 | 个人默认 | 可改造的方向 |
|---|---|---|---:|---|
| `index-trace` 索引描线 | 编号与细线一起建立阅读起点；章节、目录、证据分组 | `rule`, `index` | 520ms | 线条长度、展开轴、编号方向；不要逐段滥用 |
| `type-unfold` 文字展开 | 让整行或词组从结构中显露；封面和关键观点 | `headline` | 520ms | 揭示边界、段落层次、幅度；不强制逐字动画 |
| `evidence-flow` 证据流 | 路径建立联系，节点随后获得强调；过程与因果 | `trace`, `node1`–`node3` | 900ms | 路径形状、节点数和节奏需由作者在源码扩展；不可随意颠倒真实因果 |
| `focus-aperture` 焦点开窗 | 保留周围语境，打开局部观察区域 | `aperture` | 520ms | 焦点中心、遮罩形状、静态替代；关键内容不要永久藏在遮罩里 |
| `quiet-reframe` 静默重构 | 保持同一个对象身份，同时改变其上下文 | `reframe`, `context` | 520ms | 位置、比例、容器关系；这不是换肤的默认副作用 |

“标志性”指此语言对常见技术的原创组合与调校，不声称这些浏览器技术只有 MiMo 能使用。上述挂点可绑定任何内容，不要求照搬示例的标题、卡片或图形。

## 4. 五种共享反馈资源

| ID | 功能语义 | 挂点 | 默认 | 使用边界 |
|---|---|---|---:|---|
| `directional-hint` | 提示行动方向 | `arrow` | 160ms | 键盘焦点也需要反馈；触屏不依赖 hover |
| `surface-resolve` | 区分浮层与底面 | `surface` | 280ms | 显示层级，不将整个页面反复抬升 |
| `command-confirm` | 表达已完成的操作 | `check`, `confirmation` | 280ms | 实际操作成功后才使用；动效实验台明确只是样例 |
| `state-relay` | 当前步骤与后续步骤之间的接力 | `progress`, `state1`–`state3` | 900ms | 示例进度不是服务端进度；文字状态不可缺少 |
| `data-reconcile` | 旧数据与新数据之间的连续变化 | `bar1`–`bar3` | 520ms | 实际产品需绑定真实数值和坐标；样板只演示形变 |

两个分支可以使用同一运动资源。它默认继承所在容器的语义颜色。需要保留来源外观时，将资源放入显式分支容器，而不是让整个作品继承另一主题。

## 5. 生命周期和可控制性

`kit/motion.js` 使用浏览器 Web Animations API。每个 root 同时由一个控制器管理；对同一 root 再次调用会取消上一次动画，避免快速切换形成堆叠。

| 操作 | 行为 |
|---|---|
| `play()` | 从当前时间继续；位于终点时重新开始 |
| `pause()` | 停止时间推进，画面保持当前状态 |
| `seek(0…1)` | 暂停并定位归一化进度，供编辑与精确对照 |
| `reset()` | 回起点；减少动态效果模式下保留完整终态 |
| `finish()` | 显示完整终点并暂停 |
| `cancel()` | 销毁此控制器创建的动画，回到基础 DOM/CSS 呈现 |

本展示台默认不自动循环。切换示例前取消旧控制器；标签页隐藏时暂停；操作系统切换到减少动态效果时展示最终状态。离开页面的实际产品应调用 `cancel()`，不让离屏对象继续耗费资源。

## 6. 复用示例

```html
<link rel="stylesheet" href="kit/tokens.css">
<link rel="stylesheet" href="kit/mimo.css">
<section class="mimo-scope" data-mimo-mode="light">
  <div id="chapter">
    <span data-part="index">01 / RESEARCH</span>
    <div data-part="rule"
      style="height:1px;background:var(--mimo-ink);transform-origin:left"></div>
  </div>
  <button id="replay" class="mimo-button">重播章节动效</button>
</section>
<script src="kit/motion.js"></script>
<script>
  const root = document.getElementById('chapter');
  let playback;
  document.getElementById('replay').addEventListener('click', () => {
    playback = MimoMotion.play(root, 'index-trace', {
      duration: 520, amplitude: 1, autoplay: true
    });
  });
  window.addEventListener('pagehide', () => playback?.cancel());
</script>
```

完整目标结构可从 `kit/motion-examples.json` 读取。路径示例使用 `pathLength="1"` 和归一化虚线参数；线条需要适当 transform-origin。`targets` 不是运行时参数：当前实现通过 root 内的 `data-part` 绑定目标。需要不同目标数和新的组合时，修改原始 SVG/DOM 和对应编排，或在产品适配层实现新的资源，而不是向不存在的通用参数传值。

## 7. 参数与实现边界

实际 options 为 `duration`、`amplitude`、`direction`、`autoplay`、`reduced`、`onUpdate`。duration 统一作用于示例，amplitude 只调整已有平移动画；它不会改变开窗的圆形半径、图表真实数据或节点数量。direction=`reverse` 只反转已有方向参数化的位移，不意味着时间线倒放。

`onUpdate({progress, playing, duration, id})` 可同步进度条；回调应轻量且不抛异常。无匹配挂点会跳过该子动画，因此接入者应校验结构；库不执行任意用户上传的 JS。当前提供的是 DOM/SVG 实现和资源描述，**不是任意时间线 JSON 的通用执行器**。

`prefers-reduced-motion` 为 reduce 或祖先 `data-mimo-motion="reduced"` 时，播放与重置立即显示终态。调用方不得使用 `reduced:false` 强制覆盖系统偏好。编辑器的逐帧检查可以调用 seek；面向最终用户的展示台在减少模式下禁用空间轨迹拖动，始终保留终点信息。

## 8. 对强模型的开放边界

模型可以创造新的路径、材质、空间关系和时序，不必使用这十种效果。继承应保留设计语义，不是复制秒数。面对特殊科学图解或叙事，允许更复杂的工具，但要单独管理运行依赖、可暂停性和离线打包。

效果完成的判据是内容逻辑清楚、控制可靠、降级不丢信息。不是“每页都加了一种动效”。
