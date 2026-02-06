import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const ADMIN_EMAIL = 'ttrungphamkpl@gmail.com'

export async function GET(request: NextRequest) {
    try {
        // Get authorization header
        const authHeader = request.headers.get('authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const token = authHeader.split(' ')[1]

        // Create Supabase client
        const supabase = createClient(supabaseUrl, supabaseServiceKey)

        // Verify user token
        const { data: { user }, error: authError } = await supabase.auth.getUser(token)
        if (authError || !user) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
        }

        // Check if user is admin
        if (user.email !== ADMIN_EMAIL) {
            return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 })
        }

        // Get statistics
        // 1. Total users count
        const { count: totalUsers, error: usersError } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })

        // If profiles table doesn't exist, try auth.users via admin API
        let userCount = totalUsers ?? 0
        if (usersError) {
            // Fallback: use admin API to list users
            const { data: { users: allUsers }, error: listError } = await supabase.auth.admin.listUsers()
            if (!listError && allUsers) {
                userCount = allUsers.length
            }
        }

        // 2. Payment statistics
        const { data: payments, error: paymentsError } = await supabase
            .from('payments')
            .select('amount, status, plan_type, created_at')

        let totalRevenue = 0
        let completedPayments = 0
        let monthlySubscribers = 0
        let yearlySubscribers = 0

        if (!paymentsError && payments) {
            for (const payment of payments) {
                if (payment.status === 'completed') {
                    completedPayments++
                    totalRevenue += payment.amount || 0
                    if (payment.plan_type === 'monthly') monthlySubscribers++
                    if (payment.plan_type === 'yearly') yearlySubscribers++
                }
            }
        }

        // 3. Active users in last 7 days (based on payments or memories)
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const { count: activeUsers } = await supabase
            .from('memories')
            .select('user_id', { count: 'exact', head: true })
            .gte('created_at', sevenDaysAgo.toISOString())

        // 4. Recent registrations (last 30 days)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const { data: { users: recentUsers } } = await supabase.auth.admin.listUsers()
        const newUsersThisMonth = recentUsers?.filter(u =>
            new Date(u.created_at) >= thirtyDaysAgo
        ).length ?? 0

        return NextResponse.json({
            success: true,
            stats: {
                totalUsers: userCount,
                activeUsers: activeUsers ?? 0,
                newUsersThisMonth,
                totalRevenue,
                completedPayments,
                monthlySubscribers,
                yearlySubscribers
            },
            timestamp: new Date().toISOString()
        })

    } catch (error) {
        console.error('Admin stats error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
