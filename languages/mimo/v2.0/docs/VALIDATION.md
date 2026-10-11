# MiMo-inspired 2.0 · 实际验证报告

> 日期：2026-10-10。对象是本包原创页面和运行时，不是小米官网。自动化测试并不替代用户对设计风格的最终审美选择。

## 结果

**72 项检查通过，0 项失败；48 组响应式场景；50 个指定语义色组合。**

| 检查 | 实际结果 |
|---|---|
| 页面环境 | 管理式 Linux Chromium，headless，离线上下文 |
| 测试载入 | 将本地最终 HTML 的精确文本交给 Playwright set_content；未请求网络资源 |
| 窄屏与长文 | 1440 / 1024 / 390 / 320 CSS px × 两分支 × 三场景 × 中文/长英文，共48组；未检测到页面级横向溢出或检查目标文字裁切 |
| 十种动效 | 实际 WAAPI 对象、进度定位、暂停/继续、完成状态和重复替换；并非只检查按钮是否存在 |
| 减少动态效果 | 十资源静态终态、系统 reduce 偏好，以及用户控制 |
| 换肤与覆盖 | 保留文字、布局几何、显式颜色和暂停动画进度；支持撤销及独立快照 |
| 交互 | 键盘选项卡；弹窗焦点和 Escape；空值/错误修正；任务取消后清理旧计时器 |
| 复制 | 成功/失败两分支用测试桩验证；不等于当前操作系统剪贴板已实测 |
| 导入与导出 | JSON、HTML重新载入；未知字段拒绝且不改变原状态；恶意标签和结束script字符串仍为普通文字 |
| 六个独立样例 | 全部初始化到对应场景和分支，保留同一语言结构 |
| 运行异常和外部请求 | 未记录 JS 异常，未记录 HTTP/HTTPS 运行时请求 |

颜色检查中，要求4.5:1的文字组合最低为 **4.652:1**，要求3:1的交互边界/焦点组合最低为 **3.657:1**。仅代表列举组合，不覆盖任意用户配色、背景照片和透明混合。

本轮发现并修复了浅色 subtle 在 raised 底面上的对比度不足；修复后重新生成全部页面并完整执行回归。导入器也拒绝特殊原型键与未知文本字段，避免“导入失败但模式已经改变”的部分写入。

## 视觉检查

人工查看了原创桌面首页、动效台、移动工作区及动效关键帧。六场景参考图来自同一份实现；五种标志性动效在0/50/100%时间点由真实控制器定位后截图，证据清单在 preview/motion-frame-index.json。它们不是外部宣传图。

## 不在本轮验证范围

- 管理环境禁止 file:// 导航，因此未将双击本地HTML列为实机通过。产物没有外部运行依赖，但跨机器双击表现仍属于浏览器环境边界。
- 未实测物理 Windows/macOS、Safari、Firefox、屏幕阅读器与真实多显示器，不宣称全部浏览器兼容或完整 WCAG 合规。
- 官网 computed CSS、官方字体二进制和原生动效时间线没有取得；本版参数与代码是个人原创默认，不是官网测量值。
- Workspace 是标明的本地模拟，不调用模型和后端；SP 与 MCP 没有接入，本报告不为它们的功能验收背书。

这些边界与“个人设计语言、资源和展示台已经完成”并不矛盾。它们界定了交付范围，避免把设计完成混同于所有产品和设备的部署完成。

## 可重现性

执行 `python src/build.py`，然后 `python tests/validate.py`。测试需要已有 Playwright 与 Chromium；通过 CHROMIUM_PATH 指定本机浏览器。重建图集可运行 `python tests/capture_references.py`（还需 Pillow 和可选的本地中文渲染字体）。正常打开 HTML 不需要这些测试依赖。

最终被测 HTML 的 SHA-256：

`05ad916f0c173299b8a4a4e7e021568d2deedfd519b079b76790376c9717ef9f`

浏览器：`Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/144.0.0.0 Safari/537.36`

完整逐项记录与具体色对比值见 `preview/validation.json`。

## 逐项结果

| 项 | 结果 |
|---|---|
| semantic contrast pairs | 通过 |
| no external runtime script, stylesheet or font | 通过 |
| library boot with ten motion resources | 通过 |
| 48 responsive combinations | 通过 |
| skin preserves content geometry overrides and paused timeline | 通过 |
| explicit style and local overrides | 通过 |
| snapshot is detached and versioned | 通过 |
| seek index-trace | 通过 |
| pause index-trace | 通过 |
| finish index-trace | 通过 |
| seek type-unfold | 通过 |
| pause type-unfold | 通过 |
| finish type-unfold | 通过 |
| seek evidence-flow | 通过 |
| pause evidence-flow | 通过 |
| finish evidence-flow | 通过 |
| seek focus-aperture | 通过 |
| pause focus-aperture | 通过 |
| finish focus-aperture | 通过 |
| seek quiet-reframe | 通过 |
| pause quiet-reframe | 通过 |
| finish quiet-reframe | 通过 |
| seek directional-hint | 通过 |
| pause directional-hint | 通过 |
| finish directional-hint | 通过 |
| seek surface-resolve | 通过 |
| pause surface-resolve | 通过 |
| finish surface-resolve | 通过 |
| seek command-confirm | 通过 |
| pause command-confirm | 通过 |
| finish command-confirm | 通过 |
| seek state-relay | 通过 |
| pause state-relay | 通过 |
| finish state-relay | 通过 |
| seek data-reconcile | 通过 |
| pause data-reconcile | 通过 |
| finish data-reconcile | 通过 |
| replacing animations does not accumulate instances | 通过 |
| reduced index-trace | 通过 |
| reduced type-unfold | 通过 |
| reduced evidence-flow | 通过 |
| reduced focus-aperture | 通过 |
| reduced quiet-reframe | 通过 |
| reduced directional-hint | 通过 |
| reduced surface-resolve | 通过 |
| reduced command-confirm | 通过 |
| reduced state-relay | 通过 |
| reduced data-reconcile | 通过 |
| system reduced motion | 通过 |
| keyboard tab navigation | 通过 |
| dialog focus contained | 通过 |
| dialog Escape restores focus | 通过 |
| invalid input state | 通过 |
| input correction retains data | 通过 |
| copy success branch mock | 通过 |
| copy failure branch mock | 通过 |
| task cancellation clears timers and retains input | 通过 |
| local simulation labelled on completion | 通过 |
| invalid import atomic | 通过 |
| literal JSON prototype key rejected | 通过 |
| untrusted import stays plain text | 通过 |
| JSON roundtrip | 通过 |
| editable HTML roundtrip | 通过 |
| HTML export escapes script-ending input | 通过 |
| standalone developer.dark.html | 通过 |
| standalone developer.light.html | 通过 |
| standalone research.dark.html | 通过 |
| standalone research.light.html | 通过 |
| standalone workspace.dark.html | 通过 |
| standalone workspace.light.html | 通过 |
| no JavaScript exceptions | 通过 |
| no external runtime requests | 通过 |
