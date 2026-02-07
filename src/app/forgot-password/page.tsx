'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`
        })

        if (error) {
            setError('Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại.')
        } else {
            setSent(true)
        }
        setLoading(false)
    }

    if (sent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4">
                <div className="w-full max-w-md">
                    <div className="glass rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Kiểm tra email</h2>
                        <p className="text-gray-400 mb-6">
                            Chúng tôi đã gửi link đặt lại mật khẩu đến <span className="text-purple-400 font-medium">{email}</span>
                        </p>
                        <p className="text-gray-500 text-sm mb-6">
                            Không nhận được email? Kiểm tra thư mục Spam hoặc thử lại sau vài phút.
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => setSent(false)}
                                className="w-full py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition"
                            >
                                Gửi lại
                            </button>
                            <Link
                                href="/login"
                                className="block w-full py-3 text-gray-400 hover:text-white transition text-center"
                            >
                                ← Quay lại đăng nhập
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-white/20 bg-white flex items-center justify-center">
                            <img src="/images/x10-logo.png" alt="X10" className="w-full h-full object-contain p-2" />
                        </div>
                    </Link>
                    <h1 className="text-3xl font-bold text-white mb-2">Quên mật khẩu</h1>
                    <p className="text-gray-400">Nhập email để nhận link đặt lại mật khẩu</p>
                </div>

                {/* Form */}
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
                                    Đang gửi...
                                </span>
                            ) : (
                                'Gửi link đặt lại mật khẩu'
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-gray-400">
                        Nhớ mật khẩu?{' '}
                        <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                            Đăng nhập
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
