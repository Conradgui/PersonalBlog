# 个人博客/作品集改造实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 将 Windows 95 Portfolio 项目改造为个人博客/作品集，使用 GitHub Issues 作为 CMS

**架构：** 前端通过 GitHub REST API 读取公开 Issues 作为博客、项目和个人信息的数据源。新增 4 个窗口组件（BlogWindow、ProjectWindow、ProfileWindow、ResumeWindow），移除 MSN/Winamp/Email/Store 等不需要的功能。

**技术栈：** React 18.2, Vite 5, axios, react-markdown, GitHub REST API

---

## 文件结构

### 新建文件
| 文件 | 职责 |
|------|------|
| `src/data/config.js` | GitHub 仓库配置（owner, repo, labels） |
| `src/services/github.js` | GitHub API 封装（fetchIssues, fetchIssue, parseIssueMeta） |
| `src/hooks/useGitHubIssues.js` | 自定义 Hook：获取和缓存 Issues |
| `src/components/MarkdownRenderer.jsx` | Markdown 渲染组件（基于 react-markdown） |
| `src/components/BlogWindow.jsx` | 博客列表 + 文章详情窗口 |
| `src/css/BlogWindow.css` | 博客窗口样式 |
| `src/components/ProjectWindow.jsx` | 项目卡片 + 详情 + iframe 预览 |
| `src/css/ProjectWindow.css` | 项目窗口样式 |
| `src/components/ProfileWindow.jsx` | 个人信息展示窗口 |
| `src/css/ProfileWindow.css` | 个人信息窗口样式 |
| `src/components/ResumeWindow.jsx` | 简历图片查看窗口（缩放/翻页） |
| `src/css/ResumeWindow.css` | 简历窗口样式 |

### 修改文件
| 文件 | 修改内容 |
|------|----------|
| `package.json` | 新增 react-markdown，移除 @emailjs/browser, webamp, bad-words |
| `src/App.jsx` | 添加新窗口状态，移除 MSN/Winamp/Email/Store 状态和组件引用 |
| `src/icon.json` | 重新组织桌面图标布局 |
| `src/components/function/AppFunctions.js` | 更新图标映射 |
| `src/components/Footer.jsx` | 移除 MSN 相关 UI |
| `vite.config.js` | 更新 base 路径 |
| `index.html` | 更新 SEO 元信息 |
| `.github/workflows/deploy.yml` | 更新 Node 版本 |

### 删除文件
| 文件 | 理由 |
|------|------|
| `src/components/MsnFolder.jsx` | MSN 聊天移除 |
| `src/css/MsnFolder.css` | MSN 聊天移除 |
| `src/components/WinampPlayer.jsx` | Winamp 移除 |
| `src/css/WinampPlayer.css` | Winamp 移除 |
| `src/components/MailFolder.jsx` | 邮件表单移除 |
| `src/css/MailFolder.css` | 邮件表单移除 |
| `src/components/Store.jsx` | 应用商店移除 |
| `src/css/Store.css` | 应用商店移除 |
| `src/components/SpinningCat.jsx` | 忍者猫移除 |
| `src/css/SpinningCat.css` | 忍者猫移除 |
| `src/badword.js` | 脏话过滤器移除 |
| `public/bios/` | v86 模拟器移除 |
| `public/v86.wasm` | v86 模拟器移除 |

---

## 任务 1：项目配置与依赖更新

**文件：**
- 修改：`package.json`
- 创建：`src/data/config.js`

- [ ] **步骤 1：安装新依赖**

```bash
cd c:\Users\Administrator\Desktop\wins95-reference
npm install react-markdown
```

- [ ] **步骤 2：移除旧依赖**

```bash
npm uninstall @emailjs/browser webamp bad-words
```

- [ ] **步骤 3：创建配置文件**

创建 `src/data/config.js`：

```javascript
// GitHub CMS 配置
// 修改这里的 owner 和 repo 即可连接到你的 GitHub Issues
export const config = {
  github: {
    owner: 'your-username',   // ← 替换为你的 GitHub 用户名
    repo: 'your-repo',        // ← 替换为你的仓库名
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
```

- [ ] **步骤 4：验证安装**

```bash
npm run dev
```

确认项目能正常启动（虽然功能还不可用）。

- [ ] **步骤 5：Commit**

```bash
git add package.json package-lock.json src/data/config.js
git commit -m "chore: update deps (add react-markdown, remove emailjs/webamp/badwords) and add config"
```

---

## 任务 2：GitHub API 服务层

**文件：**
- 创建：`src/services/github.js`

- [ ] **步骤 1：创建 GitHub API 服务**

创建 `src/services/github.js`：

```javascript
import axios from 'axios';
import { config } from '../data/config';

const GITHUB_API = 'https://api.github.com';
const { owner, repo } = config.github;

const api = axios.create({
  baseURL: `${GITHUB_API}/repos/${owner}/${repo}`,
  headers: {
    Accept: 'application/vnd.github.v3+json',
  },
});

// 缓存层
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 分钟

function getCached(key) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.time < CACHE_TTL) {
    return entry.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key, data) {
  cache.set(key, { data, time: Date.now() });
}

/**
 * 获取指定 label 的 Issues 列表
 * @param {string} label - Issue label (如 'blog', 'project', 'profile')
 * @param {number} page - 页码
 * @param {number} perPage - 每页数量
 * @returns {Promise<Array>} Issues 数组
 */
export async function fetchIssues(label, page = 1, perPage = 20) {
  const cacheKey = `issues:${label}:${page}:${perPage}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const res = await api.get('/issues', {
    params: {
      labels: label,
      state: 'open',
      per_page: perPage,
      page,
      sort: 'created',
      direction: 'desc',
    },
  });

  setCache(cacheKey, res.data);
  return res.data;
}

/**
 * 获取单个 Issue 详情
 * @param {number} number - Issue 编号
 * @returns {Promise<Object>} Issue 对象
 */
