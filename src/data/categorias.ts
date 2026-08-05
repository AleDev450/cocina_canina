import type { Categoria } from "@/lib/tipos";

export const categorias: Categoria[] = [
  {
    slug: "dureza-suave",
    nombre: "Snacks de dureza suave",
    descripcionCorta: "Premios ligeros y fáciles de masticar.",
    descripcion:
      "Órganos y pescado deshidratados de textura aireada. Ideales como premio frecuente, para cachorros, perros pequeños o bocas sensibles.",
    icono: "suave",
    imagen: "/productos/bofe-de-res.png",
    acento: "hoja",
  },
  {
    slug: "dureza-media",
    nombre: "Snacks de dureza media",
    descripcionCorta: "Masticación con beneficio articular.",
    descripcion:
      "El corazón del catálogo: tráqueas, orejas, patitas y esófagos. Aportan colágeno, glucosamina y condroitina mientras entretienen.",
    icono: "media",
    imagen: "/productos/oreja-de-cerdo.png",
    acento: "ambar",
  },
  {
    slug: "larga-duracion",
    nombre: "Snacks de larga duración",
    descripcionCorta: "Para masticadores incansables.",
    descripcion:
      "Cuernos, pezuñas y vértebras. Duran horas, reducen el estrés y ayudan a controlar el sarro sin aportar calorías.",
    icono: "larga",
    imagen: "/productos/cuerno-de-res.png",
    acento: "coral",
  },
  {
    slug: "barf",
    nombre: "Alimentación BARF",
    descripcionCorta: "Dieta fresca, cruda y balanceada.",
    descripcion:
      "Mezclas congeladas de carne, hueso y vísceras en tres recetas. Precio por kilogramo con descuento por volumen.",
    icono: "barf",
    imagen: "/productos/barf.png",
    acento: "petroleo",
  },
  {
    slug: "por-mayor",
    nombre: "Productos por mayor",
    descripcionCorta: "Precios especiales para negocios.",
    descripcion:
      "Presentaciones por kilogramo, docena o ciento para tiendas, distribuidores y clientes frecuentes.",
    icono: "mayor",
    imagen: "/empaques/snacks-bolsa-res.png",
    acento: "naranja",
  },
];

export function obtenerCategoria(slug: string): Categoria | undefined {
  return categorias.find((c) => c.slug === slug);
}

export const nombreDureza: Record<string, string> = {
  suave: "Dureza suave",
  media: "Dureza media",
  "larga-duracion": "Larga duración",
};

export const nombreProteina: Record<string, string> = {
  res: "Res",
  cerdo: "Cerdo",
  pollo: "Pollo",
  cordero: "Cordero",
  pescado: "Pescado",
  cabra: "Cabra",
  equino: "Equino",
  pavo: "Pavo",
};

export const nombreTamano: Record<string, string> = {
  pequeno: "Perro pequeño",
  mediano: "Perro mediano",
  grande: "Perro grande",
};

export const nombreEdad: Record<string, string> = {
  cachorro: "Cachorro",
  adulto: "Adulto",
  senior: "Adulto mayor",
};

export const nombreEtiqueta: Record<string, string> = {
  "mas-vendido": "Más vendido",
  nuevo: "Nuevo",
  recomendado: "Recomendado",
  "stock-limitado": "Stock limitado",
};
