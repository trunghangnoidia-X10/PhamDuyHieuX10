'use client'

import { useState, useEffect } from 'react'

const ONBOARDING_KEY = 'x10-onboarding-complete'

interface OnboardingModalProps {
    isDarkMode?: boolean
}

interface Slide {
    icon: string
    title: string
    description: string
    tips?: string[]
}

const slides: Slide[] = [
    {
        icon: '👋',
        title: 'Chào mừng đến với X10!',
        description: 'X10 là người bạn đồng hành trên hành trình thức tỉnh nhận thức và phát triển bản thân của bạn.',
        tips: [
            'Triết lý X10: "Hiện thực mới đến từ Sự rung động mới"',
            'Đồng hành 24/7, bất cứ lúc nào bạn cần'
        ]
    },
    {
        icon: '💬',
        title: 'Trò chuyện với X10',
        description: 'Hãy đặt câu hỏi về bất kỳ chủ đề nào bạn quan tâm.',
        tips: [
            '🎯 Phá vỡ trần tăng trưởng',
            '💼 Phát triển sự nghiệp',
            '🧘 Tu tập trong doanh nghiệp',
            '💡 Lãnh đạo tỉnh thức'
        ]
    },
    {
        icon: '🎤',
        title: 'Nhập liệu bằng giọng nói',
        description: 'Bạn có thể nói thay vì gõ! Nhấn nút micro để X10 lắng nghe.',
        tips: [
            'Nói tiếng Việt tự nhiên',
            'X10 sẽ chuyển giọng nói thành văn bản'
        ]
    },
    {
        icon: '✨',
        title: 'Các tính năng hữu ích',
        description: 'Khám phá thêm nhiều tính năng!',
        tips: [
            '📋 Sao chép câu trả lời',
            '📤 Chia sẻ lên mạng xã hội',
            '📁 Xuất lịch sử chat',
            '🌙 Chế độ sáng/tối'
        ]
    },
    {
        icon: '🚀',
        title: 'Bắt đầu hành trình!',
        description: 'Bạn đã sẵn sàng! Hãy bắt đầu trò chuyện với X10 ngay bây giờ.',
        tips: [
            'Mỗi ngày dành 5 phút để reflect sẽ giúp bạn tiến bộ',
            'X10 luôn ở đây khi bạn cần'
        ]
    }
]

export default function OnboardingModal({ isDarkMode = true }: OnboardingModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [currentSlide, setCurrentSlide] = useState(0)

    useEffect(() => {
        // Check if user has completed onboarding
        const completed = localStorage.getItem(ONBOARDING_KEY)
        if (!completed) {
            // Small delay for better UX
            const timer = setTimeout(() => setIsOpen(true), 500)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(prev => prev + 1)
        } else {
            handleComplete()
        }
    }

    const handlePrev = () => {
        if (currentSlide > 0) {
            setCurrentSlide(prev => prev - 1)
        }
    }

    const handleComplete = () => {
        localStorage.setItem(ONBOARDING_KEY, 'true')
        setIsOpen(false)
    }

    const handleSkip = () => {
        handleComplete()
    }

    if (!isOpen) return null

    const slide = slides[currentSlide]
    const isLastSlide = currentSlide === slides.length - 1

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className={`relative mx-4 max-w-lg w-full rounded-3xl p-8 shadow-2xl ${isDarkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-white'}`}>
                {/* Skip button */}
                <button
                    onClick={handleSkip}
                    className={`absolute top-4 right-4 text-sm ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Bỏ qua
                </button>

                {/* Content */}
                <div className="text-center">
                    {/* Icon */}
                    <div className="text-6xl mb-6 animate-bounce">
                        {slide.icon}
                    </div>

                    {/* Title */}
                    <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                        {slide.title}
                    </h2>

                    {/* Description */}
                    <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {slide.description}
                    </p>

                    {/* Tips */}
                    {slide.tips && (
                        <div className={`text-left rounded-xl p-4 mb-6 ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                            <ul className="space-y-2">
                                {slide.tips.map((tip, index) => (
                                    <li key={index} className={`flex items-start gap-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        <span className="text-cyan-400 mt-0.5">•</span>
                                        <span>{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Progress dots */}
                    <div className="flex justify-center gap-2 mb-6">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentSlide
                                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 scale-125'
                                        : isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex gap-3">
                        {currentSlide > 0 && (
                            <button
                                onClick={handlePrev}
                                className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${isDarkMode
                                        ? 'bg-white/10 text-white hover:bg-white/20'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                ← Quay lại
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:opacity-90 ${currentSlide === 0 ? 'w-full' : ''}`}
                        >
                            {isLastSlide ? '🚀 Bắt đầu!' : 'Tiếp theo →'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
