# 利用 Nginx 反向代理实现前端跨域

## 前言

在之前的一个课程项目中，遇到了一个跨域问题，不过以前用的都是 `jsonp` 或者后端设置 `Access-Control-Allow-Origin`，这两种方法都需要后端进行相对应的操作，如果遇到不想改文件的后端，或者短时间内联系不上后端呢？

![嘻嘻嘻](//ws1.sinaimg.cn/large/006DJj5Hgy1g5txwj8ja1j303z04g74l.jpg)

但是这次遇到的是 **HTTPS** 跨域访问 **HTTP** 接口，给自己的子域名上了 SSL 后，发现 **HTTP** 的接口都无法使用了，后端也设置了 **Access-Control-Allow-Origin**，之前也都能用，jsonp也行不通。

在查阅资料后发现，可以通过 Nginx 的反向代理解决该跨域问题，顺带一并也把其他的跨域给解决了 😆

## 常见的跨域解决方法

1. **「jsonp」**：需要目标服务器配合一个 callback 函数。

	> 服务端需要接收 `callback ` 参数，并且需要返回 `$_GET['callback'] . '(' . json_encode($json) . ')'` ，即按 jsonp 的格式输出，否则会报语法错误。[参考链接](https://www.cnblogs.com/ada-zheng/p/4349840.html)

1. **「CORS」**：需要服务器设置 header ：`Access-Control-Allow-Origin` 。

1. **「window.name + iframe」**：需要目标服务器响应window.name。

	> [利用window.name+iframe跨域获取数据详解](https://www.cnblogs.com/zichi/p/4620656.html)

1. **「window.location.hash(锚点) + iframe」**：同样需要目标服务器作处理。

	> [利用location.hash+iframe跨域获取数据详解](https://www.cnblogs.com/zichi/p/4621963.html)

1. **「postMessage + ifrme」**：这个也是需要目标服务器或者说是目标页面写一个postMessage，主要侧重于前端通讯。

## 思考 🤔

### 问：什么是跨域？

> 答：**跨域** 是指当一个资源从与该资源本身所在的服务器不同的域或端口不同的域或不同的端口请求一个资源时，资源会发起一个跨域 **HTTP** 请求。也就是说，正常的跨域情况，是你访问了一个A网站，然后这个网站返回的资源里面，请求了 B 网站 / 端口的资源，于是就跨域了。

### 问：是谁在禁止跨域？

> 答：浏览器。之前有思考过为什么「Postman」没有跨域的问题，后来再知乎看到了答案:「 在 Postman 里面，实际上每发出一个请求，都是在独立请求一个资源，而不是在一个网站返回的页面里，再去请求另外一个网站 / 端口的资源。自然也就不会造成跨域了。 」 实际上就是因为跨域是浏览器做出的限制。

### 问：如何才能绕过这个规则？

> 答：不在浏览器中请求域外服务就好了嘛~

## 起初

在 JavaScript 中，有如下代码，当前URL：`https://item.lbinin.com/test/`

```javascript
$.ajax({
    type: 'GET',
    url: 'https://api.lbinin.com/',
    dataType: 'json',
    success: function(data) {
      console.log(data)
    },
    error: function(data){
      console.log(data)
    }
})
```

果然，跨域出现问题 🙄

![跨域出现问题](//ws1.sinaimg.cn/large/006DJj5Hgy1g5txp4aoevj30lr0emwgd.jpg)

怎么办呢! 往下看~

## 配置 Nginx

在 **80** 或者 **443** 端口的 **server** 块中填入一下配置

```
location /apis {
	rewrite  ^/apis/(.*)$ /$1 break;
	proxy_pass   http://你要请求的api地址.com/;
}
```

- **第一行**：添加对访问目录为 **`/apis`** 的代理配置，之后拦截所有对 **`https://当前域名.com/apis`** 的请求，进行花括号内的操作；

- **第二行**：重写拦截的请求，并且只能对域名后，传参前的字符串起作用。

    > 即 **`www.你的域名.com/html/apis/api?method=1&para=123`** 重写。只对 **`/html/apis/api`** 重写。
    > 
    > `rewrite` 后面的参数是一个简单的正则 `^/apis/(.*)$`， `$1` 代表正则中的第一个 `()` ，以此类推。`break` 代表匹配一个之后停止匹配；

- **第三行**：把请求代理到**其他主机**。

修改完后保存，重启 Nginx ~

## 使用

将 URL 改为 `/apis` 就好啦~

![将URL改为/apis](//ws1.sinaimg.cn/large/006DJj5Hgy1g5txvd1kfrj308l08y74y.jpg)

ok，跨域成功 🎉

![ok，跨域成功](//ws1.sinaimg.cn/large/006DJj5Hgy1g5txvx43spj30qi0m7ad4.jpg)

## 总结

总的来说，思路就是：

你在本域访问自己的服务，相当于转发，然后 Nginx 拦截你的请求，代理到目标地址，Nginx 本身没有禁止跨域的限制，是浏览器禁止的跨域，所以 Nginx 能够获取到跨域内容，并将获取到的内容返回给当前服务，完成跨域。个人感觉，这才是跨域的正确姿势！

![呀呀呀呀](//ww1.sinaimg.cn/mw690/006DJj5Hgy1g5tudj4661j30dw0dwk0o.jpg)