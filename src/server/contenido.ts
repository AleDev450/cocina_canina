import "server-only";

import { cache } from "react";
import { clienteServidor } from "@/lib/supabase/servidor";
import type { PreguntaFrecuente, Testimonio } from "@/lib/tipos";
import {
  hero as heroPorDefecto,
  quienesSomos as nosotrosPorDefecto,
  pedidoWhatsapp as whatsappPorDefecto,
  metodosEntrega as entregaPorDefecto,
  metodosPago as pagoPorDefecto,
  sitio as sitioPorDefecto,
} from "@/data/sitio";

/**
 * Contenido editable desde el CMS.
 *
 * Si una clave todavía no existe en la base, se devuelve el valor por defecto
 * de `src/data/sitio.ts`: la web nunca queda en blanco por falta de datos.
 */

async function bloque<T>(clave: string, porDefecto: T): Promise<T> {
  const supabase = await clienteServidor();
  const { data } = await supabase
    .from("contenido_web")
    .select("valor")
    .eq("clave", clave)
    .maybeSingle();

  return (data?.valor as T | undefined) ?? porDefecto;
}

export const obtenerHero = cache(() => bloque("hero", heroPorDefecto));
export const obtenerNosotros = cache(() => bloque("quienesSomos", nosotrosPorDefecto));
export const obtenerBloqueWhatsapp = cache(() =>
  bloque("pedidoWhatsapp", whatsappPorDefecto),
);

/* ------------------------------ Configuración ----------------------------- */

export interface Configuracion {
  empresa: { nombre: string; ruc: string; razonSocial: string; direccion: string };
  contacto: typeof sitioPorDefecto;
  entrega: { metodos: typeof entregaPorDefecto; envioGratisDesde: number };
  pago: { metodos: typeof pagoPorDefecto };
  integraciones: {
    whatsapp: string;
    instagram: string;
    tiktok: string;
    analytics: string;
    metaPixel: string;
    botonFlotante: boolean;
    pedidoSinRegistro: boolean;
    mostrarAgotados: boolean;
    mantenimiento: boolean;
  };
  colores: { hoja: string; coral: string; ambar: string; crema: string };
}

const CONFIG_POR_DEFECTO: Configuracion = {
  empresa: { nombre: sitioPorDefecto.nombre, ruc: "", razonSocial: "", direccion: "" },
  contacto: sitioPorDefecto,
  entrega: { metodos: entregaPorDefecto, envioGratisDesde: 150 },
  pago: { metodos: pagoPorDefecto },
  integraciones: {
    whatsapp: sitioPorDefecto.whatsapp,
    instagram: sitioPorDefecto.instagram,
    tiktok: sitioPorDefecto.tiktok,
    analytics: "",
    metaPixel: "",
    botonFlotante: true,
    pedidoSinRegistro: true,
    mostrarAgotados: true,
    mantenimiento: false,
  },
  colores: { hoja: "#4F9A4A", coral: "#E8735A", ambar: "#D99A2B", crema: "#FDFAF5" },
};

export const obtenerConfiguracion = cache(async (): Promise<Configuracion> => {
  const supabase = await clienteServidor();
  const { data } = await supabase.from("configuracion").select("clave, valor");

  const mapa = new Map((data ?? []).map((f) => [f.clave, f.valor]));
  return {
    empresa: (mapa.get("empresa") as Configuracion["empresa"]) ?? CONFIG_POR_DEFECTO.empresa,
    contacto: (mapa.get("contacto") as Configuracion["contacto"]) ?? CONFIG_POR_DEFECTO.contacto,
    entrega: (mapa.get("entrega") as Configuracion["entrega"]) ?? CONFIG_POR_DEFECTO.entrega,
    pago: (mapa.get("pago") as Configuracion["pago"]) ?? CONFIG_POR_DEFECTO.pago,
    integraciones:
      (mapa.get("integraciones") as Configuracion["integraciones"]) ??
      CONFIG_POR_DEFECTO.integraciones,
    colores: (mapa.get("colores") as Configuracion["colores"]) ?? CONFIG_POR_DEFECTO.colores,
  };
});

/* --------------------------- Preguntas frecuentes ------------------------- */

export const obtenerPreguntas = cache(
  async (soloVisibles = true): Promise<Array<PreguntaFrecuente & { visible: boolean }>> => {
    const supabase = await clienteServidor();
    let consulta = supabase
      .from("preguntas_frecuentes")
      .select("id, categoria, pregunta, respuesta, visible");
    if (soloVisibles) consulta = consulta.eq("visible", true);

    const { data, error } = await consulta.order("orden", { ascending: true });
    if (error) throw new Error(`No se pudieron cargar las preguntas: ${error.message}`);

    return (data ?? []).map((p) => ({
      id: p.id,
      categoria: p.categoria as PreguntaFrecuente["categoria"],
      pregunta: p.pregunta,
      respuesta: p.respuesta,
      visible: p.visible,
    }));
  },
);

/* ------------------------------- Testimonios ------------------------------ */

export const obtenerTestimonios = cache(
  async (soloPublicados = true): Promise<Array<Testimonio & { publicado: boolean }>> => {
    const supabase = await clienteServidor();
    let consulta = supabase
      .from("testimonios")
      .select("id, mascota, dueno, foto_url, producto, calificacion, comentario, publicado");
    if (soloPublicados) consulta = consulta.eq("publicado", true);

    const { data, error } = await consulta.order("orden", { ascending: true });
    if (error) throw new Error(`No se pudieron cargar los testimonios: ${error.message}`);

    return (data ?? []).map((t) => ({
      id: t.id,
      mascota: t.mascota,
      dueno: t.dueno,
      foto: t.foto_url ?? "",
      producto: t.producto ?? "",
      calificacion: t.calificacion,
      comentario: t.comentario,
      publicado: t.publicado,
    }));
  },
);

/* --------------------------------- Banners -------------------------------- */

export interface Banner {
  id: string;
  nombre: string;
  ubicacion: string;
  imagen: string;
  titulo: string;
  texto: string;
  boton: string;
  enlace: string;
  desde: string | null;
  hasta: string | null;
  activo: boolean;
}

export const obtenerBanners = cache(async (): Promise<Banner[]> => {
  const supabase = await clienteServidor();
  const { data, error } = await supabase
    .from("banners")
    .select("id, nombre, ubicacion, imagen_url, titulo, texto, boton, enlace, desde, hasta, activo")
    .order("orden", { ascending: true });

  if (error) throw new Error(`No se pudieron cargar los banners: ${error.message}`);

  return (data ?? []).map((b) => ({
    id: b.id,
    nombre: b.nombre,
    ubicacion: b.ubicacion,
    imagen: b.imagen_url ?? "/productos/barf.png",
    titulo: b.titulo ?? "",
    texto: b.texto ?? "",
    boton: b.boton ?? "",
    enlace: b.enlace ?? "",
    desde: b.desde,
    hasta: b.hasta,
    activo: b.activo,
  }));
});

/* ---------------------------- Secciones del inicio ------------------------ */

export interface SeccionInicio {
  id: string;
  clave: string;
  nombre: string;
  orden: number;
  visible: boolean;
}

export const obtenerSecciones = cache(async (): Promise<SeccionInicio[]> => {
  const supabase = await clienteServidor();
  const { data, error } = await supabase
    .from("secciones_inicio")
    .select("id, clave, nombre, orden, visible")
    .order("orden", { ascending: true });

  if (error) throw new Error(`No se pudieron cargar las secciones: ${error.message}`);
  return data ?? [];
});
