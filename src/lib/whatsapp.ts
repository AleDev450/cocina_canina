import { sitio } from "@/data/sitio";
import type { ItemCarrito } from "@/lib/tipos";
import { precio } from "@/lib/formato";

/**
 * Enlaces de WhatsApp. El número por defecto viene de `src/data/sitio.ts`,
 * pero cualquier función acepta el que esté configurado en el CMS.
 */

export function enlaceWhatsapp(mensaje: string, numero = sitio.whatsapp): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

/** Consulta general desde el header o el botón flotante. */
export function consultaGeneral(numero = sitio.whatsapp): string {
  return enlaceWhatsapp(
    `¡Hola ${sitio.nombre}! Vengo de la web y quisiera hacer una consulta sobre sus productos.`,
    numero,
  );
}

/** Consulta sobre un producto concreto. */
export function consultaProducto(
  nombre: string,
  presentacion?: string,
  numero = sitio.whatsapp,
): string {
  const detalle = presentacion ? ` (${presentacion})` : "";
  return enlaceWhatsapp(
    `¡Hola ${sitio.nombre}! Me interesa *${nombre}*${detalle}. ¿Tienen stock disponible?`,
    numero,
  );
}

interface DatosPedido {
  cliente?: string;
  items: ItemCarrito[];
  total: number;
  direccion?: string;
  entrega?: string;
  numero?: string;
}

/**
 * Mensaje de pedido: nombre del cliente, lista de productos con presentación y
 * cantidad, total referencial, dirección y método de entrega.
 */
export function mensajePedido({
  cliente,
  items,
  total,
  direccion,
  entrega,
}: DatosPedido): string {
  const lineas = items.map(
    (i) =>
      `• ${i.nombre} — ${i.presentacion} × ${i.cantidad}  ${precio(i.precio * i.cantidad)}`,
  );

  const partes = [
    `¡Hola ${sitio.nombre}! Quiero hacer el siguiente pedido:`,
    "",
    cliente ? `*Cliente:* ${cliente}` : null,
    "",
    "*Productos*",
    ...lineas,
    "",
    `*Total referencial:* ${precio(total)}`,
    entrega ? `*Entrega:* ${entrega}` : null,
    direccion ? `*Dirección:* ${direccion}` : null,
    "",
    "Quedo atento(a) a la confirmación de disponibilidad, costo de envío y horario de entrega. ¡Gracias!",
  ];

  return partes.filter((p) => p !== null).join("\n");
}

export function enlacePedido(datos: DatosPedido): string {
  return enlaceWhatsapp(mensajePedido(datos), datos.numero ?? sitio.whatsapp);
}

/** Solicitud de cotización por mayor. */
export function cotizacionMayor(
  campos: {
    negocio: string;
    productos: string;
    cantidad: string;
    fecha: string;
  },
  numero = sitio.whatsapp,
): string {
  return enlaceWhatsapp(
    [
      `¡Hola ${sitio.nombre}! Quisiera una cotización por mayor.`,
      "",
      `*Negocio:* ${campos.negocio}`,
      `*Productos:* ${campos.productos}`,
      `*Cantidad aproximada:* ${campos.cantidad}`,
      `*Fecha requerida:* ${campos.fecha}`,
      "",
      "Entiendo que los pedidos por mayor se solicitan con al menos 3 días de anticipación.",
    ].join("\n"),
    numero,
  );
}
