-- =============================================================================
-- La Cocina Canina — esquema PostgreSQL para Supabase
--
-- El prototipo funciona hoy con los arreglos de `src/data`. Este archivo define
-- el destino: cada tabla corresponde a una interfaz de `src/lib/tipos.ts`, de
-- modo que al conectar Supabase solo haya que reemplazar los imports de datos
-- por consultas, sin tocar los componentes.
--
-- Incluye Row Level Security: el catálogo es público de solo lectura, cada
-- cliente ve únicamente sus propios datos y el personal opera según su rol.
-- =============================================================================

create extension if not exists "pgcrypto";

-- ------------------------------- Enumerados ---------------------------------

create type dureza          as enum ('suave', 'media', 'larga-duracion');
create type tamano_perro    as enum ('pequeno', 'mediano', 'grande');
create type edad_perro      as enum ('cachorro', 'adulto', 'senior');
create type tipo_presentacion as enum ('gramos', 'unidades', 'kilogramos', 'talla');
create type estado_pedido   as enum ('pendiente','confirmado','preparando','listo','en-camino','entregado','cancelado');
create type estado_puntos   as enum ('pendiente','disponible','canjeado','vencido','cancelado');
create type tipo_recompensa as enum ('descuento-fijo','descuento-porcentual','producto-gratis','envio-gratis','cupon','regalo');
create type rol_staff       as enum ('administrador','produccion','reparto','contenido','atencion');

-- --------------------------------- Catálogo ---------------------------------

create table categorias (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  nombre        text not null,
  descripcion   text,
  icono         text,
  imagen_url    text,
  acento        text,
  orden         int  not null default 0,
  visible       bool not null default true,
  creado_en     timestamptz not null default now()
);

create table productos (
  id                  uuid primary key default gen_random_uuid(),
  slug                text unique not null,
  nombre              text not null,
  categoria_id        uuid not null references categorias(id) on delete restrict,
  dureza              dureza not null,
  proteinas           text[] not null default '{}',
  beneficio_principal text,
  descripcion         text,
  beneficios          text[] not null default '{}',
  ingredientes        text[] not null default '{}',
  minerales           text,
  tamanos             tamano_perro[] not null default '{}',
  edades              edad_perro[]   not null default '{}',
  imagen_url          text,
  galeria             text[] not null default '{}',
  etiquetas           text[] not null default '{}',
  destacado           bool not null default false,
  activo              bool not null default true,
  conservacion        text,
  advertencia         text,
  disponible_mayor    bool not null default false,
  ventas              int  not null default 0,
  orden               int  not null default 0,
  creado_en           timestamptz not null default now(),
  actualizado_en      timestamptz not null default now()
);

create index on productos (categoria_id);
create index on productos (activo, destacado);

create table presentaciones (
  id           uuid primary key default gen_random_uuid(),
  producto_id  uuid not null references productos(id) on delete cascade,
  etiqueta     text not null,
  tipo         tipo_presentacion not null,
  precio       numeric(10,2) not null check (precio >= 0),
  stock        int not null default 0 check (stock >= 0),
  orden        int not null default 0
);

create index on presentaciones (producto_id);

create table productos_relacionados (
  producto_id    uuid references productos(id) on delete cascade,
  relacionado_id uuid references productos(id) on delete cascade,
  primary key (producto_id, relacionado_id)
);

-- ----------------------------------- BARF -----------------------------------

create table productos_barf (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  nombre      text not null,
  proteinas   text[] not null default '{}',
  descripcion text,
  composicion text[] not null default '{}',
  beneficios  text[] not null default '{}',
  imagen_url  text,
  activo      bool not null default true
);

create table barf_rangos (
  id         uuid primary key default gen_random_uuid(),
  barf_id    uuid not null references productos_barf(id) on delete cascade,
  desde_kg   int not null,
  hasta_kg   int,                       -- null = "a más"
  precio_kg  numeric(10,2) not null check (precio_kg >= 0)
);

-- -------------------------------- Por mayor ---------------------------------

create table lotes_mayor (
  id        uuid primary key default gen_random_uuid(),
  slug      text unique not null,
  nombre    text not null,
  unidad    text not null,
  minimo    text not null,
  imagen_url text,
  nota      text,
  activo    bool not null default true
);

