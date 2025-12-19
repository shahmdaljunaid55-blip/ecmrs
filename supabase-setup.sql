-- Create products table
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  date DATE NOT NULL,
  customer_name TEXT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'shipped', 'delivered')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS for admin operations (enable and add policies in production)
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;

-- Insert initial products data
INSERT INTO products (name, category, price, image) VALUES
('Eternal Gold Ring', 'Rings', 35000, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
('Diamond Halo Ring', 'Rings', 105000, 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
('Sapphire Pendant', 'Pendants', 52000, 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
('Gold Chain Bracelet', 'Bracelets', 24000, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
('Pearl Necklace', 'Jewelry', 40000, 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
('Rose Gold Band', 'Rings', 28000, 'https://images.unsplash.com/photo-1589674781759-c21c37956a44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
('Crystal Drop Earrings', 'Jewelry', 14000, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'),
('Silver Charm Bracelet', 'Bracelets', 18000, 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80');

-- Insert sample orders
INSERT INTO orders (order_number, date, customer_name, total, status) VALUES
('ORD-2025-001', '2025-12-18', 'John Doe', 35000, 'pending'),
('ORD-2025-002', '2025-12-17', 'Jane Smith', 145000, 'processing'),
('ORD-2025-003', '2025-12-16', 'Bob Johnson', 104000, 'shipped');

-- Insert order items
INSERT INTO order_items (order_id, product_name, quantity, price) VALUES
(1, 'Eternal Gold Ring', 1, 35000),
(2, 'Diamond Halo Ring', 1, 105000),
(2, 'Pearl Necklace', 1, 40000),
(3, 'Sapphire Pendant', 2, 52000);

-- Create users table for Clerk user sync
CREATE TABLE users (
  id TEXT PRIMARY KEY,  -- Clerk user ID
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_sign_in_at TIMESTAMPTZ
);

-- Disable RLS for admin access
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Create notifications table
CREATE TABLE notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL,
  type TEXT NOT NULL,  -- e.g., 'status_change'
  message TEXT NOT NULL,
  status TEXT NOT NULL,  -- Order status (pending, processing, shipped, delivered)
  old_status TEXT,  -- Previous status before change
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Disable RLS for notifications
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;

