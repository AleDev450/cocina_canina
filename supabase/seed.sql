-- =============================================================================
-- La Cocina Canina — 04. Datos iniciales
--
-- ARCHIVO GENERADO por scripts/generar-seed.ts — no editar a mano.
-- Para regenerarlo: npm run seed
--
-- Es idempotente: puede ejecutarse varias veces sin duplicar filas.
-- =============================================================================

-- ------------------------------- Categorías -------------------------------
insert into categorias (slug, nombre, descripcion_corta, descripcion, icono, imagen_url, acento, orden)
values ('dureza-suave', 'Snacks de dureza suave', 'Premios ligeros y fáciles de masticar.', 'Órganos y pescado deshidratados de textura aireada. Ideales como premio frecuente, para cachorros, perros pequeños o bocas sensibles.', 'suave', '/productos/bofe-de-res.png', 'hoja', 0)
on conflict (slug) do update set
  nombre = excluded.nombre, descripcion_corta = excluded.descripcion_corta,
  descripcion = excluded.descripcion, icono = excluded.icono,
  imagen_url = excluded.imagen_url, acento = excluded.acento, orden = excluded.orden;
insert into categorias (slug, nombre, descripcion_corta, descripcion, icono, imagen_url, acento, orden)
values ('dureza-media', 'Snacks de dureza media', 'Masticación con beneficio articular.', 'El corazón del catálogo: tráqueas, orejas, patitas y esófagos. Aportan colágeno, glucosamina y condroitina mientras entretienen.', 'media', '/productos/oreja-de-cerdo.png', 'ambar', 1)
on conflict (slug) do update set
  nombre = excluded.nombre, descripcion_corta = excluded.descripcion_corta,
  descripcion = excluded.descripcion, icono = excluded.icono,
  imagen_url = excluded.imagen_url, acento = excluded.acento, orden = excluded.orden;
insert into categorias (slug, nombre, descripcion_corta, descripcion, icono, imagen_url, acento, orden)
values ('larga-duracion', 'Snacks de larga duración', 'Para masticadores incansables.', 'Cuernos, pezuñas y vértebras. Duran horas, reducen el estrés y ayudan a controlar el sarro sin aportar calorías.', 'larga', '/productos/cuerno-de-res.png', 'coral', 2)
on conflict (slug) do update set
  nombre = excluded.nombre, descripcion_corta = excluded.descripcion_corta,
  descripcion = excluded.descripcion, icono = excluded.icono,
  imagen_url = excluded.imagen_url, acento = excluded.acento, orden = excluded.orden;
insert into categorias (slug, nombre, descripcion_corta, descripcion, icono, imagen_url, acento, orden)
values ('barf', 'Alimentación BARF', 'Dieta fresca, cruda y balanceada.', 'Mezclas congeladas de carne, hueso y vísceras en tres recetas. Precio por kilogramo con descuento por volumen.', 'barf', '/productos/barf.png', 'petroleo', 3)
on conflict (slug) do update set
  nombre = excluded.nombre, descripcion_corta = excluded.descripcion_corta,
  descripcion = excluded.descripcion, icono = excluded.icono,
  imagen_url = excluded.imagen_url, acento = excluded.acento, orden = excluded.orden;
insert into categorias (slug, nombre, descripcion_corta, descripcion, icono, imagen_url, acento, orden)
values ('por-mayor', 'Productos por mayor', 'Precios especiales para negocios.', 'Presentaciones por kilogramo, docena o ciento para tiendas, distribuidores y clientes frecuentes.', 'mayor', '/empaques/snacks-bolsa-res.png', 'naranja', 4)
on conflict (slug) do update set
  nombre = excluded.nombre, descripcion_corta = excluded.descripcion_corta,
  descripcion = excluded.descripcion, icono = excluded.icono,
  imagen_url = excluded.imagen_url, acento = excluded.acento, orden = excluded.orden;

-- -------------------------------- Productos -------------------------------
insert into productos (
  slug, nombre, categoria_id, dureza, proteinas, beneficio_principal, descripcion,
  beneficios, ingredientes, minerales, tamanos, edades, imagen_url, galeria,
  etiquetas, destacado, activo, conservacion, advertencia, disponible_mayor, ventas, orden
) values (
  'bofe-de-res', 'Bofe de res',
  (select id from categorias where slug = 'dureza-suave'),
  'suave'::dureza, array['res'], 'Premio ligero y muy digestible', 'Ligero, aireado, bajo en grasa y muy alto en proteína. Perfecto como premio frecuente, ya que no aporta muchas calorías y es fácil de masticar. Muy digestible.',
  array['Bajo en grasa y en calorías', 'Muy alto en proteína', 'Textura aireada, fácil de masticar', 'Aporta colágeno natural'], array['Pulmón de res deshidratado (ingrediente único)'], 'Hierro, fósforo, zinc, cobre y selenio. Bajo en grasa y con aporte de colágeno natural.',
  array['pequeno', 'mediano', 'grande']::tamano_perro[], array['cachorro', 'adulto', 'senior']::edad_perro[],
  '/productos/bofe-de-res.png', array['/productos/bofe-de-res.png', '/empaques/snacks-bolsa-res.png'], array['mas-vendido'],
  true, true, 'Conservar en un lugar fresco y seco, dentro de su empaque bien cerrado y lejos de la luz directa del sol.', 'Supervisa siempre a tu mascota durante el consumo del producto para evitar atoramientos o posibles reacciones alérgicas.',
  true, 412, 12
)
on conflict (slug) do update set
  nombre = excluded.nombre, categoria_id = excluded.categoria_id, dureza = excluded.dureza,
  proteinas = excluded.proteinas, beneficio_principal = excluded.beneficio_principal,
  descripcion = excluded.descripcion, beneficios = excluded.beneficios,
  ingredientes = excluded.ingredientes, minerales = excluded.minerales,
  tamanos = excluded.tamanos, edades = excluded.edades, imagen_url = excluded.imagen_url,
  galeria = excluded.galeria, etiquetas = excluded.etiquetas, destacado = excluded.destacado,
  conservacion = excluded.conservacion, advertencia = excluded.advertencia,
  disponible_mayor = excluded.disponible_mayor, ventas = excluded.ventas, orden = excluded.orden;
insert into productos (
  slug, nombre, categoria_id, dureza, proteinas, beneficio_principal, descripcion,
  beneficios, ingredientes, minerales, tamanos, edades, imagen_url, galeria,
  etiquetas, destacado, activo, conservacion, advertencia, disponible_mayor, ventas, orden
) values (
  'corazon-de-cerdo', 'Corazón de cerdo',
  (select id from categorias where slug = 'dureza-suave'),
  'suave'::dureza, array['cerdo'], 'Energía y salud cardíaca', 'Órgano muscular rico en proteína y grasa saludable. Aporta CoQ10 y taurina, nutrientes clave para la salud cardíaca. Más energético y sabroso que el bofe, ideal para reforzar vitalidad.',
  array['Rico en coenzima Q10 y taurina', 'Apoya la salud del corazón', 'Muy palatable', 'Refuerza vitalidad y energía'], array['Corazón de cerdo deshidratado (ingrediente único)'], 'Hierro, fósforo, zinc, potasio, taurina, colágeno y magnesio. Rico en coenzima Q10.',
  array['pequeno', 'mediano', 'grande']::tamano_perro[], array['cachorro', 'adulto', 'senior']::edad_perro[],
  '/productos/corazon-de-cerdo.png', array['/productos/corazon-de-cerdo.png', '/empaques/snacks-bolsa-oscura.png'], array['recomendado'],
  true, true, 'Conservar en un lugar fresco y seco, dentro de su empaque bien cerrado y lejos de la luz directa del sol.', 'Supervisa siempre a tu mascota durante el consumo del producto para evitar atoramientos o posibles reacciones alérgicas.',
  true, 318, 11
)
on conflict (slug) do update set
  nombre = excluded.nombre, categoria_id = excluded.categoria_id, dureza = excluded.dureza,
  proteinas = excluded.proteinas, beneficio_principal = excluded.beneficio_principal,
  descripcion = excluded.descripcion, beneficios = excluded.beneficios,
  ingredientes = excluded.ingredientes, minerales = excluded.minerales,
  tamanos = excluded.tamanos, edades = excluded.edades, imagen_url = excluded.imagen_url,
  galeria = excluded.galeria, etiquetas = excluded.etiquetas, destacado = excluded.destacado,
  conservacion = excluded.conservacion, advertencia = excluded.advertencia,
  disponible_mayor = excluded.disponible_mayor, ventas = excluded.ventas, orden = excluded.orden;
insert into productos (
  slug, nombre, categoria_id, dureza, proteinas, beneficio_principal, descripcion,
  beneficios, ingredientes, minerales, tamanos, edades, imagen_url, galeria,
  etiquetas, destacado, activo, conservacion, advertencia, disponible_mayor, ventas, orden
) values (
  'rinones-de-res', 'Riñones de res',
  (select id from categorias where slug = 'dureza-suave'),
  'suave'::dureza, array['res'], 'Antioxidante e inmunidad', 'Ricos en vitaminas del complejo B, hierro y selenio (antioxidante potente). Órgano muy nutritivo y con beneficios para el metabolismo energético y la inmunidad.',
  array['Alto en vitaminas del complejo B', 'Selenio antioxidante', 'Apoya el metabolismo energético', 'Refuerza el sistema inmune'], array['Riñón de res deshidratado (ingrediente único)'], 'Hierro, fósforo, selenio y zinc. Muy rico en selenio: ayuda a la función tiroidea y a la inmunidad.',
  array['pequeno', 'mediano', 'grande']::tamano_perro[], array['adulto', 'senior']::edad_perro[],
  '/productos/rinones-de-res.png', array['/productos/rinones-de-res.png'], '{}',
  false, true, 'Conservar en un lugar fresco y seco, dentro de su empaque bien cerrado y lejos de la luz directa del sol.', 'Supervisa siempre a tu mascota durante el consumo del producto para evitar atoramientos o posibles reacciones alérgicas.',
  true, 176, 10
)
on conflict (slug) do update set
  nombre = excluded.nombre, categoria_id = excluded.categoria_id, dureza = excluded.dureza,
  proteinas = excluded.proteinas, beneficio_principal = excluded.beneficio_principal,
  descripcion = excluded.descripcion, beneficios = excluded.beneficios,
  ingredientes = excluded.ingredientes, minerales = excluded.minerales,
  tamanos = excluded.tamanos, edades = excluded.edades, imagen_url = excluded.imagen_url,
  galeria = excluded.galeria, etiquetas = excluded.etiquetas, destacado = excluded.destacado,
  conservacion = excluded.conservacion, advertencia = excluded.advertencia,
  disponible_mayor = excluded.disponible_mayor, ventas = excluded.ventas, orden = excluded.orden;
insert into productos (
  slug, nombre, categoria_id, dureza, proteinas, beneficio_principal, descripcion,
  beneficios, ingredientes, minerales, tamanos, edades, imagen_url, galeria,
  etiquetas, destacado, activo, conservacion, advertencia, disponible_mayor, ventas, orden
) values (
  'pejerrey', 'Pejerrey',
  (select id from categorias where slug = 'dureza-suave'),
  'suave'::dureza, array['pescado'], 'Omega 3 para piel y pelaje', 'Pescado deshidratado rico en proteína de alta calidad y bajo en grasa. Aporta omega 3, vitamina D y yodo, que benefician cerebro, piel, articulaciones y función tiroidea. Snack ligero y saludable.',
  array['Omega 3 (EPA y DHA)', 'Mejora piel, pelaje y cerebro', 'Bajo en grasa', 'Fuente natural de yodo y vitamina D'], array['Pejerrey entero deshidratado (ingrediente único)'], 'Fósforo, selenio, yodo y magnesio. Rico en ácidos grasos omega-3 (EPA y DHA): mejora piel, pelaje y cerebro.',
  array['pequeno', 'mediano', 'grande']::tamano_perro[], array['cachorro', 'adulto', 'senior']::edad_perro[],
  '/productos/pejerrey.png', array['/productos/pejerrey.png', '/empaques/pejerrey-bolsa.png'], array['mas-vendido'],
  true, true, 'Conservar en un lugar fresco y seco, dentro de su empaque bien cerrado y lejos de la luz directa del sol.', 'Supervisa siempre a tu mascota durante el consumo del producto para evitar atoramientos o posibles reacciones alérgicas.',
  true, 355, 9
)
on conflict (slug) do update set
  nombre = excluded.nombre, categoria_id = excluded.categoria_id, dureza = excluded.dureza,
  proteinas = excluded.proteinas, beneficio_principal = excluded.beneficio_principal,
  descripcion = excluded.descripcion, beneficios = excluded.beneficios,
  ingredientes = excluded.ingredientes, minerales = excluded.minerales,
  tamanos = excluded.tamanos, edades = excluded.edades, imagen_url = excluded.imagen_url,
  galeria = excluded.galeria, etiquetas = excluded.etiquetas, destacado = excluded.destacado,
  conservacion = excluded.conservacion, advertencia = excluded.advertencia,
  disponible_mayor = excluded.disponible_mayor, ventas = excluded.ventas, orden = excluded.orden;
