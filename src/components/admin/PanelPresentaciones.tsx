"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { guardarPresentacion, eliminarPresentacion } from "@/server/acciones/catalogo";
import { precio } from "@/lib/formato";
import { Campo, Select } from "@/components/ui/Campos";
import {
  Aviso,
  BotonEnviar,
  ErrorCampo,
  ESTADO_INICIAL,
} from "@/components/ui/Formulario";
import { Panel, Tabla } from "@/components/admin/Piezas";
import { BotonAccion } from "@/components/admin/Controles";
import { Boton } from "@/components/ui/Boton";

interface Presentacion {
  id: string;
  codigo: string;
  etiqueta: string;
  tipo: string;
  precio: number;
  stock: number;
}

const TIPOS = [
  { id: "gramos", nombre: "Por gramos" },
  { id: "unidades", nombre: "Por unidades" },
  { id: "kilogramos", nombre: "Por kilogramo" },
  { id: "talla", nombre: "Por talla" },
];

export function PanelPresentaciones({
  productoId,
  presentaciones,
}: {
  productoId: string;
  presentaciones: Presentacion[];
}) {
  const [estado, accion] = useActionState(guardarPresentacion, ESTADO_INICIAL);
  const [editando, setEditando] = useState<Presentacion | null>(null);
  const [creando, setCreando] = useState(false);

  const abierto = creando || editando !== null;

  return (
    <Panel
      titulo="Presentaciones"
      descripcion="Formatos de venta, precio y stock de este producto"
      acciones={
        !abierto ? (
          <Boton
            variante="primario"
            medida="sm"
            onClick={() => {
              setEditando(null);
              setCreando(true);
            }}
          >
            <Plus className="h-3.5 w-3.5" />
            Agregar
          </Boton>
        ) : null
      }
    >
      {abierto ? (
        <form
          action={accion}
          key={editando?.id ?? "nueva"}
          className="space-y-5 border-b border-petroleo-700/10 bg-crema-50 p-6"
        >
          <input type="hidden" name="productoId" value={productoId} />
          {editando ? <input type="hidden" name="id" value={editando.id} /> : null}

          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-semibold text-petroleo-900">
              {editando ? `Editar «${editando.etiqueta}»` : "Nueva presentación"}
            </h3>
            <button
              type="button"
              onClick={() => {
                setEditando(null);
                setCreando(false);
              }}
              aria-label="Cancelar"
              className="grid h-8 w-8 place-items-center rounded-full text-grafito hover:bg-crema-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <Aviso estado={estado} />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2">
              <Campo
                etiqueta="Etiqueta"
                name="etiqueta"
                required
                defaultValue={editando?.etiqueta}
                placeholder="150 gramos"
              />
              <ErrorCampo estado={estado} campo="etiqueta" />
            </div>
            <Select
              etiqueta="Tipo"
              name="tipo"
              defaultValue={editando?.tipo ?? "gramos"}
            >
              {TIPOS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </Select>
            <Campo
              etiqueta="Código"
              name="codigo"
              opcional
              defaultValue={editando?.codigo}
              placeholder="150g"
            />
            <div>
              <Campo
                etiqueta="Precio (S/)"
                name="precio"
                type="number"
                min={0}
                step="0.5"
                required
                defaultValue={editando?.precio}
              />
              <ErrorCampo estado={estado} campo="precio" />
            </div>
            <div>
              <Campo
                etiqueta="Stock"
                name="stock"
                type="number"
                min={0}
                required
                defaultValue={editando?.stock ?? 0}
              />
              <ErrorCampo estado={estado} campo="stock" />
            </div>
          </div>

          <BotonEnviar medida="md">
            {editando ? "Guardar presentación" : "Agregar presentación"}
          </BotonEnviar>
        </form>
      ) : null}

      {presentaciones.length === 0 ? (
        <p className="p-6 text-sm text-grafito">
          Todavía no hay presentaciones. Agrega al menos una para que el producto se
          pueda comprar.
        </p>
      ) : (
        <Tabla columnas={["Etiqueta", "Código", "Tipo", "Precio", "Stock", ""]}>
          {presentaciones.map((v) => (
            <tr key={v.id} className="transition-colors hover:bg-crema-50">
              <td className="px-5 py-3 font-semibold text-petroleo-900">{v.etiqueta}</td>
              <td className="px-5 py-3 text-xs text-grafito">{v.codigo}</td>
              <td className="px-5 py-3 text-grafito">
                {TIPOS.find((t) => t.id === v.tipo)?.nombre ?? v.tipo}
              </td>
              <td className="px-5 py-3 font-semibold tabular-nums text-petroleo-900">
                {precio(v.precio)}
              </td>
              <td className="px-5 py-3 tabular-nums text-grafito">{v.stock}</td>
              <td className="px-5 py-3">
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCreando(false);
                      setEditando(v);
                    }}
                    className="text-xs font-semibold text-naranja-600 hover:underline"
                  >
                    Editar
                  </button>
                  <BotonAccion
                    etiqueta={`Eliminar ${v.etiqueta}`}
                    confirmar={`¿Eliminar la presentación «${v.etiqueta}»?`}
                    accion={() => eliminarPresentacion(v.id)}
                    className="grid h-7 w-7 place-items-center rounded-lg text-grafito transition-colors hover:bg-coral-100 hover:text-coral-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </BotonAccion>
                </div>
              </td>
            </tr>
          ))}
        </Tabla>
      )}
    </Panel>
  );
}
