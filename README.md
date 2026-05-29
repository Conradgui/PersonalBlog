# 🖥️ Windows 95 个人博客 & 作品集

> 基于 React 的 Windows 95 风格个人博客和作品集，使用 GitHub Issues 作为 CMS

![Windows 95 Portfolio](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**在线演示：** <https://your-username.github.io/your-repo/>

---

## ✨ 特性

### 🆕 核心功能

- **📝 博客系统** - 通过 GitHub Issues 管理博客文章，支持分类筛选和搜索
- **📂 项目展示** - 卡片式项目列表，支持缩略图、技术栈、Demo/GitHub 链接
- **👤 个人信息** - 从 GitHub Issues 读取个人简介、技能、社交链接
- **📄 简历查看** - 图片式简历查看器，支持翻页和缩放

### 🎮 保留的经典功能

- **🪟 窗口管理** - 拖拽、缩放、最大化、最小化、关闭
- **🎯 桌面图标** - 双击打开，拖拽排列
- **📋 任务栏** - 开始按钮、窗口标签、系统托盘
- **🖱️ 右键菜单** - 排序、新建文件夹、属性、设置
- **💣 扫雷游戏** - 经典的扫雷实现
- **₿ BTC 追踪** - 实时比特币价格（Coinbase WebSocket）
- **🌤️ 天气组件** - 基于地理位置的天气显示
- **📰 新闻应用** - 新闻阅读器
- **📎 Clippy 助手** - 回形针动画助手
- **🔐 登录页面** - Win95 风格登录界面
- **🔄 关机动画** - 关机/重启/注销动画

---

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置 GitHub 仓库

编辑 `src/data/config.js`：

```javascript
export const config = {
  github: {
    owner: 'your-username',   // ← 替换为你的 GitHub 用户名
    repo: 'your-repo',        // ← 替换为你的仓库名
  },
  // ...
};
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173/` 查看效果。

### 5. 构建生产版本

```bash
npm run build
```

---

## 📝 内容管理

所有内容通过 GitHub Issues 管理，**无需本地开发环境**即可更新内容。

### 第一步：创建 Labels

在仓库的 **Settings > Labels** 中创建以下标签：

| Label    | 颜色 | 用途       |
| -------- | ---- | ---------- |
| `blog`   | 蓝色 | 博客文章   |
| `project` | 绿色 | 项目作品   |
| `profile` | 紫色 | 个人信息   |
| `draft`  | 灰色 | 草稿（可选）|

### 第二步：创建个人信息 Issue

创建一个 Issue，Label 为 `profile`：

```markdown
<!-- meta
name: 你的名字
title: AI Product Manager
location: Shanghai, China
github: https://github.com/yourname
linkedin: https://linkedin.com/in/yourname
email: your@email.com
avatar: https://your-avatar-url.png
-->

## About Me

在这里写你的个人简介...

## Skills

- Python, TypeScript, React
- FastAPI, LangChain, Neo4j
- PostgreSQL, Docker

## 简历

![简历第1页](https://your-resume-image-1.png)
![简历第2页](https://your-resume-image-2.png)
```

### 第三步：添加博客文章

创建 Issue，Label 为 `blog`：

```markdown
# 文章标题

文章正文内容，支持完整的 Markdown 语法...

## 代码块

​```python
def hello():
    print("Hello World!")
​```

## 图片

![图片描述](https://your-image-url.png)
```

**可选分类标签：** 添加额外的 Label（如 `AI`、`前端`、`后端`）来分类文章。

### 第四步：添加项目

创建 Issue，Label 为 `project`：

```markdown
<!-- meta
thumbnail: https://project-thumbnail.png
tech: React, FastAPI, Neo4j
demo: https://your-demo.vercel.app
github: https://github.com/yourname/your-project
featured: true
-->

## 项目介绍

项目详细描述...

## 技术栈

- React 18
- FastAPI
- Neo4j

## 截图

![项目截图](https://screenshot.png)
```

### 快速操作速查

| 操作         | 方式                                   |
| ------------ | -------------------------------------- |
| 发布新文章   | 新建 Issue → Label `blog`              |
| 添加新项目   | 新建 Issue → Label `project`           |
| 更新简历图片 | 编辑 Profile Issue → 替换图片          |
| 更新个人简介 | 编辑 Profile Issue → 修改文字          |
| 隐藏文章     | 给 Issue 添加 `draft` Label 或关闭 Issue |
| 删除项目     | 关闭对应的 Issue                       |
| 修改分类     | 编辑 Issue 的 Labels                   |

---

## 🚀 部署

### GitHub Pages（推荐）

1. **Fork 或克隆本仓库**

2. **修改配置**
   - 编辑 `src/data/config.js`，填入你的 GitHub 用户名和仓库名
   - 编辑 `vite.config.js`，修改 `base` 为你的仓库名

3. **推送代码**

   ```bash
   git push origin main
   ```

4. **启用 GitHub Pages**
   - 进入仓库 Settings > Pages
   - Source 选择 `GitHub Actions`

5. **等待部署完成**
   - GitHub Actions 会自动构建和部署
   - 访问 `https://your-username.github.io/your-repo/`

### Vercel

1. 连接 GitHub 仓库到 Vercel
2. 设置构建命令：`npm run build`
3. 设置输出目录：`dist`
4. 部署

### Netlify

1. 连接 GitHub 仓库到 Netlify
2. 设置构建命令：`npm run build`
3. 设置发布目录：`dist`
4. 部署

---

## 📁 项目结构

```text
├── public/                    # 静态资源
├── src/
│   ├── assets/               # 图片、字体、音频
│   ├── components/           # React 组件
│   │   ├── BlogWindow.jsx    # 博客窗口
│   │   ├── ProjectWindow.jsx # 项目展示窗口
│   │   ├── ProfileWindow.jsx # 个人信息窗口
│   │   ├── ResumeWindow.jsx  # 简历查看窗口
│   │   ├── MarkdownRenderer.jsx # Markdown 渲染器
│   │   ├── Footer.jsx        # 任务栏
│   │   ├── Dragdrop.jsx      # 桌面图标
│   │   ├── MineSweeper.jsx   # 扫雷游戏
│   │   └── ...               # 其他组件
│   ├── css/                  # 样式文件
│   ├── data/
│   │   └── config.js         # 配置文件
│   ├── hooks/
│   │   └── useGitHubIssues.js # GitHub Issues Hook
│   ├── services/
│   │   └── github.js         # GitHub API 服务
│   ├── App.jsx               # 主应用组件
│   ├── App.css               # 应用样式
│   ├── Context.js            # React Context
│   ├── icon.json             # 桌面图标配置
│   ├── index.css             # 全局样式
│   └── main.jsx              # 入口文件
├── docs/                     # 文档
│   └── superpowers/
│       ├── specs/            # 设计规格
│       └── plans/            # 实现计划
├── index.html                # HTML 入口
├── package.json              # 依赖配置
├── vite.config.js            # Vite 配置
└── .github/
    └── workflows/
        └── deploy.yml        # GitHub Actions 部署
```

---

## 🛠️ 自定义

### 修改桌面图标

编辑 `src/icon.json`：

```json
{
  "name": "图标名称",
  "pic": "图标图片名",
  "folderId": "Desktop",
  "size": 4,
  "type": ".exe",
  "x": 1,
  "y": 1
}
```

### 修改窗口样式

编辑对应的 CSS 文件，例如 `src/css/BlogWindow.css`。

Win95 风格的关键 CSS 变量：

```css
/* 窗口背景 */
background: #c5c4c4;

/* 凸起边框 */
border: 2px solid;
border-color: #f5f2f2 #1e1d1d #1e1d1d #f5f2f2;

/* 凹陷边框 */
border: 2px solid;
border-color: #1e1d1d #f5f2f2 #f5f2f2 #1e1d1d;

/* 标题栏 */
background: #000080;  /* 蓝色 */
color: white;
```

### 修改主题颜色

编辑 `src/App.jsx` 中的 `themeDragBar` 状态：

```javascript
const [themeDragBar, setThemeDragBar] = useState(
  () => localStorage.getItem('barcolor') || '#14045c'
);
```

---

## 📦 技术栈

| 类别         | 技术                        |
| ------------ | --------------------------- |
| **前端框架** | React 18.2                  |
| **构建工具** | Vite 5                      |
| **样式**     | 纯 CSS（Win95 风格）        |
| **拖拽**     | react-draggable             |
| **动画**     | framer-motion               |
| **Markdown** | react-markdown              |
| **HTTP**     | axios                       |
| **数据源**   | GitHub Issues API           |
| **部署**     | GitHub Pages + GitHub Actions |

---

## 🔧 开发命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 代码检查
npm run lint
```

---

## 📄 许可证

MIT License

---

## 🙏 致谢

- [Windows 95 Icons](https://oldwindowsicons.tumblr.com/tagged/windows%2095) - Windows 95 图标资源
- [React](https://reactjs.org/) - 前端框架
- [Vite](https://vitejs.dev/) - 构建工具
- [GitHub Issues](https://docs.github.com/en/issues) - 内容管理系统

---

## 📞 联系方式

- **GitHub:** [your-username](https://github.com/your-username)
- **LinkedIn:** [your-linkedin](https://linkedin.com/in/your-linkedin)
- **Email:** <your@email.com>

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的修改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request
