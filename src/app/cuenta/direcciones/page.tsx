import type { Metadata } from "next";
import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { direccionesDemo } from "@/data/cuenta";
import { Boton } from "@/components/ui/Boton";
import { Pastilla } from "@/components/ui/Elementos";

export const metadata: Metadata = { title: "Direcciones" };

export default function PaginaDirecciones() {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-petroleo-900">
            Direcciones guardadas
          </h2>
          <p className="mt-1.5 text-sm text-grafito">
            Para que no tengas que escribirlas en cada pedido.
          </p>
        </div>
        <Boton variante="primario" medida="md">
          <Plus className="h-4 w-4" />
          Nueva dirección
        </Boton>
      </div>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {direccionesDemo.map((d) => (
          <li
            key={d.id}
            className="rounded-3xl border border-petroleo-700/10 bg-white p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-crema-100 text-petroleo-700">
                <MapPin className="h-5 w-5" />
              </span>
              {d.predeterminada ? (
                <Pastilla tono="suaveHoja">Predeterminada</Pastilla>
              ) : null}
            </div>

            <h3 className="mt-4 font-display text-lg font-semibold text-petroleo-900">
              {d.alias}
            </h3>
            <p className="mt-1 text-sm text-grafito">{d.linea}</p>
            <p className="text-sm text-grafito">{d.distrito}</p>
            {d.referencia ? (
              <p className="mt-2 text-xs text-grafito">Ref.: {d.referencia}</p>
            ) : null}

            <div className="mt-5 flex gap-2">
              <Boton variante="contorno" medida="sm">
                <Pencil className="h-3.5 w-3.5" />
                Editar
              </Boton>
              <Boton variante="fantasma" medida="sm">
                <Trash2 className="h-3.5 w-3.5" />
                Eliminar
              </Boton>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
