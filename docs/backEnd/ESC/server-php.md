# 服务器配置 —— 安装PHP

## 下载

进入 [PHP 官方网站](https://secure.php.net/)，进入后选择右边要 **download** 的版本，选择 `.tar.gz` 结尾的包。

进入后选择节点，可以选择 **Hong Kong** 节点，对第一个「**a标签**」右键复制链接，将复制的链接去 wget 一下：

```bash
[root@iZ2844brz0xZ ~]# wget http://hk1.php.net/get/php-7.1.4.tar.gz/from/this/mirror
```
如果提示wget命令为找到，则执行

```bash
[root@iZ2844brz0xZ ~]# sudo yum install wget
```

## 解压

下载完用 `ll` 命令查看刚刚下载获得的 `mirror` 文件，用下面命令解压它

```bash
[root@iZ2844brz0xZ ~]# tar -zxvf mirror
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

单纯的安装完 **PHP** 是不能和 **Nginx** 一起工作的，只能和 **Apache** 一起工作，这时候我们需要安装「**PHPFPM**」：

### 安装依赖包

进入 `php` 目录，**安装依赖包**：

```bash
[root@iZ2844brz0xZ ~]# cd php-7.1.4/
[root@iZ2844brz0xZ php-7.1.4]# yum install libxml2 libxml2-devel openssl openssl-devel bzip2 bzip2-devel libcurl libcurl-devel libjpeg libjpeg-devel libpng libpng-devel freetype freetype-devel gmp gmp-devel libmcrypt libmcrypt-devel readline readline-devel libxslt libxslt-devel
```

### 编译配置

依赖包安装完成后，运行如下超长代码进行**编译配置**（如果这里出现错误，基本都是上一步的依赖文件没有安装所致）

```bash
[root@iZ2844brz0xZ php-7.1.4]# ./configure \
--prefix=/usr/local/php \
--with-config-file-path=/etc \
--enable-fpm \
--with-fpm-user=nginx  \
--with-fpm-group=nginx \
--enable-inline-optimization \
--disable-debug \
--disable-rpath \
--enable-shared  \
--enable-soap \
--with-libxml-dir \
--with-xmlrpc \
--with-openssl \
--with-mcrypt \
--with-mhash \
--with-pcre-regex \
--with-sqlite3 \
--with-zlib \
--enable-bcmath \
--with-iconv \
--with-bz2 \
--enable-calendar \
--with-curl \
--with-cdb \
--enable-dom \
--enable-exif \
--enable-fileinfo \
--enable-filter \
--with-pcre-dir \
--enable-ftp \
--with-gd \
--with-openssl-dir \
--with-jpeg-dir \
--with-png-dir \
--with-zlib-dir  \
--with-freetype-dir \
--enable-gd-native-ttf \
--enable-gd-jis-conv \
--with-gettext \
--with-gmp \
--with-mhash \
--enable-json \
--enable-mbstring \
--enable-mbregex \
--enable-mbregex-backtrack \
--with-libmbfl \
--with-onig \
--enable-pdo \
--with-mysqli=mysqlnd \
--with-pdo-mysql=mysqlnd \
--with-zlib-dir \
--with-pdo-sqlite \
--with-readline \
--enable-session \
--enable-shmop \
--enable-simplexml \
--enable-sockets  \
--enable-sysvmsg \
--enable-sysvsem \
--enable-sysvshm \
--enable-wddx \
--with-libxml-dir \
--with-xsl \
--enable-zip \
--enable-mysqlnd-compression-support \
--with-pear \
--enable-opcache
```

> `prefix` 为安装路径，我们指定为 `/usr/local/php7` ，后面的 `with-config-file-path` 为配置文件的位置。

### 正式安装

开始**正式安装**

```bash
[root@iZ2844brz0xZ php-7.1.4]# make
[root@iZ2844brz0xZ php-7.1.4]# make install
```

如果提示 `Thank you for using PHP` 表示安装成功。

## 配置

接下来配置**环境变量**：

```bash
[root@iZ2844brz0xZ php-7.1.4]# vi /etc/profile
```

在末尾追加：

```
PATH=$PATH:/usr/local/php/bin
export PATH
```

添加完成后，用 `source` 执行命令使得改动立即生效

```bash
[root@iZ2844brz0xZ php-7.1.4]# source /etc/profile
```

接下来拷贝文件：

```bash
[root@iZ2844brz0xZ php-7.1.4]# cp php.ini-production /etc/php.ini

[root@iZ2844brz0xZ php-7.1.4]# cp /usr/local/php/etc/php-fpm.conf.default /usr/local/php/etc/php-fpm.conf

[root@iZ2844brz0xZ php-7.1.4]# cp /usr/local/php/etc/php-fpm.d/www.conf.default /usr/local/php/etc/php-fpm.d/www.conf

[root@iZ2844brz0xZ php-7.1.4]# cp sapi/fpm/init.d.php-fpm /etc/init.d/php-fpm

[root@iZ2844brz0xZ php-7.1.4]# chmod +x /etc/init.d/php-fpm
```

最后启动 **php-fpm**：

```bash
[root@iZ2844brz0xZ php-7.1.4]# /etc/init.d/php-fpm start
```

OK，成功！

安装完成后进入 `~` 目录，创建一个测试用例

```bash
[root@iZ2844brz0xZ ~]# vim test.php
```

> 若没有Vim，用 `sudo yum install vim` 安装vim

写上：

```php
<?php
	phpinfo();
?>
```

执行 `test.php` 文件：

```bash
[root@iZ2844brz0xZ ~]# /usr/local/php7/bin/php test.php
```

`bin` 前面是安装 **PHP** 的路径，用 `bin` 下的 `php` 执行我们的 `test.php` 文件

若打印出 **PHP** 信息，表明我们的  安装成功

至此，PHP安装结束~

## 参考资料

 - [Centos7 安装 PHP7最新版](http://www.jianshu.com/p/246ffcd5e77d)
