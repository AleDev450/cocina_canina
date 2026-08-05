# La Cocina Canina — web + CMS

Prototipo visual completo de la tienda y del panel administrativo de
**La Cocina Canina** (snacks deshidratados y alimentación BARF, Perú).

Está pensado para **revisarse visualmente y pedir cambios** antes de desarrollar
la funcionalidad real: todas las pantallas existen, navegan entre sí y usan
información real de la marca, pero los datos viven en `src/data` en lugar de una
base de datos.

## Cómo ejecutarlo

```bash
npm install
npm run dev        # http://localhost:3000
```

Otros comandos: `npm run build`, `npm start`, `npm run typecheck`.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · lucide-react.
Sin dependencias de UI de terceros: todos los componentes son propios.

## Identidad visual

| Elemento | Valor |
| --- | --- |
| Verde petróleo (dominante) | `#005159` — muestreado del logotipo oficial |
| Naranja (solo acciones y acentos) | `#FF5A00` |
| Fondos | blancos y cremas (`#FDFAF5`, `#FAF4EA`) |
| Tipografía de títulos | Fraunces (serif editorial) |
| Tipografía de texto | Plus Jakarta Sans |

Los tokens viven en `src/app/globals.css`. Ahí también están los patrones
`patron-huellas` y `patron-huellas-claro` (huellas y huesos en SVG, muy sutiles)
y las animaciones `aparecer`, `flotar`, `girar-lento` y `latir`.

El perro de la marca aparece en portada, quiénes somos, club de puntos, estados
vacíos del carrito, confirmación de pedido, 404 y pantallas de registro.

## Mapa de pantallas

**Tienda**

| Ruta | Contenido |
| --- | --- |
| `/` | Hero, quiénes somos, categorías, destacados, BARF, club, por mayor, WhatsApp, testimonios, FAQ |
| `/productos` | Catálogo con filtros (categoría, proteína, dureza, tamaño, edad, precio, disponibilidad, por mayor) y 5 ordenamientos |
| `/productos/[slug]` | Ficha completa: galería, presentaciones, cantidad, beneficios, ingredientes, minerales, conservación, advertencia, relacionados |
| `/barf` | Recetas con precio por kilo, descuento por volumen, frecuencia de entrega y calculador de ración |
| `/por-mayor` | Lista de precios a granel y formulario de cotización |
| `/recompensas` | Club Cocina Canina: puntos, progreso, catálogo de canje e historial |
| `/nosotros`, `/preguntas-frecuentes`, `/legal/*` | Contenido editorial y legal |
| `/carrito`, `/checkout` | Carrito completo y compra en 6 pasos con confirmación |
| `/ingresar`, `/registro` | Autenticación (incluye datos de la mascota) |
| `/cuenta/*` | Panel del cliente: resumen, pedidos, puntos, cupones, mascotas, favoritos, direcciones, datos |

**CMS** (`/admin`) — 19 módulos: dashboard, pedidos, ventas por mayor,
productos, categorías, presentaciones, inventario, clientes, mascotas,
recompensas, cupones, contenido, banners, preguntas frecuentes, testimonios,
reportes, configuración, usuarios y roles.

## Datos

Todo el catálogo proviene del PDF oficial *BARF y Snacks*: 24 snacks con sus
descripciones, minerales, presentaciones y precios reales, 3 recetas BARF con
sus tramos por kilogramo y 11 lotes por mayor.

Las **fotografías son las del catálogo**, extraídas y recortadas sin fondo a
`public/productos`, `public/mascota` y `public/empaques`.

Archivos: `src/data/*.ts`. Los tipos (`src/lib/tipos.ts`) están escritos para
calzar 1 a 1 con las tablas de `supabase/schema.sql`.

## Pendientes para la marca

1. **Precio por mayor de patitas de pollo.** El PDF indica 1 kg S/ 50.00,
   5 kg S/ 2350.00 y 10 kg S/ 4500.00. Los dos últimos parecen tener un cero de
   más; se cargaron S/ 235.00 y S/ 450.00. Ver nota en `src/data/mayoreo.ts`.
2. **Descripción de “Oreja de res con pelitos”.** En el PDF repite por error el
   texto del corazón de cerdo; se redactó una descripción coherente con su ficha
   de minerales, pendiente de validación.
3. **Fotos de testimonios.** Los testimonios usan una inicial sobre color de
   marca hasta que existan fotos reales de las mascotas de clientes.
4. **Textos legales.** Redactados como base; requieren revisión legal y los
   datos de RUC y razón social.

## Siguiente paso: Supabase

`supabase/schema.sql` define el esquema completo en PostgreSQL: catálogo,
pedidos, perfiles, mascotas, puntos, cupones, contenido y staff, con Row Level
Security (catálogo público de solo lectura, cada cliente ve solo lo suyo, el
personal opera según su rol) y triggers para crear el perfil al registrarse,
recalcular el saldo de puntos y descontar stock al confirmar un pedido.

Para conectarlo basta reemplazar los imports de `src/data` por consultas: los
componentes no necesitan cambios. La estructura de pagos ya contempla el alta de
una pasarela (`src/data/sitio.ts` → `metodosPago`).

## Estado del prototipo

Carrito, favoritos y sesión funcionan de verdad y persisten en `localStorage`
(`src/context/Tienda.tsx`). Los formularios validan y muestran su estado de
éxito, pero no envían nada a un servidor. Los enlaces de WhatsApp sí están
operativos y arman el mensaje con cliente, productos, presentaciones,
cantidades, total, dirección y método de entrega (`src/lib/whatsapp.ts`,
número 922 035 995).
