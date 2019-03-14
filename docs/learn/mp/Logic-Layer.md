# 逻辑层

> 小程序开发框架的逻辑层使用 JavaScript 引擎为小程序提供开发者 JavaScript 代码的运行环境以及微信小程序的特有功能。

逻辑层将数据进行处理后发送给视图层，同时接受视图层的事件反馈。

❗️需要注意的是：小程序框架的逻辑层并非运行在浏览器中，因此 JavaScript 在 web 中一些能力都无法使用，如 `window`，`document` 等。

## 逻辑层能力

- 增加 `App` 和 `Page` 方法，分别进行「**程序**」和「**页面**」的注册。
- 增加 `getApp` 和 `getCurrentPages` 方法，分别用来获取「**App 实例**」和「**当前页面栈**」。
- 提供丰富的 API，如微信**用户数据**，**扫一扫**，**支付**等微信特有能力。
- 每个页面有**独立的作用域**，并提供**模块化**能力。

## 注册程序

> 内置的 App(Object) 函数用来**注册一个小程序**。接受一个 Object 参数，其指定小程序的生命周期回调等。

### App(object) 函数

❗️**App() 必须在 `app.js` 中调用，「必须调用」且「只能调用一次」。不然会出现无法预期的后果。**

参数 `object` 列表：

- `onLaunch`

- `onShow`

- `onHide`

- `onError`

- `onPageNotFound`

- 其他

### onLaunch

> **生命周期回调**：监听小程序初始化

类型：**Function**

小程序**初始化完成时**（全局只触发**一次**）。

