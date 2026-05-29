# 🚀 部署指南

本文档详细说明如何将项目部署到各种平台。

---

## 📋 目录

- [GitHub Pages（推荐）](#github-pages推荐)
- [Vercel](#vercel)
- [Netlify](#netlify)
- [自定义域名](#自定义域名)
- [环境变量](#环境变量)
- [常见问题](#常见问题)

---

## GitHub Pages（推荐）

### 方式一：自动部署（推荐）

1. **Fork 本仓库**

2. **修改配置文件**

   编辑 `src/data/config.js`：

   ```javascript
   export const config = {
     github: {
       owner: 'your-username',   // ← 你的 GitHub 用户名
       repo: 'your-repo',        // ← 你的仓库名
     },
     // ...
   };
   ```

   编辑 `vite.config.js`：

   ```javascript
   export default defineConfig({
     plugins: [react()],
     base: '/your-repo-name/',  // ← 你的仓库名
     // ...
   });
   ```

3. **推送代码**

   ```bash
   git push origin main
   ```

4. **启用 GitHub Pages**
   - 进入仓库 **Settings > Pages**
   - **Source** 选择 `GitHub Actions`
   - 保存

5. **等待部署**
   - 进入 **Actions** 页面查看部署状态
   - 部署完成后访问 `https://your-username.github.io/your-repo/`

### 方式二：手动部署

```bash
# 构建项目
npm run build

# 使用 gh-pages 部署
npm run deploy
```

---

## Vercel

### 一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/your-repo)

### 手动部署

1. **安装 Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **登录 Vercel**

   ```bash
   vercel login
   ```

3. **部署**

   ```bash
   vercel
   ```

4. **配置构建设置**
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 通过 Git 集成

1. 登录 [vercel.com](https://vercel.com)
2. 点击 "New Project"
3. 导入你的 GitHub 仓库
4. 配置设置：
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. 点击 "Deploy"

---

## Netlify

### 一键部署

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/your-repo)

### 手动部署

1. **安装 Netlify CLI**

   ```bash
   npm install -g netlify-cli
   ```

2. **登录 Netlify**

   ```bash
   netlify login
   ```

3. **初始化项目**

   ```bash
   netlify init
   ```

4. **部署**

   ```bash
   netlify deploy --prod
   ```

### 通过 Git 集成

1. 登录 [netlify.com](https://netlify.com)
2. 点击 "New site from Git"
3. 选择你的 GitHub 仓库
4. 配置设置：
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. 点击 "Deploy site"

---

## 自定义域名

### GitHub Pages

1. 在仓库根目录创建 `CNAME` 文件：

   ```
   your-domain.com
   ```

2. 在域名提供商处添加 DNS 记录：
   - **类型**: CNAME
   - **名称**: www（或 @）
   - **值**: your-username.github.io

3. 在 GitHub 仓库 **Settings > Pages** 中：
   - **Custom domain**: 填入你的域名
   - 勾选 **Enforce HTTPS**

### Vercel

1. 在 Vercel 项目设置中：
   - 进入 **Settings > Domains**
   - 添加你的域名

2. 在域名提供商处添加 DNS 记录：
   - **类型**: A
   - **名称**: @
   - **值**: 76.76.21.21

3. 或者添加 CNAME 记录：
   - **类型**: CNAME
   - **名称**: www
   - **值**: cname.vercel-dns.com

### Netlify

1. 在 Netlify 项目设置中：
   - 进入 **Domain settings**
   - 点击 "Add custom domain"

2. 在域名提供商处添加 DNS 记录：
   - **类型**: CNAME
   - **名称**: www
   - **值**: your-site.netlify.app

---

## 环境变量

本项目不需要环境变量。所有配置通过 `src/data/config.js` 管理。

如果需要使用 GitHub Token（提高 API 限制），可以添加：

1. 创建 `.env` 文件：

   ```
   VITE_GITHUB_TOKEN=your_github_token
   ```

2. 在 `src/services/github.js` 中使用：

   ```javascript
   const token = import.meta.env.VITE_GITHUB_TOKEN;
   ```

**注意：** 公开仓库读取 Issues 不需要 Token，限制为 60 次/小时。

---

## 常见问题

### Q: 部署后页面空白？

A: 检查以下配置：

1. `vite.config.js` 的 `base` 是否正确
2. `src/data/config.js` 的仓库名是否正确
3. GitHub Pages 是否启用

### Q: GitHub Issues 数据不显示？

A: 检查以下几点：

1. Issues 是否为公开状态（Open）
2. Labels 是否正确（blog、project、profile）
3. 仓库是否为公开仓库
4. API 限制是否达到（60 次/小时）

### Q: 如何提高 API 限制？

A: 创建 GitHub Personal Access Token：

1. 进入 GitHub **Settings > Developer settings > Personal access tokens**
2. 生成新 Token（只需 `public_repo` 权限）
3. 添加到环境变量或 `config.js`

### Q: 如何更新已部署的网站？

A: 推送到 main 分支即可自动部署：

```bash
git add .
git commit -m "your changes"
git push origin main
```

GitHub Actions 会自动构建和部署。

### Q: 如何回滚到之前的版本？

A: 使用 Git 回滚：

```bash
# 查看提交历史
git log --oneline

# 回滚到指定提交
git revert <commit-hash>

# 推送回滚
git push origin main
```

### Q: 构建失败怎么办？

A: 检查以下几点：

1. 本地是否能正常构建 (`npm run build`)
2. Node 版本是否为 18+
3. 依赖是否完整 (`npm install`)
4. 查看 GitHub Actions 日志获取错误信息

---

## 部署检查清单

部署前请确认：

- [ ] `src/data/config.js` 配置正确
- [ ] `vite.config.js` 的 `base` 配置正确
- [ ] 本地构建成功 (`npm run build`)
- [ ] GitHub Pages 已启用
- [ ] GitHub Actions 工作流正常

部署后请验证：

- [ ] 首页能正常访问
- [ ] 桌面图标显示正常
- [ ] 窗口能正常打开和关闭
- [ ] GitHub Issues 数据能正常加载
- [ ] 移动端显示正常

---

## 技术支持

如有部署问题，请：

1. 查看 [常见问题](#常见问题)
2. 搜索 [Issues](../../issues)
3. 创建新 [Issue](../../issues/new)
