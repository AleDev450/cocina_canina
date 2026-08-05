import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  Coins,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";
import { productos, precioDesde, stockTotal } from "@/data/productos";
import { pedidosDemo, nombreEstadoPedido } from "@/data/cuenta";
import { historialPuntos } from "@/data/recompensas";
import { BarraDato, CabeceraModulo, Metrica, Panel, Tabla } from "@/components/admin/Piezas";
import { EtiquetaEstado } from "@/components/cuenta/Piezas";
import { fechaCorta, precio } from "@/lib/formato";

export const metadata: Metadata = { title: "Dashboard" };

/** Serie de ventas de los últimos 7 días (demostración). */
const VENTAS_SEMANA = [
  { dia: "Lun", monto: 420 },
  { dia: "Mar", monto: 610 },
  { dia: "Mié", monto: 385 },
  { dia: "Jue", monto: 740 },
  { dia: "Vie", monto: 980 },
  { dia: "Sáb", monto: 1240 },
  { dia: "Dom", monto: 560 },
];

export default function DashboardAdmin() {
  const totalSemana = VENTAS_SEMANA.reduce((t, d) => t + d.monto, 0);
  const maxDia = Math.max(...VENTAS_SEMANA.map((d) => d.monto));
  const ticket = Math.round(totalSemana / 26);

  const masVendidos = [...productos].sort((a, b) => b.ventas - a.ventas).slice(0, 6);
  const maxVentas = masVendidos[0].ventas;

  const bajoStock = productos
    .map((p) => ({ producto: p, stock: stockTotal(p) }))
    .filter((x) => x.stock <= 20)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 6);

  const puntosOtorgados = historialPuntos
    .filter((m) => m.puntos > 0 && m.estado !== "cancelado")
    .reduce((t, m) => t + m.puntos, 0);

  const pendientes = pedidosDemo.filter(
    (p) => p.estado !== "entregado" && p.estado !== "cancelado",
  );

  return (
    <>
      <CabeceraModulo
        titulo="Dashboard"
        texto="Resumen de la operación de los últimos 7 días."
      />

      {/* Métricas */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metrica
          etiqueta="Ventas de la semana"
          valor={precio(totalSemana)}
          variacion={12}
          icono={Coins}
          nota="26 pedidos"
        />
        <Metrica
          etiqueta="Ticket promedio"
          valor={precio(ticket)}
          variacion={4}
          icono={ShoppingCart}
        />
        <Metrica
          etiqueta="Pedidos pendientes"
          valor={String(pendientes.length)}
          icono={Package}
          nota="Requieren atención hoy"
        />
        <Metrica
          etiqueta="Puntos otorgados"
          valor={String(puntosOtorgados)}
          variacion={-3}
          icono={Users}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        {/* Ventas por día */}
        <Panel
          titulo="Ventas por día"
          descripcion="Últimos 7 días"
          acciones={
            <Link
              href="/admin/reportes"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-naranja-600 hover:text-naranja-700"
            >
              Ver reportes
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          }
        >
          <div className="p-6">
            <div className="flex h-52 items-end gap-2.5">
              {VENTAS_SEMANA.map((d) => (
                <div key={d.dia} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-[0.65rem] font-semibold tabular-nums text-grafito">
                    {d.monto}
                  </span>
                  <div
                    className="w-full rounded-t-xl bg-gradient-to-t from-petroleo-700 to-petroleo-500 transition-all duration-700"
                    style={{ height: `${(d.monto / maxDia) * 100}%` }}
                  />
                  <span className="text-[0.68rem] font-semibold text-petroleo-800">
                    {d.dia}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        {/* Más vendidos */}
        <Panel titulo="Productos más vendidos" descripcion="Unidades acumuladas">
          <ul className="space-y-4 p-6">
            {masVendidos.map((p) => (
              <BarraDato
                key={p.slug}
                etiqueta={p.nombre}
                valor={p.ventas}
                maximo={maxVentas}
              />
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        {/* Pedidos recientes */}
        <Panel
          titulo="Pedidos recientes"
          acciones={
            <Link
              href="/admin/pedidos"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-naranja-600 hover:text-naranja-700"
            >
              Ver todos
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          }
        >
          <Tabla columnas={["Pedido", "Fecha", "Entrega", "Estado", "Total"]}>
            {pedidosDemo.map((p) => (
              <tr key={p.numero} className="transition-colors hover:bg-crema-50">
                <td className="px-5 py-3.5 font-semibold text-petroleo-900">
                  {p.numero}
                </td>
                <td className="px-5 py-3.5 text-grafito">{fechaCorta(p.fecha)}</td>
                <td className="px-5 py-3.5 text-grafito">
                  {p.entrega === "delivery" ? "Delivery" : "Recojo"}
                </td>
                <td className="px-5 py-3.5">
                  <EtiquetaEstado estado={p.estado} />
                </td>
                <td className="px-5 py-3.5 font-semibold tabular-nums text-petroleo-900">
                  {precio(p.total)}
                </td>
              </tr>
            ))}
          </Tabla>
        </Panel>

        {/* Stock bajo */}
        <Panel
          titulo="Stock bajo"
          descripcion="20 unidades o menos"
          acciones={
            <span className="inline-flex items-center gap-1.5 rounded-full bg-coral-100 px-2.5 py-1 text-[0.68rem] font-bold text-coral-500">
              <AlertTriangle className="h-3 w-3" />
              {bajoStock.length}
            </span>
          }
        >
          <ul className="divide-y divide-petroleo-700/8">
            {bajoStock.map(({ producto, stock }) => (
              <li key={producto.slug} className="flex items-center gap-3 px-6 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-petroleo-900">
                    {producto.nombre}
                  </p>
                  <p className="text-xs text-grafito">
                    Desde {precio(precioDesde(producto))}
                  </p>
                </div>
                <span
                  className={
                    stock <= 10
                      ? "rounded-full bg-coral-100 px-2.5 py-1 text-xs font-bold text-coral-500"
                      : "rounded-full bg-ambar-100 px-2.5 py-1 text-xs font-bold text-ambar-500"
                  }
                >
                  {stock} und.
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* Estados */}
      <Panel titulo="Pedidos por estado" className="mt-6">
        <div className="grid gap-3 p-6 sm:grid-cols-3 lg:grid-cols-7">
          {(
            [
              "pendiente",
              "confirmado",
              "preparando",
              "listo",
              "en-camino",
              "entregado",
              "cancelado",
            ] as const
          ).map((estado) => (
            <div key={estado} className="rounded-2xl bg-crema-50 p-4 text-center">
              <p className="font-display text-2xl font-semibold text-petroleo-900">
                {pedidosDemo.filter((p) => p.estado === estado).length}
              </p>
              <p className="mt-0.5 text-[0.68rem] font-semibold uppercase leading-tight tracking-wide text-grafito">
                {nombreEstadoPedido[estado]}
              </p>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}
