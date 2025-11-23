-- Tabela de perfis de usuário
-- Mantém nome de exibição e avatar, ligados ao usuário do auth

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  updated_at timestamptz not null default now()
);

create unique index if not exists profiles_display_name_unique
  on public.profiles ((lower(trim(display_name))))
  where display_name is not null;

create or replace function public.normalize_display_name()
returns trigger as $$
begin
  if new.display_name is not null then
    new.display_name := trim(new.display_name);
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_normalize_display_name on public.profiles;
create trigger profiles_normalize_display_name
before insert or update on public.profiles
for each row execute function public.normalize_display_name();

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'profiles_display_name_len_chk'
  ) then
    alter table public.profiles add constraint profiles_display_name_len_chk
      check (display_name is null or char_length(trim(display_name)) between 3 and 24);
  end if;
end $$;

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
