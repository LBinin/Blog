# React SFC 无状态组件及多种组件写法

## 起因

之前写过无状态组件，但是没有配合 TS 写过。

这次其实是在写一个小组件的时候，看到了 Antd 团队中使用了 `React.SFC` 这样的写法，对此好奇，并吸收一些他人的 Code Style。

## 简介

<ruby>
  S <rp>(</rp><rt>Stateless</rt><rp>)</rp>
  F <rp>(</rp><rt>Functional</rt><rp>)</rp>
  C <rp>(</rp><rt>Components</rt><rp>)</rp>
</ruby>，表示「无状态」的函数式组件。

`React.SFC` 其实就是状态组件的 TS 写法。

React 中创建组件的**三种**方法：

- ES5
- ES6
- SFC

## 特点

- 没有 refs 属性

## 写法

### ES5

使用 `React.createClass` 方法（不推荐）：

```jsx
var React = require('react');
var ReactDOM = require('react-dom');

var CusImg = React.createClass({
  getDefaultProps() {
    return {
      // 这里可以设置初始化 Props
      // 在 ES6 Class 用 Class.defaultProps 代替
    };
  },

  getInitialState () {
    return {
      // 这里可以设置初始化 Props
      // 在 ES6 Class 可以在 Constructor 中直接对 `this.state` 赋值
    };
  },

  // 参数对象中必须拥有 `render` 属性
  render: function() {
    return (
      <div className={this.props.style}>
        <img src={this.props.imgurl}/>
        <text className={this.props.textStyle}>{this.props.text}</text>
      </div>
    );
  }
});

ReactDOM.render(
  <CusImg />,
  document.getElementById('container')
);
```

**缺点**：

- `React.createClass` 会自动绑定函数的 `this` 指向；

    `React.Component` 可以选择性的绑定需要绑定的函数，这样可以节省不必要的性能开销。

- `React.createClass` 的 `mixins` 实际上不够自然、直观（ES6 Class 不支持 `mixin`）。

### ES6 

创建类继承 `React.Component`：

**有状态**：

```jsx
import React from 'react'

class SwitchButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      open: this.props.open
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(event) {
    this.setState({ open: !this.state.open })
  }

  render() {
    let open = this.state.open,
        className = open ? 'switch-button open' : 'btn-switch'

    return (
      <label className={className} onClick={this.handleClick}>
        <input type="checkbox" checked={open}/> 男
      </label>
    )
  }
}

SwitchButton.defaultProps = {
  open: false
}
```

**无状态**：

```jsx
import React, { Component } from 'react';

const App = props => {
  const {title} = props;

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">{title}</h1>
      </header>
      <p className="App-intro">
        To get started, edit <code>src/App.js</code> and save to reload.
      </p>
    </div>
  )
}

export default App;
```

### TS 无状态

```tsx
import * as React from 'react';

interface AppProps {
  title?: React.ReactNode;
}

const App: React.SFC<AppProps> = props => {
  const {title} = props;

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">{title}</h1>
      </header>
      <p className="App-intro">
        To get started, edit <code>src/App.js</code> and save to reload.
      </p>
    </div>
  )
}

export default App;
```

其实在 SFC 中还是能获取到 `ref` 的：

```jsx
const App: React.SFC<AppProps> = props => {
  const {title} = props;
  let ref;

  return (
    <div className="App" ref={ref => node = ref}>{title}</div>
  )
}
```

**优点**：

- 适当减少代码量，可读性增强；

- 无状态，统一移交给高阶组件（HOC）或者 Redux 进行管理；

    这种模式在大型项目或者组件中经常被使用，未来 React 也会对 SFC 做一些专门的优化；

## PropTypes 与 DefaultProps

PropTypes：接受的 props 类型强校验。（代替了 `React.createClass` 中的 `getDefaultProps`）

DefaultProps：对应 props 要是值为空，则使用 DefaultProps 中对应的值。

```js
import PropTypes from 'prop-types';

const TodoItem = props => {
  const {index, content, onDelete} = props;

  return (
    <p>{index}: {content} <button onClick={onDelete}>x</button></p>
  )
}

TodoItem.propTypes = {
  content: PropTypes.string.isRequired,
  index: optionalArrayOf: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onDelete: PropTypes.func,
};

TodoItem.defaultProps = {
  content: 'default Value'
};

export default TodoItem;
```

## 无状态 vs 有状态

