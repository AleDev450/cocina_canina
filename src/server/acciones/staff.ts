"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { clienteServidor, clienteAdministrador } from "@/lib/supabase/servidor";
import { exigirMiembro, GRUPOS } from "@/server/sesion";
import {
  INICIAL,
  casilla,
  exito,
  fallo,
  mensajeDeError,
  textoObligatorio,
  validar,
  type Resultado,
} from "@/server/acciones/comunes";

export { INICIAL };

const ROLES = ["administrador", "produccion", "reparto", "contenido", "atencion"] as const;

async function exigirAdministrador() {
  const miembro = await exigirMiembro();
  if (miembro.rol !== "administrador") {
    throw new Error("Solo un administrador puede gestionar usuarios y permisos.");
  }
  return miembro;
}

/* ------------------------- Usuarios administrativos ----------------------- */

const esquemaInvitacion = z.object({
  nombre: textoObligatorio("El nombre", 2),
  correo: z
    .string()
    .trim()
    .toLowerCase()
    .refine((v) => /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v), "Correo no válido"),
  clave: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  rol: z.enum(ROLES),
});

/**
 * Crea la cuenta del miembro del equipo y lo da de alta en `staff`.
 * Requiere la clave de servicio: es la única forma de crear usuarios
 * confirmados sin pasar por el flujo de correo.
 */
export async function invitarUsuario(
  _estado: Resultado,
  datos: FormData,
): Promise<Resultado> {
  await exigirAdministrador();

  const analisis = validar(esquemaInvitacion, datos);
  if (!analisis.ok) return analisis.resultado;
  const v = analisis.valor;

  let admin;
  try {
    admin = clienteAdministrador();
  } catch (error) {
    return fallo((error as Error).message);
  }

  const { data, error } = await admin.auth.admin.createUser({
    email: v.correo,
    password: v.clave,
    email_confirm: true,
    user_metadata: { nombres: v.nombre },
  });

  if (error) {
    if (/already/i.test(error.message)) {
      return fallo("Ese correo ya tiene una cuenta.", { correo: "Ya registrado" });
    }
    return fallo(error.message);
  }

  const { error: errorStaff } = await admin.from("staff").upsert({
    id: data.user.id,
    nombre: v.nombre,
    correo: v.correo,
    rol: v.rol,
    activo: true,
  });

  if (errorStaff) return fallo(mensajeDeError(errorStaff));

  revalidatePath("/admin/usuarios");
  return exito(`${v.nombre} ya puede entrar al panel.`);
}

export async function cambiarRol(id: string, rol: string) {
  await exigirAdministrador();
  if (!ROLES.includes(rol as (typeof ROLES)[number])) {
    throw new Error("Rol no válido.");
  }

  const supabase = await clienteServidor();
  const { error } = await supabase.from("staff").update({ rol }).eq("id", id);
  if (error) throw new Error(mensajeDeError(error));
  revalidatePath("/admin/usuarios");
}

export async function alternarUsuario(id: string, activo: boolean) {
  const yo = await exigirAdministrador();
  if (id === yo.id && !activo) {
    throw new Error("No puedes suspender tu propia cuenta.");
  }

  const supabase = await clienteServidor();
  const { error } = await supabase.from("staff").update({ activo }).eq("id", id);
  if (error) throw new Error(mensajeDeError(error));
  revalidatePath("/admin/usuarios");
}

export async function quitarUsuario(id: string) {
  const yo = await exigirAdministrador();
  if (id === yo.id) throw new Error("No puedes quitarte a ti mismo del panel.");

  const supabase = await clienteServidor();
  const { error } = await supabase.from("staff").delete().eq("id", id);
  if (error) throw new Error(mensajeDeError(error));
  revalidatePath("/admin/usuarios");
}

/* ----------------------------- Roles y permisos --------------------------- */

export async function guardarPermisos(
  _estado: Resultado,
  datos: FormData,
): Promise<Resultado> {
  await exigirAdministrador();

  const supabase = await clienteServidor();
  const marcados = new Set(datos.getAll("permiso").map(String));

  for (const rol of ROLES) {
    for (const grupo of GRUPOS) {
      // El administrador siempre conserva acceso total.
      const permitido = rol === "administrador" || marcados.has(`${rol}|${grupo}`);
      const { error } = await supabase
        .from("rol_permisos")
        .upsert({ rol, grupo, permitido });
      if (error) return fallo(mensajeDeError(error));
    }
  }

  revalidatePath("/admin", "layout");
  return exito("Permisos actualizados.");
}

const esquemaRol = z.object({
  nombre: textoObligatorio("El nombre del rol", 3),
  operacion: casilla,
  catalogo: casilla,
  clientes: casilla,
  contenido: casilla,
  sistema: casilla,
});

/**
 * Los roles son un enum en la base de datos, así que no se crean desde la
 * interfaz: se ajustan sus permisos. Esta acción existe para dejar claro el
 * mensaje en el CMS en lugar de ofrecer un botón que no hace nada.
 */
export async function crearRol(
  _estado: Resultado,
  datos: FormData,
): Promise<Resultado> {
  await exigirAdministrador();
  const analisis = validar(esquemaRol, datos);
  if (!analisis.ok) return analisis.resultado;

  return fallo(
    "Los cinco roles están definidos en la base de datos. Para añadir uno nuevo hay " +
      "que ampliar el tipo `rol_staff` en Supabase; mientras tanto, ajusta los permisos " +
      "de los roles existentes en la matriz de abajo.",
  );
}
