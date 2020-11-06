# 关于 will-change 的用法以及一些 web 动画渲染优化

之前在研究一个有关 [利用纯 css 完成感知悬停](./CSS-Hover-Perceptual) 的代码，在里面第一次见到了 `will-change` 属性（学识疏浅勿喷-=-），查资料看了一下张鑫旭大大的博客 [使用 CSS3 will-change 提高页面滚动、动画等渲染性能](http://www.zhangxinxu.com/wordpress/2015/11/css3-will-change-improve-paint/) 对这个属性肃然起敬（相遇恨晚，抱头痛哭.jpg）。

MDN<sup>[1](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change)</sup> 上显示该属性语法如下：

```css
/* 关键字值 */
will-change: auto;
will-change: scroll-position;
will-change: contents;
will-change: transform;        /* <custom-ident>示例 */
will-change: opacity;          /* <custom-ident>示例 */
will-change: left, top;        /* 两个<animateable-feature>示例 */

/* 全局值 */
will-change: inherit;
will-change: initial;
will-change: unset;
```

## 原理介绍

当我们通过某些行为（点击、移动或滚动）触发页面进行大面积绘制的时候，浏览器往往是没有准备的，**只能被动使用 CPU 去计算与重绘，由于没有事先准备，应付渲染够呛，于是掉帧**。

**`will-change`** 是在行为触发之前告诉浏览器我们要进行一些什么样的变化操作，让浏览器好有个准备，**启动 GPU 为你渲染动画**。

- CPU 即「中央处理器」，它的功能主要是解释计算机指令以及处理计算机软件中的数据。
  
- GPU 是专为执行复杂的数学和几何计算而设计的，是与处理和绘制图形相关的硬件。有了它，CPU 就从图形处理的任务中解放出来，可以执行其他更多的系统任务。

- 硬件加速是指在计算机中透过把计算量非常大的工作分配给专门的硬件来处理来减轻 CPU 的工作量的技术。在 CSS `transition`、`transform` 和 `animation` 的世界里，他暗示我们应该卸载进程到 GPU，因此加快速度。这种情况通过向它自己的层叠加元素，当加载动画的时候可以加速渲染。

**`will-change`** 是怎样改善动画的性能和质量？

**首先**，在基于 **webkit** 的浏览器，我们在执行一些 CSS 的操作经常会看见闪烁，即二维变换和动画。

在过去，我们通过欺骗浏览器一点点解决实现；我们会使浏览器执行 3D 变换，因此减轻了工作量到 GPU 上。

当我们正确使用的时候，**`will-change`** 属性将极大的帮助我们。

## 举例

值得注意的一点，这个 **`will-change`** 应该在动画开始前的css语句块中执行，比如：

```css
/* Bad */
.will-change:active {
	will-change: transform;
	transition: transform 0.3s;
	transform: scale(1.5);
}
```

:::warning
当我们通知浏览器的时候，变化已经发生，完全失去了 `will-change` 的意义。

当预期的改变发生时，如果我们想要让浏览器提前了解，我们就必须在合适的时间通知它。

为了使元素达到激活的状态，它必须先被 **hover**。
:::

```css
/* Bad */
.will-change {
  will-change: transform;
  transition: transform 0.3s;
}
.will-change:hover {
  transform: scale(1.5);
}
```

:::warning
不要直接写在默认状态中，因为 **`will-change`** 会一直挂着；

可以让父元素 **hover** 的时候，声明 **`will-change`**，这样，移出的时候就会自动 remove，触发的范围基本上是有效元素范围。
:::

```css
/* Good */
.will-change-parent:hover .will-change {
  will-change: transform;
}
.will-change {
  transition: transform 0.3s;
}
.will-change:hover {
  transform: scale(1.5);
}

/* Good */
.will-change {
	transition: transform 0.3s;
}
.will-change:hover {
	will-change: transform;
}
.will-change:active {
	transform: scale(1.5);
}
```

最后说一点，如果想使用 JavaScript「添加」/「删除」`will-change` 属性，应该按照如下操作：

```js
dom.onmousedown = function() {
    target.style.willChange = 'transform';
};
dom.onclick = function() {
    // target 动画...
};
target.onanimationend = function() {
    // 动画结束回调，移除 will-change
    this.style.willChange = 'auto';
};
```

## 动画性能简易优化

1. 把 `background-attachment: fixed;` 换成 `position: fixed;`，因为前面的语句会在滚动的时候实时计算重绘。

2. 背景图片所在的元素可以替换为 `::before` 伪元素。

3. 使用 CSS3 的 `will-change` 属性启动 GPU 渲染。

## 参考资料

> 实例引用来自：[使用CSS3 will-change提高页面滚动、动画等渲染性能](http://www.zhangxinxu.com/wordpress/2015/11/css3-will-change-improve-paint/)
>
> 参考资料：[will-change - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change)
>
> 参考资料：[关于CSS的will-change属性的介绍](http://www.w3cplus.com/css3/introduction-css-will-change-property.html)