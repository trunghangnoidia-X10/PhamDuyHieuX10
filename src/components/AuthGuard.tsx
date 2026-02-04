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

    useEffect(() => {
        // If auth is not required (dev mode), allow access
        if (!authRequired) {
            return
        }

        // If finished loading and no user, redirect to login
        if (!loading && !user) {
            router.push('/login')
        }
    }, [user, loading, authRequired, router])

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

    // No user - will redirect
    if (!user) {
        return null
    }

    // User is authenticated
    return <>{children}</>
}
