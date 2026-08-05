"use client";

import { createBrowserClient } from "@supabase/ssr";
import { exigirConfiguracion } from "@/lib/supabase/entorno";

/** Cliente de Supabase para componentes del navegador. */
export function clienteNavegador() {
  const { url, clave } = exigirConfiguracion();
  return createBrowserClient(url, clave);
}