insert into productos (
  slug, nombre, categoria_id, dureza, proteinas, beneficio_principal, descripcion,
  beneficios, ingredientes, minerales, tamanos, edades, imagen_url, galeria,
  etiquetas, destacado, activo, conservacion, advertencia, disponible_mayor, ventas, orden
) values (
  'patitas-de-pollo', 'Patitas de pollo',
  (select id from categorias where slug = 'dureza-media'),
  'media'::dureza, array['pollo'], 'Colágeno para articulaciones', 'Altas en colágeno, calcio y fósforo. Favorecen la salud articular, la elasticidad de la piel y el brillo del pelaje. Son duras, lo que las hace buenas para la masticación prolongada.',
  array['Muy alto en colágeno y elastina', 'Favorece la salud articular', 'Brillo del pelaje', 'Masticación prolongada'], array['Patas de pollo deshidratadas (ingrediente único)'], 'Calcio, fósforo y magnesio. Muy alto en colágeno y elastina, con pequeñas trazas de glucosamina.',
  array['pequeno', 'mediano', 'grande']::tamano_perro[], array['adulto', 'senior']::edad_perro[],
  '/productos/patitas-de-pollo.png', array['/productos/patitas-de-pollo.png', '/empaques/patitas-bolsa.png'], array['mas-vendido', 'recomendado'],
  true, true, 'Conservar en un lugar fresco y seco, dentro de su empaque bien cerrado y lejos de la luz directa del sol.', 'Supervisa siempre a tu mascota durante el consumo del producto para evitar atoramientos o posibles reacciones alérgicas.',
  true, 486, 8
)
on conflict (slug) do update set
  nombre = excluded.nombre, categoria_id = excluded.categoria_id, dureza = excluded.dureza,
  proteinas = excluded.proteinas, beneficio_principal = excluded.beneficio_principal,
  descripcion = excluded.descripcion, beneficios = excluded.beneficios,
  ingredientes = excluded.ingredientes, minerales = excluded.minerales,
  tamanos = excluded.tamanos, edades = excluded.edades, imagen_url = excluded.imagen_url,
  galeria = excluded.galeria, etiquetas = excluded.etiquetas, destacado = excluded.destacado,
  conservacion = excluded.conservacion, advertencia = excluded.advertencia,
  disponible_mayor = excluded.disponible_mayor, ventas = excluded.ventas, orden = excluded.orden;
insert into productos (
  slug, nombre, categoria_id, dureza, proteinas, beneficio_principal, descripcion,
  beneficios, ingredientes, minerales, tamanos, edades, imagen_url, galeria,
  etiquetas, destacado, activo, conservacion, advertencia, disponible_mayor, ventas, orden
) values (
  'traquea-de-res', 'Tráquea de res',
  (select id from categorias where slug = 'dureza-media'),
  'media'::dureza, array['res'], 'Glucosamina y condroitina naturales', 'Fuente natural de glucosamina, condroitina y colágeno. Excelente para prevenir y tratar problemas articulares. Snack blando y flexible, apto para perros de todas las edades.',
  array['Glucosamina y condroitina naturales', 'Previene problemas articulares', 'Blando y flexible', 'Apto para todas las edades'], array['Tráquea de res deshidratada (ingrediente único)'], 'Calcio y fósforo. Fuente natural de glucosamina y condroitina, excelente para articulaciones.',
  array['pequeno', 'mediano', 'grande']::tamano_perro[], array['cachorro', 'adulto', 'senior']::edad_perro[],
  '/productos/traquea-de-res.png', array['/productos/traquea-de-res.png', '/empaques/traqueas-bolsa.png'], array['mas-vendido'],
  true, true, 'Conservar en un lugar fresco y seco, dentro de su empaque bien cerrado y lejos de la luz directa del sol.', 'Supervisa siempre a tu mascota durante el consumo del producto para evitar atoramientos o posibles reacciones alérgicas.',
  true, 402, 7
)
on conflict (slug) do update set
  nombre = excluded.nombre, categoria_id = excluded.categoria_id, dureza = excluded.dureza,
  proteinas = excluded.proteinas, beneficio_principal = excluded.beneficio_principal,
  descripcion = excluded.descripcion, beneficios = excluded.beneficios,
  ingredientes = excluded.ingredientes, minerales = excluded.minerales,
  tamanos = excluded.tamanos, edades = excluded.edades, imagen_url = excluded.imagen_url,
  galeria = excluded.galeria, etiquetas = excluded.etiquetas, destacado = excluded.destacado,
  conservacion = excluded.conservacion, advertencia = excluded.advertencia,
  disponible_mayor = excluded.disponible_mayor, ventas = excluded.ventas, orden = excluded.orden;
insert into productos (
  slug, nombre, categoria_id, dureza, proteinas, beneficio_principal, descripcion,
  beneficios, ingredientes, minerales, tamanos, edades, imagen_url, galeria,
  etiquetas, destacado, activo, conservacion, advertencia, disponible_mayor, ventas, orden
) values (
  'traquea-de-res-xl', 'Tráquea de res XL',
  (select id from categorias where slug = 'dureza-media'),
  'media'::dureza, array['res'], 'Versión grande para masticadores', 'La misma fuente natural de glucosamina, condroitina y colágeno de la tráquea de res, en tamaño extra grande. Blanda y flexible, entretiene por más tiempo a perros medianos y grandes.',
  array['Tamaño XL, dura más', 'Glucosamina y condroitina naturales', 'Ideal para perros medianos y grandes', 'Blanda y flexible'], array['Tráquea de res deshidratada (ingrediente único)'], 'Calcio y fósforo. Fuente natural de glucosamina y condroitina, excelente para articulaciones.',
  array['mediano', 'grande']::tamano_perro[], array['adulto', 'senior']::edad_perro[],
  '/productos/traquea-de-res-xl.png', array['/productos/traquea-de-res-xl.png'], array['nuevo'],
  false, true, 'Conservar en un lugar fresco y seco, dentro de su empaque bien cerrado y lejos de la luz directa del sol.', 'Supervisa siempre a tu mascota durante el consumo del producto para evitar atoramientos o posibles reacciones alérgicas.',
  false, 88, 20
)
on conflict (slug) do update set
  nombre = excluded.nombre, categoria_id = excluded.categoria_id, dureza = excluded.dureza,
  proteinas = excluded.proteinas, beneficio_principal = excluded.beneficio_principal,
  descripcion = excluded.descripcion, beneficios = excluded.beneficios,
  ingredientes = excluded.ingredientes, minerales = excluded.minerales,
  tamanos = excluded.tamanos, edades = excluded.edades, imagen_url = excluded.imagen_url,
  galeria = excluded.galeria, etiquetas = excluded.etiquetas, destacado = excluded.destacado,
  conservacion = excluded.conservacion, advertencia = excluded.advertencia,
  disponible_mayor = excluded.disponible_mayor, ventas = excluded.ventas, orden = excluded.orden;
insert into productos (
  slug, nombre, categoria_id, dureza, proteinas, beneficio_principal, descripcion,
  beneficios, ingredientes, minerales, tamanos, edades, imagen_url, galeria,
  etiquetas, destacado, activo, conservacion, advertencia, disponible_mayor, ventas, orden
) values (
  'oreja-de-cerdo', 'Oreja de cerdo',
  (select id from categorias where slug = 'dureza-media'),
  'media'::dureza, array['cerdo'], 'El clásico más palatable', 'Snack muy palatable y duradero, con alto contenido de grasa y colágeno. Apoya la salud de piel, pelo y articulaciones. Excelente para perros activos, aunque debe moderarse en perros con sobrepeso.',
  array['Altamente palatable', 'Alto en colágeno y elastina', 'Apoya piel, pelo y articulaciones', 'Duradero'], array['Oreja de cerdo deshidratada (ingrediente único)'], 'Fósforo, zinc y sodio. Alta en colágeno y elastina, con algo de grasa natural (energética).',
  array['mediano', 'grande']::tamano_perro[], array['adulto']::edad_perro[],
  '/productos/oreja-de-cerdo.png', array['/productos/oreja-de-cerdo.png', '/empaques/oreja-cerdo-detalle.png', '/empaques/orejas-bolsa.png'], array['mas-vendido'],
  true, true, 'Conservar en un lugar fresco y seco, dentro de su empaque bien cerrado y lejos de la luz directa del sol.', 'Supervisa siempre a tu mascota durante el consumo del producto para evitar atoramientos o posibles reacciones alérgicas.',
  true, 521, 6
)
on conflict (slug) do update set
  nombre = excluded.nombre, categoria_id = excluded.categoria_id, dureza = excluded.dureza,
  proteinas = excluded.proteinas, beneficio_principal = excluded.beneficio_principal,
  descripcion = excluded.descripcion, beneficios = excluded.beneficios,
  ingredientes = excluded.ingredientes, minerales = excluded.minerales,
  tamanos = excluded.tamanos, edades = excluded.edades, imagen_url = excluded.imagen_url,
  galeria = excluded.galeria, etiquetas = excluded.etiquetas, destacado = excluded.destacado,
  conservacion = excluded.conservacion, advertencia = excluded.advertencia,
  disponible_mayor = excluded.disponible_mayor, ventas = excluded.ventas, orden = excluded.orden;
insert into productos (
  slug, nombre, categoria_id, dureza, proteinas, beneficio_principal, descripcion,
  beneficios, ingredientes, minerales, tamanos, edades, imagen_url, galeria,
  etiquetas, destacado, activo, conservacion, advertencia, disponible_mayor, ventas, orden
) values (
  'oreja-de-res-con-pelitos', 'Oreja de res con pelitos',
  (select id from categorias where slug = 'dureza-media'),
  'media'::dureza, array['res'], 'Fibra natural que limpia el intestino', 'Snack de larga masticación que conserva el pelo natural de la oreja. Esa fibra actúa como cepillo natural: colabora con la salud intestinal y ayuda a arrastrar el sarro durante la masticación. Rico en proteína y colágeno.',
  array['Fibra natural del pelo', 'Colabora con la salud intestinal', 'Ayuda a la limpieza dental', 'Cuatro tallas disponibles'], array['Oreja de res con pelo deshidratada (ingrediente único)'], 'Fósforo, zinc, magnesio y fibra natural del pelo. Colabora con la salud intestinal y dental.',
  array['pequeno', 'mediano', 'grande']::tamano_perro[], array['adulto', 'senior']::edad_perro[],
  '/productos/oreja-de-res-con-pelitos.png', array['/productos/oreja-de-res-con-pelitos.png', '/empaques/orejas-res-detalle.png'], array['recomendado', 'stock-limitado'],
  true, true, 'Conservar en un lugar fresco y seco, dentro de su empaque bien cerrado y lejos de la luz directa del sol.', 'Supervisa siempre a tu mascota durante el consumo del producto para evitar atoramientos o posibles reacciones alérgicas.',
  true, 264, 5
)
on conflict (slug) do update set
  nombre = excluded.nombre, categoria_id = excluded.categoria_id, dureza = excluded.dureza,
  proteinas = excluded.proteinas, beneficio_principal = excluded.beneficio_principal,
  descripcion = excluded.descripcion, beneficios = excluded.beneficios,
  ingredientes = excluded.ingredientes, minerales = excluded.minerales,
  tamanos = excluded.tamanos, edades = excluded.edades, imagen_url = excluded.imagen_url,
  galeria = excluded.galeria, etiquetas = excluded.etiquetas, destacado = excluded.destacado,
  conservacion = excluded.conservacion, advertencia = excluded.advertencia,
  disponible_mayor = excluded.disponible_mayor, ventas = excluded.ventas, orden = excluded.orden;
insert into productos (
  slug, nombre, categoria_id, dureza, proteinas, beneficio_principal, descripcion,
  beneficios, ingredientes, minerales, tamanos, edades, imagen_url, galeria,
  etiquetas, destacado, activo, conservacion, advertencia, disponible_mayor, ventas, orden
) values (
  'traquea-de-cordero', 'Tráquea de cordero',
  (select id from categorias where slug = 'dureza-media'),
  'media'::dureza, array['cordero'], 'Suave, para cachorros y bocas sensibles', 'Similares a la tráquea de res, pero más suaves y fáciles de masticar. Ideales para perros pequeños, cachorros o con dientes sensibles. Rica en glucosamina, condroitina y colágeno para articulaciones.',
  array['Más suave que la tráquea de res', 'Ideal para cachorros', 'Menor contenido de grasa', 'Glucosamina y condroitina'], array['Tráquea de cordero deshidratada (ingrediente único)'], 'Calcio, fósforo, glucosamina y condroitina. Colabora en la salud articular con menor grasa que la de res.',
  array['pequeno', 'mediano']::tamano_perro[], array['cachorro', 'adulto', 'senior']::edad_perro[],
  '/productos/traquea-de-cordero.png', array['/productos/traquea-de-cordero.png', '/empaques/traqueas-bolsa.png'], array['recomendado'],
  false, true, 'Conservar en un lugar fresco y seco, dentro de su empaque bien cerrado y lejos de la luz directa del sol.', 'Supervisa siempre a tu mascota durante el consumo del producto para evitar atoramientos o posibles reacciones alérgicas.',
  true, 198, 4
)
on conflict (slug) do update set
  nombre = excluded.nombre, categoria_id = excluded.categoria_id, dureza = excluded.dureza,
  proteinas = excluded.proteinas, beneficio_principal = excluded.beneficio_principal,
  descripcion = excluded.descripcion, beneficios = excluded.beneficios,
  ingredientes = excluded.ingredientes, minerales = excluded.minerales,
  tamanos = excluded.tamanos, edades = excluded.edades, imagen_url = excluded.imagen_url,
  galeria = excluded.galeria, etiquetas = excluded.etiquetas, destacado = excluded.destacado,
  conservacion = excluded.conservacion, advertencia = excluded.advertencia,
  disponible_mayor = excluded.disponible_mayor, ventas = excluded.ventas, orden = excluded.orden;
insert into productos (
  slug, nombre, categoria_id, dureza, proteinas, beneficio_principal, descripcion,
  beneficios, ingredientes, minerales, tamanos, edades, imagen_url, galeria,
  etiquetas, destacado, activo, conservacion, advertencia, disponible_mayor, ventas, orden
) values (
  'colita-de-res', 'Colita de res',
  (select id from categorias where slug = 'dureza-media'),
  'media'::dureza, array['res'], 'Entretiene y limpia los dientes', 'Fuentes naturales de colágeno y minerales. Ayudan a fortalecer huesos y articulaciones. Al ser duras, también sirven para higiene dental y para entretener por largos periodos.',
  array['Fortalece huesos y articulaciones', 'Higiene dental', 'Entretiene por largo tiempo', 'Colágeno y condroitina'], array['Cola de res deshidratada (ingrediente único)'], 'Calcio, fósforo, colágeno y condroitina. Ideal para articulaciones y limpieza dental.',
  array['mediano', 'grande']::tamano_perro[], array['adulto']::edad_perro[],
  '/productos/colita-de-res.png', array['/productos/colita-de-res.png'], '{}',
  false, true, 'Conservar en un lugar fresco y seco, dentro de su empaque bien cerrado y lejos de la luz directa del sol.', 'Supervisa siempre a tu mascota durante el consumo del producto para evitar atoramientos o posibles reacciones alérgicas.',
  true, 289, 3
)
on conflict (slug) do update set
  nombre = excluded.nombre, categoria_id = excluded.categoria_id, dureza = excluded.dureza,
  proteinas = excluded.proteinas, beneficio_principal = excluded.beneficio_principal,
  descripcion = excluded.descripcion, beneficios = excluded.beneficios,
  ingredientes = excluded.ingredientes, minerales = excluded.minerales,
  tamanos = excluded.tamanos, edades = excluded.edades, imagen_url = excluded.imagen_url,
  galeria = excluded.galeria, etiquetas = excluded.etiquetas, destacado = excluded.destacado,
  conservacion = excluded.conservacion, advertencia = excluded.advertencia,
  disponible_mayor = excluded.disponible_mayor, ventas = excluded.ventas, orden = excluded.orden;
