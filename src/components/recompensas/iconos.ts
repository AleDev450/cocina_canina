import { BadgePercent, Gift, PartyPopper, Ticket, Truck } from "lucide-react";

/**
 * Icono de cada tipo de recompensa. Vive en su propio módulo (sin "use client")
 * para poder importarse tanto desde el CMS como desde la tienda.
 */
export const ICONO_RECOMPENSA = {
  descuento: BadgePercent,
  porcentaje: BadgePercent,
  regalo: Gift,
  envio: Truck,
  cupon: Ticket,
  sorpresa: PartyPopper,
} as const;
