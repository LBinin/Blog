### app 实例

```js
{ subdomainOffset: 2, proxy: false, env: 'development' }
```

- `app.env` 默认是 **NODE_ENV** 或 `development`
- `app.proxy` 当真正的代理头字段将被信任时
- `app.subdomainOffset` 对于要忽略的 `.subdomains` 偏移 `[2]`

### ctx

```js
{
  // koa 的请求对象
  request: {
    method: 'GET',
    url: '/',
    header: {
      host: 'localhost:3000',
      connection: 'keep-alive',
      pragma: 'no-cache',
      'cache-control': 'no-cache',
      'upgrade-insecure-requests': '1',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.87 Safari/537.36',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-user': '?1',
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
      'sec-fetch-site': 'none',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8'
    }
  },

  // koa 的响应对象
  response: {
    status: 200,
    message: 'OK',
    header: [Object: null prototype] {
      'content-type': 'text/plain; charset=utf-8',
      'content-length': '11',
      'x-response-time': '1ms'
    }
  },

  // 运行的 app 实例
  app: { subdomainOffset: 2, proxy: false, env: 'development' },
  // 请求的原始地址
  originalUrl: '/',
  // Node 的 request 对象
  req: '<original node req>',
  // Node 的 response 对象
  res: '<original node res>',
  socket: '<original node socket>'
}
```

app.listen(...) 方法只是以下方法的语法糖:

const http = require('http');
const Koa = require('koa');
const app = new Koa();
http.createServer(app.callback()).listen(3000);

## 参考资料

https://koajs.com/
https://demopark.github.io/koa-docs-Zh-CN/
https://www.jmjc.tech/less/116