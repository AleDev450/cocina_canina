import type { Metadata } from "next";
import { misPedidos } from "@/server/pedidos";
import { TarjetaPedido } from "@/components/cuenta/Piezas";
import { Boton } from "@/components/ui/Boton";

export const metadata: Metadata = { title: "Mis pedidos" };

export default async function PaginaPedidos() {
  const pedidos = await misPedidos();

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-petroleo-900">
        Mis pedidos
      </h2>
      <p className="mt-1.5 text-sm text-grafito">
        Historial completo con su estado de entrega. Puedes repetir cualquier pedido en
        un clic.
      </p>

      {pedidos.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-petroleo-700/10 bg-white p-10 text-center">
          <p className="text-sm text-grafito">
            Todavía no hiciste ningún pedido.
          </p>
          <Boton href="/productos" variante="primario" medida="md" className="mt-5">
            Ver el catálogo
          </Boton>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {pedidos.map((p) => (
            <TarjetaPedido key={p.id} pedido={p} />
          ))}
        </div>
      )}
    </div>
  );
}
