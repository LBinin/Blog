# 论不同动画衔接之间的小技巧

## 起初

今天在看到 [3D 轨道分割图像](http://www.jq22.com/code/20170412005647.html) 这个示例的时候起初没有在意图片背后的悬浮动画，觉得这个只是加载了一张图片然后分成 4 块，hover 上去的时候就合并在一起，就是 4 块图片的**transition-delay** 不同，后来看着看着发现其实4块图片整体是有一个 3D 浮动的动画，而且当我 hover 上去的时候不管现在整体悬浮到那个位置都会顺滑的回到平面，勾起了我的好奇心。

![审查](https://ws1.sinaimg.cn/large/006DJj5Hgy1g5tzaedsuij31120ncajt.jpg)

## 当初

当初如果是要我做的话，我会给整体它一个 `infinite` 的 `animation` 给个 `5s` 的时间让他自己不断悬浮，然后 hover 上去的时候回到平面，不过这样做的一个非常大的弊端就是：

>**在 hover 上的那一瞬间，不管 animation 进行到哪一帧，都会立马回到最初的 CSS**

所以在这个 `animation` 和 `transition` 之间的衔接就会很突兀，以前也没有去细想，如今看到了之后发现这是我需要的东西。

## 审查

刚开始检查类名为 `block__image` 的元素因为它装载了这 4 张图片，也是它进行的 `rotate3D`，他有一条 CSS 引起了我的好奇

```css
transition: 5s ease-in-out;
```

起初我还在好奇怎么用的不是 `animation`，后来它的 `style` 亮了一下发生了改变，内容变为 `transform: rotate3d(1.6, 0.7, 0, 1deg);`，突然有所感悟，接着审查的结果证明了我的想法。

用 chrome 去 hover 了一下类名为 `block__content` 的元素看看 `block__image` 发生了什么改变

```css
.block--split-image .block__content:hover + .block__image {
    -webkit-transition-duration: 0.5s;
    transition-duration: 0.5s;
    -webkit-transform: rotate3d(0, 0, 0, 0deg) !important;
    transform: rotate3d(0, 0, 0, 0deg) !important;
}
```

![审查](https://ws1.sinaimg.cn/large/006DJj5Hgy1g5tzci4tpej31480pwnmz.jpg)

`block__image` 这个整体的 `transition-duration` 变成了 `0.5s`，我把他改成了 `5s`，发现它回归平面的时间变久了，同时也可以发现下方的 `duration` 已经被覆盖，说明这正是让他回到平面的时间，之后的 `transform: rotate3d(0, 0, 0, 0deg) !important;` 让他强制回到平面，因为 JS 控制的 `style` 属性优先级最高。最后去 JS 中证实一下自己：

```javascript{16,17,18}
// Let's get our orbit on, man...
var orbit = {
    // Initialize the orbiting
    init: function(selector) {
        this.elements = document.querySelectorAll(selector || '[data-orbit]');

        // Set the update interval
        this.setupIntervals();
    },

    // Setup the intervals for rotating
    setupIntervals: function() {
        var self = this;
        this.elements.forEach(function(el) {
            self.update(el);
            this.interval = setInterval(function() {
                self.update(el);
            }, 5000);
        });
    },

    // Update the orbit rotate3d
    update: function(el) {
        var min = -1;
        var max = 1;

        // Get our rotate values
        var rotate = [
            (Math.floor(Math.random() * (max - min + 1)) + min) + '.' + (Math.floor(Math.random() * 9) + 1),
            (Math.floor(Math.random() * (max - min + 1)) + min) + '.' + (Math.floor(Math.random() * 9) + 1)
        ];

        // Set the transform
        el.style.webkitTransform = 'rotate3d(' + rotate[0] + ', ' + rotate[1] + ', 0, 1deg)';
        el.style.MozTransform = 'rotate3d(' + rotate[0] + ', ' + rotate[1] + ', 0, 1deg)';
        el.style.msTransform = 'rotate3d(' + rotate[0] + ', ' + rotate[1] + ', 0, 1deg)';
        el.style.OTransform = 'rotate3d(' + rotate[0] + ', ' + rotate[1] + ', 0, 1deg)';
        el.style.transform = 'rotate3d(' + rotate[0] + ', ' + rotate[1] + ', 0, 1deg)';
    }
}

// Start it up
orbit.init();
```

正是 16-18 行每隔 `5s` 执行一次 `update` 函数，`update` 用来改变它的 `rotate3D`。

-----------

## 技巧

以后遇到这种需求的时候，可以考虑利用 `transition` 的优点 ——「动画衔接连续」。

1. 用 JS 控制 **操作之前** 的动画，CSS 中用 `transition` 实现 **操作之前** 的动画的 `duration`；

2. 操作后用 **CSS 伪元素** 控制新的 `duration` 和新的终点属性，记得要用 `!important` 让它覆盖 JS 控制的样式；

3. 鼠标离开前加上塞贝尔曲线 `cubic-bezier(0.65, 0.05, 0.36, 1)`，鼠标离开后还可以加上回弹效果 `0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)` 会有一种难以合拢，一松开就回弹的效果，让用户感觉更有活力

一个简单的动画衔接就是这样，一些小技巧没什么多深的知识点也说不上有非常大的作用，因为对于我而言用户体验非常重要，这一点小细节可以看出作者的认真。希望日后可以用到自己的实践中。

记录于 2017-05-02 17:38