### 无状态组件

无状态组件（Stateless Functional Component）是**最基础的组件形式**，由于没有状态的影响所以就是纯静态展示的作用。

一般来说，各种 UI 库里也是最开始会开发的组件类别。如按钮、标签、输入框等。它的基本组成结构就是属性（props）加上一个渲染函数（render）。

由于不涉及到状态的更新，所以这种组件的复用性也最强。

### 有状态组件

在无状态组件的基础上，如果组件内部包含状态（state）且状态随着事件或者外部的消息而发生改变的时候，这就构成了有状态组件（Stateful Component）。

有状态组件通常会带有**生命周期**（lifecycle），用以在不同的时刻触发状态的更新。

这种组件也是通常在写业务逻辑中最经常使用到的，根据不同的业务场景组件的状态数量以及生命周期机制也不尽相同。

### 性能比较

在 [17、Reac系列之—无状态组件你真的知道吗？ - 简书](https://www.jianshu.com/p/980abadd8a18) 这篇文章中做出了实现进行了性能的比较，咱们总结一下：

现在有内容相同的两种状态的组件：

- 无状态组件（Stateless Functional Component）
- 有状态组件（Stateful Component）

现在有三种调用方式：

1. 有状态组件的常规调用方式：`<Stateful someProps={123}/>`；

2. 无状态组件的常规调用方式：`<Stateless someProps={123}/>`；

3. 无状态组件的函数式调用：`Stateless( {someProps:123} )`。


上述三种方式，**1** 和 **2** 性能相差不多，**3** 提升性能最高。

结论：**无状态组件**性能确实比**有状态**的性能高，但是提高的性能微乎其微；但是无状态组件的**函数式调用**性能提高了不少。

## PureComponent

> PureComponent 的作用：用来提升性能，因为它减少了应用中的渲染次数。

React15.3 中新加了一个 `PureComponent` 类，它是优化 React 应用程序最重要的方法之一。

在简单组件（纯展示组件）上的性能可以高出 `React.Component` 几十倍，所以性能还是很可观的~

### 原理

当组件更新时，如果组件的 `props` 和 `state` 都没发生改变，`render` 方法就不会触发，省去 **Virtual DOM** 的「生成」和「比对」过程，达到提升性能的目的。

React 做了如下判断：

```js
if (this._compositeType === CompositeTypes.PureClass) {
  shouldUpdate = !shallowEqual(prevProps, nextProps)
  || !shallowEqual(inst.state, nextState);
}
```

这里的 `shallowEqual` 会比较 `Object.keys(state | props)` 的**长度是否一致**，每一个 `key` 是否**两者都有**，并且**是否是一个引用**，也就是只比较了**第一层的值**，确实很浅，所以深层的嵌套数据是对比不出来的。

### 注意点

❗️需要注意的是：

1. 如果 `PureComponent` 里有 `shouldComponentUpdate` 函数的话，React 会直接使用 shouldComponentUpdate 的结果作为是否更新的依据；

    只有**不存在** `shouldComponentUpdate` 函数，React 才会去判断是不是 `PureComponent`，是的话再去做 `shallowEqual` 浅比较。

    也因为可以少写 `shouldComponentUpdate` 函数，倒也节省了点代码。

2. 因为只做了浅比较，所以需要注意 state 或 props 中修改前后的对象引用是否一致；

3. 由于是 React15.3 之后才有的，所以可能需要进行兼容操作；

    ```js
    import React { PureComponent, Component } from 'react';

    class Foo extends (PureComponent || Component) {
      //...
    }
    ```

## 参考资料
 
> [Reac系列之 — 无状态组件你真的知道吗？ - 简书](https://www.jianshu.com/p/980abadd8a18)
> 
> [React中的无状态和有状态组件_React 教程_w3cplus](https://www.w3cplus.com/react/stateful-vs-stateless-components.html)
> 
> [关于react无状态组件(函数式组件) · Issue #20 · ckinmind/ReactCollect · GitHub](https://github.com/ckinmind/ReactCollect/issues/20)
>
> [React.createClass versus extends React.Component](https://toddmotto.com/react-create-class-versus-component/#reactcreateclass)
> 
> [React SFC 無生命週期精煉版的Component](https://www.never-nop.com/?p=4602) 需要梯子
> 
> [React PureComponent 使用指南 | 御风天流的博客](https://wulv.site/2017-05-31/react-purecomponent.html)