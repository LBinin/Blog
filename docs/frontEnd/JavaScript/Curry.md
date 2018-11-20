# 柯里化 Curry

## 简介

在计算机科学中，柯里化（英语：Curry），又译为卡瑞化或加里化，是

> 把接受**多个参数的函数**变换成接受一个**单一参数**（最初函数的第一个参数）的函数，并且返回**接受余下的参数而且返回结果的新函数**的技术。

简单来说，就是：只传递给函数**一部分参数**来调用它，让它**返回一个函数**去处理剩下的参数。

举个最简单的栗子：

```js
var add = function(x) {
  return function(y) {
    return x + y
  }
}

var increment = add(1)
var addTen = add(10)

increment(2) // 3
addTen(2) // 12
```

上面定义了一个 `add` 函数，它接受一个参数并返回一个**新的函数**。调用 `add` 之后，返回的函数就通过闭包的方式继续引用了 `add` 的第一个参数（也就是 `1` 和 `10`）。

一次性地调用它实在是有点繁琐，好在我们可以使用一个特殊的 curry 帮助函数（helper function）使这类函数的定义和调用更加容易。

## 作用

柯里化有 3 个常见作用：

1. 参数复用
2. 提前返回
3. 延迟计算 / 运行

### 参数复用

这就是最基本的用法，也是前面的介绍中的例子，通过闭包的方式继续引用了声明时的第一个参数，让后面调用的时候就不需要重复使用。

### 提前返回

举一个解决兼容性的例子：

```js
const addEvent = function(el, type, fn, capture) {
  if (window.addEventListener) {
    el.addEventListener(type, function(e) {
      fn.call(el, e)
    }, capture)
  } else if (window.attachEvent) {
    el.attachEvent("on" + type, function(e) {
      fn.call(el, e)
    })
  }
}
```

上面代码意味着，每次添加事件的时候都会走一遍 `if...else`，其实，通过柯里化，可以做到一次判定：

```js
const addEvent = (function(){
  if (window.addEventListener) {
    return function(el, sType, fn, capture) {
      el.addEventListener(sType, function(e) {
        fn.call(el, e)
      }, (capture))
    }
  } else if (window.attachEvent) {
    return function(el, sType, fn, capture) {
      el.attachEvent("on" + sType, function(e) {
        fn.call(el, e)
      })
    }
  }
})()
```

初始 `addEvent` 的执行其实值实现了部分的应用（只有一次的 `if...else` 判定），而剩余的参数应用都是其「返回的函数」实现的，典型的柯里化。

### 延迟计算 / 运行

ES5 中的 `bind` 方法，用来改变 `Function` 执行时候的上下文（函数主体本身不执行，与 `call/apply` 直接执行并改变不同），本质上就是延迟执行。

例如：

```js
var obj = {
    "name": "currying" 
},
fun = function() {
    console.log(this.name)
}.bind(obj)

fun() // currying
```

## 感受柯里化之美

我们先声明一系列柯里化后的函数：

```js
var curry = require('lodash').curry

var match = curry(function(what, str) {
  return str.match(what)
})

var replace = curry(function(what, replacement, str) {
  return str.replace(what, replacement)
})

var filter = curry(function(f, ary) {
  return ary.filter(f)
})

var map = curry(function(f, ary) {
  return ary.map(f)
})

// 下面是个人简化版 curry
function curry(fn) {
  return function (first) {
    return function() {
      fn.call(self, first, ...arguments)
    }
  }
}
```

使用：

```js
match(/\s+/g, "hello world")
// [ ' ' ]

match(/\s+/g)("hello world")
// [ ' ' ]

/* 匹配空字符串 */
var hasSpaces = match(/\s+/g)
// function(x) { return x.match(/\s+/g) }

hasSpaces("hello world")
// [ ' ' ]

hasSpaces("spaceless")
// null

filter(hasSpaces, ["tori_spelling", "tori amos"])
// ["tori amos"]

/* 寻找数组中空字符串的元素 */
var findSpaces = filter(hasSpaces)
// function(xs) { return xs.filter(function(x) { return x.match(/\s+/g) }) }

findSpaces(["tori_spelling", "tori amos"])
// ["tori amos"]

/* 替换元音字母 */
var noVowels = replace(/[aeiou]/ig)
// function(replacement, x) { return x.replace(/[aeiou]/ig, replacement) }

var censored = noVowels("*")
// function(x) { return x.replace(/[aeiou]/ig, "*") }

censored("Chocolate Rain")
// 'Ch*c*l*t* R**n'
```

## 实现 plus(1)(4)(2)(3) == 10

```js
function plus(x) {
  let arr = [x]
  
  let func = (y) => {
    arr.push(y)
    return func
  }

  func.valueOf = func.toString = () => {
    return arr.reduce((a, b) => a + b, 0)
  }
  return func
}
```

## 总结

当我们谈论纯函数的时候，我们说它们接受一个输入返回一个输出。curry 函数所做的正是这样：每传递一个参数调用函数，就返回一个新函数处理剩余的参数。这就是一个输入对应一个输出。

哪怕输出是另一个函数，它也是纯函数。当然 curry 函数也允许一次传递多个参数，但这只是出于减少 () 的方便。

## 参考资料
> [JavaScript专题之函数柯里化 · Issue #42 · mqyqingfeng/Blog · GitHub](https://github.com/mqyqingfeng/Blog/issues/42)
> 
> [第 4 章: 柯里化（curry） · JS 函数式编程指南](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/ch4.html#%E4%B8%8D%E4%BB%85%E4%BB%85%E6%98%AF%E5%8F%8C%E5%85%B3%E8%AF%AD%E5%92%96%E5%96%B1)
> 
> [邂逅函数柯里化 - 大前端 - SegmentFault 思否](https://segmentfault.com/a/1190000008263193)
> 
> [JS中的柯里化(currying) 张鑫旭-鑫空间-鑫生活](https://www.zhangxinxu.com/wordpress/2013/02/js-currying/)
> 
> [从一道面试题谈谈函数柯里化(Currying) - 王磊同学小讲堂 - SegmentFault 思否](https://segmentfault.com/a/1190000008193605)
