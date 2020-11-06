# 重绘与回流

## 概念

### 重绘

> 指的是当页面中的元素**不脱离文档流**，而简单地进行**样式的变化**，比如修改颜色、背景等，浏览器重新绘制样式。

### 回流

> 指的是处于文档流中 DOM 的尺寸大小、位置或者某些属性发生变化时，导致浏览器**重新渲染部分或全部文档**的情况。

每个页面至少需要一次「回流」，就是在页面**第一次加载**的时候。

在「回流」的时候，浏览器会使渲染树中受到影响的部分失效，并重新构造这部分渲染树。

完成回流后，浏览器会重新绘制受影响的部分到屏幕中，该过程称为「重绘」。

相比之下，**回流**要比重绘消耗**性能开支更大**。

## 浏览器呈现页面的过程

1. 浏览器获取 HTML 代码，解析成 **DOM 树**。

2. 浏览器获取所有样式（`custom css` 以及 `user agent`）解析成 [CSSOM](https://juejin.im/entry/58a6957d128fe10064768930)，也就是样式结构体。
在解析的过程中，浏览器会去掉那些不能识别的样式，如：一些特有前缀的属性。

3. 在 **DOM** 和 **CSSOM** 都构建好之后，浏览器会将它们组合成 **`render tree`**。

    **`render tree`** 的特点是：其中每个 **node** 都会有自己的 `style`，而且它不包含隐藏节点（如：`display: none`）以及 `<head>` 节点，因为这些节点不用于呈现。

4. 构建好 **`render tree`** 后，浏览器就会**根据它来绘制页面**。

## 回流何时发生

1. 添加或者删除可见的 **DOM** 元素；

2. 元素位置改变；

3. 元素尺寸改变 —— 边距、填充、边框、宽度和高度；

4. 内容改变 —— 比如文本改变或者图片大小改变而引起的计算值宽度和高度改变；

5. 页面渲染初始化；

6. 浏览器窗口尺寸改变 —— resize 事件发生时；

## 名词详解

### DOM、CSSOM、render tree 三者关系

![三者关系](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/images/render-tree-construction.png?hl=zh-cn)

### DOM

DOM（Document Object Model，文档对象模型）。DOM 是 JavaScript 在**解析了 HTML** 后生成的一个数据结构，它是 Web 页面和脚本或程序语言之间的**桥梁**。

DOM 提供了**对文档结构化的标识**，并定义了一种方式，可以使**脚本对该结构进行访问**，从而**改变文档的结构、样式或者内容**。

DOM 树里包含了**所有 HTML 标签**，包括 `display:none` 隐藏，还有用 JavaScript 动态添加的元素等。

> [DOM概述 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model/Introduction)

### CSSOM

CSSOM（CSS Object Model，CSS 对象模型）。CSSOM 是一个建立在 web 页面上的 **CSS 样式的映射**，配合 DOM 来渲染 web 页面。

> [【译】CSSOM 介绍 - 前端 - 掘金](https://juejin.im/entry/58a6957d128fe10064768930)
> 
> [CSSOM视图模式(CSSOM View Module)相关整理 «  张鑫旭-鑫空间-鑫生活](https://www.zhangxinxu.com/wordpress/2011/09/cssom%E8%A7%86%E5%9B%BE%E6%A8%A1%E5%BC%8Fcssom-view-module%E7%9B%B8%E5%85%B3%E6%95%B4%E7%90%86%E4%B8%8E%E4%BB%8B%E7%BB%8D/)

### render tree

**render tree** 能识别样式，**render tree** 中每个节点都有自己的样式，而且 **render tree** 不包含隐藏的节点（比如 `display:none` 的节点，还有 `head` 节点)，因为这些节点不会用于呈现，而且不会影响呈现的）

❗️注意 `visibility:hidden` 隐藏的元素还是会包含到 **render tree** 中的，因为 `visibility:hidden` 会影响布局（layout），会占有空间。

一旦 **render tree** 构建完毕后，浏览器就可以根据 **render tree** 来绘制页面了。

## 参考资料

> [页面重绘和回流以及优化-WEB前端开发](http://www.css88.com/archives/4996)
> 
> [影响前端性能的本源 —— Reflow 和 Repaint - 前端 | 掘金](https://juejin.im/entry/595b5c135188250d7767f7d3)
>
> [前端性能优化关键词：DOM、CSSOM - 知乎](https://zhuanlan.zhihu.com/p/23569241)
> 
> [构建对象模型 | Web | Google Developers](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/constructing-the-object-model?hl=zh-cn)