insert into productos (
  slug, nombre, categoria_id, dureza, proteinas, beneficio_principal, descripcion,
  beneficios, ingredientes, minerales, tamanos, edades, imagen_url, galeria,
  etiquetas, destacado, activo, conservacion, advertencia, disponible_mayor, ventas, orden
) values (
  'aletas-de-toyo', 'Aletas de toyo',
  (select id from categorias where slug = 'dureza-media'),
  'media'::dureza, array['pescado'], 'Snack marino crujiente', 'Snack marino rico en omega 3 que favorece la piel, pelaje y cerebro. Crujiente y altamente palatable.',
  array['Rico en omega 3 (EPA/DHA)', 'Colágeno marino', 'Crujiente y palatable', 'Tres tallas disponibles'], array['Aleta de tiburón toyo deshidratada (ingrediente único)'], 'Fósforo, calcio y selenio. Rica en omega-3 (EPA/DHA) y colágeno: ayuda a piel, pelaje y función cerebral.',
  array['pequeno', 'mediano', 'grande']::tamano_perro[], array['adulto', 'senior']::edad_perro[],
  '/productos/aletas-de-toyo.png', array['/productos/aletas-de-toyo.png'], array['nuevo'],
  false, true, 'Conservar en un lugar fresco y seco, dentro de su empaque bien cerrado y lejos de la luz directa del sol.', 'Supervisa siempre a tu mascota durante el consumo del producto para evitar atoramientos o posibles reacciones alérgicas.',
  false, 121, 19
)
on conflict (slug) do update set
  nombre = excluded.nombre, categoria_id = excluded.categoria_id, dureza = excluded.dureza,
  proteinas = excluded.proteinas, beneficio_principal = excluded.beneficio_principal,
  descripcion = excluded.descripcion, beneficios = excluded.beneficios,
  ingredientes = excluded.ingredientes, minerales = excluded.minerales,
  tamanos = excluded.tamanos, edades = excluded.edades, imagen_url = excluded.imagen_url,
  galeria = excluded.galeria, etiquetas = excluded.etiquetas, destacado = excluded.destacado,
  conservacion = excluded.conservacion, advertencia = excluded.advertencia,
  disponible_mayor = excluded.disponible_mayor, ventas = excluded.ventas, orden = excluded.orden;
insert into productos (
  slug, nombre, categoria_id, dureza, proteinas, beneficio_principal, descripcion,
  beneficios, ingredientes, minerales, tamanos, edades, imagen_url, galeria,
  etiquetas, destacado, activo, conservacion, advertencia, disponible_mayor, ventas, orden
) values (
  'garganta-de-res', 'Garganta de res',
  (select id from categorias where slug = 'dureza-media'),
  'media'::dureza, array['res'], 'Cartílago para articulaciones', 'Snack cartilaginoso ideal para articulaciones y limpieza dental, con textura firme y natural.',
  array['Textura firme y natural', 'Colágeno y elastina', 'Trazas de glucosamina', 'Limpieza dental'], array['Garganta de res deshidratada (ingrediente único)'], 'Calcio, fósforo y zinc. Fuente natural de colágeno, elastina y trazas de glucosamina, excelente para articulaciones.',
  array['mediano', 'grande']::tamano_perro[], array['adulto']::edad_perro[],
  '/productos/garganta-de-res.png', array['/productos/garganta-de-res.png'], '{}',
  false, true, 'Conservar en un lugar fresco y seco, dentro de su empaque bien cerrado y lejos de la luz directa del sol.', 'Supervisa siempre a tu mascota durante el consumo del producto para evitar atoramientos o posibles reacciones alérgicas.',
  false, 96, 2
)
on conflict (slug) do update set
  nombre = excluded.nombre, categoria_id = excluded.categoria_id, dureza = excluded.dureza,
  proteinas = excluded.proteinas, beneficio_principal = excluded.beneficio_principal,
  descripcion = excluded.descripcion, beneficios = excluded.beneficios,
  ingredientes = excluded.ingredientes, minerales = excluded.minerales,
  tamanos = excluded.tamanos, edades = excluded.edades, imagen_url = excluded.imagen_url,
  galeria = excluded.galeria, etiquetas = excluded.etiquetas, destacado = excluded.destacado,
  conservacion = excluded.conservacion, advertencia = excluded.advertencia,
  disponible_mayor = excluded.disponible_mayor, ventas = excluded.ventas, orden = excluded.orden;
insert into productos (
  slug, nombre, categoria_id, dureza, proteinas, beneficio_principal, descripcion,
  beneficios, ingredientes, minerales, tamanos, edades, imagen_url, galeria,
  etiquetas, destacado, activo, conservacion, advertencia, disponible_mayor, ventas, orden
) values (
  'garganta-de-cerdo', 'Garganta de cerdo',
  (select id from categorias where slug = 'dureza-media'),
  'media'::dureza, array['cerdo'], 'Sabor intenso para perros activos', 'Opción más sabrosa y energética que la garganta de res, perfecta para perros activos y amantes de los snacks más intensos.',
  array['Sabor intenso', 'Aporta energía', 'Colágeno y elastina', 'Soporte a tejidos'], array['Garganta de cerdo deshidratada (ingrediente único)'], 'Fósforo y zinc. Rica en colágeno y elastina, aporta energía y soporte a tejidos (más grasa).',
  array['mediano', 'grande']::tamano_perro[], array['adulto']::edad_perro[],
  '/productos/garganta-de-cerdo.png', array['/productos/garganta-de-cerdo.png'], '{}',
  false, true, 'Conservar en un lugar fresco y seco, dentro de su empaque bien cerrado y lejos de la luz directa del sol.', 'Supervisa siempre a tu mascota durante el consumo del producto para evitar atoramientos o posibles reacciones alérgicas.',
  false, 143, 1
)
on conflict (slug) do update set
  nombre = excluded.nombre, categoria_id = excluded.categoria_id, dureza = excluded.dureza,
  proteinas = excluded.proteinas, beneficio_principal = excluded.beneficio_principal,
  descripcion = excluded.descripcion, beneficios = excluded.beneficios,
  ingredientes = excluded.ingredientes, minerales = excluded.minerales,
  tamanos = excluded.tamanos, edades = excluded.edades, imagen_url = excluded.imagen_url,
  galeria = excluded.galeria, etiquetas = excluded.etiquetas, destacado = excluded.destacado,
  conservacion = excluded.conservacion, advertencia = excluded.advertencia,
  disponible_mayor = excluded.disponible_mayor, ventas = excluded.ventas, orden = excluded.orden;
insert into productos (
  slug, nombre, categoria_id, dureza, proteinas, beneficio_principal, descripcion,
  beneficios, ingredientes, minerales, tamanos, edades, imagen_url, galeria,
  etiquetas, destacado, activo, conservacion, advertencia, disponible_mayor, ventas, orden
) values (
  'esofago-de-res', 'Esófago de res',
  (select id from categorias where slug = 'dureza-media'),
  'media'::dureza, array['res'], 'Flexible y fácil de masticar', 'Snack flexible y fácil de masticar, ideal para todas las edades. Aporta proteína y entretenimiento.',
  array['Flexible, fácil de masticar', 'Apto para todas las edades', 'Rico en colágeno y elastina', 'Favorece piel y músculos'], array['Esófago de res deshidratado (ingrediente único)'], 'Fósforo, hierro y zinc. Rico en colágeno y elastina, favorece piel, músculos y digestión.',
  array['pequeno', 'mediano', 'grande']::tamano_perro[], array['cachorro', 'adulto', 'senior']::edad_perro[],
  '/productos/esofago-de-res.png', array['/productos/esofago-de-res.png'], '{}',
  false, true, 'Conservar en un lugar fresco y seco, dentro de su empaque bien cerrado y lejos de la luz directa del sol.', 'Supervisa siempre a tu mascota durante el consumo del producto para evitar atoramientos o posibles reacciones alérgicas.',
  false, 167, 13
)
on conflict (slug) do update set
  nombre = excluded.nombre, categoria_id = excluded.categoria_id, dureza = excluded.dureza,
  proteinas = excluded.proteinas, beneficio_principal = excluded.beneficio_principal,
  descripcion = excluded.descripcion, beneficios = excluded.beneficios,
  ingredientes = excluded.ingredientes, minerales = excluded.minerales,
  tamanos = excluded.tamanos, edades = excluded.edades, imagen_url = excluded.imagen_url,
  galeria = excluded.galeria, etiquetas = excluded.etiquetas, destacado = excluded.destacado,
  conservacion = excluded.conservacion, advertencia = excluded.advertencia,
  disponible_mayor = excluded.disponible_mayor, ventas = excluded.ventas, orden = excluded.orden;
insert into productos (
  slug, nombre, categoria_id, dureza, proteinas, beneficio_principal, descripcion,
  beneficios, ingredientes, minerales, tamanos, edades, imagen_url, galeria,
  etiquetas, destacado, activo, conservacion, advertencia, disponible_mayor, ventas, orden
) values (
  'esofago-de-cordero', 'Esófago de cordero',
  (select id from categorias where slug = 'dureza-media'),
  'media'::dureza, array['cordero'], 'Digestible para perros sensibles', 'Alternativa más suave y digestible que el esófago de res, ideal para perros pequeños o sensibles.',
  array['Más suave y digestible', 'Ideal para perros pequeños', 'Proteína alternativa (cordero)', 'Colágeno y elastina'], array['Esófago de cordero deshidratado (ingrediente único)'], 'Fósforo, hierro y zinc. Fuente de colágeno y elastina, más suave y digestible.',
  array['pequeno', 'mediano']::tamano_perro[], array['cachorro', 'adulto', 'senior']::edad_perro[],
  '/productos/esofago-de-cordero.png', array['/productos/esofago-de-cordero.png'], array['recomendado'],
  false, true, 'Conservar en un lugar fresco y seco, dentro de su empaque bien cerrado y lejos de la luz directa del sol.', 'Supervisa siempre a tu mascota durante el consumo del producto para evitar atoramientos o posibles reacciones alérgicas.',
  false, 134, 14
)
on conflict (slug) do update set
  nombre = excluded.nombre, categoria_id = excluded.categoria_id, dureza = excluded.dureza,
  proteinas = excluded.proteinas, beneficio_principal = excluded.beneficio_principal,
  descripcion = excluded.descripcion, beneficios = excluded.beneficios,
  ingredientes = excluded.ingredientes, minerales = excluded.minerales,
  tamanos = excluded.tamanos, edades = excluded.edades, imagen_url = excluded.imagen_url,
  galeria = excluded.galeria, etiquetas = excluded.etiquetas, destacado = excluded.destacado,
  conservacion = excluded.conservacion, advertencia = excluded.advertencia,
  disponible_mayor = excluded.disponible_mayor, ventas = excluded.ventas, orden = excluded.orden;
insert into productos (
  slug, nombre, categoria_id, dureza, proteinas, beneficio_principal, descripcion,
  beneficios, ingredientes, minerales, tamanos, edades, imagen_url, galeria,
  etiquetas, destacado, activo, conservacion, advertencia, disponible_mayor, ventas, orden
) values (
  'trio-pork-chew', 'Trío Pork Chew',
  (select id from categorias where slug = 'dureza-media'),
  'media'::dureza, array['cerdo'], 'Tres texturas en un solo snack', 'Mix funcional con variedad de texturas que estimula la masticación. Apoya la movilidad, salud articular y limpieza dental, ideal como snack completo.',
  array['Variedad de texturas', 'Estimula la masticación', 'Colágeno, glucosamina y condroitina', 'Snack completo'], array['Mix de piezas de cerdo deshidratadas'], 'Fósforo, calcio y zinc. Fuente natural de colágeno, glucosamina y condroitina, excelente para articulaciones.',
  array['mediano', 'grande']::tamano_perro[], array['adulto']::edad_perro[],
  '/productos/trio-pork-chew.png', array['/productos/trio-pork-chew.png'], array['nuevo', 'recomendado'],
  true, true, 'Conservar en un lugar fresco y seco, dentro de su empaque bien cerrado y lejos de la luz directa del sol.', 'Supervisa siempre a tu mascota durante el consumo del producto para evitar atoramientos o posibles reacciones alérgicas.',
  false, 152, 21
)
on conflict (slug) do update set
  nombre = excluded.nombre, categoria_id = excluded.categoria_id, dureza = excluded.dureza,
  proteinas = excluded.proteinas, beneficio_principal = excluded.beneficio_principal,
  descripcion = excluded.descripcion, beneficios = excluded.beneficios,
  ingredientes = excluded.ingredientes, minerales = excluded.minerales,
  tamanos = excluded.tamanos, edades = excluded.edades, imagen_url = excluded.imagen_url,
  galeria = excluded.galeria, etiquetas = excluded.etiquetas, destacado = excluded.destacado,
  conservacion = excluded.conservacion, advertencia = excluded.advertencia,
  disponible_mayor = excluded.disponible_mayor, ventas = excluded.ventas, orden = excluded.orden;
