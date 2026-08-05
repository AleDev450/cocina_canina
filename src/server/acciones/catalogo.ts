"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { clienteServidor } from "@/lib/supabase/servidor";
import { exigirGrupo } from "@/server/sesion";
import {
  INICIAL,
  aSlug,
  casilla,
  comasATexto,
  exito,
  fallo,
  lineasATexto,
  mensajeDeError,
  textoObligatorio,
  validar,
  type Resultado,
} from "@/server/acciones/comunes";

export { INICIAL };

/** Refresca la tienda y el CMS tras cualquier cambio de catálogo. */
function refrescarCatalogo(slug?: string) {
  revalidatePath("/", "layout");
  revalidatePath("/productos");
  revalidatePath("/admin/productos");
  revalidatePath("/admin/inventario");
  revalidatePath("/admin/presentaciones");
  if (slug) revalidatePath(`/productos/${slug}`);
}

/* ================================ Productos =============================== */

const esquemaProducto = z.object({
  id: z.string().optional(),
  nombre: textoObligatorio("El nombre", 2),
  slug: z.string().trim().optional(),
  categoria: textoObligatorio("La categoría"),
  dureza: z.enum(["suave", "media", "larga-duracion"]),
  proteinas: comasATexto,
  beneficioPrincipal: z.string().trim().optional(),
  descripcion: z.string().trim().optional(),
  beneficios: lineasATexto,
  ingredientes: lineasATexto,
  minerales: z.string().trim().optional(),
  tamanos: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((v) => (Array.isArray(v) ? v : v ? [v] : [])),
  edades: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((v) => (Array.isArray(v) ? v : v ? [v] : [])),
  etiquetas: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((v) => (Array.isArray(v) ? v : v ? [v] : [])),
  imagen: z.string().trim().optional(),
  galeria: lineasATexto,
  conservacion: z.string().trim().optional(),
  advertencia: z.string().trim().optional(),
  destacado: casilla,
  activo: casilla,
  disponibleMayor: casilla,
  ventas: z.coerce.number().int().min(0).optional(),
  orden: z.coerce.number().int().optional(),
});

export async function guardarProducto(
  _estado: Resultado,
  datos: FormData,
): Promise<Resultado> {
  await exigirGrupo("Catálogo");

  const analisis = validar(esquemaProducto, datos);
  if (!analisis.ok) return analisis.resultado;
  const v = analisis.valor;

  const supabase = await clienteServidor();

  const { data: categoria } = await supabase
    .from("categorias")
    .select("id")
    .eq("slug", v.categoria)
    .maybeSingle();

  if (!categoria) return fallo("Esa categoría no existe.", { categoria: "No encontrada" });

  const slug = v.slug?.trim() ? aSlug(v.slug) : aSlug(v.nombre);
  const imagen = v.imagen || null;

  const fila = {
    slug,
    nombre: v.nombre,
    categoria_id: categoria.id,
    dureza: v.dureza,
    proteinas: v.proteinas,
    beneficio_principal: v.beneficioPrincipal || null,
    descripcion: v.descripcion || null,
    beneficios: v.beneficios,
    ingredientes: v.ingredientes,
    minerales: v.minerales || null,
    tamanos: v.tamanos,
    edades: v.edades,
    imagen_url: imagen,
    galeria: v.galeria.length ? v.galeria : imagen ? [imagen] : [],
    etiquetas: v.etiquetas,
    destacado: v.destacado,
    activo: v.activo,
    conservacion: v.conservacion || null,
    advertencia: v.advertencia || null,
    disponible_mayor: v.disponibleMayor,
    ventas: v.ventas ?? 0,
    orden: v.orden ?? 0,
  };

  if (v.id) {
    const { error } = await supabase.from("productos").update(fila).eq("id", v.id);
    if (error) return fallo(mensajeDeError(error));
    refrescarCatalogo(slug);
    return exito("Producto actualizado.");
  }

  const { error } = await supabase.from("productos").insert(fila);
  if (error) return fallo(mensajeDeError(error));

  refrescarCatalogo(slug);
  redirect(`/admin/productos/${slug}`);
}

export async function alternarProductoActivo(id: string, activo: boolean) {
  await exigirGrupo("Catálogo");
  const supabase = await clienteServidor();
  const { error } = await supabase.from("productos").update({ activo }).eq("id", id);
  if (error) throw new Error(mensajeDeError(error));
  refrescarCatalogo();
}

