# 个人博客/作品集改造设计规格

> 基于 Windows 95 Portfolio 项目，改造为个人博客与作品集
> 日期：2026-05-29

## 1. 项目概述

### 1.1 目标

将现有的 Windows 95 参考项目改造为**个人博客/作品集**，保留 Win95 复古主题风格和核心交互（窗口拖拽、桌面图标、任务栏），替换内容为个人信息。

### 1.2 核心原则

- **保留 Win95 风格**：视觉主题不变，只替换内容
- **GitHub Issues 作为 CMS**：所有内容通过 GitHub Issues 管理，支持在线编辑
- **纯前端**：无需自建后端，部署到 GitHub Pages
- **便捷修改**：无需本地开发环境即可更新内容

## 2. 功能增减清单

### 2.1 保留的功能

| 功能 | 说明 |
|------|------|
| 桌面图标系统 | 双击打开窗口，拖拽排列 |
| 窗口管理 | 拖拽、缩放、最大化、最小化、关闭 |
| 任务栏 | 开始按钮、窗口标签、系统托盘 |
| 右键菜单 | 排序、新建文件夹、属性、设置 |
| 登录页 | Win95 风格登录界面 |
| 关机动画 | 关机/重启/注销动画 |
| 背景设置 | 壁纸颜色/图片切换 |
| Clippy 助手 | 回形针动画助手 |
| 扫雷游戏 | 完整的扫雷实现 |
| BTC 追踪器 | 实时比特币价格（Coinbase WebSocket） |
| 天气组件 | 基于地理位置的天气 |
| 新闻应用 | 新闻阅读器 |
| 任务管理器 | 查看/关闭运行中的窗口 |
| 错误弹窗 | Win95 风格错误对话框 |
| Tile 界面 | Win10 风格磁贴启动器 |
| 文件资源管理器 | MyComputer 文件夹浏览 |

### 2.2 移除的功能

| 功能 | 理由 |
|------|------|
| MSN 聊天 | 依赖 WebSocket 后端 `wss://notebackend-wrqt.onrender.com` |
| Winamp 播放器 | 减少依赖体积（webamp 包较大） |
| 邮件表单 | 依赖 @emailjs/browser |
| Store 应用商店 | 不再需要安装/卸载概念 |
| v86 模拟器 | 未使用的 x86 模拟功能 |
| 忍者猫彩蛋 | 简化 |

### 2.3 新增的功能

| 功能 | 说明 |
|------|------|
| 博客系统 | 通过 GitHub Issues 读取博客文章，在 Win95 窗口中阅读 |
| 项目展示窗口 | 信息卡片 + iframe 预览的混合模式 |
| 个人简历窗口 | 展示 GitHub Issues 中的个人信息和简历图片 |

## 3. 数据架构

### 3.1 GitHub Issues 作为统一 CMS

所有动态内容存储在 GitHub Issues 中，通过 GitHub REST API 公开读取（无需 Token）。

```
GitHub Issues（仓库：{owner}/{repo}）
│
├── Label: "blog"        → 博客文章列表
│   ├── Issue #12: "如何构建 RAG 系统"
│   ├── Issue #15: "React 性能优化实践"
│   └── ...
│
├── Label: "project"     → 项目作品集
│   ├── Issue #5:  "AI Agent 平台"
│   ├── Issue #8:  "个人博客系统"
│   └── ...
│
└── Label: "profile"     → 个人信息（单个 Issue）
    └── Issue #1:  "个人简介"
```

### 3.2 Issue 格式约定

#### 博客文章（Label: `blog`）

- **Title** → 文章标题
- **Body** → 文章正文（Markdown）
- **Labels** → `blog` + 分类标签（如 `AI`, `前端`, `后端`）
- **Created at** → 发布日期
- **Images** → 支持在 Issue 中直接拖拽上传图片，GitHub 自动托管

#### 项目（Label: `project`）

- **Title** → 项目名称
- **Body** → 项目描述，使用 HTML 注释嵌入元数据：

```markdown
<!-- meta
thumbnail: https://xxx.png
tech: React, FastAPI, Neo4j
demo: https://xxx.vercel.app
github: https://github.com/xxx/xxx
featured: true
-->

## 项目介绍

详细描述...
```

