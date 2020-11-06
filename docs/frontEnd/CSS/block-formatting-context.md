# 深入理解块级格式化上下文（BFC）及应用

<ruby>
  B<rp>(</rp><rt>Block</rt><rp>)</rp>
  F<rp>(</rp><rt>Formatting</rt><rp>)</rp>
  C<rp>(</rp><rt>Context</rt><rp>)</rp>
</ruby>
，中文「块级格式化上下文」

## 流体元素

流体元素是指哪些具体「流」的特性的元素，也就是**自适应**的特性，通过这种特性实现的布局成为「流体布局」，可以看做自适应布局的一种。

❗️需要注意的是：当元素设置了 `width` 或者 `height` 属性后，元素失去「流」特性。

### 特性

**块状水平元素**，如 `<div>` 元素，在默认情况下（非浮动、绝对定位等），**水平方向会自动填满外部的容器**；

如果块状水平元素有 `margin-left / margin-right`, `padding-left / padding-right`, `border-left-width / border-right-width` 等，实际内容区域（content）会响应变窄，也就是自动填满**剩余**空间。

### 

## 参考资料

> [CSS深入理解流体特性和BFC特性下多栏自适应布局 «  张鑫旭-鑫空间-鑫生活](https://www.zhangxinxu.com/wordpress/2015/02/css-deep-understand-flow-bfc-column-two-auto-layout/)
> 
> [BFC原理详解 - 进击的程序猹 - SegmentFault 思否](https://segmentfault.com/a/1190000006740129)
>
> [前端精选文摘：BFC 神奇背后的原理 - 梦想天空（山边小溪） - 博客园](http://www.cnblogs.com/lhb25/p/inside-block-formatting-ontext.html)
>
> [CSS魔法堂：重新认识Box Model、IFC、BFC和Collapsing margins - ^_^肥仔John - 博客园](https://www.cnblogs.com/fsjohnhuang/p/5259121.html)
>
> [学习BFC - WEB前端 - 伯乐在线](http://web.jobbole.com/83274/)