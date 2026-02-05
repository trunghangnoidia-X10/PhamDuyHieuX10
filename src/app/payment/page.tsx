'use client'

import { useState } from 'react'
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

function PaymentPageContent() {
    const { user } = useAuth()
    const [selectedPlan, setSelectedPlan] = useState('yearly')
    const [paymentMethod, setPaymentMethod] = useState<'vnpay' | 'momo'>('vnpay')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const isDarkMode = true

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price) + 'đ'
    }

    const handlePayment = async () => {
        if (!user) return

        const plan = PLANS.find(p => p.id === selectedPlan)
        if (!plan) return

        setLoading(true)
        setError('')

        try {
            const response = await fetch(`/api/payment/${paymentMethod}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    amount: plan.price,
                    planType: selectedPlan,
                    orderInfo: `Dang ky ${plan.name} X10`
                })
            })

            const data = await response.json()

            if (data.demo) {
                setError(data.error)
                return
            }

            if (data.paymentUrl) {
                window.location.href = data.paymentUrl
            } else {
                setError(data.error || 'Không thể tạo thanh toán')
            }
        } catch (err) {
            console.error('Payment error:', err)
            setError('Đã có lỗi xảy ra. Vui lòng thử lại.')
        } finally {
            setLoading(false)
        }
    }

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

                {/* Payment Methods */}
                <div className="bg-white/5 rounded-2xl p-6 mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Phương thức thanh toán</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setPaymentMethod('vnpay')}
                            className={`p-4 rounded-xl flex items-center justify-center gap-3 transition ${paymentMethod === 'vnpay'
                                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-2 border-cyan-400'
                                : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                }`}
                        >
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                                <span className="text-red-500 font-bold text-sm">VN</span>
                            </div>
                            <span className="text-white font-medium">VNPay</span>
                        </button>
                        <button
                            onClick={() => setPaymentMethod('momo')}
                            className={`p-4 rounded-xl flex items-center justify-center gap-3 transition ${paymentMethod === 'momo'
                                ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-2 border-cyan-400'
                                : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                }`}
                        >
                            <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">M</span>
                            </div>
                            <span className="text-white font-medium">MoMo</span>
                        </button>
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
                            Đang xử lý...
                        </span>
                    ) : (
                        `Thanh toán ${formatPrice(PLANS.find(p => p.id === selectedPlan)?.price || 0)}`
                    )}
                </button>

                {/* Security Note */}
                <p className="text-center text-gray-500 text-sm mt-4">
                    🔒 Thanh toán an toàn qua cổng {paymentMethod === 'vnpay' ? 'VNPay' : 'MoMo'}
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
