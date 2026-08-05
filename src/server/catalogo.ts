import "server-only";

import { cache } from "react";
import { clienteServidor } from "@/lib/supabase/servidor";
import type {
  Categoria,
  LoteMayor,
  Presentacion,
  Producto,
  ProductoBarf,
} from "@/lib/tipos";

/**
 * Consultas del catálogo.
 *
 * Devuelven exactamente las mismas formas que definían los antiguos arreglos de
 * `src/data`, de modo que los componentes de presentación no cambian.
 */

/* --------------------------------- Filas ---------------------------------- */

interface FilaPresentacion {
  codigo: string;
  etiqueta: string;
  tipo: Presentacion["tipo"];
  precio: number;
  stock: number;
  orden: number;
}

interface FilaProducto {
  id: string;
  slug: string;
  nombre: string;
  dureza: Producto["dureza"];
  proteinas: string[];
  beneficio_principal: string | null;
  descripcion: string | null;
  beneficios: string[];
  ingredientes: string[];
  minerales: string | null;
  tamanos: Producto["tamanos"];
  edades: Producto["edades"];
  imagen_url: string | null;
  galeria: string[];
  etiquetas: string[];
  destacado: boolean;
  activo: boolean;
  conservacion: string | null;
  advertencia: string | null;
  disponible_mayor: boolean;
  ventas: number;
  orden: number;
  categorias: { slug: string } | null;
  presentaciones: FilaPresentacion[];
}

const SELECCION_PRODUCTO = `
  id, slug, nombre, dureza, proteinas, beneficio_principal, descripcion,
  beneficios, ingredientes, minerales, tamanos, edades, imagen_url, galeria,
  etiquetas, destacado, activo, conservacion, advertencia, disponible_mayor,
  ventas, orden,
  categorias ( slug ),
  presentaciones ( codigo, etiqueta, tipo, precio, stock, orden )
`;

const IMAGEN_POR_DEFECTO = "/productos/barf.png";

function aProducto(fila: FilaProducto, relacionados: string[] = []): Producto {
  const presentaciones = [...(fila.presentaciones ?? [])]
    .sort((a, b) => a.orden - b.orden)
    .map<Presentacion>((p) => ({
      id: p.codigo,
      etiqueta: p.etiqueta,
      precio: Number(p.precio),
      tipo: p.tipo,
      stock: p.stock,
    }));

  const imagen = fila.imagen_url ?? IMAGEN_POR_DEFECTO;

  return {
    slug: fila.slug,
    nombre: fila.nombre,
    categoria: fila.categorias?.slug ?? "",
    dureza: fila.dureza,
    proteinas: fila.proteinas as Producto["proteinas"],
    beneficioPrincipal: fila.beneficio_principal ?? "",
    descripcion: fila.descripcion ?? "",
    beneficios: fila.beneficios ?? [],
    ingredientes: fila.ingredientes ?? [],
    minerales: fila.minerales ?? "",
    tamanos: fila.tamanos ?? [],
    edades: fila.edades ?? [],
    presentaciones,
    imagen,
    galeria: fila.galeria?.length ? fila.galeria : [imagen],
    etiquetas: (fila.etiquetas ?? []) as Producto["etiquetas"],
    destacado: fila.destacado,
    ventas: fila.ventas,
    orden: fila.orden,
    conservacion: fila.conservacion ?? "",
    advertencia: fila.advertencia ?? "",
    relacionados,
    disponiblePorMayor: fila.disponible_mayor,
  };
}

/* ------------------------------- Consultas -------------------------------- */

/**
 * Catálogo público. `incluirInactivos` solo debe usarse desde el CMS: RLS
 * permite leerlos, pero la tienda nunca los muestra.
 */
export const obtenerProductos = cache(
  async (incluirInactivos = false): Promise<Producto[]> => {
    const supabase = await clienteServidor();
    let consulta = supabase.from("productos").select(SELECCION_PRODUCTO);
    if (!incluirInactivos) consulta = consulta.eq("activo", true);

    const { data, error } = await consulta.order("orden", { ascending: true });
    if (error) throw new Error(`No se pudo cargar el catálogo: ${error.message}`);

    return ((data ?? []) as unknown as FilaProducto[]).map((f) => aProducto(f));
  },
);

