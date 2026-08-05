import "server-only";

import { cache } from "react";
import { clienteServidor } from "@/lib/supabase/servidor";
import type { MovimientoPuntos, Recompensa, ReglaPuntos } from "@/lib/tipos";
import { reglaPuntos as REGLA_POR_DEFECTO } from "@/data/recompensas";

export const obtenerRegla = cache(async (): Promise<ReglaPuntos & { id: string | null }> => {
  const supabase = await clienteServidor();
  const { data } = await supabase
    .from("reglas_puntos")
    .select(
      "id, monto_por_punto, puntos_otorgados, vigencia_desde, vigencia_hasta, compra_minima, multiplicador, campana",
    )
    .eq("activa", true)
    .order("vigencia_desde", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return { ...REGLA_POR_DEFECTO, id: null };

  return {
    id: data.id,
    montoPorPunto: Number(data.monto_por_punto),
    puntosOtorgados: data.puntos_otorgados,
    vigenciaDesde: data.vigencia_desde,
    vigenciaHasta: data.vigencia_hasta,
    compraMinima: Number(data.compra_minima),
    multiplicador: data.multiplicador,
    campana: data.campana,
  };
});

export const obtenerRecompensas = cache(
  async (soloActivas = true): Promise<Array<Recompensa & { activa: boolean; valor: number }>> => {
    const supabase = await clienteServidor();
    let consulta = supabase
      .from("recompensas")
      .select("id, nombre, descripcion, puntos, tipo, valor, icono, activa");
    if (soloActivas) consulta = consulta.eq("activa", true);

    const { data, error } = await consulta.order("puntos", { ascending: true });
    if (error) throw new Error(`No se pudieron cargar las recompensas: ${error.message}`);

    return (data ?? []).map((r) => ({
      id: r.id,
      nombre: r.nombre,
      descripcion: r.descripcion ?? "",
      puntos: r.puntos,
      tipo: r.tipo as Recompensa["tipo"],
      icono: (r.icono ?? "regalo") as Recompensa["icono"],
      valor: r.valor === null ? 0 : Number(r.valor),
      activa: r.activa,
    }));
  },
);

/** Movimientos del cliente en sesión. */
export const misMovimientos = cache(async (): Promise<MovimientoPuntos[]> => {
  const supabase = await clienteServidor();
  const { data, error } = await supabase
    .from("movimientos_puntos")
    .select("id, concepto, puntos, estado, creado_en")
    .order("creado_en", { ascending: false });

  if (error) throw new Error(`No se pudo cargar tu historial: ${error.message}`);

  return (data ?? []).map((m) => ({
    id: m.id,
    fecha: m.creado_en.slice(0, 10),
    concepto: m.concepto,
    puntos: m.puntos,
    estado: m.estado as MovimientoPuntos["estado"],
  }));
});

/** Totales de puntos de toda la operación (CMS y reportes). */
export const resumenPuntos = cache(async () => {
  const supabase = await clienteServidor();
  const { data } = await supabase.from("movimientos_puntos").select("puntos, estado");

  const filas = data ?? [];
  const porEstado = (estado: string) =>
    filas
      .filter((m) => m.estado === estado)
      .reduce((t, m) => t + Math.abs(m.puntos), 0);

  const otorgados = filas
    .filter((m) => m.puntos > 0 && m.estado !== "cancelado")
    .reduce((t, m) => t + m.puntos, 0);
  const canjeados = porEstado("canjeado");

  return {
    otorgados,
    canjeados,
    pendientes: porEstado("pendiente"),
    disponibles: porEstado("disponible"),
    vencidos: porEstado("vencido"),
    cancelados: porEstado("cancelado"),
    tasaCanje: otorgados > 0 ? Math.round((canjeados / otorgados) * 100) : 0,
  };
});

/** Cuántas veces se canjeó cada recompensa. */
export const canjesPorRecompensa = cache(async () => {
  const supabase = await clienteServidor();
  const { data } = await supabase
    .from("movimientos_puntos")
    .select("recompensas ( nombre )")
    .eq("estado", "canjeado");

  const conteo = new Map<string, number>();
  (data ?? []).forEach((m) => {
    const nombre = (m as unknown as { recompensas: { nombre: string } | null })
      .recompensas?.nombre;
    if (nombre) conteo.set(nombre, (conteo.get(nombre) ?? 0) + 1);
  });

  return [...conteo.entries()]
    .map(([recompensa, veces]) => ({ recompensa, veces }))
    .sort((a, b) => b.veces - a.veces);
});

/** Puntos que genera un monto según la regla vigente. */
export function calcularPuntos(monto: number, regla: ReglaPuntos): number {
  if (monto < regla.compraMinima) return 0;
  return (
    Math.floor(monto / regla.montoPorPunto) * regla.puntosOtorgados * regla.multiplicador
  );
}
