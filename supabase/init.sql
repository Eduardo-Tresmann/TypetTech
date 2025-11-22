-- Inicialização de extensões necessárias
-- Habilita funções como gen_random_uuid() usadas nas chaves primárias UUID
create extension if not exists pgcrypto;

-- (Opcional) Caso queira usar uuid_generate_v4(), habilite também:
-- create extension if not exists "uuid-ossp";