/** Igual que `obtenerProductos`, pero conservando el estado activo/inactivo. */
export const obtenerProductosAdmin = cache(
  async (): Promise<Array<Producto & { activo: boolean; id: string }>> => {
    const supabase = await clienteServidor();
    const { data, error } = await supabase
      .from("productos")
      .select(SELECCION_PRODUCTO)
      .order("orden", { ascending: true });

    if (error) throw new Error(`No se pudo cargar el catálogo: ${error.message}`);

    return ((data ?? []) as unknown as FilaProducto[]).map((f) => ({
      ...aProducto(f),
      activo: f.activo,
      id: f.id,
    }));
  },
);

export const obtenerProducto = cache(
  async (slug: string): Promise<Producto | null> => {
    const supabase = await clienteServidor();

    const { data, error } = await supabase
      .from("productos")
      .select(SELECCION_PRODUCTO)
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw new Error(`No se pudo cargar el producto: ${error.message}`);
    if (!data) return null;

    const fila = data as unknown as FilaProducto;

    const { data: relaciones } = await supabase
      .from("productos_relacionados")
      .select("productos!productos_relacionados_relacionado_id_fkey ( slug )")
      .eq("producto_id", fila.id);

    const relacionados = (relaciones ?? [])
      .map((r) => (r as unknown as { productos: { slug: string } | null }).productos?.slug)
      .filter((s): s is string => Boolean(s));

    return aProducto(fila, relacionados);
  },
);

export const obtenerCategorias = cache(async (): Promise<Categoria[]> => {
  const supabase = await clienteServidor();
  const { data, error } = await supabase
    .from("categorias")
    .select("slug, nombre, descripcion_corta, descripcion, icono, imagen_url, acento, visible")
    .eq("visible", true)
    .order("orden", { ascending: true });

  if (error) throw new Error(`No se pudieron cargar las categorías: ${error.message}`);

  return (data ?? []).map((c) => ({
    slug: c.slug,
    nombre: c.nombre,
    descripcionCorta: c.descripcion_corta ?? "",
    descripcion: c.descripcion ?? "",
    icono: (c.icono ?? "suave") as Categoria["icono"],
    imagen: c.imagen_url ?? IMAGEN_POR_DEFECTO,
    acento: (c.acento ?? "petroleo") as Categoria["acento"],
  }));
});

export const obtenerCategoriasAdmin = cache(
  async (): Promise<Array<Categoria & { id: string; visible: boolean; total: number }>> => {
    const supabase = await clienteServidor();
    const { data, error } = await supabase
      .from("categorias")
      .select(
        "id, slug, nombre, descripcion_corta, descripcion, icono, imagen_url, acento, visible, productos(count)",
      )
      .order("orden", { ascending: true });

    if (error) throw new Error(`No se pudieron cargar las categorías: ${error.message}`);

    return (data ?? []).map((c) => {
      const conteo = c.productos as unknown as Array<{ count: number }> | null;
      return {
        id: c.id,
        slug: c.slug,
        nombre: c.nombre,
        descripcionCorta: c.descripcion_corta ?? "",
        descripcion: c.descripcion ?? "",
        icono: (c.icono ?? "suave") as Categoria["icono"],
        imagen: c.imagen_url ?? IMAGEN_POR_DEFECTO,
        acento: (c.acento ?? "petroleo") as Categoria["acento"],
        visible: c.visible,
        total: conteo?.[0]?.count ?? 0,
      };
    });
  },
);

export const obtenerBarf = cache(async (): Promise<ProductoBarf[]> => {
  const supabase = await clienteServidor();
  const { data, error } = await supabase
    .from("productos_barf")
    .select(
      "slug, nombre, proteinas, descripcion, composicion, beneficios, imagen_url, color, barf_rangos ( desde_kg, hasta_kg, precio_kg )",
    )
    .eq("activo", true)
    .order("orden", { ascending: true });

  if (error) throw new Error(`No se pudo cargar BARF: ${error.message}`);

  return (data ?? []).map((b) => {
    const rangos = (b.barf_rangos ?? []) as Array<{
      desde_kg: number;
      hasta_kg: number | null;
      precio_kg: number;
    }>;

    return {
      slug: b.slug,
      nombre: b.nombre,
      proteinas: b.proteinas as ProductoBarf["proteinas"],
      descripcion: b.descripcion ?? "",
      composicion: b.composicion ?? [],
      beneficios: b.beneficios ?? [],
      rangos: [...rangos]
        .sort((x, y) => x.desde_kg - y.desde_kg)
        .map((r) => ({
          desde: r.desde_kg,
          hasta: r.hasta_kg,
          precioKg: Number(r.precio_kg),
        })),
      imagen: b.imagen_url ?? IMAGEN_POR_DEFECTO,
      color: (b.color ?? "petroleo") as ProductoBarf["color"],
    };
  });
});

