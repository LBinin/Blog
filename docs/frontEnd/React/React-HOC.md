# React 高阶组件 HOC（Hight-Order Component）

## 什么是高阶组件？

> 高阶组件就是一个 React 组件包裹着另外一个 React 组件。

## 约定

为了方便起见，现约定如下短语：

- `WrappedComponent`：传入工厂方法的、需要被包裹的组件。
- `EnhancedComponent`：加工后返回的新的 HOC。

## 实现方式

React 中两种 HOC 的实现方法：

- Props Proxy (PP) ：HOC 对传给 WrappedComponent 的 props 进行操作
- Inheritance Inversion (II)：HOC 继承 WrappedComponent。

## Props Proxy

通过这种方式我们可以做什么呢？

- 操作 props；
- 通过 Refs 访问到组件实例；
- 提取 state；
- 用其他元素包裹 `WrappedComponent`。

🌰 举个例子：

```jsx
function ppHOC(WrappedComponent) {
	return class PP extends React.component {
	  render() {
	  	return (<WrappedComponent ...{this.props}/>)
	  }
	}
}

// 使用
class App extends React.component {
	const HOC = ppHOC(WillBeWrappedComponent);
	render() {
	  return (<HOC xxprops={"this is a props"}>);
	}
}
```

**ppHOC** 方法返回是一个 React Element 的类，（因为 `<WrappedComponent ...{this.props}/>` 相当于 `React.createElement(WrappedComponent, this.props, null)`），里面接收了 props，可以进行相关操作，这就是名字 **Props Proxy** 的由来。

### 操作 props

既然能够获取到传给 `EnhancedComponent` 的 props，我们就能对 props 进行读取、添加、编辑、删除一系列加工后传给 `WrappedComponent`。

### 通过 Refs 访问到组件实例

这个就不赘述了：

```jsx
function refsHOC(WrappedComponent) {
  return class RefsHOC extends React.Component {
    proc(wrappedComponentInstance) {
      wrappedComponentInstance.method()
    }

    render() {
      const props = Object.assign({}, this.props, {ref: this.proc.bind(this)})
      return <WrappedComponent {...props}/>
    }
  }
}
```

### 提取 state

可以通过传入对应的 props 和回调函数把 `WrappedComponent` 中的 state 提取出来：

```jsx
function ppHOC(WrappedComponent) {
  return class PP extends React.Component {
    constructor(props) {
      super(props)
      this.state = { name: '' }
      this.onNameChange = this.onNameChange.bind(this)
    }
    onNameChange(event) {
      this.setState({ name: event.target.value })
    }
    render() {
      const newProps = {
        name: { value: this.state.name, onChange: this.onNameChange }
      }
      return <WrappedComponent {...this.props} {...newProps}/>
    }
  }
}
```

然后，可以通过修饰器 ( `@` ) 去使用这个 ppHOC：

```jsx
@ppHOC
class Example extends React.Component {
  render() {
    return <input name="name" {...this.props.name}/>
  }
}
```

这样一来 `<input/>` 就变成了一个受控的 input。

### 用其他元素包裹 `WrappedComponent`

该用途体现了 HOC 可以让我们得到更多灵活性。通过这种方式，我们可以封装样式、布局以及许多其他的目的：

```jsx
// 包裹一层样式
const ppHOC = (WrappedComponent) => class PP extends React.Component {
  render() {
    return (
      <div style={{display: 'block'}}>
        <WrappedComponent {...this.props}/>
      </div>
    )
  }
}
```

## Inheritance Inversion

字面上理解就是「继承反转」，举个简单的例子：

```jsx
function iiHOC(WrappedComponent) {
  return class EnhancedComponent extends WrappedComponent {
    render() {
      return super.render()
    }
  }
}
```

