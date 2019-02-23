# CSS 中的混合模式

## 混合模式

### 简介

熟悉 Photoshop 的人应该对图层、混合模式并不陌生。

混合模式本质是分别取前景和背景（参与混合的两个图层）的像素点，然后用它们的颜色值进行数学运算，从而得到一个新的颜色值。每一个重叠区域的像素点都会经过这个计算过程。

### 原理

混合模式本质是分别取 *前景* 和 *背景*（参与混合的两个图层）的**像素点**，然后用它们的颜色值进行**数学运算**，从而得到一个**新的颜色值**用来显示。每一个**重叠区域**的像素点都会经过这个计算过程。

既然我们要对每个像素点的颜色进行数学运算，那我们就要将每个像素点的颜色转换为数字。在混合模式里，所有通道的颜色值都是一个 `0~1` 的小数（前闭后闭）。

颜色都可以用 RGB 来表示，如纯白色在 CSS 中可以表示为 `rgb(255, 255, 255)`。RGB 三个通道的最大值为 `255`，最小值为 `0`，因此可以用 `通道色值 ÷ 255` 的表达式，将其转换为 `0~1` 的数字。比如纯白色将是 `rgb(1, 1, 1)`。

❗️需要注意的是：在图层**设置了透明度**的情况下，混合的计算式中的数字**仍然取图层原本的像素颜色**（也就是 `opacity: 1` 时看到的颜色）。

---

**用「正片叠底」来举例说明**：

正片叠底（Multiply）的计算式是：`x = a × b`。

> `a`：前景图层
> `b`：背景图层

因为 `a` 和 `b` 都是 `0~1` 之间的小数，结果值 `x` 会小于 `a` 和 `b`，所以「正片叠底」是一个**变暗**的运算。

正片叠底计算过程图示：

