-- Platora: Online Food Delivery System - PostgreSQL schema

-- Roles: admin, customer, restaurant, delivery

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin','customer','restaurant','delivery')),
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS restaurants (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  phone VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL PRIMARY KEY,
  restaurant_id INT REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES users(id) ON DELETE SET NULL,
  restaurant_id INT REFERENCES restaurants(id) ON DELETE SET NULL,
  total_amount NUMERIC(10,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'Pending', -- Pending, Preparing, Ready for Pickup, Out for Delivery, Delivered, Cancelled
  payment_mode VARCHAR(50),
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id INT REFERENCES menu_items(id) ON DELETE SET NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS deliveries (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  delivery_agent_id INT REFERENCES users(id) ON DELETE SET NULL,
  status VARCHAR(50) DEFAULT 'Assigned', -- Assigned, Picked, On the Way, Delivered
  assigned_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  mode VARCHAR(50),
  paid_at TIMESTAMP DEFAULT now(),
  invoice_text TEXT
);

-- New: invoices table to store structured invoice records (separate from payments)
CREATE TABLE IF NOT EXISTS invoices (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  generated_at TIMESTAMP DEFAULT now(),
  invoice_text TEXT,
  generated_by VARCHAR(100)
);

-- View: aggregated order history for quick reads
CREATE OR REPLACE VIEW view_order_history AS
SELECT
  o.id as order_id,
  o.created_at,
  o.status,
  u.id as customer_id,
  u.name as customer_name,
  r.id as restaurant_id,
  r.name as restaurant_name,
  o.total_amount
FROM orders o
LEFT JOIN users u ON u.id = o.customer_id
LEFT JOIN restaurants r ON r.id = o.restaurant_id;

-- View: daily sales per restaurant
CREATE OR REPLACE VIEW view_daily_sales_per_restaurant AS
SELECT
  r.id as restaurant_id,
  r.name as restaurant_name,
  date_trunc('day', o.created_at) as day,
  SUM(o.total_amount) as total_sales,
  COUNT(o.id) as orders_count
FROM orders o
JOIN restaurants r ON r.id = o.restaurant_id
WHERE o.status <> 'Cancelled'
GROUP BY r.id, r.name, date_trunc('day', o.created_at)
ORDER BY day DESC;

-- Stored procedure: auto-insert delivery record upon order confirmation
CREATE OR REPLACE FUNCTION fn_create_delivery_for_order(p_order_id INT)
RETURNS VOID LANGUAGE plpgsql AS $$
DECLARE
  selected_agent INT;
BEGIN
  -- Choose the delivery agent with the fewest active (non-Delivered) deliveries.
  -- Tie-breaker: lowest user id for determinism.
  SELECT u.id INTO selected_agent
  FROM users u
  LEFT JOIN deliveries d ON d.delivery_agent_id = u.id AND d.status <> 'Delivered'
  WHERE u.role = 'delivery'
  GROUP BY u.id
  ORDER BY COUNT(d.id) ASC, u.id ASC
  LIMIT 1;

  -- Insert delivery; selected_agent may be NULL if no delivery agents exist.
  INSERT INTO deliveries(order_id, delivery_agent_id, status, assigned_at)
  VALUES (p_order_id, selected_agent, 'Assigned', now());
END;
$$;

-- Stored procedure: generate invoice (inserts into payments with invoice text)
CREATE OR REPLACE FUNCTION fn_generate_invoice(p_order_id INT, p_mode VARCHAR)
RETURNS VOID LANGUAGE plpgsql AS $$
DECLARE
  total NUMERIC(10,2);
  invoice TEXT;
  inv_id INT;
BEGIN
  SELECT COALESCE(SUM(oi.quantity * oi.unit_price),0) INTO total
  FROM order_items oi
  WHERE oi.order_id = p_order_id;

  invoice := format('Invoice for order %s:\nTotal: %s\nGenerated at: %s', p_order_id, total, now());

  -- Insert into payments for payment history
  INSERT INTO payments(order_id, amount, mode, paid_at, invoice_text)
  VALUES (p_order_id, total, p_mode, now(), invoice);

  -- insert a simplified invoice record as well
  INSERT INTO invoices(order_id, amount, currency, generated_at, invoice_text, generated_by)
  VALUES (p_order_id, total, 'INR', now(), invoice, p_mode)
  RETURNING id INTO inv_id;

  -- update orders total_amount
  UPDATE orders SET total_amount = total WHERE id = p_order_id;
END;
$$;

-- New: function to fetch enriched deliveries for a delivery agent
-- Returns one row per delivery with aggregated order items (as JSON array with menu item names)
CREATE OR REPLACE FUNCTION fn_get_deliveries_for_agent(p_agent_id INT)
RETURNS TABLE (
  delivery_id INT,
  order_id INT,
  status TEXT,
  assigned_at TIMESTAMP,
  updated_at TIMESTAMP,
  total_amount NUMERIC,
  order_status TEXT,
  customer_name TEXT,
  customer_contact TEXT,
  delivery_address TEXT,
  items JSON
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id as delivery_id,
    d.order_id,
    d.status::text,
    d.assigned_at,
    d.updated_at,
    o.total_amount,
    o.status::text as order_status,
    u.name::text as customer_name,
    u.phone::text as customer_contact,
    r.address::text as delivery_address,
    COALESCE(
      json_agg(
        json_build_object(
          'order_item_id', oi.id,
          'menu_item_id', oi.menu_item_id,
          'name', mi.name,
          'quantity', oi.quantity,
          'unit_price', oi.unit_price
        ) ORDER BY oi.id
      ) FILTER (WHERE oi.id IS NOT NULL),
      '[]'::json
    ) as items
  FROM deliveries d
  JOIN orders o ON o.id = d.order_id
  LEFT JOIN users u ON u.id = o.customer_id
  LEFT JOIN restaurants r ON r.id = o.restaurant_id
  LEFT JOIN order_items oi ON oi.order_id = o.id
  LEFT JOIN menu_items mi ON mi.id = oi.menu_item_id
  WHERE d.delivery_agent_id = p_agent_id
  GROUP BY d.id, d.order_id, d.status, d.assigned_at, d.updated_at,
           o.total_amount, o.status, u.name, u.phone, r.address
  ORDER BY d.assigned_at DESC;
END;
$$;

-- Seed an admin user (optional): uncomment and set password hash appropriately
-- INSERT INTO users(email, password_hash, name, role) VALUES ('admin@example.com', '<bcrypt-hash>', 'Admin', 'admin');

-- Example indexes
CREATE INDEX IF NOT EXISTS idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
