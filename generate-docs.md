# 文档自动生成脚本使用说明

## 功能介绍

该脚本会自动扫描 `docs` 目录结构，并生成：
1. **各目录的 `home.md` 文件** - 自动生成目录索引页面
2. **`config.mts` 中的 `sidebar` 配置** - 自动生成侧边栏导航

## 使用方法

在项目根目录运行：

```bash
npm run generate
```

## 生成示例

### 1. home.md 文件

对于 `/docs/interview/` 目录，会生成如下格式的 `home.md`：

```markdown
# 目录

1. java基础八股
2. mysql
3. redis
4. 事务
5. 消息队列
6. 算法
    - [最小路径和（DFS）](./算法/最小路径和（DFS）.md)
7. 网络基础
```

### 2. sidebar 配置

自动在 `config.mts` 中生成：

```typescript
sidebar: {
  '/dev/': [
    {
      items: [
        { text: '目录', link: '/dev/home' }
      ]
    },
    {
      text: '其他',
      collapsed: false,
      items: [
        { text: 'jerbrains破解', link: '/dev/jerbrains破解' }
      ]
    }
  ],
  '/interview/': [
    // ... 自动生成的配置
  ]
}
```

## 排除规则

脚本会自动跳过以下内容：

**排除的目录：**
- `.vitepress`
- `node_modules`
- `.git`
- `dist`
- `cache`

**排除的文件：**
- `home.md` (避免重复生成)
- `index.md` (避免冲突)

## 文件说明

- **脚本文件：** `generate-docs.js`
- **配置文件：** `docs/.vitepress/config.mts`
- **生成位置：** 各目录的 `home.md` 文件

## 工作流程

1. 在 `docs` 目录下创建/修改 markdown 文件
2. 运行 `npm run generate` 自动生成配置
3. 运行 `npm run docs:dev` 预览效果
4. 如需要可手动微调生成的内容

## 注意事项

⚠️ **重要提示：**
- 脚本会**覆盖**现有的 `home.md` 文件
- 脚本会**替换** `config.mts` 中的整个 `sidebar` 配置
- 建议在运行前先提交 Git 更改，以便回滚

## 自定义需求

如果你想保留某些手动编写的内容，建议：
1. 先运行脚本生成基础结构
2. 然后手动添加特殊配置
3. 或修改 `generate-docs.js` 脚本以满足特殊需求

## 技术实现

### 脚本主要功能模块

1. **目录扫描** - 递归扫描 `docs` 目录，构建文件树结构
2. **home.md 生成** - 根据目录结构生成格式化的目录页面
3. **sidebar 生成** - 将目录结构转换为 VitePress sidebar 配置格式
4. **配置更新** - 智能替换 `config.mts` 中的 sidebar 部分，保留其他配置

### 核心逻辑

- 使用 Node.js 的 `fs` 模块进行文件系统操作
- 递归遍历目录树
- 使用正则表达式和字符串解析准确定位并替换 sidebar 配置
- 自动处理路径和链接格式化