可以看到，传入的 `WrappedComponent` 被 HOC 类所继承，之所以称为「继承反转」是因为 `WrappedComponent` 被 `EnhancedComponent` 所继承，而不是 `WrappedComponent` 继承 `EnhancedComponent`，看上去它们的关系被反转（inverse）了。

这种方式允许 HOC 通过 `this` 关键字去访问 `WrappedComponent` 的 state、props、lifecycle；为了不破坏 `WrappedCompoent`，记得调用 `super[lifecycleHook]`。

❗️有关 Inheritance Inversion 最重要的一点是：

> 它的高阶组件不一定会解析完整子树，因为 React 的 [一致化处理](https://reactjs.org/docs/reconciliation.html)，函数类型的 React 元素的子组件渲染将被推迟到真正渲染到屏幕的时候才被解析，所以如果 render 返回的 React 元素树中存在一个函数类型的 React 组件，那么你就无法操作它的子组件。

那么，我们可以用 Inheritance Inversion 做什么呢？

- 渲染劫持（Render Highjacking）
- 操作 state

### 渲染劫持（Render Highjacking）

为什么叫渲染劫持？

> 因为 HOC 可以控制 `WrappedComponent` 的渲染输出，可以做各种各样的事情。

通过渲染劫持我们可以做什么？

- 可以对 render 输出的**任何** React 元素，去读取、添加、编辑、删除 porps。
- 读取和修改由 render 输出的 React 元素树。
- 有条件的渲染元素树。
- 把样式包裹进元素树（就像 Props Propxy 那样）。
*Ps: 以上的 render 均指 WrappedComponent.render()*

- 条件渲染：

  ```jsx
  function iiHOC(WrappedComponent) {
    return class EnhancedComponent extends WrappedComponent {
      render() {
        if (this.props.loggedIn) { return super.render() }
      else { return null }
      }
    }
  }
  ```

  HOC 若接受到 `loggedIn` 的 props 的话，将会渲染出 `WrappedComponent`。

- 修改由 render 方法输出的 React 组件树（Props Proxy 做不到）：

  ```jsx
  function iiHOC(WrappedComponent) {
    return class EnhancedComponent extends WrappedComponent {
      render() {
        const elementsTree = super.render()
        let newProps = {};
        if (elementsTree && elementsTree.type === 'input') {
          newProps = {value: 'may the force be with you'}
        }
        const props = Object.assign({}, elementsTree.props, newProps)
        const newElementsTree = React.cloneElement(elementsTree, props, elementsTree.props.children)
        return newElementsTree
      }
    }
  }
  ```

  你可以在这里做各种各样的事，你可以遍历整个元素树，然后修改元素树中任何元素的 props。

### 操作 state

HOC 可以读取、编辑和删除 `WrappedComponent` 实例的 state，如果你需要，你也可以给它添加更多的 state。记住，这会搞乱 `WrappedComponent` 的 state，导致你可能会破坏某些东西。

要限制 HOC 读取或添加 state，添加 state 时应该放在单独的命名空间里，而不是和 `WrappedComponent` 的 state 混在一起。

```jsx
export function IIHOCDEBUGGER(WrappedComponent) {
  return class II extends WrappedComponent {
    render() {
      return (
        <div>
          <h2>HOC Debugger Component</h2>
          <p>Props</p> <pre>{JSON.stringify(this.props, null, 2)}</pre>
          <p>State</p><pre>{JSON.stringify(this.state, null, 2)}</pre>
          {super.render()}
        </div>
      )
    }
  }
}
```

### 参考资料
> [Higher-Order Components – React](https://reactjs.org/docs/higher-order-components.html)
> 
> [Higher-order Components · GitHub](https://gist.github.com/sebmarkbage/ef0bf1f338a7182b6775)
> 
> [React进阶——使用高阶组件（Higher-order Components）优化你的代码 - kpaxqin - SegmentFault 思否](https://segmentfault.com/a/1190000004598113)
> 
> [深入理解 React 高阶组件](https://zhuanlan.zhihu.com/p/24776678)