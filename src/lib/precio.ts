import type { Producto } from "@/lib/tipos";

/** Helpers puros sobre productos, usables tanto en cliente como en servidor. */

export function precioDesde(p: Producto): number {
  if (p.presentaciones.length === 0) return 0;
  return Math.min(...p.presentaciones.map((v) => v.precio));
}

export function stockTotal(p: Producto): number {
  return p.presentaciones.reduce((t, v) => t + v.stock, 0);
}

/** "dureza-media" → "Dureza media" */
export function nombreDesdeSlug(slug: string): string {
  const texto = slug.replace(/-/g, " ");
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
