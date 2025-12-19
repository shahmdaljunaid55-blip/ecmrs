-- ===========================================
-- NAFIS | MASHNUBA E-COMMERCE DATABASE SCHEMA
-- ===========================================

-- ===========================================
-- 1. PRODUCTS TABLE
-- ===========================================
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT NOT NULL,
  description TEXT DEFAULT 'Beautiful handcrafted jewelry piece.',
  stock_quantity INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT TRUE,
  average_rating DECIMAL(3, 2) DEFAULT 0.00,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- 2. USERS TABLE (Clerk Integration)
-- ===========================================
CREATE TABLE users (
  id TEXT PRIMARY KEY,  -- Clerk user ID
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  image_url TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_sign_in_at TIMESTAMPTZ
);

-- ===========================================
-- 3. USER ADDRESSES TABLE
-- ===========================================
CREATE TABLE user_addresses (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  country TEXT DEFAULT 'Bangladesh',
  phone TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- 4. CART ITEMS TABLE
-- ===========================================
CREATE TABLE cart_items (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  product_image TEXT NOT NULL,
  product_price DECIMAL(10, 2) NOT NULL,
  product_category TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ===========================================
-- 5. WISHLIST ITEMS TABLE
-- ===========================================
CREATE TABLE wishlist_items (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  product_image TEXT NOT NULL,
  product_price DECIMAL(10, 2) NOT NULL,
  product_category TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ===========================================
-- 6. ORDERS TABLE
-- ===========================================
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id TEXT REFERENCES users(id),
  customer_name TEXT NOT NULL,
  date DATE NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_method TEXT,
  shipping_address JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- 7. ORDER ITEMS TABLE
-- ===========================================
CREATE TABLE order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
  product_id BIGINT REFERENCES products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===========================================
-- 8. NOTIFICATIONS TABLE
-- ===========================================
CREATE TABLE notifications (
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

-- ===========================================
-- 9. PRODUCT REVIEWS TABLE
-- ===========================================
CREATE TABLE product_reviews (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT REFERENCES products(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  review_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

-- ===========================================
-- INDEXES FOR PERFORMANCE
-- ===========================================
CREATE INDEX idx_cart_user_id ON cart_items(user_id);
CREATE INDEX idx_wishlist_user_id ON wishlist_items(user_id);
CREATE INDEX idx_user_addresses_user_id ON user_addresses(user_id);
CREATE INDEX idx_user_addresses_default ON user_addresses(user_id, is_default);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_active ON products(is_active);

-- ===========================================
-- DISABLE RLS (Enable with policies in production)
-- ===========================================
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses DISABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews DISABLE ROW LEVEL SECURITY;

-- ===========================================
-- SAMPLE DATA
-- ===========================================

-- Insert products
INSERT INTO products (name, category, price, image, description, stock_quantity) VALUES
('Eternal Gold Ring', 'Rings', 35000, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Elegant 18k gold ring with timeless design', 25),
('Diamond Halo Ring', 'Rings', 105000, 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Stunning diamond halo ring with premium cut stones', 10),
('Sapphire Pendant', 'Pendants', 52000, 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Royal blue sapphire pendant in white gold setting', 15),
('Gold Chain Bracelet', 'Bracelets', 24000, 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Delicate gold chain bracelet, perfect for everyday wear', 30),
('Pearl Necklace', 'Jewelry', 40000, 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Classic pearl necklace with lustrous freshwater pearls', 20),
('Rose Gold Band', 'Rings', 28000, 'https://images.unsplash.com/photo-1589674781759-c21c37956a44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Modern rose gold band with brushed finish', 40),
('Crystal Drop Earrings', 'Jewelry', 14000, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Sparkling crystal drop earrings for special occasions', 35),
('Silver Charm Bracelet', 'Bracelets', 18000, 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 'Sterling silver bracelet with customizable charms', 45);

-- Insert sample orders (for demo)
INSERT INTO orders (order_number, date, customer_name, total, status, payment_method) VALUES
('ORD-2025-001', '2025-12-18', 'John Doe', 35000, 'pending', 'Cash on Delivery'),
('ORD-2025-002', '2025-12-17', 'Jane Smith', 145000, 'processing', 'SSLCommerz'),
('ORD-2025-003', '2025-12-16', 'Bob Johnson', 104000, 'shipped', 'Cash on Delivery');

-- Insert order items
INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES
(1, 1, 'Eternal Gold Ring', 1, 35000),
(2, 2, 'Diamond Halo Ring', 1, 105000),
(2, 5, 'Pearl Necklace', 1, 40000),
(3, 3, 'Sapphire Pendant', 2, 52000);


