# React 第二批：4 个披露控件

精确 ID 为 tabs-02、tabs-03、accordion-02、accordion-03。源码来源逐文件固定在 source-proof.json，MIT许可随目录保存。

```jsx
import {Tabs02,Tabs03,Accordion02,Accordion03} from '@follow-ui/react-seven';
const [active,setActive]=useState('deploy');
<Tabs02 value={active} onValueChange={next=>setActive(next)} />
<Tabs03 activationMode="manual" />
<Accordion02 defaultValue={['item-1','item-2']} />
<Accordion03 disabled />
```

共享 props：items、value/defaultValue、onValueChange、disabled、label、className、onKeyDownCapture。Tabs另有dir和activationMode。onValueChange的details含本ID、previousValue、controlled、reason和event；返回false可否决未受控请求，受控模式以父值为准。回调抛错不被吞掉。

Tab02是部署流程三标签；Tab03是三图标信息流，窄屏视觉隐藏标签但保留可访问名称，宽度上限28rem。Accordion02是分隔卡片，Accordion03是金融说明主题图标列表；均multiple，初始第一项展开。此中文内容仅演示，不处理交易。

item.content缺省或null使用before/emphasis/after；显式空字符串和undefined保留空值。items替换仍保持同key节点和内容，元数据更新不当作重置。各个触发器type=button，不承担HTML表单字段reset行为。禁用触发器不可请求；键盘组合/IME键不拦截。减少动态按系统或Provider策略执行。

当前作者React/JSDOM25组196断言通过；检查范围见contracts/next-disclosure.json。实际浏览器布局、默认键盘行为、读屏和完整矩阵未验；不继承旧native验收。后续独立审核以发布摘要为准。
