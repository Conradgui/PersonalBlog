import UseContext from '../Context'
import { useContext, useState, useMemo } from "react";
import Draggable from 'react-draggable'
import { motion } from 'framer-motion';
import { useIssueList, useParsedIssue } from '../hooks/useGitHubIssues.js';
import { config } from '../data/config.js';
import MarkdownRenderer from './MarkdownRenderer.jsx';
import '../css/ProjectWindow.css'


function ProjectWindow() {

  const {
    themeDragBar,
    ProjectsExpand, setProjectsExpand,
    StyleHide,
    isTouchDevice,
    handleSetFocusItemTrue,
    inlineStyleExpand,
    inlineStyle,
    deleteTap,
  } = useContext(UseContext);

  // 项目组件内部状态
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showIframe, setShowIframe] = useState(false);

  // 使用 hook 获取 Issues 列表
  const { issues, loading, error, loadMore, hasMore } = useIssueList(
    config.project.label,
    { pageSize: 10 }
  );

  // 解析选中的 Issue
  const parsedSelected = useParsedIssue(selectedIssue, config.project.label);

  // 提取所有分类标签（从 labels 中排除系统标签）
  const allCategories = useMemo(() => {
    const categories = new Set();
    issues.forEach(issue => {
      if (issue.labels) {
        issue.labels.forEach(label => {
          if (label.name !== config.project.label) {
            categories.add(label.name);
          }
        });
      }
    });
    return Array.from(categories).sort();
  }, [issues]);

  // 过滤后的项目列表
  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      // 分类筛选
      if (categoryFilter !== 'all') {
        const hasCategory = issue.labels?.some(
          label => label.name === categoryFilter
        );
        if (!hasCategory) return false;
      }

      // 搜索筛选（标题 + 描述）
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const title = (issue.title || '').toLowerCase();
        const body = (issue.body || '').toLowerCase();
        if (!title.includes(term) && !body.includes(term)) return false;
      }

      return true;
    });
  }, [issues, categoryFilter, searchTerm]);

  // 获取 issue 的分类标签（排除系统标签）
  function getCategories(issue) {
    if (!issue.labels) return [];
    return issue.labels
      .map(label => label.name)
      .filter(name => name !== config.project.label);
  }

  // 解析单个 issue 的 meta（用于卡片显示）
  function getIssueMeta(issue) {
    const body = issue.body || '';
    const metaRegex = /<!--\s*meta\s*\n([\s\S]*?)\n-->/;
    const match = body.match(metaRegex);

    if (!match) return {};

    const metaBlock = match[1];
    const meta = {};

    metaBlock.split('\n').forEach((line) => {
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) return;
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();
      if (key) {
        meta[key] = value;
      }
    });

    return meta;
  }

  // 获取简短描述（正文前 120 字符）
  function getShortDescription(issue) {
    const body = issue.body || '';
    const metaRegex = /<!--\s*meta\s*\n[\s\S]*?\n-->\s*/;
    const cleanBody = body.replace(metaRegex, '').trim();
    if (!cleanBody) return '';
    // 去除 markdown 标记
    const plainText = cleanBody
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`{1,3}[^`]*`{1,3}/g, '')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '')
      .replace(/[\r\n]+/g, ' ')
      .trim();
    return plainText.length > 120 ? plainText.slice(0, 120) + '...' : plainText;
  }

  // 解析 tech 为数组
  function getTechStack(meta) {
    if (!meta.tech) return [];
    return meta.tech.split(',').map(t => t.trim()).filter(Boolean);
  }

  // 点击项目卡片打开详情
  function handleSelectIssue(issue) {
    setSelectedIssue(issue);
    setShowIframe(false);
  }

  // 返回列表
  function handleBackToList() {
    setSelectedIssue(null);
    setShowIframe(false);
  }

  // 拖拽停止
  function handleDragStop(event, data) {
    const positionX = data.x;
    const positionY = data.y;
    setProjectsExpand(prev => ({
      ...prev,
      x: positionX,
      y: positionY
    }));
  }

  return (
    <>
      <Draggable
        axis="both"
        handle={'.folder_dragbar'}
        grid={[1, 1]}
        scale={1}
        disabled={ProjectsExpand.expand}
        bounds={{top: 0}}
        defaultPosition={{
          x: window.innerWidth <= 500 ? 35 : 120,
          y: window.innerWidth <= 500 ? 50 : 50,
        }}
        onStop={(event, data) => handleDragStop(event, data)}
        onStart={() => handleSetFocusItemTrue('Projects')}
      >
        <motion.div className='projects_folder'
            onClick={(e) => {
              e.stopPropagation();
              handleSetFocusItemTrue('Projects');
            }}
            style={ ProjectsExpand.expand ? inlineStyleExpand('Projects') : inlineStyle('Projects')}>

          {/* 标题栏 */}
          <div className="folder_dragbar"
             style={{ background: ProjectsExpand.focusItem? themeDragBar : '#757579'}}
          >
            <div className="projects_barname">
              <span>{'\u{1F4C2}'} Projects</span>
            </div>
            <div className="projects_barbtn">
              <div onClick={ !isTouchDevice ? (e) => {
                e.stopPropagation()
                setProjectsExpand(prev => ({...prev, hide: true, focusItem: false}))
                StyleHide('Projects')
              } : undefined
              }
                onTouchEnd={(e) => {
                e.stopPropagation()
                setProjectsExpand(prev => ({...prev, hide: true, focusItem: false}))
                StyleHide('Projects')
              }}
              onTouchStart={(e) => e.stopPropagation()}
              >
                <p className='dash'></p>
              </div>

              <div>
                <p className='x'
                  onClick={!isTouchDevice ? () => {
                    deleteTap('Projects')
                    setSelectedIssue(null)
                    setSearchTerm('')
                    setCategoryFilter('all')
                    setShowIframe(false)
                  }: undefined}
                  onTouchEnd={() => {
                    deleteTap('Projects')
                    setSelectedIssue(null)
                    setSearchTerm('')
                    setCategoryFilter('all')
                    setShowIframe(false)
                  }}
                >x
                </p>
              </div>
            </div>
          </div>

          {/* 工具栏 */}
          {!selectedIssue && (
            <div className="projects_toolbar">
              <label htmlFor="projects-category">Category:</label>
              <select
                id="projects-category"
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
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}

          {/* 内容区 */}
          <div className="projects_content">
            {/* 错误状态 */}
            {error && (
              <div className="projects_error">Error: {error}</div>
            )}

            {/* 加载状态（仅首次） */}
            {loading && issues.length === 0 && (
              <div className="projects_loading">Loading projects...</div>
            )}

            {/* 项目详情视图 */}
            {selectedIssue ? (
              <div className="projects_detail">
                <div className="projects_detail_header">
                  <button className="projects_back_btn" onClick={handleBackToList}>
                    {'<'} Back
                  </button>
                  <span className="projects_detail_title">
                    {parsedSelected.title}
                  </span>
                </div>

                {/* 详情工具栏 */}
                <div className="projects_detail_toolbar">
                  {parsedSelected.meta.demo && (
                    <button
                      className="projects_detail_btn"
                      onClick={() => setShowIframe(!showIframe)}
                    >
                      {showIframe ? 'Hide Preview' : 'Live Demo'}
                    </button>
                  )}
                  {parsedSelected.meta.github && (
                    <a
                      className="projects_detail_btn projects_detail_link"
                      href={parsedSelected.meta.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub
                    </a>
                  )}
                  {parsedSelected.meta.demo && (
                    <a
                      className="projects_detail_btn projects_detail_link"
                      href={parsedSelected.meta.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open in New Tab
                    </a>
                  )}
                </div>

                {/* iframe 预览 */}
                {showIframe && parsedSelected.meta.demo && (
                  <div className="projects_iframe_container">
                    <iframe
                      src={parsedSelected.meta.demo}
                      title={parsedSelected.title}
                      className="projects_iframe"
                      sandbox="allow-scripts allow-same-origin allow-forms"
                    />
                  </div>
                )}

                {/* Markdown 内容 */}
                <div className="projects_detail_body">
                  <MarkdownRenderer content={parsedSelected.content} />
                </div>
              </div>
            ) : (
              /* 项目卡片列表视图 */
              <>
                <div className="projects_list">
                  {filteredIssues.map((issue) => {
                    const meta = getIssueMeta(issue);
                    const techStack = getTechStack(meta);
                    const shortDesc = getShortDescription(issue);

                    return (
                      <div
                        className="projects_card"
                        key={issue.number}
                        onClick={() => handleSelectIssue(issue)}
                      >
                        {/* 左侧缩略图 */}
                        <div className="projects_card_thumb">
                          {meta.thumbnail ? (
                            <img
                              src={meta.thumbnail}
                              alt={issue.title}
                              loading="lazy"
                            />
                          ) : (
                            <div className="projects_card_thumb_placeholder">
                              {'\u{1F4E6}'}
                            </div>
                          )}
                        </div>

                        {/* 右侧信息 */}
                        <div className="projects_card_info">
                          <div className="projects_card_header">
                            <span className="projects_card_title">{issue.title}</span>
                            {meta.featured === 'true' && (
                              <span className="projects_card_featured">Featured</span>
                            )}
                          </div>

                          {techStack.length > 0 && (
                            <div className="projects_card_tech">
                              {techStack.map(tech => (
                                <span className="projects_card_tech_tag" key={tech}>
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}

                          {shortDesc && (
                            <p className="projects_card_desc">{shortDesc}</p>
                          )}

                          <div className="projects_card_actions">
                            {meta.demo && (
                              <a
                                className="projects_card_btn"
                                href={meta.demo}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Demo
                              </a>
                            )}
                            {meta.github && (
                              <a
                                className="projects_card_btn"
                                href={meta.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                              >
                                GitHub
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* 空状态 */}
                  {!loading && filteredIssues.length === 0 && (
                    <div className="projects_empty">
                      {issues.length === 0
                        ? 'No projects found.'
                        : 'No projects match your search.'}
                    </div>
                  )}
                </div>

                {/* 加载更多 */}
                {hasMore && !searchTerm && categoryFilter === 'all' && (
                  <div className="projects_load_more">
                    <button
                      className="projects_load_more_btn"
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
          <div className="projects_status_bar">
            <p>
              {selectedIssue
                ? `Project #${selectedIssue.number}`
                : `${filteredIssues.length} project(s)`}
            </p>
          </div>

        </motion.div>
      </Draggable>
    </>
  )
}

export default ProjectWindow
