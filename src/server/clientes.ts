import "server-only";

import { cache } from "react";
import { clienteServidor } from "@/lib/supabase/servidor";
import type { Cupon, Direccion, Mascota } from "@/lib/tipos";

/* -------------------------------- Mascotas -------------------------------- */

export const misMascotas = cache(async (): Promise<Mascota[]> => {
  const supabase = await clienteServidor();
  const { data, error } = await supabase
    .from("mascotas")
    .select(
      "id, nombre, foto_url, especie, raza, nacimiento, peso_kg, alergias, preferencias, mascota_favoritos ( productos ( slug ) )",
    )
    .order("creado_en", { ascending: true });

  if (error) throw new Error(`No se pudieron cargar tus mascotas: ${error.message}`);

  return (data ?? []).map((m) => {
    const favoritos = (m.mascota_favoritos ?? []) as unknown as Array<{
      productos: { slug: string } | null;
    }>;

    return {
      id: m.id,
      nombre: m.nombre,
      foto: m.foto_url ?? "",
      especie: m.especie,
      raza: m.raza ?? "",
      nacimiento: m.nacimiento ?? "",
      pesoKg: m.peso_kg === null ? 0 : Number(m.peso_kg),
      alergias: m.alergias ?? [],
      preferencias: m.preferencias ?? [],
      favoritos: favoritos.map((f) => f.productos?.slug).filter((s): s is string => Boolean(s)),
    };
  });
});

/** Todas las mascotas con su dueño (solo staff). */
export const obtenerMascotas = cache(async () => {
  const supabase = await clienteServidor();
  const { data, error } = await supabase
    .from("mascotas")
    .select(
      "id, nombre, foto_url, especie, raza, nacimiento, peso_kg, alergias, preferencias, perfiles ( nombres, apellidos )",
    )
    .order("creado_en", { ascending: false });

  if (error) throw new Error(`No se pudieron cargar las mascotas: ${error.message}`);

  return (data ?? []).map((m) => {
    const dueno = m.perfiles as unknown as {
      nombres: string;
      apellidos: string | null;
    } | null;

    return {
      id: m.id,
      nombre: m.nombre,
      foto: m.foto_url ?? "",
      especie: m.especie,
      raza: m.raza ?? "",
      nacimiento: m.nacimiento ?? "",
      pesoKg: m.peso_kg === null ? 0 : Number(m.peso_kg),
      alergias: m.alergias ?? [],
      preferencias: m.preferencias ?? [],
      dueno: dueno ? `${dueno.nombres} ${dueno.apellidos ?? ""}`.trim() : "—",
    };
  });
});

/* ------------------------------- Direcciones ------------------------------ */

export const misDirecciones = cache(async (): Promise<Direccion[]> => {
  const supabase = await clienteServidor();
  const { data, error } = await supabase
    .from("direcciones")
    .select("id, alias, linea, distrito, referencia, predeterminada")
    .order("predeterminada", { ascending: false });

  if (error) throw new Error(`No se pudieron cargar tus direcciones: ${error.message}`);

  return (data ?? []).map((d) => ({
    id: d.id,
    alias: d.alias,
    linea: d.linea,
    distrito: d.distrito,
    referencia: d.referencia ?? "",
    predeterminada: d.predeterminada,
  }));
});

/* --------------------------------- Cupones -------------------------------- */

export const misCupones = cache(async (): Promise<Cupon[]> => {
  const supabase = await clienteServidor();
  const { data, error } = await supabase
    .from("cupones")
    .select("codigo, descripcion, tipo, valor, vence_en, activo")
    .eq("activo", true)
    .order("vence_en", { ascending: true });

  if (error) throw new Error(`No se pudieron cargar los cupones: ${error.message}`);

  return (data ?? []).map((c) => ({
    codigo: c.codigo,
    descripcion: c.descripcion ?? "",
    vence: c.vence_en ?? "",
    tipo: c.tipo as Cupon["tipo"],
    valor: Number(c.valor),
    usado: false,
  }));
});

export const obtenerCupones = cache(async () => {
  const supabase = await clienteServidor();
  const { data, error } = await supabase
    .from("cupones")
    .select("id, codigo, descripcion, tipo, valor, compra_minima, usos_maximos, usos, vence_en, activo")
    .order("codigo", { ascending: true });

  if (error) throw new Error(`No se pudieron cargar los cupones: ${error.message}`);

  return (data ?? []).map((c) => ({
    id: c.id,
    codigo: c.codigo,
    descripcion: c.descripcion ?? "",
    tipo: c.tipo as Cupon["tipo"],
    valor: Number(c.valor),
    compraMinima: Number(c.compra_minima),
    usosMaximos: c.usos_maximos,
    usos: c.usos,
    vence: c.vence_en ?? "",
    activo: c.activo,
  }));
});

/* --------------------------- Clientes para el CMS ------------------------- */

export const obtenerClientes = cache(async () => {
  const supabase = await clienteServidor();
  const { data, error } = await supabase
    .from("perfiles")
    .select(
      "id, nombres, apellidos, correo, celular, puntos, creado_en, mascotas(count), pedidos(count)",
    )
    .order("creado_en", { ascending: false });

  if (error) throw new Error(`No se pudieron cargar los clientes: ${error.message}`);

  // El total gastado se calcula aparte: agregar sobre una relación anidada no
  // está disponible en PostgREST.
  const { data: totales } = await supabase
    .from("pedidos")
    .select("perfil_id, total, estado");

  const gastoPorCliente = new Map<string, number>();
  (totales ?? []).forEach((p) => {
    if (!p.perfil_id || p.estado === "cancelado") return;
    gastoPorCliente.set(
      p.perfil_id,
      (gastoPorCliente.get(p.perfil_id) ?? 0) + Number(p.total),
    );
  });

  return (data ?? []).map((c) => {
    const mascotas = c.mascotas as unknown as Array<{ count: number }> | null;
    const pedidos = c.pedidos as unknown as Array<{ count: number }> | null;

    return {
      id: c.id,
      nombre: `${c.nombres} ${c.apellidos ?? ""}`.trim(),
      correo: c.correo,
      celular: c.celular ?? "—",
      puntos: c.puntos,
      desde: c.creado_en.slice(0, 10),
      mascotas: mascotas?.[0]?.count ?? 0,
      pedidos: pedidos?.[0]?.count ?? 0,
      gastado: gastoPorCliente.get(c.id) ?? 0,
    };
  });
});

/* ------------------------------- Personal --------------------------------- */

export const obtenerStaff = cache(async () => {
  const supabase = await clienteServidor();
  const { data, error } = await supabase
    .from("staff")
    .select("id, nombre, correo, rol, activo, ultimo_acceso, creado_en")
    .order("creado_en", { ascending: true });

  if (error) throw new Error(`No se pudo cargar el personal: ${error.message}`);
  return data ?? [];
});

export const obtenerPermisos = cache(async () => {
  const supabase = await clienteServidor();
  const { data, error } = await supabase
    .from("rol_permisos")
    .select("rol, grupo, permitido");

  if (error) throw new Error(`No se pudieron cargar los permisos: ${error.message}`);
  return data ?? [];
});