create table lotes_mayor_precios (
  id       uuid primary key default gen_random_uuid(),
  lote_id  uuid not null references lotes_mayor(id) on delete cascade,
  etiqueta text not null,
  precio   numeric(10,2) not null check (precio >= 0)
);

create table cotizaciones_mayor (
  id            uuid primary key default gen_random_uuid(),
  negocio       text not null,
  ruc           text,
  tipo_negocio  text,
  telefono      text not null,
  correo        text not null,
  productos     text not null,
  cantidad      text not null,
  fecha_requerida date not null,
  mensaje       text,
  estado        text not null default 'pendiente',
  creado_en     timestamptz not null default now()
);

-- --------------------------- Clientes y mascotas ----------------------------

-- Extiende auth.users
create table perfiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  nombres     text not null,
  apellidos   text,
  correo      text not null,
  celular     text,
  nacimiento  date,
  puntos      int not null default 0 check (puntos >= 0),
  creado_en   timestamptz not null default now()
);

create table mascotas (
  id            uuid primary key default gen_random_uuid(),
  perfil_id     uuid not null references perfiles(id) on delete cascade,
  nombre        text not null,
  foto_url      text,
  especie       text not null default 'Perro',
  raza          text,
  nacimiento    date,
  peso_kg       numeric(5,2),
  alergias      text[] not null default '{}',
  preferencias  text[] not null default '{}',
  creado_en     timestamptz not null default now()
);

create index on mascotas (perfil_id);

create table favoritos (
  perfil_id   uuid references perfiles(id) on delete cascade,
  producto_id uuid references productos(id) on delete cascade,
  creado_en   timestamptz not null default now(),
  primary key (perfil_id, producto_id)
);

create table direcciones (
  id             uuid primary key default gen_random_uuid(),
  perfil_id      uuid not null references perfiles(id) on delete cascade,
  alias          text not null,
  linea          text not null,
  distrito       text not null,
  referencia     text,
  predeterminada bool not null default false
);

-- --------------------------------- Pedidos ----------------------------------

create table pedidos (
  id              uuid primary key default gen_random_uuid(),
  numero          text unique not null,
  perfil_id       uuid references perfiles(id) on delete set null,
  -- datos de contacto (permiten pedidos sin registro)
  nombres         text not null,
  apellidos       text,
  correo          text,
  celular         text not null,
  entrega         text not null,          -- delivery | recojo
  direccion       text,
  distrito        text,
  referencia      text,
  metodo_pago     text not null,
  estado          estado_pedido not null default 'pendiente',
  subtotal        numeric(10,2) not null,
  descuento       numeric(10,2) not null default 0,
  envio           numeric(10,2) not null default 0,
  total           numeric(10,2) not null,
  cupon_codigo    text,
  puntos_generados int not null default 0,
  notas           text,
  creado_en       timestamptz not null default now()
);

create index on pedidos (perfil_id);
create index on pedidos (estado, creado_en desc);

create table pedido_lineas (
  id               uuid primary key default gen_random_uuid(),
  pedido_id        uuid not null references pedidos(id) on delete cascade,
  producto_id      uuid references productos(id) on delete set null,
  barf_id          uuid references productos_barf(id) on delete set null,
  nombre           text not null,        -- se congela por si el producto cambia
  presentacion     text not null,
  precio_unitario  numeric(10,2) not null,
  cantidad         int not null check (cantidad > 0),
  kilos            numeric(6,2),
  frecuencia       text
);

create table pedido_historial (
  id         uuid primary key default gen_random_uuid(),
  pedido_id  uuid not null references pedidos(id) on delete cascade,
  estado     estado_pedido not null,
  nota       text,
  autor_id   uuid references auth.users(id) on delete set null,
  creado_en  timestamptz not null default now()
);

-- ------------------------------- Recompensas --------------------------------

