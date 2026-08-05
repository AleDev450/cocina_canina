import type { Metadata } from "next";
import { Calendar, Download } from "lucide-react";
import { productos, stockTotal } from "@/data/productos";
import { recompensas, historialPuntos } from "@/data/recompensas";
import { CabeceraModulo, BarraDato, Metrica, Panel, Tabla } from "@/components/admin/Piezas";
import { Boton } from "@/components/ui/Boton";
import { Pastilla } from "@/components/ui/Elementos";
import { precio } from "@/lib/formato";
import { Coins, Package, ShoppingCart, Users } from "lucide-react";

export const metadata: Metadata = { title: "Reportes" };

const VENTAS_MES = [
  { mes: "Feb", monto: 3820 },
  { mes: "Mar", monto: 4460 },
  { mes: "Abr", monto: 4120 },
  { mes: "May", monto: 5240 },
  { mes: "Jun", monto: 6180 },
  { mes: "Jul", monto: 7340 },
];

const CLIENTES_FRECUENTES = [
  { nombre: "Claudia Rivas", pedidos: 11, monto: 1480 },
  { nombre: "Diego Paredes", pedidos: 7, monto: 612 },
  { nombre: "Valeria Ochoa", pedidos: 5, monto: 398 },
  { nombre: "Andrea Salazar", pedidos: 4, monto: 900 },
  { nombre: "Renzo Camacho", pedidos: 3, monto: 214 },
];

const CANJES = [
  { recompensa: "Envío gratis", veces: 34 },
  { recompensa: "Descuento de S/ 10", veces: 21 },
  { recompensa: "Oreja de cerdo gratis", veces: 18 },
  { recompensa: "15% de descuento", veces: 7 },
  { recompensa: "Bolsa sorpresa Cocina Canina", veces: 3 },
];

export default function AdminReportes() {
  const maxMes = Math.max(...VENTAS_MES.map((v) => v.monto));
  const totalSemestre = VENTAS_MES.reduce((t, v) => t + v.monto, 0);

  const masVendidos = [...productos].sort((a, b) => b.ventas - a.ventas).slice(0, 8);
  const bajoStock = productos
    .map((p) => ({ p, stock: stockTotal(p) }))
    .filter((x) => x.stock <= 20)
    .sort((a, b) => a.stock - b.stock);

  const otorgados = historialPuntos
    .filter((m) => m.puntos > 0 && m.estado !== "cancelado")
    .reduce((t, m) => t + m.puntos, 0);
  const canjeados = historialPuntos
    .filter((m) => m.estado === "canjeado")
    .reduce((t, m) => t + Math.abs(m.puntos), 0);

  return (
    <>
      <CabeceraModulo
        titulo="Reportes"
        texto="Ventas, productos, clientes y programa de puntos."
        acciones={
          <>
            <Boton variante="contorno" medida="sm">
              <Calendar className="h-3.5 w-3.5" />
              Últimos 6 meses
            </Boton>
            <Boton variante="primario" medida="sm">
              <Download className="h-3.5 w-3.5" />
              Exportar
            </Boton>
          </>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metrica
          etiqueta="Ventas del semestre"
          valor={precio(totalSemestre)}
          variacion={19}
          icono={Coins}
        />
        <Metrica etiqueta="Ventas minoristas" valor={precio(24280)} variacion={14} icono={ShoppingCart} />
        <Metrica etiqueta="Ventas por mayor" valor={precio(6880)} variacion={31} icono={Package} />
        <Metrica etiqueta="Ticket promedio" valor={precio(186)} variacion={5} icono={Users} />
      </div>

      {/* Ventas por mes */}
      <Panel titulo="Ventas por mes" descripcion="Últimos 6 meses" className="mb-6">
        <div className="p-6">
          <div className="flex h-56 items-end gap-3">
            {VENTAS_MES.map((v) => (
              <div key={v.mes} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[0.68rem] font-semibold tabular-nums text-grafito">
                  {precio(v.monto)}
                </span>
                <div
                  className="w-full rounded-t-xl bg-gradient-to-t from-naranja-600 to-naranja-400 transition-all duration-700"
                  style={{ height: `${(v.monto / maxMes) * 100}%` }}
                />
                <span className="text-xs font-semibold text-petroleo-800">{v.mes}</span>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel titulo="Productos más vendidos">
          <ul className="space-y-4 p-6">
            {masVendidos.map((p) => (
              <BarraDato
                key={p.slug}
                etiqueta={p.nombre}
                valor={p.ventas}
                maximo={masVendidos[0].ventas}
                tono="petroleo"
              />
            ))}
          </ul>
        </Panel>

        <Panel titulo="Clientes frecuentes">
          <Tabla columnas={["Cliente", "Pedidos", "Total gastado"]}>
            {CLIENTES_FRECUENTES.map((c) => (
              <tr key={c.nombre} className="transition-colors hover:bg-crema-50">
                <td className="px-5 py-3.5 font-semibold text-petroleo-900">{c.nombre}</td>
                <td className="px-5 py-3.5 tabular-nums text-grafito">{c.pedidos}</td>
                <td className="px-5 py-3.5 font-semibold tabular-nums text-petroleo-900">
                  {precio(c.monto)}
                </td>
              </tr>
            ))}
          </Tabla>
        </Panel>

        <Panel titulo="Programa de puntos">
          <div className="grid gap-3 p-6 sm:grid-cols-3">
            <div className="rounded-2xl bg-crema-50 p-4 text-center">
              <p className="font-display text-3xl font-semibold text-petroleo-900">
                {otorgados}
              </p>
              <p className="text-xs text-grafito">Puntos otorgados</p>
            </div>
            <div className="rounded-2xl bg-crema-50 p-4 text-center">
              <p className="font-display text-3xl font-semibold text-petroleo-900">
                {canjeados}
              </p>
              <p className="text-xs text-grafito">Puntos canjeados</p>
            </div>
            <div className="rounded-2xl bg-crema-50 p-4 text-center">
              <p className="font-display text-3xl font-semibold text-petroleo-900">
                {Math.round((canjeados / otorgados) * 100)}%
              </p>
              <p className="text-xs text-grafito">Tasa de canje</p>
            </div>
          </div>

          <div className="border-t border-petroleo-700/10 p-6">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.08em] text-petroleo-800">
              Recompensas más utilizadas
            </h3>
            <ul className="space-y-4">
              {CANJES.map((c) => (
                <BarraDato
                  key={c.recompensa}
                  etiqueta={c.recompensa}
                  valor={c.veces}
                  maximo={CANJES[0].veces}
                  tono="hoja"
                />
              ))}
            </ul>
            <p className="mt-4 text-xs text-grafito">
              {recompensas.length} recompensas configuradas en el catálogo.
            </p>
          </div>
        </Panel>

        <Panel titulo="Productos con poco stock" descripcion="20 unidades o menos">
          <Tabla columnas={["Producto", "Stock total", "Estado"]}>
            {bajoStock.map(({ p, stock }) => (
              <tr key={p.slug} className="transition-colors hover:bg-crema-50">
                <td className="px-5 py-3.5 font-semibold text-petroleo-900">{p.nombre}</td>
                <td className="px-5 py-3.5 tabular-nums text-grafito">{stock}</td>
                <td className="px-5 py-3.5">
                  <Pastilla tono={stock <= 10 ? "suaveCoral" : "suaveAmbar"}>
                    {stock <= 10 ? "Crítico" : "Reponer pronto"}
                  </Pastilla>
                </td>
              </tr>
            ))}
          </Tabla>
        </Panel>
      </div>
    </>
  );
}
