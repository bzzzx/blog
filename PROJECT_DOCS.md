# DevBlog — 项目技术文档

> 基于 Next.js 16 + Tailwind CSS v4 + TypeScript 的个人技术博客，支持 Markdown 文章管理、分类标签系统、自定义后台编辑器和 Vercel 一键部署。

---

## 目录

1. [项目概览](#项目概览)
2. [技术栈](#技术栈)
3. [项目架构](#项目架构)
4. [目录结构与文件说明](#目录结构与文件说明)
5. [核心实现](#核心实现)
   - [5.1 文章内容系统](#51-文章内容系统)
   - [5.2 Markdown 渲染](#52-markdown-渲染)
   - [5.3 自定义管理后台](#53-自定义管理后台)
   - [5.4 GitHub API 集成](#54-github-api-集成)
   - [5.5 分类与标签系统](#55-分类与标签系统)
   - [5.6 配色与视觉设计](#56-配色与视觉设计)
   - [5.7 OAuth 认证（备用）](#57-oauth-认证备用)
6. [页面路由表](#页面路由表)
7. [组件清单](#组件清单)
8. [API 路由](#api-路由)
9. [环境变量](#环境变量)
10. [部署流程](#部署流程)
11. [使用指南](#使用指南)

---

## 项目概览

DevBlog 是一个纯静态生成的个人技术博客，所有文章以 Markdown/MDX 文件形式存储在 `content/posts/` 目录中。博客提供自定义 web 管理后台，通过 GitHub API 实现在线创建和编辑文章，无需数据库。

### 核心特性

- **纯静态生成 (SSG)**：构建时预渲染所有页面，加载极快
- **自定义管理后台**：密码保护的后台，支持创建/编辑/删除文章
- **分类系统**：文章按分类组织（随想、代码版本更新、项目实现等）
- **标签系统**：灵活的文章标签，支持按标签筛选
- **深色模式**：自动适配系统主题
- **响应式设计**：适配桌面和移动端
- **Vercel 部署**：一键部署，自动 HTTPS

---

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| [Next.js](https://nextjs.org) | 16.2.7 | React 框架，App Router 模式 |
| [React](https://react.dev) | 19.2.4 | UI 框架 |
| [TypeScript](https://www.typescriptlang.org) | 5.x | 类型安全 |
| [Tailwind CSS](https://tailwindcss.com) | v4 | 原子化 CSS 框架 |
| [gray-matter](https://github.com/jonschlinkert/gray-matter) | latest | Frontmatter 元数据解析 |
| [marked](https://github.com/markedjs/marked) | latest | Markdown → HTML 转换 |
| [Vercel](https://vercel.com) | — | 部署托管平台 |
| [GitHub REST API](https://docs.github.com/en/rest) | v3 | 后台文章 CRUD |

---

## 项目架构

```
┌──────────────────────────────────────────────┐
│                  浏览器                       │
├──────────────┬───────────────────────────────┤
│  访客端 /     │  管理端 /admin                 │
│  • 首页       │  • 登录 → 仪表盘               │
│  • 文章详情   │  • 文章管理 (CRUD)             │
│  • 分类/标签  │  • Markdown 编辑器             │
│  • 关于页面   │                               │
├──────────────┴───────────────────────────────┤
│              Next.js 16 App Router            │
├──────────────┬───────────────────────────────┤
│  静态页面     │  API 路由 (Serverless)         │
│  SSG 预渲染   │  /api/admin/posts             │
│              │  /api/admin/login              │
│              │  /api/auth (OAuth)             │
├──────────────┴───────────────────────────────┤
│           数据层                              │
├──────────────┬───────────────────────────────┤
│  本地构建     │  运行时                         │
│  fs +        │  GitHub REST API               │
│  gray-matter │  (octokit/fetch)               │
│  (静态生成)   │  (管理后台读写)                  │
└──────────────┴───────────────────────────────┘
```

**两种数据流：**

1. **访客端**：构建时通过 Node.js `fs` 读取本地 `content/posts/*.mdx` → `gray-matter` 解析 frontmatter → 静态生成 HTML
2. **管理端**：浏览器 → Next.js API Route → GitHub REST API → 提交 Markdown 文件到仓库 → Vercel 检测变更 → 自动重新部署

---

## 目录结构与文件说明

```
blog/
├── app/                              # Next.js App Router 根目录
│   ├── globals.css                   # 全局样式、CSS 变量、主题色定义
│   ├── layout.tsx                    # 根布局（Header + Footer + Metadata）
│   ├── page.tsx                      # 首页（Hero 区 + 文章列表）
│   ├── about/
│   │   └── page.tsx                  # 关于页面
│   ├── admin/                        # 管理后台
│   │   ├── layout.tsx                # 后台布局（无 Header/Footer）
│   │   ├── page.tsx                  # 登录页 / 仪表盘
│   │   └── posts/
│   │       ├── page.tsx              # 文章管理列表
│   │       ├── new/
│   │       │   └── page.tsx          # 新建文章编辑器
│   │       └── [slug]/
│   │           └── edit/
│   │               └── page.tsx      # 编辑已有文章
│   ├── api/
│   │   ├── admin/
│   │   │   ├── login/route.ts        # POST /api/admin/login
│   │   │   └── posts/route.ts        # GET/POST/DELETE /api/admin/posts
│   │   └── auth/
│   │       ├── route.ts              # GET /api/auth (OAuth 发起)
│   │       └── callback/route.ts     # GET /api/auth/callback
│   ├── categories/
│   │   ├── page.tsx                  # 分类总览页
│   │   └── [category]/
│   │       └── page.tsx              # 按分类筛选文章
│   ├── posts/
│   │   └── [slug]/
│   │       └── page.tsx              # 文章详情页
│   └── tags/
│       ├── page.tsx                  # 标签总览页
│       └── [tag]/
│           └── page.tsx              # 按标签筛选文章
│
├── components/                       # React 可复用组件
│   ├── Footer.tsx                    # 页脚（版权 + 管理入口）
│   ├── Header.tsx                    # 顶部导航栏
│   ├── MDXContent.tsx                # Markdown → HTML 渲染器
│   ├── PostCard.tsx                  # 文章预览卡片
│   └── PostEditor.tsx                # 后台文章编辑器（新建/编辑共用）
│
├── content/
│   └── posts/                        # 📝 博客文章存放目录
│       ├── hello-world.mdx           # 示例文章
│       └── docker-nextjs-deploy.mdx  # 示例文章
│
├── lib/                              # 工具库
│   ├── github.ts                     # GitHub REST API 客户端
│   └── posts.ts                      # 文章解析、分类、标签工具函数
│
├── public/                           # 静态资源
│   └── admin/
│       ├── config.yml                # Decap CMS 配置（已弃用，保留备用）
│       └── index.html                # Decap CMS 入口（已弃用，保留备用）
│
├── next.config.ts                    # Next.js 配置
├── tsconfig.json                     # TypeScript 配置
├── postcss.config.mjs               # PostCSS 配置（Tailwind v4）
├── eslint.config.mjs                # ESLint 配置
└── package.json                      # 项目依赖与脚本
```

---

## 核心实现

### 5.1 文章内容系统

**文件：** `lib/posts.ts`

文章以 `.md` 或 `.mdx` 文件存储在 `content/posts/` 目录，使用 frontmatter 定义元数据。

**Frontmatter 格式：**

```yaml
---
title: "文章标题"           # 必填
date: "2026-06-04"         # 必填，YYYY-MM-DD
description: "文章描述"     # 可选，用于 SEO 和卡片摘要
tags: [tag1, tag2]         # 可选，标签数组
category: 技术教程          # 可选，分类
---

Markdown 正文内容...
```

**核心函数：**

| 函数 | 返回类型 | 说明 |
|------|----------|------|
| `getAllPosts()` | `PostMeta[]` | 扫描目录，解析所有文章元数据，按日期倒序 |
| `getPostBySlug(slug)` | `Post \| null` | 根据 slug 获取单篇文章完整内容 |
| `getAllTags()` | `{tag, count}[]` | 统计所有标签及出现次数 |
| `getPostsByTag(tag)` | `PostMeta[]` | 按标签筛选文章 |
| `getAllCategories()` | `{category, count}[]` | 统计所有分类及文章数 |
| `getPostsByCategory(cat)` | `PostMeta[]` | 按分类筛选文章 |

**TypeScript 接口：**

```typescript
interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  category: string;
}

interface Post extends PostMeta {
  content: string;  // Markdown 原始内容
}
```

**实现原理：**

- 构建时通过 `fs.readdirSync()` 扫描 `content/posts/` 目录
- 使用 `gray-matter` 解析每个文件的 YAML frontmatter 和正文
- 文章按 `date` 降序排列
- 所有数据在构建时静态生成，无运行时开销

**预定义分类：**

```typescript
const CATEGORIES = [
  "随想",
  "代码版本更新",
  "项目实现",
  "技术教程",
  "问题排查",
  "工具分享",
];
```

---

### 5.2 Markdown 渲染

**文件：** `components/MDXContent.tsx`

使用 `marked` 将 Markdown 文本转换为 HTML，通过 `dangerouslySetInnerHTML` 渲染。

```tsx
export default function MDXContent({ content }: MDXContentProps) {
  const html = marked.parse(content) as string;
  return (
    <article
      className="prose max-w-none ..."
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
```

**样式处理：**

- 使用 Tailwind CSS 的 `prose` 类提供基础排版样式
- 通过 `prose-*` 修饰符自定义标题、代码、引用、图片等元素样式
- 代码块使用深色背景 + 圆角边框
- 行内代码使用主题色半透明背景
- 引用块使用左侧主题色边框 + 半透明底色

---

### 5.3 自定义管理后台

管理后台是完全自建的 React 客户端组件系统，替代了原有的 Decap CMS 方案。

**路由设计：**

| 路由 | 组件 | 功能 |
|------|------|------|
| `/admin` | `app/admin/page.tsx` | 登录表单 → 登录后显示仪表盘 |
| `/admin/posts` | `app/admin/posts/page.tsx` | 文章列表、搜索、分类筛选、删除 |
| `/admin/posts/new` | `app/admin/posts/new/page.tsx` | 新建文章编辑器 |
| `/admin/posts/[slug]/edit` | `app/admin/posts/[slug]/edit/page.tsx` | 编辑已有文章 |

**认证机制：**

```typescript
// app/api/admin/login/route.ts
export async function POST(request: Request) {
  const { password } = await request.json();
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "密码错误" }, { status: 401 });
  }
  const token = Buffer.from(`${password}:${Date.now()}`).toString("base64");
  return NextResponse.json({ success: true, token });
}
```

- 密码存储为 Vercel 环境变量 `ADMIN_PASSWORD`
- 登录成功返回 token，前端存入 `sessionStorage`
- 后续 API 调用在 Header 中携带 token（当前为简化实现，token 未强制校验过期）

**文章编辑器 (`components/PostEditor.tsx`)：**

共享组件，用于新建和编辑文章：

- **标题** → 自动生成 slug（中文转拼音简写或直接保留）
- **分类** → 下拉选择预设分类
- **日期** → 日期选择器
- **标签** → 逗号分隔输入
- **描述** → 单行文本
- **正文** → 大文本区域，支持 Markdown 源码编辑 / 纯文本预览切换

**仪表盘 (`app/admin/page.tsx`)：**

- 统计卡片：总文章数、分类数、最近更新
- 分类分布统计
- 最近文章列表（快速编辑/删除）
- 侧边栏导航（仪表盘、文章管理、新建文章、返回网站、退出登录）

---

### 5.4 GitHub API 集成

**文件：** `lib/github.ts`

管理后台通过 GitHub REST API 实现对仓库文件的操作。

**核心函数：**

```typescript
// 列出 content/posts/ 下所有文章
async function listPosts(): Promise<{name, path, sha}[]>

// 获取单个文件内容（Base64 解码）
async function getPostFile(filePath: string): Promise<{content, sha}>

// 创建或更新文件（Base64 编码提交）
async function savePostFile(filePath, content, commitMessage, sha?): Promise<void>

// 删除文件
async function deletePostFile(filePath, sha): Promise<void>
```

**API 端点：**

| 端点 | 方法 | 说明 |
|------|------|------|
| `GET /repos/{owner}/{repo}/contents/{path}` | GitHub API | 读取文件 |
| `PUT /repos/{owner}/{repo}/contents/{path}` | GitHub API | 创建/更新文件 |
| `DELETE /repos/{owner}/{repo}/contents/{path}` | GitHub API | 删除文件 |

**数据流：**

```
浏览器 (管理后台)
  ↓ POST /api/admin/posts { slug, title, content, ... }
Next.js API Route (app/api/admin/posts/route.ts)
  ↓ 调用 lib/github.ts
GitHub REST API
  ↓ 提交文件到 bzzzx/blog 仓库
Vercel 检测到 Git 变更
  ↓ 自动触发重新构建和部署
新文章上线
```

**API Route 实现 (`app/api/admin/posts/route.ts`)：**

```typescript
// GET - 列出所有文章或获取单篇
export async function GET(request: Request) {
  const slug = searchParams.get("slug");
  if (slug) {
    // 获取单篇文章（含 Base64 解码后的内容）
    const { content, sha } = await getPostFile(file.path);
    return NextResponse.json({ slug, content, sha });
  }
  // 列出所有文章（含 frontmatter 解析）
  const files = await listPosts();
  return NextResponse.json(postsWithMeta);
}

// POST - 创建或更新文章
export async function POST(request: Request) {
  const { slug, title, date, description, tags, category, content, sha } = body;
  // 构建带 frontmatter 的 .mdx 文件内容
  const fileContent = `---\n...\n---\n\n${content}`;
  await savePostFile(filePath, fileContent, message, sha);
  return NextResponse.json({ success: true });
}

// DELETE - 删除文章
export async function DELETE(request: Request) {
  const { slug, sha } = searchParams;
  await deletePostFile(filePath, sha);
  return NextResponse.json({ success: true });
}
```

---

### 5.5 分类与标签系统

**分类 (Category)：**

- 文章归属于**一个**分类（单选）
- 预设 6 个分类：随想、代码版本更新、项目实现、技术教程、问题排查、工具分享
- 分类页面：`/categories`（总览）、`/categories/[category]`（筛选）
- 文章卡片和详情页显示蓝色分类徽章

**标签 (Tag)：**

- 文章可以有**多个**标签（多选）
- 标签自由输入，无预设限制
- 标签页面：`/tags`（总览）、`/tags/[tag]`（筛选）
- 标签以灰色胶囊样式显示

**实现差异：**

| 特性 | 分类 | 标签 |
|------|------|------|
| 数量 | 每篇文章 1 个 | 每篇文章 N 个 |
| 定义 | 预设列表 | 自由输入 |
| 显示 | 蓝色徽章 | 灰色胶囊 |
| 路由 | `/categories/[category]` | `/tags/[tag]` |
| 生成 | `getAllCategories()` | `getAllTags()` |

---

### 5.6 配色与视觉设计

**文件：** `app/globals.css`

使用 CSS 自定义属性（变量）管理配色，支持浅色/深色模式。

**色板：**

```css
:root {
  --background: #faf9ff;      /* 浅紫白底色 */
  --foreground: #1e1b2e;      /* 深紫黑文字 */
  --accent: #6366f1;           /* Indigo 主题色 */
  --accent-soft: #eef2ff;      /* 主题色浅底 */
  --card-bg: #ffffff;          /* 卡片背景 */
  --card-border: #e8e5f0;      /* 卡片边框 */
  --muted: #8b859e;            /* 柔和灰紫文字 */
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
  :root {
    --background: #0f0d1a;
    --foreground: #e8e4f0;
    --accent: #818cf8;
    --accent-soft: #1e1b3a;
    --card-bg: #151224;
    --card-border: #221f3a;
    --muted: #6b6484;
  }
}
```

**背景光晕：**

```css
body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.06), transparent),
    radial-gradient(ellipse 60% 40% at 90% 80%, rgba(139,92,246,0.04), transparent);
  pointer-events: none;
}
```

**设计原则：**

- **去纯黑化**：浅色模式用暖紫白 `#faf9ff` 替代纯白，深色模式用紫黑 `#0f0d1a` 替代纯黑
- **主题色统一**：全部使用 Indigo `#6366f1` 作为主色调
- **层次分明**：通过变量区分背景/卡片/边框，避免扁平化
- **微交互**：卡片 hover 上浮 + 阴影，导航链接背景高亮
- **排版**：使用 Geist 字体，良好的行高和字间距

---

### 5.7 OAuth 认证（备用）

**文件：** `app/api/auth/route.ts`、`app/api/auth/callback/route.ts`

原为 Decap CMS 设计的 GitHub OAuth 流程，当前后台使用自定义登录方案，此 OAuth 路由保留备用。

**流程：**

```
用户访问 /admin
  ↓ (若使用 Decap CMS)
重定向到 GitHub OAuth: GET /api/auth
  ↓ 302 → https://github.com/login/oauth/authorize
用户授权后 GitHub 回调
  ↓ GET /api/auth/callback?code=xxx
交换 code 获取 access_token
  ↓ postMessage 回 CMS 页面
CMS 获得 token，通过 GitHub API 管理文章
```

---

## 页面路由表

| 路由 | 渲染模式 | 功能描述 |
|------|----------|----------|
| `/` | ○ Static | 首页：Hero 区 + 文章列表 |
| `/posts/[slug]` | ● SSG | 文章详情页 |
| `/categories` | ○ Static | 分类总览页 |
| `/categories/[category]` | ● SSG | 按分类筛选文章 |
| `/tags` | ○ Static | 标签总览页 |
| `/tags/[tag]` | ● SSG | 按标签筛选文章 |
| `/about` | ○ Static | 关于页面 |
| `/admin` | ○ Static | 管理后台登录/仪表盘 |
| `/admin/posts` | ○ Static | 文章管理列表 |
| `/admin/posts/new` | ○ Static | 新建文章 |
| `/admin/posts/[slug]/edit` | ƒ Dynamic | 编辑文章 |
| `/api/admin/login` | ƒ Dynamic | 登录 API |
| `/api/admin/posts` | ƒ Dynamic | 文章 CRUD API |
| `/api/auth` | ƒ Dynamic | OAuth 发起 |
| `/api/auth/callback` | ƒ Dynamic | OAuth 回调 |

> ○ Static: 构建时预渲染为静态 HTML  
> ● SSG: 使用 `generateStaticParams` 静态生成多个页面  
> ƒ Dynamic: 服务端按需渲染

---

## 组件清单

| 组件 | 文件 | 类型 | 说明 |
|------|------|------|------|
| `Header` | `components/Header.tsx` | Server | 粘性导航栏，渐变 logo，导航链接带 hover 效果 |
| `Footer` | `components/Footer.tsx` | Server | 页脚，技术栈声明，管理入口链接 |
| `PostCard` | `components/PostCard.tsx` | Server | 文章预览卡片，整卡可点击，显示分类/标签/日期 |
| `MDXContent` | `components/MDXContent.tsx` | Server | Markdown → HTML 渲染器，prose 样式 |
| `PostEditor` | `components/PostEditor.tsx` | Client | 文章编辑器表单，新建/编辑共用，含侧边栏 |

---

## API 路由

| 端点 | 方法 | 认证 | 说明 |
|------|------|------|------|
| `/api/admin/login` | POST | 密码 | 登录，返回 session token |
| `/api/admin/posts` | GET | Token | 列出所有文章（`?slug=xxx` 获取单篇） |
| `/api/admin/posts` | POST | Token | 创建/更新文章（body 含 sha 则为更新） |
| `/api/admin/posts` | DELETE | Token | 删除文章（`?slug=xxx&sha=xxx`） |
| `/api/auth` | GET | 无 | GitHub OAuth 发起 |
| `/api/auth/callback` | GET | 无 | GitHub OAuth 回调，交换 token |

---

## 环境变量

部署到 Vercel 时需要设置以下环境变量：

| 变量名 | 必填 | 说明 |
|--------|------|------|
| `GITHUB_PAT` | ✅ | GitHub Personal Access Token (classic)，需 `repo` 权限 |
| `ADMIN_PASSWORD` | ✅ | 管理后台登录密码 |
| `GITHUB_OAUTH_CLIENT_ID` | 备用 | GitHub OAuth App Client ID（仅 Decap CMS 需要） |
| `GITHUB_OAUTH_CLIENT_SECRET` | 备用 | GitHub OAuth App Client Secret（仅 Decap CMS 需要） |

---

## 部署流程

### 1. 本地开发

```bash
cd blog
npm install
npm run dev          # http://localhost:3000
```

### 2. 构建

```bash
npm run build         # 生产构建
npm start             # 启动生产服务器
```

### 3. 部署到 Vercel

```bash
# 使用项目内置的 Vercel CLI
./node_modules/.bin/vercel --prod
```

部署后配置：
1. 在 Vercel 控制台设置环境变量 `GITHUB_PAT` 和 `ADMIN_PASSWORD`
2. 在 Vercel 控制台关联 GitHub 仓库实现自动部署
3. 重新部署使环境变量生效

### 4. 自动部署流程

```
创建/编辑文章 (管理后台)
  → 通过 GitHub API 提交到仓库
  → Vercel 检测到 Git 变更
  → 自动构建和部署
  → 网站更新
```

---

## 使用指南

### 创建新文章

**方法 1：管理后台（推荐）**

1. 访问 `https://your-domain.vercel.app/admin`
2. 输入密码登录
3. 点击「+ 新建文章」
4. 填写标题、分类、标签、正文
5. 点击「发布文章」

**方法 2：本地文件**

1. 在 `content/posts/` 下创建 `my-post.mdx`
2. 添加 frontmatter 和内容
3. `git commit && git push`

### 文章格式示例

```markdown
---
title: "Docker 部署 Next.js 实战"
date: "2026-06-04"
description: "记录使用 Docker 容器化部署 Next.js 应用的完整过程"
tags: [docker, nextjs, deployment]
category: 技术教程
---

## 背景介绍

为什么选择 Docker...

## 实现步骤

### 1. 编写 Dockerfile

```dockerfile
FROM node:22-alpine
...
```

### 2. 配置 Nginx

...
```

### 修改分类列表

编辑 `lib/posts.ts` 和 `components/PostEditor.tsx` 中的 `CATEGORIES` 数组。

### 修改管理后台密码

在 Vercel 环境变量中修改 `ADMIN_PASSWORD`，然后重新部署。

### 添加新页面

在 `app/` 下创建新的路由目录 + `page.tsx` 文件即可，Next.js App Router 会自动识别。

---

> 最后更新：2026-06-04  
> 部署地址：https://blog-opal-zeta-16.vercel.app  
> 仓库地址：https://github.com/bzzzx/blog
