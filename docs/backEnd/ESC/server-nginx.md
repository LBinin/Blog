# 服务器配置 —— Nginx 的安装和配置

## 下载

进入 [Nginx 官网](http://nginx.org/)，进入右侧 `download` 页面，进入页面后在 `Stable version` 中选择 `nginx-*` 右键复制链接，然后用 `wget` 下载

```bash
[root@iZ2844brz0xZ ~]# wget http://nginx.org/download/nginx-1.12.0.tar.gz
```

如果提示wget命令未找到，则执行

```bash
[root@iZ2844brz0xZ ~]# sudo yum install wget
```

下载完用 `ll` 命令查看刚刚下载获得的 `nginx-*.tar.gz` 文件，用下面命令解压它

```bash
[root@iZ2844brz0xZ ~]# tar -zxvf nginx-1.12.0.tar.gz
```

> **-z**: 表示使用gzip的属性。
>
> **-x**: 解开一个压缩文件的参数指令。
>
> **-v**: 表示压缩的过程中显示文件！这个常用，但不建议用在背景执行过程！
>
> **-f**: 使用档名，请留意，在 f 之后要立即接档名喔！不要再加参数！
>
> [参考资料](http://jingyan.baidu.com/article/86112f13605d30273697876e.html?st=2&os=0&bd_page_type=1&net_type=1)

## 安装

安装 Nginx 前，需要安装以下三个依赖库：

::: tip 依赖库
1. **gzip** 模块需要 `zlib` 库

2. **rewrite** 模块需要 `pcre` 库

3. **ssl** 功能需要 `openssl` 库
:::

### 下载依赖库

#### 下载 openssl

[https://www.openssl.org/source/](https://www.openssl.org/source/)

```bash
[root@iZ2844brz0xZ ~]# wget https://www.openssl.org/source/openssl-fips-2.0.14.tar.gz
```

#### 下载 zlib

[http://www.zlib.net/](http://www.zlib.net/)

```bash
[root@iZ2844brz0xZ ~]# wget http://www.zlib.net/zlib-1.2.11.tar.gz
```

#### 下载 pcre

[http://www.pcre.org/](http://www.pcre.org/)

```bash
[root@iZ2844brz0xZ ~]# wget ftp://ftp.csx.cam.ac.uk/pub/software/programming/pcre/pcre-8.39.tar.gz
```

### 安装依赖库

下载完上述依赖库后，便进行依赖库的安装，**依赖包安装顺序依次为: `openssl`、`zlib`、`pcre`**。

1. 安装 **openssl**

    ```bash
    [root@iZ2844brz0xZ ~]# tar -zxvf openssl-fips-2.0.14.tar.gz
    [root@iZ2844brz0xZ ~]# cd openssl-fips-2.0.14/
    [root@iZ2844brz0xZ openssl-fips-2.0.14]# ./config
    [root@iZ2844brz0xZ openssl-fips-2.0.14]# make
    [root@iZ2844brz0xZ openssl-fips-2.0.14]# make install
    ```

2. 安装 **zlib**

    ```bash
    [root@iZ2844brz0xZ ~]# tar -zxvf zlib-1.2.11.tar.gz
    [root@iZ2844brz0xZ ~]# cd zlib-1.2.11/
    [root@iZ2844brz0xZ zlib-1.2.11]# ./configure
    [root@iZ2844brz0xZ zlib-1.2.11]# make
    [root@iZ2844brz0xZ zlib-1.2.11]# make install
    ```

3. 安装 **pcre**

    ```bash
    [root@iZ2844brz0xZ ~]# tar -zxvf pcre-8.39.tar.gz
    [root@iZ2844brz0xZ ~]# cd pcre-8.39/
    [root@iZ2844brz0xZ pcre-8.39]# ./configure
    [root@iZ2844brz0xZ pcre-8.39]# make
    [root@iZ2844brz0xZ pcre-8.39]# make install
    ```

### 安装 Nginx

    ```bash
    [root@iZ2844brz0xZ ~]# tar -zxvf nginx-1.12.0.tar.gz
    [root@iZ2844brz0xZ ~]# cd nginx-1.12.0/
    [root@iZ2844brz0xZ nginx-1.12.0]# ./configure --with-pcre=../pcre-8.39 --with-zlib=../zlib-1.2.11 --with-openssl=../openssl-fips-2.0.14
    [root@iZ2844brz0xZ nginx-1.12.0]# make
    [root@iZ2844brz0xZ nginx-1.12.0]# make install
    ```

## 检测

安装好之后，我们来检测一下是否安装成功：

```bash
[root@iZ2844brz0xZ nginx-1.12.0]# cd /usr/local/nginx/sbin/
[root@iZ2844brz0xZ sbin]# ./nginx -t
```

若出现下方信息**表示安装成功**：

```bash
nginx: the configuration file /usr/local/nginx/conf/nginx.conf syntax is ok
nginx: configuration file /usr/local/nginx/conf/nginx.conf test is successful
```

## 启动

最后一步，在 `nginx/sbin` 目录下，启动 Nginx：

```bash
[root@iZ2844brz0xZ sbin]# ./nginx
```

查看端口：

```bash
[root@iZ2844brz0xZ sbin]# netstat -ntlp
```

至此，Nginx 安装结束

参考资料：

>[http://www.cnblogs.com/hzh19870110/p/6100661.html](http://www.cnblogs.com/hzh19870110/p/6100661.html) *作者：grhlove123*

## 配置

### php-fpm

前提是安装好 PHP（[服务器配置 —— 安装PHP](./server-php.md)），进入 php 的 `sbin` 目录下启动 `php-fpm`：

```bash
[root@iZ2844brz0xZ ~]# cd /usr/local/php7/sbin/
[root@iZ2844brz0xZ sbin]# ./php-fpm
```

（若提示没有权限，在命令前加上 `sudo` 即可。）

发现提示下方信息：

```bash
[15-Apr-2017 17:06:21] ERROR: failed to open configuration file '/usr/local/php7/etc/php-fpm.conf': No such file or directory (2)
[15-Apr-2017 17:06:21] ERROR: failed to load configuration file '/usr/local/php7/etc/php-fpm.conf'
[15-Apr-2017 17:06:21] ERROR: FPM initialization failed
```

告诉我们在 `/usr/local/php7/etc/` 目录下没有找到 `php-fpm.conf` 配置文件。

那我们进入对应文件夹查看文件：

```bash
[root@iZ2844brz0xZ sbin]# cd /usr/local/php7/etc/
[root@iZ2844brz0xZ etc]# ll
```

显示：

```bash
total 16
-rw-r--r-- 1 root root 1239 Apr 15 07:33 pear.conf
-rw-r--r-- 1 root root 4468 Apr 15 07:33 php-fpm.conf.default
drwxr-xr-x 2 root root 4096 Apr 15 07:33 php-fpm.d
```

发现 `php-fpm.conf` 多了一个 `default` 结尾，我们只需要把文件重新命名就好了：

```bash
[root@iZ2844brz0xZ etc]# mv php-fpm.conf.default php-fpm.conf --利用mv移动命令更改名字
```

重新进入 php 的 `sbin` 目录下启动 `php-fpm`：

```bash
[root@iZ2844brz0xZ etc]# cd /usr/local/php7/sbin/
[root@iZ2844brz0xZ sbin]# ./php-fpm
```

这时候提示：

```bash
[15-Apr-2017 17:08:23] WARNING: Nothing matches the include pattern '/usr/local/php7/etc/php-fpm.d/*.conf' from /usr/local/php7/etc/php-fpm.conf at line 125.
[15-Apr-2017 17:08:23] ERROR: No pool defined. at least one pool section must be specified in config file
[15-Apr-2017 17:08:23] ERROR: failed to post process the configuration
[15-Apr-2017 17:08:23] ERROR: FPM initialization failed
```

告诉我们在 `/usr/local/php7/etc/php-fpm.d/` 目录下没有找到 `.conf` 文件，问题出在125行，我们用 `vim` 编辑文件：

```bash
[root@iZ2844brz0xZ sbin]# vim /usr/local/php7/etc/php-fpm.conf
```

进入后输入命令 `:125` 跳转到 125 行：

```
include=/usr/local/php7/etc/php-fpm.d/*.conf
```

给我们的信息是要找 `php-fpm.d` 目录下的以 `.conf` 结尾的文件，输入`:q!` 退出，进入对应文件夹，查看文件：

```bash
[root@iZ2844brz0xZ sbin]# cd /usr/local/php7/etc/php-fpm.d/
[root@iZ2844brz0xZ php-fpm.d]# ll
```

发现以下文件：

```bash
total 20
-rw-r--r-- 1 root root 18521 Apr 15 07:33 www.conf.default
```

重命名：

```bash
[root@iZ2844brz0xZ php-fpm.d]# mv www.conf.default www.conf
```

回到 `sbin` 目录下重新启动 `php-fpm`：

```bash
[root@iZ2844brz0xZ php-fpm.d]# cd /usr/local/php7/sbin/
[root@iZ2844brz0xZ sbin]# ./php-fpm
```

若没有提示信息表明 php-fpm 启动成功啦~

用以下命令查看 `php-fpm` 进程：

```bash
[root@iZ2844brz0xZ ~]# ps aux | grep php-fpm
```

### Nginx

进入 Nginx 目录，编辑 `nginx.conf` 配置文件：

```bash
[root@iZ2844brz0xZ nginx]# cd /usr/local/nginx/
[root@iZ2844brz0xZ nginx]# cd conf/
[root@iZ2844brz0xZ conf]# vim nginx.conf
```

看到 `server` 模块下有：

```
location / {
    root   html;
    index  index.html index.htm;
}
```

这段表示所有的文件都会进入 `html` 这个目录下，我们现在编写与 php 相关的语句：

在下面我们可以找到配置文件已经帮我们写好了我们只需要把前面的注释符号 `#` 去掉就好了：

```
location ~ \.php$ {
    root           html;
    fastcgi_pass   127.0.0.1:9000;
    fastcgi_index  index.php;
    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
    include        fastcgi_params;
}
```

输入`:wq` 保存退出。

别忘了修改完配置文件记得要重新启动 nginx 哦：

```bash
[root@iZ2844brz0xZ ~]# cd /usr/local/nginx/sbin/
[root@iZ2844brz0xZ sbin]# ./nginx -s reload
```

进入 nginx 的`html` 目录，新建一个文件测试一下：

```bash
[root@iZ2844brz0xZ conf]# cd ..
[root@iZ2844brz0xZ nginx]# cd html/
[root@iZ2844brz0xZ html]# vim test.php
```

输入：

```php
<?php
	phpinfo();
```

打开网址，运行成功~

## 参考资料

> [Nginx 和 php-fpm 的运行原理](https://segmentfault.com/a/1190000007322358) *作者：zilu* （写的很棒~）