import type { ProductoBarf } from "@/lib/tipos";

/** Precios por kilogramo tomados de la sección BARF del catálogo oficial. */
export const productosBarf: ProductoBarf[] = [
  {
    slug: "barf-pollo-equino",
    nombre: "BARF Pollo–Equino",
    proteinas: ["pollo", "equino"],
    descripcion:
      "Nuestra receta de entrada: proteína magra de equino combinada con pollo. Digestión suave y excelente relación precio–calidad para empezar en BARF.",
    composicion: [
      "Carne de pollo y equino",
      "Hueso carnoso molido",
      "Vísceras (hígado y molleja)",
      "Vegetales de estación",
    ],
    beneficios: [
      "Ideal para iniciar la transición a BARF",
      "Proteína magra y digestible",
      "La opción más económica por kilo",
    ],
    rangos: [
      { desde: 1, hasta: 10, precioKg: 12 },
      { desde: 11, hasta: 20, precioKg: 11 },
      { desde: 21, hasta: null, precioKg: 10 },
    ],
    imagen: "/productos/barf.png",
    color: "coral",
  },
  {
    slug: "barf-res-pollo",
    nombre: "BARF Res–Pollo",
    proteinas: ["res", "pollo"],
    descripcion:
      "La mezcla más equilibrada del catálogo. Res para el aporte de hierro y pollo para la palatabilidad: funciona bien en perros adultos de cualquier tamaño.",
    composicion: [
      "Carne de res y pollo",
      "Hueso carnoso molido",
      "Vísceras (hígado, riñón)",
      "Vegetales de estación",
    ],
    beneficios: [
      "Alto aporte de hierro",
      "Muy palatable",
      "Receta más versátil para el día a día",
    ],
    rangos: [
      { desde: 1, hasta: 10, precioKg: 14 },
      { desde: 11, hasta: 20, precioKg: 13.5 },
      { desde: 21, hasta: null, precioKg: 13 },
    ],
    imagen: "/productos/barf.png",
    color: "petroleo",
  },
  {
    slug: "barf-pavo-cordero",
    nombre: "BARF Pavo–Cordero",
    proteinas: ["pavo", "cordero"],
    descripcion:
      "Receta premium con proteínas poco comunes, pensada para perros con sensibilidades alimentarias o que ya rotaron por las otras recetas.",
    composicion: [
      "Carne de pavo y cordero",
      "Hueso carnoso molido",
      "Vísceras seleccionadas",
      "Vegetales de estación",
    ],
    beneficios: [
      "Proteínas novedosas para perros sensibles",
      "Rica en omega 3",
      "Ideal para dietas de rotación",
    ],
    rangos: [
      { desde: 1, hasta: 6, precioKg: 17 },
      { desde: 7, hasta: 20, precioKg: 16.5 },
      { desde: 21, hasta: null, precioKg: 16 },
    ],
    imagen: "/productos/barf.png",
    color: "ambar",
  },
];

export function obtenerBarf(slug: string): ProductoBarf | undefined {
  return productosBarf.find((p) => p.slug === slug);
}

/** Precio por kilo vigente para una cantidad dada. */
export function precioKgPara(producto: ProductoBarf, kilos: number): number {
  const rango =
    producto.rangos.find(
      (r) => kilos >= r.desde && (r.hasta === null || kilos <= r.hasta),
    ) ?? producto.rangos[0];
  return rango.precioKg;
}

/** Ahorro respecto al precio del primer tramo. */
export function ahorroPorVolumen(producto: ProductoBarf, kilos: number): number {
  const base = producto.rangos[0].precioKg;
  return (base - precioKgPara(producto, kilos)) * kilos;
}

export const frecuenciasBarf = [
  { id: "unica", nombre: "Compra única", nota: "Sin compromiso" },
  { id: "semanal", nombre: "Semanal", nota: "Entrega cada 7 días" },
  { id: "quincenal", nombre: "Quincenal", nota: "Entrega cada 15 días" },
  { id: "mensual", nombre: "Mensual", nota: "Entrega cada 30 días" },
] as const;

/**
 * Calculador orientativo de ración diaria.
 *
 * Usa los porcentajes de peso vivo habituales en BARF. Es una guía de compra,
 * no una prescripción: la interfaz debe dejarlo claro siempre.
 */
export function racionDiaria(
  pesoKg: number,
  edadMeses: number,
  actividad: "baja" | "normal" | "alta",
): { porcentaje: number; gramosDia: number; kilosMes: number } {
  let porcentaje: number;
  if (edadMeses < 4) porcentaje = 8;
  else if (edadMeses < 7) porcentaje = 6;
  else if (edadMeses < 12) porcentaje = 4;
  else porcentaje = 2.5;

  if (actividad === "baja") porcentaje -= 0.3;
  if (actividad === "alta") porcentaje += 0.5;
  porcentaje = Math.max(1.5, porcentaje);

  const gramosDia = Math.round((pesoKg * 1000 * porcentaje) / 100);
  const kilosMes = Math.round(((gramosDia * 30) / 1000) * 10) / 10;
  return { porcentaje, gramosDia, kilosMes };
}
