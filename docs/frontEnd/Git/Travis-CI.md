# 使用 Travis CI 实现 GitHub + Server 自动部署

## Travis CI

[Travis CI](https://travis-ci.org/first_sync) 是一个提供**持续集成**（CI, Continuous Integration）服务的平台。其实我们用到的不是它提供的 CI 服务，而更多的是通过监听分支提交的动态，在集成成功后去执行我们自定义的部署逻辑。

::: tip 持续集成

持续集成是一种软件开发实践，即团队开发成员经常集成他们的工作，通过每个成员每天至少集成一次，也就意味着每天可能会发生多次集成。每次集成都通过自动化的构建（包括编译，发布，自动化测试）来验证，从而尽早地发现集成错误。 —— 百度百科

推荐阅读：[持续集成是什么？ - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2015/09/continuous-integration.html)

:::

```bash
$ travis login --auto                         
Successfully logged in as LBinin!

$ travis encrypt-file ~/.ssh/id_rsa_blog --add

Make sure to add id_rsa_blog.enc to the git repository.
Make sure not to add /Users/bigno/.ssh/id_rsa_blog to the git repository.
Commit all changes to your .travis.yml.
```
 
## 参考资料
> [持续集成服务 Travis CI 教程 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2017/12/travis_ci_tutorial.html)
> 
> [Travis-CI 自动化测试并部署至自己的 CentOS 服务器 - 掘金](https://juejin.im/post/5a9e1a5751882555712bd8e1)
> 
> [开箱即用，Hexo 博客的 github + server 自动部署 - 掘金](https://juejin.im/post/5b0a4a8ff265da0de1011f9d)
> 
> [使用 Travis 将 GitHub 文件上传传至服务器 - SegmentFault 思否](https://segmentfault.com/a/1190000009093621)