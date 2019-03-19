# 视图层

## WXML

### 简介

WXML（ WeiXin Markup Language ）是框架设计的一套标签语言，结合基础组件、事件系统，可以构建出页面的结构。

其中有许多地方与 Vue 类似，本篇文章主要记录与 Vue 不同的地方。

### 数据绑定

> WXML 中的动态数据均来自对应 `page.js` 的 `Page()` 参数对象中的 `data` 字段。

举个例子 🌰 ：

```html
<!-- 使用 Mustache 语法（双大括号）将变量包起来 -->
<view> {{ message }} </view>
```

```js
Page({
  data: {
    message: 'Hello Lin!'
  }
})
```

如果在组件属性、控制属性、关键字中使用变量，也需要使用双大括号：

```html
<view id="item-{{id}}"> </view>
<view wx:if="{{condition}}"> </view>
<checkbox checked="{{false}}"> </checkbox>
<!-- 这里需要使用双大括号 -->
<!-- 不要直接写 checked="false"，其计算结果是一个字符串，转成 boolean 类型后代表真值。 -->
<!-- 上面的 wx:if 也是这个道理 -->
<!-- 如果没有加双大括号就会变成字符串 -->
```

```js
Page({
  data: {
    id: 0,
    condition: true
  }
})
```

可以在 `{{}}` 内进行简单的运算，支持的有如下几种方式：

* 三元运算

  ```html
  <view hidden="{{flag ? true : false}}"> Hidden </view>
  ```

* 算数运算

  ```html
  <view> {{a + b}} + {{c}} + d </view>
  ```

* 逻辑判断

  ```html
  <view wx:if="{{length > 5}}"> </view>
  ```

* 字符串运算

  ```html
  <view>{{"hello" + name}}</view>
  ```

* 数据路径运算

  ```html
  <view>{{object.key}} {{array[0]}}</view>
  ```

❗️ 最后一个需要注意的是：花括号和引号之间如果有空格，将最终被解析成为字符串

```html
<view wx:for="{{[1,2,3]}} ">
  {{item}}
</view>
<!-- 等同于 -->

<view wx:for="{{[1,2,3] + ' '}}">
  {{item}}
</view>
```

### 列表渲染

```html
<!--wxml-->
<view wx:for="{{array}}"> {{item}} </view>
```

```js
// page.js
Page({
  data: {
    array: [1, 2, 3, 4, 5]
  }
})
```

默认数组中每个项目的内容将储存到变量 `item` 中，可以通过属性 `wx:for-item="你的元素变量名"` 去修改。

默认的索引值储存在变量 `index` 中，可以通过属性 `wx:for-index="你的索引变量名"` 去修改。

```html
<view wx:for="{{array}}" wx:for-index="idx" wx:for-item="itemName">
  {{idx}}: {{itemName.message}}
</view>
```

#### wx:key

如果列表中项目的位置会动态改变或者有新的项目添加到列表中，并且希望列表中的项目保持自己的特征和状态（如 `<input/>` 中的输入内容，`<switch/>` 的选中状态），需要使用 `wx:key` 来指定列表中项目的唯一的标识符。

`wx:key` 的值以两种形式提供：

* 字符串，代表在 `for` 循环的 `array` 中 `item` 的某个 `property`，该 `property` 的值需要是列表中唯一的字符串或数字，且不能动态改变。（ 所以在写的时候不需要加上类似 `item.` 的字样，只需要直接在 `wx:key="属性名"` ）
* 保留关键字 `*this` 代表在 `for` 循环中的 `item` 本身，这种表示需要 `item` **本身是一个唯一的字符串或者数字**。

❗️ 需要注意的是：当 `wx:for` 的值为「字符串」时，会将字符串解析成字符串数组：

```html
<view wx:for="array">
  {{item}}
</view>
<!-- 等同于 -->

<view wx:for="{{['a','r','r','a','y']}}">
  {{item}}
</view>
```

### 条件渲染

使用 `wx:if="{{condition}}"` 来判断是否需要「渲染」该代码块：

```html
<!--wxml-->
<view wx:if="{{view == 'WEBVIEW'}}"> WEBVIEW </view>
<view wx:elif="{{view == 'APP'}}"> APP </view>
<view wx:else="{{view == 'MINA'}}"> MINA </view>
```

