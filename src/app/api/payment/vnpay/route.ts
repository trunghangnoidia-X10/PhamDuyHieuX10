import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy initialization to avoid build-time errors
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

function getVNPayConfig() {
    return {
        tmnCode: process.env.VNPAY_TMN_CODE || '',
        hashSecret: process.env.VNPAY_HASH_SECRET || '',
        url: process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
        returnUrl: (process.env.NEXT_PUBLIC_APP_URL || '') + '/api/payment/vnpay/callback'
    }
}

function sortObject(obj: Record<string, string>) {
    const sorted: Record<string, string> = {}
    const keys = Object.keys(obj).sort()
    for (const key of keys) {
        sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, '+')
    }
    return sorted
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { userId, amount, planType, orderInfo } = body

        if (!userId || !amount || !planType) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const config = getVNPayConfig()

        if (!config.tmnCode || !config.hashSecret) {
            return NextResponse.json({
                error: 'VNPay chưa được cấu hình. Vui lòng liên hệ admin.',
                demo: true
            }, { status: 503 })
        }

        const orderId = `X10_${Date.now()}_${userId.slice(0, 8)}`

        await getSupabase().from('payments').insert({
            user_id: userId,
            order_id: orderId,
            amount,
            payment_method: 'vnpay',
            plan_type: planType,
            status: 'pending'
        })

        const createDate = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14)

        let vnpParams: Record<string, string> = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: config.tmnCode,
            vnp_Locale: 'vn',
            vnp_CurrCode: 'VND',
            vnp_TxnRef: orderId,
            vnp_OrderInfo: orderInfo || `Thanh toan goi ${planType} X10`,
            vnp_OrderType: 'other',
            vnp_Amount: (amount * 100).toString(),
            vnp_ReturnUrl: config.returnUrl,
            vnp_IpAddr: '127.0.0.1',
            vnp_CreateDate: createDate
        }

        vnpParams = sortObject(vnpParams)
        const signData = new URLSearchParams(vnpParams).toString()
        const hmac = crypto.createHmac('sha512', config.hashSecret)
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

        vnpParams['vnp_SecureHash'] = signed
        const paymentUrl = config.url + '?' + new URLSearchParams(vnpParams).toString()

        return NextResponse.json({ paymentUrl, orderId })
    } catch (error) {
        console.error('VNPay create error:', error)
        return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 })
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const vnpParams: Record<string, string> = {}

        searchParams.forEach((value, key) => {
            vnpParams[key] = value
        })

        const secureHash = vnpParams['vnp_SecureHash']
        delete vnpParams['vnp_SecureHash']
        delete vnpParams['vnp_SecureHashType']

        const config = getVNPayConfig()
        const sortedParams = sortObject(vnpParams)
        const signData = new URLSearchParams(sortedParams).toString()
        const hmac = crypto.createHmac('sha512', config.hashSecret)
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')

        const orderId = vnpParams['vnp_TxnRef']
        const responseCode = vnpParams['vnp_ResponseCode']

        if (secureHash === signed) {
            if (responseCode === '00') {
                const { data: payment } = await getSupabase()
                    .from('payments')
                    .select('*')
                    .eq('order_id', orderId)
                    .single()

                if (payment) {
                    await getSupabase()
                        .from('payments')
                        .update({
                            status: 'completed',
                            transaction_id: vnpParams['vnp_TransactionNo'],
                            completed_at: new Date().toISOString(),
                            metadata: vnpParams
                        })
                        .eq('order_id', orderId)

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
                }

                return NextResponse.redirect(new URL('/payment/success', request.url))
            } else {
                await getSupabase()
                    .from('payments')
                    .update({ status: 'failed', metadata: vnpParams })
                    .eq('order_id', orderId)

                return NextResponse.redirect(new URL('/payment/failed', request.url))
            }
        } else {
            return NextResponse.redirect(new URL('/payment/failed?error=invalid', request.url))
        }
    } catch (error) {
        console.error('VNPay callback error:', error)
        return NextResponse.redirect(new URL('/payment/failed?error=system', request.url))
    }
}
