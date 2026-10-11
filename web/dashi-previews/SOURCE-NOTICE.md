# 来源、许可与 HTML-only 修改说明

上游：chuspeeism / Dashi PPT Skill 0.4.14。
固定 Git commit：21dc7e5fc8c3a0d7f6a94948153dd1ee954f4e64。
来源：https://github.com/chuspeeism/dashi-ppt-skill/tree/21dc7e5fc8c3a0d7f6a94948153dd1ee954f4e64
主体许可：GNU AGPL-3.0，完整文本见 LICENSE。上游署名与许可保留。

## 实际采用

- 固定版的布局查询、内容 scaffold、schema 验证、内容投影及真实 React 主题组件。
- 固定版的受限 bespoke composition 渲染器和主题配置。
- 本次单独编写的中文演示内容，不引用用户私有事实或第三方业务数据。
- 2026-10-11 编写的 render-html-only.jsx：仅服务端渲染真实组件到静态 HTML，并捕获组件原本运行时注入的共享 CSS（只允许 style 节点）；阅读外壳支持等比缩放、方案跳转和独立可读内容。没有伪造模板页或改变真实组件视觉代码。

## 修改与省略

- 为避免依赖上游巨型登记产物，将 generated-metadata.js 改成逐个导入其原始 metadata.js 的等价登记模块；保留12主题及1020条登记。
- 不调用原始 renderDeck / runtime-assets / preview server；其默认路径会捆绑专有导出组件。
- 不下载、不分发、不执行 html-deck-to-pptx 或 editable-pptx-browser 及其派生导出 bundle。
- 交付 HTML 不含 React runtime、Dashi 编辑器或专有导出 JS；它包含本次实际生成的标记、样式和原创轻量阅读脚本，其内容可直接通过 HTML 源码查看。
- 不提供编辑自动保存、原生3+1编辑控件、PDF/PPTX导出或动态舞台/磁吸/声音交互。静态画面不会证明这些能力。

## 对应源码范围

本次使用的上游文本模块和修改过的适配器保存在源码目录；固定版上游仅分发 minified theme modules，没有完整逐页 JSX 优选修改源码。本次提供实际采用文件与修改，并明确不声称已找回缺失源码或完成所有再分发法律核验。公开再分发完整运行时前，须解决该源码范围；私有网站不作为许可豁免依据。

React 18.3.1 / react-dom 18.3.1（MIT）、tsx 4.20.0（MIT）、esbuild 0.28.0（MIT）仅用于隔离构建，npm以 --ignore-scripts 安装；不将依赖代码嵌入静态演示。安装锁文件保留于源码目录。没有下载或分发字体，系统替代字体可能改变排版。

## 产品边界

Dashi HTML 预览、SP可编辑样例、SP候选theme包是三类独立制品。HTML可打开不代表SP主题安装；SP JSON可解析不代表编辑器保真；主题包通过验证不代表PR3已合并或部署。

### theme01 浏览器精修

真实云浏览器发现并修正：SSR遗漏组件共享CSS；浅色面板inverse指标低对比；收束页长句在目录模板溢出。保留真实组件代码，使用原生content projection重新选定兼容的浅色模板，缩短本次原创短文案；v4受限composition将浅底inverse墨色改为default，并补充独立designIntent。收束页不再把步骤序号作为统计图数据。原生核心materializer/validator未修改；精修脚本另行提供。

### theme02 SSR CSS 补足 · 2026-10-11 15:06 UTC
此主题基础样式原来由仅注入 style 的 React effect 添加，SSR 不运行 effect。静态提取固定模块内 Jd CSS template literal（仅已核实插值 C=gxn-theme）补入生成标记；没有运行交互 effects、编辑器或导出代码。提取器与提取 CSS 一并提供。内嵌 style 的 React 字符实体还原为原始 CSS 字符，保持原规则。Takeaways 的放映态内容列不能用于只读初始态，因此以兼容真实 Roadmap 模板替换，保留三项必需百分比事实。

### 共同显示范围 · 2026-10-11 15:27 UTC
所有预览都保留上游组件结构，但未分发上游字体、媒体或编辑器运行时。字体由当前浏览器系统回退提供；字体字宽与未来SP环境可能不同。图表单位与分类/趋势语义逐主题审阅，不能仅以上游schema通过判定正确。读屏/全级别对比度与实体触控未完整认证；窄屏提供canonical正文。主题03替换百分比钳制仪表，主题04缩短竖排注释并将分类口味折线改成受限bar composition，均有独立补丁源。