```js
// page.js
Page({
  data: {
    view: 'MINA'
  }
})
```

一般来说，`wx:if` 有更高的「切换消耗」而 `hidden` 有更高的「初始渲染消耗」。因此，如果需要频繁切换的情景下，用 `hidden` 更好，如果在运行时条件不大可能改变则 `wx:if` 较好。

### 模板

```html
<!--wxml-->
<!-- 定义模板 -->
<template name="staffName">
  <!-- 使用 name 属性，作为模板的名字。 -->
  <view>
    FirstName: {{firstName}}, LastName: {{lastName}}
  </view>
</template>

<!-- 使用模板 -->
<template is="staffName" data="{{...staffA}}"></template>
<template is="staffName" data="{{...staffB}}"></template>
<template is="staffName" data="{{...staffC}}"></template>
```

`data` 字段传入对象内容而不是一个对象，格式如：`firstName: 'Hulk', lastName: 'Hu'` 而不需要括号，所以上方使用的对象解包。

```js
// page.js
Page({
  data: {
    staffA: { firstName: 'Hulk', lastName: 'Hu' },
    staffB: { firstName: 'Shang', lastName: 'You' },
    staffC: { firstName: 'Gideon', lastName: 'Lin' }
  }
})
```

模板拥有自己的**作用域**，只能使用 `data` 传入的数据以及模版定义文件中定义的 `<wxs />` 模块。

### 事件

```html
<view bindtap="action"></view>
```

```js
Page({
  action: function(e) {
    console.log(e)

    // e 等于下面对象
    {
      /* BaseEvent 基础事件对象属性列表 */
      "type": "tap",      // 事件类型
      "timeStamp": 895,   // 事件生成时的时间戳（页面打开到触发事件所经过的毫秒数）
      "target": {         // 触发事件的源组件的一些属性值集合，就是用户当前进行操作的组件
        "id": "tapTest",  // 事件源组件的 id
        "dataset": {      // 事件源组件上由data-开头的自定义属性组成的集合
          "hi": "WeChat"
        }
      },
      "currentTarget": {  // 事件绑定的当前组件的一些属性值集合，也就是说当前函数是绑定在哪个组件上
        "id": "tapTest",
        "dataset": {
          "hi": "WeChat"
        }
      },

      /* CustomEvent 自定义事件对象属性列表（继承 BaseEvent） */
      "detail": {         // 额外的信息
        "x": 53,
        "y": 14
      },

      /* TouchEvent 触摸事件对象属性列表（继承 BaseEvent） */
      "touches": [{       // 触摸事件，当前停留在屏幕中的触摸点信息的数组，其中每个元素为一个 Touch 对象，表示当前停留在屏幕上的触摸点。
        "identifier": 0,  // 触摸点的标识符
        "pageX": 53,      // 距离文档左上角的距离，文档的左上角为原点 ，横向为X轴，纵向为Y轴
        "pageY": 14,
        "clientX": 53,    // 距离页面可显示区域（屏幕除去导航条）左上角距离，横向为X轴，纵向为Y轴
        "clientY": 14
      }],
      "changedTouches": [{// 触摸事件，当前变化的触摸点信息的数组
        "identifier": 0,
        "pageX": 53,
        "pageY": 14,
        "clientX": 53,
        "clientY": 14
      }]
    }
  }
})
```

其中，数据集的命名格式如下：

```html
<view data-alpha-beta="1" data-alphaBeta="2" bindtap="bindViewTap"> DataSet Test </view>
```

```js
Page({
  bindViewTap:function(event){
    event.currentTarget.dataset.alphaBeta === 1 // `-` 会转为驼峰写法
    event.currentTarget.dataset.alphabeta === 2 // 大写会转为小写
  }
})
```

#### detail 字段

自定义事件所携带的数据，如表单组件的提交事件会携带用户的输入，媒体的错误事件会携带错误信息，详见组件定义中各个事件的定义。

点击事件的detail 带有的 x, y 同 pageX, pageY 代表距离文档左上角的距离。

#### 事件分类

