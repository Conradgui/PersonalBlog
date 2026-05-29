import UseContext from '../Context'
import { useContext, useMemo } from "react";
import Draggable from 'react-draggable'
import { motion } from 'framer-motion';
import { useIssueList, useParsedIssue } from '../hooks/useGitHubIssues.js';
import { config } from '../data/config.js';
import MarkdownRenderer from './MarkdownRenderer.jsx';
import '../css/ProfileWindow.css'


/**
 * ProfileWindow - 个人信息窗口组件
 * 从 profile label 的 Issue 读取数据，显示头像、姓名、职位、地点、社交链接和 Markdown 内容
 */
function ProfileWindow() {

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

  // 使用 hook 获取 profile Issues 列表（只取第一个）
  const { issues, loading, error } = useIssueList(
    config.profile.label,
    { pageSize: 1 }
  );

  // 取第一个 profile issue
  const profileIssue = issues.length > 0 ? issues[0] : null;

  // 解析 profile Issue
  const parsed = useParsedIssue(profileIssue, config.profile.label);

  // 从 meta 中提取个人信息
  const profileMeta = useMemo(() => {
    const meta = parsed.meta || {};
    return {
      name: meta.name || '',
      title: meta.title || '',
      location: meta.location || '',
      github: meta.github || '',
      linkedin: meta.linkedin || '',
      email: meta.email || '',
      avatar: meta.avatar || '',
    };
  }, [parsed.meta]);

  // 拖拽停止
  function handleDragStop(event, data) {
    const positionX = data.x;
    const positionY = data.y;
    setProfileExpand(prev => ({
      ...prev,
      x: positionX,
      y: positionY
    }));
  }

  // 打开简历窗口
  function handleOpenResume() {
    handleShow('ResumeFile');
  }

  return (
    <>
      <Draggable
        axis="both"
        handle={'.folder_dragbar'}
        grid={[1, 1]}
        scale={1}
        disabled={ProfileExpand.expand}
        bounds={{top: 0}}
        defaultPosition={{
          x: window.innerWidth <= 500 ? 35 : 100,
          y: window.innerWidth <= 500 ? 50 : 45,
        }}
        onStop={(event, data) => handleDragStop(event, data)}
        onStart={() => handleSetFocusItemTrue('Profile')}
      >
        <motion.div className='profile_folder'
            onClick={(e) => {
              e.stopPropagation();
              handleSetFocusItemTrue('Profile');
            }}
            style={ ProfileExpand.expand ? inlineStyleExpand('Profile') : inlineStyle('Profile')}>

          {/* 标题栏 */}
          <div className="folder_dragbar"
             style={{ background: ProfileExpand.focusItem? themeDragBar : '#757579'}}
          >
            <div className="profile_barname">
              <span>{'\u{1F464}'} About Me</span>
            </div>
            <div className="profile_barbtn">
              <div onClick={ !isTouchDevice ? (e) => {
                e.stopPropagation()
                setProfileExpand(prev => ({...prev, hide: true, focusItem: false}))
                StyleHide('Profile')
              } : undefined
              }
                onTouchEnd={(e) => {
                e.stopPropagation()
                setProfileExpand(prev => ({...prev, hide: true, focusItem: false}))
                StyleHide('Profile')
              }}
              onTouchStart={(e) => e.stopPropagation()}
              >
                <p className='dash'></p>
              </div>

              <div>
                <p className='x'
                  onClick={!isTouchDevice ? () => {
                    deleteTap('Profile')
                  }: undefined}
                  onTouchEnd={() => {
                    deleteTap('Profile')
                  }}
                >x
                </p>
              </div>
            </div>
          </div>

          {/* 错误状态 */}
          {error && (
            <div className="profile_error">Error: {error}</div>
          )}

          {/* 加载状态 */}
          {loading && !profileIssue && (
            <div className="profile_loading">Loading profile...</div>
          )}

          {/* 无数据状态 */}
          {!loading && !error && !profileIssue && (
            <div className="profile_empty">No profile data found.</div>
          )}

          {/* 头部信息区：头像 + 姓名/职位/地点 */}
          {profileIssue && (
            <div className="profile_header">
              {profileMeta.avatar ? (
                <img
                  className="profile_avatar"
                  src={profileMeta.avatar}
                  alt={profileMeta.name || 'Avatar'}
                />
              ) : (
                <div className="profile_avatar_placeholder">{'\u{1F464}'}</div>
              )}
              <div className="profile_info">
                {profileMeta.name && (
                  <span className="profile_name">{profileMeta.name}</span>
                )}
                {profileMeta.title && (
                  <span className="profile_title">{profileMeta.title}</span>
                )}
                {profileMeta.location && (
                  <span className="profile_location">{'\u{1F4CD}'} {profileMeta.location}</span>
                )}
              </div>
            </div>
          )}

          {/* 社交链接 */}
          {profileIssue && (profileMeta.github || profileMeta.linkedin || profileMeta.email) && (
            <div className="profile_social">
              {profileMeta.github && (
                <a
                  className="profile_social_link"
                  href={profileMeta.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {'\u{1F419}'} GitHub
                </a>
              )}
              {profileMeta.linkedin && (
                <a
                  className="profile_social_link"
                  href={profileMeta.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {'\u{1F465}'} LinkedIn
                </a>
              )}
              {profileMeta.email && (
                <a
                  className="profile_social_link"
                  href={`mailto:${profileMeta.email}`}
                >
                  {'\u{2709}'} Email
                </a>
              )}
            </div>
          )}

          {/* Markdown 内容区 */}
          {profileIssue && (
            <div className="profile_content">
              <MarkdownRenderer content={parsed.content} />
            </div>
          )}

          {/* 底部：查看简历按钮 */}
          <div className="profile_footer">
            <button
              className="profile_resume_btn"
              onClick={handleOpenResume}
            >
              {'\u{1F4C4}'} View Resume
            </button>
          </div>

          {/* 状态栏 */}
          <div className="profile_status_bar">
            <p>
              {profileIssue
                ? `Profile #${parsed.number}`
                : 'No profile loaded'}
            </p>
          </div>

        </motion.div>
      </Draggable>
    </>
  )
}

export default ProfileWindow
