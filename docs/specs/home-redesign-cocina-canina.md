# Rediseño de la página de inicio — La Cocina Canina

## Objetivo

Rehacer la portada con una estética cálida, artesanal y premium, usando a Dante
como hilo visual de toda la experiencia, sin tocar rutas, datos, autenticación
ni lógica de negocio.

## Arquitectura encontrada

Inspección previa al cambio:

| Aspecto | Estado |
| --- | --- |
| Framework | Next.js 16.3 con **App Router** (`src/app`) |
| React | 19.2 |
| Estilos | Tailwind CSS 4 vía `@tailwindcss/postcss`, tokens en `@theme` dentro de `src/app/globals.css` |
| Tipografía | Ya usa `next/font/google`: Fraunces + Plus Jakarta Sans, expuestas como `--fuente-display` / `--fuente-sans` |
| Estado del carrito | `src/context/Tienda.tsx` (cliente), persistido en `localStorage` bajo `lcc:tienda:v1` |
| Panel del carrito | `src/components/layout/CarritoLateral.tsx`, abierto con `abrirCarrito()` del contexto |
| Datos | Supabase; cada bloque de la portada se lee del CMS con reserva a `src/data/*` |
| Íconos | Set propio en `src/components/ui/Iconos.tsx` (`Hoja`, `Escudo`, `Hueso`, `Chef`, …) + `lucide-react` en la interfaz |

Conclusión: **no hace falta ninguna dependencia nueva.** La tipografía y los
tokens ya están centralizados, así que el cambio de identidad se hace en un solo
sitio y se propaga a todo el sitio sin tocar los componentes uno por uno.

## Alcance

Dentro:

- `src/app/layout.tsx` — cambio de Plus Jakarta Sans a Manrope.
- `src/app/globals.css` — nueva paleta sobre los tokens existentes.
- `src/components/inicio/Hero.tsx` — hero a dos columnas con Dante.
- `src/components/inicio/*` — mapeo de las fotos de Dante en las secciones.
- `src/components/layout/Encabezado.tsx` — carrito con plato vacío/lleno.
- `src/components/carrito/PlatoCarrito.tsx` — componente nuevo de los dos estados.
- `src/app/page.tsx` — orden de las secciones.

Fuera (no se toca):

- Rutas, endpoints, esquema de datos, RLS, autenticación, precios, cupones,
  puntos, checkout y todo `src/server/**`.
- El CMS y sus 19 módulos.
- El logotipo: se mantiene como imagen (`/marca/logo-*.png`).

## Dirección visual

| Rol | Color | Token |
| --- | --- | --- |
| Fondo principal (marfil) | `#F7F0E6` | `--color-crema-100` |
| Verde petróleo | `#075159` | `--color-petroleo-700` |
| Naranja de acento | `#F56B27` | `--color-naranja-500` |
| Durazno suave | `#F3D9C4` | `--color-durazno` |
| Texto principal | `#103F42` | `--color-tinta` |

Se reutilizan los **nombres** de token existentes y solo cambian sus valores, de
modo que las 19 pantallas del CMS y el resto del sitio heredan la nueva paleta
sin editarlas. Contenedor máximo 1280px; radios entre 18 y 28px.

Tipografía: **Fraunces** (500–700) para h1–h3 y frases editoriales; **Manrope**
(400–800) para navegación, párrafos, botones, precios y formularios. Ambas por
`next/font/google` y expuestas como variables CSS.

## Mapeo de imágenes

Origen en `imagenes/` (**no se modifican**), copias limpias en
`public/images/dante/`.

| Archivo | Uso |
| --- | --- |
| `sonriendo.png` | Hero, imagen principal (`priority`) |
| `olfateo_de_productos.png` | «Hechos con amor, pensados para ellos» |
| `saboreando.png` | Tarjeta de textura **suave** |
| `dureza_producto.png` | Tarjeta de textura **media** |
| `masticando_producto.png` | Tarjeta de **larga duración** |
| `plato_lleno.png` | Bloque BARF y carrito con productos |
| `plato_vacio.png` | Estado vacío del carrito |
| `mirada_feliz.png` | Llamada a la acción final |
| `alegre.png`, `observando.png` | Secciones secundarias, para variar la pose |
| `icono_vacio.png`, `icono_lleno.png` | Derivados cuadrados para la cabecera |

El prompt nombraba `sonriendo(1).png`; el archivo entregado se llama
`sonriendo.png` y es el que se usa.

### Transparencia real