insert into productos (
  slug, nombre, categoria_id, dureza, proteinas, beneficio_principal, descripcion,
  beneficios, ingredientes, minerales, tamanos, edades, imagen_url, galeria,
  etiquetas, destacado, activo, conservacion, advertencia, disponible_mayor, ventas, orden
) values (
  'oreja-de-cabra', 'Oreja de cabra',
  (select id from categorias where slug = 'dureza-media'),
  'media'::dureza, array['cabra'], 'Magra, para control de peso', 'Snack magro, de buena duración y bajo en grasa comparado con otras orejas. Ideal para perros que necesitan controlar su peso sin dejar de disfrutar la masticación.',
  array['Baja en grasa', 'Ideal para control de peso', 'Alta en colágeno', 'Buena duración'], array['Oreja de cabra deshidratada (ingrediente único)'], 'Fósforo, zinc y magnesio. Alto en colágeno, ayuda a la salud dental y de la piel.',
  array['pequeno', 'mediano', 'grande']::tamano_perro[], array['adulto', 'senior']::edad_perro[],
  '/productos/oreja-de-cabra.png', array['/productos/oreja-de-cabra.png'], array['recomendado'],
  false, true, 'Conservar en un lugar fresco y seco, dentro de su empaque bien cerrado y lejos de la luz directa del sol.', 'Supervisa siempre a tu mascota durante el consumo del producto para evitar atoramientos o posibles reacciones alérgicas.',
  false, 231, 15
)
on conflict (slug) do update set
  nombre = excluded.nombre, categoria_id = excluded.categoria_id, dureza = excluded.dureza,
  proteinas = excluded.proteinas, beneficio_principal = excluded.beneficio_principal,
  descripcion = excluded.descripcion, beneficios = excluded.beneficios,
  ingredientes = excluded.ingredientes, minerales = excluded.minerales,
  tamanos = excluded.tamanos, edades = excluded.edades, imagen_url = excluded.imagen_url,
  galeria = excluded.galeria, etiquetas = excluded.etiquetas, destacado = excluded.destacado,
  conservacion = excluded.conservacion, advertencia = excluded.advertencia,
  disponible_mayor = excluded.disponible_mayor, ventas = excluded.ventas, orden = excluded.orden;
insert into productos (
  slug, nombre, categoria_id, dureza, proteinas, beneficio_principal, descripcion,
  beneficios, ingredientes, minerales, tamanos, edades, imagen_url, galeria,
  etiquetas, destacado, activo, conservacion, advertencia, disponible_mayor, ventas, orden
) values (
  'power-stick-bovino', 'Power Stick Bovino',
  (select id from categorias where slug = 'dureza-media'),
  'media'::dureza, array['res'], 'Premium de larga duración', 'Snack premium de larga duración, altamente atractivo para los perros. Ideal para reducir ansiedad, promover la masticación y mantenerlos entretenidos por más tiempo.',
  array['Reduce la ansiedad', 'Proteína concentrada', 'Masticación prolongada', 'Altamente atractivo'], array['Músculo bovino deshidratado (ingrediente único)'], 'Zinc y fósforo. Proteína concentrada con colágeno, aporta energía y favorece la masticación prolongada.',
  array['mediano', 'grande']::tamano_perro[], array['adulto']::edad_perro[],
  '/productos/power-stick-bovino.png', array['/productos/power-stick-bovino.png', '/empaques/power-stick-bolsa.png'], array['mas-vendido'],
  true, true, 'Conservar en un lugar fresco y seco, dentro de su empaque bien cerrado y lejos de la luz directa del sol.', 'Supervisa siempre a tu mascota durante el consumo del producto para evitar atoramientos o posibles reacciones alérgicas.',
  false, 374, 16
)
on conflict (slug) do update set
  nombre = excluded.nombre, categoria_id = excluded.categoria_id, dureza = excluded.dureza,
  proteinas = excluded.proteinas, beneficio_principal = excluded.beneficio_principal,
  descripcion = excluded.descripcion, beneficios = excluded.beneficios,
  ingredientes = excluded.ingredientes, minerales = excluded.minerales,
  tamanos = excluded.tamanos, edades = excluded.edades, imagen_url = excluded.imagen_url,
  galeria = excluded.galeria, etiquetas = excluded.etiquetas, destacado = excluded.destacado,
  conservacion = excluded.conservacion, advertencia = excluded.advertencia,
  disponible_mayor = excluded.disponible_mayor, ventas = excluded.ventas, orden = excluded.orden;
insert into productos (
  slug, nombre, categoria_id, dureza, proteinas, beneficio_principal, descripcion,
  beneficios, ingredientes, minerales, tamanos, edades, imagen_url, galeria,
  etiquetas, destacado, activo, conservacion, advertencia, disponible_mayor, ventas, orden
) values (
  'cuerno-de-res', 'Cuerno de res',
  (select id from categorias where slug = 'larga-duracion'),
  'larga-duracion'::dureza, array['res'], 'Súper duro y duradero', 'Súper duros y duraderos. Ricos en calcio y fósforo, ayudan al mantenimiento óseo y a la limpieza dental. Ideales para perros que necesitan snacks de larga duración.',
  array['Extremadamente duradero', 'Mantenimiento óseo', 'Limpieza dental', 'Sin aporte calórico relevante'], array['Cuerno de res natural (ingrediente único)'], 'Calcio, fósforo y queratina. Extremadamente duros, sin valor digestible.',
  array['grande']::tamano_perro[], array['adulto']::edad_perro[],
  '/productos/cuerno-de-res.png', array['/productos/cuerno-de-res.png', '/empaques/cuerno-bolsa.png'], array['recomendado'],
  true, true, 'Conservar en un lugar fresco y seco, dentro de su empaque bien cerrado y lejos de la luz directa del sol.', 'Producto extremadamente duro: no recomendado para cachorros, perros con problemas dentales o mordida delicada. Supervisa siempre a tu mascota durante el consumo del producto para evitar atoramientos o posibles reacciones alérgicas.',
  true, 208, 17
)
on conflict (slug) do update set
  nombre = excluded.nombre, categoria_id = excluded.categoria_id, dureza = excluded.dureza,
  proteinas = excluded.proteinas, beneficio_principal = excluded.beneficio_principal,
  descripcion = excluded.descripcion, beneficios = excluded.beneficios,
  ingredientes = excluded.ingredientes, minerales = excluded.minerales,
  tamanos = excluded.tamanos, edades = excluded.edades, imagen_url = excluded.imagen_url,
  galeria = excluded.galeria, etiquetas = excluded.etiquetas, destacado = excluded.destacado,
  conservacion = excluded.conservacion, advertencia = excluded.advertencia,
  disponible_mayor = excluded.disponible_mayor, ventas = excluded.ventas, orden = excluded.orden;
insert into productos (
  slug, nombre, categoria_id, dureza, proteinas, beneficio_principal, descripcion,
  beneficios, ingredientes, minerales, tamanos, edades, imagen_url, galeria,
  etiquetas, destacado, activo, conservacion, advertencia, disponible_mayor, ventas, orden
) values (
  'pezuna-de-res', 'Pezuña de res',
  (select id from categorias where slug = 'larga-duracion'),
  'larga-duracion'::dureza, array['res'], 'Entretenimiento prolongado', 'Muy resistentes, con alto contenido de colágeno y calcio. Favorecen articulaciones, huesos y encías. Útiles como entretenimiento prolongado y para mantener la salud dental.',
  array['Muy resistente', 'Favorece articulaciones y encías', 'Entretenimiento prolongado', 'Limpieza dental'], array['Pezuña de res natural (ingrediente único)'], 'Calcio, fósforo y queratina. Ayuda en limpieza dental y entretención, sin aporte nutricional.',
  array['mediano', 'grande']::tamano_perro[], array['adulto']::edad_perro[],
  '/productos/pezuna-de-res.png', array['/productos/pezuna-de-res.png'], '{}',
  false, true, 'Conservar en un lugar fresco y seco, dentro de su empaque bien cerrado y lejos de la luz directa del sol.', 'Producto muy duro: retíralo cuando quede en trozos pequeños. Supervisa siempre a tu mascota durante el consumo del producto para evitar atoramientos o posibles reacciones alérgicas.',
  true, 186, 18
)
on conflict (slug) do update set
  nombre = excluded.nombre, categoria_id = excluded.categoria_id, dureza = excluded.dureza,
  proteinas = excluded.proteinas, beneficio_principal = excluded.beneficio_principal,
  descripcion = excluded.descripcion, beneficios = excluded.beneficios,
  ingredientes = excluded.ingredientes, minerales = excluded.minerales,
  tamanos = excluded.tamanos, edades = excluded.edades, imagen_url = excluded.imagen_url,
  galeria = excluded.galeria, etiquetas = excluded.etiquetas, destacado = excluded.destacado,
  conservacion = excluded.conservacion, advertencia = excluded.advertencia,
  disponible_mayor = excluded.disponible_mayor, ventas = excluded.ventas, orden = excluded.orden;
insert into productos (
  slug, nombre, categoria_id, dureza, proteinas, beneficio_principal, descripcion,
  beneficios, ingredientes, minerales, tamanos, edades, imagen_url, galeria,
  etiquetas, destacado, activo, conservacion, advertencia, disponible_mayor, ventas, orden
) values (
  'nariz-de-res', 'Nariz de res',
  (select id from categorias where slug = 'larga-duracion'),
  'larga-duracion'::dureza, array['res'], 'Cartílago masticable y muy atractivo', 'Textura cartilaginosa y masticable, muy atractiva para perros. Rica en colágeno y minerales, favorece articulaciones y elasticidad de piel.',
  array['Textura cartilaginosa', 'Muy atractiva', 'Fortalece piel y encías', 'Colágeno y queratina'], array['Nariz de res deshidratada (ingrediente único)'], 'Fósforo, zinc, colágeno y queratina. Fortalece piel y encías.',
  array['mediano', 'grande']::tamano_perro[], array['adulto']::edad_perro[],
  '/productos/nariz-de-res.png', array['/productos/nariz-de-res.png'], '{}',
  false, true, 'Conservar en un lugar fresco y seco, dentro de su empaque bien cerrado y lejos de la luz directa del sol.', 'Supervisa siempre a tu mascota durante el consumo del producto para evitar atoramientos o posibles reacciones alérgicas.',
  false, 112, 22
)
on conflict (slug) do update set
  nombre = excluded.nombre, categoria_id = excluded.categoria_id, dureza = excluded.dureza,
  proteinas = excluded.proteinas, beneficio_principal = excluded.beneficio_principal,
  descripcion = excluded.descripcion, beneficios = excluded.beneficios,
  ingredientes = excluded.ingredientes, minerales = excluded.minerales,
  tamanos = excluded.tamanos, edades = excluded.edades, imagen_url = excluded.imagen_url,
  galeria = excluded.galeria, etiquetas = excluded.etiquetas, destacado = excluded.destacado,
  conservacion = excluded.conservacion, advertencia = excluded.advertencia,
  disponible_mayor = excluded.disponible_mayor, ventas = excluded.ventas, orden = excluded.orden;
insert into productos (
  slug, nombre, categoria_id, dureza, proteinas, beneficio_principal, descripcion,
  beneficios, ingredientes, minerales, tamanos, edades, imagen_url, galeria,
  etiquetas, destacado, activo, conservacion, advertencia, disponible_mayor, ventas, orden
) values (
  'cuerno-de-cabra', 'Cuerno de cabra',
  (select id from categorias where slug = 'larga-duracion'),
  'larga-duracion'::dureza, array['cabra'], 'Para mordidas fuertes, sin calorías', 'Masticable natural extremadamente resistente, perfecto para perros con mordida fuerte. Ayuda a reducir sarro y estrés sin aportar calorías ni grasas.',
  array['Extremadamente resistente', 'Reduce sarro y estrés', 'Sin calorías ni grasas', 'Ideal para mordida fuerte'], array['Cuerno de cabra natural (ingrediente único)'], 'Calcio y fósforo. Rico en queratina no digerible, ideal para limpieza dental sin aporte calórico.',
  array['mediano', 'grande']::tamano_perro[], array['adulto']::edad_perro[],
  '/productos/cuerno-de-cabra.png', array['/productos/cuerno-de-cabra.png', '/empaques/cuerno-bolsa.png'], array['stock-limitado'],
  false, true, 'Conservar en un lugar fresco y seco, dentro de su empaque bien cerrado y lejos de la luz directa del sol.', 'Producto extremadamente duro: no recomendado para cachorros ni perros con problemas dentales. Supervisa siempre a tu mascota durante el consumo del producto para evitar atoramientos o posibles reacciones alérgicas.',
  false, 97, 23
)
on conflict (slug) do update set
  nombre = excluded.nombre, categoria_id = excluded.categoria_id, dureza = excluded.dureza,
  proteinas = excluded.proteinas, beneficio_principal = excluded.beneficio_principal,
  descripcion = excluded.descripcion, beneficios = excluded.beneficios,
  ingredientes = excluded.ingredientes, minerales = excluded.minerales,
  tamanos = excluded.tamanos, edades = excluded.edades, imagen_url = excluded.imagen_url,
  galeria = excluded.galeria, etiquetas = excluded.etiquetas, destacado = excluded.destacado,
  conservacion = excluded.conservacion, advertencia = excluded.advertencia,
  disponible_mayor = excluded.disponible_mayor, ventas = excluded.ventas, orden = excluded.orden;
