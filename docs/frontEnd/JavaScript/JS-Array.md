# Js 数组

## Array 构造函数

`Array` 是 JavaScript 的**内置对象**，同时也是一个**构造函数**，可以用它生成新的数组。

```javascript
var arr = new Array(3)
arr.length // 3
arr // [ empty x 3 ]

/* 如果没有使用 new，运行结果也是一样的。 */
var arr = new Array(2)
// 等同于
var arr = Array(2)
```

`Array` 构造函数有一个很大的问题，就是不同的参数，会导致它的行为不一致。

```javascript
// 无参数时，返回一个空数组
new Array() // []

// 单个正整数参数，表示返回的新数组的长度
new Array(1) // [ empty ]
new Array(2) // [ empty x 2 ]

// 非正整数的数值作为参数，会报错
new Array(3.2) // RangeError: Invalid array length
new Array(-3) // RangeError: Invalid array length

// 单个非正整数参数（比如字符串、布尔值、对象等），
// 则该参数是返回的新数组的成员
new Array('abc') // ['abc']
new Array([1]) // [Array[1]]

// 多参数时，所有参数都是返回的新数组的成员
new Array(1, 2) // [1, 2]
new Array('a', 'b', 'c') // ['a', 'b', 'c']
new Array([1], [2]) // (2) [Array[1], Array[1]]
```

因此，不建议使用它生成新数组，**直接使用数组字面量是更好的做法**。

---

## Array.isArray()

> 判断一个值是否为数组。它可以弥补 `typeof` 运算符的不足。

```javascript
var a = [1, 2, 3]

typeof a // "object"
Array.isArray(a) // true
```

`typeof` 运算符只能显示数组的类型是 `Object`，而 `Array.isArray` 方法可以对数组返回 `true`。

---

## Array实例的方法

### 1. valueOf()，toString()

> `valueOf()` 方法返回数组本身。
> 
> `toString()` 方法返回数组的字符串形式。

```javascript
var a = [1, 2, 3]
a.valueOf() // [1, 2, 3]
a.toString() // "1,2,3"

var a = [1, 2, 3, [4, 5, 6]]
a.toString() // "1,2,3,4,5,6"
```

### 2. push()

> 在数组的**末端**添加**一个或多个**元素，并**返回添加新元素后的数组长度**。注意，该方法会改变原数组。

```javascript
var a = []

/* 先后往数组中添加四个成员 */
a.push(1) // 1
a.push('a') // 2
a.push(true, {}) // 4
a // [1, 'a', true, {}]
```

`push` 方法还可以用于向对象添加元素，添加后的对象变成类似数组的对象，即新加入元素的键对应数组的索引，并且对象有一个 `length` 属性。

```javascript
/* 分号得保留 */
var a = {a: 1};

[].push.call(a, {b: 2});
a; // {a: 1, 0: {b: 2}, length: 1}

[].push.call(a, [3]);
a; // {a: 1, 0: {b: 2}, 1: [3], length: 2}
```

### 3. pop()

> 删除数组的**最后一个元素**，并**返回该元素**。注意，该方法会改变原数组。

```javascript
var a = ['a', 'b', 'c']

a.pop() // 'c'
a // ['a', 'b']
```

对空数组使用 `pop()` 方法，不会报错，而是返回 `undefined`。

### 4. join()

> 以参数作为分隔符，将所有数组成员组成一个**字符串**返回。如果不提供参数，**默认用逗号分隔**。

如果数组成员是 `undefined` 或 `null` 或 **空位**，会被转成**空字符串**。

```javascript
var a = [1, 2, 3, 4]

a.join(' ') // '1 2 3 4'
a.join(' | ') // "1 | 2 | 3 | 4"
a.join() // "1,2,3,4"

[undefined, null].join('#')
// '#'

['a',, 'b'].join('-')
// 'a--b'
```

### 5. concat()

