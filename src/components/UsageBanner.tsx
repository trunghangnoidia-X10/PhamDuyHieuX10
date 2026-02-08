'use client'

interface UsageBannerProps {
    isDarkMode: boolean
    canSend: boolean
    messagesUsed: number
    messagesLimit: number
    isTrialPeriod: boolean
    trialDaysLeft: number
    isPremium: boolean
    onUpgradeClick: () => void
}

export default function UsageBanner({
    isDarkMode,
    canSend,
    messagesUsed,
    messagesLimit,
    isTrialPeriod,
    trialDaysLeft,
    isPremium,
    onUpgradeClick
}: UsageBannerProps) {
    // Premium users - don't show banner
    if (isPremium) return null

    // Trial period
    if (isTrialPeriod) {
        return (
            <div className={`mx-auto max-w-4xl px-4 mb-2`}>
                <div className={`flex items-center justify-between px-4 py-2 rounded-xl text-sm ${isDarkMode
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                    : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                    }`}>
                    <div className="flex items-center gap-2">
                        <span>🎉</span>
                        <span>
                            Dùng thử miễn phí — Còn <strong>{trialDaysLeft} ngày</strong> không giới hạn
                        </span>
                    </div>
                    <button
                        onClick={onUpgradeClick}
                        className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${isDarkMode
                            ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300'
                            : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                            }`}
                    >
                        Nâng cấp
                    </button>
                </div>
            </div>
        )
    }

    // Free user - out of messages
    if (!canSend) {
        return (
            <div className={`mx-auto max-w-4xl px-4 mb-2`}>
                <div className={`flex items-center justify-between px-4 py-2 rounded-xl text-sm ${isDarkMode
                    ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                    : 'bg-amber-50 border border-amber-200 text-amber-700'
                    }`}>
                    <div className="flex items-center gap-2">
                        <span>🔒</span>
                        <span>Đã hết lượt miễn phí hôm nay</span>
                    </div>
                    <button
                        onClick={onUpgradeClick}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:opacity-90 transition"
                    >
                        Nâng cấp ngay ✨
                    </button>
                </div>
            </div>
        )
    }

    // Free user - has messages remaining
    if (messagesLimit > 0) {
        const remaining = messagesLimit - messagesUsed
        return (
            <div className={`mx-auto max-w-4xl px-4 mb-2`}>
                <div className={`flex items-center justify-between px-4 py-2 rounded-xl text-sm ${isDarkMode
                    ? 'bg-white/5 border border-white/10 text-gray-400'
                    : 'bg-gray-50 border border-gray-200 text-gray-600'
                    }`}>
                    <div className="flex items-center gap-2">
                        <span>💬</span>
                        <span>
                            Còn <strong className={isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}>{remaining}/{messagesLimit}</strong> tin nhắn miễn phí hôm nay
                        </span>
                    </div>
                    <button
                        onClick={onUpgradeClick}
                        className={`text-xs px-3 py-1 rounded-lg font-medium transition-colors ${isDarkMode
                            ? 'bg-white/5 hover:bg-white/10 text-gray-300'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                    >
                        Nâng cấp
                    </button>
                </div>
            </div>
        )
    }

    return null
}
