-- Analytics: page views tracking
CREATE TABLE IF NOT EXISTS page_views (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  path text NOT NULL,
  section text,
  referrer text,
  user_agent text,
  ip_hash text,
  created_at timestamptz DEFAULT now()
);

-- Index for fast queries
CREATE INDEX idx_page_views_path ON page_views(path);
CREATE INDEX idx_page_views_created_at ON page_views(created_at);
CREATE INDEX idx_page_views_section ON page_views(section);

-- Social links management
CREATE TABLE IF NOT EXISTS social_links (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  href text NOT NULL,
  icon text NOT NULL,
  order_index int DEFAULT 0,
  enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Seed default social links
INSERT INTO social_links (name, href, icon, order_index, enabled) VALUES
  ('LinkedIn', 'https://linkedin.com/in/chibuike-nwozor', 'linkedin', 0, true),
  ('X', 'https://x.com/youravgtechdude', 'x', 1, true),
  ('WhatsApp', 'https://wa.me/2348157159802', 'whatsapp', 2, true)
ON CONFLICT DO NOTHING;

-- Resume URL in site_settings (add column)
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS resume_url text DEFAULT '';
