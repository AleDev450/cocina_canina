"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { clienteServidor } from "@/lib/supabase/servidor";
import { exigirGrupo } from "@/server/sesion";
import {
  casilla,
  exito,
  fallo,
  mensajeDeError,
  textoObligatorio,
  validar,
  type Resultado,
} from "@/server/acciones/comunes";


function refrescarSitio() {
  revalidatePath("/", "layout");
  revalidatePath("/preguntas-frecuentes");
  revalidatePath("/nosotros");
}

/* ------------------------------ Bloques de texto -------------------------- */

const esquemaHero = z.object({
  titulo: textoObligatorio("El título", 3),
  tituloResaltado: textoObligatorio("La palabra resaltada"),
  subtitulo: textoObligatorio("El subtítulo", 10),
  sello: textoObligatorio("El texto del sello"),
  beneficio0: z.string().trim().optional(),
  detalle0: z.string().trim().optional(),
  beneficio1: z.string().trim().optional(),
  detalle1: z.string().trim().optional(),
  beneficio2: z.string().trim().optional(),
  detalle2: z.string().trim().optional(),
  beneficio3: z.string().trim().optional(),
  detalle3: z.string().trim().optional(),
});

const ICONOS_HERO = ["hoja", "escudo", "hueso", "chef"];

export async function guardarHero(
  _estado: Resultado,
  datos: FormData,
): Promise<Resultado> {
  await exigirGrupo("Contenido");

  const analisis = validar(esquemaHero, datos);
  if (!analisis.ok) return analisis.resultado;
  const v = analisis.valor;

  const beneficios = [0, 1, 2, 3]
    .map((i) => ({
      titulo: (v[`beneficio${i}` as keyof typeof v] as string) ?? "",
      detalle: (v[`detalle${i}` as keyof typeof v] as string) ?? "",
      icono: ICONOS_HERO[i],
    }))
    .filter((b) => b.titulo);

  const supabase = await clienteServidor();
  const { error } = await supabase.from("contenido_web").upsert({
    clave: "hero",
    valor: {
      titulo: v.titulo,
      tituloResaltado: v.tituloResaltado,
      subtitulo: v.subtitulo,
      sello: v.sello,
      beneficios,
    },
    actualizado: new Date().toISOString(),
  });

  if (error) return fallo(mensajeDeError(error));
  refrescarSitio();
  return exito("Portada actualizada.");
}

const esquemaNosotros = z.object({
  titulo: textoObligatorio("El título", 3),
  texto: textoObligatorio("El texto", 20),
  valor0: z.string().trim().optional(),
  texto0: z.string().trim().optional(),
  valor1: z.string().trim().optional(),
  texto1: z.string().trim().optional(),
  valor2: z.string().trim().optional(),
  texto2: z.string().trim().optional(),
});

const ICONOS_VALORES = ["hoja", "termometro", "corazon"];

export async function guardarNosotros(
  _estado: Resultado,
  datos: FormData,
): Promise<Resultado> {
  await exigirGrupo("Contenido");

  const analisis = validar(esquemaNosotros, datos);
  if (!analisis.ok) return analisis.resultado;
  const v = analisis.valor;

  const valores = [0, 1, 2]
    .map((i) => ({
      titulo: (v[`valor${i}` as keyof typeof v] as string) ?? "",
      texto: (v[`texto${i}` as keyof typeof v] as string) ?? "",
      icono: ICONOS_VALORES[i],
    }))
    .filter((x) => x.titulo);

  const supabase = await clienteServidor();
  const { error } = await supabase.from("contenido_web").upsert({
    clave: "quienesSomos",
    valor: {
      antetitulo: "Quiénes somos",
      titulo: v.titulo,
      texto: v.texto,
      valores,
    },
    actualizado: new Date().toISOString(),
  });

  if (error) return fallo(mensajeDeError(error));
  refrescarSitio();
  return exito("Sección «Quiénes somos» actualizada.");
}

