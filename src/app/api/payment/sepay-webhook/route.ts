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

// SePay Webhook - Nhận thông báo khi có tiền vào tài khoản ngân hàng
export async function POST(request: Request) {
    try {
        // Xác thực API Key
        const authHeader = request.headers.get('Authorization')
        const expectedKey = process.env.SEPAY_API_KEY

        if (expectedKey && authHeader) {
            const token = authHeader.replace('Apikey ', '').replace('Bearer ', '')
            if (token !== expectedKey) {
                console.error('SePay webhook: Invalid API key')
                return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
            }
        }

        const body = await request.json()
        console.log('SePay webhook received:', JSON.stringify(body))

        const {
            id,              // ID giao dịch trên SePay
            gateway,         // Tên ngân hàng
            transactionDate, // Thời gian giao dịch
            accountNumber,   // Số tài khoản
            code,            // Mã code thanh toán (SePay tự nhận diện)
            content,         // Nội dung chuyển khoản
            transferType,    // "in" = tiền vào, "out" = tiền ra
            transferAmount,  // Số tiền giao dịch
            referenceCode,   // Mã tham chiếu
            description      // Nội dung đầy đủ
        } = body

        // Chỉ xử lý tiền VÀO
        if (transferType !== 'in') {
            return NextResponse.json({ success: true, message: 'Ignored outgoing transaction' }, { status: 200 })
        }

        // Tìm mã đơn hàng trong nội dung chuyển khoản
        // SePay tự nhận diện code, hoặc tìm pattern X10_xxxxx trong content
        let orderCode = code
        if (!orderCode && content) {
            const match = content.match(/X10[_\s]?\d+/i)
            if (match) {
                orderCode = match[0].replace(/\s/g, '_').toUpperCase()
            }
        }

        if (!orderCode) {
            console.log('SePay webhook: No order code found in transaction', { content, description })
            return NextResponse.json({ success: true, message: 'No order code found' }, { status: 200 })
        }

        // Tìm đơn hàng pending trong database
        const { data: payment, error: findError } = await getSupabase()
            .from('payments')
            .select('*')
            .eq('order_id', orderCode)
            .eq('status', 'pending')
            .single()

        if (findError || !payment) {
            console.log('SePay webhook: Order not found or already processed', { orderCode })
            return NextResponse.json({ success: true, message: 'Order not found or already processed' }, { status: 200 })
        }

        // Kiểm tra số tiền
        if (transferAmount < payment.amount) {
            console.log('SePay webhook: Insufficient amount', { expected: payment.amount, received: transferAmount })
            await getSupabase()
                .from('payments')
                .update({
                    status: 'underpaid',
                    metadata: { sepay_id: id, gateway, transferAmount, content, referenceCode, transactionDate }
                })
                .eq('order_id', orderCode)
            return NextResponse.json({ success: true, message: 'Underpaid' }, { status: 200 })
        }

        // Cập nhật payment → completed
        await getSupabase()
            .from('payments')
            .update({
                status: 'completed',
                transaction_id: referenceCode || id?.toString(),
                completed_at: new Date().toISOString(),
                metadata: { sepay_id: id, gateway, transferAmount, content, referenceCode, transactionDate, description }
            })
            .eq('order_id', orderCode)

        // Tạo/cập nhật subscription
        const expiresAt = new Date()
        if (payment.plan_type === 'monthly') {
            expiresAt.setMonth(expiresAt.getMonth() + 1)
        } else {
            expiresAt.setFullYear(expiresAt.getFullYear() + 1)
        }

        await getSupabase()
            .from('subscriptions')
            .upsert({
                user_id: payment.user_id,
                plan_type: payment.plan_type,
                status: 'active',
                expires_at: expiresAt.toISOString()
            }, { onConflict: 'user_id' })

        console.log('SePay webhook: Payment completed successfully', { orderCode, amount: transferAmount })

        return NextResponse.json({ success: true }, { status: 200 })
    } catch (error) {
        console.error('SePay webhook error:', error)
        return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
    }
}
