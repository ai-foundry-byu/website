-- AI Foundry — af_private_pages
-- Project: ai-foundry-network. Apply in the Supabase SQL editor (project vgdyrswcuxcjmpwebytv).
-- Safe to re-run.
-- Holds the content of the token-gated pages (/brief, /board) so it is not in the public repo.
-- Load rows with scripts/push-private-pages.mjs.

create table if not exists public.af_private_pages (
  slug        text primary key,                 -- 'brief' | 'board'
  data        jsonb not null,                   -- the page content; shape is BriefData / BoardData
  updated_at  timestamptz not null default now()
);

-- Server talks to this table with the service_role key only (RLS-exempt).
-- Enable RLS with no public policies so the anon key cannot read it.
alter table public.af_private_pages enable row level security;
