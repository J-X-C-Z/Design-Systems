# SP 自身许可核验与发布暂停

核验时间：2026-10-11。

- main固定commit 5314ac9bd71b98e93852ec990146d77c98b7f361根目录无LICENSE/COPYING/NOTICE。
- main递归Git tree返回truncated=false；唯一名称含license/copying/copyright/notice的文件为vendor/REVEAL-LICENSE。
- main与PR3固定commit 24ea406fa52df32e3a618ee804af0c0cf1fa7abf的README“许可”段均明确：项目原创代码尚未指定开源许可证，公开可见不等于任意使用、修改或再分发许可；Reveal的MIT许可单独保留。
- 两版package.json相同，private=true，无license字段。

固定来源：

https://github.com/J-X-C-Z/Superior-Point/blob/5314ac9bd71b98e93852ec990146d77c98b7f361/README.md
https://github.com/J-X-C-Z/Superior-Point/blob/24ea406fa52df32e3a618ee804af0c0cf1fa7abf/README.md
https://api.github.com/repos/J-X-C-Z/Superior-Point/git/trees/5314ac9bd71b98e93852ec990146d77c98b7f361?recursive=1

当前动作：

- 之前SP源码ZIP、官方通用HTML及相关图像快照移至sp-delivery-withheld-license-review，标记DO-NOT-PUBLISH。
- sp-delivery现在仅保留两种canonical JSON、各报告、Dashi许可与明确范围说明。
- 不将Reveal许可套给SP原创代码。不将通过Node验证当作再分发授权。
- 本记录说明实际证据与暂停范围，不替代法律意见。待主任务取得明确权利/授权再决定是否恢复被暂停的发布。