1. 冒泡事件：当一个组件上的事件被触发后，该事件会向父节点传递。
2. 非冒泡事件：当一个组件上的事件被触发后，该事件不会向父节点传递。

`bind` 事件绑定不会阻止冒泡事件向上冒泡，`catch` 事件绑定可以阻止冒泡事件向上冒泡，如 `bind:tap`、`catch:touchstart`

```html
<!-- 只有冒泡事件 -->
<view id="outer" bindtap="handleTap1">
  handleTap1
  <view id="middle" catchtap="handleTap2">
    handleTap2
    <view id="inner" bindtap="handleTap3">
      handleTap3 handleTap2
    </view>
  </view>
</view>
```

事件的捕获的阶段：

> 自基础库版本 1.5.0 起，触摸类事件支持捕获阶段。捕获阶段位于冒泡阶段之前，且在捕获阶段中，事件到达节点的顺序与冒泡阶段恰好相反。需要在捕获阶段监听事件时，可以采用 `capture-bind`、`capture-catch` 关键字，后者将中断捕获阶段和取消冒泡阶段。

```html
<view id="outer" bind:touchstart="handleTap1" capture-bind:touchstart="handleTap2">
  handleTap2 handleTap1
  <view id="inner" bind:touchstart="handleTap3" capture-bind:touchstart="handleTap4">
    handleTap2 handleTap4 handleTap3 handleTap1
  </view>
</view>

<view id="outer" bind:touchstart="handleTap1" capture-catch:touchstart="handleTap2">
  handleTap2
  <view id="inner" bind:touchstart="handleTap3" capture-bind:touchstart="handleTap4">
    handleTap2
  </view>
</view>
```

### 文件引用

WXML 提供两种文件引用方式 `import` 和 `include`。

为方便说明，现假设有如下 `item.wxml` 文件：

```html
<!-- item.wxml -->
<template name="item">
  <text>{{text}}</text>
</template>
```

- **`import`**

  ```html
  <!-- src 需要写入相对路径 -->
  <import src="item.wxml"/>
  <template is="item" data="{{text: 'forbar'}}"/>
  ```

- **`include`**

  ```html
  <!-- index.wxml -->
  <!-- src 需要写入相对路径 -->
  <include src="header.wxml"/>
  <view> body </view>
  <include src="footer.wxml"/>

  <!-- header.wxml -->
  <view> header </view>

  <!-- footer.wxml -->
  <view> footer </view>
  ```

#### 区别：

- `import` 有作用域的概念，即「只」会 `import` 目标文件中定义的 `template`（ 即仅仅引入 `<template name="xxx"/>` ），而不会 `import` 目标文件引用（`import`）的 `template` 及其他内容。

    **如：C `import` B，B `import` A，在 C 中可以使用 B 定义的 `template`，在 B 中可以使用 A 定义的 `template`，但是 C 不能使用 A 定义的 `template`。**

- `include` 可以将目标文件「除了」 `<template/>` `<wxs/>` 外的整个代码引入（ 即不会引入 `<template/>` 和 `<wxs/>` 内容 ），相当于是拷贝到 `include` 位置

## WXS

### 简介

WXS（WeiXin Script）是小程序的一套脚本语言，结合 WXML，可以构建出页面的结构。

WXS 代码可以编写在 wxml 文件中的 `<wxs>` 标签内，或以 `.wxs` 为后缀名的文件内。

举例：

```js
// page.js
Page({
  data: {
    array: [1, 2, 3, 4, 5, 1, 2, 3, 4]
  }
})
```

```html
<!--wxml-->
<!-- 下面的 getMax 函数，接受一个数组，且返回数组中最大的元素的值 -->
<wxs module="m1">
var getMax = function(array) {
  var max = undefined;
  for (var i = 0; i < array.length; ++i) {
    max = max === undefined ?
      array[i] :
      (max >= array[i] ? max : array[i]);
  }
  return max;
}

module.exports.getMax = getMax;
</wxs>

<!-- 调用 wxs 里面的 getMax 函数，参数为 page.js 里面的 array -->
<view> {{m1.getMax(array)}} </view>
<!-- 5 -->
```

### .wxs 文件

每一个 `.wxs` 文件和 `<wxs>` 标签都是一个单独的模块。

