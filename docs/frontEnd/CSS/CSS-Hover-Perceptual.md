# 利用纯 CSS 完成感知悬停

今天看见了一个利用纯 CSS 制作的感知悬停，[示例页面](http://www.jq22.com/code/20170307233848.html) 做出了和百度图片一样的悬停效果，而且更家吸引我的是用的是纯 CSS，虽然我不知道百度图片用的是什么方法，但是对于一个 **`能用 CSS 就别用 JS`** 主义者的我当然是引起了极大的兴趣~

![演示动画](https://ws1.sinaimg.cn/large/006DJj5Hgy1g5tyqlm5ing30ci07yx6r.gif)
<center><small>效果图</small></center>

话不多说先看看页面的源码去分析一下~

## HTML 结构

在看 CSS 之前先和大家说说这个页面的 HTML 结构吧

```html
<div class="row">
    <div class="col">
        <div class="photo-container" style="background-image:url(https://source.unsplash.com/600x250/?sig=241)"></div>
        <h2>Image 241 </h2>
        <div class="slide">
            <p>Quam molestiae ipsa sapiente mollitia, nobis.</p>
        </div>
    </div>
    <div class="col">
        <div class="photo-container" style="background-image:url(https://source.unsplash.com/600x250/?sig=203)"></div>
        <h2>Image 203 </h2>
        <div class="slide">
            <p>Autem possimus perspiciatis, eaque quos repudiandae modi labore sed repellat dolorum magnam praesentium expedita esse tempore saepe nulla.</p>
        </div>
    </div>
    <div class="col">
        <div class="photo-container" style="background-image:url(https://source.unsplash.com/600x250/?sig=17)"></div>
        <h2>Image 17 </h2>
        <div class="slide">
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
        </div>
    </div>
</div>
```

一个 **`row`** 代表了一行，该行下面的每一块图片区域都是一个 **`col`**；

每个 **`col`** 下有图片的 `<div class="photo-container">` 容器；

以及 **hover** 后显示的内容区域 **`slide`**；

这些元素的样式我们就不需要去分析他们了看我们项目的需求而定，我们要解开的是 `slide` 的面纱。

----------

## CSS 部分

既然说的是利用的纯css实现的效果那我们现在就去看看它的css部分

```css
/* The magic */
.col {
  overflow: hidden;
  position: relative;
}

.slide {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  /* 
    Visibility delay gives the previously hovered element time to slide out before disappearing.
    Remove the `visibility` transition to slide in current element without sliding out previous element
  */
  -webkit-transition: all 0.275s ease-in-out, visibility 0s 0.275s;
  transition: all 0.275s ease-in-out, visibility 0s 0.275s;
  visibility: hidden;
  will-change: transform;
  -webkit-transform: translateY(100%);
          transform: translateY(100%);
}

.row:hover ~ .row .slide {
  -webkit-transform: translateY(-100%);
          transform: translateY(-100%);
}
.row:hover .slide {
  -webkit-transform: translateX(100%);
          transform: translateX(100%);
}
.row:hover .col:hover ~ .col .slide {
  -webkit-transform: translateX(-100%);
          transform: translateX(-100%);
}
.row:hover .col:hover .slide {
  -webkit-transform: none;
          transform: none;
  visibility: visible;
  -webkit-transition-delay: 0s;
          transition-delay: 0s;
}
```

可以说作者真的是非常的贴心还写上了注释方便大家看懂这些代码

以一段 `The magic` 开头告诉我们作者要开始施展膜法了

这里详细介绍一些 CSS 内容希望如果有大神看到勿喷，只是希望自己记的详细一点。

### 分析

1. 首先这个 `col` 的区域要 `overflow: hidden;` 掉，来隐藏提示区域，`position: relative;` 不用说，就是给 `slide` 提供坐标参考。

2. `slide` 的上右下左四个方向的坐标为 `0`，指的是当 `position: absolute;` 的时候，规定这个容器的四条边到父容器四条边的距离，加上不设置高度宽度，这个容器就被定义的高度和宽度，相当于设置了 `width: 100%; height: 100%;`

3. 接下来作者说了

    >*Visibility delay gives the previously hovered element time to slide out before disappearing.*
    >
    >给上一个hover的元素的 `visibility` 属性延时隐藏（既 0.275s 后隐藏，和其他动画的 transition-duration 一样），让它在消失前有滑出的动效。
    >
    >*Remove the `visibility` transition to slide in current element without sliding out previous element*
    >
    >在前一个元素的提示区域滑出，且当前元素被 hover 时去除其 `visibility` 的延时（既让它立即显示）。让用户看得到滑入动画效果。

    就是这个 `visibility` 的 `transition-delay` 让我们能够看到滑入和滑出的动效；

4. 接下来的 `will-change` 的作用是提高页面动画渲染效率，因为总是要改变所以把它放在了 `slide` 默认属性中，详见 [关于 will-change 的用法以及一些 web 动画渲染优化](./will-change) 。

5. 最后的 `transform: translateY(100%);` 是 `slide` 的默认位置，既 `col` 的下方。

接下来的语句就是控制 **提示区域位置** 的规则啦，这里就不多说了。

### 第一条规则

```css
.row:hover ~ .row .slide {
  -webkit-transform: translateY(-100%);
          transform: translateY(-100%);
}
```

**语法解读**：

当 `row` 被 hover 后，在当前 `row` 后的所有 `row` 下的所有提示区域 `slide` 都在父元素 `col` 的上方。

**语意解读**：

第 **X** 行被 hover 后，后面的第 **X+1**，**X+2**，**X+3**，...，**X+n** 行下的所有**提示区域**都移动到**内容区域**的上方，这样，在鼠标往下移动的时候下一行的提示区域就可以从上方移动至中央出现。

### 第二条规则

```css
.row:hover .slide {
  -webkit-transform: translateX(100%);
          transform: translateX(100%);
}
```

**语法解读**：

当 `row` 被 hover 后，在当前 `row` 下的所有提示区域 `slide` 都在父元素 `col` 的右侧。

**语意解读**：

既第 **X** 行被 hover 后，这一行下的所有**提示区域**都移动到**内容区域**的右侧，为了鼠标从右侧移入内容区域的时候提示区域可以从内容区域的右侧移至中央出现。

因为 CSS 只能选择某一元素之后的元素，不能选择该元素之前的元素，所以用了比[第三条规则](#第三条规则)优先级更小的选择语句，来设置被 hover 的 `col` **之前**的 `col` 下的提示区域 `slide` 的位置（**既第三条规则选择不到的元素**）

### 第三条规则

```css
.row:hover .col:hover ~ .col .slide {
  -webkit-transform: translateX(-100%);
          transform: translateX(-100%);
}
```

**语法解读**：

当 `row` 被 hover 后，并且 `col` 被 hover 的条件下，在当前 `col` 之后的所有 `col` 的提示区域 `slide` 都在父元素 `col` 的左边。

**语意解读**：

因为这条优先级大于之前的第二条规则语句的优先级，故当某一个 `col` 被 hover 后，其**之后**的所有 `col` 都下的提示区域 `slide` 都会位于内容区域的左侧，以用来当鼠标从左侧移入内容区域的时候提示区域可以从内容区域的左侧移至中央出现

### 第四条规则

```css
.row:hover .col:hover .slide {
  -webkit-transform: none;
          transform: none;
  visibility: visible;
  -webkit-transition-delay: 0s;
          transition-delay: 0s;
}
```

**语法解读**：

当 `row` 被 hover 后，并且 `col` 被 hover 的条件下，当前的 `col` 回归原始位置，并且 `transition-delay:` 设置为 `0s` 用来立即显示元素。

之后的 CSS 就是用来设置 `row` `col` `slide` 等元素的样式了，也就不详细解析了。

----------

## 总结

主要利用了 CSS 伪元素 `:hover` 以及 `~` 选择器，根据 hover 的元素来进行提示区域 `slide` 位置的设置，个人认为比较核心的点除了位置控制，还有那一段 `visibility` 延时隐藏的语句，那是动画能否显示的核心，加上学习了 `will-change` 属性，收获颇多，希望能够用到自己的实践中去~

记录于 2017-05-03 15:18