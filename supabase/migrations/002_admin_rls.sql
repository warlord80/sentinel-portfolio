-- ──────────────────────────────────────────────────────────────────
-- RLS Policies for authenticated admin operations.
-- Run this AFTER the initial migration + base RLS policies.
-- ──────────────────────────────────────────────────────────────────

-- Content tables: authenticated users can CRUD
-- (anon key with session cookie = authenticated when logged in)

-- Projects
create policy "Authenticated CRUD" on projects for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Experience
create policy "Authenticated CRUD" on experience for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Certifications
create policy "Authenticated CRUD" on certifications for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Writeups
create policy "Authenticated CRUD" on writeups for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Site settings
create policy "Authenticated CRUD" on site_settings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Contact submissions: authenticated can read/update/delete
-- (anon can only insert — already covered by "Anyone can submit")
create policy "Authenticated read" on contact_submissions for select
  using (auth.role() = 'authenticated');

create policy "Authenticated update" on contact_submissions for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

create policy "Authenticated delete" on contact_submissions for delete
  using (auth.role() = 'authenticated');
