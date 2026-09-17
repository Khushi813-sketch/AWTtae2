/*
# Grocery Shopping System - Database Schema

## Overview
Creates a complete schema for an Indian online grocery shopping platform with categories, products, and orders.

## 1. New Tables

### categories
- `id` (uuid, primary key)
- `name` (text, not null) - e.g. "Fruits & Vegetables", "Dairy & Bakery"
- `slug` (text, unique, not null) - URL-friendly identifier
- `icon` (text) - Lucide icon name for display
- `sort_order` (int, default 0) - display ordering

### products
- `id` (uuid, primary key)
- `category_id` (uuid, FK to categories)
- `name` (text, not null) - product name
- `brand` (text) - brand name
- `description` (text) - product description
- `price` (numeric, not null) - price in INR
- `mrp` (numeric) - maximum retail price
- `unit` (text) - e.g. "500 g", "1 L", "2 pcs"
- `image_url` (text) - product image URL
- `stock` (int, default 0) - available quantity
- `tags` (text[]) - e.g. ["organic", "bestseller"]
- `is_available` (boolean, default true)
- `created_at` (timestamp)

### orders
- `id` (uuid, primary key)
- `customer_name` (text, not null)
- `customer_phone` (text, not null)
- `customer_email` (text)
- `delivery_address` (text, not null)
- `city` (text, not null)
- `pincode` (text, not null)
- `items` (jsonb, not null) - array of {product_id, name, price, quantity, unit}
- `subtotal` (numeric, not null)
- `delivery_fee` (numeric, not null)
- `total` (numeric, not null)
- `payment_method` (text, default 'cod')
- `status` (text, default 'placed') - placed, confirmed, delivered, cancelled
- `created_at` (timestamp)

## 2. Security
- RLS enabled on all tables.
- Categories and products: public read (anon + authenticated), no writes from frontend.
- Orders: public insert (anon + authenticated) so guest checkout works, public read for order tracking.

## 3. Notes
- All prices in INR (Indian Rupees).
- Products seeded with Indian grocery items across categories.
- Orders support guest checkout (no auth required).
*/

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text,
  sort_order int DEFAULT 0
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_categories" ON categories;
CREATE POLICY "anon_select_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  brand text,
  description text,
  price numeric(10,2) NOT NULL,
  mrp numeric(10,2),
  unit text NOT NULL,
  image_url text,
  stock int DEFAULT 0,
  tags text[] DEFAULT '{}',
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_products" ON products;
CREATE POLICY "anon_select_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  delivery_address text NOT NULL,
  city text NOT NULL,
  pincode text NOT NULL,
  items jsonb NOT NULL,
  subtotal numeric(10,2) NOT NULL,
  delivery_fee numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL,
  payment_method text DEFAULT 'cod',
  status text DEFAULT 'placed',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_orders" ON orders;
CREATE POLICY "anon_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_orders" ON orders;
CREATE POLICY "anon_select_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(is_available);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);

-- Seed categories
INSERT INTO categories (name, slug, icon, sort_order) VALUES
  ('Fruits & Vegetables', 'fruits-vegetables', 'Apple', 1),
  ('Dairy & Bakery', 'dairy-bakery', 'Milk', 2),
  ('Staples & Pantry', 'staples-pantry', 'Wheat', 3),
  ('Snacks & Beverages', 'snacks-beverages', 'Cookie', 4),
  ('Personal Care', 'personal-care', 'Sparkles', 5),
  ('Home & Kitchen', 'home-kitchen', 'Home', 6),
  ('Masalas & Sauces', 'masalas-sauces', 'Flame', 7),
  ('Tea & Coffee', 'tea-coffee', 'Coffee', 8)
ON CONFLICT (slug) DO NOTHING;

