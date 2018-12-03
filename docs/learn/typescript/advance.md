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

## 类

ES6 中对类的定义这里也不再赘述了。

需要注意的是，ES7 中有一些关于类的提案，TypeScript 中实现了他们，在这里做一个归档。

### 实例属性

众所周知，ES6 中实例的属性只能通过 `this.xxx = xxx` 来定义，在 ES7 的提案中可以直接在类里面定义：

```ts
class Animal {
    name = 'Jack';

    constructor() {
        // ...
    }
}

let a = new Animal();
console.log(a.name); // Jack
```

### 静态属性

在 ES7 的提案中可以定义一个「静态属性」：

```ts
class Animal {
    static num = 42;

    constructor() {
        // ...
    }
}

console.log(Animal.num); // 42
```

### 修饰符

TypeScript 可以使用三种访问修饰符（Access Modifiers），分别是 `public`、`private` 和 `protected`。

- `public` 修饰的属性或方法是公有的，可以在任何地方被访问到，默认所有的属性和方法都是 `public` 的
- `private` 修饰的属性或方法是私有的，不能在声明它的类的外部访问
- `protected` 修饰的属性或方法是受保护的，它和 `private` 类似，区别是它在子类中也是允许被访问的

需要注意的是，TypeScript 编译之后的代码中，并没有限制 `private` 属性在外部的可访问性。

### 抽象类

需要注意的是，即使是抽象方法，TypeScript 的编译结果中，仍然会存在这个抽象类。

1. 抽象类是不允许被实例化的：

    ```ts
    abstract class Animal {
        public name;
        public constructor(name) {
            this.name = name;
        }
        public abstract sayHi();
    }

    let a = new Animal('Jack'); // 这里实例化了一个抽象类，报错

    // index.ts(9,11): error TS2511: Cannot create an instance of the abstract class 'Animal'.
    ```

2. 抽象类中的抽象方法必须被子类实现：

    ```ts
    abstract class Animal {
        public name;
        public constructor(name) {
            this.name = name;
        }
        public abstract sayHi();
    }

    class Cat extends Animal {
        public eat() {
            console.log(`${this.name} is eating.`);
        }
        // 这里没有实现父类的抽象方法
    }

    let cat = new Cat('Tom');

    // index.ts(9,7): error TS2515: Non-abstract class 'Cat' does not implement inherited abstract member 'sayHi' from class 'Animal'.
    ```

### 类实现接口

一般来讲，一个类只能继承自另一个类，有时候不同类之间可以有一些共有的特性，这时候就可以把特性提取成「接口」（interfaces），用 `implements` 关键字来实现。这个特性大大提高了面向对象的灵活性。

```ts
// 定义一个报警的接口
interface Alarm {
    alert();
}

// 定义一个灯的接口
interface Light {
    lightOn();
    lightOff();
}

class Door {
}

class SecurityDoor extends Door implements Alarm {
    alert() {
        console.log('SecurityDoor alert');
    }
}

// 一个类可以实现多个接口
class Car implements Alarm, Light {
    alert() {
        console.log('Car alert');
    }
    lightOn() {
        console.log('Car light on');
    }
    lightOff() {
        console.log('Car light off');
    }
}
```

### 接口继承接口

接口和接口之间也是可以继承的：

```ts
class Point {
    x: number;
    y: number;
}

interface Point3d extends Point {
    z: number;
}

let point3d: Point3d = {x: 1, y: 2, z: 3};
```

## 泛型

> 泛型（Generics）是指在定义函数、接口或类的时候，不预先指定**具体的类型**，而在使用的时候再指定类型的一种特性。

举个例子，我们想实现一个函数 `createArray`，它可以创建一个指定长度的数组，同时将每一项都填充一个默认值：

```ts
function createArray(length: number, value: any): Array<any> {
    let result = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray(3, 'x'); // ['x', 'x', 'x']
```

虽然功能实现了，但是我们使用了 `any` 关键字来定义的类型，和我们最开始的想法 ——「数组中每一项都应该是输入的 `value` 的类型」有些出入。

这时候，「泛型」闪亮登场 ✨

```ts
function createArray<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray<string>(3, 'x'); // ['x', 'x', 'x']
```

我们可以看到，如果需要定义一个泛型，我们需要：

