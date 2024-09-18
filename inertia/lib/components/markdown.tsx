import ReactMarkdown from 'react-markdown'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useState } from 'react'
import { Button } from './ui/button'
import { Icons } from './icons'

const Markdown = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      components={{
        // @ts-ignore
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '')
          const [copied, setCopied] = useState(false)

          const handleCopy = () => {
            navigator.clipboard.writeText(String(children))
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }

          return !inline && match ? (
            <div className="relative">
              <Button
                onClick={handleCopy}
                variant="ghost"
                size="icon"
                className="absolute top-2 right-4 text-background hover:bg-transparent hover:text-background"
              >
                {!copied ? <Icons.copy className="w-4 h-4" /> : <Icons.check className="w-4 h-4" />}
              </Button>
              {/* @ts-ignore */}
              <SyntaxHighlighter
                {...props}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[
                  rehypeSanitize,
                  [
                    rehypeExternalLinks,
                    { target: '_blank', rel: ['nofollow', 'noopener', 'noreferrer'] },
                  ],
                ]}
                style={atomDark}
                language={match[1]}
                PreTag="div"
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code {...props} className={className}>
              {children}
            </code>
          )
        },
        h1: ({ node, ...props }) => (
          <h1 className="text-4xl font-bold mt-8 mb-4 text-primary" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-3xl font-semibold mt-6 mb-3 text-primary-600" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-2xl font-medium mt-5 mb-2 text-primary-500" {...props} />
        ),
        p: ({ node, ...props }) => (
          <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300" {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul className="list-disc list-inside mb-4 pl-6 space-y-2" {...props} />
        ),
        ol: ({ node, ...props }) => <ol className="list-decimal mb-4 pl-6 space-y-2" {...props} />,
        li: ({ node, ...props }) => (
          <li className="mb-1 text-gray-700 dark:text-gray-300" {...props} />
        ),
        a: ({ node, ...props }) => (
          <a
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
            {...props}
          />
        ),
        table: ({ node, ...props }) => (
          <div className="overflow-x-auto mb-6">
            <table className="table-auto w-full border border-gray-300 dark:border-gray-700 divide-y divide-gray-300 dark:divide-gray-700">
              {props.children}
            </table>
          </div>
        ),
        thead: ({ node, ...props }) => (
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>{props.children}</tr>
          </thead>
        ),
        tbody: ({ node, ...props }) => (
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {props.children}
          </tbody>
        ),
        tr: ({ node, ...props }) => (
          <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">{props.children}</tr>
        ),
        th: ({ node, ...props }) => (
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border border-gray-300 dark:border-gray-700">
            {props.children}
          </th>
        ),
        td: ({ node, ...props }) => (
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700">
            {props.children}
          </td>
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-4 border-blue-500 pl-4 py-2 italic my-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            {props.children}
          </blockquote>
        ),
        img: ({ node, ...props }) => (
          <img className="max-w-full h-auto my-4 rounded-lg shadow-md" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

export default Markdown
