# TS 进阶

## 类型别名

> 字面意思，就是给某个类型起一个新的名字

TypeScript 中，我们使用 `type` 关键字创建一个类型别名：

```ts
type Name = string
type NameResolver = () => string
type NameOrResolver = Name | NameResolver
function getName(n: NameOrResolver): Name {
    if (typeof n === 'string') {
        return n
    } else {
        return n()
    }
}
```

类型别名常用于联合类型。

## 字符串字面量类型

> 字符串字面量类型用来约束**取值只能是某几个字符串中的一个**。

```ts
type EventNames = 'click' | 'scroll' | 'mousemove'
function handleEvent(ele: Element, event: EventNames) {
    // do something
}

handleEvent(document.getElementById('hello'), 'scroll')  // 没问题
handleEvent(document.getElementById('world'), 'dbclick') // 报错，event 不能为 'dbclick'

// index.ts(7,47): error TS2345: Argument of type '"dbclick"' is not assignable to parameter of type 'EventNames'.
```

❗️注意，**类型别名与字符串字面量类型都是使用 `type` 进行定义。**

## 元组

> 数组合并了相同类型的对象，而元组（Tuple）合并了不同类型的对象。

```ts
// Declare a tuple type
let x: [string, number]

// 初始化的时候，需要对`所有元素`赋上对应类型的值
x = ['hello', 10] // OK

// 错误的初始化
x = [10, 'hello'] // 初始化报错
x = [20] // 初始化报错

// 只赋值其中的一项
x[0] = 20
```

### 元祖越界

如果向元祖中添加多余的元素（越界），那么多余的值得类型，将会被限制为**元祖中每个类型的联合类型**。

```ts
let tuple: [string, number]
tuple = ['Xcat Liu', 25]
tuple.push('http://tuple.com/') // 正确
tuple.push(true) // 报错，因为 boolean 类型不能赋值给 `string | number` 类型

// index.ts(4,14): error TS2345: Argument of type 'boolean' is not assignable to parameter of type 'string | number'.
//   Type 'boolean' is not assignable to type 'number'.
```

## 枚举

```ts
enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat}
```

枚举成员会被赋值为从 `0` 开始递增的数字，同时也会对**枚举值到枚举名**进行反向映射；也就是说上面的 `Days` 内容为：

```js
var Days = {
  // 枚举成员会被赋值为：从 0 开始递增的数字（也就是枚举值）
  'Sun': 0,
  'Mon': 1,
  'Tue': 2,
  'Wed': 3,
  'Thu': 4,
  'Fri': 5,
  'Sat': 6,
  // 枚举值到枚举名的映射
  0: 'Sun',
  1: 'Mon',
  2: 'Tue',
  3: 'Wed',
  4: 'Thu',
  5: 'Fri',
  6: 'Sat',
}
```

所以下面的内容就能够理解了：

```ts
enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat}

console.log(Days["Sun"] === 0) // true
console.log(Days["Mon"] === 1) // true
console.log(Days["Tue"] === 2) // true
console.log(Days["Sat"] === 6) // true

console.log(Days[0] === "Sun") // true
console.log(Days[1] === "Mon") // true
console.log(Days[2] === "Tue") // true
console.log(Days[6] === "Sat") // true
```

上面的内容将被 TypeScript 转义为：

```js
var Days;
(function (Days) {
    Days[Days["Sun"] = 0] = "Sun";
    Days[Days["Mon"] = 1] = "Mon";
    Days[Days["Tue"] = 2] = "Tue";
    Days[Days["Wed"] = 3] = "Wed";
    Days[Days["Thu"] = 4] = "Thu";
    Days[Days["Fri"] = 5] = "Fri";
    Days[Days["Sat"] = 6] = "Sat";
})(Days || (Days = {}));
```

### 手动给枚举项赋值

每个枚举项默认是按从 `0` 开始的递增数列赋值，当然，我们也可以给**枚举项**手动赋值，未手动赋值的枚举项会**接着上一个枚举项递增**：

```ts
enum Days {Sun = 3, Mon = 1, Tue, Wed, Thu, Fri, Sat};

console.log(Days["Sun"] === 3); // true
console.log(Days["Wed"] === 3); // true
console.log(Days[3] === "Sun"); // false
console.log(Days[3] === "Wed"); // true
```

如果未手动赋值的枚举项与手动赋值的重复了，TypeScript 是不会知道的。

上面的代码会被 TypeScript 转义成：

```js
var Days;
(function (Days) {
    Days[Days["Sun"] = 3] = "Sun";
    Days[Days["Mon"] = 1] = "Mon";
    Days[Days["Tue"] = 2] = "Tue";
    Days[Days["Wed"] = 3] = "Wed";
    Days[Days["Thu"] = 4] = "Thu";
    Days[Days["Fri"] = 5] = "Fri";
    Days[Days["Sat"] = 6] = "Sat";
})(Days || (Days = {}));
```

如果给枚举项赋的负数值或者小数值，此时后续未手动赋值的项的**递增步长**仍为 `1`：

```ts
enum Days {Sun = 7, Mon = 1.5, Tue, Wed, Thu, Fri, Sat};

console.log(Days["Sun"] === 7); // true
console.log(Days["Mon"] === 1.5); // true
console.log(Days["Tue"] === 2.5); // true
console.log(Days["Sat"] === 6.5); // true
```

也可以给枚举项赋 `number` 以外类型的值，但是需要使用「类型断言」让 TypeScript 无视类型检查：

```ts
enum Days {Sun = 7, Mon, Tue, Wed, Thu, Fri, Sat = <any>"S"};

var Days;
(function (Days) {
    Days[Days["Sun"] = 7] = "Sun";
    Days[Days["Mon"] = 8] = "Mon";
    Days[Days["Tue"] = 9] = "Tue";
    Days[Days["Wed"] = 10] = "Wed";
    Days[Days["Thu"] = 11] = "Thu";
    Days[Days["Fri"] = 12] = "Fri";
    Days[Days["Sat"] = "S"] = "Sat";
})(Days || (Days = {}));
```



### Never

当函数必须存在无法达到的终点的时候使用：

```ts
// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
    throw new Error(message)
}

// 返回never的函数必须存在无法达到的终点
function infiniteLoop(): never {
    while (true) {
        /* code */
    }
}
```
