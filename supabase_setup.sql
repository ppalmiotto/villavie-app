-- ══════════════════════════════════════════════
--  VILLA VIE RESIDENCES — Supabase Setup
--  Run this in Supabase → SQL Editor → New Query
-- ══════════════════════════════════════════════

-- 1. EMERGENCY ALERTS table
create table if not exists emergency_alerts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  body text not null,
  active boolean default true,
  created_at timestamptz default now()
);

-- 2. UPDATES table
create table if not exists updates (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  body text not null,
  category text default 'general',
  created_at timestamptz default now()
);

-- 3. Enable Row Level Security (keeps data safe)
alter table emergency_alerts enable row level security;
alter table updates enable row level security;

-- 4. Allow anyone to READ alerts and updates (residents)
create policy "Public read emergency_alerts"
  on emergency_alerts for select using (true);

create policy "Public read updates"
  on updates for select using (true);

-- 5. Allow anyone to INSERT/UPDATE (admin login is handled in the app)
--    For extra security you can restrict this later with Supabase Auth
create policy "Public insert emergency_alerts"
  on emergency_alerts for insert with check (true);

create policy "Public update emergency_alerts"
  on emergency_alerts for update using (true);

create policy "Public insert updates"
  on updates for insert with check (true);

-- 6. Enable real-time on both tables
alter publication supabase_realtime add table emergency_alerts;
alter publication supabase_realtime add table updates;

-- ── CHAT MESSAGES TABLE ──────────────────────
create table if not exists chat_messages (
  id uuid default gen_random_uuid() primary key,
  channel text not null default 'general',
  message text not null,
  user_email text not null,
  display_name text,
  is_crew boolean default false,
  created_at timestamptz default now()
);

alter table chat_messages enable row level security;

create policy "Public read chat_messages"
  on chat_messages for select using (true);

create policy "Public insert chat_messages"
  on chat_messages for insert with check (true);

alter publication supabase_realtime add table chat_messages;

-- ── POLLS TABLE ──────────────────────────────
create table if not exists polls (
  id uuid default gen_random_uuid() primary key,
  question text not null,
  options jsonb not null,
  votes jsonb default '{}',
  created_by text,
  active boolean default true,
  created_at timestamptz default now()
);

alter table polls enable row level security;

create policy "Public read polls" on polls for select using (true);
create policy "Public insert polls" on polls for insert with check (true);
create policy "Public update polls" on polls for update using (true);
create policy "Public delete polls" on polls for delete using (true);

-- ── ADD image_data & reactions COLUMNS TO chat_messages ──
alter table chat_messages add column if not exists image_data text;
alter table chat_messages add column if not exists reactions text default '{}';
