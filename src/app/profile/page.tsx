'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import AuthGuard from '@/components/AuthGuard'

interface Device {
    id: string
    device_name: string
    device_fingerprint: string
    last_active: string
    created_at: string
}

function ProfilePageContent() {
    const { user, subscription, signOut, refreshSubscription } = useAuth()
    const [devices, setDevices] = useState<Device[]>([])
    const [loading, setLoading] = useState(true)
    const [isDarkMode, setIsDarkMode] = useState(true)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    useEffect(() => {
        const savedTheme = localStorage.getItem('x10-theme')
        if (savedTheme !== null) {
            setIsDarkMode(savedTheme === 'dark')
        }
        fetchDevices()
    }, [])

    const fetchDevices = async () => {
        if (!user) return
        try {
            const { data } = await supabase
                .from('devices')
                .select('*')
                .eq('user_id', user.id)
                .order('last_active', { ascending: false })
            setDevices(data || [])
        } catch (error) {
            console.error('Error fetching devices:', error)
        } finally {
            setLoading(false)
        }
    }

    const removeDevice = async (deviceId: string) => {
        try {
            await supabase.from('devices').delete().eq('id', deviceId)
            setDevices(prev => prev.filter(d => d.id !== deviceId))
        } catch (error) {
            console.error('Error removing device:', error)
        }
    }

    const handleSignOut = async () => {
        await signOut()
        window.location.href = '/'
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getSubscriptionStatus = () => {
        if (!subscription) return { label: 'Chưa đăng ký', color: 'text-gray-400' }
        if (subscription.status === 'active') {
            if (subscription.expires_at) {
                const expiresAt = new Date(subscription.expires_at)
                const now = new Date()
                if (expiresAt > now) {
                    return { label: 'Đang hoạt động', color: 'text-green-400' }
                }
            } else {
                return { label: 'Đang hoạt động', color: 'text-green-400' }
            }
        }
        return { label: 'Hết hạn', color: 'text-red-400' }
    }

    const subscriptionStatus = getSubscriptionStatus()

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50'}`}>
            {/* Header */}
            <header className={`fixed top-0 left-0 right-0 z-50 ${isDarkMode ? 'bg-slate-900/80' : 'bg-white/80'} backdrop-blur-lg border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/chat" className="flex items-center gap-2">
                        <svg className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-gray-800'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Quay lại</span>
                    </Link>
                    <h1 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Tài khoản</h1>
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                    >
                        {isDarkMode ? (
                            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                            </svg>
                        )}
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="pt-20 pb-10 px-4 max-w-4xl mx-auto">
                {/* Profile Card */}
                <div className={`rounded-2xl p-6 mb-6 ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-white shadow-lg'}`}>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                            <span className="text-white text-2xl font-bold">
                                {user?.email?.charAt(0).toUpperCase() || 'U'}
                            </span>
                        </div>
                        <div>
                            <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                {user?.email?.split('@')[0] || 'Người dùng'}
                            </h2>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {user?.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Subscription Card */}
                <div className={`rounded-2xl p-6 mb-6 ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-white shadow-lg'}`}>
                    <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        📦 Gói đăng ký
                    </h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`font-medium ${subscriptionStatus.color}`}>
                                {subscriptionStatus.label}
                            </p>
                            {subscription && (
                                <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {subscription.plan === 'monthly' ? 'Gói tháng' : subscription.plan === 'yearly' ? 'Gói năm' : 'Gói miễn phí'} •{' '}
                                    {subscription.expires_at ? `Hết hạn: ${formatDate(subscription.expires_at)}` : 'Không giới hạn'}
                                </p>
                            )}
                        </div>
                        <Link
                            href="/payment"
                            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-full text-sm font-medium hover:opacity-90 transition"
                        >
                            {subscription ? 'Gia hạn' : 'Nâng cấp'}
                        </Link>
                    </div>
                </div>

                {/* Devices Card */}
                <div className={`rounded-2xl p-6 mb-6 ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-white shadow-lg'}`}>
                    <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        📱 Thiết bị đăng nhập
                    </h3>
                    {loading ? (
                        <div className="animate-pulse space-y-3">
                            <div className={`h-16 rounded-lg ${isDarkMode ? 'bg-white/10' : 'bg-gray-100'}`}></div>
                        </div>
                    ) : devices.length === 0 ? (
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            Không có thiết bị nào
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {devices.map((device, index) => (
                                <div
                                    key={device.id}
                                    className={`flex items-center justify-between p-4 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
                                            {device.device_name.includes('iPhone') || device.device_name.includes('iPad') ? (
                                                <svg className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                </svg>
                                            ) : (
                                                <svg className={`w-5 h-5 ${isDarkMode ? 'text-white' : 'text-gray-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            )}
                                        </div>
                                        <div>
                                            <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                                {device.device_name}
                                                {index === 0 && (
                                                    <span className="ml-2 text-xs text-cyan-400">(Thiết bị này)</span>
                                                )}
                                            </p>
                                            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Hoạt động: {formatDate(device.last_active)}
                                            </p>
                                        </div>
                                    </div>
                                    {/* Single device policy - no delete button needed */}
                                </div>
                            ))}
                        </div>
                    )}
                    <p className={`text-xs mt-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Chỉ 1 thiết bị được phép đăng nhập. Đăng nhập thiết bị mới sẽ tự động đăng xuất thiết bị cũ.
                    </p>
                </div>

                {/* Settings Card */}
                <div className={`rounded-2xl p-6 mb-6 ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-white shadow-lg'}`}>
                    <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        ⚙️ Cài đặt
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Giao diện tối</span>
                            <button
                                onClick={() => {
                                    const newMode = !isDarkMode
                                    setIsDarkMode(newMode)
                                    localStorage.setItem('x10-theme', newMode ? 'dark' : 'light')
                                }}
                                className={`relative w-12 h-6 rounded-full transition ${isDarkMode ? 'bg-cyan-500' : 'bg-gray-300'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${isDarkMode ? 'translate-x-7' : 'translate-x-1'}`}></div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <button
                        onClick={handleSignOut}
                        className={`w-full py-3 rounded-xl font-medium transition ${isDarkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    >
                        Đăng xuất
                    </button>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="w-full py-3 rounded-xl font-medium text-red-400 hover:text-red-300 transition"
                    >
                        Xóa tài khoản
                    </button>
                </div>

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                        <div className={`w-full max-w-sm rounded-2xl p-6 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                            <h3 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                                Xác nhận xóa tài khoản?
                            </h3>
                            <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className={`flex-1 py-2 rounded-lg font-medium ${isDarkMode ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-800'}`}
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={async () => {
                                        // TODO: Implement account deletion
                                        alert('Vui lòng liên hệ support@x10.vn để xóa tài khoản')
                                        setShowDeleteConfirm(false)
                                    }}
                                    className="flex-1 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

export default function ProfilePage() {
    return (
        <AuthGuard>
            <ProfilePageContent />
        </AuthGuard>
    )
}
