# Order Management Troubleshooting

## Issue: Orders Not Working

### Most Common Causes:

#### 1. **Tables Not Created in Supabase** (Most Likely)
**Solution:** Run the SQL script in Supabase
1. Open your Supabase Dashboard
2. Go to **SQL Editor**
3. Copy the entire contents of `supabase-setup.sql`
4. Paste and click **Run**
5. Check **Table Editor** - you should see: products, orders, order_items, users

#### 2. **No Sample Data in Database**
After creating tables, the SQL script should insert sample orders automatically.

**Verify:**
1. Go to Supabase → Table Editor → orders
2. Should see 3 sample orders
3. If empty, run just the INSERT statements from the SQL file

#### 3. **CORS/RLS Issues**
Check browser console for errors:
- CORS errors → See SUPABASE_CORS_FIX.md
- RLS errors → Run: `ALTER TABLE orders DISABLE ROW LEVEL SECURITY;`

#### 4. **Wrong Supabase Credentials**
Verify your `.env` file has correct:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
```

**After editing `.env`:** Must restart dev server!

## Quick Test Checklist:

- [ ] Ran full `supabase-setup.sql` in Supabase SQL Editor
- [ ] Verified tables exist in Supabase Table Editor
- [ ] Checked that RLS is **disabled** on all tables
- [ ] Verified `.env` has correct Supabase credentials
- [ ] Restarted dev server after `.env` changes
- [ ] Checked browser console for errors
- [ ] Verified sample data exists in Supabase tables

## Verification Steps:

### In Supabase:
1. Table Editor → orders → Should see 3 rows
2. Table Editor → order_items → Should see 4 rows  
3. Table Editor → products → Should see 8 rows
4. Table Editor → users → May be empty (fills when users sign in)

### In Admin Panel:
1. Login → Dashboard → Should see stats
2. Products → Should see 8 products
3. Orders → Should see 3 orders
4. Try changing an order status → Should persist

## Still Not Working?

Check browser console (F12) and tell me:
1. What error messages you see
2. Whether tables exist in Supabase
3. Whether data is in the tables
4. What exactly isn't working (loading, updating, etc.)