- **Labels** → `project` + 分类标签

#### 个人信息（Label: `profile`，单个 Issue）

- **Title** → "Profile"
- **Body** → Markdown 格式的个人信息，支持直接上传简历图片：

```markdown
<!-- meta
name: 你的名字
title: AI Product Manager
location: Shanghai, China
github: https://github.com/yourname
linkedin: https://linkedin.com/in/yourname
-->

## 简历

![简历第1页](https://user-content-assets.githubusercontent.com/xxx/1.png)
![简历第2页](https://user-content-assets.githubusercontent.com/xxx/2.png)

## About Me

个人简介...

## Skills

- Python, TypeScript, React
- LangChain, LlamaIndex
- ...
```

### 3.3 API 调用

```javascript
// 读取博客文章
GET https://api.github.com/repos/{owner}/{repo}/issues?labels=blog&state=open

// 读取项目列表
GET https://api.github.com/repos/{owner}/{repo}/issues?labels=project&state=open

// 读取个人信息
GET https://api.github.com/repos/{owner}/{repo}/issues?labels=profile&state=open

// 读取单篇文章详情（含评论）
GET https://api.github.com/repos/{owner}/{repo}/issues/{number}
GET https://api.github.com/repos/{owner}/{repo}/issues/{number}/comments
```

- 公开仓库无需 GitHub Token
- 前端使用 `axios`（已安装）调用 API
- 使用 `sessionStorage` 缓存，避免重复请求
- 添加 GitHub API 请求头：`Accept: application/vnd.github.v3+json`

## 4. UI 设计

### 4.1 桌面布局

桌面图标重新组织为：

```
┌─────────────────────────────────────────────┐
│ Desktop                                      │
│                                              │
│  [About Me]    [Blog]      [Projects]        │
│                                              │
│  [MyComputer]  [Resume]    [Mail]            │
│                                              │
│  [Minesweeper] [BTC]       [News]            │
│                                              │
│  [Weather]     [Recycle]                     │
│                                              │
└─────────────────────────────────────────────┘
```

- **About Me**：打开个人信息窗口
- **Blog**：打开博客文章列表窗口
- **Projects**：打开项目展示窗口
- **MyComputer**：保留文件资源管理器
- **Resume**：简历查看窗口（展示简历图片）
- **Mail**：联系表单（纯前端，可用 Formspree 等免费服务）
- **Minesweeper**：扫雷游戏
- **BTC**：比特币追踪器
- **News**：新闻阅读器
- **Weather**：天气组件
- **Recycle**：回收站

### 4.2 博客窗口

```
┌─ Blog ──────────────────────────────────────┐
│ [← Back]  [Categories ▼]  [🔍 Search]       │
├─────────────────────────────────────────────┤
│                                              │
│  📄 如何构建 RAG 系统              2026-05-20 │
│     AI, 后端                                 │
│                                              │
│  📄 React 性能优化实践             2026-05-15 │
│     前端                                     │
│                                              │
│  📄 TypeScript 高级类型            2026-05-10 │
│     前端                                     │
│                                              │
│  ─────────────────────────────────────────── │
│  [← Prev]  Page 1 of 3  [Next →]            │
└─────────────────────────────────────────────┘
```

点击文章标题后：

```
┌─ Blog: 如何构建 RAG 系统 ───────────────────┐
│ [← Back to List]                             │
├─────────────────────────────────────────────┤
│  # 如何构建 RAG 系统                          │
│  2026-05-20 | AI, 后端                        │
│                                              │
│  正文内容（Markdown 渲染）...                  │
│                                              │
│  ![架构图](xxx.png)                           │
│                                              │
│  代码块高亮显示...                             │
│                                              │
└─────────────────────────────────────────────┘
```

### 4.3 项目展示窗口

