# Set 与 Map

## Set

> Set 类似于数组，但是成员的值都是唯一的，没有「重复的值」，且 key 和 value 相同，因为 Set 结构没有键名。

### Set 实例的属性和方法

* `size`：获取元素数量。
* `add(value)`：添加元素，返回 Set 实例本身。
* `delete(value)`：删除元素，返回一个布尔值，表示删除是否成功。
* `has(value)`：返回一个布尔值，表示该值是否是 Set 实例的元素。
* `clear()`：清除所有元素，没有返回值。

### 用于遍历的方法

* `keys()`：返回键名的遍历器。
* `values()`：返回键值的遍历器。不过由于 Set 结构没有键名，只有键值（或者说键名和键值是同一个值），所以 `keys()` 和 `values()` 返回结果一致。
* `entries()`：返回键值对的遍历器。
* `forEach()`：使用回调函数遍历每个成员

```js
let set = new Set(['aaa', 'bbb', 'ccc']);

for (let item of set.keys()) {
  console.log(item);
}
// aaa
// bbb
// ccc

for (let item of set.values()) {
  console.log(item);
}
// aaa
// bbb
// ccc

for (let item of set.entries()) {
  console.log(item);
}
// ["aaa", "aaa"]
// ["bbb", "bbb"]
// ["ccc", "ccc"]

set.forEach((value, key) => console.log(key + ' : ' + value))
// aaa : aaa
// bbb : bbb
// ccc : ccc
```

### Set 使用经验

- Set 和数组的相互转换

  ```js
  var arr = [1, 2, 3]
  var a = new Set(arr)		// 数组转 set
  var b = Array.from(a)		// set 转数组
  // 或者
  var b = [...a]
  ```
- Set 结构的实例默认可遍历，它的默认遍历器生成函数就是它的 values 方法。

  ```js
  Set.prototype[Symbol.iterator] === Set.prototype.values // true
  ```

  也就是说，我们也使用的时候可以省略 `values` 方法，直接用 `for...of` 循环遍历 Set：

  ```js
  let set = new Set(['red', 'green', 'blue'])

  for (let x of set) {
    console.log(x)
  }
  // red
  // green
  // blue
  ```

  因为 `for...of` 调用的数据结构的 terator 接。也就是说，`for...of` 循环内部调用的是数据结构的 `Symbol.iterator` 方法，所以可以直接省略 `values()`。

## Map

> Map 类似于对象，但普通对象的 key 必须是字符串或者数字，而 Map 的 key 可以是任何数据类型。

### Map 实例的属性和方法

* `size`：获取成员的数量
* `set(key, value)`：设置成员 key 和 value
* `get(key)`：获取成员属性值
* `has(key)`：判断成员是否存在
* `delete(key)`：删除成员
* `clear()`：清空所有

### Map 实例的遍历方法

* `keys()`：返回键名的遍历器。
* `values()`：返回键值的遍历器。
* `entries()`：返回所有成员的遍历器。
* `forEach()`：遍历 Map 的所有成员。

```js
const map = new Map();
map.set('aaa', 100);
map.set('bbb', 200);

for (let key of map.keys()) {
  console.log(key);
}
// "aaa"
// "bbb"

for (let value of map.values()) {
  console.log(value);
}
// 100
// 200

for (let item of map.entries()) {
  console.log(item[0], item[1]);
}
// aaa 100
// bbb 200

// 或者
for (let [key, value] of map.entries()) {
  console.log(key, value);
}
// aaa 100
// bbb 200
```

## 参考资料

> [LearnJS/Set和Map数据结构.md · LBinin/LearnJS · GitHub](https://github.com/LBinin/LearnJS/blob/master/ES6/Set%E5%92%8CMap%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84.md)