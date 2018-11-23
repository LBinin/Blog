# TS 基础

## 原始数据类型

### 布尔值 `boolean`

```ts
let isDone: boolean = false
let createdByBoolean: boolean = Boolean(1)
```

❗️需要注意的是，使用 `Boolean` 创建的对象不是**布尔值**。

```ts
let createdByNewBoolean: Boolean = new Boolean(1)
```

在 TypeScript 中，`boolean` 是 JavaScript 中的基本类型，而 `Boolean` 是 JavaScript 中的构造函数。其他基本类型（除了 null 和 undefined）一样，下面不在受赘述。

### 数字 `number`

TypeScript 支持除了十进制和十六进制，还支持 ES5 引入的二进制和八进制字面量：

```ts
let decLiteral: number = 6
let hexLiteral: number = 0xf00d
// ES6 中的二进制表示法
let binaryLiteral: number = 0b1010
// ES6 中的八进制表示法
let octalLiteral: number = 0o744
let notANumber: number = NaN
let infinityNumber: number = Infinity
```

编译后：

```js
var decLiteral = 6
var hexLiteral = 0xf00d
// ES6 中的二进制表示法
var binaryLiteral = 10
// ES6 中的八进制表示法
var octalLiteral = 484
var notANumber = NaN
var infinityNumber = Infinity
```

可以看到 TypeScript 将它们转为十进制，因为其中 `0b1010` 和 `0o744` 是 **ES6** 中的二进制和八进制表示法。

### 字符串 `string`

```ts
let myName: string = 'Tom'
let myAge: number = 25

// 模板字符串
let sentence: string = `Hello, my name is ${myName}.
I'll be ${myAge + 1} years old next month.`
```

编译后：

```js
var myName = 'Tom'
var myAge = 25
// 模板字符串
var sentence = "Hello, my name is " + myName + ".\nI'll be " + (myAge + 1) + " years old next month."
```

### `void`

一般用于无返回值的函数返回值类型设置：

```ts
let unusable: void = undefined // 没卵用, 因为你只能将它赋值为 undefined 和 null
unusable = null

function warnUser(): void {
    alert("This is my warning message")
}
```

### `null` 和 `undefined`

与 `void` 的区别是，`undefined` 和 `null` 是所有类型的子类型。也就是说 `undefined` 类型的变量，可以赋值给 `number` 类型的变量：

```ts
// 这样不会报错
let num: number = undefined

// 这样也不会报错
let u: undefined
let num: number = u
```

## 任意值

### 为什莫要有任意值

如果是一个普通类型，在赋值过程中改变类型是不被允许的：

```ts
let myFavoriteNumber: string = 'seven'
myFavoriteNumber = 7

// index.ts(2,1): error TS2322: Type 'number' is not assignable to type 'string'.
```

但是，如果是 `any` 类型，则允许被赋值为任意类型。

### `any`

用来指定一个不确定的变量类型。

```ts
let notSure: any = 4
notSure = "maybe a string instead"
notSure = false // okay, definitely a boolean
```

在任意值上访问任何属性都是允许的：

```ts
let anyThing: any = 'hello'
console.log(anyThing.myName)
console.log(anyThing.myName.firstName)
```

也允许调用任何方法：

```ts
let anyThing: any = 'Tom'
anyThing.setName('Jerry')
anyThing.setName('Jerry').sayHello()
anyThing.myName.setFirstName('Cat')
```

变量如果在声明的时候，未指定其类型，那么它也会被识别为任意值类型：

```ts
let something
something = 'seven'
something = 7

something.setName('Tom')

// 等价于
let something: any
something = 'seven'
something = 7

something.setName('Tom')
```

可以认为，声明一个变量为**任意值**之后，对它的任何操作，返回的内容的类型都是**任意值**。（就你爱咋咋地）

但是不能保证一定会有对应的属性和方法，尽量少用这种类型声明叭。

## 类型推论

> 如果在声明一个变量的时候，没有明确指定的类型，那么 TypeScript 会按照「类型推论」（Type Inference）的规则推断出一个类型。

### 什么是「类型推论」

以下代码虽然没有指定类型，但是会在编译的时候报错：

```ts
let myFavoriteNumber = 'seven'
myFavoriteNumber = 7

// index.ts(2,1): error TS2322: Type 'number' is not assignable to type 'string'.
```

可以看到 TypeScript 推断 `myFavoriteNumber` 为 `string` 类型；也就是等价于：

```ts
let myFavoriteNumber: string = 'seven'
myFavoriteNumber = 7

