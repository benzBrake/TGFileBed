-- migrations/0000_create_images_table.sql

-- Drop table if it already exists
DROP TABLE IF EXISTS images;

-- Create images table
CREATE TABLE images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL,
  original_filename TEXT,
  telegram_message_id INTEGER NOT NULL,
  telegram_file_id TEXT NOT NULL,
  size INTEGER NOT NULL,
  hash_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on hash_id for faster lookups
CREATE INDEX idx_hash_id ON images (hash_id);