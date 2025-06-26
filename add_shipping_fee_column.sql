-- Add shipping_fee column to orders table
ALTER TABLE orders ADD COLUMN shipping_fee DOUBLE DEFAULT 0.0;
