# 使用 webpack 定制前端开发环境

## webpack 配置

```js
module.exports = {
  module: { // 配置如何处理项目中的不同类型的模块
    rules: [ // array 匹配请求的规则数组
      { // 一个 object 即一条规则

        // resource：请求文件的绝对路径, 它已经根据 resolve 规则解析.
        // issuer: 被请求资源(requested the resource)的模块文件的绝对路径, 是导入时的位置.
        // 如: 从 app.js 导入 './style.css', resource 是 /path/to/style.css; issuer 是 /path/to/app.js.
        // 属性 test, include, exclude 和 resource 对 resource 匹配
        // 属性 issuer 对 issuer 匹配

        test: /\.jsx?/, // 匹配条件, 匹配 js 和 jsx

        include: [ // 匹配特定路径下 resource
          path.resolve(__dirname, 'src'), // 绝对路径
        ],

        exclude: /node_modules/, // 排除特定路径下 resource, 可以是正则

        use: 'babel-loader', // 匹配规则的模块应用的 loader, 可以是一个字符串, 也可以是一个表示 loader 的对象或者 loader 数组
        type: 'javascript/esm', // 这里指定模块类型, 五种 module type, 默认为 javascript/auto
        enforce: 'pre', // 默认是没有值, 表示普通 loader, "pre" | "post" 详情  https://webpack.docschina.org/configuration/module/#rule-enforce
        noParse: /jquery|lodash/, // 配置哪些模块文件的内容不需要进行解析, 也可以用函数的形式
        noParse(content) { // 从 webpack 3.0.0 开始
          // 对于一些不需要解析依赖（即无依赖） 的第三方大型类库等，可以通过这个字段来配置，以提高整体的构建速度。
          return /jquery|lodash/.test(content)
        },
      },
      {
        test: /\.less/, // 匹配条件, 匹配 less 文件
        use: [ // use 可以是一个字符串或者表示 loader 的对象
          'style-loader', // 直接使用字符串表示 loader
          {  // 用对象表示 loader, 可以传递 loader 配置等
            loader: 'css-loader',
            options: { // 传递 loader 配置
              importLoaders: 1
            },
          },
          {
            loader: 'less-loader',
            options: { // 传递 loader 配置
              noIeCompat: true
            },
          },

          // 这里配置了三个 loader 去解析 less 模块
          // 执行顺序是从「最后」配置的 loader 开始
          // 如上, 一个 style.less 文件会依次途径 less-loader、css-loader、style-loader 处理, 成为一个可以打包的模块。
        ],
      },
      // ...
    ],
  },

  resolve: { // object 配置模块路径相关解析

	  alias: { // object 定义别名
      utils: path.resolve(__dirname, 'src/utils'),
      // 可以直接 import 'utils' 来引用
      // 可将 import some from '../../utils/some';
      // 改为 import some from 'utils/some';
      utils$: path.resolve(__dirname, 'src/utils'),
      // 精确匹配, 只会匹配 import 'utils';
      // import some from 'utils/some.js'; 这样的匹配将会触发普通解析
    },
    // 详情：https://webpack.docschina.org/configuration/resolve/#resolve-alias

    extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx'], // array 扩展名补充
    // webpack 会尝试帮你补全 extensions 中存在后缀名来进行查找
    // 如：import * as common from './src/utils/common' 可以命中 common.js
    // 这里的顺序代表匹配后缀的优先级, 例如对于 index.js 和 index.jsx, 会优先选择 index.js
    // 如果尝试了上面所有的扩展名还是没有, 如 common.css, 那么 webpack 将会因为无法解析而报错

    modules: ['node_modules'], // array 告诉 webpack 解析模块时应该搜索的目录

    mainFields: ['browser', 'module', 'main'], // 决定在 package.json 中使用哪个字段导入模块.
    // 当 target 属性设置为 webworker, web 或者没有指定, mainFields 的默认值 ['browser', 'module', 'main']
    // 对于其他任意的 target（包括 node）, mainFields 的默认值 ['module', 'main']
    // 如 D3 的 package.json：{
    //   "main": "build/d3.Node.js",
    //   "browser": "build/d3.js",
    //   "module": "index"
    // }

    mainFiles: ['index'], // 解析目录时要使用的文件名, 一般不会更改, 所以约定俗成为 index

    resolveLoader: { // 用于配置解析 loader 时的 resolve 配置
      modules: ['node_modules'],
      extensions: ['.js', '.json'],
      mainFields: ['loader', 'main'],
    }
  },

  plugins: [ // array 配置项目所使用的插件

    /**
     * 内置插件, 可以通过 webpack.* 调用
     */
    new webpack.DefinePlugin({
      // 该插件用于创建一些在编译时可以配置的「全局常量」
      // https://webpack.docschina.org/plugins/define-plugin/
      PRODUCTION: JSON.stringify(true), // const PRODUCTION = true
      VERSION: JSON.stringify('5fa3b9'), // const VERSION = '5fa3b9'
      BROWSER_SUPPORTS_HTML5: true, // const BROWSER_SUPPORTS_HTML5 = 'true'
      TWO: '1+1', // const TWO = 1 + 1,
      CONSTANTS: {
        APP_VERSION: JSON.stringify('1.1.2') // const CONSTANTS = { APP_VERSION: '1.1.2' }
      }
      // 如果配置的值是字符串，那么整个字符串会被当成代码片段来执行，其结果作为最终变量的值，如上面的 "1+1"，最后的结果是 2
      // 如果配置的值不是字符串，也不是一个对象字面量，那么该值会被转为一个字符串，如 true，最后的结果是 'true'
      // 如果配置的是一个对象字面量，那么该对象的所有 key 会以同样的方式去定义
      // 如果需要配置的内容是字符串, 使用 JSON.stringify() 反序列化
    }),

    new webpack.ProvidePlugin({
      // 该组件用于引用某些模块作为应用运行时的变量，从而不必每次都用 require 或者 import
      // https://webpack.docschina.org/plugins/provide-plugin/
      $: 'jquery', // $('#item'); // <= 起作用
      jQuery: 'jquery', // jQuery('#item'); // <= 起作用
      Vue: ['vue/dist/vue.esm.js', 'default'], // 引用 Vue
      some_identifier: ['lodash', 'map'],
      // 即引用 lodash 下的 map, import { map } from 'lodash'
    }),

    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // 该插件用于忽略某些特定的模块, 让 webpack 不把这些指定的模块打包进去, 比如 moment.js 中大量的 i18n 的代码。

    /**
     * 第三方插件
     */
    new CopyWebpackPlugin([
      // 调用: const CopyWebpackPlugin = require('copy-webpack-plugin')
      // 该插件用于复制文件, 很多情况下一些文件没有被 webapck 处理, 但是我们想把它们放到构建后的 build 文件夹下, 就可以使用 copy-webpack-plugin 来实现
      // https://github.com/webpack-contrib/copy-webpack-plugin
      { from: 'src/file.txt', to: 'build/file.txt', },
      // 顾名思义，from 配置来源，to 配置目标路径
      { from: 'src/*.ico', to: 'build/*.ico' },
      // 配置项可以使用 glob https://github.com/isaacs/node-glob#glob-primer
    ]),

    new ExtractTextPlugin('[name].[hash].css'),
    // 调用: const ExtractTextPlugin = require('extract-text-webpack-plugin')
    // 配合 rules 使用
    // {
    //   test: /\.css$/, // 因为这个插件需要干涉模块转换的内容，所以需要使用它对应的 loader
    //   use: ExtractTextPlugin.extract({ // 使用 ExtractTextPlugin 的 extract 方法
    //     fallback: 'style-loader',
    //     use: 'css-loader',
    //   }), 
    // }
  ]
}
```

