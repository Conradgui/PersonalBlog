import UseContext from '../Context'
import { useContext, useState, useCallback, useMemo } from "react";
import Draggable from 'react-draggable'
import { motion } from 'framer-motion';
import { useIssueList, useParsedIssue } from '../hooks/useGitHubIssues.js';
import { config } from '../data/config.js';
import MarkdownRenderer from './MarkdownRenderer.jsx';
import '../css/BlogWindow.css'


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

  // 博客组件内部状态
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedIssue, setSelectedIssue] = useState(null);

  // 使用 hook 获取 Issues 列表
  const { issues, loading, error, loadMore, hasMore } = useIssueList(
    config.blog.label,
    { pageSize: config.blog.pageSize || 10 }
  );

  // 解析选中的 Issue
  const parsedSelected = useParsedIssue(selectedIssue, config.blog.label);

  // 提取所有分类标签
  const allCategories = useMemo(() => {
    const categories = new Set();
    issues.forEach(issue => {
      if (issue.labels) {
        issue.labels.forEach(label => {
          if (label.name !== config.blog.label && label.name !== config.blog.draftLabel) {
            categories.add(label.name);
          }
        });
      }
    });
    return Array.from(categories).sort();
  }, [issues]);

  // 过滤后的文章列表
  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      // 分类筛选
      if (categoryFilter !== 'all') {
        const hasCategory = issue.labels?.some(
          label => label.name === categoryFilter
        );
        if (!hasCategory) return false;
      }

      // 搜索筛选
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const title = (issue.title || '').toLowerCase();
        if (!title.includes(term)) return false;
      }

      return true;
    });
  }, [issues, categoryFilter, searchTerm]);

  // 格式化日期
  function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  // 获取 issue 的分类标签（排除系统标签）
  function getCategories(issue) {
    if (!issue.labels) return [];
    return issue.labels
      .map(label => label.name)
      .filter(name => name !== config.blog.label && name !== config.blog.draftLabel);
  }

  // 点击文章标题打开详情
  function handleSelectIssue(issue) {
    setSelectedIssue(issue);
  }

  // 返回列表
  function handleBackToList() {
    setSelectedIssue(null);
  }

  // 拖拽停止
  function handleDragStop(event, data) {
    const positionX = data.x
    const positionY = data.y
    setBlogExpand(prev => ({
      ...prev,
      x: positionX,
      y: positionY
    }))
  }

  return (
    <>
      <Draggable
        axis="both"
        handle={'.folder_dragbar'}
        grid={[1, 1]}
        scale={1}
        disabled={BlogExpand.expand}
        bounds={{top: 0}}
        defaultPosition={{
          x: window.innerWidth <= 500 ? 35 : 90,
          y: window.innerWidth <= 500 ? 50 : 50,
        }}
        onStop={(event, data) => handleDragStop(event, data)}
        onStart={() => handleSetFocusItemTrue('Blog')}
      >
        <motion.div className='blog_folder'
            onClick={(e) => {
              e.stopPropagation();
              handleSetFocusItemTrue('Blog');
            }}
            style={ BlogExpand.expand ? inlineStyleExpand('Blog') : inlineStyle('Blog')}>

          {/* 标题栏 */}
          <div className="folder_dragbar"
             style={{ background: BlogExpand.focusItem? themeDragBar : '#757579'}}
          >
            <div className="blog_barname">
              <span>Blog</span>
            </div>
            <div className="blog_barbtn">
              <div onClick={ !isTouchDevice ? (e) => {
                e.stopPropagation()
                setBlogExpand(prev => ({...prev, hide: true, focusItem: false}))
                StyleHide('Blog')
              } : undefined
              }
                onTouchEnd={(e) => {
                e.stopPropagation()
                setBlogExpand(prev => ({...prev, hide: true, focusItem: false}))
                StyleHide('Blog')
              }}
              onTouchStart={(e) => e.stopPropagation()}
              >
                <p className='dash'></p>
              </div>

              <div>
                <p className='x'
                  onClick={!isTouchDevice ? () => {
                    deleteTap('Blog')
                    setSelectedIssue(null)
                    setSearchTerm('')
                    setCategoryFilter('all')
                  }: undefined}
                  onTouchEnd={() => {
                    deleteTap('Blog')
                    setSelectedIssue(null)
                    setSearchTerm('')
                    setCategoryFilter('all')
                  }}
                >x
                </p>
              </div>
            </div>
          </div>

          {/* 工具栏 */}
          {!selectedIssue && (
            <div className="blog_toolbar">
              <label htmlFor="blog-category">Category:</label>
              <select
                id="blog-category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All</option>
                {allCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}

          {/* 内容区 */}
          <div className="blog_content">
            {/* 错误状态 */}
            {error && (
              <div className="blog_error">Error: {error}</div>
            )}

            {/* 加载状态（仅首次） */}
            {loading && issues.length === 0 && (
              <div className="blog_loading">Loading articles...</div>
            )}

            {/* 文章详情视图 */}
            {selectedIssue ? (
              <div className="blog_detail">
                <div className="blog_detail_header">
                  <button className="blog_back_btn" onClick={handleBackToList}>
                    Back
                  </button>
                  <span className="blog_detail_title">
                    {parsedSelected.title}
                  </span>
                </div>
                <div className="blog_detail_meta">
                  <span>Date: {formatDate(parsedSelected.createdAt)}</span>
                  {parsedSelected.categories.length > 0 && (
                    <span>Tags: {parsedSelected.categories.join(', ')}</span>
                  )}
                </div>
                <div className="blog_detail_body">
                  <MarkdownRenderer content={parsedSelected.content} />
                </div>
              </div>
            ) : (
              /* 文章列表视图 */
              <>
                <div className="blog_list">
                  {filteredIssues.map((issue) => (
                    <div
                      className="blog_list_item"
                      key={issue.number}
                      onClick={() => handleSelectIssue(issue)}
                    >
                      <div className="blog_item_header">
                        <span className="blog_item_title">{issue.title}</span>
                        <span className="blog_item_date">
                          {formatDate(issue.created_at)}
                        </span>
                      </div>
                      {getCategories(issue).length > 0 && (
                        <div className="blog_item_categories">
                          {getCategories(issue).map(cat => (
                            <span className="blog_item_category" key={cat}>
                              {cat}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* 空状态 */}
                  {!loading && filteredIssues.length === 0 && (
                    <div className="blog_empty">
                      {issues.length === 0
                        ? 'No articles found.'
                        : 'No articles match your search.'}
                    </div>
                  )}
                </div>

                {/* 加载更多 */}
                {hasMore && !searchTerm && categoryFilter === 'all' && (
                  <div className="blog_load_more">
                    <button
                      className="blog_load_more_btn"
                      onClick={loadMore}
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : 'Load More'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* 状态栏 */}
          <div className="blog_status_bar">
            <p>
              {selectedIssue
                ? `Article #${selectedIssue.number}`
                : `${filteredIssues.length} article(s)`}
            </p>
          </div>

        </motion.div>
      </Draggable>
    </>
  )
}

export default BlogWindow
