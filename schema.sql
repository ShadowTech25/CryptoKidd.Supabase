-- New article_queue table
CREATE TABLE IF NOT EXISTS article_queue (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamp DEFAULT current_timestamp
);

-- Update articles table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS reviewed boolean DEFAULT false;