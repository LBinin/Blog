## ESModule

### `import`

#### 语法

```js
import foo from './foo';
import 自定义的变量名 from '模块路径'
```

#### 注意点

1. ESModule 的 `import` 实际上是一个**解构赋值**的过程。

    ```js
    import foo from './foo';
    /* 相当于 */
    import {default as foo} from './foo';
    ```

2. `import` 导入模块的过程是在 **「编译时」** 就确定的。

    所以命令中不能使用表达式和变量，也就是那些只有在运行时才能得到结果的语法结构。

3. `import` 命令具有**提升**效果，会提升到整个模块的头部，首先执行。
4. 命令**只会执行一次**。也就是如果多次重复执行同一句 `import` 语句，那么只会执行一次，而不会执行多次。
5. **单例模式**

    ```js
    import { foo } from 'my_module'
    import { bar } from 'my_module'

    // 等同于
    import { foo, bar } from 'my_module'
    ```

### `export`

#### 语法

```js
var firstName = 'Michael'
var lastName = 'Jackson'
var year = 1958
var foo = "foo"

export {firstName, lastName, year}

/* 别名 */
export {firstName as f, lastName as l, year as y}

/* 默认输出 */
export default foo
// 相当于
export {foo as default}

/* export 与 import 的复合写法 */
export { foo, bar } from 'my_module'
// 可以简单理解为
import { foo, bar } from 'my_module'
export { foo, bar }
```

#### 注意点

1. `export` 后面的内容需要一个定义的变量，而不能是字面量（Literal）。

    ```js
    export 42 // 报错
    
    var m = 1
    export m // 错误

    var a = 1
    export default a // 正确

    export var a = 1 // 正确

    var m = 1
    export {m} // 正确
    ```

2. `export` 语句输出的接口，与其对应的值是**动态绑定关系**，即通过该接口，可以取到模块内部**实时的值**。

## CommonJS

### `require`



### `exports`

## ESModule 与 CommonJS 关系

在 Webpack 构建之后，都是 CommonJS 格式。

### 差异

- CommonJS 模块输出的是一个值的「**拷贝**」，ES6 模块输出的是值的「**引用**」。

    也就是说，一旦输出一个值，模块**内部的变化就影响不到这个值**。

- CommonJS 模块是「**运行时**」加载，ES6 模块是「编译时」输出接口。

    CommonJS 加载的是一个对象（ 即 `module.exports` 属性 ），该**对象只有在脚本运行完才会生成**。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码**静态解析阶段就会生成**。

## ESModule 加载 CommonJS 模块

因为 ES6 模块是在「**编译时**」确定输出接口，而 CommonJS 模块是在「**运行时**」确定输出接口。

所以使用 `import` 加载 CommonJS 模块的时候：

```js
// 错误
import { readFile } from 'fs';

// 正确
import * as express from 'express';
const app = express.default();

// 正确
import express from 'express';
const app = express();
```

因为 `fs` 是 CommonJS 格式，所以只有在「运行时」才能确定输出接口，所以使用 `import` 是无法获取的，因为 `import` 要求在编译的时候就确定输出接口。

## CommonJS 模块加载 ESModule

CommonJS 模块加载 ES6 模块，不能直接使用 `require` 命令，而要使用 `import()` 函数。ES6 模块的所有输出接口，会成为输入对象的属性。

```js
// es.mjs
let foo = { bar: 'my-default' }
export default foo
foo = null

// cjs.js
const es_namespace = await import('./es')
/*
es_namespace = {
  get default() {
    ...
  }
}
*/
console.log(es_namespace.default)
// { bar:'my-default' }
// 由于缓存机制， es.mjs 对 foo 的重新赋值没有在模块外部反映出来。
```

需要注意的是，`import` 是运行时执行的，所以可以通过条件去 `import` 或者 `import` 一个动态生成的 module name。

## CommonJS 加载模块原理

CommonJS 的一个模块，就是一个**脚本文件**。

`require` 命令第一次加载某个脚本的时候，就会**执行整个脚本**，然后在**内存生成一个「对象」**；

对象大致结构如下（通过 `console.log(module)` 打印）：

```js
{
  id: '...', // 模块名
  exports: { ... }, // 模块输出的各个接口, 也就是通过 module.exports = {...} 或者 exports['xxx'] 赋值 的内容
  loaded: true, // 表示该模块的脚本是否执行完毕
  
  // ...还有很多其他属性
}
```

上述对象就是 Node 内部加载模块后生成的一个对象。

此后如果继续 `require` 相同模块，也不会再次执行该模块，而是到**缓存之中取出该对象**（所以对象内部数据不会再因为被引用模块内部原因改变，相当于拿到的是运行结果的副本，ESModule 则相反）；

也就是说，CommonJS 模块无论加载多少次，都**只会在第一次加载时运行一次**，以后再加载，就返回第一次运行的结果，除非**手动清除系统缓存**。

