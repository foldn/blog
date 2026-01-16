# 文档站点

基于 VitePress 构建的个人文档知识库，包含面试笔记、开发资料等内容。

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 生成文档配置（可选）

自动扫描 `docs` 目录并生成目录索引和侧边栏配置：

```bash
npm run generate
```

### 3. 启动开发服务器

```bash
npm run docs:dev
```

访问 `http://localhost:5173` 查看文档站点。

## 部署

### 构建生产版本

```bash
npm run docs:build
```

构建产物将生成在 `docs/.vitepress/dist` 目录。

### 本地预览构建结果

```bash
npm run docs:preview
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run generate` | 自动生成文档目录和侧边栏配置 |
| `npm run docs:dev` | 启动开发服务器（热更新） |
| `npm run docs:build` | 构建生产版本 |
| `npm run docs:preview` | 预览构建后的站点 |
