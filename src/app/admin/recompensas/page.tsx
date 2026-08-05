import type { Metadata } from "next";
import { Plus, Save } from "lucide-react";
import {
  recompensas,
  reglaPuntos,
  nombreTipoRecompensa,
  historialPuntos,
  nombreEstadoPuntos,
} from "@/data/recompensas";
import { productos } from "@/data/productos";
import { CabeceraModulo, Panel, Tabla } from "@/components/admin/Piezas";
import { ICONO_RECOMPENSA } from "@/components/recompensas/iconos";
import { Boton } from "@/components/ui/Boton";
import { Campo, Casilla, Select } from "@/components/ui/Campos";
import { Pastilla } from "@/components/ui/Elementos";

export const metadata: Metadata = { title: "Programa de recompensas" };

export default function AdminRecompensas() {
  const totales = (["pendiente", "disponible", "canjeado", "vencido", "cancelado"] as const).map(
    (estado) => ({
      estado,
      total: historialPuntos
        .filter((m) => m.estado === estado)
        .reduce((t, m) => t + Math.abs(m.puntos), 0),
    }),
  );

  return (
    <>
      <CabeceraModulo
        titulo="Programa de recompensas"
        texto="Configura la equivalencia de puntos, las campañas y el catálogo de canje del Club Cocina Canina."
        acciones={
          <Boton variante="primario" medida="sm">
            <Save className="h-3.5 w-3.5" />
            Guardar cambios
          </Boton>
        }
      />

      {/* Estados de puntos */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {totales.map((t) => (
          <div
            key={t.estado}
            className="rounded-2xl border border-petroleo-700/10 bg-white p-4"
          >
            <p className="font-display text-2xl font-semibold text-petroleo-900">
              {t.total}
            </p>
            <p className="mt-0.5 text-[0.68rem] font-semibold uppercase tracking-wide text-grafito">
              {nombreEstadoPuntos[t.estado]}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {/* Regla de acumulación */}
        <Panel
          titulo="Regla de acumulación"
          descripcion="Define cuántos puntos gana el cliente por su compra"
        >
          <div className="space-y-5 p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <Campo
                etiqueta="Monto necesario (S/)"
                type="number"
                min={1}
                step="0.5"
                defaultValue={reglaPuntos.montoPorPunto}
                ayuda="Soles que debe gastar el cliente"
              />
              <Campo
                etiqueta="Puntos entregados"
                type="number"
                min={1}
                defaultValue={reglaPuntos.puntosOtorgados}
                ayuda="Por cada monto alcanzado"
              />
              <Campo
                etiqueta="Vigencia desde"
                type="date"
                defaultValue={reglaPuntos.vigenciaDesde}
              />
              <Campo
                etiqueta="Vigencia hasta"
                type="date"
                defaultValue={reglaPuntos.vigenciaHasta}
              />
              <Campo
                etiqueta="Compra mínima (S/)"
                type="number"
                min={0}
                defaultValue={reglaPuntos.compraMinima}
                ayuda="0 = sin mínimo"
              />
              <Select etiqueta="Multiplicador de puntos" defaultValue="1">
                <option value="1">Normal (×1)</option>
                <option value="2">Puntos dobles (×2)</option>
                <option value="3">Puntos triples (×3)</option>
              </Select>
            </div>

            <Campo
              etiqueta="Nombre de la campaña"
              opcional
              placeholder="Ej. Semana del perro · puntos dobles"
              defaultValue={reglaPuntos.campana ?? ""}
            />

            <div className="rounded-2xl bg-crema-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-grafito">
                Vista previa de la regla
              </p>
              <p className="mt-1.5 text-sm text-petroleo-900">
                Por cada{" "}
                <strong>S/ {reglaPuntos.montoPorPunto.toFixed(2)}</strong> de compra, el
                cliente recibe <strong>{reglaPuntos.puntosOtorgados} punto</strong>. Una
                compra de S/ 120.00 genera{" "}
                <strong>
                  {Math.floor(120 / reglaPuntos.montoPorPunto) * reglaPuntos.puntosOtorgados}{" "}
                  puntos
                </strong>
                .
              </p>
            </div>
          </div>
        </Panel>

        {/* Productos participantes */}
        <Panel
          titulo="Productos participantes"
          descripcion="Limita la acumulación a ciertos productos si lo necesitas"
        >
          <div className="p-6">
            <Casilla defaultChecked etiqueta="Todos los productos del catálogo acumulan puntos" />

            <div className="mt-5 max-h-72 space-y-1.5 overflow-y-auto rounded-2xl border border-petroleo-700/10 p-3">
              {productos.slice(0, 12).map((p) => (
                <Casilla key={p.slug} defaultChecked etiqueta={p.nombre} />
              ))}
              <p className="px-1 pt-2 text-xs text-grafito">
                … y {productos.length - 12} productos más
              </p>
            </div>

            <div className="mt-5 space-y-3">
              <Casilla
                defaultChecked
                etiqueta="Acreditar los puntos 48 h después de la entrega"
              />
              <Casilla
                defaultChecked
                etiqueta="Vencer los puntos a los 12 meses de acreditados"
              />
              <Casilla etiqueta="Permitir acumular con pedidos hechos por WhatsApp" />
            </div>
          </div>
        </Panel>
      </div>

      {/* Catálogo de recompensas */}
      <Panel
        titulo="Catálogo de recompensas"
        descripcion="Lo que el cliente puede canjear con sus puntos"
        className="mt-6"
        acciones={
          <Boton variante="primario" medida="sm">
            <Plus className="h-3.5 w-3.5" />
            Nueva recompensa
          </Boton>
        }
      >
        <Tabla columnas={["Recompensa", "Tipo", "Puntos", "Estado", ""]}>
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
                      <span className="block text-xs text-grafito">{r.descripcion}</span>
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <Pastilla tono="contorno">{nombreTipoRecompensa[r.tipo]}</Pastilla>
                </td>
                <td className="px-5 py-3.5 font-semibold tabular-nums text-petroleo-900">
                  {r.puntos}
                </td>
                <td className="px-5 py-3.5">
                  <Pastilla tono="suaveHoja">Activa</Pastilla>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    type="button"
                    className="text-xs font-semibold text-naranja-600 hover:underline"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            );
          })}
        </Tabla>

        <div className="border-t border-petroleo-700/10 px-6 py-4">
          <p className="text-xs text-grafito">
            Tipos disponibles: descuento fijo, descuento porcentual, producto gratis,
            envío gratis, cupón especial y regalo sorpresa.
          </p>
        </div>
      </Panel>
    </>
  );
}