// index.ts(2,1): error TS2322: Type 'number' is not assignable to type 'string'.
```

这种在没有明确的指定类型的时候推测出一个类型，这就是类型推论。

❗️需要注意的是，如果在声明一个变量的时候，没有进行赋值操作，那么 TypeScript 将会把该变量推断为 `any` 类型，从而不会被类型检查。

## 联合类型

> 「联合类型」（Union Types）表示变量的取值可以为**多种类型中的一种**。需要使用 `|` 分隔每个类型。

```ts
// 这里不会报错
let myFavoriteNumber: string | number // 允许 myFavoriteNumber 的类型是 string 或者 number，但是不能是其他类型。
myFavoriteNumber = 'seven'
myFavoriteNumber = 7
```

当 TypeScript 对一个联合类型的变量不能具体确定是哪个对象的时候，只允许用户访问联合类型中所有类型的「**共同**的属性或者方法」：

```ts
function getLength(something: string | number): number {
    return something.length
}

// index.ts(2,22): error TS2339: Property 'length' does not exist on type 'string | number'.
//   Property 'length' does not exist on type 'number'.
```

上面由于 `length` 在 `number` 类型上不存在该属性，所以报错。但是如果调用 `something.toString()` 就没有问题。

同样，在赋值的时候，TypeScript 也会根据类型推论的规则推断出一个类型。

也就是说在赋值后，TypeScript 就会根据「赋值」的类型确定**变量的类型**，下一次使用的时候，属性和方法也都是使用该类型：

```ts
let myFavoriteNumber: string | number
myFavoriteNumber = 'seven'
console.log(myFavoriteNumber.length) // 5
myFavoriteNumber = 7
console.log(myFavoriteNumber.length) // 编译时报错

// index.ts(5,30): error TS2339: Property 'length' does not exist on type 'number'.
```

## 接口

> 在 TypeScript 中，我们使用接口（Interfaces）来定义「**对象**」的类型。

**接口**（Interfaces）是一个很重要的概念，它是对行为的抽象，而具体如何行动需要由**类**（classes）去**实现**（implements）。

举个例子：

```ts
// 用 `interface` 关键字定义一个接口
interface Person {
    name: string;
    age: number;
}

// 赋值的时候，接口约束了变量的内容
let tom: Person = {
    name: 'Tom',
    age: 25
};
```

❗️**接口名一般首字母大写**

定义变量的时候，变量的内容**不能**比接口定义的属性**多或者少**，必须刚刚好。

### 可选属性

> 「可选属性」表示该属性可以不存在定义的变量上，这是针对变量定义时**少了接口中的属性**来说的

有时候我们希望只继承接口的**部分内容**，这时候我们就可以使用可选属性；在属性名后紧跟一个 `?` 定义一个可选属性。

```ts
interface Person {
    name: string;
    age?: number;
}

// 这样定义毛闷台
let tom: Person = {
    name: 'Tom'
}

// 这样定义也毛闷台
let tom: Person = {
    name: 'Tom'，
    age: 25
}
```

❗️这时候，定义的时候仍然不能添加**接口中未定义的属性**。

### 任意属性

上面说到「可选属性」是针对变量定义时**少了接口中的属性**来说的。

任意属性就是针对变量定义时**多出了接口中的属性**来说的。

如果我们想要接口**允许有任意的属性**，可以使用如下方式：

```ts
interface Person {
    name: string;
    age?: number;
    [propName: string]: any; // 定义任意属性取 `string` 类型的值
}

let tom: Person = {
    name: 'Tom',
    gender: 'male'
}
```

但是需要注意的是，一旦定义了**任意属性**，那么「可选属性」和「确定属性」（也就是上面的 `name`、`age` 属性）都必须是「任意属性」的**子属性**。

就比如说下面是不行的：

```ts
interface Person {
    name: string;
    age?: number;
    [propName: string]: string;
}

let tom: Person = {
    name: 'Tom',
    age: 25,
    gender: 'male'
}

