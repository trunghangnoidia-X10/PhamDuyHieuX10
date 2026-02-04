'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Home() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-2xl font-bold gradient-text">X10</span>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link href="#about" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Về X10
                                </Link>
                                <Link href="#features" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Tính Năng
                                </Link>
                                <Link href="#pricing" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Bảng Giá
                                </Link>
                                <Link
                                    href="/chat"
                                    className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity btn-glow"
                                >
                                    Bắt Đầu Chat
                                </Link>
                            </div>
                        </div>
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-gray-300 hover:text-white p-2"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden glass">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <Link href="#about" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                                Về X10
                            </Link>
                            <Link href="#features" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                                Tính Năng
                            </Link>
                            <Link href="#pricing" className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium">
                                Bảng Giá
                            </Link>
                            <Link href="/chat" className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white block px-3 py-2 rounded-md text-base font-medium text-center">
                                Bắt Đầu Chat
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="animate-fade-in">
                        {/* Logo Image - Larger and more prominent */}
                        <div className="mb-10 flex justify-center">
                            <div className="relative">
                                <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 flex items-center justify-center">
                                    <img
                                        src="/images/x10-logo.png"
                                        alt="X10"
                                        className="w-full h-full object-contain drop-shadow-2xl"
                                    />
                                </div>
                            </div>
                        </div>

                        <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed text-center" style={{ textWrap: 'balance' }}>
                            Hành trình thức tỉnh nhận thức để phá vỡ "trần tăng trưởng" cho doanh nghiệp và xã hội
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/chat"
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full hover:opacity-90 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30 btn-glow"
                            >
                                <svg className="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                Bắt Đầu Trò Chuyện
                            </Link>
                            <Link
                                href="#about"
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-full hover:bg-white/10 transition-all"
                            >
                                Tìm Hiểu Thêm
                                <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>

            </section>

            {/* About Section */}
            <section id="about" className="py-20 bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Về <span className="gradient-text">X10</span>
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto text-center" style={{ textWrap: 'balance' }}>
                            Người bạn đồng hành trên hành trình thức tỉnh nhận thức và phát triển bản thân.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="glass rounded-2xl p-6">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mr-4">
                                        <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">Thay Đổi Niềm Tin</h3>
                                </div>
                                <p className="text-gray-400">
                                    X10 đi thẳng vào gốc rễ của mọi sự thay đổi thông qua lộ trình: Thay đổi niềm tin → Thay đổi tư duy → Thay đổi kết quả.
                                </p>
                            </div>

                            <div className="glass rounded-2xl p-6">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mr-4">
                                        <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">Sự Rung Động Nội Tâm</h3>
                                </div>
                                <p className="text-gray-400">
                                    Khi tần số rung động nội tâm thay đổi, ta nhìn thấy những điều mà bình thường khó nhìn thấy.
                                </p>
                            </div>

                            <div className="glass rounded-2xl p-6">
                                <div className="flex items-center mb-4">
                                    <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mr-4">
                                        <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white">Sẵn Sàng 24/7</h3>
                                </div>
                                <p className="text-gray-400">
                                    Trò chuyện bất cứ lúc nào bạn cần - hỗ trợ 24/7.
                                </p>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="glass rounded-2xl p-8">
                                <blockquote className="text-xl text-gray-300 italic mb-6">
                                    "Hiện thực mới đến từ Sự rung động mới. Khi chúng ta dám đối diện và bước qua những rào cản, thực tại sẽ không còn giới hạn."
                                </blockquote>
                                <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">X10</span>
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold">X10</p>
                                        <p className="text-gray-400 text-sm">Performance - Profit - Purpose</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Giá Trị <span className="gradient-text">X10</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: '🎯',
                                title: 'Đường dẫn đến Hiện thực mới',
                                description: 'Phá vỡ "trần tăng trưởng" và kiến tạo tương lai vượt trội cho doanh nghiệp.'
                            },
                            {
                                icon: '🔥',
                                title: 'Giải mã sức mạnh của Sự tập trung',
                                description: 'Tập trung giải quyết "điểm mù" lớn nhất của lãnh đạo hiện nay.'
                            },
                            {
                                icon: '👁️',
                                title: 'Công cụ duy trì Tầm nhìn',
                                description: 'Giữ vững tầm nhìn trong mọi hoàn cảnh, không bị dao động bởi thói quen cũ.'
                            },
                            {
                                icon: '💚',
                                title: 'Sự đồng thuận từ trái tim',
                                description: 'Kết nối đội ngũ từ bên trong, tạo sự cộng hưởng và sức mạnh tập thể.'
                            },
                            {
                                icon: '⚡',
                                title: 'Phản Hồi Tức Thì',
                                description: 'Không cần chờ đợi - nhận câu trả lời ngay lập tức mọi lúc mọi nơi.'
                            },
                            {
                                icon: '🌟',
                                title: 'Cập Nhật Liên Tục',
                                description: 'Nội dung coaching được cập nhật thường xuyên với kiến thức mới nhất.'
                            }
                        ].map((feature, index) => (
                            <div key={index} className="glass rounded-2xl p-6 hover:bg-white/10 transition-all transform hover:scale-105 hover:shadow-xl">
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20 bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Gói Đăng Ký <span className="gradient-text">Linh Hoạt</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Chọn gói phù hợp với nhu cầu của bạn
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Monthly Plan */}
                        <div className="glass rounded-2xl p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                PHỔ BIẾN
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Gói Tháng</h3>
                            <div className="flex items-baseline mb-6">
                                <span className="text-5xl font-bold text-white">100K</span>
                                <span className="text-gray-400 ml-2">VND/tháng</span>
                            </div>
                            <ul className="space-y-4 mb-8">
                                {[
                                    'Chat không giới hạn',
                                    'Lịch sử trò chuyện',
                                    'Cập nhật nội dung mới',
                                    'Hỗ trợ 24/7'
                                ].map((feature, index) => (
                                    <li key={index} className="flex items-center text-gray-300">
                                        <svg className="w-5 h-5 text-green-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/chat"
                                className="block w-full text-center py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold rounded-full hover:opacity-90 transition-all btn-glow"
                            >
                                Bắt Đầu Ngay
                            </Link>
                        </div>

                        {/* Yearly Plan */}
                        <div className="glass rounded-2xl p-8 relative overflow-hidden border-2 border-purple-500/50">
                            <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                TIẾT KIỆM 17%
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Gói Năm</h3>
                            <div className="flex items-baseline mb-6">
                                <span className="text-5xl font-bold gradient-text">1.000K</span>
                                <span className="text-gray-400 ml-2">VND/năm</span>
                            </div>
                            <ul className="space-y-4 mb-8">
                                {[
                                    'Tất cả tính năng gói Tháng',
                                    'Tiết kiệm 200K/năm',
                                    'Ưu tiên hỗ trợ',
                                    'Tính năng mới sớm nhất',
                                    'Nội dung Premium'
                                ].map((feature, index) => (
                                    <li key={index} className="flex items-center text-gray-300">
                                        <svg className="w-5 h-5 text-purple-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Link
                                href="/chat"
                                className="block w-full text-center py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full hover:opacity-90 transition-all btn-glow"
                            >
                                Đăng Ký Ngay
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Sẵn Sàng <span className="gradient-text">Phá Vỡ Giới Hạn</span>?
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                        Hiện thực mới đến từ Sự rung động mới. Hãy bắt đầu hành trình X10 ngay hôm nay.
                    </p>
                    <Link
                        href="/chat"
                        className="inline-flex items-center justify-center px-10 py-5 text-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full hover:opacity-90 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30 btn-glow"
                    >
                        <svg className="w-7 h-7 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Bắt Đầu Ngay
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="flex items-center mb-4 md:mb-0">
                            <span className="text-xl font-bold gradient-text">X10</span>
                            <span className="text-gray-400 ml-4">© 2026 All rights reserved</span>
                        </div>
                        <div className="flex space-x-6">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">Điều khoản</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">Bảo mật</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">Liên hệ</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
