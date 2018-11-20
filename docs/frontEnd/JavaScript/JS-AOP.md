# Js 面向切面编程 AOP

## 简介

面向切面编程 AOP（Aspect-oriented programming）的主要作用是把一些跟核心业务逻辑模块无关的功能抽离出来，这些跟业务逻辑无关的功能通常包括日志统计、安全控制、异常处理等。

把这些功能抽离出来之后，再通过「动态织入」的方式掺入业务逻辑模块中。这样做的好处首先是可以**保持业务逻辑模块的纯净和高内聚性**，其次是可以**很方便地复用日志统计等功能模块**。

通常，在 JavaScript 中实现 AOP，都是指把一个函数「动态织入」到另外一个函数之中，具体的实现技术有很多，下面的例子通过扩展 `Function.prototype` 配合高阶函数来做到这一点。

```js
Function.prototype.before = function(beforefn) {
	var __self = this; // 保存原函数的引用
	return function() {	 // 返回包含了原函数和新函数的"代理"函数
	  if (beforefn.apply(this, arguments) === false) { // 执行新函数，修正this
		return false; // 如果返回 false, 便会阻断下一个函数的执行
	  }
	  return __self.apply(this, arguments); // 执行原函数
	}
};

Function.prototype.after = function(afterfn) {
	var __self = this;
	return function() {
	  var ret = __self.apply(this, arguments);
	  if (ret === false) {
		return false;
	  }
	  afterfn.apply(this, arguments);
	  return ret;
	}
};

var func = function() {
    console.log(2);
};

func = func.before(function() {
    console.log(1);
}).after(function() {
    console.log(3);
});

func(); // 按顺序打印出1，2，3
```

## 应用

### 无侵入的统计代码

利用上面的代码，我们可以将**与业务逻辑无关**的代码进行抽离，举个统计创建 1000 个 DOM 节点所需时间的例子：

```js
// bad
var append_doms = function () {
	var d = +new Date // 与业务逻辑无关的代码

	for (var i = 0; i < 1000; i++) {
		var div = document.createElement('div')
		document.body.appendChild(div)
	}

	user_log(+new Date - d, 'append_doms') // 与业务逻辑无关的代码
}
```

```js
// good
var log_time = function (func, funcName) {
	return func = function() {
		var d
		return func.before(function() {
			d = +new Date
		}).after(function() {
			user_log(+new Date - d, funcName) // 上报
		})
	}
}

var append_doms = function () {
	for (var i = 0; i < 1000; i++) {
		var div = document.createElement('div')
		document.body.appendChild(div)
	}
}

append_doms = log_time(append_doms, 'append_doms')

append_doms()
```

### 分离表单请求和校验
我们在提交表单之前经常会做一些**校验**工作，来确定表单是不是应该正常提交，最糟糕的写法是把验证的逻辑都放在 `send` 函数里面，我们需要做的是分离它们：

```js
// bad
var send = function () {
	var value = input.value
	if (value.length === '') { // 不能为空
		return false
	} else if(value.length >= 30) { // 不能超过 30 个字符
		return false
	} else {
		form.submit()
	}
}
```

下面是优化过的内容，我们把 `validata` 的内容给抽离了出来，但是在 `send` 方法中还是把「验证」和「发送」两件事情给耦合在了一起：
```js
// good
var validata_rules = {
	not_empty: function (value) {
		return value !== ''
	},
	max_length: function (value) {
		return value.length > 30
	}
}

var validata = function() {
	for (var i in validata_rules) {
		if (validata_rules[i].apply(this, arguments) === false) {
			return false
		}
	}
}

var send = function(value) {
	if (validata(value) === false) {
		return false
	}
	form.submit()
}
```

更好的做法当然是 `send` 只做自己的事情，它只需要负责「发送」而不应该去管「验证」的事情，我们你用 AOP 来把它们给分离开来，只需要修改 `send` 方法：
```js
// much better
/* same code */
var send = function(value) {
	form.send()
}
send = send.before(validata)
```

### 职责链模式
职责链模式在 js 中典型的应用场景是事件冒泡。
将所有子节点和父节点连成一条链，并沿着这条链传递事件，直到有一个节点能够处理它为止。
职责链模式的目的就是消除过多的 `if else` 语句。

```js
// bad
if (support_plugin) {
	upload_obj = plugin
} else if(support_html5) {
	upload_obj = html5
} else if(support_flash) {
	upload_obj = flash
} else {
	upload_obj = form
}
```

```js
// good
/* 首先我们需要改写下 after */
Function.prototype.after = function(afterfn) {
	var __self = this;
	return function() {
	  var ret = __self.apply(this, arguments);
	  if (ret) { // 如果存在对象的话则阻断调用链
		return ret;
	  }
	  afterfn.apply(this, arguments);
	  return ret;
	}
};

/* 编写每种控件的创建方式 */
var get_plugin = function() {
	try {
	  return new ActiveXObject('TXFTNActiveX.FTNUpload')
	} catch() {
	  return null
	}
}
var get_html5 = function() {
	// ...
}
var get_flash = function() {
	// ...
}
var get_form = function() {
	// ...
}

/* 最后用职责链把它们串起来 */
var upload_obj = get_plugin.after(get_html5).after(get_flash).after(get_form) // 方便维护，想去掉哪种方式就去掉哪种
```

## 参考资料
> [JavaScript高阶函数的应用 - 个人文章 - SegmentFault 思否](https://segmentfault.com/a/1190000012008266#articleHeader8)
> 
> [用AOP改善javascript代码 | AlloyTeam](http://www.alloyteam.com/2013/08/yong-aop-gai-shan-javascript-dai-ma/)
> 
> [聊Javascript中的AOP编程 – 前端技术漫游指南](http://qingbob.com/aop-programming/)