import { NextResponse } from 'next/server'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

function getSupabase() {
    if (!supabaseInstance) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error('Missing Supabase configuration')
        }

        supabaseInstance = createClient(supabaseUrl, supabaseServiceKey)
    }
    return supabaseInstance
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 })
        }

        const { data: memories, error } = await getSupabase()
            .from('memories')
            .select('*')
            .eq('user_id', userId)
            .order('importance', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(20)

        if (error) {
            console.error('Error fetching memories:', error)
            return NextResponse.json({ error: 'Failed to fetch memories' }, { status: 500 })
        }

        return NextResponse.json({ memories })
    } catch (error) {
        console.error('Memory GET error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { userId, content, category, importance } = body

        if (!userId || !content) {
            return NextResponse.json({ error: 'User ID and content required' }, { status: 400 })
        }

        // Check if similar memory exists
        const { data: existing } = await getSupabase()
            .from('memories')
            .select('id')
            .eq('user_id', userId)
            .ilike('content', `%${content.substring(0, 50)}%`)
            .limit(1)

        if (existing && existing.length > 0) {
            // Update existing memory
            const { error } = await getSupabase()
                .from('memories')
                .update({
                    content,
                    importance: importance || 5,
                    updated_at: new Date().toISOString()
                })
                .eq('id', existing[0].id)

            if (error) throw error
            return NextResponse.json({ success: true, updated: true })
        }

        // Insert new memory
        const { error } = await getSupabase()
            .from('memories')
            .insert({
                user_id: userId,
                content,
                category: category || 'general',
                importance: importance || 5
            })

        if (error) throw error
        return NextResponse.json({ success: true, created: true })
    } catch (error) {
        console.error('Memory POST error:', error)
        return NextResponse.json({ error: 'Failed to save memory' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const memoryId = searchParams.get('id')
        const userId = searchParams.get('userId')

        if (!memoryId || !userId) {
            return NextResponse.json({ error: 'Memory ID and User ID required' }, { status: 400 })
        }

        const { error } = await getSupabase()
            .from('memories')
            .delete()
            .eq('id', memoryId)
            .eq('user_id', userId)

        if (error) throw error
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Memory DELETE error:', error)
        return NextResponse.json({ error: 'Failed to delete memory' }, { status: 500 })
    }
}
