# 来源与许可边界

## 新增作品

本目录内本次新编写的 React 场景/组件、模型、样式、工具、测试与文档适用本目录 LICENSE（MIT）。原创几何素材见 assets/README.md。此授权不覆盖用户原包，也不改变 reference/ 和 vendor/ 的原许可。

## React / ReactDOM / Scheduler 19.1.1

MIT；完整文本位于 vendor/REACT-LICENSE.txt，并复制到构建预览与单文件预览注释中。运行时从可信环境已安装的Playwright录制器生产bundle中只提取React、JSX runtime、Scheduler及ReactDOM库段，不含录制器应用代码、网络功能或启动代码。原bundle SHA-256、提取边界与最终字节哈希见 vendor/RUNTIME-PROVENANCE.json。

本次没有声称通过网络下载新的npm运行库。常规业务工程可以审查后使用同版官方依赖替换此离线运行库，再做构建与浏览器验证；不要将两个React副本交叉用于同一个组件树。

## TypeScript 5.8.3

Apache-2.0；vendor/TYPESCRIPT-LICENSE.txt。vendor/typescript-5.8.3.tgz是可信预装编译器的完整归档，package-lock以SHA-512固定本地归档；仅用于开发构建，不进入网页运行时。没有字体文件或自动安装生命周期脚本执行。

## 风格参考

Vincentwei1021/mg-styles-15，固定commit 49052d80bfaf9fa8412cc9710530e5e95a3b8d8c。项目自制源码、提示词、文档、成片按MIT；原LICENSE保留于reference/upstream/LICENSE。逐文件授权及取得情况见reference/SOURCES.json。第三方纹理不因根MIT而自动重新授权。字体未取得、未附带。

## 原849目录与8个规范定义

来自原包记录的WatermelonCorp/watermelon-platform固定commit 424fe703d19b39e86bef90c4ba0a76ef8c1fb260；MIT原文按原包复制到reference/Watermelon-MIT.txt。8个原TSX只用来保留来源和定义，不作为新React计数。新实现不引入原组件的所有第三方primitive依赖，也不声称完整API一致。

## 原七风格与Follow456

原包全部文件及THIRD-PARTY-NOTICES原样保留。它们继续适用原权利条款，本新增目录不重新许可原HTML、品牌或素材。未修改原包依赖、未知脚本或原运行配置。
