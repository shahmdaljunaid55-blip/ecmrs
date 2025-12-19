-- ===========================================
-- DROP EXISTING TABLES (Run this FIRST)
-- ===========================================
-- This safely removes all existing tables
-- Run this in Supabase SQL Editor BEFORE running supabase-setup.sql

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS wishlist_items CASCADE;
DROP TABLE IF EXISTS user_addresses CASCADE;
DROP TABLE IF EXISTS product_reviews CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- Verify all tables are dropped
-- You should see an empty list or only system tables
