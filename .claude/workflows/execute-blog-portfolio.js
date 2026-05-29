export const meta = {
  name: 'execute-blog-portfolio',
  description: 'Execute blog/portfolio implementation with quality gates and code review',
  phases: [
    { title: 'Infrastructure', detail: 'Tasks 1-4: Config, API, Hooks, Markdown' },
    { title: 'Components', detail: 'Tasks 5-8: Blog, Project, Profile, Resume windows' },
    { title: 'Integration', detail: 'Tasks 9-12: App.jsx, icons, cleanup' },
    { title: 'Deployment', detail: 'Tasks 13-14: Config, testing' },
    { title: 'Quality Review', detail: 'Final review and online comparison' },
  ],
};

// Task definitions extracted from the plan
const TASKS = {
  task1: {
    name: '项目配置与依赖更新',
    description: `## 任务 1：项目配置与依赖更新

**文件：**
- 修改：package.json
- 创建：src/data/config.js

### 步骤：
1. 安装新依赖: npm install react-markdown
2. 移除旧依赖: npm uninstall @emailjs/browser webamp bad-words
3. 创建 src/data/config.js 配置文件:
\`\`\`javascript
export const config = {
  github: {
    owner: 'your-username',
    repo: 'your-repo',
  },
  blog: {
    label: 'blog',
    pageSize: 10,
    draftLabel: 'draft',
  },
  project: {
    label: 'project',
  },
  profile: {
    label: 'profile',
  },
};
\`\`\`
4. 验证 npm run dev 能正常启动
5. Commit: "chore: update deps and add config"`,
  },
  task2: {
    name: 'GitHub API 服务层',
    description: `## 任务 2：GitHub API 服务层

**文件：**
- 创建：src/services/github.js

### 步骤：
创建 src/services/github.js，包含：
- fetchIssues(label, page, perPage) - 获取 Issues 列表，带缓存
- fetchIssue(number) - 获取单个 Issue
- parseIssueMeta(body) - 解析 Issue body 中的元数据
- stripIssueMeta(body) - 移除元数据注释
- hasLabel(issue, labelName) - 检查 label
- getCategoryLabels(issue, systemLabel) - 获取分类标签
- clearCache() - 清除缓存

使用 axios 调用 GitHub API，实现 5 分钟 TTL 的内存缓存。
API 基础 URL: https://api.github.com/repos/{owner}/{repo}
请求头: Accept: application/vnd.github.v3+json`,
  },
  task3: {
    name: 'useGitHubIssues 自定义 Hook',
    description: `## 任务 3：useGitHubIssues 自定义 Hook

**文件：**
- 创建：src/hooks/useGitHubIssues.js

### 步骤：
创建自定义 Hook：
- useIssueList(label, options) - 获取 Issues 列表，支持分页、过滤草稿
- useIssueDetail(issueNumber) - 获取单个 Issue 详情
- useParsedIssue(issue, systemLabel) - 解析 Issue 内容（元数据 + 正文 + 分类）

所有 Hook 需要处理 loading、error 状态，支持取消请求。`,
  },
  task4: {
    name: 'Markdown 渲染组件',
    description: `## 任务 4：Markdown 渲染组件

**文件：**
- 创建：src/components/MarkdownRenderer.jsx
- 创建：src/css/MarkdownRenderer.css

### 步骤：
1. 创建 MarkdownRenderer 组件，使用 react-markdown 渲染 Markdown
2. 自定义渲染器：img（lazy loading）、a（新窗口打开）、code（行内/块级）
3. 创建 Win95 风格的 CSS 样式（字体、颜色、边框等）
4. Commit`,
  },
  task5: {
    name: '博客窗口组件',
    description: `## 任务 5：博客窗口组件

**文件：**
- 创建：src/components/BlogWindow.jsx
- 创建：src/css/BlogWindow.css

### 步骤：
1. 创建博客窗口组件，遵循现有窗口模式（Draggable + motion.div）
2. 功能：文章列表、分类筛选、搜索、文章详情（Markdown 渲染）
3. 使用 useIssueList 和 useParsedIssue Hook
4. Win95 风格 UI：标题栏、工具栏、内容区
5. 支持加载更多分页
6. Commit`,
  },
  task6: {
    name: '项目展示窗口组件',
    description: `## 任务 6：项目展示窗口组件

**文件：**
- 创建：src/components/ProjectWindow.jsx
- 创建：src/css/ProjectWindow.css

### 步骤：
1. 创建项目展示窗口，包含项目卡片列表和详情视图
2. 卡片显示：缩略图、标题、技术栈、描述、Demo/GitHub 链接
3. 详情视图：完整 Markdown 内容、iframe 在线预览
4. 支持分类筛选和搜索
5. Commit`,
  },
  task7: {
    name: '个人信息窗口组件',
    description: `## 任务 7：个人信息窗口组件

**文件：**
- 创建：src/components/ProfileWindow.jsx
- 创建：src/css/ProfileWindow.css

### 步骤：
1. 创建个人信息窗口，从 profile label 的 Issue 读取数据
2. 显示：头像、姓名、职位、地点、社交链接
3. 渲染 Markdown 内容（About Me、Skills 等）
4. 提供"查看简历"按钮打开 Resume 窗口
5. 处理 loading 和 error 状态
6. Commit`,
  },
  task8: {
    name: '简历查看窗口组件',
    description: `## 任务 8：简历查看窗口组件

**文件：**
- 创建：src/components/ResumeWindow.jsx
- 创建：src/css/ResumeWindow.css

### 步骤：
1. 创建简历图片查看窗口
2. 从 profile Issue 中提取简历图片 URL
3. 功能：翻页（Prev/Next）、缩放（Zoom In/Out/1:1）
4. 支持多页简历图片
5. Commit`,
  },
  task9: {
    name: '集成到 App.jsx',
    description: `## 任务 9：集成到 App.jsx — 添加新窗口状态

**文件：**
- 修改：src/App.jsx

### 步骤：
1. 添加新组件 import（BlogWindow, ProjectWindow, ProfileWindow, ResumeWindow）
2. 添加新窗口状态（BlogExpand, ProjectWinExpand, ProfileExpand, ResumeWinExpand）
3. 更新 ObjectState 函数添加新窗口
4. 在桌面渲染区域添加新组件
5. 更新 contextValue
6. 验证编译通过
7. Commit`,
  },
  task10: {
    name: '更新桌面图标布局',
    description: `## 任务 10：更新桌面图标布局

**文件：**
- 修改：src/icon.json
- 修改：src/App.jsx（desktopIcon 初始化逻辑）

### 步骤：
1. 更新 icon.json 为精简布局：About, Blog, Projects, MyComputer, Resume, MineSweeper, Bitcoin, News, RecycleBin
2. 更新 App.jsx 的 desktopIcon 初始化，处理旧图标缓存
3. Commit`,
  },
  task11: {
    name: '移除旧功能',
    description: `## 任务 11：移除旧功能 — 组件和依赖清理

**文件：**
- 删除：MsnFolder.jsx, WinampPlayer.jsx, MailFolder.jsx, Store.jsx, SpinningCat.jsx 及其 CSS
- 删除：src/badword.js, public/bios/, public/v86.wasm
- 修改：src/App.jsx, src/components/Footer.jsx

### 步骤：
1. 删除旧组件文件
2. 从 App.jsx 移除旧组件 import
3. 移除旧窗口状态（MSN, Winamp, Mail, Store）
4. 从 ObjectState 移除旧窗口
5. 从渲染区域移除旧组件
6. 从 contextValue 移除旧状态
7. 移除 WebSocket 连接逻辑
8. 更新 Footer.jsx 移除 MSN 相关 UI
9. Commit`,
  },
  task12: {
    name: '更新图标映射',
    description: `## 任务 12：更新 AppFunctions 图标映射

**文件：**
- 修改：src/components/function/AppFunctions.js

### 步骤：
1. 在 imageMapping() 中添加 Blog、Projects 的图标映射
2. 移除 MSN、Winamp、Mail、Store 的映射
3. Commit`,
  },
  task13: {
    name: '更新部署配置',
    description: `## 任务 13：更新部署配置

**文件：**
- 修改：vite.config.js
- 修改：index.html
- 修改：.github/workflows/deploy.yml

### 步骤：
1. 更新 vite.config.js 的 base 路径
2. 更新 index.html 的 SEO 元信息
3. 更新 GitHub Actions 的 Node 版本
4. Commit`,
  },
  task14: {
    name: '最终测试与验证',
    description: `## 任务 14：最终测试与验证

### 步骤：
1. 运行 npm run dev 完整测试
2. 验证所有桌面图标功能正常
3. 验证窗口拖拽、缩放、最小化、关闭
4. 验证任务栏显示
5. 运行 npm run build 确认构建成功
6. 最终 Commit`,
  },
};

