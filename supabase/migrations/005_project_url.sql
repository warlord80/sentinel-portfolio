-- Add external URL field to projects for linking to live demos
alter table projects add column if not exists url text;
