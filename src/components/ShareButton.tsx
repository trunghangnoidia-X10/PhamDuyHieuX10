'use client'

import { useState, useRef, useEffect } from 'react'
import { useToast } from '@/lib/toast'

interface ShareButtonProps {
    content: string
    isDarkMode?: boolean
}

export default function ShareButton({ content, isDarkMode = true }: ShareButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const { showToast } = useToast()

    const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://x10.vercel.app'
    const shareText = `"${content.slice(0, 200)}${content.length > 200 ? '...' : ''}" - X10`
    const encodedText = encodeURIComponent(shareText)
    const encodedUrl = encodeURIComponent(appUrl)

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])

    const handleShare = async (platform: string) => {
        setIsOpen(false)

        // Try native share first on mobile
        if (platform === 'native' && navigator.share) {
            try {
                await navigator.share({
                    title: 'X10 - Wisdom',
                    text: shareText,
                    url: appUrl
                })
                showToast('Đã chia sẻ thành công!', 'success')
                return
            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    console.error('Share failed:', err)
                }
                return
            }
        }

        let shareUrl = ''
        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`
                break
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
                break
            case 'zalo':
                shareUrl = `https://zalo.me/share/article/?u=${encodedUrl}&title=${encodedText}`
                break
            case 'copy':
                try {
                    await navigator.clipboard.writeText(`${shareText}\n\n${appUrl}`)
                    showToast('Đã sao chép để chia sẻ!', 'success')
                } catch (err) {
                    console.error('Copy failed:', err)
                    showToast('Không thể sao chép', 'error')
                }
                return
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400,noopener,noreferrer')
        }
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-1 rounded transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                title="Chia sẻ"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
            </button>

            {isOpen && (
                <div className={`absolute bottom-full right-0 mb-2 py-2 rounded-xl shadow-xl z-50 min-w-[160px] animate-toast-in ${isDarkMode ? 'bg-slate-800 border border-white/10' : 'bg-white border border-gray-200'}`}>
                    {/* Native share for mobile */}
                    {typeof navigator !== 'undefined' && 'share' in navigator && (
                        <button
                            onClick={() => handleShare('native')}
                            className={`w-full px-4 py-2 text-left flex items-center gap-3 ${isDarkMode ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
                        >
                            <span className="text-lg">📤</span>
                            <span className="text-sm">Chia sẻ...</span>
                        </button>
                    )}

                    <button
                        onClick={() => handleShare('facebook')}
                        className={`w-full px-4 py-2 text-left flex items-center gap-3 ${isDarkMode ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
                    >
                        <span className="text-lg">📘</span>
                        <span className="text-sm">Facebook</span>
                    </button>

                    <button
                        onClick={() => handleShare('zalo')}
                        className={`w-full px-4 py-2 text-left flex items-center gap-3 ${isDarkMode ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
                    >
                        <span className="text-lg">💬</span>
                        <span className="text-sm">Zalo</span>
                    </button>

                    <button
                        onClick={() => handleShare('twitter')}
                        className={`w-full px-4 py-2 text-left flex items-center gap-3 ${isDarkMode ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
                    >
                        <span className="text-lg">🐦</span>
                        <span className="text-sm">Twitter/X</span>
                    </button>

                    <div className={`border-t my-1 ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}></div>

                    <button
                        onClick={() => handleShare('copy')}
                        className={`w-full px-4 py-2 text-left flex items-center gap-3 ${isDarkMode ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
                    >
                        <span className="text-lg">📋</span>
                        <span className="text-sm">Sao chép</span>
                    </button>
                </div>
            )}
        </div>
    )
}