insert into productos (
  slug, nombre, categoria_id, dureza, proteinas, beneficio_principal, descripcion,
  beneficios, ingredientes, minerales, tamanos, edades, imagen_url, galeria,
  etiquetas, destacado, activo, conservacion, advertencia, disponible_mayor, ventas, orden
) values (
  'vertebra-de-res', 'Vértebra de res',
  (select id from categorias where slug = 'larga-duracion'),
  'larga-duracion'::dureza, array['res'], 'Robusta, con médula ósea', 'Snack robusto y nutritivo, ideal para perros grandes. Su estructura ayuda a la limpieza dental mientras aporta minerales esenciales y grasas.',
  array['Aporta médula ósea', 'Fortalece huesos', 'Limpieza dental', 'Ideal para perros grandes'], array['Vértebra de res deshidratada (ingrediente único)'], 'Calcio, fósforo y magnesio. Con colágeno y médula ósea: fortalece huesos y aporta energía.',
  array['grande']::tamano_perro[], array['adulto']::edad_perro[],
  '/productos/vertebra-de-res.png', array['/productos/vertebra-de-res.png'], '{}',
  false, true, 'Conservar en un lugar fresco y seco, dentro de su empaque bien cerrado y lejos de la luz directa del sol.', 'Supervisa siempre a tu mascota durante el consumo del producto para evitar atoramientos o posibles reacciones alérgicas.',
  false, 128, 24
)
on conflict (slug) do update set
  nombre = excluded.nombre, categoria_id = excluded.categoria_id, dureza = excluded.dureza,
  proteinas = excluded.proteinas, beneficio_principal = excluded.beneficio_principal,
  descripcion = excluded.descripcion, beneficios = excluded.beneficios,
  ingredientes = excluded.ingredientes, minerales = excluded.minerales,
  tamanos = excluded.tamanos, edades = excluded.edades, imagen_url = excluded.imagen_url,
  galeria = excluded.galeria, etiquetas = excluded.etiquetas, destacado = excluded.destacado,
  conservacion = excluded.conservacion, advertencia = excluded.advertencia,
  disponible_mayor = excluded.disponible_mayor, ventas = excluded.ventas, orden = excluded.orden;

-- ----------------------------- Presentaciones -----------------------------
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'bofe-de-res'), '70g', '70 gramos', 'gramos'::tipo_presentacion, 14, 24, 0)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'bofe-de-res'), '150g', '150 gramos', 'gramos'::tipo_presentacion, 24, 18, 1)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'corazon-de-cerdo'), '70g', '70 gramos', 'gramos'::tipo_presentacion, 14, 20, 0)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'corazon-de-cerdo'), '150g', '150 gramos', 'gramos'::tipo_presentacion, 24, 12, 1)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'rinones-de-res'), '70g', '70 gramos', 'gramos'::tipo_presentacion, 14, 15, 0)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'rinones-de-res'), '150g', '150 gramos', 'gramos'::tipo_presentacion, 24, 9, 1)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'pejerrey'), '50g', '50 gramos', 'gramos'::tipo_presentacion, 14, 22, 0)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'pejerrey'), '110g', '110 gramos', 'gramos'::tipo_presentacion, 24, 16, 1)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'patitas-de-pollo'), '10u', '10 unidades', 'unidades'::tipo_presentacion, 14, 30, 0)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'patitas-de-pollo'), '30u', '30 unidades', 'unidades'::tipo_presentacion, 25, 18, 1)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'patitas-de-pollo'), '1kg', '1 kg (90 unidades aprox.)', 'kilogramos'::tipo_presentacion, 50, 7, 2)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'traquea-de-res'), '70g', '70 gramos', 'gramos'::tipo_presentacion, 14, 21, 0)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'traquea-de-res'), '150g', '150 gramos', 'gramos'::tipo_presentacion, 24, 14, 1)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'traquea-de-res'), '1u', '1 unidad', 'unidades'::tipo_presentacion, 6, 40, 2)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'traquea-de-res'), '3u', '3 unidades', 'unidades'::tipo_presentacion, 15, 25, 3)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'traquea-de-res-xl'), '1u', '1 unidad', 'unidades'::tipo_presentacion, 12, 11, 0)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'oreja-de-cerdo'), '1u', '1 unidad', 'unidades'::tipo_presentacion, 5, 48, 0)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'oreja-de-cerdo'), '4u', '4 unidades', 'unidades'::tipo_presentacion, 18.5, 22, 1)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'oreja-de-res-con-pelitos'), 's', '1 unidad talla S', 'talla'::tipo_presentacion, 8, 26, 0)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'oreja-de-res-con-pelitos'), 'm', '1 unidad talla M', 'talla'::tipo_presentacion, 12, 19, 1)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'oreja-de-res-con-pelitos'), 'l', '1 unidad talla L', 'talla'::tipo_presentacion, 15, 12, 2)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'oreja-de-res-con-pelitos'), 'xl', '1 unidad talla XL', 'talla'::tipo_presentacion, 20, 5, 3)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'traquea-de-cordero'), '5u', '5 unidades', 'unidades'::tipo_presentacion, 15, 17, 0)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'colita-de-res'), '1u', '1 unidad', 'unidades'::tipo_presentacion, 3, 60, 0)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'aletas-de-toyo'), 's', '1 unidad talla S', 'talla'::tipo_presentacion, 10, 14, 0)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'aletas-de-toyo'), 'm', '1 unidad talla M', 'talla'::tipo_presentacion, 12, 10, 1)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'aletas-de-toyo'), 'l', '1 unidad talla L', 'talla'::tipo_presentacion, 15, 6, 2)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'garganta-de-res'), '1u', '1 unidad', 'unidades'::tipo_presentacion, 15, 9, 0)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'garganta-de-cerdo'), '1u', '1 unidad', 'unidades'::tipo_presentacion, 8, 18, 0)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'garganta-de-cerdo'), '2u', '2 unidades', 'unidades'::tipo_presentacion, 15, 11, 1)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'esofago-de-res'), '1u', '1 unidad', 'unidades'::tipo_presentacion, 12, 16, 0)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'esofago-de-res'), '2u', '2 unidades', 'unidades'::tipo_presentacion, 22, 8, 1)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'esofago-de-cordero'), '1u', '1 unidad', 'unidades'::tipo_presentacion, 8, 20, 0)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'esofago-de-cordero'), '2u', '2 unidades', 'unidades'::tipo_presentacion, 15, 13, 1)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'trio-pork-chew'), '1u', '1 unidad', 'unidades'::tipo_presentacion, 10, 15, 0)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'trio-pork-chew'), '3u', '3 unidades', 'unidades'::tipo_presentacion, 25, 8, 1)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'oreja-de-cabra'), 's', '1 unidad talla S', 'talla'::tipo_presentacion, 3, 40, 0)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'oreja-de-cabra'), 'm', '1 unidad talla M', 'talla'::tipo_presentacion, 4, 32, 1)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'oreja-de-cabra'), 'l', '1 unidad talla L', 'talla'::tipo_presentacion, 5, 21, 2)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'power-stick-bovino'), '1u', '1 unidad', 'unidades'::tipo_presentacion, 8, 25, 0)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'power-stick-bovino'), '2u', '2 unidades', 'unidades'::tipo_presentacion, 15, 14, 1)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'cuerno-de-res'), '1u', '1 unidad', 'unidades'::tipo_presentacion, 15, 12, 0)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'pezuna-de-res'), '1u', '1 unidad', 'unidades'::tipo_presentacion, 10, 20, 0)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'pezuna-de-res'), '3u', '3 unidades', 'unidades'::tipo_presentacion, 25, 10, 1)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'nariz-de-res'), '1u', '1 unidad', 'unidades'::tipo_presentacion, 5, 28, 0)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'cuerno-de-cabra'), '1u', '1 unidad', 'unidades'::tipo_presentacion, 10, 14, 0)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'vertebra-de-res'), '1u', '1 unidad', 'unidades'::tipo_presentacion, 8, 17, 0)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;
insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = 'vertebra-de-res'), '2u', '2 unidades', 'unidades'::tipo_presentacion, 15, 9, 1)
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;

-- --------------------------- Productos relacionados -----------------------
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'bofe-de-res' and b.slug = 'corazon-de-cerdo'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'bofe-de-res' and b.slug = 'rinones-de-res'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'bofe-de-res' and b.slug = 'pejerrey'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'corazon-de-cerdo' and b.slug = 'bofe-de-res'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'corazon-de-cerdo' and b.slug = 'rinones-de-res'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'corazon-de-cerdo' and b.slug = 'garganta-de-cerdo'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'rinones-de-res' and b.slug = 'bofe-de-res'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'rinones-de-res' and b.slug = 'corazon-de-cerdo'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'rinones-de-res' and b.slug = 'esofago-de-res'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'pejerrey' and b.slug = 'aletas-de-toyo'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'pejerrey' and b.slug = 'bofe-de-res'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'pejerrey' and b.slug = 'patitas-de-pollo'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'patitas-de-pollo' and b.slug = 'traquea-de-res'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'patitas-de-pollo' and b.slug = 'colita-de-res'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'patitas-de-pollo' and b.slug = 'trio-pork-chew'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'traquea-de-res' and b.slug = 'traquea-de-cordero'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'traquea-de-res' and b.slug = 'traquea-de-res-xl'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'traquea-de-res' and b.slug = 'garganta-de-res'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'traquea-de-res-xl' and b.slug = 'traquea-de-res'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'traquea-de-res-xl' and b.slug = 'esofago-de-res'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'traquea-de-res-xl' and b.slug = 'power-stick-bovino'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'oreja-de-cerdo' and b.slug = 'oreja-de-res-con-pelitos'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'oreja-de-cerdo' and b.slug = 'oreja-de-cabra'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'oreja-de-cerdo' and b.slug = 'trio-pork-chew'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'oreja-de-res-con-pelitos' and b.slug = 'oreja-de-cerdo'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'oreja-de-res-con-pelitos' and b.slug = 'oreja-de-cabra'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'oreja-de-res-con-pelitos' and b.slug = 'colita-de-res'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'traquea-de-cordero' and b.slug = 'traquea-de-res'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'traquea-de-cordero' and b.slug = 'esofago-de-cordero'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'traquea-de-cordero' and b.slug = 'patitas-de-pollo'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'colita-de-res' and b.slug = 'power-stick-bovino'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'colita-de-res' and b.slug = 'patitas-de-pollo'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'colita-de-res' and b.slug = 'vertebra-de-res'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'aletas-de-toyo' and b.slug = 'pejerrey'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'aletas-de-toyo' and b.slug = 'cuerno-de-cabra'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'aletas-de-toyo' and b.slug = 'oreja-de-cabra'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'garganta-de-res' and b.slug = 'garganta-de-cerdo'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'garganta-de-res' and b.slug = 'traquea-de-res'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'garganta-de-res' and b.slug = 'nariz-de-res'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'garganta-de-cerdo' and b.slug = 'garganta-de-res'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'garganta-de-cerdo' and b.slug = 'corazon-de-cerdo'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'garganta-de-cerdo' and b.slug = 'trio-pork-chew'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'esofago-de-res' and b.slug = 'esofago-de-cordero'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'esofago-de-res' and b.slug = 'traquea-de-res'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'esofago-de-res' and b.slug = 'power-stick-bovino'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'esofago-de-cordero' and b.slug = 'esofago-de-res'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'esofago-de-cordero' and b.slug = 'traquea-de-cordero'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'esofago-de-cordero' and b.slug = 'bofe-de-res'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'trio-pork-chew' and b.slug = 'oreja-de-cerdo'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'trio-pork-chew' and b.slug = 'garganta-de-cerdo'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'trio-pork-chew' and b.slug = 'power-stick-bovino'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'oreja-de-cabra' and b.slug = 'oreja-de-cerdo'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'oreja-de-cabra' and b.slug = 'oreja-de-res-con-pelitos'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'oreja-de-cabra' and b.slug = 'cuerno-de-cabra'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'power-stick-bovino' and b.slug = 'colita-de-res'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'power-stick-bovino' and b.slug = 'trio-pork-chew'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'power-stick-bovino' and b.slug = 'cuerno-de-res'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'cuerno-de-res' and b.slug = 'cuerno-de-cabra'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'cuerno-de-res' and b.slug = 'pezuna-de-res'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'cuerno-de-res' and b.slug = 'vertebra-de-res'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'pezuna-de-res' and b.slug = 'cuerno-de-res'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'pezuna-de-res' and b.slug = 'nariz-de-res'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'pezuna-de-res' and b.slug = 'vertebra-de-res'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'nariz-de-res' and b.slug = 'pezuna-de-res'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'nariz-de-res' and b.slug = 'garganta-de-res'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'nariz-de-res' and b.slug = 'colita-de-res'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'cuerno-de-cabra' and b.slug = 'cuerno-de-res'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'cuerno-de-cabra' and b.slug = 'oreja-de-cabra'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'cuerno-de-cabra' and b.slug = 'pezuna-de-res'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'vertebra-de-res' and b.slug = 'cuerno-de-res'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'vertebra-de-res' and b.slug = 'pezuna-de-res'
on conflict do nothing;
insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = 'vertebra-de-res' and b.slug = 'colita-de-res'
on conflict do nothing;

-- ----------------------------------- BARF ---------------------------------
insert into productos_barf (slug, nombre, proteinas, descripcion, composicion, beneficios, imagen_url, color, orden)
values ('barf-pollo-equino', 'BARF Pollo–Equino', array['pollo', 'equino'], 'Nuestra receta de entrada: proteína magra de equino combinada con pollo. Digestión suave y excelente relación precio–calidad para empezar en BARF.', array['Carne de pollo y equino', 'Hueso carnoso molido', 'Vísceras (hígado y molleja)', 'Vegetales de estación'], array['Ideal para iniciar la transición a BARF', 'Proteína magra y digestible', 'La opción más económica por kilo'], '/productos/barf.png', 'coral', 0)
on conflict (slug) do update set
  nombre = excluded.nombre, proteinas = excluded.proteinas, descripcion = excluded.descripcion,
  composicion = excluded.composicion, beneficios = excluded.beneficios,
  imagen_url = excluded.imagen_url, color = excluded.color, orden = excluded.orden;
delete from barf_rangos where barf_id = (select id from productos_barf where slug = 'barf-pollo-equino');
insert into barf_rangos (barf_id, desde_kg, hasta_kg, precio_kg)
values ((select id from productos_barf where slug = 'barf-pollo-equino'), 1, 10, 12);
insert into barf_rangos (barf_id, desde_kg, hasta_kg, precio_kg)
values ((select id from productos_barf where slug = 'barf-pollo-equino'), 11, 20, 11);
insert into barf_rangos (barf_id, desde_kg, hasta_kg, precio_kg)
values ((select id from productos_barf where slug = 'barf-pollo-equino'), 21, null, 10);
insert into productos_barf (slug, nombre, proteinas, descripcion, composicion, beneficios, imagen_url, color, orden)
values ('barf-res-pollo', 'BARF Res–Pollo', array['res', 'pollo'], 'La mezcla más equilibrada del catálogo. Res para el aporte de hierro y pollo para la palatabilidad: funciona bien en perros adultos de cualquier tamaño.', array['Carne de res y pollo', 'Hueso carnoso molido', 'Vísceras (hígado, riñón)', 'Vegetales de estación'], array['Alto aporte de hierro', 'Muy palatable', 'Receta más versátil para el día a día'], '/productos/barf.png', 'petroleo', 1)
on conflict (slug) do update set
  nombre = excluded.nombre, proteinas = excluded.proteinas, descripcion = excluded.descripcion,
  composicion = excluded.composicion, beneficios = excluded.beneficios,
  imagen_url = excluded.imagen_url, color = excluded.color, orden = excluded.orden;
