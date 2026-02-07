'use client'

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'
import { User, Session, RealtimeChannel } from '@supabase/supabase-js'
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

// Generate a unique session token
const generateSessionToken = (): string => {
    return crypto.randomUUID()
}

interface AuthContextType {
    user: User | null
    session: Session | null
    subscription: Subscription | null
    loading: boolean
    authRequired: boolean
    sessionKicked: boolean
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>
    signUp: (email: string, password: string) => Promise<{ error: Error | null }>
    signInWithGoogle: () => Promise<{ error: Error | null }>
    signOut: () => Promise<void>
    refreshSubscription: () => Promise<void>
    clearSessionKicked: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [subscription, setSubscription] = useState<Subscription | null>(null)
    const [loading, setLoading] = useState(true)
    const [sessionKicked, setSessionKicked] = useState(false)
    const [realtimeChannel, setRealtimeChannel] = useState<RealtimeChannel | null>(null)
    const authRequired = isAuthRequired()

    // Clear session kicked state
    const clearSessionKicked = useCallback(() => {
        setSessionKicked(false)
    }, [])

    // Register device with session token
    const registerDevice = async (userId: string): Promise<string | null> => {
        const fingerprint = generateDeviceFingerprint()
        const deviceName = getDeviceName()
        const sessionToken = generateSessionToken()

        try {
            // First, invalidate ALL other devices for this user (single device policy)
            await supabase
                .from('devices')
                .update({ is_active: false })
                .eq('user_id', userId)
                .neq('device_fingerprint', fingerprint)

            // Upsert current device with new session token
            const { error } = await supabase
                .from('devices')
                .upsert({
                    user_id: userId,
                    device_fingerprint: fingerprint,
                    device_name: deviceName,
                    last_active: new Date().toISOString(),
                    session_token: sessionToken,
                    is_active: true
                }, {
                    onConflict: 'user_id,device_fingerprint'
                })

            if (error) throw error

            // Store session token locally
            localStorage.setItem('x10_session_token', sessionToken)
            localStorage.setItem('x10_device_fingerprint', fingerprint)

            // Remove oldest devices beyond limit (keep only 1)
            const { data: devices } = await supabase
                .from('devices')
                .select('*')
                .eq('user_id', userId)
                .order('last_active', { ascending: false })

            if (devices && devices.length > 1) {
                const devicesToRemove = devices.slice(1)
                for (const device of devicesToRemove) {
                    await supabase.from('devices').delete().eq('id', device.id)
                }
            }

            return sessionToken
        } catch (error) {
            console.error('Error registering device:', error)
            return null
        }
    }

    // Check if current session is still valid
    const checkSessionValidity = useCallback(async (userId: string): Promise<boolean> => {
        const localToken = localStorage.getItem('x10_session_token')
        const fingerprint = localStorage.getItem('x10_device_fingerprint')

        if (!localToken || !fingerprint) return true // No token stored yet

        try {
            const { data: device } = await supabase
                .from('devices')
                .select('session_token, is_active')
                .eq('user_id', userId)
                .eq('device_fingerprint', fingerprint)
                .single()

            if (!device) return true // Device not found (new device)

            // Check if session is still active and token matches
            if (!device.is_active || device.session_token !== localToken) {
                console.log('Session invalidated by another device')
                return false
            }

            return true
        } catch (error) {
            console.error('Error checking session:', error)
            return true // Assume valid on error
        }
    }, [])

    // Setup realtime subscription for session kicks
    const setupRealtimeSubscription = useCallback((userId: string) => {
        const fingerprint = localStorage.getItem('x10_device_fingerprint')
        if (!fingerprint) return

        // Clean up existing subscription
        if (realtimeChannel) {
            supabase.removeChannel(realtimeChannel)
        }

        const channel = supabase
            .channel(`device_${userId}`)
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'devices',
                    filter: `user_id=eq.${userId}`
                },
                async (payload) => {
                    const updatedDevice = payload.new as { device_fingerprint: string, is_active: boolean, session_token: string }
                    const localFingerprint = localStorage.getItem('x10_device_fingerprint')
                    const localToken = localStorage.getItem('x10_session_token')

                    // Check if THIS device was deactivated
                    if (updatedDevice.device_fingerprint === localFingerprint) {
                        if (!updatedDevice.is_active || updatedDevice.session_token !== localToken) {
                            console.log('This device was kicked!')
                            setSessionKicked(true)
                        }
                    }
                }
            )
            .subscribe()

        setRealtimeChannel(channel)
    }, [realtimeChannel])

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
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false) // Show page immediately

            if (session?.user) {
                // Run device registration and subscription fetch in background (non-blocking)
                checkSessionValidity(session.user.id).then(isValid => {
                    if (!isValid) {
                        setSessionKicked(true)
                    } else {
                        registerDevice(session.user.id)
                        setupRealtimeSubscription(session.user.id)
                    }
                })
                fetchSubscription(session.user.id)
            }
        })

        // Listen for auth changes
        const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setSession(session)
                setUser(session?.user ?? null)
                setLoading(false)

                if (session?.user) {
                    // Background operations — don't block UI
                    registerDevice(session.user.id)
                    setupRealtimeSubscription(session.user.id)
                    fetchSubscription(session.user.id)
                } else {
                    setSubscription(null)
                    setSessionKicked(false)
                    // Clean up realtime subscription
                    if (realtimeChannel) {
                        supabase.removeChannel(realtimeChannel)
                        setRealtimeChannel(null)
                    }
                }
            }
        )

        return () => {
            authSubscription.unsubscribe()
            if (realtimeChannel) {
                supabase.removeChannel(realtimeChannel)
            }
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
                redirectTo: `${window.location.origin}/chat`,
                queryParams: {
                    prompt: 'select_account'
                }
            }
        })
        return { error: error as Error | null }
    }

    const signOut = async () => {
        // Clean up local storage
        localStorage.removeItem('x10_session_token')
        localStorage.removeItem('x10_device_fingerprint')
        // Clear state immediately
        setUser(null)
        setSession(null)
        setSubscription(null)
        setSessionKicked(false)
        // Clean up realtime channel
        if (realtimeChannel) {
            supabase.removeChannel(realtimeChannel)
            setRealtimeChannel(null)
        }
        // Sign out globally (clears server-side session too)
        await supabase.auth.signOut({ scope: 'global' })
    }

    return (
        <AuthContext.Provider value={{
            user,
            session,
            subscription,
            loading,
            authRequired,
            sessionKicked,
            signIn,
            signUp,
            signInWithGoogle,
            signOut,
            refreshSubscription,
            clearSessionKicked
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
