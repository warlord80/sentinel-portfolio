-- Add summary and github_url fields for SEO
ALTER TABLE writeups ADD COLUMN IF NOT EXISTS summary text DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS summary text DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS github_url text DEFAULT '';