每个模块都有自己**独立的作用域**。即在一个模块里面定义的变量与函数，默认为私有的，对其他模块不可见。

一个模块要想对外暴露其内部的私有变量与函数，只能通过 `module.exports` 实现。

### wxs 标签

| 属性名  |  类型   |  默认值 | 说明                                                                           |
| ------ | ------ | ------ | ------------------------------------------------------------------------------ |
| module | String |        | 当前 `<wxs>` 标签的模块名。必填字段。                                          |
| src    | String |        | 引用 `.wxs` 文件的相对路径。**仅当本标签为单闭合标签或标签的内容为空时有效**。 |

### module

每个 `wxs` 模块均有一个内置的 `module` 对象。（同 ES Module）

### require

在 `.wxs` 模块中引用其他 `wxs` 文件模块，可以使用 `require` 函数。

需要注意的是：

- 只能引用 `.wxs` 文件模块，且必须使用**相对路径**。
- `wxs` 模块均为单例，`wxs` 模块在第一次被引用时，会自动初始化为单例对象。**多个页面，多个地方，多次引用**，使用的都是同一个 `wxs` 模块对象。
- 如果一个 `wxs` 模块在定义之后，一直没有被引用，则该模块不会被解析与运行。

```js
// /pages/tools.wxs
var foo = "'hello world' from tools.wxs";
var bar = function (d) {
  return d;
}
module.exports = {
  FOO: foo,
  bar: bar,
};
module.exports.msg = "some msg";


// /pages/logic.wxs
var tools = require("./tools.wxs");

console.log(tools.FOO);
console.log(tools.bar("logic.wxs"));
console.log(tools.msg);

module.exports.msg = "Hello World";
```

```html
<!-- /page/index/index.wxml -->
<wxs src="./../logic.wxs" module="logic" />
<!-- 这时候控制台会打印出 -->
<!-- 'hello world' from tools.wxs -->
<!-- logic.wxs -->
<!-- some msg -->

<view>{{logic.msg}}</view>
```

### wxs 注意点

1. wxs 不依赖于运行时的基础库版本，可以在**所有版本**的小程序中运行；

2. wxs 与 javascript 是**不同的**语言，有自己的语法，并不和 javascript 一致；

3. wxs 的运行环境和其他 javascript 代码是**隔离**的，wxs 中不能调用其他 javascript 文件中定义的函数，也不能调用小程序提供的 API；

4. wxs 函数**不能作为组件的事件回调**；

5. **`<wxs>` 模块只能在定义模块的 WXML 文件中被访问到。使用 `<include>` 或 `<import>` 时，`<wxs>` 模块不会被引入到对应的 WXML 文件中；**

6. `<template>` 标签中，只能使用定义该 `<template>` 的 WXML 文件中定义的 `<wxs>` 模块；

7. **`.wxs` 文件只能被别的 `.wxs` 文件引用，或者被其他的 WXML 中的 `<wxs>` 模块引用，或被 WXML 中 `<wxs src="**">` 的 `src` 属性引用；**

    `src` 为**相对路径**，仅当本标签为**单闭合标签**或标签的**内容为空**时有效；

9. 由于运行环境的差异，在 iOS 设备上小程序内的 wxs 会比 javascript 代码快 2 ~ 20 倍。在 Android 设备上二者运行效率无差异。

### WXS 响应交互事件

**频繁**的交互将会给我们带来较大的性能损耗，如：

> 移动元素，`touchmove` 从视图层发送数据到逻辑层，逻辑层处理完逻辑后通过 `setData` 发送到视图层，来改变元素的位置

这段过程需要**经过 2 次的逻辑层和渲染层的通信**以及**一次渲染**，通信的耗时比较大。

此外 `setData` 渲染也会**阻塞其它脚本**执行，导致了整个用户交互的动画过程会有延迟。

#### 解决方案

🍞 **减少通信的次数，让事件在视图层（Webview）响应。**

我们知道小程序的框架分为视图层（Webview）和逻辑层（App Service），这样分层的目的是「管控」，开发者的代码只能运行在逻辑层（App Service）；

而上面的思路就必须要让开发者的**代码运行在视图层**（Webview），也就是让 WXS 来**响应小程序（组件）的事件**。（不支持**自定义组件**事件）

