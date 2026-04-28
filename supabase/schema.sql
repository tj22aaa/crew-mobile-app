create extension if not exists pgcrypto;

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  trip_name text not null,
  destination text not null,
  budget numeric default 0,
  crew_members_count integer default 0,
  start_date date,
  end_date date,
  activities text,
  created_at timestamptz default now()
);

alter table public.trips enable row level security;

drop policy if exists "Users can read their own trips" on public.trips;
create policy "Users can read their own trips"
on public.trips
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can create their own trips" on public.trips;
create policy "Users can create their own trips"
on public.trips
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own trips" on public.trips;
create policy "Users can update their own trips"
on public.trips
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own trips" on public.trips;
create policy "Users can delete their own trips"
on public.trips
for delete
to authenticated
using (auth.uid() = user_id);

create table if not exists public.crews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  member_names text[] not null default '{}',
  member_count integer default 0,
  created_at timestamptz default now()
);

alter table public.crews enable row level security;

drop policy if exists "Users can read their own crews" on public.crews;
create policy "Users can read their own crews"
on public.crews
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can create their own crews" on public.crews;
create policy "Users can create their own crews"
on public.crews
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own crews" on public.crews;
create policy "Users can delete their own crews"
on public.crews
for delete
to authenticated
using (auth.uid() = user_id);
