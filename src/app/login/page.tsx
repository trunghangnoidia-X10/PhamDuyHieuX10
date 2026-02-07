'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

// Detect if running in an in-app browser (Zalo, Facebook, Instagram, etc.)
function isInAppBrowser(): boolean {
    if (typeof navigator === 'undefined') return false
    const ua = navigator.userAgent || ''
    // Common in-app browser identifiers
    return /FBAN|FBAV|FB_IAB|Instagram|Line|Zalo|ZaloTheme|Snapchat|Twitter|MicroMessenger|WeChat|TikTok/i.test(ua)
}

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [inAppBrowser, setInAppBrowser] = useState(false)
    const { signIn, signInWithGoogle, authRequired } = useAuth()
    const router = useRouter()

    useEffect(() => {
        setInAppBrowser(isInAppBrowser())
    }, [])

    // If auth not required, redirect to chat
    if (!authRequired) {
        router.push('/chat')
        return null
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const { error } = await signIn(email, password)

        if (error) {
            setError(error.message === 'Invalid login credentials'
                ? 'Email hoặc mật khẩu không đúng'
                : error.message)
            setLoading(false)
        } else {
            router.push('/chat')
        }
    }

    const handleGoogleSignIn = async () => {
        setError('')
        const { error } = await signInWithGoogle()
        if (error) {
            setError('Không thể đăng nhập với Google. Vui lòng thử lại.')
        }
    }

    // Get the current URL to help user copy
    const currentUrl = typeof window !== 'undefined' ? window.location.href : ''

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4">
            <div className="w-full max-w-md">
                {/* In-App Browser Warning */}
                {inAppBrowser && (
                    <div className="mb-4 bg-amber-500/20 border border-amber-500/50 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl flex-shrink-0">⚠️</span>
                            <div>
                                <p className="font-semibold text-amber-300 mb-1">Trình duyệt không hỗ trợ</p>
                                <p className="text-amber-200/80 text-sm mb-3">
                                    Bạn đang dùng trình duyệt nhúng (Zalo, Facebook...). Đăng nhập Google sẽ không hoạt động ở đây.
                                </p>
                                <p className="text-amber-200/80 text-sm font-medium mb-2">
                                    Hãy mở bằng trình duyệt Safari hoặc Chrome:
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-amber-200/70">
                                        <span>📱</span>
                                        <span><strong>iPhone:</strong> Bấm <strong>⋯</strong> → <strong>&quot;Mở trong Safari&quot;</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-amber-200/70">
                                        <span>📱</span>
                                        <span><strong>Android:</strong> Bấm <strong>⋮</strong> → <strong>&quot;Mở bằng Chrome&quot;</strong></span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        navigator.clipboard?.writeText(currentUrl)
                                        alert('Đã sao chép link! Hãy dán vào Safari hoặc Chrome.')
                                    }}
                                    className="mt-3 w-full py-2 px-4 bg-amber-500/30 hover:bg-amber-500/40 text-amber-200 text-sm font-medium rounded-lg transition flex items-center justify-center gap-2"
                                >
                                    📋 Sao chép link để mở trình duyệt
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-white/20 bg-white flex items-center justify-center">
                            <img src="/images/x10-logo.png" alt="X10" className="w-full h-full object-contain p-2" />
                        </div>
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Đăng Nhập X10</h1>
                    <p className="text-gray-400">Chào mừng bạn quay trở lại</p>
                </div>

                {/* Login Form */}
                <div className="glass rounded-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-3 text-red-300 text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition"
                                placeholder="email@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Mật khẩu
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition"
                                placeholder="••••••••"
                                required
                            />
                            <div className="mt-2 text-right">
                                <Link href="/forgot-password" className="text-sm text-purple-400 hover:text-purple-300 transition">
                                    Quên mật khẩu?
                                </Link>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Đang đăng nhập...
                                </span>
                            ) : (
                                'Đăng Nhập'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/20"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-transparent text-gray-400">hoặc</span>
                        </div>
                    </div>

                    {/* Google Sign In */}
                    {inAppBrowser ? (
                        <div className="text-center py-3 text-gray-400 text-sm">
                            🔒 Đăng nhập Google không khả dụng trên trình duyệt nhúng.
                            <br />Hãy mở bằng Safari hoặc Chrome.
                        </div>
                    ) : (
                        <button
                            onClick={handleGoogleSignIn}
                            className="w-full py-4 bg-white text-gray-800 font-semibold rounded-xl hover:bg-gray-100 transition flex items-center justify-center"
                        >
                            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Đăng nhập với Google
                        </button>
                    )}

                    {/* Register Link */}
                    <p className="mt-6 text-center text-gray-400">
                        Chưa có tài khoản?{' '}
                        <Link href="/register" className="text-purple-400 hover:text-purple-300 font-medium">
                            Đăng ký ngay
                        </Link>
                    </p>
                </div>

                {/* Back to home */}
                <p className="mt-6 text-center">
                    <Link href="/" className="text-gray-400 hover:text-white transition">
                        ← Quay lại trang chủ
                    </Link>
                </p>
            </div>
        </div>
    )
}

