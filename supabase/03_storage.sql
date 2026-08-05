-- =============================================================================
-- La Cocina Canina — 03. Storage
--
-- Un bucket público para las imágenes del catálogo y el contenido, y uno para
-- las fotos de mascotas de cada cliente.
-- =============================================================================

insert into storage.buckets (id, name, public)
values ('catalogo', 'catalogo', true)
on conflict (id) do update set public = true;

insert into storage.buckets (id, name, public)
values ('mascotas', 'mascotas', true)
on conflict (id) do update set public = true;

-- ------------------------------- catalogo -----------------------------------

drop policy if exists "catalogo lectura publica" on storage.objects;
create policy "catalogo lectura publica" on storage.objects
  for select using (bucket_id = 'catalogo');

drop policy if exists "catalogo escritura staff" on storage.objects;
create policy "catalogo escritura staff" on storage.objects
  for all to authenticated
  using (bucket_id = 'catalogo' and es_staff())
  with check (bucket_id = 'catalogo' and es_staff());

-- ------------------------------- mascotas -----------------------------------
-- Cada cliente guarda en una carpeta con su propio uuid: mascotas/<uid>/foto.jpg

drop policy if exists "mascotas lectura publica" on storage.objects;
create policy "mascotas lectura publica" on storage.objects
  for select using (bucket_id = 'mascotas');

drop policy if exists "mascotas escritura propia" on storage.objects;
create policy "mascotas escritura propia" on storage.objects
  for all to authenticated
  using (bucket_id = 'mascotas' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'mascotas' and (storage.foldername(name))[1] = auth.uid()::text);
