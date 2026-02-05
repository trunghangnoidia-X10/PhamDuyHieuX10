'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useAuth } from '@/lib/auth'

export default function PaymentSuccessPage() {
    const { refreshSubscription } = useAuth()

    useEffect(() => {
        // Refresh subscription status
        refreshSubscription()
    }, [refreshSubscription])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg className="w-12 h-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-3xl font-bold text-white mb-3">
                    Thanh toán thành công!
                </h1>
                <p className="text-gray-400 mb-8">
                    Cảm ơn bạn đã đăng ký X10. Tài khoản của bạn đã được kích hoạt.
                </p>

                <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                        </div>
                        <span className="text-white font-semibold">X10 Premium</span>
                    </div>
                    <ul className="text-left space-y-2 text-gray-300 text-sm">
                        <li className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            Chat không giới hạn với X10 AI
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            AI Memory - nhớ context của bạn
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            Truy cập tất cả tính năng
                        </li>
                    </ul>
                </div>

                <Link
                    href="/chat"
                    className="inline-block w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:opacity-90 transition"
                >
                    Bắt đầu trò chuyện ✨
                </Link>
            </div>
        </div>
    )
}
