import Link from "next/link";
import { Database } from "lucide-react";

/**
 * Aviso que reemplaza a cualquier página que necesite la base de datos
 * mientras el `.env.local` no esté completo. Evita que la web reviente con un
 * 500 y explica qué falta.
 */
export function SinConexion() {
  return (
    <div className="contenedor flex min-h-[70vh] items-center justify-center py-20">
      <div className="max-w-lg rounded-blob border border-petroleo-700/10 bg-white p-10 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-naranja-50 text-naranja-600">
          <Database className="h-6 w-6" />
        </span>
        <h1 className="mt-6 font-display text-2xl font-semibold text-petroleo-900">
          Falta conectar Supabase
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-grafito">
          Completa{" "}
          <code className="rounded bg-crema-100 px-1.5 py-0.5">.env.local</code> con las
          claves del proyecto y ejecuta los archivos de{" "}
          <code className="rounded bg-crema-100 px-1.5 py-0.5">supabase/</code> en el SQL
          Editor. Los pasos completos están en el README.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex text-sm font-semibold text-naranja-600 hover:underline"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
