-- Tabela de perfis de usuário
-- Mantém nome de exibição e avatar, ligados ao usuário do auth

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  updated_at timestamptz not null default now()
);

-- Índice para ordenar/consultar por atualização
create index if not exists profiles_updated_idx on public.profiles (updated_at desc);

-- Ativa RLS para segurança por linha
alter table public.profiles enable row level security;

-- Leitura: permitir que todos consultem perfis (necessário para mostrar nomes/avatares no leaderboards)
-- Se preferir apenas autenticados, troque por `to authenticated`
drop policy if exists profiles_select_all on public.profiles;
create policy profiles_select_all on public.profiles
  for select
  using (true);

-- Escrita: cada usuário só pode inserir/atualizar o próprio perfil
drop policy if exists profiles_upsert_own on public.profiles;
create policy profiles_upsert_own on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