delete from barf_rangos where barf_id = (select id from productos_barf where slug = 'barf-res-pollo');
insert into barf_rangos (barf_id, desde_kg, hasta_kg, precio_kg)
values ((select id from productos_barf where slug = 'barf-res-pollo'), 1, 10, 14);
insert into barf_rangos (barf_id, desde_kg, hasta_kg, precio_kg)
values ((select id from productos_barf where slug = 'barf-res-pollo'), 11, 20, 13.5);
insert into barf_rangos (barf_id, desde_kg, hasta_kg, precio_kg)
values ((select id from productos_barf where slug = 'barf-res-pollo'), 21, null, 13);
insert into productos_barf (slug, nombre, proteinas, descripcion, composicion, beneficios, imagen_url, color, orden)
values ('barf-pavo-cordero', 'BARF Pavo–Cordero', array['pavo', 'cordero'], 'Receta premium con proteínas poco comunes, pensada para perros con sensibilidades alimentarias o que ya rotaron por las otras recetas.', array['Carne de pavo y cordero', 'Hueso carnoso molido', 'Vísceras seleccionadas', 'Vegetales de estación'], array['Proteínas novedosas para perros sensibles', 'Rica en omega 3', 'Ideal para dietas de rotación'], '/productos/barf.png', 'ambar', 2)
on conflict (slug) do update set
  nombre = excluded.nombre, proteinas = excluded.proteinas, descripcion = excluded.descripcion,
  composicion = excluded.composicion, beneficios = excluded.beneficios,
  imagen_url = excluded.imagen_url, color = excluded.color, orden = excluded.orden;
delete from barf_rangos where barf_id = (select id from productos_barf where slug = 'barf-pavo-cordero');
insert into barf_rangos (barf_id, desde_kg, hasta_kg, precio_kg)
values ((select id from productos_barf where slug = 'barf-pavo-cordero'), 1, 6, 17);
insert into barf_rangos (barf_id, desde_kg, hasta_kg, precio_kg)
values ((select id from productos_barf where slug = 'barf-pavo-cordero'), 7, 20, 16.5);
insert into barf_rangos (barf_id, desde_kg, hasta_kg, precio_kg)
values ((select id from productos_barf where slug = 'barf-pavo-cordero'), 21, null, 16);

-- -------------------------------- Por mayor -------------------------------
insert into lotes_mayor (slug, nombre, productos, unidad, minimo, imagen_url, nota, orden)
values ('organos-80gr', 'Órganos deshidratados en bolsas de 80 g', array['Bofe de res', 'Corazón de cerdo', 'Riñón de res'], 'bolsas de 80 g', '26 unidades', '/empaques/snacks-bolsa-res.png', 'Elige una sola proteína o combina las tres dentro del mismo lote.', 0)
on conflict (slug) do update set
  nombre = excluded.nombre, productos = excluded.productos, unidad = excluded.unidad,
  minimo = excluded.minimo, imagen_url = excluded.imagen_url, nota = excluded.nota,
  orden = excluded.orden;
delete from lotes_mayor_precios where lote_id = (select id from lotes_mayor where slug = 'organos-80gr');
insert into lotes_mayor_precios (lote_id, etiqueta, precio, orden)
values ((select id from lotes_mayor where slug = 'organos-80gr'), '26 unidades', 234, 0);
insert into lotes_mayor_precios (lote_id, etiqueta, precio, orden)
values ((select id from lotes_mayor where slug = 'organos-80gr'), '52 unidades', 452, 1);
insert into lotes_mayor_precios (lote_id, etiqueta, precio, orden)
values ((select id from lotes_mayor where slug = 'organos-80gr'), '104 unidades', 884, 2);
insert into lotes_mayor (slug, nombre, productos, unidad, minimo, imagen_url, nota, orden)
values ('patitas-de-pollo', 'Patitas de pollo', array['Patitas de pollo'], 'kilogramos', '1 kg', '/empaques/patitas-bolsa.png', 'Aproximadamente 90 unidades por kilogramo.', 1)
on conflict (slug) do update set
  nombre = excluded.nombre, productos = excluded.productos, unidad = excluded.unidad,
  minimo = excluded.minimo, imagen_url = excluded.imagen_url, nota = excluded.nota,
  orden = excluded.orden;
delete from lotes_mayor_precios where lote_id = (select id from lotes_mayor where slug = 'patitas-de-pollo');
insert into lotes_mayor_precios (lote_id, etiqueta, precio, orden)
values ((select id from lotes_mayor where slug = 'patitas-de-pollo'), '1 kg', 50, 0);
insert into lotes_mayor_precios (lote_id, etiqueta, precio, orden)
values ((select id from lotes_mayor where slug = 'patitas-de-pollo'), '5 kg', 235, 1);
insert into lotes_mayor_precios (lote_id, etiqueta, precio, orden)
values ((select id from lotes_mayor where slug = 'patitas-de-pollo'), '10 kg', 450, 2);
insert into lotes_mayor (slug, nombre, productos, unidad, minimo, imagen_url, nota, orden)
values ('traqueas-de-cordero', 'Tráqueas de cordero', array['Tráquea de cordero'], 'kilogramos', '1 kg', '/empaques/traqueas-bolsa.png', null, 2)
on conflict (slug) do update set
  nombre = excluded.nombre, productos = excluded.productos, unidad = excluded.unidad,
  minimo = excluded.minimo, imagen_url = excluded.imagen_url, nota = excluded.nota,
  orden = excluded.orden;
delete from lotes_mayor_precios where lote_id = (select id from lotes_mayor where slug = 'traqueas-de-cordero');
insert into lotes_mayor_precios (lote_id, etiqueta, precio, orden)
values ((select id from lotes_mayor where slug = 'traqueas-de-cordero'), '1 kg', 95, 0);
insert into lotes_mayor_precios (lote_id, etiqueta, precio, orden)
values ((select id from lotes_mayor where slug = 'traqueas-de-cordero'), '5 kg', 450, 1);
insert into lotes_mayor_precios (lote_id, etiqueta, precio, orden)
values ((select id from lotes_mayor where slug = 'traqueas-de-cordero'), '10 kg', 870, 2);
insert into lotes_mayor (slug, nombre, productos, unidad, minimo, imagen_url, nota, orden)
values ('traqueas-de-res', 'Tráqueas de res', array['Tráquea de res'], 'kilogramos', '1 kg', '/productos/traquea-de-res.png', null, 3)
on conflict (slug) do update set
  nombre = excluded.nombre, productos = excluded.productos, unidad = excluded.unidad,
  minimo = excluded.minimo, imagen_url = excluded.imagen_url, nota = excluded.nota,
  orden = excluded.orden;
delete from lotes_mayor_precios where lote_id = (select id from lotes_mayor where slug = 'traqueas-de-res');
insert into lotes_mayor_precios (lote_id, etiqueta, precio, orden)
values ((select id from lotes_mayor where slug = 'traqueas-de-res'), '1 kg', 95, 0);
insert into lotes_mayor_precios (lote_id, etiqueta, precio, orden)
values ((select id from lotes_mayor where slug = 'traqueas-de-res'), '5 kg', 450, 1);
insert into lotes_mayor_precios (lote_id, etiqueta, precio, orden)
values ((select id from lotes_mayor where slug = 'traqueas-de-res'), '10 kg', 870, 2);
insert into lotes_mayor (slug, nombre, productos, unidad, minimo, imagen_url, nota, orden)
values ('pejerrey-50gr', 'Pejerrey en bolsas de 50 g', array['Pejerrey'], 'bolsas de 50 g', '26 unidades', '/empaques/pejerrey-bolsa.png', null, 4)
on conflict (slug) do update set
  nombre = excluded.nombre, productos = excluded.productos, unidad = excluded.unidad,
  minimo = excluded.minimo, imagen_url = excluded.imagen_url, nota = excluded.nota,
  orden = excluded.orden;
delete from lotes_mayor_precios where lote_id = (select id from lotes_mayor where slug = 'pejerrey-50gr');
insert into lotes_mayor_precios (lote_id, etiqueta, precio, orden)
values ((select id from lotes_mayor where slug = 'pejerrey-50gr'), '26 unidades', 234, 0);
insert into lotes_mayor_precios (lote_id, etiqueta, precio, orden)
values ((select id from lotes_mayor where slug = 'pejerrey-50gr'), '52 unidades', 452, 1);
insert into lotes_mayor (slug, nombre, productos, unidad, minimo, imagen_url, nota, orden)
values ('pejerrey-120gr', 'Pejerrey en bolsas de 120 g', array['Pejerrey'], 'bolsas de 120 g', '25 unidades', '/productos/pejerrey.png', null, 5)
on conflict (slug) do update set
  nombre = excluded.nombre, productos = excluded.productos, unidad = excluded.unidad,
  minimo = excluded.minimo, imagen_url = excluded.imagen_url, nota = excluded.nota,
  orden = excluded.orden;
delete from lotes_mayor_precios where lote_id = (select id from lotes_mayor where slug = 'pejerrey-120gr');
insert into lotes_mayor_precios (lote_id, etiqueta, precio, orden)
values ((select id from lotes_mayor where slug = 'pejerrey-120gr'), '25 unidades', 580, 0);
insert into lotes_mayor_precios (lote_id, etiqueta, precio, orden)
values ((select id from lotes_mayor where slug = 'pejerrey-120gr'), '50 unidades', 1100, 1);
insert into lotes_mayor (slug, nombre, productos, unidad, minimo, imagen_url, nota, orden)
values ('orejas-de-cerdo', 'Orejas de cerdo', array['Oreja de cerdo'], 'docenas', '1 docena', '/empaques/orejas-bolsa.png', null, 6)
on conflict (slug) do update set
  nombre = excluded.nombre, productos = excluded.productos, unidad = excluded.unidad,
  minimo = excluded.minimo, imagen_url = excluded.imagen_url, nota = excluded.nota,
  orden = excluded.orden;
delete from lotes_mayor_precios where lote_id = (select id from lotes_mayor where slug = 'orejas-de-cerdo');
insert into lotes_mayor_precios (lote_id, etiqueta, precio, orden)
values ((select id from lotes_mayor where slug = 'orejas-de-cerdo'), '1 docena', 57.5, 0);
insert into lotes_mayor_precios (lote_id, etiqueta, precio, orden)
values ((select id from lotes_mayor where slug = 'orejas-de-cerdo'), '5 docenas', 285, 1);
insert into lotes_mayor_precios (lote_id, etiqueta, precio, orden)
values ((select id from lotes_mayor where slug = 'orejas-de-cerdo'), '10 docenas', 560, 2);
insert into lotes_mayor (slug, nombre, productos, unidad, minimo, imagen_url, nota, orden)
values ('orejas-de-res', 'Orejas de res', array['Oreja de res con pelitos'], 'docenas', '1 docena', '/empaques/orejas-res-detalle.png', null, 7)
on conflict (slug) do update set
  nombre = excluded.nombre, productos = excluded.productos, unidad = excluded.unidad,
  minimo = excluded.minimo, imagen_url = excluded.imagen_url, nota = excluded.nota,
  orden = excluded.orden;
delete from lotes_mayor_precios where lote_id = (select id from lotes_mayor where slug = 'orejas-de-res');
insert into lotes_mayor_precios (lote_id, etiqueta, precio, orden)
values ((select id from lotes_mayor where slug = 'orejas-de-res'), '1 docena', 90, 0);
insert into lotes_mayor_precios (lote_id, etiqueta, precio, orden)
values ((select id from lotes_mayor where slug = 'orejas-de-res'), '5 docenas', 432, 1);
insert into lotes_mayor_precios (lote_id, etiqueta, precio, orden)
values ((select id from lotes_mayor where slug = 'orejas-de-res'), '10 docenas', 840, 2);
insert into lotes_mayor (slug, nombre, productos, unidad, minimo, imagen_url, nota, orden)
values ('colita-de-res', 'Colita de res', array['Colita de res'], 'unidades', '50 unidades', '/productos/colita-de-res.png', null, 8)
on conflict (slug) do update set
  nombre = excluded.nombre, productos = excluded.productos, unidad = excluded.unidad,
  minimo = excluded.minimo, imagen_url = excluded.imagen_url, nota = excluded.nota,
  orden = excluded.orden;
delete from lotes_mayor_precios where lote_id = (select id from lotes_mayor where slug = 'colita-de-res');
insert into lotes_mayor_precios (lote_id, etiqueta, precio, orden)
values ((select id from lotes_mayor where slug = 'colita-de-res'), '50 unidades', 100, 0);
insert into lotes_mayor_precios (lote_id, etiqueta, precio, orden)
values ((select id from lotes_mayor where slug = 'colita-de-res'), '100 unidades', 180, 1);
insert into lotes_mayor (slug, nombre, productos, unidad, minimo, imagen_url, nota, orden)
values ('pezuna-de-res', 'Pezuña de res', array['Pezuña de res'], 'docenas', '1 docena', '/productos/pezuna-de-res.png', null, 9)
on conflict (slug) do update set
  nombre = excluded.nombre, productos = excluded.productos, unidad = excluded.unidad,
  minimo = excluded.minimo, imagen_url = excluded.imagen_url, nota = excluded.nota,
  orden = excluded.orden;