export async function guardarBloqueWhatsapp(
  _estado: Resultado,
  datos: FormData,
): Promise<Resultado> {
  await exigirGrupo("Contenido");

  const analisis = validar(
    z.object({
      titulo: textoObligatorio("El título", 3),
      texto: textoObligatorio("El texto", 10),
      boton: textoObligatorio("El texto del botón"),
    }),
    datos,
  );
  if (!analisis.ok) return analisis.resultado;

  const supabase = await clienteServidor();
  const { error } = await supabase.from("contenido_web").upsert({
    clave: "pedidoWhatsapp",
    valor: analisis.valor,
    actualizado: new Date().toISOString(),
  });

  if (error) return fallo(mensajeDeError(error));
  refrescarSitio();
  return exito("Bloque de WhatsApp actualizado.");
}

/* --------------------------- Secciones del inicio ------------------------- */

export async function reordenarSecciones(orden: string[]) {
  await exigirGrupo("Contenido");
  const supabase = await clienteServidor();

  for (let i = 0; i < orden.length; i++) {
    const { error } = await supabase
      .from("secciones_inicio")
      .update({ orden: i })
      .eq("id", orden[i]);
    if (error) throw new Error(mensajeDeError(error));
  }
  refrescarSitio();
  revalidatePath("/admin/contenido");
}

export async function alternarSeccion(id: string, visible: boolean) {
  await exigirGrupo("Contenido");
  const supabase = await clienteServidor();
  const { error } = await supabase
    .from("secciones_inicio")
    .update({ visible })
    .eq("id", id);
  if (error) throw new Error(mensajeDeError(error));
  refrescarSitio();
  revalidatePath("/admin/contenido");
}

/* --------------------------------- Banners -------------------------------- */

const esquemaBanner = z.object({
  id: z.string().optional(),
  nombre: textoObligatorio("El nombre", 2),
  ubicacion: textoObligatorio("La ubicación"),
  imagen: z.string().trim().optional(),
  titulo: z.string().trim().optional(),
  texto: z.string().trim().optional(),
  boton: z.string().trim().optional(),
  enlace: z.string().trim().optional(),
  desde: z.string().trim().optional(),
  hasta: z.string().trim().optional(),
  activo: casilla,
});

export async function guardarBanner(
  _estado: Resultado,
  datos: FormData,
): Promise<Resultado> {
  await exigirGrupo("Contenido");

  const analisis = validar(esquemaBanner, datos);
  if (!analisis.ok) return analisis.resultado;
  const v = analisis.valor;

  const supabase = await clienteServidor();
  const fila = {
    nombre: v.nombre,
    ubicacion: v.ubicacion,
    imagen_url: v.imagen || null,
    titulo: v.titulo || null,
    texto: v.texto || null,
    boton: v.boton || null,
    enlace: v.enlace || null,
    desde: v.desde || null,
    hasta: v.hasta || null,
    activo: v.activo,
  };

  const { error } = v.id
    ? await supabase.from("banners").update(fila).eq("id", v.id)
    : await supabase.from("banners").insert(fila);

  if (error) return fallo(mensajeDeError(error));

  refrescarSitio();
  revalidatePath("/admin/banners");
  return exito(v.id ? "Banner actualizado." : "Banner creado.");
}

export async function alternarBanner(id: string, activo: boolean) {
  await exigirGrupo("Contenido");
  const supabase = await clienteServidor();
  const { error } = await supabase.from("banners").update({ activo }).eq("id", id);
  if (error) throw new Error(mensajeDeError(error));
  refrescarSitio();
  revalidatePath("/admin/banners");
}

export async function eliminarBanner(id: string) {
  await exigirGrupo("Contenido");
  const supabase = await clienteServidor();
  const { error } = await supabase.from("banners").delete().eq("id", id);
  if (error) throw new Error(mensajeDeError(error));
  refrescarSitio();
  revalidatePath("/admin/banners");
}

/* --------------------------- Preguntas frecuentes ------------------------- */

const esquemaPregunta = z.object({
  id: z.string().optional(),
  categoria: z.enum(["productos", "pedidos", "puntos", "mayor", "barf"]),
  pregunta: textoObligatorio("La pregunta", 5),
  respuesta: textoObligatorio("La respuesta", 10),
  visible: casilla,
});

