# CORS Error Fix for Supabase

## The Problem
You're getting CORS errors because Supabase is blocking requests from localhost:5173. This is shown in the console:
```
Access to fetch at 'https://...supabase.co/rest/v1/products' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

## Quick Fix Options

### Option 1: Check Supabase URL Configuration (Most Likely)
1. Go to your Supabase Dashboard
2. Click on **Project Settings** (gear icon)
3. Go to **API** section
4. Verify your **Project URL** and **anon/public key**
5. Make sure they match your .env file exactly

### Option 2: Add localhost to Supabase CORS Settings
1. Go to Supabase Dashboard
2. Click **Project Settings** → **API**
3. Scroll to **CORS Settings** or **Allowed Origins**
4. Add: `http://localhost:5173`
5. Click Save

### Option 3: Check RLS Policies
Even though we disabled RLS, let's verify:

1. Go to Supabase Dashboard
2. Click **Authentication** → **Policies**
3. Find your tables (products, orders, order_items)
4. Make sure RLS is **OFF** or policies allow read access

Run this SQL to confirm RLS is disabled:
```sql
-- Check RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('products', 'orders', 'order_items');

-- If rowsecurity is true, disable it:
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
```

### Option 4: Verify Environment Variables
Make sure your `.env` file has valid credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important:** After changing `.env`, you MUST restart the dev server:
1. Stop the current server (Ctrl+C)
2. Run `npm run dev` again

## Testing After Fix
1. Open browser console (F12)
2. Navigate to `/admin/login`
3. Login and go to dashboard
4. Check console - errors should be gone
5. You should see products loading

## Still Not Working?
If you still get errors, share:
1. Your Supabase project URL (from dashboard)
2. Whether RLS is enabled or disabled
3. Any new error messages in console