// index.ts(3,5): error TS2411: Property 'age' of type 'number' is not assignable to string index type 'string'.
// index.ts(7,5): error TS2322: Type '{ [x: string]: string | number; name: string; age: number; gender: string; }' is not assignable to type 'Person'.
//   Index signatures are incompatible.
//     Type 'string | number' is not assignable to type 'string'.
//       Type 'number' is not assignable to type 'string'.
```

上面因为 `age` 的属性值类型是 `number` 属性，不是**任意属性**属性值的类型 `string` 的子属性，所以报错。

### 只读属性

如果希望对象中的一些字段**只能在创建的时候被赋值**，那么可以用 `readonly` 定义只读属性：

```ts
interface Person {
    readonly id: number; // 使用 readonly 定义的属性 id
    name: string;
    age?: number;
    [propName: string]: any;
}

let tom: Person = {
    id: 89757,
    name: 'Tom',
    gender: 'male'
};

tom.id = 9527; // 对只读属性赋值

// index.ts(14,5): error TS2540: Cannot assign to 'id' because it is a constant or a read-only property.
```

❗️需要注意的是，**只读**这个约束，是针对**第一次给对象赋值**的时候，而不是**第一给只读属性赋值**。所以只读约束的目标是「对象」。

```ts
interface Person {
    readonly id: number;
    name: string;
    age?: number;
    [propName: string]: any;
}

let tom: Person = {
    name: 'Tom',
    gender: 'male'
};

tom.id = 89757; // 尽管在对象第一次赋值的时候没有定义，但是还是报错了

// index.ts(8,5): error TS2322: Type '{ name: string; gender: string; }' is not assignable to type 'Person'.
//   Property 'id' is missing in type '{ name: string; gender: string; }'.
// index.ts(13,5): error TS2540: Cannot assign to 'id' because it is a constant or a read-only property.
```

## 数组类型

在 TypeScript 中有多种定义数组的方法：

```ts
// 「类型 + 方括号」表示法
let list: number[] = [1, 2, 3] // 在类型后加 [] 表示由此类型元素组成的一个数组

// 数组泛型, 即 `Array<elemType>` 来表示数组
let list: Array<number> = [1, 2, 3]
```

需要注意的是，数组中**不允许出现**其他类型的元素。

但是如果需要联合类型的数组，可以这样定义：

```ts
let fibonacci: (number | string)[] = [1, '1', 2, 3, 5];
```

一个比较常见的做法是，用 `any` 表示数组中允许出现任意类型：

```ts
let list: any[] = ['Xcat Liu', 25, { website: 'http://xcatliu.com' }];
```

### 用接口表示数组

接口既然是定义「对象」的类型，数组属于对象，那么接口当然可以定义数组鸭~

```ts
interface NumberArray {
    [index: number]: number;
}
let fibonacci: NumberArray = [1, 1, 2, 3, 5];
```

## 函数类型

我们知道 JavaScript 中有两种定义函数的方式：

- 函数声明（也就是 `function` 关键字定义）
- 函数表达式（也就是函数是一等公民的概念）

针对这两种也有对应的函数类型定义：

```ts
// 函数声明（Function Declaration）
function sum(x: number, y: number): number {
    return x + y;
}

// 函数表达式（Function Expression）
let mySum = function (x: number, y: number): number {
    return x + y;
};
// 或者 (虽然一般没有人这么做)
let mySum: (x: number, y: number) => number = function (x: number, y: number): number {
    return x + y;
};
```

上面 `(x: number, y: number) => number` 这段代码是用来定义 `mySum` 的类型的。

其中的 `=>` 与 ES6 中的「箭头函数」不是一个概念，前者是 TypeScript 的定义语法。`=>` 左边是**输入类型**（输入类型需要用括号括起来），右边是**输出类型**。

### 用接口定义函数的类型

接口既然是定义「对象」的类型，函数属于对象，和数组一样，接口当然可以定义函数鸭~

```ts
interface SearchFunc {
    (source: string, subString: string): boolean;
    // 这时候键名就是一个表达式
}

let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    return source.search(subString) !== -1;
}
```

### 函数的可选参数

定义好函数后，是不允许传多或者传少参数进入。

如果一些参数不是必须传入的参数，与「可选属性」类似，可以使用「可选参数」（用 `?` 表示可选参数）定义类型：

```ts
function buildName(firstName: string, lastName?: string) {
    // 这里 lastName 不是必须的
    if (lastName) {
        return firstName + ' ' + lastName
    } else {
        return firstName
    }
}
let tomcat = buildName('Tom', 'Cat')
let tom = buildName('Tom')
```

❗️需要注意的是，「可选参数」必须在「必须参数」的后面。换句话说，就是可选参数后面不能出现必须参数。

### 参数默认值

我们知道在 ES6 中加入了函数默认值的特性，**TypeScript 会将添加了默认值的参数识别为「可选参数」**，但是其所在位置并不受限制。

### 剩余参数

在 ES6 中，可以使用 `...rest` 的方式获取函数中的剩余参数，在 TypeScript 中可以用数组的形式定义它们：

```ts
function push(array: any[], ...items: any[]) {
    items.forEach(function(item) {
        array.push(item);
    });
}

