import ReactMarkdown from 'react-markdown'
import '../css/MarkdownRenderer.css'

/**
 * MarkdownRenderer - Win95 风格的 Markdown 渲染组件
 * @param {string} content - Markdown 内容
 * @param {string} className - 额外的 CSS 类名
 */
function MarkdownRenderer({ content, className = '' }) {

  // 自定义渲染器：pre, img, a, code
  const customRenderers = {
    // pre: 代码块容器
    pre({ children, ...props }) {
      return (
        <pre className="md-code-block" {...props}>
          {children}
        </pre>
      )
    },

    // code: 区分行内 code 和 block code（v10 不再传 inline prop）
    code({ className, children, ...props }) {
      const isBlock = (className || '').includes('language-')

      if (isBlock) {
        return (
          <code className={className} {...props}>
            {children}
          </code>
        )
      }

      return (
        <code className="md-inline-code" {...props}>
          {children}
        </code>
      )
    },

    // img: lazy loading
    img({ ...props }) {
      return (
        <img
          {...props}
          loading="lazy"
          alt={props.alt || ''}
        />
      )
    },

    // a: 新窗口打开
    a({ href, children, ...props }) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </a>
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
