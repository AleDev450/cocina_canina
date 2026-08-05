"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { clienteServidor } from "@/lib/supabase/servidor";
import {
  INICIAL,
  fallo,
  exito,
  validar,
  textoObligatorio,
  type Resultado,
} from "@/server/acciones/comunes";

export { INICIAL };

const CORREO = z
  .string()
  .trim()
  .toLowerCase()
  .refine((v) => /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v), "Correo no válido");

const CLAVE = z.string().min(8, "La contraseña debe tener al menos 8 caracteres");

/* -------------------------------- Registro -------------------------------- */

const esquemaRegistro = z
  .object({
    nombres: textoObligatorio("El nombre"),
    apellidos: textoObligatorio("El apellido"),
    correo: CORREO,
    celular: textoObligatorio("El celular"),
    clave: CLAVE,
    repetir: z.string(),
    nacimiento: z.string().optional(),
    mascota: z.string().trim().optional(),
    especie: z.string().optional(),
    raza: z.string().optional(),
    peso: z.string().optional(),
    nacimientoMascota: z.string().optional(),
    terminos: z
      .string()
      .optional()
      .refine((v) => v === "on", "Debes aceptar los términos y la política de privacidad"),
  })
  .refine((d) => d.clave === d.repetir, {
    error: "Las contraseñas no coinciden",
    path: ["repetir"],
  });

export async function registrarse(
  _estado: Resultado,
  datos: FormData,
): Promise<Resultado> {
  const analisis = validar(esquemaRegistro, datos);
  if (!analisis.ok) return analisis.resultado;
  const v = analisis.valor;

  const supabase = await clienteServidor();
  const { data, error } = await supabase.auth.signUp({
    email: v.correo,
    password: v.clave,
    options: {
      data: {
        nombres: v.nombres,
        apellidos: v.apellidos,
        celular: v.celular,
        mascota: v.mascota ?? "",
        especie: v.especie ?? "Perro",
        raza: v.raza ?? "",
        peso: v.peso ?? "",
        nacimientoMascota: v.nacimientoMascota ?? "",
      },
    },
  });

  if (error) {
    if (/already registered|already exists/i.test(error.message)) {
      return fallo("Ese correo ya tiene una cuenta. Inicia sesión.", {
        correo: "Correo ya registrado",
      });
    }
    return fallo(error.message);
  }

  // Con la confirmación por correo activada, signUp no abre sesión.
  if (!data.session) {
    return exito(
      "Cuenta creada. Te enviamos un correo para confirmar tu dirección; " +
        "ábrelo y ya podrás iniciar sesión.",
    );
  }

  // Guardar la fecha de nacimiento, que no viaja en los metadatos del usuario.
  if (v.nacimiento) {
    await supabase
      .from("perfiles")
      .update({ nacimiento: v.nacimiento })
      .eq("id", data.user!.id);
  }

  revalidatePath("/", "layout");
  redirect("/cuenta");
}

/* ------------------------------ Iniciar sesión ---------------------------- */

const esquemaIngreso = z.object({
  correo: CORREO,
  clave: z.string().min(1, "Escribe tu contraseña"),
  siguiente: z.string().optional(),
});

export async function ingresar(
  _estado: Resultado,
  datos: FormData,
): Promise<Resultado> {
  const analisis = validar(esquemaIngreso, datos);
  if (!analisis.ok) return analisis.resultado;
  const v = analisis.valor;

  const supabase = await clienteServidor();
  const { error } = await supabase.auth.signInWithPassword({
    email: v.correo,
    password: v.clave,
  });

  if (error) {
    if (/email not confirmed/i.test(error.message)) {
      return fallo("Todavía no confirmaste tu correo. Revisa tu bandeja de entrada.");
    }
    return fallo("Correo o contraseña incorrectos.");
  }

  revalidatePath("/", "layout");
  redirect(v.siguiente && v.siguiente.startsWith("/") ? v.siguiente : "/cuenta");
}

/* --------------------------- Ingreso al CMS ------------------------------- */

export async function ingresarAdmin(
  _estado: Resultado,
  datos: FormData,
): Promise<Resultado> {
  const analisis = validar(esquemaIngreso, datos);
  if (!analisis.ok) return analisis.resultado;
  const v = analisis.valor;

  const supabase = await clienteServidor();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: v.correo,
    password: v.clave,
  });

  if (error) return fallo("Correo o contraseña incorrectos.");

  const { data: miembro } = await supabase
    .from("staff")
    .select("activo, nombre")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!miembro?.activo) {
    await supabase.auth.signOut();
    return fallo(
      "Esta cuenta no tiene acceso al panel. Pide a un administrador que te dé de alta.",
    );
  }

  await supabase
    .from("staff")
    .update({ ultimo_acceso: new Date().toISOString() })
    .eq("id", data.user.id);

  revalidatePath("/admin", "layout");
  redirect(v.siguiente && v.siguiente.startsWith("/admin") ? v.siguiente : "/admin");
}

/* -------------------------------- Salir ----------------------------------- */

export async function salir() {
  const supabase = await clienteServidor();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function salirDelAdmin() {
  const supabase = await clienteServidor();
  await supabase.auth.signOut();
  revalidatePath("/admin", "layout");
  redirect("/admin/ingresar");
}

/* --------------------------- Recuperar contraseña ------------------------- */

export async function recuperarClave(
  _estado: Resultado,
  datos: FormData,
): Promise<Resultado> {
  const analisis = validar(z.object({ correo: CORREO }), datos);
  if (!analisis.ok) return analisis.resultado;

  const supabase = await clienteServidor();
  const { error } = await supabase.auth.resetPasswordForEmail(analisis.valor.correo);
  if (error) return fallo(error.message);

  return exito(
    "Si ese correo tiene una cuenta, te enviamos un enlace para restablecer la contraseña.",
  );
}

/* ---------------------------- Cambiar contraseña -------------------------- */

const esquemaClave = z
  .object({ clave: CLAVE, repetir: z.string() })
  .refine((d) => d.clave === d.repetir, {
    error: "Las contraseñas no coinciden",
    path: ["repetir"],
  });

export async function cambiarClave(
  _estado: Resultado,
  datos: FormData,
): Promise<Resultado> {
  const analisis = validar(esquemaClave, datos);
  if (!analisis.ok) return analisis.resultado;

  const supabase = await clienteServidor();
  const { error } = await supabase.auth.updateUser({
    password: analisis.valor.clave,
  });
  if (error) return fallo(error.message);

  return exito("Contraseña actualizada.");
}
