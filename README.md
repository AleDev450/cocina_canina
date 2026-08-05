# La Cocina Canina — tienda + CMS

Tienda y panel administrativo de **La Cocina Canina** (snacks deshidratados y
alimentación BARF, Perú), sobre Next.js 16 y Supabase.

Todo el contenido del sitio —catálogo, textos, banners, preguntas, testimonios,
reglas de puntos, cupones y configuración— se administra desde el CMS y se
guarda en PostgreSQL. La tienda pública lee de esa misma base.

## Puesta en marcha

Hay dos caminos. El **local** no necesita cuenta ni internet una vez descargadas
las imágenes; el **de nube** sirve para publicar. El código es idéntico: lo único
que cambia son las tres variables de `.env.local`.

### Opción A · Todo en tu máquina (recomendado para desarrollar)

Requiere **Docker Desktop corriendo**. La primera vez descarga ~3 GB de imágenes.

```bash
npm install
npm run db:start      # levanta Postgres + Auth + Storage + Studio
```

Al terminar imprime las claves. Cópialas a `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<el "anon key" que imprimió>
SUPABASE_SERVICE_ROLE_KEY=<el "service_role key" que imprimió>
```

```bash
npm run dev           # http://localhost:3000
```

Las migraciones de `supabase/migrations/` y el `supabase/seed.sql` se aplican
solos al arrancar, así que el catálogo ya viene cargado.

| Comando | Qué hace |
| --- | --- |
| `npm run db:start` | Levanta la pila local |
| `npm run db:stop` | La apaga (los datos se conservan) |
| `npm run db:reset` | Borra y recrea la base desde migraciones + seed |
| `npm run db:studio` | Muestra las URLs y claves otra vez |

**Studio** (el panel de la base) queda en <http://127.0.0.1:54323> y los correos
que envía la app —confirmaciones, recuperación de contraseña— se quedan
atrapados en **Mailpit**, <http://127.0.0.1:54324>. No sale nada a internet.

### Opción B · Supabase en la nube

1. Crea un proyecto en [supabase.com](https://supabase.com) (región South
   America / São Paulo).
2. En el **SQL Editor**, ejecuta en orden el contenido de
   `supabase/migrations/` (por nombre de archivo) y después `supabase/seed.sql`.
   Alternativa con el CLI: `npx supabase link --project-ref <ref>` y
   `npx supabase db push`.
3. Copia a `.env.local` la **Project URL** y las claves **anon** y
   **service_role** de Project Settings → API.
4. En Authentication → Providers → Email, desactiva *Confirm email* mientras
   desarrollas.

### Crear el primer administrador

Regístrate en `/registro` y luego, en el SQL Editor (o en Studio si trabajas en
local):

```sql
insert into staff (id, nombre, correo, rol)
select id, 'Tu nombre', email, 'administrador' from auth.users
 where email = 'tucorreo@ejemplo.pe'
on conflict (id) do update set rol = 'administrador', activo = true;
```

Desde ahí ya puedes dar de alta al resto del equipo en `/admin/usuarios`, sin
volver a tocar SQL.

### Comandos del proyecto

`npm run dev` · `npm run build` · `npm start` · `npm run typecheck` ·
`npm run seed` (regenera `supabase/seed.sql` desde `src/data`).

## Autenticación

Registro e inicio de sesión con **correo y contraseña** mediante Supabase Auth.
No hay acceso con Google: las cuentas se crean en el mismo formulario.

| Ruta | Quién entra |
| --- | --- |
| `/registro`, `/ingresar` | Clientes |
| `/cuenta/*` | Requiere sesión |
| `/admin/ingresar` | Acceso del equipo |
| `/admin/*` | Requiere estar en `staff` y activo |

El middleware (`middleware.ts`) renueva el token en cada navegación y bloquea las
zonas privadas antes de que se rendericen.

## Roles y permisos

Cinco roles, cada uno con acceso a ciertos grupos de módulos del CMS:

| Rol | Operación | Catálogo | Clientes | Contenido | Sistema |
| --- | :-: | :-: | :-: | :-: | :-: |
| Administrador | ✓ | ✓ | ✓ | ✓ | ✓ |
| Producción | ✓ | ✓ | | | |
| Reparto | ✓ | | | | |
| Atención al cliente | ✓ | | ✓ | | |
| Contenido | | | | ✓ | |

