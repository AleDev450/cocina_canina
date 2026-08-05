/**
 * Genera `supabase/seed.sql` a partir de los archivos de `src/data`.
 *
 * Así el catálogo tiene una sola fuente de verdad: se edita el TypeScript y se
 * regenera el seed con `npm run seed`.
 */
import { writeFileSync } from "node:fs";
import { productos } from "../src/data/productos";
import { categorias } from "../src/data/categorias";
import { productosBarf } from "../src/data/barf";
import { lotesMayor } from "../src/data/mayoreo";
import { preguntas, testimonios } from "../src/data/contenido";
import { recompensas, reglaPuntos } from "../src/data/recompensas";
import { cuponesDemo } from "../src/data/cuenta";
import {
  hero,
  quienesSomos,
  pedidoWhatsapp,
  sitio,
  metodosEntrega,
  metodosPago,
} from "../src/data/sitio";

/* --------------------------- Utilidades de SQL --------------------------- */

const txt = (v: string | null | undefined) =>
  v === null || v === undefined ? "null" : `'${v.replace(/'/g, "''")}'`;

const arr = (v: readonly string[]) =>
  v.length === 0 ? "'{}'" : `array[${v.map(txt).join(", ")}]`;

const arrTipado = (v: readonly string[], tipo: string) =>
  v.length === 0 ? `'{}'::${tipo}[]` : `array[${v.map(txt).join(", ")}]::${tipo}[]`;

const bool = (v: boolean) => (v ? "true" : "false");
const num = (v: number | null | undefined) =>
  v === null || v === undefined ? "null" : String(v);
const json = (v: unknown) => `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`;

const lineas: string[] = [];
const w = (s = "") => lineas.push(s);

/* --------------------------------- Cabecera ------------------------------- */

w("-- =============================================================================");
w("-- La Cocina Canina — datos iniciales");
w("--");
w("-- ARCHIVO GENERADO por scripts/generar-seed.ts — no editar a mano.");
w("-- Para regenerarlo: npm run seed");
w("--");
w("-- Es idempotente: puede ejecutarse varias veces sin duplicar filas.");
w("-- =============================================================================");
w();

/* ------------------------------- Categorías ------------------------------- */

w("-- ------------------------------- Categorías -------------------------------");
categorias.forEach((c, i) => {
  w(`insert into categorias (slug, nombre, descripcion_corta, descripcion, icono, imagen_url, acento, orden)
values (${txt(c.slug)}, ${txt(c.nombre)}, ${txt(c.descripcionCorta)}, ${txt(c.descripcion)}, ${txt(c.icono)}, ${txt(c.imagen)}, ${txt(c.acento)}, ${i})
on conflict (slug) do update set
  nombre = excluded.nombre, descripcion_corta = excluded.descripcion_corta,
  descripcion = excluded.descripcion, icono = excluded.icono,
  imagen_url = excluded.imagen_url, acento = excluded.acento, orden = excluded.orden;`);
});
w();

/* -------------------------------- Productos ------------------------------- */

w("-- -------------------------------- Productos -------------------------------");
productos.forEach((p) => {
  w(`insert into productos (
  slug, nombre, categoria_id, dureza, proteinas, beneficio_principal, descripcion,
  beneficios, ingredientes, minerales, tamanos, edades, imagen_url, galeria,
  etiquetas, destacado, activo, conservacion, advertencia, disponible_mayor, ventas, orden
) values (
  ${txt(p.slug)}, ${txt(p.nombre)},
  (select id from categorias where slug = ${txt(p.categoria)}),
  ${txt(p.dureza)}::dureza, ${arr(p.proteinas)}, ${txt(p.beneficioPrincipal)}, ${txt(p.descripcion)},
  ${arr(p.beneficios)}, ${arr(p.ingredientes)}, ${txt(p.minerales)},
  ${arrTipado(p.tamanos, "tamano_perro")}, ${arrTipado(p.edades, "edad_perro")},
  ${txt(p.imagen)}, ${arr(p.galeria)}, ${arr(p.etiquetas)},
  ${bool(p.destacado)}, true, ${txt(p.conservacion)}, ${txt(p.advertencia)},
  ${bool(p.disponiblePorMayor)}, ${p.ventas}, ${p.orden}
)
on conflict (slug) do update set
  nombre = excluded.nombre, categoria_id = excluded.categoria_id, dureza = excluded.dureza,
  proteinas = excluded.proteinas, beneficio_principal = excluded.beneficio_principal,
  descripcion = excluded.descripcion, beneficios = excluded.beneficios,
  ingredientes = excluded.ingredientes, minerales = excluded.minerales,
  tamanos = excluded.tamanos, edades = excluded.edades, imagen_url = excluded.imagen_url,
  galeria = excluded.galeria, etiquetas = excluded.etiquetas, destacado = excluded.destacado,
  conservacion = excluded.conservacion, advertencia = excluded.advertencia,
  disponible_mayor = excluded.disponible_mayor, ventas = excluded.ventas, orden = excluded.orden;`);
});
w();

