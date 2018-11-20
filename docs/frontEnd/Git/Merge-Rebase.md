# merge 和 rebase 区别

## merge

merge 是将共同的祖先、两个分支的最新 commit，进行一个三方合并。

只有在冲突的时候，解决完冲突才会自动产生一个 commit。因为默认是 fast-forward。如果想提交一个 commit 以记录此次 merge 可以使用 `git merge —no-ff` 命令。

如果不加 `--no-ff`，则被合并的分支之前的 commit 都会被抹去，只会保留一个解决冲突后的 merge commit，因为是进行了一次三方和并。

## rebase

提取当前分支的最新提交，「移动」到目标分支的最新提交之后，这个操作将会丢弃当前分支已提交的 commit，生成新的 commit。

## 选择 merge 还是 rebase？

- merge 是一个合并操作，会将两个分支的修改合并在一起，默认操作的情况下会提交合并中修改的内容
merge 的提交历史忠实地记录了**实际发生过什么操作**，关注点在真实的提交历史上面
- rebase 并没有进行合并操作，只是提取了当前分支的修改，将其复制在了目标分支的最新提交后面
rebase 的提交历史反映了**项目过程中发生了什么**，关注点在开发过程上面

merge 与 rebase 都是非常强大的分支整合命令，没有优劣之分，使用哪一个应由项目和团队的开发需求决定

## 参考资料

> [闲谈 git merge 与 git rebase 的区别 - 简书](https://www.jianshu.com/p/c17472d704a0)