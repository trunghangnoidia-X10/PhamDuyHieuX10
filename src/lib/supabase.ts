import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for database tables
export interface Subscription {
    id: string
    user_id: string
    plan: 'free' | 'monthly' | 'yearly'
    status: 'active' | 'expired' | 'cancelled'
    started_at: string
    expires_at: string | null
    created_at: string
}

export interface Device {
    id: string
    user_id: string
    device_fingerprint: string
    device_name: string | null
    last_active: string
    created_at: string
}

// Helper function to check if auth is required
export const isAuthRequired = () => {
    return process.env.NEXT_PUBLIC_AUTH_REQUIRED === 'true'
}
