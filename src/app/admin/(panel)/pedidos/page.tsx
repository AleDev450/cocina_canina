import type { Metadata } from "next";
import { obtenerPedidos } from "@/server/pedidos";
import { exigirGrupo } from "@/server/sesion";
import { nombreEstadoPedido, flujoEstados } from "@/data/cuenta";
import { TablaPedidos } from "@/components/admin/TablaPedidos";
import { CabeceraModulo } from "@/components/admin/Piezas";

export const metadata: Metadata = { title: "Pedidos" };

export default async function AdminPedidos() {
  await exigirGrupo("Operación");
  const pedidos = await obtenerPedidos();

  return (
    <>
      <CabeceraModulo
        titulo="Pedidos"
        texto="Cambia el estado de cada pedido desde el selector. Al pasar a «Confirmado» se descuenta el stock; al pasar a «Entregado» se acreditan los puntos del cliente."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-7">
        {[...flujoEstados, "cancelado" as const].map((estado) => (
          <div
            key={estado}
            className="rounded-2xl border border-petroleo-700/10 bg-white p-4 text-center"
          >
            <p className="font-display text-2xl font-semibold text-petroleo-900">
              {pedidos.filter((p) => p.estado === estado).length}
            </p>
            <p className="mt-0.5 text-[0.66rem] font-semibold uppercase leading-tight tracking-wide text-grafito">
              {nombreEstadoPedido[estado]}
            </p>
          </div>
        ))}
      </div>

      <TablaPedidos pedidos={pedidos} />
    </>
  );
}