create table reglas_puntos (
  id                uuid primary key default gen_random_uuid(),
  monto_por_punto   numeric(10,2) not null default 10,
  puntos_otorgados  int not null default 1,
  vigencia_desde    date not null,
  vigencia_hasta    date not null,
  compra_minima     numeric(10,2) not null default 0,
  multiplicador     int not null default 1,
  campana           text,
  activa            bool not null default true
);

create table regla_productos (
  regla_id    uuid references reglas_puntos(id) on delete cascade,
  producto_id uuid references productos(id) on delete cascade,
  primary key (regla_id, producto_id)
);

create table recompensas (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  descripcion text,
  puntos      int not null check (puntos > 0),
  tipo        tipo_recompensa not null,
  valor       numeric(10,2),
  icono       text,
  activa      bool not null default true
);

create table movimientos_puntos (
  id            uuid primary key default gen_random_uuid(),
  perfil_id     uuid not null references perfiles(id) on delete cascade,
  pedido_id     uuid references pedidos(id) on delete set null,
  recompensa_id uuid references recompensas(id) on delete set null,
  concepto      text not null,
  puntos        int not null,             -- negativo al canjear
  estado        estado_puntos not null default 'pendiente',
  vence_en      date,
  creado_en     timestamptz not null default now()
);

create index on movimientos_puntos (perfil_id, creado_en desc);

create table cupones (
  id            uuid primary key default gen_random_uuid(),
  codigo        text unique not null,
  descripcion   text,
  tipo          tipo_recompensa not null,
  valor         numeric(10,2) not null,
  compra_minima numeric(10,2) not null default 0,
  usos_maximos  int,
  usos          int not null default 0,
  vence_en      date,
  activo        bool not null default true
);

create table cupones_perfil (
  perfil_id uuid references perfiles(id) on delete cascade,
  cupon_id  uuid references cupones(id) on delete cascade,
  usado     bool not null default false,
  primary key (perfil_id, cupon_id)
);

-- --------------------------------- Contenido --------------------------------

create table contenido_web (
  clave       text primary key,          -- p. ej. 'hero.titulo'
  valor       jsonb not null,
  actualizado timestamptz not null default now()
);

create table secciones_inicio (
  id       uuid primary key default gen_random_uuid(),
  clave    text unique not null,
  nombre   text not null,
  orden    int not null default 0,
  visible  bool not null default true
);

create table banners (
  id         uuid primary key default gen_random_uuid(),
  nombre     text not null,
  ubicacion  text not null,
  imagen_url text,
  titulo     text,
  texto      text,
  boton      text,
  enlace     text,
  desde      date,
  hasta      date,
  activo     bool not null default true,
  orden      int not null default 0
);

create table preguntas_frecuentes (
  id        uuid primary key default gen_random_uuid(),
  categoria text not null,
  pregunta  text not null,
  respuesta text not null,
  orden     int not null default 0,
  visible   bool not null default true
);

create table testimonios (
  id           uuid primary key default gen_random_uuid(),
  mascota      text not null,
  dueno        text not null,
  foto_url     text,
  producto     text,
  calificacion int not null check (calificacion between 1 and 5),
  comentario   text not null,
  publicado    bool not null default false,
  creado_en    timestamptz not null default now()
);

create table configuracion (
  clave text primary key,
  valor jsonb not null
);

-- ------------------------------ Personal / roles ----------------------------

create table staff (
  id        uuid primary key references auth.users(id) on delete cascade,
  nombre    text not null,
  rol       rol_staff not null default 'atencion',
  activo    bool not null default true,
  creado_en timestamptz not null default now()
);

create or replace function es_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from staff where id = auth.uid() and activo);
$$;

create or replace function es_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from staff
    where id = auth.uid() and activo and rol = 'administrador'
  );
$$;

-- =============================================================================
-- Row Level Security
-- =============================================================================

-- Catálogo y contenido: lectura pública, escritura solo para el personal.
do $$
declare t text;
begin
  foreach t in array array[
    'categorias','productos','presentaciones','productos_relacionados',
    'productos_barf','barf_rangos','lotes_mayor','lotes_mayor_precios',
    'recompensas','reglas_puntos','regla_productos',
    'contenido_web','secciones_inicio','banners','preguntas_frecuentes',
    'testimonios','configuracion'
  ]
  loop
    execute format('alter table %I enable row level security', t);
    execute format(
      'create policy "lectura publica" on %I for select using (true)', t);
    execute format(
      'create policy "escritura staff" on %I for all using (es_staff()) with check (es_staff())', t);
  end loop;
