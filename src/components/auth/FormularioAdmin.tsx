"use client";

import Link from "next/link";
import { useActionState } from "react";
import { LogIn, ShieldCheck } from "lucide-react";
import { ingresarAdmin } from "@/server/acciones/auth";
import { Campo, CampoClave } from "@/components/ui/Campos";
import {
  Aviso,
  BotonEnviar,
  ErrorCampo,
  ESTADO_INICIAL,
} from "@/components/ui/Formulario";
import { Logo } from "@/components/ui/Elementos";
import { Huella } from "@/components/ui/Iconos";

export function FormularioAdmin({
  siguiente,
  error,
}: {
  siguiente?: string;
  error?: string;
}) {
  const [estado, accion] = useActionState(ingresarAdmin, ESTADO_INICIAL);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-petroleo-900 px-5 py-12">
      <div className="absolute inset-0 patron-huellas-claro" aria-hidden="true" />
      <div
        className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-naranja-500/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" aria-label="Ir a la tienda" className="inline-block">
            <Logo variante="blanco" className="mx-auto h-11 w-auto" />
          </Link>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-naranja-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            Panel de administración
          </p>
        </div>

        <div className="rounded-blob bg-white p-8 shadow-elevada md:p-10">
          <h1 className="font-display text-2xl font-semibold text-petroleo-900">
            Entrar al panel
          </h1>
          <p className="mt-2 text-sm text-grafito">
            Solo para el equipo de La Cocina Canina.
          </p>

          <form action={accion} className="mt-7 space-y-5">
            {siguiente ? (
              <input type="hidden" name="siguiente" value={siguiente} />
            ) : null}

            {error === "sin-permiso" && !estado.mensaje ? (
              <Aviso
                estado={{
                  ok: false,
                  mensaje:
                    "Tu cuenta no tiene acceso al panel. Pide a un administrador que te dé de alta.",
                }}
              />
            ) : (
              <Aviso estado={estado} />
            )}

            <div>
              <Campo
                etiqueta="Correo"
                name="correo"
                type="email"
                required
                autoComplete="email"
                placeholder="tucorreo@lacocinacanina.pe"
              />
              <ErrorCampo estado={estado} campo="correo" />
            </div>

            <div>
              <CampoClave
                etiqueta="Contraseña"
                name="clave"
                required
                autoComplete="current-password"
                placeholder="••••••••"
              />
              <ErrorCampo estado={estado} campo="clave" />
            </div>

            <BotonEnviar medida="lg" className="w-full" enviando="Verificando…">
              <LogIn className="h-4 w-4" />
              Entrar
            </BotonEnviar>
          </form>

          <p className="mt-7 border-t border-petroleo-700/10 pt-5 text-center text-xs text-grafito">
            ¿Buscabas tu cuenta de cliente?{" "}
            <Link href="/ingresar" className="font-semibold text-naranja-600 hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-petroleo-100/70">
          <Huella className="h-3.5 w-3.5 text-naranja-400" />
          La Cocina Canina · CMS
        </p>
      </div>
    </div>
  );
}
