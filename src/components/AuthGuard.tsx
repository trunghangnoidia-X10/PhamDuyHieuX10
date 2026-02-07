'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'

interface AuthGuardProps {
    children: ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const { user, loading, authRequired } = useAuth()
    const router = useRouter()

    // Check if user is a REAL authenticated user (not anonymous)
    const isRealUser = user && (user.email || user.user_metadata?.email)

    useEffect(() => {
        // If auth is not required (dev mode), allow access
        if (!authRequired) {
            return
        }

        // If finished loading and no real user, redirect to login
        if (!loading && !isRealUser) {
            router.push('/login')
        }
    }, [isRealUser, loading, authRequired, router])

    // Dev mode - bypass auth
    if (!authRequired) {
        return <>{children}</>
    }

    // Loading state
    if (loading) {
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
