import "server-only";

import { z } from "zod";

/** Resultado uniforme de toda Server Action, para usar con `useActionState`. */
export interface Resultado {
  ok?: boolean;
  mensaje?: string;
  errores?: Record<string, string>;
}

export const INICIAL: Resultado = {};

export function exito(mensaje: string): Resultado {
  return { ok: true, mensaje };
}

export function fallo(mensaje: string, errores?: Record<string, string>): Resultado {
  return { ok: false, mensaje, errores };
}

/**
 * Valida un FormData contra un esquema de Zod y devuelve los errores por campo
 * listos para pintarlos junto a cada input.
 */
export function validar<T extends z.ZodType>(
  esquema: T,
  datos: FormData,
): { ok: true; valor: z.infer<T> } | { ok: false; resultado: Resultado } {
  const bruto: Record<string, unknown> = {};
  for (const [clave, valor] of datos.entries()) {
    if (valor instanceof File) continue;
    // Campos repetidos (checkboxes múltiples) llegan como arreglo.
    if (clave in bruto) {
      const previo = bruto[clave];
      bruto[clave] = Array.isArray(previo) ? [...previo, valor] : [previo, valor];
    } else {
      bruto[clave] = valor;
    }
  }

  const analisis = esquema.safeParse(bruto);
  if (analisis.success) return { ok: true, valor: analisis.data };

  const errores: Record<string, string> = {};
  analisis.error.issues.forEach((problema) => {
    const campo = problema.path.join(".") || "general";
    if (!errores[campo]) errores[campo] = problema.message;
  });

  return {
    ok: false,
    resultado: fallo("Revisa los campos marcados.", errores),
  };
}

/** Traduce los errores más comunes de Postgres a algo legible. */
export function mensajeDeError(error: { message: string; code?: string }): string {
  const codigo = error.code ?? "";
  if (codigo === "23505") return "Ya existe un registro con ese identificador.";
  if (codigo === "23503") return "No se puede completar: hay datos relacionados.";
  if (codigo === "42501" || /row-level security/i.test(error.message)) {
    return "Tu rol no tiene permiso para esta acción.";
  }
  return error.message;
}

/* ------------------------- Transformaciones comunes ----------------------- */

/** Texto separado por saltos de línea → arreglo limpio. */
export const lineasATexto = z
  .string()
  .optional()
  .transform((v) =>
    (v ?? "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean),
  );

/** Texto separado por comas → arreglo limpio. */
export const comasATexto = z
  .string()
  .optional()
  .transform((v) =>
    (v ?? "")
      .split(",")
      .map((l) => l.trim())
      .filter(Boolean),
  );

/** Casilla de formulario: presente = true. */
export const casilla = z
  .union([z.literal("on"), z.literal("true"), z.string(), z.undefined()])
  .optional()
  .transform((v) => v === "on" || v === "true");

export const numero = (minimo = 0) =>
  z.coerce.number().min(minimo, `Debe ser ${minimo} o más`);

export const textoObligatorio = (campo: string, minimo = 1) =>
  z.string().trim().min(minimo, `${campo} es obligatorio`);

/** Convierte un nombre en un slug estable. */
export function aSlug(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
