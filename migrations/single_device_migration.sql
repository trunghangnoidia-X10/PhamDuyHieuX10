-- ================================================
-- SQL Migration: Single Device with Real-time Kick
-- Run this in Supabase SQL Editor BEFORE deploying
-- ================================================

-- 1. Add session_token column for tracking active sessions
ALTER TABLE devices ADD COLUMN IF NOT EXISTS session_token UUID DEFAULT gen_random_uuid();

-- 2. Add is_active flag for real-time kick
ALTER TABLE devices ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 3. Create index for faster session lookups
CREATE INDEX IF NOT EXISTS idx_devices_session_token ON devices(session_token);
CREATE INDEX IF NOT EXISTS idx_devices_is_active ON devices(is_active);

-- 4. Enable Realtime for devices table (for real-time kick)
ALTER PUBLICATION supabase_realtime ADD TABLE devices;

-- ================================================
-- DONE! Now deploy the new code
-- ================================================
