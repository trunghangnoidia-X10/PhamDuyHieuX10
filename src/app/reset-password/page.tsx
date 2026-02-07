'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    // Listen for the PASSWORD_RECOVERY event
    useEffect(() => {
        supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY') {
                // User arrived via reset password link
                console.log('Password recovery mode')
            }
        })
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự')
            return
        }

        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp')
            return
        }

        setLoading(true)

        const { error } = await supabase.auth.updateUser({
            password: password
        })

        if (error) {
            setError('Không thể đặt lại mật khẩu. Link có thể đã hết hạn, vui lòng thử lại.')
        } else {
            setSuccess(true)
            setTimeout(() => {
                router.push('/chat')
            }, 3000)
        }
        setLoading(false)
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4">
                <div className="w-full max-w-md">
                    <div className="glass rounded-2xl p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Đặt lại thành công!</h2>
                        <p className="text-gray-400 mb-6">
                            Mật khẩu đã được cập nhật. Đang chuyển hướng...
                        </p>
                        <Link
                            href="/chat"
                            className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:opacity-90 transition"
                        >
                            Vào Chat ngay
                        </Link>
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
                    <h1 className="text-3xl font-bold text-white mb-2">Đặt lại mật khẩu</h1>
                    <p className="text-gray-400">Nhập mật khẩu mới cho tài khoản của bạn</p>
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
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                                Mật khẩu mới
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition"
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                                Xác nhận mật khẩu
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition"
                                placeholder="••••••••"
                                required
                                minLength={6}
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
                                    Đang cập nhật...
                                </span>
                            ) : (
                                'Đặt lại mật khẩu'
                            )}
                        </button>
                    </form>
                </div>

                {/* Back to login */}
                <p className="mt-6 text-center">
                    <Link href="/login" className="text-gray-400 hover:text-white transition">
                        ← Quay lại đăng nhập
                    </Link>
                </p>
            </div>
        </div>
    )
}
