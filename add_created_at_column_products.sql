-- Migration: Add created_at column to products table
ALTER TABLE products ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
