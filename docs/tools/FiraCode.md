# Fira Code —— 程序员专用字体

## 简介

**Fira Code** 是 Mozilla 主推的专为代码排版优化的等宽字体。

它基于 Fira Mono 等宽字体的一个扩展，主要特点是加入了「**编程连字特性**」（ligatures）。

一张图看懂区别：

![一张图看懂区别](https://ww1.sinaimg.cn/large/006DJj5Hgy1g5tovv5q11j31f01dwk2b.jpg)

## 下载安装

1. 可以到 **Fira Code** 的 GitHub 上下载 👉🏻 ：[GitHub](https://github.com/tonsky/FiraCode)
2. 我备份了一份，提供下载，直接点击下载 👉🏻 ：[software · LBinin](http://software.lbinin.com/FiraCode_1.205.zip)

至于字体的安装，直接打开 `.ttf` 文件安装即可，这里不再赘述

## 配置

这里以 VSCode 为例，打开「首选项」->「设置」（ `⌘ + ,` ），添加如下内容：

```json
"editor.fontFamily": "'Fira Code', Menlo, Monaco, 'Courier New', monospace",
"editor.fontLigatures": true
```

新版设置对应项就好了，第一个是设置「字体」，第二个是设置是否「连体」。

大功告成 🎉