## Module Type
webpack 4.x 版本强化了 module type，即模块类型的概念，不同的模块类型类似于配置了不同的 loader，webpack 会有针对性地进行处理，现阶段实现了以下 5 种模块类型

* `javascript/auto`：即 webpack 3 默认的类型，支持现有的各种 JS 代码模块类型 —— CommonJS、AMD、ESM；
* `javascript/esm`：ECMAScript modules，其他模块系统，例如 CommonJS 或者 AMD 等不支持，是 `.mjs` 文件的默认类型；
* `javascript/dynamic`：CommonJS 和 AMD，排除 ESM；
* `javascript/json`：JSON 格式数据，require 或者 import 都可以引入，是 `.json` 文件的默认类型；
* `webassembly/experimental`：WebAssembly modules，当前还处于试验阶段，是 `.wasm` 文件的默认类型；

## Loader 和 Plugin 的区别

针对文件模块转换要做的使用 loader，而其他干涉构建内容的可以使用 plugin。

## webpack-dev-server

> webpack-dev-server 是 webpack 官方提供的一个工具，可以基于当前的 webpack 构建配置快速启动一个静态服务。当 mode 为 development 时，会具备 hot reload 的功能（热更新）。

它本质上也是调用的 webpack，4.* 的版本需要指定 mode。

### 安装并启动
```
npm install webpack-dev-server -g
webpack-dev-server --mode development 
```

webpack-dev-server 默认使用 8080 端口，如果你使用了 html-webpack-plugin 来构建 HTML 文件，并且有一个 index.html 的构建结果，那么直接访问 http://localhost:8080/ 就可以看到 index.html 页面了。如果没有 HTML 文件的话，那么 webpack-dev-server 会生成一个展示静态资源列表的页面。