w("-- ----------------------------- Presentaciones -----------------------------");
productos.forEach((p) => {
  p.presentaciones.forEach((v, i) => {
    w(`insert into presentaciones (producto_id, codigo, etiqueta, tipo, precio, stock, orden)
values ((select id from productos where slug = ${txt(p.slug)}), ${txt(v.id)}, ${txt(v.etiqueta)}, ${txt(v.tipo)}::tipo_presentacion, ${v.precio}, ${v.stock}, ${i})
on conflict (producto_id, codigo) do update set
  etiqueta = excluded.etiqueta, tipo = excluded.tipo, precio = excluded.precio,
  stock = excluded.stock, orden = excluded.orden;`);
  });
});
w();

w("-- --------------------------- Productos relacionados -----------------------");
productos.forEach((p) => {
  p.relacionados.forEach((r) => {
    w(`insert into productos_relacionados (producto_id, relacionado_id)
select a.id, b.id from productos a, productos b
 where a.slug = ${txt(p.slug)} and b.slug = ${txt(r)}
on conflict do nothing;`);
  });
});
w();

/* ---------------------------------- BARF ---------------------------------- */

w("-- ----------------------------------- BARF ---------------------------------");
productosBarf.forEach((b, i) => {
  w(`insert into productos_barf (slug, nombre, proteinas, descripcion, composicion, beneficios, imagen_url, color, orden)
values (${txt(b.slug)}, ${txt(b.nombre)}, ${arr(b.proteinas)}, ${txt(b.descripcion)}, ${arr(b.composicion)}, ${arr(b.beneficios)}, ${txt(b.imagen)}, ${txt(b.color)}, ${i})
on conflict (slug) do update set
  nombre = excluded.nombre, proteinas = excluded.proteinas, descripcion = excluded.descripcion,
  composicion = excluded.composicion, beneficios = excluded.beneficios,
  imagen_url = excluded.imagen_url, color = excluded.color, orden = excluded.orden;`);
  w(`delete from barf_rangos where barf_id = (select id from productos_barf where slug = ${txt(b.slug)});`);
  b.rangos.forEach((r) => {
    w(`insert into barf_rangos (barf_id, desde_kg, hasta_kg, precio_kg)
values ((select id from productos_barf where slug = ${txt(b.slug)}), ${r.desde}, ${num(r.hasta)}, ${r.precioKg});`);
  });
});
w();

/* -------------------------------- Por mayor ------------------------------- */

w("-- -------------------------------- Por mayor -------------------------------");
lotesMayor.forEach((l, i) => {
  w(`insert into lotes_mayor (slug, nombre, productos, unidad, minimo, imagen_url, nota, orden)
values (${txt(l.slug)}, ${txt(l.nombre)}, ${arr(l.productos)}, ${txt(l.unidad)}, ${txt(l.minimo)}, ${txt(l.imagen)}, ${txt(l.nota)}, ${i})
on conflict (slug) do update set
  nombre = excluded.nombre, productos = excluded.productos, unidad = excluded.unidad,
  minimo = excluded.minimo, imagen_url = excluded.imagen_url, nota = excluded.nota,
  orden = excluded.orden;`);
  w(`delete from lotes_mayor_precios where lote_id = (select id from lotes_mayor where slug = ${txt(l.slug)});`);
  l.presentaciones.forEach((p, j) => {
    w(`insert into lotes_mayor_precios (lote_id, etiqueta, precio, orden)
values ((select id from lotes_mayor where slug = ${txt(l.slug)}), ${txt(p.etiqueta)}, ${p.precio}, ${j});`);
  });
});
w();

/* ------------------------------- Recompensas ------------------------------ */

