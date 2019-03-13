# 深入理解 CSS 层叠上下文

## 简介

「层叠上下文」是 HTML 中的一个**三维概念**，这些 HTML 元素在一条假想的相对于面向（电脑屏幕的）视窗或者网页的 z 轴（用户视角）上延伸，HTML 元素依据其自身属性按照「优先级顺序」**占用层叠上下文的空间**。

## 创建层叠上下文

在 MDN 上介绍，文档中的元素要创建一个层叠上下文，需要满足以下「任意」一个条件：

- 根元素 `<HTML>`；

- `z-index` 值不为 **`auto`** 的**绝对** / **相对**定位；

- `z-index` 值不为 **`auto`** 的 **flex** 项目（即：父元素 `display: flex|inline-flex`）；

- `opacity` 属性值小于 **`1`** 的元素；

- `transform` 属性值不为 **`none`** 的元素；

- `mix-blend-mode` 属性值不为 **`normal`** 的元素；

- `filter` 值不为 **`none`** 的元素；

- `perspective` 值不为 **`none`** 的元素；

- `isolation` 属性被设置为 **`isolate`** 的元素；

- `position: fixed` 的元素；

- `will-change` 中指定了任意 CSS 属性（即便你没有直接指定这些属性的值）；

- `-webkit-overflow-scrolling` 属性被设置 **`touch`** 的元素。

## 层叠顺序

