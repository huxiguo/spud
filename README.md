# spud

基于 pnpm workspace 的全栈 monorepo 基础模板，开箱即用的 NestJS 后端 + Vue 3 前端 + 共享类型包。

## 技术栈

| 层级       | 技术                                                  | 说明                                            |
| ---------- | ----------------------------------------------------- | ----------------------------------------------- |
| **API**    | NestJS, Prisma, JWT, MySQL                            | 企业级 Node.js 框架，模块化架构，依赖注入       |
| **Web**    | Vue 3, Vite, TailwindCSS v4, alova, Pinia, shadcn-vue | 现代 SPA，原子化 CSS，声明式请求管理            |
| **共享**   | TypeScript + tsdown                                   | `packages/dto` 前后端共享类型，保证接口契约一致 |
| **工具链** | pnpm, oxlint, oxfmt, TypeScript                       | 高性能包管理 + Rust 工具链                      |

## 项目结构

```
spud/
├── apps/
│   ├── api/          # NestJS 后端服务
│   └── web/          # Vue 3 前端 SPA
├── packages/
│   └── dto/          # 前后端共享的 DTO 类型定义
├── pnpm-workspace.yaml
└── package.json
```

- `apps/api` — 提供 REST API，JWT 认证，Prisma + MySQL 数据层
- `apps/web` — SPA 前端，alova 请求管理，Pinia 状态管理，TailwindCSS v4 样式
- `packages/dto` — 共享的请求/响应类型，前后端通过 `@spud/dto` 引用，保证接口契约一致

## 快速开始

### 前置要求

| 工具    | 版本        |
| ------- | ----------- |
| Node.js | `>=22.22.3` |
| pnpm    | `^11.5.2`   |

### 1. 安装依赖

```bash
pnpm install
```

### 2. 生成 Prisma Client

```bash
pnpm api-prisma:generate
```

### 3. 配置环境变量

参考 `apps/api/src/config/configuration.ts` 修改数据库连接等信息（可通过环境变量覆盖）。

### 4. 启动开发服务器

```bash
pnpm dev
```

## 常用命令

```bash
# 开发
pnpm dev                       # 构建 packages 并启动所有 app

# 构建
pnpm build:web                 # 构建前端
pnpm build:api                 # 构建后端
pnpm build:packages            # 构建共享包

# 代码质量
pnpm lint                      # 代码检查
pnpm fmt                       # 代码格式化

```

## NestJS 中 oxlint / oxfmt 配置说明

`apps/api` 使用 `.oxlintrc.json` 和 `.oxfmtrc.json` 不使用 oxfmt.config.ts 原因

NestJS 项目中 `package.json` 未声明 `"type": "module"`，Node.js 在加载 `.ts` 配置文件时无法确定模块类型，会触发 `Module type of ... is not specified... Reparsing as ES module because module syntax was detected` 警告。避免该警告，保持输出干净。

# 小程序版本在 mini-app 分支
