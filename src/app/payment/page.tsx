'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import AuthGuard from '@/components/AuthGuard'

const PLANS = [
    {
        id: 'monthly',
        name: 'Gói Tháng',
        price: 99000,
        originalPrice: 149000,
        duration: '1 tháng',
        features: [
            'Chat không giới hạn với X10 AI',
            'Lưu lịch sử hội thoại',
            'Hỗ trợ voice input',
            'AI Memory - nhớ context',
            'Truy cập mọi tính năng'
        ],
        popular: false
    },
    {
        id: 'yearly',
        name: 'Gói Năm',
        price: 999999,
        originalPrice: 1188000,
        duration: '12 tháng',
        features: [
            'Tất cả tính năng Gói Tháng',
            'Tiết kiệm 16%',
            'Ưu tiên hỗ trợ',
            'Cập nhật sớm nhất',
            'Bonus: 2 tháng miễn phí'
        ],
        popular: true
    }
]

interface BankInfo {
    accountNumber: string
    accountName: string
    bankName: string
    transferContent: string
    amount: number
}

function PaymentPageContent() {
    const { user } = useAuth()
    const [selectedPlan, setSelectedPlan] = useState('yearly')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [copied, setCopied] = useState('')
    const [showTransfer, setShowTransfer] = useState(false)
    const [bankInfo, setBankInfo] = useState<BankInfo | null>(null)
    const [qrUrl, setQrUrl] = useState('')
    const [orderId, setOrderId] = useState('')
    const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed' | 'checking'>('pending')
    const [countdown, setCountdown] = useState(900) // 15 phút

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
    }

    const copyToClipboard = async (text: string, field: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(field)
            setTimeout(() => setCopied(''), 2000)
        } catch {
            // Fallback
            const textarea = document.createElement('textarea')
            textarea.value = text
            document.body.appendChild(textarea)
            textarea.select()
            document.execCommand('copy')
            document.body.removeChild(textarea)
            setCopied(field)
            setTimeout(() => setCopied(''), 2000)
        }
    }

    const handlePayment = async () => {
        if (!user) return

        const plan = PLANS.find(p => p.id === selectedPlan)
        if (!plan) return

        setLoading(true)
        setError('')

        try {
            const response = await fetch('/api/payment/bank-transfer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    amount: plan.price,
                    planType: selectedPlan,
                })
            })

            const data = await response.json()

            if (data.demo) {
                setError(data.error)
                return
            }

            if (data.orderId && data.bankInfo) {
                setOrderId(data.orderId)
                setBankInfo(data.bankInfo)
                setQrUrl(data.qrUrl)
                setShowTransfer(true)
                setPaymentStatus('pending')
                setCountdown(900)
            } else {
                setError(data.error || 'Không thể tạo đơn hàng')
            }
        } catch (err) {
            console.error('Payment error:', err)
            setError('Đã có lỗi xảy ra. Vui lòng thử lại.')
        } finally {
            setLoading(false)
        }
    }

    // Polling kiểm tra trạng thái thanh toán
    const checkPaymentStatus = useCallback(async () => {
        if (!orderId || paymentStatus === 'completed') return

        try {
            const res = await fetch(`/api/payment/check-status?orderId=${orderId}`)
            const data = await res.json()

            if (data.completed) {
                setPaymentStatus('completed')
            }
        } catch (err) {
            console.error('Check status error:', err)
        }
    }, [orderId, paymentStatus])

    useEffect(() => {
        if (!showTransfer || paymentStatus === 'completed') return

        const interval = setInterval(checkPaymentStatus, 5000) // Mỗi 5 giây
        return () => clearInterval(interval)
    }, [showTransfer, paymentStatus, checkPaymentStatus])

    // Countdown timer
    useEffect(() => {
        if (!showTransfer || paymentStatus === 'completed' || countdown <= 0) return

        const timer = setInterval(() => {
            setCountdown(prev => prev - 1)
        }, 1000)
        return () => clearInterval(timer)
    }, [showTransfer, paymentStatus, countdown])

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m}:${s.toString().padStart(2, '0')}`
    }

    // Màn hình thanh toán thành công
    if (paymentStatus === 'completed') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full text-center border border-white/20">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-3">Thanh toán thành công! 🎉</h2>
                    <p className="text-gray-300 mb-2">
                        Gói <span className="text-cyan-400 font-semibold">{PLANS.find(p => p.id === selectedPlan)?.name}</span> đã được kích hoạt.
                    </p>
                    <p className="text-gray-400 text-sm mb-8">
                        Cảm ơn bạn đã tin tưởng sử dụng X10!
                    </p>
                    <Link
                        href="/chat"
                        className="inline-block w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:opacity-90 transition"
                    >
                        Bắt đầu trò chuyện →
                    </Link>
                </div>
            </div>
        )
    }

    // Màn hình chuyển khoản
    if (showTransfer && bankInfo) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
                    <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
                        <button onClick={() => setShowTransfer(false)} className="flex items-center gap-2 text-white">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="font-medium">Quay lại</span>
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                            <span className="text-yellow-400 text-sm font-medium">Đang chờ: {formatTime(countdown)}</span>
                        </div>
                    </div>
                </header>

                <main className="pt-24 pb-10 px-4 max-w-md mx-auto">
                    {/* QR Code */}
                    <div className="bg-white rounded-2xl p-6 mb-6 text-center">
                        <h3 className="text-gray-800 font-semibold mb-4 text-lg">Quét QR để chuyển khoản</h3>
                        {qrUrl && (
                            <img
                                src={qrUrl}
                                alt="QR Chuyển khoản"
                                className="mx-auto rounded-xl mb-3"
                                style={{ maxWidth: '280px', width: '100%' }}
                            />
                        )}
                        <p className="text-gray-500 text-sm">Mở app ngân hàng → Quét QR → Xác nhận</p>
                    </div>

                    {/* Thông tin chuyển khoản */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-5 mb-6 border border-white/20">
                        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Hoặc chuyển khoản thủ công
                        </h3>

                        <div className="space-y-3">
                            {/* Ngân hàng */}
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Ngân hàng</span>
                                <span className="text-white font-medium">{bankInfo.bankName}</span>
                            </div>

                            {/* Số tài khoản */}
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Số tài khoản</span>
                                <button
                                    onClick={() => copyToClipboard(bankInfo.accountNumber, 'stk')}
                                    className="flex items-center gap-2 text-white font-medium hover:text-cyan-400 transition"
                                >
                                    <span className="font-mono">{bankInfo.accountNumber}</span>
                                    {copied === 'stk' ? (
                                        <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {/* Chủ tài khoản */}
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Chủ tài khoản</span>
                                <span className="text-white font-medium">{bankInfo.accountName}</span>
                            </div>

                            {/* Số tiền */}
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Số tiền</span>
                                <button
                                    onClick={() => copyToClipboard(bankInfo.amount.toString(), 'amount')}
                                    className="flex items-center gap-2 text-cyan-400 font-bold text-lg hover:text-cyan-300 transition"
                                >
                                    {formatPrice(bankInfo.amount)}
                                    {copied === 'amount' ? (
                                        <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {/* Nội dung CK */}
                            <div className="pt-3 border-t border-white/10">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-gray-400 text-sm">Nội dung CK</span>
                                    <span className="text-red-400 text-xs">⚠️ Bắt buộc</span>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(bankInfo.transferContent, 'content')}
                                    className="w-full mt-1 px-4 py-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-center justify-between hover:bg-yellow-500/20 transition"
                                >
                                    <span className="text-yellow-300 font-mono font-bold tracking-wider">{bankInfo.transferContent}</span>
                                    {copied === 'content' ? (
                                        <span className="text-green-400 text-sm flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Đã copy
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 text-sm flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                            Copy
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Trạng thái */}
                    <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                            <span className="text-white font-medium">Đang chờ thanh toán...</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Sau khi chuyển khoản, hệ thống sẽ <span className="text-cyan-400">tự động xác nhận</span> trong vòng vài giây.
                            Bạn không cần thao tác gì thêm.
                        </p>
                    </div>
                </main>
            </div>
        )
    }

    // Màn hình chọn gói
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/chat" className="flex items-center gap-2 text-white">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="font-medium">Quay lại</span>
                    </Link>
                    <h1 className="text-lg font-semibold text-white">Nâng cấp</h1>
                    <div className="w-20"></div>
                </div>
            </header>

            {/* Content */}
            <main className="pt-24 pb-10 px-4 max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-white mb-3">
                        Mở khóa toàn bộ sức mạnh X10
                    </h2>
                    <p className="text-gray-400">
                        Đồng hành 24/7 trong hành trình phát triển bản thân
                    </p>
                </div>

                {/* Plans */}
                <div className="grid md:grid-cols-2 gap-6 mb-10">
                    {PLANS.map(plan => (
                        <button
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan.id)}
                            className={`relative p-6 rounded-2xl text-left transition-all ${selectedPlan === plan.id
                                ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-2 border-cyan-400 scale-[1.02]'
                                : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xs font-medium rounded-full">
                                    Phổ biến nhất
                                </div>
                            )}

                            <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-3xl font-bold text-white">{formatPrice(plan.price)}</span>
                                <span className="text-gray-400 line-through">{formatPrice(plan.originalPrice)}</span>
                            </div>
                            <p className="text-sm text-gray-400 mb-4">{plan.duration}</p>

                            <ul className="space-y-2">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2 text-gray-300 text-sm">
                                        <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </button>
                    ))}
                </div>

                {/* Payment Method Info */}
                <div className="bg-white/5 rounded-2xl p-6 mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Phương thức thanh toán</h3>
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/30 rounded-xl">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-white font-medium">Chuyển khoản ngân hàng</p>
                            <p className="text-gray-400 text-sm">QR Code • Tự động xác nhận • Mọi ngân hàng</p>
                        </div>
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6 text-red-300 text-sm">
                        {error}
                    </div>
                )}

                {/* Pay Button */}
                <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Đang tạo đơn...
                        </span>
                    ) : (
                        `Thanh toán ${formatPrice(PLANS.find(p => p.id === selectedPlan)?.price || 0)}`
                    )}
                </button>

                {/* Security Note */}
                <p className="text-center text-gray-500 text-sm mt-4">
                    🔒 Thanh toán an toàn qua chuyển khoản ngân hàng • Xác nhận tự động bởi SePay
                </p>
            </main>
        </div>
    )
}

export default function PaymentPage() {
    return (
        <AuthGuard>
            <PaymentPageContent />
        </AuthGuard>
    )
}
