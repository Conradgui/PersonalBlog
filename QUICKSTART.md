# ⚡ 快速开始

5 分钟快速上手，让你的个人博客/作品集跑起来！

---

## 🎯 你需要准备

- [Node.js](https://nodejs.org/) 18 或更高版本
- [Git](https://git-scm.com/)
- 一个 GitHub 账号

---

## 📦 第一步：获取代码

```bash
# 方式一：Fork 本仓库（推荐）
# 在 GitHub 上点击 Fork 按钮

# 方式二：直接克隆
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

---

## 🔧 第二步：安装依赖

```bash
npm install
```

---

## ⚙️ 第三步：配置

编辑 `src/data/config.js`，修改这两行：

```javascript
export const config = {
  github: {
    owner: 'your-username',   // ← 改成你的 GitHub 用户名
    repo: 'your-repo',        // ← 改成你的仓库名
  },
  // ...
};
```

---

## 🚀 第四步：启动

```bash
npm run dev
```

打开浏览器访问 `http://localhost:5173/`

---

## 📝 第五步：添加内容

### 创建 Labels

在你的 GitHub 仓库中，进入 **Settings > Labels**，创建：

| 名称      | 颜色  | 用途     |
| --------- | ----- | -------- |
| `blog`    | 蓝色  | 博客文章 |
| `project` | 绿色  | 项目作品 |
| `profile` | 紫色  | 个人信息 |

### 创建个人信息

新建一个 Issue，Label 选 `profile`：

```markdown
<!-- meta
name: 张三
title: AI Product Manager
location: Shanghai, China
github: https://github.com/zhangsan
-->

## About Me

我是一名 AI 产品经理...

## Skills

- Python, TypeScript, React
- LangChain, FastAPI
```

### 发布文章

新建一个 Issue，Label 选 `blog`：

```markdown
# 我的第一篇博客

这是文章内容...

## 代码示例

​```python
print("Hello World!")
​```
```

### 添加项目

新建一个 Issue，Label 选 `project`：

```markdown
<!-- meta
thumbnail: https://screenshot.png
tech: React, FastAPI, Neo4j
demo: https://demo.vercel.app
github: https://github.com/zhangsan/project
featured: true
-->

## 项目介绍

这是我的项目...
```

---

## 🌐 第六步：部署

### 推送到 GitHub

```bash
git add .
git commit -m "feat: initial setup"
git push origin main
```

### 启用 GitHub Pages

1. 进入仓库 **Settings > Pages**
2. **Source** 选择 `GitHub Actions`
3. 等待几分钟

### 访问你的网站

打开 `https://your-username.github.io/your-repo/`

---

## 🎨 自定义

### 修改窗口标题

编辑 `index.html`：

```html
<title>你的名字 - 个人作品集</title>
```

### 修改桌面图标

编辑 `src/icon.json`，添加或删除图标。

### 修改样式

编辑 `src/css/` 目录下的 CSS 文件。

---

## ❓ 常见问题

**Q: 页面空白？**
A: 检查 `config.js` 中的仓库名是否正确。

**Q: 数据不显示？**
A: 确保 Issues 是公开的，Labels 正确。

**Q: 构建失败？**
A: 运行 `npm install` 重新安装依赖。

---

## 📚 更多文档

- [完整文档](README.md)
- [部署指南](DEPLOYMENT.md)
- [贡献指南](CONTRIBUTING.md)
- [更新日志](CHANGELOG.md)

---

## 🎉 完成！

你的个人博客/作品集已经运行起来了！

现在你可以：

1. ✏️ 在 GitHub Issues 中发布文章
2. 📂 添加项目到作品集
3. 🎨 自定义样式和布局
4. 🌐 分享给朋友

---

有问题？查看 [完整文档](README.md) 或提交 [Issue](../../issues/new)。
