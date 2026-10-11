# Gridline → 演示文稿映射

固定源目录：https://github.com/WatermelonCorp/watermelon-platform/tree/424fe703d19b39e86bef90c4ba0a76ef8c1fb260/src/data/contents/dashboards/gridline-dashboard

| 规则 | 已读源码依据 | 样例处理 |
|---|---|---|
| 主色 | dashboard.css: --primary、--ring = #0ab1ba | 柱条、序号、焦点环使用原值。小字使用原创加深色 #08747a，以免白底青字对比不足 |
| 明暗层次 | background白、secondary oklch(.97 0 0)、border oklch(.922 0 0) | 白底、#f5f5f5卡片、#e5e5e5细线；只适配亮色分支 |
| 卡片 | dashboard-content.tsx: bg-secondary、shadow-none、ring-0、rounded-xl、gap-4/6 | 12px圆角、24px间距、无卡片投影。外部预览页阴影不是文稿内容 |
| 排印 | 平台 Inter Variable；工作区标题 font-medium、tracking-tight；元数据 font-mono | 中等字重无衬线标题、等宽数字与索引。离线系统字体回退，未分发 Inter |
| 版式 | 工作区网格与详情侧栏 | 5 页：疏朗封面、KPI+条图、中高密度表格+侧栏、四周计划、评审建议 |
| 状态 | flexibility-dashboard.tsx: primary/10选择态、颜色标记、圆角详情标签 | 青色浅底标记；“补齐数据”用琥珀色并附文字，不单靠颜色表达 |
| 分隔线 | border-b、border-y、详情dl分组 | 顶/底规则线、表格行线、详情分组 |
| 动效 | 源码 transition-colors/transform/opacity；平台细节指南推荐克制动效 | HTML自定义180ms短入场，关闭 reduced-motion；canonical静态，未假称动画一致 |
| 图表 | 源分支是资产管理工作台，非本样例的业务数据来源 | 月度条图为原创编排与虚构数据，遵循同一语义色和排印；不宣称复制某个上游图表 |

上游 flexiblity 页面使用 networkBasemapUrl 外部地图，本交付没有复制。无照片、商标、图标字体或第三方插画。
