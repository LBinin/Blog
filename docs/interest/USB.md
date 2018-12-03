# USB 各版本区别及基本知识

## USB 简介

> USB（Universal Seiral Bus，通用串行总线）是连接计算机系统与外部设备的一种串口总线标准，也是一种输入输出接口的技术规范，被广泛地应用于个人计算机和移动设备等信息通讯产品，并扩展至摄影器材、数字电视（机顶盒）、游戏机等其它相关领域。

在 1994 年，Compaq，DEC，IBM，Intel，Microsoft，NEC 和 Nortel 七大公司，为了创造出一个统一且支持易插拔的外接式传输接口，来改善计算机刚问世后，许多各不相同的外设接口造成的繁杂而庞大的接口系统，开始了对「通用串行总线」的统一研发。

## 使用协议

## 历史版本

在介绍各类不同类型的接头前先来介绍下 USB 的各大历史版本。

### USB 1.0
    
于 1996 年 1 月正式发布的。数据传输速率为 **1.5Mbps**（Low-Speed）。不过因为当时支持 USB 的周边装置少的可怜，所以主机板商不太把 USB Port 直接设计在主机板上。

### USB 1.1

修复了许多 1.0 版上发现的问题。最早被采用的修订版。数据传输速率为 **12Mbit/s**（Full-Speed）

### USB 2.0

于 2000 年 4 月发布。增加了数据传输速率，可达 **480Mbit/s**（现在称作 `Hi-Speed`），但受限于 BOT 传输协议和 NRZI 编码方式，实际最高传输速度只有 **280Mbit/s** 左右。

::: tip BOT 协议和 NRZI 编码

:::

在 USB 2.0 中新增了许多最重要的规范，可在 [USB.org](http://www.usb.org/) 上查到：

<details>
<summary><strong>重要规范细节</strong></summary>

- Mini-A 和 Mini-B Connector ECN：2000 年 10 月发布。
- 规范 Mini-A 和 Mini-B 的插头及插座标准。注意不要与 Micro-B 插头及插座混淆。
- Errata as of December 2000：2000 年 12 月发布。
- Pull-up/Pull-down Resistors ECN：2002 年 5 月发布。
- Errata as of May 2002：2002 年 5 月发布。
- Interface Associations ECN：2003 年 5 月发布。
- 添加新的描述符以便将多重接口关联在在单一设备功能中。
- Rounded Chamfer ECN：2003 年 10 月发布。
- 一项针对 Mini-B 接口坚固性的建议性、兼容性改进。
- Unicode ECN：2005 年 2 月发布。
- 这项 ECN 指定了字符串可以使用 UTF-16LE 编码。USB 2.0 曾指定可以使用 Unicode，但没有指定编码。
- Inter-Chip USB Supplement：2006 年 3 月发布。
- On-The-Go Supplement 1.3：2006 年 12 月发布。
- USB 直连（USB On-The-Go）允许两个 USb 设备不经独立 USB 主机端直接相互通讯。实际使用中，是其中一个 USB 设备作为其它设备的主机端。
- Battery Charging Specification 1.0：2007 年 3 月发布。
- 添加对充电器（有 USB 接口的电源适配器）的支持，当供电端（作为充电器的 USB 主端口）和电池连接时，它允许瞬间通过 100 mA 的电流。如果一个 USB 设备连接到专用充电器或主端口时，最大瞬间电流可达 1.5 A。（该文档并未包含在 USB 2.0 规范中。）
- Micro-USB Cables and Connectors Specification 1.01：2007 年 4 月发布。
- Link Power Management Addendum ECN：2007 年 7 月释出。
- 在启用与待机间增加新的电源模式。当设备处于这个模式时不向其发送指令以减少电源消耗。所以，在启用及睡眠模式间切换要比在启用及待机模式间切换快得多。
- High-Speed Inter-Chip USB Electrical Specification Revision 1.0：2007 年 9 月发布。

</details>

### USB 3.0

于 2008 年 11 月发布，速度由 `480Mbps` 大幅提升到 **5Gbps**。

从 USB 3.0 开始，插座通常是蓝色的，**并向下兼容 USB 2.0**。

### USB 3.1

USB3.0 推广小组于 2013 年 7 月 31 日宣布 USB 3.1 规格，传输速度提升为 **10Gbps**，比 USB3.0 的 `5Gb/s` 快上一倍，并向下兼容 USB 2.0/1.0。

如果要得到 10Gb/s 的传输速度仍需在主机、目标端同时具备对应的芯片才能达成，电力供应可高达 **100 瓦**。

### USB 3.2

USB 3.2 的主要技术要点：

1. 在现有的 USB Type-C 数据在线实现「双通道」
2. 继续使用现有的超高速 USB 物理传输率和技术
3. 一些小的规范更新，确保**单双通道无缝切换**。

速度方面，使用 USB 3.2 主机连接 USB 3.2 存储设备，可以实现两条通道 **10Gbps** 的传输速度，也就是超过 **2.5GB/s**。

据悉，USB 3.2 因为要求集成 USB 2.0 和 USB 3.1 主控，所以完全向下兼容。 另外，从 USB 3.2 开始，Type-C 将成为唯一推荐的接口方案。

## 参考资料

> [USB - 维基百科，自由的百科全书](https://zh.wikipedia.org/wiki/USB)
> 
> [USB-A、USB-B 與 USB-C 分別到底在那裡？一篇給你看過明白 | TechRitual - 香港 No.2 電腦資訊網站](https://www.techritual.com/2018/06/21/134405/)
> 
> [USB Type A/B/C基本知识和各版本区别 - 软件无忧](https://www.kafan.cn/edu/88896614.html)
> 
> [每次节省 1 小时！学会这招快充大法，让你的 iPhone 充电快到飞起](https://mp.weixin.qq.com/s/Gg9VraaQH79T_RX9rG-Lqg)