WXS 函数的除了纯逻辑的运算，还可以通过封装好的 [ComponentDescriptor](#ComponentDescriptor) 实例，来访问以及设置组件的 `class` 和 `style`（对于动画来说，这两个属性一般足够）。

## ComponentDescriptor

组件描述符，页面上每个组件（包括页面自己）都是一个 `ComponentDescriptor` 实例，每个 `ComponentDescriptor` 下包含了以下函数：

### selectComponent

> 参数：selector 对象

返回组件的 `ComponentDescriptor` 实例。

### selectAllComponents

> 参数：selector 对象数组

返回组件的 `ComponentDescriptor` 实例数组。

### setStyle

> 参数：Object / string

设置组件样式，支持 `rpx`。设置的样式优先级比组件 wxml 里面定义的样式高。不能设置最顶层页面的样式。

### addClass / removeClass / hasClass

> 参数：string

设置组件的 `class`。设置的 `class` 优先级比组件 wxml 里面定义的 `class` 高。不能设置最顶层页面的 `class`。

### getDataset

> 参数：无

返回当前组件/页面的 `dataset` 对象

### callMethod

> 参数：(funcName: string, args: object)

`funcName` 表示函数名称，`args` 表示函数的参数。

调用当前组件 / 页面在逻辑层（App Service）定义的函数。

### requestAnimationFrame

> 参数：Function

和原生 `requestAnimationFrame` 一样。用于设置动画。

### getState

> 参数：无

返回一个 `object` 对象，当有局部变量需要存储起来，以便后续使用的时候，需要用到这个方法。

### triggerEvent

> 参数：(eventName, detail)

和组件的 `triggerEvent` 一致。

## SelectorQuery

> 选取节点，获取 `NodeRef` 对象。

通过 `wx.createSelectorQuery()` 创建一个 **`SelectorQuery`** 实例。

<details>
<summary><strong>举例</strong></summary>

```js
// 这是一个自定义组件
Component({
  queryMultipleNodes() {
    // 将查询范围从 `页面` 定义为 `当前自定义组件`
    const query = wx.createSelectorQuery().in(this)

    query
      .select('#the-id')
      .boundingClientRect(function (res) {
        res.top // 这个组件内 #the-id 节点的上边界坐标
      })
      .exec()
  }
})

// 第二种写法
const query = wx.createSelectorQuery()

query.select('#the-id').boundingClientRect()
query.selectViewport().scrollOffset()
query.exec(function (res) {
  res[0].top        // #the-id 节点的上边界坐标（select('#the-id').boundingClientRect 结果）
  res[1].scrollTop  // 显示区域的竖直滚动位置（selectViewport().scrollOffset 结果）
})
```

</details>

### in

**[SelectorQuery](#SelectorQuery) SelectorQuery.in(Component component)**

> 将选择器的选取范围更改为参数中的自定义组件 component 内。（初始时，选择器仅选取**页面范围**的节点，不会选取任何自定义组件中的节点）。

### select

**[NodesRef](#NodesRef) SelectorQuery.select(string selector)**

> 在当前页面下选择第一个匹配选择器 selector 的节点。

### selectAll

**[NodesRef](#NodesRef) SelectorQuery.selectAll(string selector)**

> 在当前页面下选择匹配选择器 selector 的所有节点。

### selectViewport

**[NodesRef](#NodesRef) SelectorQuery.selectViewport()**

> 选择显示区域。可用于获取显示区域的尺寸、滚动位置等信息。

### exec

**[NodesRef](#NodesRef) SelectorQuery.exec(function callback)**

> 执行所有的请求。请求结果按请求次序构成数组，在 callback 的第一个参数中返回。

## NodeRef

用于**获取** WXML 节点信息的对象。（用于获取，而不是去其上存储信息）

### fields

**[SelectorQuery](#SelectorQuery) NodesRef.fields(Object fields)**

> 获取节点的相关信息；需要获取的字段在 `fields` 中指定。

<details>
<summary><strong>举例</strong></summary>

```js
Page({
  getFields() {
    wx
      .createSelectorQuery()
      .select('.the-class')
      .fields({
        id: true,           // 是否返回节点 id
        dataset: true,      // 是否返回节点 dataset
        rect: true,         // 是否返回节点布局位置（left right top bottom）
        size: true,         // 是否返回节点尺寸（width height）
        scrollOffset: true, // 是否返回节点的 scrollLeft scrollTop，节点必须是 scroll-view 或者 viewport
        context: true,      // 是否返回节点对应的 Context 对象

        properties: [       // 指定属性名列表，返回节点对应属性名的当前属性值（只能获得组件文档中标注的常规属性值，id class style 和事件绑定的属性值不可获取）
          'scrollX',
          'scrollY'
        ],
        computedStyle: [    // 指定样式名列表，返回节点对应样式名的当前值
          'margin',
          'backgroundColor'
        ],
      }, function (res) {
        rect.id         // 节点的 ID
        res.dataset     // 节点的 dataset
        res.width       // 节点的宽度
        res.height      // 节点的高度
        res.scrollLeft  // 节点的水平滚动位置
        res.scrollTop   // 节点的竖直滚动位置
        res.context     // 节点对应的 Context 对象
        res.scrollX     // 节点 scroll-x 属性的当前值
        res.scrollY     // 节点 scroll-y 属性的当前值
        // 此处返回上面指定要返回的样式名
        res.margin
        res.backgroundColor
      })
      .exec()
  }
})
```

</details>

### boundingClientRect

**[SelectorQuery](#SelectorQuery) NodesRef.boundingClientRect(NodesRef.boundingClientRectCallback callback)**

> 添加节点的布局位置的查询请求。相对于显示区域，以像素为单位。其功能类似于 DOM 的 `getBoundingClientRect`。

<details>
<summary><strong>举例</strong></summary>

```js
Page({
  getRect() {
    wx
      .createSelectorQuery()
      .select('#the-id')
      .boundingClientRect(function (rect) {
        rect.id       // 节点的 ID
        rect.dataset  // 节点的 dataset
        rect.left     // 节点的左边界坐标
        rect.right    // 节点的右边界坐标
        rect.top      // 节点的上边界坐标
        rect.bottom   // 节点的下边界坐标
        rect.width    // 节点的宽度
        rect.height   // 节点的高度
      })
      .exec()
  },

  /*
  * 获取多个 NodeRef 的 boundingClientRect
  */
  getAllRects() {
    wx
      .createSelectorQuery()
      .selectAll('.a-class')
      .boundingClientRect(function (rects) {
        rects.forEach(function (rect) {
          // react 信息同上
        })
      })
      .exec()
  }
})
```

</details>

### scrollOffset

**[SelectorQuery](#SelectorQuery) NodesRef.scrollOffset(NodesRef.scrollOffsetCallback callback)**

> 添加节点的滚动位置查询请求。以像素为单位。节点必须是 **scroll-view** 或者 **viewport**。

<details>
<summary><strong>举例</strong></summary>

```js
Page({
  getScrollOffset() {
    wx
      .createSelectorQuery()
      .selectViewport()
      .scrollOffset(function (res) {
        res.id          // 节点的 ID
        res.dataset     // 节点的 dataset
        res.scrollLeft  // 节点的水平滚动位置
        res.scrollTop   // 节点的竖直滚动位置
      }).exec()
  }
})
```

</details>

### context

**[SelectorQuery](#SelectorQuery) NodesRef.context(NodesRef.contextCallback callback)**

> 添加节点的 Context 对象查询请求。目前支持
> [VideoContext](https://developers.weixin.qq.com/miniprogram/dev/api/VideoContext.html)、
> [CanvasContext](https://developers.weixin.qq.com/miniprogram/dev/api/CanvasContext.html)、
> [LivePlayerContext](https://developers.weixin.qq.com/miniprogram/dev/api/LivePlayerContext.html) 和
> **MapContext** 的获取。

<details>
<summary><strong>举例</strong></summary>

```js
Page({
  getContext() {
    wx
      .createSelectorQuery()
      .select('.the-video-class')
      .context(function (res) {
        console.log(res.context)
        // 节点对应的 Context 对象。
        // 如：选中的节点是 <video> 组件，那么此处即返回 VideoContext 对象
      })
      .exec()
  }
})
```

</details>

## 获取节点信息