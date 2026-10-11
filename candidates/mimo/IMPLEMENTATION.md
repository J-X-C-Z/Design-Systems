# MiMo v2.0 的四页 AI 应用候选

唯一规范路径仍为languages/mimo/v2.0。本目录不是v2.1/v3或第二套MiMo。基线来源人工精修，当前应用为AI候选；原效果差／二级保留。四页是当前岸线内容的应用选择，不修改全局可选布局、可选组件、motion=language、skin保护、reference=both、reuse=shared规则。

## 继承与原创范围

仅读取canonical的系统字体栈和两分支语义颜色角色；不复制85个规范文件、历史示例、图像或SVG资源。本文字、四页排版和四条分隔线为本次应用实现。无位图生成或外部字体。默认静态不代表删除MiMo运动语言或未来应用的动效。

## 编辑模型

标题、数字含单位、范围限定、正文、索引、页码和共享声明分别保留文本。四条SVG线可改端点、线宽与色角色，线宽采用non-scaling-stroke；不提供无意义的单线前后层级按钮。skin只替换绑定颜色，保留文字、几何、显式颜色和封面标题字号。显式颜色会跨skin保留，需自行核对两个skin对比度；清除覆盖须主动点击。

JSON在提交前验证完整文字、四线身份、有效坐标/颜色、skin和覆盖。缺字段或超长字段拒绝，不静默截断。HTML包含完整模型和运行脚本，UTF8 BOM及首部charset；导出后仍独立可编辑。恢复初始值以当前文件内嵌模型为准。

## 构建与复用

最终mimo-application-editable.html为真实浏览器默认下载，可独立打开。source/index.html为可再构建源。运行python source/build.py --canonical-root /你的仓库/languages/mimo/v2.0，仅读取kit/design-language.json；不会写入canonical。canonical未包含在本包。

检查工具：responsive-check改变真实iframe视口；contact-sheet为1440px排版的等比全幅/并排比较，非手机或打印证据。原始静态HTML无需JavaScript可读四页；编辑和切页需要脚本。
