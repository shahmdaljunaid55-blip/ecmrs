-- ===========================================
-- NOTIFICATIONS TROUBLESHOOTING SCRIPT
-- ===========================================
-- Run this to check if notifications are set up correctly

-- 1. Check if users table exists
SELECT 'users table' as check_name, COUNT(*) as count FROM users;

-- 2. Check if notifications table exists
SELECT 'notifications table' as check_name, COUNT(*) as count FROM notifications;

-- 3. Check if orders table exists  
SELECT 'orders table' as check_name, COUNT(*) as count FROM orders;

-- 4. Check if there are any users in the users table
SELECT * FROM users LIMIT 5;

-- 5. Check if there are any notifications
SELECT * FROM notifications LIMIT 5;

-- ===========================================
-- IF THE ABOVE QUERIES FAIL:
-- ===========================================
-- You need to run supabase-setup.sql first!

-- ===========================================
-- MANUAL FIX: Create tables one by one
-- ===========================================

-- Step 1: Create users table (REQUIRED for notifications)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  image_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_sign_in_at TIMESTAMPTZ
);

ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Step 2: Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL,
  old_status TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;

-- Step 3: Insert your user record (IMPORTANT!)
-- Replace with YOUR actual Clerk user ID and email
-- Find user ID from: user.id in your app console
INSERT INTO users (id, email, full_name) 
VALUES ('YOUR_CLERK_USER_ID', 'your-email@example.com', 'Your Name')
ON CONFLICT (id) DO NOTHING;

-- ===========================================
-- AFTER RUNNING THIS:
-- ===========================================
-- 1. Go to Database → Replication in Supabase
-- 2. Enable real-time for:
--    - orders
--    - notifications
-- 3. Refresh your app