```
┌─ Projects ──────────────────────────────────┐
│ [All] [AI] [Frontend] [Backend]  [🔍 Search] │
├─────────────────────────────────────────────┤
│                                              │
│  ┌──────────┐  AI Agent 平台                 │
│  │ 缩略图   │  React + FastAPI + Neo4j       │
│  │          │  智能对话代理平台...              │
│  └──────────┘  [Demo] [GitHub] [Details →]   │
│  ─────────────────────────────────────────── │
│  ┌──────────┐  个人博客系统                   │
│  │ 缩略图   │  React + GitHub Issues         │
│  │          │  Windows 95 风格...             │
│  └──────────┘  [Demo] [GitHub] [Details →]   │
│                                              │
└─────────────────────────────────────────────┘
```

点击 [Details →] 后展开详情窗口：

```
┌─ Project: AI Agent 平台 ────────────────────┐
│ [← Back]  [🌐 Demo]  [📂 GitHub]            │
├─────────────────────────────────────────────┤
│                                              │
│  项目截图...                                  │
│                                              │
│  ## 技术栈                                    │
│  React, FastAPI, Neo4j, LangChain            │
│                                              │
│  ## 项目介绍                                  │
│  详细描述...                                  │
│                                              │
│  [🌐 在线预览] ← 点击可 iframe 打开           │
│                                              │
└─────────────────────────────────────────────┘
```

### 4.4 个人信息窗口

```
┌─ About Me ──────────────────────────────────┐
├─────────────────────────────────────────────┤
│                                              │
│  ┌──────┐  你的名字                          │
│  │ 头像 │  AI Product Manager               │
│  └──────┘  Shanghai, China                   │
│                                              │
│  ## About Me                                 │
│  个人简介文字...                              │
│                                              │
│  ## Skills                                   │
│  [Python] [TypeScript] [React] [FastAPI]     │
│  [LangChain] [Neo4j] [PostgreSQL]            │
│                                              │
│  ## 简历                                     │
│  [查看简历图片]                               │
│                                              │
│  GitHub | LinkedIn | Email                   │
│                                              │
└─────────────────────────────────────────────┘
```

### 4.5 简历查看窗口

点击"查看简历图片"后打开独立窗口，以图片形式展示简历：

```
┌─ Resume ────────────────────────────────────┐
│ [← Prev] [Next →]  [🔍 Zoom In] [🔍 Zoom Out]│
├─────────────────────────────────────────────┤
│                                              │
│         ┌─────────────────────┐             │
│         │                     │             │
│         │   简历图片内容       │             │
│         │   (可缩放)          │             │
│         │                     │             │
│         └─────────────────────┘             │
│                                              │
│  Page 1 of 2                                 │
└─────────────────────────────────────────────┘
```

## 5. 技术实现

### 5.1 依赖变更

**新增依赖：**
```json
{
  "react-markdown": "^9.0.0"    // Markdown 渲染
}
```

**移除依赖：**
```json
{
  "@emailjs/browser": "移除",
  "webamp": "移除",
  "bad-words": "移除"
}
```

### 5.2 新增文件结构

```
src/
├── services/
│   └── github.js              # GitHub API 封装（读取 Issues）
├── hooks/
│   └── useGitHubIssues.js     # 自定义 Hook：获取和缓存 Issues
├── components/
│   ├── BlogWindow.jsx         # 博客列表 + 文章详情窗口
│   ├── BlogWindow.css
│   ├── ProjectWindow.jsx      # 项目展示窗口
│   ├── ProjectWindow.css
│   ├── ProfileWindow.jsx      # 个人信息窗口
│   ├── ProfileWindow.css
│   ├── ResumeWindow.jsx       # 简历图片查看窗口
│   ├── ResumeWindow.css
│   ├── MarkdownRenderer.jsx   # Markdown 渲染组件
│   └── ...
└── data/
    └── config.js              # 配置文件（GitHub 仓库名等）
```

### 5.3 修改的文件

| 文件 | 修改内容 |
|------|----------|
| `App.jsx` | 移除 MSN/Webamp/Email 相关状态，添加新窗口状态 |
| `icon.json` | 更新桌面图标布局和配置 |
| `AppFunctions.js` | 更新图标映射，移除不需要的映射 |
| `Footer.jsx` | 移除 MSN 相关 UI |
| `package.json` | 更新依赖 |
| `vite.config.js` | 更新 base 路径 |
| `index.html` | 更新 SEO 信息 |

