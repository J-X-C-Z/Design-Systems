# 后五套设计语言：增量归档说明

日期：2026-10-11。此包仅包含实验拼贴、生成艺术、沉浸空间、Y2K 复古未来、世纪中期现代五套 v1.0，以及对应 ZIP。

## 合并到 Design-Systems

1. 先获取仓库最新版本；保留用户已有修改。
2. 按相同相对路径添加 languages 和 packages。若同名文件已经存在，先比较内容及版本；不要盲目覆盖。
3. 此包不包含根 README 或 prompts，不能用本包覆盖它们。请在现有 README 的合适位置增量添加以下入口，保留原文与已有链接。
4. 按仓库已有格式更新根校验清单；本包的 INCREMENTAL_SHA256SUMS.txt 只校验此次增量，不应覆盖全仓库清单。
5. 提交后核对远端路径及内容哈希。

## 可添加的 README 入口

- 实验拼贴：[规范与样例](languages/experimental-collage/v1.0/README.md) · [ZIP](packages/experimental-collage-v1.0.zip)
- 生成艺术：[规范与样例](languages/generative-art/v1.0/README.md) · [ZIP](packages/generative-art-v1.0.zip)
- 沉浸空间：[规范与样例](languages/immersive-space/v1.0/README.md) · [ZIP](packages/immersive-space-v1.0.zip)
- Y2K 复古未来：[规范与样例](languages/y2k-retrofuture/v1.0/README.md) · [ZIP](packages/y2k-retrofuture-v1.0.zip)
- 世纪中期现代：[规范与样例](languages/midcentury-modern/v1.0/README.md) · [ZIP](packages/midcentury-modern-v1.0.zip)

## 状态与权利

已提供研究规范、候选参数、可编辑离线实现及各包实际验证记录。静态与模拟 DOM 检查不等同真实浏览器验收；HTML 的浏览器视觉、实际焦点和设备验证仍未完成，详见各自 VALIDATION.md。不要将成果写成全环境验证通过。

保留各包来源与许可边界。原始参考作品、字体或品牌不因本归档而获准再分发。
