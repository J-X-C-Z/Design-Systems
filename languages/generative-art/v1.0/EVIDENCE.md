# 来源与复现边界
2026-10-11。N 原始规范/作者说明；O 页面内容；I 综合推断；A 原创实现。

E1 · Casey Reas / Process
https://reas.com/process
N：作者把系统描述为形、行为与元素，文字规则可有不同实现；过程可生成多个输出和时间性作品。I：参数与规则应和作品一起交付。A：本包正弦线场、LCG配方、范围和调色全部原创，不实现任何 Process 编号作品。

E2 · p5.js / randomSeed
https://p5js.org/reference/p5/randomSeed/
N：固定种子使相应随机序列可重复。A：本包用自己的无依赖 LCG，未导入 p5.js，也不承诺与 p5.js 同种子输出相同。引用的是复现方法，非源代码。

E3 · V&A / Computer Art: Processes & Techniques
https://www.vam.ac.uk/info/collection-selection-boxes-computer-art-processes-techniques
N：讨论计算机艺术的过程和技术及偶然与控制。I：艺术家的控制包括定义变化边界。此包没有复刻馆藏图像。

E4 · V&A / Chance and Control
https://www.vam.ac.uk/exhibitions/chance-and-control-art-in-the-age-of-computers
O：展览条目覆盖多个时期与不同创作者的作品，列明馆藏与版权。说明“生成”不是单一外观。
动效参考主要是 E1 作者对过程随时间展开的描述；未逐帧测量原作品。3秒路径显露是本包原创演示，不冒充来源原作速度。

许可：生成器、输出 SVG、CSS 与文案为原创；没有第三方图像、字体、代码库。各参考艺术家的作品不可因可在线浏览就复制/出售。参数输出中只含用户本地输入的数值；没有网络上传、账号或跟踪。
