# 执行顺序

事件循环、Microtasks、Worker 线程、runtime

## 1

```js
console.log('script start')

async function async1() {
    await async2()
    console.log('async1 end')
}

async function async2() {
    console.log('async2 end')
}

async1()

setTimeout(() => {
    console.log('setTimeout')
}, 0)

new Promise(r => {
    console.log('promise')
    r()
}).then(() => {
    console.log('then1')
}).then(() => {
    console.log('then2')
})

console.log('script end')
```

```bash
script start
async2 end
promise
script end
then1
then2
async1 end
setTimeout
```

## 2

```js
console.log('script start');
setTimeout(function() {
  console.log('setTimeout');
}, 0);
Promise.resolve().then(function() {
  console.log('promise1');
}).then(function() {
  console.log('promise2');
});
console.log('script end');
```

```bash
script start
script end
promise1
promise2
setTimeout
```

出处：[Tasks, microtasks, queues and schedules(译) | FTAndy](http://ftandy.com/2015/08/23/2015-08-23-tasks-microtasks-queues-and-schedules/)