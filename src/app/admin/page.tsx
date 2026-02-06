'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import Link from 'next/link'

const ADMIN_EMAIL = 'ttrungphamkpl@gmail.com'

interface Stats {
    totalUsers: number
    activeUsers: number
    newUsersThisMonth: number
    totalRevenue: number
    completedPayments: number
    monthlySubscribers: number
    yearlySubscribers: number
}

export default function AdminPage() {
    const { user, loading: authLoading, session } = useAuth()
    const router = useRouter()
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (authLoading) return

        // Check if user is admin
        if (!user) {
            router.push('/login')
            return
        }

        if (user.email !== ADMIN_EMAIL) {
            router.push('/chat')
            return
        }

        // Fetch stats
        fetchStats()
    }, [user, authLoading, router])

    const fetchStats = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/admin/stats', {
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`
                }
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to fetch stats')
            }

            const data = await response.json()
            setStats(data.stats)
        } catch (err) {
            setError((err as Error).message)
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0
        }).format(amount)
    }

    if (authLoading || (!user && !authLoading)) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <header className="glass border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/chat" className="text-gray-400 hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold gradient-text">Admin Dashboard</h1>
                            <p className="text-sm text-gray-400">X10 Management</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-400">Đăng nhập với</p>
                        <p className="text-white font-medium">{user?.email}</p>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Error State */}
                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-300">
                        <p className="flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            {error}
                        </p>
                        <button onClick={fetchStats} className="mt-2 text-sm underline hover:no-underline">
                            Thử lại
                        </button>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="glass rounded-2xl p-6 animate-pulse">
                                <div className="h-4 bg-white/10 rounded w-1/2 mb-4"></div>
                                <div className="h-8 bg-white/10 rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Stats Cards */}
                {stats && !loading && (
                    <>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {/* Total Users */}
                            <div className="glass rounded-2xl p-6 hover:bg-white/10 transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-gray-400 text-sm">Tổng người dùng</span>
                                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                                <p className="text-sm text-gray-400 mt-1">+{stats.newUsersThisMonth} tháng này</p>
                            </div>

                            {/* Active Users */}
                            <div className="glass rounded-2xl p-6 hover:bg-white/10 transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-gray-400 text-sm">Đang hoạt động</span>
                                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-white">{stats.activeUsers}</p>
                                <p className="text-sm text-gray-400 mt-1">7 ngày qua</p>
                            </div>

                            {/* Total Revenue */}
                            <div className="glass rounded-2xl p-6 hover:bg-white/10 transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-gray-400 text-sm">Doanh thu</span>
                                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-3xl font-bold gradient-text">{formatCurrency(stats.totalRevenue)}</p>
                                <p className="text-sm text-gray-400 mt-1">{stats.completedPayments} giao dịch</p>
                            </div>

                            {/* Subscribers */}
                            <div className="glass rounded-2xl p-6 hover:bg-white/10 transition-colors">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-gray-400 text-sm">Đăng ký</span>
                                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                                        <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-white">{stats.monthlySubscribers + stats.yearlySubscribers}</p>
                                <p className="text-sm text-gray-400 mt-1">{stats.monthlySubscribers} tháng, {stats.yearlySubscribers} năm</p>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid md:grid-cols-3 gap-6">
                            <Link href="/chat" className="glass rounded-2xl p-6 hover:bg-white/10 transition-colors flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-white font-semibold">Đến Chat</p>
                                    <p className="text-sm text-gray-400">Trò chuyện với X10</p>
                                </div>
                            </Link>

                            <button
                                onClick={fetchStats}
                                className="glass rounded-2xl p-6 hover:bg-white/10 transition-colors flex items-center gap-4 text-left"
                            >
                                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-white font-semibold">Làm mới</p>
                                    <p className="text-sm text-gray-400">Cập nhật số liệu</p>
                                </div>
                            </button>

                            <div className="glass rounded-2xl p-6 flex items-center gap-4 opacity-50">
                                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-white font-semibold">Xuất báo cáo</p>
                                    <p className="text-sm text-gray-400">Sắp ra mắt...</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    )
}
