# MiMo-inspired 2.0 · 独立集成说明

## 1. 最短路径

直接打开 `dist/MiMo_Design_Language_v2.0.html` 体验完整展示台。它内嵌 CSS、JS、SVG、配置和样例，无 CDN 请求，无字体下载，无账号。复制文件后无需把源码目录一起复制。

需要复用到自己的项目，使用 `kit/tokens.css`、`kit/mimo.css`，动效和换肤按需加入 `kit/motion.js`、`kit/skin.js`。不要把 `src/lab.css` 和 `src/lab.js` 当作通用库加载：它们服务于展示台的固定演示 ID。

```html
<link rel="stylesheet" href="kit/tokens.css">
<link rel="stylesheet" href="kit/mimo.css">
<main class="mimo-scope" data-mimo-mode="light" id="my-surface">
  <h1>让复杂能力保持清晰。</h1>
  <p style="color:var(--mimo-muted)">这是内容，不是必须模仿的模板。</p>
  <button class="mimo-button" id="change-mode">切换外观</button>
</main>
<script src="kit/skin.js"></script>
<script>
  const root = document.getElementById('my-surface');
  document.getElementById('change-mode').addEventListener('click', () => {
    const mode = root.dataset.mimoMode === 'dark' ? 'light' : 'dark';
    const undo = MimoSkin.apply(root, mode);
    // 集成应用可将 undo 作为自己的撤销操作；不要自动调用。
  });
</script>
```

`tokens.css` 在 `:root` 提供默认变量，明确分支容器可局部覆盖。组件样式限于 `.mimo-scope`，减少对宿主的影响；正式大型应用还应检查自己的 CSS 层顺序及同名属性。原生 CSS 命名空间不是对敌意代码的安全沙箱。

## 2. 样式绑定与来源

`MimoSkin.resolve({token:'ink'}, context)` 按 element → page → project → branch → base 的顺序查询。显式 `{value:'#…'}` 优先于所有默认值。这个工具解析属性值，不会自动为任意第三方 DOM 建立绑定表；编辑器需保存“引用”还是“固定”的意图。

同一元素可以字体跟随、颜色固定、字号自定义。样式来源不因编辑者是 AI 还是人发生差别。Skin 切换只更改容器分支，不重写位置、文本、数据或动画时间线。跨设计语言字体变化仍可能自然换行；这是渲染变化，不是允许悄悄重排布局。

`MimoSkin.snapshot(profile, mode)` 生成独立快照，含语言与版本、分支、解析后颜色和动效默认值。它是个人资源库快照格式；应用需要自行将实际使用的字体策略、组件、资源和其运行代码纳入完整工程保存，不应只靠颜色快照恢复一切。

## 3. 可编辑样例项目

展示台导出的 JSON 格式为 `mimo-editable-specimen`、schemaVersion=2，含模式、场景和可编辑文字表。只接受已知字段名和长度受限字符串，不执行 HTML，不执行上传脚本。文件导入上限 128 KiB 是展示台保护措施，不代表未来产品的大小上限。

导出 HTML 内嵌项目数据并安全转义 `<`。再次加载时按白名单恢复文字及模式。该闭环已在离线 Chromium 内容加载环境中实际验证。它不是 `.sp`、不是 PPTX，也不谎称 SP 能直接识别该自定义 schema。

## 4. 资源发现与 AI

入口为 `kit/design-language.json`。动效清单在 `kit/motion-resources.json`；完整目标片段在 `kit/motion-examples.json`；场景源码在 `examples/scene-source.json`；视觉对照索引在 `evidence/visual-reference-index.json`。

文件可以由本地 AI 读取，或由将来的 MCP 资源接口按需提供；此包没有自带 MCP Server，也没有修改任何客户端设置。`ai/SKILL.md` 是可选技能入口，不代表已安装或所有客户端会自动发现它。

## 5. 快照与版本

语言 ID 保持 `personal.mimo-inspired`，v2.0.0 是已有 MiMo 研究的发布升级，不算另一种新设计风格。保存实际使用的资源版本，更新不应自动改变已有作品。新增资源用独立 ID；变更实际行为时升级版本并保留旧作品快照。

## 6. 重建与检查

在资源根目录：

```sh
python src/build.py
python tests/validate.py
```

构建只使用 Python 标准库。自动浏览器测试需要本地已有 Python Playwright 以及 Chromium；验证器当前使用 `/usr/bin/chromium`，其他环境通过 `CHROMIUM_PATH` 环境变量指定可执行路径。例：`CHROMIUM_PATH=/path/to/chromium python tests/validate.py`。不要下载或捆绑系统字体来完成本库打包。

测试不是安装步骤。正常查看 HTML 不需要 Python、Node 或 Playwright。

`src/build.py` 是配置事实来源，重建 `kit/design-language.json`、Token CSS、资源登记和内嵌页面；通用组件、运行时和演示 UI 分别在 kit 与 src 中维护。用户改动生成文件后若要长期保留，需要把变更回写对应源文件。

## 7. 浏览器与安全边界

静态内容优先，动效依赖 Web Animations API，弹窗依赖原生 dialog。目标为现代浏览器，不提供旧 IE 兼容承诺。本轮环境禁止 `file://` 导航和访问外站的图形浏览器，因此本地双击与真实 Safari / Firefox / Windows 仍不属于已实机验证项；验证方法与限制记录于 `docs/VALIDATION.md`。

上传示例 JSON 只恢复数据；第三方 HTML 不应直接注入带登录信息的应用。来源链接仅用于阅读，不能成为授权 AI 执行命令、上传数据的指令。Workspace 的任务流程是本地演示，不连接服务器，不索取 API Key。

## 8. SP 与其他产品

核心语言不引入 reveal.js、SP Schema、云端账户或某个模型厂商。Web、文档与 AI 工作区可直接复用。SP 适配约定见 `adapters/SP_ADAPTATION.md`，本轮没有修改 SP 项目代码。