![正片叠底计算过程](https://image-static.segmentfault.com/169/439/1694394169-56ac5a143b682_articlex)

## Web 中的混合模式

Web 中可用的混合模式如下：

![网页中可用的混合模式](https://image-static.segmentfault.com/148/739/1487392566-56ac5a0b8a007)

上图是对照 Photoshop 里的混合模式来标注的，其中**紫红色**部分是 CSS 中可用的混合模式，右边则是混合模式的群组分类。把「正常」也算上的话，现在 CSS 中可用的混合模式一共 16 种。

虽然混合模式种类不少，但最为常用的并不多，它们分别是[正片叠底](#multiply-正片叠底)（Multiply）、[滤色](#screen-滤色)（Screen）、[叠加](#overlay-叠加)（Overlay）和[柔光](#soft-light-柔光)（Soft Light）。

### 基础知识

**基色**：指当前图层之下的图层颜色。

**混合色**：指当前图层的颜色。

**结果色**：指混合后得到的颜色。

**通道**：颜色的分量。如 RGB 有三个通道，即 `R`：红色通道，`G`：绿色通道，`B`：蓝色通道，每个通道上的数值（0~255）通俗来讲表示的是该通道发出光的亮度；单论一个通道，是没有色彩的，只有相互叠加才会衍生出彩色。（[如何通俗易懂地讲解 Photoshop 中的「通道」概念？ - 知乎](https://www.zhihu.com/question/21849710)）

**反相**：将某个颜色换成它的补色，即用 `255` 分别减去 RGB 对应通道的值，可得到的即为反相 RGB 值。

**饱和度**：指色彩的纯洁性，也称色彩的纯度；所以各种纯色是最饱和的色彩。饱和度取决于该色中含色成分和消色成分（灰色）的比例。

**对比度**：是指一幅图像中明暗区域**最亮的白**和**最暗的黑**之间不同亮度层级的测量，差异范围越大代表对比越大。

**HSL**：`H` 指色相（Hue）；`S` 指饱和度（Saturation）；`L` 指亮度（Lightness）。

> 色相（H）:是色彩的基本属性，就是平常所说的颜色名称，如红色、黄色等。
> 
> 饱和度（S）:是指色彩的纯度，越高色彩越纯，低则逐渐变灰，取 0-100% 的数值。
> 
> 亮度（L）:取 0-100%。

公式标识符约定：

> 举例：C = d × A + (1 - d) × B

`A`：基色颜色值；`B`：混合色颜色值；`C`：结果色颜色值；`d`：对应该层的透明度（如：`d × A` 表示基色加上透明度后的颜色值）

这里的计算都是基于 RGB 对应通道的数值（即 `0~255`）。

## 基础

### normal 正常

> 在此模式下，「混合色」的显示与透明度有关。

如果透明度为 `1`，只显示混合色，如果透明度为 `0` 则只显示基色。

**计算公式**：`C = d × A + (1 - d) × B`

## 减色（变暗）

### darken 变暗

> 查看每个通道中的颜色信息，并选择 *基色* 或 *混合色* 中「**较暗**」的颜色作为结果色。

**计算公式**：`C = Min(A, B)`

### multiply 正片叠底

> 查看每个通道中的颜色信息，并将 *基色* 与 *混合色* 复合。

**计算公式**：`C = (A × B) / 255`

### color-burn 颜色加深

> 查看每个通道中的颜色信息，并通过**增加对比度**使 *基色* **变暗**以反映混合色，如果与白色混合的话将不会产生变化。

**计算公式**：`C = (A反相 × B反相) / B`

## 加色（提亮）

### lighten 变亮

> 查看每个通道中的颜色信息，并选择 *基色* 或 *混合色* 中**较亮**的颜色作为结果色。

**计算公式**：`C = Max(A, B)`

### screen 滤色

> 与「正片叠底」相反，查看每个通道的颜色信息，将图像的 *基色* 与 *混合色* 结合起来产生**比两种颜色都浅**的第三种颜色。

**计算公式**：`C = 255 - [(A反相 × B反相) / 255]`

### color-dodge 颜色减淡

> 查看每个通道中的颜色信息，并通过**减小对比度**使 *基色* **变亮**以反映混合色，与黑色混合则不发生变化。

**计算公式**：`C = A - [(A反相 × B反相) / B]`

## 融合（对比）

### overlay 叠加

> 把图像的 *基色* 与 *混合色* 相混合产生一种**中间色**。

「基色」中颜色比「混合色」**暗**的颜色使「混合色」颜色**倍增**；

「基色」中颜色比「混合色」**亮**的颜色使「混合色」颜色**被遮挡**；

**计算公式**：

- A <= 128
  
  `C = (A × B) / 128`

- A > 128
  
  `C = 255 - [(A反相 × B反相) / 128]`

### soft-light 柔光

> 产生一种柔光照射的效果。

如果「混合色」比「基色」**更亮**一些，那么「结果色」将**更亮**；

如果「混合色」比「基色」**更暗**一些，那么「结果色」将**更暗**，使图像的亮度反差增大。

**计算公式**：

- B <= 128
  
  `C = [(A × B) / 128] + [(A / 255)^2 × (255 - 2B)]`

- B > 128
  
  `C = [(A × B) / 128] + [(A / 255)^1/2 × (2B - 255)]`

### hard-light 强光

> 产生一种强光照射的效果。

实质上和「柔光」（soft-light）是一样的，只是效果比「柔光」更加强烈。

经过实验：`hard-light` 等于调换「基色」和「混合色」的 `overlay`。

**计算公式**：

- B <= 128
  
  `C = (A × B) / 128`

- B > 128
  
  `C = 255 - [(A反相 × B反相) / 128]`

## 变异（简单运算）

### difference 差值

> 查看每个通道中的颜色信息，从图像中 *基色* 的亮度值**减去** *混合色* 的亮度值，如果结果为负，则取正值，产生反相效果。

**计算公式**：`C = |A - B|`

### exclusion 排除

> 与「差值」模式相似，但是具有**高对比度**和**低饱和度**的特点；比用「差值」模式获得的颜色要柔和、更明亮一些。

**计算公式**：`C = A + B - [(A × B) / 128]`

## 色彩叠加（颜色成分）

### hue 色相

> 选择 *基色* 的**亮度**和**饱和度**值与 *混合色* 进行混合而创建的效果。

> 混合后的**亮度及饱和度取决于基色**，但**色相取决于混合色**。

**计算公式**：H<sub>c</sub>S<sub>c</sub>L<sub>c</sub> = H<sub>B</sub>S<sub>A</sub>L<sub>A</sub>

### saturation 饱和度

> 在保持 *基色* **色相**和**亮度值**的前提下，只用 *混合色* 的**饱和度**值进行着色。
> 
> *基色* 与 *基色* 的**饱和度值不同时**，才使用 *混合色* 进行着色处理。若饱和度为 **0**，则与任何混合色叠加均无变化。
> 
> 当基色不变的情况下，混合色图像饱和度越低，结果色饱和度越低；混合色图像饱和度越高，结果色饱和度越高。

简而言之就是使用「混合色」的**饱和度**进行着色。

**计算公式**：H<sub>c</sub>S<sub>c</sub>L<sub>c</sub> = H<sub>A</sub>S<sub>B</sub>L<sub>A</sub>

### color 颜色

> 引用 *基色* 的**明度**和 *混合色* 的**色相**与**饱和度**创建结果色。

它能够使用「混合色」的**饱和度**和**色相**同时进行着色，这样可以**保护图像的灰色色调**，但结果色的**颜色由混合色决定**。

颜色模式可以看作是饱和度模式和色相模式的综合效果，一般用于为图像**添加单色效果**。

**计算公式**：H<sub>c</sub>S<sub>c</sub>L<sub>c</sub> = H<sub>B</sub>S<sub>B</sub>L<sub>A</sub>

### luminosity 亮度

> 能够使用 *混合色* 的**亮度**值进行着色，而保持基色的饱和度和色相数值不变。

其实就是用「混合色」的**亮度**创建结果色。

**计算公式**：H<sub>c</sub>S<sub>c</sub>L<sub>c</sub> = H<sub>A</sub>S<sub>A</sub>L<sub>B</sub>

## mix-blend-mode

在 CSS 中可用的混合模式一共 16 种：

```css
.mix-blend-mode {
  mix-blend-mode: normal;      /* 正常 */
  mix-blend-mode: multiply;    /* 正片叠底 */
  mix-blend-mode: screen;      /* 滤色 */
  mix-blend-mode: overlay;     /* 叠加 */
  mix-blend-mode: darken;      /* 变暗 */
  mix-blend-mode: lighten;     /* 变亮 */
  mix-blend-mode: color-dodge; /* 颜色减淡 */
  mix-blend-mode: color-burn;  /* 颜色加深 */
  mix-blend-mode: hard-light;  /* 强光 */
  mix-blend-mode: soft-light;  /* 柔光 */
  mix-blend-mode: difference;  /* 差值 */
  mix-blend-mode: exclusion;   /* 排除 */
  mix-blend-mode: hue;         /* 色相 */
  mix-blend-mode: saturation;  /* 饱和度 */
  mix-blend-mode: color;       /* 颜色 */
  mix-blend-mode: luminosity;  /* 亮度 */

  mix-blend-mode: initial;     /* 初始 */
  mix-blend-mode: inherit;     /* 继承 */
  mix-blend-mode: unset;       /* 复原 */
}
```

`mix-blend-mode` 是应用于**多个元素之间**，而且除背景外，元素内的文字等**其他内容也会被混合**。

该属性在作用一个元素的时候，也会作用在其**全部子元素**。所以，如果不想让某个子元素受到影响，可以配合 [**isolation**](#isolation) 使用。

### 例子

```html
<div class="container">
    <div class="blending-element-1"></div>
    <div class="blending-element-2"></div>
</div>
```

```css
.blending-element-1,
.blending-element-2 {
    mix-blend-mode: soft-light;
}
```

:::warning 现在抛出一些问题：
1. 只要这两个元素重叠，就会发生混合，那么只有这两个元素之间混合吗？

2. 如果父元素 `.container` 也有背景，甚至还有其他元素位于其下方的话，也会参与混合吗？
:::

归根到底，都是**界定哪些元素参与混合**的问题，规范是这样的：

> 以层叠上下文（stacking context）为标准，为元素进行分组，位于**同一个层叠上下文内的所有元素**算作同一组，同一组内才能**发生混合**。
> 
> 👉🏻 有关层叠上下文见 [深入理解 CSS 层叠上下文](./css-stacking-context.html)

### 多个层叠上下文混合

在复杂的 DOM 树中，可能有**多个元素都设置了混合模式**；

这时候，总是**组内的所有元素先相互混合**，然后把整个组**看作一个整体**，再和组外的其他元素混合。

由于 DOM 元素默认的混合方式都是 normal，也就是上层遮挡下层，因此不同组的元素，看起来就好像组内和组外隔离了开来。

## background-blend-mode

顾名思义，该属性控制的是**背景的混合模式**，通常配合属性 `background-image` 的多图片背景，来达到我们想要的混合效果。

与 `mix-blend-mode` 应用于**多个元素之间**不同，`background-blend-mode` 是应用在**单个元素的多背景之间**。

### 例子

`background-blend-mode` 和 `background-image` 一样，可以指定多个值：

```css
.blending-element {
    background-image: url(1.jpg), url(2.jpg), url(3.jpg);
    /* 指定多个背景，从上到下依次是1.jpg、2.jpg、3.jpg */

    background-blend-mode: multiply, screen;
    /* 1.jpg 的混合模式是 multiply，2.jpg 的混合模式是 screen，3.jpg 的混合模式是 multiply */
    /* 当 background-blend-mode 的数目比 background-image 少时，会按照值列表进行重复，所以 3.jpg 的混合模式是multiply */
}
```

❗️需要注意的是，如果元素指定了背景色 `background-color`，那么背景色将成为**最下层的背景**。

在上面的例子中，由于没有指定背景色，所以最下层的 `3.jpg` 的混合模式 `multiply` 其实是没有作用的，可以认为是默认值 `normal`。

[两行 CSS 代码实现图片任意颜色赋色技术 - ChokCoco - 博客园](https://www.cnblogs.com/coco1s/p/8080211.html)

<iframe height="265" style="width: 100%;" scrolling="no" title="纯色图片赋色技术尝试" src="//codepen.io/airen/embed/MqYepq/?height=265&theme-id=0&default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/airen/pen/MqYepq/'>纯色图片赋色技术尝试</a> by Airen
  (<a href='https://codepen.io/airen'>@airen</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## isolation

### 简介

`isolation` 拥有如下属性：

```css
.mix-blend-mode {
  isolation: isolate; /* 隔离 */
  isolation: auto;    /* 没啥用 */
  isolation: inherit; /* 继承 */
}
```

该属性一般用于配合 [mix-blend-mode](#mix-blend-mode) 属性使用，用于在混合模式下，隔离出不希望参与混合模式的元素。

该元素不会影响 `background-blend-mode`，因为其本质上就是控制单个元素的背景混合模式，本来就是一个封闭的空间，不会影响外界元素。

### isolation: isolate 作用的原理

`isolation: isolate` 之所以可以阻断混合模式，本质上是因为它创建了一个新的 [层叠上下文](./css-stacking-context.html)（stacking context）。

就仅仅只是创建了一个新的层叠上下文，没有做其他的事情！（张老师就是这么说的）

张老师还说了，除了 `isolation: isolate` 可以阻断混合模式，只要是层叠上下文，都可以阻断混合模式，更多创建层叠上下文方法见：[创建层叠上下文 - 层叠上下文](./css-stacking-context.html#创建层叠上下文)。

## 混色模式的应用

### Screen 滤色

配合滤色，以及一个上到下透明到纯黑的混合色，做出的**文字淡出**特效。

<iframe height="265" style="width: 100%;" scrolling="no" title="Fading text with CSS blend modes" src="//codepen.io/airen/embed/dqPXgX/?height=265&theme-id=0&default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/airen/pen/dqPXgX/'>Fading text with CSS blend modes</a> by Airen
  (<a href='https://codepen.io/airen'>@airen</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

每个镜像渐变的火焰小圆球，配合滤色加深他们之间叠加的部分，配合父元素的轻微 `blur`，做出的**火焰**特效 🔥。

<iframe height="265" style="width: 100%;" scrolling="no" title="CSS Blend Mode Fire" src="//codepen.io/airen/embed/yxyJvR/?height=265&theme-id=0&default-tab=css,result" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/airen/pen/yxyJvR/'>CSS Blend Mode Fire</a> by Airen
  (<a href='https://codepen.io/airen'>@airen</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

### Lighten

仿古效果 = `lighten` 混合模式 + 元素背景做为影子颜色。

[CSS处理图像效果：仿古效果_css blend modes, CSS混合模式, CSS处理图像效果, CSS3 教程_w3cplus](https://www.w3cplus.com/css3/vintage-washout.html)

## 参考资料

> [CSS3混合模式mix-blend-mode/background-blend-mode简介 «  张鑫旭-鑫空间-鑫生活](https://www.zhangxinxu.com/wordpress/2015/05/css3-mix-blend-mode-background-blend-mode/)
> 
> [理解CSS3 isolation: isolate的表现和作用 «  张鑫旭-鑫空间-鑫生活](https://www.zhangxinxu.com/wordpress/2016/01/understand-css3-isolation-isolate/)
> 
> [神奇的CSS3混合模式 - 大转转FE - CSDN博客](https://blog.csdn.net/P6P7qsW6ua47A2Sb/article/details/81024366)
> 
> [更丰富的网页多图层效果：css混合模式 - 庭院茶 - SegmentFault 思否](https://segmentfault.com/a/1190000004391765)
> 
> [CSS混合模式高级应用_CSS, CSS混合模式, css blend modes 教程_w3cplus](https://www.w3cplus.com/css/advanced-effects-with-css-background-blend-modes.html)
> 
> [css blend modes_入门 精通 教程_w3cplus](https://www.w3cplus.com/blog/tags/408.html)

## 附件

### Ps 中的混合模式

![Ps 中的混合模式](http://img.zcool.cn/community/021f0155d59a11000001365684b104.jpg)