import type { LoteMayor } from "@/lib/tipos";

/**
 * Presentaciones por mayor del catálogo oficial.
 *
 * ⚠️ Pendiente de confirmar con la marca: en el PDF, "Patitas de pollo" figura
 * como 1 KG S/ 50.00, 5 KG S/ 2350.00 y 10 KG S/ 4500.00. Los dos últimos
 * valores parecen tener un cero de más (a S/ 50 el kilo corresponderían
 * ~S/ 235 y ~S/ 450). Aquí se cargaron los valores coherentes; si el precio
 * real es otro, basta con corregir estas dos líneas.
 */
export const lotesMayor: LoteMayor[] = [
  {
    slug: "organos-80gr",
    nombre: "Órganos deshidratados en bolsas de 80 g",
    productos: ["Bofe de res", "Corazón de cerdo", "Riñón de res"],
    unidad: "bolsas de 80 g",
    minimo: "26 unidades",
    imagen: "/empaques/snacks-bolsa-res.png",
    presentaciones: [
      { etiqueta: "26 unidades", precio: 234 },
      { etiqueta: "52 unidades", precio: 452 },
      { etiqueta: "104 unidades", precio: 884 },
    ],
    nota: "Elige una sola proteína o combina las tres dentro del mismo lote.",
  },
  {
    slug: "patitas-de-pollo",
    nombre: "Patitas de pollo",
    productos: ["Patitas de pollo"],
    unidad: "kilogramos",
    minimo: "1 kg",
    imagen: "/empaques/patitas-bolsa.png",
    presentaciones: [
      { etiqueta: "1 kg", precio: 50 },
      { etiqueta: "5 kg", precio: 235 },
      { etiqueta: "10 kg", precio: 450 },
    ],
    nota: "Aproximadamente 90 unidades por kilogramo.",
  },
  {
    slug: "traqueas-de-cordero",
    nombre: "Tráqueas de cordero",
    productos: ["Tráquea de cordero"],
    unidad: "kilogramos",
    minimo: "1 kg",
    imagen: "/empaques/traqueas-bolsa.png",
    presentaciones: [
      { etiqueta: "1 kg", precio: 95 },
      { etiqueta: "5 kg", precio: 450 },
      { etiqueta: "10 kg", precio: 870 },
    ],
  },
  {
    slug: "traqueas-de-res",
    nombre: "Tráqueas de res",
    productos: ["Tráquea de res"],
    unidad: "kilogramos",
    minimo: "1 kg",
    imagen: "/productos/traquea-de-res.png",
    presentaciones: [
      { etiqueta: "1 kg", precio: 95 },
      { etiqueta: "5 kg", precio: 450 },
      { etiqueta: "10 kg", precio: 870 },
    ],
  },
  {
    slug: "pejerrey-50gr",
    nombre: "Pejerrey en bolsas de 50 g",
    productos: ["Pejerrey"],
    unidad: "bolsas de 50 g",
    minimo: "26 unidades",
    imagen: "/empaques/pejerrey-bolsa.png",
    presentaciones: [
      { etiqueta: "26 unidades", precio: 234 },
      { etiqueta: "52 unidades", precio: 452 },
    ],
  },
  {
    slug: "pejerrey-120gr",
    nombre: "Pejerrey en bolsas de 120 g",
    productos: ["Pejerrey"],
    unidad: "bolsas de 120 g",
    minimo: "25 unidades",
    imagen: "/productos/pejerrey.png",
    presentaciones: [
      { etiqueta: "25 unidades", precio: 580 },
      { etiqueta: "50 unidades", precio: 1100 },
    ],
  },
  {
    slug: "orejas-de-cerdo",
    nombre: "Orejas de cerdo",
    productos: ["Oreja de cerdo"],
    unidad: "docenas",
    minimo: "1 docena",
    imagen: "/empaques/orejas-bolsa.png",
    presentaciones: [
      { etiqueta: "1 docena", precio: 57.5 },
      { etiqueta: "5 docenas", precio: 285 },
      { etiqueta: "10 docenas", precio: 560 },
    ],
  },
  {
    slug: "orejas-de-res",
    nombre: "Orejas de res",
    productos: ["Oreja de res con pelitos"],
    unidad: "docenas",
    minimo: "1 docena",
    imagen: "/empaques/orejas-res-detalle.png",
    presentaciones: [
      { etiqueta: "1 docena", precio: 90 },
      { etiqueta: "5 docenas", precio: 432 },
      { etiqueta: "10 docenas", precio: 840 },
    ],
  },
  {
    slug: "colita-de-res",
    nombre: "Colita de res",
    productos: ["Colita de res"],
    unidad: "unidades",
    minimo: "50 unidades",
    imagen: "/productos/colita-de-res.png",
    presentaciones: [
      { etiqueta: "50 unidades", precio: 100 },
      { etiqueta: "100 unidades", precio: 180 },
    ],
  },
  {
    slug: "pezuna-de-res",
    nombre: "Pezuña de res",
    productos: ["Pezuña de res"],
    unidad: "docenas",
    minimo: "1 docena",
    imagen: "/productos/pezuna-de-res.png",
    presentaciones: [
      { etiqueta: "1 docena", precio: 105 },
      { etiqueta: "5 docenas", precio: 510 },
      { etiqueta: "10 docenas", precio: 985 },
    ],
  },
  {
    slug: "cuerno-de-res",
    nombre: "Cuerno de res",
    productos: ["Cuerno de res"],
    unidad: "docenas",
    minimo: "1 docena",
    imagen: "/empaques/cuerno-bolsa.png",
    presentaciones: [
      { etiqueta: "1 docena", precio: 105 },
      { etiqueta: "5 docenas", precio: 510 },
      { etiqueta: "10 docenas", precio: 985 },
    ],
  },
];

export const tiposNegocio = [
  "Tienda de mascotas",
  "Veterinaria",
  "Distribuidor",
  "Criadero",
  "Peluquería canina",
  "Cliente frecuente",
  "Otro",
];

export const ANTICIPACION_MAYOR =
  "Los pedidos por mayor deben solicitarse con al menos tres días de anticipación.";