```js
// 删除指定模块的缓存
delete require.cache[moduleName];

// 删除所有模块的缓存
Object.keys(require.cache).forEach(function(key) {
  delete require.cache[key];
})
```

## CommonJS2

什么是 CommonJS2： [What is commonjs2 ? · Issue #1114 · webpack/webpack · GitHub](https://github.com/webpack/webpack/issues/1114#issuecomment-105509929)

里面有一段话：

> CommonJs spec defines only exports. But module.exports is used by node.js and many other CommonJs implementations.
> 
> commonjs mean pure CommonJs
>
> commonjs2 also includes the module.exports stuff.

可以得知，CommonJS 规范只定义了 `exports`，然鹅 `module.exports` 是 Node.js 对 CommonJS 的实现，我们把 Node.js 中这种对 CommonJS 的实现称为 **CommonJS2**。

## 面试题

1. **循环引用**

    这里有三个文件：a.js、b.js、main.js

    ```js
    // a.js
    exports.done = false
    var b = require('./b.js')
    console.log('在 a.js 之中，b.done = %j', b.done)
    exports.done = true
    console.log('a.js 执行完毕')

    // b.js
    exports.done = false
    var a = require('./a.js')
    console.log('在 b.js 之中，a.done = %j', a.done)
    exports.done = true
    console.log('b.js 执行完毕')

    // main.js
    var a = require('./a.js')
    var b = require('./b.js')
    console.log('在 main.js 之中, a.done = %j, b.done = %j', a.done, b.done)
    ```

    运行后输出结果：

    ```bash
    $ node main.js

    在 b.js 之中，a.done = false
    b.js 执行完毕
    在 a.js 之中，b.done = true
    a.js 执行完毕
    在 main.js 之中, a.done = true, b.done = true
    ```

    咱们一步步的看：

    1. `require('./a.js')` 这句代码表示加载 a.js，根据「加载时执行」，a 的 `export.done` 变为了 `false`，开始加载 b.js，这时候，a.js 的代码就在 `var b = require('./b.js')` 这里停止了。

    2. 这时候开始加载 b.js，执行其中的代码，b 的 `export.done` 变为了 `false`，然后开始加载 a.js 的内容，这时候就发生了「循环加载」。


    3. 这时候，系统会去 a.js 模块对应对象的 **`exports`** 属性取值。可是因为 a.js 还「没有执行完」，从 **`exports`** 属性只能取出「已经执行的部分」，而不是最后的值，也就是 `a.done = false` 这段已经被执行的语句。


    4. 因此，对于 b.js 来说，它从 a.js 只输入一个变量 `done`，值为 `false`。然后 b.js 继续往下执行，输出内容，等到全部执行完毕，再把执行权交还给 a.js。
    
    5. a.js 接着往下执行，直到执行完毕。
    
    6. a.js 执行完毕后，执行权交还给 main.js，直到 main.js 执行完毕。
    
    **过程已经描述完毕，现在我们通过结果可以知道两件事情**：

    1. 在 b.js 之中，a.js 没有执行完毕，只执行了第一行。
    
    2. main.js 执行到第二行时，不会再次执行 b.js，而是输出缓存的 b.js 的执行结果，即它的第四行 exports.done = true。
    
    **总结**：CommonJS 输入的是被输出值的拷贝，不是引用。

---

1. 为何有的地方使用 require 去引用一个模块时需要加上 default？ require('xx').default
1. 经常在各大UI组件引用的文档上会看到说明 import { button } from 'xx-ui' 这样会引入所有组件内容，需要添加额外的 babel 配置，比如 babel-plugin-component？
1. 为什么可以使用 es6 的 import 去引用 commonjs 规范定义的模块，或者反过来也可以又是为什么？
1. 我们在浏览一些 npm 下载下来的 UI 组件模块时（比如说 element-ui 的 lib 文件下），看到的都是 webpack 编译好的 js 文件，可以使用 import 或 require 再去引用。但是我们平时编译好的 js 是无法再被其他模块 import 的，这是为什么？
1. babel 在模块化的场景中充当了什么角色？以及 webpack ？哪个启到了关键作用？
1. 听说 es6 还有 tree-shaking 功能，怎么才能使用这个功能？

## 参考资料

> [LearnJS/Module的加载实现.md at master · LBinin/LearnJS · GitHub](https://github.com/LBinin/LearnJS/blob/master/ES6/Module%E7%9A%84%E5%8A%A0%E8%BD%BD%E5%AE%9E%E7%8E%B0.md)
> 
> [「前端」import、require、export、module.exports 混合详解 · Issue #39 · ShowJoy-com/showjoy-blog · GitHub](https://github.com/ShowJoy-com/showjoy-blog/issues/39)
> 
> [Node中没搞明白require和import，你会被坑的很惨 - 腾讯Web前端 IMWeb 团队社区 | blog | 团队博客](http://imweb.io/topic/582293894067ce9726778be9)