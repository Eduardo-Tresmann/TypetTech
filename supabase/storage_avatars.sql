-- Bucket de imagens de avatar
-- Cria bucket público para exibir avatares no site

select storage.create_bucket('avatars', public := true);

-- Políticas de leitura: qualquer usuário pode ler arquivos do bucket
-- (p/ exibição pública de avatares)
create policy if not exists avatars_read_all
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Políticas de escrita: somente autenticados podem enviar/atualizar
create policy if not exists avatars_write_auth
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars');

create policy if not exists avatars_update_auth
  on storage.objects for update
  to authenticated
  using (bucket_id = 'avatars')
  with check (bucket_id = 'avatars');

