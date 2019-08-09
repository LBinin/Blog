# Js 高阶函数 HOF

> 高阶函数（Higher-order function）英文简称 HOF。

## 什么是「高阶函数」

简单来说，就是：接受函数式参数或者返回函数的函数称为「高阶函数」。

也就是说「高阶函数」是指至少满足下列条件之一的函数：

- 函数可以作为参数被传递
- 函数可以作为返回值输出

## 例子

### AJAX 异步请求
```js
// callback为待传入的回调函数
var getUserInfo = function(userId, callback) {
     $.ajax("http://xxx.com/getUserInfo?" + userId, function(data) {
        if (typeof callback === "function") {
            callback(data);
        }
    });
}

getUserInfo(13157, function(data) {
    alert (data.userName);
});
```

- Array.prototype.sort
```js
//从小到大排列
[1, 4, 3].sort(function(a, b) {
    return a - b;
}); // 输出: [1, 3, 4]

//从大到小排列
[1, 4, 3].sort(function(a, b) {
    return b - a;
}); // 输出: [4, 3, 1]
```

### 判断数据的类型
```js
var Type = {};
for (var i = 0, type; type = ['String', 'Array', 'Number'][i++];) {
	(function(type) {
	  Type['is' + type] = function(obj) {
		return Object.prototype.toString.call(obj) === '[object '+ type +']';
	  }
	})(type)
};
Type.isArray([]);     // 输出：true
Type.isString("str"); // 输出：true
```

- 单例模式
```js
var getSingle = function(fn) {
    var ret;
    return function() {
        return ret || (ret = fn.apply(this, arguments));
    };
};
```

### AOP 面向切面编程

[Js 面向切面编程 AOP](./JS-AOP.md)

### 柯里化 Curry

[柯里化 Curry](./Curry.md)

### 函数节流



## 参考资料
> [JavaScript高阶函数的应用 - 个人文章 - SegmentFault 思否](https://segmentfault.com/a/1190000012008266)
> 
> [javascript 高阶函数介绍 - 前端 - 掘金](https://juejin.im/entry/5815876c8ac247004fb6d132)