> 用于多个数组的合并。接收**一个或多个**参数，它将新数组的**成员**，添加到**原数组成员的后部**，然后返回一个浅拷贝的新数组，原数组不变。

```javascript
['hello'].concat(['world'])
// ["hello", "world"]

['hello'].concat(['world'], ['!'])
// ["hello", "world", "!"]
```

除了接受数组作为参数，`concat()` 方法也可以接受其他类型的值作为参数。它们会作为新的元素，添加数组尾部。

```javascript
[1, 2, 3].concat(4, 5, 6)
// [1, 2, 3, 4, 5, 6]

// 等同于
[1, 2, 3].concat(4, [5, 6])
[1, 2, 3].concat([4], [5, 6])
```

如果不提供参数，`concat()` 方法返回当前数组内容的一个浅拷贝，但是返回的数组不是浅拷贝。所谓「数组内容的浅拷贝」指的是：如果数组成员包括复合类型的值（比如对象），则新数组拷贝的是该值的引用。

```javascript
var obj = { a:1 }
var oldArray = [obj]

var newArray = oldArray.concat()

obj.a = 2
newArray[0].a // 2
newArray[0].a === obj.a // true
newArray === oldArray // false
```

事实上，只要原数组的成员中包含对象，`concat` 方法不管有没有参数，总是返回该对象的引用。

`concat()` 方法也可以用于将对象合并为数组。

```javascript
[].concat({a: 1}, {b: 2})
// [{ a: 1 }, { b: 2 }]

[].concat({a: 1}, [2])
// [{a: 1}, 2]

[2].concat({a: 1})
// [2, {a: 1}]
```

### 6. shift()

> 用于删除数组的**第一个**元素，并返回该元素。注意，该方法会改变原数组。

```javascript
var a = ['a', 'b', 'c']

a.shift() // 'a'
a // ['b', 'c']
```

### 7. unshift()

> 在数组的**第一个**位置添加**一个或多个**元素，并返回添加新元素后的数组长度。注意，该方法会改变原数组。

```javascript
var a = ['a', 'b', 'c']

a.unshift('x') // 4
a // ['x', 'a', 'b', 'c']

/* 可在数组头部添加多个元素 */
var arr = [ 'c', 'd' ]
arr.unshift('a', 'b') // 4
arr // [ 'a', 'b', 'c', 'd' ]
```

### 8. reverse()

> 颠倒数组中元素的顺序，返回改变后的数组。注意，该方法将改变原数组。

```javascript
var a = ['a', 'b', 'c']

a.reverse() // ["c", "b", "a"]
a // ["c", "b", "a"]
```

### 9. slice()

> 提取原数组的一部分，返回一个新数组，原数组不变。

它的第一个参数为起始位置（从0开始），第二个参数为终止位置（但该位置的元素本身不包括在内，也就是**前闭后开**）。

```javascript
// 格式
arr.slice(start_index, upto_index)
```

参数：

- 没有参数的时候相当于数组的复制（ 数组内容为浅复制 ）

- 只有一个参数的时候，默认到数组尾部。

- 参数如果是负数，则表示倒数计算的位置。

- 如果参数值大于数组成员的个数，或者第二个参数小于第一个参数，则返回空数组。

```javascript
var a = ['a', 'b', 'c']

/* 无参数，相当于复制 */
a.slice() // ["a", "b", "c"]

/* 只有一个参数 */
a.slice(1) // ["b", "c"]

/* 正常两个参数 */
a.slice(1, 2) // ["b"]
/* 若第二个参数大于数组长度，则默认到数组尾部 */
a.slice(2, 6) // ["c"]

/* 参数为负数 */
a.slice(-2) // ["b", "c"]
a.slice(-2, -1) // ["b"]

/* 参数大于数组长度或第二个参数小于第一个 */
a.slice(4) // []
a.slice(2, 1) // []
```

