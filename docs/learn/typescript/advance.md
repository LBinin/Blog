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

### 常数项和计算所得项

枚举项有两种类型：**常数项**（constant member）和**计算所得项**（computed member）。

- 计算所得项：顾名思义，根据计算得出的值赋给枚举项。如：

    ```ts
    enum Color {Red, Green, Blue = "blue".length}
    ```

- 常数项：之前的例子都是常数项，即不需要通过计算得出的值，直接赋给枚举项的值。

<details>

<summary><strong>当满足以下条件时，枚举成员被当作是常数</strong></summary>

- 不具有初始化函数并且之前的枚举成员是常数。在这种情况下，当前枚举成员的值为上一个枚举成员的值加 1。但第一个枚举元素是个例外。如果它没有初始化方法，那么它的初始值为 0。

- 枚举成员使用常数枚举表达式初始化。常数枚举表达式是 TypeScript 表达式的子集，它可以在编译阶段求值。当一个表达式满足下面条件之一时，它就是一个常数枚举表达式：
数字字面量
    - 引用之前定义的常数枚举成员（可以是在不同的枚举类型中定义的）如果这个成员是在同一个枚举类型中定义的，可以使用非限定名来引用
    - 带括号的常数枚举表达式
    - +, -, ~ 一元运算符应用于常数枚举表达式
    - +, -, *, /, %, <<, >>, >>>, &, |, ^ 二元运算符，常数枚举表达式做为其一个操作对象。若常数枚举表达式求值后为NaN或Infinity，则会在编译阶段报错

</details>

### 常数枚举

「常数枚举」是使用 `const` 关键字定义的枚举类型。

与普通枚举类型的区别就是：**它会在编译阶段被删除**，并且不能包含计算成员。

```ts
const enum Directions {
    Up,
    Down,
    Left,
    Right
}

let directions = [Directions.Up, Directions.Down, Directions.Left, Directions.Right];

const enum Color {Red, Green, Blue = "blue".length} // 报错，不允许包含计算成员
```

编译结果：

```ts
var directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */]
```

### 外部枚举

「外部枚举」（Ambient Enums）是使用 `declare` 关键字定义的枚举类型。

外部枚举与声明语句一样，常出现在声明文件中。

同时使用 `declare` 和 `const` 关键字定义也是可以的。