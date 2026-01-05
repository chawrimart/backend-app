-- Add Users (Password is 'password' for all)
-- Admin
INSERT INTO users (uuid, email, phone, password_hash, first_name, last_name, role, status, email_verified_at)
VALUES 
(UUID(), 'admin@chawrimart.com', '9876543210', '$2b$10$EpOd.z.p7.q.w.y.x.', 'Admin', 'User', 'admin', 'active', NOW());

-- Supplier
INSERT INTO users (uuid, email, phone, password_hash, first_name, last_name, role, status, email_verified_at)
VALUES 
(UUID(), 'supplier@paperco.com', '9876543211', '$2b$10$EpOd.z.p7.q.w.y.x.', 'Raj', 'Malhotra', 'supplier', 'active', NOW());

-- Buyer
INSERT INTO users (uuid, email, phone, password_hash, first_name, last_name, role, status, email_verified_at)
VALUES 
(UUID(), 'buyer@printpress.com', '9876543212', '$2b$10$EpOd.z.p7.q.w.y.x.', 'Amit', 'Sharma', 'buyer', 'active', NOW());

-- Add User Profiles
-- Supplier Profile
INSERT INTO user_profiles (user_id, company_name, company_type, gst_number, city, state, country)
SELECT id, 'Paper Co private Ltd', 'wholesaler', '27ABCDE1234F1Z5', 'Mumbai', 'Maharashtra', 'India'
FROM users WHERE email = 'supplier@paperco.com';

-- Buyer Profile
INSERT INTO user_profiles (user_id, company_name, company_type, gst_number, city, state, country)
SELECT id, 'Print Press Works', 'retailer', '27XYZZZ1234F1Z5', 'Delhi', 'Delhi', 'India'
FROM users WHERE email = 'buyer@printpress.com';

-- Add Categories
INSERT INTO categories (name, slug, description, level, is_active) VALUES 
('Paper & Cardboard', 'paper-cardboard', 'All types of paper and cardboard materials', 1, TRUE),
('Printing Services', 'printing-services', 'Offset, Digital and Screen printing', 1, TRUE);

INSERT INTO categories (parent_id, name, slug, description, level, is_active) 
SELECT id, 'Kraft Paper', 'kraft-paper', 'High strength kraft paper', 2, TRUE
FROM categories WHERE slug = 'paper-cardboard';

INSERT INTO categories (parent_id, name, slug, description, level, is_active) 
SELECT id, 'Coated Paper', 'coated-paper', 'Glossy and Matte coated papers', 2, TRUE
FROM categories WHERE slug = 'paper-cardboard';

-- Add Products
INSERT INTO products (uuid, supplier_id, category_id, name, slug, sku, description, price, price_unit, status, published_at)
SELECT 
UUID(),
(SELECT id FROM users WHERE email = 'supplier@paperco.com'),
(SELECT id FROM categories WHERE slug = 'kraft-paper'),
'High Quality Kraft Paper Roll 120GSM',
'kraft-paper-roll-120gsm',
'KRAFT-120',
'Durable kraft paper suitable for packaging.',
45.00,
'kg',
'active',
NOW();

INSERT INTO products (uuid, supplier_id, category_id, name, slug, sku, description, price, price_unit, status, published_at)
SELECT 
UUID(),
(SELECT id FROM users WHERE email = 'supplier@paperco.com'),
(SELECT id FROM categories WHERE slug = 'coated-paper'),
'Glossy Coated Paper A4',
'glossy-coated-paper-a4',
'GLOSS-A4',
'Premium glossy paper for brochures.',
150.00,
'ream',
'active',
NOW();

-- Add Buy Leads (RFQs)
INSERT INTO buy_leads (uuid, buyer_id, category_id, product_name, description, quantity, unit, status, created_at)
SELECT 
UUID(),
(SELECT id FROM users WHERE email = 'buyer@printpress.com'),
(SELECT id FROM categories WHERE slug = 'kraft-paper'),
'Need Kraft Paper for Cartons',
'Looking for 200kg of 140GSM kraft paper rolls immediately.',
200,
'kg',
'open',
NOW();
