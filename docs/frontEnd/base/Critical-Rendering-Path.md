# 浏览器渲染中的「关键渲染路径」CRP

## 什么是「关键渲染路径」？

> 我们的浏览器从收到 HTML、CSS 和 JavaScript 字节到对其进行必需的处理，从而将它们转变成渲染的像素这一过程中有一些中间步骤，优化性能其实就是了解这些步骤中发生了什么 —— 即在 **CRP**（Critical Rendering Path，**关键渲染路径**）中发生了什么。

![优化过的渲染和未优化的区别](https://img.alicdn.com/tfs/TB1FtD8yQvoK1RjSZFwXXciCFXa-611-300.png)

从上图中，我们可以简单的看出**优化过的渲染过程**和**未优化**的区别。

## 构建对象模型

浏览器在渲染页面之前，需要先构建 DOM 和 CSSOM 两棵树。

> 因此，我们需要尽快把 HTML 和 CSS 都提供给浏览器

### 简要流程

**字节（Bytes，文档数据的十六进制字节）👉🏻 字符（Characters）👉🏻 Tokens 👉🏻 节点（Node）👉🏻 对象模型（DOM 或 CSSOM）**

![简要流程](https://img.alicdn.com/tfs/TB1fgP9yMHqK1RjSZFPXXcwapXa-1123-622.png)

以 DOM 过程构建为例：

- 字节 👉🏻 字符（转换）：
    
    浏览器从磁盘或网络读取 HTML 的原始**字节**，并根据文件的指定编码（例如 UTF-8）将它们转换成各个**字符**。

- 字符 👉🏻 Tokens（令牌化）：
    
    浏览器将**字符串**转换成 W3C HTML5 标准规定的各种 **Tag**，例如，`<html>`、`<body>`，以及其他尖括号内的字符串。每个 **Token** 都具有特殊含义和一组规则。

- Tokens 👉🏻 节点（词法分析）：

    发出的**令牌**转换成定义其属性和规则的「**节点对象**」。

- 节点 👉🏻 对象模型（DOM 构建）：

    最后，由 HTML Tag 定义不同 Tag 之间的关系（一些 Tag 包含在其他标记内），创建的对象链接在一个树数据结构内；
    
    此结构也会捕获原始标记中定义的「父子关系」：`html` 对象是 `body` 对象的父项，`body` 是 `paragraph` 对象的父项，依此类推。

CSSOM 对象的构建也类似，只是内容更换为 CSS。

### DOM

> DOM（Document Object Model，文档对象模型）
> 
> [DOM概述 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Document_Object_Model/Introduction)

DOM 是 JavaScript 在**解析了 HTML** 后生成的一个数据结构，它是 Web 页面和脚本或程序语言之间的**桥梁**。

DOM 提供了**对文档结构化的标识**，并定义了一种方式，可以使**脚本对该结构进行访问**，从而**改变文档的结构、样式或者内容**。

DOM 树里包含了**所有 HTML 标签**，包括 `display:none` 隐藏，还有用 **JavaScript 动态添加**的元素等。

DOM 树捕获文档中 **Tag 的属性和关系**，但并未告诉我们元素在渲染后呈现的**外观**，那是 CSSOM 的责任。

#### 瓶颈

- HTML 数据过多，解析（parse）时间过长

### CSSOM

> CSSOM（CSS Object Model，CSS 对象模型）。
>
> [【译】CSSOM 介绍 - 前端 - 掘金](https://juejin.im/entry/58a6957d128fe10064768930)
> 
> [CSSOM视图模式(CSSOM View Module)相关整理 «  张鑫旭-鑫空间-鑫生活](https://www.zhangxinxu.com/wordpress/2011/09/cssom%E8%A7%86%E5%9B%BE%E6%A8%A1%E5%BC%8Fcssom-view-module%E7%9B%B8%E5%85%B3%E6%95%B4%E7%90%86%E4%B8%8E%E4%BB%8B%E7%BB%8D/)

CSSOM 是一个建立在 web 页面上的 **CSS 样式的映射**，配合 DOM 来渲染 web 页面。

特点：

- 为页面上的任何对象计算**最后一组样式**（Computed Style）时，浏览器都会先从适用于**该节点的最通用规则**开始（例如，如果该节点是 `body` 元素的子项，则应用所有 `body` 样式），然后通过应用更具体的规则（即「向下级联」规则）以递归方式优化计算的样式。

### 注意点

- DOM 和 CSSOM 是各自**独立**的数据结构。

## 渲染树构建、布局及绘制

上面说到，浏览器根据 HTML 和 CSS 分别构建了 DOM 和 CSSOM 树，前者用来**描述内容**，后者用来**描述对应文档需要应用的样式规则**。

DOM 和 CSSOM 两者是独立的，浏览器需要将两者合并，把最终内容渲染到我们的屏幕上。

### 简要流程

1. 将 DOM 和 CSSOM 合并成为一个「渲染树」（Render Tree），这棵「树」包含了页面上所有**可见内容**，以及**对应的每个节点所有的 CSSOM 样式信息**；
2. 浏览器根据这棵树，计算出每个对象的**精确位置和大小**；
3. 应用样式，将**最终渲染树**中所有内容绘制（paint）出来，渲染在屏幕上。

![简要流程](https://img.alicdn.com/tfs/TB1xyixyVzqK1RjSZFoXXbfcXXa-1150-537.png)

### 构建渲染树

浏览器为了构建渲染树，大致做了以下工作：

1. 从根节点出发，遍历 DOM 树中**所有「可见」节点**；

    此时会忽略：脚本标记、元标记（如 `<script>`、`<meta>`），CSS 中 `display: none` 的节点（因为该节点不会占据空间和显示，不成为布局的组成部分）

2. 给每个「可见」节点，寻找并适配上对应的 CSSOM 中的规则；
3. 提交每个「可见」节点，包括其内容及计算样式（Computed Style）

::: warning ❗️注意
`visibility:hidden` 隐藏的元素还是会被 **render tree** 所包含的，因为 `visibility:hidden` 会影响布局（layout），会占有空间。
:::

经历上述步骤后，最终输出的渲染同时包含了屏幕上的**所有可见内容及其样式信息**。

既然有了渲染树，我们就可以进入「布局」阶段。

### 布局与绘制

在构建完渲染树之后，我们虽然计算出了「内容」及「对应的计算样式」，但是我们还没有计算出他们在**设备视口内的「确切位置」和「大小」**；

在该阶段，输出的每个元素都是一个**盒模型**，它会精确地捕获每个元素在视口内的**确切位置和尺寸**（所有相对测量值都转换为屏幕上的绝对像素）

**回流（reflow）**：

> 计算**确切位置和尺寸大小**就是在「布局」阶段（layout）需要做的事情，该阶段也称为「回流」（reflow）。

**绘制（painting）**：

> 在获取了**计算样式以及几何信息**之后，将渲染树中的每个节点**转换成屏幕上的实际像素**。这一步通常称为「绘制」或「栅格化」（rasterizing）。

### 总结

所以，一个简单页面在我们眼前呈现，大致需要下列 5 个步骤：

1. 处理 HTML 标记并构建 DOM 树。
1. 处理 CSS 标记并构建 CSSOM 树。
1. 将 DOM 与 CSSOM 合并成一个渲染树。
1. 根据渲染树来布局，以计算每个节点的**几何信息**。
1. 将各个节点绘制到屏幕上。

本篇文章关于**优化「关键渲染路径」**，也就是**最大限度缩短**上述 5 个步骤所消耗的「总时间」。

这样一来，就能尽快**将内容渲染到屏幕**上，此外还能缩短**首次渲染后屏幕刷新的时间**，即为交互式内容实现更高的刷新率。

## 阻塞渲染的 CSS

默认情况下，CSSOM 构建完毕之前，浏览器将**不会渲染**任何的内容（content），所以 CSS 一般被视为「**阻塞渲染**」的资源。

### 什么是阻塞渲染

> 指浏览器是否需要暂停网页的首次渲染，直至该资源准备就绪。

### 为什么

> 因为，如果 CSS 不阻塞渲染，那么网页将会在 CSS 未加载好的情况下进行渲染；然鹅实际上，没有 CSS 的网页，在大多数情况下是无法使用的。

所以，浏览器将阻塞渲染，直到 DOM 和 CSSOM 全都准备就绪。

### 解决方案

由于阻塞渲染的存在，所以我们需要**精简**我们的 CSS，并尽早提供给浏览器去处理（process）；也可以利用**媒体类型和查询**来解除对渲染的阻塞，如：

```html
<link href="style.css"    rel="stylesheet">
<!-- 阻塞渲染，适用于所有情况 -->

<link href="style.css"    rel="stylesheet" media="all">
<!-- 同样阻塞渲染：`all` 是默认类型，如果您不指定任何类型，则隐式设置为 `all`。因此，第一个声明和第二个声明实际上是等效的。 -->

<link href="portrait.css" rel="stylesheet" media="orientation:portrait">
<!-- 声明具有动态媒体查询，将在网页加载时计算。根据网页加载时设备的方向，`portrait.css` 可能阻塞渲染，也可能不阻塞渲染。 -->

<link href="other.css" rel="stylesheet" media="(min-width: 40em)">
<!-- 声明具有动态媒体查询，将在网页加载时计算。根据网页加载时设备的宽度，`other.css` 可能阻塞渲染，也可能不阻塞渲染。 -->

<link href="print.css"    rel="stylesheet" media="print">
<!-- 只在打印网页时应用，因此网页首次在浏览器中加载时，它不会阻塞渲染。 -->
```

**上面无论哪一种情况，浏览器仍会下载 CSS 资源**，只不过阻塞渲染的资源优先级不同罢了。

## 阻塞解析的 JavaScript

JavaScript 对于一个页面的重要性不言而喻，不过，同样地，JavaScript 也会阻塞 DOM 的构建，以及延缓页面的渲染。

在**优化关键路径**的步骤中，我们能做的是：去除任何不必要的 JavaScript、让我们的脚本去异步执行。

### 解析器（parser）阻塞

应该大部分人，在初学 JavaScript 的时候都遇到，当我们**文档底部**的脚本中（`<script>` 中）使用 `document.getElementsByTagName('span')` 类似获取元素的命令时，完全没有问题；

但是，但我们把**该命令**放在 `<span>` 元素之前，JavaScript 就会报错，告诉我们获取不到元素（即 `getElementsByTagName('span')` 为 `null`）。

这说明了，**我们的 JavaScript 脚本放在何处，就会在何处执行**。

这是因为：

> 当 HTML 解析器遇到一个 `<script>` 标记的时候，它就会**暂停 DOM 的构建**，然后将页面的控制权，**移交给 JavaScript 引擎**；当该脚本被 JavaScript 引擎运行完毕后，页面的控制权又会回到 HTML 解析器的手中，然后浏览器会从上次中断的地方，**继续 DOM 的构建**。

所以换句话说，在执行 JavaScript 脚本的时候，是无法获取位于脚本之后的 DOM 元素，因为他们还没有被 HTML 解析器处理。

也可以说是：**执行「内联脚本」会阻塞 DOM 的构建，也就是延缓了页面的「首次渲染」**。

### 异步 JavaScript

上面说到的是「内联 JavaScript」，实际上，不论内联 JavaScript 代码或者是外部 JavaScript 文件，浏览器都会先暂停并执行脚本，执行完之后才会继续处理剩余的文档。

❗️而且，如果是外部 JavaScript 文件，**浏览器必须停止下来，等待文件通过「磁盘」、「缓存」、「服务器」获取**，这就可能会带来响应的延迟（一般数十到数千毫秒）。

默认情况下，所有 JavaScript（不论是外部、内联、本地、远端）都会阻塞解析器。

> 这是因为，浏览器不知道脚本会执行什么样的操作，所以它会做出「最坏的假设」，进而阻塞解析器。

所以，我们可以传递某个信号，能够**阻止**浏览器在脚本所在位置执行脚本，从而继续解析并构建 DOM，最终在**解析后再去执行脚本**。

**这个信号就是 `async` 字段。** 👈🏻

```html
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link href="style.css" rel="stylesheet">
    <title>Critical Path: Script Async</title>
  </head>
  <body>
    <p>Hello <span>web performance</span> students!</p>
    <div><img src="awesome-photo.jpg"></div>
    <script src="app.js" async></script>
  </body>
</html>
```

> 向 `<script>` 标签添加「**异步**」关键字 `async`，可以告诉浏览器在**等待脚本可用期间**不阻止 DOM 构建，这样可以显著提升性能。

课外阅读：[javascript - defer 和 async 的区别 - SegmentFault 思否](https://segmentfault.com/q/1010000000640869)

:::tip defer 和 async 的区别
一图胜千言

![defer 和 async 的区别](https://image-static.segmentfault.com/28/4a/284aec5bb7f16b3ef4e7482110c5ddbb_articlex)

`defer` 执行的时间是在 DOM 解析（也就是 `DOMInteractive` 事件）之后，`DomContentLoaded` 事件之前执行。
:::

## 关键渲染路径评估

每个可靠的性能策略的**基础**，是准确的「评估」和「检测」。

这里我们是介绍评估 **CRP**（Critical Rendering Path 关键渲染路径）性能的方法：

- 使用 Lighthouse 对页面进行自动化测试

    Chrome DevTools 当前并不非常适合 CRP 评估，因为它没有**隔离关键资源**的内置机制，我们可以使用「Lighthouse」。

    详情：[Lighthouse 使用入门](/learn/Google-Developers/Lighthouse.md)

- 使用 Navigation Timing API 捕获 [RUM](https://en.wikipedia.org/wiki/Real_user_monitoring)（Real user monitoring 真实用户监控）指标。

### Navigation Timing API

[Navigation Timing API](https://developer.mozilla.org/zh-CN/docs/Web/API/Navigation_timing_API) 提供了可用于衡量一个**网站性能**的数据。该 API 可以提供可以**更有用和更准确**的端到端「延迟数据」。

![浏览器事件](https://img.alicdn.com/tfs/TB1CLpjEAvoK1RjSZFNXXcxMVXa-347-318.png)

上图展示了各种时间戳中的一小部分（暂且不包含与网络相关的时间戳）

- **`DOMLoading`**：这是整个过程的起始时间戳，浏览器即将开始解析第一批收到的 HTML 文档字节。

- **`DOMInteractive`**：表示浏览器**完成对所有 HTML 的解析**并且 DOM 构建完成的时间点。

- **`DOMContentLoaded`**：表示 DOM 准备就绪并且**没有 CSS 阻止 JavaScript 执行**的时间点，这意味着现在我们可以构建渲染树了。

    **许多 JavaScript 框架都会等待此事件（`DOMContentLoaded`）发生后，才开始执行它们自己的逻辑。因此，浏览器捕获的 EventStart 和 EventEnd 时间戳，能够让我们追踪执行所花费的时间。**

- **`DOMComplete`**：顾名思义，所有处理完成，并且网页上的**所有资源**（图像等）都已下载完毕，也就是说，加载转环已停止旋转。

- **`loadEvent`**：作为每个网页加载的最后一步，浏览器会触发 `onload` 事件，以便触发额外的应用逻辑。

## 关键渲染路径性能解析

**优化关键渲染路径**能够让浏览器尽可能快地绘制网页，最大程度减少空白屏幕的时间；所以我们需要优化加载的资源及其加载顺序。

了解关键渲染路径的特性意味着能够确定哪些是关键资源，此外还能了解浏览器如何安排资源的获取时间。

### CSS

- CSS 不会阻塞 DOM 解析，但是会阻塞 DOM 渲染；

### JS

- JS 会阻塞 DOM 解析；

    不论外联脚本，还是内联脚本都会阻塞 DOM 的解析，原因是需要等待 CSS 下载并解析完毕，浏览器需要确保 JS 获取的是最新的 DOM。

### 浏览器

- 预下载后方相关资源；
- 遇到 `<script>` 并且没有 `defer` 或者 `async` 标识的时候，会**触发渲染**（否则 JS 可能会获取不到最新的 DOM 元素信息），如果有 CSS 资源上位加载完，浏览器会等待 CSS 加载完毕后再执行。

    因为 JS 需要等待 CSS 文件下载并解析后再执行，`DOMContentLoaded` 事件需要等待同步或 `async` 的 JS 执行完毕。

    所以浏览器会在**下载并解析 CSS 文件**之前阻止 `DOMContentLoaded` 事件。

### 关键资源

可能阻止页面「首次渲染」的资源。

### 关键路径长度

获取所有**关键资源**所需要的「往返次数」或「总时间」。

### 关键字节

实现网页**首次渲染**说需要的「总字节数」，它是所有关键资源传送文件**大小的总和**。

### 例子：有图片，无 CSS、JS

现有如下 Demo，存在图片资源，但是没有 CSS 和 JavaScript：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Critical Path: No Style</title>
  </head>
  <body>
    <p>Hello <span>web performance</span> students!</p>
    <div><img src="awesome-photo.jpg"></div>
  </body>
</html>
```

**瀑布流如下**：

![Chrome Dev Tool](https://img.alicdn.com/tfs/TB1l5F8JBLoK1RjSZFuXXXn0XXa-893-136.png)

可以看到，`DOMContentLoaded` 事件在 HTML 文件下载完毕之后（深蓝色竖线代表 `DOMContentLoaded` 事件）。

- HTML 文件下载的 200 多毫秒中，存在**网络传输**和**服务器处理**两种操作。

- Chrome DevTools 底部显示的 `216ms`，是 `DOMContentLoaded` 的触发时间；这段时间中包括了 **HTML 文件下载**、**HTML 解析**、**构建 DOM 树**。

- **HTML 下载结束**与蓝色垂直线 (`DOMContentLoaded` 事件) 之间的几毫秒间隔，便是浏览器**构建 DOM 树**所花费的时间。

- 图片下载并没有阻止 `DOMContentLoaded` 事件；所以图像不会阻止页面的「首次渲染」，但是仍然会阻止页面的 `OnLoad` 事件，所以红色竖线（`OnLoad` 事件）在图片下载之后。

**解析如下**：

![解析](https://image-static.segmentfault.com/411/447/4114475311-58b84daf5a169)

**T0** 和 **T1** 之间的时间，用于**捕获网络传输**和**服务器处理**时间。

存在：

- **1** 个关键资源（HTML）
- **1** 个关键路径长度（假设 HTML 文件很小，获取 HTML 这一次）
- **5KB** 关键字节

### 例子：有图片、CSS、JS

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Critical Path: Measure Script</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link href="style.css" rel="stylesheet">
  </head>
  <body onload="measureCRP()">
    <p>Hello <span>web performance</span> students!</p>
    <div><img src="awesome-photo.jpg"></div>
    <script src="timing.js"></script>
  </body>
</html>
```

**瀑布流如下**：

![Chrome Dev Tool](https://img.alicdn.com/tfs/TB1SBmcJq6qK1RjSZFmXXX0PFXa-893-91.png)

可以看到，蓝色竖线（`DOMContentLoaded` 事件）和红色竖线（`OnLoad` 事件）**相差不多**。

- 这是因为存在 JavaScript，JavaScript **可能会查询 CSSOM**，所以浏览器只要遇到 `<script>` 标签，就需要渲染一次，渲染需要**构建渲染树**，在构建渲染树之前需要**构建好 DOM 和 CSSOM**，所以 JavaScript 需要**等待 CSS 下载并解析**后，才会执行，执行完毕后才会**触发 `DOMContentLoaded` 事件**。
- 不管是内联脚本，还是外部脚本，都会阻塞 `DOMContentLoaded` 事件。但是如果是外部脚本，我们可以添加 `async` 关键字，来异步进行 JavaScript 的下载和执行，可以和 CSSOM 的构建**同步进行**。

**解析如下**：

![解析](https://image-static.segmentfault.com/143/461/1434611763-58b84dcdc0f86)

存在：

- **3** 个关键资源（HTML、CSS 和 JS 都是关键资源）
- **2** 个或更多关键路径长度（CSS、JS 仅在浏览器获取 HTML 文档后才会获取，又因为可以同时进行，因此关键路径长度至少为两次往返）
- **11KB** 关键字节

因为可以**并行传输** CSS 和 JavaScript，所以关键路径长度仍然是**两个**往返过程。

### 例子：JS 添加 async

如果我们的 JavaScript 中不包含对 DOM 或者 CSSOM 的操作，可以添加 `async` 属性：

```html
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link href="style.css" rel="stylesheet">
  </head>
  <body>
    <p>Hello <span>web performance</span> students!</p>
    <div><img src="awesome-photo.jpg"></div>
    <script src="app.js" async></script>
  </body>
</html>
```

**瀑布流如下**：

![Chrome Dev Tool](https://img.alicdn.com/tfs/TB1arJ_JAvoK1RjSZPfXXXPKFXa-895-131.png)

我们可以看到，在添加了 `async` 属性之后，JavaScript 并没有阻塞 `DOMContentLoaded` 事件。

**解析如下**：

![解析](https://image-static.segmentfault.com/202/425/2024250002-58b84ded5eced)

- **2** 个关键资源（HTML、CSS）
- **2** 个关键路径长度（CSS、JS 仅在浏览器获取 HTML 文档后才会获取，又因为 JS 是异步获取，因此关键路径长度为两次往返）
- **9KB** 关键字节

- 脚本再也不会阻止解析器，所以也不再是 CRP 的组成部分；

- 因为没有其他关键脚本，所以也不再需要阻止 `DomContentLoaded` 事件了；

- `DomContentLoaded` 事件触发得越早，其他应用逻辑执行的时间就越早。

## 关键渲染路径优化

为了尽快完成页面的「首次渲染」，我们需要**尽可能减少**以下三种因素：

- 关键资源的数量

    关键资源是**可能阻止网页首次渲染**的资源。这些资源越少，浏览器的工作量就越小，对 CPU 以及其他资源的占用也就越少。

- 关键路径长度

    关键路径长度受所有**关键资源**与**其字节大小**之间依赖关系图的影响：某些资源只能在**上一资源处理完毕之后才能开始下载**，并且**资源越大，下载所需的往返次数就越多**。

- 关键字节的大小

    浏览器需要下载的关键字节越少，处理内容并让其出现在屏幕上的速度就越快。要减少字节数，我们可以减少资源数（将它们**删除**或**设为非关键资源**），此外还要**压缩和优化各项资源**，确保**最大限度减小传送大小**。

### 优化步骤

1. 对关键路径进行「**分析**」和特性描述：资源数、字节数、长度。
1. 最大限度「**减少关键资源的数量**」：**删除**它们，**延迟**它们的下载，将它们**标记为异步**等。
1. 优化「**关键字节数**」以缩短下载时间（往返次数）。
1. 优化其余关键资源的「加载顺序」：您需要尽早下载所有关键资产，以**缩短关键路径长度**。

### 优化 JavaScript

默认情况下，JavaScript 资源会**阻塞解析器**，除非将其标记为 `async` 或通过专门的 JavaScript 代码段进行添加。

阻塞解析器的 JavaScript 会强制浏览器**等待 CSSOM** 并**暂停 DOM 的构建**，继而大大延迟首次渲染的时间。

- **首选使用异步 JavaScript 资源**

    「异步资源」不会阻塞文档解析器，让**浏览器避免在执行脚本之前受阻于 CSSOM**。
    
    通常，如果脚本可以使用 `async` 属性，也就意味着它并非首次渲染所必需（非关键资源）；可以考虑在首次渲染后异步加载脚本。

- **避免运行时间长的 JavaScript**

    运行时间长的 JavaScript 会阻止浏览器构建 DOM、CSSOM 以及渲染网页，所以任何对首次渲染无关紧要的**初始化逻辑和功能**都应延后执行。
    
    如果需要运行较长的初始化序列，请考虑将其**拆分为若干阶段**，以便**浏览器可以间隔处理其他事件**。

### 优化 CSS

- **将 CSS 置于文档 head 标签内**

    尽早在 HTML 文档内指定所有 CSS 资源，以便**浏览器尽早发现 `<link>`** 标记并**尽早发出 CSS 请求**。

- **避免使用 CSS import**

    应避免使用这些指令，因为它们会在**关键路径中增加往返次数**：只有在收到并解析完带有 `@import` 规则的 CSS 样式表之后，才会发现导入的 CSS 资源。

- **内联阻塞渲染的 CSS**

    为获得最佳性能，您可能会考虑将关键 CSS 直接内联到 HTML 文档内。
    
    这样做不会增加关键路径中的往返次数，并且如果实现得当，在只有 HTML 是阻塞渲染的资源时，可实现「一次往返」关键路径长度。

## 参考资料

> [关键渲染路径 | Web | Google Developers](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/)
> 
> [网站性能优化 —— CRP - 小前端 - SegmentFault 思否](https://segmentfault.com/a/1190000008550336)
> 
> [原来 CSS 与 JS 是这样阻塞 DOM 解析和渲染的 - 掘金](https://juejin.im/post/59c60691518825396f4f71a1)
> 
> [资源加载和页面事件 - Code - SegmentFault 思否](https://segmentfault.com/a/1190000002393482)