w("-- ------------------------------- Recompensas ------------------------------");
w(`insert into reglas_puntos (monto_por_punto, puntos_otorgados, vigencia_desde, vigencia_hasta, compra_minima, multiplicador, campana, activa)
select ${reglaPuntos.montoPorPunto}, ${reglaPuntos.puntosOtorgados}, ${txt(reglaPuntos.vigenciaDesde)}::date, ${txt(reglaPuntos.vigenciaHasta)}::date, ${reglaPuntos.compraMinima}, ${reglaPuntos.multiplicador}, ${txt(reglaPuntos.campana)}, true
where not exists (select 1 from reglas_puntos where activa);`);
w();

recompensas.forEach((r, i) => {
  const valor =
    r.tipo === "descuento-fijo"
      ? 10
      : r.tipo === "descuento-porcentual"
        ? 15
        : r.tipo === "envio-gratis"
          ? 12
          : r.tipo === "cupon"
            ? 20
            : 0;
  w(`insert into recompensas (nombre, descripcion, puntos, tipo, valor, icono, orden, activa)
select ${txt(r.nombre)}, ${txt(r.descripcion)}, ${r.puntos}, ${txt(r.tipo)}::tipo_recompensa, ${valor}, ${txt(r.icono)}, ${i}, true
where not exists (select 1 from recompensas where nombre = ${txt(r.nombre)});`);
});
w();

w("-- --------------------------------- Cupones --------------------------------");
cuponesDemo.forEach((c) => {
  w(`insert into cupones (codigo, descripcion, tipo, valor, vence_en, activo)
values (${txt(c.codigo)}, ${txt(c.descripcion)}, ${txt(c.tipo)}::tipo_recompensa, ${c.valor}, ${txt(c.vence)}::date, ${bool(!c.usado)})
on conflict (codigo) do update set
  descripcion = excluded.descripcion, tipo = excluded.tipo, valor = excluded.valor,
  vence_en = excluded.vence_en;`);
});
w();

/* -------------------------------- Contenido ------------------------------- */

w("-- -------------------------------- Contenido -------------------------------");
const bloques: Array<[string, unknown]> = [
  ["hero", hero],
  ["quienesSomos", quienesSomos],
  ["pedidoWhatsapp", pedidoWhatsapp],
];
bloques.forEach(([clave, valor]) => {
  w(`insert into contenido_web (clave, valor) values (${txt(clave)}, ${json(valor)})
on conflict (clave) do update set valor = excluded.valor, actualizado = now();`);
});
w();

const SECCIONES = [
  ["hero", "Hero principal"],
  ["nosotros", "Quiénes somos"],
  ["categorias", "Categorías de productos"],
  ["destacados", "Productos destacados"],
  ["barf", "Alimentación BARF"],
  ["club", "Club Cocina Canina"],
  ["mayor", "Compra por mayor"],
  ["whatsapp", "Pedido por WhatsApp"],
  ["testimonios", "Testimonios"],
  ["faq", "Preguntas frecuentes"],
];
SECCIONES.forEach(([clave, nombre], i) => {
  w(`insert into secciones_inicio (clave, nombre, orden, visible)
values (${txt(clave)}, ${txt(nombre)}, ${i}, true)
on conflict (clave) do update set nombre = excluded.nombre;`);
});
w();

w("-- ---------------------------- Preguntas frecuentes ------------------------");
preguntas.forEach((p, i) => {
  w(`insert into preguntas_frecuentes (categoria, pregunta, respuesta, orden, visible)
select ${txt(p.categoria)}, ${txt(p.pregunta)}, ${txt(p.respuesta)}, ${i}, true
where not exists (select 1 from preguntas_frecuentes where pregunta = ${txt(p.pregunta)});`);
});
w();

w("-- ------------------------------- Testimonios ------------------------------");
testimonios.forEach((t, i) => {
  w(`insert into testimonios (mascota, dueno, foto_url, producto, calificacion, comentario, publicado, orden)
select ${txt(t.mascota)}, ${txt(t.dueno)}, ${txt(t.foto || null)}, ${txt(t.producto)}, ${t.calificacion}, ${txt(t.comentario)}, true, ${i}
where not exists (select 1 from testimonios where mascota = ${txt(t.mascota)} and dueno = ${txt(t.dueno)});`);
});
w();

