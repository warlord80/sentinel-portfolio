-- Enable RLS and add policies for social_links
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage social links"
ON social_links
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Anyone can view social links"
ON social_links
FOR SELECT
TO public
USING (true);
