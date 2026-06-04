# DevBlog — 个人技术博客

基于 **Next.js 16** + **Tailwind CSS v4** + **TypeScript** 构建的静态技术博客，专注于记录项目实现过程和技术细节。所有内容使用 Markdown 文件管理，无需数据库。

## 技术栈

| 技术 | 说明 |
|------|------|
| [Next.js 16](https://nextjs.org) | React 框架，App Router 模式，静态生成（SSG） |
| [Tailwind CSS v4](https://tailwindcss.com) | 原子化 CSS 框架，深色模式支持 |
| [TypeScript](https://www.typescriptlang.org) | 类型安全 |
| [gray-matter](https://github.com/jonschlinkert/gray-matter) | 解析 Markdown frontmatter 元数据 |
| [marked](https://github.com/markedjs/marked) | Markdown 转 HTML |
| [Vercel](https://vercel.com) | 一键部署，免费托管 |

## 项目结构

```
blog/
├── app/                          # Next.js App Router 页面目录
│   ├── globals.css               # 全局样式与 Tailwind 配置
│   ├── favicon.ico               # 网站图标
│   ├── layout.tsx                # 根布局组件（Header + Footer + Metadata）
│   ├── page.tsx                  # 首页 —— 博客文章列表
│   ├── posts/
│   │   └── [slug]/
│   │       └── page.tsx          # 文章详情页 —— 动态路由，展示完整文章内容
│   ├── tags/
│   │   ├── page.tsx              # 标签索引页 —— 展示所有标签及文章数量
│   │   └── [tag]/
│   │       └── page.tsx          # 标签筛选页 —— 按标签过滤文章列表
│   └── about/
│       └── page.tsx              # 关于页面 —— 博客介绍与使用说明
│
├── components/                   # 可复用组件
│   ├── Header.tsx                # 顶部导航栏，包含博客标题和导航链接
│   ├── Footer.tsx                # 页脚，显示版权信息和技术栈
│   ├── PostCard.tsx              # 文章卡片组件，展示标题、日期、描述和标签
│   └── MDXContent.tsx            # Markdown 渲染组件，将 MD 文本转为 HTML
│
├── content/
│   └── posts/                    # 📝 博客文章存放目录（Markdown/MDX 文件）
│       ├── hello-world.mdx       # 示例文章：博客介绍
│       └── docker-nextjs-deploy.mdx  # 示例文章：Docker 部署实践
│
├── lib/
│   └── posts.ts                  # 文章工具函数 —— 读取、解析、筛选文章和标签
│
├── public/                       # 静态资源（图片、字体等）
├── next.config.ts                # Next.js 配置文件
├── tsconfig.json                 # TypeScript 配置
├── eslint.config.mjs             # ESLint 代码规范配置
├── postcss.config.mjs            # PostCSS 配置（Tailwind CSS v4）
└── package.json                  # 项目依赖和脚本
```

## 各部分功能说明

### 页面

| 页面 | 路由 | 功能 |
|------|------|------|
| 首页 | `/` | 展示所有博客文章，按日期倒序排列，每篇文章以卡片形式呈现 |
| 文章详情 | `/posts/[slug]` | 渲染 Markdown 文章内容，显示标题、日期、描述、标签 |
| 标签索引 | `/tags` | 列出所有标签，每个标签显示对应文章数量 |
| 标签筛选 | `/tags/[tag]` | 展示具有指定标签的所有文章 |
| 关于页面 | `/about` | 博客介绍、内容说明和文章格式示例 |

### 组件

| 组件 | 功能 |
|------|------|
| `Header` | 粘性顶部导航栏，包含网站名称和 Home / Tags / About 链接，支持深色模式 |
| `Footer` | 底部版权信息和技术栈声明 |
| `PostCard` | 文章预览卡片，点击跳转到详情页，标签可点击跳转到标签筛选页 |
| `MDXContent` | 将 Markdown 文本转换为带样式的 HTML，使用 Tailwind Typography 的 prose 样式 |

### 工具函数（`lib/posts.ts`）

| 函数 | 功能 |
|------|------|
| `getAllPosts()` | 扫描 `content/posts/` 目录，解析所有文章的前置元数据，按日期倒序返回 |
| `getPostBySlug(slug)` | 根据文件名 slug 获取单篇文章的完整内容（元数据 + Markdown 正文） |
| `getAllTags()` | 统计所有标签及其出现次数，按数量降序排列 |
| `getPostsByTag(tag)` | 筛选具有指定标签的所有文章 |

## 快速开始

### 环境要求

- Node.js 22+（推荐使用 [nvm](https://github.com/nvm-sh/nvm) 管理版本）
- npm 10+

### 本地运行

```bash
# 1. 进入项目目录
cd blog

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

浏览器访问 http://localhost:3000 即可查看博客。开发服务器支持热更新，修改代码或文章后页面会自动刷新。

### 构建生产版本

```bash
npm run build    # 构建
npm start        # 启动生产服务器
```

## 如何写文章

### 创建新文章

在 `content/posts/` 目录下新建一个 `.md` 或 `.mdx` 文件，文件名为文章的 URL slug（例如 `my-project.md` 对应 `/posts/my-project`）。

### 文章格式

每篇文章由两部分组成：**frontmatter 元数据** + **Markdown 正文**。

```markdown
---
title: "文章标题"
date: "2026-06-04"
description: "文章的简短描述，会显示在首页卡片和 SEO 元数据中"
tags: [Next.js, React, 部署]
---

## 一级标题

这里是 Markdown 正文内容...

### 代码块

```typescript
const hello = "world";
```

> 引用文字

- 列表项
- 列表项
```

### frontmatter 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | ✅ | 文章标题 |
| `date` | ✅ | 发布日期，格式 `YYYY-MM-DD` |
| `description` | 推荐 | 文章摘要，用于首页卡片和 SEO |
| `tags` | 推荐 | 标签列表，用于分类筛选 |

### Markdown 支持

- ✅ 标题（H1-H6）
- ✅ 代码块（带语法高亮样式）
- ✅ 行内代码
- ✅ 引用块
- ✅ 有序/无序列表
- ✅ 加粗、斜体
- ✅ 链接和图片
- ✅ 表格

## 部署

### 部署到 Vercel（推荐）

已部署地址：**https://blog-opal-zeta-16.vercel.app**

重新部署：

```bash
# 使用 Vercel CLI（需要先安装）
npx vercel --prod

# 或使用项目内置的 Vercel CLI
./node_modules/.bin/vercel --prod
```

### 部署到其他平台

由于博客使用静态生成（SSG），可以部署到任何支持静态网站的托管服务：

```bash
# 修改 next.config.ts，添加静态导出配置
# output: "export"

npm run build
# 生成的静态文件在 out/ 目录中，可部署到 GitHub Pages、Cloudflare Pages 等
```

## 自定义

- **网站标题**：修改 `app/layout.tsx` 中的 `metadata.title`
- **关于页面**：编辑 `app/about/page.tsx`
- **主题颜色**：修改 `app/globals.css` 中的 CSS 变量 `--background` 和 `--foreground`
- **代码高亮主题**：修改 `components/MDXContent.tsx` 中的 prose 样式
- **每页文章数**：修改 `app/page.tsx` 中的 `POSTS_PER_PAGE` 变量
