'use client'

import { useEffect, useState } from 'react'

interface SessionKickedModalProps {
    isOpen: boolean
    onLogin: () => void
}

export default function SessionKickedModal({ isOpen, onLogin }: SessionKickedModalProps) {
    const [countdown, setCountdown] = useState(10)

    useEffect(() => {
        if (!isOpen) return

        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer)
                    onLogin()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [isOpen, onLogin])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
            <div className="w-full max-w-md rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-8 border border-white/10 shadow-2xl">
                {/* Warning Icon */}
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-orange-500/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                {/* Content */}
                <h2 className="text-xl font-bold text-white text-center mb-3">
                    Phiên đăng nhập đã hết hạn
                </h2>
                <p className="text-gray-400 text-center mb-6 leading-relaxed">
                    Tài khoản của bạn đã được đăng nhập trên thiết bị khác.
                    Mỗi tài khoản chỉ được phép sử dụng trên <strong className="text-cyan-400">1 thiết bị duy nhất</strong>.
                </p>

                {/* Countdown */}
                <p className="text-sm text-gray-500 text-center mb-6">
                    Tự động chuyển hướng sau <span className="text-cyan-400 font-semibold">{countdown}</span> giây
                </p>

                {/* Button */}
                <button
                    onClick={onLogin}
                    className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90 transition shadow-lg"
                >
                    Đăng nhập lại
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                    Nếu bạn không thực hiện đăng nhập này, vui lòng đổi mật khẩu ngay.
                </p>
            </div>
        </div>
    )
}
