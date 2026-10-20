# 许可与材料来源

## 新增代码

本扩展的src、构建辅助与原创SVG遵循extensions/flat-vector-react/LICENSE。原七风格的许可文件、作者记录和来源不更改。本扩展不把旧素材重新许可为MIT。

## 原始MG参考

Vincentwei1021 / mg-styles-15；固定commit49052d80bfaf9fa8412cc9710530e5e95a3b8d8c。LICENSE保留Copyright(c)2026 Vincentwei1021。精确保存的文本/代码各有Git blob SHA比对。风格借鉴并不表示作者认可此网页产品。

Fredoka与Resource Han Rounded字体文件未包括，不宣称字体授权已复核。音频脚本依赖mgaudio和原库记录的8个采样，采样及其许可未取得，不提供采样文件，也不以仓库MIT覆盖采样许可。MP4/海报没有取得，不可声称已完成音频或视觉复核。更多状态见reference/SOURCE-MANIFEST.json和READ-STATUS.md。

## 运行时与离线工具

React18.2.0、ReactDOM18.2.0、Scheduler0.23.0：MIT；从当前环境已安装JupyterLab4.5.3分发文件中提取原厂vendor模块。原始分发chunk、第三方版权页和完整MIT文本都在vendor/react18；来源、hash、模块编号见vendor/PROVENANCE.json。离线打包器只提取React/DOM/Scheduler模块，不引入Jupyter应用。这里没有把其他系统中的字体文件拿来打包。

TypeScript5.8.3：Apache-2.0，LICENSE和ThirdPartyNoticeText.txt随vendor/typescript保存，用于离线JSX转译，不是产品浏览器负载。它是既有环境固定编译器，不执行npm安装脚本。运行时与构建工具的固定版本是为了可复现，不声称它们是最新版本。

没有新增第三方照片、地图、纹理、音效或3D资产；SVG几何图形由本扩展代码构造。现有基线同源资产原样保留。公开预览输出只复制必要的许可文本，不额外复制原始vendor代码/纹理用于页面加载。
