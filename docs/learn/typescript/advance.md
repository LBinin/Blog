# TS 进阶



### 元组 Tuple

```ts
// Declare a tuple type
let x: [string, number]

// Initialize it
x = ['hello', 10] // OK
// Initialize it incorrectly
x = [10, 'hello'] // Error
```

### 枚举 enum

```ts
enum Color {Red, Green, Blue}
let c: Color = Color.Green
```

转义出来：

```ts
var Color
(function (Color) {
    Color[Color["Red"] = 0] = "Red"
    Color[Color["Green"] = 1] = "Green"
    Color[Color["Blue"] = 2] = "Blue"
})(Color || (Color = {}))
var c = Color.Green
```

上面的代码就容易理解了，Color 中的内容为 `{ '0': 'Red', '1': 'Green', '2': 'Blue', Red: 0, Green: 1, Blue: 2 }`。

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
