-- =============================================================================
-- La Cocina Canina — 01. Estructura
--
-- Ejecutar en el SQL Editor de Supabase en este orden:
--   01_schema.sql  ← estructura, funciones y triggers
--   02_rls.sql     ← políticas de seguridad por fila
--   03_storage.sql ← buckets de imágenes
--   04_seed.sql    ← catálogo y contenido inicial
-- =============================================================================

create extension if not exists "pgcrypto";
create extension if not exists "unaccent";

-- ------------------------------- Enumerados ---------------------------------

do $$ begin
  create type dureza            as enum ('suave', 'media', 'larga-duracion');
  create type tamano_perro      as enum ('pequeno', 'mediano', 'grande');
  create type edad_perro        as enum ('cachorro', 'adulto', 'senior');
  create type tipo_presentacion as enum ('gramos', 'unidades', 'kilogramos', 'talla');
  create type estado_pedido     as enum ('pendiente','confirmado','preparando','listo','en-camino','entregado','cancelado');
  create type estado_puntos     as enum ('pendiente','disponible','canjeado','vencido','cancelado');
  create type tipo_recompensa   as enum ('descuento-fijo','descuento-porcentual','producto-gratis','envio-gratis','cupon','regalo');
  create type rol_staff         as enum ('administrador','produccion','reparto','contenido','atencion');
  create type estado_cotizacion as enum ('pendiente','cotizado','aprobado','rechazado');
exception when duplicate_object then null;
end $$;

-- --------------------------- Personal y permisos ----------------------------

create table if not exists staff (
  id        uuid primary key references auth.users(id) on delete cascade,
  nombre    text not null,
  correo    text not null,
  rol       rol_staff not null default 'atencion',
  activo    bool not null default true,
  ultimo_acceso timestamptz,
  creado_en timestamptz not null default now()
);

-- Qué grupos de módulos del CMS ve cada rol.
create table if not exists rol_permisos (
  rol       rol_staff not null,
  grupo     text not null,
  permitido bool not null default true,
  primary key (rol, grupo)
);

create or replace function es_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from staff where id = auth.uid() and activo);
$$;

create or replace function es_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from staff where id = auth.uid() and activo and rol = 'administrador'
  );
$$;

create or replace function puede_grupo(nombre_grupo text) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1
      from staff s
      join rol_permisos p on p.rol = s.rol
     where s.id = auth.uid() and s.activo
       and p.grupo = nombre_grupo and p.permitido
  );
$$;

-- --------------------------------- Catálogo ---------------------------------

create table if not exists categorias (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  nombre           text not null,
  descripcion_corta text,
  descripcion      text,
  icono            text,
  imagen_url       text,
  acento           text,
  orden            int  not null default 0,
  visible          bool not null default true,
  creado_en        timestamptz not null default now()
);

