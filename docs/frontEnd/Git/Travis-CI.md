# 使用 Travis CI 实现 GitHub + Server 自动部署

## Travis CI

[Travis CI](https://travis-ci.org/) 是一个提供**持续集成**（CI, Continuous Integration）服务的平台。其实我们用到的不是它提供的 CI 服务，而更多的是通过监听分支提交的动态，在集成成功后去执行我们自定义的部署逻辑。

::: tip 持续集成

持续集成是一种软件开发实践，即团队开发成员经常集成他们的工作，通过每个成员每天至少集成一次，也就意味着每天可能会发生多次集成。每次集成都通过自动化的构建（包括编译，发布，自动化测试）来验证，从而尽早地发现集成错误。 —— 百度百科

推荐阅读：[持续集成是什么？ - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2015/09/continuous-integration.html)

:::

## 思路

### 为什么

我们的项目写好后，想放到 GitHub 上，因为能够记录开发过程，同时也方便存储、回顾（当然也不仅仅这些）。如果需要上线项目，同时还需要构建好项目，上传至服务器。

一两次还好，但是每次都需要这样繁杂、冗余的操作肯定让人觉得太繁琐，也不够 Geek 😎。有没有一套更加完善的工作流能够简化我们的工作呢？

早就听闻过 [Travis CI](https://travis-ci.org/) 的鼎鼎大名，在操作的过程中学习，也把自己这次搭建持续集成的工作流记录下来。

### 怎么做

在做之前，我们需要一份纲要！但是网络上的教材比较的繁杂也不够系统，所以自己整理一套纲要。

这篇文件讲的主要是**持续集成到个人服务器**（因为网上到处都是部署到 Git Page 上的工作流，我就不赘述了）这里系统记录下如何使用 **Travis CI** 持续集成到个人服务器。

🤔 咱们来理一理思路：

1. 我们想要的是：上传到 GitHub 后，有一个工具能够拉取我们在 GitHub 上的内容，帮我们按照预置的操作进行构建，然后发布到我们自己的服务器上。

    这一步，我们需要使用一个工具能够监听我们在 GitHub 上的一些事件，如 `commit` 事件。监听到了以后，开始进行我们需要的操作，如「构建」和「发布」。

    这里我们使用的**工具**就是：**Travis CI**。

2. 为什莫要生成「密钥对」？

    > 因为我们需要让 **Travis CI** 帮我把操作好的文件复制到服务器上，或者直接登录服务器进行操作，但是 **Travis CI** 并不提供交互式的界面，我们不能直接输入密码，也不能把密码明文放置。
    > 
    > 一个方法是在 **Travis CI** 上配置密码的变量，在命令中用 `$VAR` 的格式去使用，另一个方法是使用「密钥对」让 **Travis CI** 免密登录。

    不让就会出现下面的结果，因为等待超时导致集成失败：

    ```bash
    $ cd docs/.vuepress/dist
    $ scp -o stricthostkeychecking=no -r ./* root@lbinin.com:/usr/local/nginx/html/blog.lbinin.com
    Warning: Permanently added 'lbinin.com,139.129.24.219' (ECDSA) to the list of known hosts.
    root@lbinin.com's password: 

    No output has been received in the last 10m0s, this potentially indicates a stalled build or something wrong with the build itself.
    Check the details on how to adjust your build configuration on: https://docs.travis-ci.com/user/common-build-problems/#Build-times-out-because-no-output-was-received

    The build has been terminated
    ```

### 流程梳理

所以，最终的流程就是：

1. 本地修改代码，提交到指定分支
2. Travis 监听仓库改变
3. Travis 执行 `install` 和 `script`任务（这里可以做一些安装测试构建任务的依赖和测试构建命令）
4. 任务执行成功后，在 Travis 的 `after_success` 钩子里面用 ssh 免密登陆服务器
5. 自动在服务器上执行配置的脚本或者复制到服务器上
6. 完成自动部署

## 开动

### 生成「密钥对」

「密钥对」可以在服务器上生成，也可以在本地生成，因为仅仅只是为了生成一对密钥，所以无所谓平台。下面以本地为例。

网上非常多直接生成默认密钥对 `id_rsa` 和 `id_rsa.pub` 的教程，但是一般来说我们本地上已经有了一个 GitHub 的密钥对，这里我们生成一个新的密钥对，并不需要覆盖以前的密钥对。

使用命令生成密钥对：

```bash
$ ssh-keygen -t rsa -C "yourmail@gmail.com" # 替换成你自己的邮箱
```

输入后，提示我们输入保存的地址和文件名

```bash
Generating public/private rsa key pair.
Enter file in which to save the key (/Users/bigno/.ssh/id_rsa): /Users/bigno/.ssh/id_rsa_blog # 可以命名
```

上面我们生成了一个名为 `id_rsa_blog` 的密钥对，可以在 `/Users/[你的用户名]/.ssh/` 下找到。

剩下两个直接回车，因为是配置使用密码的，我们可以不需要。

生成密钥对之后，我们需要将 `id_rsa_blog.pub` 里面的内容，复制到服务器的 `~/.ssh/authorized_keys` 文件里（没有的话自行创建即可）。

复制的方法很多，我这里就不赘述了。

#### 测试

在前面的 [思路 · 怎么做](#怎么做) 中说过，生成密钥对是为了让 Travis CI 不需要密码登录我们的服务器，我们这里也可以本地测试一下是否需要密码。

在 `/Users/[你的用户名]/.ssh/` 目录下创建一个名为 `config` 的文件：

```
# blog
  Host lbinin.com                 # 这里填你的 Host 或者 IP
  StrictHostKeyChecking no        # 为了禁用远程主机的公钥检查
  IdentityFile ~/.ssh/id_rsa_blog # 指定对应的密钥文件
```

然后使用 `ssh root@[你的域名或者 IP]` 命令连接远程服务器，不需要密码则表示成功。

### 仓库监控

首先，最主要的是你的 GitHub 上需要有你想要 CI 的项目，然后打开 [Travis CI](https://travis-ci.org/)，使用 GitHub 账户授权登录。

登录之后，点击**右上角头像**进入仓库列表，可以看到你在 GitHub 上的仓库，打开你想要 CI 的仓库后面的快开关即可，这样我们就完成了「仓库监控」。

### 编写配置文件

接下来，我们需要编写配置文件告诉 Travis CI 我们要做什么。

首先在**项目根目录**下创建 `.travis.yml` 文件，先写上我们项目的语言和环境：

```yml
language: node_js
node_js: stable
```

然后，使用**命令行工具进入到项目的根目录**，安装并使用 `Travis` 命令行工具：

关于 Homebrew 的使用，见 [Homebrew 🍺](/tools/Mac/brew.html)

❗️注意，以下命令均需在项目根目录下执行

```bash
$ brew install travis # 我这里使用 brew 进行安装
$ travis login --auto # --auto 自动登录 github 帐号
$ travis encrypt-file ~/.ssh/id_rsa_blog --add # 此处的 --add 参数表示自动添加并加密脚本(记得修改路径)到 .travis.yml 文件中
```

运行后：

```bash
➜ blog git:(master) travis login --auto                         
Successfully logged in as LBinin!

➜ blog git:(master) travis encrypt-file ~/.ssh/id_rsa_blog --add

Make sure to add id_rsa_blog.enc to the git repository.
Make sure not to add /Users/bigno/.ssh/id_rsa_blog to the git repository.
Commit all changes to your .travis.yml.
```

上面说的很清楚：

::: warning 提示
- **务必**把项目根目录下 `id_rsa_blog.enc` 一起上传到你的 Git 仓库中；
- **不要**把本地的 `id_rsa_blog` 文件上传到你的 Git 仓库中；
- 把 `.travis.yml` 文件里的所有更改一起上传。
:::

运行完你会发现 `.travis.yml` 里，在 `before_install` 周期中自动多了下面几行代码：

```yml
before_install:
- openssl aes-256-cbc -K $encrypted_a2c824ace63e_key -iv $encrypted_a2c824ace63e_iv
  -in id_rsa_blog.enc -out ~\/.ssh/id_rsa_blog -d
```

同时你也会发现在 Travis CI 网址上的对应项目的 `Setting` 里面，多了两个参数。

::: warning 修改
为了避免后续阶段出现问题，我们把上面内容中的转义符 `\` 去掉。
:::

接下来为了保证命令顺利运行，我们加上如下代码：

```yml
before_install:
- openssl aes-256-cbc -K $encrypted_a2c824ace63e_key -iv $encrypted_a2c824ace63e_iv
  -in id_rsa_blog.enc -out ~\/.ssh/id_rsa_blog -d
- chmod 600 ~/.ssh/id_rsa
- echo -e "Host 主机IP地址\n\tStrictHostKeyChecking no\n\tIdentityFile ~/.ssh/id_rsa_blog" >> ~/.ssh/config
```

与其他教程不同，我在输出到 `config` 文件中的命令里加上了 `\tIdentityFile ~/.ssh/id_rsa_blog`，以指定使用的密钥。

然后在 `after_success` 周期中加上 `- scp -o stricthostkeychecking=no -r 要上传的文件或目录 用户@域名或IP:/路径`，如果修改过端口的，可以配合 Travis CI 使用 `- scp -o stricthostkeychecking=no -P $PORT -r 要上传的文件或目录 用户@域名或IP:/路径`。

上面都是必需的步骤，你可以根据自己的项目进行配置。

如，我的项目是 `vuepress`，需要安装 `vuepress` 和构建，最终的 `.travis.yml` 如下：

```yml
language: node_js
node_js: stable
before_install:
- openssl aes-256-cbc -K $encrypted_a2c824ace63e_key -iv $encrypted_a2c824ace63e_iv
  -in id_rsa_blog.enc -out ~/.ssh/id_rsa_blog -d
- chmod 600 ~/.ssh/id_rsa_blog
- echo -e "Host lbinin.com\n\tStrictHostKeyChecking no\n\tIdentityFile ~/.ssh/id_rsa_blog" >> ~/.ssh/config
- yarn global add vuepress
addons:
  ssh_known_hosts: lbinin.com
install:
- yarn install
script:
- yarn docs:build
after_success:
- cd docs/.vuepress/dist
- scp -o stricthostkeychecking=no -r ./* root@lbinin.com:/usr/local/nginx/html/blog.lbinin.com
```

关于 Travis CI 的具体工作流程，见：[持续集成服务 Travis CI 教程 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2017/12/travis_ci_tutorial.html)

### 测试

这时候，我们可以通过 `git add . && git commit -m "commit" && git push` 大法发布一个 `commit`。

如果在 Travis 上能够看到 `Job log` 输出内容，就表明你成功啦~ 恭喜恭喜 🎉
 
## 参考资料

> [git配置多个SSH Key - 歪麦博客](https://www.awaimai.com/2200.html)
> 
> [使用 Travis 将 GitHub 文件上传传至服务器 - SegmentFault 思否](https://segmentfault.com/a/1190000009093621)
> 
> [持续集成服务 Travis CI 教程 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2017/12/travis_ci_tutorial.html)
> 
> [World Hello - 禁用 SSH 远程主机的公钥检查](http://www.worldhello.net/2010/04/08/1026.html)
> 
> [通过travis部署代码到远程服务器 - 我仅仅是一个Coder - CSDN博客](https://blog.csdn.net/qq8427003/article/details/64921238)
> 
> [Travis-CI 自动化测试并部署至自己的 CentOS 服务器 - 掘金](https://juejin.im/post/5a9e1a5751882555712bd8e1)
> 
> [开箱即用，Hexo 博客的 github + server 自动部署 - 掘金](https://juejin.im/post/5b0a4a8ff265da0de1011f9d)