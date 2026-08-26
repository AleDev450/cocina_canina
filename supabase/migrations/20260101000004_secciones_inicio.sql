-- =============================================================================
-- La Cocina Canina — 04. Secciones del inicio
--
-- Testimonios y Preguntas frecuentes ya no se muestran en la portada: los
-- testimonios se retiraron del diseño y las preguntas quedaron solo como enlace
-- del pie de página. Sus interruptores en el CMS ya no controlaban nada, así
-- que se retiran de la lista para no ofrecer un control que no hace nada.
--
-- Ojo: esto NO borra el contenido. La tabla `testimonios` y la tabla
-- `preguntas_frecuentes` siguen intactas, igual que sus módulos del CMS
-- (/admin/testimonios y /admin/preguntas) y la página /preguntas-frecuentes.
-- Lo único que desaparece es la fila que las listaba como sección del inicio.
-- =============================================================================

delete from secciones_inicio where clave in ('testimonios', 'faq');

-- Renumerar para que el orden quede sin huecos.
with ordenadas as (
  select id, row_number() over (order by orden) - 1 as nuevo
    from secciones_inicio
)
update secciones_inicio s
   set orden = o.nuevo
  from ordenadas o
 where o.id = s.id
   and s.orden is distinct from o.nuevo;
