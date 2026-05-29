# 📋 更新日志

所有重要更改都将记录在此文件。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
版本号遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

---

## [2.0.0] - 2026-05-29

### 🎉 重大更新：个人博客/作品集改造

### ✨ 新增

- **博客系统** - 通过 GitHub Issues 管理博客文章
  - 文章列表、分类筛选、搜索功能
  - Markdown 渲染（代码高亮、图片、表格）
  - 分页加载

- **项目展示** - 卡片式项目列表
  - 缩略图、技术栈、描述展示
  - Demo/GitHub 链接
  - iframe 在线预览

- **个人信息** - 从 GitHub Issues 读取
  - 头像、姓名、职位、地点
  - 社交链接（GitHub、LinkedIn、Email）
  - Markdown 内容渲染

- **简历查看** - 图片式简历查看器
  - 多页翻页
  - 缩放功能

- **GitHub API 服务层** - `src/services/github.js`
  - Issues 列表和详情获取
  - 元数据解析（`<!-- meta ... -->` 格式）
  - 5 分钟 TTL 缓存
  - AbortController 请求取消

- **自定义 Hooks** - `src/hooks/useGitHubIssues.js`
  - `useIssueList` - 列表获取和分页
  - `useIssueDetail` - 详情获取
  - `useParsedIssue` - 内容解析

- **Markdown 渲染器** - `src/components/MarkdownRenderer.jsx`
  - Win95 风格样式
  - 代码块高亮
  - 图片懒加载
  - 安全链接

- **配置文件** - `src/data/config.js`
  - GitHub 仓库配置
  - 博客、项目、个人信息 Label 配置

### 🔧 改进

- 更新桌面图标布局（精简为 9 个核心图标）
- 更新图标映射（添加 Blog、Projects、News）
- 更新部署配置（Node 20、GitHub Actions v4）
- 更新 SEO 元信息

### 🗑️ 移除

- MSN 聊天（WebSocket 后端依赖）
- Winamp 播放器（减少依赖体积）
- 邮件表单（emailjs 依赖）
- Store 应用商店
- v86 模拟器
- 忍者猫彩蛋
- Google Analytics 跟踪代码
- 旧资产文件（9 个图片/GIF）

### 🐛 修复

- 修复 react-markdown v10 代码块渲染兼容性
- 修复 AbortController 未正确传递 signal 的问题
- 清理残留代码和无用导入

---

## [1.0.0] - 2024-08-25

### 🎉 首次发布

### ✨ 核心功能

- Windows 95 风格桌面环境
- 窗口拖拽、缩放、最大化、最小化、关闭
- 桌面图标系统
- 任务栏和开始菜单
- 登录页面
- 关机动画
- 右键菜单
- 背景设置
- Clippy 助手

### 🎮 应用

- 扫雷游戏
- MSN 聊天
- Winamp 播放器
- BTC 追踪器
- 天气组件
- 新闻应用
- Paint 画图
- 文件资源管理器
- 任务管理器
- 应用商店

---

## 版本说明

### 版本号规则

- **主版本号 (MAJOR)**: 不兼容的 API 修改
- **次版本号 (MINOR)**: 向下兼容的功能性新增
- **修订号 (PATCH)**: 向下兼容的问题修正

### 更新类型

- **✨ 新增**: 新功能
- **🔧 改进**: 现有功能的改进
- **🐛 修复**: Bug 修复
- **🗑️ 移除**: 移除的功能
- **⚠️ 废弃**: 即将移除的功能
- **🔒 安全**: 安全相关的更新
