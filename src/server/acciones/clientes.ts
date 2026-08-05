"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { clienteServidor } from "@/lib/supabase/servidor";
import { exigirCliente } from "@/server/sesion";
import {
  INICIAL,
  casilla,
  comasATexto,
  exito,
  fallo,
  mensajeDeError,
  textoObligatorio,
  validar,
  type Resultado,
} from "@/server/acciones/comunes";

export { INICIAL };

/* --------------------------------- Perfil --------------------------------- */

const esquemaPerfil = z.object({
  nombres: textoObligatorio("El nombre"),
  apellidos: z.string().trim().optional(),
  celular: z.string().trim().optional(),
  nacimiento: z.string().trim().optional(),
  aceptaNovedades: casilla,
});

export async function guardarPerfil(
  _estado: Resultado,
  datos: FormData,
): Promise<Resultado> {
  const cliente = await exigirCliente();

  const analisis = validar(esquemaPerfil, datos);
  if (!analisis.ok) return analisis.resultado;
  const v = analisis.valor;

  const supabase = await clienteServidor();
  const { error } = await supabase
    .from("perfiles")
    .update({
      nombres: v.nombres,
      apellidos: v.apellidos || null,
      celular: v.celular || null,
      nacimiento: v.nacimiento || null,
      acepta_novedades: v.aceptaNovedades,
    })
    .eq("id", cliente.id);

  if (error) return fallo(mensajeDeError(error));

  revalidatePath("/cuenta", "layout");
  return exito("Datos actualizados.");
}

/* -------------------------------- Mascotas -------------------------------- */

const esquemaMascota = z.object({
  id: z.string().optional(),
  nombre: textoObligatorio("El nombre", 2),
  especie: z.string().trim().optional(),
  raza: z.string().trim().optional(),
  nacimiento: z.string().trim().optional(),
  peso: z.string().trim().optional(),
  alergias: comasATexto,
  preferencias: comasATexto,
  foto: z.string().trim().optional(),
});

export async function guardarMascota(
  _estado: Resultado,
  datos: FormData,
): Promise<Resultado> {
  const cliente = await exigirCliente();

  const analisis = validar(esquemaMascota, datos);
  if (!analisis.ok) return analisis.resultado;
  const v = analisis.valor;

  const peso = v.peso ? Number(v.peso) : null;
  if (peso !== null && (!Number.isFinite(peso) || peso <= 0)) {
    return fallo("El peso no es válido.", { peso: "Escribe un número mayor que cero" });
  }

  const supabase = await clienteServidor();
  const fila = {
    perfil_id: cliente.id,
    nombre: v.nombre,
    especie: v.especie || "Perro",
    raza: v.raza || null,
    nacimiento: v.nacimiento || null,
    peso_kg: peso,
    alergias: v.alergias,
    preferencias: v.preferencias,
    foto_url: v.foto || null,
  };

  const { error } = v.id
    ? await supabase.from("mascotas").update(fila).eq("id", v.id)
    : await supabase.from("mascotas").insert(fila);

  if (error) return fallo(mensajeDeError(error));

  revalidatePath("/cuenta", "layout");
  return exito(v.id ? `Perfil de ${v.nombre} actualizado.` : `${v.nombre} registrado.`);
}

export async function eliminarMascota(id: string) {
  await exigirCliente();
  const supabase = await clienteServidor();
  const { error } = await supabase.from("mascotas").delete().eq("id", id);
  if (error) throw new Error(mensajeDeError(error));
  revalidatePath("/cuenta", "layout");
}

/** Sube la foto de una mascota al bucket `mascotas`, en la carpeta del dueño. */
export async function subirFotoMascota(
  _estado: Resultado & { url?: string },
  datos: FormData,
): Promise<Resultado & { url?: string }> {
  const cliente = await exigirCliente();

  const archivo = datos.get("archivo");
  if (!(archivo instanceof File) || archivo.size === 0) return fallo("Elige una foto.");
  if (!["image/png", "image/jpeg", "image/webp"].includes(archivo.type)) {
    return fallo("Formato no admitido. Usa PNG, JPG o WebP.");
  }
  if (archivo.size > 5 * 1024 * 1024) return fallo("La foto supera los 5 MB.");

  const extension = archivo.name.split(".").pop() ?? "jpg";
  const ruta = `${cliente.id}/${crypto.randomUUID()}.${extension}`;

  const supabase = await clienteServidor();
  const { error } = await supabase.storage
    .from("mascotas")
    .upload(ruta, archivo, { contentType: archivo.type });

  if (error) return fallo(`No se pudo subir la foto: ${error.message}`);

  const { data } = supabase.storage.from("mascotas").getPublicUrl(ruta);
  return { ok: true, mensaje: "Foto subida.", url: data.publicUrl };
}

/* ------------------------------- Direcciones ------------------------------ */

const esquemaDireccion = z.object({
  id: z.string().optional(),
  alias: textoObligatorio("El alias"),
  linea: textoObligatorio("La dirección", 5),
  distrito: textoObligatorio("El distrito"),
  referencia: z.string().trim().optional(),
  predeterminada: casilla,
});

export async function guardarDireccion(
  _estado: Resultado,
  datos: FormData,
): Promise<Resultado> {
  const cliente = await exigirCliente();

  const analisis = validar(esquemaDireccion, datos);
  if (!analisis.ok) return analisis.resultado;
  const v = analisis.valor;

  const supabase = await clienteServidor();

  if (v.predeterminada) {
    await supabase
      .from("direcciones")
      .update({ predeterminada: false })
      .eq("perfil_id", cliente.id);
  }

  const fila = {
    perfil_id: cliente.id,
    alias: v.alias,
    linea: v.linea,
    distrito: v.distrito,
    referencia: v.referencia || null,
    predeterminada: v.predeterminada,
  };

  const { error } = v.id
    ? await supabase.from("direcciones").update(fila).eq("id", v.id)
    : await supabase.from("direcciones").insert(fila);

  if (error) return fallo(mensajeDeError(error));

  revalidatePath("/cuenta/direcciones");
  return exito(v.id ? "Dirección actualizada." : "Dirección guardada.");
}

export async function eliminarDireccion(id: string) {
  await exigirCliente();
  const supabase = await clienteServidor();
  const { error } = await supabase.from("direcciones").delete().eq("id", id);
  if (error) throw new Error(mensajeDeError(error));
  revalidatePath("/cuenta/direcciones");
}