![层叠顺序](https://img.alicdn.com/tfs/TB17xJuDpYqK1RjSZLeXXbXppXa-768-383.png)

上图大致标明了在一个完整的层叠上下文元素中，其不同子元素的层叠顺序。

针对上图，需要补充一些内容：

1. 最底层的 `background/border` 指的是**层叠上下文元素**的背景色和边框；

2. `inline-block` 和 `inline` 水平元素是同等 level 级别；

3. `z-index:0` 和 `z-index:auto` **单纯从层叠水平**上看，是可以看成是一样的；实际上，两者在层叠上下文领域有着根本性的差异（能否触发生成层叠上下文），层叠上下文也属于这一层，见 [层叠上下文的层叠顺序](#层叠上下文的层叠顺序)；

4. 内联盒子比浮动元素的层叠顺序要高，是因为浮动元素在设计之初，一般被用作布局，如图片，而内联元素一般是「更为重要」的内容，所以内联元素优先级更高；

5. 当具有明显的层叠水平标示的时候，如识别的 `z-indx` 值，在**同一个层叠上下文领域**，层叠水平值大的那一个覆盖小的那一个；

6. 当元素的层叠水平一致、层叠顺序相同的时候，在 DOM 流中处于**后面的元素**会覆盖前面的元素。

## 特性

层叠上下文元素有如下特性：

1. 层叠上下文的层叠水平要比普通元素高（见 [层叠上下文的层叠顺序](#层叠上下文的层叠顺序)）；

2. 层叠上下文可以阻断元素的混合模式（见 [isolation: isolate 作用的原理](./mix-blend-mode.html#isolation-isolate-作用的原理)，因为 `isolation: isolate` 就是单纯创建了一个层叠上下文，只要创建了层叠上下文，就会阻断 `mix-blend-mode`）；

3. 层叠上下文可以嵌套，内部层叠上下文及其所有子元素均受制于外部的层叠上下文。

4. 每个层叠上下文和兄弟元素独立，也就是当进行层叠变化或渲染的时候，只需要考虑后代元素。

5. 每个层叠上下文是自成体系的，当元素发生层叠的时候，整个元素被认为是在父层叠上下文的层叠顺序中。

## 注意点

### 层叠上下文的层叠顺序

在 [特性](#特性) 中说过，「**层叠上下文的层叠水平要比普通元素高**」，这里需要分两种情况讨论：

1. 如果**层叠上下文元素**没有设置 `z-index` 数值，则其层叠顺序是 `z-index:auto`（可看成 `z:index:0`）；

2. 如果**层叠上下文元素**设置了 `z-index` 数值，则其层叠顺序由 `z-index` 值决定。

所以，正确的示例应该是：（图源：张鑫旭）

![层叠顺序](https://image.zhangxinxu.com/image/blog/201601/2016-01-09_211116.png)

### 定位元素的层叠顺序

:::tip 定位元素
定位元素会层叠在普通元素（如 `inline` 或 `block` 或 `float` 元素）的上面
:::

因为：元素一旦成为**定位元素**，其 `z-index` 就会自动生效，此时其 `z-index` 就是默认的 `auto`，也相当于 `z-index: 0`，根据上面的层叠顺序表，就会覆盖 `inline` 或 `block` 或 `float` 元素。但是该元素不会形成一个新的层叠上下文哦~

正是因为这个原因，**层叠上下文元素**和**定位元素**是一个层叠顺序的，所以遵循的是「后来居上」的原则。

## 举例

### 0x00

> **display: flex | inline-flex 与层叠上下文**
> 
> 出自 [深入理解 CSS 中的层叠上下文和层叠顺序 « 张鑫旭-鑫空间-鑫生活](https://www.zhangxinxu.com/wordpress/2016/01/understand-css-stacking-context-order-z-index/)

现有如下结构：

```html
<div class="box">
    <div>
    	<img src="pic.jpg">
    </div>
</div>
```

第一次 CSS 代码：

```css
.box {  }
.box > div { background-color: blue; z-index: 1; }    /* 此时该div是普通元素，z-index无效 */
.box > div > img { 
  position: relative; z-index: -1; right: -150px;     /* 注意这里是负值z-index */
}
```

将会显示为**图片在下**，蓝色背景在上。

第二次 CSS 代码：

```css
.box { display: flex; }
.box > div { background-color: blue; z-index: 1; }    /* 此时该div是普通元素，z-index无效 */
.box > div > img { 
  position: relative; z-index: -1; right: -150px;     /* 注意这里是负值z-index */
}
```

在 `.box` 上添加了 `display: flex` 属性，此时，图片将显示在蓝色背景上。

**分析**：

第一次，由于此时的层叠上下文只有 `<img>`，所有的排序以根元素 `<html>` 为坐标系；

因为：`<img>` 的 `z-index` 为 `-1`，`<div>` 的 `z-index` 为 `1`，所以 `<img>` 在下，拥有蓝色背景的 `<div>` 在上；

第二次，由于 `.box` 添加了 `display: flex`，由于满足了条件中：

> z-index 值不为 auto 的 flex 项目（即：父元素 display: flex|inline-flex）；

所以，`<div>` 形成了新的「层叠上下文」，`<img>` 的 `z-index:-1` 无法穿透 `<div>`，所以元素以 `<div>` 为坐标系进行层叠排序；由于 *backgorund / border* 的顺序小于 *inline / inline-block 水平盒子*，所以 `<img>` 在蓝色背景之上。

### 0x01

> **opacity 与层叠上下文**
> 
> 出自 [深入理解 CSS 中的层叠上下文和层叠顺序 « 张鑫旭-鑫空间-鑫生活](https://www.zhangxinxu.com/wordpress/2016/01/understand-css-stacking-context-order-z-index/)

现有如下结构：

```html
<div class="box">
  <img src="pic.jpg">
</div>
```

第一次 CSS 代码：

```css
.box { background-color: blue;  }
.box > img { 
  position: relative; z-index: -1; right: -150px;
}
```

将会显示为**图片在下**，**蓝色背景在上**。

第二次 CSS 代码：

```css
.box { background-color: blue; opacity: 0.5;  }
.box > img { 
  position: relative; z-index: -1; right: -150px;
}
```

在 `.box` 上添加了 `opacity: 0.5` 属性，此时，图片将显示在蓝色背景上。

分析：

第一次，由于此时的层叠上下文只有 `<img>`，所有的排序以根元素 `<html>` 为坐标系；

因为：`<img>` 的 `z-index` 为 -1，`<div>` 的 `z-index` 为 1，所以 `<img>` 在下，拥有蓝色背景的 `<div>` 在上；

第二次，由于 `.box` 添加了 `opacity: 0.5`，由于满足了条件中：

> `opacity` 属性值小于 `1` 的元素；

所以，`.box` 形成了新的「层叠上下文」，`<img>` 的 `z-index:-1` 无法穿透 `.box`，所以元素以 `.box` 为坐标系进行层叠排序；由于 *backgorund / border* 的顺序小于 *inline / inline-block 水平盒子*，所以 `<img>` 在蓝色背景之上。

### 0x02

> **opacity 动画与定位元素**
> 
> 出自 [深入理解 CSS 中的层叠上下文和层叠顺序 « 张鑫旭-鑫空间-鑫生活](https://www.zhangxinxu.com/wordpress/2016/01/understand-css-stacking-context-order-z-index/)
> 
> [CSS3 fadeIn 淡入 animation 动画相关有趣显示现象 » 张鑫旭-鑫空间-鑫生活](https://www.zhangxinxu.com/study/201601/css3-fadein-animation-stacking-context.html)

现有如下结构：

```html
<div class="box">
    <span class="text">这是一段文字</span>
    <img class="fade" src="pic.jpg">
</div>
```

样式结构：

```css
/* 透明度帧动画 */
@keyframes fadeIn {
  0% { 
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.box {
  position: relative;
  /* 不重要的样式 */
}
.text {
  position: absolute;
  /* 不重要的样式 */
}
.fade {
  animation: fadeIn 2s 2s infinite;	
}
```

在最初的时候，默认样式为文字在图片之上；

在动画开始执行的时候，文字就被图片覆盖了，直到图片的透明度到 `1`，文字才会覆盖在图片上面。

这是因为：

在 `.fade` 图片元素的 `opacity` 不为 `1` 的时候，图片元素形成了一个**层叠上下文**，层叠顺序为 `z-index: auto`，文字元素 `.text` 是**定位元素**，这时候根据特性 [定位元素的层叠顺序](#定位元素的层叠顺序) 中提到的「**层叠上下文元素和定位元素是一个层叠顺序的，所以遵循的是「后来居上」的原则**」。

所以在图片元素的 `opacity` 不为 `1` 的时候，在文档流中处于之后的 *图片* 覆盖在之前的 *文字* 之上。

一旦图片元素的 `opacity` 为 `1` 的时候，身为**定位元素且 `z-index` 生效为 `auto`** 的 *文字* 覆盖在**身为普通 `inline` 元素**的 *图片* 之上。

**解决办法**：

1. 调整 DOM 流的先后顺序；
2. 提高文字的层叠顺序，例如，设置 `z-index: 1`。

## 总结

- 层叠上下文可以包含在其他层叠上下文中，并且一起创建一个有层级的层叠上下文。

- 每个层叠上下文完全独立于它的兄弟元素：当处理层叠时只考虑子元素。（也就是不同层叠上下文的子元素相互毫无关系）

- 每个层叠上下文是自包含的：当元素的内容发生层叠后，整个该元素将会「在父层叠上下文中」按顺序进行层叠。

- 没有创建自己的层叠上下文的元素，将被父层叠上下文包含。

## 参考资料

> [The stacking context - Web 开发者指南 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Understanding_z_index/The_stacking_context)
> 
> [深入理解CSS中的层叠上下文和层叠顺序 « 张鑫旭-鑫空间-鑫生活](https://www.zhangxinxu.com/wordpress/2016/01/understand-css-stacking-context-order-z-index/)