'use client'

import Link from 'next/link'

interface UpgradeModalProps {
    isOpen: boolean
    onClose: () => void
    isDarkMode: boolean
}

const COACHING_QUOTES = [
    '"Hiện thực bên trong kiến tạo hiện thực bên ngoài" — Phạm Duy Hiếu',
    '"Muốn là khởi đầu, muốn thì sẽ tìm hiểu, muốn thì sẽ dấn thân trải nghiệm" — X10',
    '"Khi bạn thay đổi cách nhìn, thế giới quanh bạn cũng thay đổi" — X10',
    '"Phụng sự là chỉ dẫn, lợi nhuận là kết quả" — Phạm Duy Hiếu',
]

export default function UpgradeModal({ isOpen, onClose, isDarkMode }: UpgradeModalProps) {
    if (!isOpen) return null

    const randomQuote = COACHING_QUOTES[Math.floor(Math.random() * COACHING_QUOTES.length)]

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className={`mx-4 max-w-md w-full rounded-2xl p-6 shadow-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                <div className="text-center">
                    {/* Icon */}
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                        <span className="text-3xl">🔑</span>
                    </div>

                    {/* Title */}
                    <h2 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        Cuộc trò chuyện đang rất thú vị!
                    </h2>

                    {/* Subtitle */}
                    <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Bạn đã dùng hết tin nhắn miễn phí hôm nay. Nâng cấp để tôi đồng hành cùng bạn mỗi ngày nhé!
                    </p>

                    {/* Quote */}
                    <div className={`mb-6 px-4 py-3 rounded-xl italic text-sm ${isDarkMode
                        ? 'bg-purple-500/10 border border-purple-500/20 text-purple-300'
                        : 'bg-purple-50 border border-purple-200 text-purple-700'
                        }`}>
                        {randomQuote}
                    </div>

                    {/* Benefits */}
                    <div className={`mb-6 text-left space-y-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <p className="text-sm font-medium mb-3">Thành viên được:</p>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-green-500">✓</span>
                            <span>Trò chuyện không giới hạn</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-green-500">✓</span>
                            <span>AI nhớ context cá nhân</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-green-500">✓</span>
                            <span>Lưu lịch sử hội thoại</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-green-500">✓</span>
                            <span>Bookmark câu trả lời hay</span>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-3">
                        <Link
                            href="/payment"
                            className="block w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium rounded-xl hover:opacity-90 transition text-center"
                        >
                            Nâng cấp thành viên ✨
                        </Link>
                        <button
                            onClick={onClose}
                            className={`w-full py-3 px-6 rounded-xl font-medium transition ${isDarkMode
                                ? 'bg-white/5 hover:bg-white/10 text-gray-400'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                                }`}
                        >
                            Quay lại
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
