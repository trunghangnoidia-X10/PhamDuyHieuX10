'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, isAuthRequired, Subscription } from './supabase'

// Generate device fingerprint
const generateDeviceFingerprint = (): string => {
    if (typeof window === 'undefined') return 'server'

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (ctx) {
        ctx.textBaseline = 'top'
        ctx.font = '14px Arial'
        ctx.fillText('X10 Device', 2, 2)
    }

    const fingerprint = [
        navigator.userAgent,
        navigator.language,
        screen.width + 'x' + screen.height,
        new Date().getTimezoneOffset(),
        canvas.toDataURL()
    ].join('|')

    // Simple hash
    let hash = 0
    for (let i = 0; i < fingerprint.length; i++) {
        const char = fingerprint.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash
    }

    return 'device_' + Math.abs(hash).toString(36)
}

// Get device name
const getDeviceName = (): string => {
    if (typeof window === 'undefined') return 'Unknown'

    const ua = navigator.userAgent
    if (ua.includes('iPhone')) return 'iPhone'
    if (ua.includes('iPad')) return 'iPad'
    if (ua.includes('Android')) return 'Android'
    if (ua.includes('Windows')) return 'Windows PC'
    if (ua.includes('Mac')) return 'Mac'
    return 'Unknown Device'
}

interface AuthContextType {
    user: User | null
    session: Session | null
    subscription: Subscription | null
    loading: boolean
    authRequired: boolean
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>
    signUp: (email: string, password: string) => Promise<{ error: Error | null }>
    signInWithGoogle: () => Promise<{ error: Error | null }>
    signOut: () => Promise<void>
    refreshSubscription: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [subscription, setSubscription] = useState<Subscription | null>(null)
    const [loading, setLoading] = useState(true)
    const authRequired = isAuthRequired()

    // Register device
    const registerDevice = async (userId: string) => {
        const fingerprint = generateDeviceFingerprint()
        const deviceName = getDeviceName()

        try {
            // Upsert device (update last_active if exists, insert if not)
            await supabase
                .from('devices')
                .upsert({
                    user_id: userId,
                    device_fingerprint: fingerprint,
                    device_name: deviceName,
                    last_active: new Date().toISOString()
                }, {
                    onConflict: 'user_id,device_fingerprint'
                })

            // Check device count - max 2 devices
            const { data: devices } = await supabase
                .from('devices')
                .select('*')
                .eq('user_id', userId)
                .order('last_active', { ascending: false })

            if (devices && devices.length > 2) {
                // Remove oldest devices beyond limit
                const devicesToRemove = devices.slice(2)
                for (const device of devicesToRemove) {
                    await supabase.from('devices').delete().eq('id', device.id)
                }
            }
        } catch (error) {
            console.error('Error registering device:', error)
        }
    }

    // Fetch subscription
    const fetchSubscription = async (userId: string) => {
        try {
            const { data } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('user_id', userId)
                .single()

            setSubscription(data)
        } catch (error) {
            console.log('No subscription found')
            setSubscription(null)
        }
    }

    const refreshSubscription = async () => {
        if (user) {
            await fetchSubscription(user.id)
        }
    }

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            setUser(session?.user ?? null)

            if (session?.user) {
                registerDevice(session.user.id)
                fetchSubscription(session.user.id)
            }

            setLoading(false)
        })

        // Listen for auth changes
        const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setSession(session)
                setUser(session?.user ?? null)

                if (session?.user) {
                    registerDevice(session.user.id)
                    fetchSubscription(session.user.id)
                } else {
                    setSubscription(null)
                }

                setLoading(false)
            }
        )

        return () => {
            authSubscription.unsubscribe()
        }
    }, [])

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        })
        return { error: error as Error | null }
    }

    const signUp = async (email: string, password: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password
        })
        return { error: error as Error | null }
    }

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/chat`
            }
        })
        return { error: error as Error | null }
    }

    const signOut = async () => {
        await supabase.auth.signOut()
    }

    return (
        <AuthContext.Provider value={{
            user,
            session,
            subscription,
            loading,
            authRequired,
            signIn,
            signUp,
            signInWithGoogle,
            signOut,
            refreshSubscription
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
