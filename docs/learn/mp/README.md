# 小程序入手

## 目录结构

在使用「普通模板」**初始化**小程序后我们可以看到以下的结构：

    ├── app.js                # 注册一个小程序, 存放小程序逻辑
    ├── app.json              # 存放对当前小程序的全局配置
    ├── app.wxss              # 小程序公共样式表
    ├── project.config.json   # 开发偏好设置
    │
    ├── pages                 # 存放所有页面内容及配置
    │   │
    │   ├── index             # 小程序 index 页面
    │   │   ├── index.js      # index 页面逻辑
    │   │   ├── index.wxml    # index 页面结构
    │   │   └── index.wxss    # index 页面样式表
    │   │
    │   └── logs              # 小程序 logs 页面
    │       ├── logs.js       # logs 页面逻辑
    │       ├── logs.json     # logs 页面配置
    │       ├── logs.wxml     # logs 页面结构
    │       └── logs.wxss     # logs 页面样式表
    │
    └── utils                 # 工具库
        └── util.js

## 小程序构成

一个正常运行的小程序通常包括一个描述整体程序的描述文件，这些描述文件分别为：

- `app.js`：小程序的整体「生命周期」描述及全局变量配置。

- [`app.json`](#app-json)：小程序的全局配置，如页面文件的路径、窗口表现、设置网络超时时间、设置多 tab 等。

- `app.wxss`：小程序的全局样式表。

## 页面构成

一个小程序的页面通常包含了下面四个文件：

- `.js` 文件：负责页面逻辑。
- `.wxss` 文件：负责页面样式。
- `.wxml` 文件：负责页面结构。
- `.json` 文件：负责页面配置，详见[页面配置项列表 · 小程序](https://developers.weixin.qq.com/miniprogram/dev/framework/config.html#页面配置项列表)（只能覆盖 `app.json` 下 `window` 字段中的相同配置项，无需写 `window` 这个属性）。

## 文件介绍

### app.json

`app.json` 是对当前小程序的「**全局配置**」，包括了小程序的所有页面路径、界面表现、网络超时时间、底部 tab 等。

通过模板生成的小程序中的 `app.json` 配置内容如下：

```json
{
  "pages": [
    "pages/index/index",
    "pages/logs/logs"
  ],
  "window": {
    "backgroundTextStyle":"light",
    "navigationBarBackgroundColor": "#fff",
    "navigationBarTitleText": "WeChat",
    "navigationBarTextStyle":"black"
  }
}
```

- `pages` 字段：用于描述当前小程序**所有页面路径**，这是为了让微信客户端知道当前你的小程序页面定义在哪个「目录」。
- `window` 字段：小程序所有页面的顶部导航条相关内容如：背景颜色、文字颜色等都在这里定义。

配置详情 👉🏻 ：[app.json 配置项列表 | 页面配置 · 小程序](https://developers.weixin.qq.com/miniprogram/dev/framework/config.html#appjson-%E9%85%8D%E7%BD%AE%E9%A1%B9%E5%88%97%E8%A1%A8)

### page.json

`page.json` 表示的是和小程序页面相关的 `pages/index/index.json` 或者 `pages/logs/logs.json` 这类文件的相关配置。

通过这类文件可以独立定义每个页面的一些属性，用来覆盖 `app.json` 中 `window` 字段的对应属性。

### project.config.json

该文件用来保存我们在开发时候的偏好设置。

日后在载入同一个项目的代码包，开发者工具就自动会帮你恢复到当时你开发项目时的个性化配置，其中会包括编辑器的颜色、代码上传时自动压缩等等一系列选项。

默认配置内容如下：

```json
{
	"description": "项目配置文件",
	"packOptions": {
		"ignore": []
	},
	"setting": {
		"urlCheck": true,
		"es6": true,
		"postcss": true,
		"minified": true,
		"newFeature": true
	},
	"compileType": "miniprogram",
	"libVersion": "1.9.98",
	"appid": "wx28a462a1dec714ca",
	"projectname": "我的小程序",
	"isGameTourist": false,
	"condition": {
		"search": {
			"current": -1,
			"list": []
		},
		"conversation": {
			"current": -1,
			"list": []
		},
		"game": {
			"currentL": -1,
			"list": []
		},
		"miniprogram": {
			"current": -1,
			"list": []
		}
	}
}
```

## WXML 布局文档

在小程序中 WXML 充当的就是类似 HTML 的角色。

`pages/index/index.wxml` 文件中的默认内容：

```xml
<!--index.wxml-->
<view class="container">
  <view class="userinfo">
    <button wx:if="{{!hasUserInfo && canIUse}}" open-type="getUserInfo" bindgetuserinfo="getUserInfo"> 获取头像昵称 </button>
    <block wx:else>
      <image bindtap="bindViewTap" class="userinfo-avatar" src="{{userInfo.avatarUrl}}" background-size="cover"></image>
      <text class="userinfo-nickname">{{ userInfo.nickName }}</text>
    </block>
  </view>
  <view class="usermotto">
    <text class="user-motto">{{ motto }}</text>
  </view>
</view>
```

其实和 Vue 蛮类似的，小程序的框架也是用到了这个思路，采用 MVVM 的开发模式（例如 React, Vue），提倡把渲染和逻辑分离。

WXML 详情 👉🏻 ：[WXML](./WXML.md)

## WXSS 样式表

在小程序中 WXSS 充当的就是类似 CSS 的角色。

默认的 `pages/index/index.wxss` 的内容：

```css
/**index.wxss**/
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 200px;
}
```

和 CSS 一些不同的地方：

- 新增了尺寸单位。在写 CSS 样式时，开发者需要考虑到手机设备的屏幕会有不同的宽度和设备像素比，采用一些技巧来换算一些像素单位。WXSS 在底层支持新的尺寸单位 `rpx`，开发者可以免去换算的烦恼，只要交给小程序底层来换算即可，由于换算采用的浮点数运算，所以运算结果会和预期结果有一点点偏差。
- 提供了全局的样式和局部样式。和前边 `app.json`，`page.json` 的概念相同，你可以写一个 `app.wxss` 作为全局样式，会作用于当前小程序的所有页面，局部页面样式 `page.wxss` 仅对当前页面生效。
- 此外 WXSS 仅支持部分 CSS 选择器。

WXSS 详情 👉🏻 ：[WXSS](./WXSS.md)

## JS 部分

逻辑层的交互处理的还是需要我大 JS 来操作的啦~

默认的 `pages/logs/logs.js` 文件下内容：

```js
//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: []
  },
  onLoad: function () {
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  }
})
```

逻辑层 详情 👉🏻 ：[逻辑层](./Logic-Layer.md)

## 参考资料

> [简易教程 · 小程序](https://developers.weixin.qq.com/miniprogram/dev/quickstart/basic/getting-started.html)
>
> [框架 · 小程序](https://developers.weixin.qq.com/miniprogram/dev/framework/MINA.html)