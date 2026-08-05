import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { exigirConfiguracion, URL_SUPABASE } from "@/lib/supabase/entorno";

/**
 * Cliente para componentes de servidor y Server Actions.
 *
 * Al leer desde un Server Component, Next no permite escribir cookies: por eso
 * el `setAll` se envuelve en try/catch. La renovación del token la hace el
 * middleware, que sí puede escribirlas.
 */
export async function clienteServidor() {
  const { url, clave } = exigirConfiguracion();
  const almacen = await cookies();

  return createServerClient(url, clave, {
    cookies: {
      getAll() {
        return almacen.getAll();
      },
      setAll(nuevas) {
        try {
          nuevas.forEach(({ name, value, options }) =>
            almacen.set(name, value, options),
          );
        } catch {
          // Server Component: lo resuelve el middleware.
        }
      },
    },
  });
}

/**
 * Cliente con clave de servicio: omite Row Level Security.
 *
 * Úsalo solo cuando de verdad haga falta escribir en nombre de nadie
 * (pedidos de invitados, alta del primer administrador). Nunca en el navegador.
 */
export function clienteAdministrador() {
  const clave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!URL_SUPABASE || !clave) {
    throw new Error(
      "Falta SUPABASE_SERVICE_ROLE_KEY en .env.local para esta operación.",
    );
  }
  return createClient(URL_SUPABASE, clave, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
