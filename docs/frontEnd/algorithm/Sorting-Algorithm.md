---
sidebarDepth: 1
---

# 排序算法 <Badge text="编写中" type="warn"/>

## 1. 冒泡排序

![冒泡排序图示](https://user-gold-cdn.xitu.io/2017/7/27/3bcdc49661b5c8a3500463095ecc09df?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

### 描述

1. 比较相邻的元素。如果第一个比第二个大，就交换他们两个。 
2. 对每一对相邻元素作同样的工作，从开始第一对到结尾的最后一对。在这一点，最后的元素应该会是最大的数。 
3. 针对所有的元素重复以上的步骤，除了最后一个。 
4. 持续对每次越来越少的元素重复上面的步骤，直到没有任何一对数字需要比较。

### 代码

**思路**：外循环控制需要比较的元素，比如第一次排序后，最后一个元素就不需要比较了，内循环则负责两两元素比较，将元素放到正确位置上。

```js
function bubbleSort(arr) {
  var temp

  for (var i = arr.length - 1; i > 0; i--) {
    // 因为排好序的都在最后
    for (var j = 0; j < i; j++) {
      if (arr[j] < arr[j + 1]) {
        temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
      }
    }
  }

  return arr
}
```

## 2. 插入排序

### 描述

![插入排序图示](https://user-gold-cdn.xitu.io/2017/7/27/da44baba996d9c4e8ddeb43a01c2139d?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

1. 从第一个元素开始，该元素可以认为已经被排序 
2. 取出下一个元素，在已经排序的元素序列中从后向前扫描 
3. 如果该元素（已排序）大于新元素，将该元素移到下一位置 
4. 重复步骤 3，直到找到已排序的元素小于或者等于新元素的位置 
5. 将新元素插入到该位置后 
6. 重复步骤 2~5

### 代码

**思路**：双层循环，外循环控制未排序的元素，内循环控制已排序的元素，将未排序元素设为标杆，与已排序的元素进行比较，小于则交换位置，大于则位置不动

**算法复杂度**：O(n^2)

```js
function insertSort(arr) {
  for (var i = 1; i < arr.length; i++) {
    var temp = arr[i] // 取出当前需要排序的元素

    for (var j = i; j >= 0; j--) {
      // 在已经排序的数组里往前扫描
      if (temp < arr[j - 1]) {
        // 如果需要排序的元素比前面的小，往前移
        arr[j] = arr[j - 1]
      } else {
        // 换位置
        arr[j] = temp
        break
      }
    }
  }
  return arr
}
```

## 3. 选择排序

### 描述

![选择排序图示](https://user-gold-cdn.xitu.io/2017/7/27/e0824efdb79268d4de42991274dcc9eb?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

直接从「待排序数组」中选择一个最小（或最大）数字，放入新数组中。

### 代码

**算法复杂度**：O(n^2)

**思路**：先假设第一个元素为最小的，然后通过循环找出最小元素，然后同第一个元素交换，接着假设第二个元素，重复上述操作即可。

```js
function selectSort(arr) {
  for (var i = 0; i < arr.length; i++) {
    // 定义好最小的值和对应的下标
    var minIndex = i
    var minValue = arr[i]

    for (var j = i; j < arr.length; j++) {
      // 不断更新最小值和下标
      if (arr[j] < minValue) {
        minIndex = j
        minValue = arr[j]
      }
    }

    // 交换「未排序数组」中的第一个和「未排序数组」中最小的值
    arr[minIndex] = arr[i]
    arr[i] = minValue
    // 接下来「未排序数组」中的前 i 个就成为「已排序数组」
  }

  return arr
}
```

## 4. 希尔排序 todo

## 5. 归并排序

### 描述

![归并排序图示](https://user-gold-cdn.xitu.io/2017/7/27/f9fcaf0d64dcd11b9309f09062863b29?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

1. 把 n 个记录看成 n 个长度为 l 的有序子表 
2. 进行两两归并使记录关键字有序，得到 n/2 个长度为 2 的有序子表 
3. 重复第 2 步直到所有记录归并成一个长度为 n 的有序表为止。

### 代码

**时间复杂度**：O(nlogn)

**思路**：将数组一直等分，排序后合并

```js
function merge(left, right) {
  var temp = []
  while (left.length && right.length) {
    // 此时的 left 和 right 都是排好序的（个数为 0 也当是排好序）
    // 因为个数可能不一样，所以需要 &&
    // 小的放到 temp 中，直到有个放完
    // 另一个如果没有放完，肯定大于等于 temp 中最后一个
    temp.push(left[0] < right[0] ? left.shift() : right.shift())
  }
  // 空的话无所谓，有的话就直接接到后面
  return temp.concat(left, right)
}

function mergeSort(arr) {
  // 递归去划分和排序
  if (arr.length === 1) {
    return arr
  }

  var mid = Math.floor(arr.length / 2)
  var left = arr.slice(0, mid)
  var right = arr.slice(mid)
  
  return merge(mergeSort(left), mergeSort(right))
}
```

## 6. 快速排序

### 描述

![快速排序图示](https://user-gold-cdn.xitu.io/2017/7/27/ad4d6e25b6e0e91c743ae220e3d52d1e?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

1. 数据集之中，选择一个元素作为「基准」（pivot）。
2. 所有小于「基准」的元素，都移到「基准」的**左边**；所有大于「基准」的元素，都移到「基准」的**右边**。这个操作称为分区 (partition)操作，分区操作结束后，基准元素所处的位置就是最终排序后它的位置。
3. 对「基准」左边和右边的两个子集，不断重复第一步和第二步，直到所有子集只剩下一个元素为止。

### 代码

**时间复杂度**：O(nlogn)

```js
function quickSort(arr) {
  // 交换函数
  function swap(arr, a, b) {
    if (a === b) return
    var temp = arr[a]
    arr[a] = arr[b]
    arr[b] = temp
  }

  function partition(arr, left, right) {
    var pivotValue = arr[right] //最右面设为准线，小于它的放左边，大于的放右边
    var storeIndex = left // 记录需要交换的指针 index

    for (var i = left; i < right; i++) {
      if (arr[i] <= pivotValue) {
        // 比准线小的值，和当前指针上的值对换
        // 然后指针下移一位，表明下次交换的位置
        swap(arr, i, storeIndex++)
      }
    }

    // 把准线和 ++ 后的 storeIndex 对换（此时 storeIndex 上的值比准线大）
    // 交换后，准线左边都小于等于准线，右边都比准线大
    swap(arr, right, storeIndex)

    return storeIndex // 返回指针的 index
  }

  function sort(arr, left, right) {
    if (left >= right) return

    var storeIndex = partition(arr, left, right) // 获取指针 index，此时的 arr 也已经左右分层

    sort(arr, left, storeIndex - 1) // 把指针的左边部分排好序
    sort(arr, storeIndex + 1, right) // 把指针的右边部分排好序
  }

  sort(arr, 0, arr.length - 1) // 开始 sort

  return arr
}
```

## 7. 堆排序 todo

## 8. 计数排序

## 9. 桶排序

## 10. 基数排序

## 参考资料

> [前端面试必备 —— 基本排序算法 | 掘金](https://juejin.im/entry/5979bed7f265da3e13573e8c)
>   
> [前端面试必备——十大经典排序算法 · Issue #14 · Wscats/CV](https://github.com/Wscats/CV/issues/14)
> 
> [十大经典排序算法（动图演示） - 一像素 - 博客园](https://www.cnblogs.com/onepixel/p/7674659.html)