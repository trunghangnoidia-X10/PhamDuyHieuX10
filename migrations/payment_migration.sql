-- Payment & Subscription Tables for SePay Integration
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/sexdncinaiyblrdbfncu/sql

-- Create payments table (skip if already exists)
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    order_id VARCHAR(100) UNIQUE NOT NULL,
    amount INTEGER NOT NULL,
    currency VARCHAR(10) DEFAULT 'VND',
    payment_method VARCHAR(20) NOT NULL, -- 'bank_transfer'
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'underpaid'
    plan_type VARCHAR(20) NOT NULL, -- 'monthly', 'yearly'
    transaction_id VARCHAR(100),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_type VARCHAR(20) NOT NULL, -- 'monthly', 'yearly'
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'expired', 'cancelled'
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Payments policies
-- Drop existing policies first (safe even if they don't exist)
DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can view own payments" ON payments;
    DROP POLICY IF EXISTS "Service can insert payments" ON payments;
    DROP POLICY IF EXISTS "Service can update payments" ON payments;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Users can view own payments" ON payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service can manage payments" ON payments
    FOR ALL USING (true) WITH CHECK (true);

-- Subscriptions policies
DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
    DROP POLICY IF EXISTS "Service can manage subscriptions" ON subscriptions;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Users can view own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service can manage subscriptions" ON subscriptions
    FOR ALL USING (true) WITH CHECK (true);