export async function guardarPregunta(
  _estado: Resultado,
  datos: FormData,
): Promise<Resultado> {
  await exigirGrupo("Contenido");

  const analisis = validar(esquemaPregunta, datos);
  if (!analisis.ok) return analisis.resultado;
  const v = analisis.valor;

  const supabase = await clienteServidor();
  const fila = {
    categoria: v.categoria,
    pregunta: v.pregunta,
    respuesta: v.respuesta,
    visible: v.visible,
  };

  const { error } = v.id
    ? await supabase.from("preguntas_frecuentes").update(fila).eq("id", v.id)
    : await supabase.from("preguntas_frecuentes").insert(fila);

  if (error) return fallo(mensajeDeError(error));

  refrescarSitio();
  revalidatePath("/admin/faq");
  return exito(v.id ? "Pregunta actualizada." : "Pregunta creada.");
}

export async function eliminarPregunta(id: string) {
  await exigirGrupo("Contenido");
  const supabase = await clienteServidor();
  const { error } = await supabase.from("preguntas_frecuentes").delete().eq("id", id);
  if (error) throw new Error(mensajeDeError(error));
  refrescarSitio();
  revalidatePath("/admin/faq");
}

export async function reordenarPreguntas(orden: string[]) {
  await exigirGrupo("Contenido");
  const supabase = await clienteServidor();
  for (let i = 0; i < orden.length; i++) {
    const { error } = await supabase
      .from("preguntas_frecuentes")
      .update({ orden: i })
      .eq("id", orden[i]);
    if (error) throw new Error(mensajeDeError(error));
  }
  refrescarSitio();
  revalidatePath("/admin/faq");
}

/* ------------------------------- Testimonios ------------------------------ */

const esquemaTestimonio = z.object({
  id: z.string().optional(),
  mascota: textoObligatorio("El nombre de la mascota"),
  dueno: textoObligatorio("El nombre del dueño"),
  producto: z.string().trim().optional(),
  calificacion: z.coerce.number().int().min(1).max(5),
  comentario: textoObligatorio("El comentario", 10),
  foto: z.string().trim().optional(),
  publicado: casilla,
});

export async function guardarTestimonio(
  _estado: Resultado,
  datos: FormData,
): Promise<Resultado> {
  await exigirGrupo("Contenido");

  const analisis = validar(esquemaTestimonio, datos);
  if (!analisis.ok) return analisis.resultado;
  const v = analisis.valor;

  const supabase = await clienteServidor();
  const fila = {
    mascota: v.mascota,
    dueno: v.dueno,
    producto: v.producto || null,
    calificacion: v.calificacion,
    comentario: v.comentario,
    foto_url: v.foto || null,
    publicado: v.publicado,
  };

  const { error } = v.id
    ? await supabase.from("testimonios").update(fila).eq("id", v.id)
    : await supabase.from("testimonios").insert(fila);

  if (error) return fallo(mensajeDeError(error));

  refrescarSitio();
  revalidatePath("/admin/testimonios");
  return exito(v.id ? "Testimonio actualizado." : "Testimonio creado.");
}

export async function alternarTestimonio(id: string, publicado: boolean) {
  await exigirGrupo("Contenido");
  const supabase = await clienteServidor();
  const { error } = await supabase
    .from("testimonios")
    .update({ publicado })
    .eq("id", id);
  if (error) throw new Error(mensajeDeError(error));
  refrescarSitio();
  revalidatePath("/admin/testimonios");
}

export async function eliminarTestimonio(id: string) {
  await exigirGrupo("Contenido");
  const supabase = await clienteServidor();
  const { error } = await supabase.from("testimonios").delete().eq("id", id);
  if (error) throw new Error(mensajeDeError(error));
  refrescarSitio();
  revalidatePath("/admin/testimonios");
}

/* ------------------------------ Configuración ----------------------------- */

async function guardarClave(clave: string, valor: unknown): Promise<Resultado> {
  const supabase = await clienteServidor();
  const { error } = await supabase.from("configuracion").upsert({ clave, valor });
  if (error) return fallo(mensajeDeError(error));
  revalidatePath("/", "layout");
  revalidatePath("/admin/configuracion");
  return exito("Configuración guardada.");
}

