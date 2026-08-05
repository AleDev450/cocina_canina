import type { Metadata } from "next";
import { Coins, Package, ShoppingCart, Users } from "lucide-react";
import { obtenerProductosAdmin } from "@/server/catalogo";
import { obtenerPedidos } from "@/server/pedidos";
import { canjesPorRecompensa, resumenPuntos } from "@/server/recompensas";
import { obtenerClientes } from "@/server/clientes";
import { exigirMiembro } from "@/server/sesion";
import { BarraDato, CabeceraModulo, Metrica, Panel, Tabla } from "@/components/admin/Piezas";
import { Pastilla } from "@/components/ui/Elementos";
import { precio } from "@/lib/formato";

export const metadata: Metadata = { title: "Reportes" };

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export default async function AdminReportes() {
  await exigirMiembro();

  const [pedidos, productos, puntos, canjes, clientes] = await Promise.all([
    obtenerPedidos(),
    obtenerProductosAdmin(),
    resumenPuntos(),
    canjesPorRecompensa(),
    obtenerClientes().catch(() => []),
  ]);

  const validos = pedidos.filter((p) => p.estado !== "cancelado");

  // Últimos 6 meses
  const hoy = new Date();
  const meses = Array.from({ length: 6 }, (_, i) => {
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - (5 - i), 1);
    const clave = fecha.toISOString().slice(0, 7);
    return {
      mes: MESES[fecha.getMonth()],
      monto: validos
        .filter((p) => p.fecha.slice(0, 7) === clave)
        .reduce((t, p) => t + p.total, 0),
    };
  });

  const maxMes = Math.max(1, ...meses.map((m) => m.monto));
  const totalSemestre = meses.reduce((t, m) => t + m.monto, 0);
  const ticket = validos.length
    ? Math.round(validos.reduce((t, p) => t + p.total, 0) / validos.length)
    : 0;

  const masVendidos = [...productos].sort((a, b) => b.ventas - a.ventas).slice(0, 8);
  const maxVentas = Math.max(1, masVendidos[0]?.ventas ?? 1);

  const frecuentes = [...clientes].sort((a, b) => b.gastado - a.gastado).slice(0, 6);

  const bajoStock = productos
    .map((p) => ({ p, stock: p.presentaciones.reduce((t, v) => t + v.stock, 0) }))
    .filter((x) => x.stock <= 20)
    .sort((a, b) => a.stock - b.stock);

  const maxCanjes = Math.max(1, canjes[0]?.veces ?? 1);

  return (
    <>
      <CabeceraModulo
        titulo="Reportes"
        texto="Ventas, productos, clientes y programa de puntos, calculados sobre los pedidos reales."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metrica
          etiqueta="Ventas del semestre"
          valor={precio(totalSemestre)}
          icono={Coins}
        />
        <Metrica
          etiqueta="Pedidos completados"
          valor={String(validos.length)}
          icono={ShoppingCart}
        />
        <Metrica etiqueta="Ticket promedio" valor={precio(ticket)} icono={Package} />
        <Metrica
          etiqueta="Tasa de canje de puntos"
          valor={`${puntos.tasaCanje}%`}
          icono={Users}
          nota={`${puntos.canjeados} de ${puntos.otorgados} puntos`}
        />
      </div>

      <Panel titulo="Ventas por mes" descripcion="Últimos 6 meses" className="mb-6">
        <div className="p-6">
          <div className="flex h-56 items-end gap-3">
            {meses.map((m, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-[0.68rem] font-semibold tabular-nums text-grafito">
                  {precio(m.monto)}
                </span>
                <div
                  className="w-full rounded-t-xl bg-gradient-to-t from-naranja-600 to-naranja-400 transition-all duration-700"
                  style={{ height: `${Math.max(2, (m.monto / maxMes) * 100)}%` }}
                />
                <span className="text-xs font-semibold text-petroleo-800">{m.mes}</span>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel titulo="Productos más vendidos">
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
                  tono="petroleo"
                />
              ))}
            </ul>
          )}
        </Panel>

        <Panel titulo="Clientes frecuentes">
          {frecuentes.length === 0 ? (
            <p className="p-6 text-sm text-grafito">Todavía no hay clientes.</p>
          ) : (
            <Tabla columnas={["Cliente", "Pedidos", "Total gastado"]}>
              {frecuentes.map((c) => (
                <tr key={c.id} className="transition-colors hover:bg-crema-50">
                  <td className="px-5 py-3.5 font-semibold text-petroleo-900">
                    {c.nombre}
                  </td>
                  <td className="px-5 py-3.5 tabular-nums text-grafito">{c.pedidos}</td>
                  <td className="px-5 py-3.5 font-semibold tabular-nums text-petroleo-900">
                    {precio(c.gastado)}
                  </td>
                </tr>
              ))}
            </Tabla>
          )}
        </Panel>

        <Panel titulo="Programa de puntos">
          <div className="grid gap-3 p-6 sm:grid-cols-3">
            <div className="rounded-2xl bg-crema-50 p-4 text-center">
              <p className="font-display text-3xl font-semibold text-petroleo-900">
                {puntos.otorgados}
              </p>
              <p className="text-xs text-grafito">Puntos otorgados</p>
            </div>
            <div className="rounded-2xl bg-crema-50 p-4 text-center">
              <p className="font-display text-3xl font-semibold text-petroleo-900">
                {puntos.canjeados}
              </p>
              <p className="text-xs text-grafito">Puntos canjeados</p>
            </div>
            <div className="rounded-2xl bg-crema-50 p-4 text-center">
              <p className="font-display text-3xl font-semibold text-petroleo-900">
                {puntos.tasaCanje}%
              </p>
              <p className="text-xs text-grafito">Tasa de canje</p>
            </div>
          </div>

          <div className="border-t border-petroleo-700/10 p-6">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.08em] text-petroleo-800">
              Recompensas más utilizadas
            </h3>
            {canjes.length === 0 ? (
              <p className="text-sm text-grafito">Todavía no hay canjes.</p>
            ) : (
              <ul className="space-y-4">
                {canjes.slice(0, 6).map((c) => (
                  <BarraDato
                    key={c.recompensa}
                    etiqueta={c.recompensa}
                    valor={c.veces}
                    maximo={maxCanjes}
                    tono="hoja"
                  />
                ))}
              </ul>
            )}
          </div>
        </Panel>

        <Panel titulo="Productos con poco stock" descripcion="20 unidades o menos">
          {bajoStock.length === 0 ? (
            <p className="p-6 text-sm text-grafito">Todo el catálogo tiene stock.</p>
          ) : (
            <Tabla columnas={["Producto", "Stock total", "Estado"]}>
              {bajoStock.map(({ p, stock }) => (
                <tr key={p.slug} className="transition-colors hover:bg-crema-50">
                  <td className="px-5 py-3.5 font-semibold text-petroleo-900">
                    {p.nombre}
                  </td>
                  <td className="px-5 py-3.5 tabular-nums text-grafito">{stock}</td>
                  <td className="px-5 py-3.5">
                    <Pastilla tono={stock <= 10 ? "suaveCoral" : "suaveAmbar"}>
                      {stock <= 10 ? "Crítico" : "Reponer pronto"}
                    </Pastilla>
                  </td>
                </tr>
              ))}
            </Tabla>
          )}
        </Panel>
      </div>
    </>
  );
}
