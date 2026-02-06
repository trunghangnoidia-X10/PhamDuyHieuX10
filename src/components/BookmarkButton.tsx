'use client'

import { useState, useEffect } from 'react'

const BOOKMARKS_KEY = 'x10-bookmarks'

interface Bookmark {
    id: string
    content: string
    savedAt: string
    conversationTitle: string
}

interface BookmarkButtonProps {
    messageId: string
    content: string
    conversationTitle: string
    isDarkMode: boolean
}

export default function BookmarkButton({ messageId, content, conversationTitle, isDarkMode }: BookmarkButtonProps) {
    const [isBookmarked, setIsBookmarked] = useState(false)

    useEffect(() => {
        const saved = localStorage.getItem(BOOKMARKS_KEY)
        if (saved) {
            const bookmarks: Bookmark[] = JSON.parse(saved)
            setIsBookmarked(bookmarks.some(b => b.id === messageId))
        }
    }, [messageId])

    const toggleBookmark = () => {
        const saved = localStorage.getItem(BOOKMARKS_KEY)
        let bookmarks: Bookmark[] = saved ? JSON.parse(saved) : []

        if (isBookmarked) {
            bookmarks = bookmarks.filter(b => b.id !== messageId)
        } else {
            bookmarks.push({
                id: messageId,
                content: content.slice(0, 500), // Limit content length
                savedAt: new Date().toISOString(),
                conversationTitle
            })
        }

        localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks))
        setIsBookmarked(!isBookmarked)
    }

    return (
        <button
            onClick={toggleBookmark}
            className={`p-1 rounded transition-colors ${isBookmarked
                    ? 'text-yellow-400'
                    : isDarkMode
                        ? 'text-gray-500 hover:text-yellow-400'
                        : 'text-gray-400 hover:text-yellow-500'
                }`}
            title={isBookmarked ? 'Bỏ lưu' : 'Lưu câu trả lời'}
        >
            <svg
                className="w-4 h-4"
                fill={isBookmarked ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
            </svg>
        </button>
    )
}
