import type { PreguntaFrecuente, Testimonio } from "@/lib/tipos";

/**
 * Testimonios. Las fotos reales de cada mascota se cargan desde el CMS; en el
 * prototipo `foto` va vacío y el componente dibuja una inicial sobre color de
 * marca.
 */
export const testimonios: Testimonio[] = [
  {
    id: "t1",
    mascota: "Rocco",
    dueno: "Andrea Salazar",
    foto: "",
    producto: "Tráquea de res",
    calificacion: 5,
    comentario:
      "Rocco tenía problemas de cadera y el veterinario nos recomendó colágeno. Las tráqueas se volvieron su premio de cada noche y ya no le tengo que esconder nada raro en la comida.",
  },
  {
    id: "t2",
    mascota: "Luna",
    dueno: "Diego Paredes",
    foto: "",
    producto: "Patitas de pollo",
    calificacion: 5,
    comentario:
      "Compro el kilo cada mes. Luna es ansiosa y masticar la calma muchísimo; además el pelaje le quedó brilloso. El empaque llega siempre bien sellado.",
  },
  {
    id: "t3",
    mascota: "Simón",
    dueno: "Claudia Rivas",
    foto: "",
    producto: "BARF Res–Pollo",
    calificacion: 5,
    comentario:
      "Pasamos a BARF hace cuatro meses. Me ayudaron con las porciones según su peso y la entrega es puntual. Simón bajó los dos kilos que le sobraban.",
  },
  {
    id: "t4",
    mascota: "Kira",
    dueno: "Renzo Camacho",
    foto: "",
    producto: "Oreja de cerdo",
    calificacion: 4,
    comentario:
      "Kira es una labradora que destruye todo. La oreja de cerdo le dura poco pero le encanta; ahora estoy probando el cuerno de res para que dure más.",
  },
  {
    id: "t5",
    mascota: "Nube",
    dueno: "Valeria Ochoa",
    foto: "",
    producto: "Pejerrey",
    calificacion: 5,
    comentario:
      "Mi perrita es alérgica al pollo y encontrar snacks es un dolor de cabeza. El pejerrey es de un solo ingrediente y no le cayó mal nada. Enorme alivio.",
  },
  {
    id: "t6",
    mascota: "Tomás",
    dueno: "Gonzalo Prieto",
    foto: "",
    producto: "Trío Pork Chew",
    calificacion: 5,
    comentario:
      "Pedí por WhatsApp un viernes y me llegó el sábado temprano. Buen precio y responden rapidísimo cuando uno pregunta qué snack le conviene a cada perro.",
  },
];

