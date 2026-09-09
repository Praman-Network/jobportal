-- ============================================================
-- Praman Network Jobs Board — Supabase schema
-- Run this in your Supabase project's SQL Editor.
-- ============================================================

-- Table: profiles
-- Extends Supabase's built-in auth.users with app-specific fields
-- (role, display name). One row per signed-up user.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  role text not null check (role in ('student', 'recruiter')),
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

-- Anyone logged in can read profiles (needed to show recruiter names, etc.)
drop policy if exists "Profiles are viewable by authenticated users" on public.profiles;
create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  using (auth.role() = 'authenticated');

-- A user can only insert/update their own profile row
drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Trigger function to automatically create profile on signup with SECURITY DEFINER
-- (Bypasses RLS issues during initial signup)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'User'),
    coalesce(new.raw_user_meta_data->>'role', 'student')
  )
  on conflict (id) do update
  set
    full_name = excluded.full_name,
    role = excluded.role;
  return new;
end;
$$;

-- Trigger definition
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Table: jobs
-- Recruiter-posted internal job/internship listings.
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  recruiter_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  company text not null,
  location text not null default 'Remote',
  description text not null,
  apply_url text not null,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

alter table public.jobs enable row level security;

-- Anyone (including anonymous visitors) can see active job postings
drop policy if exists "Active jobs are publicly visible" on public.jobs;
create policy "Active jobs are publicly visible"
  on public.jobs for select
  using (is_active = true);

-- A recruiter can always see their own postings, active or not
drop policy if exists "Recruiters can view their own jobs" on public.jobs;
create policy "Recruiters can view their own jobs"
  on public.jobs for select
  using (auth.uid() = recruiter_id);

-- Only recruiters can create jobs, and only under their own id
drop policy if exists "Recruiters can insert their own jobs" on public.jobs;
create policy "Recruiters can insert their own jobs"
  on public.jobs for insert
  with check (
    auth.uid() = recruiter_id
    and exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'recruiter'
    )
  );

-- Recruiters can update/delete only their own postings
drop policy if exists "Recruiters can update their own jobs" on public.jobs;
create policy "Recruiters can update their own jobs"
  on public.jobs for update
  using (auth.uid() = recruiter_id);

drop policy if exists "Recruiters can delete their own jobs" on public.jobs;
create policy "Recruiters can delete their own jobs"
  on public.jobs for delete
  using (auth.uid() = recruiter_id);

-- Helpful index for the common "show newest active jobs" query
create index if not exists jobs_active_created_idx
  on public.jobs (is_active, created_at desc);
