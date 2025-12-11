-- ==============================================================================
-- Idempotent Schema Script
-- Run this entire file to sync your database structure.
-- It handles existing tables and policies gracefully.
-- ==============================================================================

-- 1. about_page
create table if not exists public.about_page (
  id uuid not null default gen_random_uuid () primary key,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  title text not null,
  bio text not null,
  image_url text not null,
  skills text[] not null
);

-- Add columns safely (idempotent)
alter table public.about_page add column if not exists email text;
alter table public.about_page add column if not exists phone text;
alter table public.about_page add column if not exists location text;
alter table public.about_page add column if not exists linkedin_url text;
alter table public.about_page add column if not exists github_url text;
alter table public.about_page add column if not exists resume_url text;

alter table public.about_page enable row level security;

drop policy if exists "Enable read access for everyone" on public.about_page;
create policy "Enable read access for everyone" on public.about_page for select using (true);

drop policy if exists "Enable all access for authenticated users" on public.about_page;
create policy "Enable all access for authenticated users" on public.about_page for all using (auth.role() = 'authenticated');


-- 2. timeline_events
create table if not exists public.timeline_events (
  id uuid not null default gen_random_uuid () primary key,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  chapter text not null,
  title text not null,
  date_range text not null,
  description text not null,
  details text[] not null,
  tech_stack text[] null,
  icon text not null,
  "order" integer not null
);

alter table public.timeline_events enable row level security;

drop policy if exists "Enable read access for everyone" on public.timeline_events;
create policy "Enable read access for everyone" on public.timeline_events for select using (true);

drop policy if exists "Enable all access for authenticated users" on public.timeline_events;
create policy "Enable all access for authenticated users" on public.timeline_events for all using (auth.role() = 'authenticated');


-- 3. projects
create table if not exists public.projects (
  id uuid not null default gen_random_uuid () primary key,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  slug text not null unique,
  title text not null,
  subtitle text,
  thumbnail text,
  innovations jsonb,
  repo_url text,
  demo_url text,
  content text,
  tech_stack text[],
  published boolean not null default false,
  technical_summary jsonb,
  demo_checklist text[]
);

alter table public.projects enable row level security;

drop policy if exists "Enable read access for everyone" on public.projects;
create policy "Enable read access for everyone" on public.projects for select using (true);

drop policy if exists "Enable all access for authenticated users" on public.projects;
create policy "Enable all access for authenticated users" on public.projects for all using (auth.role() = 'authenticated');


-- 4. scrolls (Optional, but kept for completeness)
create table if not exists public.scrolls (
  id uuid not null default gen_random_uuid () primary key,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  title text not null,
  slug text not null unique,
  category text check (category in ('Spellbook', 'Reflections', 'Lore')),
  date text,
  read_time text,
  excerpt text,
  icon text,
  content text,
  published boolean default false,
  image_url text
);

alter table public.scrolls enable row level security;

drop policy if exists "Enable read access for everyone" on public.scrolls;
create policy "Enable read access for everyone" on public.scrolls for select using (true);

drop policy if exists "Enable all access for authenticated users" on public.scrolls;
create policy "Enable all access for authenticated users" on public.scrolls for all using (auth.role() = 'authenticated');


-- 5. messages (New table)
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text,
  email text not null,
  company text,
  message text,
  type text,
  status text default 'unread'
);

alter table public.messages enable row level security;

drop policy if exists "Anyone can insert messages" on public.messages;
create policy "Anyone can insert messages" on public.messages for insert with check (true);

drop policy if exists "Admins can view messages" on public.messages;
create policy "Admins can view messages" on public.messages for select using (auth.role() = 'authenticated');


-- 6. Storage Bucket & Policies
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "Public Access" on storage.objects;
create policy "Public Access" on storage.objects for select using (bucket_id = 'media');

drop policy if exists "Auth Upload" on storage.objects;
create policy "Auth Upload" on storage.objects for insert with check (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "Auth Delete" on storage.objects;
create policy "Auth Delete" on storage.objects for delete using (bucket_id = 'media' and auth.role() = 'authenticated');