create table if not exists productos (
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

create index if not exists productos_categoria_idx on productos (categoria_id);
create index if not exists productos_activo_idx    on productos (activo, destacado);

create table if not exists presentaciones (
  id           uuid primary key default gen_random_uuid(),
  producto_id  uuid not null references productos(id) on delete cascade,
  codigo       text not null,                    -- '70g', '1u', 's'…
  etiqueta     text not null,
  tipo         tipo_presentacion not null,
  precio       numeric(10,2) not null check (precio >= 0),
  stock        int not null default 0 check (stock >= 0),
  orden        int not null default 0,
  unique (producto_id, codigo)
);

create index if not exists presentaciones_producto_idx on presentaciones (producto_id);

create table if not exists productos_relacionados (
  producto_id    uuid references productos(id) on delete cascade,
  relacionado_id uuid references productos(id) on delete cascade,
  primary key (producto_id, relacionado_id),
  check (producto_id <> relacionado_id)
);

-- ----------------------------------- BARF -----------------------------------

create table if not exists productos_barf (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  nombre      text not null,
  proteinas   text[] not null default '{}',
  descripcion text,
  composicion text[] not null default '{}',
  beneficios  text[] not null default '{}',
  imagen_url  text,
  color       text,
  orden       int  not null default 0,
  activo      bool not null default true
);

create table if not exists barf_rangos (
  id        uuid primary key default gen_random_uuid(),
  barf_id   uuid not null references productos_barf(id) on delete cascade,
  desde_kg  int not null,
  hasta_kg  int,                                  -- null = "a más"
  precio_kg numeric(10,2) not null check (precio_kg >= 0)
);

-- -------------------------------- Por mayor ---------------------------------

create table if not exists lotes_mayor (
  id         uuid primary key default gen_random_uuid(),
  slug       text unique not null,
  nombre     text not null,
  productos  text[] not null default '{}',
  unidad     text not null,
  minimo     text not null,
  imagen_url text,
  nota       text,
  orden      int  not null default 0,
  activo     bool not null default true
);

create table if not exists lotes_mayor_precios (
  id       uuid primary key default gen_random_uuid(),
  lote_id  uuid not null references lotes_mayor(id) on delete cascade,
  etiqueta text not null,
  precio   numeric(10,2) not null check (precio >= 0),
  orden    int not null default 0
);

create table if not exists cotizaciones_mayor (
  id              uuid primary key default gen_random_uuid(),
  codigo          text unique not null,
  negocio         text not null,
  ruc             text,
  tipo_negocio    text,
  telefono        text not null,
  correo          text not null,
  productos       text not null,
  cantidad        text not null,
  fecha_requerida date not null,
  mensaje         text,
  estado          estado_cotizacion not null default 'pendiente',
  monto           numeric(10,2),
  creado_en       timestamptz not null default now()
);

-- --------------------------- Clientes y mascotas ----------------------------

create table if not exists perfiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  nombres    text not null,
  apellidos  text,
  correo     text not null,
  celular    text,
  nacimiento date,
  puntos     int not null default 0,
  acepta_novedades bool not null default true,
  creado_en  timestamptz not null default now()
);

create table if not exists mascotas (
  id           uuid primary key default gen_random_uuid(),
  perfil_id    uuid not null references perfiles(id) on delete cascade,
  nombre       text not null,
  foto_url     text,
  especie      text not null default 'Perro',
  raza         text,
  nacimiento   date,
  peso_kg      numeric(5,2),
  alergias     text[] not null default '{}',
  preferencias text[] not null default '{}',
  creado_en    timestamptz not null default now()
);

create index if not exists mascotas_perfil_idx on mascotas (perfil_id);

create table if not exists mascota_favoritos (
  mascota_id  uuid references mascotas(id) on delete cascade,
  producto_id uuid references productos(id) on delete cascade,
  primary key (mascota_id, producto_id)
);

create table if not exists favoritos (
  perfil_id   uuid references perfiles(id) on delete cascade,
  producto_id uuid references productos(id) on delete cascade,
  creado_en   timestamptz not null default now(),
  primary key (perfil_id, producto_id)
);

create table if not exists direcciones (
  id             uuid primary key default gen_random_uuid(),
  perfil_id      uuid not null references perfiles(id) on delete cascade,
  alias          text not null,
  linea          text not null,
  distrito       text not null,
  referencia     text,
  predeterminada bool not null default false
);

-- --------------------------------- Pedidos ----------------------------------

create sequence if not exists pedidos_numero_seq start 1043;

create table if not exists pedidos (
  id               uuid primary key default gen_random_uuid(),
  numero           text unique not null default 'LCC-' || nextval('pedidos_numero_seq'),
  perfil_id        uuid references perfiles(id) on delete set null,
  nombres          text not null,
  apellidos        text,
  correo           text,
  celular          text not null,
  entrega          text not null,              -- delivery | recojo
  direccion        text,
  distrito         text,
  referencia       text,
  metodo_pago      text not null,
  estado           estado_pedido not null default 'pendiente',
  subtotal         numeric(10,2) not null,
  descuento        numeric(10,2) not null default 0,
  envio            numeric(10,2) not null default 0,
  total            numeric(10,2) not null,
  cupon_codigo     text,
  puntos_generados int not null default 0,
  notas            text,
  creado_en        timestamptz not null default now()
);

create index if not exists pedidos_perfil_idx on pedidos (perfil_id);
create index if not exists pedidos_estado_idx on pedidos (estado, creado_en desc);

