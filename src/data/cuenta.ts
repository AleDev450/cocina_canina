import type { Cupon, Direccion, Mascota, Pedido } from "@/lib/tipos";

/**
 * Cuenta de demostración.
 *
 * Al conectar Supabase Auth esto se reemplaza por el perfil del usuario en
 * sesión; la forma de los objetos ya coincide con las tablas `perfiles`,
 * `mascotas`, `pedidos`, `direcciones` y `cupones`.
 */
export const clienteDemo = {
  id: "demo-andrea",
  nombres: "Andrea",
  apellidos: "Salazar Vega",
  correo: "andrea@ejemplo.pe",
  celular: "987 654 321",
  nacimiento: "1994-03-18",
  puntos: 120,
  desde: "2026-05-03",
};

export const mascotasDemo: Mascota[] = [
  {
    id: "p1",
    nombre: "Rocco",
    foto: "/mascota/sentado.png",
    especie: "Perro",
    raza: "Bull terrier mestizo",
    nacimiento: "2021-09-12",
    pesoKg: 18,
    alergias: ["Pollo"],
    preferencias: ["Snacks de masticación larga", "Texturas firmes"],
    favoritos: ["traquea-de-res", "power-stick-bovino"],
  },
  {
    id: "p2",
    nombre: "Chispa",
    foto: "/mascota/mirada.png",
    especie: "Perro",
    raza: "Mestiza",
    nacimiento: "2025-01-30",
    pesoKg: 6,
    alergias: [],
    preferencias: ["Premios pequeños para entrenamiento"],
    favoritos: ["pejerrey", "traquea-de-cordero"],
  },
];

export const pedidosDemo: Pedido[] = [
  {
    numero: "LCC-1042",
    fecha: "2026-07-28",
    estado: "en-camino",
    total: 186,
    puntos: 18,
    entrega: "delivery",
    pago: "Yape",
    lineas: [
      { nombre: "Patitas de pollo", presentacion: "1 kg (90 unidades aprox.)", cantidad: 1, precio: 50 },
      { nombre: "Tráquea de res", presentacion: "150 gramos", cantidad: 2, precio: 24 },
      { nombre: "Oreja de cerdo", presentacion: "4 unidades", cantidad: 1, precio: 18.5 },
      { nombre: "BARF Res–Pollo", presentacion: "5 kg", cantidad: 1, precio: 70 },
    ],
  },
  {
    numero: "LCC-1027",
    fecha: "2026-07-11",
    estado: "entregado",
    total: 248,
    puntos: 24,
    entrega: "delivery",
    pago: "Transferencia",
    lineas: [
      { nombre: "BARF Pollo–Equino", presentacion: "12 kg", cantidad: 1, precio: 132 },
      { nombre: "Bofe de res", presentacion: "150 gramos", cantidad: 2, precio: 24 },
      { nombre: "Colita de res", presentacion: "1 unidad", cantidad: 6, precio: 3 },
      { nombre: "Cuerno de res", presentacion: "1 unidad", cantidad: 3, precio: 15 },
    ],
  },
  {
    numero: "LCC-0998",
    fecha: "2026-06-14",
    estado: "entregado",
    total: 312,
    puntos: 62,
    entrega: "recojo",
    pago: "Plin",
    lineas: [
      { nombre: "Pejerrey", presentacion: "110 gramos", cantidad: 4, precio: 24 },
      { nombre: "Power Stick Bovino", presentacion: "2 unidades", cantidad: 3, precio: 15 },
      { nombre: "Oreja de res con pelitos", presentacion: "1 unidad talla L", cantidad: 5, precio: 15 },
      { nombre: "Trío Pork Chew", presentacion: "3 unidades", cantidad: 4, precio: 25 },
    ],
  },
  {
    numero: "LCC-0961",
    fecha: "2026-05-22",
    estado: "entregado",
    total: 154,
    puntos: 31,
    entrega: "delivery",
    pago: "Yape",
    lineas: [
      { nombre: "Tráquea de cordero", presentacion: "5 unidades", cantidad: 3, precio: 15 },
      { nombre: "Esófago de cordero", presentacion: "2 unidades", cantidad: 4, precio: 15 },
      { nombre: "Oreja de cabra", presentacion: "1 unidad talla M", cantidad: 8, precio: 4 },
    ],
  },
];

export const direccionesDemo: Direccion[] = [
  {
    id: "d1",
    alias: "Casa",
    linea: "Av. Arequipa 2450, dpto. 502",
    distrito: "Lince",
    referencia: "Edificio de fachada blanca, frente al parque",
    predeterminada: true,
  },
  {
    id: "d2",
    alias: "Oficina",
    linea: "Calle Las Begonias 415, piso 9",
    distrito: "San Isidro",
    referencia: "Recepción recibe hasta las 6 p. m.",
    predeterminada: false,
  },
];

export const cuponesDemo: Cupon[] = [
  {
    codigo: "CLUB10",
    descripcion: "S/ 10 de descuento en tu próxima compra",
    vence: "2026-09-30",
    tipo: "descuento-fijo",
    valor: 10,
    usado: false,
  },
  {
    codigo: "ENVIOGRATIS",
    descripcion: "Delivery sin costo en Lima Metropolitana",
    vence: "2026-08-31",
    tipo: "envio-gratis",
    valor: 12,
    usado: false,
  },
  {
    codigo: "BIENVENIDA",
    descripcion: "15% en tu primera compra",
    vence: "2026-06-03",
    tipo: "descuento-porcentual",
    valor: 15,
    usado: true,
  },
];

export const nombreEstadoPedido: Record<string, string> = {
  pendiente: "Pendiente",
  confirmado: "Confirmado",
  preparando: "Preparando",
  listo: "Listo para envío",
  "en-camino": "En camino",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export const flujoEstados = [
  "pendiente",
  "confirmado",
  "preparando",
  "listo",
  "en-camino",
  "entregado",
] as const;
