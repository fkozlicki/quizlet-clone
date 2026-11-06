-- Tabelas do aplicativo de estudos. Podem coexistir com as tabelas do ControlePeso.
create table if not exists public.study_folders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  created_at timestamptz not null default now()
);
create table if not exists public.study_sets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  folder_id uuid references public.study_folders(id) on delete set null,
  title text not null check (char_length(title) between 1 and 120),
  description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.study_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  set_id uuid not null references public.study_sets(id) on delete cascade,
  question text not null,
  answer text not null,
  is_favorite boolean not null default false,
  position integer not null default 0,
  attempts integer not null default 0,
  correct_count integer not null default 0,
  wrong_count integer not null default 0,
  streak integer not null default 0,
  interval_days integer not null default 0,
  due_at timestamptz not null default now(),
  last_reviewed_at timestamptz,
  mastery_level integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists study_sets_user_idx on public.study_sets(user_id);
create index if not exists study_cards_set_idx on public.study_cards(set_id, position);
create index if not exists study_cards_user_fav_idx on public.study_cards(user_id, is_favorite);
create index if not exists study_cards_due_idx on public.study_cards(user_id, due_at);
alter table public.study_folders enable row level security;
alter table public.study_sets enable row level security;
alter table public.study_cards enable row level security;
drop policy if exists "folders own rows" on public.study_folders;
create policy "folders own rows" on public.study_folders for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "sets own rows" on public.study_sets;
create policy "sets own rows" on public.study_sets for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "cards own rows" on public.study_cards;
create policy "cards own rows" on public.study_cards for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
-- Tabelas novas não são automaticamente expostas à Data API em projetos atualizados.
revoke all on public.study_folders, public.study_sets, public.study_cards from anon;
grant select, insert, update, delete on public.study_folders, public.study_sets, public.study_cards to authenticated;