let a = [];
push(a, 1, 2, 3);
```

别忘了，ES6 中规定 `rest` 参数只能是最后一个参数。

### 函数重载

> 函数的重载就是允许一个函数接受不同数量或者类型的参数的时候，做出不同的处理。

现在有一个函数 `reverse`，输入数字 `123` 的时候，输出反转的数字 `321`，输入字符串 `'hello'` 的时候，输出反转的字符串 `'olleh'`。

```ts
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
```

但是这样有一个确定，就是不能够精确的表达输入与输出的关系。

我们想要的是，如果输入的是 `number`，函数返回的也是 `number` 类型，如果输入的是 `string`，函数返回的也是 `string` 类型。

但是上面返回的是一个 `number | string` 的联合类型，并不是我们想要的结果。

这时候，我们可以利用「重载」定义多个 `reverse` 函数类型：

```ts
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
```

上面代码中，重复定义了多次函数 `reverse`，前两次都是**函数定义**，最后一次是**函数实现**。

❗️注意，TypeScript 会优先从最前面的函数定义开始匹配，所以多个函数定义如果有包含关系，需要优先把精确的定义写在前面。

## 类型断言

> 类型断言（Type Assertion）可以用来手动指定一个值的类型。也就是相当于类型转换。

```ts
// 使用尖括号语法
let someValue: any = "this is a string"
let strLength: number = (<string>someValue).length

// 或者使用 as 关键字
let someValue: any = "this is a string"
let strLength: number = (someValue as string).length
```

❗️在 `tsx` 语法中必须用 **as 语法**。

有时候，我们确实需要在还不确定类型的时候就访问其中一个类型的属性或方法，比如：

```ts
function getLength(something: string | number): number {
    if (something.length) {
        return something.length;
    } else {
        return something.toString().length;
    }
}

// index.ts(2,19): error TS2339: Property 'length' does not exist on type 'string | number'.
//   Property 'length' does not exist on type 'number'.
// index.ts(3,26): error TS2339: Property 'length' does not exist on type 'string | number'.
//   Property 'length' does not exist on type 'number'.
```

上面代码中，获取 `something.length` 的时候会报错，因为 `string` 和 `number` 的联合类型中，`length` 不是共有属性。

**这时候**！可以使用类型断言，将 `something` **断言成** `string`：

```ts
function getLength(something: string | number): number {
    if ((<string>something).length) {
        // number.length === undefined
        return (<string>something).length;
    } else {
        return something.toString().length;
    }
}
```

类型断言的用法如上，在需要断言的变量前加上 `<Type>` 即可。

类型断言**并不是类型转换**，所以断言成一个联合类型中**不存在的类型**是不允许的：

```ts
function toBoolean(something: string | number): boolean {
    return <boolean>something; // 联合类型中没有 `boolean`
}

// index.ts(2,10): error TS2352: Type 'string | number' cannot be converted to type 'boolean'.
//   Type 'number' is not comparable to type 'boolean'.
```

## [待完善]声明文件

> 当使用第三方库时，我们需要引用它的声明文件。

### 声明语句

比如我们在使用 jQuery 的时候，我们并不知道什么是 `$` 什么是 `jQuery`。

```ts
jQuery('#foo')
// index.ts(1,1): error TS2304: Cannot find name 'jQuery'.
```

这时候我们需要使用 `declare` 关键字来定义它的类型，帮助 TypeScript 判断我们传入的参数类型是否正确：

```ts
declare var jQuery: (selctor: string) => any;

jQuery('#foo')
```

`declare` 定义类型的语句只会用于编译过程，在编译结果中会被删除。

### 什么是声明文件

通常，我们会把这些类型声明放到一个单独的文件，这就是声明文件

> 我们约定声明文件以 .d.ts 为后缀。

```ts
// jQuery.d.ts
declare var jQuery: (string) => any
```