w("-- ------------------------------- Configuración ----------------------------");
const CONFIG: Array<[string, unknown]> = [
  ["empresa", { nombre: sitio.nombre, ruc: "", razonSocial: "", direccion: "" }],
  ["contacto", sitio],
  ["entrega", { metodos: metodosEntrega, envioGratisDesde: 150 }],
  ["pago", { metodos: metodosPago }],
  [
    "integraciones",
    {
      whatsapp: sitio.whatsapp,
      instagram: sitio.instagram,
      tiktok: sitio.tiktok,
      analytics: "",
      metaPixel: "",
      botonFlotante: true,
      pedidoSinRegistro: true,
      mostrarAgotados: true,
      mantenimiento: false,
    },
  ],
  ["colores", { hoja: "#4F9A4A", coral: "#E8735A", ambar: "#D99A2B", crema: "#FDFAF5" }],
];
CONFIG.forEach(([clave, valor]) => {
  w(`insert into configuracion (clave, valor) values (${txt(clave)}, ${json(valor)})
on conflict (clave) do update set valor = excluded.valor;`);
});
w();

/* ------------------------------ Roles y banners --------------------------- */

w("-- ----------------------------- Roles y permisos ---------------------------");
const GRUPOS = ["Operación", "Catálogo", "Clientes", "Contenido", "Sistema"];
const ROLES: Record<string, string[]> = {
  administrador: GRUPOS,
  produccion: ["Operación", "Catálogo"],
  reparto: ["Operación"],
  contenido: ["Contenido"],
  atencion: ["Operación", "Clientes"],
};
Object.entries(ROLES).forEach(([rol, permitidos]) => {
  GRUPOS.forEach((grupo) => {
    w(`insert into rol_permisos (rol, grupo, permitido)
values (${txt(rol)}::rol_staff, ${txt(grupo)}, ${bool(permitidos.includes(grupo))})
on conflict (rol, grupo) do update set permitido = excluded.permitido;`);
  });
});
w();

w("-- --------------------------------- Banners --------------------------------");
const BANNERS = [
  {
    nombre: "Hero principal",
    ubicacion: "Inicio · portada",
    imagen: "/mascota/saltando.png",
    titulo: "Lo mejor para tu mejor amigo",
    boton: "Ver productos",
    enlace: "/productos",
    desde: "2026-01-01",
    hasta: "2026-12-31",
    activo: true,
  },
  {
    nombre: "Campaña BARF",
    ubicacion: "Inicio · sección BARF",
    imagen: "/productos/barf.png",
    titulo: "Alimentación natural diseñada para ellos",
    boton: "Ver planes BARF",
    enlace: "/barf",
    desde: "2026-07-01",
    hasta: "2026-08-31",
    activo: true,
  },
  {
    nombre: "Compra por mayor",
    ubicacion: "Inicio · bloque mayorista",
    imagen: "/empaques/snacks-bolsa-res.png",
    titulo: "Precios especiales para tiendas",
    boton: "Solicitar cotización",
    enlace: "/por-mayor",
    desde: "2026-01-01",
    hasta: "2026-12-31",
    activo: true,
  },
];
BANNERS.forEach((b, i) => {
  w(`insert into banners (nombre, ubicacion, imagen_url, titulo, boton, enlace, desde, hasta, activo, orden)
select ${txt(b.nombre)}, ${txt(b.ubicacion)}, ${txt(b.imagen)}, ${txt(b.titulo)}, ${txt(b.boton)}, ${txt(b.enlace)}, ${txt(b.desde)}::date, ${txt(b.hasta)}::date, ${bool(b.activo)}, ${i}
where not exists (select 1 from banners where nombre = ${txt(b.nombre)});`);
});
w();

w("-- =============================================================================");
w("-- Para convertir tu usuario en administrador, después de registrarte:");
w("--");
w("--   insert into staff (id, nombre, correo, rol)");
w("--   select id, 'Tu nombre', email, 'administrador' from auth.users");
w("--    where email = 'tucorreo@ejemplo.pe'");
w("--   on conflict (id) do update set rol = 'administrador', activo = true;");
w("-- =============================================================================");

writeFileSync("supabase/seed.sql", lineas.join("\n") + "\n", "utf8");
console.log(
  `seed.sql generado · ${productos.length} productos, ${categorias.length} categorías, ` +
    `${productosBarf.length} recetas BARF, ${lotesMayor.length} lotes por mayor, ` +
    `${preguntas.length} preguntas, ${testimonios.length} testimonios.`,
);
