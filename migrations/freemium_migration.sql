-- Freemium Rate Limiting: Message Usage Tracking
-- Run this in Supabase SQL Editor

-- Create message_usage table for daily message counting
CREATE TABLE IF NOT EXISTS message_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
    message_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, usage_date)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_message_usage_user_date ON message_usage(user_id, usage_date);

-- Enable RLS
ALTER TABLE message_usage ENABLE ROW LEVEL SECURITY;

-- Policies
DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can view own usage" ON message_usage;
    DROP POLICY IF EXISTS "Service can manage usage" ON message_usage;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Users can view own usage" ON message_usage
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service can manage usage" ON message_usage
    FOR ALL USING (true) WITH CHECK (true);

-- Function to increment message count (upsert)
CREATE OR REPLACE FUNCTION increment_message_usage(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    INSERT INTO message_usage (user_id, usage_date, message_count)
    VALUES (p_user_id, CURRENT_DATE, 1)
    ON CONFLICT (user_id, usage_date)
    DO UPDATE SET 
        message_count = message_usage.message_count + 1,
        updated_at = NOW()
    RETURNING message_count INTO v_count;
    
    RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
