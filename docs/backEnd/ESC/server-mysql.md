# 服务器配置 —— 安装 Mysql

***2017.4.16更新***

说说遇到的坑吧，首先对 **MySQL** 的 `make` 命令，真的是编译一天！编译了一天就不说了，最后还有奇奇怪怪的问题！结果还没有安装成功！

现在我决定换一个安装方式！

说一下我的操作系统是 **CentOS7**，查资料发现是 **CentOS7** 版本将 **MySQL** 数据库软件从默认的程序列表中移除，用 **mariadb** 代替了，这样，我们回归寻常路。

**CentOS7** 的 **yum** 源中貌似没有正常安装 **MySQL** 时需要的 `mysql-sever` 文件，需要去官网上下载：

安装 `mysql-community-server`：

```
[root@iZ2844brz0xZ ~]# wget http://dev.mysql.com/get/mysql-community-release-el7-5.noarch.rpm
[root@iZ2844brz0xZ ~]# rpm -ivh mysql-community-release-el7-5.noarch.rpm
[root@iZ2844brz0xZ ~]# yum install mysql-community-server
```

成功安装之后启动 `mysql` 服务：

```
[root@iZ2844brz0xZ ~]# service mysqld start
```

初次安装 **MySQL** 的时候，`root` 账户是没有密码的：

```
[root@iZ2844brz0xZ ~]# mysql -u root -p
Enter password:
```

要求输入密码的时候**直接回车**，因为没有密码，进入到 **MySQL**：

```
mysql> SET PASSWORD FOR 'root'@'localhost' = PASSWORD('newPassword');
```

其中 `newPassword` 为你为 `root` 账户设置的密码。

若提示下面信息则表示设置成功

```
Query OK, 0 rows affected (0.02 sec)
```

退出，搞定~

```
mysql> exit
```

## 手动编译

### 下载

进入 [MySQL 下载](https://dev.mysql.com/downloads/mysql/)，进入后在下方选择 `source code` 版本，选择 `Generic Linux (Architecture Independent), Compressed TAR Archive`，右键复制链接，用 `wget` 命令下载后得到 `.tar.gz` 的包：

```
[root@iZ2844brz0xZ ~]# wget https://dev.mysql.com/get/Downloads/MySQL-5.7/mysql-5.7.18.tar.gz
```

如果提示 wget 命令未找到，则执行：

```
[root@iZ2844brz0xZ ~]# sudo yum install wget
```

下载完用 `ll` 命令查看刚刚下载获得的 `mysql-**.**.**.tar.gz` 文件，用下面命令解压并解包它：

```
[root@iZ2844brz0xZ ~]# tar -zxvf mysql-5.7.18.tar.gz
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

接下来我们用 `yum` 来安装我们需要的依赖和工具：

```
[root@iZ2844brz0xZ ~]# sudo yum install cmake gcc-c++ ncurses-devel perl-Data-Dumper boost boost-doc boost-devel
```

### 编译安装

进入 `mysql` 目录：

```
[root@iZ2844brz0xZ ~]# cd mysql-5.7.18/
```

用 `cmake` 命令编译，代码如下，后面的均为配置数据：

```
[root@iZ2844brz0xZ ~]# cmake -DCMAKE_INSTALL_PREFIX=/home/mysql -DMYSQL_DATADIR=/home/mysql/data -DDEFAULT_CHARSET=utf8 -DDEFAULT_COLLATION=utf8_general_ci -DMYSQL_TCP_PORT=3306 -DMYSQL_USER=mysql -DWITH_MYISAM_STORAGE_ENGINE=1 -DWITH_INNOBASE_STORAGE_ENGINE=1 -DWITH_ARCHIVE_STORAGE_ENGINE=1 -DWITH_BLACKHOLE_STORAGE_ENGINE=1 -DWITH_MEMORY_STORAGE_ENGINE=1 -DDOWNLOAD_BOOST=1 -DWITH_BOOST=/usr/local/boost
```

`cmake` 命令结束后，使用 `make` 命令进行编译（过程有点慢）：

```
[root@iZ2844brz0xZ mysql-5.7.18]# make
```

`make` 编译完成后，用下面命令安装 **Mysql**：

```
[root@iZ2844brz0xZ mysql-5.7.18]# sudo make install
```

安装结束后，使用 `mysqld` 命令启动 **Mysql**：

```
[root@iZ2844brz0xZ mysql-5.7.18]# mysqld
```

启动后，使用 `mysql` 命令进入 **Mysql**：

```
[root@iZ2844brz0xZ mysql-5.7.18]# mysql
```

若显示：

```
mysql>
```

表明进入mysql，安装成功。

### 题外话
在这里特别提醒， 对于 **mysql5.7.8** 的 `make` 编译， 如果是阿里云 centos 主机 **512M** 内存的， 会在 `make` 编译到 **45%** 左右的时候会报错， 这是内存不足所致。

那么设置 2G 交换分区来用下：

```
[root@iZ2844brz0xZ /]# dd if=/dev/zero of=/swapfile bs=1k count=2048000 --获取要增加的2G的SWAP文件块（执行命令后需要等待一段时间）
[root@iZ2844brz0xZ /]# mkswap /swapfile     -- 创建SWAP文件
[root@iZ2844brz0xZ /]# swapon /swapfile     -- 激活SWAP文件
[root@iZ2844brz0xZ /]# swapon -s            -- 查看SWAP信息是否正确
[root@iZ2844brz0xZ /]# echo "/var/swapfile swap swap defaults 0 0" >> /etc/fstab     -- 添加到fstab文件中让系统引导时自动启动
```

注意，swapfile文件的路径在 `/var/` 下：

编译完后，如果不想要交换分区了，可以删除:

```
[root@iZ2844brz0xZ /]# swapoff /swapfile
[root@iZ2844brz0xZ /]# rm -fr /swapfile
```

实际操作：

```
[root@iZ2844brz0xZ /]# dd if=/dev/zero of=/swapfile bs=1k count=2048000
2048000+0 records in
2048000+0 records out
2097152000 bytes (2.1 GB) copied, 42.2248 s, 49.7 MB/s
[root@iZ2844brz0xZ /]# mkswap /swapfile
Setting up swapspace version 1, size = 2047996 KiB
no label, UUID=5f8de87f-9057-4bf7-af9d-a09e1be7de56
[root@iZ2844brz0xZ /]# swapon /swapfile
swapon: /swapfile: insecure permissions 0644, 0600 suggested.
[root@iZ2844brz0xZ /]# swapon -s
Filename				Type		Size	Used	Priority
/swapfile                              	file	2047996	0	-1
[root@iZ2844brz0xZ /]# echo "/var/swapfile swap swap defaults 0 0" >> /etc/fstab
[root@iZ2844brz0xZ /]#
```

> [参考资料](http://blog.csdn.net/cryhelyxx/article/details/47610247) *作者：zhuxiongxian*