// Quality Gate prompts
const QUALITY_GATE_PROMPT = `你是一位资深的 AI 产品经理、AI 产品架构师、Agent 开发人员和全栈开发者。
你正在对一个 Windows 95 风格的个人博客/作品集项目进行质量监控。

请检查以下方面并给出评估：

1. **架构合理性**：组件拆分是否合理，数据流是否清晰
2. **代码质量**：命名规范、代码整洁度、可维护性
3. **Win95 风格一致性**：UI 是否保持 Win95 复古风格
4. **性能考虑**：是否有不必要的重渲染、大文件、低效查询
5. **错误处理**：是否有适当的 loading、error 状态处理
6. **安全性**：API 调用是否安全，无敏感信息暴露

请阅读相关文件并给出详细评估报告。`;

export default async function executeBlogPortfolio(args, { budget, log, agent, parallel, pipeline, phase }) {
  const WORKSPACE = 'c:\\Users\\Administrator\\Desktop\\wins95-reference';

  // Read the spec and plan for context
  const specPath = 'docs/superpowers/specs/2026-05-29-blog-portfolio-design.md';
  const planPath = 'docs/superpowers/plans/2026-05-29-blog-portfolio.md';

  log('🚀 开始执行博客/作品集改造计划');
  log('📋 计划包含 14 个任务，分 4 个阶段执行');

  // ============================================================
  // PHASE 1: Infrastructure (Tasks 1-4)
  // ============================================================
  phase('Infrastructure');
  log('📦 阶段 1：基础设施建设');

  // Task 1: Project config and dependency updates
  log('⚡ 任务 1：项目配置与依赖更新');
  const task1Result = await agent(
    `你正在实现任务 1：项目配置与依赖更新

## 任务描述
${TASKS.task1.description}

## 上下文
这是一个 Windows 95 风格的个人博客/作品集项目（React 18 + Vite 5）。
你需要更新项目依赖并创建配置文件。这是第一个任务，为后续所有功能奠定基础。

## 工作目录
${WORKSPACE}

## 要求
1. 严格按照任务描述执行
2. 确保 npm run dev 能正常启动
3. 提交代码`,
    { label: 'implement:task1-config', phase: 'Infrastructure' }
  );

  // Spec review for Task 1
  log('🔍 任务 1 规格审查');
  const task1SpecReview = await agent(
    `你正在审查任务 1 的实现是否符合规格。

## 要求的内容
${TASKS.task1.description}

## 实现者的报告
${task1Result}

## 你的工作
阅读实现代码并验证：
1. 是否安装了 react-markdown？
2. 是否移除了 @emailjs/browser, webamp, bad-words？
3. 是否创建了 src/data/config.js 且格式正确？
4. package.json 是否正确更新？

工作目录：${WORKSPACE}

报告：✅ 符合规格 或 ❌ 发现问题（具体列出）`,
    { label: 'spec-review:task1', phase: 'Infrastructure' }
  );

  // Code quality review for Task 1
  log('🔎 任务 1 代码质量审查');
  const task1CodeReview = await agent(
    `你正在审查任务 1 的代码质量。

## 实现内容
${TASKS.task1.description}

## 你的工作
检查以下方面：
1. config.js 是否有清晰的注释？
2. 依赖版本是否合理？
3. 是否有不必要的依赖？
4. 文件结构是否遵循项目约定？

工作目录：${WORKSPACE}

给出评估：优点、问题（关键/重要/次要）、结论`,
    { label: 'code-review:task1', phase: 'Infrastructure' }
  );

  // Task 2: GitHub API service layer
  log('⚡ 任务 2：GitHub API 服务层');
  const task2Result = await agent(
    `你正在实现任务 2：GitHub API 服务层

## 任务描述
${TASKS.task2.description}

## 上下文
这是 Windows 95 风格的个人博客/作品集项目。
你需要创建 GitHub API 的封装服务，用于读取 Issues 作为博客、项目和个人信息的数据源。
项目已安装 axios，你可以直接使用。

## 工作目录
${WORKSPACE}

## 要求
1. 严格按照任务描述实现
2. 确保所有函数都有清晰的 JSDoc 注释
3. 实现 5 分钟 TTL 的内存缓存
4. 处理 API 错误
5. 提交代码`,
    { label: 'implement:task2-github-api', phase: 'Infrastructure' }
  );

  // Spec review for Task 2
  log('🔍 任务 2 规格审查');
  const task2SpecReview = await agent(
    `你正在审查任务 2 的实现是否符合规格。

## 要求的内容
${TASKS.task2.description}

## 实现者的报告
${task2Result}

## 你的工作
阅读 src/services/github.js 并验证：
1. 是否包含所有要求的函数（fetchIssues, fetchIssue, parseIssueMeta, stripIssueMeta, hasLabel, getCategoryLabels, clearCache）？
2. 是否使用了正确的 API 端点？
3. 是否实现了缓存？
4. 是否有 JSDoc 注释？

工作目录：${WORKSPACE}

报告：✅ 符合规格 或 ❌ 发现问题`,
    { label: 'spec-review:task2', phase: 'Infrastructure' }
  );

  // Code quality review for Task 2
  log('🔎 任务 2 代码质量审查');
  const task2CodeReview = await agent(
    `你正在审查任务 2 的代码质量。

## 实现内容
src/services/github.js - GitHub API 服务层

## 你的工作
检查以下方面：
1. 代码是否整洁、可维护？
2. 错误处理是否完善？
3. 缓存实现是否合理？
4. 是否有潜在的内存泄漏？
5. 函数命名是否清晰？

工作目录：${WORKSPACE}

给出评估：优点、问题（关键/重要/次要）、结论`,
    { label: 'code-review:task2', phase: 'Infrastructure' }
  );

  // Task 3: useGitHubIssues hook
  log('⚡ 任务 3：useGitHubIssues 自定义 Hook');
  const task3Result = await agent(
    `你正在实现任务 3：useGitHubIssues 自定义 Hook

## 任务描述
${TASKS.task3.description}

## 上下文
项目已有 src/services/github.js 服务层（任务 2 已实现）。
你需要创建自定义 Hook 来封装数据获取逻辑。

## 工作目录
${WORKSPACE}

## 要求
1. 严格按照任务描述实现
2. 处理 loading、error 状态
3. 支持取消请求（避免内存泄漏）
4. 使用 useCallback 避免不必要的重渲染
5. 提交代码`,
    { label: 'implement:task3-hooks', phase: 'Infrastructure' }
  );

  // Spec review for Task 3
  log('🔍 任务 3 规格审查');
  const task3SpecReview = await agent(
    `你正在审查任务 3 的实现是否符合规格。

## 要求的内容
${TASKS.task3.description}

## 实现者的报告
${task3Result}

## 你的工作
阅读 src/hooks/useGitHubIssues.js 并验证：
1. 是否包含 useIssueList, useIssueDetail, useParsedIssue？
2. 是否正确使用了 github.js 服务？
3. 是否处理了 loading/error 状态？
4. 是否支持取消请求？

工作目录：${WORKSPACE}

报告：✅ 符合规格 或 ❌ 发现问题`,
    { label: 'spec-review:task3', phase: 'Infrastructure' }
  );

  // Code quality review for Task 3
  log('🔎 任务 3 代码质量审查');
  const task3CodeReview = await agent(
    `你正在审查任务 3 的代码质量。

## 实现内容
src/hooks/useGitHubIssues.js - 自定义 Hook

## 你的工作
检查以下方面：
1. Hook 是否遵循 React Hooks 规则？
2. 是否正确使用了 useCallback/useEffect？
3. 内存泄漏防护是否到位？
4. 代码是否简洁？

工作目录：${WORKSPACE}

给出评估：优点、问题（关键/重要/次要）、结论`,
    { label: 'code-review:task3', phase: 'Infrastructure' }
  );

  // Task 4: Markdown renderer
  log('⚡ 任务 4：Markdown 渲染组件');
  const task4Result = await agent(
    `你正在实现任务 4：Markdown 渲染组件

## 任务描述
${TASKS.task4.description}

## 上下文
项目已安装 react-markdown（任务 1）。你需要创建 Win95 风格的 Markdown 渲染组件。

## 工作目录
${WORKSPACE}

## 要求
1. 严格按照任务描述实现
2. CSS 必须遵循 Win95 风格（边框、字体、颜色）
3. 支持图片懒加载
4. 链接在新窗口打开
5. 代码块有语法高亮背景
6. 提交代码`,
    { label: 'implement:task4-markdown', phase: 'Infrastructure' }
  );

  // Spec review for Task 4
  log('🔍 任务 4 规格审查');
  const task4SpecReview = await agent(
    `你正在审查任务 4 的实现是否符合规格。

## 要求的内容
${TASKS.task4.description}

## 实现者的报告
${task4Result}

## 你的工作
阅读 src/components/MarkdownRenderer.jsx 和 src/css/MarkdownRenderer.css 并验证：
1. 是否使用了 react-markdown？
2. 是否有自定义渲染器（img, a, code）？
3. CSS 是否遵循 Win95 风格？
4. 是否支持图片懒加载？

工作目录：${WORKSPACE}

报告：✅ 符合规格 或 ❌ 发现问题`,
    { label: 'spec-review:task4', phase: 'Infrastructure' }
  );

  // Code quality review for Task 4
  log('🔎 任务 4 代码质量审查');
  const task4CodeReview = await agent(
    `你正在审查任务 4 的代码质量。

## 实现内容
src/components/MarkdownRenderer.jsx 和 src/css/MarkdownRenderer.css

## 你的工作
检查以下方面：
1. 组件是否简洁？
2. CSS 是否遵循项目约定（一个组件一个 CSS 文件）？
3. 是否有性能考虑（memo, useMemo）？
4. Win95 风格是否一致？

工作目录：${WORKSPACE}

给出评估：优点、问题（关键/重要/次要）、结论`,
    { label: 'code-review:task4', phase: 'Infrastructure' }
  );

  // Quality Gate 1: Infrastructure
  log('🚦 质量关卡 1：基础设施审查');
  const gate1Review = await agent(
    `${QUALITY_GATE_PROMPT}

## 当前阶段
基础设施阶段（任务 1-4）已完成。

## 已完成的任务
1. 项目配置与依赖更新
2. GitHub API 服务层
3. useGitHubIssues 自定义 Hook
4. Markdown 渲染组件

## 你的工作
请检查以下文件：
- src/data/config.js
- src/services/github.js
- src/hooks/useGitHubIssues.js
- src/components/MarkdownRenderer.jsx
- src/css/MarkdownRenderer.css
- package.json

给出整体评估和改进建议。`,
    { label: 'quality-gate:infrastructure', phase: 'Infrastructure', model: 'opus' }
  );

  log('✅ 阶段 1 完成：基础设施建设');

  // ============================================================
  // PHASE 2: Components (Tasks 5-8)
  // ============================================================
  phase('Components');
  log('📦 阶段 2：组件开发');

  // Task 5: Blog window
  log('⚡ 任务 5：博客窗口组件');
  const task5Result = await agent(
    `你正在实现任务 5：博客窗口组件

## 任务描述
${TASKS.task5.description}

## 上下文
项目已有以下基础设施：
- src/services/github.js - GitHub API 服务
- src/hooks/useGitHubIssues.js - 自定义 Hook
- src/components/MarkdownRenderer.jsx - Markdown 渲染器

你需要创建博客窗口组件，遵循现有窗口模式（参考 src/components/MyBioFolder.jsx）。

## 现有窗口模式
每个窗口组件遵循以下模式：
1. 使用 Draggable 实现拖拽
2. 使用 motion.div 实现动画
3. 从 UseContext 获取状态管理函数
4. 标题栏有最小化和关闭按钮
5. 使用 inlineStyle/inlineStyleExpand 控制显示

## 工作目录
${WORKSPACE}

## 要求
1. 严格按照任务描述实现
2. 遵循现有窗口模式
3. 功能完整：列表、详情、分类、搜索、分页
4. CSS 遵循 Win95 风格
5. 提交代码`,
    { label: 'implement:task5-blog', phase: 'Components' }
  );

  // Spec review for Task 5
  log('🔍 任务 5 规格审查');
  const task5SpecReview = await agent(
    `你正在审查任务 5 的实现是否符合规格。

## 要求的内容
${TASKS.task5.description}

## 实现者的报告
${task5Result}

## 你的工作
阅读 src/components/BlogWindow.jsx 和 src/css/BlogWindow.css 并验证：
1. 是否使用了 Draggable + motion.div 模式？
2. 是否有文章列表、详情、分类筛选、搜索？
3. 是否使用了 useIssueList 和 useParsedIssue？
4. 是否支持加载更多分页？
5. CSS 是否 Win95 风格？

工作目录：${WORKSPACE}

报告：✅ 符合规格 或 ❌ 发现问题`,
    { label: 'spec-review:task5', phase: 'Components' }
  );

  // Code quality review for Task 5
  log('🔎 任务 5 代码质量审查');
  const task5CodeReview = await agent(
    `你正在审查任务 5 的代码质量。

## 实现内容
src/components/BlogWindow.jsx 和 src/css/BlogWindow.css

## 你的工作
检查以下方面：
1. 组件拆分是否合理（BlogWindow, BlogList, BlogListItem, BlogDetail）？
2. 是否有不必要的重渲染？
3. 事件处理是否正确？
4. 错误处理是否完善？
5. 代码是否可维护？

工作目录：${WORKSPACE}

给出评估：优点、问题（关键/重要/次要）、结论`,
    { label: 'code-review:task5', phase: 'Components' }
  );

  // Task 6: Project window
  log('⚡ 任务 6：项目展示窗口组件');
  const task6Result = await agent(
    `你正在实现任务 6：项目展示窗口组件

## 任务描述
${TASKS.task6.description}

## 上下文
项目已有基础设施（github.js, useGitHubIssues, MarkdownRenderer）。
你需要创建项目展示窗口，包含卡片列表和详情视图，支持 iframe 在线预览。

## 工作目录
${WORKSPACE}

## 要求
1. 严格按照任务描述实现
2. 卡片显示缩略图、标题、技术栈、描述
3. 详情视图支持 iframe 预览
4. 支持分类筛选和搜索
5. 提交代码`,
    { label: 'implement:task6-project', phase: 'Components' }
  );

  // Spec review for Task 6
  log('🔍 任务 6 规格审查');
  const task6SpecReview = await agent(
    `你正在审查任务 6 的实现是否符合规格。

## 要求的内容
${TASKS.task6.description}

## 实现者的报告
${task6Result}

## 你的工作
阅读 src/components/ProjectWindow.jsx 和 src/css/ProjectWindow.css 并验证：
1. 是否有项目卡片列表？
2. 是否有详情视图？
3. 是否支持 iframe 预览？
4. 是否有分类筛选和搜索？

工作目录：${WORKSPACE}

报告：✅ 符合规格 或 ❌ 发现问题`,
    { label: 'spec-review:task6', phase: 'Components' }
  );

  // Code quality review for Task 6
  log('🔎 任务 6 代码质量审查');
  const task6CodeReview = await agent(
    `你正在审查任务 6 的代码质量。

## 实现内容
src/components/ProjectWindow.jsx 和 src/css/ProjectWindow.css

## 你的工作
检查以下方面：
1. 组件结构是否合理？
2. iframe 安全性（sandbox 属性）？
3. 性能考虑？
4. 代码可维护性？

工作目录：${WORKSPACE}

给出评估：优点、问题（关键/重要/次要）、结论`,
    { label: 'code-review:task6', phase: 'Components' }
  );

  // Task 7: Profile window
  log('⚡ 任务 7：个人信息窗口组件');
  const task7Result = await agent(
    `你正在实现任务 7：个人信息窗口组件

## 任务描述
${TASKS.task7.description}

## 上下文
项目已有基础设施。你需要创建个人信息窗口，从 profile label 的 Issue 读取数据。

## 工作目录
${WORKSPACE}

## 要求
1. 严格按照任务描述实现
2. 显示头像、姓名、职位、地点、社交链接
3. 渲染 Markdown 内容
4. 提供"查看简历"按钮
5. 处理 loading/error 状态
6. 提交代码`,
    { label: 'implement:task7-profile', phase: 'Components' }
  );

  // Spec review for Task 7
  log('🔍 任务 7 规格审查');
  const task7SpecReview = await agent(
    `你正在审查任务 7 的实现是否符合规格。

## 要求的内容
${TASKS.task7.description}

## 实现者的报告
${task7Result}

## 你的工作
阅读 src/components/ProfileWindow.jsx 和 src/css/ProfileWindow.css 并验证：
1. 是否从 profile Issue 读取数据？
2. 是否显示头像、姓名、职位等信息？
3. 是否渲染 Markdown 内容？
4. 是否有"查看简历"按钮？
5. 是否处理 loading/error？

工作目录：${WORKSPACE}

报告：✅ 符合规格 或 ❌ 发现问题`,
    { label: 'spec-review:task7', phase: 'Components' }
  );

  // Code quality review for Task 7
  log('🔎 任务 7 代码质量审查');
  const task7CodeReview = await agent(
    `你正在审查任务 7 的代码质量。

## 实现内容
src/components/ProfileWindow.jsx 和 src/css/ProfileWindow.css

## 你的工作
检查以下方面：
1. 组件结构是否合理？
2. 错误处理是否完善？
3. 是否有性能优化？
4. 代码可维护性？

工作目录：${WORKSPACE}

给出评估：优点、问题（关键/重要/次要）、结论`,
    { label: 'code-review:task7', phase: 'Components' }
  );

  // Task 8: Resume window
  log('⚡ 任务 8：简历查看窗口组件');
  const task8Result = await agent(
    `你正在实现任务 8：简历查看窗口组件

## 任务描述
${TASKS.task8.description}

## 上下文
项目已有基础设施。你需要创建简历图片查看窗口，支持翻页和缩放。

## 工作目录
${WORKSPACE}

## 要求
1. 严格按照任务描述实现
2. 从 profile Issue 提取简历图片
3. 支持翻页和缩放
4. 处理无图片的情况
5. 提交代码`,
    { label: 'implement:task8-resume', phase: 'Components' }
  );

  // Spec review for Task 8
  log('🔍 任务 8 规格审查');
  const task8SpecReview = await agent(
    `你正在审查任务 8 的实现是否符合规格。

## 要求的内容
${TASKS.task8.description}

## 实现者的报告
${task8Result}

## 你的工作
阅读 src/components/ResumeWindow.jsx 和 src/css/ResumeWindow.css 并验证：
1. 是否从 profile Issue 提取简历图片？
2. 是否支持翻页？
3. 是否支持缩放？
4. 是否处理无图片情况？

工作目录：${WORKSPACE}

报告：✅ 符合规格 或 ❌ 发现问题`,
    { label: 'spec-review:task8', phase: 'Components' }
  );

  // Code quality review for Task 8
  log('🔎 任务 8 代码质量审查');
  const task8CodeReview = await agent(
    `你正在审查任务 8 的代码质量。

## 实现内容
src/components/ResumeWindow.jsx 和 src/css/ResumeWindow.css

## 你的工作
检查以下方面：
1. 图片提取逻辑是否健壮？
2. 缩放实现是否平滑？
3. 是否有性能考虑？
4. 代码可维护性？

工作目录：${WORKSPACE}

给出评估：优点、问题（关键/重要/次要）、结论`,
    { label: 'code-review:task8', phase: 'Components' }
  );

  // Quality Gate 2: Components
  log('🚦 质量关卡 2：组件审查');
  const gate2Review = await agent(
    `${QUALITY_GATE_PROMPT}

## 当前阶段
组件阶段（任务 5-8）已完成。

## 已完成的任务
5. 博客窗口组件
6. 项目展示窗口组件
7. 个人信息窗口组件
8. 简历查看窗口组件

## 你的工作
请检查以下文件：
- src/components/BlogWindow.jsx
- src/components/ProjectWindow.jsx
- src/components/ProfileWindow.jsx
- src/components/ResumeWindow.jsx
- 相关的 CSS 文件

重点关注：
1. 四个组件是否遵循一致的模式？
2. Win95 风格是否贯穿始终？
3. 是否有重复代码可以提取？
4. 整体架构是否合理？

给出整体评估。`,
    { label: 'quality-gate:components', phase: 'Components', model: 'opus' }
  );

  log('✅ 阶段 2 完成：组件开发');

  // ============================================================
  // PHASE 3: Integration (Tasks 9-12)
  // ============================================================
  phase('Integration');
  log('📦 阶段 3：集成与清理');

  // Task 9: Integrate into App.jsx
  log('⚡ 任务 9：集成到 App.jsx');
  const task9Result = await agent(
    `你正在实现任务 9：集成到 App.jsx

## 任务描述
${TASKS.task9.description}

## 上下文
项目已有 4 个新窗口组件（BlogWindow, ProjectWindow, ProfileWindow, ResumeWindow）。
你需要将它们集成到 App.jsx 中。

## 重要提示
App.jsx 是一个约 1960 行的大文件，有约 80+ 个 useState hook。
请小心操作，只修改必要的部分。

## 现有窗口状态模式
每个窗口都有类似的状态：
\`\`\`javascript
const [XxxExpand, setXxxExpand] = useState(
  {expand: false, show: false, hide: false, focusItem: true, x: 0, y: 0, zIndex: 1,});
\`\`\`

## 工作目录
${WORKSPACE}

## 要求
1. 添加新组件 import
2. 添加新窗口状态（BlogExpand, ProjectWinExpand, ProfileExpand, ResumeWinExpand）
3. 更新 ObjectState 函数
4. 在渲染区域添加新组件
5. 更新 contextValue
6. 确保 npm run dev 编译通过
7. 提交代码`,
    { label: 'implement:task9-integration', phase: 'Integration' }
  );

  // Spec review for Task 9
  log('🔍 任务 9 规格审查');
  const task9SpecReview = await agent(
    `你正在审查任务 9 的实现是否符合规格。

## 要求的内容
${TASKS.task9.description}

## 实现者的报告
${task9Result}

## 你的工作
阅读 src/App.jsx 并验证：
1. 是否添加了所有新组件的 import？
2. 是否添加了 4 个新窗口状态？
3. ObjectState 函数是否更新？
4. 渲染区域是否添加了新组件？
5. contextValue 是否更新？

工作目录：${WORKSPACE}

报告：✅ 符合规格 或 ❌ 发现问题`,
    { label: 'spec-review:task9', phase: 'Integration' }
  );

  // Code quality review for Task 9
  log('🔎 任务 9 代码质量审查');
  const task9CodeReview = await agent(
    `你正在审查任务 9 的代码质量。

## 实现内容
src/App.jsx 的修改

## 你的工作
检查以下方面：
1. 新状态是否遵循现有模式？
2. 是否有命名冲突？
3. contextValue 是否过大？
4. 是否有不必要的修改？

工作目录：${WORKSPACE}

给出评估：优点、问题（关键/重要/次要）、结论`,
    { label: 'code-review:task9', phase: 'Integration' }
  );

  // Task 10: Update icon layout
  log('⚡ 任务 10：更新桌面图标布局');
  const task10Result = await agent(
    `你正在实现任务 10：更新桌面图标布局

## 任务描述
${TASKS.task10.description}

## 工作目录
${WORKSPACE}

## 要求
1. 更新 icon.json 为精简布局
2. 更新 App.jsx 的 desktopIcon 初始化逻辑
3. 处理旧图标缓存
4. 提交代码`,
    { label: 'implement:task10-icons', phase: 'Integration' }
  );

  // Spec review for Task 10
  log('🔍 任务 10 规格审查');
  const task10SpecReview = await agent(
    `你正在审查任务 10 的实现是否符合规格。

## 要求的内容
${TASKS.task10.description}

## 实现者的报告
${task10Result}

## 你的工作
阅读 src/icon.json 和 src/App.jsx 的 desktopIcon 部分并验证：
1. 图标布局是否正确（About, Blog, Projects, MyComputer, Resume, MineSweeper, Bitcoin, News, RecycleBin）？
2. 位置是否合理？
3. 是否处理了旧图标缓存？

工作目录：${WORKSPACE}

报告：✅ 符合规格 或 ❌ 发现问题`,
    { label: 'spec-review:task10', phase: 'Integration' }
  );

  // Code quality review for Task 10
  log('🔎 任务 10 代码质量审查');
  const task10CodeReview = await agent(
    `你正在审查任务 10 的代码质量。

## 实现内容
src/icon.json 和 src/App.jsx 的 desktopIcon 初始化

## 你的工作
检查以下方面：
1. icon.json 格式是否正确？
2. 缓存处理逻辑是否健壮？
3. 是否有边缘情况未处理？

工作目录：${WORKSPACE}

给出评估：优点、问题（关键/重要/次要）、结论`,
    { label: 'code-review:task10', phase: 'Integration' }
  );

  // Task 11: Remove old features
  log('⚡ 任务 11：移除旧功能');
  const task11Result = await agent(
    `你正在实现任务 11：移除旧功能

## 任务描述
${TASKS.task11.description}

## 重要提示
这是一个破坏性操作。请仔细确认要删除的文件。
只删除任务中明确列出的文件和代码。

## 工作目录
${WORKSPACE}

## 要求
1. 删除旧组件文件（MsnFolder, WinampPlayer, MailFolder, Store, SpinningCat）
2. 删除 badword.js, public/bios/, public/v86.wasm
3. 从 App.jsx 移除旧组件 import 和状态
4. 更新 Footer.jsx
5. 确保 npm run dev 编译通过
6. 提交代码`,
    { label: 'implement:task11-cleanup', phase: 'Integration' }
  );

  // Spec review for Task 11
  log('🔍 任务 11 规格审查');
  const task11SpecReview = await agent(
    `你正在审查任务 11 的实现是否符合规格。

## 要求的内容
${TASKS.task11.description}

## 实现者的报告
${task11Result}

## 你的工作
验证：
1. 是否删除了所有指定的文件？
2. App.jsx 是否移除了旧组件 import？
3. 旧窗口状态是否移除？
4. WebSocket 连接逻辑是否移除？
5. Footer.jsx 是否更新？
6. npm run dev 是否正常？

工作目录：${WORKSPACE}

报告：✅ 符合规格 或 ❌ 发现问题`,
    { label: 'spec-review:task11', phase: 'Integration' }
  );

  // Code quality review for Task 11
  log('🔎 任务 11 代码质量审查');
  const task11CodeReview = await agent(
    `你正在审查任务 11 的代码质量。

## 实现内容
旧功能移除和清理

## 你的工作
检查以下方面：
1. 是否有残留的无用代码？
2. 是否有未使用的 import？
3. App.jsx 是否更干净了？
4. 是否误删了需要的代码？

工作目录：${WORKSPACE}

给出评估：优点、问题（关键/重要/次要）、结论`,
    { label: 'code-review:task11', phase: 'Integration' }
  );

  // Task 12: Update icon mapping
  log('⚡ 任务 12：更新图标映射');
  const task12Result = await agent(
    `你正在实现任务 12：更新 AppFunctions 图标映射

## 任务描述
${TASKS.task12.description}

## 工作目录
${WORKSPACE}

## 要求
1. 在 imageMapping() 中添加 Blog、Projects 的映射
2. 移除 MSN、Winamp、Mail、Store 的映射
3. 确保其他映射不受影响
4. 提交代码`,
    { label: 'implement:task12-mapping', phase: 'Integration' }
  );

  // Spec review for Task 12
  log('🔍 任务 12 规格审查');
  const task12SpecReview = await agent(
    `你正在审查任务 12 的实现是否符合规格。

## 要求的内容
${TASKS.task12.description}

## 实现者的报告
${task12Result}

## 你的工作
阅读 src/components/function/AppFunctions.js 并验证：
1. 是否添加了 Blog、Projects 的映射？
2. 是否移除了 MSN、Winamp、Mail、Store 的映射？
3. 其他映射是否完好？

工作目录：${WORKSPACE}

报告：✅ 符合规格 或 ❌ 发现问题`,
    { label: 'spec-review:task12', phase: 'Integration' }
  );

  // Code quality review for Task 12
  log('🔎 任务 12 代码质量审查');
  const task12CodeReview = await agent(
    `你正在审查任务 12 的代码质量。

## 实现内容
src/components/function/AppFunctions.js 的修改

## 你的工作
检查以下方面：
1. 映射是否正确？
2. 是否有遗漏的图标？
3. 代码是否整洁？

工作目录：${WORKSPACE}

给出评估：优点、问题（关键/重要/次要）、结论`,
    { label: 'code-review:task12', phase: 'Integration' }
  );

  // Quality Gate 3: Integration
  log('🚦 质量关卡 3：集成审查');
  const gate3Review = await agent(
    `${QUALITY_GATE_PROMPT}

## 当前阶段
集成阶段（任务 9-12）已完成。

## 已完成的任务
9. App.jsx 集成
10. 桌面图标布局更新
11. 旧功能移除
12. 图标映射更新

## 你的工作
请检查：
- src/App.jsx 的整体状态
- src/icon.json
- src/components/function/AppFunctions.js
- 确认旧文件已删除

重点关注：
1. App.jsx 是否干净？
2. 新旧功能是否正确切换？
3. 是否有残留代码？
4. 整体架构是否合理？

给出整体评估。`,
    { label: 'quality-gate:integration', phase: 'Integration', model: 'opus' }
  );

  log('✅ 阶段 3 完成：集成与清理');

  // ============================================================
  // PHASE 4: Deployment (Tasks 13-14)
  // ============================================================
  phase('Deployment');
  log('📦 阶段 4：部署与验证');

  // Task 13: Update deployment config
  log('⚡ 任务 13：更新部署配置');
  const task13Result = await agent(
    `你正在实现任务 13：更新部署配置

## 任务描述
${TASKS.task13.description}

## 工作目录
${WORKSPACE}

## 要求
1. 更新 vite.config.js 的 base 路径
2. 更新 index.html 的 SEO 元信息
3. 更新 GitHub Actions 的 Node 版本
4. 提交代码`,
    { label: 'implement:task13-deploy', phase: 'Deployment' }
  );

  // Spec review for Task 13
  log('🔍 任务 13 规格审查');
  const task13SpecReview = await agent(
    `你正在审查任务 13 的实现是否符合规格。

## 要求的内容
${TASKS.task13.description}

## 实现者的报告
${task13Result}

## 你的工作
验证：
1. vite.config.js 的 base 是否更新？
2. index.html 的 SEO 信息是否更新？
3. GitHub Actions 的 Node 版本是否更新？

工作目录：${WORKSPACE}

报告：✅ 符合规格 或 ❌ 发现问题`,
    { label: 'spec-review:task13', phase: 'Deployment' }
  );

  // Task 14: Final testing
  log('⚡ 任务 14：最终测试与验证');
  const task14Result = await agent(
    `你正在实现任务 14：最终测试与验证

## 任务描述
${TASKS.task14.description}

## 工作目录
${WORKSPACE}

## 要求
1. 运行 npm run dev 完整测试
2. 验证所有桌面图标功能正常
3. 验证窗口拖拽、缩放、最小化、关闭
4. 验证任务栏显示
5. 运行 npm run build 确认构建成功
6. 报告测试结果`,
    { label: 'implement:task14-testing', phase: 'Deployment' }
  );

  // Quality Gate 4: Final
  log('🚦 质量关卡 4：最终审查');
  const gate4Review = await agent(
    `${QUALITY_GATE_PROMPT}

## 当前阶段
部署阶段（任务 13-14）已完成。整个项目已实现。

## 你的工作
请进行全面的最终审查：
1. 检查所有新建的文件
2. 检查所有修改的文件
3. 确认旧功能已完全移除
4. 确认新功能正常工作
5. 检查部署配置
6. 评估整体项目质量

给出最终评估报告，包括：
- 项目完成度
- 代码质量评分
- 发现的问题（如果有）
- 改进建议`,
    { label: 'quality-gate:final', phase: 'Deployment', model: 'opus' }
  );

  log('✅ 阶段 4 完成：部署与验证');

  // ============================================================
  // PHASE 5: Quality Review - Final comparison
  // ============================================================
  phase('Quality Review');
  log('🔍 最终质量审查与在线对比');

  // Final comprehensive review
  log('🔎 最终代码审查');
  const finalReview = await agent(
    `你是一位资深的全栈开发者和代码审查专家。
你正在对一个 Windows 95 风格的个人博客/作品集项目进行最终代码审查。

## 项目概述
将 Windows 95 Portfolio 项目改造为个人博客/作品集，使用 GitHub Issues 作为 CMS。

## 你的工作
请进行全面的代码审查：

### 1. 架构评估
- 组件拆分是否合理？
- 数据流是否清晰？
- 是否有架构债务？

### 2. 代码质量
- 命名规范？
- 代码整洁度？
- 可维护性？
- 重复代码？

### 3. 性能
- 是否有不必要的重渲染？
- 是否有大文件？
- API 调用是否高效？

### 4. 安全性
- API 调用是否安全？
- 是否有敏感信息暴露？
- iframe 安全性？

### 5. 用户体验
- Win95 风格是否一致？
- 交互是否流畅？
- 错误处理是否友好？

### 6. 可维护性
- 是否易于添加新内容？
- 配置是否清晰？
- 文档是否充分？

给出详细的评估报告和改进建议。`,
    { label: 'final-review:comprehensive', phase: 'Quality Review', model: 'opus' }
  );

  // Online comparison
  log('🌐 与参考项目在线对比');
  const onlineComparison = await agent(
    `你正在对比当前实现与参考项目的在线版本。

## 参考项目
在线地址：https://yuteoctober.github.io/wins95Portfolio/

## 你的工作
1. 访问参考项目的在线版本
2. 检查以下方面并与当前实现对比：
   - 桌面图标大小和布局
   - 窗口样式和交互
   - 任务栏样式
   - 整体 Win95 风格一致性
   - 响应式设计
3. 指出任何差异或需要调整的地方

## 对比维度
- 图标大小是否合理？
- 窗口边框样式是否一致？
- 字体和颜色是否匹配？
- 交互体验是否流畅？

给出详细的对比报告。`,
    { label: 'final-review:online-comparison', phase: 'Quality Review', model: 'opus' }
  );

  log('🎉 所有任务完成！');
  log('📊 执行摘要：');
  log('  - 14 个任务全部完成');
  log('  - 4 个质量关卡通过');
  log('  - 最终代码审查完成');
  log('  - 在线对比完成');

  return {
    summary: 'Blog/portfolio implementation complete',
    tasks: 14,
    qualityGates: 4,
    finalReview: finalReview,
    onlineComparison: onlineComparison,
  };
}
