import type { Metadata } from "next";
import { Ticket } from "lucide-react";
import { misCupones } from "@/server/clientes";
import { nombreTipoRecompensa } from "@/data/recompensas";
import { Pastilla } from "@/components/ui/Elementos";
import { fechaCorta } from "@/lib/formato";

export const metadata: Metadata = { title: "Cupones" };

export default async function PaginaCupones() {
  const cupones = await misCupones();

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-petroleo-900">
        Mis cupones
      </h2>
      <p className="mt-1.5 text-sm text-grafito">
        Aplícalos en el carrito escribiendo el código antes de finalizar la compra.
      </p>

      {cupones.length === 0 ? (
        <p className="mt-6 rounded-3xl border border-petroleo-700/10 bg-white p-10 text-center text-sm text-grafito">
          Todavía no hay cupones disponibles. Te avisaremos cuando lancemos una campaña.
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {cupones.map((c) => (
            <li
              key={c.codigo}
              className="relative overflow-hidden rounded-3xl border-2 border-dashed border-naranja-500/40 bg-white p-6"
            >
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-naranja-500 text-white">
                <Ticket className="h-5 w-5" />
              </span>

              <p className="mt-4 font-display text-2xl font-bold tracking-wide text-petroleo-900">
                {c.codigo}
              </p>
              <p className="mt-1 text-sm text-grafito">{c.descripcion}</p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Pastilla tono="suaveNaranja">
                  {nombreTipoRecompensa[c.tipo] ?? c.tipo}
                </Pastilla>
                {c.vence ? (
                  <Pastilla tono="suaveAmbar">Vence {fechaCorta(c.vence)}</Pastilla>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