### 5.4 GitHub API 服务层

```javascript
// src/services/github.js
const GITHUB_API = 'https://api.github.com';
const REPO = 'your-username/your-repo'; // 配置项

export async function fetchIssues(label, page = 1) {
  const res = await axios.get(
    `${GITHUB_API}/repos/${REPO}/issues`,
    {
      params: { labels: label, state: 'open', per_page: 20, page },
      headers: { Accept: 'application/vnd.github.v3+json' }
    }
  );
  return res.data;
}

export async function fetchIssue(number) {
  const res = await axios.get(
    `${GITHUB_API}/repos/${REPO}/issues/${number}`,
    { headers: { Accept: 'application/vnd.github.v3+json' } }
  );
  return res.data;
}

export function parseIssueMeta(body) {
  // 从 HTML 注释中解析元数据
  const metaMatch = body.match(/<!-- meta\n([\s\S]*?)\n-->/);
  if (!metaMatch) return {};
  const meta = {};
  metaMatch[1].split('\n').forEach(line => {
    const [key, ...value] = line.split(':');
    if (key && value.length) meta[key.trim()] = value.join(':').trim();
  });
  return meta;
}
```

### 5.5 配置文件

```javascript
// src/data/config.js
export const config = {
  github: {
    owner: 'your-username',
    repo: 'your-repo',
  },
  profile: {
    name: '你的名字',
    title: 'AI Product Manager',
  }
};
```

### 5.6 部署

- 复用现有 GitHub Actions 工作流（`.github/workflows/deploy.yml`）
- 更新 `vite.config.js` 的 `base` 为你的仓库名
- 更新 `index.html` 的 SEO 元信息
- 推送到 `main` 分支自动部署到 GitHub Pages

## 6. 移除的工作

### 6.1 需要清理的代码

1. **App.jsx**：移除以下状态和逻辑
   - MSN 聊天相关的所有 state（`msnState`, `nudge`, WebSocket 连接等）
   - Webamp 相关的 state
   - Email 相关的 state
   - Store 相关的 state
   - v86 模拟器相关

2. **组件删除**：
   - `MsnFolder.jsx` + `MsnFolder.css`
   - `WebampPlayer.jsx` / `WinampPlayer.jsx`
   - `MailFolder.jsx` + `MailFolder.css`
   - `Store.jsx` + `Store.css`
   - `SpinningCat.jsx`

3. **公共文件删除**：
   - `public/bios/` 目录
   - `public/v86.wasm`

4. **依赖清理**：
   - `@emailjs/browser`
   - `webamp`
   - `bad-words`

## 7. 实施顺序

### Phase 1：基础设施（准备工作）
1. 配置 GitHub 仓库和 Issues（创建 label、示例 Issue）
2. 实现 `github.js` 服务层和 `useGitHubIssues` Hook
3. 实现 `MarkdownRenderer` 组件
4. 配置文件 `config.js`

### Phase 2：新功能开发
5. 实现 `BlogWindow`（博客列表 + 文章详情）
6. 实现 `ProjectWindow`（项目卡片 + 详情）
7. 实现 `ProfileWindow`（个人信息展示）
8. 实现 `ResumeWindow`（简历图片查看器）

### Phase 3：集成与清理
9. 更新 `App.jsx`：添加新窗口状态，移除旧功能状态
10. 更新 `icon.json`：重新组织桌面图标
11. 清理移除的组件和依赖
12. 更新 `Footer.jsx`

### Phase 4：部署与优化
13. 更新 `vite.config.js` 和 `index.html`
14. 更新 GitHub Actions 工作流
15. 测试和优化
16. 部署到 GitHub Pages

## 8. 内容管理指南

> 本章节为后续内容维护提供便捷指引。所有内容更新均通过 GitHub Issues 完成，无需本地开发环境。

### 8.1 添加博客文章

1. 打开仓库的 GitHub Issues 页面
2. 点击 "New Issue"
3. 标题填写文章标题
4. 正文使用 Markdown 编写（支持图片拖拽上传、代码块等）
5. 添加 Label：`blog`，可选添加分类标签（如 `AI`、`前端`、`后端`）
6. 提交后自动出现在博客窗口中（刷新页面即可）