create table if not exists pedido_lineas (
  id              uuid primary key default gen_random_uuid(),
  pedido_id       uuid not null references pedidos(id) on delete cascade,
  producto_id     uuid references productos(id) on delete set null,
  barf_id         uuid references productos_barf(id) on delete set null,
  nombre          text not null,               -- congelado por si el producto cambia
  presentacion    text not null,
  precio_unitario numeric(10,2) not null,
  cantidad        int not null check (cantidad > 0),
  kilos           numeric(6,2),
  frecuencia      text
);

create index if not exists pedido_lineas_pedido_idx on pedido_lineas (pedido_id);

create table if not exists pedido_historial (
  id        uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references pedidos(id) on delete cascade,
  estado    estado_pedido,
  nota      text,
  autor_id  uuid references auth.users(id) on delete set null,
  creado_en timestamptz not null default now()
);

create table if not exists pedido_mensajes (
  id        uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references pedidos(id) on delete cascade,
  mensaje   text not null,
  autor_id  uuid references auth.users(id) on delete set null,
  creado_en timestamptz not null default now()
);

-- ------------------------------- Recompensas --------------------------------

create table if not exists reglas_puntos (
  id               uuid primary key default gen_random_uuid(),
  monto_por_punto  numeric(10,2) not null default 10,
  puntos_otorgados int not null default 1,
  vigencia_desde   date not null,
  vigencia_hasta   date not null,
  compra_minima    numeric(10,2) not null default 0,
  multiplicador    int not null default 1,
  campana          text,
  todos_los_productos bool not null default true,
  acreditar_tras_entrega bool not null default true,
  vence_en_meses   int not null default 12,
  activa           bool not null default true
);

create table if not exists regla_productos (
  regla_id    uuid references reglas_puntos(id) on delete cascade,
  producto_id uuid references productos(id) on delete cascade,
  primary key (regla_id, producto_id)
);

create table if not exists recompensas (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  descripcion text,
  puntos      int not null check (puntos > 0),
  tipo        tipo_recompensa not null,
  valor       numeric(10,2),
  icono       text,
  orden       int  not null default 0,
  activa      bool not null default true
);

create table if not exists movimientos_puntos (
  id            uuid primary key default gen_random_uuid(),
  perfil_id     uuid not null references perfiles(id) on delete cascade,
  pedido_id     uuid references pedidos(id) on delete set null,
  recompensa_id uuid references recompensas(id) on delete set null,
  concepto      text not null,
  puntos        int not null,                  -- negativo al canjear
  estado        estado_puntos not null default 'pendiente',
  vence_en      date,
  creado_en     timestamptz not null default now()
);

create index if not exists movimientos_perfil_idx on movimientos_puntos (perfil_id, creado_en desc);

create table if not exists cupones (
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

create table if not exists cupones_perfil (
  perfil_id uuid references perfiles(id) on delete cascade,
  cupon_id  uuid references cupones(id) on delete cascade,
  usado     bool not null default false,
  primary key (perfil_id, cupon_id)
);

-- --------------------------------- Contenido --------------------------------

create table if not exists contenido_web (
  clave       text primary key,                -- 'hero', 'quienesSomos'…
  valor       jsonb not null,
  actualizado timestamptz not null default now()
);

create table if not exists secciones_inicio (
  id      uuid primary key default gen_random_uuid(),
  clave   text unique not null,
  nombre  text not null,
  orden   int  not null default 0,
  visible bool not null default true
);

create table if not exists banners (
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
  orden      int  not null default 0
);

create table if not exists preguntas_frecuentes (
  id        uuid primary key default gen_random_uuid(),
  categoria text not null,
  pregunta  text not null,
  respuesta text not null,
  orden     int  not null default 0,
  visible   bool not null default true
);

create table if not exists testimonios (
  id           uuid primary key default gen_random_uuid(),
  mascota      text not null,
  dueno        text not null,
  foto_url     text,
  producto     text,
  calificacion int not null check (calificacion between 1 and 5),
  comentario   text not null,
  publicado    bool not null default false,
  orden        int  not null default 0,
  creado_en    timestamptz not null default now()
);

create table if not exists configuracion (
  clave text primary key,
  valor jsonb not null
);

-- =============================================================================
-- Automatismos
-- =============================================================================

-- `actualizado_en` en productos
create or replace function tocar_actualizado() returns trigger
language plpgsql as $$
begin
  new.actualizado_en := now();
  return new;
end $$;

drop trigger if exists productos_actualizado on productos;
create trigger productos_actualizado
  before update on productos
  for each row execute function tocar_actualizado();

-- Perfil automático al registrarse
create or replace function crear_perfil() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into perfiles (id, nombres, apellidos, correo, celular)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data->>'nombres', ''), split_part(new.email, '@', 1)),
    nullif(new.raw_user_meta_data->>'apellidos', ''),
    new.email,
    nullif(new.raw_user_meta_data->>'celular', '')
  )
  on conflict (id) do nothing;

  -- Mascota inicial, si vino en el registro
  if coalesce(new.raw_user_meta_data->>'mascota', '') <> '' then
    insert into mascotas (perfil_id, nombre, especie, raza, peso_kg, nacimiento)
    values (
      new.id,
      new.raw_user_meta_data->>'mascota',
      coalesce(nullif(new.raw_user_meta_data->>'especie', ''), 'Perro'),
      nullif(new.raw_user_meta_data->>'raza', ''),
      nullif(new.raw_user_meta_data->>'peso', '')::numeric,
      nullif(new.raw_user_meta_data->>'nacimientoMascota', '')::date
    );
  end if;

  -- 20 puntos de bienvenida
  insert into movimientos_puntos (perfil_id, concepto, puntos, estado, vence_en)
  values (new.id, 'Registro en el Club Cocina Canina', 20, 'disponible',
          (current_date + interval '12 months')::date);

  return new;
