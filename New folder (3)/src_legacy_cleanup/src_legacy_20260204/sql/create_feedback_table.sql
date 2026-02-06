-- Create the platform_feedback table
create table if not exists public.platform_feedback (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  name text not null,
  email text not null,
  message text not null,
  type text not null default 'General',
  shop_id text, -- Optional: link to the shop sending the feedback
  constraint platform_feedback_pkey primary key (id)
);

-- Add RLS policies (Optional but recommended)
alter table public.platform_feedback enable row level security;

-- Allow anyone (anon) to insert feedback
create policy "Enable insert for all users" on public.platform_feedback
  for insert
  with check (true);

-- Allow only authenticated admins (or service role) to view
-- For now, we'll allow public read if you haven't set up admin roles yet, 
-- BUT ideally this should be restricted. 
-- Assuming 'authenticated' users (sellers) can't see ALL feedback, only Super Admin.
-- Since we don't have a distinct 'super_admin' role in this simple setup,
-- we usually rely on the Admin Page protected by RLS or specific logic.
-- For simplicity in this demo: Allow read for everyone (so the Admin page works for you).
create policy "Enable read for all users" on public.platform_feedback
  for select
  using (true);