export async function alternarProductoDestacado(id: string, destacado: boolean) {
  await exigirGrupo("Catálogo");
  const supabase = await clienteServidor();
  const { error } = await supabase.from("productos").update({ destacado }).eq("id", id);
  if (error) throw new Error(mensajeDeError(error));
  refrescarCatalogo();
}

export async function eliminarProducto(id: string) {
  await exigirGrupo("Catálogo");
  const supabase = await clienteServidor();
  const { error } = await supabase.from("productos").delete().eq("id", id);
  if (error) throw new Error(mensajeDeError(error));
  refrescarCatalogo();
  redirect("/admin/productos");
}

/* ============================= Presentaciones ============================= */

const esquemaPresentacion = z.object({
  id: z.string().optional(),
  productoId: textoObligatorio("El producto"),
  codigo: z.string().trim().optional(),
  etiqueta: textoObligatorio("La etiqueta"),
  tipo: z.enum(["gramos", "unidades", "kilogramos", "talla"]),
  precio: z.coerce.number().min(0, "El precio no puede ser negativo"),
  stock: z.coerce.number().int().min(0, "El stock no puede ser negativo"),
  orden: z.coerce.number().int().optional(),
});

export async function guardarPresentacion(
  _estado: Resultado,
  datos: FormData,
): Promise<Resultado> {
  await exigirGrupo("Catálogo");

  const analisis = validar(esquemaPresentacion, datos);
  if (!analisis.ok) return analisis.resultado;
  const v = analisis.valor;

  const supabase = await clienteServidor();
  const fila = {
    producto_id: v.productoId,
    codigo: v.codigo?.trim() || aSlug(v.etiqueta),
    etiqueta: v.etiqueta,
    tipo: v.tipo,
    precio: v.precio,
    stock: v.stock,
    orden: v.orden ?? 0,
  };

  const { error } = v.id
    ? await supabase.from("presentaciones").update(fila).eq("id", v.id)
    : await supabase.from("presentaciones").insert(fila);

  if (error) return fallo(mensajeDeError(error));

  refrescarCatalogo();
  return exito(v.id ? "Presentación actualizada." : "Presentación agregada.");
}

export async function eliminarPresentacion(id: string) {
  await exigirGrupo("Catálogo");
  const supabase = await clienteServidor();
  const { error } = await supabase.from("presentaciones").delete().eq("id", id);
  if (error) throw new Error(mensajeDeError(error));
  refrescarCatalogo();
}

/**
 * Guarda de golpe los stocks y precios editados en las tablas de inventario y
 * presentaciones. Acepta campos `stock:<id>` y `precio:<id>`.
 */
export async function guardarInventario(
  _estado: Resultado,
  datos: FormData,
): Promise<Resultado> {
  await exigirGrupo("Catálogo");
  const supabase = await clienteServidor();

  const cambios = new Map<string, { stock?: number; precio?: number }>();

  for (const [clave, valor] of datos.entries()) {
    const [campo, id] = clave.split(":");
    if (!id || (campo !== "stock" && campo !== "precio")) continue;

    const numero = Number(valor);
    if (!Number.isFinite(numero) || numero < 0) continue;

    const previo = cambios.get(id) ?? {};
    cambios.set(id, { ...previo, [campo]: numero });
  }

  if (cambios.size === 0) return fallo("No hay cambios que guardar.");

  for (const [id, campos] of cambios) {
    const { error } = await supabase.from("presentaciones").update(campos).eq("id", id);
    if (error) return fallo(mensajeDeError(error));
  }

  refrescarCatalogo();
  return exito(`Se actualizaron ${cambios.size} presentaciones.`);
}

/* ================================ Categorías ============================== */

const esquemaCategoria = z.object({
  id: z.string().optional(),
  nombre: textoObligatorio("El nombre", 2),
  slug: z.string().trim().optional(),
  descripcionCorta: z.string().trim().optional(),
  descripcion: z.string().trim().optional(),
  icono: z.enum(["suave", "media", "larga", "barf", "mayor"]),
  acento: z.enum(["petroleo", "naranja", "hoja", "coral", "ambar"]),
  imagen: z.string().trim().optional(),
  visible: casilla,
  orden: z.coerce.number().int().optional(),
});