end $$;

drop trigger if exists al_crear_usuario on auth.users;
create trigger al_crear_usuario
  after insert on auth.users
  for each row execute function crear_perfil();

-- Saldo de puntos siempre sincronizado
create or replace function recalcular_puntos() returns trigger
language plpgsql security definer set search_path = public as $$
declare objetivo uuid := coalesce(new.perfil_id, old.perfil_id);
begin
  update perfiles p
     set puntos = greatest(0, coalesce((
       select sum(m.puntos) from movimientos_puntos m
        where m.perfil_id = objetivo and m.estado in ('disponible','canjeado')
     ), 0))
   where p.id = objetivo;
  return null;
end $$;

drop trigger if exists sincronizar_puntos on movimientos_puntos;
create trigger sincronizar_puntos
  after insert or update or delete on movimientos_puntos
  for each row execute function recalcular_puntos();

-- Al cambiar el estado de un pedido: registrar historial, descontar stock y
-- acreditar los puntos cuando se entrega.
create or replace function al_cambiar_estado_pedido() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.estado is distinct from old.estado then
    insert into pedido_historial (pedido_id, estado, autor_id)
    values (new.id, new.estado, auth.uid());

    if new.estado = 'confirmado' and old.estado = 'pendiente' then
      update presentaciones v
         set stock = greatest(0, v.stock - l.cantidad)
        from pedido_lineas l
       where l.pedido_id = new.id
         and v.producto_id = l.producto_id
         and v.etiqueta = l.presentacion;
    end if;

    if new.estado = 'entregado' then
      update movimientos_puntos
         set estado = 'disponible'
       where pedido_id = new.id and estado = 'pendiente';
    end if;

    if new.estado = 'cancelado' then
      update movimientos_puntos
         set estado = 'cancelado'
       where pedido_id = new.id and estado in ('pendiente','disponible');
    end if;
  end if;
  return new;
end $$;

drop trigger if exists pedido_estado on pedidos;
create trigger pedido_estado
  after update of estado on pedidos
  for each row execute function al_cambiar_estado_pedido();

-- Registrar el historial inicial al crear el pedido
create or replace function al_crear_pedido() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into pedido_historial (pedido_id, estado, nota)
  values (new.id, new.estado, 'Pedido creado desde la web');
  return new;
end $$;

drop trigger if exists pedido_creado on pedidos;
create trigger pedido_creado
  after insert on pedidos
  for each row execute function al_crear_pedido();

-- Vencer puntos caducados (llamar desde un cron de Supabase, a diario)
create or replace function vencer_puntos() returns void
language sql security definer set search_path = public as $$
  update movimientos_puntos
     set estado = 'vencido'
   where estado = 'disponible'
     and vence_en is not null
     and vence_en < current_date;
$$;
