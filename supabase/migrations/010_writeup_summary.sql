-- Add summary column to writeups for SEO metadata
ALTER TABLE writeups ADD COLUMN IF NOT EXISTS summary text DEFAULT '';
