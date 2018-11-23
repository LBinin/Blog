# 🛠 CSS 工具库

## 文字溢出显示 `...`

```css
/* 单行 */
.text-overflow-single-line {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 多行 (适用于 Webkit 内核) */
.text-overflow-multiline {
  overflow: hidden;
  /* 这里不需要 text-overflow: ellipsis */

  -webkit-line-clamp: 3;
  /* 用来限制在一个块元素显示的文本的行数。为了实现该效果, 它需要组合其他的 WebKit 属性 */

  display: -webkit-box;
  /* 必须结合的属性,将对象作为弹性伸缩盒子模型显示 */

  -webkit-box-orient: vertical;
  /* 必须结合的属性, 设置或检索伸缩盒对象的子元素的排列方式 */
}
```

<details>

  <summary><strong>SCSS 版本 Mixin</strong></summary>

```scss
@mixin no-wrap($line) {
  @if $line==1 {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  @else {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: $line;
    -webkit-box-orient: vertical;
  }
}

/* 调用 */
/* 单行 */
.text-overflow-single-line {
  @include no-wrap(1);
}

/* 多行 */
.text-overflow-multiline {
  @include no-wrap(3);
}
```

</details>

## 清除浮动