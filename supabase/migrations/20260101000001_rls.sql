-- =============================================================================
-- La Cocina Canina — 02. Row Level Security
--
-- Regla general:
--   · Catálogo y contenido publicado: lectura pública, escritura solo staff.
--   · Datos personales: cada cliente ve y edita únicamente lo suyo.
--   · El staff consulta todo y escribe según el grupo de módulos de su rol.
-- =============================================================================

-- --------- Catálogo y contenido: lectura pública / escritura por grupo -------

do $$
declare
  fila record;
begin
  for fila in
    select * from (values
      ('categorias',           'Catálogo'),
      ('productos',            'Catálogo'),
      ('presentaciones',       'Catálogo'),
      ('productos_relacionados','Catálogo'),
      ('productos_barf',       'Catálogo'),
      ('barf_rangos',          'Catálogo'),
      ('lotes_mayor',          'Operación'),
      ('lotes_mayor_precios',  'Operación'),
      ('recompensas',          'Clientes'),
      ('reglas_puntos',        'Clientes'),
      ('regla_productos',      'Clientes'),
      ('contenido_web',        'Contenido'),
      ('secciones_inicio',     'Contenido'),
      ('banners',              'Contenido'),
      ('preguntas_frecuentes', 'Contenido'),
      ('testimonios',          'Contenido'),
      ('configuracion',        'Sistema')
    ) as t(tabla, grupo)
  loop
    execute format('alter table %I enable row level security', fila.tabla);

    execute format('drop policy if exists "lectura publica" on %I', fila.tabla);
    execute format(
      'create policy "lectura publica" on %I for select using (true)', fila.tabla);

    execute format('drop policy if exists "escritura staff" on %I', fila.tabla);
    execute format(
      'create policy "escritura staff" on %I for all to authenticated
         using (puede_grupo(%L)) with check (puede_grupo(%L))',
      fila.tabla, fila.grupo, fila.grupo);
  end loop;
end $$;

-- ------------------------- Datos personales del cliente ---------------------

do $$
declare t text;
begin
  foreach t in array array['mascotas','direcciones','favoritos','movimientos_puntos']
  loop
    execute format('alter table %I enable row level security', t);

    execute format('drop policy if exists "dueno gestiona" on %I', t);
    execute format(
      'create policy "dueno gestiona" on %I for all to authenticated
         using (perfil_id = auth.uid()) with check (perfil_id = auth.uid())', t);

    execute format('drop policy if exists "staff consulta" on %I', t);
    execute format(
      'create policy "staff consulta" on %I for select to authenticated
         using (es_staff())', t);
  end loop;
end $$;

alter table mascota_favoritos enable row level security;
drop policy if exists "favoritos de mi mascota" on mascota_favoritos;
create policy "favoritos de mi mascota" on mascota_favoritos for all to authenticated
  using (exists (select 1 from mascotas m where m.id = mascota_id and m.perfil_id = auth.uid()))
  with check (exists (select 1 from mascotas m where m.id = mascota_id and m.perfil_id = auth.uid()));
drop policy if exists "staff consulta favoritos mascota" on mascota_favoritos;
create policy "staff consulta favoritos mascota" on mascota_favoritos for select to authenticated
  using (es_staff());

alter table perfiles enable row level security;
drop policy if exists "perfil propio" on perfiles;
create policy "perfil propio" on perfiles for all to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
drop policy if exists "staff consulta perfiles" on perfiles;
create policy "staff consulta perfiles" on perfiles for select to authenticated
  using (es_staff());

-- --------------------------------- Pedidos ----------------------------------

alter table pedidos enable row level security;

drop policy if exists "pedidos propios" on pedidos;
create policy "pedidos propios" on pedidos for select to authenticated
  using (perfil_id = auth.uid());

-- Permite comprar con o sin cuenta. El pedido anónimo se crea desde el
-- servidor con la clave de servicio, que omite RLS.
drop policy if exists "crear pedido propio" on pedidos;
create policy "crear pedido propio" on pedidos for insert to authenticated
  with check (perfil_id = auth.uid());

drop policy if exists "staff gestiona pedidos" on pedidos;
create policy "staff gestiona pedidos" on pedidos for all to authenticated
  using (puede_grupo('Operación')) with check (puede_grupo('Operación'));

do $$
declare t text;
begin
  foreach t in array array['pedido_lineas','pedido_historial','pedido_mensajes']
  loop
    execute format('alter table %I enable row level security', t);

    execute format('drop policy if exists "lineas del propio pedido" on %I', t);
    execute format(
      'create policy "lineas del propio pedido" on %I for select to authenticated
         using (exists (select 1 from pedidos p
                         where p.id = pedido_id and p.perfil_id = auth.uid()))', t);

    execute format('drop policy if exists "staff gestiona pedido" on %I', t);
    execute format(
      'create policy "staff gestiona pedido" on %I for all to authenticated
         using (puede_grupo(''Operación'')) with check (puede_grupo(''Operación''))', t);
  end loop;
end $$;

-- --------------------------------- Cupones ----------------------------------

alter table cupones enable row level security;
drop policy if exists "cupones activos visibles" on cupones;
create policy "cupones activos visibles" on cupones for select using (activo);
drop policy if exists "staff gestiona cupones" on cupones;
create policy "staff gestiona cupones" on cupones for all to authenticated
  using (puede_grupo('Clientes')) with check (puede_grupo('Clientes'));

alter table cupones_perfil enable row level security;
drop policy if exists "cupones propios" on cupones_perfil;
create policy "cupones propios" on cupones_perfil for all to authenticated
  using (perfil_id = auth.uid()) with check (perfil_id = auth.uid());
drop policy if exists "staff consulta cupones perfil" on cupones_perfil;
create policy "staff consulta cupones perfil" on cupones_perfil for select to authenticated
  using (es_staff());

-- ------------------------------- Cotizaciones -------------------------------

alter table cotizaciones_mayor enable row level security;
drop policy if exists "cualquiera solicita cotizacion" on cotizaciones_mayor;
create policy "cualquiera solicita cotizacion" on cotizaciones_mayor
  for insert with check (true);
drop policy if exists "staff gestiona cotizaciones" on cotizaciones_mayor;
create policy "staff gestiona cotizaciones" on cotizaciones_mayor for all to authenticated
  using (puede_grupo('Operación')) with check (puede_grupo('Operación'));

-- ----------------------------- Personal y roles -----------------------------

alter table staff enable row level security;
drop policy if exists "staff se consulta" on staff;
create policy "staff se consulta" on staff for select to authenticated
  using (id = auth.uid() or es_staff());
drop policy if exists "solo admin gestiona staff" on staff;
create policy "solo admin gestiona staff" on staff for all to authenticated
  using (es_admin()) with check (es_admin());

alter table rol_permisos enable row level security;
drop policy if exists "staff consulta permisos" on rol_permisos;
create policy "staff consulta permisos" on rol_permisos for select to authenticated
  using (es_staff());
drop policy if exists "solo admin gestiona permisos" on rol_permisos;
create policy "solo admin gestiona permisos" on rol_permisos for all to authenticated
  using (es_admin()) with check (es_admin());
