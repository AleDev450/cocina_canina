import type { Metadata } from "next";
import { pedidosDemo } from "@/data/cuenta";
import { TarjetaPedido } from "@/components/cuenta/Piezas";

export const metadata: Metadata = { title: "Mis pedidos" };

export default function PaginaPedidos() {
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-petroleo-900">
        Mis pedidos
      </h2>
      <p className="mt-1.5 text-sm text-grafito">
        Historial completo con su estado de entrega. Puedes repetir cualquier pedido en
        un clic.
      </p>

      <div className="mt-6 space-y-5">
        {pedidosDemo.map((p) => (
          <TarjetaPedido key={p.numero} pedido={p} />
        ))}
      </div>
    </div>
  );
}
