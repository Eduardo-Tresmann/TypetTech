-- Tabela de resultados de digitação
-- Armazena duração (15/30/60/120), métricas (WPM, precisão, acertos/erros)
-- e data/hora do teste (created_at)
create table if not exists public.typing_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  total_time int not null check (total_time in (15,30,60,120)),
  wpm int not null check (wpm >= 0),
  accuracy numeric not null check (accuracy >= 0 and accuracy <= 100),
  correct_letters int not null default 0 check (correct_letters >= 0),
  incorrect_letters int not null default 0 check (incorrect_letters >= 0),
  created_at timestamptz not null default now()
);

-- Índices para consultas rápidas em leaderboards e histórico do usuário
create index if not exists typing_results_top_idx on public.typing_results (total_time, wpm desc, created_at desc);
create index if not exists typing_results_user_idx on public.typing_results (user_id, created_at desc);
-- Índice adicional focado em histórico do usuário por data/hora
create index if not exists typing_results_created_idx on public.typing_results (user_id, created_at desc);

-- Ativa RLS para proteger os dados por usuário
alter table public.typing_results enable row level security;

-- Policy de inserção: só o dono (auth.uid()) pode inserir seus resultados
drop policy if exists typing_results_insert_own on public.typing_results;
create policy typing_results_insert_own on public.typing_results
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Policy de seleção: leitura aberta (útil para leaderboards públicas)
-- Se preferir apenas usuários autenticados, troque por `to authenticated`
drop policy if exists typing_results_select_all on public.typing_results;
create policy typing_results_select_all on public.typing_results
  for select
  using (true);