### 配置
```js
// webpack.config.js
module.exports = {
	devServer: { // object webpack-dev-server 相关配置
    // 更多额外的配置见：https://webpack.docschina.org/configuration/dev-server/
    
    public: 'http://localhost:8080/', // 指定静态服务的域名

    port: 8080, // 指定静态服务的端口

    publicPath: '/', // 指定构建好的「静态文件」在浏览器中用什么路径去访问
    // 例如, 对于一个构建好的文件 bundle.js, 完整的访问路径是 http://localhost:8080/bundle.js
    // 如果你配置了 publicPath: 'assets/', 那么上述 bundle.js 的完整访问路径就是 http://localhost:8080/assets/bundle.js。
    // 可以使用整个 URL 来作为 publicPath 的值, 如 publicPath: 'http://localhost:8080/assets/'。
    // 建议将 devServer.publicPath 和 output.publicPath 的值保持一致。

    proxy: { // object 配置 webpack-dev-server 将特定 URL 的请求代理到另外一台服务器上。
      '/api': {
        target: 'http://localhost:3000', // 将 URL 中带有 /api 的请求代理到本地的 3000 端口的服务上
        pathRewrite: { '^/api': '' }, // 把 URL 中 path 部分的 `api` 移除掉
      },
    },
    // 使用详情：https://github.com/chimurai/http-proxy-middleware#example

    contentBase: path.join(__dirname, "public"), // 配置提供额外静态文件内容的目录, 推荐使用绝对路径
    // 不过在 Vue-cli 中的配置是将此项设置为 false, 推荐使用的是 CopyWebpackPlugin

    before(app) {
      app.get('/some/path', function(req, res) { // 当访问 /some/path 路径时，返回自定义的 json 数据
        res.json({ custom: 'response' })
      })
    },
    after(app) {
      // ...
    },
    // before 和 after 都是用于在 webpack-dev-serve 中定义额外的中间件
    // before 在 webpack-dev-serve 静态资源中间件处理之前, 可以用于拦截部分请求返回特定内容, 或者实现简单的数据 mock
    // after 在 webpack-dev-serve 静态资源中间件处理之后, 比较少用到, 可以用于打印日志, 或者做一些额外的处理
  }
}
```

## webpack-dev-middleware

> webpack-dev-middleware 就是在 Express 中提供 webpack-dev-server 静态服务能力的一个中间件，我们可以很轻松地将其集成到现有的 Express 代码中去，就像添加一个 Express 中间件那么简单。

### 安装依赖

```bash
npm install webpack-dev-middleware --save-dev
```

### 创建 Node.js 服务脚本

```js
// app.js
const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')
const webpackOptions = require('./webpack.config.js') // webpack 配置文件的路径

// 本地的开发环境默认就是使用 development mode
webpackOptions.mode = 'development'

const compiler = webpack(webpackOptions)
const express = require('express')
const app = express()

app.use(middleware(compiler, {
  // webpack-dev-middleware 的配置选项
}))

// 其他 Web 服务中间件
// app.use(...)

app.listen(3000, () => console.log('Example app listening on port 3000!'))
```

使用 **webpack-dev-server** 的好处是相对简单，直接安装依赖后执行命令即可。
而使用 **webpack-dev-middleware** 的好处是可以在既有的 **Express** 代码基础上快速添加 **webpack-dev-server** 的功能，同时利用 **Express** 来根据需要添加更多的功能，如 mock 服务、代理 API 请求等。

其实 **webpack-dev-server** 也是基于 **Express** 开发的，前面提及的 **webpack-dev-server** 中 `before` 或 `after` 的配置字段，也可以用于编写特定的中间件来根据需要添加额外的功能。

## Mock

**webpack-dev-server** 的 `before` 或 `proxy` 配置，又或者是 **webpack-dev-middleware** 结合 **Express**，都可以帮助我们来实现简单的 mock 服务。

```js
// mock.js
module.exports = function mock(app) {
  app.get('/some/path', (req, res) => {
    res.json({ data: '' })
  })

  // ... 其他的请求 mock
  // 如果 mock 代码过多，可以将其拆分成多个代码文件，然后 require 进来
}
```

配置：
```js
// webpack.conf.js
const mock = require("./mock.js")
//...
module.exports = {
  // ...
  devServer: {
    before(app) {
      mock(app)
    }
  }
}
```

当你单独实现或者使用一个 mock 服务时，你可以通过 proxy 来配置部分路径代理到对应的 mock 服务上去，从而把 mock 服务集成到当前的开发服务中去，相对来说也很简单。

当你和后端开发进行联调时，亦可使用 proxy 代理到对应联调使用的机器上，从而可以使用本地前端代码的开发环境来进行联调。当然了，连线上环境的异常都可以这样来尝试定位问题。

## 开发环境和生产环境的构建差异
[webpack 4: mode and optimization – webpack – Medium](https://medium.com/webpack/webpack-4-mode-and-optimization-5423a6bc597a)

书写中...
















## 参考资料
> [使用 webpack 定制前端开发环境 - 掘金小册](https://juejin.im/book/5a6abad5518825733c144469/section/5a6abad5518825732e2f8546)