export const obtenerLotesMayor = cache(async (): Promise<LoteMayor[]> => {
  const supabase = await clienteServidor();
  const { data, error } = await supabase
    .from("lotes_mayor")
    .select(
      "slug, nombre, productos, unidad, minimo, imagen_url, nota, lotes_mayor_precios ( etiqueta, precio, orden )",
    )
    .eq("activo", true)
    .order("orden", { ascending: true });

  if (error) throw new Error(`No se pudo cargar la lista por mayor: ${error.message}`);

  return (data ?? []).map((l) => {
    const precios = (l.lotes_mayor_precios ?? []) as Array<{
      etiqueta: string;
      precio: number;
      orden: number;
    }>;

    return {
      slug: l.slug,
      nombre: l.nombre,
      productos: l.productos ?? [],
      unidad: l.unidad,
      minimo: l.minimo,
      imagen: l.imagen_url ?? IMAGEN_POR_DEFECTO,
      nota: l.nota ?? undefined,
      presentaciones: [...precios]
        .sort((a, b) => a.orden - b.orden)
        .map((p) => ({ etiqueta: p.etiqueta, precio: Number(p.precio) })),
    };
  });
});

/** Igual que `obtenerLotesMayor`, con id y estado para el CMS. */
export const obtenerLotesMayorAdmin = cache(
  async (): Promise<Array<LoteMayor & { id: string; activo: boolean }>> => {
    const supabase = await clienteServidor();
    const { data, error } = await supabase
      .from("lotes_mayor")
      .select(
        "id, slug, nombre, productos, unidad, minimo, imagen_url, nota, activo, lotes_mayor_precios ( etiqueta, precio, orden )",
      )
      .order("orden", { ascending: true });

    if (error) throw new Error(`No se pudo cargar la lista por mayor: ${error.message}`);

    return (data ?? []).map((l) => {
      const precios = (l.lotes_mayor_precios ?? []) as Array<{
        etiqueta: string;
        precio: number;
        orden: number;
      }>;

      return {
        id: l.id,
        slug: l.slug,
        nombre: l.nombre,
        productos: l.productos ?? [],
        unidad: l.unidad,
        minimo: l.minimo,
        imagen: l.imagen_url ?? IMAGEN_POR_DEFECTO,
        nota: l.nota ?? undefined,
        activo: l.activo,
        presentaciones: [...precios]
          .sort((a, b) => a.orden - b.orden)
          .map((p) => ({ etiqueta: p.etiqueta, precio: Number(p.precio) })),
      };
    });
  },
);

/** Presentaciones de todos los productos, para inventario y CMS. */
export const obtenerInventario = cache(async () => {
  const supabase = await clienteServidor();
  const { data, error } = await supabase
    .from("presentaciones")
    .select(
      "id, codigo, etiqueta, tipo, precio, stock, orden, productos ( slug, nombre, imagen_url )",
    )
    .order("orden", { ascending: true });

  if (error) throw new Error(`No se pudo cargar el inventario: ${error.message}`);

  return (data ?? []).map((v) => {
    const producto = v.productos as unknown as {
      slug: string;
      nombre: string;
      imagen_url: string | null;
    } | null;

    return {
      id: v.id,
      codigo: v.codigo,
      etiqueta: v.etiqueta,
      tipo: v.tipo as Presentacion["tipo"],
      precio: Number(v.precio),
      stock: v.stock,
      productoSlug: producto?.slug ?? "",
      productoNombre: producto?.nombre ?? "",
      productoImagen: producto?.imagen_url ?? IMAGEN_POR_DEFECTO,
    };
  });
});
