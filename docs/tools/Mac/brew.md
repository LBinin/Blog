# Homebrew 🍺

官网：[The missing package manager for macOS — The missing package manager for macOS](https://brew.sh/)

## 安装

```bash
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

## 使用

在使用前最好使用 `brew update` 和 `brew doctor` 去检查一下 `brew` 存在的问题：

```bash
$ brew update
$ brew doctor
```

## 换源

- 中科大

    [替换及重置Homebrew默认源 LUG@USTC](https://lug.ustc.edu.cn/wiki/mirrors/help/brew.git)

    [Homebrew Bottles源 LUG@USTC](https://lug.ustc.edu.cn/wiki/mirrors/help/homebrew-bottles)

- 清华

    [Homebrew | 镜像站使用帮助 | 清华大学开源软件镜像站 | Tsinghua Open Source Mirror](https://mirror.tuna.tsinghua.edu.cn/help/homebrew/)

    [Homebrew Bottles | 镜像站使用帮助 | 清华大学开源软件镜像站 | Tsinghua Open Source Mirror](https://mirrors.tuna.tsinghua.edu.cn/help/homebrew-bottles/)

### 常用命令

```bash
# 搜索包
brew search mysql

# 安装包
brew install mysql

# 查看包信息，比如目前的版本，依赖，安装后注意事项等
brew info mysql

# 卸载包
brew uninstall wget

# 显示已安装的包
brew list

# 查看brew的帮助
brew –help

# 更新， 这会更新 Homebrew 自己
brew update

# 检查过时（是否有新版本），这会列出所有安装的包里，哪些可以升级
brew outdated
brew outdated mysql

# 升级所有可以升级的软件们
brew upgrade
brew upgrade mysql

# 清理不需要的版本极其安装包缓存
brew cleanup
brew cleanup mysql
```

## 安装软件

Homebrew 是一个包管理器，用于安装 Apple 没有预装但你需要的 UNIX 工具（比如著名的wget）。

Homebrew 会将软件包安装到独立目录 `(/usr/local/Cellar)`，并将其文件软链接至 `/usr/local`。

Homebrew 不会将文件安装到它本身目录之外，所以可将 Homebrew 安装到任意位置。

## 常见问题

### 关闭自动更新

运行如下命令即可：

```bash
$ export HOMEBREW_NO_AUTO_UPDATE=true
```

但是想要一劳永逸，需要在 `~/.zshrc` 或者 `~/.bash_profile` 中添加如下内容

```bash
# brew 不自动更新
export HOMEBREW_NO_AUTO_UPDATE=true
```

保存退出后记得 `source ~/.zshrc` 或者 `source ~/.bash_profile`。

### xcode-select install 失败

如果遇到 `xcode-select install` 失败，可以前往 [Apple Developer](https://developer.apple.com/download/more/) 下载对应 Mac OS 版本的 `Command Line Tools`。

然后执行 `sudo xcode-select --switch /Library/Developer/CommandLineTools # 指定路径` 就好了。

## 卸载 Homebrew

```bash
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/uninstall)"
```

## 参考资料

> [Mac下Homebrew的安装与使用 - 简书](https://www.jianshu.com/p/bca8fc1ff3f0)
>
> [xcode-select —install 解决方案 - lucky9322的专栏 - CSDN博客](https://blog.csdn.net/lucky9322/article/details/79036877)
>
> [在 Mac 上使用 Git 一定要安装 Xcode 吗? - 知乎](https://www.zhihu.com/question/37165801)