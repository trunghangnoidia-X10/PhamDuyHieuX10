import { NextResponse } from 'next/server'
import crypto from 'crypto'
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

function getMoMoConfig() {
    return {
        partnerCode: process.env.MOMO_PARTNER_CODE || '',
        accessKey: process.env.MOMO_ACCESS_KEY || '',
        secretKey: process.env.MOMO_SECRET_KEY || '',
        endpoint: process.env.MOMO_ENDPOINT || 'https://test-payment.momo.vn/v2/gateway/api/create',
        returnUrl: (process.env.NEXT_PUBLIC_APP_URL || '') + '/payment/success',
        notifyUrl: (process.env.NEXT_PUBLIC_APP_URL || '') + '/api/payment/momo/callback'
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { userId, amount, planType, orderInfo } = body

        if (!userId || !amount || !planType) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const config = getMoMoConfig()

        if (!config.partnerCode || !config.accessKey || !config.secretKey) {
            return NextResponse.json({
                error: 'MoMo chưa được cấu hình. Vui lòng liên hệ admin.',
                demo: true
            }, { status: 503 })
        }

        const orderId = `X10_${Date.now()}_${userId.slice(0, 8)}`
        const requestId = orderId

        await getSupabase().from('payments').insert({
            user_id: userId,
            order_id: orderId,
            amount,
            payment_method: 'momo',
            plan_type: planType,
            status: 'pending'
        })

        const rawSignature = `accessKey=${config.accessKey}&amount=${amount}&extraData=&ipnUrl=${config.notifyUrl}&orderId=${orderId}&orderInfo=${orderInfo || `Thanh toan goi ${planType} X10`}&partnerCode=${config.partnerCode}&redirectUrl=${config.returnUrl}&requestId=${requestId}&requestType=payWithMethod`

        const signature = crypto
            .createHmac('sha256', config.secretKey)
            .update(rawSignature)
            .digest('hex')

        const requestBody = {
            partnerCode: config.partnerCode,
            partnerName: 'X10',
            storeId: 'X10Store',
            requestId,
            amount,
            orderId,
            orderInfo: orderInfo || `Thanh toan goi ${planType} X10`,
            redirectUrl: config.returnUrl,
            ipnUrl: config.notifyUrl,
            lang: 'vi',
            requestType: 'payWithMethod',
            autoCapture: true,
            extraData: '',
            signature
        }

        const response = await fetch(config.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        })

        const data = await response.json()

        if (data.resultCode === 0) {
            return NextResponse.json({ paymentUrl: data.payUrl, orderId })
        } else {
            console.error('MoMo error:', data)
            return NextResponse.json({ error: data.message }, { status: 400 })
        }
    } catch (error) {
        console.error('MoMo create error:', error)
        return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const {
            partnerCode, orderId, requestId, amount, orderInfo, orderType,
            transId, resultCode, message, payType, responseTime, extraData, signature
        } = body

        const config = getMoMoConfig()
        const rawSignature = `accessKey=${config.accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`

        const expectedSignature = crypto
            .createHmac('sha256', config.secretKey)
            .update(rawSignature)
            .digest('hex')

        if (signature !== expectedSignature) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
        }

        if (resultCode === 0) {
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
                        transaction_id: transId.toString(),
                        completed_at: new Date().toISOString(),
                        metadata: body
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

            return NextResponse.json({ success: true })
        } else {
            await getSupabase()
                .from('payments')
                .update({ status: 'failed', metadata: body })
                .eq('order_id', orderId)

            return NextResponse.json({ success: false })
        }
    } catch (error) {
        console.error('MoMo callback error:', error)
        return NextResponse.json({ error: 'Internal error' }, { status: 500 })
    }
}