-- Seed products (Indian grocery items)
INSERT INTO products (category_id, name, brand, description, price, mrp, unit, image_url, stock, tags, is_available) VALUES
-- Fruits & Vegetables
((SELECT id FROM categories WHERE slug='fruits-vegetables'), 'Banana Robusta', 'Fresh Farm', 'Fresh ripe robusta bananas, rich in potassium and energy.', 49, 60, '1 dozen', 'https://images.pexels.com/photos/287276/pexels-photo-287276.jpeg?auto=compress&cs=tinysrgb&w=400', 100, ARRAY['fresh', 'bestseller'], true),
((SELECT id FROM categories WHERE slug='fruits-vegetables'), 'Tomato Hybrid', 'Local Garden', 'Juicy red tomatoes, perfect for curries and salads.', 30, 40, '500 g', 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=400', 80, ARRAY['fresh'], true),
((SELECT id FROM categories WHERE slug='fruits-vegetables'), 'Onion', 'Farm Direct', 'Fresh onions, essential for Indian cooking.', 35, 50, '1 kg', 'https://images.pexels.com/photos/1306559/pexels-photo-1306559.jpeg?auto=compress&cs=tinysrgb&w=400', 120, ARRAY['fresh', 'essential'], true),
((SELECT id FROM categories WHERE slug='fruits-vegetables'), 'Potato', 'Farm Direct', 'Versatile potatoes for all your cooking needs.', 28, 35, '1 kg', 'https://images.pexels.com/photos/2286776/pexels-photo-2286776.jpeg?auto=compress&cs=tinysrgb&w=400', 150, ARRAY['fresh', 'essential'], true),
((SELECT id FROM categories WHERE slug='fruits-vegetables'), 'Apple Shimla', 'Himachal Fresh', 'Crisp red apples from Shimla, sweet and crunchy.', 120, 160, '500 g', 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg?auto=compress&cs=tinysrgb&w=400', 60, ARRAY['fresh', 'premium'], true),
((SELECT id FROM categories WHERE slug='fruits-vegetables'), 'Spinach (Palak)', 'Organic Farm', 'Fresh green spinach leaves, washed and cleaned.', 20, 30, '250 g', 'https://images.pexels.com/photos/2255925/pexels-photo-2255925.jpeg?auto=compress&cs=tinysrgb&w=400', 40, ARRAY['fresh', 'organic'], true),
((SELECT id FROM categories WHERE slug='fruits-vegetables'), 'Green Capsicum', 'Fresh Farm', 'Crisp green bell peppers, great for stir-fries.', 45, 60, '250 g', 'https://images.pexels.com/photos/1213390/pexels-photo-1213390.jpeg?auto=compress&cs=tinysrgb&w=400', 50, ARRAY['fresh'], true),
((SELECT id FROM categories WHERE slug='fruits-vegetables'), 'Pomegranate', 'Fresh Farm', 'Sweet and juicy pomegranates, rich in antioxidants.', 99, 130, '500 g', 'https://images.pexels.com/photos/8108086/pexels-photo-8108086.jpeg?auto=compress&cs=tinysrgb&w=400', 35, ARRAY['fresh', 'premium'], true),

-- Dairy & Bakery
((SELECT id FROM categories WHERE slug='dairy-bakery'), 'Amul Gold Milk', 'Amul', 'Full cream milk, pasteurised and homogenised.', 28, 30, '500 ml', 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=400', 200, ARRAY['essential', 'bestseller'], true),
((SELECT id FROM categories WHERE slug='dairy-bakery'), 'Amul Butter', 'Amul', 'Pasteurised salted butter, India''s favourite.', 56, 58, '100 g', 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=400', 150, ARRAY['essential'], true),
((SELECT id FROM categories WHERE slug='dairy-bakery'), 'Brown Bread', 'Britannia', 'Soft and fresh brown bread, perfect for sandwiches.', 40, 45, '400 g', 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=400', 100, ARRAY['fresh'], true),
((SELECT id FROM categories WHERE slug='dairy-bakery'), 'Paneer', 'Amul', 'Fresh cottage cheese, soft and creamy.', 85, 90, '200 g', 'https://images.pexels.com/photos/3738873/pexels-photo-3738873.jpeg?auto=compress&cs=tinysrgb&w=400', 80, ARRAY['fresh', 'bestseller'], true),
((SELECT id FROM categories WHERE slug='dairy-bakery'), 'Curd (Dahi)', 'Mother Dairy', 'Fresh set curd, thick and creamy.', 25, 30, '400 g', 'https://images.pexels.com/photos/3738873/pexels-photo-3738873.jpeg?auto=compress&cs=tinysrgb&w=400', 120, ARRAY['fresh', 'essential'], true),
((SELECT id FROM categories WHERE slug='dairy-bakery'), 'Eggs', 'Suguna', 'Farm fresh white eggs, rich in protein.', 72, 84, '6 pcs', 'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=400', 100, ARRAY['essential', 'bestseller'], true),

-- Staples & Pantry
((SELECT id FROM categories WHERE slug='staples-pantry'), 'Aashirvaad Atta', 'Aashirvaad', 'Whole wheat flour, made from finest grains for soft rotis.', 245, 280, '5 kg', 'https://images.pexels.com/photos/3196434/pexels-photo-3196434.jpeg?auto=compress&cs=tinysrgb&w=400', 100, ARRAY['essential', 'bestseller'], true),
((SELECT id FROM categories WHERE slug='staples-pantry'), 'Basmati Rice', 'India Gate', 'Premium long grain basmati rice, aged for perfect flavour.', 599, 750, '5 kg', 'https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg?auto=compress&cs=tinysrgb&w=400', 80, ARRAY['premium', 'bestseller'], true),
((SELECT id FROM categories WHERE slug='staples-pantry'), 'Toor Dal', 'Tata Sampann', 'Unpolished toor dal, rich in protein and fibre.', 145, 160, '1 kg', 'https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg?auto=compress&cs=tinysrgb&w=400', 90, ARRAY['essential'], true),
((SELECT id FROM categories WHERE slug='staples-pantry'), 'Fortune Sunflower Oil', 'Fortune', 'Refined sunflower oil, light and healthy.', 139, 165, '1 L', 'https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=400', 110, ARRAY['essential'], true),
((SELECT id FROM categories WHERE slug='staples-pantry'), 'Tata Salt', 'Tata', 'Iodised table salt, vacuum evaporated.', 28, 30, '1 kg', 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=400', 200, ARRAY['essential'], true),
((SELECT id FROM categories WHERE slug='staples-pantry'), 'Sugar', 'Madhur', 'Refined white sugar, perfect for tea and sweets.', 48, 55, '1 kg', 'https://images.pexels.com/photos/2664642/pexels-photo-2664642.jpeg?auto=compress&cs=tinysrgb&w=400', 150, ARRAY['essential'], true),

-- Snacks & Beverages
((SELECT id FROM categories WHERE slug='snacks-beverages'), 'Lay''s Classic Salted', 'Lay''s', 'Crispy potato chips with classic salted flavour.', 20, 25, '52 g', 'https://images.pexels.com/photos/1158174/pexels-photo-1158174.jpeg?auto=compress&cs=tinysrgb&w=400', 200, ARRAY['bestseller'], true),
((SELECT id FROM categories WHERE slug='snacks-beverages'), 'Haldiram''s Bhujia', 'Haldiram''s', 'Crunchy and spicy bhujia, perfect tea-time snack.', 52, 55, '200 g', 'https://images.pexels.com/photos/1158174/pexels-photo-1158174.jpeg?auto=compress&cs=tinysrgb&w=400', 150, ARRAY['bestseller'], true),
((SELECT id FROM categories WHERE slug='snacks-beverages'), 'Coca-Cola', 'Coca-Cola', 'Refreshing cola, chilled and fizzy.', 38, 40, '750 ml', 'https://images.pexels.com/photos/2983100/pexels-photo-2983100.jpeg?auto=compress&cs=tinysrgb&w=400', 180, ARRAY['cold'], true),
((SELECT id FROM categories WHERE slug='snacks-beverages'), 'Bournvita', 'Cadbury', 'Health drink with chocolate flavour, rich in vitamins.', 230, 260, '500 g', 'https://images.pexels.com/photos/3170609/pexels-photo-3170609.jpeg?auto=compress&cs=tinysrgb&w=400', 90, ARRAY['bestseller'], true),
((SELECT id FROM categories WHERE slug='snacks-beverages'), 'Maggi Noodles', 'Maggi', 'Instant masala noodles, ready in 2 minutes.', 50, 56, '4 pack', 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400', 300, ARRAY['essential', 'bestseller'], true),

-- Personal Care
((SELECT id FROM categories WHERE slug='personal-care'), 'Colgate Toothpaste', 'Colgate', 'Strong teeth toothpaste with fluoride protection.', 79, 95, '200 g', 'https://images.pexels.com/photos/4202325/pexels-photo-4202325.jpeg?auto=compress&cs=tinysrgb&w=400', 150, ARRAY['essential'], true),
((SELECT id FROM categories WHERE slug='personal-care'), 'Dove Soap', 'Dove', 'Moisturising beauty soap bar, gentle on skin.', 55, 65, '3 x 100 g', 'https://images.pexels.com/photos/4202390/pexels-photo-4202390.jpeg?auto=compress&cs=tinysrgb&w=400', 120, ARRAY['bestseller'], true),
((SELECT id FROM categories WHERE slug='personal-care'), 'Head & Shoulders Shampoo', 'Head & Shoulders', 'Anti-dandruff shampoo for clean and healthy hair.', 180, 220, '340 ml', 'https://images.pexels.com/photos/4202325/pexels-photo-4202325.jpeg?auto=compress&cs=tinysrgb&w=400', 80, ARRAY['premium'], true),
((SELECT id FROM categories WHERE slug='personal-care'), 'Nivea Body Lotion', 'Nivea', 'Nourishing body milk for very dry skin.', 199, 250, '400 ml', 'https://images.pexels.com/photos/4202390/pexels-photo-4202390.jpeg?auto=compress&cs=tinysrgb&w=400', 70, ARRAY['premium'], true),

-- Home & Kitchen
((SELECT id FROM categories WHERE slug='home-kitchen'), 'Surf Excel Detergent', 'Surf Excel', 'Powerful detergent powder for tough stain removal.', 185, 210, '1 kg', 'https://images.pexels.com/photos/4239066/pexels-photo-4239066.jpeg?auto=compress&cs=tinysrgb&w=400', 100, ARRAY['essential'], true),
((SELECT id FROM categories WHERE slug='home-kitchen'), 'Vim Dishwash Liquid', 'Vim', 'Tough on grease, gentle on hands dishwash gel.', 175, 200, '750 ml', 'https://images.pexels.com/photos/4239066/pexels-photo-4239066.jpeg?auto=compress&cs=tinysrgb&w=400', 90, ARRAY['essential'], true),
((SELECT id FROM categories WHERE slug='home-kitchen'), 'Harpic Toilet Cleaner', 'Harpic', 'Powerful toilet cleaner that kills 99.9% germs.', 85, 99, '1 L', 'https://images.pexels.com/photos/4239066/pexels-photo-4239066.jpeg?auto=compress&cs=tinysrgb&w=400', 80, ARRAY['essential'], true),
((SELECT id FROM categories WHERE slug='home-kitchen'), 'Lizol Floor Cleaner', 'Lizol', 'Disinfectant floor cleaner with fresh fragrance.', 99, 120, '975 ml', 'https://images.pexels.com/photos/4239066/pexels-photo-4239066.jpeg?auto=compress&cs=tinysrgb&w=400', 60, ARRAY['essential'], true),

-- Masalas & Sauces
((SELECT id FROM categories WHERE slug='masalas-sauces'), 'MDH Garam Masala', 'MDH', 'Blend of authentic Indian spices for rich flavour.', 85, 95, '100 g', 'https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg?auto=compress&cs=tinysrgb&w=400', 150, ARRAY['essential', 'bestseller'], true),
((SELECT id FROM categories WHERE slug='masalas-sauces'), 'Everest Haldi Powder', 'Everest', 'Pure turmeric powder, naturally grown and ground.', 45, 50, '200 g', 'https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg?auto=compress&cs=tinysrgb&w=400', 200, ARRAY['essential'], true),
((SELECT id FROM categories WHERE slug='masalas-sauces'), 'Kissan Tomato Ketchup', 'Kissan', 'Thick and tangy tomato ketchup, made from real tomatoes.', 95, 105, '500 g', 'https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg?auto=compress&cs=tinysrgb&w=400', 120, ARRAY['bestseller'], true),
((SELECT id FROM categories WHERE slug='masalas-sauces'), 'Catch Red Chilli Powder', 'Catch', 'Fiery red chilli powder for spicy Indian dishes.', 55, 65, '200 g', 'https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg?auto=compress&cs=tinysrgb&w=400', 130, ARRAY['essential'], true),
((SELECT id FROM categories WHERE slug='masalas-sauces'), 'MTR Puliyogare Mix', 'MTR', 'Ready-to-use tamarind rice paste mix, authentic taste.', 65, 75, '200 g', 'https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg?auto=compress&cs=tinysrgb&w=400', 70, ARRAY['instant'], true),

-- Tea & Coffee
((SELECT id FROM categories WHERE slug='tea-coffee'), 'Tata Tea Gold', 'Tata', 'Premium tea blend, strong and refreshing.', 285, 320, '500 g', 'https://images.pexels.com/photos/39347/tea-leaf-leaves-green-39347.jpeg?auto=compress&cs=tinysrgb&w=400', 150, ARRAY['essential', 'bestseller'], true),
((SELECT id FROM categories WHERE slug='tea-coffee'), 'Bru Instant Coffee', 'Bru', 'Rich and aromatic instant coffee, perfect start to your day.', 285, 320, '100 g', 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400', 120, ARRAY['bestseller'], true),
((SELECT id FROM categories WHERE slug='tea-coffee'), 'Red Label Tea', 'Brooke Bond', 'Strong and refreshing tea, India''s favourite.', 245, 280, '500 g', 'https://images.pexels.com/photos/39347/tea-leaf-leaves-green-39347.jpeg?auto=compress&cs=tinysrgb&w=400', 100, ARRAY['essential'], true),
((SELECT id FROM categories WHERE slug='tea-coffee'), 'Nescafe Classic', 'Nescafe', 'Instant coffee with rich aroma and smooth taste.', 310, 350, '100 g', 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400', 90, ARRAY['premium', 'bestseller'], true)
ON CONFLICT DO NOTHING;