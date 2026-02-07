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

function getBankConfig() {
    return {
        accountNumber: process.env.BANK_ACCOUNT_NUMBER || '',
        accountName: process.env.BANK_ACCOUNT_NAME || '',
        bankName: process.env.BANK_NAME || '',
        bankBin: process.env.BANK_BIN || '',
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { userId, amount, planType } = body

        if (!userId || !amount || !planType) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const config = getBankConfig()

        if (!config.accountNumber || !config.bankBin) {
            return NextResponse.json({
                error: 'Thanh toán chưa được cấu hình. Vui lòng liên hệ admin.',
                demo: true
            }, { status: 503 })
        }

        // Tạo mã đơn hàng duy nhất
        const timestamp = Date.now().toString().slice(-8)
        const userPart = userId.replace(/-/g, '').slice(0, 4).toUpperCase()
        const orderId = `X10${timestamp}${userPart}`

        // Lưu đơn hàng vào DB (chỉ khi user đã đăng nhập với UUID hợp lệ)
        const isRealUser = !userId.startsWith('anon_')
        if (isRealUser) {
            try {
                await getSupabase().from('payments').insert({
                    user_id: userId,
                    order_id: orderId,
                    amount,
                    payment_method: 'bank_transfer',
                    plan_type: planType,
                    status: 'pending'
                })
            } catch (dbError) {
                console.error('DB insert error (continuing):', dbError)
            }
        }

        // Tạo VietQR URL (chuẩn QR chuyển khoản liên ngân hàng)
        // Format: https://img.vietqr.io/image/{BANK_BIN}-{ACCOUNT_NUMBER}-compact2.png?amount={AMOUNT}&addInfo={CONTENT}&accountName={NAME}
        const transferContent = orderId
        const qrUrl = `https://img.vietqr.io/image/${config.bankBin}-${config.accountNumber}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(config.accountName)}`

        return NextResponse.json({
            orderId,
            bankInfo: {
                accountNumber: config.accountNumber,
                accountName: config.accountName,
                bankName: config.bankName,
                transferContent: orderId,
                amount
            },
            qrUrl
        })
    } catch (error) {
        console.error('Bank transfer create error:', error)
        return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 })
    }
}
