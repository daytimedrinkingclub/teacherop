import ReactMarkdown from 'react-markdown'
import rehypeExternalLinks from "rehype-external-links";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

const Markdown = ({ content }: { content: string }) => {
    return (
        <ReactMarkdown
            components={{
                //  @ts-ignore
                code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                        //@ts-ignore
                        <SyntaxHighlighter
                            {...props}
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[
                                rehypeSanitize,
                                [
                                    rehypeExternalLinks,
                                    { target: "_blank", rel: ["nofollow", "noopener", "noreferrer"] },
                                ],
                            ]}
                            style={atomDark}
                            language={match[1]}
                            PreTag="div"
                        >
                            {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                    ) : (
                        <code {...props} className={className}>
                            {children}
                        </code>
                    )
                },
                h1: ({ node, ...props }) => <h1 className="text-4xl font-bold mt-8 mb-4 text-primary" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-3xl font-semibold mt-6 mb-3 text-primary-600" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-2xl font-medium mt-5 mb-2 text-primary-500" {...props} />,
                p: ({ node, ...props }) => <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 pl-6 space-y-2" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal mb-4 pl-6 space-y-2" {...props} />,
                li: ({ node, ...props }) => <li className="mb-1 text-gray-700 dark:text-gray-300" {...props} />,
                a: ({ node, ...props }) => <a className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline" {...props} />,
                table: ({ node, ...props }) => <div className="overflow-x-auto mb-6"><table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700" {...props} /></div>,
                th: ({ node, ...props }) => <th className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider" {...props} />,
                td: ({ node, ...props }) => <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300" {...props} />,
                blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-blue-500 pl-4 py-2 italic my-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300" {...props} />,
                img: ({ node, ...props }) => <img className="max-w-full h-auto my-4 rounded-lg shadow-md" {...props} />,
            }}
        >
            {content}
        </ReactMarkdown>
    )
}

export default Markdown