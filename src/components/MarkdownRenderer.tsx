'use client'

import ReactMarkdown from 'react-markdown'

interface MarkdownRendererProps {
    content: string
    isDarkMode?: boolean
}

export default function MarkdownRenderer({ content, isDarkMode = true }: MarkdownRendererProps) {
    return (
        <ReactMarkdown
            components={{
                // Headers
                h1: ({ children }) => (
                    <h1 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {children}
                    </h1>
                ),
                h2: ({ children }) => (
                    <h2 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {children}
                    </h2>
                ),
                h3: ({ children }) => (
                    <h3 className={`text-base font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {children}
                    </h3>
                ),
                // Paragraphs
                p: ({ children }) => (
                    <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
                ),
                // Bold
                strong: ({ children }) => (
                    <strong className="font-semibold">{children}</strong>
                ),
                // Italic
                em: ({ children }) => (
                    <em className="italic">{children}</em>
                ),
                // Lists
                ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-2 space-y-1 ml-2">{children}</ul>
                ),
                ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-2 space-y-1 ml-2">{children}</ol>
                ),
                li: ({ children }) => (
                    <li className="leading-relaxed">{children}</li>
                ),
                // Code
                code: ({ children, className }) => {
                    const isInline = !className
                    if (isInline) {
                        return (
                            <code className={`px-1.5 py-0.5 rounded text-sm font-mono ${isDarkMode
                                    ? 'bg-white/10 text-cyan-300'
                                    : 'bg-gray-100 text-purple-600'
                                }`}>
                                {children}
                            </code>
                        )
                    }
                    return (
                        <code className="block">{children}</code>
                    )
                },
                pre: ({ children }) => (
                    <pre className={`p-3 rounded-lg mb-2 overflow-x-auto text-sm font-mono ${isDarkMode
                            ? 'bg-black/30 text-gray-200'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                        {children}
                    </pre>
                ),
                // Blockquote
                blockquote: ({ children }) => (
                    <blockquote className={`border-l-4 pl-4 my-2 italic ${isDarkMode
                            ? 'border-purple-500 text-gray-300'
                            : 'border-purple-400 text-gray-600'
                        }`}>
                        {children}
                    </blockquote>
                ),
                // Links
                a: ({ href, children }) => (
                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`underline ${isDarkMode
                                ? 'text-cyan-400 hover:text-cyan-300'
                                : 'text-purple-600 hover:text-purple-500'
                            }`}
                    >
                        {children}
                    </a>
                ),
                // Horizontal rule
                hr: () => (
                    <hr className={`my-3 ${isDarkMode ? 'border-white/20' : 'border-gray-300'}`} />
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    )
}
