"use client";

import { useActionState, useState } from "react";
import { Plus, Save, Trash2, X } from "lucide-react";
import type { Recompensa, ReglaPuntos } from "@/lib/tipos";
import {
  eliminarRecompensa,
  guardarRecompensa,
  guardarRegla,
} from "@/server/acciones/recompensas";
import { nombreTipoRecompensa } from "@/data/recompensas";
import { AreaTexto, Campo, Casilla, Select } from "@/components/ui/Campos";
import {
  Aviso,
  BotonEnviar,
  ErrorCampo,
  ESTADO_INICIAL,
} from "@/components/ui/Formulario";
import { Panel, Tabla } from "@/components/admin/Piezas";
import { BotonAccion } from "@/components/admin/Controles";
import { Boton } from "@/components/ui/Boton";
import { Pastilla } from "@/components/ui/Elementos";
import { ICONO_RECOMPENSA } from "@/components/recompensas/iconos";
import { precio } from "@/lib/formato";

type Premio = Recompensa & { activa: boolean; valor: number };

const TIPOS = [
  "descuento-fijo",
  "descuento-porcentual",
  "producto-gratis",
  "envio-gratis",
  "cupon",
  "regalo",
];

const ICONOS = ["descuento", "porcentaje", "regalo", "envio", "cupon", "sorpresa"];

/* --------------------------- Regla de acumulación ------------------------- */

export function FormularioRegla({
  regla,
}: {
  regla: ReglaPuntos & { id: string | null };
}) {
  const [estado, accion] = useActionState(guardarRegla, ESTADO_INICIAL);
  const [monto, setMonto] = useState(regla.montoPorPunto);
  const [puntos, setPuntos] = useState(regla.puntosOtorgados);
  const [multiplicador, setMultiplicador] = useState(regla.multiplicador);

  const ejemplo = Math.floor(120 / (monto || 1)) * puntos * multiplicador;

  return (
    <Panel
      titulo="Regla de acumulación"
      descripcion="Define cuántos puntos gana el cliente por su compra"
    >
      <form action={accion} className="space-y-5 p-6">
        {regla.id ? <input type="hidden" name="id" value={regla.id} /> : null}

        <Aviso estado={estado} />

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Campo
              etiqueta="Monto necesario (S/)"
              name="montoPorPunto"
              type="number"
              min={0.5}
              step="0.5"
              required
              defaultValue={regla.montoPorPunto}
              onChange={(e) => setMonto(Number(e.target.value))}
              ayuda="Soles que debe gastar el cliente"
            />
            <ErrorCampo estado={estado} campo="montoPorPunto" />
          </div>
          <div>
            <Campo
              etiqueta="Puntos entregados"
              name="puntosOtorgados"
              type="number"
              min={1}
              required
              defaultValue={regla.puntosOtorgados}
              onChange={(e) => setPuntos(Number(e.target.value))}
              ayuda="Por cada monto alcanzado"
            />
            <ErrorCampo estado={estado} campo="puntosOtorgados" />
          </div>
          <Campo
            etiqueta="Vigencia desde"
            name="vigenciaDesde"
            type="date"
            required
            defaultValue={regla.vigenciaDesde}
          />
          <div>
            <Campo
              etiqueta="Vigencia hasta"
              name="vigenciaHasta"
              type="date"
              required
              defaultValue={regla.vigenciaHasta}
            />
            <ErrorCampo estado={estado} campo="vigenciaHasta" />
          </div>
          <Campo
            etiqueta="Compra mínima (S/)"
            name="compraMinima"
            type="number"
            min={0}
            defaultValue={regla.compraMinima}
            ayuda="0 = sin mínimo"
          />
          <Select
            etiqueta="Multiplicador de puntos"
            name="multiplicador"
            defaultValue={String(regla.multiplicador)}
            onChange={(e) => setMultiplicador(Number(e.target.value))}
          >
            <option value="1">Normal (×1)</option>
            <option value="2">Puntos dobles (×2)</option>
            <option value="3">Puntos triples (×3)</option>
          </Select>
          <Campo
            etiqueta="Nombre de la campaña"
            name="campana"
            opcional
            contenedor="sm:col-span-2"
            defaultValue={regla.campana ?? ""}
            placeholder="Ej. Semana del perro · puntos dobles"
          />
          <Campo
            etiqueta="Los puntos vencen a los (meses)"
            name="venceEnMeses"
            type="number"
            min={1}
            max={60}
            defaultValue={12}
          />
        </div>

        <div className="space-y-3">
          <Casilla
            name="todosLosProductos"
            defaultChecked
            etiqueta="Todos los productos del catálogo acumulan puntos"
          />
          <Casilla
            name="acreditarTrasEntrega"
            defaultChecked
            etiqueta="Acreditar los puntos cuando el pedido pase a «Entregado»"
          />
        </div>

        <div className="rounded-2xl bg-crema-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-grafito">
            Vista previa
          </p>
          <p className="mt-1.5 text-sm text-petroleo-900">
            Por cada <strong>{precio(monto)}</strong> de compra el cliente recibe{" "}
            <strong>
              {puntos * multiplicador} punto{puntos * multiplicador === 1 ? "" : "s"}
            </strong>
            . Una compra de {precio(120)} genera <strong>{ejemplo} puntos</strong>.
          </p>
        </div>

        <BotonEnviar medida="md">
          <Save className="h-4 w-4" />
          Guardar regla
        </BotonEnviar>
      </form>
    </Panel>
  );
}

