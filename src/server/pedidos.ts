import "server-only";

import { cache } from "react";
import { clienteServidor } from "@/lib/supabase/servidor";
import type { EstadoPedido, LineaPedido, Pedido } from "@/lib/tipos";

const SELECCION = `
  id, numero, creado_en, estado, total, subtotal, descuento, envio,
  puntos_generados, entrega, metodo_pago, nombres, apellidos, celular,
  direccion, distrito, notas, perfil_id,
  pedido_lineas ( nombre, presentacion, precio_unitario, cantidad, productos ( slug, imagen_url ) )
`;

interface FilaLinea {
  nombre: string;
  presentacion: string;
  precio_unitario: number;
  cantidad: number;
  productos: { slug: string; imagen_url: string | null } | null;
}

interface FilaPedido {
  id: string;
  numero: string;
  creado_en: string;
  estado: EstadoPedido;
  total: number;
  subtotal: number;
  descuento: number;
  envio: number;
  puntos_generados: number;
  entrega: string;
  metodo_pago: string;
  nombres: string;
  apellidos: string | null;
  celular: string;
  direccion: string | null;
  distrito: string | null;
  notas: string | null;
  perfil_id: string | null;
  pedido_lineas: FilaLinea[];
}

/** Pedido con los datos extra que necesita el CMS. */
export interface PedidoAdmin extends Pedido {
  id: string;
  cliente: string;
  celular: string;
  direccion: string;
  subtotal: number;
  descuento: number;
  envioCosto: number;
  notas: string;
}

function aPedido(fila: FilaPedido): PedidoAdmin {
  const lineas: Array<LineaPedido & { slug: string; imagen: string }> = (
    fila.pedido_lineas ?? []
  ).map((l) => ({
    nombre: l.nombre,
    presentacion: l.presentacion,
    cantidad: l.cantidad,
    precio: Number(l.precio_unitario),
    slug: l.productos?.slug ?? "",
    imagen: l.productos?.imagen_url ?? "/productos/barf.png",
  }));

  return {
    id: fila.id,
    numero: fila.numero,
    fecha: fila.creado_en.slice(0, 10),
    estado: fila.estado,
    total: Number(fila.total),
    subtotal: Number(fila.subtotal),
    descuento: Number(fila.descuento),
    envioCosto: Number(fila.envio),
    puntos: fila.puntos_generados,
    entrega: fila.entrega === "recojo" ? "recojo" : "delivery",
    pago: fila.metodo_pago,
    lineas,
    cliente: `${fila.nombres} ${fila.apellidos ?? ""}`.trim(),
    celular: fila.celular,
    direccion: [fila.direccion, fila.distrito].filter(Boolean).join(", "),
    notas: fila.notas ?? "",
  };
}

/** Pedidos del cliente en sesión. */
export const misPedidos = cache(async (): Promise<PedidoAdmin[]> => {
  const supabase = await clienteServidor();
  const { data, error } = await supabase
    .from("pedidos")
    .select(SELECCION)
    .order("creado_en", { ascending: false });

  if (error) throw new Error(`No se pudieron cargar tus pedidos: ${error.message}`);
  return ((data ?? []) as unknown as FilaPedido[]).map(aPedido);
});

/** Todos los pedidos (solo staff; RLS lo garantiza). */
export const obtenerPedidos = cache(
  async (estado?: EstadoPedido): Promise<PedidoAdmin[]> => {
    const supabase = await clienteServidor();
    let consulta = supabase.from("pedidos").select(SELECCION);
    if (estado) consulta = consulta.eq("estado", estado);

    const { data, error } = await consulta.order("creado_en", { ascending: false });
    if (error) throw new Error(`No se pudieron cargar los pedidos: ${error.message}`);
    return ((data ?? []) as unknown as FilaPedido[]).map(aPedido);
  },
);

