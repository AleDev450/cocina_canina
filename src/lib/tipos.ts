/**
 * Tipos del dominio.
 *
 * Están escritos pensando en el esquema PostgreSQL que vive en
 * `supabase/schema.sql`: cada interfaz corresponde a una tabla, de modo que al
 * conectar Supabase solo haya que reemplazar los arreglos de `src/data` por
 * consultas, sin tocar los componentes.
 */

export type Dureza = "suave" | "media" | "larga-duracion";
export type TamanoPerro = "pequeno" | "mediano" | "grande";
export type EdadPerro = "cachorro" | "adulto" | "senior";
export type Proteina =
  | "res"
  | "cerdo"
  | "pollo"
  | "cordero"
  | "pescado"
  | "cabra"
  | "equino"
  | "pavo";

export type EtiquetaProducto =
  | "mas-vendido"
  | "nuevo"
  | "recomendado"
  | "stock-limitado";

export type TipoPresentacion = "gramos" | "unidades" | "kilogramos" | "talla";

export interface Presentacion {
  id: string;
  etiqueta: string;
  precio: number;
  tipo: TipoPresentacion;
  /** Stock disponible de esta presentación. 0 = agotado. */
  stock: number;
}

export interface Categoria {
  slug: string;
  nombre: string;
  descripcionCorta: string;
  descripcion: string;
  icono: "suave" | "media" | "larga" | "barf" | "mayor";
  imagen: string;
  acento: "petroleo" | "naranja" | "hoja" | "coral" | "ambar";
}

export interface Producto {
  slug: string;
  nombre: string;
  categoria: string;
  dureza: Dureza;
  proteinas: Proteina[];
  beneficioPrincipal: string;
  descripcion: string;
  beneficios: string[];
  ingredientes: string[];
  minerales: string;
  tamanos: TamanoPerro[];
  edades: EdadPerro[];
  presentaciones: Presentacion[];
  imagen: string;
  galeria: string[];
  etiquetas: EtiquetaProducto[];
  destacado: boolean;
  /** Solo para ordenar por "más vendidos" en el prototipo. */
  ventas: number;
  /** Timestamp relativo para ordenar por "nuevos". Mayor = más reciente. */
  orden: number;
  conservacion: string;
  advertencia: string;
  relacionados: string[];
  disponiblePorMayor: boolean;
}

/* --------------------------------- BARF --------------------------------- */

export interface RangoBarf {
  desde: number;
  hasta: number | null;
  precioKg: number;
}

export interface ProductoBarf {
  slug: string;
  nombre: string;
  proteinas: Proteina[];
  descripcion: string;
  composicion: string[];
  beneficios: string[];
  rangos: RangoBarf[];
  imagen: string;
  color: "coral" | "petroleo" | "ambar";
}

export type FrecuenciaBarf = "unica" | "semanal" | "quincenal" | "mensual";

/* ------------------------------- Por mayor ------------------------------- */

export interface PresentacionMayor {
  etiqueta: string;
  precio: number;
}

export interface LoteMayor {
  slug: string;
  nombre: string;
  productos: string[];
  unidad: string;
  minimo: string;
  imagen: string;
  presentaciones: PresentacionMayor[];
  nota?: string;
}

/* ------------------------------- Carrito -------------------------------- */

export interface ItemCarrito {
  /** `slug` del producto + `id` de presentación. */
  id: string;
  slug: string;
  nombre: string;
  presentacion: string;
  precio: number;
  cantidad: number;
  imagen: string;
  tipo: "snack" | "barf";
  /** Solo BARF: kilos seleccionados y frecuencia de reposición. */
  kilos?: number;
  frecuencia?: FrecuenciaBarf;
}

/* ----------------------------- Recompensas ------------------------------ */

export type EstadoPuntos =
  | "pendiente"
  | "disponible"
  | "canjeado"
  | "vencido"
  | "cancelado";

export interface MovimientoPuntos {
  id: string;
  fecha: string;
  concepto: string;
  puntos: number;
  estado: EstadoPuntos;
}

export type TipoRecompensa =
  | "descuento-fijo"
  | "descuento-porcentual"
  | "producto-gratis"
  | "envio-gratis"
  | "cupon"
  | "regalo";

export interface Recompensa {
  id: string;
  nombre: string;
  descripcion: string;
  puntos: number;
  tipo: TipoRecompensa;
  icono: "descuento" | "porcentaje" | "regalo" | "envio" | "cupon" | "sorpresa";
}

export interface ReglaPuntos {
  /** Soles que hay que gastar para ganar `puntosOtorgados`. */
  montoPorPunto: number;
  puntosOtorgados: number;
  vigenciaDesde: string;
  vigenciaHasta: string;
  compraMinima: number;
  multiplicador: number;
  campana: string | null;
}

/* -------------------------------- Cuenta -------------------------------- */

export interface Mascota {
  id: string;
  nombre: string;
  foto: string;
  especie: string;
  raza: string;
  nacimiento: string;
  pesoKg: number;
  alergias: string[];
  preferencias: string[];
  favoritos: string[];
}

export type EstadoPedido =
  | "pendiente"
  | "confirmado"
  | "preparando"
  | "listo"
  | "en-camino"
  | "entregado"
  | "cancelado";

export interface LineaPedido {
  nombre: string;
  presentacion: string;
  cantidad: number;
  precio: number;
}

export interface Pedido {
  numero: string;
  fecha: string;
  estado: EstadoPedido;
  total: number;
  puntos: number;
  entrega: "delivery" | "recojo";
  pago: string;
  lineas: LineaPedido[];
}

export interface Direccion {
  id: string;
  alias: string;
  linea: string;
  distrito: string;
  referencia: string;
  predeterminada: boolean;
}

export interface Cupon {
  codigo: string;
  descripcion: string;
  vence: string;
  tipo: TipoRecompensa;
  valor: number;
  usado: boolean;
}

/* ------------------------------ Contenido ------------------------------- */

export interface Testimonio {
  id: string;
  mascota: string;
  dueno: string;
  foto: string;
  producto: string;
  calificacion: number;
  comentario: string;
}

export interface PreguntaFrecuente {
  id: string;
  categoria: "productos" | "pedidos" | "puntos" | "mayor" | "barf";
  pregunta: string;
  respuesta: string;
}
