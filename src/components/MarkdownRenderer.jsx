import ReactMarkdown from 'react-markdown'
import '../css/MarkdownRenderer.css'

/**
 * MarkdownRenderer - Win95 风格的 Markdown 渲染组件
 * @param {string} content - Markdown 内容
 * @param {string} className - 额外的 CSS 类名
 */
function MarkdownRenderer({ content, className = '' }) {

  // 自定义渲染器：img, a, code
  const customRenderers = {
    // img: lazy loading
    img({ node, ...props }) {
      return (
        <img
          {...props}
          loading="lazy"
          alt={props.alt || ''}
        />
      )
    },

    // a: 新窗口打开
    a({ node, ...props }) {
      return (
        <a
          {...props}
          target="_blank"
          rel="noopener noreferrer"
        >
          {props.children}
        </a>
      )
    },

    // code: 区分行内 code 和 block code
    code({ node, inline, className, children, ...props }) {
      const isBlock = !inline && (className || '').includes('language-')

      if (isBlock) {
        return (
          <code className={className} {...props}>
            {children}
          </code>
        )
      }

      return (
        <code {...props}>
          {children}
        </code>
      )
    },
  }

  return (
    <div className={`markdown-renderer ${className}`}>
      <div className="markdown-renderer-content">
        <ReactMarkdown components={customRenderers}>
          {content || ''}
        </ReactMarkdown>
      </div>
    </div>
  )
}

export default MarkdownRenderer
