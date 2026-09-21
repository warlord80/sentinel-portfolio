-- Add resume_url column and create the singleton settings row

alter table site_settings
  add column if not exists resume_url text not null default '';

insert into site_settings (hero_tagline, hero_subtitle, about_text, about_focus, about_base, about_status)
select
  'Cybersecurity Analyst',
  'I build, investigate and document practical security systems — detection, monitoring and defensive operations.',
  '',
  'SOC · Detection · IR',
  'Nigeria',
  'Available'
where not exists (select 1 from site_settings);
