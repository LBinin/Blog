# Newifi Mini 刷机教程

## 背景

漂泊在外，自如公寓的 WiFi 真的不敢恭维，用的 TP-Link，信号弱、延迟高、无双频；偶然连上了网关的双频信号，虽然延迟的问题解决了，信号弱还是一个问题，中间又隔着一堵厚厚的墙，经常转到床头就没信号了，于是想入一个路由器做中继；

在大佬同学的推荐下，入了 Newifi Mini，闲鱼上基本 ￥60 左右包邮 😎

## 文件下载

Breed：[breed-mt7620-lenovo-y1.bin](http://software.lbinin.com/newifi-mini/breed-mt7620-lenovo-y1.bin)

Newifi Padavan 固件：[RT-AC54U-GPIO-11-newifimini-128M_3.4.3.9-099.trx](http://software.lbinin.com/newifi-mini/RT-AC54U-GPIO-11-newifimini-128M_3.4.3.9-099.trx)

## 刷机步骤

首先认清自己的路由器型号，然后选择对应的 Breed 和固件；

这里我的路由器是 Newifi Mini，型号是 R6830，内存 128MB；

### 刷 Breed

> Breed 是一款新的「引导加载器」，可以用于更新固件等操作，出自于 hackpascal 大神之手。

进入此帖查看下载对应的 Breed：[【2018-12-29】AR/QCA/MTK Breed，功能强大的多线程 Bootloader - OPENWRT专版 -  恩山无线论坛 -  Powered by Discuz!](https://www.right.com.cn/forum/thread-161906-1-1.html)

这里我选择的是 `breed-mt7620-lenovo-y1.bin`（联想 Y1 (newifi mini) 专用，波特率 115200，复位键 GPIO#11）

附上 Newifi Mini Breed 下载链接：[breed-mt7620-lenovo-y1.bin](http://software.lbinin.com/newifi-mini/breed-mt7620-lenovo-y1.bin)

刷 Breed 步骤：

1. 路由器插上电源，用网线将路由器和电脑连接在一起（Newifi 的任意一个网口均可）；

2. 在「网络和共享中心」（Windows）或者「系统偏好设置 👉🏻 网络」（Mac），找到对应的网络，设置其 IPv4 地址为 `192.168.1.2`，子网掩码为 `255.255.255.0`；

3. 设置好后，断开路由器电源，按住 Reset 按键不松，连上电源，Reset 继续按住 5 秒以上；

4. 这时候电脑访问 `192.168.1.1` 即可进入路由器自带恢复模式；

5. 选择文件，选择上面下载好的 `.bin` 文件，点击「恢复」按钮；

6. 等待升级完成。

至此 Breed 刷入完成，我们后续需要通过 Breed 进行固件的升级。

### 刷固件

在刷好 Breed 之后，我们用 [刷 Breed](#刷-breed) 步骤中的 1~4 步，进入 Breed 进行固件的升级；

进入此帖查看下载对应路由器的固件：[2019-03-05改华硕N14U N54U5G 2G的7620老毛子Padavan固件(私人云储存 aria2 QOS) - Padavan -  恩山无线论坛 -  Powered by Discuz!](https://www.right.com.cn/forum/thread-161324-1-1.html)；

附上 Newifi Mini 固件下载链接：[RT-AC54U-GPIO-11-newifimini-128M_3.4.3.9-099.trx](http://software.lbinin.com/newifi-mini/RT-AC54U-GPIO-11-newifimini-128M_3.4.3.9-099.trx)；

固件升级步骤：

1. 进入 Breed 之后，选择左侧侧的「固件更新」；

2. 将右侧「固件」旁的选择框**打勾**，并选择上面下载好的 `.trx` 文件，将「自动重启」**打勾**，点击「上传」按钮

3. 确认更新；

4. 等待完成即可。

至此，固件刷入完毕。

### 收尾

将之前手动设置的网络 IP，用同样的方式改为自动获取，最好重启一次路由器；

这时候可以输入 `192.168.123.1`，帐号密码都是 `admin`，剩下的就自己折腾啦~

## SS

和正常的 SS 一样设置，不过有一些需要注意的地方：

1. 如果电脑和手机其中一个可以访问外网，一个不能，检查是否是 DNS 的问题，设置为「自动获取」；

2. 如果设置为自动获取还是不行，将「DNS 服务模式选择」改为 `pdnsd` 一般就好啦~

## 参考资料

> [69神器 newifi mini 刷机教程小白篇Step By Step__什么值得买](https://post.smzdm.com/p/506414/)
>
> [Mac Newifi mini路由器刷breed+Padavan固件 - weixin_42039915的博客 - CSDN博客](https://blog.csdn.net/weixin_42039915/article/details/80145567)
>
> [newifi mini 刷padavan固件（史上最简单的方法）| 约翰提托博客](https://www.johntitorblog.com/?p=305)
>
> [【2018-12-29】AR/QCA/MTK Breed，功能强大的多线程 Bootloader - OPENWRT专版 -  恩山无线论坛 -  Powered by Discuz!](https://www.right.com.cn/forum/thread-161906-1-1.html)
>
> [2019-03-05改华硕N14U N54U5G 2G的7620老毛子Padavan固件(私人云储存 aria2 QOS) - Padavan -  恩山无线论坛 -  Powered by Discuz!](https://www.right.com.cn/forum/thread-161324-1-1.html)