import { NextResponse } from 'next/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy initialization
let supabaseInstance: SupabaseClient | null = null

function getSupabase() {
    if (!supabaseInstance) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (!url || !key) throw new Error('Missing Supabase config')
        supabaseInstance = createClient(url, key)
    }
    return supabaseInstance
}

// Constants
const FREE_MESSAGES_PER_DAY = 3
const TRIAL_DAYS = 3

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')

        if (!userId) {
            return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
        }

        const supabase = getSupabase()

        // 1. Check subscription status
        const { data: subscription } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'active')
            .single()

        if (subscription && new Date(subscription.expires_at) > new Date()) {
            return NextResponse.json({
                canSend: true,
                messagesUsed: 0,
                messagesLimit: -1, // unlimited
                isTrialPeriod: false,
                trialDaysLeft: 0,
                isPremium: true
            })
        }

        // 2. Check trial period (account age <= 3 days)
        const { data: userData } = await supabase.auth.admin.getUserById(userId)

        if (!userData?.user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const createdAt = new Date(userData.user.created_at)
        const now = new Date()
        const accountAgeDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
        const isTrialPeriod = accountAgeDays < TRIAL_DAYS
        const trialDaysLeft = isTrialPeriod ? TRIAL_DAYS - accountAgeDays : 0

        if (isTrialPeriod) {
            return NextResponse.json({
                canSend: true,
                messagesUsed: 0,
                messagesLimit: -1, // unlimited during trial
                isTrialPeriod: true,
                trialDaysLeft,
                isPremium: false
            })
        }

        // 3. Free user past trial - check daily usage
        const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD

        const { data: usage } = await supabase
            .from('message_usage')
            .select('message_count')
            .eq('user_id', userId)
            .eq('usage_date', today)
            .single()

        const messagesUsed = usage?.message_count || 0

        return NextResponse.json({
            canSend: messagesUsed < FREE_MESSAGES_PER_DAY,
            messagesUsed,
            messagesLimit: FREE_MESSAGES_PER_DAY,
            isTrialPeriod: false,
            trialDaysLeft: 0,
            isPremium: false
        })

    } catch (error) {
        console.error('Usage check error:', error)
        // On error, allow sending (don't block user due to system errors)
        return NextResponse.json({
            canSend: true,
            messagesUsed: 0,
            messagesLimit: -1,
            isTrialPeriod: false,
            trialDaysLeft: 0,
            isPremium: false
        })
    }
}
