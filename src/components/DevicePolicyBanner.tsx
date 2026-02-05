'use client'

import { useState, useEffect } from 'react'

interface DevicePolicyBannerProps {
    isDarkMode?: boolean
}

export default function DevicePolicyBanner({ isDarkMode = true }: DevicePolicyBannerProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Check if user has dismissed this banner
        const dismissed = localStorage.getItem('x10_device_policy_dismissed')
        if (!dismissed) {
            setIsVisible(true)
        }
    }, [])

    const handleDismiss = () => {
        localStorage.setItem('x10_device_policy_dismissed', 'true')
        setIsVisible(false)
    }

    if (!isVisible) return null

    return (
        <div className={`fixed top-16 left-0 right-0 z-40 px-4 py-3 ${isDarkMode
                ? 'bg-gradient-to-r from-amber-600/90 to-orange-600/90'
                : 'bg-gradient-to-r from-amber-500 to-orange-500'
            } backdrop-blur-sm`}>
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-white">
                        <strong>Thông báo quan trọng:</strong> Từ nay, mỗi tài khoản chỉ được đăng nhập trên <strong>1 thiết bị duy nhất</strong>.
                        Thiết bị cũ sẽ tự động đăng xuất khi bạn đăng nhập thiết bị mới.
                    </p>
                </div>
                <button
                    onClick={handleDismiss}
                    className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition"
                    title="Đóng"
                >
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    )
}
