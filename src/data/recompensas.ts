import type { MovimientoPuntos, Recompensa, ReglaPuntos } from "@/lib/tipos";

/**
 * Regla vigente del Club Cocina Canina.
 *
 * Cada campo de aquí es un campo editable del módulo "Programa de recompensas"
 * del CMS: monto por punto, puntos otorgados, vigencia, compra mínima,
 * multiplicador y campaña activa.
 */
export const reglaPuntos: ReglaPuntos = {
  montoPorPunto: 10,
  puntosOtorgados: 1,
  vigenciaDesde: "2026-01-01",
  vigenciaHasta: "2026-12-31",
  compraMinima: 0,
  multiplicador: 1,
  campana: null,
};

/** Puntos que genera un subtotal, aplicando la regla vigente. */
export function puntosPorMonto(monto: number, regla: ReglaPuntos = reglaPuntos): number {
  if (monto < regla.compraMinima) return 0;
  return (
    Math.floor(monto / regla.montoPorPunto) * regla.puntosOtorgados * regla.multiplicador
  );
}

export const recompensas: Recompensa[] = [
  {
    id: "r1",
    nombre: "Descuento de S/ 10",
    descripcion: "Se aplica al total de tu siguiente pedido.",
    puntos: 200,
    tipo: "descuento-fijo",
    icono: "descuento",
  },
  {
    id: "r2",
    nombre: "Envío gratis",
    descripcion: "Delivery sin costo en Lima Metropolitana.",
    puntos: 150,
    tipo: "envio-gratis",
    icono: "envio",
  },
  {
    id: "r3",
    nombre: "Oreja de cerdo gratis",
    descripcion: "Una unidad de regalo con tu pedido.",
    puntos: 120,
    tipo: "producto-gratis",
    icono: "regalo",
  },
  {
    id: "r4",
    nombre: "15% de descuento",
    descripcion: "Sobre el total de la compra, sin tope.",
    puntos: 350,
    tipo: "descuento-porcentual",
    icono: "porcentaje",
  },
  {
    id: "r5",
    nombre: "Bolsa sorpresa Cocina Canina",
    descripcion: "Un mix de snacks elegido por nosotros.",
    puntos: 500,
    tipo: "regalo",
    icono: "sorpresa",
  },
  {
    id: "r6",
    nombre: "Cupón cumpleañero",
    descripcion: "S/ 20 para celebrar el cumpleaños de tu perro.",
    puntos: 400,
    tipo: "cupon",
    icono: "cupon",
  },
];

export const historialPuntos: MovimientoPuntos[] = [
  {
    id: "m1",
    fecha: "2026-07-28",
    concepto: "Pedido LCC-1042",
    puntos: 18,
    estado: "pendiente",
  },
  {
    id: "m2",
    fecha: "2026-07-11",
    concepto: "Pedido LCC-1027",
    puntos: 24,
    estado: "disponible",
  },
  {
    id: "m3",
    fecha: "2026-06-30",
    concepto: "Canje: envío gratis",
    puntos: -150,
    estado: "canjeado",
  },
  {
    id: "m4",
    fecha: "2026-06-14",
    concepto: "Pedido LCC-0998 · campaña puntos dobles",
    puntos: 62,
    estado: "disponible",
  },
  {
    id: "m5",
    fecha: "2026-05-22",
    concepto: "Pedido LCC-0961",
    puntos: 31,
    estado: "disponible",
  },
  {
    id: "m6",
    fecha: "2026-05-03",
    concepto: "Registro en el Club Cocina Canina",
    puntos: 20,
    estado: "disponible",
  },
  {
    id: "m7",
    fecha: "2026-04-18",
    concepto: "Pedido LCC-0902 · anulado",
    puntos: 15,
    estado: "cancelado",
  },
  {
    id: "m8",
    fecha: "2025-07-30",
    concepto: "Pedido LCC-0611",
    puntos: 12,
    estado: "vencido",
  },
];

export const nombreEstadoPuntos: Record<string, string> = {
  pendiente: "Pendientes",
  disponible: "Disponibles",
  canjeado: "Canjeados",
  vencido: "Vencidos",
  cancelado: "Cancelados",
};

export const nombreTipoRecompensa: Record<string, string> = {
  "descuento-fijo": "Descuento fijo",
  "descuento-porcentual": "Descuento porcentual",
  "producto-gratis": "Producto gratis",
  "envio-gratis": "Envío gratis",
  cupon: "Cupón especial",
  regalo: "Regalo sorpresa",
};

/** Siguiente recompensa alcanzable con los puntos disponibles. */
export function siguienteRecompensa(puntos: number): Recompensa | undefined {
  return [...recompensas].sort((a, b) => a.puntos - b.puntos).find((r) => r.puntos > puntos);
}