delete from lotes_mayor_precios where lote_id = (select id from lotes_mayor where slug = 'pezuna-de-res');
insert into lotes_mayor_precios (lote_id, etiqueta, precio, orden)
values ((select id from lotes_mayor where slug = 'pezuna-de-res'), '1 docena', 105, 0);
insert into lotes_mayor_precios (lote_id, etiqueta, precio, orden)
values ((select id from lotes_mayor where slug = 'pezuna-de-res'), '5 docenas', 510, 1);
insert into lotes_mayor_precios (lote_id, etiqueta, precio, orden)
values ((select id from lotes_mayor where slug = 'pezuna-de-res'), '10 docenas', 985, 2);
insert into lotes_mayor (slug, nombre, productos, unidad, minimo, imagen_url, nota, orden)
values ('cuerno-de-res', 'Cuerno de res', array['Cuerno de res'], 'docenas', '1 docena', '/empaques/cuerno-bolsa.png', null, 10)
on conflict (slug) do update set
  nombre = excluded.nombre, productos = excluded.productos, unidad = excluded.unidad,
  minimo = excluded.minimo, imagen_url = excluded.imagen_url, nota = excluded.nota,
  orden = excluded.orden;
delete from lotes_mayor_precios where lote_id = (select id from lotes_mayor where slug = 'cuerno-de-res');
insert into lotes_mayor_precios (lote_id, etiqueta, precio, orden)
values ((select id from lotes_mayor where slug = 'cuerno-de-res'), '1 docena', 105, 0);
insert into lotes_mayor_precios (lote_id, etiqueta, precio, orden)
values ((select id from lotes_mayor where slug = 'cuerno-de-res'), '5 docenas', 510, 1);
insert into lotes_mayor_precios (lote_id, etiqueta, precio, orden)
values ((select id from lotes_mayor where slug = 'cuerno-de-res'), '10 docenas', 985, 2);

-- ------------------------------- Recompensas ------------------------------
insert into reglas_puntos (monto_por_punto, puntos_otorgados, vigencia_desde, vigencia_hasta, compra_minima, multiplicador, campana, activa)
select 10, 1, '2026-01-01'::date, '2026-12-31'::date, 0, 1, null, true
where not exists (select 1 from reglas_puntos where activa);

insert into recompensas (nombre, descripcion, puntos, tipo, valor, icono, orden, activa)
select 'Descuento de S/ 10', 'Se aplica al total de tu siguiente pedido.', 200, 'descuento-fijo'::tipo_recompensa, 10, 'descuento', 0, true
where not exists (select 1 from recompensas where nombre = 'Descuento de S/ 10');
insert into recompensas (nombre, descripcion, puntos, tipo, valor, icono, orden, activa)
select 'Envío gratis', 'Delivery sin costo en Lima Metropolitana.', 150, 'envio-gratis'::tipo_recompensa, 12, 'envio', 1, true
where not exists (select 1 from recompensas where nombre = 'Envío gratis');
insert into recompensas (nombre, descripcion, puntos, tipo, valor, icono, orden, activa)
select 'Oreja de cerdo gratis', 'Una unidad de regalo con tu pedido.', 120, 'producto-gratis'::tipo_recompensa, 0, 'regalo', 2, true
where not exists (select 1 from recompensas where nombre = 'Oreja de cerdo gratis');
insert into recompensas (nombre, descripcion, puntos, tipo, valor, icono, orden, activa)
select '15% de descuento', 'Sobre el total de la compra, sin tope.', 350, 'descuento-porcentual'::tipo_recompensa, 15, 'porcentaje', 3, true
where not exists (select 1 from recompensas where nombre = '15% de descuento');
insert into recompensas (nombre, descripcion, puntos, tipo, valor, icono, orden, activa)
select 'Bolsa sorpresa Cocina Canina', 'Un mix de snacks elegido por nosotros.', 500, 'regalo'::tipo_recompensa, 0, 'sorpresa', 4, true
where not exists (select 1 from recompensas where nombre = 'Bolsa sorpresa Cocina Canina');
insert into recompensas (nombre, descripcion, puntos, tipo, valor, icono, orden, activa)
select 'Cupón cumpleañero', 'S/ 20 para celebrar el cumpleaños de tu perro.', 400, 'cupon'::tipo_recompensa, 20, 'cupon', 5, true
where not exists (select 1 from recompensas where nombre = 'Cupón cumpleañero');

-- --------------------------------- Cupones --------------------------------
insert into cupones (codigo, descripcion, tipo, valor, vence_en, activo)
values ('CLUB10', 'S/ 10 de descuento en tu próxima compra', 'descuento-fijo'::tipo_recompensa, 10, '2026-09-30'::date, true)
on conflict (codigo) do update set
  descripcion = excluded.descripcion, tipo = excluded.tipo, valor = excluded.valor,
  vence_en = excluded.vence_en;
insert into cupones (codigo, descripcion, tipo, valor, vence_en, activo)
values ('ENVIOGRATIS', 'Delivery sin costo en Lima Metropolitana', 'envio-gratis'::tipo_recompensa, 12, '2026-08-31'::date, true)
on conflict (codigo) do update set
  descripcion = excluded.descripcion, tipo = excluded.tipo, valor = excluded.valor,
  vence_en = excluded.vence_en;
insert into cupones (codigo, descripcion, tipo, valor, vence_en, activo)
values ('BIENVENIDA', '15% en tu primera compra', 'descuento-porcentual'::tipo_recompensa, 15, '2026-06-03'::date, false)
on conflict (codigo) do update set
  descripcion = excluded.descripcion, tipo = excluded.tipo, valor = excluded.valor,
  vence_en = excluded.vence_en;

-- -------------------------------- Contenido -------------------------------
insert into contenido_web (clave, valor) values ('hero', '{"titulo":"Lo mejor para tu mejor","tituloResaltado":"amigo","subtitulo":"Snacks deshidratados y alimentación BARF elaborados con ingredientes naturales para cuidar la salud, felicidad y bienestar de tu mascota.","sello":"Perfecto para perros de todas las edades","beneficios":[{"titulo":"100% naturales","detalle":"Ingrediente único, sin aditivos","icono":"hoja"},{"titulo":"Sin conservantes ni colorantes","detalle":"Nada artificial en el proceso","icono":"escudo"},{"titulo":"Textura y dureza seleccionada","detalle":"Suave, media o larga duración","icono":"hueso"},{"titulo":"Ingredientes de calidad","detalle":"Proteína fresca y trazable","icono":"chef"}]}'::jsonb)
on conflict (clave) do update set valor = excluded.valor, actualizado = now();
insert into contenido_web (clave, valor) values ('quienesSomos', '{"antetitulo":"Quiénes somos","titulo":"Alimentamos su felicidad","texto":"En La Cocina Canina elaboramos snacks deshidratados y alimentación BARF con ingredientes seleccionados. Nuestro objetivo es ofrecer productos naturales, nutritivos y seguros que contribuyan al bienestar y calidad de vida de cada mascota.","valores":[{"titulo":"Ingredientes seleccionados","texto":"Trabajamos con proteína fresca de proveedores conocidos y un solo ingrediente por snack. Sin harinas, sin rellenos, sin sorpresas en la etiqueta.","icono":"hoja"},{"titulo":"Procesos naturales y seguros","texto":"Deshidratado lento a baja temperatura, que conserva los nutrientes y reduce la humedad para que el producto dure sin conservantes.","icono":"termometro"},{"titulo":"Amor y cuidado en cada preparación","texto":"Producción artesanal, en lotes pequeños y revisados pieza por pieza antes de empacar. Cocinamos como si fuera para nuestros propios perros.","icono":"corazon"}]}'::jsonb)
on conflict (clave) do update set valor = excluded.valor, actualizado = now();
insert into contenido_web (clave, valor) values ('pedidoWhatsapp', '{"titulo":"Haz tu pedido fácil y rápido","texto":"Selecciona tus productos y envía tu pedido por WhatsApp. Nosotros confirmaremos disponibilidad, costo de envío y horario de entrega.","boton":"Hacer pedido por WhatsApp"}'::jsonb)
on conflict (clave) do update set valor = excluded.valor, actualizado = now();

insert into secciones_inicio (clave, nombre, orden, visible)
values ('hero', 'Hero principal', 0, true)
on conflict (clave) do update set nombre = excluded.nombre;
insert into secciones_inicio (clave, nombre, orden, visible)
values ('nosotros', 'Quiénes somos', 1, true)
on conflict (clave) do update set nombre = excluded.nombre;
insert into secciones_inicio (clave, nombre, orden, visible)
values ('categorias', 'Categorías de productos', 2, true)
on conflict (clave) do update set nombre = excluded.nombre;
insert into secciones_inicio (clave, nombre, orden, visible)
values ('destacados', 'Productos destacados', 3, true)
on conflict (clave) do update set nombre = excluded.nombre;
insert into secciones_inicio (clave, nombre, orden, visible)
values ('barf', 'Alimentación BARF', 4, true)
on conflict (clave) do update set nombre = excluded.nombre;
insert into secciones_inicio (clave, nombre, orden, visible)
values ('club', 'Club Cocina Canina', 5, true)
on conflict (clave) do update set nombre = excluded.nombre;
insert into secciones_inicio (clave, nombre, orden, visible)
values ('mayor', 'Compra por mayor', 6, true)
on conflict (clave) do update set nombre = excluded.nombre;
insert into secciones_inicio (clave, nombre, orden, visible)
values ('whatsapp', 'Pedido por WhatsApp', 7, true)
on conflict (clave) do update set nombre = excluded.nombre;
insert into secciones_inicio (clave, nombre, orden, visible)
values ('testimonios', 'Testimonios', 8, true)
on conflict (clave) do update set nombre = excluded.nombre;
insert into secciones_inicio (clave, nombre, orden, visible)
values ('faq', 'Preguntas frecuentes', 9, true)
on conflict (clave) do update set nombre = excluded.nombre;

-- ---------------------------- Preguntas frecuentes ------------------------
insert into preguntas_frecuentes (categoria, pregunta, respuesta, orden, visible)
select 'productos', '¿Los snacks tienen conservantes?', 'No. Todos nuestros snacks son de ingrediente único y se elaboran solo por deshidratado: no llevan conservantes, colorantes ni saborizantes artificiales. La baja humedad es lo que permite que se conserven por más tiempo.', 0, true
where not exists (select 1 from preguntas_frecuentes where pregunta = '¿Los snacks tienen conservantes?');
insert into preguntas_frecuentes (categoria, pregunta, respuesta, orden, visible)
select 'productos', '¿Cómo debo conservar los productos?', 'Guárdalos en un lugar fresco y seco, dentro de su empaque bien cerrado y lejos de la luz directa del sol. No necesitan refrigeración. Si vives en una zona muy húmeda, puedes guardarlos en un recipiente hermético.', 1, true
where not exists (select 1 from preguntas_frecuentes where pregunta = '¿Cómo debo conservar los productos?');
insert into preguntas_frecuentes (categoria, pregunta, respuesta, orden, visible)
select 'productos', '¿Qué snack es mejor para mi perro?', 'Depende del tamaño, la edad y la fuerza de mordida. Para cachorros y perros pequeños recomendamos dureza suave (bofe, pejerrey) o tráquea de cordero. Para adultos, la dureza media cubre casi todo. Para masticadores fuertes, larga duración. Puedes filtrar el catálogo por tamaño y edad, o escribirnos por WhatsApp y te ayudamos a elegir.', 2, true
where not exists (select 1 from preguntas_frecuentes where pregunta = '¿Qué snack es mejor para mi perro?');
insert into preguntas_frecuentes (categoria, pregunta, respuesta, orden, visible)
select 'productos', '¿Cómo elijo el nivel de dureza?', 'Dureza suave: se deshace con facilidad, ideal como premio frecuente y para bocas sensibles. Dureza media: requiere masticación real, aporta colágeno y ayuda a la limpieza dental. Larga duración: cuernos y pezuñas, muy resistentes, pensados para perros que destruyen todo. Estos últimos no son recomendables para cachorros ni para perros con problemas dentales.', 3, true
where not exists (select 1 from preguntas_frecuentes where pregunta = '¿Cómo elijo el nivel de dureza?');
insert into preguntas_frecuentes (categoria, pregunta, respuesta, orden, visible)
select 'productos', '¿Debo supervisar a mi perro mientras come el snack?', 'Sí, siempre. Supervisa a tu mascota durante el consumo del producto para evitar atoramientos o posibles reacciones alérgicas, y retira las piezas cuando queden en trozos lo bastante pequeños como para tragarse enteros.', 4, true
where not exists (select 1 from preguntas_frecuentes where pregunta = '¿Debo supervisar a mi perro mientras come el snack?');
insert into preguntas_frecuentes (categoria, pregunta, respuesta, orden, visible)
select 'pedidos', '¿Realizan delivery?', 'Sí, hacemos delivery en Lima Metropolitana. El costo depende del distrito y se confirma al momento de coordinar el pedido. También puedes elegir recojo en tienda sin costo adicional.', 5, true
where not exists (select 1 from preguntas_frecuentes where pregunta = '¿Realizan delivery?');
insert into preguntas_frecuentes (categoria, pregunta, respuesta, orden, visible)
select 'pedidos', '¿Qué métodos de pago aceptan?', 'Yape, Plin, transferencia bancaria y pago contra entrega. Estamos trabajando en habilitar el pago con tarjeta directamente desde la web.', 6, true
where not exists (select 1 from preguntas_frecuentes where pregunta = '¿Qué métodos de pago aceptan?');
insert into preguntas_frecuentes (categoria, pregunta, respuesta, orden, visible)
select 'puntos', '¿Cómo funciona el programa de puntos?', 'Al registrarte entras automáticamente al Club Cocina Canina. Por cada S/ 10.00 de compra acumulas 1 punto, y esos puntos se canjean por descuentos, envíos gratis o productos. La equivalencia puede variar durante campañas de puntos dobles o triples.', 7, true
where not exists (select 1 from preguntas_frecuentes where pregunta = '¿Cómo funciona el programa de puntos?');
insert into preguntas_frecuentes (categoria, pregunta, respuesta, orden, visible)
select 'puntos', '¿Cuándo se acreditan mis puntos?', 'Los puntos aparecen como “pendientes” apenas confirmas el pedido y pasan a “disponibles” 48 horas después de que el pedido figura como entregado. Ese margen existe para cubrir cambios o anulaciones.', 8, true
where not exists (select 1 from preguntas_frecuentes where pregunta = '¿Cuándo se acreditan mis puntos?');
insert into preguntas_frecuentes (categoria, pregunta, respuesta, orden, visible)
select 'puntos', '¿Los puntos vencen?', 'Sí. Los puntos tienen una vigencia de 12 meses desde la fecha en que se acreditan. En tu panel puedes ver la fecha exacta de vencimiento de cada bloque de puntos.', 9, true
where not exists (select 1 from preguntas_frecuentes where pregunta = '¿Los puntos vencen?');
insert into preguntas_frecuentes (categoria, pregunta, respuesta, orden, visible)
select 'mayor', '¿Cómo hago un pedido por mayor?', 'Completa el formulario de cotización en la sección “Compra por mayor” indicando los productos y cantidades que necesitas. Te respondemos con una cotización formal, disponibilidad y fecha de entrega.', 10, true
where not exists (select 1 from preguntas_frecuentes where pregunta = '¿Cómo hago un pedido por mayor?');
insert into preguntas_frecuentes (categoria, pregunta, respuesta, orden, visible)
select 'mayor', '¿Con cuánto tiempo debo solicitar un pedido grande?', 'Los pedidos por mayor deben solicitarse con al menos tres días de anticipación, porque se producen por lote. En campañas o fechas altas conviene avisar con una semana.', 11, true
where not exists (select 1 from preguntas_frecuentes where pregunta = '¿Con cuánto tiempo debo solicitar un pedido grande?');
insert into preguntas_frecuentes (categoria, pregunta, respuesta, orden, visible)
select 'barf', '¿La alimentación BARF requiere refrigeración?', 'Sí. El BARF se entrega congelado y debe mantenerse así hasta el día antes de servirlo. Para descongelar, pasa la porción del congelador a la refrigeradora la noche anterior; nunca a temperatura ambiente ni en microondas. Una vez descongelada, la ración dura hasta 48 horas en refrigeración.', 12, true
where not exists (select 1 from preguntas_frecuentes where pregunta = '¿La alimentación BARF requiere refrigeración?');
insert into preguntas_frecuentes (categoria, pregunta, respuesta, orden, visible)
select 'barf', '¿Cuánto BARF necesita mi perro al día?', 'Como referencia, un perro adulto consume entre 2% y 3% de su peso corporal al día, y un cachorro entre 4% y 8% según su edad. En la página de BARF tenemos un calculador orientativo. Es una guía de compra y no reemplaza la asesoría de tu veterinario.', 13, true
where not exists (select 1 from preguntas_frecuentes where pregunta = '¿Cuánto BARF necesita mi perro al día?');