可以通过 [wx.getLaunchOptionsSync](https://developers.weixin.qq.com/miniprogram/dev/api/wx.getLaunchOptionsSync.html) 获取启动时参数

### onShow

> **生命周期回调**：监听小程序显示

类型：**Function**

小程序**启动**，或从**后台进入前台**显示时。

也可以使用 [wx.onAppShow](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onAppShow.html) 绑定监听。

### onHide

> **生命周期回调**：监听小程序隐藏

类型：**Function**

小程序**从前台进入后台**时。

也可以使用 [wx.onAppHide](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onAppHide.html) 绑定监听。

### onError

> 全局错误监听函数

类型：**Function**

**小程序发生脚本错误**，或者 **api 调用失败时**触发，会带上错误信息。

也可以使用 [wx.onError](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onError.html) 绑定监听。

### onPageNotFound

> 页面不存在监听函数

类型：**Function**

小程序要打开的**页面不存在**时触发，会带上页面信息回调该函数。

也可以使用 [wx.onPageNotFound](https://developers.weixin.qq.com/miniprogram/dev/api/wx.onPageNotFound.html) 绑定监听。

### 其他属性

类型：**Any**

开发者可以添加任意的「函数」或「数据」到**参数对象**中，用 `this` 可以访问，相当于**全局变量**。

### 注册程序示例

```js
App({
  onLaunch(options) {
    // Do something initial when launch.
    const {
      path,         // String，启动小程序的「路径」
      scene,        // Number，启动小程序的「场景值」
      query,        // Object，启动小程序的「参数」
      shareTicket,  // String，转发信息，可以通过 `wx.getShareInfo(shareTicket)` 获取转发信息
      referrerInfo, // Object，从另一个小程序、公众号或 App 进入小程序的时候返回，否则返回 `{}`
    } = options
  },
  onShow(options) {
    // Do something when show.
  },
  onHide() {
    // Do something when hide.
  },
  onError(msg) {
    console.log(msg)
  },
  globalData: 'I am global data'
})
```

## 场景值

场景值表示的在进入小程序的时候，是以什么样的场景进入的，不同的场景值对应不同的场景，让开发者可以更具针对性的进行交互体验的提升。

对于小程序，可以在 `App()` 参数中的 `onLaunch` 和 `onShow`，或 `wx.getLaunchOptionsSync` 中获取场景值。

部分场景值下还可以获取来源应用、公众号或小程序的 `appId`。

详细场景值列表：[场景值 · 小程序](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/scene.html)

## 注册页面

### 页面生命周期

**Pgae 实例**的生命周期

![页面生命周期](https://developers.weixin.qq.com/miniprogram/dev/image/mina-lifecycle.png?t=19031221)

#### 出生阶段

逻辑层（`AppService`，也可以理解为应用服务层）：

1. 逻辑层线程开始创建（Create）；

2. 先后触发页面 `onLoad` 和 `onShow` Hook，成功创建（Created）逻辑层，开始等待（Waiting）视图层（View）准备完成（Ready）；

3. 视图层初始化完成（Inited）后，通知逻辑层发送初始数据（object.data），接收到数据后，进入第一次渲染（First Render）；

4. 第一次渲染完成后，进入准备状态，告知逻辑层，逻辑层触发页面 `onReady` Hook；

5. `onReady` 后，至此逻辑层进入前台激活状态（Active）；这时候可以进行「界面操作」。

#### 更新阶段

1. 每次逻辑层向视图层发送一次数据（Send Data），视图层就渲染一次（Render）；

2. 如果这时进入后台（Background），将触发页面 `onHide` Hook；

    此时若小程序未被卸载（Alive），下一次启动，将触发 `onShow` Hook；否则将进入[出生阶段](#出生阶段)，详细见 👉🏻 [运行机制 · 小程序](https://developers.weixin.qq.com/miniprogram/dev/framework/operating-mechanism.html)

3. 若小程序采用「热启动」，将触发页面 `onShow` Hook。

#### 死亡阶段

当离开页面时，页面将被销毁（Destroy），触发页面 `onUnload` Hook。

### Pgae(object) 函数

> Page(object) 函数用来注册一个页面。接受一个 object 类型参数，其指定页面的初始数据、生命周期回调、事件处理函数等。

参数 `object` 列表：

- `data`：页面的初始数据；

- `onLoad`：生命周期回调—监听页面加载；

- `onShow`：生命周期回调—监听页面显示；

- `onReady`：生命周期回调—监听页面初次渲染完成；

- `onHide`：生命周期回调—监听页面隐藏；

- `onUnload`：生命周期回调—监听页面卸载；

- `onPullDownRefresh`：监听用户下拉动作；

- `onReachBottom`：页面上拉触底事件的处理函数；

- `onShareAppMessage`：用户点击右上角转发；

- `onPageScroll`：页面滚动触发事件的处理函数；

- `onResize`：页面尺寸改变时触发，详见 响应显示区域变化；

- `onTabItemTap`：当前是 tab 页时，点击 tab 时触发；

- `其他`：开发者可以添加任意的函数或数据到 `object` 参数中，在页面的函数中用 this 可以访问。

### data

> 页面的初始数据；

页面加载时，`data` 将会以 **JSON 字符串**的形式由逻辑层传至渲染层，因此 `data` 中的数据必须是可以转成 `JSON` 的类型：

- 字符串 String
- 数字 Number
- 布尔值 Boolean
- 对象 Object
- 数组 Array

```html
<view>{{text}}</view>
<view>{{array[0].msg}}</view>
```

```js
Page({
  data: {
    text: 'init data',
    array: [{msg: '1'}, {msg: '2'}]
  }
})
```

### onLoad

> 生命周期回调 —— 监听页面「加载」；

一个页面**只会调用一次**，可以在 `onLoad` 的参数中获取打开当前页面路径中的参数。

```js
Pgae({
  onLoad(prams) {
    // use `params` to do someting
  }
})
```

### onShow

> 生命周期回调 —— 监听页面「显示」；

页面显示 / 切入前台时触发。

### onReady

> 生命周期回调 —— 监听页面「初次渲染完成」；

页面初次渲染完成时触发。一个页面**只会调用一次**，代表页面已经**准备妥当** `DidMount`，可以和视图层进行交互。

❗️注意：对「界面内容」进行操作的 API 如 `wx.setNavigationBarTitle`，需要在 `onReady` 之后进行。

该生命周期处于 `onShow` 之后；之前根据字面意思和 React 的思维，把 `onShow` 类比为 `DidMount`，把 `onReady` 类比为 `willMount`，所以犯了错，详见 [页面生命周期](#页面生命周期)

### onHide

> 生命周期回调 —— 监听页面「隐藏」；

页面隐藏 / 切入后台时触发。

如：`navigateTo` 或底部 Tab 切换到其他页面，小程序切入后台等。

### onUnload

> 生命周期回调 —— 监听页面「卸载」；

页面卸载时触发。

如：`navigateBack` 或 `redirectTo` 到其他页面时。

### onPullDownRefresh

> 页面事件处理函数 —— 监听用户下拉动作；

- 需要在 `app.json` 的 `window` 选项中或「页面配置」中开启 `enablePullDownRefresh`；

- 可以通过 `wx.startPullDownRefresh` 触发下拉刷新，调用后触发下拉刷新动画，效果与用户手动下拉刷新一致。

- 当处理完数据刷新后，`wx.stopPullDownRefresh` 可以停止当前页面的下拉刷新。

### onReachBottom

> 页面事件处理函数 —— 页面上拉触底事件的处理函数；

可以在 `app.json` 的 `window` 选项中或页面配置中设置**触发距离** `onReachBottomDistance`。

在触发「距离内滑动」期间，本事件**只会被触发一次**。

### onShareAppMessage

> 页面事件处理函数 —— 用户点击右上角转发；

监听用户点击「页面内转发按钮」（`<button open-type="share">` 组件）或右上角菜单「转发」按钮的行为，并可**自定义**转发内容。

❗️注意：只有定义了此事件处理函数，**右上角菜单才会显示「转发」按钮**。

### onPageScroll

> 页面事件处理函数 —— 页面滚动触发事件的处理函数；

❗️注意点：

1. 不需要该事件的话，就**不需要定义空方法**，以减少不必要的渲染层-逻辑层通信事件派发。

2. 请避免在 `onPageScroll` 中过于**频繁的执行 `setData`** 等引起逻辑层-渲染层通信的操作。尤其是每次传输大量数据，会影响通信耗时。

### onResize

> 页面事件处理函数 —— 页面尺寸改变时触发，详见 响应显示区域变化；

📱 在「手机」上（v2.4.0 及以后）使小程序中的页面支持屏幕旋转的方法是：

- 在 `app.json` 的 `window` 字段中设置 `"pageOrientation": "auto"`；

- 在页面 `json` 文件中配置 `"pageOrientation": "auto"`。

💻 在「iPad」上（v2.3.0 及以后）使小程序中的页面支持屏幕旋转的方法是：

- 在 `app.json` 中设置 `"resizable": true`；

❗️注意：在 iPad 上不能单独配置某个页面是否支持屏幕旋转。

详见：[响应显示区域变化 · 小程序](https://developers.weixin.qq.com/miniprogram/dev/framework/view/resizable.html#%E5%9C%A8%E6%89%8B%E6%9C%BA%E4%B8%8A%E5%90%AF%E7%94%A8%E5%B1%8F%E5%B9%95%E6%97%8B%E8%BD%AC%E6%94%AF%E6%8C%81)

### onTabItemTap

> 页面事件处理函数 —— 当前是 tab 页时，点击 tab 时触发；

### 组件事件处理函数

Page 中还可以定义组件事件处理函数。

在渲染层的组件中加入事件绑定，当事件被触发时，就会执行 Page 中定义的事件处理函数。

```html
<view bindtap="viewTap">click me</view>
```

```js
Page({
  viewTap() {
    console.log('view tap')
  }
})
```

### 其他

> 开发者可以添加任意的函数或数据到 `object` 参数中，在页面的函数中用 this 可以访问。

### Page.route

> 可以通过 `this.route` 获取当前页面的路径。

### Page.prototype.setData

> 可以通过 `this.setData(data, callback)` 来修改 `data` 中的内容。

将数据从**逻辑层**发送到**视图层**是「异步」的。

同时改变对应的 `this.data` 的值是「同步」的。

参数列表：

- data：**Object**，当前需要改变的数据；

    Object 以 `key: value` 的形式表示，将 `this.data` 中的 `key` 对应的值改变成 `value`。

    **其中 key 可以以「数据路径」的形式（字符串）给出，支持改变数组中的「某一项」或对象的「某个属性」，如 `array[2].message`、`a.b.c.d`，并且「不需要」在 `this.data` 中预先定义。**

    ```html
    <view>{{array[0].text}}</view>
    <button bindtap="changeItemInArray">Change Array data</button>

    <!-- 可以使用未定义的属性，且不报错 -->
    <view>{{newField.text}}</view>
    <button bindtap="addNewField">Add new data</button>
    ```

    ```js
    Page({
      data: {
        array: [{text: 'init data'}],
      },
      changeItemInArray() {
        // 对于对象或数组字段，可以直接修改一个其下的子字段，这样做通常比修改整个对象或数组更好
        this.setData({
          'array[0].text': 'changed data'
        })
      },
      addNewField() {
        this.setData({
          'newField.text': 'new data'
        })
      }
    })
    ```

    ❗️注意：

    - 直接修改 `this.data` 而不调用 `this.setData` 是无法改变页面的状态的，还会造成数据不一致。

    - 仅支持设置**可 JSON 化**的数据。

    - 单次设置的数据不能超过 **`1024kB`**，请尽量避免一次设置过多的数据。

    - 请不要把 `data` 中任何一项的 `value` 设为 **`undefined`**，否则这一项将**不被设置**并可能**遗留一些潜在问题**。

- callback：**Function**，`setData` 引起的界面**更新渲染完毕后**的回调函数;

### 注册页面示例

```js
// index.js
Page({
  data: {
    text: 'This is page data.'
  },
  onLoad(options) {
    // Do some initialize when page load.
  },
  onReady() {
    // Do something when page ready.
  },
  onShow() {
    // Do something when page show.
    console.log(this.route)
  },
  onHide() {
    // Do something when page hide.
  },
  onUnload() {
    // Do something when page close.
  },
  onPullDownRefresh() {
    // Do something when pull down.
  },
  onReachBottom() {
    // Do something when page reach bottom.
  },
  onShareAppMessage(Object) {
    const {
      from,       // String，转发事件来源 1. button：页面内转发按钮；2. menu：右上角转发菜单;
      target,     // Object，如果 from 值是 button，则 target 是触发这次转发事件的 button 的信息，否则为 undefined;
      webViewUrl  // String，页面中包含 `<web-view>` 组件时，返回当前 `<web-view>` 的 url;
    } = Object;

    // 放回一个自定义转发内容
    return {
      title,    // 转发标题，默认值：当前小程序名称;
      path,     // 转发路径，默认值：当前页面 path ，必须是以 `/` 开头的完整路径;
      imageUrl  // 自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持 PNG 及 JPG。显示图片长宽比是 5:4。默认值：使用默认截图
    }
  },
  onPageScroll(Object) {
    const {
      scrollTop, // Number，页面在垂直方向已滚动的距离（单位 px）
    } = Object;

    // Do something when page scroll
    // 不需要该事件的话，就不需要定义空方法，以减少不必要的渲染层-逻辑层通信事件派发
  },
  onResize(Object) {
    const {
      deviceOrientation,  // String，当前屏幕方向，竖屏 "portrait" | 横屏 "landscape";
      size,               // Object，当前页面及屏幕尺寸信息，包括 screenHeight、screenWidth、windowHeight、windowWidth
    } = Object;

    // Do something when page resize
  },
  onTabItemTap(item) {
    console.log(item.index)     // String，被点击 tabItem 的序号，从 0 开始
    console.log(item.pagePath)  // String，被点击 tabItem 的页面路径
    console.log(item.text)      // String，被点击 tabItem 的按钮文字
  },

  // 组件事件句柄
  viewTap() {
    this.setData({
      text: 'Set some data for updating view.'
    }, function () {
      // this is setData callback
    })
  },
  customData: {
    hi: 'MINA'
  }
})
```

## 路由

在小程序中所有页面的路由全部由「框架」进行管理。

### 页面栈

框架以「栈」的形式维护了**当前**的所有页面。

当发生路由切换的时候，页面栈的表现如下：

- 初始化：新页面入栈

- 打开新页面：新页面入栈

- 页面重定向：当前页面出栈，新页面入栈

- 页面返回：页面不断出栈，直到目标返回页

- Tab 切换：页面全部出栈，只留下新的 Tab 页面（出栈不意味着触发页面 `onUnload`，只是保存当前页面）

- 重加载：页面全部出栈，只留下新的页面

### 路由方式

对于路由的触发方式以及页面生命周期函数，详见 👉🏻 [路由 · 小程序](https://developers.weixin.qq.com/miniprogram/dev/framework/app-service/route.html)

### getCurrentPages()

> 用于获取当前页面栈的实例，以数组形式按栈的顺序给出，第一个元素为首页，最后一个元素为当前页面；每个元素包含了该页面的所有内容。

❗️注意：

- 不要尝试修改页面栈，会导致路由以及页面状态错误。

- 不要在 `App.onLaunch` 的时候调用 `getCurrentPages()`，此时 `page` 还没有生成。

### wx.switchTab

> 跳转到 tabBar 页面，并**关闭其他所有非 tabBar 页面**

**需要跳转的 tabBar 页面的路径，需要在 `app.json` 的 tabBar 字段被定义过。**

```js
const url = '/index' // 路径后 `不能带参数`

wx.switchTab({
  url,      // 必须，String 需要跳转的 tabBar 页面的路径（需在 app.json 的 tabBar 字段定义的页面）。
  success,  // 选填，Function 接口调用成功的回调函数
  fail,     // 选填，Function 接口调用失败的回调函数
  complete, // 选填，Function 接口调用结束的回调函数（调用成功、失败都会执行）
})
```

### wx.reLaunch

> **关闭所有页面**，打开到应用内的某个页面

```js
const url = 'test?id=1'

wx.reLaunch({
  url,      // 必须，String 需要跳转的应用内页面路径，路径后可以带参数
  success,  // 选填，Function 接口调用成功的回调函数
  fail,     // 选填，Function 接口调用失败的回调函数
  complete, // 选填，Function 接口调用结束的回调函数（调用成功、失败都会执行）
})
```

### wx.navigateTo

> **保留当前页面**，跳转到应用内的某个页面。但是**不允许跳到 tabbar 页面**。

使用 `wx.navigateBack` 可以返回到原页面。

调用 `navigateTo` 跳转时，**调用该方法的页面**会被压入堆栈，小程序中页面栈最多十层。

```js
const url = 'test?id=1'

wx.navigateTo({
  url,      // 必须，String 需要跳转的应用内页面路径，路径后可以带参数
  success,  // 选填，Function 接口调用成功的回调函数
  fail,     // 选填，Function 接口调用失败的回调函数
  complete, // 选填，Function 接口调用结束的回调函数（调用成功、失败都会执行）
})
```

### wx.redirectTo

> **关闭当前页面**，跳转到应用内的某个页面。但是**不允许跳转到 tabbar 页面**。

```js
const url = 'test?id=1'

wx.redirectTo({
  url,      // 必须，String 需要跳转的应用内页面路径，路径后可以带参数
  success,  // 选填，Function 接口调用成功的回调函数
  fail,     // 选填，Function 接口调用失败的回调函数
  complete, // 选填，Function 接口调用结束的回调函数（调用成功、失败都会执行）
})
```

### wx.navigateBack

> 关闭当前页面，返回上一页面或多级页面。

可通过 `getCurrentPages()` 获取当前的页面栈，决定需要返回几层。

如果 `delta` 大于现有页面数，则返回到首页。

```js
const delta = 2 // 需要返回的层数

wx.navigateBack({
  delta,    // 必须，Number 返回的页面数
  success,  // 选填，Function 接口调用成功的回调函数
  fail,     // 选填，Function 接口调用失败的回调函数
  complete, // 选填，Function 接口调用结束的回调函数（调用成功、失败都会执行）
})
```

### 注意点

- `navigateTo`，`redirectTo` 只能打开非 tabBar 页面。

- `switchTab` 只能打开 tabBar 页面。

- `reLaunch` 可以打开任意页面。

- 页面底部的 tabBar 由页面决定，即只要是定义为 tabBar 的页面，底部都有 tabBar。

- 调用页面路由带的**参数**可以在「目标页面」的 `onLoad` 中获取。

    ```js
    // index.js
    Pgae({
      btnClick() {
        wx.navigateTo({
          url: './somepage/page?msg=123'
        })
      }
    })

    // page.js
    Page({
      onLoad(params) {
        console.log(params) // {mas: "123"}
      }
    })
    ```

## 模块化

模块化在前端也是个常谈的话题，小程序的模块化与前端模块化大同小异。

小程序的模块化使用的是 CommonJS 规范：

```js
// common.js
function sayHello(name) {
  console.log(`Hello ${name} !`)
}
function sayGoodbye(name) {
  console.log(`Goodbye ${name} !`)
}

module.exports.sayHello = sayHello
exports.sayGoodbye = sayGoodbye

// index.js
const common = require('common.js') // 暂时不支持`绝对路径`
Page({
  helloMINA() {
    common.sayHello('MINA')
  },
  goodbyeMINA() {
    common.sayGoodbye('MINA')
  }
})
```

**小程序目前不支持「直接」引入 `node_modules`**, 开发者需要使用到 `node_modules` 时候「建议」**拷贝出相关的代码**到小程序的目录中；或者使用小程序支持的 npm 功能。

### 文件作用域

在每个 JavaScript 文件中声明的「变量」和「函数」**只在该文件中有效**；不同的文件中可以声明相同名字的变量和函数，不会互相影响。

如果需要全局数据，可以通过全局函数 `getApp()` 获取到**全局应用实例**，[应用全局属性](#其他属性)；

## API

前面我们看到很多 `wx.` 开头的 API，这些 API 可以让我们方便的调起微信提供的能力，如获取用户信息，本地存储，支付功能等。

现在归类一些 API：

- `on` 开头：事件监听型 API，如 `wx.onSocketOpen`，`wx.onCompassChange` 等。

    这类 API 接受一个**回调函数**作为「参数」，当事件**触发时**会调用这个回调函数，并将相关数据以参数形式传入。

    ```js
    wx.onCompassChange(function (res) {
      console.log(res.direction)
    })
    ```

- `Sync` 结尾，同步执行型 API，如 `wx.setStorageSync`，`wx.getSystemInfoSync` 等。

    这类 API 的**执行结果**可以通过「函数返回值」直接获取，如果执行出错会**抛出异常**。

    ```js
    try {
      wx.setStorageSync('key', 'value')
    } catch (e) {
      console.error(e)
    }
    ```

- 剩下的大多数 API 都是「异步」的。

    这类 API 通常都接受一个 `Object` 类型的**参数**，这个参数都支持**按需传入以下字段**，来**接收接口的调用结果**：

    - `success`：接口**调用成功**的回调函数

    - `fail`：接口**调用失败**的回调函数

    - `complete`：接口调用结束的回调函数（调用成功、失败都会执行）

    上面三个参数均为 `Function` 类型，**都会接收**下列参数：

    - `errMsg`：失败显示错误信息，成功显示 `${API Name}: ok`；

    - `errCode`：错误码，仅部分 API 支持，成功为 `0`；

    举例：

    ```js
    wx.login({
      success(res) {
        console.log(res.code)
      }
    })
    ```