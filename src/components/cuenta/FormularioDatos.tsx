"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import type { Cliente } from "@/server/sesion";
import { guardarPerfil } from "@/server/acciones/clientes";
import { cambiarClave } from "@/server/acciones/auth";
import { Campo, CampoClave, Casilla } from "@/components/ui/Campos";
import {
  Aviso,
  BotonEnviar,
  ErrorCampo,
  ESTADO_INICIAL,
} from "@/components/ui/Formulario";

export function FormularioDatos({ cliente }: { cliente: Cliente }) {
  const [estadoPerfil, accionPerfil] = useActionState(guardarPerfil, ESTADO_INICIAL);
  const [estadoClave, accionClave] = useActionState(cambiarClave, ESTADO_INICIAL);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-petroleo-900">
          Mis datos
        </h2>
        <p className="mt-1.5 text-sm text-grafito">
          Mantén tu información al día para que las entregas lleguen sin contratiempos.
        </p>
      </div>

      <section className="rounded-3xl border border-petroleo-700/10 bg-white p-6 md:p-8">
        <h3 className="font-display text-lg font-semibold text-petroleo-900">
          Datos personales
        </h3>

        <form action={accionPerfil} className="mt-5 space-y-5">
          <Aviso estado={estadoPerfil} />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Campo
                etiqueta="Nombres"
                name="nombres"
                required
                defaultValue={cliente.nombres}
              />
              <ErrorCampo estado={estadoPerfil} campo="nombres" />
            </div>
            <Campo
              etiqueta="Apellidos"
              name="apellidos"
              defaultValue={cliente.apellidos ?? ""}
            />
            <Campo
              etiqueta="Correo electrónico"
              type="email"
              defaultValue={cliente.correo}
              disabled
              ayuda="El correo de acceso no se cambia desde aquí"
            />
            <Campo
              etiqueta="Celular"
              name="celular"
              type="tel"
              defaultValue={cliente.celular ?? ""}
            />
            <Campo
              etiqueta="Fecha de nacimiento"
              name="nacimiento"
              opcional
              type="date"
              defaultValue={cliente.nacimiento ?? ""}
              contenedor="sm:col-span-2"
              ayuda="Te enviamos un cupón el mes de tu cumpleaños"
            />
          </div>

          <Casilla
            name="aceptaNovedades"
            defaultChecked
            etiqueta="Quiero enterarme de campañas de puntos dobles y nuevos productos"
          />

          <BotonEnviar medida="md">
            <Save className="h-4 w-4" />
            Guardar cambios
          </BotonEnviar>
        </form>
      </section>

      <section className="rounded-3xl border border-petroleo-700/10 bg-white p-6 md:p-8">
        <h3 className="font-display text-lg font-semibold text-petroleo-900">
          Contraseña
        </h3>

        <form action={accionClave} className="mt-5 space-y-5">
          <Aviso estado={estadoClave} />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <CampoClave
                etiqueta="Nueva contraseña"
                name="clave"
                required
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
              />
              <ErrorCampo estado={estadoClave} campo="clave" />
            </div>
            <div>
              <CampoClave
                etiqueta="Repite la nueva contraseña"
                name="repetir"
                required
                autoComplete="new-password"
                placeholder="••••••••"
              />
              <ErrorCampo estado={estadoClave} campo="repetir" />
            </div>
          </div>

          <BotonEnviar variante="contorno" medida="md">
            Actualizar contraseña
          </BotonEnviar>
        </form>
      </section>
    </div>
  );
}
