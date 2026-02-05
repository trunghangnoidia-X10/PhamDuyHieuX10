'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function PaymentFailedContent() {
    const searchParams = useSearchParams()
    const error = searchParams.get('error')

    let errorMessage = 'Thanh toán không thành công. Vui lòng thử lại.'
    if (error === 'invalid') {
        errorMessage = 'Giao dịch không hợp lệ. Vui lòng liên hệ hỗ trợ.'
    } else if (error === 'system') {
        errorMessage = 'Lỗi hệ thống. Vui lòng thử lại sau.'
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                    <svg className="w-12 h-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>

                <h1 className="text-3xl font-bold text-white mb-3">
                    Thanh toán thất bại
                </h1>
                <p className="text-gray-400 mb-8">
                    {errorMessage}
                </p>

                <div className="space-y-3">
                    <Link
                        href="/payment"
                        className="inline-block w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:opacity-90 transition"
                    >
                        Thử lại
                    </Link>
                    <Link
                        href="/chat"
                        className="inline-block w-full py-4 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition"
                    >
                        Quay lại chat
                    </Link>
                </div>

                <p className="text-gray-500 text-sm mt-8">
                    Nếu bạn đã bị trừ tiền nhưng chưa được kích hoạt, vui lòng liên hệ{' '}
                    <a href="mailto:support@x10.vn" className="text-cyan-400 hover:underline">
                        support@x10.vn
                    </a>
                </p>
            </div>
        </div>
    )
}

export default function PaymentFailedPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full"></div>
            </div>
        }>
            <PaymentFailedContent />
        </Suspense>
    )
}
