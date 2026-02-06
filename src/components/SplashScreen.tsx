'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface SplashScreenProps {
    children: React.ReactNode
}

export default function SplashScreen({ children }: SplashScreenProps) {
    const [showSplash, setShowSplash] = useState(true)
    const [fadeOut, setFadeOut] = useState(false)

    useEffect(() => {
        // Check if this is a first visit or refresh
        const hasVisited = sessionStorage.getItem('x10-splash-shown')

        if (hasVisited) {
            setShowSplash(false)
            return
        }

        // Show splash for 2 seconds, then fade out
        const fadeTimer = setTimeout(() => {
            setFadeOut(true)
        }, 1500)

        const hideTimer = setTimeout(() => {
            setShowSplash(false)
            sessionStorage.setItem('x10-splash-shown', 'true')
        }, 2000)

        return () => {
            clearTimeout(fadeTimer)
            clearTimeout(hideTimer)
        }
    }, [])

    if (!showSplash) {
        return <>{children}</>
    }

    return (
        <>
            {/* Splash Screen Overlay */}
            <div
                className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
            >
                <div className="text-center">
                    {/* Animated Logo */}
                    <div className="relative w-32 h-32 mx-auto mb-6 animate-splash-logo">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 animate-pulse opacity-30 blur-xl"></div>
                        <div className="relative w-32 h-32 rounded-full bg-white shadow-2xl flex items-center justify-center overflow-hidden border-4 border-white/20">
                            <Image
                                src="/images/x10-logo.png"
                                alt="X10"
                                width={100}
                                height={100}
                                className="object-contain p-2"
                                priority
                            />
                        </div>
                    </div>

                    {/* App Name */}
                    <h1 className="text-3xl font-bold text-white mb-2 animate-fade-in-up">
                        <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                            X10
                        </span>
                    </h1>

                    <p className="text-gray-400 text-sm animate-fade-in-up animation-delay-200">
                        Life Coach AI
                    </p>

                    {/* Loading dots */}
                    <div className="flex justify-center gap-1 mt-6">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>
            </div>

            {/* Preload content behind */}
            <div className="opacity-0">{children}</div>
        </>
    )
}