export async function guardarCategoria(
  _estado: Resultado,
  datos: FormData,
): Promise<Resultado> {
  await exigirGrupo("Catálogo");

  const analisis = validar(esquemaCategoria, datos);
  if (!analisis.ok) return analisis.resultado;
  const v = analisis.valor;

  const supabase = await clienteServidor();
  const fila = {
    slug: v.slug?.trim() ? aSlug(v.slug) : aSlug(v.nombre),
    nombre: v.nombre,
    descripcion_corta: v.descripcionCorta || null,
    descripcion: v.descripcion || null,
    icono: v.icono,
    acento: v.acento,
    imagen_url: v.imagen || null,
    visible: v.visible,
    orden: v.orden ?? 0,
  };

  const { error } = v.id
    ? await supabase.from("categorias").update(fila).eq("id", v.id)
    : await supabase.from("categorias").insert(fila);

  if (error) return fallo(mensajeDeError(error));

  revalidatePath("/", "layout");
  revalidatePath("/admin/categorias");
  return exito(v.id ? "Categoría actualizada." : "Categoría creada.");
}

export async function alternarCategoriaVisible(id: string, visible: boolean) {
  await exigirGrupo("Catálogo");
  const supabase = await clienteServidor();
  const { error } = await supabase.from("categorias").update({ visible }).eq("id", id);
  if (error) throw new Error(mensajeDeError(error));
  revalidatePath("/", "layout");
  revalidatePath("/admin/categorias");
}

