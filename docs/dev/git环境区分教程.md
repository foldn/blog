## git环境区分
> git支持使用`includeIf` 按目录隔离配置方式来区分git账号，无需安装多个git，切换git
>

### 全局 `~/.gitconfig` 作为入口
编辑你的全局配置：

```plain
vim ~/.gitconfig
```

内容示例：

```plain
[user]
    name = foldn
    email = foldn2019@outlook.com

[includeIf "gitdir:/Users/foldn/Dev/work/"]
    path = ~/.gitconfig-work
```

⚠️ **路径一定要以 **`**/**`** 结尾**，否则不生效  
`gitdir:` 匹配的是 `.git` 所在路径
公司相关域名includeIf相关的配置一定要配置在全局gitconfig中，在gitconfig-work中只能在命令行生效，有些场景（如ide中）会失效

### 工作环境配置（`~/.gitconfig-work`）
```plain
[user]
    name = work1
    email = work1@company.com
```

### 验证是否生效（非常重要）
在不同目录下执行：

```plain
cd /Users/foldn/Dev/work/some-repo
git config user.email
```

```plain
cd /Users/foldn/Dev/person/some-repo
git config user.email
```

注意：验证时，必须当前目录是一个git项目，否则出来的结果是默认git配置

## ssh区分环境
### 生成两套 SSH Key
```plain
# 工作
ssh-keygen -t ed25519 -C "work" -f ~/.ssh/id_work

# 个人
ssh-keygen -t ed25519 -C "person" -f ~/.ssh/id_person
```

---

### 配置 `~/.ssh/config`
```plain
# 工作账号
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_work
    IdentitiesOnly yes

# 个人账号
Host gitlab.com
    HostName gitlab.com
    User git
    IdentityFile ~/.ssh/id_person
    IdentitiesOnly yes
```

---



### github/gitlab配置sshkey
### 打开**个人公钥**（注意是 `.pub`）
```plain
cat ~/.ssh/id_ed25519_person.pub
```

内容类似：

```plain
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... person
```

---

### 添加到 GitHub/Gitlab
路径是：

**GitHub → Settings → SSH and GPG keys → New SSH key**

+ **Title**：`Mac-person`
+ **Key type**：`Authentication Key`
+ **Key**：粘贴刚刚那一整行 `ssh-ed25519 ...`

保存即可。



### 仓库里用不同的 remote
#### 工作仓库
```plain
git remote set-url origin git@gitlab.com:company/repo.git
```

#### 个人仓库
```plain
git remote set-url origin git@github.com:foldn/repo.git
```

---

### 验证 SSH 身份
```plain
ssh -T git@github.com
ssh -T git@gitlab.com
```

看到不同 GitHub 用户名就对了 ✅

