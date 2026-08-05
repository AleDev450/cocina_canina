import type { Metadata } from "next";
import { Save } from "lucide-react";
import { clienteDemo } from "@/data/cuenta";
import { Boton } from "@/components/ui/Boton";
import { Campo, CampoClave, Casilla } from "@/components/ui/Campos";

export const metadata: Metadata = { title: "Mis datos" };

export default function PaginaDatos() {
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
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Campo etiqueta="Nombres" defaultValue={clienteDemo.nombres} />
          <Campo etiqueta="Apellidos" defaultValue={clienteDemo.apellidos} />
          <Campo etiqueta="Correo electrónico" type="email" defaultValue={clienteDemo.correo} />
          <Campo etiqueta="Celular" type="tel" defaultValue={clienteDemo.celular} />
          <Campo
            etiqueta="Fecha de nacimiento"
            opcional
            type="date"
            defaultValue={clienteDemo.nacimiento}
            contenedor="sm:col-span-2"
            ayuda="Te enviamos un cupón el mes de tu cumpleaños"
          />
        </div>
        <Boton variante="primario" medida="md" className="mt-6">
          <Save className="h-4 w-4" />
          Guardar cambios
        </Boton>
      </section>

      <section className="rounded-3xl border border-petroleo-700/10 bg-white p-6 md:p-8">
        <h3 className="font-display text-lg font-semibold text-petroleo-900">
          Contraseña
        </h3>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <CampoClave etiqueta="Contraseña actual" placeholder="••••••••" />
          <span className="hidden sm:block" />
          <CampoClave etiqueta="Nueva contraseña" placeholder="Mínimo 8 caracteres" />
          <CampoClave etiqueta="Repite la nueva contraseña" placeholder="••••••••" />
        </div>
        <Boton variante="contorno" medida="md" className="mt-6">
          Actualizar contraseña
        </Boton>
      </section>

      <section className="rounded-3xl border border-petroleo-700/10 bg-white p-6 md:p-8">
        <h3 className="font-display text-lg font-semibold text-petroleo-900">
          Notificaciones
        </h3>
        <div className="mt-5 space-y-4">
          <Casilla
            defaultChecked
            etiqueta="Avísame por WhatsApp sobre el estado de mis pedidos"
          />
          <Casilla
            defaultChecked
            etiqueta="Quiero enterarme de campañas de puntos dobles y nuevos productos"
          />
          <Casilla etiqueta="Enviarme el recordatorio de reposición de BARF" />
        </div>
        <Boton variante="primario" medida="md" className="mt-6">
          <Save className="h-4 w-4" />
          Guardar preferencias
        </Boton>
      </section>
    </div>
  );
}