La matriz se edita en `/admin/roles` y **la misma tabla alimenta las políticas de
RLS**: un rol sin permiso tampoco puede escribir aunque llame a la API
directamente.

## Módulos del CMS

Los 19 módulos escriben en la base de datos:

**Operación** — Dashboard, Pedidos (cambio de estado, historial, mensajes),
Ventas por mayor (cotizaciones y lista de precios).

**Catálogo** — Productos (CRUD completo con subida de imágenes), Categorías
(crear, ordenar, ocultar), Presentaciones (precios y stock masivos), Inventario.

**Clientes** — Clientes, Mascotas, Programa de recompensas (regla configurable y
catálogo de canje), Cupones.

**Contenido** — Contenido de la web (hero, quiénes somos, contacto, colores,
orden de secciones), Banners, Preguntas frecuentes, Testimonios.

**Sistema** — Reportes, Configuración, Usuarios administrativos, Roles y permisos.

## Automatismos de la base de datos

- Al registrarse un usuario se crea su perfil, su primera mascota (si la indicó)
  y 20 puntos de bienvenida.
- Al pasar un pedido a **Confirmado** se descuenta el stock de cada presentación.
- Al pasar a **Entregado** se acreditan los puntos; al **Cancelar**, se anulan.
- El saldo de puntos del perfil se recalcula solo con cada movimiento.
- `vencer_puntos()` caduca los puntos vencidos (conéctala a un cron diario).

## Cómo está organizado

```
src/
  app/              rutas: tienda, /cuenta, /admin/(panel)
  components/       UI, secciones de inicio, catálogo, CMS
  server/           consultas (catalogo, contenido, pedidos, clientes…)
    acciones/       Server Actions con validación Zod
  lib/supabase/     clientes de navegador, servidor y servicio
  data/             constantes de marca y semilla del catálogo
supabase/
  migrations/       esquema, RLS y storage
  seed.sql          catálogo y contenido inicial (generado)
scripts/            generador del seed
```

Las consultas devuelven las mismas formas que definen los tipos de
`src/lib/tipos.ts`, así que los componentes de presentación no saben si el dato
viene de la base o de un arreglo.

## Identidad visual

| Elemento | Valor |
| --- | --- |
| Verde petróleo (dominante) | `#005159` — muestreado del logotipo oficial |
| Naranja (solo acciones) | `#FF5A00` |
| Fondos | blancos y cremas (`#FDFAF5`, `#FAF4EA`) |
| Títulos | Fraunces (serif editorial) |
| Texto | Plus Jakarta Sans |

Los tokens y los patrones de huellas y huesos viven en `src/app/globals.css`.
Las fotografías de producto son las del catálogo oficial, recortadas sin fondo.

## Pendientes para la marca

1. **Precio por mayor de patitas de pollo.** El PDF indica 1 kg S/ 50.00,
   5 kg S/ 2350.00 y 10 kg S/ 4500.00. Los dos últimos parecen tener un cero de
   más; se cargaron S/ 235.00 y S/ 450.00. Ver `src/data/mayoreo.ts`.
2. **Descripción de "Oreja de res con pelitos".** En el PDF repite por error el
   texto del corazón de cerdo; se redactó una coherente con su ficha de
   minerales, pendiente de validación.
3. **Textos legales.** Redactados como base en `src/data/legales.ts`; requieren
   revisión legal y los datos de RUC y razón social.
4. **Fotos de testimonios.** Los que no tienen foto muestran la inicial sobre
   color de marca; se suben desde `/admin/testimonios`.

## Detalles de implementación que conviene conocer

- **Favoritos** viven en `localStorage`, no en la base: funcionan también sin
  cuenta. La tabla `favoritos` existe en el esquema para cuando se quieran
  sincronizar entre dispositivos.
- **Cupones y totales** se validan en el navegador solo para la vista previa;
  el descuento, el envío y los puntos definitivos los recalcula el servidor al
  confirmar el pedido (`src/server/acciones/pedidos.ts`).
- **Pedidos sin registro**: se insertan con la clave de servicio, porque no hay
  un `auth.uid()` al que asociarlos. No generan puntos.
- **Roles nuevos**: `rol_staff` es un enum de PostgreSQL. Para añadir un rol hay
  que ampliar el tipo; los permisos de los cinco existentes sí se editan desde
  el CMS.
- **Sin `.env.local` configurado** la web arranca igual y muestra un aviso de
  "Falta conectar Supabase" en lugar de reventar.
