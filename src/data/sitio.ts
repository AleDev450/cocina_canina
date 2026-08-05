/**
 * Contenido editable del sitio.
 *
 * Todo lo que vive en este archivo es exactamente lo que el módulo
 * "Contenido de la web" del CMS debe poder editar sin tocar código.
 */

export const sitio = {
  nombre: "La Cocina Canina",
  descripcion:
    "Snacks deshidratados y alimentación BARF elaborados con ingredientes naturales en Perú.",
  telefono: "922 035 995",
  whatsapp: "51922035995",
  instagram: "lacocinacanina",
  tiktok: "lacocinacanina",
  correo: "hola@lacocinacanina.pe",
  ciudad: "Lima, Perú",
  horario: "Lunes a sábado, 9:00 a 19:00",
};

export const navegacion = [
  { nombre: "Inicio", href: "/" },
  { nombre: "Quiénes somos", href: "/nosotros" },
  { nombre: "Productos", href: "/productos" },
  { nombre: "Alimentación BARF", href: "/barf" },
  { nombre: "Por mayor", href: "/por-mayor" },
  { nombre: "Recompensas", href: "/recompensas" },
  { nombre: "Preguntas frecuentes", href: "/preguntas-frecuentes" },
];

export const hero = {
  titulo: "Lo mejor para tu mejor",
  tituloResaltado: "amigo",
  subtitulo:
    "Snacks deshidratados y alimentación BARF elaborados con ingredientes naturales para cuidar la salud, felicidad y bienestar de tu mascota.",
  sello: "Perfecto para perros de todas las edades",
  beneficios: [
    {
      titulo: "100% naturales",
      detalle: "Ingrediente único, sin aditivos",
      icono: "hoja",
    },
    {
      titulo: "Sin conservantes ni colorantes",
      detalle: "Nada artificial en el proceso",
      icono: "escudo",
    },
    {
      titulo: "Textura y dureza seleccionada",
      detalle: "Suave, media o larga duración",
      icono: "hueso",
    },
    {
      titulo: "Ingredientes de calidad",
      detalle: "Proteína fresca y trazable",
      icono: "chef",
    },
  ],
};

export const quienesSomos = {
  antetitulo: "Quiénes somos",
  titulo: "Alimentamos su felicidad",
  texto:
    "En La Cocina Canina elaboramos snacks deshidratados y alimentación BARF con ingredientes seleccionados. Nuestro objetivo es ofrecer productos naturales, nutritivos y seguros que contribuyan al bienestar y calidad de vida de cada mascota.",
  valores: [
    {
      titulo: "Ingredientes seleccionados",
      texto:
        "Trabajamos con proteína fresca de proveedores conocidos y un solo ingrediente por snack. Sin harinas, sin rellenos, sin sorpresas en la etiqueta.",
      icono: "hoja",
    },
    {
      titulo: "Procesos naturales y seguros",
      texto:
        "Deshidratado lento a baja temperatura, que conserva los nutrientes y reduce la humedad para que el producto dure sin conservantes.",
      icono: "termometro",
    },
    {
      titulo: "Amor y cuidado en cada preparación",
      texto:
        "Producción artesanal, en lotes pequeños y revisados pieza por pieza antes de empacar. Cocinamos como si fuera para nuestros propios perros.",
      icono: "corazon",
    },
  ],
};

export const pedidoWhatsapp = {
  titulo: "Haz tu pedido fácil y rápido",
  texto:
    "Selecciona tus productos y envía tu pedido por WhatsApp. Nosotros confirmaremos disponibilidad, costo de envío y horario de entrega.",
  boton: "Hacer pedido por WhatsApp",
};

export const politicas = [
  { nombre: "Términos y condiciones", href: "/legal/terminos" },
  { nombre: "Política de privacidad", href: "/legal/privacidad" },
  { nombre: "Política de delivery", href: "/legal/delivery" },
  { nombre: "Libro de reclamaciones", href: "/legal/reclamaciones" },
];

export const metodosEntrega = [
  {
    id: "delivery",
    nombre: "Delivery",
    detalle: "Lima Metropolitana. Costo según distrito, se confirma por WhatsApp.",
    costo: 12,
  },
  {
    id: "recojo",
    nombre: "Recojo en tienda",
    detalle: "Coordina el horario y recoge tu pedido sin costo adicional.",
    costo: 0,
  },
];

export const metodosPago = [
  { id: "yape", nombre: "Yape", detalle: "Al 922 035 995", activo: true },
  { id: "plin", nombre: "Plin", detalle: "Al 922 035 995", activo: true },
  {
    id: "transferencia",
    nombre: "Transferencia bancaria",
    detalle: "BCP / Interbank",
    activo: true,
  },
  {
    id: "contra-entrega",
    nombre: "Pago contra entrega",
    detalle: "Efectivo al recibir el pedido",
    activo: true,
  },
  {
    id: "pasarela",
    nombre: "Tarjeta de crédito o débito",
    detalle: "Próximamente",
    activo: false,
  },
];
