# 文档自动生成脚本使用说明

## 功能介绍

该脚本会自动扫描 `docs` 目录结构，并生成：
1. **各一级目录的 `home.md` 文件** - 自动生成目录索引页面（仅在 interview、dev 等一级目录下）
2. **`config.mts` 中的 `sidebar` 配置** - 自动生成多层嵌套的侧边栏导航（最多支持6层）

### 主要特性

- ✅ **多层目录支持**：自动识别并展示多层嵌套的目录结构
- ✅ **递归扫描**：深度遍历所有子目录和文件
- ✅ **层级限制**：sidebar 最多展示6层，避免过深嵌套
- ✅ **智能过滤**：只显示包含文件的目录，自动忽略空目录

## 使用方法

在项目根目录运行：

```bash
npm run generate
```

## 生成示例

### 1. home.md 文件（支持多层嵌套）

对于 `/docs/interview/` 目录，会生成如下格式的 `home.md`：

```markdown
# 目录

1. java基础八股
2. mysql
3. redis
4. 事务
5. 消息队列
    - [bbb](./消息队列/bbb.md)
6. 算法
    - [最小路径和（DFS）](./算法/最小路径和（DFS）.md)
      1. 队列                           # 二级子目录
          - [字符串变序](./算法/队列/字符串变序.md)
7. 网络基础
    - [aaa](./网络基础/aaa.md)
```

**说明：**
- 一级目录直接显示为数字列表
- 每个目录下的文件显示为带链接的列表项
- 支持无限层级嵌套展示

### 2. sidebar 配置（最多6层嵌套）

自动在 `config.mts` 中生成多层嵌套的配置：

```typescript
sidebar: {
  '/interview/': [
    {
      items: [
        { text: '目录', link: '/interview/home' }
      ]
    },
    {
      text: '算法',
      collapsed: true,
      items: [
        {
          text: '最小路径和（DFS）',
          link: '/interview/算法/最小路径和（DFS）'
        },
        {
          text: '队列',              // 嵌套的二级目录
          collapsed: true,
          items: [
            {
              text: '字符串变序',
              link: '/interview/算法/队列/字符串变序'
            }
          ]
        }
      ]
    },
    {
      text: '消息队列',
      collapsed: true,
      items: [
        {
          text: 'bbb',
          link: '/interview/消息队列/bbb'
        }
      ]
    }
  ]
}
```

**说明：**
- 支持递归嵌套的 sidebar 结构
- 每个子目录都可以折叠/展开
- 最多支持6层嵌套（避免UI过于复杂）
- 空目录不会显示在 sidebar 中

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
- 对于超过6层的目录结构，sidebar 只显示前6层

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
- 递归遍历目录树，深度无限制
- 使用智能字符串解析准确定位并替换 sidebar 配置（处理嵌套的花括号）
- 自动处理路径和链接格式化
- **home.md 生成**：递归展示所有层级，使用缩进表示层级关系
- **sidebar 生成**：递归生成嵌套配置，通过 `currentLevel` 参数控制最大层级为6层