/* --------------------------- Catálogo de premios -------------------------- */

export function PanelRecompensas({ recompensas }: { recompensas: Premio[] }) {
  const [estado, accion] = useActionState(guardarRecompensa, ESTADO_INICIAL);
  const [editando, setEditando] = useState<Premio | null>(null);
  const [creando, setCreando] = useState(false);

  const abierto = creando || editando !== null;

  return (
    <Panel
      titulo="Catálogo de recompensas"
      descripcion="Lo que el cliente puede canjear con sus puntos"
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
            Nueva recompensa
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
          {editando ? <input type="hidden" name="id" value={editando.id} /> : null}

          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-semibold text-petroleo-900">
              {editando ? `Editar «${editando.nombre}»` : "Nueva recompensa"}
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

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Campo
                etiqueta="Nombre"
                name="nombre"
                required
                defaultValue={editando?.nombre}
                placeholder="Descuento de S/ 10"
              />
              <ErrorCampo estado={estado} campo="nombre" />
            </div>
            <div>
              <Campo
                etiqueta="Puntos necesarios"
                name="puntos"
                type="number"
                min={1}
                required
                defaultValue={editando?.puntos ?? 100}
              />
              <ErrorCampo estado={estado} campo="puntos" />
            </div>
            <AreaTexto
              etiqueta="Descripción"
              name="descripcion"
              rows={2}
              contenedor="sm:col-span-2"
              defaultValue={editando?.descripcion}
            />
            <Select
              etiqueta="Tipo"
              name="tipo"
              defaultValue={editando?.tipo ?? "descuento-fijo"}
            >
              {TIPOS.map((t) => (
                <option key={t} value={t}>
                  {nombreTipoRecompensa[t] ?? t}
                </option>
              ))}
            </Select>
            <Campo
              etiqueta="Valor"
              name="valor"
              type="number"
              min={0}
              step="0.5"
              defaultValue={editando?.valor ?? 0}
              ayuda="Soles o porcentaje según el tipo"
            />
            <Select
              etiqueta="Icono"
              name="icono"
              defaultValue={editando?.icono ?? "regalo"}
            >
              {ICONOS.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </Select>
          </div>

          <Casilla
            name="activa"
            defaultChecked={editando?.activa ?? true}
            etiqueta="Visible en el catálogo de canje"
          />

          <BotonEnviar medida="md">
            {editando ? "Guardar recompensa" : "Crear recompensa"}
          </BotonEnviar>
        </form>
      ) : null}

      {recompensas.length === 0 ? (
        <p className="p-8 text-center text-sm text-grafito">
          Todavía no hay recompensas configuradas.
        </p>
      ) : (
        <Tabla columnas={["Recompensa", "Tipo", "Puntos", "Valor", "Estado", ""]}>
          {recompensas.map((r) => {
            const Icono = ICONO_RECOMPENSA[r.icono];
            return (
              <tr key={r.id} className="transition-colors hover:bg-crema-50">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-naranja-50 text-naranja-600">
                      <Icono className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block font-semibold text-petroleo-900">
                        {r.nombre}
                      </span>
                      <span className="block text-xs text-grafito">
                        {r.descripcion}
                      </span>
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <Pastilla tono="contorno">
                    {nombreTipoRecompensa[r.tipo] ?? r.tipo}
                  </Pastilla>
                </td>
                <td className="px-5 py-3.5 font-semibold tabular-nums text-petroleo-900">
                  {r.puntos}
                </td>
                <td className="px-5 py-3.5 tabular-nums text-grafito">
                  {r.tipo === "descuento-porcentual" ? `${r.valor}%` : precio(r.valor)}
                </td>
                <td className="px-5 py-3.5">
                  <Pastilla tono={r.activa ? "suaveHoja" : "crema"}>
                    {r.activa ? "Activa" : "Oculta"}
                  </Pastilla>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCreando(false);
                        setEditando(r);
                      }}
                      className="text-xs font-semibold text-naranja-600 hover:underline"
                    >
                      Editar
                    </button>
                    <BotonAccion
                      etiqueta={`Eliminar ${r.nombre}`}
                      confirmar={`¿Eliminar la recompensa «${r.nombre}»?`}
                      accion={() => eliminarRecompensa(r.id)}
                      className="grid h-7 w-7 place-items-center rounded-lg text-grafito transition-colors hover:bg-coral-100 hover:text-coral-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </BotonAccion>
                  </div>
                </td>
              </tr>
            );
          })}
        </Tabla>
      )}
    </Panel>
  );
}