export const obtenerPedido = cache(async (id: string): Promise<PedidoAdmin | null> => {
  const supabase = await clienteServidor();
  const { data, error } = await supabase
    .from("pedidos")
    .select(SELECCION)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`No se pudo cargar el pedido: ${error.message}`);
  return data ? aPedido(data as unknown as FilaPedido) : null;
});

export interface EventoPedido {
  id: string;
  estado: EstadoPedido | null;
  nota: string | null;
  fecha: string;
  autor: string;
}

export const historialDePedido = cache(
  async (pedidoId: string): Promise<EventoPedido[]> => {
    const supabase = await clienteServidor();
    const { data, error } = await supabase
      .from("pedido_historial")
      .select("id, estado, nota, creado_en, staff:autor_id ( nombre )")
      .eq("pedido_id", pedidoId)
      .order("creado_en", { ascending: true });

    if (error) throw new Error(`No se pudo cargar el historial: ${error.message}`);

    return (data ?? []).map((h) => {
      const autor = h.staff as unknown as { nombre: string } | null;
      return {
        id: h.id,
        estado: h.estado as EstadoPedido | null,
        nota: h.nota,
        fecha: h.creado_en,
        autor: autor?.nombre ?? "Sistema",
      };
    });
  },
);

/* ------------------------------ Cotizaciones ------------------------------ */

export interface Cotizacion {
  id: string;
  codigo: string;
  negocio: string;
  ruc: string | null;
  tipoNegocio: string | null;
  telefono: string;
  correo: string;
  productos: string;
  cantidad: string;
  fechaRequerida: string;
  mensaje: string | null;
  estado: "pendiente" | "cotizado" | "aprobado" | "rechazado";
  monto: number | null;
  creadoEn: string;
}

export const obtenerCotizaciones = cache(async (): Promise<Cotizacion[]> => {
  const supabase = await clienteServidor();
  const { data, error } = await supabase
    .from("cotizaciones_mayor")
    .select(
      "id, codigo, negocio, ruc, tipo_negocio, telefono, correo, productos, cantidad, fecha_requerida, mensaje, estado, monto, creado_en",
    )
    .order("creado_en", { ascending: false });

  if (error) throw new Error(`No se pudieron cargar las cotizaciones: ${error.message}`);

  return (data ?? []).map((c) => ({
    id: c.id,
    codigo: c.codigo,
    negocio: c.negocio,
    ruc: c.ruc,
    tipoNegocio: c.tipo_negocio,
    telefono: c.telefono,
    correo: c.correo,
    productos: c.productos,
    cantidad: c.cantidad,
    fechaRequerida: c.fecha_requerida,
    mensaje: c.mensaje,
    estado: c.estado,
    monto: c.monto === null ? null : Number(c.monto),
    creadoEn: c.creado_en,
  }));
});

/* ------------------------------- Estadísticas ----------------------------- */

export const resumenOperacion = cache(async () => {
  const pedidos = await obtenerPedidos();

  const hoy = new Date();
  const haceSieteDias = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);
  const recientes = pedidos.filter(
    (p) => new Date(p.fecha) >= haceSieteDias && p.estado !== "cancelado",
  );

  const ventasSemana = recientes.reduce((t, p) => t + p.total, 0);
  const ticket = recientes.length ? Math.round(ventasSemana / recientes.length) : 0;

  // Serie de los últimos 7 días, de lunes a domingo del periodo
  const dias = Array.from({ length: 7 }, (_, i) => {
    const fecha = new Date(hoy.getTime() - (6 - i) * 24 * 60 * 60 * 1000);
    const clave = fecha.toISOString().slice(0, 10);
    return {
      dia: fecha.toLocaleDateString("es-PE", { weekday: "short" }),
      monto: pedidos
        .filter((p) => p.fecha === clave && p.estado !== "cancelado")
        .reduce((t, p) => t + p.total, 0),
    };
  });

  return {
    pedidos,
    ventasSemana,
    ticket,
    dias,
    pendientes: pedidos.filter(
      (p) => p.estado !== "entregado" && p.estado !== "cancelado",
    ),
  };
});
