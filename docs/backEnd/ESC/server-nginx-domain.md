# 配置服务器 —— Nginx添加多个二级子域名

Nginx 环境下配置多个二级域名有两种方法：

1. [Nginx多文件配置二级子域名（推荐）](#nginx多文件配置二级子域名（推荐）)
2. [Nginx单文件配置二级子域名](#nginx单文件配置二级子域名)

## Nginx多文件配置二级子域名（推荐）

### 添加域名解析

首先，在自己的域名控制台中添加解析，这里以添加 `blog` 前缀为例；

我用的是万网，在 `解析设置` 中 `添加解析`

![添加解析](https://img-blog.csdn.net/20170415235411153?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvTEJpbmlu/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

> **主机记录**：你想要的二级域名
>
> **记录值**：你的 IP 地址

保存后，我们就完成了第一步把子域名解析到我们的服务器上。

### Nginx 配置

第二步：添加配置文件

进入 Nginx 的 `/conf` 配置文件夹中，编辑 `nginx.conf` 文件：

```bash
[root@iZ2844brz0xZ ~]# cd /usr/local/nginx/conf/
[root@iZ2844brz0xZ ~]# vim nginx.conf
```

在 `http` 模块中添加如下语句

```
include /usr/local/nginx/conf/sites-enabled/*.conf;
```

告诉这个配置文件要去包含 `/sites-enabled` 目录下的所有以 `.conf` 结尾的配置文件。`:wq` 保存。

此时，我们新建一个 `/sites-enabled` 文件夹，并在其中添加 `blog.***.com.conf` 文件：

```bash
[root@iZ2844brz0xZ conf]# mkdir sites-enabled
[root@iZ2844brz0xZ sites-enabled]# vim blog.***.com.conf
```

在文件中添加：

```bash
server {
    listen 80;                              #监听端口
    server_name blog.***.com;               #绑定域名
    root /usr/local/nginx/html/blog/;       #网站根目录，建议使用绝对路径
    index index.php index.html index.htm;   #默认文件

	#添加对php的解析
	location ~ \.php$ {
        fastcgi_pass   127.0.0.1:9000;
        fastcgi_index  index.php;
        fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
	    include        /usr/local/nginx/conf/fastcgi_params;
    }

    #添加错误页面，利于搜索引擎收录以及良好的用户体验
	error_page 404 /404.html;
    location /404.html {
        root /usr/local/nginx/html/;
    }

    error_page 500 502 503 504 /50x.html;
    location =/50x.html {
        root /usr/local/nginx/html/;
    }
}
```

内容可自行添加~

最后，重启 `nginx` 即可：

```bash
[root@iZ2844brz0xZ sites-enabled]# /usr/local/nginx/sbin/nginx -s reload
```

## Nginx单文件配置二级子域名

### 添加域名解析

同 [添加域名解析](#添加域名解析)

### 配置 Nginx

在 `nginx.conf` 文件的 `server` 模块中添加以下语句：

```bash
if ( $host ~* (\b(?!www\b)\w+)\.\w+\.\w+ ) {
 set $subdomain /$1;
}
location / {
 root html$subdomain;
 index index.html index.php index.htm index;
}
```

即可解析到对应文件夹

最后，重启 nginx 即可

```bash
[root@iZ2844brz0xZ sites-enabled]# /usr/local/nginx/sbin/nginx -s reload
```