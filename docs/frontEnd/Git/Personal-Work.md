# 个人工作常用 Git 操作

## 上传到分支

```bash
git push —set-upstream origin branch_name
```

## 从主线拉取

```bash
git pull origin master
```

## 拉取远程分支（本地无此分支）

```bash
git branch -r # 查看所有远程分支
git checkout -b 本地分支名 origin/远程分支名
```

或者

```bash
git fetch origin 远程分支名:本地分支名
```

## 提交本地 test1 分支作为远程的 test2 分支

```bash
git push origin test1:test2
```

## 复制分支

```bash
git checkout -b new_branch old_branch
```

## 回滚

```bash
git reset --hard 版本号
```

## 删除本地分支

```bash
git branch -D 分支名称
```

## 强制提交

```bash
git push -f [origin master]
```

## 变基

```bash
git rebase master
```

记得在分支上去 rebase Master 上的内容