Las diez fotos llegaron **RGB, sin canal alfa**: el cuadriculado estaba pintado
en píxeles, no era transparencia. No se puede recortar por color porque Dante es
blanco y negro y el damero es blanco (255) y gris claro (240): borrar los claros
se comería su pelaje. Tampoco sirve asumir una rejilla, porque cada imagen trae
otra escala y el lado de celda no es entero (20.5, 26, 29 px).

Lo que sí los separa es la **planitud**. El damero está generado por software y
dentro de una celda es liso; el pelaje es fotografía y tiene grano. Medido sobre
`sonriendo.png` con una ventana de 5×5:

| Zona | Valor | Desviación local |
| --- | --- | --- |
| Fondo (damero) | 247 | **0.57** |
| Pelaje blanco | 241 | 3.69 |
| Pelaje negro | 33 | 19.26 |

Procedimiento aplicado: semilla = píxel neutro, dentro del rango de tonos del
damero y con desviación < 1.5 → cierre morfológico para puentear las líneas
entre celdas → inundación desde el borde → descarte de islas sueltas → erosión
de 1px y leve difuminado del alfa para eliminar el halo del antialias → recorte
al recuadro del sujeto.

Los originales quedan intactos en `imagenes/`. Peso total tras optimizar
(lado mayor 1300px, PNG nivel 9): **19.5 MB → 3.8 MB**.

## Estados del carrito

Componente nuevo `PlatoCarrito`, conectado a `cantidadTotal` del contexto:

- `cantidadTotal === 0` → `icono_vacio.png`, sin insignia.
- `cantidadTotal > 0` → `icono_lleno.png` + insignia naranja con el total.
- Al pulsar llama a `abrirCarrito()`, **el mismo panel lateral que ya existe**.
- `aria-label="Carrito, X productos"` y región `aria-live="polite"` que anuncia
  el cambio de cantidad.
- Transición corta de opacidad y escala, anulada bajo `prefers-reduced-motion`.
- La insignia solo se renderiza tras la hidratación, para no desajustar el SSR.

## Responsive

| Ancho | Hero | Beneficios | Categorías |
| --- | --- | --- | --- |
| ≥1024px | dos columnas | fila de 4 | 3 columnas |
| 768–1023px | dos columnas ajustadas, sin cortar la cara de Dante | fila de 4 | 2 columnas |
| <768px | apilado | cuadrícula 2×2 | 1 columna |

## Accesibilidad

- Contraste AA: `#103F42` sobre `#F7F0E6` da 11.4:1; blanco sobre `#075159`,
  8.9:1. El naranja `#F56B27` se reserva para acentos y superficies grandes, no
  para texto pequeño sobre marfil.
- Objetivos táctiles ≥44px; foco visible en todos los controles.
- Navegación completa por teclado; el panel del carrito conserva su gestión de
  foco actual.
- Las fotos decorativas de Dante van con `alt=""` y `aria-hidden`; las que
  aportan información llevan texto alternativo real.

## Rendimiento

- `next/image` con `sizes` y dimensiones explícitas en todas las fotos.
- `priority` **solo** en la imagen del hero; el resto en carga diferida.
- Alturas reservadas para evitar CLS.

## Criterios de aceptación

1. No aparece el patrón cuadriculado en ninguna imagen de la web.
2. El pelaje blanco de Dante se conserva íntegro, sin halos ni recortes.
3. El carrito de la cabecera muestra plato vacío con 0 productos y plato lleno
   con insignia cuando hay al menos uno, y abre el panel existente.
4. Fraunces y Manrope se aplican de forma consistente; no queda rastro de la
   tipografía anterior.
5. `npm run typecheck` y `npm run build` pasan sin errores.
6. Búsqueda, WhatsApp, inicio de sesión, favoritos, productos y recompensas
   siguen funcionando.
7. No hay textos de relleno, colores fuera de la paleta ni datos inventados: la
   marca opera en **Lima, Perú**, con el teléfono y correo ya configurados.

## Pendiente real

Los **cuatro PNG de íconos de beneficios** que menciona el encargo no venían en
`imagenes/`. Se deja creada la carpeta `public/icons/beneficios/` y, mientras
tanto, la franja usa el set propio de SVG del proyecto (`Hoja`, `Escudo`,
`Hueso`, `Chef`), que ya es coherente y no mezcla estilos ni usa emojis. En
cuanto se entreguen los PNG basta con soltarlos ahí y cambiar el render de la
franja.