export const preguntas: PreguntaFrecuente[] = [
  {
    id: "f1",
    categoria: "productos",
    pregunta: "¿Los snacks tienen conservantes?",
    respuesta:
      "No. Todos nuestros snacks son de ingrediente único y se elaboran solo por deshidratado: no llevan conservantes, colorantes ni saborizantes artificiales. La baja humedad es lo que permite que se conserven por más tiempo.",
  },
  {
    id: "f2",
    categoria: "productos",
    pregunta: "¿Cómo debo conservar los productos?",
    respuesta:
      "Guárdalos en un lugar fresco y seco, dentro de su empaque bien cerrado y lejos de la luz directa del sol. No necesitan refrigeración. Si vives en una zona muy húmeda, puedes guardarlos en un recipiente hermético.",
  },
  {
    id: "f3",
    categoria: "productos",
    pregunta: "¿Qué snack es mejor para mi perro?",
    respuesta:
      "Depende del tamaño, la edad y la fuerza de mordida. Para cachorros y perros pequeños recomendamos dureza suave (bofe, pejerrey) o tráquea de cordero. Para adultos, la dureza media cubre casi todo. Para masticadores fuertes, larga duración. Puedes filtrar el catálogo por tamaño y edad, o escribirnos por WhatsApp y te ayudamos a elegir.",
  },
  {
    id: "f4",
    categoria: "productos",
    pregunta: "¿Cómo elijo el nivel de dureza?",
    respuesta:
      "Dureza suave: se deshace con facilidad, ideal como premio frecuente y para bocas sensibles. Dureza media: requiere masticación real, aporta colágeno y ayuda a la limpieza dental. Larga duración: cuernos y pezuñas, muy resistentes, pensados para perros que destruyen todo. Estos últimos no son recomendables para cachorros ni para perros con problemas dentales.",
  },
  {
    id: "f5",
    categoria: "productos",
    pregunta: "¿Debo supervisar a mi perro mientras come el snack?",
    respuesta:
      "Sí, siempre. Supervisa a tu mascota durante el consumo del producto para evitar atoramientos o posibles reacciones alérgicas, y retira las piezas cuando queden en trozos lo bastante pequeños como para tragarse enteros.",
  },
  {
    id: "f6",
    categoria: "pedidos",
    pregunta: "¿Realizan delivery?",
    respuesta:
      "Sí, hacemos delivery en Lima Metropolitana. El costo depende del distrito y se confirma al momento de coordinar el pedido. También puedes elegir recojo en tienda sin costo adicional.",
  },
  {
    id: "f7",
    categoria: "pedidos",
    pregunta: "¿Qué métodos de pago aceptan?",
    respuesta:
      "Yape, Plin, transferencia bancaria y pago contra entrega. Estamos trabajando en habilitar el pago con tarjeta directamente desde la web.",
  },
  {
    id: "f8",
    categoria: "puntos",
    pregunta: "¿Cómo funciona el programa de puntos?",
    respuesta:
      "Al registrarte entras automáticamente al Club Cocina Canina. Por cada S/ 10.00 de compra acumulas 1 punto, y esos puntos se canjean por descuentos, envíos gratis o productos. La equivalencia puede variar durante campañas de puntos dobles o triples.",
  },
  {
    id: "f9",
    categoria: "puntos",
    pregunta: "¿Cuándo se acreditan mis puntos?",
    respuesta:
      "Los puntos aparecen como “pendientes” apenas confirmas el pedido y pasan a “disponibles” 48 horas después de que el pedido figura como entregado. Ese margen existe para cubrir cambios o anulaciones.",
  },
  {
    id: "f10",
    categoria: "puntos",
    pregunta: "¿Los puntos vencen?",
    respuesta:
      "Sí. Los puntos tienen una vigencia de 12 meses desde la fecha en que se acreditan. En tu panel puedes ver la fecha exacta de vencimiento de cada bloque de puntos.",
  },
  {
    id: "f11",
    categoria: "mayor",
    pregunta: "¿Cómo hago un pedido por mayor?",
    respuesta:
      "Completa el formulario de cotización en la sección “Compra por mayor” indicando los productos y cantidades que necesitas. Te respondemos con una cotización formal, disponibilidad y fecha de entrega.",
  },
  {
    id: "f12",
    categoria: "mayor",
    pregunta: "¿Con cuánto tiempo debo solicitar un pedido grande?",
    respuesta:
      "Los pedidos por mayor deben solicitarse con al menos tres días de anticipación, porque se producen por lote. En campañas o fechas altas conviene avisar con una semana.",
  },
  {
    id: "f13",
    categoria: "barf",
    pregunta: "¿La alimentación BARF requiere refrigeración?",
    respuesta:
      "Sí. El BARF se entrega congelado y debe mantenerse así hasta el día antes de servirlo. Para descongelar, pasa la porción del congelador a la refrigeradora la noche anterior; nunca a temperatura ambiente ni en microondas. Una vez descongelada, la ración dura hasta 48 horas en refrigeración.",
  },
  {
    id: "f14",
    categoria: "barf",
    pregunta: "¿Cuánto BARF necesita mi perro al día?",
    respuesta:
      "Como referencia, un perro adulto consume entre 2% y 3% de su peso corporal al día, y un cachorro entre 4% y 8% según su edad. En la página de BARF tenemos un calculador orientativo. Es una guía de compra y no reemplaza la asesoría de tu veterinario.",
  },
];

export const categoriasFaq = [
  { id: "todas", nombre: "Todas" },
  { id: "productos", nombre: "Productos" },
  { id: "pedidos", nombre: "Pedidos y entregas" },
  { id: "puntos", nombre: "Programa de puntos" },
  { id: "mayor", nombre: "Compra por mayor" },
  { id: "barf", nombre: "Alimentación BARF" },
];
