# Notification Troubleshooting Guide

## Issue: Notifications not appearing when admin changes order status

### Root Cause
The orders subscription was filtering by `customer_name` instead of `user_id`, which is unreliable.

### Solution Applied
Changed filter from:
```javascript
filter: `customer_name=eq.${user.fullName}`
```

To:
```javascript
filter: `user_id=eq.${user.id}`
```

## Setup Checklist

### 1. Verify Tables Exist
Run in Supabase SQL Editor:
```sql
SELECT * FROM users LIMIT 1;
SELECT * FROM orders LIMIT 1;
SELECT * FROM notifications LIMIT 1;
```

### 2. Enable Real-time Replication
In Supabase Dashboard → Database → Replication:
- [x] Enable for `orders` table
- [x] Enable for `notifications` table

### 3. Verify Your User Exists
```sql
-- Check if your user record exists
SELECT * FROM users WHERE id = 'YOUR_CLERK_USER_ID';

-- If not, create it:
INSERT INTO users (id, email, full_name) 
VALUES ('YOUR_CLERK_USER_ID', 'your@email.com', 'Your Name')
ON CONFLICT (id) DO NOTHING;
```

### 4. Verify Orders Have user_id
```sql
-- Check if orders have user_id
SELECT id, order_number, customer_name, user_id, status 
FROM orders 
LIMIT 5;

-- If user_id is NULL, update your orders:
UPDATE orders 
SET user_id = 'YOUR_CLERK_USER_ID' 
WHERE customer_name = 'Your Name';
```

### 5. Test the Flow

**Step 1:** Place an order as a customer
**Step 2:** Go to admin panel (`/admin`)
**Step 3:** Change order status from "pending" to "processing"
**Step 4:** Check browser console for logs:
- Should see: "Order status changed:"
- Should see: "Notification created successfully:"
**Step 5:** Go to `/notifications`
- Should see new notification appear

## Debugging

### Check Browser Console
Look for these logs:
```
Order status changed: {payload}
Status changed from pending to processing
Notification created successfully: {data}
```

### Common Errors

**Error: "relation 'notifications' does not exist"**
- Solution: Run `supabase-setup.sql`

**Error: "insert or update on table 'notifications' violates foreign key constraint"**
- Solution: Your user doesn't exist in `users` table. Run step 3 above.

**Error: No log messages appear**
- Solution: Real-time not enabled. Go to Dashboard → Replication

### Verify Real-time is Working
Open browser console and run:
```javascript
console.log('User ID:', user.id);
// Should match the user_id in your orders
```

## After Fix

Restart your dev server:
```bash
npm run dev
```

Then test the full flow again.