-- ------------------------------- Testimonios ------------------------------
insert into testimonios (mascota, dueno, foto_url, producto, calificacion, comentario, publicado, orden)
select 'Rocco', 'Andrea Salazar', null, 'Tráquea de res', 5, 'Rocco tenía problemas de cadera y el veterinario nos recomendó colágeno. Las tráqueas se volvieron su premio de cada noche y ya no le tengo que esconder nada raro en la comida.', true, 0
where not exists (select 1 from testimonios where mascota = 'Rocco' and dueno = 'Andrea Salazar');
insert into testimonios (mascota, dueno, foto_url, producto, calificacion, comentario, publicado, orden)
select 'Luna', 'Diego Paredes', null, 'Patitas de pollo', 5, 'Compro el kilo cada mes. Luna es ansiosa y masticar la calma muchísimo; además el pelaje le quedó brilloso. El empaque llega siempre bien sellado.', true, 1
where not exists (select 1 from testimonios where mascota = 'Luna' and dueno = 'Diego Paredes');
insert into testimonios (mascota, dueno, foto_url, producto, calificacion, comentario, publicado, orden)
select 'Simón', 'Claudia Rivas', null, 'BARF Res–Pollo', 5, 'Pasamos a BARF hace cuatro meses. Me ayudaron con las porciones según su peso y la entrega es puntual. Simón bajó los dos kilos que le sobraban.', true, 2
where not exists (select 1 from testimonios where mascota = 'Simón' and dueno = 'Claudia Rivas');
insert into testimonios (mascota, dueno, foto_url, producto, calificacion, comentario, publicado, orden)
select 'Kira', 'Renzo Camacho', null, 'Oreja de cerdo', 4, 'Kira es una labradora que destruye todo. La oreja de cerdo le dura poco pero le encanta; ahora estoy probando el cuerno de res para que dure más.', true, 3
where not exists (select 1 from testimonios where mascota = 'Kira' and dueno = 'Renzo Camacho');
insert into testimonios (mascota, dueno, foto_url, producto, calificacion, comentario, publicado, orden)
select 'Nube', 'Valeria Ochoa', null, 'Pejerrey', 5, 'Mi perrita es alérgica al pollo y encontrar snacks es un dolor de cabeza. El pejerrey es de un solo ingrediente y no le cayó mal nada. Enorme alivio.', true, 4
where not exists (select 1 from testimonios where mascota = 'Nube' and dueno = 'Valeria Ochoa');
insert into testimonios (mascota, dueno, foto_url, producto, calificacion, comentario, publicado, orden)
select 'Tomás', 'Gonzalo Prieto', null, 'Trío Pork Chew', 5, 'Pedí por WhatsApp un viernes y me llegó el sábado temprano. Buen precio y responden rapidísimo cuando uno pregunta qué snack le conviene a cada perro.', true, 5
where not exists (select 1 from testimonios where mascota = 'Tomás' and dueno = 'Gonzalo Prieto');

-- ------------------------------- Configuración ----------------------------
insert into configuracion (clave, valor) values ('empresa', '{"nombre":"La Cocina Canina","ruc":"","razonSocial":"","direccion":""}'::jsonb)
on conflict (clave) do update set valor = excluded.valor;
insert into configuracion (clave, valor) values ('contacto', '{"nombre":"La Cocina Canina","descripcion":"Snacks deshidratados y alimentación BARF elaborados con ingredientes naturales en Perú.","telefono":"922 035 995","whatsapp":"51922035995","instagram":"lacocinacanina","tiktok":"lacocinacanina","correo":"hola@lacocinacanina.pe","ciudad":"Lima, Perú","horario":"Lunes a sábado, 9:00 a 19:00"}'::jsonb)
on conflict (clave) do update set valor = excluded.valor;
insert into configuracion (clave, valor) values ('entrega', '{"metodos":[{"id":"delivery","nombre":"Delivery","detalle":"Lima Metropolitana. Costo según distrito, se confirma por WhatsApp.","costo":12},{"id":"recojo","nombre":"Recojo en tienda","detalle":"Coordina el horario y recoge tu pedido sin costo adicional.","costo":0}],"envioGratisDesde":150}'::jsonb)
on conflict (clave) do update set valor = excluded.valor;
insert into configuracion (clave, valor) values ('pago', '{"metodos":[{"id":"yape","nombre":"Yape","detalle":"Al 922 035 995","activo":true},{"id":"plin","nombre":"Plin","detalle":"Al 922 035 995","activo":true},{"id":"transferencia","nombre":"Transferencia bancaria","detalle":"BCP / Interbank","activo":true},{"id":"contra-entrega","nombre":"Pago contra entrega","detalle":"Efectivo al recibir el pedido","activo":true},{"id":"pasarela","nombre":"Tarjeta de crédito o débito","detalle":"Próximamente","activo":false}]}'::jsonb)
on conflict (clave) do update set valor = excluded.valor;
insert into configuracion (clave, valor) values ('integraciones', '{"whatsapp":"51922035995","instagram":"lacocinacanina","tiktok":"lacocinacanina","analytics":"","metaPixel":"","botonFlotante":true,"pedidoSinRegistro":true,"mostrarAgotados":true,"mantenimiento":false}'::jsonb)
on conflict (clave) do update set valor = excluded.valor;
insert into configuracion (clave, valor) values ('colores', '{"hoja":"#4F9A4A","coral":"#E8735A","ambar":"#D99A2B","crema":"#FDFAF5"}'::jsonb)
on conflict (clave) do update set valor = excluded.valor;

-- ----------------------------- Roles y permisos ---------------------------
insert into rol_permisos (rol, grupo, permitido)
values ('administrador'::rol_staff, 'Operación', true)
on conflict (rol, grupo) do update set permitido = excluded.permitido;
insert into rol_permisos (rol, grupo, permitido)
values ('administrador'::rol_staff, 'Catálogo', true)
on conflict (rol, grupo) do update set permitido = excluded.permitido;
insert into rol_permisos (rol, grupo, permitido)
values ('administrador'::rol_staff, 'Clientes', true)
on conflict (rol, grupo) do update set permitido = excluded.permitido;
insert into rol_permisos (rol, grupo, permitido)
values ('administrador'::rol_staff, 'Contenido', true)
on conflict (rol, grupo) do update set permitido = excluded.permitido;
insert into rol_permisos (rol, grupo, permitido)
values ('administrador'::rol_staff, 'Sistema', true)
on conflict (rol, grupo) do update set permitido = excluded.permitido;
insert into rol_permisos (rol, grupo, permitido)
values ('produccion'::rol_staff, 'Operación', true)
on conflict (rol, grupo) do update set permitido = excluded.permitido;
insert into rol_permisos (rol, grupo, permitido)
values ('produccion'::rol_staff, 'Catálogo', true)
on conflict (rol, grupo) do update set permitido = excluded.permitido;
insert into rol_permisos (rol, grupo, permitido)
values ('produccion'::rol_staff, 'Clientes', false)
on conflict (rol, grupo) do update set permitido = excluded.permitido;
insert into rol_permisos (rol, grupo, permitido)
values ('produccion'::rol_staff, 'Contenido', false)
on conflict (rol, grupo) do update set permitido = excluded.permitido;
insert into rol_permisos (rol, grupo, permitido)
values ('produccion'::rol_staff, 'Sistema', false)
on conflict (rol, grupo) do update set permitido = excluded.permitido;
insert into rol_permisos (rol, grupo, permitido)
values ('reparto'::rol_staff, 'Operación', true)
on conflict (rol, grupo) do update set permitido = excluded.permitido;
insert into rol_permisos (rol, grupo, permitido)
values ('reparto'::rol_staff, 'Catálogo', false)
on conflict (rol, grupo) do update set permitido = excluded.permitido;
insert into rol_permisos (rol, grupo, permitido)
values ('reparto'::rol_staff, 'Clientes', false)
on conflict (rol, grupo) do update set permitido = excluded.permitido;
insert into rol_permisos (rol, grupo, permitido)
values ('reparto'::rol_staff, 'Contenido', false)
on conflict (rol, grupo) do update set permitido = excluded.permitido;
insert into rol_permisos (rol, grupo, permitido)
values ('reparto'::rol_staff, 'Sistema', false)
on conflict (rol, grupo) do update set permitido = excluded.permitido;
insert into rol_permisos (rol, grupo, permitido)
values ('contenido'::rol_staff, 'Operación', false)
on conflict (rol, grupo) do update set permitido = excluded.permitido;
insert into rol_permisos (rol, grupo, permitido)
values ('contenido'::rol_staff, 'Catálogo', false)
on conflict (rol, grupo) do update set permitido = excluded.permitido;
insert into rol_permisos (rol, grupo, permitido)
values ('contenido'::rol_staff, 'Clientes', false)
on conflict (rol, grupo) do update set permitido = excluded.permitido;
insert into rol_permisos (rol, grupo, permitido)
values ('contenido'::rol_staff, 'Contenido', true)
on conflict (rol, grupo) do update set permitido = excluded.permitido;
insert into rol_permisos (rol, grupo, permitido)
values ('contenido'::rol_staff, 'Sistema', false)
on conflict (rol, grupo) do update set permitido = excluded.permitido;
insert into rol_permisos (rol, grupo, permitido)
values ('atencion'::rol_staff, 'Operación', true)
on conflict (rol, grupo) do update set permitido = excluded.permitido;
insert into rol_permisos (rol, grupo, permitido)
values ('atencion'::rol_staff, 'Catálogo', false)
on conflict (rol, grupo) do update set permitido = excluded.permitido;
insert into rol_permisos (rol, grupo, permitido)
values ('atencion'::rol_staff, 'Clientes', true)
on conflict (rol, grupo) do update set permitido = excluded.permitido;
insert into rol_permisos (rol, grupo, permitido)
values ('atencion'::rol_staff, 'Contenido', false)
on conflict (rol, grupo) do update set permitido = excluded.permitido;
insert into rol_permisos (rol, grupo, permitido)
values ('atencion'::rol_staff, 'Sistema', false)
on conflict (rol, grupo) do update set permitido = excluded.permitido;

-- --------------------------------- Banners --------------------------------
insert into banners (nombre, ubicacion, imagen_url, titulo, boton, enlace, desde, hasta, activo, orden)
select 'Hero principal', 'Inicio · portada', '/mascota/saltando.png', 'Lo mejor para tu mejor amigo', 'Ver productos', '/productos', '2026-01-01'::date, '2026-12-31'::date, true, 0
where not exists (select 1 from banners where nombre = 'Hero principal');
insert into banners (nombre, ubicacion, imagen_url, titulo, boton, enlace, desde, hasta, activo, orden)
select 'Campaña BARF', 'Inicio · sección BARF', '/productos/barf.png', 'Alimentación natural diseñada para ellos', 'Ver planes BARF', '/barf', '2026-07-01'::date, '2026-08-31'::date, true, 1
where not exists (select 1 from banners where nombre = 'Campaña BARF');
insert into banners (nombre, ubicacion, imagen_url, titulo, boton, enlace, desde, hasta, activo, orden)
select 'Compra por mayor', 'Inicio · bloque mayorista', '/empaques/snacks-bolsa-res.png', 'Precios especiales para tiendas', 'Solicitar cotización', '/por-mayor', '2026-01-01'::date, '2026-12-31'::date, true, 2
where not exists (select 1 from banners where nombre = 'Compra por mayor');

-- =============================================================================
-- Para convertir tu usuario en administrador, después de registrarte:
--
--   insert into staff (id, nombre, correo, rol)
--   select id, 'Tu nombre', email, 'administrador' from auth.users
--    where email = 'tucorreo@ejemplo.pe'
--   on conflict (id) do update set rol = 'administrador', activo = true;
-- =============================================================================
