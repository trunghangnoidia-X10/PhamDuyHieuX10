'use client'

import { useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

interface AuthGuardProps {
    children: ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const { user, loading, authRequired } = useAuth()
    const router = useRouter()
    const [loadingTimeout, setLoadingTimeout] = useState(false)

    // Check if user is a REAL authenticated user (not anonymous)
    const isRealUser = user && (user.email || user.user_metadata?.email)

    // Loading timeout - if loading takes more than 5 seconds, redirect to login
    useEffect(() => {
        if (loading && authRequired) {
            const timer = setTimeout(() => {
                setLoadingTimeout(true)
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [loading, authRequired])

    useEffect(() => {
        // If auth is not required (dev mode), allow access
        if (!authRequired) {
            return
        }

        // If finished loading and no real user, redirect to login
        if ((!loading || loadingTimeout) && !isRealUser) {
            router.push('/login')
        }
    }, [isRealUser, loading, loadingTimeout, authRequired, router])

    // Dev mode - bypass auth
    if (!authRequired) {
        return <>{children}</>
    }

    // Loading state (with timeout protection)
    if (loading && !loadingTimeout) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 relative">
                        <div className="absolute inset-0 rounded-full border-4 border-purple-500/30"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin"></div>
                    </div>
                    <p className="text-gray-400">Đang tải...</p>
                </div>
            </div>
        )
    }

    // No real user - will redirect
    if (!isRealUser) {
        return null
    }

    // User is properly authenticated
    return <>{children}</>
}
