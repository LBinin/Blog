# TS 简介

## 关于 TypeScript

>「TypeScript 是 JavaScript 的一个超集」
>
> TypeScript 是 JavaScript 的类型的超集，它可以编译成纯 JavaScript。编译出来的 JavaScript 可以运行在任何浏览器上。TypeScript 编译工具可以运行在任何服务器和任何系统上。TypeScript 是开源的。

官网是这么介绍的。它主要提供了**类型系统**和对 **ES6** 的支持，由 Microsoft 开发。

### 优势

- **增加了代码的可读性和可维护性**

    1. **类型系统**实际上是最好的文档，大部分的函数看看类型的定义就可以知道如何使用了
    2. 可以在**编译阶段**就发现大部分错误，这总比在运行时候出错好
    3. 增强了编辑器和 IDE 的功能，包括代码补全、接口提示、跳转到定义、重构等

- **包容**

    1. TypeScript 是 JavaScript 的超集，`.js` 文件可以直接重命名为 `.ts` 即可
    2. 即使**不显式**的定义类型，也能够自动做出类型推论
    3. 可以定义从简单到复杂的几乎一切类型
    4. 即使 TypeScript 编译报错，也可以生成 JavaScript 文件
    5. 兼容第三方库，即使第三方库不是用 TypeScript 写的，也可以编写单独的类型文件供 TypeScript 读取

- **拥有活跃的社区**

    1. 大部分第三方库都有提供给 TypeScript 的类型定义文件
    2. Google 开发的 Angular2 就是使用 TypeScript 编写的
    3. TypeScript 拥抱了 ES6 规范，也支持部分 ESNext 草案的规范

### 劣势

- 学习成本较高，需要理解接口（Interfaces）、泛型（Generics）、类（Classes）、枚举类型（Enums）等前端工程师可能不是很熟悉的概念
- 短期可能会增加一些开发成本，毕竟要多写一些类型的定义，不过对于一个需要长期维护的项目，TypeScript 能够减少其维护成本
- 集成到构建流程需要一些工作量
- 可能和一些库结合的不是很完美

## 安装

全局安装：

```bash
$ npm install -g typescript
```

编译一个 TypeScript 文件：

```bash
$ tsc hello.ts
```

## 初体验

新建一个 `index.ts` 文件：

```ts
// index.ts
function sayHello(person: string) {
    return 'Hello, ' + person;
}

let user = 'Tom';
console.log(sayHello(user));
```

运行 `tsc index.ts`，这时候会得到一个 `index.js` 文件：

```js
// index.js
function sayHello(person) {
    return 'Hello, ' + person;
}
var user = 'Tom';
console.log(sayHello(user));
```

可以看到，并没有什么检测 `person` 类型的代码被加入。

所以，**TypeScript 只会进行静态检查，如果发现有错误，编译的时候就会报错。**

如果在调用的时候传入了其他类型，那么 `ts` 在编译的时候就会报错（虽然还是生成了 `js` 文件，真香）。

如果要在报错的时候终止 `js` 文件的生成，可以在 `tsconfig.json` 中配置 `noEmitOnError` 即可。

## 参考资料

> [TypeScript 入门教程](https://ts.xcatliu.com/)
> 
> [文档简介 · TypeScript中文网 · TypeScript——JavaScript的超集](https://www.tslang.cn/docs/home.html)