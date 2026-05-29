# 🤝 贡献指南

感谢你对本项目的关注！以下是参与贡献的指南。

## 📋 目录

- [行为准则](#行为准则)
- [如何贡献](#如何贡献)
- [开发流程](#开发流程)
- [提交规范](#提交规范)
- [问题反馈](#问题反馈)

---

## 行为准则

本项目遵循开放、友好的原则。请尊重每一位参与者。

---

## 如何贡献

### 报告 Bug

1. 在 [Issues](../../issues) 页面创建新 Issue
2. 使用 Bug 报告模板
3. 提供详细的复现步骤
4. 附上截图或错误日志

### 提交功能建议

1. 在 [Issues](../../issues) 页面创建新 Issue
2. 使用功能建议模板
3. 详细描述你的想法和使用场景

### 提交代码

1. Fork 本仓库
2. 创建特性分支
3. 编写代码
4. 提交 Pull Request

---

## 开发流程

### 1. 环境准备

```bash
# 克隆你的 Fork
git clone https://github.com/your-username/your-repo.git
cd your-repo

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 2. 创建分支

```bash
# 从 main 分支创建新分支
git checkout -b feature/your-feature-name

# 或者修复 bug
git checkout -b fix/your-bug-fix
```

### 3. 开发和测试

```bash
# 运行开发服务器
npm run dev

# 代码检查
npm run lint

# 构建测试
npm run build
```

### 4. 提交代码

```bash
# 添加修改
git add .

# 提交（遵循提交规范）
git commit -m "feat: add new feature"

# 推送到远程
git push origin feature/your-feature-name
```

### 5. 创建 Pull Request

1. 访问你的 Fork 页面
2. 点击 "New Pull Request"
3. 填写 PR 描述
4. 等待审查

---

## 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

### 类型

| 类型     | 说明                    |
| -------- | ----------------------- |
| `feat`   | 新功能                  |
| `fix`    | 修复 Bug                |
| `docs`   | 文档更新                |
| `style`  | 代码格式（不影响功能）  |
| `refactor` | 代码重构              |
| `perf`   | 性能优化                |
| `test`   | 测试相关                |
| `chore`  | 构建/工具/依赖更新      |

### 示例

```bash
# 新功能
git commit -m "feat: add blog search functionality"

# 修复 Bug
git commit -m "fix: resolve window drag issue on mobile"

# 文档更新
git commit -m "docs: update README with deployment guide"

# 代码重构
git commit -m "refactor: extract window state management to custom hook"
```

### 范围（可选）

```bash
git commit -m "feat(blog): add category filter"
git commit -m "fix(profile): resolve avatar loading issue"
```

---

## 问题反馈

### Bug 报告模板

```markdown
## Bug 描述

简要描述 bug

## 复现步骤

1. 打开 '...'
2. 点击 '...'
3. 滚动到 '...'
4. 看到错误

## 预期行为

描述你期望的行为

## 实际行为

描述实际发生的行为

## 截图

如果适用，添加截图

## 环境信息

- 操作系统: [例如 Windows 11]
- 浏览器: [例如 Chrome 120]
- Node 版本: [例如 18.0.0]
```

### 功能建议模板

```markdown
## 功能描述

简要描述你想要的功能

## 使用场景

描述这个功能的使用场景

## 解决方案

描述你期望的实现方式

## 其他信息

任何其他相关信息
```

---

## 代码规范

### JavaScript/React

- 使用 2 空格缩进
- 使用单引号
- 使用分号
- 组件使用 PascalCase
- 函数使用 camelCase
- 常量使用 UPPER_SNAKE_CASE

### CSS

- 使用 kebab-case 命名类名
- 遵循 Win95 风格规范
- 每个组件对应一个 CSS 文件

### 注释

- 复杂逻辑添加注释
- 使用 JSDoc 注释函数
- 中文注释用于业务逻辑
- 英文注释用于技术代码

---

## Pull Request 检查清单

提交 PR 前，请确认：

- [ ] 代码遵循项目规范
- [ ] 已添加必要的注释
- [ ] 已更新相关文档
- [ ] 本地构建通过 (`npm run build`)
- [ ] 代码检查通过 (`npm run lint`)
- [ ] 已测试核心功能
- [ ] PR 描述清晰明了

---

## 联系方式

如有任何问题，请通过以下方式联系：

- 创建 [Issue](../../issues)
- 发送邮件到 your@email.com

---

感谢你的贡献！🎉