**文章排序**：按 Issue 创建时间倒序排列（最新的在前）

**草稿功能**：使用 Label `draft` 标记草稿，前端会过滤掉带有 `draft` 标签的文章

### 8.2 添加/更新项目

1. 打开仓库的 GitHub Issues 页面
2. 点击 "New Issue"
3. 标题填写项目名称
4. 正文格式：

```markdown
<!-- meta
thumbnail: https://xxx.png
tech: React, FastAPI, Neo4j
demo: https://xxx.vercel.app
github: https://github.com/xxx/xxx
featured: true
-->

## 项目介绍

项目详细描述...
```

5. 添加 Label：`project`，可选添加分类标签（如 `AI`、`前端`、`全栈`）
6. 提交后自动出现在项目窗口中

**元数据字段说明：**

| 字段 | 必填 | 说明 |
|------|------|------|
| `thumbnail` | 推荐 | 项目缩略图 URL（可拖拽上传到 Issue 获取） |
| `tech` | 推荐 | 技术栈，逗号分隔 |
| `demo` | 可选 | 在线演示 URL |
| `github` | 可选 | GitHub 仓库 URL |
| `featured` | 可选 | 设为 `true` 标记为精选项目，优先展示 |

**更新项目**：直接编辑对应的 Issue 即可，保存后刷新页面生效。

### 8.3 更新个人信息

1. 找到 Label 为 `profile` 的 Issue（通常只有一个）
2. 编辑正文：

```markdown
<!-- meta
name: 你的名字
title: AI Product Manager
location: Shanghai, China
github: https://github.com/yourname
linkedin: https://linkedin.com/in/yourname
email: your@email.com
-->

## About Me

个人简介...

## Skills

- Python, TypeScript, React
- LangChain, LlamaIndex

## 简历

![简历第1页](https://user-content-assets.githubusercontent.com/xxx/1.png)
![简历第2页](https://user-content-assets.githubusercontent.com/xxx/2.png)
```

**更新简历**：直接在 Issue 中替换简历图片即可（拖拽新图片上传，删除旧图片链接）。

### 8.4 更新项目分类标签

前端会自动从 Issues 的 Labels 中提取分类。添加新的 Label（如 `全栈`）后，项目窗口的分类筛选器会自动出现该选项。

### 8.5 快速操作速查

| 操作 | 方式 |
|------|------|
| 发布新文章 | 新建 Issue → Label `blog` |
| 添加新项目 | 新建 Issue → Label `project` |
| 更新简历图片 | 编辑 Profile Issue → 替换图片 |
| 更新个人简介 | 编辑 Profile Issue → 修改文字 |
| 隐藏文章 | 给 Issue 添加 `draft` Label 或关闭 Issue |
| 删除项目 | 关闭对应的 Issue |
| 修改分类 | 编辑 Issue 的 Labels |

### 8.6 配置文件修改

以下内容需要修改代码（但只需改一个文件 `src/data/config.js`）：

```javascript
export const config = {
  github: {
    owner: 'your-username',   // ← 改为你的 GitHub 用户名
    repo: 'your-repo',        // ← 改为你的仓库名
  },
  blog: {
    label: 'blog',            // ← 博客 Issue 的 Label
    pageSize: 10,             // ← 每页显示文章数
  },
  project: {
    label: 'project',         // ← 项目 Issue 的 Label
  },
  profile: {
    label: 'profile',         // ← 个人信息 Issue 的 Label
  }
};
```

### 8.7 批量导入现有内容

如果你已有大量项目和文章需要导入，可以：
1. 使用 GitHub API 批量创建 Issues
2. 或手动逐个创建（推荐，可同时完善格式）

### 8.8 注意事项

- **图片托管**：在 Issue 中拖拽上传的图片由 GitHub 自动托管，无需额外图床
- **API 限制**：匿名请求限制 60 次/小时，足够正常使用；如需更高限额可配置 GitHub Token
- **缓存**：前端使用 sessionStorage 缓存 API 响应，刷新页面即可获取最新内容
- **SEO**：GitHub Issues 内容对搜索引擎友好，文章可被搜索引擎索引