**在函数名后面加上 `<T>`**（与其说是函数名后，不如说是**参数括号前**，方便后面 [泛型接口](#泛型接口)理解），其中 `T` 表示之后的**任意**的类型。比如 `value: T` 可以指定传参的类型；`Array<T>` 表示返回值的数组的类型。

这样，在调用的时候，TypeScript 会通过 [基础 · 类型推论](./base.html#类型推论) 自动推算出来。

### 多个泛型参数

定义泛型的时候，可以一次定义多个类型参数。

比如：定义一个 `swap` 函数，用来交换输入的元组。

```ts
function swap<T, U>(tuple: [T, U]): [U, T] {
    return [tuple[1], tuple[0]];
}

swap([7, 'seven']); // ['seven', 7]
```

### 泛型约束

定义了一个泛型之后，由于函数内部不知道参数的类型，我们无法随意操作它的属性和方法：

```ts
function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);
    return arg;
}

// index.ts(2,19): error TS2339: Property 'length' does not exist on type 'T'.
```

这时候，我们需要做一个约束 ——「只允许那些拥有 `length` 属性的变量传进函数」。这个约束就叫做**泛型约束**。

那么怎么约定一个「泛型约束」呢？

之前我们都是用「接口」来规定一个东西的形状，当然，我们也能定义泛型的内容：

```ts
interface Lengthwise {
    length: number;
}

// 我们使用 extends 关键字进行泛型约束
function loggingIdentity<T extends Lengthwise>(arg: T): T {
    // 这时候传入的参数必须包含 length 属性
    // 如果传入的 arg 不包含 length，那么在编译阶段就会报错了
    console.log(arg.length);
    return arg;
}
```

### 参数相互约束

多个类型参数之间也可以互相约束（使用 `extends` 关键字）：

我们写一个函数，需要将 `source` 上的属性赋到 `target` 上，但是 `source` 上可能会出现奇怪的、`target` 不需要的属性，这时候，我们就可以使用泛型参数之间的相互约束，来约束 `source` 不会出现 `target` 不需要的属性。（换句话说，就是 `source` 上的属性，`target` 全都要有，`source` 是 `target` 的子集）

```ts
function copyFields<T extends U, U>(target: T, source: U): T {
    for (let id in source) {
        target[id] = (<T>source)[id];
    }
    return target;
}

let x = { a: 1, b: 2, c: 3, d: 4 };

copyFields(x, { b: 10, d: 20 });
```

上面代码中，使用了两个类型参数，其中要求 `T` 继承 `U`，这样就保证了 `source: U` 上不会出现 `target: T` 中不存在的字段。

### 泛型接口

我们之前说过，可以用接口来定义一个函数的形状 [用接口定义函数的类型](./base.html#用接口定义函数的类型)，当然也可以用包含泛型的接口来定义函数的形状：

```ts
interface CreateArrayFunc {
    <T>(length: number, value: T): Array<T>;
}

let createArray: CreateArrayFunc;
createArray = function<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray(3, 'x'); // ['x', 'x', 'x']
```

或者，把泛型参数提前到接口名上：

```ts
// 在接口名后跟上 `<T>`
interface CreateArrayFunc<T> {
    (length: number, value: T): Array<T>;
}

// 使用的时候需要声明泛型的类型
let createArray: CreateArrayFunc<any>;
createArray = function<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray(3, 'x'); // ['x', 'x', 'x']
```

### 泛型类

与泛型接口类似，泛型也可以用于类的类型定义中：

```ts
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
```

### 泛型参数的默认类型

在 TypeScript 2.3 以后，我们可以为泛型中的类型参数指定**默认类型**。

> 当使用泛型时**没有在代码中直接指定类型参数**，从**实际值参数中也无法推测出**时，这个默认类型就会起作用。

```ts
function createArray<T = string>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}
```

## 声明合并

> 如果定义了两个相同名字的函数、接口或类，那么它们会合并成一个类型

### 函数的合并

见 [函数的重载](./base.html#函数重载)

### 接口的合并

```ts
interface Alarm {
    price: number;
}
interface Alarm {
    weight: number;
}
// 相当于
interface Alarm {
    price: number;
    weight: number;
}

// 不报错
interface Alarm {
    price: number;
}
interface Alarm {
    price: number;  // 虽然重复了，但是类型都是 `number`，所以不会报错
    weight: number;
}

// 类型不一致，报错
interface Alarm {
    price: number;
}
interface Alarm {
    price: string;  // 类型不一致，会报错
    weight: number;
}

// 接口中方法的合并，和函数的合并一样（重载）
interface Alarm {
    price: number;
    alert(s: string): string;
}
interface Alarm {
    weight: number;
    alert(s: string, n: number): string;
}
// 相当于
interface Alarm {
    price: number;
    weight: number;
    alert(s: string): string;
    alert(s: string, n: number): string;
}
```

### 类的合并

与[接口的合并](#接口的合并)规则一致。