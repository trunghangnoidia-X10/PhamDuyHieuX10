'use client'

import { useToast, ToastType } from '@/lib/toast'

const toastStyles: Record<ToastType, { bg: string; icon: string; border: string }> = {
    success: {
        bg: 'bg-gradient-to-r from-emerald-500/90 to-green-500/90',
        border: 'border-emerald-400/50',
        icon: '✓'
    },
    error: {
        bg: 'bg-gradient-to-r from-red-500/90 to-rose-500/90',
        border: 'border-red-400/50',
        icon: '✕'
    },
    warning: {
        bg: 'bg-gradient-to-r from-amber-500/90 to-orange-500/90',
        border: 'border-amber-400/50',
        icon: '⚠'
    },
    info: {
        bg: 'bg-gradient-to-r from-cyan-500/90 to-blue-500/90',
        border: 'border-cyan-400/50',
        icon: 'ℹ'
    }
}

export default function ToastContainer() {
    const { toasts, hideToast } = useToast()

    if (toasts.length === 0) return null

    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm">
            {toasts.map((toast) => {
                const style = toastStyles[toast.type]
                return (
                    <div
                        key={toast.id}
                        className={`
                            ${style.bg} ${style.border}
                            backdrop-blur-lg border
                            text-white px-4 py-3 rounded-xl shadow-2xl
                            flex items-center gap-3
                            animate-toast-in
                            cursor-pointer
                            hover:scale-[1.02] transition-transform
                        `}
                        onClick={() => hideToast(toast.id)}
                    >
                        <span className="text-lg font-bold w-6 h-6 flex items-center justify-center rounded-full bg-white/20">
                            {style.icon}
                        </span>
                        <span className="flex-1 text-sm font-medium">{toast.message}</span>
                        <button
                            className="text-white/70 hover:text-white transition-colors"
                            onClick={(e) => { e.stopPropagation(); hideToast(toast.id) }}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )
            })}
        </div>
    )
}
