import type { Metadata } from "next";
import { Ticket } from "lucide-react";
import { cuponesDemo } from "@/data/cuenta";
import { nombreTipoRecompensa } from "@/data/recompensas";
import { Pastilla } from "@/components/ui/Elementos";
import { cx, fechaCorta } from "@/lib/formato";

export const metadata: Metadata = { title: "Cupones" };

export default function PaginaCupones() {
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-petroleo-900">
        Mis cupones
      </h2>
      <p className="mt-1.5 text-sm text-grafito">
        Aplícalos en el carrito escribiendo el código antes de finalizar la compra.
      </p>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {cuponesDemo.map((c) => (
          <li
            key={c.codigo}
            className={cx(
              "relative overflow-hidden rounded-3xl border-2 border-dashed p-6",
              c.usado
                ? "border-petroleo-700/15 bg-crema-100"
                : "border-naranja-500/40 bg-white",
            )}
          >
            <span
              className={cx(
                "grid h-11 w-11 place-items-center rounded-2xl",
                c.usado ? "bg-crema-200 text-grafito" : "bg-naranja-500 text-white",
              )}
            >
              <Ticket className="h-5 w-5" />
            </span>

            <p
              className={cx(
                "mt-4 font-display text-2xl font-bold tracking-wide",
                c.usado ? "text-grafito line-through" : "text-petroleo-900",
              )}
            >
              {c.codigo}
            </p>
            <p className="mt-1 text-sm text-grafito">{c.descripcion}</p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Pastilla tono={c.usado ? "crema" : "suaveNaranja"}>
                {nombreTipoRecompensa[c.tipo]}
              </Pastilla>
              <Pastilla tono={c.usado ? "crema" : "suaveAmbar"}>
                {c.usado ? "Ya utilizado" : `Vence ${fechaCorta(c.vence)}`}
              </Pastilla>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