export async function fetchIssue(number) {
  const cacheKey = `issue:${number}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const res = await api.get(`/issues/${number}`);
  setCache(cacheKey, res.data);
  return res.data;
}

/**
 * 解析 Issue Body 中的元数据
 * 元数据格式：<!-- meta\nkey: value\n... -->
 * @param {string} body - Issue body
 * @returns {Object} 解析后的元数据对象
 */
export function parseIssueMeta(body) {
  if (!body) return {};
  const metaMatch = body.match(/<!--\s*meta\n([\s\S]*?)\n\s*-->/);
  if (!metaMatch) return {};

  const meta = {};
  metaMatch[1].split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      if (key && value) meta[key] = value;
    }
  });
  return meta;
}

/**
 * 移除 Issue Body 中的元数据注释，返回纯内容
 * @param {string} body - Issue body
 * @returns {string} 移除元数据后的 body
 */
export function stripIssueMeta(body) {
  if (!body) return '';
  return body.replace(/<!--\s*meta\n[\s\S]*?\n\s*-->\n*/g, '').trim();
}

/**
 * 检查 Issue 是否包含指定 label
 * @param {Object} issue - Issue 对象
 * @param {string} labelName - label 名称
 * @returns {boolean}
 */
export function hasLabel(issue, labelName) {
  return issue.labels?.some(l => l.name === labelName);
}

/**
 * 获取 Issue 的分类 labels（排除系统 label）
 * @param {Object} issue - Issue 对象
 * @param {string} systemLabel - 系统 label 名称（如 'blog', 'project'）
 * @returns {string[]} 分类标签数组
 */
export function getCategoryLabels(issue, systemLabel) {
  return issue.labels
    ?.map(l => l.name)
    .filter(name => name !== systemLabel && name !== 'draft') || [];
}

/**
 * 清除所有缓存
 */
export function clearCache() {
  cache.clear();
}
```

- [ ] **步骤 2：验证服务层无语法错误**

```bash
npm run dev
```

确认无编译错误。

- [ ] **步骤 3：Commit**

```bash
git add src/services/github.js
git commit -m "feat: add GitHub API service layer with caching"
```

---

## 任务 3：useGitHubIssues 自定义 Hook

**文件：**
- 创建：`src/hooks/useGitHubIssues.js`

- [ ] **步骤 1：创建自定义 Hook**

创建 `src/hooks/useGitHubIssues.js`：

```javascript
import { useState, useEffect, useCallback } from 'react';
import {
  fetchIssues,
  fetchIssue,
  parseIssueMeta,
  stripIssueMeta,
  hasLabel,
  getCategoryLabels,
} from '../services/github';
import { config } from '../data/config';

/**
 * 获取 Issues 列表的 Hook
 * @param {string} label - Issue label
 * @param {Object} options - 配置项
 * @param {boolean} options.filterDraft - 是否过滤草稿
 * @param {number} options.pageSize - 每页数量
 * @returns {{ issues: Array, loading: boolean, error: string, loadMore: Function, hasMore: boolean }}
 */
export function useIssueList(label, options = {}) {
  const { filterDraft = true, pageSize = config.blog.pageSize || 10 } = options;
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadIssues = useCallback(async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchIssues(label, pageNum, pageSize);

      const filtered = filterDraft
        ? data.filter(issue => !hasLabel(issue, 'draft'))
        : data;

      if (pageNum === 1) {
        setIssues(filtered);
      } else {
        setIssues(prev => [...prev, ...filtered]);
      }

      setHasMore(data.length === pageSize);
      setPage(pageNum);
    } catch (err) {
      setError(err.message || 'Failed to load issues');
    } finally {
      setLoading(false);
    }
  }, [label, filterDraft, pageSize]);

  useEffect(() => {
    loadIssues(1);
  }, [loadIssues]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadIssues(page + 1);
    }
  }, [loading, hasMore, page, loadIssues]);

  return { issues, loading, error, loadMore, hasMore, refresh: () => loadIssues(1) };
}

/**
 * 获取单个 Issue 详情的 Hook
 * @param {number} issueNumber - Issue 编号
 * @returns {{ issue: Object|null, loading: boolean, error: string }}
 */
export function useIssueDetail(issueNumber) {
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!issueNumber) return;

    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchIssue(issueNumber);
        if (!cancelled) {
          setIssue(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load issue');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [issueNumber]);

  return { issue, loading, error };
}

/**
 * 获取并解析 Issue 内容（含元数据）
 * @param {Object} issue - Issue 对象
 * @returns {{ meta: Object, content: string, categories: string[] }}
 */
export function useParsedIssue(issue, systemLabel) {
  if (!issue) return { meta: {}, content: '', categories: [] };

  const meta = parseIssueMeta(issue.body);
  const content = stripIssueMeta(issue.body);
  const categories = getCategoryLabels(issue, systemLabel);

  return { meta, content, categories };
}
```

- [ ] **步骤 2：Commit**

```bash
git add src/hooks/useGitHubIssues.js
git commit -m "feat: add useGitHubIssues hooks for list and detail"
```

---

## 任务 4：Markdown 渲染组件

**文件：**
- 创建：`src/components/MarkdownRenderer.jsx`
- 创建：`src/css/MarkdownRenderer.css`

- [ ] **步骤 1：创建 Markdown 渲染组件**

创建 `src/components/MarkdownRenderer.jsx`：

```jsx
import ReactMarkdown from 'react-markdown';
import '../css/MarkdownRenderer.css';

/**
 * Win95 风格的 Markdown 渲染组件
 * @param {Object} props
 * @param {string} props.content - Markdown 文本
 */
function MarkdownRenderer({ content }) {
  if (!content) return null;

  return (
    <div className="markdown-body">
      <ReactMarkdown
        components={{
          img: ({ node, ...props }) => (
            <img {...props} loading="lazy" alt={props.alt || ''} />
          ),
          a: ({ node, href, children, ...props }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
              {children}
            </a>
          ),
          code: ({ node, inline, className, children, ...props }) => {
            if (inline) {
              return <code className="md-inline-code" {...props}>{children}</code>;
            }
            return (
              <pre className="md-code-block">
                <code className={className} {...props}>{children}</code>
              </pre>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownRenderer;
```

- [ ] **步骤 2：创建 Markdown 样式**

创建 `src/css/MarkdownRenderer.css`：

```css
.markdown-body {
  font-family: 'MS Sans Serif 8pt bold', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 13px;
  line-height: 1.6;
  color: #222;
  padding: 8px;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.markdown-body h1 {
  font-size: 18px;
  margin: 16px 0 8px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 4px;
}

.markdown-body h2 {
  font-size: 16px;
  margin: 14px 0 6px;
}

.markdown-body h3 {
  font-size: 14px;
  margin: 12px 0 4px;
}

.markdown-body p {
  margin: 8px 0;
}

.markdown-body img {
  max-width: 100%;
  height: auto;
  border: 1px solid #888;
  margin: 8px 0;
}

.markdown-body a {
  color: #0000ff;
  text-decoration: underline;
}

.markdown-body a:hover {
  color: #ff0000;
}

.markdown-body ul,
.markdown-body ol {
  padding-left: 24px;
  margin: 8px 0;
}

.markdown-body li {
  margin: 4px 0;
}

.markdown-body blockquote {
  border-left: 3px solid #888;
  padding-left: 12px;
  margin: 8px 0;
  color: #555;
}

.markdown-body code.md-inline-code {
  background: #e8e8e8;
  border: 1px solid #ccc;
  padding: 1px 4px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
}

.markdown-body pre.md-code-block {
  background: #1e1e1e;
  color: #d4d4d4;
  border: 2px solid;
  border-color: #f5f2f2 #1e1d1d #1e1d1d #f5f2f2;
  padding: 8px;
  overflow-x: auto;
  margin: 8px 0;
}

.markdown-body pre.md-code-block code {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  background: none;
  border: none;
  padding: 0;
}

.markdown-body table {
  border-collapse: collapse;
  margin: 8px 0;
  width: 100%;
}

.markdown-body th,
.markdown-body td {
  border: 1px solid #888;
  padding: 4px 8px;
  text-align: left;
}

.markdown-body th {
  background: #c0c0c0;
  font-weight: bold;
}

.markdown-body hr {
  border: none;
  border-top: 1px solid #888;
  margin: 12px 0;
}
```

- [ ] **步骤 3：Commit**

```bash
git add src/components/MarkdownRenderer.jsx src/css/MarkdownRenderer.css
git commit -m "feat: add MarkdownRenderer component with Win95 styling"
```

---

## 任务 5：博客窗口组件

**文件：**
- 创建：`src/components/BlogWindow.jsx`
- 创建：`src/css/BlogWindow.css`

- [ ] **步骤 1：创建博客窗口组件**

创建 `src/components/BlogWindow.jsx`：

```jsx
import UseContext from '../Context';
import { useContext, useState, useMemo } from 'react';
import Draggable from 'react-draggable';
import { motion } from 'framer-motion';
import { useIssueList, useParsedIssue } from '../hooks/useGitHubIssues';
import { config } from '../data/config';
import MarkdownRenderer from './MarkdownRenderer';
import '../css/BlogWindow.css';

function BlogWindow() {
  const {
    themeDragBar,
    BlogExpand, setBlogExpand,
    StyleHide,
    isTouchDevice,
    handleSetFocusItemTrue,
    inlineStyleExpand,
    inlineStyle,
    deleteTap,
  } = useContext(UseContext);

  const { issues, loading, error, loadMore, hasMore } = useIssueList(
    config.blog.label,
    { pageSize: config.blog.pageSize }
  );

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 提取所有分类
  const allCategories = useMemo(() => {
    const cats = new Set();
    issues.forEach(issue => {
      issue.labels?.forEach(l => {
        if (l.name !== config.blog.label && l.name !== 'draft') {
          cats.add(l.name);
        }
      });
    });
    return Array.from(cats);
  }, [issues]);

  // 过滤文章
  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      const matchCategory = categoryFilter === 'all' ||
        issue.labels?.some(l => l.name === categoryFilter);
      const matchSearch = !searchQuery ||
        issue.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [issues, categoryFilter, searchQuery]);

  function handleDragStop(event, data) {
    setBlogExpand(prev => ({ ...prev, x: data.x, y: data.y }));
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
    });
  }

  function handleSelectIssue(issue) {
    setSelectedIssue(issue);
  }

  function handleBackToList() {
    setSelectedIssue(null);
  }

  return (
    <Draggable
      axis="both"
      handle={'.folder_dragbar'}
      grid={[1, 1]}
      scale={1}
      disabled={BlogExpand.expand}
      bounds={{ top: 0 }}
      defaultPosition={{
        x: window.innerWidth <= 500 ? 20 : 80,
        y: window.innerWidth <= 500 ? 20 : 50,
      }}
      onStop={handleDragStop}
      onStart={() => handleSetFocusItemTrue('Blog')}
    >
      <motion.div
        className="blog_window"
        onClick={(e) => {
          e.stopPropagation();
          handleSetFocusItemTrue('Blog');
        }}
        style={BlogExpand.expand ? inlineStyleExpand('Blog') : inlineStyle('Blog')}
      >
        {/* 标题栏 */}
        <div
          className="folder_dragbar"
          style={{ background: BlogExpand.focusItem ? themeDragBar : '#757579' }}
        >
          <div className="blog_barname">
            <span>📝 Blog</span>
          </div>
          <div className="bio_barbtn">
            <div
              onClick={!isTouchDevice ? (e) => {
                e.stopPropagation();
                setBlogExpand(prev => ({ ...prev, hide: true, focusItem: false }));
                StyleHide('Blog');
              } : undefined}
              onTouchEnd={(e) => {
                e.stopPropagation();
                setBlogExpand(prev => ({ ...prev, hide: true, focusItem: false }));
                StyleHide('Blog');
              }}
            >
              <p className="dash"></p>
            </div>
            <div>
              <p
                className="x"
                onClick={!isTouchDevice ? () => {
                  deleteTap('Blog');
                  setSelectedIssue(null);
                } : undefined}
                onTouchEnd={() => {
                  deleteTap('Blog');
                  setSelectedIssue(null);
                }}
              >×</p>
            </div>
          </div>
        </div>

        {/* 工具栏 */}
        <div className="blog_toolbar">
          {selectedIssue ? (
            <button className="blog_back_btn" onClick={handleBackToList}>
              ← 返回列表
            </button>
          ) : (
            <>
              <select
                className="blog_category_select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">全部分类</option>
                {allCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input
                className="blog_search_input"
                type="text"
                placeholder="搜索文章..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </>
          )}
        </div>

        {/* 内容区 */}
        <div className="blog_content">
          {selectedIssue ? (
            <BlogDetail issue={selectedIssue} />
          ) : (
            <BlogList
              issues={filteredIssues}
              loading={loading}
              error={error}
              onSelect={handleSelectIssue}
              formatDate={formatDate}
              systemLabel={config.blog.label}
            />
          )}
        </div>

        {/* 分页 */}
        {!selectedIssue && (
          <div className="blog_pagination">
            {hasMore && (
              <button className="blog_loadmore_btn" onClick={loadMore} disabled={loading}>
                {loading ? '加载中...' : '加载更多'}
              </button>
            )}
          </div>
        )}
      </motion.div>
    </Draggable>
  );
}

/** 博客文章列表 */
function BlogList({ issues, loading, error, onSelect, formatDate, systemLabel }) {
  if (error) {
    return <div className="blog_error">⚠️ 加载失败: {error}</div>;
  }

  if (loading && issues.length === 0) {
    return <div className="blog_loading">加载中...</div>;
  }

  if (issues.length === 0) {
    return <div className="blog_empty">暂无文章</div>;
  }

  return (
    <div className="blog_list">
      {issues.map(issue => (
        <BlogListItem
          key={issue.id}
          issue={issue}
          onClick={() => onSelect(issue)}
          formatDate={formatDate}
          systemLabel={systemLabel}
        />
      ))}
    </div>
  );
}

/** 单篇文章列表项 */
function BlogListItem({ issue, onClick, formatDate, systemLabel }) {
  const { categories } = useParsedIssue(issue, systemLabel);

  return (
    <div className="blog_list_item" onClick={onClick} onDoubleClick={onClick}>
      <div className="blog_item_icon">📄</div>
      <div className="blog_item_info">
        <div className="blog_item_title">{issue.title}</div>
        <div className="blog_item_meta">
          <span className="blog_item_date">{formatDate(issue.created_at)}</span>
          {categories.length > 0 && (
            <span className="blog_item_categories">
              {categories.map(c => (
                <span key={c} className="blog_tag">{c}</span>
              ))}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/** 文章详情 */
function BlogDetail({ issue }) {
  const { content, categories } = useParsedIssue(issue, config.blog.label);

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
    });
  }

  return (
    <div className="blog_detail">
      <h1 className="blog_detail_title">{issue.title}</h1>
      <div className="blog_detail_meta">
        <span>{formatDate(issue.created_at)}</span>
        {categories.length > 0 && (
          <span className="blog_detail_categories">
            {categories.map(c => <span key={c} className="blog_tag">{c}</span>)}
          </span>
        )}
      </div>
      <div className="blog_detail_body">
        <MarkdownRenderer content={content} />
      </div>
    </div>
  );
}

export default BlogWindow;
```

- [ ] **步骤 2：创建博客窗口样式**

创建 `src/css/BlogWindow.css`：

```css
.blog_window {
  position: absolute;
  width: 600px;
  max-width: 95vw;
  height: 500px;
  max-height: 85vh;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #f5f2f2 #1e1d1d #1e1d1d #f5f2f2;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.blog_barname {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 4px;
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.blog_toolbar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: #c0c0c0;
  border-bottom: 1px solid #888;
}

.blog_category_select {
  font-family: 'MS Sans Serif 8pt bold', sans-serif;
  font-size: 11px;
  padding: 2px 4px;
  border: 2px solid;
  border-color: #1e1d1d #f5f2f2 #f5f2f2 #1e1d1d;
  background: white;
}

.blog_search_input {
  font-family: 'MS Sans Serif 8pt bold', sans-serif;
  font-size: 11px;
  padding: 2px 4px;
  border: 2px solid;
  border-color: #1e1d1d #f5f2f2 #f5f2f2 #1e1d1d;
  background: white;
  flex: 1;
}

.blog_back_btn {
  font-family: 'MS Sans Serif 8pt bold', sans-serif;
  font-size: 11px;
  padding: 2px 8px;
  border: 2px solid;
  border-color: #f5f2f2 #1e1d1d #1e1d1d #f5f2f2;
  background: #c0c0c0;
  cursor: pointer;
}

.blog_back_btn:active {
  border-color: #1e1d1d #f5f2f2 #f5f2f2 #1e1d1d;
}

.blog_content {
  flex: 1;
  overflow-y: auto;
  background: white;
  border: 2px solid;
  border-color: #1e1d1d #f5f2f2 #f5f2f2 #1e1d1d;
  margin: 4px;
}

.blog_list {
  padding: 4px;
}

.blog_list_item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  cursor: pointer;
  border-bottom: 1px solid #e0e0e0;
}

.blog_list_item:hover {
  background: #0000aa;
  color: white;
}

.blog_list_item:hover .blog_item_date,
.blog_list_item:hover .blog_tag {
  color: white;
  border-color: white;
}

.blog_item_icon {
  font-size: 18px;
  flex-shrink: 0;
}

.blog_item_info {
  flex: 1;
  min-width: 0;
}

.blog_item_title {
  font-size: 13px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.blog_item_meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
  font-size: 11px;
  color: #666;
}

.blog_item_date {
  flex-shrink: 0;
}

.blog_item_categories {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.blog_tag {
  font-size: 10px;
  padding: 0 4px;
  border: 1px solid #888;
  background: #e8e8e8;
}

.blog_pagination {
  padding: 4px;
  text-align: center;
  border-top: 1px solid #888;
}

.blog_loadmore_btn {
  font-family: 'MS Sans Serif 8pt bold', sans-serif;
  font-size: 11px;
  padding: 2px 12px;
  border: 2px solid;
  border-color: #f5f2f2 #1e1d1d #1e1d1d #f5f2f2;
  background: #c0c0c0;
  cursor: pointer;
}

.blog_loadmore_btn:disabled {
  color: #888;
}

.blog_loading,
.blog_empty,
.blog_error {
  padding: 20px;
  text-align: center;
  font-size: 12px;
  color: #666;
}

.blog_error {
  color: #cc0000;
}

/* 文章详情 */
.blog_detail {
  padding: 12px;
}

.blog_detail_title {
  font-size: 18px;
  margin: 0 0 8px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 4px;
}

.blog_detail_meta {
  font-size: 11px;
  color: #666;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.blog_detail_categories {
  display: flex;
  gap: 4px;
}

.blog_detail_body {
  margin-top: 8px;
}
```

- [ ] **步骤 3：Commit**

```bash
git add src/components/BlogWindow.jsx src/css/BlogWindow.css
git commit -m "feat: add BlogWindow component with list, detail, search and category filter"
```

---

## 任务 6：项目展示窗口组件

**文件：**
- 创建：`src/components/ProjectWindow.jsx`
- 创建：`src/css/ProjectWindow.css`

- [ ] **步骤 1：创建项目展示窗口组件**

创建 `src/components/ProjectWindow.jsx`：

```jsx
import UseContext from '../Context';
import { useContext, useState, useMemo } from 'react';
import Draggable from 'react-draggable';
import { motion } from 'framer-motion';
import { useIssueList, useParsedIssue, useIssueDetail } from '../hooks/useGitHubIssues';
import { fetchIssues, parseIssueMeta, stripIssueMeta, getCategoryLabels } from '../services/github';
import { config } from '../data/config';
import MarkdownRenderer from './MarkdownRenderer';
import '../css/ProjectWindow.css';

function ProjectWindow() {
  const {
    themeDragBar,
    ProjectWinExpand, setProjectWinExpand,
    StyleHide,
    isTouchDevice,
    handleSetFocusItemTrue,
    inlineStyleExpand,
    inlineStyle,
    deleteTap,
  } = useContext(UseContext);

  const { issues, loading, error } = useIssueList(config.project.label, { filterDraft: false });
  const [selectedProject, setSelectedProject] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allCategories = useMemo(() => {
    const cats = new Set();
    issues.forEach(issue => {
      issue.labels?.forEach(l => {
        if (l.name !== config.project.label && l.name !== 'draft') {
          cats.add(l.name);
        }
      });
    });
    return Array.from(cats);
  }, [issues]);

  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      const matchCategory = categoryFilter === 'all' ||
        issue.labels?.some(l => l.name === categoryFilter);
      const matchSearch = !searchQuery ||
        issue.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [issues, categoryFilter, searchQuery]);

  function handleDragStop(event, data) {
    setProjectWinExpand(prev => ({ ...prev, x: data.x, y: data.y }));
  }

  return (
    <Draggable
      axis="both"
      handle={'.folder_dragbar'}
      grid={[1, 1]}
      scale={1}
      disabled={ProjectWinExpand.expand}
      bounds={{ top: 0 }}
      defaultPosition={{
        x: window.innerWidth <= 500 ? 20 : 100,
        y: window.innerWidth <= 500 ? 20 : 60,
      }}
      onStop={handleDragStop}
      onStart={() => handleSetFocusItemTrue('Projects')}
    >
      <motion.div
        className="project_window"
        onClick={(e) => {
          e.stopPropagation();
          handleSetFocusItemTrue('Projects');
        }}
        style={ProjectWinExpand.expand ? inlineStyleExpand('Projects') : inlineStyle('Projects')}
      >
        {/* 标题栏 */}
        <div
          className="folder_dragbar"
          style={{ background: ProjectWinExpand.focusItem ? themeDragBar : '#757579' }}
        >
          <div className="project_barname">
            <span>📂 Projects</span>
          </div>
          <div className="bio_barbtn">
            <div
              onClick={!isTouchDevice ? (e) => {
                e.stopPropagation();
                setProjectWinExpand(prev => ({ ...prev, hide: true, focusItem: false }));
                StyleHide('Projects');
              } : undefined}
              onTouchEnd={(e) => {
                e.stopPropagation();
                setProjectWinExpand(prev => ({ ...prev, hide: true, focusItem: false }));
                StyleHide('Projects');
              }}
            >
              <p className="dash"></p>
            </div>
            <div>
              <p
                className="x"
                onClick={!isTouchDevice ? () => {
                  deleteTap('Projects');
                  setSelectedProject(null);
                } : undefined}
                onTouchEnd={() => {
                  deleteTap('Projects');
                  setSelectedProject(null);
                }}
              >×</p>
            </div>
          </div>
        </div>

        {/* 工具栏 */}
        <div className="project_toolbar">
          {selectedProject ? (
            <button className="project_back_btn" onClick={() => setSelectedProject(null)}>
              ← 返回列表
            </button>
          ) : (
            <>
              <select
                className="project_category_select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">全部</option>
                {allCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input
                className="project_search_input"
                type="text"
                placeholder="搜索项目..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </>
          )}
        </div>

        {/* 内容区 */}
        <div className="project_content">
          {selectedProject ? (
            <ProjectDetail
              issue={selectedProject}
              onBack={() => setSelectedProject(null)}
            />
          ) : (
            <ProjectList
              issues={filteredIssues}
              loading={loading}
              error={error}
              onSelect={setSelectedProject}
              systemLabel={config.project.label}
            />
          )}
        </div>
      </motion.div>
    </Draggable>
  );
}

/** 项目列表 */
function ProjectList({ issues, loading, error, onSelect, systemLabel }) {
  if (error) return <div className="project_error">⚠️ 加载失败: {error}</div>;
  if (loading && issues.length === 0) return <div className="project_loading">加载中...</div>;
  if (issues.length === 0) return <div className="project_empty">暂无项目</div>;

  return (
    <div className="project_list">
      {issues.map(issue => (
        <ProjectCard
          key={issue.id}
          issue={issue}
          onClick={() => onSelect(issue)}
          systemLabel={systemLabel}
        />
      ))}
    </div>
  );
}

/** 项目卡片 */
function ProjectCard({ issue, onClick, systemLabel }) {
  const { meta, content, categories } = useParsedIssue(issue, systemLabel);
  const thumbnail = meta.thumbnail;
  const tech = meta.tech;
  const shortDesc = content.substring(0, 100) + (content.length > 100 ? '...' : '');

  return (
    <div className="project_card" onDoubleClick={onClick}>
      <div className="project_card_thumb">
        {thumbnail ? (
          <img src={thumbnail} alt={issue.title} />
        ) : (
          <div className="project_card_no_thumb">📦</div>
        )}
      </div>
      <div className="project_card_info">
        <div className="project_card_title">{issue.title}</div>
        {tech && <div className="project_card_tech">{tech}</div>}
        <div className="project_card_desc">{shortDesc}</div>
        <div className="project_card_actions">
          {meta.demo && (
            <a href={meta.demo} target="_blank" rel="noopener noreferrer"
              className="project_btn" onClick={e => e.stopPropagation()}>
              🌐 Demo
            </a>
          )}
          {meta.github && (
            <a href={meta.github} target="_blank" rel="noopener noreferrer"
              className="project_btn" onClick={e => e.stopPropagation()}>
              📂 GitHub
            </a>
          )}
          <button className="project_btn" onClick={(e) => { e.stopPropagation(); onClick(); }}>
            详情 →
          </button>
        </div>
        {categories.length > 0 && (
          <div className="project_card_tags">
            {categories.map(c => <span key={c} className="project_tag">{c}</span>)}
          </div>
        )}
      </div>
    </div>
  );
}

/** 项目详情 */
function ProjectDetail({ issue, onBack }) {
  const { meta, content, categories } = useParsedIssue(issue, config.project.label);
  const [showIframe, setShowIframe] = useState(false);

  return (
    <div className="project_detail">
      <div className="project_detail_header">
        <h1>{issue.title}</h1>
        <div className="project_detail_actions">
          {meta.demo && (
            <a href={meta.demo} target="_blank" rel="noopener noreferrer" className="project_btn">
              🌐 Demo
            </a>
          )}
          {meta.github && (
            <a href={meta.github} target="_blank" rel="noopener noreferrer" className="project_btn">
              📂 GitHub
            </a>
          )}
          {meta.demo && (
            <button className="project_btn" onClick={() => setShowIframe(!showIframe)}>
              {showIframe ? '关闭预览' : '🖥️ 在线预览'}
            </button>
          )}
        </div>
        {meta.tech && (
          <div className="project_detail_tech">
            <strong>技术栈：</strong> {meta.tech}
          </div>
        )}
        {categories.length > 0 && (
          <div className="project_detail_tags">
            {categories.map(c => <span key={c} className="project_tag">{c}</span>)}
          </div>
        )}
      </div>

      {showIframe && meta.demo && (
        <div className="project_iframe_container">
          <iframe
            src={meta.demo}
            title={issue.title}
            className="project_iframe"
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        </div>
      )}

      <div className="project_detail_body">
        <MarkdownRenderer content={content} />
      </div>
    </div>
  );
}

export default ProjectWindow;
```

- [ ] **步骤 2：创建项目窗口样式**

创建 `src/css/ProjectWindow.css`：

```css
.project_window {
  position: absolute;
  width: 650px;
  max-width: 95vw;
  height: 550px;
  max-height: 85vh;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #f5f2f2 #1e1d1d #1e1d1d #f5f2f2;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.project_barname {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 4px;
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.project_toolbar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: #c0c0c0;
  border-bottom: 1px solid #888;
}

.project_category_select,
.project_search_input {
  font-family: 'MS Sans Serif 8pt bold', sans-serif;
  font-size: 11px;
  padding: 2px 4px;
  border: 2px solid;
  border-color: #1e1d1d #f5f2f2 #f5f2f2 #1e1d1d;
  background: white;
}

.project_search_input {
  flex: 1;
}

.project_back_btn {
  font-family: 'MS Sans Serif 8pt bold', sans-serif;
  font-size: 11px;
  padding: 2px 8px;
  border: 2px solid;
  border-color: #f5f2f2 #1e1d1d #1e1d1d #f5f2f2;
  background: #c0c0c0;
  cursor: pointer;
}

.project_back_btn:active {
  border-color: #1e1d1d #f5f2f2 #f5f2f2 #1e1d1d;
}

.project_content {
  flex: 1;
  overflow-y: auto;
  background: white;
  border: 2px solid;
  border-color: #1e1d1d #f5f2f2 #f5f2f2 #1e1d1d;
  margin: 4px;
}

.project_list {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.project_card {
  display: flex;
  gap: 12px;
  padding: 8px;
  border: 1px solid #ccc;
  background: #f8f8f8;
  cursor: pointer;
}

.project_card:hover {
  background: #e0e0ff;
}

.project_card_thumb {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  overflow: hidden;
  border: 1px solid #888;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e8e8e8;
}

.project_card_thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project_card_no_thumb {
  font-size: 32px;
}

.project_card_info {
  flex: 1;
  min-width: 0;
}

.project_card_title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 2px;
}

.project_card_tech {
  font-size: 11px;
  color: #666;
  margin-bottom: 4px;
}

.project_card_desc {
  font-size: 11px;
  color: #444;
  margin-bottom: 6px;
}

.project_card_actions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.project_btn {
  font-family: 'MS Sans Serif 8pt bold', sans-serif;
  font-size: 10px;
  padding: 1px 6px;
  border: 2px solid;
  border-color: #f5f2f2 #1e1d1d #1e1d1d #f5f2f2;
  background: #c0c0c0;
  cursor: pointer;
  text-decoration: none;
  color: black;
  display: inline-block;
}

.project_btn:active {
  border-color: #1e1d1d #f5f2f2 #f5f2f2 #1e1d1d;
}

.project_card_tags {
  display: flex;
  gap: 4px;
  margin-top: 4px;
}

.project_tag {
  font-size: 10px;
  padding: 0 4px;
  border: 1px solid #888;
  background: #e8e8e8;
}

/* 项目详情 */
.project_detail {
  padding: 12px;
}

.project_detail_header h1 {
  font-size: 18px;
  margin: 0 0 8px;
}

.project_detail_actions {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}

.project_detail_tech {
  font-size: 12px;
  color: #444;
  margin-bottom: 6px;
}

.project_detail_tags {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
}

.project_iframe_container {
  width: 100%;
  height: 400px;
  border: 2px solid;
  border-color: #1e1d1d #f5f2f2 #f5f2f2 #1e1d1d;
  margin: 8px 0;
}

.project_iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.project_detail_body {
  margin-top: 12px;
  border-top: 1px solid #ccc;
  padding-top: 8px;
}

.project_loading,
.project_empty,
.project_error {
  padding: 20px;
  text-align: center;
  font-size: 12px;
  color: #666;
}

.project_error {
  color: #cc0000;
}
```

- [ ] **步骤 3：Commit**

```bash
git add src/components/ProjectWindow.jsx src/css/ProjectWindow.css
git commit -m "feat: add ProjectWindow component with cards, detail and iframe preview"
```

---

## 任务 7：个人信息窗口组件

**文件：**
- 创建：`src/components/ProfileWindow.jsx`
- 创建：`src/css/ProfileWindow.css`

- [ ] **步骤 1：创建个人信息窗口组件**

创建 `src/components/ProfileWindow.jsx`：

```jsx
import UseContext from '../Context';
import { useContext } from 'react';
import Draggable from 'react-draggable';
import { motion } from 'framer-motion';
import { useIssueList, useParsedIssue } from '../hooks/useGitHubIssues';
import { config } from '../data/config';
import MarkdownRenderer from './MarkdownRenderer';
import '../css/ProfileWindow.css';

function ProfileWindow({ onOpenResume }) {
  const {
    themeDragBar,
    ProfileExpand, setProfileExpand,
    StyleHide,
    isTouchDevice,
    handleSetFocusItemTrue,
    inlineStyleExpand,
    inlineStyle,
    deleteTap,
  } = useContext(UseContext);

  const { issues, loading, error } = useIssueList(config.profile.label, { filterDraft: false });
  const profileIssue = issues[0]; // profile 只取第一个

  function handleDragStop(event, data) {
    setProfileExpand(prev => ({ ...prev, x: data.x, y: data.y }));
  }

  if (loading) {
    return (
      <Draggable axis="both" handle={'.folder_dragbar'} grid={[1, 1]} scale={1}
        disabled={ProfileExpand.expand} bounds={{ top: 0 }}
        defaultPosition={{ x: window.innerWidth <= 500 ? 20 : 60, y: window.innerWidth <= 500 ? 20 : 30 }}
        onStop={handleDragStop} onStart={() => handleSetFocusItemTrue('About')}
      >
        <motion.div className="profile_window"
          onClick={(e) => { e.stopPropagation(); handleSetFocusItemTrue('About'); }}
          style={ProfileExpand.expand ? inlineStyleExpand('About') : inlineStyle('About')}
        >
          <div className="folder_dragbar" style={{ background: ProfileExpand.focusItem ? themeDragBar : '#757579' }}>
            <div className="profile_barname"><span>👤 About Me</span></div>
            <div className="bio_barbtn">
              <div onClick={!isTouchDevice ? (e) => { e.stopPropagation(); setProfileExpand(prev => ({...prev, hide: true, focusItem: false})); StyleHide('About'); } : undefined}
                onTouchEnd={(e) => { e.stopPropagation(); setProfileExpand(prev => ({...prev, hide: true, focusItem: false})); StyleHide('About'); }}>
                <p className="dash"></p>
              </div>
              <div><p className="x" onClick={!isTouchDevice ? () => deleteTap('About') : undefined}
                onTouchEnd={() => deleteTap('About')}>×</p></div>
            </div>
          </div>
          <div className="profile_loading">加载中...</div>
        </motion.div>
      </Draggable>
    );
  }

  if (error || !profileIssue) {
    return (
      <Draggable axis="both" handle={'.folder_dragbar'} grid={[1, 1]} scale={1}
        disabled={ProfileExpand.expand} bounds={{ top: 0 }}
        defaultPosition={{ x: window.innerWidth <= 500 ? 20 : 60, y: window.innerWidth <= 500 ? 20 : 30 }}
        onStop={handleDragStop} onStart={() => handleSetFocusItemTrue('About')}
      >
        <motion.div className="profile_window"
          onClick={(e) => { e.stopPropagation(); handleSetFocusItemTrue('About'); }}
          style={ProfileExpand.expand ? inlineStyleExpand('About') : inlineStyle('About')}
        >
          <div className="folder_dragbar" style={{ background: ProfileExpand.focusItem ? themeDragBar : '#757579' }}>
            <div className="profile_barname"><span>👤 About Me</span></div>
            <div className="bio_barbtn">
              <div onClick={!isTouchDevice ? (e) => { e.stopPropagation(); setProfileExpand(prev => ({...prev, hide: true, focusItem: false})); StyleHide('About'); } : undefined}
                onTouchEnd={(e) => { e.stopPropagation(); setProfileExpand(prev => ({...prev, hide: true, focusItem: false})); StyleHide('About'); }}>
                <p className="dash"></p>
              </div>
              <div><p className="x" onClick={!isTouchDevice ? () => deleteTap('About') : undefined}
                onTouchEnd={() => deleteTap('About')}>×</p></div>
            </div>
          </div>
          <div className="profile_error">
            {error ? `⚠️ ${error}` : '暂未配置个人信息，请在 GitHub Issues 中创建 Label 为 profile 的 Issue'}
          </div>
        </motion.div>
      </Draggable>
    );
  }

  return <ProfileContent issue={profileIssue} />;
}

function ProfileContent({ issue }) {
  const {
    themeDragBar,
    ProfileExpand, setProfileExpand,
    StyleHide,
    isTouchDevice,
    handleSetFocusItemTrue,
    inlineStyleExpand,
    inlineStyle,
    deleteTap,
    handleShow,
  } = useContext(UseContext);

  const { meta, content } = useParsedIssue(issue, config.profile.label);

  function handleDragStop(event, data) {
    setProfileExpand(prev => ({ ...prev, x: data.x, y: data.y }));
  }

  // 从 content 中提取各 section
  const sections = parseSections(content);

  return (
    <Draggable
      axis="both"
      handle={'.folder_dragbar'}
      grid={[1, 1]}
      scale={1}
      disabled={ProfileExpand.expand}
      bounds={{ top: 0 }}
      defaultPosition={{
        x: window.innerWidth <= 500 ? 20 : 60,
        y: window.innerWidth <= 500 ? 20 : 30,
      }}
      onStop={handleDragStop}
      onStart={() => handleSetFocusItemTrue('About')}
    >
      <motion.div
        className="profile_window"
        onClick={(e) => { e.stopPropagation(); handleSetFocusItemTrue('About'); }}
        style={ProfileExpand.expand ? inlineStyleExpand('About') : inlineStyle('About')}
      >
        <div
          className="folder_dragbar"
          style={{ background: ProfileExpand.focusItem ? themeDragBar : '#757579' }}
        >
          <div className="profile_barname">
            <span>👤 About Me</span>
          </div>
          <div className="bio_barbtn">
            <div
              onClick={!isTouchDevice ? (e) => {
                e.stopPropagation();
                setProfileExpand(prev => ({ ...prev, hide: true, focusItem: false }));
                StyleHide('About');
              } : undefined}
              onTouchEnd={(e) => {
                e.stopPropagation();
                setProfileExpand(prev => ({ ...prev, hide: true, focusItem: false }));
                StyleHide('About');
              }}
            >
              <p className="dash"></p>
            </div>
            <div>
              <p
                className="x"
                onClick={!isTouchDevice ? () => {
                  deleteTap('About');
                } : undefined}
                onTouchEnd={() => deleteTap('About')}
              >×</p>
            </div>
          </div>
        </div>

        <div className="profile_content">
          {/* 头部信息 */}
          <div className="profile_header">
            {meta.avatar && (
              <img src={meta.avatar} alt={meta.name} className="profile_avatar" />
            )}
            <div className="profile_header_info">
              <h1 className="profile_name">{meta.name || 'Your Name'}</h1>
              {meta.title && <p className="profile_title">{meta.title}</p>}
              {meta.location && <p className="profile_location">📍 {meta.location}</p>}
              <div className="profile_links">
                {meta.github && (
                  <a href={meta.github} target="_blank" rel="noopener noreferrer">GitHub</a>
                )}
                {meta.linkedin && (
                  <a href={meta.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                )}
                {meta.email && (
                  <a href={`mailto:${meta.email}`}>Email</a>
                )}
              </div>
            </div>
          </div>

          {/* 内容区域 */}
          <div className="profile_body">
            <MarkdownRenderer content={content} />
          </div>

          {/* 简历按钮 */}
          {sections.hasResume && (
            <div className="profile_resume_section">
              <button
                className="profile_resume_btn"
                onClick={() => handleShow('Resume')}
              >
                📄 查看简历
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </Draggable>
  );
}

/**
 * 解析 Markdown 内容中的 section
 */
function parseSections(content) {
  if (!content) return { hasResume: false };
  return {
    hasResume: content.includes('![简历') || content.includes('## 简历') || content.includes('## Resume'),
  };
}

export default ProfileWindow;
```

- [ ] **步骤 2：创建个人信息窗口样式**

创建 `src/css/ProfileWindow.css`：

```css
.profile_window {
  position: absolute;
  width: 500px;
  max-width: 95vw;
  height: 550px;
  max-height: 85vh;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #f5f2f2 #1e1d1d #1e1d1d #f5f2f2;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.profile_barname {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 4px;
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.profile_content {
  flex: 1;
  overflow-y: auto;
  background: white;
  border: 2px solid;
  border-color: #1e1d1d #f5f2f2 #f5f2f2 #1e1d1d;
  margin: 4px;
}

.profile_header {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-bottom: 1px solid #ccc;
  background: #f0f0f0;
}

.profile_avatar {
  width: 80px;
  height: 80px;
  border: 2px solid;
  border-color: #1e1d1d #f5f2f2 #f5f2f2 #1e1d1d;
  object-fit: cover;
}

.profile_header_info {
  flex: 1;
}

.profile_name {
  font-size: 18px;
  margin: 0 0 4px;
}

.profile_title {
  font-size: 13px;
  color: #444;
  margin: 0 0 2px;
}

.profile_location {
  font-size: 11px;
  color: #666;
  margin: 0 0 6px;
}

.profile_links {
  display: flex;
  gap: 8px;
  font-size: 11px;
}

.profile_links a {
  color: #0000ff;
  text-decoration: underline;
}

.profile_body {
  padding: 8px 12px;
}

.profile_resume_section {
  padding: 8px 12px;
  border-top: 1px solid #ccc;
  text-align: center;
}

.profile_resume_btn {
  font-family: 'MS Sans Serif 8pt bold', sans-serif;
  font-size: 12px;
  padding: 4px 16px;
  border: 2px solid;
  border-color: #f5f2f2 #1e1d1d #1e1d1d #f5f2f2;
  background: #c0c0c0;
  cursor: pointer;
}

.profile_resume_btn:active {
  border-color: #1e1d1d #f5f2f2 #f5f2f2 #1e1d1d;
}

.profile_loading,
.profile_error {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #666;
  padding: 20px;
  text-align: center;
}

.profile_error {
  color: #cc0000;
}
```

- [ ] **步骤 3：Commit**

```bash
git add src/components/ProfileWindow.jsx src/css/ProfileWindow.css
git commit -m "feat: add ProfileWindow component with dynamic content from GitHub Issues"
```

---

## 任务 8：简历查看窗口组件

**文件：**
- 创建：`src/components/ResumeWindow.jsx`
- 创建：`src/css/ResumeWindow.css`

- [ ] **步骤 1：创建简历查看窗口组件**

创建 `src/components/ResumeWindow.jsx`：

```jsx
import UseContext from '../Context';
import { useContext, useState } from 'react';
import Draggable from 'react-draggable';
import { motion } from 'framer-motion';
import { useIssueList, useParsedIssue } from '../hooks/useGitHubIssues';
import { config } from '../data/config';
import '../css/ResumeWindow.css';

function ResumeWindow() {
  const {
    themeDragBar,
    ResumeWinExpand, setResumeWinExpand,
    StyleHide,
    isTouchDevice,
    handleSetFocusItemTrue,
    inlineStyleExpand,
    inlineStyle,
    deleteTap,
  } = useContext(UseContext);

  const { issues, loading, error } = useIssueList(config.profile.label, { filterDraft: false });
  const profileIssue = issues[0];
  const { meta } = useParsedIssue(profileIssue, config.profile.label);

  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1);

  // 从 profile Issue 中提取简历图片
  const resumeImages = profileIssue
    ? extractResumeImages(profileIssue.body)
    : [];

  function handleDragStop(event, data) {
    setResumeWinExpand(prev => ({ ...prev, x: data.x, y: data.y }));
  }

  return (
    <Draggable
      axis="both"
      handle={'.folder_dragbar'}
      grid={[1, 1]}
      scale={1}
      disabled={ResumeWinExpand.expand}
      bounds={{ top: 0 }}
      defaultPosition={{
        x: window.innerWidth <= 500 ? 10 : 120,
        y: window.innerWidth <= 500 ? 10 : 40,
      }}
      onStop={handleDragStop}
      onStart={() => handleSetFocusItemTrue('Resume')}
    >
      <motion.div
        className="resume_window"
        onClick={(e) => { e.stopPropagation(); handleSetFocusItemTrue('Resume'); }}
        style={ResumeWinExpand.expand ? inlineStyleExpand('Resume') : inlineStyle('Resume')}
      >
        {/* 标题栏 */}
        <div
          className="folder_dragbar"
          style={{ background: ResumeWinExpand.focusItem ? themeDragBar : '#757579' }}
        >
          <div className="resume_barname">
            <span>📄 Resume</span>
          </div>
          <div className="bio_barbtn">
            <div
              onClick={!isTouchDevice ? (e) => {
                e.stopPropagation();
                setResumeWinExpand(prev => ({ ...prev, hide: true, focusItem: false }));
                StyleHide('Resume');
              } : undefined}
              onTouchEnd={(e) => {
                e.stopPropagation();
                setResumeWinExpand(prev => ({ ...prev, hide: true, focusItem: false }));
                StyleHide('Resume');
              }}
            >
              <p className="dash"></p>
            </div>
            <div>
              <p
                className="x"
                onClick={!isTouchDevice ? () => deleteTap('Resume') : undefined}
                onTouchEnd={() => deleteTap('Resume')}
              >×</p>
            </div>
          </div>
        </div>

        {/* 工具栏 */}
        <div className="resume_toolbar">
          <button
            className="resume_btn"
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage <= 0}
          >
            ← Prev
          </button>
          <span className="resume_page_info">
            Page {currentPage + 1} of {resumeImages.length || 1}
          </span>
          <button
            className="resume_btn"
            onClick={() => setCurrentPage(p => Math.min(resumeImages.length - 1, p + 1))}
            disabled={currentPage >= resumeImages.length - 1}
          >
            Next →
          </button>
          <span className="resume_separator">|</span>
          <button className="resume_btn" onClick={() => setZoom(z => Math.min(2, z + 0.2))}>
            🔍+
          </button>
          <button className="resume_btn" onClick={() => setZoom(z => Math.max(0.5, z - 0.2))}>
            🔍-
          </button>
          <button className="resume_btn" onClick={() => setZoom(1)}>
            1:1
          </button>
        </div>

        {/* 内容区 */}
        <div className="resume_content">
          {loading && <div className="resume_loading">加载中...</div>}
          {error && <div className="resume_error">⚠️ {error}</div>}
          {!loading && !error && resumeImages.length === 0 && (
            <div className="resume_empty">
              暂无简历图片。请在 GitHub Issues 的 Profile Issue 中添加简历图片。
            </div>
          )}
          {resumeImages.length > 0 && (
            <div className="resume_image_container" style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
              <img
                src={resumeImages[currentPage]}
                alt={`Resume page ${currentPage + 1}`}
                className="resume_image"
              />
            </div>
          )}
        </div>
      </motion.div>
    </Draggable>
  );
}

/**
 * 从 Issue Body 中提取简历图片 URL
 * 匹配 ![...](...) 格式中在"简历"或"Resume"标题下的图片
 */
function extractResumeImages(body) {
  if (!body) return [];

  const images = [];
  // 匹配所有 Markdown 图片
  const imgRegex = /!\[.*?\]\((.*?)\)/g;
  let match;

  // 先尝试找到简历部分
  const resumeSection = body.match(/##\s*(?:简历|Resume|CV)[\s\S]*?(?=##|$)/i);

  if (resumeSection) {
    while ((match = imgRegex.exec(resumeSection[0])) !== null) {
      images.push(match[1]);
    }
  }

  // 如果简历部分没找到图片，找所有图片
  if (images.length === 0) {
    imgRegex.lastIndex = 0;
    while ((match = imgRegex.exec(body)) !== null) {
      images.push(match[1]);
    }
  }

  return images;
}

export default ResumeWindow;
```

- [ ] **步骤 2：创建简历窗口样式**

创建 `src/css/ResumeWindow.css`：

```css
.resume_window {
  position: absolute;
  width: 600px;
  max-width: 95vw;
  height: 700px;
  max-height: 90vh;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #f5f2f2 #1e1d1d #1e1d1d #f5f2f2;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.resume_barname {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 4px;
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.resume_toolbar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: #c0c0c0;
  border-bottom: 1px solid #888;
}

.resume_btn {
  font-family: 'MS Sans Serif 8pt bold', sans-serif;
  font-size: 11px;
  padding: 2px 8px;
  border: 2px solid;
  border-color: #f5f2f2 #1e1d1d #1e1d1d #f5f2f2;
  background: #c0c0c0;
  cursor: pointer;
}

.resume_btn:disabled {
  color: #888;
  cursor: default;
}

.resume_btn:active:not(:disabled) {
  border-color: #1e1d1d #f5f2f2 #f5f2f2 #1e1d1d;
}

.resume_page_info {
  font-size: 11px;
  min-width: 80px;
  text-align: center;
}

.resume_separator {
  color: #888;
}

.resume_content {
  flex: 1;
  overflow: auto;
  background: #808080;
  border: 2px solid;
  border-color: #1e1d1d #f5f2f2 #f5f2f2 #1e1d1d;
  margin: 4px;
  display: flex;
  justify-content: center;
  padding: 8px;
}

.resume_image_container {
  transition: transform 0.2s ease;
}

.resume_image {
  max-width: 100%;
  height: auto;
  border: 1px solid #444;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.resume_loading,
.resume_empty,
.resume_error {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-size: 12px;
  color: #ccc;
  text-align: center;
  padding: 20px;
}

.resume_error {
  color: #ff6666;
}
```

- [ ] **步骤 3：Commit**

```bash
git add src/components/ResumeWindow.jsx src/css/ResumeWindow.css
git commit -m "feat: add ResumeWindow component with image viewer, zoom and pagination"
```

---

## 任务 9：集成到 App.jsx — 添加新窗口状态

**文件：**
- 修改：`src/App.jsx`

- [ ] **步骤 1：添加新组件导入**

在 `App.jsx` 的 import 区域添加：

```javascript
import BlogWindow from './components/BlogWindow';
import ProjectWindow from './components/ProjectWindow';
import ProfileWindow from './components/ProfileWindow';
import ResumeWindow from './components/ResumeWindow';
```

- [ ] **步骤 2：添加新窗口状态**

在现有窗口状态定义区域（约第 186-276 行附近）添加：

```javascript
const [BlogExpand, setBlogExpand] = useState(
  {expand: false, show: false, hide: false, focusItem: true, x: 0, y: 0, zIndex: 1,});

const [ProjectWinExpand, setProjectWinExpand] = useState(
  {expand: false, show: false, hide: false, focusItem: true, x: 0, y: 0, zIndex: 1,});

const [ProfileExpand, setProfileExpand] = useState(
  {expand: false, show: false, hide: false, focusItem: true, x: 0, y: 0, zIndex: 1,});

const [ResumeWinExpand, setResumeWinExpand] = useState(
  {expand: false, show: false, hide: false, focusItem: true, x: 0, y: 0, zIndex: 1,});
```

- [ ] **步骤 3：更新 ObjectState 函数**

在 `ObjectState()` 函数中添加新的窗口状态（需要找到该函数并添加新条目）：

```javascript
// 在 ObjectState 数组中添加：
{ name: 'Blog', expand: BlogExpand, setExpand: setBlogExpand },
{ name: 'Projects', expand: ProjectWinExpand, setExpand: setProjectWinExpand },
{ name: 'About', expand: ProfileExpand, setExpand: setProfileExpand },
{ name: 'Resume', expand: ResumeWinExpand, setExpand: setResumeWinExpand },
```

- [ ] **步骤 4：在桌面渲染区域添加新组件**

在桌面主渲染区域（return 语句中）添加新组件：

```jsx
{BlogExpand.show && !BlogExpand.hide && <BlogWindow />}
{ProjectWinExpand.show && !ProjectWinExpand.hide && <ProjectWindow />}
{ProfileExpand.show && !ProfileExpand.hide && <ProfileWindow />}
{ResumeWinExpand.show && !ResumeWinExpand.hide && <ResumeWindow />}
```

- [ ] **步骤 5：更新 contextValue**

在 `contextValue` 对象中添加新状态：

```javascript
BlogExpand, setBlogExpand,
ProjectWinExpand, setProjectWinExpand,
ProfileExpand, setProfileExpand,
ResumeWinExpand, setResumeWinExpand,
```

- [ ] **步骤 6：验证编译**

```bash
npm run dev
```

确认无编译错误。新窗口此时还不会显示在桌面上（icon.json 还没更新）。

- [ ] **步骤 7：Commit**

```bash
git add src/App.jsx
git commit -m "feat: integrate new window states (Blog, Projects, Profile, Resume) into App.jsx"
```

---

## 任务 10：更新桌面图标布局

**文件：**
- 修改：`src/icon.json`

- [ ] **步骤 1：更新 icon.json**

将 `icon.json` 替换为新的精简布局：

```json
[
    {
        "name": "About",
        "pic": "About",
        "folderId": "Desktop",
        "size": 4,
        "type": ".exe",
        "x": 1,
        "y": 1
    },
    {
        "name": "Blog",
        "pic": "Blog",
        "folderId": "Desktop",
        "size": 4,
        "type": ".exe",
        "x": 2,
        "y": 1
    },
    {
        "name": "Projects",
        "pic": "Project",
        "folderId": "Desktop",
        "size": 4,
        "type": ".exe",
        "x": 3,
        "y": 1
    },
    {
        "name": "MyComputer",
        "pic": "MyComputer",
        "folderId": "Desktop",
        "size": 4,
        "type": "Drive",
        "x": 1,
        "y": 2
    },
    {
        "name": "Resume",
        "pic": "Resume",
        "folderId": "Desktop",
        "size": 30,
        "type": ".exe",
        "x": 2,
        "y": 2
    },
    {
        "name": "MineSweeper",
        "pic": "MineSweeper",
        "folderId": "Desktop",
        "size": 250,
        "type": ".exe",
        "x": 1,
        "y": 3,
        "category": "Games",
        "description": "Classic Minesweeper game."
    },
    {
        "name": "Bitcoin",
        "pic": "Bitcoin",
        "folderId": "Desktop",
        "size": 500,
        "type": ".exe",
        "x": 2,
        "y": 3,
        "category": "Utilities",
        "description": "Real-time Bitcoin price tracker."
    },
    {
        "name": "News",
        "pic": "News",
        "folderId": "Desktop",
        "size": 500,
        "type": ".exe",
        "x": 3,
        "y": 3,
        "category": "Utilities",
        "description": "News reader with weather."
    },
    {
        "name": "RecycleBin",
        "pic": "RecycleBin",
        "folderId": "Desktop",
        "size": 250,
        "type": "ReCycleBin",
        "x": 1,
        "y": 4
    }
]
```

- [ ] **步骤 2：清除 localStorage 中的旧图标数据**

需要在开发时手动清除浏览器 localStorage 中的 `icons` 键，或在 App.jsx 的 desktopIcon 初始化逻辑中处理。

在 `App.jsx` 中更新 `desktopIcon` 的初始化逻辑，移除旧的 `deleteIcon` 过滤：

```javascript
const [desktopIcon, setDesktopIcon] = useState(() => {
  const localItems = localStorage.getItem('icons');
  // 如果本地有存储且数量合理，使用本地数据
  if (localItems) {
    const parsed = JSON.parse(localItems);
    // 如果本地数据包含已删除的旧图标，清除缓存
    const hasOldIcons = parsed.some(i => ['MSN', 'Winamp', 'Mail', 'Store', 'Cat', 'AiAgent'].includes(i.name));
    if (hasOldIcons) {
      localStorage.removeItem('icons');
      return iconInfo;
    }
    return parsed;
  }
  return iconInfo;
});
```

- [ ] **步骤 3：Commit**

```bash
git add src/icon.json src/App.jsx
git commit -m "feat: update desktop icon layout for blog/portfolio"
```

---

## 任务 11：移除旧功能 — 组件和依赖清理

**文件：**
- 删除：多个旧组件文件
- 修改：`src/App.jsx`, `src/components/Footer.jsx`, `src/components/function/AppFunctions.js`

- [ ] **步骤 1：删除旧组件文件**

```bash
rm src/components/MsnFolder.jsx src/css/MsnFolder.css
rm src/components/WinampPlayer.jsx src/css/WinampPlayer.css
rm src/components/MailFolder.jsx src/css/MailFolder.css
rm src/components/Store.jsx src/css/Store.css
rm src/components/SpinningCat.jsx src/css/SpinningCat.css
rm src/badword.js
rm -rf public/bios/
rm public/v86.wasm
```

- [ ] **步骤 2：从 App.jsx 移除旧组件导入**

从 App.jsx 的 import 区域移除：

```javascript
// 删除以下 import：
import { Filter } from 'bad-words';
import badword from './badword'
import Store from './components/Store';
import MailFolder from './components/MailFolder';
import WebampPlayer from './components/WinampPlayer';
import MsnFolder from './components/MsnFolder';
import SpinningCat from './components/SpinningCat';
```

- [ ] **步骤 3：从 App.jsx 移除旧窗口状态**

移除以下状态定义：

```javascript
// 删除：
const [MSNExpand, setMSNExpand] = useState(...)
const [WinampExpand, setWinampExpand] = useState(...)
const [MailExpand, setMailExpand] = useState(...)
const [StoreExpand, setStoreExpand] = useState(...)
const [ringMsn, setRingMsn] = useState(false)
const [websocketConnection, setWebsocketConnection] = useState(false)
const [chatBotActive, setChatBotActive] = useState(false)
const [runCatVideo, setRunCatVideo] = useState(false)
// 以及所有 MSN 聊天相关的 state（chatValue, chatData, loadedMessages 等）
// 以及 WebSocket 相关的 socket ref 和连接逻辑
```

- [ ] **步骤 4：从 ObjectState 移除旧窗口**

从 `ObjectState()` 函数中移除：

```javascript
// 删除：
{ name: 'MSN', expand: MSNExpand, setExpand: setMSNExpand },
{ name: 'Winamp', expand: WinampExpand, setExpand: setWinampExpand },
{ name: 'Mail', expand: MailExpand, setExpand: setMailExpand },
{ name: 'Store', expand: StoreExpand, setExpand: setStoreExpand },
```

- [ ] **步骤 5：从桌面渲染区域移除旧组件**

从 return 语句中移除：

```jsx
// 删除：
{MSNExpand.show && !MSNExpand.hide && <MsnFolder />}
{WinampExpand.show && !WinampExpand.hide && <WebampPlayer />}
{MailExpand.show && !MailExpand.hide && <MailFolder />}
{StoreExpand.show && !StoreExpand.hide && <Store />}
{runCatVideo && <SpinningCat />}
```

- [ ] **步骤 6：从 contextValue 移除旧状态**

从 contextValue 对象中移除 MSN、Winamp、Mail、Store 相关的状态。

- [ ] **步骤 7：移除 WebSocket 连接逻辑**

从 App.jsx 的 useEffect 中移除 WebSocket 连接代码（连接到 `wss://notebackend-wrqt.onrender.com` 的部分）。

- [ ] **步骤 8：更新 Footer.jsx**

从 Footer.jsx 移除 MSN 相关的 UI 元素（如 MSN 消息通知、MSN 状态等）。

- [ ] **步骤 9：更新 AppFunctions.js**

如果 `imageMapping()` 中有 MSN、Winamp、Mail、Store 的图标映射，移除它们。添加 Blog、Projects 的映射（如果需要）。

- [ ] **步骤 10：验证编译**

```bash
npm run dev
```

确认无编译错误。

- [ ] **步骤 11：Commit**

```bash
git add -A
git commit -m "refactor: remove MSN, Winamp, Mail, Store, SpinningCat and related code"
```

---

## 任务 12：更新 AppFunctions 图标映射

**文件：**
- 修改：`src/components/function/AppFunctions.js`

- [ ] **步骤 1：添加新图标映射**

在 `imageMapping()` 函数中添加 Blog 和 Projects 的图标映射。需要检查现有映射模式并添加：

```javascript
case 'Blog':
  return BlogIcon; // 需要导入或使用现有图标
case 'Projects':
  return ProjectIcon;
case 'News':
  return NewsIcon;
```

如果这些图标在 assets 中不存在，使用现有的类似图标或 emoji 作为替代。

- [ ] **步骤 2：Commit**

```bash
git add src/components/function/AppFunctions.js
git commit -m "feat: update icon mappings for new components"
```

---

## 任务 13：更新部署配置

**文件：**
- 修改：`vite.config.js`
- 修改：`index.html`
- 修改：`.github/workflows/deploy.yml`

- [ ] **步骤 1：更新 vite.config.js**

更新 base 路径为新仓库名（如果仓库名改变）：

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/your-new-repo-name/',  // ← 替换为你的仓库名
  build: {
    sourcemap: false,
  },
})
```

- [ ] **步骤 2：更新 index.html**

更新 SEO 元信息：

```html
<title>你的名字 - AI Product Manager | Portfolio & Blog</title>
<meta name="description" content="个人作品集与博客 - AI Product Manager，专注于 AI 产品开发、Agentic RAG 和全栈开发" />
<meta property="og:title" content="你的名字 - Portfolio & Blog" />
<meta property="og:description" content="个人作品集与博客" />
<meta name="twitter:title" content="你的名字 - Portfolio & Blog" />
<meta name="twitter:description" content="个人作品集与博客" />
```

- [ ] **步骤 3：更新 GitHub Actions 工作流**

更新 `.github/workflows/deploy.yml` 中的 Node 版本（从 16 升级到 20）：

```yaml
- name: Setup Node
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
```

- [ ] **步骤 4：Commit**

```bash
git add vite.config.js index.html .github/workflows/deploy.yml
git commit -m "chore: update deployment config, SEO, and Node version"
```

---

## 任务 14：最终测试与验证

- [ ] **步骤 1：本地完整测试**

```bash
npm run dev
```

逐项验证：
1. 桌面图标正确显示（About, Blog, Projects, MyComputer, Resume, MineSweeper, BTC, News, RecycleBin）
2. 双击 About 打开个人信息窗口
3. 双击 Blog 打开博客窗口（会显示加载状态，因为还没有配置 GitHub Issues）
4. 双击 Projects 打开项目窗口
5. 双击 Resume 打开简历窗口
6. 双击 MineSweeper 打开扫雷
7. 双击 BTC 打开比特币追踪器
8. 双击 News 打开新闻
9. 窗口拖拽、缩放、最小化、关闭正常
10. 任务栏显示打开的窗口
11. 右键菜单正常
12. Clippy 助手正常

- [ ] **步骤 2：构建测试**

```bash
npm run build
npm run preview
```

确认构建成功，无错误。

- [ ] **步骤 3：最终 Commit**

```bash
git add -A
git commit -m "chore: final cleanup and verification"
```

- [ ] **步骤 4：推送到 GitHub**

```bash
git push origin main
```

确认 GitHub Actions 自动部署成功。

---

## 内容初始化指引

部署完成后，需要在 GitHub 仓库中创建以下 Issues：

### 1. 创建 Labels
在仓库 Settings > Labels 中创建：
- `blog` — 博客文章
- `project` — 项目作品
- `profile` — 个人信息
- `draft` — 草稿（可选）

### 2. 创建 Profile Issue
- Title: `Profile`
- Label: `profile`
- Body:
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

在这里写你的个人简介...

## Skills

- Python, TypeScript, React
- FastAPI, LangChain, Neo4j
- PostgreSQL, Docker

## 简历

![简历](拖拽上传你的简历图片)
```

### 3. 创建示例 Blog Issue
- Title: `Hello World - 我的第一篇博客`
- Label: `blog`, `随笔`
- Body: 任意 Markdown 内容

### 4. 创建示例 Project Issue
- Title: `个人博客系统`
- Label: `project`, `全栈`
- Body:
```markdown
<!-- meta
thumbnail: https://xxx.png
tech: React, Vite, GitHub Issues
demo: https://yourname.github.io/your-repo/
github: https://github.com/yourname/your-repo
featured: true
-->

## 项目介绍

Windows 95 风格的个人博客和作品集...
```

### 5. 修改 config.js
将 `src/data/config.js` 中的 `owner` 和 `repo` 替换为你的实际 GitHub 用户名和仓库名。
