import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { clienteServidor } from "@/lib/supabase/servidor";
import { hayConexion } from "@/lib/supabase/entorno";

export type RolStaff =
  | "administrador"
  | "produccion"
  | "reparto"
  | "contenido"
  | "atencion";

export interface Miembro {
  id: string;
  nombre: string;
  correo: string;
  rol: RolStaff;
  activo: boolean;
}

export interface Cliente {
  id: string;
  nombres: string;
  apellidos: string | null;
  correo: string;
  celular: string | null;
  nacimiento: string | null;
  puntos: number;
  creadoEn: string;
}

/** Grupos de módulos del CMS, tal como los usan las políticas RLS. */
export const GRUPOS = [
  "Operación",
  "Catálogo",
  "Clientes",
  "Contenido",
  "Sistema",
] as const;

export type Grupo = (typeof GRUPOS)[number];

/** `cache` evita repetir la consulta dentro del mismo render. */
export const usuarioActual = cache(async () => {
  if (!hayConexion) return null;
  const supabase = await clienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const perfilActual = cache(async (): Promise<Cliente | null> => {
  const usuario = await usuarioActual();
  if (!usuario) return null;

  const supabase = await clienteServidor();
  const { data } = await supabase
    .from("perfiles")
    .select("id, nombres, apellidos, correo, celular, nacimiento, puntos, creado_en")
    .eq("id", usuario.id)
    .maybeSingle();

  if (!data) return null;
  return {
    id: data.id,
    nombres: data.nombres,
    apellidos: data.apellidos,
    correo: data.correo,
    celular: data.celular,
    nacimiento: data.nacimiento,
    puntos: data.puntos,
    creadoEn: data.creado_en,
  };
});

export const miembroActual = cache(async (): Promise<Miembro | null> => {
  const usuario = await usuarioActual();
  if (!usuario) return null;

  const supabase = await clienteServidor();
  const { data } = await supabase
    .from("staff")
    .select("id, nombre, correo, rol, activo")
    .eq("id", usuario.id)
    .maybeSingle();

  return data && data.activo ? (data as Miembro) : null;
});

/** Grupos de módulos a los que llega el rol del usuario en sesión. */
export const gruposDelMiembro = cache(async (): Promise<Grupo[]> => {
  const miembro = await miembroActual();
  if (!miembro) return [];

  const supabase = await clienteServidor();
  const { data } = await supabase
    .from("rol_permisos")
    .select("grupo")
    .eq("rol", miembro.rol)
    .eq("permitido", true);

  return (data ?? []).map((f) => f.grupo as Grupo);
});

/* ------------------------------- Guardias -------------------------------- */

export async function exigirCliente(): Promise<Cliente> {
  const perfil = await perfilActual();
  if (!perfil) redirect("/ingresar");
  return perfil;
}

export async function exigirMiembro(): Promise<Miembro> {
  const miembro = await miembroActual();
  if (!miembro) redirect("/admin/ingresar");
  return miembro;
}

/**
 * Exige pertenecer a un grupo de módulos. Es la contraparte en la interfaz de
 * la política `puede_grupo()` de la base de datos: aunque alguien saltara esta
 * comprobación, RLS rechazaría la escritura.
 */
export async function exigirGrupo(grupo: Grupo): Promise<Miembro> {
  const miembro = await exigirMiembro();
  if (miembro.rol === "administrador") return miembro;

  const grupos = await gruposDelMiembro();
  if (!grupos.includes(grupo)) {
    redirect("/admin?error=sin-permiso");
  }
  return miembro;
}