end $$;

-- Datos personales: cada cliente ve y edita solo lo suyo; el staff puede leer.
do $$
declare t text;
begin
  foreach t in array array['mascotas','direcciones','favoritos','movimientos_puntos']
  loop
    execute format('alter table %I enable row level security', t);
    execute format(
      'create policy "dueno gestiona" on %I for all using (perfil_id = auth.uid()) with check (perfil_id = auth.uid())', t);
    execute format(
      'create policy "staff consulta" on %I for select using (es_staff())', t);
  end loop;
end $$;

alter table perfiles enable row level security;
create policy "perfil propio" on perfiles
  for all using (id = auth.uid()) with check (id = auth.uid());
create policy "staff consulta perfiles" on perfiles
  for select using (es_staff());

alter table pedidos enable row level security;
create policy "pedidos propios" on pedidos
  for select using (perfil_id = auth.uid());
create policy "crear pedido" on pedidos
  for insert with check (perfil_id = auth.uid() or perfil_id is null);
create policy "staff gestiona pedidos" on pedidos
  for all using (es_staff()) with check (es_staff());

alter table pedido_lineas enable row level security;
create policy "lineas del propio pedido" on pedido_lineas
  for select using (
    exists (select 1 from pedidos p where p.id = pedido_id and p.perfil_id = auth.uid())
  );
create policy "staff gestiona lineas" on pedido_lineas
  for all using (es_staff()) with check (es_staff());

alter table pedido_historial enable row level security;
create policy "staff gestiona historial" on pedido_historial
  for all using (es_staff()) with check (es_staff());

alter table cupones enable row level security;
create policy "cupones activos visibles" on cupones
  for select using (activo);
create policy "staff gestiona cupones" on cupones
  for all using (es_staff()) with check (es_staff());

alter table cupones_perfil enable row level security;
create policy "cupones propios" on cupones_perfil
  for all using (perfil_id = auth.uid()) with check (perfil_id = auth.uid());

alter table cotizaciones_mayor enable row level security;
create policy "cualquiera solicita cotizacion" on cotizaciones_mayor
  for insert with check (true);
create policy "staff gestiona cotizaciones" on cotizaciones_mayor
  for all using (es_staff()) with check (es_staff());

alter table staff enable row level security;
create policy "staff se ve a si mismo" on staff
  for select using (id = auth.uid() or es_staff());
create policy "solo admin gestiona staff" on staff
  for all using (es_admin()) with check (es_admin());

-- =============================================================================
-- Automatismos
-- =============================================================================

-- Perfil automático al registrarse
create or replace function crear_perfil() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into perfiles (id, nombres, correo)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombres', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end $$;

create trigger al_crear_usuario
  after insert on auth.users
  for each row execute function crear_perfil();

-- Mantener sincronizado el saldo de puntos del perfil
create or replace function recalcular_puntos() returns trigger
language plpgsql security definer set search_path = public as $$
declare objetivo uuid := coalesce(new.perfil_id, old.perfil_id);
begin
  update perfiles p
     set puntos = coalesce((
       select sum(m.puntos) from movimientos_puntos m
        where m.perfil_id = objetivo and m.estado in ('disponible','canjeado')
     ), 0)
   where p.id = objetivo;
  return null;
end $$;

create trigger sincronizar_puntos
  after insert or update or delete on movimientos_puntos
  for each row execute function recalcular_puntos();

-- Descontar stock al confirmar un pedido
create or replace function descontar_stock() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.estado = 'confirmado' and old.estado = 'pendiente' then
    update presentaciones v
       set stock = greatest(0, v.stock - l.cantidad)
      from pedido_lineas l
     where l.pedido_id = new.id
       and v.producto_id = l.producto_id
       and v.etiqueta = l.presentacion;
  end if;
  return new;
end $$;

create trigger al_confirmar_pedido
  after update of estado on pedidos
  for each row execute function descontar_stock();
