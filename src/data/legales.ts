import { sitio } from "@/data/sitio";

export interface Legal {
  slug: string;
  titulo: string;
  resumen: string;
  actualizado: string;
  secciones: Array<{ titulo: string; parrafos: string[] }>;
}

/**
 * Textos legales base. El módulo "Contenido de la web" del CMS los edita
 * como texto enriquecido; aquí quedan redactados para revisión de la marca.
 */
export const legales: Legal[] = [
  {
    slug: "terminos",
    titulo: "Términos y condiciones",
    resumen:
      "Condiciones de uso de la web y de compra de productos de La Cocina Canina.",
    actualizado: "2026-08-01",
    secciones: [
      {
        titulo: "1. Sobre estos términos",
        parrafos: [
          `Estos términos regulan el uso del sitio web de ${sitio.nombre} y la compra de nuestros productos. Al realizar un pedido, aceptas las condiciones descritas aquí.`,
          "Podemos actualizar estos términos en cualquier momento. La versión vigente es siempre la publicada en esta página, con su fecha de última actualización.",
        ],
      },
      {
        titulo: "2. Productos y disponibilidad",
        parrafos: [
          "Nuestros snacks son productos naturales deshidratados. Por su origen, el tamaño, el color y el peso exacto de cada pieza pueden variar ligeramente respecto a las fotografías.",
          "Todos los precios están expresados en soles peruanos e incluyen los impuestos aplicables. La disponibilidad está sujeta a stock y se confirma al momento de procesar el pedido.",
        ],
      },
      {
        titulo: "3. Pedidos y confirmación",
        parrafos: [
          "Un pedido se considera confirmado cuando verificamos el pago y te lo comunicamos por WhatsApp o correo. Antes de eso, el pedido figura como pendiente.",
          "Los pedidos por mayor deben solicitarse con al menos tres días de anticipación, ya que se producen por lote.",
        ],
      },
      {
        titulo: "4. Precios y pagos",
        parrafos: [
          "Aceptamos Yape, Plin, transferencia bancaria y pago contra entrega. Nos reservamos el derecho de modificar los precios sin previo aviso; el precio válido es el vigente al momento de confirmar el pedido.",
          "El costo de envío se calcula según el distrito y se informa antes de cerrar la compra.",
        ],
      },
      {
        titulo: "5. Uso responsable de los productos",
        parrafos: [
          "Nuestros snacks son un complemento, no un sustituto de la alimentación principal de tu mascota, salvo en el caso de las raciones BARF formuladas para ese fin.",
          "Supervisa siempre a tu mascota durante el consumo del producto para evitar atoramientos o posibles reacciones alérgicas. Ante cualquier duda sobre la dieta de tu mascota, consulta a tu médico veterinario.",
        ],
      },
      {
        titulo: "6. Programa de recompensas",
        parrafos: [
          "La participación en el Club Cocina Canina es gratuita para clientes registrados. Los puntos no son transferibles ni canjeables por dinero.",
          "Las equivalencias, campañas y vigencias pueden modificarse; los cambios se publican en la página del programa y no afectan a los puntos ya acreditados.",
        ],
      },
      {
        titulo: "7. Contacto",
        parrafos: [
          `Para cualquier consulta sobre estos términos, escríbenos al ${sitio.telefono} o a ${sitio.correo}.`,
        ],
      },
    ],
  },
  {
    slug: "privacidad",
    titulo: "Política de privacidad",
    resumen: "Cómo tratamos tus datos personales y los de tus mascotas.",
    actualizado: "2026-08-01",
    secciones: [
      {
        titulo: "1. Datos que recopilamos",
        parrafos: [
          "Recopilamos los datos que nos entregas al registrarte o al hacer un pedido: nombres, apellidos, correo electrónico, celular, dirección de entrega y, opcionalmente, tu fecha de nacimiento.",
          "También guardamos el perfil de tus mascotas (nombre, especie, raza, peso, edad, alergias y preferencias) con el único fin de recomendarte productos adecuados.",
        ],
      },
      {
        titulo: "2. Para qué los usamos",
        parrafos: [
          "Para procesar y entregar tus pedidos, gestionar tus puntos del Club Cocina Canina, responder tus consultas y, si lo autorizas, enviarte novedades y promociones.",
          "No vendemos ni cedemos tus datos a terceros con fines comerciales.",
        ],
      },
      {
        titulo: "3. Conservación y seguridad",
        parrafos: [
          "Conservamos tus datos mientras mantengas una cuenta activa o mientras sean necesarios para cumplir obligaciones legales.",
          "Aplicamos medidas técnicas y organizativas razonables para proteger la información, incluyendo control de accesos por rol y cifrado en tránsito.",
        ],
      },
      {
        titulo: "4. Tus derechos",
        parrafos: [
          "Puedes acceder, rectificar, actualizar o solicitar la eliminación de tus datos personales en cualquier momento desde tu panel de cuenta o escribiéndonos.",
          `Para ejercer estos derechos, contáctanos al ${sitio.correo}.`,
        ],
      },
      {
        titulo: "5. Cookies",
        parrafos: [
          "Usamos cookies y almacenamiento local del navegador para recordar tu carrito, tus favoritos y tu sesión. Puedes borrarlos desde la configuración de tu navegador.",
        ],
      },
    ],
  },
  {
    slug: "delivery",
    titulo: "Política de delivery",
    resumen: "Zonas de cobertura, tiempos, costos y condiciones de entrega.",
    actualizado: "2026-08-01",
    secciones: [
      {
        titulo: "1. Zonas de cobertura",
        parrafos: [
          "Realizamos delivery en Lima Metropolitana. Para distritos fuera de nuestra zona habitual, coordinamos el envío por agencia con costo a cargo del cliente.",
          "También puedes elegir recojo en tienda sin costo adicional, coordinando previamente el horario.",
        ],
      },
      {
        titulo: "2. Tiempos de entrega",
        parrafos: [
          "Los pedidos de snacks confirmados antes de las 12:00 se despachan generalmente el mismo día o el día hábil siguiente.",
          "Los pedidos de alimentación BARF se coordinan según la ruta de reparto congelado. Los pedidos por mayor requieren al menos tres días de anticipación.",
        ],
      },
      {
        titulo: "3. Costos",
        parrafos: [
          "El costo de envío depende del distrito y se informa antes de cerrar la compra. Ofrecemos envío gratis en pedidos que superen el monto vigente indicado en la web.",
        ],
      },
      {
        titulo: "4. Recepción del pedido",
        parrafos: [
          "Es importante que haya alguien para recibir el pedido en el horario acordado, especialmente en el caso del BARF, que se entrega congelado y debe pasar de inmediato al congelador.",
          "Si no encontramos a nadie en la dirección indicada, coordinaremos una segunda visita, que puede tener un costo adicional.",
        ],
      },
      {
        titulo: "5. Cambios y devoluciones",
        parrafos: [
          "Revisa tu pedido al recibirlo. Si algún producto llega en mal estado o no corresponde a lo solicitado, escríbenos dentro de las 24 horas siguientes y lo reponemos sin costo.",
          "Por tratarse de productos alimenticios, no aceptamos devoluciones de empaques abiertos salvo por defecto del producto.",
        ],
      },
    ],
  },
  {
    slug: "reclamaciones",
    titulo: "Libro de reclamaciones",
    resumen:
      "Conforme al Código de Protección y Defensa del Consumidor del Perú.",
    actualizado: "2026-08-01",
    secciones: [
      {
        titulo: "Registra tu queja o reclamo",
        parrafos: [
          "Conforme a lo establecido en el Código de Protección y Defensa del Consumidor, contamos con un Libro de Reclamaciones a tu disposición.",
          `Puedes registrar tu reclamo escribiéndonos a ${sitio.correo} o al ${sitio.telefono}, indicando tus datos de contacto, el detalle del pedido y el motivo de tu reclamo.`,
          "Responderemos en un plazo máximo de treinta (30) días calendario desde la recepción de tu solicitud.",
        ],
      },
      {
        titulo: "Diferencia entre queja y reclamo",
        parrafos: [
          "Reclamo: disconformidad relacionada con los productos o servicios contratados.",
          "Queja: malestar respecto a la atención recibida, no vinculado directamente al producto.",
        ],
      },
    ],
  },
];

export function obtenerLegal(slug: string): Legal | undefined {
  return legales.find((l) => l.slug === slug);
}