export async function guardarEmpresa(
  _estado: Resultado,
  datos: FormData,
): Promise<Resultado> {
  await exigirGrupo("Sistema");
  const analisis = validar(
    z.object({
      nombre: textoObligatorio("El nombre comercial"),
      ruc: z.string().trim().optional(),
      razonSocial: z.string().trim().optional(),
      direccion: z.string().trim().optional(),
    }),
    datos,
  );
  if (!analisis.ok) return analisis.resultado;
  return guardarClave("empresa", analisis.valor);
}

export async function guardarEntrega(
  _estado: Resultado,
  datos: FormData,
): Promise<Resultado> {
  await exigirGrupo("Sistema");
  const analisis = validar(
    z.object({
      costoDelivery: z.coerce.number().min(0),
      costoRecojo: z.coerce.number().min(0),
      envioGratisDesde: z.coerce.number().min(0),
    }),
    datos,
  );
  if (!analisis.ok) return analisis.resultado;
  const v = analisis.valor;

  return guardarClave("entrega", {
    metodos: [
      {
        id: "delivery",
        nombre: "Delivery",
        detalle: "Lima Metropolitana. Costo según distrito, se confirma por WhatsApp.",
        costo: v.costoDelivery,
      },
      {
        id: "recojo",
        nombre: "Recojo en tienda",
        detalle: "Coordina el horario y recoge tu pedido sin costo adicional.",
        costo: v.costoRecojo,
      },
    ],
    envioGratisDesde: v.envioGratisDesde,
  });
}

export async function guardarIntegraciones(
  _estado: Resultado,
  datos: FormData,
): Promise<Resultado> {
  await exigirGrupo("Sistema");
  const analisis = validar(
    z.object({
      whatsapp: textoObligatorio("El número de WhatsApp"),
      instagram: z.string().trim().optional(),
      tiktok: z.string().trim().optional(),
      analytics: z.string().trim().optional(),
      metaPixel: z.string().trim().optional(),
      botonFlotante: casilla,
      pedidoSinRegistro: casilla,
      mostrarAgotados: casilla,
      mantenimiento: casilla,
    }),
    datos,
  );
  if (!analisis.ok) return analisis.resultado;
  const v = analisis.valor;

  return guardarClave("integraciones", {
    ...v,
    whatsapp: v.whatsapp.replace(/\D/g, ""),
    instagram: (v.instagram ?? "").replace(/^@/, ""),
    tiktok: (v.tiktok ?? "").replace(/^@/, ""),
  });
}

export async function guardarContacto(
  _estado: Resultado,
  datos: FormData,
): Promise<Resultado> {
  await exigirGrupo("Contenido");
  const analisis = validar(
    z.object({
      nombre: textoObligatorio("El nombre"),
      descripcion: z.string().trim().optional(),
      telefono: textoObligatorio("El teléfono"),
      whatsapp: textoObligatorio("El WhatsApp"),
      instagram: z.string().trim().optional(),
      tiktok: z.string().trim().optional(),
      correo: z.string().trim().optional(),
      ciudad: z.string().trim().optional(),
      horario: z.string().trim().optional(),
    }),
    datos,
  );
  if (!analisis.ok) return analisis.resultado;
  const v = analisis.valor;

  return guardarClave("contacto", {
    ...v,
    whatsapp: v.whatsapp.replace(/\D/g, ""),
    instagram: (v.instagram ?? "").replace(/^@/, ""),
    tiktok: (v.tiktok ?? "").replace(/^@/, ""),
  });
}

export async function guardarColores(
  _estado: Resultado,
  datos: FormData,
): Promise<Resultado> {
  await exigirGrupo("Contenido");
  const analisis = validar(
    z.object({
      hoja: textoObligatorio("El acento hoja"),
      coral: textoObligatorio("El acento coral"),
      ambar: textoObligatorio("El acento ámbar"),
      crema: textoObligatorio("El fondo crema"),
    }),
    datos,
  );
  if (!analisis.ok) return analisis.resultado;
  return guardarClave("colores", analisis.valor);
}
