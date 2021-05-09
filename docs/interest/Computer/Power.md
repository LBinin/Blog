# 🤔 如何选购电源

电源是电脑的心胀，负责提供稳定的电压，电压过高或者过低都会影响硬件的寿命。

## 功率

电脑中耗电最大的就是**显卡**和 **CPU** 了，因此我们只需要把显卡和 CPU 的功耗加起来，再加上 **100W** 左右的余量给**风扇**、**主板**、**硬盘**等硬件就足够了。

- 显卡：需要看显卡满载功耗（瓦）。

- CPU：需要看 CPU 的 **TDP 功耗**。TDP 功耗指的是 **CPU 在「不超频」的状态下的最大功耗**，而不是 CPU 真正的功耗。

大部分中等配置的电脑一般买 300W ~ 450W 的电源就足够了。

## 电源鉴别

### 额定功率

由于「显卡」和「CPU」的主要供电电压就是 +12V，所以在查看的时候一般看 +12V case 下的额定功率。

如果显卡和 CPU 需要的功率加起来超过了电源在 +12V 下的额定功率，就会出现供电不足的情况。

所以好的电源在 +12V 下的额定功率，会非常接近商家在宣传时表示的总功率。

### 80PLUS 认证

80PLUS 认证是一项对电源装换效率的认证。

80PLUS 认证不完全等于电源品质，仅表示电源**是否省电**，只具有一定的参考价值。（但是一般来说带有金牌或者白金牌的电源都不会太差）

根据转换效率的不同分为：白牌、铜牌、银牌、金牌、白金牌。

![80PLUS 认证](http://ww1.sinaimg.cn/large/006DJj5Hgy1g5mivlz5szj31gs0m4qsm.jpg)

比如：你有一个额定功率为 500W 的金牌（转化率 87%）电源，那么在电源满载的情况下，电表读书应为 500 / 87% = 574.7W。

80PLUS 认证在一定程度上也是对电源产品在环保贡献上的肯定。

### 电源方案

电源的方案就是电源内部的电路都是怎么设计的。

![电源结构](http://ww1.sinaimg.cn/large/006DJj5Hgy1g5mkhbbduvj31lw0osamz.jpg)

电源的结构：

1. 电流在进入电源后，首先会经过「一二级 EMI 滤波电容」

    「一二级 EMI 滤波电容」的作用是**过滤掉电网中的高频杂波和杂乱的信号**。一些劣质电源会在滤波电容中偷工减料。

2. 进入「整流桥」

    「整流桥」的作用是**把交流电变为直流电**

3. 经过 PFC

    PFC 分为「主动式 PFC」或者「被动式 PFC」，用于**提升电源的稳定性和用电效率**。
    
    主动式 PFC 已成主流，在电压波动比较大环境下，主动式 PFC 电源仍然可以保持稳定的输出。而被动式 PFC 电源对输入电压的稳定性有一定的要求，电压浮动的适应范围往往不如主动式 PFC 产品，在输入电压起伏较大的环境下可能无法正常工作。

4. 进入电源拓扑结构

    电源拓扑结构分为：LLC 全桥，LLC 半桥，双管正激，单管正激。它影响着**电源的转换效率**。

    一般的金牌或者白金牌电源都是「LLC 半桥」结构，铜牌电源一般是「双管正激」，单管正激不建议购入。

5. 电源输出

    影响电源提供给电脑的电压是否稳定。目前常见的输出结构为「DC-DC」或者「单磁路放大」，相对来说「DC-DC」技术新，输出的电源更稳定。

所以现在的主流电源方案都是：**主动式 PFC** + **LLC 半桥** + **DC-DC** 的结构。

### 电容

电容是电源必不可少的结构，影响电源是否耐用。

一般来说，在耐用性上，**日系**的「富士通」、「红宝石」、「三洋」、**台系**的「丰宾」电容，都是非常不错的电容。

### 质保

一般的电源会有 1 ~ 3 年的质保时间；

优质的电源会有 5 年的质保时间；

旗舰级别的电源会有 7 ~ 10 年的质保时间。

### 电源模组和尺寸

电源模组从差到好分为：非模组、半模组、全模组电源（越好越美观，没有杂线）。区别在于他们的线材是否是固定的。

电源尺寸分为：SFX 和 ATX。SFX：125 * 100 * 63.6，ATX：165 * 150 * 86。ATX 是现在用到最多的电源。

## 总结

1. 日常使用**不买便宜的山寨电源**；
2. 高配电脑可以遵循「**一元一瓦**」的标准选购电源。

## 参考资料

> [【装机必看】电源篇 纹波不稳炸四方，隔壁小孩都吓哭了](https://www.bilibili.com/video/av29410982)
> 
> [超能课堂(56)：主动式PFC与被动式PFC电源有什么不同？ - 超能网](https://www.expreview.com/49100.html)
> 
> [菜鸟必学的电源秘笈 - 黎小白 | 知乎](https://www.zhihu.com/question/25627616/answer/282543817)