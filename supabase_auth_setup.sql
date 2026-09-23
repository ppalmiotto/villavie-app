-- ══════════════════════════════════════════════
--  VILLA VIE — Supabase Auth Setup
--  Run this in Supabase → SQL Editor → New Query
-- ══════════════════════════════════════════════

-- This sets up auth so only Supabase-created users can log in.
-- No extra SQL needed for basic email/password auth —
-- Supabase Auth is enabled by default.

-- Optional: create a view to list all resident accounts easily
create or replace view resident_users as
select id, email, created_at, last_sign_in_at
from auth.users
order by created_at desc;

-- Grant access to the view for the service role
grant select on resident_users to service_role;
