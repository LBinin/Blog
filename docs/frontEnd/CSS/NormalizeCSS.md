## 简介
**Normalize.css** 是一个可定制的 CSS 文件，**使浏览器呈现的所有元素，更一致和符合现代标准**。它正是针对只需要统一的元素样式。

**Normalize.css** 注重通用的方案，重置掉该重置的样式，保留有用的 user agent 样式，同时进行一些 bug 的修复，这点是 reset 所缺乏的。

## 使用

- 使用 CDN

  ```html
  <link href="https://cdn.bootcss.com/normalize/8.0.0/normalize.css" rel="stylesheet">
  <!-- 或者 min 版本 -->
  <link href="https://cdn.bootcss.com/normalize/8.0.0/normalize.min.css" rel="stylesheet">
  ```

- Node

  首先通过 NPM 安装：

  ```bash
  $ npm install normalize.css
  ```

  然后在 `main.js`（或者其他你需要的地方）中添加：

  ```js
  import 'normalize.css'
  ```

大功告成~

## 参考资料

[Normalize.css: Make browsers render all elements more consistently.](http://necolas.github.io/normalize.css/)