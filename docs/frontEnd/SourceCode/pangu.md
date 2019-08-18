# 「空格之神」源码分析

## CJK

```js
// CJK is short for Chinese, Japanese, and Korean.
//
// CJK includes following Unicode blocks:
// \u2e80-\u2eff CJK Radicals Supplement
// \u2f00-\u2fdf Kangxi Radicals
// \u3040-\u309f Hiragana
// \u30a0-\u30ff Katakana
// \u3100-\u312f Bopomofo
// \u3200-\u32ff Enclosed CJK Letters and Months
// \u3400-\u4dbf CJK Unified Ideographs Extension A
// \u4e00-\u9fff CJK Unified Ideographs
// \uf900-\ufaff CJK Compatibility Ideographs
//
// For more information about Unicode blocks, see
// http://unicode-table.com/en/
// https://github.com/vinta/pangu
//
// all J below does not include \u30fb
const CJK = '\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30fa\u30fc-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff';

const ANY_CJK = new RegExp(`[${CJK}]`);
```

这一段定义了 CJK 的范围及其正则表达式，表示「CJK 字体列表」

:::tip CJK 字体列表
CJK 字体列表，是**中、日、韩**统一表意文字在计算机的所有字体列表。

中日韩统一表意文字传统上有多种表现方式；而作为现代的字体，则主要有**宋体**（或称明体，相当于西方的衬线体）、**黑体**（相当于西方的非衬线体）及多种**类手写体**（如楷体、隶书体等）。

以字库的字形内容上分类，则分为非针对性的字体（如泛 Unicode 字体及泛 CJK 字体）以及具针对性的字体（如简体中文、繁体中文、日文及韩文）。

