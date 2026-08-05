-- =============================================================================
-- La Cocina Canina — 04. Permisos de tabla
--
-- En PostgreSQL, Row Level Security filtra FILAS, pero antes hace falta el
-- permiso para tocar la TABLA. Sin estos GRANT, `anon` y `authenticated`
-- reciben «permission denied for table …» aunque las políticas los permitan.
--
-- Es la misma postura que trae un proyecto de Supabase por defecto: permiso
-- amplio a nivel de tabla y RLS como única puerta real. Por eso este archivo
-- va después de 02_rls.sql: todas las tablas ya tienen RLS activo.
-- =============================================================================

grant usage on schema public to anon, authenticated, service_role;

grant all on all tables    in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
grant all on all functions in schema public to anon, authenticated, service_role;

-- Que las tablas que se creen más adelante hereden lo mismo.
alter default privileges in schema public
  grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public
  grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public
  grant all on functions to anon, authenticated, service_role;