### theme05 原始默认文案排除 · 2026-10-11 15:45 UTC
固定投影会在不匹配的数值模板里保留金融默认单位/数字。先对60组候选做静态文案审阅，再以原创虚构阅读点数及工作时长填充完整canonical数值/单位，选择能无残留承载这些字段的真实模板；未改上游投影/模板代码。每逻辑页保留三个不同结构，未以多个近同构章节页补数。渲染适配器同时把完全重复CSS块去重并按最后出现顺序放入head，保留最终级联顺序，避免同主题300KB样式重复9次。

### theme06–08 内容结构修正 · 2026-10-11 16:11 UTC
深色图谱主题缩短竖向收束短文案并保留18/9/4天单位。冷白调研主题浏览器发现quote类中央正文未投影，改选真实章节/目录/分析结构；去除固定百分比单位和不适合分类评分的折线选型，增加三条可绑定复核行动。黑金实验主题排除未呈现必需数据的模板，保留实际黑黄/浅紫模板分支与独立黑金bespoke分支。上述均为本次原创canonical内容、模板选型与受限composition调整，未改原始模板视觉属性。各独立refine脚本和goal记录修改。

### theme09 注册背景恢复 · 2026-10-11 16:20 UTC
首轮真实浏览器发现白底使原生白字不可读。根因是独立HTML壳没有带入该主题的metadata.bgClass；12主题中只有09登记bg-deep/bg-night/bg-electric/bg-blue。适配器现在原样转接该字段，theme09-static.css只包含固定assets/template-swiss.html的四条原始背景CSS规则。规则未重新配色，未引入其导出脚本或字体。对应固定来源：https://github.com/chuspeeism/dashi-ppt-skill/blob/21dc7e5fc8c3a0d7f6a94948153dd1ee954f4e64/skills/dashi-ppt/project/assets/template-swiss.html 。先前八套bgClass为空，保持既有渲染结果。

### theme11 导航字段分类补丁 · 2026-10-11 16:43 UTC
固定版layout-query把navItems和所有数组一起当作业务事实区域，只有1个cover、2个metrics候选可装下本次3必需项，无法满足3+1。补丁仅对theme11的navItems排除主要内容候选和businessArrayRegions判定，保留其原始默认文本、数组长度、navCurrent与布局；没有放宽必需事实、数值、schema或3结构要求。修改模块、上游原模块及diff均提供；NAVIGATION-PATCH-QA.json证明其他11主题候选/投影完全不变，新11候选24/26/25。原生导航标签与硬编码页脚页码属于源模板结构，不作为本样例实际页码；阅读器12项单独标示本次方案。

### theme10 样式字面量补足 · 2026-10-11 16:51 UTC
独立浏览器实拍发现只有定制页正确，原生模板族CSS由React effect注入，SSR只捕获了部分基础样式。extract-theme10-css.py对当前实际8个模板族（vnn/pcp/st/hiv/sch/mx/stp/ckl）提取固定模块中的原始CSS template literal，共约18KB，逐项确认零插值、零转义依赖；遇到未审阅插值即停止。没有执行effects、安装脚本或交互运行时。原始CSS与提取器一并提供，后续以新浏览器截图验证结果。

### 最终浏览器收口 · 2026-10-11 17:02 UTC
theme10最终选择7个CSS族，共约16KB。原007预置多点装饰图不能代表本次三期数据，改用真实078主视觉+指标条；该模板默认3槽，安排为原生v1以使用其3必需项的确定性投影，其余蜂窝/明细保留三期值。全部12主题完成桌面与390px复验，任何原始装饰水印裁切都与正文裁切分开记录。theme11导航补丁之外没有修改上游验证器或真实组件代码。最终SP包仅含原创JSON/转换器及获许可Dashi纯模块，没有SP产品源码或上游minified主题runtime。


## 本独立分支的公开范围

转换源码 ZIP 已按本次归档要求剔除所有 `vendor-work` 文件，仅保留原创适配器与冻结内容；缺少上游构建依赖，不能据此宣称可独立重建。原重建报告属于剔除前的隔离输入。详见 [ARCHIVE-SCOPE](ARCHIVE-SCOPE.md)。原生 SP 导入、编辑、保存重开与 PPTX 保真仍未验收；本次仅独立核对结构、链接和公开文件哈希。