—— [CJK字体列表 - 维基百科，自由的百科全书](https://zh.wikipedia.org/wiki/CJK%E5%AD%97%E4%BD%93%E5%88%97%E8%A1%A8)
:::

可以从上面的「Unicode 字符表」一览中可以看到

- `\U2E80-\U2EFF` 表示[中日韩部首补充](https://unicode-table.com/cn/blocks/cjk-radicals-supplement/)（CJK Radicals Supplement）

- `\U2F00-\U2FDF` 表示[康熙部首](https://unicode-table.com/cn/blocks/kangxi-radicals/)（Kangxi Radicals）

- `\U3040-\U309F` 表示[日文平假名](https://unicode-table.com/cn/blocks/hiragana/)（Hiragana）

- `\U30A0-\U30FF` 表示[日文片假名](https://unicode-table.com/cn/blocks/katakana/)（Katakana）

- `\U3100-\U312F` 表示[注音字母](https://unicode-table.com/cn/blocks/bopomofo/)（Bopomofo）

- `\U3200-\U32FF` 表示[带圈中日韩字母和月份](https://unicode-table.com/cn/blocks/enclosed-cjk-letters-and-months/)（Enclosed CJK Letters and Months）

- `\U3400-\U4DBF` 表示[中日韩统一表意文字扩展 A](https://unicode-table.com/cn/blocks/cjk-unified-ideographs-extension-a/)（CJK Unified Ideographs Extension A）

- `\U4E00-\U9FFF` 表示[中日韩统一表意文字](https://unicode-table.com/cn/blocks/cjk-unified-ideographs/)（CJK Unified Ideographs）

- `\UF900-\UFaFF` 表示[中日韩兼容表意文字](https://unicode-table.com/cn/blocks/cjk-compatibility-ideographs/)（CJK Compatibility Ideographs）

- `\U30FB` 表示[片假名中间点](https://unicode-table.com/cn/30FB/)

## 全角字符、符号

```js
// the symbol part only includes ~ ! ; : , . ? but . only matches one character
const CONVERT_TO_FULLWIDTH_CJK_SYMBOLS_CJK = new RegExp(`([${CJK}])[ ]*([\\:]+|\\.)[ ]*([${CJK}])`, 'g')
const CONVERT_TO_FULLWIDTH_CJK_SYMBOLS = new RegExp(`([${CJK}])[ ]*([~\\!;,\\?]+)[ ]*`, 'g')
const DOTS_CJK = new RegExp(`([\\.]{2,}|\u2026)([${CJK}])`, 'g')
const FIX_CJK_COLON_ANS = new RegExp(`([${CJK}])\\:([A-Z0-9\\(\\)])`, 'g')
```

### 名词解释

先解释一些相关名词：

**ANS**：Alphabets、Numbers、Symbols 的缩写

- **A** 代表 `A-Za-z\u0370-\u03ff`，**字母**加上[希腊字母及科普特字母](https://unicode-table.com/cn/blocks/greek-coptic/)；

- **N** 代表 `0-9`，数字；

- **S** 代表 <code>&#96;</code> `~` `!` `@` `#` `$` `%` `^` `&` `*` `(` `)` `-` `_` `=` `+` `[` `]` `{` `}` `\` `|` `;` `:` `'` `"` `,` `<` `.` `>` `/` `?`，各种符号。

接下来说一说上面的相关正则表达式。

### 全角 CJK + 符号 + CJK

```js
\([${CJK}])[ ]*([\\:]+|\\.)[ ]*([${CJK}])\
```

**`CONVERT_TO_FULLWIDTH_CJK_SYMBOLS_CJK`** 正则图解：

![CONVERT_TO_FULLWIDTH_CJK_SYMBOLS_CJK](http://ww3.sinaimg.cn/large/006tNc79gy1g644woptoqj31320jqgom.jpg)

### 全角 CJK + 符号

**`CONVERT_TO_FULLWIDTH_CJK_SYMBOLS`** 正则图解：

这里的符号部分只包括 `~` `!` `;` `:` `,` `.` `?`，但是 `.` 号只匹配一个字符。

```js
\([${CJK}])[ ]*([~\\!;,\\?]+)[ ]*\
```

![CONVERT_TO_FULLWIDTH_CJK_SYMBOLS](http://ww1.sinaimg.cn/large/006tNc79gy1g644wb1xz4j30u00jojtp.jpg)

### 符号 `.` + CJK

**`DOTS_CJK`** 正则图解：

```js
\([\\.]{2,}|\u2026)([${CJK}])\
```

![DOTS_CJK](http://ww4.sinaimg.cn/large/006tNc79gy1g645nyloa2j30io0jqwgf.jpg)

### CJK + 冒号 + ANS

**`FIX_CJK_COLON_ANS`** 正则图解：

```js
\([${CJK}])\\:([A-Z0-9\\(\\)])\
```

![FIX_CJK_COLON_ANS](http://ww3.sinaimg.cn/large/006tNc79gy1g645pzypg3j30j40judhq.jpg)

## 不包含 `'` 的符号

```js
// the symbol part does not include '
const CJK_QUOTE = new RegExp(`([${CJK}])([\`"\u05f4])`, 'g');
const QUOTE_CJK = new RegExp(`([\`"\u05f4])([${CJK}])`, 'g');
const FIX_QUOTE_ANY_QUOTE = /([`"\u05f4]+)[ ]*(.+?)[ ]*([`"\u05f4]+)/g;

const CJK_SINGLE_QUOTE_BUT_POSSESSIVE = new RegExp(`([${CJK}])('[^s])`, 'g');
const SINGLE_QUOTE_CJK = new RegExp(`(')([${CJK}])`, 'g');
const FIX_POSSESSIVE_SINGLE_QUOTE = new RegExp(`([A-Za-z0-9${CJK}])( )('s)`, 'g');
```

### CJK + 引号

**CJK_QUOTE** 正则图解：

```js
\([${CJK}])([\`"\u05f4])\
```

**`CJK_QUOTE`** 正则图解：

`U+05F4` 代表的是[希伯来文标点 Gershayim](https://unicode-table.com/cn/05F4/) 的 <code>&#1524;</code>

![CJK_QUOTE](http://ww2.sinaimg.cn/large/006tNc79gy1g6475f8jl0j30ga0ju0uf.jpg)

### 引号 + CJK

```js
\([\`"\u05f4])([${CJK}])\
```

**`QUOTE_CJK`** 正则图解：

![QUOTE_CJK](http://ww2.sinaimg.cn/large/006tNc79gy1g6475s38ndj30g40jgabs.jpg)

### 引号 + 任意字符 + 引号

```js
\([`"\u05f4]+)[ ]*(.+?)[ ]*([`"\u05f4]+)\
```

**`FIX_QUOTE_ANY_QUOTE`** 正则图解：

![FIX_QUOTE_ANY_QUOTE](http://ww2.sinaimg.cn/large/006tNc79gy1g6476nj9fjj30uw08wmy1.jpg)

### 非所有格的单引号

```js
\([${CJK}])('[^s])\
```

**`CJK_SINGLE_QUOTE_BUT_POSSESSIVE`** 正则图解：

![CJK_SINGLE_QUOTE_BUT_POSSESSIVE](http://ww3.sinaimg.cn/large/006tNc79gy1g648b3c4acj30go0jcmys.jpg)

### 所有格单引号

```js
\([A-Za-z0-9${CJK}])( )('s)\
```

**`FIX_POSSESSIVE_SINGLE_QUOTE`** 正则图解：

![FIX_POSSESSIVE_SINGLE_QUOTE](http://ww1.sinaimg.cn/large/006tNc79gy1g648eilojmj30h00o2gly.jpg)

### 单引号 + CJK

```js
\(')([${CJK}])\
```

**`SINGLE_QUOTE_CJK`** 正则图解：

![SINGLE_QUOTE_CJK](http://ww4.sinaimg.cn/large/006tNc79gy1g648cdeyndj30e80jg0ub.jpg)

## HASH

```js
const HASH_ANS_CJK_HASH = new RegExp(`([${CJK}])(#)([${CJK}]+)(#)([${CJK}])`, 'g');
const CJK_HASH = new RegExp(`([${CJK}])(#([^ ]))`, 'g');
const HASH_CJK = new RegExp(`(([^ ])#)([${CJK}])`, 'g');
```

## 开始处理！

```js
newText = newText.replace(CONVERT_TO_FULLWIDTH_CJK_SYMBOLS_CJK, (match, leftCjk, symbols, rightCjk) => {
    const fullwidthSymbols = self.convertToFullwidth(symbols)
    return `${leftCjk}${fullwidthSymbols}${rightCjk}`
})

newText = newText.replace(CONVERT_TO_FULLWIDTH_CJK_SYMBOLS, (match, cjk, symbols) => {
    const fullwidthSymbols = self.convertToFullwidth(symbols)
    return `${cjk}${fullwidthSymbols}`
})

newText = newText.replace(DOTS_CJK, '$1 $2')
newText = newText.replace(FIX_CJK_COLON_ANS, '$1：$2')
```

`newText` 是「pangu」后的字符串；

其中的 `self.convertToFullwidth` 的作用我们稍后介绍。

## 相关知识点

### Unicode

不同国家的因为字符的不同，标准也不太一样，往往一个国家的字符，对应的 ASCII 码对应着另一个字符，比如，`130` 在**法语**编码中代表了 `é`，在**希伯来语**编码中却代表了字母 Gimel（`ג`）。

这就更不用说亚洲国家的文字，多到根本装不下，单论汉字就有 **10 万个字符**，所以，我们需要一个编码，将世界上所有的符号囊括进去，用一种统一的方式规定字符的编码，让每一个字符都有一个独一无二的编码，这样乱码的问题就能得到解决。

正是出于这种需求，Unicode<sup>[2](https://zh.wikipedia.org/wiki/Unicode)</sup> 诞生了，它是一个非常大的集合，它可以容易 100 多万个字符。

**Unicode 用 `U+` 开头，后接一个十六进制数（码点），来表示一个 Unicode 编号。**（如 `U+597D` 代表字符「好」）

Unicode 只是一个**标准**，是一个**符号集**，它只规定了**符号的二进制代码**，却没有规定这个二进制代码**应该如何存储**，并不是一种具体的实现。

Unicode 的实现方式称为 Unicode 转换格式（Unicode Transformation Format，简称为 UTF）。

关于 Unicode 更多内容可以浏览的我的另一篇博文[彻底搞懂 Unicode](../base/Unicode.md)。

### 全角和半角

传统上，英语或拉丁字母语言使用的计算机系统，每一个字母或符号，都是使用一字节的空间（一字节由 8 比特组成，共 256 个编码空间）来储存；

而汉语、日语及韩语文字，由于数量大大超过 256 个，故惯常使用两字节来储存一个字符。

但是在使用等宽字体（如 DOS、部分文字编辑器等）的环境下，中日韩文字此时占据两倍于西文字符的显示宽度。

所以，中、日、韩等文字称为全角字符，相比起来，拉丁字母或数字就称为半角字符。有时为了使字体看起来齐整，英文字母、数字及其他符号也由原来只占一个字空间，改为占用两个字的空间显示、使用两个字节储存的格式。

## 参考资料

> [✔️ ❤️ ★ Unicode® Character Table](https://unicode-table.com)
> 
> [CJK字体列表 - 维基百科，自由的百科全书](https://zh.wikipedia.org/wiki/CJK%E5%AD%97%E4%BD%93%E5%88%97%E8%A1%A8)
> 
> [全角和半角 - 维基百科，自由的百科全书](https://zh.wikipedia.org/wiki/%E5%85%A8%E5%BD%A2%E5%92%8C%E5%8D%8A%E5%BD%A2)
> 
> 正则表达式图示制作：[Regexper](https://regexper.com/)