"use client";

import { useActionState, useState } from "react";
import { MapPin, Plus, Trash2, X } from "lucide-react";
import type { Direccion } from "@/lib/tipos";
import { eliminarDireccion, guardarDireccion } from "@/server/acciones/clientes";
import { AreaTexto, Campo, Casilla } from "@/components/ui/Campos";
import {
  Aviso,
  BotonEnviar,
  ErrorCampo,
  ESTADO_INICIAL,
} from "@/components/ui/Formulario";
import { Boton } from "@/components/ui/Boton";
import { Pastilla } from "@/components/ui/Elementos";
import { BotonAccion } from "@/components/admin/Controles";

export function PanelDirecciones({ direcciones }: { direcciones: Direccion[] }) {
  const [estado, accion] = useActionState(guardarDireccion, ESTADO_INICIAL);
  const [editando, setEditando] = useState<Direccion | null>(null);
  const [creando, setCreando] = useState(false);

  const abierto = creando || editando !== null;

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
        {!abierto ? (
          <Boton
            variante="primario"
            medida="md"
            onClick={() => {
              setEditando(null);
              setCreando(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Nueva dirección
          </Boton>
        ) : null}
      </div>

      {abierto ? (
        <form
          action={accion}
          key={editando?.id ?? "nueva"}
          className="mt-6 space-y-5 rounded-3xl border border-petroleo-700/10 bg-white p-6"
        >
          {editando ? <input type="hidden" name="id" value={editando.id} /> : null}

          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-petroleo-900">
              {editando ? `Editar «${editando.alias}»` : "Nueva dirección"}
            </h3>
            <button
              type="button"
              onClick={() => {
                setEditando(null);
                setCreando(false);
              }}
              aria-label="Cancelar"
              className="grid h-8 w-8 place-items-center rounded-full text-grafito hover:bg-crema-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <Aviso estado={estado} />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Campo
                etiqueta="Alias"
                name="alias"
                required
                defaultValue={editando?.alias}
                placeholder="Casa"
              />
              <ErrorCampo estado={estado} campo="alias" />
            </div>
            <div>
              <Campo
                etiqueta="Distrito"
                name="distrito"
                required
                defaultValue={editando?.distrito}
                placeholder="Lince"
              />
              <ErrorCampo estado={estado} campo="distrito" />
            </div>
            <div className="sm:col-span-2">
              <Campo
                etiqueta="Dirección"
                name="linea"
                required
                defaultValue={editando?.linea}
                placeholder="Av. Arequipa 2450, dpto. 502"
              />
              <ErrorCampo estado={estado} campo="linea" />
            </div>
            <AreaTexto
              etiqueta="Referencia"
              name="referencia"
              rows={2}
              contenedor="sm:col-span-2"
              defaultValue={editando?.referencia}
              placeholder="Edificio blanco, frente al parque"
            />
          </div>

          <Casilla
            name="predeterminada"
            defaultChecked={editando?.predeterminada ?? direcciones.length === 0}
            etiqueta="Usar como dirección predeterminada"
          />

          <BotonEnviar medida="md">
            {editando ? "Guardar dirección" : "Agregar dirección"}
          </BotonEnviar>
        </form>
      ) : null}

      {direcciones.length === 0 && !abierto ? (
        <p className="mt-6 rounded-3xl border border-petroleo-700/10 bg-white p-10 text-center text-sm text-grafito">
          Todavía no guardaste ninguna dirección.
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {direcciones.map((d) => (
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
                <Boton
                  variante="contorno"
                  medida="sm"
                  onClick={() => {
                    setCreando(false);
                    setEditando(d);
                  }}
                >
                  Editar
                </Boton>
                <BotonAccion
                  etiqueta={`Eliminar ${d.alias}`}
                  confirmar={`¿Eliminar la dirección «${d.alias}»?`}
                  accion={() => eliminarDireccion(d.id)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-grafito transition-colors hover:text-coral-500"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Eliminar
                </BotonAccion>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
