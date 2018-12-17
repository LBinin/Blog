# 服务器配置 —— 安装 vsftpd 及配置

## 安装

用 `yum` 安装我们需要的 `vsftpd`：

```bash
[root@iZ2844brz0xZ ~]# sudo yum install vsftpd
```

## 配置

安装完成后可以找到 `/etc/vsftpd/vsftpd.conf` ，这就是vsftp的配置文件。

接下来我们需要添加一个ftp用户，这个用户就是用来登录ftp服务器用的。`useradd` 后的用户名可以自定义：

```bash
[root@iZ2844brz0xZ vsftpd]# useradd linbin
```

添加完用户后，给该用户添加密码：

```bash
[root@iZ2844brz0xZ vsftpd]# passwd linbin
```

接下来输入两次密码以确认。提示 `passwd: all authentication tokens updated successfully.` 设置密码成功。

## 启动

接下启动 `vsftpd`服务：

```bash
[root@iZ2844brz0xZ vsftpd]#service vsftpd start
```

接下来就可以在 FileZilla 中用 ftp 用户登录我们的服务器啦~


修改用户默认目录：

```bash
[root@iZ2844brz0xZ vsftpd]# vim /etc/passwd
```

找到你的用户名你一行，修改路径，然后保存即可（这里 `passwd` 文件也可以更改用户权限）

## vsftpd 操作命令：

```bash
[root@iZ2844brz0xZ vsftpd]#service vsftpd start    --启动ftp命令
[root@iZ2844brz0xZ vsftpd]#service vsftpd stop     --停止ftp命令
[root@iZ2844brz0xZ vsftpd]#service vsftpd restart  --重启ftp命令
```

| 路径                        | 文件                                                                                                                                                                                                                                                     |
| :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/etc/vsftpd/vsftpd.conf`     | 主配置文件                                                                                                                                                                                                                                               |
| `/usr/sbin/vsftpd`            | Vsftpd的主程序                                                                                                                                                                                                                                           |
| `/etc/rc.d/init.d/vsftpd`     | 启动脚本                                                                                                                                                                                                                                                 |
| `/etc/pam.d/vsftpd`           | PAM认证文件（此文件中file=/etc/vsftpd/ftpusers字段，指明阻止访问的用户来自/etc/vsftpd/ftpusers文件中的用户）                                                                                                                                             |
| `/etc/vsftpd/ftpusers`        | 禁止使用vsftpd的用户列表文件。记录不允许访问FTP服务器的用户名单，管理员可以把一些对系统安全有威胁的用户账号记录在此文件中，以免用户从FTP登录后获得大于上传下载操作的权利，而对系统造成损坏。（注意：linux-4中此文件在/etc/目录下）                       |
| `/etc/vsftpd/user_list`       | 禁止或允许使用vsftpd的用户列表文件。这个文件中指定的用户缺省情况（即在/etc/vsftpd/vsftpd.conf中设置userlist_deny=YES）下也不能访问FTP服务器，在设置了userlist_deny=NO时,仅允许user_list中指定的用户访问FTP服务器。（注意：linux-4中此文件在/etc/目录下） |
| `/var/ftp`                    | 匿名用户主目录；本地用户主目录为：/home/用户主目录，即登录后进入自己家目录                                                                                                                                                                               |
| `/var/ftp/pub`                | 匿名用户的下载目录，此目录需赋权根chmod 1777 pub（1为特殊权限，使上载后无法删除）                                                                                                                                                                        |
| `/etc/logrotate.d/vsftpd.log` | Vsftpd的日志文件                                                                                                                                                                                                                                         |

> [vsftpd入门——安装、配置、案例与常见问题](http://os.51cto.com/art/201008/222036.htm )