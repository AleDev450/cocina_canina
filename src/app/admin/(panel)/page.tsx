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
import { obtenerProductosAdmin } from "@/server/catalogo";
import { resumenOperacion } from "@/server/pedidos";
import { resumenPuntos } from "@/server/recompensas";
import { obtenerClientes } from "@/server/clientes";
import { exigirMiembro } from "@/server/sesion";
import { nombreEstadoPedido } from "@/data/cuenta";
import { BarraDato, CabeceraModulo, Metrica, Panel, Tabla } from "@/components/admin/Piezas";
import { EtiquetaEstado } from "@/components/cuenta/Piezas";
import { fechaCorta, precio } from "@/lib/formato";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardAdmin() {
  await exigirMiembro();

  const [operacion, productos, puntos, clientes] = await Promise.all([
    resumenOperacion(),
    obtenerProductosAdmin(),
    resumenPuntos(),
    obtenerClientes().catch(() => []),
  ]);

  const maxDia = Math.max(1, ...operacion.dias.map((d) => d.monto));

  const masVendidos = [...productos].sort((a, b) => b.ventas - a.ventas).slice(0, 6);
  const maxVentas = Math.max(1, masVendidos[0]?.ventas ?? 1);

  const bajoStock = productos
    .map((p) => ({
      producto: p,
      stock: p.presentaciones.reduce((t, v) => t + v.stock, 0),
      desde: p.presentaciones.length
        ? Math.min(...p.presentaciones.map((v) => v.precio))
        : 0,
    }))
    .filter((x) => x.stock <= 20)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 6);

  const recientes = operacion.pedidos.slice(0, 6);

  return (
    <>
      <CabeceraModulo
        titulo="Dashboard"
        texto="Resumen de la operación de los últimos 7 días."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metrica
          etiqueta="Ventas de la semana"
          valor={precio(operacion.ventasSemana)}
          icono={Coins}
          nota={`${operacion.dias.reduce((t, d) => t + (d.monto > 0 ? 1 : 0), 0)} días con ventas`}
        />
        <Metrica
          etiqueta="Ticket promedio"
          valor={precio(operacion.ticket)}
          icono={ShoppingCart}
        />
        <Metrica
          etiqueta="Pedidos pendientes"
          valor={String(operacion.pendientes.length)}
          icono={Package}
          nota="Requieren atención"
        />
        <Metrica
          etiqueta="Clientes registrados"
          valor={String(clientes.length)}
          icono={Users}
          nota={`${puntos.otorgados} puntos otorgados`}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
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
              {operacion.dias.map((d, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-[0.65rem] font-semibold tabular-nums text-grafito">
                    {d.monto}
                  </span>
                  <div
                    className="w-full rounded-t-xl bg-gradient-to-t from-petroleo-700 to-petroleo-500 transition-all duration-700"
                    style={{ height: `${Math.max(2, (d.monto / maxDia) * 100)}%` }}
                  />
                  <span className="text-[0.68rem] font-semibold capitalize text-petroleo-800">
                    {d.dia}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel titulo="Productos más vendidos" descripcion="Unidades acumuladas">
          {masVendidos.length === 0 ? (
            <p className="p-6 text-sm text-grafito">Todavía no hay ventas.</p>
          ) : (
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
          )}
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
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
          {recientes.length === 0 ? (
            <p className="p-6 text-sm text-grafito">
              Todavía no hay pedidos. Aparecerán aquí en cuanto entre el primero.
            </p>
          ) : (
            <Tabla columnas={["Pedido", "Cliente", "Fecha", "Estado", "Total"]}>
              {recientes.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-crema-50">
                  <td className="px-5 py-3.5 font-semibold text-petroleo-900">
                    {p.numero}
                  </td>
                  <td className="px-5 py-3.5 text-grafito">{p.cliente}</td>
                  <td className="px-5 py-3.5 text-grafito">{fechaCorta(p.fecha)}</td>
                  <td className="px-5 py-3.5">
                    <EtiquetaEstado estado={p.estado} />
                  </td>
                  <td className="px-5 py-3.5 font-semibold tabular-nums text-petroleo-900">
                    {precio(p.total)}
                  </td>
                </tr>
              ))}
            </Tabla>
          )}
        </Panel>

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
          {bajoStock.length === 0 ? (
            <p className="p-6 text-sm text-grafito">Todo el catálogo tiene stock.</p>
          ) : (
            <ul className="divide-y divide-petroleo-700/8">
              {bajoStock.map(({ producto, stock, desde }) => (
                <li key={producto.slug} className="flex items-center gap-3 px-6 py-3.5">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/productos/${producto.slug}`}
                      className="block truncate text-sm font-semibold text-petroleo-900 hover:text-naranja-600"
                    >
                      {producto.nombre}
                    </Link>
                    <p className="text-xs text-grafito">Desde {precio(desde)}</p>
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
          )}
        </Panel>
      </div>

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
                {operacion.pedidos.filter((p) => p.estado === estado).length}
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
