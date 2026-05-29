import UseContext from '../Context'
import { useContext, useState, useMemo } from "react";
import Draggable from 'react-draggable'
import { motion } from 'framer-motion';
import { useIssueList, useParsedIssue } from '../hooks/useGitHubIssues.js';
import { config } from '../data/config.js';
import '../css/ResumeWindow.css'


/**
 * 从 Issue body 中提取简历图片 URL
 * 优先在"简历"或"Resume"标题下找，找不到则匹配所有图片
 */
function extractResumeImages(body) {
  const images = [];
  const imgRegex = /!\[.*?\]\((.*?)\)/g;
  // 先找简历部分
  const resumeSection = body.match(/##\s*(?:简历|Resume|CV)[\s\S]*?(?=##|$)/i);
  if (resumeSection) {
    let match;
    while ((match = imgRegex.exec(resumeSection[0])) !== null) {
      images.push(match[1]);
    }
  }
  if (images.length === 0) {
    imgRegex.lastIndex = 0;
    let match;
    while ((match = imgRegex.exec(body)) !== null) {
      images.push(match[1]);
    }
  }
  return images;
}


/**
 * ResumeWindow - 简历查看窗口组件
 * 从 profile Issue 中提取简历图片，支持翻页和缩放
 */
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

  // 翻页 & 缩放状态
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1);

  // 使用 hook 获取 profile Issues（只取第一个）
  const { issues, loading, error } = useIssueList(
    config.profile.label,
    { pageSize: 1 }
  );

  // 取第一个 profile issue
  const profileIssue = issues.length > 0 ? issues[0] : null;

  // 解析 profile Issue
  const parsed = useParsedIssue(profileIssue, config.profile.label);

  // 从 profile Issue body 中提取简历图片
  const resumeImages = useMemo(() => {
    if (!profileIssue) return [];
    const body = profileIssue.body || '';
    return extractResumeImages(body);
  }, [profileIssue]);

  const totalPages = resumeImages.length;

  // 翻页：上一页
  function handlePrev() {
    setCurrentPage(p => Math.max(0, p - 1));
    setZoom(1);
  }

  // 翻页：下一页
  function handleNext() {
    setCurrentPage(p => Math.min(totalPages - 1, p + 1));
    setZoom(1);
  }

  // 缩放：放大
  function handleZoomIn() {
    setZoom(z => Math.min(z + 0.25, 3));
  }

  // 缩放：缩小
  function handleZoomOut() {
    setZoom(z => Math.max(z - 0.25, 0.5));
  }

  // 缩放：1:1 还原
  function handleZoomReset() {
    setZoom(1);
  }

  // 拖拽停止
  function handleDragStop(event, data) {
    setResumeWinExpand(prev => ({
      ...prev,
      x: data.x,
      y: data.y,
    }));
  }

  return (
    <>
      <Draggable
        axis="both"
        handle={'.folder_dragbar'}
        grid={[1, 1]}
        scale={1}
        disabled={ResumeWinExpand.expand}
        bounds={{top: 0}}
        defaultPosition={{
          x: window.innerWidth <= 500 ? 35 : 100,
          y: window.innerWidth <= 500 ? 50 : 45,
        }}
        onStop={(event, data) => handleDragStop(event, data)}
        onStart={() => handleSetFocusItemTrue('ResumeWin')}
      >
        <motion.div className='resume_folder'
            onClick={(e) => {
              e.stopPropagation();
              handleSetFocusItemTrue('ResumeWin');
            }}
            style={ ResumeWinExpand.expand ? inlineStyleExpand('ResumeWin') : inlineStyle('ResumeWin')}>

          {/* 标题栏 */}
          <div className="folder_dragbar"
             style={{ background: ResumeWinExpand.focusItem? themeDragBar : '#757579'}}
          >
            <div className="resume_barname">
              <span>{'\u{1F4C4}'} Resume</span>
            </div>
            <div className="resume_barbtn">
              <div onClick={ !isTouchDevice ? (e) => {
                e.stopPropagation()
                setResumeWinExpand(prev => ({...prev, hide: true, focusItem: false}))
                StyleHide('ResumeWin')
              } : undefined
              }
                onTouchEnd={(e) => {
                e.stopPropagation()
                setResumeWinExpand(prev => ({...prev, hide: true, focusItem: false}))
                StyleHide('ResumeWin')
              }}
              onTouchStart={(e) => e.stopPropagation()}
              >
                <p className='dash'></p>
              </div>

              <div>
                <p className='x'
                  onClick={!isTouchDevice ? () => {
                    deleteTap('ResumeWin')
                    setCurrentPage(0)
                    setZoom(1)
                  }: undefined}
                  onTouchEnd={() => {
                    deleteTap('ResumeWin')
                    setCurrentPage(0)
                    setZoom(1)
                  }}
                >x
                </p>
              </div>
            </div>
          </div>

          {/* 工具栏 */}
          <div className="resume_toolbar">
            <button
              className="resume_toolbar_btn"
              onClick={handlePrev}
              disabled={currentPage === 0 || totalPages === 0}
            >
              {'<'} Prev
            </button>
            <span className="resume_page_info">
              {totalPages > 0 ? `${currentPage + 1} / ${totalPages}` : '0 / 0'}
            </span>
            <button
              className="resume_toolbar_btn"
              onClick={handleNext}
              disabled={currentPage >= totalPages - 1 || totalPages === 0}
            >
              Next {'>'}
            </button>
            <div className="resume_toolbar_sep"></div>
            <button
              className="resume_toolbar_btn"
              onClick={handleZoomIn}
              disabled={zoom >= 3}
            >
              Zoom In
            </button>
            <button
              className="resume_toolbar_btn"
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
            >
              Zoom Out
            </button>
            <button
              className="resume_toolbar_btn"
              onClick={handleZoomReset}
            >
              1:1
            </button>
          </div>

          {/* 内容区 */}
          <div className="resume_content">
            {/* 错误状态 */}
            {error && (
              <div className="resume_error">Error: {error}</div>
            )}

            {/* 加载状态 */}
            {loading && !profileIssue && (
              <div className="resume_loading">Loading resume...</div>
            )}

            {/* 无图片状态 */}
            {!loading && !error && totalPages === 0 && (
              <div className="resume_empty">No resume images found.</div>
            )}

            {/* 简历图片显示 */}
            {totalPages > 0 && (
              <div className="resume_image_container">
                <div
                  className="resume_image_wrapper"
                  style={{
                    width: `${zoom * 100}%`,
                    minWidth: '100%',
                  }}
                >
                  <img
                    className="resume_image"
                    src={resumeImages[currentPage]}
                    alt={`Resume page ${currentPage + 1}`}
                    draggable={false}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 状态栏 */}
          <div className="resume_status_bar">
            <p>
              {totalPages > 0
                ? `Page ${currentPage + 1} of ${totalPages} | Zoom: ${Math.round(zoom * 100)}%`
                : 'No resume loaded'}
            </p>
          </div>

        </motion.div>
      </Draggable>
    </>
  )
}

export default ResumeWindow
