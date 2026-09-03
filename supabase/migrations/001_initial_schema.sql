-- ──────────────────────────────────────────────────────────────────
-- SENTINEL PORTFOLIO — Database Schema
-- Run this migration in your Supabase SQL Editor to create all tables.
-- ──────────────────────────────────────────────────────────────────

-- Projects
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  number text not null default '01',
  title text not null,
  category text not null default '',
  tech text[] not null default '{}',
  status text not null default 'Draft' check (status in ('Draft', 'Published', 'Archived')),
  description text not null default '',
  slug text not null unique,
  image text,
  "order" integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Experience
create table if not exists experience (
  id uuid primary key default gen_random_uuid(),
  period text not null default '—',
  role text not null,
  company text not null default '',
  notes text[] not null default '{}',
  start_date date,
  "order" integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Certifications
create table if not exists certifications (
  id uuid primary key default gen_random_uuid(),
  initial text not null default '?',
  name text not null,
  issuer text not null default '',
  url text,
  "order" integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Writeups
create table if not exists writeups (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date text not null default '—',
  read text not null default '— min',
  slug text not null unique,
  content text,
  "order" integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Contact submissions
create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'pending' check (status in ('pending', 'read', 'archived')),
  created_at timestamptz not null default now()
);

-- Site settings (singleton row)
create table if not exists site_settings (
  id uuid primary key default gen_random_uuid(),
  hero_tagline text not null default 'Cybersecurity Analyst',
  hero_subtitle text not null default 'I build, investigate and document practical security systems — detection, monitoring and defensive operations.',
  about_text text not null default '',
  about_focus text not null default 'SOC · Detection · IR',
  about_base text not null default 'Nigeria',
  about_status text not null default 'Available',
  updated_at timestamptz not null default now()
);

-- ── Indexes ──────────────────────────────────────────────────────
create index if not exists projects_order_idx on projects ("order");
create index if not exists experience_order_idx on experience ("order");
create index if not exists certifications_order_idx on certifications ("order");
create index if not exists writeups_order_idx on writeups ("order");
create index if not exists contact_status_idx on contact_submissions (status);

-- ── Updated_at trigger ───────────────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger projects_updated_at before update on projects
  for each row execute function update_updated_at();
create trigger experience_updated_at before update on experience
  for each row execute function update_updated_at();
create trigger certifications_updated_at before update on certifications
  for each row execute function update_updated_at();
create trigger writeups_updated_at before update on writeups
  for each row execute function update_updated_at();
create trigger site_settings_updated_at before update on site_settings
  for each row execute function update_updated_at();
