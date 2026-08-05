/**
 * Lectura de las variables de entorno de Supabase.
 *
 * Se leen de forma perezosa para que `next build` funcione aunque el `.env.local`
 * todavía no exista: solo revienta cuando alguien intenta usar el cliente.
 */

export const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const CLAVE_ANONIMA = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** ¿Está configurada la conexión? Permite mostrar un aviso útil en vez de un 500. */
export const hayConexion = Boolean(URL_SUPABASE && CLAVE_ANONIMA);

export function exigirConfiguracion(): { url: string; clave: string } {
  if (!hayConexion) {
    throw new Error(
      "Falta configurar Supabase. Copia .env.example como .env.local y completa " +
        "NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  return { url: URL_SUPABASE, clave: CLAVE_ANONIMA };
}