export async function reordenarCategorias(orden: string[]) {
  await exigirGrupo("Catálogo");
  const supabase = await clienteServidor();

  for (let i = 0; i < orden.length; i++) {
    const { error } = await supabase
      .from("categorias")
      .update({ orden: i })
      .eq("id", orden[i]);
    if (error) throw new Error(mensajeDeError(error));
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/categorias");
}

export async function eliminarCategoria(id: string) {
  await exigirGrupo("Catálogo");
  const supabase = await clienteServidor();
  const { error } = await supabase.from("categorias").delete().eq("id", id);
  if (error) throw new Error(mensajeDeError(error));
  revalidatePath("/", "layout");
  revalidatePath("/admin/categorias");
}

/* =================================== BARF ================================= */

const esquemaBarf = z.object({
  id: z.string().optional(),
  nombre: textoObligatorio("El nombre", 2),
  slug: z.string().trim().optional(),
  proteinas: comasATexto,
  descripcion: z.string().trim().optional(),
  composicion: lineasATexto,
  beneficios: lineasATexto,
  imagen: z.string().trim().optional(),
  color: z.enum(["coral", "petroleo", "ambar"]),
  activo: casilla,
  /** Tramos: "1-10:12" por línea (desde-hasta:precio; "21-:10" = a más). */
  rangos: z.string().trim().min(1, "Define al menos un tramo de precio"),
});

export async function guardarBarf(
  _estado: Resultado,
  datos: FormData,
): Promise<Resultado> {
  await exigirGrupo("Catálogo");

  const analisis = validar(esquemaBarf, datos);
  if (!analisis.ok) return analisis.resultado;
  const v = analisis.valor;

  const tramos = v.rangos
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((linea) => {
      const [intervalo, precio] = linea.split(":");
      const [desde, hasta] = (intervalo ?? "").split("-");
      return {
        desde_kg: Number(desde),
        hasta_kg: hasta && hasta.trim() !== "" ? Number(hasta) : null,
        precio_kg: Number(precio),
      };
    });

  if (tramos.some((t) => !Number.isFinite(t.desde_kg) || !Number.isFinite(t.precio_kg))) {
    return fallo("Revisa el formato de los tramos.", {
      rangos: "Usa una línea por tramo: 1-10:12 · 11-20:11 · 21-:10",
    });
  }

  const supabase = await clienteServidor();
  const slug = v.slug?.trim() ? aSlug(v.slug) : aSlug(v.nombre);

  const fila = {
    slug,
    nombre: v.nombre,
    proteinas: v.proteinas,
    descripcion: v.descripcion || null,
    composicion: v.composicion,
    beneficios: v.beneficios,
    imagen_url: v.imagen || null,
    color: v.color,
    activo: v.activo,
  };

  const { data, error } = v.id
    ? await supabase.from("productos_barf").update(fila).eq("id", v.id).select("id").single()
    : await supabase.from("productos_barf").insert(fila).select("id").single();

  if (error) return fallo(mensajeDeError(error));

  await supabase.from("barf_rangos").delete().eq("barf_id", data.id);
  const { error: errorRangos } = await supabase
    .from("barf_rangos")
    .insert(tramos.map((t) => ({ ...t, barf_id: data.id })));

  if (errorRangos) return fallo(mensajeDeError(errorRangos));

  revalidatePath("/barf");
  revalidatePath("/", "layout");
  revalidatePath("/admin/barf");
  return exito(v.id ? "Receta actualizada." : "Receta creada.");
}

/* ================================ Por mayor =============================== */

const esquemaLote = z.object({
  id: z.string().optional(),
  nombre: textoObligatorio("El nombre", 2),
  slug: z.string().trim().optional(),
  productos: comasATexto,
  unidad: textoObligatorio("La unidad"),
  minimo: textoObligatorio("El mínimo"),
  imagen: z.string().trim().optional(),
  nota: z.string().trim().optional(),
  activo: casilla,
  /** Precios: "1 docena:57.50" por línea. */
  precios: z.string().trim().min(1, "Agrega al menos un precio"),
});

export async function guardarLoteMayor(
  _estado: Resultado,
  datos: FormData,
): Promise<Resultado> {
  await exigirGrupo("Operación");

  const analisis = validar(esquemaLote, datos);
  if (!analisis.ok) return analisis.resultado;
  const v = analisis.valor;

  const precios = v.precios
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((linea, i) => {
      const corte = linea.lastIndexOf(":");
      return {
        etiqueta: linea.slice(0, corte).trim(),
        precio: Number(linea.slice(corte + 1)),
        orden: i,
      };
    });

  if (precios.some((p) => !p.etiqueta || !Number.isFinite(p.precio))) {
    return fallo("Revisa el formato de los precios.", {
      precios: "Usa una línea por presentación: 1 docena:57.50",
    });
  }

  const supabase = await clienteServidor();
  const slug = v.slug?.trim() ? aSlug(v.slug) : aSlug(v.nombre);

  const fila = {
    slug,
    nombre: v.nombre,
    productos: v.productos,
    unidad: v.unidad,
    minimo: v.minimo,
    imagen_url: v.imagen || null,
    nota: v.nota || null,
    activo: v.activo,
  };

  const { data, error } = v.id
    ? await supabase.from("lotes_mayor").update(fila).eq("id", v.id).select("id").single()
    : await supabase.from("lotes_mayor").insert(fila).select("id").single();

  if (error) return fallo(mensajeDeError(error));

  await supabase.from("lotes_mayor_precios").delete().eq("lote_id", data.id);
  const { error: errorPrecios } = await supabase
    .from("lotes_mayor_precios")
    .insert(precios.map((p) => ({ ...p, lote_id: data.id })));

  if (errorPrecios) return fallo(mensajeDeError(errorPrecios));

  revalidatePath("/por-mayor");
  revalidatePath("/admin/mayoreo");
  return exito(v.id ? "Lote actualizado." : "Lote creado.");
}

/* ================================ Imágenes ================================ */

const TIPOS_PERMITIDOS = ["image/png", "image/jpeg", "image/webp", "image/avif"];
const PESO_MAXIMO = 5 * 1024 * 1024; // 5 MB

/**
 * Sube una imagen al bucket `catalogo` y devuelve su URL pública.
 * Se usa desde los formularios del CMS.
 */
export async function subirImagen(
  _estado: Resultado & { url?: string },
  datos: FormData,
): Promise<Resultado & { url?: string }> {
  await exigirGrupo("Catálogo");

  const archivo = datos.get("archivo");
  if (!(archivo instanceof File) || archivo.size === 0) {
    return fallo("Elige una imagen.");
  }
  if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
    return fallo("Formato no admitido. Usa PNG, JPG, WebP o AVIF.");
  }
  if (archivo.size > PESO_MAXIMO) {
    return fallo("La imagen supera los 5 MB.");
  }

  const carpeta = String(datos.get("carpeta") ?? "productos");
  const extension = archivo.name.split(".").pop() ?? "png";
  const ruta = `${carpeta}/${crypto.randomUUID()}.${extension}`;

  const supabase = await clienteServidor();
  const { error } = await supabase.storage
    .from("catalogo")
    .upload(ruta, archivo, { contentType: archivo.type, upsert: false });

  if (error) return fallo(`No se pudo subir la imagen: ${error.message}`);

  const { data } = supabase.storage.from("catalogo").getPublicUrl(ruta);
  return { ok: true, mensaje: "Imagen subida.", url: data.publicUrl };
}
