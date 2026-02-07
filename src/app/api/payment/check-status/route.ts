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

// Kiểm tra trạng thái thanh toán (polling từ client)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const orderId = searchParams.get('orderId')

        if (!orderId) {
            return NextResponse.json({ error: 'Missing orderId' }, { status: 400 })
        }

        const { data: payment, error } = await getSupabase()
            .from('payments')
            .select('status, completed_at')
            .eq('order_id', orderId)
            .single()

        if (error || !payment) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        return NextResponse.json({
            status: payment.status,
            completed: payment.status === 'completed',
            completedAt: payment.completed_at
        })
    } catch (error) {
        console.error('Check status error:', error)
        return NextResponse.json({ error: 'Internal error' }, { status: 500 })
    }
}
