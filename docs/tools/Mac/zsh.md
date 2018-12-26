# ZSH 🖥

zsh 是 shell 语言类型，兼容bash，提供强大的命令行功能，比如 tab 补全，自动纠错功能等。

一般 Mac 自带 zsh，只是默认使用的是 bash。

可以查看系统自带哪些shell

```bash
$ cat /etc/shells
```

## 安装

没有的话也可以自行安装：

```bash
$ brew install zsh
```

## 设为默认 shell

```bash
# 在 /etc/shells 文件中加入如下一行
/usr/local/bin/zsh
# 接着运行
chsh -s /usr/local/bin/zsh
```

然后重启 shell，可以通过 `echo $SHELL` 查看当前默认的 shell。

## oh-my-zsh

zsh 虽然强大，但是也有缺点，就是配置太麻烦，好在有一个叫做 `oh-my-zsh` 的开源项目，很好的弥补了这一缺陷。

`oh my zsh` 是一个开源的、社区驱动的框架，用来管理 zsh 配置。它的出现，让 zsh 的配置尤为简单！

官方 Wiki：[Wiki](https://github.com/robbyrussell/oh-my-zsh/wiki)

### 安装

```bash
$ sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

## 快捷命令

### d

输入 `d` 回车，你可以看到你曾经去过的目录，然后输入对应的序号，回车，即可跳转到对应目录。

### r

执行上一条命令。

### ctrl + r

可以**模糊搜索**你输入过的命令并放置到命令行中。

### take

后面跟上目录名，即可新建目录并进入。

```bash
take hello # 等于 mkdir -p hello && cd hello
```

## 自定义命令别名

在 `~/.zshrc` 文件下添加如下格式：

```bash
alias ns="npm start"
alias ys="yarn start"
```

保存后记得 `source ~/.zshrc` 即可使用~

你可以使用 `alias` 查看当前所有别名列表。

## 插件

官方插件集合：[Plugins · wiki](https://github.com/robbyrussell/oh-my-zsh/wiki/Plugins)

### autojump

> 它允许你可以直接跳转到你喜爱的目录，而不用管你现在身在何处。

GitHub: [autojump](https://github.com/wting/autojump)

#### 安装

```bash
$ brew install autojump
```

#### 配置

安装完不能直接使用，否则会报以下错误：

```bash
Please source the correct autojump file in your shell's
startup file. For more information, please reinstall autojump
and read the post installation instructions.
```

需要在 `~/.zshrc` 中 `plugins=(git)` 修改为 `plugins=(git autojump)`；

然后再添加一行 `[[ -s ~/.autojump/etc/profile.d/autojump.sh ]] && . ~/.autojump/etc/profile.d/autojump.sh`。

最后不要忘了 `source ~/.zshrc`。

接下来我们就可以用 `autojump [目录名称]` 或者 `j [目录名称]` 进行快速目录跳转。

`j --stat`：可以查看历史路径库

### zsh-autosuggestions

> `zsh-autosuggestions` 能够在输入时，实时显示你曾经使用的类似命令，并将其补全。

GitHub: [zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions)

#### 安装

```bash
$ git clone git://github.com/zsh-users/zsh-autosuggestions $ZSH_CUSTOM/plugins/zsh-autosuggestions
```

#### 配置

在 `~/.zshrc` 中配置：

```bash
plugins=(其他的插件 zsh-autosuggestions)
```

最后 `source ~/.zshrc`，即可使用。

输入命令后需要使用 `ctrl + e` 补全命令。

### git-open

> `git-open` 可以在 git 项目下，在浏览器上打开远程仓库浏览项目。

GitHub: [git-open](https://github.com/paulirish/git-open)

#### 安装

```bash
$ git clone https://github.com/paulirish/git-open.git $ZSH_CUSTOM/plugins/git-open
```

#### 配置

在 `~/.zshrc` 中配置：

```bash
plugins=(其他的插件 git-open)
```

最后 `source ~/.zshrc`，即可使用。

### zsh-syntax-highlighting

> 命令语法高亮

GitHub: [zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting)

#### 安装

```bash
$ git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```

#### 配置

在 `~/.zshrc` 中配置：

```bash
plugins=(其他的插件 zsh-syntax-highlighting)
```

最后 `source ~/.zshrc`，即可使用。

### sudo

> 连按两次为当前命令添加 `sudo`，如果当前命令行为空则添加上一条命令。

无需安装，zsh 自带 plugin，但是未开启，需要在 `~/.zshrc` 中添加 `plugins=(其他的插件 sudo)`，最后 `source ~/.zshrc`，即可使用。

### bat

> 可以代替 cat 的牛逼哄哄的文件查看工具！

#### Mac

```bash
$ brew install bat
```

#### CentOS

进入 [https://github.com/sharkdp/bat/releases](https://github.com/sharkdp/bat/releases)，下载 `bat-v*-x86_64-unknown-linux-musl.tar.gz` 版本，后自行编译。

```bash
$ wget -O bat.zip https://github.com/sharkdp/bat/releases/download/v0.9.0/bat-v0.9.0-x86_64-unknown-linux-musl.tar.gz

$ tar -xvzf bat.zip -C /usr/local

$ cd /usr/local && mv bat-v0.9.0-x86_64-unknown-linux-musl bat
```

然后在 `~/.zshrc` 添加 Alias：

```bash
alias bat="/usr/local/bat/bat"
```

记得 `source` 一下~

参考：[how to install on CentOS 7? · Issue #325 · sharkdp/bat · GitHub](https://github.com/sharkdp/bat/issues/325#issuecomment-425630261)

## 参看资料

> [zsh+on-my-zsh配置教程指南（程序员必备） - Michael翔的IT私房菜 - SegmentFault 思否](https://segmentfault.com/a/1190000013612471)
>
> [技术|自动补完不算什么，一键直达目录才是终极神器！](https://linux.cn/article-3401-1.html)
>
> [zsh 全程指南 | 小土刀](https://wdxtub.com/2016/02/18/oh-my-zsh/)
>
> [那些我希望在一开始使用 Zsh(oh-my-zsh) 时就知道的 - Xavier’s blog - SegmentFault 思否](https://segmentfault.com/a/1190000002658335)