`slice()` 方法的一个重要应用，是 [将「类数组对象」转为真正的数组](https://github.com/LBinin/LearnJS/blob/master/%E8%AF%AD%E6%B3%95/%E6%95%B0%E7%BB%84.md#%E5%B0%86%E7%B1%BB%E6%95%B0%E7%BB%84%E5%AF%B9%E8%B1%A1%E8%BD%AC%E4%B8%BA%E7%9C%9F%E6%AD%A3%E7%9A%84%E6%95%B0%E7%BB%84) 。

### 10. splice()

> 删除原数组的一部分成员，并可以在被删除的位置添加入新的数组成员，返回值是被删除的元素。注意，该方法会改变原数组。

`splice()` 的第一个参数是删除的起始位置，第二个参数是被删除的元素个数。

```javascript
// 格式
arr.splice(index, count_to_remove, addElement1, addElement2, ...)

```

需要注意的是，虽然和 `slice()` 方法长的很像，但是第二个参数不同，`slice` 第二个参数表示的结束位置，而 `splice` 第二个参数表示的是长度。

同样的，咱们分参数讨论：

- 如果无参数，函数将返回空数组
- 如果只提供第一个参数，等同于将原数组在指定位置拆分成两个数组。

```javascript
var a = [1, 2, 3, 4]

/* 无参数，返回空数组 */
a.slice() // []

/* 只有一个参数，分隔数组 */
a.splice(2) // [3, 4]
a // [1, 2]

/* 两个参数，第一个表示起始位置，第二个表示长度 */
a.splice(1, 2) // [2, 3]
/* 如果第一二两个参数之和大于数组长度，返回从起始位置到数组结束 */
a.splice(3, 2) // [4]
a.splice(4, 2) // []

/* 多个参数 */
var a = ['a', 'b', 'c', 'd', 'e', 'f']
a.splice(4, 2, 1, 2) // ["e", "f"]
a // ["a", "b", "c", "d", 1, 2]
```

如果只是单纯地**插入元素**，`splice()` 方法的第二个参数可以设为 0。

```javascript
var a = [1, 1, 1]

a.splice(1, 0, 2) // []
a // [1, 2, 1, 1]
```

### 11. sort()

> 对数组成员进行排序，默认是按照字典顺序排序。排序后，原数组将被改变，数组**从小到大**递增。

无参数的 `sort()` 方法不是按照大小排序，而是按照对应字符串的字典顺序排序。也就是说，数值会被先转成字符串，再按照字典顺序进行比较，所以 101 会排在 11 的前面。

```javascript
['d', 'c', 'b', 'a'].sort()
// ['a', 'b', 'c', 'd']

[4, 3, 2, 1].sort()
// [1, 2, 3, 4]

[11, 101].sort()
// [101, 11]

[10111, 1101, 111].sort()
// [10111, 1101, 111]
```

该函数可接收一个参数。可以传入一个函数作为参数，表示按照自定义方法进行排序。该函数本身又接受两个参数，表示进行比较的两个元素。**如果返回值大于 0，表示第一个元素排在第二个元素后面**；其他情况下，都是第一个元素排在第二个元素前面。

```javascript
[10111, 1101, 111].sort(function (a, b) {
  return a - b
})
// [111, 1101, 10111]

[
  { name: "张三", age: 30 },
  { name: "李四", age: 24 },
  { name: "王五", age: 28  }
].sort(function (o1, o2) {
  return o1.age - o2.age;
})
// [
//   { name: "李四", age: 24 },
//   { name: "王五", age: 28  },
//   { name: "张三", age: 30 }
// ]
```

### 12. map()

> 对数组的所有成员依次调用一个函数，根据函数结果返回一个新数组，不改变原数组。

`map()` 方法接受一个函数作为参数。该函数调用时，`map()` 方法会将其传入三个参数，分别是**当前成员**、**当前位置**和**数组本身**，如果有不需要的参数可以忽略。

```javascript
var numbers = [1, 2, 3]

numbers.map(function (n) {
  return n + 1
})
// [2, 3, 4]

numbers // [1, 2, 3]


/* 三个参数 */
[1, 2, 3].map(function(elem, index, arr) {
  return elem * index;
})
// [0, 2, 6]
```

`map()` 方法还可以接受第二个参数，表示回调函数执行时 `this` 所指向的对象。

```javascript
var arr = ['a', 'b', 'c']

[1, 2].map(function(e){
  return this[e]
}, arr)
```

如果数组有空位，`map()` 方法的回调函数在这个位置不会执行，会跳过数组的空位，在新数组对应位置上仍然是空。但不会跳过 `undefined` 和 `null`。

```javascript
var f = function(n){ return n + 1 }

[1, undefined, 2].map(f) // [2, NaN, 3]
[1, null, 2].map(f) // [2, 1, 3]
[1, , 2].map(f) // [2, empty, 3]


/* 以下 map 方法没有执行 */
Array(2).map(function (){
  console.log('enter...')
  return 1
})
// [empty × 2]
```

### 13. forEach()

`forEach()` 方法与 `map()` 方法很相似，也是遍历数组的所有成员，执行某种操作。

但是 `forEach()` 方法一般不返回值，只用来操作数据。如果需要有返回值，一般使用 `map()` 方法。

`forEach()` 方法的参数与 `map()` 方法是完全一致的，包括第二个参数，用来绑定回调函数的this关键字。第一个参数也是一个函数，数组的所有成员会依次执行该函数。它接受三个参数，分别是当前位置的值、当前位置的编号和整个数组。

注意，`forEach()` 方法无法中断执行，总是会将所有成员遍历完。如果希望符合某种条件时，就中断遍历，要使用 `for` 循环。

`forEach()` 方法也会跳过数组的空位。

### 14. filter()

> filter 方法的参数是一个函数，所有数组成员依次执行该函数，返回结果为 true 的成员组成一个新数组返回。该方法不会改变原数组。

```javascript
[1, 2, 3, 4, 5].filter(function (elem) {
  return (elem > 3)
})
// [4, 5]

var arr = [0, 1, 'a', false]
arr.filter(Boolean) // [1, "a"]
```

`filter()` 方法的参数函数可以接受三个参数，第一个参数是当前数组成员的值，这是必需的，后两个参数是可选的，分别是当前数组成员的位置和整个数组。

此外，还可以接受第二个参数，指定测试函数所在的上下文对象（ 即 **this** 对象 ）。

### 15. some()，every()

这两个方法类似「断言」（assert），用来判断数组成员是否符合某种条件。

它们接受一个函数作为参数，所有数组成员依次执行该函数，返回一个**布尔值**。该函数接受三个参数，依次是当前位置的成员、当前位置的序号和整个数组。

`some()` 和 `every()` 方法还可以接受第二个参数，用来绑定函数中的 `this` 关键字。

`some()` 方法是只要有一个数组成员的返回值是 `true`，则整个 `some()` 方法的返回值就是 `true`，否则 `false`。

`every()` 方法则是所有数组成员的返回值都是 `true`，才返回 `true`，否则 `false`。

```javascript
var arr = [1, 2, 3, 4, 5]

arr.some(function (elem, index, arr) {
  return elem >= 3;
})
// true

arr.every(function (elem, index, arr) {
  return elem >= 3;
})
// false
```

注意，对于空数组，`some()` 方法返回 `false`，`every()` 方法返回 `true`，但回调函数都不会执行。

```javascript
function isEven(x) { return x % 2 === 0 }

[].some(isEven) // false
[].every(isEven) // true
```

### 16. reduce()，reduceRight()

`reduce()` 方法和 `reduceRight()` 方法依次处理数组的每个成员，最终累计为一个值。

它们的差别是，`reduce()` 是从左到右处理（从第一个成员到最后一个成员），`reduceRight()` 则是从右到左（从最后一个成员到第一个成员），其他完全一样。

这两个方法的第一个参数都是一个函数。该函数接受以下四个参数（前两个是必须的，后两个则是可选的）：

- 累积变量，默认为数组的第一个成员
- 当前变量，默认为数组的第二个成员
- 当前位置（ 从 0 开始 ）
- 原数组

第二个参数，用来对累积变量指定初值。

```javascript
[1, 2, 3, 4, 5].reduce(function(x, y){
  console.log(x, y)
  return x + y
})
// 1 2
// 3 3
// 6 4
// 10 5
//最后结果：15


/* 可以添加到 Array 原型中 */
Array.prototype.sum = function (){
  return this.reduce(function (partial, value) {
    return partial + value
  })
};

[3, 4, 5, 6, 10].sum() // 28
```

第一轮开始执行时，`x` 是数组的第一个成员，`y` 是数组的第二个成员。从第二轮开始，`x` 为上一轮的**返回值**，`y` 为当前数组成员，直到遍历完所有成员，返回最后一轮计算后的 `x`。

第二个变量，即给 `x` 一个初值，这时 `y` 便是从数组的第一个成员开始遍历：

```javascript
[1, 2, 3, 4, 5].reduce(function(x, y){
	console.log('x = ' + x + ', y = ' + y)
  return x + y
}, 10)
// x = 10, y = 1
// x = 11, y = 2
// x = 13, y = 3
// x = 16, y = 4
// x = 20, y = 5
// 最后结果：25
```

下面咱们看看 `reduceRight()` 方法和 `reduce()` 的区别：

```javascript
function substract(prev, cur) {
  return prev - cur
}

[3, 2, 1].reduce(substract) // 0: 3 - 2 - 1 = 0
[3, 2, 1].reduceRight(substract) // -4: 1 - 2 - 3 = -4
```

### 17. indexOf()，lastIndexOf()

`indexOf()` 方法返回给定元素在数组中**第一次**出现的位置，如果没有出现则返回 -1。

`lastIndexOf()` 方法返回给定元素在数组中**最后一次**出现的位置，如果没有出现则返回-1。

```javascript
var a = ['a', 'b', 'c', 'b']
a.indexOf('b') // 1
a.indexOf('y') // -1

var a = [2, 5, 9, 2]
a.lastIndexOf(2) // 3
a.lastIndexOf(7) // -1
```

注意，如果要判断数组中是否包含 `NaN`，这两个方法不适用，因为这两个方法内部，使用严格相等运算符（===）进行比较，而 `NaN` 是唯一一个不等于自身的值，所以无法确定数组成员是否包含 `NaN`。

```javascript
[NaN].indexOf(NaN) // -1
[NaN].lastIndexOf(NaN) // -1
```

---

## 小笔记

| 实例方法      | 改变原来数组 | 生成新数组 | 返回值           | 备注                 |
| :------------ | :----------: | :--------: | :--------------: | :------------------: |
| filter()      | ×            | √          | 操作后的新数组   |
| slice()       | ×            | √          | 原数组的一部分   | 如果无参，可作复制用 |
| map()         | ×            | √          | 操作后的新数组   |
| forEach()     | ×            | √          | 无               |
| concat()      | ×            | √          | 连接后的新数组   | 数组内容为浅拷贝     |
| push()        | √            | ×          | 操作后的数组长度 |
| pop()         | √            | ×          | 被删除的元素     |
| shift()       | √            | ×          | 被删除的元素     |
| unshift()     | √            | ×          | 操作后的数组长度 |
| reverse()     | √            | ×          | 改变后的原数组   |
| splice()      | √            | ×          | 被删除的元素     | 可用作在数组中间插值 |
| sort()        | √            | ×          | 排序后的原数组   |
| join()        | ×            | ×          | 字符串           |
| some()        | ×            | ×          | 布尔值           |
| every()       | ×            | ×          | 布尔值           |
| reduce()      | ×            | ×          | 累积值           |
| reduceRight() | ×            | ×          | 累积值           |
| indexOf()     | ×            | ×          | 数值             |
| lastIndexOf() | ×            | ×          | 数值             |