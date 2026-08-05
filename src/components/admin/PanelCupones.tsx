"use client";

import { useActionState, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import {
  alternarCupon,
  eliminarCupon,
  guardarCupon,
} from "@/server/acciones/recompensas";
import { nombreTipoRecompensa } from "@/data/recompensas";
import { fechaCorta, precio } from "@/lib/formato";
import { AreaTexto, Campo, Casilla, Select } from "@/components/ui/Campos";
import {
  Aviso,
  BotonEnviar,
  ErrorCampo,
  ESTADO_INICIAL,
} from "@/components/ui/Formulario";
import { Panel, Tabla } from "@/components/admin/Piezas";
import { BotonAccion, Interruptor } from "@/components/admin/Controles";
import { Boton } from "@/components/ui/Boton";
import { Pastilla } from "@/components/ui/Elementos";

export interface CuponAdmin {
  id: string;
  codigo: string;
  descripcion: string;
  tipo: string;
  valor: number;
  compraMinima: number;
  usosMaximos: number | null;
  usos: number;
  vence: string;
  activo: boolean;
}

const TIPOS = [
  "descuento-fijo",
  "descuento-porcentual",
  "producto-gratis",
  "envio-gratis",
  "cupon",
  "regalo",
];

export function PanelCupones({ cupones }: { cupones: CuponAdmin[] }) {
  const [estado, accion] = useActionState(guardarCupon, ESTADO_INICIAL);
  const [editando, setEditando] = useState<CuponAdmin | null>(null);
  const [creando, setCreando] = useState(false);

  const abierto = creando || editando !== null;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr] xl:items-start">
      <Panel
        titulo="Cupones creados"
        acciones={
          !abierto ? (
            <Boton variante="primario" medida="sm" onClick={() => setCreando(true)}>
              <Plus className="h-3.5 w-3.5" />
              Nuevo cupón
            </Boton>
          ) : null
        }
      >
        {cupones.length === 0 ? (
          <p className="p-8 text-center text-sm text-grafito">
            Todavía no hay cupones. Crea el primero con el formulario de al lado.
          </p>
        ) : (
          <Tabla
            columnas={["Código", "Tipo", "Valor", "Usos", "Vence", "Activo", ""]}
          >
            {cupones.map((c) => (
              <tr key={c.id} className="transition-colors hover:bg-crema-50">
                <td className="px-5 py-3.5">
                  <span className="block font-display text-base font-bold text-petroleo-900">
                    {c.codigo}
                  </span>
                  <span className="block text-xs text-grafito">{c.descripcion}</span>
                </td>
                <td className="px-5 py-3.5">
                  <Pastilla tono="contorno">
                    {nombreTipoRecompensa[c.tipo] ?? c.tipo}
                  </Pastilla>
                </td>
                <td className="px-5 py-3.5 tabular-nums text-grafito">
                  {c.tipo === "descuento-porcentual" ? `${c.valor}%` : precio(c.valor)}
                </td>
                <td className="px-5 py-3.5 tabular-nums text-grafito">
                  {c.usos}
                  {c.usosMaximos ? ` / ${c.usosMaximos}` : ""}
                </td>
                <td className="px-5 py-3.5 text-grafito">
                  {c.vence ? fechaCorta(c.vence) : "Sin vencimiento"}
                </td>
                <td className="px-5 py-3.5">
                  <Interruptor
                    activo={c.activo}
                    etiqueta={`Activar o desactivar ${c.codigo}`}
                    alCambiar={(valor) => alternarCupon(c.id, valor)}
                    tamano="sm"
                  />
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCreando(false);
                        setEditando(c);
                      }}
                      className="text-xs font-semibold text-naranja-600 hover:underline"
                    >
                      Editar
                    </button>
                    <BotonAccion
                      etiqueta={`Eliminar ${c.codigo}`}
                      confirmar={`¿Eliminar el cupón ${c.codigo}?`}
                      accion={() => eliminarCupon(c.id)}
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

      <Panel
        titulo={editando ? `Editar ${editando.codigo}` : "Crear cupón"}
        acciones={
          editando ? (
            <button
              type="button"
              onClick={() => setEditando(null)}
              aria-label="Cancelar edición"
              className="grid h-8 w-8 place-items-center rounded-full text-grafito hover:bg-crema-100"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null
        }
      >
        <form action={accion} key={editando?.id ?? "nuevo"} className="space-y-5 p-6">
          {editando ? <input type="hidden" name="id" value={editando.id} /> : null}

          <Aviso estado={estado} />

          <div>
            <Campo
              etiqueta="Código"
              name="codigo"
              required
              defaultValue={editando?.codigo}
              placeholder="VERANO25"
              className="uppercase"
            />
            <ErrorCampo estado={estado} campo="codigo" />
          </div>

          <AreaTexto
            etiqueta="Descripción"
            name="descripcion"
            rows={2}
            defaultValue={editando?.descripcion}
            placeholder="25% en snacks de dureza media"
          />

          <Select etiqueta="Tipo" name="tipo" defaultValue={editando?.tipo ?? "descuento-fijo"}>
            {TIPOS.map((t) => (
              <option key={t} value={t}>
                {nombreTipoRecompensa[t] ?? t}
              </option>
            ))}
          </Select>

          <div className="grid gap-5 sm:grid-cols-2">
            <Campo
              etiqueta="Valor"
              name="valor"
              type="number"
              min={0}
              step="0.5"
              required
              defaultValue={editando?.valor ?? 10}
              ayuda="Soles o porcentaje"
            />
            <Campo
              etiqueta="Compra mínima (S/)"
              name="compraMinima"
              type="number"
              min={0}
              defaultValue={editando?.compraMinima ?? 0}
            />
            <Campo
              etiqueta="Usos máximos"
              name="usosMaximos"
              opcional
              type="number"
              min={1}
              defaultValue={editando?.usosMaximos ?? ""}
              ayuda="Vacío = sin límite"
            />
            <Campo
              etiqueta="Vence el"
              name="vence"
              opcional
              type="date"
              defaultValue={editando?.vence}
            />
          </div>

          <Casilla name="activo" defaultChecked={editando?.activo ?? true} etiqueta="Activo" />

          <BotonEnviar medida="md" className="w-full">
            {editando ? "Guardar cupón" : "Crear cupón"}
          </BotonEnviar>
        </form>
      </Panel>
    </div>
  );
}
